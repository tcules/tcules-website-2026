---
title: "On ink, peridot is the flat drawings' accent"
date: 2026-10-31
status: proposed
area: [illustration, colour]
source: "Devagya, 31 Oct 2026, flat-drawings pass (branch design/flat-line-motion)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "tokens (--skt-* ink block); tokens:check's peridot gate exempts that block only"
---

On the ink surface the flat drawings (`Sketch`) take peridot where paper takes blue: "change the blue to
peridot-500 only on the ink band in the drawings. or basically peridot becomes the main color there." The
route, the focal point, what lights and its halo are peridot (accent `peridot-500`, halo `peridot-950`).
Paper, tint and blue are unchanged.

**Why.** "While we're not using the ink backgrounds for drawings as of now ... we might use this in future or
on FIL page." Brandeis lifted to 300 on ink was the old answer; peridot gives the dark ground its own voice.

**The mistake it prevents.** A future ink band, or the FIL page, inheriting the blue-on-ink drawings by
default.

**How to apply.** Only the `[data-surface='ink']` block of `tokens/components/sketch.css`; a drawing never
names a colour. Proposed until seen on a real ink band. On promotion it narrows
`2026-10-30-flat-drawings-unchanged-by-new-hand` ("no peridot") for ink, and changes ch02 Colour's
"Peridot … two uses only" (dbf ch02, pending then).
