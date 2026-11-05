---
title: "A testimonial slide carries no stars; the wall keeps its rated cards"
date: 2026-11-05
status: active
area: [proof, components]
source: "Jatin, launch review with Devagya, 5 Nov 2026; logged by Devagya and approved on the built pages (design/launch-review-fixes)"
supersedes: ["2026-10-29-testimonials-under-six-turn-one-at-a-time", "2026-10-12-testimonial-shows-marks-and-rating"]
dbf: []
dbf_status: none
enforced_by: "structure (CorpusPage `QuoteSlider` sets no `stars`; `QuoteGroupBand`: `WALL_FROM = 6`)"
---
"Testimonial sliders -> no stars." A band with fewer than six quotes still turns them one at a time in
the one-up Slider, each slide the centred italic quote with its marks, the speaker and their role, and
no stars: "yahan pe sirf padhna hai unko" (here they only read). The band's independent score badge
stays in its fixed place under the slider. Six or more keep the wall of rated testimonial cards, quote
marks and stars as before.

**Why.** Jatin on the built service page: five stars over every turning quote scored each voice instead
of letting it be read; the independent score under the band already says how clients rate the studio.

**The mistake it prevents.** The starred slides on /services/product-design and every service page
through QuoteSlider.

**How to apply.** Everything else in 2026-10-29-testimonials-under-six-turn-one-at-a-time holds (count,
slider controls, portraits on every slide or none, the badge below). The wall and TestimonialCard keep
2026-10-12's marks and rating.
