"""Generator for the /audits/product-modernisation-assessment hero. Run: python3 build.py (writes hero.svg beside it).

Idea: "They split our product into its areas, gave each one its answer, and showed us which one to move first."

The established product is a solid blue slab (the hero object) cut into five white module blocks of different
sizes, like a model of the product's areas. Each block carries one glyph on its top for its answer: tick = keep,
minus = simplify, turning arrow = redesign, up-arrow = new platform, cross = rebuild or retire. The one to move first (the
new-platform block, "reports" in the page's example) is lifted out of its socket and is the lime accent; dashed
dependency lines run from it to the blocks that wait on it. A Tcules figure and a client figure stand at the front
of the slab, deciding together: the Tcules hand on the lifted block, the client's on the keep block.
r2 (5 Nov fix pass): lift cut from 150 to 50, the first module moved to the front-right; drop lines short at its
corners; dependency lines one iso-axis wire with drops; both people at the slab; floor trimmed to 410 x 384.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z).
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
SLUG = "pma"

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


def arc_pts(cx, cy, r, a0, a1, n=8):
    return [(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def rr(x0, y0, x1, y1, r):
    """rounded rectangle outline in world xy, clockwise in screen."""
    return (arc_pts(x1 - r, y0 + r, r, -90, 0) + arc_pts(x1 - r, y1 - r, r, 0, 90)
            + arc_pts(x0 + r, y1 - r, r, 90, 180) + arc_pts(x0 + r, y0 + r, r, 180, 270))


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


def poly(points, fill, stroke=B500, sw=1.6, extra=""):
    out.append(f'<polygon points="{P(points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"{extra}/>')


def box(x0, y0, x1, y1, z0, z1, r, top, side_y, side_x, stroke=B500, sw=1.6):
    """A rounded box: one hull for the +x face tone, one for the +y face, the top on them."""
    ol = rr(x0, y0, x1, y1, r)
    allp = [iso(x, y, z) for (x, y) in ol for z in (z0, z1)]
    yside = [iso(x, y, z) for (x, y) in ol if y >= y1 - r - 0.01 for z in (z0, z1)]
    track(allp)
    poly(hull(allp), side_x, stroke, sw)
    poly(hull(yside), side_y, stroke, sw)
    poly([iso(x, y, z1) for (x, y) in ol], top, stroke, sw)


def top_group(cx, cy, z):
    ox, oy = iso(cx, cy, z)
    return f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(ox)} {f(oy)})">'


# ---------------------------------------------------------------- glyphs, drawn flat on a top face (local units)
GS = 5  # glyph stroke in world units


def glyph(kind, col):
    s = f'stroke="{col}" stroke-width="{GS}" stroke-linecap="round" stroke-linejoin="round" fill="none"'
    if kind == "keep":       # tick
        return f'<path d="M-12 1 L-4 9 L13 -9" {s}/>'
    if kind == "simplify":   # minus
        return f'<path d="M-12 0 H12" {s}/>'
    if kind == "redesign":   # a route that turns: the workflow itself changes
        return f'<path d="M-12 11 V1 Q-12 -6 -5 -6 H11 M5 -12 L11 -6 L5 0" {s}/>'
    if kind == "platform":   # up arrow onto a base line
        return f'<path d="M0 8 V-11 M-8 -3 L0 -11 L8 -3 M-12 13 H12" {s}/>'
    if kind == "retire":     # cross
        return f'<path d="M-9 -9 L9 9 M9 -9 L-9 9" {s}/>'
    return ""


# The glyphs are drawn so that "up" on the glyph runs toward the back of the top face (world -x... screen up-right).
# Local glyph frame: u along world -y (screen right-up), v along world +x (screen right-down) => rotate to read.
def glyph_on_top(kind, cx, cy, z, col, badge=None):
    ox, oy = iso(cx, cy, z)
    # local frame: +u maps to screen (0.9, -0.45) (world -y), +v maps to screen (0.9, 0.45) (world +x)
    # a frame turned 45 degrees in the top plane: local x runs screen-horizontal, local y screen-vertical at half
    g = f'<g transform="matrix(1.273 0 0 0.636 {f(ox)} {f(oy)})">'
    if badge:
        g += f'<circle r="27" fill="{badge}"/>'
    g += '<g transform="scale(1.5)">' + glyph(kind, col).replace(f'stroke-width="{GS}"', f'stroke-width="{GS/1.5:.1f}"') + '</g></g>'
    out.append(g)


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
    f'<rect width="{FW}" height="{FH}" fill="url(#{SLUG}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the product slab (hero object)
SX0, SY0, SX1, SY1, ST = -188, -134, 128, 146, 26
out.append('<!-- The established product: one solid blue slab, cut into its areas -->')
ol = rr(SX0, SY0, SX1, SY1, 14)
allp = [iso(x, y, z) for (x, y) in ol for z in (0, ST)]
yside = [iso(x, y, z) for (x, y) in ol if y >= SY1 - 14.01 for z in (0, ST)]
track(allp)
poly(hull(allp), B600, B600, 1.2)
poly(hull(yside), B700, B600, 1.2)
poly([iso(x, y, ST) for (x, y) in ol], B500, B600, 1.6)

M, G = 14, 14                      # margin to the slab edge, groove between modules
XA0, XA1 = SX0 + M, -38            # back column
XB0, XB1 = XA1 + G, SX1 - M        # front column
# (name, x0, y0, x1, y1, height, answer). The back column stands taller, so nothing in front is hidden.
mods = {
    "parts":    (XA0, SY0 + M, XA1, -14, 80, "retire"),
    "planning": (XA0, -14 + G, XA1, SY1 - M, 74, "redesign"),
    "reports":  (XB0, SY0 + M, XB1, -36, 34, "platform"),
    "settings": (XB0, -36 + G, XB1, 46, 28, "simplify"),
    "work":     (XB0, 46 + G, XB1, SY1 - M, 48, "keep"),
}
LIFT = 50
FIRST = "reports"


def module(name, z0):
    x0, y0, x1, y1, h, ans = mods[name]
    out.append(f'<!-- Module: {name}, answer {ans} -->')
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if name == FIRST:
        box(x0, y0, x1, y1, z0, z0 + h, 9, LIME, LIMED, LIMED, LIMED, 1.4)
        cxa, cya = iso(x1, y1, z0 + h)
        _, cyb = iso(x1, y1, z0)
        out.append(f'<path d="M{f(cxa)} {f(cya + 2)} V{f(cyb - 3)}" stroke="{LIME}" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.8"/>')
        glyph_on_top(ans, cx, cy, z0 + h, INK)
    else:
        box(x0, y0, x1, y1, z0, z0 + h, 9, WHITE, B200, B100)
        glyph_on_top(ans, cx, cy, z0 + h, B500, B100)


rx0, ry0, rx1, ry1, rh, _ = mods[FIRST]
ZB = ST + LIFT

for name in ("parts", "planning"):
    module(name, ST)

out.append('<!-- The socket the first module lifts out of -->')
poly([iso(x, y, ST) for (x, y) in rr(rx0, ry0, rx1, ry1, 9)], B600, WHITE, 1.4, ' stroke-dasharray="5 4"')
out.append('<!-- Short drop lines at its outer corners: the module is lifted just clear of its socket -->')
for (x, y) in ((rx0 + 2.6, ry1 - 2.6), (rx1 - 2.6, ry0 + 2.6), (rx1 - 2.6, ry1 - 2.6)):
    ax, ay = iso(x, y, ST)
    _, by_ = iso(x, y, ZB)
    out.append(f'<path d="M{f(ax)} {f(ay - 2)} V{f(by_ + 2)}" stroke="{B500}" stroke-width="1.2" stroke-dasharray="3 3" stroke-linecap="round"/>')
module(FIRST, ZB)

for name in ("settings", "work"):
    module(name, ST)

# dependency wiring: one line leaves the lifted module's left face at height ZL and runs along +y over the front
# column, dropping straight down onto each dependant's disc; it then turns along -x and stops on the tall back
# module's face. Every run follows an iso axis.
ZL = ZB + rh * 0.55
D = 18.9                            # lands on the disc's back rim (screen 17 above its centre)


def ctr(name):
    x0, y0, x1, y1, h, _ = mods[name]
    return (x0 + x1) / 2, (y0 + y1) / 2, ST + h


cxs, cys, czs = ctr("settings")
cxw, cyw, czw = ctr("work")
xb = cxs - D
p0 = (xb, ry1, ZL)
tap_s = (xb, cys - D, ZL)
tap_w = (xb, cyw - D, ZL)
end_p = (XA1, cyw - D, ZL)
out.append('<!-- Dependency lines: from the first module to the areas that wait on it -->')
dash = f'stroke="{B500}" stroke-width="2.1" stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round" fill="none"'


def pt(p):
    a, b = iso(*p)
    return f"{f(a)} {f(b)}"


land_s = (xb, cys - D, czs)
land_w = (xb, cyw - D, czw)
out.append(f'<path d="M{pt(p0)} L{pt(tap_w)} L{pt(end_p)}" {dash}/>')
out.append(f'<path d="M{pt(tap_s)} L{pt(land_s)}" {dash}/><path d="M{pt(tap_w)} L{pt(land_w)}" {dash}/>')
for q in (p0, land_s, land_w, end_p):
    a, b = iso(*q)
    out.append(f'<circle cx="{f(a)}" cy="{f(b)}" r="3.4" fill="{B500}"/>')


# ================================================================ people
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8


def body_path(bx, by):
    return (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
            f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')


def shoulder(bx, by, side):
    return (bx + 7 * side, by - H + 20)


def tcules(x, y, hand, side=-1):
    bx, by = iso(x, y)
    b = body_path(bx, by)
    sh = shoulder(bx, by, side)
    out.append('<!-- The Tcules person: blue, edged in white, a hand on the module to move first -->')
    out.append(f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="{ARM+4}" stroke-linecap="round"/>'
               f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND+2)}" fill="{WHITE}"/>')
    out.append(f'<path d="{b}" fill="{B500}" stroke="{WHITE}" stroke-width="4" stroke-linejoin="round" paint-order="stroke"/>'
               f'<circle cx="{f(bx)}" cy="{f(by-H-R-4-HEAD)}" r="{HEAD}" fill="{B500}" stroke="{WHITE}" stroke-width="4" paint-order="stroke"/>')
    out.append(f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
               f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/>')
    track([(bx - R - 2, by + 12), (bx + R, by - H - R - 4 - 2 * HEAD - 2)])
    return math.hypot(hand[0] - sh[0], hand[1] - sh[1])


def client(x, y, hand, side=-1):
    bx, by = iso(x, y)
    b = body_path(bx, by)
    sh = shoulder(bx, by, side)
    out.append('<!-- The client: white, outlined in blue, a light hand resting on a block -->')
    out.append(f'<path d="{b}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
               f'<circle cx="{f(bx)}" cy="{f(by-H-R-4-HEAD)}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
    out.append(f'<mask id="{SLUG}-arm" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400">'
               f'<rect x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400" fill="{WHITE}"/><path d="{b}" fill="#000000"/></mask>'
               f'<g mask="url(#{SLUG}-arm)"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
               f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>'
               f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="{f(ARM-2*OUT)}" stroke-linecap="round"/>'
               f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND-OUT)}" fill="{WHITE}"/>')
    track([(bx - R - 2, by + 12), (bx + R, by - H - R - 4 - 2 * HEAD - 2)])
    return math.hypot(hand[0] - sh[0], hand[1] - sh[1])


# both stand on the floor at the slab's front-right edge, side by side. The Tcules hand lands on the lifted
# module's right face; the client's hand rests on the keep block's right face.
PX, PY = 152, -114
CXp, CYp = 60, 190
t_hand = iso(rx1 + HAND * 0.9, -92, ZB + rh * 0.3)
c_hand = iso(CXp - 4, SY1 - M + HAND * 0.9, ST + 48 * 0.6)
print("client arm", round(client(CXp, CYp, c_hand, side=-1), 1))
print("tcules arm", round(tcules(PX, PY, t_hand), 1))
# ================================================================ write
svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = max(860, math.ceil(max(xs) - min(xs) + 2 * pad))
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration of a product modernisation assessment. An established product, drawn as a solid "
       "blue slab, is split into five blocks of different sizes, one for each area of the product, and each block "
       "carries a mark for its answer: a tick to keep, a minus to simplify, a turning arrow to redesign, a cross to "
       "rebuild or retire. The one to move first, lime and marked with an upward arrow for a new platform, is "
       "lifted just clear of its place, and a dashed line runs from it to the blocks that depend on it. A Tcules "
       "designer has a hand on the lime block and the client, standing at the slab's other side, has a hand on the "
       "block they keep.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="{SLUG}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
