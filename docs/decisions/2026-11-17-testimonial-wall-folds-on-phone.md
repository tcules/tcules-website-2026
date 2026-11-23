---
title: "A testimonial wall shows three on a phone, then \"See N more\""
date: 2026-11-17
status: active
area: [proof, components]
source: "Owner, 17 Nov 2026 (page overhaul planning, Jatin's m- boards; tracker O.3); the toggle as the link button, owner 18 Nov 2026"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "TestimonialWall foldOnPhone"
---

Below 768 a testimonial wall shows its first three cards, then a "See 3 more" toggle (a real button,
`aria-expanded`, in the link-button voice every in-band "see more" takes). The rest stay in the page and
open in place. From 768 the wall is unchanged. Every live wall opts in with `foldOnPhone={3}`.

**Why.** Six full testimonial cards stacked in one 358 column are the longest scroll on the page, and
the proof is made by the first few.

**The mistake it prevents.** A phone page whose testimonial band runs six screens.

**How to apply.** This narrows decisions/2026-10-16-no-hidden-cards for testimonials only, and on a phone only: a set
of cards people choose between is still shown whole. Pass `foldOnPhone` on any new wall.
