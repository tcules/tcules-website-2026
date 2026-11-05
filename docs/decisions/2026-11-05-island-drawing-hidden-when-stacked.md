---
title: "The enquiry island's drawing is hidden once the island is one column"
date: 2026-11-05
status: active
area: [illustration, forms]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (CtaSection .art / .artLarge / .artSmall)"
---

The drawing in an enquiry close's island is not shown once the island stacks to one column: below 1024 in the `beside` and `halves` arrangements, below 768 in `above`, which sets its small drawing beside the heading from 768.

**Why.** "Hide form illustration on phone and narrow screens where the island collapses to one column."

**The mistake it prevents.** The drawing stacked over the heading, pushing the form a screen down on a phone.

**How to apply.** `CtaSection.module.css`.
