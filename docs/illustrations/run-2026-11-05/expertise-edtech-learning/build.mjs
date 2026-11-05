// Generator for the /expertise/edtech-learning hero.
//   node docs/illustrations/run-2026-11-05/expertise-edtech-learning/build.mjs
// Writes hero.svg beside this file. World units, projected on the family's 2:1 iso:
//   sx = 0.9x - 0.9y, sy = 0.45x + 0.45y - z   (same as matrix(0.9 0.45 -0.9 0.45) in expertise.svg)
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
const bounds = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
const grow = (a) => a.forEach(([x, y]) => {
  bounds.x0 = Math.min(bounds.x0, x); bounds.y0 = Math.min(bounds.y0, y);
  bounds.x1 = Math.max(bounds.x1, x); bounds.y1 = Math.max(bounds.y1, y);
});
const SW = 1.6;
const poly = (a, fill, stroke = C.b500, sw = SW, extra = '') => {
  grow(a);
  out.push(`<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"${extra}/>`);
};
const path = (d, attrs) => out.push(`<path d="${d}" ${attrs}/>`);

// Rounded rectangle in the plane z, sampled, world -> screen.
function rrWorld(x0, y0, w, h, r, z, n = 8) {
  const a = [];
  const corner = (cx, cy, a0) => {
    for (let i = 0; i <= n; i++) {
      const t = a0 + (i / n) * (Math.PI / 2);
      a.push(P(cx + r * Math.cos(t), cy + r * Math.sin(t), z));
    }
  };
  corner(x0 + w - r, y0 + r, -Math.PI / 2);
  corner(x0 + w - r, y0 + h - r, 0);
  corner(x0 + r, y0 + h - r, Math.PI / 2);
  corner(x0 + r, y0 + r, Math.PI);
  return a;
}
// A rounded slab: visible side ribbon in two tones (left-front face, right-front face), then the top.
function slab(x0, y0, w, h, r, z, t, top, left, right, stroke = C.b500, sw = SW) {
  const T = rrWorld(x0, y0, w, h, r, z + t);
  // indices of leftmost and rightmost screen points, chain through the front (max y)
  let iL = 0, iR = 0, iF = 0;
  T.forEach((p, i) => { if (p[0] < T[iL][0]) iL = i; if (p[0] > T[iR][0]) iR = i; if (p[1] > T[iF][1]) iF = i; });
  const chain = (from, to) => { const c = []; let i = from; for (;;) { c.push(T[i]); if (i === to) break; i = (i + 1) % T.length; } return c; };
  // walk forward from iR; if it reaches iF before iL, that is the front chain
  const fwd = chain(iR, iL);
  const front = fwd.some((p) => p === T[iF]) ? fwd : chain(iL, iR).reverse();
  // front runs iR -> ... -> iF -> ... -> iL
  const k = front.indexOf(T[iF]);
  const rightTop = front.slice(0, k + 1), leftTop = front.slice(k);
  const down = (a) => a.map(([x, y]) => [x, y + t]).reverse();
  if (t > 0) {
    poly([...rightTop, ...down(rightTop)], right, stroke, sw);
    poly([...leftTop, ...down(leftTop)], left, stroke, sw);
  }
  poly(T, top, stroke, sw);
}
// Axis-aligned box with sharp corners.
function box(x0, y0, z0, w, d, h, top, left, right, stroke = C.b500, sw = SW) {
  const x1 = x0 + w, y1 = y0 + d, z1 = z0 + h;
  poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], left, stroke, sw); // +y face (front-left)
  poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], right, stroke, sw); // +x face (front-right)
  poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], top, stroke, sw);
}
// Upright-in-plane helpers for detail on faces
const line = (a, b, stroke, sw, extra = '') => path(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, `stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" fill="none"${extra}`);

// A book: two boards and a page block, spine on the back (-x) side, pages showing on +x and +y.
function book(x0, y0, z0, w, d, { cover = C.b100, coverSide = C.b200, pages = C.w, pagesSide = C.b50, stroke = C.b500, lines = true, faded = false } = {}) {
  const bt = 4, ph = 14, inset = 4;
  const st = faded ? C.b300 : stroke;
  box(x0, y0, z0, w, d, bt, cover, coverSide, coverSide, st);
  box(x0, y0 + 0, z0 + bt, w - inset, d - inset, ph, pages, pagesSide, pagesSide, st);
  if (lines) {
    for (const k of [0.36, 0.64]) {
      const z = z0 + bt + ph * k;
      line(P(x0 + 8, y0 + d - inset, z), P(x0 + w - inset - 6, y0 + d - inset, z), st, 1.0, ' stroke-opacity="0.45"');
      line(P(x0 + w - inset, y0 + 6, z), P(x0 + w - inset, y0 + d - inset - 6, z), st, 1.0, ' stroke-opacity="0.45"');
    }
  }
  box(x0, y0, z0 + bt + ph, w, d, bt, cover, coverSide, coverSide, st);
  return z0 + bt * 2 + ph;
}

// Pawn standing at world (x, y, z): white = client / learner.
function pawn(x, y, z, { r = 15, h = 40, head = 10.5, fill = C.w, stroke = C.b500 } = {}) {
  const [sx, sy] = P(x, y, z);
  grow([[sx - r, sy - h - head * 2 - 8], [sx + r, sy + r * 0.5]]);
  const ry = r * 0.5;
  const bodyD = `M${f(sx - r)} ${f(sy)} V${f(sy - h)} A${r} ${r} 0 0 1 ${f(sx + r)} ${f(sy - h)} V${f(sy)} A${r} ${f(ry)} 0 0 1 ${f(sx - r)} ${f(sy)} Z`;
  path(bodyD,
    `fill="${fill}" stroke="${stroke}" stroke-width="${SW}" stroke-linejoin="round"`);
  out.push(`<circle cx="${f(sx)}" cy="${f(sy - h - r - head + 2)}" r="${head}" fill="${fill}" stroke="${stroke}" stroke-width="${SW}"/>`);
  return { sx, sy, top: sy - h - r, r, bodyD };
}
// Client arm: light stroke inside a blue outline, round cap, round hand. One arm weight across the set (owner,
// 5 Nov 2026): overall, outline included, the arm is as thick as a Tcules arm on a pawn this size (8 on a 34-wide
// body, the ClimateTech hero's designer, a sibling in this slot) and the hand as large; the light core is
// thinner by twice the outline. The outline is masked off the body so it meets the body's own line; the core runs from the shoulder, so the light
// sleeve runs over the body's own line and the arm reads attached.
function clientArm(p, a, b) {
  const W = (8 / 34) * 2 * p.r, HAND = 0.8 * W;
  out.push(`<mask id="edArmMask" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="5000" height="5000"><rect x="-2000" y="-2000" width="5000" height="5000" fill="${C.w}"/><path d="${p.bodyD}" fill="#000000"/></mask>`);
  out.push(`<g mask="url(#edArmMask)"><path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.b500}" stroke-width="${f(W)}" stroke-linecap="round" fill="none"/><circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND)}" fill="${C.b500}"/></g>`);
  path(`M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`, `stroke="${C.w}" stroke-width="${f(W - 2 * SW)}" stroke-linecap="round" fill="none"`);
  out.push(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="${f(HAND - SW)}" fill="${C.w}"/>`);
}

// Graduation cap centred on world (cx, cy) sitting at z.
function cap(cx, cy, z, s = 42) {
  // crown: cylinder
  const [ex, ey] = P(cx, cy, z);
  const rx = s * 0.55, ry = rx / 2, ch = 14;
  path(`M${f(ex - rx)} ${f(ey - ch)} V${f(ey)} A${f(rx)} ${f(ry)} 0 0 0 ${f(ex + rx)} ${f(ey)} V${f(ey - ch)}`,
    `fill="${C.b700}" stroke="${C.b700}" stroke-width="${SW}" stroke-linejoin="round"`);
  grow([[ex - rx, ey + ry]]);
  // board
  const bz = z + ch + 2, bt = 4;
  box(cx - s, cy - s, bz, 2 * s, 2 * s, bt, C.b500, C.b500, C.b600, C.b700);
  const [tx, ty] = P(cx, cy, bz + bt);
  out.push(`<circle cx="${f(tx)}" cy="${f(ty)}" r="3.4" fill="${C.w}"/>`);
  // tassel: along +x to the board edge, then hangs
  const [ax, ay] = P(cx + s * 0.78, cy, bz + bt);
  const [hx, hy] = P(cx + s, cy, bz + bt);
  path(`M${f(tx)} ${f(ty)} L${f(ax)} ${f(ay)} L${f(hx)} ${f(hy + 1)} V${f(hy + 26)}`,
    `fill="none" stroke="${C.w}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`);
  path(`M${f(hx - 4)} ${f(hy + 24)} h8 l2 11 h-12 Z`, `fill="${C.w}" stroke="${C.b500}" stroke-width="1.2" stroke-linejoin="round"`);
  grow([[hx + 6, hy + 36]]);
}

// ---------------------------------------------------------------- scene
// Floor
const FX0 = -250, FY0 = -330, FW = 640, FD = 600;
{
  const corners = [P(FX0, FY0), P(FX0 + FW, FY0), P(FX0 + FW, FY0 + FD), P(FX0, FY0 + FD)];
  grow(corners);
  // dots
  const dots = [];
  for (let i = 12; i < FW; i += 24) for (let j = 12; j < FD; j += 24) {
    const [x, y] = P(FX0 + i, FY0 + j);
    dots.push(`<circle cx="${f(x)}" cy="${f(y)}" r="1.5"/>`);
  }
  out.push(`<g fill="${C.b300}" fill-opacity="0.75">${dots.join('')}</g>`);
  const ins = [P(FX0 + 50, FY0 + 50), P(FX0 + FW - 50, FY0 + 50), P(FX0 + FW - 50, FY0 + FD - 50), P(FX0 + 50, FY0 + FD - 50)];
  out.push(`<polygon points="${pts(ins)}" fill="${C.b50}" fill-opacity="0.9"/>`);
  out.push(`<polygon points="${pts(corners)}" fill="none" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="6 5"/>`);
}

// The phone, lying flat (hero object, solid blue). Long axis along y.
const PX0 = -40, PY0 = -260, PW = 260, PD = 470, PT = 14;
slab(PX0, PY0, PW, PD, 30, 0, PT, C.b500, C.b700, C.b600, C.b600);
// screen
slab(PX0 + 14, PY0 + 22, PW - 28, PD - 44, 18, PT, 0, C.w, C.w, C.w, C.b600, 0.01);
// earpiece pill at the back end
{
  const a = P(PX0 + PW / 2 - 26, PY0 + 11, PT), b = P(PX0 + PW / 2 + 26, PY0 + 11, PT);
  line(a, b, C.b700, 5);
}

// Staircase of book piles on the screen, climbing toward -y (screen up-right).
const BW = 150, BD = 78, BX = PX0 + 55;
const piles = [
  { y: PY0 + 300, n: 1 },
  { y: PY0 + 300 - BD, n: 2 },
  { y: PY0 + 300 - 2 * BD, n: 3 },
  { y: PY0 + 300 - 3 * BD, n: 4 },
];
const tops = [];
// draw back to front
for (let p = piles.length - 1; p >= 0; p--) {
  const { y, n } = piles[p];
  let z = PT;
  for (let k = 0; k < n; k++) {
    const isTop = k === n - 1;
    let opts = {};
    if (p === 2 && isTop) opts = { cover: C.lime, coverSide: C.limeD, stroke: C.limeD }; // the next step
    z = book(BX + (k % 2 ? 4 : 0), y, z, BW - (k % 2 ? 4 : 0), BD, opts);
  }
  tops[p] = z;
  if (p === 3) cap(BX + BW / 2, y + BD / 2, z);
  if (p === 1) {
    // the learner stands on step two
    const pw = pawn(BX + BW / 2 + 6, y + BD / 2 + 4, z);
    clientArm(pw, [pw.sx + 8, pw.sy - 34], [pw.sx + 30, pw.sy - 56]);
  }
}

// ---------------------------------------------------------------- write
const pad = 6;
const vb = [bounds.x0 - pad, bounds.y0 - pad, bounds.x1 - bounds.x0 + 2 * pad, bounds.y1 - bounds.y0 + 2 * pad].map(f).join(' ');
const alt = 'Isometric illustration for EdTech product design.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${alt}">\n${out.join('\n')}\n</svg>\n`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'hero.svg'), svg);
console.log('viewBox', vb);
