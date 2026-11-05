"""Generator for the /audits/ai-product-ux-readiness hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: before the AI feature reaches everyone, a user works it on a real task while we check each thing the AI made:
this answer shows its source and can be undone; that one shows neither, so we mark it.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z).
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
SLUG = "aiuxr"

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


def ai_badge(x, y, w=34, h=16):
    """the small "AI" badge (face units): a blue pill with the two letters drawn as white strokes."""
    cx, cy = x + w / 2, y + h / 2
    lh = h * 0.5
    ax0 = cx - 6.5
    return (f'<rect x="{f(x)}" y="{f(y)}" width="{w}" height="{h}" rx="{h/2}" fill="{B500}"/>'
            f'<path d="M{f(ax0)} {f(cy+lh/2)} L{f(ax0+3.6)} {f(cy-lh/2)} L{f(ax0+7.2)} {f(cy+lh/2)} '
            f'M{f(ax0+1.5)} {f(cy+lh/2-2.2)} H{f(ax0+5.7)} M{f(cx+5)} {f(cy-lh/2)} V{f(cy+lh/2)}" '
            f'fill="none" stroke="{WHITE}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>')


# ================================================================ layout (world units)
# r8: family scale. The lid is about 1.3 figures tall (fintech's terminal is 140 x 262 face; this lid 196 x 156),
# the people stand on the floor beside it, and their arms come out near fintech's 34.
LW, LD, BT = 212, 112, 6        # laptop base: width (x), depth (y), thickness
LH, LT, LR = 188, 6, 11         # lid: height, thickness (back along -y), corner radius
SI, CHIN = 9, 6                 # screen inset, chin
XD, YD0, YD1 = -40, -6, 84      # the source document: stands in the plane x = XD facing +x, y from YD0 to YD1
DH_, DT, DR = 146, 6, 8         # its height, thickness (back along -x), radius
FOOT = 5                        # the low plate it stands on
# screen (face units, v down from the lid's top)
SX, SY = SI, SI
SWD, SHT = LW - 2 * SI, LH - 2 * SI - CHIN
DX, DY, DW, DH = SX + 8, SY + 10, LW - 2 * SI - 16 - 8 - 46, 64               # the AI draft
LINK_V = DY + 45                                        # its second line, the one the source backs
BX0 = DX + DW + 8
BW, CH = SX + SWD - 8 - BX0, 25
MX, MY, MW = DX, DY + DH + 14, SWD - 16
MH = SY + SHT - 8 - MY
Z_LINK = BT + LH - LINK_V

# ================================================================ floor: the family plate, cut to this scene (440 x 330)
FX0, FY0 = -112, -58
FX1, FY1 = FX0 + 440, FY0 + 330
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


def slab(x0, y0, w, d, t, r, top=WHITE, front=B200, side=B100, z0=0):
    """a rounded slab lying on the floor: x0..x0+w, y0..y0+d, z0..z0+t. Returns the top's corner for a floor-plane group."""
    loc = rr_outline(w, d, r)
    edge = [iso(x0 + u, y0 + v, z) for (u, v) in loc for z in (z0, z0 + t)]
    track(edge)
    poly(hull(edge), front)
    poly(hull([iso(x0 + u, y0 + v, z) for (u, v) in loc if u >= w - r - 0.01 for z in (z0, z0 + t)]), side)
    poly([iso(x0 + u, y0 + v, z0 + t) for (u, v) in loc], top)
    return iso(x0, y0, z0 + t)


# ================================================================ the source document, on its foot, left of the laptop
out.append('<!-- The source: a document standing on a low foot beside the laptop, facing it; one passage is what the AI quotes -->')
slab(XD - DT - 12, YD0 - 10, DT + 26, YD1 - YD0 + 20, FOOT, 6, top=B50, front=B200, side=B100)
DW_ = YD1 - YD0
dloc = rr_outline(DW_, DH_, DR)


def dpt(u, v, d):
    return iso(XD - d, YD1 - u, FOOT + DH_ - v)


allp = [dpt(u, v, d) for (u, v) in dloc for d in (0, DT)]
track(allp)
poly(hull(allp), B100)
poly(hull([dpt(u, v, d) for (u, v) in dloc if u <= DR + 0.01 for d in (0, DT)]), B200)
ox, oy = dpt(0, 0, 0)
g = [f'<g transform="matrix(0.9 -0.45 0 1 {f(ox)} {f(oy)})">']
g.append(f'<rect width="{DW_}" height="{DH_}" rx="{DR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
SRC_V = FOOT + DH_ - Z_LINK          # the document line level with the draft's linked line
U_LINK = YD1 - 0                      # where the link (running along -x at y = 0) meets this face
g.append(f'<rect x="10" y="{f(SRC_V-24)}" width="{DW_-38}" height="7" rx="3.5" fill="{B300}"/>')
for dv, wv in ((18, DW_ - 22), (31, DW_ - 30), (44, DW_ - 20), (57, DW_ - 36), (70, DW_ - 26)):
    if SRC_V + dv + 3 < DH_ - 8:
        g.append(f'<rect x="10" y="{f(SRC_V+dv-2.5)}" width="{wv}" height="5" rx="2.5" fill="{B200}"/>')
g.append(f'<rect x="6" y="{f(SRC_V-6)}" width="{f(U_LINK-6)}" height="12" rx="6" fill="{B100}"/>'
         f'<rect x="11" y="{f(SRC_V-2.5)}" width="{f(U_LINK-22)}" height="5" rx="2.5" fill="{B500}"/>')
g.append('</g>')
out.extend(g)

# ================================================================ the laptop: lid, then the base in front of it
out.append('<!-- The laptop: a light body; the dark blue screen shows what the AI made -->')
lloc = rr_outline(LW, LH, LR)


def lpt(u, v, d):
    return iso(u, -d, BT + LH - v)


allp = [lpt(u, v, d) for (u, v) in lloc for d in (0, LT)]
track(allp)
poly(hull(allp), B100)
poly(hull([lpt(u, v, d) for (u, v) in lloc if u >= LW - LR - 0.01 for d in (0, LT)]), B200)
lx, ly = lpt(0, 0, 0)
g = [f'<g transform="matrix(0.9 0.45 0 1 {f(lx)} {f(ly)})">']
g.append(f'<rect width="{LW}" height="{LH}" rx="{LR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
g.append(f'<rect x="{SX}" y="{SY}" width="{SWD}" height="{SHT}" rx="7" fill="{B500}" stroke="{B600}" stroke-width="1.2"/>')
# the AI draft
g.append(f'<rect x="{DX}" y="{DY}" width="{DW}" height="{DH}" rx="6" fill="{WHITE}"/>')
g.append(ai_badge(DX + 8, DY + 8, 30, 15))
g.append(f'<rect x="{DX+44}" y="{DY+13}" width="{DW-58}" height="5" rx="2.5" fill="{B300}"/>')
g.append(f'<rect x="{DX+8}" y="{DY+31}" width="{DW-22}" height="5" rx="2.5" fill="{B200}"/>')
g.append(f'<rect x="0" y="{LINK_V-6}" width="{DW-30}" height="12" rx="6" fill="{B100}" transform="translate({DX+4} 0)"/>'
         f'<rect x="{DX+8}" y="{LINK_V-2.5}" width="{DW-44}" height="5" rx="2.5" fill="{B500}"/>')
# the person's controls: tick and the lime undo, the pointer on it
CY_T, CY_U = DY + 2, DY + DH - 2 - CH
g.append(f'<rect x="{BX0}" y="{CY_T}" width="{BW}" height="{CH}" rx="{CH/2}" fill="{WHITE}"/>'
         f'<path d="M{f(BX0+BW/2-6.5)} {f(CY_T+CH/2)} l4.5 4.5 l8.5 -9" fill="none" stroke="{B500}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="{BX0}" y="{CY_U}" width="{BW}" height="{CH}" rx="{CH/2}" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2"/>')
ucx, ucy, ur = BX0 + BW / 2 - 1, CY_U + CH / 2 + 1.2, 5.6
g.append(f'<path d="M{f(ucx-1)} {f(ucy+ur)} A{ur} {ur} 0 1 0 {f(ucx-ur)} {f(ucy-1.6)}" fill="none" stroke="{INK}" stroke-width="2.1" stroke-linecap="round"/>'
         f'<path d="M{f(ucx-ur-3.8)} {f(ucy-4)} L{f(ucx-ur+0.5)} {f(ucy+2.4)} L{f(ucx-ur+3.2)} {f(ucy-4.8)} Z" fill="{INK}" stroke="{INK}" stroke-width="1" stroke-linejoin="round"/>')
px, py = ucx + 7, ucy - 5
g.append(f'<path d="M{f(px)} {f(py)} l0 13 l3.4 -3 l2.2 4.9 l2.6 -1.2 l-2.2 -4.8 l4.5 -0.4 Z" fill="{WHITE}" stroke="{B500}" stroke-width="1.3" stroke-linejoin="round"/>')
# the marked result: no source, no undo; ringed, with a question mark
g.append(f'<rect x="{MX}" y="{MY}" width="{MW}" height="{MH}" rx="6" fill="{B600}"/>')
g.append(ai_badge(MX + 8, MY + (MH - 15) / 2, 30, 15).replace(f'fill="{B500}"', f'fill="{B200}"', 1).replace(f'stroke="{WHITE}"', f'stroke="{B600}"'))
g.append(f'<rect x="{MX+46}" y="{f(MY+MH/2-7)}" width="{MW-96}" height="5" rx="2.5" fill="{B300}"/>'
         f'<rect x="{MX+46}" y="{f(MY+MH/2+2)}" width="{MW-122}" height="5" rx="2.5" fill="{B300}"/>')
QX, QY, QR = MX + MW - 19, MY + MH / 2, 11
g.append(f'<circle cx="{QX}" cy="{f(QY)}" r="{QR}" fill="{WHITE}"/>'
         f'<path d="M{f(QX-3.8)} {f(QY-3.4)} A4 4 0 1 1 {f(QX+1.3)} {f(QY+0.5)} Q{f(QX)} {f(QY+1.4)} {f(QX)} {f(QY+3)}" '
         f'fill="none" stroke="{B500}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
         f'<circle cx="{QX}" cy="{f(QY+7)}" r="1.6" fill="{B500}"/>')
g.append(f'<rect x="{MX-4}" y="{MY-4}" width="{MW+8}" height="{MH+8}" rx="9" fill="none" stroke="{WHITE}" '
         f'stroke-width="1.7" stroke-dasharray="1.4 4.4" stroke-linecap="round"/>')
g.append('</g>')
out.extend(g)
# the link: from the draft's backed line, along -x, to the passage on the document's face
p0 = iso(DX + 4, 0, Z_LINK)
pe = iso(SX, 0, Z_LINK)
p1 = iso(XD, 0, Z_LINK)
out.append('<!-- The draft names its source: a dashed link out to the passage it quotes -->')
out.append(f'<path d="M{f(p0[0])} {f(p0[1])} L{f(pe[0])} {f(pe[1])}" stroke="{WHITE}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round"/>'
           f'<path d="M{f(pe[0])} {f(pe[1])} L{f(p1[0])} {f(p1[1])}" stroke="{B500}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round"/>'
           f'<circle cx="{f(p1[0])}" cy="{f(p1[1])}" r="3" fill="{B500}"/>')
POINT = iso(LW - 2, 0, BT + LH - (MY + MH / 2) - 2)

# base
ox, oy = slab(0, 0, LW, LD, BT, 10)
g = [f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(ox)} {f(oy)})">']
KX0, KX1, KY0, KY1 = 20, LW - 20, 10, 56
g.append(f'<rect x="{KX0}" y="{KY0}" width="{KX1-KX0}" height="{KY1-KY0}" rx="5" fill="{B100}"/>')
for r in range(3):
    g.append(f'<rect x="{KX0+6}" y="{KY0+7+r*13}" width="{KX1-KX0-12}" height="7" rx="3" fill="{B200}" fill-opacity="0.75"/>')
TPX, TPY, TPW, TPH = LW / 2 - 28, KY1 + 9, 56, 34
g.append(f'<rect x="{TPX}" y="{TPY}" width="{TPW}" height="{TPH}" rx="5" fill="{B100}"/>')
g.append('</g>')
out.extend(g)
TRACKPAD = iso(TPX + 26, TPY + 30, BT)
UX, UY = TPX + 20, LD + 24            # the client user, on the floor in front of the laptop
TX, TY = LW + 28, -12                 # the Tcules reviewer, on the floor at the lid's right

# ================================================================ people
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8


def body_path(bx, by):
    return (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
            f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')


# the users the feature reaches next: faded pawns waiting on the floor, front-left
out.append('<!-- The users it reaches next: faded figures waiting at the front-left -->')
for (wx, wy) in sorted(((-18, 176), (-50, 214), (18, 222)), key=lambda p: p[0] + p[1]):
    fbx, fby = iso(wx, wy)
    out.append(f'<path d="{body_path(fbx, fby)}" fill="{B50}" stroke="{B300}" stroke-width="1.6" stroke-linejoin="round"/>'
               f'<circle cx="{f(fbx)}" cy="{f(fby-H-R-4-HEAD)}" r="{HEAD}" fill="{B50}" stroke="{B300}" stroke-width="1.6"/>')
    track([(fbx - R, fby + 11), (fbx + R, fby - H - R - 4 - 2 * HEAD)])

# the client user: white, at the keyboard, hand on the keys
bx, by = iso(UX, UY)
body = body_path(bx, by)
sh = (bx + 8, by - H + 22)
hand = TRACKPAD
out.append('<!-- The client user: a white figure at the keyboard, using the feature on a real task -->')
out.append(f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>')
out.append(f'<circle cx="{f(bx)}" cy="{f(by-H-R-4-HEAD)}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>')
out.append(f'<mask id="{SLUG}-arm" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400">'
           f'<rect x="{f(bx-200)}" y="{f(by-200)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>'
           f'<g mask="url(#{SLUG}-arm)"><path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/></g>'
           f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{WHITE}" stroke-width="{f(ARM-2*OUT)}" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND-OUT)}" fill="{WHITE}"/>')
track([(bx - R, by + 11), (bx + R, by - H - R - 4 - 2 * HEAD)])
print("client arm", round(math.hypot(hand[0] - sh[0], hand[1] - sh[1]), 1))

# the Tcules tester: solid blue with a white edge, pressing undo
bx, by = iso(TX, TY)
body = body_path(bx, by)
sh = (bx - 8, by - H + 22)
hand = POINT
hy = by - H - R - 4 - HEAD
WE = 2.0
out.append('<!-- The Tcules tester: a blue figure at the screen, pointing out the result nobody can check -->')
out.append(f'<g fill="none" stroke="{WHITE}" stroke-linecap="round" stroke-linejoin="round">'
           f'<path d="{body}" stroke-width="{2*WE+1.6}"/><circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" stroke-width="{2*WE}"/>'
           f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke-width="{ARM+2*WE}"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" stroke-width="{2*WE}"/></g>')
out.append(f'<path d="{body}" fill="{B500}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
           f'<circle cx="{f(bx)}" cy="{f(hy)}" r="{HEAD}" fill="{B500}"/>'
           f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hand[0])} {f(hand[1])}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
           f'<circle cx="{f(hand[0])}" cy="{f(hand[1])}" r="{f(HAND)}" fill="{B500}"/>')
track([(bx - R, by + 11), (bx + R, hy - HEAD - 2)])
print("tester arm", round(math.hypot(hand[0] - sh[0], hand[1] - sh[1]), 1))

svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = math.ceil(max(xs) - min(xs) + 2 * pad)
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for an AI UX audit. A light laptop stands on a dotted floor. On its dark blue screen "
       "an answer marked AI is linked by a dashed line to the passage it quotes in a document standing on a small foot "
       "beside the laptop, and next to the answer are a tick button and a lime undo button with the pointer on it. Below, "
       "a second AI result shows no source and no undo; it is ringed with a dotted outline and carries a question mark. "
       "A client user stands at the keyboard, a blue Tcules reviewer points at the questioned result, and three faded "
       "figures wait at the side: the users the feature reaches next.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs><pattern id="{SLUG}-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern></defs>\n'
    + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
