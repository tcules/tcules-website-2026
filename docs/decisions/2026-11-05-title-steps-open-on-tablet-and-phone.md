---
title: "h2 is 38 on a tablet and 32 on a phone; h1 46 and 38"
date: 2026-11-05
status: active
area: [type]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: ["ch03 §2"]
dbf_status: pending
enforced_by: "tokens (primitives.css title ladder)"
---

The tablet and phone steps of h1 and h2 open up: h1 46 / 38 (was 43 / 34), h2 38 / 32 (was 34 / 28), each with its line height (h1 1.08 / 1.1, h2 1.12 / 1.15). Desktop, display and h3 hold, so the step between h2 and h3 is what grows.

**Why.** "Section title is too small. Maybe we need to up the scale a little bit?" At 390 the 28 section title sat 3px above the 25 h3, so the two steps read as one (tracker 6.5: "the scale reads too close between steps").

**The mistake it prevents.** Home's "Where is your product today?" at 28 on a phone, reading as an item title.

**How to apply.** `--font-size-h1-t/-m`, `--font-size-h2-t/-m` and their line heights in `primitives.css`, changed together. Jatin's sign-off on the reduced type size is still open (tracker, waiting on content).
