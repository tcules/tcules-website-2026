# /expertise/fintech · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 678 × 571 (1.19:1). Generator: `build.py` (`python3 build.py`).

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

## The drawing

- **Idea:** "They make the app tell you what happened to your card payment, and what to do next."
- **Drawn:** the family's dotted floor with a dashed edge and a soft inset, trimmed so the card's front-left corner
  sits about 40 inside the dashed edge. A solid blue bank card (the hero object, a real card's 1.59:1) stands on its
  long edge in front, with a pale chip, a contactless mark, a white number stripe and two short bars, and a deeper
  blue edge on top and right. A light phone stands beside it to the right (white face, pale blue edges, blue
  outline). One dashed line leaves the card's top edge, rises to just above the phone's screen corner, then runs back
  into the phone along the iso axis and ends on the chip of a small copy of the same card (chip and white stripe) at
  the head of the screen. Under it, the payment's steps: two blue ticked steps on a solid track; the third stopped,
  a solid brandeis-700 disc with a white "!" (1.3x the tick discs, the loudest mark after the button); a white note
  hanging from it with a tail pointing at the stop, three bars giving the reason; the track goes on dashed and pale
  to a faded fourth step not reached, and on down to one lime button with a dark bar and an arrow.
- **Alt:** Isometric illustration for FinTech product design. A solid blue bank card with a chip and a contactless
  mark stands on its edge on a dotted floor. A dashed line runs from the card up and into a light phone standing
  beside it, ending on the chip of the same card at the head of the screen. Below it a payment's steps: two ticked,
  the third stopped with a solid warning mark and a note hanging from it giving the reason, a faded step not yet
  reached, and one lime button with an arrow, the way forward.

## Parts

| Part | Treatment |
|---|---|
| Floor | dashed brandeis-500 edge, brandeis dots at 22 pitch, brandeis-500 inset at 7% (as `expertise.svg`) |
| Bank card | hero object, 340 × 214: brandeis-500 face, brandeis-600 top edge, brandeis-700 right edge; chip brandeis-100 |
| Phone | light body: white face, brandeis-100 top edge, brandeis-200 right edge, brandeis-50 screen |
| Status | brandeis-500 ticked steps on a solid track; the stop a solid brandeis-700 disc (r13) with a white "!"; reason in a white note whose tail points at the stop; brandeis-300 dashed track to a faded step (brandeis-300 ring, 200/100 bars) and on to the button |
| Accent | one peridot-400 button (the way forward), dark bar and chevron in neutral-950 |
| Connector | one dashed brandeis-500 line on the iso axes, cased in white where it crosses the phone, dot at each end |

No people: the idea is about what the app says, not who does what.

## Construction and rounds

True 2:1 iso, `matrix(0.9 0.45 -0.9 0.45)` for the floor and `matrix(0.9 0.45 0 1)` for upright faces. Thickness
is one hull per edge tone (top lighter, right deeper), never stacked copies. Outlines 1.6 on objects, 1.2 on inner
detail and the connector; strokes scale with the drawing, as in the family.

- r1: from the draft, the card brought forward, the connector added (the draft computed it but never drew it),
  floor sized to the objects.
- r2: card larger and nearer the phone so the two read as one group; mini card on the screen enlarged.
- r3: non-scaling strokes removed (they rendered heavier than the family at hero size); ticks thickened.
- r4–r6: the connector's end dot kept clear of the mini card's content (the line kept crossing its number bar, so
  the mini card is now the card shape and chip only).
- r7–r8: floor margins balanced so the front of the floor is not an empty triangle; ratio 1.26.
- r9 (fix pass on the critic's notes): the stop made the loudest mark after the button (solid 700 disc, white "!",
  1.3x); a faded fourth step on a dashed pale track shows the step not reached, and the track runs on to the
  button so the screen reads stopped, why, do this; the reason note hangs from the stop with a tail, and the
  stopped row's heavy blue bar thinned to a normal title; the mini card gained the card's white stripe and the
  connector now ends on its chip, its corner just above the phone's screen corner. Floor trimmed so the front-left
  wedge is gone; trimming alone made the frame 1.07 (the phone is tall), so the card was enlarged to 340 wide and
  the phone moved along +x (which adds width without height) to bring the frame back to 1.19. Checked at 600 and
  360: the disc, the note's tail and the dashed not-reached track all hold at 360. Previous round kept in `old/`
  (`hero-r1.*`, `build-r1.py`).
