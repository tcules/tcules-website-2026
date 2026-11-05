# Careers Master CMS integration

Audited and completed 5 November 2026 on `new-cms`, on top of the existing integration (`2d2471b5`). No CMS files, schemas, content, permissions or configuration changed.

## Query

`PublishedCareers`: `careerMaster(status: PUBLISHED)` from the public GraphQL endpoint (no token), verified against the live response. The shared hero is now read in full (`PUBLISHED_HERO`), so eyebrow, secondary/additional paragraphs, actions note, tags, stats, media, illustration, scene, clip and recognition reach `mapHero` instead of being dropped by a five-field selection. Jobs come only through the `ComponentSharedJobListing.jobs` relation: the public `jobs` collection query is forbidden, and nothing about a job is duplicated on the single type. SEO is the route-keyed `seoPages` entry for `/careers` (`getPageSeo`).

## Mapping (CMS order preserved)

| CMS block                                         | Presentation                                                                                                                                                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| hero                                              | PublishedHero: title, description, centred arrangement, breadcrumbs, "Apply for a role" → `#apply`. The eyebrow "Careers" repeats the trail's crumb, so `eyebrowBesideTrail` keeps it from printing twice |
| `ComponentSharedCollageSection` (`ahmedabad`)     | Collage, six CMS photographs with focus and zoom                                                                                                                                                          |
| `ComponentSharedEditorialSection`                 | ContentSection; `peer_columns` → two prose columns, `head_beside` → beside                                                                                                                                |
| `ComponentSharedOfferSheetSection` (`ai-fluency`) | OfferSheet list with the CMS action                                                                                                                                                                       |
| `ComponentSharedChecklistSection`                 | ListCard rows with CMS icons and the closing line                                                                                                                                                         |
| `ComponentSharedJobListing` (`open-roles`)        | Job rows: title, department, employment type, location. Each row links to `#apply` and preselects its role (`choiceValue`). Inactive or unpublished jobs are filtered out                                 |
| `ComponentSharedCta` (`apply`)                    | Blue form island: CMS heading, rich description, disclaimer, illustration (existing sketch-to-shipped drawing only when media is absent), and the application form                                        |
| `ComponentSharedFaqSection`                       | FAQ accordion of active questions                                                                                                                                                                         |

## Application form

Fields, validation, submission endpoint (`ENDPOINTS.enquiry`), hidden context and security are unchanged and frontend-controlled. From the CMS: form label, submit label, role question, role options (the listing's jobs in CMS order plus `otherRoleLabel`), whether the free-text field shows, `urlRequired`, and now:

- `urlLabel`: the CMS stores an enum key (`Link_to_the_work`), resolved to the form's typed label through the same list the home adapter uses. It previously had the same words hardcoded.
- `successHeading` / `successBody`: passed to the success view when both are set. Both are null today, so the form keeps its own thanks, and a warning is logged.

## SEO

Title, description, canonical, robots (`noindex,follow` from the CMS), Open Graph and Twitter/X come from `seoPages`. No duplicate tags. JSON-LD is emitted only when the CMS supplies it; it supplies none.

## Missing CMS data and mismatches

- Form `successHeading` and `successBody` are null, so an applicant sees the generic "Thanks. We have your enquiry."
- Jobs have no icon or department taxonomy. The row icon still comes from the template's existing department-name map, so a renamed or new department shows no icon.
- Jobs have no detail route, description or external apply URL. Every role links to the on-page form.
- No Open Graph or Twitter image and no structured data (e.g. JobPosting) on the `/careers` SEO entry. The corpus listed `og_image` as `IMAGE_ASSET_REQUIRED`.
- `urlLabel` is an enum key, not words. Only the form's existing typed labels can be chosen.
- The apply illustration has an empty `altText`, so it is treated as decorative.
- Editorial `links` blocks are queried but not rendered. The adapter throws on a non-prose editorial block, so authoring one would show the error page until the template supports it.

## Validation

- Production query (with the full hero) returns no errors.
- In Chrome at 390, 768, 1024 and 1440px: 200, no horizontal overflow, no page errors. One resource 404 at 390, a dev-server asset.
- Content order matches the CMS: ahmedabad, product-work, ai-fluency, what-we-look-for, open-roles, lab, apply, faq. All 8 headings, 6 collage images, 6 checklist items, 4 jobs, 6 FAQs, and the AI and Lab links render.
- Clicking a job row moves to `#apply` with that role selected. Role options are the 4 job `choiceValue`s plus `no-matching-role`. The link field is labelled "Link to the work" from the CMS enum.
- An empty submit is blocked by validation (role, email, link invalid) and sends no request. A real submission was not sent, because it posts to the live enquiry endpoint.
- Head: one title, one canonical, robots, OG and Twitter tags, no duplicates, no JSON-LD.
- Not exercised with live data: an empty job listing, since the CMS has four active jobs and its content was not changed.

## Changed files

- `src/content/sources/strapi/published-careers-query.ts`: full shared hero
- `src/content/sources/strapi/published-careers.ts`: `urlLabel` and success copy mapping
- `src/content/sources/strapi/home.ts`: `formUrlLabels` exported
- `src/templates/CorpusPage/published-careers-model.ts`, `src/templates/CorpusPage/PublishedCareers.tsx`: CMS `urlLabel` and success copy in place of the hardcoded label
- `docs/careers-cms-integration.md`
