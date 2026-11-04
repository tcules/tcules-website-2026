# ListCard

> **Amended, home round 3 (11 Oct 2026).** The thumbnail is 16:9 (`--lcrd-thumbnail-ratio` → `--ratio-standard`), the site's one card ratio. See docs/page-mapping.md § 19.

## 0 · Front matter

|                     |                                                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Component**       | `ListCard`                                                                                                             |
| **Tier**            | 2 pattern (`src/patterns/ListCard/`)                                                                                   |
| **Status**          | implemented                                                                                                            |
| **Token prefix**    | `--lcrd-*`                                                                                                             |
| **Designer / date** | Codex / 21 Aug 2026                                                                                                    |
| **Revised**         | Cards 1a redesign / 25 Aug 2026 — always-dark title, the cue alone carries the link colour, hover wipe removed, and the number marker de-emphasised — 40px down to the new 20px `--text-index` role, its own quiet ink one step below the label ramp, and a baseline correction. Presence and interaction pass, same day — title to h4, the row's inner inset off the dense-table step, and a per-surface hover fill on the ghost-button model. The rule's one-day stint as the hover signal was replaced by the fill on 26 Aug. **Phase 2 task 2.11 / 28 Sep 2026** — the thumbnail moves onto `Media` (`fit="fill"`, `LIST_CARD_THUMBNAIL`, lazy); the marker union discriminates on `type`; `external` takes ch04's `square-arrow-right-up` and a visually hidden new-tab hint; the ordered set is confirmed as a real `ol`; contact cards lose their icon thumbnails (C1). Rulings: `docs/phase-2-decisions.md` C1, M1–M4. **Tracker 2.17 / 29 Sep 2026** — the split reads the row's own width (a wrapping `Cluster` on `--lcrd-title-min` / `--lcrd-body-min`, not Layout's md viewport boundary), so titles no longer break mid-word; the title wraps `break-word`, not `anywhere`; wide rows are capped at `--measure-title` + seam + `--measure-body`; the off-site cue is the plain `arrow-right-up`; the thumbnail passes Media `inset="text"`. See § 7, § 9, § 10 and § 17 q7, q8. **1 Oct 2026 (owner)** — a second **form**, `tile`, for an item in a grid track, and `body` optional. Collected in **Amendment · 1 Oct 2026**. |
| **Revised**         | `fdn-spacing` / 5 Oct 2026 — title → body at `text` in every form (S3); the `size` prop (`md \| sm`), passed by the composing route (visual-direction § 7.2). See **Amendment · 5 Oct 2026**. 6 Oct 2026 — at `sm` only a tile's body steps to body-sm; a row's body stays at body (item 2), and grids of tiles take a `column` row seam (item 4) |
| **Revised**         | **Owner review / 7 Oct 2026** — no arrow cue on linked items (the `cue` prop is deleted; the title takes the link ink on hover and focus); an opt-in action at the foot (`ctaLabel`); the boxed tile (`frame="box"`); the number tone rule. See **Amendment · 7 Oct 2026** at the foot; where this spec still differs, that amendment wins. |
| **Implements**      | `docs/briefs/11-list-card.md`                                                                                          |
| **Implemented at**  | `src/patterns/ListCard/` · `src/styles/tokens/components/list-card.css` · specimen `src/app/design/list-card/page.tsx` |

> **Amendment · 13 Oct 2026 · the insights hub (docs/specs/InsightsIndex.md).** Two additions, both
> built in this tier because the hub needed them and a row had nowhere else to put them:
>
> 1. **`eyebrow?: string`** — one quiet mono label above the title ("Podcast · 25 Aug 2026"),
>    BlockCard's eyebrow voice and values (`--lcrd-eyebrow-text`, `-tracking`, and `-ink` per surface:
>    neutral-600 4.92:1 · neutral-700 7.27:1 · neutral-400 8.05:1 · brandeis-100 4.91:1), a `text` (16)
>    above the title. In a split row it travels with the title in the title's track. Blank warns and
>    renders nothing.
> 2. **`marker: { type: 'date'; dateTime?: string; day: string; label: string }`** — the day at the
>    stat role in the accent (`--lcrd-date-day-text`, `--lcrd-date-ink`: brandeis-500 · brandeis-500 ·
>    brandeis-300 · white), month and year under it at `tight` in the eyebrow's voice, in a fixed
>    `--lcrd-date-inline` (96) column. A `<time>` with `dateTime`; without one, text. The caller formats
>    both strings. Specimen: `/design/list-card`, the eyebrow and date-marker blocks.
> 4. **The thumbnail has an outline** (owner, 13 Oct 2026, superseding "a radius and no frame"): one
>    hairline round the thumbnail box, as every card image has, so a light photograph or a sketch plate
>    separates from the ground. `--lcrd-thumbnail-rule-width` (hairline) and `--lcrd-thumbnail-rule-ink`
>    per surface — neutral-300 · neutral-400 · neutral-700 · brandeis-300, decoration — BlockCard's
>    cover-rule values duplicated on purpose. Specimen: every thumbnail row, including the four-surface
>    proof.
> 5. **`markerPosition?: 'start' | 'end'`** (13 Oct 2026, the insights archive). `end` sets an image
>    marker (`thumbnail`, `sketch`) after the copy, so a list where only some rows carry an image keeps
>    every eyebrow and title on one edge (docs/research/resources-listing.md, Figma's "The latest").
>    Rows only; number, icon and date markers always lead. Below 768 an end image is not shown: it is
>    supplementary and would squeeze the copy to ~200px. Specimen: the eyebrow block's first row.
> 3. **`marker: { type: 'sketch'; name: ArticleSceneName }`** — a DRAWN thumbnail: the scene drawn for
>    that article (never a service scene), in the thumbnail's own 16:9 box, assigned item by item in
>    data. Decorative. Specimen: the eyebrow block's guide row.

> **Amendment · 7 Oct 2026 · owner review (supersedes every mention of the arrow cue below).** No
> arrow after a linked item's title and no arrow at a row's end: the whole item is the link, and its
> title is the hover and focus signal. Visible actions are opt-in (`ctaLabel`). Tiles may be boxed
> (`frame="box"`). Number markers are blue when the numbered points ARE the section's information and
> neutral when they are auxiliary. Full text: **Amendment · 7 Oct 2026** at the foot.

> **Amendment · 5 Oct 2026 · `fdn-spacing` (visual-direction § 1.1 S3, § 7.2).** Where this spec
> still differs, `docs/kit/visual-direction.md` wins.
>
> 1. **S3 — title → body is `text` (16), not `tight` (8)**, in the stacked row, the wrapped split
>    (the Cluster's `rowGap`) and the tile. Ink gap after: ~25 → ~33. It puts ListCard and BlockCard
>    on one card rhythm (BlockCard's S2).
> 2. **A `size` prop: `'md' | 'sm'`** — the title and body roles together, a component size and so a
>    t-shirt name. A row cannot see its siblings, so the composing route passes it. **The default
>    follows the form:** `md` for `form="row"`, `sm` for `form="tile"`, so the rule that every tile
>    takes `sm` holds without a call site remembering it. A row set of four or more still passes
>    `sm`, because only the route can count.
>
>    | Size | Title | Body | Ordinal offset | Set |
>    |---|---|---|---|---|
>    | `md` | `--text-h4` | `--text-body` | `--space-4` | up to three rows |
>    | `sm` | `--text-h5` | `--text-body-sm` on a tile; `--text-body` on a row | `--space-0` | any set of four rows or more, and tiles |
>
>    **6 Oct 2026 — the body steps in a tile only.** As shipped on 5 Oct, `sm` set body-sm on a row
>    too, and on product-design at 1440 the five numbered steps and the "What you receive" rows read
>    as fine print beside an h2 band: a row's body runs at up to `--measure-body`, beside or under its
>    title, and that is a reading line, not a tile's caption. Visual-direction § 1.4 already assumed
>    it (the F step row and the one-column D row are h5 over **body**), so § 7.2 is reconciled to
>    § 1.4: the title steps with the count in every form; the body steps with the track, so only a
>    tile's does. The module sets the md body role on `.body` and restates it only under
>    `.sizeSm.tile`. No token changes: `--lcrd-body-text-sm` is now read by tiles alone.
>
>    There is no `lg`: § 7.2's large step is the one featured, horizontal card, which is BlockCard's
>    arrangement, and a ListCard is never featured. Tokens `--lcrd-title-text-{md,sm}`,
>    `--lcrd-title-tracking-{md,sm}`, `--lcrd-body-text-{md,sm}` and
>    `--lcrd-number-baseline-offset-{md,sm}` replace the unsuffixed four. The ordinal's correction is a
>    function of the title's size (§ 7c), so it steps with it; both values were measured in the browser
>    (numeral baseline minus title baseline: 0.00px at md with 4, and 0 needed at sm, where 2 sat 2px low). The module sets the roles under one root modifier per step (`.sizeMd` / `.sizeSm`),
>    and `.numberAbove` takes a third class so a tile's ordinal still drops the offset at `sm`.
> 3. **The service-page template passes it:** tiles (Signals, Ledger grids, the Parts and Slice
>    diagram tiles) take `sm`; Steps, Router, the Stat rows and a one-column Ledger take `sm` from four
>    rows, else `md`.
> 4. **Grids of tiles take `rowGap="column"` (64), 6 Oct 2026** — the row seam of every borderless
>    card set (CLAUDE.md's `--gap-column` row; visual-direction § 1.2). Signals, Ledger grids, the
>    Parts and Slice diagram tiles and every tile grid in the specimen moved from `stack` (48). A tile
>    has no box, so at 48 its last line ran into the opening rule of the tile below. A column of
>    ruled rows is not covered: its rule and padding are its seam, and it stays at `none`.
> 5. **Follow-up, not in this package:** routes outside the six service pages that render a ListCard
>    set of four rows or more (`services/[...slug]`, `expertise/[slug]`, `audits/[slug]`,
>    `tools/[slug]`, `how-we-work`, `glossary`) do not pass `size` yet, so they stay at `md`. Each
>    route adopts the count rule when it is recomposed from the kit.
> 6. **Steps, the set mode (`Steps.tsx`), final fix round 6 Oct 2026.** A Steps row is `md` and
>    `stacked` at every count — the blue index beside an h4 title, the body under it at
>    `--lcrd-stacked-body-measure` (the lead measure, 56ch) — the editorial process list of
>    ref-meridian-04, replacing the h5 split in a 184 title track that read as a three-cell spec table.
>    The set drops the row's 16 inline inset (it is never linked, so it paints no hover ground), takes
>    `--gap-block` (24) as its block inset, and starts its first row on the set's top edge.
>    `--lcrd-step-title-track` is deleted. `--lcrd-number-baseline-offset-md` now steps at the h4
>    role's breakpoints (4 / 1 / 0, measured: at 4 the numeral sat 3px low at 1023 and 5px at 767).

## 1 · Identity

`ListCard` is one ruled row in a semantic list: an optional leading marker, a required title and
body, and, only when the row navigates, a trailing cue that is the row's one link-coloured part. It is Tier 2 because it consumes a
CMS-shaped content record and composes `Layout`, `Cluster` and `Icon`; a primitive may do neither.

It is not a bounded card. `BlockCard` supplies the filled or edged object that reads as a tile. It
is not a rich-text flow. `Prose` supplies typography and rhythm for CMS-authored markup with
multiple elements. It is not the list or the section around the list. `Layout` owns the seam
between rows, and the future `ContentSection` owns the band, content column and section heading.

The nearest component is `BlockCard`, but ruled versus bounded is a category boundary rather than
a finish prop. Adding `finish="ruled"` to `BlockCard` would make its object boundary optional and
would let authors switch between two different content models for rhythm alone. `ListCard` owns a bottom rule and **paints no fill at rest**. Hover and press do paint one, and the
distinction is the whole of the boundary: a fill at rest is a finish and would turn a list into a
stack of tiles, which is `BlockCard`'s job; a fill that exists only under the pointer is an
affordance. Section 5 and section 17 q3 record that change and why the original prohibition, written
against the rest case, does not reach this one.

The component appears on 53 routes in 70 sections. A list contains 2–12 rows; seven sample-finding
lists contain 10–12. A page may contain more than one such list, but each row belongs to exactly one
parent list.

## 2 · Anatomy

| Part      |         Required | Element / content                                                                | Values it owns                                                    |
| --------- | ---------------: | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `root`    |              yes | One `li`; the only legal outer element                                           | Full available inline size; no colour of its own                  |
| `frame`   |              yes | An `a` when `href` is present, otherwise an inert `div`                          | Row inset, focus ring and interactive state boundary              |
| `marker`  |               no | One slot filled by a formatted number, an `Icon`, or one `Media` in `fit="fill"` | `--lcrd-marker-ink` for the icon fill, `--lcrd-number-ink` for the number; the thumbnail BOX (`--lcrd-thumbnail-*`) — never the image's edge, which is Media's by kind |
| `content` |              yes | The group containing `title` and `body` — a wrapping `Cluster` when `split`, a one-track `Layout` when `stacked` | `split` or `stacked` arrangement; no colour of its own            |
| `title`   |              yes | A `span`, `h3` or `h4`, selected by `titleAs`                                    | `--lcrd-title-ink`, linked or not                                 |
| `body`    |   yes in the API | One paragraph; whitespace-only content emits no element                          | `--lcrd-body-ink` and `--measure-body`                            |
| `cue`     | **deleted 7 Oct 2026** | — The arrow cue is gone. An external item keeps a small (16) `arrow-right-up` after the title and a visually hidden "(opens in a new tab)" at the end of its name | The title carries the link ink on hover, focus and press                 |
| `action`  | opt-in, linked only | `ctaLabel`: the link `Button` (`as="span"`, `emphasis="link"`, `tone="primary"`, `arrow-right` or `arrow-right-up`) a `block` under the copy, pinned to a tile's foot | Button's own tokens; the frame carries `data-btn-link-group` |
| `rule`    |              yes | The root's block-end hairline                                                    | `--lcrd-rule-ink`; one width and one colour in every state         |

The title's ink does not depend on `href`, matching the same change in `BlockCard`: a linked row is
recognisable by its arrow, not by a blue heading, so `--lcrd-link-ink` is worn by the cue alone.

The `rule` is the row's own block-end hairline, at one width on every surface and in every state. The
interactive overlay that used to wipe across it and double on press is gone; do not read the two as
the same thing, because removing the wipe did not remove the rule.

**The rule is decoration in every state.** It briefly carried hover on 25 Aug and does not any
more: the fill replaced it the next day, because a rule signals along one edge of the target while a
fill covers the target. One width, one colour, no states.

**The `ground` is the hover affordance.** It has no element of its own — it is the frame's own
background — and it exists only while a pointer is on a linked row. That matters because the target
is the entire row, up to 1240px wide and about 82px tall, and what the redesign left behind when it
removed both the wipe and the linked title's colour was an 18px arrow at the far inline end changing
one shade of blue. Nothing that size is feedback for a box that size.

It is a **ground**, not a `bg`, and the word is load-bearing. Rule 4 gives a surface a ground and an
ink, and a control a bg and an fg, and never mixes them; every other colour this component owns is an
`-ink`, so the row is in the surface register. `Button` writes `--btn-ghost-*-bg` because a `Button`
is a control with an `fg`. These tokens were briefly called `--lcrd-fill-*`, which is neither
register and appears nowhere else in the system.

The marker is one anatomical slot. `number`, `icon` and `thumbnail` name fills of that slot, not
variants, sibling components or independent child positions. Omitting the marker omits both its
element and the `--gap-block` seam beside it.

## 3 · Props / API

| Prop          | Exact type / literal union                                                                                                 | Default   | What it decides                                                                    |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------- |
| `title`       | `string`                                                                                                                   | required  | The row's primary label                                                            |
| `body`        | `string`                                                                                                                   | absent    | The one explanatory paragraph. Optional since 1 Oct 2026: absent renders no paragraph and no seam; present but blank warns |
| `marker`      | `{ type: 'number'; value: number } \| { type: 'icon'; name: IconName } \| { type: 'thumbnail'; image: MediaImage }` | absent    | Which one fill occupies the marker slot; `IconName` is Icon's glyph union, `MediaImage` is Media's record |
| `form`        | `'row' \| 'tile'` | `'row'` | 1 Oct 2026. `row`: a row of a one-column list, rule at block-end, marker beside. `tile`: an item in a grid track, rule at block-start, marker above, always stacked, flush — `arrangement` is `never` with it. See Amendment · 1 Oct 2026 |
| `arrangement` | `'split' \| 'stacked'`                                                                                                     | `'split'` | Whether title and body are two tracks from `md`, or one stack at every width       |
| `titleAs`     | `'span' \| 'h3' \| 'h4'`                                                                                                   | `'span'`  | Heading semantics only; visual type does not change                                |
| `size`        | `'md' \| 'sm'`                                                                                                             | `'md'` on a row, `'sm'` on a tile | 5 Oct 2026. The type step, passed by the set: `sm` for four rows or more, and every tile. See Amendment · 5 Oct 2026 |
| `href`        | `string`                                                                                                                   | absent    | A non-blank value makes the whole frame one anchor and causes the cue to render    |
| `external`    | `boolean`                                                                                                                  | `false`   | The destination leaves tcules.com: new tab, the "leaves the site" cue glyph and the hidden new-tab hint. Ignored without a destination |
| `cue`         | `'end' \| 'title'`                                                                                                        | `'end'`   | **6 Oct (cmp-services).** `title`: a linked row's arrow follows the title's last word and the title takes the link ink on hover (BlockCard's model); no hover ground, so no 16 inline inset. Ignored on a tile or without a destination. On an external row the off-site glyph follows the title in the same way, and the hidden new-tab hint moves inside the title with it. (The phone thumbnail size is a separate, site-wide rule: see § 7.) |

**28 Sep 2026 (2.11).** The thumbnail member carries a whole `MediaImage` record — the shape a page
receives from `@/content` — and ListCard hands it to `Media` untouched with `fit="fill"`,
`sizes={LIST_CARD_THUMBNAIL}` (`src/lib/image-sizes.ts`, never a restated literal) and no `priority`, so
it is lazy and async. ListCard owns the **box** (160 inline, `--ratio-cover` 3:2, `overflow: hidden`) and
the blank-source guard; `Media` owns the srcset, the loading and the **edge by kind**. The record's `alt`
is required even when its correct value is the empty string.

The discriminant is **`type`**, not `kind` (Media § 17 Q7): the record has its own `kind` — capture,
cut-out, illustration, photograph — and two fields of that name one level apart invite a spread that
overwrites one with the other. PageHero and BlockCard made the same switch. Every route call site was
migrated in the same change (`kind: 'number'` → `type: 'number'`, ten files).

*Which rows may carry one* is a supply rule, not a type: per ruling C1 and ch05 § 9, only case-study and
insight/resource rows, and the image is one cut-out part or one illustration shape. The pattern cannot
tell a case study from a glossary term, so the route decides whether to pass one.

Deliberately not props:

- `surface`, colour and tone: the nearest `data-surface` ancestor resolves all `--lcrd-*` colour
  tokens. The row does not own a ground.
- `finish`, `filled`, `selected` and `active`: only ruled ships; no selected content need exists.
- `cue`, `cueIcon` and `cueLabel`: `href` is the single source of truth, and `arrow-right` is one
  system decision.
- density, padding, gap, radius, height and width: one rhythm prevents a 12-row list becoming
  twelve individually tuned objects. `size` is the exception, and a narrow one (5 Oct 2026): it
  steps the title and body roles only, `md | sm`, and is set once per set by the route, so a list
  still has one size, never twelve.
- `className`, `style` and arbitrary DOM attributes: they would reopen colour, distance and box
  geometry from the call site.
- `children`: the closed strings prevent a second heading, nested action or rich-text flow from
  entering the row. `Prose` belongs outside this content shape.
- `onClick`, `target` and button state props: a linked row is navigation through a native anchor,
  while a static row is inert.

Compile errors, not review comments:

1. A marker cannot carry more than one of `value`, `name` or `image`; the discriminated union
   makes the other members impossible.
2. A thumbnail marker without a complete `MediaImage` (`src`, `alt`, `width`, `height`), an icon
   marker without `name`, or a number marker without `value` cannot compile.
3. A third arrangement, title element or arbitrary glyph name cannot compile.
4. A missing `title` cannot compile. (`body` is optional since 1 Oct 2026.) `form="tile"` with any `arrangement` cannot compile.
5. There is no cue prop, so a static row with a cue and a linked row without one are both
   unrepresentable.

## 4 · Variants × sizes

| Arrangement | At either size (`md` or `sm`, 5 Oct 2026)                                                       | Intended use                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `split`     | Title and body share a line while both minimum tracks fit the row's own width, and stack when not (2.17; no breakpoint) | The 21 title-left / body-right sections; default because it is the highest-volume arrangement    |
| `stacked`   | Title above body at every width                                                                 | The 11 title-plus-body sections and sequences whose lead-in must remain attached to its sentence |

**Amended 5 Oct 2026:** there is a `size` prop, `md | sm`, and no `lg` (Amendment · 5 Oct 2026). Marker fill, link presence and
heading semantics do not create variants: they change content or semantics, not the row's design
role. The title/body role, row inset, rule, cue and icon sizes do not step between arrangements.

The filled finish was considered and rejected. Without a selected or interactive meaning it would
be a neutral rhythm choice, turning the list into a stack of `BlockCard`s and erasing the boundary
this component exists to hold.

## 5 · States

Static rows have only rest. They do not respond to a pointer and do not enter the tab order.

| State           | Trigger                              | Parts that move                                                                              |
| --------------- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| rest            | Base rendering                       | Nothing moves. Title and body hold their own inks; marker and numeral carry the blue accent (fdn-blue, 6 Oct 2026). No arrow (7 Oct 2026) |
| hover           | Pointer over a linked frame          | The title takes `--lcrd-link-ink` (not with an action: the action moves instead). Open tile: the opening rule takes `--lcrd-link-ink`. Boxed tile: the frame paints `--lcrd-ground-hover`. Rows paint no ground (7 Oct 2026) |
| focus, keyboard | `:focus-visible` on a linked frame   | Exactly the hover rendering plus the two-part ring from `--lcrd-ring-color` and `--lcrd-ring-gap-color` |
| pressed         | Pointer activation on a linked frame | The title steps to `--lcrd-link-ink-pressed`; a boxed tile's ground to `--lcrd-ground-pressed`           |

The paragraphs below record the 26 Aug row ground and the ghost model it took. Both were removed on 7
Oct 2026 with the arrow cue; they stand as history.

**Hover moves one thing and press moves two**, which is `Button`'s ghost model rather than an
invention here. Ghost moves its background under the pointer and its foreground only on the click;
so the row's ground arrives on hover, the cue holds its rest ink through hover, and the press deepens
the ground and steps the cue together. A ground appearing across 1240px and a glyph changing shade
are one event, so they are not signalled twice — and press stays clearly distinct from hover because
it is the only state where two things move.

Colour is the only thing either changes — no width moves, nothing wipes, nothing transforms. The
mechanism the original spec used for hover is gone and has not been replaced with another one.

The values are ghost's neutral steps per surface, unchanged: neutral-100/200 on paper, 200/300 on
tint, 900/800 on ink, brandeis-600/700 on blue. Ghost already answers "a quiet field appears under
the pointer" on all four surfaces, and answering it a second way here would be two answers to one
question. It is also why the ground needs no argument about which direction to move on a dark
surface: ghost settled that.

`--lcrd-link-ink-hover` was **deleted**. With the cue holding through hover nothing moves to it, and
a state token whose value never moves does not exist.

Two earlier attempts are recorded because the sequence is the argument. Hover on the **cue alone**
was wrong — a one-step colour change on an 18px glyph at the far end of a 1240px row is not feedback
a pointer user notices. Hover on the **rule's colour** was better and still wrong — it signals along
one edge of the target instead of across it. Removing the wipe was right; the two attempts to replace
it with something smaller than the target were not.

Focus is exactly the hover rendering plus the two-part ring, so keyboard focus is never carried by
colour alone — which makes the ring load-bearing rather than decorative, and is why section 6 measures
it against its own gap on all four surfaces.

Held, disabled, expanded, busy, loading and error are excluded. A navigation row is neither a
selectable option nor an unavailable action; nothing opens and nothing asynchronous happens. Their
token absences are assertions, not omissions.

## 6 · Per-surface colour

Every value is declared again in every surface block. Ratios are measured against that column's
ground: `--color-paper`, `--color-paper-deep`, `--color-neutral-950` and
`--color-brandeis-500`, respectively.

| Token                     | paper                                           | tint                                            | ink                                             | blue                                        |
| ------------------------- | ----------------------------------------------- | ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------- |
| `--lcrd-title-ink`        | `--color-neutral-900` — 14.62:1                 | `--color-neutral-900` — 13.06:1                 | `--color-white` — 17.26:1                       | `--color-white` — 6.23:1                    |
| `--lcrd-body-ink`         | `--color-neutral-700` — 8.14:1                  | `--color-neutral-700` — 7.27:1                  | `--color-neutral-300` — 11.07:1                 | `--color-brandeis-50` — 5.57:1              |
| `--lcrd-marker-ink`       | `--color-brandeis-500` — 6.17:1                 | `--color-brandeis-500` — 5.51:1                 | `--color-brandeis-300` — 7.32:1                 | `--color-white` — 6.23:1                    |
| `--lcrd-number-ink`       | `--color-brandeis-500` — 6.17:1                 | `--color-brandeis-500` — 5.51:1                 | `--color-brandeis-300` — 7.32:1                 | `--color-brandeis-200` — 3.78:1             |
| `--lcrd-link-ink`         | `--color-brandeis-500` — 6.17:1                 | `--color-brandeis-500` — 5.51:1                 | `--color-brandeis-300` — 7.32:1                 | `--color-brandeis-100` — 4.91:1             |
| `--lcrd-link-ink-pressed` | `--color-brandeis-700` — 10.07:1                | `--color-brandeis-700` — 8.99:1                 | `--color-brandeis-50` — 15.44:1                 | `--color-brandeis-50` — 5.57:1              |
| `--lcrd-rule-ink`         | `--color-neutral-300` — n/a, decoration         | `--color-neutral-400` — n/a, decoration         | `--color-neutral-700` — n/a, decoration         | `--color-brandeis-300` — n/a, decoration    |
| `--lcrd-ring-color`       | `--color-brandeis-500` — 6.17:1 against its gap | `--color-brandeis-500` — 5.51:1 against its gap | `--color-brandeis-300` — 7.32:1 against its gap | `--color-white` — 6.23:1 against its gap    |
| `--lcrd-ring-gap-color`   | `--color-paper` — paired ring 6.17:1            | `--color-paper-deep` — paired ring 5.51:1       | `--color-neutral-950` — paired ring 7.32:1      | `--color-brandeis-500` — paired ring 6.23:1 |

**Paper.** The title sits at neutral-900 whether or not the row navigates, while the body drops to
neutral-700 so a row reads title first without sacrificing AA. The cue is neutral-900 at rest, takes
brandeis-500 on hover and focus and 700 on press (6 Oct 2026, below); hover is also carried by the
row's neutral-100 ground (§ 5, 26 Aug). The cue is the only ink in the row that moves. The neutral-300 rule is
deliberately quieter than text and stays at that one value in every state.

**The number is not the marker, for colour.** `--lcrd-marker-ink` keeps the title's ink for the icon
fill; `--lcrd-number-ink` is the ordinal's own. The split is deliberate: an ordinal is chrome and an
icon names the subject, so one token would have forced a choice between a shouting number and a
receding subject glyph.

It sits **one step quieter than the quiet-label ramp** used by `--crumb-link-ink`,
`--foot-label-ink` and `--bcrd-eyebrow-ink`. A 20px numeral carries further than a 12px label and has
to give more back, and colour — not size — is where this component gives it. On the two light
surfaces that means stepping toward white; on ink and blue it means stepping **toward the ground**,
which is the opposite direction in hex and the same direction in emphasis.

At rest every cell clears 3:1 (3.16 to 5.41:1; only ink's clears 4.5), and on paper's hover and
pressed grounds the numeral falls to 2.68 and 2.37:1, an accepted cost. That is the deliberate part
rather than an oversight. The numeral is `aria-hidden` and the parent `<ol>` carries the order, so it is a visible
mark duplicating semantics the markup already states — the same argument `--fig-rule-ink` makes at
1.90:1. The moment it becomes the only source of the order, it has to come back up to 4.5:1.

**Tint.** Title, body and marker can keep their paper steps: each still clears its floor on
paper-deep. The cue is also restated unchanged because brandeis-500 and 700 both clear AA here. The rule moves to neutral-400 so it remains present against the deeper ground without
competing with the copy.

**Ink.** Title and marker lift to white and body to neutral-300. The cue lifts to brandeis-300
at rest, holding through hover, and 50 on press, because brandeis-500 reaches only 2.77:1 on this
ground. The
rule drops to neutral-700 so twelve adjacent separators do not turn into a ladder louder than the
content.

**Blue.** The available light ramp is narrow: the cue is brandeis-100 at rest and through hover, and
brandeis-50 on press; both clear 4.5:1, and hover is the brandeis-600 ground. The title and marker are white, body is
brandeis-50, and the decorative rule is brandeis-300. With the pressed rule width gone, the two cue steps and the
two ground steps are the whole of the state model on this surface, which is why none may be lightened and
why the white focus ring against its brandeis-500 gap matters most here.

**The ground re-measures every ink above it.** The table's ratios are against the surface. On hover
and press the row's own ground changes, and these are the numbers that matter then:

| Part   | paper hover / press | tint hover / press | ink hover / press | blue hover / press |
| ------ | ------------------- | ------------------ | ----------------- | ------------------ |
| title  | 12.37 / 10.97       | 10.97 / 9.46       | 14.75 / 11.92     | 7.59 / 10.16       |
| body   | 6.89 / 6.11         | 6.11 / 5.27        | 9.46 / 7.64       | 6.79 / 9.09        |
| cue    | 5.22 / 7.55         | 4.63 / 6.52        | 6.26 / 10.66      | 5.99 / 9.09        |
| number | 2.68 / 2.37         | 3.69 / 3.19        | 4.62 / 3.73       | 4.61 / 6.17        |

Title, body and cue clear 4.5:1 in every cell. The cue's hover column is its REST ink measured on the
hover ground, since that is what it now holds there; its pressed column is `--lcrd-link-ink-pressed`
on the pressed ground. Several cells improve, because a ground that darkens a light surface raises the
contrast of dark text on it.

**The number is the one cell that does not, and it is a deliberate accepted cost.** On paper it reads
3.16:1 at rest and dips to 2.68:1 under the pointer. It stays defensible on the same grounds section 6
already states — the numeral is `aria-hidden`, the parent `<ol>` carries the order, and it is a
visible mark duplicating semantics the markup states — but the earlier claim that "every cell clears
3:1" now holds **at rest only**, and this paragraph is the correction rather than a footnote. Stepping
`--lcrd-number-ink` to neutral-600 on paper would hold 3:1 through hover at the cost of the quietness
that was asked for; that is the trade, and it is the owner's to reverse.

**Nested surface.** `ListCard` reads only the nearest `data-surface` ancestor. A tint panel inside
an ink section resolves the complete tint column, including ring and gap; no value leaks from ink.
The component does not receive a `surface` prop and never paints the panel ground.

## 7 · Geometry & spacing

### (a) Distances — gap-scale roles

- Parent list rows: `Layout rowGap="none"`. Adjacent ruled rows share an edge; there is no outer
  seam to hide the list relationship.
- Frame inset: **`--gap-gutter` on the block axis, `--gap-text` on the inline axis.** This is inner
  edge-to-content space, not outer spacing, and the asymmetry is the decision rather than a
  compromise — the two axes cost different things.

  Vertical space is free, because the page scrolls, so the block axis can be generous: 32 puts
  adjacent rows' content 64px apart and gives a title-only row about 98px of height. Inline space is
  scarce: every pixel is a pixel of copy width, and on a phone it is a pixel out of 311. So the inline
  axis takes the smallest container-inset role that does its job, which on that axis is small — keep
  the copy off the edge of the hover ground, nothing more. 16px clears it visibly; ghost itself uses 8.

  Both are container-inset roles, and the scale names exactly three: `--gap-tight` "chip padding",
  `--gap-text` "cell padding", `--gap-gutter` "container gutter". `--gap-block` (24) sat on both axes
  for one revision and was the wrong ROLE on either — "head to body inside a block" is a distance
  between two pieces of *content*, not a container's own inset. That is the mistake the scale's own
  rule warns about: **a step is chosen by what it separates, never by how it looks at one width.**

  `--gap-gutter` was also tried on the inline axis and is too expensive there. At 32 a 375px phone
  spends 128px of its width on padding — 64 in the Section gutters, 64 in the row, 34% of the screen —
  and the `xs` stress track falls to 128px of copy, roughly eight characters of an h4 title per line.
  The argument for it was that `--sec-gutter` is also `--gap-gutter`, so the copy would sit the same
  distance inside the row as the band sits inside the viewport. A row's ground is not a viewport, and
  two things sharing a number is not a reason.
- Marker to the content/cue core: `Cluster colGap="block"`; when the outer cluster wraps, its
  wrapped line seam is `rowGap="block"`.
- Stacked title to body: `Layout rowGap="text"` (`tight` until 5 Oct, S3).
- Split title to body: **`Cluster colGap="block"`, `rowGap="text"`** (29 Sep 2026, 2.17; the wrapped
  seam `tight` until 5 Oct, S3). Was `Layout
  colGap="column"` (64). The split is now a wrapping `Cluster`, and its seam is chosen by what it
  separates: a title and the sentence it heads are head and body of one block, which is `--gap-block`'s
  role, not "two halves that must read as separate", which is `--gap-column`'s — the opposite of what
  a coupled row wants. When the body wraps under the title the line seam is `text`, the same step the
  stacked arrangement uses, so a split row that has wrapped is indistinguishable from a stacked one.
- Content to cue: `Cluster colGap="block"`.
- Frame inline inset: `--gap-block`, uniform with the block inset. This section previously read "no
  inline frame inset, `Section` already aligns the row to the 1240px content column" — which was true
  and was an argument that the inset was *unnecessary*, not that it was wrong. The hover ground made
  it necessary: without it the copy sits flush against the edge of a band painted under it, which is
  the thing `--btn-padding-x` prevents on a ghost `Button`.

  It is safe at every width because of the box model rather than the value. `box-sizing: border-box` is
  global, so padding comes OUT of the row's inline size and can never widen it; with
  `min-inline-size: 0` on the root and the content, the copy wraps instead of overflowing. Content widths: 1208px in the full band, 279px on a 375px phone after the 32px gutters, 224px at the
  `sm` stress track and 160px at `xs`. `--sec-gutter` is `--gap-gutter` at every width with no responsive
  override, so none of those figures moves with a breakpoint, and the gap scale's own rule forbids
  swapping the step at one.

  The consequence, stated rather than buried: the copy now sits 16px inside the content column and no
  longer aligns with a section heading directly above it — a subtle step at 16 rather than the clear
  hierarchy indent 32 produced — while the rule and the ground still span the
  full column. That is the reference's own relationship — full-width rule, inset content — and it reads
  as the rows belonging under the heading. The rejected alternative was bleeding the ground outside the
  column with a negative inset, which keeps the alignment and breaks inside a nested `Section` panel, a
  two-column track and any narrow harness.

### (b) Component sizes

- A row, at either size, has no fixed height and fills the available inline size. A title-only
  linked `md` row measures about 98px high: one h4 line at 33.6px plus two `--gap-gutter` insets; an
  `sm` row about 92px (one h5 line at 28.2px plus the same insets). Both clear 44px with room to
  spare and need no hit extension. It was ~56px at the h5 title and the old `--gap-text` inset.
- `xs` content core minimum: `--lcrd-content-min-xs` is 192px, measured against Layout's existing
  `xs` track. It keeps a number or 24px icon beside readable copy and causes the larger thumbnail to
  wrap above the core before the copy collapses. Since the inline inset arrived, a 192px *track* hands the row 160px of content, which is below that
  minimum — so `min(100%, 192px)` resolves to 160px, the outer `Cluster` wraps the marker above the core, and the
  copy wraps. That is the designed
  degradation rather than a new edge case, and it is why the minimum is written with `min()` rather
  than as a floor.
- Split minimum tracks: `--lcrd-title-min` and `--lcrd-body-min`, both 256px (29 Sep 2026, 2.17). They
  are the flex bases of the split's title and body, so they decide WHEN it splits: only while 256 +
  24 + 256 = 536px of copy fits the row's own content width. The title's 256 also holds an h4's longest
  word whole (a 14-letter word is about 200px at h4), and the body's keeps a sentence beside a title
  above ~28ch. Growth runs 2:3 (the split's old weighting) until each child reaches its measure —
  `--measure-title` and `--measure-body` — and that is the **width cap**: the split is never wider than
  the title track plus the seam plus the body's measure, and the leftover on a wide row collects at the
  core's inline end before the cue. By value rather than `--lay-track-sm` (token rule 6).
- Number marker: no box size. Two-digit formatting and `--text-index` supply a stable optical column
  for the expected 1–12 range.
- Icon marker: `Icon size="xl"`, resolving to `--icon-size-24`.
- Cue: `Icon size="lg"`, resolving to `--icon-size-18`.
- Thumbnail marker: `--lcrd-thumbnail-inline-md` is 160px and `--lcrd-thumbnail-ratio` is 3:2,
  measured as a recognisable landscape sample at the full 1240px row while still wrapping cleanly
  before a 192px content core is squeezed. `Media` in `fit="fill"` covers that box from `--media-fill-position` (inline start, 20% down);
  a B5 cut-out on its contrast panel takes Media's `inset="text"` (`--gap-text`, 16) inside it, leaving
  128 × 75 of part. It kept Media's `--gap-gutter` until 29 Sep 2026 and was left 96 × 43 (§ 17 q8).
- Thumbnail marker below md: `--lcrd-thumbnail-inline-sm` is 96px, at the same 3:2 (96 × 64), on
  **every** row with a thumbnail below 768 — cued by the arrow at the end or after the title, linked
  or not; tiles keep their own geometry (cmp-services, 6 Oct 2026). At 160 the thumbnail wrapped above
  the copy in the 326 phone column and every row became a photo with a caption under it; at 96 it
  stays beside its title and the row keeps its marker silhouette. A site-wide change to every phone
  thumbnail row, and the reason /design/list-card's 390 crops changed shape that day.
- Hidden hint: `--lcrd-hidden-size` is `--space-1`, the clip technique's own 1px geometry, duplicated
  by value from `--crumb-hidden-size` and SiteFooter's hidden label.

### (c) Optical corrections

**One, and it is the number's baseline.** `--lcrd-number-baseline-offset-md` is `--space-4` and
`-sm` is `--space-0` (5 Oct 2026: the correction is a function of the title's size, so it steps with
`size`), applied as `padding-block-start` on the number fill alone. Every other inset and seam is a gap-scale
relationship, every icon is sized by `Icon`, and the rule and focus ring use their own system
geometry.

It reaches the space ramp because it is not a distance between two things — it is a correction for
two different line boxes starting at the same top. The number is 20px/1.2 (a 24px box, baseline
~17.6px down); the title is now h4, 28px/1.2 (33.6px, baseline ~23px down); the outer `Cluster` is
`align="start"`. Without the offset the ordinal floats above the line it indexes; the arithmetic puts
that at ~5.4px, and the shipped value is `--space-4`.

The gap between those two numbers is the point rather than a rounding error. The calculation assumes
an ascent ratio per font family, and the mono and serif faces here do not match the assumption, so 4px
is what actually sits the numeral on the title's baseline when looked at. **An optical correction is
measured, not derived** — a value computed from nominal metrics and never checked against a render is
not an optical correction, it is a guess with arithmetic attached.

The value is a function of **both** type roles, which is the thing to remember about it. It was 8px
against the old 13px number; against the 20px number it is now **4 at `md` (h4) and 0 at `sm` (h5)**,
both measured in the browser on 5 Oct 2026 (at `sm`, 2 put the numeral 2px low). Change the number's
role or either title role and re-measure both values in the same edit.

`align="baseline"` on that `Cluster` is the typographically correct relationship and cannot be used:
the same marker slot holds a 160px thumbnail whose baseline is its bottom edge, so baseline-aligning
the slot would shove every thumbnail row. The correction belongs to the number alone.

Radius is `--radius-0`: a ruled row is not a rounded object. The block-end rule is
`--border-width-hairline` and there is no second width — `--lcrd-rule-width-pressed` was deleted with
the overlay it doubled, rather than left as a width nothing draws. There is no elevation shadow
(`--shadow-none`); the focus ring uses `--focus-ring-width` and `--focus-ring-offset`. The row stays
at `--z-base`.

## 8 · Typography

| Part                     | Type role        | Tracking                                   | Measure                              |
| ------------------------ | ---------------- | ------------------------------------------ | ------------------------------------ |
| `title`, `md` / `sm`     | `--text-h4` / `--text-h5` | `--text-h4-tracking` / `--text-h5-tracking` | `--measure-title`           |
| `body`, `md` / `sm`      | `--text-body` / `--text-body-sm` on a tile, `--text-body` on a row (6 Oct 2026) | none — these roles have no tracking companion | `--measure-body`     |
| Number fill in `marker`  | `--text-index`   | `--text-index-tracking`                    | none — one expected two-digit marker |
| Icon and thumbnail fills | none             | none                                       | none                                 |
| `cue`                    | none — an `Icon` | none                                       | none                                 |

The component aliases the first three roles through `--lcrd-title-text-{md,sm}`,
`--lcrd-title-tracking-{md,sm}`, `--lcrd-body-text-{md,sm}`, `--lcrd-marker-text` and
`--lcrd-marker-tracking`. `titleAs` changes element semantics, never the visual role.

All copy renders verbatim in sentence case: the title and body are sans, so the mono rule does not
reach them. Example: “Recruit participants with the right product context” and “Define who needs to
be represented before the sample is recruited.” Numbers render with at least two digits (`01`–`12`)
and are never bullet characters — the marker is the file's one mono part and states
`text-transform: var(--text-mono-case)` beside its font, which a numeral has nothing to do with. It
is stated so that every mono rule in the system looks the same and no omission has to be read as a
decision. **Amended 25 Aug 2026:** this paragraph read "There is no text transform" before mono's
case moved to the token layer.

**The number's role changed on 25 Aug 2026, and this is the argument.** It shipped as `--text-stat`
and is now `--text-index`. `--text-stat` is 40px; the title was an h5 at 22px. That made the ordinal
almost twice the size of the content it indexes, and the loudest element in every row — a hierarchy
inversion rather than a matter of taste. The role was the mistake, not the size: `--text-stat` is for
a number that IS the content, the way a metric is in `Proof`, and a position in a list is a label.

*Historical (superseded 25 Aug 2026 by `--text-index`, the 20px mono role added for exactly this
gap; the two paragraphs below record the reasoning that led to it).* There was deliberately no
middle step. The mono ramp ran 11, 12, 13, 14 and then jumped to 40, so a
mono numeral is either a metric or a label with nothing in between to retreat to. Inventing a 24px
mono step to split the difference is what the token rules forbid: a size that is not on the ramp is
a mistake or a new step, and this is neither.

`--text-ui` over `--text-eyebrow` — both mono semibold, one pixel apart — because of tracking.
Eyebrow opens to 0.12em, which visibly splits the two digits of “01” into two marks, while ui's
0.08em holds them as one. Size and tracking move together here as everywhere.

**Colour is the lever, not size.** The first attempt at this de-emphasis took the number to
`--text-ui` at 13px and was wrong: at that size it stopped competing with the title and stopped
indexing the list, becoming a caption rather than a mark. The ordinal wants to stay large and give
its weight back through ink, which is what section 6 does. `--text-index` at 20px sits well under the h4 title's 28px — present enough to scan a
twelve-row list by, quiet enough that the title leads. The
baseline correction in section 7(c) is the third part: a large numeral floating above the line it
indexes reads as a misalignment however light it is.

## 9 · Responsive

At 1023, no component arrangement changes. The existing h4 and index roles resolve their
tablet values from the type layer; `ListCard` does not restate them.

At 767, nothing changes either — **`split` has no breakpoint** (29 Sep 2026, 2.17). It becomes one
track when the ROW can no longer hold both minimum tracks (§ 7(b)), whatever the viewport: a row in a
full 1240 column splits, a row in a 392px `lg:3` grid track stacks at 1440, and a phone's 326 column
stacks. Until 2.17 the split was Layout's `{ base: 1, md: [2, 3] }`, which switched on at the md
viewport regardless of the row's own track, squeezed the title into ~150px beside a 390 row's body
and, with `overflow-wrap: anywhere`, broke it mid-word ("Produ/ct", "Interactio/n"). Layout's `fit`
was considered and does not express this: its tracks are equal, so it loses the title/body weighting,
and it has no per-track maximum, so it cannot cap the split at the two measures. A container query
was the other fallback and is unneeded — flex-wrap already answers "do both tracks fit on this line",
inside a primitive. `stacked` is unchanged. The outer `Cluster` remains content-driven: number and icon markers
fit beside the core in the normal Section track, while a thumbnail may wrap above the core when the
combined row no longer fits.

The inline inset does not move at any breakpoint and does not need to. On a 375px phone the Section gutters take 64px and the inline inset takes 32 more, leaving 279px of
copy —
narrower than desktop and still a readable measure, and the row cannot overflow because padding is
inside the border box. The cue remains at inline end of the core. This is what
holds a 12-row sample-finding block together: one full-width ordered list, two-digit markers, no
row gap, and one bottom rule per row — never a tiled card grid.

The gap scale does not shift responsively. Frame inset, title/body seam, marker seam and split
column gap keep the same roles. No component media query changes a type role. The whole linked
frame is the touch target and its smallest valid title-only rendering clears the 44px floor, so no
size step and no extended hit pseudo-element are needed.

## 10 · Composition

The future `ContentSection` receives the list as its child. `Layout` owns the list axis, the inner
wrapping `Cluster` owns the split title/body (a one-track `Layout` owns the stacked one), and
`Cluster` owns marker/content/cue relationships. `Button` is
not used: a Button is one labelled control and cannot wrap a whole row without creating a nested
or duplicate action. `Prose` is not used: one plain paragraph is not a CMS rich-text flow.

```jsx
<Layout as={numbered ? 'ol' : 'ul'} rowGap="none">
  <li>
    <Frame as={href ? 'a' : 'div'}>
      <Cluster colGap="block" rowGap="block" align="start">
        {marker /* number · Icon · <span box><Media fit="fill" sizes={LIST_CARD_THUMBNAIL} /></span> */}
        <Cluster colGap="block" align="start" nowrap>
          {split ? (
            /* wraps when --lcrd-title-min + block + --lcrd-body-min no longer fits the row */
            <Cluster colGap="block" rowGap="text" align="start">
              {title /* flex: 2 1 --lcrd-title-min, max --measure-title */}
              {body /* flex: 3 1 --lcrd-body-min, max --measure-body */}
            </Cluster>
          ) : (
            <Layout rowGap="text">
              {title}
              {body}
            </Layout>
          )}
          {href ? (
            <span>
              <Icon name={external ? 'arrow-right-up' : 'arrow-right'} size="lg" />
              {external ? <span className="hint"> (opens in a new tab)</span> : null}
            </span>
          ) : null}
        </Cluster>
      </Cluster>
    </Frame>
  </li>
</Layout>
```

**Who owns the list element — the caller, and on purpose (28 Sep 2026, 2.11).** The `ol`/`ul` is
the caller's `Layout as`, not the row's. `Layout` owns the list axis and the zero seam, and a row
cannot see its siblings; a pattern that wrapped the list would be a pattern importing a pattern or a
second `Layout`. It is also how every set is composed today, checked across all 22 route call sites:
each numbered set is `Layout as={numbered ? 'ol' : 'ul'}` with `marker={numbered ? { type: 'number', … }
: undefined}`, one boolean driving both, and the three always-numbered sets (about, future-interfaces-lab
join, the ContentSection specimen) are `Layout as="ol"`. No numbered set renders as a `ul`.

`Frame` above names the component's conditional native `a` or `div`; it is not a new primitive.
The core receives only local child sizing so it can grow and keep its 192px minimum; all actual
arrangement remains in `Layout` and `Cluster`. There is no hand-rolled grid or flex, no margin on a
child, and no override of `Section` ground, gutter or content column from outside.

## 11 · Accessibility

Each component is an `li`. Numbered sequences must use an `ol`; term and linked lists use a `ul`.
An `href` wraps the entire frame in one native anchor, producing one focus stop. A static frame is
an inert `div`. `titleAs="h3"` or `"h4"` provides a heading only where the page outline needs one;
the default `span` prevents every term in a definition-like list from polluting the heading map.

| Key         | Linked row                                 | Static row       | Why                                      |
| ----------- | ------------------------------------------ | ---------------- | ---------------------------------------- |
| `Tab`       | Moves focus to the row anchor in DOM order | Skips the row    | Native link order; no synthetic tab stop |
| `Shift+Tab` | Moves to the preceding focusable element   | Skips the row    | Native reverse order                     |
| `Enter`     | Activates the anchor and navigates         | Unbound          | Native link contract                     |
| `Space`     | Scrolls the page                           | Scrolls the page | A link is not a button                   |
| Arrow keys  | Unbound                                    | Unbound          | This is a list, not a composite widget   |
| `Escape`    | Unbound                                    | Unbound          | Nothing opens or captures focus          |

Focus order follows list order, with only linked rows included. The component has no internal state
change and never moves focus; after navigation, the destination document and browser own focus.

ARIA is deliberately small:

- The cue's `Icon` has no label, so the existing component emits `aria-hidden="true"`.
- Number markers are `aria-hidden="true"`; the parent `ol` supplies order semantics without
  announcing “one” twice. The visual value must match the row's authored order.
- Icon markers have no label because the title names the same subject; they are decorative.
- Thumbnail alternative text comes from the record's required `alt`, rendered by `Media`. An empty
  string is allowed only when the title/body fully repeat the image's information — which is the
  usual case for a cover (ch05 § 9a: the title names what it stands for).
- An **external** row's name ends with a visually hidden "(opens in a new tab)", inside the anchor
  after the aria-hidden glyph, so a screen reader hears the title first and the new tab last. It is
  clipped (`clip-path: inset(50%)`, 1px), never `display: none`, which would drop it from the tree.
- No `role`, `aria-current`, `aria-disabled`, `aria-expanded`, `aria-controls`, `aria-describedby`
  or busy attribute is emitted.

No ids are generated and there are no id references. Consequently there is no absent target for
`aria-controls` to point at.

Keyboard focus uses `:focus-visible` only. It shows the hover cue ink plus a `--focus-ring-width`
ring separated by `--focus-ring-offset` in the surface's own gap colour. The ring-to-gap ratios are
6.17:1, 5.51:1, 7.32:1 and 6.23:1. Text and meaningful glyphs meet 4.5:1 in every live state; the
quiet base rule is decoration and does not participate in any state.

Hover reaches the rule as well as the cue, so a pointer user gets a signal that spans the target
rather than one 18px glyph at the end of it. Both are colour changes; nothing in the component
transforms, so there is no reduced-motion clause to write. The ring remains the only non-colour
signal and the only one a keyboard user depends on, which is why it is measured against its own gap
on all four surfaces rather than treated as a default.

A screen reader encounters a static numbered item as: “List, 12 items. Research plan. Define who
needs to be represented before recruitment.” It encounters a linked item as: “Service design. Map
the end-to-end service and expose operational breaks, link.” An external one adds “(opens in a new
tab)” before “link”. It does not announce the visual number,
subject icon or arrow a second time.

## 12 · Content edge cases

| Case                                      | Required handling                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Longest realistic string                  | Title and body wrap without clamp or truncation. Their measures cap line length; the row grows on the block axis and the rule stays at its bottom edge. Test an 80-character title and 240-character body.                                                                                                           |
| One long unbroken token (a URL)           | The body may break the token anywhere before it overflows (`overflow-wrap: anywhere`). The title breaks only between words (`break-word`, 29 Sep 2026): a title word is broken only when it alone is wider than the whole row, which is an illegal sub-xs parent. The cue and marker remain in their own boxes. |
| Zero items                                | The caller omits the parent list; do not render an empty `ul` or `ol`. `ListCard` itself is not called.                                                                                                                                                                                                              |
| One item                                  | Render one `li` with its bottom rule. The rule is the row's finish, not a separator inserted only between siblings.                                                                                                                                                                                                  |
| Many items (2× expected)                  | Render 24 rows in one vertical `Layout rowGap="none"`; no pagination, clamping, equal-height rule or multi-column tiling.                                                                                                                                                                                            |
| Missing image or missing optional slot    | Omitting `marker` removes its element and seam. A thumbnail member requires a whole `MediaImage`; a blank runtime `src` is treated as no marker with a development warning, never as an empty frame or placeholder. A record with no `kind` renders as a capture (M3), hairline included — off-brand in a thumbnail (§ 17 q9).                                                                                                       |
| Empty required-ish text                   | A whitespace-only title makes the component render nothing and warn in development; an empty body omits the paragraph and warns but keeps the titled row. A blank `href` is treated as absent, so no anchor and no cue render.                                                                                       |
| Narrow track at 767                       | `split` is stacked; number/icon remain beside the core when they fit, and thumbnail may wrap above it. Measures and token-aware breaking prevent overflow.                                                                                                                                                           |
| Parent that does not size it              | The root fills one available line in a wrapping parent. The content core's named minimum is `xs` (192px), which forces the marker to wrap before copy becomes unreadable. The root has no hard minimum beyond the parent's available inline size, so a sub-192px parent wraps text instead of causing page overflow. |
| Logical properties rather than left/right | Marker is at inline start, cue at inline end, inset is block-axis and the rule is at block end. The current site is LTR; an RTL site must swap the directional cue to the existing `arrow-left` glyph at the composition boundary.                                                                                   |
| Surface nested inside a different one     | The nearest `data-surface` block redeclares all eleven colour tokens. A tint row inside ink uses the tint column in full.                                                                                                                                                                                              |
| Two components adjacent                   | Two rows in the same zero-gap parent produce one rule at their shared seam and one rule at the end of the second row; there is no top edge to double the seam.                                                                                                                                                       |
| Interactive content inside a slot         | Rejected. `title` and `body` are strings, icon/number fills are inert, and thumbnail media must not contain a link, button or control. The row anchor is the only possible focus target.                                                                                                                             |

## 13 · Motion

The cue's ink and the linked row's ground (`background-color`, since 26 Aug) transition with
`--duration-fast` and `--easing-standard`, aliased as `--lcrd-transition-duration` and
`--lcrd-transition-easing`. That is the whole of it.

The interactive overlay rule — the `Button`/`Breadcrumbs` wipe precedent along the row's own inline
axis — is gone, and with it the pressed width step. Nothing in the component transforms, translates,
scales, rotates, fades, changes opacity, animates a height, zooms a thumbnail or moves the cue.

Consequently there is **no `prefers-reduced-motion` block**, and its absence is the assertion rather
than an omission: a colour transition is not motion under the system's own reading, so there is
nothing for the preference to shorten. A future edit that adds a transform here must add the media
query in the same change.

## 14 · Do's and Don'ts

**Do**

1. Put every group of rows in `Layout as="ol"` or `"ul"` with `rowGap="none"`; inspect the rendered
   tree and the call-site diff.
2. Use `marker.type="number"` only inside an ordered list and keep the visual values in authored
   order; compare the marker text with the DOM item order.
3. Render the cue exactly when a non-blank `href` produces an anchor; count anchors and cues in the
   rendered tree and expect equal totals.
4. Show every linked frame as one focus stop whose box clears 44px; tab through the specimen and
   inspect the target overlay.
5. Render identical ListCard markup on all four surface bands and inspect resolved `--lcrd-*`
   values rather than passing a surface prop.
6. Use `titleAs` to match the page outline while preserving the visual type `size` sets (h4 at
   `md`, h5 at `sm`); compare the heading map with the computed type token.
7. Prove the title's ink does not depend on `href`: render the same row linked and static side by
   side and expect both computed title colours to be `--lcrd-title-ink`.

**Don't**

8. Do not add a rest background, surrounding edge or filled finish; inspect the module and expect
   no background at rest, no finish prop, and only the two state grounds (`--lcrd-ground-hover`,
   `--lcrd-ground-pressed`, § 5) on a linked row.
9. Do not give the title the link ink, or make any part but the row's ground, the cue and, on a
   tile, the opening rule change on hover or press; inspect computed styles in every state. A row's ground and a
   tile's rule are the two state carriers, and nothing else moves (amended 1 Oct 2026).
10. Do not restore the rule wipe or a pressed rule width, and do not confuse either with the row's
    own block-end rule, which stays; search the module for `::after` and `scaleX` and expect none.
11. Do not put a Button inside a linked row or interactive content in thumbnail media; tab order
    must contain one focus stop per linked row.
12. Do not add margin to any ListCard node; search the module for margin and expect exactly one
    declaration, the visually hidden `.hint`'s clip-technique margin (2.11, argued in its comment),
    and no layout margin.
13. Do not add hand-written grid or flex arrangement; search the module for those display modes and
    expect zero. `Layout` and `Cluster` must own every arrangement.
14. Do not change a gap or type role in a component breakpoint; compare the responsive rules with
    sections 8 and 9.
15. Do not clamp titles/bodies or hide rows after 12; the 24-row specimen must expose all content.
16. Do not add `surface`, `finish`, `cue`, `className` or `style` to the public props, and do not
    widen `size` past `'md' | 'sm'` (5 Oct 2026: `size` is public, and there is no `lg`); type
    checking an attempted call must fail.
17. Do not introduce a second marker slot or branch into marker-specific row components; inspect
    the public export and expect one `ListCard` and one `marker` prop.

## 15 · Specimen plan — `/design/list-card`

The exact block list, in order:

1. **Arrangement × size matrix.** Four cells: `split × md`, `stacked × md`, `split × sm` and
   `stacked × sm`, with identical term and definition copy, then numbered rows at `md` and `sm`
   side by side to prove the ordinal's baseline offset at each step (5 Oct 2026). The note states
   that the composing route passes the step, that `md` is a row's default and `sm` a tile's.
2. **Marker fill ladder.** Four rows in one list: number, icon, thumbnail and omitted marker. Label
   them as fills of one slot, not variants.
3. **Content-shape set.** A 5-row numbered sequence, a 5-row term list and a 3-row linked set. Use
   the real `ol`/`ul` semantics and show `titleAs="h3"` only on the linked set.
4. **States.** One static and one linked row at rest, plus a four-row reference naming rest, hover,
   focus and pressed. No state can be forced by a prop: hover, pressed and keyboard focus must be
   pointed at, held and tabbed to. Annotate that the cue is the only part that moves and colour the
   only thing that changes, that the row's own hairline is unanimated decoration, and that the ring
   is the one non-colour signal.
5. **All four surfaces as sibling bands with identical markup.** Each band contains the same two
   rows: one static numbered row to exercise title/body/marker/rule, and one linked icon row to
   exercise the dark title, cue ink and ring together. Print the matching section 6 surface paragraph
   beside each band.
6. **Nested surface.** A tint panel inside an ink band and an ink panel inside a paper band, with the
   eleven resolved colour tokens listed beside each rendering.
7. **Twelve-row sample-finding block.** Numbered `01`–`12`, full width, zero row gap. Inspect at
   desktop and at 767 to prove it remains one list rather than twelve tiles.
8. **Every section 12 edge case.** Thirteen labelled rows/blocks: long title/body; unbroken URL;
   zero items with visible empty harness; one item; 24 items; missing marker and missing thumbnail
   handling; blank title/body/href; 767 track; unsized wrapping parent; logical placement; nested
   surface; two adjacent; rejected interactive thumbnail shown as a contract note rather than
   invalid markup.
9. **Two adjacent.** Two rows in `Layout rowGap="none"`, with the shared seam and final rule called
   out.
2a–2d (added 28 Sep 2026, 2.11). **The thumbnail by kind** — cut-out (one part), illustration
    (one shape), capture and a kind-less record, the last two labelled off-brand; **the panel inset at
    160** — shipped `--gap-gutter`, the rejected `--gap-text` as a harness-only override, and the
    unpanelled part; **ordered and unordered sets** — `Layout as="ol"` with numbers beside `as="ul"`;
    **external rows** — internal, external, external with a thumbnail, and `external` without `href`.
    Block 5's surface bands gain a third row, an external cut-out thumbnail row, on all four grounds, and
    block 10's 326 row gains an external cut-out and a capture.
1a (added 29 Sep 2026, 2.17). **The split reads its own width** — the same three split rows (icon +
    link, no marker, thumbnail + external) in frames standing for the content column at 1440 (1240),
    1023 (960), 768 (704) and 390 (326), then ListCards in a 3-up grid across the column (~392px
    tracks) and a 2-up grid inside the 768 column (~336px). No title may break mid-word in any of them;
    § 2b now shows the shipped `inset="text"` panel beside the unpanelled part, with the `gutter`
    comparison moved to `/design/media` § 3c.
10. **Narrow tracks.** The same numbered, icon and thumbnail rows at 256px and 192px. The thumbnail
    must wrap before the content core collapses; the smaller track must wrap text without page
    overflow.
11. **Heading map.** The same row as `span`, `h3` and `h4`; visual type must be identical and the
    document outline must differ.
12. **What a static page cannot force.** A final note names pointer-down, keyboard focus and the
    exact 767 boundary, with manual instructions for each. Reduced motion is explicitly struck off
    with its reason: the wipe was the row's only transform and it is gone.

The squint test reads as five shapes: a two-column arrangement comparison, a marker-led ladder, a
four-band surface stack, one long ruled sequence and a pair of narrow stress tracks. The rule is a
shared cadence, not twelve repeated boxes.

## 16 · New token requests

**29 Sep 2026 (2.17): two component-layer geometry tokens, no request.** `--lcrd-title-min` and
`--lcrd-body-min` (both 256px) are the split's minimum tracks, § 7(b). Media's `inset="text"` reads the
existing `--gap-text`; nothing in the primitive or usage layers changed. `npm run vocabulary` was re-run.

**28 Sep 2026 (2.11): one component-layer geometry token, no request.** `--lcrd-hidden-size`
(`--space-1`) is the visually hidden hint's clip box — a technique's own geometry, duplicated by value
from Breadcrumbs rather than read (token rule 6). Nothing in the primitive or usage layers changed;
`npm run vocabulary` was re-run for it.

**Earlier: none — and the Cards 1a redesign removes one rather than adding any.**

The `--lcrd-*` names are this component's expected component-layer declarations, not new primitive
or usage requests. They resolve to existing colour ramps, type roles, measures, gap roles, icon
sizes, border widths, focus geometry, radius, shadow, z-layer, duration and easing. The 192px
content minimum and 160px thumbnail width are t-shirt-named component sizes measured in section 7,
not new space relationships. No new colour, gap step, type role, glyph or mechanism is needed.

`--lcrd-rule-width-pressed` was **deleted**. With the overlay gone nothing doubles the rule, and a
width nothing draws is an invitation to draw it again. No token changed value: the redesign moved
`--lcrd-link-ink` and its two states from the title-and-cue pair onto the cue alone, which is a
change of wearer rather than of palette. `BlockCard` also gains `--bcrd-eyebrow-ink` in the same
change; `ListCard` has no eyebrow and asks for nothing.

Because `docs/vocabulary.md` names tokens by value and is generated from the token layer, the removal
requires `npm run vocabulary` and a push of that file to the Claude Design project.

## 17 · Open questions

**1 · Thumbnail ownership, crop and empty state — ANSWERED, 21 Aug 2026.**

- **(a) Caller-owned media element in a ListCard-owned frame.** Keep the provisional
  `{ kind: 'thumbnail'; media: ReactElement }` member. The frame is 160px inline at a 3:2 landscape
  ratio, crops from centre to cover, and requires exactly one non-interactive media element. The
  media owns its alternative text and loading policy. Missing media collapses the marker with a
  development warning; there is no placeholder.
- **(b) ListCard-owned native image.** Replace `media` with required `src` and `alt` strings;
  ListCard owns the native image element, the same 3:2 crop and the empty behaviour.
- **(c) Caller-owned intrinsic media.** Keep a media element but do not crop it; intrinsic aspect
  ratio sets each row's marker height, and missing media collapses the marker.

**Recommendation: (a).** It follows the pattern-to-pattern composition rule used elsewhere: the
row owns placement and the caller owns the media source. A fixed frame keeps twelve rules aligned,
while no placeholder avoids inventing a second image treatment before the system has an Image or
Figure component. This answer changes the public union and thumbnail geometry, so implementation
must not start until the owner chooses.

**Answered: (b).** ListCard owns the native image element through required `src` and `alt` fields,
the 160px 3:2 centre crop, and the blank-source behaviour. A blank source collapses the marker and
warns in development; no placeholder ships. `alt=""` remains a deliberate, valid value when the
title/body already convey the image's information. This question no longer blocks implementation.

**2 · Two title/body arrangements or one option — non-blocking.** Options: two components; two
variants with different APIs; or one `arrangement` prop on one content shape. **Recommendation and
draft decision: one `arrangement: 'split' | 'stacked'` prop**, defaulting to `split`. Audit and hub
pages then choose explicitly without changing their content record, which is the inconsistency the
brief asks the system to remove.

**3 · Whether a filled finish ships — draft decision PARTLY OVERTURNED, 26 Aug 2026.** Options: ruled
only; a neutral filled finish; or a filled selected/interactive state. The draft decision was **ruled
only**, on the grounds that no selected content need is present and a neutral fill would duplicate
`BlockCard`.

**Answered by the owner: ruled at rest, filled on hover and press.** The draft holds for the case it
was argued about — a fill at REST, used for rhythm, which would turn a list into a stack of tiles —
and it was silent on the third option it listed, an interactive fill. That silence is the failure, not
the conclusion: this question was one of the five never ratified, so there is no record of whether an
interactive fill was considered and rejected or simply never raised.

The reversal is scoped, and the scope is the argument: nothing paints at rest, so the boundary against
`BlockCard` is untouched. The values are `Button`'s ghost-neutral steps rather than new ones. See
`docs/guides/spec-process-review.md` finding 5, which used this exact prohibition as its example of a
rule enforced beyond the case it was written for — before it was overturned for that reason.

**4 · How the number is drawn — non-blocking.** Options: an ordinary body numeral; a micro label;
or a zero-padded stat numeral. **Recommendation and draft decision: zero-padded `--text-stat`**
(superseded 25 Aug 2026 — the zero-padding held, the stat role did not; see section 8), at
least two digits and hidden from assistive technology inside an `ol`. Its scale makes sequence the
row's first read and prevents the marker from becoming a bullet.

**5 · Title semantics — non-blocking.** Options: always a heading; never a heading; or an exact
element union. **Recommendation and draft decision: `titleAs: 'span' | 'h3' | 'h4'`, default
`span`.** A plain content list does not need 12 new headings; a stepped process or a listing page of
articles usually does. Visual type is fixed in all three — h5 when this was written, h4 since the
presence pass.

**6 · Link target — non-blocking.** Options: title-only anchor plus cue; a nested link Button; or
one whole-row anchor. **Recommendation and draft decision: one whole-row native anchor.** It makes
the large row target honest, gives one focus stop, and lets `href` control cue presence without a
second prop.

**7 · Where an external row's glyph goes — non-blocking, 28 Sep 2026 (2.11).** Options: (a) replace
the trailing cue with `square-arrow-right-up`; (b) keep the arrow and add the glyph after the title; (c)
both. **Chosen: (a).** ch04 fixes one glyph per meaning (`arrow-right` "go, next", `square-arrow-right-up`
"leaves the site"), one icon per line, and never an icon in a heading, which rules out (b) and (c). The
glyph keeps the cue's slot, size (lg, 18 — ch04's "beside body text") and ink. On ch04's pairing gap —
a quarter of the icon in a control, half in a line — the cue is not paired with a label: it is the row's
trailing affordance, justified to the core's inline end by the nowrap `Cluster`'s `--gap-block` seam,
which is at least 24 and already exceeds either pairing value. Stated so a later reader does not
"correct" it to 4 or 9. The cue's blue on a neutral-text row is ch04's "blue on an icon beside neutral
text" don't, read strictly; it predates this task, the cue is the row's action, and it is left as it was.

**7 — amended 29 Sep 2026 (2.17): the glyph is `arrow-right-up`.** Placement (a) stands. The owner
ruled that the filled `square-arrow-right-up` beside plain `arrow-right` cues reads as a badge among
arrows, so the external cue is Solar Bold's plain `arrow-right-up` — the same arrow family turned 45°,
added to the Icon set from Iconify `solar:arrow-right-up-bold` the way `alt-arrow-up` was. Same slot,
size (lg, 18) and ink as the arrow. One meaning at two weights: `square-arrow-right-up` stays ch04's
standalone mark (docs/specs/Icon.md § 2).

**8 · The cut-out panel inset at thumbnail size (Media § 17 Q2) — ANSWERED 29 Sep 2026 (2.17): (b).**
The owner approved Media `inset: 'gutter' | 'text'`, default `gutter`; ListCard's thumbnail passes
`text` (`--gap-text`, 16), leaving 128 × 75 of part. No new token; the centre crop stays. The supply
rule below still applies first — a part that holds its own edge needs no panel. Original entry,
28 Sep 2026 (2.11):
Media's `--media-panel-inset` is `--gap-gutter` at every size, so in a 160 × 107 thumbnail a panelled
part gets 96 × 43 — which cannot pass ch05 § 9's 160 check (one recognisable shape). Options: (a) leave
Media alone and make it a supply rule; (b) a Media `inset` prop or a per-placement Media token; (c)
ListCard sets `--media-panel-inset` on its box. **Chosen: (a).** Media cannot know the size of the box it
fills, so a per-size token has nothing to key on; (c) is a component writing another component's token,
which rule 6 forbids in spirit; (b) is a presentation knob on a primitive whose contract is that no
placement restyles an image's edge. **The supply rule:** a thumbnail's cut-out is a part that holds its
own edge on the ground (no panel), or the row takes the case's illustration. `/design/list-card` § 2b
shows the shipped 32, the rejected `--gap-text` 16 (128 × 75, "cell padding" — the step a smaller inset
would take by relationship) and the unpanelled part side by side, for the owner to judge. If the owner
prefers the smaller inset, it is (b) as a `fill`-only inset step owned by Media, argued there.

**9 · A kind-less or capture record in a thumbnail — non-blocking, 28 Sep 2026 (2.11).** Before 2.11 the
thumbnail drew no edge. `Media` draws a capture's hairline, and M3 renders a record with no `kind` as a
capture, so a kind-less thumbnail now has a hairline — while ch05 § 9 gives the thumbnail "no edge" and
§ 2 keeps captures to the full column. **Chosen: leave it to the record**, as M3 intends: ListCard does
not override Media's edge (it has no way to, by design), and the only route that passed a thumbnail was
contact, which no longer does (q10). The capture and kind-less rows in § 2a are labelled off-brand so the
failure is recognisable; the fix is recording `kind` (strapi-changes.md 3).

**10 · The contact page's thumbnails — non-blocking, 28 Sep 2026 (2.11).** `/contact` passed its CMS
`card.icon` / `action.icon` — 69–96px line-icon PNGs — as 160px thumbnails, upscaled and cropped.
Options: (a) migrate them onto Media as they were; (b) drop the marker; (c) map each channel to a ch04
glyph (`letter`, `phone`) in code. **Chosen: (b).** C1 limits thumbnails to case-study and
insight/resource rows, and a non-Solar glyph is not a legal icon marker (ch04); the heading already
names the channel. (c) needs glyphs Icon does not ship yet and is left for the owner. Logged as
strapi-changes.md 10.

**11 · The Solar credit — non-blocking, 28 Sep 2026 (2.11).** `square-arrow-right-up` (since 2.17 `arrow-right-up`, also Solar Bold) on an external row
is the first Solar Bold glyph a route can show, and Solar Icons are CC BY 4.0 (ch04). **Chosen:** the
credit rides SiteFooter's existing legal notice — "Icons: Solar Icons by 480 Design, CC BY 4.0." — set in
the navigation fixture, so the footer's code and layout are untouched. Title, author and licence are what
CC BY asks for. A link to the licence would need a new utility item or a rich legal field; not done.

**12 · The list element — non-blocking, 28 Sep 2026 (2.11).** Options: the caller's `Layout as`, or a
ListCard-owned list. **Chosen: the caller's**, per § 10; every route already composes it correctly, and
there is no runtime check (a server component cannot see its parent element).

---

## Decisions the build made that this document did not

Four implementation details complete the accepted contract without changing it:

1. **SUPERSEDED 28 Sep 2026 (2.11) — the thumbnail is `Media` now, with the record's own intrinsic
   size.** Kept for the record: **Native thumbnail metadata is 480 × 320, lazy and asynchronous.** The intrinsic dimensions
   preserve the accepted 3:2 frame before CSS loads; `loading="lazy"` and `decoding="async"` keep a
   row image from blocking the surrounding list. The repository still has no Image primitive or
   `next/image` precedent, so the one native-image lint suppression is local to this documented
   contract.
2. **The root states its full-line behavior directly.** `inline-size: 100%` makes each `li` occupy
   one available line even when its parent is a wrapping `Cluster`; `min-inline-size: 0` still lets
   an illegally narrow parent shrink and wrap the row rather than widening the page.
3. **`position: relative` left the frame with the overlay.** It was there only to be the containing
   block for the absolutely positioned wipe. The focus ring is a `box-shadow` and needs no
   positioning, so it went in the same edit rather than lingering as a stacking context nothing uses.
4. **The specimen adds an xs track and a neutral image fixture** (since 2.11 the fixture is also the
   kind-less record, and the Media specimen's brand assets supply the kinds). The route-local harness gains a
   192px `trackXs` beside its existing 256px track, and `/public/design/list-card-sample.svg`
   supplies predictable 3:2 content. Neither is product API or component styling.

---

## Appendix — self-audit

```
STRUCTURE
[x] All 18 sections present, in order, with the exact headings.
[x] Front matter states Tier 2 pattern, Status implemented, token prefix --lcrd-*, and the Cards 1a
    revision date. The prefix has no repository collision.
[x] Every Anatomy part appears in colour, geometry, or is explicitly marked as carrying no value. The
    `rule` row now states one width in every state, and the removed overlay is named as removed.

NAMES
[x] Every existing name appears verbatim in docs/vocabulary.md AFTER regeneration, and the --lcrd-*
    names are this component's declared layer. Checked one at a time by `npm run design:check`.
    `--lcrd-rule-width-pressed` was removed from both the layer and this document, so the vocabulary
    must be regenerated and pushed — section 16 says so.
[x] Named glyphs are existing: arrow-right, arrow-left, square-arrow-right-up (2.11), arrow-right-up (2.17), and the IconName union.
[x] Section, Layout and Cluster props/values are existing unions: as, rowGap, colGap, columns,
    align, nowrap; none, text, block, column, start; base, md; ol, ul, li (`tight` became `text` 5 Oct, S3).
[x] Zero hex codes, rgb(), hsl(), Tailwind names, CSS rule blocks or media-query blocks.
[x] Tracking companions are used only with h4, h5 (`sm`, 5 Oct 2026) and index, each of which has one. The marker moved
    off stat on 25 Aug 2026; size and tracking moved together, and --text-index borrows ui's 0.08em
    rather than declaring a third correction.
[x] Every layout distance is a gap-scale role.
[x] Space-ramp reaches: 3 — --lcrd-number-baseline-offset-md (--space-4) and -sm (--space-0),
    argued in section 7(c) as a baseline correction rather than a distance and commented as optical
    on their tokens; and --lcrd-hidden-size (--space-1), the visually hidden clip box's own geometry
    (section 7(b)). Recounted 6 Oct 2026; it said 1 (--space-2) since before the size step.
[x] One new USAGE role was added for this component's sake: --text-index, 20px mono. Section 8 and
    docs/vocabulary.md carry it, /design/typography renders it, and the justification is a genuine
    hole in the ramp (mono ran 11, 12, 13, 14, then 40) rather than this component's convenience.
[x] Literal pixel values are component sizes, a touch floor or the Section cap, each measured in
    section 7. Count: 22 occurrences, 8 distinct values.

COLOUR AND CONTRAST
[x] Colour table has 12 rows × 4 full cells; no delta and no blank. The number row was added when the
    ordinal stopped sharing the icon's ink; the two ground rows arrived with the hover affordance and
    --lcrd-link-ink-hover left at the same time, since the cue no longer moves on hover.
[x] Every text/glyph cell has a measured ratio of at least 4.5:1.
[x] Focus ring is measured against its own gap on all four surfaces.
[x] The rule is decoration in every state — one width and one colour. Its one-day hover colour was
    replaced by the fill; section 2 records both.
[x] The two ground rows are marked "a ground, not an ink" so they are not read as text colours, and
    section 6 re-measures every ink against them.
[x] The register is right: a surface has a ground and an ink, so these are --lcrd-ground-*. They were
    briefly --lcrd-fill-*, which is neither register and exists nowhere else in the system.
[x] One paragraph per surface explains the mapping; nested surfaces are specified.

STATES
[x] Every claimed state comes from the fixed model and uses its fixed suffix.
[x] Hover moves ONE thing (the ground, across the whole target) and pressed moves TWO (the ground and
    the cue), which is Button's ghost model rather than a local invention. Both are colour-only, and
    press is therefore the only state where two things move. Section 5 records the two rejected
    attempts — the cue alone, then the rule's colour — rather than presenting the ground as the first
    idea.
[x] Every state token moves on at least one surface and is declared in all four columns.
[x] Relative emphasis is stated, not just per-part values: the first read is the TITLE, then the
    marker, then the body, then the cue. h4 title over a 20px quiet numeral over 16px body. This line
    exists because its absence is what let a 40px marker ship above a 22px title — see
    docs/guides/spec-process-review.md, finding 2.
[x] Excluded states have no token. There is no disabled opacity.
[x] The row paints no ground at REST, which is the claim section 1 makes and the fill does not break.
[x] No token remains for anything the component no longer draws: --lcrd-rule-width-pressed is
    deleted, not zeroed.

LAYOUT, TYPE, SEMANTICS
[x] Every arrangement belongs to Layout or Cluster; colGap is present only with split columns.
[x] No child margin. No responsive gap or type-role swap.
[x] Title and body name measures.
[x] Linked frame clears the 44px touch floor through its natural row box.
[x] There are no ARIA idrefs and no upward-walking state selector.

COMPLETENESS
[x] All thirteen required content edge cases are answered.
[x] The unsized-parent row names the 192px core minimum and explains why the root has no hard floor.
[x] Do's and Don'ts name a rendered-tree, type-check, search or computed-style decision.
[x] Specimen plan covers 2 arrangements × 2 sizes (5 Oct 2026), all four surfaces, manual states, nested surfaces,
    every edge case, adjacent rows and narrow tracks.
[x] Section 16 asks for nothing, explains why component tokens do not constitute a request, and
    records the one removal and the vocabulary push it requires.
[x] Every open question has options, recommendation and blocking status.
[x] Squint test: five shapes, with scale and position supplied by marker fills and arrangements rather
    than bounded rectangles.
```

## Amendment · 1 Oct 2026 — the tile form, and an optional body

**Why.** The service pages needed items in a grid — symptoms, steps, deliverables — and ListCard could
only make a row: a rule that closes it, a marker beside the copy, a 16px inline inset for the hover
ground. So the template drew its own tile three times over (Signals, Steps, Ledger) and its own linked
tile once more (Router), each a marker, a title, a line and sometimes a destination. Four jobs, one
item. Owner: *"we have similar components that i think can be used here and perhaps be added as
variants? listcard is one such example."*

**`form?: 'row' | 'tile'`**, default `row`. A placement, not a finish — both are the same groundless
ruled item, with the same rule ink and width, type, marker fills and cue.

| | `row` (unchanged) | `tile` |
|---|---|---|
| Where | one row of a one-column list | one item in a grid track |
| Rule | block-end — rows end on the same line as their neighbours | block-start — tiles of unequal height only line up at the top |
| Marker | beside the copy (`--gap-block`) | above the title (`--gap-text`); the number's baseline offset is dropped, there is no baseline to sit on |
| Title / body | `split` or `stacked` | always stacked; `arrangement` is `never` at the type level |
| Inset | `--gap-gutter` block, `--gap-text` inline | `--gap-block` above the copy, none inline or below: flush with the track, so the grid aligns with the heading over it; the grid's rowGap is the space after |
| Linked: hover | the ground (`--lcrd-ground-hover`) | no ground — on a 220–390px column with flush copy a ground reads as a highlighted paragraph. The opening rule takes `--lcrd-link-ink`, and `--lcrd-link-ink-pressed` on press. No new token: the rule borrows the cue's ink while the tile is the active target |
| Linked: cue | trailing, at the core's inline end | at the foot, pinned (`Layout pinLast`) so every cue in a grid row shares one line |

The caller chooses the form, because a row cannot see its parent's column count. The rule for
choosing is mechanical: **a set in one column is rows; a set in a grid is tiles.**

**`body?: string`.** An item can be its name alone. Absent → no paragraph, no seam, no warning. Present
but whitespace-only stays a CMS fault: omitted with a warning, as before.

**Specimen:** `/design/list-card` § 1b — icon tiles in four tracks, number tiles in an ordered five,
linked tiles with unequal bodies, and title-only rows and tiles.

**Not taken into ListCard**, and why: a key line above the body (Signals' "May be", Router's "When").
Both were the template's device, not the item's: "May be" reads as the first words of the body, and
a route's condition is its body. No `eyebrow` prop was added.

## Amendment · 6 Oct 2026 — `fdn-colour` (visual-direction § 4.2, § 4.3)

- **The cue is ink at rest.** New `--lcrd-cue-ink`: neutral-900 on paper and tint, white on ink and blue.
  `--lcrd-link-ink` (unchanged values) is now the cue's hover and focus ink as well as the tile rule's;
  `--lcrd-link-ink-pressed` is unchanged. "Card arrows at rest are ink. They go blue on hover or focus"
  (§ 4.3); the whole-card hover cue is blue's Free row (§ 4.2), so it spends nothing in the band rule.
- **This supersedes "the cue holds through hover"** in § 5 and § 6. That model worked because the rest
  ink was already blue; once rest is ink, holding through hover would leave a linked row with no blue at
  all until the click. Hover now moves two things (ground and cue) and press steps both once more. The
  hover-column ratios in § 6 for the cue are now `--lcrd-link-ink` on the hover ground — the same values
  the table gives for the rest ink on that ground (5.22, 4.63, 6.26, 5.99), because they are the same
  token.
- `--lcrd-number-ink` was already neutral on paper and tint (3.16 and 4.39:1); § 4.4's inventory lists it
  and it needed no change.

## Amendment · 6 Oct 2026 — `fdn-media` (visual-direction § 5.3)

- **The thumbnail's edge is the box's: radius 8, no frame, for every kind.** New
  `--lcrd-thumbnail-radius: var(--radius-8)` on `.thumbnail`, which already clips (`overflow: hidden`),
  so the radius applies to a photograph, a capture or a cut-out's panel alike. Media is passed
  `edge="placement"`, so a capture no longer draws its hairline round a 160px crop the row made. This
  closes § 17 q9 ("a record with no `kind` renders as a capture, hairline included — off-brand in a
  thumbnail"): an untagged record is still a capture, and in a thumbnail it now has no frame.
- The radius matches every other photograph box on the page (BlockCard's `--bcrd-media-radius`, Media's
  `--media-photo-radius`), duplicated by value under token rule 6.

## Amendment · 6 Oct 2026 — `fdn-blue` (supersedes the `fdn-colour` amendment above)

Owner: blue is the recurring FOREGROUND accent; the reservation is only for grounds. `--lcrd-cue-ink`
is deleted and the cue reads `--lcrd-link-ink` at rest again, holding through hover and stepping on
press (the original model). `--lcrd-marker-ink` and `--lcrd-number-ink` move to the accent: brandeis-500
on paper and tint, brandeis-300 on ink; blue keeps white and brandeis-200.

## Amendment — final fix round (cmp-media-split, 6 Oct 2026)

- A tile's marker and copy are a wrapping Cluster: from md the copy wraps under the marker at
  `block` (24), title to body stays `text` (16); below md an icon or number marker sits beside the
  copy, so a tile on a phone is an icon-and-title row. A thumbnail marker always sits above.
- A tile's icon is 32 (`--lcrd-marker-icon-size-tile`, new primitive `--icon-size-32`).
- An unlinked row (`.still`) drops the 16 inline inset: it has no hover ground to clear, so its
  marker and title hold the column's edge.

## Amendment · 6 Oct 2026 — `cmp-readdown`: ReadDown, the D set mode

`ReadDown.tsx` in ListCard's folder, exported beside `Steps` (a pattern beside it would be a pattern
importing a pattern). It is the D band's body (visual-direction § 3.4 D): ruled rows of PEERS in a
`<ul>`, one column or two, each row a blue glyph (or none — a set is all-icon or all-text) beside its
title with the sentence under it.

- **Size is the set's** (§ 7.2): ≤ 3 rows in one column take `md` (h4); four or more, or two columns,
  take `sm` (h5), body at body. Rows are always `stacked`, the body capped at `--lcrd-stacked-body-measure`.
- **Two columns are one list**, laid out `{ md: 2 }` at `column` in reading order. Each frame fills its
  grid cell (`block-size: 100%`), so the closing rules run level across the seam.
- **On the content edge:** no inline inset (rows never link, so no hover ground), the 32 block inset kept
  (§ 1.4's D row, padding 64), and the first row of each column starts on the set's top edge.
- **`photo`** (fix round 2, superseding round 1's 349 portrait, which read as a third equal column
  beside a head track left empty under its lead): the photo form gives the photograph the WIDE track.
  From 1024 the set splits `{ lg: [2, 1] }` at `section` (96) with `reverse`, so the photo (first in the
  DOM, for the phone's order) takes the trailing two thirds and the rows the leading third; `stretch`,
  so the photo runs the rows' height and starts and ends with them at every width from 1024. About
  763 × 449 at 1440. Place it under a stacked ContentSection head (`split-head`, whose head split [1, 2] over
  the same grid, was retired 7 Oct 2026). Exactly three rows (warned), `sm` in the 381 track,
  bodies ≤ 12 words / two lines, so the band is 822 at 1470 (with a CtaRow, 822 at `density="tight"`).
  Below 1024 the photo sits above the rows at 3:2 (`--lcrd-readdown-photo-height-base`). The caller
  passes no ContentSection `aside`.
- **`rail`** (photo form only): the § 6.3 `rail` texture, hung off the photo's END EDGE rather than the
  band's: the field's box runs from the band's end edge back across the band's inline padding (the
  same max() Section pads with; cap duplicated on purpose as `--lcrd-readdown-rail-container`) plus
  `--lcrd-readdown-rail-under` (80, optical) under the photo, and one 220-wide shape, blur 120, fills its
  start. So the grid always meets the image (round 2: band-anchored, it sat 170 clear of the photo at
  1920) and never extends past the viewport. Never under text. From 1440 only (`.rail`). Its containing
  block must be the Section: never wrap a railed set in a positioned box.
- **Token rename:** `--lcrd-step-body-measure` became `--lcrd-stacked-body-measure` (Steps and
  ReadDown both read it).
- **Ceilings warned in development:** > 3 rows in a column, > 6 rows in a set, mixed glyph / no glyph.
- **A positional exception to § 9 and § 14 Don't 14** (no inset change at a breakpoint): in two
  columns, from 768 (Layout's md, where the second track begins) the SECOND item is also first in its
  column, so it drops its top inset with the first. The query follows the arrangement — below 768 the
  item is the second row of one column and keeps its 32 — and swaps no step for another. Measured at
  1440 / 768 / 390: both column tops at 0 from 768, the closing rules level across the seam.
- No row change to ListCard itself; its tokens are unchanged (`--lcrd-stacked-body-measure` renamed for
  both set modes). The module's "no media query" note now scopes to the row.

## Amendment · 7 Oct 2026 — owner review: no title arrow, the action slot, the boxed tile, number tone

Owner decisions of 7 Oct 2026. Where anything above differs, this section wins.

### 1 · No arrow cue

Nearly every clickable card in the kit showed a blue arrow — after a `cue="title"` row's title, at a
`cue="end"` row's inline end, at a linked tile's foot — and it read as bulky. The whole item is already
the link. So:

- **The `cue` prop and `ListCardCue` are deleted.** A linked item carries no glyph at rest.
- **The title is the affordance.** On hover and keyboard focus it takes `--lcrd-link-ink`; on press
  `--lcrd-link-ink-pressed`. The two-part focus ring still runs round the whole item, so focus is never
  colour alone. An open tile's opening rule still takes the link ink on hover too.
- **The end-of-row arrow went as well.** Judged on the crops: a wide row with a title that turns blue
  under the pointer, plus a cursor and a ring, is still plainly a link, and the owner's complaint was
  the arrow's prevalence, not one position of it. Keeping it on rows alone would have kept two link
  models in one kit.
- **No row hover ground.** It answered a 1240 target whose only other signal was an 18px arrow at its
  far end. With the title moving it answered nothing, and its 16 inline inset went with it: every row
  now stands on the column edge the band's head and the rules share (as static, Steps, ReadDown and
  title-cued rows already did). `--lcrd-ground-*` now serve the boxed tile only, at new values.
- **External links still say so.** `external` keeps the visually hidden "(opens in a new tab)" at the
  end of the accessible name, and sets a small (16, Icon `md`) `arrow-right-up` after the title's last
  word in the link ink, joined by a non-breaking space. Justified: it does not say "this is a link" (the
  hover does that), it says "this leaves the site" — which a sighted reader cannot otherwise know before
  the new tab opens (WCAG technique G201 asks that the warning reach everyone). External items are rare,
  so it does not bring the bulk back. With an action, the action's own glyph turns up-right instead and
  the title carries none.

### 2 · An opt-in action at the foot: `ctaLabel`

`ctaLabel?: string`. With a destination, the item renders the link `Button` — `emphasis="link"`,
`tone="primary"`, `as="span"`, `arrow-right` (or `arrow-right-up` when external) — a `block` (24) under
the copy: inside a row's content core, and pinned to a tile's foot (`Layout pinLast`) so every action
in a grid row sits on one line. The frame anchor carries `data-btn-link-group`, Button's published
contract, so the span takes the item's hover, focus and press. One anchor, one focus stop, no nested
interactive element. With an action the title holds still and the action moves (BlockCard's cta model:
one cue per item). Blank labels warn and render no action. **Use it only where the action is not obvious
from the title** — "Book an audit", "Get the Figma file". A title that names its destination needs none.

### 3 · The boxed tile: `frame="box"`

A partial reversal of the kit's "cards have no boxes" ruling (visual-direction § 3.1, amended the same
day). `frame?: 'none' | 'box'`, on `form="tile"` only (typed: a row's `frame` is `never`); default
`none`.

- A `--lcrd-box-rule-width` hairline round all four sides in `--lcrd-rule-ink` (the same hairline as the
  open tile's opening rule, so no new ink), `--lcrd-box-radius` (8, the photograph radius), and
  `--gap-block` (24) inside on every side. The opening rule becomes the box's top edge.
- Linked: `--lcrd-ground-hover` under the pointer, `--lcrd-ground-pressed` on press; the edge holds its
  ink. The title moves as on any linked item. The focus ring follows the radius.
- Ground values per surface: paper `paper-deep` / `neutral-100`; tint `neutral-100` / `neutral-200`; ink
  `neutral-900` / `neutral-800`; blue `brandeis-600` / `brandeis-700`.
- Use it for a set whose items must read as separate objects at a glance — an icon router of four to six
  destinations. Boxed tiles sit a `gutter` (32) apart both ways: the box is the separation.
- Rows are never boxed: their rules are their separation, and a box round each row is a stack of panels.

### 4 · Number tone: accent or neutral

`marker: { type: 'number', value, tone?: 'accent' | 'neutral' }`, `accent` by default.

**The rule (owner):** blue (`accent`) when the numbered points **are the main information of the
section** — a method's steps, a checklist that is the band's body, the phases a CTA band sells.
**`neutral` when the numbers are auxiliary** — an index of the page's own sections, a pair of numbered
notes under a hero's heading, any set where the numeral only counts and the band's information is
elsewhere.

Audit, 7 Oct 2026 — set to `neutral`:

| Call site | Why auxiliary |
|---|---|
| `src/app/design/kit/cta/page.tsx` — the variation index | indexes the page's bands; the bands are the information |
| `src/app/design/kit/service-list/page.tsx` — the variation index | the same |
| `src/app/design/kit/hero/page.tsx` — the variation index tiles | the same |
| `src/app/design/kit/logos/page.tsx` — two numbered notes under the h1 | supporting points to the intro's heading and lede |

Left at `accent` (the numbered points are the content): `Steps` (every method); the ServicePage ledger's
numbered rows; the CMS `labelled-list` with `displayStyle: 'numbered'` on services, expertise, audits,
glossary, tools and how-we-work (the author numbered the list because its order is the point); the About
checklist; the Future Interfaces Lab join steps; the kit CTA band's phases; the ContentSection and CtaRow
specimens' steps.


## Amendment · r7-cards, 9 Oct 2026

Owner, 7 Oct review: "remove the box borders: the boxed card variant goes", and "size each icon to the
card title beside it, from a token". `frame="box"` and `ListCardFrame` are deleted with
`--lcrd-box-rule-width`, `--lcrd-box-radius`, `--lcrd-ground-hover` and `--lcrd-ground-pressed`; nothing
paints a ground. A tile's icon now sits on the title's first line at every width, `tight` from it, and
`--lcrd-marker-icon-size-tile` is `1em` of the title role for the size step (22 beside h5, 28 beside h4).
Where earlier sections describe the box, the ground or the 32 tile icon, this amendment wins.

## Amendment · owner rulings, 9 Oct 2026 (supersedes r7-cards where they differ)

1. **An icon tile stacks at every width.** Glyph on its own row, then the title, then the body —
   never the glyph inline beside the title (the phone's icon-and-title row is retired). The glyph and
   the copy are a `Layout` at `--gap-text` (16), the head group's own seam. `--lcrd-marker-icon-size-tile`
   is unchanged (`1em` of the title role: 22 over h5, 28 over h4), and the glyph's box is its own size.
   Number and thumbnail markers keep their Cluster. The open tile's opening hairline is unchanged.
2. **`frame="box"` stays, without its edge.** No border on any side (`--lcrd-box-rule-width` is
   deleted); the `--gap-block` inset, the 8 radius on the hover ground, `--lcrd-ground-hover` /
   `-pressed`, the title's link ink on hover and the focus ring all stay.
3. **Clickable tiles and rows sit under their head**, full width, never beside a heading or with a
   decorative image. Non-clickable icon tiles beside a photograph (the B band) stay.

## Amendment · 4 Nov 2026 — Steps `measure` (status proposed; owner to judge)

`Steps` takes `measure?: 'track' | 'reading'`. `track` (default) is unchanged: rules run the whole track,
titles at the title measure, bodies at the lead measure. `reading` is a block of an article's reading
column: the whole set takes `--measure-body`, so titles and bodies run to it and the rules end with the
text. Used on the tool pages only (specimen on `/design/steps`).
