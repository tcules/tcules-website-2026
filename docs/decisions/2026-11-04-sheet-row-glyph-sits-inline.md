---
title: "A sheet row's glyph sits inline, before its title"
date: 2026-11-04
status: active
area: [iconography, cards]
source: "Owner, building /clients \"What clients have asked us to do\", 4 Nov 2026 (feat/2-58-clients)"
supersedes: []
dbf: [ch04 Choosing a glyph]
dbf_status: pending
enforced_by: "structure (OfferSheet `arrangement=\"rows\"`, item `icon`; OfferBands SHEET_GLYPHS)"
---

OfferSheet's `rows` arrangement (each title beside its words, a hairline under each row, no blue mark)
may carry one Solar Bold glyph per row, inline before the title on the title's first line, `text` (16)
from it, sized to the title (1em) in the mark ink. The owner asked for the icon "inline instead of
above" and "gap-text between icon and title". Any Solar glyph a set needs may be added
(`magnifier-bug` for "Find out what's wrong before fixing it").

**Why.** A row is not a card: its title already sits beside its body, so a glyph stacked above the
title would make each row three lines tall for no gain and break the left edge the titles share.

**The mistake it prevents.** "Fixing" these rows to the card rule (2026-10-09-icon-heads-its-card),
which still holds for every card: glyph, then title, then body, each on its own row.

**How to apply.** Rows only, never the grid arrangement or a card. The map of title → glyph is
`SHEET_GLYPHS` in `src/templates/CorpusPage/OfferBands.tsx`, keyed by band id; a band with no entry
renders the grid as before.
