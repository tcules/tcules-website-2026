// Generator for the three /why-tcules principle figures (fix pass, 5 Nov 2026).
// World: x right-down, y left-down, z up; 2:1 isometric as in the approved heroes. Box 458 x 402.
import { writeFileSync } from 'node:fs';

const DIR = process.argv[2];
const B = { 500: '#0048FF', 600: '#003EE0', 700: '#0031B0', 300: '#8AA5FF', 200: '#B8C8FF', 100: '#DBE4FF', 50: '#EEF2FF' };
const LIME = '#D7F04A', LIME_D = '#A1B71F', INK = '#1B1B18', W = '#FFFFFF';
const OX = 229, OY = 176;
const P = (x, y, z = 0) => [OX + 0.9 * (x - y), OY + 0.45 * (x + y) - z];
const f = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
const NS = 'vector-effect="non-scaling-stroke"';
const mFloor = (x, y, z) => { const [X, Y] = P(x, y, z); return `matrix(0.9 0.45 -0.9 0.45 ${f(X)} ${f(Y)})`; };
const mFront = (x, y, ztop) => { const [X, Y] = P(x, y, ztop); return `matrix(0.9 0.45 0 1 ${f(X)} ${f(Y)})`; };

// rounded rect outline in plane coords, clockwise from the top edge, with outward normals per vertex
function rrect(w, h, r, seg = 8) {
  const out = [];
  const corner = (cx, cy, a0) => {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (Math.PI / 2) * (i / seg);
      out.push({ u: cx + r * Math.cos(a), v: cy + r * Math.sin(a), nu: Math.cos(a), nv: Math.sin(a) });
    }
  };
  corner(w - r, r, -Math.PI / 2); // top-right
  corner(w - r, h - r, 0); // bottom-right
  corner(r, h - r, Math.PI / 2); // bottom-left
  corner(r, r, Math.PI); // top-left
  return out;
}

// A rounded slab: face drawn through `matrix`, thickness swept by screen offset d.
// map(u,v) -> screen; vis(n) and tone(n) take the edge's plane normal.
function slab({ w, h, r, map, matrix, d, vis, tone, face, stroke, sw, extraFace = '' }) {
  const o = rrect(w, h, r);
  const n = o.length;
  const S = o.map((p) => map(p.u, p.v));
  const edges = [];
  for (let i = 0; i < n; i++) {
    const a = o[i], b = o[(i + 1) % n];
    const nu = (a.nu + b.nu) / 2, nv = (a.nv + b.nv) / 2;
    edges.push({ i, j: (i + 1) % n, vis: vis(nu, nv), tone: tone(nu, nv) });
  }
  // rotate so the visible run is contiguous from index 0
  let start = edges.findIndex((e, k) => e.vis && !edges[(k - 1 + n) % n].vis);
  const run = [];
  for (let k = 0; k < n; k++) { const e = edges[(start + k) % n]; if (!e.vis) break; run.push(e); }
  const groups = [];
  for (const e of run) {
    const g = groups[groups.length - 1];
    if (g && g.tone === e.tone) g.edges.push(e); else groups.push({ tone: e.tone, edges: [e] });
  }
  const sh = ([x, y]) => [x + d[0], y + d[1]];
  let s = '';
  for (const g of groups) {
    const idx = [g.edges[0].i, ...g.edges.map((e) => e.j)];
    const front = idx.map((k) => S[k]);
    const poly = [...front, ...front.slice().reverse().map(sh)];
    s += `<path d="M${pts(poly)} Z" fill="${g.tone}" stroke="${g.tone}" stroke-width="0.6" stroke-linejoin="round"/>`;
  }
  const idxAll = [run[0].i, ...run.map((e) => e.j)];
  const fr = idxAll.map((k) => S[k]);
  const sweep = [fr[0], ...fr.map(sh), fr[fr.length - 1]];
  s += `<path d="M${pts(sweep)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  if (groups.length > 1) {
    const k = groups[0].edges[groups[0].edges.length - 1].j;
    s += `<path d="M${pts([S[k], sh(S[k])])}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"/>`;
  }
  s += `<g transform="${matrix}"><rect width="${w}" height="${h}" rx="${r}" fill="${face}" stroke="${stroke}" stroke-width="${sw}" ${NS}/>${extraFace}</g>`;
  return s;
}

// a box lying on the floor plane: footprint x0..x0+w, y0..y0+h, from z0 up by t
const floorBox = ({ x0, y0, w, h, r, z0 = 0, t, sides, face, stroke, sw, extraFace }) =>
  slab({
    w, h, r, map: (u, v) => P(x0 + u, y0 + v, z0 + t), matrix: mFloor(x0, y0, z0 + t), d: [0, t],
    vis: (nu, nv) => nu + nv > 1e-6, tone: (nu, nv) => (nu > nv ? sides[1] : sides[0]),
    face, stroke, sw, extraFace,
  });
// a slab standing in a front plane (facing +y) at y, x0..x0+w, ztop down by h, thickness t backwards
const frontSlab = ({ x0, y, ztop, w, h, r, t, sides, face, stroke, sw, extraFace }) => {
  const [ax, ay] = P(0, 0, 0), [bx, by] = P(0, -t, 0);
  return slab({
    w, h, r, map: (u, v) => P(x0 + u, y, ztop - v), matrix: mFront(x0, y, ztop), d: [bx - ax, by - ay],
    vis: (nu, nv) => nu - 0.9 * nv > 1e-6, tone: (nu, nv) => (-nv > nu ? sides[0] : sides[1]),
    face, stroke, sw, extraFace,
  });
};

function floor(id) {
  return `<defs><pattern id="${id}" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.2" fill="${B[300]}" fill-opacity="0.75"/></pattern></defs>
<!-- Floor -->
<g transform="${mFloor(0, 0, 0)}"><rect x="30" y="30" width="188" height="188" fill="${B[50]}"/><rect width="248" height="248" fill="url(#${id})"/><rect width="248" height="248" fill="none" stroke="${B[500]}" stroke-width="1.2" stroke-dasharray="6 5" ${NS}/></g>`;
}

// the pawn: body (straight 34, round top r 13), head r 9; returns its shoulder point
function pawn(x, y, solid, casing = false) {
  const [cx, base] = P(x, y, 0);
  const R = 13, st = 34;
  const fill = solid ? B[500] : W;
  const body = `<path d="M${f(cx - R)} ${f(base)} V${f(base - st)} A${R} ${R} 0 0 1 ${f(cx + R)} ${f(base - st)} V${f(base)} A${R} 6.2 0 0 1 ${f(cx - R)} ${f(base)} Z" fill="${fill}" stroke="${B[500]}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const head = `<circle cx="${f(cx)}" cy="${f(base - st - R - 3.5 - 9)}" r="9" fill="${fill}" stroke="${B[500]}" stroke-width="1.6"/>`;
  const cas = casing ? body.replace(/fill="[^"]*" stroke="[^"]*" stroke-width="1.6"/, `fill="${W}" stroke="${W}" stroke-width="5"`) : '';
  return { svg: cas + body + head, shoulder: [cx + R - 0.5, base - st + 1], head: [cx, base - st - R - 3.5 - 9] };
}
function arm(from, to) {
  return `<path d="M${pts([from, to])}" stroke="${W}" stroke-width="6.6" stroke-linecap="round"/><path d="M${pts([from, to])}" stroke="${B[500]}" stroke-width="3" stroke-linecap="round"/><circle cx="${f(to[0])}" cy="${f(to[1])}" r="3.6" fill="${B[500]}" stroke="${W}" stroke-width="1.6"/>`;
}
const svg = (label, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 458 402" role="img" aria-label="${label}" fill="none">\n${body}\n</svg>\n`;
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// ======================= 1 · Evidence before screens =======================
{
  const out = [floor('wt-evidence-dots')];
  // the full product, not built yet: a pale dashed screen standing at the back
  const G = { x0: 16, y: 118, w: 172, h: 152 };
  out.push(`<!-- The full product, not built yet: a pale dashed screen at the back -->`);
  out.push(`<g transform="${mFront(G.x0, G.y, G.h)}"><rect width="${G.w}" height="${G.h}" rx="10" fill="${B[50]}" stroke="${B[300]}" stroke-width="1.6" stroke-dasharray="6 5" ${NS}/>` +
    `<rect x="16" y="16" width="${G.w - 32}" height="18" rx="9" fill="none" stroke="${B[300]}" stroke-width="1.4" stroke-dasharray="5 4" ${NS}/>` +
    `<rect x="98" y="48" width="${G.w - 114}" height="86" rx="9" fill="none" stroke="${B[300]}" stroke-width="1.4" stroke-dasharray="5 4" ${NS}/></g>`);
  // the prototype: a small blue phone, hand-sized against the user
  const Ph = { x0: 98, y: 166, ztop: 90, w: 50, h: 90, t: 7 };
  const scr = `<rect x="6" y="12" width="${Ph.w - 12}" height="${Ph.h - 21}" rx="7" fill="${W}"/>` +
    `<rect x="${Ph.w / 2 - 7}" y="5" width="14" height="3" rx="1.5" fill="${B[200]}"/>` +
    `<rect x="12" y="18" width="${Ph.w - 24}" height="18" rx="5" fill="${B[100]}"/>` +
    `<rect x="12" y="41" width="22" height="5" rx="2.5" fill="${B[500]}"/>` +
    `<rect x="12" y="52" width="${Ph.w - 24}" height="13" rx="6.5" fill="${LIME}" stroke="${LIME_D}" stroke-width="1" ${NS}/>` +
    `<rect x="${Ph.w / 2 - 7}" y="57" width="14" height="3" rx="1.5" fill="${INK}"/>` +
    `<rect x="12" y="70" width="18" height="4" rx="2" fill="${B[200]}"/>`;
  out.push(`<!-- The prototype: a small solid blue phone -->`);
  out.push(frontSlab({ ...Ph, r: 10, sides: [B[600], B[700]], face: B[500], stroke: B[600], sw: 1.2, extraFace: scr }));
  // button centre in world
  const btn = P(Ph.x0 + Ph.w / 2 - 6, Ph.y, Ph.ztop - 58.5);
  // the real user, close up, tapping it
  const pw = pawn(124, 206, false);
  out.push(`<!-- A real user (white: the client's people) taps the prototype's lime button -->`);
  out.push(pw.svg);
  out.push(arm(pw.shoulder, btn));
  console.error('evidence arm', f(len(pw.shoulder, btn)), 'btn', btn.map(f), 'head', pw.head.map(f));
  // the evidence: the user's answer, a speech bubble with a tick
  const Bu = { x0: 82, y: 206, ztop: 112, w: 42, h: 28, t: 4 };
  const tick = `<path d="M13.5 14.5 L18.5 19 L28.5 9.5" fill="none" stroke="${B[500]}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${NS}/>`;
  out.push(`<!-- The evidence: the user's answer, a tick -->`);
  out.push(frontSlab({ ...Bu, r: 9, sides: [B[200], B[200]], face: W, stroke: B[500], sw: 1.6, extraFace: tick }));
  // tail: a small triangle under the bubble, pointing at the head
  const ta = P(Bu.x0 + 22, Bu.y, Bu.ztop - Bu.h + 0.8), tb = P(Bu.x0 + 32, Bu.y, Bu.ztop - Bu.h + 0.8), tc = P(Bu.x0 + 31, Bu.y, Bu.ztop - Bu.h - 9);
  out.push(`<path d="M${pts([ta, tc, tb])}" fill="${W}" stroke="${B[500]}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<path d="M${pts([[ta[0] + 0.9, ta[1] - 0.4], [tb[0] - 0.9, tb[1] + 0.5]])}" stroke="${W}" stroke-width="2.4"/>`);
  writeFileSync(`${DIR}/evidence-before-screens.svg`, svg(
    'Isometric drawing: on a dotted floor, a real user taps the lime button on a small blue prototype phone and answers with a tick in a speech bubble, while the full screen behind them is still only a pale dashed outline, not yet built.',
    out.join('\n')));
}

// ======================= 2 · What to build first =======================
{
  const out = [floor('wt-first-dots')];
  const T = { x0: 18, y0: 26, w: 212, h: 76, t: 14 };
  out.push(`<!-- The plan: a solid blue tray of three slots, in order -->`);
  // slot three: only its place is marked (it can wait)
  const slot3 = `<rect x="${162 - T.x0}" y="10" width="56" height="56" rx="7" fill="none" stroke="${B[200]}" stroke-width="1.4" stroke-dasharray="5 4" ${NS}/>`;
  out.push(floorBox({ ...T, r: 12, sides: [B[600], B[700]], face: B[500], stroke: B[600], sw: 1.2, extraFace: slot3 }));
  const bh = 72, by0 = T.y0 + 10, z0 = T.t;
  // block one: the one to build first, lime
  out.push(`<!-- Block one: build this first (lime) -->`);
  out.push(floorBox({ x0: 30, y0: by0, w: 56, h: 56, r: 7, z0, t: bh, sides: [LIME, LIME_D], face: LIME, stroke: LIME_D, sw: 1.4 }));
  // block two: next, planned but not built: pale and dashed
  out.push(`<!-- Block two: next, still a pale dashed plan -->`);
  {
    let s = floorBox({ x0: 96, y0: by0, w: 56, h: 56, r: 7, z0, t: bh, sides: [B[50], B[100]], face: B[50], stroke: B[300], sw: 1.4 });
    s = s.replace(/stroke="#8AA5FF" stroke-width="1.4"/g, 'stroke="#8AA5FF" stroke-width="1.4" stroke-dasharray="5 4"');
    out.push(s);
  }
  // the Tcules person, at the front of the tray, pointing at block one
  const pw = pawn(40, 124, true, true);
  const target = P(48, by0 + 56, z0 + 30);
  out.push(`<!-- The Tcules person points to the one to build first -->`);
  out.push(pw.svg);
  out.push(arm(pw.shoulder, target));
  console.error('first arm', f(len(pw.shoulder, target)));
  writeFileSync(`${DIR}/what-to-build-first.svg`, svg(
    'Isometric drawing: on a dotted floor, a solid blue tray has three slots in a row. The first holds a lime block, the second only a pale dashed block, and the third is just a dashed outline. A Tcules person stands at the front and points to the lime block: build this first.',
    out.join('\n')));
}

// ======================= 3 · Design that pays back =======================
{
  const out = [floor('wt-payback-dots')];
  const C = { x0: 30, y0: 136, w: 80, h: 84, t: 7 };
  const card = `<rect x="30" y="9" width="40" height="14" rx="7" fill="${LIME}" stroke="${LIME_D}" stroke-width="1" ${NS}/>` +
    `<rect x="42" y="14.5" width="16" height="3" rx="1.5" fill="${INK}"/>` +
    `<rect x="10" y="31" width="60" height="22" rx="6" fill="${B[100]}"/>` +
    `<rect x="10" y="60" width="38" height="6" rx="3" fill="${B[500]}"/>` +
    `<rect x="10" y="72" width="50" height="5" rx="2.5" fill="${B[200]}"/>`;
  out.push(`<!-- The design decision: a white screen card on the floor, its lime button -->`);
  out.push(floorBox({ ...C, r: 8, sides: [B[100], B[200]], face: W, stroke: B[500], sw: 1.6, extraFace: card }));
  out.push(`<!-- The number it moves: three bars rising, the last solid blue -->`);
  const bx = 176, bw = 40;
  const bars = [
    { y0: 36, h: 188, blue: true },
    { y0: 90, h: 118 },
    { y0: 144, h: 62 },
  ];
  for (const b of bars) {
    out.push(b.blue
      ? floorBox({ x0: bx, y0: b.y0, w: bw, h: bw, r: 6, t: b.h, sides: [B[600], B[700]], face: B[500], stroke: B[600], sw: 1.2 })
      : floorBox({ x0: bx, y0: b.y0, w: bw, h: bw, r: 6, t: b.h, sides: [B[100], B[200]], face: W, stroke: B[500], sw: 1.6 }));
  }
  const from = P(C.x0 + 70, C.y0 + 16, C.t);
  const to = P(bx + 1.8, 36 + bw - 1.8, 188); // the blue bar's top, at its near-left corner
  out.push(`<!-- A dashed line ties the button to the top of the bar it should move -->`);
  out.push(`<path d="M${pts([from, to])}" stroke="${B[500]}" stroke-width="1.4" stroke-dasharray="4 4" stroke-linecap="round"/><circle cx="${f(to[0])}" cy="${f(to[1])}" r="4" fill="${B[500]}" stroke="${W}" stroke-width="1.6"/>`);
  console.error('payback line', from.map(f), to.map(f));
  writeFileSync(`${DIR}/design-that-pays-back.svg`, svg(
    'Isometric drawing: on a dotted floor, a white design screen with a lime button lies at the front. A dashed line runs from that button to the top of the tallest of three rising bars, which is solid blue.',
    out.join('\n')));
}
