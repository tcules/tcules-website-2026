---
title: Every case cover is the V1 cut-out over its own dashboard
date: 2026-11-05
status: active
area: [imagery, cards]
source: "Devagya, 3 Nov 2026, Scissors cover round (V1 picked for every case cover); covers delivered and Kirana ruled 5 Nov 2026, branch design/case-covers-v1"
supersedes: []
dbf: [ch05 §9a]
dbf_status: pending
enforced_by: review
---

Every case cover takes the V1 treatment: the product's UI cut out over its own full dashboard at 13%
opacity, on paper, with one subtle drop shadow. Wherever a case is cited, its V1 cover wins over the case's
Strapi thumbnail and over the case page's first in-page image. A binding that a page's copy makes for a case
still stands. Kirana store payments keeps its live cover (owner, 5 Nov 2026), and a case with no V1 cover
delivered yet (Ringier) keeps its own.

**Why.** Picked from the Scissors cover round as the one treatment for all cases, so the covers read as one
set and each still shows the client's real product.

**The mistake it prevents.** A set of covers mixing square social crops from Strapi with whatever screenshot
a case page binds first, such as home citing Eden AI and ConnectX by in-page section images rather than by
their covers.

**How to apply.** Covers live in `public/case-covers/` and are keyed by live slug in
`src/content/sources/fixtures/case-covers.ts`. `getCaseStudyListingPage` puts them over the Strapi
thumbnail, and `getCaseRefs` drops the in-page stand-in for a case that has one. A new V1 cover is one file
set and one line there. Refines `2026-10-26-case-cards-use-the-case-image`: the case's own image is now its
V1 cover.
