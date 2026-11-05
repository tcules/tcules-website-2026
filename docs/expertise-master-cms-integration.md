# Expertise Master on the new CMS (`/expertise`)

Branch `new-cms`, 5 Nov 2026. Frontend only: the CMS (`tcules-cms`) was read for its schema and never
changed. The Expertise detail pages (`/expertise/{slug}`) are not changed by this work.

## Source and query

- `PublishedExpertiseMaster` (`src/content/sources/strapi/published-expertise-master-query.ts`):
  `expertiseMaster(status: PUBLISHED)`, its fixed `hero`, then every `content` member in saved order.
  All 17 Dynamic Zone members are queried:
  - the 15 shared sections come from `SHARED_SECTION_MEMBERS` / `SHARED_SECTION_FRAGMENTS`, now
    exported from `published-service-query.ts` and shared with the Service query;
  - the Expertise Directory and Question/Role Ledger come from `EXPERTISE_SECTION_MEMBERS` in
    `expertise-sections.ts`.
- Validated against the live API (0 errors). The live schema has no `anchorId` on the ledger section
  or on directory groups.
- SEO: the existing SEO Page reader (`getPageSeo('/expertise')`).

## Component mapping (live record, in CMS order)

| # | CMS section | Renders through | `data-band` |
| --- | --- | --- | --- |
| — | Hero | `PublishedHero` (trail, eyebrow rule, body, action, stats, CMS media) | A |
| 1 | Client Grid | LogoGrid with the heading as its h2 context; `density`, `markOverrides` honoured | H |
| 2 | Expertise Directory | the hub's grouped photo cards (DestinationGroupsBand shape): group eyebrow + h3, 3 across | C-image |
| 3 | Case Study Cards | BlockCardSet, 3 across | M |
| 4 | Testimonials | the shared testimonials band (slider) | G |
| 5 | Engagement Options | EngagementOptions (`grid`), action, terms | engagement-options |
| 6 | CTA `button` → `#enquiry` | the ask island (corpus `AskIsland`): solid "Book a call" | L |
| 7 | Why | OfferSheet `list` (the hubs' Why), each card's CMS upload in the glyph slot | offer-sheet |
| 8 | Service Card `single-grid-content` | Bento, 8 tiles on 4 tracks, CMS scenes | C-icon |
| 9 | CTA `form` | enquiry island (blue, halves), CMS form settings and art | L |
| 10 | FAQ | FAQ beside its heading | D-faq |

Sections the live record doesn't use still map, through the same renderers as the Service pages: Stage,
Offer Sheet, Hard Parts, Comparison, Illustrated, Editorial, Industry Grid, and the Question/Role
Ledger (as VoiceLedger).

Variants:
- Service Card: `single-grid-content` and `two-grid-content`.
- Offer Sheet: each card's `column`/`row`.
- Why: `illustration`/`media` (each card uses the upload its own variant selects).
- CTA: `button`/`form`. A button CTA pointing at the page's `#enquiry` is the ask island (the frontend's
  existing `isAskLink` rule); any other button is the onward island.

## Expertise relationships and ordering

The directory never copies Expertise content. Each card selects a published Expertise record:

- **Title:** the placement title, else the CMS `resolved` title, else the record's `name`.
- **Link:** `resolved.href`, else the record's `routePath`, else `/expertise/{slug}`.
- **Image:** the placement image, else `resolved.image`, else the record's `previewImage`.
- **Body:** "Best for" and "How we design for it", as two escaped plain-text paragraphs. The whole card
  is a link, so it can hold no other link.

Groups and cards keep the editor's order. Verified links, in order:
- By product type: b2b-saas-workflow-software, ai-products-developer-tools,
  data-analytics-decision-products, content-knowledge-discovery-platforms,
  commerce-transactional-products, marketplaces-multi-sided-platforms.
- By industry: fintech, healthtech, edtech-learning, martech-salestech,
  proptech-contech-field-operations, climatetech-energy.

A card whose record is unpublished is left out with a server warning.

## Illustration fallback (the only fallback)

- **Hero:** the CMS media first. Otherwise `heroFallback('/expertise')` (the hub's own drawing), else
  the labelled placeholder. This now lives in `app/_corpus/hero-fallback.ts`, shared with
  `/services/{slug}`.
- **Why:** a card with no upload keeps the reason's glyph.
- **Service tiles and other sections:** the frontend's scene for the destination, as on the Service
  pages.
- **Enquiry art:** the CMS media, else the frontend drawing.
- **Directory card with no image:** the register's labelled placeholder. No live card needs it.

No words fall back.

## SEO

`generateMetadata` returns the mapped SEO Page metadata. Rendered `<head>` holds exactly one each of:
`<title>`, description, keywords, robots, canonical (`https://www.tcules.com/expertise`), og:title,
og:description, og:url, og:type, og:site_name, og:locale, twitter:card, twitter:title and
twitter:description. Nothing is duplicated outside the head. JSON-LD is emitted when the SEO Page
carries `structuredData` (it has none today).

## States

`app/expertise/(listing)/` holds the page and its `error.tsx` ("Expertise temporarily unavailable",
retry). The route group keeps them off `/expertise/{slug}`. A missing record → 404.

No `loading.tsx`: with a loading boundary, Next streamed the page's metadata into `<body>` for
browsers. The page is ISR (`revalidate = 300`) and prerendered, so the case-studies listing's choice
(no loading state) is kept.

## Validation (dev server)

- Band sequence identical to the corpus render, including the ask island, which now carries the CMS
  anchor `how-we-work-together-ask`.
- Per-band word diff against the corpus render: only the two CMS gaps below differ.
- No console errors or hydration warnings; no invalid nesting (`<a>` in `<a>`, block in `<p>`).
- 375px: single column, no overflow. 1280px: directory and cases 3 across, services 4 tracks.
- `tsc --noEmit` clean; eslint clean on the changed files. Four Service detail pages re-checked after
  the shared changes: unchanged.

## Missing or mismatched CMS fields (not changed here)

- **Testimonials section:** no `rating`. The Clutch badge ("4.8 on Clutch · Read the reviews") the
  corpus page showed under the quotes is gone.
- **Enquiry form:** `replyLabel` is empty, so the card's "We reply in 1 business day" (frontend text)
  is gone. `island` and `presentation` are empty; the frontend defaults to blue/halves.
- **SEO Page:** `noindex,follow`; no Open Graph or Twitter image; no structured data.
- **Why cards:** all six uploads are the same "ILLUSTRATION TO COME" placeholder, now shown in the
  glyph slot where the corpus page showed the reasons' glyphs.
- **Engagement options:** `grid`, no option icons.

## Changed files

- `src/app/expertise/page.tsx` → `src/app/expertise/(listing)/page.tsx` (CMS route) and
  `(listing)/error.tsx` (new)
- `src/app/_corpus/hero-fallback.ts` (new); `src/app/services/[...slug]/page.tsx` now imports it
- `src/content/sources/strapi/published-expertise-master.ts`, `published-expertise-master-query.ts`,
  `expertise-sections.ts` (new)
- `src/content/sources/strapi/published-service-query.ts`: shared section members and fragments
  exported; Client Grid adds `density` and `markOverrides`
- `src/content/sources/strapi/published-service.ts`: `mapSharedSection` and `CmsSharedSection`
  exported; Client Grid mapping
- `src/content/source.ts`, `src/content/index.ts`: `getExpertiseMasterPage`
- `src/templates/CorpusPage/PublishedExpertiseMaster.tsx`, `ExpertiseSections.tsx`,
  `published-expertise-master-model.ts`, `expertise-sections-model.ts` (new)
- `src/templates/CorpusPage/PublishedService.tsx`:
  - `SharedSectionView` and `SharedSectionCtx` exported;
  - Client Grid as the recognition band;
  - an `#enquiry` button as the ask island;
  - the enquiry `family` context.
- `src/templates/CorpusPage/published-service-model.ts`: `clients.compact`
- `src/templates/CorpusPage/OfferBands.tsx`: `WHY_GLYPHS` exported

The Expertise detail work in this checkout (`published-expertise*.ts`, `PublishedExpertise.tsx`,
`app/expertise/[slug]/*`) belongs to another session and is not part of this change.
