---
title: "Rows beside a drawing: the heading sits over the rows, beside the drawing"
date: 2026-11-24
status: active
area: [components]
source: "Owner, 24 Nov 2026, on MVP Development's \"Your demo works\" band: \"i think this looks odd since the title is constrained to the left half. i think we can move it back into the right split.\""
supersedes: []
dbf: []
dbf_status: none
enforced_by: "PublishedHome's drawing-rows band (no headAbove, figureFirst); ContentSection's figureFirst now places a drawing as it does a photograph"
---

A band of rows beside a drawing (MVP Development's "Your demo works. Launch needs what sits underneath."
and "Your prototype is the brief we build from") puts its heading in the rows' column, over the rows,
with the drawing in the other half sharing the heading's top edge. This replaces the 19 Nov round's
heading over the whole band, where a heading kept to its reading width sat over the drawing's half only.

Below 1024 the order stays head, drawing, rows: `figureFirst` places the drawing under the head, as it
already did for a photograph, so the drawing never falls after the band's button.

**How to apply.** A band of rows (or words) beside one drawing takes the plain media split with the head
in the words' column; reach for `headAbove` only for a photograph band whose head must span both halves.
Pass `figureFirst` when the drawing explains the rows, so a phone reads head, drawing, rows.
