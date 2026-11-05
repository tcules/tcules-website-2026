---
title: "A testimonial band with fewer than six quotes turns them one at a time; six or more keep the wall"
date: 2026-10-29
status: superseded
area: [proof, layout, components]
source: "Owner review of the built 26 Oct copy pages, 29 Oct 2026 (feat/new-copy, round 2; branch feat/r2-proof)"
supersedes: ["2026-10-10-testimonials-use-a-rated-card"]
dbf: []
dbf_status: none
enforced_by: "structure (CorpusPage `QuoteGroupBand`: `WALL_FROM = 6`; below it `QuoteSlider`, the one-up Slider of centred Proof with stars)"
---

"For testimonial section where we don't have 6 or more testimonials, we'll use this variant with a
slider": the centred italic quote with its client's stars, the speaker and their role, on the tint proof
band, one quote at a time in the kit's one-up Slider with its plain bars (2026-10-09-testimonial-slider-
controls). Six or more keep the wall of rated testimonial cards. The rating badge sits "either at top or
in a fixed area below the testimonials": it sits BELOW, in a fixed place outside the turning row.

**Why.** Three, four and five rated cards made a wall with holes or a row of equal boxes; one voice at a
time is the band's one idea. Below rather than on top because the head then the voice is the band's
path, a badge between them stacks its star over the quote's five, and below is where the wall already
carries the score, so it has one place whatever the count. This is the owner's explicit exception to
"no hidden cards", for testimonials only (testimonials are not search content,
2026-10-05-testimonial-slider-allowed); every slide is in the page as it loads.

**The mistake it prevents.** The three-, four- and five-card TestimonialWalls on /contact, /about,
/services/product-design, /expertise and /case-studies.

**How to apply.** Every testimonials band goes through `QuoteGroupBand`, which counts the quotes. Each
slide is still a rated, named testimonial (stars, the quote with its marks, the speaker): what the
superseded 10 Oct entry required of a group's card, kept. A portrait shows on every slide or none, the
wall's rule. One quote alone is no slider. Home's six keep the wall, so the homepage still hides nothing.

Superseded 5 Nov 2026 by `2026-11-05-testimonial-slides-carry-no-stars`.
