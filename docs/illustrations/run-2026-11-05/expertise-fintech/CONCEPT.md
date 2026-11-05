# /expertise/fintech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 865 × 582 (1.49:1), healthtech's width and floor, so it renders at family size. Generator: `build.py` (`python3 build.py`).

## Candidate ideas (all built around the hub's bank card)

1. **The card pays and the app explains.** The hub's solid blue bank card pays, and the product that reads it shows
   the payment's status (a phone up to r10, a card terminal from r11): two steps done, one stopped with its reason
   written out, and one lime button that is the way forward.
2. **The card becomes the app.** The bank card lies flat as a large blue base and the phone stands on it.
3. **The reviewer's case.** A client's staff member at a review screen, the card pinned as the case's evidence,
   the reviewer's limit bar and a lime approve button.

## The pick: idea 1

It is the page's lead drawn literally: "every decline a reason and every failed payment a way forward". A buyer in
lending or payments sees their own product (a card, a payment, an app showing its status) in three seconds, and the
card is the hub's object at the hub's look, so a visitor coming from /expertise recognises the field. Idea 2 turns
the card into a plinth, which reads as a stage rather than as a card. Idea 3 covers one line of the "designs" list
(staff review) and needs a person and a screen to say it, which is two ideas.

The earlier unreviewed draft (kept in `old/` for comparison) had the same idea with the card and the phone side by
side and nothing joining them, the same weakness the healthtech pilot's blind reader found. This version joins them: the card runs into the product that reads it.

## The drawing (r12, final polish, 5 Nov)

r11's idea is kept (a card payment is declined; the terminal says why and gives one lime key to try again). r12
fixes three things the family check named: the size, the pairing that still read like healthtech, and the hand.

- **Idea:** "When my card payment is declined, the terminal tells me why and gives me one key to try again."
- **Drawn:** healthtech's floor exactly (545 x 402 world units, the dotted plate, the brandeis-50 inset at 45, the
  dashed edge at 1.8 / 10 8), viewBox 865 wide, so the two render at one scale side by side. A light card terminal
  at **hub scale** (face 140 x 262, about 70% of healthtech's phone) stands at the back of the floor, face turned
  right-down. Its dark blue screen shows the declined card (a small pale card glyph with a white "!" disc on its
  corner), a title, and the reason in three lines; below, a keypad of nine pale keys and a row of three, the right
  one lime with a retry arrow. The hub's solid blue bank card **lies flat on the floor beside the terminal**, at its
  left foot, so card and terminal sit side by side and no device rises over the card; the screen's card glyph is
  what joins them. The customer, healthtech's client pawn exactly, stands at the terminal's right and **presses
  the lime key**: the light arm (11 with its blue outline, hand 8.8) runs 34 from the shoulder and the hand lands
  on the key's right edge.
- **Alt:** Isometric illustration for FinTech product design. A solid blue bank card with a chip lies flat on a
  dotted floor beside a light card terminal. The terminal's dark blue screen shows the card with a warning mark and
  the reason for the decline written out under it, and on its keypad one key, the retry key, is lit in lime. A
  customer stands at the terminal, pressing that key.

## How it sits in the family (§9a)

| Check | Here |
|---|---|
| One floor | healthtech's plate, edge, dots and inset, same stroke and dash |
| One scale | healthtech's floor (545 x 402) and viewBox width (865); terminal face 140 x 262 at hub scale; card 130 x 206 |
| Stands on something | the terminal stands on the floor; the card lies flat on the floor beside it; the customer stands on the floor; nothing is lifted |
| A person | one client figure, the customer, at healthtech's pawn size, his hand on the lime key |
| No shared formula | no phone, no pill, no device standing over the hub object: a hub-scale card terminal facing right-down, the card lying flat beside it, the person at its right |
| One screen | the terminal's only |
| Box | viewBox 865 x 582 (1.49), checked at 600 and 360 beside healthtech at 360 |

## Parts

| Part | Treatment |
|---|---|
| Floor | healthtech's: dashed brandeis-500 edge (1.8, 10/8), dots at 22 pitch, brandeis-500 inset at 7%, inset 45 |
| Terminal | light body: white face (rx 24), brandeis-100 top, brandeis-200 left side, depth 56, blue outline 1.6 |
| Screen | brandeis-500 (rx 10, brandeis-600 edge): brandeis-200 card glyph with a white warning disc (blue ring and "!") on its corner, white title bar, brandeis-300 subline, three brandeis-200 reason bars |
| Keypad | nine brandeis-100 keys; two white keys outlined brandeis-300; one peridot-400 key (rx 8, #A1B71F edge) with a neutral-950 clockwise retry arrow |
| Bank card | hero object, flat on the floor beside the terminal, 4 thick: brandeis-500 top, brandeis-600/700 edges; chip brandeis-100 with brandeis-300 lines; contactless arcs and bars in white |
| Customer | healthtech's client pawn exactly; light arm outlined in blue at healthtech's weight, masked to grow out of the body |

## Construction and rounds

True 2:1 iso; the terminal face uses `matrix(0.9 -0.45 0 1)` (facing +x), the card and floor `matrix(0.9 0.45 -0.9
0.45)`. Thickness is one hull per edge tone, never stacked copies. Outlines 1.6 on objects, 1.2 on inner detail.

- r1–r9: see `old/build-r9.py` and `old/hero-r9.svg` (card 340 wide in front, thin floor, lime pill, no person).
- r10: `old/build-r10.py`, `old/hero-r10.svg`, `old/hero-r10.at-600.png` (card on its edge, upright light phone with
  a lime retry step, small customer half behind the phone). Rejected by the family check as healthtech's formula.
- r11: the product becomes a card terminal facing the other way; the card lies flat into its slot; the
  lime is a key; the customer at healthtech's size, in the clear on the right. Zoom-checked the slot/card join, the
  terminal's top and side corners, the retry glyph and the arm's join to the body. Kept as `old/build-r11.py`,
  `old/hero-r11.svg`, `old/hero-r11.at-600.png`.
- r12 (final polish): healthtech's floor (545 x 402) and 865 viewBox width; the terminal down to hub scale and the
  card flat beside it rather than in front, so nothing rises over the card; the slot dropped and the screen shows
  the card instead; the customer moved in so the hand lands on the lime key (it stopped about 30px short).
  Zoom-checked the hand on the key, the arm's join to the body, the screen glyphs, the terminal's corners; compared
  with healthtech at 360.
