---
title: "The overhaul enquiry close is an ink band, not an island in a paper band; the quote a block, the ticks ruled, the words head the half"
date: 2026-11-18
status: active
area: [proof, forms, layout]
source: "Owner (Devagya), 18 Nov 2026, the overhaul enquiry island on a phone (a paper band, the ink island inset inside it, the paper form panel inside that): \"form island should become a section so the padding is not applied twice.\" Branch design/ov7-enquiry. Restates design/ov5-enquiry-home's entry with the island part replaced."
supersedes: ["2026-11-18-enquiry-quote-is-a-block"]
dbf: []
dbf_status: none
enforced_by: "structure (CtaSection `frame=\"band\"` on `islandArrangement=\"halves\"` paints the Section in the island's ground and renders no Island; src/templates/CorpusPage/ink-close.ts renders every CMS enquiry close whose island is ink as the band), review"
---

The enquiry close the overhaul pages end on is **an ink band** (`Section surface="ink"`), not an ink island
inside a paper band. The flow field runs across the whole band; the words and the form's **paper panel** sit
straight in Section's column, so the only air is the band's own padding and gutter (96 / 32, and 64 / 16 below
768). This holds **at every width**: the double padding (band, then island inset, then panel inset) exists at
every width, and the island's logged reasons (2026-10-29-forms-only-on-the-island: the copy beside a panel on a
light band read as a weaker ask) are met by an ink band carrying the same field just as well.

Everything else stands as 2026-11-18-enquiry-quote-is-a-block set it: **no drawing**; the words **head the start
half** and the quote takes its foot; a **hairline** under the lead opens the **tick** points at **body-sm**; the
client's line is **a block of its own** (neutral-800 on ink, the 18 sans italic quote with its marks, the **name**
at h6 and **"role, company"** at body-sm on a hairline; no rating, no portrait); stacked (below 1024) head, then the
**form**, then the ticks and the quote; the card asks **Name**, **Work email**, the question and the optional
**Product website**. Anywhere else a client's quote still takes a band of its own (26 Oct).

The band's neighbours on all eight overhaul routes are paper or tint (contact: the hero above, the next-steps tint
below; every other page: a paper or tint band above, the paper FAQ below), so the ink band is never beside the
footer or another dark band, and the island's one-step-off-950 ground (neutral-900) is not needed.

**Why.** Inside a 16-gutter phone band the ink island took its own 32 / 16 and the panel its own inset again: three
nested insets squeezed the form. The band already supplies that air.

**The mistake it prevents.** An island floating in a band whose only job is to frame it; and, the other way,
removing the island and leaving the close as words beside a panel on a light ground (the retired plain split).

**How to apply.** `CtaSection islandArrangement="halves" island="ink" frame="band"` with `markers="tick"` and
`quote={{ text, name, role, company }}`. On the live site (20 Nov 2026) the switch is the CMS close's island:
a close set to **ink** renders as this band through `src/templates/CorpusPage/ink-close.ts` (every template
that renders an enquiry close), its quote a linked testimonial's short quote (tcules-cms-2026#1), its points
and "Product website" label from the CMS. A close left on blue keeps the island
(2026-10-29-forms-only-on-the-island) until its content changes.
