# Content changes — for Devagya

Added to as the components find them (tracker 0.5): places where the copy or its structure needs
to change so a component can do its job. This covers lengths that break a layout, a field a section
needs but the copy doesn't have, and items that don't form a set.

Each entry: **page / section** · **what's needed** · **why** · **found in** (task or component).

---

## 1. Thirteen article messages are title-derived

**Page / section.** The 13 articles and guides in `docs/illustration-concepts.md` §5 marked "title".

**What's needed.** An editor confirms each message line against the article body, or replaces it. For
the listicles (*9 UX design tips*, *design thinking vs CX vs UX*), choose the one idea the hero should carry.

**Why.** An illustration carries one message, checked by read-back (ch05 §4). A list of nine tips has
no one message until someone chooses it.

**Found in.** Tracker 1.4.

## 2. Case-study cards: client out of the title, one-line description

**Page / section.** `/case-studies` (every card), and anywhere a case study appears as a card.

**What's needed.** For every case study:
- Fill the new **client** field (strapi-changes §13) with the client's name only.
- Take the client out of the **title** where it leads it ("ConnectX: Building Energy Management…" →
  "Building energy management as a 0 to 1 AI product").
- Keep the **description** to **8–15 words**, one sentence. Most are 15–17 words today, and three are
  about 40.
- Titles should aim for the Copy × UI card-title range (2–8 words). The live ones run 37–87 characters.
  The card now holds an 87-character title in three balanced lines, so this is about scanning, not a
  broken layout.

**Why.** The card shows client, title, one line and the categories. When the client sits inside the
title, half the cards name it and half don't. A description longer than one line was the largest block
on the card and repeated the title.

- **Categories** no longer show on the card once the client is filled in: one label line per card.
- **"Our role"** does not show on a featured card (owner, 16 Oct 2026). The `_pages/case-studies.md`
  line "**Our role:** … [Read the … case](…)" still supplies the card's link and cta wording; the role
  itself is stated on the case page, in its "At a glance" table. The CMS needs no role field on the card.

**Worked example.** Retired 22 Oct 2026. `/design/case-study-index` showed the old flat index with
this copy applied to every entry; the flat index went when /insights and /case-studies became one
listing template (`decisions/2026-10-22-listings-share-one-structure`), and its ideal-copy fixture with
it. The rules above still stand for the card's copy.

**Found in.** BlockCard revision, 29 Sep 2026.

## 3. Six service pages: re-cut copy and new copy to approve

**Page / section.** All six service lines. Each section's changes are listed in
`docs/service-pages-design.md` §4.

**What's needed.** Approve, rewrite or reject every item marked **NEW COPY** there. The largest are the
AI Product UX model-role rows (four of seven "what the product needs" cells, and every "introduces"
cell, are new), the Software Development router conditions, and the case titles on every page. The
re-cut copy (tightened leads, split lists) needs a lighter read. Added 30 Sep: every resources
card's one-line description, and each close's two steps (the second step's detail is new copy).

**Why.** The designed pages give each block a job, and some jobs need words the CMS never held: a
condition for each route, a title that says what a case shows *on this page*, a short line under each
stage. The pages were designed against realistic copy rather than waiting for it.

**Found in.** Service pages designed from content, 29 Sep 2026.

## 4. Six service heroes: title ≤ 48 characters, lead ≤ 26 words, no eyebrow, body to the first band

**Page / section.** The six designed service pages (`/design/service-page/<slug>`), the hero and the first band's lead. Fixtures: `src/content/sources/fixtures/ideal/services/*.ts`.

**What's needed.** Approve, rewrite or reject the edits below. The ceilings are visual-direction § 2.3 and § 1.5: a hero title of at most 48 characters is three balanced lines at 572, a lead of at most 26 words is three lines. The hero eyebrow is gone on all six (the trail's last crumb is the service's name, so it said it twice); the name moved to `story.name`. The old second hero paragraph (`hero.body`) moved into the first band's lead, merged with that band's own lead where it had one. The merged leads are over the 18-word stacked-lead ceiling; `cmp-service-pages` re-cuts them when it recomposes the bands.

**Why.** The h1 now starts at 222 instead of 296 and every service hero ends at or above 823 at 1470 × 830 (it ran 859 to 1014), so the first scroll lands on the next band.

**Found in.** Kit `fdn-top`, 5 Oct 2026.

**product-design**

- Title: "A finished interface can still contain an unresolved product." (61 chars) → "Finished screens can hide an unresolved product." (48).
- Lead: "Tcules takes responsibility for the product beneath the screens: who does what, which records and rules make it possible, how the experience behaves, and what the team must learn before it commits." (32 words) → "Tcules takes responsibility for the product beneath the screens: who does what, the records and rules behind it, how it behaves, and what to learn first." (26).
- Eyebrow "Product Design": removed from the hero; now `name`, the last crumb.
- Hero body "For new products, and for established B2B, workflow, data-rich and AI-enabled software where the interface shows only part of the problem." moved to band `signals`, merged with its lead "A visual change may reveal a workflow, data or authority problem that the same project must resolve." → "For new products and for established B2B, workflow, data-rich and AI-enabled software, where a visual change may reveal a workflow, data or authority problem.".

**design-engineering**

- Title: "Keep product intent alive when the work becomes software" (56 chars) → "Keep product intent alive as it becomes software" (48).
- Lead: unchanged.
- Eyebrow "Design Engineering": removed from the hero; now `name`, the last crumb.
- Hero body "Design Engineering keeps product thinking and frontend reasoning in one responsibility. Tcules uses it to create coded evidence before a roadmap commits, implement shared frontend systems, and check the running product still carries the intended behaviour." moved to band `pressures` (no lead before) as "Design Engineering keeps product thinking and frontend reasoning in one responsibility: coded evidence before a roadmap commits, shared frontend systems, and a running product that still behaves as intended.".

**ai-product-ux**

- Title: "Design the relationship between people, models and product state" (64 chars) → "Design how people, models and product state meet" (48).
- Lead: unchanged.
- Eyebrow "AI Product UX": removed from the hero; now `name`, the last crumb.
- Hero body "The work combines product strategy, UX, interaction, evaluation and implementation responsibility." moved to band `model-roles`, merged with its lead "AI Product UX is the wider relationship: how people understand, direct, evaluate, control and recover from model behaviour. It starts with what the model is allowed to do." → "The work combines product strategy, UX, interaction, evaluation and implementation: how people understand, direct, control and recover from model behaviour. It starts with what the model may do.".

**design-systems**

- Title: "A design system must earn its place in product work" (51 chars) → "A design system must earn its place in the work" (47).
- Lead: unchanged.
- Eyebrow "Design Systems": removed from the hero; now `name`, the last crumb.
- Hero body "Tcules helps product organisations define, build and operate design systems — across product semantics, foundations, tokens, components, Figma, code, documentation, contribution, release and adoption." moved to band `library-is-one-representation`, merged with its lead "A library can be visually consistent and still fail as shared infrastructure. A local workaround can be rational; a system earns use only when the supported route is easier to understand, extend and release than the workaround." → "Tcules helps teams define, build and operate the whole system, from product semantics and tokens to Figma, code, release and adoption. A system earns use only when its route is easier than the workaround.".

**software-development**

- Title: "Software development under product-design responsibility" (56 chars) → "Software development, led by product design" (43).
- Lead: unchanged.
- Eyebrow "Design-led Software Development": removed from the hero; now `name`, the last crumb.
- Hero body "Product Design stays the centre of gravity. Engineering carries its decisions into running software, as agreed:" moved to band `what-changes`, merged with its lead "The delivery record keeps these connected, so edge states and change can be implemented rather than guessed." → "Product Design stays the centre of gravity and engineering carries its decisions into running software. The delivery record keeps them connected, so edge states are implemented, not guessed.".

**product-modernisation**

- Title: "Change the product without losing the work it carries" (53 chars) → "Change the product, keep the work it carries" (44).
- Lead: "Tcules helps the team find the layer causing the cost, protect what still works, and carry the right intervention through product design, design systems, coded evidence or software delivery." (29 words) → "Tcules helps the team find the layer causing the cost, protect what still works, and carry the right change through design, systems, code or delivery." (25).
- Eyebrow "Product Modernisation": removed from the hero; now `name`, the last crumb.
- No hero body.

## 5. The trail names the page; the h1 argues it

**Page / section.** The trail at the top of every hero, on all 128 pages that carry one. Mechanism: `heroTrail` in `src/lib/trail.ts`; component change in `docs/specs/Breadcrumbs.md` (5 Oct amendment, item 5).

**What's needed.** Nothing blocking: the fix is in code. Three content asks follow from it.

1. **Future Interfaces Lab heading.** "Future , Interfaces Lab by Tcules" carries a stray comma from the CMS, and it is the page's name rather than a line the page argues. Fix the comma now. Better: give the page a message as its h1 (what the lab is for, 2 to 10 words). The trail will then name it "Future Interfaces Lab", as the parent crumb on `/future-interfaces-lab/join` already does.
2. **Matter Design System heading.** "Save time | Build consistency. Matter | Design System" joins a message and the name with pipes, and carries a U+200D before "Matter". Same ask: a message as the h1, the name left to the trail.
3. **A short name on every record whose h1 is a headline** (service, expertise, case study). Today these trails stop at the parent ("Home / Services", "Home / Case studies"), because the record has no name shorter than its title and the h1 already says the title. With a name, the trail can end in it ("Home / Services / Product Design"), as the six designed service pages do from `story.name`. Recorded as a model change in `docs/strapi-changes.md` § 16; the case-study `client` field (§ 2 above, strapi-changes § 13) serves the same purpose for case studies.

**Why.** The trail sits 32px above the h1 (kit `fdn-top`). On most pages its last crumb was the page's full title, so the headline read twice, and on a phone a headline-length crumb wrapped onto a second line led by a divider. The last crumb now names the page only when the h1 does not:

| Pages | Trail | Why |
|---|---|---|
| about, contact, careers, how-we-work, services, insights, case-studies | Home / *name* | the h1 is a message; the crumb is the page's nav label |
| six `/design/service-page` pages | Home / Services / *story.name* | the h1 is a headline; `story.name` is the name |
| services/* (since the second 6 Oct fix round) | Home / Services / … / *name* | the name from the slug, or the CMS eyebrow where it spells that name out |
| expertise/*, case-studies/*, audits/*, glossary/*, tools/*, insights articles, guides, podcasts and events, future-interfaces-lab/join | Home / … / *parent* (a link) | the h1 is the page's only name, so it is the current page |
| terms-of-use, privacy-policy, future-interfaces-lab, matter-design-system | none | the h1 is the name and the parent is Home; a lone "Home" is not a trail |

Eyebrows on services/* and expertise/* now stand under "Home / Services" or "Home / Expertise" and name the page ("Product Modernisation", "B2B SaaS and workflow software"). That is what an eyebrow under a trail may carry.

*Fix round, 6 Oct 2026.* An eyebrow that SAYS a crumb is a repeat, not only one that equals it (`src/lib/trail.ts`, `repeatsTrail`). Ten CMS eyebrows did, and the routes now drop them: "Product Design specialist" on the five product-design L2 pages (under "… / Product design"), "Product Design services" on /services/product-design (under "Home / Services"), "Design-System Strategy", "Design-System Implementation" and "Design-System Governance and Adoption" (under "… / Design systems"), and "Product audit" on /audits/ai-product-ux-readiness (under "Home / Audits"). Content need do nothing for the page to be right. When the records gain a short `name` (`docs/strapi-changes.md` § 16) the eyebrow field on these types can be retired; until then, an eyebrow written for them should be a category or format no crumb says.

*Second fix round, 6 Oct 2026.* That rule cost four pages their name: on /services/product-design and the three design-systems L2 pages the trail ended at the parent, so the dropped eyebrow had been the only place the page was named. The service trail now ends at the page's name (above), so every service eyebrow restates the trail and is dropped, all 27, and none is the only name on its page. Two corrections to the list above: the section crumbs ("Home", "Services", "Audits", "Case studies") are repeated only by an eyebrow that EQUALS them, so "Product audit" on /audits/ai-product-ux-readiness is shown again, and "Case study · Fintech" is a valid case-study eyebrow. **For content:** in development each dropped eyebrow logs `eyebrowBesideTrail: dropped the hero eyebrow …`, naming the crumb it says, once per distinct eyebrow and crumb. *Third fix round, 6 Oct:* an eyebrow that IS the page's name ("Trust, Control and Recovery", "How We Work") now becomes the crumb instead of being reported, so the records left to act on are the ones the trail genuinely repeats, six distinct values over 165 pages: "Product Design services" and "Design-led Software Development" on two service lines, "Product Design specialist" on the five product-design specialisms, "Audit" / "Audits" on four audits, and "Glossary" on the glossary terms. Each can be cleared in the CMS, or replaced with a category or format no crumb says.

**Found in.** Kit `fdn-top` review round, 5 Oct 2026.

## 6. Product Design recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/product-design`, every band (`src/content/sources/fixtures/ideal/services/product-design.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each one meets the § 1.5 budget of the band the template now gives that section (visual-direction § 8.2). Hero title (48 characters) and lead (26 words) were already in budget and are unchanged.

| Band | Field | Old | New |
|---|---|---|---|
| B signals | eyebrow | What the interface may be telling you | What the screen says |
| B signals | heading | The screen is often where a deeper product problem becomes visible. | Where the problem shows first |
| B signals | lead | For new products and for established B2B, workflow, data-rich and AI-enabled software, where a visual change may reveal a workflow, data or authority problem. | In B2B, workflow, data-rich and AI products, a visual complaint points at a workflow, data or authority problem. |
| B signals | tile 2 body | May be protecting a real control, or compensating for a hand-off the product never modelled. | May be protecting a real control, or covering a hand-off the product never modelled. |
| B signals | tile 4 title / body | A polished AI interaction / May be hiding what the model used, what it changed, and who is accountable when it is wrong. | A polished AI feature / May be hiding what the model used, what it changed, and who answers when it is wrong. |
| B signals | tile icons | none | question-circle, clock-circle, widget, cpu (NEW) |
| H clients | whole band | none | NEW: eyebrow "Clients", heading "Teams we have shipped with", six real marks and the Clutch rating |
| F method | eyebrow / heading | What Product Design owns / How one product decision moves through the work | What Product Design owns / From the real work to the build |
| F method | lead | One product rule, explained, challenged, implemented and tested. | One product rule, explained, challenged, implemented and tested. Each step leaves an artefact the team keeps using. |
| F method | step bodies (5 rows hold one line, ≤ 10 words) | What triggers rescheduling, who decides, who is affected, and which commitment cannot silently move. · The job, dependency, owner and committed date — and the difference between blocked, proposed and accepted. · Preview affected work before confirming, name who must respond, keep the reason after the change. · Conflicting jobs, limited permissions, partial updates and a mistaken change: consequence and recovery. · Interface states, service responses, notifications and history all use the same accepted rule. | Who decides, who is affected. It leaves a research record. · Objects, roles, states and authority, written as one model. · Every state and recovery, in an interaction specification. · The riskiest question, prototyped and tested on real cases. · An implementation trace from the rule to components and tests. |
| — | "What you receive" section | five deliverables as a ledger (Product model, Research record, Interaction specification, Prototype and evaluation, Implementation trace) with their descriptions | folded into the five steps, one artefact per step; the long descriptions move to the deep page |
| E worked example | whole band | the worked-example Callout above the steps, plus an illustration slot | NEW band: eyebrow "Worked example · fictional", heading "Moving one job moves others", lead "A job is rescheduled after a required input falls through. The product must show what moves with it.", a five-stage Thread (Input unavailable → New date proposed → Dependent work shown → Owner responds → Change accepted) with the return path "A mistaken change has a safe way back to the last accepted plan." Stage lines are NEW COPY |
| G proof | heading | A client’s view of the working relationship | In a client’s words |
| G proof | portrait | stand-in square portrait | removed (§ 5.8: no stock face beside a real name) |
| G proof | case body | Qualitative research across specialist roles, carried into a product model and component-led interface work. | Research across specialist roles, carried into a product model and component-led interface work. |
| C-pair work | lead | none | Two more products where the model was settled before the screens were drawn. (NEW) |
| C-pair work | Doodle title / body | Priority and bookability, modelled before they were drawn / Meeting type, organisational priority, tentative availability and bookability confidence, connected in one scheduling model. | Priority and bookability, modelled first / Meeting type, priority, tentative availability and bookability confidence, connected in one scheduling model. |
| C-pair work | scope note | Each case establishes the research, modelling and design responsibility it names. Implementation and outcome are bounded by its own record. | Each case proves the research, modelling and design it names; outcomes are bounded by its own record. |
| K offer | heading | A workflow that keeps raising questions about rules, roles or recovery? | A workflow that keeps raising questions? |
| K offer | body | Examine that slice before the team commits to more screens. | Examine that slice of rules, roles and recovery before the team commits to more screens. |
| K offer | points (one line beside a photo) | The workflow, walked through — With the people who run it, on real cases. · The rules it depends on — Who decides, what state things are in, and the way back. · What to design first — And what can wait until the rule is settled. | The workflow, walked through with its people · The rules, roles and way back beneath it · What to design first, and what can wait |
| C-icon router | eyebrow / lead | Go narrower when the problem is located / none | Go narrower / When the problem is located, a narrower service settles it faster. |
| C-icon router | card names (one line at h5) | Information Architecture & Workflow Design · Prototyping & Usability Testing | IA & Workflow Design · Prototyping & Testing (the routes are unchanged) |
| C-icon router | conditions (≤ 14 words) | The open question is about people, context, current behaviour, or an assumption that could change direction. · Records, roles, state, permissions, navigation and the operating work no longer agree. · The rule is understood, but its behaviour, hierarchy, states and responsive form are not. · Someone must notice, compare, interpret and act — with clear definitions, freshness, uncertainty and source. · The next commitment depends on evidence a diagram or a static screen cannot provide. · You can see the problem but not yet where it sits: research, model, behaviour or evidence. | When people, context or one risky assumption could change the direction. · When records, roles, state and navigation no longer agree with the work. · When the rule is understood, but its states and responsive form are not. · When someone must compare, interpret and act, with clear definitions and sources. · When the next commitment needs evidence a static screen cannot give. · When you can see the problem but not yet where it sits. |
| C-icon router | icons | none | users-group-rounded, layers, ruler-pen, graph-up, monitor, eye (NEW) |
| N fit | eyebrow / heading / lead | none / Who is involved / The work runs on real access and on people who can decide. | Who is involved / Real access, people who decide / none |
| N fit | items | A client-side owner who can resolve consequential choices and technical constraints · The brief allows visual styling only, and forbids discussing product behaviour · No realistic product, user, data or implementation context can be shared | An owner who can settle consequential choices and technical constraints · The brief allows visual styling only, and forbids discussing behaviour · No realistic product, user, data or build context can be shared |
| I banner | whole band | "Go deeper / Read before you brief" with two resource cards (Design thinking vs CX vs UX; How we work) | Eyebrow "Before you brief", heading "How an engagement runs", lead "How a Product Design engagement runs, from the first question to the build.", link "See how we work". The article card moves to the deep page |
| L close | body | The decision, the roles it affects and the evidence you already have. A rough brief is enough. | The decision, the roles it affects and the evidence you already have. |
| L close | points | Send the decision and what you know — A rough brief is enough. · A reply within one business day — With the questions we need answered. | Send the decision — And what you already know about it. A rough brief is enough. · A reply within a day — One business day, with the questions we need answered first. |

**Why.** The 1 Oct review found the page read as a document: one shape repeated, one image, bands over the fold. The kit sets each section in its own band shape with a photograph or diagram every second band, and every band now fits 1470 × 830. Copy over its band's line budget was cut, or moved to the deep page.

**Found in.** `kit/page-product-design`, 6 Oct 2026.

### 6.1 Fix round 1 (7 Oct 2026)

**Page / section.** `/design/service-page/product-design` (`src/content/sources/fixtures/ideal/services/product-design.ts`).

| Band | Field | Old | New |
|---|---|---|---|
| B signals | lead | A visual complaint usually points at a workflow, data or authority problem. | A visual complaint often points at a rule underneath. |
| G proof | eyebrow | none | Proof |
| G proof | rating | the Clutch pill under the attribution | removed: the H band directly above already carries it beside the marks |
| C-pair work | lead | Two more products where the model was settled before the screens were drawn. | Two more products where the model was settled before the screens were drawn. Each case claims only what its own record shows. |
| C-pair work | scope note | Each case proves the research, modelling and design it names; outcomes are bounded by its own record. | removed, folded into the lead (it floated under the lead as an orphaned footnote) |
| J statement | whole band | none | NEW: eyebrow "How we work", sentence "One accountable team, from the first question to the shipped build.", link "See how we work" |
| I banner | whole band | Before you brief / How an engagement runs / How a Product Design engagement runs, from the first question to the build. / See how we work | removed: its one link moves to the J statement, and its lead restated its heading |
| K offer | actions | Start a project · Start with a UX Product Audit (the hero's pair, a second time) | Start with a UX Product Audit (one ask: the audit is the slice the offer names) |
| L close | eyebrow | none | Start a project |

**Why.** The round-1 review: no band had real scale, the banner spent 660 px on one link, the hero's two CTAs appeared three times, and the eyebrows drifted. **Found in.** `kit/page-product-design`, fix round 1.

### page-product-design fix round 2 (6 Oct 2026)

| Fixture | Field | Old | New |
|---|---|---|---|
| product-design | `photos` stand-in pool | … `workshop-brick-room`, `hands-trackpad` | … `workshop-brick-room` (`hands-trackpad` is now B's photo, § 5.6, so it leaves the stand-in pool) |
| product-design | file header, `signals` line | what the screen may be telling you — B, beside the studio board | what the screen may be telling you — B, beside a screen in use |
| stress | capped band's `more` label | Every option, on the deep page | The full list, on the deep page (it now also labels the capped bridge) |
| stress | spectrum and bridge caps | spectrum 6 of 7 options | spectrum 5 of 7, bridge 6 of 7, matching the template's structural caps |

## Product Modernisation recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/product-modernisation`, every band (`src/content/sources/fixtures/ideal/services/product-modernisation.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each meets the § 1.5 budget of the band the template now gives that section. The page went from 12 bands with two over the fold (1168 and 1275 at 1470; 2329 at 390) to 12 bands that all fit (tallest 816 at 1470, 1550 at 390). Hero title (44 characters) and lead (25 words) were already in budget and are unchanged.

| Band | Field | Old | New |
|---|---|---|---|
| A hero | second action | Request free audit | Request the free assessment (one name for the assessment across hero, K and the router) |
| B four views | eyebrow / heading | One product, four problems / Established software rarely has one modernisation problem. | Four views, one product / Established software rarely has one problem |
| B four views | tiles | four tiles: Sales — sees an ageing product. · Support — sees recurring exceptions. · Engineering — sees dependencies that make every change expensive. · Customers — know the current behaviour — including the workarounds. | two tiles, so the B band carries the counterweight (§ 6.4): Inside the company — Sales sees an ageing product, support sees recurring exceptions, engineering sees costly dependencies. · Outside it — Customers know the current behaviour, workarounds included. Their learning is what a modernisation must not break. |
| H clients | whole band | none | NEW: eyebrow "Clients", heading "Teams we have shipped with", six real marks (Knovos, Quoter, SafeXpay, GT Tools, Doodle, Omny) |
| E choose | heading / lead | Choose the least disruptive change that resolves the real constraint / Every intervention is right somewhere, and expensive when one label is applied to the whole product. A programme may use several: the point is the right change for each meaningful capability. | The least disruptive change that works / Every intervention is right somewhere, and costly when one label is applied to the whole product. |
| E choose | four-item "what goes wrong" ledger (A visual refresh / A replatform / A full redesign / A selective repair) | above the spectrum | removed; the lead carries the point |
| E choose | spectrum rows | seven: Leave unchanged, Repair, Redesign, Progressive modernisation, Replatform, Selective rebuild, Retire, each with a full-sentence condition and question | five (the template's cap): Leave unchanged — A stable capability costs little. — What evidence would reopen it? · Repair — Local friction hides useful behaviour. — Which defect can change without reopening the model? · Redesign — Roles, sequence or exceptions no longer fit. — What should stay recognisable? · Replatform — The platform is the binding constraint. — Which behaviour and data must survive? · Selective rebuild — One subsystem is beyond extension. — Can its boundary hold against hidden dependencies? Progressive modernisation and Retire move to the worksheet, linked "All seven, in the worksheet" (NEW) |
| C-text continuity | eyebrow / lead | none / Users have invested in terminology, sequence, saved records, shortcuts, integrations and recovery paths. Some of that learning reflects a sound model; some is effort spent compensating for weak design. Modernisation has to tell the two apart. | What must survive / Some familiarity reflects a sound model; some is effort spent on weak design. The plan tells them apart. |
| C-text continuity | card bodies | Essential work still completes. · Familiar objects and rules change only with reason. · Records, history and meaning survive the transition. · … · Each release generates evidence for the next decision. | Essential work still completes, during the move and after it. · Familiar objects and rules change only with a stated reason. · Records, history and their meaning survive the transition. · … · Each release produces evidence for the next decision. Learning icon graph-up → refresh |
| C-text continuity | "Why record it" note | The record stops "keep it familiar" and "make it modern" being opposing opinions. … | removed (deep page) |
| E transition | eyebrow / heading / lead | none / The transition is part of the product / Live modernisation creates temporary product and technical work that a final mock-up never shows. It shapes the experience, data meaning, operating risk and scope — so it is designed, not discovered after approval. | Both products live / The transition is designed too / Live modernisation creates temporary product work a final mock-up never shows. Tcules designs it before approval. |
| E transition | bridge items | seven, including "Support for changed behaviour" | six (the template's cap); that item moves to the deep page |
| G proof | whole band | none | NEW: eyebrow "Proof", heading "In a client’s words", the Auxentios quote (Ashok Mohanty) with the Clutch rating. CONTENT ASK: a modernisation client's own quote when the testimonial register lands (tracker 0.4); this is the only real quote in the fixtures and it is not specific to modernisation |
| F method | section | "How the work comes together", a seven-row numbered ledger (Diagnosis, Intervention, Product direction, Proof, System and build, Transition, Evolution) plus an "Ownership" note | eyebrow "How the work runs", heading "From diagnosis to the next release", lead "End-to-end responsibility, or inside a team that keeps engineering, data or release. Ownership is written first.", five steps: Diagnose the running product — Its model, evidence, dependencies and change process. · Decide each intervention — Preserve, repair, redesign, replatform, rebuild or retire. · Prove it in a slice — A prototype or coded slice tests the decision. · Build and transition — Foundations, code, migration and recovery, as scoped. · Review the evidence — Then decide whether the next capability moves. |
| — | "Where AI changes modernisation" section (flow: AI accelerates / A person still decides) | its own band | removed; to the deep page |
| M work | section | "Test the decision inside a feature that matters", two cases (C-pair) with long bodies | eyebrow "Modernisation work", heading "Change at the layer causing the cost", lead "Three products where the change went as deep as the cost, and stopped there.", three cases: Benchmark Gensuite · went deeper — A visual upgrade exposed the IA — A reused scope selector showed unclear boundaries; the IA changed, continuity held. · Dealpath · stayed selective — Density kept, one path changed — Listings gained a clearer reading order; one creation path changed. · Gold Image Printing · Legacy ERP — A legacy ordering flow, rebuilt — An ordering flow rebuilt so print buyers finish what they start. (NEW, from the listing's own description) |
| K offer | whole band | none | NEW: eyebrow "Not sure where to start?", heading "Settle the boundary before delivery starts", body "The Product Modernisation Assessment decides repair, redesign, replatform or rebuild, capability by capability.", points The product, walked through · Each capability’s change, decided · What stays familiar, recorded, action "Request the free assessment" |
| C-icon router | eyebrow / lead | Assessment or delivery / none | Go narrower / When the boundary is clear, a narrower service settles it faster. |
| C-icon router | conditions | The team still disagrees about repair, redesign, progressive change, replatforming or rebuild. It settles the boundary, before delivery starts. · The problem is a contained experience problem. · Dependencies and accumulated change cost are the constraint. It settles staged continuity. · The platform move is already decided. It settles the behaviour that must survive the move. | The team still disagrees on repair, redesign, replatform or rebuild (the assessment, now `also`). · The cost sits in the experience, and the model underneath still holds. · Dependencies and accumulated change cost are the binding constraint. · The platform move is decided; the behaviour that must survive is not. Icons checklist, ruler-pen, server, layers (NEW) |
| — | FAQ "Ownership and release acceptance, before the roadmap" (three questions) | its own band | removed; ownership is in the F lead, what to send is in the close, release acceptance moves to the deep page |
| — | Resources "Run the comparison yourself" (worksheet, definition) | its own band | removed; the worksheet is the E band's link, the definition moves to the deep page |
| L close | eyebrow / heading / body | none / Start with the capability that cannot safely stay as it is / The capability, the operational dependency and the change that can no longer be deferred. A rough brief is enough. | Start a project / Start with the capability that cannot stay as it is / The capability, what depends on it, and the change that can no longer wait. |
| L close | points | Send the capability and what depends on it — One workflow is enough to start. · A reply within one business day — Incomplete evidence becomes uncertainty to test. | Send one capability — And what depends on it. A rough brief is enough. · A reply within a day — One business day. Incomplete evidence becomes uncertainty to test. |
| — | `photos` stand-in pool | studio-whiteboard-crit, studio-session-talk, workshop-brick-room, hands-trackpad | studio-whiteboard-crit, studio-session-talk, studio-desk-pairing, workshop-brick-room (hands-trackpad is product-design's B photo) |

**Why.** The 1 Oct review found the page read as a document. Two bands ran past the fold, and the page had no proof band, no offer and no logos. Now every section has its own band shape, there is an image every second band, and all twelve bands fit 1470 × 830. **Found in.** `kit/page-product-modernisation`, 6 Oct 2026.

### Product Modernisation fix round 1 (6 Oct 2026)

**What's needed.** Approve, rewrite or reject each edit. The round removes the repeated "rule, icon, serif title, two-line body" tile from three of its four bands, puts imagery into the spectrum-to-proof stretch, and drops the router's duplicate of the offer. Still 12 bands; tallest 791 at 1470, 1440 at 390.

| Band | Field | Old | New |
|---|---|---|---|
| B four views | tiles | two: Inside the company — Sales sees an ageing product, support sees recurring exceptions, engineering sees costly dependencies. · Outside it — Customers know the current behaviour, workarounds included. Their learning is what a modernisation must not break. | four, so the eyebrow's "four views" are shown: Sales — Sees an ageing product, and a roadmap slowed by what it carries. · Support — Sees recurring exceptions, handled by hand, release after release. · Engineering — Sees dependencies that make every change expensive. · Customers — Know the current behaviour, workarounds included. That learning must not break. (No counterweight: the template gives it only to two tiles.) |
| C-pair work | position / lead | band 9, after the method / Three products where the change went as deep as the cost, and stopped there. | band 5, straight after the spectrum it evidences / Two products where the change went exactly as deep as the cost, and stopped there. |
| C-pair work | cases | three, including Gold Image Printing · Legacy ERP — A legacy ordering flow, rebuilt | two (Benchmark Gensuite, Dealpath); Gold Image Printing is reachable from "All case studies" |
| C-pair work | Dealpath title | Density kept, one path changed | The density stayed; one path changed (the old title broke "one / path") |
| N continuity | block | six icon tiles: Operational · Conceptual · Data · Access · Commercial · Learning | a contrast pair, which is the lead's own distinction. Keep what still carries the work — Essential work, completing during the move and after it · Records, history and what they mean · Roles, permissions and approval authority · Contractual and service commitments. Let go of what only carries habit — Steps that exist only because the old platform required them · Workarounds built around a defect the change removes · Labels and groupings the work has outgrown (NEW). Conceptual continuity is the lead; Learning is the method's last step |
| G proof | case | none | the Auxentios CPQ case the quote came from (G-case), as on product-design. CONTENT ASK unchanged: a modernisation client's own quote |
| K offer | body / points | The Product Modernisation Assessment decides repair, redesign, replatform or rebuild, capability by capability. / The product, walked through · Each capability’s change, decided · What stays familiar, recorded | The Product Modernisation Assessment walks the product through and decides, capability by capability, what to repair, redesign, replatform or rebuild, and what stays familiar. / none (the three points are the sentence) |
| K offer | photograph | `pencil-wireframe-violet` | `office-calm-interior` (the violet cast read as a stock filter; slot table in src/lib/photos.ts) |
| Router | heading / lead | Choose where to start / When the boundary is clear, a narrower service settles it faster. | When the layer is already clear / A narrower service settles a known boundary faster. |
| Router | routes | four icon cards, the fourth "Product Modernisation Assessment" | three linked rows, no icons (the assessment is band 10's offer, one scroll earlier) |

### Product Modernisation fix round 2 (6 Oct 2026)

**What's needed.** Approve, rewrite or reject each edit. The round breaks the run of ruled bands mid-page (the spectrum, keep/let-go, the bridge, the method and the router all set small text in hairline rows, and keep/let-go sat directly on the bridge), stops the router reprising the method's shape, and replaces the empty-room K photo. Still 12 bands; tallest 789 at 1470, 1525 at 390.

| Band | Field | Old | New |
|---|---|---|---|
| N continuity → J | whole band | N contrast pair at band 6: eyebrow What must survive · heading Continuity belongs in the product plan · lead Some familiarity reflects a sound model; some is effort spent on weak design. The plan tells them apart. · Keep what still carries the work: Essential work, completing during the move and after it · Records, history and what they mean · Roles, permissions and approval authority · Contractual and service commitments · Let go of what only carries habit: Steps that exist only because the old platform required them · Workarounds built around a defect the change removes · Labels and groupings the work has outgrown | J statement at band 5, straight after the spectrum: eyebrow What must survive · "Keep what still carries the work. Let go of what only carries habit." Essential work, records and meaning, roles and permissions move into the transition's stages; contractual commitments, defect workarounds and outgrown labels go to the deep page. The J takes the § 6.4 `corner` field, the placement a four-tile B cannot carry, so the page has all three signature placements again |
| E transition | block | bridge: Before / During the move / After, Current product · Target product, "Designed in between": Old and new navigation together · Converted and unconverted records · Compatibility and translation layers · Feature flags and release groups · Fallback routes for a failed migration · Criteria for retiring the temporary state | thread (the kit's Thread unit), five stages: Current product runs — Essential work keeps completing while the move is planned. · Both products live — Old and new navigation, behind flags and release groups. · Records in both — Converted and unconverted records keep their history and meaning. · Groups move over — Translation layers keep roles and permissions intact. · The move completes — Temporary states retire on criteria agreed first. Return path: A failed migration has a designed route back to the current product. |
| E transition | slot placement | …If it says that more clearly than the before-and-after diagram above it, it replaces that diagram. | …If it says that more clearly than the stages above it, it replaces them. |
| F method | position | band 9, after the proof | band 7, after the cases and before the transition its fourth step leads into, so it sits four bands from the router instead of two |
| C-pair work | Benchmark eyebrow | Benchmark Gensuite · went deeper | Benchmark · went deeper (held one line at 1024; it left "DEEPER" alone) |
| Router | eyebrow / lead | Go narrower / A narrower service settles a known boundary faster. | Focused services / A focused service settles a known boundary faster. |
| Router | routes | three linked rows, no icons: Product Redesign · Legacy Software Modernisation · Replatforming Product Design | six icon cards (C-icon), so the router is a card grid, not the method's ruled rows, and its photograph is a 3:2, not a 381 × 160 strip: Product Redesign (ruler-pen) · Legacy Software Modernisation (refresh) · Replatforming Product Design (layers) · NEW Design Systems (widget) — Every screen rebuilds the same component a little differently. · NEW Software Development (code) — The change is decided, and it needs building and shipping. · NEW `also` The modernisation worksheet (checklist) — You can see the cost, but not yet which layer it sits in. (the same tool as the spectrum's "All seven" link) |
| K offer | photograph | `office-calm-interior` (an empty room) | `pair-at-laptop-sticky-wall`: two people working a decision through against a sticky-note wall, neutral and quiet, 3:2 (slot table in src/lib/photos.ts; § 5.6 row updated) |


## 7. Software Development recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/software-development`, every band (`src/content/sources/fixtures/ideal/services/software-development.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each meets the § 1.5 budget of the band the template now gives that section (visual-direction § 8.2). The page goes from 12 bands of four shapes (E, D, E, E, D, E, M, D-faq, M: no photograph outside a card, two bands over the fold) to 12 bands of eleven: A, B, H, F, E, G, M, J, C-icon, K, D-faq, L, every one ≤ 789 at 1470.

| Band | Field | Old | New |
|---|---|---|---|
| A hero | title | Software development, led by product design | Software built on settled product decisions (43 characters) |
| A hero | lead | Tcules builds software where product behaviour, interaction and implementation need one accountable delivery path. | Tcules designs and builds running software in one accountable path, so roles, rules and edge states reach the code decided, not guessed. (22 words) |
| A hero | second action | none | Prototype Hardening Review → `/audits/prototype-hardening-review` (NEW; the hero carries one solid action and one link, § 2.3) |
| B signals | whole band | none | NEW: eyebrow "Where builds go wrong", heading "Where builds break", lead "The trouble starts where a decision never reached the code.", two tiles: "Every layer is done — Each team finished its part, yet no path a user takes works end to end." (from the slice argument) and "Edge states are guessed — The screens showed the happy path, so the code had to invent the rest." (from the old what-changes lead). Icons layers, question-circle. Two tiles, so the band carries the `counterweight` (§ 6.4) |
| H clients | whole band | none | NEW: eyebrow "Clients", heading "Teams we have shipped with", six real marks (GT Tools, Omny, LatitudePay, SafeXpay, Quoter, Knovos) and the Clutch rating |
| — | "What design-led development changes" Thread (6 stages) | Product decision · Role, rule and state model · Interaction · Data and API contract · Implementation constraint · Acceptance and release, each with a line | folded into the F steps below: it and the delivery trace were one argument told twice |
| F delivery trace | eyebrow / heading | Software delivery trace / Every stage cites the one before it | What design-led changes / Engineering receives the decisions |
| F delivery trace | lead | Requirements cite product decisions. Acceptance covers behaviour and implementation. What production shows enters the next decision. | Every stage cites the one before it, so edge states are implemented, not guessed. |
| F delivery trace | stages | a nine-stage Thread with no bodies (Requirement · Decision owner · Design state · Technical contract · Implementation · Automated and manual acceptance · Deployment · Observation · Change) and the loop "Production observation returns to the next product decision." | five steps (NEW COPY, ≤ 9 words each): Settle the behaviour — Roles, rules and states, decided with their owner. · Write the contract — The data and API terms each part owes. · Build the slice — Interface, services and data along one path. · Accept it twice — Automated and manual tests, behaviour and code. · Ship and observe — What production shows enters the next decision. |
| E slice | eyebrow / heading | none / A release is a complete product slice | How a release is cut / A release is a complete slice |
| E slice | lead | A credible release connects a user condition to the records, rules, interfaces and operations that complete it. Organised only by layer, every team can be locally complete while the product path stays unusable. | Organised by layer, every team can finish its part while no user path works. |
| E slice | layer / release notes | Each team builds half its layer, each on different paths. No path has every piece, so nothing a user can do works yet, and nothing can ship. · The same amount of work, with every layer building the same paths. Two things a user can do work end to end, and ship. | Each team builds half its layer, each on different paths. Nothing a user can do works yet, and nothing can ship. · The same work, with every layer building the same paths. Two things a user can do work end to end, and ship. |
| E slice | acceptance levels | "A release is accepted at three levels": Product behaviour · System behaviour · Release behaviour, under the grids (the band ran 1038) | moved to the FAQ "When is a release accepted?", text unchanged |
| G proof | whole band | none | NEW: eyebrow "Proof", heading "In a client’s words", the approved Auxentios quote (Ashok Mohanty) beside the Auxentios case: "A quotation model, carried into components" (NEW title) / "Research across specialist roles, carried into a product model and component-led interface work." **Ask:** the only approved quote is Product Design's; a software-delivery quote would replace it here |
| M evidence | eyebrow / heading | none / Evidence of implemented responsibility | Evidence / Work that reached code |
| M evidence | lead (was the scope note) | note: Each case establishes only the responsibility stated in its record. ConnectX is not a production deployment claim. | lead: Each case claims only its own record. ConnectX is a coded demonstration, not a deployment. |
| M evidence | ConnectX title / body | AI architecture, scenario modelling and a hybrid workspace / A coded demonstration connecting all three, for a bounded engagement. | AI architecture in a hybrid workspace / A coded demonstration of AI architecture, scenario modelling and a hybrid workspace. |
| J statement | whole band (was the AI section, an E flow) | eyebrow AI-assisted engineering, heading "Production responsibility does not move to the model", lead "Versatility matters more as frameworks change. Accountability does not.", a two-stage flow (AI accelerates: architecture exploration, implementation, test generation, documentation · Tcules reviews it against: the product and system model, security and data requirements, coding standards, acceptance) | J: eyebrow "AI-assisted engineering", statement "Production responsibility does not move to the model.", link "AI Product Engineering". The flow and the lead move to the FAQ "How does Tcules use AI in engineering?" |
| C-icon router | eyebrow / lead | Go to the part that binds / none | Where the risk sits / When one part of the system carries the risk, a narrower service settles it faster. (NEW) |
| C-icon router | conditions | A SaaS product or web application is the binding part. · The model, its data and its interaction are the product. · The interface layer carries the risk. · Services, data and integrations carry it. · It has to run on a phone. · The product has launched and has to keep changing. | each now opens "When …" (same words) |
| C-icon router | card names (≤ 5 words, one line) | SaaS and Web Application Development · Backend and API Development · Mobile Application Development · Product Maintenance and Evolution | SaaS and Web Apps · Backend and API · Mobile App Development · Maintenance and Evolution (routes unchanged) |
| C-icon router | icons | none | widget, cpu, monitor, server, smartphone, refresh (NEW) |
| K offer (was a D ledger) | eyebrow / heading / body | none / Three ways to hand over responsibility / none | Ways to engage / Choose how much responsibility to hand over / Tcules can own a whole product, one technical surface, or a launched product’s next change. (NEW) |
| K offer | points | Build a product or major capability — Tcules owns product definition through implementation for an agreed scope, with your domain, product and technology leadership. · Deliver one technical surface — Frontend, backend, API, integration, AI or mobile responsibility, bounded inside your existing architecture. · Continue an existing product — Maintenance and product evolution after launch, under project-specific terms, priorities and support. | A product or capability — Definition through build, with your domain and technology leads. · One technical surface — Frontend, backend, API, AI or mobile, inside your architecture. · An existing product — Maintenance and evolution after launch, on project terms. |
| K offer | actions | none | Start a project · See how we work (the old resources card "How we work") |
| — | Ownership ledger (6 icon rows) | Ownership and handover are delivery decisions: Repository and environment access · Credential custody · Deployment ownership · Documentation · Third-party licences · Post-launch handover, and its lead | folded into the FAQ "Will we control the code and delivery assets?" |
| D-faq | eyebrow | none | Questions |
| D-faq | "Will we control the code…" answer | Yes, for the client-controlled repositories, credentials and deployment assets defined in the delivery scope — and continuously, not only at a final handover. The signed agreement states legal ownership, third-party licences, pre-existing materials and any managed-service dependency. If an asset cannot be transferred or independently controlled, that constraint is visible before the implementation choice is accepted. | Yes, from the start. You hold repository and environment access; credential custody and deployment ownership are named before work starts; documentation is enough to continue without us. The agreement states ownership and third-party licences, and any constraint is visible before a choice is accepted. |
| D-faq | new questions | none | "When is a release accepted?" (the three levels, plus the accessibility answer and its guide link) · "How does Tcules use AI in engineering?" (the old AI flow and lead) |
| D-faq | infrastructure answer | … not a standalone managed-cloud, enterprise-infrastructure, security-operations or penetration-testing provider … | … not a standalone managed-cloud, security-operations or penetration-testing provider … |
| D-faq | "Where does accessibility acceptance come from?" | its own question | merged into "When is a release accepted?" (four questions keep the open answer in the fold) |
| — | Go deeper resources (2 cards) | Inclusive product design guide · How we work | the guide is a link in the release-acceptance answer; How we work is K's link |
| L close | eyebrow / heading | none / Start with the product slice that needs to ship | Start a project / Start with the slice that needs to ship |

**Why.** The 1 Oct review: the page read as a document. Now every band is ≤ 789 at 1470 and ≤ 1671 at 390. No two bands without an image sit next to each other. Seven of the ten bands between hero and close carry a photograph, a diagram or covers. The § 6.4 texture signature is in place: counterweight on B, horizon above G, closing on L.

**Found in.** `kit/page-software-development`, 6 Oct 2026.

### 7.1 Fix round 1 (6 Oct 2026)

| Band | Field | Old | New |
|---|---|---|---|
| B signals | eyebrow | Where builds go wrong | Design to code (the old one restated the heading) |
| B signals | tiles | two: Every layer is done · Edge states are guessed | four, adding "Contracts are assumed — Each side guessed what the other would send, so integration found the gaps." (icon code) and "Done was never agreed — No one set what a release must prove, so acceptance became a debate." (icon checklist), both NEW COPY. Four tiles fill the copy column, so B's head is the h2 role, not display, and the texture placement moves from B's counterweight to J's corner |
| C-icon router | position | after the J statement | after the clients band, before the method: the first head-track band, so its head sits on the start side and F's photo moves to the end side (copy unchanged) |
| G proof | case beside the quote | Auxentios · Industrial CPQ / A quotation model, carried into components / Research across specialist roles, carried into a product model and component-led interface work. | removed: the quote is the band's point, so it takes the display role alone. The case stays on Product Design, which carries the same card |
| M evidence | ConnectX meta | ConnectX · Integrated product and software | ConnectX · Product and software (one line at 390) |
| M evidence | Benchmark meta | Benchmark Gensuite · Feasibility in code | Benchmark Gensuite · Feasibility (one line at 390) |
| K offer | heading | Choose how much responsibility to hand over | Choose how much of the build we own (two balanced lines) |
| L close | eyebrow | Start a project | Next step (the old one repeated the CTA label) |

**Why.** Fix round 1 review. **Found in.** `kit/page-software-development`, fix round 1.

### 7.2 Fix round 2 (6 Oct 2026)

| Band | Field | Old | New |
|---|---|---|---|
| — | band order | A B H C-icon F E G M J K D-faq L | A B H E F M C-icon G K D-faq J L: the slice and the method argue before the router offers six services; the router's photo moves to the end side; J follows the centred FAQ, so it sets left, not as a second centred serif column after G (copy unchanged) |
| E slice | layers | Interface · Services · Integrations · AI service · Data | Interface · Services · Integrations · Data (three paths, so "Path 1" sets on one line at 390 and the resolved grid is one full column) |
| E slice | lead | Organised by layer, every team can finish its part while no user path works. | Cut by release, every layer builds the same path, so each release does something a user can finish. (the old lead restated B's first tile two bands up) |
| E slice | layer note | Each team builds half its layer, each on different paths. Nothing a user can do works yet, and nothing can ship. | Each team builds a third of its layer, each on a different path. Nothing a user can do works yet, and nothing can ship. |
| E slice | release note | The same work, with every layer building the same paths. Two things a user can do work end to end, and ship. | The same work, with every layer building the same path. One thing a user can do works end to end, and ships. |
| F delivery trace | heading | Engineering receives the decisions | Decisions reach the code (two lines at 1024 and 1470, not three) |
| G proof | case beside the quote | none (removed in fix round 1) | Auxentios · Industrial CPQ / Specialist research, carried into an MVP (NEW title) / Research across specialist roles, carried into a product model and its interface components. The case card brings the quote onto the head's start edge (G-case), and gives a general quote the specifics of the work it came from. **Ask:** this is still the one approved quote, shared with Product Design; a quote about decisions reaching code would replace it |
| M evidence | GT Tools title | Web design and development, end to end | Design and build, end to end (two lines at 1024, like its neighbours) |
| L close | step 01 | Send the slice that needs to ship — Its users, constraints and release outcome. | Attach what already exists — A prototype, a spec or screens, if there are any. (the old step repeated the heading and the body above it) |
| Photos | router aside / F aside (src/lib/photos.ts, this page's row only) | studio-session-talk / team-laptops-table | whiteboard-two-hands / stylus-tablet-sketch: both dim frames replaced by bright process frames, both freed by design-engineering's fix round 1 |

**Why.** Fix round 2 review. **Found in.** `kit/page-software-development`, fix round 2.

## 8. AI Product UX recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/ai-product-ux`, every band (`src/content/sources/fixtures/ideal/services/ai-product-ux.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each one meets the § 1.5 budget of the band the template now gives that section. The page runs 12 bands (hero, B, H, E, F, J, E, K, M, D-faq, C-icon, L), every one ≤ 830 at 1470 and ≤ 1700 at 390. The hero title (48 characters) and lead (20 words) were already in budget and are unchanged.

| Band | Field | Old | New |
|---|---|---|---|
| B signals | whole band | none | NEW COPY: eyebrow "Where trust breaks", heading "Where an AI feature loses people", lead "The symptom shows in the interface. The cause is usually the role the model was given.", four tiles: Every answer re-checked (eye) — People cannot see the sources behind an output, or what is missing from them. · Edits undone by hand (undo-left) — The model changes what a person owns without showing the difference or keeping the original. · A confident guess (question-circle) — Uncertainty is hidden where it should be stated, with a way to dispute it. · An agent nobody stops (cpu) — A run of steps has no visible state, no preview and no way to halt it. Each tile restates a row of the model-role spectrum as the symptom a user sees |
| H clients | whole band | none | NEW: eyebrow "Clients", heading "Teams we have shipped with", the six real marks and the Clutch rating (as product-design) |
| E model roles | eyebrow | Before chat, copilot or agent | Before chat or agent |
| E model roles | lead | The work combines product strategy, UX, interaction, evaluation and implementation: how people understand, direct, control and recover from model behaviour. It starts with what the model may do. | Each role brings something a person must be able to inspect, direct or undo. |
| E model roles | rows | seven: … Predicts or detects (Confidence that can be wrong in both directions / Uncertainty stated, and a way to dispute it) · Orchestrates steps (A sequence nobody watched step by step / State per step, and a way to stop) … | five (the spectrum's structural cap): Generates, Transforms, Retrieves and synthesises, Recommends, Acts with delegated authority. The two cut rows live on as the B tiles "A confident guess" and "An agent nobody stops", and on the deep page |
| E model roles | deep-page link | none | Copilots and agents, in depth → /services/ai-product-ux/ai-copilots-agents (NEW) |
| F authority | eyebrow | Authority changes with consequence | Authority by consequence |
| F authority | lead | Four different product roles. For each: the consequence, whether it can be reversed, the evidence a person can inspect, the human gate and the recovery path — decided per action, not as one label for the whole feature. | Decided per action, never once per feature: the consequence, whether it reverses, the evidence and the way back. |
| J statement | whole band | none | NEW: eyebrow "What we hold to", sentence "An interface should never sound more certain than the system has earned." (re-cut from the record's old lead), link "See how we work" |
| E record | eyebrow / heading | none / The AI product responsibility record | Written down once / Eight questions per scenario |
| E record | lead | It follows the product into design and engineering, and stops an interface label carrying more certainty than the system has earned. | The responsibility record follows the product into design and engineering. (its second half is now the J statement) |
| E record | fields | seven | eight: NEW field "Accountability — Who answers for the result when it is wrong?" (flag), before Recovery; seven left a hole in the two-column sheet |
| K offer | whole band | the readiness assessment was the router's `also` row: "The scope is still uncertain, and the first evidence has to be created before the route can be chosen." | NEW band: eyebrow "Scope still unclear?", heading "Not sure what the model should do yet?", body "The readiness assessment creates the first evidence, so the route is chosen from the work rather than the technology.", points "The user work worth assisting · The product state the model touches · The authority it should receive" (from the router's old lead), action "Request the readiness assessment" |
| M evidence | heading | Evidence across different AI products | Evidence across AI products |
| M evidence | lead | none | Three of the twelve AI products we have worked on, each under a different condition. (NEW, from the stat's "twelve AI products") |
| M evidence | cases | ConnectX · BuildTwin · Eden AI (Workflow creation through search / For a developer-facing AI platform.) · Novus Insights (A survey builder that drafts, so researchers refine / Public responsibility is bounded by the available source.) | ConnectX · BuildTwin · OmnyAI (NEW: "OmnyAI · Decision support", Decision control, returned to people / The AI–human relationship reframed around the people the AI was meant to help.). Four covers stacked to 2008 at 390; OmnyAI argues the page's subject, authority. Eden AI and Novus stay on the case-study index |
| M evidence | ConnectX client / body | ConnectX · AI-native energy product / Demonstrated in code: conversational intent connected to data, dashboard modules and a digital-twin state. | ConnectX · AI-native energy / Intent connected to data, dashboards and a digital-twin state, shown in code. |
| M evidence | scope note | Tcules also uses AI in its own research synthesis, exploration, prototyping, coding and QA. That is a separate claim: … | moved to the FAQ as "Does Tcules use AI in its own work?" |
| — | "Evaluate against real decisions, not model accuracy alone" band | eyebrow, heading, lead "The acceptance set starts from representative user decisions and failure conditions.", six titles-only checks and the "Who approves" note | folded into the FAQ: "How is an AI feature evaluated before release?" (the lead and the six checks as one answer) and "Who approves the residual risk?" (the note, unchanged) |
| — | "How product responsibility combines" band | the stat 12 / AI products, its body and eight responsibilities | folded into the FAQ: "What has the work combined across twelve AI products?" (the eight responsibilities as one answer); the figure moves to the M lead |
| — | "Before the first scenario" resources band | three cards: Readiness Check, Generative AI patterns for SaaS, AI Product UX definition | folded into the FAQ: "Where should a team read first?", the three as links; the heading becomes the FAQ's |
| D-faq questions | whole band | none | eyebrow "Questions", heading "Before the first scenario", the five questions above |
| C-icon router | eyebrow / heading | Define the first AI decision / Choose the route from what the product is delegating | Go narrower / Choose by what is delegated |
| C-icon router | lead | Useful inputs are the user work, the current product state, and the authority you expect AI to receive. | Useful inputs: the user work, the current product state, and the authority you expect AI to receive. |
| C-icon router | conditions | The product is delegating a bounded task. · Review, escalation and correction are central to the work. · Failure is consequential and oversight is the question. · Retrieval and ranking decide what a person sees, and why. | When the product is delegating a bounded task to a model. · When review, escalation and correction are central to the work. · When failure is consequential and oversight is the open question. · When retrieval and ranking decide what a person sees, and why. |
| C-icon router | icons / also | none / the readiness assessment | cpu, users-group-rounded, shield-check, graph-up (NEW) / removed: it is the K offer |
| L close | eyebrow | none | Start a project |
| L close | body | The interaction, the evidence behind it and the decision rule that needs to become explicit. A rough brief is enough. | The interaction, the evidence behind it and the decision rule that needs to become explicit. |
| L close | points | Send one consequential scenario — What the model does, and what it may affect. · A reply within one business day — With what the record needs next. | Send one scenario — What the model does, and what it may affect. A rough brief is enough. · A reply within a day — One business day, with what the record needs next. |

**Not done, for content.** There is no G proof band: no attributable quote from an AI engagement exists, and the one approved quote (Auxentios) is CPQ work. A real quote from ConnectX, BuildTwin or OmnyAI, added as a `proof` section, gives the page its tint band and the `horizon` above it.

**Found in.** `kit/page-ai-product-ux`, 6 Oct 2026.

### 8.1 Fix round 1 (6 Oct 2026)

The review found three ruled text lists in a row (spectrum, steps, record), the signals and the router as one mirrored unit, a stacked double head on the record, weak SaaS-stock photographs and no texture on B. The page now runs hero, B, H, E spectrum, E thread, C-text record, K, J, M, D-faq, D router, L: every band ≤ 830 at 1470 (tallest 805) and ≤ 1700 at 390 (tallest 1628).

| Band | Field | Old | New |
|---|---|---|---|
| B signals | heading | Where an AI feature loses people | Where AI loses people (one line at the display role the counterweight gives B) |
| B signals | lead | The symptom shows in the interface. The cause is usually the role the model was given. | The symptom is in the interface. The cause is the model’s role. |
| B signals | tiles | four: Every answer re-checked · Edits undone by hand · A confident guess · An agent nobody stops | two, so the band carries the § 6.4 counterweight: Every answer re-checked (eye) — People cannot see the sources behind an output, or how sure the model is, so they redo the work. · Changes nobody can undo (undo-left) — The model edits what a person owns, or runs steps with no preview and no way to stop. The four symptoms remain, merged in pairs, and each is a row of the spectrum below |
| E model roles | meter label | Model authority | Authority (the header no longer clips at 390) |
| E model roles | rows | Output a person may not have asked for in that form. / Editing, and constraints on source. · Claims that rest on evidence the reader cannot see. / The sources, and what is missing from them. · Consequence in the product, on someone’s behalf. | Output a person did not ask for in that form. / Editing, and limits on source. · Claims on evidence the reader cannot see. / The sources, and what is missing. · Consequence on someone’s behalf. (shorter cells, shorter rows at 390) |
| E authority | block | `steps`, four numbered ruled rows beside the wireframe photo (F) | `thread`, a horizontal flow (E, centred): Inform — The model tells a person something. The person decides. · Suggest — The model proposes. A person chooses, and sees why. · Prepare — The model does the work. A person reviews it first. · Execute — The model acts. A person can watch, stop and undo it. Return path: Every level keeps a way back to a person. |
| E authority | lead | Decided per action, never once per feature: the consequence, whether it reverses, the evidence and the way back. | Set per action, never once per feature, from what the action changes and whether it reverses. |
| Record | block | `record` (E) with its own title "Responsibility record" and meta "One per consequential AI scenario" under the band head | an eight-tile icon grid (`signals`, four across): the record's name is the band's eyebrow, so there is one head |
| Record | eyebrow / lead | Written down once / The responsibility record follows the product into design and engineering. | The responsibility record / One record for every AI scenario that matters, kept through design and engineering. |
| Record | questions | Which decision or task deserves assistance? · What may the model produce or influence? · What data and sources support the output? · What can happen without human approval? · What counts as useful and safe performance here? · Who answers for the result when it is wrong? · How can a person correct or reverse the result? | Which task deserves assistance? · What may the model influence? · Which sources support the output? · What happens without human approval? · What counts as useful and safe here? · Who answers when the result is wrong? · How can a person reverse the result? (one line each at 390; Uncertainty unchanged) |
| Record | Recovery icon | undo-left | refresh (undo-left is B's "Changes nobody can undo") |
| Record | position | after the statement | after the thread, before the offer (no two bands without an image are adjacent, § 5.1 rule 1) |
| K offer | points | The user work worth assisting · The product state the model touches · The authority it should receive (titles only) | The work worth assisting — The decision or task where help changes the outcome. · The state it touches — The records and screens the model may read or change. · The authority it receives — What it may do alone, and what waits for a person. |
| Router | icons | cpu, users-group-rounded, shield-check, graph-up | none: the list router, so it no longer repeats the signals' icon tiles |
| Router | lead | Useful inputs: the user work, the current product state, and the authority you expect AI to receive. | Bring the user work, the current product state and the authority you expect the model to receive. |
| Router | position | before the FAQ | after the FAQ, the last band before the close |
| — | photos (src/lib/photos.ts § 5.6 row) | B pair-testing-overhead · K conversation-chalkboard · aside 2 pencil-wireframe-red | B workshop-brick-room · K pair-at-laptop-sticky-wall · aside 2 studio-whiteboard-crit (the router's aside) |
| — | stand-in pool | studio-session-talk, studio-whiteboard-crit, workshop-brick-room, hands-trackpad | studio-session-talk, pair-laptop-notebook (the other two are now slot photos, hands-trackpad is product-design's B) |

**Found in.** `kit/page-ai-product-ux` fix round 1, 6 Oct 2026.

### 8.2 Fix round 2 (6 Oct 2026)

The review found no proof moment at scale, the same icon-tile shape three times in four bands (B, the 4×2 record grid, K's points), B's counterweight reading as an empty placeholder, an undersized router aside, and photo swaps with effects on other pages. The page now runs 13 bands (hero, B, H, E spectrum, E thread, E record, K, J, D stat, M, D-faq, D router, L; the owner's ruling is not to cap section counts), every one ≤ 803 at 1470 and ≤ 1628 at 390. The one tile set left is B's. B carries four tiles, so the plan spends the texture placement on J's corner field rather than the counterweight.

| Band | Field | Old | New |
|---|---|---|---|
| B signals | tiles | two: Every answer re-checked · Changes nobody can undo | four: the two above, plus **NEW COPY, owner sign-off needed:** "Help nobody asked for — Output arrives in a form nobody requested, and fixing it takes longer than doing the work." (chat-round-dots; from the spectrum's first row) · "Nobody owns the error — When a result is wrong, no one can say who should have caught it, or where." (close-circle; from the record's Accountability question) |
| E record | block / eyebrow | an eight-tile icon grid (`signals`, four across) / The responsibility record | the `record` sheet: meta "One per AI scenario", title "Responsibility record", eight fields paired in two columns / Kept through delivery (the record's name is the sheet's title now) |
| E record | Accountability field | logged as NEW in § 8 | still NEW: it is the studio's eighth question, not CMS text ("Who answers when the result is wrong?"). **Owner sign-off needed.** Without it the heading goes back to seven questions and the sheet has a hole |
| K offer | body | The readiness assessment creates the first evidence, so the route is chosen from the work rather than the technology. | The readiness assessment names the work worth assisting, the state the model touches and the authority it receives, so the route is chosen from the work. |
| K offer | points | The work worth assisting — The decision or task where help changes the outcome. · The state it touches — The records and screens the model may read or change. · The authority it receives — What it may do alone, and what waits for a person. | none: folded into the body above, so K is copy beside its photograph rather than a third tile row |
| D stat | whole band | none (round 0 folded the stat into the FAQ) | eyebrow "Across AI products", heading "From framing into code", lead "Copilots, AI-native tools, AI-powered products and integrations: the same four strands of work in each.", stat 12 / "AI products we have worked on", four rows re-cut from the CMS's eight responsibilities: Framing and research · Interaction and control · Evaluation and acceptance · Prototypes into product |
| D-faq | questions | five, including "What has the work combined across twelve AI products?" | four: that answer is the stat band now |
| D router | lead | Bring the user work, the current product state and the authority you expect the model to receive. | none. The aside photograph takes the height instead (381 × 283, was 381 × 175), and the close already asks for the scenario |
| D router | route label | Human-in-the-Loop Workflows | Human‑in‑the‑Loop Workflows (U+2011 non-breaking hyphens, so it no longer wraps at a hyphen at 390) |
| Photos | B / K (src/lib/photos.ts, this page's row, and § 5.6's row) | workshop-brick-room / pair-at-laptop-sticky-wall (fix round 1) | pair-testing-overhead (back to § 5.6) / pair-laptop-notebook (3:2). Round 1's B is in five pages' stand-in pools, and its K is held for the home hero. Both swaps are reverted, and the § 5.6 note on the home hero is restored |
| Photos | stand-in pool | studio-session-talk, pair-laptop-notebook | studio-session-talk, team-laptops-table (pair-laptop-notebook is K now) |

**Template, not fixable here.** At 390 the spectrum's DataTable scrolls sideways, which hides two of its four columns. The Stat numeral is mono at ~48 px in ink, so it is not a display-scale moment. The case wells are short letterboxes. The thread is thin under a centred head. `columns` is a required content field on `signals` and `ledger`. No G band is possible until an attributable AI quote exists.

**Found in.** `kit/page-ai-product-ux`, fix round 2.

## Design Engineering recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/design-engineering`, every band (`src/content/sources/fixtures/ideal/services/design-engineering.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each meets the § 1.5 budget of the band the template now gives the section. The page runs 12 bands: A, B, E (matrix), F, E (thread), G, C-pair, C-text, K, C-icon, D-faq, L. Hero title unchanged (48 characters).

| Band | Field | Old | New |
|---|---|---|---|
| A hero | lead | A design decision can be persuasive in a prototype and still weaken on the way into software. | A design decision can be persuasive in a prototype and still weaken on the way into software. We keep it intact in code. (NEW second sentence, 23 words) |
| A hero | actions | Start a project | Start a project · Start with a Design-to-Code Audit (the audit link moves up from the router's `also`) |
| B pressures | eyebrow / heading | What pushes on a design in code / Five pressures a static screen never meets | Where intent weakens / Where screens run out (one line at the display role, so the copy column has room for the counterweight field) |
| B pressures | lead | Design Engineering keeps product thinking and frontend reasoning in one responsibility: coded evidence before a roadmap commits, shared frontend systems, and a running product that still behaves as intended. | Product and frontend reasoning, held as one responsibility. |
| B pressures | tiles (5 → 2) | Real data — expands past the layout it was drawn for. · Permissions — remove actions the design assumed. · Latency — creates states between the ones designed. · Narrow screens — change the reading order. · Component APIs — make some behaviour easier to build than the right one. | Real data, real waiting — Data runs past the layout drawn for it, and latency adds states nobody designed. · Permissions and contracts — Permissions remove actions the design assumed. APIs make the wrong behaviour easiest. (Narrow screens survives as the matrix row "Narrow widths and zoom") |
| E matrix | eyebrow / heading | none / Code is sometimes the fastest way to answer a design question | Static or coded / Code answers what a screen cannot |
| E matrix | lead | Static screens are good evidence for hierarchy, flow and visual direction. They are weak evidence when the decision depends on how the thing behaves. | Static screens are good evidence for hierarchy, flow and direction. Behaviour needs something that runs. |
| E matrix | columns / row 4 | Static screens · A coded slice / Dynamic layout | A screen · Code / Narrow widths and zoom |
| E matrix | "What a coded slice settles in practice" (6 numbered questions) | a ledger under the matrix | moved to the deep page; the band's foot links "What a coded slice settles" to Coded Prototyping |
| F outputs | heading / lead | Not every line of code is production code / Before anything is built, the output's job and its acceptance criteria are stated — so nobody mistakes a proof for a release. | Not all code is production code / Every output's job is stated before it is built, so nobody mistakes a proof for a release. |
| F outputs | step bodies 2 to 4 | A contract other product teams can build on. · Enters the client's architecture, review, testing and security path. · Accepted against the running product, ready to ship. | A contract other product teams can build on, with its states and documentation. · Enters your architecture, review, testing and security path like any other code. · Accepted against the running product, and ready to ship. |
| E thread | eyebrow / heading | none / Keep one decision alive across every representation | One thread / One decision, kept alive in every form |
| E thread | lead | The open product question stays connected from the first coded probe to the accepted decision. Prototype code may be discarded; the durable output is the clarified decision, and the evidence that the implemented behaviour meets it. | Prototype code may be discarded. What lasts is the clarified decision, and evidence the build meets it. |
| E thread | stage lines / return path | titles only, no return path | NEW COPY: What static review could not settle. · The narrowest code that answers it. · The states and API it requires. · The decision, inside the product. · Each difference, classified. · Kept, with its evidence. Return path: "A finding that contradicts the decision reopens the question, not just the code." |
| G proof | whole band | none | NEW: eyebrow "Proof", heading "In a client's words", the Auxentios quote (Ashok Mohanty) with the Clutch rating. **Owner decision:** this is the only real quote in the fixtures and Product Design also carries it; a Design Engineering quote should replace it when one is approved |
| — | "Three ways the responsibility enters a product" | a 3-item ledger (Coded product evidence, Frontend system, Implementation quality) plus the two cases | the ledger folds into the four routes of the router; the cases get their own band |
| C-pair work | eyebrow / heading / lead | none / (in "Three ways…") / none | Design Engineering work / Code that tested the decision / Two products where code tested the product decision rather than illustrating it. Neither is presented as a production release. |
| C-pair work | Benchmark title / scope note | Implementation effort, brought into the design review / Neither case is presented as a production release. Both show code used to test the product decision rather than illustrate it. | Implementation effort, brought into design review / folded into the lead |
| E flow | "Generated code enters the same path as written code" band, with the "For AI products" note | an E band (931 tall) | moved into the FAQ as two questions (below) |
| C-text leaves | eyebrow / lead | none / Depending on scope. Tcules never describes a prototype as production, or a component library as proof that an entire product conforms. | What you keep / A prototype is never passed off as production. |
| C-text leaves | items (9 → 6) | Coded demonstration · Frontend components · Design–code correspondence · Data and state fixtures · Acceptance records · Interaction specifications · Divergence ledger · Documentation and examples · Hand-off boundary | Coded demonstration — A working slice, with the limits of what it proves stated. · Frontend components — Production-ready components and patterns, matched to the design both ways. · Data and state fixtures — Realistic data and states, reusable in your own tests. · Acceptance records — Responsive, keyboard and screen-reader acceptance, recorded against the decision. · Divergence ledger — Every difference between design and build, classified and decided. · Hand-off boundary — What stays client-owned, stated, with documentation for the teams who continue. (Correspondence folds into components, documentation into hand-off; interaction specifications move to the deep page) |
| K offer | whole band | none (the audit was the router's `also`) | NEW: eyebrow "Design-to-Code Audit", heading "Not sure where intent is being lost?", body "A Design-to-Code Audit traces one surface from the accepted decision to the running product.", points "One surface, decision to build · Every divergence, classified · The first slice to fix", action "Start with a Design-to-Code Audit" |
| C-icon router | eyebrow / heading / lead | Choose the first useful slice / When static review has reached its limit / An interaction still disputed, a shared component that keeps drifting, a running surface that no longer matches the decision — any one of them defines a first scope. | Go narrower / Specialist Design Engineering services / Once you know where intent is lost, a narrower service settles it faster. |
| C-icon router | conditions | A live behaviour or a dependency must be tested. · A settled interaction needs an implementation contract. · Reusable coded foundations are the need. · The running product must be tested against its intended behaviour. | When a live behaviour, a dataset or a dependency must be tested in code. · When a settled interaction needs a contract the team can build to. · When shared coded foundations keep drifting from the design. · When the running product must be tested against its intended behaviour. |
| C-icon router | icons / `also` | none / Not sure where intent is being lost? Start with a diagnosis. — Design-to-Code Audit | monitor, code, widget, eye (NEW) / removed: the audit is the K offer and the hero's second action |
| D-faq | eyebrow | none | Questions |
| D-faq | answer 1 | … security and release path. AI-assisted code follows the same path. | … security and release path. (the AI sentence becomes its own question) |
| D-faq | new questions | none | "Does Tcules use AI to write the code?" — Inside your approved environment, for code understanding, option generation, component implementation, test preparation and documentation. A practitioner still accepts product behaviour, semantics and accessibility, security-relevant boundaries and release readiness. Generated code enters the same path as written code. · "What changes when the product itself uses AI?" — The coded slice makes model behaviour tangible. It exposes latency, streaming, tool calls, incomplete states, evidence, correction and recovery before the interface is treated as settled. (both from the removed AI band) |
| — | "Go deeper" resources (Design engineering, Design intent definitions) | an M band of two definition cards | removed; the definitions move to the deep page |
| L close | eyebrow / heading | none / Show us where product intent is getting lost in implementation | Start a project / Show us where product intent is getting lost |
| L close | body / points | The implementation point where accepted product intent is being lost. A rough brief is enough. / Send the point where intent is lost — One disputed interaction is enough. · A reply within one business day — With the first slice it points to. | The implementation point where accepted product intent is weakening. / Send the point where intent is lost — One disputed interaction is enough. A rough brief is fine. · A reply within a day — One business day, with the first slice it points to. |
| — | `photos` stand-in pool | … `workshop-brick-room`, `hands-trackpad` | … `workshop-brick-room` (`hands-trackpad` is Product Design's B photo, reserved by § 5.6) |

**Why.** The 1 Oct review: the page read as a document, with three bands over the fold (1572, 1387, 931). Each section now has its own kit shape, every band fits 1470 × 830 (tallest 788) and 390 (tallest 1499), and detail over budget moved to an accordion or the deep page. **Found in.** `kit/page-design-engineering`, 6 Oct 2026.

### Design Engineering, fix round 1 (6 Oct 2026)

**Page / section.** `/design/service-page/design-engineering` (`src/content/sources/fixtures/ideal/services/design-engineering.ts`; the page's photo row in `SERVICE_PHOTO_SLOTS`, `src/lib/photos.ts`).

**What's needed.** Approve, rewrite or reject each edit. The page still runs 12 bands, now A, B, E (record), F, E (thread), G, C-pair, D (deliverables), K, D (list router), D-faq, L. Tallest band 795 at 1470 and 1634 at 390.

| Band | Field | Old | New |
|---|---|---|---|
| B pressures | lead | Product and frontend reasoning, held as one responsibility. | Four pressures a static screen never meets. We hold product and frontend reasoning as one responsibility. |
| B pressures | tiles (2 → 4) | Real data, real waiting — Data runs past the layout drawn for it, and latency adds states nobody designed. · Permissions and contracts — Permissions remove actions the design assumed. APIs make the wrong behaviour easiest. | Real data — It runs past the layout that was drawn for it. · Real waiting — Latency adds states between the ones anybody designed. · Permissions — They remove actions the design assumed would be there. · Component APIs — They make the wrong behaviour the easiest one to build. (Four tiles fill the copy column; the counterweight field that sat in the empty space under two tiles is gone) |
| E evidence | lead | Static screens are good evidence for hierarchy, flow and direction. Behaviour needs something that runs. | A screen settles hierarchy, flow and visual direction. These six questions need something that runs. |
| E evidence | body | Matrix: To decide / A screen / Code, ten rows of ticks and crosses (Hierarchy, Flow, Visual direction both; Narrow widths and zoom, Data density, Drag and drop, Model response, Animation, Keyboard operation, Component constraints code only) | Record "Needs running code / What a screen leaves open": Narrow widths and zoom — Does the reading order survive a phone and 400% zoom? · Data density — Does the layout hold when the real dataset arrives? · Motion and drag — Does movement explain each change, and can a drag be undone? · Model response — What does the interface show while the model is still answering? · Keyboard operation — Can every action be reached and finished without a pointer? · Component constraints — Does the library make the intended behaviour easy to build? (The three rows a screen also answers move into the lead; Drag and drop and Animation merge into Motion and drag. The questions are NEW COPY) |
| E thread | stage 3 title | Implementation contract | Contract (the only stop that wrapped) |
| G proof | case | none | NEW: the quoted client's own case beside the quote: Auxentios · Industrial CPQ, "A quotation model from eight specialist interviews" (the same card Product Design's proof carries) |
| D leaves | form | six icon tiles (C-text) | icon rows beside a photograph (D, ledger) |
| D leaves | three bodies | Production-ready components and patterns, matched to the design both ways. · Responsive, keyboard and screen-reader acceptance, recorded against the decision. · What stays client-owned, stated, with documentation for the teams who continue. | Production-ready components, matched to the design both ways. · Responsive, keyboard and screen-reader checks, against the decision. · What your teams own next, stated and documented. |
| D router | icons | monitor, code, widget, eye | none: the list router, linked rows under a start head |
| L close | body | The implementation point where accepted product intent is weakening. | Name the point where accepted intent weakens. (one line at 1470) |
| — | photos (`SERVICE_PHOTO_SLOTS`) | B `stylus-tablet-sketch` · I `whiteboard-two-hands` · K `sticky-grid-minimal` | B `pair-at-laptop-sticky-wall` · I none (no banner on the page) · K `pair-laptop-notebook` (landscape 3:2) |

**Why.** The fix-round review: the same icon-title-body unit ran in three bands, two of them two bands apart; the matrix read as a spreadsheet and hid its code column at 390; the proof band set two alignment axes; B's photo was mostly out-of-focus sweater and repeated F's sketching motif; K's sticky notes carried legible scripture. **Found in.** `kit/page-design-engineering`, 6 Oct 2026.

### Design Engineering, fix round 2 (6 Oct 2026)

**Page / section.** `/design/service-page/design-engineering` (`src/content/sources/fixtures/ideal/services/design-engineering.ts`; the page's photo row in `SERVICE_PHOTO_SLOTS`, `src/lib/photos.ts`).

**What's needed.** Approve, rewrite or reject each edit. The page runs 13 bands: A, B, E (record), I, F, E (thread), G, M, K, J, C-icon, D-faq, L. One more than the brief's 12, because the review asked for both a statement band and a full-width image; the deliverables band was removed to pay for one of them (the owner's ruling is not to cap section counts). Tallest band 805 at 1470, 829 at 1024 and 1661 at 390.

| Band | Field | Old | New |
|---|---|---|---|
| E evidence | `more` (deep link) | What a coded slice settles → Coded Prototyping | moved to the new I banner's action |
| I slice | whole band | none | NEW: eyebrow "Coded prototyping", heading "A slice of the product, running", lead "The narrowest code that settles what a screen leaves open, before anyone treats the design as done.", action "What a coded slice settles" → Coded Prototyping |
| F outputs | step 2 title | Design-system implementation | Design-system code (no lone "implementation" at 390) |
| E thread | lead | Prototype code may be discarded. What lasts is the clarified decision, and evidence the build meets it. | Six forms, each one checked against the form before it. (the first sentence is now the J statement) |
| E thread | stage titles | Open question · Coded probe · Contract · Running behaviour · Review finding · Accepted decision | Question · Probe · Contract · Build · Review · Decision (one word each, so no stage wraps at 1024) |
| G proof | lead | none | From a product we carried from specialist research into component-led interface work. |
| G proof | case | Auxentios · Industrial CPQ, "A quotation model from eight specialist interviews" | removed from the proof; the case joins the work set below. The quote now takes the display role on its own |
| M work | eyebrow / heading | Design Engineering work / Code that tested the decision | unchanged |
| M work | lead | Two products where code tested the product decision rather than illustrating it. Neither is presented as a production release. | Code tested the decision, or components carried it. None is a production release. |
| M work | Benchmark eyebrow / title / body | Benchmark Gensuite · Coded prototypes / Implementation effort, brought into design review / HTML, CSS and JavaScript prototypes surfaced effort and a drag-and-drop dependency while the design could still change. | Benchmark Gensuite · Prototypes / Effort, brought into design review / Coded prototypes surfaced effort and a drag-and-drop dependency early. |
| M work | ConnectX body | A coded demonstration linked conversational intent to data, dashboard modules and a digital-twin state. | A coded demo linked conversational intent to data, modules and a digital twin. |
| M work | third case | none | NEW: Auxentios · Industrial CPQ, "Components from a specialist model", "Eight specialist interviews, carried into one product model and its components." |
| D leaves | whole band | eyebrow "What you keep", heading "What the engagement leaves behind", lead "A prototype is never passed off as production.", six icon rows (Coded demonstration · Frontend components · Data and state fixtures · Acceptance records · Divergence ledger · Hand-off boundary) | removed; the six deliverables and the lead become one FAQ answer (below) |
| J what lasts | whole band | none | NEW: eyebrow "What lasts", statement "Prototype code may be thrown away. The decision it settled never is.", action "How a build is accepted" → Implementation QA |
| C-icon routes | heading | Specialist Design Engineering services | Four specialist services ("services" sat alone on a line at 1024) |
| C-icon routes | icons | none (the list router) | code, ruler-pen, widget, checklist: icon cards beside the studio crit |
| D-faq | new question 2 | none | "What does an engagement leave behind?" — Depending on scope: a coded demonstration, with the limits of what it proves stated; production-ready frontend components, matched to the design both ways; realistic data and state fixtures your tests can reuse; acceptance records for responsive, keyboard and screen-reader checks; a divergence ledger of every difference between design and build; and a stated hand-off boundary. A prototype is never passed off as production. |
| — | `photos` stand-in pool | studio-session-talk · studio-sticky-board-ux · studio-team-holi · hand-mouse-detail · workshop-brick-room | the same without `hand-mouse-detail`, now a § 5.6 slot |
| — | photos (`SERVICE_PHOTO_SLOTS`) | B `pair-at-laptop-sticky-wall` · no I · K `pair-laptop-notebook` · aside 2 `hands-sketches-markers` | B `hands-sketches-markers` (portrait source, 4:5) · I `pair-at-laptop-sticky-wall` (3:1, the page's one large image) · K `desk-sketch-flatlay` (landscape 3:2, the page's one vivid photo) · aside 2 `hand-mouse-detail`. Aside 1 is still `studio-whiteboard-crit`, now beside the router |

**Owner decision, carried from the first pass.** The G band still quotes Ashok Mohanty (Auxentios), the quote Product Design's proof also carries. The two G bands now differ: Product Design pairs the quote with the case, and this page sets the quote alone. Replace it when a Design Engineering quote is approved.

**Why.** The fix-round-2 review: five bands put the h2 in the same 1/3 rail; there was no statement and no large image, so hero and close had no scale contrast; bands 2 and 8 were the same ruled icon list beside a photo; the proof's case card read as a third work card; band 9's photo was off-subject lifestyle stock in vivid blue; band 8's photo was a 381 × 170 strip; the router left an empty head column; at 390 two runs of three or more bands ended in ruled rows. **Found in.** `kit/page-design-engineering`, 6 Oct 2026.

## 9. Design Systems recomposed from the UI kit (6 Oct 2026)

**Page / section.** `/design/service-page/design-systems`, every band (`src/content/sources/fixtures/ideal/services/design-systems.ts`).

**What's needed.** Approve, rewrite or reject each edit below. Each one meets the § 1.5 budget of the band the template now gives that section (visual-direction § 8.2). The page runs 12 bands: A, B, H, E (parts), J, E (thread), G, C-icon, K, C-pair, D-faq, L. Hero title (47 characters) and lead (23 words) were already in budget and are unchanged.

| Band | Field | Old | New |
|---|---|---|---|
| B symptoms | eyebrow / heading | Why libraries fail as infrastructure / A component library is only one representation of the system | Symptoms / Where libraries drift |
| B symptoms | lead | Tcules helps teams define, build and operate the whole system, from product semantics and tokens to Figma, code, release and adoption. A system earns use only when its route is easier than the workaround. | Most teams have a library. The drift starts where it meets code and release. (The second sentence becomes the J statement.) |
| B symptoms | tiles (two, so the copy column has room for the `counterweight` texture, § 6.4) | One name, two behaviours — The same component describes different behaviour in Figma and in code. · A missing state — Product teams need a state the library does not cover. · Contribution is too slow — The shared route cannot keep up with release work. · A version nobody runs — A new release exists while most products stay on an older fork. | One name, two behaviours — The same component means one thing in Figma and another in code. · A version nobody runs — A new release ships while most products stay on an older fork. "A missing state" and "Contribution is too slow" move to the Governance and Adoption deep page |
| B symptoms | tile icons | none | code, refresh (NEW) |
| H clients | whole band | none | NEW: eyebrow "Clients", heading "Teams we have shipped with", six real marks and the Clutch rating |
| — | "Six questions the system has to answer" (six numbered questions, no bodies) | a ledger band | removed from this page; the questions belong to the Design System Strategy deep page, where scope and authority are settled |
| E parts | eyebrow / heading | none / Five parts must work as one system | What the system is / Five parts, one system |
| E parts | lead | Four of them are the system. The fifth decides whether the other four stay current. | Four parts are the system. The fifth, the operating model, decides whether the other four stay current. |
| E parts | part names / bodies | Components and patterns · Code and documentation; Semantic tokens, typography, layout, motion, accessibility and content conventions. · Anatomy, properties, states, content and interaction contracts, and how they compose around recurring work. · Libraries, examples and templates, so designers use shared decisions without rebuilding them. · Runtime components, APIs, stories, tests and guidance: implementable, and reviewable. | Components · Code and docs; Semantic tokens, type, layout, motion, accessibility and content conventions. · Anatomy, properties, states and interaction contracts, and how they compose. · Libraries, examples and templates, so designers reuse decisions, not rebuild them. · Runtime components, APIs, stories, tests and guidance anyone can review. |
| E parts | "Any one part alone" note (three bullets) | under the diagram | removed; the diagram's operating-model frame makes the point, and the bullets move to the Implementation deep page |
| J statement | whole band | none | NEW: eyebrow "The test", "A system earns use only when its route is easier than the workaround." (from the old B lead), link "See Matter, our open system" → /matter-design-system |
| E decision | eyebrow / heading | A representative example / One shared decision must survive every representation | Representative example / One status, six places it must hold |
| E decision | lead | A process status, Partly complete, needed by three products. A change is complete only when every representation — and every product consuming it — has a governed path. | A Partly complete status, needed by three products. It must mean the same thing everywhere it appears. |
| E decision | body | a six-row table (Representation · What must stay true · When it changes alone) and a "Scope" note | a six-stage Thread, NEW stage copy from the table's middle column: Definition — Some required work is done; some is still open. · Token — Readable without relying on colour alone. · Figma — Properties for label, detail, action and assistive text. · Code — The API exposes the same meaning and actions. · Docs and tests — Usage, keyboard and content cases written down. · Release — Every product knows the version and the change. Return path (from the table's last column): "Change one alone and products drift: designers detach, and code accepts what design forbids." The eyebrow carries the scope note's point |
| G proof | whole band | none on this page | NEW: eyebrow "Proof", heading "Built with the MVP, not after", lead "The visual system grew alongside the first release, from the same research, rather than being retrofitted.", the Auxentios quote (Ashok Mohanty) beside the Auxentios case, retitled "A visual system built with the MVP" (it was the first evidence card) |
| C-icon router | eyebrow / heading / lead | Start from the condition / Choose the responsibility from the system condition / none | Start from the condition / Choose by the system’s condition / Each service settles one kind of drift. Pick the one your teams are living with. (NEW) |
| C-icon router | conditions (≤ 14 words) | Teams disagree about what should become shared. It settles scope, authority, ownership and investment. · The shared scope is agreed and needs a maintained system. It settles foundations, components, code, documentation, release. · Figma and code describe different contracts. It settles source authority, mapping and change flow. · Teams bypass, fork, or stay on old versions. It settles contribution, exceptions, release and evidence of use. | Teams disagree on what to share, who owns it, and what it is worth. · The scope is agreed and needs foundations, components, code and a release path. · Figma and code describe different contracts, and nobody knows which governs. · Teams bypass the system, fork it, or stay on old versions. |
| C-icon router | card names (one line at h5) | Design System Implementation · Figma and Storybook Alignment | Implementation · Figma and Storybook (routes unchanged) |
| C-icon router | icons | none | flag, widget, layers, users-group-rounded (NEW) |
| C-icon router | `also` (Design System Audit) | "The cause of drift is disputed? Diagnose it before further investment." | removed from the router (a set of 4 icon cards, not 5); the audit is the K offer below and the hero's second action |
| K offer | whole band | none | NEW: eyebrow "Not sure where it drifts?", heading "Find the cause before investing more", body "A Design System Audit traces one drifting decision through Figma, code and release, and names what to fix first.", points "One decision, fully traced" · "Where design and code split" · "What to fix first, and who owns it", action "Start with a Design System Audit" |
| C-pair evidence | eyebrow / heading / lead | none / Evidence of design-system practice / none | Evidence / Design-system work in practice / Two more products where shared components and rules carried the work. Each claims only what its record shows. (NEW) |
| C-pair evidence | cases | Auxentios (A visual system built with the MVP) · Doodle (New UI inside an existing system — Bounded interface work using existing design-system components, and adding the ones it needed.) | Doodle — Bounded interface work that used the existing components, and added the ones it needed. · Benchmark Gensuite · Enterprise suite (NEW to this page) — One experience across 75+ applications — An enterprise suite modernised as one design-systems problem, not many redesigns. (from its listing copy) |
| C-pair evidence | scope note | Neither record establishes coded implementation or organisation-wide adoption. Matter, Tcules’ own open-source system, demonstrates foundations, components and design-to-development intent — not client adoption or coded parity. | Neither record establishes coded implementation or organisation-wide adoption. (Matter is now the J statement's link.) |
| — | "Who owns what once the system ships" (Assess / Build / Operate flow and what product teams keep) | an E band | folded into a new FAQ answer, "Who owns what once the system ships?" (NEW COPY from the flow's items and the old lead) |
| — | "Explicit contracts matter more when code is generated" (two-stage flow) | an E band | folded into a new FAQ answer, "Does AI-generated code change any of this?" (NEW COPY from the old lead and the flow's items) |
| D-faq | eyebrow | none | Questions |
| D-faq | "Can a Figma library be the first product?" | a question | moved to the Implementation deep page (five questions ran the band to 856) |
| — | "Go deeper / Beyond the library" (article "Design systems for SaaS", and Matter) | an M band of two resource cards | removed from this page; Matter is the J statement's link and the article belongs to the deep pages |
| L close | eyebrow / heading | none / Start with the part of the system teams keep working around | Start a project / Start with the part teams work around |
| L close | body | The decision, component family or adoption path teams keep working around. A rough brief is enough. | The decision, component family or adoption path teams keep working around. |
| L close | points | Send the decision teams keep remaking — One component family is enough. · A reply within one business day — With the first scope it points to. | Send the decision — The one teams keep remaking. One component family is enough. · A reply within a day — One business day, with the first scope it points to. |

**Why.** The 1 Oct review found the page read as a document: tables, flows and lists in one shape, six of eleven bands over the fold, one photograph. The kit sets each section in its own band shape with a photograph, cover or diagram on nine of the ten bands between hero and close, and every band now fits 1470 × 830 (tallest 816).

**Found in.** `kit/page-design-systems`, 6 Oct 2026.

### 8.1 page-design-systems fix round 1 (6 Oct 2026)

**Page / section.** `/design/service-page/design-systems` (`src/content/sources/fixtures/ideal/services/design-systems.ts`, and the page's row in `SERVICE_PHOTO_SLOTS`, `src/lib/photos.ts`).

| Band | Field | Old | New |
|---|---|---|---|
| — | section order | B, H, E parts, J, E thread, G, C-icon, K, C-pair, D-faq, L | B, H, E parts, J, C-icon, E thread, G, K, D-faq, C-pair, L. A centred band now sits between every two beside bands: C-icon, K and C-pair were three 1/3 splits in a row |
| E parts | body | the operating model's sentence across 1240 over a row of four tiles | the orbit diagram: the four parts either side of a ring, the operating model named under it (copy unchanged; the drawing is the template's Parts) |
| G proof | case title | A visual system built with the MVP | A system from day one (one line in the case track; the band's heading already says "with the MVP") |
| D-faq | How should design-system adoption be measured? | By whether the system changes released product work, not by how many components are published. Useful evidence starts with the product and version consuming each shared asset, and shows whether migrations complete, why teams fork or ask for exceptions, how contributions reach a decision, and whether repeated defects or accessibility problems decline. Tcules does not substitute a universal adoption benchmark for your own operating goals. | By whether released product work changes, not by how many components are published: which products run which version, whether migrations finish, and why teams fork. The full set of measures is on the Governance and Adoption page. (link; the rest of the old answer moves there) |
| D-faq | Where do we start? | With a decision several teams keep remaking, the Figma and code objects that represent it, and what a product team does when the shared answer does not fit. That is enough to choose the first responsibility: diagnose when the cause of drift is unclear, set strategy when scope or ownership is disputed, implement when the contract is ready, align when design and code disagree, govern when contribution or adoption is failing. | With one decision several teams keep remaking, and the Figma and code objects that carry it. That picks the first service: an audit when the cause is unclear, strategy when ownership is disputed. (the full condition list is the router band) |
| D-faq | Who owns what once the system ships? | Tcules can assess, build and operate the shared system: … Design Engineering, a separate responsibility, owns product decisions embodied in running frontend work; one engagement can hold both. | Tcules can build and run the shared system: foundations, components, Figma, code, docs, release and adoption. Product teams keep their own composition, research, accessibility and release authority. (the Design Engineering boundary moves to the Implementation deep page) |
| D-faq | Does AI-generated code change any of this? | It raises the stakes. Faster generation repeats an ambiguous rule across more surfaces, sooner. Tokens, semantic component names, typed properties, examples, tests and accessibility rules give a generator far better context than a screenshot. Product-specific composition, real content and exceptional states, accessibility and release acceptance still need accountable review. | It raises the stakes: faster generation repeats an ambiguous rule across more surfaces, sooner. Tokens, typed properties, examples and tests give a generator better context than a screenshot, and release still needs accountable review. |
| C-icon router | aside photograph | desk-flatlay-devices (printed lettering in frame) | designer-monitor-ui, a screen of product UI (was the page's unused aside 2) |
| K offer | photograph | desk-minimal-white, portrait | wireframe-wall, landscape 3:2: a wall of printed screens being traced, the audit's own act (was the page's unused banner slot) |

**Why.** The fix-round-1 review: E parts read as a document and was the page's fifth tile set; bands 7 to 12 repeated one split; the FAQ's open answer was the densest text on the page; the photographs were interchangeable office stock and one carried printed type. **Found in.** `kit/page-design-systems`, fix round 1.

**Still open (content).** The Auxentios quote is the one approved client quote, so it repeats on Product Design's G band until a second quote is approved; Benchmark Gensuite's case is a C-pair card on four service pages.

### 8.2 page-design-systems fix round 2 (6 Oct 2026)

**Page / section.** `/design/service-page/design-systems` (`design-systems.ts`, and the page's row in `SERVICE_PHOTO_SLOTS`, `src/lib/photos.ts`).

| Band | Field | Old | New |
|---|---|---|---|
| — | section order | B, H, E parts, J, C-icon, E thread, G, K, D-faq, C-pair, L | B, H, E parts, J, C-icon, E thread, M, G, K, D-faq, L. The proof is one run, the work then the client's words, and the questions sit last before the form; the page no longer proves itself twice or ends on a second evidence block |
| G proof | case beside the quote | Auxentios · Industrial CPQ / A system from day one / Components, tokens, guidelines and layout rules, from domain research and eight interviews. | none: the card moves, unchanged, to the first of the evidence covers directly above, so the quote is the band's one large thing (it was a 380-wide card beside a quote floating at mid-height) |
| G proof | eyebrow | Proof | In their words (the band above is now "Evidence") |
| G proof | lead | The visual system grew alongside the first release, from the same research, rather than being retrofitted. | none (the head centres over the typographic quote; the Auxentios card body says it) |
| Evidence (C-pair, now M) | lead | Two more products where shared components and rules carried the work. Each claims only what its record shows. | Three products where shared components and rules carried the work. |
| Evidence | cases | Doodle, Benchmark Gensuite | Auxentios, Doodle, Benchmark Gensuite (three covers, M) |
| Evidence | Benchmark Gensuite title | One experience across 75+ applications | One experience across 75+ apps (three lines with "applications" alone at 1024) |
| Evidence | scope note | Neither record establishes coded implementation or organisation-wide adoption. | none on the service page. **Ask:** the hedge belongs on the two case pages, where the record is |
| C-icon router | `more` | none | Not sure which? Start with an audit (the Design System Audit). The router's foot ends on the photograph's bottom edge |
| Photos | B / router / K | screen-over-shoulder / designer-monitor-ui / wireframe-wall | swatch-book-pages (a colour library, page by page) / white-bricks-pile (unpainted components) / swatch-ring-white (a whole scale laid out): three new Unsplash photographs, catalogued, measured neutral and quiet. The case covers are the page's only screens |

**Why.** Fix round 2 review: B's counterweight read as a skeleton loader, the router and case images were postage stamps, three device shots read as generic stock, the proof was split by K and the FAQ, and the evidence band disclaimed itself. **Found in.** `kit/page-design-systems`, fix round 2.

## Records become boxed tables (7 Oct 2026, owner design review)

**Page / section.** `/services/design-engineering` · *Code answers what a screen cannot* (the record
"What a screen leaves open"), and `/services/ai-product-ux` · *Eight questions per scenario* (the
"Responsibility record").

**What's needed.** Each record loses its mono label (`meta`) and gains two column heads (`columns`),
because it now renders as a boxed table (tables are boxed, owner 7 Oct 2026):
- Design Engineering: was meta "Needs running code"; now columns **"Left open"** over the fields and
  **"What only running code settles"** over the questions.
- AI Product UX: was meta "One per AI scenario"; now columns **"Field"** and **"The question it
  answers"**. "One per AI scenario" is already said by the band's lead.

The record's title stays, as the heading over the table. The field icons stay in the content for the
deep page; the table does not draw them. Strapi: a record block needs the two column-head strings.

**Found in.** `fix/sections`, 7 Oct 2026.

## Thread loops fit the arc's label (7 Oct 2026, owner design review)

**Page / section.** The Thread diagram's return sentence (`loop`) on `/services/design-engineering`,
`/design-systems`, `/product-design` and `/product-modernisation`.

**What's needed.** The loop is now the LABEL on the return arc, so it is at most eight words:
- Design Engineering: "A finding that contradicts the decision reopens the question, not just the code."
  → **"A contradicting finding reopens the question itself."**
- Design Systems: "Change one alone and products drift: designers detach, and code accepts what design
  forbids." → **"Change one alone and the products drift."**
- Product Design: "A mistaken change has a safe way back to the last accepted plan." → **"A mistaken
  change returns to the accepted plan."**
- Product Modernisation: "A failed migration has a designed route back to the current product." →
  **"A failed migration routes back to today’s product."**
- AI Product UX: unchanged ("Every level keeps a way back to a person.", eight words).

Where no arc is drawn (phones, two-row threads) the sentence closes the thread, led by "Back to
{first stage}:". Strapi: cap the loop field at eight words.

**Found in.** Owner review, 7 Oct 2026.

## Product Design recomposed as the 7 Oct review showcase (9 Oct 2026)

`/design/service-page/product-design` (fixture `ideal/services/product-design.ts`). Band order:
hero · B signals · F method · E worked example · J statement · H clients · G quotes · C-icon routes ·
L close.

- **Removed sections.** `work` (the C-pair: Doodle and Scissors cases), `examine-the-slice` (the K
  offer), `who-is-involved` (the N contrast pair) and the case beside the Auxentios quote (G-case,
  rejected 7 Oct). Their copy is unchanged in git history; nothing was rewritten.
- **Order.** `clients` moved from second to fifth, after the statement, so the proof (marks, then
  quotes) sits together before the routes; `method` and `worked-example` now follow the signals
  directly.
- **Hero.** The Clutch rating (4.8, sourced, `ratings.ts`) moved from beside the client marks into
  the hero's eyebrow. Proof types are not combined in one section.
- **Clients.** Heading "Teams we have shipped with" → **"Product teams we have designed and shipped
  with"**, rendered as the LogoGrid's eyebrow-size context line. Marks: six → all nine (SafeXpay, GT
  Tools and Incluude added, owner 8 Oct: work with the nine we have).
- **Proof.** Heading "In a client’s words" → **"In our clients’ words"** (rendered as the band's
  context line); action **"See the work"** → case studies added. Two **fictional stand-in** quotes
  join Ashok Mohanty's for the slider (Arjun Mehta, Corvel Health; Daniel Okafor, Brightwater Labs —
  the kit testimonial specimen's speakers, cut to ~20 words). **Replace with sourced quotes before
  any route uses this fixture.**
- **Close.** The form is now the compact EnquiryForm on every service page (name, email, one
  question; no scheduling link).

## Service closes trimmed; Product Design loses the worked example (9 Oct 2026, owner)

The compact form carries "We reply within a business day", so no close repeats the reply time. Each
close is now one short lead, one note and one next step. Every service shares the note:
"Do not include credentials, regulated records or confidential source material." →
"Do not send credentials or confidential material."

| Service | Field | Old | New |
|---|---|---|---|
| ai-product-ux | body | The interaction, the evidence behind it and the decision rule that needs to become explicit. | The interaction, and the decision rule it needs made explicit. |
| ai-product-ux | point 1 detail | What the model does, and what it may affect. A rough brief is enough. | A rough brief is enough. |
| ai-product-ux | point 2 | A reply within a day: One business day, with what the record needs next. | removed |
| design-engineering | point 1 detail | One disputed interaction is enough. A rough brief is fine. | One disputed interaction is enough. |
| design-engineering | point 2 | A reply within a day: One business day, with the first slice it points to. | removed |
| design-systems | body | The decision, component family or adoption path teams keep working around. | The decision or component family teams keep working around. |
| design-systems | point 1 detail | The one teams keep remaking. One component family is enough. | One component family is enough. |
| design-systems | point 2 | A reply within a day: One business day, with the first scope it points to. | removed |
| product-design | body | The decision, the roles it affects and the evidence you already have. | The decision, and the evidence you already have. |
| product-design | point 1 detail | And what you already know about it. A rough brief is enough. | A rough brief is enough. |
| product-design | point 2 | A reply within a day: One business day, with the questions we need answered first. | removed |
| product-modernisation | body | The capability, what depends on it, and the change that can no longer wait. | The capability, and the change that can no longer wait. |
| product-modernisation | point 1 detail | And what depends on it. A rough brief is enough. | A rough brief is enough. |
| product-modernisation | point 2 | A reply within a day: One business day. Incomplete evidence becomes uncertainty to test. | removed |
| software-development | body | The slice, its users, the system constraints and the release outcome. A rough brief is enough. | The slice, its users and the release outcome. |
| software-development | point 1 detail | A prototype, a spec or screens, if there are any. | A prototype, a spec or screens. |
| software-development | point 2 | A reply within one business day: With the responsibility it points to. | removed |

**Product Design** (`ideal/services/product-design.ts`):

- **Removed** the `worked-example` section (E, Thread, "Moving one job moves others"): too dense
  (owner). Copy is in git history.
- **Removed** `hero.rating` (the Clutch badge): not the pattern for this page. The hero has no
  eyebrow.
- **Order.** `specialist-services` (C-icon) moved from the foot to after `method`, because removing
  the Thread left F steps directly above the J statement, two text-heavy bands (§ 1.7). New order:
  hero · B · F · C-icon · J · H · G · L.
- **Statement.** "How we work" is centred with `texture="corner-pair"`. The template now gives any
  centred statement that wins the corner its bottom-start partner (`Bands.tsx`).

## Home enquiry close: the form's framing words (16 Oct 2026, owner)

The island close's form dresses add words the corpus does not author. The owner approved them for
shipping; the content team should confirm or replace them. They live in
`src/templates/CorpusPage/blocks.tsx` (`ENQUIRY_DRESS`).

| Where | Added copy |
|---|---|
| card dress, heading | Start a project |
| both dresses, example in "What are you working on?" | A link, a Figma file, or two lines about the problem. |
| message dress, foot | or write to hello@tcules.com |
| card dress, beside the send | We reply in 1 business day |
| message dress, the note | Tell us what you’re building. I’ll reply within a working day. |
| message dress, the person | Rushali · Design lead · Tcules (PLACEHOLDER: the owner will name who answers enquiries) |

The page's own after-line ("We'll reply within one business day.") is not shown by the card dress;
the success view still uses the page's `on_success` words.

## Home "What we do": Software Development's line cut to its opening (19 Oct 2026, owner)

The band is a Bento (six tiles, one or two lines each). The owner asked for Software Development's
entry to read in one or two lines like the other five, so `_pages/home.md` now carries its opening
clause only. Cut, not reworded. The content team should confirm it or write a new line of the same
length.

| | Copy |
|---|---|
| Was | Our engineers turn the design into working software, with the designers beside them, for a first release or a product you already run. For GT Tools, we redesigned and built the Shopify store their buyers use to find and compare equipment. |
| Now | Our engineers turn the design into working software, with the designers beside them. |

The GT Tools example leaves this band. Selected work carries the case proof on home.

## Case study cards drop their quotes; the case index opens by stage (22 Oct 2026, owner)

Case study cards never hold a testimonial (Jatin review, 22 Oct 2026). On home, the two featured cases
(Doodle, Eden AI) are still featured cards, without the client's words; those words stay in the
page's testimonial band. On `/case-studies`, a band's quote still marks which case that band features,
but the quote itself is no longer shown on the card. No copy was changed.

The case index's BY TYPE view (the corpus's own bands and their headings) is replaced by BY STAGE, the
default. The stages are placeholders until the owner names them: docs/content-proposals.md P51.

## Expertise "What you get": every deliverable takes a title pulled from its own words (30 Oct 2026, owner)

**Page / section.** All 12 `/expertise/*` pages, What you get (`#what-you-get`), the "What you receive" list.

**What's needed.** Each deliverable is written as one lower-case sentence with no title ("a map of the records,
roles, rules and states the workflow runs on"). Each now gets a short title pulled from that sentence's own
words, and the sentence stays whole as its body: "The workflow map" over "A map of the records, roles, rules
and states the workflow runs on." No new words. The proposed title for every deliverable on all 12 pages is in
`docs/page-build/visual-inventory-expertise.md` § 2 (the "What you get (pulled title)" tables). The content
team should confirm or replace each one, keeping it pulled from the sentence.

**Why.** The band's approved arrangement (`decisions/2026-10-30-what-you-get-label-rows`, proposed) is a set
of titled deliverables, each with its drawing. Untitled sentences fell back to a ruled grid of lower-case
statements, the format the owner rejected on 30 Oct. FinTech's first item ("**a status map:** …") is the only
one that was already titled.

**Found in.** Expertise pages pass, tracker 2.32.

- **/about, the studio's links (31 Oct 2026).** LinkedIn, Clutch and Careers left "The practice keeps moving" for a
  block of their own (owner). The block's title is ours, not the copy's: "Follow the studio, read its reviews,
  join the team". For Jatin to keep or replace.
