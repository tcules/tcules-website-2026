# Expertise detail pages in the preview CMS connection

`/expertise/{slug}` reads published entries of the new CMS Expertise collection through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. Its default is
`https://tcules-cms-2026-production.up.railway.app/graphql`, shared with case studies, resources and
services. `STRAPI_CASE_STUDY_API_TOKEN` is the optional server-only bearer token; current public
published reads need no token. The general `STRAPI_GRAPHQL_URL` does not control expertise details.

`expertises_connection(status: PUBLISHED)` supplies paginated route discovery and both sitemap
views. `scopedCorpusDocument(route:)` reads that collection's published `corpusContent`, authorizes
against `api::expertise.expertise.find`, and projects its typed breadcrumbs, media, conversion
settings and shared SEO into the existing authored document model. The frontend maps that model
through the same OfferPage template as services, preserving hero copy, ordered sections, selected
work, contextual links, tables, testimonials, FAQs, enquiry settings and supplied scene mappings.
CMS media uses its supplied dimensions and responsive variants. Empty slots retain the existing
template placeholders.

Service and expertise documents share `offer-document.ts`; collection queries, slug validation
and cache tags remain specific to each reader. Missing or unpublished documents return 404 and
CMS failures surface without substituting local expertise copy. Reads revalidate every five
minutes with `expertise` and per-entry cache tags. New published slugs can render between builds.

At connection time the CMS publishes 13 expertise pages: the 12 previously listed by the local
offer allowlist plus `healthtech-care`. The latter is an authored narrative page with tables and
contact links; it does not author a FAQ, enquiry form or hero asset. Optional sections are rendered
only where supplied. The allowlist still serves design specimens but no longer controls live
expertise routes or adds expertise entries to the sitemap.

The `/expertise` index and the contact submission processor retain their existing connections.
No CMS content is changed and no test enquiries are submitted by this integration.

Validation:

- `npm run expertise:check` checks endpoint selection, optional authentication, published
  pagination, slug validation, document/SEO/form/scene/media mapping, narrative-only pages, missing
  content and request failures.
- `npm run expertise:check -- --live` additionally maps every published expertise document and
  checks its title, SEO, authored band order and bound media.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and render contracts.
