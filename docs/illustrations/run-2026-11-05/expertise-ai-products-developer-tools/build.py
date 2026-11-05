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

# ---------------------------------------------------------------- the keyboard (hero object, solid blue, a low wedge)
KU0, KV0 = ENV("KB", [118, 236])
UNIT = 17                 # one key pitch, in floor units
GAP = 4                   # gap between keys
M = 10                    # margin round the key field
NROWS = 5
HB, HF = 15, 8            # chassis height at the back and at the front: a low wedge rising toward the back
KEYH, INS = 6, 1.6        # keycap height and the cap-top inset (a lighter top on a darker skirt)
# real rows, in key units; "E" marks the Enter key's columns (a tall key over rows 1-2, at the right end)
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
    """Height of the chassis top at depth v."""
    return HB + (HF - HB) * (v - KV0) / (KV1 - KV0)

kb = ["<!-- The developer's keyboard: the industry's object, a low solid-blue wedge, one lime Enter key -->"]
kb.append(poly([P(KU0, KV1, 0), P(KU1, KV1, 0), P(KU1, KV1, HF), P(KU0, KV1, HF)], B600, B700, 1.6))
kb.append(poly([P(KU1, KV0, 0), P(KU1, KV1, 0), P(KU1, KV1, HF), P(KU1, KV0, HB)], B700, B700, 1.6))
kb.append(poly([P(KU0, KV0, HB), P(KU1, KV0, HB), P(KU1, KV1, HF), P(KU0, KV1, HF)], B, B700, 1.6))

def keycap(a0, a1, b0, b1, top, skirt, stroke, sw, press=0):
    k = KEYH - press
    T = lambda u, v: P(u, v, hs(v) + k)
    Bf = lambda u, v: P(u, v, hs(v))
    i = INS
    return "".join([
        poly([Bf(a0, b1), Bf(a1, b1), T(a1 - i, b1 - i), T(a0 + i, b1 - i)], skirt, stroke, sw),   # front skirt
        poly([Bf(a1, b0), Bf(a1, b1), T(a1 - i, b1 - i), T(a1 - i, b0 + i)], skirt, stroke, sw),   # right skirt
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
PRESS = 2.5   # the Enter key is pressed down
for (a0, a1, b0, b1, kind) in keys:
    if kind == "enter":
        kb.append(keycap(a0, a1, b0, b1, LIME, LIME_D, LIME_D, 1.1, PRESS))
    else:
        kb.append(keycap(a0, a1, b0, b1, W, B200, B700, 0.9))

# ---------------------------------------------------------------- the result card (stands in a low base)
CU0, CU1, CV = ENV("CARD", [156, 330, 98])
CT = 9               # card thickness (in v)
BASEH = 14
CH = 240             # card height above the base
# the base in two parts, so the card stands in a slot: the back half before the card, the front lip after it
base_back = ibox(CU0 - 12, CU1 + 12, CV - CT - 12, CV, 0, BASEH, W, W, B200)
base_front = ibox(CU0 - 12, CU1 + 12, CV, CV + 14, 0, BASEH, W, W, B200)
# one right face across both halves, so the base reads as one block with no seam
base_front += poly([P(CU1 + 12, CV - CT - 12, BASEH), P(CU1 + 12, CV + 14, BASEH), P(CU1 + 12, CV + 14, 0), P(CU1 + 12, CV - CT - 12, 0)], B200)
base_front += poly([P(CU0 - 12, CV, BASEH), P(CU1 + 12, CV, BASEH), P(CU1 + 12, CV + 14, BASEH), P(CU0 - 12, CV + 14, BASEH)], W)

def card_local_to_screen(x, y):
    # local (x along u, y down from the card top) on the plane v = CV
    sx, sy = P(CU0 + x, CV, BASEH + CH - y)
    return sx, sy

RX = 16
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

CW = CU1 - CU0
front = [card_local_to_screen(x, y) for x, y in rrect_pts(CW, CH + RX, RX)]  # sunk RX into the slot
dx, dy = P(0, -CT)[0] - P(0, 0)[0], P(0, -CT)[1] - P(0, 0)[1]
back = [(x + dx, y + dy) for x, y in front]
slab = hull(front + back)

card = ["<!-- The first result: a white card standing in a slot in a low base, marked AI, showing what the model checked -->", base_back]
card.append(poly(slab, B200, B, 1.6))
ox, oy = card_local_to_screen(0, 0)
g = [f'<g transform="matrix(0.9 0.45 0 1 {f(ox)} {f(oy)})">']
g.append(f'<rect width="{CW}" height="{CH + RX}" rx="{RX}" fill="{W}" stroke="{B}" stroke-width="1.6"/>')
# AI badge + title bars
g.append(f'<rect x="18" y="18" width="38" height="24" rx="7" fill="{B}"/>')
g.append(f'<path d="M24.5 36 L30 23.5 L35.5 36 M26.6 31.4 H33.4 M42 23.5 V36" fill="none" stroke="{W}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="68" y="21" width="{CW - 96}" height="8" rx="4" fill="{B}"/><rect x="68" y="34" width="{CW - 128}" height="7" rx="3.5" fill="{B200}"/>')
# the working first result: code brackets and two lines of output
g.append(f'<rect x="18" y="56" width="{CW - 36}" height="42" rx="9" fill="{B50}" stroke="{B}" stroke-width="1.2"/>')
g.append(f'<path d="M37 70 l-7 7 l7 7 M49 70 l7 7 l-7 7" fill="none" stroke="{B}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="68" y="68" width="{CW - 104}" height="7" rx="3.5" fill="{B}"/><rect x="68" y="80" width="{CW - 128}" height="7" rx="3.5" fill="{B300}"/>')
# what the model checked: three short labelled lines, each ticked, ruled apart
for i, w1 in enumerate([CW - 92, CW - 112, CW - 100]):
    y = 120 + i * 26
    if i:
        g.append(f'<path d="M18 {y - 13} H{CW - 18}" stroke="{B100}" stroke-width="1.2"/>')
    g.append(f'<circle cx="29" cy="{y}" r="9" fill="{B}"/><path d="M24.5 {y} l3.2 3.2 l6 -6.4" fill="none" stroke="{W}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>')
    g.append(f'<rect x="48" y="{y - 4}" width="{w1}" height="8" rx="4" fill="{B200}"/>')
# the sign-off: a clear outlined button at the foot, waiting on the reviewer's hand
g.append(f'<rect x="14" y="{CH - 54}" width="{CW - 32}" height="32" rx="16" fill="{W}" stroke="{B}" stroke-width="2"/>')
g.append(f'<path d="M{CW / 2 - 18} {CH - 38} l4 4 l7.5 -8" fill="none" stroke="{B}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>')
g.append(f'<rect x="{CW / 2}" y="{CH - 41.5}" width="40" height="7" rx="3.5" fill="{B}"/>')
g.append("</g>")
g.append(base_front)
card += g

# ---------------------------------------------------------------- dashed link: the Enter key's call reaches the card
LU = (eu0 + eu1) / 2
link = (f'<!-- Enter sends the call: one dashed line from the keyboard straight back into the result\'s base -->'
        f'<path d="M{f(P(LU, KV0)[0])} {f(P(LU, KV0)[1])} L{f(P(LU, CV + 14)[0])} {f(P(LU, CV + 14)[1])}" fill="none" '
        f'stroke="{B}" stroke-width="2" stroke-dasharray="6 5" stroke-linecap="round"/>')

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
def pawn(u, v, arm=None, arm_behind=False, badge=None):
    x, y = P(u, v)
    s = ""
    if arm and arm_behind:
        s += client_arm(x, y, *arm)
    s += f'<path d="{body_path(x, y)}" fill="{W}" stroke="{B}" stroke-width="1.6" stroke-linejoin="round"/>'
    s += f'<circle cx="{f(x)}" cy="{f(y - H - R - 4 - HEAD)}" r="{HEAD}" fill="{W}" stroke="{B}" stroke-width="1.6"/>'
    by = y - H * 0.42
    if badge == "code":
        s += (f'<path d="M{f(x - 5)} {f(by - 8)} l-7 8 l7 8 M{f(x + 5)} {f(by - 8)} l7 8 l-7 8" fill="none" stroke="{B}" '
              f'stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>')
    if badge == "tick":
        s += f'<path d="M{f(x - 10)} {f(by)} l7 7 l13 -14" fill="none" stroke="{B}" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>'
    if arm and not arm_behind:
        s += client_arm(x, y, *arm)
    return s

SHOULDER = -H - 3          # the arm grows from the shoulder, just under the head
DEV = ENV("DEV", [KU1 + 32, (ev0 + ev1) / 2 + 4])
REV = ENV("REV", [CU0 - 10, CV + 15])
dx_, dy_ = P(*DEV)
hand_target = P((eu0 + eu1) / 2 + 1, (ev0 + ev1) / 2, hs((ev0 + ev1) / 2) + KEYH - PRESS + 4)
dev_arm = ((-8, SHOULDER), (hand_target[0] - dx_, hand_target[1] - dy_))
rx_, ry_ = P(*REV)
btn = card_local_to_screen(30, CH - 38)
rev_arm = ((8, SHOULDER), (btn[0] - rx_, btn[1] - ry_))
rev = pawn(*REV, arm=rev_arm, badge="tick")
dev = pawn(*DEV, arm=dev_arm, badge="code")

# ---------------------------------------------------------------- assemble, back to front
parts = [floor, "\n".join(card), link,
         "<!-- The reviewer beside the result, marked with a tick: sees what the model checked before signing off -->", rev,
         "\n".join(kb), "<!-- The developer, marked with code brackets, presses Enter -->", dev]
# trimmed viewBox: floor corners (with the dash), the card's top, the pawns' heads
xs = [P(0, 0)[0], P(545, 0)[0], P(0, 402)[0], P(545, 402)[0]]
ys = [P(0, 0)[1], P(545, 402)[1], min(y for _, y in slab), P(*REV)[1] - 120, P(*DEV)[1] - 120]
pad = 6
VB = os.environ.get("VB", f"{f(min(xs) - pad)} {f(min(ys) - pad)} {f(max(xs) - min(xs) + 2 * pad)} {f(max(ys) - min(ys) + 2 * pad)}")
alt = ("Isometric illustration for AI product and developer tool design. On a dotted floor lies a low blue keyboard with white keys, a long space bar and one tall lime Enter key, pressed by a developer marked with code brackets. A dashed line runs straight back from the keyboard into the low base of a white card standing behind it: the first result, marked AI, with a line of code and three ticked checks the model ran. A reviewer marked with a tick stands at the card's corner with a hand on its sign-off button.")
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{VB}" role="img" aria-label="{alt}">\n'
       + "\n".join(p for p in parts if p) + "\n</svg>\n")
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), os.environ.get("OUT", "hero.svg")), "w").write(svg)
