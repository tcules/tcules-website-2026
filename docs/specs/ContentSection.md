# ContentSection

## 0 · Front matter

| | |
|---|---|
| **Component** | `ContentSection` |
| **Tier** | 2 pattern (`src/patterns/ContentSection/`) |
| **Status** | approved — the `beside` arrangement implements ruling **O2** (`docs/phase-2-decisions.md`: head beside body is *static, not sticky, head 1 : body 2, from 1024 up*). No BLOCKING question is open (§17). |
| **Token prefix** | `--csec-*` |
| **File** | `tokens/components/content-section.css` |
| **Designer / date** | Claude Code · 28 Sep 2026 (Phase 2 task 2.13) · **amended 29 Sep 2026 (tracker 2.17): the body measure** · **1 Oct 2026: the split seam (96), and `beside` reads down** · **5 Oct 2026 (`fdn-spacing`, S1): one head rhythm at 24** · **6 Oct 2026 (`fdn-section-head`): `align`, `aside`, `actions`, `footer`, `split-head`, `media`** · **7 Oct 2026 (owner): `split-head` removed** |
| **Implements** | `docs/briefs/07-content-section.md` (the band every long page is made of) · `docs/component-audit.md` §3 ContentSection: *"Extend. Add a head arrangement: head beside body ([1,2] from lg), as well as head above."* · ruling O2 |
| **Implemented at** | `src/patterns/ContentSection/` · `src/styles/tokens/components/content-section.css` · specimen `src/app/design/content-section/page.tsx` · the foot it is usually handed: `src/patterns/CtaRow/` (`docs/specs/CtaRow.md`) |

This spec is written **after** the component, not before it. `ContentSection` shipped without one
(brief 07 was never pasted into Claude Design; the component was built directly to fix the flat
`rowGap="stack"` composition every long-form route used). It records today's behaviour and the one
extension Phase 2 adds: the `arrangement` prop, `stacked | beside`.

**Nothing new is needed beyond one prop.** The audit's §4 composition table routes five jobs through
this component — Situation, Capability set, Mechanism, Related content, Rich explanation — and the
thing that stops those five reading as one repeated shape is an arrangement, not a new pattern. The
`beside` arrangement is one `Layout`'s props. It added no token, no module class, no state and no ARIA
(2.17 later added `--csec-body-measure` and the `ContentSectionText` class, for the body measure).

> **Amendment · 29 Sep 2026 · tracker 2.17 (visual overhaul) — text reads at the body measure.**
> Owner-approved. Prose has no measure by ruling — *the caller owns the reading column*
> (`Prose.module.css`, and the memory note "Prose has no measure"). For every service, expertise,
> audit, tool, glossary and how-we-work band **ContentSection is that caller**, and before this it
> stated no width: a rich-text block ran the whole track, **150 characters a line** in `stacked` (the
> 1240 column) and **112** in `beside` (the 784 two-thirds track), measured at 1440.
>
> The fix is a second export, **`ContentSectionText`**: a `div` whose only declaration is
> `max-inline-size: var(--csec-body-measure)` (→ `--measure-body`, 68ch = 666px at the body
> composite). A route wraps its `case 'rich-text'` in it; every other block — card grid, table,
> figure, list ladder, Proof, Callout — stays a direct child and keeps the full track. Measured
> after: **95 characters a line in both arrangements** (666px), the table and card grid still 1240
> stacked and 784 beside.
>
> *Why a slot and not a rule on the band.* The band takes arbitrary children, and routes pass them
> through keyed `Fragment`s from a block switch, so the band cannot honestly tell text from a grid:
> `child.type === Prose` fails on the first Fragment, and capping every child re-creates the exact
> failure the ruling removed from Prose (a five-column table crushed into a reading column). The one
> place that knows a block is rich text is the route's switch, so the mark goes there. Not a
> `measure` prop on the band either: bodies mix text and grids, and a band-wide cap cannot.
>
> *Known limit, not fixed here.* `ch` is the width of a zero, wider than an average letter, so 68ch
> of this face is ~95 characters, not ~68. That is `--measure-body`'s calibration and it is shared
> with `CtaSection`, `Callout` and `Proof`; retuning it is a system token decision, out of scope.


> **Amendment · 5 Oct 2026 · `fdn-spacing` (visual-direction § 1.1, S1) — one head rhythm.**
> The eyebrow → heading seam moves from `--gap-tight` (8), in a nested `Layout`, to `--gap-block`
> (24), flat: one `rowGap="block"` `Layout` holds eyebrow, heading and lead. Ink gap after: ~16 →
> ~32. Every section head in the kit (`PageHero`, `CtaSection`, this one) now carries one rhythm,
> **eyebrow → title 24, title → lead 24**, and neither of the other two changes. Nothing is tighter
> than it was, which the owner's "eyebrow too close" note (1 Oct review) requires. The hierarchy
> between the eyebrow and the lead comes from scale — a 12px mono label against a 20px lead — not
> from a second gap. § 1, § 7, § 10, § 12 and the appendix below are amended in place.
> visual-direction.md wins over this spec where they still differ.

> **Amendment · 6 Oct 2026 · `fdn-section-head` (visual-direction § 1.4, § 3.2, § 3.4, § 3.5, § 3.7,
> § 7.1, § 11 item 5) — the head axes and two arrangements.** visual-direction.md is the decided
> direction and wins over this spec; there was no owner step. What was added:
>
> - **`align: 'start' | 'center'`** (§ 3.5). Centred: eyebrow, heading and lead centred (each on its
>   own measure, `text-align: center` inside it, the parts centred by the head Layout's
>   `justifyItems`); the body centred AS A BLOCK — the body Layout centres each row and `.bodyCentred`
>   gives every row the column as its width, so a card set still spans 1240 while a capped row
>   (ContentSectionText around an Accordion, a centred CtaRow) sits in the middle at its cap. Text
>   inside the blocks stays start-aligned. A centred head is always stacked and never takes `actions`
>   or `aside` — the union makes each a type error.
> - **`actions: ReactNode`** — the head's own action row, a `stack` (48) under the lead, in practice a
>   `CtaRow rule={false}`. Stacked: under the lead. `beside`: in the head track (H-beside-actions).
>   `split-head`: under the lead in the trailing track (H-row). `media`: under the lead in the copy
>   column.
> - **`aside: ReactNode`** — `beside` only: the head track's one large object, a `stack` under the head
>   text — a 3:2 photograph (`<Media ratio="3/2" sizes={HEAD_TRACK} />`) or one stat figure. **An
>   aside or actions, never both** (§ 1.4 rule 6): the union pins the other to `never`. Below 1024 the
>   aside sits between the head and the body (§ 3.7 item 4), which DOM order gives for free.
> - **`footer: ReactNode`** — the band's foot, in practice one `CtaRow`: the body's last row, a
>   `stack` under the blocks, in every arrangement (pinned to the photo's bottom edge in `media` when
>   blocks sit above it). **A footer alone is not a trailing half** (fix round): `beside` with a
>   footer and no blocks degrades to `stacked`, the footer a stack under the head. Split, it put a
>   lone CtaRow level with the eyebrow over an empty two-thirds track, which no § 3.4 archetype
>   sanctions.
> - **A degraded `beside` drops its `aside`** (fix round). The aside belongs to the head track, and a
>   degraded band has none: set full column at 1240 a 3:2 photo is ~827 tall (past the fold alone),
>   and the `HEAD_TRACK` sizes it was placed at serve a 381-wide file, upscaled.
> - **`arrangement="split-head"`** (the H-row, § 1.4) — *removed 7 Oct 2026, see the last amendment.* The eyebrow keeps its own row; under it the
>   heading sits in the leading third and the lead (and actions) in the trailing two-thirds, [1, 2]
>   from 1024 at `section` (96), **top-aligned**; the body runs the full column beneath at `stack`.
>   Below 1024 every seam is the stacked head's. With no heading, or with neither lead nor actions, it
>   degrades to stacked. *Built differently from § 1.4's "eyebrow + h2 in 381":* with the eyebrow
>   inside the leading track, top alignment floats the 20px lead beside the 12px eyebrow and bottom
>   alignment drops the heading below the lead's first line (the trailing track, lead + 48 + action,
>   is the taller one). Measured at 1440; the H-row head is 14 + 24 + max(94, 128) = **166** (was
>   156), and C-image-3 with an H-row is 595, under the 598 target. Recorded in visual-direction § 1.4.
> - **`arrangement="media"` + `media: { image, side? }`** (the B split, § 3.2, § 3.4). A photograph in
>   5 of [5, 7] beside a FLAT copy column (head text, actions, blocks, footer), 96 apart. The crop is
>   the arrangement's: **4:5 from 1024 and 4:3 below it** (§ 3.7 item 4), through Media's new
>   `{ base, lg }` ratio, at `MEDIA_SPLIT` (`src/lib/image-sizes.ts`). `side: 'end'` is Layout
>   `reverse={{ lg: true }}` — the photo stays first in the DOM (above the copy on a phone). **When
>   blocks sit above a footer** the row stretches and `pinLast` pins the footer to the photo's bottom
>   edge, so copy and photo share a top and a bottom edge (§ 3.2 rule 1); otherwise the copy is
>   centred on the photo (rule 2). *Fix round:* a copy column with NO blocks (head + footer, or head +
>   actions) is centred too — pinning it left 350–400 of empty column between the lead and the action
>   at 1440, and § 3.4 B always carries tiles. Recorded in visual-direction § 3.2. The photo
>   sits in a plain `div` so a stretched row never stretches the `<img>` out of its ratio.
> - **The lead under a split `beside` steps to `--text-body-lg`** from 1024 (§ 7.1), via
>   `--csec-lead-text-beside` and `.leadBeside` — the module's one `@media`, which swaps a role, never
>   a distance. A degraded beside band never takes it.
> - **`data-arrangement`** is emitted on the Section (the requested arrangement), for the gates.
> - **What goes in a `beside` body** is restated from § 1.4 rule 5: rows, an accordion, a record, two
>   pair cards, or icon cards — never a 3-up card set or a 2 × 2 image grid. The specimen no longer puts
>   a card set in any beside body.
> - **Stale measures corrected:** `--measure-title` is 32ch (816px at 1440), `--measure-lead` 56ch and
>   `--measure-body` 75ch (734px at 1440, about 100 characters a line). § 6, § 10 and § 12 below are
>   corrected in place; the 2.17 amendment above keeps the 68ch it was written against, as history.
>
> The props are now a five-member union discriminated on WHICH SLOTS are filled (plain, centred,
> withActions, withAside, media), so a template passing a union-typed `'stacked' | 'beside'` with no
> head slots matches one member outright. § 3, § 4, § 14 and § 15 below are amended in place; where the
> older prose still says "two arrangements", this amendment wins.

> **6 Oct 2026 — `fdn-section-head`, second fix round.**
> - **A footer under no blocks takes `rule={false}`.** The footer-only `beside` band (degraded to
>   stacked) and the no-blocks `media` band kept the CtaRow hairline 48 under the lead, with no body
>   above it to close — CtaRow's own `rule` doc calls that an underline on the lead. The band cannot
>   reach into the node it is handed (a pattern does not import a pattern or read its classes), so the
>   `footer` doc tells the caller, and both specimens pass it.
> - **`media.pin?: boolean`** (default `true`). `false` centres a copy column that would otherwise
>   pin its footer under blocks (§ 3.2 rule 1 → rule 2's alignment). Added so the owner can compare the
>   pinned B (2 tiles + CtaRow leaves ~180 of empty column between the tiles and the rule at 1440) with
>   a centred one before `cmp-media-split` builds on it: open question 7.
> - **The stat aside is specimened.** § 3.3 lets the `beside` aside be a photograph or one
>   `--text-stat-lg` figure (D always has one); every aside specimen was a photograph. Two D bands now
>   carry one `Proof` figure as the aside, one at ordinary copy and one at the § 1.5 ceiling (6-word
>   h2, 18-word lead, 12-word stat label, a six-character value). Finding, measured at 1440:
>   Proof's figure tile is narrower than the 381 track, so the 12-word label sets on 3 lines, not
>   § 1.4's 2, and Proof adds its "checked on" line, which § 1.4's 114 omits: the aside is 123 at
>   ordinary copy and 136 at the ceiling. The ceiling band is 664 and fits. Recorded for Proof's owner
>   (`cmp-testimonials`) and for § 1.4's stat-aside row.
> - **Stress rows say which kind of stress they are.** A row at the § 1.5 ceiling must fit the fold
>   (media at the B ceiling: 10-word h2, 18-word lead, 2 tiles + CtaRow, 788 at 1440). A row with CMS
>   stress copy (a 45-word lead, past every head budget) is wrapped in `data-fold-exempt` with the
>   reason, per visual-direction § 1.3. The old media stress row put 4 tiles and a CtaRow under H-full,
>   which § 1.4 rule 9 forbids; it now carries 2 tiles.
> - **Specimen label § 14** no longer says head actions pin: only blocks + footer pins
>   (`pinFooter = hasBlocks && hasFooter && media.pin !== false`); head actions sit a stack under the
>   lead and the column is centred.

> **1 Oct 2026 — split gap.** Two regions of different kind side by side are a *split* and take `--gap-section` (96), not `--gap-column` (64), which is now for peer halves only (CLAUDE.md § gap scale, rule 2). Owner, 1 Oct: "64px is fine but 96px … gives it just a bit more breathing space."

## 1 · Identity

`ContentSection` is **one CMS section as one band**: an optional eyebrow, one optional `h2`, an
optional lead, then the blocks the caller hands it as children. It exists for the rhythm — the head
is one group at 24 (eyebrow → heading → lead, S1, 5 Oct 2026) so it reads as one object, and the
blocks are a separate 48 beat beneath it (or, under `beside`, 96 beside it, the split seam of 1 Oct).
One flat `Layout` cannot say that: the head and the blocks are two groups at two steps.

It is a Tier 2 pattern because it composes `Section` and `Layout` (a primitive may not import a
sibling primitive), and because it consumes a content shape — the section record's heading, anchor
id, eyebrow and lead.

What it is **not**:

1. **Not a page opening.** The one `h1` and the page's first statement are `PageHero`'s.
2. **Not a close.** The page's ask, its action and its what-happens-next are `CtaSection`'s. A band
   that carries a button group or a form is a `CtaSection`.
3. **Not a block.** It never renders cards, lists, prose or figures of its own; the children do
   (`BlockCard`, `ListCard`, `Prose`, `Figure`, `Accordion`, `Proof`, `Callout`). It never
   enumerates what may go in its body slot.

Nearest existing thing: `Section` itself, which this composes. The grouping is not a `Section` prop
because `Section` is a primitive that knows nothing about headings; a heading slot on it would weld
type roles into the band primitive.

Frequency: many per page. A service page runs 5–11 in sequence, which is why the arrangement
matters: the same silhouette eleven times fails the squint test however correct each band is.

## 2 · Anatomy

| Part | Element | Required | Notes |
|---|---|---|---|
| `band` | `section` when labelled, else `div` | yes | `Section`. `section` only when `heading` **and** `headingId` are both present, with `aria-labelledby` pointing at the heading. |
| `head` | `div` (a `Layout`) | no | Rendered only when at least one of eyebrow, heading, lead is present. |
| `eyebrow` | `p` | no | Mono label above the heading. Class `.eyebrow`. |
| `heading` | `h2` | no | Class `.heading`. `id={headingId}`. |
| `lead` | `p` | no | Class `.lead`. One sentence under the heading. |
| `body` | `div` (a `Layout`) | no | Rendered only when `children` has at least one renderable child. Each child is one row at `--gap-stack`. |
| `text` | `div` (`ContentSectionText`) | no | **Added 2.17.** A caller-placed wrapper around a rich-text block in the body. Class `.text`: `max-inline-size: var(--csec-body-measure)` and nothing else. Its siblings keep the full track. |

The class names `.eyebrow`, `.heading`, `.lead` are the token `{part}` slots
(`--csec-eyebrow-*`, `--csec-heading-*`, `--csec-lead-*`); `.text` reads `--csec-body-measure`. `head` and `body` carry no token: they
are arrangement, and arrangement is `Layout`'s.

## 3 · Props / API

| Prop | Type | Default | Decides |
|---|---|---|---|
| `heading` | `string` | — | The band's `h2`, verbatim. A string, not a `ReactNode`, so a second heading cannot be smuggled in. |
| `headingId` | `string` | — | The heading's id, the band's accessible name and the in-page anchor. Caller-supplied, never `useId`: it belongs to the content. Applied only when `heading` is present. |
| `eyebrow` | `string` | — | The category label above the heading. |
| `lead` | `string` | — | One sentence under the heading. |
| `surface` | `SectionSurface` = `'paper' \| 'tint' \| 'ink' \| 'blue'` | Section's default (paper) | Passed straight to `Section`. This component paints nothing. |
| `density` | `SectionDensity` = `'tight' \| 'open'` | Section's default | Vertical air, passed to `Section`. |
| `arrangement` | `ContentSectionArrangement` = `'stacked' \| 'beside' \| 'media'` | `'stacked'` | Where the head sits against the body. `beside` new in 2.13; `media` new 6 Oct 2026. (`split-head`, new 6 Oct, removed 7 Oct 2026 — see the last amendment.) |
| `align` | `ContentSectionAlign` = `'start' \| 'center'` | `'start'` | **6 Oct.** Centred head and centred-as-a-block body (§ 3.5). Stacked only. |
| `actions` | `ReactNode` | — | **6 Oct.** The head's action row (a `CtaRow rule={false}`), a stack under the lead. Not with `align="center"`, not with `aside`. |
| `aside` | `ReactNode` | — | **6 Oct.** `beside` only: the head track's photo (3:2) or stat, a stack under the head text. |
| `media` | `ContentSectionMedia` = `{ image: MediaImage; side?: 'start' \| 'end'; pin?: boolean; weight?: 'copy' \| 'photo'; head?: 'xl' \| 'lg'; counterweight?: boolean }` | — | **6 Oct.** `head` was `'display' \| 'title'` until home round 5 (11 Oct): display is the hero's alone, so the media head defaulted to `xl` (h1) and `lg` kept h2. **18 Nov:** the default is `lg`, the band's h2 like every other band's (owner: the media split's titles read larger than every other title on the page); `xl` is an explicit opt-in. Required by, and only on, `arrangement="media"`. `pin` (default `true`): `false` centres a blocks + footer copy column instead of pinning the footer (open question 7). |
| `footer` | `ReactNode` | — | **6 Oct.** The band's foot (a `CtaRow`), the body's last row at `stack`. With no blocks, the caller passes the CtaRow `rule={false}`. |
| `texture` | `ReactNode` | — | **6 Oct (`cmp-media-split`).** A caller-composed `<Texture>`, rendered as the band's first child so it fills the band beneath the content (CtaSection's slot, same shape). Paper only. In `media` it shows from 1024 only: `counterweight` has no phone form (visual-direction § 6.3). |
| `children` | `ReactNode` | — | The blocks. Rich text goes in wrapped in `ContentSectionText` (below). |

**`ContentSectionText`** (second export, **added 2.17**) — `{ children: ReactNode }`, nothing else.
Renders `<div className={styles.text}>`. No `measure` prop and no `className`: the one width it
knows is the body measure, and a caller wanting another width is not placing running text in a band.
Every route's `case 'rich-text'` returns `<ContentSectionText><Prose html={block.html} /></ContentSectionText>`.

**`arrangement` is a presentation prop and never a CMS field** (`docs/strapi-changes.md` §1: *"does
it change what the section says, or only how it looks?"* — only how it looks). The template that
places the band chooses it; the section record never carries it.

Deliberately **not** props: colour of any part (per-surface tokens); padding and the content column
(`Section`'s); any gap (the three steps are the component's reason to exist, and a gap prop would
let a call site undo them); the track ratio (O2 fixes 1 : 2; a ratio prop would be a rhythm knob);
the breakpoint (1024 is `Layout`'s `lg`); sticky (O2 rejects it); heading level (the band is always
an `h2` under the route's one `h1`); `className` and `style` (Rule 5: nothing overrides `Section`
from outside).

Compile-time guarantees: `arrangement` is a closed union, so `'sticky'` or `'rail'` fail to
typecheck. `heading` being `string` makes a `ReactNode` heading a type error. `headingId` without
`heading` compiles and is harmlessly ignored — making it a discriminated union would force every
route mapping a nullable CMS heading into a branch, for no rendered difference.

## 4 · Variants × sizes

One size. Two arrangements.

| | below 1024 | 1024 up |
|---|---|---|
| `stacked` | head above body, 48 | head above body, 48 |
| `beside` | head above body, 48 — **identical to stacked** | head in the leading 1/3, body in the trailing 2/3, 96 between (the split seam, 1 Oct), head top-aligned and static |

`beside` **degrades to `stacked`** whenever one half is absent (§12): no head → the body takes the
full column; no blocks → the head takes the full column (a footer alone is not a body half, and an
aside is dropped, 6 Oct fix round). An empty track is never drawn.

**`beside` is for a body that reads down** — rows, an accordion, a record sheet — so the head labels
one long column. It is wrong for a body that reads across, a set of peer cards or tiles (1 Oct 2026,
owner, on "Go deeper"): the head becomes one more column of the row, the squint reads three equal
blocks where there is one heading and two cards, and the cards take their width from the two-thirds
track instead of the page's grid. **A card set goes `stacked`.**

Considered and rejected:

- **Sticky head (a rail).** Rejected by O2. A sticking head needs a scroll container contract, a
  top offset under the sticky `SiteNav`, and a reduced-motion answer, for a benefit that only
  appears when the body is several viewports long — which the section corpus rarely is.
- **`[2, 1]` or `[1, 1]`.** O2 fixes 1 : 2. A half-and-half split makes the head read as a peer of the
  body rather than its label.
- **`beside` from 768.** At 768 the head track would be ~200px, less than two words of `--text-h2`.
- ~~**A third, `split`-style arrangement with media beside the copy.** That is `Figure` in the body
  under `beside`, or a `PageHero`; not a variant of this.~~ **Superseded 6 Oct 2026:** the B media
  split is a band archetype the kit needs on every page (visual-direction § 3.4), and it is
  `arrangement="media"` — see the amendment at the top.

## 5 · States

None. Nothing in this component responds to a pointer, takes focus, opens, loads or fails. Its
rendering is a pure function of its props. Interactive children bring their own states; this band
neither styles nor observes them. There are no state tokens in `content-section.css`, and that is
the assertion.

## 6 · Per-surface colour

Unchanged by 2.13 — `arrangement` moves no colour. Ratios are against the surface ground.

| Token | paper | tint | ink | blue |
|---|---|---|---|---|
| `--csec-heading-ink` | `--color-neutral-900` · 14.62:1 | `--color-neutral-900` · 13.05:1 | `--color-white` · 17.26:1 | `--color-white` · 6.23:1 |
| `--csec-lead-ink` | `--color-neutral-700` · 8.15:1 | `--color-neutral-700` · 7.27:1 | `--color-neutral-300` · 11.07:1 | `--color-brandeis-100` · 4.91:1 |
| `--csec-eyebrow-ink` | `--color-neutral-600` · 4.92:1 | `--color-neutral-700` · 7.27:1 | `--color-neutral-400` · 8.05:1 | `--color-brandeis-100` · 4.91:1 |

- **Paper** — the reference: dark heading, 700 lead, 600 eyebrow at the AA floor.
- **Tint** — the eyebrow steps to 700 because 600 fails on the deeper ground; heading and lead hold.
- **Ink** — every ink inverts: white heading, 300 lead, 400 eyebrow.
- **Blue** — white heading; lead and eyebrow at `--color-brandeis-100`, the lightest step that clears
  4.5:1. Blue is reserved site-wide (audit §2, ruling 2): one argued band per page, never adjacent to
  ink. The component supports it; routes spend it.

**Nested surfaces.** Every surface block declares all three inks, so a tint `ContentSection` inside
an ink `Section` resolves tint's values and nothing from ink (the measured 1.13:1 failure this rule
exists for). The specimen's section 9 renders exactly that case.

## 7 · Geometry & spacing

(a) Distances, all gap-scale steps, none responsive:

| Seam | Step | Why that step |
|---|---|---|
| eyebrow → heading | `--gap-block` (24; was `--gap-tight` 8 until 5 Oct, S1) | the section head is one group at one step, the rhythm `PageHero` and `CtaSection` already carried |
| heading → lead | `--gap-block` (24) | head to body inside a block |
| head → body (rows) | `--gap-stack` (48) | block to block inside a section — `stacked`, and `beside` below 1024 |
| head track → body track | `--gap-section` (96, was `--gap-column` 64 until 1 Oct) | **new in 2.13.** Two regions of different kind side by side — a head and the body it labels — which is a *split*, and a split takes 96 (CLAUDE.md § gap scale; `--gap-column` is for peer halves only). Not `--gap-gutter` (32): that is the seam between peers in a set, and a head is not a peer of its blocks — at 32 the head reads as a narrow first card. |
| block → block | `--gap-stack` (48) | between the blocks in the body |

(b) Component sizes: none of its own. The tracks are `Layout`'s `[1, 2]` fr ratio, so at a 1440 window
(1240 column) the head track is 392 and the body 784; at 1024 (960 column) they are 299 and 597.

(c) Optical corrections reaching `--space-*`: none.

Measures: `--csec-heading-measure` → `--measure-title` (32ch, 816px at 1440), `--csec-lead-measure` →
`--measure-lead` (56ch) and, **added 2.17**, `--csec-body-measure` → `--measure-body` (75ch, 734px),
read only by `ContentSectionText`. The body measure is a ceiling: `stacked` (1240) and `beside` at
1440 (763) are both wider, so it caps; `beside` at 1024 (576) is narrower, so the track wins. Under `beside` both measures exceed the head track, so the **track sets the
line** and the measures only cap `stacked`. That is intended: the head track is narrower than the
title measure on purpose, which is what makes the head read as a column.

Radius, border, shadow, z-layer: none. The band has no edge; `Section` owns the ground.

## 8 · Typography

| Part | Role | Tracking | Wrap | Case |
|---|---|---|---|---|
| eyebrow | `--text-eyebrow` via `--csec-eyebrow-text` | `--text-eyebrow-tracking` via `--csec-eyebrow-tracking` | — | `--text-mono-case` (uppercase in presentation; the string keeps its authored case) |
| heading | `--text-h2` via `--csec-heading-text` | `--text-h2-tracking` via `--csec-heading-tracking` | `--text-title-wrap` (balance) | as authored |
| lead | `--text-lead` via `--csec-lead-text` | none — `--text-lead` is a body role with no tracking companion | `--text-running-wrap` (pretty) | as authored |

The heading stays at `--text-h2` in both arrangements. The element is an `h2` and the band is the
same section either way; stepping the scale down in `beside` would make the arrangement decide the
heading's importance. §17 Q1 records the alternative.

## 9 · Responsive

- **1024 up** (`Layout` `lg`): `beside` splits 1 : 2 with a 96 split seam. `stacked` does not change.
- **1023 and below**: `beside` is one track, and the head-to-body seam is `--gap-stack` — the same
  `Layout`, the same `rowGap`, the same DOM order as `stacked`. Identical, not similar.
- Type re-declares at 1023 and 767 through the title roles (`--font-size-h2` → `-t` 34 → `-m` 28);
  nothing here adds a breakpoint for type.
- No distance swaps at a breakpoint. The layout changes at 1024; the steps do not.
- Touch targets: none of its own. Children own theirs.

Note for templates: the body track under `beside` is 576 wide at 1024 (597 before the 1 Oct split
seam). A card set does not go in it at all: a set reads across, so it takes `stacked` (§4, 1 Oct
2026). What goes beside a head is a body that reads down — rows, an accordion, a record.

## 10 · Composition

```tsx
<Section as={labelled ? 'section' : 'div'} surface={surface} density={density}
         aria-labelledby={labelled ? headingId : undefined}>
  <Layout rowGap="stack"                                  // head → body as rows (48)
          colGap={split ? 'section' : undefined}          // head track → body track (96)
          columns={split ? { lg: [1, 2] } : undefined}    // 1 : 2 from 1024, O2
          align={split ? 'start' : undefined}>            // static, top-aligned head
    {hasHead && (
      <Layout rowGap="block">                             // eyebrow → heading → lead (24), S1
        <p className={styles.eyebrow} />
        <h2 className={styles.heading} />
        <p className={styles.lead} />
      </Layout>
    )}
    {hasBody && <Layout rowGap="stack">{children}</Layout>}   // block → block (48)
  </Layout>
</Section>

// at the call site (2.17):
<ContentSectionText>                                      // max-inline-size: 75ch
  <Prose html={block.html} />
</ContentSectionText>
```

where `split = arrangement === 'beside' && hasHead && hasBody`, and
`hasBody = Children.toArray(children).length > 0`.

No hand-rolled grid or flex: the only arrangement is `Layout`'s. No margins on any part. Nothing
overrides `Section`'s column, gutter or ground. `align="start"` is what makes the head static in
the honest sense — sized to its content, not stretched to the body's height pretending to be a rail.

## 11 · Accessibility

- **Semantics.** Labelled band: `<section aria-labelledby={headingId}>` with the `h2` as its name.
  Unlabelled (no heading, or no id): a `div`, because an unnamed `section` is a region a screen
  reader announces and cannot identify.
- **Reading order = DOM order = visual order** in both arrangements: eyebrow, heading, lead, blocks.
  `beside` moves the head sideways, never after the body, so there is no order mismatch (SC 1.3.2).
- **Keyboard.** Nothing focusable of its own; nothing bound. Tab order is the children's.
- **ARIA.** `aria-labelledby` only when its target is rendered (heading **and** id present);
  otherwise omitted. `npm run aria:check` proves it on the built specimen.
- **Ids.** `headingId` comes from the content (the section's anchor), so it is stable across renders
  and unique per page by the content's own contract. The specimen gives every band a unique id.
- **Focus ring, motion:** none.
- **Contrast floors:** §6; lowest 4.91:1 (lead and eyebrow on blue).
- **Screen reader, labelled band:** *"The screen is often where a deeper product problem becomes
  visible., region"* then *"heading level 2, The screen is often …"*. Unlabelled: no landmark.

## 12 · Content edge cases

| Case | Handling |
|---|---|
| Longest realistic heading (10 words, 80 characters) | Balances. `stacked`: breaks at 32ch. `beside`: the track sets the line — 5 lines at 1440, 7 at 1024 (§17 Q1). Specimen §4. |
| Longest lead (45 words) | Pretty-wraps at 56ch (`stacked`) or the track (`beside`). Specimen §4. |
| One long unbroken token | `overflow-wrap: break-word` from `reset.css` on `p` and `h2`; every track is `minmax(0, fr)`, so nothing widens the column. Specimen §5; the 390 capture shows no horizontal overflow. |
| No eyebrow | No element, no 24 seam; the heading is the head's first row. |
| No heading | No `h2`; the band is a `div`. The eyebrow (if any) and the lead remain. |
| Empty string for eyebrow / heading / lead | Treated as absent (falsy). No empty element, no seam. |
| No lead | The eyebrow and heading are the whole head, at the same 24 seam. |
| No head at all | No head row. Under `beside` the body takes the full column (degrades to `stacked`). |
| No children / `children` omitted | No body row and no 48 seam under the head. Under `beside` the head takes the full column, and an `aside` is dropped (no head track to sit in). A `footer` alone does not split `beside`: it sits a stack under the head, and its CtaRow takes `rule={false}` (nothing above it to close). |
| Empty children array (`[]`, a CMS section with zero blocks) | Same as omitted — `Children.toArray` is empty. **Changed in 2.13**: previously an empty `Layout` rendered, leaving a phantom 48 seam below the head. |
| One block / many blocks | One row per block at 48; the component never counts, clamps or paginates. |
| `beside` with a short body | The head is the taller column; the band ends under the head. Not corrected (specimen §6). |
| `beside` with a long body | The head sits at the top of a mostly empty column; it does not stick (O2). Specimen §6. |
| The narrow track at 767 / 390 | One track in both arrangements; the 326 column. Specimen §9 and the 390 capture. |
| A parent that does not size it | Not applicable — a band belongs to the page, never to a grid track. |
| Logical properties | The module uses `max-inline-size` only; the leading track is the inline-start one, so an RTL page puts the head on the right with no change. |
| Nested inside a different surface | Every ink resolves from the nearest surface (§6). Specimen §9. |
| Two adjacent | Section's own vertical air, nothing else. Specimen §10 renders two paper bands, beside then stacked. |
| Interactive content in the body | Owned by the child; this band adds nothing around it. |

## 13 · Motion

None. Nothing transitions, including across the 1024 breakpoint (the grid template swaps without
animation). Reduced motion: nothing to reduce.

## 14 · Do's and Don'ts

- **Do** choose `arrangement` in the template or route composition. **Don't** map it from a CMS
  field — `grep -rn "arrangement" src/content` returns no ContentSection mapping.
- **Don't** hand-roll the split: `perl -0pe 's{/\*.*?\*/}{}gs' src/patterns/ContentSection/ContentSection.module.css | grep -nE 'display|grid|flex'` returns nothing.
- **Don't** give any part a margin: the same grep for `margin` returns nothing.
- **Don't** make the head sticky: no `position` in the module.
- **Do** keep the split seam at `section`: `grep -n "colGap" src/patterns/ContentSection/ContentSection.tsx` shows only `'section'`.
- **Don't** pass `className`/`style` to reach `Section` — the props type has neither.
- **Do** wrap a rich-text block in `ContentSectionText` (2.17): `grep -n "case 'rich-text'" -A6 src/app/*/page.tsx src/app/*/*/page.tsx` shows it in every ContentSection route. **Don't** wrap a card grid, table or figure in it, and **don't** put a `max-width` on Prose instead — the ruling stands.
- **Do** render the same DOM order in both arrangements — the head precedes the body in the source.
- **Don't** draw a one-third track with nothing in it: a `beside` band with no head or no body
  renders no `--tmpl-lg` template (inspect the outer Layout's inline style: `--tmpl-lg: initial`).
- **Don't** put a card set that reads across (3-up, or a 2 × 2 image grid) in a `beside` body:
  `/design/content-section` has none (§ 1, § 2, § 4, § 6, § 7 use rows, icon cards or pair cards).
- **Don't** give a centred head actions, or a beside head both an aside and actions — each is a type
  error (`tsc` fails on `<ContentSection align="center" actions={…} />`).
- **Don't** hand a `media` band a pre-cropped `<Media>`: `media` takes the record, and the band
  crops it 4:5 / 4:3 (`grep -n "ratio={{ base: '4/3', lg: '4/5' }}" src/patterns/ContentSection/ContentSection.tsx`).
- **Do** pass `rule={false}` to a footer CtaRow under a ruled ladder (Accordion, ListCard rows), and
  to the footer of a band with no blocks (`/design/content-section` § 14, § 15).
- The module's only `@media` is `.leadBeside`'s (a type role from 1024); it states no distance.

## 15 · Specimen plan

`/design/content-section`, every band a live `ContentSection` so bands sit edge to edge as on a
route. Labelling bands (tight, paper) separate the groups.

1. The two arrangements, same content (stacked, beside).
2. **Added 2.17.** The body measure: both arrangements with a long rich-text body in
   `ContentSectionText` (capped at 75ch) above a `DataTable` and a card grid that still span the track.
3. Four surfaces × two arrangements, identical markup (8 bands), the eyebrow naming the cell.
4. Longest realistic heading (10 words) and lead (45 words), both arrangements.
5. One unbroken token in heading and lead, both arrangements.
6. `beside` with a short body and with a long body (prose with an h3, cards, steps).
7. Absent slots: no eyebrow; no lead; heading only; empty-string eyebrow and heading with a lead
   (unlabelled div); no head under `beside` (full column); no children under `beside` (full column);
   an aside and no children under `beside` (stacked, aside dropped); an empty children array under
   `stacked` (no phantom seam). Labelled as degrade cases, not page shapes.
8. Density tight and open under `beside`.
9. Nested surfaces (tint in ink, `beside`; ink in paper, `stacked`), a `Proof` body on blue, and a
   390 viewport frame (`viewportMobile`) with the longest copy.
10. Two adjacent paper bands, beside then stacked.
11. **6 Oct.** `align="center"`: over a card set, over an accordion with a centred CtaRow (D-faq),
    the longest copy, and on tint (captioned surface proof).
12. **6 Oct.** `beside` with an aside (photo, C-icon-4 with a footer; photo, D rows; one stat-lg
    figure, D rows, at ordinary copy and at the § 1.5 ceiling), with actions (C-pair), and CMS stress
    copy with a photo aside (fold-exempt).
13. **7 Oct.** The bands that took `split-head`, as they read stacked now: with an action, lead only
    with a footer, and the longest copy (`split-head` removed — see the last amendment).
14. **6 Oct.** `media`: photo start + 4 tiles (centred), photo end + 2 tiles + CtaRow pinned beside
    the identical band with `media.pin: false` (the owner comparison), no blocks + CtaRow (centred,
    rule off, degrade case), head actions and no blocks (centred, degrade case), copy at the B ceiling
    with 2 tiles + CtaRow (fits), and CMS stress copy taller than the photo (fold-exempt).
15. **6 Oct.** Footer under a stacked set; a footer and no blocks under `beside` (degrades to stacked,
    rule off).
Section 1 now shows all three arrangements with the body each is for.

No states to force. `beside` cannot be forced inside a narrow frame at a wide window (a frame
cannot fire a media query), so the 390 capture of the whole page is the proof that `beside`
collapses; the frame in §9 is labelled as showing `stacked`.
Every rich-text body on the page is wrapped in `ContentSectionText`, as the routes do.

## 16 · New token requests

**2.17:** `--csec-body-measure: var(--measure-body)`, surface-independent, in `:root`. An alias
rather than a raw read of `--measure-body` only so the module reads nothing but `--csec-*`, exactly
as its two sibling measures do; a third measure read raw would make the module the odd one out in
its own layer. (CLAUDE.md rule 6 argues against pure renames; this one is kept for symmetry with
`--csec-heading-measure` and `--csec-lead-measure`, and `CtaSection`'s `--cta-body-measure` is the
precedent.)

Before 2.17: none — every value in this spec is an existing token. `beside` uses `--gap-section` (`--gap-column` until 1 Oct) through
`Layout`'s `colGap` and `Layout`'s own `lg` breakpoint.

## 17 · Open questions

1. **Heading scale under `beside`.** At 1024 the head track is 299px and a 10-word H2 at 43px runs to
   seven lines (specimen §4). *Options:* (a) keep `--text-h2` in both arrangements; (b) step the
   heading to h3 scale under `beside`; (c) start `beside` at 1440 (`xl`) instead of 1024.
   *Chosen:* **(a)**. O2 fixes 1024, (c) contradicts it; (b) would let an arrangement decide a
   heading's importance and needs a new `--csec-heading-text-beside` token. Section headings in the
   corpus are mostly shorter than the stress row. Revisit if Phase 3 templates put long headings in
   `beside` bands. *Non-blocking.*
2. **What `beside` does with one half missing.** *Options:* (a) degrade to `stacked` (full column);
   (b) keep the empty track so a run of `beside` bands aligns its body column. *Chosen:* **(a)** —
   an empty third is a hole in the page, and alignment across bands is not something this band can
   know about. *Non-blocking.*
3. **Column seam: `column` (64) or `gutter` (32).** *Chosen (2.13):* **`column`**. The scale named 64
   for "two halves that must read as separate"; 32 is between peers in a set, and at 32 the head reads
   as a narrow first card. **Superseded 1 Oct 2026: `section` (96).** A head beside its body is two
   regions of different kind, a split, and a split takes 96; `column` is now for peer halves only.
   Owner: "64px is fine but 96px … gives it just a bit more breathing space." *Non-blocking.*
4. **Empty children array.** *Chosen:* treat `[]` as no body (removes a phantom 48 seam that
   `stacked` used to render). No route renders a zero-block section today, so no route output
   changes. *Non-blocking.*
5. **Card sets inside a `beside` body.** The body track at 1024 (597, now 576) cramps a three-up set.
   *Chosen (2.13):* leave it to the caller's `columns`. **Superseded 1 Oct 2026 (owner):** a card set
   does not go in a `beside` body at all; it goes `stacked` (§4). *Non-blocking.*
6. **Brief 07's Note slot and the "rail" arrangement.** Brief 07 asked for a Callout slot and asked
   whether a sticky rail is worth specifying. *Chosen:* no Note slot — a `Callout` is a child in the
   body, which already takes any block; the rail is rejected by O2. *Non-blocking.*

7. **B with tiles and a footer: pinned or centred?** § 3.2 rule 1 pins the footer to the photo's
   bottom edge so copy and photo share two edges. At 1440 a B with 2 tiles and a CtaRow then carries
   ~180 of empty column between the tiles and the CtaRow's rule — the emptiest band on the specimen.
   *Options:* (a) pin (rule 1, two shared edges); (b) centre, the footer a `stack` under the tiles.
   *Chosen for now:* **(a)**, the documented rule, with `media.pin: false` available and both rendered
   side by side on `/design/content-section` § 14 for the owner. `cmp-media-split` builds on the
   answer. *Non-blocking for foundations; the owner's call before `cmp-media-split`.*

No BLOCKING question is open.

## Appendix — self-audit

```
STRUCTURE
[x] Sections 0–17 present in order with the template's headings.
[x] Tier 2, Status approved (O2 cited), prefix --csec-*.

NAMES
[x] Component tokens named: --csec-eyebrow-text, --csec-eyebrow-tracking, --csec-heading-text,
    --csec-heading-tracking, --csec-lead-text, --csec-heading-measure, --csec-lead-measure,
    --csec-heading-ink, --csec-lead-ink, --csec-eyebrow-ink — all declared in content-section.css.
    2.17 adds --csec-body-measure (→ --measure-body).
[x] Usage tokens: --gap-block, --gap-stack, --gap-section (--gap-tight left with S1, 5 Oct 2026;
    --gap-column with the 1 Oct split seam; --gap-gutter is the specimen's, not the component's); --text-h2,
    --text-h2-tracking, --text-lead, --text-eyebrow, --text-eyebrow-tracking, --text-mono-case,
    --text-title-wrap, --text-running-wrap; --measure-title, --measure-lead. `npm run design:check`
    resolves every one.
[x] Layout props used are in its unions: rowGap stack|block, colGap section, columns {lg:[1,2]},
    align start.

COLOUR
[x] 3 tokens × 4 surfaces = 12 cells, none blank, none a delta. Lowest text ratio 4.91:1.

STATES
[x] None, and no state tokens.

LAYOUT, TYPE, SEMANTICS
[x] No hand-rolled grid, no margins, no Section override. DOM order equals visual order.
[x] aria-labelledby only when its target renders.
```

## Amendment — media arrangement, fix round 1 (cmp-media-split, 6 Oct 2026)

- `texture` is typed paper-only: it is a type error beside `surface` tint, ink or blue.
- `media`: the photo box is at least 4:5 (4:3 below 1024) and stretches to a taller copy column, with
  the image filling it, so photo and copy share both edges at every width from 1024.
- `media` with blocks and a pinned footer pins the blocks AND the footer as one group; the stretch
  opens under the lead.
- ~~`media` heads of ≤ 22 characters take `--text-display`~~ (superseded below); ~~the eyebrow takes `--csec-eyebrow-accent-ink`~~ (deleted: every eyebrow carries the kit’s 6px blue square, `cmp-services` fix round 2).
- Placement: `TextureCounterweight` in Texture (docs/kit/brand-amendments.md).

## Amendment — media arrangement, final fix round (cmp-media-split, 6 Oct 2026)

- `media.weight` (default `copy`): `photo` gives the photograph the 7 of [7, 5] at 6:5 (667 × 556 at
  1470), for short copy — a head and a CtaRow, an accordion, two tiles and a CtaRow. `copy` keeps
  the 4:5 photo in 5 of [5, 7] for four tiles or a ruled list.
- The photo box's ratio is a floor and it has a ceiling: a taller copy column stretches it to at
  most 3:5 (copy-led) or 4:5 (photo-led), read against the track's own width (`cqi`). At 1024 the
  copy-led photo is 360 × 600, no longer a 1 : 2 strip.
- ~~`media.head` (default `display`)~~ — since home round 5 (11 Oct 2026) the default is `xl` (the h1 role) and `title` is spelled `lg`; `headingSize` is `xl | lg | md` and `display` is retired (owner: "display text should only be used for heros").
- `media.head` (default `display`) replaces the 22-character cutoff. fold:check fails a head that
  runs long.
- `media.counterweight`: the counterweight is a defined field in the copy column, pinned last on the
  photo's bottom edge, at every width. Paper only (dropped with a warning elsewhere).
- `sizes` is `mediaSplitSizes(weight, image)`: the drawn width of the cover crop, not the box's.

## Amendment · 6 Oct 2026 — `cmp-services` fix round 2

- ~~**The eyebrow carries the blue mark, on every band.**~~ Withdrawn 7 Oct 2026 (owner): no eyebrow
  carries a mark — ContentSection, PageHero, CtaSection, Statement and Banner alike. The mark's tokens
  are deleted. PageHero keeps its square on the tag list and the announcement flag, which are bullets,
  not eyebrows.
- **`headSide: 'start' | 'end'`** on a beside band with an aside. `end` mirrors the split from 1024
  (Layout `reverse`): the blocks in the 2, the head and its aside closing the row in the 1. Visual
  only; the head stays first in the DOM. For a page with two beside-aside bands, so they are not the
  same rectangle twice (§ 8.5).
- **`asideFill` below 1024 is 21:9** (`--csec-aside-ratio`, was 3:2). At 768 the 3:2 photo was
  704 × 469 and outweighed the six icon cards under it; at 390 the band read as head, photo, card — the
  image routers' silhouette. As a 21:9 banner the photograph stays, and the band still reads as a router.

## Amendment · 6 Oct 2026 — `page-product-design` fix rounds 1 and 2

- **`align: 'center-lg'`** (fix round 1). Centres the head from 1024 and starts it below, for a
  centred band whose body becomes a start-aligned column on a phone — a vertical thread, stacked
  contrast lists, stacked text cards. A centred head over a start-aligned column read as two axes.
  `center` keeps centring at every width (marks, covers, an accordion).
- **The head track steps at 1440** (fix round 2). `beside` and `split-head` are `[5, 7]` from 1024
  and `[1, 2]` from 1440 (`HEAD_TRACKS`). At 1024 a third of the column is 288, and a 43 h2 broke
  there into one- and two-word lines across four service-page bands ("Relevant / Product / Design
  work"). 5 of 12 is 360, which holds the same heads to two lines. The arrangement changes at a
  breakpoint; no distance does. Every 1440+ measurement above is unchanged.
- `--csec-eyebrow-accent-ink` is gone (see the struck line in the media amendment).

## Amendment · 7 Oct 2026 — owner design review: `split-head` removed

**The rule.** A head with no image beside it is never split left/right. It is ONE column: eyebrow →
heading → lead at `block` (24), the head's action a `stack` (48) under the lead, then the body.
Side by side survives only where one side is media — `media` (the photograph beside the copy) and
`beside` with an aside — and in `beside` over a read-down body, where the split is head | body rather
than heading | lead. Recorded in `docs/kit/visual-direction.md`, "Owner rulings · 7 Oct 2026", rule 2.

**Why.** `split-head` (the H-row) put the heading in the leading third and the lead and action in the
trailing two-thirds. With no image, the reading order was unclear (heading, then across, then down)
and the one-link action floated in a mostly empty two-thirds track.

**Removed, not made media-only.** A media-only split-head would be `media` or `beside` + aside under
another name, so the arrangement is deleted from the union: `'stacked' | 'beside' | 'media'`. Passing
`arrangement="split-head"` is now a type error, so no caller can reintroduce it.

**Call sites migrated** (all to `stacked`, the action kept as the head's `actions` under the lead):
- `ServicePage` (`Bands.tsx`): the E diagram and M covers bands (plan `headRow` → `moreInHead`: the
  `more` link closes the stacked head rather than opening a ruled foot), the G proof band with a lead
  (a typographic quote now centres its head with it, the link its foot; a G with a case keeps the
  start edge and the head's link), and the I band without a photograph.
- `Banner` `below`: the head stacks over the 3:1 photograph (its own H-row, same ruling).
- Kit pages: home (C-image-3), about (C-image-4, S), feature (variations 3, 8, 13, 24), logos (05,
  06), process (the flow), readdown (D.1, D.2, D.5), service-list (04), services-index (N).
- Specimen § 13 rewritten: the same three bands, stacked.

**Height.** The stacked head with a link is H-compact 169 + 48 + 40 = 257 against the H-row's 166, so
a band that took the H-row is ~90 taller. Measured at 1440 on the six service pages after the change:
the tallest bands are 819 (E with a five-row table, M with three covers) and 823 (I with its photo),
all under the 830 fold.

## Amendment · 7 Oct 2026 — `actionsAt="end"` (owner)

- A stacked head with `actions` may set them at the inline end of the heading's row: `actionsAt="end"`
  (default `below`). From 1024 the head is the eyebrow on its own line, then a row of two tracks —
  heading and lead in `1fr`, the actions in a content-sized track (Layout's new `'auto'` weight) —
  `column` (64) apart, aligned to the heading's top. Below 1024 the actions fall back a `stack` under
  the lead, exactly as `below`.
- Typed: `actionsAt: 'end'` is a separate union member that only allows `arrangement="stacked"`.
  It needs a heading to align to; without one the actions render `below`.
- Specimen: `/design/content-section` § 13b — link row, solid pair on tint, longest copy.
