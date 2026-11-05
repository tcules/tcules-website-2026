#!/usr/bin/env python3
"""Hero for /expertise/data-analytics-decision-products. Run: python3 build.py (writes hero.svg beside it).

Round 8 (family fix): the bar chart stands on the floor as a physical object of its own, the product is a
separate open laptop, the people are at healthtech's scale and each touches what they read.

World coords are healthtech's: P(u, v, h) with u running right-down, v left-down, h up, on the same floor
(545 x 402, inset 45) and the same projection, so the two heroes share one floor and one scale.
"""
import math, os

B5, B6, B7, B3, B2, B1, B05 = '#0048FF', '#003EE0', '#0031B0', '#8AA5FF', '#B8C8FF', '#DBE4FF', '#EEF2FF'
W, LIME, LIMED = '#FFFFFF', '#D7F04A', '#A1B71F'
PFX = 'da'
E = os.environ.get


def P(u, v, h=0):
    return (-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h)


def f(n):
    return f'{n:.1f}'.rstrip('0').rstrip('.')


def pts(ps):
    return ' '.join(f'{f(x)},{f(y)}' for x, y in ps)


def poly(ps, fill, stroke=B5, sw=1.6):
    s = f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<polygon points="{pts(ps)}" fill="{fill}"{s}/>'


def path(ps, stroke, sw, dash=None, close=False):
    d = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in ps) + (' Z' if close else '')
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<path d="{d}" fill="none" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" '
            f'stroke-linejoin="round"{da}/>')


out = []
A = out.append

# ---------- floor: healthtech's, verbatim ----------
A(f'<defs><pattern id="{PFX}-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
  f'<circle cx="11" cy="11" r="1.6" fill="#0048FF" fill-opacity="0.38"/></pattern></defs>')
A('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects (healthtech\'s floor) -->')
A(f'<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="545" height="402" fill="url(#{PFX}-dots)"/>'
  f'<rect width="545" height="402" fill="none" stroke="#0048FF" stroke-width="1.8" stroke-dasharray="10 8"/>'
  f'<rect x="45" y="45" width="455" height="312" fill="#0048FF" fill-opacity="0.07"/></g>')


# ---------- solids ----------
def rring(u0, v0, u1, v1, r, n=8):
    ring = []
    for cu, cv, a0 in [(u1 - r, v0 + r, -90), (u1 - r, v1 - r, 0), (u0 + r, v1 - r, 90), (u0 + r, v0 + r, 180)]:
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            ring.append(((cu + r * math.cos(a), cv + r * math.sin(a)), a0 + 90 * i / n))
    return ring


def slab(u0, v0, u1, v1, r, h, t, top=W, side_v=W, side_u=B2, sw=1.6):
    """A rounded slab on the floor, top at height h, thickness t: the +u band, the +v band, then the top."""
    ring = rring(u0, v0, u1, v1, r)

    def band(lo, hi):
        sel = [p for p, a in ring if lo <= a <= hi]
        return [P(x, y, h) for x, y in sel] + [P(x, y, h - t) for x, y in reversed(sel)]
    return [poly(band(-45, 45), side_u, B5, sw), poly(band(45, 135), side_v, B5, sw),
            poly([P(x, y, h) for (x, y), a in ring], top, B5, sw)]


def flat(u0, v0, u1, v1, h, fill, stroke=None, sw=1.2, r=0):
    ring = [p for p, a in rring(u0, v0, u1, v1, r, 5)] if r else [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
    return poly([P(x, y, h) for x, y in ring], fill, stroke, sw)


# ---------- the chart: a physical bar chart standing on the floor ----------
CU0, CV0, CU1, CV1, CH = 40, int(E('CV0', '184')), 290, int(E('CV0', '184')) + 84, 12          # its plinth
BW, BD = 48, 50
BV0 = CV0 + 17                                          # bars stand 16 in from the plinth's back edge
BV1 = BV0 + BD
bars = [(CU0 + 14, 120), (CU0 + 74, 96), (CU0 + 134, 118), (CU0 + 194, 80)]
GROW = int(E('GROW', '100'))                             # the first bar's added height, in lime
A('<!-- The chart: a bar chart standing on the floor as an object, on a low plinth -->')
out += slab(CU0, CV0, CU1, CV1, 10, CH, CH)


def bar(u0, h, grow=0):
    u1, z0, zs, zt = u0 + BW, CH, CH + h, CH + h + grow
    g = [poly([P(u0, BV1, z0), P(u1, BV1, z0), P(u1, BV1, zs), P(u0, BV1, zs)], W, None),
         poly([P(u1, BV0, z0), P(u1, BV1, z0), P(u1, BV1, zs), P(u1, BV0, zs)], B2, None)]
    if grow:
        g += [poly([P(u0, BV1, zs), P(u1, BV1, zs), P(u1, BV1, zt), P(u0, BV1, zt)], LIME, None),
              poly([P(u1, BV0, zs), P(u1, BV1, zs), P(u1, BV1, zt), P(u1, BV0, zt)], LIMED, None)]
    g.append(poly([P(u0, BV0, zt), P(u1, BV0, zt), P(u1, BV1, zt), P(u0, BV1, zt)], LIME if grow else W, None))
    edges = [((u0, BV1, z0), (u1, BV1, z0)), ((u1, BV1, z0), (u1, BV0, z0)),
             ((u0, BV1, z0), (u0, BV1, zt)), ((u1, BV1, z0), (u1, BV1, zt)), ((u1, BV0, z0), (u1, BV0, zt)),
             ((u0, BV0, zt), (u1, BV0, zt)), ((u1, BV0, zt), (u1, BV1, zt)), ((u1, BV1, zt), (u0, BV1, zt)),
             ((u0, BV1, zt), (u0, BV0, zt))]
    d = ' '.join(f'M{f(P(*a)[0])} {f(P(*a)[1])} L{f(P(*b)[0])} {f(P(*b)[1])}' for a, b in edges)
    g.append(f'<path d="{d}" fill="none" stroke="{B5}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')
    if grow:  # the old top stays as a dashed rhombus at the seam, so the lime reads as added height
        g.append(f'<polygon points="{pts([P(u0, BV0, zs), P(u1, BV0, zs), P(u1, BV1, zs), P(u0, BV1, zs)])}" '
                 f'fill="none" stroke="{B5}" stroke-width="1.2" stroke-dasharray="4 3" stroke-linejoin="round"/>')
    return g


A('<!-- The first bar has grown since last time: the old top stays dashed, the growth is lime -->')
for i, (bu, h) in enumerate(bars):
    out += bar(bu, h, GROW if i == 0 else 0)

# ---------- the product: an open laptop, light body, dark blue screen ----------
LU0, LU1 = int(E('LU0', '384')), int(E('LU1', '524'))
LV0, LV1 = BV1, BV1 + 86                               # its hinge sits on the bars' front plane
LT = 8                                                  # deck thickness
SH = 150                                                # lid height
A('<!-- The product: an open laptop beside the chart, its screen facing the same way as the bars -->')
lid_x, lid_y = P(LU0, LV0, LT + SH)
lid_w = LU1 - LU0
ECHO = E('ECHO', '1') == '1'                          # the why tile echoes the growth in lime, no connector
TILE, TILE_EDGE, MARK = (LIME, LIMED, '#1B1B18') if ECHO else (B5, B5, W)
RY = 44                                                 # the why row's top, in lid units
# the lid's thickness: a brandeis-200 copy set back behind it
A(f'<g transform="matrix(0.9 0.45 0 1 {f(lid_x + 5.4)} {f(lid_y - 2.7)})">'
  f'<rect width="{lid_w}" height="{SH}" rx="10" fill="{B2}" stroke="{B5}" stroke-width="1.6"/></g>')
A(f'<g transform="matrix(0.9 0.45 0 1 {f(lid_x)} {f(lid_y)})">'
  f'<rect width="{lid_w}" height="{SH}" rx="10" fill="{W}" stroke="{B5}" stroke-width="1.6"/>'
  f'<rect x="9" y="9" width="{lid_w - 18}" height="{SH - 16}" rx="6" fill="{B5}"/>'
  f'<rect x="22" y="24" width="44" height="7" rx="3.5" fill="{B2}"/>'
  f'<rect x="10" y="{RY}" width="{lid_w - 28}" height="44" rx="9" fill="{W}"/>'
  f'<rect x="28" y="{RY + 8}" width="28" height="28" rx="7" fill="{TILE}" stroke="{TILE_EDGE}" stroke-width="1.2"/>'
  f'<path d="M33 {RY + 29} l6 -7 l5 4 l8 -10" fill="none" stroke="{MARK}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
  f'<rect x="64" y="{RY + 12}" width="{lid_w - 92}" height="8" rx="4" fill="{B5}"/>'
  f'<rect x="64" y="{RY + 25}" width="{lid_w - 112}" height="7" rx="3.5" fill="{B2}"/>'
  f'<rect x="22" y="{RY + 58}" width="{lid_w - 70}" height="6" rx="3" fill="{B3}"/>'
  f'<rect x="22" y="{RY + 70}" width="{lid_w - 100}" height="6" rx="3" fill="{B3}"/>'
  f'</g>')
out += slab(LU0, LV0 + 2, LU1, LV1, 8, LT, LT)
A(flat(LU0 + 12, LV0 + 14, LU1 - 12, LV0 + 54, LT, B1, B5, 1.2, r=5))       # keyboard
A(flat(LU0 + 46, LV0 + 64, LU1 - 46, LV1 - 12, LT, B05, B5, 1.2, r=5))      # trackpad

# ---------- the connector (only without the echo): growth -> the why row on the screen ----------
if not ECHO:
    gu = bars[0][0] + BW / 2
    gz = CH + bars[0][1] + GROW * 0.6
    row_u = LU0 + 42 / 0.9 * 0.9                          # over the trend tile's centre
    c0 = P(gu, BV1, gz)
    c1 = P(row_u, BV1, gz)
    c2 = P(row_u, BV1, LT + SH - RY - 8)
    A('<!-- What changed, tied to why: a dashed line from the lime growth across and down onto the trend tile -->')
    A(path([c0, c1, c2], B5, 1.2, '4 4'))
    A(f'<circle cx="{f(c0[0])}" cy="{f(c0[1])}" r="3.2" fill="{B5}"/>')


# ---------- people (STYLE §5), healthtech's pawn and arm ----------
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8


def body_path(x, y):
    return (f'M{f(x - R)} {f(y)} V{f(y - H)} A{R} {R} 0 0 1 {f(x + R)} {f(y - H)} V{f(y)} '
            f'A{R} {f(R * 0.45)} 0 0 1 {f(x - R)} {f(y)} Z')


mask_n = [0]


def client_arm(x, y, frm, to):
    ax, ay, hx, hy = x + frm[0], y + frm[1], to[0], to[1]
    mid = f'{PFX}-arm{mask_n[0]}'
    mask_n[0] += 1
    return (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-600" y="-400" width="1200" height="1000">'
            f'<rect x="-600" y="-400" width="1200" height="1000" fill="{W}"/><path d="{body_path(x, y)}" fill="#000000"/></mask>'
            f'<g mask="url(#{mid})"><path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{B5}" stroke-width="{ARM}" stroke-linecap="round"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND)}" fill="{B5}"/></g>'
            f'<path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{W}" stroke-width="{f(ARM - 2 * OUT)}" stroke-linecap="round"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND - OUT)}" fill="{W}"/>')


def pawn(u, v, hand=None, side=1):
    x, y = P(u, v)
    s = [f'<path d="{body_path(x, y)}" fill="{W}" stroke="{B5}" stroke-width="1.6" stroke-linejoin="round"/>',
         f'<circle cx="{f(x)}" cy="{f(y - H - R - 4 - HEAD)}" r="{HEAD}" fill="{W}" stroke="{B5}" stroke-width="1.6"/>']
    if hand:
        s.append(client_arm(x, y, (8 * side, -H + 22), hand))
    return s


def num(k, d):
    return [float(n) for n in E(k).split(',')] if E(k) else d


def inv(x, y):
    """screen point -> floor (u, v)."""
    d, s_ = (x + 144) / 0.9, (y - 27) / 0.45
    return ((s_ + d) / 2, (s_ - d) / 2)


def stand_for(hand, vec):
    """where a pawn stands so its shoulder is one short arm (vec) from the hand."""
    sx, sy = hand[0] - vec[0], hand[1] - vec[1]
    return inv(sx - 8, sy + H - 22)


# the reader at the chart: a hand flat on the grown bar's front face, low enough to reach
face_hand = P(bars[0][0] + BW * float(E('BF', '0.7')), BV1, CH + float(E('BH', '40')))
PB = stand_for(face_hand, num('VB_', [30, -14]))
# the reader at the laptop: stands at the lid's left end, a hand on the why row
lid_hand = P(LU0 + float(E('LF', '12')), LV0, float(E('LH', '62')))
PA = stand_for(lid_hand, num('VA_', [34, -12]))
print('PB', [round(n) for n in PB], 'PA', [round(n) for n in PA])

A('<!-- Two people from different teams: one at the bar that grew, one at the screen that says why -->')
out += pawn(*PB, hand=face_hand)
out += pawn(*PA, hand=lid_hand)

svg_body = '\n'.join(out)

# ---------- bounds: the floor's width; top at the tallest thing ----------
pad = 6
minx, maxx = P(0, 402)[0] - pad, P(545, 0)[0] + pad
top = min(P(bars[0][0], BV0, CH + bars[0][1] + GROW)[1], P(LU0, LV0 - 6, LT + SH)[1]) - pad
bot = P(545, 402)[1] + pad
w = maxx - minx
h = max(bot - top, w / 1.5)
miny = (top + bot) / 2 - h / 2
vb = f'{minx:.0f} {miny:.0f} {w:.0f} {h:.0f}'
ALT = ('Isometric illustration for data and analytics product design. On a dotted floor a white bar chart stands '
       'as an object of its own, four bars on a low plinth. The first bar has grown since last time: its old top is '
       'left as a dashed outline and the new height above it is lime, so it is now the tallest bar. A dashed line runs '
       'from that growth across to an open laptop beside the chart, whose dark blue screen shows a row with a '
       'rising-trend tile and a title: what changed and why. Two people from different teams read the same figure, '
       'one with a hand on the bar that grew, the other with a hand on the row on the screen.')
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" role="img" aria-label="{ALT}">\n{svg_body}\n</svg>\n'
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, E('OUT', 'hero.svg')), 'w').write(svg)
print(vb, f'{w / h:.2f}')
