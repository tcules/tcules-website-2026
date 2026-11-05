"""Generator for the /expertise/proptech-contech-field-operations hero. Run: python3 build.py (writes hero.svg).

Idea: from deal desk to building site, everyone works on one record of each property.
The property's record stands on the floor as the one solid blue screen (the hero object). Beside it, the hub's
house stands on its lime tile: the site. The deal person (client, tie) stands at the record's left edge, a hand on
the deal's stages; the person on site (client, hard hat) stands on the lime tile by the house, a hand on the
record's right edge by the sign-offs.

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




# ================================================================ geometry
# the record: the one screen, solid blue, upright on a low white foot
RX, RY, RW, RH, RD, RF = 0, 0, 210, 236, 12, 8
RZT = RF + RH
# lime tile (the site) right of the record, the house at its back-right
TX0, TX1, TY0, TY1, TZ = 228, 418, -86, 66, 12
HX0, HX1, HY0, HY1 = 308, 406, -74, 20
HW, HR = 62, 48
# the two clients
DX, DY = 6, 28             # deal person, on the floor at the record's left edge
WX, WY = 262, 20           # person on site, on the lime tile
# floor: healthtech's plate (dots, dashed edge, inset 45)
FX0, FY0, FW, FH = -60, -200, 520, 310

# ================================================================ floor
corners = [iso(FX0, FY0), iso(FX0 + FW, FY0), iso(FX0 + FW, FY0 + FH), iso(FX0, FY0 + FH)]
track(corners)
out.append("<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->")
out.append(
    f'<g transform="{flat(FX0, FY0, 0)}">'
    f'<rect width="{FW}" height="{FH}" fill="url(#{PFX}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="45" y="45" width="{FW - 90}" height="{FH - 90}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the record
out.append("<!-- The property's one record: a solid blue screen standing on a low foot -->")
box(RX - 8, RX + RW + 8, RY - RD - 10, RY + 12, 0, RF, WHITE, B100, B200)
upright_slab(RX, RY, RZT, RW, RH, 16, RD, B600, B700, B600)
g = [f'<g transform="{face_y(RX, RY, RZT)}">']
g.append(f'<rect width="{RW}" height="{RH}" rx="16" fill="{B500}" stroke="{B600}" stroke-width="1.6"/>')
# title: a house mark and the property's name
g.append(f'<rect x="16" y="16" width="26" height="22" rx="5" fill="{WHITE}"/>'
         f'<path d="M22 29 l7 -6 l7 6 v5 h-14 Z" fill="{B500}"/>'
         f'<rect x="52" y="18" width="78" height="9" rx="4.5" fill="{WHITE}"/>'
         f'<rect x="52" y="31" width="46" height="6" rx="3" fill="{WHITE}" fill-opacity="0.5"/>')
# map with the property's pin, as on the hub's card
g.append(f'<rect x="16" y="50" width="{RW-32}" height="66" rx="8" fill="{WHITE}"/>'
         f'<path d="M30 104 L72 78 L114 96 L180 64" fill="none" stroke="{B100}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>'
         f'<path d="M104 58 c-8 0 -12 5.6 -12 11.4 c0 8 12 18.6 12 18.6 s12 -10.6 12 -18.6 c0 -5.8 -4 -11.4 -12 -11.4 Z" fill="{B500}"/>'
         f'<circle cx="104" cy="69.6" r="4.2" fill="{WHITE}"/>')
# left column: the deal's stages, the current one (this property) in white, under the deal person's hand
for j, vy in enumerate((126, 158, 190)):
    if j == 2:
        g.append(f'<rect x="16" y="{vy}" width="78" height="28" rx="6" fill="{WHITE}"/>'
                 f'<path d="M50 {vy+18} l7 -6 l7 6 v6 h-14 Z" fill="{B500}"/>')
    else:
        g.append(f'<rect x="16" y="{vy}" width="78" height="28" rx="6" fill="{B200}" fill-opacity="{0.85 if j == 0 else 0.6}"/>'
                 f'<rect x="26" y="{vy+11}" width="{[36, 28][j]}" height="6" rx="3" fill="{WHITE}" fill-opacity="0.8"/>')
# right column: sign-offs, each with its source; the middle source is a drawing, the last is still open
for i, yy in enumerate((140, 172, 204)):
    done = i < 2
    tx = 114
    if done:
        g.append(f'<circle cx="{tx}" cy="{yy}" r="9.5" fill="{WHITE}"/>' + tick(tx, yy, 0.95, B500, 2.2))
    else:
        g.append(f'<circle cx="{tx}" cy="{yy}" r="8.6" fill="none" stroke="{B200}" stroke-width="2"/>')
    g.append(f'<rect x="130" y="{yy-7}" width="{[38, 32, 36][i]}" height="7" rx="3.5" fill="{WHITE}" fill-opacity="{1 if done else 0.6}"/>'
             f'<rect x="130" y="{yy+3}" width="{[26, 30, 22][i]}" height="5" rx="2.5" fill="{WHITE}" fill-opacity="0.45"/>')
    sx = 174
    if i == 1:
        g.append(f'<rect x="{sx-3}" y="{yy-10}" width="22" height="20" rx="2.5" fill="{WHITE}"/>'
                 f'<path d="M{sx+1} {yy-6} h14 v12 h-14 Z M{sx+8} {yy-6} v7 M{sx+8} {yy+2} h7" fill="none" stroke="{B500}" stroke-width="1.2" stroke-linejoin="round"/>')
    else:
        op = 1 if done else 0.6
        g.append(f'<path d="M{sx} {yy-10} h10 l6 6 v14 h-16 Z" fill="none" stroke="{WHITE}" stroke-width="1.4" stroke-linejoin="round" stroke-opacity="{op}"/>'
                 f'<path d="M{sx+10} {yy-10} v6 h6" fill="none" stroke="{WHITE}" stroke-width="1.2" stroke-linejoin="round" stroke-opacity="{op}"/>')
g.append("</g>")
out.extend(g)

# ================================================================ lime tile and the house (from the hub)
out.append("<!-- The site: the hub's lime tile, the house on it -->")
box(TX0, TX1, TY0, TY1, 0, TZ, LIME, LIMED, LIMED, stroke=LIMED)
HZ0 = TZ
ym = (HY0 + HY1) / 2
zt = HZ0 + HW
poly([iso(HX0, HY1, HZ0), iso(HX1, HY1, HZ0), iso(HX1, HY1, zt), iso(HX0, HY1, zt)], WHITE)
poly([iso(HX1, HY1, HZ0), iso(HX1, HY0, HZ0), iso(HX1, HY0, zt), iso(HX1, ym, zt + HR), iso(HX1, HY1, zt)], B200)
OV = 5
poly([iso(HX0 - OV, HY1 + 4, zt - 2), iso(HX1 + OV, HY1 + 4, zt - 2), iso(HX1 + OV, ym, zt + HR), iso(HX0 - OV, ym, zt + HR)], WHITE)
poly([iso(HX1 + OV, HY1 + 4, zt - 2), iso(HX1 + OV, ym, zt + HR), iso(HX1 + OV, ym, zt + HR - 5), iso(HX1 + OV, HY1 + 4, zt - 7)], B100)
g = [f'<g transform="{face_y(HX0, HY1, zt)}">']
g.append(f'<rect x="14" y="20" width="17" height="32" rx="2" fill="{B500}"/>')
g.append(f'<rect x="44" y="13" width="30" height="20" rx="3" fill="{B50}" stroke="{B500}" stroke-width="1.6"/>'
         f'<path d="M59 13 V33" stroke="{B500}" stroke-width="1.2"/>')
g.append("</g>")
out.extend(g)
gc = iso(HX1, ym, zt + 13)
out.append(f'<g transform="matrix(0.9 -0.45 0 1 {f(gc[0])} {f(gc[1])})"><circle r="5.6" fill="{WHITE}" stroke="{B500}" stroke-width="1.4"/></g>')

# ================================================================ the two clients (healthtech's pawn and arm)
R, BH, HRAD, HEADZ = 22, 84, 16, 104
AW, AC, HO, HC = 11, 7.8, 8.8, 7.2


def pawn(wx, wy, wz):
    cx, cy = iso(wx, wy, wz)
    body = f"M{f(cx-R)} {f(cy)} V{f(cy-BH+R)} A{R} {R} 0 0 1 {f(cx+R)} {f(cy-BH+R)} V{f(cy)} A{R} 9.9 0 0 1 {f(cx-R)} {f(cy)} Z"
    track([(cx - R, cy + 10), (cx + R, cy - HEADZ - HRAD - 16)])
    out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy-HEADZ)}" r="{HRAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
    return cx, cy, body


def arm(name, body, s, h):
    out.append(
        f'<mask id="{PFX}-{name}" maskUnits="userSpaceOnUse" x="-900" y="-600" width="2000" height="1400">'
        f'<rect x="-900" y="-600" width="2000" height="1400" fill="#FFFFFF"/><path d="{body}" fill="#000000"/></mask>'
        f'<g mask="url(#{PFX}-{name})"><path d="M{f(s[0])} {f(s[1])} L{f(h[0])} {f(h[1])}" stroke="{B500}" stroke-width="{AW}" stroke-linecap="round"/>'
        f'<circle cx="{f(h[0])}" cy="{f(h[1])}" r="{HO}" fill="{B500}"/></g>'
        f'<path d="M{f(s[0])} {f(s[1])} L{f(h[0])} {f(h[1])}" stroke="{WHITE}" stroke-width="{AC}" stroke-linecap="round"/>'
        f'<circle cx="{f(h[0])}" cy="{f(h[1])}" r="{HC}" fill="{WHITE}"/>'
    )


out.append("<!-- The deal desk: a client in a tie, a hand on the deal's stage -->")
cx, cy, body = pawn(DX, DY, 0)
ty = cy - BH
out.append(f'<path d="M{f(cx-4)} {f(ty+3)} h8 l-2 5 l3.5 16 l-5.5 6 l-5.5 -6 l3.5 -16 Z" fill="{B500}"/>')
arm("deal", body, (cx + 6, cy - BH + 30), iso(RX + 30, RY + 4, RF + 34))

out.append("<!-- On site: a client in a hard hat on the lime tile, a hand on the sign-offs -->")
cx, cy, body = pawn(WX, WY, TZ)
hy = cy - HEADZ
HB = hy - 5
out.append(f'<path d="M{f(cx-17)} {f(HB)} A17 15 0 0 1 {f(cx+17)} {f(HB)} Z" fill="{B100}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
           f'<path d="M{f(cx)} {f(HB-15)} V{f(HB)}" stroke="{B500}" stroke-width="1.4"/>'
           f'<rect x="{f(cx-23)}" y="{f(HB-2.4)}" width="46" height="6" rx="3" fill="{B100}" stroke="{B500}" stroke-width="1.6"/>')
arm("site", body, (cx - 6, cy - BH + 30), iso(RX + RW - 5, RY + 3, RF + 50))

# ================================================================ write
svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 4
vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad)
ALT = ("Isometric illustration for PropTech, ConTech and field operations product design. On a dotted floor the "
       "property's one record stands as a solid blue screen: the house's map pin at the top, the deal's stages on the "
       "left with the current one picked out by a house, and its sign-offs on the right, two ticked and one still open, "
       "each beside its source document or drawing. Beside it the white house from the expertise hub stands on its "
       "lime tile. Two people work on that one record: someone from the deal desk in a tie rests a hand on the deal's "
       "stage, and a person on site in a hard hat, standing on the lime tile by the house, rests a hand by the sign-offs.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(vb[0])} {f(vb[1])} {f(vb[2])} {f(vb[3])}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="{PFX}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", [round(v) for v in vb], "ratio", round(vb[2] / vb[3], 2))
