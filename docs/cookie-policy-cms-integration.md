# Cookie Policy on the new CMS (`/cookie-policy`)

Branch `new-cms`, 5 Nov 2026. Frontend only: the CMS was read through its public API and never changed.

## Source and query

- Endpoint: the public new-CMS GraphQL (`NEW_CMS_GRAPHQL_URL`), no token, `status: PUBLISHED`. REST
  (`/api/cookie-policy`) is not used.
- `CookiePolicy` has the same fields as the Privacy Policy and Terms of Use single types (confirmed by
  validating the shared legal query against it): `lastUpdated`, `hero`, `sections` (Editorial Sections of
  flow blocks), `seo`, plus timestamps. There is no effective-date, contact or cookie-table field.
- `PublishedCookiePolicy` (`published-legal-query.ts`) is the shared legal field set **without**
  `seo.robot` and `seo.structuredData`. The CMS computes both, and on an entry with no `canonicalURL`
  its resolver throws `Invalid URL`, which would fail the whole read.
- `PublishedCookiePolicySeo` reads those two fields on their own, best effort: when it fails the page
  keeps its document and the rest of its SEO, with a warning; when the CMS returns them, they map as on
  the other legal pages. The Privacy Policy and Terms of Use queries are byte-identical to before.

## Mapping (the shared legal mapping, `mapLegal`)

| CMS                                                                                | Frontend (LongformPage, `family="article"`, unchanged)                                       |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `hero.title`                                                                       | H1                                                                                           |
| `hero.description`, `secondaryDescription`, `additionalParagraphs`                 | Lede paragraphs                                                                              |
| `lastUpdated`                                                                      | "Last updated: 20 October 2026" line under the lede                                          |
| `hero.breadcrumbs`                                                                 | Breadcrumb trail                                                                             |
| `sections[]` in order: `heading`, `anchorId`, `navigationLabel`                    | H2 bands and the "On this page" rail                                                         |
| `sections[].blocks` (prose Markdown, tables, labelled, links, sequence, callout …) | Shared flow mapping (paragraphs, lists, links, tables)                                       |
| `seo` + `seoSettings`                                                              | `entrySeo`: title, description, canonical, robots, Open Graph, Twitter; JSON-LD when present |

Loading and error states copy the Privacy Policy's (`loading.tsx`, `error.tsx`); no published entry → 404.

## Validation (5 Nov 2026)

- Live: 0 errors on the main query; 7 sections in CMS order; the rendered text matches the previous
  `_pages` rendering character for character (2,651 characters).
- Layout: 1440, 768 and 390 wide match `/privacy-policy` (reading column 734 / 704 / 326, rail shown),
  no horizontal scroll.
- Head: one title, description and canonical; robots, Open Graph and Twitter from the CMS.
- Reader paths: computed-SEO failure (live), computed SEO returned (JSON-LD rendered), missing date /
  heading / blocks / SEO (left out with warnings), no entry (404), CMS down (error page).

## CMS-side issues (not changed here)

- `seo.robot` and `seo.structuredData` throw `Invalid URL` when `canonicalURL` is empty. Setting the
  canonical (or fixing the resolver) lets the page read them.
- No `canonicalURL`: the page uses `seoSettings.siteURL` + route, `https://tcules.com/cookie-policy`; the
  `_pages` copy and the other legal pages use `https://www.tcules.com`.
- No Open Graph / Twitter blocks or image, so the Twitter card is `summary` (previously
  `summary_large_image`), and no structured data.
- Robots render `noindex, follow`: the global `seoSettings.allowIndexing` is `false` (same on every
  CMS-backed page); the entry itself says `index, follow`.
- Content differences from the `_pages` copy: the three cookie categories are no longer bold (no `**` in
  the Markdown); both Privacy Policy links are absolute `https://tcules.com/privacy-policy` and the first
  lost its `#sharing` anchor; section `anchorId`s end in `-heading` (e.g. `what-cookies-are-heading`), so
  heading ids render as `…-heading-heading` and old `#…-heading` links no longer land; the
  contact email is plain text, not a link (it was plain text before too).
- No SEO Page for `/cookie-policy` (not needed: the entry's own `seo` is used).
