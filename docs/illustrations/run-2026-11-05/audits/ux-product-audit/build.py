"""Generator for the /audits/ux-product-audit hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: one workflow walked step by step; the place people stall is marked, and a trace runs back from it to the
one upstream step that causes it, so the team can see what to fix first.

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
PW, PH, PD, PR = 96, 226, 10, 12      # a step screen: face width (along x), height, depth (back along -y), radius
GAP = 62                               # air between two steps
N = 4
PX0 = -240                             # the first step's left edge (x)
YP = -112                              # the plane the step screens stand in (their front face)
ST = 7                                 # the workflow strip's thickness
SY0, SY1 = YP - PD - 14, YP + 64       # the strip runs under the screens and the people
SX0, SX1 = PX0 - 18, PX0 + N * PW + (N - 1) * GAP + 18
SR = 18
MY = YP + 30                           # where the people stand (y), on the strip in front of their step
CAUSE, STALL = 1, 3                    # step 2 causes the stall people hit at step 4
DV = 60                                # the header row added above the content
FIELD = (14, 64 + DV, PW - 28, 52)          # the step's main field, face coords (x, y, w, h)
BTN = (20, 130 + DV, 46, 18)      # the step's action button


def px(i):
    return PX0 + i * (PW + GAP)


# ================================================================ floor: the family plate
FX0, FY0 = -300, -236
FX1, FY1 = FX0 + 664, FY0 + 280
fx, fy = iso(FX0, FY0)
FW, FH = FX1 - FX0, FY1 - FY0
track([iso(FX0, FY0), iso(FX1, FY0), iso(FX1, FY1), iso(FX0, FY1)])
INS = 45
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#uxa-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)

# ================================================================ the workflow strip: the hero object
out.append('<!-- The workflow: one solid blue path on the floor that every step stands on -->')
SL, SWD = SX1 - SX0, SY1 - SY0
sl = rr_outline(SL, SWD, SR)


def sw_(u, v, z):
    return iso(SX0 + u, SY0 + v, z)


edge_all = [sw_(u, v, z) for (u, v) in sl for z in (0, ST)]
edge_end = [sw_(u, v, z) for (u, v) in sl if u >= SL - SR - 0.01 for z in (0, ST)]
track(edge_all)
poly(hull(edge_all), B600, B600, 1.2)
poly(hull(edge_end), B700, B600, 1.2)
poly([sw_(u, v, ST) for (u, v) in sl], B500, B600, 1.6)
# flow chevrons between the steps, white on the strip, pointing downstream (+x)
tx, ty = sw_(0, 0, ST)
g = [f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(tx)} {f(ty)})">']
for i in range(N - 1):
    cx = px(i) + PW + GAP / 2 - SX0
    cy = YP + 54 - SY0
    g.append(f'<path d="M{f(cx-7)} {f(cy-10)} L{f(cx+9)} {f(cy)} L{f(cx-7)} {f(cy+10)} Z" fill="{WHITE}" '
             f'stroke="{WHITE}" stroke-width="2" stroke-linejoin="round"/>')
g.append('</g>')
out.extend(g)


# ================================================================ the step screens
def face_pt(i, u, v, d=0.0):
    return iso(px(i) + u, YP - d, ST + PH - v)


def screen(i):
    loc = rr_outline(PW, PH, PR)
    allp = [face_pt(i, u, v, d) for (u, v) in loc for d in (0, PD)]
    right = [face_pt(i, u, v, d) for (u, v) in loc if u >= PW - PR - 0.01 for d in (0, PD)]
    track(allp)
    poly(hull(allp), B100)
    poly(hull(right), B200)
    ox, oy = face_pt(i, 0, 0)
    g = [f'<g transform="matrix(0.9 0.45 0 1 {f(ox)} {f(oy)})">']
    g.append(f'<rect width="{PW}" height="{PH}" rx="{PR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
    # a step's screen: a title, two lines, the step's main field, and its action button
    # the step marker: four dots, this step's filled
    for k in range(N):
        cxk = PW / 2 + (k - (N - 1) / 2) * 14
        g.append(f'<circle cx="{f(cxk)}" cy="18" r="4" fill="{B500 if k == i else B200}"/>')
    g.append(f'<circle cx="25" cy="{27+26}" r="11" fill="{B100}"/>'
             f'<rect x="44" y="{20+26}" width="{PW-60}" height="6" rx="3" fill="{B200}"/>'
             f'<rect x="44" y="{31+26}" width="{PW-76}" height="5" rx="2.5" fill="{B100}"/>'
             f'<rect x="14" y="{16+DV}" width="{PW-46}" height="8" rx="4" fill="{B300}"/>'
             f'<rect x="14" y="{34+DV}" width="{PW-28}" height="6" rx="3" fill="{B200}"/>'
             f'<rect x="14" y="{46+DV}" width="{PW-48}" height="6" rx="3" fill="{B200}"/>')
    fx_, fy_, fw_, fh_ = FIELD
    if i == CAUSE:
        g.append(f'<rect x="{fx_}" y="{fy_}" width="{fw_}" height="{fh_}" rx="8" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2"/>'
                 f'<rect x="{fx_+12}" y="{fy_+12}" width="{fw_-34}" height="6" rx="3" fill="{INK}"/>'
                 f'<rect x="{fx_+12}" y="{fy_+25}" width="{fw_-50}" height="6" rx="3" fill="{INK}" fill-opacity="0.35"/>')
    else:
        g.append(f'<rect x="{fx_}" y="{fy_}" width="{fw_}" height="{fh_}" rx="8" fill="{B50}" stroke="{B200}" stroke-width="1.2"/>'
                 f'<rect x="{fx_+12}" y="{fy_+12}" width="{fw_-34}" height="6" rx="3" fill="{B200}"/>'
                 f'<rect x="{fx_+12}" y="{fy_+25}" width="{fw_-50}" height="6" rx="3" fill="{B100}"/>')
    bx, by, bw, bh = BTN
    if i == STALL:
        g.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="{bh/2}" fill="{B100}"/>'
                 f'<rect x="{bx-5}" y="{by-5}" width="{bw+10}" height="{bh+10}" rx="{bh/2+5}" fill="none" stroke="{B500}" '
                 f'stroke-width="2.2" stroke-dasharray="0.1 4.6" stroke-linecap="round"/>')
    else:
        g.append(f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="{bh/2}" fill="{B500}"/>'
                 f'<rect x="{bx+11}" y="{by+bh/2-2}" width="{bw-22}" height="4" rx="2" fill="{WHITE}"/>')
    g.append('</g>')
    out.extend(g)


out.append('<!-- Four steps of one workflow, standing in order along the path -->')
for i in range(N):
    screen(i)


# ================================================================ people
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8


def pawn(x, y, z, tcules, reach=None, slug="p"):
    bx, by = iso(x, y, z)
    body = (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
            f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')
    hy = by - H - R - 4 - HEAD
    track([(bx - R - 2, by + 12), (bx + R + 2, hy - HEAD - 2)])
    if tcules:
        out.append(f'<path d="{body}" fill="{B500}" stroke="{WHITE}" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"/>')
        out.append(f'<circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" fill="{B500}" stroke="{WHITE}" stroke-width="3.6" paint-order="stroke"/>')
    else:
        out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
        out.append(f'<circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
    if reach is None:
        return
    sh = (bx + 6, by - H + 14)
    hand = reach
    mid = f'uxa-arm-{slug}'
    out.append(f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400">'
               f'<rect x="{f(bx-200)}" y="{f(by-260)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>')
    line = f'M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}'
    if tcules:
        out.append(f'<g mask="url(#{mid})"><path d="{line}" stroke="{WHITE}" stroke-width="{f(ARM+3.6)}" stroke-linecap="round"/>'
                   f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND+1.8)}" fill="{WHITE}"/>'
                   f'<path d="{line}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
                   f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>')
    else:
        out.append(f'<g mask="url(#{mid})"><path d="{line}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
                   f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>'
                   f'<path d="{line}" stroke="{WHITE}" stroke-width="{f(ARM-2*OUT)}" stroke-linecap="round"/>'
                   f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND-OUT)}" fill="{WHITE}"/>')
    track([(hand[0] - 10, hand[1] - 10), (hand[0] + 10, hand[1] + 10)])
    print(slug, "arm length", round(math.hypot(hand[0] - sh[0], hand[1] - sh[1]), 1))


bx_, by_, bw_, bh_ = BTN
out.append('<!-- Two people, each in front of the gap beside their screen: the Tcules designer at the cause, a client stuck at the stall -->')
# a figure in front of the gap to the left of its step, so no body crosses a screen's content; only the arm reaches in
tc_touch = face_pt(CAUSE, FIELD[0] + 10, FIELD[1] + FIELD[3] - 12)
pawn(px(CAUSE) - 8, MY, ST, True, reach=tc_touch, slug="tc")
st_touch = face_pt(STALL, bx_ - 13, by_ + bh_ / 2)
pawn(px(STALL) - 10, MY, ST, False, reach=st_touch, slug="cl")

# ================================================================ the stall mark and the trace back to its cause
out.append('<!-- The stall at step 4, and the dashed trace that runs back to the step that causes it -->')
UB = PW / 2
TOPZ = ST + PH
LIFT = 48
a = face_pt(STALL, UB, -LIFT)
b = face_pt(CAUSE, UB, -LIFT)
c = face_pt(CAUSE, UB, -11)
dr = 18
disc = face_pt(STALL, UB, -dr + 1)
start = (disc[0], disc[1] - dr)
out.append(f'<path d="M{f(start[0])} {f(start[1])} L{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])} L{f(c[0])} {f(c[1])}" fill="none" '
           f'stroke="{B500}" stroke-width="1.8" stroke-dasharray="5 5" stroke-linejoin="round" stroke-linecap="round"/>')
tip = face_pt(CAUSE, UB, -1.5)
out.append(f'<path d="M{f(tip[0])} {f(tip[1])} L{f(tip[0]-6)} {f(tip[1]-10)} L{f(tip[0]+6)} {f(tip[1]-10)} Z" fill="{B500}" '
           f'stroke="{B500}" stroke-width="1.2" stroke-linejoin="round"/>')
track([a, b])
# the stall mark: a white disc with a warning, sitting on the stalled step's top edge
out.append(f'<circle cx="{f(disc[0])}" cy="{f(disc[1])}" r="{dr}" fill="{WHITE}" stroke="{B500}" stroke-width="2.2"/>'
           f'<path d="M{f(disc[0])} {f(disc[1]-9)} v9.5" stroke="{B500}" stroke-width="3.6" stroke-linecap="round"/>'
           f'<circle cx="{f(disc[0])}" cy="{f(disc[1]+7.4)}" r="2.3" fill="{B500}"/>')

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = max(860, math.ceil(max(xs) - min(xs) + 2 * pad))
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration of a UX audit. Four screens of one workflow stand in order along a solid blue path on "
       "a dotted floor. At the last step a client is stuck: they reach for a button that cannot be pressed, circled, "
       "with a warning mark on top of the screen. A dashed line runs back from that warning, over the screens, to the "
       "second step, whose main field is lit in lime, where a Tcules designer has a hand on the cause.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="uxa-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
