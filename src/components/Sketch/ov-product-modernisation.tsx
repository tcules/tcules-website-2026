import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for /services/product-modernisation, "Product modernisation for each stage of a product". Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/**
 * Starting up: one young screen, its parts sorted before the rebuild. Two parts stay (lit, ticked);
 * the one between them is hatched, to be replaced.
 */
function StageStarting() {
  return (
    <>
      <Rect x={80} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={96} y={46} w={40} quiet />
      {[66, 122].map((y) => (
        <g key={y}>
          <Rect x={96} y={y - 8} w={96} h={16} className={styles.region} />
          <path className={styles.regionCopy} d={`M106,${y} L150,${y}`} />
          <GrowIn>
            <Glyph name="check-circle" cx={216} cy={y} size={16} className={styles.glyphAccent} />
          </GrowIn>
        </g>
      ))}
      <Hatched x={96} y={84} w={96} h={20} />
      <Glyph name="refresh" cx={216} cy={94} size={16} className={styles.glyphQuiet} />
    </>
  );
}

/**
 * Growing: one design language, carried to every module. The palette's route branches to three
 * module screens, and each one wears the same lit control.
 */
function StageGrowing() {
  return (
    <>
      <Focus x={50} y={90} glyph="palette" size={13} />
      <TraceIn d="M70,90 L163,90" />
      <TraceIn d="M70,90 L130,90 L130,56 A6,6 0 0 1 136,50 L163,50" />
      <TraceIn d="M70,90 L130,90 L130,124 A6,6 0 0 0 136,130 L163,130" />
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      {[50, 90, 130].map((y) => (
        <g key={y}>
          <GrowIn>
            <ArrowRight x={170} y={y} />
          </GrowIn>
          <Rect x={170} y={y - 16} w={120} h={32} rx={8} className={styles.frame} />
          <GrowIn>
            <Rect x={182} y={y - 6} w={28} h={12} rx={6} className={styles.solid} />
          </GrowIn>
          <Copy x={222} y={y} w={52} quiet />
        </g>
      ))}
    </>
  );
}

/** The module tiles of a suite, as [x, y, lit]: the one customers rely on, lit. */
const SUITE: readonly (readonly [number, number, boolean])[] = [50, 90, 130].flatMap((cy) =>
  [150, 200, 250].map((x) => [x, cy - 12, x === 150 && cy === 90] as const),
);

/**
 * Established: a suite of many modules, mapped from its customers. Their route finds the one module
 * they rely on, lit among the nine.
 */
function StageEstablished() {
  return (
    <>
      <Glyph name="users-group-rounded" cx={50} cy={90} size={28} className={styles.glyph} />
      <TraceIn d="M70,90 L137,90" />
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <GrowIn>
        <Rect x={144} y={72} w={48} h={36} rx={8} className={styles.halo} />
      </GrowIn>
      {SUITE.map(([x, y, lit]) => (
        <g key={`${x}-${y}`}>
          <Rect x={x} y={y} w={36} h={24} className={lit ? styles.block : styles.tile} />
          <path
            className={lit ? styles.regionCopy : styles.copyQuiet}
            d={`M${x + 9},${y + 12} L${x + 27},${y + 12}`}
          />
        </g>
      ))}
      <GrowIn>
        <ArrowRight x={144} y={90} />
      </GrowIn>
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Starting up: A young product, ready for its second version. A senior product designer plans what to keep and what to replace, before you rebuild. */
  'ov-product-modernisation-stage-starting': StageStarting,
  /* Growing: A growing product, ready for one consistent look. We set one design language and carry it across every module. */
  'ov-product-modernisation-stage-growing': StageGrowing,
  /* Established or enterprise: A trusted suite, ready to lead its market again. We map what customers rely on and set a route for each part. */
  'ov-product-modernisation-stage-established': StageEstablished,
};
