"""Generator for the /expertise/fintech hero. Run: python3 build.py  (writes hero.svg beside it).

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z). Upright faces face +y (toward the viewer, left); their
thickness goes back along -y, so the top and right edges show.
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"

out = []
pts_all = []


def iso(x, y, z=0.0):
    return (0.9 * x - 0.9 * y, 0.45 * x + 0.45 * y - z)


def f(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def P(points):
    return " ".join(f"{f(a)},{f(b)}" for a, b in points)


def track(points):
    pts_all.extend(points)


def rr_outline(w, h, r, n=8):
    """Rounded rect outline in local (u, v), v down."""
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


def upright_slab(x0, y0, ztop, w, h, r, depth, top_fill, side_fill, edge):
    """Thickness of an upright rounded plate: one hull per edge tone (top lighter, right deeper)."""
    loc = rr_outline(w, h, r)

    def scr(u, v, dy):
        return iso(x0 + u, y0 - dy, ztop - v)

    allp = [scr(u, v, d) for (u, v) in loc for d in (0, depth)]
    right = [scr(u, v, d) for (u, v) in loc if u >= w - r - 0.01 or v >= h - r - 0.01 and u >= w - 2 * r for d in (0, depth)]
    track(allp)
    out.append(f'<polygon points="{P(hull(allp))}" fill="{top_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{P(hull(right))}" fill="{side_fill}"/>')


def face(x0, y0, ztop):
    sx, sy = iso(x0, y0, ztop)
    return f'matrix(0.9 0.45 0 1 {f(sx)} {f(sy)})'


NS = 'vector-effect="non-scaling-stroke"'

# ---------------------------------------------------------------- floor
FX0, FY0, FW, FH = -330, -120, 640, 470
fx, fy = iso(FX0, FY0)
corners = [iso(FX0, FY0), iso(FX0 + FW, FY0), iso(FX0 + FW, FY0 + FH), iso(FX0, FY0 + FH)]
track(corners)
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#fintech-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.2" stroke-dasharray="6 5" {NS}/>'
    f'<rect x="50" y="50" width="{FW - 100}" height="{FH - 100}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ---------------------------------------------------------------- the phone (client's app: light body)
PX, PY, PZ = 20, 0, 400  # left edge x, face plane y, top z
PW, PH, PR, PD = 200, 400, 30, 16
out.append('<!-- The banking app: a light phone standing upright -->')
upright_slab(PX, PY, PZ, PW, PH, PR, PD, B100, B200, B500)
SCREEN = (14, 40, PW - 28, PH - 54)
g = [f'<g transform="{face(PX, PY, PZ)}">']
g.append(f'<rect width="{PW}" height="{PH}" rx="{PR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" {NS}/>')
g.append(f'<rect x="{SCREEN[0]}" y="{SCREEN[1]}" width="{SCREEN[2]}" height="{SCREEN[3]}" rx="18" fill="{B50}" stroke="{B500}" stroke-width="1.2" {NS}/>')
g.append(f'<rect x="{PW/2-22}" y="18" width="44" height="8" rx="4" fill="{B200}"/>')
# header: the payment, with a small copy of the card beside its amount
g.append(f'<rect x="30" y="58" width="44" height="28" rx="6" fill="{B500}"/>'
         f'<rect x="36" y="64" width="10" height="8" rx="2" fill="{B100}"/>'
         f'<rect x="36" y="77" width="30" height="3.5" rx="1.75" fill="{WHITE}"/>')
g.append(f'<rect x="86" y="60" width="78" height="11" rx="5.5" fill="{B500}"/>'
         f'<rect x="86" y="77" width="50" height="7" rx="3.5" fill="{B300}"/>')
# status track: two ticked steps, then the stopped one with its reason
TX = 44
steps = [118, 160, 202]
g.append(f'<path d="M{TX} {steps[0]} V{steps[2]}" stroke="{B500}" stroke-width="2" {NS}/>')
for sy in steps[:2]:
    g.append(f'<circle cx="{TX}" cy="{sy}" r="10" fill="{B500}"/>'
             f'<path d="M{TX-4.5} {sy} l3.2 3.4 l6 -6.6" fill="none" stroke="{WHITE}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" {NS}/>')
    g.append(f'<rect x="64" y="{sy-8}" width="70" height="7" rx="3.5" fill="{B300}"/>'
             f'<rect x="64" y="{sy+3}" width="44" height="6" rx="3" fill="{B200}"/>')
sy = steps[2]
g.append(f'<circle cx="{TX}" cy="{sy}" r="10" fill="{WHITE}" stroke="{B500}" stroke-width="2" {NS}/>'
         f'<path d="M{TX} {sy-5} v5" stroke="{B500}" stroke-width="2.6" stroke-linecap="round" {NS}/>'
         f'<circle cx="{TX}" cy="{sy+5}" r="1.6" fill="{B500}"/>')
g.append(f'<rect x="64" y="{sy-6}" width="80" height="9" rx="4.5" fill="{B500}"/>')
# the reason, explained: a white note under the stopped step
g.append(f'<rect x="60" y="{sy+14}" width="110" height="52" rx="10" fill="{WHITE}" stroke="{B500}" stroke-width="1.2" {NS}/>'
         f'<rect x="72" y="{sy+27}" width="84" height="6" rx="3" fill="{B300}"/>'
         f'<rect x="72" y="{sy+39}" width="66" height="6" rx="3" fill="{B200}"/>'
         f'<rect x="72" y="{sy+51}" width="40" height="6" rx="3" fill="{B200}"/>')
# the way forward
BY = PH - 66
g.append(f'<rect x="26" y="{BY}" width="{PW-52}" height="40" rx="20" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2" {NS}/>'
         f'<rect x="48" y="{BY+16}" width="62" height="8" rx="4" fill="{INK}"/>'
         f'<path d="M{PW-52} {BY+12} l8 8 l-8 8" fill="none" stroke="{INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" {NS}/>')
g.append('</g>')
out.extend(g)

# ---------------------------------------------------------------- the bank card (hero, solid blue)
CX, CY, CZ = -200, 150, 170
CW, CH, CR, CD = 250, 158, 16, 9
out.append('<!-- The bank card from the hub: solid blue, standing in front -->')
upright_slab(CX, CY, CZ, CW, CH, CR, CD, B600, B700, B600)
g = [f'<g transform="{face(CX, CY, CZ)}">']
g.append(f'<rect width="{CW}" height="{CH}" rx="{CR}" fill="{B500}" stroke="{B600}" stroke-width="1.6" {NS}/>')
# chip
g.append(f'<rect x="26" y="40" width="46" height="34" rx="7" fill="{B100}"/>'
         f'<path d="M26 57 H72 M49 40 V74" stroke="{B300}" stroke-width="1.2" {NS}/>')
# contactless mark
for i, rad in enumerate((8, 15, 22)):
    g.append(f'<path d="M{200 + rad*0.0} {57 - rad} a{rad} {rad} 0 0 1 0 {2*rad}" fill="none" stroke="{WHITE}" stroke-width="2.6" stroke-linecap="round" stroke-opacity="{0.95 - i*0.2:.2f}" {NS}/>'.replace(f'M{200 + rad*0.0}', f'M{186 + rad*0.55:.1f}'))
# number and name bars
g.append(f'<rect x="26" y="98" width="190" height="11" rx="5.5" fill="{WHITE}" fill-opacity="0.95"/>'
         f'<rect x="26" y="124" width="78" height="8" rx="4" fill="{WHITE}" fill-opacity="0.55"/>'
         f'<rect x="178" y="122" width="44" height="12" rx="6" fill="{B300}"/>')
g.append('</g>')
out.extend(g)

# ---------------------------------------------------------------- the payment: card to its row in the app
out.append('<!-- The payment: a dashed line from the card to its row in the app -->')
a = iso(CX + CW, CY - CD, CZ - 66)     # leaves the back of the card's right edge
b = iso(PX + 30, PY, PZ - 72)         # the payment row on the phone
mid = iso(CX + CW, PY, CZ - 66)
mid2 = (b[0], b[1])
# route along iso axes: back along -y at the card's height, then up the phone face
k1 = iso(PX + 30, CY - CD, CZ - 66)
k2 = iso(PX + 30, PY + 0.01, CZ - 66)
c1 = iso(PX + 30, PY, PZ - 72)
EXTRA = []

svg_body = "\n".join(out)

xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 4
vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad)
ALT = os.environ.get("ALT", "")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(vb[0])} {f(vb[1])} {f(vb[2])} {f(vb[3])}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="fintech-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", [round(v) for v in vb], "ratio", round(vb[2] / vb[3], 2))
