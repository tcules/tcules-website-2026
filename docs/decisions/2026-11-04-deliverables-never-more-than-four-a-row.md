---
title: "What you get never sets more than four deliverables a row"
date: 2026-11-04
status: proposed
area: [layout, cards]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (audits critic: five ~220px plates in one row on design-system-audit and modernisation)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

OfferParts sets at most four deliverable tracks a row: five read three then two at every width from 1024. Below 768 a deliverable's drawing stacks at full width over its words. Two terms under the deliverables (no "What we need") is a built count, not a gap.

**Why.** Five across packed small plates under three-line bodies, which the owner has called crammed ("prefer fewer, larger items per row", service page round 1); on a phone, thumbnails beside words could not be read.

**The mistake it prevents.** A strip whose tracks equal its item count at any count.

**How to apply.** src/patterns/OfferParts. Open edge for the owner: 2-up plates under 768 were not taken (about 147px each).
