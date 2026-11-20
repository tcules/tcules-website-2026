---
title: "Row and tile rules sit one step quieter"
date: 2026-11-18
status: active
area: [cards, colour]
source: "Owner review, 18 Nov 2026 (MVP stage rows)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "tokens/components/list-card.css"
legacy: ""
---

Every ListCard row and tile rule is one step quieter than it was: neutral-200 on paper and on tint (tint took paper's step, owner 19 Nov 2026: "subtler dividers on paper-deep sections", which also quietens every other tint divider by one step), 800 on ink, brandeis-400 on blue, the step the other ruled ladders (Accordion, ClaimSet, Bento) already use. The thumbnail's hairline is an image edge and keeps its step.

**Why.** Owner on the MVP stage rows: "the rules/lines/dividers can be made subtler in color." A row rule is decoration that separates peers; at neutral-400 on tint it read as a structure line.

**The mistake it prevents.** Raising the rule on one band, or a local colour on the stage rows only, which would leave two rule weights for one kind of divider.

**How to apply.** A ruled list takes `--lcrd-rule-ink`; never set a darker rule locally.
