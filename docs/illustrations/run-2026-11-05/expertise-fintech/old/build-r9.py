"""Generator for the /expertise/fintech hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: the hub's bank card pays, and the app says plainly what happened and what to do next.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z). Upright faces face +y (toward the viewer, left); their
thickness goes back along -y, so the top and right edges show.
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
NS = ''  # strokes scale with the drawing, as in the family

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


def rr_outline(w, h, r, n=10):
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
    """Thickness of an upright rounded plate (face in the plane y=y0, depth going back along -y).
    Two tones: the top edge lighter, the right edge deeper."""
    loc = rr_outline(w, h, r)

    def scr(u, v, d):
        return iso(x0 + u, y0 - d, ztop - v)

    allp = [scr(u, v, d) for (u, v) in loc for d in (0, depth)]
    right = [scr(u, v, d) for (u, v) in loc if u >= w - r - 0.01 for d in (0, depth)]
    track(allp)
    out.append(f'<polygon points="{P(hull(allp))}" fill="{top_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{P(hull(right))}" fill="{side_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')


def face(x0, y0, ztop):
    sx, sy = iso(x0, y0, ztop)
    return f'matrix(0.9 0.45 0 1 {f(sx)} {f(sy)})'


def dashed(points, cased=False):
    d = "M" + " L".join(f"{f(a)} {f(b)}" for a, b in points)
    if cased:
        out.append(f'<path d="{d}" fill="none" stroke="{WHITE}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>')
    out.append(f'<path d="{d}" fill="none" stroke="{B500}" stroke-width="1.2" stroke-dasharray="4 4" stroke-linecap="round"/>')


# ================================================================ layout (world units)
# the phone: the client's app, light body, standing upright at the back
PX, PY, PW, PH, PR, PD = 96, 0, 196, 392, 30, 16
PZ = PH
# the bank card: the hub's object, solid blue, standing on its long edge in front
CW, CH, CR, CD = 340, 214, 20, 12   # a real card's 1.59:1, larger so the hero object fills the frame
CX, CY = -172, 116
K = CW / 292                        # the card's printed detail is laid out at 292 wide, then scaled
CZ = CH

# ================================================================ floor (drawn first; sized to the objects)
FX0, FY0, FX1, FY1 = -210, -50, 330, 156
fx, fy = iso(FX0, FY0)
FW, FH = FX1 - FX0, FY1 - FY0
track([iso(FX0, FY0), iso(FX1, FY0), iso(FX1, FY1), iso(FX0, FY1)])
INS = 36
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#fintech-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.2" stroke-dasharray="6 5" {NS}/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the phone
out.append('<!-- The app: a light phone standing upright, its screen saying what happened and what to do next -->')
upright_slab(PX, PY, PZ, PW, PH, PR, PD, B100, B200, B500)
g = [f'<g transform="{face(PX, PY, PZ)}">']
g.append(f'<rect width="{PW}" height="{PH}" rx="{PR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" {NS}/>')
SX, SYT, SW, SH = 13, 38, PW - 26, PH - 51
g.append(f'<rect x="{SX}" y="{SYT}" width="{SW}" height="{SH}" rx="18" fill="{B50}" stroke="{B500}" stroke-width="1.2" {NS}/>')
g.append(f'<rect x="{PW/2-22}" y="17" width="44" height="7" rx="3.5" fill="{B200}"/>')
# header: the payment, with a small copy of the card beside its amount
MC = (28, 52, 60, 40)  # mini card x, y, w, h
CHIP = (MC[0] + 7, MC[1] + 8, 15, 11)
g.append(f'<rect x="{MC[0]}" y="{MC[1]}" width="{MC[2]}" height="{MC[3]}" rx="6" fill="{B500}"/>'
         f'<rect x="{CHIP[0]}" y="{CHIP[1]}" width="{CHIP[2]}" height="{CHIP[3]}" rx="2.5" fill="{B100}"/>'
         f'<rect x="{MC[0]+8}" y="{MC[1]+26}" width="44" height="5" rx="2.5" fill="{WHITE}"/>')
g.append(f'<rect x="96" y="59" width="70" height="11" rx="5.5" fill="{B500}"/>'
         f'<rect x="96" y="77" width="44" height="7" rx="3.5" fill="{B300}"/>')
# status track: two ticked steps, then the one that stopped (the loudest mark after the button),
# its reason hanging from it, and the step it has not reached yet, faded
TX = 44
steps = [124, 164, 204]
SR = 13                       # the stop disc, 1.3x the tick discs
NEXT = 300                    # the step not reached
BY = PH - 64                  # the way forward: one lime button
g.append(f'<path d="M{TX} {steps[0]} V{steps[2]}" stroke="{B500}" stroke-width="2" {NS}/>')
g.append(f'<path d="M{TX} {steps[2]+SR+3} V{NEXT-10-3} M{TX} {NEXT+10+3} V{BY-2}" stroke="{B300}" stroke-width="2" stroke-dasharray="4 4" {NS}/>')
for sy in steps[:2]:
    g.append(f'<circle cx="{TX}" cy="{sy}" r="10" fill="{B500}"/>'
             f'<path d="M{TX-4.5} {sy} l3.2 3.4 l6 -6.6" fill="none" stroke="{WHITE}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" {NS}/>')
    g.append(f'<rect x="64" y="{sy-8}" width="72" height="7" rx="3.5" fill="{B300}"/>'
             f'<rect x="64" y="{sy+3}" width="44" height="6" rx="3" fill="{B200}"/>')
sy = steps[2]
g.append(f'<circle cx="{TX}" cy="{sy}" r="{SR}" fill="{B700}"/>'
         f'<path d="M{TX} {sy-6.5} v6.5" stroke="{WHITE}" stroke-width="3" stroke-linecap="round" {NS}/>'
         f'<circle cx="{TX}" cy="{sy+5.6}" r="1.9" fill="{WHITE}"/>')
g.append(f'<rect x="64" y="{sy-3.5}" width="72" height="7" rx="3.5" fill="{B300}"/>')
# the reason, in a white note hanging from the stopped step, its tail pointing at the stop
NX, NY, NW, NH = 64, sy + 13, 106, 50
note = (f'M{NX+16} {NY} H{NX+NW-10} a10 10 0 0 1 10 10 V{NY+NH-10} a10 10 0 0 1 -10 10 H{NX+10} '
        f'a10 10 0 0 1 -10 -10 V{NY+14} L{TX+SR+2} {sy+5} Z')
g.append(f'<path d="{note}" fill="{WHITE}" stroke="{B500}" stroke-width="1.2" stroke-linejoin="round" {NS}/>'
         f'<rect x="{NX+12}" y="{NY+12}" width="80" height="6" rx="3" fill="{B300}"/>'
         f'<rect x="{NX+12}" y="{NY+24}" width="64" height="6" rx="3" fill="{B200}"/>'
         f'<rect x="{NX+12}" y="{NY+36}" width="40" height="6" rx="3" fill="{B200}"/>')
# the step not reached: a faded ring and faded bars
g.append(f'<circle cx="{TX}" cy="{NEXT}" r="10" fill="{B50}" stroke="{B300}" stroke-width="2" {NS}/>'
         f'<rect x="64" y="{NEXT-8}" width="72" height="7" rx="3.5" fill="{B200}"/>'
         f'<rect x="64" y="{NEXT+3}" width="44" height="6" rx="3" fill="{B100}"/>')
# the way forward: one lime button
g.append(f'<rect x="26" y="{BY}" width="{PW-52}" height="38" rx="19" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2" {NS}/>'
         f'<rect x="46" y="{BY+15}" width="60" height="8" rx="4" fill="{INK}"/>'
         f'<path d="M{PW-50} {BY+11.5} l7.5 7.5 l-7.5 7.5" fill="none" stroke="{INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" {NS}/>')
g.append('</g>')
out.extend(g)

# ================================================================ the payment: the card to its row in the app
MCX = PX + CHIP[0] + CHIP[2] / 2       # world x of the mini card's chip
MCZ = PZ - (CHIP[1] + CHIP[3] / 2)      # world z of the same point

# ================================================================ the bank card (hero, solid blue)
out.append('<!-- The bank card from the hub: solid blue, standing on its long edge in front -->')
upright_slab(CX, CY, CZ, CW, CH, CR, CD, B600, B700, B600)
g = [f'<g transform="{face(CX, CY, CZ)}">']
g.append(f'<rect width="{CW}" height="{CH}" rx="{CR}" fill="{B500}" stroke="{B600}" stroke-width="1.6" {NS}/>')
g.append(f'<g transform="scale({K:.4f})">')
g.append(f'<rect x="28" y="42" width="46" height="35" rx="7" fill="{B100}"/>'
         f'<path d="M28 59.5 H74 M51 42 V77" stroke="{B300}" stroke-width="{1.2/K:.2f}" {NS}/>')
for i, rad in enumerate((8, 15, 22)):
    g.append(f'<path d="M{292-62 + rad*0.55:.1f} {59.5 - rad} a{rad} {rad} 0 0 1 0 {2*rad}" fill="none" stroke="{WHITE}" '
             f'stroke-width="{2.6/K:.2f}" stroke-linecap="round" stroke-opacity="{0.95 - i*0.22:.2f}" {NS}/>')
g.append(f'<rect x="28" y="104" width="204" height="12" rx="6" fill="{WHITE}"/>'
         f'<rect x="28" y="131" width="82" height="8" rx="4" fill="{WHITE}" fill-opacity="0.55"/>'
         f'<rect x="{292-76}" y="129" width="48" height="12" rx="6" fill="{B300}"/>')
g.append('</g>')
g.append('</g>')
out.extend(g)

# the payment line: from the card's top edge, straight up, then back along -y into the app's header
a = iso(MCX, CY - CD / 2, CZ)
b = iso(MCX, CY - CD / 2, MCZ)
c = iso(MCX, PY, MCZ)
out.append('<!-- The payment: a dashed line from the card to its row in the app -->')
dashed([a, b, c], cased=True)
for p in (a, c):
    out.append(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="3.4" fill="{B500}" stroke="{WHITE}" stroke-width="1.5"/>')
track([a, b, c])

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vb = (math.floor(min(xs) - pad), math.floor(min(ys) - pad), math.ceil(max(xs) - min(xs) + 2 * pad), math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for FinTech product design. A solid blue bank card with a chip and a contactless mark "
       "stands on its edge on a dotted floor. A dashed line runs from the card up and into a light phone standing beside it, "
       "ending on the chip of the same card at the head of the screen. Below it a payment's steps: two ticked, the third "
       "stopped with a solid warning mark and a note hanging from it giving the reason, a faded step not yet reached, and "
       "one lime button with an arrow, the way forward.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="fintech-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
