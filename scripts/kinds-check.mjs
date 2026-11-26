/**
 * Assert that every band on every corpus page renders through its kind's ONE approved component.
 *
 *   npm run build && npm run kinds:check
 *   npm run kinds:check -- --matrix      the kind × component pairs the built pages show, for the registry
 *
 * Why it exists (owner, 30 Oct 2026): two kinds chose between their approved component and an older
 * fallback by the content's shape, silently, and the fallback hid the approved design on all twelve
 * expertise pages; a table inside a hard part was dropped on two. No other check sees either: the
 * page builds, lint and tsc pass, and the defect is visible only by opening the page.
 *
 * It joins three things it does not compute itself, so it cannot drift from the site:
 *   - each band's kind, from the site's own parser and plan (`kindOf`, bundled as the census does);
 *   - the component the band actually rendered, from its `<section id="{band}" data-band="…">` in
 *     the prerendered HTML under .next/server/app;
 *   - the approved component per kind, from src/templates/CorpusPage/kinds.ts.
 *
 * It fails on: a band rendered by a component its kind does not approve; a kind with no registry
 * entry; a band missing from the page. `to-design` kinds are listed, not failed: they are the design
 * queue.
 *
 * It does not compare words. All copy comes from the CMS and `_pages` is retired as a copy source
 * (owner, 26 Nov 2026; decisions/2026-11-26-copy-comes-from-the-cms): matched against `_pages`, the
 * CMS's own copy read as 528 lines of "copy missing". `_pages` still names each page's bands and
 * their kinds, which is all this check reads from it.
 *
 * Like aria:check it needs a build, so it is not part of `npm run verify` (verify stays build-free).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import * as esbuild from 'esbuild';

import { prerenderedPages } from './prerendered-floor.mjs';

const ROOT = process.cwd();
const MATRIX = process.argv.includes('--matrix');
const APP = join(ROOT, '.next/server/app');

if (!existsSync(APP)) {
  console.error('kinds:check: no build output in .next/server/app. Run `npm run build` first.');
  process.exit(2);
}
/* A build that prerendered (almost) nothing fails here, with the reason, rather than as one
   "not prerendered" line per corpus page (prerendered-floor.mjs). */
const prerendered = prerenderedPages(APP, 'kinds:check').length;

const { parseCorpusFile } = await import('../src/content/sources/corpus/load.ts');

async function bundle(contents, name) {
  const out = join(tmpdir(), `kinds-check-${name}-${process.pid}.mjs`);
  await esbuild.build({
    stdin: { contents, resolveDir: ROOT, loader: 'ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    alias: { '@': join(ROOT, 'src') },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'error',
  });
  return import(pathToFileURL(out).href);
}

const { kindOf, KIND_COMPONENTS, BANDS_ELSEWHERE } = await bundle(
  `export { kindOf } from './src/templates/CorpusPage/plan.ts';
   export { KIND_COMPONENTS, BANDS_ELSEWHERE } from './src/templates/CorpusPage/kinds.ts';`,
  'site',
);

/* The offer allowlist, read from its source: bundling offer.tsx would pull in Next and React. */
const offerSource = readFileSync(join(ROOT, 'src/app/_corpus/offer.tsx'), 'utf8');
const allowlist = /PASS_1_OFFER_ROUTES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(offerSource)?.[1] ?? '';
const PASS_1_OFFER_ROUTES = new Set([...allowlist.matchAll(/'([^']+)'/g)].map((m) => m[1]));

/* The composed routes (hubs and one-off pages, src/app/_corpus/composed.tsx) render through the same
   unit loop, so they answer to the same registry; read by their ROUTES names, as the census does. */
const { ROUTES } = await import('../src/lib/routes.ts');
const composedSource = readFileSync(join(ROOT, 'src/app/_corpus/composed.tsx'), 'utf8');
const PASS_1_COMPOSED_ROUTES = new Set(
  [
    ...(
      /PASS_1_COMPOSED_ROUTES[^=]*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(composedSource)?.[1] ?? ''
    ).matchAll(/ROUTES\.(\w+)/g),
  ].map((m) => ROUTES[m[1]]),
);

/* ── html ─────────────────────────────────────────────────────────────────────────────── */

/** The band's `<section>` opening tag, or null when the page has no section with that id. */
function sectionOf(html, id) {
  return new RegExp(`<section\\b[^>]*\\sid="${id}"[^>]*>`).exec(html)?.[0] ?? null;
}

/* ── run ──────────────────────────────────────────────────────────────────────────────── */

const pages = readdirSync(join(ROOT, '_pages'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseCorpusFile(f, readFileSync(join(ROOT, '_pages', f), 'utf8')))
  .filter((p) => PASS_1_OFFER_ROUTES.has(p.route) || PASS_1_COMPOSED_ROUTES.has(p.route));

const failures = [];
const moved = [];
const queue = new Map();
const matrix = new Map();

for (const page of pages) {
  const file = join(APP, `${page.route.slice(1)}.html`);
  if (!existsSync(file)) {
    failures.push(`${page.route}: not prerendered (${file})`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  for (const band of page.bands) {
    /* A band the owner moved into another element's state (kinds.ts BANDS_ELSEWHERE): listed, not
       failed. It must really be gone: a moved band still drawn as a section is a stale entry. */
    const elsewhere = BANDS_ELSEWHERE[page.route]?.[band.id];
    if (elsewhere) {
      if (sectionOf(html, band.id)) {
        failures.push(`${page.route}#${band.id}: listed in BANDS_ELSEWHERE but still on the page`);
      } else moved.push(`${page.route}#${band.id} → ${elsewhere}`);
      continue;
    }
    const kind = kindOf(band);
    const section = sectionOf(html, band.id);
    const where = `${page.route}#${band.id}`;
    if (!section) {
      failures.push(`${where} (${kind}): no <section id="${band.id}"> on the page`);
      continue;
    }
    const rendered = /data-band="([^"]+)"/.exec(section)?.[1] ?? '(none)';
    const key = `${kind} → ${rendered}`;
    matrix.set(key, [...(matrix.get(key) ?? []), where]);
    const entry = KIND_COMPONENTS[kind];
    if (!entry) {
      failures.push(`${where}: kind "${kind}" has no entry in kinds.ts (rendered ${rendered})`);
    } else if (!entry.component.includes(rendered)) {
      failures.push(
        `${where}: kind "${kind}" rendered "${rendered}", not its component (${entry.component.join(' | ')})`,
      );
    } else if (entry.status === 'to-design') {
      queue.set(kind, [...(queue.get(kind) ?? []), page.route]);
    }
  }
}

if (MATRIX) {
  for (const [key, where] of [...matrix].sort())
    console.log(`${key.padEnd(36)} ${where.length}  e.g. ${where[0]}`);
  process.exit(0);
}

if (moved.length > 0) {
  console.log('Bands moved out of the band loop (kinds.ts BANDS_ELSEWHERE):');
  for (const line of moved) console.log(`  ${line}`);
}
if (queue.size > 0) {
  console.log('Kinds still to design (rendering, not approved):');
  for (const [kind, routes] of queue)
    console.log(`  ${kind}: ${routes.length} pages. ${KIND_COMPONENTS[kind]?.note ?? ''}`);
}
if (failures.length > 0) {
  console.error(`\nkinds:check: ${failures.length} problem(s)\n`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log(
  `\nkinds:check: ${pages.length} corpus pages (of ${prerendered} prerendered), every band on its kind's component.`,
);
