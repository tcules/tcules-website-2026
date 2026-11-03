#!/usr/bin/env node
/**
 * Assert the `_pages/` corpus parses: every first- and second-level file, without throwing, into a
 * shape the pages can rely on.
 *
 *   npm run corpus:check
 *   npm run corpus:check -- --dump=/services/product-design    print one page's parsed view model
 *
 * Runs the TypeScript source directly (Node strips the types), so it exercises the very loader the
 * site uses rather than a copy of it. Asserted per page:
 *   - the frontmatter `route` agrees with the filename (`a__b.md` is `/a/b`)
 *   - at least one band, every band has an id, and ids are unique
 *   - document order of the bands equals `render.band_order` (reported, never "fixed": the order is
 *     the content team's)
 *   - the hero has a title; nothing is left in `hero.extra`
 *   - every media binding that claims to be bound has a URL
 *   - no run list contains a raw markdown delimiter that the parser should have consumed
 *   - the pass covers 126 files: 100 first- and second-level (the 26 Oct 2026 copy: 96, less
 *     insights/videos, plus the three legal pages, the authors index and, from 3 Nov 2026, the Ringier
 *     case) and the 26 level-2 services
 *     (31 Oct 2026)
 *   - a page that authors no `render.band_order` keeps document order (legal, authors index)
 */
import { readdirSync, readFileSync } from 'node:fs';

const { loadCorpus, routeOfFile, splitFrontmatter } =
  await import('../src/content/sources/corpus/load.ts');

const dump = process.argv.find((a) => a.startsWith('--dump='))?.slice('--dump='.length);
const pages = loadCorpus();
if (dump) {
  console.log(JSON.stringify(pages.find((p) => p.route === dump) ?? null, null, 2));
  process.exit(0);
}

const problems = [];
const warnings = [];
const counts = {};
const note = (page, msg) => problems.push(`${page.file}  ${msg}`);

const rawMarkdown = (runs) =>
  runs.some((r) =>
    r.type === 'text'
      ? /\*\*|\[[^\]]*\]\(|(^|\s)\*\S/.test(r.text)
      : r.children
        ? rawMarkdown(r.children)
        : false,
  );
const checkRuns = (page, where, runs) => {
  if (rawMarkdown(runs)) note(page, `${where}: raw markdown left in a text run`);
};

function walk(page, blocks, where) {
  for (const b of blocks) {
    counts[b.type] = (counts[b.type] ?? 0) + 1;
    switch (b.type) {
      case 'paragraph':
        checkRuns(page, where, b.runs);
        break;
      case 'labelled':
        checkRuns(page, where, [...b.label, ...b.body]);
        break;
      case 'list':
        b.items.forEach((i) => checkRuns(page, where, i));
        break;
      case 'table':
        [b.header, ...b.rows].forEach((r) => r.forEach((c) => checkRuns(page, where, c)));
        if (b.rows.some((r) => r.length !== b.header.length))
          warnings.push(
            `${page.file}  ${where}: ragged table (a row has a different cell count)`,
          );
        break;
      case 'quote':
        if (b.pendingSignoff) counts.signoff = (counts.signoff ?? 0) + 1;
        b.paragraphs.forEach((p) => checkRuns(page, where, p));
        if (!b.attribution) warnings.push(`${page.file}  ${where}: quote without attribution`);
        break;
      case 'item':
        walk(page, b.blocks, `${where} > ${b.headingText}`);
        break;
      case 'form':
        if (b.fields.length === 0) note(page, `${where}: form with no fields`);
        break;
    }
  }
}

/* Nothing authored may be dropped: the word multiset of the markdown body (minus link targets, anchors,
   comments and table rules) must equal that of every run the parser produced. */
const runText = (runs) =>
  runs.map((r) => r.text ?? (r.children ? runText(r.children) : ' ')).join('');
function blockText(b) {
  switch (b.type) {
    case 'paragraph':
      return runText(b.runs);
    case 'labelled':
      return runText(b.label) + ' ' + runText(b.body);
    case 'list':
      return b.items.map(runText).join(' ');
    case 'table':
      return [b.header, ...b.rows].flat().map(runText).join(' ');
    case 'quote':
      return (
        b.paragraphs.map(runText).join(' ') +
        ' ' +
        (b.attribution ? runText(b.attribution) : '')
      );
    case 'item':
      return b.headingText + ' ' + b.blocks.map(blockText).join(' ');
    case 'links':
      return b.links.map((l) => l.labelText).join(' ');
    case 'form':
      return (
        'Enquiry form ' +
        b.fields.map((f) => f.labelText).join(' ') +
        ' Submit: ' +
        (b.submit ? runText(b.submit) : '') +
        ' After sending: ' +
        (b.after ? runText(b.after) : '')
      );
    default:
      return '';
  }
}
const words = (t) => {
  const m = new Map();
  for (const w of t
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean))
    m.set(w, (m.get(w) ?? 0) + 1);
  return m;
};
function wordDiff(page, body) {
  const src = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/\{#[\w-]+\}/g, ' ')
    .replace(/^\|[-| :]+\|$/gm, ' ')
    .replace(/^\d+\.\s+/gm, ' ');
  const out = [
    page.hero.eyebrow ? runText(page.hero.eyebrow) : '',
    page.hero.titleText,
    ...page.hero.lede.map(runText),
    ...page.hero.actions.map((a) => a.labelText),
    ...page.hero.proofLines.map(runText),
    ...page.hero.extra.map(blockText),
    ...page.bands.map((b) => b.headingText + ' ' + b.blocks.map(blockText).join(' ')),
  ].join(' ');
  const a = words(src),
    b = words(out),
    diff = [];
  for (const k of new Set([...a.keys(), ...b.keys()]))
    if ((a.get(k) ?? 0) !== (b.get(k) ?? 0)) diff.push(k);
  return diff;
}

const files = readdirSync('_pages').filter((f) => {
  /* The loader's own rule (load.ts `inCorpus`): two levels, and the level-2 services. */
  const parts = f.replace(/\.md$/, '').split('__');
  return (
    f.endsWith('.md') && (parts.length <= 2 || (parts.length === 3 && parts[0] === 'services'))
  );
});
if (files.length !== 126)
  problems.push(
    `expected 126 corpus files (100 first/second-level, 26 level-2 services), found ${files.length}`,
  );
if (pages.length !== files.length)
  problems.push(`parsed ${pages.length} of ${files.length} files`);

for (const page of pages) {
  const file = page.file.replace('_pages/', '');
  if (routeOfFile(file) !== page.route)
    note(page, `route ${page.route} disagrees with the filename (${routeOfFile(file)})`);
  const diff = wordDiff(page, splitFrontmatter(readFileSync(page.file, 'utf8')).body);
  if (diff.length)
    note(
      page,
      `words differ between source and parsed view model: ${diff.slice(0, 8).join(', ')}`,
    );
  if (page.bands.length === 0) note(page, 'no bands');
  const ids = page.bands.map((b) => b.id);
  if (new Set(ids).size !== ids.length) note(page, 'duplicate band ids');
  if (page.bandOrder.length > 0 && page.bandOrder.join() !== ids.join())
    warnings.push(
      `${page.file}  band_order differs from document order\n      order: ${page.bandOrder.join(', ')}\n      doc:   ${ids.join(', ')}`,
    );
  if (!page.hero.titleText) note(page, 'no hero title');
  if (page.hero.extra.length > 0)
    warnings.push(
      `${page.file}  hero.extra holds ${page.hero.extra.map((b) => b.type).join(', ')}`,
    );
  checkRuns(page, 'hero title', page.hero.title);
  page.hero.lede.forEach((l) => checkRuns(page, 'hero lede', l));
  for (const m of page.composition.mediaBindings)
    if (m.status === 'BOUND_EXISTING_PUBLIC_ASSET' && !m.bound)
      note(page, `media binding ${m.id} is marked bound but has no usable asset_uri`);
  for (const band of page.bands) {
    checkRuns(page, band.id, band.heading);
    walk(page, band.blocks, band.id);
  }
}

const signoffs = (src) => (src.match(/<!-- awaiting client sign-off -->/g) ?? []).length;
const authored = files.reduce((n, f) => n + signoffs(readFileSync(`_pages/${f}`, 'utf8')), 0);
if ((counts.signoff ?? 0) !== authored)
  problems.push(`sign-off flags: ${authored} authored, ${counts.signoff ?? 0} reached a quote`);

console.log(`corpus: ${pages.length} pages parsed`);
console.log('blocks:', JSON.stringify(counts));
if (warnings.length) {
  console.log(`\n${warnings.length} note(s) (not failures):`);
  for (const w of warnings) console.log('  ' + w);
}
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
