import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, HopIn, Rect } from './offer';
import { Chip, Focus, Glyph, GrowIn, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for /expertise/b2b-saas-workflow-software, "SaaS UX design from first workflow to full suite". Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/**
 * Starting up: the first role linked to its first record, and a dashed, empty place left beside them
 * for what comes next.
 */
function StageStarting() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={84} size={20} className={styles.glyph} />
      <Copy x={48} y={106} w={24} quiet />
      <TraceIn d="M90,90 L130,90" />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <GrowIn>
        <circle className={styles.node} cx="130" cy="90" r="2.5" />
      </GrowIn>
      <Rect x={130} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Chip x={142} y={62} glyph="document-text" />
      <Copy x={166} y={70} w={28} quiet />
      <Copy x={142} y={94} w={52} />
      <Copy x={142} y={106} w={40} quiet />
      <Copy x={142} y={118} w={48} quiet />
      <path className={styles.trail} d="M210,90 L230,90" />
      <Rect x={230} y={60} w={60} h={60} rx={8} className={styles.trailFrame} />
    </>
  );
}

/** The model's rows, as [y, glyph]: roles and records alternate; the new one lands at 90. */
const ROWS = [
  [50, 'user'],
  [70, 'document-text'],
  [90, 'user'],
  [110, 'document-text'],
  [130, 'user'],
] as const;

/**
 * Growing: a new role arrives and is fitted into the one model, as a row among the roles and records
 * already there.
 */
function StageGrowing() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={84} size={20} className={styles.glyph} />
      <Copy x={48} y={106} w={24} quiet />
      <HopIn x1={90} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {ROWS.map(([y, glyph]) => {
        const lit = y === 90;
        const row = (
          <>
            <Rect x={162} y={y - 7} w={116} h={14} className={lit ? styles.region : styles.tile} />
            <Glyph
              name={glyph}
              cx={174}
              cy={y}
              size={10}
              className={lit ? styles.glyphAccent : styles.glyphQuiet}
            />
            <path
              className={lit ? styles.regionCopy : styles.copyQuiet}
              d={`M188,${y} L${lit ? 240 : 228 - (y % 40)},${y}`}
            />
          </>
        );
        /* The new role's row arrives in its place among the rows already there. */
        return lit ? <GrowIn key={y}>{row}</GrowIn> : <g key={y}>{row}</g>;
      })}
    </>
  );
}

/** One role's screen at x, its sheets stacked behind on the side `away` (-1 left, 1 right). */
function RoleScreen({ x, away }: { x: number; away: -1 | 1 }) {
  return (
    <>
      <Rect x={x + away * 8} y={32} w={72} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={x + away * 4} y={36} w={72} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={x} y={40} w={72} h={100} rx={8} className={styles.frame} />
      <Chip x={x + 12} y={52} glyph="user" />
      <Copy x={x + 36} y={60} w={24} quiet />
      <Copy x={x + 12} y={84} w={48} />
      <Copy x={x + 12} y={96} w={36} quiet />
      <Rect x={x + 12} y={114} w={32} h={14} rx={7} className={styles.tile} />
    </>
  );
}

/**
 * Established: the suite's roles on their own screens, and the handover between them lit: the work
 * leaves one role and arrives with the next through one joined step.
 */
function StageEstablished() {
  return (
    <>
      <RoleScreen x={38} away={-1} />
      <RoleScreen x={210} away={1} />
      <TraceIn d="M110,90 L142,90" />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <GrowIn>
        <Focus x={160} y={90} glyph="hand-shake" size={13} />
      </GrowIn>
      <TraceIn d="M178,90 L203,90" />
      <GrowIn>
        <ArrowRight x={210} y={90} />
      </GrowIn>
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Starting up: A first workflow product, built for one industry. We design the records and roles first, so the first release has room to grow. */
  'ov-b2b-saas-stage-starting': StageStarting,
  /* Growing: More roles, more records, more exceptions every quarter. We fit each new role and record into one model, so the product stays clear. */
  'ov-b2b-saas-stage-growing': StageGrowing,
  /* Established or enterprise: A trusted suite customers have run for years. We start where work passes between roles, so every handover feels like one product. */
  'ov-b2b-saas-stage-established': StageEstablished,
};
