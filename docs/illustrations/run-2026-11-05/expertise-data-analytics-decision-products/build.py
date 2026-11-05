#!/usr/bin/env python3
"""Hero for /expertise/data-analytics-decision-products. Run: python3 build.py (writes hero.svg beside it).

World coords: x runs right-down, y runs left-down, z up. P() is the family's 2:1 iso, the same
matrix(0.9 0.45 -0.9 0.45) the healthtech floor uses.
"""
import math, os

B5, B6, B7, B3, B2, B1, B05 = '#0048FF', '#003EE0', '#0031B0', '#8AA5FF', '#B8C8FF', '#DBE4FF', '#EEF2FF'
W, LIME, LIMED, INK = '#FFFFFF', '#D7F04A', '#A1B71F', '#1B1B18'
PFX = 'da'

def P(x, y, z=0):
    return (0.9 * (x - y), 0.45 * (x + y) - z)

def pts(ps):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in ps)

def poly(ps, fill, stroke=B5, sw=1.6, extra=''):
    s = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{pts(ps)}" fill="{fill}"{s}{extra}/>'

out = []
A = out.append

# ---------- floor ----------
FW, FD, INS = 410, 360, 30
A(f'<defs><pattern id="{PFX}-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
  f'<circle cx="11" cy="11" r="1.6" fill="#0048FF" fill-opacity="0.38"/></pattern></defs>')
A('<!-- Floor: dotted, with a dashed edge and one soft inset that holds the tablet and the people -->')
A(f'<g transform="matrix(0.9 0.45 -0.9 0.45 0 0)"><rect width="{FW}" height="{FD}" fill="url(#{PFX}-dots)"/>'
  f'<rect width="{FW}" height="{FD}" fill="none" stroke="#0048FF" stroke-width="1.8" stroke-dasharray="10 8"/>'
  f'<rect x="{INS}" y="{INS}" width="{FW-2*INS}" height="{FD-2*INS}" fill="#0048FF" fill-opacity="0.07"/></g>')

# ---------- rounded slab (flat, extruded) ----------
def rrect_world(x0, y0, x1, y1, r, n=12, with_angle=False):
    """outline of a rounded rect in world xy; optionally with each point's outward normal angle."""
    out = []
    corners = [(x1 - r, y0 + r, -90), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90), (x0 + r, y0 + r, 180)]
    for cx, cy, a0 in corners:
        for i in range(n + 1):
            ad = a0 + 90 * i / n
            a = math.radians(ad)
            p = (cx + r * math.cos(a), cy + r * math.sin(a))
            out.append((p, ad) if with_angle else p)
    return out

def slab(x0, y0, x1, y1, r, z, t, top, side_y, side_x, stroke, sw=1.6):
    """A flat rounded slab, top at height z, thickness t: two side bands (+x, +y) and the top."""
    ring = rrect_world(x0, y0, x1, y1, r, with_angle=True)
    def band(lo, hi):
        sel = [p for p, a in ring if lo <= a <= hi]
        return [P(x, y, z) for x, y in sel] + [P(x, y, z - t) for x, y in reversed(sel)]
    return [poly(band(-45, 45), side_x, stroke, sw), poly(band(45, 135), side_y, stroke, sw),
            poly([P(x, y, z) for (x, y), a in ring], top, stroke, sw)]

# ---------- boxes ----------
def box(x0, y0, z0, w, d, h, top=W, fy_=W, fx_=B2, stroke=B5, sw=1.6):
    x1, y1, z1 = x0 + w, y0 + d, z0 + h
    return [
        poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], fy_, stroke, sw),
        poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], fx_, stroke, sw),
        poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], top, stroke, sw),
    ]

def flatrect(x0, y0, x1, y1, z, fill, stroke=None, sw=1.2, r=0):
    if r:
        ring = rrect_world(x0, y0, x1, y1, r, 6)
        return poly([P(x, y, z) for x, y in ring], fill, stroke, sw)
    return poly([P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)], fill, stroke, sw)

def flatbar(x0, y, x1, z, h, fill):
    """a text bar lying flat on a surface, running along x, h thick along y (rounded ends)."""
    a, b = P(x0, y, z), P(x1, y, z)
    # draw as a thick line in screen: run along x axis
    return (f'<path d="M{a[0]:.1f} {a[1]:.1f} L{b[0]:.1f} {b[1]:.1f}" stroke="{fill}" '
            f'stroke-width="{h}" stroke-linecap="round"/>')

# ---------- the tablet (hero object), lying flat ----------
TX0, TY0, TX1, TY1 = 124, 52, 372, 236
TZ, TT = 14, 14
A('<!-- The product: a solid blue tablet lying flat on the floor -->')
out += slab(TX0, TY0, TX1, TY1, 24, TZ, TT, B5, B7, B6, B6)
SX0, SY0, SX1, SY1 = TX0 + 15, TY0 + 15, TX1 - 15, TY1 - 15
A(flatrect(SX0, SY0, SX1, SY1, TZ, W, None, 0, r=12))

def line(a, b, stroke, sw, dash=None):
    d = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<path d="M{a[0]:.1f} {a[1]:.1f} L{b[0]:.1f} {b[1]:.1f}" fill="none" stroke="{stroke}" '
            f'stroke-width="{sw}" stroke-linecap="round"{d}/>')

def column(x0, y0, w, h, grow=0):
    """A bar standing on the screen. With grow, the part above h is the lime growth and the old top
    stays as a dashed rhombus at the seam, so the lime reads as added height."""
    x1, y1, z0, zs, zt = x0 + w, y0 + w, TZ, TZ + h, TZ + h + grow
    g = [poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, zs), P(x0, y1, zs)], W, None),
         poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, zs), P(x1, y0, zs)], B2, None)]
    if grow:
        g += [poly([P(x0, y1, zs), P(x1, y1, zs), P(x1, y1, zt), P(x0, y1, zt)], LIME, None),
              poly([P(x1, y0, zs), P(x1, y1, zs), P(x1, y1, zt), P(x1, y0, zt)], LIMED, None)]
    top = LIME if grow else W
    g.append(poly([P(x0, y0, zt), P(x1, y0, zt), P(x1, y1, zt), P(x0, y1, zt)], top, None))
    edges = [((x0, y1, z0), (x1, y1, z0)), ((x1, y1, z0), (x1, y0, z0)),
             ((x0, y1, z0), (x0, y1, zt)), ((x1, y1, z0), (x1, y1, zt)), ((x1, y0, z0), (x1, y0, zt)),
             ((x0, y0, zt), (x1, y0, zt)), ((x1, y0, zt), (x1, y1, zt)), ((x1, y1, zt), (x0, y1, zt)), ((x0, y1, zt), (x0, y0, zt))]
    d = ' '.join(f'M{P(*a)[0]:.1f} {P(*a)[1]:.1f} L{P(*b)[0]:.1f} {P(*b)[1]:.1f}' for a, b in edges)
    g.append(f'<path d="{d}" fill="none" stroke="{B5}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')
    if grow:
        r = [P(x0, y0, zs), P(x1, y0, zs), P(x1, y1, zs), P(x0, y1, zs)]
        g.append(f'<polygon points="{pts(r)}" fill="none" stroke="{B5}" stroke-width="1.2" stroke-dasharray="4 3" stroke-linejoin="round"/>')
    return g

# chart: four bars rising out of the screen along x; the first has grown and is now the tallest
BW = 38
CY0 = SY0 + 12
bars = [(SX0 + 12, 82), (SX0 + 64, 104), (SX0 + 116, 118), (SX0 + 168, 72)]
CHANGED, GROW = 0, 70
A('<!-- Baseline: runs along the front-bottom edges of the bars -->')
A(line(P(SX0 + 6, CY0 + BW, TZ), P(bars[-1][0] + BW + 8, CY0 + BW, TZ), B2, 2.4))
A('<!-- The chart: the first bar has grown since last time; the old top stays dashed, the growth is lime -->')
for i, (bx, h) in enumerate(bars):
    out += column(bx, CY0, BW, h, GROW if i == CHANGED else 0)

# the why row in front of the chart: a trend tile under the grown bar, then a title and a line of text
cbx = bars[CHANGED][0]
RY0, RY1 = CY0 + BW + 20, CY0 + BW + 82
RX0, RX1 = cbx - 6, SX1 - 8
A('<!-- What changed and why: a row on the screen, tied to the grown bar -->')
A(flatrect(RX0, RY0, RX1, RY1, TZ, B05, B5, 1.2, r=12))
T0, T1 = cbx + 1, cbx + BW - 1
TR0, TR1 = RY0 + 12, RY1 - 12
A(flatrect(T0, TR0, T1, TR1, TZ, B5, None, 0, r=7))
mid_y = (TR0 + TR1) / 2
tp = [P(T0 + 8, mid_y + 10, TZ), P(T0 + 17, mid_y + 1, TZ), P(T0 + 24, mid_y + 6, TZ), P(T1 - 7, mid_y - 10, TZ)]
A('<path d="M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in tp) + '" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
A(flatrect(T1 + 16, mid_y - 13, RX1 - 22, mid_y - 3, TZ, B5, None, 0, r=5))
A(flatrect(T1 + 16, mid_y + 5, RX1 - 70, mid_y + 13, TZ, B2, None, 0, r=4))

# connector: a dot centred on the lime front face, down that face, then forward along y to the tile's back edge
gx, gz = cbx + BW / 2, TZ + bars[CHANGED][1] + GROW / 2
c0, c1, c2 = P(gx, CY0 + BW, gz), P(gx, CY0 + BW, TZ), P(gx, TR0, TZ)
A(f'<path d="M{c0[0]:.1f} {c0[1]:.1f} L{c1[0]:.1f} {c1[1]:.1f} L{c2[0]:.1f} {c2[1]:.1f}" fill="none" stroke="{B5}" stroke-width="1.2" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"/>')
A(f'<circle cx="{c0[0]:.1f}" cy="{c0[1]:.1f}" r="3.2" fill="{B5}"/>')

# ---------- people: client pawns ----------
def pawn(wx, wy, arm_to=None, fill=W, edge=B5, mark=''):
    sx, sy = P(wx, wy, 0)
    body = (f'M{sx-18:.1f} {sy:.1f} V{sy-42:.1f} A18 18 0 0 1 {sx+18:.1f} {sy-42:.1f} V{sy:.1f} '
            f'A18 8.5 0 0 1 {sx-18:.1f} {sy:.1f} Z')
    g = [f'<path d="{body}" fill="{fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>',
         f'<circle cx="{sx:.1f}" cy="{sy-78:.1f}" r="13" fill="{fill}" stroke="{edge}" stroke-width="1.6"/>']
    if arm_to:
        ax, ay = sx + 8, sy - 30
        dx, dy = arm_to[0] - ax, arm_to[1] - ay
        L = math.hypot(dx, dy); k = 30 / L
        hx, hy = ax + dx * k, ay + dy * k
        mid = f'{PFX}-arm{len(out)}'
        g.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-800" y="-600" width="1800" height="1400">'
                 f'<rect x="-800" y="-600" width="1800" height="1400" fill="#FFFFFF"/><path d="{body}" fill="#000000"/></mask>'
                 f'<g mask="url(#{mid})"><path d="M{ax:.1f} {ay:.1f} L{hx:.1f} {hy:.1f}" stroke="{B5}" stroke-width="8.5" stroke-linecap="round"/>'
                 f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="6.8" fill="{B5}"/></g>'
                 f'<path d="M{ax:.1f} {ay:.1f} L{hx:.1f} {hy:.1f}" stroke="#FFFFFF" stroke-width="5.3" stroke-linecap="round"/>'
                 f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="5.2" fill="#FFFFFF"/>')
    if mark:
        g.append(mark.format(x=sx, y=sy))
    return g

A('<!-- Two people from different teams read the same figure -->')
lime_pt = P(cbx + BW / 2, CY0 + BW, TZ + bars[CHANGED][1] + GROW / 2)
out += pawn(56, 238, arm_to=lime_pt)
out += pawn(178, 312, arm_to=lime_pt)

svg_body = '\n'.join(out)

# ---------- bounds: the floor's width, the content's height, widened to 3:2 ----------
pad = 6
minx, maxx = P(0, FD)[0] - pad, P(FW, 0)[0] + pad
top = min(P(b[0], CY0, TZ + b[1] + (GROW if i == CHANGED else 0))[1] for i, b in enumerate(bars)) - pad
bot = P(FW, FD)[1] + pad
w = maxx - minx
h = max(bot - top, w / 1.5)
cy = (top + bot) / 2
miny = cy - h / 2
vb = f'{minx:.0f} {miny:.0f} {w:.0f} {h:.0f}'
ALT = ('Isometric illustration for data and analytics product design. A solid blue tablet lies flat on a dotted floor, and a bar chart of four white bars rises out of its screen. The first bar has grown since last time: its old top is left as a dashed outline and the new height above it is lime, so it is now the tallest bar. A dashed line runs from that growth down the bar and across the screen to a large row beneath the chart, a rising-trend tile with a title and a line of text, that says what changed and why. Two people from different teams stand beside the tablet and point at the same lime growth.')
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{ALT}">\n'
       f'{svg_body}\n</svg>\n')
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, 'hero.svg'), 'w').write(svg)
print(vb)
