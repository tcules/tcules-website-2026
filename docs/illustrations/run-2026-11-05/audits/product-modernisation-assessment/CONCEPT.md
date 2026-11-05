# /audits/product-modernisation-assessment · hero

Slot: hero beside the copy, paper ground, renders about 600px, must read at 400px. `hero.svg`, viewBox
**860 x 511** (1.68:1), the family floor (545 x 402) at the siblings' scale. Generator: `build.py` (`python3 build.py`). Previews in `preview/` (860 and 400). Earlier rounds
(r1 lifted high; r2 trimmed floor, towering back blocks) are kept in `old/`.

## Candidates

1. **The product taken apart into its areas.** The established product as one solid blue slab cut into five module
   blocks; each block carries a glyph for its answer; the one to start with is lifted out of its socket in lime, with
   dashed dependency lines down to the blocks that wait on it; a Tcules figure points it out beside the client.
2. **Sorting into five trays.** The product's tiles being placed into five trays on the floor, one per answer.
3. **A route through the product.** The modules on the floor with a dashed path visiting them in order, the first
   stop lime.

## The pick: 1

It holds the brief's three parts in one object: split into areas (the cut slab), one answer each (five glyphs), and
the order set by what depends on what (the lifted block with lines to its dependants). Candidate 2 loses the
product as one whole, and the trays need labels to say which answer is which. Candidate 3 reads as a workflow traced
step by step, which is what the UX audit sibling owns. Candidate 1 also stays clear of the service hero
(`product-modernisation.svg`, three screens old to new): no screens here, just the product's areas being sorted
and ordered.

**The idea:** "They split our product into its areas, gave each one an answer, and showed us which one moves first."

## What's drawn (r2, after the coordinator's fix pass)

- **Floor:** the family plate at 545 x 402 (dashed edge 1.8, 10/8; dots at 22; inset at 7%), 860 wide, so objects
  render at the siblings' size.
- **The product (hero object):** a solid brandeis-500 slab, 26 thick, brandeis-600/700 edges, rounded.
- **Five modules**, white with brandeis-200/100 sides. The back column stands a little taller (the tallest, the cross,
  rises 106 above the floor, about 0.9 of a figure's height) (cross = rebuild or retire,
  turning arrow = redesign); the front column is low (tick = keep, minus = simplify). Each answer is one blue glyph
  on a brandeis-100 disc on the block's top.
- **The first module** (reports, front-right): the one lime accent, lifted 50 (a third of r1) just clear of its
  socket. The socket shows as a dashed white outline, with three short dashed drop lines at the block's corners. Its
  glyph is an up arrow on a base line (new platform) in neutral-950.
- **Dependencies:** a single dashed wire (2.1 stroke, 6/4 dash), with every run on an iso axis. It leaves the lime block's left face, runs
  along +y over the front column and drops straight onto the simplify and keep discs. It then turns along -x and
  stops with a dot on the redesign tower's face. It no longer tangles with the drop lines.
- **People:** both at the slab. The Tcules pawn (solid blue, white edge) stands at the front-right with its hand
  on the lime block's right face. The client pawn (white, blue outline) stands at the front-left with a light arm
  (11 including its 1.6 outline, hand 8.8, the same weight as the Tcules arm) resting on the keep block's face.

## Self-check (STYLE.md)

| Row | Here |
|---|---|
| One idea, no words | yes; glyphs only, no text, no numbers |
| One hero object, solid blue | the product slab |
| One lime accent | the lifted module only |
| Stands on something | slab and people on the floor; modules on the slab; the lifted one tied to its socket by drop lines |
| Arms | both from the shoulder, same weight (11, hand 8.8); the client arm is a light core in a blue outline, masked to grow out of the body |
| White edge on blue figure | body and head edged 2 visible white (paint-order stroke), arm cased in white |
| Devices | none |
| Lines stop at what they reach | the wire's drops land on the disc rims and its end on the tower face; drop lines run block corner to socket corner |
| Palette | only the STYLE §7 hexes (checked by grep) |
| File | no width/height, no `<style>`, no `<text>`, one prefixed id (`pma-dots`), `role="img"` + `aria-label` |

Rounds: (1) flat glyphs in the floor frame, 1.9:1, lifted block in front hiding modules: rebuilt with the first
block at the back so nothing is hidden and the lift gives the height; (2) people overlapping the slab and each
other, arm pointing into a head: moved to clear floor, client in front, Tcules behind-right; (3) glyphs redrawn in a
45°-turned top frame so they read upright (the tick read as an "L"), pencil replaced by a turning arrow, discs
enlarged for 400px, drop lines moved onto the rounded corners, slab moved off the floor's back edge.

Round 5 (last pass): the floor is back to 545 x 402 at 860 wide. The back blocks come down from 124/92 to 74/80,
so the slab reads as one product again and the lime block stays the eye. The wire is thickened to 2.1. The
ratio is 1.68.

Round 4 (fix pass): the lift is cut to a third, and the first module moves to the front-right so both people can reach
the group. The back column is made taller and the floor trimmed so the box keeps its height. The lines are split
into short corner drops and one iso-axis wire. Hands land on the blocks. Joins are zoom-checked (both arms at
their shoulders, wire taps, the socket corners).

## Blind read (400px, as if the copy was unseen)

"A blue base carrying white blocks of different heights, each with a mark: a turning arrow, a cross, a tick, a
minus. One lime block with an up arrow is raised just out of its slot, and a dashed line runs from it to the other
blocks. A blue person has a hand on the lime block; a client stands at the other side with a hand on the tick
block. A product split into parts, each given a verdict, deciding together which part goes first."

## Unsure

- 1.68:1, which is wider than 3:2 but within the coordinator's ~1.7 allowance.
- The up arrow could read as "upload".
