---
title: "A row's title may carry its icon inline; a card's icon still heads it"
date: 2026-11-17
status: active
area: [iconography, cards]
source: "Owner, page overhaul planning, 17 Nov 2026 (tracker O.2: \"An icon may sit inline with a row's title\"); About's \"How Tcules works with clients\", 19 Nov 2026 (\"icons inline with titles, remove the rules\"). Logged 25 Nov 2026 in the tracker verification PR."
supersedes: []
dbf: [ch04 Pairing]
dbf_status: applied
enforced_by: "structure (ListCard `titleIcon`, rows only; ListCard `rule=\"none\"` for a grid of rows)"
---

Any ROW may carry one glyph inline before its title's first word, sized to the title, in the mark ink:
ListCard's `titleIcon`, as OfferSheet's rows already do (2026-11-04-sheet-row-glyph-sits-inline). A grid of
such rows, several to a line, drops the rules (`rule="none"`) and lets the Layout seam separate them. A
tile or card keeps its glyph above the title (2026-10-09-icon-heads-its-card still holds for cards).

**Why.** A row's title already sits on the line its body follows; a glyph stacked above it adds a line and
breaks the left edge the titles share. The overhaul boards set row icons inline.

**The mistake it prevents.** Forcing row sets, such as About's "How Tcules works with clients", into the
card rule and stacking their glyphs, or applying `titleIcon` to a tile.

**How to apply.** ListCard `titleIcon` on rows only (a tile's glyph is `marker: { type: 'icon' }`); the
specimen is /design/list-card 12c. CLAUDE.md § Design quality states the row exception.
