---
title: "The home hero's drawing is centred wherever the hero stacks"
date: 2026-11-05
status: active
area: [illustration, layout]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (Arena stage inset, driver phone/stacked camera)"
---

Below 1024, where the hero stacks and the drawing sits under the words, the drawing is centred in the column: its stage bleeds evenly to the page gutter on both sides (32, 16 on a phone), and the camera centres on the crews. On a phone the square cut fits all three crews; between 768 and 1023 the camera frames the floor high enough to clear the gap before the next band.

**Why.** "Needs to be centered" on a phone, "animation moves right on 768px to 1023px", then "a little more space under the drawing below 1024px".

**The mistake it prevents.** The phone camera holding on the first crew with the floor running off the column; the tablet drawing pushed to the end; its floor's foot inside the gap above the logo wall.

**How to apply.** `Arena.module.css` (stage inset below 1024) and `driver.ts` (`phone`, `stacked`).
