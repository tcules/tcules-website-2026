#!/usr/bin/env node
/**
 * plans-copy — rewrite the "Three ways to work with us" band (dynamic-zone block
 * `shared.engagement-options` with `presentation: "plans"`) to the priced-plans copy, on every
 * published entry that carries it. Every other block in the zone is preserved.
 *
 *   node scripts/cms/plans-copy.mjs                      dry run (default): GET only, snapshot, diff, assert
 *   node scripts/cms/plans-copy.mjs --only api::home.home
 *   node scripts/cms/plans-copy.mjs --only api::service.service:<documentId>
 *   node scripts/cms/plans-copy.mjs --write --status=published [--allow-draft-drift]
 *   node scripts/cms/plans-copy.mjs --verify <snapshotDir>           GET only: published = snapshot + new plans
 *   node scripts/cms/plans-copy.mjs --restore <snapshotDir> --status=published
 *
 * Env (.env.local): NEW_CMS_GRAPHQL_URL (BASE = it minus /graphql), NEW_CMS_WRITE_TOKEN.
 *
 * Strapi 5 REST replaces a whole dynamic zone on PUT, so the script reads the zone deep-populated
 * from the schema (every component the zone allows, recursively; relations → documentId; media →
 * id), proves the read is complete (every schema attribute of every component instance is present
 * in the response — an unpopulated relation or component would otherwise be silently dropped), and
 * sends the zone field only. Component ids are NOT sent: in Strapi 5 the draft and published
 * versions hold separate component rows, so a published component id is not one the draft owns;
 * every component is re-created from its content instead, which is the same content in new rows.
 *
 * Writes are refused unless --write or --restore is given; the HTTP helper throws on any non-GET
 * otherwise.
 */
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

// ─── args & env ────────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name) => {
  const eq = argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : undefined;
};

const MODE = flag('--write') ? 'write' : opt('--restore') ? 'restore' : opt('--verify') ? 'verify' : 'dry-run';
const STATUS = opt('--status');
const ONLY = opt('--only');
const ALLOW_DRAFT_DRIFT = flag('--allow-draft-drift');
const SNAP_ROOT =
  opt('--snapshots') ??
  '/private/tmp/claude-501/-Users-devagya-tcules-website-2026/6647b009-7843-4a4b-b701-6ed8cf6b03e4/scratchpad/plans-snapshots';

if ((MODE === 'write' || MODE === 'restore') && !['draft', 'published'].includes(STATUS)) {
  die('--write and --restore need --status=draft|published');
}

loadEnvLocal();
const GQL = process.env.NEW_CMS_GRAPHQL_URL;
const TOKEN = process.env.NEW_CMS_WRITE_TOKEN;
if (!GQL || !TOKEN) die('NEW_CMS_GRAPHQL_URL and NEW_CMS_WRITE_TOKEN must be set (.env.local)');
const BASE = GQL.replace(/\/graphql\/?$/, '');
const WRITES_ALLOWED = MODE === 'write' || MODE === 'restore';

const ZONE_BLOCK = 'shared.engagement-options';

// ─── the new copy (PRICED_PLANS, src/content/sources/overhaul/studio-shared.ts) ─────────────────
// Non-breaking hyphens (U+2011) are kept exactly as the fixture writes them.
const NB = '‑';
const NEW_COPY = {
  heading: "Start small. Grow when you're sure.",
  options: [
    {
      eyebrow: 'Pilot project',
      title: 'From $500',
      body: 'One real piece of your product, designed for a fixed price.',
      checklist: [
        `Starts with a <u>free one${NB}day review</u>`,
        'Stop after the review and owe nothing',
        'Fixed price, agreed up front',
        'The designs are yours to keep',
      ],
      action: 'Book a free product review',
      focused: true,
    },
    {
      eyebrow: 'Dedicated design team',
      title: 'From $2,500 a month',
      body: 'A senior product designer working in your team.',
      checklist: [
        `Part${NB}time or full${NB}time, starting within a week`,
        `UX research, design engineering or front${NB}end when needed`,
        "Scale up or down on a week's notice",
        'Pause any time; billing pauses too',
        'Usually the same senior product designer throughout',
      ],
      action: 'Add design capacity',
      focused: false,
    },
    {
      eyebrow: 'Project',
      title: 'Quoted per project',
      body: 'A first release, a redesign or a design system.',
      checklist: [
        'Taken from start to finish',
        `Design only, or design${NB}led development`,
        'Scope, price and dates agreed before we start',
        "Designers stay until it's live",
      ],
      action: 'Ask for a quote',
      focused: false,
    },
  ],
  closingHeading:
    'A senior product designer leads every option, and what we make is yours once paid for.',
  closingAction: { name: 'How we work with clients', href: '/how-we-work' },
};

// ─── HTTP (GET-only unless a write mode was asked for) ──────────────────────────────────────────
async function http(method, url, body) {
  if (method !== 'GET' && !WRITES_ALLOWED) throw new Error(`refused ${method} ${url}: not in a write mode`);
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${url} → ${res.status}: ${text.slice(0, 2000)}`);
  return text ? JSON.parse(text) : null;
}
const get = (p) => http('GET', `${BASE}${p}`);

// ─── schema ────────────────────────────────────────────────────────────────────────────────────
const schema = { types: new Map(), comps: new Map() };
async function loadSchema() {
  const [cts, comps] = await Promise.all([
    get('/api/content-type-builder/content-types'),
    get('/api/content-type-builder/components'),
  ]);
  for (const c of cts.data) schema.types.set(c.uid, c.schema);
  for (const c of comps.data) schema.comps.set(c.uid, c.schema.attributes);
}

/** Every api:: content type whose dynamic zone allows the block: [{ uid, kind, zone, path, i18n }]. */
function targets() {
  const out = [];
  for (const [uid, s] of schema.types) {
    if (!uid.startsWith('api::')) continue;
    for (const [field, a] of Object.entries(s.attributes)) {
      if (a.type === 'dynamiczone' && a.components.includes(ZONE_BLOCK)) {
        const localized = !!s.pluginOptions?.i18n?.localized;
        out.push({
          uid,
          kind: s.kind,
          zone: field,
          zoneComponents: a.components,
          path: s.kind === 'singleType' ? s.singularName : s.pluralName,
          localized,
          draftAndPublish: !!s.options?.draftAndPublish || !!s.draftAndPublish,
        });
      }
    }
  }
  return out;
}

// ─── populate: built from the schema, recursively ──────────────────────────────────────────────
/** Populate object for one component's attributes, or `true` when it needs nothing nested. */
function componentPopulate(uid, stack = []) {
  if (stack.includes(uid)) throw new Error(`component cycle: ${[...stack, uid].join(' → ')}`);
  const attrs = schema.comps.get(uid);
  if (!attrs) throw new Error(`unknown component ${uid}`);
  const pop = {};
  for (const [k, a] of Object.entries(attrs)) {
    if (a.type === 'component') pop[k] = componentPopulate(a.component, [...stack, uid]);
    else if (a.type === 'relation' || a.type === 'media') pop[k] = true;
    else if (a.type === 'dynamiczone') throw new Error('dynamic zone inside a component is not expected');
  }
  return Object.keys(pop).length ? { populate: pop } : true;
}
function zonePopulate(t, components = t.zoneComponents) {
  const on = {};
  for (const c of components) on[c] = componentPopulate(c) === true ? { populate: '*' } : componentPopulate(c);
  return { [t.zone]: { on } };
}
/** Every non-zone field that needs populating (hero, media, relations), for the draft-drift check. */
function restPopulate(t) {
  const pop = {};
  for (const [k, a] of Object.entries(schema.types.get(t.uid).attributes)) {
    if (k === t.zone) continue;
    if (a.type === 'component') pop[k] = componentPopulate(a.component);
    else if (a.type === 'relation' || a.type === 'media') pop[k] = true;
    else if (a.type === 'dynamiczone') pop[k] = { on: Object.fromEntries(a.components.map((c) => [c, componentPopulate(c) === true ? { populate: '*' } : componentPopulate(c)])) };
  }
  return pop;
}
/** qs-style bracket encoding, no dependency. */
function encode(obj, prefix = '') {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v && typeof v === 'object') parts.push(...encode(v, key));
    else parts.push(`${encodeURIComponent(key).replace(/%5B/g, '[').replace(/%5D/g, ']')}=${encodeURIComponent(String(v))}`);
  }
  return parts;
}

// ─── read ──────────────────────────────────────────────────────────────────────────────────────
async function listDocuments(t) {
  if (t.kind === 'singleType') return [{ documentId: null }];
  const docs = [];
  for (let page = 1; ; page++) {
    const r = await get(
      `/api/${t.path}?status=published&fields[0]=slug&fields[1]=documentId&pagination[page]=${page}&pagination[pageSize]=100`,
    );
    docs.push(...r.data.map((d) => ({ documentId: d.documentId, slug: d.slug })));
    if (page >= r.meta.pagination.pageCount) break;
  }
  return docs;
}
function entryUrl(t, documentId) {
  return `/api/${t.path}${documentId ? `/${documentId}` : ''}`;
}
/**
 * The entry with its zone deep-populated. A zone allowing many components makes one populate URL
 * too long for the server (431), so the zone is read in groups of components, each request
 * populating its group's fragments, and each block is taken from the request that populated it.
 * Every block in the skeleton must be found in exactly one group read.
 */
const URL_BUDGET = 6000;
async function readEntry(t, documentId, status) {
  const groups = [];
  let cur = [];
  for (const c of t.zoneComponents) {
    const next = [...cur, c];
    if (cur.length && encode({ populate: zonePopulate(t, next) }).join('&').length > URL_BUDGET) {
      groups.push(cur);
      cur = [c];
    } else cur = next;
  }
  if (cur.length) groups.push(cur);
  const fetchQ = async (q) => {
    try {
      return (await get(`${entryUrl(t, documentId)}?${[...q, `status=${status}`].join('&')}`)).data;
    } catch (e) {
      if (/→ 404/.test(e.message)) return null;
      throw e;
    }
  };
  const reads = [];
  for (const g of groups) reads.push({ g, data: await fetchQ(encode({ populate: zonePopulate(t, g) })) });
  if (reads.some((r) => r.data == null)) {
    if (reads.every((r) => r.data == null)) return null;
    throw new Error(`${t.uid} ${documentId}: entry vanished between reads`);
  }
  // A read with `on` returns only its group's blocks, so the order comes from a skeleton read of the
  // whole zone (every block, scalars only); each block is then filled from its group by
  // (__component, id).
  const skeleton = await fetchQ([`populate[${t.zone}]=true`]);
  const byKey = new Map();
  for (const r of reads) for (const blk of r.data[t.zone] ?? []) byKey.set(`${blk.__component}#${blk.id}`, blk);
  const entry = { ...skeleton };
  entry[t.zone] = (skeleton[t.zone] ?? []).map((blk) => {
    const full = byKey.get(`${blk.__component}#${blk.id}`);
    if (!full) throw new Error(`${t.uid} ${documentId}: block ${blk.__component}#${blk.id} missing from the group reads`);
    return full;
  });
  if (byKey.size !== entry[t.zone].length) throw new Error(`${t.uid} ${documentId}: group reads hold ${byKey.size} blocks, skeleton ${entry[t.zone].length}`);
  // The rest of the entry populated too, so the draft-drift check sees the hero, media and relations.
  const rest = restPopulate(t);
  if (Object.keys(rest).length) {
    const r = await fetchQ(encode({ populate: rest }));
    for (const k of Object.keys(rest)) entry[k] = r?.[k] ?? null;
  }
  return entry;
}

// ─── completeness: every schema attribute is present on every instance ─────────────────────────
function assertComplete(uid, node, where, problems) {
  if (node == null) return;
  const attrs = schema.comps.get(uid);
  for (const [k, a] of Object.entries(attrs)) {
    if (!(k in node)) {
      problems.push(`${where}.${k} (${a.type}) missing from the response — not populated, would be lost`);
      continue;
    }
    const v = node[k];
    if (a.type === 'component') {
      if (a.repeatable) (v ?? []).forEach((c, i) => assertComplete(a.component, c, `${where}.${k}[${i}]`, problems));
      else assertComplete(a.component, v, `${where}.${k}`, problems);
    }
    if (a.type === 'relation' && v) {
      for (const r of Array.isArray(v) ? v : [v]) if (!r.documentId) problems.push(`${where}.${k}: relation without documentId`);
    }
    if (a.type === 'media' && v) {
      for (const m of Array.isArray(v) ? v : [v]) if (typeof m.id !== 'number') problems.push(`${where}.${k}: media without id`);
    }
  }
  const extra = Object.keys(node).filter((k) => !(k in attrs) && k !== 'id' && k !== '__component');
  if (extra.length) problems.push(`${where}: unexpected keys ${extra.join(', ')}`);
}

// ─── serialise: response shape → write shape (schema-driven) ───────────────────────────────────
function toWrite(uid, node) {
  if (node == null) return null;
  const attrs = schema.comps.get(uid);
  const out = {};
  for (const [k, a] of Object.entries(attrs)) {
    const v = node[k];
    if (a.type === 'component') {
      out[k] = a.repeatable ? (v ?? []).map((c) => toWrite(a.component, c)) : toWrite(a.component, v);
    } else if (a.type === 'relation') {
      // Strapi 5 accepts documentIds; `set` replaces and keeps the given order. An empty relation is
      // omitted: the component is created fresh, so leaving it out leaves it empty.
      const ids = v == null ? [] : (Array.isArray(v) ? v : [v]).map((r) => r.documentId);
      if (ids.length) out[k] = { set: ids };
    } else if (a.type === 'media') {
      out[k] = v == null ? null : Array.isArray(v) ? v.map((m) => m.id) : v.id;
    } else {
      out[k] = v === undefined ? null : v;
    }
  }
  return out;
}
const blockToWrite = (block) => ({ __component: block.__component, ...toWrite(block.__component, block) });

/**
 * Independent normaliser of the RAW response (not schema-driven): drops `id`, reduces anything
 * holding a documentId to it, anything that looks like a media file (`mime`/`url`+`hash`) to its id.
 * The round-trip check compares this with the inverse of the write shape, so a field the
 * serialiser forgets, mangles or invents fails loudly.
 */
function normRaw(v) {
  if (Array.isArray(v)) return v.map(normRaw);
  if (v && typeof v === 'object') {
    if ('mime' in v && 'hash' in v) return { $media: v.id };
    if ('documentId' in v) return { $rel: v.documentId };
    const o = {};
    for (const [k, x] of Object.entries(v)) if (k !== 'id') o[k] = normRaw(x);
    return o;
  }
  return v;
}
/** Write shape → the same normal form, schema-driven (the inverse of toWrite). */
function normWrite(uid, node) {
  if (node == null) return null;
  const attrs = schema.comps.get(uid);
  const o = {};
  for (const [k, a] of Object.entries(attrs)) {
    const v = node[k];
    if (a.type === 'component') o[k] = a.repeatable ? v.map((c) => normWrite(a.component, c)) : normWrite(a.component, v);
    else if (a.type === 'relation') {
      const many = /ToMany$|^manyWay$/.test(a.relation);
      const ids = v?.set ?? [];
      o[k] = many ? ids.map((d) => ({ $rel: d })) : ids.length ? { $rel: ids[0] } : null;
    } else if (a.type === 'media') o[k] = v == null ? null : Array.isArray(v) ? v.map((m) => ({ $media: m })) : { $media: v };
    else o[k] = v;
  }
  return o;
}
function roundTrip(block) {
  const written = blockToWrite(block);
  const back = { __component: written.__component, ...normWrite(written.__component, written) };
  const raw = normRaw(block);
  if (!isDeepStrictEqual(back, raw)) return firstDiff(raw, back, block.__component);
  if (JSON.stringify(written).includes('"id":')) return `${block.__component}: write shape still carries an id`;
  return null;
}
function firstDiff(a, b, p) {
  if (isDeepStrictEqual(a, b)) return null;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const d = firstDiff(a[k], b[k], `${p}.${k}`);
      if (d) return d;
    }
  }
  return `${p}: snapshot ${JSON.stringify(a)?.slice(0, 200)} ≠ re-serialised ${JSON.stringify(b)?.slice(0, 200)}`;
}

// ─── the rewrite ───────────────────────────────────────────────────────────────────────────────
const isPlans = (b) => b.__component === ZONE_BLOCK && b.presentation === 'plans';
const pointsToEnquiry = (href) => typeof href === 'string' && /enquir/i.test(href);

/**
 * A button with the new label and href. What is not copy — its icon, scene, external flag and
 * expertise link — is carried from the button it replaces; the old description (copy for the old
 * label) is not, and the dry run notes it when there was one.
 */
function cta(name, href, old, notes, where) {
  if (old?.description) notes.push(`${where}: old button description dropped: ${trim(old.description)}`);
  const b = { name, href, description: null, icon: old?.icon ?? null, isExternal: false, scene: old?.scene ?? null };
  if (old?.expertise?.documentId) b.expertise = { set: [old.expertise.documentId] };
  return b;
}

/**
 * Which old option each new plan replaces, by meaning rather than position (the old band ran
 * pilot · defined project · ongoing partnership; the new one runs pilot · dedicated team · project).
 * Falls back to position when the old titles say nothing.
 */
const MATCH = [/pilot/i, /ongoing|partner|dedicated|team|capacity|retainer/i, /defined|project|quote/i];
function matchOld(old) {
  const taken = new Set();
  return MATCH.map((re, i) => {
    let j = old.findIndex((o, k) => !taken.has(k) && re.test(`${o.title} ${o.eyebrow ?? ''}`) && !(i === 2 && /pilot/i.test(o.title)));
    if (j < 0) j = taken.has(i) || !old[i] ? old.findIndex((_, k) => !taken.has(k)) : i;
    if (j >= 0) taken.add(j);
    return j >= 0 ? j : null;
  });
}

/** Returns { block (write shape), notes[], blockers[] }. */
function rewritePlans(block) {
  const notes = [];
  const blockers = [];
  const w = blockToWrite(block);
  w.heading = NEW_COPY.heading;
  const old = block.options ?? [];
  if (old.length !== 3) notes.push(`had ${old.length} options (new copy has 3)`);
  const matched = matchOld(old);
  notes.push(`old → new: ${matched.map((j, i) => `${j == null ? '(none)' : `"${old[j].title}"`} → ${NEW_COPY.options[i].eyebrow}`).join('; ')}`);
  w.options = NEW_COPY.options.map((n, i) => {
    const o = matched[i] == null ? null : old[matched[i]];
    const oldHref = o?.action?.href;
    const href = pointsToEnquiry(oldHref) ? oldHref : '#enquiry';
    notes.push(`plan ${i + 1} href: ${oldHref ?? '(none)'} → ${href}`);
    const carried = o ? toWrite('content.engagement-option', o) : null;
    if (o) {
      const kept = ['icon', 'scope', 'anchorId'].filter((k) => o[k] != null).map((k) => `${k}=${o[k]}`);
      if (o.illustration) kept.push('illustration');
      if (o.action?.icon) kept.push(`button icon=${o.action.icon}`);
      if (o.action?.scene) kept.push(`button scene=${o.action.scene}`);
      if (kept.length) notes.push(`plan ${i + 1} keeps: ${kept.join(', ')}`);
      if (o.facts?.length) notes.push(`plan ${i + 1} drops facts×${o.facts.length} (the new copy has none)`);
    }
    return {
      title: n.title,
      focused: n.focused,
      body: n.body,
      // Not copy, so kept from the option this plan replaces.
      illustration: carried?.illustration ?? null,
      icon: carried?.icon ?? null,
      scope: carried?.scope ?? null,
      anchorId: carried?.anchorId ?? null,
      eyebrow: n.eyebrow,
      facts: [],
      checklist: n.checklist.map((body) => ({ body })),
      action: cta(n.action, href, o?.action, notes, `plan ${i + 1}`),
    };
  });
  // One sentence and one link on every entry, how-we-work-master included (owner, 19 Nov 2026).
  const closingAction = NEW_COPY.closingAction;
  const oc = block.closing;
  if (!oc) notes.push('had no closing');
  else notes.push(`closing body: ${oc.body ? 'yes' : 'no'}, proof: ${oc.proof ? `yes (case study ${oc.proof.card?.caseStudy?.documentId ?? '?'})` : 'no'}, old actions: ${JSON.stringify((oc.actions ?? []).map((a) => `${a.name} → ${a.href}`))}`);
  if (oc?.body) notes.push(`closing body removed: ${trim(oc.body)}`);
  w.closing = {
    heading: NEW_COPY.closingHeading,
    // PLACEHOLDER: "." until Mihir makes content.engagement-closing.body optional. The plans design
    // has no closing body and the front end does not render it (owner, 19 Nov 2026), but the schema
    // still requires one, so an empty body could not publish.
    body: CLOSING_BODY_PLACEHOLDER,
    proof: oc ? toWrite('content.case-study-teaser', oc.proof) : null,
    actions: [cta(closingAction.name, closingAction.href, oc?.actions?.[0], notes, 'closing')],
  };
  return { block: w, notes, blockers };
}

// ─── compact diff of the plans block ───────────────────────────────────────────────────────────
function summarisePlans(b, write = false) {
  const opt = (o) =>
    `      ${o.focused ? '★' : '·'} [${o.eyebrow ?? '—'}] ${o.title} | ${trim(o.body)} | ✓×${(o.checklist ?? []).length} | ${o.action ? `${o.action.name} → ${o.action.href}` : '(no action)'}`;
  const c = b.closing;
  return [
    `    heading: ${b.heading}`,
    ...(b.options ?? []).map(opt),
    `    closing: ${c ? `${trim(c.heading)} | body ${c.body ? 'yes' : 'no'} | proof ${c.proof ? 'yes' : 'no'} | ${(c.actions ?? []).map((a) => `${a.name} → ${a.href}`).join('; ')}` : '(none)'}`,
  ].join('\n');
}
const trim = (s, n = 60) => (s == null ? '—' : String(s).replace(/\s+/g, ' ').slice(0, n) + (String(s).length > n ? '…' : ''));

// ─── modes ─────────────────────────────────────────────────────────────────────────────────────
const stamp = new Date().toISOString().replace(/[:]/g, '').replace(/\..*/, '').replace('T', '_');
const snapName = (uid, documentId) => `${uid.replace(/[:/]/g, '_')}__${documentId ?? 'single'}.json`;

async function collect() {
  const found = [];
  for (const t of targets()) {
    const [, onlyUid, onlyDoc] = ONLY ? (ONLY.match(/^(api::[^:]+)(?::(.+))?$/) ?? die(`bad --only ${ONLY}`)) : [];
    if (ONLY && t.uid !== onlyUid) continue;
    for (const d of await listDocuments(t)) {
      if (onlyDoc && d.documentId !== onlyDoc) continue;
      const published = await readEntry(t, d.documentId, 'published');
      if (!published) continue;
      const zone = published[t.zone] ?? [];
      if (!zone.some(isPlans)) continue;
      found.push({ t, documentId: d.documentId, slug: published.slug ?? d.slug ?? '(single)', published });
    }
  }
  return found;
}

const CLOSING_BODY_PLACEHOLDER = '.';

/**
 * Info only: whether content.engagement-closing.body is still required. While it is, the closing
 * body is written as the "." placeholder; once Mihir makes it optional, the placeholder can become
 * null and this line says so.
 */
async function closingBodyPreflight() {
  const c = await get('/api/content-type-builder/components/content.engagement-closing');
  const body = c.data?.schema?.attributes?.body ?? c.data?.attributes?.body;
  if (!body) return 'could not read content.engagement-closing.body from the content-type builder';
  if (body.required || (body.minLength ?? 0) > 0)
    return `content.engagement-closing.body is still required (required: ${!!body.required}, minLength: ${body.minLength ?? 0}), so the closing body is written as the "${CLOSING_BODY_PLACEHOLDER}" placeholder.`;
  return `content.engagement-closing.body is optional now; the "${CLOSING_BODY_PLACEHOLDER}" placeholder can be replaced with null.`;
}

async function dryRunOrWrite() {
  await loadSchema();
  const closingBodyInfo = await closingBodyPreflight();
  const ts = targets();
  for (const t of ts) if (t.localized) die(`${t.uid} is localized — this script handles non-i18n types only; add locale handling first`);
  const found = await collect();
  const dir = path.join(SNAP_ROOT, stamp);
  fs.mkdirSync(dir, { recursive: true });

  let failures = 0;
  const byType = new Map();
  const plans = [];
  for (const e of found) {
    const { t, documentId, published } = e;
    const zone = published[t.zone];
    const draft = await readEntry(t, documentId, 'draft');
    fs.writeFileSync(
      path.join(dir, snapName(t.uid, documentId)),
      JSON.stringify({ uid: t.uid, kind: t.kind, path: t.path, zone: t.zone, documentId, slug: e.slug, takenAt: new Date().toISOString(), published, draft }, null, 2),
    );

    const problems = [];
    zone.forEach((b, i) => assertComplete(b.__component, b, `${t.zone}[${i}] ${b.__component}`, problems));
    const plansIdx = zone.map((b, i) => (isPlans(b) ? i : -1)).filter((i) => i >= 0);
    if (plansIdx.length !== 1) problems.push(`${plansIdx.length} plans blocks (expected 1)`);
    const otherEngagement = zone.filter((b) => b.__component === ZONE_BLOCK && !isPlans(b)).length;

    const body = [];
    let notes = [];
    let blockers = [];
    for (const [i, b] of zone.entries()) {
      if (isPlans(b)) {
        const r = rewritePlans(b);
        body.push(r.block);
        notes = r.notes;
        blockers = r.blockers;
      } else {
        const rt = roundTrip(b);
        if (rt) problems.push(`round-trip ${t.zone}[${i}]: ${rt}`);
        body.push(blockToWrite(b));
      }
    }
    // The untouched blocks of the body, normalised, equal the snapshot's, normalised.
    const untouchedBody = body.filter((_, i) => !plansIdx.includes(i)).map((w) => ({ __component: w.__component, ...normWrite(w.__component, w) }));
    const untouchedSnap = zone.filter((b) => !isPlans(b)).map(normRaw);
    if (!isDeepStrictEqual(untouchedBody, untouchedSnap)) problems.push('untouched blocks differ from the snapshot after normalising');
    // Draft drift: a published write publishes the draft, so the draft must equal published.
    const drift = draft ? firstDiff(normEntryRaw(published), normEntryRaw(draft), 'entry') : 'no draft version';
    if (drift) problems.push(`draft ≠ published (${drift}) — a published write would discard or publish that`);

    const key = `${t.uid}${documentId ? `:${documentId}` : ''}`;
    const tag = problems.length ? 'FAIL' : 'ok';
    if (problems.length) failures++;
    const agg = byType.get(t.uid) ?? { n: 0, ok: 0, fail: 0 };
    agg.n++;
    problems.length ? agg.fail++ : agg.ok++;
    byType.set(t.uid, agg);

    console.log(`\n── ${tag}  ${key}  (${e.slug})  zone ${zone.length} blocks, plans at [${plansIdx}], other engagement-options: ${otherEngagement}`);
    const before = zone[plansIdx[0]];
    if (before) {
      console.log('  before:\n' + summarisePlans(before));
      console.log('  after:\n' + summarisePlans(body[plansIdx[0]], true));
      for (const n of notes) console.log(`  note: ${n}`);
    }
    for (const p of problems) console.log(`  !! ${p}`);
    for (const b of blockers) console.log(`  ⛔ ${b}`);
    plans.push({ key, t, documentId, body, problems, blockers, slug: e.slug });
  }

  console.log(`\n══ ${found.length} entries with a plans block; snapshots in ${dir}`);
  for (const [uid, a] of byType) console.log(`   ${uid.padEnd(44)} ${a.n} entries, ${a.ok} ok, ${a.fail} fail`);

  console.log(`\n   info: ${closingBodyInfo}`);
  const withBlockers = plans.filter((p) => p.blockers.length);
  if (withBlockers.length) {
    console.log(`\n   ⛔ ${withBlockers.length} entr${withBlockers.length === 1 ? 'y is' : 'ies are'} blocked for a published write (content, not safety):`);
    for (const p of withBlockers) console.log(`      ${p.key} (${p.slug}): ${p.blockers.join('; ')}`);
  }
  if (MODE === 'dry-run') {
    if (failures) die(`${failures} entr${failures === 1 ? 'y' : 'ies'} failed the safety checks`);
    console.log('   dry run: nothing written.');
    return;
  }

  // ── write ──
  const blocked = plans.filter((p) => p.problems.some((x) => !/^draft ≠ published/.test(x) || !ALLOW_DRAFT_DRIFT));
  if (STATUS === 'published' && withBlockers.length) die(`refusing to publish: ${withBlockers.length} entries are blocked (see ⛔ above)`);
  if (blocked.length) die(`refusing to write: ${blocked.length} entr${blocked.length === 1 ? 'y has' : 'ies have'} failing checks (see above)`);
  for (const p of plans) {
    await http('PUT', `${BASE}${entryUrl(p.t, p.documentId)}?status=${STATUS}`, { data: { [p.t.zone]: p.body } });
    console.log(`   wrote ${p.key} (${STATUS})`);
  }
  console.log(`   done. Verify: node scripts/cms/plans-copy.mjs --verify ${dir}`);
}

/** Whole-entry normal form for draft/published comparison: drop ids, timestamps, status fields. */
function normEntryRaw(e) {
  const { id, documentId, createdAt, updatedAt, publishedAt, locale, ...rest } = e;
  return normRaw(rest);
}

async function verify(dir) {
  await loadSchema();
  let bad = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const snap = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const t = targets().find((x) => x.uid === snap.uid);
    if (ONLY && !`${snap.uid}:${snap.documentId}`.startsWith(ONLY)) continue;
    const now = await readEntry(t, snap.documentId, 'published');
    const zNow = now?.[t.zone] ?? [];
    const zWas = snap.published[t.zone];
    const problems = [];
    const othersNow = zNow.filter((b) => !isPlans(b)).map(normRaw);
    const othersWas = zWas.filter((b) => !isPlans(b)).map(normRaw);
    const d = firstDiff(othersWas, othersNow, 'other blocks');
    if (d) problems.push(d);
    if (zNow.findIndex(isPlans) !== zWas.findIndex(isPlans)) problems.push('plans block moved');
    const p = zNow.find(isPlans);
    const expected = rewritePlans(zWas.find(isPlans)).block;
    const got = p ? { __component: ZONE_BLOCK, ...normWrite(ZONE_BLOCK, blockToWrite(p)) } : null;
    const want = { __component: ZONE_BLOCK, ...normWrite(ZONE_BLOCK, expected) };
    const dp = firstDiff(want, got, 'plans');
    if (dp) problems.push(dp);
    for (const k of Object.keys(snap.published)) {
      if ([t.zone, 'id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'].includes(k)) continue;
      if (!isDeepStrictEqual(normRaw(snap.published[k]), normRaw(now?.[k]))) problems.push(`non-zone field ${k} changed`);
    }
    console.log(`${problems.length ? 'FAIL' : 'ok  '} ${snap.uid}${snap.documentId ? `:${snap.documentId}` : ''} (${snap.slug})`);
    for (const x of problems) console.log(`   !! ${x}`);
    if (problems.length) bad++;
  }
  if (bad) die(`${bad} entries did not verify`);
  console.log('all verified.');
}

async function restore(dir) {
  await loadSchema();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const snap = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (ONLY && !`${snap.uid}:${snap.documentId}`.startsWith(ONLY)) continue;
    const t = targets().find((x) => x.uid === snap.uid);
    // Restore the published content; with --status=draft, the snapshot's draft content.
    const source = STATUS === 'draft' && snap.draft ? snap.draft : snap.published;
    const zone = source[t.zone].map(blockToWrite);
    await http('PUT', `${BASE}${entryUrl(t, snap.documentId)}?status=${STATUS}`, { data: { [t.zone]: zone } });
    console.log(`restored ${snap.uid}${snap.documentId ? `:${snap.documentId}` : ''} (${STATUS})`);
  }
}

// ─── util ──────────────────────────────────────────────────────────────────────────────────────
function loadEnvLocal() {
  const f = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(f)) return;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
function die(msg) {
  console.error(`\n✖ ${msg}`);
  process.exit(1);
}

const run = { 'dry-run': dryRunOrWrite, write: dryRunOrWrite, verify: () => verify(opt('--verify')), restore: () => restore(opt('--restore')) }[MODE];
run().catch((e) => die(e.stack ?? e.message));
