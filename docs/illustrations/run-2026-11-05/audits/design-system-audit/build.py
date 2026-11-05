"""Generator for the /audits/design-system-audit hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: we follow one button down through the design file, the code library and the live product, and find the
place where the team stopped using it and made their own.

Three plates stacked on the floor, bottom to top: the design file (white, the button selected with handles), the
code library (solid blue, the hero object, the button as the library's white pill), the live product (white, an
app layout). A dashed thread holds the button's place through all three. On the live product the place is empty
(a dashed outline) and the team's local copy sits beside it, lime, with an extra glyph the library's button did
not have: the reason they went around it. A Tcules figure and a client figure stand at the stack following it.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z).
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
P_ = "dsa"   # id prefix

out = []
pts_all = []


def iso(x, y, z=0.0):
    return (0.9 * x - 0.9 * y, 0.45 * x + 0.45 * y - z)


def f(v):
    s = f"{v:.1f}"
    return "0" if s in ("-0.0", "0.0") else (s[:-2] if s.endswith(".0") else s)


def P(points):
    return " ".join(f"{f(a)},{f(b)}" for a, b in points)


def track(points):
    pts_all.extend(points)


def arc_pts(cx, cy, r, a0, a1, n=10):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def rr_outline(w, h, r, n=10):
    pts = []
    for cx, cy, a0 in ((w - r, r, -90), (w - r, h - r, 0), (r, h - r, 90), (r, r, 180)):
        pts += arc_pts(cx, cy, r, a0, a0 + 90, n)
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


def poly(points, fill, stroke=B500, sw=1.6):
    out.append(f'<polygon points="{P(points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"/>')


def flat(x, y, z):
    """open a group drawing flat on the plane z, local u along x, v along y, origin at (x, y)."""
    ox, oy = iso(x, y, z)
    return f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(ox)} {f(oy)})">'


# ================================================================ layout (world units)
PW, PD, PR, PT = 244, 206, 16, 10       # plate size along x, along y, corner radius, thickness
SX0, SY0 = -60, -52                    # the stack's back corner
GAP = 118                                # rise from one plate's top to the next plate's top
Z = [0, GAP, 2 * GAP]                    # plate bottoms
BU, BV = 160, 150                        # the button's place on every plate (local u, v)
BW, BH = 92, 30                          # the button pill (along u, along v)
DRIFT = 90                               # the local copy sits this far along -v (right-up on screen)

# ================================================================ floor: healthtech's, the family standard
FX0, FY0 = -205, -146
FX1, FY1 = FX0 + 545, FY0 + 402
fx, fy = iso(FX0, FY0)
FW, FH = FX1 - FX0, FY1 - FY0
track([iso(FX0, FY0), iso(FX1, FY0), iso(FX1, FY1), iso(FX0, FY1)])
INS = 45
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#{P_}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

PL = rr_outline(PW, PD, PR)


def plate(z0, top, side_all, side_v, edge=B500):
    """a rounded slab: one hull per side tone, then the top face."""
    allp = [iso(SX0 + u, SY0 + v, z) for (u, v) in PL for z in (z0, z0 + PT)]
    vside = [iso(SX0 + u, SY0 + v, z) for (u, v) in PL if v >= PD - PR - 0.01 for z in (z0, z0 + PT)]
    track(allp)
    poly(hull(allp), side_all, edge, 1.6)
    poly(hull(vside), side_v, edge, 1.6)
    poly([iso(SX0 + u, SY0 + v, z0 + PT) for (u, v) in PL], top, edge, 1.6)


def pill(u, v, w, h, fill, stroke=None, sw=1.2, dash=None):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<rect x="{f(u - w/2)}" y="{f(v - h/2)}" width="{w}" height="{h}" rx="{f(h/2)}" fill="{fill}"{s}{d}/>'


def bar(u, v, w, h, fill, op=None):
    o = f' fill-opacity="{op}"' if op else ""
    return f'<rect x="{f(u)}" y="{f(v)}" width="{w}" height="{h}" rx="{f(h/2)}" fill="{fill}"{o}/>'


def thread(z_from, z_to):
    a = iso(SX0 + BU, SY0 + BV, z_from)
    b = iso(SX0 + BU, SY0 + BV, z_to)
    out.append(f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" stroke="{B500}" stroke-width="1.6" '
               f'stroke-dasharray="5 5" stroke-linecap="round"/>')
    out.append(f'<circle cx="{f(a[0])}" cy="{f(a[1])}" r="3.4" fill="{B500}"/>')


def posts(z_from, z_to, colour=B300):
    """dashed drop lines at the left and right corners, so the plate above plainly rests on the one below."""
    for (u, v) in ((PR * 0.3, PD - PR * 0.3), (PW - PR * 0.3, PR * 0.3)):
        a = iso(SX0 + u, SY0 + v, z_from)
        b = iso(SX0 + u, SY0 + v, z_to)
        out.append(f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" stroke="{colour}" stroke-width="1.2" '
                   f'stroke-dasharray="4 4" stroke-linecap="round"/>')


# ================================================================ plate 1: the design file
out.append('<!-- The design file: a white plate, the button drawn and selected, with its frame around it -->')
plate(Z[0], WHITE, B100, B200)
zt = Z[0] + PT
g = [flat(SX0, SY0, zt)]
# a frame on the canvas holding the button, and a second frame beside it
g.append(f'<rect x="{BU-70}" y="{BV-46}" width="128" height="82" rx="6" fill="{B50}" stroke="{B300}" stroke-width="1.2"/>')
g.append(bar(BU - 58, BV - 34, 54, 6, B200))
g.append(pill(BU, BV, BW, BH, WHITE, B500, 1.4))
g.append(bar(BU - 16, BV - 3.5, 32, 7, B300))
# the selection box with its four handles
sx, sy, sw_, sh_ = BU - BW/2 - 6, BV - BH/2 - 6, BW + 12, BH + 12
g.append(f'<rect x="{f(sx)}" y="{f(sy)}" width="{f(sw_)}" height="{f(sh_)}" fill="none" stroke="{B500}" stroke-width="1"/>')
for hx, hy in ((sx, sy), (sx + sw_, sy), (sx, sy + sh_), (sx + sw_, sy + sh_)):
    g.append(f'<rect x="{f(hx-3.5)}" y="{f(hy-3.5)}" width="7" height="7" fill="{WHITE}" stroke="{B500}" stroke-width="1.2"/>')
g.append('</g>')
out.extend(g)
posts(zt, Z[1])
thread(zt, Z[1])

# ================================================================ plate 2: the code library (the hero object)
out.append('<!-- The code library: the solid blue plate, the code brackets, and the library button in its place -->')
plate(Z[1], B500, B600, B700, B600)
zt = Z[1] + PT
g = [flat(SX0, SY0, zt)]
# lines of code behind the button
for i, (du, w) in enumerate(((0, 56), (14, 44), (14, 62), (0, 38))):
    g.append(bar(154 + du, 58 + i * 14, w, 6, B300 if i % 2 else B200))
# the code brackets, at the front-left of the plate
cu, cv = 58, PD - 34
g.append(f'<path d="M{cu-6} {cv-12} L{cu-16} {cv} L{cu-6} {cv+12} M{cu+6} {cv-12} L{cu+16} {cv} L{cu+6} {cv+12}" '
         f'fill="none" stroke="{WHITE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(pill(BU, BV, BW, BH, WHITE))
g.append(bar(BU - 16, BV - 3.5, 32, 7, B500))
g.append('</g>')
out.extend(g)
posts(zt, Z[2])
thread(zt, Z[2])
# where the thread crosses the blue plate it is drawn white, clipped to the plate's top face, so it stays visible
a = iso(SX0 + BU, SY0 + BV, zt + 15)   # from the library pill's top edge up
b = iso(SX0 + BU, SY0 + BV, Z[2])
topface = P([iso(SX0 + u, SY0 + v, zt) for (u, v) in PL])
out.append(f'<clipPath id="{P_}-blue"><polygon points="{topface}"/></clipPath>'
           f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" stroke="{WHITE}" stroke-width="1.6" stroke-dasharray="5 5" '
           f'stroke-linecap="round" clip-path="url(#{P_}-blue)"/>')

# ================================================================ plate 3: the live product
out.append('<!-- The live product: a white plate laid out as an app; the button\'s place is empty and a local copy sits beside it -->')
plate(Z[2], WHITE, B100, B200)
zt = Z[2] + PT
g = [flat(SX0, SY0, zt)]
g.append(f'<rect x="16" y="16" width="{PW-32}" height="22" rx="6" fill="{B100}"/>')     # the header
g.append(bar(28, 24, 40, 6, B300))
g.append(f'<rect x="16" y="50" width="62" height="{PD-66}" rx="6" fill="{B50}"/>')      # the side nav
for i in range(4):
    g.append(bar(26, 64 + i * 16, 38 - (i % 2) * 10, 6, B200))
g.append(bar(88, 52, 30, 7, B200))
g.append(bar(88, 66, 22, 6, B200))
g.append(bar(88, 128, 30, 6, B200))
g.append(bar(88, 142, 24, 6, B200))
g.append(bar(88, 156, 28, 6, B200))
# where the library button should sit: empty, dashed
g.append(pill(BU, BV, BW, BH, "none", B500, 1.4, "4 3"))
g.append(f'<circle cx="{BU}" cy="{BV}" r="3.8" fill="{B500}"/>')
g.append('</g>')
out.extend(g)
# the local copy: lime, raised a little, with an extra glyph the library button did not have
cu, cv = BU, BV - DRIFT
CT = 4
cpl = rr_outline(BW, BH, BH / 2)
ce = [iso(SX0 + cu - BW/2 + a, SY0 + cv - BH/2 + b, z) for (a, b) in cpl for z in (zt, zt + CT)]
poly(hull(ce), LIMED, LIMED, 1.2)
g = [flat(SX0, SY0, zt + CT)]
g.append(pill(cu, cv, BW, BH, LIME, LIMED, 1.2))
g.append(bar(cu - 24, cv - 3.5, 32, 7, INK))
g.append(f'<path d="M{f(cu+15)} {f(cv-6)} L{f(cu+22)} {f(cv)} L{f(cu+15)} {f(cv+6)}" fill="none" stroke="{INK}" '
         f'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>')
g.append('</g>')
out.extend(g)
# a short dashed hop from the empty place to the copy: it moved
a = iso(SX0 + BU, SY0 + BV - BH/2 - 4, zt)
b = iso(SX0 + cu, SY0 + cv + BH/2 + 4, zt)
out.append(f'<path d="M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" stroke="{B500}" stroke-width="1.4" stroke-dasharray="3 4" stroke-linecap="round"/>')
COPY_AT = iso(SX0 + cu, SY0 + cv, zt + CT)

# ================================================================ people
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8


def body_path(bx, by):
    return (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
            f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')


def pawn(x, y, tcules, aim=None, reach=40, name="p"):
    bx, by = iso(x, y)
    body = body_path(bx, by)
    hy = by - H - R - 4 - HEAD
    hand = None
    if aim:
        if isinstance(aim, (int, float)):
            dx, dy = math.cos(math.radians(aim)), math.sin(math.radians(aim))
            sh = (bx + (8 if dx > 0 else -8), by - H + 16)
        else:
            sh = (bx + (8 if aim[0] > bx else -8), by - H + 16)
            dx, dy = aim[0] - sh[0], aim[1] - sh[1]
        L = math.hypot(dx, dy)
        hand = (sh[0] + dx / L * reach, sh[1] + dy / L * reach)
    if tcules:
        out.append(f'<path d="{body}" fill="{B500}" stroke="{WHITE}" stroke-width="3.4" paint-order="stroke" stroke-linejoin="round"/>')
        out.append(f'<circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" fill="{B500}" stroke="{WHITE}" stroke-width="3.4" paint-order="stroke"/>')
        if hand:
            out.append(f'<mask id="{P_}-{name}" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400">'
                       f'<rect x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>')
            out.append(f'<g mask="url(#{P_}-{name})"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" '
                       f'stroke-width="{ARM+3.4}" stroke-linecap="round"/><circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND+1.7)}" fill="{WHITE}"/></g>')
            out.append(f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
                       f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/>')
    else:
        out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
        out.append(f'<circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
        if hand:
            out.append(f'<mask id="{P_}-{name}" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400">'
                       f'<rect x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>')
            out.append(f'<g mask="url(#{P_}-{name})"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" '
                       f'stroke-width="{ARM}" stroke-linecap="round"/><circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>')
            out.append(f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="{f(ARM-2*OUT)}" stroke-linecap="round"/>'
                       f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND-OUT)}" fill="{WHITE}"/>')
    track([(bx - R - 2, by + 12), (bx + R + 2, hy - HEAD - 2)])
    if hand:
        track([(hand[0] - HAND - 2, hand[1] - HAND - 2), (hand[0] + HAND + 2, hand[1] + HAND + 2)])


out.append('<!-- A Tcules person and a client person at the stack, the Tcules person pointing up at the local copy -->')
pawn(296, -62, False, name="client")
pawn(322, 26, True, aim=COPY_AT, reach=64, name="tcules")

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = max(862, math.ceil(max(xs) - min(xs) + 2 * pad))
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for a design system audit. Three plates are stacked on a dotted floor: a design file "
       "at the bottom, a solid blue code library in the middle and the live product on top. One button sits in the same "
       "place on each, joined by a dashed thread. On the live product that place is empty, and beside it the team's own "
       "copy of the button, lit in lime, has an extra arrow the library's button lacks. A Tcules person and a client "
       "stand beside the stack, the Tcules person pointing up at the copy.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="{P_}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
