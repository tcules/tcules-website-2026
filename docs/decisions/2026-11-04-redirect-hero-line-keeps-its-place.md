---
title: "A hero line redirecting the wrong reader keeps its place after the ask"
date: 2026-11-04
status: proposed
area: [content, components]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (the six audit heroes)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "kinds:check (copy reaches the page)"
---

A hero proof line that sends the wrong reader elsewhere ("Already live with customers? See the UX & Product Audit.") renders after the ask in the proof-line voice, through PageHero `actionsNote`. It is never suppressed with the "Selected work" line.

**Why.** All six audit pages dropped it, and it is the line that stops a reader buying the wrong audit.

**The mistake it prevents.** CorpusHero rendering only the first proof line and silently dropping the rest.

**How to apply.** CorpusPage/blocks.tsx CorpusHero; PageHero `actionsNote` (specimen 5c).
