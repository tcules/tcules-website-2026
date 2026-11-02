# Resources: production CMS connection

The preview branch reads the native `resources` collection through the same
`STRAPI_CASE_STUDY_GRAPHQL_URL` setting used by case study detail pages. Its default
is `https://tcules-cms-2026-production.up.railway.app/graphql`. The optional
`STRAPI_CASE_STUDY_API_TOKEN` is shared too; both settings remain server-side.

The published collection contains 105 records on 2 November 2026: 81 articles,
14 guides, seven videos and three events. `resources_connection` is fetched in
100-record pages until the complete collection is loaded. Duplicate records,
incomplete pagination, HTTP failures and GraphQL errors fail explicitly.

`resource-query.ts` reads native fields. `resources.ts` maps them into the existing
page models, with a shared body renderer in `app/_insights/body.tsx`:

- Resource type determines the format, including guides whose slug has no prefix.
- Canonical CMS slugs resolve under `/insights/{slug}`; event slugs resolve through
  the existing `/insights/events/{slug}` route.
- Explicit section anchors and navigation labels drive the table of contents.
  The CMS switch can hide it without removing the section anchors.
- Existing article jump links resolve against native headings. Five retired links
  on four articles have explicit aliases to their verified current section IDs
  in `resource-anchor-aliases.ts`; the CMS records are left as authored.
- Rich text, image grids, tables, notes, insights, separators, videos, embeds and
  code use their corresponding renderers. Table cells retain inline formatting.
- Media URLs, captions, intrinsic sizes and responsive formats come from uploads.
  Static SVG diagrams in embed blocks render as isolated image documents, with
  their viewBox dimensions and descriptions. Figure wrappers and empty imported
  namespaces are handled without inserting CMS markup into the page DOM.
- Publication date, last-updated date and reading time use their authored fields.
- Primary authors and co-authors come from native employee profiles. Author pages
  use these profiles and their credits across the complete collection.
- Related resources retain the editor's order, titles, native formats and links.
  The published button CTAs and SEO fields come from each resource.

The insights hub's records, type/topic/stage/industry filters, author listings and
sitemap now share this collection. The hub keeps its existing introductory, Lab
and closing copy as site copy; resource content does not depend on the old CMS singleton or on the
local CPQ article override. Missing published resource slugs return 404. Reads
revalidate every five minutes and have a ten-second request timeout.

`npm run resources:check` runs offline contract checks as part of `npm run verify`.
`npm run resources:check -- --live` additionally queries and maps every published
resource, checking body preservation, format, authors, dates, outline and SEO.
