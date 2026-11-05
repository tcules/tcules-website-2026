---
title: "A table on a phone is the table, scrolling sideways"
date: 2026-11-05
status: active
area: [components, layout]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-11-04-worksheet-tables-read-down-on-a-phone", "2026-11-04-comparison-picks-its-term"]
dbf: []
dbf_status: none
enforced_by: "structure (LongformShell and OfferBands pass no narrow)"
---

Every table renders as the boxed table at every width and scrolls sideways when its columns outrun the track (DataTable's default `scroll`). No table reads down on a phone. A peer comparison is still a keyless DataTable with the page's own term's column picked (`pickColumn`: blue ground, blue head, a bar across its top), never reordered.

**Why.** "Simple table with scroll instead of this?" on the glossary term's comparison at 390, which read down as stacked label pairs.

**The mistake it prevents.** The 4 Nov read-down view on glossary terms, tools and in-panel tables: a comparison turned into a column of mono labels and values that no longer read as one table.

**How to apply.** LongformShell's CorpusTable and OfferBands' tool table pass no `narrow`. The `read-down` mode stays in DataTable and its specimen, unused by the site.
