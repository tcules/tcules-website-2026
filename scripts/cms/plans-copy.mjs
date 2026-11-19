#!/usr/bin/env node
/**
 * The "Start small. Grow when you're sure." copy for every published "Three ways to work with us"
 * band: each entry's `shared.engagement-options` block with presentation `plans` (owner, 19 Nov 2026).
 *
 *   node scripts/cms/plans-copy.mjs --dry-run [--snapshots=<dir>] [--only=<uid|documentId>]
 *   node scripts/cms/plans-copy.mjs --write --status=draft|published [--snapshots=<dir>] [--only=…]
 *   node scripts/cms/plans-copy.mjs --restore <snapshotDir> --status=draft|published [--only=…]
 *
 * WHY IT IS CAREFUL. Strapi 5 REST replaces a dynamic zone wholesale on PUT: every block left out of
 * the payload is deleted. So the script GETs each entry's DRAFT with the whole zone deep-populated
 * (every component type the zone allows, nested components, relations and media, derived from the
 * content-type-builder schema), saves it, and PUTs the zone back with every other block carried over
 * as it came (component ids kept, relations as documentIds, media as ids) and only the plans block's
 * copy fields replaced. An entry is refused when the read cannot be proven complete: a schema
 * attribute missing from any component in the zone (private, or not populated) would be wiped.
 *
 * Draft vs published: PUT writes the draft. `--status=published` publishes that draft, so an entry
 * whose draft already differs from its published version would publish someone's pending edits too;
 * the dry run lists those entries and --write refuses them unless --allow-pending is passed.
 *
 * The highlight boolean (`focused`, Mihir) is written only when the schema has it.
 *
 * Env: NEW_CMS_GRAPHQL_URL (Strapi base = it minus /graphql) and NEW_CMS_WRITE_TOKEN, from the
 * environment or .env.local.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

/* ── The copy (owner, 19 Nov 2026; from the overhaul fixture PRICED_PLANS) ─────────────────────── */

/** The option field Mihir is adding for the blue highlight. Written only if the schema has it. */
const FOCUS_FIELD = 'focused';

const HEADING = "Start small. Grow when you're sure.";
/* U+2011 non-breaking hyphens, as the fixture sets them, so "one‑day" never splits across lines. */
const OPTIONS = [
  {
    eyebrow: 'Pilot project',
    title: 'From $500',
    body: 'One real piece of your product, designed for a fixed price.',
    checklist: [
      'Starts with a <u>free one‑day review</u>',
      'Stop after the review and owe nothing',
      'Fixed price, agreed up front',
      'The designs are yours to keep',
    ],
    label: 'Book a free product review',
    focused: true,
  },
  {
    eyebrow: 'Dedicated design team',
    title: 'From $2,500 a month',
    body: 'A senior product designer working in your team.',
    checklist: [
      'Part‑time or full‑time, starting within a week',
      'UX research, design engineering or front‑end when needed',
      "Scale up or down on a week's notice",
      'Pause any time; billing pauses too',
      'Usually the same senior product designer throughout',
    ],
    label: 'Add design capacity',
    focused: false,
  },
  {
    eyebrow: 'Project',
    title: 'Quoted per project',
    body: 'A first release, a redesign or a design system.',
    checklist: [
      'Taken from start to finish',
      'Design only, or design‑led development',
      'Scope, price and dates agreed before we start',
      "Designers stay until it's live",
    ],
    label: 'Ask for a quote',
    focused: false,
  },
];
const CLOSING_HEADING =
  'A senior product designer leads every option, and what we make is yours once paid for.';
/* `content.engagement-closing.body` is REQUIRED in the schema (publish fails without it), but the
   plans band renders only the closing heading as its line. The body carries the same sentence so the
   entry validates; nothing shows it. If Mihir relaxes `required`, set this to null. */
const CLOSING_BODY = CLOSING_HEADING;
const CLOSING_LABEL = 'How we work with clients';
const HOW_WE_WORK = '/how-we-work';
const ENQUIRY = '#enquiry';

/* ── Arguments and environment ──────────────────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => args.find((a) => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const mode = flag('write') ? 'write' : flag('restore') ? 'restore' : 'dry-run';
const status = option('status');
const only = option('only');
const today = new Date().toISOString().slice(0, 10);
const snapshotDir = resolve(
  mode === 'restore' ? args[args.indexOf('--restore') + 1] ?? '' : option('snapshots') ?? `snapshots/plans-${today}`,
);
if ((mode === 'write' || mode === 'restore') && !['draft', 'published'].includes(status ?? '')) {
  fail('--write and --restore need --status=draft|published');
}
if (mode === 'restore' && !existsSync(snapshotDir)) fail(`no snapshot directory at ${snapshotDir}`);

function loadEnv() {
  const env = { ...process.env };
  const file = resolve('.env.local');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/u.exec(line);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/u, '$2');
    }
  }
  return env;
}
const env = loadEnv();
const BASE = env.NEW_CMS_GRAPHQL_URL?.replace(/\/graphql\/?$/u, '');
const TOKEN = env.NEW_CMS_WRITE_TOKEN;
if (!BASE || !TOKEN) fail('NEW_CMS_GRAPHQL_URL and NEW_CMS_WRITE_TOKEN are required');

function fail(message) {
  console.error(`plans-copy: ${message}`);
  process.exit(1);
}

async function api(method, path, body) {
  if (method !== 'GET' && mode === 'dry-run') throw new Error('dry run never writes');
  let response;
  /* A GET is retried on a 5xx (the host answers 502 under a burst); a write never is. */
  for (let attempt = 0; ; attempt += 1) {
    response = await fetch(`${BASE}${path}`, {
      method,
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (method !== 'GET' || response.status < 500 || attempt >= 4) break;
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
  }
  const text = await response.text();
  if (!response.ok) throw new Error(`${method} ${path.slice(0, 120)} → ${response.status} ${text.slice(0, 600)}`);
  return text ? JSON.parse(text) : null;
}

/* ── Schema → populate ──────────────────────────────────────────────────────────────────────── */

const contentTypes = (await api('GET', '/api/content-type-builder/content-types')).data;
const components = Object.fromEntries(
  (await api('GET', '/api/content-type-builder/components')).data.map((c) => [c.uid, c.schema]),
);
const optionSchema = components['content.engagement-option'];
const hasFocus = Boolean(optionSchema?.attributes?.[FOCUS_FIELD]);

/** The populate tree for one component: every nested component, relation and media. */
function componentPopulate(uid, depth = 0) {
  if (depth > 12) throw new Error(`component nesting too deep at ${uid}`);
  const populate = {};
  for (const [name, attr] of Object.entries(components[uid].attributes)) {
    if (attr.type === 'component') populate[name] = componentPopulate(attr.component, depth + 1);
    else if (attr.type === 'dynamiczone') populate[name] = zonePopulate(attr.components, depth + 1);
    else if (attr.type === 'media' || attr.type === 'relation') populate[name] = true;
  }
  return Object.keys(populate).length ? { populate } : true;
}
function zonePopulate(uids, depth = 0) {
  return { on: Object.fromEntries(uids.map((uid) => [uid, componentPopulate(uid, depth)])) };
}

/** qs-style bracket serialisation, as Strapi parses it. */
function qs(value, prefix) {
  if (value === true) return [`${prefix}=true`];
  if (Array.isArray(value)) return value.flatMap((v, i) => qs(v, `${prefix}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => qs(v, prefix ? `${prefix}[${k}]` : k));
  }
  return [`${prefix}=${encodeURIComponent(String(value))}`];
}

/** The content types whose zone allows the engagement block, with that zone's name. */
const targets = contentTypes
  .filter((t) => t.uid.startsWith('api::'))
  .flatMap((t) =>
    Object.entries(t.schema.attributes)
      .filter(([, a]) => a.type === 'dynamiczone' && a.components.includes('shared.engagement-options'))
      .map(([zone, a]) => ({
        uid: t.uid,
        kind: t.schema.kind,
        path: t.schema.kind === 'singleType' ? t.schema.singularName : t.schema.pluralName,
        zone,
        zoneComponents: a.components,
        hasSlug: Boolean(t.schema.attributes.slug),
      })),
  );

/* ── Routes, for the report and the local preview ───────────────────────────────────────────── */

const SINGLE_ROUTES = {
  'api::home.home': '/',
  'api::how-we-work-master.how-we-work-master': '/how-we-work',
  'api::service-master.service-master': '/services',
  'api::audit-master.audit-master': '/audits',
  'api::expertise-master.expertise-master': '/expertise',
  'api::about.about': '/about',
  'api::why-tcules.why-tcules': '/why-tcules',
};
function routeOf(target, entry) {
  if (SINGLE_ROUTES[target.uid]) return SINGLE_ROUTES[target.uid];
  if (target.uid === 'api::service.service') return `/services/${entry.slug}`;
  if (target.uid === 'api::expertise.expertise') return `/expertise/${entry.slug}`;
  if (target.uid === 'api::how-we-work.how-we-work') return `/how-we-work/${entry.slug}`;
  return `?${target.uid}/${entry.documentId}`;
}

/* ── Reading ────────────────────────────────────────────────────────────────────────────────── */

/* The whole zone deep-populated is too long for one URL (a 17-type zone answers 431), so the read is
   one shallow request for the zone's order and ids, then the component types in groups that fit,
   each block taken from the group that populated its type. */
const URL_BUDGET = 6000;
function populateGroups(target) {
  const groups = [];
  let current = [];
  const size = (uids) => qs({ [target.zone]: zonePopulate(uids) }, 'populate').join('&').length;
  for (const uid of target.zoneComponents) {
    if (current.length && size([...current, uid]) > URL_BUDGET) {
      groups.push(current);
      current = [];
    }
    current.push(uid);
  }
  if (current.length) groups.push(current);
  for (const g of groups) if (size(g) > URL_BUDGET * 1.5) throw new Error(`populate for ${g[0]} alone is too long`);
  return groups;
}

async function read(target, documentId, which) {
  const at = (query) =>
    target.kind === 'singleType'
      ? `/api/${target.path}?status=${which}&${query}`
      : `/api/${target.path}/${documentId}?status=${which}&${query}`;
  const shallow = (await api('GET', at(`populate[${target.zone}]=true`)))?.data ?? null;
  if (!shallow) return null;
  const full = new Map();
  for (const group of populateGroups(target)) {
    const query = qs({ [target.zone]: zonePopulate(group) }, 'populate').join('&');
    const data = (await api('GET', at(query)))?.data;
    for (const block of data?.[target.zone] ?? []) {
      if (group.includes(block.__component)) full.set(`${block.__component}#${block.id}`, block);
    }
  }
  const zone = (shallow[target.zone] ?? []).map((block) => {
    const deep = full.get(`${block.__component}#${block.id}`);
    if (!deep) throw new Error(`${target.uid} ${documentId}: block ${block.__component}#${block.id} missing from its deep read`);
    return deep;
  });
  return { ...shallow, [target.zone]: zone };
}

async function list(target) {
  if (target.kind === 'singleType') {
    const entry = await api('GET', `/api/${target.path}?status=published&populate[${target.zone}]=true`).then((r) => r?.data ?? null, (e) =>
      /→ 404/u.test(e.message) ? null : Promise.reject(e),
    );
    return entry ? [entry] : [];
  }
  const populate = `populate[${target.zone}]=true`;
  const entries = [];
  for (let page = 1; ; page += 1) {
    const result = await api(
      'GET',
      `/api/${target.path}?status=published&pagination[page]=${page}&pagination[pageSize]=100&${populate}`,
    );
    entries.push(...result.data);
    if (page >= (result.meta?.pagination?.pageCount ?? 1)) break;
  }
  return entries;
}

const isPlans = (block) =>
  block?.__component === 'shared.engagement-options' && block.presentation === 'plans';

/* ── The round trip: GET shape → PUT shape ──────────────────────────────────────────────────── */

/**
 * One component instance as Strapi 5 accepts it back. Every schema attribute must be present in the
 * read, or the write would drop it: `missing` collects the paths that are not.
 */
function toInput(uid, value, path, missing, { keepIds = true } = {}) {
  const schema = components[uid];
  const out = {};
  if (keepIds && value.id != null) out.id = value.id;
  for (const [name, attr] of Object.entries(schema.attributes)) {
    const at = `${path}.${name}`;
    if (!(name in value)) {
      missing.push(`${at}${attr.private ? ' (private)' : ''}`);
      continue;
    }
    const v = value[name];
    switch (attr.type) {
      case 'component':
        out[name] = attr.repeatable
          ? (v ?? []).map((item, i) => toInput(attr.component, item, `${at}[${i}]`, missing, { keepIds }))
          : v
            ? toInput(attr.component, v, at, missing, { keepIds })
            : null;
        break;
      case 'dynamiczone':
        out[name] = (v ?? []).map((item, i) => ({
          __component: item.__component,
          ...toInput(item.__component, item, `${at}[${i}]`, missing, { keepIds }),
        }));
        break;
      case 'media':
        out[name] = attr.multiple ? (v ?? []).map((m) => m.id) : (v?.id ?? null);
        break;
      case 'relation': {
        const many = /ToMany$/u.test(attr.relation);
        const ids = (many ? (v ?? []) : v ? [v] : []).map((r) => r.documentId);
        out[name] = { set: ids };
        break;
      }
      default:
        out[name] = v;
    }
  }
  return out;
}

function zoneToInput(target, zone, missing, opts) {
  return (zone ?? []).map((block, i) => ({
    __component: block.__component,
    ...toInput(block.__component, block, `${target.zone}[${i}]<${block.__component}>`, missing, opts),
  }));
}

/** Strip ids and timestamps so draft and published (separate rows) compare on content alone. */
function contentOnly(value) {
  if (Array.isArray(value)) return value.map(contentOnly);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !['id', 'createdAt', 'updatedAt', 'publishedAt', 'locale'].includes(k))
        .map(([k, v]) => [k, contentOnly(v)]),
    );
  }
  return value;
}

/* ── The new plans block ────────────────────────────────────────────────────────────────────── */

/** Where an option's button goes: today's href when it points at the enquiry, else #enquiry. */
function actionHref(current) {
  return current && /^#enquiry\b/u.test(current) ? current : ENQUIRY;
}

/* On /how-we-work the link goes to the page's own terms band. The fixture says `#terms`; the live
   band's anchorId is `essentials` ("The terms when you outsource UX design to Tcules"), so it is read
   from the zone: the engagement block whose heading starts "The terms". */
function termsAnchor(zone) {
  const terms = zone.find(
    (b) => b.__component === 'shared.engagement-options' && /^The terms\b/u.test(b.heading ?? '') && b.anchorId,
  );
  return terms ? `#${terms.anchorId}` : null;
}

function newPlansBlock(current, route, zone) {
  const closingHref = route === '/how-we-work' ? (termsAnchor(zone) ?? HOW_WE_WORK) : HOW_WE_WORK;
  return {
    __component: 'shared.engagement-options',
    id: current.id,
    heading: HEADING,
    description: null,
    presentation: 'plans',
    anchorId: current.anchorId ?? null,
    surface: current.surface ?? null,
    mediaSide: current.mediaSide ?? null,
    action: null,
    terms: [],
    options: OPTIONS.map((o, i) => ({
      title: o.title,
      eyebrow: o.eyebrow,
      body: o.body,
      illustration: null,
      facts: [],
      anchorId: null,
      scope: null,
      icon: null,
      checklist: o.checklist.map((body) => ({ body })),
      action: {
        name: o.label,
        href: actionHref(current.options?.[i]?.action?.href),
        description: null,
        icon: null,
        isExternal: false,
        expertise: { set: [] },
        scene: null,
      },
      ...(hasFocus ? { [FOCUS_FIELD]: o.focused } : {}),
    })),
    closing: {
      heading: CLOSING_HEADING,
      body: CLOSING_BODY,
      proof: null,
      actions: [
        {
          name: CLOSING_LABEL,
          href: closingHref,
          description: null,
          icon: null,
          isExternal: false,
          expertise: { set: [] },
          scene: null,
        },
      ],
    },
  };
}

/** The new block in the GraphQL shape the site's mapper reads, for the local preview only. */
function previewBlock(block) {
  const action = (a) => ({ name: a.name, href: a.href, description: null, icon: null, isExternal: false });
  return {
    heading: block.heading,
    anchorId: block.anchorId,
    engagementSurface: block.surface,
    engagementSide: block.mediaSide,
    engagementDescription: null,
    engagementPresentation: 'plans',
    action: null,
    options: block.options.map((o, i) => ({
      id: `preview-${i}`,
      title: o.title,
      eyebrow: o.eyebrow,
      [FOCUS_FIELD]: OPTIONS[i].focused,
      body: o.body,
      icon: null,
      scope: null,
      anchorId: null,
      facts: [],
      illustration: null,
      checklist: o.checklist,
      action: action(o.action),
    })),
    terms: [],
    closing: {
      heading: block.closing.heading,
      body: block.closing.body,
      actions: block.closing.actions.map(action),
      proof: null,
    },
  };
}

/** What changes in the plans block, field by field, for the report. */
function diffFields(before, after, path = '') {
  const lines = [];
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  for (const key of keys) {
    if (key === 'id' || key === '__component') continue;
    const a = before?.[key];
    const b = after?.[key];
    if (isDeepStrictEqual(contentOnly(a), contentOnly(b))) continue;
    const show = (v) => (typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(contentOnly(v)));
    const plain = (v) => v && typeof v === 'object' && !Array.isArray(v);
    if (plain(a) && plain(b)) {
      lines.push(...diffFields(a, b, `${path}${key}.`));
    } else if (Array.isArray(a) || Array.isArray(b) || plain(a) || plain(b)) {
      const summary = (v) => (Array.isArray(v) ? `[${v.length}]` : v == null ? 'null' : '{…}');
      lines.push(`    ${path}${key}: ${summary(a)} → ${summary(b)}`);
    } else {
      lines.push(`    ${path}${key}: ${show(a)} → ${show(b)}`);
    }
  }
  return lines;
}

/* ── Run ────────────────────────────────────────────────────────────────────────────────────── */

mkdirSync(snapshotDir, { recursive: true });
const summary = { entries: 0, safe: 0, unsafe: [], pending: [], noEnquiry: [], wrote: 0, failed: [] };
const preview = {};

if (mode === 'restore') {
  for (const file of readdirSync(snapshotDir).filter((f) => f.endsWith('.json') && !f.startsWith('_'))) {
    const snap = JSON.parse(readFileSync(join(snapshotDir, file), 'utf8'));
    if (only && snap.uid !== only && snap.documentId !== only) continue;
    const target = targets.find((t) => t.uid === snap.uid);
    const missing = [];
    /* Restore recreates every component (ids dropped): the write removed some of the old rows, and
       Strapi refuses an id that no longer belongs to the entry. Content, relations and media are the
       snapshot's, exactly. */
    const zone = zoneToInput(target, snap.draft[target.zone], missing, { keepIds: false });
    if (missing.length) {
      summary.failed.push(`${file}: snapshot incomplete (${missing[0]})`);
      continue;
    }
    const path =
      target.kind === 'singleType'
        ? `/api/${target.path}?status=${status}`
        : `/api/${target.path}/${snap.documentId}?status=${status}`;
    try {
      await api('PUT', path, { data: { [target.zone]: zone } });
      summary.wrote += 1;
      console.log(`restored ${snap.route}`);
    } catch (e) {
      summary.failed.push(`${snap.route}: ${e.message}`);
    }
  }
  console.log(JSON.stringify(summary, null, 2));
  process.exit(summary.failed.length ? 1 : 0);
}

console.log(`plans-copy ${mode}${status ? ` --status=${status}` : ''}; highlight field "${FOCUS_FIELD}": ${hasFocus ? 'in schema, written' : 'NOT in schema, not written'}`);
console.log(`snapshots → ${snapshotDir}\n`);

for (const target of targets) {
  for (const listed of await list(target)) {
    if (!(listed[target.zone] ?? []).some(isPlans)) continue;
    if (only && target.uid !== only && listed.documentId !== only) continue;
    const published = await read(target, listed.documentId, 'published');
    summary.entries += 1;
    const route = routeOf(target, published);
    const draft = await read(target, published.documentId, 'draft');
    const label = `${route}  (${target.uid} ${published.documentId})`;
    const snapshot = { uid: target.uid, documentId: published.documentId, route, zone: target.zone, draft, published };
    writeFileSync(
      join(snapshotDir, `${target.uid.replace(/[^a-z0-9.-]+/giu, '_')}-${published.documentId}.json`),
      JSON.stringify(snapshot, null, 2),
    );

    const problems = [];
    if (!draft) problems.push('no draft version');
    const zone = draft?.[target.zone] ?? [];
    const plansIndexes = zone.flatMap((b, i) => (isPlans(b) ? [i] : []));
    if (plansIndexes.length !== 1) problems.push(`${plansIndexes.length} plans blocks in the draft`);

    const missing = [];
    const before = zoneToInput(target, zone, missing);
    if (missing.length) problems.push(`read incomplete, would wipe: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? ` (+${missing.length - 3})` : ''}`);

    /* Pending: the draft differs from what is live, so publishing it would ship someone's edits. */
    const pending = !isDeepStrictEqual(contentOnly(draft?.[target.zone]), contentOnly(published[target.zone]));
    if (pending) summary.pending.push(label);

    /* An enquiry band on the page: a `shared.cta` form block, which renders #enquiry. */
    const hasEnquiry = zone.some((b) => b.__component === 'shared.cta' && (b.ctaType === 'form' || b.anchorId === 'enquiry'));
    if (!hasEnquiry) summary.noEnquiry.push(label);

    if (problems.length) {
      summary.unsafe.push(`${label}: ${problems.join('; ')}`);
      console.log(`✗ ${label}\n    ${problems.join('\n    ')}\n`);
      continue;
    }

    const index = plansIndexes[0];
    const next = newPlansBlock(zone[index], route, zone);
    if (route === '/how-we-work' && !termsAnchor(zone)) console.log('    ! no terms band on the page; the closing link falls back to /how-we-work');
    const after = before.map((b, i) => (i === index ? next : b));

    /* The proof for the dry run: every other block is carried over exactly as read, same order,
       same component ids, and the read was complete (no attribute missing anywhere in the zone). */
    const others = (zoneList) => zoneList.filter((_, i) => i !== index);
    if (!isDeepStrictEqual(others(after), others(before)) || after.length !== zone.length) {
      summary.unsafe.push(`${label}: other blocks would change`);
      continue;
    }
    summary.safe += 1;
    preview[route] = previewBlock(next);

    console.log(`${mode === 'write' ? '→' : '·'} ${label}${pending ? '  [draft ≠ published]' : ''}${hasEnquiry ? '' : '  [no enquiry band]'}`);
    console.log(`    zone: ${zone.length} blocks, plans at ${index}; ${zone.length - 1} others carried over unchanged (ids kept)`);
    for (const line of diffFields(before[index], next)) console.log(line);
    const optionLines = next.options.map(
      (o, i) => `      option ${i + 1}: "${o.eyebrow}" / "${o.title}" → ${o.action.href} (was ${before[index].options?.[i]?.action?.href ?? '—'})`,
    );
    console.log(optionLines.join('\n'));
    console.log(`      closing → "${CLOSING_LABEL}" ${next.closing.actions[0].href}\n`);

    if (mode === 'write') {
      if (pending && !flag('allow-pending') && status === 'published') {
        summary.failed.push(`${label}: draft has unpublished edits; rerun with --allow-pending to publish them too`);
        continue;
      }
      const path =
        target.kind === 'singleType'
          ? `/api/${target.path}?status=${status}`
          : `/api/${target.path}/${published.documentId}?status=${status}`;
      try {
        await api('PUT', path, { data: { [target.zone]: after } });
        /* Re-read and prove the other blocks survived, content for content. */
        const reread = await read(target, published.documentId, 'draft');
        const reMissing = [];
        const reInput = zoneToInput(target, reread[target.zone], reMissing);
        const same = isDeepStrictEqual(
          contentOnly(others(reInput)),
          contentOnly(others(before)),
        );
        if (!same) throw new Error('other blocks differ after the write; restore from the snapshot');
        summary.wrote += 1;
      } catch (e) {
        summary.failed.push(`${label}: ${e.message}`);
        console.log(`    ✗ ${e.message}`);
      }
    }
  }
}

writeFileSync(join(snapshotDir, '_plans-preview.json'), JSON.stringify(preview, null, 2));
console.log('── summary');
console.log(`entries with a published plans band: ${summary.entries}`);
console.log(`round-trip proven safe: ${summary.safe}`);
console.log(`unsafe (not written): ${summary.unsafe.length}${summary.unsafe.map((u) => `\n  ${u}`).join('')}`);
console.log(`draft ≠ published (publishing would ship pending edits): ${summary.pending.length}${summary.pending.map((u) => `\n  ${u}`).join('')}`);
console.log(`no enquiry band in the zone: ${summary.noEnquiry.length}${summary.noEnquiry.map((u) => `\n  ${u}`).join('')}`);
if (mode === 'write') console.log(`written: ${summary.wrote}; failed: ${summary.failed.length}${summary.failed.map((u) => `\n  ${u}`).join('')}`);
console.log(`preview payload: ${join(snapshotDir, '_plans-preview.json')}`);
