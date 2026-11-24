---
title: The reply promise is led by a lightning bolt, for speed
date: 2026-10-28
status: active
area: [forms, iconography]
source: "Jatin, feedback session 26 Oct 2026 (asked for 'an icon that shows the speed over checkbox'); Devagya picked the bolt over a stopwatch, then bolt-circle over the bare bolt ('it probably looks better'), 28 Oct 2026. Seen rendered and approved by Devagya, 28 Oct 2026."
supersedes: []
dbf: ["ch04 Choosing a glyph"]
dbf_status: applied
enforced_by: review
---

The enquiry card's reply promise ("We reply in 1 business day") is led by Solar Bold `bolt-circle` (a lightning
bolt in a disc), not `check-circle`. In the brand's one-meaning-one-glyph table, the bolt is the glyph for *speed*.

**Why.** Jatin: "can we use an icon that shows the speed over checkbox, like positive check?" A check says
the thing is done or included. The promise is about how fast we answer. A stopwatch was tried first and
Devagya turned it down: "maybe lightning or something else that signifies speed".

**The mistake it prevents.** `check-circle` beside "We reply in 1 business day" in the card's foot, which
reads as a confirmation that something has already happened. Also the stopwatch, which reads as timing
rather than as quickness.

**How to apply.** `EnquiryForm` card dress, the `dressReplyMark`. `bolt-circle` is in `src/lib/icon-glyphs.ts`,
copied verbatim from `@iconify-json/solar` (`bolt-circle-bold`). It is the disc form, matching the check-circle it replaces. Use it wherever the site promises speed. ch04's
meaning table needs a speed → bolt-circle row (pending, /dbf-update 04).
