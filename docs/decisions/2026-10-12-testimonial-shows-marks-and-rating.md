---
title: "A testimonial always shows its quote marks and star rating"
date: 2026-10-12
status: superseded
area: [proof, components]
source: "Owner, 12 Oct 2026"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
legacy: "memory/home-review-patterns-oct-2026.md"
---

"It should always have the quote marks and the star rating." TestimonialCard adds marks to a quote authored without them and warns when a rating is missing.

**Why.** Testimonials were rendering without marks or a rating depending on how they were authored.

**The mistake it prevents.** A content source that drops the testimonial id, so the rating cannot resolve.

**How to apply.** Any new content source carries the testimonial id so the rating resolves. The warning is a development warning in the component, not a build check.

Superseded 5 Nov 2026 by `2026-11-05-testimonial-slides-carry-no-stars`.
