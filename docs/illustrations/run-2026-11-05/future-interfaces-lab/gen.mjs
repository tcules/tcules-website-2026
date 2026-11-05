// Generator for /future-interfaces-lab hero (docs/illustrations/run-2026-11-05/future-interfaces-lab/hero.svg).
// World: x to the right-down, y to the left-down, z up; the expertise family's 2:1 iso and healthtech's floor.
// Run: node gen.mjs  (writes hero.svg beside it)
import { writeFileSync } from 'node:fs';
const OX = -144, OY = 27;
const BOUND = [Infinity, Infinity, -Infinity, -Infinity];
const grow = (X, Y) => { BOUND[0] = Math.min(BOUND[0], X); BOUND[1] = Math.min(BOUND[1], Y); BOUND[2] = Math.max(BOUND[2], X); BOUND[3] = Math.max(BOUND[3], Y); };
const P = (x, y, z = 0) => { const X = OX + 0.9 * (x - y), Y = OY + 0.45 * (x + y) - z; grow(X, Y); return [X, Y]; };
const f = (n) => Math.round(n * 10) / 10;
const B = { 500: '#0048FF', 600: '#003EE0', 700: '#0031B0', 300: '#8AA5FF', 200: '#B8C8FF', 100: '#DBE4FF', 50: '#EEF2FF' };
const LIME = '#D7F04A', LIME_D = '#A1B71F', INK = '#1B1B18', W = '#FFFFFF';
const out = [];
const add = (s) => out.push(s);
const d2 = (a, close = true) => a.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ') + (close ? ' Z' : '');
const mFront = (x, y, ztop) => { const [X, Y] = P(x, y, ztop); return `matrix(0.9 0.45 0 1 ${f(X)} ${f(Y)})`; };
const mFloor = (x, y, z) => { const [X, Y] = P(x, y, z); return `matrix(0.9 0.45 -0.9 0.45 ${f(X)} ${f(Y)})`; };
const NS = 'vector-effect="non-scaling-stroke"';

function rrect(w, h, r, n = 8) {
  const [tl, tr, br, bl] = Array.isArray(r) ? r : [r, r, r, r];
  const pts = [];
  const arc = (cx, cy, rad, a0) => {
    if (!rad) { pts.push([cx, cy]); return; }
    for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * (Math.PI / 2); pts.push([cx + rad * Math.cos(a), cy + rad * Math.sin(a)]); }
  };
  arc(tl, tl, tl, Math.PI);
  arc(w - tr, tr, tr, -Math.PI / 2);
  arc(w - br, h - br, br, 0);
  arc(bl, h - bl, bl, Math.PI / 2);
  return pts;
}
const VIEW = [1, 1, 0.9];
function extrude(world, d, colourFor) {
  const n = world.length;
  const c = world.reduce((a, p) => a.map((v, i) => v + p[i] / n), [0, 0, 0]);
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = world[i], b = world[(i + 1) % n];
    const t = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    let nv = [t[1] * d[2] - t[2] * d[1], t[2] * d[0] - t[0] * d[2], t[0] * d[1] - t[1] * d[0]];
    const mid = [(a[0] + b[0]) / 2 - c[0], (a[1] + b[1]) / 2 - c[1], (a[2] + b[2]) / 2 - c[2]];
    if (nv[0] * mid[0] + nv[1] * mid[1] + nv[2] * mid[2] < 0) nv = nv.map((v) => -v);
    if (nv[0] * VIEW[0] + nv[1] * VIEW[1] + nv[2] * VIEW[2] <= 1e-6) continue;
    const col = colourFor(nv);
    const q = [a, b, [b[0] + d[0], b[1] + d[1], b[2] + d[2]], [a[0] + d[0], a[1] + d[1], a[2] + d[2]]].map((p) => P(...p));
    s += `<path d="${d2(q)}" fill="${col}" stroke="${col}" stroke-width="0.8"/>`;
  }
  return s;
}
function hull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}

// tones for a box by facing: +y face (left-front) lighter, +x face (right-front) deeper
const T = {
  white: { top: W, y: B[100], x: B[200], line: B[500] },
  blue: { top: B[500], y: B[600], x: B[700], line: null },
  lime: { top: LIME, y: LIME_D, x: LIME_D, line: null },
  pale: { top: B[50], y: B[100], x: B[100], line: B[300] },
};
// a box lying on the floor plane: footprint (x, y, w, d), from z to z + h, corner radius r
function box({ x, y, z = 0, w, d, h, r = 4, tone = T.white, sw = 1.6, dash, topExtra = '' }) {
  const top = rrect(w, d, r).map(([u, v]) => [x + u, y + v, z + h]);
  let s = extrude(top, [0, 0, -h], (n) => (n[1] > n[0] ? tone.y : tone.x));
  s += `<path d="${d2(top.map((p) => P(...p)))}" fill="${tone.top}"/>`;
  s += topExtra;
  if (tone.line) {
    const da = dash ? ` stroke-dasharray="${dash}"` : '';
    const sil = hull(top.map((p) => P(...p)).concat(top.map((p) => P(p[0], p[1], z))));
    s += `<path d="${d2(sil)}" stroke="${tone.line}" stroke-width="${f(sw)}"${da}/>`;
    s += `<path d="${d2(top.map((p) => P(...p)))}" stroke="${tone.line}" stroke-width="${f(sw * 0.8)}"${da}/>`;
  }
  return s;
}
// an upright panel facing +y: front face in the plane y, u along +x, v down from ztop; thickness t backwards
function panel({ x, y, ztop, w, h, r = 8, t = 6, face = W, sideTop = B[100], sideX = B[200], line = B[500], sw = 1.6, dash, inner = '' }) {
  const fr = rrect(w, h, r).map(([u, v]) => [x + u, y, ztop - v]);
  let s = extrude(fr, [0, -t, 0], (n) => (n[2] > Math.abs(n[0]) ? sideTop : sideX));
  const da = dash ? ` stroke-dasharray="${dash}"` : '';
  s += `<path d="${d2(fr.map((p) => P(...p)))}" fill="${face}"/>`;
  s += inner;
  if (line) {
    const sil = hull(fr.map((p) => P(...p)).concat(fr.map((p) => P(p[0], p[1] - t, p[2]))));
    s += `<path d="${d2(sil)}" stroke="${line}" stroke-width="${f(sw)}"${da}/>`;
    s += `<path d="${d2(fr.map((p) => P(...p)))}" stroke="${line}" stroke-width="${f(sw * 0.8)}"${da}/>`;
  }
  return s;
}

// an upright panel facing +x: front face in the plane x, u along -y (left to right on screen), v down from ztop
function panelX({ x, y, ztop, w, h, r = 8, t = 6, face = W, sideTop = B[100], sideY = B[100], line = B[500], sw = 1.6, inner = '' }) {
  const fr = rrect(w, h, r).map(([u, v]) => [x, y - u, ztop - v]);
  let s = extrude(fr, [-t, 0, 0], (n) => (n[2] > Math.abs(n[1]) ? sideTop : sideY));
  s += `<path d="${d2(fr.map((p) => P(...p)))}" fill="${face}"/>`;
  s += inner;
  const sil = hull(fr.map((p) => P(...p)).concat(fr.map((p) => P(p[0] - t, p[1], p[2]))));
  s += `<path d="${d2(sil)}" stroke="${line}" stroke-width="${f(sw)}"/>`;
  s += `<path d="${d2(fr.map((p) => P(...p)))}" stroke="${line}" stroke-width="${f(sw * 0.8)}"/>`;
  return s;
}
const mSide = (x, y, ztop) => { const [X, Y] = P(x, y, ztop); return `matrix(0.9 -0.45 0 1 ${f(X)} ${f(Y)})`; };


// ---------- floor: the expertise family's plate (healthtech's), 545 x 402 world units ----------
const FW = 545, FD = 402;
add(`<defs><pattern id="fil-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="#0048FF" fill-opacity="0.38"/></pattern></defs>`);
add(`<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->`);
add(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${OX} ${OY})"><rect width="${FW}" height="${FD}" fill="url(#fil-dots)"/><rect width="${FW}" height="${FD}" fill="none" stroke="#0048FF" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FW - 90}" height="${FD - 90}" fill="#0048FF" fill-opacity="0.07"/></g>`);
[[0, 0], [FW, 0], [0, FD], [FW, FD]].forEach(([x, y]) => P(x, y));

// ---------- layout ----------
const E = (k, d) => (process.env[k] ? process.env[k].split(',').map(Number) : d);
const [BX0, BY0, BW, BD] = E('BENCH', [140, 190, 352, 132]);
const TZ = 40, TT = 10;
const FY = E('FY', [300])[0];                // the plane the prototypes face out on
const bar = (x, y, w, h, c) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}" fill="${c}"/>`;
const AI = (x, y, bg = B[500], fg = W) =>
  `<rect x="${x}" y="${y}" width="24" height="15" rx="7.5" fill="${bg}"/>` +
  `<path d="M${f(x + 7)} ${f(y + 11)} l3 -7.4 l3 7.4 M${f(x + 8.2)} ${f(y + 8.4)} h3.6 M${f(x + 17.2)} ${f(y + 3.8)} v7.2" stroke="${fg}" stroke-width="1.5" fill="none"/>`;

// ---------- people (STYLE §5) ----------
const BODY_R = 22, BODY_H = 60, HEAD = 15.5;
const ARM = 10, HAND = 8;       // one arm weight; hand about 1.6x the stroke
const EDGE = 2;                 // the white edge round a Tcules figure
let figN = 0;
function pawn(x, y) {
  const [bx, by] = P(x, y, 0);
  const r = BODY_R, h = BODY_H;
  const bodyD = `M${f(bx - r)} ${f(by)} V${f(by - h)} A${r} ${r} 0 0 1 ${f(bx + r)} ${f(by - h)} V${f(by)} A${r} ${f(r * 0.45)} 0 0 1 ${f(bx - r)} ${f(by)} Z`;
  const hy = f(by - h - r - 5 - HEAD);
  let s = `<path d="${bodyD}" fill="${W}" stroke="${W}" stroke-width="${2 * EDGE}"/><circle cx="${f(bx)}" cy="${hy}" r="${f(HEAD + EDGE)}" fill="${W}"/>`;
  s += `<path d="${bodyD}" fill="${B[500]}"/><circle cx="${f(bx)}" cy="${hy}" r="${HEAD}" fill="${B[500]}"/>`;
  grow(bx - r - 2, by - h - r - 5 - 2 * HEAD - 2); grow(bx + r + 2, by + r * 0.45 + 2);
  return { s, bx, by, bodyD, hy, id: `filFig${++figN}`, shoulder: (side) => [bx + side * 9, by - h - 3] };
}
function arm(p, side, to) {
  const from = p.shoulder(side);
  const d = `M${f(from[0])} ${f(from[1])} L${f(to[0])} ${f(to[1])}`;
  let s = `<mask id="${p.id}" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><rect x="-2000" y="-2000" width="5000" height="5000" fill="${W}"/><path d="${p.bodyD}" fill="#000000"/><circle cx="${f(p.bx)}" cy="${p.hy}" r="${HEAD}" fill="#000000"/></mask>`;
  s += `<g mask="url(#${p.id})"><path d="${d}" stroke="${W}" stroke-width="${f(ARM + 2 * EDGE)}"/><circle cx="${f(to[0])}" cy="${f(to[1])}" r="${f(HAND + EDGE)}" fill="${W}"/></g>`;
  s += `<path d="${d}" stroke="${B[500]}" stroke-width="${ARM}"/><circle cx="${f(to[0])}" cy="${f(to[1])}" r="${HAND}" fill="${B[500]}"/>`;
  grow(to[0] - HAND - 2, to[1] - HAND - 2); grow(to[0] + HAND + 2, to[1] + HAND + 2);
  return s;
}

// a prototype on its test stand: a small white foot on the bench, an upright screen on it
function prototype({ x, w, h, z = TZ, y = FY, inner, faded = false, foot = true, k = 1 }) {
  let s = '';
  w *= k; h *= k; inner = `<g transform="scale(${k})">${inner}</g>`;
  const tone = faded ? T.pale : T.white;
  if (foot) s += box({ x: x + w / 2 - 20, y: y - 16, z, w: 40, d: 24, h: 6, r: 4, tone, sw: faded ? 1.4 : 1.6 });
  const zb = z + (foot ? 6 : 0);
  s += panel({ x, y, ztop: zb + h, w, h, r: 8, t: 7, face: faded ? B[50] : W, sideTop: faded ? B[50] : B[100], sideX: faded ? B[100] : B[200], line: faded ? B[300] : B[500], sw: faded ? 1.4 : 1.6, inner: `<g transform="${mFront(x, y, zb + h)}">${inner}</g>` });
  return s;
}

// ---------- the prototypes ----------
// Under test, left: a conversation where the AI wrote the answer, marked with the AI badge
const K = +(process.env.K || 1.3);
const GAP = 14;
const D1 = { x: BX0 + 14, w: 96, h: 74, k: K };
const in1 =
  `<rect x="42" y="9" width="45" height="14" rx="7" fill="${B[100]}"/>` + bar(49, 13.5, 28, 4.5, B[300]) +
  `<rect x="9" y="28" width="58" height="24" rx="8" fill="${B[500]}"/>` + bar(16, 34, 42, 4.5, W) + bar(16, 42.5, 26, 4.5, B[200]) +
  AI(69, 33) +
  `<rect x="9" y="58" width="78" height="10" rx="5" fill="${B[50]}" stroke="${B[300]}" stroke-width="1.1"/>` +
  `<circle cx="81" cy="63" r="3" fill="${B[500]}"/>`;
// Works, centre: a small app with its one lime step, ticked
const D2 = { x: D1.x + 96 * K + GAP, w: 66, h: 88, k: K };
const in2 =
  bar(9, 9, 28, 5, B[300]) +
  `<rect x="9" y="19" width="48" height="27" rx="6" fill="${B[100]}"/>` +
  `<circle cx="20" cy="32.5" r="6" fill="${B[500]}"/>` + bar(30, 28.5, 20, 4.5, W) + bar(30, 36, 12, 4, B[300]) +
  bar(9, 53, 40, 4.5, B[200]) +
  `<rect x="9" y="64" width="48" height="16" rx="8" fill="${LIME}" stroke="${LIME_D}" stroke-width="1.2"/>` +
  `<path d="M27.5 72 l4 4 l7 -7.5" stroke="${INK}" stroke-width="2.2" fill="none"/>`;
// Under test, right: a voice interface, a waveform in a round field
const D3 = { x: D2.x + 66 * K + GAP, w: 56, h: 66, k: K };
const in3 =
  `<circle cx="28" cy="28" r="17" fill="${B[100]}"/>` +
  [[-9, 7], [-4.5, 15], [0, 21], [4.5, 13], [9, 7]].map(([dx, hh]) => bar(28 + dx - 1.6, 28 - hh / 2, 3.2, hh, B[500])).join('') +
  bar(13, 52, 30, 4.5, B[200]);
// The dead end, shelved: faded, its idea crossed out
const PK = { w: 66, h: 88 };   // the same size as the working one: a whole prototype, set aside
const inK =
  bar(10, 10, 26, 5, B[200]) +
  `<rect x="10" y="20" width="46" height="26" rx="6" fill="${B[100]}"/>` +
  bar(10, 53, 40, 4.5, B[200]) +
  `<rect x="10" y="64" width="46" height="15" rx="7.5" fill="${B[100]}"/>` +
  // one cross over the whole face: this idea is a dead end
  `<path d="M9 9 L57 79 M57 9 L9 79" stroke="${B[300]}" stroke-width="3" fill="none"/>`;

// a lab flask, drawn round (front-on), standing at a world point
function flask(x, y, z, k = 1) {
  const [X, Y] = P(x, y, z);
  grow(X - 20 * k, Y - 46 * k); grow(X + 20 * k, Y + 6 * k);
  const g = `<g transform="translate(${f(X)} ${f(Y)}) scale(${k})">`;
  return g +
    `<path d="M-18 -2 L-5.5 -30 V-40 H5.5 V-30 L18 -2 A18 5 0 0 1 -18 -2 Z" fill="${W}" stroke="${B[500]}" stroke-width="${f(1.6 / k)}"/>` +
    `<path d="M-18 -2 L-12 -15.5 H12 L18 -2 A18 5 0 0 1 -18 -2 Z" fill="${B[200]}" stroke="${B[500]}" stroke-width="${f(1.2 / k)}"/>` +
    `<path d="M-7.5 -40 H7.5" stroke="${B[500]}" stroke-width="${f(2.4 / k)}"/></g>`;
}

// ---------- people ----------
// Behind the bench, facing out: each reaches down onto a prototype's top edge with a short arm
const AP = E('A', [44, 298]), BP = E('B', [522, 326]);
const A = pawn(AP[0], AP[1]);
const Bp = pawn(BP[0], BP[1]);

const [SX, SY, SW, SD, SH] = E('SHELF', [6, 204, 126, 64, 222]);
const SBOARD = 42;               // the board the dead end is parked on
const SBT = 8, SPW = 7, SIN = 2; // board thickness, post width, posts set in from the board's rounded corners
const PKK = 1.36, PKY = SY + SD - 12;
const PKX = SX + (SW - PK.w * PKK) / 2;
function shelf() {
  add(`<!-- The parking shelf, in line at the bench's left end: a flask on top, the dead end set aside on its lower board -->`);
  const [x0, y0, w, d, h] = [SX, SY, SW, SD, SH];
  add(panel({ x: x0 + SIN, y: y0 + SIN + 4, ztop: h - SBT, w: w - 2 * SIN, h: h - SBT, r: 4, t: 4, face: B[50], sideTop: B[100], sideX: B[200], line: B[500], sw: 1.4 }));
  const post = (px, py) => box({ x: px, y: py, z: 0, w: SPW, d: SPW, h: h - SBT, r: 2, tone: T.white, sw: 1.4 });
  add(post(x0 + SIN, y0 + SIN)); add(post(x0 + w - SPW - SIN, y0 + SIN));
  add(box({ x: x0, y: y0, z: 0, w, d, h: SBT, r: 3, tone: T.white }));
  add(box({ x: x0, y: y0, z: SBOARD, w, d, h: SBT, r: 3, tone: T.white }));
  add(prototype({ x: PKX, y: PKY, w: PK.w, h: PK.h, z: SBOARD + SBT, inner: inK, k: PKK, faded: true, foot: false }));
  add(post(x0 + SIN, y0 + d - SPW - SIN)); add(post(x0 + w - SPW - SIN, y0 + d - SPW - SIN));
  add(box({ x: x0, y: y0, z: h - SBT, w, d, h: SBT, r: 3, tone: T.white }));
  add(flask(x0 + w / 2, y0 + d / 2, h, 1.2));
}

// ---------- draw, back to front ----------
shelf();
add(`<!-- The lab's test bench -->`);
{
  const L = 12, inset = 16;
  for (const [lx, ly] of [[BX0 + inset, BY0 + inset], [BX0 + BW - inset - L, BY0 + inset], [BX0 + inset, BY0 + BD - inset - L], [BX0 + BW - inset - L, BY0 + BD - inset - L]]) {
    add(box({ x: lx, y: ly, z: 0, w: L, d: L, h: TZ - TT, r: 2, tone: T.blue }));
  }
  const top = rrect(BW, BD, 12).map(([u, v]) => [BX0 + u, BY0 + v, TZ]);
  add(extrude(top, [0, 0, -TT], (n) => (n[1] > n[0] ? B[600] : B[700])));
  add(`<g transform="${mFloor(BX0, BY0, TZ)}"><rect width="${BW}" height="${BD}" rx="12" fill="${B[500]}"/></g>`);
}
add(`<!-- On the bench, the prototypes under test: an AI conversation, one that works (lime), a voice one -->`);
add(prototype({ ...D1, inner: in1 }));
add(prototype({ ...D2, inner: in2 }));
add(prototype({ ...D3, inner: in3 }));
add(`<!-- Two Tcules people: one trying the AI prototype, one parking the dead end on the shelf -->`);
add(A.s);
{
  const [tx, ty] = P(...E('AHAND', [PKX + 5, PKY + 2, SBOARD + SBT + 14]));
  add(arm(A, 1, [tx, ty]));
}
add(Bp.s);
{
  const [tx, ty] = P(...E('BHAND', [D3.x + D3.w * K - 13, FY + 2, TZ + 6 + 9]));
  add(arm(Bp, -1, [tx, ty]));
}

// ---------- write ----------
const PAD = 6;
const vb = [f(BOUND[0] - PAD), f(BOUND[1] - PAD), f(BOUND[2] - BOUND[0] + 2 * PAD), f(BOUND[3] - BOUND[1] + 2 * PAD)];
const ALT = 'Isometric illustration of the Tcules Future Interfaces Lab. On a dotted floor stands a solid blue test bench with three interface prototypes under test: on the left a conversation whose answer is marked AI, in the middle a small app with a lime button ticked as working, and on the right a voice interface with a waveform. A Tcules person at the bench\'s front-right corner tries the voice prototype with a hand on its screen. At the bench\'s left end stands an open lab shelf with a flask on top, and a second Tcules person sets a faded, crossed-out prototype on its shelf: an idea parked as a dead end.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${ALT}" fill="none" stroke-linejoin="round" stroke-linecap="round">\n${out.join('\n')}\n</svg>\n`;
writeFileSync(new URL(process.env.OUT || './hero.svg', import.meta.url), svg);
console.log('viewBox', vb.join(' '), 'aspect', (vb[2] / vb[3]).toFixed(2));
