import type { CSSProperties } from 'react';

import { Cluster, Layout } from '@/components';
import { cx } from '@/lib/cx';

import styles from './AutonomyLadder.module.css';

/** One step: its name, the person's job at that step, one example, and how much the software does. */
export type AutonomyStep = {
  /** The step's name, one word ("Delegated"). */
  title: string;
  /** The person's job at this step, ≤ 4 words ("The person approves"). */
  role: string;
  /** One concrete example, ≤ 9 words. */
  example: string;
  /** The share of the work the software does, 0 to 1. Drawn as the plate's fill; clamped. */
  share: number;
};

/** The record every AI action leaves: a title, term → detail rows, and a caption under the slip. */
export type AutonomyReceipt = {
  title: string;
  /** Three to eight rows; a term is one short word. */
  rows: readonly { term: string; detail: string }[];
  caption?: string;
};

export type AutonomyLadderProps = {
  /** Two to six steps, from least to most the software does. Fewer than two renders nothing. */
  steps: readonly AutonomyStep[];
  /** What the plates' fill measures, set over the steps with its swatch. */
  legend: string;
  /** A labelled sentence under the arrow: how a capability moves up a step. */
  note?: { label: string; body: string };
  /** The receipt beside the ladder from 1024, under it below. */
  receipt?: AutonomyReceipt;
  /** The step titles' element. Default `h3`; `h4` under an h3. */
  stepHeading?: 'h3' | 'h4';
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/**
 * AutonomyLadder — how much the software does on its own, step by step (docs/specs/AutonomyLadder.md).
 *
 * An ordered list of steps, each a plate filled to the share of the work the software does, its name,
 * the person's job and an example; an arrow from 768 that says the steps are climbed; a labelled note;
 * and, when given, the receipt every AI action leaves, as a torn slip beside the ladder from 1024 —
 * a split (two regions of different kind), so the seam is `section`. The plates are aria-hidden: the
 * step's words carry it, and the ladder's order is the list's.
 */
export function AutonomyLadder({
  steps,
  legend,
  note,
  receipt,
  stepHeading = 'h3',
}: AutonomyLadderProps) {
  if (steps.length < 2) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('AutonomyLadder: a ladder needs at least two steps; rendering nothing.');
    }
    return null;
  }
  const H = stepHeading;
  const count = Math.min(steps.length, 6);

  const ladder = (
    <Layout rowGap="block">
      <Cluster nowrap colGap="tight" align="center" className={styles.legend}>
        <span className={styles.swatch} aria-hidden="true" />
        <span>{legend}</span>
      </Cluster>
      <Layout
        as="ol"
        columns={{ base: 2, lg: count }}
        colGap="block"
        rowGap="gutter"
        className={styles.steps}
      >
        {steps.slice(0, 6).map((step) => (
          <li key={step.title}>
            <Layout rowGap="block">
              <div
                className={cx(styles.plate, clamp(step.share) === 0 && styles.empty)}
                aria-hidden="true"
                style={{ '--ladder-share': clamp(step.share) } as CSSProperties}
              >
                <div className={styles.fill} />
              </div>
              <Layout rowGap="tight">
                <H className={styles.title}>{step.title}</H>
                <p className={styles.role}>{step.role}</p>
                <p className={styles.example}>{step.example}</p>
              </Layout>
            </Layout>
          </li>
        ))}
      </Layout>
      {note && (
        <Layout rowGap="text">
          <div className={styles.arrow} aria-hidden="true" />
          <p className={styles.note}>
            <span className={styles.noteLabel}>{note.label}</span> {note.body}
          </p>
        </Layout>
      )}
    </Layout>
  );

  if (!receipt) return ladder;

  return (
    <Layout columns={{ lg: [2, 1] }} colGap="section" rowGap="stack" align="start">
      {ladder}
      <Layout as="figure" rowGap="text">
        <div className={styles.slip}>
          <Layout rowGap="text">
            <p className={styles.slipTitle}>{receipt.title}</p>
            <Layout as="dl" columns={{ base: [1, 3] }} colGap="text" rowGap="none">
              {receipt.rows.map((row) => (
                <div key={row.term} className={styles.row}>
                  <dt className={styles.term}>{row.term}</dt>
                  <dd className={styles.detail}>{row.detail}</dd>
                </div>
              ))}
            </Layout>
          </Layout>
        </div>
        {receipt.caption && (
          <figcaption className={styles.caption}>{receipt.caption}</figcaption>
        )}
      </Layout>
    </Layout>
  );
}
