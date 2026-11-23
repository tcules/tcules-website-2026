import type { ReactNode } from 'react';

import { Layout, type SketchName } from '@/components';
import { cx } from '@/lib/cx';

/* Bound as `Row`: the set's items are ListCard rows (see Steps). */
import { ListCard as Row, type ListCardTitleElement } from './ListCard';
import styles from './ListCard.module.css';

/** One stage of a product: its name, its words, and the service that serves it. */
export type Stage = {
  title: string;
  /** The words as trusted inline HTML, one entry per paragraph (ListCard `bodyHtml`). */
  bodyHtml: readonly string[];
  href: string;
  /** The service's name as the action label, without an arrow: the link Button draws its own. */
  ctaLabel: string;
  /** The stage's drawing. Absent: the empty plate, the placeholder until it is drawn. */
  scene?: SketchName;
};

export type StagesProps = {
  stages: readonly Stage[];
  /** The stage titles' element. Default `h3`. */
  titleAs?: ListCardTitleElement;
  /**
   * The set's last step, composed by the caller: the first-step strip (`CtaRow frame="strip"`). A
   * ReactNode because a pattern never imports a pattern; the set only places it. From 768 it stands
   * a `stack` under the ladder; below 768 it is the rail's end, on the filled dot.
   */
  end?: ReactNode;
};

/**
 * Stages — the "Design for every stage of a product" set (owner, 18 Nov 2026): stage rows (`marker:
 * stage`, `arrangement="stacked"`, `actionAt="end"`) and the strip that closes them. A SET MODE of
 * ListCard, in ListCard's folder like Steps and ReadDown, because the set is ListCard's rows and the
 * one thing the rows cannot do alone is the line BETWEEN them.
 *
 * From 768 it is the ruled ladder the bands already drew (the quieter rules, 18 Nov 2026) with the
 * strip under it. Below 768 it is Jatin's phone board: a vertical rail at the column's start, an open
 * ring at each stage, each stage a full-width drawing card over its title, words and link, and the
 * strip the rail's last step on a filled dot. The arrangement changes at 768; the rows are the same
 * rows, so nothing is rendered twice.
 */
export function Stages({ stages, titleAs = 'h3', end }: StagesProps) {
  const hasEnd = end !== undefined && end !== null && end !== false;
  return (
    <Layout rowGap="none" className={styles.stagesSet}>
      <Layout as="ul" rowGap="none" className={cx(styles.stages, !hasEnd && styles.stagesOpen)}>
        {stages.map((stage) => (
          <Row
            key={stage.title}
            titleAs={titleAs}
            title={stage.title}
            bodyHtml={stage.bodyHtml}
            href={stage.href}
            ctaLabel={stage.ctaLabel}
            arrangement="stacked"
            marker={{ type: 'stage', scene: stage.scene }}
            actionAt="end"
          />
        ))}
      </Layout>
      {hasEnd ? <div className={styles.stagesEnd}>{end}</div> : null}
    </Layout>
  );
}
