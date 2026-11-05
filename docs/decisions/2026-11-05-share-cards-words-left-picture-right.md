---
title: "A share card is the page's words on the left and its own picture on the right"
date: 2026-11-05
status: active
area: [imagery, type, layout]
source: "Owner (Devagya), share-card review on /design/share-cards, 4–5 Nov 2026 (feat/og-images, tracker 6.6)"
supersedes: []
dbf: ["ch10 Part C", "ch05 §6a"]
dbf_status: pending
enforced_by: "structure (src/app/_og/: resolve.ts picks the picture, render.tsx draws the one layout)"
---
Every page's share card (Open Graph and Twitter image) is generated at build from the page itself, in one
layout: one mono eyebrow (the page's kind, "CASE STUDY", "AUTHOR"), the H1 in sans, an action line where
the kind has one, and the wordmark, in a left column; the page's picture in the right half. The picture is,
in order: the page's own hero drawing; else its family hub's drawing (a service's line, /audits,
/expertise, /tools, /future-interfaces-lab); a case's V1 cover (else its Strapi banner); a video's YouTube
thumbnail; an article's or event's Strapi cover; an author's photograph. A page with none sets its title
larger across the full width. No plates, no texture, no words repeated from the title.

Frames, by what the picture is: a drawing sits unboxed on the paper; a person is a square (their photograph,
or their initials on the byline's tint when they have none or theirs is a cut-out on transparency, as
Rakesh's and Rushali's are); a video is 16:9 a little wider than the half; a case cover runs from the
unmoved words' column off the right edge; any other cover is 16:9 across the half. Framed images round at
--radius-24, which reads as the site's 8 at feed size.

**Why.** The owner rejected the type-only cards ("every OG image looks the same"), then plates, the texture
island and repeated text: the picture is the card's interest, and it should be the page's own. Sans because
the card is read at about 500px, where the serif thins. One eyebrow because a second, grey level is noise at
feed size. Covers and thumbnails are not cropped: a crop cut YouTube frames mid-word and cut a V1 cover's
cut-out off.

**The mistake it prevents.** The 4 Nov v1: identical type-only cards on every page; then the second round's
plates and a title repeated inside them; then a near-square crop of 16:9 covers.

**How to apply.** Register a new hero drawing in HERO_ILLUSTRATIONS (src/lib/service-illustrations.ts) and
the page's card carries it; `npm run share:census` lists every page's source. A drawing for a card only
(/contact's) goes in resolve.ts CARD_DRAWINGS. Pages with no picture of their own stay title-only rather
than borrow a photograph or an icon (owner, 5 Nov 2026: How We Work, About, Clients, Matter, legal,
glossary). ch10 Part C and ch05 §6a still say a preview is authored separately from the cover and
thumbnail and never cropped to another ratio; this ruling overrides them for the generated cards.
