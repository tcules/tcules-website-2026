import { cx } from '@/lib/cx';

import styles from './AreaMark.module.css';

/**
 * The call on one area of a product (the MVP board's "Your prototype is the brief we build from"):
 *   keep     what users already rely on       a solid edge in the accent
 *   fix      what paying customers would break a dotted edge in the accent
 *   rebuild  only what can't carry the next stage a dashed edge in the quiet grey
 * The three differ by line style AND ink, so they read apart without colour.
 */
export type AreaVerdict = 'keep' | 'fix' | 'rebuild';

export type AreaMarkProps = {
  verdict: AreaVerdict;
  /**
   * The verdict's word, as authored ("Keep"): the legend form, a mono label after the swatch,
   * uppercase in presentation only. Absent: the swatch alone, beside an item whose words already say
   * the verdict, so it is decorative (aria-hidden).
   */
  label?: string;
};

const VERDICT_CLASS: Record<AreaVerdict, string | undefined> = {
  keep: styles.keep,
  fix: styles.fix,
  rebuild: styles.rebuild,
};

/**
 * AreaMark — a legend swatch for keep / fix / rebuild (17 Nov 2026), built to docs/specs/AreaMark.md.
 *
 * A mark, so a tier-1 primitive: it takes no content shape and composes nothing. The same swatch
 * draws the edge a drawing puts round each area, so a legend and the drawing it explains share one
 * key. The swatch is always aria-hidden; the label, when there is one, is the text a reader gets.
 */
export function AreaMark({ verdict, label }: AreaMarkProps) {
  const word = label?.trim();
  return (
    <span className={cx(styles.mark, VERDICT_CLASS[verdict])}>
      <span className={styles.swatch} aria-hidden="true" />
      {word ? <span className={styles.label}>{word}</span> : null}
    </span>
  );
}
