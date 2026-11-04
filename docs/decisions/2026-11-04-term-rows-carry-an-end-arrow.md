---
title: "Glossary term rows carry a quiet end arrow"
date: 2026-11-04
status: proposed
area: [cards, motion]
source: "Devagya, 4 Nov 2026, on /glossary: \"some indication that the glossary items are clickable?\"; picked the quiet end arrow over link-blue terms, a per-row action label and an underlined term"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "review"
---

A glossary term row (the hub's groups, a term page's related terms) carries a small arrow at its inline end, in a quiet grey at rest. On hover and focus it slides along the reading direction and takes the link ink, while the term takes the link ink as every linked row's title does. It is ListCard's opt-in `cue="arrow"`. The 7 Oct 2026 "no arrow cue" holds for every other list, so this narrows it for term rows only.

**Why.** A dictionary of words in ruled rows reads as text at rest: nothing says a row opens a page until a pointer arrives, and on a phone a pointer never arrives.

**The mistake it prevents.** A list of links that looks like a list of facts; or the opposite, 19 blue titles or 19 action labels shouting the same thing.

**How to apply.** ListCard `cue="arrow"` (`--lcrd-cue-ink` on every surface, `--lcrd-cue-shift`); ListingIndex/glossary.tsx `TermGroup`; LongformShell `relatedTerms`. Specimen /design/list-card § 12b.
