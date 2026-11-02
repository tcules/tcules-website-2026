---
title: "A byline shows initials in the circle when the person has no photo"
date: 2026-11-01
status: active
area: [proof, components]
source: "Owner, 1 Nov 2026, reviewing /insights/* on feat/insights-rich-text (\"no avatar circle?\"; then \"overturn and show initials for no photos\")"
supersedes: [2026-10-11-avatars-are-photos-or-nothing]
dbf: ["ch05 §6"]
dbf_status: pending
enforced_by: "review"
---

Every person in a byline gets the circle. A person with no photograph shows their initials in the
outlined disc, so every byline carries a face in the same place. Overturns "avatars are circular photos
or nothing" for bylines. Testimonials and profile cards keep a photograph or nothing.

**Why.** Five authors have no photo in Strapi (Yash, Chirag, Rishabh, Anshu, Varun), which is 67 bylines.
Those bylines read as broken next to the ones that have a face. Photos replace the initials as they are
uploaded.

**The mistake it prevents.** The PageHero byline showed a bare name, with no disc, whenever nobody in the
group had a portrait (`/insights/saas-customer-onboarding-software`, Yash Gidwani).

**How to apply.** PageHero `credits` (articles, videos, podcasts) and Contributors at the article's end.
TestimonialCard and ProfileCard are unchanged: photograph or nothing.
