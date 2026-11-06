import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* /why-tcules, "Better product decisions, before you build" (owner, 6 Nov 2026: "we'll draw flat
   graphics for each"): one still plate per principle, each drawn from its own sentence. Helpers from
   ./offer and ./scenes, classes from ./Sketch.module.css. Still plates: the finished picture. */

/**
 * Evidence before screens: "We test your assumptions with real users before they become expensive
 * mistakes." The assumption (a card with its question) goes to a real user and comes back answered,
 * the lit point, while the full screen it would have become is still hatched, not built.
 */
function Evidence() {
  return (
    <>
      {/* The assumption. */}
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Chip x={38} y={58} glyph="question-circle" />
      <Copy x={38} y={90} w={40} />
      <Copy x={38} y={102} w={28} quiet />
      <Copy x={38} y={114} w={34} quiet />
      <Hop x1={90} x2={130} y={90} />
      {/* The real user, and the answer. */}
      <Glyph name="user" cx={150} cy={90} size={36} className={styles.glyph} />
      <Hop x1={170} x2={190} y={90} />
      <Focus x={210} y={90} glyph="check-circle" size={12} />
      {/* The screen, still not built. */}
      <path className={styles.trail} d="M230,90 L250,90" />
      <Hatched x={250} y={50} w={40} h={80} />
      <circle className={styles.nodeOpen} cx={250} cy={90} r={3} />
    </>
  );
}

/**
 * What to build first: "You leave knowing what to build, what can wait, and why." Of everything that
 * could be built, one part is taken first, carrying its reason (the note) to the lit flag; the rest go
 * to what can wait, hatched, on a route not yet taken.
 */
function BuildFirst() {
  return (
    <>
      {/* Everything that could be built, the first one chosen. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Rect x={42} y={40} w={56} h={20} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M50,50 L84,50" />
      <Rect x={42} y={80} w={56} h={20} rx={4} className={styles.tile} />
      <Copy x={50} y={90} w={30} quiet />
      <Rect x={42} y={120} w={56} h={20} rx={4} className={styles.tile} />
      <Copy x={50} y={130} w={36} quiet />
      {/* Build this first, with the reason why. */}
      <Hop x1={110} x2={170} y={50} />
      <Rect x={170} y={30} w={120} h={40} rx={8} className={styles.frame} />
      <Chip x={180} y={42} glyph="notebook" />
      <Copy x={204} y={46} w={40} />
      <Copy x={204} y={56} w={28} quiet />
      <Focus x={270} y={50} glyph="flag" size={12} />
      {/* What can wait. */}
      <path className={styles.trail} d="M110,130 L163,130" />
      <path className={styles.quietMark} d="M170,130 L163,126 L163,134 Z" />
      <Hatched x={170} y={110} w={120} h={40} />
    </>
  );
}

/**
 * Design that pays back: "Every design decision is tied to the adoption, renewals or revenue it should
 * move." One decision on the screen (its button) is tied by a route to the number it should move: the
 * chart's tallest bar, the lit point.
 */
function PaysBack() {
  return (
    <>
      {/* The design, its one decision lit. */}
      <Rect x={30} y={30} w={110} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={40} />
      <Rect x={46} y={60} w={78} h={28} rx={4} className={styles.soft} />
      <Copy x={46} y={130} w={60} quiet />
      <Rect x={46} y={100} w={44} h={20} rx={10} className={styles.region} />
      <path className={styles.regionCopy} d="M56,110 L80,110" />
      {/* Tied to the number it moves. */}
      <path className={styles.line} d="M90,110 L140,110" />
      <Hop x1={140} x2={180} y={110} />
      <Rect x={180} y={30} w={110} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M196,134 L274,134" />
      <Rect x={200} y={104} w={14} h={30} rx={2} className={styles.tile} />
      <Rect x={224} y={88} w={14} h={46} rx={2} className={styles.tile} />
      <Rect x={248} y={70} w={14} h={64} rx={2} className={styles.solid} />
      <Focus x={255} y={50} glyph="graph-up" size={12} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Evidence before screens: the assumption tested with a real user, answered before the screen exists. */
  'why-principles-evidence': Evidence,
  /* What to build first: one part taken first with its reason, the rest waiting. */
  'why-principles-build-first': BuildFirst,
  /* Design that pays back: a design decision tied to the number it should move. */
  'why-principles-pays-back': PaysBack,
};
