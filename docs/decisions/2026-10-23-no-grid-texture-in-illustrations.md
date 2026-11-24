---
title: "The site's pixel-grid texture never appears inside an illustration"
date: 2026-10-23
status: active
area: [illustration]
source: "Owner, 23 Oct 2026 (enquiry close illustration)"
supersedes: []
dbf: [ch05 §4a]
dbf_status: applied
enforced_by: "review"
---

"Dont use the = texture on the illustration, that texture is not legal here." The pixel grid belongs to the ground; inside a drawing the only textures are ch05's dot grid and hatching.

**Why.** The grid is the surface the drawing sits on; repeating it inside the drawing blurs the drawing into its ground.

**The mistake it prevents.** The enquiry desk (scripts/enquiry-desk.mjs), whose shaded faces are filled with the grid's cell, and an early enquiry draft that copied it.

**How to apply.** Illustration generators fill faces with palette colours only, plus §4a's dot grid or hatching. ch05 §4a's Texture row gains the exclusion at the next /dbf-update.
