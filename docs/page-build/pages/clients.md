# /clients — designed, branch feat/2-58-clients (unpushed), 3 Nov 2026

Moved into launch as tracker 2.58 (owner, 2 Nov 2026). Composed from the library through OfferPage's plan, like
/why-tcules and /careers: `ROUTES.clients` joins `PASS_1_COMPOSED_ROUTES`. Every band id was already in
`BAND_KINDS`, so no new kind, component or drawing. Copy: `_pages/clients.md`, rendered as authored.

## Decisions
- Hero: the page binds no image, so it reuses the studio review photograph (`STUDIO_HERO`, `ABOUT_REVIEW`):
  the team presenting work, the nearest of the three studio photos to "what each asked for". The record line
  renders as figures (studio-record-is-figures).
- Client recognition: LogoGrid with real files only (logo-walls-use-real-logos). The four named clients with a
  file lead in the copy's order (Doodle, Eden AI, GT Tools, Knovos); the rest of the approved wall follows.
  No wordmarks, no drawn logos.
- What clients have asked us to do: the `set` kind (offer sheet), 3 × 2, case links inline as authored.
- Client list: stays a table (DataTable, E): it reads across rows, so it is not drawn (l1-drawn-tables). 16 rows
  is past DataTable's designed 12; every row stays visible (no-hidden-cards). Below 768 it scrolls inside its
  frame, as every DataTable does.
- Testimonials: five quotes, so the one-at-a-time slider with an eyebrow head, on tint; every quote rated by
  its person (one-person-one-rating).
- Enquiry before FAQ (formBeforeFaq), on the blue island.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, studio review photo, record figures | |
| client-recognition | recognition · LogoGrid (H) | 4 of 15 named clients have a file |
| product-responsibility | set · offer-sheet | kind still `to-design` |
| client-list | table · DataTable (E) | 16 rows |
| testimonials | quotes · slider (G), stars on every quote | tint |
| returning-clients | text · C-text | ⚠ text-heavy pair (page-mapping §24) |
| case-studies | close → prose (C-text): its link is inline, and an island here would touch the enquiry island | ⚠ |
| enquiry, faq | L, D-faq | |

## Content mapping
- No copy changed. The Clutch line under the testimonials renders as the band authors it.

## Open
- Client marks missing (files needed in `public/clients/`, then `src/lib/client-marks.ts`): Benchmark Gensuite,
  Dealpath, Ringier Media Switzerland, JoVE, Primelis, Auxentios, ConnectX, BuildTwin, Novus Insights,
  Scissors, Gold Image Printing. Eden AI is still a PNG (ch05 §10 wants SVG).
- The wall also shows approved marks the copy does not name here (Omny, LatitudePay, Quoter, SafeXpay, Pledge,
  Incluude), as RecognitionBand does on every page. Owner: keep, or show only the clients this page names?
- `returning-clients` and `case-studies` are two short prose bands in a row. Options for the owner: case cards
  under "Case studies behind the client names" (the cases the client list links), or accept as is.
- `set` (What clients have asked us to do) uses the blue-marker ruled cell, which treatment rules § 2 keeps for
  figures; the kind is still to design site-wide.
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.
