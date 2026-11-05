---
title: "A split record is one whole table below 1024"
date: 2026-11-05
status: active
area: [components]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (DataTable splitView / wholeView)"
---

A DataTable with `split` sets its two halves side by side from 1024 and renders the WHOLE table once below 1024, one view displayed at a time. The halves no longer stack and join.

**Why.** "Two tables conjoined instead of making one table on phone": the joined halves sized their columns separately, so the joint showed (About's company record).

**The mistake it prevents.** About's record at 390: two frames butted together, their key columns out of line.

**How to apply.** `DataTable` (`.splitView` / `.wholeView`). The join rules and `--dtab-split-key-*` are gone.
