---
title: A card's crop box draws one hairline around its image, whatever the image's kind
date: 2026-09-29
status: active
area: [cards, imagery]
source: Owner ruling, 29 Sep 2026; docs/dbf-ch05-amendments.md item 5a
supersedes: []
dbf: [ch05 §2, ch05 §9]
dbf_status: applied
enforced_by: review
legacy: dbf-ch05-amendments 5a
---

In `BlockCard` the image takes one hairline whatever its kind: capture, cut-out, illustration or
photograph. The card's crop box draws it, and the image draws none of its own
(`Media edge="placement"`).

**Why.** A card does not show the object as itself: it crops every asset mechanically to its ratio,
so the boundary a reader sees is a cut the card made, and the hairline marks that cut. It also gives
every tile in a set the same boundary, so a cut-out, an illustration and a capture read as one row
of objects rather than three treatments.

**The mistake it prevents.** A card set where each tile takes a different edge by kind, or reading
this as licence to box an illustration elsewhere. No panel for an illustration and no second shadow;
`Figure`, `PageHero` and the ListCard thumbnail keep the edge by kind.

**How to apply.** The rule ink is the house ladder (neutral-300 / 400 / 700 / brandeis-300 by
surface) and darkens on hover. ch05 §9 still says "No edge on any kind" for BlockCard media.
