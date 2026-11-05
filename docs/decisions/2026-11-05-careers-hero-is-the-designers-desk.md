---
title: "The /careers hero is the designer's desk"
date: 2026-11-05
status: active
area: [illustration, layout]
source: "Devagya, 5 Nov 2026, after PR #228: \"put the desk on the careers hero\"; the desk redrawn in the 5 Nov hand and seen on the review page"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (src/lib/service-illustrations.ts HERO_ILLUSTRATIONS)"
---

/careers' hero shows the designer's desk illustration beside the copy: a Tcules designer's own desk, a light monitor
with the work on its dark blue screen, the one lime element, on the family's floor. The words-only hero /careers had
(proposed 4 Nov, never logged) is gone, and no route is words-only now.

**Why.** The desk is the place the work happens, which is what a careers page offers; it was redrawn in the 5 Nov
hand for /careers or the Lab, and the Lab has its own hero.

**The mistake it prevents.** /careers opening on words alone while every other page's hero carries a picture.

**How to apply.** `HERO_ILLUSTRATIONS[ROUTES.careers]`; `TEXT_HERO_ROUTES` in `src/lib/hero-media.ts` is now empty.
