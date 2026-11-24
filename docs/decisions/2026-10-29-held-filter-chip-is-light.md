---
title: "A held filter chip is light: paper, a light edge, and a quiet 12px cross that darkens on hover"
date: 2026-10-29
status: active
area: [components, iconography]
source: "Devagya, insights finder rounds 28–29 Oct 2026, approved built 29 Oct 2026 (design/insights-filters)"
supersedes: []
dbf: ["ch04 Choosing a glyph"]
dbf_status: applied
enforced_by: "tokens (--tag-filter-*-pressed, --tag-filter-glyph-ink-pressed, --tag-glyph-size in tokens/components/tag.css)"
---

A held filter chip (Tag `variant="filter"` `selected`) keeps the tag's look: the paper ground, a light
hairline edge and the ink label, with no fill. Its remove mark is the plain chrome cross
(`chrome-close`), 12 × 12, a step quieter than the label, taking the label's ink on hover and keyboard
focus. Blue on tint, ink and blue surfaces are declared per surface as every Tag token is.

**Why.** "Filter chips are too heavy with the dark fill. lets keep them light themed." "Not blue chips.
use the same look and feel as a tag? paper bg, but with a slight border and the 'x' for removal." "The
'x' icons are also quite heavy. use the close icon not the close-circle one." "'x' can be made 12x12px."
"Make the 'x' lighter in color." "Missing hover state on the 'x'."

**The mistake it prevents.** The neutral-950 reversed chip (tracker 2.17), then a blue one; the filled
close-circle at 16; a quiet cross that never answered the pointer.

**How to apply.** Tag's filter variant, everywhere a pick is held (the finder's picks; the Tag
specimen). The 16 floor for a glyph with a counter does not bind a plain cross; `--icon-size-12` exists
for it. ch04's meaning table maps "Close, dismiss" to `close-circle`; a pick's remove mark is chrome and
takes `chrome-close` (pending, /dbf-update 04).
