"""Generator for the /expertise/proptech-contech-field-operations hero. Run: python3 build.py (writes hero.svg).

Idea: from deal desk to building site, everyone works on one record of each property.
The hub's house stands on its lime tile; behind it rises the property's record (solid blue, the hero object).
A deal-desk laptop on the left and a site worker's phone on the right are both tied to that one record.

World: x runs right-down, y runs left-down, z is up. screen = (0.9x - 0.9y, 0.45x + 0.45y - z).
Upright faces facing +y use matrix(0.9 0.45 0 1); facing +x use matrix(0.9 -0.45 0 1) with u along -y.
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
PFX = "pt"

out, pts_all = [], []


def iso(x, y, z=0.0):
    return (0.9 * x - 0.9 * y, 0.45 * x + 0.45 * y - z)


def f(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def P(points):
    return " ".join(f"{f(a)},{f(b)}" for a, b in points)


def track(points):
    pts_all.extend(points)


def poly(points, fill, stroke=B500, sw=1.6, extra=""):
    track(points)
    out.append(f'<polygon points="{P(points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"{extra}/>')


def rr_outline(w, h, r, n=8):
    pts = []
    for cx, cy, a0 in ((w - r, r, -90), (w - r, h - r, 0), (r, h - r, 90), (r, r, 180)):
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


def hull(points):
    pts = sorted(set((round(a, 2), round(b, 2)) for a, b in points))
    if len(pts) < 3:
        return pts

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0:
            lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0:
            up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]


def face_y(x0, y0, ztop):
    """Upright face in the plane y = y0, facing +y; local u along +x, v down."""
    sx, sy = iso(x0, y0, ztop)
    return f"matrix(0.9 0.45 0 1 {f(sx)} {f(sy)})"


def flat(x0, y0, z):
    sx, sy = iso(x0, y0, z)
    return f"matrix(0.9 0.45 -0.9 0.45 {f(sx)} {f(sy)})"


def upright_slab(x0, y0, ztop, w, h, r, depth, top_fill, side_fill, edge):
    """Thickness of an upright rounded plate facing +y; thickness runs back along -y."""
    loc = rr_outline(w, h, r)

    def scr(u, v, dy):
        return iso(x0 + u, y0 - dy, ztop - v)

    allp = [scr(u, v, d) for (u, v) in loc for d in (0, depth)]
    right = [scr(u, v, d) for (u, v) in loc if u >= w - r - 0.01 for d in (0, depth)]
    track(allp)
    out.append(f'<polygon points="{P(hull(allp))}" fill="{top_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{P(hull(right))}" fill="{side_fill}"/>')


def box(x0, x1, y0, y1, z0, z1, top, front, right, stroke=B500):
    """A box: top, the +y face (front-left) and the +x face (front-right)."""
    poly([iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1)], front, stroke)
    poly([iso(x1, y1, z0), iso(x1, y0, z0), iso(x1, y0, z1), iso(x1, y1, z1)], right, stroke)
    poly([iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)], top, stroke)


def dashed(points, sw=1.2):
    track(points)
    d = "M" + " L".join(f"{f(a)} {f(b)}" for a, b in points)
    out.append(f'<path d="{d}" fill="none" stroke="{B500}" stroke-width="{sw}" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round"/>')


def dot(p, r=3.4):
    out.append(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="{r}" fill="{B500}"/>')


def tick(cx, cy, s, colour, sw):
    return (f'<path d="M{f(cx - 4.5*s)} {f(cy)} l{f(3.2*s)} {f(3.4*s)} l{f(6*s)} {f(-6.6*s)}" fill="none" '
            f'stroke="{colour}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>')


# ================================================================ floor
FX0, FY0, FW, FH = -258, -52, 520, 240
corners = [iso(FX0, FY0), iso(FX0 + FW, FY0), iso(FX0 + FW, FY0 + FH), iso(FX0, FY0 + FH)]
track(corners)
out.append("<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->")
out.append(
    f'<g transform="{flat(FX0, FY0, 0)}">'
    f'<rect width="{FW}" height="{FH}" fill="url(#{PFX}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="48" y="48" width="{FW - 96}" height="{FH - 96}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ geometry
# lime tile under the house (from the hub), deep enough at the back to carry the record's foot
TX0, TX1, TY0, TY1, TZ = -50, 172, -38, 160, 14
# the record: solid blue, upright, its foot on the tile's back edge, right of the roof where it shows
RX, RY, RW, RH, RD = -10, -22, 160, 184, 12
RZT = TZ + RH
# house
HX0, HX1, HY0, HY1 = -16, 108, 46, 140
HZ0, HW, HR = TZ, 66, 50
# laptop (deal desk): its lid in the record's plane, so its link runs straight along x
LX0, LW, LY, LDK = -232, 124, RY, 76
LH = 88
# site worker, front-right of the tile on the inset; scale 1.4 of the earlier pawn
WX, WY = 196, 120
K = 1.4

# ================================================================ connectors (drawn first: objects sit over them)
out.append("<!-- One record: the deal desk and the site both tie to it, along the iso axes -->")
LZ = 7 + LH * 0.72
la = iso(LX0 + LW, LY - 3, LZ)
dashed([la, iso(RX, RY - 3, LZ)])

# ================================================================ lime tile
out.append("<!-- The hub's lime tile -->")
box(TX0, TX1, TY0, TY1, 0, TZ, LIME, LIMED, LIMED, stroke=LIMED)

# ================================================================ the record (hero, solid blue)
out.append("<!-- The property's record: solid blue, standing on the back of the tile -->")
upright_slab(RX, RY, RZT, RW, RH, 14, RD, B600, B700, B600)
g = [f'<g transform="{face_y(RX, RY, RZT)}">']
g.append(f'<rect width="{RW}" height="{RH}" rx="14" fill="{B500}" stroke="{B600}" stroke-width="1.6"/>')
# title row: a small house mark and the title
g.append(f'<rect x="16" y="16" width="26" height="22" rx="5" fill="{WHITE}"/>'
         f'<path d="M22 29 l7 -6 l7 6 v5 h-14 Z" fill="{B500}"/>')
g.append(f'<rect x="52" y="18" width="72" height="9" rx="4.5" fill="{WHITE}"/>'
         f'<rect x="52" y="31" width="44" height="6" rx="3" fill="{WHITE}" fill-opacity="0.5"/>')
# map with the property's pin (as on the hub's card)
g.append(f'<rect x="16" y="48" width="{RW-32}" height="50" rx="8" fill="{WHITE}"/>'
         f'<path d="M28 88 L62 66 L98 80 L132 58" fill="none" stroke="{B100}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<path d="M80 54 c-7 0 -10.5 5 -10.5 10 c0 7 10.5 16 10.5 16 s10.5 -9 10.5 -16 c0 -5 -3.5 -10 -10.5 -10 Z" fill="{B500}"/>'
         f'<circle cx="80" cy="64" r="3.6" fill="{WHITE}"/>')
# sign-offs, each with its source; the middle source is a drawing (a plan), the third is still open
for i, yy in enumerate((119, 143, 167)):
    done = i < 2
    if done:
        g.append(f'<circle cx="28" cy="{yy}" r="9.5" fill="{WHITE}"/>' + tick(28, yy, 0.95, B500, 2.2))
    else:
        g.append(f'<circle cx="28" cy="{yy}" r="8.6" fill="none" stroke="{B200}" stroke-width="2"/>')
    g.append(f'<rect x="46" y="{yy-7}" width="{[64, 54, 60][i]}" height="7" rx="3.5" fill="{WHITE}" fill-opacity="{1 if done else 0.6}"/>'
             f'<rect x="46" y="{yy+3}" width="{[40, 44, 34][i]}" height="5" rx="2.5" fill="{WHITE}" fill-opacity="0.45"/>')
    sx = RW - 36
    if i == 1:
        # a drawing sheet: white, with a small floor plan in blue
        g.append(f'<rect x="{sx-3}" y="{yy-10}" width="24" height="20" rx="2.5" fill="{WHITE}"/>'
                 f'<path d="M{sx+1} {yy-6} h16 v12 h-16 Z M{sx+9} {yy-6} v7 M{sx+9} {yy+2} h8" fill="none" stroke="{B500}" stroke-width="1.2" stroke-linejoin="round"/>')
    else:
        op = 1 if done else 0.6
        g.append(f'<path d="M{sx} {yy-10} h11 l6 6 v14 h-17 Z" fill="none" stroke="{WHITE}" stroke-width="1.4" stroke-linejoin="round" stroke-opacity="{op}"/>'
                 f'<path d="M{sx+11} {yy-10} v6 h6" fill="none" stroke="{WHITE}" stroke-width="1.2" stroke-linejoin="round" stroke-opacity="{op}"/>')
g.append("</g>")
out.extend(g)

# ================================================================ the house (from the hub)
out.append("<!-- The house from the hub: white, gable end to the right, a blue door -->")
ym = (HY0 + HY1) / 2
zt = HZ0 + HW
poly([iso(HX0, HY1, HZ0), iso(HX1, HY1, HZ0), iso(HX1, HY1, zt), iso(HX0, HY1, zt)], WHITE)
poly([iso(HX1, HY1, HZ0), iso(HX1, HY0, HZ0), iso(HX1, HY0, zt), iso(HX1, ym, zt + HR), iso(HX1, HY1, zt)], B200)
OV = 6
poly([iso(HX0 - OV, HY1 + 4, zt - 2), iso(HX1 + OV, HY1 + 4, zt - 2), iso(HX1 + OV, ym, zt + HR), iso(HX0 - OV, ym, zt + HR)], WHITE)
poly([iso(HX1 + OV, HY1 + 4, zt - 2), iso(HX1 + OV, ym, zt + HR), iso(HX1 + OV, ym, zt + HR - 6), iso(HX1 + OV, HY1 + 4, zt - 8)], B100)
g = [f'<g transform="{face_y(HX0, HY1, zt)}">']
g.append(f'<rect x="20" y="26" width="21" height="40" rx="2" fill="{B500}"/>')
g.append(f'<rect x="60" y="18" width="44" height="26" rx="3" fill="{B50}" stroke="{B500}" stroke-width="1.6"/>'
         f'<path d="M82 18 V44" stroke="{B500}" stroke-width="1.2"/>')
g.append("</g>")
out.extend(g)
gc = iso(HX1, ym, zt + 16)
out.append(f'<g transform="matrix(0.9 -0.45 0 1 {f(gc[0])} {f(gc[1])})"><circle r="7" fill="{WHITE}" stroke="{B500}" stroke-width="1.4"/></g>')

# ================================================================ laptop (deal desk): light body, blue screen
out.append("<!-- The deal desk: a light laptop, its screen a deal pipeline with the property's card picked out -->")
box(LX0, LX0 + LW, LY, LY + LDK, 0, 7, WHITE, B100, B200)
g = [f'<g transform="{flat(LX0, LY, 7)}">']
g.append(f'<rect x="10" y="14" width="{LW-20}" height="{LDK-34}" rx="5" fill="{B50}" stroke="{B300}" stroke-width="1.2"/>'
         f'<rect x="{LW/2-16}" y="{LDK-16}" width="32" height="10" rx="3" fill="{B50}" stroke="{B300}" stroke-width="1.2"/>')
g.append("</g>")
out.extend(g)
upright_slab(LX0, LY, 7 + LH, LW, LH, 8, 6, B100, B200, B500)
g = [f'<g transform="{face_y(LX0, LY, 7 + LH)}">']
g.append(f'<rect width="{LW}" height="{LH}" rx="8" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
g.append(f'<rect x="7" y="7" width="{LW-14}" height="{LH-14}" rx="5" fill="{B500}"/>')
# kanban: three columns, a header bar each, pale cards; the property's card in white with the house mark
cols = [15, 49, 83]
g.append("".join(f'<rect x="{c}" y="15" width="16" height="4" rx="2" fill="{WHITE}" fill-opacity="0.8"/>' for c in cols))
cards = {15: [25, 43, 61], 49: [25], 83: [25, 43]}
for c, ys in cards.items():
    for cy_ in ys:
        g.append(f'<rect x="{c}" y="{cy_}" width="26" height="14" rx="3" fill="{B200}"/>')
g.append(f'<rect x="47" y="42" width="30" height="20" rx="4" fill="{WHITE}"/>'
         f'<path d="M51 54 l6 -5 l6 5 v5 h-12 Z" fill="{B500}"/>'
         f'<rect x="65" y="49" width="8" height="3" rx="1.5" fill="{B300}"/>')
g.append("</g>")
out.extend(g)
dot(la, 3.2)

# ================================================================ site worker: client pawn, hard hat, phone
out.append("<!-- On site: a client in a hard hat, the same record on a phone -->")
cx, cy = iso(WX, WY)
R, BH, HRAD = 18 * K, 46 * K, 13 * K
body = f"M{f(cx-R)} {f(cy)} V{f(cy-BH+R)} A{f(R)} {f(R)} 0 0 1 {f(cx+R)} {f(cy-BH+R)} V{f(cy)} A{f(R)} {f(8.5*K)} 0 0 1 {f(cx-R)} {f(cy)} Z"
hy = cy - BH - 18 * K
out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
out.append(f'<circle cx="{f(cx)}" cy="{f(hy)}" r="{f(HRAD)}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
# hard hat: dome, ridge and brim
HB = hy - 6 * K
out.append(f'<path d="M{f(cx-13.5*K)} {f(HB)} A{f(13.5*K)} {f(12*K)} 0 0 1 {f(cx+13.5*K)} {f(HB)} Z" fill="{B100}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
           f'<path d="M{f(cx)} {f(HB-12*K)} V{f(HB)}" stroke="{B500}" stroke-width="1.4"/>'
           f'<rect x="{f(cx-18.5*K)}" y="{f(HB-2.2)}" width="{f(37*K)}" height="5.6" rx="2.8" fill="{B100}" stroke="{B500}" stroke-width="1.6"/>')
# the phone, held out to the right in front of the body, facing +y like the record
PHW, PHH = 36, 60
PHX, PHY, PHZT = WX + 30, WY + 4, 108
ph = iso(PHX, PHY, PHZT)
track([ph, iso(PHX + PHW, PHY, PHZT - PHH)])
hx, hy2 = iso(PHX + 6, PHY, PHZT - PHH + 5)
sx0, sy0 = cx + 4, cy - BH + 22
AW, AC = 12.4, 9.2          # arm with its outline, and its light core (outline 1.6 each side)
HO, HC = 9.6, 8.0           # hand with its outline, and its light core
out.append(
    f'<mask id="{PFX}-arm" maskUnits="userSpaceOnUse" x="-700" y="-500" width="1600" height="1100">'
    f'<rect x="-700" y="-500" width="1600" height="1100" fill="#FFFFFF"/><path d="{body}" fill="#000000"/></mask>'
)
out.append(f'<g transform="matrix(0.9 0.45 0 1 {f(ph[0])} {f(ph[1])})"><rect width="{PHW}" height="{PHH}" rx="7" fill="{B500}" stroke="{B600}" stroke-width="1.6"/>'
           f'<rect x="5" y="7" width="26" height="42" rx="4" fill="{WHITE}"/>'
           f'<path d="M18 12 c-4.6 0 -6.8 3.3 -6.8 6.4 c0 4.6 6.8 10.4 6.8 10.4 s6.8 -5.8 6.8 -10.4 c0 -3.1 -2.2 -6.4 -6.8 -6.4 Z" fill="{B500}"/>'
           f'<circle cx="18" cy="18.4" r="2.4" fill="{WHITE}"/>'
           f'<circle cx="18" cy="36" r="6.4" fill="{B500}"/>' + tick(18, 36, 0.62, WHITE, 1.8) + '</g>')
out.append(
    f'<g mask="url(#{PFX}-arm)"><path d="M{f(sx0)} {f(sy0)} L{f(hx)} {f(hy2)}" stroke="{B500}" stroke-width="{AW}" stroke-linecap="round"/>'
    f'<circle cx="{f(hx)}" cy="{f(hy2)}" r="{HO}" fill="{B500}"/></g>'
    f'<path d="M{f(sx0)} {f(sy0)} L{f(hx)} {f(hy2)}" stroke="{WHITE}" stroke-width="{AC}" stroke-linecap="round"/>'
    f'<circle cx="{f(hx)}" cy="{f(hy2)}" r="{HC}" fill="{WHITE}"/>'
)
track([(cx - R - 4, cy + 10), (cx + R, hy - 20)])
# connector: from the phone's top, back along -y to the record's plane, then along -x into its right edge
p1 = iso(PHX + PHW / 2, PHY, PHZT)
CZ = PHZT
dashed([p1, iso(PHX + PHW / 2, RY - 3, CZ), iso(RX + RW, RY - 3, CZ)])
dot(p1, 3.2)

# ================================================================ write
svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 4
vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad)
ALT = ("Isometric illustration for PropTech, ConTech and field operations product design. The white house from the "
       "expertise hub stands on its lime tile, and behind it rises the property's one record, a solid blue screen "
       "with the house's map pin and a list of sign-offs, two ticked and one still open, each beside its source "
       "document or drawing. On the left a deal team's laptop shows the same property picked out in a pipeline board; "
       "in front on the right a person on site in a hard hat holds up a phone with the same pin and a saved tick. "
       "Dashed lines tie the laptop and the phone to the one record.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(vb[0])} {f(vb[1])} {f(vb[2])} {f(vb[3])}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="{PFX}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", [round(v) for v in vb], "ratio", round(vb[2] / vb[3], 2))
