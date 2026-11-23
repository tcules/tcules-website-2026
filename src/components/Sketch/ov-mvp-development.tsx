import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, HopIn, Rect } from './offer';
import { Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The overhaul pages' drawings (owner, 19 Nov 2026: "complete the drawings for which you've left out
   placeholders"), for /services/mvp-development, "MVP development for where your product starts" and two figures. Stage plates are 320 x 180 (Stages' 16:9 plate); a PORTRAIT scene is
   240 x 300 (Sketch shape="portrait", a 4:5 figure beside rows). An item left undefined shows the
   empty plate. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css.
   STAGE MOTION (owner, 19 Nov 2026): a stage row is a link into a page, so its drawing moves on the
   row's hover, the problem at rest and solved at its end, in the tile patterns
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns): the route draws (HopIn / TraceIn) and what
   it reaches arrives (GrowIn). Held still, every scene is exactly its end state. */

/**
 * An idea: of the things it could be, one job is picked and built, done well (its star). The other
 * candidates stay hatched, never built.
 */
function StageIdea() {
  return (
    <>
      <Hatched x={30} y={40} w={80} h={24} />
      <Rect x={30} y={78} w={80} h={24} className={styles.frame} />
      <Copy x={42} y={90} w={40} />
      <Hatched x={30} y={116} w={80} h={24} />
      <HopIn x1={110} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={48} w={40} quiet />
      <GrowIn>
        <Focus x={230} y={90} glyph="star" size={12} />
      </GrowIn>
      <Copy x={186} y={132} w={72} quiet />
    </>
  );
}

/**
 * An AI-built prototype: the demo, still a dashed sketch, put in front of the people who want it,
 * and the route runs on to their payment, lit.
 */
function StageAiPrototype() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.trailFrame} />
      <Glyph name="stars" cx={70} cy={82} size={22} className={styles.glyphQuiet} />
      <Copy x={54} y={110} w={32} quiet />
      <Rect x={150} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={170} cy={90} size={24} className={styles.glyph} />
      <TraceIn d="M110,90 L150,90" />
      <TraceIn d="M190,90 L259,90" />
      {[110, 150, 190].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy="90" r="2.5" />
      ))}
      <GrowIn>
        <Focus x={270} y={90} glyph="wallet" size={12} />
      </GrowIn>
    </>
  );
}

/**
 * First paying customers: what must change, set out on a page, and the product it is applied to
 * carries the security sign-off, its shield lit on the corner.
 */
function StagePaying() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} className={styles.frame} />
      <Copy x={44} y={56} w={32} quiet />
      {(
        [
          [76, 52],
          [92, 40],
          [108, 48],
          [124, 32],
        ] as const
      ).map(([y, w]) => (
        <Copy key={y} x={44} y={y} w={w} />
      ))}
      <HopIn x1={110} x2={150} y={90} />
      <Rect x={150} y={50} w={120} h={80} rx={8} className={styles.frame} />
      <Copy x={166} y={70} w={40} quiet />
      <Rect x={166} y={84} w={72} h={16} className={styles.tile} />
      <Copy x={166} y={114} w={56} quiet />
      <GrowIn>
        <Focus x={270} y={50} glyph="shield-check" size={12} />
      </GrowIn>
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* An idea: An idea, or a pitch deck and early interest. We shape the first release around one job done well, then build it. */
  'ov-mvp-development-stage-idea': StageIdea,
  /* An AI-built prototype: You built it with AI tools, and people want it. We take it from demo to paying customers. */
  'ov-mvp-development-stage-ai-prototype': StageAiPrototype,
  /* First paying customers: Paying users, and a client asking for security sign-off. We set out in writing what must change, then make it ready. */
  'ov-mvp-development-stage-paying': StagePaying,
};
