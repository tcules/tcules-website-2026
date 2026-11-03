---
title: "The glossary hub is a listing of equal drawn term cards"
date: 2026-11-04
status: proposed
area: [layout, cards]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (/glossary; glossary critic: featured terms promoted by list position, a pair left two thirds of a row empty, the phone rail clipped)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "kinds:check (kind `index` → listing-lead, listing-section)"
---

/glossary renders through ListingIndex, the insights listing's structure: the masthead hero, "how to use" as the listing's `lead` (one prose flow beside the rail, not a numbered method), each term group a ListingSection, the structure ask as the listing's ink-island close, the FAQ after it. Terms are peers: every term is the same vertical BlockCard carrying its own term drawing, its definition shown at every width, in rows of three re-tracked to two where the count leaves a pair (4 = 2 + 2, 5 = 3 + 2). No horizontal lead, no trailing horizontal filler. A single-view rail collapses on a phone to the section-in-view button, as the term pages' "On this page" bar.

**Why.** Listings share one structure (owner, 16 Oct); a set of peers gets equal weight (service page round 1); rows use the full width.

**The mistake it prevents.** The insights hub's featured-then-list applied to peers; a group of two in three tracks; a sideways rail cut mid-word at 390; compact phone cards that dropped every definition.

**How to apply.** templates/ListingIndex/glossary.tsx (`termRows`), ListingIndex `lead`, `railLabel`, `note`; IndexRail single-view collapse; plan.ts kind `index`.
