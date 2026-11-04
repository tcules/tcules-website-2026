---
title: "A worksheet table reads down on a phone (DataTable narrow=\"read-down\")"
date: 2026-11-04
status: proposed
area: [components, layout]
source: "Proposed by the tools run, 4 Nov 2026 (tools critic: the worksheet tables unreadable at 390), citing ReportBand's report sheet ('below 768 the sheet reads down, each row's key its title')"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

A table a reader WORKS through rather than compares at a glance (a free tool's worksheet, the /tools compare table naming the tools) takes DataTable `narrow="read-down"`: below 768 each row is one block in the same box, the key as its title and each value under its column head in the mono label voice; from 768 the boxed table, unchanged. Every other table keeps the default `scroll`. This NARROWS the 7 Oct boxed-table doctrine in DataTable.tsx ("the body is never re-laid out as a stack") for worksheets only; the box itself is kept at every width.

**Why.** At 390 the tools' key column took about 60% of a 326 track, answer cells wrapped two or three words a line and the remaining columns sat off-screen behind a fade; in the worked example's panel only about 70px of the second column showed. The audits' report sheet had already solved the same job by reading down below 768, as a one-off in ReportBand.

**The mistake it prevents.** A phone reader scrolling a clipped grid sideways to fill in a worksheet, and each template solving it again by hand beside a DataTable.

**How to apply.** Pass `narrow="read-down"` where the table is a worksheet or a directory of tools (LongformShell CorpusTable for tool pages, `withToolKeyLinks` tables in CopyBands). A comparison read across rows keeps `scroll`. ReportBand's hand-built sheet list can move onto this prop.
