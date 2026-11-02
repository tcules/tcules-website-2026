import { Layout, Sketch } from '@/components';

import styles from './TracePlates.module.css';

/**
 * What a stage's plate shows: the same screen at that point in its life. Each draws only what the
 * stage's name says.
 *   design   the approved screen: clean frame, the action filled
 *   handoff  the spec: measure marks on the action, and the state nobody specified hatched
 *   code     the screen as code: a gutter and indented lines, the action one lit line
 *   product  the running product: browser chrome, a person pressing the action
 *   signoff  the accepted screen: the action filled, the check lit
 */
export type TraceScene = 'design' | 'handoff' | 'code' | 'product' | 'signoff';

export type TraceStage = {
  /** As authored ("The approved design"). */
  title: string;
  /** What we look at there, as authored. */
  body?: string;
  scene: TraceScene;
};

export type TracePlatesProps = {
  /** Two to six stages, in order. */
  stages: readonly TraceStage[];
  /**
   * `across` (default): the plates in a row, the trace running left to right through each action.
   * `down`: one row per stage, the plate beside its words, the trace running down through each
   * action from plate to plate (owner, 11 Oct 2026: "lets try putting the trace in a vertical
   * layout"). Compact so five stages fit a fold: the plate takes the leading 1 of [1, 3] and rows
   * are a `block` apart.
   */
  orientation?: 'across' | 'down';
};

/** A stage's drawing: a Sketch kit scene (`trace-*`), the screen's action on the trace's line. */
function Scene({ scene }: { scene: TraceScene }) {
  return <Sketch name={`trace-${scene}`} />;
}

/** The trace's end node on the first and last plates: open where it starts, filled where it lands. */
function End({ index, last }: { index: number; last: number }) {
  if (index !== 0 && index !== last) return null;
  return (
    <span
      className={styles.node}
      data-end={index === 0 ? 'first' : 'last'}
      aria-hidden="true"
    />
  );
}

/**
 * TracePlates — one screen followed from the approved design to what users actually see (the
 * design-to-code audit's "What we trace", owner 11 Oct 2026).
 *
 * The Thread it replaces drew five identical hollow nodes on a line: a full row of drawing that
 * said nothing the words did not ("too dense and too much information for the amount of space it
 * takes … there has to be a 1000x better way"). The band's claim is that we FOLLOW ONE THING through
 * every hand-over, so each stage's plate draws that same screen as it is at that stage — clean, then
 * specified with a gap, then as code, then running and loading, then accepted — and one blue trace
 * runs through its action on every plate and across the gutters between them, starting on an open
 * node and landing on a filled one. The trace is drawn in CSS, not in the drawing, so every segment
 * — inside a plate and across a gutter — has the same dash at every plate width. The drawings are what make the stages legible before a word is
 * read; the words under each say what we look at there.
 *
 * Five across from 1024 (the connector drawn across each gutter at the action's height), three from
 * 768, two below. Plates are 16:9, drawn by Sketch in the grammar every flat drawing shares.
 */
export function TracePlates({ stages, orientation = 'across' }: TracePlatesProps) {
  const shown = stages.filter((stage) => stage.title.trim().length > 0);
  const across = Math.min(Math.max(shown.length, 2), 6);
  if (orientation === 'down') {
    return (
      <Layout as="ol" rowGap="block" className={styles.down}>
        {shown.map((stage, index) => (
          <li key={stage.title} className={styles.stage}>
            <Layout
              columns={{ base: 1, md: [1, 3] }}
              colGap="gutter"
              rowGap="block"
              align="center"
            >
              <div className={styles.plate}>
                <Scene scene={stage.scene} />
                <End index={index} last={shown.length - 1} />
              </div>
              <Layout rowGap="tight">
                <h3 className={styles.title}>{stage.title}</h3>
                {stage.body ? <p className={styles.body}>{stage.body}</p> : null}
              </Layout>
            </Layout>
          </li>
        ))}
      </Layout>
    );
  }
  return (
    <Layout
      as="ol"
      columns={{ base: 2, md: Math.min(3, across), lg: across }}
      colGap="gutter"
      rowGap="stack"
      className={styles.across}
    >
      {shown.map((stage, index) => (
        <li key={stage.title} className={styles.stage}>
          <Layout rowGap="block">
            <div className={styles.plate}>
              <Scene scene={stage.scene} />
              <End index={index} last={shown.length - 1} />
            </div>
            <Layout rowGap="tight">
              <h3 className={styles.title}>{stage.title}</h3>
              {stage.body ? <p className={styles.body}>{stage.body}</p> : null}
            </Layout>
          </Layout>
        </li>
      ))}
    </Layout>
  );
}
