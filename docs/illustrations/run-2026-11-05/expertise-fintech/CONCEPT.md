# /expertise/fintech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 852 × 606 (1.41:1). Generator: `build.py` (`python3 build.py`).

## Candidate ideas (all built around the hub's bank card)

1. **The card pays and the app explains.** The hub's solid blue bank card stands in front, and a dashed line takes
   its payment into a phone whose screen shows the payment's status: two steps done, one stopped with its reason
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
side and nothing joining them, the same weakness the healthtech pilot's blind reader found. This version joins them.

## The drawing (r10, family polish, 5 Nov)

The owner kept the idea and asked for a polish to the family standard (STYLE §9a): the card down to the family
scale on a full healthtech floor, a person, and a phone half that is not the family's stock phone with a lime pill.

- **Idea:** "When my card payment is declined, the app tells me why and lets me try again."
- **Drawn:** healthtech's floor (the dotted plate, the brandeis-50 inset, the dashed edge at 1.8 / 10 8, inset 45),
  wide enough to hold every object with air around it. The hub's solid blue bank card (the hero object) stands on its
  long edge on the floor at the front left, at the family scale (206 x 130, about the phone's width; it was 340).
  A light phone (white face, pale blue edges, blue outline; healthtech's 196 x 372) stands behind it to the right.
  One dashed line rises straight out of the card's top edge, then runs back along the iso axis into the phone,
  ending on the chip of a small copy of the card at the head of the screen. Under it the payment's track: two
  ticked steps on a solid line; the third stopped (a solid brandeis-700 disc with a white "!"), with a white note
  hanging from it giving the reason; the track goes on dashed to the next step, **retry, lit in lime** (a row in the
  track with a circular-arrow node, not a button), and on to a faded last step, paid, not reached yet. A customer
  (a client pawn: white body, blue outline, light arm outlined in blue at healthtech's weight) stands on the floor
  at the phone's right and reaches up toward it.
- **Alt:** Isometric illustration for FinTech product design. A solid blue bank card with a chip and a contactless
  mark stands on its edge on a dotted floor. A dashed line runs from the card up and into a light phone standing
  behind it, ending on the same card at the head of the screen. Below it the payment's steps: two ticked, the
  third stopped with a solid warning mark and a note giving the reason, then the retry step lit in lime and a
  faded last step not yet reached. A customer stands beside the phone, reaching for it.

## How it sits in the family (§9a)

| Check | Here |
|---|---|
| One floor | healthtech's plate, edge, dots and inset, same stroke and dash |
| One scale | phone 196 x 372 as healthtech's; card 206 wide (the hub card's proportion to the app), no longer a product shot |
| Stands on something | card and phone stand on the floor; the customer stands on the floor; the only lifted line is the payment's dashed connector |
| A person | one client figure, the customer, reaching for the retry step |
| No shared formula | light phone, not healthtech's solid blue one; no pill button: the way forward is a lime step inside the payment's own track; the person stands on the right, not a row of people on the left |
| One screen | the phone only |
| Box | viewBox 852 x 606 (1.41), checked at 600 and 360 |

## Parts

| Part | Treatment |
|---|---|
| Floor | healthtech's: dashed brandeis-500 edge (1.8, 10/8), dots at 22 pitch, brandeis-500 inset at 7%, inset 45 |
| Bank card | hero object, 206 x 130: brandeis-500 face, brandeis-600 top edge, brandeis-700 right edge; chip brandeis-100 |
| Phone | light body: white face, brandeis-100 top edge, brandeis-200 right edge, brandeis-50 screen |
| Status | brandeis-500 ticked steps on a solid track; the stop a solid brandeis-700 disc (r13) with a white "!"; reason in a white note whose tail points at the stop; brandeis-300 dashed track on through the retry step to a faded last step |
| Accent | one peridot-400 row, the retry step (rx 12, not a pill), its node a white disc with a neutral-950 circular arrow, one neutral-950 bar |
| Customer | client pawn as healthtech's (body 36 wide, head r13), arm 8.5 blue outline / 5.3 white core, hand 6.8 / 5.2 |
| Connector | one dashed brandeis-500 line on the iso axes, cased in white, dot at each end |

## Construction and rounds

True 2:1 iso, `matrix(0.9 0.45 -0.9 0.45)` for the floor and `matrix(0.9 0.45 0 1)` for upright faces. Thickness
is one hull per edge tone (top lighter, right deeper), never stacked copies. Outlines 1.6 on objects, 1.2 on inner
detail and the connector.

- r1–r9: see `old/build-r9.py` and `old/hero-r9.svg` (card 340 wide in front, thin floor, lime pill, no person).
- r10 (this round, family polish): card to 206 wide; healthtech's floor; the lime pill replaced by the lime retry
  step inside the track, with a faded paid step after it; a customer added at the phone's right. A first try laid
  the phone face up on the floor (`old/hero-r10-flat.*`), which was distinct but made the frame 1.93:1, too wide for
  the 5:4–3:2 box, so the phone stands again. The retry node was first drawn as an open arc in a ringed disc and read
  as a copyright sign when zoomed; it is now an unringed disc with a clockwise arc and a filled arrowhead.
