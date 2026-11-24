---
title: "Chrome controls use universal marks; Solar Bold is for content"
date: 2026-10-01
status: active
area: [iconography]
source: "Owner, 1 Oct 2026"
supersedes: []
dbf: ["ch04 §2", "ch04 §3"]
dbf_status: applied
enforced_by: "review"
legacy: "memory/chrome-icons-are-conventional.md"
---

"We should stick to solar bold icons for the content area and use more widely used icons for chrome like the hamburger menu." Chrome controls (menu, close, anything recognised by shape alone) use the plain universal marks.

**Why.** Chrome is read by convention, not style. Solar's hamburger (bars in a filled rounded square) kept the family but lost the intent.

**The mistake it prevents.** Unifying chrome onto Solar again.

**How to apply.** Chrome glyphs live in `glyphs.ts` under a `chrome-` prefix (`chrome-menu`, `chrome-close`) so content cannot reach them. ch04 §2–3 still fix Menu as Solar `hamburger-menu` and close as `close-circle`.
