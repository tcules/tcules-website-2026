---
title: "A glossary term page closes in one shape: its sentences, then the destination's wide tile"
date: 2026-11-04
status: proposed
area: [layout, cards]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (glossary critic: two close shapes chosen by whether a sentence had a link)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

Every term page ends with the close's sentences as running text with their inline links, then the destination's wide ServiceTile across the row (title from the destination's name, action from the link's words without the arrow, its own scene). A lone link line inside a term page renders in place as a link row, never dropped. A term's related-term section is a row of drawn term cards the hub's size.

**Why.** Terms that sit side by side in the hub ended differently, and the prose-plus-narrow-card shape left a void under the shorter column.

**The mistake it prevents.** A per-page choice between sentences inside the tile and prose beside a narrow card; "See … → →".

**How to apply.** LongformPage TermClose; LongformShell (lone links, related-term cards); text.ts `labelWithoutArrow`, `destinationName`.
