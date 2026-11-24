---
title: A text post goes out with a single image that carries the cover's look
date: 2026-11-17
status: active
area: [imagery, layout]
source: Owner review of /design/social, 17 Nov 2026 ("we need single frames for text posts so text posts aren't plain text"; "text only posts cant look like an inner frame. they need to carry the look of a cover")
supersedes: []
dbf: [ch10 §C1, ch10 §B3]
dbf_status: pending
enforced_by: review
---

A text post is never posted as plain text. It gets one portrait image (1080 × 1350) with the cover's
look: the wordmark, an isometric illustration drawn for the post, and a line lifted word for word from
the post as its title. It has no foot, because there is nothing to swipe to.

**Why.** A plain text post has no graphic in the feed. A single image that looks like an inner frame
reads as a slide torn from a carousel.

**The mistake it prevents.** The first try reused the inner-frame layout for text posts, and the owner
rejected it.

**How to apply.** In `tcules-social`, a text post is a set with one `cover` frame. The exporter writes
it as `<slug>.png` with no PDF.
