# Why Tcules on the new CMS (`/why-tcules`)

Branch `new-cms`. The route was connected in `ffaa0cfa` / `2bb80bcc`; this note records the audit and
hardening pass of 5 Nov 2026. Frontend only: the CMS was read through its public API and never changed.

## Source and query

- `PublishedWhy` (`src/content/sources/strapi/published-why-query.ts`): `whyTcules(status: PUBLISHED)`,
  `routePath`, the shared hero, then every `content` Dynamic Zone member in saved order.
- The zone allows exactly nine members (checked against the live API by validation errors; introspection
  is off), and the query covers all nine: Client Grid, Case Study Cards, Reasons, Engagement Options,
  Offer Sheet, CTA, Testimonials, Comparison, FAQ.
- SEO: the SEO Page for `/why-tcules` (`getPageSeo`), JSON-LD only when the CMS supplies it.

## Mapping (each member through the component the page already used)

| CMS member                                                             | Frontend                                                   | `data-band`        |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| Hero (title, eyebrow, description, actions, stats, media, breadcrumbs) | `PublishedHero` (beside, photograph, figures)              | A                  |
| Client Grid (clients + mark overrides)                                 | `LogoGrid`, compact                                        | H                  |
| Case Study Cards (card → Case Study relation)                          | `BlockCardSet` under its head, `/case-studies/{slug}`      | M                  |
| Reasons (entries + illustration)                                       | `Reasons`, large figures                                   | reasons            |
| Engagement Options                                                     | shared `PublishedSection`                                  | engagement-options |
| Offer Sheet (`split_list`, list entries + icons)                       | `OfferSheet` list                                          | offer-sheet        |
| Offer Sheet (`illustrated`, cards + `scene`)                          | `OfferSheet` drawn grid, three across (two for four)       | offer-sheet        |
| CTA (`button_island` / `form_island`)                                  | `CtaSection` open / blue enquiry island with `EnquiryForm` | L                  |
| Testimonials (wall, ratings)                                           | shared `PublishedSection`                                  | G                  |
| Comparison (prose + table blocks)                                      | `DataTable` beside its head, the Tcules row picked         | E                  |
| FAQ                                                                    | shared `PublishedSection` (Accordion beside its head)      | D-faq              |

Each band's ground is the CMS's `surface` where it sets one (Reasons and Offer Sheet are `tint`);
Reasons keeps its tint default when none is set.

## What the hardening pass changed

- Grounds: the Offer Sheet's CMS `tint` was not read, so it rendered on paper; every custom band now
  reads its `surface`.
- No missing piece takes the page down any more. A client with no logo shows by name; a card with no
  published Case Study is left out; a card with no image uses its case study's thumbnail; a reason,
  block, item or section that cannot render is left out; a section with no `anchorId` gets a stable id
  (it was `undefined-heading`). Each logs `New CMS /why-tcules: …`.
- Illustration fallback (the only one): a reason with no CMS illustration shows the frontend's drawing
  for that title (`landedReasonFigure`, passed in by the route), else its labelled placeholder.
- `routePath` is checked; hero stats without a label or value and unknown icons are dropped with a
  warning.

## Validation (5 Nov 2026)

- Live query: 0 errors, 10 sections. The page was rendered beside the pre-CMS corpus composition at 1440
  and 390: same band order, `data-band`, grounds, image counts, band heights and text (5,650
  characters), no horizontal scroll, no page errors.
- Head: one title, description and canonical; robots, Open Graph and Twitter from the SEO Page.
- Links: every internal link returns 200 except the one noted below.
- Degraded payloads (missing logo, case relation, card image, reason illustration, anchor, stat label,
  unknown icon / block / section, missing FAQ heading), empty zone, null entry (404), wrong route and
  CMS down (error page) behave as above.

## CMS-side issues (not changed here)

- `/insights/guides/how-to-choose-a-product-design-agency`, linked from the comparison section, returns
  404 (the corpus page carried the same link).
- SEO Page: `robots` is `noindex,follow` and the sitemap entry has `include: false`; no structured data
  and no Open Graph / Twitter image. The sitemap URL is `https://tcules.com/…`, the canonical
  `https://www.tcules.com/…`.
- Placeholder art is stored in the CMS as real uploads: all three reasons share one "pending"
  illustration, the studio photo slot in Selected work is captioned "Image to come: studio photo", and
  the first testimonial's rating and avatar are flagged `ratingIsPlaceholder` / `avatarIsPlaceholder`.
- Reason illustrations have empty alt text.

## Illustrated Offer Sheet (6 Nov 2026)

The principles band ("Better product decisions, before you build") moves from a Reasons section to an **Offer Sheet
with presentation `illustrated`**: three cards, each `title`, `description` and `scene`, where `scene` names a flat
drawing in the site's code (`why-principles-evidence`, `why-principles-build-first`, `why-principles-pays-back` in
`src/components/Sketch/wyg-why-tcules.tsx`). An unknown scene is dropped with a warning. The mapper renders it
page-locally (`why-sheet` in `PublishedWhy`), so the shared Offer Sheet renderer other pages use is unchanged.
`split_list` sheets render exactly as before. Ruling: decisions/2026-11-06-why-tcules-principles-flat-drawings.

Order: this code ships first; then the CMS swaps the section (anchor `principles`, surface `tint`). Until then the
page renders as before, keeping its wide band drawing (`images.ts` `BAND_ILLUSTRATION`). After the swap the page
has no Reasons band, so that entry is unused; it can be removed here in a later cleanup (`main` is never merged
into `new-cms`).
