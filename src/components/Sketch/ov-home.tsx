import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, HopIn, Rect } from './offer';
import { Focus, Glyph, GrowIn, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for / (home), "Design for every stage of a product". Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/** Starting up: the rough draft (dashed, its middle hatched, not really built) becomes one finished
 *  screen, and that screen takes payment (the wallet, lit). */
function HomeStageStarting() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.trailFrame} />
      <Copy x={44} y={58} w={36} quiet />
      <Hatched x={44} y={72} w={52} h={36} />
      <Copy x={44} y={122} w={28} quiet />
      <HopIn x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={48} w={40} quiet />
      <Copy x={166} y={62} w={72} />
      <GrowIn>
        <Focus x={210} y={104} glyph="wallet" size={12} />
      </GrowIn>
    </>
  );
}

/** Growing: the product grows screen by screen as customers arrive (one person, then a group), and the
 *  design is already on the next release, lit, before it is needed. */
function HomeStageGrowing() {
  return (
    <>
      <Rect x={30} y={90} w={60} h={50} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={115} size={18} className={styles.glyph} />
      <Rect x={110} y={70} w={60} h={70} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={140} cy={98} size={22} className={styles.glyph} />
      <Copy x={124} y={124} w={32} quiet />
      <GrowIn>
        <Rect x={204} y={34} w={92} h={112} rx={14} className={styles.halo} />
      </GrowIn>
      <HopIn x1={170} x2={210} y={110} />
      <Rect x={210} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={224} y={56} w={36} quiet />
      <Rect x={224} y={68} w={52} h={28} className={styles.region} />
      <Copy x={224} y={112} w={48} />
      <Copy x={224} y={124} w={32} quiet />
    </>
  );
}

/** Established: a large product of many screens, and one workflow through it, step to step, renewed
 *  and lit while the rest stays as it is. */
function HomeStageEstablished() {
  const cols = [50, 110, 170, 230];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {[46, 118].map((y) =>
        cols.map((x) => <Rect key={`${x}-${y}`} x={x} y={y} w={40} h={16} className={styles.tile} />),
      )}
      <GrowIn>
        <Rect x={44} y={76} w={232} h={28} rx={10} className={styles.halo} />
      </GrowIn>
      {cols.map((x) => (
        <Rect key={x} x={x} y={82} w={40} h={16} className={styles.region} />
      ))}
      {[90, 150, 210].map((x) => (
        <HopIn key={x} x1={x} x2={x + 20} y={90} />
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Starting up: From an idea, or an app you built with AI, to a first release people pay for. */
  'ov-home-stage-starting': HomeStageStarting,
  /* Growing: Design that stays a release ahead while new customers keep arriving. */
  'ov-home-stage-growing': HomeStageGrowing,
  /* Established or enterprise: A product customers have used for years, modernised one workflow at a time. */
  'ov-home-stage-established': HomeStageEstablished,
};
