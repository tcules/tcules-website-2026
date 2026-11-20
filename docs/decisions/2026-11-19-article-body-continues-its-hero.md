---
title: "An article's body continues its hero: one padding between them, not two"
date: 2026-11-19
status: active
area: [layout]
source: 'Owner (Devagya) and Jatin, call 19 Nov 2026: "the first section has a bottom padding and then the section after that also has a padding … for article pages I can deduplicate this padding"'
supersedes: []
dbf: []
dbf_status: none
enforced_by: "Section `continues` (--sec-padding-y-continued), set by ResourceArticle"
---

On an insight page (article, guide, research, podcast, event) the body band under the hero takes no air
above its content: the seam between the hero and the first paragraph is the hero's foot alone, 96 (64 on a
phone), not 96 + 96.

**Why.** The hero and the article are one reading on one paper; the doubled seam read as a void before the
first paragraph.

**The mistake it prevents.** A margin or a negative offset on the article to close the gap, or widening the
change to every same-surface pair: everywhere else two bands keep both paddings (30 Sep 2026).

**How to apply.** Section `continues` on the band, read from `--sec-padding-y-continued`; ResourceArticle
sets it. Nothing else does unless the owner rules it.
