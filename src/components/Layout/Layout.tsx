import type { CSSProperties, ElementType, ReactNode, Ref } from 'react';

import { cx } from '@/lib/cx';

import styles from './Layout.module.css';

/**
 * The gap scale — the token system's nine steps, named for what they separate. Each resolves to
 * a `--gap-*` usage token; Layout declares no distances of its own.
 *
 *   inline        4   inside a key and its value
 *   tight         8   icon to label, chip padding, a stat and its unit
 *   text         16   paragraph to paragraph, cell padding on a dense table
 *   block        24   head to body inside a block — the most used step
 *   gutter       32   container gutter, and the gap between cards in a set
 *   stack        48   block to block inside a section
 *   column       64   column gutter where two halves must read as separate
 *   section      96   section padding, tight
 *   section-open 128  section padding, open
 *
 * A step is chosen by what it separates, never by how it looks at one width — the scale does not
 * shift responsively, the layout does. A distance that is not one of these nine is a mistake or
 * a new step; do not split the difference.
 *
 * `none` is not a step. It is the explicit statement that two rows share an edge, which is a
 * layout decision rather than a distance.
 */
type Gap =
  | 'none'
  | 'inline'
  | 'tight'
  | 'text'
  | 'block'
  | 'gutter'
  | 'stack'
  | 'column'
  | 'section'
  | 'section-open';

/** Block-axis placement of items within their row, and inline-axis placement within their track. */
type Place = 'stretch' | 'start' | 'center' | 'end';
/** Inline-axis distribution of the TRACKS themselves. Matches Cluster's `justify`, `between` included. */
type Distribute = 'start' | 'center' | 'end' | 'between';

/** Minimum track width for `columns="fit"` — component geometry, so a small local ramp. */
type MinTrack = 'xs' | 'sm' | 'md' | 'lg';

/**
 * A column shape: a count of equal tracks (`3`) or fractional weights (`[2, 1]`, `[1, 1, 2]`).
 * Children fill the tracks in order; each owns its own sizing.
 *
 * A weight may be `'auto'` (owner, 7 Oct 2026): a CONTENT-SIZED track, as wide as its child and no
 * wider, while the fractional tracks share what is left. For a row whose one side is a control
 * group that must not stretch or wrap early — a section head's actions set at the end of the
 * heading's row (`[1, 'auto']`). Never for content that reads: an auto track holding text grows to
 * the text's full length.
 */
type ColumnSpec = number | (number | 'auto')[];

/**
 * How the tracks are arranged. Two models, deliberately both available:
 *
 * BREAKPOINT-DRIVEN — a count/ratio (applies from md up, collapsing to 1 below), or a
 *   per-breakpoint object. You decide the arrangement per viewport.
 *
 * CONTENT-DRIVEN — as many tracks as fit at `minTrack` wide, reflowing continuously with no
 *   breakpoints, because that is the point: the content's own width decides. Two flavours,
 *   differing only in what happens to LEFTOVER space:
 *     "fit"  — tracks stretch to absorb it (1fr). The common case; a part-full last row spreads.
 *     "tile" — tracks keep their width and the leftover stays leftover, so `justify` can
 *              distribute it. This is what makes a part-full last row of cards stay card-width
 *              and centre instead of stretching, and it is the only arrangement where
 *              `justify` does anything at all (see that prop).
 */
/** The four breakpoints every responsive Layout prop is stated against: base, then 768 / 1024 / 1440. */
type Breakpoint = 'base' | 'md' | 'lg' | 'xl';

/**
 * A value per breakpoint, or one bare value. The convention is the one `columns` already set: a
 * BARE value applies from md up and leaves base alone, because base is the single-track stack in
 * every breakpoint-driven arrangement and a placement prop has nothing to act on there. An object
 * states each breakpoint it names; an unnamed breakpoint inherits the nearest smaller named one.
 */
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

/** How many leading tracks `offset` leaves empty. 0 exists to switch an inherited offset off. */
type Offset = 0 | 1 | 2 | 3;

type Columns =
  | ColumnSpec
  | 'fit'
  | 'tile'
  | { base?: ColumnSpec; md?: ColumnSpec; lg?: ColumnSpec; xl?: ColumnSpec };

/**
 * Where the row SCROLLS sideways instead of stacking or wrapping (fdn-scroll, 6 Oct 2026;
 * visual-direction § 3.7 item 2 and the Slider, § 1.4 rule 3).
 *
 *   until-md  below 768 only. One item per view with the next one peeking, so a linked card set of
 *             more than three reads as a row you swipe rather than a 2300px column; from md up the
 *             `columns` apply exactly as they would without the prop. Only where every item is
 *             focusable (§ 3.7): Tab is how a keyboard moves the row, so a set of unlinked cards
 *             stays stacked.
 *   always    every width. The Slider's mode — use it through `Slider`, which adds the controls that
 *             say there is more from md up (below md the peek says it). On its own it is a row with
 *             no visible affordance on a desktop without a trackpad.
 */
type Scroll = 'until-md' | 'always';

export type LayoutProps = {
  /** Element to render (default "div"; use "ul"/"ol"/"section" etc. as needed). */
  as?: ElementType;
  /**
   * Block-axis seam — the distance between ROWS. A step on the gap scale; NO default, so an
   * axis nobody sets renders 0. That is deliberate: a silent 24 looks plausible and hides the
   * omission, while a collapsed seam is wrong on sight. A vertical stack needs only this one.
   */
  rowGap?: Gap;
  /**
   * Inline-axis seam — the distance between COLUMNS. Same scale, same no-default rule. Nothing
   * to act on without `columns`, so a single-track Layout leaves it off.
   */
  colGap?: Gap;
  /** Column arrangement. Omitted → vertical (1 track). `3` → 3 equal; `[2,1]` → 2:1; `"fit"` → reflow. */
  columns?: Columns;
  /**
   * Track width for the content-driven modes (`columns="fit"` / `"tile"`) — a minimum under
   * "fit", the actual width under "tile". Default "md" (20rem). Ignored otherwise. Tracks never
   * overflow: below this width the grid drops to a single column on its own.
   */
  minTrack?: MinTrack;
  /**
   * Make every item the same height — fills its row AND keeps rows equal after wrapping
   * (`grid-auto-rows: 1fr` + forced block-axis stretch). Pair with `columns`; this overrides
   * `align` on the block axis (use `justifyItems` for inline placement). Do not use on a
   * vertical stack — it would crush heading + body to equal height.
   */
  equalRows?: boolean;
  /**
   * The first child LEADS the set: it spans every track, in a row of its own sized to its own
   * content, and the remaining children fill the tracks below it. This is the arrangement for a
   * featured item above a set of peers (BlockCard's featured card, ruling C3) — one list, one
   * grid, and the lead's span is the CONTAINER's statement about its first child rather than a
   * child deciding its own placement.
   *
   * With `equalRows`, only the rows after the lead are equalised: the lead's row is explicit and
   * `auto`, the implicit rows below it are `1fr`, and a flexible row never sizes against an item
   * in an auto one. So a tall lead does not stretch every card row to its height.
   *
   * `"tall"` is the other featured shape (cmp-feature, 6 Oct 2026): from lg (1024) the first child
   * takes the FIRST track and spans every row, and the rest stack in the track(s) beside it — a
   * 2:1 lead beside a stacked pair, `columns={{ lg: [2, 1] }}`. The span is the container's, as
   * above, and is read from the DOM (`:has`), so it covers up to six children. Below lg it is the
   * ordinary single-track stack: a span there would only open empty rows. With `equalRows` the
   * stacked rows share the lead's height equally.
   */
  lead?: boolean | 'tall';
  /**
   * Reverse the VISUAL order of the tracks, per breakpoint — the image/text pair whose image sits
   * right on desktop and first on a phone, or a band that alternates sides down the page. Bare
   * `true` applies from md up (see `Responsive`); `{ lg: true }` from 1024; `{ base: true, lg: false }`
   * reverses a base-2-track row and restores it from 1024.
   *
   * Mechanism, two halves. The CSS places child k at the k-th track from the END
   * (`grid-column: span 1 / -k`) and switches to `grid-auto-flow: dense`, so every child packs back
   * into the first row instead of the cursor dropping a row each time it moves leftwards. And the
   * template is MIRRORED wherever reverse is on, so a ratio travels with its child — `[2, 1]`
   * reversed is `1fr 2fr` with the first child still in the 2fr track. No `direction`, no
   * `flex-direction`, and no `order` on a child — the container states the placement, as it does
   * for `lead`.
   *
   * VISUAL ONLY. DOM order, reading order and Tab order are unchanged, so a keyboard or
   * screen-reader user meets the children in source order while a sighted user sees them mirrored.
   * That is acceptable only where the two orders carry no meaning against each other — an image and
   * its copy, a figure and its caption block. Never reverse a sequence (steps, a form, a ranked list)
   * or anything whose focusable children would then tab right-to-left. Source order is the reading
   * order: write it that way, then reverse for the eye.
   *
   * Scope: ONE row of breakpoint-driven tracks (a count or ratio), up to four children — a pair or
   * a triple, as many children as tracks. It does nothing useful on `fit` / `tile` (the explicit
   * grid there includes collapsed tracks) and a fifth child is not placed. Ignored when `lead` is set.
   */
  reverse?: Responsive<boolean>;
  /**
   * The first child starts at track n+1, leaving n leading tracks empty — editorial asymmetry, a
   * narrow reading column set into the page rather than hung from its left edge
   * (`columns={[1, 2]} offset={1}` → one child in the 2fr track). Children after the first flow on
   * from where it ends. Bare values apply from md up; `0` switches an inherited offset off.
   *
   * Mechanism: `grid-column-start: n+1` on the first child, written by the container. State it only
   * where there are more than n tracks — an offset past the last track makes an implicit column.
   * Ignored when `lead` or `reverse` is set: all three place the first child, and one wins.
   */
  offset?: Responsive<Offset>;
  /**
   * Pin the LAST child to the foot of the stack — a card's call to action sitting on the card's
   * bottom edge, so the ctas of a row of cards with different body lengths line up. For a
   * single-track stack that is stretched taller than its content (a card in a row of cards).
   *
   * Mechanism: the grid template becomes `auto … auto 1fr` — one content-sized row per child, then
   * a flexible last row that absorbs all the spare height, with the last child aligned to that
   * row's end. No margin, no spacer element: the space is a track. `rowGap` still separates every
   * row, so the stated seam remains the minimum above the pinned child. The row count is read from
   * the DOM (`:has(> :last-child:nth-child(n))`), not from React, so fragments and conditionally
   * rendered children count as what actually renders; the template covers up to eight children.
   * With no spare height (a stack at its content height) the 1fr row is content-sized and the
   * stack renders exactly as without the prop.
   *
   * Single-track only — on a multi-track grid the row count is not the child count.
   */
  pinLast?: boolean | 'lg';
  /* `'lg'` pins from 1024 only (the same template, counted the same way): for a stack that is two
     tracks of one row at md and one track from lg, where the template's flexible row would be an
     empty row at md (Bento's odd last tile, wide below 1024). */
  /**
   * From lg (1024), each child spans this many rows of the grid and lays its OWN children on them (CSS
   * subgrid), so the parts of side-by-side items start on one line (home paths, 30 Oct 2026). Each
   * child must be a single-track Layout with exactly that many children; its own rowGap still sets the
   * seam between them. Below lg nothing changes.
   */
  shareRows?: 2 | 3 | 4;
  /**
   * From lg (1024), THIS Layout spans this many rows of its parent's grid and takes them as its own
   * (CSS subgrid), the other half of `shareRows` one level down: for an item that shares its
   * parent's rows and holds a box round only some of them (home's door cards, 4 Nov 2026: the card
   * spans the first two shared rows, its example the third, outside the box). Its own rowGap sets
   * the seam between the rows it spans. Below lg nothing changes.
   */
  spanRows?: 2 | 3;
  /**
   * The FIRST child's row takes a stretched stack's spare height (cmp-feature fix round 2, 6 Oct
   * 2026) — the mirror of `pinLast`. For a card stretched to a taller neighbour whose cover should
   * grow into the space rather than leave it empty under the copy: the spotlight's lead at 1024,
   * where its two companions run taller than it. The template is `1fr` with every later row `auto`,
   * so the first child never drops below its own content size (an aspect-ratio box keeps its
   * ratio's height as the floor) and only grows. With no spare height it renders exactly as
   * without the prop. Single-track only. The stack must itself fill its parent's height (the
   * caller states that, as a stretched card does) or there is nothing to take.
   */
  fillFirst?: boolean;
  /**
   * The LAST child's row takes a stretched stack's spare height, and the child fills it (19 Oct
   * 2026, the chip enquiry form) — `fillFirst` at the other end, and `pinLast` without the pin. For a
   * stack stretched to a taller neighbour whose last item should grow rather than leave a hole under
   * it: the split panel's message field, which runs down to where the chip half beside it ends so
   * both halves finish on one line. The template is `pinLast`'s (`auto … auto 1fr`, counted from the
   * DOM, up to eight children); the last child keeps the default stretch instead of sitting at the
   * row's end. With no spare height it renders exactly as without the prop. Single-track only.
   */
  fillLast?: boolean;
  /**
   * From lg (1024) every EVEN child drops by the `section` step (96), so a row of cards reads as
   * placed by hand rather than tiled (references.md § 3.4 item 12: "Stagger breaks the grid", kept
   * as a Layout option, cmp-feature fix round 2). The offset is a TRACK, not a margin: the row is
   * three explicit rows — the offset, the cards, the offset — and odd children take the first two
   * while even ones take the last two, so the band grows by exactly the offset and nothing sets
   * its own outer spacing. `rowGap` is not used inside the staggered row.
   *
   * Scope: ONE row — as many children as the template has tracks at lg (a pair, a trio). A second
   * row would overlap the first. Below lg nothing is placed and `rowGap` applies as usual.
   */
  stagger?: boolean;
  /**
   * Block-axis placement — how items sit vertically in their row (e.g. centre copy against a
   * taller image). Default "stretch". `baseline` aligns the items' LAST baselines: a split head's
   * ask set on its lead's last line (PageHero `display`, the Quantum split header).
   * `first-baseline` aligns their FIRST lines: a row whose two sides open at different type sizes
   * and either may wrap — a large line and the smaller reply beside it (VoiceLedger, 11 Oct 2026),
   * where `start` set the reply's first line high and `baseline` sank it to the large line's last.
   */
  align?: Place | 'baseline' | 'first-baseline';
  /**
   * Inline-axis placement of each item WITHIN its own track. Default "stretch" (fill the
   * track); "center" shrinks each item to its content and centres it — how a centred copy
   * stack works. This is per-item. To move the tracks themselves, use `justify`.
   */
  justifyItems?: Place;
  /**
   * Inline-axis distribution of the TRACKS within the container — the counterpart to
   * `justifyItems`. Same meaning as Cluster's `justify`, `between` included. Omit for the
   * browser default.
   *
   * Requires slack to distribute, so in practice this means `columns="tile"`. Every other
   * arrangement sizes its tracks in `fr` units, which by definition consume all free space —
   * there is then nothing left for this prop to move, and setting it does nothing. That is a
   * property of fr tracks, not an oversight.
   */
  justify?: Distribute;
  /**
   * Scroll the row sideways instead of wrapping it — see `Scroll`. In scroll mode `columns` states
   * how many items are IN VIEW at each breakpoint, so it takes counts, not ratios: `3` is one in
   * view at base and three from md up, the bare-value convention; `{ base: 1, md: 2, lg: 3 }`
   * names each step. Below md the row always shows its base count plus a peek of the next item
   * (`--lay-scroll-peek`); from md up it shows exactly the count, so a Slider's three cards are
   * the 392 of a 3-up grid and the band's arithmetic is unchanged.
   *
   * Every item is a snap point (`scroll-snap-align: start`, written by the container like `lead`'s
   * span). `colGap` is the seam between items and is stated or 0, as everywhere; `rowGap` has one
   * row to act on and does nothing while the row scrolls. Smooth scrolling only under
   * `prefers-reduced-motion: no-preference`. The scrollbar is hidden: the peek, focusable items and
   * the Slider's controls are the affordances.
   *
   * The scroll box is grown by `--lay-scroll-ring-room` on every side (padding, cancelled by an
   * equal negative margin), because a scroll container clips whatever paints outside it and an
   * item's focus ring is drawn 4px outside the item. The items stay on the column's edges; that
   * is the one optical correction the mode makes. `lead`, `reverse` and `offset`
   * place children in an explicit grid the scrolling row does not have, so they are ignored
   * wherever the row scrolls.
   */
  scroll?: Scroll;
  /**
   * Whether a scroll row shows `--lay-scroll-peek` of the next item below md. Default `true`. The
   * Slider turns it off at one per view (cmp-testimonials, 6 Oct 2026): a one-up slide is a
   * composite — a portrait over a quote — so its peeking start edge is a sliver of photograph and a
   * loose quote rule, not a card's edge, and the Slider's controls already say there is more.
   * Ignored without `scroll`. `'always'` keeps a peek from md up too, inside the column
   * (`--lay-scroll-peek-wide`): a Slider whose next card should show without the row leaving the
   * column (owner, 26 Oct 2026: the bled row "just shows the overflow").
   */
  peek?: boolean | 'always';
  /**
   * The rendered element, for a caller that drives a scroll row (the Slider reads its scroll
   * position and scrolls it). A plain prop, as React 19 passes refs.
   */
  ref?: Ref<HTMLElement>;
  /**
   * Only for a scroll row whose items hold nothing focusable — testimonial slides, text cards —
   * which a keyboard can then reach and scroll with the arrow keys. A scroll container no key can
   * reach fails WCAG 2.1.1. Leave it off everywhere else.
   */
  tabIndex?: 0 | -1;
  /**
   * The element's accessible name. For a scroll row that takes `tabIndex` (a focusable list with
   * no name is announced as an unlabelled stop); the Slider names its own region with `label`.
   */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
} & { [key: `data-${string}`]: string | undefined };

/** Turn a column shape into a grid-template-columns value. */
function track(spec: ColumnSpec): string {
  return typeof spec === 'number'
    ? `repeat(${spec}, minmax(0, 1fr))`
    : spec.map((weight) => (weight === 'auto' ? 'auto' : `minmax(0, ${weight}fr)`)).join(' ');
}

/**
 * A responsive prop as the breakpoints it names. A bare value lands on md, the columns convention;
 * `undefined` names none, so the prop emits no class at all and the default stands.
 */
function perBreakpoint<T extends boolean | number>(
  value: Responsive<T> | undefined,
): [Breakpoint, T][] {
  if (value == null) return [];
  if (typeof value !== 'object') return [['md', value]];
  return (['base', 'md', 'lg', 'xl'] as const).flatMap((bp) =>
    value[bp] == null ? [] : [[bp, value[bp]] as [Breakpoint, T]],
  );
}

/**
 * The templates for a reversed Layout. Reversing the children alone would leave the WEIGHTS where
 * they were — `[2, 1]` reversed would put the first child in the 1fr track — so wherever `reverse`
 * is on, the track list is mirrored too and each child keeps its own width on the other side.
 * Both props cascade from smaller breakpoints independently, so this resolves each breakpoint in
 * full and states all four explicitly rather than leaning on the CSS fallback chain.
 */
function reversedVars(
  columns: ColumnSpec | Exclude<Columns, ColumnSpec | 'fit' | 'tile'>,
  reversed: [Breakpoint, boolean][],
): CSSProperties {
  const specs: Partial<Record<Breakpoint, ColumnSpec>> =
    typeof columns === 'number' || Array.isArray(columns) ? { md: columns } : columns;
  const on: Partial<Record<Breakpoint, boolean>> = Object.fromEntries(reversed);
  const vars: Record<string, string> = {};
  let spec: ColumnSpec | undefined;
  let flip = false;
  for (const bp of ['base', 'md', 'lg', 'xl'] as const) {
    spec = specs[bp] ?? spec;
    flip = on[bp] ?? flip;
    vars[`--tmpl-${bp}`] =
      spec == null
        ? 'minmax(0, 1fr)'
        : track(flip && Array.isArray(spec) ? [...spec].reverse() : spec);
  }
  return vars as CSSProperties;
}

function columnsToVars(
  columns?: Columns,
  reversed: [Breakpoint, boolean][] = [],
): CSSProperties {
  // Always emit all four breakpoint vars. The --tmpl-* custom properties INHERIT, so a nested
  // Layout that sets no columns would otherwise pick up an ancestor's template (e.g. a vertical
  // stack inside a 2-col hero turning into 2 columns). Pinning the unused breakpoints to
  // `initial` (the guaranteed-invalid value) makes each var() fall through its
  // smaller-breakpoint fallback chain down to 1fr — so an unset breakpoint means "single track
  // here", never "inherit".
  const vars: Record<string, string> = {
    '--tmpl-base': 'initial',
    '--tmpl-md': 'initial',
    '--tmpl-lg': 'initial',
    '--tmpl-xl': 'initial',
  };
  if (columns == null) return vars as CSSProperties;

  // Content-driven modes are set at BASE and never stepped: the same declaration holds at
  // every width, which is what makes them breakpoint-free.
  //
  // `min(track, 100%)` in both is what keeps them safe — a bare 20rem track would overflow a
  // narrower screen, whereas this lets the track shrink below its minimum once the container
  // is the smaller of the two, collapsing to a single column by itself.
  //
  // auto-FIT (not auto-fill) in both so leftover EMPTY tracks collapse rather than reserving
  // space. The difference is the second minmax argument: 1fr makes the tracks absorb slack
  // ("fit"), while its absence leaves them at their own width so `justify` can distribute it
  // ("tile").
  if (columns === 'fit') {
    vars['--tmpl-base'] = 'repeat(auto-fit, minmax(min(var(--layout-min-track), 100%), 1fr))';
    return vars as CSSProperties;
  }
  if (columns === 'tile') {
    vars['--tmpl-base'] = 'repeat(auto-fit, min(var(--layout-min-track), 100%))';
    return vars as CSSProperties;
  }

  if (reversed.some(([, isOn]) => isOn)) return reversedVars(columns, reversed);

  // Bare spec → applies from the md breakpoint up; base stays 1 track → collapses on mobile.
  if (typeof columns === 'number' || Array.isArray(columns)) {
    vars['--tmpl-md'] = track(columns);
    return vars as CSSProperties;
  }
  if (columns.base != null) vars['--tmpl-base'] = track(columns.base);
  if (columns.md != null) vars['--tmpl-md'] = track(columns.md);
  if (columns.lg != null) vars['--tmpl-lg'] = track(columns.lg);
  if (columns.xl != null) vars['--tmpl-xl'] = track(columns.xl);
  return vars as CSSProperties;
}

/**
 * The first breakpoint at which the arrangement has more than one track: where `equalRows` starts to
 * mean anything. On a single track "equal rows" makes every stacked item as tall as the tallest, so
 * a stack of cards with one long body opened a hole under every short one (home round 1, 10 Oct
 * 2026: the six situations at 390). Content-driven modes are judged at base. Undefined when the
 * arrangement never leaves one track.
 */
function firstMultiTrack(columns: Columns | undefined): Breakpoint | undefined {
  if (columns == null) return undefined;
  if (columns === 'fit' || columns === 'tile') return 'base';
  const specs: Partial<Record<Breakpoint, ColumnSpec>> =
    typeof columns === 'number' || Array.isArray(columns) ? { md: columns } : columns;
  return (['base', 'md', 'lg', 'xl'] as const).find((bp) => {
    const spec = specs[bp];
    return spec != null && viewCount(spec) > 1;
  });
}

/** A per-view count from a column shape: a ratio's length, as a safe reading of a misuse. */
const viewCount = (spec: ColumnSpec) => (typeof spec === 'number' ? spec : spec.length);

/**
 * Scroll mode's per-view counts, one custom property per breakpoint. All four are always written,
 * `initial` where unstated, for the reason `columnsToVars` gives: the properties inherit, and a
 * nested scroll row must never pick up an ancestor's count. `until-md` scrolls at base only, so it
 * needs only the base count; its md-up tracks come from the ordinary `--tmpl-*` templates.
 */
function viewVars(columns: Columns | undefined, scroll: Scroll): CSSProperties {
  const vars: Record<string, string> = {
    '--view-base': 'initial',
    '--view-md': 'initial',
    '--view-lg': 'initial',
    '--view-xl': 'initial',
  };
  if (columns == null || columns === 'fit' || columns === 'tile') return vars as CSSProperties;
  if (typeof columns === 'number' || Array.isArray(columns)) {
    if (scroll === 'always') vars['--view-md'] = String(viewCount(columns));
    return vars as CSSProperties;
  }
  for (const bp of ['base', 'md', 'lg', 'xl'] as const) {
    const spec = columns[bp];
    if (spec != null && (scroll === 'always' || bp === 'base')) {
      vars[`--view-${bp}`] = String(viewCount(spec));
    }
  }
  return vars as CSSProperties;
}

/**
 * Layout — the columnar layout primitive. Fills the content column Section gives it, owns the
 * two seams between its children, and arranges them into tracks: equal counts, fr ratios, or
 * as many as fit. A vertical stack is just the single-track case. Children never set their own
 * outer spacing; nest Layouts to vary rhythm.
 *
 * The two seams are set separately and neither has a default — a grid has a row seam and a
 * column seam and they are rarely the same relationship, so each is stated or it is 0.
 *
 * Non-uniform rhythm comes from NESTING, not from a rhythm knob — tighten by grouping, loosen
 * by separating. A heading's spacing is a consequence of which Layout it lives in.
 *
 * Varied arrangement comes from three placement props (tracker 2.17, 29 Sep 2026), so a page does
 * not repeat one `[2, 1]` shape down its length and nothing outside Layout writes a grid to vary it:
 * `reverse` mirrors a row per breakpoint (visual only), `offset` sets the first child n tracks in,
 * and `pinLast` pins a stretched stack's last child to its foot. All default off, and off they
 * emit no class and no custom property, so every existing Layout renders byte-for-byte as before.
 * `lead`, `reverse` and `offset` all place the first child and are exclusive, in that precedence.
 *
 * The fourth arrangement is a SCROLL ROW (`scroll`, fdn-scroll, 6 Oct 2026): the same children in
 * one sideways-scrolling, snapping row, `columns` naming how many are in view. It is how a linked
 * card set of more than three stays one row on a phone (§ 3.7) and what the Slider pattern drives.
 * Off, it emits no class and no custom property, so every existing Layout renders as before.
 * There is no docs/specs/Layout.md — this docblock and the prop docs above are the spec.
 */
export function Layout({
  as: Tag = 'div',
  rowGap,
  colGap,
  columns,
  minTrack = 'md',
  align = 'stretch',
  justifyItems = 'stretch',
  justify,
  equalRows = false,
  lead = false,
  reverse,
  offset,
  pinLast = false,
  shareRows,
  spanRows,
  fillFirst = false,
  fillLast = false,
  stagger = false,
  scroll,
  peek = true,
  ref,
  tabIndex,
  'aria-label': ariaLabel,
  className,
  style,
  children,
  id,
  ...data
}: LayoutProps) {
  // lead, reverse and offset all place the first child; precedence is lead > reverse > offset and
  // the losers emit nothing, so two rules never fight over one grid-column. A scroll row has no
  // explicit grid to place into: `always` drops all three, `until-md` drops lead and the base
  // breakpoint's placements, and keeps md-up ones for the grid it becomes there.
  const leads = lead !== false && scroll == null;
  const placeable = ([bp]: [Breakpoint, unknown]) =>
    scroll == null || (scroll === 'until-md' && bp !== 'base');
  const reversed = leads ? [] : perBreakpoint(reverse).filter(placeable);
  const offsets = leads || reverse != null ? [] : perBreakpoint(offset).filter(placeable);
  /* Equal rows apply only where the grid has more than one track (see `firstMultiTrack`); a scroll
     row is one row, so its base is never stacked. */
  const equalFrom = scroll ? 'base' : firstMultiTrack(columns);
  const vars =
    scroll === 'always'
      ? { ...columnsToVars(undefined), ...viewVars(columns, scroll) }
      : scroll === 'until-md'
        ? { ...columnsToVars(columns, reversed), ...viewVars(columns, scroll) }
        : columnsToVars(columns, reversed);
  return (
    <Tag
      {...data}
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      style={{ ...vars, ...style }}
      className={cx(
        styles.layout,
        rowGap && styles[`rowgap-${rowGap}`],
        colGap && styles[`colgap-${colGap}`],
        (columns === 'fit' || columns === 'tile') && styles[`mintrack-${minTrack}`],
        styles[`align-${align}`],
        styles[`justifyitems-${justifyItems}`],
        justify && styles[`justify-${justify}`],
        equalRows &&
          equalFrom &&
          styles[equalFrom === 'base' ? 'equal-rows' : `equal-rows-${equalFrom}`],
        leads && (lead === 'tall' ? styles['lead-tall'] : styles.lead),
        ...reversed.map(([bp, on]) => styles[`${on ? 'reverse' : 'forward'}-${bp}`]),
        ...offsets.map(([bp, n]) => styles[`offset-${bp}-${n}`]),
        pinLast === 'lg' ? styles['pin-last-lg'] : pinLast && styles['pin-last'],
        shareRows && styles[`share-rows-${shareRows}`],
        spanRows && styles[`span-rows-${spanRows}`],
        fillFirst && styles['fill-first'],
        fillLast && styles['fill-last'],
        stagger && scroll !== 'always' && styles.stagger,
        scroll && styles[`scroll-${scroll}`],
        scroll && !peek && styles['no-peek'],
        scroll === 'always' && peek === 'always' && styles['peek-always'],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
