---
title: "A peer comparison is a keyless table with the page's own column picked"
date: 2026-11-04
status: superseded
area: [components]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (glossary term pages)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

A comparison whose head row is the things compared ("Style guide · Component library · Design system") is a keyless DataTable, every column a peer under its own head. The column naming the page's own term is picked (`pickColumn`): blue ground down its cells, its head in blue, a bar across the head's top edge. It never reorders the columns. On a phone it reads down (`narrow="read-down"`, as 2026-11-04-worksheet-tables-read-down-on-a-phone).

**Why.** The term's column is the table's point; a blank corner cell and a row-label column misread a peer comparison as a record, and at 390 the term's column was the one cut behind the scroll fade.

**The mistake it prevents.** The term's own column clipped at 390; a peer comparison drawn as a keyed record.

**How to apply.** DataTable optional `keyColumn`, `pickColumn` (/design/data-table "Keyless peers; picked column"); LongformShell peer tables.
