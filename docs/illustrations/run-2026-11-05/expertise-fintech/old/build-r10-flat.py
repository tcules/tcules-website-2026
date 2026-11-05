"""Generator for the /expertise/fintech hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: the hub's bank card pays, and the customer's app says plainly why it was declined and what to try next.

r10 (family polish, 5 Nov): the card at the family scale, standing on a full healthtech floor; the app is a phone
lying face up on the floor (not the family's upright phone); the way forward is the lime retry step in the
payment's own track (not a pill button); the customer, a client pawn, stands at the foot of the phone and reaches
for it.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z).
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
    """Thickness of an upright rounded plate (face in the plane y=y0, depth going back along -y)."""
    loc = rr_outline(w, h, r)

    def scr(u, v, d):
        return iso(x0 + u, y0 - d, ztop - v)

    allp = [scr(u, v, d) for (u, v) in loc for d in (0, depth)]
    right = [scr(u, v, d) for (u, v) in loc if u >= w - r - 0.01 for d in (0, depth)]
    track(allp)
    out.append(f'<polygon points="{P(hull(allp))}" fill="{top_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{P(hull(right))}" fill="{side_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')


def flat_slab(x0, y0, w, h, r, t, front_fill, side_fill, edge):
    """Thickness of a rounded plate lying flat (top at z=t). The +y edge (lower left) in front_fill,
    the +x edge (lower right) in side_fill."""
    loc = rr_outline(w, h, r)
    allp = [iso(x0 + u, y0 + v, z) for (u, v) in loc for z in (0, t)]
    right = [iso(x0 + u, y0 + v, z) for (u, v) in loc if u >= w - r - 0.01 for z in (0, t)]
    track(allp)
    out.append(f'<polygon points="{P(hull(allp))}" fill="{front_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')
    out.append(f'<polygon points="{P(hull(right))}" fill="{side_fill}" stroke="{edge}" stroke-width="1.6" stroke-linejoin="round"/>')


def upright(x0, y0, ztop):
    sx, sy = iso(x0, y0, ztop)
    return f'matrix(0.9 0.45 0 1 {f(sx)} {f(sy)})'


def flat(x0, y0, z):
    sx, sy = iso(x0, y0, z)
    return f'matrix(0.9 0.45 -0.9 0.45 {f(sx)} {f(sy)})'


def dashed(points, cased=False):
    d = "M" + " L".join(f"{f(a)} {f(b)}" for a, b in points)
    if cased:
        out.append(f'<path d="{d}" fill="none" stroke="{WHITE}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>')
    out.append(f'<path d="{d}" fill="none" stroke="{B500}" stroke-width="1.2" stroke-dasharray="4 4" stroke-linecap="round"/>')


# ================================================================ layout (world units)
# the phone: the customer's app, light body, lying face up; long axis along y (its head at y=PY)
PX, PY, PW, PH, PR, PT = 0, 0, 196, 372, 30, 14
# the bank card: the hub's object, solid blue, standing on its long edge behind the phone's head
CW, CH, CR, CD = 206, 130, 13, 9      # a real card's 1.59:1, at the family scale (about the phone's width)
CX, CY = 70, -36
K = CW / 292                          # the card's printed detail is laid out at 292 wide, then scaled
# the customer: a client pawn at the phone's foot
MX, MY = 132, 432

# ================================================================ floor: healthtech's, the family standard
FX0, FY0, FX1, FY1 = -96, -126, 342, 512
fx, fy = iso(FX0, FY0)
FW, FH = FX1 - FX0, FY1 - FY0
track([iso(FX0, FY0), iso(FX1, FY0), iso(FX1, FY1), iso(FX0, FY1)])
INS = 45
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#fintech-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the bank card (hero, solid blue), behind the phone
out.append('<!-- The bank card from the hub: solid blue, standing on its long edge behind the app -->')
upright_slab(CX, CY, CH, CW, CH, CR, CD, B600, B700, B600)
g = [f'<g transform="{upright(CX, CY, CH)}">']
g.append(f'<rect width="{CW}" height="{CH}" rx="{CR}" fill="{B500}" stroke="{B600}" stroke-width="1.6"/>')
g.append(f'<g transform="scale({K:.4f})">')
g.append(f'<rect x="28" y="38" width="50" height="38" rx="8" fill="{B100}"/>'
         f'<path d="M28 57 H78 M53 38 V76" stroke="{B300}" stroke-width="{1.2/K:.2f}"/>')
for i, rad in enumerate((9, 17, 25)):
    g.append(f'<path d="M{292-66 + rad*0.55:.1f} {57 - rad} a{rad} {rad} 0 0 1 0 {2*rad}" fill="none" stroke="{WHITE}" '
             f'stroke-width="{2.6/K:.2f}" stroke-linecap="round" stroke-opacity="{0.95 - i*0.22:.2f}"/>')
g.append(f'<rect x="28" y="108" width="204" height="14" rx="7" fill="{WHITE}"/>'
         f'<rect x="28" y="140" width="86" height="10" rx="5" fill="{WHITE}" fill-opacity="0.55"/>'
         f'<rect x="{292-80}" y="138" width="52" height="14" rx="7" fill="{B300}"/>')
g.append('</g></g>')
out.extend(g)

# ================================================================ the phone, lying face up
out.append('<!-- The app: a light phone lying face up, its screen saying what happened and what to try next -->')
flat_slab(PX, PY, PW, PH, PR, PT, B100, B200, B500)
g = [f'<g transform="{flat(PX, PY, PT)}">']
g.append(f'<rect width="{PW}" height="{PH}" rx="{PR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
SX, SYT, SW, SH = 13, 34, PW - 26, PH - 47
g.append(f'<rect x="{SX}" y="{SYT}" width="{SW}" height="{SH}" rx="18" fill="{B50}" stroke="{B500}" stroke-width="1.2"/>')
g.append(f'<rect x="{PW/2-22}" y="15" width="44" height="7" rx="3.5" fill="{B200}"/>')
# header: the payment, a small copy of the card beside its amount
MC = (28, 48, 58, 38)
CHIP = (MC[0] + 8, MC[1] + 8, 15, 11)
g.append(f'<rect x="{MC[0]}" y="{MC[1]}" width="{MC[2]}" height="{MC[3]}" rx="6" fill="{B500}"/>'
         f'<rect x="{CHIP[0]}" y="{CHIP[1]}" width="{CHIP[2]}" height="{CHIP[3]}" rx="2.5" fill="{B100}"/>'
         f'<rect x="{MC[0]+8}" y="{MC[1]+25}" width="40" height="5" rx="2.5" fill="{WHITE}"/>')
g.append(f'<rect x="98" y="55" width="70" height="11" rx="5.5" fill="{B500}"/>'
         f'<rect x="98" y="72" width="44" height="7" rx="3.5" fill="{B300}"/>')
# the payment's track: two steps done, the one that stopped with its reason, and the retry step in lime
TX = 44
S1, S2, S3 = 118, 156, 196
RY, RH = 290, 48                     # the retry row
g.append(f'<path d="M{TX} {S1} V{S3}" stroke="{B500}" stroke-width="2"/>')
g.append(f'<path d="M{TX} {S3 + 14} V{RY}" stroke="{B300}" stroke-width="2" stroke-dasharray="4 4"/>')
for sy in (S1, S2):
    g.append(f'<circle cx="{TX}" cy="{sy}" r="10" fill="{B500}"/>'
             f'<path d="M{TX-4.6} {sy+0.2} l3.2 3.4 l6.2 -6.6" fill="none" stroke="{WHITE}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
             f'<rect x="64" y="{sy-3.5}" width="{86 if sy == S1 else 70}" height="7" rx="3.5" fill="{B300}"/>')
SR = 13
g.append(f'<circle cx="{TX}" cy="{S3}" r="{SR}" fill="{B700}"/>'
         f'<path d="M{TX} {S3-6.5} v6.5" stroke="{WHITE}" stroke-width="3" stroke-linecap="round"/>'
         f'<circle cx="{TX}" cy="{S3+5.6}" r="1.9" fill="{WHITE}"/>')
g.append(f'<rect x="64" y="{S3-3.5}" width="72" height="7" rx="3.5" fill="{B300}"/>')
# the reason, in a white note hanging from the stopped step, its tail pointing at the stop
NX, NY, NW, NH = 64, S3 + 14, 106, 50
note = (f'M{NX+16} {NY} H{NX+NW-10} a10 10 0 0 1 10 10 V{NY+NH-10} a10 10 0 0 1 -10 10 H{NX+10} '
        f'a10 10 0 0 1 -10 -10 V{NY+14} L{TX+SR+2} {S3+5} Z')
g.append(f'<path d="{note}" fill="{WHITE}" stroke="{B500}" stroke-width="1.2" stroke-linejoin="round"/>'
         f'<rect x="{NX+12}" y="{NY+12}" width="80" height="6" rx="3" fill="{B300}"/>'
         f'<rect x="{NX+12}" y="{NY+24}" width="64" height="6" rx="3" fill="{B200}"/>'
         f'<rect x="{NX+12}" y="{NY+36}" width="40" height="6" rx="3" fill="{B200}"/>')
# the way forward: the retry step itself, lit in lime, its node a retry arrow
g.append(f'<rect x="24" y="{RY}" width="{PW-48}" height="{RH}" rx="14" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2"/>')
cy = RY + RH / 2
g.append(f'<circle cx="{TX}" cy="{cy}" r="11" fill="{WHITE}" stroke="{INK}" stroke-width="1.2"/>'
         f'<path d="M{TX+5.2} {cy-2.4} A5.8 5.8 0 1 0 {TX+5.4} {cy+2.6}" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round"/>'
         f'<path d="M{TX+1.6} {cy-3.2} L{TX+5.6} {cy-2.2} L{TX+6.4} {cy-6.4}" fill="none" stroke="{INK}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
         f'<rect x="66" y="{cy-4}" width="76" height="8" rx="4" fill="{INK}"/>')
g.append('</g>')
out.extend(g)

# ================================================================ the payment line: card to its row in the app
mx = PX + CHIP[0] + CHIP[2] / 2       # world x of the mini card's chip
my = PY + CHIP[1] + CHIP[3] / 2       # world y of the same point
LZ = 46                               # the line runs out of the card at this height
a = iso(mx, CY, LZ)
b = iso(mx, my, LZ)
c = iso(mx, my, PT)
out.append('<!-- The payment: a dashed line out of the card, dropping onto its row in the app -->')
dashed([a, b, c], cased=True)
for p in (a, c):
    out.append(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="3.4" fill="{B500}" stroke="{WHITE}" stroke-width="1.5"/>')
track([a, b, c])

# ================================================================ the customer: a client pawn reaching for the retry
bx, by = iso(MX, MY)
body = (f'M{f(bx-18)} {f(by)} V{f(by-42)} A18 18 0 0 1 {f(bx+18)} {f(by-42)} V{f(by)} '
        f'A18 8.5 0 0 1 {f(bx-18)} {f(by)} Z')
out.append('<!-- The customer: a client figure at the foot of the app, reaching for the retry step -->')
# the arm reaches back along -y, up the screen toward the phone
sh = (bx + 6, by - 30)
dx, dy = 0.9, -0.45
L = 30
n = math.hypot(dx, dy)
hand = (sh[0] + dx / n * L, sh[1] + dy / n * L)
out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
out.append(f'<circle cx="{f(bx)}" cy="{f(by-78)}" r="13" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
out.append(f'<mask id="fintech-arm" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400">'
           f'<rect x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>'
           f'<g mask="url(#fintech-arm)"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="8.5" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="6.8" fill="{B500}"/></g>'
           f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="5.3" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="5.2" fill="{WHITE}"/>')
track([(bx - 18, by + 9), (bx + 18, by - 91), (hand[0] + 7, hand[1] - 7)])

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vb = (math.floor(min(xs) - pad), math.floor(min(ys) - pad), math.ceil(max(xs) - min(xs) + 2 * pad), math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for FinTech product design. A solid blue bank card with a chip and a contactless mark "
       "stands on its edge on a dotted floor, behind a light phone lying face up. A dashed line runs out of the card "
       "and drops onto the same card at the head of the phone's screen. Below it the payment's steps: two ticked, the "
       "third stopped with a solid warning mark and a note giving the reason, and the next step, retry, lit in lime. "
       "A customer stands at the foot of the phone, reaching for it.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="fintech-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
