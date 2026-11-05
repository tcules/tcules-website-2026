"""Generator for the /expertise/fintech hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: the hub's bank card pays, and the product says plainly why it was declined and what to try next.

r12 (final polish, 5 Nov): healthtech floor 545 x 402, 865 wide; the terminal at hub scale with the card flat BESIDE it; the hand on the lime key. r11: the product is a card terminal, not a phone. The terminal stands on the floor facing
right-down (healthtech's phone faces left-down), the hub's solid blue bank card lies flat on the floor and runs into
the terminal's slot, so it has a footprint and the two are one object. The terminal's screen says the payment was
declined and why; the way forward is one lime key on its keypad (a key, not a pill button). The customer, a client
pawn at healthtech's size, stands in the clear at the terminal's right and reaches toward it.

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


# ================================================================ layout (world units)
# r12 (family polish): healthtech's floor exactly (545 x 402). The terminal comes down to hub scale and stands at
# the back; the card lies flat BESIDE it on the floor (front-left), not in front of it, so nothing tall rises over
# the card. The customer stands at the terminal's right and touches the lime key.
TW, TH, TD, TR = 140, 262, 46, 20     # face width (along -y), height, depth (back along -x), corner radius
YL = TW / 2
TYC = 0                               # the terminal's centre line in y
CWID, CLEN, CT, CR = 130, 206, 4, 12  # the hub card: a real card's 1.59:1, 4 thick
CX0, CY = -30, 152                     # the card's near end (x) and centre line (y): beside the terminal, front-left
MX, MY = 22, -80                      # the customer, in front of the terminal's right edge

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
    f'<rect width="{FW}" height="{FH}" fill="url(#fintech-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the terminal
out.append('<!-- The card terminal: a light box standing on the floor; its screen says why, its lime key retries -->')
loc = rr_outline(TW, TH, TR)


def tscr(u, v, d):
    """face point (u right, v down from the top) pushed back by d."""
    return iso(-d, TYC + YL - u, TH - v)


allp = [tscr(u, v, d) for (u, v) in loc for d in (0, TD)]
left = [tscr(u, v, d) for (u, v) in loc if u <= TR + 0.01 for d in (0, TD)]
track(allp)
poly(hull(allp), B100)          # top
poly(hull(left), B200)          # left side, toward the viewer's left
ox, oy = tscr(0, 0, 0)
g = [f'<g transform="matrix(0.9 -0.45 0 1 {f(ox)} {f(oy)})">']
g.append(f'<rect width="{TW}" height="{TH}" rx="{TR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
# the screen: dark blue; the declined card with a warning on it, a title, and the reason written out
SX, SY, SW, SH = 12, 14, TW - 24, 122
g.append(f'<rect x="{SX}" y="{SY}" width="{SW}" height="{SH}" rx="10" fill="{B500}" stroke="{B600}" stroke-width="1.2"/>')
CGX, CGY, CGW, CGH = SX + 12, SY + 18, 38, 25
g.append(f'<rect x="{CGX}" y="{CGY}" width="{CGW}" height="{CGH}" rx="4" fill="{B200}"/>'
         f'<rect x="{CGX+6}" y="{CGY+7}" width="9" height="7" rx="2" fill="{B500}"/>'
         f'<rect x="{CGX+6}" y="{CGY+17}" width="22" height="3" rx="1.5" fill="{B300}"/>')
WX, WY, WR = CGX + CGW - 2, CGY + CGH - 1, 10.5
g.append(f'<circle cx="{WX}" cy="{WY}" r="{WR}" fill="{WHITE}" stroke="{B500}" stroke-width="2.4"/>'
         f'<path d="M{WX} {f(WY-5.2)} v5.4" stroke="{B500}" stroke-width="2.8" stroke-linecap="round"/>'
         f'<circle cx="{WX}" cy="{f(WY+4.6)}" r="1.7" fill="{B500}"/>')
g.append(f'<rect x="{SX+62}" y="{SY+20}" width="{SW-76}" height="8" rx="4" fill="{WHITE}"/>'
         f'<rect x="{SX+62}" y="{SY+33}" width="{SW-92}" height="6" rx="3" fill="{B300}"/>')
g.append(f'<rect x="{SX+12}" y="{SY+64}" width="{SW-24}" height="6" rx="3" fill="{B200}"/>'
         f'<rect x="{SX+12}" y="{SY+79}" width="{SW-44}" height="6" rx="3" fill="{B200}"/>'
         f'<rect x="{SX+12}" y="{SY+94}" width="{SW-68}" height="6" rx="3" fill="{B200}"/>')
# the keypad: nine pale keys and a row of three, the right one lime with a retry arrow
KW, KH, KG, KV = 32, 16, 10, 8
KX0 = (TW - (3 * KW + 2 * KG)) / 2
KY0 = SY + SH + 14
for r in range(3):
    for c in range(3):
        g.append(f'<rect x="{f(KX0 + c*(KW+KG))}" y="{f(KY0 + r*(KH+KV))}" width="{KW}" height="{KH}" rx="5" fill="{B100}"/>')
FY = KY0 + 3 * (KH + KV) + 2
FKH = 24
for c in range(2):
    g.append(f'<rect x="{f(KX0 + c*(KW+KG))}" y="{f(FY)}" width="{KW}" height="{FKH}" rx="7" fill="{WHITE}" stroke="{B300}" stroke-width="1.2"/>')
LX = KX0 + 2 * (KW + KG)
g.append(f'<rect x="{f(LX)}" y="{f(FY)}" width="{KW}" height="{FKH}" rx="7" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2"/>')
rcx, rcy, rr = LX + KW / 2 - 1.5, FY + FKH / 2, 5.4
a0 = (rcx + rr * math.cos(math.radians(-60)), rcy + rr * math.sin(math.radians(-60)))
a1 = (rcx + rr * math.cos(math.radians(220)), rcy + rr * math.sin(math.radians(220)))
t = (-math.sin(math.radians(220)), math.cos(math.radians(220)))
n = (-t[1], t[0])
tip = (a1[0] + t[0] * 3.8, a1[1] + t[1] * 3.8)
hb = [(a1[0] + n[0] * 3.2 - t[0] * 0.5, a1[1] + n[1] * 3.2 - t[1] * 0.5),
      (a1[0] - n[0] * 3.2 - t[0] * 0.5, a1[1] - n[1] * 3.2 - t[1] * 0.5)]
g.append(f'<path d="M{f(a0[0])} {f(a0[1])} A{rr} {rr} 0 1 1 {f(a1[0])} {f(a1[1])}" fill="none" stroke="{INK}" stroke-width="2.1" stroke-linecap="round"/>'
         f'<path d="M{f(tip[0])} {f(tip[1])} L{f(hb[0][0])} {f(hb[0][1])} L{f(hb[1][0])} {f(hb[1][1])} Z" fill="{INK}" stroke="{INK}" stroke-width="1" stroke-linejoin="round"/>')
g.append('</g>')
out.extend(g)
# where the finger lands: the lime key's right-hand edge, a little in from it
KEY_TOUCH = (0, TYC + YL - (LX + KW + 1), TH - (FY + FKH / 2))

# ================================================================ the bank card, flat on the floor beside the terminal
out.append('<!-- The bank card from the hub: solid blue, lying flat on the floor beside the terminal -->')
L = CLEN
cl = (arc_pts(L - CR, -CWID / 2 + CR, CR, -90, 0) + arc_pts(L - CR, CWID / 2 - CR, CR, 0, 90)
      + arc_pts(CR, CWID / 2 - CR, CR, 90, 180) + arc_pts(CR, -CWID / 2 + CR, CR, 180, 270))


def cw(u, v, z):
    return iso(CX0 + u, CY + v, z)


edge_all = [cw(u, v, z) for (u, v) in cl for z in (0, CT)]
edge_end = [cw(u, v, z) for (u, v) in cl if u >= L - CR - 0.01 for z in (0, CT)]
track(edge_all)
poly(hull(edge_all), B600, B600, 1.2)
poly(hull(edge_end), B700, B600, 1.2)
top = [cw(u, v, CT) for (u, v) in cl]
poly(top, B500, B600, 1.6)
fx0, fy0 = cw(0, 0, CT)
g = [f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx0)} {f(fy0)})">']
g.append(f'<rect x="{L-62}" y="{-CWID/2+20}" width="34" height="26" rx="5.5" fill="{B100}"/>'
         f'<path d="M{L-62} {-CWID/2+33} H{L-28} M{L-45} {-CWID/2+20} V{-CWID/2+46}" stroke="{B300}" stroke-width="1.2"/>')
for i, rad in enumerate((6, 11.5, 17)):
    g.append(f'<path d="M{f(L-100 - rad)} {f(-CWID/2+33)} a{rad} {rad} 0 0 1 {f(2*rad)} 0" transform="rotate(180 {f(L-100)} {f(-CWID/2+33)})" '
             f'fill="none" stroke="{WHITE}" stroke-width="2.2" stroke-linecap="round" stroke-opacity="{0.95 - i*0.22:.2f}"/>')
g.append(f'<rect x="30" y="8" width="{L-58}" height="10" rx="5" fill="{WHITE}"/>'
         f'<rect x="30" y="32" width="70" height="8" rx="4" fill="{WHITE}" fill-opacity="0.55"/>'
         f'<rect x="{L-66}" y="30" width="38" height="11" rx="5.5" fill="{B300}"/>')
g.append('</g>')
out.extend(g)

# ================================================================ the customer: a client pawn pressing the lime key
# healthtech's pawn exactly: body radius 22, body height 62, head 16; arm 11 incl. a 1.6 outline, hand 8.8
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8
bx, by = iso(MX, MY)
body = (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
        f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')
out.append('<!-- The customer: a client figure at the terminal, pressing the lime key -->')
sh = (bx - 8, by - H + 22)
hand = iso(*KEY_TOUCH)
ARM_LEN = math.hypot(hand[0] - sh[0], hand[1] - sh[1])
out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
out.append(f'<circle cx="{f(bx)}" cy="{f(by-H-R-4-HEAD)}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
out.append(f'<mask id="fintech-arm" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400">'
           f'<rect x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>'
           f'<g mask="url(#fintech-arm)"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>'
           f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="{f(ARM-2*OUT)}" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND-OUT)}" fill="{WHITE}"/>')
track([(bx - R, by + 11), (bx + R, by - H - R - 4 - 2 * HEAD), (hand[0] - 9, hand[1] - 9)])
print("arm length", round(ARM_LEN, 1))

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = max(865, math.ceil(max(xs) - min(xs) + 2 * pad))
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for FinTech product design. A solid blue bank card with a chip lies flat on a dotted "
       "floor and runs into the slot of a light card terminal standing behind it. The terminal's dark blue screen shows "
       "a warning mark with the reason for the decline written out under it, and on its keypad one key, the retry key, "
       "is lit in lime. A customer stands beside the terminal, reaching toward it.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="fintech-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
