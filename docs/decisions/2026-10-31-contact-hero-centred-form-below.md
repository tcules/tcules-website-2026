---
title: "Contact: a centred hero that carries the form where an image would sit, and two bands for brief and next steps"
date: 2026-10-31
status: active
area: [layout]
source: "Devagya, 31 Oct 2026, contact page pass (branch design/contact)"
supersedes: []
dbf: []
dbf_status: none
enforced_by: "structure (src/templates/CorpusPage/ContactPage.tsx; /contact is out of HERO_MEDIA_ROUTES in src/lib/hero-media.ts)"
---

"hero -> vertical stack variant, text centered, form right below it." /contact's hero is PageHero's
`centred` arrangement with no media: trail, title, lead and the studio's figures centred on the column.
Then: "move the form into the header, just like how an image would be placed (48px from the stats
row)." The enquiry island is the hero's `panel`, set inside the hero's band a stack (48) under the
figures across the full column (CtaSection `inBand`), and the island's drawing is the first screen's
picture. This
narrows 2026-10-29-high-traffic-heroes-carry-media: /about and the level-1 services keep their hero
media, and /contact does not take any.

`brief` and `next-steps` are two bands, not two peer halves of one: the brief's head sits above its
two-column read-down, and next steps puts its head beside the steps. The confidentiality note is
Callout's `band` tone, with body type in the surface's full ink and the glyph in the accent. It is no
longer a muted footnote under a grey glyph.

The form is the default card that the copy's `conversion` names (email, what you're working on, link).
"If the content suggests to use the default form then we should use that." It is not the chip form.

**Why.** The page exists for the form. A placeholder image beside the hero pushed the form about 950px
down at 1440.

**The mistake it prevents.** A contact hero that holds an image slot, or anything else, between the
title and the form, and a page form different from the one the copy authors.

**How to apply.** Leave /contact out of `HERO_MEDIA_ROUTES`. ContactPage passes the enquiry island to
CorpusHero (`arrangement="centred"`) as its `panel`, and the band loop skips it.
