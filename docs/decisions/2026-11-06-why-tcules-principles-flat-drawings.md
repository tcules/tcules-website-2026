---
title: "/why-tcules' principles take one flat drawing each; the wide band drawing is parked"
date: 2026-11-06
status: proposed
area: [illustration, layout]
source: "Devagya, 6 Nov 2026, CMS review of /why-tcules: \"we'll draw flat graphics for each and use that\"; \"park that wide drawing\""
supersedes: [2026-11-05-why-tcules-principles-one-drawing]
dbf: []
dbf_status: none
enforced_by: "structure (OfferBands draws a reasons band as OfferSheet's drawn grid when every reason has a scene; offer-scenes.ts '/why-tcules' principles; images.ts BAND_ILLUSTRATION empty)"
---

The `/why-tcules` band "Better product decisions, before you build" goes back to three cards: each principle heads
its words with its own flat drawing, a Sketch scene drawn from that principle's sentence
(`why-principles-evidence`, `-build-first`, `-pays-back` in `components/Sketch/wyg-why-tcules.tsx`). The one wide
drawing of three Tcules–client pairs is **parked**, not deleted (`public/illustrations/why-tcules/principles.svg`),
kept for a later placement such as the page's hero.

**Why.** The owner wanted the three cards back, drawn as "flat graphics for each". The wide drawing was meant for
the hero, not this band.

**The mistake it prevents.** The 5 Nov band figure: one wide drawing over three words-only principles, which
replaced the three cards. Also adding a scene slot to Reasons when OfferSheet already draws a plate per item: a
second component for one shape.

**How to apply.** The band renders through OfferSheet's drawn grid (a plate heading each principle, three across,
the "What you get" shape), an approved component of the `reasons` kind (kinds.ts); the scenes are assigned by title
in `content/sources/offer-scenes.ts`. Reasons is unchanged and stays the isometric set. On the CMS (`new-cms`) the
same shape is the Offer Sheet section with a `scene` per card or list item, as home's "How our designers use AI"
already uses; the band would move from a Reasons section to an Offer Sheet section there. Nothing has changed in the
CMS yet. This is a flat exception to the isometric reason figures of 2026-10-30-reasons-take-illustrations, for
this band only. Proposed until the owner has seen the drawn band.
