# Audit detail pages in the preview CMS connection

`/audits/{slug}` reads published entries of the new CMS Audits collection through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`, shared with case studies, resources,
services, expertise and glossary. `STRAPI_CASE_STUDY_API_TOKEN` is the optional server-only bearer
token. Current public published reads need no token. The general `STRAPI_GRAPHQL_URL` does not
control audit detail pages.

`audits_connection(status: PUBLISHED)` supplies paginated static route discovery and both sitemap
views. `scopedCorpusDocument(route:)` reads the collection's published `corpusContent`, authorizes
against `api::audit.audit.find`, and projects its typed breadcrumbs, media, conversion settings and
shared SEO into the existing authored document model. `offer-document.ts` maps the page as an
`audit` or `assessment`, preserving the authored page type and sharing the existing mapping with
service and expertise pages.

The existing OfferPage template renders the hero, ordered body, deliverables, comparisons, selected
work, testimonials, contextual links, FAQs and enquiry form. CMS media uses supplied dimensions and
responsive variants; empty slots retain the existing template placeholders. Supplied scene and
hero-illustration metadata is mapped when present. The layout keeps the existing rule that the
enquiry form appears immediately before the FAQ, although the authored document places it last.

Missing or unpublished documents return 404. CMS failures surface without substituting local audit
copy. Requests revalidate every five minutes with `audits` and per-audit cache tags. Newly published
slugs can render between builds. The local offer allowlist remains available for design specimens;
it no longer controls live audit routes or adds audit entries to the sitemap.

At connection time the CMS publishes four audits and two assessments in this collection. The `/audits` index and contact submission
processor retain their existing connections. No CMS content is changed and no test enquiries are
submitted by this integration.

Validation:

- `npm run audits:check` checks the shared endpoint, optional authentication, published pagination,
  slug validation, page/SEO/form/scene/media mapping, optional metadata, missing documents and
  request failures.
- `npm run audits:check -- --live` additionally maps every published audit and checks its title,
  SEO, authored band order and bound media.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and render contracts.
