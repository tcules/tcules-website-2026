# Legal single types in preview

`/terms-of-use` reads **Terms of use** (`termsOfUse(status: PUBLISHED)`) and `/privacy-policy`
reads **Privacy policy** (`privacyPolicy(status: PUBLISHED)`) through
`STRAPI_CASE_STUDY_GRAPHQL_URL`. The default is
`https://tcules-cms-2026-production.up.railway.app/graphql`. The optional server-only
`STRAPI_CASE_STUDY_API_TOKEN` supplies bearer authentication. `STRAPI_GRAPHQL_URL` does not
control these routes.

The native `heading`, `description` and ordered `legalDescription` sections own all visible copy.
Each section's heading supplies its H2 and table-of-contents entry; a blank heading creates an
unheaded section. Markdown paragraphs, emphasis, links, lists, nested headings, quotes and tables
map into the existing article shell. A final contact link stays in the document alongside its other
content. The renderer also preserves tables, quotes and further headings nested inside subsections.
Both legal pages keep CMS section order without treating the final section as a conversion band.

`publishedDate` and `updatedDate` are the editor-selected calendar dates, displayed in UTC as
publication and revision dates. The revision date supplies `lastModified` in both sitemap views.
The API's compatibility `publishedAt` and `updatedAt` fields are not used as system timestamps.

Native SEO fields supply metadata, canonical URL, robots and optional JSON-LD. Empty SEO falls
back to the native heading/description and the route's canonical URL, without reading old local
copy. JSON-LD escapes `<` before embedding. Currently both published SEO components are empty.

The shared request client supplies a ten-second timeout and five-minute caching, tagged `legal`
and the relevant single type. Missing or unpublished records return 404 and are omitted from the
sitemap. Request/schema failures surface instead of falling back to local legal text. Local
`_pages` documents remain available to design specimens. The retained legacy legal adapters are
not read by these public routes. This change performs no CMS writes and does not edit legal wording.

At connection time, Terms of use has eleven sections and Privacy policy has seven. The published
terms include `[Your Country/State]` in Governing Law; this authored placeholder is preserved.

Validation:

- `npm run legal-pages:check` covers endpoint/token selection, published-only queries, native copy,
  order, dates, SEO, missing records, failures and the actual article renderer, including a final
  contact link and nested content.
- `npm run legal-pages:check -- --live` compares both published documents' complete section text
  with their rendered output.
- `npm run verify`, `npm run build` and `npm run aria:check` cover repository and rendered contracts.
- Desktop/mobile browser checks cover titles, copy, section order, table-of-contents anchors, dates,
  metadata, sitemap dates and overflow.
