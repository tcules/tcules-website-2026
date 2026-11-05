# /audits/design-system-audit · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, must read at 400px. `hero.svg`, viewBox
**862 × 567** (1.52:1), healthtech's floor (545 × 402 world units) at family scale. Generator: `build.py`
(`python3 build.py`).

## Candidates

1. **Where it forks.** Three plates stacked on the floor (design file, code library, live product) with one button
   held in its place through all three by a dashed thread; on the live product the place is empty and the team's
   own copy sits beside it, lime, carrying something the library button lacked.
2. **The family tree.** One master component with dashed branches out to many screens, one branch ending in a
   hand-made copy. Rejected: hub-and-spoke from one shared part is what `design-systems.svg` already draws.
3. **The comparison lens.** A Tcules person holds a lens over the live product, showing its button differs from
   the library's. Rejected: inspection through a floating sheet is the hub's (`audits.svg`) idea.

## The pick: 1

The page's method in one picture: trace one component from Figma to code to live screens, and find where it
first breaks. It reads as an audit (a thread followed down, a fork found) rather than as building a system, and
no sibling owns stacked layers.

**Idea:** "They followed our button from Figma through the code to the live product, and found where the team
stopped using it and made their own."

## What is drawn

- **Floor:** the family's: dotted plate, brandeis-50 inset, dashed brandeis-500 edge (1.8, 10/8).
- **Design file** (bottom plate, white, on the floor): a frame on the canvas holding the button, which is
  selected (thin box, four handles).
- **Code library** (middle plate, solid blue, the hero object, brandeis-600/700 edges): white code brackets, a few
  code bars, the library's white pill button in the same place.
- **Live product** (top plate, white): header, side nav, text bars; the button's place is an empty dashed
  outline with the thread's dot in it; a short dotted hop leads to the **local copy**, the one lime object
  (raised 4, #A1B71F edge), whose label carries an extra chevron the library button never had: the reason the
  team went around it.
- **Thread:** dashed brandeis-500, vertical through the three button places, with a dot on each; drawn white
  where it crosses the blue plate so it stays continuous. Plates rest on dashed brandeis-300 drop lines at the
  left and right corners.
- **People:** a Tcules figure (solid blue, white edge, arm from the shoulder, aimed at the lime copy) and a client
  figure (white, blue outline) beside it, on the floor at the stack's right.

## Rounds

1. Idea read, but pills looked like "0" shapes, the copy overlapped the product's text, the arm ended at the head.
2. Bigger pills and short labels; product layout cleared around the copy; figures moved, but they overlapped.
3. Stack centred on the floor, pair moved to the clear front-right; dots on the thread; dot in the empty slot.
4. Arm aimed at the copy with full reach; zoom check: code bars moved out of the thread's column, a stray frame
   under the blue plate removed, the thread drawn white over blue, the front corner post dropped (it crossed both
   plates). Joins checked at 2600px: arm into body, white edge, copy edge, thread ends.

## Blind read (400px)

"Three stacked layers: a design canvas with a button selected, a blue code layer with the same button, and an
app on top. A dashed line runs the button straight up through them, but on the top layer its spot is an empty
outline and a lime button sits off to one side. Two people at the side, one pointing up at it." That is the idea:
the component holds through design and code and forks in the live product.

## Unsure

- The lime chevron (the reason for the workaround) is small at 400px; the fork itself reads, the reason only on
  a closer look.
- Lime normally marks the chosen thing in the family; here it marks the finding (the fork), as the hub's lime
  ring does.
