#!/usr/bin/env node
/**
 * Screenshot public site pages at 1440 and 390 by default.
 *
 *   npm run shots -- --routes=/,/about --widths=1440,1024,768,390
 *   npm run shots -- --base=http://localhost:3000
 *
 * The default route is /. The command writes full-page screenshots and reports overflow and page
 * errors in .shots/. Without --base it uses this checkout's dev server or starts one on a free port.
 */
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
const routesArg = args.find((a) => a.startsWith('--routes='));
const routes = routesArg
  ? routesArg.slice('--routes='.length).split(',').map((route) => route.trim()).filter(Boolean)
  : ['/'];
if (!routes.length || routes.some((route) => !route.startsWith('/') || route.startsWith('//'))) {
  console.error('--routes takes comma-separated site paths, e.g. --routes=/,/about');
  process.exit(1);
}
if (args.some((arg) => !arg.startsWith('--'))) {
  console.error('Pass site paths through --routes, e.g. --routes=/about');
  process.exit(1);
}
const routeSlug = (route) => route.replace(/^\/|\/$/g, '').replaceAll('/', '-') || 'home';

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
    if (await answers(`${base}/`)) return { base, child };
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
if (baseArg && !(await answers(`${base}/`))) {
  console.error(`--base ${base} does not answer.`);
  process.exit(1);
}
if (!base || !(await answers(`${base}/`))) {
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
  for (const path of routes) {
    for (const width of WIDTHS) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const res = await page.goto(base + path, { waitUntil: 'networkidle' });
      if (res && res.status() >= 400)
        errors.push(`HTTP ${res.status()} for ${path}`);
      await page.evaluate(() => document.fonts.ready);
      await loadEveryImage(page);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      const slug = routeSlug(path);
      const file = `${slug}-${width}.png`;
      // Next's dev indicator is a fixed badge in a shadow root (`nextjs-portal`): in a full-page
      // capture it sat over the page's first band, and the owner's crops showed it as page content.
      // Hidden before every capture, full-page and crop alike.
      await page.addStyleTag({ content: 'nextjs-portal { visibility: hidden !important; }' });
      await page.screenshot({ path: join(OUT, file), fullPage: true });
      await page.close();
      report.push({ name: path, width, file, overflowPx: overflow, errors });
      const flag = overflow > 0 ? `  OVERFLOW ${overflow}px` : '';
      const err = errors.length > 0 ? `  ${errors.length} error(s)` : '';
      console.log(`${path} @${width}${flag}${err}`);
    }
  }
} finally {
  await browser.close();
  server?.child.kill();
}

const rows = routes
  .map((name) => {
    const cells = WIDTHS.map((w) => {
      const r = report.find((x) => x.name === name && x.width === w);
      const note = r.overflowPx > 0 ? ` · overflow ${r.overflowPx}px` : '';
      return `<figure><figcaption>${w}${note}</figcaption><a href="${r.file}"><img src="${r.file}" loading="lazy" alt="${name} at ${w}"></a></figure>`;
    }).join('');
    return `<section><h2>${name}</h2><div class="row">${cells}</div></section>`;
  })
  .join('\n');
writeFileSync(
  join(OUT, 'index.html'),
  `<!doctype html><meta charset="utf-8"><title>Page shots</title>
<style>body{font:14px system-ui;margin:24px;background:#f3f1ea}h2{font-size:16px;margin:32px 0 8px}h3{font-size:13px;margin:20px 0 6px}
.row{display:grid;grid-template-columns:3fr 1fr;gap:16px;align-items:start}figure{margin:0}
figcaption{font:12px ui-monospace,monospace;margin-bottom:4px}img{width:100%;border:1px solid #cfcfce;background:#fff}</style>
<h1>Page shots</h1>\n${rows}\n`,
);
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));

const failed = report.filter((r) => r.overflowPx > 0 || r.errors.length > 0);
console.log(`\n${report.length} captures → ${OUT}/index.html · ${failed.length} with problems`);
process.exit(failed.length > 0 ? 1 : 0);
