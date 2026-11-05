#!/usr/bin/env python3
"""Generator for the /expertise/ai-products-developer-tools hero. Run: python3 build.py (writes hero.svg beside it).

The floor and the projection are healthtech's (the family standard): floor point (u, v) at height h is
x = -144 + 0.9(u - v), y = 27 + 0.45(u + v) - h.
"""
import os, math

B, B600, B700, B300, B200, B100, B50, W = "#0048FF", "#003EE0", "#0031B0", "#8AA5FF", "#B8C8FF", "#DBE4FF", "#EEF2FF", "#FFFFFF"
LIME, LIME_D, INK = "#D7F04A", "#A1B71F", "#1B1B18"

def P(u, v, h=0):
    return (-144 + 0.9 * (u - v), 27 + 0.45 * (u + v) - h)

def f(n):
    return f"{n:.1f}".rstrip("0").rstrip(".")

def pts(*ps):
    return " ".join(f"{f(x)},{f(y)}" for x, y in ps)

def poly(ps, fill, stroke=B, sw=1.6, extra=""):
    s = f'stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ""
    return f'<polygon points="{pts(*ps)}" fill="{fill}" {s}{extra}/>'

def ibox(u0, u1, v0, v1, h0, h1, top, front, side, stroke=B, sw=1.6):
    """An axis box: top face, +v face (front-left) and +u face (front-right)."""
    return "".join([
        poly([P(u0, v1, h1), P(u1, v1, h1), P(u1, v1, h0), P(u0, v1, h0)], front, stroke, sw),
        poly([P(u1, v0, h1), P(u1, v1, h1), P(u1, v1, h0), P(u1, v0, h0)], side, stroke, sw),
        poly([P(u0, v0, h1), P(u1, v0, h1), P(u1, v1, h1), P(u0, v1, h1)], top, stroke, sw),
    ])

ENV = lambda k, d: [float(x) for x in os.environ[k].split(",")] if k in os.environ else d

# ---------------------------------------------------------------- floor (healthtech's, verbatim geometry)
floor = (
    '<defs><pattern id="aidt-dots" width="22" height="22" patternUnits="userSpaceOnUse">'
    '<circle cx="11" cy="11" r="1.6" fill="#0048FF" fill-opacity="0.38"/></pattern></defs>\n'
    '<!-- Floor: dotted, with a dashed edge and a soft inset under the objects -->\n'
    '<g transform="matrix(0.9 0.45 -0.9 0.45 -144 27)"><rect width="545" height="402" fill="url(#aidt-dots)"/>'
    '<rect width="545" height="402" fill="none" stroke="#0048FF" stroke-width="1.8" stroke-dasharray="10 8"/>'
    '<rect x="45" y="45" width="455" height="312" fill="#0048FF" fill-opacity="0.07"/></g>\n'
)

# ---------------------------------------------------------------- the desk (white, on four legs)
DU0, DU1, DV0, DV1 = ENV("DESK", [124, 406, 88, 368])
DH, TT, LEG, LIN = 40, 7, 11, 9      # top height, top thickness, leg size, leg inset
desk_legs = ["<!-- The desk: a plain white table on four legs -->"]
for (lu, lv) in [(DU0 + LIN, DV0 + LIN), (DU0 + LIN, DV1 - LIN - LEG), (DU1 - LIN - LEG, DV0 + LIN), (DU1 - LIN - LEG, DV1 - LIN - LEG)]:
    desk_legs.append(ibox(lu, lu + LEG, lv, lv + LEG, 0, DH - TT, W, W, B200, B, 1.4))
desk_top = ibox(DU0, DU1, DV0, DV1, DH - TT, DH, W, W, B200)

# ---------------------------------------------------------------- the keyboard (hero object, solid blue, a low wedge on the desk)
KU0, KV0 = ENV("KB", [163, 261])
UNIT = 17                 # one key pitch, in floor units
GAP = 4                   # gap between keys
M = 7                     # margin round the key field (slim, so little blue shows round the keys)
NROWS = 5
HB, HF = 11, 5            # chassis height at the back and at the front: a low wedge rising toward the back
KEYH, INS = 5, 1.6        # keycap height and the cap-top inset (a lighter top on a darker skirt)
ROWS = [
    [1] * 11 + [2],                                   # number row, Backspace
    [1.5] + [1] * 9 + ["E2.5"],                      # Tab, letters, Enter (top)
    [2.5] + [1] * 8 + ["E2.5"],                      # Caps, letters, Enter (bottom)
    [2.25] + [1] * 8 + [2.75],                        # Shift, letters, Shift
    [1.25] * 3 + [5.5] + [1.25] * 3,                  # modifiers, the long space bar, modifiers
]
WIDTH_UNITS = 13
KU1 = KU0 + 2 * M + WIDTH_UNITS * UNIT - GAP
KV1 = KV0 + 2 * M + NROWS * UNIT - GAP
u_start, v_start = KU0 + M, KV0 + M

def hs(v):
    """Height of the chassis top at depth v (above the desk top)."""
    return DH + HB + (HF - HB) * (v - KV0) / (KV1 - KV0)

kb = ["<!-- The developer's keyboard: the industry's object, a low solid-blue wedge with white keys and one lime Enter -->"]
kb.append(poly([P(KU0, KV1, DH), P(KU1, KV1, DH), P(KU1, KV1, DH + HF), P(KU0, KV1, DH + HF)], B600, B, 1.4))
kb.append(poly([P(KU1, KV0, DH), P(KU1, KV1, DH), P(KU1, KV1, DH + HF), P(KU1, KV0, DH + HB)], B700, B, 1.4))
kb.append(poly([P(KU0, KV0, DH + HB), P(KU1, KV0, DH + HB), P(KU1, KV1, DH + HF), P(KU0, KV1, DH + HF)], B, B, 1.4))

def keycap(a0, a1, b0, b1, top, skirt, stroke, sw, press=0):
    k = KEYH - press
    T = lambda u, v: P(u, v, hs(v) + k)
    Bf = lambda u, v: P(u, v, hs(v))
    i = INS
    return "".join([
        poly([Bf(a0, b1), Bf(a1, b1), T(a1 - i, b1 - i), T(a0 + i, b1 - i)], skirt, stroke, sw),
        poly([Bf(a1, b0), Bf(a1, b1), T(a1 - i, b1 - i), T(a1 - i, b0 + i)], skirt, stroke, sw),
        poly([T(a0 + i, b0 + i), T(a1 - i, b0 + i), T(a1 - i, b1 - i), T(a0 + i, b1 - i)], top, stroke, sw),
    ])

keys = []
enter = None
for r, row in enumerate(ROWS):
    v0 = v_start + r * UNIT
    u = u_start
    for span in row:
        if isinstance(span, str):
            w = float(span[1:])
            if enter is None:
                enter = [u, u + w * UNIT - GAP, v0, v0 + 2 * UNIT - GAP]
            u += w * UNIT
            continue
        keys.append((u, u + span * UNIT - GAP, v0, v0 + UNIT - GAP, "key"))
        u += span * UNIT
eu0, eu1, ev0, ev1 = enter
keys.append((eu0, eu1, ev0, ev1, "enter"))
keys.sort(key=lambda k: (k[2] + k[0] * 0.001, k[0]))
PRESS = 2   # the Enter key is pressed down
for (a0, a1, b0, b1, kind) in keys:
    if kind == "enter":
        kb.append(keycap(a0, a1, b0, b1, LIME, LIME_D, LIME_D, 1.1, PRESS))
    else:
        kb.append(keycap(a0, a1, b0, b1, W, B100, B, 0.8))

# ---------------------------------------------------------------- the result: a white sheet laid flat on the desk
CU0, CV0 = ENV("CARD", [136, 98])
CW, CD = 214, 146         # along u, along v
CTH = 4                   # its thickness
RX = 12

def rrect_pts(w, h, r, n=8):
    out = []
    for cx, cy, a0 in [(w - r, r, -90), (w - r, h - r, 0), (r, h - r, 90), (r, r, 180)]:
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            out.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return out

def hull(points):
    pts_ = sorted(set(points))
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in pts_:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts_):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]

def on_card(x, y, h=DH + CTH):
    return P(CU0 + x, CV0 + y, h)

rr = rrect_pts(CW, CD, RX)
slab = hull([on_card(x, y) for x, y in rr] + [on_card(x, y, DH) for x, y in rr])
card = ["<!-- The first result, laid flat on the desk: marked AI, a line of code, the three checks the model ran, and a sign-off -->"]
card.append(poly(slab, B200, B, 1.4))
ox, oy = on_card(0, 0)
g = [f'<g transform="matrix(0.9 0.45 -0.9 0.45 {f(ox)} {f(oy)})">']
g.append(f'<rect width="{CW}" height="{CD}" rx="{RX}" fill="{W}" stroke="{B}" stroke-width="1.6"/>')
# the sign-off, top left, where the reviewer's hand rests: an outlined pill with a tick and a label bar
g.append(f'<rect x="11" y="10" width="62" height="28" rx="14" fill="{W}" stroke="{B}" stroke-width="1.8"/>')
g.append(f'<path d="M21 24 l4 4 l7.4 -8" fill="none" stroke="{B}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="40" y="20.5" width="24" height="7" rx="3.5" fill="{B}"/>')
# title bars and the AI badge, top right
g.append(f'<rect x="84" y="15" width="56" height="7" rx="3.5" fill="{B}"/><rect x="84" y="27" width="40" height="6" rx="3" fill="{B200}"/>')
g.append(f'<rect x="154" y="10" width="48" height="30" rx="8" fill="{B}"/>')
g.append(f'<path d="M162.5 33 L170 17 L177.5 33 M165.3 27 H174.7 M187 17 V33" fill="none" stroke="{W}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>')
# the working first result: code brackets and two lines of output
g.append(f'<rect x="11" y="48" width="{CW - 22}" height="36" rx="8" fill="{B50}" stroke="{B}" stroke-width="1.2"/>')
g.append(f'<path d="M30 59 l-6.5 7 l6.5 7 M41 59 l6.5 7 l-6.5 7" fill="none" stroke="{B}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="58" y="57" width="{CW - 90}" height="6.5" rx="3.25" fill="{B}"/><rect x="58" y="68.5" width="{CW - 120}" height="6.5" rx="3.25" fill="{B300}"/>')
# what the model checked: three ticked lines
for i, w1 in enumerate([CW - 84, CW - 104, CW - 94]):
    y = 101 + i * 18
    g.append(f'<circle cx="21" cy="{y}" r="8" fill="{B}"/><path d="M17.2 {y} l2.8 2.8 l5.2 -5.6" fill="none" stroke="{W}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<rect x="36" y="{y - 3.5}" width="{w1}" height="7" rx="3.5" fill="{B200}"/>')
g.append("</g>")
card += g

# ---------------------------------------------------------------- people (STYLE §5): light client pawns
R, H, HEAD = 22, 62, 16
ARM, OUT = 11, 1.6
HAND = ARM * 0.8
def body_path(x, y):
    return (f"M{f(x - R)} {f(y)} V{f(y - H)} A{R} {R} 0 0 1 {f(x + R)} {f(y - H)} V{f(y)} "
            f"A{R} {f(R * 0.45)} 0 0 1 {f(x - R)} {f(y)} Z")
mask_n = [0]
def client_arm(x, y, frm, to):
    ax, ay = x + frm[0], y + frm[1]
    hx, hy = x + to[0], y + to[1]
    mid = f"aidt-arm{mask_n[0]}"; mask_n[0] += 1
    return (f'<mask id="{mid}" maskUnits="userSpaceOnUse" x="-700" y="-400" width="1400" height="1100">'
            f'<rect x="-700" y="-400" width="1400" height="1100" fill="{W}"/><path d="{body_path(x, y)}" fill="#000000"/></mask>'
            f'<g mask="url(#{mid})"><path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{B}" stroke-width="{ARM}" stroke-linecap="round"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND)}" fill="{B}"/></g>'
            f'<path d="M{f(ax)} {f(ay)} L{f(hx)} {f(hy)}" stroke="{W}" stroke-width="{f(ARM - 2 * OUT)}" stroke-linecap="round"/>'
            f'<circle cx="{f(hx)}" cy="{f(hy)}" r="{f(HAND - OUT)}" fill="{W}"/>')
def pawn_body(u, v, badge=None):
    x, y = P(u, v)
    s = f'<path d="{body_path(x, y)}" fill="{W}" stroke="{B}" stroke-width="1.6" stroke-linejoin="round"/>'
    s += f'<circle cx="{f(x)}" cy="{f(y - H - R - 4 - HEAD)}" r="{HEAD}" fill="{W}" stroke="{B}" stroke-width="1.6"/>'
    by = y - H * 0.6
    if badge == "code":
        s += (f'<path d="M{f(x - 5)} {f(by - 8)} l-7 8 l7 8 M{f(x + 5)} {f(by - 8)} l7 8 l-7 8" fill="none" stroke="{B}" '
              f'stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>')
    if badge == "tick":
        s += f'<path d="M{f(x - 10)} {f(by)} l7 7 l13 -14" fill="none" stroke="{B}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>'
    return s
def arm_to(u, v, side, target):
    x, y = P(u, v)
    return client_arm(x, y, (side, SHOULDER), (target[0] - x, target[1] - y))

SHOULDER = -H - 3          # the arm grows from the shoulder, just under the head
DEV = ENV("DEV", [KU1 + 30, (ev0 + ev1) / 2 + 2])
REV = ENV("REV", [CU0 + 42, DV0 - 36])
enter_top = P((eu0 + eu1) / 2 + 1, (ev0 + ev1) / 2, hs((ev0 + ev1) / 2) + KEYH - PRESS + 3)
pill = on_card(*ENV("PILL", [30, 22]))
pill = (pill[0], pill[1] - 3)

# ---------------------------------------------------------------- assemble, back to front
parts = [floor,
         "<!-- The reviewer, marked with a tick, stands behind the desk at its back corner -->", pawn_body(*REV, badge="tick"),
         "\n".join(desk_legs), desk_top, "\n".join(card), "\n".join(kb),
         "<!-- The reviewer's hand rests on the sign-off -->", arm_to(*REV, 6, pill),
         "<!-- The developer, marked with code brackets, presses Enter -->", pawn_body(*DEV, badge="code"), arm_to(*DEV, -8, enter_top)]
xs = [P(0, 0)[0], P(545, 0)[0], P(0, 402)[0], P(545, 402)[0]]
ys = [P(0, 0)[1], P(545, 402)[1], P(*REV)[1] - 124, P(*DEV)[1] - 124]
pad = 6
VB = os.environ.get("VB", f"{f(min(xs) - pad)} {f(min(ys) - pad)} {f(max(xs) - min(xs) + 2 * pad)} {f(max(ys) - min(ys) + 2 * pad)}")
alt = ("Isometric illustration for AI product and developer tool design. On a dotted floor stands a white desk. On it lies a low blue "
       "keyboard with white keys and one lime Enter key, pressed by a developer marked with code brackets who stands at the desk's end. "
       "Behind the keyboard, laid flat on the desk, is the first result: a white sheet marked AI, with a line of code and three ticked "
       "checks the model ran. A reviewer marked with a tick stands behind the desk with a hand on the sheet's sign-off button.")
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" role="img" aria-label="{alt}">\n'
       + "\n".join(p for p in parts if p) + "\n</svg>\n")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get("OUT", "hero.svg")), "w").write(svg)
print("viewBox", VB, "ratio", round(float(VB.split()[2]) / float(VB.split()[3]), 3))
