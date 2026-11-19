---
title: "Three ways to work with us: priced plans, one highlighted, closing on a quiet line and its link"
date: 2026-11-19
status: active
area: [cards, components, content]
source: "Owner (Devagya), 19 Nov 2026, approving the built band on the live pages (feat/plans-live), from the overhaul boards (17–18 Nov: pricing allowed, the pilot highlighted, the closing line and its link) and the CMS mapping decided that day."
supersedes: [2026-11-06-three-ways-same-on-every-page]
dbf: [ch03 §3]
dbf_status: pending
enforced_by: structure (EngagementOptions `plans`, Strapi mapper in `home.ts`)
---
The "Three ways to work with us" band is still one band on every page that carries it, /how-we-work
included, as EngagementOptions `plans`. Each plan now leads with its price: the plan's name small above it
(the eyebrow voice: mono, capitals in presentation), the price large in the serif (h3) with the
single-stroke dollar, then its line and its checklist. One plan is highlighted (the lightest blue ground
and a brand-blue hairline) and its action is the solid button; the other plans' actions stay outline. The
set closes on one quiet line, a gutter under the cards, with its link at the row's end. There is no ink ask.

**In the CMS.** There is no price field. On a `plans` block the option's `eyebrow` is the plan's name and
its `title` is the price, the whole string as authored ("From $2,500 a month"). An option with no eyebrow
is a plain plan: its title is the name and it shows no price. The highlight is the option's `focused`
boolean. The closing's `heading` is the line and its `actions` are the link; its `body` is not drawn, and
a closing with a `proof` keeps the old close.

**Why.** Pricing is allowed (owner, 17 Nov 2026). The boards set "From $500" large with the name as an
eyebrow over it, highlight the pilot, and close on "A senior product designer leads every option…  How we
work with clients →" (owner, 18 Nov: the link restored). The CMS mapping avoids a schema change before
launch: eyebrow = name, title = price, `focused` added by Mihir.

**The mistake it prevents.** The 6 Nov band said it was "a pricing table without prices", with every
card the same so "no card is featured", and the "Not sure which suits you?" line as a compact ink island.
That ruling is superseded on all three points. Its rest stands: one band on every page, /how-we-work
included.

**How to apply.** `PublishedEngagement` in `src/templates/CorpusPage/PublishedHome.tsx` and the
`ComponentSharedEngagementOptions` mapper in `src/content/sources/strapi/home.ts`. The copy is the same on
every entry (`scripts/cms/plans-copy.mjs`). A copy change is made on all of them.
