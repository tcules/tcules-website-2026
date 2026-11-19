---
title: "Below 768 a hero's tags are one sideways row, and an empty hero slot takes no seam"
date: 2026-11-18
status: active
area: [layout, components]
source: "Devagya, 18 Nov 2026, on the article head (P2 #7 of the article bug report): \"we can remove that extra margin/space that appears after author, published.... line. tags in one scrollable row\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "Cluster scrollUntil=\"md\" in PageHero's labels; PageHero drops an extras row with nothing to render"
---

Below 768 a PageHero's taxonomy tags sit on one row that scrolls sideways rather than wrapping onto two or three
lines; from 768 they wrap. The hero's extras row exists only when something in it renders.

**Why.** On a 390 phone the article's first paragraph started 1,396px down: tags on two rows and an empty row under
the byline came before it.

**The mistake it prevents.** `children == null` treated the article's `[null, null]` (no event block, no byline
text) as content, so an empty `<div>` took a 48px stack seam under the byline on every article.

**How to apply.** `Cluster scrollUntil="md"` (the counterpart of Layout's `scroll="until-md"`, without snapping);
PageHero sets it on its labels, so every hero with tags behaves the same.
