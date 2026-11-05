# Onboarding — tcules-website-2026

> The former in-app component previews have been retired. Use standalone previews and public-page checks as described in [CLAUDE.md](CLAUDE.md#component-previews). References to the old preview routes below describe the previous workflow.

Orientation, not law. `CLAUDE.md` is the law; it is long and you should read all of it before you
write anything. This file tells you what the repo *is*, what shape it has, how to get it running,
how work moves through it, and which file owns the detail for each rule — so when they disagree,
`CLAUDE.md` and the source win and this file is the thing that is wrong.

## 1. What this is

A clean rebuild of the Tcules marketing site. Next.js App Router, React, TypeScript, CSS Modules.
Three runtime dependencies: `next`, `react`, `react-dom`.

The previous codebase (`../tcules-website`) grew **111 bespoke Tailwind "section" folders** because
nothing in it stopped a block from importing whatever was nearest. A section could reach for a
pattern, a pattern could reach for the GraphQL layer, and a page could reach for all of it — so
every new page produced one-off components instead of reusing what existed, and almost none of them
had a sandbox route, which is why nobody could see they had drifted.

Every rule here exists to prevent one named failure, and most are mechanical rather than advisory:

| The failure | The mechanism |
|---|---|
| a block importing whatever is nearest | one-directional tier boundary, enforced by `eslint.config.mjs` |
| every component hand-rolling a grid | three layout primitives own every arrangement |
| a value living in nine places | three-layer token system; nothing outside `src/styles/tokens/` holds a value |
| a component nobody can see | nothing gets a page route before it has a `design/` route, and `specimens:check` fails the build if the index stops being honest |

**The rules are the product.** They will feel over-constrained in your first hour — you will want a
local flex row, or a `padding: 12px`, or a margin on a child. That constraint is the asset, and it
is deliberate. `../tcules-website` is reference for **specific, named things only** — never for
patterns, never for "how did we do this before". Several of its paths are `deny`-listed for reads in
`.claude/settings.json`.

## 2. Get it running

Prerequisites: **Node >= 20.11.1** (`engines` in `package.json`) and npm. Nothing else — no
database, no CMS, no env file. Content comes from fixtures.

```bash
npm ci
npm run dev          # http://localhost:3000
```

Go to **http://localhost:3000/design** first, not `/`. That is the proving ground: every component,
every arrangement, on every surface. It is the fastest way to learn the system and where you will
spend most of your build time.

Prove the clone is green before you touch anything:

```bash
npm run verify       # lint · typecheck · tokens:check · classes:check · specimens:check · design:check
```

All six pass on a clean tree. If one fails on a fresh clone that is a bug in the repo, not in your
machine — say so rather than working around it.

Other scripts: `npm run build`, `npm start`, `npm run format` (Prettier — single quotes, semicolons,
`printWidth: 96`, trailing commas). Path alias `@/*` → `./src/*`. TypeScript is `strict` plus
`noUncheckedIndexedAccess`.

**One expected diff you must not revert.** `next dev` writes and re-adds a marked block at the
bottom of `CLAUDE.md`, between `<!-- BEGIN:nextjs-agent-rules -->` and
`<!-- END:nextjs-agent-rules -->`. Removing it from a diff only re-creates the uncommitted change;
commit it with your work and the tree stays clean. Read what it says, too: this Next.js version has
breaking changes against most training data, and the guides in `node_modules/next/dist/docs/` are
the authority.

## 3. The shape of the codebase

```
app  →  templates  →  patterns  →  components  →  lib / styles
```

Imports flow one way only — **never upward, and never sideways within a tier.**

| Tier | Path | What lives there | Barrel |
|---|---|---|---|
| — | `src/app/**` | routes. Composition only: read content, pass props | — |
| 3 | `src/templates/**` | whole page-type layouts (article shape, service-page shape) | `src/templates/index.ts` |
| 2 | `src/patterns/**` | composed blocks — nav, footer, hero, card | `src/patterns/index.ts` |
| 1 | `src/components/**` | primitives, controls, marks | `src/components/index.ts` |
| — | `src/content/**` | the CMS seam, outside the ladder | `src/content/index.ts` |
| — | `src/lib/**`, `src/styles/**` | leaves; import nothing above them | — |

`src/content` sits *beside* the ladder, not in it. **Pages import `@/content`; nothing imports
`@/content/sources/*`.** Patterns and templates may not import it at all — they take what they render
as props, which is what lets one pattern serve a fixture today and a CMS response later. Switching
the site from fixtures to Strapi is one assignment in `src/content/source.ts`.

**`eslint.config.mjs` fails the build on a violation rather than leaving it to discipline.** Four
`no-restricted-imports` groups, one per tier, each with a message that explains the tier rather than
naming it. The sideways ban is enforced too, including the `../*` back door — `@/components/Icon` and
`../Icon` are the same import, and a rule naming only the alias is a rule about spelling. `./` is
untouched, which is what lets a barrel re-export its own folders. The idiom that replaces a sideways
import: `Button` never imports `Icon`, it takes a glyph as a `ReactNode` prop and the *caller*
composes. Read that file's header; it argues each rule.

```
src/
├── app/
│   ├── layout.tsx      the shell — reads getNavigation(), renders SiteNav / main / SiteFooter
│   ├── page.tsx        placeholder home
│   ├── globals.css     imports the token entry point, then the reset; base element type
│   └── design/         THE PROVING GROUND
│       ├── page.tsx    the hand-maintained SPECIMENS index
│       ├── _specimen/  the harness — the one sanctioned exception (§ 7)
│       └── {section,layout,cluster,button,icon,logo,typography,site-nav,site-footer}/page.tsx
├── components/         Section · Layout · Cluster · Button · Icon · Logo · Prose
├── patterns/           SiteNav · SiteFooter
├── templates/          index.ts only — empty
├── content/            index.ts (front door) · source.ts (THE SEAM) · types.ts (view models)
│   └── sources/        fixtures/ (active) · strapi.ts (stub)
├── lib/                routes.ts · activePath.ts · cx.ts
└── styles/
    ├── reset.css       not optional — Section and the primitives depend on it
    └── tokens/         index.css (the only file you import) · primitives.css (layers 1 AND 2,
                        there is no usage.css) · fonts.css · components/ (eight layers)
scripts/                tokens-check.mjs · classes-check.mjs · specimens-check.mjs ·
                        design-brief.mjs · aria-check.mjs
docs/                   component-spec-template.md · prompts/ (the spec brief) ·
                        specs/ (component specs land here, Button.md is the worked example)
```

Every path in the site is named once, in `src/lib/routes.ts` — `ROUTES` (flat, so
`RouteKey = keyof typeof ROUTES` is a usable union), plus `UNRESOLVED_ROUTE`, `UNRESOLVED_EXTERNAL`
and `ENDPOINTS`. `/case-studies` is the canonical work family and `/work` is not a route; that is
settled there rather than at a call site.

## 4. The three layout primitives

They express every arrangement in the site between them. Detail: `CLAUDE.md` § *Layout is done by
the primitives* and the JSDoc in each component, which is where the reasoning lives.

**`Section`** — the full-width band. Paints the ground, insets content to the shared content column,
owns the vertical air, and is the positioning context for full-bleed layers. Props: `as`
(`'section'`), `surface` (`'paper' | 'tint' | 'ink' | 'blue'`, default `paper`), `density`
(`'tight' | 'open'` against the standard band), `flush` (drops vertical air to 0, overrides
`density`), `className`, `children`, `id`. It emits `data-surface` even for `paper` — paper is the
`:root` default, so omitting it would leave a paper band nested inside an `ink` one inheriting dark
roles. Every value it uses comes from the `--sec-*` layer; the component contributes none.

**`Layout`** — the columnar axis. A vertical stack is the single-track case. Props: `as` (`'div'`),
`rowGap` / `colGap` (gap-scale names plus `'none'`), `columns` (a count `3`, fr weights `[2, 1]`, a
per-breakpoint object `{ base, md, lg, xl }`, or the content-driven `'fit'` / `'tile'`), `minTrack`
(`'xs' | 'sm' | 'md' | 'lg'`, default `md`), `equalRows`, `align`, `justifyItems`, `justify`,
`className`, `style`, `children`, `id`. A bare count or ratio applies from `md` up and collapses to
one track below; `'fit'` tracks absorb slack, `'tile'` tracks keep their width so `justify` has
something to distribute — which is the only arrangement where `justify` does anything at all.

**`Cluster`** — the inline axis. Wrapping rows: chips, button groups, metadata. Props: `as`
(`'div'`), `rowGap` / `colGap` (`'inline' | 'tight' | 'text' | 'block' | 'gutter' | 'stack'` — **capped at `stack`**, and
no `'none'`), `align` (default `center`), `justify` (default `start`), `nowrap`, `className`,
`style`, `children`, `id`.

The four rules that will bite you in the first hour:

1. **No hand-rolled `display: grid` / `display: flex` for arrangement.** If the primitives cannot
   express it, that is a conversation about the primitive, not a licence to write a local grid.
2. **Children never set their own outer spacing. No margins, ever.** The container owns the gap. A
   child margin stacks on top of `rowGap` and the cause is invisible in the markup. `Prose` is the
   one documented exception, and it argues for itself inside the component.
3. **Neither gap axis has a default, so an axis nobody states renders 0.** Deliberate: a silent 24
   looks plausible and hides an omission, a collapsed seam is wrong on sight.
4. **Non-uniform rhythm comes from NESTING, not from a rhythm knob.** Tighten by grouping, loosen by
   separating. A heading's spacing is a consequence of which `Layout` it lives in.

And one more, because it is the most tempting: **never override Section's content column or ground
from outside.** No horizontal padding, no `max-width`, no background or colour via `className`. One
band out of alignment with the others is a visible defect.

## 5. The token system in five minutes

Read `src/styles/tokens/index.css` first. It is the entry point, the only file you import, and its
header states the rules.

| Layer | File | Holds |
|---|---|---|
| 1 · primitives | `primitives.css` | ramps named for their value (`--color-brandeis-500`, `--space-24`) and ladders named for their role (`--font-size-h1`, `--line-height-h1`) |
| 2 · usage | **also `primitives.css`** | one curated answer per question — the 9 `--gap-*` steps and the 19 `--text-*` roles. Surface-independent, therefore shared |
| 3 · components | `components/*.css` | what a value MEANS for one component (`--sec-ground`, `--btn-solid-primary-bg`), re-declared once per surface |

There is no `usage.css` — do not go looking for it. The eight component layers are `section`,
`layout`, `icon`, `button`, `prose`, `logo`, `nav`, `footer`; their prefixes `--sec-`, `--lay-`,
`--icn-`, `--btn-`, `--prose-`, `--logo-`, `--nav-`, `--foot-` are taken.

**The gap scale is the only answer to "how far apart".**

| Step | px | Where it lands |
|---|---|---|
| `--gap-inline` | 4 | inside a key and its value |
| `--gap-tight` | 8 | icon to label, chip padding, a stat and its unit |
| `--gap-text` | 16 | paragraph to paragraph, cell padding on a dense table |
| `--gap-block` | 24 | head to body inside a block — the most used step |
| `--gap-gutter` | 32 | container gutter, and the gap between cards in a set |
| `--gap-stack` | 48 | block to block inside a section |
| `--gap-column` | 64 | column gutter where two halves must read as separate |
| `--gap-section` | 96 | section padding, tight |
| `--gap-section-open` | 128 | section padding, open |

`Layout` and `Cluster` take these names directly. Layout distance never comes from `--space-*` — the
ramp exists so the scale can be built from it, and a component reaches it only for an **optical
correction**, with a comment on the token saying so. A distance that is not one of the nine is a
mistake or a new step: decide which. The scale does not shift responsively — the *layout* changes at
a breakpoint, the distance does not.

**Type is consumed as a composite.**

```css
font: var(--text-h2);
letter-spacing: var(--text-h2-tracking);
```

Never restate a size, a weight, a ratio or a family — all four are inside the composite. **19 roles
exist; 12 carry a `-tracking` companion and 7 do not**, so pairing tracking with a role from the
second group names a token that does not exist. Size and line height are laddered together by role
and re-declare themselves at 1023px and 767px, so a rule needs no breakpoint of its own for type. If
you add a size, add its ratio in the same edit.

**Colour has no usage layer, deliberately.** What a colour means depends entirely on the surface:
`brandeis-50` is a hover tint on paper and invisible on tint; blue as ink fails on ink and lifts to
200. A shared `--color-bg-hover` would be wrong three times out of four. **Components own colour,
per surface.** That is the one asymmetry in the system and it is intentional.

Two registers that never mix: a *surface* has a **ground** and an **ink** (`--sec-ground`,
`--sec-ink`, `--sec-link-ink`); a *control* has a **bg** and an **fg** (`--btn-solid-primary-bg`,
`--btn-ghost-neutral-fg`). Never `-fg` on a surface, never `-ink` on a control.

**Four surfaces, and every block self-contained.**

| Surface | Ground | Character |
|---|---|---|
| `paper` | `--color-paper` | the default and the origin; `:root` |
| `tint` | `--color-paper-deep` | alternating bands, quote blocks, table headers |
| `ink` | `--color-neutral-950` | the footer and the closing panel |
| `blue` | `--color-brandeis-500` | a pivot — one appearance per page, never adjacent to `ink` |

Surface is declared with `data-surface="paper | tint | ink | blue"` **on an ancestor** — a Section, a
panel, a footer — never on the control itself. That is what lets a button three components deep get
the right treatment without being told where it is.

**Every surface block declares every surface-dependent token — not just the deltas from paper.** A
delta-only block is not self-contained: nest that surface inside a non-paper one and it inherits the
*enclosing* surface's values for whatever it omitted. This is measured history, not theory. A tint
panel inside an ink section rendered **white ink on a light ground at 1.13:1**, and the button in it
came out at ghost-neutral 1.13:1, link-primary 2.09:1, and a focus ring at 2.09:1 against its own
gap. Nothing in CSS complains, which is exactly why `tokens:check` checks it. **The surface blocks
are repetitive on purpose.** Two layers legitimately have none and both argue it: `icon.css` (every
glyph is `currentColor`, so four identical blocks would assert a variation that does not exist) and
`layout.css` (track widths are geometry).

`src/styles/reset.css` is not hygiene and is not optional: `box-sizing: border-box` is required for
`Section` to work at all, and zeroed heading margins are required for the primitives' gaps to be the
only spacing. Base element typography lives in `src/app/globals.css` — a floor, not the answer. And
component tokens live in `tokens/`, not beside their component, because `index.css` guarantees
cascade order — argued in `CLAUDE.md`, worth reading once.

## 6. What exists today

Tier 1 — `src/components/**`, all exported from `@/components`:

| Component | Design route | What it is |
|---|---|---|
| `Section` | `/design/section` | the band — ground, content column, vertical rhythm |
| `Layout` | `/design/layout` | the columnar axis — tracks and the two seams |
| `Cluster` | `/design/cluster` | the inline axis — wrapping rows |
| `Button` | `/design/button` | the first control — 3 emphases × 2 tones, 3 sizes, 4 surfaces |
| `Icon` | `/design/icon` | the glyph set, 4 size roles, `currentColor` |
| `Logo` | `/design/logo` | the wordmark — a *mark*, not an Icon: its own aspect ratio, and one element painted from a token rather than inherited |
| `Prose` | `/design/typography` | the rich-text flow, and the one documented exception to the no-margins rule |

The glyph set is **17 solid glyphs**, filled in `currentColor` with counters cut through the mass
(`fill-rule: evenodd`) so they show whatever is behind them. **There is no stroke, and no
stroke-width token at any layer** — the set was stroke-only once and is not any more, and a glyph
described as two crossing lines renders nothing. `iconNames` exports the list; `npm run design:brief`
prints it.

Tier 2 — `src/patterns/**`, exported from `@/patterns`:

| Pattern | Design route | Notes |
|---|---|---|
| `SiteNav` | `/design/site-nav` | `'use client'` — sticky bar, one mega-menu panel per item that has one, a drawer below 1024. Data-blind but not route-blind: it reads `usePathname()` |
| `SiteFooter` | `/design/site-footer` | a server component on purpose — no state, no URL read, so it ships no client bundle |

Plus `/design/typography`, a Foundations specimen covering every `--text-*` role, the ladders under
them, and the Prose flow.

**Tier 3 is empty.** `src/templates/index.ts` is a doc comment and `export {}`. The `/design` index
lists Templates as "None yet." Nothing has needed a page-type layout yet; the first real page will
be the thing that decides its shape.

## 7. The proving ground

`src/app/design/**` is where a component is proved before anything is allowed to use it: one route
per component, **every** arrangement rendered, and for anything surface-dependent, on all four
surfaces. Hover, pressed and focus cannot be printed in a column, so a specimen has to be exercised
by hand on each of the four grounds.

**Nothing gets a page route before it has a `design/` route.** `CLAUDE.md` calls this the
highest-leverage rule in the file, and the evidence is the last codebase: the components that had
sandbox routes are in good shape, and the 111 that did not are the reason for this rebuild.

The route holds `page.tsx` files only, with **one sanctioned exception**: `src/app/design/_specimen/`
holds the harness the specimens are built out of — `Specimen`, `Box` and their CSS. Route-local
scaffolding for the proving ground itself, underscore-prefixed so Next does not route it, and nothing
outside `src/app/design/**` may import it. The rule it excepts still holds everywhere else: no
component the *site* could use is ever defined under `design/`. If something there starts looking
useful to a page, that is the signal to build it properly in `src/components/`.

Register the specimen in the `SPECIMENS` list in `src/app/design/page.tsx` by hand, so the index
stays honest about coverage. **`npm run specimens:check` now enforces that**, three ways: every
folder in `src/{components,patterns,templates}` appears as a `SPECIMENS` name; every `SPECIMENS`
href resolves to a real `page.tsx`; and every non-underscore directory under `src/app/design` is
linked from the index. It matches on `name`, not on a kebab-cased href — `Prose` is registered
against `/design/typography` on purpose, and a check demanding `/design/<folder>` would fail on a
decision the repo made deliberately.

## 8. How a component gets made here

Two surfaces, because they are good at different things. **Claude Design** writes the spec; **Claude
Code** in this repo builds it. The seam between them is a file in `docs/specs/`.

**Before any of that: check whether you need a new component at all.** `/ds-publish` bundles every
primitive, pattern and template onto `window.Tcules` and publishes them to the Design System artifact
with `.design-sync/conventions.md` as its README, so a page can be *composed* from actual shipped
code rather than from a description of it. That is the default path and it is strictly better where
it applies — the components in a mockup built that way are the real ones, so their surfaces, states
and props are correct by construction. The spec workflow below is for the case the library cannot
answer: something that does not exist yet.

Note the division of labour in what each side carries. `conventions.md` tells a *composer* how to
use the system and deliberately contains no colour ramps, no hex values and no contrast guidance — a
composer never needs them. `npm run design:brief` carries exactly those, because you cannot specify
a new component's per-surface colour table without them.

**(a) Specify — in Claude Design.**

```bash
npm run design:brief          # prints the brief; copy all of it
```

That prints the brief with an empty `BRIEF` block for you to fill in, which is the general path.

**For the eighteen components the content audit identified, skip it — the document is already
written.** Open `docs/briefs/<NN>-<component>.md`, select all of it, paste. Thirteen are pasteable;
`01`–`04` and `18` deliberately carry no brief block, because four are already answered by shipped
code and one is parked on content work. `docs/briefs/README.md` indexes all eighteen and gives the
order to run them in.

The token vocabulary is not inside those files. It sits once in the Claude Design project as a
guidelines document — `docs/vocabulary.md`, generated by
`node scripts/design-brief.mjs --vocabulary` and pushed to the project. Nothing checks that the
pushed copy is current, so after a token rename it has to be regenerated and pushed again.

What comes back is a spec, written to `docs/specs/<Component>.md`.

`docs/component-spec-template.md` is the spec contract: what a spec must say before it is buildable.
Read it before writing one. `docs/guides/designer-workflow.md` is the same workflow written for the
person doing the designing — step by step, with who owns each step — and is what to hand a new
designer.

**(b) Build — in Claude Code, in this repo.**

```
/build-from-spec docs/specs/<Component>.md
```

It works through the build in gates and **stops rather than guessing**. A spec that is ambiguous
about a token, a state or a surface produces a question, not an invention — which is the point: an
invented value that happens to resolve is the failure mode the whole system is built against.

**(c) Audit — independently.**

```
/audit-component <Name>
```

An independent read-only pass over a component that already exists. Read-only by design: an auditor
that can fix what it finds stops reporting and starts negotiating.
(`.claude/commands/build-from-spec.md` and `.claude/skills/audit-component/SKILL.md` are the
definitions.)

**The file-change checklist. Five files created:**

| # | File | What goes in it |
|---|---|---|
| 1 | `src/components/<C>/<C>.tsx` | the component and its exported prop types. Structure, and which token each state reads — **no values** |
| 2 | `src/components/<C>/<C>.module.css` | structure only. Reads the component layer; states no colour, distance, radius, duration or easing of its own |
| 3 | `src/components/<C>/index.ts` | the folder's export |
| 4 | `src/styles/tokens/components/<c>.css` | geometry in `:root`, then **one block per surface**, every block declaring every surface-dependent token |
| 5 | `src/app/design/<c>/page.tsx` | the specimen: every arrangement, all four surfaces |

**Three files always edited:**

| # | File | The edit | Fails how |
|---|---|---|---|
| 6 | `src/components/index.ts` | re-export from the tier barrel | loudly — nothing can import it |
| 7 | `src/styles/tokens/index.css` | `@import "components/<c>.css";` | **silently** — see below |
| 8 | `src/app/design/page.tsx` | add the `SPECIMENS` entry | **silently** — see below |

The two silent ones are worth understanding rather than memorising.

**The missing `@import`.** A component layer that `tokens/index.css` never imports does not load in
the browser — and used to be invisible to `tokens:check` as well, because definitions are collected
by globbing the folder. So every `var()` reading it passed the check and resolved to nothing at run
time, lint and tsc saw nothing, and the symptom was an unpainted control that looked like a CSS bug.
Cascade order is the entire reason these files live in `tokens/` rather than beside the component;
an unregistered file has no order at all. **`tokens:check` now catches this.**

**The missing `SPECIMENS` entry.** The component works, the index just quietly stops describing the
system — which is precisely how the last codebase ended up with 111 sections nobody could see.
**`specimens:check` now catches this.**

Copy the shape of `tokens/components/button.css` for the token layer, and name tokens
`--{abbrev}-{variant}-{part}-{state}`. A component **never** reads another component's tokens: the
button sizes its glyph with its own icon-size token, not the icon layer's.

## 9. Verify before you commit

```bash
npm run verify
```

| Check | What it actually catches |
|---|---|
| `lint` | `eslint .` — the four tier rules (upward *and* sideways, including `../*`), plus Next's core-web-vitals and TS rules |
| `typecheck` | `tsc --noEmit` under `strict` + `noUncheckedIndexedAccess` |
| `tokens:check` | five things: a `var()` in a consumer stylesheet that no token defines and the file does not declare locally; a literal hex colour in a consumer; a raw `px`/`rem` in a `*.module.css` (module files only — `reset.css` and `globals.css` are the shell and carry argued literals); a component layer `index.css` never `@import`s; and surface self-containment across every component layer |
| `classes:check` | every statically-read CSS Module class is defined. `styles.foo` with no `.foo` is `undefined`, `cx()` drops it, and the element renders unstyled with nothing complaining — it follows the one indirection through `_specimen/Specimen`, because that is where the bug actually happened. Computed access (`styles[size]`) cannot be resolved statically and is skipped |
| `specimens:check` | the three registration assertions in § 7 |
| `design:check` | `design-brief.mjs --check` — every backticked token name in `docs/**/*.md` or a root `*.md` resolves in the token layer, for the primitive families it knows (`--color-`, `--gap-`, `--text-`, `--space-`, `--font-`, and the rest); component-prefixed names and marked NEW TOKEN REQUESTs are skipped. A token name in a doc is a promise to a designer who cannot read the repo |

One more check exists but is deliberately outside `verify`, because it needs a build:

```bash
npm run build && npm run aria:check
```

`aria:check` follows every `aria-controls` / `aria-labelledby` / `aria-describedby` / `aria-owns` /
`for` in the prerendered HTML and fails on any that names an id no element carries — and on any id
that appears twice, because an idref naming a duplicated id still "resolves", to whichever element
came first. Run it after anything
interactive. It exists because that defect class survives everything else: a rehearsal build of a
spec'd component shipped 95 dangling `aria-controls` on one specimen page — the panel was
conditionally rendered and the attribute was not — with lint, typecheck, tokens:check and
`next build` all clean. `SiteNav` is the precedent for getting it right:
`aria-controls={isOpen ? panelId(item.key) : undefined}`.

Know the holes. **No check catches any of these:**

| Not caught | Why it matters |
|---|---|
| a margin on a child | the primitive's only contract, and the symptom looks like a gap bug |
| a hand-rolled `display: flex` / `grid` used for arrangement | it computes fine; it just is not the system |
| a class read through a computed key (`styles[size]`) that does not exist | `classes:check` resolves static access only; no static analysis can resolve a key built from a prop |
| a restated font size, weight or ratio | rebuilding a composite by hand is how a control ends up with no line-height and inherits body's |
| a plausible-but-wrong token that happens to exist | `--color-neutral-800` where 700 was meant resolves perfectly and is wrong forever |
| a non-hex colour, or a `var()` written inside TSX | only `#` literals are flagged, and consumers are stylesheets only |
| the contrast numbers in the comments | human-maintained; nothing measures them |
| a dangling ARIA idref | caught by `aria:check`, but only after a build, and it is not in `verify` |
| whether the composition is any good | see below |

The cover for those is your eye and `/audit-component`. And on the last row, `CLAUDE.md` § *Design
quality* is explicit: a layout that repeats one shape down the page is a failure even when every
piece is correct. Visual weight comes from scale, imagery and position — not from decoration,
borders or a tinted band. Vary the *arrangement* between blocks rather than the ground behind them.
Squint at it: does it read as more than one idea?

Run `npm run format` before you commit, too. Prettier is not in `verify`.

## 10. Where to read next

1. **`CLAUDE.md`** — first, and in full. It is the law and everything above is a pointer into it.
2. **`src/styles/tokens/index.css`** — the token rules, argued. Read the header before any CSS.
3. **`eslint.config.mjs`** — the tier boundary, with the reasoning for each rule in the header.
4. **The reference implementation, and the thing to imitate:** `src/components/Button/**` +
   `src/styles/tokens/components/button.css` + `src/app/design/button/page.tsx`. Between them they
   show the whole shape — a component holding no values, a token layer with four self-contained
   surface blocks carrying their measured contrast, and a specimen rendering every state on every
   ground. Read `Button.module.css` closely: its rule order is load-bearing (sizes before `.link`,
   hover before pressed — equal-specificity pairs decided by source order).
5. **`docs/`** — `prompts/component-spec-brief.md` (the prose half of the design brief),
   `component-spec-template.md` (the spec contract), `specs/` (where specs land).
6. **`scripts/*.mjs`** — each header argues why the script exists and, more usefully, names what it
   does *not* cover.

## 11. House style, briefly

- **Comment density is a feature here.** Every file header says what the file is for and what it
  refuses to do, and a value that was *measured* says what it was measured against — a colour token
  whose value is a floor rather than a preference carries its contrast ratio in a comment on the
  line. Preserve those numbers when you touch a value, and add one when you set a measured value. A
  comment that merely restates the code is still noise; the ones that earn their place record a
  decision or a measurement.
- **Runtime dependencies are `next`, `react` and `react-dom`.** A fourth needs a reason. The previous
  codebase reached for a package per problem, and most of those problems do not exist without
  Tailwind.
- **CSS Modules only** — no Tailwind, no CSS-in-JS, no inline `style` objects for anything a class can
  express. `Layout`'s column custom properties are the one *sanctioned* exception, because an
  arbitrary track count has no finite set of classes. Note that `src/app/design/cluster/page.tsx`
  currently carries four inline `fontSize` objects to demonstrate `align="baseline"` with mismatched
  type — a restated size outside the `--text-*` composites, in a specimen, which nothing catches
  because `tokens:check` reads stylesheets only. It wants a `.big`/`.small` pair in
  `_specimen/specimen.module.css` reading real roles.
- **`src/lib/cx.ts` joins class names.** One `filter(Boolean).join(' ')`. No `clsx`, no
  `tailwind-merge`: CSS Module class names are unique and never compete, so there is nothing to
  resolve.
- **Decide global vs. local before you apply a UI change, and say which in one line.** Most requests
  are meant globally, for reuse: ask whether every other instance would want the same change, and
  whether the component needs a new prop, variant or slot to take it cleanly. Only a genuinely
  instance-specific change stays local. When it is a close call, say so and ask.
