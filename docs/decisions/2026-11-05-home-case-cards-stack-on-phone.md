---
title: "Home's case cards stack on a phone"
date: 2026-11-05
status: active
area: [cards, layout]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-11-04-home-case-cards-swipe-on-phone"]
dbf: []
dbf_status: none
enforced_by: "structure (HomePage SelectedWork)"
---

Below 768 home's selected work stacks, one case card after another, as it does from 768. No swipe row.

**Why.** "Lets just do cards one after another instead of slider because the cards look too slim and tall." In a swipe row each card was one narrow view wide.

**The mistake it prevents.** The 4 Nov swipe row: tall, slim case cards, each one view wide, the rest behind a gesture.

**How to apply.** HomePage `SelectedWork`: the Layout takes no `scroll`.
