// Generator for the ClimateTech and energy hero.
//   node docs/illustrations/run-2026-11-05/expertise-climatetech-energy/gen.mjs
// World units: x runs down-right, y runs down-left, z is up. 2:1 isometric, as expertise.svg.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const C = {
  b500: '#0048FF', b600: '#003EE0', b700: '#0031B0', b300: '#8AA5FF', b200: '#B8C8FF',
  b100: '#DBE4FF', b50: '#EEF2FF', w: '#FFFFFF', lime: '#D7F04A', limeD: '#A1B71F',
};
const OX = 0, OY = 0;
const P = (x, y, z = 0) => [OX + 0.9 * (x - y), OY + 0.45 * (x + y) - z];
const f = (n) => Math.round(n * 10) / 10;
const pts = (a) => a.map(([x, y, z]) => P(x, y, z).map(f).join(',')).join(' ');
const bb = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
const grow = (sx, sy) => { bb.x0 = Math.min(bb.x0, sx); bb.y0 = Math.min(bb.y0, sy); bb.x1 = Math.max(bb.x1, sx); bb.y1 = Math.max(bb.y1, sy); };
const poly = (a, fill, stroke = C.b500, sw = 1.6) => {
  a.forEach(([x, y, z]) => grow(...P(x, y, z)));
  return `<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
};
// Box from (x0,y0) to (x1,y1), z from z0 to z1. Visible: front-left face (y=y1), right face (x=x1), top.
const box = (x0, y0, x1, y1, z0, z1, { left = C.w, right = C.b200, top = C.w, stroke = C.b500, sw = 1.6 } = {}) =>
  poly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], left, stroke, sw) +
  poly([[x1, y1, z0], [x1, y0, z0], [x1, y0, z1], [x1, y1, z1]], right, stroke, sw) +
  poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], top, stroke, sw);
// A group drawn in the front-left face plane (y = const): local x along world x, local y downwards (−z).
const faceL = (x, y, z, inner) => { const [sx, sy] = P(x, y, z); return `<g transform="matrix(0.9 0.45 0 1 ${f(sx)} ${f(sy)})">${inner}</g>`; };
const bar = (x, y, w, h, fill, op = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}"${op < 1 ? ` fill-opacity="${op}"` : ''}/>`;

const out = [];
const E = (k, d) => +(process.env[k] ?? d);

// ── Floor: healthtech's, the family standard (545 × 402 world, inset 45, dash 10/8 at 1.8) ──
const FW = 545, FH = 402;
{
  out.push(`<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->`);
  out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 0 0)"><rect width="${FW}" height="${FH}" fill="url(#cte-dots)"/><rect width="${FW}" height="${FH}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="45" y="45" width="${FW - 90}" height="${FH - 90}" fill="${C.b500}" fill-opacity="0.07"/></g>`);
  [[0, 0], [FW, 0], [FW, FH], [0, FH]].forEach(([x, y]) => grow(...P(x, y, 0)));
}

// ── Layout (world) ─────────────────────────────────────────────────
// The turbine leads at the front left; the battery stands on the feed in front of it; the feed runs on to a
// modest monitor at the back right, turns into its stand and climbs the neck into the screen.
const MON = { x0: E('MX0', 206), x1: E('MX1', 430), y0: E('MY', 150), y1: E('MY', 150) + 14, z0: E('MZ0', 16), z1: E('MZ0', 16) + E('MH', 150) };
// The monitor rests on a low console plinth (no neck), so its screen sits low enough for a pawn to reach.
const FOOT = { x0: MON.x0 + 26, x1: MON.x1 - 26, y0: MON.y0 - 8, y1: MON.y1 + 18, h: MON.z0 };
const NECK = { x: (MON.x0 + MON.x1) / 2 };
const TUR = { x: E('TX', 112), y: E('TY', 322), h: E('TH', 242), blade: E('TB', 96) };
const LINE_Y = TUR.y;
const BAT = { x0: E('BX', 236), x1: E('BX', 236) + 76, y0: LINE_Y - 27, y1: LINE_Y + 27, h: 56 };
const TURN = { x: NECK.x, y: LINE_Y };
const dashD = (a) => `M${a.map(([x, y, z]) => P(x, y, z).map(f).join(' ')).join(' L')}`;
const feed = (a) => `<path d="${dashD(a)}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="5 4" stroke-linecap="round" stroke-linejoin="round"/>`;
const node = (x, y, z, r = 4.6) => { const [sx, sy] = P(x, y, z); return `<circle cx="${f(sx)}" cy="${f(sy)}" r="${r}" fill="${C.b500}" stroke="${C.w}" stroke-width="1.6"/>`; };
// A chevron lying on the floor, pointing along +x (dir 'x') or −y (dir '-y'): the way the readings flow.
const chev = (x, y, dir) => {
  const a = dir === 'x' ? [[x - 6, y - 7], [x + 3, y], [x - 6, y + 7]] : [[x - 7, y + 6], [x, y - 3], [x + 7, y + 6]];
  return `<path d="${dashD(a.map(([u, v]) => [u, v, 0]))}" fill="none" stroke="${C.b500}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
};

// ── The wind turbine (as on the hub), the lead ─────────────────────
{
  out.push(`<!-- The wind turbine, the hub's object for energy, leads at the front left -->`);
  const [bx, by] = P(TUR.x, TUR.y, 0);
  const R = 28, r = 14;
  const topY = by - TUR.h;
  grow(bx - R, by + r + 8);
  out.push(`<path d="M${f(bx - R)} ${f(by)} v8 a${R} ${r} 0 0 0 ${2 * R} 0 v-8" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${R}" ry="${r}" fill="${C.b100}" stroke="${C.b500}" stroke-width="1.6"/>`);
  out.push(`<path d="M${f(bx - 10)} ${f(by)} L${f(bx - 5)} ${f(topY)} H${f(bx + 5)} L${f(bx + 10)} ${f(by)} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(box(TUR.x - 6, TUR.y - 18, TUR.x + 6, TUR.y + 7, TUR.h - 6, TUR.h + 6, { left: C.w, right: C.b200, top: C.b100 }));
  const [hx, hy] = P(TUR.x, TUR.y + 7, TUR.h);
  const L = TUR.blade, angs = [-90, 30, 150];
  angs.forEach((a) => {
    const t = (a * Math.PI) / 180, n = t + Math.PI / 2;
    const tip = [hx + L * Math.cos(t), hy + L * Math.sin(t)];
    const s1 = [hx + 24 * Math.cos(t) + 8 * Math.cos(n), hy + 24 * Math.sin(t) + 8 * Math.sin(n)];
    const s2 = [hx + 4 * Math.cos(t) - 3.5 * Math.cos(n), hy + 4 * Math.sin(t) - 3.5 * Math.sin(n)];
    const s0 = [hx + 4 * Math.cos(t) + 4.5 * Math.cos(n), hy + 4 * Math.sin(t) + 4.5 * Math.sin(n)];
    grow(...tip);
    out.push(`<path d="M${f(s2[0])} ${f(s2[1])} L${f(s0[0])} ${f(s0[1])} L${f(s1[0])} ${f(s1[1])} L${f(tip[0])} ${f(tip[1])} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  });
  out.push(`<circle cx="${f(hx)}" cy="${f(hy)}" r="8" fill="${C.b500}" stroke="${C.w}" stroke-width="1.6"/>`);
}

// ── The feed: turbine → battery → the monitor's stand → up into the screen ──
{
  out.push(`<!-- Feed: one line from the turbine, through the battery, into the monitor -->`);
  out.push(feed([[TUR.x + 30, LINE_Y, 0], [BAT.x0, LINE_Y, 0]]));
  out.push(feed([[BAT.x1, LINE_Y, 0], [TURN.x, TURN.y, 0], [TURN.x, FOOT.y1, 0], [TURN.x, FOOT.y1, FOOT.h / 2]]));
  out.push(chev(TURN.x, TURN.y - 34, '-y'));
  out.push(chev(TURN.x, FOOT.y1 + 40, '-y'));
  out.push(node(TUR.x + 30, LINE_Y, 0));
  out.push(node(TURN.x, TURN.y, 0, 3.6));
}

// ── The battery (storage), on the feed ─────────────────────────────
{
  out.push(`<!-- Storage: a battery block on the feed, a charge gauge on the front and a bolt on its side -->`);
  const { x0, x1, y0, y1, h } = BAT;
  out.push(box(x0, y0, x1, y1, 0, h, { left: C.w, right: C.b200, top: C.b100 }));
  [[x0 + 20, y0 + 27], [x1 - 20, y0 + 27]].forEach(([x, y]) => {
    const [sx, sy] = P(x, y, h);
    out.push(`<path d="M${f(sx - 8)} ${f(sy)} v-7 a8 4 0 0 1 16 0 v7 a8 4 0 0 1 -16 0 Z" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="${f(sx)}" cy="${f(sy - 7)}" rx="8" ry="4" fill="${C.w}" stroke="${C.b500}" stroke-width="1.4"/>`);
  });
  const fw = x1 - x0, gw = fw - 28, gh = h * 0.36;
  out.push(faceL(x0, y1, h, `<rect x="14" y="${f(h * 0.32)}" width="${gw}" height="${f(gh)}" rx="${f(gh / 2)}" fill="${C.w}" stroke="${C.b500}" stroke-width="1.4"/><rect x="18" y="${f(h * 0.32 + 4)}" width="${f(gw * 0.66)}" height="${f(gh - 8)}" rx="${f((gh - 8) / 2)}" fill="${C.b500}"/>`));
  const fd = y1 - y0;
  const [rx, ry] = P(x1, y1, h);
  const cx = fd / 2, cy = h / 2;
  const bolt = `M${f(cx + 3)} ${f(cy - 15)} L${f(cx - 7)} ${f(cy + 2)} L${f(cx - 0.5)} ${f(cy + 2)} L${f(cx - 3)} ${f(cy + 15)} L${f(cx + 7)} ${f(cy - 2)} L${f(cx + 0.5)} ${f(cy - 2)} Z`;
  out.push(`<g transform="matrix(0.9 -0.45 0 1 ${f(rx)} ${f(ry)})"><path d="${bolt}" fill="${C.b500}" stroke="${C.b500}" stroke-width="1" stroke-linejoin="round"/></g>`);
  out.push(node(x1, LINE_Y, 0));
}

// ── The monitor: light body, blue screen, on a stand ───────────────
let CHART = null;
{
  out.push(`<!-- The energy product: a light monitor with a blue screen on a low console; the feed ends in a port on its front -->`);
  out.push(box(FOOT.x0, FOOT.y0, FOOT.x1, FOOT.y1, 0, FOOT.h, { left: C.w, right: C.b200, top: C.b100 }));
  out.push(node(TURN.x, FOOT.y1, FOOT.h / 2, 4.2));
  out.push(box(MON.x0, MON.y0, MON.x1, MON.y1, MON.z0, MON.z1, { left: C.w, right: C.b200, top: C.b100 }));
  const W = MON.x1 - MON.x0, H = MON.z1 - MON.z0;
  const pad = 10;
  const sw = W - pad * 2, sh = H - pad * 2;
  const cardX = 10, cardY = 10, cardW = sw - 20, cardH = sh - 20;
  const L0 = cardX + 22, L1 = cardX + cardW - 18;
  const gx = (t) => L0 + t * (L1 - L0);
  const base = cardY + cardH - 26;
  const k = (cardH - 52) / 100;
  const yv = (v) => base - v * k;
  const DS = E('DS', 0.55);
  const day = [[0, 18], [0.12, 12], [0.24, 32], [0.34, 46], [0.44, 32], [0.56, 42]].map(([t, v]) => [t, v * DS]);
  const PK = E('PK', 0.84), PV = E('PV', 92);
  const fc = [[0.56, 42 * DS], [0.7, 52 * DS], [PK, PV], [Math.min(0.99, PK + 0.09), PV - 14], [1, 56]];
  const targetV = E('TV', 46);
  const TSTART = cardX + E('TE', 8); // the target starts at the card's left edge, where the designer's hand rests
  const smooth = (a) => a.map(([t, v], i) => {
    const x = gx(t), y = yv(v);
    if (!i) return `M${f(x)} ${f(y)}`;
    const [pt, pv] = a[i - 1], px = gx(pt), py = yv(pv), mx = (px + x) / 2;
    return `C${f(mx)} ${f(py)} ${f(mx)} ${f(y)} ${f(x)} ${f(y)}`;
  }).join(' ');
  const nowX = gx(0.56), nowY = yv(42 * DS);
  const peak = [gx(PK), yv(PV)];
  const area = `${smooth(day)} L${f(nowX)} ${f(base)} L${f(gx(0))} ${f(base)} Z`;
  const gyy = base + 13;
  const sun = (cx, cy) => {
    const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `M${f(cx + 7 * Math.cos(a))} ${f(cy + 7 * Math.sin(a))} L${f(cx + 9.5 * Math.cos(a))} ${f(cy + 9.5 * Math.sin(a))}`; }).join(' ');
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="4" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.2"/><path d="${rays}" stroke="${C.b500}" stroke-width="1.2" stroke-linecap="round"/>`;
  };
  const moon = (cx, cy) => `<path d="M${f(cx + 1.6)} ${f(cy - 6)} A6 6 0 1 0 ${f(cx + 5.6)} ${f(cy + 2.8)} A4.8 4.8 0 0 1 ${f(cx + 1.6)} ${f(cy - 6)} Z" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.2" stroke-linejoin="round"/>`;
  const grid = [32, 96].map((v) => `<path d="M${f(gx(0) - 6)} ${f(yv(v))} H${f(gx(1) + 6)}" stroke="${C.b100}" stroke-width="1.2" stroke-linecap="round"/>`).join('');
  const inner = [
    `<rect x="${pad}" y="${pad}" width="${sw}" height="${sh}" rx="10" fill="${C.b500}" stroke="${C.b600}" stroke-width="1.2"/>`,
    `<g transform="translate(${pad} ${pad})">`,
    `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="8" fill="${C.w}"/>`,
    bar(cardX + 14, cardY + 11, 46, 7, C.b500),
    grid,
    `<path d="M${f(gx(0) - 6)} ${f(base)} H${f(gx(1) + 6)}" stroke="${C.b200}" stroke-width="1.2" stroke-linecap="round"/>`,
    `<path d="${area}" fill="${C.b100}"/>`,
    `<path d="M${f(TSTART)} ${f(yv(targetV))} H${f(gx(1) + 6)}" stroke="${C.lime}" stroke-width="3.6" stroke-linecap="round"/>`,
    `<path d="${smooth(fc)}" fill="none" stroke="${C.b500}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="butt"/>`,
    `<path d="${smooth(day)}" fill="none" stroke="${C.b500}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M${f(nowX)} ${f(yv(86))} V${f(base)}" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="2 4" stroke-linecap="round"/>`,
    `<circle cx="${f(nowX)}" cy="${f(nowY)}" r="4" fill="${C.w}" stroke="${C.b500}" stroke-width="2"/>`,
    `<circle cx="${f(peak[0])}" cy="${f(peak[1])}" r="10" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-dasharray="2 3" stroke-linecap="round"/>`,
    sun(gx(0), gyy), moon(gx(1), gyy),
    `</g>`,
  ].join('');
  out.push(faceL(MON.x0, MON.y1, MON.z1, inner));
  const [ox, oy] = P(MON.x0, MON.y1, MON.z1);
  const toS = ([u, v]) => [ox + 0.9 * (u + pad), oy + 0.45 * (u + pad) + v + pad];
  CHART = { peak: toS(peak), ring: 10, right: P(MON.x1, MON.y1, MON.z0), targetStart: toS([TSTART, yv(targetV)]) };
}

// ── The Tcules designer, at the screen, a hand on the lime target ──
{
  out.push(`<!-- A Tcules designer stands at the screen, a short arm and a hand on the lime target -->`);
  // the hand lands just below the dotted ring on tonight's peak, so the ring stays readable
  // §5: a short arm from the shoulder. The hand rests on the right end of the lime target, the level the
  // forecast must stay under; the figure stands at the screen's right edge, its shoulder a short reach away.
  const hxT = CHART.targetStart[0] + E('HDX', 0), hyT = CHART.targetStart[1] + E('HDY', 0);
  const REACH = [E('RX', 26), E('RY', 24)];
  const px = hxT - REACH[0] - 6, py = hyT + REACH[1] + 56;
  const wx = (px / 0.9 + py / 0.45) / 2, wy = (py / 0.45 - px / 0.9) / 2;
  console.log('figure world', f(wx), f(wy));
  const rw = 22, top = py - 62;
  const sx = px + 6, sy = top + 6, ex = hxT, ey = hyT;
  console.log('arm length', f(Math.hypot(ex - sx, ey - sy)), 'hand', f(ex), f(ey), 'figure', f(px), f(py));
  const bodyD = `M${f(px - rw)} ${f(py)} V${f(top)} A${rw} ${rw} 0 0 1 ${f(px + rw)} ${f(top)} V${f(py)} Z`;
  const armD = `M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}`;
  const EW = 2, AW = 10, HR = 8, HD = 16;
  out.push(`<path d="${bodyD}" fill="${C.w}" stroke="${C.w}" stroke-width="${2 * EW}" stroke-linejoin="round"/>`);
  out.push(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rw + EW}" ry="${9.9 + EW}" fill="${C.w}"/>`);
  out.push(`<circle cx="${f(px)}" cy="${f(top - 42)}" r="${HD + EW}" fill="${C.w}"/>`);
  out.push(`<path d="${armD}" stroke="${C.w}" stroke-width="${AW + 2 * EW}" stroke-linecap="round"/>`);
  out.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${HR + EW}" fill="${C.w}"/>`);
  out.push(`<path d="${bodyD}" fill="${C.b500}"/>`);
  out.push(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rw}" ry="9.9" fill="${C.b500}"/>`);
  out.push(`<circle cx="${f(px)}" cy="${f(top - 42)}" r="${HD}" fill="${C.b500}"/>`);
  out.push(`<path d="${armD}" stroke="${C.b500}" stroke-width="${AW}" stroke-linecap="round"/>`);
  out.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${HR}" fill="${C.b500}"/>`);
  grow(px - rw, top - 60); grow(px + rw, py + 12);
}

const m = 6;
const vb = [Math.floor(bb.x0 - m), Math.floor(bb.y0 - m), Math.ceil(bb.x1 - bb.x0 + 2 * m), Math.ceil(bb.y1 - bb.y0 + 2 * m)];
const alt = 'Isometric illustration for ClimateTech and energy product design. A white wind turbine, as on the expertise hub, stands on a dotted floor. One dashed line runs from its foot through a battery with a charge gauge and a lightning bolt, then on, with arrows, into a port on the low console of a monitor with a blue screen. The screen holds one day chart running from a sun to a moon: a solid line of measured readings stops at a now marker, and a dashed forecast climbs over a flat lime target line to a peak tonight, ringed in dots. A solid blue Tcules designer stands at the screen with a short arm raised, a hand resting on the lime target.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${alt}">
<defs><pattern id="cte-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b300}"/></pattern></defs>
${out.join('\n')}
</svg>
`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'hero.svg'), svg);
console.log('viewBox', vb.join(' '), 'ratio', (vb[2] / vb[3]).toFixed(2));
