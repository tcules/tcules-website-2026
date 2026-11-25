---
title: Smooth scroll is one global setting, off for reduced motion
date: 2026-11-25
status: active
area: [motion]
source: Devagya, 25 Nov 2026 ("smooth scroll should be a global setting")
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

Every in-page scroll glides by one setting, `scroll-behavior: smooth` on the root in `reset.css`: anchor
links, scroll-into-view and scrollTo alike. Reduced motion turns it off (the reset's reduced-motion
block). A change of page still lands at its top at once (`data-scroll-behavior="smooth"` on `<html>`).

**Why.** One motion decision, made once, instead of each component choosing whether to glide.

**The mistake it prevents.** EnquiryLinks and TableOfContents each passing their own
`behavior: reduce ? 'auto' : 'smooth'`, while the listing finder and the index rail jumped.

**How to apply.** Never pass `behavior` to a page scroll; the root decides. A scroll row that moves
sideways keeps its own (`Layout`'s scroll rows, which Slider drives).
