import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Hop, Rect } from './offer';
import { Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* /future-interfaces-lab/join: how the fellowship runs (`what-youll-do`, the method's one figure);
   docs/page-build/pages/future-interfaces-lab-join.md. A still plate in the kit's flat grammar on the one
   dotted plate (decisions/2026-11-03-flat-graphics-on-one-plate): no words inside a drawing, one blue
   subject, only frames on the plate, routes on the axes. The comment above the scene is the band's
   title and words. The three role drawings ("Who we look for") were removed in pass 2 (owner, 4 Nov
   2026): the band names qualities in people, so it is glyph-headed text cards. */

/**
 * How the fellowship works: a pod of three (design, engineering, go-to-market) joined on one build, the
 * build shipped (lit), and the review loop that brings it back for the next round.
 */
function PodShipsLoop() {
  const pod: { y: number; glyph: 'ruler-pen' | 'code' | 'share-circle' }[] = [
    { y: 50, glyph: 'ruler-pen' },
    { y: 90, glyph: 'code' },
    { y: 130, glyph: 'share-circle' },
  ];
  return (
    <>
      {/* The pod, one mark each. */}
      {pod.map(({ y, glyph }) => (
        <g key={y}>
          <Rect x={30} y={y - 14} w={40} h={28} rx={4} className={styles.frameQuiet} />
          <Glyph name={glyph} cx={50} cy={y} size={14} className={styles.glyph} />
        </g>
      ))}
      {/* Joined on one build. */}
      <path
        className={styles.line}
        d="M70,50 L84,50 A6,6 0 0 1 90,56 L90,124 A6,6 0 0 1 84,130 L70,130 M70,90 L123,90"
      />
      <circle className={styles.node} cx={70} cy={50} r="2.5" />
      <circle className={styles.node} cx={70} cy={90} r="2.5" />
      <circle className={styles.node} cx={70} cy={130} r="2.5" />
      <ArrowRight x={130} y={90} />
      <Rect x={130} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={144} y={66} w={40} />
      <Copy x={144} y={80} w={52} quiet />
      <Rect x={144} y={94} w={52} h={22} rx={4} className={styles.tile} />
      {/* Shipped. */}
      <Hop x1={210} x2={238} y={90} />
      <Focus x={256} y={90} glyph="check-circle" size={12} />
      {/* The review loop, back under the build for the next round. */}
      <path
        className={styles.line}
        d="M256,108 L256,144 A6,6 0 0 1 250,150 L176,150 A6,6 0 0 1 170,144 L170,137"
      />
      <ArrowUp x={170} y={130} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* How the design and AI fellowship in Ahmedabad works: You apply with work you have shipped, pass a practical round, then build in a small team expected to ship. Fellows are paired into small pods, often combining design, engineering and go-to-market strengths; pods build continuously, review openly and ship work that can be demonstrated. */
  'wyg-future-interfaces-lab-join-method': PodShipsLoop,
};
