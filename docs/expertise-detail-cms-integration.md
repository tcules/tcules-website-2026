# Expertise detail pages on the new CMS (`/expertise/{slug}`)

Branch `new-cms`, 5 Nov 2026. Frontend only: the CMS (`tcules-cms`) was read for its schema and never
changed. The Expertise listing (`/expertise`) is a separate integration
(`docs/expertise-master-cms-integration.md`) and is untouched by this change.

## Source and queries

- Endpoint: the public new-CMS GraphQL (`NEW_CMS_GRAPHQL_URL`, default
  `https://tcules-cms-2026-production.up.railway.app/graphql`), no token, `status: PUBLISHED`.
- `PublishedExpertise($slug)` (`src/content/sources/strapi/published-expertise-query.ts`): one Expertise
  by slug, `name slug routePath expertiseKind`, the fixed `hero`, then every member of the `content`
  Dynamic Zone in saved order. All 17 zone members are queried: the 15 shared sections
  (`SHARED_SECTION_MEMBERS`, the same fragments the Service page reads) and the two Expertise-only ones
  (`EXPERTISE_SECTION_MEMBERS`: Expertise Directory, Question Role Ledger).
- `PublishedExpertiseSlugs`: every published slug, for `generateStaticParams`.
- SEO: the SEO Page reader (`getPageSeo`) by the derived path `/expertise/{slug}`.
- 14 published records: the 12 corpus pages plus `healthtech-care` and `main` (see "Missing or
  mismatched CMS fields"). The mapper raises no warning on any of them: every section, card and
  relation maps without a drop.

## Component mapping

Each section renders through the component it renders through on a Service page
(`SharedSectionView`), so a section looks the same wherever an editor places it.

| CMS section                               | On these pages                      | Renders through                                                               | `data-band`           |
| ----------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------- | --------------------- |
| Hero (`shared-hero-section`)              | `beside` (12), `stacked` (2)        | `PublishedHero` → PageHero (trail from CMS breadcrumbs, stats, action, media) | A                     |
| Service Card                              | `single_grid_content`, 6 tiles      | Bento tiles (the corpus "What we design" tiles, same markup)                  | C-icon                |
| Case Study Cards                          | —                                   | BlockCardSet, cards from the CMS `resolved` case                              | M                     |
| Hard Parts                                | `tabs`                              | ClaimRows → ClaimSet; a closing scenario keeps its legend                     | D-claims              |
| Offer Sheet                               | `illustrated` (column + row cards)  | OfferParts                                                                    | offer-parts           |
| Testimonials                              | `slider`                            | shared testimonial band                                                       | G                     |
| Engagement Options                        | `grid`                              | shared engagement band                                                        | engagement-options    |
| CTA                                       | `button` → `#enquiry`               | ask island                                                                    | L                     |
|                                           | `button` → elsewhere                | onward island                                                                 | onward                |
|                                           | `form`                              | enquiry island, `family: expertise`, `serviceOrAudit: {slug}`                 | L                     |
| Why                                       | `illustration` cards                | Reasons                                                                       | reasons               |
| Industry Grid                             | `expertise` selection               | shared pills band, links from the related Expertise records                   | C-pills               |
| FAQ                                       | —                                   | shared FAQ band from related FAQ records                                      | D-faq                 |
| Editorial                                 | `text`                              | prose band                                                                    | C-text                |
| Expertise Directory, Question Role Ledger | not used on any detail record today | `ExpertiseDirectoryBand`, `QuestionLedgerBand`                                | C-image, voice-ledger |

Relationships: case cards link to `/case-studies/{slug}` through the CMS's resolved card; testimonials
and FAQs come from their related records; Industry Grid entries take their route from the related
Expertise record; service tiles take their `href`, else the related Service's route. No related
record's words are copied into the page.

## Illustration fallback (the only fallback)

CMS illustration or media first; otherwise the drawing the frontend already assigns. Hero:
`heroFallback(route)` (shared, `src/app/_corpus/hero-fallback.ts`), used only when the CMS hero has no
media. Every expertise hero has CMS media except `main` and `healthtech-care`, which are `stacked`
with no media, and the frontend has no drawing for them, so they stay text-only as before. Service
tiles, which carry no CMS illustration, use `getOfferScenes` by item (none are drawn yet, so they show
the same labelled plates as the corpus page). Claims use `landedClaimFigure`, Why uses
`landedReasonFigure`, and the enquiry art comes from the enquiry illustrations. No words fall back.

## SEO

`generateMetadata` returns the mapped SEO Page metadata: title, description, keywords, a canonical
checked against the path, robots, Open Graph and Twitter. JSON-LD is emitted once when the SEO Page
carries `structuredData`. Verified on all 14 (Googlebot UA, rendered HTML):

- one `<title>`, description, canonical, robots, `og:url` and `twitter:card` each;
- 14 unique titles and descriptions;
- `og:url` equals the canonical;
- canonical `https://www.tcules.com/expertise/{slug}` on the 12, with the two exceptions below.

A missing or draft slug returns 404 with `noindex, nofollow`. A CMS that can't be reached shows
`error.tsx` ("Expertise temporarily unavailable", with a retry) and a `noindex` title. There is no
`loading.tsx` on the segment on purpose: a streaming boundary makes `notFound()` answer 200, not 404.

## Validation

- 14/14 routes 200 with CMS content; an unknown slug is a 404.
- Band order and every band heading match the CMS order and, on the 12 corpus pages, the previous
  corpus render band for band. Per band, the structure matches the corpus render (class sequence,
  images, links) except for the differences listed below.
- Of the 66 distinct internal links in the page bodies, 63 return 200. `/expertise/fintech-insurtech`
  answers with its existing 307 to `/expertise/fintech`. Two links in CMS copy reach a 404, the same
  two the corpus pages carried (see below).
- Production build (`next build`, typecheck included) prerenders all 14. Against it, every route
  showed no console errors, no horizontal overflow at 375px, one `h1` and no duplicate ids.

## Differences from the corpus page (all from CMS data or the shared Service mapping)

1. **Why section** renders as `Reasons` with each card's upload, the same decision the Service
   integration recorded. The corpus drew it as the glyph list. Every Why upload is the same
   placeholder image.
2. **HealthTech hard parts** render as tabs (ClaimSet), because the CMS presentation is `tabs`. The
   corpus drew that band as the voice ledger. Its quoted questions use straight quotes, as stored in the
   CMS, where the corpus showed curly ones.
3. **Testimonials** lose the "4.8 on Clutch" badge: no testimonial section links a `rating`. The
   placeholder star ratings stay hidden, under the existing shared policy.
4. **Engagement options** draw sketch cards, not glyph cards: `presentation` is `grid` and no option
   has an `icon`. The CMS copy ends its option labels with a full stop.
5. **Enquiry card** loses "We reply in 1 business day": `form.replyLabel` is empty on all 12.

## Missing or mismatched CMS fields (not changed here)

- Every Expertise SEO Page has `robots` set to `noindex, follow`, no Open Graph or Twitter image, and no
  structured data (`main` and `healthtech-care` excepted).
- `main`: a published Expertise record whose slug is `main` and whose name and SEO title repeat the
  Expertise Master. Its SEO canonical points at `/expertise`, so the frontend drops that canonical and
  renders `noindex`. Its copy links to the retired `/expertise/fintech-insurtech`. It looks like it
  should be unpublished or merged into the Master.
- `healthtech-care`: the canonical host is `https://tcules.com`, where every other page uses
  `https://www.tcules.com`; Twitter card `summary`, not `summary_large_image`. Its last Editorial
  section and its CTA repeat the same heading ("Start with one consequential health-product
  transition").
- Dead links in CMS copy, unchanged from the corpus: commerce-transactional-products →
  `/insights/guides/ecommerce-product-experience-decision-guide`, proptech-contech-field-operations →
  `/insights/guides/saas-does-your-app-need-a-mobile-version`. No published resource has either slug.
- Testimonial sections: no `rating` (12/12). All testimonial ratings are flagged placeholder.
- Enquiry forms: `replyLabel` and `island` empty (12/12). The frontend defaults the island to blue.
- Engagement options: `grid` with no `icon` (12/12).
- Service Card tiles: none of the 71 has an `illustration`, and the frontend has no drawing for them
  yet, so they show the labelled plate.
- Hero media on the 12 is an "Image to come" placeholder upload. `previewImage` is empty on `main` and
  `healthtech-care`.

## Changed files

- `src/app/expertise/[slug]/page.tsx` (the route on the new CMS), `error.tsx` (new)
- `src/content/sources/strapi/published-expertise.ts`, `published-expertise-query.ts` (new)
- `src/templates/CorpusPage/PublishedExpertise.tsx`, `published-expertise-model.ts` (new)
- `src/content/source.ts`, `src/content/index.ts` (`getExpertiseDetail`, `listExpertiseSlugs`)
- `src/templates/CorpusPage/PublishedService.tsx`: `Claims` renders a closing scenario through
  `ScenarioSplit`, as `Stages` does

The shared exports this route reuses (`mapSharedSection`, `SharedSectionView`, `heroFallback`, the
`expertise-sections` reader, model and bands) belong to the Expertise Master integration.
