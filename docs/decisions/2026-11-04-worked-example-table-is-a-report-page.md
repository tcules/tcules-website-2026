---
title: "A worked example that carries a table is a page of the report"
date: 2026-11-04
status: proposed
area: [layout, components, content]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (the six audit pages' 'What the report looks like', 3 Nov outline)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "kinds:check (kind `example` renders ReportBand, data-band `report`)"
---

A worked example that carries a table is kind `example`, rendered by ReportBand: the band on tint, one paper page on it holding the example in authored order — its italic label in the mono label voice, the scenario, the sheet (DataTable `appearance="sheet"` for a record), the reading. A status column takes its marks, each mark different by form (StatusMark: Missing the one filled, blue mark; the set sorts without colour). A column whose values a key after the table defines is set in the label voice, and the key is the page's legend under the reading. A trailing case link becomes the band's head action. A worked example told as bold-led story rows stays `record` (CaseSpread).

**Why.** The copy names the band "What the report looks like"; the reader should see a page of it, not a spreadsheet or a case study. Before this five audit pages rendered no band at all and one rendered it as a case.

**The mistake it prevents.** Dropping the worked example; showing a report record as a 50/50 boxed spreadsheet; five statuses drawn as one blue glyph.

**How to apply.** plan.ts (worked-example shape rule), kinds.ts (`example` → `report`), CorpusPage/ReportBand.tsx, StatusMark.tsx, DataTable `appearance="sheet"`.
