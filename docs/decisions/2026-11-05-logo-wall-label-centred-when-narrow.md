---
title: "A logo wall's label is centred below 1024 and at the start from 1024"
date: 2026-11-05
status: active
area: [proof, layout]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-11-04-logo-wall-compact"]
dbf: []
dbf_status: none
enforced_by: "structure (LogoGrid align='center-narrow' on the corpus wall)"
---

Every client logo wall is LogoGrid `density="compact"`: 96 cells (72 on a phone), the marks at ClientMark `sm`, up to six across from 1024 (five from 768). Its eyebrow-size label is centred over the wall below 1024 and at the start from 1024 (`align="center-narrow"`). On home the wall is PageHero's `foot`, a full-width row a `section` (96) under the split. The boxed grid (2026-10-07-boxed-logo-grid) stands.

**Why.** "Eyebrow center here" on a phone, then "logo-wall eyebrow should be left on desktop". A start-aligned label over two or three centred marks read as belonging to something else; on desktop the label keeps the page's left edge with every other head.

**The mistake it prevents.** A label at the start over a phone wall of centred marks; a centred label on desktop out of line with the band heads above and below.

**How to apply.** `LogoGrid` `align`; CorpusPage `blocks.tsx` passes `center-narrow`.
