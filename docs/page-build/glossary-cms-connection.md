# Glossary detail pages in the preview CMS connection

`/glossary/{slug}` reads published entries of the new CMS Glossary collection through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`, shared with case studies, resources,
services and expertise. `STRAPI_CASE_STUDY_API_TOKEN` is the optional server-only bearer token.
Current public published reads need no token. The general `STRAPI_GRAPHQL_URL` does not control
glossary detail pages.

`glossaries_connection(status: PUBLISHED)` supplies paginated route discovery and both sitemap
views. `scopedCorpusDocument(route:)` reads the collection's published `corpusContent`, authorizes
against `api::glossary.glossary.find`, and projects its typed breadcrumbs, media and shared SEO
into the existing authored document model. Both `defined_term` and the existing `glossary` page
type are accepted. The collection title names the term in a directory; the document H1 can be a
longer question and remains the detail page headline.

The existing LongformPage term template renders the definition, statement, continued introduction,
ordered body, comparison tables, related terms, FAQ, service links and closing action. The outline
rail uses the authored headings and anchors. CMS media uses supplied dimensions and responsive
variants; existing empty diagram slots retain their registered placeholders.

Missing or unpublished documents return 404. CMS failures surface without substituting local
term copy. Reads revalidate every five minutes with collection and per-term cache tags. New
published slugs can render between builds. The local longform allowlist remains available for
design specimens; it no longer controls live glossary routes or adds glossary entries to the
sitemap. The `/glossary` index and other longform families retain their existing connections.
No CMS writes are performed.

The shared article renderer now preserves standalone body CTA links and all closing paragraphs.
Closing copy uses CtaSection for up to two plain paragraphs; longer or linked copy keeps its
complete reading flow. This prevents the new CMS copy from being silently omitted by the template.

Validation:

- `npm run glossary:check` checks shared endpoint selection, optional authentication, published
  pagination, slug validation, definitions, sections, tables, FAQ, links, media, both page types,
  missing documents and request failures. It also renders the actual term template to check standalone
  CTA links and closing sections with two or three paragraphs.
- `npm run glossary:check -- --live` maps every published term and records its authored copy and
  links for browser comparison. At connection time the CMS publishes 19 terms.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and render contracts.
