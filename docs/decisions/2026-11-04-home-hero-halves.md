---
title: "The home hero is a 50/50 split"
date: 2026-11-04
status: active
area: [layout]
source: "Owner (Devagya), homepage pass 2.63, 4 Nov 2026 (design/home-pass), reviewed on the built page"
supersedes: []
dbf: []
dbf_status: none
enforced_by: structure (PageHero)
---
The animated-scene hero (home) takes [1, 1] at every split width; it was 2 : 3 from 1440.
**Why.** "50/50 split for hero, FAQs and why tcules sections."
**The mistake it prevents.** The scene outweighing the copy at 1440.
**How to apply.** PageHero, `media.type === 'scene'`.
