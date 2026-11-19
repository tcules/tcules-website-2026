---
title: "An insight's running words cap at a 68ch reading measure; its blocks keep the whole track"
date: 2026-11-18
status: active
area: [type, layout]
source: "Devagya, 18 Nov 2026, P2 #4 of the article bug report (N21 body ran 941px, ~120 characters a line): picked \"Cap text at ~68ch\" over narrowing the whole column (fix/article-p2)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "ResourceArticle (text items take --measure-reading) + review"
---

In an insight's article column (articles, guides, research, podcasts, events) paragraphs, lists, headings and the
FAQ stop at `--measure-reading`, 68ch. Figures, tables, callouts, the summary box and the author box keep the whole
track beside the contents rail, on the same start edge.

**Why.** At the full 941px track a line ran about 120 characters; comfortable reading is 60–80. `--measure-body`
(75ch, 29 Sep) measured 83–94 characters a line there, because a `ch` is a zero and wider than the average letter
of Public Sans; 68ch measures about 80.

**The mistake it prevents.** The CMS article page rendering `Prose` straight into the 1:4 track: the 27 Aug ruling
removed Prose's own cap and assumed the rail would narrow the column, which it did not.

**How to apply.** `src/templates/ResourceArticle`: a page hands it items marked `text` or `block`. Only article
running text takes `--measure-reading`; captions, callouts and every other body run keep `--measure-body`. If it
is promoted, ch03 (Typography) states the second measure.
