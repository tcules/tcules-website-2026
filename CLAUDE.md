# tcules-website-2026 — working rules

A clean rebuild. The previous codebase is at `../tcules-website` and is **not** a source of
patterns — see § The old repo.

## Team context: shared through git, identity from your own folder

Several people work in this repo with Claude, some on a shared Claude account from different computers.
Two rules keep their context the same and their identities separate:

- **Project knowledge lives in git.** This file, the rulings in `docs/decisions/`, the docs and the pull
  requests are the shared context, identical for everyone who pulls. When a session learns something
  the team needs (a decision, a convention, a gotcha), it goes into the repo through a pull request,
  never only into a chat or a Claude account's memory, which the next person can't see.
- **Who is at the keyboard comes from `CLAUDE.local.md`**, a one-line file in each person's own clone,
  git-ignored and never pushed (template: `team/templates/CLAUDE.local.md`; roles: `team/roles/`).
  Commits, pull requests and notes are that person's, never the Claude account's. If it's missing, ask
  once who they are (names in `team/members.json`), carry on, and offer `/onboard` to save it.

**At the start of a session**, catch up from GitHub without ever risking unsaved work: run `git fetch`;
bring new work in only with `git merge --ff-only` when `git status --porcelain` is empty and the branch
tracks a remote; otherwise leave everything as it is and say what's waiting and what's unsaved. Never
stash, reset, rebase or check out over changes, and never delete a folder or worktree without checking
it for unsaved work and asking. If anything is in the way, say so and carry on with the person's work.
Then give a catch-up of five lines or fewer: what merged recently, what's open (`gh pr list` if `gh` is
installed, otherwise `git log origin/main`), and the latest "Handoff" note on this branch's pull request.

**Designers and gtm aren't technical.** Never ask them to rebase, stash, reset, merge or force-push;
describe what is happening to their work, offer plain choices, and do the git work for them.

## Scope: three tiers, one direction

```
app  →  templates  →  patterns  →  components  →  lib / styles
```

| Tier | Path | What lives there |
|---|---|---|
| — | `src/app/**` | routes. Composition only; read content, pass props |
| 3 | `src/templates/**` | whole page-type layouts (article shape, service-page shape) |
| 2 | `src/patterns/**` | composed blocks — `SiteNav`, `SiteFooter`, `Breadcrumbs`, `TableOfContents`, `PageHero`, `ContentSection`, `CtaSection`, `CtaRow`, `EnquiryForm`, `ProcessFlow`, `ListCard`, `BlockCard`, `Accordion`, `Proof`, `Callout`, `DataTable`, `Figure`, `Bento` and the kit's `Slider` today; `Statement`, `Banner`, `Contrast` and `Thread` as they land |
| 1 | `src/components/**` | primitives, controls and marks — `Section`, `Layout`, `Cluster`, `Button`, `Icon`, `Logo`, `Prose` |
| — | `src/content/**` | the CMS seam. Imported by pages and nothing else |
| — | `src/lib/**`, `src/styles/**` | leaves. Import nothing above them |

**Imports flow one way only — never upward, never sideways within a tier.** Enforced by
`no-restricted-imports` in `eslint.config.mjs`, so a violation fails lint rather than being a
matter of discipline.

A primitive that reaches for a pattern has stopped being a primitive. A pattern that imports
`@/content` has bound a presentation unit to a data source. The previous codebase grew 111
bespoke section folders precisely because nothing stopped a block importing whatever was
nearest — that is the failure this rule exists to prevent.

**If a tier needs something the tier below does not provide, build it in the tier below.**
Never reach sideways, and never inline a one-off.

**Sideways has an idiom, and it is not an import.** A primitive that needs another primitive inside
it takes it as a `ReactNode` prop and lets the caller compose — `Button` never imports `Icon`, it
accepts `icon`, so the caller decides which glyph and the control only sizes what it is handed. Import
the sibling instead and the two are welded for every future use. Lint blocks the alias and the `../`
back door both, so the choice is: take the prop, or accept that the thing is a *pattern* rather than
a primitive. Same rule one tier up — a pattern does not import a pattern.

## Layout is done by the primitives. Always.

`Section`, `Layout` and `Cluster` express every arrangement in the site between them:

- **`Section`** — the full-width band. Paints the ground and owns the content column (1240 cap,
  32 gutter, 16 below 768: owner, 5 Nov 2026; decisions/2026-11-05-phone-gutter-is-16) and the vertical air: ONE value per width — 96, and 64 below 768 — with the page's
  first band taking 48 (tablet) / 32 (phone) above its content; `density="strip"` (24) and `flush`
  (0) are the only exceptions (owner, 7 Oct 2026). Every one of those values comes from `--sec-*`; the component contributes none of its own.
  `surface="paper | tint | ink | blue"` sets the ground for everything inside it.
- **`Layout`** — the columnar axis. Tracks (`3`, `[2,1]`, per-breakpoint, `fit`, `tile`) plus
  `rowGap` / `colGap`, both taking gap-scale step names. A vertical stack is the single-track case.
  `scroll="until-md" | "always"` turns the tracks into one sideways scroll-snap row, `columns` then
  naming how many items are in view; the `Slider` pattern drives `always`.
- **`Cluster`** — the inline axis. Wrapping rows: chips, button groups, metadata, logo strips.
  Same scale, capped at `stack`.

**Rules:**

1. **No hand-rolled `display: grid` / `display: flex` for arrangement.** If the primitives cannot
   express it, that is a conversation about the primitive, not a reason to write a local grid.
2. **Children never set their own outer spacing.** No margins, ever. The container owns the gap.
   A child with a margin breaks the primitive's only contract and the cause is invisible in the
   markup.
3. **Neither gap axis has a default, and that is deliberate.** An axis nobody states renders 0.
   A silent 24 looks plausible and hides an omission; a collapsed seam is wrong on sight.
4. **Non-uniform rhythm comes from NESTING, not from a rhythm knob.** Tighten by grouping, loosen
   by separating. A heading's spacing is a consequence of which `Layout` it lives in.
5. **Never override Section's content column or ground from outside.** No horizontal padding, no
   `max-width`, no background or colour via `className`. One band out of alignment with the
   others is a visible defect, and a hand-set background defeats the whole surface model.

## Tokens: three layers, and nothing outside them holds a value

The token system lives in `src/styles/tokens/` and is imported by `src/app/globals.css`. Read
`tokens/index.css` first — it states the rules and it is the only file you import.

| Layer | Where | What it holds |
|---|---|---|
| 1 · primitives | `primitives.css` | ramps and ladders. `--color-brandeis-500`, `--space-24`, `--font-size-h1`, `--line-height-h1`. Declared once, consumed through a usage token wherever one exists |
| 2 · usage | `primitives.css` | one curated answer per question. **`--gap-*` (9 steps)** and `--text-*` (20 roles). Surface-independent, therefore shared |
| 3 · components | `components/*.css` | what a value MEANS for one component. `--sec-ground`, `--btn-solid-primary-bg`. Re-declared once per surface |

**Colour has no usage layer, deliberately.** What a colour means depends entirely on the surface
— `brandeis-50` is a hover tint on paper and invisible on tint; blue as ink fails on ink and
lifts to 200. A shared `--color-bg-hover` would be wrong three times out of four. Components own
colour, per surface. That is the one asymmetry in the system and it is intentional.

### The gap scale is the only answer to "how far apart"

Nine steps, named for what they separate:

| Step | | Where it lands |
|---|---|---|
| `--gap-inline` | 4 | inside a key and its value |
| `--gap-tight` | 8 | icon to label, chip padding, a stat and its unit |
| `--gap-text` | 16 | paragraph to paragraph, cell padding on a dense table |
| `--gap-block` | 24 | head to body inside a block — the most used step |
| `--gap-gutter` | 32 | container gutter, and the gap between cards in a set |
| `--gap-stack` | 48 | block to block inside a section |
| `--gap-column` | 64 | column gutter between two **peer** halves that must read as separate, **and the row seam of a borderless card set (29 Sep 2026)** |
| `--gap-section` | 96 | section padding, tight — and a **split**: two regions of different kind side by side |
| `--gap-section-open` | 128 | section padding, open |

1. **Layout distance never comes from `--space-*`.** The space ramp exists so the gap scale can be
   built from it. A component may reach the ramp for an **optical correction** — a label's
   side-bearing margin, a ring offset — and must say so in a comment on the token, as
   `button.css` does.
2. **Peer or split — decide which before reaching for a column gap.** Two halves of the same kind
   (two lists, the sides of one contrast) are peers and take `column` (64). Two regions of different
   kind side by side — copy beside a form, copy beside an image, a head beside its body, a quote
   beside its case — are a split: two sections sharing a row, so they take `section` (96). The
   patterns that own a split (`PageHero` beside, `ContentSection` beside, `Reasons` beside, `CtaSection`, `Proof`)
   already set it; a template composing its own split states it the same way.
3. **A distance that is not one of these nine is a mistake or a new step.** Decide which. Do not
   split the difference.
4. **A step is chosen by what it separates, never by how it looks at one width.** The scale does
   not shift responsively — the *layout* changes at a breakpoint, the distance does not. Do not
   add a media query that swaps one step for another. One exception (owner, 7 Oct 2026): `Section`'s
   own vertical padding is one value per width — 96, 64 below 768 — and the page's first band
   takes 48 / 32 above its content below 1024, in `tokens/components/section.css` and nowhere else. It is the band's air against the screen, not a
   distance between two things. The same exception covers the gutter (16 below 768) and `Island`'s
   inset, the band's air in miniature: 48 from 768; below it 32 block and 24 inline, the form's island
   16 inline (owner, 5 Nov 2026; decisions/2026-11-05-island-inset-on-a-phone), in
   `tokens/components/island.css` and nowhere else.

`Layout` and `Cluster` take these names directly as `rowGap` / `colGap` values. Cluster caps at
`stack`: controls and chips stop at `block`, a strip of client marks is set at `stack`, and a
wrapping row has no use for a column or section beat.

### The other rules that matter day to day

1. **No stylesheet outside `tokens/` writes a hex, a raw distance or a font stack.**
   `npm run tokens:check` enforces five things: a `var()` that resolves to nothing; a literal
   **hex** outside the token layer; a raw `px`/`rem` **in a `*.module.css`** (`reset.css` and
   `globals.css` are the shell and carry argued literals); a component layer `tokens/index.css`
   never `@import`s; and **surface self-containment** (below). Know what it still does not see: a
   font stack, a colour written as `rgb()` / `hsl()` / a CSS keyword, and anything in a TSX inline
   style. Those are on you and on review. `npm run verify` runs it with the other four checks.
2. **Every surface block declares every surface-dependent token — not just the deltas from
   paper.** A block carrying only deltas is not self-contained: nest that surface inside a
   non-paper one and it inherits the enclosing surface's values for whatever it omitted. A tint
   panel inside an ink section rendered white ink on a light ground at 1.13:1, and the button in
   it lost its ghost label, its link and its focus ring. The surface blocks are repetitive on
   purpose. `tokens:check` fails the build if one drifts.
3. **A state token exists only if the value moves on at least one surface** — there is no
   `--btn-solid-*-fg-pressed`, because a solid button's label never changes on press. Once a
   token is in the set, every surface declares it, even where it equals that surface's own rest.
4. **Two registers for colour, and they do not mix.** A *surface* has a **ground** and an **ink**
   (`--sec-ground`, `--sec-link-ink`). A *control* has a **bg** and an **fg**
   (`--btn-ghost-neutral-fg`). Never `-fg` on a surface, never `-ink` on a control.
5. **Two vocabularies for steps.** A *distance* takes a gap-scale role name (`--gap-block`,
   `--sec-padding-y-first`). A *component size* takes a t-shirt name (`--btn-height-md`,
   `--lay-track-sm`). Distances are shared system-wide so they name the relationship; a size
   belongs to one component, so an ordinal is honest.
6. **A component never reads another component's tokens.** Shared values are primitives or usage
   tokens, or they are duplicated on purpose. And a token only one component could ever read,
   which merely renames a usage token, is not worth having — `--sec-gap` aliasing `--gap-block`
   was a second name for one distance and was deleted.
7. **Surface is declared with `data-surface="paper | tint | ink | blue"` on an ancestor** — a
   Section — never on the control itself. That is what lets a button three components deep get
   the right treatment without being told where it is. The one other surface declarer is `Island`
   (owner, 13 Oct 2026): a bounded ground inside a band whose surface is set per instance, so it
   declares its own `data-surface` exactly as a band does.
8. **Type is consumed as a composite:** `font: var(--text-h2)` plus
   `letter-spacing: var(--text-h2-tracking)`. Never restate a size or a ratio. Title roles
   re-declare themselves at 1023px and 767px, so a rule needs no breakpoint of its own for type.

   Size **and** line height are laddered by role — `--font-size-h2` pairs with
   `--line-height-h2`, and both carry `-t` / `-m` breakpoint steps. They are one typographic
   decision, so they are named and changed together; if you add a size, add its ratio in the
   same edit. Letter-spacing is the deliberate exception: tracking corrects an optical error at
   a size rather than marking a step, and one correction serves several roles, which is why h2,
   h3 and h4 share `--letter-spacing-title{,-tight,-fine}`.

   **Mono is always uppercase, and uppercase in presentation only.** Mono is the label voice —
   chrome, eyebrows, keys, control labels, stats — and its tracking is opened 0.08–0.12em as a
   correction for the side bearings of capitals, so set lower-case a mono role reads as
   letter-spaced body text rather than as a label. The case therefore belongs to the role, not to
   whichever component consumed it: every rule that sets a mono role writes
   `text-transform: var(--text-mono-case)` beside its `font:`, for the same reason tracking is a
   companion — `font:` carries no transform. One token rather than a `-case` per role, because
   tracking genuinely differs at 11, 12 and 13px and case does not; six names for one decision is
   the `--sec-gap` mistake.

   *In presentation only* is the load-bearing half. The transform is CSS and never the string: a
   prop, a CMS field and an `aria-label` all keep the capitalisation somebody authored, so pass
   "Read more", not "READ MORE". **A label that must stay sentence case is not a mono label —
   give it a sans role.** That is the resolution rather than an exception, and the system has
   exactly one exception: `--text-code`, where mono is content rather than a label and case is
   semantic (`Section` and `SECTION` are different identifiers). A numeral has no case, so on
   `--text-stat` the transform is a no-op on digits and normalises an alphabetic suffix.
9. **Adding a component layer:** copy the shape of `tokens/components/button.css` — geometry in
   `:root`, then one block per surface, **each declaring every surface-dependent token** (see rule
   2; deltas-only fails the build). Name the file for the component, not the abbreviation
   (`button.css` holds `--btn-*`). Name tokens
   `--{abbrev}-{variant}-{part}-{state}`, register the file in `tokens/index.css`, keep it to the
   one component. **Registering it is part of the same edit as creating it.** `tokens:check` now
   fails on an unregistered layer, but the reason it had to be taught to is worth knowing: it globs
   `tokens/**` for definitions, so an unregistered file still counts as *defined* — every `var()`
   reading it resolved in the check and resolved to nothing in the browser, with lint and tsc silent
   too. The file and its cascade position are one decision.

### Why component tokens live in `tokens/`, not beside the component

Asked and settled. They stay in `tokens/components/*.css` for one decisive reason: **`index.css`
guarantees cascade order**, and a component layer must come after the primitives and usage tokens
it reads. Colocating them as `Section.tokens.css` would hand that ordering to the bundler's
module graph, which is not something you control — and a component layer that loads before the
usage layer resolves to nothing, silently.

Two supporting reasons: surface remaps are `:root` / `[data-surface]` declarations, which are
global by nature and not what CSS Modules are for; and the token set is authored and delivered as
one portable folder, so splitting it means a new delivery can no longer be dropped in.

The cost is that `Section/` does not contain everything about Section. The naming convention
(`--sec-*` ↔ `Section`) and `tokens:check` cover the gap.

**`src/styles/reset.css` is not a token file and is not optional.** `box-sizing: border-box` is
required for `Section` to function at all, and zeroed heading margins are required for `Layout`'s
gaps to be the only spacing. It deliberately states no type and no colour — both come from the
tokens, applied in `globals.css`.

**Base element typography lives in `globals.css`** — five heading rules, links and code, mapping
bare elements onto the composites. It is a floor, not the answer: a `Heading` component with a
`size` prop is the right home, because a page routinely needs an h2-level element at h3 scale and
the element name should not decide the scale.

## Every component is a folder

```
src/components/Section/
├── Section.tsx
├── Section.module.css
└── index.ts
```

CSS Modules only — no Tailwind, no CSS-in-JS, no inline style objects for anything a class can
express. Runtime dependencies are `next`, `react`, `react-dom`, and adding a fourth needs a
reason. `src/lib/cx.ts` joins class names; it is three lines and needs no package.

Re-export from the tier barrel (`src/components/index.ts`) so call sites import
`@/components`, not a deep path.

## Nothing gets a page route before it has a `design/` route

`src/app/design/**` is the proving ground: one route per component, **every** arrangement
rendered. It holds `page.tsx` files only, with one exception: **`design/_specimen/`**, the harness
the specimens are built out of — `Specimen`, `Box` and their CSS. That is route-local scaffolding
for the proving ground itself, underscore-prefixed so Next does not route it, and nothing outside
`src/app/design/**` may import it. The rule it is an exception to still holds everywhere else: no
component the *site* could use is ever defined under `design/`. If something here starts looking
useful to a page, that is the signal to build it properly in `src/components/`.

This is the highest-leverage rule in the file. In the previous codebase the components that had
sandbox routes are in good shape and the 111 that did not are the reason for this rebuild.

Register the specimen in the `SPECIMENS` list in `src/app/design/page.tsx` by hand, so the index
stays honest about what is actually covered.

**A kind of section is not a component, and gets no `design/` route.** Each kind on the corpus pages
(hard parts, What you get, a method …) renders through ONE approved component, registered in
`src/templates/CorpusPage/kinds.ts`; a missing drawing is a placeholder inside it, never a fallback to an
older design (owner, 31 Oct 2026; decisions/2026-10-31-one-kind-one-component). A kind is reviewed on the
real pages listed under "Review list" in `npm run corpus:census`, not on a specimen (owner, 31 Oct 2026;
decisions/2026-10-31-kinds-approved-on-real-pages).

## Routes are named once

Every path lives in `src/lib/routes.ts`. Paths get referenced from nav, footers, breadcrumbs,
sitemaps, redirects and cross-links, so a literal written in each of those turns any URL decision
into a hunt. The previous codebase carried an unresolved `/work` vs `/case-studies` question with
a five-file blast radius for exactly this reason.

## Content: pages read the seam, never a source

```
src/content/
├── index.ts              the front door — pages and the root layout import THIS
├── types.ts              view models — the shapes a PAGE consumes
├── source.ts             getPage · listPages · getNavigation — the one source assignment
└── sources/
    ├── fixtures/         active — index.ts, navigation.ts
    └── strapi.ts         stub
```

**Pages import `@/content`. Nothing imports `@/content/sources/*` directly.** Switching the site
from fixtures to Strapi is one assignment in `source.ts`.

**Type against the view model, never against the CMS response.** If pages type against Strapi's
shape then every Strapi remodel is a change to every page. The mapping from CMS shape to view
model lives inside `sources/strapi.ts` and nowhere else — nothing above it learns that Strapi
exists.

Patterns and templates may not import `@/content` at all; they take what they render as props.
That is what lets one pattern serve a fixture today and a CMS response later.

## How a component gets made

**The owner decides; Claude executes.** Claude Code writes the spec, builds it, verifies it and shows
the result. The owner answers the questions only they can answer and approves what they see. Nothing in
this chain is done by hand that a script or Claude can do, and nothing waits on the owner except a
decision. (Changed 28 Sep 2026 from a workflow where the designer pasted a brief into Claude Design to
get a spec. That step was manual, and Claude Design cannot see this repo.)

**Most of the time the answer is that nothing new is needed.**
- The **Design System artifact** (https://claude.ai/artifact/Ait8sArmESntEWeu5zhryj) carries the real
  components as a live library — every primitive, pattern and template on `window.Tcules`, each previewed
  by its own `/design` specimen — so a page can be composed out of actual shipped components, correct on
  every surface and in every state, without anyone describing them.
- Reach for the steps below only when the thing genuinely does not exist. Establishing that it already
  does is the more valuable outcome, and the last codebase never reached it, 111 times over.

1. **Specify (Claude).**
   - Claude writes `docs/specs/<Component>.md` against the contract in `docs/component-spec-template.md`.
     The worked example is `docs/specs/Button.md`.
   - Inputs:
     - the component's entry in `docs/component-audit.md`;
     - the brand chapters in `docs/brand/`;
     - the generated vocabulary (`npm run design:brief`, whose vocabulary half is generated from the token
       layer at run time).
   - Never hand-copy a token name, a glyph name or a prop union into a document. A stale list is silent,
     and an invented name that happens to exist renders perfectly and is wrong forever.
   - Every question only the owner can answer goes in the spec's open-questions list, marked BLOCKING
     where it is.
2. **Decide (owner).** The owner answers the open questions. Only then does the spec leave `draft`.
3. **Build (Claude).** `/build-from-spec docs/specs/<Component>.md`. It gates rather than guesses, and it
   refuses to start on a spec still marked `draft` or carrying an unanswered BLOCKING question.
4. **Verify and show (Claude).**
   - Run `npm run verify`, then `npm run build && npm run aria:check`.
   - Run `/audit-component <Name>`, an independent read-only pass that reports and does not fix. Fix what
     it reports.
   - Run `npm run shots -- <specimen>`: each specimen block at 1440 and 390, horizontal overflow and page
     errors. The crops are for Claude's own check; the owner reviews the routes in the browser
     (owner, 9 Oct 2026; decisions/2026-10-09-no-screenshots-to-owner).
5. **Approve (owner), then ship (Claude).** On approval Claude opens the PR, and the owner merges.
6. **Sync.** When a component lands, `/ds-publish` regenerates the Design System artifact from `main`:
   `npm run ds:build` writes the bundle, React 19, the declarations, a README and preview per unit (the
   preview IS its `/design` specimen), `tokens.json` from the token layer, the conventions README, the
   vocabulary and the brand chapters; `ds:check` renders every preview headless; Claude publishes only
   what changed. **The repo is the source of truth** (owner, 20 Oct 2026; decisions/2026-10-20-ds-artifact-from-repo):
   a generated file edited on the artifact page is overwritten by the next sync. A unit with no specimen
   ships a floor card, so a missing specimen shows up in the library too. The old Claude Design project
   and the built-in `/design-sync` are retired; what the artifact held before is archived in the private
   repo `devagya-tc/tcules-design-archive`.

**Claude Design is optional.** It is for visual exploration when the owner wants it. It is not a step in
the chain. `docs/briefs/` is the record of what was asked for under the old workflow; `docs/briefs/README.md`
indexes it.

**`npm run verify`** chains seven checks: `lint`, `typecheck`, `tokens:check`, `classes:check`,
`specimens:check`, `design:check` and `photos:check` (the kit photo catalogue's measured tone tags,
derived widths and generated registry are current; `npm run photos:tone && npm run photos:derive`
refreshes them). Two more gates run separately:
- `npm run build && npm run aria:check` proves every ARIA idref in the rendered output resolves and that
  no id is duplicated. It needs a build.
- `npm run build && npm run kinds:check` proves every band on a corpus page renders through its kind's
  one approved component (`kinds.ts`) and that the copy's words reach the page; it lists the kinds still
  to design. It needs a build.
- `npm run shots` catches horizontal overflow and page errors. It needs a server.

None of it sees a child margin, a hand-rolled arrangement, a restated font size, a token name that
exists but is the wrong step, or whether the composition is any good. Those are the eye's job, the
screenshots are how the eye gets them without opening a browser, and the squint test below is the
standard.

## Rulings are logged, or they are lost

Every owner ruling is one file in `docs/decisions/`, and `docs/decisions/INDEX.md` indexes them by area
(generated and git-ignored: `npm run decisions` writes it, so does `verify`; run it first in a fresh worktree).
**Read the entries for an area before designing, building or reviewing in it.** A logged ruling is not
reopened by a spec, a critic or a reference. The owner overturns one with a new entry that `supersedes`
it, and the old entry is kept.

- **A ruling is valid once Devagya logs it.** Jatin has the final approval and gives it in feedback
  sessions; Devagya logs those on Jatin's behalf, and Devagya's own rulings too, which a later session with Jatin
  may supersede. Anyone else's idea is a proposal until then (owner, 22 Oct 2026;
  decisions/2026-10-22-rulings-valid-once-devagya-logs-them).
- **`/decide` logs a ruling in the same PR as the change that applies it**, the way `docs/TRACKER.md` is
  ticked. A ruling that exists only in a chat, a review note or agent memory is broken by the next session
  that never saw it, and memory is local to one machine.
- **Design and test before ruling.** A design rule is logged `status: proposed` until it has been designed,
  tested and seen by the owner. A proposal is context, never a rule, and stays out of the brand-framework
  backlog. The owner promotes it to `active` (owner, 22 Oct 2026; decisions/2026-10-22-test-before-ruling).
- **A ruling that changes the brand framework is logged `dbf_status: pending`.** `/dbf-update <chapter>`
  applies a chapter's backlog in one versioned edit; `/ds-publish` then carries it to the artifact. Chapters are
  batched, never edited ruling by ruling (owner, 19 Oct 2026).
- `npm run decisions` runs in `verify`: it fails on an invalid entry or a broken `supersedes`, only warns on a
  pending backlog, and rewrites the index. Generated files are never committed: a file every PR rewrites
  conflicts on every merge (owner, 22 Oct 2026; `docs/vocabulary.md` likewise, rebuilt by `ds:build`).

## The old repo

`../tcules-website` is reference for **specific, named things only** — never for patterns, never
for "how did we do this before". Reads of its polluted paths are denied in
`.claude/settings.json`: the 111 Tailwind sections, the old Header/Footer, `src/theme/*`,
`tailwind.config.ts`, the GraphQL layer, the Strapi types, `src/app/**`.

`Section`, `Layout` and `Cluster` were lifted from it and are the only things that were. Do not
port anything else without being asked — and if something there looks useful, **build it properly
here** rather than copying it across.

## Design quality

A layout that repeats one shape down the page is a failure even when every piece is correct.
Clean does not mean plain, and "not busy" is not an argument for "not designed".

- Visual weight comes from **scale, imagery and position** — not from decoration, borders, or a
  tinted background band.
- Vary the arrangement between blocks rather than the ground behind them.
- A secondary column that is only text is a missed opportunity; give every item a shape.
- **Clickable cards sit under their head.** A section of linked cards puts its eyebrow, heading and
  lead above them at full width, so the cards read as the heading's continuation — never a head track
  beside the grid. And it carries no decorative image: the cards are the band's shape. A photograph
  may sit beside items nobody clicks, with those items continuing under the heading in its column.
- **Never two horizontal media items side by side.** A picture beside its words takes a whole row, or the
  set uses the vertical card in a grid. `Layout` spans any child declaring `data-media-row` (owner,
  29 Oct 2026; decisions/2026-10-29-media-rows-take-a-whole-row).
- **Two tinted bands are never adjacent**, the close included: where two would meet, one drops to paper.
- **An icon heads its card.** Glyph, then title, then body, each on its own row — never the glyph
  inline beside the title. A tile led by its own drawing carries no glyph at all (owner, 19 Oct 2026;
  decisions/2026-10-19-drawn-tile-carries-no-icon). No ground exists only on hover, so no card
  carries an inset for one (owner, 19 Oct 2026; decisions/2026-10-19-no-hover-only-grounds).
- **Never two text-heavy bands back to back.** A band with no photograph and a body of words is
  followed by a visual one (a photograph, a diagram, marks, covers, an icon set). The ServicePage
  plan warns in development (`textHeavyPairs`, visual-direction § 1.7).
- **IRL photographs share one tone layer.** It is `--media-photo-grade`, read by every photograph
  Media renders; it ships `none` until the owner picks the treatment. Never grade one image locally.
- **Proof is a set, not a ranking.** Logos, case studies, testimonials and the platform rating are
  drawn on as the argument needs; none is numbered, ordered by strength, or billed as "top".
- **Before shipping a composition:** if you squint, does it read as more than one idea? If every
  block is the same rectangle at the same size, it is not finished.

## Global vs. local: decide before applying any UI change

Most requests are meant **globally**, for reuse. Before applying a visual or structural change,
decide whether it belongs to the component, a token, or this one instance — then say which, in
one line, before applying.

Ask: would every other instance want this same change? Does the component need a new prop,
variant or slot to take it cleanly — and would it be better for having one? Only a change that is
genuinely specific to one instance stays local.

When it is a genuine close call, say so and ask.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
