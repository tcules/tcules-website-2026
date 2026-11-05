---
title: "A card set's ask closes it as one row: the line at the start, the action at the end"
date: 2026-11-05
status: active
area: [layout, components]
source: "Jatin, launch review with Devagya, 5 Nov 2026; logged by Devagya and approved on the built pages (design/launch-review-fixes)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (GatewayPaths `form=\"cards\"`: `close.action` renders the Cluster row)"
---
When a GatewayPaths `cards` set closes on an ask, the close is ONE row under the cards: the line at the
start, set at the cards' own title role ("match the heading of the card"), and the action at the end,
"left right vertically centered, justify space between". Below 768 the action drops under the line. A
close with no ask (a sentence of the set's own words, /how-we-work) stays the centred body line.

**Why.** Jatin: "it should be like one row, where yahan se tu isko likh raha hai aur yahan pe main
button daal raha hai". A centred line over a centred button read as a footnote and an orphan, and at
h5-lg it sat a step under the 22 card titles it closes.

**The mistake it prevents.** Home's "Where is your product today?" close as of 4 Nov: line centred at
h5-lg, button centred under it.

**How to apply.** GatewayPaths `close.action`. The ask is still the page's main ask repeated, so it keeps
the primary solid (the exception carried by 2026-11-05-where-to-start-doors-are-three-parts).
