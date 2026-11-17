# Resources detail CMS integration

Validated 5 November 2026 on `new-cms`. Frontend-only work; no CMS files, schema, permissions, or content changed. `/insights` and author route implementations remain unchanged. Three Events records retain their dedicated existing route; this integration covers the 117 published Articles, Guides, and Videos. Research is supported and fixture-tested, but has no published record.

## Queries and mapping

Unauthenticated POSTs to `https://tcules-cms-2026-production.up.railway.app/graphql`:

- `PublishedResource($slug: String!)`: exact slug filter, `status: PUBLISHED`, one record; authors/coauthors, Resource Type, topics, industries, Stage, expertise, thumbnail, complete Dynamic Zone, related Resources, CTA, embedded SEO, and public SEO settings.
- `PublishedResourceImage($slug: String!)` and `PublishedResourceVideo($slug: String!)`: fetch only the configured banner variant after reading `banner.variant`.
- Requests share the existing public GraphQL helper, React request memoization, 8-second timeout, and five-minute fetch revalidation. No token is read or sent. Missing/unpublished records return 404; upstream failures return an error boundary with retry rather than old content.

| CMS data                                                                                                   | Existing presentation                                                                                               |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Title, description/additional paragraphs, breadcrumb, byline, publication/modification dates, reading time | PageHero                                                                                                            |
| Resource Type, topics, industries, Stage, expertise                                                        | CMS breadcrumb/eyebrow and taxonomy labels                                                                          |
| Banner image / YouTube URL                                                                                 | PageHero image / watch arrangement; YouTube also respected on non-Video records when configured                     |
| Heading, anchorId, navigationLabel                                                                         | H2, unchanged CMS anchor, TableOfContents label                                                                     |
| Markdown, imported HTML                                                                                    | Prose; existing Markdown renderer retained for ordinary content, Marked + sanitize-html for HTML/media/nested lists |
| Separator, Callout                                                                                         | Prose rule, Callout with authored label/body/icon                                                                   |
| Figures and nested image/caption/label/note/notes                                                          | Figure or bare Media when caption absent, with remaining authored annotations                                       |
| DataTable                                                                                                  | Existing DataTable, nested columns/rows/cells, rich cell formatting                                                 |
| FAQ and related FAQ records                                                                                | Existing Accordion in the document position                                                                         |
| Author/coAuthors                                                                                           | Hero credits and Contributors; CMS portrait/name/designation/biography/LinkedIn/author URL                          |
| Key takeaways                                                                                              | Callout before ordered body                                                                                         |
| otherResources heading/description/anchor/selection                                                        | InsightResources; up to three selected records in CMS order, self/duplicate selections excluded with warnings       |
| CTA/button/secondary action/media/form configuration                                                       | Existing PublishedSection CTA renderer                                                                              |

Dynamic Zone order is preserved without sorting. The published content includes 1,318 Markdown components, 827 Heading components, 625 Separators, 99 Callouts, 47 Figures components, two DataTables, and one FAQ. No old CMS response format or corpus content is used for this route, including CPQ.

Runtime dependencies `marked` and `sanitize-html` are necessary for the actual mixed Markdown/HTML content in five records. HTML headings and anchor IDs, tables, links, lists, and formatting survive; scripts, event handlers, styles, unsafe URL protocols, and unapproved iframe origins are removed. Embedded Markdown images are supported. Ordinary Markdown keeps the existing quote/cite rendering.

## SEO

Each record supplies its own title, description, canonical, robots, Open Graph title/description/image/alt/type/URL/site/locale, Twitter card/title/description/image/alt/handles, keywords, language alternates, and structuredData. Authored publication/modification dates and authors are mapped. The existing Next metadata API and shared canonical/image validator render the head; one escaped JSON-LD script renders the CMS structuredData object. Legacy codeJson/graphCode are not emitted as extra scripts.

The record's current CMS route is authoritative when imported canonical/OG URLs name an obsolete path; the configured origin is retained. Missing canonicals use the CMS siteURL and current resource route, with a warning. No hardcoded domain is introduced. Query/hash/trailing-slash variants are removed. CMS `allowIndexing=false` and all current resource robots values `noindex,follow` are respected.

## Illustration and missing-media behavior

No local photo, banner, video, thumbnail, author portrait, text, or CTA copy is substituted for missing CMS data. Ninety records have no banner configured; 14 have image banners and 13 have YouTube banners (seven Videos and six Articles). These are rendered as configured. The existing data-derived initials treatment remains for authors without portraits.

Related cards without an uploaded cover retain only the existing format-glyph illustration panel. There are eight distinct selected Resources using that illustration fallback:

- `/insights/best-healthcare-ux-design-agencies-for-clinical-software`
- `/insights/best-design-system-agencies-and-consultants`
- `/insights/best-fintech-ux-design-agencies`
- `/insights/loan-origination-and-lending-app-ux`
- `/insights/software-modernization-companies-how-to-compare-them`
- `/insights/search-ux-in-data-heavy-saas`
- `/insights/elearning-and-edtech-ux-design-agencies`
- `/insights/usability-studies-for-complex-enterprise-software`

No enquiry-form illustration fallback is used by the current resource records. Existing corpus placeholder media is not used as a fallback for missing CMS media.

## CMS mismatches and outstanding content review

- Both inactive `banner.image` and `banner.youtubeUrl` are non-null in GraphQL although the unused field contains null. Selecting both produces GraphQL errors. Variant-specific optional reads work around this without CMS changes.
- Resources expose shared `seo`, but not the `resolvedSeo` field used by Case Studies. The adapter maps the verified typed fields and existing public site SEO settings.
- No published Research records; production Research content cannot be validated until one exists.
- `stage` is unconfigured on all 117 records. This is missing relationship data, not a missing API field; no label is invented.
- Author profile pictures are missing for `yash-gidwani`, `chirag-patel`, `rishabh-choudhary`, `varun-mashru`, and `anshu-jain`. Initials use the CMS name; no local team photo is substituted.
- `otherResources.items` is empty and `otherResources.presentation` is unset in all published selections. The current frontend renders selected Resource cards; custom resolved rows are not part of this template and generate a warning if configured later.
- Thirteen records lack canonicalURL (listed below); two records have stale canonical/OG paths. The latter are normalized in rendered metadata, but their CMS JSON-LD still contains the original stale self URLs and is preserved for CMS review:
  - `/insights/silent-ui-regression-debt-erodes-adoption-before-it-shows`: CMS canonical/JSON-LD point to `/blog/silent-ui-regression-debt-erodes-adoption-before-it-shows`.
  - `/insights/ux-ui-designer-vs-design-engineer`: CMS canonical/JSON-LD point to `/insights/designer-vs-design-engineer`.
- CMS siteURL is `https://tcules.com`, while most authored canonicals/JSON-LD use `https://www.tcules.com`; the bare domain currently redirects to www. Missing canonical records therefore inherit the configured bare host. Align the CMS site setting and record SEO separately; the frontend does not hardcode a replacement host.

Records missing canonicalURL:

- `/insights/8-proven-strategies-to-boost-saas-user-engagement-and-subscriptions`
- `/insights/building-trust-and-transparency-in-ai-first-user-interfaces`
- `/insights/cognitive-biases-in-ecommerce-and-saas-products`
- `/insights/design-thinking-vs-cx-vs-ux-explained`
- `/insights/experiments-with-ux-karthik-pasupathy-context-clarity-core-functionality`
- `/insights/guides/inclusive-product-design-for-older-and-disabled-people`
- `/insights/guides/landing-page-design-guide-to-boost-conversions`
- `/insights/guides/marketing-automation-software-design-best-practices`
- `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`
- `/insights/my-experiments-with-ux-aishwarya-ashok-on-ux-evolution-from-traditional-to-ai-first-products`
- `/insights/videos/generative-ai-product-patterns-for-saas`
- `/insights/videos/saas-uxx-faq-does-your-saas-app-need-a-mobile-version`
- `/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates`

The following CMS-authored in-page links name no current heading ID. They remain unchanged rather than guessing a destination:

- `/insights/ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input`: `#one-field-two-modes-our-eden-ai-redesign`
- `/insights/compare-two-interaction-models-at-equal-depth`: `#running-the-comparison`
- `/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product`: `#complex-saas-already-live`, `#questions-to-ask`
- `/insights/best-fintech-ux-design-agencies`: `#tcules-payments`
- `/insights/elearning-and-edtech-ux-design-agencies`: `#course-content`
- `/insights/software-modernization-companies-how-to-compare-them`: `#product-and-workflow-layer`

The shared navigation also links to `/insights/guides/how-to-choose-a-product-design-agency`, which has no published Resource in this CMS snapshot. Navigation and listing changes are outside this phase. All 11 related author URLs return 200.

## Validation

- Public query and adapter checked against every published in-scope record; complete block sequence and related selection order compared with actual GraphQL responses.
- Production webpack build and `npm run verify` completed successfully.
- All 117 rendered pages return 200; missing/unpublished fixture URLs return 404. Upstream GraphQL failure fixture returns 500 with route error handling; the retry button successfully recovers after the upstream is restored.
- Rendered HTML checked for unique record metadata, canonical/OG agreement, robots, social image URLs, one exact CMS JSON-LD object, unique element IDs, valid ARIA references, author links, YouTube IDs, body headings and related-card order.
- All 117 routes checked at 390, 768, 1024 and 1440px: 468 layout checks, no horizontal page overflow or page runtime errors. TOC navigation exercised; representative Article/Guide/Video views visually inspected.
- All 174 distinct configured image URLs responded successfully.
- Build-wide ARIA check passed: 280 prerendered pages and 5,927 ID references. The 117 dynamic resource pages were checked separately in their rendered HTML.
- Research fixture checked hero absence without a media fallback, nested lists, safe embedded images/HTML, heading hierarchy/custom anchor/navigation label, related selections, extended robots options, canonical normalization, safe JSON-LD, responsive widths, unpublished content and upstream errors.
- Browser console messages from outside this integration remain: the existing missing `/favicon.ico` (404) and YouTube iframe `compute-pressure` permissions-policy messages. No application runtime errors were observed. Playback itself was not exercised.

## Validated published routes

- `/insights/8-proven-strategies-to-boost-saas-user-engagement-and-subscriptions` — Articles
- `/insights/accepting-ai-generated-front-end-code-what-review-is-for-now` — Articles
- `/insights/age-inclusive-products-ten-examples` — Articles
- `/insights/agent-friendly-ui-what-breaks-when-ai-agents-use-your-saas` — Articles
- `/insights/agentic-ux-design-principles-for-ai-agents-that-act-on-behalf-of-users` — Articles
- `/insights/ai-agent-governance-admin-console-checklist` — Articles
- `/insights/ai-chatbot-ux-design-best-practices-for-b2b-products` — Articles
- `/insights/ai-design-to-code-tools-for-product-teams` — Articles
- `/insights/ai-feature-billing-and-usage-ux` — Articles
- `/insights/ai-interface-design-what-changes-when-the-interface-is-generated` — Articles
- `/insights/ai-product-design-is-not-a-prompt-problem-it-is-a-context-architecture-problem` — Articles
- `/insights/ai-product-trust-observability-or-explainability` — Articles
- `/insights/ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input` — Articles
- `/insights/ai-trust-control-human-review-examples` — Articles
- `/insights/are-vibe-coded-apps-scalable` — Articles
- `/insights/b2b-saas-design-systems-worth-studying` — Articles
- `/insights/best-design-system-agencies-and-consultants` — Articles
- `/insights/best-healthcare-ux-design-agencies-for-clinical-software` — Articles
- `/insights/building-on-shadcn-what-your-design-system-still-needs-to-define` — Articles
- `/insights/building-trust-and-transparency-in-ai-first-user-interfaces` — Articles
- `/insights/cognitive-biases-in-ecommerce-and-saas-products` — Articles
- `/insights/compare-two-interaction-models-at-equal-depth` — Articles
- `/insights/confidence-scores-dont-fix-trust-when-review-step-never` — Articles
- `/insights/cpq-ux-design` — Articles
- `/insights/design-system-as-a-service` — Articles
- `/insights/design-system-governance-models-who-decides-and-how` — Articles
- `/insights/design-system-maturity-model-where-your-team-sits-and-what-comes-next` — Articles
- `/insights/design-system-tools-for-saas` — Articles
- `/insights/design-systems-for-saas-boosting-efficiency-and-ux-consistency` — Articles
- `/insights/design-thinking-vs-cx-vs-ux-explained` — Articles
- `/insights/design-tokens-explained-for-product-leaders` — Articles
- `/insights/designing-one-component-many-brands-can-reuse` — Articles
- `/insights/designing-one-interface-for-novice-and-expert-users` — Articles
- `/insights/does-your-saas-product-sound-like-your-landing-page` — Articles
- `/insights/ecommerce-ux-audit-for-magento-and-shopify-stores` — Articles
- `/insights/elearning-platform-ux-what-learners-and-administrators-need` — Articles
- `/insights/enterprise-ux-design-principles-for-complex-workflow-software` — Articles
- `/insights/experiments-with-ux-karthik-pasupathy-context-clarity-core-functionality` — Articles
- `/insights/figma-plugin-or-design-system-audit-what-a-tool-finds-and-misses` — Articles
- `/insights/figma-storybook-alignment-tools` — Articles
- `/insights/fintech-ux-designing-for-trust-compliance-and-speed` — Articles
- `/insights/generative-ai-ecommerce-use-cases` — Articles
- `/insights/generative-ai-product-patterns-for-saas` — Articles
- `/insights/guides/design-agency-or-in-house-designer` — Guides
- `/insights/guides/figma-to-react` — Guides
- `/insights/guides/how-to-assess-legacy-system-modernisation-readiness-a-20-question-checklist` — Guides
- `/insights/guides/how-to-audit-a-design-system` — Guides
- `/insights/guides/how-to-use-a-ux-product-audit` — Guides
- `/insights/guides/inclusive-product-design-for-older-and-disabled-people` — Guides
- `/insights/guides/landing-page-design-guide-to-boost-conversions` — Guides
- `/insights/guides/legacy-software-modernisation` — Guides
- `/insights/guides/marketing-automation-software-design-best-practices` — Guides
- `/insights/guides/saas-dashboard-design` — Guides
- `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention` — Guides
- `/insights/guides/saas-ux-audit-checklist` — Guides
- `/insights/guides/vibe-coded-app-security-checklist` — Guides
- `/insights/guides/working-with-a-ui-ux-design-studio-in-india` — Guides
- `/insights/healthcare-ux-design-for-clinicians-patients-and-regulators` — Articles
- `/insights/heuristic-evaluation-services-what-you-should-get-and-when-it-is-enough` — Articles
- `/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product` — Articles
- `/insights/how-do-you-outsource-ux-design-without-losing-product-knowledge` — Articles
- `/insights/how-do-you-redesign-legacy-enterprise-software-without-upsetting-users` — Articles
- `/insights/how-much-does-mvp-design-and-development-cost` — Articles
- `/insights/how-should-an-ai-product-let-users-choose-a-model` — Articles
- `/insights/how-to-add-ai-to-an-existing-saas-product-what-to-fix-first` — Articles
- `/insights/how-to-choose-a-front-end-development-agency-for-a-saas-product` — Articles
- `/insights/how-to-choose-a-ux-audit-agency-10-questions-to-ask-before-you-sign` — Articles
- `/insights/how-to-design-ux-for-ai-products-a-readiness-checklist` — Articles
- `/insights/how-to-hire-a-product-designer-for-your-saas-product` — Articles
- `/insights/human-in-the-loop-ux-patterns` — Articles
- `/insights/insurtech-product-design-quoting-claims-and-producer-payouts` — Articles
- `/insights/is-heavy-feature-usage-a-good-sign-usage-data-workarounds` — Articles
- `/insights/is-your-saas-real-competitor-a-spreadsheet` — Articles
- `/insights/lab-and-life-science-software-ux` — Articles
- `/insights/loan-origination-and-lending-app-ux` — Articles
- `/insights/lovable-app-security-and-production-issues-what-to-fix-first` — Articles
- `/insights/my-experiments-with-ux-aishwarya-ashok-on-ux-evolution-from-traditional-to-ai-first-products` — Articles
- `/insights/object-oriented-ux-when-a-saas-product-needs-it` — Articles
- `/insights/prevent-duplicate-records-search-first-create-flow` — Articles
- `/insights/rebuild-or-modernize-legacy-software` — Articles
- `/insights/redesign-a-live-saas-product` — Articles
- `/insights/replatforming-vs-refactoring-vs-redesign` — Articles
- `/insights/saas-customer-onboarding-software` — Articles
- `/insights/saas-features-page-product-architecture-or-customer-journey` — Articles
- `/insights/saas-user-engagement-platforms` — Articles
- `/insights/should-an-ai-product-replace-its-dashboard-with-chat` — Articles
- `/insights/should-designers-write-prompts-with-ml-engineers` — Articles
- `/insights/silent-ui-regression-debt-erodes-adoption-before-it-shows` — Articles
- `/insights/staffing-and-recruitment-software-ux` — Articles
- `/insights/urgent-feature-request-quick-fix-or-reusable-feature` — Articles
- `/insights/user-research-when-your-real-users-cannot-take-part` — Articles
- `/insights/ux-audit-vs-heuristic-evaluation` — Articles
- `/insights/ux-debt-how-to-measure-it-and-pay-it-down` — Articles
- `/insights/ux-ui-designer-vs-design-engineer` — Articles
- `/insights/vibe-code-cleanup-specialist-guide` — Articles
- `/insights/vibe-coded-app-production-ready` — Articles
- `/insights/videos/do-ai-not-for-ai-sake-but-for-your-user-insights-from-eden-ai-ctpo` — Videos
- `/insights/videos/generative-ai-product-patterns-for-saas` — Videos
- `/insights/videos/how-ux-teams-tackle-urgent-feature-requests-design-challenge` — Videos
- `/insights/videos/mastering-design-decisions-insights-for-founders-pms-and-designers` — Videos
- `/insights/videos/saas-uxx-faq-does-your-saas-app-need-a-mobile-version` — Videos
- `/insights/videos/strategic-messaging-for-saas-alex-napier-holland` — Videos
- `/insights/videos/when-a-product-designer-moves-to-bollywood-filmmaking-workshop` — Videos
- `/insights/what-a-designer-should-understand-about-your-business-before-designing` — Articles
- `/insights/what-a-saas-mvp-must-prove-and-what-to-leave-out` — Articles
- `/insights/what-does-a-product-design-agency-do` — Articles
- `/insights/what-product-designers-can-learn-from-filmmaking` — Articles
- `/insights/when-to-hire-a-design-system-consultant` — Articles
- `/insights/when-to-prototype-in-code-instead-of-figma` — Articles
- `/insights/who-can-audit-your-saas-onboarding-flow` — Articles
- `/insights/best-fintech-ux-design-agencies` — Articles
- `/insights/best-saas-ui-ux-design-agencies` — Articles
- `/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates` — Articles
- `/insights/usability-studies-for-complex-enterprise-software` — Articles
- `/insights/search-ux-in-data-heavy-saas` — Articles
- `/insights/elearning-and-edtech-ux-design-agencies` — Articles
- `/insights/software-modernization-companies-how-to-compare-them` — Articles

## Changed files

- `docs/specs/Contributors.md`
- `package-lock.json`
- `package.json`
- `src/app/design/contributors/page.tsx`
- `src/app/insights/[...slug]/page.tsx`
- `src/content/index.ts`
- `src/content/source.ts`
- `src/patterns/Contributors/Contributors.tsx`
- `src/templates/ListingIndex/resources.tsx`
- `docs/resource-detail-cms-integration.md`
- `src/app/insights/[...slug]/error.tsx`
- `src/content/sources/strapi/published-resource-query.ts`
- `src/content/sources/strapi/published-resource.ts`
- `src/content/sources/strapi/resource-markdown.ts`
- `src/content/sources/strapi/resource-seo.ts`

All changes remain uncommitted on `new-cms`. No listing or author route source file was edited.
