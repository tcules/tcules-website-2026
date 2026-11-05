#!/usr/bin/env python3
"""Writes hero.svg for /expertise/b2b-saas-workflow-software.

One deal file, a tabbed divider for every role, and one record handed from one role to the next.
A solid blue expanding file (pleated gusset) stands on the floor at hub scale, its dividers tabbed for the
roles that share it: a person, a person, an AI agent. One sheet, the deal record with a lime tab, has been
taken out of its slot (a dashed lime tab marks where it stood) and is passed hand to hand, along the floor's
x axis, from the person who took it out (beside the file) to the next person (further out on the floor).
The record is the drawing's one screen-like surface: an owner line and a stage stepper.

Scale and people follow the healthtech hero (the family standard): same projection, dot pitch, pawn size
(R 22, H 62, head 16) and arm (11 thick including its 1.6 blue outline, hand 0.8 x arm).
Run: python3 build.py  (writes hero.svg beside it)
"""
from pathlib import Path

B5, B6, B7 = "#0048FF", "#003EE0", "#0031B0"
B3, B2, B1, B05 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
W, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
P_ = "bs"  # id prefix


def P(x, y, z=0.0):
    return (round(0.9 * x - 0.9 * y, 1), round(0.45 * x + 0.45 * y - z, 1))


def f(n):
    return round(n, 1)


def pts(*p):
    return " ".join(f"{a},{b}" for a, b in p)


def poly(points, fill, stroke=B5, sw=1.6):
    return (f'<polygon points="{pts(*points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
            f'stroke-linejoin="round"/>')


def xz(x0, y, ztop):
    """Transform for flat content in an x-z plane at depth y; u along +x, v down."""
    tx, ty = P(x0, y, ztop)
    return f'matrix(0.9 0.45 0 1 {tx} {ty})'


def tabbed(w, h, a, tw, th, r=8, tr=6):
    """Sheet outline with a tab on its top edge, local coords: top-left at (0,0), tab rising to -th."""
    return (f"M0 {r} A{r} {r} 0 0 1 {r} 0 H{a} V{-th + tr} A{tr} {tr} 0 0 1 {a + tr} {-th} "
            f"H{a + tw - tr} A{tr} {tr} 0 0 1 {a + tw} {-th + tr} V0 H{w - r} A{r} {r} 0 0 1 {w} {r} "
            f"V{h - r} A{r} {r} 0 0 1 {w - r} {h} H{r} A{r} {r} 0 0 1 0 {h - r} Z")


out = []
add = out.append

# ---------------------------------------------------------------- floor (healthtech's plate)
FX0, FY0, FW, FH = -34, -46, 278, 426
fx, fy = P(FX0, FY0)
add(f'<defs><pattern id="{P_}-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
    f'<circle cx="11" cy="11" r="1.6" fill="{B5}" fill-opacity="0.38"/></pattern></defs>')
add('<!-- Floor: healthtech\'s plate, dotted, a soft inset, a dashed edge -->')
add(f'<g transform="matrix(0.9 0.45 -0.9 0.45 {fx} {fy})"><rect width="{FW}" height="{FH}" fill="url(#{P_}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B5}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="45" y="45" width="{FW - 90}" height="{FH - 90}" fill="{B5}" fill-opacity="0.07"/></g>')

# ---------------------------------------------------------------- the expanding file, hub scale
X0, X1 = 0, 150          # width along x
YB, YF = 0, 54           # back board, front pocket depth
HB, HF = 138, 60         # back board height, front pocket height
T = 6                    # pocket board thickness
SW = X1 - X0 - 14        # sheet width
HD = 108                 # divider height
TW, TH = 30, 22          # tab width, height
GU = 116                 # centre of the empty slot's tab (and of the handed record's tab)

add('<!-- The deal file: a solid blue expanding file. Back board: one shape, top corners rounded -->')
add(f'<g transform="{xz(X0, YB, HB)}"><path d="M0 {HB} V11 A11 11 0 0 1 11 0 H{X1 - X0 - 11} '
    f'A11 11 0 0 1 {X1 - X0} 11 V{HB} Z" fill="{B5}" stroke="{B6}" stroke-width="1.6" stroke-linejoin="round"/></g>')

# the empty slot the record came out of: the dashed lime tab of the missing sheet
YG = 8
add('<!-- The slot the record left: a dashed lime outline of its tab, standing empty behind the dividers -->')
gtr, gth = 6, 20
ghost = (f"M{GU - TW / 2} 6 V{-gth + gtr} A{gtr} {gtr} 0 0 1 {GU - TW / 2 + gtr} {-gth} "
         f"H{GU + TW / 2 - gtr} A{gtr} {gtr} 0 0 1 {GU + TW / 2} {-gth + gtr} V6")
add(f'<g transform="{xz(X0 + 7, YG, HD + 6)}"><path d="{ghost}" fill="none" stroke="{LIME}" stroke-width="1.8" '
    f'stroke-dasharray="4.5 3.5" stroke-linecap="round" stroke-linejoin="round"/></g>')

# dividers: one per role, equal tabs evenly spaced so every role shows
dividers = [(18, 24, "person"), (30, 56, "person"), (42, 88, "ai")]   # depth y, tab centre u, mark
add('<!-- Dividers, one tabbed for each role: a person, a person, an AI agent -->')
for (yd, cx, mark) in dividers:
    g = [f'<g transform="{xz(X0 + 7, yd, HD)}">',
         f'<path d="{tabbed(SW, HD, cx - TW / 2, TW, TH)}" fill="{W}" stroke="{B5}" stroke-width="1.6" stroke-linejoin="round"/>']
    if mark == "person":
        g.append(f'<circle cx="{cx}" cy="-14" r="4" fill="{B5}"/>'
                 f'<path d="M{cx - 6.8} -4 a6.8 6 0 0 1 13.6 0 Z" fill="{B5}"/>')
    else:
        g.append(f'<rect x="{cx - 12.5}" y="-17.5" width="25" height="13.5" rx="6.75" fill="{B5}"/>'
                 f'<path d="M{cx - 6.3} -6.9 l3 -7.4 l3 7.4 M{cx - 5.1} -9.4 h3.6 M{cx + 3.6} -14.3 v7.4" fill="none" '
                 f'stroke="{W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append('</g>')
    add("".join(g))

# pleated gusset on the right: an accordion of folds, a V notch at the top of each pleat
add('<!-- The gusset: an accordion of folds -->')
K, NOTCH = 3, 13


def top(y):
    return (HB - 28) + (HF - (HB - 28)) * (y / YF)


edge = [P(X1, 0, 0), P(X1, 0, top(0))]
valleys, ridges = [], []
for i in range(K):
    yn, yp = YF * (i + 0.5) / K, YF * (i + 1) / K
    edge += [P(X1, yn, top(yn) - NOTCH), P(X1, yp, top(yp))]
    valleys.append(yn)
    if i < K - 1:
        ridges.append(yp)
edge.append(P(X1, YF, 0))
add(poly(edge, B6, B7, 1.2))
for y in valleys:
    add(f'<path d="M{pts(P(X1, y, top(y) - NOTCH), P(X1, y, 0))}" stroke="{B7}" stroke-width="1.5" stroke-linecap="round"/>')
for y in ridges:
    add(f'<path d="M{pts(P(X1, y, top(y) - 1.5), P(X1, y, 0))}" stroke="{B5}" stroke-width="1.3" stroke-linecap="round"/>')

# front pocket: top edge, front face, a plain label slip (not a screen)
add('<!-- Front pocket with a plain label slip -->')
add(poly([P(X0 + 9, YF - T, HF), P(X1, YF - T, HF), P(X1, YF, HF), P(X0 + 9, YF, HF)], B7, B7, 1.2))
add(f'<g transform="{xz(X0, YF, HF)}"><path d="M9 0 H{X1 - X0} V{HF} H9 A9 9 0 0 1 0 {HF - 9} V9 A9 9 0 0 1 9 0 Z" fill="{B5}" '
    f'stroke="{B6}" stroke-width="1.6" stroke-linejoin="round"/>'
    f'<rect x="20" y="17" width="64" height="20" rx="5" fill="{W}"/>'
    f'<rect x="29" y="24" width="36" height="6" rx="3" fill="{B2}"/>'
    f'</g>')


# ---------------------------------------------------------------- people (healthtech's pawn and arm)
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8
mask_n = [0]


def body_path(x, y):
    return (f"M{f(x - R)} {f(y)} V{f(y - H)} A{R} {R} 0 0 1 {f(x + R)} {f(y - H)} V{f(y)} "
            f"A{R} {f(R * 0.45)} 0 0 1 {f(x - R)} {f(y)} Z")


def pawn(x, y):
    return (f'<path d="{body_path(x, y)}" fill="{W}" stroke="{B5}" stroke-width="1.6" stroke-linejoin="round"/>'
            f'<circle cx="{f(x)}" cy="{f(y - H - R - 4 - HEAD)}" r="{HEAD}" fill="{W}" stroke="{B5}" stroke-width="1.6"/>')


def client_arm(x, y, ax, ay, hx, hy):
    """A light arm outlined in blue, growing out of the body (its outline masked inside the body)."""
    mid = f"{P_}-arm{mask_n[0]}"
    mask_n[0] += 1
    return (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-500" y="-300" width="1100" height="800">'
            f'<rect x="-500" y="-300" width="1100" height="800" fill="{W}"/><path d="{body_path(x, y)}" fill="#000000"/></mask>'
            f'<g mask="url(#{mid})"><path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{B5}" stroke-width="{ARM}" '
            f'stroke-linecap="round"/><circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND)}" fill="{B5}"/></g>'
            f'<path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{W}" stroke-width="{f(ARM - 2 * OUT)}" stroke-linecap="round"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND - OUT)}" fill="{W}"/>')


def hand_on_sheet(hx, hy):
    """A hand drawn over the sheet's edge, so it grips it."""
    return (f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND)}" fill="{B5}"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND - OUT)}" fill="{W}"/>')


# ---------------------------------------------------------------- the record, passed hand to hand
PW, PH = SW, 74                  # the same sheet as the dividers, cut short
SXP, SY1, PZ = 198, 290, 100     # the sheet's plane x, its front end y, top edge height
LU = 30                          # the record's lime tab, near its front end
GAP = 44                         # pawn centre to the sheet's end, along y
ZH = 64                          # hand height


def yz(x, y_front, ztop):
    """Transform for flat content in a y-z plane at x, u running from the front end toward the back (-y)."""
    tx, ty = P(x, y_front, ztop)
    return f'matrix(0.9 -0.45 0 1 {tx} {ty})'


# the giver stands just past the sheet's back end (near the file), the receiver past its front end
gx, gy = P(SXP, SY1 - PW - GAP)
rx, ry = P(SXP, SY1 + GAP)
gh = P(SXP, SY1 - PW + 3, ZH)
rh = P(SXP, SY1 - 3, ZH)

add('<!-- The person who drew the record from the file (back) hands it to the next person (front) -->')
add(pawn(gx, gy))
add(client_arm(gx, gy, gx - 8, gy - H + 22, gh[0], gh[1]))

add('<!-- The deal record: the sheet missing from the file, its tab lime -->')
g = [f'<g transform="{yz(SXP, SY1, PZ)}">',
     # lime tab on the leading end, toward the person taking it
     f'<path d="M{LU - TW / 2 - 7} 4 V{-TH + 6} A6 6 0 0 1 {LU - TW / 2 - 1} {-TH} H{LU + TW / 2 + 1} '
     f'A6 6 0 0 1 {LU + TW / 2 + 7} {-TH + 6} V4 Z" fill="{LIME}" stroke="{LIMED}" stroke-width="1.4" stroke-linejoin="round"/>',
     f'<rect x="{LU - 9}" y="{-TH / 2 - 3}" width="18" height="5" rx="2.5" fill="{INK}"/>',
     f'<rect width="{PW}" height="{PH}" rx="8" fill="{W}" stroke="{B5}" stroke-width="1.6"/>',
     # owner: a small avatar and the deal's title
     f'<circle cx="22" cy="21" r="8.5" fill="{B5}"/><circle cx="22" cy="18.6" r="3" fill="{W}"/>'
     f'<path d="M17 26.4 a5 4.4 0 0 1 10 0 Z" fill="{W}"/>',
     f'<rect x="37" y="15" width="64" height="7.5" rx="3.75" fill="{B5}"/><rect x="37" y="26" width="38" height="6" rx="3" fill="{B2}"/>',
     # stage stepper: done, done, here, to come
     f'<path d="M24 53 H112" stroke="{B2}" stroke-width="2.2" stroke-linecap="round"/>'
     f'<path d="M24 53 H82.7" stroke="{B5}" stroke-width="2.2" stroke-linecap="round"/>'
     f'<circle cx="24" cy="53" r="5" fill="{B5}"/><circle cx="53.3" cy="53" r="5" fill="{B5}"/>'
     f'<circle cx="82.7" cy="53" r="6.5" fill="{W}" stroke="{B5}" stroke-width="2.4"/>'
     f'<circle cx="112" cy="53" r="5" fill="{W}" stroke="{B3}" stroke-width="1.4"/>',
     '</g>']
add("".join(g))
add(hand_on_sheet(*gh))

add(pawn(rx, ry))
add(client_arm(rx, ry, rx + 8, ry - H + 22, rh[0], rh[1]))

svg = "\n".join(out)
corners = [P(FX0, FY0), P(FX0 + FW, FY0), P(FX0, FY0 + FH), P(FX0 + FW, FY0 + FH), P(X0, YB, HB)]
xs = [c[0] for c in corners]; ys = [c[1] for c in corners]
pad = 4
vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad)
alt = ("Isometric illustration for B2B SaaS and workflow software design. A solid blue expanding file stands on a "
       "dotted floor, its dividers tabbed for the roles that share one deal: two people and one marked AI. One "
       "sheet, the deal record with a lime tab, has been taken out, leaving a dashed outline of its tab in the "
       "file, and is being handed on: the person beside the file passes it to the next person, both holding its "
       "edges. The record shows its owner and a row of stages, with the current one ringed.")
doc = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(str(round(v)) for v in vb)}" role="img" '
       f'aria-label="{alt}">\n{svg}\n</svg>\n')
Path(__file__).with_name("hero.svg").write_text(doc)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
