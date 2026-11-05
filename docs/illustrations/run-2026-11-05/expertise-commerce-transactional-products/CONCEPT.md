# /expertise/commerce-transactional-products · hero

Slot: hero beside the copy, paper ground, renders about 600px wide, and the industry's card cover on /expertise
(about 360px). `hero.svg`, viewBox 693 × 509 (1.36:1). Generator: `gen.mjs`
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

How it differs from the siblings: every other expertise hero so far stands its product upright on the right (a
phone in healthtech, fintech and edtech, a wall screen in climatetech, a tablet in proptech). Here the product
lies flat, the way the hub's own app lies flat, and the hub object stands tall at the back. The bag is not a
container the product rises out of (that is healthtech's arrangement).

## The drawing

- **Idea:** "They design the product page so a buyer can check the part fits, is in stock and will arrive, then
  order it straight away."
- **Drawn:** the family's dotted floor with a dashed edge and a soft inset. A solid blue tablet lies flat across
  the front as the product page. On its picture panel (left) stands a machined flange with four bolt holes and a
  collar with a bore; one dimension bracket with end ticks spans its diameter just in front of its base, with a
  lime check badge on it ("it fits"). The right-hand column holds a plain blue add button nearest the buyer, then
  three facts each with its own white glyph on a blue tile (a fit bracket, an in-stock dot, a delivery van) and,
  a full row below, the price. A buyer (white client pawn) stands at the page's right corner with a hand on the add
  button. A dashed line leaves the far end of the button, crosses the bezel (cased in white), drops behind the page
  edge and runs along the floor axes into the side of the white shopping bag standing at the back. In the bag
  stands a parcel with the flange's ring, bore and bolt holes printed on its lid: this part, ordered. The bag's
  price tag hangs plumb from the handle.
- **Alt:** Isometric illustration for ecommerce UX design for technical parts. A product page lies flat on a dotted
  floor as a solid blue tablet: a machined flange stands on its picture with a bracket across its width and a lime
  check on it, and beside it three facts with their own marks (it fits, it is in stock, it arrives) sit under a
  blue add button. A buyer stands at the corner of the page with a hand on that button, and a dashed line runs from
  the button over the page edge and across the floor into a white shopping bag, where a parcel printed with the
  same flange stands ready.

## Construction

All points are projected on the family's 2:1 iso, `(0.9u − 0.9v, 0.45u + 0.45v − z)`, the same as healthtech.
The page UI is drawn in a `matrix(0.9 0.45 -0.9 0.45)` group laid on the tablet; the tag in a
`matrix(0.9 0.45 0 1)` group on the bag's front face. Extruded shapes (the tablet's rounded body, the flange and
collar) are the convex hull of the top and bottom outlines in one side tone, then the top face: no stacked
copies. Outlines 1.6 on objects and the fit bracket, 1.2 on detail. One lime fill (the fit check on the bracket); the add button is plain blue. The buyer is a
client: white body and arm, the arm a 5.3 white core inside a blue edge to 8.5 overall, the healthtech weight.
The connector runs along v from the button's back edge, then along u into the bag's side face at mid depth; its floor run is drawn before the tablet so the slab hides the drop behind the page edge, and the bezel crossing is drawn after, over a 5.2 white casing. Connector 1.8, dash 7 5. Ids are
prefixed `ctp-`.

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
