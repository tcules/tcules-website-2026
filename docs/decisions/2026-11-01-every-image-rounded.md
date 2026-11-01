---
title: "Every image takes the 8 radius, captures included"
date: 2026-11-01
status: active
area: [imagery, components]
source: "Devagya, 1 Nov 2026, /how-we-work review: \"images don't have rounded corners?\" Asked whether captures should change: \"Round every image\""
supersedes: []
dbf: ["ch05 §6"]
dbf_status: pending
enforced_by: token
---

Every image Media draws takes the 8 radius: photographs as before, and now captures, screens and placeholders too.
`--media-radius` is `--radius-8`. An illustration has no box, so its corners are its drawing's own.

**Why.** A square capture beside rounded photographs on the same page read as an omission, not a rule.

**The mistake it prevents.** The Benchmark prototype on /how-we-work set square in a band whose neighbours were rounded.

**How to apply.** One token in `src/styles/tokens/components/media.css`. ch05 §6 ("radius 0 on every image but a
photograph") changes in the next chapter update.
