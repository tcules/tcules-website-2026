// Generator for docs/illustrations/run-2026-11-05/services/hero.svg (the /services hub hero, round 3).
// One rich scene: the whole service line laid out on one studio bench, design leading at the front,
// the working product (a light laptop, dark blue screen) at the back.
// World: x to the right-down, y to the left-down, z up. 2:1 isometric as in the approved heroes.
// Run: node docs/illustrations/run-2026-11-05/services/hero.gen.mjs <out.svg>
import { writeFileSync } from 'node:fs';

const P = (x, y, z = 0) => [0.9 * (x - y), 0.45 * (x + y) - z];
const f = (n) => Math.round(n * 10) / 10;
const B = { 500: '#0048FF', 600: '#003EE0', 700: '#0031B0', 300: '#8AA5FF', 200: '#B8C8FF', 100: '#DBE4FF', 50: '#EEF2FF' };
const LIME = '#D7F04A', LIME_D = '#A1B71F', INK = '#1B1B18', W = '#FFFFFF';
const NS = 'vector-effect="non-scaling-stroke"';
const out = [];
const add = (s) => out.push(s);
const d2 = (a) => a.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ') + ' Z';
const ext = []; // every projected point, for the viewBox
const track = (pts) => { pts.forEach((p) => ext.push(p)); return pts; };

// plane transforms: a floor-parallel plane, a plane facing +y (seen from the lower left),
// and a plane facing +x (seen from the lower right), each with u across and v down
const mFloor = (x, y, z) => { const [X, Y] = P(x, y, z); return `matrix(0.9 0.45 -0.9 0.45 ${f(X)} ${f(Y)})`; };
const mFront = (x, y, ztop) => { const [X, Y] = P(x, y, ztop); return `matrix(0.9 0.45 0 1 ${f(X)} ${f(Y)})`; };
const mSide = (x, y, ztop) => { const [X, Y] = P(x, y, ztop); return `matrix(0.9 -0.45 0 1 ${f(X)} ${f(Y)})`; };

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
    const q = track([a, b, [b[0] + d[0], b[1] + d[1], b[2] + d[2]], [a[0] + d[0], a[1] + d[1], a[2] + d[2]]].map((p) => P(...p)));
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
const light = (n) => (n[2] > 0.5 ? B[100] : n[1] > n[0] ? B[100] : B[200]);
const blue = (n) => (n[1] > n[0] ? B[600] : B[700]);
const lime = () => LIME_D;

// a flat slab with a rounded top: top face at z0 + h; sides by colour; a silhouette outline
function slab(x, y, w, d, z0, h, r, { top = W, sides = light, stroke = B[500], sw = 1.6 } = {}) {
  const topW = rrect(w, d, r).map(([u, v]) => [x + u, y + v, z0 + h]);
  let s = extrude(topW, [0, 0, -h], sides);
  const topP = track(topW.map((p) => P(...p)));
  s += `<path d="${d2(topP)}" fill="${top}"/>`;
  if (stroke) {
    const sil = hull(topP.concat(topW.map((p) => P(p[0], p[1], z0))));
    s += `<path d="${d2(sil)}" stroke="${stroke}" stroke-width="${sw}"/>`;
    s += `<path d="${d2(topP)}" stroke="${stroke}" stroke-width="${f(sw * 0.75)}"/>`;
  }
  return s;
}
// a standing panel facing +y: its face in the plane y, from z ztop down by h, extruded back by t
function panel(x, y, ztop, w, h, t, r, { face = W, sides = light, stroke = B[500], sw = 1.6, inner = '' } = {}) {
  const faceW = rrect(w, h, r).map(([u, v]) => [x + u, y, ztop - v]);
  let s = extrude(faceW, [0, -t, 0], sides);
  const faceP = track(faceW.map((p) => P(...p)));
  if (stroke) {
    const sil = hull(faceP.concat(faceW.map((p) => P(p[0], p[1] - t, p[2]))));
    s += `<path d="${d2(sil)}" fill="${face}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  s += `<path d="${d2(faceP)}" fill="${face}" ${stroke ? `stroke="${stroke}" stroke-width="${f(sw * 0.75)}"` : ''}/>`;
  if (inner) s += `<g transform="${mFront(x, y, ztop)}">${inner}</g>`;
  return s;
}
// a vertical cylinder standing at (x, y) on z0
function cylinder(x, y, z0, r, h, { fill = W, side = B[100], stroke = B[500], sw = 1.6 } = {}) {
  const rx = r * 0.9 * Math.SQRT2, ry = r * 0.45 * Math.SQRT2;
  const [cx, cyB] = P(x, y, z0); const cyT = cyB - h;
  track([[cx - rx, cyT - ry], [cx + rx, cyB + ry]]);
  let s = `<path d="M${f(cx - rx)} ${f(cyT)} V${f(cyB)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cyB)} V${f(cyT)} Z" fill="${side}" stroke="${stroke}" stroke-width="${sw}"/>`;
  s += `<ellipse cx="${f(cx)}" cy="${f(cyT)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  return s;
}
// a pawn at world (x, y, z): the solid arm grows out of the shoulder (owner, 5 Nov; as on the home hero).
// A Tcules (solid) pawn is edged in white (owner, 5 Nov 2026): the white silhouette of body, head and arm is
// drawn first, a little larger, and the blue shapes go on top at their own size, so the edge runs round the
// whole figure and never across the shoulder where the arm leaves the body.
const EDGE = 1.7; // the white edge on a Tcules pawn
function pawn(x, y, z = 0, { solid = true, reach = null, from = 'right' } = {}) {
  const [bx, by] = P(x, y, z);
  const r = 17, h = 46, head = 12;
  const fill = solid ? B[500] : W;
  const sw = solid ? 0 : 1.6;
  const st = solid ? '' : `stroke="${B[500]}" stroke-width="${sw}"`;
  track([[bx - r, by - h - 2 * r - 2 * head], [bx + r, by + 9]]);
  const bodyD = `M${f(bx - r)} ${f(by)} V${f(by - h)} A${r} ${r} 0 0 1 ${f(bx + r)} ${f(by - h)} V${f(by)}`;
  const hy = f(by - h - r - 4 - head);
  const sx = bx + (from === 'right' ? 7 : -7), sy = by - h - 4;
  const armD = reach ? `M${f(sx)} ${f(sy)} L${f(reach[0])} ${f(reach[1])}` : '';
  let s = '';
  if (solid) {
    const we = `fill="${W}" stroke="${W}" stroke-width="${2 * EDGE}"`;
    s += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${r}" ry="8" ${we}/>`;
    s += `<path d="${bodyD}" ${we}/>`;
    s += `<circle cx="${f(bx)}" cy="${hy}" r="${head + EDGE}" fill="${W}"/>`;
    if (reach) {
      s += `<path d="${armD}" stroke="${W}" stroke-width="${f(6.4 + 2 * EDGE)}"/>`;
      s += `<circle cx="${f(reach[0])}" cy="${f(reach[1])}" r="${f(5.2 + EDGE)}" fill="${W}"/>`;
    }
  }
  s += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${r}" ry="8" fill="${fill}" ${st}/>`;
  s += `<path d="${bodyD}" fill="${fill}" ${st}/>`;
  if (solid) s += `<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${r}" ry="8" fill="${fill}"/>`;
  s += `<circle cx="${f(bx)}" cy="${hy}" r="${head}" fill="${fill}" ${st}/>`;
  if (reach) {
    s += `<path d="${armD}" stroke="${B[500]}" stroke-width="6.4"/>`;
    s += `<circle cx="${f(reach[0])}" cy="${f(reach[1])}" r="5.2" fill="${B[500]}"/>`;
  }
  return s;
}
const bar = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${c}"/>`;

// ================= layout (world units) =================
// Round 3. One route through the bench: the design starts on the lime card at the front left, runs into the
// laptop (the one hero object, back centre), and on to the phone at the back right where the second designer
// stands. The earlier screen and the database cylinders sit in the same back row, the tray and the code pair
// along the front edge.
const A = JSON.parse(process.env.SVC || '{}');
const BW = A.bw ?? 700, BD = 316, BH = 16, BT = BH; // the bench, top at z = 16
const FACE_Y = 30;                                   // the plane the three screens stand in

// ================= floor =================
const FX0 = A.fx0 ?? -90, FY0 = A.fy0 ?? -140, FX = BW + (A.fxp ?? 120), FY = BD + (A.fyp ?? 200);
add(`<defs><pattern id="svcHeroDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.3" fill="${B[300]}"/></pattern></defs>`);
add(`<!-- Floor: dotted, a dashed edge, a soft inset under the bench -->`);
add(`<g transform="${mFloor(FX0, FY0, 0)}"><rect width="${FX}" height="${FY}" fill="url(#svcHeroDots)"/></g>`);
add(`<g transform="${mFloor(-36, -30, 0)}"><rect width="${BW + 72}" height="${BD + 84}" rx="8" fill="${B[50]}"/></g>`);
const floorP = track([P(FX0, FY0), P(FX0 + FX, FY0), P(FX0 + FX, FY0 + FY), P(FX0, FY0 + FY)]);
add(`<path d="${d2(floorP)}" stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="6 5"/>`);

// ================= the bench =================
add(`<!-- One bench holding the whole service line -->`);
add(slab(0, 0, BW, BD, 0, BH, 20));

// ================= back row =================
// --- the earlier screen (modernisation and audits): faded, on a stand, two issues marked, one item carried on
const OLD = { x: 26, y: FACE_Y, w: 172, h: 108, foot: A.foot ?? 26 };
OLD.z = BT + OLD.foot + OLD.h;
const OLD_ITEM = [A.oiu ?? 146, A.oiv ?? 56];        // u, v of the pinned item (right column)
add(`<!-- Modernisation and audits: the earlier screen, faded, on its stand; two issues marked, one item carried across -->`);
{
  // the stand: a base plate on the bench and a short neck
  const nx = OLD.x + OLD.w / 2 - 9;
  add(slab(OLD.x + OLD.w / 2 - 34, FACE_Y - 10, 68, 34, BT, 4, 8, { top: B[50], sides: () => B[100], stroke: B[300], sw: 1.4 }));
  add(panel(nx, FACE_Y - 2, BT + OLD.foot + 2, 18, OLD.foot - 2, 4, 2, { face: B[50], sides: () => B[100], stroke: B[300], sw: 1.4 }));
  let s = `<rect x="0" y="0" width="${OLD.w}" height="18" rx="8" fill="${B[100]}"/><rect x="0" y="10" width="${OLD.w}" height="8" fill="${B[100]}"/>`;
  s += `<circle cx="12" cy="9" r="2.6" fill="${B[300]}"/><circle cx="21" cy="9" r="2.6" fill="${B[300]}"/>`;
  s += `<rect x="10" y="26" width="112" height="38" rx="6" fill="${B[50]}" stroke="${B[300]}" stroke-width="1" ${NS}/>`;
  s += bar(18, 35, 56, 5, B[200]) + bar(18, 47, 82, 5, B[200]);
  s += `<rect x="10" y="70" width="52" height="30" rx="6" fill="${B[50]}" stroke="${B[300]}" stroke-width="1" ${NS}/>`;
  s += `<rect x="70" y="70" width="52" height="30" rx="6" fill="${B[50]}" stroke="${B[300]}" stroke-width="1" ${NS}/>`;
  s += bar(18, 80, 30, 5, B[200]) + bar(78, 80, 30, 5, B[200]);
  // right column: a short list, the pinned item solid
  [34, OLD_ITEM[1], 78, 92].forEach((v) => {
    s += v === OLD_ITEM[1] ? bar(132, v - 4, 30, 8, B[500]) : bar(134, v - 2.5, 24, 5, B[200]);
  });
  // audit: two issues marked on the earlier screen
  for (const [u, v] of [[A.m1u ?? 98, A.m1v ?? 35], [A.m2u ?? 36, A.m2v ?? 85]]) {
    s += `<circle cx="${u}" cy="${v}" r="7.5" fill="${W}" stroke="${B[500]}" stroke-width="1.5" ${NS}/><circle cx="${u}" cy="${v}" r="2.6" fill="${B[500]}"/>`;
  }
  add(panel(OLD.x, OLD.y, OLD.z, OLD.w, OLD.h, 5, 8, { face: W, stroke: B[300], sw: 1.6, sides: () => B[100], inner: s }));
}

// --- the laptop: light body, only the screen dark blue (the hero object)
const LX = 244, LW = 248, LDD = 124, LDH = 9;
const LZ = BT + LDH, SH = 164;
const SX = 10, SY = 10, SWd = LW - 20, SHt = SH - 20;
const NEW_ITEM_V = SY + 40;
add(`<!-- Working software, the hero: a laptop with a light body, only its screen dark blue -->`);
{
  add(panel(LX, FACE_Y, LZ + SH, LW, SH, 6, [12, 12, 3, 3], { face: W }));
  let s = `<rect x="${SX}" y="${SY}" width="${SWd}" height="${SHt}" rx="7" fill="${B[500]}"/>`;
  s += `<rect x="${SX + 8}" y="${SY + 8}" width="40" height="${SHt - 16}" rx="5" fill="${B[600]}"/>`;
  [24, 40, 54, 68].forEach((v, i) => { s += bar(SX + 14, SY + v - 2.5, i ? 24 : 28, 5, i === 1 ? W : B[300]); });
  s += bar(SX + 58, SY + 12, 66, 6, B[200]);
  s += `<rect x="${SX + 56}" y="${SY + 26}" width="104" height="54" rx="6" fill="${W}"/>`;
  [14, 24, 18, 32, 26].forEach((hh, i) => { s += `<rect x="${SX + 68 + i * 17}" y="${SY + 70 - hh}" width="10" height="${hh}" rx="2" fill="${i === 3 ? B[500] : B[200]}"/>`; });
  s += `<rect x="${SX + 56}" y="${SY + 88}" width="48" height="${SHt - 96}" rx="6" fill="${W}"/>`;
  s += bar(SX + 63, SY + 98, 32, 5, B[200]) + bar(SX + 63, SY + 108, 24, 5, B[200]);
  s += `<rect x="${SX + 112}" y="${SY + 88}" width="48" height="${SHt - 96}" rx="6" fill="${W}"/>`;
  s += bar(SX + 119, SY + 98, 32, 5, B[200]) + bar(SX + 119, SY + 108, 24, 5, B[200]);
  // the AI panel: an answer with the AI badge
  const ax = SX + 168, aw = SWd - 176;
  s += `<rect x="${ax}" y="${SY + 26}" width="${aw}" height="${SHt - 34}" rx="6" fill="${B[600]}"/>`;
  s += `<rect x="${ax + 7}" y="${SY + 35}" width="26" height="14" rx="7" fill="${W}"/>`;
  s += `<path d="M${ax + 14.2} ${SY + 45.5} l2.7 -7 l2.7 7 M${ax + 15.3} ${SY + 43} h3.2 M${ax + 25.2} ${SY + 38.5} v7" stroke="${B[500]}" stroke-width="1.4"/>`;
  s += bar(ax + 7, SY + 58, aw - 14, 5, B[300]) + bar(ax + 7, SY + 68, aw - 22, 5, B[300]) + bar(ax + 7, SY + 78, aw - 18, 5, B[300]);
  s += `<rect x="${ax + 7}" y="${SY + SHt - 26}" width="${aw - 14}" height="13" rx="6.5" fill="${B[500]}"/>`;
  add(`<g transform="${mFront(LX, FACE_Y, LZ + SH)}">${s}</g>`);
  add(slab(LX, FACE_Y, LW, LDD, BT, LDH, 10));
  let k = `<g transform="${mFloor(LX, FACE_Y, LZ)}">`;
  k += `<rect x="20" y="14" width="${LW - 40}" height="56" rx="7" fill="${B[100]}"/>`;
  for (let r = 0; r < 3; r++) k += `<rect x="30" y="${22 + r * 15}" width="${LW - 60}" height="9" rx="4" fill="${W}"/>`;
  k += `<rect x="${LW / 2 - 38}" y="80" width="76" height="34" rx="7" fill="${B[50]}" stroke="${B[200]}" stroke-width="1.2" ${NS}/></g>`;
  add(k);
}
// the pinned item, carried from the earlier screen to the new one (dotted, as on the modernisation hero)
{
  const z = OLD.z - OLD_ITEM[1];
  const zNew = LZ + SH - NEW_ITEM_V;
  const a = P(OLD.x + 162, FACE_Y, z);
  const b = P(LX + SX + 14, FACE_Y, zNew);
  add(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${B[500]}" stroke-width="1.6" stroke-dasharray="0.1 5"/>`);
}

// --- back end: database cylinders, seated against the laptop's right side, so the back end belongs to it
add(`<!-- Back end and APIs: database cylinders against the laptop -->`);
{
  const cx = LX + LW + 26, r = 25;
  add(cylinder(cx, A.db1 ?? 62, BT, r, 38));
  add(cylinder(cx, A.db1 ?? 62, BT + 38, r, 26));
  add(cylinder(cx, A.db2 ?? 124, BT, r, 38));
}

// --- mobile and release: a phone, solid blue (owner, 5 Nov: a phone may stay blue), in the back row
const PH = { x: A.phx ?? 590, w: 50, h: A.phh ?? 96 };
add(`<!-- Mobile and release: a phone, solid blue, in the same row as the laptop -->`);
{
  const { x, w, h } = PH;
  let s = `<rect x="5" y="9" width="${w - 10}" height="${h - 18}" rx="6" fill="${B[600]}"/>`;
  s += bar(11, 16, 16, 4, B[300]);
  s += `<rect x="10" y="26" width="${w - 20}" height="28" rx="5" fill="${W}"/>`;
  s += bar(15, 33, 18, 5, B[500]) + bar(15, 43, 12, 4, B[200]);
  s += bar(10, 61, w - 20, 5, B[300]) + bar(10, 70, w - 28, 5, B[300]);
  s += `<rect x="10" y="${h - 26}" width="${w - 20}" height="10" rx="5" fill="${W}"/>`;
  add(panel(x, FACE_Y, BT + h, w, h, 9, 10, { face: B[500], sides: blue, stroke: B[600], inner: s }));
}
// the product goes on to release: one dashed line from the laptop's edge to the phone
{
  const a = P(LX + LW + 3, FACE_Y, LZ + (A.lpa ?? 112)), b = P(PH.x - 3, FACE_Y, BT + (A.lpb ?? 70));
  add(`<!-- Carried through to release: the laptop's dashed line to the phone -->`);
  add(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${B[500]}" stroke-width="1.4" stroke-dasharray="4 4"/>`);
  add(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="3.2" fill="${B[500]}"/>`);
}

// ================= front row =================
const PD = { x: A.pdx ?? 40, y: A.pdy ?? 178, w: 160, d: 100, z: BT + (A.pdz ?? 60), t: A.pdt ?? 14 };
// the design projects into the product: dashed, from the lifted card into the screen's lower-left edge
{
  const a = P(PD.x + PD.w, PD.y, PD.z);
  const b = P(LX + SX, FACE_Y, LZ + (A.tz ?? 40));
  add(`<!-- Nothing gets lost: the design's dashed line runs into the working product -->`);
  add(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${B[500]}" stroke-width="1.4" stroke-dasharray="4 4"/>`);
  add(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="3.4" fill="${B[500]}"/>`);
}
// --- design systems: one long, low tray of five parts along the front edge
add(`<!-- Design systems: a long tray holding five parts -->`);
{
  const x = A.trx ?? 244, y = A.try ?? 234, w = A.trw ?? 196, d = 52;
  add(slab(x, y, w, d, BT, 10, 10));
  const cy = d / 2;
  let s = `<g transform="${mFloor(x, y, BT + 10)}">`;
  s += `<rect x="10" y="${cy - 8}" width="28" height="16" rx="8" fill="${B[500]}"/>`;
  s += `<rect x="46" y="${cy - 8}" width="36" height="16" rx="5" fill="${W}" stroke="${B[500]}" stroke-width="1.3" ${NS}/>` + bar(52, cy - 2.5, 18, 5, B[200]);
  s += `<rect x="90" y="${cy - 8}" width="28" height="16" rx="8" fill="${B[500]}"/><circle cx="${90 + 20}" cy="${cy}" r="5" fill="${W}"/>`;
  s += `<rect x="126" y="${cy - 8}" width="16" height="16" rx="4" fill="${B[500]}"/><path d="M${129.5} ${cy} l3.2 3.2 l5.6 -6.2" stroke="${W}" stroke-width="1.8"/>`;
  s += `<rect x="150" y="${cy - 14}" width="${w - 160}" height="28" rx="5" fill="${W}" stroke="${B[500]}" stroke-width="1.3" ${NS}/>`;
  s += bar(156, cy - 7, 16, 4, B[500]) + bar(156, cy + 1, 22, 4, B[200]);
  s += `</g>`;
  add(s);
}
// --- design engineering: a component beside its code panel (white with a blue outline, blue brackets)
add(`<!-- Design engineering: a component, and the code it is built in -->`);
{
  const y = A.dey ?? 268, h = 74, x0 = A.dex ?? 500;
  let c = `<rect x="10" y="10" width="72" height="54" rx="7" fill="${W}" stroke="${B[500]}" stroke-width="1.2" ${NS}/>`;
  c += bar(20, 20, 38, 7, B[500]) + bar(20, 33, 50, 5, B[200]) + bar(20, 42, 40, 5, B[200]);
  c += `<rect x="20" y="51" width="30" height="9" rx="4.5" fill="${B[500]}"/>`;
  add(panel(x0, y, BT + h, 92, h, 5, 8, { face: B[50], inner: c }));
  let k = `<path d="M15 14 l-6 5.5 l6 5.5 M31 14 l6 5.5 l-6 5.5" stroke="${B[500]}" stroke-width="2"/>`;
  [34, 44, 54, 64].forEach((v, i) => { k += bar(i % 2 ? 16 : 9, v - 2.5, [36, 24, 30, 20][i], 5, i === 2 ? B[500] : B[200]); });
  add(panel(x0 + 102, y, BT + h, 54, h, 5, 8, { face: W, inner: k }));
}
// --- product design, the lead: the wireframe laid out in white parts on the one lime board, lifted off the bench
add(`<!-- Product design leads: the wireframe on the one lime board, lifted -->`);
{
  add(`<g transform="${mFloor(PD.x, PD.y, BT)}"><rect width="${PD.w}" height="${PD.d}" rx="10" stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="4 4" ${NS}/></g>`);
  for (const [x, y] of [[PD.x, PD.y + PD.d], [PD.x + PD.w, PD.y + PD.d], [PD.x + PD.w, PD.y]]) {
    const a = P(x, y, BT), b = P(x, y, PD.z - PD.t);
    add(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="3 4"/>`);
  }
  add(slab(PD.x, PD.y, PD.w, PD.d, PD.z - PD.t, PD.t, 10, { top: LIME, sides: lime, stroke: LIME_D, sw: 1.2 }));
  // the wireframe, laid out on the lime in white parts: a title, a sidebar, a main panel, a journey to a tick
  const z = PD.z, T = 3, X = (u) => PD.x + u, Y = (v) => PD.y + v;
  add(slab(X(16), Y(28), 30, 56, z, T, 5, { sw: 1.3 }));
  add(slab(X(56), Y(28), 88, 28, z, T, 5, { sw: 1.3 }));
  let s = `<g transform="${mFloor(PD.x, PD.y, z)}">` + bar(16, 12, 52, 7, B[500]) + `</g>`;
  s += `<g transform="${mFloor(X(16), Y(28), z + T)}">` + bar(7, 9, 16, 4, B[300]) + bar(7, 19, 12, 4, B[300]) + bar(7, 29, 16, 4, B[300]) + `</g>`;
  s += `<g transform="${mFloor(X(56), Y(28), z + T)}">` + bar(8, 8, 44, 5, B[300]) + bar(8, 16, 60, 4, B[200]) + `</g>`;
  const j0 = 62, j1 = 138, jy = 74;
  let g = `<g transform="${mFloor(PD.x, PD.y, z)}">`;
  g += `<path d="M${j0} ${jy} H${j1}" stroke="${W}" stroke-width="2.2"/>`;
  g += `<circle cx="${j0}" cy="${jy}" r="5" fill="${W}" stroke="${B[500]}" stroke-width="1.4" ${NS}/><circle cx="${j0}" cy="${jy}" r="1.8" fill="${B[500]}"/>`;
  g += `<rect x="${(j0 + j1) / 2 - 5.5}" y="${jy - 5.5}" width="11" height="11" rx="3" fill="${W}" stroke="${B[500]}" stroke-width="1.4" ${NS}/>`;
  g += `<rect x="${j1 - 8}" y="${jy - 8}" width="16" height="16" rx="4" fill="${B[500]}"/><path d="M${j1 - 4} ${jy} l3 3 l5 -6" stroke="${W}" stroke-width="1.6"/>`;
  s += g + `</g>`;
  add(s);
}

// ================= people =================
add(`<!-- A Tcules designer at the front left, a hand on the lifted card's corner -->`);
{
  const hand = P(PD.x + (A.hx ?? 0), PD.y + PD.d, PD.z - PD.t / 2);
  add(pawn(A.px ?? 14, A.py ?? 298, BT, { solid: true, reach: hand, from: 'right' }));
}
add(`<!-- The same designers stay to release: a second Tcules designer, a hand on the phone's edge -->`);
{
  const hand = P(PH.x + PH.w + 1, FACE_Y, BT + (A.r2z ?? 40));
  add(pawn(A.p2x ?? 676, A.p2y ?? 18, BT, { solid: true, reach: hand, from: 'left' }));
}

// ================= bounds =================
const xs = ext.map((p) => p[0]), ys = ext.map((p) => p[1]);
const pad = 4;
const vb = [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + 2 * pad].map(f);
const ALT = 'One bench holds the whole service line, with one route across it. At the front left, a Tcules designer holds a lifted lime board with a wireframe laid out on it, and a dashed line runs from it into the screen of a laptop at the back: a light laptop whose dark blue screen shows a working product with a chart, cards and an AI panel. From the laptop a second dashed line runs on to a blue phone, where a second Tcules designer stands with a hand on it. Database cylinders sit against the laptop. Beside it stands a faded earlier screen on its stand, two issues marked on it and one item carried across to the new screen by a dotted line. Along the front edge lie a tray of five interface parts and a component beside its code panel.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${ALT}" fill="none" stroke-linejoin="round" stroke-linecap="round">\n${out.join('\n')}\n</svg>\n`;
writeFileSync(process.argv[2], svg);
console.log('viewBox', vb.join(' '), 'aspect', (vb[2] / vb[3]).toFixed(2));
