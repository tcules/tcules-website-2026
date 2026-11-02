# Services in the preview CMS connection

`/services/{slug}` reads published entries of the new CMS Services collection through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`, shared with case studies and resources.
`STRAPI_CASE_STUDY_API_TOKEN` is an optional server-only bearer token. Public published reads
currently need no token. The general `STRAPI_GRAPHQL_URL` does not control service detail pages.

The collection's `corpusContent` is its authored document for the existing OfferPage template.
The CMS's `scopedCorpusDocument(route:)` GraphQL resolver returns only published content, authorizes
against `api::service.service.find`, and projects that document's typed breadcrumbs, media,
conversion settings and shared SEO into the existing page model. The frontend maps its hero,
ordered body sections, selected work, service links, testimonials, FAQs and closing enquiry form.
`frontendTemplate.scenes` and the uploaded hero illustration preserve the existing page drawings.
Layout and component selection stay in the frontend templates.

All service media uses CMS dimensions and responsive variants when supplied; local corpus assets
continue to use their measured asset registry. This lets newly uploaded media work without a
frontend asset-generation step. Empty media slots retain the template's existing placeholders.

`services_connection(status: PUBLISHED)` supplies paginated static route discovery and both sitemap
views. Nested slugs remain intact, such as `/services/product-design/ux-research`. The local offer
allowlist remains available to design specimens; it no longer controls live service routes or adds
service pages to the sitemap. Missing or unpublished documents return 404; failures are
surfaced without substituting stale local service copy. Requests revalidate every five minutes
with `services` and per-service cache tags. New published slugs can render between builds.

The `/services` index, audits, expertise and the contact submission processor keep their existing
connections. This change performs no CMS writes and does not submit test enquiries.

Validation:

- `npm run services:check` checks endpoint selection, optional auth, published pagination, nested
  slugs, page/SEO/form/scene mapping, newly uploaded media, missing content and failure handling.
- `npm run services:check -- --live` additionally reads every published service and checks titles,
  ordered sections, SEO, conversion and bound media. At connection time there are 33 service pages.
- `npm run verify`, `npm run build` and `npm run aria:check` cover the repository contracts and render.
