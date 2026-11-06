---
title: "/why-tcules' principles take one flat drawing each; the wide band drawing is parked"
date: 2026-11-06
status: proposed
area: [illustration, layout]
source: "Devagya, 6 Nov 2026, CMS review of /why-tcules: \"we'll draw flat graphics for each and use that\"; \"park that wide drawing\""
supersedes: [2026-11-05-why-tcules-principles-one-drawing]
dbf: []
dbf_status: none
enforced_by: "structure (Reasons `scene` per item; offer-scenes.ts '/why-tcules' principles; images.ts BAND_ILLUSTRATION empty)"
---

The `/why-tcules` band "Better product decisions, before you build" goes back to three cards: each principle heads
its words with its own flat drawing, a Sketch scene drawn from that principle's sentence
(`why-principles-evidence`, `-build-first`, `-pays-back` in `components/Sketch/wyg-why-tcules.tsx`). The one wide
drawing of three Tcules–client pairs is **parked**, not deleted (`public/illustrations/why-tcules/principles.svg`),
kept for a later placement such as the page's hero.

**Why.** The owner wanted the three cards back, drawn as "flat graphics for each". The wide drawing was meant for
the hero, not this band.

**The mistake it prevents.** The 5 Nov band figure: one wide drawing over three words-only principles, which
replaced the three cards. Also a set that mixes styles: Reasons draws scenes only when every reason has one.

**How to apply.** Reasons takes `scene` per item (specimens 14d–e on `/design/reasons`); OfferBands passes a scene
when every reason in the band has one, assigned by title in `content/sources/offer-scenes.ts`. On the CMS
(`new-cms`) the reasons' illustration `scene` field carries the same names once that branch reads it; nothing has
changed in the CMS yet. This is a flat exception to the isometric reason figures of
2026-10-30-reasons-take-illustrations, for this band only. Proposed until the owner has seen the drawn band.
