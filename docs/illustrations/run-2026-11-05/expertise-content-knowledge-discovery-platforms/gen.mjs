// Generator for /expertise/content-knowledge-discovery-platforms hero.
// The object: a library card catalogue, drawn the hub's way (white faces, brandeis-200 sides, blue outline).
// The one blue product element is the search field lying on its lid. A dashed connector runs from the search
// field to the one card it found: the card is lifted out of the open drawer and carries a lime "current" tab.
// Floor and projection are healthtech's: floor point (u, v) at height h -> P(u, v, h).
// Run: node gen.mjs  (writes hero.svg beside it)
import { writeFileSync } from "node:fs";

const B = "#0048FF", B6 = "#003EE0", B3 = "#8AA5FF", B2 = "#B8C8FF", B1 = "#DBE4FF", B05 = "#EEF2FF";
const W = "#FFFFFF", LIME = "#D7F04A", LIMED = "#A1B71F", INK = "#1B1B18";
const ID = "ckd";
const f = (n) => +n.toFixed(1);
const P = (u, v, h = 0) => [-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h];
const pts = (...ps) => ps.map(([x, y]) => `${f(x)},${f(y)}`).join(" ");
const poly = (ps, fill, stroke = B, sw = 1.6) =>
  `<polygon points="${pts(...ps)}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"` : ""}/>`;
const line = (ps, extra = "") =>
  `<polyline points="${pts(...ps)}" fill="none" stroke="${B}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
// 2D content on a front plane (v fixed): local x along u, local y downward from height h
const front = (u, v, h) => { const [x, y] = P(u, v, h); return `matrix(0.9 0.45 0 1 ${f(x)} ${f(y)})`; };
// 2D content on the top plane (h fixed): local x along u, y along v
const top = (u, v, h) => { const [x, y] = P(u, v, h); return `matrix(0.9 0.45 -0.9 0.45 ${f(x)} ${f(y)})`; };

const env = (k, d) => (process.env[k] ? process.env[k].split(",").map(Number) : d);
const out = [];
const add = (s) => out.push(s);

// ---------------------------------------------------------------- floor (healthtech's plate)
add(`<defs><pattern id="${ID}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${B}" fill-opacity="0.38"/></pattern></defs>`);
add(`<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->`);
const [FW, FH] = env("FLOOR", [420, 300]);
add(`<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="${FW}" height="${FH}" fill="url(#${ID}-dots)"/><rect width="${FW}" height="${FH}" fill="none" stroke="${B}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FW - 90}" height="${FH - 90}" fill="${B}" fill-opacity="0.07"/></g>`);

// ---------------------------------------------------------------- the card catalogue (hub object: white, outlined)
const [U0, U1] = env("CU", [110, 370]);
const [V0, V1] = env("CV", [50, 150]);
const LEG = env("LEG", [30])[0], HT = env("HT", [196])[0];   // legs, then the chest of drawers up to HT
const [COLS, ROWS] = env("GRID", [2, 3]),  M = 12, G = 8, MT = 12, MB = 10;
const DW = (U1 - U0 - 2 * M - (COLS - 1) * G) / COLS;
const DH = (HT - LEG - MT - MB - (ROWS - 1) * G) / ROWS;
const drawerAt = (c, r) => ({ u0: U0 + M + c * (DW + G), h0: LEG + MB + r * (DH + G) });
const [OC, OR] = env("OPEN", [0, 0]);  // the open drawer: column from the left, row from the bottom
const OUT = env("DOUT", [78])[0];

// labels of different lengths: the catalogue is an index of topics, not a wall of lockers
const LABELS = [[16, 22, 12], [20, 10, 18], [13, 19, 22]]; // [row][col] bar length inside a 26-wide frame

add(`<!-- The card catalogue: a chest of small drawers on short legs -->`);
const leg = (u, v) => {
  const s = 9;
  return poly([P(u + s, v, 0), P(u + s, v - s, 0), P(u + s, v - s, LEG), P(u + s, v, LEG)], B2, B, 1.2) +
    poly([P(u, v, 0), P(u + s, v, 0), P(u + s, v, LEG), P(u, v, LEG)], W, B, 1.2);
};
add(leg(U1 - 11, V0 + 11));
add(leg(U0 + 2, V1 - 2));
add(leg(U1 - 11, V1 - 2));
add(poly([P(U1, V0, LEG), P(U1, V1, LEG), P(U1, V1, HT), P(U1, V0, HT)], B2));    // right side
add(poly([P(U0, V1, LEG), P(U1, V1, LEG), P(U1, V1, HT), P(U0, V1, HT)], W));     // front
add(poly([P(U0, V0, HT), P(U1, V0, HT), P(U1, V1, HT), P(U0, V1, HT)], W));       // lid

// the search field: the one blue product element, a pill lying flat on the lid, magnifier and query in white
const PILL = { a0: 22, len: U1 - U0 - 62, wid: 38 };
PILL.b0 = (V1 - V0 - PILL.wid) / 2;
{
  const { a0, len, wid, b0 } = PILL, cy = b0 + wid / 2;
  add(`<!-- The search field lying flat on the lid -->`);
  add(`<g transform="${top(U0, V0, HT)}"><rect x="${a0}" y="${f(b0)}" width="${len}" height="${wid}" rx="${wid / 2}" fill="${B}" stroke="${B6}" stroke-width="1.2"/>` +
    `<circle cx="${a0 + 22}" cy="${f(cy)}" r="8" fill="none" stroke="${W}" stroke-width="3.4"/><path d="M${a0 + 30} ${f(cy)} h9" stroke="${W}" stroke-width="3.4" stroke-linecap="round"/>` +
    `<rect x="${a0 + 50}" y="${f(cy - 4)}" width="${f(len * 0.46)}" height="8" rx="4" fill="${W}"/></g>`);
}

// a drawer front: white panel, a label frame with a bar, a small pull
const drawerFace = (u0, v, h0, bar, focus = false, rx = 4) => {
  const fw = 26, fh = 11, fx = DW / 2 - fw / 2, fy = 7;
  return `<g transform="${front(u0, v, h0 + DH)}"><rect width="${f(DW)}" height="${f(DH)}" rx="${rx}" fill="${W}" stroke="${B}" stroke-width="1.2"/>` +
    `<rect x="${f(fx)}" y="${fy}" width="${fw}" height="${fh}" rx="2" fill="${W}" stroke="${B}" stroke-width="1.2"/>` +
    `<rect x="${f(fx + 4)}" y="${fy + 3.5}" width="${bar}" height="4" rx="2" fill="${B2}"/>` +
    (focus ? `<rect x="${f(fx - 4)}" y="${fy - 4}" width="${fw + 8}" height="${fh + 8}" rx="5" fill="none" stroke="${B}" stroke-width="1.4" stroke-dasharray="0.1 3.6" stroke-linecap="round"/>` : "") +
    `<circle cx="${f(DW / 2)}" cy="${f(DH - 9)}" r="2.6" fill="${B}"/></g>`;
};
for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
  if (c === OC && r === OR) continue;
  const d = drawerAt(c, r);
  add(drawerFace(d.u0, V1, d.h0, LABELS[r][c]));
}

// ---------------------------------------------------------------- the open drawer, its cards and the found card
const walls = [];
const late = [];
{
  const d = drawerAt(OC, OR);
  const u0 = d.u0, u1 = d.u0 + DW, hb = d.h0, ht = d.h0 + DH, vb = V1, vf = V1 + OUT;
  add(`<!-- One drawer pulled out; the card the search found is lifted out of its row -->`);
  add(poly([P(u0, vb, hb), P(u1, vb, hb), P(u1, vb, ht), P(u0, vb, ht)], B1, B, 1.2));       // the slot
  add(poly([P(u0, vb, hb), P(u0, vf, hb), P(u0, vf, ht), P(u0, vb, ht)], B05, B, 1.2));      // left inner wall
  const n = 6, cardIn = 7, stick = 6, T = 3;
  const lifted = env("LIFT", [3])[0];
  const LIFTH = env("LH", [12])[0];       // clearance under the lifted card
  const CH = env("CH", [80])[0];          // lifted card height
  const cu0 = u0 + cardIn, cu1 = u1 - cardIn, cw = cu1 - cu0;
  const vAt = (i) => vb + 9 + i * ((OUT - 18) / (n - 1));
  const tab = { x0: cw * 0.64, x1: cw * 0.64 + 28, h: 11 };
  for (let i = 0; i < n; i++) {
    const v = vAt(i);
    if (i === lifted) {
      const cb = ht + stick + LIFTH, ctop = cb + CH;
      // drop lines from the card's lower corners to the row it came out of
      add(`<g stroke="${B}" stroke-width="1.2" stroke-dasharray="3 3" stroke-linecap="round">` +
        `<path d="M${pts(P(cu0 + 4, v, cb))} L${pts(P(cu0 + 4, v, ht + stick - 2))}"/>` +
        `<path d="M${pts(P(cu1 - 4, v, cb))} L${pts(P(cu1 - 4, v, ht + stick - 2))}"/></g>`);
      // thickness: one thin edge face on the right and on the top, brandeis-200
      add(poly([P(cu1, v, cb + 3), P(cu1, v - T, cb + 3), P(cu1, v - T, ctop - 3), P(cu1, v, ctop - 3)], B2, B, 1));
      add(poly([P(cu0 + 3, v, ctop), P(cu0 + tab.x0, v, ctop), P(cu0 + tab.x0, v - T, ctop), P(cu0 + 3, v - T, ctop)], B2, B, 1));
      add(poly([P(cu0 + tab.x1, v, ctop), P(cu1 - 3, v, ctop), P(cu1 - 3, v - T, ctop), P(cu0 + tab.x1, v - T, ctop)], B2, B, 1));
      // the lime guide tab's own top and side, in the darker lime
      add(poly([P(cu0 + tab.x0, v, ctop + tab.h), P(cu0 + tab.x1, v, ctop + tab.h), P(cu0 + tab.x1, v - T, ctop + tab.h), P(cu0 + tab.x0, v - T, ctop + tab.h)], LIMED, B, 1));
      add(poly([P(cu0 + tab.x1, v, ctop), P(cu0 + tab.x1, v - T, ctop), P(cu0 + tab.x1, v - T, ctop + tab.h), P(cu0 + tab.x1, v, ctop + tab.h)], LIMED, B, 1));
      // the card face, tab included, as one outline
      const r = 4, tx0 = tab.x0, tx1 = tab.x1, th = tab.h;
      const tabPath = `M${f(tx0)} ${th} V2 Q${f(tx0)} 0 ${f(tx0 + 2)} 0 H${f(tx1 - 2)} Q${f(tx1)} 0 ${f(tx1)} 2 V${th}`;
      const face = `M${r} ${th} H${f(tx0)} V2 Q${f(tx0)} 0 ${f(tx0 + 2)} 0 H${f(tx1 - 2)} Q${f(tx1)} 0 ${f(tx1)} 2 V${th} H${f(cw - r)} Q${f(cw)} ${th} ${f(cw)} ${th + r} V${f(th + CH - r)} Q${f(cw)} ${f(th + CH)} ${f(cw - r)} ${f(th + CH)} H${r} Q0 ${f(th + CH)} 0 ${f(th + CH - r)} V${th + r} Q0 ${th} ${r} ${th} Z`;
      add(`<g transform="${front(cu0, v, ctop + th)}"><path d="${face}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>` +
        `<path d="${tabPath} Z" fill="${LIME}"/><path d="${tabPath}" fill="none" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>` +
        `<path d="M${f(tx0 + 7)} ${th - 4.6} l3 3 l6 -5.6" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>` +
        // owner: a large avatar and one name bar
        `<circle cx="16" cy="${th + 17}" r="9.5" fill="${B}"/><rect x="31" y="${th + 13}" width="${f(cw - 42)}" height="8" rx="4" fill="${B}"/>` +
        // one line of body text
        `<rect x="9" y="${th + 36}" width="${f(cw - 20)}" height="6" rx="3" fill="${B2}"/>` +
        // source: a blue link mark with a short dashed tail to the card's edge
        `<g fill="none" stroke="${B}" stroke-width="2.6" stroke-linecap="round"><path d="M14.5 ${th + 51} h-3.5 a5 5 0 0 0 0 10 h3.5"/><path d="M19.5 ${th + 51} h3.5 a5 5 0 0 1 0 10 h-3.5"/><path d="M13 ${th + 56} h8"/></g>` +
        `<path d="M34 ${th + 56} H${f(cw - 1)}" stroke="${B}" stroke-width="1.4" stroke-dasharray="3 3" stroke-linecap="round"/></g>`);
      // the search's connector: from the field's front edge, forward over the lid, down onto the lime tab
      const uC = cu0 + (tab.x0 + tab.x1) / 2;
      const vPill = V0 + PILL.b0 + PILL.wid;
      late.push(`<!-- The search finds the card: a dashed connector from the field onto the card's lime tab -->`);
      late.push(line([P(uC, vPill, HT), P(uC, v, HT), P(uC, v, ctop + th + 1)], ` stroke-dasharray="4 4"`));
    } else {
      add(`<g transform="${front(cu0, v, ht + stick)}"><rect width="${f(cw)}" height="${f(DH - 2)}" rx="4" fill="${B05}" stroke="${B3}" stroke-width="1.2"/></g>`);
    }
  }
  walls.push(poly([P(u1, vb, hb), P(u1, vf, hb), P(u1, vf, ht), P(u1, vb, ht)], B2, B, 1.2));  // right wall
  walls.push(drawerFace(u0, vf, hb, LABELS[OR][OC], true, 1));                                  // front panel
}

// ---------------------------------------------------------------- people (STYLE §5): healthtech's pawn
const R = 22, H = 62, HEAD = 16, ARM = 11, OUTL = 1.6, HAND = ARM * 0.8;
const bodyPath = (x, y) =>
  `M${f(x - R)} ${f(y)} V${f(y - H)} A${R} ${R} 0 0 1 ${f(x + R)} ${f(y - H)} V${f(y)} A${R} ${f(R * 0.45)} 0 0 1 ${f(x - R)} ${f(y)} Z`;
let mk = 0;
function clientArm(x, y, from, to) {
  const [ax, ay] = [x + from[0], y + from[1]], [hx, hy] = [x + to[0], y + to[1]];
  const id = `${ID}-arm${mk++}`;
  return `<mask id="${id}" maskUnits="userSpaceOnUse" x="-600" y="-400" width="1200" height="1000"><rect x="-600" y="-400" width="1200" height="1000" fill="${W}"/><path d="${bodyPath(x, y)}" fill="#000000"/></mask>` +
    `<g mask="url(#${id})"><path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${B}" stroke-width="${ARM}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND)}" fill="${B}"/></g>` +
    `<path d="M${f(ax)} ${f(ay)} L${f(hx)} ${f(hy)}" stroke="${W}" stroke-width="${f(ARM - 2 * OUTL)}" stroke-linecap="round"/><circle cx="${f(hx)}" cy="${f(hy)}" r="${f(HAND - OUTL)}" fill="${W}"/>`;
}
function pawn(u, v, { arm } = {}) {
  const [x, y] = P(u, v);
  let s = `<path d="${bodyPath(x, y)}" fill="${W}" stroke="${B}" stroke-width="1.6" stroke-linejoin="round"/>`;
  s += `<circle cx="${f(x)}" cy="${f(y - H - R - 4 - HEAD)}" r="${HEAD}" fill="${W}" stroke="${B}" stroke-width="1.6"/>`;
  if (arm) s += clientArm(x, y, arm.from, arm.to);
  return s;
}
const READER = env("READER", [60, 232]);
const ARMTO = env("ARMTO", [80, -96]);
add(`<!-- The reader: a client at the open drawer, a hand on the card the search found -->`);
add(pawn(READER[0], READER[1], { arm: { from: [8, -H + 20], to: ARMTO } }));
walls.forEach(add);
late.forEach(add);

// ---------------------------------------------------------------- viewBox
const VB = process.env.VB || "-418 -101 656 456";
const alt = "Isometric illustration for content and knowledge platform design. On a dotted floor stands a white library card catalogue of six labelled drawers on short legs, with a blue search field lying on its lid. A dashed line runs from the search field to one card lifted out of an open drawer, landing on the card's lime tab that marks it as the current version. The card shows its owner and a link mark for its source, while the faded cards behind it stay in the drawer. A client stands beside the drawer with a hand on that card.";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" role="img" aria-label="${alt}">\n${out.join("\n")}\n</svg>\n`;
writeFileSync(new URL(process.env.OUT || "./hero.svg", import.meta.url), svg);
