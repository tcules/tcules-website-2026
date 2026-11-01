import { useId } from 'react';

import { Button, Icon, Layout, Section, type SectionSurface } from '@/components';
import { cx } from '@/lib/cx';

import styles from './EngagementModel.module.css';

/**
 * One claim of the engagement model. The three are keyed, in order, to the three marks of the
 * drawing — so their ORDER is the contract, not a preference:
 *   0  the unbroken line   one accountable team, from the first question to the shipped build
 *   1  the hatch           the part-time assignment, and the idle time below it that Tcules absorbs
 *   2  the field           the team stretching above the assignment when the work peaks
 */
export type EngagementPoint = {
  /** ≤ 5 words, one line beside its key at 1440. Carries the claim on its own: the compact band renders the title alone. */
  title: string;
  /** One or two sentences, ≤ 22 words (three lines at 1440, which holds the 830 fold). Rendered by the full band only. */
  body: string;
};

export type EngagementAction = { label: string; href: string };

export type EngagementModelArrangement = 'full' | 'compact';

export type EngagementModelProps = {
  /**
   * `full` — the band on its own page or the home page: head row, then the drawing beside the
   * three points with their bodies. `compact` — the band a service page carries: the head and an
   * action beside a shallower drawing, keyed by the three titles alone.
   */
  arrangement?: EngagementModelArrangement;
  eyebrow?: string;
  /** The model in one sentence, ≤ ~68 characters (two lines) — at the h2 role, the band's accessible name. */
  heading: string;
  /** The h2's id: the band's anchor and its label. */
  headingId: string;
  /** One or two sentences under (compact) or beside (full) the heading. Optional. */
  lead?: string;
  points: readonly [EngagementPoint, EngagementPoint, EngagementPoint];
  /** The two ends of the drawing's time axis, start then end: ["First question", "Shipped build"]. */
  axis: readonly [string, string];
  /** One navigational action — a link button, never a solid (r7-buttons). */
  action?: EngagementAction;
  /** Default `paper`. Tint is the only other ground a page gives it; ink and blue are reserved. */
  surface?: SectionSurface;
};

/* ── The drawing ─────────────────────────────────────────────────────────────────────────────
   One curve, drawn once, read three ways. The curve is the work a product needs from week to week;
   the line itself is the one team that carries all of it; the dashed level is the part-time
   assignment. Where the work rises above the level the team stretches (the field); where it falls
   below, the idle time is hatched — the part Tcules absorbs. The shape is illustrative, not data,
   and it is the same in both arrangements: only the depth of the frame changes. */

const WIDTH = 640;
const INSET = 16; // the start and end nodes' clearance from the frame's edges
/** The work, week by week, from 0 (none) to 1 (the frame's top). Illustrative. */
const DEMAND = [0.3, 0.5, 0.74, 0.46, 0.16, 0.26, 0.64, 0.94, 0.34] as const;
/** The part-time assignment, as a share of the frame. */
const LEVEL = 0.42;
const WEEKS = 16;

type Frame = { height: number; top: number; axis: number };

const FRAMES: Record<EngagementModelArrangement, Frame> = {
  full: { height: 360, top: 20, axis: 336 },
  compact: { height: 208, top: 14, axis: 188 },
};

const r = (n: number) => Math.round(n * 10) / 10;

/** A smooth path through every point: Catmull-Rom, converted to cubic Béziers. */
function smooth(points: readonly (readonly [number, number])[]): string {
  let d = `M${r(points[0]![0])},${r(points[0]![1])}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r(c1[0]!)},${r(c1[1]!)} ${r(c2[0]!)},${r(c2[1]!)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

function geometry({ top, axis }: Frame) {
  const span = axis - top;
  const y = (v: number) => top + (1 - v) * span;
  const step = (WIDTH - INSET * 2) / (DEMAND.length - 1);
  const points = DEMAND.map((v, i) => [INSET + i * step, y(v)] as const);
  const curve = smooth(points);
  const level = r(y(LEVEL));
  const first = points[0]!;
  const last = points[points.length - 1]!;
  /* The region between the curve and the level, closed along the level. Clipped above the level it
     is the stretch; clipped below, the absorbed idle time. */
  const region = `${curve} L${r(last[0])},${level} L${r(first[0])},${level} Z`;
  const ticks = Array.from({ length: WEEKS + 1 }, (_, i) =>
    r(INSET + (i * (WIDTH - INSET * 2)) / WEEKS),
  );
  return { curve, region, level, first, last, ticks };
}

function Drawing({
  arrangement,
  uid,
}: {
  arrangement: EngagementModelArrangement;
  uid: string;
}) {
  const frame = FRAMES[arrangement];
  const g = geometry(frame);
  const id = (part: string) => `${uid}-${part}`;
  return (
    <svg
      className={styles.drawing}
      viewBox={`0 0 ${WIDTH} ${frame.height}`}
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <pattern id={id('grid')} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle className={styles.grid} cx="10" cy="10" r="1.1" />
        </pattern>
        <pattern
          id={id('idle')}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line className={styles.hatch} x1="0" y1="0" x2="0" y2="7" />
        </pattern>
        <clipPath id={id('above')}>
          <rect x="0" y="0" width={WIDTH} height={g.level} />
        </clipPath>
        <clipPath id={id('below')}>
          <rect x="0" y={g.level} width={WIDTH} height={frame.height - g.level} />
        </clipPath>
      </defs>

      <rect
        x="0"
        y={frame.top - 10}
        width={WIDTH}
        height={frame.axis - frame.top + 10}
        fill={`url(#${id('grid')})`}
      />

      <path className={styles.stretch} d={g.region} clipPath={`url(#${id('above')})`} />
      <path d={g.region} fill={`url(#${id('idle')})`} clipPath={`url(#${id('below')})`} />

      <line className={styles.level} x1={INSET} y1={g.level} x2={WIDTH - INSET} y2={g.level} />

      <line
        className={styles.rule}
        x1={INSET}
        y1={frame.axis}
        x2={WIDTH - INSET}
        y2={frame.axis}
      />
      {g.ticks.map((x) => (
        <line
          key={x}
          className={styles.rule}
          x1={x}
          y1={frame.axis}
          x2={x}
          y2={frame.axis + 5}
        />
      ))}
      <line
        className={styles.drop}
        x1={g.first[0]}
        y1={g.first[1]}
        x2={g.first[0]}
        y2={frame.axis}
      />
      <line
        className={styles.drop}
        x1={g.last[0]}
        y1={g.last[1]}
        x2={g.last[0]}
        y2={frame.axis}
      />

      <path className={styles.line} d={g.curve} />

      <circle className={styles.nodeOpen} cx={g.first[0]} cy={g.first[1]} r="6" />
      <circle className={styles.nodeHalo} cx={g.last[0]} cy={g.last[1]} r="12" />
      <circle className={styles.nodeShut} cx={g.last[0]} cy={g.last[1]} r="6" />
    </svg>
  );
}

/** The key beside each point: the one mark of the drawing that point names. */
function Swatch({ index, uid }: { index: 0 | 1 | 2; uid: string }) {
  const hatch = `${uid}-key`;
  return (
    <svg className={styles.swatch} viewBox="0 0 48 24" focusable="false" aria-hidden="true">
      {index === 0 ? (
        <>
          <path className={styles.line} d="M6,16 C18,16 22,7 42,8" />
          <circle className={styles.nodeOpen} cx="6" cy="16" r="3.5" />
          <circle className={styles.nodeShut} cx="42" cy="8" r="3.5" />
        </>
      ) : null}
      {index === 1 ? (
        <>
          <defs>
            <pattern
              id={hatch}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line className={styles.hatch} x1="0" y1="0" x2="0" y2="5" />
            </pattern>
          </defs>
          <path d="M2,6 L46,6 L46,14 C34,22 16,22 2,15 Z" fill={`url(#${hatch})`} />
          <line className={styles.level} x1="2" y1="6" x2="46" y2="6" />
        </>
      ) : null}
      {index === 2 ? (
        <>
          <path className={styles.stretch} d="M2,18 C14,18 18,3 30,3 C40,3 42,12 46,18 Z" />
          <line className={styles.level} x1="2" y1="18" x2="46" y2="18" />
        </>
      ) : null}
    </svg>
  );
}

function Axis({ labels }: { labels: readonly [string, string] }) {
  return (
    <Layout columns={{ base: [1, 1] }} colGap="block">
      <span className={styles.axis}>{labels[0]}</span>
      <span className={cx(styles.axis, styles.axisEnd)}>{labels[1]}</span>
    </Layout>
  );
}

function ActionLink({ action }: { action: EngagementAction }) {
  return (
    <div>
      <Button
        as="a"
        href={action.href}
        emphasis="link"
        size="md"
        extendHitArea
        icon={<Icon name="arrow-right" />}
      >
        {action.label}
      </Button>
    </div>
  );
}

/**
 * EngagementModel — the "How we work" USP band (r7-howwework, 9 Oct 2026).
 *
 * The engagement model is an argument about TIME: one team for the whole of it, assigned part-time,
 * absorbing the quiet weeks and stretching for the loud ones. So the band draws time — one chart,
 * not a list — and the three points are the chart's key. Each point is introduced by the mark it
 * names (the line, the hatch, the field). That shape is the only thing that separates one point
 * from the next: no hairline, no icon, no box (owner, 7 Oct: never two separations at once).
 *
 * `full`: the heading beside its lead, then the drawing (7) beside the keyed points (5), centred
 * on each other. `compact`: the head, lead and action (1) beside a shallower drawing keyed by the
 * three titles in a row beneath it (2), for a service page that only needs to name the model and
 * send the reader on.
 *
 * The drawing is aria-hidden: the points carry every claim in text, and the chart restates them.
 * It contributes type, ink and the drawing only. Section paints the band; Layout owns every seam.
 */
export function EngagementModel({
  arrangement = 'full',
  eyebrow,
  heading,
  headingId,
  lead,
  points,
  axis,
  action,
  surface = 'paper',
}: EngagementModelProps) {
  const uid = `eng${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const compact = arrangement === 'compact';

  const head = (
    <Layout rowGap="block">
      {eyebrow ? (
        <p className={styles.eyebrow} data-copy="eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={headingId} className={styles.heading}>
        {heading}
      </h2>
    </Layout>
  );

  /* aria-hidden as a whole: the axis labels only make sense against the drawing. */
  const figure = (
    <div aria-hidden="true">
      <Layout rowGap="text">
        <Drawing arrangement={arrangement} uid={uid} />
        <Axis labels={axis} />
      </Layout>
    </div>
  );

  if (compact) {
    return (
      <Section
        as="section"
        surface={surface}
        aria-labelledby={headingId}
        data-band="USP-compact"
      >
        <Layout columns={{ lg: [2, 3] }} colGap="column" rowGap="stack" align="center">
          <Layout rowGap="stack">
            <Layout rowGap="block">
              {head}
              {lead ? <p className={styles.lead}>{lead}</p> : null}
            </Layout>
            {action ? <ActionLink action={action} /> : null}
          </Layout>
          <Layout rowGap="block">
            {figure}
            <Layout as="ul" columns={{ md: 3 }} colGap="gutter" rowGap="text">
              {points.map((point, i) => (
                /* Below md the keys stack, so each sits beside its mark as the full band's do;
                   from md, three across, the mark above its title. */
                <Layout
                  as="li"
                  key={point.title}
                  columns={{ base: ['auto', 1], md: 1 }}
                  colGap="block"
                  rowGap="tight"
                  align="center"
                >
                  <Swatch index={i as 0 | 1 | 2} uid={`${uid}${i}`} />
                  <p className={styles.key}>{point.title}</p>
                </Layout>
              ))}
            </Layout>
          </Layout>
        </Layout>
      </Section>
    );
  }

  return (
    <Section as="section" surface={surface} aria-labelledby={headingId} data-band="USP">
      <Layout rowGap="stack">
        <Layout columns={{ lg: [7, 5] }} colGap="column" rowGap="block" align="end">
          {head}
          {lead || action ? (
            <Layout rowGap="block">
              {lead ? <p className={styles.lead}>{lead}</p> : null}
              {action ? <ActionLink action={action} /> : null}
            </Layout>
          ) : null}
        </Layout>
        <Layout columns={{ lg: [7, 5] }} colGap="column" rowGap="stack" align="center">
          {figure}
          <Layout as="ul" rowGap="gutter">
            {points.map((point, i) => (
              <Layout as="li" key={point.title} columns={{ base: ['auto', 1] }} colGap="block">
                <Swatch index={i as 0 | 1 | 2} uid={`${uid}${i}`} />
                <Layout rowGap="tight">
                  <h3 className={styles.title}>{point.title}</h3>
                  <p className={styles.body}>{point.body}</p>
                </Layout>
              </Layout>
            ))}
          </Layout>
        </Layout>
      </Layout>
    </Section>
  );
}
