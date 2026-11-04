# DataTable


> **Owner, 7 Oct 2026:** on a phone a table scrolls sideways and never restacks into key/value
> blocks — rows are easier to read across. A partly clipped second column at 390 is accepted.

## 0 · Front matter

|                     |                                                                                                                                                                                                                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component**       | `DataTable`                                                                                                                                                                                                                                                                                              |
| **Tier**            | 2 pattern (`src/patterns/DataTable/`)                                                                                                                                                                                                                                                                    |
| **Status**          | approved — brief 10 is RESOLVED (27 Aug 2026: build it); every question in § 17 is non-blocking and carries the choice that was built                                                                                                                                                                    |
| **Token prefix**    | `--dtab-*` (no collision: `--dtab-` is unused by any other layer)                                                                                                                                                                                                                                        |
| **Designer / date** | Claude Code, 28 Sep 2026, tracker 2.15. Written in the repo from the brief; no Claude Design spec existed for this component. **Revised 29 Sep 2026** by the owner: boxed frame, horizontal scroll replaces the stack, dividers on every column, and the table best-practice pass (§ 17 Q1, Q2, Q5, Q10) |
| **Implements**      | `docs/briefs/10-table.md` · the Comparison job in `docs/component-audit.md` § 4 ("options × dimensions, with a caveat or source")                                                                                                                                                                        |
| **Implemented at**  | `src/patterns/DataTable/` · `src/styles/tokens/components/data-table.css` · the seam `src/content/sources/strapi/table.ts` · view model `ContentTable` in `src/content/types.ts` · specimen `src/app/design/data-table/page.tsx`                                                                         |

## 1 · Identity

**What it is.** The site's one table: a key column whose cells are the row headers, one to five
data columns, three to eight rows, an optional caption and an optional summary — drawn as a boxed
frame (outer border, head fill, body ground, and a hairline between every row and every column)
that scrolls sideways whenever its columns do not fit the track it is given. It is what a CMS
`table` BLOCK becomes on every route that has one (audits, services, expertise, tools, glossary,
how-we-work): 39 published tables on 28 Sep 2026, always as a `ContentSection` child.

**Tier, and why.** Tier 2. It consumes a content shape (columns × rows of rich text), and it
composes two primitives — `Layout` (the summary, caption and frame seams) and `Prose` (every cell's
trusted rich text, and the summary) — which a primitive may not import.

**What it is NOT:**

| Not this                                 | Who does it                                                                                                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A markdown table inside a long-form body | `Prose`, which keeps its `table` / `th` / `td` / `caption` rules for the bodies that legitimately contain one. DataTable is the `table` block, not a table found in a string. |
| A set of options presented as objects    | `BlockCard` in a `Layout` — "comparison cards" are cards. A comparison becomes a table only when it is options × dimensions and must read across a row.                       |
| A data grid                              | Nothing, deliberately. No sorting, filtering, pagination, selection or sticky columns — these are five-row reference tables.                                                  |

**Nearest existing component, and why this is not a prop on it.** `Prose`. It is where tables
render today, and the brief measured how it falls short: an opaque string cannot carry per-column
behaviour — a key column that must not wrap, an aligned numeric column, a column that must not
shrink — and it cannot mark the key column, which needs to know which cells are row headers.
A `variant="table"` on Prose would still receive a string. The seam already receives the structure
from Strapi, so the answer is to stop flattening it.

**How many on a page.** Zero to two in live content (Design Systems and Product Redesign carry
two). Two adjacent is legal; the caller's Layout owns the seam (§ 12).

## 2 · Anatomy

| Part             | Required                     | Element                                                           | CSS class                     | Token `{part}`                |
| ---------------- | ---------------------------- | ----------------------------------------------------------------- | ----------------------------- | ----------------------------- |
| Root             | always                       | `Layout` (div), summary → captioned frame                         | `.root`                       | —                             |
| Summary          | optional                     | `Prose` > `<p>`, before the caption                               | — (Prose's own)               | — (Prose's ink)               |
| Caption          | optional                     | `<p id>` above the frame, the table's name by `aria-labelledby`   | `.caption`                    | `caption`                     |
| Shell            | always                       | `<div>` — non-scrolling, carries the scroll fades                 | `.shell` `::before` `::after` | `fade-size`, `body-ground`    |
| Frame            | always                       | `<div role="region" tabIndex={0}>` — the box and scroll container | `.frame`                      | `body-ground`, `rule`, `ring` |
| Table            | always                       | `<table>`                                                         | `.table`                      | —                             |
| Column head      | one per column, key included | `<th scope="col">`                                                | `.colHead`                    | `head-ground`, `head`, `rule` |
| Row              | 1+ (3–8 designed)            | `<tr>`                                                            | `.row`                        | `rule`                        |
| Row header       | one per row                  | `<th scope="row">` > span                                         | `.key` > `.keyText`           | `key`, `rule`                 |
| Cell             | one per data column per row  | `<td>`                                                            | `.cell`                       | `rule`                        |
| Cell value       | when the cell has content    | `Prose` with the cell's HTML                                      | `.value`                      | — (Prose's ink)               |
| Empty mark       | when the cell is empty       | `<span aria-hidden="true">—</span>`                               | `.empty`                      | `empty`                       |
| Column behaviour | per column                   | modifier class on the head AND the cells                          | `.nowrap` `.hold` `.numeric`  | `fluid-size`, `hold-size`     |

Content slots: `caption`, `summary`, each column's `heading`, each row's `header`, each cell's
HTML. Nothing else is a slot; there is no action slot (§ 12, "interactive content").

## 3 · Props / API

| Prop        | Type                                                                                     | Default             | Decides                                                                                                        |
| ----------- | ---------------------------------------------------------------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `caption`   | `string`                                                                                 | —                   | The table's name, above the frame, and the accessible name of the table and its scroll region. Omitted → none. |
| `summary`   | `string`                                                                                 | —                   | A plain-text lead-in paragraph before the table. Omitted → none.                                               |
| `keyColumn` | `{ heading: string; behaviour?: 'fluid' \| 'nowrap' \| 'hold' }`                         | behaviour `'hold'`  | The first column's head and how the row headers behave.                                                        |
| `columns`   | `readonly { heading: string; behaviour?: 'fluid' \| 'nowrap' \| 'hold' \| 'numeric' }[]` | behaviour `'fluid'` | The data columns, in order. The COUNT is data, never a variant.                                                |
| `rows`      | `readonly { header: string; cellsHtml: readonly (string \| { node: ReactNode })[] }[]` | —                   | Each row: a plain-text header and, per data column, a trusted rich-text string or (1 Oct 2026) a composed mark `{ node }`. |

**Column behaviour** (presentation, set by the caller):

| Value     | Wide arrangement                                                                 |
| --------- | -------------------------------------------------------------------------------- |
| `fluid`   | wraps and shrinks to share the width, down to `--dtab-fluid-size`. Data default. |
| `nowrap`  | never wraps, so never narrows below its longest line. Short keys, identifiers.   |
| `hold`    | wraps, but never narrows below `--dtab-hold-size`. Key default.                  |
| `numeric` | end-aligned, tabular figures, never wraps. Head and cells align together.        |

Every behaviour holds at every width. When the floors add up to more than the track, the frame
scrolls (§ 9); nothing is released.

**Deliberately not props:** `surface` (read from the ancestor `data-surface`, like everything
else); colour; padding; gap; radius; width and height; density (the brief rules there is no
compact density); zebra (forbidden); sort / filter / paginate (forbidden); a scroll switch (the
columns' floors decide, § 9); a sticky key column (§ 17 Q2); `className` (nothing outside may restyle a table it did not author).

**Compile errors, not review comments:** `numeric` on `keyColumn` (its behaviour union omits it — a
number is not a row's name); a row without `header` or `cellsHtml`; any behaviour outside the
unions.

**The view model.** `ContentTable` in `src/content/types.ts` carries `caption?`, `summary?`,
`keyColumn: { heading }`, `columns: { heading }[]` and `rows: { header, cellsHtml }[]` — structurally
a `DataTableProps` with no behaviours, so a route renders `<DataTable {...block.table} />` and the
pattern still never imports `@/content`.

## 4 · Variants × sizes

**None, and why.** One treatment, one size. Column count is data (key + 1 to 5); column behaviour is
a per-column presentation choice, not a variant of the table. Scrolling is what a narrow track
does to the frame, not a variant a caller picks.

Considered and rejected: a compact density (brief: nothing in the live tables asks for one, and it
would create an arbitrary choice on every page); zebra stripes (brief: decoration standing in for
structure); a key-column-only vertical rule (built first, replaced 29 Sep by dividers on every
column — the key column is distinct by voice and ink, and a divider on every column lets a value be
followed down its column as easily as across its row); an unboxed variant (the owner's ruling, 29 Sep: a table without structure is hard to
read).

## 5 · States

**None, and why.** The table is not interactive. Nothing in it has a hover, a press, a selection or
an expansion, and no row highlights on hover — a highlighted row in a five-row reference table reads
as selected. The frame takes keyboard focus so it can be scrolled (§ 11) and shows `--dtab-ring-ink`
on `:focus-visible`; that is a focus indication, not a state any other value moves with. A link
inside a cell is `Prose`'s link and takes Prose's rest / hover states and focus ring. Disabled,
loading and error do not apply.

## 6 · Per-surface colour

Grounds: paper `--color-paper`, tint `--color-paper-deep`, ink `--color-neutral-950`, blue
`--color-brandeis-500`. Ratios are WCAG 2.x, computed from the ramp hexes in `primitives.css`
against the ground each value actually sits on: head ink on the head fill, key ink and the empty
mark on the body ground, caption and ring on the section ground outside the frame.

| Token                | paper                                   | tint                                    | ink                                    | blue                                    |
| -------------------- | --------------------------------------- | --------------------------------------- | -------------------------------------- | --------------------------------------- |
| `--dtab-body-ground` | `--color-white`                         | `--color-paper`                         | `--color-neutral-900`                  | `--color-brandeis-700`                  |
| `--dtab-head-ground` | `--color-neutral-50`                    | `--color-neutral-50`                    | `--color-neutral-800`                  | `--color-brandeis-600`                  |
| `--dtab-head-ink`    | `--color-neutral-700` 7.54:1            | `--color-neutral-700` 7.54:1            | `--color-neutral-300` 7.64:1           | `--color-brandeis-100` 5.99:1           |
| `--dtab-key-ink`     | `--color-neutral-950` 17.26:1           | `--color-neutral-950` 17.10:1           | `--color-white` 14.75:1                | `--color-white` 10.16:1                 |
| `--dtab-caption-ink` | `--color-neutral-600` 4.92:1            | `--color-neutral-700` 7.27:1            | `--color-neutral-400` 8.05:1           | `--color-brandeis-100` 4.91:1           |
| `--dtab-rule-ink`    | `--color-neutral-200` n/a — decoration  | `--color-neutral-200` n/a — decoration  | `--color-neutral-700` n/a — decoration | `--color-brandeis-400` n/a — decoration |
| `--dtab-empty-ink`   | `--color-neutral-500` 3.19:1 (non-text) | `--color-neutral-500` 3.16:1 (non-text) | `--color-neutral-500` 4.62:1           | `--color-brandeis-300` 4.31:1           |
| `--dtab-ring-ink`    | `--color-brandeis-500` 6.17:1           | `--color-brandeis-500` 5.51:1           | `--color-brandeis-300` 7.32:1          | `--color-white` 6.23:1                  |

The cells, the summary, and every link / strong / code span inside them take `--prose-*` through
Prose, on every surface. That is not a gap in this table: it is the decision that a link in a table
is the same link as in a paragraph. It is also what constrains the body ground — each one was chosen
so every Prose ink still clears its floor on it. On the body: paper ink 14.75 / muted 4.97 / link
6.23; tint 14.62 / 8.14 / 6.17; ink 12.37 / 6.88 / 6.26; blue 10.16 / 8.01 / 10.16.

**Paper.** The body lifts to white and the head fill is the lightest neutral: on the lightest
surface the frame reads by its line more than by its grounds. Column heads rest two steps below full
ink in the mono label voice — they name, they do not compete with what they name.

**Tint.** The owner's reference: a paper body on the deeper band, a neutral-50 head. The caption sits
outside the frame on paper-deep, so it steps 600→700 (600 is 4.39:1 there and fails).

**Ink.** The frame steps up the ramp — body 900, head 800 — so the box reads as a raised panel on
near-black. Head labels lift to neutral-300 to hold on the lighter fill; the rule lifts to 700 so the
hairline stays visible on both grounds.

**Blue.** The frame steps down the ramp — body 700, head 600 — because a lighter blue would lose the
white ink Prose sets here. 600 is also Prose's code-span fill on blue, and on a 700 body a code span
still reads as a fill.

**Nested surfaces.** Every surface block declares all eight tokens, so a table in a tint panel
inside an ink section resolves entirely from the tint block (specimen § 8 renders tint-in-ink,
ink-in-paper and blue-in-paper).

## 7 · Geometry & spacing

### (a) Distances

| Seam                                   | Step                                                            |
| -------------------------------------- | --------------------------------------------------------------- |
| Summary to the captioned frame         | `--gap-block` (Layout `rowGap`)                                 |
| Caption to frame                       | `--gap-text` (nested Layout `rowGap`) — closer than the summary |
| Cell inset, block axis (head and body) | `--gap-text` — the scale's own "cell padding on a dense table"  |
| Cell inset, inline axis (every cell)   | `--gap-block` — the seam between a value and the next column    |

### (b) Component sizes

| Token               | Value | Measured against                                                                                                                                                                                            |
| ------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--dtab-fluid-size` | 176px | Every cell's floor, inset included — 128 of text, about sixteen characters of body sans. Below it the frame scrolls rather than crushing a column.                                                          |
| `--dtab-hold-size`  | 192px | A held column's floor, inset included — 144 of text. In the 326 phone column a held key leaves 134 of the next column in view, so the clipped edge says the table scrolls. Key + 5 in 1176 is 196 a column. |

| `--dtab-fade-size` | `var(--space-48)` | Each scroll fade's width — about a third of a column's text floor, so it softens the clipped edge without hiding a whole word. |

`nowrap` and `numeric` columns drop the fluid floor: their own longest line floors them.

### (c) Optical corrections

None.

Radius: none — the frame is square, like a code panel. Border width: `--dtab-rule-width` =
`--border-width-hairline`, for every line in the frame — border, head rule, row rules and the key
column dividers (every column, head row included, none after the last — the border closes the
box), all one ink. Shadow: none — the scroll hint is a fade to the body ground, not a shadow.
Z-layer: none; the fades are positioned pseudo-elements and paint above the in-flow table without
one.

## 8 · Typography

| Part        | Role                  | Tracking                                   | Case                                                    |
| ----------- | --------------------- | ------------------------------------------ | ------------------------------------------------------- |
| Column head | `--text-ui-sm`        | `--text-ui-sm-tracking`                    | `--text-mono-case` — e.g. authored "Typical disruption" |
| Row header  | `--text-h6`           | `--text-h6-tracking`                       | as authored — "Progressive modernisation"               |
| Cell value  | Prose (`--text-body`) | none — this role has no tracking companion | as authored                                             |
| Summary     | Prose (`--text-body`) | none                                       | as authored                                             |
| Caption     | `--text-caption`      | none — this role has no tracking companion | as authored — "Modernisation route comparison"          |
| Empty mark  | `--text-body`         | none                                       | —                                                       |

The row header is the title voice rather than bold body sans: `--text-h6` is the display face at
medium weight, so the key column is distinct by voice without restating a weight; the owner kept it
over a mono key (29 Sep) because row headers are names that run long. Numeric columns add
`font-variant-numeric: tabular-nums`, which changes figure widths, not the role. Measure: none — a
table is not a reading column; `Prose` has no measure and the cells take their column's width.

## 9 · Responsive

**The frame scrolls; the table never restacks.** Every cell floors at `--dtab-fluid-size` (a held
column at `--dtab-hold-size`, a `nowrap` / `numeric` column at its longest line). When the floors add
up to more than the track, the table overflows its frame and the frame scrolls sideways
(`overflow-x: auto`). The border stays put, so the clipped edge reads as more to come, and a fade to
the body ground marks each edge that has more beyond it — the start fade appears once the table has
scrolled off its start, the end fade goes when it reaches its end, and neither shows on a frame that
fits. The fades are a scroll-driven animation on the frame's own scroll timeline (no client JS),
inside `@supports (animation-timeline: scroll())`; a browser without scroll timelines shows no fade
and keeps the clipped edge. A swipe that reaches the end stops there (`overscroll-behavior-inline:
contain`) instead of carrying into the browser's history swipe. Because the
floors are the columns', not the viewport's, the same thing happens in the 392 three-up track at
1440 as in the 326 phone column. No breakpoint, no container query.

At 1023 nothing changes in the component. The gap scale does not shift responsively, and no type
role changes (`--text-h6`, `--text-ui-sm`, `--text-body` and `--text-caption` hold at every width).

**No horizontal PAGE scroll, at any width.** The overflow is contained by the frame. A long unbroken
string in a fluid column breaks at the floor (`overflow-wrap: anywhere`). Checked with
`npm run shots`: 0 overflow at 390, with 38 of the specimen's 39 frames scrolling at that width.

**Touch targets.** The table has none of its own. The only targets are inline links inside cells,
which are Prose's, and fall under the inline exception of WCAG 2.2 SC 2.5.8 (a target in a sentence
or block of text). The frame scrolls by touch natively.

**Print.** Paper cannot scroll: the frame lets the whole table out (`overflow: visible`), the fades
go, rows never split across a page break, and the head row repeats on each page (the `<thead>`
default).

## 10 · Composition

```tsx
<Layout rowGap="block" className={root}>
  <Prose>
    <p>{summary}</p>
  </Prose>
  <Layout rowGap="text">
    <p id={captionId}>{caption}</p>
    <div role="region" tabIndex={0} aria-labelledby={captionId} className={frame}>
      <table aria-labelledby={captionId}>
        <thead>
          <tr>
            <th scope="col">{keyColumn.heading}</th>
            {columns.map((c) => (
              <th scope="col">{c.heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr>
              <th scope="row">
                <span>{r.header}</span>
              </th>
              {r.cellsHtml.map((html) => (
                <td>
                  <Prose html={html} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Layout>
</Layout>
```

**Why the caption is a `<p>` and not a `<caption>`.** A `<caption>` is inside the table, so it would
sit inside the frame's border and scroll away with the columns. As a paragraph above the frame it
stays in place, and `aria-labelledby` keeps it the accessible name of both the table and the region.

**Why the table's display is not hand-rolled arrangement.** A `<table>` is the element whose
semantics are the arrangement, laid out by the table algorithm it carries. Nothing in the module
writes `display` at all. The frame is a scroll container, not an arrangement: it holds one child.

**Why the spacing is padding.** A cell's inset is the table's spacing mechanism: there is no gap on
a table, and `border-spacing` does not exist under `border-collapse`. No margin anywhere; no outer
spacing on the root; `Section`'s column is never touched.

## 11 · Accessibility

- **Semantics.** A real `<table>` with `<th scope="col">` column heads and a `<th scope="row">` first
  cell per row. No explicit ARIA table roles: they existed for the stacked order (WebKit drops table
  semantics from elements whose `display` changes), and nothing changes `display` any more.
- **Scroll region.** The frame is `role="region"`, `tabIndex={0}`, named by the caption (or, with no
  caption, `aria-label="{key column heading} table"`). A scroll container a keyboard cannot reach is
  a WCAG 2.1.1 failure; focused, the arrow keys scroll it. It is focusable at every width, including
  where nothing overflows — knowing whether it overflows needs client JS, and one extra tab stop is
  the cheaper error.
- **Accessible name.** The caption, through `aria-labelledby` on the table and the region. With no
  caption the table has no name of its own; the region takes the fallback label and the summary (or
  the section heading) introduces it; § 17 Q4.
- **Keyboard.** Tab reaches the frame, then the links inside cells in DOM order — row by row, left to
  right. Focusing a link inside a scrolled-away column scrolls the frame to it natively.
- **Ids / idrefs.** One: the caption's `useId()` id, referenced by the table and the region, and only
  rendered when the caption is. `npm run aria:check` proves it resolves.
- **Focus ring / contrast / motion.** The frame's ring is `--dtab-ring-ink` at the system's
  `--focus-ring-width` / `--focus-ring-offset`, outside the border. Links use Prose's ring. Floors are
  in § 6. Nothing moves.
- **What a screen reader says** (VoiceOver): "Modernisation route comparison, group" on the frame,
  then "Modernisation route comparison, table, 3 columns, 4 rows"; then for a cell "Typical
  disruption, Repair, Low".
- **Empty cell.** Announced blank by the reader on its own; the dash is `aria-hidden`.
- **Forced colours.** The fades are removed under `forced-colors: active` — the system replaces the
  body ground, so a fade to it would draw a band of the wrong colour over text. Rules are borders
  and the focus indicator is an `outline`, both of which forced colours keep.

## 12 · Content edge cases

| Case                                   | Handling                                                                                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Longest realistic string               | Wraps within its column; a long row header wraps inside the held key column (specimen § 2).                                                                                  |
| One long unbroken token                | `overflow-wrap: anywhere` breaks it at the column floor; in a `nowrap` / `numeric` column it widens the table and the frame scrolls — an authoring error, not a broken page. |
| Zero rows                              | Renders nothing, warns in development. The seam already drops a block with no rows.                                                                                          |
| One / two rows                         | Renders, warns (designed range 3–8).                                                                                                                                         |
| Many rows (9+)                         | Renders every row, warns. Nothing truncates or paginates (specimen § 9).                                                                                                     |
| No data columns (the key column alone) | Renders the row headers, warns: "a key column alone is a list, not a table" (specimen § 9).                                                                                  |
| More than five data columns            | Renders, warns. Live: `product-modernisation-assessment` sends six; it still fits 1176, and scrolls below it (§ 17 Q6).                                                      |
| Cell count ≠ column count              | Padded with empty cells or truncated (a cell with no column head has no header), warns. The seam already makes CMS rows agree.                                               |
| Missing caption / summary              | Closes up; nothing reserves space (specimen § 5).                                                                                                                            |
| Empty cell                             | A quiet dash, `aria-hidden`; the cell is still a cell.                                                                                                                       |
| Blank row header                       | Renders an empty `<th scope="row">`, warns.                                                                                                                                  |
| Narrow track                           | The frame scrolls once the column floors exceed the track (§ 9).                                                                                                             |
| A parent that does not size it         | The frame scrolls only when something caps its width. In a Cluster row it would take the table's full width instead; place it in a block or a Layout track.                  |
| Logical properties                     | `padding-inline`, `border-block-*`, `border-inline-end`, `inline-size`, `overflow-x`, `text-align: start / end` throughout. The key rule follows the key column in RTL.      |
| Nested surface                         | Resolves from its own surface block (§ 6).                                                                                                                                   |
| Two adjacent                           | The caller's Layout owns the seam (`--gap-stack` in ContentSection).                                                                                                         |
| Interactive content in a slot          | Inline links only, through Prose. No buttons, no forms; a cell is not an action slot.                                                                                        |

## 13 · Motion

**None, and why.** Nothing transitions, animates or transforms; scrolling is the user's, and native. There is no `prefers-reduced-motion` block because there is
nothing to reduce.

## 14 · Do's and Don'ts

- **Do** render a `<th scope="row">` as the first cell of every body row. Check:
  `grep -c 'scope="row"'` on a rendered route equals its row count.
- **Do** keep the frame keyboard-reachable. Check: `grep -n 'tabIndex={0}' src/patterns/DataTable/DataTable.tsx` finds the frame.
- **Don't** hand-roll arrangement. Check:
  `perl -0pe 's{/\*.*?\*/}{}gs' src/patterns/DataTable/DataTable.module.css | grep -nE 'display:\s*(grid|flex|inline-flex)'` → nothing.
- **Don't** use margins. Check: `perl -0pe 's{/\*.*?\*/}{}gs' src/patterns/DataTable/DataTable.module.css | grep -n margin` → nothing.
- **Don't** paint a ground except through the two ground tokens. Check: every `background` in `DataTable.module.css` reads `--dtab-body-ground` or `--dtab-head-ground`.
- **Don't** zebra-stripe, sort, filter or paginate. Check: no `:nth-child(odd|even)`, no `'use client'` in `DataTable.tsx`.
- **Don't** let the page scroll horizontally — only the frame does. Check: `npm run shots -- data-table` → 0 overflow at 390.
- **Don't** restack the table at a narrow width. Check: no `@container` in `DataTable.module.css`, and its only `@media` rules are `print` and `forced-colors`.
- **Don't** flatten cells to plain text at the seam. Check: `grep -n richTextToPlainText src/content/sources/strapi/table.ts` finds one call, the row-header line.

## 15 · Specimen plan — `/design/data-table`

1. Column counts: key + 2 (the live product-modernisation-test table), key + 3, key + 5.
2. Rows: 8; long row headers.
3. Column behaviour: `numeric`; a mono key (a `nowrap` key column beside a `nowrap` column of inline
   code); `hold` beside a greedy prose column.
4. Inline marks, links and two paragraphs in one cell; empty cells, including a fully empty row.
5. Caption and summary: both, caption only, summary only, neither.
6. Narrow tracks scroll: key + 5, marks/empty, numeric/nowrap in `.trackMobile` (326), and three
   tables in the 392 three-up track — all scrolling at 1440 because the floors are the columns'.
7. Four surfaces as sibling bands with identical markup, each with a fitting and a scrolling table.
8. Nested surfaces: tint in ink, ink in paper, blue in paper.
9. Out of contract: 1 column, 9 rows, 6 data columns, mismatched cell counts and a blank row header.
10. Two adjacent.

No state needs pointing at beyond the frame's focus ring, which Tab reaches on any specimen.

## 16 · New token requests

```
--dtab-rule-width        :root  var(--border-width-hairline)
--dtab-fluid-size        :root  176px — component size, § 7(b)
--dtab-hold-size         :root  192px — component size, § 7(b)
--dtab-fade-size         :root  var(--space-48) — component size, § 7(b)
--dtab-body-ground       per surface, § 6
--dtab-head-ground       per surface, § 6
--dtab-head-ink          per surface, § 6
--dtab-key-ink           per surface, § 6
--dtab-caption-ink       per surface, § 6
--dtab-rule-ink          per surface, § 6
--dtab-empty-ink         per surface, § 6
--dtab-ring-ink          per surface, § 6

Removed in the 29 Sep revision: --dtab-hidden-size (the stacked head clip) and
--dtab-head-rule-ink (the strong head rule; the head fill separates the head now).
```

Registered in `tokens/index.css` in the same edit. Every other value is an existing token.

## 17 · Open questions

All non-blocking. Each was decided in the direction most consistent with CLAUDE.md and the brief,
and built that way; the owner may overturn any of them without a structural change.

**1 · Narrow tracks — non-blocking, overturned 29 Sep.** Built first as (b) a container query that
restacked every row into key-above-value groups below a 704 track. **The owner overturned it: the
table keeps its shape and the frame scrolls sideways** (§ 9). A stacked table loses the structure
that makes it readable across a row, and the scroll is contained by the frame, so the page itself
still never scrolls horizontally.

**2 · A sticky key column — non-blocking.** Asked 29 Sep. **Built: not pinned.** At 390 a pinned key
column takes about 40% of the width on every scroll position, and a pinned cell needs a ground so
content does not show through it.

**3 · Caption above or below; summary relative to it — non-blocking.** **Built: the seam's
precedent** — summary as a paragraph before the table, caption directly above the frame as its name
(a `<p>` named by `aria-labelledby`, § 10). Moving the summary after the table would turn an intro
into a caveat. No
`aria-describedby` from table to summary: the summary is immediately before the table in reading
order, and an idref adds a dangling-reference risk for no gain.

**4 · A table without a caption has no accessible name — non-blocking.** 3 of 39 live tables send no
caption. **Built: render without a name**; the ContentSection heading above introduces it. A
content recommendation, not a component change: every table block should carry a caption.

**5 · Grounds and row header distinction — non-blocking, revised 29 Sep.** The brief said the table
must not own a ground. **The owner overturned that: the table is boxed**, with a body ground and a
head fill on every surface (§ 6), because a table without structure is hard to read. The key column
is distinguished by voice — `--text-h6`, the display face at medium weight, plus the raised ink —
A mono uppercase key was offered and declined; the h6 voice was kept.

**6 · Column range — non-blocking.** The brief says "2 to 5 data columns", but its own counts (2 on
12 tables, 3 on 34 …) and the live data (39 tables, 2–5 columns in total, key included, plus one of 7) show those are TOTAL columns. **Built: key + 1 to 5 data columns designed**, warnings outside it.
The live `product-modernisation-assessment` audit sends 6 data columns: it renders, scrolls below
1176, and is flagged as a content trim.

**7 · Where column behaviour comes from on live routes — non-blocking.** Strapi has no field for it,
so every live table renders the defaults (key `hold`, data `fluid`). **Built: presentation props,
defaults on routes.** Logged as `docs/strapi-changes.md` § 10: an optional semantic column kind
(text · numeric · identifier), which is content meaning, not layout. No inference from cell content —
code does not guess.

**8 · Rich text in the row header — non-blocking.** **Built: plain text**, as the seam had it. A row
header is a name and the cell's header for a screen reader; no live table puts a
mark or link in the first column.

**9 · The seam's cell format — non-blocking.** (a) sanitised HTML strings; (b) a small inline-mark
structure. **Built: (a)**, through the same `richTextToHtml` every other rich-text field uses, rendered
by Prose — one sanitiser, one set of mark styles.

**10 · The table best-practice pass — 29 Sep, owner-requested.** Checked against Adrian Roselli's
"Under-Engineered Responsive Tables", NN/g's data-table guidance and the scroll-shadow techniques
(Lea Verou, Ben Frain). **Adopted:** a real `<table>` with scoped headers and no display reflow
(already); a focusable, named scroll region with a visible outline (already); dividers on every row
and column; a scroll hint on each clipped edge; overscroll containment; a print rule; a forced-colours
rule. **Not adopted, and why:** a frozen head row (3–8 rows never outrun the viewport, and a sticky
head inside a horizontal scroll container sticks to the frame, not the page); a frozen key column
(the owner declined it, Q2); zebra stripes or a row hover highlight (NN/g offers them as
alternatives to borders — with a rule on every row and column the orientation is already there, and
a hover ground in a reference table reads as selection); a custom scrollbar (the platform's is the
accessible one); scroll-snap (Roselli: browser bugs, and it fights the user's own scroll); sort,
filter and column hiding (reference tables, not data grids, § 1). Right-aligned numerals with
tabular figures and headers aligned with their content were already in place.

## Appendix · Self-audit

```text
STRUCTURE
[x] All 18 sections present, in order.
[x] Tier 2 pattern, Status approved, prefix --dtab-* with no collision.
[x] Every Anatomy part appears in colour, geometry or typography, or is delegated to Prose.

NAMES
[x] --dtab-* tokens declared: 12 (4 geometry in :root, 8 colour × 4 surfaces).
[x] Every existing name referenced resolves in the token layer (npm run design:check).
[x] Every layout distance is a gap-scale role; three component sizes (fluid 176, hold 192, fade 48)
    are stated and commented.
[x] Zero hex and zero raw px in the module.

COLOUR AND CONTRAST
[x] 8 rows × 4 complete cells. Every text token ≥ 4.5:1 on the ground it sits on (lowest 4.91:1,
    the caption on blue). Non-text marks ≥ 3:1 (lowest 3.16:1). Rules marked decoration. Every
    Prose ink re-measured on each body ground.
[x] One paragraph per surface; nested surfaces specified and rendered.

STATES
[x] None; the table is not interactive. The frame's focus ring is a focus indication. Links are
    Prose's.

LAYOUT
[x] No display grid/flex, no margins, no Section override. Grounds only through --dtab-*-ground.
[x] No horizontal page overflow at 390 (npm run shots: 0 problems); the frame scrolls instead.
```

## Amendment · 1 Oct 2026 — a cell may be a composed mark

**Why.** The service pages drew two tables as hand-made rows (Modernisation's interventions, Design
Systems' representations) because one column needed a mark DataTable could not hold — a disruption
meter, a chip. Drawn as rows they lost table semantics, and on a phone they collapsed into the same
stacked blocks as the cards above them, so comparison data and peer items looked alike. Owner: *"the
disruption table should be a table?"*

**The rule this settles:** content a reader compares ACROSS rows — every row the same attributes — is a
table and stays one at every width (DataTable scrolls sideways on a phone, behind its edge fades). Peers,
each a name and a line, are cards or rows and stack.

**The change.** A `cellsHtml` entry may be `{ node: ReactNode }` (`DataTableNodeCell`) instead of a
trusted HTML string: a mark the caller composes, placed in the cell as given. The node owns its own text
alternative (the disruption meter carries a visually hidden "Disruption: 3 of 6"). Strings keep their
contract unchanged. Give a mark column `behaviour: 'nowrap'`.

**Row range, 1 Oct 2026.** Three to twelve, up from eight. The cap was a content estimate, not a
layout limit — rows are one ruled line each and nothing in the frame depends on the count — and the
first comparison matrix (Design Engineering: ten things to decide, each answered by static screens or
a coded slice) is a legitimate ten-row table. Above twelve the warning still fires.

## Amendment · 6 Oct 2026 — `page-product-design` fix round 2: `frame="ruled"` (withdrawn 7 Oct 2026)

`frame?: 'boxed' | 'ruled'`, default `boxed` (everything above). `ruled` draws no box: no outer
border, no head fill, no body ground, no column dividers. The head row closes on the strong rule
(`--dtab-rule-strong-width`, `--dtab-rule-strong-ink`), the rows on the hairline, the key starts on
the band's text edge, and the scroll fades fade to the band's own ground (`--dtab-band-ground`,
restated per surface by value). For a table that IS a band's diagram — the service page's spectrum
and check matrix — where the owner's ruling "no boxes around text content" holds and the columns
are few enough to read by alignment. Specimen: `/design/data-table` § 2.

## Amendment · 7 Oct 2026 — owner design review: tables are boxed

**The rule: tables are boxed.** Tabular content renders as this table in its boxed frame — outer
border, head fill, body ground, a hairline between every row and every column. The box is the
table's, not a variant. Recorded in `docs/kit/visual-direction.md`, "Owner rulings · 7 Oct 2026",
rule 1.

- **`frame` is removed**, with `DataTableFrame`, the `.ruled` overrides and the three tokens only it
  read (`--dtab-rule-strong-width`, `--dtab-rule-strong-ink`, `--dtab-band-ground`, the last two per
  surface). The ruled tables (the service page's spectrum and matrix) read dense and compact: rows ran
  together with nothing to hold them, and without its frame a table stops reading as one. The
  6 Oct "no boxes around text content" ruling still governs cards and diagrams; a table is not text
  content in a box.
- **The service page's three tables are boxed**: Spectrum, Matrix and Record. Record — a record's
  fields and the question each holds, which had been a ruled sheet — is now a two-column DataTable
  under a set heading; six fields or more set as two boxed halves side by side from 1024 (as the
  Matrix halves already did), each half its own table with its own head row, so the band keeps the
  fold (775 and 759 at 1440).
- **A composed `{ node }` cell is top-aligned** (`.nodeCell`). Every other cell sits on the row's
  shared baseline; a node has no text, so its baseline is its bottom edge, and the 24 disruption
  trace pushed every text cell in its row down 7px (rows 65 instead of 58, which ran the
  modernisation spectrum band to 849, past the fold). Top-aligned, a 24 mark sits in the 26 first
  line box and the text keeps its baseline.
- Specimen: `/design/data-table` loses the ruled row; its intro states the rule.

## Amendment · 4 Nov 2026 — the audits, tools and glossary run (status proposed; owner to judge)

Additive props, each with its `/design/data-table` rows; the default table is unchanged.

- **`appearance="sheet"`**: a record (a key and one value) as a spec sheet: mono key in a narrow track,
  value beside it, one rule above the set, no frame, fill or inner rules, the head row out of sight but in
  the accessibility tree. A table with more than one value column stays `boxed`. The audits' report page.
- **`narrow="read-down"`**: below 768 each row becomes one block in the same box, the key its title and each
  value under its column head in the mono label voice. From 768 the boxed table. The tools' worksheets and
  the glossary's comparisons (decisions/2026-11-04-worksheet-tables-read-down-on-a-phone).
- **`bounded`**: with `read-down`, a table on a ground that already bounds it (a tool's example panel)
  drops the box's side edges, fill and inline inset below 768.
- **`keyColumn` optional**: a keyless table, every column a peer under its own head (the glossary's
  "style guide · component library · design system" comparisons).
- **`pickColumn`**: the one column the table is about, the row pick turned a quarter: blue ground down its
  cells, its head in blue, a bar across the head's top edge. At most one; never reorders.
- Exception, argued in the module: the sheet's hidden head row uses `font-size: 0; line-height: 0` so its
  words stay readable to a screen reader.
