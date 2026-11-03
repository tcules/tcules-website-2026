---
title: "Contact: next steps only in the form's sent state; the other ways to reach us as a row of icon cards"
date: 2026-11-03
status: proposed
area: [layout, forms]
source: "Tracker 2.56 (owner, 3 Nov 2026 review against tcules.com/contact); Claude built the treatment, to be seen on /contact"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (src/templates/CorpusPage/kinds.ts BANDS_ELSEWHERE, read by ContactPage and by kinds:check; ContactPage `channels`)"
---

The owner's instruction (tracker 2.56) is that "What happens after you send" merges into the post-send
state, and the page gains cards for social media, the other ways to reach us and the studio address. The
treatment Claude built for it is proposed here.

`next-steps` is no longer a band on /contact. Its three steps already show, word for word, in the enquiry
form's sent view (2026-10-31-contact-hero-centred-form-below), and the record line it ends on is already
the hero's figures. A band leaves the page only through an entry in `BANDS_ELSEWHERE`, which says where
its words went. `kinds:check` lists those entries and does not fail them, and it fails if a listed band is
still drawn.

Under the hero, a paper band holds five icon cards: BlockCardSet, `across={3}`, no featured card. Each
card is a Solar glyph, then the live page's own heading, then its lines: "General or press inquiries"
(hello@), "For partnerships or vendors" (partners@), "Looking to work with us?" (Careers Page), "Follow us
on" (LinkedIn, YouTube, Instagram, X) and "Ahmedabad, India" (the address the footer prints). The cards
themselves do not link. Each mailbox, profile or page is its own link, so every card in the set behaves
the same way under the pointer. The band has no visible head because the copy authors none, so it is
named "Other ways to reach us" for assistive technology only.

**Why.** Before this change the steps appeared twice, once as a band and once after a send. The live
page's other routes (partnerships, careers, the four profiles, the studio) had nowhere to go.

**The mistake it prevents.** A band dropped from a page silently, by a template that skips it with no
record. Also, a set where one card is a whole link and the next holds four.

**How to apply.** To move a band into another element's state, add it to `BANDS_ELSEWHERE` with where its
words now live. The contact channels are content (`getContactChannels`). The footer and the studio card
share one address record (`STUDIO_ADDRESS`).
