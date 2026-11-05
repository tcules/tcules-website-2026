// Generator for the commerce / transactional products expertise hero.
//   node docs/illustrations/run-2026-11-05/expertise-commerce-transactional-products/gen.mjs
// Writes hero.svg beside it. Every point is projected on the family's 2:1 iso:
// floor (u, v) -> (0.9u - 0.9v, 0.45u + 0.45v), height z lifts straight up.
// Floor and people at healthtech's size (floor 545 x 402, pawn r22 / h62 / head 16, arm 11 incl. outline).
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const C = {
  b500: '#0048FF', b600: '#003EE0', b700: '#0031B0', b300: '#8AA5FF', b200: '#B8C8FF',
  b100: '#DBE4FF', b50: '#EEF2FF', w: '#FFFFFF', lime: '#D7F04A', limeD: '#A1B71F', ink: '#1B1B18',
};
const env = (k, d) => (process.env[k] ? process.env[k].split(',').map(Number) : d);
const r1 = (n) => Math.round(n * 10) / 10;
const P = (u, v, z = 0) => [0.9 * u - 0.9 * v, 0.45 * u + 0.45 * v - z];
const pts = (a) => a.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');
const out = [];
const B = []; // bounds
const track = (a) => a.forEach((p) => B.push(p));
const poly = (a, fill, stroke = C.b500, sw = 1.6, extra = '') => {
  track(a);
  out.push(`<polygon points="${pts(a)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ''}${extra}/>`);
};
const path = (d, attrs) => out.push(`<path d="${d}" ${attrs}/>`);
const line = (a, attrs) => { track(a); out.push(`<path d="M${a.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(' L')}" fill="none" ${attrs}/>`); };

function hull(p) {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
function rrect(u0, v0, w, d, r, n = 8) {
  const o = [];
  const corners = [[u0 + w - r, v0 + r, -90], [u0 + w - r, v0 + d - r, 0], [u0 + r, v0 + d - r, 90], [u0 + r, v0 + r, 180]];
  for (const [cu, cv, a0] of corners) for (let i = 0; i <= n; i++) {
    const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
    o.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]);
  }
  return o;
}
function prism(shape, z0, z1, side, top, sw = 1.6, stroke = C.b500) {
  const s = hull([...shape.map(([u, v]) => P(u, v, z0)), ...shape.map(([u, v]) => P(u, v, z1))]);
  poly(s, side, stroke, sw);
  poly(shape.map(([u, v]) => P(u, v, z1)), top, stroke, sw);
}
const flat = (u, v, z, inner) => { const [x, y] = P(u, v, z); out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${r1(x)} ${r1(y)})">${inner}</g>`); };
const faceU = (u, v, z, inner) => { const [x, y] = P(u, v, z); out.push(`<g transform="matrix(0.9 0.45 0 1 ${r1(x)} ${r1(y)})">${inner}</g>`); };

// ---------------------------------------------------------------- floor: healthtech's plate
const FW = 545, FD = 402;
{
  const [x, y] = P(0, 0, 0);
  out.push(`<defs><pattern id="ctp-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b500}" fill-opacity="0.38"/></pattern></defs>`);
  out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${x} ${y})"><rect width="${FW}" height="${FD}" fill="url(#ctp-dots)"/><rect width="${FW}" height="${FD}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FW - 90}" height="${FD - 90}" fill="${C.b500}" fill-opacity="0.07"/></g>`);
  track([P(0, 0), P(FW, 0), P(FW, FD), P(0, FD)]);
}

// ---------------------------------------------------------------- the laptop: light body, only the screen dark blue
const [LU, LV] = env('LAP', [196, 18]);
const L = { u: LU, v: LV, w: 296, d: 186, h: 11, r: 15 };
const LID = { w: L.w, h: 214, tilt: 24, t: 7, hv: L.v + 6 }; // lid stands on the base's back edge, leaning back
// lid local (s along u, t down from its top) -> floor
const lidPt = (s, t, back = 0) => P(L.u + s, LID.hv - LID.tilt * (LID.h - t) / LID.h - back, L.h + LID.h - t);
const lidM = (() => {
  const [x, y] = lidPt(0, 0);
  return `matrix(0.9 0.45 ${r1(-0.9 * LID.tilt / LID.h * 1000) / 1000} ${r1((0.45 * LID.tilt / LID.h + 1) * 1000) / 1000} ${r1(x)} ${r1(y)})`;
})();

// screen layout, in lid units (origin at the lid's top-left, t downward)
const SCR = { x: 12, y: 12, w: L.w - 24, h: LID.h - 30 };
const PIC = { x: SCR.x + 128, y: SCR.y + 12, w: SCR.w - 128 - 12, h: SCR.h - 24 }; // the part's picture, right
const COL = { x: SCR.x + 14, w: 102 };                                                // facts, price and add button, left
const BTN = { x: COL.x, y: SCR.y + SCR.h - 14 - 26, w: COL.w, h: 26 };

let ui = `<rect x="${SCR.x}" y="${SCR.y}" width="${SCR.w}" height="${SCR.h}" rx="9" fill="${C.b500}"/>`;
ui += `<circle cx="${L.w / 2}" cy="6.5" r="2" fill="${C.b200}"/>`;
// the part, drawn as a plain elevation: a flange with a collar and a bore, and its fit bracket with the lime check
{
  ui += `<rect x="${PIC.x}" y="${PIC.y}" width="${PIC.w}" height="${PIC.h}" rx="8" fill="${C.w}"/>`;
  const cx = PIC.x + PIC.w / 2, fw = 70, cw = 34, fy = PIC.y + 70, fh = 14, cy = PIC.y + 26;
  ui += `<rect x="${cx - fw / 2}" y="${fy}" width="${fw}" height="${fh}" rx="2" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6"/>`;
  ui += `<rect x="${cx - cw / 2}" y="${cy}" width="${cw}" height="${fy - cy}" rx="2" fill="${C.b50}" stroke="${C.b500}" stroke-width="1.6"/>`;
  ui += `<path d="M${cx - 7} ${cy + 3} V${fy + fh - 3} M${cx + 7} ${cy + 3} V${fy + fh - 3}" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="3 3" stroke-linecap="round"/>`;
  ui += `<path d="M${cx - 27} ${fy + 3} V${fy + fh - 3} M${cx + 27} ${fy + 3} V${fy + fh - 3}" stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"/>`;
  const by = fy + fh + 18, x0 = cx - fw / 2, x1 = cx + fw / 2;
  ui += `<path d="M${x0} ${by} H${x1} M${x0} ${by - 5} V${by + 5} M${x1} ${by - 5} V${by + 5}" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-linecap="round"/>`;
  ui += `<circle cx="${cx}" cy="${by}" r="10" fill="${C.lime}" stroke="${C.limeD}" stroke-width="1.2"/><path d="M${cx - 4} ${by} L${cx - 1} ${by + 3.4} L${cx + 4.4} ${by - 3.6}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// three facts with their own marks: it fits (a bracket), in stock (a dot), it arrives (a van); then the price
const ROW0 = SCR.y + 16, ROWH = 24, TILE = 17;
const glyphs = [
  (x, y) => `<path d="M${x + 4} ${y + 8.5} H${x + 13} M${x + 4} ${y + 5} V${y + 12} M${x + 13} ${y + 5} V${y + 12}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-linecap="round"/>`,
  (x, y) => `<circle cx="${x + 8.5}" cy="${y + 8.5}" r="3.6" fill="${C.b500}"/>`,
  (x, y) => `<path d="M${x + 3} ${y + 5} H${x + 9.5} V${y + 11} H${x + 3} Z M${x + 9.5} ${y + 7} H${x + 11.8} L${x + 13.8} ${y + 9.3} V${y + 11} H${x + 9.5} Z" fill="${C.b500}"/><circle cx="${x + 5.8}" cy="${y + 12.4}" r="1.6" fill="${C.b500}"/><circle cx="${x + 11.6}" cy="${y + 12.4}" r="1.6" fill="${C.b500}"/>`,
];
glyphs.forEach((g, i) => {
  const y = ROW0 + i * ROWH;
  ui += `<rect x="${COL.x}" y="${y}" width="${TILE}" height="${TILE}" rx="4.5" fill="${C.w}"/>` + g(COL.x, y);
  ui += `<rect x="${COL.x + TILE + 8}" y="${y + 5}" width="${[66, 52, 60][i]}" height="7" rx="3.5" fill="${C.b200}"/>`;
});
ui += `<rect x="${COL.x}" y="${ROW0 + 3 * ROWH + 2}" width="40" height="9" rx="4.5" fill="${C.w}"/>`;
// the add button: white on the blue page, a blue label bar
ui += `<rect x="${BTN.x}" y="${BTN.y}" width="${BTN.w}" height="${BTN.h}" rx="${BTN.h / 2}" fill="${C.w}"/>`;
ui += `<rect x="${BTN.x + 26}" y="${BTN.y + 9.5}" width="${BTN.w - 52}" height="7" rx="3.5" fill="${C.b500}"/>`;

// base
prism(rrect(L.u, L.v, L.w, L.d, L.r), 0, L.h, C.b200, C.w);
{
  // keyboard and trackpad on the deck
  const kv = 24, ku = 24, kw = L.w - 48, kd = 84;
  let k = `<rect x="${ku}" y="${kv}" width="${kw}" height="${kd}" rx="7" fill="${C.b50}" stroke="${C.b500}" stroke-width="1.2"/>`;
  { // keys: three rows of keys and a space bar
    const n = 12, g = 4, kx = (kw - 24 - g * (n - 1)) / n, ky = 12, gy = 6, y0 = kv + (kd - 4 * ky - 3 * gy) / 2;
    for (let r = 0; r < 3; r++) for (let i = 0; i < n; i++) k += `<rect x="${r1(ku + 12 + i * (kx + g))}" y="${r1(y0 + r * (ky + gy))}" width="${r1(kx)}" height="${ky}" rx="3" fill="${C.b200}"/>`;
    k += `<rect x="${r1(ku + 12 + 3 * (kx + g))}" y="${r1(y0 + 3 * (ky + gy))}" width="${r1(6 * kx + 5 * g)}" height="${ky}" rx="3" fill="${C.b200}"/>`;
  }
  k += `<rect x="${L.w / 2 - 44}" y="${kv + kd + 14}" width="88" height="${L.d - kv - kd - 28}" rx="7" fill="${C.w}" stroke="${C.b500}" stroke-width="1.2"/>`;
  flat(L.u, L.v, L.h, k);
}
// lid: its back (thickness) silhouette, then the white front, then the screen
{
  const o = rrect(0, 0, LID.w, LID.h, 12);
  const front = o.map(([s, t]) => lidPt(s, t));
  const back = o.map(([s, t]) => lidPt(s, t, LID.t));
  poly(hull([...front, ...back]), C.b200);
  poly(front, C.w);
  out.push(`<g transform="${lidM}">${ui}</g>`);
}

// ---------------------------------------------------------------- the shopping bag, the hub's object, front left
const [BU, BV] = env('BAG', [48, 252]);
const BAG = { u: BU, v: BV, w: 106, d: 64, h: 168 };
const conn = `stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
// the order's route: from the add button's near end, out over the bezel, in one arc down into the bag
const start = lidPt(BTN.x + 6, BTN.y + BTN.h / 2);
const endIn = P(BAG.u + BAG.w * 0.8, BAG.v + BAG.d * 0.55, BAG.h - 26); // inside the mouth, below the front rim
const [AX, AY] = env('ARC', [-40, -150]);
const arcD = (() => {
  const c1 = [start[0] + AX, start[1] + AY];
  const c2 = [endIn[0] + 10, endIn[1] - 190];
  return `M${r1(start[0])} ${r1(start[1])} C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(endIn[0])} ${r1(endIn[1])}`;
})();
{
  const { u, v, w, d, h } = BAG;
  // mouth
  poly([P(u, v, h), P(u + w, v, h), P(u + w, v + d, h), P(u, v + d, h)], C.b100, C.b500, 1.6);
  // the order, a parcel standing at the back of the bag, the flange's mark printed on its lid
  const pu = u + 8, pv = v + 6, pw = 48, pd = 30, pz0 = h - 30, pz1 = h + 30;
  poly([P(pu + pw, pv, pz0), P(pu + pw, pv + pd, pz0), P(pu + pw, pv + pd, pz1), P(pu + pw, pv, pz1)], C.b200);
  poly([P(pu, pv + pd, pz0), P(pu + pw, pv + pd, pz0), P(pu + pw, pv + pd, pz1), P(pu, pv + pd, pz1)], C.w);
  poly([P(pu, pv, pz1), P(pu + pw, pv, pz1), P(pu + pw, pv + pd, pz1), P(pu, pv + pd, pz1)], C.w);
  {
    const cx = pw / 2, cy = pd / 2;
    let m = `<circle cx="${cx}" cy="${cy}" r="11" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="4.4" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`;
    for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + (k * Math.PI) / 2; m += `<circle cx="${r1(cx + 7.8 * Math.cos(a))}" cy="${r1(cy + 7.8 * Math.sin(a))}" r="1.4" fill="${C.b500}"/>`; }
    flat(pu, pv, pz1, m);
  }
  // the route lands in the bag: drawn before the front face, so the face hides its end
  out.push(`<path d="${arcD}" stroke="${C.w}" stroke-width="5.2" stroke-linecap="round" fill="none"/>`);
  out.push(`<path d="${arcD}" ${conn}/>`);
  poly([P(u, v + d, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u, v + d, h)], C.w);
  poly([P(u + w, v, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u + w, v, h)], C.b200);
  const rim = 16;
  line([P(u, v + d, h - rim), P(u + w, v + d, h - rim), P(u + w, v, h - rim)], `stroke="${C.b500}" stroke-width="1.2" stroke-linejoin="round"`);
  const hl = P(u + w * 0.28, v + d, h - 7), hr = P(u + w * 0.72, v + d, h - 7);
  const lift = 50;
  path(`M${r1(hl[0])} ${r1(hl[1])} C${r1(hl[0])} ${r1(hl[1] - lift)} ${r1(hr[0])} ${r1(hr[1] - lift)} ${r1(hr[0])} ${r1(hr[1])}`, `fill="none" stroke="${C.b500}" stroke-width="4.4" stroke-linecap="round"`);
  track([[hl[0], hl[1] - lift * 0.75], [hr[0], hr[1] - lift * 0.75]]);
  const hu = u + w * 0.72, tz = h - 40;
  line([P(hu, v + d, h - 7), P(hu, v + d, tz - 6)], `stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"`);
  faceU(hu - 13, v + d, tz, `<rect width="26" height="38" rx="5" fill="${C.b500}"/><circle cx="13" cy="8.5" r="3" fill="${C.w}"/>`);
}
// the route's start on the button
out.push(`<circle cx="${r1(start[0])}" cy="${r1(start[1])}" r="3.8" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`);
// arc bounds (sampled)
{
  const c1 = [start[0] + AX, start[1] + AY], c2 = [endIn[0] + 10, endIn[1] - 190];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20, m = 1 - t;
    B.push([m ** 3 * start[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t ** 3 * endIn[0], m ** 3 * start[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t ** 3 * endIn[1]]);
  }
}

// ---------------------------------------------------------------- the buyer, a client, at the laptop, hand on the deck
const R = 22, H = 62, HEAD = 16, ARM = 11, OUT = 1.6, HAND = ARM * 0.8;
const bodyPath = (x, y) => `M${r1(x - R)} ${r1(y)} V${r1(y - H)} A${R} ${R} 0 0 1 ${r1(x + R)} ${r1(y - H)} V${r1(y)} A${R} ${r1(R * 0.45)} 0 0 1 ${r1(x - R)} ${r1(y)} Z`;
function pawn(u, v, hand) {
  const [x, y] = P(u, v, 0);
  const body = bodyPath(x, y);
  track([[x - R - 2, y + 11], [x + R + 2, y - H - R - 4 - 2 * HEAD - 2]]);
  const s = [x + (hand[0] < x ? -9 : 9), y - H + 20];
  const id = `ctp-arm-${Math.round(u)}`;
  const arm = `M${r1(s[0])} ${r1(s[1])} L${r1(hand[0])} ${r1(hand[1])}`;
  out.push(`<path d="${body}" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<circle cx="${r1(x)}" cy="${r1(y - H - R - 4 - HEAD)}" r="${HEAD}" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`);
  out.push(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-900" y="-900" width="2400" height="2400"><rect x="-900" y="-900" width="2400" height="2400" fill="#fff"/><path d="${body}" fill="#000"/></mask>`);
  out.push(`<g mask="url(#${id})"><path d="${arm}" stroke="${C.b500}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${r1(hand[0])}" cy="${r1(hand[1])}" r="${r1(HAND)}" fill="${C.b500}"/></g>`);
  out.push(`<path d="${arm}" stroke="${C.w}" stroke-width="${r1(ARM - 2 * OUT)}" stroke-linecap="round"/><circle cx="${r1(hand[0])}" cy="${r1(hand[1])}" r="${r1(HAND - OUT)}" fill="${C.w}"/>`);
}
{
  const [pu, pv] = env('BUYER', [226, 270]);
  const [hu, hv] = env('HAND', [232, 198]);
  pawn(pu, pv, P(hu, hv, L.h + 2));
}

// ---------------------------------------------------------------- write
const pad = 6;
const xs = B.map((p) => p[0]), ys = B.map((p) => p[1]);
const minX = Math.floor(Math.min(...xs) - pad), minY = Math.floor(Math.min(...ys) - pad);
const W = Math.ceil(Math.max(...xs) + pad - minX), Hh = Math.ceil(Math.max(...ys) + pad - minY);
const ALT = 'Isometric illustration for ecommerce UX design for technical parts. An open laptop stands on a dotted floor showing a product page: a machined flange drawn in elevation with a bracket across its width and a lime check on it, three facts with their own marks (it fits, it is in stock, it arrives), the price and an add button. A buyer stands at the corner of the laptop with a hand on it, and a dashed line arcs from the add button down into a white shopping bag beside the laptop, where a parcel printed with the same flange stands ready.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${W} ${Hh}" role="img" aria-label="${ALT}">\n${out.join('\n')}\n</svg>\n`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(process.env.OUT || join(here, 'hero.svg'), svg);
console.log('viewBox', minX, minY, W, Hh, (W / Hh).toFixed(2));
