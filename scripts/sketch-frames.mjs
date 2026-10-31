#!/usr/bin/env node
/**
 * Capture a tile drawing's move, so a drawing can be judged without a browser.
 *
 *   npm run sketch:frames -- specialist-research specialist-ui     these scenes
 *   npm run sketch:frames -- --base=http://localhost:3000 ...      an explicit server
 *
 * For each scene it hovers that scene's live tile on /design/sketch (S.7, paper) and writes to
 * `.shots/frames/` (gitignored):
 *   <scene>.png   one strip: rest | mid-move | moved, at 2x, the size a critic reads
 *   <scene>@1x.png   the moved state at 1x, the size the tile really renders, for the one-second test
 * and prints one JSON line per scene with the motion measured, so "is the move noticeable" is a number:
 *   changed   share of the drawing's inked pixels that differ between rest and moved
 *   spanX/Y   the changed region's extent as a share of the drawing's width / height
 *   traceUnits total length, in drawing units, of the routes that draw themselves (TraceIn and story trace)
 * The server is found as `npm run shots` finds it: --base, else this checkout's own `next dev` lock.
 * It never starts a server or probes a well-known port.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const OUT = join('.shots', 'frames');
const args = process.argv.slice(2);
const baseArg = args.find((a) => a.startsWith('--base='))?.slice(7);
const names = args.filter((a) => !a.startsWith('--'));

function ownDevServer() {
  try {
    const lock = JSON.parse(readFileSync('.next/dev/lock', 'utf8'));
    process.kill(lock.pid, 0);
    return lock.appUrl ?? `http://localhost:${lock.port}`;
  } catch {
    return null;
  }
}

const base = baseArg ?? ownDevServer();
if (!base) {
  console.error('No server: start `npm run dev` in this checkout, or pass --base=.');
  process.exit(1);
}
if (!names.length) {
  console.error('Name at least one scene.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await page.goto(`${base}/design/sketch`, { waitUntil: 'networkidle' });

async function shot(el) {
  return el.screenshot({ animations: 'allow' });
}

let failed = false;
for (const name of names) {
  let link = page.locator(`#tile-paper-${name}`);
  if (!(await link.count())) link = page.locator(`#story-paper-${name}`);
  if (!(await link.count())) {
    /* A still scene (a plate: cards, What you get): no move to measure, one capture of it as drawn. */
    const plate = page.locator(`svg[data-scene="${name}"]`).first();
    if (!(await plate.count())) {
      console.log(JSON.stringify({ scene: name, error: 'not on /design/sketch' }));
      failed = true;
      continue;
    }
    await plate.scrollIntoViewIfNeeded();
    const still = await shot(plate);
    await sharp(still).png().toFile(join(OUT, `${name}.png`));
    await sharp(still)
      .resize(Math.round((await sharp(still).metadata()).width / 2))
      .png()
      .toFile(join(OUT, `${name}@1x.png`));
    console.log(JSON.stringify({ scene: name, still: true, strip: join(OUT, `${name}.png`) }));
    continue;
  }
  const svg = link.locator('svg');
  await svg.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(700);
  const rest = await shot(svg);
  await link.hover();
  await page.waitForTimeout(140);
  const mid = await shot(svg);
  await page.waitForTimeout(700);
  const moved = await shot(svg);
  const traceUnits = await svg.evaluate((el) =>
    [...el.querySelectorAll('path[pathLength]')].reduce((n, p) => n + p.getTotalLength(), 0),
  );

  const a = await sharp(rest).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const b = await sharp(moved).raw().ensureAlpha().toBuffer();
  const { width, height } = a.info;
  const bg = [a.data[0], a.data[1], a.data[2]];
  let inked = 0;
  let changed = 0;
  let x0 = width;
  let y0 = height;
  let x1 = -1;
  let y1 = -1;
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const ink = (d) => Math.abs(d[o] - bg[0]) + Math.abs(d[o + 1] - bg[1]) + Math.abs(d[o + 2] - bg[2]) > 24;
    if (ink(a.data) || ink(b)) inked++;
    const diff =
      Math.abs(a.data[o] - b[o]) + Math.abs(a.data[o + 1] - b[o + 1]) + Math.abs(a.data[o + 2] - b[o + 2]);
    if (diff > 48) {
      changed++;
      const x = i % width;
      const y = Math.floor(i / width);
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
    }
  }

  const gap = 24;
  await sharp({
    create: { width: width * 3 + gap * 2, height, channels: 4, background: '#ffffff' },
  })
    .composite([
      { input: rest, left: 0, top: 0 },
      { input: mid, left: width + gap, top: 0 },
      { input: moved, left: (width + gap) * 2, top: 0 },
    ])
    .png()
    .toFile(join(OUT, `${name}.png`));
  await sharp(moved)
    .resize(Math.round(width / 2))
    .png()
    .toFile(join(OUT, `${name}@1x.png`));

  const pct = (n) => Math.round(n * 100);
  console.log(
    JSON.stringify({
      scene: name,
      changed: pct(changed / Math.max(inked, 1)),
      spanX: x1 < 0 ? 0 : pct((x1 - x0) / width),
      spanY: y1 < 0 ? 0 : pct((y1 - y0) / height),
      traceUnits: Math.round(traceUnits),
      strip: join(OUT, `${name}.png`),
    }),
  );
}

await browser.close();
process.exit(failed ? 1 : 0);
