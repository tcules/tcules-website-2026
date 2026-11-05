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

// ── Floor ──────────────────────────────────────────────────────────
const FX0 = -40, FY0 = 30, FW = 650, FH = 400;
{
  const [sx, sy] = P(FX0, FY0, 0);
  out.push(`<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->`);
  out.push(`<g transform="matrix(0.9 0.45 -0.9 0.45 ${f(sx)} ${f(sy)})"><rect width="${FW}" height="${FH}" fill="url(#cte-dots)"/><rect width="${FW}" height="${FH}" fill="none" stroke="${C.b500}" stroke-width="1.8" stroke-dasharray="10 8"/><rect x="50" y="50" width="${FW - 100}" height="${FH - 100}" fill="${C.b500}" fill-opacity="0.07"/></g>`);
  [[FX0, FY0], [FX0 + FW, FY0], [FX0 + FW, FY0 + FH], [FX0, FY0 + FH]].forEach(([x, y]) => grow(...P(x, y, 0)));
}

// ── Layout (world) ─────────────────────────────────────────────────
// The monitor stands at the back; the turbine to its left; a battery in front; the designer at front right.
const MON = { x0: 150, x1: 570, y0: 90, y1: 112, z0: 14, z1: 300 };
const TUR = { x: 50, y: 190, h: 330 };
const BAT = { x0: 170, x1: 260, y0: 290, y1: 350, h: 70 };

// ── Connectors on the floor: turbine and battery feed the monitor ──
{
  const dash = (a) => `<path d="M${a.map(([x, y, z]) => P(x, y, z).map(f).join(' ')).join(' L')}" fill="none" stroke="${C.b500}" stroke-width="1.5" stroke-dasharray="5 5" stroke-linecap="round" stroke-linejoin="round"/>`;
  out.push(`<!-- Feeds: the turbine and the battery report to the product -->`);
  out.push(dash([[TUR.x + 26, TUR.y, 0], [MON.x0 + 30, TUR.y, 0], [MON.x0 + 30, MON.y1 + 14, 0]]));
  out.push(dash([[BAT.x1 - 20, BAT.y0, 0], [BAT.x1 - 20, MON.y1 + 14, 0]]));
}

// ── The monitor: light body, blue screen ───────────────────────────
{
  out.push(`<!-- The energy product: a light monitor with a blue screen -->`);
  // plinth on the floor
  out.push(box(MON.x0 - 12, MON.y0 - 12, MON.x1 + 12, MON.y1 + 14, 0, MON.z0, { left: C.w, right: C.b200, top: C.b100 }));
  // body
  out.push(box(MON.x0, MON.y0, MON.x1, MON.y1, MON.z0, MON.z1, { left: C.w, right: C.b200, top: C.b100 }));
  // screen content, on the front face
  const W = MON.x1 - MON.x0, H = MON.z1 - MON.z0;
  const pad = 14;
  const sw = W - pad * 2, sh = H - pad * 2;
  // The chart card fills most of the screen; a slim sidebar on the blue.
  const cardX = 84, cardY = 14, cardW = sw - cardX - 14, cardH = sh - 28;
  const L0 = cardX + 26, L1 = cardX + cardW - 22;           // chart x range (screen-local, inside pad group)
  const gx = (t) => L0 + t * (L1 - L0);
  const base = cardY + cardH - 40;                           // chart baseline
  const yv = (v) => base - v;                                // v = height above baseline
  // A day of demand: low overnight, a morning bump, measured up to now; the forecast climbs to tonight's peak.
  const day = [[0, 40], [0.1, 36], [0.2, 62], [0.3, 86], [0.4, 70], [0.5, 78], [0.58, 98]];
  const fc = [[0.58, 98], [0.68, 120], [0.78, 156], [0.86, 168], [0.94, 132], [1, 100]];
  const targetV = 136;
  const smooth = (a) => a.map(([t, v], i) => {
    const x = gx(t), y = yv(v);
    if (!i) return `M${f(x)} ${f(y)}`;
    const [pt, pv] = a[i - 1], px = gx(pt), py = yv(pv), mx = (px + x) / 2;
    return `C${f(mx)} ${f(py)} ${f(mx)} ${f(y)} ${f(x)} ${f(y)}`;
  }).join(' ');
  const nowX = gx(0.58), nowY = yv(98);
  const area = `${smooth(day)} L${f(nowX)} ${base} L${f(gx(0))} ${base} Z`;
  const inner = [
    `<rect x="${pad}" y="${pad}" width="${sw}" height="${sh}" rx="12" fill="${C.b500}" stroke="${C.b600}" stroke-width="1.2"/>`,
    `<g transform="translate(${pad} ${pad})">`,
    // sidebar on blue
    bar(16, 20, 44, 9, C.w, 0.95),
    bar(16, 46, 52, 7, C.w, 0.45),
    bar(16, 64, 40, 7, C.w, 0.45),
    bar(16, 82, 48, 7, C.w, 0.45),
    `<rect x="16" y="${sh - 46}" width="52" height="24" rx="12" fill="${C.b600}" stroke="${C.w}" stroke-opacity="0.5" stroke-width="1.2"/>`,
    // the chart card
    `<rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="10" fill="${C.w}"/>`,
    bar(cardX + 18, cardY + 18, 64, 8, C.b500, 0.9),
    // legend: measured (solid), forecast (dashed), target (lime)
    `<path d="M${L1 - 112} ${cardY + 22} h16" stroke="${C.b500}" stroke-width="3.4" stroke-linecap="round"/>`,
    `<path d="M${L1 - 78} ${cardY + 22} h22" stroke="${C.b500}" stroke-width="2.6" stroke-dasharray="5 4" stroke-linecap="butt"/>`,
    `<rect x="${L1 - 36}" y="${cardY + 18.5}" width="22" height="7" rx="3.5" fill="${C.lime}" stroke="${C.limeD}" stroke-width="1"/>`,
    // baseline
    `<path d="M${gx(0) - 8} ${base} H${gx(1) + 8}" stroke="${C.b200}" stroke-width="1.4" stroke-linecap="round"/>`,
    // measured: a solid line over a pale area
    `<path d="${area}" fill="${C.b100}"/>`,
    // target band
    `<rect x="${gx(0) - 8}" y="${yv(targetV) - 4}" width="${gx(1) - gx(0) + 16}" height="8" rx="4" fill="${C.lime}" stroke="${C.limeD}" stroke-width="1.1"/>`,
    // forecast (dashed)
    `<path d="${smooth(fc)}" fill="none" stroke="${C.b500}" stroke-width="2.6" stroke-dasharray="7 5" stroke-linecap="butt"/>`,
    `<path d="${smooth(day)}" fill="none" stroke="${C.b500}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`,
    // now marker
    `<path d="M${f(nowX)} ${cardY + 40} V${base}" stroke="${C.b500}" stroke-width="1.3" stroke-dasharray="2 4" stroke-linecap="round"/>`,
    `<circle cx="${f(nowX)}" cy="${f(nowY)}" r="5.5" fill="${C.w}" stroke="${C.b500}" stroke-width="2.6"/>`,
    // totals row under the chart
    bar(gx(0), base + 16, 60, 7, C.b200),
    bar(gx(0) + 80, base + 16, 60, 7, C.b200),
    bar(gx(0) + 160, base + 16, 60, 7, C.b200),
    `</g>`,
  ].join('');
  out.push(faceL(MON.x0, MON.y1, MON.z1, inner));
}

// ── The wind turbine (as on the hub, larger) ──────────────────────
{
  out.push(`<!-- The wind turbine, the hub's object for energy -->`);
  const [bx, by] = P(TUR.x, TUR.y, 0);
  const R = 24, r = 12;
  const topY = by - TUR.h;
  grow(bx - R, by + r);
  out.push(`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${R}" ry="${r}" fill="${C.b100}" stroke="${C.b500}" stroke-width="1.6"/>`);
  out.push(`<path d="M${f(bx - R)} ${f(by)} v7 a${R} ${r} 0 0 0 ${2 * R} 0 v-7" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  out.push(`<ellipse cx="${f(bx)}" cy="${f(by)}" rx="${R}" ry="${r}" fill="${C.b100}" stroke="${C.b500}" stroke-width="1.6"/>`);
  // tapered tower, shaded right half
  out.push(`<path d="M${f(bx - 9)} ${f(by)} L${f(bx - 4.5)} ${f(topY)} H${f(bx + 4.5)} L${f(bx + 9)} ${f(by)} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  // nacelle
  out.push(`<rect x="${f(bx - 9)}" y="${f(topY - 9)}" width="30" height="16" rx="7" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6"/>`);
  // blades: long slim triangles from the hub
  const L = 128, angs = [-90, 30, 150];
  const hx = bx - 6, hy = topY - 1;
  angs.forEach((a) => {
    const t = (a * Math.PI) / 180, n = t + Math.PI / 2;
    const tip = [hx + L * Math.cos(t), hy + L * Math.sin(t)];
    const s1 = [hx + 22 * Math.cos(t) + 7 * Math.cos(n), hy + 22 * Math.sin(t) + 7 * Math.sin(n)];
    const s0 = [hx + 6 * Math.cos(n) * 0.4, hy + 6 * Math.sin(n) * 0.4];
    const s2 = [hx - 3 * Math.cos(n), hy - 3 * Math.sin(n)];
    grow(...tip);
    out.push(`<path d="M${f(s2[0])} ${f(s2[1])} L${f(s1[0])} ${f(s1[1])} L${f(tip[0])} ${f(tip[1])} Z" fill="${C.w}" stroke="${C.b500}" stroke-width="1.6" stroke-linejoin="round"/>`);
  });
  out.push(`<circle cx="${f(hx)}" cy="${f(hy)}" r="7" fill="${C.b500}"/>`);
}

// ── The battery (storage) ──────────────────────────────────────────
{
  out.push(`<!-- Storage: a battery block with a charge mark -->`);
  const { x0, x1, y0, y1, h } = BAT;
  out.push(box(x0, y0, x1, y1, 0, h, { left: C.w, right: C.b200, top: C.b100 }));
  // terminals
  [[x0 + 22, y0 + 30], [x1 - 22, y0 + 30]].forEach(([x, y]) => {
    const [sx, sy] = P(x, y, h);
    out.push(`<path d="M${f(sx - 8)} ${f(sy)} v-7 a8 4 0 0 1 16 0 v7 a8 4 0 0 1 -16 0 Z" fill="${C.b200}" stroke="${C.b500}" stroke-width="1.4" stroke-linejoin="round"/><ellipse cx="${f(sx)}" cy="${f(sy - 7)}" rx="8" ry="4" fill="${C.w}" stroke="${C.b500}" stroke-width="1.4"/>`);
  });
  // charge level on the front face: three cells, two filled
  const fw = x1 - x0;
  const cells = [0, 1, 2].map((i) => `<rect x="${14 + i * ((fw - 28) / 3 + 0)}" y="${h * 0.32}" width="${(fw - 28) / 3 - 6}" height="${h * 0.4}" rx="3" fill="${i < 2 ? C.b500 : C.w}" stroke="${C.b500}" stroke-width="1.4"/>`).join('');
  out.push(faceL(x0, y1, h, cells));
}

// ── The Tcules designer, pointing at the target line ──────────────
{
  out.push(`<!-- A Tcules designer points at the target line -->`);
  const [px, py] = P(470, 230, 0);
  const rw = 17, top = py - 54;
  out.push(`<path d="M${f(px - rw)} ${f(py)} V${f(top)} A${rw} ${rw} 0 0 1 ${f(px + rw)} ${f(top)} V${f(py)} Z" fill="${C.b500}"/>`);
  out.push(`<ellipse cx="${f(px)}" cy="${f(py)}" rx="${rw}" ry="8" fill="${C.b500}"/>`);
  out.push(`<circle cx="${f(px)}" cy="${f(top - 30)}" r="12" fill="${C.b500}"/>`);
  const sx = px + 6, sy = top + 10, ex = px + 40, ey = top - 46;
  out.push(`<path d="M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}" stroke="${C.b500}" stroke-width="8" stroke-linecap="round"/>`);
  out.push(`<circle cx="${f(ex)}" cy="${f(ey)}" r="6.4" fill="${C.b500}"/>`);
  grow(px - rw, top - 42);
}

const m = 6;
const vb = [Math.floor(bb.x0 - m), Math.floor(bb.y0 - m), Math.ceil(bb.x1 - bb.x0 + 2 * m), Math.ceil(bb.y1 - bb.y0 + 2 * m)];
const alt = 'Isometric illustration for ClimateTech and energy product design. A white wind turbine, as on the expertise hub, and a battery block feed dashed lines into an energy product standing on a dotted floor: a light monitor whose blue screen holds one chart where a solid line of measured readings stops at a now marker, a dashed line carries the forecast on, and a lime band marks the target. A solid blue Tcules designer points at the chart.';
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" role="img" aria-label="${alt}">
<defs><pattern id="cte-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="${C.b500}" fill-opacity="0.38"/></pattern></defs>
${out.join('\n')}
</svg>
`;
const here = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(here, 'hero.svg'), svg);
console.log('viewBox', vb.join(' '), 'ratio', (vb[2] / vb[3]).toFixed(2));
