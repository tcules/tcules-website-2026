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
- What clients have asked us to do: the offer sheet in its `rows` arrangement (owner, 4 Nov 2026: the client
  picked direction "Asked A", index rows, without its client-marks column). Each item is one row, its title
  in the left half and its words in the right from 1024, a hairline under each row (ListCard's row frame,
  no blue mark), each title led inline by a
  Solar Bold glyph 16 (`text`) before it (owner, 4 Nov 2026): ruler-pen, refresh-square, stars, code-square,
  users-group-rounded, magnifier-bug (added to the set for this band). The solid forms, so the set is one weight.
  The icon-heads-its-card ruling is about cards; these are rows. Case links inline as
  authored. Opted in per band (`SHEET_ROWS`, OfferBands.tsx), so other sheets keep the grid.
- Client list: stays a table (DataTable, E): it reads across rows, so it is not drawn (l1-drawn-tables). 16 rows
  is past DataTable's designed 12; every row stays visible (no-hidden-cards). Below 768 it scrolls inside its
  frame, as every DataTable does.
- Testimonials: five quotes, so the one-at-a-time slider with an eyebrow head, on tint; every quote rated by
  its person (one-person-one-rating). The band's closing line, "**4.8 on Clutch.** [Read the reviews](…)",
  is the band's RatingBadge footer under the slider (rating-is-always-the-badge), linking the copy's
  saas-product-design-studio profile.
- Enquiry before FAQ (formBeforeFaq), on the blue island.

## Fixed after the critic (3 Nov 2026)
- **The Clutch line was dropped.** Cause: the copy closes the claim's bold on its full stop ("**4.8 on
  Clutch.**"), and the body parser reads a bold run ending in `.` as a `labelled` block, not a paragraph.
  `ratingOf` only read paragraphs, so QuoteGroupBand found no score and rendered no footer, and no other
  renderer took the block. Fix at the band: `ratingOf` reads a labelled line as the same score line
  (`scoreRuns`, blocks.tsx), and QuoteGroupBand and RecognitionBand look for the score in any block. The copy
  is unchanged. Every page whose score line ends its bold on a full stop gets its badge back the same way.
- **Why kinds:check missed it.** It sampled a labelled block's body only ("Read the reviews", three words),
  and a sample needs six. It now samples the label and body as one line, so a dropped score line fails.
- The earlier note in page-mapping §24 accepting the text-heavy pair is withdrawn: an active ruling
  (2026-10-07-no-two-text-heavy-bands-in-a-row) is not accepted by a builder. The pairs are open questions
  below.

## Band → component
| Band | Kind / component | Notes |
|---|---|---|
| hero | CorpusHero beside, studio review photo, record figures | |
| client-recognition | recognition · LogoGrid (H) | 4 of 15 named clients have a file |
| product-responsibility | set · offer-sheet, `rows` | kind still `to-design`; ⚠ text-heavy pair with client-list (Q2) |
| client-list | table · DataTable (E) | 16 rows |
| testimonials | quotes · slider (G), stars on every quote, RatingBadge footer | tint |
| returning-clients | text · C-text | followed by the case covers, so no text-heavy pair |
| case-studies | close · case grid (M), link centred under it | Doodle, Benchmark Gensuite, Eden AI (CLOSE_CASES) |
| enquiry, faq | L, D-faq | |

## Content mapping
- No copy changed. The Clutch line under the testimonials renders as the band's RatingBadge.

## Answered 4 Nov 2026 (owner)
- **Q1 and Q3 → (a).** "Case studies behind the client names" is the 3-column case card grid: Doodle, Benchmark
  Gensuite and Eden AI (OfferBands `CLOSE_CASES`, by the routes.ts client name; the copy names none). The
  paragraph is the lead without its link; "Browse the case studies" is the band's one action, the in-band link
  control (CtaRow), centred under the cards by a Cluster while the head stays at the start. The `close` kind
  registers M for it (kinds.ts). The covers break the text-heavy pair with returning-clients, and no island
  touches the enquiry island.

## Open — BLOCKING (owner)
- **Q1 · BLOCKING. `returning-clients` → `case-studies` are two text-heavy bands touching**, against the active
  ruling 2026-10-07-no-two-text-heavy-bands-in-a-row and treatment rules § 2. Both are one paragraph on paper
  between the quote slider and the enquiry island. Options with existing parts:
  (a) the 3-column case card grid under "Case studies behind the client names" (treatment rules § 1, "A case
  study … elsewhere: the 3-column card grid"), showing cases the client list already links: existing case
  data, no new copy, but cards the band does not author, so the owner picks which and how many;
  (b) client marks on `returning-clients` (Primelis, Benchmark Gensuite, Omny): only Omny has a file today;
  (c) another treatment. Not fixed on this branch.
- **Q2 · BLOCKING. `product-responsibility` → `client-list` are two text-heavy bands touching**: the text-only
  offer sheet (six titled cells, no drawings) directly above the 16-row table. Options: (a) a flat drawing per
  cell, drawn per item (flat-drawings-pages), which the `set` kind already takes where a page assigns scenes;
  (b) client marks per row of the client list (needs the missing logo files below); (c) another treatment.
  Not fixed on this branch.
- **Q3 · BLOCKING. `case-studies` has a link, so its kind (`close`) maps it to the ink island (L), but an
  island here would touch the enquiry island** (form before FAQ puts the enquiry island directly under it;
  treatment rules § 2: the island touches no island). Today CloseBand renders it as C-text because the link is
  inline in the paragraph, not a line of its own; that is the no-link rendering, and the
  one-kind-one-component ruling does not allow it as a fallback. Options: (a) the band becomes the case
  grid of Q1(a), its link the head's end action ("Browse the case studies"), which answers Q1 and Q3 together;
  (b) the island, with the enquiry island moved away (breaks form before FAQ); (c) a rule for a close that
  sits directly above the enquiry.

## Open — not blocking
- Client marks missing (files needed in `public/clients/`, then `src/lib/client-marks.ts`): Benchmark Gensuite,
  Dealpath, Ringier Media Switzerland, JoVE, Primelis, Auxentios, ConnectX, BuildTwin, Novus Insights,
  Scissors, Gold Image Printing. Eden AI is still a PNG (ch05 §10 wants SVG).
- The wall also shows approved marks the copy does not name here (Omny, LatitudePay, Quoter, SafeXpay, Pledge,
  Incluude), as RecognitionBand does on every page. Owner: keep, or show only the clients this page names?
- `set` (What clients have asked us to do) uses the blue-marker ruled cell, which treatment rules § 2 keeps for
  figures; the kind is still to design site-wide.
- og/twitter image: `IMAGE_ASSET_REQUIRED` in the copy.
