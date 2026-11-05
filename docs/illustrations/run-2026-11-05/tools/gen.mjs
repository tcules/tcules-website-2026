// Generator for the /tools hero: a question, a checklist worked through, a brief out.
// Run: node gen.mjs  (writes hero.svg beside it). Same floor and projection as the healthtech standard.
import { writeFileSync } from "node:fs";

const B = "#0048FF", B600 = "#003EE0", B700 = "#0031B0", B300 = "#8AA5FF", B200 = "#B8C8FF",
  B100 = "#DBE4FF", B50 = "#EEF2FF", W = "#FFFFFF", LIME = "#D7F04A", LIMED = "#A1B71F", INK = "#1B1B18";
const f = (n) => +n.toFixed(1);
const P = (u, v, h = 0) => [-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h];
const pts = (a) => a.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const poly = (a, fill, sw = 1.6, stroke = B) =>
  `<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const vplane = (u, v, h) => { const [x, y] = P(u, v, h); return `matrix(0.9 0.45 0 1 ${f(x)} ${f(y)})`; };
const fplane = (u, v, h) => { const [x, y] = P(u, v, h); return `matrix(0.9 0.45 -0.9 0.45 ${f(x)} ${f(y)})`; };

// convex hull (monotone chain) for the thickness silhouette of a rounded board
function hull(p) {
  p = p.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.slice().reverse()) { while (up.length >= 2 && cr(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
function roundRectPts(x, y, w, h, r) {
  const o = [], c = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
  for (const [cx, cy, a0] of c) for (let i = 0; i <= 8; i++) {
    const a = ((a0 + (90 * i) / 8) * Math.PI) / 180; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return o;
}
// an upright board in the u-plane at depth v, top at height h, extruded d back (toward -v)
function boardThickness(u, v, h, w, hh, r, d, fill) {
  const [X, Y] = P(u, v, h);
  const front = roundRectPts(0, 0, w, hh, r).map(([x, y]) => [X + 0.9 * x, Y + 0.45 * x + y]);
  const back = front.map(([x, y]) => [x + 0.9 * d, y - 0.45 * d]);
  return poly(hull(front.concat(back)), fill, 1.6, fill === W ? B : B700);
}
// an iso box between (u0,v0) and (u1,v1), h0..h1: top, front-left (v1) face, front-right (u1) face
function box(u0, v0, u1, v1, h0, h1, top = W, left = W, right = B200, sw = 1.6) {
  return poly([P(u0, v1, h0), P(u1, v1, h0), P(u1, v1, h1), P(u0, v1, h1)], left, sw) +
    poly([P(u1, v0, h0), P(u1, v1, h0), P(u1, v1, h1), P(u1, v0, h1)], right, sw) +
    poly([P(u0, v0, h1), P(u1, v0, h1), P(u1, v1, h1), P(u0, v1, h1)], top, sw);
}
const tick = (x, y, s, c = W, sw = 3) =>
  `<path d="M${f(x - 6 * s)} ${f(y)} l${f(5 * s)} ${f(5 * s)} l${f(9 * s)} ${f(-10 * s)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
const qmark = (x, y, s, c, sw) =>
  `<path d="M${f(x - 5 * s)} ${f(y - 5 * s)} a${f(5 * s)} ${f(5 * s)} 0 1 1 ${f(7.4 * s)} ${f(4.4 * s)} c${f(-1.8 * s)} ${f(1 * s)} ${f(-2.4 * s)} ${f(2 * s)} ${f(-2.4 * s)} ${f(4 * s)}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${f(x)}" cy="${f(y + 9.6 * s)}" r="${f(sw * 0.62)}" fill="${c}"/>`;

// ---- floor (the healthtech standard, verbatim geometry)
const floor = `<defs><pattern id="tl-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${B}" fill-opacity="0.38"/></pattern></defs>
<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="545" height="402" fill="url(#tl-dots)"/><rect width="545" height="402" fill="none" stroke="${B}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="455" height="312" fill="${B}" fill-opacity="0.07"/></g>`;

// ---- the clipboard (hero object): solid blue board standing in a low white stand
const CU = 160, CV = 110, CW = 220, CH = 330, CB = 12; // board left u, face v, width, height, foot height
const stand = box(CU - 6, CV - 22, CU + CW + 8, CV + 16, 0, 18);
const boardTop = CB + CH;
const board = boardThickness(CU, CV, boardTop, CW, CH, 18, 12, B700) +
  `<g transform="${vplane(CU, CV, boardTop)}">` +
  `<rect width="${CW}" height="${CH}" rx="18" fill="${B}" stroke="${B600}" stroke-width="1.6"/>` +
  // the sheet
  `<rect x="16" y="24" width="${CW - 32}" height="${CH - 42}" rx="10" fill="${W}"/>` +
  // header: the question badge and a title
  `<rect x="32" y="56" width="32" height="32" rx="9" fill="${B}"/><rect x="39" y="65" width="18" height="6" rx="3" fill="${W}"/><circle cx="48" cy="80" r="3" fill="${W}"/>` +
  `<rect x="76" y="61" width="96" height="9" rx="4.5" fill="${B}"/><rect x="76" y="76" width="58" height="7" rx="3.5" fill="${B200}"/>` +
  `<rect x="32" y="104" width="${CW - 64}" height="1.6" rx="0.8" fill="${B100}"/>` +
  // the checklist: rows worked through, the last one under the hand
  [0, 1, 2, 3, 4].map((i) => {
    const y = 122 + i * 38, done = i < 4, w1 = [104, 86, 112, 78, 96][i];
    const boxEl = done
      ? `<rect x="32" y="${y}" width="24" height="24" rx="7" fill="${B}"/>` + tick(44, y + 12, 1, W, 2.8)
      : `<rect x="32" y="${y}" width="24" height="24" rx="7" fill="${W}" stroke="${B}" stroke-width="1.6"/>`;
    return boxEl + `<rect x="68" y="${y + 8}" width="${w1}" height="8" rx="4" fill="${done ? B200 : B300}"/>`;
  }).join("") +
  `</g>`;
// the clip: a white clamp over the board's top edge
const CLW = 70, CLH = 34, CLT = boardTop + 8; // clip top 8 above the board, bottom 6 over the sheet's top edge
const clip = boardThickness(CU + (CW - CLW) / 2, CV + 4, CLT, CLW, CLH, 9, 6, W) +
  `<g transform="${vplane(CU + (CW - CLW) / 2, CV + 4, CLT)}"><rect width="${CLW}" height="${CLH}" rx="9" fill="${W}" stroke="${B}" stroke-width="1.6"/><rect x="20" y="8" width="30" height="8" rx="4" fill="${B200}" stroke="${B}" stroke-width="1.2"/></g>`;

// ---- the brief: a printed brief lying on the floor, a lime action on it
const BS = 1.3, BU = +(process.env.BU || 312), BV = +(process.env.BV || 168), BW = 150 * BS, BL = 166 * BS, BT = 8; // u, v, width (u), length (v), thickness
const briefSides = box(BU, BV, BU + BW, BV + BL, 0, BT, W, W, B200);
const brief = briefSides +
  // a second sheet edge under the top, so it reads as pages
  `<g transform="${fplane(BU, BV, BT)} scale(${BS})">` +
  `<rect x="16" y="18" width="78" height="11" rx="5.5" fill="${B}"/><rect x="16" y="36" width="50" height="8" rx="4" fill="${B200}"/>` +
  `<rect x="16" y="54" width="${150 - 32}" height="1.6" rx="0.8" fill="${B100}"/>` +
  [68, 84, 100].map((y, i) => `<rect x="16" y="${y}" width="${[104, 84, 112][i]}" height="8" rx="4" fill="${B200}"/>`).join("") +
  `<rect x="16" y="122" width="74" height="24" rx="12" fill="${LIME}" stroke="${LIMED}" stroke-width="1.2"/><rect x="31" y="130" width="44" height="8" rx="4" fill="${INK}"/>` +
  `</g>`;
// ---- the six: a set of worksheets laid out on the floor, one slot empty (the one on the clipboard)
const SU = +(process.env.SU || 64), SV = +(process.env.SV || 208), SW = 48, SL = 62, SG = 14, ST = 4;
const six = [];
for (let r = 0; r < 2; r++) for (let c = 2; c >= 0; c--) {
  const u = SU + c * (SW + SG), v = SV + r * (SL + SG);
  if (r === 0 && c === 2) { // the picked one: an empty dashed slot
    six.push(`<g transform="${fplane(u, v, 0)}"><rect width="${SW}" height="${SL}" rx="5" fill="${W}" fill-opacity="0.7" stroke="${B}" stroke-width="1.6" stroke-dasharray="4 4"/></g>`);
    continue;
  }
  six.push(box(u, v, u + SW, v + SL, 0, ST, W, W, B200, 1.2) +
    `<g transform="${fplane(u, v, ST)}"><rect x="8" y="9" width="12" height="12" rx="3.5" fill="${B100}" stroke="${B}" stroke-width="1.2"/><rect x="8" y="30" width="32" height="5.5" rx="2.75" fill="${B200}"/><rect x="8" y="41" width="24" height="5.5" rx="2.75" fill="${B200}"/></g>`);
}
// draw back to front: sort by u+v of each cell is already near-correct for this small grid
const sixSvg = six.join("\n");
// dashed connectors along the iso axes, 1.6, each ending in a clear arrowhead
function connector(points, halo = false) {
  const q = points.map(([u, v, h]) => P(u, v, h));
  const d = "M" + q.map(([x, y]) => `${f(x)} ${f(y)}`).join(" L");
  const [x0, y0] = q.at(-2), [x1, y1] = q.at(-1);
  const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, k = 12, c = Math.cos(0.55), sn = Math.sin(0.55);
  const a = [x1 - k * (ux * c - uy * sn), y1 - k * (uy * c + ux * sn)], b = [x1 - k * (ux * c + uy * sn), y1 - k * (uy * c - ux * sn)];
  return (halo ? `<path d="${d}" fill="none" stroke="${W}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` : "") +
    `<path d="${d}" fill="none" stroke="${B}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M${f(a[0])} ${f(a[1])} L${f(x1)} ${f(y1)} L${f(b[0])} ${f(b[1])}" fill="none" stroke="${B}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
}
// 1 · picked: from the empty slot in the set to the foot of the clipboard's stand
const slotU1 = SU + 2 * (SW + SG) + SW, slotVm = SV + SL / 2, PK = slotU1 + 30;
const picked = connector([[slotU1 + 2, slotVm, 0], [PK, slotVm, 0], [PK, CV + 19, 0]]);
// 2 · out: from the sheet, just under the last row, forward over the stand and down onto the brief's back edge
const OX = CU + 176, OH = boardTop - 304; // sheet y 304 on the board
const handoff = connector([[OX, CV + 1, OH], [OX, BV + 10, OH], [OX, BV + 10, BT + 3]], true) +
  (() => { const [x, y] = P(OX, CV, OH); return `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" fill="${B}"/>`; })();

// ---- the client (STYLE §5): a light pawn, one arm reaching to tick the last row; a question above
const R = 22, H = 62, HEAD = 16, ARM = 11, OUT = 1.6, HAND = ARM * 0.8;
const bodyPath = (x, y) =>
  `M${f(x - R)} ${f(y)} V${f(y - H)} A${R} ${R} 0 0 1 ${f(x + R)} ${f(y - H)} V${f(y)} A${R} ${f(R * 0.45)} 0 0 1 ${f(x - R)} ${f(y)} Z`;
let mN = 0;
function clientArm(x, y, ax, ay, hx, hy) {
  const id = `tl-arm${mN++}`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-600" y="-300" width="1100" height="900"><rect x="-600" y="-300" width="1100" height="900" fill="${W}"/><path d="${bodyPath(x, y)}" fill="#000000"/></mask>` +
    `<g mask="url(#${id})"><path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/></g>` +
    `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${f(ARM - 2 * OUT)}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND - OUT)}" fill="${W}"/>`;
}
function pawn(u, v, reach) {
  const [x, y] = P(u, v);
  let s = `<path d="${bodyPath(x, y)}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  s += `<circle cx="${f(x)}" cy="${f(y - H - R - 4 - HEAD)}" r="${HEAD}" fill="${W}" stroke="${B}" stroke-width="1.6"/>`;
  if (reach) s += clientArm(x, y, x + 8, y - H + 20, reach[0], reach[1]);
  return { s, x, y };
}
// the last row's empty box, in screen space
const rowBox = (() => { const [X, Y] = P(CU, CV, boardTop); const lx = 44, ly = 122 + 4 * 38 + 12; return [X + 0.9 * lx, Y + 0.45 * lx + ly]; })();
const PU = +(process.env.PU || 200), PV = +(process.env.PV || 150);
const client = pawn(PU, PV, rowBox);
const VB = process.env.VB || "-510 -192 860 650";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="Isometric illustration of a free product design checklist. Six worksheets lie on the floor with one slot empty, and a dashed line runs from that slot to a large blue clipboard: the picked sheet. A client stands at the clipboard ticking the last of five checklist rows under one question at its head, and a second dashed line runs from the sheet down to a printed brief in front, with a lime action button.">
${floor}
<!-- The six worksheets, one picked -->
${sixSvg}
${picked}
<!-- The clipboard: the checklist being worked through -->
${stand}
${board}
${clip}
<!-- The brief that comes out, and the line from the sheet to it -->
${brief}
${handoff}
<!-- The client, with the one question -->
${client.s}
</svg>
`;
writeFileSync(new URL(process.env.OUT || "./hero.svg", import.meta.url), svg);
