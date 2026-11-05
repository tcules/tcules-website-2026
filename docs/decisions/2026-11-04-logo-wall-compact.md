---
title: "Client logo walls are compact, the label at the start; on home the wall is the hero's foot row"
date: 2026-11-04
status: superseded
area: [proof, layout, components]
source: "Owner (Devagya), homepage pass 2.63, 4 Nov 2026 (design/home-pass), reviewed on the built page"
supersedes: []
dbf: []
dbf_status: none
enforced_by: structure (RecognitionGrid, LogoGrid density)
---
Every client logo wall is LogoGrid `density="compact"`: 96 cells (72 on a phone), the marks at
ClientMark `sm`, up to six across from 1024 (five from 768), the eyebrow-size label at the start, not
centred. On home the wall is PageHero's `foot`: a full-width row a `section` (96) under the split, not
a band of its own. The boxed grid itself (2026-10-07-boxed-logo-grid) stands.
**Why.** "A bit more compact, smaller logos and boxes, but enough space in every box so it still reads
open"; "move logo wall into the hero as a row under the split spanning full width".
**The mistake it prevents.** A logo wall that takes a fold of its own under the hero.
**How to apply.** RecognitionBand / RecognitionGrid; ClientMark's citation step is now `xs`.
