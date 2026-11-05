// Generator for /expertise/martech-salestech hero: the sales funnel that hands the customer one clear quote.
// Floor and projection are healthtech's (the family standard). Run: node gen.mjs (writes hero.svg beside it)
import { writeFileSync } from "node:fs";
const B = "#0048FF", B600 = "#003EE0", B700 = "#0031B0", B300 = "#8AA5FF", B200 = "#B8C8FF", B100 = "#DBE4FF", W = "#FFFFFF";
const LIME = "#D7F04A", LIME_D = "#A1B71F", INK = "#1B1B18";
const f = (n) => +n.toFixed(1);
const env = (k, d) => (process.env[k] !== undefined ? process.env[k].split(",").map(Number) : d);
// floor point (u, v) at height h: healthtech's own projection
const P = (u, v, h = 0) => [-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h];
const pts = (arr) => arr.map((p) => P(...p).map(f).join(",")).join(" ");
const poly = (arr, fill, sw = 1.6, stroke = B) =>
  `<polygon points="${pts(arr)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
// a circle of radius r on a level plane projects to an ellipse: rx = 0.9·√2·r, ry = 0.45·√2·r
const RX = (r) => 0.9 * Math.SQRT2 * r, RY = (r) => 0.45 * Math.SQRT2 * r;

const FLOOR = `<defs><pattern id="mt-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${B}" fill-opacity="0.38"/></pattern></defs>
<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="545" height="402" fill="url(#mt-dots)"/><rect width="545" height="402" fill="none" stroke="${B}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="455" height="312" fill="${B}" fill-opacity="0.07"/></g>`;

// ---- the funnel (hero, solid blue): mouth, three stage bands, neck and spout, held in a retort stand's ring
const [AU, AV] = env("AXIS", [305, 285]);
const F = { hTip: 168, hNeck: 206, hMouth: 336, rS: 14, rN: 16, rM: 100 };
const [ax, ay0] = P(AU, AV); // axis on the floor, in screen
const Y = (h) => ay0 - h;
const rAt = (h) => F.rN + ((h - F.hNeck) / (F.hMouth - F.hNeck)) * (F.rM - F.rN);
const ell = (r, h, fill, stroke = "none", sw = 1.6) =>
  `<ellipse cx="${f(ax)}" cy="${f(Y(h))}" rx="${f(RX(r))}" ry="${f(RY(r))}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
// the cone's outline: the front half of the mouth ellipse, the two tangent sides, the front half of the neck
const mA = RX(F.rM), mB = RY(F.rM), nA = RX(F.rN), nB = RY(F.rN);
const conePath = `M${f(ax - mA)} ${f(Y(F.hMouth))} A${f(mA)} ${f(mB)} 0 0 0 ${f(ax + mA)} ${f(Y(F.hMouth))} L${f(ax + nA)} ${f(Y(F.hNeck))} A${f(nA)} ${f(nB)} 0 0 1 ${f(ax - nA)} ${f(Y(F.hNeck))} Z`;
// a stage line round the front of the cone at height h
// it starts where the arc has come 3 units inside the cone's side, so it never runs along the edge as a sliver
const band = (h) => {
  const r = rAt(h), a = RX(r), b = RY(r), yh = Y(h);
  const [x1, y1, x2, y2] = [ax - RX(F.rM), Y(F.hMouth), ax - RX(F.rN), Y(F.hNeck)];
  const L = Math.hypot(x2 - x1, y2 - y1);
  const inside = (t) => ((x2 - x1) * (yh + b * Math.sin(t) - y1) - (y2 - y1) * (ax - a * Math.cos(t) - x1)) / L;
  let t = 0;
  while (Math.abs(inside(t)) < 3 && t < 1) t += 0.002;
  const xa = ax - a * Math.cos(t), xb = ax + a * Math.cos(t), yy = yh + b * Math.sin(t);
  return `<path d="M${f(xa)} ${f(yy)} A${f(a)} ${f(b)} 0 0 0 ${f(xb)} ${f(yy)}" fill="none" stroke="${W}" stroke-width="3"/>`;
};
const H1 = F.hNeck + (F.hMouth - F.hNeck) * 0.48, H2 = F.hNeck + (F.hMouth - F.hNeck) * 0.76;
const sA = RX(F.rS), sB = RY(F.rS);
const spout =
  `<path d="M${f(ax - sA)} ${f(Y(F.hNeck) + 2)} V${f(Y(F.hTip))} A${f(sA)} ${f(sB)} 0 0 0 ${f(ax + sA)} ${f(Y(F.hTip))} V${f(Y(F.hNeck) + 2)} Z" fill="${B}" stroke="${B600}" stroke-width="1.4" stroke-linejoin="round"/>` +
  `<path d="M${f(ax + sA * 0.15)} ${f(Y(F.hNeck) + 2)} V${f(Y(F.hTip) + sB * 0.98)} A${f(sA)} ${f(sB)} 0 0 0 ${f(ax + sA)} ${f(Y(F.hTip))} V${f(Y(F.hNeck) + 2)} Z" fill="${B600}"/>`;
const coneBody =
  `<clipPath id="mt-cone"><path d="${conePath}"/></clipPath>` +
  `<path d="${conePath}" fill="${B}"/>` +
  `<g clip-path="url(#mt-cone)"><path d="M${f(ax + 6)} ${f(Y(F.hMouth) - 10)} L${f(ax + 140)} ${f(Y(F.hMouth) - 10)} L${f(ax + 140)} ${f(Y(F.hNeck) + 40)} L${f(ax + 2)} ${f(Y(F.hNeck) + 40)} Z" fill="${B600}"/>` +
  band(H1) + band(H2) + `</g>` +
  `<path d="${conePath}" fill="none" stroke="${B600}" stroke-width="1.6" stroke-linejoin="round"/>`;
// the mouth: a white lip round a deep inside
const mouthBack = ell(F.rM, F.hMouth, W, B, 1.6) + ell(F.rM - 7, F.hMouth, B100, B, 1.2);
const lipFront = `<path d="M${f(ax - mA)} ${f(Y(F.hMouth))} A${f(mA)} ${f(mB)} 0 0 0 ${f(ax + mA)} ${f(Y(F.hMouth))}" fill="none" stroke="${B}" stroke-width="1.6"/>`;

// lead cards standing in the mouth, their feet hidden inside the cone (local x along u, local y down)
function leadCard(du, dv, tilt, h = 64, w = 46, faded = false) {
  const [x0, y0] = P(AU + du, AV + dv, F.hMouth - 64 + h);
  const M = `matrix(0.9 0.45 ${f(tilt)} 1 ${f(x0)} ${f(y0)})`;
  const ln = faded ? B300 : B;
  return `<g transform="${M}"><rect x="2.5" y="3" width="${w}" height="${h}" rx="5" fill="${B200}"/>` +
    `<rect width="${w}" height="${h}" rx="5" fill="${W}" stroke="${ln}" stroke-width="1.4"/>` +
    `<circle cx="13" cy="14" r="6.5" fill="${faded ? B100 : B200}" stroke="${ln}" stroke-width="1.2"/>` +
    `<rect x="9" y="27" width="${w - 18}" height="5" rx="2.5" fill="${faded ? B200 : B300}"/>` +
    `<rect x="9" y="37" width="${w - 26}" height="5" rx="2.5" fill="${B200}"/></g>`;
}
const leadClip = `<clipPath id="mt-mouth"><path d="M${f(ax - mA - 60)} ${f(Y(F.hMouth) - 200)} H${f(ax + mA + 60)} V${f(Y(F.hMouth))} H${f(ax + mA)} A${f(mA)} ${f(mB)} 0 0 1 ${f(ax - mA)} ${f(Y(F.hMouth))} H${f(ax - mA - 60)} Z"/></clipPath>`;
const leads = leadClip + `<g clip-path="url(#mt-mouth)">` +
  leadCard(-50, -4, -0.1, 116, 50, true) + leadCard(-8, -40, 0.04, 124, 52) + leadCard(10, 24, 0.14, 110, 50) + `</g>`;

// retort stand: a base plate, one rod, an arm to the ring that holds the funnel at its upper band
const hRing = F.hNeck + (F.hMouth - F.hNeck) * 0.2, rRing = rAt(hRing) + 5;
// the rod stands straight left of the funnel on screen, so its arm runs level to the ring's left-most point
const ROD = rRing + 64, D = Math.SQRT1_2;
const [RU, RV] = [AU - ROD * D, AV + ROD * D];
const base = (() => {
  const u0 = RU - 34, u1 = RU + 16, v0 = RV - 34, v1 = RV + 16, h = 9;
  return poly([[u0, v0, h], [u1, v0, h], [u1, v1, h], [u0, v1, h]], W) +
    poly([[u0, v1, 0], [u1, v1, 0], [u1, v1, h], [u0, v1, h]], B100) +
    poly([[u1, v1, 0], [u1, v0, 0], [u1, v0, h], [u1, v1, h]], B200);
})();
const [rx, ry0] = P(RU, RV);
const rodTop = hRing + 16;
const rod = `<rect x="${f(rx - 4.5)}" y="${f(ry0 - rodTop)}" width="9" height="${f(rodTop - 9)}" rx="4.5" fill="${W}" stroke="${B}" stroke-width="1.4"/>` +
  `<rect x="${f(rx)}" y="${f(ry0 - rodTop + 4)}" width="3.6" height="${f(rodTop - 15)}" rx="1.8" fill="${B200}"/>`;
const [cx0, cy0] = P(RU, RV, hRing), [cx1, cy1] = P(AU - rRing * D, AV + rRing * D, hRing);
const clamp = `<rect x="${f(rx - 8)}" y="${f(cy0 - 9)}" width="16" height="18" rx="4" fill="${W}" stroke="${B}" stroke-width="1.4"/>`;
const arm = `<path d="M${f(cx0)} ${f(cy0)} L${f(cx1)} ${f(cy1)}" stroke="${B}" stroke-width="8" stroke-linecap="round"/><path d="M${f(cx0)} ${f(cy0)} L${f(cx1)} ${f(cy1)}" stroke="${W}" stroke-width="4.8" stroke-linecap="round"/>`;
const rA = RX(rRing), rB = RY(rRing);
const ringArc = (sweep) => {
  const d = `M${f(ax - rA)} ${f(Y(hRing))} A${f(rA)} ${f(rB)} 0 0 ${sweep} ${f(ax + rA)} ${f(Y(hRing))}`;
  return `<path d="${d}" fill="none" stroke="${B}" stroke-width="8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${W}" stroke-width="4.8" stroke-linecap="round"/>`;
};
const ringBack = ringArc(1), ringFront = ringArc(0);

// ---- the quote that comes out of the spout: line items, a lime total with a tick, an AI sparkle as its drafter
const Q = { w: 100, h: 138 };
// the sheet hangs from inside the spout: its top centre sits 4 above the spout's tip, behind the spout's front wall
const [QDU, QDV] = [-Q.w / 2, 0];
const qTop = F.hTip + 4;
const [qx, qy] = P(AU + QDU, AV + QDV, qTop);
const QM = `matrix(0.9 0.45 0 1 ${f(qx)} ${f(qy)})`;
const rows = [0, 1, 2].map((i) => {
  const y = 50 + i * 16;
  return `<rect x="10" y="${y}" width="${[40, 32, 46][i]}" height="5.5" rx="2.75" fill="${B200}"/><rect x="${Q.w - 26}" y="${y}" width="16" height="5.5" rx="2.75" fill="${B300}"/>`;
}).join("");
const quote = `<g transform="${QM}">
<rect x="3" y="3" width="${Q.w}" height="${Q.h}" rx="6" fill="${B200}"/>
<rect width="${Q.w}" height="${Q.h}" rx="6" fill="${W}" stroke="${B}" stroke-width="1.6"/>
<rect x="10" y="25" width="30" height="8" rx="4" fill="${B}"/>
<path d="M${Q.w - 16} 22.5 Q${Q.w - 16} 29 ${Q.w - 9.5} 29 Q${Q.w - 16} 29 ${Q.w - 16} 35.5 Q${Q.w - 16} 29 ${Q.w - 22.5} 29 Q${Q.w - 16} 29 ${Q.w - 16} 22.5 Z" fill="${B}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>
${rows}
<path d="M10 ${Q.h - 33} H${Q.w - 10}" stroke="${B}" stroke-width="1.2" stroke-linecap="round"/>
<rect x="10" y="${Q.h - 25}" width="${Q.w - 20}" height="16" rx="8" fill="${LIME}" stroke="${LIME_D}" stroke-width="1.2"/>
<rect x="18" y="${Q.h - 19}" width="30" height="4.5" rx="2.25" fill="${INK}"/>
<path d="M${Q.w - 26} ${Q.h - 17} l4 4 l7.5 -8" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

// ---- people (STYLE §5): healthtech's pawn
const R = 22, H = 62, HEAD = 16, ARM = 11, OUT = 1.6, HAND = ARM * 0.8;
const bodyPath = (x, y) =>
  `M${f(x - R)} ${f(y)} V${f(y - H)} A${R} ${R} 0 0 1 ${f(x + R)} ${f(y - H)} V${f(y)} A${R} ${f(R * 0.45)} 0 0 1 ${f(x - R)} ${f(y)} Z`;
let mN = 0;
function clientArm(x, y, from, to) {
  const [sx, sy] = [x + from[0], y + from[1]], [hx, hy] = [to[0], to[1]];
  const id = `mt-arm${mN++}`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-700" y="-400" width="1400" height="1000"><rect x="-700" y="-400" width="1400" height="1000" fill="${W}"/><path d="${bodyPath(x, y)}" fill="#000000"/></mask>` +
    `<g mask="url(#${id})"><path d="M${f(sx)} ${f(sy)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/></g>` +
    `<path d="M${f(sx)} ${f(sy)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${f(ARM - 2 * OUT)}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND - OUT)}" fill="${W}"/>`;
}
function pawn(u, v, { badge, arm } = {}) {
  const [x, y] = P(u, v);
  let s = `<path d="${bodyPath(x, y)}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  s += `<circle cx="${f(x)}" cy="${f(y - H - R - 4 - HEAD)}" r="${HEAD}" fill="${W}" stroke="${B}" stroke-width="1.6"/>`;
  const by = y - H * 0.42;
  if (badge === "briefcase") s += `<rect x="${f(x - 12)}" y="${f(by - 7)}" width="24" height="17" rx="3.5" fill="${B}"/><path d="M${f(x - 5.5)} ${f(by - 7)} v-3.2 a2.2 2.2 0 0 1 2.2 -2.2 h6.6 a2.2 2.2 0 0 1 2.2 2.2 v3.2" fill="none" stroke="${B}" stroke-width="2.6" stroke-linejoin="round"/><path d="M${f(x - 12)} ${f(by + 0.5)} h24" stroke="${W}" stroke-width="1.6"/>`;
  if (badge === "target") s += `<circle cx="${f(x)}" cy="${f(by)}" r="11" fill="none" stroke="${B}" stroke-width="3.6"/><circle cx="${f(x)}" cy="${f(by)}" r="4.2" fill="${B}"/>`;
  if (arm) s += clientArm(x, y, arm.from, arm.to);
  return s;
}
// quote corners in screen, for the customer's hand
const qPt = (lx, ly) => [qx + 0.9 * lx, qy + 0.45 * lx + ly];
const CUST = env("CUST", [AU + 96, AV - 6]);
const REPP = env("REPP", [AU + 150, AV - 75]);
// the rep stands in front of the stand's rod, a hand on it: the funnel is the rep's to run
const REP = env("REP", [RU + 20, RV + 69]);
const REP_HAND = [rx - 6.5, ry0 - 26];
const HANDAT = qPt(Q.w - 1, Q.h - 50);

const ALT = "Isometric illustration for MarTech and SalesTech product design. A solid blue sales funnel, held in a stand on a dotted floor, has three lead cards dropped into its wide mouth. Out of its spout comes one clear quote: a few line items, a lime total with a tick and a small AI sparkle as its drafter. A customer marked with a briefcase takes the quote in one hand, with the sales rep, marked with a target, standing beside the customer.";
const svg = (vb) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${ALT}">
${FLOOR}
<!-- The stand: base, rod, the arm to the ring -->
${base}
${rod}
${arm}
${clamp}
${ringBack}
<!-- The funnel: leads go in at the mouth -->
${mouthBack}
${leads}
${coneBody}
${lipFront}
${ringFront}
<!-- One clear quote comes out of the spout -->
${quote}
${spout}
<!-- The rep who works the funnel, and the customer the quote is for -->
${pawn(REPP[0], REPP[1], { badge: "target" })}
${pawn(CUST[0], CUST[1], { badge: "briefcase", arm: { from: [-10, -56], to: HANDAT } })}
</svg>
`;
const VB = process.env.VB || "-512 -110 865 572";
writeFileSync(new URL(process.env.OUT || "./hero.svg", import.meta.url), svg(VB));
