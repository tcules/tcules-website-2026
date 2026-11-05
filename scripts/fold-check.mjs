/**
 * fold:check — every band fits the fold (visual-direction § 1.3).
 *
 *   npm run fold:check                                   every route in fold.config.json
 *   npm run fold:check -- /about /services              only these public pages
 *   npm run fold:check -- --base=http://localhost:4123   an explicit server, trusted as given
 *
 * A BAND is a Section: the full-width, isolated box Section renders (`isolation: isolate` at the
 * viewport's full width), found from the rendered page rather than from a class name, so the check
 * reads dev and production builds alike. Only TOP-LEVEL bands count (a full-width isolated box with
 * another one above it is part of that band), and the site chrome — a `header` or `footer`, the
 * SiteNav bar and the SiteFooter — is not a band. An element carrying `data-band` always counts. A
 * band carrying, or inside, `data-fold-exempt` is reported and not failed — a long D band, a full
 * route's footer, or the specimen's deliberate failures.
 *
 * HERO: every `[data-fold-hero]` ends inside the first screen once the nav is above it — its height
 * plus the viewport's `nav` is at most the viewport's height. A specimen stacks many heroes on one
 * page, so this is measured per hero rather than by page position. A viewport with no `nav` (390)
 * measures bands only.
 *
 * An exempt measurement is reported with its reason (the attribute's value) and never fails.
 *
 * Viewports and ceilings come from fold.config.json: at 1470 × 830 every band ≤ 830, at 390 every
 * band ≤ 1700. Exit 1 on any band or hero over its ceiling, on a horizontal overflow, or on a page
 * error.
 *
 * Server: as `npm run shots` — this checkout's own `next dev` from its lockfile, or a fresh one on a
 * free port, never a well-known port.
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { chromium } from 'playwright';

const config = JSON.parse(readFileSync('fold.config.json', 'utf8'));
const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith('--base='));
const only = args.filter((a) => !a.startsWith('--'));
const routes = only.length > 0 ? only : config.routes;

async function answers(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

function ownDevServer() {
  try {
    const lock = JSON.parse(readFileSync('.next/dev/lock', 'utf8'));
    process.kill(lock.pid, 0);
    return lock.appUrl ?? `http://localhost:${lock.port}`;
  } catch {
    return null;
  }
}

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

let server = null;
let base = baseArg ? baseArg.slice('--base='.length) : ownDevServer();
if (!base || !(await answers(`${base}/`))) {
  if (baseArg) {
    console.error(`--base ${base} does not answer.`);
    process.exit(1);
  }
  const port = await freePort();
  server = spawn('npx', ['next', 'dev', '--port', String(port)], {
    stdio: 'ignore',
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  });
  base = `http://localhost:${port}`;
  let up = false;
  for (let i = 0; i < 120 && !up; i++) {
    up = await answers(`${base}/`);
    if (!up) await new Promise((r) => setTimeout(r, 1000));
  }
  if (!up) {
    server.kill();
    console.error('next dev did not answer within 120s');
    process.exit(1);
  }
}

const browser = await chromium.launch();
let failures = 0;

for (const route of routes) {
  for (const { width, height, maxBand, nav } of config.viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(String(error)));
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(async () => {
      for (const img of document.images) if (img.loading === 'lazy') img.loading = 'eager';
      await Promise.race([
        Promise.all([...document.images].map((img) => img.decode().catch(() => undefined))),
        new Promise((resolve) => setTimeout(resolve, 15000)),
      ]);
    });
    const result = await page.evaluate(() => {
      const full = document.documentElement.clientWidth;
      const isBox = (el) =>
        getComputedStyle(el).isolation === 'isolate' &&
        el.getBoundingClientRect().width >= full - 1;
      const bands = [...document.querySelectorAll('main *')].filter((el) => {
        if (el.hasAttribute('data-band')) return true;
        if (el.closest('header, footer') || !isBox(el)) return false;
        /* Top-level only: a full-width box inside another is part of that band. */
        for (let p = el.parentElement; p && p.tagName !== 'MAIN'; p = p.parentElement) {
          if (isBox(p)) return false;
        }
        return true;
      });
      const name = (el) =>
        (
          el.closest('[data-kit-variation]')?.getAttribute('data-kit-variation') ??
          el.querySelector('h1, h2')?.textContent ??
          el.id ??
          ''
        )
          .trim()
          .slice(0, 48);
      const exempt = (el) =>
        el.closest('[data-fold-exempt]')?.getAttribute('data-fold-exempt') ?? null;
      const measure = (el) => ({
        height: Math.round(el.getBoundingClientRect().height),
        name: name(el),
        exempt: exempt(el),
      });
      return {
        overflow: document.documentElement.scrollWidth - full,
        bands: bands.map(measure),
        heroes: [...document.querySelectorAll('[data-fold-hero]')].map(measure),
      };
    });

    const over = result.bands.filter((b) => b.height > maxBand);
    /* The hero rule is stated per viewport: a viewport with no `nav` measures bands only. */
    const heroOver =
      nav === undefined ? [] : result.heroes.filter((h) => h.height + nav > height);
    const failed = [...over, ...heroOver].filter((b) => b.exempt === null);
    const tallest = Math.max(0, ...result.bands.map((b) => b.height));
    const ok = failed.length === 0 && result.overflow <= 0 && errors.length === 0;
    if (!ok) failures++;
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} ${route} @ ${width}: ${result.bands.length} bands, tallest ${tallest} (ceiling ${maxBand})` +
        (nav === undefined
          ? ''
          : `, ${result.heroes.length} heroes (hero + nav ${nav} <= ${height})`) +
        (result.overflow > 0 ? `, overflows ${result.overflow}px` : ''),
    );
    for (const band of over) {
      console.log(
        `       ${band.exempt !== null ? 'exempt' : 'over  '} band ${band.height}  ${band.name}` +
          (band.exempt ? `  (${band.exempt})` : ''),
      );
    }
    for (const hero of heroOver) {
      console.log(
        `       ${hero.exempt !== null ? 'exempt' : 'over  '} hero ${hero.height} + nav ${nav}  ${hero.name}` +
          (hero.exempt ? `  (${hero.exempt})` : ''),
      );
    }
    for (const error of errors) console.log(`       page error: ${error}`);
    await page.close();
  }
}

await browser.close();
if (server) server.kill();
if (failures > 0) {
  console.error(`fold:check — ${failures} route × viewport combination(s) failed`);
  process.exit(1);
}
console.log('fold:check — every band and hero fits its fold; no overflow, no page errors');
