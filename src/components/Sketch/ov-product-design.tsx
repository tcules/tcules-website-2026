import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, HopIn, Rect } from './offer';
import { Chip, Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for /services/product-design, "Product design for each stage of your product". Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/** A route straight down from a port at y1 to the arrowhead's tip at y2, on x: drawn along its length,
 *  its head arriving as it lands (HopIn's vertical form). */
function Drop({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <>
      <circle className={styles.node} cx={x} cy={y1} r="2.5" />
      <TraceIn d={`M${x},${y1} L${x},${y2 - 7}`} />
      <GrowIn>
        <path className={styles.solid} d={`M${x},${y2} L${x - 4},${y2 - 7} L${x + 4},${y2 - 7} Z`} />
      </GrowIn>
    </>
  );
}

/** Starting up: the person who uses it routes into a first release that holds one job, done and
 *  checked, with everything else left for later (hatched). */
function PdStageStarting() {
  return (
    <>
      <Rect x={50} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={80} cy={90} size={24} className={styles.glyph} />
      <HopIn x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={50} w={40} quiet />
      <Rect x={166} y={70} w={88} h={40} className={styles.region} />
      <GrowIn>
        <Glyph name="check-circle" cx={210} cy={90} size={20} className={styles.glyphAccent} />
      </GrowIn>
      <Hatched x={166} y={122} w={88} h={16} />
    </>
  );
}

/** Growing: two lanes, design over build. Each design is finished before the build under it starts, and
 *  the design lane is already one release further on (lit), its build still to come (hatched). */
function PdStageGrowing() {
  const slots = [60, 140, 220];
  return (
    <>
      <Chip x={30} y={52} glyph="ruler-pen" />
      <Chip x={30} y={112} glyph="code" />
      <GrowIn>
        <Rect x={214} y={44} w={72} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      {slots.map((x, i) =>
        i < 2 ? (
          <g key={x}>
            <Rect x={x} y={50} w={60} h={20} className={styles.frame} />
            <Copy x={x + 10} y={60} w={32} />
            <Rect x={x} y={110} w={60} h={20} className={styles.tile} />
            <Copy x={x + 10} y={120} w={32} quiet />
            <Drop x={x + 30} y1={70} y2={110} />
          </g>
        ) : (
          <g key={x}>
            <Rect x={x} y={50} w={60} h={20} className={styles.region} />
            <Hatched x={x} y={110} w={60} h={20} />
          </g>
        ),
      )}
    </>
  );
}

/** Established: the product's workflows by how much they are used; the busiest is taken first and
 *  routed to its redesign. */
function PdStageEstablished() {
  const rows: [number, number][] = [
    [50, 60],
    [68, 44],
    [112, 52],
    [130, 72],
  ];
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {rows.map(([y, w]) => (
        <Rect key={y} x={46} y={y - 4} w={w} h={8} className={styles.tile} />
      ))}
      <GrowIn>
        <Rect x={40} y={80} w={116} h={20} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={46} y={86} w={104} h={8} className={styles.solid} />
      <HopIn x1={170} x2={242} y={90} />
      <GrowIn>
        <Focus x={260} y={90} glyph="refresh" size={12} />
      </GrowIn>
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Starting up: An idea, or a prototype that proved people want it. We shape the first release around one job done well, tested with your users. */
  'ov-product-design-stage-starting': PdStageStarting,
  /* Growing: A fast-moving roadmap, ready for design at the same pace. We design ahead of your roadmap, so engineers build from finished designs every release. */
  'ov-product-design-stage-growing': PdStageGrowing,
  /* Established or enterprise: A trusted product, ready for its next chapter. We redesign the busiest workflows first, keeping the habits people rely on. */
  'ov-product-design-stage-established': PdStageEstablished,
};
