# Flat drawings: the brief every drawing pass works to

The standing brief for drawing, checking and polishing the site's flat drawings (`Sketch`). The saved
workflow `.claude/workflows/flat-drawings.js` hands this file to every agent. Read it whole before drawing.
It adds to the grammar (`docs/research/flat-graphics-grammar.md`) and the logged rulings; where they
conflict, a logged ruling wins.

## What a drawing has to do

1. **One idea, read in one second.** Someone who reads only the title next to the drawing should see that
   title's point in one glance. Draw the title's *claim* (what changes for the client), not its category.
   UX Research is not "a person and some notes": it is *an assumption tested before money is spent on it*.
2. **Simple.** Three or four things at most: a screen, a person, a result, and the route between them.
   No dense UI, no second idea, no words inside the drawing (grammar rule 5).
3. **One subject in blue.** The route and the one focal point. Everything else neutral.
4. **Rest gives nothing away.** Before hover nothing is blue but the route's start port: the answer lights only when the line reaches it.
5. **Distinct within its set.** No two drawings that share a band open on the same glyph or the same picture (two "question → …" tiles side by side read as one idea twice).
6. **Find the idea in words first.** Write the concept as one sentence ("the guess, crossed out, then
   the test's tick") before any geometry. If the sentence needs "and", it holds two ideas.

## How it moves (tile drawings, inside a link)

The motion lives on a **line**, never on a small object (owner, 31 Oct 2026).

- **The guiding examples** are the four home `#product-design` tiles: `product-design`, `design-systems`,
  `design-engineering`, `software-development` (`src/components/Sketch/stories.tsx`). In each one a blue
  route draws itself from the cause to the result, the arrowhead or port lands as it arrives, and the
  thing it reaches lights up. The eye follows the line across the drawing.
- **The failing examples** are the seven tiles of `/services/product-design#services-on-their-own` as they
  stood on 31 Oct: an eye badge popping in, a button shrinking 4%, a bar growing a few units. All correct,
  and you can't see them move.
- **Build it with `TraceIn`** (`src/components/Sketch/scenes.tsx`): the route, hidden at rest, draws
  along its length on hover. What it reaches arrives with it (`GrowIn`: the arrowhead, a halo, a tick).
  `Move` is for at most one big part that travels with the line, never the motion on its own.
- **Rest tells the problem, hover shows it solved.** At rest the drawing still reads (the route simply
  isn't drawn yet); on hover the line connects the problem to its answer.
- **The bar it must clear**, measured by `npm run sketch:frames -- <scene>`: `traceUnits` ≥ 80 (the
  guiding four run 84–164) and `changed` ≥ 25% (they run 23–43; the failing seven ran 12–30 with 0 trace).
  The numbers are a floor, not the goal: the line has to read as the drawing's main event.
- **Plates never move.** The same scene on a 16:9 plate (cards, What you get, Starting points) is drawn
  still, with `TraceIn` showing as the plain finished route. So check that the *finished* state reads too.

## Drawing rules that keep getting broken

- Routes leave the middle of an edge, run on the axes, turn on one 6-unit arc, end on a port or the one
  arrowhead. Never a free diagonal, never through a shape. Ports, turns and ends sit on the 20-unit grid
  (dots at 10, 30, 50 …).
- 1 for outlines, 2 for copy and the route. Corners: 8 for a screen, 4 inside it, pills stay pills.
- Only Solar glyphs (`Glyph`, names from `src/lib/icon-glyphs.ts`) for people, flags, ticks and so on.
  No improvised marks.
- A halo sits 6 units clear of what it rings on every side. Nothing comes within 4 units of another mark
  it doesn't touch. Nothing leaves the drawn box.
- The bare tile crops to the drawing's own edge: when the drawing's extent changes, update its entry in
  `OFFER_DRAWN` (`src/components/Sketch/offer.tsx`) or `L1_SPECIALISTS_DRAWN`, halos included.
- Drawings use no ids (many share a page), and classes come only from `Sketch.module.css`.
- Check every join at zoom: a route meeting a frame, an arrowhead meeting its tip, a halo around its part.

## Locked

The home story scenes in `stories.tsx` are approved and are not redrawn. Every other scene may get a new
concept if it fails the one-second test, or only motion and polish if the concept already reads.

## How a drawing is checked

1. `npm run sketch:frames -- <scene>` (the dev server must be running in the checkout) writes
   `.shots/frames/<scene>.png` (rest | mid | moved at 2x) and `<scene>@1x.png` (moved, real size), and
   prints the motion numbers.
2. **The blind test.** A critic who hasn't seen the brief's concept looks at the `@1x` image and says in
   eight words what it shows, *then* reads the title. A mismatch fails the drawing.
3. **The motion test.** Looking at the strip: is the line the main event, and would someone hovering
   notice it without being told? Does it go from the problem to the answer?
4. **The polish test.** At 2x: grammar rules above, joins, spacing, nothing stray.
