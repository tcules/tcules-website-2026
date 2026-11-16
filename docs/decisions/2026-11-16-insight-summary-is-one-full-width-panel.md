---
title: "An insight's summary is one full-width panel at body size"
date: 2026-11-16
status: active
area: [components, type]
source: 'Owner, 16 Nov 2026, reviewing the built article routes on the new-cms preview (/insights/vibe-coded-app-production-ready and two others): the 22px panel "looks bad :/ weird text hierarchy looks off", then "why not full available width?", "why isn''t the text also full width?", "smaller padding as the screen width goes down"'
supersedes: ['2026-11-02-insight-summary-is-a-blue-topped-panel']
dbf: ['ch03 §2']
dbf_status: pending
enforced_by: 'structure (one `summary` Callout per piece in src/app/_insights/resource-page.tsx; --call-summary-inset-* in tokens/components/callout.css)'
---

An article, podcast or event page opens its body with ONE summary panel, Callout `tone="summary"`, never two
boxes. It holds whichever of Strapi's two summary fields exist, in this order: the callout that opens the body
(the "Insights" paragraph), then the key-takeaways list. Its label is the callout's, else the list's. The text is
body size (16) in the surface's full ink. The panel and its text take the article column's full width. Its inset
is 32 on every side from 768, and 24 above and below with 16 at the sides on a phone.

**Why.** The new Strapi sends the summary in two places, and the page stacked them: the takeaways as a 14px grey
note, then the Insights paragraph at 22. Down the page the sizes ran 18, 14, 22, 16, so the newest content was the
quietest and a paragraph repeating the hero lead was the loudest. At body size the paper-deep ground and the blue
rule carry the weight, so the type steps down cleanly from the hero lead. Full width matches the body's edge,
which has no measure.

**The mistake it prevents.** The 2 Nov panel (22px paragraph, as wide as its text, capped at the lead measure)
applied to the new-cms pages, and the takeaways list rendered as a separate unlabelled note above it, on
/insights/vibe-coded-app-production-ready and /insights/design-systems-for-saas-boosting-efficiency-and-ux-consistency.

**How to apply.** `renderResourcePage` merges `resource.takeaways` and an opening callout block into one summary;
later callouts stay notes. `.summary .content` sets `--text-body` with no measure. The inset is
`--call-summary-inset-block` / `-inline`, stepping down below 768 as Island's inset does (CLAUDE.md gap-scale
rule 4). Content keeps the shape Strapi sends; the duplicated sentences on some articles are a Strapi content fix,
not a code one.
