---
title: "The first card is featured from four items, and its media is 16:9 like every card"
date: 2026-10-22
status: active
area: [cards, imagery]
source: "Owner, 22 Oct 2026: Design Hub review doc, finding 1 (\"supersedes. 16:9 everywhere.\")"
supersedes: [2026-09-28-first-card-featured-from-four]
dbf: ["ch05 §9"]
dbf_status: applied
enforced_by: review
---

A card is featured **automatically: the first item, when the set has 4 or more items.** No CMS field. A
featured card is the horizontal arrangement spanning the row, and its media is **16:9**, the same as
every other card: "16:9 everywhere."

**Why.** The 28 Sep ruling gave the horizontal card a 4:3 crop; the 11 Oct ruling made card media 16:9
at every width and placement, so one master serves cards, banners and the Clutch export. Both stayed
active, and the log said two things at once. Featuring is still a property of the set's size; only
the crop changes.

**The mistake it prevents.** A featured card cropped to 4:3 because an older ruling said so, beside
peers at 16:9, and a second master size for one placement.

**How to apply.** `BlockCardSet` gives its first item the featured arrangement when it holds 4 or more;
`BlockCard` never decides it for itself. The featured cover is 16:9 in half the row, as the `/design`
specimen already shows (`2026-10-11-card-media-always-16-9`). ch05 §9 still gives the horizontal
card a 4:3 crop; `/dbf-update 05` corrects it with the rest of that chapter's backlog.
