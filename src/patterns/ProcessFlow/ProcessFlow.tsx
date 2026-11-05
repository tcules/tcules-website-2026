import { useId } from 'react';

import { Cluster, Icon, Layout, Tag } from '@/components';

import { cx } from '@/lib/cx';

import styles from './ProcessFlow.module.css';

export type ProcessFlowStage = {
  /** The stage's name — a verb or a short noun: "Assess", "Build", "Operate". */
  label: string;
  /** What the stage holds or produces. Plain text, one line each. At least one. */
  items: readonly string[];
};

export type ProcessFlowLane = {
  /** Who holds it, said plainly: "Product teams keep". */
  label: string;
  /** What they hold, the whole way through. Plain text, one line each. At least one. */
  items: readonly string[];
};

export type ProcessFlowStageHeading = 'h3' | 'h4';

export type ProcessFlowProps = {
  /** Two to five stages, in order. The order IS the content: it renders as an <ol>. */
  stages: readonly ProcessFlowStage[];
  /** Who carries the stages, said once over the flow ("Tcules"). Absent renders nothing. */
  actor?: string;
  /**
   * What someone ELSE holds for the whole of the flow — not a further stage. Drawn beneath every
   * stage, as the ground they all run on. Absent renders nothing.
   */
  throughout?: ProcessFlowLane;
  /** The element for each stage name. Heading semantics only; the visual role does not change. */
  stageHeading?: ProcessFlowStageHeading;
  /**
   * Default `true`: each stage opens on a hairline and each item closes on one. `false` (owner,
   * 4 Nov 2026, home's "How our designers use AI": "ruled cards are a no no"): no rules at all, the
   * stages parted by the gutter and the arrows alone, each stage's one line at the body size, for a
   * flow of a few one-line stages where the rules made a row of boxes.
   */
  ruled?: boolean;
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`ProcessFlow: ${message}`);
}

function filled(items: readonly string[]): string[] {
  return items.filter((item) => item.trim().length > 0);
}

/**
 * ProcessFlow — work that moves through stages, each stage holding its own items, built to
 * docs/specs/ProcessFlow.md (1 Oct 2026).
 *
 * NOT STEPS. A step list (ListCard rows in an <ol>) is one action per row, read top to bottom. A
 * process is a few STAGES the work passes through, each with several things in it, and what the
 * reader needs is the direction: this, then this, then this. So the stages sit side by side from
 * lg, each opening on the flow's thick rule, and an arrow at the end of each stage's head points
 * at the next. Below lg the stages stack and the arrows turn to point down.
 *
 * THE LANE. Some flows have a party that is not a stage: what the client keeps while the work
 * moves. Drawing it as a fourth column made it read as a fourth step; it is drawn instead beneath
 * every stage as a span line ticked at both ends — a duration — labelled once.
 *
 * Layout owns every arrangement: the stage columns, each stage's head-to-items stack, the item
 * rows, the lane. The module owns rules, grounds, type and ink, and the one rotation of the arrow.
 */
export function ProcessFlow({
  stages,
  actor,
  throughout,
  stageHeading = 'h3',
  ruled = true,
}: ProcessFlowProps) {
  const laneLabelId = useId();
  const valid = stages
    .map((stage) => ({ label: stage.label.trim(), items: filled(stage.items) }))
    .filter((stage, index) => {
      if (stage.label && stage.items.length > 0) return true;
      warn(`stage ${index + 1} needs a label and at least one item; omitting it.`);
      return false;
    });

  if (valid.length < 2) {
    warn('fewer than two valid stages: a flow needs somewhere to go. Rendering nothing.');
    return null;
  }
  if (valid.length > 5) {
    warn(`received ${valid.length} stages; the designed maximum is five.`);
  }

  const lane =
    throughout && throughout.label.trim() && filled(throughout.items).length > 0
      ? { label: throughout.label.trim(), items: filled(throughout.items) }
      : undefined;
  if (throughout && !lane) warn('throughout needs a label and at least one item; omitting it.');

  const Heading = stageHeading;
  const last = valid.length - 1;

  return (
    /* Two seams, two steps: the actor labels the stages (block), and the lane is a separate block
       after them (stack) — nested, so neither has to serve both. */
    <Layout rowGap="stack" className={styles.root}>
      <Layout rowGap="block">
        {actor?.trim() ? <p className={styles.actor}>{actor}</p> : null}
        <Layout
          as="ol"
          columns={{ base: 1, lg: Math.min(valid.length, 5) }}
          colGap="gutter"
          rowGap="stack"
        >
          {valid.map((stage, index) => (
            <li
              key={`${index}-${stage.label}`}
              className={cx(styles.stage, !ruled && styles.open)}
            >
              <Layout rowGap="block">
                <Cluster nowrap justify="between" align="center" colGap="text">
                  <Cluster nowrap align="baseline" colGap="text">
                    <span className={styles.number} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Heading className={styles.label}>{stage.label}</Heading>
                  </Cluster>
                  {index < last ? (
                    <span className={styles.arrow} aria-hidden="true">
                      <Icon name="arrow-right" size="lg" />
                    </span>
                  ) : null}
                </Cluster>
                <Layout as="ul" rowGap="none">
                  {stage.items.map((item, itemIndex) => (
                    <li
                      key={`${itemIndex}-${item}`}
                      className={cx(styles.item, !ruled && styles.openItem)}
                    >
                      {item}
                    </li>
                  ))}
                </Layout>
              </Layout>
            </li>
          ))}
        </Layout>
      </Layout>
      {lane ? (
        /* The lane is a DURATION, so it is drawn as one: a span line the full width of the flow,
           ticked at both ends — "from the first stage to the last" — with its label and what is held
           beneath it, the items as Tags because they are things held, not rows to read in order. */
        <div className={styles.lane}>
          <Layout rowGap="text">
            <p className={styles.laneLabel} id={laneLabelId}>
              {lane.label}
            </p>
            <Cluster as="ul" aria-labelledby={laneLabelId} colGap="tight" rowGap="tight">
              {lane.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item}`}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </Cluster>
          </Layout>
        </div>
      ) : null}
    </Layout>
  );
}
