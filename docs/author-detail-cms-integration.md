# Author detail CMS integration

Validated 5 November 2026 in `tcules-website-2026` on `new-cms`. No CMS files, schemas, content, permissions or configuration changed. Resources listing/detail and other route implementations remain unchanged. The existing authors index retains its source; the detail route has its own reader so this phase does not change the index.

## Queries

Unauthenticated POSTs to `https://tcules-cms-2026-production.up.railway.app/graphql`:

- `PublishedAuthor($slug: String!)`: exact author slug, `status: PUBLISHED`, one record; profile, embedded shared SEO, public SEO settings, and the existing shared close from `resourceListing`.
- `PublishedAuthorResources($slug: String!)`: top-level `resources_connection(status: PUBLISHED)` with an OR filter on `author.slug` and `coAuthors.slug`. The API's nested `Author.resources` relation does not accept a `status` argument; the published top-level connection ensures drafts cannot appear.
- Resource pages use explicit offsets and a limit of 100, continuing until `pageInfo.total` is exhausted. Records are deduplicated by documentId and sorted newest first by the authored listingDate, otherwise publicationDate, with slug as a deterministic tie-breaker. Omitted listing dates stay hidden while still contributing to ordering.
- `listedResources` / `listingAuthors` customize listing credits and are not treated as authorship. Primary and co-author relationships match the resource detail credits. Authors with only co-authored pieces are included.
- Existing public GraphQL timeout, five-minute fetch revalidation and React request memoization are reused. No authentication token is read or sent. The route reads published data on demand, including future authors without a rebuild.

## Component mapping

| CMS field                                                   | Existing presentation                                                                                                                  |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| name / designation / description                            | Profile PageHero title and lead/bio                                                                                                    |
| profilePicture                                              | Profile portrait; missing photo uses existing CMS-name initials treatment                                                              |
| linkedInProfile                                             | Existing LinkedIn link beside the role; the existing adjunct slot preserves the link when both role and bio are absent                 |
| Resource topics / expertises / Stage                        | Most frequent four taxonomy labels, as the profile template already does; industry labels are not repeated as parallel expertise names |
| Authored Resource relationships                             | AuthorPieces feature, pictured cards, and ledger; every piece visible with no extra frontend filtering or pagination                   |
| Resource thumbnail.title / description / image / scene      | Existing card content, cover and illustration; the record title/description are used where no card-specific override is configured     |
| Resource Type / readingTime / listingDate / publicationDate | Card format, read/watch duration and authored date                                                                                     |
| resourceListing enabled closing CTA                         | Existing ListingClose and enquiry island, using CMS form copy/media when complete                                                      |

AuthorPieces is unchanged: the newest pictured piece leads, the next pictured pieces use the existing card rows, and the remaining pieces use the ledger. No resource appears twice, and the template's existing presentation groups are preserved. There is no author-page filter or “show more” control to migrate.

## SEO

The author record's own meta title/description, canonical, robot directives, OG title/description/type/URL/image/alt/site/locale, Twitter card/title/description/image/alt/handles, keywords, technical robots options, language alternates and structuredData map to the existing Next metadata architecture. The shared SEO type now accepts `profile`; this is a type-only addition with no change to other routes' rendering.

The CMS sends OG type `profile`, Twitter card `summary`, and `noindex,follow` for every author. Global `allowIndexing=false` is respected. Every rendered page has its own unique title and one canonical, normalized to its author path without a query/hash/trailing slash. Social images are absolute HTTP(S) URLs. One safely escaped CMS JSON-LD script replaces the previously generated hardcoded graph; no extra Person/ProfilePage graph is emitted.

All current author records have titles, descriptions, canonicals, OG/Twitter metadata and structuredData. Technical SEO and focusString are unset on all eleven; optional technical fields are supported and fixture-tested. The existing profile-photo social image strategy uses only CMS media. Missing CMS social images do not get local portraits or generic pictures.

## Illustration-only fallback

CMS uploaded card covers take precedence over CMS-selected drawing scenes. If neither is configured, the existing `COVER_SCENES` illustration registry is retained as the only card fallback. No local photo or authored text is substituted. Current CMS scene selections are `code-review` and `prototype-to-production`; the existing registry fallback was exercised with a fixture.

A complete shared enquiry form uses its CMS illustration; only absent illustration media uses the existing sketch-to-shipped drawing. Both branches were fixture-tested. The current published close is incomplete and is withheld, so no enquiry illustration fallback is currently rendered on the eleven live author pages. Missing author photos use derived initials, not a photo fallback.

## Missing CMS data and mismatches

- The shared `resourceListing` CTA 830 is enabled and configured as a form island, but `form.submitLabel`, `form.successHeading` and `form.successBody` are null. The enquiry close is withheld on author pages with an explicit warning. Heading, description, button and illustration exist, but substituting a button-only close would change its configured behavior. No old/default form copy is inserted. The adapter will render the existing close when the required CMS fields are supplied.
- Missing portraits: `rishabh-choudhary`, `yash-gidwani`, `chirag-patel`, `anshu-jain`, `varun-mashru`.
- Missing LinkedIn: `rushali-bhatt`, `rishabh-choudhary`, `devagya-sharma`, `yash-gidwani`, `chirag-patel`, `shoghi-bagul`, `anshu-jain`, `varun-mashru`, `preksha-kharidia`. Only Rakesh and Jatin have configured links; nothing is inferred from local team profiles.
- Author has no `resolvedSeo` GraphQL field. Its verified embedded `seo` fields are mapped directly.
- Five authored SEO descriptions contain stale piece counts. The visible heading counts current published primary/coauthored records; the CMS descriptions remain unchanged for CMS review:

| Author slug     | Count stated in CMS SEO description | Published authored pieces |
| --------------- | ----------------------------------- | ------------------------- |
| devagya-sharma  | 28                                  | 29                        |
| yash-gidwani    | 24                                  | 23                        |
| chirag-patel    | 22                                  | 23                        |
| varun-mashru    | 2                                   | 3                         |
| rakesh-chitroda | 16                                  | 18                        |

The CMS canonical/siteURL uses `https://tcules.com`, while structured-data IDs use `https://www.tcules.com`. These CMS-provided values are preserved; the bare host currently redirects to www, as noted in the preceding integration report. Align the CMS host configuration separately if desired.

## Validation

- All eleven public author records mapped against actual GraphQL responses, including coauthor-only authors; all 117 distinct referenced Resource detail URLs return 200.
- Production webpack build and `npm run verify` passed. Changed files also passed targeted lint and `git diff --check`.
- Rendered HTML/head checked for correct profile content, unique titles, canonical, robots, OG/Twitter images and titles, one exact CMS JSON-LD object, duplicate element IDs, valid ARIA references, unique resource links and live counts.
- All eleven routes checked at 390, 768, 1024 and 1440px (44 checks), with no horizontal overflow or page runtime errors. Representative profiles with a photograph and missing photograph were visually inspected.
- All 24 distinct configured profile/card/social image URLs responded successfully.
- Build-wide ARIA check passed for 269 prerendered pages and 5,806 ID references; all dynamic author pages were checked separately in rendered HTML.
- Pagination fixture read all 205 records at offsets 0/100/200 without truncation. Additional rendered fixtures covered a server cap smaller than the requested limit, coauthorship deduplication, zero resources, missing optional fields, LinkedIn without biography/designation, extended robots, canonical normalization, safe JSON-LD, illustration priority/fallback, configured form copy, unpublished/missing 404, upstream 500 and retry recovery.
- The existing `/favicon.ico` 404 is the only console error observed on production author pages. This unrelated route is unchanged.
- Validation servers were stopped after testing; the pre-existing development server was left untouched.

## Validated routes

| Author route                          | Published pieces |
| ------------------------------------- | ---------------- |
| `/insights/authors/rushali-bhatt`     | 25               |
| `/insights/authors/rishabh-choudhary` | 18               |
| `/insights/authors/devagya-sharma`    | 29               |
| `/insights/authors/yash-gidwani`      | 23               |
| `/insights/authors/chirag-patel`      | 23               |
| `/insights/authors/shoghi-bagul`      | 14               |
| `/insights/authors/anshu-jain`        | 7                |
| `/insights/authors/varun-mashru`      | 3                |
| `/insights/authors/preksha-kharidia`  | 2                |
| `/insights/authors/rakesh-chitroda`   | 18               |
| `/insights/authors/jatin-leuva`       | 20               |

## Changed files

- `src/app/insights/authors/[slug]/page.tsx`
- `src/content/index.ts`
- `src/content/source.ts`
- `src/content/sources/strapi/page-seo.ts`
- `docs/author-detail-cms-integration.md`
- `src/app/insights/authors/[slug]/error.tsx`
- `src/content/sources/strapi/author-seo.ts`
- `src/content/sources/strapi/published-author-query.ts`
- `src/content/sources/strapi/published-author.ts`

Changes remain uncommitted on `new-cms`. No CSS, shared presentation components, Resources listing/detail route, authors index route, or CMS files were edited.
