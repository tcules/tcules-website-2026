---
title: "Island's inset is the band's air in miniature"
date: 2026-10-13
status: superseded
area: [spacing, components]
source: "CLAUDE.md § gap-scale rule 4 (owner, 13 Oct 2026)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: review
legacy: "CLAUDE.md"
---
`Island`'s inset is the band's air in miniature and holds the same exception as `Section`: **96 from 768;
64 block and the 32 gutter inline below it**, in `tokens/components/island.css` and nowhere else.

**Why.** An island is a bounded ground inside a band; its inset is air against its own edge, the same
kind of distance as a band's padding against the screen, so it takes the same per-width exception.

**The mistake it prevents.** An island padded with a gap step chosen by eye at one width, or a second
breakpoint swap written outside the token layer.

**How to apply.** `Island` reads its inset from `--isl-*`/`island.css` only. Copy on an island stays
inside that inset.
