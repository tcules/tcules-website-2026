---
title: "Responsive images are Strapi's own formats as a native srcset"
date: 2026-09-28
status: superseded
area: [imagery]
source: "docs/phase-2-decisions.md, owner rulings for Phase 2 (28 Sep 2026), M1"
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
legacy: "phase-2 M1"
---
Responsive images are served from **Strapi's own formats**, as a native `srcset`. No `next/image` and no
build-time pipeline. The site is hosted on **Railway**.

**Why.** The CMS already produces the derived widths at upload, so the site needs only to point a `srcset`
at them. A second resizing pipeline would duplicate that work and tie delivery to a host-specific optimiser.

**The mistake it prevents.** Every pattern rendering one `<img src>` with no `srcset` (the component
audit's finding), or reaching for `next/image` or a build step to fix it.

**How to apply.** `Media` (tier 1) builds the `srcset` from the formats the asset carries; nothing else in
the tree resizes images. Strapi's upload breakpoints are set to the width ladder (see the M2 entry and
`docs/strapi-changes.md`).
