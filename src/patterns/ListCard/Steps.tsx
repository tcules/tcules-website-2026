import { Layout } from '@/components';
import { cx } from '@/lib/cx';

/* Bound as `Row`: the set's items are ListCard rows. (Also keeps classes:check from reading the
   stylesheet's path below as a member access on the component.) */
import { ListCard as Row, type ListCardTitleElement } from './ListCard';
import styles from './ListCard.module.css';

/** One step of a method: an action, and one sentence on what it produces. */
export type Step = {
  title: string;
  /**
   * One sentence, set UNDER the title at the lead measure (56ch, ~11 words a line). At four rows or
   * fewer it may run to two lines (≤ 20 words); at five it must hold one line (≤ 10 words — the cap
   * is narrower than the beside body track at 1024, so it holds there too), or the ladder reads as
   * a wall (§ 3.6).
   */
  body?: string;
  /** The body as trusted inline HTML, one entry per paragraph (ListCard `bodyHtml`). Exclusive with `body`. */
  bodyHtml?: readonly string[];
};

export type StepsProps = {
  /** Two to five steps, in order. More than five warns: a method past five is two methods. */
  steps: readonly Step[];
  /** The step titles' element. Default `h3`; `h4` when the set sits under an h3. */
  titleAs?: ListCardTitleElement;
  /**
   * `track` (default): the rules run the whole track, the titles at the title measure and the bodies
   * at the lead measure (the composed bands). `reading`: the set is a block of an article's reading
   * column, so it takes the column's one measure (--measure-body) whole: titles and bodies run to it
   * and the rules end where the text can (4 Nov 2026, the tool pages: a title broke at 32ch and every
   * rule ran on past a half-empty row).
   */
  measure?: 'track' | 'reading';
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`Steps: ${message}`);
}

/**
 * Steps — the approved F body (visual-direction § 3.6): numbered ListCard rows in an `<ol>`, read
 * top to bottom. A SET MODE of ListCard, in ListCard's own folder, because the set is ListCard's
 * rows and nothing else — a `Steps` pattern beside it would be a pattern importing a pattern.
 * Promoted from the two private copies (the kit specimen and ServicePage's Blocks) in the
 * cmp-process-stats fix round, 6 Oct 2026, so the rules about a method live here once:
 *
 *   AN EDITORIAL ROW, NOT A SPEC TABLE (final fix round). Each row is the blue index beside an h4
 *   title (`md`), the body set UNDER the title — the reference process list (ref-meridian-04: a
 *   28px serif title over its body, 24 row padding). The split form it replaced put an h5 title in
 *   a 184 track and the body in a third column, so every row read as three equal-weight cells; now
 *   the title is each row's focal point and the body reads as its sentence. Stacking also means a
 *   one-line body never re-wraps when the track narrows at 1024 — the split's ~200 body column did.
 *
 *   ONE TITLE SIZE. Every Steps set takes `md` whatever its count, so a three-step set and a
 *   five-step set on one page read as one system. ListCard's own count rule (`sm` from four rows)
 *   is about a list of PEERS competing with the band's h2; a method's steps are read one after
 *   another, and the band's h2 is two rungs above h4 (43 against 28) in every arrangement F takes.
 *
 *   ON THE CONTENT EDGE. The set paints no ground (its rows never take `href`), so the row's 16
 *   inline inset — which exists only to clear a hover ground — is dropped: the numeral sits on the
 *   edge the band's eyebrow, heading and the rows' own rules already share. The first row also
 *   drops its top inset, so the first title starts on the head's top line rather than 24 under it;
 *   the ladder's rules are BETWEEN steps and after the last, never above the first.
 *
 *   ROW COUNT. Two to five. The body budget per count is the caller's copy, stated on `Step.body`.
 */
export function Steps({ steps, titleAs = 'h3', measure = 'track' }: StepsProps) {
  if (steps.length < 2) warn('fewer than two steps is not a method.');
  if (steps.length > 5) warn(`received ${steps.length} steps; the designed maximum is five.`);

  return (
    <Layout
      as="ol"
      rowGap="none"
      className={cx(styles.steps, measure === 'reading' && styles.stepsReading)}
    >
      {steps.map((step, index) => (
        <Row
          key={`${index}-${step.title}`}
          size="md"
          arrangement="stacked"
          titleAs={titleAs}
          title={step.title}
          body={step.body}
          bodyHtml={step.bodyHtml}
          marker={{ type: 'number', value: index + 1 }}
        />
      ))}
    </Layout>
  );
}
