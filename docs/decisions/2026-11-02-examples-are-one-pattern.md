---
title: "A claim's example is set apart in the example panel, wherever it appears"
date: 2026-11-02
status: active
area: [proof, layout]
source: "Devagya, 2 Nov 2026, /why-tcules review of the principles band: \"i think we've encountered this pattern before with claims and examples?\"; of the studio band: \"can the example be shaped differently?\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

A paragraph the copy opens with "Example:" is never run on in the argument's words. It is the ClaimProof
panel the hard parts use: the "Example" label, the sentence, and its case link lifted out as the panel's
link. Reasons carry it under each reason's words; a prose band carries it under its text.

**Why.** The composer recognised examples only in hard-parts bands, so the same content shape (a claim, then
its named example) rendered as a panel there and as one undifferentiated paragraph in Reasons and text bands.

**The mistake it prevents.** "Example: **Scissors.** …" read as the fourth sentence of the reason's argument.

**How to apply.** `isExampleParagraph` and `claimExample` (CopyBands); Reasons `example` slot; TextBand
splits example paragraphs out of its body.
