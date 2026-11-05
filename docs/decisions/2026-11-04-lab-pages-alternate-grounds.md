---
title: "The Future Interfaces Lab pages alternate tint and paper down the page; selection steps sit under the form"
date: 2026-11-04
status: active
area: [layout]
source: "Owner (Devagya), review of /future-interfaces-lab and /future-interfaces-lab/join on the built pages, 4 Nov 2026 (design/careers-lab-matter)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: structure (plan.ts ALTERNATE_GROUNDS, STEPS_UNDER_FORM)
---
On /future-interfaces-lab and /future-interfaces-lab/join the bands alternate grounds: the first band
under the hero on tint, then paper, then tint. An island close (the enquiry form, a close island) stays
on paper and the alternation runs on from it, so two tints never touch. Scoped to these two routes; every
other page keeps varying the arrangement rather than the ground.

On /join, "How selection works" sits under the application form, inside the apply band: its heading at
h3, the three stages across, unruled. It is not a band of its own.

**Why.** "Alternating bands on FIL." And: "just under the form is fine. In a section of its own the gap
is too much and it feels disconnected."

**The mistake it prevents.** A run of paper bands on a long, word-led page reading as one surface; a
three-line process stranded a full band's air away from the form it describes.

**How to apply.** plan.ts `ALTERNATE_GROUNDS` (by route) and `STEPS_UNDER_FORM`; CtaSection `after`.
