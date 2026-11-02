# Insights rich text: inventory (TRACKER 2.44, step 1)

Read-only tally of every live insight body in Strapi, taken 1 Nov 2026 from
`https://tcules-server-production.up.railway.app/graphql` (status PUBLISHED, no pagination cap hit).
The real `markdownToHtml` (`src/content/sources/strapi/markdown.ts`) was run over every body field and
its output checked for leftover markup. Raw working files are not committed.

## What is live

| Collection | Published | Route | Body fields |
|---|---|---|---|
| blogs (`blogType` Articles 81, Guides 14, Videos 7) | **102** | `/insights/<slug>` (slug may carry `guides/` or `videos/`) | `mainSection` dynamic zone |
| events | **3** | `/insights/events/<slug without events/>` | `mainSection` |
| podcasts | 0 | `/insights/podcasts/<slug>` | none live |
| interviews | 0 | no detail route | none live |

105 routes in all. `/insights/cpq-ux-design` is served by the corpus (`PASS_1_LONGFORM_ROUTES`), not by
Strapi, so 104 render through the Strapi mappers. The hub query caps blogs at 100, so two live
articles are reachable by URL but missing from `/insights`: `generative-ai-ecommerce-use-cases`,
`user-research-when-your-real-users-cannot-take-part` (oddity, outside 2.44's scope).

**Every body is Markdown.** No live entry uses `ComponentSharedRichText` (Strapi blocks JSON) or
`ComponentBlogAndCasestudiesCodeSection`. The queries already ask for every member of all four
dynamic-zone unions (checked by introspection), so nothing live is silently unqueried.

## Dynamic-zone blocks

| Block | Count | Pages | Renders today | Gap |
|---|---|---|---|---|
| `BlogOrCasestudyText.blogContent` (Markdown) | 1162 | 105 | `markdownToHtml` → `Prose` | see Markdown table |
| `Sepration` (`styles: solid`, every other field null) | 529 | 102 | `<hr>` in its own `Prose` | always sits between two text blocks; faithful |
| `Iframe`, title only (the date / reading-time line) | 102 | 102 | consumed as `publishedContent`, never rendered in the body | none |
| `Iframe` with `embedCode` = inline SVG `<figure>` (4.3 KB, `style=` attrs, no `src`) | 1 | `/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates` | `embedUrl` finds no `src`, no thumbnail → falls back to `<p>The argument in one view</p>` | **the diagram is dropped**; only its title shows |
| `TldrSection` (heading always "Insights", body Markdown paragraphs; 5 carry links) | 85 | 85 | `calloutHtml` → `Callout` | none (heading "Insights" on all 85 is the CMS's own label) |
| `SectionImage` (`layout: default`, 1 image each) | 47 | 11 | `figures` → `Layout` of `Figure` | **46 of 47 have no alt and 47 of 47 no caption**: the mapper shows an invented visible caption `"<title> — article image N"` and the same string as alt |
| `Video` (YouTube URL in `title`, no file, no description) | 13 | 13 | one per article, so every one becomes the `PageHero` YouTube media | none |
| `ShadowCard` (events/podcasts) | 0 | – | mapped | not live |
| `SharedRichText` (blocks JSON) | 0 | – | `richTextToHtml` | not live |
| `CodeSection` | 0 | – | `<pre><code>` | not live |

## Markdown constructs (1247 fields: 1162 bodies + 85 TL;DRs)

| Construct | Count | Pages | Renders today | Example routes |
|---|---|---|---|---|
| `##` h2 | 707 | 102 | `<h2 id="toc-n">`, fed to the TOC | `/insights/guides/vibe-coded-app-security-checklist` |
| `###` h3 | 313 | 41 | `<h3>`; 3 articles open at h3 (events, two videos) | `/insights/agentic-ux-design-principles-for-ai-agents-that-act-on-behalf-of-users` |
| `####` h4 | 8 | 1 | `<h4>` | `/insights/human-in-the-loop-ux-patterns` |
| h1 / h5 / h6 / setext / skipped level across an article | 0 | – | (h1 would clamp to h2) | – |
| Bullet list | 1072 items | 84 | `<ul>` | `/insights/saas-customer-onboarding-software` |
| Ordered list | 298 items | 51 | `<ol>`; no live list starts at ≠1 or is split by blank lines | `/insights/ux-audit-vs-heuristic-evaluation` |
| Task list `- [ ]` | 74 | 8 | box dropped, reads as a bullet (by design) | `/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product` |
| Nested / indented lists, multi-paragraph items | 0 | – | – | – |
| Blockquote | 40 quotes (85 lines) | 13 | `<blockquote><p>` with every line joined | `/insights/videos/strategic-messaging-for-saas-alex-napier-holland` |
| …multi-paragraph quote (`>` blank line, attribution after it) | 22 | 9 | **joined into one `<p>`**: the attribution runs on after the quote | `/insights/videos/mastering-design-decisions-insights-for-founders-pms-and-designers`, `/insights/guides/working-with-a-ui-ux-design-studio-in-india` |
| …bold-led quote line (`> **Name, role**`) | 5 | 4 | joined as above | `/insights/best-fintech-ux-design-agencies` |
| GFM table | 184 tables | 82 | `<table>` in `Prose`, first column `th scope=row` | `/insights/guides/vibe-coded-app-security-checklist` |
| …widths | 2 col 37 · 3 col 96 · 4 col 40 · 5 col 6 · 6 col 5 | | | |
| …with links / bold / inline code in cells | 47 / 17 / 9 | 32 / – / 5 | rendered | `/insights/figma-storybook-alignment-tools` |
| …empty column head (top-left) | 6 | 6 | empty `<th>` | `/insights/when-to-prototype-in-code-instead-of-figma` |
| …empty row-header cell | 2 | 2 | empty `<th scope=row>` | `/insights/what-a-saas-mvp-must-prove-and-what-to-leave-out` |
| …alignment colons, escaped pipes, ragged rows | 0 | – | – | – |
| Thematic break `---` in a body | 2 | 1 | `<hr>` | `/insights/silent-ui-regression-debt-erodes-adoption-before-it-shows` |
| Code fence / indented code | 0 | – | – | – |
| `**bold**` | 1299 | 86 | `<strong>` | everywhere |
| `*italic*` / `_italic_` | 46 / 7 | 21 / 2 | `<em>` | `/insights/guides/figma-to-react` |
| `***bold italic***`, `~~strike~~`, `==mark==`, footnotes, math | 0 | – | – | – |
| Inline code | 66 | 13 | `<code>` | `/insights/guides/vibe-coded-app-security-checklist` |
| **Bold or italic wrapping a link** `**[label](url)**` | 28 | 3 | **literal `**` shown**: `renderInline` splits on the link so neither half finds its pair | `/insights/saas-customer-onboarding-software`, `/insights/saas-user-engagement-platforms`, `/insights/ai-interface-design-what-changes-when-the-interface-is-generated` |
| Marks inside a link label `[**x**](…)`, `` [`x`](…) `` | 8 | 6 | rendered | `/insights/when-to-hire-a-design-system-consultant` |
| Link, external http(s) | 1486 | 96 | `<a href>` | everywhere |
| Link, absolute `https://www.tcules.com/…` | 508 | 98 | `<a href>` kept absolute (on a preview deploy it leaves for production) | `/services` 97, `/case-studies` 74, `/audits` 45, `/insights/guides` 38, `/glossary` 22, `/tools` 21, `/insights/authors/*` 8 (no route) |
| **Link, in-page anchor `#slug`** | 40 | 9 | `<a href="#…">`, but headings only carry `toc-n` ids (h2) or none, so **no anchor resolves** | `/insights/best-saas-ui-ux-design-agencies` (22), `/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product` (7), `/insights/best-fintech-ux-design-agencies` (5) |
| Link, root-relative / mailto / tel / reference-style / autolink `<url>` | 0 | – | – | – |
| Inline image `![]()` | 0 | – | would throw (build-breaking) | – |
| Raw HTML in Markdown | 0 | – | would be escaped and shown | – |
| HTML entities | 0 | – | – | – |
| Escaped characters `\.` etc. | 49 | 6 | unescaped correctly | `/insights/vibe-coded-app-production-ready` |
| Hard break, two trailing spaces | 18 | 3 | 16 sit before a blank line (no effect); **2 mid-paragraph lose the break** | `/insights/guides/working-with-a-ui-ux-design-studio-in-india` |

## Oddities in the source

| Oddity | Count | Pages | Effect today | Example |
|---|---|---|---|---|
| U+2028 line separator at a line end | 10 | 1 | on 2 heading lines it defeats the heading regex (`.` stops at U+2028): **`### Example: …` shows as a paragraph with the hashes visible** | `/insights/building-trust-and-transparency-in-ai-first-user-interfaces` |
| U+200D zero-width joiner as a whole line | 8 lines | 3 | renders an invisible `<p>`, adding one paragraph gap | `/insights/guides/marketing-automation-software-design-best-practices` |
| Empty `<p>` in output | – | 5 | an extra gap | `/insights/cognitive-biases-in-ecommerce-and-saas-products` |
| U+00A0 no-break space | 63 | several | harmless | `/insights/cognitive-biases-in-ecommerce-and-saas-products` |
| Image alt is a file name | 0 | – | – | – |
| Article with no h2 (no TOC) | 3 | events only | no rail, by design | `/insights/events/product-design-and-filmmaking` |

## Gaps to close (what step 2 should fix, all in the Strapi seam)

1. **Bold/italic around a link** shows literal asterisks (28, 3 pages). Fix in `markdown.ts`: apply marks over the whole line with links protected as placeholders, rather than per slice.
2. **In-page `#anchor` links** never resolve (40, 9 pages). Headings need an id the author's anchor can hit: a slug of the heading text on every heading level, alongside (or instead of) `toc-n`, without breaking the TOC.
3. **Multi-paragraph blockquotes** collapse into one paragraph (22 quotes, 9 pages). Split on `>` blank lines into several `<p>` inside the one `<blockquote>`; Prose already spaces `blockquote > * + *`. Whether the trailing attribution should become `<cite>` (Prose styles `blockquote cite`) is an open question.
4. **Images carry an invented visible caption** (46 of 47 have no alt, none a caption). Read the upload's `caption` field (not queried today) for the caption; never show a made-up one. Open question: `Figure` requires a caption string, so what renders for an image with neither? Also no alt is an accessibility gap for content to fill.
5. **The one SVG embed** (`/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates`) is dropped. Open question: render the authored SVG (it is our own diagram, with a `<p>` text alternative) via a sanitised inline path, or ask content to upload it as an image.
6. **U+2028 / U+200D** in source: normalise U+2028 to `\n` and drop lines that are only zero-width characters before parsing.
7. **Mid-paragraph hard breaks** (2): honour two trailing spaces as `<br>`.
8. Out of scope, logged: the hub's 100-blog cap hides 2 live articles; 8 links point at `/insights/authors/*`, which has no route; absolute `tcules.com` links could be made root-relative at the seam.

Everything else live (headings h2–h4, bullet/ordered/task lists, single-paragraph quotes, all 184
tables, inline code, bold, italic, escaped characters, all links, separators, TL;DR callouts, hero
videos) already renders faithfully through `Prose`, `Callout`, `Figure` and `PageHero`.

## All 105 live routes
```
/insights/8-proven-strategies-to-boost-saas-user-engagement-and-subscriptions
/insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates
/insights/accepting-ai-generated-front-end-code-what-review-is-for-now
/insights/age-inclusive-products-ten-examples
/insights/agent-friendly-ui-what-breaks-when-ai-agents-use-your-saas
/insights/agentic-ux-design-principles-for-ai-agents-that-act-on-behalf-of-users
/insights/ai-agent-governance-admin-console-checklist
/insights/ai-chatbot-ux-design-best-practices-for-b2b-products
/insights/ai-interface-design-what-changes-when-the-interface-is-generated
/insights/ai-product-design-is-not-a-prompt-problem-it-is-a-context-architecture-problem
/insights/ai-product-trust-observability-or-explainability
/insights/ai-search-in-saas-should-search-and-the-ai-assistant-be-one-input
/insights/ai-trust-control-human-review-examples
/insights/b2b-saas-design-systems-worth-studying
/insights/best-design-system-agencies-and-consultants
/insights/best-fintech-ux-design-agencies
/insights/best-healthcare-ux-design-agencies-for-clinical-software
/insights/best-saas-ui-ux-design-agencies
/insights/building-on-shadcn-what-your-design-system-still-needs-to-define
/insights/building-trust-and-transparency-in-ai-first-user-interfaces
/insights/cognitive-biases-in-ecommerce-and-saas-products
/insights/compare-two-interaction-models-at-equal-depth
/insights/confidence-scores-dont-fix-trust-when-review-step-never
/insights/cpq-ux-design
/insights/design-system-governance-models-who-decides-and-how
/insights/design-system-maturity-model-where-your-team-sits-and-what-comes-next
/insights/design-system-tools-for-saas
/insights/design-systems-for-saas-boosting-efficiency-and-ux-consistency
/insights/design-thinking-vs-cx-vs-ux-explained
/insights/designing-one-component-many-brands-can-reuse
/insights/designing-one-interface-for-novice-and-expert-users
/insights/does-your-saas-product-sound-like-your-landing-page
/insights/elearning-platform-ux-what-learners-and-administrators-need
/insights/enterprise-ux-design-principles-for-complex-workflow-software
/insights/experiments-with-ux-karthik-pasupathy-context-clarity-core-functionality
/insights/figma-plugin-or-design-system-audit-what-a-tool-finds-and-misses
/insights/figma-storybook-alignment-tools
/insights/fintech-ux-designing-for-trust-compliance-and-speed
/insights/generative-ai-ecommerce-use-cases
/insights/generative-ai-product-patterns-for-saas
/insights/guides/design-agency-or-in-house-designer
/insights/guides/figma-to-react
/insights/guides/how-to-assess-legacy-system-modernisation-readiness-a-20-question-checklist
/insights/guides/how-to-audit-a-design-system
/insights/guides/how-to-use-a-ux-product-audit
/insights/guides/inclusive-product-design-for-older-and-disabled-people
/insights/guides/landing-page-design-guide-to-boost-conversions
/insights/guides/legacy-software-modernisation
/insights/guides/marketing-automation-software-design-best-practices
/insights/guides/saas-dashboard-design
/insights/guides/saas-onboarding-strategies-to-increase-customer-retention
/insights/guides/saas-ux-audit-checklist
/insights/guides/vibe-coded-app-security-checklist
/insights/guides/working-with-a-ui-ux-design-studio-in-india
/insights/healthcare-ux-design-for-clinicians-patients-and-regulators
/insights/heuristic-evaluation-services-what-you-should-get-and-when-it-is-enough
/insights/hiring-a-ui-ux-design-studio-in-india-for-a-saas-product
/insights/how-do-you-outsource-ux-design-without-losing-product-knowledge
/insights/how-do-you-redesign-legacy-enterprise-software-without-upsetting-users
/insights/how-much-does-mvp-design-and-development-cost
/insights/how-should-an-ai-product-let-users-choose-a-model
/insights/how-to-add-ai-to-an-existing-saas-product-what-to-fix-first
/insights/how-to-choose-a-front-end-development-agency-for-a-saas-product
/insights/how-to-choose-a-ux-audit-agency-10-questions-to-ask-before-you-sign
/insights/how-to-design-ux-for-ai-products-a-readiness-checklist
/insights/how-to-hire-a-product-designer-for-your-saas-product
/insights/human-in-the-loop-ux-patterns
/insights/insurtech-product-design-quoting-claims-and-producer-payouts
/insights/is-heavy-feature-usage-a-good-sign-usage-data-workarounds
/insights/is-your-saas-real-competitor-a-spreadsheet
/insights/lovable-app-security-and-production-issues-what-to-fix-first
/insights/my-experiments-with-ux-aishwarya-ashok-on-ux-evolution-from-traditional-to-ai-first-products
/insights/object-oriented-ux-when-a-saas-product-needs-it
/insights/prevent-duplicate-records-search-first-create-flow
/insights/rebuild-or-modernize-legacy-software
/insights/redesign-a-live-saas-product
/insights/saas-customer-onboarding-software
/insights/saas-features-page-product-architecture-or-customer-journey
/insights/saas-user-engagement-platforms
/insights/should-an-ai-product-replace-its-dashboard-with-chat
/insights/should-designers-write-prompts-with-ml-engineers
/insights/silent-ui-regression-debt-erodes-adoption-before-it-shows
/insights/urgent-feature-request-quick-fix-or-reusable-feature
/insights/user-research-when-your-real-users-cannot-take-part
/insights/ux-audit-vs-heuristic-evaluation
/insights/ux-debt-how-to-measure-it-and-pay-it-down
/insights/vibe-code-cleanup-specialist-guide
/insights/vibe-coded-app-production-ready
/insights/videos/do-ai-not-for-ai-sake-but-for-your-user-insights-from-eden-ai-ctpo
/insights/videos/generative-ai-product-patterns-for-saas
/insights/videos/how-ux-teams-tackle-urgent-feature-requests-design-challenge
/insights/videos/mastering-design-decisions-insights-for-founders-pms-and-designers
/insights/videos/saas-uxx-faq-does-your-saas-app-need-a-mobile-version
/insights/videos/strategic-messaging-for-saas-alex-napier-holland
/insights/videos/when-a-product-designer-moves-to-bollywood-filmmaking-workshop
/insights/what-a-designer-should-understand-about-your-business-before-designing
/insights/what-a-saas-mvp-must-prove-and-what-to-leave-out
/insights/what-does-a-product-design-agency-do
/insights/what-product-designers-can-learn-from-filmmaking
/insights/when-to-hire-a-design-system-consultant
/insights/when-to-prototype-in-code-instead-of-figma
/insights/who-can-audit-your-saas-onboarding-flow
/insights/events/design-systems-for-everyone-from-basics-to-advanced
/insights/events/lessons-from-designing-the-ux-for-ai-products
/insights/events/product-design-and-filmmaking
```
