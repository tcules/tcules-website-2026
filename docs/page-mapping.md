# Page mapping — `_pages` corpus, pass 1

**Status:** the builders' design document for the ten first-level pages, 10 Oct 2026, branch
`feat/pages-pass-1`. The owner judges the **built pages in the browser**, not this document (owner,
10 Oct: "i wouldn't be able to make judgements on the mapping document"). Critics review this; the
builders follow it.

**Inputs read in full:** the ten source files; `docs/kit/visual-direction.md` (incl. the 7 Oct and
9 Oct owner rulings at its top); `docs/kit/review-7-oct.md`; `docs/kit/references.md` (headings and
the conflict sections); `docs/component-audit.md` § 4 and § 6; `docs/service-pages-design.md`; the kit
showcases under `src/app/design/kit/**`; the owner rulings in memory (ui-kit-direction, review-7-oct
outcome, keep-what-was-approved, fix-causes-not-notes, illustration standard, brand imagery,
content-narrative-is-fixed, job-is-not-a-component); every pattern's props as they are in the code
today.

**Companion files written in the same pass:** `docs/content-proposals.md` (19 proposals after the critic pass) and
`docs/image-register.md` (every placeholder slot). Section 8 indexes both. A critic pass the same day edited this sheet in place and added P18–P19, three register rows and one ratio change; section 10 lists every change.

---

## 0 · The rules this document never bends

> **Corrected by the owner, 10 Oct 2026 (§ 17, Home round 1).** Rules 1–3 were read too literally.
> The information is never paraphrased, but its presentation is DESIGNED: a stats line becomes
> figures, a list of client names becomes the logo wall, quotes authored inside a case leave it for a
> testimonial component, and the IA inside a band is free. Band order holds with ONE sanctioned
> exception on every page: the enquiry form sits immediately before the FAQ (`order.ts`). Beauty
> first; content length is negotiated through `docs/content-proposals.md`. Where a rule below
> disagrees, § 17 wins.

1. **Copy.** Every word in a source file renders, in its order. No rewording, no trimming, no
   paraphrase. Punctuation that a component draws itself (a quote's marks, a list's bullets) may
   replace the authored glyph, never both. `comment` blocks never render. Labels follow one rule
   on every page (critic, so every builder does the same thing):
   - a bold label's trailing **colon** is not rendered when the label becomes a title above its
     body ("**The approved design:**" → title "The approved design"), because the title/body
     structure now does the colon's job;
   - a label's trailing **full stop or comma** stays in the title ("The problem.", "Every
     difference we found,");
   - a body that starts lower-case mid-sentence (a run-in: "dealing with complex workflows…",
     "find out how people…") renders lower-case. Nothing is capitalised. P18 asks the content team
     about run-ins;
   - a lone link line's closing full stop is not rendered when that link becomes a button.
2. **Band order** is `render.band_order`, which is also document order. Nothing is reordered,
   merged or dropped.
3. **Allowed.** Split one band into two consecutive sections. Change how an item is **shown**: a
   table as cards, a list as a diagram, labelled paragraphs as tiles, a run of case names as case
   cards, a quote moved to the end of its band. Re-lay content inside a band, keeping every word.
   A split's second part keeps the reading order: it follows the first.
4. **Content that pulls the design down** gets a proposal in `docs/content-proposals.md`, never an
   edit. The page renders the copy as written in the meantime, even when that means a fold
   overrun. Section 7 lists the overruns we expect, so a red `fold:check` on those bands is a known
   cost and not a build fault. The builders never shrink a gap, a type step or a lead to make a
   band fit (visual-direction § 1.3).
5. **Images.** Decided in this order, first match wins:
   1. a `media_bindings` asset with `bound: true` that supports this band;
   2. **a case's cover:** wherever a case is cited, the case page's own first bound asset. Each
      case file binds its artefacts, so it is a pre-existing image the corpus already points at;
   3. **a studio photograph the corpus binds elsewhere** (`about_studio_review`,
      `about_work_wall`), only where this document names the reuse and the slot's subject is
      "Tcules people at work". visual-direction § 5.1 rule 4 lets studio photos recur across
      pages. The builder checks the § 5.4 resolution rule (crop ≥ 1.9× the box). If it fails, the
      slot becomes a placeholder and the builder adds a row to the register;
   4. otherwise, a **labelled placeholder** (§ 5, G5) and a row in `docs/image-register.md`.
   - Kit catalogue photographs (`public/kit/photos`, `getKitPhoto`) are **not used**: nothing in
     the corpus points at them.
   - One deliberate exception: `/services/product-design` keeps its existing service-line
     illustration (`public/illustrations/services/product-design.paper.svg`, with its cut legend).
     It is the page's own live hero asset and was owner-approved in the kit, so
     keep-what-was-approved applies. The register also carries the illustration the content
     team's visual plan asks for, as its replacement.
6. **Kit pieces are locked.** Compose them. Extend one only with the smallest prop the job needs
   (section 6). Never restyle one.
7. **Eyebrow vs. crumb.** Six hero eyebrows repeat a crumb, against the owner's 5 Oct ruling.
   Copy wins, so they render as written, PageHero's development warning fires, and proposal P1
   asks the content team to change them. The builders do not call `eyebrowBesideTrail` on corpus
   pages, because it would drop authored words.

---

## 1 · Architecture

### 1.1 Templates

| Template | Status | Serves (this pass) | Serves later (same template, no new layout) |
|---|---|---|---|
| `CorpusPage/HomePage` | new | `/` | — (one page type, one page) |
| `CorpusPage/AboutPage` | new | `/about` | — |
| `CorpusPage/OfferPage` | new | `/services/product-design`, `/audits/design-to-code-audit`, `/expertise/healthtech` | all 33 service pages (6 lines + 27 specialist), the 6 audits, the 12 expertise pages: **51** |
| `CorpusPage/LongformPage` | new | `/case-studies/benchmark-gensuite-…`, `/insights/cpq-ux-design`, `/glossary/design-system` | the 16 new-format cases, 29 insights, 19 glossary terms: **64** |
| `CorpusPage/ToolPage` | new | `/tools/design-system-drift-checker` | the 6 tools |
| `CaseStudyIndex` | **reused, extended** (G9) | `/case-studies` | — |
| `ServicePage` | **not reused** | — | stays as the kit's proving ground at `/design/service-page/*` |

**Why one `CorpusPage` folder with five exports rather than five folders.** The five share one
vocabulary of corpus-block renderers (labelled run → tiles, quote → Proof, table → DataTable, form →
EnquiryForm…). CLAUDE.md forbids a sideways import between template folders, and the renderers
cannot live in `src/lib` (it may not import patterns) or in `src/patterns` (a pattern may not know a
corpus type). One folder with internal modules (`blocks.tsx`, `plan.ts`) is how ServicePage already
solved the same problem (`Bands.tsx`, `Blocks.tsx`, `plan.ts`). Each export is a whole page type.

**Why ServicePage is not reused for `/services/product-design`.**
1. It takes a `ServiceStory`, an authored design shape whose copy was rewritten to the § 1.5 budgets.
   Corpus copy is fixed and does not fit those blocks.
2. `planBands` assigns catalogue stock photographs by slug (`SERVICE_PHOTO_SLOTS`). Pass 1 uses
   none.
3. It inserts template-authored bands (K offer, I banner, J statement) that the corpus does not
   have.

OfferPage's `plan.ts` re-implements its page rules: centred-head adjacency, tint adjacency, the
`textHeavy` / `textHeavyPairs` warning and the DRAWN set. It cites ServicePage's `plan.ts` and does
not import it. Extracting the shared checks to `src/lib/band-rhythm.ts` is a follow-up, so pass 1
does not edit an approved template.

**Why CaseStudyIndex is extended rather than replaced.** It *is* the case-study index page type,
and it already composes the featured BlockCardSet the corpus's "Four to start with" needs. What it
lacks is grouped sections, a hero action and a form close (G9). Its props stay corpus-blind: the
route maps the corpus onto them.

### 1.2 Routes (pass 1 switches only these ten)

| Route file | Change |
|---|---|
| `src/app/page.tsx` | `getCorpusPage('/')` → `HomePage` |
| `src/app/about/page.tsx` | → `AboutPage` |
| `src/app/services/[...slug]/page.tsx` | `product-design` → `OfferPage`; every other slug unchanged |
| `src/app/audits/[slug]/page.tsx` | `design-to-code-audit` → `OfferPage` |
| `src/app/expertise/[slug]/page.tsx` | `healthtech` → `OfferPage` |
| `src/app/case-studies/[slug]/page.tsx` | `benchmark-gensuite-enterprise-suite-modernisation` → `LongformPage family="case"` |
| `src/app/case-studies/page.tsx` | → `CaseStudyIndex` (extended), mapped from the corpus |
| `src/app/tools/[slug]/page.tsx` | `design-system-drift-checker` → `ToolPage` |
| `src/app/insights/[...slug]/page.tsx` | `cpq-ux-design` → `LongformPage family="article"` |
| `src/app/glossary/[slug]/page.tsx` | `design-system` → `LongformPage family="term"` |

Gate each dynamic route with one allowlist (`PASS_1_ROUTES` in the route module) so the 86 unverified
corpus pages do not switch silently. `generateMetadata` reads `seo` (title, description, canonical,
robots) and `ogImageAlt`. `og_image` is `IMAGE_ASSET_REQUIRED` on most pages and is out of scope.

### 1.3 Foundation additions the builders need first

- **G7, corpus types where a template can see them.** Move or re-export the view-model types from
  `src/content/corpus-types.ts` into `src/lib/corpus-types.ts`, with `@/content` re-exporting
  them. A template may not import `@/content`. This is the same move `src/lib/service-story.ts`
  made.
- **G6, `inlineToHtml(runs)`** in `src/lib/inline.ts`, for the four patterns whose rich slots take
  trusted HTML: Accordion `answerHtml`, DataTable `cellsHtml`, Proof `quoteHtml` and Callout /
  Prose `html`. `renderInline` stays the renderer for ReactNode slots (`ContentSectionText`,
  PageHero `children`).
- **G13, quote attribution parsing** (`src/lib/attribution.ts`): `"Name, Role…, Company"` →
  `{ name, role, company }` (first / middle / last; the middle may itself hold commas: "Director,
  Product Management"). About's two-line form (name, then "Role, Company") folds to the same
  shape.
- **G12, glyph maps** (`src/lib/glyphs.ts`): route → IconName for the icon routers (services,
  product-design specialist services, expertise sectors) and a named map for HealthTech's personas.
  It starts from the kit's choices (`kit/home`: product design `ruler-pen`, design systems `layers`,
  AI product UX `stars`, design engineering `monitor`, software development `database`, product
  modernisation `shield-check`).
- **Form endpoint.** No live enquiry endpoint exists, and `FORM_ENDPOINT_VERIFICATION` is a release
  dependency on every page. Name `ENDPOINTS.enquiry` (`/api/enquiry`, not served yet) in
  `src/lib/routes.ts` and post there.
- **Routes.** `ROUTES.healthtech` is `/expertise/healthtech-care`, but the corpus route is
  `/expertise/healthtech`. Correct the name in `src/lib/routes.ts`. Corpus links are content and
  pass through `renderInline` as authored. `routes.ts` governs only the paths the code itself builds
  (trails, case-cover lookups via `caseStudyPath`).

---

## 2 · Shared mappings (one content shape → one component, everywhere)

Every page section below refers to these by **M-number**. A page departs only where its row says
why.

| # | Content shape (corpus) | Component and arrangement | Notes |
|---|---|---|---|
| **M1** | **Hero:** eyebrow line, h1, lede, link-only asks, proof lines | `PageHero`: `trail` = `heroTrail(navigation.breadcrumb)` + `Breadcrumbs` (none on `/`); `eyebrow` = the italic line verbatim; `title` = `titleText`; `body` = lede paragraphs; `actions` = `hero.actions` (the first is the page's one blue solid; no ghost is invented, because none is authored). **Proof lines, two forms:** a bare run of facts split by " · " with no label (home's studio record) → **`tags`**, one tag per fact, which is the hero's bulleted label (§ 3.8 "a hero's facts") and renders after the actions, as authored; a line that opens with a label ("Selected work: …") → **`children`** (the extras row: one quiet line, `renderInline`), which renders above the actions — a re-lay inside the band, words unchanged. `tags` only where the title holds 3 lines. | Arrangement per page: an illustration hero is `beside`; a page with no hero image is `stacked` with `texture` (the end-fade). A hero with more than one lede paragraph keeps at most two and splits the rest into the next band (rule 3). |
| **M2** | **Enquiry band** (`enquiry`: heading, lead, form block or `conversion`) | `CtaSection` **split** (the L close), `id="enquiry"` (ANCHORS), `body={[lead]}`, `form=<EnquiryForm variant="enquiry">`. Fields from `conversion.visibleFields`: Email · What are you working on? · Product or company URL (optional). Submit label from "**Submit:**". The success view takes `conversion.onSuccess` (G2). | Tint, unless the band above is tint (two tints never touch, 9 Oct). The "After sending" line is the success body, not a second caption. A scheduling link appears only where `conversion.schedulingLabel` is set (the case: "See available times"). No eyebrow, because none is authored. Hidden context: `family` = pageType, `serviceOrAudit` = slug. |
| **M3** | **Close with a link and no form** | Copy with **no** inline links → `CtaSection open`: heading, `body=[para]`, the link as `actions[0]` (the page's one solid). Copy **with** inline links → `ContentSection` on tint + `ContentSectionText` + `CtaRow rule={false}` (link button). | CtaSection's `body` is strings, and inline links must survive. |
| **M4** | **FAQ band** | D-faq: `ContentSection align="center"` + `Accordion` (question h3; `answerHtml` = `inlineToHtml`). | Paper. FAQ sits directly before the close on most pages, which breaks the § 3.3 rule that a D-faq is followed by an image band and then the close. The narrative is fixed, so this is accepted everywhere and is not a proposal. |
| **M5** | **Quotes-only band** | G slider: `ContentSection align="center"` (heading, lead) + `Slider perView={1} align="center" autoplay` of `Proof` display quotes (G·02, the owner's favourite) + no rating. | Tint. Also used for About's testimonials. |
| **M6** | **A set band ending in a client quote** (cases + quote, outcomes + quote) | Short enough to fit: the quote stays as `Proof arrangement="compact"`, a `stack` under the set. Too tall: **split**. Part 1 is the set; part 2 is the quote alone as G typographic (`Proof` display, centred, no heading) on tint. | The split is the cure for "too much in one place" that keeps every word. It recurs on product-design `complex-products` and audit `proof`. |
| **M7** | **A quote inside a case story** (h3 case, paragraph, quote) | `Proof compact` in the case's copy column, after the paragraphs | "The work first, then what the client said" (1 Oct). Never with a rating. |
| **M8** | **Case reference** (a labelled `**Client.**` paragraph, a link line, or an h3 case) | Case card: `BlockCardSet lead="none"` of `BlockCard`s with the case's cover (rule 5.2), `title` = the case name as authored, `body` = the rest. Linked only where a link is authored (`ctaLabel` = the link text, `cue="cta"`). **Where only a link line is authored** ("Read the Dealpath case"), the title is the linked case page's own h1, read from the corpus (`getCorpusPage(href).hero.titleText`): the content team's words for that case, taken from its page, as rule 5.2 takes its cover. Never a title the builder writes. | The set picks the crop from the count (`cover` 3:2 for one or two, `wide` 16:9 from three, `pair` for a linked pair); the builder passes no `ratio`. `lead="none"` always: BlockCardSet's default `auto` features the first card from four items, which is for `/case-studies` only. Never a decorative image in the same band. |
| **M9** | **A lone link closing a band** ("Read the X case", "See all case studies", a service link) | `CtaRow` in the band's `footer` (link button with its arrow) | Inline links inside sentences stay inline. |
| **M10** | **Symptom set:** labelled items whose titles are quoted customer voices ("Customers keep getting stuck.") | D: `ContentSection arrangement="beside"` + `aside` photo (3:2, `asideFill`) + `ReadDown columns={2}`, row title = the quoted line as written | product-design `starting-points`, audit `recognition`. `ReadDown` rows take no `href`, so ReadDown is only for rows nobody clicks. A run of **linked** rows is `ListCard` rows with `href` in the caller's `Layout as="ul" rowGap="none"` (home `capabilities`). |
| **M11** | **Two labelled reasons** (`why-tcules`) | B: `ContentSection arrangement="media"`, photo weight (6:5 in 667), two tiles | Where B would make a third B in a row, use D with a photo aside and `ReadDown columns={1}` (healthtech). |
| **M12** | **Labelled claims, 3–6** (outcomes, principles, differentiators) | Text cards: `BlockCardSet` text form (the hairline top, `lead="none"`); or B tiles beside a photo where the page needs an image there | The choice follows page rhythm (section 3) and is stated per band. |
| **M13** | **Service or destination links with a description** | Icon router: `BlockCardSet frame="box" lead="none"`, a glyph per destination (G12), stacked head above, no photograph. A set whose count leaves a short last row (five → 3 + 2) starts that row at the start edge; it is never centred. | Owner, 9 Oct: a clickable set takes its head above and no decorative image. |
| **M14** | **A bare run of destination links** (expertise list) | Icon router, title only: `BlockCardSet frame="box" lead="none" across={4}`, `cue="title"` (each title is its destination's name) | |
| **M15** | **Comparison table** (a key column compared across rows) | Boxed `DataTable` (7 Oct ruling 1) | A boxed table is a drawn band (E) for the rhythm rules, as ServicePage's Record and Matrix are (`plan.ts` DRAWN). |
| **M16** | **Key/value record** ("At a glance", "Tcules at a glance") | `DataTable` record. Six or more rows set as two boxed halves side by side from 1024 (7 Oct ruling 1). "At a glance" has no real header row: its first row is a pair, so it uses the head-less record mode (G4). | |
| **M17** | **A table whose rows are peers, not compared** (personas, impact dimensions) | Cards (`BlockCardSet lead="none"`, unlinked, `frame="none"`: the box is for routers only), with the two header cells rendered **once** above the set as a legend: header 1 → header 2. The legend is template-local markup: a `Cluster colGap="tight"` of two `<p>`s in `--text-eyebrow` with `text-transform: var(--text-mono-case)` and `Icon name="arrow-right" size="sm"` (blue, `aria-hidden`) between them. It is the set's first block, a `stack` under the head. | The header words survive without a repeated card eyebrow (§ 7.3). |
| **M18** | **Ordered list on a composed page** | `Steps` (numbered ListCard rows) or `Thread` where the order is a path | |
| **M19** | **Long-form section** | Inside LongformPage's one shell `Section`: `Layout columns={{ base: 1, lg: [1, 4] }}` with the `TableOfContents` rail + `<article>`, as `case-studies/[slug]` already does. Each band is an `<section>`: h2, then `Prose` (`inlineToHtml`), with `DataTable`, `Steps` and `Media` placed between Prose runs. | Long-form is "anything you would read like an article" (memory: long-form-page-types). Prose has no measure, so the rail's track sets it. |
| **M20** | **Scope note** ("We are at our best when…", "Worked example, not a client result…") | `Callout` | A quiet boundary on the claim just before it, which is Callout's job. |
| **M21** | **One standalone sentence split from a band** | `Statement` (J), `as="p"`, `align="start"` unless a neighbour is centred | Never an h1. |
| **M22** | **Bound artefact image in a band** | `Media kind="capture"` (hairline, radius 0) in a media split or the article track, `alt` from `altIntent` | A Figure needs a caption, and the corpus has none (`caption: null`), so use plain Media. |
| **M23** | **Related services** | Inline in a sentence → stays inline. Alone at a band's foot → M9. Three or more in a band of their own → M13. | Owner: "cards, chips, or whatever best suits the visual design of that page". |
| **M24** | **Tool mount** | A labelled placeholder panel (G10) | |

**Item bodies with inline links** (product-design `engagement` item 4, healthtech `why-tcules` item 1,
About `what-we-do` Software Development) take `bodyHtml` (G3). A card whose body carries a link is
never a whole-card link, because that would nest one interactive element inside another.
**`cue="cta"` alone does not prevent that:** BlockCard renders its whole frame as the `<a>` whenever
`href` is set, whatever the cue, so a link in the body would sit inside it. G3 therefore adds a
static-frame mode: the frame stays a `<div>` and the cta is the card's only anchor. It is a set's
decision, like `frame`. In About `what-we-do`, all six cards take it because one of them needs it, so
the six answer the pointer the same way. Unlinked tiles and rows with `bodyHtml` (engagement,
healthtech) need nothing more.

---

## 3 · Page-level rules, applied to every page below

- **Rhythm classification** (visual-direction § 1.7, `plan.ts`):
  - **visual:** a band with a photograph, illustration, capture, diagram (E, including a boxed
    table), marks (H), covers (M / case cards / case slides) or an icon set (C-icon);
  - **text-heavy:** everything else;
  - **not counted:** the close (L).
  - Composed pages (home, about, offer, tool, index) never put two text-heavy bands next to each
    other, except where the fixed narrative forces it. Each such pair is marked ⚠ with its reason.
  - Long-form pages instead never run **more than two Prose-only sections in a row**. The breaks
    are a table, Steps, a Media artefact, a Statement or a diagram slot. The first draft said "at
    least every second section"; the case (6–7) and the CPQ article (4–8) broke it, so the rule is
    now stated as a run length, and both pages meet it (see each page).
- **Archetypes** never repeat in adjacent bands, except B after B with the media side flipped.
  There are at most two D bands per page, D-faq included.
- **Centred heads:** never two adjacent bands.
- **Tint** marks the proof bands (a G quote band, home's rating strip) and the close. More than
  one mid-page tint is fine when they sit well apart (visual-direction § 1.7). Two tints never
  touch, and no ground is ever blue. The first draft said "at most one proof band mid-page", which
  home broke on its own sheet (1b and 6). § 1.7 is the rule, so the line now quotes it.
- **Blue solid:** one main action per page, the hero's or the close's (the same ask may repeat).
  Every other action is a link button.
- **Texture** (paper only, at most 3, never adjacent): the end-fade on a no-media hero; `horizon` at
  the foot of the paper band directly above a tint proof band, never above ruled rows or a logo
  grid. Closes carry none (§ 1.7: "the close carries no texture for now"), with one exception
  (owner, 16 Oct 2026): home's island close carries `two-lights` on its tint island.
- **Sliders:** `autoplay` only on a testimonial slider (M5). Every other slider (home's case
  slides, About's service cards) is still and steps on its controls.
- **Media sides** alternate between consecutive media bands. No photograph appears twice on one
  page.
- **Ids:** a band's `id` is its corpus id. A split's second part is `<id>-2`. A heading's id is
  `<id>-heading`. `#enquiry` and `#workspace` (hero actions) must resolve. The builders run
  `aria:check`.
- **`data-band`** carries the archetype letter for `fold:check`. Add the ten routes to
  `fold.config.json`. Index list bands keep CaseStudyIndex's `data-fold-exempt`.

---

## 4 · Pages

### 4.1 `/` — HomePage

> **Superseded by § 17 (Home round 1, 10 Oct 2026).** The table below is pass 1's plan, kept as the
> record of what the owner reviewed.

**Hero (M1):** `beside`, with an **illustration placeholder** (register: the product-decision
survival model, the content team's `visual_plan`). The eyebrow is "Digital product design studio".
The proof line "Founded 2017 · More than 90 projects · Clients in 19 countries · Based in Ahmedabad,
India" becomes PageHero **`tags`**, four of them: "Founded 2017", "More than 90 projects", "Clients in
19 countries", "Based in Ahmedabad, India". That is the studio record, its own proof type, set in the
kit's bulleted hero-facts form after the action, where the line is authored (M1). The title is 43
characters, so tags are allowed. "Start a conversation" is the solid. The lede is 33 words (P3).

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| 1a | `client-recognition` | H: `LogoGrid edges="closed" align="center"`, `context` = the heading (`contextAs="h2"`), six cells (3 × 2) | paper | The boxed logo grid (owner, 8 Oct). Five of the six clients have no approved SVG, and the asset policy says "render names as fallback", so the whole set renders as **name cells** for equal weight (G1). | **split**: the rating moves to 1b. Logos and the aggregate rating are separate proof types and never share a band (owner, 9 Oct). | client logo SVGs ×5 → register | — |
| 1b | `client-recognition-2` | Rating strip, head-less band (`data-band="facts"`): `Stat size="xl" align="center"`, value "4.8", unit "out of 5", label "on Clutch across 13 independent client reviews.", `source` = Button `emphasis="link"` "Read the reviews" (external: `arrow-right-up`, opens in a new tab). No RatingBadge: its Clutch mark would say "Clutch" a second time. | **tint** | The kit's rating-led facts move (`kit/facts` 01) without its head, because the band's heading went to 1a. The sentence's words stay in order across value, unit and label. | from 1a | — | — |
| 2 | `product-situations` | C-icon router: stacked start head, `BlockCardSet frame="box" lead="none" across={3}`, six icon cards (glyph by destination per G12, title = h3, body = paragraph, `cue="cta"`, `ctaLabel` = the link text, e.g. "Product Design"). `lead="none"` is required: six items would otherwise feature the first card. | paper | A reader picks "which one is me" from six conditions, each with its own destination. The icons make it the visual band after the rating strip. | — | — | P4 (bodies 15–27 words; fold) |
| 3 | `selected-work` | Case slider: stacked start head (H-title) + `Slider perView={1}` (no `autoplay`) of four slides. Each slide `<li>` is a template-local composition, `Layout columns={{ lg: [7, 5] }} colGap="section"`: `Media` (the case artefact, capture) + copy (h3, paragraph, `Proof compact` where authored, link button "Read the … case"). `footer`: `CtaRow` "See all case studies". The artefact is the one large thing. There is no card frame and no rating, which keeps it clear of the rejected G-case. | paper | Four real artefacts, each the case's best evidence. One at a time gives each the weight of a media split without four stacked bands. | — | **bound ×4**: `home_doodle_object_model`, `home_dealpath_workflow`, `home_benchmark_scope_selector`, `home_eden_unified_search` | — |
| 4 | `capabilities` | List router: stacked start head, `lead` = the intro paragraph, then six **linked `ListCard` rows** (`href`, title = the service link text with its authored full stop, body = the rest) in a `Layout as="ul" columns={{ lg: 2 }} colGap="column" rowGap="none"`, 3 + 3. It is not `ReadDown`, which takes no `href` and would drop the six links. | paper | The same six services as band 2 but a different job (what each is, not which is mine), so a different shape: rows, not boxes | — | — | P5 (Software Development entry, 40 words) |
| 5a | `why-tcules` | B: `ContentSection arrangement="media"`, photo at the **end**; copy = heading + reasons 1–2 as two side-by-side blocks (h3, paragraph, `Proof compact`) | paper | Reasons with their own client's words (M7). The photograph is the band's large thing. | **split**: reasons 3–4 go to 5b. Four reasons and three quotes (211 words) do not fit one band. | placeholder → register | P7 |
| 5b | `why-tcules-2` | B, media side **flipped** (photo at the start); copy = reasons 3–4 (h3 + paragraph each), the Primelis `Proof compact`, `CtaRow` "How to choose a product design studio" pinned to the photo's foot | paper | B after B with the side flipped is the one sanctioned repeat, and two photo bands keep the run visual before the quote band. `horizon` at its foot if it clears the copy. | from 5a | reuse `about_studio_review` ("We work as part of your team") | — |
| 6 | `client-voices` | M5: G slider, centred head (heading + lead), six slides | **tint** | Quotes only; testimonials are the one sanctioned slider content | — | — | P6 (two quotes over 35 words; speakers repeated from band 3) |
| 7 | `ai-native-practice` | I: `Banner form="beside"` (3:2 photo, copy 477): heading, `lead` = paragraph, action = link button "How we use AI at Tcules" | paper | One idea and one link. The banner gives the short band a photograph instead of a lonely paragraph. | — | placeholder → register | — |
| 8 | `expertise` | M14: icon router, title only, `BlockCardSet frame="box" lead="none" across={4}` (4 × 2), a sector glyph each (G12) | paper | Eight destinations with no copy. Boxed icon cells scan faster than a link line, and they differ from band 2 in count, size and density. | — | — | — |
| 9 | `faq` | M4 | paper | | — | — | — |
| 10 | `enquiry` | M2 | tint | | — | — | — |

**Squint, top to bottom:** split hero with drawing and its four fact tags · name grid (centred) · tinted numeral strip ·
3 × 2 boxes · one big artefact slide · two-column rows · photo-end split · photo-start split ·
centred quote slider (tint) · photo banner · 4 × 2 small boxes · centred accordion · form split
(tint). No two neighbours share a shape.

- **Rhythm:** visual / text-heavy runs V T V V T V V T V V T, then the close: no adjacent
  text-heavy pair.
- **Centred heads:** 1a, 6 and 9, never adjacent.
- **Tints:** 1b, 6 and 10, none touching. 1b and 6 are two proof bands four bands apart, which
  § 1.7 allows.
- **Blue:** the hero's solid only. Every in-band action is a link.
- **Texture:** `horizon` on 5b only (the hero has an illustration).
- **Band count:** 12.

---

### 4.2 `/services/product-design` — OfferPage

**Hero (M1):** `beside` with the **existing product-design illustration** and its cut legend (rule
5, exception). The planned replacement, the content team's
`uncertainty_to_design_medium_map_with_case_pins`, is in the register. The eyebrow "Product Design
services" repeats a crumb (P1). The title is 71 characters (P2) and the lede 32 words (P3). "Start a
Product Design enquiry" is the solid. The proof line "Selected Product Design work: Doodle ·
Dealpath · Eden AI · Auxentios · Scissors" opens with a label, so it goes in `children` (M1), above
the action.

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| 1 | `outcomes` | M12 text cards: centred head, `BlockCardSet lead="none"` text, four across (`size="sm"`; title = the bold label with its full stop), then M6 `Proof compact` (VideoPlasty) a `stack` under | paper | Four outcomes of equal weight, each a short claim and its gloss: peers read across. The quote fits under them (≈ 548). | — | — | — |
| 2 | `starting-points` | M10 D: beside head (start), photo aside, `ReadDown columns={2}` (3 + 2) | paper | Five symptoms in the customer's voice read down beside the heading that frames them | — | placeholder → register | — |
| 3 | `worked-example` | B: `ContentSection arrangement="media"`, the Dealpath artefact at the **end**; copy = heading, three ListCard rows ("The problem." / "What we did." / "The result." as titles), `CtaRow` "Read the Dealpath case" pinned | paper | One story with its proof beside it. The labelled problem, action and result are a record, so they read as rows. | — | **bound** `product_design_dealpath` | — |
| 4a | `complex-products` | M8 case cards: start head (H-full), `BlockCardSet lead="none"` four across (the set takes `wide` 16:9), **unlinked** (no link is authored in this band). An unlinked covered set of three or more scrolls sideways on a phone and is a tab stop, so it takes `label` = the band heading. | paper | Four named products, each with its artefact or cover | **split** (M6): the Auxentios quote goes to 4b | **bound** `product_design_doodle`, `product_design_eden`; Scissors, Auxentios covers → register | P8 |
| 4b | `complex-products-2` | M6 G typographic: `Proof` display, centred, no heading | **tint** | A lone quote gets the type scale it deserves instead of a footnote under four cards. `horizon` at 4a's foot. | from 4a | — | — |
| 5 | `engagement` | B: `ContentSection arrangement="media"`, photo at the **start**; copy = heading, four tiles (2 × 2; "Design and build." takes `bodyHtml`, G3), then M20 `Callout` (the "We are at our best…" paragraph) | paper | Four ways in are peers. The closing paragraph limits the claim, which is the Callout's job. | — | placeholder → register | — |
| 6 | `specialist-capabilities` | M13 icon router: stacked start head, `BlockCardSet frame="box" lead="none" across={3}`, five cards, 3 + 2 with the short row at the start (title = link text, `cue="title"`; body = text after the colon, lower-case as authored, § 0 rule 1) | paper | Five destinations, each a deeper page | — | — | — |
| 7 | `faq` | M4 | paper | | — | — | — |
| 8 | `enquiry` | M2 | tint | | — | — | — |

**Squint:** split hero with drawing · four text cards under a centred head · head-and-photo beside
two columns of rows · copy beside a product capture (end) · four covers · a tinted centred quote ·
photo (start) beside a 2 × 2 and a note · 3 + 2 boxes · centred accordion · form split.

- **Rhythm:** T V V V T V V T. The "complex products" pair splits the only long run of text.
- **Centred heads:** 1, 4b and 7.
- **Tints:** 4b and 8.
- **Media sides:** 2 start, 3 end, 5 start.
- **Band count:** 9.

---

### 4.3 `/audits/design-to-code-audit` — OfferPage

**Hero (M1):** `beside` with an **illustration placeholder** (`visual_plan`
`intent_design_system_implementation_runtime_acceptance`, register). The eyebrow
"Design-to-Code Audit" equals the last crumb (P1). The title is 62 characters (P2) and the lede 31
words (P3). "Start a conversation" is the solid. The proof line "Selected work: Benchmark Gensuite · GT
Tools" goes in `children` (M1, labelled line). The frontmatter's `institutional_trust` and `client_recognition` hints
are not rendered in pass 1: they carry no authored strings (section 9).

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| 1 | `recognition` | M10 D: beside head, photo aside, `ReadDown columns={2}` (2 + 2) | paper | The same symptom-set shape as product-design's `starting-points`, so the family reads as one system | — | placeholder → register | — |
| 2 | `trace` | E: `ContentSection align="center"`, `lead` = the first paragraph; body = `Thread align="center"` (five stages, one row from 1024: title = the bold label without its colon, body = the text after it, all within Thread's 9-word body line), then `ContentSectionText` = the closing paragraph | paper | The list *is* a path from the approved design to sign-off. The visual plan names exactly this chain, so it is drawn on the blue line rather than bulleted. | — | — | — |
| 3 | `classify` | M15: boxed `DataTable` (key "Type of gap"; columns "What happened", "Where the fix belongs"), start head + lead | paper | Five gap types compared on cause and fix: a real table | — | — | — |
| 4 | `deliverables` | B: `ContentSection arrangement="media"`, product shot at the **end** (4:5); copy = heading, four `ListCard form="tile"` tiles in a 2 × 2 `Layout` (title = the bold run-in with its comma, "Every difference we found,"; body = the rest, lower-case as authored), `ContentSectionText` (the paragraph with its Implementation QA link) | paper | What you get is concrete: the difference record shown beside the list | — | placeholder → register | — |
| 5a | `proof` | M8 case cards: start head, `BlockCardSet lead="none"` three across (`wide`), linked: each card's trailing "Read the case" link becomes its `ctaLabel` and `href` (`cue="cta"`), so no link is left in a body. Benchmark's two paragraphs go via `bodyHtml`. | paper | Three real cases with real artefacts | **split** (M6): the Eden quote goes to 5b | **bound** `dtc_audit_benchmark`; GT Tools and Eden AI case covers (their case pages' bound assets) | P9 |
| 5b | `proof-2` | M6 G typographic, centred, no heading | **tint** | As product-design 4b. `horizon` at 5a's foot. | from 5a | — | — |
| 6 | `why-tcules` | M11 B: photo weight, photo at the **start**, two tiles | paper | | — | placeholder → register | — |
| 7 | `faq` | M4 | paper | | — | — | — |
| 8 | `enquiry` | M2 | tint | | — | — | — |

**Squint:** split hero with drawing · head-and-photo beside rows · a centred five-stage line ·
boxed table · copy beside a product shot (end) · three covers · a tinted centred quote · photo
(start) beside two tiles · centred accordion · form split.

- **Rhythm:** V V V V V T V T. Two E bands sit adjacent (2 and 3): a line diagram under a centred
  head against a boxed table under a start head. Their shapes and alignments differ, which is the
  intent of § 3.4's rule. This is a deliberate exception, recorded here.
- **Centred heads:** 2, 5b and 7.
- **Tints:** 5b and 8.
- **Media sides:** 1 start, 4 end, 6 start.
- **Band count:** 9.

---

### 4.4 `/expertise/healthtech` — OfferPage

**Hero (M1):** `beside` with an **illustration placeholder** (`signature_model`: person, question,
sensitive information, connected systems, specialist rules; register). The eyebrow "Expertise ·
HealthTech product design" repeats two crumbs (P1). The title is 74 characters (P2) and the lede 54
words (P3). "Start a conversation" is the solid. The proof line "Selected work: CuramCare · Vovisto" goes
in `children` (M1, labelled line). CuramCare and Vovisto are named as text only (asset policy). The
`independent_reputation` and `institutional_trust` hints are not rendered (section 9).

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| 1a | `hard-parts` | C-icon: start head + lead; M17 legend "Who is using it → What they are wondering"; `BlockCardSet lead="none" frame="none" across={3}`, six **unlinked** icon cards (glyph per persona from G12's HealthTech map, title = who, body = the quoted question with its authored quote marks) | paper | Six people with six questions are peers, not data compared across rows, so they read as people with a glyph each rather than as a grid of cells | **split**: the closing sentence goes to 1b | — | — |
| 1b | `hard-parts-2` | M21 `Statement` "These people rarely meet, so the product has to carry what one of them knows to the next." `align="center"` | paper | The band's conclusion, given the weight of a statement | from 1a | — | — |
| 2a | `approach` | B: `ContentSection arrangement="media"`, photo at the **start** (4:5); copy 667 = heading + principles 1–2 as two side-by-side tiles | paper | Research with real people is the first principle, and the photograph shows it | **split**: principles 3–5 go to 2b | placeholder → register | P10 |
| 2b | `approach-2` | M12 text cards: `BlockCardSet lead="none"` text, three across, no head (title = the bold label with its full stop) | paper | The remaining principles as peers | from 2a | — | — |
| 3a | `proof` | B: `ContentSection arrangement="media"`, product shot at the **end**; copy = band heading (h2), CuramCare h3, two paragraphs, M7 `Proof compact` (sign-off pending: render as written) | paper | A case story, the work first and then the client | **split**: Vovisto goes to 3b | placeholder → register | — |
| 3b | `proof-2` | B, side **flipped** (product shot at the start); copy = Vovisto h3 + two paragraphs | paper | The second case as its mirror. The authoring comments render nothing. | from 3a | placeholder → register | — |
| 4 | `why-tcules` | M11 alternate, D: beside head with `headSide="end"`, photo aside, `ReadDown columns={1}` (two rows; row 1 `bodyHtml`, G3) | paper | A B here would make three B bands in a row (3a, 3b, 4) | — | reuse `about_studio_review` ("Research, design and code in one studio") | — |
| 5 | `faq` | M4 | paper | | — | — | — |
| 6 | `enquiry` | M2 | tint | | — | — | — |

The frontmatter asks for **one** asset here (`healthtech_asset`: "an approved CuramCare **or** Vovisto
screen"). The design reserves a slot for each case, and the register says so. If only one screen is
approved, it goes in 3a, and 3b drops its media to become a head-less `ContentSection` (h3 + two
`ContentSectionText` paragraphs at the body measure). That stays legal: 3b would be text-heavy
between 3a and 4, which are both visual.

**Squint:** split hero with drawing · 3 × 2 persona glyph cards · a centred statement · photo
(start) beside two tiles · three text cards · copy beside a product shot (end) · product shot
(start) beside copy · rows beside a head with the photo at the end · centred accordion · form split.

- **Rhythm:** V T V T V V V T.
- **Centred heads:** 1b and 5.
- **Tints:** the close only. The page has no testimonial band; its one quote lives in its case
  (M7).
- **D bands:** 4 and 5 (two, the cap).
- **Band count:** 9 (6 authored + 3 splits).

---

### 4.5 `/case-studies/benchmark-gensuite-enterprise-suite-modernisation` — LongformPage, case

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow is "Case study · Benchmark Gensuite"
(`case_meta` company). `body` = [lede 1, lede 2]. No actions are authored. The case has no bound
hero image, and its `visual_plan` binds media to bands only, so the hero needs no placeholder.

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| J | `case-thesis` (from the hero) | M21 `Statement` = lede 3 (the technical-leadership line, verbatim), `align="start"`, no eyebrow | paper | The client's own principle, given a statement's weight. A hero holding three paragraphs ran past the fold. | **split from the hero** | — | P11 |
| 1 | `case-context` | Stacked start head "At a glance"; M16 `DataTable` head-less record (4 rows, markdown's header row promoted to the first pair, G4), named by the band heading through `labelledBy` with no visible caption, so "At a glance" is not printed twice; `ContentSectionText` "Related Tcules services: …" (M23 inline) | paper | The facts a skimmer needs, boxed as a record | — | — | — |
| 2–7 | `the-opportunity-…` · `what-the-scope-selector-…` · `scope-selection-…` · `the-prototypes-were-code-…` · `where-the-work-stands` · `what-another-suite-owner-…` | **One shell band** (M19): rail + article. In 2, the "1. Stabilise…" list becomes `Steps` (title "Stabilise.", body the rest). In 4, `Media` scope selector after the list. In 5, `Media` attachments prototype after the third paragraph, the one that names it. The rest is `Prose`. | paper | The argument reads as an article. The steps and the two artefacts break the column every section or two. | — | **bound** `benchmark_scope_selector`, `benchmark_attachments_prototype` | P12 (`where-the-work-stands` repeats itself) |
| 8 | `delivery-impact` | M17 impact cards: centred head; legend "Impact dimension → What changed"; `BlockCardSet lead="none"` text, three across (title = dimension, body = change) | paper | The case's outcome as three equal claims at card scale: a visual peak after the column | — | — | — |
| 9 | `related` | Stacked start head + lead; M8 two linked case cards, `BlockCardSet lead="none"` (the set picks the linked pair's crop). Only link lines are authored, so per M8 each **title is the destination case page's h1**: "A clearer path from print order to production" and "A better way to add listings to Dealpath’s pipeline". `ctaLabel` = the authored link text ("Read the Gold Image Printing case"), `cue="cta"`. `footer`: `CtaRow` "Product Modernisation" (M9). | paper | Two cases to read next, with their covers | — | Dealpath case cover (bound on its case page); Gold Image Printing cover → register | — |
| 10 | `enquiry` | M2 with the scheduling link "See available times" and this case's `on_success` copy | tint | | — | — | — |

**Squint:** stacked title with the end-fade · one large statement · a boxed record · rail beside a
reading column (numbered steps, two full-width artefacts) · three big text cards under a centred
head · two covers · form split. TOC entries are the six shell sections.

- **Long-form rhythm (§ 3):** 2 Steps · 3 Prose · 4 Media · 5 Media · 6 Prose · 7 Prose, then the
  impact cards. The longest Prose-only run is two (6–7). Nothing is added to section 6 or 7: no
  artefact is bound there, and a pull quote would repeat words.
- **J statement:** lede 3 is 21 words against Statement's 14-word ceiling, so it runs four lines at
  the h1 role. That is a known overrun under P11. `as="p"`, because the sentence is a quotation and
  not a heading.

---

### 4.6 `/case-studies` — CaseStudyIndex (extended, G9)

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow "Case studies" equals the crumb (P1). The
title is 61 characters (P2) and the lede 32 words (P3). The action "Tell us about your product" is
authored, so it renders as the solid. The template's 29 Sep rule against a hero action is overridden
by copy, and proposal P15 asks the content team to drop it.

The template decides each section's arrangement from its **position and count**. No band id is
special-cased.

| # | Band id | Component and arrangement | Surface | Why this shape | Image | Proposal |
|---|---|---|---|---|---|---|
| 1 | `featured` | The first section: `BlockCardSet` with `lead="auto"` (the first card featured, ruling C3), titles h3, `bodyHtml` = the paragraph, then the "**Our role:** …" line as a second paragraph (G3; BlockCard's `meta` is an action-row tag such as "PDF · 12 pages" and is too small for a sentence), `ctaLabel` = "Read the … case", `href` = its link, `cue="cta"`. Once the link is lifted out, no body carries a link, so the frame can stay the anchor. | paper | The four the content team leads with, one featured | covers bound on the Doodle, Benchmark, ConnectX and GT Tools case pages | — |
| 2 | `new-products` | 2–4 items: C-image-4, `BlockCardSet lead="none"` (only the first section features), linked whole cards, `cue="title"` (title = the bold run verbatim, e.g. "Auxentios: one quoting product for six specialist roles."; the inline name link becomes the card's `href`, so the title holds no nested link) | paper | Four products at equal weight | Auxentios, Novus, Kirana, OctiFi covers → register | — |
| 3 | `established-products` | 5 or more items: `ListCard` rows, linked, `marker` thumbnail (3:2, 160), two columns (3 + 2) | paper | A denser catalogue shape, so neighbours differ | Dealpath and Chain Hut bound; Gold Image, Ryzeo, Scissors → register | — |
| 4 | `ai-products` | 3 items: C-image-3, `BlockCardSet lead="none"`, linked as band 2 | paper | | Eden AI and BuildTwin (GIF) bound; Omny → register | — |
| 5 | `designed-and-built` | 1 item: a story split, `ContentSection arrangement="media"` with the cover at the start; copy = heading, the linked title line, body, M7 `Proof compact` | paper | One case and its client's words | The Wandering Raven cover → register | P16 |
| 6 | `enquiry` | M2 (the closing gains `form`, G9) | tint | | — | — |

**Squint:** stacked title · one big card and three · four equal covers · thumbnail rows in two
columns · three covers · photo beside a quote · form split. The bands are list bands and keep the
fold exemption.

Every cover in `new-products` is a placeholder (no bound asset exists for Auxentios, Novus, Kirana
or OctiFi), so that band renders four labelled panels until the covers land. This is a known cost of
the image rule, not a builder fault.

---

### 4.7 `/tools/design-system-drift-checker` — ToolPage

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow is "Free tools · Design systems".
`body` = [lede 1, lede 2]. "Open the checker" (`#workspace`) is the page's one solid. No conversion
is authored, so the page has no form.

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| 1 | `how-to-use-it` | B: `ContentSection arrangement="media"`, photo weight (6:5 in 667), product shot at the **end**; copy = heading + two paragraphs (`ContentSectionText`) | paper | `visual_requirements` asks for the tool beside the instructions | — | placeholder (`v11_tool_interface`) → register | — |
| 2a | `workspace` | Stacked start head + `lead` (paragraph) + M24 the tool-mount panel at full column | paper | The tool is this page's large object | **split**: the h3 item goes to 2b | — (tool, G10) | — |
| 2b | `workspace-2` | Head-less `ContentSection` (ContentSection's heading is always an h2, so it cannot carry this h3). Its body is one `Layout rowGap="block"`: a template-rendered `<h3 id="what-should-a-design-system-drift-check-inspect">` (the base h3 role from `globals.css`), then the M15 boxed `DataTable` (key "Follow the component through", `labelledBy` = that h3's id), then a `stack` to `ContentSectionText` (the closing paragraph). | paper | A checklist compared across four stages. It stays a table: two different columns are read across each stage, which is 7 Oct ruling 1's test. | from 2a | — | — |
| 3a | `reading-your-results` | Stacked start head + `lead` (paragraph 1) + M20 `Callout` (the worked-example paragraphs 2–3) | paper | The worked example is explicitly bounded ("not a client result") | **split**: the table goes to 3b | — | P13 |
| 3b | `reading-your-results-2` | M15 boxed `DataTable` (key "Finding") | paper | | from 3a | — | — |
| 4 | `what-this-does-not-tell-you` | Stacked start head + `ContentSectionText` (two paragraphs, the external Storybook link) | paper | A limits note. It stays plain. | — | — | — |
| 5 | `next` | M3 (inline links): `ContentSection` on tint + `ContentSectionText`, no CtaRow (the links are in the sentences) | tint | The page's close position | — | — | — |

**Squint:** stacked title · copy beside a tool shot · the tool panel · boxed table · head with a
note box · boxed table · two plain paragraphs · tinted close.

- **Rhythm:** V V V T V T, then the close.
- **Band count:** 7. Tools are utility pages; the 8–12 band rule is the service and showcase
  pages'.

---

### 4.8 `/insights/cpq-ux-design` — LongformPage, article

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow is "Insights · SaaS · Data-heavy". The
byline line (author, role, "Last updated on 7 Oct ’26 · 11 min read") goes in `children`, verbatim.
PageHero's `credits` / `dates` would replace its words, so they are not used. `body` = [the
standfirst]. At 57 words the standfirst is over the hero budget, but it is the article's answer-first
summary on an SEO page, which may compromise (7 Oct). No proposal.

| # | Band id | Component and arrangement | Surface | Why this shape | Image |
|---|---|---|---|---|---|
| 1–9 | `how-should-…` → `cpq-ux-checklist` | **One shell band** (M19), with nine sections in the rail. In 2, a boxed `DataTable` (empty key head as authored; columns "Rep-assembled quote", "Expert-assembled quote"; `labelledBy` = the section's h2 id, since an empty key head would otherwise name the region " table", G4). In 3, a **diagram slot** after the "responsibility map" paragraph, and the five questions as Prose `<ol>`. **In 4, the four design moves as `Steps`**: "Four design moves follow." stays Prose, then four numbered rows, each title = the paragraph's first sentence ("Say why an option is unavailable.") and body = the rest of the paragraph via `bodyHtml` (G3; the citation links survive). Prose resumes at "The people who maintain the rules…". **In 6, a second diagram slot** after the bulleted list: two versions of one quote side by side, the changed lines marked and the change that moved the price called out. It is the list's "compare versions side by side" made visible. In 9, the checklist as a boxed `DataTable` (8 rows, `labelledBy` = the h2). Everything else is `Prose`. | paper | A reading page. Two tables, two diagrams and the numbered moves break the column. The longest Prose-only run is two (7–8). Without the Steps and the second diagram, 4–8 was five Prose sections in a row. | two diagram placeholders (the six roles around one quote; the version comparison) → register |
| 10 | `where-this-work-sits` | M3 (inline links): `ContentSection` on tint + `ContentSectionText` + `CtaRow rule={false}` "Tell us where quotes slow down or need rework" (→ `/contact`) | tint | The close | — |

**Squint:** stacked title with byline · rail beside a long column (table, diagram, numbered list,
numbered moves, diagram, table) · tinted close.

---

### 4.9 `/glossary/design-system` — LongformPage, term

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow "Glossary · Design System" repeats both
crumbs (P1). The title is "Design system". `body` = [lede 1], one paragraph: the definition with
its "When it matters:" clause inline, as authored (P14). Ledes 2 to 5 leave the hero (J, then
`definition-2`).

| # | Band id | Component and arrangement | Surface | Why this shape | Split |
|---|---|---|---|---|---|
| J | `definition` (from the hero) | M21 `Statement` = lede 2 ("The boundary between … component count.") | paper | The term's sharpest sentence as a statement | **split from the hero** |
| — | `definition-2` + `practice` + `comparison` | **One shell band** (M19): the rail lists `practice` and `comparison`. The head-less `definition-2` section holds `Prose` (ledes 3–5 with their links). `comparison` has a lead sentence + a boxed `DataTable` (key "Component library"; column "Design system"; `labelledBy` = the h2). It stays a table rather than a Contrast: its rows pair up line by line (what each is, what it answers, what it needs), and two free lists would lose that pairing. | paper | A definition page reads as an article | from the hero |
| — | `next` | M3 (no inline links): `CtaSection open`: heading, `body=[sentence]`, `actions=[See Design Systems]` (the solid) | tint | | — |

**Squint:** stacked title · statement · rail beside the column (prose, prose, a boxed table) ·
centred ask. Images: none. The term family carries none by default.

---

### 4.10 `/about` — AboutPage

**Hero (M1):** `stacked`, no media, `texture`. The eyebrow "About Tcules" repeats the crumb (P1).
The title is a 126-character sentence, authored in bold; it renders as plain h1 text, since a bold
h1 says nothing (P2). `body` = [lede 1]. No actions are authored.

| # | Band id | Component and arrangement | Surface | Why this shape | Split | Image | Proposal |
|---|---|---|---|---|---|---|---|
| S | `studio` (from the hero) | B, head-less: `ContentSection arrangement="media"`, photo at the **end**, `weight: 'photo'` (6:5 in the 7 track; critic C3.5); copy = `ContentSectionText` × 3 (ledes 2–4), centred on the photo (§ 3.2 rule 2: no action) | paper | The founding facts and "Product Design sits at the centre" stay together as the opening paragraphs. As plain paragraphs under a no-media hero, the page's first two viewports were all text: a 126-character title, a lede and three paragraphs. With a photograph, S and band 1 open as a zig-zag (photo end, then photo start), which is B after B with the side flipped. | **split from the hero** | placeholder → register (studio photo) | P17 |
| 1 | `ahmedabad-is-part-of-how-we-work` | B: `ContentSection arrangement="media"`, photo at the **start**; copy = heading + four paragraphs | paper | The studio and its people, the band's own bound photograph | — | **bound** `about_studio_review` | — |
| 2 | `the-practice-keeps-moving` | Stacked start head + `ContentSectionText` (four paragraphs) | paper | An argument in prose | — | — | P17 |
| 3 | `what-we-do` | C-icon slider: stacked start head + `Slider perView={3}` (no `autoplay`) of six `BlockCard frame="box"` icon cards (glyph per G12, h3, two paragraphs via `bodyHtml`, `cue="cta"`, `ctaLabel` = the authored "Explore …" link text, `href` = its link). Software Development's body carries the AI engineering link, so all six take G3's static frame, with the cta as each card's one anchor. | paper | Six services with long bodies: three in view keeps each readable without a 2 × 3 wall past the fold | — | — | — |
| 4 | `who-we-work-with` | Centred head, `lead` "Three situations recur:", M12 text cards `BlockCardSet lead="none"` three across (the bold run-in = title; body = the rest, lower-case as authored), then `ContentSectionText align="center"` (the two closing sentences, a centred coda; critic C3.3) | paper | Three client situations as peers | — | — | — |
| 5a | `difference` | B: `ContentSection arrangement="media"`, photo at the **end**; copy = heading + items 1–2 as two `ListCard form="tile"` tiles (h3 + paragraphs via `bodyHtml`) | paper | | **split**: items 3–5 go to 5b | placeholder → register | P17 |
| 5b | `difference-2` | the same `ListCard` tiles as 5a, three across (`ListTiles columns={3}`; critic C3.2), no head (bodies of two paragraphs via `bodyHtml`); `footer`: `CtaRow` "How AI-native Product Design works at Tcules" | paper | | from 5a | — | — |
| 6 | `how-we-work` | D: beside head (start), photo aside, body = `Accordion` (five items: question = h3, answer = paragraphs) | paper | Five working principles, two paragraphs each. Closed, the titles alone tell the story: this is the fold remedy § 1.3 names first. | — | placeholder → register | P17 |
| 7 | `leadership` | B, photo at the **end**; copy = heading, two leader blocks (h3, bio, LinkedIn link button), the studio paragraph, "Follow Tcules on LinkedIn" (links stacked one per line) | paper | Two people and the team behind them | — | **bound** `about_team` | — |
| 8a | `work-you-can-inspect` | M8 case cards: start head, `BlockCardSet lead="none"` four across (`wide`), linked whole cards, `cue="title"` (title = the link text, `href` = its link, body = the rest of the sentence, lower-case as authored, e.g. "shows research changing …") | paper | Four cases, each named for what it proves | **split**: the Lab paragraph and the all-cases link go to 8b, because the band's bound photo may not sit beside clickable cards (9 Oct) | Doodle, Benchmark, GT Tools covers (bound on their case pages); Omny → register | — |
| 8b | `work-you-can-inspect-2` | B, head-less, photo at the **start**; copy = `ContentSectionText` (the Lab paragraph) + `CtaRow` "Explore all case studies", centred on the photo | paper | The working wall shows the practice | from 8a | **bound** `about_work_wall` | — |
| 9 | `testimonials` | M5 G slider, centred head (no lead), three slides | **tint** | | — | — | — |
| 10 | `company-record` | M16: start head + two boxed `DataTable` halves (8 + 8 rows, each with the authored header row "Fact · Current public record") side by side from 1024 | paper | Sixteen facts as a record that holds the fold | — | — | — |
| 11 | `frequently-asked-questions` | M4 (nine questions) | paper | | — | — | P17 |
| 12 | `what-remains-constant` | B: `ContentSection arrangement="media"`, photo at the **end**, `weight: 'photo'` (6:5; critic C3.5); copy = heading + `ContentSectionText` × 4 (the four short paragraphs), centred on the photo | paper | The coda: "Ahmedabad is where the practice took shape. The world is where the work goes." is a sentence about place, which a photograph of the studio in its city shows and a paragraph cannot. It also ends the T–T pair the first draft accepted (the FAQ, then a text coda), which broke the owner's 7 Oct rule. A photograph fixes it without touching the order. | — | placeholder → register (studio photo) | — |
| 13 | `work-with-tcules` | M3: `CtaSection open` (heading, `body=[para]`, `actions=[Start a conversation → /contact]`, the page's one solid) | tint | | — | — | — |
| 14 | `careers` | I: `Banner form="below"` (`tight`): a stacked head (heading, `lead` = paragraph, link-button action "Explore careers at Tcules") over a 3:1 photograph | paper | A second ask after the close is authored, so it takes a link and a photograph rather than a second solid. It is `below` and not `beside`, so it does not repeat 12's photo-beside-copy two bands later, and a wide studio panorama ends the page the way kit/about's Holi frame opened it. | — | placeholder → register | P19 |

**Squint:** stacked long title · paragraphs beside a photo (end) · photo (start) beside text ·
plain prose · three-up card rail · three text cards (centred) · photo (end) beside two tiles · three
text cards · head-and-photo beside an accordion · photo (end) beside two people · four covers ·
photo (start) beside a note · tinted quote slider · two boxed halves · centred accordion · coda
beside a photo (end) · tinted ask · head over a panorama.

- **Rhythm:** V V T V T V T V V V V T V T V, then the close and the careers banner. There is no
  text-heavy pair, and no ⚠ is needed.
- **Media sides:** S end, 1 start, 5a end, 6 aside (start), 7 end, 8b start, 12 end; 14 is centred
  (`below`).
- **Texture:** the hero's end-fade, and `horizon` at the foot of 8b, the paper band directly above
  the tint testimonials. Two placements, none adjacent.
- **Centred heads:** 4, 9 and 11.
- **Tints:** 9 and 13.
- **D bands:** 6 and 11.
- **Band count: 17** (14 authored + 3 splits). This is over the 8–12 cap. `fold:check` will report
  it, and P17 asks the content team to consolidate.

---

## 5 · Placeholders (how a deferred image renders)

**G5, no component change.** A script, `npm run placeholders`, reads `docs/image-register.md` and
writes one SVG per row to `public/placeholders/<route-slug>--<band>--<n>.svg`, at the row's ratio. A
case-cover row is one asset for every page that cites it, written once as
`public/placeholders/case-cover--<case-slug>.svg` at 16:9 and cropped by each placement.
Each SVG carries a neutral ground, a hairline and a label: "Image to come · <kind>" plus the "what it
shows" line.

The page passes the SVG as an ordinary image record with `kind: 'capture'`. A capture renders whole,
with its hairline, at the reserved ratio, in every slot that already exists (PageHero `media`,
ContentSection `media` and `aside`, BlockCard cover, Banner image, ListCard thumbnail). It never
enters the photograph tone and resolution gates.

When the real asset lands, the record's `src` changes and the register row is deleted. Labels are
part of the placeholder, not type laid over an image, so the "no type on images" rule is not
engaged.

The illustration-hero placeholders use the illustration slot's ratio (5:4). They are captures, not
`kind: 'illustration'`, so PageHero does not try to centre an unboxed drawing.

---

## 6 · Gaps: what no kit unit expresses today

The test for each (job-is-not-a-component): composition first; a prop only where composition
cannot; a new unit only for its own markup, behaviour or arrangement.

| # | Need | Why composition cannot serve it | Smallest change | Unit owner |
|---|---|---|---|---|
| **G1** | Client names without an approved logo | `LogoGridMark` is a `ClientMark` (an SVG mask) and has no text form. The asset policy says "render names as fallback; never invent a logo asset". | `LogoGridMark` accepts `{ name }` with no `src`. When any mark in a set lacks one, every cell renders its name (set-level, so weights stay equal) in a sans title role, centred in the cell. | LogoGrid |
| **G2** | The corpus enquiry form | The `enquiry` variant's fields match (email, work, URL), but: the URL label "Product or company URL" is not in `EnquiryUrlLabel`; `scheduleHref` is **required**, while only cases author a scheduling link and no scheduling destination exists anywhere in `routes.ts`; and the success heading and body are hard-coded where the corpus authors them (`on_success`) | (a) add `'Product or company URL'` to `EnquiryUrlLabel`; (b) make `scheduleHref` optional on `enquiry`; (c) add `success?: { heading: string; body: string }` | EnquiryForm |
| **G3** | An item body that carries inline links, bold runs or several paragraphs | BlockCard, ListCard and ReadDown take `body: string`, so a link would be flattened. BlockCard also renders its whole frame as the `<a>` whenever `href` is set, whatever the cue, so a link in its body would be an anchor inside an anchor (invalid, and it breaks the inner link). | (a) `bodyHtml?: string` (trusted, seam-sanitised: the contract DataTable cells already use), exclusive with `body`, on BlockCard and ListCard, passed through by ReadDown, Steps and BlockCardSet items. (b) A **static-frame mode** on BlockCard: with `href` and `cue="cta"`, a prop (`linkScope: 'card' \| 'cta'`, default `card`) keeps the frame a `<div>` and makes the cta Button the card's only anchor. BlockCardSet takes it for the whole set, like `frame`. Only About `what-we-do` needs (b) in pass 1. | BlockCard; ListCard |
| **G4** | A key/value record with no header row ("At a glance"), and tables whose name is the section heading | DataTable requires `keyColumn.heading` and `columns[].heading`, so the head row would be invented or empty. Without a `caption` it names its scroll region `` `${keyColumn.heading} table` ``, which is " table" when the key head is empty (the CPQ decision table). A caption that repeats the band heading would print it twice. | (a) A `head={false}` record form: rows only, at most one value column. (b) `labelledBy?: string`, the id of the heading that already names the table, used for the region and the `<table>` when there is no caption. Every corpus table passes its section or band heading's id. No visible caption anywhere in pass 1, because none is authored. | DataTable |
| **G5** | Labelled image placeholders | — | none: script-generated SVGs (section 5) | script |
| **G6** | Inline runs → HTML for the rich slots | — | `inlineToHtml` in `src/lib/inline.ts` | lib |
| **G7** | Templates typing against corpus pages | Templates may not import `@/content` | the view-model types move to `src/lib/corpus-types.ts` | content seam |
| **G9** | The case index's groups, hero action and form close | CaseStudyIndex renders one flat set, refuses a hero action and closes with `open` only | `hero.action?`; `sections?: { id, heading, items, quote? }[]` (each section's arrangement decided by position and count, section 4.6); `closing.form?`; `bodyHtml` passed through to BlockCard (G3) | CaseStudyIndex |
| **G10** | The Drift Checker record builder (manual evidence record, browser-only, markdown export) | It has its own behaviour and markup, so it qualifies as a new unit. It is a product feature, not a page layout, and is gated by `TOOL_PRODUCTION_ACCEPTANCE`. | Pass 1 renders a labelled panel in `#workspace`. The tool gets its own spec (`docs/specs/DriftChecker.md`) later. | — |
| **G12 / G13** | Glyphs per destination; quote attributions | — | lib maps and a parser (section 1.3). The maps, from the glyphs that exist today (`iconNames`): **services** product design `ruler-pen`, product modernisation `shield-check`, design systems `layers`, AI product UX `stars`, design engineering `monitor`, software development `database`, new product design & first release `flag`. **Product-design specialists:** UX research `eye`, IA & workflow `widget`, interaction & UI `smartphone`, data visualisation `graph-up`, prototyping & usability testing `clipboard-check`. **HealthTech personas:** patient or family member `user`, clinician `checklist`, carer on a phone `smartphone`, professional in a portal `monitor`, operations team `users-group-rounded`, compliance lead `shield-check`. **Expertise sectors:** B2B SaaS `widget`, AI & developer tools `cpu`, data & analytics `graph-up`, marketplaces `users-group-rounded`, MarTech & SalesTech `chat-round-dots`. Commerce, FinTech and HealthTech have no fitting glyph, so the builder adds three Solar Bold glyphs to `src/lib/icon-glyphs.ts` (a cart, a wallet, a heart-pulse) in the same solid family. That is data in a primitive, not a new unit. | lib; Icon glyph data |
| **G15** | The case slide (home `selected-work`) | — | none: template-local composition of Slider + Layout + Media + Proof + CtaRow. It is not reused outside HomePage. If a second page ever needs it, promote it then. | HomePage |

**Considered and not needed:**
- a new "related services" unit (M23 covers it);
- a facts-row component (Stat composes the rating);
- a statement with a body (split instead);
- a testimonial-group unit (Slider + Proof);
- a placeholder primitive (G5).

---

## 7 · Expected fold overruns (copy as written; each has a proposal)

| Page · band | Why | Proposal |
|---|---|---|
| every hero with a title > 48 characters or a lede > 26 words | 4–5 title lines at display scale, plus a long lede, beside 424–505 of illustration | P2, P3 |
| `/` · `product-situations` | six card bodies of 15–27 words, against the ≤ 14-word budget | P4 |
| `/` · `client-voices` | two quotes run 42 and 47 words in a quote-lg slide | P6 |
| `/services/product-design` · `complex-products` | card bodies of 17–33 words, against ≤ 12 | P8 |
| `/audits/design-to-code-audit` · `proof` | the Benchmark card body runs 60 words over two paragraphs | P9 |
| `/expertise/healthtech` · `approach` (2a) | principle bodies of 27 and 32 words | P10 |
| `/about` · page | 17 bands; FAQ of nine items (budget ≤ 7 closed) | P17 |
| `/case-studies/benchmark-gensuite-…` · `case-thesis` (J) | 21 words against the statement's 14, so four lines at the h1 role | P11 |
| `/insights/cpq-ux-design` · section 4 Steps | Step bodies of 50–90 words: a reading column, so no fold rule applies inside the shell; listed so nobody trims them | — |

---

## 8 · Companion files

- **`docs/content-proposals.md`:** P1–P19, one entry each (page · band · problem · proposal · why).
  P18 and P19 were added by the critic.
- **`docs/image-register.md`:** one row per placeholder slot. A case cover cited on several pages is
  one row naming every page, so one asset is briefed once.

---

## 9 · Open issues for the next stage

1. **Frontmatter hints with no authored strings are not rendered:** `institutional_trust` (audit,
   healthtech), `independent_reputation` (healthtech), `client_recognition` (audit), and
   `trust_module_policy: required_commercial_relation_module` (home, product-design). Rendering
   them means writing labels, which is the content team's call. Home's hero proof line already
   carries the institutional facts verbatim.
2. **Studio photo reuse** (rule 5.3) depends on the Cloudinary masters' size, which is unmeasured.
   If `about_studio_review` fails the 1.9× rule at a slot, that slot becomes a placeholder and its
   row is added to the register.
3. **Duplicate speakers on `/`:** Stephanie Leue (Doodle) and Samy Melaine (Eden AI) are each quoted
   in both `selected-work` and `client-voices`, with different quotes. They render as written (P6).
4. **The scheduling destination** for "See available times" is named nowhere, so G2 (b) is needed
   even on the case page until it is.
5. **`/services/product-design` hero:** the interim illustration predates this copy. The register's
   illustration replaces it when it is drawn, to the illustration standard.

---

## 10 · Critic changes (10 Oct 2026)

What the critic checked: every band of the ten source files against this sheet, in order (band
order, splits, words, bound images); the squint test per page; each named component and prop
against the code on `origin/main`; the kit rulings (visual-direction 7 and 9 Oct, review-7-oct,
the owner memory). No band was found reordered, merged or dropped, no copy was implied cut, and no
bound asset was ignored. The changes below are fixes to feasibility, kit fidelity and beauty.

| # | Where | What was wrong | Change |
|---|---|---|---|
| C1 | home · `capabilities` | `ReadDown` rows take no `href`. Built as written, the six service links would have been dropped silently. | Linked `ListCard` rows in a two-column `Layout`. M10 now says ReadDown is for rows nobody clicks. |
| C2 | every 4+ card set (home 2 and 8, product-design 1, 4a and 6, healthtech 1a, about 4 and 8a, index 2) | BlockCardSet's `lead` defaults to `auto`, which features the first card from four items. Unstated, every feature set would have rendered a featured lead, against § 1.4 rule 4. | `lead="none"` stated on every set; M8, M13, M14 and M17 carry it. `auto` remains only on `/case-studies` `featured`. |
| C3 | M2 note, G3, about `what-we-do` | "A card with a body link takes `cue="cta"`, not a whole-card link" was not true of the code: BlockCard wraps the whole frame in the `<a>` whenever `href` is set, so a body link would be nested. | G3 adds a static-frame mode (`linkScope`), set-level. About's six service cards take it together. |
| C4 | G4, case `case-context`, CPQ tables, glossary, tool 2b | "The band heading as `caption`" would print "At a glance" twice. An empty key head (CPQ) named the table region " table". | G4 adds `labelledBy`. Every corpus table is named by its existing heading, with no visible caption. |
| C5 | case · `related` | Only link lines are authored, so M8's "title = the case name as authored" had nothing to read. A builder would have had to write a title. | M8: where only a link line exists, the title is the destination case page's own h1, from the corpus. Both titles are written into the row. |
| C6 | tool · `workspace-2` | ContentSection's heading is always an h2, so the authored h3 with its id had no home. | A template-rendered `<h3>` with its authored id as the band body's first block, and the table `labelledBy` it. |
| C7 | CPQ article, sections 4–8 | Five Prose-only sections in a row broke the sheet's own long-form rule. | Section 4's four design moves become `Steps` (first sentence = title, every word kept). Section 6 gets a version-comparison diagram slot, now in the register. § 3 states the rule as "never more than two Prose-only sections in a row". The case meets it (6–7). |
| C8 | about · hero → S → 1 | A 126-character title, a lede and then three head-less paragraphs made the page's first two viewports pure text. | S becomes a head-less B with a studio-photo placeholder, photo at the end. It and band 1 open as a flipped pair. |
| C9 | about · 11 → 12 | The FAQ and then a text coda, marked ⚠ and accepted, broke the owner's 7 Oct rule ("never two text-heavy bands back to back"). | The coda becomes a B with a studio-photo placeholder (photo at the end). Order unchanged. The ⚠ is gone. |
| C10 | about · `careers` | With C9, a beside banner two bands after the coda's B would repeat photo-beside-copy. | `Banner form="below"`, a head over a 3:1 panorama. The register row moves from 3:2 to 3:1. |
| C11 | home · hero | The studio record sat in `children`, which renders **above** the action, although it is authored below it. It was also a quiet line where the kit has a form for exactly this: § 3.8's bulleted hero facts. | `tags`, four of them, rendered after the action. M1 now separates label-less fact runs (`tags`) from labelled lines (`children`). |
| C12 | home · `client-recognition-2` | The strip used a CtaRow, and its exact Stat props were left open. | `Stat size="xl" align="center"` with the link in Stat's own `source` slot. No RatingBadge, because its mark would repeat "Clutch". |
| C13 | § 3 tint rule | The sheet's own rule ("at most one proof band mid-page") contradicted its home page and visual-direction § 1.7. | The rule now quotes § 1.7: proof bands and the close; more than one is fine when apart; never adjacent. |
| C14 | § 0 rule 1 | Labels were handled differently from row to row: colons dropped silently, full stops sometimes kept, run-in bodies unaddressed. | One rule: a colon goes when a label becomes a title, a full stop or comma stays, a lower-case run-in stays lower-case, and a lone link line's full stop goes when the link becomes a button. P18 logs the run-ins for the content team. |
| C15 | G12 | "A glyph per destination" named no glyphs, and the set has about fifty, so a builder would have guessed. | A concrete map for all four routers, from `iconNames`. Three missing sector glyphs (commerce, FinTech, HealthTech) get added to `src/lib/icon-glyphs.ts`. |
| C16 | healthtech · `proof` | The frontmatter asks for one asset ("CuramCare **or** Vovisto"), and the sheet reserved two slots without saying so. | A stated fallback: one screen goes in 3a, and 3b becomes a head-less text band, still legal between two visual bands. |
| C17 | sliders | Autoplay was unstated outside M5. | § 3: `autoplay` only on testimonial sliders. |
| C18 | audit · `trace`, `deliverables`, `proof` | "Centred head from 1024" was not a prop. Run-in tiles and lifted case links were not specified. | `ContentSection align="center"` + `Thread align="center"`; `ListCard` tiles with comma titles; each "Read the case" link lifted to its card's `ctaLabel`/`href`. |
| C19 | about · `careers` (after the close) | A second ask after the close went unlogged, although the close is meant to be last. | P19 (proposal only; the order stands). |

**Left as the mapper had it, on purpose:**
- the product-design hero's existing illustration (keep-what-was-approved);
- home's case slider (the artefact is the one large thing, there is no card and no rating, and the
  slides stay in the DOM);
- audit 2 → 3, a line diagram then a table (two E-class bands, different shapes and alignments);
- the glossary and audit tables, which stay tables because their rows pair or compare;
- healthtech's persona cards (a table whose rows are peers, which the owner's "change how an item
  is shown" allows).

---

## 11 · Build notes, batch B1 (`/`, `/services/product-design`, `/audits/design-to-code-audit`, `/expertise/healthtech`)

Where the build departs from this sheet, and why. Everything else is built as specified.

| # | Where | Sheet said | Built | Why |
|---|---|---|---|---|
| B1.1 | `/` · `selected-work` | slide tracks `[7, 5]`; the band's "See all case studies" a `CtaRow` footer | tracks `[1, 1]`; the link at the end of the heading's row (`actionsAt="end"`, 7 Oct ruling 5) | at `[7, 5]` the Doodle slide's 38-word quote ran 5 lines at 477 and the band measured 979; `[1, 1]` and the head link bring it to 807, inside the fold. A layout decision, not a gap or a type step |
| B1.2 | `/` · `why-tcules-2` | reuse `about_studio_review` | a placeholder (register row added: `/` `why-tcules-2`, studio photo, 4:5) | the file is 960 × 720; the 4:5 slot needs 906 × 1133 (§ 5.4). The same file passes at healthtech `why-tcules` (head-track aside 3:2 needs 724 × 483), so it is used there |
| B1.3 | `/` hero | four `tags` | `PageHero` sets exactly four tags 2 × 2 | in three columns a 21-character mono tag filled its 175 column and touched its neighbour's pixel, and four set 3 + 1. A count rule on the kit's tags grid, shown at `/design/kit/hero` |
| B1.4 | the three family routes | "switch the family" | one allowlist (`PASS_1_OFFER_ROUTES`, `src/app/_corpus/offer.tsx`); the other pages of each family keep their current source | § 1.2: the 86 unverified corpus pages must not switch silently. `generateStaticParams` returns the allowlisted slugs; every other slug still renders from its current source (`dynamicParams` is the default) |
| B1.5 | `kit` extensions | G3 `linkScope`, G4 head-less record | not built | no B1 page needs either (no card with a link in its body carries an `href`; no table lacks a header row). They belong to the About and case batches |
| B1.6 | item titles inside a band | "h3" | an `h3` element at the h4 role (`.itemTitle`) | the h3 role beside the band's h2 read as a second band title (a reason, a case in a slide, a case story) |
| B1.7 | `/` · `client-recognition` | name cells | name cells for all six, Doodle included | LogoGrid's set-level rule: one client without a mark and every cell is its name, so weights stay equal |

Extensions to approved pieces, each the smallest the job needed and none a restyle: `LogoGridMark`
accepts a name (G1); `EnquiryForm` takes `urlLabel="Product or company URL"`, an optional
`scheduleHref` on `enquiry` and `success` (G2); `BlockCard`, `ListCard`, `ReadDown` and `Steps` take
`bodyHtml` (G3a); `DataTable` takes `labelledBy` (G4b); `ContentSection` takes `id`; `PageHero`'s tag grid
is 2 × 2 at four tags; `Icon` gains `cart`, `wallet` and `heart-pulse`.


## 12 · Critic pass, batch B1 (10 Oct 2026)

Shot at 1440 and 390 and read band by band. Copy fidelity was re-checked against the raw markdown
(not the corpus parser): every sentence of the four sources renders verbatim and every `##` band is in
document order. The one fragment not on the page at rest is each form's "After sending" line, which is
the success view's body and appears after a submit. Each note below names its cause and where the fix
lives.

| # | Where | Seen | Cause | Fix | Lives in |
|---|---|---|---|---|---|
| C1.1 | `/` · `why-tcules` | two reasons side by side, each quote at 28 in a ~306 track: four words a line, the Eduard Stinga quote ran seven lines, and the quotes outweighed the photograph | the compact quote's size ignored the measure it is set in | Proof's compact figure is its own size container; under a 30rem track it takes the new `--text-quote-sm` (22 / 1.4, `--text-quote`'s own phone step, no breakpoint step). The two quotes drop to four and three lines and the band reads as photo + two reasons. The group arrangement (approved, three peers at ~390) is untouched | `Proof.module.css`, `tokens/primitives.css`; specimen `/design/proof` § 18 |
| C1.2 | `/expertise/healthtech` · `approach` / `approach-2` | the split's last three principles set as BlockCardSet text cards a type step above the first two ListCard tiles; at 390 the bodies were 16 against 14 | the split's two halves were drawn with two different components | `approach-2` renders the same `ListCard` tiles as `approach`, three across (`tiles(rows, 3)`) | `OfferBands.tsx` |
| C1.3 | `/expertise/healthtech` · `hard-parts-2` | the statement split carried no anchor (§ 3: a split's second part is `<id>-2`) | `Statement` applied `id` to its h2 only, and a `p` statement has none | with `as="p"`, `Statement`'s `id` goes on the band; the template passes `hard-parts-2` | `Statement.tsx`, `OfferBands.tsx` |

Looked at and kept, with the reason:

- **`/expertise/healthtech` · `why-tcules`** sets its head at the end (`headSide="end"`). The photo
  alternates with Vovisto's start-side photo directly above (§ 3, media sides). The arrangement is the
  kit's approved mirror; the head stays first in the DOM and on a phone.
- **`approach` → `approach-2`** keeps a full section seam between the two halves. Unsplit, the band runs
  past the fold (P10). With one tile type the second half reads as the set's continuation.
- **Placeholders** in small slots (an aside of 3:2 at 381, a 16:9 cover) print their label small.
  They are stand-ins for the register's assets and do not ship.


## 13 · Build notes, batch B2 (`/case-studies/benchmark-gensuite-…`, `/case-studies`, `/tools/design-system-drift-checker`)

Where the build departs from this sheet, and why. Everything else is built as specified.

| # | Where | Sheet said | Built | Why |
|---|---|---|---|---|
| B2.1 | `/case-studies/benchmark-gensuite-…` · `enquiry` | M2 with the scheduling link "See available times" | no scheduling link | G2 (b) made `scheduleHref` optional, but no scheduling destination exists anywhere in `routes.ts`, so a link would point nowhere. The link is not authored copy (it is a frontmatter label), so no word is lost. It arrives with the destination |
| B2.2 | `/case-studies/benchmark-gensuite-…` · `related` | the cards' covers: Dealpath bound, Gold Image Printing a placeholder | as specified | The Gold Image Printing card shows the register's labelled placeholder until its cover lands |
| B2.3 | `/case-studies/benchmark-gensuite-…` · outline | "TOC entries are the six shell sections" | the six headings as labels | each is 38–74 characters and clamps to two lines in the rail. No label was shortened (copy rule); P24 asks for navigation labels |
| B2.4 | `/case-studies` · `designed-and-built` | the cover at the start, the Wandering Raven placeholder | as specified, but the placeholder is the 16:9 master cropped to 4:5, so its label is cut at the crop | a register row at 4:5 would fix it once; the real cover replaces the panel |
| B2.5 | the three family routes | "switch the family" / `generateStaticParams` from the corpus list | one allowlist per family (`PASS_1_CASE_ROUTES`, `PASS_1_TOOL_ROUTES`), as B1.4 | § 1.2: the unverified corpus pages must not switch silently |
| B2.6 | `CaseStudyIndex` | G9 | `hero.{eyebrow, lede, action, texture}`, `sections`, `closing.{form, id}`, `bodyHtml` and `ctaLabel` on an item, all optional; the flat `items` form and its callers are untouched | a section's arrangement is decided from its position and count (see the type's doc) |
| B2.7 | `DataTable` | G4 (a), a head-less record | `head={false}` | B1.5 deferred it to this batch |
| B2.8 | the tool mount | M24, a labelled panel | `ToolMount` in `ToolPage`, with `--cpg-panel-*` tokens in `tokens/components/corpus-page.css` on all four surfaces | the panel is a hairline box with two lines of text; the tool is gated by `TOOL_PRODUCTION_ACCEPTANCE` |

`LongformPage` was built for the case family only (`family="case"`). Its shell, Steps detection, artefact
placement and renderers are structure-driven, so the article and the term families (a later batch) add
their own composed bands around the same shell without a new template.


## 14 · Critic pass, batch B2 (10 Oct 2026)

Shot at 1440 and 390 and read band by band. Copy fidelity was re-checked against the raw markdown with
a script (visible text of each built page against every sentence and table cell of its source, in
order): the case and the tool render every fragment in document order; on `/case-studies` the only
fragments not on the page as written are the form's structural labels ("Enquiry form", "Submit:"), the
attribution (rendered as name, then role and company) and the "After sending" line, which is the
success view's body. Each note names its cause and where the fix lives.

| # | Where | Seen | Cause | Fix | Lives in |
|---|---|---|---|---|---|
| C2.1 | `/case-studies/benchmark-gensuite-…` · the argument shell | the reading column ran the whole 940 body track: ~130 characters a line, while the Steps bodies beside it sat at ~520 | Prose has no measure by decision (the caller owns it), and the shell's caller set none; the rail alone does not narrow a `[1, 4]` track | every Prose run in the shell caps at `--measure-body`; Steps, tables and the bound artefacts keep the whole track, on one start edge (the shell's own stated form at `/design/table-of-contents`) | `CorpusPage.module.css` `.reading`, `LongformPage.tsx` |
| C2.2 | `/case-studies/benchmark-gensuite-…` · `case-context` at 390 | the "At a glance" record scrolled sideways, the key column took 193 of 326 and every value was clipped at its last characters | the head-less record inherited the comparison table's column floors (key `hold` 192 + value 176), which exist so a comparison scrolls; a record has no second column to scroll to | in record mode (`head={false}`) the floors lift and the key breaks only between words: the table sizes the pair itself and never scrolls. Comparison tables are untouched and still scroll (7 Oct ruling 6) | `DataTable.module.css` `.record`, `DataTable.tsx` |
| C2.3 | `/case-studies` · `designed-and-built` | the Wandering Raven placeholder was the 16:9 cover master cropped to the story split's 4:5: its label cut mid-word, its right edge missing (B2.4) | a labelled panel cannot be cropped, but every placement crops the one cover master | the slot gets its own register row at 4:5 (`designed-and-built (The Wandering Raven)`); `coverFor` takes the band and prefers that slot's panel over the master, after any real cover. The 16:9 cover row it replaces is gone | `images.ts`, `_corpus/case-index.tsx`, `docs/image-register.md` |
| C2.4 | `/case-studies` at 390 | "New products" and "AI products" stacked four and three 16:9 placeholder covers with their copy, ~2,400 of scroll for one group | the 2–4 group passed `scroll="never"`, the router opt-out, to a catalogue's peers | the group takes BlockCardSet's default `auto`: a covered set of three or more scrolls sideways below 768, one card a view (§ 3.7 item 2). The featured group keeps its lead and stays stacked | `CaseStudyIndex.tsx` |
| C2.5 | `/tools/design-system-drift-checker` | after the media split, four bands ran down the start edge with the right half empty (workspace head, head + Callout, limits note, close): one shape repeated | every head was start-weighted; § 3.5's head alignment axis was not used on the page at all | the workspace head is centred over the tool panel (the page's large object), and the plain limits note is centred as a pause before the close. Two centred heads, never adjacent; the close stays start-weighted | `ToolPage.tsx` |
| C2.6 | `/case-studies` · hero | `fold:check` reported 0 heroes on the page | CaseStudyIndex's PageHero carried no `data-band="A"` / `data-fold-hero` | added, so the gate measures the index hero as it does every corpus hero | `CaseStudyIndex.tsx` |

Logged for the content team: **P27**, straight quote marks in the case's statement and in the prototypes
section.

Looked at and kept, with the reason:

- **The case hero's two ledes at two sizes and measures.** PageHero sets `body[0]` as the lead and the
  rest as body copy by design; the third paragraph is already split out as the statement.
- **The case statement at four lines** (P11): copy as written, at the statement's approved size.
- **The tool's split bands** (`workspace` → `workspace-2`, `reading-your-results` → `-2`): each pair
  measures past the fold together, so the split stands (§ 1.3); the h3 band's seam is the split's.
- **The rail's clamped outline labels** (P24): the clamp is the TableOfContents' approved geometry.
- **The empty tool panel**: a reserved place for a gated product feature (G10), not a design surface.


## 15 · Build notes, batch B3 (`/insights/cpq-ux-design`, `/glossary/design-system`, `/about`)

| # | Where | Sheet said | Built | Why |
|---|---|---|---|---|
| B3.1 | the two long-form family routes | "switch the family" | one allowlist (`PASS_1_LONGFORM_ROUTES`, `src/app/_corpus/longform.tsx`), as B1.4 and B2.5 | § 1.2: unverified corpus pages must not switch silently |
| B3.2 | CPQ · the four moves | `Steps` from the four paragraphs | read from the author's count ("Four … follow.") in `LongformShell.withMethods` | the paragraphs are not a list in the source (P28) |
| B3.3 | `BlockCard` / `BlockCardSet` | G3b `linkScope` | `linkScope="cta"`: static frame, the cta Button is the one anchor; specimen in `/design/block-card` | About `what-we-do` |
| B3.4 | `Button` link emphasis | not named | `white-space: normal` on `.link` | a 44-character link label ran 54px past a 390 viewport; a boxed button keeps `nowrap` |
| B3.5 | FAQ answers | not named | `blocksHtml` renders a lone link line inside an answer | the About FAQ's "Read about AI-native Product Design at Tcules" was being dropped (also fixes earlier pages) |
| B3.6 | quote attribution | G13 one-line form | `parseAttribution` also takes About's two-line form (a break is the comma) | About's testimonials |
| B3.7 | shared code | — | `LongformShell.tsx` (case, article, term share one shell), `QuoteSliderBand` and `ListTiles` in `blocks.tsx` (home and offer pages now use them) | reuse, not fork |

Proposals P28–P32 added; P24 extended. No register rows were added: every slot this batch needs was already registered.


## 16 · Critic pass, batch B3 (10 Oct 2026)

Shot at 1440 and 390 and read band by band. Copy fidelity was re-checked against the raw markdown with
a script (visible text of `<main>` against every sentence, list item and table cell of the source, in
order): About and the glossary render every fragment in document order. On the CPQ article the only
differences are the standfirst set above the byline (a re-lay inside the hero: PageHero's `children`
row follows the body) and the closing link's full stop, which § 0 rule 1 drops when a lone link line
becomes a button.

| # | Where | Seen | Cause | Fix | Lives in |
|---|---|---|---|---|---|
| C3.1 | every wrapping link Button (CPQ `where-this-work-sits`, About `difference-2` at 390) | the label wrapped to two lines and its arrow sat at the far edge of the column, a line's length from the word it belongs to | B3.4 let the label wrap inside a flex row, where a wrapped label is a block as wide as the space it is given | link emphasis flows inline: the glyph follows the label's last word, centred on the cap height (`1cap`), the 8 kept as the label's inline padding; the hover underline is a background strip on the ink, so it still wipes from the left and runs across every line. One line long, the link renders as before (checked at 4x, rest and hover) | `Button.module.css` |
| C3.2 | About `difference` → `difference-2` | the split's last three differences were BlockCard text cards a type step above 5a's two ListCard tiles | the split's two halves were drawn with two different components (C1.2's cause, again) | `difference-2` renders the same tiles, three across | `AboutPage.tsx` |
| C3.3 | About `who-we-work-with` | the two closing sentences sat start-aligned in a centred measure block under three cards: a ragged block whose left edge lined up with nothing | ContentSectionText keeps start alignment under a centred head, which is right for running text and wrong for a short coda | `ContentSectionText align="center"` (short codas only, balanced); specimen in `/design/content-section` § 11 | `ContentSection.tsx`, `ContentSection.module.css` |
| C3.4 | About `company-record` at 390 (and the glossary comparison) | the record scrolled sideways and clipped every value ("Tcules UX Private Limite") | record sizing (C2.2) was tied to `head={false}`; with its authored head row the record took the comparison floors, which also sit on the head cells | a table with one value column is a record whether or not it has a head row: floors lift on head cells too, and the key takes `--dtab-record-key-share` (38%) so the column algorithm cannot starve the value (it split "implementatio / n" without it) | `DataTable.tsx`, `DataTable.module.css`, `tokens/components/data-table.css` |
| C3.5 | About `studio` and `what-remains-constant` | three short paragraphs (and a head with four short lines) floated mid-way down a 596-tall 4:5 column: no large thing, mostly air | copy-weighted media split for copy that is short; ContentSection's `weight: 'photo'` exists for exactly this | both take `weight: 'photo'` (6:5 in the 7 track); register rows moved to 6:5. `work-you-can-inspect-2` stays copy-weighted: the bound wall photo (936 wide) fails § 5.4 at 667 | `AboutPage.tsx`, `docs/image-register.md` |
| C3.6 | placeholders (About careers at 390, how-we-work aside) | the careers panel printed its register note "(Banner below, critic pass)"; at 390 its label was cropped, and the 3:2 how-we-work panel lost its right half in the portrait aside | the label was anchored top-left, the first thing any crop cuts; the register row's first sentence carried a build note | labels are centred and set in the panel's central square less a double pad, so crops down to about 4:5 of the short side keep them; the careers row's note moved out of the first sentence. Every page's placeholders regenerate | `scripts/placeholders.mjs`, `docs/image-register.md`, `public/placeholders/*` |

Looked at and kept, with the reason:

- **The glossary and the CPQ article** read as intended: stacked title, a statement (glossary), the rail
  beside the column with its tables, Steps and two diagram slots. The Steps bodies sit on a narrower
  measure than the Prose above them; that is the approved Steps geometry.
- **About `the-practice-keeps-moving`**, four paragraphs on one start edge with an empty right half. A
  head | prose split would be the text-only split the 7 Oct ruling 2 retired; the band sits between two
  image bands and the icon slider, so the rhythm rule holds.
- **About `work-you-can-inspect-2`**: the Lab paragraph and link beside a tall wall photo reads as the
  photo with a short note; the photo cannot take the photo track (§ 5.4, above).
- **The About and case "At a glance" records at 390** are tall (two halves of eight rows): copy as
  written, now without a sideways scroll.
- **Dev warnings** left as logged: the About eyebrow repeats the crumb (P1), nine FAQ items (P17),
  TOC labels over 40 characters (P24).

---

## 17 · Home round 1 (owner review, 10 Oct 2026)

**The review.** The owner reviewed `/` and said pass 1 "completely lost the beauty aspect": the
content rules had been read as layout instructions. Corrected rules (§ 0 note, memory
`content-narrative-is-fixed`): don't paraphrase information, design its presentation; band order
holds except that the form always sits right before the FAQ; approved kit compositions win; beauty
first, then negotiate length. The kit's approved home (`/design/kit/home`) had already solved three
of the bands pass 1 re-solved worse: the logo grid led by the Clutch badge, the record as Stats, and
six linked icon cards for the services.

### 17.1 Home, band by band: before → after, and why

| # | Band | Before (pass 1) | After (round 1) | Why |
|---|---|---|---|---|
| 0 | hero record line | Four mono tags under the ask | **Its own band on tint** under the hero: four `Stat`s, 4 across from 1024, 2 × 2 on a phone — 2017 / Founded · 90+ / Projects · 19 / Countries with clients · India / Based in Ahmedabad | Note 1: these are the page's first credibility, and figures are scanned where tags are skipped. The record is one proof type, so it never shares the logo band (§ 5.8). The figure forms are P33. |
| 1 | `client-recognition` | A grid of six name cells (h5 serif), then the score alone in a tinted band | **One band**, the kit home's: `LogoGrid` led by the Clutch `RatingBadge`, the context line as h2, Doodle's SVG and **five typeset wordmarks**, then the authored sentence and "Read the reviews ↗" under the grid | Notes 2–3: a wall of logos, not a list of names; and the score belongs with the clients (the approved composition). LogoGrid now mixes drawn marks with typeset wordmarks (`--text-wordmark`, the marks' ink) instead of turning every cell into a name when one SVG is missing. Five SVGs are registered as needed. P35 notes the score is said twice. |
| 2 | `product-situations` | Six boxed icon cards, 3 × 2, h5 titles | **Six large cards two up**, each led by its service's ch05 drawing (3:2, contained), h3-scale title, the paragraph, and the service named on the card's one action; display-size heading | Note 4: the gateway to the services; each situation gets real presence and a picture. Head above, no decorative image (9 Oct ruling 3–4): each drawing IS the card's cover. "Launch a new product" uses Software Development's drawing as an interim (§ 17.3). `BlockCardSet` gained `ratio` (the linked pair's 16:5 drew a 960-wide drawing 230 wide). |
| 3 | `selected-work` | A one-at-a-time slider; covers at their own ratios; quotes inside the slides | **Four case rows**, one consistent shape — the artefact at 3:2 on the start (BlockCard `horizontal`), copy and "Read the … case" beside it — then the **two quotes as a pair** (Proof `group`) after the rows; "See all case studies" at the head's end | Note 5: no slider (people rarely reach slide 2, whatever search engines index); every cover one ratio, each crop anchored on its subject (`COVER_FOCUS`); never a quote inside a case. The case binding is matched on the client's name before the colon (the title's "workflow" had matched Dealpath's artefact to Eden AI). |
| 4 | `capabilities` | Six ruled text rows, no glyph | The kit home's band 5: **six linked icon cards** in borderless boxes, 3 across, a glyph each, stacked on a phone (a router shows every route) | Note 6: icons and a structure visibly different from band 2 (small boxed glyph cards vs large drawn cards). The label's closing full stop is dropped from the card title (the run-in's punctuation, not the service's name). |
| 5 | `why-tcules` | Two media splits, all four reasons and three quotes packed beside two photos | **One display heading, then four banners**: each opens on a hairline, an index numeral, the reason (h3 + lead-size body) on one side and the client's words (Proof display) on the other, alternating sides, a `section` beat apart; reason 3 takes The Wandering Raven placeholder (3:2) | Note 7: one heading plus four banners, not one screen. Reason 3 has no quote, so its other side is the work it names (no bound asset exists anywhere in the corpus). |
| 6 | `client-voices` | Auto-advancing quote slider | **A composed wall** on tint: three columns, two quotes each, read down each column in authored order; compact quotes at the narrow-measure size | Point 8 and "no sliders": every voice visible; the columns absorb moderate length differences (no ragged row of holes). P34 sets the length band. Shared: `QuoteGroupBand` (M5) replaces `QuoteSliderBand`, so About's three voices are now a Proof group too. |
| 7 | `ai-native-practice` | Banner, photo at the end | Banner, photo at the **start** | The hero's picture is at the end and the case rows run image-start; the banner takes the start to answer the reason banner above it. |
| 8 | `expertise` | Eight boxed icon cells, titles only | **Eight image cards**, 4 across from 1024 and **2 across on a phone** (`BlockCardSet phone="pair"`), title-cued; a placeholder per sector | Note 9: a picture each; on a phone neither eight tall cards nor a scroll row. No catalogue or studio photograph depicts a sector, and the three sector pages that bind an asset bind screens already on this page (Dealpath, Eden AI) or only one (GT Tools), so the set is registered whole as a drawn family. |
| 9 | `enquiry` | Last band | **Before the FAQ** | Note 10, and a template rule for every page (`formBeforeFaq`, `order.ts`). |
| 10 | `faq` | Before the form | Last band | — |

**Squint, top to bottom:** split hero · four blue figures on tint · centred boxed logo wall · six large
drawn cards, two up · four image-start case rows and a quote pair · six small icon boxes · four
alternating reason banners · a three-column quote wall on tint · photo-start banner · eight sector
cards · the form on tint · the questions. Tints: record, voices, form — none adjacent. Blue solid:
the hero only.

**Fold (measured, `npm run fold:check -- /`, 1470 × 830):** situations 2276, selected work 2336,
why-tcules 1984, client voices 890, expertise 834, FAQ 844 (P22). The first three run long **by
design**: the owner asked for each situation, case and reason to have room ("do not cram all four into
one screen"), which the 5 Oct one-viewport rule cannot hold for six large cards or four rows. This is
an owner decision (§ 17.4).

### 17.2 Global fixes made at the component, so every page gets them

| Note | Cause | Fix | Where it lives |
|---|---|---|---|
| A split table read as two tables on a phone | About split its record by hand in the template | `DataTable split`: two boxed halves from 1024; below it the halves join — no gap, the second frame's top edge and head row give way (head still read), and a shared key floor (`--dtab-split-key-size`) keeps the column rule straight through the join | DataTable; About uses it |
| A one-value table fits the column | (already right) | Kept: a record sizes to the track and never scrolls | DataTable `.record` |
| A quote stuffed into a case | Story bands kept the client's words in the story column | OfferPage pulls a story's quotes into their own typographic band after the stories (`storyQuotes`); home pulls the case quotes into a pair after the rows | `plan.ts`, `OfferBands.tsx`, HomePage |
| Quote sliders | M5 was a slider | `QuoteGroupBand`: one quote centred, two or three as Proof `group`, four to six as a wall | `blocks.tsx`; Home, About |
| Form after the FAQ | Templates followed document order | `formBeforeFaq` in every corpus template (Home, Offer, Longform, Tool); a no-op on pages without both | `order.ts` |
| Equal rows on a stack | `Layout equalRows` equalised a single-track stack too, so on a phone every short card was stretched to the tallest | Equal rows start at the first breakpoint with more than one track (`firstMultiTrack`) | Layout |
| Client names as text | LogoGrid turned every cell into a name when one mark was missing | Mixed sets; a missing mark is a typeset wordmark | LogoGrid, `--text-wordmark` |

**Pages affected:** `/services/product-design`, `/audits/design-to-code-audit` and `/expertise/healthtech`
now close form → FAQ; `/expertise/healthtech` sets the CuramCare quote as its own band after the two
stories; `/about` takes the joined record and the voices as a group of three. The other five pages
have no FAQ, no quote slider and no split table, and were shot at 1440 and 390 with no change.

`--text-quote-sm` stays: the voices wall sets compact quotes in ~392 columns, which is exactly the
narrow measure it exists for.

### 17.3 Register and proposals added

- Register: `/` `client-recognition` reworded as **client logo SVG needed** (Dealpath, Benchmark
  Gensuite, Eden AI, JoVE, Ringier Media Switzerland); `/` `why-tcules (The Wandering Raven)` 3:2;
  `/` `expertise (…)` × 8, 16:9, one drawn sector illustration each. Removed: `/` `why-tcules` and
  `why-tcules-2` studio photos (the media splits are gone).
- Interim, not registered as a panel: "Launch a new product" (New Product Design & First Release) has
  no service drawing of its own; it shows Software Development's end-to-end drawing
  (`serviceDrawing`, `src/lib/service-illustrations.ts`). A dedicated drawing replaces it.
- Proposals: P33 (the record as figures), P34 (quote lengths within a band, with per-placement
  ranges), P35 (the score said twice). P21's overflow cause is fixed at the template.

### 17.4 For the owner

1. **The fold.** Situations, selected work and why-tcules each run 2000–2300 at 1470. Keep the room,
   or ask for a denser form of one of them.
2. **The record's fourth figure.** "India" as a figure with "Based in Ahmedabad" under it — or three
   figures and the location elsewhere.
3. **Phone scroll rows elsewhere.** The case-study index still sets its New products and AI products
   sets as a swipe row on a phone, and About's services are a desktop slider. Neither is a case or quote
   slider on the home page, so round 1 left them; the same "hides content" argument applies.
4. **Case-study index story.** The one-case "Designed and built" band keeps its client quote under the
   case in the same column. It is a story band rather than a card, so round 1 left it.


### 17.5 Critic pass on round 1 (10 Oct 2026)

| Note | Cause | Fix | Where |
|---|---|---|---|
| Selected work: Doodle's and Benchmark's covers ended in a sliver of a second device or panel; four 393-tall rows ran 2,336 | the boards are 1.5:1 to 3.3:1, and the horizontal card was locked at 3:2 | the horizontal card honours `ratio`; the rows take `double` (2:1 beside the copy, 16:9 stacked) with a focus per board, so the band runs ~400 shorter | `BlockCard` (+ specimen), `HomePage` |
| Why row 3 stood ~150 taller than the three quote rows | its placeholder was 3:2 | the slot is 2:1 | `image-register.md`, `HomePage` |
| About's services were a slider showing three | slider left in the template | six linked icon boxes, 3 / 2 / 1 across, all visible | `AboutPage` |
| Case-study index and About's practice row swiped sideways on a phone | `BlockCardSet` `scroll="auto"` scrolls any covered set of 3+ | `scroll="never"` on every case set in the corpus templates | `CaseStudyIndex`, `AboutPage` |
| About's split record ended ~100 apart (one-line facts left, four-line ones right) | `split` broke at the row count | `split` breaks where the halves' estimated heights are closest; one continuous table below 1024 as before | `DataTable` |

17.4 items 3 is done. Item 4 (the index's story band keeps its quote under the case) is still the owner's call.

## 18 · Home round 2 (owner review, 10 Oct 2026)

**The review.** Feedback, not instructions: remove the "based in India" figure and the line under the
logo wall; "What do you need next?" was about the images rather than the services; selected work was
boring (four rows in sequence, quotes either embedded or orphaned); "Why teams choose Tcules" had
everything fighting for attention; the testimonial grid needed a real component with a star rating
(placeholder ratings 4–5 for now). The owner's four testimonial references are in `docs/kit/refs/`.
Patterns derived for every page are in memory `home-review-patterns-oct-2026`: claim leads and proof
supports; gateways serve a quick decision; a case and its quote sit adjacent, never embedded;
featured, then listed; cut redundant proof; every testimonial group is a rated card.

### 18.1 Home, point by point: feedback → cause → fix

| # | Feedback | Cause | Fix |
|---|---|---|---|
| a | Remove "India / Based in Ahmedabad" from the stat bar | Round 1 turned every fact in the record line into a figure, and a place is not a measure | `RECORD_FORMS` maps the fact to `null` (deliberately not shown); three figures, 3 across from 768, stacked below. The FAQ and the footer still name India. P38 asks the source to match. |
| b | Remove the line under the logo wall | The authored sentence restated the badge's score, and its link went where the badge goes | The sentence and "Read the reviews" are gone; the Clutch `RatingBadge` leads the wall and IS the link to the profile (it always opens in a new tab). The review count leaves with the sentence (P37, supersedes P35). `.ratingLine` deleted. |
| c | "What do you need next?" focuses on images, not services; illustrations are the wrong imagery | Each situation was led by a 3:2 service drawing two up (2,276 tall); the drawing was the largest thing on every card | Six **text cards**, two up, each opening on a hairline: the situation as an h3-scale title (the reason to explore), its paragraph, and the service named on its one action. No imagery: an icon per card would repeat the "What we do" glyphs for the same services two bands later. 2,276 → 1,072 at 1440. |
| d | Selected work is boring; quote close to the case but not embedded; 2 featured rows then a 2-col list | Four identical image-start rows, then the two quotes as a pair detached from their cases | **Featured, then listed.** Doodle and Eden AI (the cases with quotes) each take a featured row: the case card (2:1 artefact, h3 title, paragraph, link) in the 7, the client's **rated quote card** in the 5 beside it (`TestimonialBeside`), the second row mirrored. Dealpath and Benchmark Gensuite follow as a lighter pair, two across, one type step down, at the 16:5 crop. |
| e | "Why teams choose Tcules": the claim is the highlight, the testimonial supports it | Each reason (h3, 34) faced a display quote at the same 34 behind a blue rule, sides alternating | Every row reads start to end: index, the claim at the **h2 role** and its sentences at lead size in the 7; the client's words as the **supporting** testimonial in the 5 (`TestimonialCard size="sm" frame="none"`: the 22 quote in the quiet ink, 14 stars, no panel, no rule, no monogram). Sides never alternate. Reason 3's support is the Wandering Raven placeholder. 1,886 → 1,595. |
| f | A better testimonial component with a star rating; 4–5 placeholder ratings | Quotes were Proof `compact` in column stacks: no rating, no panel, a column of italics | New `StarRating` primitive and `Testimonial` pattern (§ 18.2). "What clients say" is a `TestimonialWall`: three column stacks of rated cards (paper on tint), quotes in authored order, split where the columns end most even. Ratings live in the content seam (§ 18.3). |

**Squint, top to bottom:** split hero · three blue figures on tint · centred boxed logo wall · six
title-led cards, type only · two featured cases with a quote card beside each, then a lighter pair ·
six small icon boxes · four claim rows with a quiet quote · a wall of rated cards on tint · photo-start
banner · eight sector cards · the form on tint · the questions. Tints: record, voices, form, none
adjacent. Blue solid: the hero only.

**Fold (measured, `npm run fold:check -- /`, 1470 × 830):** situations 1,072 (was 2,276), selected work
1,946 (was 1,944 after the round 1 critic; two featured rows and a pair, with a quote card each, in the
same height), why-tcules 1,595 (was 1,886), client voices 1,120 (was 890: six cards with ratings and
attributions), expertise 834, FAQ 844. Page 13,777 → 12,407 at 1440. The 5 Oct one-viewport rule is
still the owner's call for selected work and why-tcules (§ 17.4 item 1).

### 18.2 New components

| Piece | Tier | What it is | Token layer | Specimen |
|---|---|---|---|---|
| `StarRating` | 1 · mark | One review's score as five stars: filled, half (the filled glyph clipped at half from the inline start) or empty. Takes the star glyph as a node (`<Icon name="star" />`); the value is its accessible name ("Rated 4.5 out of 5"); rounds to halves and clamps 0–5 with a warning. Never an aggregate score: that is `RatingBadge`. | `star-rating.css` (`--star-fill-fg`, `--star-empty-fg` per surface; `--star-size-sm/md`) | `/design/star-rating` |
| `Testimonial` | 2 · pattern | `TestimonialCard` (stars → quote at `--text-quote-sm` → hairline → initials monogram + name/role; `md` box or `sm` unboxed), `TestimonialWall` (a row of peers up to the column count, else contiguous column stacks balanced by length; optional `stagger`), `TestimonialBeside` (the work slot in the 7, the card in the 5, `reverse`). Ratings arrive as props. | `testimonial.css` (`--tsm-*`, ground and inks per surface, the quiet inks for the unboxed card) | `/design/testimonial` |

The card is the one card with a ground at rest besides the boxed logo grid: every owner reference
panels each review, and the 9 Oct box ruling (padding, no edge) is followed. No photographs: an
initials monogram in a hairline square stands in. The 7 Oct "never a rating beside a client quote"
ruling was about the aggregate platform score; a per-review rating belongs to its quote (owner,
10 Oct 2026), and the aggregate still lives only with the logo wall.

### 18.3 Ratings: data, placeholders, and the seam

- Corpus quotes now carry `testimonialId`: the loader matches the frontmatter's `testimonial_ids`
  (or `page_composition.commercial_system.testimonial_ids`, About) to the quotes in document order,
  only when the counts agree; otherwise ids stay null and the quotes render without stars.
- `src/content/sources/fixtures/testimonial-ratings.ts` holds 14 **PLACEHOLDER** ratings (4–5, half
  steps), each `placeholder: true`, with a comment saying they are not real data.
  `getTestimonialRatings(ids)` (`@/content`) is the only reader. Routes read them and pass `ratings`
  to the templates; `testimonialItem(block, ratings)` (blocks.tsx) builds each card's item. No
  pattern or template holds a value.
- Launch blocker: P36 (replace with each review's own rating, or show none). Strapi: § 18 in
  docs/strapi-changes.md (`rating` + `ratingSource` on the testimonial record).

### 18.4 Cross-page sweep: page/band → change (fixed at the shared piece)

| Page / band | Pattern | Change | Where it lives |
|---|---|---|---|
| `/about` testimonials | 5 | Three Proof peers → a row of three rated cards on tint | `QuoteGroupBand` → `TestimonialWall` (blocks.tsx) |
| `/about` work-you-can-inspect | 3 | Four covers in one identical row → featured then listed: Doodle leads at full width, three under it (the case index's "Four to start with" shape) | `AboutPage` (`BlockCardSet lead="auto"`) |
| `/services/product-design` complex-products | 3, 5 | Four covers, then the Auxentios quote on its own tint band → Auxentios featured with its rated quote beside it, then Doodle, Scissors and Eden AI three across. The tint quote band is gone | `CaseSet` + `quotedGroup` (OfferBands), `plan.ts` (no `cases` split) |
| `/services/product-design` outcomes | 1 | The VideoPlasty quote at 28 behind a blue rule, louder than the four claims → the supporting unboxed testimonial under them | OfferBands `outcomes` |
| `/audits/design-to-code-audit` proof | 3, 5 | Three covers, then the Eden AI quote on a tint band → Eden AI featured with its quote beside it, then Benchmark Gensuite and GT Tools two across | `CaseSet` (OfferBands) |
| `/expertise/healthtech` proof | 3, 5 | CuramCare story, Vovisto story, then the CuramCare quote on a tint band → the CuramCare story as a case card with its rated quote beside it; Vovisto stays a media split. `storyQuotes` is gone | OfferBands `caseStories`, `plan.ts` |
| `/case-studies` designed-and-built | 3, 5 | The Wandering Raven quote under the case in the same column → the case as a card with the rated quote beside it | `CaseStudyIndex` one-case + quote branch; route passes ratings |
| `/case-studies` four-to-start-with | 3 | Already featured then listed (lead + three); no change | — |
| `/services/product-design` starting-points, specialist-capabilities | 2 | Already title-led (quoted symptoms beside a photograph; icon cards whose glyph is title-sized); no change | — |
| `/tools/…`, `/insights/…`, `/glossary/…`, `/case-studies/benchmark-…` | — | No testimonials, gateways or case sets; shot at 1440 and 390, unchanged | — |

Side effects: the offer plan no longer emits tint quote bands, so the horizon texture that announced
them is gone (`OfferUnit.horizon` removed); tint now marks only the close on offer pages. The
Proof pattern keeps its arrangements for the kit; on the corpus pages it now renders only a quote that reaches the generic fallback (`GenericBlocks`), which none of the ten pages does.

### 18.5 For the owner

1. **Placeholder ratings.** 14 invented ratings are on the pages as you asked. They cannot launch
   (P36). Who sources the real per-review ratings, and do quotes with no published rating ship
   without stars?
2. **The review count.** "13 independent client reviews" left with the line (P37). Should the badge
   carry it?
3. **Fold.** Selected work (1,946) and why-tcules (1,595) still run past one viewport at 1470.
4. **Situations without imagery.** The gateway is type only. If you want a mark per situation, it
   would need its own small set (not the service glyphs, which "What we do" uses two bands later).
5. **Rated cards everywhere.** Every testimonial now carries stars, including the supporting quotes
   in why-tcules and outcomes. Say if supporting quotes should drop them.

### 18.6 Critic pass (10 Oct 2026)

All ten routes shot at 1440 and 390 and read band by band; a–f and the five patterns hold (one
primary per band, quotes beside cases and never inside, claim before proof, rated cards in every
testimonial group, form before FAQ, no sliders). Home copy script-checked against `_pages/home.md`:
nothing missing beyond the two owner removals and the designed splits (figures, attributions,
run-in labels). Four defects, each fixed at its cause:

| Note | Cause | Fix |
|---|---|---|
| A boxed card on blue showed white stars on its paper ground (invisible; `/design/testimonial` § Four surfaces) | StarRating's colours follow the section's surface, but the boxed card is paper on blue (blue is never a card fill) | StarRating `onCard` and `--star-card-{fill,empty}-fg` per surface (they move only on blue); TestimonialCard passes it when boxed |
| About's three voices set in straight quotes beside home's curly ones | The corpus authors some quotes with straight marks and the card printed what it was handed | `curlQuotes` in TestimonialCard: typesetting of the marks, never the words |
| `/case-studies` Designed and built: placeholder brief cut to one line (1440 and 390) | Round 2 moved the story into a 2:1 case card; the slot was still drawn 4:5 | Register ratio 2:1, panel regenerated |
| `/about` How Tcules works: placeholder label cut at its right edge | A 3:2 panel in an `asideFill` aside of about 0.9:1 | Register ratio 4:5, panel regenerated |

## 19 · Home round 3 (owner review, 11 Oct 2026)

**The review.** Feedback, not instructions: one standard image ratio for cards (16:9 or 4:3 —
"never random image ratios on the cards ever"); the quote beside each featured case "feels randomly
floaty"; "Why teams choose Tcules" is still taller than a fold — each part should be one fold,
assume all four reasons have a quote, try kit banners I.3/I.4, drop the numbering; FAQ question and
answer lack contrast; the testimonial card should use the sans (small text) and circular avatars on
some cards, none on others (the initials box is banned); fold the facts row into the hero; use real
logo files in the wall; the enquiry form feels secondary to the copy beside it. 16:9 was chosen: it
matches the 16:9 banner and the 2560 × 1440 Clutch portfolio export, so one master serves every card.

### 19.1 Point by point: feedback → cause → fix (global or local)

| # | Feedback | Cause | Fix | Scope |
|---|---|---|---|---|
| 1 | One card image ratio, everywhere | BlockCard carried seven crops chosen per set to hold one band's fold (3:2 cover, 16:9 wide, 21:9 panorama, 2:1 double, 1:1 square, 16:5 pair, 1:1 headshot); the same cover rendered at four shapes on four bands | `--ratio-standard: 16 / 9` replaces `--ratio-cover` and `--ratio-wide`; BlockCard has ONE ratio at every width and arrangement (no `ratio`, no `grow`, no breakpoint); BlockCardSet's `ratio` and per-lead crops are gone; ListCard's thumbnail and the video poster alias the same token; `CARD_RATIO` is 16/9. Callers on Home, Offer (product-design, audit, healthtech), the case index and the kit specimens drop their `ratio`. Placeholders: the case index's Wandering Raven card slot 2:1 → 16:9; home's 2:1 why-tcules slot retired (§ 19.1 #3). Covers are authored at a 2560 × 1440 master (brand amendment) | **Global** (token + component) |
| 2 | The quote beside the case is floaty | `TestimonialBeside` centred a 5-track card on a 7-track case's whole height, so the card's edges met nothing | `TestimonialBeside arrangement="diptych"`: two equal tracks a `gutter` apart, top-aligned; the quote on a quiet panel at the card's own 16:9 (a floor; a long quote grows it), so its top and foot ARE the cover's; stars at the panel's top, the words pinned to its foot at `--text-lead-lg`; the speaker under the panel where the case title sits under its cover. The second row mirrors. Never inside the case | **Local to home** (a new arrangement; service, audit, expertise and case-index pages keep `card`) |
| 3 | Why section taller than a fold; one fold per part; all four with a quote; banners; no numbering | One band stacked four claim rows (1,595 at 1440) behind index numerals | A RUN of four Banner `beside` bands (kit I.3/I.4), photo end / start alternating, one reason each: Banner gained `bandHead` (the band's display h2 over the first split), `headingAs="h3"`, `support` (the quiet unboxed TestimonialCard under the lead) and `footer` (the closing link under the last). Numerals removed. "We can build what we design" takes Trishanya Raju's real quote from `/case-studies` through the content seam (`getBorrowedQuotes`, PLACEHOLDER, P39). Four 3:2 photo placeholders registered | Banner props **global**; the run **local to home** |
| 4 | FAQ question/answer contrast | The question rested at neutral-800 and the answer, through Prose, at neutral-900: the answer was darker than the question | Question at full ink, fixed (`--acc-question-ink` 950 / white; `-hover` deleted); answer `--acc-answer-ink` one step quieter (neutral-700 on paper and tint); only the chevron moves on hover | **Global** (Accordion tokens) |
| 5 | Testimonial card: sans, circular avatars, no initials | The card set the italic serif reading quote at 22 and an initials monogram | Quote in the sans (`--tsm-quote-text` → `--text-lead`; `-sm` → `--text-body`; `-panel` → `--text-lead-lg`); `TestimonialItem.avatar` renders a circular 48 (40 on `sm`) Media avatar; none renders nothing; monogram and its two inks deleted. Home: six of twelve testimonials carry a PLACEHOLDER kit portrait (`fixtures/testimonial-avatars.ts`, `getTestimonialAvatars`, P40) | **Global** (pattern); avatars data **local to home** |
| 6 | Facts row into the hero | The record was its own tint band (~330) | PageHero `stats` (2–4 Stats at md, one row at every width, a `text` under the actions (critic: was `block`), grouped with the ask); home passes its three figures; the facts band is gone | Prop **global**; used on home |
| 7 | Real logos | The wall typeset five names as wordmarks beside one file | The wall shows files only: Doodle, Eden AI (the one named PNG copied from the old repo to `public/clients/eden-ai.png`, density 0.23, drawn as a mask), then the in-house set — ten marks, 4 + 4 + a closing pair at 1440 (LogoGrid now closes a four-track row ending on two with two half-row cells), 2 × 5 at 390. Dealpath, Benchmark Gensuite, JoVE, Ringier registered as needed; P41 | LogoGrid closing pair **global**; the wall **local to home** |
| 8 | The form feels secondary | The split close put the copy at h1 in the larger track and the form on the bare ground in the narrower one | CtaSection `split`: [5, 7] from 1024, the form in the 7 on a raised panel (nested surface one step off the band's ground — paper on tint — `--cta-panel-ground`, 8 radius, `block` inset), the copy at the offer's h2 centred beside it; corpus forms use `fieldScale="lg"` (Input `scale="lg"`, 48, lead-role value; body below 768) and the full-width submit; `caption` now prints the page's own "After sending" line instead of the form's own wording (P42) | **Global**: every split close on the site, all ten corpus pages |

### 19.2 Measured at 1440 (home, `measure` over `main > *`)

| Band | Round 2 | Round 3 |
|---|---|---|
| Hero (A) | hero + a facts band of its own | **762** with the figures inside (content ends at 739; with the 73 nav the band box passes the 830 fold by 5 — padding only) |
| Logo wall (H) | — (six cells, five of them wordmarks) | 696 (ten marks, three rows) |
| What do you need next? | 1,072 | 1,072 |
| Selected work | 1,946 | 2,194 (two diptychs at 16:9 + the pair at 16:9, which was 16:5) |
| What we do | — | 811 |
| Why teams choose Tcules | 1,595 (one band) | **755 · 637 · 666 · 730** — four banners, each inside one 830 fold |
| What clients say | 1,120 | 1,088 (sans quotes are shorter) |
| How we use AI | — | 637 |
| Products we know well | 834 | 834 |
| Enquiry (L) | — | 635 |
| FAQ | 844 | 844 |
| Page | 12,407 | 12,361 |

Round 2 figures are § 18's (— where § 18 did not measure). At 390: the why banners run 922 / 832 / 909 / 963 (each under the 1,700 phone band ceiling); the hero
is 1,003 with its three figures one row across.

### 19.3 Patterns this round adds (home review patterns, continued)

1. **One image ratio for cards.** Every card cover is 16:9; a band that runs long changes its
   arrangement, never the crop. Assets are briefed at one master size.
2. **When a section passes a fold, each part gets its own fold.** A run of banners (one per reason),
   not a taller band. The run carries one band heading and one closing action.
3. **A quote beside a case shares its edges** (home): equal tracks, the panel cut to the cover's own
   ratio, the speaker where the case title sits. On service and expertise pages the case serves
   the offer, so the [7, 5] card stays (the owner's note: the home case + quote is not the services
   page's shape).
4. **Proof sits with the ask it proves.** The record lives in the hero, not a band after it.
5. **The form is the object, the copy is the caption.** The larger track, a raised panel, generous
   fields, the one solid on the band; the heading steps down beside it.
6. **Small text is sans.** Card-size quotes read in the sans; the serif speech voice is for display.
7. **People are shown as people or not at all.** A real portrait, in a circle — never initials.
8. **Logos are files.** A client without a file is not typeset into a wall of logos.
9. **Questions lead answers by ink as well as size.**

### 19.4 Products we know well: images or graphics (owner's question)

The eight sector cards already reserve a 16:9 slot each (register: one drawn sector illustration per
sector, the service-line family — ch05 isometric, blue on paper, one peridot accent, no type), so
the band needs **eight 16:9 spot drawings**, one per sector, briefed in docs/image-register.md (`/`
expertise rows). Two cheaper routes, if the drawings wait: (a) **graphics the kit can draw today** —
BlockCard's `texture` cover (the pixel-grid field, three recipes) with each sector's glyph set large
in its corner; no assets, on-brand, and replaceable cell by cell; (b) **a product-shot crop per
sector** from a case the sector page already binds (Dealpath for B2B SaaS, Eden AI for AI products,
GT Tools for commerce, CuramCare for HealthTech) — but three of those screens already appear higher on
home, so (a) or the drawings are the better first step. Say which, and (a) is a one-line change.

### 19.5 For the owner

1. **Placeholders that cannot launch:** the six stock avatars (P40) and the borrowed Wandering Raven
   quote in why-tcules (P39), as well as the round 2 ratings (P36).
2. **The hero fold:** with the figures inside, the home hero's band box is 5 past the 830 fold at
   1470 (its content is inside). Accept, or set the figures beside the button on one row (tight at
   572).
3. **Logo wall membership** (P41): ten files today, four named clients missing.
4. **Case covers at 16:9:** the four bound home artefacts are 1.5:1 to 3.3:1 and crop (register
   table); 16:9 masters end that.
5. **The diptych elsewhere?** It is home-only by your note. If service pages should share it, it is
   one prop per call site.

### 19.6 Critic pass on round 3 (11 Oct 2026)

Shots of all ten routes at 1440 and 390, a crop audit of every rendered image (natural ratio against
its box), `fold:check /`. Note → cause → fix:

| Note | Cause | Fix | Scope |
|---|---|---|---|
| Healthtech's CuramCare card cut its placeholder label mid-sentence | The register still drew the slot at 4:5 (its media-split days); it now renders in the featured-case BlockCard, whose one crop is 16:9 | Register row → 16:9, placeholder regenerated. The crop audit finds every card image at 1.78 on all ten pages; the only remaining card crops are the real case covers the register already lists | Register (global rule: a slot that renders in a card is 16:9) |
| Home hero 5 past the fold at 1470 (762 + 73) | The ask-to-stats seam was `block` on top of each Stat's own hairline and `block` | `text` under the actions: the hairline is the divider. Hero 754 (+73 = 827) | **Global** (PageHero `stats`) |
| Banner's own doc forbade two beside banners in sight; the run is exactly that | The placement rule predates the run | Rule amended: a run (one band in parts, `bandHead` first, `footer` last) is the exception | Doc |
| CtaSection's comment said the panel inset is `gutter`; the module sets `block` | Stale comment | Comment corrected (the module's phone reason stands; no media query swaps the step) | Doc |

Final home bands at 1440: hero 754 · logos 696 · what do you need next 1,072 · selected work 2,194 ·
what we do 811 · why 755 / 637 / 666 / 730 · what clients say 1,088 · AI 637 · products 834 ·
enquiry 635 · FAQ 844.

## 20 · Home round 4 (owner review, 11 Oct 2026)

| Note | Cause | Fix | Scope |
|---|---|---|---|
| The figures are "too close" to "Start a conversation" | Round 3's critic grouped the actions and the stats a `text` (16) apart to save fold, so the record read as part of the button's group | The stats are their own block in PageHero's stack, a `stack` (48) under the actions; in the display arrangement the ask group nests so the figures still sit a `stack` under it | Global (PageHero `stats`) |
| "Avatar inside the card please" (selected work) | The diptych set its speaker under the panel, mirroring the case title under its cover | The panel is now the figure: stars at its head, the words, and the speaker with avatar pinned to its foot on the boxed card's hairline. From 1440 it keeps the cover's 16:9 (content fits: 340 panel); at 1024–1439 the content (~350) cannot fit a 16:9 of those tracks (261–333), so the panel stretches to the row's foot instead of growing past the cover | Global (TestimonialBeside `diptych`; the boxed TestimonialCard already held its speaker inside) |

Fold: the home hero is 786 at 1440 and 1470, so 859 with the 73 nav, 29 past the 830 fold. Only the
band's bottom padding crosses it: the figures' labels end at 763. Every other way to recover 29
inside the hero was either a global change to approved heroes (the lede-to-action `stack`) or a
demotion of the claim (a smaller lede or figures), so the overshoot is accepted and reported, not
hidden by an exemption.

### 20.1 "What do you need next?" — the gateway as a router (round 4)

**The note.** "'What you need next' section could again be so much better. Please spend some time
on that specifically." Round 1 led each situation with a drawing (the pictures out-shouted the
services, 2,276 at 1440); rounds 2–3 set six text cards two across (critic: "clean but plain";
1,072, past the fold).

**Cause.** The band was drawn as a card set (six equal objects, two up) when its job is a router:
a founder or product lead looks for their own situation, so the six titles have to scan in one pass,
each one has to say where it leads, and the sentence only confirms. Two columns of cards made the
eye zigzag, the 16px sentences weighed as much as the titles, and the service sat at each card's
foot after the paragraph.

**Explored on `/design/kit/gateway`** (home's own corpus words, read from the content seam):

| Direction | What it is | Scan | Distinct | Leads | Fold (1440) | 390 | Score |
|---|---|---|---|---|---|---|---|
| **A · Index (chosen)** | One column: h3 title on one line, the service on its cue under it, the sentence quiet beside them in 5 of [7, 5]; no row rules; a hover ground across both tracks | 5 | 4 | 5 | 5 (814) | 4 (1,347) | **23** |
| B · Split rows | ContentSection `beside`: the display heading in the leading track, ruled rows in the trailing one (h4 title and cue on one line, sentence under) | 4 | 4 | 5 | 2 (879) | 4 (1,350) | 19 |
| C · Decision grid | A ruled cell per situation, 3 × 2: mono service line, h4 title, sentence, arrow | 3 | 2 | 4 | 3 (845) | 2 (1,834) | 14 |

A won because it is the only one that serves the quick decision in a single downward pass. The six
titles share one edge at one size on one line each, and the destination is named directly under each
title, before the sentence. It is also the only arrangement on the page that is a single-column
typographic index. B was the calmest, but it left the heading's track empty under two lines of type,
its h4 titles fought the cue at the end of each row, and it ran 49 past the fold. C repeated the 3 × 2
shape of the "What we do" boxes two bands later (owner, round 1 note 6: the two ways in must look
different) and ran 1,834 on a phone.

**Iterations on A** (each measured at 1440, then shot):
1. Three tracks, title · sentence · cue [5, 4, 3] on one baseline: 1,143. The cue column wrapped,
   and the baseline alignment dropped short titles to the foot of their row.
2. [5, 5, 2], h4, sentence at body-sm: 838, but it read as a pricing table and two titles wrapped.
3. [7, 5], h3 on one line with the cue under it, rows ruled: the best-looking version at 893, 63
   past the fold. With a `tight` row inset it fitted at 797, but the cue touched the next rule.
4. Rules removed, rows a `block` apart, and the whole row raises a ground under the pointer
   (spread 16 past the copy, so the copy stays flush with the heading): **814**. The ground does
   the separating job the rule did, but only on the row being chosen.

**Built as a pattern, global.** The new `Gateway` (tier 2: `src/patterns/Gateway`, tokens
`--gwy-*` in `tokens/components/gateway.css`) has `index` (home) plus `rows` and `grid` (kept as
explored alternatives; `rows` suits a narrow track on a services index or About). Each row is one
anchor, and its cue is Button's link span driven by `data-btn-link-group`. The sentence uses the
body-sm role in the quiet ink. `HomePage` maps the band with `gatewayItems` (exported, so the
specimen proves the pattern on the real words). The band is `data-band="C-router"`.

**Measured:** 814 at 1440 / 1470 / 1280; 934 at 1024 (h3 steps to 28 and the long titles wrap);
1,099 at 768; 1,347 at 390. Down from 1,072 / 1,919. `fold:check /` no longer lists the band.

### 20.2 Critic pass on round 4 (11 Oct 2026)

Shot `/`, `/design/kit/gateway`, `/design/testimonial`, `/design/page-hero` and every pass-1 route
(`/about`, `/services/product-design`, `/audits/design-to-code-audit`, `/expertise/healthtech`,
`/case-studies`, the Benchmark case, the drift-checker tool, the CPQ article, the design-system term)
at 1440 and 390: no overflow, no page errors. Home also read at 1024 and 1280.

| Note | Cause | Fix | Scope |
|---|---|---|---|
| Keyboard focus on a router row: the ring ran through the title's first glyph and over the cue's underline | The index anchor has no inset (its copy stays flush with the heading), and the focus ring was drawn on the anchor's own box, while the hover ground reached 16 past it | The focus state raises the same ground as hover and rings the ground's edge, outside the reach, so the ring clears the copy by 16 on every side | Global (Gateway `index`) |
| A faint seam inside the hover ground, at the row's corners | The ground was a background plus a spread box-shadow round a rounded box; the two anti-aliased edges met inside the painted area | The ground is one painted `::before`, inset by minus `--gwy-ground-reach`, behind the copy (`isolation`); hover, press and focus paint it, and the ring is its shadow | Global (Gateway `index`) |
| Home's squint comment still listed "six situation cards, two up" | Stale after the router landed | Comment updated | Doc |

**Held, and why.**
- **The router's structure.** The four iterations in § 20.1 are the honest limit at the fold: a
  three-part row (situation, where it leads, why) for six items costs about 65 a row, and the 638
  inside the band's padding leaves no room for rules with a `text` inset (893) or a `gutter` seam
  (854). Every other arrangement with the sentence visible runs taller. The title-led index is the
  fold-fit answer. It is not a card set and does not repeat "What we do"'s 3 × 2 boxes.
- **The hero's 29 past the fold** (§ 20, accepted there): only the bottom padding crosses; the
  figures end at 763.
- **The diptych at 1024–1439.** The quote panel runs to the case's last line, so the shorter quote
  leaves an open field between the words and the speaker (the speaker is pinned to the foot). It is
  anchored at both edges, which is the rule; a panel that stopped at the image's foot would cut the
  speaker off from the quote. From 1440 the panel is 16:9 and matches the image exactly.

## 21 · Home round 5 (owner review, 11 Oct 2026)

| Note | Cause | Fix | Scope |
|---|---|---|---|
| "display text should only be used for heros. any other section should use h1/h2 depending on the prominence it requires" | Display (67) had leaked into four non-hero places: ContentSection `headingSize="display"`, the media split's default head, Banner's run heading (`bandHead`) and CtaSection's `open` close. Each chose display for "prominence", so the hero lost its rank | The `display` size is retired from every non-hero component. **The rule:** h1 (`headingSize="xl"`) when the band's HEADING is its one large thing — it opens an argument (a media split's head beside its photograph, a feature band's opener, a run's head over its banners, the page's closing ask); h2 (the default `lg`) when the band's CONTENT is its large thing (a set, a grid, proof, a form, an FAQ); h3-at-h2 (`md`) where even h2 out-sizes the content (stats). Display is PageHero's alone. ContentSection `headingSize` is now `xl \| lg \| md`; `media.head` is `xl \| lg` (default `xl`; `title` renamed `lg` at every caller); `--csec-heading-text-xl`, `--bnr-band-heading-text` and `--cta-open-heading-text` read `--text-h1` on `--measure-title` | Global (tokens: content-section, banner, cta-section; ContentSection API) |
| Gateway grid "reads as too dense and boring … nothing is guiding my eye" | See § 21.1 | See § 21.1 | Global (Gateway `grid`) |
| Hero 29 past the fold | Only its bottom padding crosses (§ 20) | Accepted by the owner ("only the padding"); no change | — |

**Bands changed by the display rule.** On the 10 corpus routes: home "What do you need next?"
(display → h2: its six situations are the large thing), home "Why teams choose Tcules" (run head,
display → h1), About "Work with Tcules" and glossary "Why design system matters in product work"
(the open close, display → h1). Every route now renders exactly one 67 element, its hero h1
(measured across all ten). In the kit: every `headingSize="display"` on `/design/kit/feature`,
`/design/kit/service-list`, `/design/kit/services-index` and `/design/content-section` is now `xl`
(they open their bands), every media split head on `/design/kit/media-split` is h1 by default, the
media-split specimen's own title is a plain h1, and `/design/banner` and `/design/kit/cta` follow
their tokens. Left alone: PageHero, the hero specimen's title, Statement (already h1 since 7 Oct),
and Proof's `display` arrangement and the stat/score figures, which are quote and figure roles,
not the display type role.

### 21.1 The gateway grid, refined (home's layout again)

**Diagnosis of the round-4 grid** (`/design/kit/gateway`, R4 · C, the owner's pick): six identical
blocks of equal weight, so the eye has no entry point; three text layers per cell (mono service,
serif title, grey sentence) of similar grey density; a lone arrow that names nothing; bodies starting
at different heights as the titles wrap, so each row zigzags; rows only a `gutter` apart; and a
display heading out-shouting all of it.

**Refinements explored on `/design/kit/gateway`** (round 4's three directions kept below them,
labelled). All take the section h2, the service as the blue link pinned to the cell's foot (so the
mono line and the lone arrow go: two layers and a call), a quieter sentence, rows a `stack` apart,
and a hover/focus ground that hangs from the cell's rule (square under it, rounded at the foot).

| Refinement | Verdict | 1440 | 390 |
|---|---|---|---|
| R5.1 · link only | Calmer and shortest, but still six grey blocks with nowhere to land first; reserving two title lines (to line the sentences up) left holes under the one-line titles | 778 | 1,674 |
| R5.2 · glyph disc above the title | The discs give the eye an entry, but glyph-over-title in a 3 × 2 grid is What we do's skeleton two bands later, and the disc row runs it past the fold | 922 | 2,106 |
| **R5.3 · glyph disc hung beside the title (chosen)** | Each cell gains a shape at no height; the eye path is rule → disc → title along a row, then down to the line of calls; glyph-beside-title is a skeleton of its own | 822 | 1,798 |

**Why R5.3.** It is the only one that gives the eye somewhere to land without costing the fold or
repeating "What we do". The disc carries the destination's glyph (one glyph per destination, G12),
tinted, so the six read as a row of blue shapes before any word is read; the title is the cell's
largest thing; the sentence recedes; the blue link ends every cell on one line.

**Iterations on R5.3.**
1. The link sat under the disc's track, off the copy's edge, and the calls stepped with the
   sentences: the disc now has its own stretched track, the copy and its link share the second
   track's edge, and the link is pinned (`equalRows` on the hung track, `pinLast` in the copy).
   Titles take their own height (no reserved line, so no holes beside the disc).
2. The sentence steps to the quieter ink (`--gwy-body-ink` neutral-600 on paper, 4.92:1; tint keeps
   700, ink lifts to 400), and the hover/focus ground hangs square from the rule instead of
   rounding under it. On hover or focus the title turns blue, the disc turns paper on the raised
   ground and the link underlines; the focus ring sits on the ground's edge.

**Built, global.** Gateway `grid` is the default arrangement and gains `mark` (`none \| disc \|
hang`, the glyph from `GatewayItem.icon`, an `Icon` the caller composes) and `cue` (`link \|
arrow`; `arrow` is the round-4 cell, kept for the specimen). New tokens: `--gwy-title-lines`,
`--gwy-disc-inset` (optical: 12 round the 24 glyph), `--gwy-disc-radius`, `--gwy-disc-ground{,-hover}`
on every surface. `gatewayItems` passes each destination's glyph from `glyphForRoute`. The whole cell
is one anchor, one tab stop.

**Measured (home, `data-band="C-router"`):** 822 at 1440 (inside the 830 fold), 932 at 1024 (three
up; the long titles wrap to three lines), 1,055 at 768 (two up), 1,798 at 390 (one up). Shots:
`/`, the nine other corpus routes and the touched specimens at 1440 and 390, no overflow, no page
errors.

**Critic pass (round 5).** Display: one 67 element per corpus route, its hero h1, at 1440 and 390;
no `--text-display` read outside PageHero. h1 lands on the banner run's head (home "Why teams choose
Tcules") and the open closes (About, glossary); every form, set, grid, proof and FAQ band is h2; the
tool page's tint close stays h2 (prose guidance, not an ask). The corpus media splits all opt to `lg`
as they did before round 5 (long heads beside lists), so `xl` there is the specimen default only.
One defect, fixed at the token: on the raised ground the quieter paper sentence (neutral-600) fell to
4.39:1 on paper-deep and 4.16:1 pressed, under AA for 14px, and a keyboard reader holds focus there.
New `--gwy-body-ink-hover` on every surface (paper steps to 700, 7.27:1; tint, ink and blue keep
their rest ink, each checked on its own raised and pressed ground), read under hover, focus and
press by every ground arrangement.

## §22 · Home round 6 — the gateway designed for its job (11 Oct 2026)

**Owner:** "THIS ISN'T EVEN IN THE KIT. It looks bad. R5 and R6 are illegal designs … why are you focusing on keeping the same layout and just changing the visual styling of the section little by little … don't put icons in a circle … identify the content, its IA, the prominence and understand the value of that section and then design for it … as a visitor, i may not know if i need product design service or design system service, but i'll probably know if i want to launch a new product."

**Cause:** rounds 1–5 restyled one shape (cards, a list, ruled grids, glyph discs) instead of designing for the band's job. Round 5's cell and round 6's filled tile mixed BlockCard's borderless tile with its hairline card, a look no one approved. Round 6's in-progress gateway work was discarded uncommitted.

**The band's job:** recognition first. The reader scans six situations in their own words, finds theirs, and only then reads one sentence and goes. The service name matters least to the reader; it is the destination.

**IA → design (Gateway, now one arrangement: the selector):**
1. **Six situations are the only repeated thing.** h3 titles down an 8-of-12 column, each on one line at 1440, a `gutter` apart, with no rules, boxes or icons.
2. **One is lit.** It is set in ink with a blue arrow after its last word; the other five rest in neutral-500 (3.1:1, large text). The lit title is the eye's entry. Pointing at a title (90ms intent) or tabbing to it lights it.
3. **Its answer stands beside it.** The sentence at `--text-lead-lg` and the service as Button's link cue, in the trailing 4 of 12 behind a blue 2px rule (the mark the arrow points at). It moves to sit level with the lit title, clamped to the list's end. Only one sentence is on screen, so the band is never dense.
4. **Below 1024:** every title shows its sentence and service under it.

**SEO and accessibility:**
- Every sentence and service is in each situation's own anchor in the HTML at every width. From 1024 it is `display: none` there, and the answer column mirrors the lit one.
- One tab stop per situation; the sentence is its `aria-describedby`.
- The answer column is `aria-hidden` and its link is `tabIndex=-1`.

**Removed:** Gateway's `grid`, `index` and `rows` arrangements, `mark`, `cue`, and the item `icon`; the disc and ground tokens. The specimen /design/kit/gateway now shows the selector on paper and tint.

**Measures:** 723 tall at 1440 (one fold), 1,557 at 390. `verify`, `build`, `aria:check` (94 pages) and shots of `/` and the specimen all pass.

### §22.1 · Round 7 — full ink, a gliding marker, smooth browsing (11 Oct 2026)

**Owner:** "i like this idea. it needs to be better so we're not fading the text out. the interaction is also not very smooth like if i'm moving my mouse across the list, it should naturally feel like i went through the options … also need to consider from SEO perspective."

**Causes and fixes:**
- **The fade.** Round 6 marked the current situation by greying the other five. Now every title stays at full ink, and the current one is marked by a raised faint-blue ground behind it plus its arrow.
- **Not smooth.** Round 6 waited 90ms of hover intent and then snapped. Now there is no delay. The marker and the answer are moved by transform and glide between rows (`--duration-medium`, standard easing). The rows have no dead strip between targets (16 inset each, no gap), so running the pointer down the list passes through each option in turn.
- **SEO.** Every sentence and service is server-rendered in its own anchor at every width. Google indexes HTML-present content at full weight even when collapsed (Mueller, March 2020), and the mobile render, which Google indexes, shows everything. Nothing loads on interaction.

**Precedent:** a list with a hover marker and a side preview is the common services-index pattern (Framer "service hover reveal", the Webflow Omakase services list). Ours keeps all titles legible and swaps an answer instead of an image.

**Explored alternative (specimen G.3, `arrangement="expand"`):** ruled rows where the current one opens in place. It is in-flow, so rows move as one opens; it needs 140ms of hover intent and cannot feel as fluid as the selector.

The title track is 8 of 12, so every title sits on one line at 1440. The band is about 755 tall at 1440.

## §23 · Product design round 6 — four bands designed for their job (11 Oct 2026)

**Owner, on `/services/product-design`:** "What you get … could be designed way better. it feels
boring and nothing guides me eye. maybe the testimonial is on side and the 4 what you get cards are
designed on one side"; "Where we start … same issue as above"; the Dealpath example "doesn't focus on
the right areas … can be designed much much better"; "ways to work with us is also quite boring and
plain". With round 6's standing correction: identify the content, its IA, its prominence and its
value, then design for it; cards only where the items are comparable objects; no hybrid looks, no
icons in discs.

**Cause, shared by all four:** each band was a shape chosen from the kit by the structure of its words
(labelled claims → text cards; quoted labels → a read-down beside a photo; three labelled paragraphs →
ruled rows beside a shot; four labelled peers → tiles beside a photo), never from what the band must
do for the reader. So every band put its items at one weight in one box shape, and nothing told the
eye where to land.

### 23.1 Job and IA first, then the form

| Band | Its job for the reader | The reader's acts | Primary / secondary | Form chosen, and why |
|---|---|---|---|---|
| 1 `outcomes` "What you get" | Say what the buyer walks away with when they buy Product Design. | Read the heading → read the four promises as one list, title first → read a gloss where it matters → see a founder vouch for the thinking. | **Primary:** the four promises as ONE offer. **Secondary:** the VideoPlasty voice. | **OfferSheet.** The h2, then the promises two up in 2 of [2, 1], each opening on a hairline with a 32px blue mark (Stat's device) and its title at the h3 role; the rated testimonial card fills the trailing 1 from the first promise's rule to the last body's line (shares both edges). Not cards: the promises are clauses of one offer, not objects to compare or click; only the voice, a different kind of thing, takes a panel. The four blue marks are the eye's entry; the panel is where it ends. |
| 2 `starting-points` "Where we start depends on what's going wrong" | Let the visitor recognise their own complaint, in their own words, and see we know where to begin. A visitor may not know which service they need; they know what is going wrong. | Scan the complaints down one edge → stop at theirs → read across to where we start. | **Primary:** the five complaints (the customers' voice). **Secondary:** our first move. | **VoiceLedger.** Complaints in the speech voice (quote-lg italic serif, the site's display-quote voice) on hairlines in 7 of [7, 5]; the reply beside each, led by a blue arrow, its first line on the complaint's first baseline. A ledger, not a card set: lines of speech read in one pass. No photograph: the words are the picture (the placeholder studio photo is retired). Different from band 1 in every axis: full-width rows of large italic type against a grid and a panel. |
| 3 `worked-example` "Example: Dealpath" | Prove, with one real product, that the work resolves a decision and ships. | See the outcome and the product → understand the problem → skim what we did → open the case. | **Primary:** the result and the evidence image. **Secondary:** the problem, what we did. **Action:** the Dealpath case. | **CaseSpread.** Row 1 [5, 7]: the h2, then "The result." as the claim — h4 title and its sentence at lead-lg in full ink behind a blue start rule (Callout's example mark) — and "Read the Dealpath case" under it · the bound Dealpath capture at 16:9, read from its top (the listing cards and "Add to pipeline", the story's own button). Row 2 on the same tracks: "The problem." under the claim, "What we did." under the image, on hairlines. The corpus has no outcome figures, so the result sentence is the large thing. Claim leads, proof supports; every word kept. The richest band on the page: the only one with a product image, a claim, an action and a two-part story. |
| 4 `engagement` "Ways to work with us" | Help the buyer pick the shape of engagement that fits, and be honest about when we are not the team. | Scan four names → see how they differ → pick one → read the limit. | **Primary:** the four options, as peers. **Secondary:** what each is. **Tertiary:** the limit (Callout note). | **EngagementOptions.** These ARE comparable objects, so four across — but each carries a scope drawing on one shared dot field, in the EngagementModel chart's drawing language: one workflow is a line through three nodes; a product area is a region holding several; a designer in your team is one blue node among yours; design and build is a dashed (drawn) region becoming a solid (built) one. Each drawing shows only what its option's name says. The drawings make the comparison before a word is read; no option is featured. Below 768 each drawing sits beside its words (2 : 3). The existing EngagementModel was checked first: it is the approved "How we work" USP chart (one team absorbing idle time), a different argument, so it was not repurposed; its drawing vocabulary was. Not icon cards: the specialist-capabilities band right under it is icon boxes. The placeholder photo is retired. |

**Squint, top to bottom (1440):** split hero with drawing · a grid with four blue marks beside a tint
panel · five lines of large italic speech on rules · a claim beside a product capture, two columns
under · a featured case with its quote, then three covers · four drawings in a row · 3 + 2 icon boxes ·
form split · centred accordion. No two adjacent bands share a skeleton.

### 23.2 Global changes this round

| Note | Cause | Fix | Scope |
|---|---|---|---|
| "lets not put anything in the eyebrow since the breadcrumb already tells the page location" | The eyebrow was a free slot each corpus hero filled; six of them echoed a crumb (P1) | PageHero renders NO text eyebrow when the hero has a trail; the rule is in the component, so a CMS eyebrow cannot bring it back. Home (no trail) keeps its eyebrow. A rating still takes the slot | Global (PageHero). Measured: no hero eyebrow on /about, product-design, the audit, healthtech, /case-studies, the Benchmark case, the tool, the CPQ article, the glossary term |
| "none of the case studies are linked … everytime a case study appears, it should be linked" | Links rendered only where the corpus authored one; cases named without one stayed text, and 11 of 17 corpus case routes were 404 | (1) `CASE_STUDY_SLUGS` + `CASE_STUDY_PLACEHOLDERS` + `caseStudyPlaceholderPath` in `routes.ts` (names → slugs, once); `@/lib/case-links` looks them up (`caseStudyLink`, `linkProofLine`, `linkCaseMentions`). (2) `/case-studies/[slug]` serves a case from the corpus when the CMS source lacks it, so all 17 corpus cases return 200. (3) Linked: hero proof lines ("Selected … work: A · B"), every case card in a case set (title-cued where nothing is authored; a mixed set takes the band's own authored "Read the case"), case-story titles (healthtech CuramCare and Vovisto → flagged PLACEHOLDER links to `/case-studies#placeholder-case-…`), home's why-tcules sentences (Auxentios, The Wandering Raven; Banner `lead` is now a node), and the first prose mention per long-form page (CPQ article: Auxentios), never the page's own case | Global (routes, lib, templates, Banner). Every case href on the ten routes returns 200 or is a flagged placeholder (P43) |
| — | Layout's `baseline` aligns LAST baselines | `align="first-baseline"` added (VoiceLedger's complaint and reply), with a /design/layout specimen | Global (Layout) |

**Applied elsewhere (same band type, and it clearly improves them):** `/audits/design-to-code-audit`
`recognition` is the same symptom shape, so it is a VoiceLedger too — four complaints in the speech
voice, replies beside them, the placeholder photo retired; it reads as the page's recognition moment
instead of a grey photo box beside two columns. Its deliverables and why-tcules photographs flip sides
(the alternation no longer counts the ledger). `/expertise/healthtech` has no outcomes, symptoms,
worked example or engagement band, so none of the four patterns applies; it takes the two global fixes
only.

**Held, and why:**
- Home "What we do": GT Tools is named inside the Software Development card, which is a whole-card
  link to the service; a link inside it would be an anchor in an anchor. The card stays as is.
- Client-name lists (home logo wall, About's "Selected clients and products" row) and testimonial
  attributions name clients, not case studies; not linked.
- Band 2 measures 840 at 1440, 10 past the 830 fold; only its bottom padding crosses (the last rule is
  at 743). No gap or type step was shrunk.
- The stretched testimonial panel in band 1 leaves an open field between the quote and the speaker
  (pinned to the foot) — anchored at both edges, as § 20.2 accepted for the diptych.

### 23.3 Measures

| Band | 1440 before | 1440 after | 390 before | 390 after |
|---|---|---|---|---|
| outcomes | 645 | 729 | — | 1,400 |
| starting-points | 697 | 840 | — | 1,086 |
| worked-example | 900 | 797 | 1,301 | 1,203 |
| engagement | 788 | 698 | — | 1,104 |
| audit recognition | — | 768 | — | 893 |

**New patterns (tier 2), each with a token layer and a specimen:** OfferSheet (`--ofs-*`,
/design/offer-sheet), VoiceLedger (`--vlg-*`, /design/voice-ledger), CaseSpread (`--csp-*`,
/design/case-spread), EngagementOptions (`--eop-*`, /design/engagement-options). OfferBands maps
`outcomes`, `symptoms`, `record` and `tiles` to them, so every offer page with those band types takes
them without an edit.
