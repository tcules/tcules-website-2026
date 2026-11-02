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
- The closing words: the three authored sentences, in order, run on as one paragraph at the body measure
  under the set, links inline (owner, 2 Nov 2026). Tried first: a dotted statement card per linked
  sentence (each repeated its names as mono links, an aside louder than the set); the notes in two
  columns with the AI sentence under them (the third line read as stray). Moving the AI sentence into
  the lead was rejected: the copy's order is fixed.
- Hero: centred, the media below (owner, 2 Nov 2026: the long title), `CENTRED_HERO_ROUTES` in
  src/lib/hero-media.ts. The lede centres on the axis (PageHero's copy stack centres its items under a
  centred head). The labelled placeholder until hub art is drawn, registered as an illustration; under
  a centred head everything but a photograph is capped at 860.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero centred, placeholder below (860), record figures | illustration to draw (register row) |
| client-recognition | recognition · LogoGrid | |
| service-guide | router · Bento split tiles (`detail`) | closing sentences as one paragraph, links inline |
| selected-work | cases · 3-column card grid | |
| testimonials | quotes · one-at-a-time slider + Clutch badge | 4 quotes (< 6) |
| how-we-work-together | options plated + terms row, ink island ask | |
| why-tcules | reasons · isometric illustrations | The Wandering Raven's still to draw |
| industries | 3-column sector photo cards | 4 photos owed |
| enquiry, faq | Island form, FAQ | form before FAQ |

## Content mapping
- `service-guide`: the three closing paragraphs render as one paragraph, words and order unchanged.

## Open
- Owner review of the split tiles and the centred hero.
- Hero art; the second Why Tcules illustration; four sector photos; five client marks with no file.
