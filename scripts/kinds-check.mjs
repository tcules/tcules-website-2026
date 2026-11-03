/**
 * Assert that every band on every corpus page renders through its kind's ONE approved component, and
 * that the copy's words reach the page.
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
 * entry; a band missing from the page; copy that does not reach its band (a window of words from
 * every paragraph, list item and table cell, matched in the band's text). `to-design` kinds are
 * listed, not failed: they are the design queue.
 *
 * Like aria:check it needs a build, so it is not part of `npm run verify` (verify stays build-free).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import * as esbuild from 'esbuild';

const ROOT = process.cwd();
const MATRIX = process.argv.includes('--matrix');
const APP = join(ROOT, '.next/server/app');

if (!existsSync(APP)) {
  console.error('kinds:check: no build output in .next/server/app. Run `npm run build` first.');
  process.exit(2);
}

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

const { kindOf, KIND_COMPONENTS } = await bundle(
  `export { kindOf } from './src/templates/CorpusPage/plan.ts';
   export { KIND_COMPONENTS } from './src/templates/CorpusPage/kinds.ts';`,
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

/* ── text ─────────────────────────────────────────────────────────────────────────────── */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
const normal = (text) =>
  text
    .replace(/&(#?\w+);/g, (m, e) =>
      e.startsWith('#x')
        ? String.fromCodePoint(parseInt(e.slice(2), 16))
        : e.startsWith('#')
          ? String.fromCodePoint(Number(e.slice(1)))
          : (ENTITIES[e] ?? m),
    )
    .toLowerCase()
    .replace(/[‘’“”"'`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

const runText = (runs) =>
  runs.map((r) => (r.type === 'text' ? r.text : r.children ? runText(r.children) : '')).join('');

/** Words 3–9 of a sentence: past any label a component may drop ("Example:"), short of its end. */
function sample(text) {
  const words = normal(text).split(' ').filter(Boolean);
  if (words.length < 6) return null;
  return words.slice(2, Math.min(words.length, 9)).join(' ');
}

function samplesOf(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') out.push(sample(runText(block.runs)));
    else if (block.type === 'labelled') out.push(sample(runText(block.body)));
    else if (block.type === 'list') for (const item of block.items) out.push(sample(runText(item)));
    else if (block.type === 'table')
      for (const row of block.rows) for (const cell of row) out.push(sample(runText(cell)));
    else if (block.type === 'item') out.push(...samplesOf(block.blocks));
  }
  return out.filter(Boolean);
}

/** The band's `<section>`: its opening tag and its text, nested sections included. */
function sectionOf(html, id) {
  const open = new RegExp(`<section\\b[^>]*\\sid="${id}"[^>]*>`).exec(html);
  if (!open) return null;
  let depth = 1;
  const tag = /<(\/?)section\b[^>]*>/g;
  tag.lastIndex = open.index + open[0].length;
  let m;
  while (depth > 0 && (m = tag.exec(html))) depth += m[1] ? -1 : 1;
  const inner = html.slice(open.index, m ? m.index : html.length);
  const text = inner
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/g, ' ')
    /* A name drawn as a mark (a client logo) reaches the page as its accessible name. */
    .replace(/<[^>]*\b(?:alt|aria-label)="([^"]*)"[^>]*>/g, ' $1 ')
    .replace(/<\/?(p|li|h\d|td|th|div|br|dt|dd|figcaption|blockquote)\b[^>]*>/g, ' ')
    .replace(/<[^>]+>/g, '');
  return { tag: open[0], text: normal(text) };
}

/* ── run ──────────────────────────────────────────────────────────────────────────────── */

const pages = readdirSync(join(ROOT, '_pages'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => parseCorpusFile(f, readFileSync(join(ROOT, '_pages', f), 'utf8')))
  .filter((p) => PASS_1_OFFER_ROUTES.has(p.route) || PASS_1_COMPOSED_ROUTES.has(p.route));

const failures = [];
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
    const kind = kindOf(band);
    const section = sectionOf(html, band.id);
    const where = `${page.route}#${band.id}`;
    if (!section) {
      failures.push(`${where} (${kind}): no <section id="${band.id}"> on the page`);
      continue;
    }
    const rendered = /data-band="([^"]+)"/.exec(section.tag)?.[1] ?? '(none)';
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
    /* A band's onward line is lifted onto its own ink island after the band (tracker 2.53;
       CopyBands `OnwardIsland`, id `<band>-onward`): the band's words are the band's and its island's. */
    const onward = sectionOf(html, `${band.id}-onward`);
    const words = onward ? `${section.text} ${onward.text}` : section.text;
    for (const s of samplesOf(band.blocks)) {
      if (!words.includes(s)) failures.push(`${where}: copy missing from the page: "…${s}…"`);
    }
  }
}

if (MATRIX) {
  for (const [key, where] of [...matrix].sort())
    console.log(`${key.padEnd(36)} ${where.length}  e.g. ${where[0]}`);
  process.exit(0);
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
console.log(`\nkinds:check: ${pages.length} pages, every band on its kind's component, no copy lost.`);
