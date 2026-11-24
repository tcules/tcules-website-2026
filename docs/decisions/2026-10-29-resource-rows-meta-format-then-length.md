---
title: "A resource row's meta: glyph and format on one line, the length under it; the meta line 16 over the title"
date: 2026-10-29
status: active
area: [iconography, cards, layout]
source: "Owner review, 29 Oct 2026 (feat/new-copy, home \"Selected thinking from the studio\")"
supersedes: [2026-10-29-resource-rows-carry-format-icons]
dbf: [ch04 Choosing a glyph]
dbf_status: applied
enforced_by: "structure (Teaser `metaAside` meta column and copy stack; TEASER_FORMAT_ICON in src/patterns/Teaser/Teaser.tsx)"
---

A resource row (Teaser `row` with `metaAside` and `ruled`, home's "Selected thinking") carries its
format's glyph, set INLINE before the format label on ONE line, glyph to label `tight` (8). The reading
time sits under that line a `text` (16) down: a second fact about the piece, not the format's unit, so it
reads as its own line. "No stacked glyph-above-label." Where the meta reads as the row's eyebrow line
over the title (below 768), it sits a `text` (16) over the title, "not 8"; the title and its summary stay
a `tight` pair. Kept from 2026-10-29-resource-rows-carry-format-icons: one glyph per format, the format
menu's set of 23 Oct (Article `document-text`, Guide `notebook`, Research `graph-up`, Interview
`chat-round-dots`, Podcast `microphone`, Video `videocamera-record`, Event `calendar`), in the accent,
aria-hidden, never without its format word.

**Why.** The owner asked to "clean up" the meta column: the glyph stacked above the label with the length
4 under it read as three loose pieces; and at 8 the eyebrow line crowded the title.

**The mistake it prevents.** The glyph heading the meta column on its own line above the format; the
length a 4 (`inline`) under the format; the meta line `tight` over the title in a ledger row. A second,
divergent glyph map for formats.

**How to apply.** `src/patterns/Teaser/` (the `metaAside` meta column: a Cluster of glyph and first fact,
then the rest a `text` under it; the ledger row's copy: meta line, then title and body at `tight`, a
`text` apart). Other Teasers keep their meta a `tight` line in the copy's stack. Specimen: /design/teaser
"row · lg · metaAside + ruled + arrow + icon". Chapter 04's fixed glyph choices do not list the formats
yet: pending.
