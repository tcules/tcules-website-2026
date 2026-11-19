import type { CSSProperties, ElementType, ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './Cluster.module.css';

/**
 * The gap scale, capped at `stack` (48). A wrapping row has no use for a 64px column gutter or a
 * 96px section beat — the ceiling is the only place Cluster and Layout differ, and both read the
 * same --gap-* usage tokens. The upper two steps are for rows of large, self-contained items: a
 * strip of client marks is set at `stack`, where 24 read as one crowded word.
 *
 *   inline   4   inside a key and its value
 *   tight    8   icon to label, chip padding, a stat and its unit
 *   text    16   items in a metadata row
 *   block   24   a button group set apart from its neighbours
 *   gutter  32   cards in a wrapping set
 *   stack   48   marks in a logo strip
 */
type ClusterGap = 'inline' | 'tight' | 'text' | 'block' | 'gutter' | 'stack';
type ClusterAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
type ClusterJustify = 'start' | 'center' | 'end' | 'between';

export type ClusterProps = {
  /** Element to render (default "div"; use "ul", "nav", etc.). */
  as?: ElementType;
  /**
   * Block-axis seam — the distance between WRAPPED LINES. NO default, so an axis nobody sets
   * renders 0: a silent 12 looks plausible and hides the omission, a collapsed seam is wrong on
   * sight. A `nowrap` cluster has no second line and leaves this off.
   */
  rowGap?: ClusterGap;
  /** Inline-axis seam — the distance between items ON a line. Same ramp, same no-default rule. */
  colGap?: ClusterGap;
  /** Cross-axis (vertical) alignment. Default "center". */
  align?: ClusterAlign;
  /** Main-axis (horizontal) distribution. Default "start". */
  justify?: ClusterJustify | { base?: ClusterJustify; lg?: ClusterJustify };
  /** Keep items on one line (default wraps). */
  nowrap?: boolean;
  /**
   * Below 768 the items stack, one per line and `rowGap` apart, from the inline start (or centred,
   * with `justify="center"`); from 768 up the row wraps as usual. For a group whose phone shape must
   * not depend on how long its labels are: a hero's two actions stack on every phone rather than
   * sitting side by side on one page and stacking on the next (cmp-hero, 6 Oct 2026).
   */
  stackUntil?: 'md';
  /**
   * Below 768 the items keep to ONE line and the row scrolls sideways instead of wrapping; from 768
   * up it wraps as usual. For a row of labels that would otherwise stack two or three lines deep on
   * a phone ahead of the content (an article's taxonomy tags, 18 Nov 2026). `rowGap` then has no
   * second line to separate below 768. The scrollbar is hidden, as Layout's scroll row hides its
   * own: the cut-off last item at the column's edge is the affordance.
   */
  scrollUntil?: 'md';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
};

/**
 * Cluster — the inline-flow layout primitive (the horizontal counterpart to Layout). A wrapping
 * flex row that owns the gaps between its children: button groups, tag/chip rows,
 * icon-beside-label, dot-separated metadata. Wraps by default. Children never set their own
 * outer spacing; the Cluster owns the gaps.
 *
 * Because it wraps, it has TWO seams — between items on a line, and between the lines
 * themselves — so they are set separately, and neither has a default.
 */
export function Cluster({
  as: Tag = 'div',
  rowGap,
  colGap,
  align = 'center',
  justify = 'start',
  nowrap = false,
  stackUntil,
  scrollUntil,
  className,
  style,
  children,
  id,
}: ClusterProps) {
  return (
    <Tag
      id={id}
      style={style}
      className={cx(
        styles.cluster,
        rowGap && styles[`rowgap-${rowGap}`],
        colGap && styles[`colgap-${colGap}`],
        styles[`align-${align}`],
        ...(typeof justify === 'string'
          ? [styles[`justify-${justify}`]]
          : [
              styles[`justify-${justify.base ?? 'start'}`],
              justify.lg && styles[`lg-justify-${justify.lg}`],
            ]),
        nowrap && styles.nowrap,
        stackUntil === 'md' && styles.stackUntilMd,
        scrollUntil === 'md' && styles.scrollUntilMd,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
