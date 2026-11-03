import { useId, type ReactNode } from 'react';

import { Layout, Prose } from '@/components';
import { cx } from '@/lib/cx';

import styles from './DataTable.module.css';

/**
 * How one column's cells behave. Column behaviour is PRESENTATION, set by the caller per column —
 * the column COUNT is data and is never a variant.
 *
 *   fluid    wraps and shrinks to share the width, down to --dtab-fluid-size (176). The default
 *            for a data column. Below that floor the table scrolls rather than crushing it.
 *   nowrap   never wraps, so never narrows below its longest line. For short keys and
 *            identifiers — "SC 2.5.8", "v2.4", a code span. A long nowrap cell widens the table:
 *            that is an authoring error the specimen shows, not a case this handles.
 *   hold     wraps, but never narrows below --dtab-hold-size (192). A column that must not be
 *            crushed by a greedy neighbour. The default for the key column.
 *   numeric  end-aligned with tabular figures, and nowrap. Head and cells align together. A data
 *            column only — the key column is a row header, and a number is not a name.
 */
export type DataTableKeyBehaviour = 'fluid' | 'nowrap' | 'hold';
export type DataTableColumnBehaviour = DataTableKeyBehaviour | 'numeric';

/** The first column: its head, over the row headers. */
export type DataTableKeyColumn = {
  heading: string;
  /** Defaults to `hold`. `numeric` is a compile error here, deliberately. */
  behaviour?: DataTableKeyBehaviour;
};

/** One data column. */
export type DataTableColumn = {
  heading: string;
  /** Defaults to `fluid`. */
  behaviour?: DataTableColumnBehaviour;
};

/**
 * A cell that is not text: a mark the caller composes — a meter, a glyph — passed as a node, the way
 * a primitive takes a sibling (CLAUDE.md § Sideways has an idiom). Added 1 Oct 2026 so a table that
 * needs one encoded column can stay a table instead of being redrawn as rows. The node owns its own
 * text alternative; the table only places it.
 */
export type DataTableNodeCell = { node: ReactNode };

export type DataTableRow = {
  /** Plain-text row header — `<th scope="row">`. Always given: it is the row's name for the
   *  warnings, the split's weighing and any reader that wants the words without markup. */
  header: string;
  /**
   * The row header as TRUSTED, seam-sanitised inline HTML (the same contract as `cellsHtml`), for a
   * key that is a link: "which do you need" and router tables name each option as a link to its page
   * (component-map C6, 29 Oct 2026). Rendered in place of `header`, in the key's own voice; `header`
   * must still carry the same words as plain text.
   */
  headerHtml?: string;
  /**
   * One cell per data column, in column order. A string is TRUSTED, seam-sanitised rich text — the
   * same contract as `Prose`'s `html` — and an empty string is an empty cell. A `{ node }` is a
   * composed mark (see DataTableNodeCell).
   */
  cellsHtml: readonly (string | DataTableNodeCell)[];
  /**
   * The row the table recommends: in a comparison of options, the one we suggest (the "Tcules" row
   * of /why-tcules' alternatives; owner, 2 Nov 2026). Set apart by a blue ground, a blue key and a
   * bar down its start edge, so it reads as the answer without a word being added. At most one per
   * table; it never reorders the rows. Default false.
   */
  pick?: boolean;
};

export type DataTableProps = {
  /**
   * `false` draws the table as a RECORD with no header row (page-mapping G4a): a key/value list such
   * as "At a glance", whose first row is a pair rather than a heading. Only the rows are drawn, the
   * key column and at most one value column. `keyColumn.heading` and `columns[].heading` are then
   * unused for display (pass an empty string), so nothing is invented to fill a head that was never
   * authored; name the table with `labelledBy` or `caption`. Default `true`.
   */
  head?: boolean;
  /**
   * The id of a heading that already names this table (page-mapping G4): a corpus table sits under
   * its section's own h2, so a visible caption would print the heading twice. Used for the scroll
   * region and the `<table>` when there is no `caption`; a caption wins. Without either, the region
   * is named by the key column's head, which is " table" when that head is empty.
   */
  labelledBy?: string;
  /** The table's name. Rendered as `<caption>`, so it is also the table's accessible name. */
  caption?: string;
  /** A plain-text lead-in, rendered as a paragraph immediately before the table. */
  summary?: string;
  /**
   * The first column, whose cells name each row (`<th scope="row">`). Absent (4 Nov 2026, the
   * glossary's comparisons): a KEYLESS table, every column a peer under its own head, for a table
   * whose head row IS the things compared ("Style guide · Component library · Design system") and
   * whose rows are sentences across them. Then `cellsHtml` holds every column's cell and a row's
   * `header` is only its plain name for the warnings; no cell is set as a row label.
   */
  keyColumn?: DataTableKeyColumn;
  /** The data columns. One to five is the designed range; the count is data, never a variant. */
  columns: readonly DataTableColumn[];
  /**
   * The column the table recommends or is about, by its index in `columns` (4 Nov 2026): a keyless
   * comparison's column naming the page's own term. The row pick's treatment turned a quarter turn —
   * the blue ground down every cell, the head in blue, a bar across the head's top edge. At most
   * one; it never reorders the columns.
   */
  pickColumn?: number;
  /** Three to twelve is the designed range (eight until 1 Oct 2026). Never sorted, filtered or paginated. */
  rows: readonly DataTableRow[];
  /**
   * Two halves side by side from 1024, ONE table below it (owner, 10 Oct 2026). A long record — six
   * or more facts — keeps its band inside the fold as two boxed halves from 1024 (7 Oct ruling 1),
   * each with the head row, broken where the two halves' likely heights are closest (`splitAt`). Where the layout
   * drops to one column the halves JOIN: the second half's head row is set out of sight (still read
   * by a screen reader) and the seam between the two frames closes, so a phone reads one continuous
   * table instead of the same head printed twice down the column. Until this prop the About record
   * was split by hand in the template, and at 390 it read as two tables stacked.
   *
   * For a record (one value column, or `head={false}`), whose key share is a percentage, so the two
   * halves' columns line up when they join. A comparison table of several columns sizes each half
   * by its own content and would not; it should not be split. Default false.
   */
  split?: boolean;
};

/*
 * Where a split record breaks, so its two halves END NEAR ONE LINE from 1024 rather than holding one
 * count each (home round 1 critic, 10 Oct 2026): About's record split eight and eight, its first half
 * all one-line facts and its second all three- and four-line ones, and the two frames ended ~100
 * apart. Each row is weighed by the lines it is likely to wrap to in a half's tracks — the longer of
 * its key and its value at a half's rough measure, plus one for the cell padding — and the break goes
 * where the halves' weights are closest, never leaving fewer than three rows in a half (the designed
 * range). Reading order is untouched: the first half is still the first rows. An estimate, not a
 * measurement, because the server cannot measure type; it only has to beat a count.
 */
const KEY_CHARS_PER_LINE = 16;
const VALUE_CHARS_PER_LINE = 44;
const MIN_PER_HALF = 3;

const textLength = (cell: string | DataTableNodeCell | undefined) =>
  typeof cell === 'string' ? cell.replace(/<[^>]*>/g, '').trim().length : 1;

const rowWeight = (row: DataTableRow) =>
  1 +
  Math.max(
    Math.ceil(row.header.length / KEY_CHARS_PER_LINE),
    ...row.cellsHtml.map((cell) => Math.ceil(textLength(cell) / VALUE_CHARS_PER_LINE)),
    1,
  );

function splitAt(rows: readonly DataTableRow[]): number {
  const half = Math.ceil(rows.length / 2);
  if (rows.length < MIN_PER_HALF * 2) return half;
  const weights = rows.map(rowWeight);
  const total = weights.reduce((sum, w) => sum + w, 0);
  let best = half;
  let bestGap = Infinity;
  let running = 0;
  for (let at = 1; at < rows.length; at += 1) {
    running += weights[at - 1] ?? 0;
    if (at < MIN_PER_HALF || rows.length - at < MIN_PER_HALF) continue;
    const gap = Math.abs(total - 2 * running);
    if (gap < bestGap) {
      best = at;
      bestGap = gap;
    }
  }
  return best;
}

const BEHAVIOUR_CLASS: Record<DataTableColumnBehaviour, string | undefined> = {
  fluid: undefined,
  nowrap: styles.nowrap,
  hold: styles.hold,
  numeric: styles.numeric,
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`DataTable: ${message}`);
}

/**
 * DataTable — the site's one table, built to docs/specs/DataTable.md (brief 10).
 *
 * A real `<table>`: an optional `<caption>`, a head row of `<th scope="col">`, and a body whose
 * first cell in every row is `<th scope="row">`. It is what a CMS `table` BLOCK becomes; Prose
 * keeps its own table rules for the long-form bodies that legitimately carry a markdown table.
 *
 * ── Why it is a pattern ─────────────────────────────────────────────────────────────────────
 * It consumes a content shape (columns × rows of rich text), and it composes two primitives —
 * `Layout` for the summary, caption and frame seams, `Prose` for every cell's
 * trusted rich text — which a primitive may not import.
 *
 * ── One reading order, a boxed frame ───────────────────────────────────────────────────────
 * TABLES ARE BOXED (owner, 7 Oct 2026). The frame is the table's, not a variant: tabular content
 * always renders in it. A `frame="ruled"` variant (no box, a strong head rule, hairline rows) lived
 * here from 6 Oct to 7 Oct 2026 and was withdrawn — the ruled tables read dense and compact, rows
 * running together with nothing to hold them, and a table without its frame stops reading as one.
 * It is a table at every width. The frame — outer border, head fill, body ground, and a hairline
 * between every row and every column — is what makes it readable as a structure, so a narrow track does not
 * restructure it: when its columns' floors add up to more than the track, the frame scrolls
 * sideways and the table inside keeps its shape. The body is never re-laid out as a stack.
 *
 * When it scrolls, a fade to the body ground marks each edge that has more beyond it, driven by the
 * frame's own scroll position (a scroll-driven animation, so no client JS). A browser without
 * scroll timelines shows no fade and loses nothing but the hint; the clipped edge still shows.
 *
 * The frame is a focusable, named region (`tabIndex={0}`, `role="region"`, labelled by the
 * caption), so a keyboard user can scroll it with the arrow keys — a scroll container nobody can
 * focus is a WCAG 2.1.1 failure. It is focusable at every width, including where nothing
 * overflows: knowing whether it overflows needs client JS, and one extra tab stop is the cheaper
 * error than a keyboard trap.
 *
 * ── What it tolerates ───────────────────────────────────────────────────────────────────────
 * It never drops content and never throws. Out-of-contract input renders and warns in
 * development: no data columns (the key column alone), more than five data columns, fewer than
 * three or more than eight rows, a blank row header, a row whose cell count disagrees with the
 * columns (padded with empty cells, or truncated — a cell with no column head cannot be read in
 * the stacked order). Zero rows renders nothing.
 */
export function DataTable({
  head = true,
  caption,
  labelledBy,
  summary,
  keyColumn,
  columns,
  rows,
  split = false,
  pickColumn,
}: DataTableProps) {
  const captionId = useId();

  if (pickColumn !== undefined && !columns[pickColumn]) {
    warn(`pickColumn ${pickColumn} names no column; nothing is picked.`);
  }

  if (rows.length === 0) {
    warn('received no rows; rendering nothing.');
    return null;
  }

  if (columns.length === 0) {
    warn(
      'received no data columns — a key column alone is a list, not a table. Rendering the row headers.',
    );
  } else if (columns.length > 5) {
    warn(`received ${columns.length} data columns; the designed maximum is five.`);
  }

  /* A split table's range is per half: sixteen facts are two halves of eight. */
  const perFrame = split ? Math.ceil(rows.length / 2) : rows.length;
  if (perFrame < 3 || perFrame > 12) {
    warn(`received ${perFrame} rows per frame; the designed range is three to twelve.`);
  }

  if (split && columns.length > 1) {
    warn(
      '`split` is for a record (one value column); a comparison table would not line up when its halves join.',
    );
  }

  if (!head && columns.length > 1) {
    warn('a head-less record takes at most one value column; the others read without a head.');
  }

  const keyBehaviour = keyColumn?.behaviour ?? 'hold';
  const picked = (index: number) => index === pickColumn;
  const breakAt = split ? splitAt(rows) : rows.length;

  /* One boxed frame over `part` of the rows; `inSplit` marks both halves of a split and `joins` the
     second. The shell holds the frame and draws the scroll fades over its clipped edges. It does
     not scroll itself, which is what keeps the fades pinned while the table moves beneath them. */
  const renderFrame = (part: readonly DataTableRow[], joins: boolean, inSplit: boolean) => (
    <div className={cx(styles.shell, inSplit && styles.split, joins && styles.joins)}>
      <div
        className={styles.frame}
        role="region"
        tabIndex={0}
        // Without a caption the region still needs a name to be announced by; the key column's
        // head is the nearest thing the table has to one.
        {...(caption
          ? { 'aria-labelledby': captionId }
          : labelledBy
            ? { 'aria-labelledby': labelledBy }
            : { 'aria-label': `${keyColumn?.heading ?? columns[0]?.heading ?? ''} table` })}
      >
        <table
          /* A record is read down its rows, a key and ONE value: head-less, or with a head row
           over a single value column ("Fact · Current public record", About `company-record`,
           critic C3.4). Either way there is no second column to scroll to, so it sizes the
           pair to the track instead of scrolling. Two or more value columns are compared
           across a row and keep the floors that make them scroll (7 Oct ruling 6). */
          className={cx(styles.table, (!head || columns.length === 1) && styles.record)}
          {...(caption
            ? { 'aria-labelledby': captionId }
            : labelledBy
              ? { 'aria-labelledby': labelledBy }
              : {})}
        >
          {head ? (
            <thead className={joins ? styles.joinHead : undefined}>
              <tr>
                {keyColumn ? (
                  <th scope="col" className={cx(styles.colHead, BEHAVIOUR_CLASS[keyBehaviour])}>
                    {keyColumn.heading}
                  </th>
                ) : null}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className={cx(
                      styles.colHead,
                      BEHAVIOUR_CLASS[column.behaviour ?? 'fluid'],
                      picked(index) && styles.pickHead,
                    )}
                  >
                    {column.heading}
                  </th>
                ))}
              </tr>
            </thead>
          ) : null}
          <tbody>
            {part.map((row, rowIndex) => {
              if (!row.header.trim()) warn(`row ${rowIndex + 1} has a blank row header.`);
              if (row.cellsHtml.length !== columns.length) {
                warn(
                  `row ${rowIndex + 1} has ${row.cellsHtml.length} cells for ${columns.length} data columns; ${
                    row.cellsHtml.length < columns.length
                      ? 'padding with empty cells'
                      : 'truncating'
                  }.`,
                );
              }

              return (
                <tr key={rowIndex} className={cx(styles.row, row.pick && styles.pick)}>
                  {keyColumn ? (
                    <th scope="row" className={cx(styles.key, BEHAVIOUR_CLASS[keyBehaviour])}>
                      {row.headerHtml ? (
                        <Prose as="span" html={row.headerHtml} className={styles.keyRich} />
                      ) : (
                        <span className={styles.keyText}>{row.header}</span>
                      )}
                    </th>
                  ) : null}
                  {columns.map((column, index) => {
                    const cell = row.cellsHtml[index] ?? '';
                    const html = typeof cell === 'string' ? cell : '';
                    return (
                      <td
                        key={index}
                        className={cx(
                          styles.cell,
                          typeof cell !== 'string' && styles.nodeCell,
                          BEHAVIOUR_CLASS[column.behaviour ?? 'fluid'],
                          picked(index) && styles.pickCell,
                        )}
                      >
                        {typeof cell !== 'string' ? (
                          cell.node
                        ) : html.trim() ? (
                          <Prose html={html} className={styles.value} />
                        ) : (
                          // An empty cell is still a cell: the screen reader announces it blank on
                          // its own, and the dash is for the eye, so a gap never reads as a bug.
                          <span className={styles.empty} aria-hidden="true">
                            —
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Layout rowGap="block" className={styles.root}>
      {summary ? (
        <Prose>
          <p>{summary}</p>
        </Prose>
      ) : null}
      {/* The caption is the table's name, set above the frame rather than as a <caption> inside it:
          a <caption> would sit inside the border and scroll away with the columns. It stays the
          accessible name through aria-labelledby, and sits a --gap-text beat from the frame — it
          belongs to the table, so it is closer to it than the summary is. */}
      <Layout rowGap="text">
        {caption ? (
          <p id={captionId} className={styles.caption}>
            {caption}
          </p>
        ) : null}
        {split && rows.length > 1 ? (
          /* The halves: side by side from 1024, a `gutter` apart, and ONE table below it — no row
             gap, and the second frame's top edge and head row give way (DataTable.module.css). */
          <Layout columns={{ lg: 2 }} colGap="gutter" rowGap="none" align="start">
            {renderFrame(rows.slice(0, breakAt), false, true)}
            {renderFrame(rows.slice(breakAt), true, true)}
          </Layout>
        ) : (
          renderFrame(rows, false, false)
        )}
      </Layout>
    </Layout>
  );
}
