---
title: An underlined phrase from the CMS renders; in a plan it is a solid blue underline under ink words
date: 2026-11-19
status: active
area: [type, content, components]
source: "Owner (Devagya), 19 Nov 2026, on the built directions at /design/engagement-options (feat/plans-live): \"why not just a blue underline?\", then \"E is approved\". The ask is Jatin's, 19 Nov 2026 call: highlight \"free one-day review\" in the pilot plan."
supersedes: []
dbf: [ch03 §2]
dbf_status: pending
enforced_by: review
---
An editor's underline in Strapi (`<u>…</u>`) renders as an underline on the site. In a plan card it reads
as the highlight: the words keep the card's own ink and weight, and under them runs one solid line in the
full accent (brandeis-500 on paper and tint, the icon blue on ink and blue), 0.12em thick, 0.2em below,
unbroken by descenders. Anywhere else it is a quiet underline in the text's own ink.

**Why.** Jatin asked for "free one-day review" to stand out on the pilot plan. A link on this site is the
coloured word, so a blue line under words left in their ink cannot pass for one. The owner looked at five
built directions and chose this one: "why not just a blue underline?", "E is approved".

**The mistake it prevents.** The Strapi Markdown renderer escaped the tag, so `<u>free one-day review</u>`
printed literally. Then a soft, low brandeis-200 marker band was rejected as "not at all visible and
horribly designed". The other built directions were also rejected: a highlighter swipe, an inline tag, accent-coloured words and a promoted
lead row.

**How to apply.** `src/content/sources/strapi/markdown.ts` lets exactly a balanced, lowercase `<u>`/`</u>`
pair back through after escaping (inline and block renderers); nothing else is unescaped. The base floor
is `:where(u)` in `globals.css`. The plan treatment is `.planBody u, .planItem u` in EngagementOptions,
from `--eop-underline-*` in `tokens/components/engagement-options.css`, declared per surface. A component
that wants an underline to read as emphasis states it the same way, from its own tokens.
