#!/usr/bin/env node
/**
 * Derive the delivery widths for every kit photograph, and generate the typed registry from the
 * catalogue.
 *
 *   npm run photos:derive            write derived files, the `derived` field, and the registry
 *   npm run photos:derive -- --check exit 1 if anything is missing or stale; writes nothing
 *
 * Why it exists (docs/kit/visual-direction.md § 5.4). A 2400px master in a 392px card is six times
 * the bytes the card can show, and a placement cannot ask for less than the master unless a smaller
 * file exists. So every master gets the site's ladder below it — **1240, 652 and 320** — the same
 * three rungs Strapi derives for CMS images (Media.md ruling M2), and Media's srcset offers them with
 * the master on top. A rung is made only when it is narrower than the master: the 622px studio
 * squares get 320 alone, the 292px headshots get none. Each file is resized, never recomposed or
 * graded (ch05 § 5, § 9).
 *
 * What it writes:
 *   public/kit/photos/derived/<id>-<width>.webp   one file per rung (skipped when already current)
 *   catalogue.json  `derived: [1240, 652, 320]`   the rungs that exist, widest first
 *   src/lib/photo-catalogue.ts                    the registry, GENERATED: ids, master dimensions,
 *                                                 focal point, tone tags, source, rungs
 *
 * The registry is generated rather than imported as JSON so the ids are a literal union
 * (`PhotoId`): a page that names a photo that does not exist fails `tsc`, and a renamed file fails
 * every call site that named it. JSON imports widen every id to `string`.
 *
 * Run `npm run photos:tone` first: the registry carries its tags, and this refuses an entry that has
 * none. `--check` is the gate a stale registry cannot pass.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import * as prettier from 'prettier';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const DIR = 'public/kit/photos';
const DERIVED_DIR = join(DIR, 'derived');
const CATALOGUE = join(DIR, 'catalogue.json');
const REGISTRY = 'src/lib/photo-catalogue.ts';
const PUBLIC_BASE = '/kit/photos';

/** The ladder (Media.md M2). Restated in src/lib/photos.ts's header; change both together. */
const RUNGS = [1240, 652, 320];
/** webp at 82: indistinguishable from the master at 1× and 2× in a side-by-side, a third the bytes. */
const QUALITY = 82;

const check = process.argv.includes('--check');
const problems = [];

const catalogue = JSON.parse(readFileSync(CATALOGUE, 'utf8'));
const stem = (file) => file.replace(/\.webp$/, '');

if (!check) mkdirSync(DERIVED_DIR, { recursive: true });

let written = 0;
for (const entry of catalogue) {
  if (!entry.temperature || !entry.saturation) {
    problems.push(`${entry.file}: no tone tags. Run \`npm run photos:tone\` first.`);
  }
  const master = join(DIR, entry.file);
  const meta = await sharp(master).metadata();
  if (meta.width !== entry.width || meta.height !== entry.height) {
    problems.push(
      `${entry.file}: catalogue says ${entry.width}×${entry.height}, the file is ${meta.width}×${meta.height}.`,
    );
  }
  const rungs = RUNGS.filter((width) => width < entry.width);
  if (JSON.stringify(entry.derived) !== JSON.stringify(rungs)) {
    problems.push(
      `${entry.file}: \`derived\` is ${JSON.stringify(entry.derived)}, should be ${JSON.stringify(rungs)}.`,
    );
    entry.derived = rungs;
  }
  for (const width of rungs) {
    const out = join(DERIVED_DIR, `${stem(entry.file)}-${width}.webp`);
    /* Current means present at the right width. Not mtime: a fresh clone stamps every file with
       the checkout time, so a master can look newer than the rung derived from it. A REPLACED
       master at the same width is the one case this misses; delete its rungs when replacing it. */
    const current = existsSync(out) && (await sharp(out).metadata()).width === width;
    if (current) continue;
    if (check) {
      problems.push(`${out}: missing or not ${width}px wide.`);
      continue;
    }
    await sharp(master).resize({ width }).webp({ quality: QUALITY }).toFile(out);
    written += 1;
  }
}

/* ── The registry ─────────────────────────────────────────────────────────────── */
const SOURCE = { 'tcules-about': 'studio', 'tcules-studio': 'studio', unsplash: 'stock', pexels: 'stock' };

const rows = catalogue.map((entry) => {
  const source = SOURCE[entry.source];
  if (!source) problems.push(`${entry.file}: unknown source ${JSON.stringify(entry.source)}.`);
  const id = stem(entry.file);
  return `  ${JSON.stringify(id)}: {
    src: ${JSON.stringify(`${PUBLIC_BASE}/${entry.file}`)},
    width: ${entry.width},
    height: ${entry.height},
    focus: { x: ${entry.focalPoint.x}, y: ${entry.focalPoint.y} },
    temperature: ${JSON.stringify(entry.temperature)},
    saturation: ${JSON.stringify(entry.saturation)},
    source: ${JSON.stringify(source)},
    derived: [${(entry.derived ?? []).join(', ')}],
  },`;
});

const header = `/**
 * GENERATED by \`npm run photos:derive\` from public/kit/photos/catalogue.json. Do not edit: change
 * the catalogue (or the files) and re-run \`npm run photos:tone && npm run photos:derive\`.
 * \`npm run photos:derive -- --check\` fails when this file is stale.
 *
 * The raw registry. Read it through src/lib/photos.ts (\`getKitPhoto\`), which turns an entry into
 * an image record; nothing else should import this file.
 *
 * A leaf: imports nothing.
 */`;

const source = `${header}
export const PHOTO_CATALOGUE = {
${rows.join('\n')}
} as const;

/** Every photograph in the kit catalogue, by its file stem. */
export type PhotoId = keyof typeof PHOTO_CATALOGUE;
`;

const options = { ...(await prettier.resolveConfig(REGISTRY)), filepath: REGISTRY };
const formatted = await prettier.format(source, options);
const stale = !existsSync(REGISTRY) || readFileSync(REGISTRY, 'utf8') !== formatted;
if (stale) problems.push(`${REGISTRY}: stale.`);

if (check) {
  if (problems.length > 0) {
    console.error(
      `photos:derive --check — ${problems.length} problem(s):\n  ${problems.join('\n  ')}`,
    );
    console.error('Run `npm run photos:tone && npm run photos:derive`.');
    process.exit(1);
  }
  console.log(
    `photos:derive --check — ${catalogue.length} photographs, every rung and the registry current.`,
  );
} else {
  const blocking = problems.filter((p) => !p.endsWith('stale.') && !p.includes('`derived` is'));
  if (blocking.length > 0) {
    console.error(`photos:derive — refused:\n  ${blocking.join('\n  ')}`);
    process.exit(1);
  }
  writeFileSync(CATALOGUE, `${JSON.stringify(catalogue, null, 2)}\n`);
  if (stale) writeFileSync(REGISTRY, formatted);
  const rungCount = catalogue.reduce((n, e) => n + e.derived.length, 0);
  console.log(
    `photos:derive — ${catalogue.length} masters, ${rungCount} rungs (${written} written now); ` +
      `registry ${stale ? 'regenerated' : 'unchanged'}.`,
  );
}
