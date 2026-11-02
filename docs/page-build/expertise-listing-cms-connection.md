# Expertise listing single type in preview

`/expertise` reads the published **Expertise listing** single type through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`, shared with the migrated detail pages.
`STRAPI_CASE_STUDY_API_TOKEN` is the optional server-only bearer token; current public reads need
no token. The general `STRAPI_GRAPHQL_URL` does not control this page.

One GraphQL request reads `expertiseListing(status: PUBLISHED)` and the published
`scopedCorpusDocument(route: "/expertise")` projection of that same single type. Native hero,
expertise directory, FAQ, form CTA and SEO fields supply their visible content. The record's
`corpusContent` supplies the other authored narrative sections, breadcrumbs, media bindings,
conversion settings and presentation metadata for the existing OfferPage layout.

The directory uses native group and relation order. Card title, best-for text, design approach,
URL and optional image are resolved from the selected published expertise entries at request time.
Snapshot directory rows are replaced entirely, so removing or unpublishing a selected entry does
not leave a stale card. The listing currently selects twelve entries in two groups; the detail
collection's additional `healthtech-care` page is not automatically added to this curated listing.

Uploaded card images take precedence over approved fallback photographs and registered placeholders.
CMS image dimensions, alt text and responsive variants are preserved. Native FAQ answers retain
links, emphasis and lists, with existing case-link normalization. Native CTA copy, caption and
success text reach the existing enquiry component; typed form field settings remain on the
single type's authored conversion component. The form still precedes the FAQ under the existing
layout rule. The submission processor is unchanged; validation submits no test enquiries.

The page is included in both sitemap views only when its published listing is available, with
`updatedAt` as its last-modified date. Missing or unpublished content returns 404. Request or schema
failures surface without falling back to local listing copy. Reads cache for five minutes with
`expertise-listing` and `expertise` tags and the shared CMS request timeout. Local design specimens
and other composed routes keep their existing sources. This integration performs no CMS writes.

Validation:

- `npm run expertise-listing:check` checks endpoint selection, authentication, published reads,
  group ordering/removal, native hero/FAQ/form/SEO mapping, optional sections, input immutability,
  missing content and failures. It renders the directory to prove CMS images override fallbacks.
- `npm run expertise-listing:check -- --live` reads the published singleton and records the selected
  cards, groups, FAQs and metadata for browser checks.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and render contracts.
