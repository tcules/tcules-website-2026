# /services — first pass, 2 Nov 2026 (local, not yet reviewed)

The hub routes into the seven service lines and the audits. Composed from the library: OfferPage's plan, no
new components; one new Bento field.

## Decisions
- `service-guide` is the service tiles, not the table (owner, 2 Nov 2026): eight named services, so the
  Bento on four tracks, 4 × 2, each tile its own service's drawing (named-services-are-service-tiles). The
  table's columns are all kept: "Best for" is the tile's body, "What you come away with" a labelled
  detail under it (Bento `detail`, mono label = the header as authored).
- Round 2 (owner, 2 Nov): the closing words are the set's CTA cards, as on the service pages: each linked
  sentence (Product Design in parts, Software Development's sub-services) a dotted statement card, its
  links as arrows, the two sharing the last row 2 + 2. The sentence with no link ("A new AI product often
  brings…") stays under the set (a closing with no link stays below it).
- Hero: centred, the media below (owner, 2 Nov 2026: the long title), `CENTRED_HERO_ROUTES` in
  src/lib/hero-media.ts. The labelled placeholder until hub art is drawn, registered as an illustration
  so it takes the drawing's 860 cap; a photograph under a centred head still takes the whole column.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero centred, placeholder below (860), record figures | illustration to draw (register row) |
| client-recognition | recognition · LogoGrid | |
| service-guide | router · Bento 4 tracks, `detail` per tile, 2 statement CTA cards 2 + 2 | unlinked sentence under the set |
| selected-work | cases · 3-column card grid | |
| testimonials | quotes · one-at-a-time slider + Clutch badge | 4 quotes (< 6) |
| how-we-work-together | options plated + terms row, ink island ask | |
| why-tcules | reasons · isometric illustrations | The Wandering Raven's still to draw |
| industries | 3-column sector photo cards | 4 photos owed |
| enquiry, faq | Island form, FAQ | form before FAQ |

## Open
- Owner review of the guide tiles and the rest of the page.
- Hero art; the second Why Tcules illustration; four sector photos; five client marks with no file.
