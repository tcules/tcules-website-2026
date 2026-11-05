// Generator for the /expertise/edtech-learning hero (v7: healthtech's plate and scale; the tablet plainly held).
//   node docs/illustrations/run-2026-11-05/expertise-edtech-learning/build.mjs
// Writes hero.svg beside this file. World units on the family's 2:1 iso (as expertise.svg):
//   screen x = 0.9x - 0.9y, screen y = 0.45x + 0.45y - z
// Floor faces use matrix(0.9 0.45 -0.9 0.45), upright faces facing +y use matrix(0.9 0.45 0 1).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const C = {
  b500: '#0048FF', b600: '#003EE0', b700: '#0031B0', b300: '#8AA5FF', b200: '#B8C8FF',
  b100: '#DBE4FF', b50: '#EEF2FF', w: '#FFFFFF', lime: '#D7F04A', limeD: '#A1B71F', ink: '#1B1B18',
};
const P = (x, y, z = 0) => [0.9 * x - 0.9 * y, 0.45 * x + 0.45 * y - z];
const f = (n) => (Math.round(n * 10) / 10).toString();
const pts = (a) => a.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
const out = [];
const B = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
const grow = (a) => a.forEach(([x, y]) => {
  B.x0 = Math.min(B.x0, x); B.y0 = Math.min(B.y0, y); B.x1 = Math.max(B.x1, x); B.y1 = Math.max(B.y1, y);
});
const SW = 1.6, SWI = 1.2;
const J = 'stroke-linejoin="round" stroke-linecap="round"';
const poly = (a, fill, stroke = C.b500, sw = SW) => {
  grow(a);
  out.push(`<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${J}/>`);
};
const raw = (s) => out.push(s);

// Axis-aligned box. Visible faces: +y (front-left), +x (front-right), top.
function box(x0, y0, z0, w, d, h, { top, left, right, stroke = C.b500, sw = SW }) {
  const x1 = x0 + w, y1 = y0 + d, z1 = z0 + h;
  poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], left, stroke, sw);
  poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], right, stroke, sw);
  poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], top, stroke, sw);
}

// Convex hull (monotone chain) for extruded convex shapes.
function hull(p) {
  const a = [...p].sort((m, n) => m[0] - n[0] || m[1] - n[1]);
  const cr = (o, s, t) => (s[0] - o[0]) * (t[1] - o[1]) - (s[1] - o[1]) * (t[0] - o[0]);
  const lo = [], up = [];
  for (const q of a) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of a.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
}
// Rounded rect in local (u right, v down) sampled.
function rr(u0, v0, w, h, r, n = 10) {
  const a = [];
  const c = (cu, cv, t0) => { for (let i = 0; i <= n; i++) { const t = t0 + (i / n) * Math.PI / 2; a.push([cu + r * Math.cos(t), cv + r * Math.sin(t)]); } };
  c(u0 + w - r, v0 + r, -Math.PI / 2); c(u0 + w - r, v0 + h - r, 0); c(u0 + r, v0 + h - r, Math.PI / 2); c(u0 + r, v0 + r, Math.PI);
  return a;
}
// Upright plane facing +y at world y, local origin at world (x0, y, ztop): u along +x, v down.
const U = (x0, y, ztop) => { const [sx, sy] = P(x0, y, ztop); return (u, v) => [sx + 0.9 * u, sy + 0.45 * u + v]; };
const Utf = (x0, y, ztop) => { const [sx, sy] = P(x0, y, ztop); return `matrix(0.9 0.45 0 1 ${f(sx)} ${f(sy)})`; };

// ---------------------------------------------------------------- scene constants
// v7 (family fix): healthtech's plate and healthtech's scale. The staircase is about the footprint of healthtech's
// open case (it was several times the hub's scale and filled a narrow strip of floor edge to edge).
const env = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
// Healthtech's plate: 545 × 402 with the 45 inset. Turned a quarter so its long side runs along the climb (−y).
const FL = { w: env('FW', 402), d: env('FD', 545) };
// Four piles of books climb along −y (up and to the right on screen) toward the cap; each pile also steps a
// little along −x, as books do, which keeps the stair centred on the plate.
const BK = { w: env('BW', 130), d: env('BD', 64), cover: 5, pages: env('BP', 36) };
const bookH = BK.cover * 2 + BK.pages;
const PITCH = env('PITCH', 70), DRIFT = env('DRIFT', 12);
const BACK = { x: env('BX', 50), y: env('BY', 56) };
const piles = [1, 2, 3, 4].map((n, i) => ({ n, x: BACK.x + (3 - i) * DRIFT, y: BACK.y + (3 - i) * PITCH }));
const LEARNER_ON = 1, NEXT = 2, CAP_ON = 3;
const limeTop = (NEXT + 1) * bookH; // top of the lime book
// Healthtech's people scale (gen.mjs): body radius 22, body 62, head 16; one arm 11 thick with its outline.
const PW = { r: 22, h: 62, head: 16, arm: 11 };
// The learner's tablet, held at the learner's right over the step (never past its edge), its screen facing the
// viewer (+y). Its lime next-lesson row sits at the lime book's top, so the dashed tie runs level along −y.
const TB = { dx: env('TDX', 53), dy: env('TDY', 6), w: env('TW', 56), h: env('TH', 42), t: 5, r: 7, rowFromTop: env('TR', 33), tie: env('TIE', 40) };

// ---------------------------------------------------------------- floor (healthtech's plate, the family standard)
{
  const corners = [P(0, 0), P(FL.w, 0), P(FL.w, FL.d), P(0, FL.d)];
  grow(corners);
  raw(`<defs><pattern id="ed-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b500}" fill-opacity="0.38"/></pattern></defs>`);
  raw(`<g transform="matrix(0.9 0.45 -0.9 0.45 0 0)"><rect width="${FL.w}" height="${FL.d}" fill="url(#ed-dots)"/><rect width="${FL.w}" height="${FL.d}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FL.w - 90}" height="${FL.d - 90}" fill="${C.b500}" fill-opacity="0.07"/></g>`);
}

// ---------------------------------------------------------------- books and the cap (the hub's object)
let limeBook;
function book(x0, y0, z0, { next = false } = {}) {
  const { w, d, cover, pages } = BK;
  const cv = next ? { top: C.lime, left: C.lime, right: C.limeD, stroke: C.limeD } : { top: C.b100, left: C.b200, right: C.b300 };
  box(x0, y0, z0, w, d, cover, cv);
  // page block, set in from the front and the right
  box(x0 + 2, y0 + 2, z0 + cover, w - 6, d - 6, pages, { top: C.w, left: C.w, right: C.b50 });
  const fl = U(x0 + 2, y0 + d - 4, z0 + cover + pages);
  for (const k of [10, 20]) {
    const a = fl(7, k), b = fl(w - 6 - 7, k);
    raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b300}" stroke-width="1" fill="none" ${J}/>`);
  }
  box(x0, y0, z0 + cover + pages, w, d, cover, cv);
  if (next) limeBook = { x0, y0 };
  return z0 + bookH;
}
function cap(cx, cy, z) {
  const L = 62, crownR = 21, crownH = 18, bt = 5;
  const [ex, ey] = P(cx, cy, z);
  raw(`<path d="M${f(ex - crownR)} ${f(ey - crownH)} V${f(ey)} A${crownR} ${crownR / 2} 0 0 0 ${f(ex + crownR)} ${f(ey)} V${f(ey - crownH)} Z" fill="${C.b700}" stroke="${C.b700}" stroke-width="${SW}" ${J}/>`);
  grow([[ex - crownR, ey + crownR / 2]]);
  const bz = z + crownH;
  box(cx - L / 2, cy - L / 2, bz, L, L, bt, { top: C.b500, left: C.b500, right: C.b700, stroke: C.b700 });
  const [tx, ty] = P(cx, cy, bz + bt);
  raw(`<circle cx="${f(tx)}" cy="${f(ty)}" r="3.6" fill="${C.w}"/>`);
  const [kx, ky] = P(cx + L / 2 - 6, cy + 12, bz + bt);
  const drop = 27;
  raw(`<path d="M${f(tx)} ${f(ty)} L${f(kx)} ${f(ky)} V${f(ky + drop)}" fill="none" stroke="${C.w}" stroke-width="2.4" ${J}/>`);
  raw(`<path d="M${f(kx - 4.5)} ${f(ky + drop - 2)} h9 l2.2 11 h-13.4 Z" fill="${C.w}" stroke="${C.b500}" stroke-width="${SWI}" ${J}/>`);
  grow([[kx + 7, ky + drop + 10]]);
}

// The learner: a client user, white with a blue outline, built exactly as healthtech's pawns.
function pawn(x, y, z) {
  const [sx, sy] = P(x, y, z);
  const { r, h, head } = PW;
  const bodyD = `M${f(sx - r)} ${f(sy)} V${f(sy - h)} A${r} ${r} 0 0 1 ${f(sx + r)} ${f(sy - h)} V${f(sy)} A${r} ${f(r * 0.45)} 0 0 1 ${f(sx - r)} ${f(sy)} Z`;
  const hc = [sx, sy - h - r - 4 - head];
  grow([[sx - r, hc[1] - head], [sx + r, sy + r * 0.45]]);
  return { x, y, z, sx, sy, r, h, head, hc, bodyD };
}
function drawPawn(p) {
  raw(`<path d="${p.bodyD}" fill="${C.w}" stroke="${C.b500}" stroke-width="${SW}" ${J}/>`);
  raw(`<circle cx="${f(p.hc[0])}" cy="${f(p.hc[1])}" r="${p.head}" fill="${C.w}" stroke="${C.b500}" stroke-width="${SW}"/>`);
}
// Client arm (STYLE §5), as healthtech's: 11 thick including its blue outline, the light core 11 − 2·1.6, a hand
// 0.8 × 11. The blue outline is masked off the body so the sleeve grows out of the shoulder.
function clientArm(p, a, b) {
  const W = PW.arm, HAND = 0.8 * W;
  grow([[b[0] + HAND, b[1] - HAND]]);
  raw(`<mask id="edtechArmMask" maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000"><rect x="-3000" y="-3000" width="6000" height="6000" fill="${C.w}"/><path d="${p.bodyD}" fill="#000000"/></mask>`);
  raw(`<g mask="url(#edtechArmMask)"><path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b500}" stroke-width="${f(W)}" stroke-linecap="round" fill="none"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND)}" fill="${C.b500}"/></g>`);
  raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.w}" stroke-width="${f(W - 2 * SW)}" stroke-linecap="round" fill="none"/>`);
  raw(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND - SW)}" fill="${C.w}"/>`);
}

// The learner's tablet: solid blue (as the family's phone), a white screen holding the course: a title bar,
// two lessons done (ticked) and the next lesson as one lime row.
function drawTablet(T) {
  const front = U(T.x, T.y, T.top), back = U(T.x, T.y - TB.t, T.top);
  const shape = rr(0, 0, TB.w, TB.h, TB.r, 8);
  const F = shape.map(([u, v]) => front(u, v)), Bk = shape.map(([u, v]) => back(u, v));
  poly(hull([...F, ...Bk]), C.b700, C.b700);
  poly(F, C.b500, C.b600);
  const g = [];
  const S = { u: 4.5, v: 4.5, w: TB.w - 9, h: TB.h - 9 };
  g.push(`<rect x="${S.u}" y="${S.v}" width="${S.w}" height="${S.h}" rx="5" fill="${C.w}"/>`);
  const L = S.u + 5, CW = S.w - 10;
  g.push(`<rect x="${L}" y="${S.v + 5}" width="20" height="4" rx="2" fill="${C.b500}"/>`);
  for (const [k, v] of [[0, S.v + 11], [1, S.v + 18.5]]) {
    g.push(`<circle cx="${L + 3}" cy="${v + 2.6}" r="3" fill="${C.b500}"/>`);
    g.push(`<path d="M${L + 1.6} ${v + 2.7} l1 1 l2.1 -2.1" fill="none" stroke="${C.w}" stroke-width="1" ${J}/>`);
    g.push(`<rect x="${L + 10}" y="${v + 0.8}" width="${k ? 18 : 25}" height="3.6" rx="1.8" fill="${C.b200}"/>`);
  }
  // the lime row: centre at rowFromTop
  const nv = TB.rowFromTop - 5;
  g.push(`<rect x="${L - 2}" y="${nv}" width="${CW + 4}" height="10" rx="3.4" fill="${C.lime}" stroke="${C.limeD}" stroke-width="${SWI}"/>`);
  g.push(`<rect x="${L + 3}" y="${nv + 3.3}" width="18" height="3.4" rx="1.7" fill="${C.ink}"/>`);
  raw(`<g transform="${Utf(T.x, T.y, T.top)}">${g.join('')}</g>`);
}

const tops = [];
let learner;
// draw back to front: the tallest pile is the farthest
[...piles].reverse().forEach(({ x, y, n }, ri) => {
  const i = piles.length - 1 - ri;
  let z = 0;
  for (let k = 0; k < n; k++) {
    // books stagger a little so they read as books; the next (lime) book sits square on the one below it
    const next = i === NEXT && k === n - 1;
    const s = next ? (k - 1) % 2 : k % 2;
    z = book(x + (s ? 5 : 0), y + (s ? -3 : 0), z, { next });
  }
  tops[i] = z;
  if (i === LEARNER_ON) learner = pawn(x + env('LX', 16), y + BK.d / 2 + env('LY', 10), z);
  if (i === CAP_ON) cap(x + BK.w / 2, y + BK.d / 2 - 3, z);
});

// The tablet, held over the learner's step: left edge just past the body, its lime row level with the lime book.
const T = { x: learner.x + TB.dx, y: learner.y + TB.dy, top: limeTop + TB.rowFromTop };
const pile1 = piles[LEARNER_ON];
if (T.x + TB.w > pile1.x + BK.w) throw new Error(`tablet runs past the step: ${T.x + TB.w} > ${pile1.x + BK.w}`);
if (T.y > pile1.y + BK.d) throw new Error('tablet stands in front of the step');

// The next lesson in the app is the next step up: a dashed line along −y from behind the tablet's lime row to the
// lime book's top front edge. Drawn before the tablet, so it leaves the tablet from behind and never crosses the screen.
{
  const x = T.x + TB.tie, z = limeTop;
  if (x < limeBook.x0 + 6 || x > limeBook.x0 + BK.w - 6) throw new Error('tie misses the lime book');
  const a = P(x, T.y - TB.t, z), b = P(x, limeBook.y0 + BK.d, z);
  raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b500}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" fill="none"/>`);
  raw(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="2.6" fill="${C.b500}"/>`);
}

drawPawn(learner);
drawTablet(T);

// The learner holds the tablet: a short arm from the shoulder (healthtech's shoulder point) to the tablet's left
// edge, the hand closing over that edge.
{
  const sh = [learner.sx + 8, learner.sy - learner.h + 22];
  const hand = U(T.x, T.y, T.top)(env('HU', 0), env('HV', 20));
  clientArm(learner, sh, hand);
}

// ---------------------------------------------------------------- write
const pad = 4;
const vb = [B.x0 - pad, B.y0 - pad, B.x1 - B.x0 + 2 * pad, B.y1 - B.y0 + 2 * pad].map(f).join(' ');
const alt = 'Isometric illustration for EdTech product design. Piles of books rise as a staircase on a dotted floor, one book higher each step, toward a graduation cap on the top pile. A learner stands on the second step holding a blue tablet that shows the course: two lessons ticked and the next lesson as one lime row. The book on the next step up is lime too, and a dashed line runs from the tablet’s lime row to it, so the next lesson in the app is the learner’s next step up.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${alt}">\n${out.join('\n')}\n</svg>\n`;
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'hero.svg'), svg);
const [, , vw, vh] = vb.split(' ').map(Number);
console.log('viewBox', vb, 'ratio', (vw / vh).toFixed(2));
