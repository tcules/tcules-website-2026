---
title: "Contact's ways to reach us stack on a phone, and the follow links run one per row"
date: 2026-11-05
status: active
area: [cards, layout]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (ContactPage Channels scroll='never'; LinksIsland Cluster stackUntil='md')"
---

On a phone /contact's "Other ways to reach us" tiles stack, one after another (BlockCardSet `scroll="never"`), and the "Follow us on" links (About's and Contact's LinksIsland) stack one per row, centred.

**Why.** "No slider on contact page. Just one card after another"; "4 links in 4 rows instead of 2x2".

**The mistake it prevents.** A swipe row of three short route tiles behind a progress bar; four links wrapping into a two-and-two whose columns did not line up.

**How to apply.** `ContactPage` Channels and `LinksIsland`. Other BlockCardSets keep their phone row until the owner rules on them.
