---
title: "A glossary term page is words only: no drawings, its close reads on in the column"
date: 2026-11-04
status: proposed
area: [layout, cards]
source: "Devagya, 4 Nov 2026, on the built term pages: \"the words/phrases are the important pieces; drawings dilute the meaning; needs to be a simpler design\" (replaces the run's drawn proposal the same day)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

A term page carries no drawings. The hero is the term and its definition, with no drawing and no texture field. Related terms are the hub's term rows: ruled, one term a row, the term then its words. The close is the last section of the reading column: its sentences with their inline links, and the link it ends on as the onward link row. It is not a tile and not an island, so every term ends the same way whatever the close's length. A lone link line inside a term page renders in place as a link row and is never dropped.

**Why.** On a glossary page the words are the content; a drawing beside a definition competes with it and dilutes the meaning. The close's length varies from one sentence to three paragraphs, and only the reading column takes every length in one shape.

**The mistake it prevents.** A drawn hero, drawn related-term cards and a wide destination tile, all illustrating words that were already exact; a per-page choice of close shape.

**How to apply.** LongformPage TermPage (no hero media; the close stays in the shell); LongformShell `relatedTerms` (ListCard rows); text.ts `labelWithoutArrow`.
