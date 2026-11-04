#!/usr/bin/env node
/**
 * Draw one labelled placeholder per row of docs/image-register.md, and write the manifest a page
 * reads (page-mapping § 5, G5).
 *
 *   npm run placeholders            write public/placeholders/*.svg and src/lib/placeholders.generated.ts
 *   npm run placeholders -- --check exit 1 if either is stale; writes nothing
 *
 * An image slot the corpus does not yet bind is a PLACEHOLDER, not a stock photograph and not a
 * generated image: a neutral panel at the slot's reserved ratio, a hairline, and a label that says
 * what the slot is for ("Image to come · studio photo") and what it must show. The label is part of
 * the placeholder and not type laid over an image, so ch05's "no type on images" is not engaged.
 * When the real asset lands, the page's record points at it and the register row is deleted; this
 * script then stops drawing the panel.
 *
 * Keys, which the page looks up (`placeholderImage`, src/lib/placeholders.ts):
 *   `<route>#<band>`                  a band's own slot ("/services/product-design#starting-points")
 *   `<route>#<band>:<qualifier>`      a band with two slots ("/expertise/healthtech#proof:curamcare")
 *   `case-cover:<slug>`               a case's cover, ONE asset for every page that cites the case
 *   `illustration:<slug>`             a claim or reason's illustration slot, by its title; `illustration:pending`
 *                                     is the fallback for a title with no row of its own
 * Icon rows (client logo marks) are not drawn: a client without its SVG renders as a typeset
 * wordmark in the logo grid (LogoGrid, G1).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import * as prettier from 'prettier';

const REGISTER = 'docs/image-register.md';
const DIR = 'public/placeholders';
const MANIFEST = 'src/lib/placeholders.generated.ts';
const check = process.argv.includes('--check');

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[`']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const text = readFileSync(REGISTER, 'utf8');
const rows = text
  .split('\n')
  .filter((line) => line.startsWith('|'))
  .map((line) =>
    line
      .slice(1, line.lastIndexOf('|'))
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim()),
  )
  .filter((cells) => cells.length >= 5 && !/^-+$/.test(cells[0]) && cells[0] !== 'Page');

/** @type {Map<string, { file: string; width: number; height: number; kind: string; shows: string; label: string }>} */
const slots = new Map();

for (const [page, bandCell, kindCell, shows, ratioCell] of rows) {
  const kind = kindCell.toLowerCase();
  if (kind === 'icon') continue;
  const ratio = /(\d+):(\d+)/.exec(ratioCell);
  if (!ratio) continue;
  const [rw, rh] = [Number(ratio[1]), Number(ratio[2])];
  const k = 1600 / Math.max(rw, rh);
  const width = Math.round(rw * k);
  const height = Math.round(rh * k);

  const cover = /^(case cover|illustration):\s*(.+)$/i.exec(bandCell);
  const entries = [];
  if (cover) {
    /* A case's cover, or a claim or reason's illustration slot keyed by its title as authored: both
       are ONE asset for every page that carries them, so the key carries no route. */
    const name = cover[2].trim();
    const prefix = /^illustration$/i.test(cover[1]) ? 'illustration' : 'case-cover';
    entries.push({
      key: `${prefix}:${slug(name)}`,
      file: `${prefix}--${slug(name)}`,
      label: name,
    });
  } else {
    const band = /^([a-z0-9-]+)(?:\s*\(([^)]*)\))?/.exec(bandCell);
    if (!band) continue;
    const qualifier = band[2] && !/split from/i.test(band[2]) ? slug(band[2]) : '';
    const route = [...page.matchAll(/`([^`]+)`/g)].map((m) => m[1])[0];
    if (!route) continue;
    const routeSlug = route === '/' ? 'home' : slug(route);
    entries.push({
      key: `${route}#${band[1]}${qualifier ? `:${qualifier}` : ''}`,
      file: `${routeSlug}--${band[1]}${qualifier ? `--${qualifier}` : ''}`,
      label: bandCell,
    });
  }
  for (const entry of entries) {
    slots.set(entry.key, { ...entry, width, height, kind, shows });
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap on a character budget. */
function wrap(s, max) {
  const lines = [];
  let line = '';
  for (const word of s.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > max && line) {
      lines.push(line);
      line = word;
    } else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  return lines;
}

function svgFor({ key, width, height, kind, shows, file }) {
  const unit = Math.min(width, height);
  /* An illustration slot is contained, never cropped, and its smallest showing is 168 wide (a hard-parts
     claim's drawing, a home reason): its label is sized for that, so it is legible there. Every other
     kind is sized off the canvas, as before. */
  const small168 = kind === 'illustration' && file.startsWith('illustration--');
  const k = width / 168;
  const pad = small168 ? Math.round(12 * k) : Math.round(unit * 0.06);
  const small = small168 ? Math.round(8 * k) : Math.round(unit * 0.03);
  const body = small168 ? Math.round(9 * k) : Math.round(unit * 0.038);
  /* The label is set in the panel's central square and centred in the panel, because every placement
     crops: a 3:1 banner is 3:2 on a phone, a 4:5 slot is 6:5 in a photo-weighted split and 4:3 above
     the copy, a 16:9 cover is 4:5 in a story split. Anchored top-left, the label was the first thing
     each crop cut (the careers banner at 390, the case index's story cover). The box is the central
     square less a double pad, so a centre crop down to about 4:5 of the short side keeps the whole
     label (a 3:2 slot in a `asideFill` aside beside a tall accordion is about 0.9:1 at 1440), and one
     panel serves every placement of its slot. */
  const box = small168 ? width - pad * 2 : unit - pad * 4;
  const x = Math.round((width - box) / 2);
  const budget = Math.max(24, Math.floor(box / (body * 0.52)));
  /* The first sentence of the brief, without markup: the panel says what the slot is for, and the
     full brief lives in the register. */
  /* The register's FALLBACK row documents itself for the register's reader; its sentence is a note to
     developers and never a visitor's label, so its panel draws the head alone (review 29 Oct). */
  /* A hero's panel draws the head alone too: beside the title and lede, a sentence in the hero's
     media slot is read as page copy and repeats the lede (critic, audits run, 4 Nov 2026). The brief
     stays in the register for whoever draws it. */
  const brief = /^FALLBACK\b/.test(shows) || /#hero$/.test(key)
    ? ''
    : shows
        /* A parenthetical that names a frontmatter key ("(frontmatter healthtech_asset; …)") is for the
       register's reader, not for the panel's. */
        .replace(/\s*\([^)]*_[^)]*\)/g, '')
        .replace(/`/g, '')
        .split(/(?<=\.)\s/)[0];
  const maxLines = small168 ? 6 : 7;
  const lines = brief ? wrap(brief, budget).slice(0, maxLines) : [];
  const head = small168 ? 'Illustration to come' : `Image to come · ${kind}`;
  /* The label block's height: the head's line, the gap to the brief, then the brief's lines. */
  const block = lines.length
    ? small + Math.round(body * 2.2) + Math.round(body * 1.45) * (lines.length - 1)
    : small;
  const top = Math.round((height - block) / 2);
  /* Neutral and unbranded on purpose: a placeholder must never be mistaken for a finished asset. */
  const tspans = lines
    .map(
      (l, i) =>
        `<tspan x="${x}" dy="${i === 0 ? 0 : Math.round(body * 1.45)}">${esc(l)}${i === maxLines - 1 && wrap(brief, budget).length > maxLines ? '…' : ''}</tspan>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${esc(head)}">
<rect width="${width}" height="${height}" fill="#EEF0F3"/>
<rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#BFC5CF" stroke-width="2" stroke-dasharray="${small} ${small}"/>
<text x="${x}" y="${top + small}" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="${small}" letter-spacing="${(small * 0.1).toFixed(1)}" fill="#4A5361">${esc(head.toUpperCase())}</text>
<text x="${x}" y="${top + small + Math.round(body * 2.2)}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="${body}" fill="#2B323D">${tspans}</text>
</svg>
`;
}

const problems = [];
const files = new Map();
for (const slot of slots.values()) files.set(`${slot.file}.svg`, svgFor(slot));

if (check) {
  for (const [name, svg] of files) {
    const path = join(DIR, name);
    if (!existsSync(path) || readFileSync(path, 'utf8') !== svg)
      problems.push(`stale or missing ${path}`);
  }
  if (existsSync(DIR)) {
    for (const name of readdirSync(DIR)) {
      if (name.endsWith('.svg') && !files.has(name)) problems.push(`orphan ${join(DIR, name)}`);
    }
  }
} else {
  mkdirSync(DIR, { recursive: true });
  for (const name of readdirSync(DIR)) {
    if (name.endsWith('.svg') && !files.has(name)) rmSync(join(DIR, name));
  }
  for (const [name, svg] of files) writeFileSync(join(DIR, name), svg);
}

const entries = [...slots.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(
    ([key, s]) =>
      `  ${JSON.stringify(key)}: { src: ${JSON.stringify(`/placeholders/${s.file}.svg`)}, width: ${s.width}, height: ${s.height}, kind: ${JSON.stringify(s.kind)}, shows: ${JSON.stringify(s.shows)} },`,
  )
  .join('\n');

const manifest = `/**
 * GENERATED by scripts/placeholders.mjs from docs/image-register.md. Do not edit.
 *
 * One entry per register row: the labelled placeholder a page renders where the corpus binds no
 * image yet. Read by \`placeholderImage\` (src/lib/placeholders.ts). Delete the register row when the
 * real asset lands, and this entry goes with it.
 */
export const PLACEHOLDER_SLOTS: Readonly<
  Record<string, { src: string; width: number; height: number; kind: string; shows: string }>
> = {
${entries}
};
`;
const formatted = await prettier.format(manifest, { parser: 'typescript', singleQuote: true });

if (check) {
  if (!existsSync(MANIFEST) || readFileSync(MANIFEST, 'utf8') !== formatted) {
    problems.push(`stale or missing ${MANIFEST}`);
  }
  if (problems.length) {
    console.error(`placeholders — ${problems.length} problem(s):`);
    for (const p of problems) console.error(`  ${p}`);
    console.error('run `npm run placeholders`');
    process.exit(1);
  }
  console.log(`placeholders — ${slots.size} slots, all current`);
} else {
  writeFileSync(MANIFEST, formatted);
  console.log(`placeholders — wrote ${slots.size} slots (${files.size} files) and ${MANIFEST}`);
}
