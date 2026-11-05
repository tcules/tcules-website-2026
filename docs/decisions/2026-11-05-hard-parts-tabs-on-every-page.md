---
title: "Hard parts are the tabs on every page, product design included"
date: 2026-11-05
status: active
area: [layout, proof, motion]
source: "Devagya, 5 Nov 2026, in session (illustration workflow set-up): \"/service/product-design should use the tabs variant for hard parts\""
supersedes: [2026-10-31-hard-parts-tabs-on-a-stage]
dbf: []
dbf_status: none
enforced_by: "kinds:check (challenges renders ClaimSet, data-band D-claims); review"
---

Every hard-parts band, `/services/product-design` included, is `ClaimSet` with the tabs layout, as ruled on 31 Oct:
the claims as tabs along the top of a paper-deep stage, each tab "01" and a rule that is its timer, the chosen
claim's slide on paper below (its title and words, then its example on a tinted panel under "Example" or the copy's
own label), the slide moving "as one piece", and every claim on the page below 1024. Hard parts carry no drawing. The
on-page layout (`layout="page"`) is no longer shown on any page; it stays on the `/design/claim-set` specimen.

**Why.** Product design was held on the on-page layout only so the two could be judged side by side on real pages.
The comparison is done: "/service/product-design should use the tabs variant for hard parts."

**The mistake it prevents.** `/services/product-design` keeping a second hard-parts design (`HARD_PARTS_ON_PAGE` in
`CopyBands.tsx`), and with it the four claim drawings in `public/illustrations/claims/`, after every other page went
to tabs with no drawings.

**How to apply.** `ClaimRows` in `src/templates/CorpusPage/CopyBands.tsx` renders every hard-parts band with
`ClaimSet layout="tabs"`; there is no per-route exception. The 31 Oct entry's reasons (the ruled three columns read
as an info dump; one claim at a time with "a nice view for each"; "i like stage better") still stand behind this.
