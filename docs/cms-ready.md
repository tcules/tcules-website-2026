# What the CMS can start on — content model, components, templates and pages

**For the developer starting the Strapi work · 13 Oct 2026 · read from `main` at `42b6b81` (PR #104).**
The stakeholder review is pending. This list is built so that review cannot invalidate it: see § 0.

**Checked on this commit:** `npm run verify` passes (lint 0 errors, typecheck, tokens, classes,
specimens, design, photos, corpus, corpus assets, placeholders). **Not run:** `build` with `aria:check`,
`shots`. The corpus check reports 5 notes, listed in § 7.

---

## 0 · The thing to understand first

**There are now two content sources, and the CMS work is about the second.**

1. **Live Strapi** still feeds almost every route, through the old view models in
   `src/content/types.ts` and adapters in `src/content/sources/strapi/`. Those routes are unchanged.
2. **The `_pages/` corpus** is the content team's rewrite: 142 markdown files, each with structured
   front matter and a body of bands. The redesigned pages render from it
   (`src/content/sources/corpus/`, view models in `src/lib/corpus-types.ts`). **It is the target
   content model.** Whatever Strapi holds has to carry what the corpus carries, because the pages are
   designed against it and not against today's Strapi response.

**Why that changes the shape of the CMS work.** The corpus ruling is *the information is never
paraphrased, but its presentation is designed* (`docs/page-mapping.md` § 0). So the CMS does **not**
need one schema per component. A page is stored as its authored structure, and a template decides which
component shows each piece. The earlier rule still holds, and is why a review cannot move this: layout
is never stored (`docs/strapi-changes.md` § 1).

**Where that leaves the components.** A component's props are what a template *passes in after reading
the content*. They are not a second schema. § 4 lists the components so you know what the content ends
up as, but the model to build is § 1 and § 2.

**Authority for any field name:** `src/lib/corpus-types.ts` and the front matter in `_pages/`. Do not
copy names from this file.

---

## 1 · The page model (build this first)

Every page, of every type, has the same envelope. It is identical across all 142 files, so it is one
content type, not one per page type.

| Part | Holds | Notes |
|---|---|---|
| **Identity** | route · slug · page name · **page type** | The type drives the template. 25 types exist (§ 3). |
| **SEO** | title · description · canonical · robots · og image alt | `og_image` is `IMAGE_ASSET_REQUIRED` on most pages: the images do not exist yet. |
| **Social** | og and twitter title, description, image, type, locale | Mostly a copy of SEO. Consider deriving it and storing only overrides. |
| **Search context** | primary intent · buyer question · supporting questions | Editorial. Not rendered. |
| **Navigation** | breadcrumb trail (name, url) | |
| **Render** | **`band_order`**: the ordered list of band ids | This is the page's structure. Order is content. |
| **Composition** | visual plan · **media bindings** · logo clients · **testimonial ids** · case metadata | See § 2. |
| **Conversion** | form kind · anchor · visible and optional fields · submit label · hidden context · success heading and body · processor · optional scheduling label | Present on 12 of the 25 types. |
| **Release** | content state · site release state | Every page is `SITE_RELEASE_HOLD` today. |
| **Governance** | content governance (all pages) · method governance (audits and assessments) · redirect-from (assessment, expertise, tool) · migration notes (9 types) | |
| **Structured data** | schema.org hints | |
| **Hero** | eyebrow · title · lede paragraphs · link-only actions · proof lines · extra blocks | |
| **Bands** | an ordered list of `{ id, heading, blocks }` | The body. See below. |

**Type-specific fields:** case studies add `case_impact` and `case_metadata`; expertise adds
`expertise_kind`; articles, guides, podcasts and events add `subscription` and `editorial`; events add
`event`; podcasts add `podcast`.

### The block vocabulary — the body of every band

The corpus has exactly these block kinds (counts are blocks across the 96 pages that parse today):

| Block | Holds | Count |
|---|---|---|
| paragraph | inline runs: text, bold, italic, links | 1,194 |
| item | a level 3 or 4 heading with id, plus nested blocks | 343 |
| labelled | a bold label and its body ("The problem." / text) | 246 |
| links | a run of links | 148 |
| table | header cells and rows of inline runs | 91 |
| list | ordered or unordered items | 84 |
| quote | paragraphs · attribution · pending-signoff flag · **testimonial id** | 60 |
| form | fields (label, optional) · submit label · after-send line | 36 |
| signoff | pending sign-off marker | 23 |
| comment | editorial note, never rendered | 3 |

**Modelling recommendation.** A band is a repeatable component containing a dynamic zone of these ten
blocks, plus one **inline rich-text** type that carries links, bold and italic. Keep the inline marks
structured, not HTML: the code parses runs (`parse-inline.ts`) and a flattened string loses the links.
This is the largest single design decision and it is the developer's to confirm against the loader.

**Rules the content already obeys that the schema should enforce:**
- Band **ids** are stable keys (`band_order` references them). The loader flags a page whose
  `band_order` differs from document order; one does today.
- Quotes name a **testimonial id**, not free text, so the quote lives once (§ 2).
- A form band names fields; it does not carry layout.

---

## 2 · Reusable records (model once, reference everywhere)

| Record | Fields | State |
|---|---|---|
| **Testimonial** | id · quote paragraphs · speaker · role (optional) · company · client · **rating** (0–5 in halves) + **rating source** (clutch · upwork · google · direct) · **portrait** (square, with a consent flag) | Strapi entries 4, 11, 18, 19. **The ratings and portraits shown today are placeholders** (`fixtures/testimonial-ratings.ts`, `testimonial-avatars.ts`); each must be replaced before launch (P36, P40). A record with no rating shows no stars and none with no portrait shows no avatar. |
| **Media asset** | file · alt · **kind** (capture · cut-out · illustration · photograph) · **panel** (cut-outs) · **shadow** (cut-outs) · **focal point** | Strapi entries 3, 6, 7, 9. Upload breakpoints 1240 / 652 / 320, WebP, 2560 master. An asset with no kind renders as a capture. |
| **Media binding** | id · role · supports-section · asset uri · alt intent · status · source · caption · attribution | Today in front matter. 14 assets are bound and measured; **41 image slots are labelled placeholders** (`docs/image-register.md`). Alt text is missing on three bound assets (P23). |
| **Case study** | title · **client** · one-line description (8–15 words) · **cover** and **banner** · categories · impact · metadata | Entries 5 and 13. **Every card crops to 16:9**, so a cover is one 2560 × 1440 master with an optional focal point (entry 19). |
| **Client** | name · logo (single-colour SVG, width, height, weight correction) | 9 marks exist. A client with no logo renders its name (gap G1). |
| **Rating source** | platform · score · scale · link | Read by footer, hero and proof bands. Never authored per page. |
| **Site facts** | the studio figures | Owner-approved placeholders (8 Oct). |
| **Person** | portrait (square) · name · position · bio · LinkedIn | New with `ProfileCard` (12 Oct). Used by About. |
| **Navigation** | menu structure, with each item's status | **Hold**: the nav IA is a pending rework. |

---

## 3 · Page types: which have a template, and which are live

`_pages/` holds 142 files. **The loader parses the 96 that sit one or two levels deep.** The other 46
(three or more path segments, for example the specialist service pages) are skipped until their own
pass. Counts below are all 142 files.

| Page type | Files | Template | State |
|---|---|---|---|
| service | 34 | `OfferPage` | **1 live** (`/services/product-design`). The rest still read Strapi. |
| audit · assessment | 4 · 2 | `OfferPage` | **1 live** (`/audits/design-to-code-audit`). |
| expertise · expertise hub | 12 · 1 | `OfferPage` | **1 live** (`/expertise/healthtech`). |
| case study | 17 | `CaseStory` (from an ideal local copy); `LongformPage` for the rest, not yet switched | **1 live**: Benchmark Gensuite renders as a designed story from a **local copy** of its Strapi content (`fixtures/ideal/case-studies`), not from `_pages`. The other 16 render the Strapi body as it stands. |
| proof hub (`/case-studies`, `/clients`) | 2 | `CaseStudyIndex` | `/case-studies` live. `/clients` has none. |
| article · guide · event · podcast | 12 · 8 · 2 · 2 | `LongformPage` | **1 live**: `/insights/cpq-ux-design`. |
| defined term · glossary | 18 · 1 | `LongformPage` | **1 live**: `/glossary/design-system`. |
| tool · tool hub | 6 · 1 | `ToolPage` | **1 live** (`/tools/design-system-drift-checker`), with the tool itself a labelled placeholder. |
| home (`page`) | 1 of 7 | `HomePage` | **Live** (`/`). |
| about (`page`) | 1 of 7 | `AboutPage`, and the `StudioPage` proof | **Live** (`/about`). |
| page (other 5) · company (`/careers`) · lab · lab artefact · practice · policy · utility · glossary / knowledge / insights hubs · knowledge collection (5) | ≈ 18 | none | **Not started.** |

**Reading this table.** A "live" route is switched by one allowlist entry per family
(`src/app/_corpus/*.tsx`, `PASS_1_*_ROUTES`). Switching a page is adding its route to the set, after the
page-mapping has verified its band shapes. Nothing outside that set reads the corpus, so a content
model built now cannot disturb the live site.

---

## 4 · Components: what the content ends up as

All are built, have a specimen under `/design`, and pass `verify`. **Props follow the corpus; none of
them need a schema of their own.**

### Settled and used by the live pages
- **Page frame:** `PageHero`, `Breadcrumbs`, `SiteNav`, `SiteFooter`, `TableOfContents`.
- **Sections and text:** `ContentSection`, `Statement`, `Callout`, `Banner`, `Prose`, `Accordion`.
- **Sets:** `BlockCard` / `BlockCardSet`, `ListCard` (rows, tiles, steps, read-down), `ProcessFlow`, `Thread`, `Contrast`.
- **Data:** `DataTable` (boxed; tables scroll sideways on a phone), `Figure`, `Media`.
- **Proof:** `Proof`, `Slider`, `LogoGrid`, `ClientMark`, `RatingBadge`, `Stat`.
- **Asks:** `CtaSection`, `CtaRow`, `EnquiryForm`.

### New in PR #104 — page-specific compositions
These read a structured list from the corpus and draw a scene or layout from it. The **content is a
title and a body per item**; the drawing is chosen in code by name, and is never a CMS field.

| Component | Used on | Content it reads |
|---|---|---|
| `Gateway` | home | situations: the reader's own words, one sentence, the service that answers it |
| `OfferSheet` | offer pages | promises: what the buyer gets, then what it means |
| `EngagementOptions` | about | engagement options and how an engagement runs (scene keyed by name) |
| `TracePlates` | product design | stages of one screen's life (scene keyed by name) |
| `CaseSpread` | case story | titled parts of a story ("The problem.", "What we did.") |
| `ProfileCard` | about | a person (§ 2) |
| `Testimonial`, `StarRating` | home, about | the quote, its speaker, rating and portrait (§ 2) |
| `Sketch` | home | six service scenes, keyed by service |
| `EngagementModel`, `VideoTestimonial` | kit | still unused by a live route; `VideoTestimonial` waits on a video hosting decision |

**Missing specs.** `docs/specs/` has 30 files, and **none of the components in this table has one**.
`LogoGrid`, `EngagementModel` and `VideoTestimonial` have none either. Their props are readable in source,
but no written contract exists yet.

### Not CMS components
Primitives (`Section`, `Layout`, `Cluster`, `Button`, `Icon`, `Input`, `Logo`, `Tag`, `Texture`,
`BrandMark`) and derived chrome (breadcrumbs, outline). A button is label plus href; whether it renders
as the blue solid, a ghost or a link is decided by its position on the page.

---

## 5 · What to model first

1. **The page envelope and the band and block model** (§ 1). Everything else hangs off it, and it is
   the same for every page type.
2. **Testimonial and media records** (§ 2). Quotes and images are referenced from every page type.
3. **Case study and client.** Unblocks the index, the cards on home, and every case citation.
4. **Conversion and the form record.** There is **no live enquiry endpoint**: the code posts to
   `ENDPOINTS.enquiry` (`/api/enquiry`), which is not served. Settle this with the CMS owner now.
5. **Then page types in the order the code will switch them:** offer pages (service, audit, expertise),
   then long-form (case, article, guide, term), then tools. Home and About are single pages and can be a
   single-type each.

---

## 6 · Not ready — do not start

| Item | Why |
|---|---|
| **Navigation** | IA rework pending; "each item is worked on individually" (7 Oct). |
| **Careers, lab, lab artefact, practice, policy, hubs, knowledge collections, `/clients`, utility** | No template and not yet mapped. Careers is parked in the tracker. |
| **The 46 deeper pages** | Skipped by the loader until their own pass. |
| **Video testimonials** | No hosting decision; two client interviews exist. |
| **Tool workspace** | The Drift Checker record builder is a product feature (gate `TOOL_PRODUCTION_ACCEPTANCE`), shown as a placeholder. |
| **Live ratings, portraits, og images, 41 image slots** | Placeholders or missing assets. Models can start; values cannot. |

---

## 7 · Open points and content problems found

1. **Every page is `SITE_RELEASE_HOLD`.** Content state: 62 `CONTENT_READY`, the rest drafts from five
   batches (39 are batch 4). Do not treat a draft as final copy.
2. **The content team has 46 proposals** (`docs/content-proposals.md`, P1–P46): hero eyebrows that
   repeat the breadcrumb (P1), titles and ledes over budget (P2, P3), straight quote marks (P27, P31),
   run-in labels (P18). The pages render the copy as written meanwhile. Fixing the copy never needs a
   schema change.
3. **Corpus check notes:** three quotes have no attribution (Auxentios, Octifi, Wandering Raven); one
   case's `band_order` differs from its document order (Magento); one hero holds a list (GT Tools).
4. **The scheduling destination** for "See available times" is named nowhere (page-mapping § 9.4).
5. **Component gaps logged against the pages** (`docs/page-mapping.md` § 6): a no-logo client renders as a
   name; item bodies need inline links, so `BlockCard` and `ListCard` need a trusted HTML body.
6. **The portrait question.** The 7 Oct review said "no headshots"; the 11–12 Oct work added square
   testimonial portraits and a `ProfileCard`. Both are modelled as optional. Confirm with the stakeholder.
7. **`docs/TRACKER.md` is behind the code.** It still shows Phase 3 as not started. Treat this file,
   `docs/page-mapping.md` and `docs/kit/review-7-oct.md` as current.
