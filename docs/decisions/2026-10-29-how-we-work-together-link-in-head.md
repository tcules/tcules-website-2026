---
title: "How we work together: its own link is the head's end action; the band's other link closes it"
date: 2026-10-29
status: superseded
area: [layout, illustration, components]
source: "Owner review, 29 Oct 2026 (feat/new-copy, home and the offer pages: the action \"How we work together →\" moves into the header)"
supersedes: [2026-10-29-how-we-work-together-band]
dbf: []
dbf_status: none
enforced_by: "structure (EngagementOptions `action` renders in the head; OfferBands `tiles` passes the band's first link as `action`, the rest as `actions`)"
---

How we work together (and any engagement band, kind `tiles`) is EngagementOptions, on every offer page
and home. Its action, "How we work together →", sits IN the head, as the head's end action
(decisions/2026-10-29-head-end-action-centred-on-heading): at the heading's row end from 1024, centred
on it, the lead under that row. Any other link the band carries ("Tell us what you're working on" on the
offer pages) closes the band, a `stack` under the terms. Unchanged from 2026-10-29-how-we-work-together-band:
the head is the heading and the band's opening paragraphs as its lead, stacked (the page's own line,
then the shared "Bring what you have…"); each option is drawn in the FLAT grammar (Sketch `scope-*`),
the drawing above its name and words, three options on three tracks; the closing paragraphs are equal
terms side by side under the options, each on its hairline; Why Tcules keeps its isometric reason
illustrations, both bands with the head above, the items below and no hairline between items.

**Why.** The owner moved the band's action into the header, as every other band's way deeper sits.
Under the items it closed the band on a link that belongs to the heading.

**The mistake it prevents.** "How we work together →" under the options and terms; both links stacked
at the heading's end (the 29 Oct morning build the earlier entry rejected: "two links floating at the
far right of the heading"); the engagement band as a Reasons set with isometric figures.

**How to apply.** `src/patterns/EngagementOptions/` (`action` in the head, `actions` at the foot),
OfferBands `tiles` (first link → `action`, the rest → `actions`). Specimen: /design/engagement-options 0.
