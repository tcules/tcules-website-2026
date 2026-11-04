---
title: "The FAQ sits beside its heading, in halves, on every page"
date: 2026-11-04
status: active
area: [layout, components]
source: "Owner (Devagya), homepage pass 2.63, 4 Nov 2026 (design/home-pass), reviewed on the built page"
supersedes: []
dbf: []
dbf_status: none
enforced_by: structure (OfferBands, PlainPage, AboutPage)
---
Every FAQ band is ContentSection `beside` with `split="halves"`: the heading in the first half, the
questions down the second. It was centred.
**Why.** The owner asked for "the besides treatment instead of the current center treatment", then
"50/50 split for … FAQs". One kind, one component: every page's FAQ takes it.
**The mistake it prevents.** A centred FAQ, or a narrow head track beside it.
**How to apply.** OfferBands `faq`, PlainPage and AboutPage all render it the same way.
