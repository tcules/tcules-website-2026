---
title: "The glossary hub is a listing of terms as a dictionary"
date: 2026-11-04
status: proposed
area: [layout, cards]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages (/glossary; glossary critic: featured terms promoted by list position, a pair left two thirds of a row empty, the phone rail clipped)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "kinds:check (kind `index` → listing-lead, listing-section)"
---

/glossary renders through ListingIndex, the insights listing's structure: the masthead hero, "how to use" as the listing's `lead` (one prose flow beside the rail, not a numbered method), each term group a ListingSection, the structure ask as the listing's ink-island close, the FAQ after it. Terms are peers, set as a dictionary: one term a ruled row (ListCard), the term as its title and its one-line definition beside it, stacking on a phone. No drawings (Devagya, 4 Nov 2026: "the words/phrases are the important pieces; drawings dilute the meaning"). No promoted lead term. A single-view rail collapses on a phone to the section-in-view button, as the term pages' "On this page" bar.

**Why.** Listings share one structure (owner, 16 Oct); a set of peers gets equal weight (service page round 1); rows use the full width.

**The mistake it prevents.** The insights hub's featured-then-list applied to peers; drawn term cards that dilute the definitions; a sideways rail cut mid-word at 390; compact phone cards that dropped every definition.

**How to apply.** templates/ListingIndex/glossary.tsx (`TermGroup`), ListingIndex `lead`, `railLabel`, `note`; IndexRail single-view collapse; plan.ts kind `index`.
