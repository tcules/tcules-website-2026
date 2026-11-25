---
title: "How we work's \"What stays the same\" stays four text tiles, with no drawing or icon"
date: 2026-11-25
status: active
area: [cards, content]
source: "Owner, 25 Nov 2026, verifying tracker O.15 against the live /how-we-work: \"what stays the same should stay text only\"."
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

/how-we-work's "What stays the same" is four text tiles across (OfferSheet grid, as
2026-11-24-how-we-work-takes-the-overhaul set it) and gets no drawing, icon or other added visual.

**Why.** The owner looked at the live band and kept it as built.

**The mistake it prevents.** A later pass treating the band as unfinished under tracker O.15 ("give each
text-only set a shape") and adding drawings or glyphs to it.

**How to apply.** The `work-offer` band in `src/templates/CorpusPage/PublishedWork.tsx` on /how-we-work. Other
text-only sets are judged on their own pages.
