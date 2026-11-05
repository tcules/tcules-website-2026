// Render illustration SVGs to PNGs for review, on the ground they will sit on.
//
//   node scripts/illustrations/preview.mjs [--ground paper|paper-deep] [--width 860] <out-dir> <file.svg ...>
//
// Writes <out-dir>/<name>.png per SVG, the drawing scaled to --width CSS px. `--small` adds a second PNG at
// the size the slot really renders (pass e.g. --small 400), so a drawing is judged where it will be seen.
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'node:fs';
import { basename } from 'node:path';

const GROUNDS = { paper: '#fffefa', 'paper-deep': '#f3f1ea' };
const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, value] = argv.splice(i, 2);
  return value;
};
const ground = GROUNDS[opt('ground', 'paper')] ?? GROUNDS.paper;
const width = Number(opt('width', '860'));
const small = Number(opt('small', '0'));
const [out, ...files] = argv;
if (!out || files.length === 0) {
  console.error('usage: preview.mjs [--ground paper|paper-deep] [--width N] [--small N] <out-dir> <svg...>');
  process.exit(1);
}
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: width + 64, height: 800 } });
async function shot(svg, w, path) {
  await page.setContent(
    `<html><body style="margin:0;background:${ground};padding:24px;display:inline-block">` +
      `<div id="w" style="width:${w}px">${svg}</div></body></html>`,
  );
  await page.evaluate(() => {
    const s = document.querySelector('#w svg');
    s.removeAttribute('width');
    s.removeAttribute('height');
    s.style.width = '100%';
    s.style.height = 'auto';
    s.style.display = 'block';
  });
  await (await page.$('body')).screenshot({ path });
  console.log(path);
}
for (const f of files) {
  const svg = readFileSync(f, 'utf8');
  const name = basename(f, '.svg');
  await shot(svg, width, `${out}/${name}.png`);
  if (small) await shot(svg, small, `${out}/${name}.at-${small}.png`);
}
await browser.close();
