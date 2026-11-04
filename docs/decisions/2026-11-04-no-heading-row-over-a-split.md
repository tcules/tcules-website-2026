---
title: "A heading never takes its own row over a two-column split"
date: 2026-11-04
status: active
area: [layout]
source: "Owner (Devagya), /why-tcules review, 4 Nov 2026 (design/2-60-why-how): \"heading in its own row followed by a 2-col layout is not legal\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---
A band whose body is a split (words beside a drawing, a tile beside a sentence) puts its heading in the
split: the heading, lead and action in one half, the other object beside them (ContentSection `beside`,
`split="halves"`, or `media`). A heading on a full-width row with a two-column arrangement under it is not
used. A set of cards under its heading is not a split and stays as it is (clickable cards sit under their
head).
**Why.** /why-tcules "Building an AI product?" set its heading and lead on a row, then the claim beside a
drawing under them: two heads, and the drawing floated off the words it belongs to.
**The mistake it prevents.** A head row over a words-and-picture split.
**How to apply.** A lone service claim is its ServiceTile beside the head in halves (CopyBands TextBand).
