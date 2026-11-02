---
title: "An insight's summary is a panel with a blue top, its paragraph set large"
date: 2026-11-02
status: active
area: [components, type]
source: "Owner, 2 Nov 2026, picking direction D on the Insight summary canvas (https://claude.ai/artifact/WyE7jPCfHurxZoCwNcLRcb): \"i like a's hierarchy, but B's box design with the blue highlight\", then \"cool build D\""
supersedes: []
dbf: ["ch03 §2"]
dbf_status: pending
enforced_by: "review"
---

The TL;DR on an article, podcast or event page renders as Callout `tone="summary"`. It is a bounded panel on the
deep ground with a 2px accent rule across its top. Strapi's heading ("Insights") is the mono key, and the paragraph
is set in `--text-summary` (22, phone 18) in the surface's full ink. The content keeps the shape Strapi sends:
one heading and one paragraph, never split or rewritten into parts.

**Why.** The old site showed the summary as a tinted panel with a coloured top rule. The rebuild had reduced it to a
bold line over 14px grey text that read as a footnote. The owner kept the old panel and took the hierarchy from
direction A: a quiet label over a large paragraph.

**The mistake it prevents.** Two things. The plain Callout note under a `<strong>` "Insights" line on every
`/insights` article. And the first round of mocks, which restructured the summary into labelled parts and key
points ("the content is already there and it needs to remain the same shape").

**How to apply.** `TldrSection` maps to a `summary` block with `heading` and `html` in `blog.ts`, `podcast.ts` and
`event.ts`. `--text-summary` is the only paragraph role above 18. It is an exception to
decisions/2026-10-19-body-type-ceiling, which names it. Seen and approved by the owner on the built article route, 2 Nov 2026.
