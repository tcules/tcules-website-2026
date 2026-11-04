import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Hop, Rect } from './offer';
import { Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* /future-interfaces-lab/join: the three roles the fellowship looks for (`who-we-are-looking-for`, the
   drawn offer sheet across 3) and how the fellowship runs (`what-youll-do`, the method's one figure);
   docs/page-build/pages/future-interfaces-lab-join.md. Still plates in the kit's flat grammar on the one
   dotted plate (decisions/2026-11-03-flat-graphics-on-one-plate): no words inside a drawing, one blue
   subject, only frames on the plate, routes on the axes. The three roles share a row, so each has its
   own shape: a chain of three (store, agent, tool), one interface in three states, one product going
   out to several channels. The comment above each scene is the item's title and words. */

/**
 * AI systems builders: the whole system, in a chain. Data in a store, an agent working on it (the one
 * lit thing), and the tool it runs, a screen with its result in it.
 */
function SystemsChain() {
  return (
    <>
      {/* The data store. */}
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frameQuiet} />
      <Glyph name="database" cx={60} cy={78} size={24} className={styles.glyph} />
      <Copy x={46} y={110} w={28} quiet />
      {/* Into the agent. */}
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={160} y={90} glyph="stars" size={12} />
      {/* Out to the running tool. */}
      <Hop x1={190} x2={230} y={90} />
      <Rect x={230} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Copy x={242} y={56} w={28} />
      <Copy x={242} y={70} w={36} quiet />
      <Rect x={240} y={86} w={40} h={24} rx={4} className={styles.tile} />
      <Glyph name="check-circle" cx={252} cy={98} size={12} className={styles.glyph} />
      <Copy x={262} y={98} w={12} quiet />
      <Copy x={242} y={124} w={24} quiet />
    </>
  );
}

/**
 * Product experience designers: one interface through its states. Three frames of the same screen, a
 * sheet rising in each, and the last state, the sheet up and lit, where the motion lands.
 */
function InterfaceStates() {
  const states: { x: number; top: number; lit: boolean }[] = [
    { x: 30, top: 116, lit: false },
    { x: 130, top: 96, lit: false },
    { x: 230, top: 76, lit: true },
  ];
  return (
    <>
      {states.map(({ x, top, lit }) => (
        <g key={x}>
          <Rect x={x} y={30} w={60} h={120} rx={8} className={lit ? styles.frame : styles.frameQuiet} />
          <Copy x={x + 12} y={46} w={28} quiet />
          <Copy x={x + 12} y={58} w={36} quiet />
          {lit ? (
            <>
              <Rect x={x + 6} y={top - 6} w={48} h={148 - top} rx={10} className={styles.halo} />
              <Rect x={x + 12} y={top} w={36} h={136 - top} rx={4} className={styles.solid} />
              <path className={styles.regionCopy} d={`M${x + 18},${top + 14} L${x + 42},${top + 14}`} />
              <path className={styles.regionCopy} d={`M${x + 18},${top + 26} L${x + 36},${top + 26}`} />
            </>
          ) : (
            <>
              <Rect x={x + 12} y={top} w={36} h={136 - top} rx={4} className={styles.tile} />
              <Copy x={x + 18} y={top + 12} w={20} quiet />
            </>
          )}
        </g>
      ))}
      {/* The motion path, state to state. */}
      <Hop x1={90} x2={130} y={90} />
      <Hop x1={190} x2={230} y={90} />
    </>
  );
}

/**
 * Growth and brand operators: one product taken to market. The product's screen, its launch route
 * branching to three channels, and the one that grows lit.
 */
function ProductToChannels() {
  return (
    <>
      {/* The product. */}
      <Rect x={30} y={40} w={90} h={100} rx={8} className={styles.frame} />
      <Copy x={44} y={58} w={48} />
      <Copy x={44} y={72} w={60} quiet />
      <Copy x={44} y={84} w={40} quiet />
      <Rect x={44} y={104} w={44} h={20} rx={10} className={styles.tile} />
      {/* The lit channel's ground, under the route that reaches it. */}
      <Rect x={204} y={112} w={92} h={36} rx={10} className={styles.halo} />
      {/* The launch, branching out to the channels. */}
      <circle className={styles.node} cx={120} cy={90} r="2.5" />
      <path
        className={styles.line}
        d="M120,90 L170,90 M170,90 L170,56 A6,6 0 0 1 176,50 L203,50 M170,90 L170,124 A6,6 0 0 0 176,130 L203,130"
      />
      <path className={styles.line} d="M170,90 L203,90" />
      <ArrowRight x={210} y={50} />
      <ArrowRight x={210} y={90} />
      <ArrowRight x={210} y={130} />
      {/* The channels: a letter, a share, and the one that grows. */}
      <Rect x={210} y={38} w={80} h={24} rx={4} className={styles.frameQuiet} />
      <Glyph name="letter" cx={226} cy={50} size={12} className={styles.glyph} />
      <Copy x={240} y={50} w={36} quiet />
      <Rect x={210} y={78} w={80} h={24} rx={4} className={styles.frameQuiet} />
      <Glyph name="share-circle" cx={226} cy={90} size={12} className={styles.glyph} />
      <Copy x={240} y={90} w={28} quiet />
      <Rect x={210} y={118} w={80} h={24} rx={4} className={styles.frame} />
      <Glyph name="graph-up" cx={226} cy={130} size={12} className={styles.glyphAccent} />
      <Copy x={240} y={130} w={40} />
    </>
  );
}

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
  /* AI systems builders: Builders who work across AI-native development, agent workflows, data systems and the architecture of the whole system. */
  'wyg-future-interfaces-lab-join-ai-systems-builders': SystemsChain,
  /* Product experience designers: Designers who combine UX research, interface design and motion craft with strong systems thinking and product judgement. */
  'wyg-future-interfaces-lab-join-product-experience-designers': InterfaceStates,
  /* Growth and brand operators: People who can take a product to market: positioning, launch, distribution and early growth. */
  'wyg-future-interfaces-lab-join-growth-brand-operators': ProductToChannels,
  /* How the design and AI fellowship in Ahmedabad works: You apply with work you have shipped, pass a practical round, then build in a small team expected to ship. Fellows are paired into small pods, often combining design, engineering and go-to-market strengths; pods build continuously, review openly and ship work that can be demonstrated. */
  'wyg-future-interfaces-lab-join-method': PodShipsLoop,
};
