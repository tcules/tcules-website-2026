import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, HopIn, Rect } from './offer';
import { Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for /how-we-work, "Start from wherever your product is" and "The engagement moves with your product". Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/**
 * A new product: who it is for, then the one part built first, and it goes out as a release. The person
 * routes into the product, where the first part stands built among the parts still to come (hatched),
 * carrying the release flag.
 */
function StageNew() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={90} size={28} className={styles.glyph} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <HopIn x1={90} x2={150} y={90} />
      <Rect x={150} y={50} w={60} h={80} className={styles.tile} />
      <GrowIn>
        <Focus x={180} y={90} glyph="flag" size={12} />
      </GrowIn>
      <Hatched x={226} y={50} w={48} h={36} />
      <Hatched x={226} y={94} w={48} h={36} />
    </>
  );
}

/**
 * A growing product: each release bigger than the last, and the design for the next one already
 * drawn ahead of it, the one lit.
 */
function StageGrowing() {
  return (
    <>
      {(
        [
          [30, 100],
          [100, 80],
          [170, 60],
        ] as const
      ).map(([x, top]) => (
        <g key={x}>
          <Rect x={x} y={top} w={50} h={130 - top} rx={6} className={styles.frame} />
          <Copy x={x + 12} y={top + 14} w={22} quiet />
        </g>
      ))}
      {/* The next release's design arrives ahead of the build: absent at rest. */}
      <GrowIn>
        <Rect x={240} y={40} w={50} h={90} rx={6} className={styles.region} />
        <Glyph name="ruler-pen" cx={265} cy={85} size={26} className={styles.glyphAccent} />
      </GrowIn>
      <path className={styles.rule} d="M30,140 L283,140" />
      <path className={styles.quietMark} d="M290,140 L283,136 L283,144 Z" />
    </>
  );
}

/**
 * An established product: a long-lived screen full of rows, and one workflow in it picked out and
 * improved, carried out to its tick, while the rest stays as it is.
 */
function StageEstablished() {
  return (
    <>
      <Rect x={30} y={30} w={200} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M66,30 L66,150" />
      {[48, 60, 72].map((y) => (
        <Copy key={y} x={42} y={y} w={12} quiet />
      ))}
      <Copy x={82} y={48} w={104} quiet />
      <Copy x={82} y={62} w={76} quiet />
      <Rect x={78} y={78} w={136} h={24} className={styles.region} />
      <path className={styles.regionCopy} d="M90,90 L170,90" />
      <Copy x={82} y={118} w={116} quiet />
      <Copy x={82} y={132} w={88} quiet />
      <TraceIn d="M230,90 L259,90" />
      <circle className={styles.node} cx="230" cy="90" r="2.5" />
      <GrowIn>
        <Focus x={270} y={90} glyph="check-circle" size={12} />
      </GrowIn>
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A new product: An idea, or a prototype you built with AI. We find who it is for and what to build first, then take it to a first release. */
  'ov-how-we-work-stage-new': StageNew,
  /* A growing product: Customers are arriving faster than design can keep up. We work inside your team and design ahead of each release. */
  'ov-how-we-work-stage-growing': StageGrowing,
  /* An established product: A product customers have used for years. We learn the reasons behind its quirks, then improve it one workflow at a time. */
  'ov-how-we-work-stage-established': StageEstablished,
};
