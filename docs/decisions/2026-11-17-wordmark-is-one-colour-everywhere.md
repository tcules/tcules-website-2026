---
title: The wordmark is one colour for every use; the blue bar is retired
date: 2026-11-17
status: active
area: [iconography, colour]
source: Owner, 17 Nov 2026 ("use full black logo everywhere. blue on top of black is no longer valid for any uses")
supersedes: []
dbf: [ch02, ch10 §A6, ch04]
dbf_status: pending
enforced_by: typecheck
---

The wordmark is set in one colour on every ground and in every place, on the site and off it: the
letters and the bar share the ground's mark colour (black on light grounds, white on dark ones). The
version with a brandeis-500 bar is no longer valid anywhere.

**Why.** The owner retired it outright, for all uses.

**The mistake it prevents.** A blue-bar wordmark on a cover, a deck or a page.

**How to apply.** `Logo` has no `variant` prop, so the accent version can't be asked for, and
`--logo-bar` is gone. Chapter 2 and the wordmark files in `docs/brand/` (`wordmark.svg`,
`wordmark-on-blue.svg`, `wordmark-on-ink.svg`) still show the blue bar and get updated in the next
`/dbf-update`.
