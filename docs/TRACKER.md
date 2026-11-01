# Tracker — Design Engineer handoff

**The one list of what's next.** Work top to bottom. A phase starts when the one above it is done,
unless a task says otherwise. Update it in the same PR as the work: tick the box and add the PR number.

`[ ]` todo · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

**Stages are not launch phases.** The numbered sections below are build stages, called "Phase 0–6" before
30 Oct; older specs and rulings still say Phase. A *phase* is a release: **phase 1** is everything that
ships on 6 Nov, and **phase 2** is everything after launch. There is no phase 3 (owner, 30 Oct 2026;
decisions/2026-10-30-launch-is-phase-1-after-is-phase-2).

Inputs: `Tcules-Design-Engineer-Handoff-Package/` (handoff docx, content system, Copy × UI standard),
the brand framework (see 0.2), `docs/visual-assets-plan.md`, `docs/dbf-ch05-amendments.md`.

**Every task is done when:** `npm run verify` passes · the specimen has been updated · it has been
checked at 1440 and 390 · the Copy × UI hard gates pass (CU01, 03, 06, 10, 16, 21, 23, 25) · the
fix lives in the component or its tokens, not in a route.

---

## Stage 0 — Base

- [x] **0.1** Land `feat/content-section-per-heading`: Tag, Texture, the Prose changes, the route edits. (#55)
- [x] **0.2** Put the brand framework in the repo at `docs/brand/`: illustration concept, image rules,
      product UI treatment, ch05 Imagery, ch10 Social. Every later task reads it, so it has to be
      readable from here. First copy `b539e13`; re-pulled at v1.0 on 28 Sep.
- [x] **0.3** Brand guidelines complete (25 Sep): ch02, ch05 and ch10 at v1.0 in Claude Design. There are no
      open, deferred, draft or void items left, and every rule is consistent with every other.
      Record: `docs/dbf-consistency-check-2026-09-24.md`.
- [x] **0.4** `V10-REPORT.md` is in the package. `TESTIMONIAL-REGISTER-V10.csv` is deferred with the
      other content asks (see Parked). The design work is content-agnostic for now.
- [x] **0.5** Two running lists, added to *while* the work happens rather than written up at the end:
      `docs/content-changes.md` (copy and structure changes a component needs, for Devagya) and
      `docs/strapi-changes.md` (CMS recommendations, for the CMS owner). Strapi is not our work: we
      design the right thing, make the recommendation, and move on. The first entry is the
      component ↔ Strapi mirroring rule.
- [x] **0.6** Client-logo rules and the cover registry are final in ch05 v1.0 (25 Sep).
- [ ] **0.7** Bring the Claude Design templates in line with ch10 v1.0 (moved out of the chapter on 25 Sep):
      - `social-posts-v3`: marked phrase as the drawn rectangle (A5); paper on cover, closer and more than half the frames; hinge on ink or brandeis-500; `#d6e0ff` → brandeis-100.
      - `hiring-poster`: marked phrase as A5; two peridot marks (illustration, date); labels become ch05 §4b concept chip and part labels; `#9bb200` → peridot-600; QR on paper or paper-deep, ruled; mono 20 → 22px; margin 80; distances on the ladder; file message lines per ch05 §4.
      - `hiring-poster-detail`: marked phrase as A5; remove the blue fact panel, chips and two body columns (terms line and QR row carry them); margin 80; distances on the ladder; floor 22px.

## Stage 1 — Component audit (decide before building)

Read-only. The output is a decision, not code.

- [x] **1.0** Revisit the foundations before the components that sit on them: the type ladder
      (H1/H2 and card-heading wrapping with real long titles), the gap scale, the Section/Layout
      grid and breakpoints, media ratios, focus states. Most of it has shipped; this checks it against
      the handoff's "build now" list and the brand framework, and records what to refine.
- [x] **1.1** Write `docs/component-audit.md` (decided 28 Sep; rulings in its §6). For each of the 25 shipped components, record:
      - **Jobs it must serve:** from the handoff's page families and semantic inventory.
      - **Arrangements it must offer:** from the brand's visual treatments. For example, PageHero
        currently has one left-aligned layout, but has to serve routing, situation-led, proof-led and
        article/definition intros, each with illustration, product capture, photography or no visual.
      - **What it has today:** read from its specimen.
      - **Brand fit:** no type on images, media kind (capture / cut-out / drawing), images checked at
        326px, and ink/blue reserved (addendum D). The ink/blue bands on routes today get reviewed here.
      - **Verdict:** keep · extend (new variants) · rebuild. Rebuild gets a sentence saying why.
      - **Missing jobs:** jobs nothing serves yet (logo strip, testimonial group, case selection,
        mechanism/steps, comparison, related content). **A job is not a component.** First show
        whether existing pieces already compose it; a logo strip, for example, is Figures in a
        Cluster. Only propose a new component if the composition needs something of its own:
        markup or semantics, behaviour, or an arrangement the primitives can't express. If not,
        the answer is a composition in the template.
- [-] **1.2** ~~Comp the five contexts in Claude Design.~~ Dropped 28 Sep: whole pages are the wrong unit
      before the components are fixed. Each component's design is now decided in its own spec (Stage 2), and
      "is the page beautiful" is answered in Stage 3 on the real page. The one idea kept from it: the
      no-visual page is designed first, in 3.2.
- [x] **1.4** Illustration concepts and asset inventory (runs alongside Stage 2; needs no code). From
      `visual-assets-plan.md`: for each of the ~26 illustrations, the one-line message, the brief answered in
      ch05 §4d order, and the read-back test. For each case study, run §9a to decide the cover and banner kind
      (cut-out or registry archetype). Also inventory the client work and photography already cleared for use.
      Output: `docs/illustration-concepts.md`, starting with the six service lines. Concepts done 28 Sep; covers and
      photography parked. Service-line illustrations round 1 generated (`npm run illustrations`).
- [x] **1.3** Fill in Stage 2 below from 1.1: one task per component, in dependency order (28 Sep).

## Stage 2 — Component overhaul

One component per PR, run as in CLAUDE.md § How a component gets made: Claude writes the spec, the
owner answers its open questions, Claude builds (`/build-from-spec`), verifies (`verify`, `aria:check`,
`/audit-component`) and screenshots (`npm run shots`), and the owner approves. Every specimen gains stress rows
(shortest and longest real copy, long proper nouns, a 326 track). Order is `docs/component-audit.md` §5;
★ marks the tasks that need an owner decision before building.

**Foundations: no decisions needed, so Claude runs these straight through.**
- [x] **2.1** Heading wrap: `text-wrap: balance` on every title role, `pretty` on lead/body. Long-title stress
      rows in `/design/typography` at the CU04 ceilings. (#61)
- [x] **2.2** `_specimen` gains a 326 track. Every specimen with an image slot gets a 326 row. (#62)
- [x] **2.3** `--ratio-cover` 3/2 as a primitive; BlockCard and ListCard alias it. (#64)
- [x] **2.4** CtaSection: `open` collapses to one track when there is no proof (`CtaSection.tsx:376`, the
      `Proof.tsx:189` idiom). ~466px of dead ground on ten routes. (#66)
- [x] **2.5** Tag: fix the specimen's hydration mismatch and its 18px overflow at 390 (found by `npm run shots`). (#67)
      A 29 Sep "regression" was `shots` screenshotting another checkout's server; fixed in the script (#80).

**Media, in dependency order.**
- [x] **2.6** ★ `Media` primitive (new, tier 1): responsive slot (derived widths, WebP), `kind` capture ·
      cut-out · illustration · photograph, intrinsic size, cover/contain. Everything with an image depends on it. (#71)
- [x] **2.7** Figure onto `Media`: edge by kind (a capture takes the hairline; a cut-out takes no edge, one
      shadow and a contrast panel when needed; an illustration is never boxed), radius 0. (#72, landed via #76)
- [x] **2.8** ★ `ClientMark` primitive (new, tier 1): drawn in the ground's ink, sized by visual weight (ch05 §10). (#69; real client set #78)
- [x] **2.9** ★ PageHero rebuild: arrangements (stacked · media beside · media below) × media kind, media at
      intrinsic ratio, a designed no-visual state. It unblocks 6.4. (#74, landed via #76. "Media below" is `stacked`, ruling H1)

**Patterns.**
- [x] **2.10** ★ BlockCard: onto `Media`, a featured horizontal arrangement, a designed no-media state, and a review of
      `media.kind: 'icon'` against ch04. (#77, landed via #76. The icon fill was removed after the ch04 review)
- [x] **2.11** ListCard: onto `Media`, the ordered marker as a real `ol`, the external glyph. (#76)
- [x] **2.12** ★ Proof: 1:1 portrait and client mark; `role` optional. (#75, landed via #76)
- [x] **2.13** ★ ContentSection: a head-beside-body arrangement; specimen raised to the Tag standard. (#70)
- [x] **2.14** Icon: the ch04 glyphs the site needs (`square-arrow-right-up`, `info-circle`, `danger-triangle`);
      check the size scale against ch04's seven; review the six service glyphs. (#63)
- [x] **2.15** ★ DataTable (brief 10): the comparison job. (#73 — revised 29 Sep: boxed, scrolls sideways on narrow tracks, dividers on every column)
- [x] **2.16** Texture: write its spec (decorative ground; the placement limits in audit §3). (#65)

**Visual pass — before Stage 3 (owner, 29 Sep).** Every component works; now make each one beautiful.
- [ ] **2.17** ★ Visual overhaul: review every shipped component's specimen at 1440 and 390 against CLAUDE.md
      § Design quality and the brand chapters, and propose per component what to change. The owner approves each
      proposal before it is built; one component (or one tight family) per PR, each re-shot with `npm run shots`.
- [x] **2.18** Reasons: the "why Tcules" band (15 Oct queue). Six argued reasons, each with an isometric drawing of
      its claim; `open`, `boxed` and `beside`, all one fold at 1440 (owner picks, 16 Oct 2026, mocks rounds 1–4). (#115)

**Review with Jatin, 22 Oct.** Triaged with the owner's answers in the review checklist
(https://claude.ai/artifact/HLnxA2opHsfw47YkfSXcnf). Batch 1 lands and is reviewed before batch 2 starts (owner, 22 Oct).

*Batch 1: small items, one PR each.*
- [~] **2.19** FAQ question at 20px, as a standard step in the type ladder.
- [~] **2.20** Testimonials italic everywhere (supersedes the 15 Oct voice-variant ruling).
- [~] **2.21** Reasons takes four: today's arrangement as 2×2, and `beside` with a 2×2 set.
- [~] **2.22** Case study cards never hold a testimonial; the case study index groups by stage (default) and industry.
- [~] **2.23** Card titles are sans except the horizontal variant; insights group titles smaller with more air; By type is the default.

*Batch 2: exploratory, after batch 1 is reviewed.*
- [ ] **2.24** Branded case study cards: an experiment on Linear's concept, logged as experimenting. If it fails,
      improve the current card instead, on a paper-deep card ground.
- [ ] **2.25** Recolour every Reasons isometric without peridot, to see the set in blue only.
- [~] **2.26** Graphics tiers: test the isometric illustrations in the services bento against the flat graphics, and
      polish the flat graphics without changing their style. Rules for which content takes which graphic come after.
      The bento's six drawings are redrawn and solve their story on hover (decisions/2026-10-25-bento-drawings-tell-their-story).
      Rolled out 26 Oct (branch design/s2-flat-grammar, awaiting the owner's look): every Sketch plate draws the
      redrawn scenes, still and held solved, in the two weights; EngagementOptions and TracePlates draw through
      Sketch, their 14 drawings redrawn as kit scenes; EngagementModel takes the weights and dash. Logged as proposed: decisions/2026-10-26-flat-graphics-grammar and
      -flat-or-isometric-two-questions.
- [~] **2.27** Listings polish before lock: a claude.com/resources pass and a cut of every line that doesn't structure.
- [ ] **2.28** Tools in the listings, looking like tools rather than standard cards.
- [x] **2.29** Enquiry form: mocks with more air inside the panel (the island width stays). Went further
      (owner, 23 Oct 2026): the close at 1:1 (`islandArrangement="halves"`, the panel at a `stack` inset),
      the TextureFlow field, and the sketch-to-shipped drawing; both versions on /design/cta-section § 1d.
      Home carries the halves close with the drawing and an untitled card (owner, 25 Oct 2026).
- [~] **2.30** Industries band ("Products we know well"): a better interaction (refs: stripe.com startup-foundation
      cards, apple.com/iphone "Get to know iPhone") and better, non-stereotypical stock until a shoot. Low priority.
      Photos replaced (owner, 26 Oct 2026): no faces, a close crop on the main part of each sector's activity.
      The band stays the 4×2 grid for now; accordion, contact-sheet and sentence directions were mocked and set aside.
- [~] **2.31** Service pages at home's level, starting with Product Design (owner, 26 Oct 2026; mock
      https://claude.ai/artifact/8d5ZWF4hQTMkJ57iZDc4Em, rounds 1–4). Shipped in #161: drawn offer and starting points, the Dealpath strip on tint, the case slider (2a), two
      tint testimonial bands, Ways to work drawn as Reasons, specialist services as an equal bento, home's close.
      Rulings: decisions/2026-10-26-sliders-allowed-off-homepage, -quote-gets-its-own-band,
      -case-cards-use-the-case-image, -service-items-drawn-per-item, -worked-example-is-a-strip.

**Pages the owner has not designed yet (owner, 30 Oct 2026).** Home and the seven level-1 service pages had their
design pass (#174, #175). Everything below still renders the 26 Oct copy through the generic composer (`_corpus/`),
and each can take many design changes. Work in the order listed: polished-tier pages first (launch roadmap), and
a template before the single pages it serves, since one pass there fixes every page on it. Starting notes are the
29 Oct critic's (`docs/page-build/review-29-oct.md`), not a brief.
- [ ] **2.32** Expertise pages, all 12 (`/expertise/[slug]`): one design pass on the offer template they share, starting
      from what the service pages got in round 5. Six product types carry Bhumika's hero drawings, six industries
      carry sector photos. Polished tier.
- [ ] **2.33** `/about`: two OfferSheets read the same; the leadership band has no portraits yet; the difference
      band as a DataTable is still an open owner call. Polished tier.
- [ ] **2.34** `/contact`: the hero's right half is empty, and the page ends in text bands. Polished tier.
- [ ] **2.35** Future Interfaces Lab (`/future-interfaces-lab`, and `/join`): not reviewed by anyone yet. Polished tier.
- [ ] **2.36** Audit pages, every level 1 (`/audits/[slug]`): the same offer template as expertise, so this pass
      starts from 2.32's and changes only what an audit does differently (what is examined, the deliverable).
      `/audits/prototype-readiness-review`: the hero carries the worked-example video, the storyboard v14c side by side
      in Claude Design (https://claude.ai/design/p/6a4c2d80-fb89-4109-88cc-f05a8602ea05, file "Worked example -
      storyboard v14c (side by side)"); added in the visuals pass (owner, 31 Oct 2026).
- [ ] **2.37** `/services` hub: the routing page into the seven service lines; the hero image is a dev placeholder.
- [ ] **2.38** `/expertise` hub: 5 of 12 product-type images are dev placeholders.
- [ ] **2.39** Glossary, hub and terms (`/glossary`, `/glossary/[slug]`): the hub is seven text bands with no visual
      relief (lowest score on 29 Oct, 4/10).

*More phase 1 pages, triaged by the owner on 31 Oct 2026.* These pages were not in the list above. All of them ship on 6 Nov.

**Every page in 2.32–2.47 renders (checked 1 Nov 2026 on main at 6815435e).** #181 routed each one through the
generic composer (`_corpus/`), the legal pages through the article shell and the tools through `_corpus/tool`. A
production build serves all 95 routes in `_pages/` with a 200, so none of them 404s and no "make it render" pass is
needed. What remains on 2.32–2.43 and 2.46 is the design pass itself. `kinds:check` on that build reports 7
problems: 5 client logos that have no file yet (Benchmark Gensuite, Eden AI, ConnectX, JoVE, Ringier) on
`/expertise`, `/how-we-work`, `/services` and `/why-tcules`; and the 2 `/contact` bands, which wait on the owner's
choice (2.34).
- [ ] **2.40** `/how-we-work`, plus `/how-we-work/ai-native-product-design` and `/how-we-work/ai-transparency`. Crucial.
- [ ] **2.41** `/why-tcules`: every service page links to it. It renders through the composer since #181. Crucial.
- [ ] **2.42** `/careers`: crucial (moved out of Parked, 31 Oct).
- [ ] **2.43** `/matter-design-system`: crucial.
- [~] **2.44** Insights rich text: the live articles ship from Strapi as they are, so the article template has to
      render every rich-text block they use (headings, lists, quotes, images with captions, embeds, tables, code).
      Needs no design pass, only full coverage. Coverage run started 1 Nov on `feat/insights-rich-text`.
- [x] **2.45** Legal and utility pages (`/privacy-policy`, `/cookie-policy`, `/terms-of-use`, `/sitemap`): crucial,
      but they need no design. A plain text-page template is enough. They render in the article shell (#181).
- [ ] **2.46** Level-2 sub-services, 26 pages (`/services/<line>/<service>`): polished tier, built from the components
      that already exist, with no new ones (owner, 31 Oct 2026). No illustrations this launch: the hero takes its
      designed no-visual state.
<<<<<<< HEAD
- [ ] **2.47** Tools, 6 pages and the `/tools` hub: these launch as article-style pages (launch roadmap).
- [x] **2.48** Flat drawings (owner, 31 Oct–1 Nov 2026, branch design/flat-line-motion): every tile drawing moves in
      the four patterns, two at most, start and end different (decisions/2026-10-31-tile-drawings-move-in-four-patterns),
      in any hover tile; the 29 service tiles redrawn; the 310 empty What-you-get plates on 33 level-2 pages drawn
      (components/Sketch/wyg-*.tsx); peridot accent on ink (proposed). Workflows `flat-drawings` and
      `flat-drawings-pages`, brief in docs/research/flat-graphics/drawing-brief.md. Open: About's three How-we-work
      plates; the three term rows read as one template across pages.
=======
- [x] **2.47** Tools, 6 pages and the `/tools` hub: these launch as article-style pages (launch roadmap). All seven
      render from the copy through `_corpus/tool` (#181).
>>>>>>> origin/main

*Waiting on content.* What we do: Jatin's copy repositions software development as MVP development for 0–1
teams; re-weight the bento when it lands · the stage taxonomy for case studies · the four reasons' copy (P48) ·
Jatin's explicit sign-off on the reduced type size.

## Stage 3 — Slice 1: `/services/product-design`

- [ ] **3.1** Semantic section view models in `src/content/types.ts`: Situation, Capability set,
      Mechanism, Proof, FAQ, Related, Enquiry. Shape them as the components' content props, not
      after today's Strapi response. Keep the adapter in `sources/strapi/service.ts` as thin as it can be
      while the page still renders. Anything that doesn't map cleanly goes on `docs/strapi-changes.md`
      and isn't solved here.
- [ ] **3.2** `ServicePage` template in `src/templates/` + the section renderer. Design the no-visual
      state first (from the dropped 1.2): it is what most pages ship in.
- [ ] **3.3** Route down to composition only (~50 lines).
- [ ] **3.4** SEO/meta helper: unique title and description, canonical, social image, robots. No
      FAQPage schema. Analytics hooks at component boundaries (CTA to contact, form start/error/complete,
      case-study clicks). The handoff lists both as "build now", so the first slice ships with them.
- [ ] **3.5** Handoff acceptance checks + Copy × UI review on the real page. The first two checks
      matter most: changing copy or proof needs no code change, and reordering an allowed section
      needs no schema change.

## Stage 4 — Slice 2: `/audits/design-to-code-audit`

- [ ] **4.1** Reuse Stage 3. New only where an audit genuinely differs: what's examined, the deliverable, the boundary.
- [ ] **4.2** Count the new components it needed. More than two means Stage 3's sections were too
      specific: fix them before going on.

## Stage 5 — Slice 3: ConnectX case study

- [ ] **5.1** Reusable records as view models: Client, Testimonial, Case Study, Proof/Metric, Media.
- [ ] **5.2** Proof and logo strips reference records instead of copying text.
- [ ] **5.3** Case-study template: artefacts, outcomes with their evidence state, related work.

## Stage 6 — Rollout and plumbing

- [ ] **6.1** Remaining services, audits and expertise onto the templates.
- [ ] **6.2** Draft preview, and an empty optional section renders nothing.
- [ ] **6.3** Hand over `docs/strapi-changes.md` to the CMS owner, and `docs/content-changes.md` to Devagya.
- [ ] **6.4** Rewrite ch05 §9 placement specs from the shipped components (addendum B6).
- [ ] **6.5** Responsive check across the site (owner, 31 Oct). Two concerns to test at 1440, 1024, 768
      and 390 before changing anything:
      - **Type contrast.** The scale reads too close between steps; stretch it so the hierarchy holds,
        most of all at the `-t` / `-m` steps where titles step down. Size and line height change together
        in `primitives.css`.
      - **Grouping on mobile.** Distances must not collapse to one value on a phone, or the nesting stops
        reading as groups. Check that block, stack and section seams stay distinct at 390 alongside
        Section's 64 padding. The gap scale doesn't shift by breakpoint (CLAUDE.md, gap-scale rule 4), so
        a fix that needs it to is a ruling for `/decide`, not a local media query.

## Parked (handoff says don't freeze yet)

Homepage · About · final positioning copy · migrating all 135 routes · share-preview generator.

## Phase 2 — after the 6 Nov launch

- [ ] `/clients` (owner, 31 Oct 2026).
- [ ] Cookie consent banner: not designed yet, so it's parked until after launch (owner, 31 Oct 2026).
- [ ] Author pages: `/insights/authors` and `/insights/authors/<person>`, then the byline and "More from …"
      links (owner, 30 Oct; pulled forward only if the weekend leaves time;
      decisions/2026-10-30-author-pages-move-to-phase-2).
- [ ] From the Jatin review, 22 Oct: a Stripe-like bento of visual-heavy vertical cards · an "Ask AI" feature
      for learning about Tcules on the site · the reply-style form redesigned as an AI chat window (pairs
      with Ask AI).

**Content asks, addressed later.** The design is content-agnostic for now, so nothing here blocks
a phase: `TESTIMONIAL-REGISTER-V10.csv` (quote text behind the v10 quote IDs) · anything logged in
`docs/content-changes.md`.
