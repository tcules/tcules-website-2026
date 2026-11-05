# Service detail pages on the new CMS (`/services/{slug}`)

Branch `new-cms`, 5 Nov 2026. Frontend only: the CMS (`tcules-cms`) was read for its schema and never
changed. The Services listing (`/services`) is out of scope and untouched by this change.

## Source and queries

- Endpoint: the public new-CMS GraphQL (`NEW_CMS_GRAPHQL_URL`, default
  `https://tcules-cms-2026-production.up.railway.app/graphql`), no token, `status: PUBLISHED`.
- `PublishedService($slug)` (`src/content/sources/strapi/published-service-query.ts`): one Service by
  its full relative slug, the fixed `hero`, then every `content` Dynamic Zone member in saved order.
  All 15 zone members are queried; shared fragments (hero, CTA, FAQ, testimonials, case cards,
  engagement options) are the ones Home, About and the case study already use.
- `PublishedServiceSlugs`: every published slug, for `generateStaticParams`.
- SEO: the existing SEO Page reader (`getPageSeo`) by the derived path `/services/{slug}`.
- Validated against the live API for all 33 published slugs (0 GraphQL errors). Introspection is
  disabled in production, so field names were taken from the CMS schema files and confirmed by live
  responses.

## Component mapping

| CMS section | Variant / presentation | Renders through (same as the corpus page did) | `data-band` |
| --- | --- | --- | --- |
| Hero (`shared-hero-section`) | `arrangement` | `PublishedHero` → PageHero (trail, stats, actions, media) | A |
| Case Study Cards | — | BlockCardSet, Slider from 4 | M |
| Offer Sheet | `illustrated` | OfferParts: `column` cards = deliverables, `row` cards = parts | offer-parts |
| | `plain` (≤6 columns) | OfferSheet, rows as terms | offer-sheet |
| | `plain` (>6) / `read-down` | ReadDown in two columns, rows under it | D |
| | `catalogue` | Bento drawn tiles, rows under it | catalog-tiles |
| Hard Parts | `tabs` / `page` | ClaimRows → ClaimSet, example panel per claim | D-claims |
| Service Card | `single-grid-content` | Bento tiles; `closingRoutes` as the set's CTA cards | C-icon |
| | `two-grid-content` | Bento split tiles (labelled detail + `ctaText`), four tracks | C-icon |
| Stage | — | Steps beside one figure | F |
| Why | per card `illustration` / `media` | Reasons: illustration → figure, media → cover | reasons |
| Comparison | — | TableBand, or DrawnTableBand where the frontend draws every row | E / drawn-table |
| Editorial | `text` / `media` | prose band / media split | C-text / B |
| Illustrated, Client Grid | — | Bento / ListCard rows / agreement; LogoGrid | illustrated / H |
| Testimonials, Engagement, Industry Grid, FAQ | — | the shared `PublishedSection` bands | G, engagement-options, C-pills, D-faq |
| CTA | `button` | onward island (CtaSection `intent="onward"`) | onward |
| | `form` | enquiry island (blue, halves unless the CMS sets otherwise) | L |

Markdown fields (flow blocks, claim words, offer `descriptionRich`, stage `descriptionRich`) are parsed
with the corpus parser (`parseBlocks`, new export in `corpus/parse-body.ts`), so tables, labelled lines
and links render through the same `BandBody` as before. Rich overrides win over plain fields when they
have words.

Relationships: case cards use the CMS's `resolved` card (override → case thumbnail) and link to
`/case-studies/{slug}`; testimonials and FAQs come from their related records; service tiles fall
back to the related Service's slug when `href` is empty. A case card is one link, so links inside its
description render as words; a trailing "Read the … case" link that repeats the card's action is
dropped, as the corpus case set did (it otherwise nested anchors and broke hydration).

## Illustration fallback (the only fallback)

CMS illustration first; otherwise the drawing the frontend already assigns: hero
(`serviceIllustration`, else the register placeholder), offer cards and comparison rows
(`getOfferScenes`), service tiles (`serviceSceneFor` by destination), claims (`landedClaimFigure`),
Why reasons (`landedReasonFigure`, else the labelled slot), stage figure (scene, else the empty plate),
enquiry art (`ENQUIRY_SKETCH_TO_SHIPPED`). No words fall back.

## SEO

`generateMetadata` returns the mapped SEO Page metadata (title, description, keywords, canonical
checked against the path, robots, Open Graph, Twitter). JSON-LD is emitted when the SEO Page carries
`structuredData`. Verified on all 33: one `<title>` each, 33 unique titles and descriptions, one
canonical/description/robots/og:url/twitter:card each, canonical and og:url equal
`https://www.tcules.com/services/{slug}`. Missing slug → 404 with `noindex, nofollow`; CMS unreachable
→ `error.tsx` ("Service temporarily unavailable", retry) and a `noindex` title.

## Validation (dev server)

- 33/33 routes 200 with CMS content; band order matches the CMS order and, band for band, the
  previous corpus page, except the two items under "Differences from the corpus page".
- Per-band word diff against the corpus render: every remaining difference traces to CMS data (below).
- No console errors or hydration warnings on any of the 33 routes; no horizontal overflow at 375px
  (wide tables scroll inside DataTable as before).
- `tsc --noEmit` clean; eslint clean on the changed files (two pre-existing unused-import warnings).

## Differences from the corpus page (decisions for review)

1. **Why section** now renders as `Reasons` so each card's `illustration`/`media` variant is honoured
   (the CMS's documented mapping). The 4 Nov ruling set this band as the glyph list (OfferSheet
   `list`), which has no slot for a per-card visual. Every Why card's upload today is the same
   "ILLUSTRATION TO COME" placeholder, so the band shows six placeholder figures.
2. **"Tell us what you're working on" ask island** after "Three ways to work with us" no longer
   renders: its heading was hardcoded in the frontend and its link came from the corpus copy. No
   Service carries a CTA for it.

## Missing or mismatched CMS fields (not changed here)

- Every service SEO Page: `robots` `noindex,follow`; no Open Graph or Twitter image; no structured data.
- Enquiry form: `replyLabel` empty on every service (the card's "We reply in 1 business day" was
  frontend text and is gone); `island` and `presentation` empty (frontend defaults to blue/halves).
- Service Card closing questions on product-design, design-systems, software-development and
  ai-product-ux are stored as `after` prose, not `closingRoutes`, so they render as a paragraph
  instead of the dotted CTA cards.
- Hard parts: all three sections are `tabs`; product-design was `page` on the corpus page.
- Engagement options: `presentation` `grid` and no option `icon`; the corpus page showed glyph cards.
- `software-development/mobile-app-development`: the "Still weighing it up? Our guide…" sentence is
  both in the Offer Sheet `after` and (heading only, no description) in the following button CTA.
- Headings that differ from the corpus copy (CMS wins): the enquiry headings on ai-product-ux,
  trust-control-recovery and mobile-app-development.
- Case cards now show their CTA labels (`showCta: true`) on the specialist pages.
- Testimonials: placeholder ratings and avatars are hidden off the home page (the existing shared
  policy), so the stars and placeholder portraits the corpus pages showed are gone.
- Eden AI case image file has the alternative text "test123" (the card's own `altText` is used).
- Why cards: all 198 uploads are the same placeholder image.
- Offer `catalogue` (interaction-ui-design) and `plain` cards carry no `scene`; catalogue cards carry
  no destination, so tiles are not links.
- `/services/new-product-design-first-release` (linked from the corpus copy) has no Service record.

## Changed files

- `src/app/services/[...slug]/page.tsx` (route on the new CMS), `error.tsx` (new)
- `src/content/sources/strapi/published-service.ts`, `published-service-query.ts` (new)
- `src/content/source.ts`, `src/content/index.ts` (`getServiceDetail`, `listServiceSlugs`)
- `src/content/sources/corpus/parse-body.ts` (`parseBlocks` export)
- `src/templates/CorpusPage/PublishedService.tsx`, `published-service-model.ts` (new)
- `src/templates/CorpusPage/CopyBands.tsx` (export `ScenarioSplit`, `acrossFor`; `DrawnTableBand`
  `page` optional), `OfferBands.tsx` (export `LEDGER_BANDS`), `PublishedHome.tsx` (link labels drop an
  authored trailing "→", as `LinkActions` does)
