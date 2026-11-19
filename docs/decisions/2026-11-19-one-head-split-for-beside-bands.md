---
title: "One head split for every beside band: 5 : 7, then 1 : 2 from 1440; halves retired"
date: 2026-11-19
status: active
area: [layout, components]
source: 'Owner (Devagya), 19 Nov 2026, overhaul review: "we need to fix one split for sections like these. i think the FAQ split we have now is good" and "make the FAQ split the same as ''why teams choose…''"'
supersedes: [2026-11-04-faq-beside-in-halves]
dbf: []
dbf_status: none
enforced_by: "ContentSection (no `split` prop), OfferSheet list"
---

Every head set beside its body (ContentSection `beside`, OfferSheet `list`, the FAQ, a short prose band, a
list beside its heading) takes the one head split: 5 : 7 from 1024, 1 : 2 from 1440, `section` (96) between.
ContentSection's `split="halves"` is gone.

**Why.** A head and its body are two different kinds side by side, never peers, so they never share the row
evenly; two splits for one relationship read as two systems.

**The mistake it prevents.** Re-adding a halves option for one band whose body is short.

**How to apply.** Two peer lists side by side are a `Layout` of two in the body, not a head split.
