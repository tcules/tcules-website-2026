# Sitemap and How We Work on the new CMS

Branch `new-cms`. The three routes were connected in `d1464746`; this note records the audit and
hardening pass of 5 Nov 2026. Frontend only: the CMS was read through its public API and never changed.

| CMS                         | Route                      | Query                             |
| --------------------------- | -------------------------- | --------------------------------- |
| Sitemap Master (single)     | `/sitemap`, `/sitemap.xml` | `PublishedSitemap`                |
| How We Work Master (single) | `/how-we-work`             | `PublishedWorkMaster`             |
| How We Work (collection)    | `/how-we-work/{slug}`      | `PublishedHowWeWorkDetail($slug)` |

All in `src/content/sources/strapi/published-work-query.ts` / `published-work.ts`.

## `/sitemap` and `/sitemap.xml`

- `resolvedGroups` is the CMS's own resolution of each `ComponentSharedSitemapGroup`: its relations to
  published records plus its `additionalLinks`, merged and ordered. The page and the XML both read it, so
  they never disagree. Hierarchy comes from each entry's `parentPath` (a service and its offers read as
  one branch).
- Entries are kept in CMS order; one with no title or no root-relative path, and a path already listed,
  are left out with a warning; a group with no label or no pages is skipped. Section anchors are the
  CMS `anchorId`s.
- `/sitemap.xml`: when the Sitemap Master cannot be read or lists nothing, the generator the site used
  before (`_sitemap/pages.ts`) answers, so the XML is never empty and never an error (it was `[]` / a
  failed route before this pass).
- SEO: the SEO Page for `/sitemap`; JSON-LD when present.

## `/how-we-work` and `/how-we-work/{slug}`

- Both zones allow the same nine members, all queried: Client Grid, Illustrated Section, Editorial,
  Comparison, Offer Sheet, Engagement Options, Testimonials, CTA, FAQ.
- Neither type has its own `seo` field, so each page's <head> is the SEO Page for its path
  (`/how-we-work`, `/how-we-work/{slug}`); JSON-LD when present.
- The master links to records through the Offer Sheet's `relatedPages` (resolved by the CMS to
  `/how-we-work/{slug}`) and inline links in its copy; record content is never repeated on the master.
- `/how-we-work/{slug}` reads the record by slug; a malformed or unpublished slug is the site's
  not-found page (titled "Page not found | Tcules", noindex). The two published slugs also keep their
  own static route files, which render the same record.

| CMS member                              | Frontend                                                             | `data-band`        |
| --------------------------------------- | -------------------------------------------------------------------- | ------------------ |
| Hero                                    | `PublishedHero`                                                      | A                  |
| Client Grid                             | `LogoGrid` compact                                                   | H                  |
| Illustrated Section (`situation_cards`) | `GatewayPaths` cards + closing line                                  | C-router           |
| Editorial / Comparison                  | `ContentSection` prose, or `DataTable` when a table block is present | C-text / E         |
| Offer Sheet (`split_list` / `plain`)    | `OfferSheet` list / grid, related page as its link                   | offer-sheet        |
| Engagement Options (`cards` / `grid`)   | `EngagementOptions` (icon or CMS illustration)                       | engagement-options |
| Testimonials, FAQ                       | shared `PublishedSection`                                            | G, D-faq           |
| CTA (`form_island`)                     | blue enquiry island with `EnquiryForm`                               | L                  |

## What the hardening pass changed

- No missing piece takes a page down: logos without media show by name; entries, items, blocks and
  sections that cannot render are left out; a missing `anchorId` gets a stable id (was
  `undefined-heading`); an Illustrated closing block that is not prose no longer prints "undefined".
  Each logs `New CMS <route>: …`.
- Engagement options now pass the CMS's illustration image (else its scene), eyebrow, scope, facts,
  lead, terms and action through — all empty today, so today's render is unchanged.
- `routePath` is checked on all three types; hero stats without a label or value and unknown icons are
  dropped with a warning.
- `/how-we-work/{slug}` now renders the SEO Page's JSON-LD like the other routes.

## Validation (5 Nov 2026)

- Live queries: 0 errors. Each How We Work page rendered beside its pre-CMS corpus composition at 1440
  and 390: same bands, grounds, image counts, heights, text and links (5,684 / 6,292 / 3,348 characters).
  `/sitemap` has the same structure as before; its list differs only where the old generator was stale.
- Sitemap: 254 links, no duplicates, every one returns 200. `/sitemap.xml`: 254 URLs with `lastmod`;
  falls back to 249 when the Sitemap Master errors or is empty.
- SEO: one title, description and canonical per page; robots, Open Graph and Twitter from the SEO Pages.
- Degraded payloads, empty / null entries, CMS down (error page) and invalid slugs behave as above.

## Issues outside this change

- The old generator (`_sitemap/pages.ts`, now the XML fallback) is stale: it misses `/why-tcules`,
  `/audits`, `/expertise`, `/glossary`, `/tools`, `/cookie-policy` and both How We Work pages, and lists
  `/audits/product-modernisation-test`, `/audits/prototype-hardening-review` and
  `/expertise/fintech-insurtech` (the last two redirect).
- Not-found pages on routes with a `loading.tsx` answer HTTP 200 with `noindex` (dev server, also for
  Googlebot), site-wide — `/services/does-not-exist` does the same.
- There is no `robots.txt` (`/robots.txt` is 404).
- SEO Pages: all four are `noindex,follow`; none has structured data or a social image.
- The master's "How we use AI in our own work" Offer Sheet relates to both records, but the band shows one
  link (the first, as the page always has); AI Transparency is reached from an inline link in the copy.
