#!/usr/bin/env node
/**
 * The smallest set of site pages that shows every responsive behaviour the site has.
 *
 *   npm run build && npm run responsive:census
 *   npm run responsive:census -- --base=http://localhost:3000   read an explicit server instead
 *   npm run responsive:census -- --json                          the result as JSON, for a script
 *
 * Why this exists: the responsive check (tracker 6.5) is reviewed by eye, at four widths. Opening all
 * 253 pages four times is not a review anyone does well, and a hand-picked sample misses whatever its
 * picker forgot. This picks pages from what they actually render, so the owner looks at the fewest
 * pages that between them show every component and every rule that changes with the width.
 *
 * What counts as a "behaviour" (a unit to cover):
 *   - every component that renders on any page (`Accordion`, `CaseCard`, `CorpusPage` …): its
 *     composition changes with the width even where its own CSS has no media query, because the
 *     Layout it sits in does;
 *   - every CSS-module class written inside a width `@media` or an `@container` block
 *     (`Proof.quoteBeside`, `Layout.equal-rows-md`): the rules that change shape at a breakpoint.
 * A page covers the units whose classes appear in its HTML (CSS-module classes keep their name in the
 * build as `<Module>-module__<hash>__<class>`). Pages are then chosen greedily: each pick is the page
 * that adds the most uncovered units, until none is left. A greedy cover is within a small factor of
 * the true minimum and, unlike the minimum, explains itself: every pick lists what it added.
 *
 * What it cannot see: a Layout's per-breakpoint tracks (they are inline custom properties, not
 * classes) and content stress (a long title, a short one). Both are covered by the component they sit
 * in being on the list, and by the review guide asking for the longest instance: docs/responsive-check.md.
 *
 * Server: `--base` if given; otherwise a fresh `next start` of THIS checkout's build on a free port,
 * stopped at the end. Never a well-known port: in a worktree that answers with another checkout's code
 * (see scripts/shots.mjs).
 */
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:net';
import { basename, join } from 'node:path';

const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith('--base='))?.slice('--base='.length);
const asJson = args.includes('--json');

const SITEMAP = '.next/server/app/sitemap.xml.body';
if (!existsSync(SITEMAP)) {
  console.error(`responsive:census — no ${SITEMAP}. Run \`npm run build\` first.`);
  process.exit(1);
}

/* ── 1. The responsive classes, from the CSS modules ─────────────────────────────────────────── */

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.module.css')) out.push(p);
  }
  return out;
}

/** Selector text of every rule inside a width @media or @container block, nesting included. */
function responsiveSelectors(css) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const found = [];
  const re = /@(media|container)([^{]*)\{/g;
  let m;
  while ((m = re.exec(text))) {
    const isWidth = m[1] === 'container' || /(min|max)-width|width\s*[<>]/.test(m[2]);
    if (!isWidth) continue;
    let depth = 1;
    let i = re.lastIndex;
    const start = i;
    while (i < text.length && depth > 0) {
      if (text[i] === '{') depth++;
      else if (text[i] === '}') depth--;
      i++;
    }
    const body = text.slice(start, i - 1);
    // A selector is the text before each `{`, after the previous `;`, `{` or `}`.
    for (const sel of body.matchAll(/(?:^|[;{}])\s*([^;{}@]+?)\s*\{/g)) found.push(sel[1]);
  }
  return found;
}

const responsive = new Map(); // module name → Set of class names inside a width query
for (const file of walk('src')) {
  const mod = basename(file).replace(/\.module\.css$/, '');
  const set = responsive.get(mod) ?? new Set();
  for (const sel of responsiveSelectors(readFileSync(file, 'utf8'))) {
    for (const c of sel.matchAll(/\.([A-Za-z_][\w-]*)/g)) set.add(c[1]);
  }
  responsive.set(mod, set);
}

/* ── 2. The pages, as the site serves them ───────────────────────────────────────────────────── */

const paths = [...readFileSync(SITEMAP, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const u = new URL(m[1]);
  return u.pathname === '' ? '/' : u.pathname;
});

function freePort() {
  return new Promise((res) => {
    const s = createServer();
    s.listen(0, () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
  });
}

async function startServer() {
  const port = await freePort();
  const child = spawn('npx', ['next', 'start', '-p', String(port)], { stdio: 'ignore' });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(base + '/sitemap');
      if (r.ok) return { base, child };
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  child.kill();
  throw new Error('next start did not answer within 60s');
}

const server = baseArg ? { base: baseArg.replace(/\/$/, ''), child: null } : await startServer();

const CLASS = /([A-Za-z][A-Za-z0-9]*)-module__[A-Za-z0-9_-]{6}__([A-Za-z0-9_-]+)/g;
const pages = new Map(); // path → Set of units
const failed = [];
try {
  const queue = [...paths];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) {
        const path = queue.shift();
        try {
          const r = await fetch(server.base + path);
          if (!r.ok) throw new Error(String(r.status));
          const html = await r.text();
          const units = new Set();
          for (const attr of html.matchAll(/class="([^"]+)"/g)) {
            for (const [, mod, cls] of attr[1].matchAll(CLASS)) {
              units.add(mod);
              if (responsive.get(mod)?.has(cls)) units.add(`${mod}.${cls}`);
            }
          }
          pages.set(path, units);
        } catch (e) {
          failed.push(`${path} (${e.message})`);
        }
      }
    }),
  );
} finally {
  server.child?.kill();
}

/* ── 3. The greedy cover ─────────────────────────────────────────────────────────────────────── */

const universe = new Set([...pages.values()].flatMap((s) => [...s]));
const left = new Set(universe);
const picks = [];
while (left.size) {
  let best = null;
  let gain = [];
  for (const [path, units] of pages) {
    const g = [...units].filter((u) => left.has(u));
    // Ties go to the shorter path: a hub page is easier to find than a deep one.
    if (g.length > gain.length || (g.length === gain.length && best && path.length < best.length)) {
      best = path;
      gain = g;
    }
  }
  if (!gain.length) break;
  gain.forEach((u) => left.delete(u));
  picks.push({ path: best, adds: gain.sort() });
}

// Responsive classes no page renders: specimen-only, or dead. Reported, not covered.
const unrendered = [...responsive]
  .flatMap(([mod, set]) => [...set].map((c) => `${mod}.${c}`))
  .filter((u) => !universe.has(u))
  .sort();

if (asJson) {
  console.log(JSON.stringify({ pages: pages.size, units: universe.size, picks, unrendered, failed }, null, 2));
} else {
  console.log(
    `responsive:census — ${pages.size} pages, ${universe.size} units (components + width-dependent classes)\n` +
      `${picks.length} pages cover all of them:\n`,
  );
  let covered = 0;
  for (const [i, p] of picks.entries()) {
    covered += p.adds.length;
    const pct = Math.round((covered / universe.size) * 100);
    console.log(`${String(i + 1).padStart(2)}. ${p.path}  (+${p.adds.length}, ${pct}%)`);
    const comps = p.adds.filter((u) => !u.includes('.'));
    const rules = p.adds.filter((u) => u.includes('.'));
    if (comps.length) console.log(`      components: ${comps.join(', ')}`);
    if (rules.length) console.log(`      rules:      ${rules.join(', ')}`);
  }
  if (unrendered.length)
    console.log(`\nWidth-dependent classes no page renders (specimen-only, or dead): ${unrendered.length}\n  ${unrendered.join(', ')}`);
  if (failed.length) console.log(`\nCould not fetch: ${failed.join(', ')}`);
}
process.exit(failed.length ? 1 : 0);
