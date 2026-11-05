"""Generator for the /audits/design-to-code-audit hero. Run: python3 build.py  (writes hero.svg beside it).

Idea: put the approved design beside the shipped screen, match them piece by piece, and the one piece that never
made it is plain to see, traced straight back to where it was designed.

World: floor x runs right-down, floor y runs left-down, z is up. True 2:1 iso, the family's projection:
screen = (0.9x - 0.9y, 0.45x + 0.45y - z). Both devices face +y (toward the viewer's lower left) and stand in a
row along the floor's back-right edge; the two people stand in front of them.
"""
import math, os

B500, B600, B700 = "#0048FF", "#003EE0", "#0031B0"
B300, B200, B100, B50 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
WHITE, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
SLUG = "d2c"

out = []
defs = []
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


# ================================================================ floor: healthtech's plate (545 x 402)
FX0, FY0 = -272, -201
FW, FH = 545, 402
fx, fy = iso(FX0, FY0)
track([iso(FX0, FY0), iso(FX0 + FW, FY0), iso(FX0 + FW, FY0 + FH), iso(FX0, FY0 + FH)])
INS = 45
out.append('<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->')
out.append(
    f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(fx)} {f(fy)})">'
    f'<rect width="{FW}" height="{FH}" fill="url(#{SLUG}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B500}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="{INS}" y="{INS}" width="{FW - 2 * INS}" height="{FH - 2 * INS}" fill="{B500}" fill-opacity="0.07"/></g>'
)
defs.append(f'<pattern id="{SLUG}-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
            f'<circle cx="11" cy="11" r="1.6" fill="{B500}" fill-opacity="0.38"/></pattern>')


# ================================================================ a device face: a light box facing +y
def face_box(x0, y0, ztop, w, h, d, r):
    """A rounded slab whose front face lies on the plane y = y0, spanning x0..x0+w and ztop-h..ztop, d deep (-y).
    Draws the top and right side (the two visible ones) and returns the face's transform origin."""
    loc = rr_outline(w, h, r)

    def p(u, v, dd):
        return iso(x0 + u, y0 - dd, ztop - v)

    allp = [p(u, v, dd) for (u, v) in loc for dd in (0, d)]
    right = [p(u, v, dd) for (u, v) in loc if u >= w - r - 0.01 for dd in (0, d)]
    track(allp)
    poly(hull(allp), B100)
    poly(hull(right), B200)
    return iso(x0, y0, ztop)


def flat_slab(x0, y0, w, l, t, r, top_fill=WHITE):
    """A rounded slab lying flat on the floor: x0..x0+w, y0..y0+l, t thick."""
    loc = rr_outline(w, l, r)
    edge = [iso(x0 + u, y0 + v, z) for (u, v) in loc for z in (0, t)]
    track(edge)
    poly(hull(edge), B200)
    poly([iso(x0 + u, y0 + v, t) for (u, v) in loc], top_fill)
    return iso(x0, y0, t)


# ================================================================ the screen layout, shared by both screens
# Everything is in fractions of the screen's own width and height, so the shipped screen is the design, smaller.
# Three parts are matched across the two screens: the title, the picture card and the button.
def screen_ui(sw, sh, kind):
    """kind: 'design' (the approved design: the button lime) or 'live' (the shipped screen: a browser bar, and the
    button's place an empty dashed slot)."""
    g = []
    bar = sh * 0.14
    g.append(f'<path d="M8 0 H{f(sw-8)} A8 8 0 0 1 {f(sw)} 8 V{f(bar)} H0 V8 A8 8 0 0 1 8 0 Z" fill="{B600}"/>')
    if kind == "live":
        # a browser: three dots and an address bar
        for i in range(3):
            g.append(f'<circle cx="{f(10 + i * 8)}" cy="{f(bar/2)}" r="2.4" fill="{B300}"/>')
        g.append(f'<rect x="{f(sw*0.28)}" y="{f(bar/2-3.5)}" width="{f(sw*0.5)}" height="7" rx="3.5" fill="{B500}"/>')
    else:
        # a design tool: a row of small tool squares
        for i in range(4):
            g.append(f'<rect x="{f(9 + i * 11)}" y="{f(bar/2-3.5)}" width="7" height="7" rx="2" fill="{B300}"/>')
        g.append(f'<rect x="{f(sw*0.8)}" y="{f(bar/2-3.5)}" width="{f(sw*0.12)}" height="7" rx="3.5" fill="{B500}"/>')
    top = bar
    ih = sh - top

    def Y(fr):
        return top + ih * fr

    # row 1, the title: an avatar and two bars
    ar = ih * 0.08
    ty = Y(0.15)
    tx = sw * 0.07 + ar
    tbx, tbw = tx + ar + 7, sw * 0.5
    g.append(f'<circle cx="{f(tx)}" cy="{f(ty)}" r="{f(ar)}" fill="{B200}"/>')
    g.append(f'<rect x="{f(tbx)}" y="{f(ty-ih*0.065)}" width="{f(tbw)}" height="{f(ih*0.065)}" rx="{f(ih*0.0325)}" fill="{WHITE}"/>')
    g.append(f'<rect x="{f(tbx)}" y="{f(ty+ih*0.025)}" width="{f(sw*0.3)}" height="{f(ih*0.045)}" rx="{f(ih*0.0225)}" fill="{B300}"/>')
    # row 2, the picture: full width, a hill and a sun
    cx0, cy0, cw, ch = sw * 0.07, Y(0.31), sw * 0.86, ih * 0.33
    g.append(f'<rect x="{f(cx0)}" y="{f(cy0)}" width="{f(cw)}" height="{f(ch)}" rx="6" fill="{B100}"/>')
    g.append(f'<path d="M{f(cx0+cw*0.2)} {f(cy0+ch*0.84)} L{f(cx0+cw*0.4)} {f(cy0+ch*0.38)} L{f(cx0+cw*0.55)} {f(cy0+ch*0.62)} '
             f'L{f(cx0+cw*0.65)} {f(cy0+ch*0.48)} L{f(cx0+cw*0.8)} {f(cy0+ch*0.84)} Z" fill="{B300}" stroke="{B300}" stroke-width="2" stroke-linejoin="round"/>')
    g.append(f'<circle cx="{f(cx0+cw*0.74)}" cy="{f(cy0+ch*0.27)}" r="{f(ch*0.11)}" fill="{WHITE}"/>')
    # row 3, the button, wide: lime on the design; on the shipped screen only its empty place
    bw, bh = sw * 0.86, ih * 0.19
    bx, by = sw * 0.07, Y(0.71)
    if kind == "design":
        g.append(f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bw)}" height="{f(bh)}" rx="{f(bh/2)}" fill="{LIME}" stroke="{LIMED}" stroke-width="1.2"/>')
        g.append(f'<rect x="{f(bx+bw*0.28)}" y="{f(by+bh/2-2)}" width="{f(bw*0.44)}" height="4" rx="2" fill="{INK}"/>')
    else:
        g.append(f'<rect x="{f(bx)}" y="{f(by)}" width="{f(bw)}" height="{f(bh)}" rx="{f(bh/2)}" fill="none" stroke="{LIME}" stroke-width="3" stroke-dasharray="8 5"/>')
    anchors = {
        "title": ((tbx + tbw, ty - ih * 0.0325), (tx - ar, ty)),
        "card": ((cx0 + cw, cy0 + ch * 0.5), (cx0, cy0 + ch * 0.5)),
        "button": ((bx + bw, by + bh / 2), (bx, by + bh / 2)),
    }
    return g, anchors


def box(x0, x1, y0, y1, z0, z1, top=WHITE, front=B200, side=B100):
    pts = [iso(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]
    track(pts)
    poly([iso(x1, y0, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x1, y0, z1)], side)
    poly([iso(x0, y1, z0), iso(x1, y1, z0), iso(x1, y1, z1), iso(x0, y1, z1)], front)
    poly([iso(x0, y0, z1), iso(x1, y0, z1), iso(x1, y1, z1), iso(x0, y1, z1)], top)


def btn_z(h, inset, chin):
    """height of the button row's centre above a screen body's bottom edge (the layout is fractional)."""
    sh = h - inset - chin
    return h - inset - (sh * 0.14 + 0.86 * sh * (0.71 + 0.095))


# ================================================================ the monitor: the approved design, on the floor
MX0, MY, MW, MH, MD, MR = -230, 40, 216, 206, 12, 12
MB = 44                               # the screen body's bottom: a foot and a short neck below it
MZT = MB + MH
NX0, NW = MX0 + MW / 2 - 13, 26
out.append('<!-- The monitor holding the approved design: a light body on its foot, a dark blue screen -->')
fs = [iso(x, y, z) for x in (NX0 - 30, NX0 + NW + 30) for y in (MY - 40, MY + 4) for z in (0, 4)]
track(fs)
poly(hull(fs), B200)
poly([iso(NX0 - 30, MY - 40, 4), iso(NX0 + NW + 30, MY - 40, 4), iso(NX0 + NW + 30, MY + 4, 4), iso(NX0 - 30, MY + 4, 4)], WHITE)
NZ1 = MB + 14
nk = [iso(x, y, z) for x in (NX0, NX0 + NW) for y in (MY - 22, MY - 14) for z in (4, NZ1)]
poly(hull(nk), B200)
poly([iso(NX0, MY - 14, 4), iso(NX0 + NW, MY - 14, 4), iso(NX0 + NW, MY - 14, NZ1), iso(NX0, MY - 14, NZ1)], WHITE)
ox, oy = face_box(MX0, MY, MZT, MW, MH, MD, MR)
MS = (10, 10, MW - 20, MH - 24)    # screen x, y, w, h inside the face; a deeper chin below
mg, m_anchor = screen_ui(MS[2], MS[3], "design")
out.append(f'<g transform="matrix(0.9 0.45 0 1 {f(ox)} {f(oy)})">'
           f'<rect width="{MW}" height="{MH}" rx="{MR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>'
           f'<rect x="{MW/2-9}" y="{MH-8.5}" width="18" height="3" rx="1.5" fill="{B200}"/>'
           f'<g transform="translate({MS[0]} {MS[1]})"><rect width="{MS[2]}" height="{MS[3]}" rx="8" fill="{B500}" stroke="{B600}" stroke-width="1.2"/>'
           + "".join(mg) + '</g></g>')


def m_pt(u, v):
    """a point on the monitor's screen (u, v from the screen's top left) in drawing coordinates."""
    return iso(MX0 + MS[0] + u, MY, MZT - MS[1] - v)


# ================================================================ the laptop: the shipped product, on the floor
LX0, LW, LH, LD, LR = 22, 182, 150, 6, 10
DECK, DT = 96, 6
LS = (8, 8, LW - 16, LH - 16)
# The laptop's button row is lower than the monitor's. Set the laptop back by just enough that the line joining
# the two buttons runs on the floor's own x axis on screen (dz = 0.9 dy): the line that matters reads level.
z_m = MB + btn_z(MH, 10, 14)
z_l = DT + btn_z(LH, 8, 8)
LY = MY + (z_l - z_m) / 0.9
LZT = DT + LH
lg, l_anchor = screen_ui(LS[2], LS[3], "live")
out.append('<!-- The laptop running the shipped product: the same screen, one part missing -->')
loc = rr_outline(LW, DECK, 8)
edge = [iso(LX0 + u, LY + v, z) for (u, v) in loc for z in (0, DT)]
track(edge)
poly(hull(edge), B200)
poly([iso(LX0 + u, LY + v, DT) for (u, v) in loc], WHITE)
dx, dy = iso(LX0, LY, DT)
kg = [f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(dx)} {f(dy)})">']
for r in range(3):
    for c in range(9):
        kg.append(f'<rect x="{f(13 + c * 16.2)}" y="{f(10 + r * 12)}" width="12.5" height="8" rx="2.5" fill="{B100}"/>')
kg.append(f'<rect x="{f(LW/2-26)}" y="{f(DECK-33)}" width="52" height="25" rx="5" fill="none" stroke="{B200}" stroke-width="1.2"/>')
kg.append('</g>')
out.extend(kg)
ox, oy = face_box(LX0, LY, LZT, LW, LH, LD, LR)
out.append(f'<g transform="matrix(0.9 0.45 0 1 {f(ox)} {f(oy)})">'
           f'<rect width="{LW}" height="{LH}" rx="{LR}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>'
           f'<g transform="translate({LS[0]} {LS[1]})"><rect width="{LS[2]}" height="{LS[3]}" rx="8" fill="{B500}" stroke="{B600}" stroke-width="1.2"/>'
           + "".join(lg) + '</g></g>')


def l_pt(u, v):
    return iso(LX0 + LS[0] + u, LY, LZT - LS[1] - v)


# ================================================================ the matching lines, part to part
# Each runs from a part on the design to the same part on the shipped screen. Over a dark screen the dash is
# white, over paper and bezel it is blue: one line, recoloured where it crosses a screen.
def screen_quad(pt, s):
    return [pt(0, 0), pt(s[2], 0), pt(s[2], s[3]), pt(0, s[3])]


defs.append(f'<clipPath id="{SLUG}-screens"><polygon points="{P(screen_quad(m_pt, MS))}"/>'
            f'<polygon points="{P(screen_quad(l_pt, LS))}"/></clipPath>')
defs.append(f'<mask id="{SLUG}-off" maskUnits="userSpaceOnUse" x="-600" y="-600" width="1400" height="1400">'
            f'<rect x="-600" y="-600" width="1400" height="1400" fill="{WHITE}"/>'
            f'<polygon points="{P(screen_quad(m_pt, MS))}" fill="#000000"/><polygon points="{P(screen_quad(l_pt, LS))}" fill="#000000"/></mask>')
lines = []
for key in ("title", "card", "button"):
    a = m_pt(*m_anchor[key][0])
    b = l_pt(*l_anchor[key][1])
    lines.append((a, b))
out.append('<!-- Matching lines from each part of the design to the same part on the shipped screen -->')
dpath = " ".join(f"M{f(a[0])} {f(a[1])} L{f(b[0])} {f(b[1])}" for a, b in lines)
out.append(f'<path d="{dpath}" fill="none" stroke="{B500}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" mask="url(#{SLUG}-off)"/>')
out.append(f'<path d="{dpath}" fill="none" stroke="{WHITE}" stroke-width="1.6" stroke-dasharray="4 4" stroke-linecap="round" clip-path="url(#{SLUG}-screens)"/>')
for a, b in lines:
    for p in (a, b):
        out.append(f'<circle cx="{f(p[0])}" cy="{f(p[1])}" r="2.6" fill="{WHITE}"/>')


# ================================================================ people
R, H, HEAD = 22, 62, 16
ARM = 11
HAND = 8.8
WO = 1.8      # the white edge on a Tcules figure


def pawn_geo(x, y):
    bx, by = iso(x, y)
    body = (f'M{f(bx-R)} {f(by)} V{f(by-H)} A{R} {R} 0 0 1 {f(bx+R)} {f(by-H)} V{f(by)} '
            f'A{R} {f(R*0.45)} 0 0 1 {f(bx-R)} {f(by)} Z')
    head = (bx, by - H - R - 4 - HEAD)
    track([(bx - R - 3, by + 13), (bx + R + 3, by - H - R - 4 - 2 * HEAD - 3)])
    return bx, by, body, head


def tcules_pawn(x, y, hand_to, side=1):
    bx, by, body, head = pawn_geo(x, y)
    sh = (bx + side * 8, by - H + 18)
    hx, hy = hand_to
    track([(hx - 12, hy - 12), (hx + 12, hy + 12)])
    arm = f'M{f(sh[0])} {f(sh[1])} L{f(hx)} {f(hy)}'
    o = [f'<g fill="none" stroke="{WHITE}" stroke-linecap="round" stroke-linejoin="round">'
         f'<path d="{body}" stroke-width="{2*WO+1.6}"/><circle cx="{f(head[0])}" cy="{f(head[1])}" r="{HEAD}" stroke-width="{2*WO}"/>'
         f'<path d="{arm}" stroke-width="{ARM+2*WO}"/><circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND+WO)}" fill="{WHITE}" stroke="none"/></g>',
         f'<path d="{body}" fill="{B500}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
         f'<circle cx="{f(head[0])}" cy="{f(head[1])}" r="{HEAD}" fill="{B500}"/>'
         f'<path d="{arm}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
         f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{HAND}" fill="{B500}"/>']
    return o


def client_pawn(x, y, hand_to=None, side=-1, mid="m"):
    bx, by, body, head = pawn_geo(x, y)
    o = [f'<path d="{body}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6" stroke-linejoin="round"/>'
         f'<circle cx="{f(head[0])}" cy="{f(head[1])}" r="{HEAD}" fill="{WHITE}" stroke="{B500}" stroke-width="1.6"/>']
    if hand_to:
        sh = (bx + side * 8, by - H + 18)
        hx, hy = hand_to
        track([(hx - 12, hy - 12), (hx + 12, hy + 12)])
        mid_id = f"{SLUG}-arm-{mid}"
        o.append(f'<mask id="{mid_id}" maskUnits="userSpaceOnUse" x="{f(bx-200)}" y="{f(by-250)}" width="400" height="400">'
                 f'<rect x="{f(bx-200)}" y="{f(by-250)}" width="400" height="400" fill="{WHITE}"/><path d="{body}" fill="#000000"/></mask>'
                 f'<g mask="url(#{mid_id})"><path d="M{f(sh[0])} {f(sh[1])} L{f(hx)} {f(hy)}" stroke="{B500}" stroke-width="{ARM}" stroke-linecap="round"/>'
                 f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND)}" fill="{B500}"/></g>'
                 f'<path d="M{f(sh[0])} {f(sh[1])} L{f(hx)} {f(hy)}" stroke="{WHITE}" stroke-width="{f(ARM-3.2)}" stroke-linecap="round"/>'
                 f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND-1.6)}" fill="{WHITE}"/>')
    return o


def toward(p0, p1, length):
    d = math.hypot(p1[0] - p0[0], p1[1] - p0[1])
    return (p0[0] + (p1[0] - p0[0]) * length / d, p0[1] + (p1[1] - p0[1]) * length / d)


# The developer (client) stands at the monitor's left and puts a hand on the lime button; the Tcules designer
# stands at the laptop's right and puts a hand on the empty place. Each pawn is slid along its line until the arm,
# from the shoulder to the target, is ARM_LEN long, so the hand lands on the target itself.
ARM_LEN = 54


def place(target, side, ok):
    """find the pawn spot (x, y) on the floor, allowed by ok(x, y), whose arm (shoulder to target) is nearest ARM_LEN."""
    best = None
    for i in range(160):
        for j in range(160):
            x, y = -272 + 25 + i * 3.4, -201 + 25 + j * 2.5
            if not ok(x, y):
                continue
            bx, by = iso(x, y)
            sh = (bx + side * 8, by - H + 18)
            d = math.hypot(target[0] - sh[0], target[1] - sh[1])
            if best is None or abs(d - ARM_LEN) < best[3]:
                best = (x, y, d, abs(d - ARM_LEN))
    return best[:3]


mb = m_anchor["button"]
m_btn = m_pt(mb[1][0] + 9, mb[1][1])              # on the lime button, in from its left end
lb = l_anchor["button"]
l_slot = l_pt(lb[0][0] - 9, lb[0][1])             # in the empty place, in from its right end
# Each pawn stands beside its device, in front of the screen's plane, with its body clear of the dark screen
# on the drawing (it may overlap the light bezel and side, as a person standing at a screen does).
m_dark_left = 0.9 * (MX0 + MS[0] - MY)
l_dark_right = 0.9 * (LX0 + LS[0] + LS[2] - LY)
CPX, CPY, c_d = place(m_btn, 1, lambda x, y: y >= MY + 12 and 0.9 * (x - y) + R <= m_dark_left - 2 and x < MX0 + 20)
TPX, TPY, t_d = place(l_slot, -1, lambda x, y: y >= LY + 12 and 0.9 * (x - y) - R >= l_dark_right + 2 and x > LX0 + LW + 22)
print("client at", round(CPX, 1), CPY, "arm", round(c_d, 1), "| tcules at", round(TPX, 1), round(TPY, 1), "arm", round(t_d, 1))
out.append('<!-- A client developer touches the button on the design; a Tcules designer touches its empty place on the shipped screen -->')
out.extend(client_pawn(CPX, CPY, m_btn, side=1, mid="c"))
out.extend(tcules_pawn(TPX, TPY, l_slot, side=-1))

# ================================================================ write
svg_body = "\n".join(out)
xs = [p[0] for p in pts_all]
ys = [p[1] for p in pts_all]
pad = 3
vw = max(865, math.ceil(max(xs) - min(xs) + 2 * pad))
vb = (math.floor((min(xs) + max(xs)) / 2 - vw / 2), math.floor(min(ys) - pad), vw, math.ceil(max(ys) - min(ys) + 2 * pad))
ALT = ("Isometric illustration for a design-to-code audit. On a dotted floor, a monitor showing the approved design "
       "stands beside a laptop running the shipped product, both with dark blue screens laid out the same way. Dashed "
       "lines match each part of the design to the same part on the laptop: the title, the picture, the button. The "
       "wide button is lime on the design, but on the laptop its place is only an empty dashed outline. A client developer "
       "standing at the monitor has a hand on the lime button; a Tcules designer standing at the laptop has a hand on "
       "the empty place where it should be.")
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" role="img" aria-label="{ALT}">\n'
    f'<defs>{"".join(defs)}</defs>\n' + svg_body + "\n</svg>\n"
)
here = os.path.dirname(os.path.abspath(__file__))
open(os.path.join(here, "hero.svg"), "w").write(svg)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
