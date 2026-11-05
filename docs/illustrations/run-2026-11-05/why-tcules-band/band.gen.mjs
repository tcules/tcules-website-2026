// Generator for docs/illustrations/run-2026-11-05/why-tcules-band/band.svg
// /why-tcules, band "Better product decisions, before you build": one studio table, three pairs (a Tcules
// person beside a client person), one pair per principle, both hands of each pair on one shared thing.
// World: x to the right-down, y to the left-down, z up. 2:1 isometric as in the approved heroes.
// Run: node docs/illustrations/run-2026-11-05/why-tcules-band/band.gen.mjs <out.svg>
import { writeFileSync } from 'node:fs';

const OX = 420, OY = 30;
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


// ---------- layout (world) ----------
// One studio table, shorter than the last round (440 long, 2:1 in plan), so the three stations sit close
// together. Two pairs stand shoulder to shoulder on the front long edge (evidence at the left, pays-back at the
// right); the what-first pair stands behind the middle. Nobody stands at a short end.
const TX0 = 170, TY0 = 120, TW = 440, TD = 220;           // the studio table
const TZ = 42, TT = 9;                                     // table top surface z, top thickness
const FX0 = TX0 - 62, FY0 = TY0 - 86, FX = TW + 104, FY = TD + 86 + 44;   // floor
const FRONT = TY0 + TD + 28;                               // where the front pairs stand
const BACK = TY0 - 26;                                     // where the back pair stands
// the product, not built yet: a dashed frame along the back of the table, three bays in a row
const FR = { x: TX0 + 96, y: TY0 + 8, w: 226, d: 82 };
const BAY = 56, BG = 12, BAY_Y = FR.y + 13;
const BAYX = [0, 1, 2].map((i) => FR.x + 19 + i * (BAY + BG));
// the two pale zones along the front: the test at the left, the laptop and chart at the right
const LZ = { x: TX0 + 16, y: TY0 + 114, w: 158, d: TD - 128 };
const RZ = { x: TX0 + 188, y: TY0 + 114, w: TW - 204, d: TD - 128 };

// ---------- floor ----------
add(`<defs><pattern id="wtBandDots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.3" fill="${B[300]}"/></pattern></defs>`);
add(`<!-- Floor: dotted, a dashed edge, a soft inset under the objects -->`);
add(`<g transform="${mFloor(FX0 + 40, FY0 + 36, 0)}"><rect width="${FX - 80}" height="${FY - 72}" rx="6" fill="${B[50]}"/></g>`);
add(`<g transform="${mFloor(FX0, FY0, 0)}"><rect width="${FX}" height="${FY}" fill="url(#wtBandDots)"/></g>`);
add(`<path d="${d2([P(FX0, FY0), P(FX0 + FX, FY0), P(FX0 + FX, FY0 + FY), P(FX0, FY0 + FY)])}" stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="6 5"/>`);

// ---------- people ----------
// Blue = a Tcules person; white, outlined = the client's people (owner, 5 Nov 2026). One client fill for all three.
const BODY_R = 19.6, BODY_H = 50, HEAD = 13.6;
const ARM = 8.4, HAND = 6.6, RIM = 1.5;   // a client arm is the same shape, light, with a RIM-wide blue outline
function pawn(x, y, tone) {
  const [bx, by] = P(x, y, 0);
  const r = BODY_R, h = BODY_H;
  const solid = tone === 'tcules';
  const fill = solid ? B[500] : tone;
  const st = solid ? '' : ` stroke="${B[500]}" stroke-width="1.6"`;
  let s = `<path d="M${f(bx - r)} ${f(by)} V${f(by - h)} A${r} ${r} 0 0 1 ${f(bx + r)} ${f(by - h)} V${f(by)} A${r} 9.3 0 0 1 ${f(bx - r)} ${f(by)} Z" fill="${fill}"${st}/>`;
  s += `<circle cx="${f(bx)}" cy="${f(by - h - r - 5 - HEAD)}" r="${HEAD}" fill="${fill}"${st}/>`;
  grow(bx - r, by - h - r - 5 - 2 * HEAD); grow(bx + r, by + 9.3);
  const inside = ([X, Y]) => Math.abs(X - bx) < r && Y < by && (Y > by - h || Math.hypot(X - bx, Y - (by - h)) < r);
  return { s, bx, by, solid, fill, inside, headTop: by - h - r - 5 - 2 * HEAD, shoulder: (side) => [bx + side * 8, by - h - 2] };
}
// The arm grows from inside the shoulder. A Tcules arm is one solid blue stroke and a round hand. A client arm
// is the same stroke in the client's own light colour inside a blue outline; the outline starts at the body's
// edge, so the light sleeve runs over the body's own line and the arm reads attached.
function arm(p, side, to) {
  const from = p.shoulder(side);
  const d = `M${f(from[0])} ${f(from[1])} L${f(to[0])} ${f(to[1])}`;
  if (p.solid) return `<path d="${d}" stroke="${B[500]}" stroke-width="${ARM}"/><circle cx="${f(to[0])}" cy="${f(to[1])}" r="${HAND}" fill="${B[500]}"/>`;
  let e = from;
  for (let t = 0; t <= 1; t += 0.005) { const q = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]; if (!p.inside(q)) { e = q; break; } }
  let s = `<path d="M${f(e[0])} ${f(e[1])} L${f(to[0])} ${f(to[1])}" stroke="${B[500]}" stroke-width="${f(ARM + 2 * RIM)}" stroke-linecap="butt"/>`;
  s += `<circle cx="${f(to[0])}" cy="${f(to[1])}" r="${f(HAND + RIM)}" fill="${B[500]}"/>`;
  s += `<path d="${d}" stroke="${p.fill}" stroke-width="${ARM}"/>`;
  s += `<circle cx="${f(to[0])}" cy="${f(to[1])}" r="${HAND}" fill="${p.fill}"/>`;
  return s;
}

// ---------- pair 2, behind the table: a Tcules designer and the client's product owner ----------
const LB = { x: BAYX[0] + 8, y: BAY_Y + 8, w: BAY - 16, h: 26 };          // the lime block, the piece to build first
const LIME_Z = TZ + 4 + LB.h;
const LC = [LB.x + LB.w / 2, LB.y + LB.w / 2];
const D2T = pawn(LC[0] - (LC[1] - BACK) - 34, BACK, 'tcules');
const D2C = pawn(LC[0] - (LC[1] - BACK) + 66, BACK, W);
add(`<!-- What to build first: a Tcules designer and the client's product owner, behind the table -->`);
add(D2T.s);
add(D2C.s);

// ---------- the table ----------
add(`<!-- The studio table everyone works at -->`);
{
  const L = 12, inset = 22;
  for (const [lx, ly] of [[TX0 + inset, TY0 + inset], [TX0 + TW - inset - L, TY0 + inset], [TX0 + inset, TY0 + TD - inset - L], [TX0 + TW - inset - L, TY0 + TD - inset - L]]) {
    add(box({ x: lx, y: ly, z: 0, w: L, d: L, h: TZ - TT, r: 2, tone: T.blue }));
  }
  const top = rrect(TW, TD, 14).map(([u, v]) => [TX0 + u, TY0 + v, TZ]);
  add(extrude(top, [0, 0, -TT], (n) => (n[1] > n[0] ? B[600] : B[700])));
  let s = `<g transform="${mFloor(TX0, TY0, TZ)}"><rect width="${TW}" height="${TD}" rx="14" fill="${B[500]}"/>`;
  s += `<rect x="10" y="10" width="${TW - 20}" height="${TD - 20}" rx="8" fill="${W}"/>`;
  for (const z of [LZ, RZ]) s += `<rect x="${z.x - TX0}" y="${z.y - TY0}" width="${z.w}" height="${z.d}" rx="8" fill="${B[50]}" stroke="${B[200]}" stroke-width="1.2" ${NS}/>`;
  s += `</g>`;
  add(s);
}

// ---------- the product, not built yet: one dashed frame with three bays ----------
{
  add(`<!-- The product, not built yet: a dashed frame on the table, three bays for its parts -->`);
  const frameTone = { top: B[50], y: B[100], x: B[100], line: B[500] };
  let extra = `<g transform="${mFloor(FR.x, FR.y, TZ + 4)}">`;
  const ds = `stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="4 4" fill="none" ${NS}`;
  extra += `<rect x="${BAYX[2] - FR.x}" y="${BAY_Y - FR.y}" width="${BAY}" height="${BAY}" rx="6" ${ds}/>`;
  extra += `<rect x="${BAYX[1] - FR.x}" y="${BAY_Y - FR.y}" width="${BAY}" height="${BAY}" rx="6" ${ds}/>`;
  extra += `<rect x="${BAYX[0] - FR.x}" y="${BAY_Y - FR.y}" width="${BAY}" height="${BAY}" rx="6" fill="${B[100]}" stroke="${B[500]}" stroke-width="1.3" ${NS}/>`;
  extra += `</g>`;
  add(box({ x: FR.x, y: FR.y, z: TZ, w: FR.w, d: FR.d, h: 4, r: 8, tone: frameTone, sw: 1.4, dash: '6 4', topExtra: extra }));
  add(`<!-- Bay 2: next, a pale dashed block -->`);
  add(box({ x: BAYX[1] + 8, y: BAY_Y + 8, z: TZ + 4, w: BAY - 16, d: BAY - 16, h: 16, r: 5, tone: T.pale, sw: 1.2, dash: '4 4' }));
  add(`<!-- Bay 1: first, the lime block, set in -->`);
  add(box({ x: LB.x, y: LB.y, z: TZ + 4, w: LB.w, d: LB.w, h: LB.h, r: 5, tone: T.lime }));
  add(`<!-- Both hands on the piece to build first: decided together -->`);
  add(arm(D2T, 1, P(LB.x + LB.w * 0.22, LB.y + LB.w * 0.62, LIME_Z)));
  add(arm(D2C, -1, P(LB.x + LB.w * 0.86, LB.y + LB.w * 0.16, LIME_Z)));
}

{
  add(`<!-- A notebook and a mug at the back right of the table: a working table -->`);
  const nx = TX0 + 344, ny = TY0 + 26;
  add(box({ x: nx, y: ny, z: TZ, w: 56, d: 38, h: 4, r: 3, tone: T.white, sw: 1.3,
    topExtra: `<g transform="${mFloor(nx, ny, TZ + 4)}"><rect x="8" y="8" width="30" height="4" rx="2" fill="${B[200]}"/><rect x="8" y="17" width="40" height="4" rx="2" fill="${B[200]}"/><rect x="8" y="26" width="24" height="4" rx="2" fill="${B[200]}"/></g>` }));
  const [mx, my] = P(nx + 48, ny + 64, TZ);
  const r = 10, h = 20;
  let m = `<path d="M${f(mx + r - 1)} ${f(my - h + 4)} h5 a5 5 0 0 1 5 5 v3 a5 5 0 0 1 -5 5 h-5" stroke="${B[500]}" stroke-width="2.4"/>`;
  m += `<path d="M${f(mx - r)} ${f(my - h)} V${f(my)} A${r} ${f(r * 0.5)} 0 0 0 ${f(mx + r)} ${f(my)} V${f(my - h)}" fill="${W}" stroke="${B[500]}" stroke-width="1.4"/>`;
  m += `<ellipse cx="${f(mx)}" cy="${f(my - h)}" rx="${r}" ry="${f(r * 0.5)}" fill="${B[100]}" stroke="${B[500]}" stroke-width="1.4"/>`;
  add(m);
}

// ---------- pair 1, evidence before screens: one test station (paper sketch, prototype phone, ticked note) ----------
// Both hands land on it: the client's user on the phone's screen, the Tcules researcher on the sketch the phone
// stands on, beside the ticked note.
const U1 = TX0 + 30;                                         // the client's user stands here (x), at FRONT
const PH = { x: U1 - 2, y: TY0 + TD - 30, ztop: TZ + 4 + 70, w: 40, h: 70 };
const SK = { x: PH.x - 8, y: PH.y - 50, w: 140, d: 66 };     // the paper sketch the phone stands on
const R1 = TX0 + 128;                                        // the Tcules researcher, beside the user
const NT = { x: PH.x + 56, y: PH.y - 40, w: 46, d: 30 };     // the test note, ticked, on the sketch
{
  add(`<!-- A paper sketch of the screen, lying flat: still on paper, not built. The phone stands on it -->`);
  let s = `<g transform="${mFloor(SK.x, SK.y, TZ)}">`;
  s += `<rect width="${SK.w}" height="${SK.d}" rx="4" fill="${W}" stroke="${B[500]}" stroke-width="1.3" ${NS}/>`;
  const ds = `stroke="${B[300]}" stroke-width="1.1" stroke-dasharray="4 3" fill="none" ${NS}`;
  s += `<rect x="${SK.w - 30}" y="10" width="20" height="40" rx="4" ${ds}/>`;
  s += `<rect x="58" y="${SK.d - 13}" width="62" height="5" rx="2.5" fill="${B[200]}"/>`;
  s += `</g>`;
  add(s);
  add(`<!-- The test note: ticked -->`);
  add(box({ x: NT.x, y: NT.y, z: TZ, w: NT.w, d: NT.d, h: 3, r: 3, tone: T.white, sw: 1.3,
    topExtra: `<g transform="${mFloor(NT.x, NT.y, TZ + 3)}"><path d="M12 15 L19 22 L33 8" stroke="${B[500]}" stroke-width="2.6" ${NS}/></g>` }));
  add(`<!-- Evidence: a blue prototype phone on a small stand, at the scale of the people -->`);
  add(box({ x: PH.x + 4, y: PH.y - 14, z: TZ, w: 32, d: 17, h: 4, r: 4, tone: T.white, sw: 1.2 }));
  let inner = `<g transform="${mFront(PH.x, PH.y, PH.ztop)}">`;
  inner += `<rect x="4" y="6" width="32" height="58" rx="6" fill="${B[600]}"/>`;
  inner += `<rect x="8" y="11" width="24" height="17" rx="3" fill="${B[200]}"/>`;
  inner += `<rect x="8" y="33" width="19" height="4" rx="2" fill="${W}"/><rect x="8" y="41" width="14" height="4" rx="2" fill="${B[300]}"/>`;
  inner += `<rect x="8" y="51" width="24" height="8" rx="4" fill="${W}"/>`;
  inner += `</g>`;
  add(panel({ ...PH, r: 7, t: 5, face: B[500], sideTop: B[600], sideX: B[700], line: null, inner }));
}

// ---------- pair 3, design that pays back: the laptop and the chart side by side on the front edge ----------
// The laptop faces the front (+y), where the pair stands. Its button is wired, dotted along the x axis, to the
// top of the tallest of three bars on a chart tile right beside it.
const LH = 56;                                               // lid height
const LP = { x: TX0 + 196, w: 90, d: 40 };                   // base: w along x, d along y
LP.y = TY0 + TD - 14 - LP.d;
const LIDY = LP.y + 6;                                       // the lid's face, in the plane y = LIDY
const LID = { x: LP.x + 4, w: LP.w - 8, ztop: TZ + 5 + LH };
const BTN_U = LID.w - 22, BTN_V = 25;                        // button centre on the screen (u along +x, v down)
const BTN_Z = LID.ztop - BTN_V;
const BW = 20, BAR_GAP = 9, BASE_H = 4;
const TL = { x: LP.x + LP.w + 12, y: LIDY - 26 };            // the chart tile
TL.w = TX0 + TW - 14 - TL.x; TL.d = TY0 + TD - 14 - TL.y;
const BARS = [12, 22, BTN_Z - TZ - BASE_H];
const barX = (i) => TL.x + 14 + i * (BW + BAR_GAP);
const C3 = TX0 + 252, T3 = TX0 + 336;                        // the client's product lead, the Tcules designer
{
  add(`<!-- The laptop: a light body, only the screen dark blue, showing the design with one button -->`);
  add(box({ x: LP.x, y: LP.y, z: TZ, w: LP.w, d: LP.d, h: 5, r: 6, tone: T.white, sw: 1.4 }));
  add(`<g transform="${mFloor(LP.x, LP.y, TZ + 5)}"><rect x="12" y="11" width="${LP.w - 24}" height="12" rx="3" fill="${B[100]}"/><rect x="${LP.w / 2 - 14}" y="27" width="28" height="8" rx="3" fill="${B[100]}"/></g>`);
  let inner = `<g transform="${mFront(LID.x, LIDY, LID.ztop)}">`;
  inner += `<rect x="6" y="6" width="${LID.w - 12}" height="${LH - 12}" rx="5" fill="${B[500]}"/>`;
  inner += `<rect x="12" y="12" width="26" height="5" rx="2.5" fill="${B[300]}"/>`;
  inner += `<rect x="12" y="22" width="26" height="24" rx="4" fill="${B[200]}"/>`;
  inner += `<rect x="44" y="12" width="24" height="5" rx="2.5" fill="${W}"/>`;
  inner += `<rect x="44" y="35" width="22" height="4" rx="2" fill="${B[300]}"/><rect x="44" y="42" width="14" height="4" rx="2" fill="${B[300]}"/>`;
  inner += `<rect x="${BTN_U - 11}" y="${BTN_V - 5}" width="22" height="10" rx="5" fill="${W}"/>`;
  inner += `</g>`;
  add(panel({ x: LID.x, y: LIDY, ztop: LID.ztop, w: LID.w, h: LH, r: 7, t: 4, inner, sw: 1.4 }));
}
{
  add(`<!-- Design that pays back: a chart tile beside the laptop, three bars rising on one baseline -->`);
  add(box({ ...TL, z: TZ, h: BASE_H, r: 5, tone: T.white, sw: 1.3,
    topExtra: `<g transform="${mFloor(TL.x, TL.y, TZ + BASE_H)}"><path d="M8 ${26 + BW / 2 + 6} H${TL.w - 8}" stroke="${B[300]}" stroke-width="1.4" ${NS}/><rect x="10" y="${TL.d - 16}" width="${TL.w * 0.45}" height="5" rx="2.5" fill="${B[200]}"/></g>` }));
  const TALL = { top: B[300], y: B[500], x: B[600], line: null };
  [0, 1, 2].forEach((i) => {
    add(box({ x: barX(i), y: LIDY - BW / 2, z: TZ + BASE_H, w: BW, d: BW, h: BARS[i], r: 3, tone: i === 2 ? TALL : T.white, sw: 1.4 }));
  });
}
{
  add(`<!-- The wire: this button is tied to the number it should move (dotted, along the x axis) -->`);
  const a = P(LID.x + BTN_U + 11, LIDY, BTN_Z);
  const b = P(barX(2) + BW / 2, LIDY, BTN_Z);
  add(`<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${B[500]}" stroke-width="2" stroke-dasharray="0 5"/>`);
  add(`<circle cx="${f(a[0])}" cy="${f(a[1])}" r="3.2" fill="${B[500]}"/>`);
  add(`<circle cx="${f(b[0])}" cy="${f(b[1])}" r="3.6" fill="${B[500]}"/>`);
}

// ---------- the front pairs, shoulder to shoulder on the front edge ----------
let pU;
{
  add(`<!-- Evidence before screens: the client's user tries the prototype, the Tcules researcher holds the sketch it stands on -->`);
  pU = pawn(U1, FRONT, W);
  add(pU.s);
  add(arm(pU, 1, P(PH.x + 22, PH.y, PH.ztop - 40)));
  const pR = pawn(R1, FRONT, 'tcules');
  add(pR.s);
  add(arm(pR, 1, P(SK.x + 106, SK.y + SK.d - 8, TZ)));
}
{
  add(`<!-- Design that pays back: the client's product lead at the laptop, the Tcules designer at the chart beside it -->`);
  const pC = pawn(C3, FRONT, W);
  add(pC.s);
  add(arm(pC, 1, P(LP.x + LP.w / 2 + 8, LP.y + LP.d - 12, TZ + 5)));
  const pT = pawn(T3, FRONT, 'tcules');
  add(pT.s);
  add(arm(pT, 1, P(TL.x + 40, TL.y + TL.d - 10, TZ + BASE_H)));
}

// ---------- the answer: a tick bubble just above the user's head, toward the phone ----------
{
  const bx = pU.bx - 4, by = pU.headTop - 30;
  add(`<!-- The user's answer: a tick -->`);
  add(`<g transform="translate(${f(bx)} ${f(by)})"><path d="M-20 -15 H20 A8 8 0 0 1 28 -7 V7 A8 8 0 0 1 20 15 H18 L24 26 L8 15 H-20 A8 8 0 0 1 -28 7 V-7 A8 8 0 0 1 -20 -15 Z" fill="${W}" stroke="${B[500]}" stroke-width="1.6"/><path d="M-9 0 L-3 6 L10 -7" stroke="${B[500]}" stroke-width="3"/></g>`);
  grow(bx - 30, by - 17); grow(bx + 30, by + 26);
}

// ---------- bounds ----------
const pad = 4;
const vb = [BOUND[0] - pad, BOUND[1] - pad, BOUND[2] - BOUND[0] + 2 * pad, BOUND[3] - BOUND[1] + 2 * pad].map(f);
const ALT = 'Isometric drawing of a design studio table where three pairs, each a Tcules person beside a person from the client, decide what to build before it is built. At the front left, the client&#39;s user taps a small blue prototype phone standing on a paper sketch of the screen and answers with a tick, while a Tcules researcher beside her rests a hand on the same sketch, next to the ticked test note. Behind the middle of the table lies the product as a dashed outline with three bays; a Tcules designer and the client&#39;s product owner both rest a hand on the lime block set into the first bay, the piece to build first, while a pale dashed block waits in the second and the third stays empty. At the front right, the client&#39;s product lead works at a laptop showing the design, a dotted line runs from the screen&#39;s button to the tallest of three rising bars on the chart beside it, and a Tcules designer at his shoulder rests a hand on that chart. A notebook and a mug sit at the back of the table.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${ALT}" fill="none" stroke-linejoin="round" stroke-linecap="round">\n${out.join('\n')}\n</svg>\n`;
writeFileSync(process.argv[2], svg);
console.log('viewBox', vb.join(' '), 'aspect', (vb[2] / vb[3]).toFixed(2));
