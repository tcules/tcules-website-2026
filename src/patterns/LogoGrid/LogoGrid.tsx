import type { ReactNode } from 'react';

import { ClientMark, Cluster, Layout, type ClientMarkProps } from '@/components';
import { cx } from '@/lib/cx';

import styles from './LogoGrid.module.css';

/** One client with an approved mark: the same record ClientMark takes, density included — it is what sizes the mark. */
export type LogoGridMarkArt = Omit<ClientMarkProps, 'className'>;

/**
 * One client with NO approved mark yet (page-mapping G1): the name alone, typeset as a WORDMARK.
 * The asset policy says "render names as fallback; never invent a logo asset", so a client without
 * an SVG is still a member of the set — set in the wordmark role (sans, semibold, tight) in the
 * marks' own ink, so it sits in its cell as a logo does and never reads as a line of text.
 */
export type LogoGridMarkName = { name: string; src?: undefined };

/**
 * One cell of the grid: an approved mark, or a typeset wordmark for a client whose SVG has not
 * arrived. A set MAY mix them (home round 1, 10 Oct 2026, owner: "why would you list client names
 * when we have the logos?"). Until then a set with one missing mark set EVERY cell as a name in the
 * card-title serif, so the one real mark on the home page (Doodle) was hidden and the band read as a
 * list of names. The wordmark is drawn at the marks' ink and close to their cap height, so a drawn
 * mark beside a typeset one reads as two logos, not a logo beside a word.
 */
export type LogoGridMark = LogoGridMarkArt | LogoGridMarkName;

const hasArt = (mark: LogoGridMark): mark is LogoGridMarkArt => Boolean(mark.src);

/**
 * The width of the track the grid sits in, which decides how many cells fit across.
 *   full  the Section's whole column (1240 at 1470, 960 at 1024).
 *   body  a beside-head body track, two thirds of the column or less; the full column below 1024,
 *         where a beside head stacks. `arrangement="beside"` sets it for its own grid.
 */
export type LogoGridTrack = 'full' | 'body';

type Breakpoint = 'base' | 'md' | 'lg' | 'xl';

/**
 * Most and fewest cells across, per breakpoint. The floor is set by the widest mark: LatitudePay,
 * drawn by its density at 201 on desktop and 158 on a phone, must fit its cell with the guard.
 *
 * A phone is two across, every count (fix round, 9 Oct 2026). Three across a 390 column made ~108
 * cells and drew LatitudePay as an illegible tracked line ~90 wide; there is no padding to cut that
 * buys it back. Two across, a ~179 cell holds every mark at its full phone size, and a count with
 * one left over closes on a cell that spans the row (`lastFills`), so nine is still a whole
 * rectangle: four rows of two and one of one.
 *
 * Never more than four across at any width (owner, 9 Oct 2026).
 */
const RANGE: Record<LogoGridTrack, Record<Breakpoint, [max: number, min: number]>> = {
  full: { base: [2, 2], md: [4, 3], lg: [4, 3], xl: [4, 3] },
  body: { base: [2, 2], md: [4, 3], lg: [3, 2], xl: [3, 2] },
};

/**
 * The compact wall's ranges (owner, 4 Nov 2026, homepage pass: "smaller logos and smaller boxes but
 * enough space in every box so it still reads open and free"): the marks a step smaller (ClientMark
 * `sm`) and the cells shorter, so more sit across — up to six in the full column from 1024 (ten
 * marks are 5 × 2, twelve 6 × 2), five from 768. A phone stays two across: the cells are already
 * the narrowest a mark fits.
 */
const RANGE_COMPACT: Record<LogoGridTrack, Record<Breakpoint, [max: number, min: number]>> = {
  full: { base: [2, 2], md: [5, 4], lg: [6, 4], xl: [6, 4] },
  body: { base: [2, 2], md: [5, 4], lg: [4, 3], xl: [4, 3] },
};

/** How much room each mark gets. See `LogoGridProps.density`. */
export type LogoGridDensity = 'default' | 'compact';

/**
 * The column count for `count` cells: the most across, within the range, that divides the count,
 * so every row is full and the grid is a whole rectangle — 8 is 4 × 2, 9 is 3 × 3, 12 is 4 × 3.
 * A count with no divisor in range (7, 11, 13) takes the count that leaves
 * the fewest empty places in the last row, the wider on a tie. Fewer cells than the floor sit in
 * one row.
 */
function columnsFor(count: number, [max, min]: [number, number]): number {
  if (count <= min) return Math.max(count, 1);
  let best = max;
  let bestEmpty = Infinity;
  for (let c = Math.min(max, count); c >= min; c -= 1) {
    const empty = (c - (count % c)) % c;
    if (empty === 0) return c;
    if (empty < bestEmpty) {
      best = c;
      bestEmpty = empty;
    }
  }
  return best;
}

/** The per-breakpoint columns for a count in a track — exported so a specimen can label them. */
export function logoGridColumns(
  count: number,
  track: LogoGridTrack = 'full',
  density: LogoGridDensity = 'default',
) {
  const range = (density === 'compact' ? RANGE_COMPACT : RANGE)[track];
  return {
    base: columnsFor(count, range.base),
    md: columnsFor(count, range.md),
    lg: columnsFor(count, range.lg),
    xl: columnsFor(count, range.xl),
  };
}

const FILL_CLASS: Record<Breakpoint, string | undefined> = {
  base: styles.fillBase,
  md: styles.fillMd,
  lg: styles.fillLg,
  xl: styles.fillXl,
};

/**
 * The breakpoints at which the last row holds ONE cell, which then spans the row: nine on a phone
 * (4 × 2 + 1). One alone in a row of empty places reads as a hole; one cell the width of the grid
 * reads as its closing row. Two or more left over keep their own widths — `columnsFor` already
 * chose the count that leaves the fewest.
 */
function lastFills(count: number, columns: Record<Breakpoint, number>) {
  return (Object.keys(columns) as Breakpoint[]).filter(
    (bp) => columns[bp] > 1 && count % columns[bp] === 1,
  );
}

const PAIR_CLASS: Record<Breakpoint, string | undefined> = {
  base: styles.pairBase,
  md: styles.pairMd,
  lg: styles.pairLg,
  xl: styles.pairXl,
};

/**
 * The breakpoints at which the last row holds TWO cells in a row of four, which then span two
 * tracks each (home round 3, 11 Oct 2026: ten marks — the in-house set and Eden AI — are 4 + 4 + 2).
 * Two cells hanging at the start of a four-track row read as a ragged edge; two half-row cells
 * close the rectangle, the way `lastFills` closes it for one.
 */
function lastPairs(count: number, columns: Record<Breakpoint, number>) {
  return (Object.keys(columns) as Breakpoint[]).filter(
    (bp) => columns[bp] === 4 && count % 4 === 2,
  );
}

export type LogoGridProps = {
  /** The marks, in reading order. Which client leads is a content decision. */
  marks: readonly LogoGridMark[];
  /**
   * The context line: the band's heading, demoted to eyebrow size (7 Oct review: a full title
   * here was "a hero instrument", the IA reversed and the logos not leading). One short line —
   * "Product teams we have shipped with". Set in the eyebrow role, so it is uppercase in
   * presentation only; pass it in sentence case.
   */
  context?: string;
  /**
   * A short heading under the context line — "Nine teams, one way of working". Set at the h4 role
   * (28) on the band's h2 element, never at h2 scale (9 Oct review: a full h2 beside the grid
   * brought the hero instrument back). With a heading, the context line is a `p` above it.
   */
  heading?: string;
  /** The context line's element when there is no heading. Default `h2`: it names the band. */
  contextAs?: 'h2' | 'p';
  /** The id on the band's name — the heading if there is one, else the context line — for the
      Section's aria-labelledby. */
  headingId?: string;
  /**
   * A lead above the context line — a sourced RatingBadge, the doodle.com move. It leads the
   * band; the grid is still the body. Compose the badge at the call site and pass it here.
   */
  badge?: ReactNode;
  /** The head's actions, under it — a CtaRow with `rule={false}`. Composed at the call site. */
  action?: ReactNode;
  /**
   * `stacked` (default): the head over the grid. `beside`: from 1024 the head in a narrow leading
   * track and the grid in the trailing one, the head CENTRED on the grid's height so the two read
   * as one composition (9 Oct review: top-aligned, a 3 × 3 grid left ~200 of dead paper under a
   * short head). Below 1024 it stacks.
   */
  arrangement?: 'stacked' | 'beside';
  /** The head's alignment in `stacked`. The grid itself always spans its track. Default `start`. */
  align?: 'start' | 'center';
  /** The track the grid sits in when it is not this unit's own `beside`. Default `full`. */
  track?: LogoGridTrack;
  /**
   * `closed` (default, 9 Oct review): every cell a whole box, the outer edge drawn — the owner's
   * "each logo in its own boxed cell". `open` rules only BETWEEN cells, no frame round the set:
   * the alternative, for a band that wants the grid to sit in the paper rather than on it.
   */
  edges?: 'open' | 'closed';
  /**
   * `default`: the approved wall, 128-tall cells, at most four across, marks at ClientMark `md`.
   * `compact` (owner, 4 Nov 2026, homepage pass): shorter cells and marks a step smaller (ClientMark
   * `sm`), up to six across, the air in each cell kept in proportion so the wall still reads open.
   * For a wall that sits under a hero and must not take a fold of its own.
   */
  density?: LogoGridDensity;
  className?: string;
};

/**
 * The beside tracks: a quarter for the head at 1024 is ~224 (a 28 heading in three short lines),
 * which leaves the grid ~672 — three ~224 cells, LatitudePay's 201 inside them. From 1440 the
 * head takes 1 : 2, 392 beside 784.
 */
const BESIDE_COLUMNS = { lg: [1, 3], xl: [1, 2] };

/**
 * LogoGrid — client marks in equal hairline cells (band H; r7-logos, owner 8–9 Oct 2026).
 *
 * A composition of primitives with one job of its own: the cell. Layout owns the columns, chosen
 * from the count so the rows are always full (`columnsFor`); Cluster centres each mark in its
 * cell; ClientMark draws the mark, one ink, equal area of ink by its density. What this pattern
 * adds is the hairline box each mark sits in — the named exception to "no boxes", because a logo
 * cell is not a card — and the demoted head: an optional rating badge over an eyebrow-size
 * context line, and a short h4-scale heading and its action.
 *
 * It sets no outer spacing. The head-to-grid seam is `stack` (and `column` beside); inside the
 * head, `block`, then `stack` to the action.
 */
export function LogoGrid({
  marks,
  context,
  heading,
  contextAs,
  headingId,
  badge,
  action,
  arrangement = 'stacked',
  align = 'start',
  track = 'full',
  edges = 'closed',
  density = 'default',
  className,
}: LogoGridProps) {
  const compact = density === 'compact';
  const beside = arrangement === 'beside';
  const centred = !beside && align === 'center';
  const hasHead = Boolean(badge || context || heading || action);

  const columns = logoGridColumns(marks.length, beside ? 'body' : track, density);
  const fills = lastFills(marks.length, columns);
  const pairs = lastPairs(marks.length, columns);
  const Context = heading ? 'p' : (contextAs ?? 'h2');

  const cells = (
    <Layout as="ul" columns={columns} className={styles.open}>
      {marks.map((mark, i) => (
        <Cluster
          as="li"
          key={mark.name}
          justify="center"
          align="center"
          className={cx(
            styles.cell,
            compact && styles.compact,
            ...(i === marks.length - 1 ? fills.map((bp) => FILL_CLASS[bp]) : []),
            ...(i >= marks.length - 2 ? pairs.map((bp) => PAIR_CLASS[bp]) : []),
          )}
        >
          {!hasArt(mark) ? (
            <span className={styles.wordmark}>{mark.name}</span>
          ) : (
            <ClientMark {...mark} size={compact ? 'sm' : 'md'} />
          )}
        </Cluster>
      ))}
    </Layout>
  );
  /* `closed` frames the open grid: the frame draws the outer edge whole, with the photograph's
     radius (owner, 9 Oct 2026), and clips the cells to it. The inner rules stay the open grid's. */
  const grid = edges === 'open' ? cells : <div className={styles.closed}>{cells}</div>;

  if (!hasHead) return className ? <div className={className}>{grid}</div> : grid;

  const named = (
    <Layout rowGap="block" justifyItems={centred ? 'center' : undefined}>
      {badge}
      {context ? (
        <Context
          id={heading ? undefined : headingId}
          className={cx(styles.context, centred && styles.centred)}
        >
          {context}
        </Context>
      ) : null}
      {heading ? (
        <h2 id={headingId} className={cx(styles.heading, centred && styles.centred)}>
          {heading}
        </h2>
      ) : null}
    </Layout>
  );

  const head = action ? (
    <Layout rowGap="stack" justifyItems={centred ? 'center' : undefined}>
      {named}
      {action}
    </Layout>
  ) : (
    named
  );

  return (
    <Layout
      rowGap="stack"
      colGap={beside ? 'column' : undefined}
      columns={beside ? BESIDE_COLUMNS : undefined}
      align={beside ? 'center' : undefined}
      className={className}
    >
      {head}
      {grid}
    </Layout>
  );
}
