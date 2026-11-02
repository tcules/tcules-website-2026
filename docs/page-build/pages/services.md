# /services — design pass, 2 Nov 2026 (local, in review)

The hub routes into the seven service lines and the audits. Composed from the library: OfferPage's plan,
one new arrangement of DrawnTableBand (`chooser`).

## Decisions
- `service-guide` is split service tiles (owner, 2 Nov 2026, mock A in
  https://claude.ai/artifact/25yNDHrZAHjDK63ySf7Lcu): eight tiles, two a row on four tracks, each two
  halves. Named half: the service's drawing, then its name and "Best for". Result half: an inset panel
  with "What you come away with" (the header as authored) over its cell, and "Explore the service" at its
  foot. The whole tile is the link. Bento `detail` makes the split; every column of the table is kept.
  Round 2 (owner): the panels fill the tile's height, so a row's panels end on one line (`equalRows`);
  the split tile carries no texture: the panel is already the card's second surface, and New Product
  Design's hatched drawing shimmered against the pixel grid (a halo behind the drawing was tried first).
- Tried and set aside the same day: four-across tiles with the detail stacked in (fields could not stay
  in line, the label out-shouted the words); a drawn chooser list (the owner disliked the sub-service
  sentences as footnotes under rows); mock B, the hairline split with the result as a headline.
- The closing words: each linked sentence is a dotted statement CTA card (Product Design in parts,
  Software Development's sub-services), the two sharing the row after the tiles 2 + 2; the sentence with
  no link ("A new AI product often brings…") stays under the set.
- Hero: centred, the media below (owner, 2 Nov 2026: the long title), `CENTRED_HERO_ROUTES` in
  src/lib/hero-media.ts. The lede centres on the axis (PageHero's copy stack centres its items under a
  centred head). The labelled placeholder until hub art is drawn, registered as an illustration; under
  a centred head everything but a photograph is capped at 860.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero centred, placeholder below (860), record figures | illustration to draw (register row) |
| client-recognition | recognition · LogoGrid | |
| service-guide | router · Bento split tiles (`detail`), 2 statement CTA cards 2 + 2 | unlinked sentence under the set |
| selected-work | cases · 3-column card grid | |
| testimonials | quotes · one-at-a-time slider + Clutch badge | 4 quotes (< 6) |
| how-we-work-together | options plated + terms row, ink island ask | |
| why-tcules | reasons · isometric illustrations | The Wandering Raven's still to draw |
| industries | 3-column sector photo cards | 4 photos owed |
| enquiry, faq | Island form, FAQ | form before FAQ |

## Open
- Owner review of the split tiles and the centred hero.
- Hero art; the second Why Tcules illustration; four sector photos; five client marks with no file.
