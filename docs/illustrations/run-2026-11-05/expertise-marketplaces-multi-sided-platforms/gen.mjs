// Generator for /expertise/marketplaces-multi-sided-platforms hero.
// Two sides, one platform: a balance scale stands on the floor. On one pan stands the buyer's app (a provider
// they can trust), on the other the provider's app (a request worth taking); the beam is held level at one lime
// booking. The buyer and the provider stand by their own pan; a Tcules designer stands at the scale's foot.
// Run: node gen.mjs  (writes hero.svg beside it)
// Floor and projection are healthtech's (the family standard): x = -144 + 0.9(u - v), y = 27 + 0.45(u + v) - h.
import { writeFileSync } from "node:fs";

const B = "#0048FF", B600 = "#003EE0", B700 = "#0031B0", B300 = "#8AA5FF", B200 = "#B8C8FF", B100 = "#DBE4FF", B50 = "#EEF2FF", W = "#FFFFFF";
const LIME = "#D7F04A", LIME_D = "#A1B71F", INK = "#1B1B18";
const P = (u, v, h = 0) => [-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h];
const f = (n) => +n.toFixed(1);
const pts = (...ps) => ps.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const poly = (ps, fill, sw = 1.6, stroke = B) =>
  `<polygon points="${pts(...ps)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
const num = (k, d) => (process.env[k] ? Number(process.env[k]) : d);
const pos = (k, d) => (process.env[k] ? process.env[k].split(",").map(Number) : d);

// ---- floor (healthtech's, verbatim)
const floor = `<defs><pattern id="mk-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="#0048FF" fill-opacity="0.38"/></pattern></defs>
<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->
<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="545" height="402" fill="url(#mk-dots)"/><rect width="545" height="402" fill="none" stroke="#0048FF" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="455" height="312" fill="#0048FF" fill-opacity="0.07"/></g>`;

// ---- the scale. The base is an iso box on the floor; the column, beam and pans are drawn upright in screen
// space (a column and a level beam read the same from any side); the beam runs along the floor's u = -v
// diagonal, which is level on screen, so both pans hang at the same depth.
const BU = num("BU", 262), BV = num("BV", 160);       // floor point under the column
const [cx, cy] = P(BU, BV);                            // screen point of the column's foot
const BASE = 46, BASE_H = 26;                          // half-size of the base's footprint, its height
const POST_H = num("POST_H", 330);                     // column height above the base
const HALF = num("HALF", 150);                         // half the beam's length
const DROP = num("DROP", 280);                         // beam to pan
const PAN_RX = 74, PAN_RY = 37, PAN_T = 7;
const beamY = cy - BASE_H - POST_H;
const panY = beamY + DROP;

function base() {
  const a = P(BU - BASE, BV - BASE, BASE_H), b = P(BU + BASE, BV - BASE, BASE_H), c = P(BU + BASE, BV + BASE, BASE_H), d = P(BU - BASE, BV + BASE, BASE_H);
  const c0 = P(BU + BASE, BV + BASE), b0 = P(BU + BASE, BV - BASE), d0 = P(BU - BASE, BV + BASE);
  return poly([b, c, c0, b0], B200) + poly([d, c, c0, d0], W) + poly([a, b, c, d], W);
}
function column() {
  const top = beamY, bot = cy - BASE_H; // the column's foot sits on the base's top centre
  const w = 22;
  return `<ellipse cx="${f(cx)}" cy="${f(bot)}" rx="22" ry="11" fill="${B200}" stroke="${B}" stroke-width="1.4"/>` +
    `<path d="M${f(cx - w / 2)} ${f(bot)} V${f(top)} H${f(cx + w / 2)} V${f(bot)} A${w / 2} ${w / 4} 0 0 1 ${f(cx - w / 2)} ${f(bot)} Z" fill="${B}" stroke="${B600}" stroke-width="1.2"/>` +
    `<path d="M${f(cx + 2)} ${f(bot + w / 4 - 0.4)} V${f(top)} H${f(cx + w / 2 - 0.6)} V${f(bot)} A${w / 2} ${w / 4} 0 0 1 ${f(cx + 2)} ${f(bot + w / 4 - 0.4)} Z" fill="${B600}"/>`;
}
function beam() {
  const t = 15, x0 = cx - HALF, x1 = cx + HALF;
  let s = `<rect x="${f(x0 - 8)}" y="${f(beamY - t / 2 + 4)}" width="${f(2 * HALF + 16)}" height="${t}" rx="${t / 2}" fill="${B700}"/>`;
  s += `<rect x="${f(x0 - 8)}" y="${f(beamY - t / 2)}" width="${f(2 * HALF + 16)}" height="${t}" rx="${t / 2}" fill="${B}" stroke="${B600}" stroke-width="1.2"/>`;
  return s;
}
function pivot() {
  // the booking at the centre both sides hang from: one lime disc with a tick
  const r = 23;
  return `<circle cx="${f(cx)}" cy="${f(beamY + 4)}" r="${r}" fill="${LIME_D}"/>` +
    `<circle cx="${f(cx)}" cy="${f(beamY)}" r="${r}" fill="${LIME}" stroke="${LIME_D}" stroke-width="1.2"/>` +
    `<path d="M${f(cx - 10)} ${f(beamY + 0.5)} l6.5 6.5 l13 -13" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const hook = (x) => `<circle cx="${f(x)}" cy="${f(beamY)}" r="5" fill="${W}" stroke="${B700}" stroke-width="2"/>`;
const chainBack = (x) => `<path d="M${f(x)} ${f(beamY)} L${f(x)} ${f(panY - PAN_RY + 2)}" stroke="${B}" stroke-width="1.6" stroke-linecap="round"/>`;
const chainsFront = (x) =>
  `<path d="M${f(x - PAN_RX + 1)} ${f(panY)} L${f(x)} ${f(beamY)} L${f(x + PAN_RX - 1)} ${f(panY)}" fill="none" stroke="${B}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
function pan(x) {
  // the pan: a shallow white dish, its rim thickness in brandeis-200
  return `<path d="M${f(x - PAN_RX)} ${f(panY)} V${f(panY + PAN_T)} A${PAN_RX} ${PAN_RY} 0 0 0 ${f(x + PAN_RX)} ${f(panY + PAN_T)} V${f(panY)} Z" fill="${B200}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<ellipse cx="${f(x)}" cy="${f(panY)}" rx="${PAN_RX}" ry="${PAN_RY}" fill="${W}" stroke="${B}" stroke-width="1.6"/>` +
    `<ellipse cx="${f(x)}" cy="${f(panY)}" rx="${PAN_RX - 14}" ry="${PAN_RY - 7}" fill="${B50}" stroke="${B200}" stroke-width="1.2"/>`;
}

// ---- the two apps, standing on the pans. Local phone space PW x PH; the buyer's faces +v (toward the
// front-left), the provider's faces +u (toward the front-right).
const PW = num("PW", 70), PH = num("PH", 120);
const star = (x, y, k) => {
  const p = [];
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? k * 0.48 : k; p.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  return `<polygon points="${pts(...p)}" fill="${B}" stroke="${B}" stroke-width="0.8" stroke-linejoin="round"/>`;
};
function buyerScreen() {
  // a provider the buyer can trust: a portrait, a name, a row of stars, a book button
  return `<rect x="13" y="20" width="44" height="40" rx="7" fill="${B100}"/>` +
    `<circle cx="35" cy="34" r="7.5" fill="${B}"/><path d="M23.5 56 a11.5 10 0 0 1 23 0 Z" fill="${B}"/>` +
    `<rect x="13" y="66" width="32" height="5" rx="2.5" fill="${B}"/>` +
    [0, 1, 2, 3].map((i) => star(18 + i * 11, 80, 4.8)).join("") +
    `<rect x="13" y="91" width="44" height="14" rx="7" fill="${B}"/><rect x="24" y="96" width="22" height="4" rx="2" fill="${W}"/>`;
}
function providerScreen() {
  // a request worth taking: where (a pin), when (a clock), then accept
  const pin = (x, y) => `<path d="M${x} ${y + 8} c-5 -6 -6 -8.5 -6 -11 a6 6 0 0 1 12 0 c0 2.5 -1 5 -6 11 Z" fill="${B}"/><circle cx="${x}" cy="${y - 3}" r="2.2" fill="${W}"/>`;
  const clock = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${B}" stroke-width="2.2"/><path d="M${x} ${y - 3.2} V${y} l2.6 1.8" fill="none" stroke="${B}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<rect x="13" y="20" width="36" height="6" rx="3" fill="${B}"/><rect x="13" y="30" width="24" height="4" rx="2" fill="${B300}"/>` +
    pin(19, 47) + `<rect x="30" y="44" width="25" height="4" rx="2" fill="${B200}"/>` +
    clock(19, 63) + `<rect x="30" y="61" width="20" height="4" rx="2" fill="${B200}"/>` +
    `<rect x="13" y="78" width="44" height="27" rx="8" fill="${B}"/><path d="M27 91.5 l5.5 5.5 l11 -11" fill="none" stroke="${W}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function phone(x, mirror, screen) {
  // the phone's bottom edge centred on the pan
  const sk = mirror ? -0.45 : 0.45;
  const ox = x - 0.45 * PW, oy = panY - PH - (sk * PW) / 2 + 3;
  const m = `matrix(0.9 ${sk} 0 1 ${f(ox)} ${f(oy)})`;
  // the phone's thickness, a strip on its far edge
  const ex = mirror ? ox : ox + 0.9 * PW, ey = mirror ? oy : oy + 0.45 * PW, d = mirror ? -7 : 7;
  const edge = `<path d="M${f(ex)} ${f(ey + 8)} L${f(ex + d)} ${f(ey + 4.5)} V${f(ey + PH - 11.5)} L${f(ex)} ${f(ey + PH - 8)} Z" fill="${B700}" stroke="${B700}" stroke-width="6" stroke-linejoin="round"/>`;
  return edge + `<g transform="${m}"><rect width="${PW}" height="${PH}" rx="12" fill="${B}" stroke="${B600}" stroke-width="1.2"/>` +
    `<rect x="6" y="12" width="${PW - 12}" height="${PH - 18}" rx="7" fill="${W}"/><rect x="${PW / 2 - 8}" y="5" width="16" height="3.5" rx="1.75" fill="${B700}"/>` +
    screen() + `</g>`;
}

// ---- people (STYLE §5), healthtech's sizes: light client pawns, one blue Tcules pawn with a white edge
const R = 22, H = 62, HEAD = 16, ARM = 11, OUT = 1.6, HAND = ARM * 0.8, EDGE = 2;
const bodyPath = (x, y) =>
  `M${f(x - R)} ${f(y)} V${f(y - H)} A${R} ${R} 0 0 1 ${f(x + R)} ${f(y - H)} V${f(y)} A${R} ${f(R * 0.45)} 0 0 1 ${f(x - R)} ${f(y)} Z`;
const headY = (y) => y - H - R - 4 - HEAD;
let maskN = 0;
function clientArm(x, y, from, to) {
  const [ax, ay] = [x + from[0], y + from[1]], [hx, hy] = [x + to[0], y + to[1]];
  const id = `mk-arm${maskN++}`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-600" y="-400" width="1200" height="1000"><rect x="-600" y="-400" width="1200" height="1000" fill="${W}"/><path d="${bodyPath(x, y)}" fill="#000000"/></mask>` +
    `<g mask="url(#${id})"><path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/></g>` +
    `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${f(ARM - 2 * OUT)}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND - OUT)}" fill="${W}"/>`;
}
function client(u, v, arm) {
  const [x, y] = P(u, v);
  return `<path d="${bodyPath(x, y)}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>` +
    `<circle cx="${f(x)}" cy="${f(headY(y))}" r="${HEAD}" fill="${W}" stroke="${B}" stroke-width="1.6"/>` +
    (arm ? clientArm(x, y, arm.from, arm.to) : "");
}
function tcules(u, v, arm) {
  // a white edge under every part (paint-order keeps the blue at its size); the arm's blue is drawn over the
  // body so it leaves the shoulder as one shape
  const [x, y] = P(u, v);
  const [ax, ay] = [x + arm.from[0], y + arm.from[1]], [hx, hy] = [x + arm.to[0], y + arm.to[1]];
  return `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${ARM + 2 * EDGE}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND + EDGE)}" fill="${W}"/>` +
    `<path d="${bodyPath(x, y)}" fill="${B}" stroke="${W}" stroke-width="${2 * EDGE}" stroke-linejoin="round" paint-order="stroke"/>` +
    `<circle cx="${f(x)}" cy="${f(headY(y))}" r="${HEAD}" fill="${B}" stroke="${W}" stroke-width="${2 * EDGE}" paint-order="stroke"/>` +
    `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/>`;
}

const LX = cx - HALF, RX = cx + HALF;
const BUYER = pos("BUYER", [158, 337]), PROV = pos("PROV", [448, 66]), TC = pos("TC", [323, 288]);
const scale = [
  "<!-- The scale: a white base, a blue column and beam, the lime booking at the pivot, a pan at each end -->",
  base(),
  column(),
  chainBack(LX), chainBack(RX),
  pan(LX), pan(RX),
  "<!-- The two apps: the buyer's (a provider with stars, a book button) and the provider's (a request: where, when, accept) -->",
  phone(LX, false, buyerScreen),
  phone(RX, true, providerScreen),
  chainsFront(LX), chainsFront(RX),
  beam(), hook(LX), hook(RX), pivot(),
].join("\n");

const people = [
  "<!-- The buyer at the left pan, the provider at the right pan, a Tcules designer at the scale's foot -->",
  client(BUYER[0], BUYER[1], { from: [8, -H + 22], to: [num("BAX", 42), num("BAY", -86)] }),
  client(PROV[0], PROV[1], { from: [-8, -H + 22], to: [num("PAX", -44), num("PAY", -86)] }),
  tcules(TC[0], TC[1], { from: [-8, -H + 22], to: [num("TAX", 44), num("TAY", -80)] }),
].join("\n");

const VBOX = process.env.VBOX || "-510 -170 860 630";
const ALT = "Isometric illustration for marketplace product design. A balance scale stands on a dotted floor, its blue beam held level at one lime booking with a tick. On the left pan stands the buyer's app, showing a provider with a portrait, a row of stars and a book button; on the right pan stands the provider's app, showing a request with a place, a time and an accept button. A buyer stands at the left pan and a provider at the right, each reaching to their own app, and a blue Tcules designer stands at the scale's foot.";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VBOX}" role="img" aria-label="${ALT}">
${floor}
${scale}
${people}
</svg>
`;
writeFileSync(new URL(process.env.OUT || "./hero.svg", import.meta.url), svg);
console.log({ cx: f(cx), cy: f(cy), beamY: f(beamY), panY: f(panY), LX: f(LX), RX: f(RX), buyer: P(...BUYER).map(f), prov: P(...PROV).map(f), tc: P(...TC).map(f) });
