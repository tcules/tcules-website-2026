---
title: "A resource's drawing is still at its end state; a drawing that leads into a page moves; drawings on ink are blue"
date: 2026-11-19
status: active
area: [motion, imagery]
source: 'Owner (Devagya), 19 Nov 2026: "motion on the tiles but the static end state inside resources", "one consistent approach", "the guidepages and articles should show their drawings, still, in their hero so it matches their card", and on ink "revert back to a shade of blue"'
supersedes: [2026-10-31-peridot-leads-flat-drawings-on-ink]
dbf: []
dbf_status: none
enforced_by: "drawingMoves(href) and DRAWN_INSIGHTS in src/lib/sketches.ts; Sketch .end; tokens/components/sketch.css ink block"
---

1. Every still Sketch shows its END state: the picture a tile's hover arrives at, Move parts moved, with no
   transition and under reduced motion too.
2. Whether a drawing in a link moves is decided from its destination, once (`drawingMoves(href)`): an
   insight, a free tool or a glossary entry keeps its drawing still; a link into a page (a service, an
   audit, a sector, How we work) moves it on hover.
3. A drawn guide or article shows the same drawing, still, beside the copy in its own hero
   (`DRAWN_INSIGHTS`, one map that the article covers derive from too).
4. On ink the drawings take brandeis-300 as their accent (halo 950, unplaced part 900), not peridot.

**Why.** A resource's drawing is its thumbnail and its featured image, a picture of the thing; a page
link's drawing is an invitation to go somewhere, and the move says so.

**The mistake it prevents.** A resource thumbnail that wiggles on hover while its own page shows it still,
or a card and its page carrying two different pictures.

**How to apply.** Pass `story={drawingMoves(href)}` wherever a drawing sits in a link; a new drawn insight
is one row in `DRAWN_INSIGHTS`.
