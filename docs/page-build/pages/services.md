# /services — first pass, 2 Nov 2026 (local, not yet reviewed)

The hub routes into the seven service lines and the audits. Composed from the library: OfferPage's plan, no
new components; one new Bento field.

## Decisions
- `service-guide` is the service tiles, not the table (owner, 2 Nov 2026): eight named services, so the
  Bento on four tracks, 4 × 2, each tile its own service's drawing (named-services-are-service-tiles). The
  table's columns are all kept: "Best for" is the tile's body, "What you come away with" a labelled
  detail under it (Bento `detail`, mono label = the header as authored). The three sentences on hiring
  parts of Product Design and Software Development stay under the grid as authored, with their links.
- Hero: the labelled placeholder until hub art is drawn (owner, 2 Nov 2026). The title stays in its
  column (hero-title-stays-in-its-column), so it sets seven lines.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, placeholder, record figures | art to come |
| client-recognition | recognition · LogoGrid | |
| service-guide | router · Bento 4 tracks, `detail` per tile | closing sentences under the grid |
| selected-work | cases · 3-column card grid | |
| testimonials | quotes · one-at-a-time slider + Clutch badge | 4 quotes (< 6) |
| how-we-work-together | options plated + terms row, ink island ask | |
| why-tcules | reasons · isometric illustrations | The Wandering Raven's still to draw |
| industries | 3-column sector photo cards | 4 photos owed |
| enquiry, faq | Island form, FAQ | form before FAQ |

## Open
- Owner review of the guide tiles and the rest of the page.
- Hero art; the second Why Tcules illustration; four sector photos; five client marks with no file.
