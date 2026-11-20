---
title: "Case cards are unbounded, and every card image takes the 8 radius"
date: 2026-11-18
status: active
area: [cards, imagery]
source: 'Devagya, 18 Nov 2026, overhaul Home review (selected work): "these become unbounded cards. like so. also make sure the image corner rounding is consistent with other things like cards and images in other places. this seems a little lesser to me."'
supersedes: []
dbf: []
dbf_status: none
enforced_by: token
---

`CaseCard` has no ground and no mat: the cover and the claim sit straight on the band, with the eyebrow, claim,
result and cue unchanged and the sides still alternating. Its cover takes the 8 radius every Media image and
every card image takes. The Teaser's image, the last at 4, takes 8 too.

**Why.** On its paper-deep (or paper) ground with a `text` mat the case read as a boxed panel, and the inset
cover took a smaller 4 inside the card's 8, so it read as less rounded than every other image on the page.

**The mistake it prevents.** A grounded case card returning as the "nicer" one, and per-component image radii
drifting from `--media-radius`.

**How to apply.** `tokens/components/case-card.css`: no `--ccd-ground`, `--ccd-media-radius` is `--radius-8`.
`tokens/components/teaser.css`: `--tsr-media-radius` is `--radius-8`. Updates the "paper-deep ground" wording of
2026-10-29-home-selected-work-is-case-cards and 2026-10-29-paper-deep-is-for-case-cards; CaseCard stays
home's.
