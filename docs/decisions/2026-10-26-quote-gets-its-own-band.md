---
title: "A client's quote gets its own tint band after the band it supports"
date: 2026-10-26
status: superseded
area: [proof, layout]
source: "Devagya, 26 Oct 2026, product-design service page mock rounds 1–4 (https://claude.ai/artifact/8d5ZWF4hQTMkJ57iZDc4Em), approved to build; branch design/service-page-pd"
supersedes: ["2026-10-11-offer-bands-read-as-an-offer"]
dbf: []
dbf_status: none
enforced_by: "review"
---

A client's quote is never a third column beside an offer or a line under a set: it "reads as noise". It
takes a band of its own, on tint, right after the band it supports. With a portrait it is the featured
testimonial (Proof `featured`), the page's portraits alternating sides; without one, the quote alone,
centred. An offer band ("What you get") is still read as one clear offer: its promises are the band's
only object.

**Why.** "I don't, however, like the quote in the 3rd column." Then, on a closing line under the offer:
"that quote below as a row reads as noise. what about 2 testimonial bands in the page?" And: "you're not
using the right band for testimonials? ideally should be tinted."

**The mistake it prevents.** OfferSheet's testimonial aside on the product-design page, the mock's quote
row under the outcomes, and a quote set on a paper band where it read as one more text band.

**How to apply.** plan.ts emits a `voice` unit after an `outcomes` or `cases` band that ends on a quote;
OfferBands renders it as Proof on tint (tint is the proof band, page-mapping § 1.7). After a case set the
voice links to its client's case. Two tint bands still never touch.
