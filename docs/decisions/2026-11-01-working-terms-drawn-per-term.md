---
title: "Each working term is drawn from its own sentence, as one set; none borrows another band's scope drawing"
date: 2026-11-01
status: active
area: [illustration]
source: "Devagya, 1 Nov 2026, About's How Tcules works with clients: \"missing drawings? how did that happen?\"; \"do the drawings here\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

About's six working terms (Who you work with, Communication, Response time, Getting started, Turnaround,
Working hours) each have their own flat scene (`scope-who` … `scope-hours`, `Sketch/terms.tsx`). Each is drawn
from the term's own sentence in the flat-graphics grammar, and the six are drawn together so they read as one
set. A term never takes How we work together's scope drawing because its title shares a word with it.

**Why.** Three terms had borrowed the nearest engagement scope by title and three had no drawing, so they
showed an empty plate. The empty plates were in line with the one-kind-one-component ruling. The borrowed ones
drew a different argument. Both were visible defects in a band of six.

**The mistake it prevents.** A set of drawings where half are blank and half are borrowed.

**How to apply.** `TERM_SCOPES` in `OfferBands.tsx` maps each authored title to its own scene. A new term gets a
new scene, drawn for it, before it ships with a drawing.
