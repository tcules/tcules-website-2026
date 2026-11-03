---
title: "Contact: next steps only in the form's sent state; three route tiles, then a short Follow us on island"
date: 2026-11-03
status: proposed
area: [layout, forms]
source: "Tracker 2.56 (owner, 3 Nov 2026 review against tcules.com/contact); first build rejected (owner: social media needs its own row); the owner's own Contact A mock, 3 Nov 2026 (claude.ai/artifact/8WKKYoQVLv8xR2HNaucsUC)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (src/templates/CorpusPage/kinds.ts BANDS_ELSEWHERE, read by ContactPage and by kinds:check; ContactPage `channels` and `follow`; BlockCard `frame=tile`, `ctaEmphasis`)"
---

The owner's instruction (tracker 2.56) is that "What happens after you send" merges into the post-send
state, and the page gains cards for social media, the other ways to reach us and the studio address. The
treatment Claude built for it is proposed here.

`next-steps` is no longer a band on /contact. Its three steps already show, word for word, in the enquiry
form's sent view (2026-10-31-contact-hero-centred-form-below), and the record line it ends on is already
the hero's figures. A band leaves the page only through an entry in `BANDS_ELSEWHERE`, which says where
its words went. `kinds:check` lists those entries and does not fail them, and it fails if a listed band is
still drawn.

Under the form, a band headed "Other ways to reach us" (the owner's heading) holds three tiles:
BlockCardSet `across={3}`, `frame="tile"`, `linkScope="cta"`, `ctaEmphasis="outline"`. Each tile is a
Solar glyph, then the live page's own heading, then ONE labelled outline whose label is the destination
itself: "General or press inquiries" → hello@tcules.com ↗, "For partnerships or vendors" →
partners@tcules.com ↗, "Looking to work with us?" → Careers →. The tile is a filled ground at rest with no
edge and no hover ground; the action, not the tile, answers the pointer. The arrow follows the
destination: ↗ when it leaves the site (a mailbox, another origin), → when it stays.

The social profiles are their own row: About's links island ("Follow the studio…"), shorter, now one
block for both pages (`LinksIsland`). Heading "Follow us on", the four profiles as link Buttons, and the
studio address as one quiet line under them.

**Why.** Before this change the steps appeared twice, once as a band and once after a send. The live
page's other routes (partnerships, careers, the four profiles, the studio) had nowhere to go.

**The mistake it prevents.** A band dropped from a page silently, by a template that skips it with no
record. The first build's five equal cards, where four profiles were squeezed into one card and the
address was a leftover fifth (owner, 3 Nov 2026: "horrible design").

**How to apply.** To move a band into another element's state, add it to `BANDS_ELSEWHERE` with where its
words now live. The routes and the profiles are content (`getContactChannels`, `getContactFollow`).
The footer and the island share one address record (`STUDIO_ADDRESS`). A set of destinations each with
its own action takes `frame="tile"` with `linkScope="cta"`; a page that sends the reader to the studio's
profiles uses `LinksIsland`.
