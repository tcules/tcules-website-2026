#!/usr/bin/env node
/**
 * Screenshot every `/design/*` specimen at the two widths the tracker checks, 1440 and 390.
 *
 *   npm run shots                        every specimen
 *   npm run shots -- page-hero figure    only these
 *   npm run shots -- --base=http://localhost:3000    an explicit server, trusted as given
 *   npm run shots -- --routes=/,/about,/services/product-design    arbitrary SITE routes
 *   npm run shots -- --widths=1440,1024,768,390    other widths (default 1440 and 390)
 *
 * `--routes=` is the page mode: the listed paths (comma-separated, as the site serves them) are
 * captured full-page at 1440 and 390 with the same overflow and page-error report, written as
 * `<route-slug>-<width>.png` (`/` is `home`, `/services/product-design` is `services-product-design`).
 * It does not run the specimen index or any specimen, and it takes no crops. The server rules below
 * are unchanged and apply to both modes.
 *
 * Why this exists: "checked at 1440 and 390" is on every task's definition of done, and until now
 * it meant a person opening a browser and resizing it. The owner decides; they should not have to
 * look by hand to find out whether there is something to decide. This makes the look a file.
 *
 * What it writes, to `.shots/` (gitignored):
 *   <name>-1440.png, <name>-390.png    full-page captures
 *   index.html                         a contact sheet of all of them, side by side per specimen
 *   report.json                        per capture: page errors, and horizontal overflow
 *   <name>-<width>/NN-<title>.png      one crop per `Specimen` block, **only when specimens are named**
 *                                      on the command line: a targeted review wants the one row that
 *                                      changed, not a 45,000px page. A full run stays full-page only.
 *
 * It also checks one thing no other gate sees: **horizontal overflow**. A page wider than its
 * viewport scrolls sideways on a phone, and CLAUDE.md requires no horizontal page scroll. The
 * process exits 1 when any capture overflows or throws, so it can gate a PR like `verify` does.
 *
 * Server — it must be THIS checkout's code, never whatever happens to answer on a port:
 *   1. `--base`, if given. Explicit, so trusted.
 *   2. Otherwise this directory's own running `next dev`, found through `.next/dev/lock` — Next 16
 *      writes the pid and URL there, and the same lockfile stops a second `next dev` starting in
 *      this directory, so reusing it is the only option when one is running.
 *   3. Otherwise a fresh `next dev` on a free port, stopped at the end.
 * It used to fall back to http://localhost:3000 when that answered. In a worktree that silently
 * screenshotted the MAIN checkout's server — other code, other branch — and reported its problems
 * (and its passes) as this checkout's. Never probe a well-known port. Routes are discovered from `src/app/design/*`, so a new specimen is covered without an
 * edit here. The underscore-prefixed harness (`_specimen`) is not a route and is skipped.
 */
import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:net';
import { join } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);

// 1440 and 390 by default, the two widths every task's definition of done names. The responsive
// check (docs/responsive-check.md) adds 1024 and 768: `--widths=1440,1024,768,390`.
const widthsArg = args.find((a) => a.startsWith('--widths='));
const WIDTHS = widthsArg
  ? widthsArg.slice('--widths='.length).split(',').map(Number)
  : [1440, 390];
if (WIDTHS.some((w) => !Number.isInteger(w) || w < 320)) {
  console.error('--widths takes comma-separated pixel widths of 320 or more, e.g. --widths=1440,1024,768,390');
  process.exit(1);
}
const OUT = '.shots';
const baseArg = args.find((a) => a.startsWith('--base='));
const only = args.filter((a) => !a.startsWith('--'));
const routesArg = args.find((a) => a.startsWith('--routes='));
const pageRoutes = routesArg
  ? routesArg
      .slice('--routes='.length)
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
  : null;
if (pageRoutes && (pageRoutes.length === 0 || pageRoutes.some((r) => !r.startsWith('/')))) {
  console.error(
    '--routes takes comma-separated paths that start with /, e.g. --routes=/,/about',
  );
  process.exit(1);
}
if (pageRoutes && only.length > 0) {
  console.error('--routes and named specimens are separate modes; use one.');
  process.exit(1);
}
/** `/` -> `home`, `/services/product-design` -> `services-product-design`. */
const routeSlug = (r) => r.replace(/^\/|\/$/g, '').replaceAll('/', '-') || 'home';

const designDir = 'src/app/design';
/* Every specimen route under design/, nested ones included (`kit/cta`). A folder is a route only if
   it holds a page.tsx: the top-level-only listing captured `/design/kit` (a 404, no page) and never
   reached the eleven kit specimens under it, so a full run reported 0 problems for pages it had not
   opened. `_`-prefixed (the harness) and `[dynamic]` segments are not specimen routes. */
function specimenRoutes(dir, prefix = '') {
  return readdirSync(dir)
    .filter(
      (d) => !d.startsWith('_') && !d.startsWith('[') && statSync(join(dir, d)).isDirectory(),
    )
    .flatMap((d) => {
      const name = prefix + d;
      const own = existsSync(join(dir, d, 'page.tsx')) ? [name] : [];
      return [...own, ...specimenRoutes(join(dir, d), `${name}/`)];
    });
}
const all = pageRoutes ? [] : specimenRoutes(designDir);
/* A nested specimen (`kit/cta`) is named by its path under design/ and must have a page. */
const unknown = only.filter(
  (n) => !all.includes(n) && !existsSync(join(designDir, n, 'page.tsx')),
);
if (unknown.length > 0) {
  console.error(`No specimen route for: ${unknown.join(', ')}`);
  process.exit(1);
}
const names = pageRoutes ? pageRoutes : only.length > 0 ? only : ['index', ...all];

async function answers(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

/** This directory's own running `next dev`, from the lockfile Next 16 writes — or null. */
function ownDevServer() {
  try {
    const lock = JSON.parse(readFileSync('.next/dev/lock', 'utf8'));
    process.kill(lock.pid, 0); // throws if the process is gone and the lock is stale
    return lock.appUrl ?? `http://localhost:${lock.port}`;
  } catch {
    return null;
  }
}

/** A port nothing is listening on, from the OS rather than a guess. */
function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function startServer() {
  const port = await freePort();
  const child = spawn('npx', ['next', 'dev', '--port', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 120; i++) {
    if (await answers(`${base}/design`)) return { base, child };
    await new Promise((r) => setTimeout(r, 1000));
  }
  child.kill();
  throw new Error('next dev did not answer within 120s');
}

/**
 * Load every image on the page before it is captured.
 *
 * A full-page screenshot never scrolls, so a `loading="lazy"` image below the first viewport is never
 * requested: it was captured as its empty box. Every BlockCard cover is lazy, so every case card on a
 * service page came out as a hairline frame with nothing in it, and the frames were read as an
 * empty-frame bug in the component (visual-direction § 5.7). The page was fine; the capture was not.
 * Each lazy image is switched to eager and awaited until decoded, capped so one stalled CDN request
 * cannot hang the run.
 */
async function loadEveryImage(page) {
  await page.evaluate(async () => {
    const images = [...document.images];
    for (const img of images) if (img.loading === 'lazy') img.loading = 'eager';
    /* decode() settles once the file has loaded AND decoded — rejecting for a broken one, which is
       left broken so it shows as broken. `complete` alone was not enough: an image switched from
       lazy could report complete before its pixels were painted, and was captured blank. */
    const settle = (img) => img.decode().catch(() => undefined);
    await Promise.race([
      Promise.all(images.map(settle)),
      new Promise((resolve) => setTimeout(resolve, 15000)),
    ]);
  });
}

let server = null;
let base = baseArg ? baseArg.slice('--base='.length) : ownDevServer();
if (baseArg && !(await answers(`${base}/design`))) {
  console.error(`--base ${base} does not answer.`);
  process.exit(1);
}
if (!base || !(await answers(`${base}/design`))) {
  server = await startServer();
  base = server.base;
}
console.log(
  `shots: ${base} (${baseArg ? '--base' : server ? 'started here' : "this checkout's next dev"})`,
);

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const report = [];

try {
  for (const name of names) {
    const path = pageRoutes ? name : name === 'index' ? '/design' : `/design/${name}`;
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(base + path, { waitUntil: 'networkidle' });
      if (pageRoutes && res && res.status() >= 400)
        errors.push(`HTTP ${res.status()} for ${path}`);
      await page.evaluate(() => document.fonts.ready);
      await loadEveryImage(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      const slug = pageRoutes ? routeSlug(name) : name.replaceAll('/', '-');
      const file = `${slug}-${width}.png`;
      // Next's dev indicator is a fixed badge in a shadow root (`nextjs-portal`): in a full-page
      // capture it sat over the page's first band, and the owner's crops showed it as page content.
      // Hidden before every capture, full-page and crop alike.
      await page.addStyleTag({ content: 'nextjs-portal { visibility: hidden !important; }' });
      await page.screenshot({ path: join(OUT, file), fullPage: true });
      const crops = [];
      if (only.length > 0) {
        // A Specimen's root carries the harness's `spec` module class, hashed by CSS Modules as
        // `specimen-module__<hash>__spec`; its title is the first <p>. Tag the roots, then crop each.
        await page.evaluate(() => {
          document.querySelectorAll('[class]').forEach((el) => {
            if ([...el.classList].some((c) => /^specimen-module__\w+__spec$/.test(c)))
              el.setAttribute('data-shot', '');
          });
          // A sticky or fixed element OUTSIDE every block (the SiteNav) is painted over whatever a
          // block crop scrolls under it, so the crop showed the nav across the thing under test.
          // Hidden, not unstuck: `visibility` keeps its box, so nothing below it moves.
          document.querySelectorAll('body *').forEach((el) => {
            const { position } = getComputedStyle(el);
            if ((position === 'sticky' || position === 'fixed') && !el.closest('[data-shot]'))
              el.style.visibility = 'hidden';
          });
          // Next's dev indicator draws its fixed badge inside a shadow root, which the walk above
          // cannot see into, so its host is hidden by name.
          document
            .querySelectorAll('nextjs-portal')
            .forEach((el) => (el.style.visibility = 'hidden'));
        });
        const blocks = page.locator('[data-shot]');
        const count = await blocks.count();
        const dir = `${slug}-${width}`;
        mkdirSync(join(OUT, dir), { recursive: true });
        for (let i = 0; i < count; i++) {
          const block = blocks.nth(i);
          const title = ((await block.locator('p').first().textContent()) ?? '').trim();
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 60);
          const crop = `${dir}/${String(i + 1).padStart(2, '0')}-${slug || 'untitled'}.png`;
          // A block that holds only its title and note is a band-level specimen note: what it
          // describes follows it as full-width Sections (CtaSection's ladders), so a crop of the
          // block alone was the note and nothing else. Crop from the note's band to the next
          // block's band instead, full width, out of a full-page capture.
          const clip = await block.evaluate((el) => {
            if ([...el.children].some((c) => c.tagName !== 'P')) return null;
            const band = (n) => n.closest('[data-surface]') ?? n;
            const all = [...document.querySelectorAll('[data-shot]')];
            const next = all[all.indexOf(el) + 1];
            const top = band(el).getBoundingClientRect().top + window.scrollY;
            const end = next
              ? band(next).getBoundingClientRect().top + window.scrollY
              : document.documentElement.scrollHeight;
            return {
              x: 0,
              y: top,
              width: document.documentElement.clientWidth,
              height: end - top,
            };
          });
          if (clip && clip.height > 0) {
            await page.screenshot({ path: join(OUT, crop), fullPage: true, clip });
          } else {
            await block.screenshot({ path: join(OUT, crop) });
          }
          crops.push({ title, file: crop });
        }
      }
      await page.close();
      report.push({ name, width, file, overflowPx: overflow, errors, crops });
      const flag = overflow > 0 ? `  OVERFLOW ${overflow}px` : '';
      const err = errors.length > 0 ? `  ${errors.length} error(s)` : '';
      console.log(`${path} @${width}${flag}${err}`);
    }
  }
} finally {
  await browser.close();
  server?.child.kill();
}

const rows = names
  .map((name) => {
    const cells = WIDTHS.map((w) => {
      const r = report.find((x) => x.name === name && x.width === w);
      const note = r.overflowPx > 0 ? ` · overflow ${r.overflowPx}px` : '';
      return `<figure><figcaption>${w}${note}</figcaption><a href="${r.file}"><img src="${r.file}" loading="lazy" alt="${name} at ${w}"></a></figure>`;
    }).join('');
    const crops = WIDTHS.map((w) => report.find((x) => x.name === name && x.width === w).crops);
    const blocks = crops[0]
      .map((c, i) => {
        const pair = crops
          .map((list, j) =>
            list[i]
              ? `<figure><figcaption>${WIDTHS[j]}</figcaption><img src="${list[i].file}" loading="lazy" alt=""></figure>`
              : '',
          )
          .join('');
        return `<h3>${c.title}</h3><div class="row">${pair}</div>`;
      })
      .join('');
    return `<section><h2>${name}</h2><div class="row">${cells}</div>${blocks}</section>`;
  })
  .join('\n');
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>${pageRoutes ? 'Page' : 'Specimen'} shots</title>
<style>body{font:14px system-ui;margin:24px;background:#f3f1ea}h2{font-size:16px;margin:32px 0 8px}h3{font-size:13px;margin:20px 0 6px}
.row{display:grid;grid-template-columns:3fr 1fr;gap:16px;align-items:start}figure{margin:0}
figcaption{font:12px ui-monospace,monospace;margin-bottom:4px}img{width:100%;border:1px solid #cfcfce;background:#fff}</style>
<h1>${pageRoutes ? 'Page' : 'Specimen'} shots</h1>\n${rows}\n`,
);
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));

const failed = report.filter((r) => r.overflowPx > 0 || r.errors.length > 0);
console.log(`\n${report.length} captures → ${OUT}/index.html · ${failed.length} with problems`);
process.exit(failed.length > 0 ? 1 : 0);
