---
title: "Illustrations stay between 0.75 and 1.35 wide"
date: 2026-09-28
status: superseded
area: [illustration]
source: "Owner review, 28 Sep 2026 (service-line illustrations)"
supersedes: []
dbf: ["ch05 §4a"]
dbf_status: pending
enforced_by: "illustrations (scripts/illustrations/build.mjs)"
legacy: "memory/illustration-drawing-standard.md"
---

An illustration is not much wider than tall: "product modernisation type layouts are not appreciated" (a 2:1 row). Artwork stays between 0.75 and 1.35. Height comes from standing or stacked elements; flat planes alone are always ~2:1.

**Why.** Wide rows read as strips, not heroes.

**The mistake it prevents.** The 2:1 product-modernisation layout.

**How to apply.** `npm run illustrations` fails an artwork outside 0.75–1.35. ch05 §4a fixes the source canvas but no aspect band.
