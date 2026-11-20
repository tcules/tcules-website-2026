---
title: "The overhaul enquiry island: ink, no drawing, ticks, a name field and a client's quote under the words"
date: 2026-11-18
status: superseded
area: [proof, forms, layout]
source: "Owner (Devagya), 18 Nov 2026, the overhaul pages' enquiry island, taking the form off hold: remove the illustration, add a Name field, ticks for the numbered list, ink ground, a small testimonial at the foot of the left side, copy from Jatin's boards (HowWeWork enquiry section). Branch design/ov4-form."
supersedes: ["2026-10-26-quote-gets-its-own-band"]
dbf: []
dbf_status: none
enforced_by: "structure (CtaSection `quote` exists on the island close only, plain strings; `markers=\"tick\"`; EnquiryForm card dress `name`), review"
---

The enquiry island the overhaul pages close on is an **ink** island with the flow field and **no drawing**; its
points are the plan checklists' **tick** (`check-circle`, the accent) in the body voice; under the words, a
**small client quote** — the 22 serif italic line in the text's ink, marks included, and who said it under it
at body-sm — never the testimonial card, never a rating or portrait; and the card asks **Name** (required,
checked on send only) before **Work email**, the question and the optional **Product website**. The ticks,
fields, quote and reply line are shared; each page keeps its own board heading and lead.

The rest of the 26 Oct ruling stands unchanged: anywhere else a client's quote is never a third column
beside an offer or a line under a set; it takes a band of its own, on tint, after the band it supports,
and an offer band's promises are its only object. The enquiry island is the one place a quote may sit beside
the form, because the owner asked for it there.

**Why.** "Add a small testimonial block at the bottom of the left side" (owner, 18 Nov 2026), following
Jatin's boards, where every enquiry section carries Roland Sailer's line under the ticks.

**The mistake it prevents.** Reading the 26 Oct own-band rule as forbidding the island's quote and
leaving it out; and the opposite, spreading a quote beside other forms or offers, or using the testimonial
card there.

**How to apply.** `CtaSection quote={{ text, cite }}` with `markers="tick"` on the halves island;
`EnquiryForm dress={{ kind: 'card', name: true, emailLabel: 'Work email' }}` with `urlLabel="Product website"`.
In the overhaul fixtures, `enquiry()` in `src/content/sources/overhaul/studio-shared.ts` sets them; the CMS
closes (services master, home) send none of them and keep the numbered points, the drawing and blue.
