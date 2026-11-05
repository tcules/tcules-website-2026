// Generator for /expertise/healthtech hero. The floor, the open medical case and the blue phone
// are the approved pilot geometry, kept verbatim in BASE; the people are drawn from floor coordinates.
// Run: node gen.mjs  (writes hero.svg beside it)
import { writeFileSync } from "node:fs";
const BASE = "<defs><pattern id=\"ht-dots\" width=\"22\" height=\"22\" patternUnits=\"userSpaceOnUse\"><circle cx=\"11\" cy=\"11\" r=\"1.6\" fill=\"#0048FF\" fill-opacity=\"0.38\"/></pattern></defs>\n<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->\n<g transform=\"matrix(0.9 0.45 -0.9 0.45 -144 27)\"><rect width=\"545\" height=\"402\" fill=\"url(#ht-dots)\"/><rect width=\"545\" height=\"402\" fill=\"none\" stroke=\"#0048FF\" stroke-width=\"1.8\" stroke-dasharray=\"10 8\"/><rect x=\"45\" y=\"45\" width=\"455\" height=\"312\" fill=\"#0048FF\" fill-opacity=\"0.07\"/></g>\n<!-- The medical case, open: its lid stands up behind -->\n<polygon points=\"249.3,159.4 238.5,164.8 238.5,48.8 249.3,43.4\" fill=\"#B8C8FF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-11.7,-87.1 249.3,43.4 238.5,48.8 -22.5,-81.8\" fill=\"#DBE4FF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,34.3 238.5,164.8 238.5,48.8 -22.5,-81.8\" fill=\"#FFFFFF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-9.9,28.6 225.9,146.5 225.9,56.5 -9.9,-61.4\" fill=\"#EEF2FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,34.3 238.5,164.8 126,221 -135,90.5\" fill=\"#FFFFFF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,147.3 220.5,268.8 126,316 -117,194.5\" fill=\"#EEF2FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,43.3 220.5,164.8 220.5,268.8 -22.5,147.3\" fill=\"#DBE4FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,43.3 -117,90.5 -117,194.5 -22.5,147.3\" fill=\"#B8C8FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n<!-- The care app: a solid blue phone rising out of the open case -->\n<polygon points=\"-45,-157.1 -44.8,-160.9 -44.1,-164.4 -42.9,-167.6 -41.4,-170.3 -39.4,-172.6 -37.1,-174.4 -20.9,-182.5 -18.2,-183.7 -15.3,-184.4 -12.1,-184.6 -8.8,-184.2 -5.3,-183.2 -1.8,-181.7 120.6,-120.5 124.1,-118.5 127.6,-116 130.9,-113.1 134.1,-109.7 137,-106.1 139.7,-102.2 142,-98.1 144,-93.8 145.5,-89.5 146.7,-85.2 147.4,-81 147.6,-77 147.6,235 147.4,238.8 146.7,242.3 145.5,245.5 144,248.2 142,250.5 139.7,252.3 123.5,260.4 120.8,261.6 117.9,262.3 114.7,262.5 111.4,262.1 107.9,261.1 104.4,259.6 -18,198.4 -21.5,196.4 -25,193.9 -28.3,191 -31.5,187.6 -34.4,184 -37.1,180.1 -39.4,176 -41.4,171.7 -42.9,167.4 -44.1,163.1 -44.8,158.9 -45,154.9\" fill=\"#0031B0\" stroke=\"#0031B0\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-45,-157.1 -44.8,-160.9 -44.1,-164.4 -42.9,-167.6 -41.4,-170.3 -39.4,-172.6 -37.1,-174.4 -20.9,-182.5 -18.2,-183.7 -15.3,-184.4 -12.1,-184.6 -8.8,-184.2 -5.3,-183.2 -1.8,-181.7 120.6,-120.5 124.1,-118.5 127.6,-116 130.9,-113.1 134.1,-109.7 137,-106.1 139.7,-102.2 142,-98.1 144,-93.8 145.5,-89.5 146.7,-85.2 147.4,-81 147.6,-77 131.4,-68.9\" fill=\"#003EE0\"/>\n<g transform=\"matrix(0.9 0.45 0 1 -45 -187.1)\">\n<rect width=\"196\" height=\"372\" rx=\"30\" fill=\"#0048FF\" stroke=\"#003EE0\" stroke-width=\"1.6\"/>\n<rect x=\"13\" y=\"36\" width=\"170\" height=\"322\" rx=\"18\" fill=\"#FFFFFF\"/>\n<rect x=\"76\" y=\"17\" width=\"44\" height=\"8\" rx=\"4\" fill=\"#0031B0\"/>\n<rect x=\"28\" y=\"52\" width=\"30\" height=\"30\" rx=\"9\" fill=\"#0048FF\"/><path d=\"M43 60 V74 M36 67 H50\" stroke=\"#FFFFFF\" stroke-width=\"4.4\" stroke-linecap=\"round\"/>\n<rect x=\"70\" y=\"57\" width=\"74\" height=\"9\" rx=\"4.5\" fill=\"#0048FF\"/><rect x=\"70\" y=\"72\" width=\"46\" height=\"7\" rx=\"3.5\" fill=\"#B8C8FF\"/>\n<rect x=\"26\" y=\"96\" width=\"144\" height=\"64\" rx=\"12\" fill=\"#EEF2FF\" stroke=\"#0048FF\" stroke-width=\"1.2\"/>\n<rect x=\"40\" y=\"112\" width=\"32\" height=\"32\" rx=\"8\" fill=\"#0048FF\"/><path d=\"M48 128 l6 6 l11 -12\" fill=\"none\" stroke=\"#FFFFFF\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n<rect x=\"84\" y=\"117\" width=\"72\" height=\"8\" rx=\"4\" fill=\"#8AA5FF\"/><rect x=\"84\" y=\"132\" width=\"48\" height=\"8\" rx=\"4\" fill=\"#B8C8FF\"/>\n<rect x=\"26\" y=\"174\" width=\"144\" height=\"44\" rx=\"22\" fill=\"#D7F04A\" stroke=\"#A1B71F\" stroke-width=\"1.2\"/>\n<rect x=\"50\" y=\"192\" width=\"62\" height=\"8\" rx=\"4\" fill=\"#1B1B18\"/><path d=\"M140 188 l8 8 l-8 8\" fill=\"none\" stroke=\"#1B1B18\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n</g>\n<polygon points=\"-126,86 126,212 229.5,160.3 238.5,164.8 126,221 -135,90.5\" fill=\"#FFFFFF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"238.5,164.8 126,221 126,333 238.5,276.8\" fill=\"#B8C8FF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-135,90.5 126,221 126,333 -135,202.5\" fill=\"#FFFFFF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<g transform=\"matrix(0.9 0.45 0 1 -135 90.5)\"><path d=\"M136 33 h18 v18 h18 v18 h-18 v18 h-18 v-18 h-18 v-18 h18 Z\" fill=\"#0048FF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/></g>\n";

// ---- the lid reads as a lid (5 Nov fix): no inner inset panel (it read as glass); a solid brandeis-200
// rim along the top edge and the top edge's thickness, and a small latch tab on the top edge, right of the phone.
const LID_INSET = "<polygon points=\"-9.9,28.6 225.9,146.5 225.9,56.5 -9.9,-61.4\" fill=\"#EEF2FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n";
const LID_TOP = "fill=\"#DBE4FF\" stroke=\"#0048FF\" stroke-width=\"1.6\" stroke-linejoin=\"round\"/>\n<polygon points=\"-22.5,34.3";
const LID_RIM = "<polygon points=\"-22.5,-81.8 238.5,48.8 238.5,58.8 -22.5,-71.8\" fill=\"#B8C8FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n" +
  "<polygon points=\"192.5,35.7 210.1,44.5 210.1,56.5 192.5,47.7\" fill=\"#0048FF\" stroke=\"#0048FF\" stroke-width=\"1.2\" stroke-linejoin=\"round\"/>\n";
if (!BASE.includes(LID_INSET) || !BASE.includes(LID_TOP)) throw new Error("lid geometry moved");
const BASE_FIXED = BASE.replace(LID_TOP, LID_TOP.replace("#DBE4FF", "#B8C8FF")).replace(LID_INSET, LID_RIM);

// ---- iso helpers: floor point (u, v) at height h, the pilot's own projection
const B = "#0048FF", B600 = "#003EE0", B200 = "#B8C8FF", W = "#FFFFFF";
const P = (u, v, h = 0) => [-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h];
const f = (n) => +n.toFixed(1);

// ---- people (STYLE §5): light client pawns, one arm weight
const R = 22, H = 62, HEAD = 16;          // body radius, body height, head radius
const ARM = 11, OUT = 1.6, HAND = ARM * 0.8; // arm thickness incl. outline (≈ body/4), hand radius (1.6× stroke /2)
const bodyPath = (x, y) =>
  `M${f(x - R)} ${f(y)} V${f(y - H)} A${R} ${R} 0 0 1 ${f(x + R)} ${f(y - H)} V${f(y)} A${R} ${f(R * 0.45)} 0 0 1 ${f(x - R)} ${f(y)} Z`;
let maskN = 0;
function clientArm(x, y, from, to) {
  // from/to are offsets from the base point; arm grows out of the body (outline masked inside it)
  const [ax, ay] = [x + from[0], y + from[1]], [hx, hy] = [x + to[0], y + to[1]];
  const id = `ht-arm${maskN++}`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-600" y="-300" width="1100" height="900"><rect x="-600" y="-300" width="1100" height="900" fill="${W}"/><path d="${bodyPath(x, y)}" fill="#000000"/></mask>` +
    `<g mask="url(#${id})"><path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/></g>` +
    `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${f(ARM - 2 * OUT)}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND - OUT)}" fill="${W}"/>`;
}
function pawn(u, v, { badge, arm, after = "" } = {}) {
  const [x, y] = P(u, v);
  let s = `<path d="${bodyPath(x, y)}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  s += `<circle cx="${f(x)}" cy="${f(y - H - R - 4 - HEAD)}" r="${HEAD}" fill="${W}" stroke="${B}" stroke-width="1.6"/>`;
  const by = y - H * 0.42;
  if (badge === "cross") s += `<path d="M${f(x)} ${f(by - 11)} v22 M${f(x - 11)} ${f(by)} h22" stroke="${B}" stroke-width="5.4" stroke-linecap="round"/>`;
  if (badge === "heart") s += `<path transform="translate(${f(x)} ${f(by + 9)}) scale(1.45)" d="M0 0 c-8.5 -5.5 -10 -10.5 -7.5 -13.8 c2.4 -2.9 6.2 -1.9 7.5 1.4 c1.3 -3.3 5.1 -4.3 7.5 -1.4 c2.5 3.3 1 8.3 -7.5 13.8 Z" fill="${B}"/>`;
  if (after) s += after(x, y);
  if (arm) s += clientArm(x, y, arm.from, arm.to);
  return s;
}
const pos = (k, d) => (process.env[k] ? process.env[k].split(",").map(Number) : d);
const CARER = pos("CARER", [130, 285]), PATIENT = pos("PATIENT", [215, 272]), CLIN = pos("CLIN", [420, 345]);
// the patient's own phone: the same app in the hand, a small blue phone facing the viewer
const handPhone = (x, y) =>
  `<g transform="matrix(0.9 0.45 0 1 ${f(x + 24)} ${f(y - H - 54)})"><rect width="28" height="48" rx="7" fill="${B}" stroke="${B600}" stroke-width="1.2"/><rect x="4" y="7" width="20" height="35" rx="4" fill="${W}"/><path d="M14 12.5 v8 M10 16.5 h8" stroke="${B}" stroke-width="2.6" stroke-linecap="round"/><rect x="6.5" y="29" width="15" height="7" rx="3.5" fill="#D7F04A" stroke="#A1B71F" stroke-width="0.8"/></g>`;

// Not a queue (5 Nov fix): the carer stands at the patient's shoulder, a pair by the case's front-left face;
// the clinician stands across from them by the case's front corner. Drawn back to front.
const people = [
  "<!-- Who it is for: the carer with the patient, the patient holding the same app, the clinician across from them -->",
  pawn(CARER[0], CARER[1], { badge: "heart" }),
  pawn(PATIENT[0], PATIENT[1], { arm: { from: [8, -H + 22], to: [33, -H + 2] }, after: handPhone }),
  pawn(CLIN[0], CLIN[1], { badge: "cross" }),
].join("\n");

const VB = process.env.VB || "-512 -191 865 651";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="Isometric illustration for HealthTech product design. A white medical case with a blue cross stands open on a dotted floor, its lid up, and a solid blue phone rises out of it showing a care app: a cross badge, a plain consent request with a ticked box, and one lime next-step button. Around the case stand the three people the app serves: a patient holding the same app on a small phone with the same lime next step, a carer marked with a heart at the patient's shoulder, and a clinician marked with a cross across from them.">
${BASE_FIXED}
${people}
</svg>
`;
writeFileSync(new URL(process.env.OUT || "./hero.svg", import.meta.url), svg);
