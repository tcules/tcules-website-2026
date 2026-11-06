---
title: "Three ways to work with us: plan cards, the same band on every page, /how-we-work included"
date: 2026-11-06
status: active
area: [cards, layout, components, type]
source: "Owner (Devagya), 6 Nov 2026, in session: \"how-we-work should also be the same component as on other pages. the title is also just 'Three ways to work with us'\""
supersedes: [2026-11-05-three-ways-are-plan-cards]
dbf: [ch03 §3]
dbf_status: pending
enforced_by: structure (EngagementOptions `plans`, OfferBands `planOptions`)
---
The "Three ways to work with us" band is one band wherever it appears, /how-we-work's `#engagement-shapes`
included: the same title, the same copy, the same plan cards. It is a pricing table without prices:
EngagementOptions `plans`, three equal cards a `gutter` apart, each a hairline card on white with its
name and, a `tight` step under it, one line saying what the plan is for, both over a hairline (no label
line above the name), then its checklist with one shared blue tick on every line, then its own action at
the foot: a full-width blue outline Button at `md`, the same on all three, so no card is featured. Names
drop their article ("Pilot project"). The name is `--text-h4-lg` (26 / 24 / 22, sans). No glyph, no
eyebrow, no "Yours" or "Working hours" terms. The "Not sure which suits you?" line and its links stay the
compact ink island a `section` under the set. The one difference on /how-we-work: its closing line drops
the "See how we work" link, which would point at the page it is on.

**Why.** 6 Nov: "how-we-work should also be the same component as on other pages. the title is also just
'Three ways to work with us'". The plan-card form itself is the 5 Nov ruling, unchanged: "Design this like
a pricing component without literal prices. Drop eyebrows. Description to be replaced by checklist …
drop 'yours' 'working hours'", then "make all the buttons outline blue", "slightly larger titles",
"remove articles from the titles", "go with E" (all icons the same icon).

**The mistake it prevents.** /how-we-work kept its own "Three ways to work with us: our product design
engagement models" with three sentence options and an OctiFi proof line, because the 5 Nov entry said
`#engagement-shapes` "is a different band and keeps its own form". Also the 4 Nov cards (glyph, name, a
sentence each, terms under the set) and mock D, a glyph per checklist line.

**How to apply.** Author the band as bold name with its line after it, bullet list, one link, per option,
then the closing line and its links (`_pages/*` `#how-we-work-together`, and `_pages/how-we-work.md`
`#engagement-shapes`, whose id stays because FAQ links across the site point at it); `planOptions` reads
that shape. A change to the band's copy is made on every page carrying it, /how-we-work included.
