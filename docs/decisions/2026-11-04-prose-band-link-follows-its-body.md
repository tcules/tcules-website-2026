---
title: "A prose band's own link follows its body, never between the head and the body"
date: 2026-11-04
status: active
area: [layout, components]
source: "Owner (Devagya), 4 Nov 2026, browser review of /careers \"How AI fits into the job\" (design/careers-lab-matter, pass 2): \"cta below the body?\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (ContentSection `media` renders `actions` after the body, a `block` under it; CopyBands `TextBand` passes a prose band's links as `actions`)"
---

A band's own link ("See how we use AI →") comes after the words it closes, a `block` (24) under the last
paragraph, never between the heading and the body. In ContentSection's `media` split (a picture or a flat
figure beside the copy) the `actions` slot now renders after the body; with no body it sits a `stack` under
the head. Head actions placed under the lead stay for the stacked and beside heads over card sets and hubs.

**Why.** The owner, on the built page: "cta below the body?" A way on placed before the argument reads as
a skip link. The link closes the paragraph, so it belongs under it.

**The mistake it prevents.** /careers "How AI fits into the job": the link sat under the heading, above the
paragraphs, because TextBand passed it as ContentSection's head `actions`, which the media split placed
under the lead. A first fix moved it to the footer in TextBand alone, which left the component placing
head actions before the body for the next caller, at a different distance (48) from the studio bands' (24).

**How to apply.** Pass a media band's own links as `actions`, not `footer` (the footer is the pinned CtaRow
slot). This narrows 2026-11-03-band-links-placed-by-role only for prose bands beside a picture: "See how we
work →" on How we work together stays the head's end action over its cards.
