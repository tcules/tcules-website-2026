---
title: "Only display, h1–h3 and the quotes from 22 up are serif"
date: 2026-11-05
status: active
area: [type]
source: "Owner (Devagya), responsive pass 1, 5 Nov 2026 (design/responsive-pass1), reviewed on the built pages"
supersedes: ["2026-10-19-only-display-h1-h3-serif"]
dbf: ["ch03 §2"]
dbf_status: pending
enforced_by: "tokens (primitives.css --text-quote-sm)"
---

Display and h1–h3 are serif, and so is every quote role from 22 up: `--text-quote-sm` (22, the compact quote in a narrow track) joins the larger quote roles in Newsreader italic. h4 (sans 22 / 20 / 18), h5 and h6 stay sans, and so do the testimonial cards' 18 and 16 quotes.

**Why.** "Serif font for quote?" on the 22px compact quote; then, of the testimonial cards, "these need to remain sans": the serif is for that quote type "because the font size was 22px".

**The mistake it prevents.** One quote changing its face between a desktop track (serif) and a phone one (sans); the serif spread to the small testimonial card quotes.

**How to apply.** `--text-quote-sm` in `primitives.css`; `testimonial.css` unchanged.
