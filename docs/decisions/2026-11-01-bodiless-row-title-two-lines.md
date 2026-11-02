---
title: "A list row with no body sets its title to two balanced lines at full width; a short list beside its head splits 50/50"
date: 2026-11-01
status: active
area: [cards, layout]
source: "Devagya, 1 Nov 2026, About's Who uses band: \"lets do 1\" (head beside the list); \"add the icons back? make sure the text always wraps to 2 lines at full width\"; \"make the section split 50/50\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
---

A `ListCard` row with no body is the item's whole sentence, so its title takes the **sentence measure**
(`--lcrd-sentence-measure`, 40ch), not the 32ch title measure. A one-clause sentence of 50 to 80 characters at
`md` takes two balanced lines at full width, from 1280 up. A row with a body keeps the title measure.

When a band's body is a short list beside its head (`ContentSection arrangement="beside"`), the band can take
`split="halves"`: 1 : 1 from 1024 rather than the narrow head track (5 : 7, then 1 : 2). The list then fills its
half instead of leaving a long track half empty.

**Why.** At 32ch the audiences broke after five or six words, three lines each, and the rows looked like a
stack of fragments with the right of the track empty. At the lead measure the short ones ran on one line, the
long ones on two, and the rows stopped matching.

**The mistake it prevents.** A bodiless row wrapping at half its track. A list of rows whose lines run to
different lengths.

**How to apply.** Nothing to set: `ListCard` applies the measure to any row with no body. `split="halves"` is
the band's choice. Between 1024 and 1279 a half track is narrower, and the longest sentences take three lines.
