---
title: "Every testimonial carries stars, and one person gives one rating site-wide"
date: 2026-11-02
status: active
area: [proof, content]
source: "Devagya, 2 Nov 2026, /why-tcules review: \"testimonials should always appear with star ratings, one named person gives one rating across the website despite different quotes. ratings are either 4.5 or 5 never less.\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "loader"
---

Every quote renders with stars. The rating belongs to the person, not the quote: Stephanie Leue's every quote
carries the same score on every page. While the ratings are placeholders, each is 4.5 or 5, nothing else.

**Why.** Ratings were keyed by testimonial id, so a person quoted twice could carry two scores, and a quote whose
id had no entry, or whose page's ids did not line up with its quotes, showed no stars (Auxentios on /why-tcules).

**The mistake it prevents.** A bare quote beside a rated one in the same slider, and one client "rating" us twice.

**How to apply.** `RATINGS_BY_PERSON` in `src/content/sources/fixtures/testimonial-ratings.ts`, keyed by the
name the sign-off starts with. The corpus loader rates every quote from it and fails the load on a quoted
person with no entry; `rating()` throws on any placeholder that is not 4.5 or 5. Real published ratings
replace the table (P36).
