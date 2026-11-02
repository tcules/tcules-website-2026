---
title: "On an insight page the ask comes before the further reading, which closes on tint"
date: 2026-11-02
status: proposed
area: [layout]
source: "Owner, 2 Nov 2026, reviewing /insights/ux-audit-vs-heuristic-evaluation on feat/insights-summary-panel (\"the CTA block can be above the explore other resources block\", confirmed with Yash; \"the explore other resources card could be tint bg\")"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

On an article, the page's CtaSection sits straight after the article. "Explore other resources" follows it as the
last band before the footer, on the tint surface. Podcast and event pages have no CtaSection, and their resources
band takes the same tint.

**Why.** A reader who finishes the piece meets the ask first; the further reading is for the reader who stays. Yash
(SEO) confirmed the order. On tint, the cards read as a set apart from the article.

**The mistake it prevents.** The resources band on paper between the article and the ask, which put the CTA last,
after three more reasons to leave.

**How to apply.** `InsightResources surface="tint"` on the three insight detail routes. The CtaSection is an island
on a paper band, so no two tints meet. A caller that follows the resources band with a tinted close keeps paper.
