// Generator for the /expertise/edtech-learning hero.
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
// The phone stands upright, facing the viewer's left (+y). Long axis vertical.
// It stands to the right of the third pile, its face in line with that pile, so its next-step button projects
// straight along -x onto the lime book.
const PH = { x: 176, y: 296, w: 160, h: 318, t: 18, r: 26 };
// Four piles of books rise toward it, in front of it.
const BK = { w: 112, d: 80, cover: 5, pages: 24 }; // one book = 34 tall
const bookH = BK.cover * 2 + BK.pages;
// They climb along -y (up and to the right on screen), toward the phone.
const PILE_X = -96;
const piles = [
  { y: 400, n: 1 },
  { y: 310, n: 2 },
  { y: 220, n: 3 },
  { y: 130, n: 4 },
];
const LEARNER_ON = 1, NEXT = 2, CAP_ON = 3;

// ---------------------------------------------------------------- floor
{
  const FX0 = -128, FY0 = 102, FW = 482, FD = 400;
  const corners = [P(FX0, FY0), P(FX0 + FW, FY0), P(FX0 + FW, FY0 + FD), P(FX0, FY0 + FD)];
  grow(corners);
  const dots = [];
  for (let i = 13; i < FW; i += 26) for (let j = 13; j < FD; j += 26) {
    const [x, y] = P(FX0 + i, FY0 + j);
    dots.push(`<circle cx="${f(x)}" cy="${f(y)}" r="1.4"/>`);
  }
  raw(`<g fill="${C.b300}" fill-opacity="0.8">${dots.join('')}</g>`);
  const ins = [P(FX0 + 22, FY0 + 22), P(FX0 + FW - 22, FY0 + 22), P(FX0 + FW - 22, FY0 + FD - 22), P(FX0 + 22, FY0 + FD - 22)];
  raw(`<polygon points="${pts(ins)}" fill="${C.b50}"/>`);
  raw(`<polygon points="${pts(corners)}" fill="none" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="6 5" ${J}/>`);
}

// ---------------------------------------------------------------- phone (hero object, solid blue)
// Drawn after the books: it stands nearer the viewer than the top pile it rises beside.
const BTN = { z: 71, u: 0 };
function drawPhone() {
  const front = U(PH.x, PH.y, PH.h), back = U(PH.x, PH.y - PH.t, PH.h);
  const shape = rr(0, 0, PH.w, PH.h, PH.r, 12);
  const F = shape.map(([u, v]) => front(u, v)), Bk = shape.map(([u, v]) => back(u, v));
  poly(hull([...F, ...Bk]), C.b700, C.b700);
  poly(F, C.b500, C.b600);
  const T = Utf(PH.x, PH.y, PH.h);
  // screen
  const S = { u: 12, v: 34, w: PH.w - 24, h: PH.h - 66 };
  const g = [];
  g.push(`<rect x="${S.u}" y="${S.v}" width="${S.w}" height="${S.h}" rx="16" fill="${C.w}"/>`);
  g.push(`<rect x="${PH.w / 2 - 20}" y="15" width="40" height="7" rx="3.5" fill="${C.b700}"/>`);
  const L = S.u + 16, CW = S.w - 32;
  // header: title bar
  g.push(`<rect x="${L}" y="${S.v + 18}" width="74" height="9" rx="4.5" fill="${C.b500}"/>`);
  // the lesson: a video panel with a play button
  const vp = { y: S.v + 40, h: 84 };
  g.push(`<rect x="${L}" y="${vp.y}" width="${CW}" height="${vp.h}" rx="10" fill="${C.b100}"/>`);
  g.push(`<circle cx="${L + CW / 2}" cy="${vp.y + vp.h / 2 - 6}" r="17" fill="${C.b500}"/>`);
  g.push(`<path d="M${L + CW / 2 - 5} ${vp.y + vp.h / 2 - 15} l14 9 l-14 9 Z" fill="${C.w}" stroke="${C.w}" stroke-width="2" ${J}/>`);
  g.push(`<rect x="${L + 12}" y="${vp.y + vp.h - 16}" width="${CW - 24}" height="5" rx="2.5" fill="${C.w}"/>`);
  g.push(`<rect x="${L + 12}" y="${vp.y + vp.h - 16}" width="${(CW - 24) * 0.62}" height="5" rx="2.5" fill="${C.b500}"/>`);
  // progress through the course: four steps, two done, as on the stairs
  const pw = (CW - 3 * 8) / 4, py = vp.y + vp.h + 22;
  for (let k = 0; k < 4; k++) {
    const done = k < 2;
    g.push(`<rect x="${f(L + k * (pw + 8))}" y="${py}" width="${f(pw)}" height="8" rx="4" fill="${done ? C.b500 : C.w}" stroke="${done ? C.b500 : C.b300}" stroke-width="${SWI}"/>`);
  }
  g.push(`<rect x="${L}" y="${py + 24}" width="${CW * 0.78}" height="7" rx="3.5" fill="${C.b200}"/>`);
  // the clear next step: its centre sits at world height BTN.z
  const ny = PH.h - BTN.z - 18;
  g.push(`<rect x="${L}" y="${ny}" width="${CW}" height="36" rx="18" fill="${C.lime}" stroke="${C.limeD}" stroke-width="${SWI}"/>`);
  g.push(`<rect x="${L + 18}" y="${ny + 15}" width="46" height="6" rx="3" fill="${C.ink}"/>`);
  g.push(`<path d="M${L + CW - 26} ${ny + 11} l7 7 l-7 7" fill="none" stroke="${C.ink}" stroke-width="2.4" ${J}/>`);
  BTN.u = L;
  raw(`<g transform="${T}">${g.join('')}</g>`);
}

// ---------------------------------------------------------------- books and the cap (the hub's object)
function book(x0, y0, z0, { next = false } = {}) {
  const { w, d, cover, pages } = BK;
  const cv = next ? { top: C.lime, left: C.limeD, right: C.limeD, stroke: C.limeD } : { top: C.b100, left: C.b200, right: C.b300 };
  box(x0, y0, z0, w, d, cover, cv);
  // page block, set in from the front and the right
  box(x0 + 2, y0 + 2, z0 + cover, w - 7, d - 7, pages, { top: C.w, left: C.w, right: C.b50 });
  const fl = U(x0 + 2, y0 + d - 5, z0 + cover + pages);
  for (const k of [7, 14]) {
    const a = fl(7, k), b = fl(w - 7 - 7, k);
    raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b300}" stroke-width="1" fill="none" ${J}/>`);
  }
  box(x0, y0, z0 + cover + pages, w, d, cover, cv);
  return z0 + bookH;
}
function cap(cx, cy, z) {
  const L = 70, crownR = 23, crownH = 20, bt = 5;
  const [ex, ey] = P(cx, cy, z);
  raw(`<path d="M${f(ex - crownR)} ${f(ey - crownH)} V${f(ey)} A${crownR} ${crownR / 2} 0 0 0 ${f(ex + crownR)} ${f(ey)} V${f(ey - crownH)} Z" fill="${C.b700}" stroke="${C.b700}" stroke-width="${SW}" ${J}/>`);
  grow([[ex - crownR, ey + crownR / 2]]);
  const bz = z + crownH;
  box(cx - L / 2, cy - L / 2, bz, L, L, bt, { top: C.b500, left: C.b500, right: C.b700, stroke: C.b700 });
  const [tx, ty] = P(cx, cy, bz + bt);
  raw(`<circle cx="${f(tx)}" cy="${f(ty)}" r="3.8" fill="${C.w}"/>`);
  const [kx, ky] = P(cx + L / 2 - 6, cy + 14, bz + bt);
  const drop = 30;
  raw(`<path d="M${f(tx)} ${f(ty)} L${f(kx)} ${f(ky)} V${f(ky + drop)}" fill="none" stroke="${C.w}" stroke-width="2.4" ${J}/>`);
  raw(`<path d="M${f(kx - 4.5)} ${f(ky + drop - 2)} h9 l2.2 12 h-13.4 Z" fill="${C.w}" stroke="${C.b500}" stroke-width="${SWI}" ${J}/>`);
  grow([[kx + 7, ky + drop + 11]]);
}

// The learner: a client user, white with a blue outline.
function pawn(x, y, z, { r = 19, h = 44, head = 12.5 } = {}) {
  const [sx, sy] = P(x, y, z);
  const ry = r * 0.5;
  const bodyD = `M${f(sx - r)} ${f(sy)} V${f(sy - h)} A${r} ${r} 0 0 1 ${f(sx + r)} ${f(sy - h)} V${f(sy)} A${r} ${f(ry)} 0 0 1 ${f(sx - r)} ${f(sy)} Z`;
  const hc = [sx, sy - h - r - head + 1];
  grow([[sx - r, hc[1] - head], [sx + r, sy + ry]]);
  return { sx, sy, r, h, head, hc, bodyD };
}
function drawPawn(p) {
  raw(`<path d="${p.bodyD}" fill="${C.w}" stroke="${C.b500}" stroke-width="${SW}" ${J}/>`);
  raw(`<circle cx="${f(p.hc[0])}" cy="${f(p.hc[1])}" r="${p.head}" fill="${C.w}" stroke="${C.b500}" stroke-width="${SW}"/>`);
}
// Client arm, one weight with the family's Tcules arm (8 on a 34-wide body): outline included it is W thick,
// the light core is W - 2·outline. The blue outline is masked off the body so the sleeve joins it.
function clientArm(p, a, b) {
  const W = (8 / 34) * 2 * p.r, HAND = 0.8 * W;
  grow([[b[0] + HAND, b[1] - HAND]]);
  raw(`<mask id="edtechArmMask" maskUnits="userSpaceOnUse" x="-3000" y="-3000" width="6000" height="6000"><rect x="-3000" y="-3000" width="6000" height="6000" fill="${C.w}"/><path d="${p.bodyD}" fill="#000000"/></mask>`);
  raw(`<g mask="url(#edtechArmMask)"><path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b500}" stroke-width="${f(W)}" stroke-linecap="round" fill="none"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND)}" fill="${C.b500}"/></g>`);
  raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.w}" stroke-width="${f(W - 2 * SW)}" stroke-linecap="round" fill="none"/>`);
  raw(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND - SW)}" fill="${C.w}"/>`);
}

const tops = [];
let learner;
// draw back to front: the tallest pile is the farthest
[...piles].reverse().forEach(({ y, n }, ri) => {
  const i = piles.length - 1 - ri, x = PILE_X;
  let z = 0;
  for (let k = 0; k < n; k++) z = book(x + (k % 2 ? 6 : 0), y + (k % 2 ? -4 : 0), z, { next: i === NEXT && k === n - 1 });
  tops[i] = z;
  if (i === LEARNER_ON) {
    learner = pawn(x + BK.w / 2 - 6, y + BK.d / 2 + 6, z, { r: 21, h: 46, head: 14 });
    drawPawn(learner);
    // the arm reaches up to the front edge of the next step's lime cover
    const sh = [learner.sx + 8, learner.sy - learner.h + 4];
    const lime = P(-96 + BK.w / 2 - 4, piles[NEXT].y + BK.d + 3, tops[NEXT] - 2);
    clientArm(learner, sh, lime);
  }
  if (i === CAP_ON) cap(x + BK.w / 2, y + BK.d / 2 - 4, z);
});

drawPhone();

// The projection: from the phone's next-step button, along -x in the plane of its screen, to the lime book.
{
  const z = BTN.z, y = PH.y;
  const a = P(PH.x + BTN.u - 6, y, z), b = P(-96 + BK.w, y, z);
  raw(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b500}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" fill="none"/>`);
  raw(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="2.6" fill="${C.b500}"/>`);
}

// ---------------------------------------------------------------- write
const pad = 4;
const vb = [B.x0 - pad, B.y0 - pad, B.x1 - B.x0 + 2 * pad, B.y1 - B.y0 + 2 * pad].map(f).join(' ');
const alt = 'Isometric illustration for EdTech product design. Piles of books rise as a staircase, one book higher each step, toward a graduation cap on the top pile. A learner stands on the second step and reaches up for the next one, a lime book. Beside the stairs stands a blue phone showing a lesson: a video, a course progress bar with two of four steps done, and a lime next-step button. A dashed line runs from that button to the lime book, so the next step in the app is the next step up for the learner.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${alt}">\n${out.join('\n')}\n</svg>\n`;
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'hero.svg'), svg);
const [, , vw, vh] = vb.split(' ').map(Number);
console.log('viewBox', vb, 'ratio', (vw / vh).toFixed(2));
