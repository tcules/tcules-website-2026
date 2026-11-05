// Generator for the designer's desk (careers / FIL). Run: node gen.mjs  (writes desk.svg beside it)
// The family's floor (545 x 402, the healthtech standard) and its 2:1 iso projection:
//   x = 0.9 (u - v),  y = 0.45 (u + v) - h
import { writeFileSync } from "node:fs";

const B = "#0048FF", B600 = "#003EE0", B700 = "#0031B0", B300 = "#8AA5FF", B200 = "#B8C8FF",
  B100 = "#DBE4FF", B50 = "#EEF2FF", W = "#FFFFFF", LIME = "#D7F04A", LIMED = "#A1B71F";
const f = (n) => +n.toFixed(1);
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
const track = ([x, y]) => { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); return [x, y]; };
const RAW = (u, v, h = 0) => track([0.9 * (u - v), 0.45 * (u + v) - h]);
// objects sit on the floor shifted by (OU, OV) so the desk and chair are centred on the plate
const OU = +(process.env.OU ?? 40), OV = +(process.env.OV ?? -8);
const P = (u, v, h = 0) => RAW(u + OU, v + OV, h);
const pts = (a) => a.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const poly = (a, fill, sw = 1.6, stroke = B) =>
  `<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const line = (a, b, stroke = B, sw = 1.2, extra = "") =>
  `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" fill="none"${extra}/>`;

function hull(p) {
  const s = [...p].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of s) { while (lo.length >= 2 && cross(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of s.reverse()) { while (up.length >= 2 && cross(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
// rounded rectangle sampled in a local 2D frame (a, b), corner radius r
function rr(a0, b0, w, d, r, n = 6) {
  const out = [];
  const c = [[a0 + w - r, b0 + r, -90], [a0 + w - r, b0 + d - r, 0], [a0 + r, b0 + d - r, 90], [a0 + r, b0 + r, 180]];
  for (const [ca, cb, s] of c) for (let i = 0; i <= n; i++) {
    const t = ((s + (90 * i) / n) * Math.PI) / 180;
    out.push([ca + r * Math.cos(t), cb + r * Math.sin(t)]);
  }
  return out;
}

// a box with square corners: +v face, +u face, top
function box(u0, v0, u1, v1, h0, h1, { top = W, fv = B100, fu = B200, sw = 1.6 } = {}) {
  return [
    poly([P(u0, v1, h1), P(u1, v1, h1), P(u1, v1, h0), P(u0, v1, h0)], fv, sw),
    poly([P(u1, v0, h1), P(u1, v1, h1), P(u1, v1, h0), P(u1, v0, h0)], fu, sw),
    poly([P(u0, v0, h1), P(u1, v0, h1), P(u1, v1, h1), P(u0, v1, h1)], top, sw),
  ].join("\n");
}
// a flat slab with rounded corners in plan: one side tone, white top
function slab(u0, v0, w, d, h0, h1, r, { top = W, side = B200, sw = 1.6 } = {}) {
  const plan = rr(u0, v0, w, d, r);
  const side_ = hull([...plan.map(([u, v]) => P(u, v, h0)), ...plan.map(([u, v]) => P(u, v, h1))]);
  return poly(side_, side, sw) + "\n" + poly(plan.map(([u, v]) => P(u, v, h1)), top, sw);
}
// a cylinder standing on the floor plane at height h0..h1
function cyl(u, v, r, h0, h1, { body = W, top = W, sw = 1.6 } = {}) {
  const ring = (h) => Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * 2 * Math.PI; return P(u + r * Math.cos(t), v + r * Math.sin(t), h); });
  return poly(hull([...ring(h0), ...ring(h1)]), body, sw) + "\n" + poly(ring(h1), top, sw);
}

const parts = [];
const add = (comment, s) => parts.push(`<!-- ${comment} -->\n${s}`);

// ---- the floor: the family's dotted plate, dashed edge, soft inset
const [fx, fy] = RAW(0, 0);
RAW(545, 0); RAW(545, 402); RAW(0, 402);
add("Floor: dotted, a dashed edge and a soft inset under the objects",
  `<g transform="matrix(0.9 0.45 -0.9 0.45 ${fx} ${fy})"><rect width="545" height="402" fill="url(#dd-dots)"/>` +
  `<rect width="545" height="402" fill="none" stroke="${B}" stroke-width="1.8" stroke-dasharray="10 8"/>` +
  `<rect x="45" y="45" width="455" height="312" fill="${B}" fill-opacity="0.07"/></g>`);

// ---- the desk: top u 140..300, v 55..365, surface at h 150, 10 thick; four legs
const D = { u0: 140, u1: 300, v0: 55, v1: 365, h: 150, t: 10 }, L = 14, IN = 8;
const legs = [[D.u0 + IN, D.v0 + IN], [D.u0 + IN, D.v1 - IN - L], [D.u1 - IN - L, D.v0 + IN], [D.u1 - IN - L, D.v1 - IN - L]];
add("The desk: four legs", legs.map(([u, v]) => box(u, v, u + L, v + L, 0, D.h - D.t)).join("\n"));
add("The desk top", box(D.u0, D.v0, D.u1, D.v1, D.h - D.t, D.h));

// ---- the monitor: stand base, neck, then a light body with only its screen dark blue
const MU = 176, MT = 9;                       // front face at u = MU, body MT deep
const MV0 = 112, MV1 = 302, MH0 = 192, MH1 = 312; // spans v 112..302 (190), h 192..312 (120)
add("Monitor stand: base and neck", slab(152, 178, 50, 48, D.h, D.h + 4, 8) + "\n" + box(158, 196, 167, 216, D.h + 4, MH0 + 20));
{
  const MW = MV1 - MV0, MHh = MH1 - MH0;
  const face = (u) => rr(0, 0, MW, MHh, 10).map(([a, b]) => P(u, MV1 - a, MH1 - b));
  const body = poly(hull([...face(MU), ...face(MU - MT)]), B200);
  const front = poly(face(MU), W);
  const [ox, oy] = P(MU, MV1, MH1);
  // the screen and the work on it, in the face's own plane (a = along the face, b = down)
  const m = `matrix(0.9 -0.45 0 1 ${f(ox)} ${f(oy)})`;
  const S = { x: 9, y: 9, w: MW - 18, h: MHh - 18 };
  const screen =
    `<g transform="${m}">` +
    `<rect x="${S.x}" y="${S.y}" width="${S.w}" height="${S.h}" rx="6" fill="${B}"/>` +
    // tool rail: four short light bars
    [0, 1, 2, 3].map((i) => `<rect x="17" y="${22 + i * 13}" width="${i === 0 ? 14 : 11}" height="4" rx="2" fill="${B300}"/>`).join("") +
    // the artboard: a white page being designed
    `<rect x="40" y="18" width="104" height="84" rx="5" fill="${W}"/>` +
    `<rect x="48" y="26" width="88" height="30" rx="4" fill="${B100}"/>` +
    `<circle cx="64" cy="37" r="5" fill="${B200}"/><path d="M78 52 l14 -12 l12 9 l8 -5 l14 8 Z" fill="${B200}"/>` +
    `<rect x="48" y="63" width="58" height="5" rx="2.5" fill="${B300}"/><rect x="48" y="72" width="40" height="4" rx="2" fill="${B200}"/>` +
    // the one accent: the button being placed, held by a dotted focus frame
    `<rect x="48" y="84" width="34" height="11" rx="5.5" fill="${LIME}" stroke="${LIMED}" stroke-width="0.9"/>` +
    `<rect x="44.5" y="80.5" width="41" height="18" rx="7" fill="none" stroke="${B}" stroke-width="1" stroke-dasharray="2 2.2"/>` +
    // the pointer, on the button
    `<path d="M76 89 l0 13 l3.4 -3.2 l2.6 5.4 l2.4 -1.2 l-2.6 -5.2 l4.6 -0.4 Z" fill="${W}" stroke="${B700}" stroke-width="0.9" stroke-linejoin="round"/>` +
    // properties panel
    `<rect x="151" y="18" width="21" height="84" rx="4" fill="${B600}"/>` +
    [0, 1, 2].map((i) => `<rect x="155" y="${25 + i * 11}" width="${i === 1 ? 9 : 13}" height="4" rx="2" fill="${B300}"/>`).join("") +
    `<rect x="155" y="62" width="13" height="7" rx="3.5" fill="${B300}"/>` +
    `</g>`;
  add("The monitor: light body, blue screen with a page being designed", body + "\n" + front + "\n" + screen);
}

// ---- a small plant, back-right corner: a white pot, three rounded leaves
{
  const [u, v] = [186, 76], pot = cyl(u, v, 13, D.h, D.h + 22);
  const soil = Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * 2 * Math.PI; return P(u + 10.5 * Math.cos(t), v + 10.5 * Math.sin(t), D.h + 22); });
  const [sx, sy] = P(u, v, D.h + 22);
  // leaves in the screen plane: a leaf is a pointed oval from the soil, rotated
  const leaf = (ang, len, wid, fill) =>
    `<path transform="translate(${f(sx)} ${f(sy)}) rotate(${ang})" d="M0 0 C${f(wid)} ${f(-len * 0.35)} ${f(wid * 0.8)} ${f(-len * 0.85)} 0 ${f(-len)} C${f(-wid * 0.8)} ${f(-len * 0.85)} ${f(-wid)} ${f(-len * 0.35)} 0 0 Z" fill="${fill}" stroke="${B}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path transform="translate(${f(sx)} ${f(sy)}) rotate(${ang})" d="M0 -2 V${f(-len * 0.72)}" stroke="${B}" stroke-width="1" stroke-linecap="round"/>`;
  add("A small plant in a white pot", pot + "\n" + poly(soil, B200, 1.2) + "\n" +
    leaf(-30, 36, 11, B100) + leaf(30, 36, 12, B100) + leaf(-4, 50, 14, B200));
}

// ---- books, back-left: two lying flat, a ribbon from the top one
add("Two books, lying flat",
  slab(186, 312, 54, 44, D.h, D.h + 9, 3, { side: B100 }) + "\n" +
  slab(190, 316, 48, 38, D.h + 9, D.h + 17, 3, { side: B200 }) + "\n" +
  poly([P(222, 354, D.h + 17), P(228, 354, D.h + 17), P(228, 356, D.h + 5), P(225, 357.5, D.h + 7), P(222, 356, D.h + 5)], B, 1));

// ---- keyboard: a low white slab with three rows of keys
{
  const k = slab(214, 150, 32, 118, D.h, D.h + 6, 4);
  const rows = [221, 229, 237].map((u, i) =>
    line(P(u, 158, D.h + 6), P(u, 260 - (i === 2 ? 30 : 0), D.h + 6), B200, 3.2, ` stroke-dasharray="5 4.2"`)).join("");
  const space = line(P(237, 225, D.h + 6), P(237, 258, D.h + 6), B200, 3.2);
  add("Keyboard", k + "\n" + rows + space);
}

// ---- the sketchbook, open, front-right: the same page drawn by hand; a pencil beside it
{
  const top = D.h + 6;
  // one block: a single page outline on top, one side face per visible edge (STYLE §3, never a stack of copies)
  const book = box(250, 60, 296, 178, D.h, top, { top: W, fv: B100, fu: B200 });
  const fold = line(P(251, 119, top), P(295, 119, top), B200, 1.2);
  const [ox, oy] = P(253, 175, top);
  // page plane: a runs along -v (left to right as seen), b runs along +u (toward the viewer)
  const pm = `matrix(0.9 -0.45 0.9 0.45 ${f(ox)} ${f(oy)})`;
  const sketch =
    `<g transform="${pm}">` +
    `<rect x="8" y="4" width="40" height="13" rx="2" fill="none" stroke="${B}" stroke-width="1" stroke-dasharray="2.6 2.2"/>` +
    `<rect x="8" y="20.5" width="28" height="2.6" rx="1.3" fill="${B300}"/><rect x="8" y="25.5" width="18" height="2.6" rx="1.3" fill="${B200}"/><rect x="8" y="30.5" width="14" height="5" rx="2.5" fill="none" stroke="${B}" stroke-width="1"/>` +
    `<rect x="64" y="8" width="38" height="2.6" rx="1.3" fill="${B200}"/><rect x="64" y="14" width="30" height="2.6" rx="1.3" fill="${B200}"/><rect x="64" y="20" width="34" height="2.6" rx="1.3" fill="${B200}"/>` +
    `</g>`;
  // pencil lying across the right-hand page
  const a = P(284, 112, top + 2.5), b = P(266, 70, top + 2.5);
  const pencil = line(a, b, B, 6.4) + line(a, b, W, 3.4) + `<circle cx="${f(b[0])}" cy="${f(b[1])}" r="2.4" fill="${B}"/>`;
  add("Sketchbook, open on the same page drawn by hand, a pencil beside it", book + "\n" + fold + "\n" + sketch + "\n" + pencil);
}

// ---- mug, front-left
{
  const [u, v, r, h0, h1] = [270, 322, 12, D.h, D.h + 26];
  const handleA = P(u - 2, v + r, h1 - 6), handleB = P(u - 2, v + r, h0 + 7);
  const handle = `<path d="M${f(handleA[0])} ${f(handleA[1])} C${f(handleA[0] - 13)} ${f(handleA[1] - 2)} ${f(handleB[0] - 13)} ${f(handleB[1] + 2)} ${f(handleB[0])} ${f(handleB[1])}" fill="none" stroke="${B}" stroke-width="4.6" stroke-linecap="round"/>` +
    `<path d="M${f(handleA[0])} ${f(handleA[1])} C${f(handleA[0] - 13)} ${f(handleA[1] - 2)} ${f(handleB[0] - 13)} ${f(handleB[1] + 2)} ${f(handleB[0])} ${f(handleB[1])}" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round"/>`;
  const ring = Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * 2 * Math.PI; return P(u + (r - 2.6) * Math.cos(t), v + (r - 2.6) * Math.sin(t), h1); });
  add("Mug", handle + "\n" + cyl(u, v, r, h0, h1) + "\n" + poly(ring, B200, 1.2));
}

// ---- the chair, pulled out in front of the desk, facing it
{
  const cu = +(process.env.CU ?? 364), cv = +(process.env.CV ?? 248);
  const wheels = [[cu - 38, cv], [cu, cv - 38], [cu + 38, cv], [cu, cv + 38]];
  // the cross: the bar along u is split at the bar along v, so its front half sits in front of it
  const o = { fv: B200, fu: B200 };
  const base = box(cu - 38, cv - 4, cu - 4, cv + 4, 10, 16, o) + "\n" +
    box(cu - 4, cv - 38, cu + 4, cv + 38, 10, 16, o) + "\n" +
    box(cu + 4, cv - 4, cu + 38, cv + 4, 10, 16, o);
  const wheel = ([u, v]) => cyl(u, v, 4.5, 0, 9, { body: B100, top: B100, sw: 1.4 });
  const back2 = wheels.filter(([u, v]) => u + v < cu + cv), front2 = wheels.filter(([u, v]) => u + v >= cu + cv);
  const post = cyl(cu, cv, 5, 16, 92, { body: B200, top: B200 });
  const seat = slab(cu - 32, cv - 32, 62, 64, 92, 104, 10);
  // backrest: a rounded panel at the far side from the desk, on a short spine
  const spine = box(cu + 30, cv - 5, cu + 36, cv + 5, 98, 128, { fv: B200, fu: B200 });
  const BU = cu + 40, BT = 8, BV0 = cv - 30, BV1 = cv + 30, BH0 = 120, BH1 = 200;
  const face = (u) => rr(0, 0, BV1 - BV0, BH1 - BH0, 12).map(([a, b]) => P(u, BV1 - a, BH1 - b));
  const backrest = poly(hull([...face(BU - BT), ...face(BU)]), B200) + "\n" + poly(face(BU), W);
  add("Chair: wheels, cross base, post, seat, backrest",
    [...back2.map(wheel), base, ...front2.map(wheel), post, seat, spine, backrest].join("\n"));
}

const PAD = 6;
const VB = `${f(minX - PAD)} ${f(minY - PAD)} ${f(maxX - minX + 2 * PAD)} ${f(maxY - minY + 2 * PAD)}`;
const ALT = "Isometric illustration of a Tcules designer's desk on a dotted floor. A white desk holds a light monitor whose blue screen shows a page being designed, its one lime button selected under the pointer; in front lie a keyboard and an open sketchbook with the same page drawn by hand and a pencil on it, with two books and a mug beside. An office chair stands pulled out in front of the desk.";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${ALT}">
<defs><pattern id="dd-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${B}" fill-opacity="0.38"/></pattern></defs>
${parts.join("\n")}
</svg>
`;
writeFileSync(new URL("./desk.svg", import.meta.url), svg);
console.log("viewBox", VB, "ratio", f((maxX - minX) / (maxY - minY)));
