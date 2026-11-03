---
title: "A Statement holds one short line, never a paragraph"
date: 2026-11-04
status: proposed
area: [type, components]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (glossary critic: term pages promoted a 10–13 line paragraph to a 54px Statement and dropped its links)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (`isStatementLine` in CorpusPage/text.ts)"
---

Only a line of sixteen words or fewer with no link becomes a Statement. Anything longer stays prose at body size, its links kept. A glossary term's drawing stands beside its definition in the hero on every term page, so it is in the same place whether or not the page has a Statement; a Statement may carry a decorative `figure` beside it (a `section` apart from 1024).

**Why.** A paragraph at near-title serif is larger than every h2 on the page and breaks the body type ceiling; the Statement takes no inline links, so a promoted paragraph lost them. It narrows 2026-10-07-statement-takes-the-smaller-size, which already treats a Statement as one sentence.

**The mistake it prevents.** /glossary/ux-debt and six other terms opening on a ten-line serif wall; /glossary/agentic-ux losing its two links.

**How to apply.** LongformPage TermPage; Statement `figure` (specimen J · 5b). Case pages' thesis is not gated yet: that needs the owner, as it changes approved case pages.
