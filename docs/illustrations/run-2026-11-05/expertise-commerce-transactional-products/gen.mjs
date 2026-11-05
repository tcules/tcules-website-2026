// Generator for the commerce / transactional products expertise hero.
//   node docs/illustrations/run-2026-11-05/expertise-commerce-transactional-products/gen.mjs
// Writes hero.svg beside it. Every point is projected on the family's 2:1 iso:
// floor (u, v) -> (0.9u - 0.9v, 0.45u + 0.45v), height z lifts straight up.
// Floor and people at healthtech's size (floor 545 x 402, pawn r22 / h62 / head 16, arm 11 incl. outline).
// v11: the bag leads at the right; the product page is a blue phone lying flat (data keeps the laptop).
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

// ---------------------------------------------------------------- the product page: a blue phone laid flat on the floor
// local screen units: x along u (across the phone), y along v (down the phone, its top at the back)
// The phone lies with its top at the back left and its button end toward the front right:
// screen x runs along -v, screen y along +u.
const [PHU, PHV] = env('PHONE', [50, 170]);
const PH = { u: PHU, v: PHV, w: 160, d: 290, h: 10, r: 24 };
const SC = { x: 11, y: 30, w: PH.w - 22, h: PH.d - 44 };
const BTN = { x: SC.x + 12, y: SC.y + SC.h - 14 - 32, w: SC.w - 24, h: 32 };
prism(rrect(PH.u, PH.v, PH.d, PH.w, PH.r), 0, PH.h, C.b600, C.b500, 1.6, C.b600);
{
  let ui = `<rect x="${SC.x}" y="${SC.y}" width="${SC.w}" height="${SC.h}" rx="14" fill="${C.w}"/>`;
  ui += `<rect x="${PH.w / 2 - 20}" y="13" width="40" height="7" rx="3.5" fill="${C.b700}"/>`;
  // the part's picture: a flange in elevation, its fit bracket and the one lime check
  const pic = { x: SC.x + 12, y: SC.y + 12, w: SC.w - 24, h: 104 };
  ui += `<rect x="${pic.x}" y="${pic.y}" width="${pic.w}" height="${pic.h}" rx="9" fill="${C.b50}" stroke="${C.b500}" stroke-width="1.2"/>`;
  const cx = pic.x + pic.w / 2, fw = 74, cw = 34, cy = pic.y + 14, fy = pic.y + 46, fh = 14;
  ui += `<rect x="${cx - cw / 2}" y="${cy}" width="${cw}" height="${fy - cy}" rx="2" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`;
  ui += `<rect x="${cx - fw / 2}" y="${fy}" width="${fw}" height="${fh}" rx="2" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6"/>`;
  ui += `<path d="M${cx - 7} ${cy + 3} V${fy + fh - 3} M${cx + 7} ${cy + 3} V${fy + fh - 3}" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="3 3" stroke-linecap="round"/>`;
  const by = fy + fh + 18, x0 = cx - fw / 2, x1 = cx + fw / 2;
  ui += `<path d="M${x0} ${by} H${x1} M${x0} ${by - 5} V${by + 5} M${x1} ${by - 5} V${by + 5}" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-linecap="round"/>`;
  ui += `<circle cx="${cx}" cy="${by}" r="10" fill="${C.lime}" stroke="${C.limeD}" stroke-width="1.2"/><path d="M${cx - 4} ${by} L${cx - 1} ${by + 3.4} L${cx + 4.4} ${by - 3.6}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  // three facts with their own marks: it fits (a bracket), in stock (a dot), it arrives (a van)
  const ROW0 = pic.y + pic.h + 14, ROWH = 26, T = 18, gx = SC.x + 12;
  const glyphs = [
    (x, y) => `<path d="M${x + 4.5} ${y + 9} H${x + 13.5} M${x + 4.5} ${y + 5.5} V${y + 12.5} M${x + 13.5} ${y + 5.5} V${y + 12.5}" fill="none" stroke="${C.w}" stroke-width="1.8" stroke-linecap="round"/>`,
    (x, y) => `<circle cx="${x + 9}" cy="${y + 9}" r="3.8" fill="${C.w}"/>`,
    (x, y) => `<path d="M${x + 3.4} ${y + 5.4} H${x + 10} V${y + 11.4} H${x + 3.4} Z M${x + 10} ${y + 7.4} H${x + 12.3} L${x + 14.4} ${y + 9.7} V${y + 11.4} H${x + 10} Z" fill="${C.w}"/><circle cx="${x + 6.2}" cy="${y + 12.8}" r="1.6" fill="${C.w}"/><circle cx="${x + 12}" cy="${y + 12.8}" r="1.6" fill="${C.w}"/>`,
  ];
  glyphs.forEach((g, i) => {
    const y = ROW0 + i * ROWH;
    ui += `<rect x="${gx}" y="${y}" width="${T}" height="${T}" rx="5" fill="${C.b500}"/>` + g(gx, y);
    ui += `<rect x="${gx + T + 9}" y="${y + 5.5}" width="${[70, 54, 62][i]}" height="7" rx="3.5" fill="${C.b200}"/>`;
  });
  // the add button: solid blue pill, a white label bar
  ui += `<rect x="${BTN.x}" y="${BTN.y}" width="${BTN.w}" height="${BTN.h}" rx="${BTN.h / 2}" fill="${C.b500}"/>`;
  ui += `<rect x="${BTN.x + 30}" y="${BTN.y + BTN.h / 2 - 4}" width="${BTN.w - 60}" height="8" rx="4" fill="${C.w}"/>`;
  const [ox, oy] = P(PH.u, PH.v + PH.w, PH.h);
  out.push(`<g transform="matrix(0.9 -0.45 0.9 0.45 ${r1(ox)} ${r1(oy)})">${ui}</g>`);
}

// ---------------------------------------------------------------- the shopping bag, the hub's object, leading at the left
const [BU, BV] = env('BAG', [310, 30]);
const BAG = { u: BU, v: BV, w: 160, d: 96, h: 276 };
const conn = `stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
// the order's route: from the add button's near end, up in one arc and down into the bag's mouth
const phPt = (x, y, z = PH.h) => P(PH.u + y, PH.v + PH.w - x, z);
const [PRX] = env('PRESS', [BTN.w - 18]);
const start = phPt(BTN.x + PRX, BTN.y + BTN.h / 2); // where the hand presses
const endIn = P(BAG.u + BAG.w * 0.62, BAG.v + BAG.d * 0.5, BAG.h - 30);
const [AX, AY, BX, BY] = env('ARC', [-70, -200, -50, -210]);
const c1 = [start[0] + AX, start[1] + AY], c2 = [endIn[0] + BX, endIn[1] + BY];
const arcD = `M${r1(start[0])} ${r1(start[1])} C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(endIn[0])} ${r1(endIn[1])}`;
for (let i = 0; i <= 20; i++) {
  const t = i / 20, m = 1 - t;
  B.push([m ** 3 * start[0] + 3 * m * m * t * c1[0] + 3 * m * t * t * c2[0] + t ** 3 * endIn[0], m ** 3 * start[1] + 3 * m * m * t * c1[1] + 3 * m * t * t * c2[1] + t ** 3 * endIn[1]]);
}
{
  const { u, v, w, d, h } = BAG;
  // the mouth, open: looking in, the inside of the back wall and of the left wall, clipped to the opening
  const mouth = [P(u, v, h), P(u + w, v, h), P(u + w, v + d, h), P(u, v + d, h)];
  out.push(`<clipPath id="ctp-mouth"><polygon points="${pts(mouth)}"/></clipPath>`);
  poly(mouth, C.b200, null);
  const D = 70;
  out.push(`<g clip-path="url(#ctp-mouth)">`);
  poly([P(u, v, h), P(u + w, v, h), P(u + w, v, h - D), P(u, v, h - D)], C.b50, C.b500, 1.2);
  poly([P(u, v, h), P(u, v + d, h), P(u, v + d, h - D), P(u, v, h - D)], C.b100, C.b500, 1.2);
  out.push(`</g>`);
  poly(mouth, 'none', C.b500, 1.6);
  // the back handle, behind the mouth's far edge
  const bl = P(u + w * 0.3, v, h - 6), br = P(u + w * 0.7, v, h - 6), lift = 58;
  path(`M${r1(bl[0])} ${r1(bl[1])} C${r1(bl[0])} ${r1(bl[1] - lift)} ${r1(br[0])} ${r1(br[1] - lift)} ${r1(br[0])} ${r1(br[1])}`, `fill="none" stroke="${C.b500}" stroke-width="4.4" stroke-linecap="round"`);
  track([[bl[0], bl[1] - lift * 0.75], [br[0], br[1] - lift * 0.75]]);
  // the route drops into the mouth: drawn before the front faces, so they hide its end
  out.push(`<path d="${arcD}" stroke="${C.w}" stroke-width="5.2" stroke-linecap="round" fill="none"/>`);
  out.push(`<path d="${arcD}" ${conn}/>`);
  poly([P(u, v + d, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u, v + d, h)], C.w);
  poly([P(u + w, v, 0), P(u + w, v + d, 0), P(u + w, v + d, h), P(u + w, v, h)], C.b200);
  // the side gusset's centre crease, folding in at the top
  line([P(u + w, v + d / 2, 0), P(u + w, v + d / 2, h - 20)], `stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"`);
  // folded top hem
  const rim = 20;
  line([P(u, v + d, h - rim), P(u + w, v + d, h - rim), P(u + w, v, h - rim)], `stroke="${C.b500}" stroke-width="1.2" stroke-linejoin="round"`);
  // the front handle
  const hl = P(u + w * 0.3, v + d, h - 8), hr = P(u + w * 0.7, v + d, h - 8);
  path(`M${r1(hl[0])} ${r1(hl[1])} C${r1(hl[0])} ${r1(hl[1] - lift)} ${r1(hr[0])} ${r1(hr[1] - lift)} ${r1(hr[0])} ${r1(hr[1])}`, `fill="none" stroke="${C.b500}" stroke-width="4.4" stroke-linecap="round"`);
  track([[hl[0], hl[1] - lift * 0.75], [hr[0], hr[1] - lift * 0.75]]);
  // the price tag, hanging plumb from the handle's right foot
  const hu = u + w * 0.7, tz = h - 50;
  line([P(hu, v + d, h - 8), P(hu, v + d, tz - 6)], `stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"`);
  faceU(hu - 15, v + d, tz, `<rect width="30" height="44" rx="6" fill="${C.b500}"/><circle cx="15" cy="9.5" r="3.4" fill="${C.w}"/><rect x="8" y="22" width="14" height="5" rx="2.5" fill="${C.w}"/><rect x="8" y="31" width="10" height="5" rx="2.5" fill="${C.b200}"/>`);
}
// ---------------------------------------------------------------- the buyer, a client, at the phone, hand on the add button
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
  const [pu, pv] = env('BUYER', [396, 262]);
  pawn(pu, pv, [start[0], start[1] - 1]); // the hand presses the add button where the route begins
}

// ---------------------------------------------------------------- write
const pad = 6;
const xs = B.map((p) => p[0]), ys = B.map((p) => p[1]);
const minX = Math.floor(Math.min(...xs) - pad), minY = Math.floor(Math.min(...ys) - pad);
const W = Math.ceil(Math.max(...xs) + pad - minX), Hh = Math.ceil(Math.max(...ys) + pad - minY);
const ALT = 'Isometric illustration for ecommerce UX design for technical parts. A tall white shopping bag stands open on a dotted floor, its price tag hanging from the handle. In front of it a blue phone lies flat showing a product page: a machined flange with a bracket across its width and a lime check on it, three facts with their own marks (it fits, it is in stock, it arrives) and an add button. A buyer stands at the end of the phone pressing the button, and a dashed line arcs from that press up and over into the open bag.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${W} ${Hh}" role="img" aria-label="${ALT}">\n${out.join('\n')}\n</svg>\n`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(process.env.OUT || join(here, 'hero.svg'), svg);
console.log('viewBox', minX, minY, W, Hh, (W / Hh).toFixed(2));
