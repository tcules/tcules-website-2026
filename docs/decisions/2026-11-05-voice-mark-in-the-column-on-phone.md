---
title: "On a phone a voice's opening quote mark stays inside the column"
date: 2026-11-05
status: active
area: [type]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (VoiceLedger .voice below 768)"
---

VoiceLedger hangs a voice's opening quote mark into the margin from 768; below 768 the mark sets inside the column with the words.

**Why.** "Quote marks going into the padding area" (/expertise/healthtech at 390): at the 16 gutter the hung mark sat past the start of the rule above it.

**The mistake it prevents.** Opening marks in the band's padding on a phone.

**How to apply.** `VoiceLedger.module.css`.
