import type { ReactNode } from 'react';

import { Layout, Section, Sketch, type SketchName } from '@/components';

import styles from './OfferParts.module.css';

/** One deliverable: a title, what it means, and its drawing (this pattern renders drawn sets only). */
export type OfferPartsDeliverable = {
  /** "A tested brief". */
  title: string;
  /** Plain text. */
  body?: string;
  /** Or trusted HTML from the content seam (a body that names a service as a link). */
  bodyHtml?: string;
  /** The deliverable drawn. Missing, the empty plate stands in its place and development warns. */
  scene?: SketchName;
};

/**
 * One of the three terms under the deliverables (who does the work, what we need, where we stop). Its
 * visual is always a flat drawing: there is no photograph kind, so one-register-per-section is
 * enforced by the type. A missing scene draws the empty plate and warns in development.
 */
export type OfferPart = {
  title: string;
  body?: string;
  bodyHtml?: string;
  scene?: SketchName;
};

export type OfferPartsProps = {
  id?: string;
  /** The band's h2 ("What you get from our …"). */
  heading: string;
  headingId: string;
  lead?: string;
  /**
   * The first part's title: the authored label over the list ("What you receive"). Empty (the 3 Nov
   * copy drops it), the deliverables take the full width under the heading and the terms stay rows
   * (owner, 3 Nov 2026): an empty label column left a blank quarter beside the set.
   */
  deliverablesTitle: string;
  /** Two to seven; built for five. */
  deliverables: readonly OfferPartsDeliverable[];
  /**
   * Two or three: who does the work, what we need, where our part stops. The audits' 3 Nov 2026 copy
   * has no "What we need", so two is a built count, not a gap.
   */
  parts: readonly OfferPart[];
  /**
   * What the copy sets between the deliverables and the terms — a worked example, the table a
   * deliverable refers to ("one of the five statuses below") — under the deliverables and before
   * the parts, so it stays beside what it illustrates (owner, 2 Nov 2026: audits). A slot.
   */
  example?: ReactNode;
  /** Whatever else the band carries, under the parts. A slot. */
  note?: ReactNode;
  /** Default `paper`. */
  surface?: 'paper' | 'tint';
};

/**
 * Deliverable tracks. From 1024 the deliverables sit in a 3/4 column, so five across only fit at the
 * 1240 cap (xl); below it they read three then two.
 */
const TRACKS: Record<number, { lg: 2 | 3; xl: 2 | 3 | 4 | 5 }> = {
  2: { lg: 2, xl: 2 },
  3: { lg: 3, xl: 3 },
  4: { lg: 2, xl: 4 },
  5: { lg: 3, xl: 5 },
  6: { lg: 3, xl: 3 },
  /* Seven (most expertise pages): 4 + 3 from 1280. From 1024 to 1279 three tracks leave one alone. */
  7: { lg: 3, xl: 4 },
};

const words = (item: { body?: string; bodyHtml?: string }) =>
  item.bodyHtml ? (
    <p className={styles.body} dangerouslySetInnerHTML={{ __html: item.bodyHtml }} />
  ) : item.body ? (
    <p className={styles.body}>{item.body}</p>
  ) : null;

/** A part's row: its title in the label column from 1024, over its content below. */
function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Layout columns={{ base: 1, lg: [1, 3] }} colGap="section" rowGap="block" align="start">
      <h3 className={styles.partTitle}>{title}</h3>
      {children}
    </Layout>
  );
}

/**
 * OfferParts — "What you get" as four rows in a label column (owner, 30 Oct 2026, round 7;
 * decisions/2026-10-30-what-you-get-label-rows).
 *
 * Each row is its part's name in a label column, then its content: row 1 the deliverables as a strip
 * of drawn items, rows 2–4 (who does the work, what we need, where our part stops) a compact 16:9
 * drawing beside the words. Every visual is a flat Sketch, never a photograph (one register per
 * section). Equal standing comes from structure: every row opens on an h3 at one role with the same
 * label-to-content seam. No numbers, no hairlines, no containers: rows are separated by Layout seams
 * alone, and sequence is the reading order.
 */
export function OfferParts({
  id,
  heading,
  headingId,
  lead,
  deliverablesTitle,
  deliverables,
  parts,
  example,
  note,
  surface = 'paper',
}: OfferPartsProps) {
  if (process.env.NODE_ENV !== 'production') {
    if (deliverables.length < 2 || deliverables.length > 7) {
      console.warn(`OfferParts: ${deliverables.length} deliverables; built for two to seven.`);
    }
    if (parts.length < 2 || parts.length > 3) {
      console.warn(`OfferParts: ${parts.length} parts; built for two or three.`);
    }
    for (const part of [...deliverables, ...parts]) {
      if (!part.scene) {
        console.warn(`OfferParts: "${part.title}" has no drawing; the empty plate stands.`);
      }
    }
  }
  const t = TRACKS[deliverables.length] ?? { lg: 3, xl: 3 };
  const labelled = deliverablesTitle.trim().length > 0;
  /* Unlabelled, the item titles are the h3s under the band's h2; labelled, they sit under the row's. */
  const ItemTitle = labelled ? 'h4' : 'h3';
  const set = (
    <Layout
      as="ul"
      columns={{ base: 1, lg: t.lg, xl: t.xl }}
      colGap="gutter"
      rowGap="stack"
      shareRows={2}
    >
      {deliverables.map((item) => (
        <Layout
          as="li"
          key={item.title}
          /* Below 768 the drawing heads its words at the column's full width, as the method figure
             and the case cards do: beside them it shrank to a ~100 thumbnail and "Code worth
             keeping" could not be read (critic, audits run, 4 Nov 2026). */
          columns={{ base: 1, md: [1, 3], lg: 1 }}
          colGap="gutter"
          rowGap="block"
          align="start"
        >
          <Sketch name={item.scene} />
          <Layout rowGap="text">
            <ItemTitle className={styles.itemTitle}>{item.title}</ItemTitle>
            {words(item)}
          </Layout>
        </Layout>
      ))}
    </Layout>
  );

  return (
    <Section id={id} surface={surface} aria-labelledby={headingId} data-band="offer-parts">
      <Layout rowGap="stack">
        {lead ? (
          <Layout rowGap="block">
            <h2 id={headingId} className={styles.heading}>
              {heading}
            </h2>
            <p className={styles.lead}>{lead}</p>
          </Layout>
        ) : (
          <h2 id={headingId} className={styles.heading}>
            {heading}
          </h2>
        )}
        <Layout rowGap="column">
          {labelled ? <Row title={deliverablesTitle}>{set}</Row> : set}
          {example}
          {parts.length > 0 ? (
            <Layout rowGap="stack">
              {parts.map((part) => (
                <Row key={part.title} title={part.title}>
                  <Layout
                    columns={{ base: 1, md: [1, 3] }}
                    colGap="gutter"
                    rowGap="block"
                    align="start"
                  >
                    <Sketch name={part.scene} />
                    {words(part)}
                  </Layout>
                </Row>
              ))}
            </Layout>
          ) : null}
          {note}
        </Layout>
      </Layout>
    </Section>
  );
}
