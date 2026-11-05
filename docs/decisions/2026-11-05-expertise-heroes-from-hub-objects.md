---
title: "Each industry's hero is built around its object in the expertise hub drawing, and the hub's cards show them"
date: 2026-11-05
status: active
area: [illustration, layout]
source: "Devagya, 5 Nov 2026, illustration run: \"pick elements from the expertise hub illustration and build new ideas around it. the goal is to have relevant, clear, straightforward drawings that are elegant, beautiful, polished\"; \"all expertise pages should have an illustration and not stock images\"; on batch 1, direction \"A\" (polish, keep them simple); on the cards, \"for now we'll just replace the stock images with illustrations\"; the set approved as drawn"
supersedes: []
dbf: [ch05 §4]
dbf_status: pending
enforced_by: "structure (src/lib/service-illustrations.ts HERO_ILLUSTRATIONS; HubBands DestinationGroupsBand reads it before any photograph)"
---

Every `/expertise/*` page's hero is an illustration built around one real object: the one the expertise hub drawing
uses for that industry (card, wind turbine, cap on books, house on its lime tile, shopping bag, medical case), or one
drawn the same way where the hub has none. The twelve are one family: simple, one clear idea each, one floor, one
scale, nothing floating, at least one person, no two in the same arrangement. The industry cards on `/expertise`
show each industry's hero in place of a stock photograph.

**Why.** A visitor coming from the hub recognises their field; a stock photo said nothing about the product.

**The mistake it prevents.** Eleven expertise heroes on the generic studio-photo placeholder, and the hub's industry
cards on stock sector photographs.

**How to apply.** STYLE.md §9a; `HERO_ILLUSTRATIONS` in `src/lib/service-illustrations.ts`; the card cover in
`src/templates/CorpusPage/HubBands.tsx`.
