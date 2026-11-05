---
title: "The header's menus: Studio's \"Get in touch\" is its aside"
date: 2026-11-05
status: active
area: [components, layout]
source: "Jatin, launch review with Devagya, 5 Nov 2026; logged by Devagya and approved on the built pages (design/launch-review-fixes)"
supersedes: ["2026-11-04-header-index-and-aside"]
dbf: []
dbf_status: none
enforced_by: "structure (SiteNav's PlatePane and SiteNavAside; the nav fixture)"
---
Everything in 2026-11-04-header-index-and-aside holds (the bar, one plate at the content width, an index
of short-labelled groups, the aside on its deeper ground at the right edge, hover as a move), with one
change: Studio has an aside, "Get in touch" (Careers, Contact), instead of a third group in its index:
"this becomes the side panel in studio menu". The header was seen built at the launch review, so the
structure is active, no longer a proposal.

**Why.** Studio alone had no side panel, so its plate read dull beside the other four ("yahan pe fir woh
ekdum dull lag raha hai"); Get in touch is its way onward, the aside's job.

**The mistake it prevents.** Studio's three equal columns with Get in touch as a peer of Who we are.

**How to apply.** `src/content/sources/fixtures/navigation.ts` STUDIO `aside`.
