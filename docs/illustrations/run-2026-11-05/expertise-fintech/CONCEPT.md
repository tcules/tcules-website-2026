# /expertise/fintech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 735 × 579 (1.27:1). Generator: `build.py` (`python3 build.py`).

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

## The drawing (r11, family fix, 5 Nov)

The family check found r10 still copied healthtech's arrangement (hub object left, upright phone right, lime pill),
the customer the smallest in the family and half hidden behind the phone base, and the card standing on its edge with
no footprint. r11 keeps the idea and changes the product: **a card terminal**.

- **Idea:** "When my card payment is declined, the terminal tells me why and gives me one key to try again."
- **Drawn:** healthtech's floor (the dotted plate, the brandeis-50 inset, the dashed edge at 1.8 / 10 8, inset 45).
  A light card terminal (white face, brandeis-100 top, brandeis-200 side, blue outline) stands on the floor at the
  back left, **its face turned right-down** (healthtech's phone faces left-down). Its dark blue screen shows the
  decline: a white warning disc with a "!", a title bar, and the reason written out in three lines. Below it a
  keypad: nine pale keys and a row of three, **the right one lime with a retry arrow** (a key, not a pill button).
  The hub's solid blue bank card (the hero object, chip and contactless mark) **lies flat on the floor and runs
  into the slot at the terminal's foot**, so it has a footprint and card and product are one object; no connector
  is needed. The customer, a client pawn at **healthtech's exact size** (body 44 wide, 62 high, head r16; arm 11
  with its blue outline, hand 8.8), stands in the clear on the floor at the terminal's right, beside the card, and
  reaches toward the lime key with a short arm from the shoulder.
- **Alt:** Isometric illustration for FinTech product design. A solid blue bank card with a chip lies flat on a
  dotted floor and runs into the slot of a light card terminal standing behind it. The terminal's dark blue screen
  shows a warning mark with the reason for the decline written out under it, and on its keypad one key, the retry
  key, is lit in lime. A customer stands beside the terminal, reaching toward it.

## How it sits in the family (§9a)

| Check | Here |
|---|---|
| One floor | healthtech's plate, edge, dots and inset, same stroke and dash |
| One scale | terminal 186 x 318 face (healthtech's phone is 196 x 372); card 130 x 206, the phone-width hub card |
| Stands on something | the terminal stands on the floor; the card lies flat on it and runs into the slot; the customer stands on the floor; nothing is lifted |
| A person | one client figure, the customer, at healthtech's pawn size, fully in view, reaching toward the lime key |
| No shared formula | no phone and no pill: a card terminal facing right-down at the back left, the hub object lying flat in front and joined to it, the person on the right. Unlike commerce/data's flat tablet, nothing rises off the card |
| One screen | the terminal's only |
| Box | viewBox 735 x 579 (1.27), checked at 600 and 360 |

## Parts

| Part | Treatment |
|---|---|
| Floor | healthtech's: dashed brandeis-500 edge (1.8, 10/8), dots at 22 pitch, brandeis-500 inset at 7%, inset 45 |
| Terminal | light body: white face (rx 24), brandeis-100 top, brandeis-200 left side, depth 56, blue outline 1.6 |
| Screen | brandeis-500 (rx 12, brandeis-600 edge): white warning disc with a blue "!", white title bar, brandeis-300 subline, three brandeis-200 reason bars |
| Keypad | nine brandeis-100 keys; two white keys outlined brandeis-300; one peridot-400 key (rx 8, #A1B71F edge) with a neutral-950 clockwise retry arrow |
| Slot | brandeis-700 rounded bar at the face's foot, a little wider than the card |
| Bank card | hero object, flat, 4 thick: brandeis-500 top, brandeis-600/700 edges; chip brandeis-100 with brandeis-300 lines; contactless arcs and bars in white |
| Customer | healthtech's client pawn exactly; light arm outlined in blue at healthtech's weight, masked to grow out of the body |

## Construction and rounds

True 2:1 iso; the terminal face uses `matrix(0.9 -0.45 0 1)` (facing +x), the card and floor `matrix(0.9 0.45 -0.9
0.45)`. Thickness is one hull per edge tone, never stacked copies. Outlines 1.6 on objects, 1.2 on inner detail.

- r1–r9: see `old/build-r9.py` and `old/hero-r9.svg` (card 340 wide in front, thin floor, lime pill, no person).
- r10: `old/build-r10.py`, `old/hero-r10.svg`, `old/hero-r10.at-600.png` (card on its edge, upright light phone with
  a lime retry step, small customer half behind the phone). Rejected by the family check as healthtech's formula.
- r11 (this round): the product becomes a card terminal facing the other way; the card lies flat into its slot; the
  lime is a key; the customer at healthtech's size, in the clear on the right. Zoom-checked the slot/card join, the
  terminal's top and side corners, the retry glyph and the arm's join to the body.
