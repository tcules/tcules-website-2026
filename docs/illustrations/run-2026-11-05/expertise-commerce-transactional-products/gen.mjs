// Generator for the commerce / transactional products expertise hero.
//   node docs/illustrations/run-2026-11-05/expertise-commerce-transactional-products/gen.mjs
// Writes hero.svg beside it. Every point is projected on the family's 2:1 iso:
// floor (u, v) -> (0.9u - 0.9v, 0.45u + 0.45v), height z lifts straight up.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const C = {
  b500: '#0048FF', b600: '#003EE0', b700: '#0031B0', b300: '#8AA5FF', b200: '#B8C8FF',
  b100: '#DBE4FF', b50: '#EEF2FF', w: '#FFFFFF', lime: '#D7F04A', limeD: '#A1B71F', ink: '#1B1B18',
};
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
const dashed = `stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"`;

// convex hull (monotone chain)
function hull(p) {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
// outline of a rounded rect in floor units
function rrect(u0, v0, w, d, r, n = 8) {
  const o = [];
  const corners = [[u0 + w - r, v0 + r, -90], [u0 + w - r, v0 + d - r, 0], [u0 + r, v0 + d - r, 90], [u0 + r, v0 + r, 180]];
  for (const [cu, cv, a0] of corners) for (let i = 0; i <= n; i++) {
    const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
    o.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]);
  }
  return o;
}
const circle = (cu, cv, r, n = 48) => Array.from({ length: n }, (_, i) => [cu + r * Math.cos((2 * Math.PI * i) / n), cv + r * Math.sin((2 * Math.PI * i) / n)]);
// extrude a convex floor shape from z0 to z1: side silhouette, then the top
function prism(shape, z0, z1, side, top, sw = 1.6, stroke = C.b500) {
  const s = hull([...shape.map(([u, v]) => P(u, v, z0)), ...shape.map(([u, v]) => P(u, v, z1))]);
  poly(s, side, stroke, sw);
  poly(shape.map(([u, v]) => P(u, v, z1)), top, stroke, sw);
}
// group laid on the floor at height z, origin at floor (u, v)
const flat = (u, v, z, inner) => { const [x, y] = P(u, v, z); out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${r1(x)} ${r1(y)})">${inner}</g>`); };
// group on an upright face running along u, origin at its top-left
const faceU = (u, v, z, inner) => { const [x, y] = P(u, v, z); out.push(`<g transform="matrix(0.9 0.45 0 1 ${r1(x)} ${r1(y)})">${inner}</g>`); };

// ---------------------------------------------------------------- floor
const FW = 420, FD = 336;
{
  const [x, y] = P(0, 0, 0);
  out.push(`<defs><pattern id="ctp-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b500}" fill-opacity="0.38"/></pattern></defs>`);
  out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${x} ${y})"><rect width="${FW}" height="${FD}" fill="url(#ctp-dots)"/><rect width="${FW}" height="${FD}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FW - 90}" height="${FD - 90}" fill="${C.b500}" fill-opacity="0.07"/></g>`);
  track([P(0, 0), P(FW, 0), P(FW, FD), P(0, FD)]);
}

// ---------------------------------------------------------------- the product page: a blue tablet lying flat
const T = { u: 34, v: 100, w: 300, d: 200, h: 12, r: 22 };
// screen
const S = { u: T.u + 16, v: T.v + 16, w: T.w - 32, d: T.d - 32 };
// left: the product picture panel; right (nearest the buyer): the add button, then three facts and the price
const IMG = { u: 12, v: 12, w: 140, d: S.d - 24 };
const COLu = IMG.u + IMG.w + 16, COLw = S.w - COLu - 12;
const BTN = { u: COLu, v: 12, w: COLw, d: 36 };
const PCl = { x: IMG.u + IMG.w / 2, y: IMG.v + IMG.d / 2 - 10 }; // the part's centre, in screen units
const FR = 46; // flange radius
let ui = `<rect width="${S.w}" height="${S.d}" rx="12" fill="${C.w}"/>`;
ui += `<rect x="${IMG.u}" y="${IMG.v}" width="${IMG.w}" height="${IMG.d}" rx="10" fill="${C.b50}" stroke="${C.b500}" stroke-width="1.2"/>`;
// "checked to fit": one dimension bracket tight under the flange's diameter, lime check on it
{
  const y = PCl.y + FR + 18, x0 = PCl.x - FR, x1 = PCl.x + FR;
  ui += `<path d="M${x0} ${y} H${x1} M${x0} ${y - 5} V${y + 5} M${x1} ${y - 5} V${y + 5}" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-linecap="round"/>`;
  ui += `<circle cx="${PCl.x}" cy="${y}" r="10.5" fill="${C.lime}" stroke="${C.limeD}" stroke-width="1.2"/><path d="M${PCl.x - 4} ${y} L${PCl.x - 1} ${y + 3.4} L${PCl.x + 4.4} ${y - 3.6}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// the add button: plain blue with a white label bar (lime is kept for the fit check)
ui += `<rect x="${BTN.u}" y="${BTN.v}" width="${BTN.w}" height="${BTN.d}" rx="${BTN.d / 2}" fill="${C.b500}"/>`;
ui += `<rect x="${BTN.u + 18}" y="${BTN.v + 14}" width="${BTN.w - 36}" height="8" rx="4" fill="${C.w}"/>`;
// three facts, each with its own glyph: it fits (a bracket), in stock (a dot), it arrives (a van)
const ROW0 = BTN.v + BTN.d + 14, ROWH = 28, TILE = 20;
const glyphs = [
  (x, y) => `<path d="M${x + 5} ${y + 10} H${x + 15} M${x + 5} ${y + 6} V${y + 14} M${x + 15} ${y + 6} V${y + 14}" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`,
  (x, y) => `<circle cx="${x + 10}" cy="${y + 10}" r="4" fill="#fff"/>`,
  (x, y) => `<path d="M${x + 4} ${y + 6} H${x + 11.5} V${y + 13} H${x + 4} Z M${x + 11.5} ${y + 8.5} H${x + 14} L${x + 16} ${y + 11} V${y + 13} H${x + 11.5} Z" fill="#fff"/><circle cx="${x + 7}" cy="${y + 14.5}" r="1.8" fill="#fff"/><circle cx="${x + 13.5}" cy="${y + 14.5}" r="1.8" fill="#fff"/>`,
];
glyphs.forEach((g, i) => {
  const y = ROW0 + i * ROWH;
  ui += `<rect x="${COLu}" y="${y}" width="${TILE}" height="${TILE}" rx="5" fill="${C.b500}"/>` + g(COLu, y);
  ui += `<rect x="${COLu + TILE + 8}" y="${y + 6}" width="${[COLw - 36, COLw - 48, COLw - 40][i]}" height="8" rx="4" fill="${C.b200}"/>`;
});
// the price, a full row below the facts
ui += `<rect x="${COLu}" y="${ROW0 + 3 * ROWH + 4}" width="${COLw * 0.45}" height="10" rx="5" fill="${C.b300}"/>`;

// ---------------------------------------------------------------- the route from the button to the bag, on the floor (drawn first: the slab hides its foot)
const BAG = { u: 54, v: 8, w: 104, d: 58, h: 166 };
const RU = S.u + BTN.u + 22; // the line leaves the button's far end (the hand is on its near end) and runs along v
const RV = BAG.v + BAG.d / 2; // and along u at the bag's mid depth into its side
const conn = `stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
line([P(RU, T.v, 0), P(RU, RV, 0), P(BAG.u + BAG.w + 4, RV, 0)], conn);

// ---------------------------------------------------------------- the tablet (re-ordered: drawn over the floor route)
prism(rrect(T.u, T.v, T.w, T.d, T.r), 0, T.h, C.b600, C.b500, 1.6, C.b600);
flat(S.u, S.v, T.h, ui);
// the route over the page edge: from the button's back edge across the bezel, cased white over the blue
{
  const a = P(RU, S.v + BTN.v + 2, T.h), b = P(RU, T.v, T.h);
  line([a, b], `stroke="${C.w}" stroke-width="5.2" stroke-linecap="round" fill="none"`);
  line([a, b], conn);
  out.push(`<circle cx="${r1(a[0])}" cy="${r1(a[1])}" r="3.6" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`);
}

// ---------------------------------------------------------------- the part on its picture panel: a flange with a collar
const PC = { u: S.u + PCl.x, v: S.v + PCl.y };
const z0 = T.h;
prism(circle(PC.u, PC.v, FR), z0, z0 + 14, C.b200, C.w);
for (let k = 0; k < 4; k++) {
  const a = (Math.PI / 4) + (k * Math.PI) / 2;
  poly(circle(PC.u + 35 * Math.cos(a), PC.v + 35 * Math.sin(a), 5.5, 24).map(([u, v]) => P(u, v, z0 + 14)), C.b100, C.b500, 1.2);
}
prism(circle(PC.u, PC.v, 23), z0 + 14, z0 + 56, C.b200, C.w);
poly(circle(PC.u, PC.v, 13, 36).map(([u, v]) => P(u, v, z0 + 56)), C.b200, C.b500, 1.2);

// ---------------------------------------------------------------- the shopping bag, the hub's object, at the back
{
  const { u, v, w, d, h } = BAG;
  poly([P(u, v, h), P(u + w, v, h), P(u + w, v + d, h), P(u, v + d, h)], C.b100, C.b500, 1.6);
  // the order: a parcel standing forward in the bag, the flange's mark printed on its lid
  const pu = u + 26, pv = v + 10, pw = 50, pd = 36, pz0 = h - 30, pz1 = h + 34;
  poly([P(pu + pw, pv, pz0), P(pu + pw, pv + pd, pz0), P(pu + pw, pv + pd, pz1), P(pu + pw, pv, pz1)], C.b200);
  poly([P(pu, pv + pd, pz0), P(pu + pw, pv + pd, pz0), P(pu + pw, pv + pd, pz1), P(pu, pv + pd, pz1)], C.w);
  poly([P(pu, pv, pz1), P(pu + pw, pv, pz1), P(pu + pw, pv + pd, pz1), P(pu, pv + pd, pz1)], C.w);
  {
    const cx = pw / 2, cy = pd / 2;
    let m = `<circle cx="${cx}" cy="${cy}" r="12.5" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6"/><circle cx="${cx}" cy="${cy}" r="5" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`;
    for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + (k * Math.PI) / 2; m += `<circle cx="${r1(cx + 9 * Math.cos(a))}" cy="${r1(cy + 9 * Math.sin(a))}" r="1.5" fill="${C.b500}"/>`; }
    flat(pu, pv, pz1, m);
  }
  poly([P(u, v + d, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u, v + d, h)], C.w);
  poly([P(u + w, v, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u + w, v, h)], C.b200);
  const rim = 16;
  line([P(u, v + d, h - rim), P(u + w, v + d, h - rim), P(u + w, v, h - rim)], `stroke="${C.b500}" stroke-width="1.2" stroke-linejoin="round"`);
  const hl = P(u + w * 0.28, v + d, h - 7), hr = P(u + w * 0.72, v + d, h - 7);
  const lift = 52;
  path(`M${r1(hl[0])} ${r1(hl[1])} C${r1(hl[0])} ${r1(hl[1] - lift)} ${r1(hr[0])} ${r1(hr[1] - lift)} ${r1(hr[0])} ${r1(hr[1])}`, `fill="none" stroke="${C.b500}" stroke-width="4.4" stroke-linecap="round"`);
  track([[hl[0], hl[1] - lift * 0.75], [hr[0], hr[1] - lift * 0.75]]);
  // the price tag hangs plumb under the handle's right end
  const hu = u + w * 0.72, tz = h - 40;
  line([P(hu, v + d, h - 7), P(hu, v + d, tz - 6)], `stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"`);
  faceU(hu - 14, v + d, tz, `<rect width="28" height="40" rx="5" fill="${C.b500}"/><circle cx="14" cy="9" r="3" fill="${C.w}"/>`);
  const e = P(u + w + 4, RV, 0);
  out.push(`<circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="3.6" fill="${C.b500}"/>`);
}

// ---------------------------------------------------------------- the buyer, a client, at the page's right corner, hand on the add button
function pawn(u, v, hand) {
  const [x, y] = P(u, v, 0);
  const body = `M${r1(x - 18)} ${r1(y)} V${r1(y - 42)} A18 18 0 0 1 ${r1(x + 18)} ${r1(y - 42)} V${r1(y)} A18 8.5 0 0 1 ${r1(x - 18)} ${r1(y)} Z`;
  track([[x - 20, y + 9], [x + 20, y - 92]]);
  out.push(`<path d="${body}" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<circle cx="${r1(x)}" cy="${r1(y - 78)}" r="13" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`);
  const s = [x + (hand[0] < x ? -11 : 11), y - 28];
  const e = hand;
  const id = `ctp-arm-${Math.round(u)}`;
  out.push(`<mask id="${id}" maskUnits="userSpaceOnUse" x="-900" y="-900" width="2400" height="2400"><rect x="-900" y="-900" width="2400" height="2400" fill="#fff"/><path d="${body}" fill="#000"/></mask>`);
  out.push(`<g mask="url(#${id})"><path d="M${r1(s[0])} ${r1(s[1])} L${r1(e[0])} ${r1(e[1])}" stroke="${C.b500}" stroke-width="8.5" stroke-linecap="round"/><circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="6.8" fill="${C.b500}"/></g>`);
  out.push(`<path d="M${r1(s[0])} ${r1(s[1])} L${r1(e[0])} ${r1(e[1])}" stroke="${C.w}" stroke-width="5.3" stroke-linecap="round"/><circle cx="${r1(e[0])}" cy="${r1(e[1])}" r="5.2" fill="${C.w}"/>`);
}
{
  const hand = P(S.u + BTN.u + BTN.w * 0.82, S.v + BTN.v + BTN.d * 0.55, T.h + 3);
  pawn(362, 172, hand);
}

// ---------------------------------------------------------------- write
const pad = 6;
const xs = B.map((p) => p[0]), ys = B.map((p) => p[1]);
const minX = Math.floor(Math.min(...xs) - pad), minY = Math.floor(Math.min(...ys) - pad);
const W = Math.ceil(Math.max(...xs) + pad - minX), H = Math.ceil(Math.max(...ys) + pad - minY);
const ALT = 'Isometric illustration for ecommerce UX design for technical parts. A product page lies flat on a dotted floor as a solid blue tablet: a machined flange stands on its picture with a bracket across its width and a lime check on it, and beside it three facts with their own marks (it fits, it is in stock, it arrives) sit under a blue add button. A buyer stands at the corner of the page with a hand on that button, and a dashed line runs from the button over the page edge and across the floor into a white shopping bag, where a parcel printed with the same flange stands ready.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${W} ${H}" role="img" aria-label="${ALT}">\n${out.join('\n')}\n</svg>\n`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'hero.svg'), svg);
console.log('viewBox', minX, minY, W, H, (W / H).toFixed(2));
