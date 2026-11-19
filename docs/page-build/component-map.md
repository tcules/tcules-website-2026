# Component map: the 26 Oct copy, band by band

Step 1a of the launch build (29 Oct 2026). Source: `docs/page-build/census.json` (153 pages, 503 band ids),
the decision log (`npm run decisions`, 219 active rulings), the barrels in `src/components`,
`src/patterns`, `src/templates`, and the approved compositions on `main` (HomePage, OfferPage as
`/services/product-design` was approved in PR #161).

**How a builder uses this file.** The lookup in code is **section id first, shape as fallback**, and it
lives in one place: `src/templates/CorpusPage/plan.ts` (`ROLE_BY_ID`, then `kindOf`). Section A is the
id table. Section B is the fallback by shape and page family. A band that matches neither renders
`C-text` (ContentSection + GenericBlocks) and warns in development, as today.

**Scope.** The 17 case-study files in `_pages/` do not ship (the 20 live cases ship from Strapi through
`CaseStory`), so their 79 case-only ids (`case-context`, `related`, `what-this-case-establishes` and the
76 story headings) are out of this map. Counts below exclude case pages. Every other id (394 one-offs
plus 27 common) is placed exactly once.

**Rules every row below already obeys** (not repeated per row): words are never paraphrased and band
order holds, except the enquiry form sits right before the FAQ (`formBeforeFaq`); display type only in
heroes, section heads h2; body 16 max, card bodies 14, hero lead and quotes 18; two tints never touch;
no two text-heavy bands in a row (`planOffer` warns; for that check the new kinds read as follows: `quotes`,
`catalog`, `method`, `related`, `text` and `outcomes` without scenes or an image are **text**; `industries`, `table`
and anything carrying a photograph, drawing, cover or mark are **visual**); case cards carry no testimonial;
no card set uses BlockCardSet `frame="box"` (ruling 2026-10-19-no-hover-only-grounds retires it; the one boxed set
is the Bento); a clickable card
set sits under its full-width head with no decorative image beside it; an icon heads its card; no icon
in a circle; nothing hidden behind a slider or tab on the home page.

**Shape letters** (plan.ts `signature`): P paragraph · L labelled claim (`**Label.** body`) · U list ·
I `###` item · T table · K link row · A link-led line · Q quote · F form.

---

## A · Common bands (5+ shipped pages)

`head(band)` below is the existing helper in `CorpusPage/blocks.tsx` (id, heading, headingId, eyebrow).
"Kind" is the value `ROLE_BY_ID` must return for the id; new kinds are marked **new**.

| id | pages | CMS block | component and exact props | arrangement notes | tier differences | status |
|---|---|---|---|---|---|---|
| `faq` (+ `frequently-asked-questions` on /about, /future-interfaces-lab/join) | 121 | FAQ | kind `faq`: `ContentSection {...head(band)} data-band="D-faq" align="center"` › `ContentSectionText` › `FaqItems` (Accordion). A lead paragraph (shape `PIIII`, 4 pages) goes to `lead`. FAQPage JSON-LD from the same items. | Paper. Sits after the enquiry band (`formBeforeFaq`). On long-form pages it sits after the reading shell (LongformPage already does). | none | exists |
| `enquiry` | 62 | Enquiry | kind `enquiry`: `EnquiryBand page band island={{ surface: 'blue', dress: 'card', arrangement: 'halves' }}` (home's close). | Paper band, blue island in halves, drawing over the copy, untitled card. `PLF` (home): the Clutch line stays in the island copy as today. `PFP` (/contact): the trailing "Or email hello@" sits in the copy half under the lead (text never crosses the island edge). | none | exists |
| `testimonials` | 61 | Testimonials | kind `quotes` (**new** id mapping; renderer exists): `QuoteGroupBand` → `ContentSection surface="tint" align="center" lead` › 6 or more quotes: `TestimonialWall items`; fewer: the one-up `Slider` of centred `Proof` with stars (owner, 29 Oct 2026; decisions/2026-10-29-testimonials-under-six-turn-one-at-a-time). Trailing `L` "**4.8 on Clutch** from 13 reviews. [Read the reviews]" → ContentSection `footer`: `ScoreBadge`, the RatingBadge alone, the count and "Read the reviews" in its accessible name only (decisions/2026-10-29-rating-is-always-the-badge). | Tint (the proof band). Lead paragraph when authored (`PQQQL`, 8 pages). Stars from `getTestimonialRatings`, portraits from `getTestimonialAvatars` (both placeholders until Strapi). | none | needs variant: `QuoteGroupBand` takes a `footer`; `ratingOf` (HomePage) must parse "4.8 on Clutch" as well as "4.8 out of 5 on Clutch" |
| `selected-work` | 55 | Selected work | kind `cases` (re-pointed: today `###` items plan as `caseStories`, one horizontal card band each): `ContentSection {...head(band)} lead data-band="M"` › `BlockCardSet lead="none" across={3} scroll="never" cue="cta" size="md"`. Item: `title` = `###` heading as authored, `body` = its paragraph with the trailing "Read the … case" link lifted out, `href` = the LIVE slug, `ctaLabel` = the authored link text, `media` = `{ type: 'image', image: coverFor(page, title, ref) }` (Strapi thumbnail, 16:9). | Always 3 cases in the copy (42 with a lead `PIII`, 13 without). A set of 4+ on an offer page would take `Slider peek` (ruling 26 Oct); none does today. Paper. Home: see § E. | home differs (§ E) | needs variant: `caseGroups` must read `###` items; 272 references reach a live case only through a redirect and must be rewritten to the live slug (`lib/case-links`) |
| `why-tcules` | 55 | Why Tcules | kind `reasons` (id exists; renderer changes): `Reasons {...head} items action lead`: head above, items below, each drawing above its words (decisions/2026-10-29-set-reasons-head-above-drawing-above; `beside` retired 29 Oct). Items = the 3 list bullets: `title` = bold lead, `body` = `renderInline(rest)` (keeps the case links). `figure` = the reason's isometric drawing, keyed by reason title. `lead` = the first paragraph. `action` = `CtaRow rule={false} actions` from the closing link row (2 links). | Paper. 7 distinct reason titles across 54 offer pages (pool, mixed in threes); home has its own 3 (`PIII`). Three is accepted by 2026-10-22-reasons-four-in-a-2x2 (three and six fill whole rows). Until every item has a figure, render `OfferSheet across={3}` (the "draws only when every item has a drawing" rule). | none | needs variant: `Reasons` has no `lead`; 10 figures missing (7 offer + 3 home) |
| `how-we-work-together` | 55 | How we work together | kind `tiles`: `EngagementOptions lead options terms actions` (owner, second review 29 Oct 2026; decisions/2026-10-29-how-we-work-together-band, superseding the isometric Reasons form of 2026-10-26-service-items-drawn-per-item). `lead` = the paragraphs before the options, stacked. Options = the 3 `L`, each drawn flat (Sketch `scope-*`), three tracks. `terms` = the two paragraphs after the options, side by side on hairlines. `actions` = `LinkActions pair` (an outlined button, then the link) at the band's end. | Paper. 54 pages share the 3 titles "A focused engagement." / "A defined project." / "An ongoing partnership." (home: "A focused problem or assessment." / "An ongoing product relationship."). `scopeOf` maps focused → `feature`, defined project → `area`, ongoing → `embedded`. Directly above `why-tcules` on every offer page; the flat drawings beside Why Tcules' isometric ones tell the two apart. | none | built |
| `industries` | 53 | Industries | kind `industries` (**new**), the S7 band: `ContentSection {...head} lead` › `Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="none"` of `Teaser arrangement="row" size="sm" href title media` (end thumbnail = the sector's photo, `HOME_SECTOR_PHOTOS`, or the product type's illustration crop). | 1–12 links per page (counts: 1·1, 2·5, 3·6, 4·5, 5·7, 6·7, 7·3, 8·2, 9·1, 10·1, 11·12, 12·3). **Approved form first**: where the count fills whole rows (3, 4, 6, 8, 9, 12: 24 pages, product-design's 12 among them) the band is home's approved `expertise` set, `BlockCardSet lead="none" across={4 for 4/8/12, else 3} cue="title" phone="pair"` with the sector photographs; only the other counts (29 pages, the twelve 11-link expertise pages among them) take the rows below, which hold any count without a hole (Q15). `P` shape (5 audit pages): the sentence is the `lead`, its links become the rows. Heading is "Other industries we know" on the 12 expertise pages. Paper. | none | missing (hi-fi mock first; § C2) |
| `what-you-get` | 41 | What you get | kind `outcomes` (re-pointed: today resolves to `generic`): `OfferSheet {...head} lead items note across`. `items` = the "What you receive" list: a list item with a colon inside its first 70 characters splits into `title`/`body` at it, else the whole sentence is the `title`. `scene` from `offer-scenes.ts` (all or none). `note` = the three labelled terms (Who does the work / What we need from you / Where our part stops) as `ListTiles columns={3}`, then the closing paragraph (`PLULLLP`, 12 expertise). `across` = 2 for 2 or 4 items, 3 for 3, 5 or 6 (OfferSheet's own note: five two-up leaves the fifth alone). **7 or 8 items** (17 pages: 7 expertise, 10 services; OfferSheet is built for 2–6 and warns) → `ContentSection {...head} lead` › `ReadDown columns={1} photo` of the items, the terms tiles under it as the footer (Q16). **Expertise** (12): the band takes the page's sector photograph (`HOME_SECTOR_PHOTOS`, else the product type's illustration, else `getKitPhoto`) as `asideImage` (≤6 items) or ReadDown `photo` (7), so the band between `hard-parts` and `testimonials` is the visual one (C16). | Paper. `TP` (1, /how-we-work/ai-native-product-design) → kind `table`. 5 items: 13 pages, 6: 10, 7: 15, 8: 2. | none | needs variant: `OfferSheet` has no `lead`; plan must parse the bare-list shape |
| `next` | 24 | Rich section (close) | Long-form close (terms): LongformPage term close, tint `ContentSection` + `CtaRow` of the link. Tools: ToolPage's close. | Tools put `next` before `faq`; ToolPage treats the LAST band as the close, so it must key the close on id `next` instead. | none | exists (terms); needs fix (tools) |
| `related-reading` | 22 | Related reading | kind `related` (**new**): `ContentSection {...head}` › `Layout as="ul" rowGap="none"` of `ListCard titleAs="h3" title href body` (the long-form Router fallback). `P` shape (8 pages, one paragraph of inline links) → `ContentSectionText` Prose. | After the FAQ on articles, guides, podcasts. Paper. | C-tier pages same | exists (pieces) |
| `practice` | 18 | Rich section | Long-form shell section (`ArticleSection`, Prose). | Terms. | — | exists |
| `comparison` | 17 | Comparison | Long-form shell section with `CorpusTable` (DataTable) in the reading column, lead above. | Terms. | — | exists; key-cell links need § C6 |
| `hard-parts` | 15 | Rich section (the band id picks the kind) | kind `personas` when it holds a quoted persona table (3 pages, `TPIII` / `PTIIII`): part a the ruled tile set `ListTiles` (title = quoted column, body = who; VoiceLedger retired 17 Nov 2026, O.5a), part b (`hard-parts-2`) the `###` items as `ReadDown columns={2} rows`. Otherwise kind `challenges` (**new**): `ContentSection {...head} lead` › `ReadDown` rows: `###` heading or bold label = `title`, its paragraphs (the "Example:" line included) = `bodyHtml`. With a bound image (product-design: `product_design_doodle`) → `ReadDown columns={1} photo`. Expertise (no bound image): `ReadDown columns={2}` from 4 items, `columns={1}` for 3, no photo: the photograph goes to `what-you-get` below it (C16). | Not an OfferSheet: on expertise it sits between `selected-work` and `what-you-get` (an OfferSheet), and on product-design right after `what-you-get`. | none | needs plan kind |
| `what-we-design` | 13 | Rich section (the band id picks the kind) | kind `catalog` (**new**): `OfferSheet {...head} items across={3}`. Item `title` = the bold lead, `body` = the rest ("that connect families with carers at home · CuramCare"). | Expertise, first band after the hero. A bold lead authored as a link must keep it: § C7. | none | needs variant (OfferSheetItem `href`) |
| `compare` | 11 | Comparison | kind `table`: `ContentSection {...head} lead data-band="E"` › `CorpusTable` (DataTable); paragraphs after the table → `footer` Prose. | Audits, services, tools. | — | exists; key-cell links § C6 |
| `routes` | 10 | Routes (the CMS name; cms-templates § 4, L2 slot 3) | kind `table`, as `compare`: its key column mixes the page's own option with linked alternatives, which is a comparison, not a router. The key column mixes the page's own option (bold, unlinked) with linked alternatives. | Level-2 services. | — | exists; key-cell links § C6 |
| `related-terms` | 9 | Related reading | kind `router` (A lines): `Layout as="ul" rowGap="none"` of `ListCard titleAs="h3" href title body` inside the term page. | Terms. | — | exists (Router fallback) |
| `articles` | 8 | Related reading (author's pieces) | `ContentSection` › `Layout as="ul" columns={{ base: 1, md: 2 }}` of `Teaser arrangement="row" size="md"` (thumbnail when the piece has a Strapi cover). | Author pages (tier C). | — | missing: no author template or route (`/insights/authors/*` falls to `[...slug]`) |
| `client-recognition` | 7 | Client recognition | Home's `Recognition`: `Section` › `LogoGrid marks context={heading} contextAs="h2" align="center" edges="closed"` (named clients first via `clientMark`, then `CLIENT_MARKS`). `badge` only when the band authors a rating (none does now). | Paper, first band after the hero (/, /services, /expertise, /case-studies, /clients, /how-we-work, /why-tcules). | none | exists |
| `method` | 7 | Rich section (the band id picks the kind) | kind `method` (**new**): `ContentSection {...head} lead` › `Layout rowGap="stack"` of `Steps steps` (each ordered item: bold lead = `title`, rest = `body`) then `CorpusTable` when a table follows. `PLLPPLLP` (prototype-readiness-review): the labelled claims are the steps. | Audits and assessments. Paper. | — | needs plan kind |
| `scope` | 7 | by shape | `PLULLL` (3 services) → as `what-you-get`. `PTPPT`, `TPPPPP`, `PTP` (3 services) → kind `table`. `PP` (/privacy-policy) → long-form Prose. | — | — | follows its shape |
| `talk` | 6 | Rich section | `ListingIndex closing` (copy + action) on /insights and the format pages; on /future-interfaces-lab `CtaSection arrangement="open"` (it closes the page). | — | — | exists |
| `who-its-for` | 6 | Rich section | ToolPage band (Prose; media split when the page has a slot). | Tools. | — | exists |
| `workspace` | 6 | Rich section (tool) | ToolPage workspace (the tool's mount, its lead above). | Tools. | — | exists |
| `deliverables` | 5 | What you get (audit) | kind `deliverables` (exists): `OfferSheet {...head} items asideImage note`, items from the bold-led list. NEW in the copy: the worked finding (`P T P`) and the three labelled terms. They go to part b (`deliverables-2`, no new heading): `ContentSection` › `Layout rowGap="stack"`: the two paragraphs as `ContentSectionText`, `CorpusTable` (2 columns, Field / The finding), then `ListTiles columns={3}` of the terms. | Audits, assessment. Part b is visual (a table). | — | needs variant (split) |
| `services-on-their-own` | 5 | Routes | kind `router` (adapter **new**: today Router reads A lines only): rows of the table → `title` = the linked service name, `body` = the "Best for" cell. `Bento tracks={3}` when every href has an offer scene, else `BlockCardSet lead="none" across={3} cue="title" scroll="never"` with `icon = glyphForRoute(href)` (no `frame`: 2026-10-19-no-hover-only-grounds). Paragraph after the table → `footer` Prose (keeps its links). | Product-design has 7 rows: 3 + 3 + 1 leaves a hole in either grid, and only 5 of the 7 have a `specialist-*` scene (New Product Design has a service scene, UX & Product Audit none). See Q7. | — | needs adapter; Q7 |
| `example` | 5 | Rich section (tool) | ToolPage band (Prose). | Tools. | — | exists |

---

## B · One-off bands, grouped by shape signature

Every id with fewer than 5 shipped pages is in exactly one group below (primary group). Eleven ids recur
on pages of different families; each occurrence follows its own family's rule, and the id is listed once,
under its first family: `insights` and `expertise` (home G24, sitemap G7), `how-we-work` (/about G13,
sitemap G7), `case-studies` (/clients G20, sitemap G7), `brief` (/contact G13, tool G22), `services`
(/expertise and /matter-design-system G12, sitemap G7), `design-systems`, `modernisation`, `ai`
(insights G8, tools hub G23, glossary hub G6), `principles` (/why-tcules G15, glossary term G1), `use`
(/matter-design-system G19, terms of use G1). **No id fits none.**

The page family decides first: a **long-form** page (article, guide, podcast, defined term, glossary term,
legal, policy, author, sitemap) renders every band as one section of the reading shell, so G1–G7 are
blocks inside `LongformShell`, not bands. Every other family composes bands (G8–G24).

### Long-form families (inside `LongformPage` / `LongformShell`; each band is one TOC section)

**G1 · Prose sections** — signature `P+` (paragraphs only). The argument as running text.
Component: `ArticleSection` → `Prose`. CMS: Rich section. The shell already breaks Prose with the next
non-Prose section, so no rhythm rule applies inside it.
Ids (109 ids, 117 bands): `what-cookies-are` PP — `/cookie-policy`; `your-choices` PP — `/cookie-policy`; `managing` PP — `/cookie-policy`; `personal-information` P — `/cookie-policy`; `changes` P — `/cookie-policy`, `/privacy-policy`, `/terms-of-use`; `contact` P — `/cookie-policy`, `/privacy-policy`, `/terms-of-use`; `how-to-use` PPP — `/glossary`; `examples` P/PP — `/glossary/agentic-ux`, `/glossary/ai-assisted-product-development`, `/glossary/ai-native-product-design`; `risks` PPP — `/glossary/ai-assisted-product-development`; `ai-native-comparison` PP — `/glossary/ai-assisted-product-development`; `ai-assisted-vs-ai-native-product-design` PP — `/glossary/ai-native-product-design`; `ai-native-vs-agentic` PP — `/glossary/ai-native-product-design`; `ai-native-does-not-mean-autonomous-design` PPPK — `/glossary/ai-native-product-design`; `principles` PPP — `/glossary/ai-product-ux`; `role` PP — `/glossary/design-engineering`; `causes` PP — `/glossary/design-system-drift`; `design-vs-code-drift` PPP — `/glossary/design-system-drift`; `customer-journey` PP — `/glossary/user-journey-mapping`; `where-ai-fits` PPP — `/how-we-work/ai-transparency`; `client-information` PP — `/how-we-work/ai-transparency`; `review` PP — `/how-we-work/ai-transparency`; `trust-should-match-capability` PPP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `five-things-in-omny-ai-and-buildtwin` PPPPP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `an-assistant-proposes-pausing-a-campaign` PPP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `match-authority-and-recovery-to-consequence` PPPP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `when-should-an-ai-interface-identify-itself-and-` PP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `test-a-behavioural-explanation-before-acting-on-` PPP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `when-does-persuasion-become-manipulation` PPP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `saas-design-system-examples` PPP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `design-system-lessons-from-our-work` PPP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `what-must-a-shared-component-prove-before-releas` PPPP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `ux-vs-cx-vs-service-design` PP — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `put-the-decision-before-the-discipline-label` PPP — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `where-ux-met-cx-gold-image-printing` PPP — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `chat-is-not-the-product-model` P — `/insights/articles/generative-ai-product-patterns-for-saas`; `how-to-choose` PPP — `/insights/articles/generative-ai-product-patterns-for-saas`; `what-happens-when-ai-cannot-help` PP — `/insights/articles/generative-ai-product-patterns-for-saas`; `research-where-people-complain-not-where-they-ar` PP — `/insights/articles/my-experiments-with-ux-aishwarya-ashok`; `write-the-principles-before-the-features` PPP — `/insights/articles/my-experiments-with-ux-aishwarya-ashok`; `deciding-not-to-look-like-the-parent-company` PP — `/insights/articles/my-experiments-with-ux-aishwarya-ashok`; `what-to-take-from-it` PP — `/insights/articles/my-experiments-with-ux-aishwarya-ashok`, `/insights/articles/my-experiments-with-ux-karthik-pasupathy`; `show-the-person-what-they-came-for` PP — `/insights/articles/my-experiments-with-ux-karthik-pasupathy`; `the-step-nobody-runs` PP — `/insights/articles/my-experiments-with-ux-karthik-pasupathy`; `what-ai-actually-changes` PP — `/insights/articles/my-experiments-with-ux-karthik-pasupathy`; `what-is-a-silent-ui-regression` P — `/insights/articles/silent-ui-regression-debt`; `why-the-damage-arrives-before-the-evidence` PP — `/insights/articles/silent-ui-regression-debt`; `benchmark-gensuite-scope-selector` PPP — `/insights/articles/silent-ui-regression-debt`; `where-this-work-sits` PP/PPP — `/insights/articles/silent-ui-regression-debt`, `/insights/cpq-ux-design`; `you-shipped-the-trust-affordances-nothing-moved` PPPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `where-a-review-step-actually-returns-control` PPPPPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `make-the-price-and-the-approval-visible-before-submission` PPPP — `/insights/cpq-ux-design`; `if-you-are-re-platforming-move-the-model-not-the-screens` PPPP — `/insights/cpq-ux-design`; `what-is-a-saas-design-agency` PP — `/insights/guides/best-saas-design-agencies`; `agency-or-development-company` P — `/insights/guides/best-saas-design-agencies`; `commerce-platforms-are-also-operating-systems` PP — `/insights/guides/ecommerce-product-experience-decision-guide`; `ai-should-reduce-uncertainty-not-invent-certaint` P — `/insights/guides/ecommerce-product-experience-decision-guide`; `from-our-work-gt-tools` PPP — `/insights/guides/ecommerce-product-experience-decision-guide`; `why-did-the-customer-abandon-the-path` PPP — `/insights/guides/ecommerce-product-experience-decision-guide`; `test-the-fit` PP — `/insights/guides/how-to-choose-a-product-design-agency`; `checks-on-a-real-project` PPPPP — `/insights/guides/how-to-choose-a-product-design-agency`; `how-we-measure-up` PP — `/insights/guides/how-to-choose-a-product-design-agency`; `what-is-a-ux-audit` PP — `/insights/guides/how-to-use-a-ux-product-audit`; `how-much-can-the-sample-prove` PP — `/insights/guides/how-to-use-a-ux-product-audit`; `begin-with-standards-not-stereotypes` PPP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `connect-the-response-to-a-real-barrier` PP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `what-does-conformance-prove` PP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `keep-the-promise-consistent-before-during-and-af` PPPP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `use-proof-to-help-the-visitor-reason` PPP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `how-we-apply-this-on-our-own-site` PPP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `how-should-the-live-page-and-form-be-validated` PP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `follow-a-signal-into-the-action-it-changes` PP — `/insights/guides/marketing-automation-software-design-best-practices`; `what-happens-when-a-message-should-not-send` PP — `/insights/guides/marketing-automation-software-design-best-practices`; `from-our-work-ryzeo-reporting` PPP — `/insights/guides/marketing-automation-software-design-best-practices`; `ask-which-moments-deserve-a-mobile-surface` PP — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `does-the-mobile-case-survive-real-windows-and-in` PPPP — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `from-our-mobile-work` PPPP — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `frequency-is-a-target-only-where-value-actually-` PP — `/insights/guides/saas-engagement-and-subscription-decisions`; `which-intervention-if-any-follows-disengagement` PPP — `/insights/guides/saas-engagement-and-subscription-decisions`; `from-our-work-scissors` PPPP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `what-should-count-as-activation` PPP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `model-choice-was-a-product-problem-before-it-was` PP — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `a-wider-audience-changes-what-control-has-to-loo` PP — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `find-the-work-worth-improving-before-scoping-the` PP — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `how-to-use-this-episode` PP — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `what-authority-and-recovery-controls-does-an-ai-` P — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `data-validates-an-interpretation-it-does-not-exp` PP — `/insights/podcasts/mastering-design-decisions`; `medicine-availability-as-a-worked-example` PP — `/insights/podcasts/mastering-design-decisions`; `what-makes-a-designer-trustworthy-inside-an-orga` PP — `/insights/podcasts/mastering-design-decisions`; `ai-changes-speed-not-responsibility` PPP — `/insights/podcasts/mastering-design-decisions`; `what-should-the-team-record-when-disciplines-dis` PP — `/insights/podcasts/mastering-design-decisions`; `is-vibe-coding-production-ready` PPPPP — `/insights/vibe-coded-app-production-ready`; `what-does-a-design-system-consultant-do` PP — `/insights/when-to-hire-a-design-system-consultant`; `what-drives-design-system-consultant-cost` PP — `/insights/when-to-hire-a-design-system-consultant`; `where-tcules-fits` PPP — `/insights/when-to-hire-a-design-system-consultant`; `who-we-are` PP — `/privacy-policy`; `transfers` P — `/privacy-policy`; `retention` P — `/privacy-policy`; `security` PP — `/privacy-policy`; `children` P — `/privacy-policy`; `acceptance` P — `/terms-of-use`; `use` PP — `/terms-of-use`; `your-content` PP — `/terms-of-use`; `client-work` PP — `/terms-of-use`; `intellectual-property` PP — `/terms-of-use`; `links` P — `/terms-of-use`; `warranties` P — `/terms-of-use`; `liability` PPP — `/terms-of-use`; `indemnity` P — `/terms-of-use`; `governing-law` PP — `/terms-of-use`

**G2 · Prose with a list** — signature `P* U P*`. A paragraph argument with an enumerated point list.
Component: `Prose` (list inline). An ordered list of bold-led steps uses `Steps` (`stepsOf`, as today).
CMS: Rich section. Ids (63 ids, 65 bands): `how-we-use` PU/PUP — `/cookie-policy`, `/privacy-policy`; `keeping-intent` UP — `/glossary/design-intent`; `measure` PU/PUPP — `/glossary/design-system-adoption`, `/glossary/ux-debt`; `workflow` PU — `/glossary/design-to-code`; `steps` PU — `/glossary/prototype-hardening`; `agreeing-an-approach` PUP — `/how-we-work/ai-transparency`; `evaluate-the-relationship-not-only-task-speed` PUP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `start-with-the-team-s-bias` PUP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `representative-example-choosing-a-saas-plan` PPUP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `four-tests-on-gt-tools` PPUP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `ask-these-before-you-use-a-behavioural-idea` PUP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `the-library-is-not-the-outcome` PUP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `adoption-is-a-product-problem` PPPUP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `how-a-product-need-becomes-a-shared-release` PUPP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `what-to-measure` PUP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `where-the-boundary-between-them-actually-falls` PPUPP — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `which-boundary-is-large-enough-to-explain-the-fa` PUPP — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `writers` U — `/insights/authors`; `a-confidence-score-is-a-label-not-a-handoff` PUPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `how-we-design-the-point-where-control-comes-back` PUPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `find-the-handoff-in-your-own-feature` PUPPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `how-should-cpq-software-be-designed` PPUP — `/insights/cpq-ux-design`; `the-quote-is-the-shared-object` PPPPUP — `/insights/cpq-ux-design`; `design-for-the-revision-not-the-first-draft` PPU — `/insights/cpq-ux-design`; `how-to-tell-whether-reps-are-using-it` PPUP — `/insights/cpq-ux-design`; `how-we-compared` UP — `/insights/guides/best-saas-design-agencies`; `which-fits` U — `/insights/guides/best-saas-design-agencies`; `measure-the-whole-path` PUP — `/insights/guides/ecommerce-product-experience-decision-guide`; `post-purchase-and-returns-ux` PPUP — `/insights/guides/ecommerce-product-experience-decision-guide`; `red-flags` PUP — `/insights/guides/how-to-choose-a-product-design-agency`; `first-call` U — `/insights/guides/how-to-choose-a-product-design-agency`; `choose-the-audit-question` PUP — `/insights/guides/how-to-use-a-ux-product-audit`; `inspect-more-than-the-interface` PUP — `/insights/guides/how-to-use-a-ux-product-audit`; `prioritise-by-consequence-and-confidence` PPUP — `/insights/guides/how-to-use-a-ux-product-audit`; `assisted-use-is-two-people-not-one` PPUP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `do-not-simplify-the-person-away` PPU — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `include-people-in-the-evidence` PUP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `confirm-these-before-you-release` PUP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `start-with-the-acquisition-sentence` PPUP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `write-the-story-before-arranging-the-interface` PPUP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `one-action-can-appear-more-than-once` PPUP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `the-confirmation-is-part-of-the-page` PUP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `measure-the-decision-not-the-decoration` PUPP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `answer-these-five-questions-before-you-design-an` PUP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `model-the-campaign-before-the-interface` PUPPP — `/insights/guides/marketing-automation-software-design-best-practices`; `make-rules-reviewable-at-the-moment-of-consequen` PUP — `/insights/guides/marketing-automation-software-design-best-practices`; `design-different-modes-for-different-work` PPU — `/insights/guides/marketing-automation-software-design-best-practices`; `evaluate-the-operating-model` PUP — `/insights/guides/marketing-automation-software-design-best-practices`; `find-the-moments-that-cannot-wait` PUP — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `how-this-reads-for-an-approval-product` PUP — `/insights/guides/saas-engagement-and-subscription-decisions`; `define-first-value-for-each-role` PUPP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `use-assistance-at-the-point-of-uncertainty` PPUP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `activation-is-a-chain-not-a-single-event` PUP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `onboarding-checklist` PU — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `technical-and-product-decisions-belong-in-the-sa` PPUP — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `the-roadmap-is-a-communication-tool` PPU — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `the-first-decision-is-how-to-listen` PPPU — `/insights/podcasts/mastering-design-decisions`; `roadmap-decisions-are-negotiated-constraints` PPUP — `/insights/podcasts/mastering-design-decisions`; `vibe-coded-app-maintenance-and-technical-debt` PPUPP — `/insights/vibe-coded-app-production-ready`; `when-a-consultant-is-the-wrong-answer` PPPPU — `/insights/when-to-hire-a-design-system-consultant`; `information-we-collect` U — `/privacy-policy`; `sharing` PU — `/privacy-policy`; `your-rights` PUPPPUP — `/privacy-policy`

**G3 · Prose with a table** — any long-form signature holding `T`. A comparison or checklist the
argument leans on. Component: `ArticleSection` with `CorpusTable` (DataTable) in the column, Prose
around it. CMS: Rich section with a Comparison block. Ids (47 ids, 47 bands): `figma-comparison` PTP — `/glossary/coded-prototype`; `components` PT — `/glossary/design-system`; `prototype-vs-production` T — `/glossary/prototype-hardening`; `template` PT — `/glossary/user-journey-mapping`; `debt-types` PT — `/glossary/ux-debt`; `patterns` PT — `/glossary/workflow-design`; `consequence-determines-friction` TP — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `which-cognitive-biases-matter-in-product-design` PTP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `interface-cues-have-consequences` PPTP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `dark-patterns-vs-nudges` PTP — `/insights/articles/cognitive-biases-in-ecommerce-and-saas-products`; `what-should-a-saas-design-system-include` PTP — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `not-every-product-needs-a-programme` PPT — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `design-thinking-vs-ux` PPT — `/insights/articles/design-thinking-vs-cx-vs-ux-explained`; `each-pattern-needs-a-different-control` T — `/insights/articles/generative-ai-product-patterns-for-saas`; `retrieval-vs-generation-ux` PTPP — `/insights/articles/generative-ai-product-patterns-for-saas`; `patterns-in-products-we-designed` PTP — `/insights/articles/generative-ai-product-patterns-for-saas`; `the-question-to-ask-before-a-release` PTP — `/insights/articles/silent-ui-regression-debt`; `is-ui-regression-testing-enough` PTP — `/insights/articles/silent-ui-regression-debt`; `mechanism-map` T — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `where-control-returns-in-our-ai-work` PTPP — `/insights/confidence-scores-dont-fix-trust-when-review-step-never`; `decide-which-kind-of-quote-you-are-designing-for` PTP — `/insights/cpq-ux-design`; `cpq-ux-checklist` T — `/insights/cpq-ux-design`; `at-a-glance` T — `/insights/guides/best-saas-design-agencies`; `each-stage-fails-in-its-own-visible-way` TP — `/insights/guides/ecommerce-product-experience-decision-guide`; `partner-type` PTP — `/insights/guides/how-to-choose-a-product-design-agency`; `every-finding-has-to-answer-the-same-questions` PTP — `/insights/guides/how-to-use-a-ux-product-audit`; `dealpath-audit-finding` PTP — `/insights/guides/how-to-use-a-ux-product-audit`; `start-from-the-barrier-not-the-guideline` TP — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `inclusive-design-examples` PT — `/insights/guides/inclusive-product-design-for-older-and-disabled-people`; `build-the-page-as-an-evidence-sequence` PTPP — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `ai-changes-the-review-problem` PPPT — `/insights/guides/marketing-automation-software-design-best-practices`; `only-some-moments-justify-a-mobile-surface` TP — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `from-our-work-doodle` PPTP — `/insights/guides/saas-engagement-and-subscription-decisions`; `diagnose-the-type-of-disengagement` TP — `/insights/guides/saas-engagement-and-subscription-decisions`; `each-role-reaches-first-value-by-a-different-rou` TP — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `what-the-recording-supports-and-where-it-stops` T — `/insights/podcasts/do-ai-not-for-ai-s-sake-but-for-your-user-insights-from-eden-ai-s-ctpo`; `stakeholder-disagreement-is-often-missing-transl` PPTPP — `/insights/podcasts/mastering-design-decisions`; `what-is-a-vibe-coded-app` PPTP — `/insights/vibe-coded-app-production-ready`; `what-changes-when-real-users-arrive` PTP — `/insights/vibe-coded-app-production-ready`; `the-path-from-prototype-to-production` PTPP — `/insights/vibe-coded-app-production-ready`; `should-you-keep-harden-or-rebuild-what-the-ai-built` PTP — `/insights/vibe-coded-app-production-ready`; `five-states` PTP — `/insights/vibe-coded-app-production-ready`; `who-can-help-with-which-part` PTPPPP — `/insights/vibe-coded-app-production-ready`; `when-should-you-hire-a-design-system-consultant` PPPTP — `/insights/when-to-hire-a-design-system-consultant`; `what-should-a-good-design-system-consultant-deliver` PTP — `/insights/when-to-hire-a-design-system-consultant`; `consultant-agency-or-agent-which-kind-of-help` PTLLLPP — `/insights/when-to-hire-a-design-system-consultant`; `how-to-judge-the-work-before-and-after-you-sign` PT — `/insights/when-to-hire-a-design-system-consultant`

**G4 · Labelled runs** — signatures with `L` and no `I`/`T`. A set of named points, each a bold run-in
lead. Component: `Prose` (the bold lead stays a run-in); numbered labels ("1.") → `Steps`. CMS: Rich
section. Ids (12 ids, 12 bands): `1-generate-a-candidate` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `2-transform-supplied-material` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `3-retrieve-and-synthesise` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `4-recommend` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `5-predict-or-detect` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `6-orchestrate-a-workflow` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `7-act-with-delegated-authority` PLL — `/insights/articles/generative-ai-product-patterns-for-saas`; `four-ways-an-interface-decays-quietly` LLLL — `/insights/articles/silent-ui-regression-debt`; `make-the-configuration-rules-explain-themselves` PPPLLLLP — `/insights/cpq-ux-design`; `a-finding-written-the-way-it-should-arrive` PLLLLL — `/insights/guides/how-to-use-a-ux-product-audit`; `where-do-vibe-coded-apps-break-first` PLLLLLPPP — `/insights/vibe-coded-app-production-ready`; `from-coded-demo-to-live-module` PPLL — `/insights/vibe-coded-app-production-ready`

**G5 · Subsections** — signatures with `I`. A section split into `###` subsections. Component: `Prose`
with h3 subsections (`ArticleSection`); on /insights/guides/best-saas-design-agencies `the-eight-studios`
is eight peer profiles, still h3 subsections (tier B, no cards). CMS: Rich section.
Ids (11 ids, 11 bands): `five-contracts-have-to-be-visible-to-the-person` PIIIII — `/insights/articles/building-trust-and-transparency-in-ai-first-user-interfaces`; `four-things-must-correspond-across-design-code-a` PIIII — `/insights/articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency`; `the-eight-studios` IIIIIIII — `/insights/guides/best-saas-design-agencies`; `five-decisions-shape-the-purchase` PIIIII — `/insights/guides/ecommerce-product-experience-decision-guide`; `six-checks` IIIIII — `/insights/guides/how-to-choose-a-product-design-agency`; `set-the-first-principles-before-the-page-section` PIII — `/insights/guides/landing-page-design-guide-to-boost-conversions`; `choose-a-product-shape` PIIII — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `resolve-the-hard-product-questions` IIIII — `/insights/guides/saas-does-your-app-need-a-mobile-version`; `build-a-value-behaviour-signal-chain` PIIII — `/insights/guides/saas-engagement-and-subscription-decisions`; `map-the-path-from-promise-to-operation` PIIIII — `/insights/guides/saas-onboarding-strategies-to-increase-customer-retention`; `from-our-own-design-system-work` PII — `/insights/when-to-hire-a-design-system-consultant`

**G6 · Term indexes** — signature `A+` (link-led lines: "[Term](href): definition"). A router to term
pages. Component: `Layout as="ul" columns={{ base: 1, md: 2 }} rowGap="none"` of
`ListCard titleAs="h3" href title body` (the Router fallback). CMS: Related reading (references to term pages; cms-templates § 4 lists `/glossary` as Related reading ×5).
Ids (5 ids, 5 bands): `ai-in-products` AAA — `/glossary`; `ai-in-practice` AA — `/glossary`; `design-and-code` AAAAA — `/glossary`; `design-systems` AAAA — `/glossary`; `structure` AAAAAP — `/glossary`

**G7 · Sitemap groups** — `/sitemap`, lists of links. Component: one `Section`, `Layout columns={{ base: 1,
md: 2, lg: 3 }}` of h2 + `Prose` link list per group; `###` subgroups stay h3. CMS: none (generated from
`routes.ts` + the content index; the copy is the order). Ids (13 ids, 13 bands): `company` U — `/sitemap`; `how-we-work` U — `/sitemap`; `studio-projects` U — `/sitemap`; `services` UIIIIII — `/sitemap`; `audits` U — `/sitemap`; `expertise` UII — `/sitemap`; `case-studies` UIIII — `/sitemap`; `insights` UIIIII — `/sitemap`; `tools` U — `/sitemap`; `glossary` UI — `/sitemap`; `glossary-ai-practice` U — `/sitemap`; `glossary-design` III — `/sitemap`; `legal` U — `/sitemap`

### Listing families

**G8 · Curated reading groups** — `/insights` and the format pages, signatures `PLLP`, `PLLLP`, `L+`: a
reader-segment head, then pieces as bold-linked title + one-line description. Component: a
`ListingSection` (one-line head) of `Teaser` pieces in the `ListingIndex` view (lead piece as the
horizontal card, then rows of three, ruling 2026-10-23-listing-group-lead-and-grid). The segment
sentence (`P`) is not set as a lead: a listing head has no lead (ListingIndex rule). See Q8 (it is
copy). CMS: Related reading (references). Ids (14 ids, 15 bands): `new-product` PLLP — `/insights`; `ai-product-ux` PLLP — `/insights`; `design-systems` LL/PLLP — `/insights`, `/insights/articles`; `modernisation` PLLP — `/insights`; `saas-ux` PLLLP — `/insights`; `ai` LLL — `/insights/articles`; `quality` LL — `/insights/articles`; `saas` LLL — `/insights/articles`; `interviews` PLL — `/insights/articles`; `partner` LL — `/insights/guides`; `saas-value` LLL — `/insights/guides`; `operations` L — `/insights/guides`; `improve` LL — `/insights/guides`; `commerce` LL — `/insights/guides`

**G9 · Format menus** — `T` tables of formats ("which-…"), `episodes`, `sessions`. The format switch
of the listing. Component: the ListingIndex format menu / picker. On `design/insights-filters`
(unmerged) the format pages are retired, so these become the finder's format filter and the format
routes 301 to `/insights?format=…`. CMS: Comparison (`formats`, `which-*`) and Rich section (`sessions`), as cms-templates § 4 stores them; the front end derives the menu and may ignore the stored table. Ids (6 ids, 6 bands): `formats` T — `/insights`; `which-article` T — `/insights/articles`; `sessions` LL — `/insights/events`; `which-guide` T — `/insights/guides`; `which-episode` T — `/insights/podcasts`; `episodes` LLP — `/insights/podcasts`

**G10 · Case index** — `/case-studies`. Component: `ListingIndex` from `caseIndexProps` (the Strapi
list; "opens by stage" ruling); `featured` (3 `###`) → `CaseCard` ×3 (`reverse` alternating); the four
stage tables (`T`) are the stage groups (`CaseGroup`). The table's "Best for" column has no slot on a
case card (Q9). CMS: Selected work (references) + the case collection. Ids (5 ids, 5 bands): `featured` III — `/case-studies`; `new-products` T — `/case-studies`; `established-products` T — `/case-studies`; `ai-products` T — `/case-studies`; `designed-and-built` T — `/case-studies`

### Composed families (OfferPage `UnitView`, HomePage, AboutPage, or the new corpus routes in § E)

**G11 · Option and record tables** — signature with `T` whose key column is not all links (or the
table is a record). Options against dimensions, or a record of facts. Component: kind `table`:
`ContentSection {...head} lead data-band="E"` › `CorpusTable`; paragraphs before the table → `lead`
(first) and `ContentSectionText` (rest); paragraphs after → `footer`. Two tables in one band
(`finding`, `transition`, `change-path`, `mapping`, `gap-map`) → `Layout rowGap="stack"` of both, prose
between. `company-record` (/about) → DataTable `keyColumn={{ heading: 'Fact' }}` plus Organization
JSON-LD. `client-list` (/clients) → DataTable keyed by the linked client (§ C6). Bands with a bound image
(`autonomy`, `transition`, `contracts`) keep the table and drop no words; the image goes to a
`ContentSection arrangement="media"` only when the band has no table wider than 3 columns, else it is
unused (logged per page). CMS: Comparison. Ids (33 ids, 33 bands): `company-record` T — `/about`; `gap-map` PLUTPPPTPLLL — `/audits/prototype-readiness-review`; `client-list` T — `/clients`; `design-run` PTP — `/how-we-work/ai-native-product-design`; `autonomy` PTPP (bound image) — `/services/ai-product-ux`; `authority` PTPPPP — `/services/ai-product-ux/ai-copilots-agents`; `search-jobs` PTPPP — `/services/ai-product-ux/ai-search-recommendation`; `review-options` PPTPPP — `/services/ai-product-ux/human-in-the-loop-workflows`; `recovery` PTPPP — `/services/ai-product-ux/trust-control-recovery`; `fidelity` TP — `/services/design-engineering/coded-prototyping`; `handoff` PPT — `/services/design-engineering/design-to-code`; `which-check` T — `/services/design-engineering/design-to-code`; `component-contract` PPPTP — `/services/design-engineering/frontend-design-systems`; `which-do-you-need` T — `/services/design-engineering/frontend-design-systems`; `finding` PTPPPT — `/services/design-engineering/implementation-qa`; `status-example` PT — `/services/design-systems`; `one-component` PPPPPT — `/services/design-systems/design-system-implementation`; `which-service` T — `/services/design-systems/design-system-implementation`; `which-first` T — `/services/design-systems/design-system-strategy`; `mapping` PLLLPPPPT — `/services/design-systems/figma-storybook-alignment`; `which-job` T — `/services/design-systems/figma-storybook-alignment`; `change-path` PTPPPPTP — `/services/design-systems/governance-adoption`; `models` TP — `/services/design-systems/governance-adoption`; `options` PT — `/services/new-product-design-first-release`; `hand-offs` PTPP — `/services/product-design/information-architecture-workflow-design`; `cross-check` PTPPP — `/services/product-design/ux-research`; `strategies` PTP — `/services/product-modernisation/legacy-software-modernisation`; `continuity` PTPPP — `/services/product-modernisation/product-redesign`; `transition` PTPPT (bound image) — `/services/product-modernisation/replatforming-product-design`; `contracts` PTPPP (bound image) — `/services/software-development/backend-api-development`; `states` PTP — `/services/software-development/frontend-development`; `platforms` TP — `/services/software-development/mobile-app-development`; `alternatives` PTP — `/why-tcules`

**G12 · Router tables and link rows** — a table whose key cells are all internal links, or a link row
of services. A hub's job: pick the page that fits. Component: kind `router` (table adapter, as
`services-on-their-own`). A 2-column table → `Bento tracks={3}` with scenes, else `BlockCardSet
across={3} cue="title" scroll="never"` with `glyphForRoute` icons (no `frame`). A 3+-column table (`choose`,
`service-guide`) stays `CorpusTable` with linked key cells (§ C6): its third column is information a
tile has no place for (Q6). A link row (`services` on /expertise) → the same icon BlockCardSet,
title-only, `across={4}`. CMS: Routes. Ids (3 ids, 4 bands): `choose` PT — `/audits`; `services` K/U — `/expertise`, `/matter-design-system`; `service-guide` PTPPP — `/services`

**G13 · Labelled claim sets** — `L` runs of 3+ (or bold-led bullets), with an optional lead and close.
Named points that are peers. Component: kind `outcomes`: `OfferSheet {...head} lead items note
across` (3 across for 3/6, else 2); a leading or closing paragraph → `lead` / `note`; a closing link row
→ `note` `CtaRow`. `what-we-look-for` (plain bullets) → titles only. CMS: What you get (outcomes).
Ids (7 ids, 7 bands): `how-we-work` UK (bound image) — `/about`; `what-we-look-for` UP — `/careers`; `people-decide` LLLL — `/how-we-work/ai-native-product-design`; `contents` LLL — `/matter-design-system`; `hard-cases` PLLLLLP — `/services/design-engineering/coded-prototyping`; `format` PLLLLLP — `/services/software-development/mobile-app-development`; `change-types` PLULLL — `/services/software-development/product-maintenance`

**G14 · Steps and stages** — an ordered list (or numbered labels) describing a sequence. Component:
kind `method`: `Steps` under the head; `trace` keeps its approved `TracePlates orientation="down"`
(design-to-code audit, kind `thread`); `next-steps` (/contact, `**1. …**` labels) → `Steps`, and its
final record line → hero stats (Q10). CMS: Rich section (the band id picks the kind).
Ids (7 ids, 8 bands): `trace` PUPP — `/audits/design-to-code-audit`; `brief` UP — `/contact`; `next-steps` LLLL — `/contact`; `how-it-runs` U (bound image) — `/services/design-systems`, `/services/product-modernisation`; `decisions` PUPPPP — `/services/new-product-design-first-release`; `every-number` PUPP — `/services/product-design/data-visualisation`; `discovery` PUPPPU — `/services/product-modernisation/legacy-software-modernisation`

**G15 · Argued item sets** — `###` items with a body, not each a link to a page. Peers that each
make a point. Component: `OfferSheet {...head} lead items across` (`###` heading = title, paragraphs =
bodyHtml; 5 → `across={3}`, ruling for principles). Exceptions: `engagement-shapes` (/how-we-work, the
three engagements) → `Reasons` with the engagement figures (the job and figures of
`how-we-work-together`); `principles` (/why-tcules, 3 claims) → `Reasons open` once figures exist;
`essentials` (/how-we-work, 4 practical details with anchors `#first-steps`…) → `OfferSheet across={2}`
keeping each item's id; `who-uses-tcules` (/about) → see § E. CMS: Rich section (the band id picks the
kind). Ids (10 ids, 10 bands): `difference` PIIIII — `/about`; `who-uses-tcules` PUPI — `/about`; `product-responsibility` IIIIII — `/clients`; `why-join` PIIIII — `/future-interfaces-lab/join`; `who-we-are-looking-for` III — `/future-interfaces-lab/join`; `what-youll-gain` II — `/future-interfaces-lab/join`; `what-youll-do` PIIIII — `/future-interfaces-lab/join`; `engagement-shapes` PIII — `/how-we-work`; `essentials` IIII — `/how-we-work`; `principles` PIII (bound image) — `/why-tcules`

**G16 · Destinations** — `###` items each ending in a link to a page. A router told in sentences.
Component: `BlockCardSet lead="none" cue="cta" scroll="never"` with `icon =
glyphForRoute(href)` and `ctaLabel` = the authored link text; `across={4}` for 8, `{3}` for 3 or 6 (no
`frame`: 2026-10-19-no-hover-only-grounds). Exceptions: `what-we-do` (/about, 8 services) → home's approved
What-we-do `Bento tracks={4}` (2026-10-19-what-we-do-is-a-bento), two rows of four equal tiles, `scene =
sketchForRoute(href)`; Audits has no service scene yet, so until one is drawn the band falls back to the icon
set above; `product-situations` (home, 2 paths) → § E; `product-types` (/expertise, two `###` groups
each a 3-column table of 6) → per group an h3 + `BlockCardSet across={3}` with the page's hero art as
16:9 media (product types illustrations, industries photographs), body = "Best for" + "How we design
for it" as two paragraphs (mock: § C2). CMS: Routes (`product-types`); Rich section for `what-we-do`, `design-work`, `ai-interfaces` and
`product-situations` (cms-templates § 4). Ids (5 ids, 5 bands): `product-situations` II — `/`; `what-we-do` IIIIIIII (bound image) — `/about`; `product-types` PII — `/expertise`; `design-work` PIIII — `/future-interfaces-lab`; `ai-interfaces` PIII — `/future-interfaces-lab`

**G17 · People** — `leadership` (/about). Component: `ProfileCard` per `###` that names a person (portrait, name,
position, bio, LinkedIn) under the head + lead; the two studio `###` items split to part b as a media split with `about_team` (§ E); ruling 2026-10-12-people-get-profile-cards. CMS: Person
references. Ids: `leadership` PIIII (bound image) — `/about`

**G18 · Open roles** — `open-roles` (/careers). Component: `Layout as="ul" rowGap="none"` of `ListCard
titleAs="h3" title body` (the "Design · Full-time · In-office" line as body; no href until a role page
exists). CMS: Rich section (roles). Ids: `open-roles` IIII — `/careers`

**G19 · Prose bands on composed pages** — signature `P+` (or `PPPK`) with no other block. The
argument told in sentences. Component: kind `text` (**new** name for today's `generic`):
`ContentSection {...head} data-band="C-text"` › `ContentSectionText` › Prose. With a bound image
(`your-team`, `design-to-release`, `product-knowledge`, `knowledge`, `studio`) →
`ContentSection arrangement="media" media={{ image, side, weight: 'photo' }}` (sides alternate via the
plan). Two in a row: the second takes a stand-in photograph from the kit catalogue (`getKitPhoto`) as a
media split, so no two text bands touch; /how-we-work's run of four (`your-team` → `product-knowledge`)
needs Q11. CMS: Rich section. Ids (20 ids, 21 bands): `prototype` PP — `/audits`; `ahmedabad` PP — `/careers`; `product-work` PP — `/careers`; `ai-fluency` PPPK — `/careers`; `returning-clients` P — `/clients`; `direction` PPP — `/future-interfaces-lab`; `threshold` PP — `/future-interfaces-lab`; `your-team` PPP (bound image) — `/how-we-work`; `working-loop` PPPP — `/how-we-work`; `design-to-release` PPP (bound image) — `/how-we-work`; `product-knowledge` PPP (bound image) — `/how-we-work`; `what-stays` PPP — `/how-we-work/ai-native-product-design`; `whats-next` PP/PPPPP — `/how-we-work/ai-native-product-design`, `/services/ai-product-ux`; `use` PP — `/matter-design-system`; `beyond-the-file` PPP — `/matter-design-system`; `every-state` PPP — `/services/product-design/interaction-ui-design`; `testing` PPPP — `/services/product-design/prototyping-usability-testing`; `knowledge` PPPPP (bound image) — `/services/software-development/product-maintenance`; `build-loop` PPP — `/services/software-development/saas-web-app-development`; `studio` PPPP (bound image) — `/why-tcules`

**G20 · Closes and notes** — one short paragraph (or `PK`), an ask or a boundary. Component: a page's
last ask → `CtaSection arrangement="open"` (tint unless its neighbour is tint); a boundary on the band
before it (`confidentiality`) → `Callout` in a `ContentSection` with no heading change; a link to a
listing (`case-studies` on /clients) → `ContentSection` with `CtaRow`. `apply` on
/future-interfaces-lab/join (`PPIII`, three selection stages) → `Steps` + the action. CMS: Rich section (every
one, cms-templates § 4). Ids (10 ids, 11 bands): `work-with-tcules` PK — `/about`; `lab` P — `/careers`; `apply` PP/PPIII — `/careers`, `/future-interfaces-lab/join`; `case-studies` P — `/clients`; `confidentiality` P — `/contact`; `purpose` P — `/future-interfaces-lab`; `promotion` P — `/future-interfaces-lab`; `join` P — `/future-interfaces-lab`; `artefact-access` P — `/future-interfaces-lab/join`; `your-rules` PP — `/how-we-work/ai-native-product-design`

**G21 · One worked example** — `signature-work` (/why-tcules: ConnectX told as The thinking / The
craft / The code). Component: kind `record`: `CaseSpread` with the eyebrow split from the heading only
when authored "Example: X" (it is not), claim = the last labelled part, story = the others, image = the
bound capture; tint unless a neighbour is tint (ruling 2026-10-26-worked-example-is-a-strip). CMS:
Rich section (the band id picks the kind). Ids: `signature-work` PLLLP (bound image) — `/why-tcules`

**G22 · Tool page bands** — every one-off on a tool page. Component: `ToolPage` (paper; media split
where a slot is registered; a table in its own band; `next` is the close). CMS: Rich section.
Ids (13 ids, 17 bands): `how-to-use-it` PP/U — `/tools/ai-product-ux-readiness-check`, `/tools/audit-redesign-modernise-rebuild`, `/tools/design-system-drift-checker`, `/tools/figma-storybook-fidelity-checklist`; `marking` PPP — `/tools/ai-product-ux-readiness-check`; `specialists` PP — `/tools/ai-product-ux-readiness-check`; `start` PPPPU — `/tools/ai-trust-control-canvas`; `reading-your-canvas` T — `/tools/ai-trust-control-canvas`; `test` PP — `/tools/ai-trust-control-canvas`; `pick-one-part` PP — `/tools/audit-redesign-modernise-rebuild`; `cost` PPP — `/tools/audit-redesign-modernise-rebuild`; `reading-your-results` PP/PPT — `/tools/audit-redesign-modernise-rebuild`, `/tools/design-system-drift-checker`; `wider` PP — `/tools/design-system-drift-checker`; `corrections` PPP — `/tools/figma-storybook-fidelity-checklist`; `before-you-start` PP — `/tools/prototype-readiness-checklist`; `brief` PP — `/tools/prototype-readiness-checklist`

**G23 · Tool hub groups** — /tools, `L` (bold-linked tool name) followed by its description. Component:
`ContentSection {...head}` › `BlockCardSet lead="none" across={2} cue="title" scroll="never"` (title =
the tool's link, body = the paragraph after it); the table inside `ai` → `CorpusTable` under the cards.
CMS: Related reading (cms-templates § 4: `/tools` is Related reading > Comparison > Related reading ×3). Ids (4 ids, 4 bands): `ai` LPLPTPP — `/tools`; `design-systems` LPLP — `/tools`; `modernisation` LP — `/tools`; `prototypes` LPP — `/tools`

**G24 · Home bands** — composed in `HomePage` by id (its `BANDS` table). See § E. Ids: `product-design` PPK — `/`; `people` PPK (bound image) — `/`; `ai-native-practice` PP — `/`; `insights` PU — `/`; `expertise` K — `/`

**FAQ alias** — `frequently-asked-questions` IIIIIIIII/IIIIIIIIII — `/about`, `/future-interfaces-lab/join`: rendered as `faq` (A).

---

## C · Gaps

Each gap: who needs it, the smallest change, and whether a hi-fi mock comes before code (rule
"design fidelity before code": a new visual form is mocked; a prop on an approved form is not).

| # | Gap | Pages | Smallest change | Mock first? |
|---|---|---|---|---|
| C1 | **Reasons for 3 items, with a lead, on home and 54 offer pages.** Home's `WhyTcules` reads the P48 placeholder fixture (four reasons); the copy now authors three. | `/` + 54 (`why-tcules`), 55 (`how-we-work-together`), /how-we-work, /why-tcules | `Reasons` gets `lead?: ReactNode` (rendered in the head under the h2; the `beside` head track already holds a sentence). Home reads the corpus `###` items instead of the fixture; retire `fixtures/placeholder-reasons.ts` once figures exist. Three is already accepted (`open`: three across from xl). | No for the prop. **Yes for the figures**: round 6 (30 Oct) draws three of the offer reasons (known-before-drawn, proved-in-code, same-seat-years) and home's three; the other four offer reasons take the labelled illustration slot until their art lands, and `figureSize="lg"` sets the offer band at 256 tall. Hard-parts claims have their own set (`scripts/illustrations/claims.mjs`, four drawings; others the slot). Originally the 10 figures (7 offer reasons + 3 home reasons): drawn per the reasons house style (`scripts/illustrations`), seen by the owner before they ship. |
| C2 | **Industries band (S7)**, 1–12 sector links. Home's approved photo-card set only works for 4/8/12. | 53 offer pages; also `product-types` on /expertise | No new component: `Teaser arrangement="row" size="sm"` in a 1/2/3-column Layout, end thumbnail = sector photo. Needs the 4 missing sector photos (content platforms, PropTech, ClimateTech, EdTech) from Yash's picks, and a decision on product-type art. | **Yes**: S7 is a new form on tier-A pages; mock 3, 5 and 12 links. |
| C3 | **Selected work set off home**: `###` case items as one card set. | 55 | plan.ts: `ROLE_BY_ID['selected-work'] = 'cases'`; `caseGroups` reads `###` items (heading, paragraphs, trailing link) as well as labelled claims. Live-slug rewrite at the seam (`caseRefs`, `lib/case-links`). | No (BlockCardSet md + 16:9 cover is approved). |
| C4 | **OfferSheet `lead`** and **list-item parsing** for `what-you-get`, `scope`, `deliverables`. | 41 + 3 + 5 | `OfferSheet lead?: string`; plan parses the bare list (colon split). Scenes: `offer-scenes.ts` was keyed to the old outcome titles; product-design's new items need reassignment. | No. |
| C5 | **Testimonial band footer** (the Clutch line). | 61 | `QuoteGroupBand` passes `footer` to ContentSection: `RatingBadge`. Parser accepts "4.8 on Clutch". | No (Q3 on proof mixing). |
| C6 | **DataTable row header with a link.** `DataTableRow.header` is a plain string, so `CorpusTable` drops the key column's links (every "which do you need" and router table). | `compare` 11, `routes` 10, G11, G12, `comparison` 17, /clients, /case-studies | `DataTableRow` gains `headerHtml?: string` (seam-sanitised, same contract as `cellsHtml`); `CorpusTable` passes `inlineToHtml(row[0])`. | No. |
| C7 | **OfferSheetItem `href`** (a catalog item named as a link). | 13 expertise (`what-we-design`) | `OfferSheetItem.href?: string`: the title becomes the link (BlockCard's linked-title behaviour). | No. |
| C8 | **Router from a table** (rows, not A lines). | 5 + G12 | `Router` in OfferBands accepts table rows (key link → href/title, column 2 → body). | No. |
| C9 | **Engagement figure mapping** for the new option titles. | 55 + /how-we-work | `scopeOf`: `/focused/` → `feature`, `/defined project/` → `area`, `/ongoing/` → `embedded`. | No. |
| C10 | **Home's two-path chooser** (`product-situations`, 2 items, 2–3 links each). Gateway `board` was drawn for six. | `/` | Composition in HomePage: `ContentSection align="center"` › `Layout columns={{ base: 1, lg: 2 }} colGap="column"`; each path: `SituationFigure name="new-product"` / `"product-modernisation"` (both exist), h3, paragraph, links as `Layout rowGap="text"` of `Button as="a" emphasis="link" icon={<Icon name="arrow-right" />}` (links stack). | **Yes** (tier-A home, approved band changed shape). |
| C11 | **Home "One studio" band** (`product-design`, two paragraphs + a link row of 4 services). The approved Bento needs a body per tile, and the copy authors none. | `/` | `Bento` with `body` optional (title + scene only), `tracks={4}`, four equal tiles under a full-width head carrying the two paragraphs (h2, `lead` = the first, the second as `ContentSectionText`). Not a `beside` head: the tiles are clickable, and clickable cards sit under their full-width head. | **Yes**. |
| C12 | **Corpus routes for pages with no route or a legacy fixture route.** No `page.tsx`: /audits, /clients, /cookie-policy, /expertise, /glossary, /how-we-work/ai-native-product-design, /how-we-work/ai-transparency, /sitemap, /tools, /why-tcules. Legacy fixtures today: /contact, /careers, /how-we-work, /future-interfaces-lab (+ /join), /matter-design-system, /privacy-policy, /terms-of-use, /services (hub). | 18 | One composed route reader (as `_corpus/offer.tsx`) that hands any composed page to `OfferPage`'s `UnitView` loop (hero + planned units). Long-form ones (legal, policy, sitemap) to `LongformPage family="article"`. Allowlists (`PASS_1_*_ROUTES`) widen to every copy route of the family. | No. |
| C13 | **ListingIndex slots the copy needs**: FAQ and client recognition on /case-studies and /insights. | 2 (+ 4 format pages) | Render `faq` and `client-recognition` bands around `<ListingIndex>` in the route (no template change), or a `before`/`after` slot. The case-index `testimonials` band conflicts with a ruling (Q4). | No. |
| C14 | **Long-form bands with no route type**: author pages and the author index. | 9 | `LongformPage family="article"` with `articles` as Teaser rows; route under `/insights/authors/[slug]`. | No. |
| C15 | **Comparison-table shape for tools and audits.** Checked: no new shape is needed. Every tool/audit table is options × dimensions; `DataTable` (with C6) serves all of them, and a table already reads as visual in the plan. | — | none | — |
| C16 | **Text rhythm on expertise**: `hard-parts` (ReadDown) → `what-you-get` (OfferSheet without scenes) → `testimonials` (a wall of words) is three text-heavy bands in a row on all 12 pages; a photograph on `hard-parts` alone still leaves `what-you-get` → `testimonials` touching. | 12 | Put the page's photograph on `what-you-get` instead (`OfferSheet asideImage`, or `ReadDown photo` for 7 items), so the run reads text · visual · text. `hard-parts` stays text. Needs the 4 missing sector photographs and the 6 product-type crops (C2 again). | No (choice in Q12). |
| C17 | **`Bento` with `tracks={4}` and no body** (C11, and /about `what-we-do` with 8 tiles) and **one `audits` service scene** for the eighth tile. | `/`, /about | `BentoItem.body` optional; one Sketch scene drawn for Audits. | Scene: yes (owner sees it). Prop: no. |

---

## D · Cut list (usage audit)

"Imported" = imported by a file outside `src/app/design/**` (import statements parsed, barrels and the
unit's own folder excluded). "Copy use" = what § A/§ B assigns.

### Templates

| Unit | Imported | Copy use | Verdict |
|---|---|---|---|
| `CorpusPage` (HomePage, OfferPage, LongformPage, ToolPage, AboutPage, PlainPage) | 8 routes | every page | **extend** (plan kinds, home bands, about bands, composed-route reader) |
| `ListingIndex` | 4 | /insights, /case-studies, format pages | **keep** (pending `design/insights-filters`) |
| `CaseStory` | `case-studies/[slug]` | the 20 live cases | **keep** |
| `ServicePage` (+ Bands, Blocks, Diagrams, SetHeading, standIns) | 0 (the route's own function is named ServicePage; it does not import the template) | none | **cut** (OfferPage replaced it) |
| `StudioPage` | 0 | none | **cut** |

### Patterns

| Unit | Imported by | Copy use | Verdict |
|---|---|---|---|
| Accordion | 10 | FAQ (121) | keep |
| Banner | Home, About, (ServicePage, StudioPage) | home `people`, `ai-native-practice` | keep |
| Bento | Home, OfferBands | router bands with scenes | keep |
| BlockCard / BlockCardSet | 23 | selected work, destinations, routers, tool hub | keep |
| Breadcrumbs | 21 | every hero | keep |
| Callout | 12 | notes, `confidentiality` | keep |
| CaseCard | Home, case index | `featured` (/case-studies); home Q2 | keep |
| CaseSpread | OfferBands | `signature-work` | keep |
| ContentSection | 16 | everywhere | keep |
| **Contrast** | ServicePage only (dead) | none | **cut** |
| CtaRow | 7 | actions, closing links | keep |
| CtaSection | 17 | closes (G20) | keep |
| DataTable | 15 | tables (G3, G11, A) | **extend** (C6) |
| **EngagementModel** | 0 | none | **cut** |
| EngagementOptions | About, OfferBands, StudioPage | fallback for `tiles`; Q1 may make it `how-we-work-together` | keep until Q1, then cut if unused |
| EnquiryForm | 4 | every enquiry | keep |
| Figure | 11 (legacy routes) | long-form images | keep |
| FilterPanel | ListingIndex insights | the insights finder | keep (pending insights-filters) |
| **Gateway** | Home, StudioPage | none (the copy has 2 situations; C10) | **cut** after home is rebuilt |
| IndexRail | ListingIndex | listing rail | keep (pending insights-filters, which retires BY TOPIC) |
| ListCard / Steps / ReadDown | 15 | related, method, hard-parts, roles | keep |
| LogoGrid | Home, (ServicePage) | client recognition | keep |
| OfferSheet | About, OfferBands | what you get, catalog, claims | **extend** (C4, C7) |
| PageHero | 23 | every page | keep |
| **ProcessFlow** | ServicePage only (dead) | none (method → Steps) | **cut** |
| ProfileCard | About | `leadership` | keep |
| Proof | 10 | the `voice` unit; no new-copy band needs it (quotes are walls now) | keep (blocks.tsx `QuoteCompact` and the legacy routes import it; re-audit after C12) |
| Reasons | Home, OfferBands | why-tcules, how-we-work-together, engagement-shapes | **extend** (C1) |
| SiteFooter / SiteNav | layout | chrome | keep |
| Slider | OfferBands, (ServicePage) | none in the copy (selected work is always 3) | keep dormant (Q2) |
| Statement | CaseStory, LongformPage | long-form statement | keep |
| TableOfContents | 7 | long-form | keep |
| Teaser | ListingIndex | listings, related, industries (S7) | keep |
| Testimonial (`TestimonialWall`, `TestimonialCard`) | blocks, case index | every testimonials band | keep |
| Testimonial (`TestimonialBeside`) | OfferBands `caseStories` | none (no case item carries a quote now) | **cut** the export once `caseStories` goes |
| Thread | OfferBands, (ServicePage) | `thread` fallback | keep |
| TracePlates | OfferBands | `trace` (design-to-code audit) | keep |
| **VideoTestimonial** | 0 | none | **cut** |
| ~~VoiceLedger~~ | — | `hard-parts` persona tables now render as `ListTiles` | retired 17 Nov 2026 (O.5a) |
| Retired voice testimonial variant | already gone (no `voice` prop left in Proof or Testimonial) | — | done |
| Old CaseCard quote props | already gone (22 Oct) | — | done |

### Components (tier 1)

All are imported outside `/design`. BrandMark, Button, Chip, ClientMark, Cluster, Icon, Input, Island,
Layout, Logo, Media, Prose, RatingBadge, Section, Sketch, Stat, Tag, Texture: **keep**.
**StarRating** (imported only by Proof and Testimonial): **keep** (every testimonial shows stars).
**SituationFigure** (imported only by HomePage for Gateway): **keep**, reused by C10.

---

## E · Representative pages for tomorrow's review

Band by band, in rendered order (the form already moved above the FAQ).

### `/` — HomePage (tier A)
1. hero — `CorpusHero arrangement="beside"`, placeholder illustration, `stats` from the record line. The copy now reads "Studio in Ahmedabad, India": `RECORD_FORMS` needs that key set to `null` (else it renders as a fourth figure).
2. `client-recognition` — LogoGrid, centred, closed edges, no badge (the copy moved the Clutch line into the enquiry band).
3. `product-situations` — two-path chooser (C10, mock).
4. `product-design` — "One studio" (C11, mock).
5. `selected-work` — 3 cases (Doodle, Auxentios, Benchmark Gensuite), none quoted: `BlockCardSet lead="none" across={3} size="md" cue="cta" scroll="never"` (the approved home form for unquoted cases, the md card at 16:9, one track wider than the approved pair; `scroll="never"` because a covered set of three otherwise scrolls on a phone, and home never hides a card) + the closing "See all case studies" `CtaRow` at `actionsAt="end"` (existing `SelectedWork` closing logic). Q2.
6. `why-tcules` — `Reasons open` (approved) + lead + `[Why teams choose Tcules]` action; 3 home figures (C1).
7. `testimonials` — 6 quotes, `TestimonialWall` three columns on tint.
8. `how-we-work-together` — `EngagementOptions` with the flat scope drawings (focused → feature, defined → area, ongoing relationship → embedded), the lead stacked, one link (decisions/2026-10-29-how-we-work-together-band).
9. `people` — `Banner form="below"` with `home_team`, the two paragraphs as lead, `CtaRow` (Meet the studio · Careers). `home_studio_review` is unused (one image per Banner). It sits directly above the approved `ai-native-practice` Banner: two photograph bands in a row, legal (neither is text-heavy) and varied by form (below, then beside), but the squint reads "photo, photo". Accept for tomorrow; Q17.
10. `ai-native-practice` — `Banner form="beside" mediaSide="start"` (approved), placeholder photo.
11. `insights` — `ContentSection` head + lead › `Layout as="ul" columns={{ base: 1, md: 2 }}` of `Teaser arrangement="stack" size="md"` (no media: the four pieces are new and have no covers).
12. `expertise` — approved `BlockCardSet across={4} phone="pair"` with sector photos (8 links, 8 photos exist).
13. `enquiry` — blue island in halves. 14. `faq`.

Still lacks: C10 and C11 mocks; 3 reason figures; `BANDS` table update (`capabilities`, `client-voices` ids are gone; `product-design`, `testimonials`, `how-we-work-together`, `people`, `insights` have no renderer today and are skipped silently in production).

### `/about` — AboutPage (tier A; renders PlainPage today)
1. hero — lede + stats.
2. `what-we-do` (8 services, each `###` + paragraph + "Explore …" link; `about_work_wall` bound) → home's approved What-we-do `Bento tracks={4}` (8 equal tiles, two rows; C17 for the Audits scene). The work-wall photograph is unused unless Q13 says banner. Visual.
3. `difference` (lead + 5 comparisons naming other studios) → `OfferSheet across={3}` (3 + 2). Text.
4. `who-uses-tcules` (lead, 5 audiences, a line, `### Work you can inspect` = four case links each with its sentence, the Lab line, "Explore all case studies") → part a: `ContentSection` stacked, head + lead, `ReadDown columns={2}` of the 5 audiences, the line as `ContentSectionText`. Part b (`who-uses-tcules-2`, the authored h3 "Work you can inspect" as its head): the four cases as `BlockCardSet lead="none" across={4} size="sm" cue="title" scroll="never"` with each case's own cover (`coverFor`, ruling 2026-10-26-case-cards-use-the-case-image), body = the authored sentence; the Lab line and the "Explore all case studies" link as the `footer` `CtaRow`. The covers make this band the visual one after the text of `difference` (the earlier `beside` + `ReadDown` + `CtaRow` made two text bands in a row, and put clickable case links in a body track beside a head).
5. `leadership` (lead + 4 `###`: two people, then "The Ahmedabad studio" and "The practice keeps moving") → part a: `ProfileCard` ×2 (Jatin, Rakesh) under the head + lead; part b (`leadership-2`, no new heading): the two studio items as `ContentSection arrangement="media"` with the bound `about_team` photograph and the two `###` as h3 + Prose. Visual.
6. `how-we-work` (6 bold-led practical details + link row) → G13 `OfferSheet across={3}` (3 + 3, bold lead = title) with the link row as `note` `CtaRow`. Not `ReadDown columns={1} photo` with `about_studio_review`: that would be a second photograph-beside-copy split directly under `leadership-2`. `about_studio_review` is unused (Q13). Text, followed by the table.
7. `company-record` → DataTable (Fact / Detail) + Organization JSON-LD. Visual (table).
8. `testimonials` (3) → wall, tint.
9. `frequently-asked-questions` → FAQ.
10. `work-with-tcules` → `CtaSection arrangement="open"` (tint; the FAQ above is paper).

Squint: bento · tiles · rows + covers · portraits · photo split · tiles · table · quotes on tint · questions · close. OfferSheet appears twice (3 and 6), three bands apart.

Still lacks: `ABOUT_BANDS` rewritten for the new ids (the template falls back today); a mock for 2 and 4; the Audits scene (C17); portraits for whoever lacks one (ProfileCard needs a square portrait); case covers for Omny AI and GT Tools from Strapi.

### `/contact` (tier A; legacy route today)
1. hero. 2. `enquiry` (`PFP`) → blue island in halves; "Or email hello@tcules.com" in the copy half. 3. `brief` (4 labelled + a line) → `OfferSheet across={2}` + `note`. 4. `next-steps` (3 numbered + the record line) → `Steps`; the record line → hero `stats` (Q10). 5. `testimonials` (3 + Clutch) → one-up quote slider on tint + RatingBadge footer (29 Oct). 6. `confidentiality` → `Callout` band. 7. `faq`.
Still lacks: a corpus route (C12). **Rhythm**: after the island, every band is text (`brief`, `next-steps`, the wall, `confidentiality`, `faq`). Proposed for tomorrow: `brief` and `next-steps` as one band of two **peer halves** (`Section` › `Layout columns={{ base: 1, lg: 2 }} colGap="column"`, each half its own h2 + body, order kept left to right): they are the two halves of one job (what to send, what happens after) and read as one object instead of two stacked text bands. `confidentiality` keeps its own heading, so it stays a short paper band with a `Callout` (G20). Q18.

### `/services/product-design` — OfferPage (tier A; the band set changed since PR #161)
1. hero — service illustration, proof line hidden (a case band follows). 2. `selected-work` → BlockCardSet ×3 (Dealpath, Auxentios, Eden AI; Auxentios cover is `IMAGE_ASSET_REQUIRED`). 3. `what-you-get` → OfferSheet (5 deliverables, scenes to reassign) + lead + terms tiles. 4. `hard-parts` (4 labelled problems, each with an "Example:" line; `product_design_doodle` bound) → `ReadDown columns={1} photo`. 5. `services-on-their-own` (7 rows) → Q7. 6. `testimonials` (4 + Clutch) → 2×2 wall on tint. 7. `how-we-work-together` → `Reasons` `open`, as approved. 8. `why-tcules` → `Reasons` (head above; figures C1; until then `OfferSheet across={3}`). 9. `industries` (12) → home's approved sector card set, `BlockCardSet across={4} phone="pair"`, three rows of four (needs the 4 missing sector photographs; S7 rows only if they do not arrive). 10. `enquiry`. 11. `faq`.
Squint: covers · drawn promises · rows + photo · drawn bento · quotes on tint · drawn engagements (open) · drawn reasons (beside) · photo cards · island · questions. Three drawn bands (3, 5, 7–8) is the page's weight; 7 and 8 still sit together, which is why Q1 stays BLOCKING.
Still lacks: C1 figures, C3, C4 (scene reassignment; "What you receive" is 5 items, so `across={3}`), Q1, Q7, 4 sector photos. The approved per-quote `voice` bands no longer arise: the copy groups the quotes in one band.

### Listing pages
- **`/insights`** — `ListingIndex` hub: hero; the five reading groups (G8) as views/sections of Teasers; `formats` (G9) as the format menu; `faq` after the list (C13); `talk` as `closing`. ~70 live Strapi pieces join the listing as-is. Lacks: the `design/insights-filters` decision (Q5); covers for the ~28 new pieces (Teasers fall back to date/meta heads); FAQ slot.
- **`/case-studies`** — `ListingIndex` from the Strapi list: hero; `client-recognition` LogoGrid before the list (C13); `featured` → CaseCard ×3; stage groups from the 4 tables; `testimonials` → omitted per ruling 2026-10-22 (Q4); `enquiry`; `faq`. Lacks: Q4, Q9, C13; `designed-and-built` names CuramCare with no case ("coming soon"): a row with no link.

### Hubs
- **`/services`** (legacy route) — hero; `client-recognition`; `service-guide` (3-column router table, 8 rows) → DataTable with linked keys (C6) or Bento (Q6); then the shared offer bands (selected-work, testimonials, how-we-work-together, why-tcules, industries, enquiry, faq). Lacks: C12, Q6.
- **`/expertise`** (no route) — hero; `client-recognition`; `product-types` → two titled card sets with art (G16, mock with C2); shared offer bands; `services` link row → icon BlockCardSet. Lacks: C12, 4 sector photos, product-type card art.
- **`/audits`** (no route) — hero; `choose` → DataTable with linked keys (5 audits × Best for × You get); `prototype` → G19 (the sixth audit named in a link-led paragraph; a single horizontal `BlockCard` would carry it better: Q6); shared offer bands. Lacks: C12.
- **`/tools`** (no route) — hero; `ai`, `design-systems`, `modernisation`, `prototypes` → G23 card sets; `compare` → DataTable; `faq`. Lacks: C12; two G23 bands in a row are both card sets (`design-systems` → `modernisation` → `prototypes`): acceptable for tier B, flagged.
- **`/glossary`** (no route) — hero; `how-to-use` Prose; five term groups (G6) as ListCard rows in 2 columns; `faq`. Lacks: C12.

---

## F · Open questions for the owner

**Answered 29 Oct 2026 (owner).** Q1: both stay drawn Reasons bands. The open-then-beside answer was
superseded the same day after the home review: `beside` is retired, every Reasons band puts its head above
and its items below, each drawing above its title and body, no hairlines
(decisions/2026-10-29-set-reasons-head-above-drawing-above). **Answered (owner, second review 29 Oct):** How
we work together and Why Tcules are told apart by their drawings: How we work together is `EngagementOptions`,
its options drawn flat (Sketch `scope-*`), its closing paragraphs equal terms, its links one pair at the end;
Why Tcules keeps the isometric reasons (decisions/2026-10-29-how-we-work-together-band). Q2: home's
selected work is every case as a horizontal `CaseCard`, alternating sides; every other page keeps the
three-across card grid (decisions/2026-10-29-home-selected-work-is-case-cards). Q4: the /case-studies listing renders its testimonials band (decisions/2026-10-29-case-index-carries-testimonials,
supersedes 2026-10-22-no-testimonial-on-listing-index). Q5: PR #165 is merged; /insights is the finder. Q7:
`Bento tracks={4}`, 4 + 3, the closing paragraph in the eighth cell, two new specialist scenes
(decisions/2026-10-29-seven-services-bento-four-plus-three, proposed). Every other question takes the default stated
after the critic pass. The cut list (§ D) is not approved yet: nothing is deleted.

1. **BLOCKING · How we work together sits directly above Why Tcules on all 54 offer pages.** The 26 Oct ruling draws engagements as the Reasons band with isometric figures, and Why Tcules is the Reasons band too: the same shape twice in a row. Options: (a) keep both as Reasons, the first band on the page `open` and the second `beside` (the builder's default after the critic pass: offer pages keep engagements `open` as approved in PR #161 and set Why Tcules `beside`; home keeps Why Tcules `open` as approved and sets engagements `beside`); (b) engagements go back to `EngagementOptions grid` (flat scope drawings), which supersedes part of the 26 Oct ruling; (c) Why Tcules becomes an OfferSheet with no drawings. (`boxed` is not offered: a ruled frame around a set is the one thing the cards rulings keep for logos and the bento.)
2. Home selected work: three unquoted cases as a 3-across card set (default), or three `CaseCard` rows (heavier, past one fold)? And the roadmap's "selected work as a slider off the home page": it is not applied, because the copy authors exactly 3 cases on every page and home never hides a card. Does the owner mean a slider of *more* cases on the offer pages (allowed by 2026-10-26-sliders-allowed-off-homepage from 4 cases), which would need the content team to author a fourth case per page?
3. The Clutch line inside every testimonial band mixes an aggregate rating with testimonials (ruling 2026-10-09-one-proof-type-per-section). Default: render it as the band's `RatingBadge` footer, because words are never dropped. Confirm, or ask the content team to move it.
4. **BLOCKING for /case-studies** · The copy authors a testimonials band on the case index; the 22 Oct ruling says no testimonial band on a listing index. Default: omit it. Keep the ruling or supersede it?
5. **BLOCKING for /insights** · Does `design/insights-filters` (format pages retired, BY TOPIC retired) merge before the freeze? The G8/G9 mapping depends on it.
6. Hub routers with 3-column tables (`service-guide` on /services, `choose` on /audits): DataTable with linked keys (default, every word kept), or a Bento/card router where the third column goes into the card body?
7. **BLOCKING for tomorrow's /services/product-design** · `services-on-their-own` has 7 services: three equal tracks (the approved form) leave one tile alone, and a wide tile breaks "peers at equal weight". The earlier default (linked `ListCard` rows) is withdrawn: it would sit directly under `hard-parts`' rows, the same shape twice. Options: (a) `Bento tracks={4}`, 4 + 3, the empty eighth track holding the band's closing paragraph ("Want the riskiest screens tried in code…") as a text cell, needs a mock; (b) `Bento tracks={3}`, 3 + 3 + 1, the lone tile accepted; (c) the content team moves New Product Design and the UX & Product Audit into the closing paragraph as links, leaving the five specialist services the approved 3 + 2. New Product Design and the audit also lack `specialist-*` scenes (two drawings).
8. The listing groups' reader-segment sentences ("For teams adding generated answers…") have no slot in the approved listing head. Drop them from the listing (they stay in the CMS), or give the section head a lead?
9. The case index tables carry a "Best for" column that the case card has no place for. Drop it on the card or add it as a meta line?
10. /contact `next-steps` ends with the studio record line. Move it to the hero as figures ("figures live in the hero" ruling, default) or keep it as a line under the steps?
11. /how-we-work has four prose bands in a row (`your-team`, `working-loop`, `design-to-release`, `product-knowledge`). Default: alternate photo media splits from the kit catalogue. Real studio photographs, or illustrations?
12. Expertise rhythm (C16): the page's photograph on `what-you-get` (default after the critic pass: it breaks a three-band text run, where a photograph on `hard-parts` only broke the first pair), or `what-you-get` with per-item scenes (60+ new scene assignments, the 26 Oct ruling's ideal)?
13. About: two bound photographs go unused by default (`about_work_wall` on `what-we-do`, now a Bento; `about_studio_review` on `how-we-work`, now an OfferSheet, so it does not repeat the studio photo split above it). Use either elsewhere (a full-width banner above the bento), or leave both unused?
14. Who draws the 10 reason figures (C1) before the freeze (Wed 4 Nov 18:00): Claude through the illustration scripts, reviewed by the owner, or Bhumika after the 25 hero illustrations?
15. Industries on offer pages take two forms by count (C2, § A): the approved sector photo cards where the count fills whole rows (24 pages), S7 rows elsewhere (29 pages). One band, two looks across the site. Accept, or one form everywhere (rows; the photo cards stay home's)?
16. Ten service pages author 7 or 8 "What you receive" items, which OfferSheet (2–6) cannot hold, and the 26 Oct ruling wants every promise drawn. Default: `ReadDown columns={1} photo` (rows beside a photograph, no per-item drawings). Or draw 7–8 scenes per page and extend OfferSheet to four across?
17. Home `people` (Banner below, team photograph) sits directly on the approved `ai-native-practice` Banner (beside). Accept the two photograph bands together, or set `people` as a `ContentSection arrangement="media"` split with the photograph at the other side?
18. /contact: `brief` and `next-steps` as one band of two peer halves (default proposal) or two stacked bands as authored? Either way the order and headings hold.

---

## G · Critic pass (29 Oct 2026)

Independent review of § A–F against the code on `origin/main` (prop unions grepped in `src/patterns/**`,
`src/components/**`, `src/templates/CorpusPage/**`), the decision log, the census and the CMS templates. Every
change is applied above; what → why.

### Beauty and rhythm

1. **Why Tcules / How we work together (A, E home, E product-design, Q1).** Engagements no longer take
   `Reasons arrangement="boxed"`; they keep the default `open` that OfferBands renders today and PR #161 approved.
   The second Reasons band on a page takes `beside` (offer pages: Why Tcules; home: engagements). → The cited ruling
   (2026-10-26-service-items-drawn-per-item) says "drawn like home's Why Tcules", which is `open`; `boxed` was an
   invention attributed to it. Two `open` drawn sets back to back read as one idea twice; `beside` is an existing
   arrangement (head third + set two thirds, drawing above words) that changes the silhouette without a new
   component. Q1 stays BLOCKING.
2. **Expertise rhythm (C16, A `what-you-get`, A `hard-parts`, Q12).** The photograph moves from `hard-parts` to
   `what-you-get`. → The census order is hard-parts → what-you-get → testimonials on all 12 pages: three
   text-heavy bands. A photograph on `hard-parts` fixed only the first pair; on `what-you-get` it makes the run
   text · visual · text.
3. **What-you-get counts (A).** `across` is 2 for 2/4 and 3 for 3/5/6; 7–8 items go to `ReadDown photo`. → The old
   rule set 5 items two up (2 + 2 + 1, the hole OfferSheet's own comment warns about) and sent 7–8 items (17 pages)
   into a pattern built for 2–6. Product-design's "What you receive" is 5, so its approved band needs `across={3}`.
4. **Industries (A, E product-design, Q15).** Counts that fill whole rows reuse home's approved sector photo cards;
   only the rest take the new S7 rows. → "Previously approved compositions win": 24 of 53 pages, product-design
   included (12 links), fit the approved set exactly; the census of link counts is now in the row.
5. **/about (E).** `what-we-do` → the approved What-we-do Bento; `who-uses-tcules` → stacked head, audiences as
   two-column rows, then its "Work you can inspect" cases as covered cards under their own h3; `how-we-work` →
   OfferSheet (matching G13, which § E contradicted). → The old sequence put two text bands together
   (`difference` → `who-uses-tcules`) and two photograph splits together (`leadership-2` → `how-we-work`), and
   placed clickable case links in a body track beside a head. Four case links are case evidence: they get the
   cases' own covers.
6. **/contact (E, Q18).** Proposed `brief` + `next-steps` as two peer halves in one band. → Every band after the
   island was text; the two are halves of one job.
7. **Home `product-design` (C11, C17).** The `beside` option is removed; the Bento sits under a full-width head.
   → The four tiles are links, and clickable cards sit under their full-width head (2026-10-09).
8. **Home `selected-work` (E).** States `lead="none"` and `scroll="never"`. → BlockCardSet's default `scroll="auto"`
   turns a covered set of three into a phone scroll row, hiding two cases on the one page that never hides a card.
9. **Home `people` + `ai-native-practice` (E, Q17).** Flagged, not changed. → Two photograph Banners in a row is
   legal but repetitive; the arrangement differs (below, beside), so it can be shown tomorrow.
10. **Product-design services (Q7).** The ListCard-rows default is withdrawn and Q7 is BLOCKING for tomorrow. →
    Rows would sit directly under `hard-parts`' rows (same shape twice), and the approved form is the Bento.
11. **Rhythm classification (header).** The new kinds are classed text or visual for `planOffer`. → `quotes`,
    `catalog`, `method`, `related` and `industries` had no class, so the "no two text bands" warning could not see
    them; `outcomes` without a scene is text (plan.ts already treats it so).

### Rule compliance

12. **`frame="box"` removed** from `services-on-their-own`, G12 and G16 (and the /about `what-we-do` row). →
    Active ruling 2026-10-19-no-hover-only-grounds names `BlockCardSet frame="box"` as the mistake it prevents
    and retires it globally; the boxed exception is the Bento only (2026-10-19-what-we-do-is-a-bento).
13. **Reasons with three items** confirmed against 2026-10-22-reasons-four-in-a-2x2 (three and six accepted); noted
    in the row.

### Names checked against code

All component, prop and value names in § A–E exist except those marked **new** or listed as gaps:
`ContentSection` (`align`, `arrangement` stacked/beside/media, `lead`, `footer`, `actions`, `actionsAt`),
`BlockCardSet` (`lead` auto/none/beside/wide, `across` 2/3/4, `size`, `cue` title/cta/download, `scroll`
auto/never, `phone` auto/pair, `frame`), `Reasons` (open/boxed/beside, `note`, `action`; no `lead`: C1),
`OfferSheet` (`across` 2/3, `asideImage`, `note`, `scene`; no `lead`: C4), `ReadDown` (`columns` 1/2, `photo`),
`Teaser` (`arrangement` stack/beside/row, `size` sm–xl), `TestimonialWall` (`columns`), `RatingBadge` (`score`,
`platform`, `href`, `icon`, `mark`), `LogoGrid` (`context`, `contextAs`, `align`, `edges`, `badge`), `Banner`
(`form` below/beside/strip, `mediaSide`), `Bento` (`tracks` 3/4; `body` required: C11/C17), `Slider` (`peek`),
`SituationFigure` (`new-product`, `product-modernisation` both exist), `Button` (`emphasis="link"`), `EnquiryBand`
(`island.surface/dress/arrangement`), `ListTiles` (`columns` 1/2/3, in `CorpusPage/blocks.tsx`), and the plan
helpers (`ROLE_BY_ID`, `kindOf`, `formBeforeFaq`, `scopeOf`, `ratingOf`, `glyphForRoute`, `coverFor`,
`getKitPhoto`, `sketchForRoute`). `DataTableRow.headerHtml` does not exist yet (it is gap C6, correctly marked).

### CMS block names (cms-templates.md and the JSONs not edited)

14. **"Rich section, presentation X" removed** (`hard-parts`, `what-we-design`, `method`, G14, G15, G21). → The CMS
    Rich section has no `presentation` field; the front end picks the kind from the band id (`ROLE_BY_ID`), so the
    map now says so.
15. Corrected in the map to the CMS's names: `routes` is **Routes** in the CMS (the map said Comparison; the front
    end still renders it as kind `table`); `talk` and every G20 close are **Rich section** (the map said Enquiry,
    link only); G6 term indexes and G23 tool groups are **Related reading** (the map said Routes); G9 format menus
    are stored as **Comparison** / Rich section (the map said none); /about `what-we-do` and the other G16 ids
    except `product-types` are **Rich section**.
16. Left for the CMS doc's owner (its "Front end" column in § 3 disagrees with this map): Testimonials → "Proof
    (featured)" (map: `TestimonialWall`); Selected work → "CaseCard set" (map: `BlockCardSet`, CaseCard only on
    /case-studies `featured`); How we work together → "EngagementOptions" (map: `Reasons`); Why Tcules → "3
    numbered reasons" (map: reasons are not numbered on the page; the number is only the Reason record's key);
    Routes → "Bento grid" (map: Bento only when every route has a scene, else icon cards or a table); home
    `expertise` is stored as **Industries** (map G24 composes it in HomePage, which is consistent). The tool
    template lists no `next` slot and says FAQ is always last, while the copy (§ A `next`) authors a `next` close
    before the FAQ on the tool pages; the CMS template needs that slot.

