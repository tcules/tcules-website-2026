---
title: "A split tile's result panel stands on the band's ground behind one hairline"
date: 2026-11-04
status: proposed
area: [cards, components]
source: "Proposed by the audits, tools and glossary run, 4 Nov 2026 (branch design/audits-tools-glossary), for Devagya to judge on the built pages; the split tile itself is the owner's 2 Nov /services mock A ('the new pattern we made for services hub')"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "tokens:check (--bnt-rule-* declared on every surface); review"
---

A Bento tile with a `detail` is a split tile, two tracks wide: drawing, title and body in the named half, the result panel (its label, its text, its action at the foot) in the other. The panel has no ground and no radius: it stands on the band's own ground behind the tile's own hairline (`--bnt-rule-width` in `--bnt-rule-ink`, turning `--bnt-rule-ink-hover` with the frame) on its inline-start edge, the words 24 either side of the rule. Below 768 the halves stack and the rule moves to the panel's top edge.

**Why.** A filled, rounded panel inside a hairline frame is a box in a box, and the panel's ground existed only to separate the halves, which one rule does. No new token: the rule reuses the tile's hairline (a token that only renames another is the `--sec-gap` mistake).

**The mistake it prevents.** The 2 Nov split tile's tinted, rounded result panel on /services, the expertise pages and the audits; an inner rule left grey when the frame turns blue on hover.

**How to apply.** Bento `detail` (src/patterns/Bento), tokens in tokens/components/bento.css; specimen /design/bento (split tiles on all four grounds). `--bnt-panel-radius` and `--bnt-panel-ground` are deleted.
