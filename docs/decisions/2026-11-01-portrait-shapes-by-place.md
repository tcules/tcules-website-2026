---
title: "Portrait shape follows the place: rounded squares on profiles, circles in bylines and testimonials"
date: 2026-11-01
status: active
area: [proof, components]
source: "Owner, 1 Nov 2026, reviewing /insights/authors on feat/insights-rich-text (\"rounded square photos here and 'about the author', circle photos in bylines, testimonials\")"
supersedes: []
dbf: ["ch05 §6"]
dbf_status: pending
enforced_by: "review"
---

A person's photograph is a **rounded square** (the 8 radius) where the person is the subject: the author
pages (hero and index cards) and "About the author" (Contributors). It is a **circle** where the person is
a credit beside other content: article bylines and testimonials.

**Why.** A profile presents the person, so it takes the house photograph corner. A byline or a
testimonial names who wrote or said something, so it takes the small disc.

**The mistake it prevents.** One shape everywhere: circles on the author pages, or squares in the bylines.

**How to apply.** PageHero `portrait` and ProfileCard (default `square`) on profiles; Contributors square;
PageHero `credits` and Testimonial circles. ch05 §6 still says "no photograph is masked to a circle" and
needs to state both shapes.
