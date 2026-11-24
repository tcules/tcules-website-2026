---
title: A BlockCard image's crop box takes an 8px radius
date: 2026-09-29
status: active
area: [cards, imagery]
source: Owner ruling, 29 Sep 2026, on the case-study index; docs/dbf-ch05-amendments.md item 5b
supersedes: []
dbf: [ch05 §6, ch05 §9, ch05 §12]
dbf_status: applied
enforced_by: review
legacy: dbf-ch05-amendments 5b
---

`BlockCard`'s image crop box takes `--radius-8`, and the image is clipped to it. It is the second
exception to §6's radius 0, beside the SiteNav rail card's `--radius-4`. The card frame, the focus
ring, `Figure`, `PageHero` and the ListCard thumbnail stay at 0.

**Why.** The owner reviewed the case-study index and ruled that the cards read better with softened
media. Like the crop-box hairline it is a property of the card's crop, not of the asset, so no asset
is authored differently.

**The mistake it prevents.** Rounding images generally, or authoring rounded corners into assets.

**How to apply.** The radius lives on the card's media box token, never on `Media`. ch05 §6 still
calls the nav card "the one exception" and §12 row 09 says the same; both need the second exception.
