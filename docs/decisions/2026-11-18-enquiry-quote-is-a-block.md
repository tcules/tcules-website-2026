---
title: "The overhaul enquiry island: the quote is a block of its own, the ticks ruled and at body-sm, the words head the half"
date: 2026-11-18
status: active
area: [proof, forms, layout]
source: "Owner (Devagya), 18 Nov 2026, review of the overhaul Home enquiry island: put Roland Sailer's quote 'in a designed block of its own so it actually reads as a testimonial' with the name, position and company split as in the testimonial card; 'what is this blank space above the title?'; 'add a line divider before the three bullets. one size smaller for the three lines of text'; 'keep the form on the paper panel'. Branch design/ov5-enquiry-home."
supersedes: ["2026-11-18-enquiry-island-carries-a-quote"]
dbf: []
dbf_status: none
enforced_by: "structure (CtaSection `quote={{ text, name, role, company }}` renders the block; `markers=\"tick\"` renders the hairline and the body-sm label; `islandArrangement=\"halves\"` with no `art` pins nothing above the words), review"
---

The enquiry island the overhaul pages close on is an **ink** island with the flow field and **no drawing**, the
form on its **paper panel**. Its words **head the start half**: with no drawing nothing is pinned above the
heading, so the form's extra height never opens as empty ink over the title; the quote takes the half's foot.
Under the lead a **hairline** opens the points, which are the plan checklists' **tick** (`check-circle`, the
accent) at **body-sm** (14), one step under the lede. The client's line is **a block of its own**: a quiet panel
one step off the island (neutral-800 on the ink island; paper on a blue one, since blue is never a panel), a
`block` inset and the 8 radius, the testimonial card's 18 sans italic quote in the block's ink with its marks (amended
18 Nov by the owner: "make the quote text sans. serif looks bad in italics at that size"; it was the 22 serif italic), then the speaker as
the testimonial card sets one, on a hairline: the **name** (h6) on its own line and **"role, company"** (body-sm)
under it. Still no rating and no portrait. The card asks **Name** before **Work email**, the question and the
optional **Product website**.

The rest of the 26 Oct ruling stands unchanged: anywhere else a client's quote takes a band of its own, on tint,
after the band it supports. The enquiry island is the one place a quote sits beside the form.

**Why.** The 22 serif line with a one-line attribution read as a stray sentence at the foot of the words, not as a
client speaking; the drawing's pinned slot left a blank band over the heading once the drawing was removed.

**The mistake it prevents.** A quote on the island set as loose text, or its speaker run into one comma line;
or the opposite, the full testimonial card (stars, sans quote, portrait) on the island. And pinning the words to
the half's foot when there is no drawing above them.

**How to apply.** `CtaSection quote={{ text, name, role, company }}` with `markers="tick"` on the halves island;
`EnquiryForm dress={{ kind: 'card', name: true, emailLabel: 'Work email' }}` with `urlLabel="Product website"`.
In the overhaul fixtures, `enquiry()` in `src/content/sources/overhaul/studio-shared.ts` sets them; the CMS
closes send none of them and keep the numbered points, the drawing and blue.
