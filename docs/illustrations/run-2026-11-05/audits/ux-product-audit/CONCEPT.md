# /audits/ux-product-audit · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, must read at 400px. `hero.svg`, viewBox
860 × 582 (1.48:1), the expertise heroes' scale (healthtech's pawn, 860 wide). Generator: `build.py`
(`python3 build.py`). Previews: `preview/hero.png`, `preview/hero.at-400.png`.

## Candidates

1. **The stall traced upstream.** One workflow stands as four screens in order along a blue path, a client
   person at each step; the last step is where people stall, and a dashed trace runs back from it to the earlier
   step that causes it, where a Tcules designer has a hand on the cause (lime).
2. **The path of floor tiles.** The workflow as a board-game track of tiles on the floor, pawns on their tiles,
   one pawn stopped at a broken tile and a dashed line back to the tile that broke it.
3. **The ranked fix list.** Findings as cards on the floor being sorted into one ranked column, the top one lime.

## The pick: 1

It is the register brief and the hero line drawn literally ("finds why customers get stuck … finds the cause"):
a reader sees a workflow (screens in a row with step dots, flow arrows on the path), people at their steps, a
warning where it goes wrong and an arrow back to an earlier step. 2 loses the product (no screens, reads as a
game). 3 is the deliverable, not the audit, and repeats the /tools hero's sheet. It also avoids every sibling's
centrepiece: no clear sheet over one screen (hub), no stacked plates, no design-beside-shipped pair, no module
blocks, no AI output.

**The idea in one sentence:** "They walk our workflow step by step, and where people get stuck at the end they
trace it back to the earlier step that really causes it."

## What is drawn

- The hub's floor: dotted plate 610 × 300, brandeis-50 inset at 45, dashed edge 1.8 / 10 8.
- **Hero object:** the workflow, one solid blue path (brandeis-500 top, 600/700 edges, 7 thick) lying on the
  floor, with three white flow arrows between the steps pointing downstream.
- Four step screens (white faces rx 12, brandeis-100 top and 200 side, depth 10) standing on the path in order.
  Each shows a step marker (four dots, its own filled), a header, title and lines, its main field and a blue
  action button.
- Step 2 is the cause: its main field is the one **lime** fill (with a neutral-950 bar).
- Step 4 is the stall: its button is pale (it cannot go on) and ringed with a dotted focus outline; a white
  warning disc rests on the screen's top edge.
- The trace: a dashed brandeis-500 line rises from the warning disc, runs back over the screens and comes down
  with an arrowhead onto step 2's top edge, above the lime field.
- People (two, after the coordinator's fix pass): the Tcules designer (solid blue, white edge) at step 2, and one
  client (white, blue outline) stuck at step 4. Each stands on the path in front of the gap to the left of their
  screen, so no body crosses a screen's content; only the arm reaches in. The designer's hand is on the lime field;
  the client's arm (light core inside a blue outline, 11 thick overall, the designer's weight; hand 8.8, the same
  size) reaches to the dotted ring round the stalled button and stops at it.

## Self-check (STYLE.md)

| Row | Here |
|---|---|
| Arms from shoulder, one weight | both arms masked to grow out of the body; client arm 11 including its outline = designer arm 11; hands 8.8 both |
| White edge on blue figure | head, body and arm edged white (3.6 stroke, paint-order stroke) |
| Devices | the steps are app screens drawn as light panels, not a laptop or monitor; no dark device screens needed |
| One lime | step 2's field only |
| Stands on something | screens and people stand on the path; the path on the floor; the disc rests on screen 4's top edge |
| Lines stop at what they reach | trace starts at the disc, stops with its arrow on screen 2's top edge |
| No text | bars, dots, a "!" glyph only; no `<text>`, no `<style>`, ids prefixed `uxa-` |

Rounds: r1 pawns covered the lime button and the arm crossed it; r2–r3 pawns moved, chevrons became filled flow
arrows, the cause became the larger main field so the lime reads at 400px; r4 taller screens with step dots to
reach 3:2, floor recentred under the path; r5 the warning disc lifted onto the top edge (it hid step 4's dots),
disc and dotted ring enlarged; r6 (fix pass) two figures only, stood in front of the gaps clear of every screen's UI, the client's arm reaching to the stalled button, steps narrowed (96) and spaced wider (62), floor recentred and widened (664 × 280). Zoom-checked both arms' joins and hands, the hand on the field, the arm join, the arrow tip, the disc.

## Blind read (400px)

"Four app screens in a row on a blue path. At the last one a person reaches for a greyed, circled button, with a
warning above the screen: they're stuck. A dashed arrow runs from that warning back to the second screen, where a
blue person has a hand on the green-highlighted box. The problem shows up at the end but comes from step two."
That is the idea.
