---
title: "A panel card is tall only beside a covered card; otherwise it is as tall as its words"
date: 2026-11-18
status: active
area: [cards, components]
source: "Devagya, 18 Nov 2026, on an article's \"Explore other resources\" (three panels, empty middles): \"reduce that space and only make these cards tall when they're in a grid with a card that has an image\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "BlockCard (the panel has no least proportion; it fills its grid row)"
---

BlockCard's `panel` frame (the insight card with no picture) has no minimum proportion. Beside a covered card it
fills the row's height, label at its head and words at its foot, so the row ends level; in a row of panels only it is
as tall as its label, title and standfirst.

**Why.** Held square from 768, a row of three panels stood about 400px tall with an empty middle.

**The mistake it prevents.** `--bcrd-panel-ratio: 1` (a square from md) on every panel, 28 Oct, written for mixed
rows and applied to rows with no cover at all.

**How to apply.** BlockCard only; the grid row's stretch does the rest. Every panel on the site (the insights
finder, shelves, "Explore other resources") behaves the same.
