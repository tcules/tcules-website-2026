---
title: "Home What we do is a bento of boxed tiles in two sizes"
date: 2026-10-19
status: active
area: [cards, layout]
source: "Owner, 19 Oct 2026 (What we do references and mocks S1/C1/S3)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

Home "What we do" is a Bento: six tiles on two rows of four tracks, Product Design wide first and Software Development wide last, each tile with a hairline edge at rest. "This is a typical services section by content, we just need to find a visually good example and copy it here" — Supabase's product grid, picked over Customer.io's ruled six-box.

**Why.** The boxed router's hover-only ground made its inset read as an indent, and six equal small cards let the head outweigh the services. "Visual beauty is at the core of it."

**The mistake it prevents.** BlockCardSet `frame="box"` on home, and three flush directions (Index, Three columns, Route) that the owner set aside for a standard services layout.

**How to apply.** `Bento` (docs/specs/Bento.md). A scoped exception to `2026-10-05-cards-have-no-boxes` for this set: the tiles are boxed because the owner chose a bento. Other card sets stay unboxed.
