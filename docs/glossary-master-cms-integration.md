# Glossary hub on the new CMS (`/glossary`)

Branch `new-cms`, 5 Nov 2026. Frontend only: the CMS was read through its public API and never changed.
Glossary detail pages (`/glossary/{slug}`) are out of scope here.

## Source and query

- Endpoint: the public new-CMS GraphQL (`NEW_CMS_GRAPHQL_URL`, default
  `https://tcules-cms-2026-production.up.railway.app/graphql`), no token, `status: PUBLISHED`.
- `PublishedGlossaryMaster` (`src/content/sources/strapi/published-glossary-master-query.ts`): the
  `glossaryMaster` single type, `routePath`, the shared hero, then every `content` Dynamic Zone member in
  saved order.
- The zone allows exactly four members (checked against the live API; introspection is off, so membership
  came from validation errors): `ComponentSharedEditorialSection`, `ComponentGlossaryTermGroup`,
  `ComponentSharedCta`, `ComponentSharedFaqSection`. Term-group fields are aliased (`groupHeading`,
  `groupTerms` …) because their nullability clashes with the same names on the shared fragments.
- Terms come through each group's `terms[].term` Glossary relation (`term`, `slug`, `listingDefinition`);
  `titleOverride` / `definitionOverride` win when authored. No term copy lives on the master.
- SEO: the existing SEO Page reader (`getPageSeo('/glossary')`), with JSON-LD rendered only when the CMS
  supplies `structuredData`. `corpusMetadata` is no longer used by this route, so there is one source of
  head tags.

## Mapping (renders through the components the page already used)

| CMS                                                                            | Frontend                                                                |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Hero `title`, `description` + `secondaryDescription`, `breadcrumbs`, `eyebrow` | ListingIndex masthead (title, two-paragraph lede, trail)                |
| Editorial section before the first group (prose blocks)                        | Listing lead (`listing-lead`, anchored `how-to-use`)                    |
| Term group (`heading`, `anchorId`, `navigationLabel`, `note`)                  | Listing section + rail row; `note` (Markdown with links) under the rows |
| Term relation                                                                  | ListCard row → `/glossary/{slug}` (`glossaryPath`)                      |
| CTA after the groups (button, one action)                                      | ListingClose (open close, chat glyph), anchored by its `anchorId`       |
| FAQ section and any other CTA                                                  | `PublishedSection` bands, in zone order before/after the close          |

Order is the CMS's throughout: groups in zone order, terms in relation order, bands placed around the
listing by where they sit relative to the groups.

## Fallbacks and missing data

- No words fall back. A term with no published relation or title is skipped; a term with no definition
  renders its title alone; a group with no terms, a button CTA with no valid button, and any editorial
  section other than the lead are skipped. Each logs `New CMS /glossary: …`.
- The listing masthead has no media slot (it is the texture), so there is no illustration to fall back to;
  if the CMS authors hero media, a warning says it is not rendered.
- A missing single type 404s; an empty zone shows the listing's empty line.

## Validation (5 Nov 2026)

- Live query: 0 GraphQL errors, 0 mapper warnings; 5 groups, 19 terms, 4 FAQs, lead, close.
- Rendered page: every section, rail label and term from the CMS in CMS order; all 27 internal links
  return 200; one title, description and canonical; no horizontal overflow at 375px.
- Degraded payloads (missing relation, definition, label, note, breadcrumbs, FAQ, CTA button; empty zone;
  null single type) behave as above.
- `/design/listing-index?data=glossary` (corpus path) still renders all 19 terms through the shared row.

## CMS-side issues (not changed here)

- SEO Page `/glossary`: `robots` is `noindex,follow` (the `_pages` copy says `index,follow`) and the
  sitemap entry has `include: false`. The page renders noindex until that changes.
- No `structuredData` on the SEO Page; the copy specifies CollectionPage, BreadcrumbList and FAQPage.
- No Open Graph / Twitter image (the copy still marks it `IMAGE_ASSET_REQUIRED`).
- Sitemap URL is `https://tcules.com/glossary`; the canonical and Open Graph URL use `https://www.tcules.com`.
- Hero `eyebrow` is empty (the copy has "Glossary"); the listing showed no eyebrow before either.
- The design-and-code note links "first release" to `/services/mvp-development`; the `_pages` copy links
  `/services/new-product-design-first-release`. Both resolve; kinds:check may report the difference.
