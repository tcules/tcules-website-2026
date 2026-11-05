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
const FIG = { x: +(process.env.FX || 422), y: +(process.env.FY || 140) };

// ── Floor ──────────────────────────────────────────────────────────
const FX0 = -40, FY0 = 64, FW = 600, FH = 256;
{
  const [sx, sy] = P(FX0, FY0, 0);
  out.push(`<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->`);
  out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${f(sx)} ${f(sy)})"><rect width="${FW}" height="${FH}" fill="url(#cte-dots)"/><rect width="${FW}" height="${FH}" fill="none" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="6 5"/><rect x="40" y="40" width="${FW - 80}" height="${FH - 64}" fill="${C.b50}"/></g>`);
  [[FX0, FY0], [FX0 + FW, FY0], [FX0 + FW, FY0 + FH], [FX0, FY0 + FH]].forEach(([x, y]) => grow(...P(x, y, 0)));
}

// ── Layout (world) ─────────────────────────────────────────────────
// The monitor stands at the back; the turbine to its left; a battery in front; the designer at front right.
const MON = { x0: 170, x1: 560, y0: 92, y1: 114, z0: 14, z1: 236 };
const TUR = { x: 56, y: 186, h: 246 };
const BAT = { x0: 0, x1: 86, y0: 238, y1: 292, h: 58 };
const PORT = { x: MON.x0 + 34, y: MON.y1 + 14 };          // where the one feed enters the display's plinth
const JOIN = { x: PORT.x, y: TUR.y };                      // where the battery's feed meets the turbine's
const dashD = (a) => `M${a.map(([x, y, z]) => P(x, y, z).map(f).join(' ')).join(' L')}`;
const feed = (a) => `<path d="${dashD(a)}" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"/>`;
const node = (x, y, z, r = 4.2) => { const [sx, sy] = P(x, y, z); return `<circle cx="${f(sx)}" cy="${f(sy)}" r="${r}" fill="${C.b500}" stroke="${C.w}" stroke-width="1.4"/>`; };

// ── The monitor: light body, blue screen ───────────────────────────
let CHART = null; // screen-space points the designer needs
{
  out.push(`<!-- The energy product: a light monitor with a blue screen -->`);
  out.push(box(MON.x0 - 12, MON.y0 - 12, MON.x1 + 12, MON.y1 + 14, 0, MON.z0, { left: C.w, right: C.b200, top: C.b100 }));
  // the port where the feed enters, on the plinth's front face
  out.push(faceL(PORT.x - 7, PORT.y, MON.z0 - 3, `<rect x="0" y="0" width="14" height="8" rx="3" fill="${C.b500}"/>`));
  out.push(box(MON.x0, MON.y0, MON.x1, MON.y1, MON.z0, MON.z1, { left: C.w, right: C.b200, top: C.b100 }));
  const W = MON.x1 - MON.x0, H = MON.z1 - MON.z0;
  const pad = 14;
  const sw = W - pad * 2, sh = H - pad * 2;
  const cardX = 62, cardY = 14, cardW = sw - cardX - 14, cardH = sh - 28;
  const L0 = cardX + 30, L1 = cardX + cardW - 22;
  const gx = (t) => L0 + t * (L1 - L0);
  const base = cardY + cardH - 32;
  const yv = (v) => base - v;
  // A day of demand from sunrise to night: measured up to now, then the forecast climbs past the target to tonight's peak.
  const day = [[0, 18], [0.12, 12], [0.24, 32], [0.34, 46], [0.44, 32], [0.56, 42]];
  const fc = [[0.56, 42], [0.68, 54], [0.8, 94], [0.9, 82], [1, 48]];
  const targetV = 62;
  const smooth = (a) => a.map(([t, v], i) => {
    const x = gx(t), y = yv(v);
    if (!i) return `M${f(x)} ${f(y)}`;
    const [pt, pv] = a[i - 1], px = gx(pt), py = yv(pv), mx = (px + x) / 2;
    return `C${f(mx)} ${f(py)} ${f(mx)} ${f(y)} ${f(x)} ${f(y)}`;
  }).join(' ');
  // where the forecast crosses the target (sample the rising segment)
  let cross = null;
  for (let i = 1; i < fc.length && !cross; i++) {
    const [t0, v0] = fc[i - 1], [t1, v1] = fc[i];
    if (v0 < targetV && v1 >= targetV) {
      const x0 = gx(t0), x1 = gx(t1), mx = (x0 + x1) / 2;
      for (let k = 0; k <= 400; k++) {
        const u = k / 400, a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3;
        const X = a * x0 + b * mx + c * mx + d * x1, V = a * v0 + b * v0 + c * v1 + d * v1;
        if (V >= targetV) { cross = [X, yv(V)]; break; }
      }
    }
  }
  const nowX = gx(0.56), nowY = yv(42);
  const peak = [gx(0.8), yv(94)];
  const area = `${smooth(day)} L${f(nowX)} ${base} L${f(gx(0))} ${base} Z`;
  const gy = base + 17;
  const sun = (cx, cy) => {
    const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `M${f(cx + 8.5 * Math.cos(a))} ${f(cy + 8.5 * Math.sin(a))} L${f(cx + 11.5 * Math.cos(a))} ${f(cy + 11.5 * Math.sin(a))}`; }).join(' ');
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="5" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.4"/><path d="${rays}" stroke="${C.b500}" stroke-width="1.4" stroke-linecap="round"/>`;
  };
  const moon = (cx, cy) => `<path d="M${f(cx + 2)} ${f(cy - 7.5)} A7.5 7.5 0 1 0 ${f(cx + 7)} ${f(cy + 3.5)} A6 6 0 0 1 ${f(cx + 2)} ${f(cy - 7.5)} Z" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.4" stroke-linejoin="round"/>`;
  const grid = [20, 40, 80].map((v) => `<path d="M${f(gx(0) - 8)} ${yv(v)} H${f(gx(1) + 8)}" stroke="${C.b100}" stroke-width="1.2" stroke-linecap="round"/>`).join('');
  const inner = [
    `<rect x="${pad}" y="${pad}" width="${sw}" height="${sh}" rx="12" fill="${C.b500}" stroke="${C.b600}" stroke-width="1.2"/>`,
    `<g transform="translate(${pad} ${pad})">`,
    bar(14, 22, 34, 8, C.w),
    bar(14, 44, 28, 7, C.b300),
    `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" fill="${C.w}"/>`,
    bar(cardX + 18, cardY + 14, 62, 8, C.b500),
    grid,
    `<path d="M${f(gx(0) - 8)} ${base} H${f(gx(1) + 8)}" stroke="${C.b200}" stroke-width="1.4" stroke-linecap="round"/>`,
    `<path d="${area}" fill="${C.b100}"/>`,
    // target: one flat lime line across the day, level with the gridlines
    `<path d="M${f(gx(0) - 8)} ${yv(targetV)} H${f(gx(1) + 8)}" stroke="${C.lime}" stroke-width="3.6" stroke-linecap="round"/>`,
    `<path d="${smooth(fc)}" fill="none" stroke="${C.b500}" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="butt"/>`,
    `<path d="${smooth(day)}" fill="none" stroke="${C.b500}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M${f(nowX)} ${f(yv(84))} V${base}" stroke="${C.b500}" stroke-width="1.2" stroke-dasharray="2 4" stroke-linecap="round"/>`,
    `<circle cx="${f(nowX)}" cy="${f(nowY)}" r="4.5" fill="${C.w}" stroke="${C.b500}" stroke-width="2"/>`,
    // tonight's peak, over the target: a dotted focus ring
    `<circle cx="${f(peak[0])}" cy="${f(peak[1])}" r="12" fill="none" stroke="${C.b500}" stroke-width="1.6" stroke-dasharray="2 3" stroke-linecap="round"/>`,
    // the day axis: sunrise to night
    sun(gx(0), gy), moon(gx(1), gy),
    `</g>`,
  ].join('');
  out.push(faceL(MON.x0, MON.y1, MON.z1, inner));
  const [ox, oy] = P(MON.x0, MON.y1, MON.z1);
  const toS = ([u, v]) => [ox + 0.9 * (u + pad), oy + 0.45 * (u + pad) + v + pad];
  CHART = { cross: toS(cross), peak: toS(peak) };
}

// ── The wind turbine (as on the hub) ──────────────────────────────
{
  out.push(`<!-- The wind turbine, the hub's object for energy -->`);
  const [bx, by] = P(TUR.x, TUR.y, 0);
  const R = 24, r = 12;
  const topY = by - TUR.h;
  grow(bx - R, by + r + 7);
  out.push(`<path d="M${f(bx - R)} ${f(by)} v7 a${R} ${r} 0 0 0 ${2 * R} 0 v-7" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${R}" ry="${r}" fill="${C.b100}" stroke="${C.b500}" stroke-width="1.6"/>`);
  // the one feed: from the tower's foot along the floor to the display's port; the battery joins it on the way
  out.push(`<!-- Feed: turbine and battery, one line into the product -->`);
  out.push(feed([[TUR.x + 8, TUR.y, 0], [JOIN.x, JOIN.y, 0], [PORT.x, PORT.y, 0]]));
  out.push(feed([[BAT.x1, (BAT.y0 + BAT.y1) / 2, 0], [JOIN.x, (BAT.y0 + BAT.y1) / 2, 0], [JOIN.x, JOIN.y, 0]]));
  out.push(node(JOIN.x, JOIN.y, 0, 3.6));
  // tapered tower
  out.push(`<path d="M${f(bx - 9)} ${f(by)} L${f(bx - 4.5)} ${f(topY)} H${f(bx + 4.5)} L${f(bx + 9)} ${f(by)} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(node(TUR.x + 8, TUR.y, 0));
  // nacelle: a small iso box on the tower top, the rotor on its front face
  out.push(box(TUR.x - 5, TUR.y - 16, TUR.x + 5, TUR.y + 6, TUR.h - 5, TUR.h + 5, { left: C.w, right: C.b200, top: C.b100 }));
  const [hx, hy] = P(TUR.x, TUR.y + 6, TUR.h);
  const L = 110, angs = [-90, 30, 150];
  angs.forEach((a) => {
    const t = (a * Math.PI) / 180, n = t + Math.PI / 2;
    const tip = [hx + L * Math.cos(t), hy + L * Math.sin(t)];
    const s1 = [hx + 22 * Math.cos(t) + 7 * Math.cos(n), hy + 22 * Math.sin(t) + 7 * Math.sin(n)];
    const s2 = [hx + 4 * Math.cos(t) - 3 * Math.cos(n), hy + 4 * Math.sin(t) - 3 * Math.sin(n)];
    const s0 = [hx + 4 * Math.cos(t) + 4 * Math.cos(n), hy + 4 * Math.sin(t) + 4 * Math.sin(n)];
    grow(...tip);
    out.push(`<path d="M${f(s2[0])} ${f(s2[1])} L${f(s0[0])} ${f(s0[1])} L${f(s1[0])} ${f(s1[1])} L${f(tip[0])} ${f(tip[1])} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  });
  out.push(`<circle cx="${f(hx)}" cy="${f(hy)}" r="7" fill="${C.b500}" stroke="${C.w}" stroke-width="1.4"/>`);
}

// ── The battery (storage) ──────────────────────────────────────────
{
  out.push(`<!-- Storage: a battery block, a charge gauge on the front and a bolt on its side -->`);
  const { x0, x1, y0, y1, h } = BAT;
  out.push(box(x0, y0, x1, y1, 0, h, { left: C.w, right: C.b200, top: C.b100 }));
  [[x0 + 22, y0 + 27], [x1 - 22, y0 + 27]].forEach(([x, y]) => {
    const [sx, sy] = P(x, y, h);
    out.push(`<path d="M${f(sx - 8)} ${f(sy)} v-7 a8 4 0 0 1 16 0 v7 a8 4 0 0 1 -16 0 Z" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="${f(sx)}" cy="${f(sy - 7)}" rx="8" ry="4" fill="${C.w}" stroke="${C.b500}" stroke-width="1.4"/>`);
  });
  const fw = x1 - x0, gw = fw - 28, gh = h * 0.36;
  out.push(faceL(x0, y1, h, `<rect x="14" y="${f(h * 0.32)}" width="${gw}" height="${f(gh)}" rx="${f(gh / 2)}" fill="${C.w}" stroke="${C.b500}" stroke-width="1.4"/><rect x="18" y="${f(h * 0.32 + 4)}" width="${f(gw * 0.66)}" height="${f(gh - 8)}" rx="${f((gh - 8) / 2)}" fill="${C.b500}"/>`));
  // the bolt on the right face (plane x = x1; local x runs along −y)
  const fd = y1 - y0;
  const [rx, ry] = P(x1, y1, h);
  const cx = fd / 2, cy = h / 2;
  const bolt = `M${f(cx + 3)} ${f(cy - 15)} L${f(cx - 7)} ${f(cy + 2)} L${f(cx - 0.5)} ${f(cy + 2)} L${f(cx - 3)} ${f(cy + 15)} L${f(cx + 7)} ${f(cy - 2)} L${f(cx + 0.5)} ${f(cy - 2)} Z`;
  out.push(`<g transform="matrix(0.9 -0.45 0 1 ${f(rx)} ${f(ry)})"><path d="${bolt}" fill="${C.b500}" stroke="${C.b500}" stroke-width="1" stroke-linejoin="round"/></g>`);
  out.push(node(x1, (y0 + y1) / 2, 0));
}

// ── The Tcules designer, pointing where the forecast breaks the target ──
{
  out.push(`<!-- A Tcules designer points where tonight's forecast breaks the target -->`);
  const [hxT, hyT] = CHART.cross;
  const [px, py] = P(FIG.x, FIG.y, 0);
  const rw = 21, top = py - 68;
  const sx = px + 8, sy = top + 12, ex = hxT, ey = hyT;
  console.log('arm length', f(Math.hypot(ex - sx, ey - sy)), 'hand', f(ex), f(ey), 'figure', f(px), f(py));
  const bodyD = `M${f(px - rw)} ${f(py)} V${f(top)} A${rw} ${rw} 0 0 1 ${f(px + rw)} ${f(top)} V${f(py)} Z`;
  const armD = `M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}`;
  const E = 1.8, AW = 10, HR = 8, HD = 15;
  out.push(`<path d="${bodyD}" fill="${C.w}" stroke="${C.w}" stroke-width="${2 * E}" stroke-linejoin="round"/>`);
  out.push(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rw + E}" ry="${10 + E}" fill="${C.w}"/>`);
  out.push(`<circle cx="${f(px)}" cy="${f(top - 37)}" r="${HD + E}" fill="${C.w}"/>`);
  out.push(`<path d="${armD}" stroke="${C.w}" stroke-width="${AW + 2 * E}" stroke-linecap="round"/>`);
  out.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${HR + E}" fill="${C.w}"/>`);
  out.push(`<path d="${bodyD}" fill="${C.b500}"/>`);
  out.push(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rw}" ry="10" fill="${C.b500}"/>`);
  out.push(`<circle cx="${f(px)}" cy="${f(top - 37)}" r="${HD}" fill="${C.b500}"/>`);
  out.push(`<path d="${armD}" stroke="${C.b500}" stroke-width="${AW}" stroke-linecap="round"/>`);
  out.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="${HR}" fill="${C.b500}"/>`);
  grow(px - rw, top - 54);
}

const m = 6;
const vb = [Math.floor(bb.x0 - m), Math.floor(bb.y0 - m), Math.ceil(bb.x1 - bb.x0 + 2 * m), Math.ceil(bb.y1 - bb.y0 + 2 * m)];
const alt = 'Isometric illustration for ClimateTech and energy product design. A white wind turbine, as on the expertise hub, and a battery with a charge gauge and a lightning bolt feed one dashed line across a dotted floor into a port on a large energy display. Its blue screen holds one day chart running from a sun to a moon: a solid line of measured readings stops at a now marker, a dashed forecast climbs over a flat lime target line to a peak tonight, ringed in dots. A solid blue Tcules designer points at the spot where the forecast breaks the target.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${alt}">
<defs><pattern id="cte-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b300}"/></pattern></defs>
${out.join('\n')}
</svg>
`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'hero.svg'), svg);
console.log('viewBox', vb.join(' '), 'ratio', (vb[2] / vb[3]).toFixed(2));
