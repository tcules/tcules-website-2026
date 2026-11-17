# Glossary detail CMS integration

Validated 5 November 2026 in `tcules-website-2026` on `new-cms`. No CMS files, schemas, content, permissions or configuration changed. The Glossary Master (`/glossary`) is untouched.

## Query

Unauthenticated POST to `https://tcules-cms-2026-production.up.railway.app/graphql` (introspection is disabled; every field was verified against live responses):

- `PublishedGlossary($slug: String!)`: `glossaries(status: PUBLISHED)` filtered on the exact slug, one record. Reads `term`, `routePath`, the shared hero (title, eyebrow, description, secondaryDescription, additionalParagraphs, breadcrumbs, actions) and the `content` dynamic zone. Fields that share a name with different nullability across components (`anchorId`, `navigationLabel`, `surface`) are aliased.
- SEO is not on the Glossary record. It is the route-keyed `seoPages` entry for `/glossary/{slug}`, read through the existing `getPageSeo` mapper (`page-seo.ts`).
- Existing public GraphQL timeout, five-minute revalidation and React request memoization are reused. Slugs are validated before any request. The route renders on demand, so a record published later appears without a rebuild.

## Component mapping

The record is mapped onto the term page's existing view model (`CorpusPage`) and rendered by the unchanged `LongformPage` `term` template, so layout, the outline rail, the statement band, tables and the FAQ accordion are exactly as before.

| CMS                                                                                                   | Existing presentation                                                                                                                    |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `hero.title` / `hero.eyebrow` / `hero.breadcrumbs`                                                    | Hero h1, eyebrow, breadcrumb trail                                                                                                       |
| `hero.description`, `secondaryDescription`, `additionalParagraphs`, Markdown before the first heading | Hero definition; the next paragraph is the statement when it is one short line, otherwise it opens the shell (template rule)             |
| `hero.actions`                                                                                        | Hero actions                                                                                                                             |
| `term`                                                                                                | The term name (the table's term column highlight)                                                                                        |
| `ComponentContentHeading`                                                                             | A section: `anchorId` is its id, `navigationLabel` its outline label                                                                     |
| `ComponentContentMarkdown`                                                                            | The section's prose, lists and inline links (same Markdown parser as the corpus)                                                         |
| `ComponentContentDataTable`                                                                           | The section's table (row heading first)                                                                                                  |
| `ComponentContentLinkList`                                                                            | The section's link button(s)                                                                                                             |
| `ComponentGlossaryTermGroup`                                                                          | Related-terms section; each related record links to `glossaryPath(slug)` with its CMS term name, in CMS order                            |
| `ComponentSharedFaqSection`                                                                           | FAQ section and accordion; inactive questions are skipped; answers are converted from Strapi rich text (paragraphs, lists, marks, links) |

CMS block order is preserved. Unknown blocks, headings without an anchor, unsafe links and related terms whose `routePath` disagrees with the slug are logged as warnings.

## SEO

`seoPages.resolved` supplies title, description, canonical, robots, Open Graph (title, description, URL, type, site name, locale) and Twitter/X (card, title, description). The shared mapper rejects a canonical that does not match the route and then sets `noindex`. CMS JSON-LD is emitted once when present; no frontend structured data is generated, so nothing is duplicated. All 19 term pages currently carry `noindex,follow` from the CMS.

## Illustration fallback

No Glossary record has hero `media`, `illustration` or `scene`, and the term template draws no hero illustration (owner, 4 Nov 2026: the words are the page). There is no existing illustration to fall back to and none is rendered.

## Missing CMS data and mismatches

- **Hero statement lines missing (5 records).** The one-line statement after the definition is absent from the CMS for `coded-prototype`, `design-system-drift`, `prototype-hardening`, `user-journey-mapping` and `workflow-design` (e.g. "The rules come first. The screens follow."). `hero.secondaryDescription` is null on every record; filling it restores the statement band with no code change.
- **Related-term glosses missing (9 records, 28 links).** `ComponentGlossaryTermReference` holds only the relation, so each related term renders as a linked name without its short explanation. A text field on the reference is needed.
- **`/glossary/main` is a Glossary record.** It holds the master's hero and four empty headings, and its SEO canonical points at `/glossary`. It renders as published (noindex, no canonical). Unpublish it or move that content to the Glossary Master.
- **No social images or structured data** on the 19 term SEO entries (the corpus named `glossary.png` and WebPage/DefinedTerm/FAQPage types).

## Validation

- All 20 published records mapped against live GraphQL; all return 200; `not-a-term`, `Bad_Slug` and `../etc` return 404.
- Rendered HTML checked per route: one h1 matching the CMS title, every heading and anchor, outline links, every FAQ question, table headers, every related-term, Markdown and link-list href. Every line of the previous corpus copy is present, except the gaps listed above.
- Head: one title, one canonical, robots, OG and Twitter tags, no duplicated meta, JSON-LD only where the CMS supplies it.
- All 20 routes at 390, 768, 1024 and 1440px in Chrome (80 checks): no horizontal overflow, no page errors. Three resource-load console entries (one 404, two dropped connections during dev recompiles) came from the shared dev server, not the page.
- Typecheck and targeted lint pass. A production build was not run because another session shares this checkout and its `.next` output.

## Changed files

- `src/app/glossary/[slug]/page.tsx`
- `src/app/glossary/[slug]/error.tsx`
- `src/content/sources/strapi/published-glossary.ts`
- `src/content/sources/strapi/published-glossary-query.ts`
- `src/content/source.ts`, `src/content/index.ts` (two exports each)
- `docs/glossary-detail-cms-integration.md`
