---
title: "The page gutter on a phone is 16"
date: 2026-11-05
status: active
area: [layout, spacing]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "tokens (section.css --sec-gutter, layout.css --lay-scroll-bleed); npm run shots catches a bleed left at the old gutter"
---

Below 768 Section's content column is inset 16 (`--gap-text`), not 32. The 1240 cap and the 32 gutter from 768 stand. A phone scroll row's bleed (`--lay-scroll-bleed`) is the same 16, because it reaches through exactly the gutter.

**Why.** "The overall padding on the sides on mobile can be thinner"; picked 16 over 24. At 32 a 390 phone lost 64 of its width to the sides: the enquiry form "looks aweful on mobile, why is it so narrow", and the case cards read "too slim and tall".

**The mistake it prevents.** A phone column of 326 under a form and card rows designed for more; a component bleeding by the old 32 (Layout's scroll rows did, and pushed eight pages 16 sideways at 390 until the bleed followed the gutter).

**How to apply.** `tokens/components/section.css` (phone block) and `tokens/components/layout.css` change together. Anything that bleeds to the viewport edge on a phone restates 16 by value, as Arena's stage does. CLAUDE.md § Layout states it.
