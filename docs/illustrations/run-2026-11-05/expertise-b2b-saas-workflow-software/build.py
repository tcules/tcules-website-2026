#!/usr/bin/env python3
"""Writes hero.svg for /expertise/b2b-saas-workflow-software.

One deal file, a tabbed divider for every role, and one record handed on. A solid blue expanding file
(pleated gusset) stands on the floor, its dividers tabbed for the roles that share it: a person, a person,
an AI agent. The deal record has been taken out of its slot (a dashed ghost marks where it stood) and is
carried along the floor's x axis from a Tcules designer to a client, both hands on its edges. The record
shows an owner, a stage stepper with the current stage in lime, and a value field; its lime tab points the
way it is going.
Run: python3 build.py  (writes hero.svg beside it)
"""
from pathlib import Path

B5, B6, B7 = "#0048FF", "#003EE0", "#0031B0"
B3, B2, B1, B05 = "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF"
W, LIME, LIMED, INK = "#FFFFFF", "#D7F04A", "#A1B71F", "#1B1B18"
P_ = "bs"  # id prefix


def P(x, y, z=0.0):
    return (round(0.9 * x - 0.9 * y, 1), round(0.45 * x + 0.45 * y - z, 1))


def pts(*p):
    return " ".join(f"{a},{b}" for a, b in p)


def poly(points, fill, stroke=B5, sw=1.6):
    return (f'<polygon points="{pts(*points)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" '
            f'stroke-linejoin="round"/>')


def xz(x0, y, ztop):
    """Transform for flat content in an x-z plane at depth y; u along +x, v down."""
    tx, ty = P(x0, y, ztop)
    return f'matrix(0.9 0.45 0 1 {tx} {ty})'


def tabbed(w, h, a, tw, th, r=9, tr=7):
    """Sheet outline with a tab on its top edge, local coords: top-left at (0,0), tab rising to -th."""
    return (f"M0 {r} A{r} {r} 0 0 1 {r} 0 H{a} V{-th + tr} A{tr} {tr} 0 0 1 {a + tr} {-th} "
            f"H{a + tw - tr} A{tr} {tr} 0 0 1 {a + tw} {-th + tr} V0 H{w - r} A{r} {r} 0 0 1 {w} {r} "
            f"V{h - r} A{r} {r} 0 0 1 {w - r} {h} H{r} A{r} {r} 0 0 1 0 {h - r} Z")


out = []
add = out.append

# ---------------------------------------------------------------- floor (healthtech's plate)
FX0, FY0, FW, FH = -160, -40, 395, 260
fx, fy = P(FX0, FY0)
add(f'<defs><pattern id="{P_}-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
    f'<circle cx="11" cy="11" r="1.6" fill="{B5}" fill-opacity="0.38"/></pattern></defs>')
add('<!-- Floor: healthtech\'s plate, dotted, a soft inset, a dashed edge -->')
add(f'<g transform="matrix(0.9 0.45 -0.9 0.45 {fx} {fy})"><rect width="{FW}" height="{FH}" fill="url(#{P_}-dots)"/>'
    f'<rect width="{FW}" height="{FH}" fill="none" stroke="{B5}" stroke-width="1.8" stroke-dasharray="10 8"/>'
    f'<rect x="45" y="45" width="{FW - 90}" height="{FH - 90}" fill="{B5}" fill-opacity="0.07"/></g>')

# ---------------------------------------------------------------- the expanding file
X0, X1 = 0, 200          # width along x
YB, YF = 0, 62           # back board, front pocket depth
HB, HF = 186, 72         # back board height, front pocket height
T = 7                    # pocket board thickness
SW = X1 - X0 - 14        # sheet width
HD = 146                 # divider height

add('<!-- The deal file: a solid blue expanding file. Back board: one shape, top corners rounded -->')
add(f'<g transform="{xz(X0, YB, HB)}"><path d="M0 {HB} V12 A12 12 0 0 1 12 0 H{X1 - X0 - 12} '
    f'A12 12 0 0 1 {X1 - X0} 12 V{HB} Z" fill="{B5}" stroke="{B6}" stroke-width="1.6" stroke-linejoin="round"/></g>')

# the empty slot the record came out of: a dashed ghost of its top edge and tab
YG = 9
GTA, GTW = 16, 50
add('<!-- The slot the record left: the dashed top edge and tab of the missing sheet -->')
gr, gtr, gth, gd = 9, 7, 22, 26
ghost = (f"M0 {gd} V{gr} A{gr} {gr} 0 0 1 {gr} 0 H{GTA} V{-gth + gtr} A{gtr} {gtr} 0 0 1 {GTA + gtr} {-gth} "
         f"H{GTA + GTW - gtr} A{gtr} {gtr} 0 0 1 {GTA + GTW} {-gth + gtr} V0 H{SW - gr} A{gr} {gr} 0 0 1 {SW} {gr} V{gd}")
add(f'<g transform="{xz(X0 + 7, YG, HD + 18)}"><path d="{ghost}" fill="none" stroke="{LIME}" stroke-width="1.8" '
    f'stroke-dasharray="5 4" stroke-linecap="round" stroke-linejoin="round"/></g>')

# dividers: one per role, equal tabs evenly spaced so every role shows
TW, TH = 40, 24
dividers = [(22, 60, "person"), (35, 103, "person"), (48, 146, "ai")]   # depth y, tab centre u, mark
add('<!-- Dividers, one tabbed for each role: a person, a person, an AI agent -->')
for (yd, cx, mark) in dividers:
    g = [f'<g transform="{xz(X0 + 7, yd, HD)}">',
         f'<path d="{tabbed(SW, HD, cx - TW / 2, TW, TH)}" fill="{W}" stroke="{B5}" stroke-width="1.6" stroke-linejoin="round"/>']
    if mark == "person":
        g.append(f'<circle cx="{cx}" cy="-15.5" r="4.4" fill="{B5}"/>'
                 f'<path d="M{cx - 7.5} -4.5 a7.5 6.6 0 0 1 15 0 Z" fill="{B5}"/>')
    else:
        g.append(f'<rect x="{cx - 14}" y="-19.5" width="28" height="15" rx="7.5" fill="{B5}"/>'
                 f'<path d="M{cx - 7} -7.6 l3.3 -8.2 l3.3 8.2 M{cx - 5.7} -10.4 h4 M{cx + 4} -15.8 v8.2" fill="none" '
                 f'stroke="{W}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<rect x="16" y="12" width="{SW - 120}" height="7" rx="3.5" fill="{B2}"/>')
    g.append('</g>')
    add("".join(g))

# pleated gusset on the right: an accordion of folds, a V notch at the top of each pleat
add('<!-- The gusset: an accordion of folds -->')
K, NOTCH = 4, 16


def top(y):
    return (HB - 34) + (HF - (HB - 34)) * (y / YF)


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
    add(f'<path d="M{pts(P(X1, y, top(y) - NOTCH), P(X1, y, 0))}" stroke="{B7}" stroke-width="1.6" stroke-linecap="round"/>')
for y in ridges:
    add(f'<path d="M{pts(P(X1, y, top(y) - 1.5), P(X1, y, 0))}" stroke="{B5}" stroke-width="1.4" stroke-linecap="round"/>')

# front pocket: top edge, front face, label
add('<!-- Front pocket and its label: the account, with a count of open records -->')
add(poly([P(X0 + 10, YF - T, HF), P(X1, YF - T, HF), P(X1, YF, HF), P(X0 + 10, YF, HF)], B7, B7, 1.2))
add(f'<g transform="{xz(X0, YF, HF)}"><path d="M10 0 H{X1 - X0} V{HF} H10 A10 10 0 0 1 0 {HF - 10} V10 A10 10 0 0 1 10 0 Z" fill="{B5}" '
    f'stroke="{B6}" stroke-width="1.6" stroke-linejoin="round"/>'
    f'<rect x="22" y="18" width="104" height="34" rx="8" fill="{W}"/>'
    f'<rect x="34" y="31.5" width="48" height="8" rx="4" fill="{B5}"/>'
    f'<rect x="92" y="28" width="24" height="15" rx="7.5" fill="{B1}"/>'
    f'<circle cx="99" cy="35.5" r="2.4" fill="{B5}"/><circle cx="109" cy="35.5" r="2.4" fill="{B5}"/>'
    f'</g>')

# ---------------------------------------------------------------- the record, being handed on
PX0, PW, PH, PY = -112, 168, 100, 168   # left edge x, width, height, depth y
PZ = 126                                 # top edge height
add('<!-- The deal record, carried out along the x axis from the Tcules designer to the client -->')
g = [f'<g transform="{xz(PX0, PY, PZ)}">',
     # lime tab on the leading (left) end, arrow pointing -u, the way the record is going
     f'<path d="M14 4 V-19 A7 7 0 0 1 21 -26 H71 A7 7 0 0 1 78 -19 V4 Z" fill="{LIME}" '
     f'stroke="{LIMED}" stroke-width="1.6" stroke-linejoin="round"/>',
     f'<path d="M62 -12.5 H30 M37 -18.5 L30 -12.5 L37 -6.5" fill="none" stroke="{INK}" stroke-width="2.4" '
     f'stroke-linecap="round" stroke-linejoin="round"/>',
     f'<rect width="{PW}" height="{PH}" rx="9" fill="{W}" stroke="{B5}" stroke-width="1.6"/>',
     # owner: a small avatar and the deal's title
     f'<circle cx="24" cy="23" r="9" fill="{B5}"/><circle cx="24" cy="20.4" r="3.2" fill="{W}"/>'
     f'<path d="M18.6 28.6 a5.4 4.8 0 0 1 10.8 0 Z" fill="{W}"/>',
     f'<rect x="40" y="16" width="78" height="8" rx="4" fill="{B5}"/><rect x="40" y="28" width="46" height="6" rx="3" fill="{B2}"/>',
     # stage stepper: done, done, current (lime), to come
     f'<path d="M22 54 H146" stroke="{B2}" stroke-width="2.2" stroke-linecap="round"/>'
     f'<path d="M22 54 H84" stroke="{B5}" stroke-width="2.2" stroke-linecap="round"/>'
     f'<circle cx="22" cy="54" r="5.5" fill="{B5}"/><circle cx="53" cy="54" r="5.5" fill="{B5}"/>'
     f'<circle cx="115" cy="54" r="5.5" fill="{W}" stroke="{B3}" stroke-width="1.4"/>'
     f'<circle cx="146" cy="54" r="5.5" fill="{W}" stroke="{B3}" stroke-width="1.4"/>'
     f'<circle cx="84" cy="54" r="7.5" fill="{LIME}" stroke="{LIMED}" stroke-width="1.4"/>',
     # value field
     f'<rect x="16" y="74" width="{PW - 32}" height="24" rx="6" fill="{B05}" stroke="{B1}" stroke-width="1.2"/>'
     f'<rect x="26" y="83" width="22" height="6" rx="3" fill="{B3}"/><rect x="84" y="81.5" width="58" height="9" rx="4.5" fill="{B5}"/>',
     '</g>']
add("".join(g))
# the way it came: a dashed arc from the empty slot's tab to the record's tab
a0 = P(X0 + 7 + GTA + GTW / 2, YG, HD + 18 + 22 + 2)
a1 = P(PX0 + 46, PY, PZ + 26 + 6)
LIFT_ARC = 54
add(f'<path d="M{a1[0]} {a1[1]} C{a1[0]} {a1[1] - LIFT_ARC} {a0[0]} {a0[1] - LIFT_ARC} {a0[0]} {a0[1]}" fill="none" stroke="{B5}" '
    f'stroke-width="1.5" stroke-dasharray="4 4" stroke-linecap="round"/>')


# ---------------------------------------------------------------- people
def pawn(cx, by, client):
    if client:
        return (f'<path d="M{cx - 18} {by} V{by - 42} A18 18 0 0 1 {cx + 18} {by - 42} V{by} A18 8.5 0 0 1 {cx - 18} {by} Z" '
                f'fill="{W}" stroke="{B5}" stroke-width="1.6" stroke-linejoin="round"/>'
                f'<circle cx="{cx}" cy="{by - 78}" r="13" fill="{W}" stroke="{B5}" stroke-width="1.6"/>')
    return (f'<path d="M{cx - 18} {by} V{by - 42} A18 18 0 0 1 {cx + 18} {by - 42} V{by} A18 8.5 0 0 1 {cx - 18} {by} Z" '
            f'fill="{B5}" stroke="{W}" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"/>'
            f'<circle cx="{cx}" cy="{by - 78}" r="13" fill="{B5}" stroke="{W}" stroke-width="3.6" paint-order="stroke"/>')


def arm(x1, y1, x2, y2, client):
    if client:
        return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{B5}" stroke-width="8.5" stroke-linecap="round"/>'
                f'<circle cx="{x2}" cy="{y2}" r="6.8" fill="{B5}"/>'
                f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{W}" stroke-width="5.3" stroke-linecap="round"/>'
                f'<circle cx="{x2}" cy="{y2}" r="5.2" fill="{W}"/>')
    return (f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{W}" stroke-width="12" stroke-linecap="round"/>'
            f'<circle cx="{x2}" cy="{y2}" r="8.6" fill="{W}"/>'
            f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{B5}" stroke-width="8.5" stroke-linecap="round"/>'
            f'<circle cx="{x2}" cy="{y2}" r="6.8" fill="{B5}"/>')


ZH = 64  # hand height on the record's edges
add('<!-- A client (white, left) receives the record; a Tcules designer (blue, right) passes it -->')
# each stands just past an edge of the record, a step in front of it, its hand on that edge
hx, hy = P(PX0 + 2, PY, ZH)
cx1, by1 = P(PX0 - 40, PY + 4)
add(pawn(cx1, by1, True))
add(arm(cx1 + 10, by1 - 50, hx, hy, True))
hx2, hy2 = P(PX0 + PW - 2, PY, ZH)
cx2, by2 = P(PX0 + PW + 40, PY + 12)
add(pawn(cx2, by2, False))
add(arm(cx2 - 10, by2 - 50, hx2, hy2, False))

svg = "\n".join(out)
corners = [P(FX0, FY0), P(FX0 + FW, FY0), P(FX0, FY0 + FH), P(FX0 + FW, FY0 + FH), P(X0, YB, HB),
           P(PX0, PY, PZ + 26),
           (a0[0], min(a0[1], a1[1]) - 0.75 * LIFT_ARC)]
xs = [c[0] for c in corners]; ys = [c[1] for c in corners]
pad = 6
vb = (min(xs) - pad, min(ys) - pad, max(xs) - min(xs) + 2 * pad, max(ys) - min(ys) + 2 * pad)
alt = ("Isometric illustration for B2B SaaS and workflow software design. A solid blue expanding file stands on a "
       "dotted floor, its dividers tabbed for the roles that share one deal: two people and one marked AI. The deal "
       "record has been taken out of its slot, where a dashed outline remains, and is being handed on: a Tcules "
       "designer passes it to a client, both holding its edges. The record shows its owner, a row of stages with "
       "the current one in lime and a value field, and its lime tab carries an arrow pointing the way it is going.")
doc = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{" ".join(str(round(v)) for v in vb)}" role="img" '
       f'aria-label="{alt}">\n{svg}\n</svg>\n')
Path(__file__).with_name("hero.svg").write_text(doc)
print("viewBox", vb, "ratio", round(vb[2] / vb[3], 2))
