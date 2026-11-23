---
title: "On a testimonial wall the Clutch badge sits under the heading; the phone toggle is centred"
date: 2026-11-23
status: active
area: [proof, components]
source: "Owner, 23 Nov 2026 (overhaul phase 2 review: \"move the clutch rating badge to just under the header on all testimonial walls like on the overhaul branch\"; \"center align the see more buttons\"). First set on the overhaul, owner 18 Nov 2026"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "ContentSection score slot (PublishedHome Testimonials, QuoteGroupBand); WallFold"
---

On a testimonial wall the Clutch RatingBadge is part of the band's head, a `block` under the heading,
through ContentSection's `score` slot, not the band's footer. A slider or a single quote keeps the badge
as its footer, outside the turning row. The wall's phone toggle ("See 3 more") is centred under the wall.

**Why.** The score introduces the quotes: read first, it frames six voices as part of a rated record.
Under the wall it came after six cards, where on a phone few people reach it. The toggle opens the whole
set, so it sits under the set's middle, not under its first column.

**The mistake it prevents.** A rating that only the readers who finish the wall ever see.

**How to apply.** Any new wall passes its badge as `score`. The footer placement it replaces on walls
was never logged (it was a 29 Oct note in the band's code). The badge is still the only form a rating
takes (decisions/2026-10-29-rating-is-always-the-badge).
