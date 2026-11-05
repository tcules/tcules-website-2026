#!/usr/bin/env node
/**
 * The page-build census: what the `_pages/` copy (26 Oct 2026) asks for, page by page and band by
 * band, so templates are derived from the copy rather than guessed.
 *
 *   npm run corpus:census
 *
 * Writes docs/page-build/census.json and docs/page-build/census.md, both GENERATED on every run and
 * git-ignored (generated files are never committed: owner, 22 Oct 2026). Plain node, like the other
 * scripts. It reads every file in `_pages/` (all three levels, unlike the site's loader, which reads
 * the first two) through the site's own parser (`parseCorpusFile`), and it classifies bands with the
 * site's own plan (`src/templates/CorpusPage/plan.ts`, bundled on the fly with esbuild so its `@/`
 * imports resolve): the census and the page cannot disagree about a band's shape or kind.
 *
 * Per page: route, page type, tier (A/B/C, the 6 Nov launch roadmap), band order and per band its id,
 * shape signature, the OfferKind the plan resolves it to ('n/a' off the offer families), the media
 * slots that support it and their status, and its testimonial ids. Then per band id and per page
 * type, and the flags: bands that resolve to 'generic', open image slots, adjacent tinted bands on an
 * offer page, case references that do not resolve to a live case, and pages that fall back.
 *
 * Live cases are read from the live Strapi (the case-study source's own endpoint); when it is not
 * reachable, from CASE_STUDY_SLUGS in src/lib/routes.ts, and the census says which it used.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import * as esbuild from 'esbuild';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'docs/page-build');
const STRAPI =
  process.env.STRAPI_GRAPHQL_URL || 'https://tcules-server-production.up.railway.app/graphql';

/* ── the site's own parser, plan and route names ─────────────────────────────────────── */

const { parseCorpusFile } = await import('../src/content/sources/corpus/load.ts');
const { CASE_STUDY_SLUGS, CASE_SLUG_REDIRECTS } = await import('../src/lib/routes.ts');

async function loadPlan() {
  const out = join(tmpdir(), `corpus-census-plan-${process.pid}.mjs`);
  await esbuild.build({
    stdin: {
      contents: `export { kindOf, planOffer, signature, TEMPLATE_BANDS } from './src/templates/CorpusPage/plan.ts';`,
      resolveDir: ROOT,
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    alias: { '@': join(ROOT, 'src') },
    /* production: the plan's development warnings (text-heavy pairs) are the census's flags here. */
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'error',
  });
  return import(pathToFileURL(out).href);
}
const { kindOf, planOffer, signature, TEMPLATE_BANDS } = await loadPlan();

/* ── live cases ───────────────────────────────────────────────────────────────────────── */

async function liveCases() {
  try {
    const res = await fetch(STRAPI, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ query: '{ caseStudies(pagination: { limit: 200 }) { slug } }' }),
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();
    const slugs = (json?.data?.caseStudies ?? []).map((c) => c.slug).filter(Boolean);
    if (slugs.length) return { source: `live Strapi (${STRAPI})`, slugs: slugs.sort() };
  } catch {
    /* fall through */
  }
  return {
    source: 'CASE_STUDY_SLUGS in src/lib/routes.ts (Strapi not reachable)',
    slugs: [...new Set(Object.values(CASE_STUDY_SLUGS))].sort(),
  };
}

/* ── tiers (6 Nov launch roadmap) ─────────────────────────────────────────────────────── */

const LEVEL_1_SERVICES = new Set([
  'ai-product-ux',
  'design-engineering',
  'design-systems',
  'mvp-development',
  'product-design',
  'product-modernisation',
  'software-development',
]);

function tierOf(route, pageType) {
  const seg = route.split('/').filter(Boolean);
  if (pageType === 'case_study') return 'none (live Strapi case ships)';
  if (
    [
      '/',
      '/about',
      '/contact',
      '/future-interfaces-lab',
      '/services',
      '/expertise',
      '/case-studies',
    ].includes(route)
  )
    return 'A';
  if (seg[0] === 'services')
    return seg.length === 2 && LEVEL_1_SERVICES.has(seg[1]) ? 'A' : 'B';
  if (seg[0] === 'expertise') return 'A';
  if (seg[0] === 'glossary' || route === '/sitemap') return 'C';
  if (seg[0] === 'insights' && seg[1] === 'authors') return 'C';
  if (
    pageType === 'legal' ||
    pageType === 'policy' ||
    ['/privacy-policy', '/terms-of-use', '/cookie-policy'].includes(route)
  )
    return 'C';
  return 'B';
}

/* The families OfferPage serves (src/app/_corpus/offer.tsx); the plan's kinds mean something there. */
const isOfferFamily = (route) => /^\/(services|audits|expertise)\//.test(route);

/* The composed routes (src/app/_corpus/composed.tsx), read from the route file by their ROUTES names. */
const { ROUTES } = await import('../src/lib/routes.ts');
const composedSrc = readFileSync(join(ROOT, 'src/app/_corpus/composed.tsx'), 'utf8');
const COMPOSED = new Set(
  [
    ...(
      /PASS_1_COMPOSED_ROUTES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(composedSrc)?.[1] ?? ''
    ).matchAll(/ROUTES\.(\w+)/g),
  ].map((m) => ROUTES[m[1]]),
);
/* Every page whose bands the plan's id table classifies: the offer families, the composed routes,
   home and About (which compose a few ids themselves, TEMPLATE_BANDS, and the rest by the plan), and
   the two listings (ListingIndex composes the list; the bands around it by the plan). */
const isPlanned = (route) =>
  isOfferFamily(route) ||
  COMPOSED.has(route) ||
  ['/', '/about', '/insights', '/case-studies'].includes(route);
/* A listing's own bands are ListingIndex's sections (shelves, case groups, its close), not a plan kind. */
const LISTINGS = new Set(['/insights', '/case-studies']);
const templateBand = (route, id) => (TEMPLATE_BANDS[route] ?? []).includes(id);

/* Live on OfferPage today (PASS_1_OFFER_ROUTES); read from the route file so the census never drifts. */
const offerSrc = readFileSync(join(ROOT, 'src/app/_corpus/offer.tsx'), 'utf8');
const PASS_1 = new Set(
  [
    ...(
      /PASS_1_OFFER_ROUTES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(offerSrc)?.[1] ?? ''
    ).matchAll(/'([^']+)'/g),
  ].map((m) => m[1]),
);

/* ── walk ─────────────────────────────────────────────────────────────────────────────── */

const quotesIn = (blocks) =>
  blocks.flatMap((b) =>
    b.type === 'quote' ? [b] : b.type === 'item' ? quotesIn(b.blocks) : [],
  );

function linksIn(blocks) {
  const out = [];
  const runs = (rs) => {
    for (const r of rs ?? []) {
      if (r.type === 'link') out.push(r.href);
      if (r.children) runs(r.children);
    }
  };
  for (const b of blocks) {
    if (b.type === 'paragraph') runs(b.runs);
    else if (b.type === 'labelled') [b.label, b.body].forEach(runs);
    else if (b.type === 'list') b.items.forEach(runs);
    else if (b.type === 'table') [b.header, ...b.rows].forEach((row) => row.forEach(runs));
    else if (b.type === 'quote') [...b.paragraphs, b.attribution].forEach(runs);
    else if (b.type === 'links') out.push(...b.links.map((l) => l.href));
    else if (b.type === 'item') out.push(...linksIn(b.blocks));
  }
  return out;
}

const caseSlugOf = (href) => /^\/case-studies\/([^/#?]+)/.exec(href ?? '')?.[1] ?? null;

const files = readdirSync(join(ROOT, '_pages'))
  .filter((f) => f.endsWith('.md'))
  .sort();
const live = await liveCases();
const liveSet = new Set(live.slugs);

const pages = [];
const parseFailures = [];
for (const file of files) {
  try {
    pages.push(parseCorpusFile(file, readFileSync(join(ROOT, '_pages', file), 'utf8')));
  } catch (e) {
    parseFailures.push(String(e instanceof Error ? e.message : e));
  }
}
pages.sort((a, b) => a.route.localeCompare(b.route));

/* Pages whose route renders on the plain fallback today (PlainPage), and why. */
const FALLBACKS = {};

const census = {
  generated: new Date().toISOString(),
  liveCases: live,
  pages: [],
  bands: {},
  pageTypes: {},
  flags: {},
};
const flags = {
  generic: [],
  openImageSlots: [],
  adjacentTint: [],
  unresolvedCaseRefs: [],
  redirectedCaseRefs: [],
  bandOrderMismatch: [],
  unanchoredBands: [],
  fallbacks: Object.entries(FALLBACKS).map(([route, why]) => ({ route, why })),
  parseFailures,
};

for (const page of pages) {
  const offer = isPlanned(page.route);
  const bandRows = page.bands.map((band) => {
    const kind = offer
      ? templateBand(page.route, band.id)
        ? LISTINGS.has(page.route)
          ? 'template:listing'
          : `template:${kindOf(band)}`
        : kindOf(band)
      : 'n/a';
    const media = page.composition.mediaBindings
      .filter((m) => m.supportsSection === band.id)
      .map((m) => ({ id: m.id, status: m.status, card: m.card }));
    const testimonials = quotesIn(band.blocks).map((q) => q.testimonialId ?? '?');
    if (kind === 'generic')
      flags.generic.push({ route: page.route, band: band.id, shape: signature(band) });
    if (!band.anchored) flags.unanchoredBands.push({ route: page.route, band: band.id });
    return { id: band.id, shape: signature(band), offerKind: kind, media, testimonials };
  });

  for (const m of page.composition.mediaBindings) {
    if (!m.bound && m.status !== 'SATISFIED_BY_EXISTING_ASSET')
      flags.openImageSlots.push({
        route: page.route,
        id: m.id,
        status: m.status,
        band: m.supportsSection,
        card: m.card,
      });
  }

  if (page.bandOrder.length && page.bandOrder.join() !== page.bands.map((b) => b.id).join())
    flags.bandOrderMismatch.push({
      route: page.route,
      order: page.bandOrder,
      doc: page.bands.map((b) => b.id),
    });

  let planned = null;
  if (offer) {
    try {
      planned = planOffer(page).map((u) => ({
        id: u.id,
        kind: u.kind,
        surface: u.surface,
        visual: u.visual,
      }));
      planned.forEach((u, i) => {
        const next = planned[i + 1];
        if (next && u.surface === 'tint' && next.surface === 'tint')
          flags.adjacentTint.push({ route: page.route, bands: [u.id, next.id] });
      });
    } catch (e) {
      flags.parseFailures.push(
        `${page.route}: planOffer threw: ${e instanceof Error ? e.message : e}`,
      );
    }
  }

  /* Case references: the frontmatter's slugs and every /case-studies/<slug> link in the body. */
  const refs = new Map();
  for (const slug of page.composition.caseSlugs) refs.set(slug, 'frontmatter');
  for (const band of page.bands)
    for (const href of linksIn(band.blocks)) {
      const slug = caseSlugOf(href);
      if (slug && !refs.has(slug)) refs.set(slug, `band ${band.id}`);
    }
  for (const [slug, where] of refs) {
    if (liveSet.has(slug)) continue;
    const target = CASE_SLUG_REDIRECTS[slug];
    if (target && liveSet.has(target))
      flags.redirectedCaseRefs.push({ route: page.route, slug, live: target, where });
    else flags.unresolvedCaseRefs.push({ route: page.route, slug, where });
  }

  const row = {
    route: page.route,
    file: page.file,
    pageType: page.pageType,
    tier: tierOf(page.route, page.pageType),
    offerPageToday: PASS_1.has(page.route) || COMPOSED.has(page.route),
    fallback: FALLBACKS[page.route] ? true : false,
    bandOrder: page.bandOrder.length ? page.bandOrder : page.bands.map((b) => b.id),
    bandOrderAuthored: page.bandOrder.length > 0,
    bands: bandRows,
    testimonialIds: page.composition.testimonialIds,
    clientRecognition: page.composition.clientRecognition?.clients ?? [],
    caseRefs: [...refs.keys()],
    conversion: page.conversion?.form ?? null,
    structuredData: page.structuredData.types,
    plan: planned,
  };
  census.pages.push(row);

  for (const b of bandRows) {
    const e = (census.bands[b.id] ??= {
      pages: 0,
      routes: [],
      pageTypes: {},
      shapes: {},
      offerKinds: {},
    });
    e.pages++;
    e.routes.push(page.route);
    e.pageTypes[page.pageType] = (e.pageTypes[page.pageType] ?? 0) + 1;
    e.shapes[b.shape] = (e.shapes[b.shape] ?? 0) + 1;
    if (b.offerKind !== 'n/a') e.offerKinds[b.offerKind] = (e.offerKinds[b.offerKind] ?? 0) + 1;
  }
  const t = (census.pageTypes[page.pageType] ??= { pages: 0, sequences: {} });
  t.pages++;
  const seq = row.bandOrder.join(' > ');
  (t.sequences[seq] ??= []).push(page.route);
}
census.flags = flags;

/* ── write ────────────────────────────────────────────────────────────────────────────── */

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'census.json'), JSON.stringify(census, null, 2) + '\n');

const md = [];
const esc = (s) => String(s).replace(/\|/g, '\\|');
const top = (obj) =>
  Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k || '(empty)'} ×${n}`)
    .join(', ');
md.push('# Page-build census', '');
md.push(
  `GENERATED by \`npm run corpus:census\` from \`_pages/\` (${pages.length} pages). Git-ignored; rerun to refresh. Shapes are plan.ts signatures: Q quote, F form, T table, I \`###\` item, K link row, U list, L labelled claim, A link-led line, P paragraph. Offer kinds are \`kindOf\` (plan.ts: section id first, then shape) on the offer families (services, audits, expertise), the composed routes, home and About; \`template:<kind>\` marks a band the page's own template composes; \`n/a\` elsewhere.`,
  '',
);
md.push(`Live cases (${live.slugs.length}) from ${live.source}.`, '');

const tiers = {};
for (const p of census.pages) (tiers[p.tier] ??= []).push(p.route);
md.push('## Tiers', '', '| Tier | Pages |', '| --- | --- |');
for (const [tier, routes] of Object.entries(tiers).sort())
  md.push(`| ${tier} | ${routes.length} |`);
md.push('');

md.push('## Flags', '');
const flagList = (title, rows, fmt) => {
  md.push(`### ${title} (${rows.length})`, '');
  if (!rows.length) md.push('None.', '');
  else md.push(...rows.map((r) => `- ${fmt(r)}`), '');
};
flagList('Pages on the plain fallback', flags.fallbacks, (r) => `\`${r.route}\`: ${r.why}`);
flagList('Parse or plan failures', flags.parseFailures, (r) => r);
flagList(
  'Bands resolving to generic (offer families, composed routes, home, About)',
  flags.generic,
  (r) => `\`${r.route}\` #${r.band} (${r.shape || 'empty'})`,
);
flagList(
  'Open image slots',
  flags.openImageSlots,
  (r) => `\`${r.route}\` ${r.id}: ${r.status} → #${r.band}${r.card ? ` (card ${r.card})` : ''}`,
);
flagList(
  'Adjacent tinted bands (planned offer pages)',
  flags.adjacentTint,
  (r) => `\`${r.route}\` ${r.bands.join(' + ')}`,
);
flagList(
  'Case references that resolve to no live case',
  flags.unresolvedCaseRefs,
  (r) => `\`${r.route}\` ${r.slug} (${r.where})`,
);
flagList(
  'Case references live only through a redirect',
  flags.redirectedCaseRefs,
  (r) => `\`${r.route}\` ${r.slug} → ${r.live}`,
);
flagList(
  'band_order differs from document order',
  flags.bandOrderMismatch,
  (r) => `\`${r.route}\``,
);
flagList(
  'Bands with no authored {#id}',
  flags.unanchoredBands,
  (r) => `\`${r.route}\` #${r.band}`,
);

/* ── Review list (owner, 31 Oct 2026) ──────────────────────────────────────────────────
   A kind is approved by looking at the real pages that stress it, not at a specimen: per kind, the
   few live instances with the hardest content (longest, shortest, most items, a table, a worked
   example, claims without an example). Open these and, if they hold, every page of the kind does.
   kinds:check (after a build) then keeps every band on its kind's component. */
const wordsIn = (blocks) =>
  blocks.reduce((n, b) => {
    const t = (runs) => runs.map((r) => (r.type === 'text' ? r.text : r.children ? t(r.children) : '')).join(' ');
    if (b.type === 'paragraph') return n + t(b.runs).split(/\s+/).length;
    if (b.type === 'list') return n + b.items.reduce((m, i) => m + t(i).split(/\s+/).length, 0);
    if (b.type === 'table') return n + b.rows.flat().reduce((m, c) => m + t(c).split(/\s+/).length, 0);
    if (b.type === 'item') return n + wordsIn(b.blocks);
    return n;
  }, 0);
const flat = (blocks) => blocks.flatMap((b) => (b.type === 'item' ? [b, ...flat(b.blocks)] : [b]));
const plainOf = (b) =>
  b.type === 'paragraph'
    ? b.runs.map((r) => (r.type === 'text' ? r.text : r.children ? r.children.map((c) => c.text ?? '').join('') : '')).join('')
    : '';
const review = new Map();
for (const page of pages) {
  const row = census.pages.find((p) => p.route === page.route);
  if (!row?.offerPageToday) continue;
  for (const band of page.bands) {
    const kind = row.bands.find((b) => b.id === band.id)?.offerKind ?? 'n/a';
    if (kind === 'n/a' || kind.startsWith('template:')) continue;
    const all = flat(band.blocks);
    const items = band.blocks.filter((b) => b.type === 'item');
    review.set(kind, [
      ...(review.get(kind) ?? []),
      {
        at: `${page.route}#${band.id}`,
        words: wordsIn(band.blocks),
        items: items.length || band.blocks.filter((b) => b.type === 'list').reduce((n, l) => n + l.items.length, 0),
        table: all.some((b) => b.type === 'table'),
        story: all.some((b) => /^illustration, not client work$/i.test(plainOf(b).trim())),
        bare: items.filter((i) => !i.blocks.some((b) => /^example\b[^:.]{0,40}:/i.test(plainOf(b).trim()))).length,
      },
    ]);
  }
}
md.push('## Review list: the hardest real content per kind', '');
md.push('Open these on the running site. If they hold, every page of the kind holds.', '');
for (const [kind, rows] of [...review].sort()) {
  const pick = [];
  const add = (r, why) => {
    if (r && !pick.some((p) => p.r.at === r.at)) pick.push({ r, why });
  };
  const by = (f) => [...rows].sort((a, b) => f(b) - f(a))[0];
  add(by((r) => r.words), 'longest');
  add(by((r) => -r.words), 'shortest');
  add(by((r) => r.items), 'most items');
  add(rows.find((r) => r.table), 'a table');
  add(rows.find((r) => r.story), 'a worked example');
  if (rows.some((r) => r.bare)) add(by((r) => r.bare), 'claims without an example');
  md.push(
    `- **${kind}** (${rows.length}): ${pick
      .slice(0, 4)
      .map(({ r, why }) => `\`${r.at}\` ${why}`)
      .join(' · ')}`,
  );
}
md.push('');

md.push('## Page types: band sequences', '');
for (const [type, t] of Object.entries(census.pageTypes).sort(
  (a, b) => b[1].pages - a[1].pages,
)) {
  md.push(`### ${type} (${t.pages})`, '');
  for (const [seq, routes] of Object.entries(t.sequences).sort(
    (a, b) => b[1].length - a[1].length,
  ))
    md.push(
      `- ×${routes.length} ${seq || '(no bands)'}${routes.length <= 3 ? `  (${routes.map((r) => `\`${r}\``).join(', ')})` : ''}`,
    );
  md.push('');
}

md.push(
  '## Band ids',
  '',
  '| Band id | Pages | Page types | Shapes | Offer kinds |',
  '| --- | --- | --- | --- | --- |',
);
for (const [id, e] of Object.entries(census.bands).sort((a, b) => b[1].pages - a[1].pages))
  md.push(
    `| ${esc(id)} | ${e.pages} | ${esc(top(e.pageTypes))} | ${esc(top(e.shapes))} | ${esc(top(e.offerKinds)) || 'n/a'} |`,
  );
md.push('');

md.push('## Pages', '');
for (const p of census.pages) {
  md.push(
    `### \`${p.route}\``,
    '',
    `${p.pageType} · tier ${p.tier}${p.offerPageToday ? ' · on OfferPage today' : ''}${p.fallback ? ' · PLAIN FALLBACK' : ''}${p.bandOrderAuthored ? '' : ' · no band_order (document order)'}`,
    '',
    '| Band | Shape | Offer kind | Media | Testimonials |',
    '| --- | --- | --- | --- | --- |',
    ...p.bands.map(
      (b) =>
        `| ${esc(b.id)} | ${esc(b.shape || '—')} | ${b.offerKind} | ${esc(b.media.map((m) => `${m.id} (${m.status})`).join(', ') || '—')} | ${esc(b.testimonials.join(', ') || '—')} |`,
    ),
    '',
  );
}
writeFileSync(join(OUT_DIR, 'census.md'), md.join('\n'));

console.log(
  `census — ${pages.length} pages, ${Object.keys(census.bands).length} band ids, ${Object.keys(census.pageTypes).length} page types; ` +
    `generic ${flags.generic.length}, open image slots ${flags.openImageSlots.length}, adjacent tint ${flags.adjacentTint.length}, ` +
    `unresolved case refs ${flags.unresolvedCaseRefs.length}, parse failures ${flags.parseFailures.length}`,
);
console.log(
  `wrote docs/page-build/census.json and docs/page-build/census.md (live cases: ${live.source})`,
);
