# /expertise/commerce-transactional-products · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 865 × 578 (1.50:1). Generator: `gen.mjs`
(`node docs/illustrations/run-2026-11-05/expertise-commerce-transactional-products/gen.mjs`).

Jatin, 30 Oct, on the earlier round: "the concept's title itself is wrong and needs changing." The old title was
about the part. The page is about the product page that lets a buyer order with confidence, so the new title
is **"Checked on the page, straight into the bag"**.

## Candidate ideas (all built around the hub's shopping bag)

1. **Checked on the page, straight into the bag.** A product page (now on a phone lying flat) shows a technical
   part with its fit checked in lime, three facts (it fits, it is in stock, it arrives) and an add button, and a
   dashed line takes the order from that button straight into the open shopping bag.
2. **The bag's tag is the product page.** The shopping bag stands alone and its price tag swings out as a card
   with three ticks on it. There is no screen, but the tag-as-page needs explaining.
3. **The trade reorder.** A buyer's bag refills from a list of past orders on a laptop, for the B2B and repeat-
   ordering lines. That covers two lines of the "designs" list, not the lead.

## The pick: idea 1

It draws the lead literally: "buyers can check fit, stock and delivery on the product page and order without
emailing support first". A visitor names it in three seconds: a shop page, a part, three ticks, a buy button and a
bag. The bag is the hub's object, drawn the way the hub draws it.

How it differs from the siblings (pair check, 5 Nov): v10 put the product page on an open laptop with the bag
left and the buyer between, which is data's arrangement (object left, open laptop right, client between). Data
keeps the laptop. Here **the bag leads**: it is the tallest, largest thing in the picture, standing open at the
back right, and the product page is a **solid blue phone lying flat on the floor** in front of it (STYLE §3: a
phone may stay solid blue). No other sibling lays a phone flat: healthtech's phone rises out of its case, fintech's
stands on the card, edtech's stands beside the books, proptech's tablet stands on a stand. No laptop (data,
marketplaces), no screen beside an upright object at the same height.

## The drawing

- **Idea:** "They design the product page so a buyer can check the part fits, is in stock and will arrive, then
  order it straight away."
- **Drawn:** healthtech's floor (545 x 402, the dotted plate, the brandeis-50 inset, the dashed edge 1.8 / 10 8).
  A tall white shopping bag (160 x 96, 276 high, brandeis-200 side with the gusset's centre crease, a folded hem
  line, two blue handles) stands open at the back right: looking into its mouth you see the inside of the back
  wall (brandeis-50) and of the left wall (brandeis-100) over a brandeis-200 depth, so it reads as an open bag
  and not a lidded box. Its blue price tag hangs plumb from the front handle. In front of it, on the left, a solid
  blue phone (160 x 290, 10 thick, brandeis-600 side) lies flat with its top at the back left and its button end
  toward the front right. Its white screen shows the product page: a picture panel holding the flange in
  elevation (collar, dashed bore) with the fit bracket and the one lime check under it, three facts with their own
  marks on small blue tiles (a fit bracket, an in-stock dot, a delivery van) and a solid blue add pill. The buyer
  (white client pawn, healthtech's size) stands on the open floor just past the phone's button end, clear of the
  screen, and presses the add pill with a short arm from the shoulder. From that press a dashed line rises, arcs
  away from the buyer's head and over the bag's near rim, and drops into the open mouth behind the front handle.
- **Alt:** Isometric illustration for ecommerce UX design for technical parts. A tall white shopping bag stands
  open on a dotted floor, its price tag hanging from the handle. In front of it a blue phone lies flat showing a
  product page: a machined flange with a bracket across its width and a lime check on it, three facts with their
  own marks (it fits, it is in stock, it arrives) and an add button. A buyer stands at the end of the phone
  pressing the button, and a dashed line arcs from that press up and over into the open bag.

## Construction

All points are projected on the family's 2:1 iso, `(0.9u - 0.9v, 0.45u + 0.45v - z)`, the same as healthtech.
Floor 545 x 402. Phone u 50-340, v 170-330, 10 thick (rounded-rect prism r 24, brandeis-600 side, blue top); its
screen UI is drawn in local units in the matrix `(0.9 -0.45 0.9 0.45)` from the corner (u 50, v 330), so screen x
runs along -v and screen y along +u. Bag u 310-470, v 30-126, 276 high: the mouth is filled brandeis-200, the
inner back and left walls (70 deep) are clipped to it (`ctp-mouth`), then the back handle, then the route, then
the front and side faces, the crease, the hem and the front handle, so the faces hide the route's end and it
drops into the bag. The route is one cubic from the press point to a point 30 below the rim inside the mouth,
cased white (5.2) under the 1.8 / 7 5 dash. Buyer: healthtech's pawn (r 22, body 62, head 16) at (396, 262), the
arm 11 overall with a 7.8 white core inside a 1.6 blue edge, hand 8.8, masked inside the body so it grows from
the shoulder; the hand is placed on the route's start, so the order visibly begins where the buyer presses.
Outlines 1.6 on objects, 1.2 on detail. One lime fill (the fit check). Ids prefixed `ctp-`. viewBox 865 x 578
(1.50:1), the same width and floor scale as healthtech. The generator takes `PHONE`, `BAG`, `BUYER`, `PRESS`,
`ARC` and `OUT` env overrides for trying placements; v10's generator and SVG are kept in `old/`.

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
- v11 (pair check, 5 Nov): the laptop went, because "object left, open laptop right, client between" is data's
  arrangement and data keeps the laptop. The bag now leads: taller (276), open at the back right, with its inside
  walls drawn so it no longer reads as a lidded box, and the parcel that rested on top of it is gone (it read as
  an odd box on the bag). The product page moved onto a solid blue phone lying flat, the only flat phone in the
  family; the buyer stands past its button end and presses the add pill, and the route starts at the press and
  arcs clear of the buyer's head into the mouth. 1.50:1; checked at 600 and 360 beside healthtech at 360 (same
  floor, same scale) and at zoom on the bag mouth and the route's landing, and the hand on the button.
