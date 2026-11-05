# /expertise/commerce-transactional-products · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 865 × 575 (1.50:1). Generator: `gen.mjs`
(`node docs/illustrations/run-2026-11-05/expertise-commerce-transactional-products/gen.mjs`).

Jatin, 30 Oct, on the earlier round: "the concept's title itself is wrong and needs changing." The old title was
about the part. The page is about the product page that lets a buyer order with confidence, so the new title
is **"Checked on the page, straight into the bag"**.

## Candidate ideas (all built around the hub's shopping bag)

1. **Checked on the page, straight into the bag.** A product page lies flat with a technical part standing on it,
   three ticked facts (it fits, it is in stock, it arrives) and one lime add button, and a dashed line takes the
   order from that button straight into the shopping bag.
2. **The bag's tag is the product page.** The shopping bag stands alone and its price tag swings out as a card
   with three ticks on it. There is no screen, but the tag-as-page needs explaining.
3. **The trade reorder.** A buyer's bag refills from a list of past orders on a laptop, for the B2B and repeat-
   ordering lines. That covers two lines of the "designs" list, not the lead.

## The pick: idea 1

It draws the lead literally: "buyers can check fit, stock and delivery on the product page and order without
emailing support first". A visitor names it in three seconds: a shop page, a part, three ticks, a buy button and a
bag. The bag is the hub's object, drawn the way the hub draws it.

How it differs from the siblings (family check, 5 Nov): the earlier rounds laid the product page flat as a blue
tablet, which data also uses, so the product is now an **open laptop**, the only laptop in the family (light body,
white faces, brandeis-200 sides, only the screen dark blue, per STYLE §3). Arrangement: the laptop stands at the
back right with its screen facing front-left, the bag stands on the floor at the left, the buyer between them, and
one dashed arc joins the add button to the bag. No hub-object-left / phone-right (healthtech), no flat tablet
(data), no upright tablet beside the object (proptech), no device beside a turbine (climatetech).

## The drawing

- **Idea:** "They design the product page so a buyer can check the part fits, is in stock and will arrive, then
  order it straight away."
- **Drawn:** healthtech's floor (545 x 402, the dotted plate, the brandeis-50 inset, the dashed edge 1.8 / 10 8).
  An open laptop stands at the back right: a white deck with a key grid and a trackpad, the lid leaning back with
  a white bezel and a dark blue screen showing the product page. On the right of the page, a white picture panel
  holds the part drawn as a plain elevation (a flange with a collar and a dashed bore) and a fit bracket under it
  with the one lime check. On the left, three facts with their own marks on white tiles (a fit bracket, an
  in-stock dot, a delivery van), the price, and a white add button. A buyer (white client pawn, healthtech's size)
  stands on the floor at the laptop's front-left corner, clear of the device, with a short arm from the shoulder
  and the hand on the deck. A dashed line leaves the add button's near end and arcs over into the white shopping
  bag standing on the floor at the left, landing in its mouth behind the front rim, beside a parcel printed with
  the flange's mark. The bag's price tag hangs plumb from the handle.
- **Alt:** Isometric illustration for ecommerce UX design for technical parts. An open laptop stands on a dotted
  floor showing a product page: a machined flange drawn in elevation with a bracket across its width and a lime
  check on it, three facts with their own marks (it fits, it is in stock, it arrives), the price and an add
  button. A buyer stands at the corner of the laptop with a hand on it, and a dashed line arcs from the add button
  down into a white shopping bag beside the laptop, where a parcel printed with the same flange stands ready.

## Construction

All points are projected on the family's 2:1 iso, `(0.9u - 0.9v, 0.45u + 0.45v - z)`, the same as healthtech.
Floor 545 x 402. Laptop base u 196-492, v 18-204, 11 thick (rounded-rect prism, brandeis-200 side, white top),
the key grid and trackpad in a `matrix(0.9 0.45 -0.9 0.45)` group on the deck. The lid is 296 x 214, hinged at
the deck's back edge and leaning back 24 along v; its thickness is the hull of the front and a copy 7 behind, in
brandeis-200, then the white front, then the screen UI in the lid's own matrix
`(0.9 0.45 -0.101 1.05)`. Bag u 48-154, v 252-316, 168 tall; the parcel stands at the back left of the mouth so
the arc lands free of it. The arc is one cubic from the button's near end to a point inside the mouth, cased
white (5.2) under the 1.8 / 7 5 dash, drawn after the bag's mouth and parcel and before its front and side faces,
so the faces hide its end: the order drops into the bag. Buyer: healthtech's pawn (r 22, body 62, head 16), the
arm 11 overall with a 7.8 white core inside a 1.6 blue edge, hand 8.8, masked inside the body so it grows from the
shoulder. Outlines 1.6 on objects, 1.2 on detail. One lime fill (the fit check). Ids prefixed `ctp-`. The
generator takes `LAP`, `BAG`, `BUYER`, `HAND` and `OUT` env overrides for trying placements.

## Rounds

- v1: the tablet flat, the bag at the front right, the buyer far left. 1.97:1, the bag read as a box, the buyer
  floated at the floor's edge, the connector was lost against the button.
- v2: the bag moved behind, a parcel stands in it, the connector routed round the tablet. Too long a route, still
  1.63:1.
- v3–v4: the button moved to the back of the column so one straight line reaches the bag; the buyer in front of
  the page read as standing on the tablet.
- v5: the facts column moved to the left so the bag stands near the floor's back corner and rises above it
  (1.37:1); the height dimension line dropped (it floated at 360px); the buyer moved behind.
- v6–v8: the tick glyphs redrawn (they read as broken corners on the flat page), the buyer moved to the open floor
  at the right of the page, clear of the tablet, with the arm shortened so the hand does not merge with the blue
  edge. Final 1.40:1; checked at 600 and 360.
- v9 (fix pass on the critic and blind reader): the buyer now presses the add button (button moved to the
  right-hand column at the corner nearest the buyer); the button is plain blue and lime marks only the fit check;
  the three identical ticks became three glyph rows (fit bracket, stock dot, van) so the screen no longer copies
  healthtech's tick + lime pill; one tight 1.6 dimension bracket with end ticks under the flange replaces the loose
  1.2 lines; the connector is 1.8 with a longer dash, cased white over the bezel and routed along the floor axes into
  the bag; the parcel carries the flange's mark and stands forward and taller so its back edge clears the bag's back
  rim (no doubled stroke); the tape line is gone; the tag hangs plumb; the price sits a full row below the facts.
  1.36:1; checked at 600 and 360 and at zoom on the bag top, the button and bezel, and the bracket.
- v10 (family check, 5 Nov): the flat tablet was data's arrangement, so the product page moved onto an open
  laptop at the back right (light body, only the screen blue); the floor and the buyer went up to healthtech's
  plate and pawn; the buyer stands clear on the floor at the laptop's front-left corner (no longer over a rim),
  hand on the deck; the bag came out of the back corner to stand on the floor at the left, in the composition,
  and the order now reaches it as one dashed arc from the add button into its mouth. The part on the page is a
  flat elevation (a 3D part on an upright screen would float). 1.50:1; checked at 600 and 360 and at zoom on the
  bag mouth and arc landing, the button start, and the hand on the deck.
