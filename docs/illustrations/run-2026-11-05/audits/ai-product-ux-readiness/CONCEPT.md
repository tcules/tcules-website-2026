# /audits/ai-product-ux-readiness · hero

Slot: hero beside the copy, paper ground, renders about 600px wide and must read at 400. `hero.svg`, viewBox
699 × 469 (1.49:1). Generator: `build.py` (`python3 build.py`). Previews in `preview/` (`hero.png`, `hero.at-400.png`).
r7 (the first version shown) is kept in `old/`.

## Candidates

1. **The pre-launch check at the screen.** A user works an AI feature on a laptop while a Tcules reviewer checks
   what the AI made: one answer shows its source (a dashed link to the passage in a document beside the laptop) and
   has a check and an undo; the other shows neither and is ringed and marked with a question mark.
2. **The gate before everyone.** An AI-made card waits at a gate in front of a crowd of pale users, a Tcules figure
   holding it there until its source and undo are attached.
3. **The answer lifted out for inspection.** An AI answer card raised off a phone on dashed drop lines, its source
   pinned beside it and a lime undo under it, a Tcules figure looking it over.

## The pick: 1

It draws the buyer's question literally ("can people tell what it did, check it and undo it?"), and contrasts a
result that passes with one that fails, so "marked before launch" reads without words. Candidate 2 says "before
launch" well but needs a crowd and a gate, and its cards on a line are close to the `ai-product-ux.svg` timeline
strip. Candidate 3 lifts a sheet off a screen, which is the hub's own idea (`audits.svg`).

**Idea:** "Before it reaches everyone, they had a user try our AI feature and marked the answer nobody could check
or undo."

## The drawing (r8, family scale)

- **Laptop (hero object):** light body (white faces, brandeis-100 top, brandeis-200 side, blue outline 1.6), lid
  212 × 188 facing left-down, about 1.5 figures tall (fintech's terminal face is 140 × 262); only the screen is dark
  blue. The base lies on the floor with pale key rows and a trackpad.
- **On the screen, top:** a white AI answer (the "AI" badge, a title bar, two lines). Its second line is picked out
  (blue bar on a pale pill), and a dashed brandeis-500 link runs from it along the iso x axis, out across the bezel,
  to the same picked-out passage on a **source document** that faces the laptop and stands on a low foot plate on
  the floor. The link ends in a dot on the document's face.
- **Beside the answer:** a white tick pill and the **lime undo pill** (the one accent, an ink undo arrow), with
  the white pointer on it.
- **On the screen, bottom:** a second AI result in darker blue, with no source link and no controls, ringed in a
  dotted white outline, with a white question-mark disc (like fintech's "!").
- **People, all on the floor plate:** a client user (white pawn) in front of the laptop, hand on the trackpad
  (arm 39); a Tcules reviewer (solid blue, 2.0 white edge) at the lid's right, hand at the ringed result (arm 42).
  Both arms are 11 thick including the client's 1.6 outline, with 8.8 hands, from the shoulder. Three **faded
  pawns** (brandeis-50, brandeis-300 outline, no arms) wait at the front-left: the users it reaches next.
- **Floor:** the family plate (dots, inset 45, dashed edge 1.8 / 10 8) cut to 440 × 330 so it fits the scene.

## STYLE.md check

| Row | Here |
|---|---|
| One idea, three seconds | one answer passes (source, tick, undo), one is marked (ring, question mark), the rest of the users wait |
| Scale | lid about 1.5 figures tall, people at healthtech's pawn size; arms 39 and 42 |
| Device | light body, dark-blue screen only |
| One accent | the undo pill only |
| People | one client, one Tcules, three faded; same arm weight and hand; white edge on the blue figure |
| Stands on something | laptop, document (on its foot plate) and all figures stand on the floor; nothing floats |
| Lines stop | the link starts at the picked-out line and stops on the document's face with a dot |
| No words | only the two "AI" badges and glyph marks (tick, undo arrow, question mark, pointer) |
| File | no width/height, no `<style>`, no `<text>`; ids prefixed `aiuxr-`; palette exact |
| Siblings | no floating sheet, step workflow, layer plates, design-beside-shipped or module blocks |

## Rounds

- r1: lid 226 tall, controls lower right pressed by the reviewer: arms 111 / 131, reviewer's head over the lime.
- r2: controls row under the answer, pointer added; the document's header ran off its top; crowded screen.
- r3–r4: controls as a column beside the answer; the reviewer points at the marked row instead of pressing (the
  client's pointer does the undo); document taller, its passage level with the link.
- r5–r6: laptop narrowed to 282 so the reviewer stands inside the floor; floor moved back to balance; ratio 1.51.
- r7: question-mark disc on the marked result, wider gap between the controls and the ring, smaller pointer kept
  inside the pill, client hand moved onto the trackpad. Zoom-checked the link at both ends, the pill and pointer,
  the reviewer's hand on the bezel and white edge, the client's arm join.
- r8 (coordinator's pass): laptop cut to family scale (lid 282 × 248 to 212 × 188); people moved off the deck onto
  the floor, arms 39 / 42 (were 63 / 65); the document turned to face the laptop and set on a foot plate; the link
  now meets its face; three faded waiting users fill the front-left; plate cut to 440 × 330. Zoom-checked both
  link ends, the reviewer's hand and white edge, the client's feet below the base edge, the pointer inside the pill.

## Blind read (400px, as if the copy were unseen)

"One person stands at a laptop. On its screen an AI answer is joined by a dashed line to a document beside it, with
a tick and a lime undo button under the cursor. Below it another AI result has a question mark, and a blue person
points at it. A few pale people wait off to the side, not using it yet: someone is checking which AI results can be
traced and undone, with one user, before the rest get it." It names the idea, and the waiting figures now carry
*before everyone*.
