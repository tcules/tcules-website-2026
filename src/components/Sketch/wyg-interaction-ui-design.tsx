import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Still plates, drawn by the flat-drawings pass (2.62). Helpers come from ./offer and ./scenes (Rect,
   Copy, Hop, Glyph, Focus, Hatched, Chip, ...) and classes from ./Sketch.module.css. An item left
   undefined shows the empty plate. */

/* ── What we design ───────────────────────────────────────────────────────────── */

/** One screen drawn six ways: default, empty, loading, error (lit, the one nobody draws), partial and
 *  no permission. */
function EveryState() {
  const cell = (i: number) => ({ x: 52 + (i % 3) * 76, y: 32 + Math.floor(i / 3) * 64 });
  const screens: ((x: number, y: number) => ReactNode)[] = [
    /* Default. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.frame} />
        <Copy x={x + 10} y={y + 14} w={24} quiet />
        <Copy x={x + 10} y={y + 26} w={44} />
        <Copy x={x + 10} y={y + 38} w={32} quiet />
      </>
    ),
    /* Empty. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.frame} />
        <Glyph name="database" cx={x + 32} cy={y + 22} size={14} className={styles.glyphQuiet} />
        <Copy x={x + 22} y={y + 40} w={20} quiet />
      </>
    ),
    /* Loading. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.frame} />
        <Rect x={x + 10} y={y + 11} w={36} h={6} rx={3} className={styles.tile} />
        <Rect x={x + 10} y={y + 23} w={44} h={6} rx={3} className={styles.tile} />
        <Rect x={x + 10} y={y + 35} w={28} h={6} rx={3} className={styles.tile} />
      </>
    ),
    /* Error: the focal point. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.region} />
        <Glyph name="danger-triangle" cx={x + 32} cy={y + 20} size={16} className={styles.glyphAccent} />
        <Rect x={x + 18} y={y + 34} w={28} h={10} rx={5} className={styles.solid} />
      </>
    ),
    /* Partial data. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.frame} />
        <Copy x={x + 10} y={y + 14} w={44} />
        <Hatched x={x + 10} y={y + 24} w={44} h={18} />
      </>
    ),
    /* No permission. */
    (x, y) => (
      <>
        <Rect x={x} y={y} w={64} h={52} rx={8} className={styles.frame} />
        <Glyph name="lock" cx={x + 32} cy={y + 22} size={14} className={styles.glyphQuiet} />
        <Copy x={x + 22} y={y + 40} w={20} quiet />
      </>
    ),
  ];
  return (
    <>
      {screens.map((draw, i) => {
        const { x, y } = cell(i);
        return <g key={i}>{draw(x, y)}</g>;
      })}
    </>
  );
}

/** The action goes forward to its confirmation, and a lit route brings it back: every step can be undone. */
function InteractionPatterns() {
  return (
    <>
      {/* The screen the action starts on. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={50} w={40} quiet />
      <Copy x={46} y={64} w={64} />
      <Copy x={46} y={76} w={56} quiet />
      <Rect x={46} y={116} w={48} h={16} rx={8} className={styles.tile} />
      {/* Forward, quiet: the step already taken. */}
      <path className={styles.trail} d="M130,70 L203,70" />
      <path className={styles.quietMark} d="M210,70 L203,66 L203,74 Z" />
      <circle className={styles.knob} cx="130" cy="70" r="2.5" />
      {/* The confirmation it opens. */}
      <Rect x={210} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={224} y={66} w={40} />
      <Copy x={224} y={78} w={28} quiet />
      <Rect x={224} y={100} w={24} h={12} rx={6} className={styles.tile} />
      <Rect x={254} y={100} w={24} h={12} rx={6} className={styles.tile} />
      {/* Back, lit: the way home. */}
      <Hop x1={210} x2={130} y={110} />
      <Focus x={170} y={110} glyph="undo-left" size={12} />
    </>
  );
}

/** Hierarchy that leads: a heavy headline, quiet copy, and the right action the biggest thing on screen. */
function VisualDesign() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Rect x={90} y={46} w={100} h={10} rx={5} className={styles.glyph} />
      <Copy x={90} y={72} w={124} quiet />
      <Copy x={90} y={84} w={96} quiet />
      <Rect x={84} y={102} w={112} h={32} rx={16} className={styles.halo} />
      <Rect x={90} y={108} w={100} h={20} rx={10} className={styles.solid} />
      <Copy x={208} y={118} w={24} quiet />
    </>
  );
}

/** The desktop screen restacked for a phone: the menu folds away, the form and its button stay together. */
function SmallScreens() {
  return (
    <>
      <Rect x={30} y={40} w={160} h={100} rx={8} className={styles.frame} />
      <Rect x={42} y={52} w={32} h={76} rx={4} className={styles.tile} />
      <Copy x={50} y={66} w={16} quiet />
      <Copy x={50} y={78} w={12} quiet />
      <Copy x={50} y={90} w={16} quiet />
      <Copy x={86} y={60} w={48} quiet />
      <Rect x={86} y={70} w={92} h={14} rx={4} className={styles.tile} />
      <Rect x={86} y={90} w={92} h={14} rx={4} className={styles.tile} />
      <Rect x={86} y={112} w={40} h={14} rx={7} className={styles.tile} />
      <Hop x1={190} x2={230} y={90} />
      {/* The phone. */}
      <Rect x={230} y={30} w={60} h={120} rx={8} className={styles.frame} />
      <Glyph name="hamburger-menu" cx={246} cy={46} size={12} className={styles.glyph} />
      <Copy x={240} y={64} w={24} quiet />
      <Rect x={240} y={72} w={40} h={14} rx={4} className={styles.tile} />
      <Rect x={240} y={92} w={40} h={14} rx={4} className={styles.tile} />
      <Rect x={240} y={118} w={40} h={14} rx={7} className={styles.solid} />
    </>
  );
}

/** Labelled fields reached in order by the keyboard, the route landing on the button's focus ring. */
function Accessibility() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {[50, 90].map((y) => (
        <g key={y}>
          <Copy x={86} y={y} w={12} />
          <Rect x={110} y={y - 10} w={100} h={20} rx={4} className={styles.tile} />
          <circle className={styles.node} cx="210" cy={y} r="2.5" />
        </g>
      ))}
      {/* The tab order: field, field, then the button. */}
      <path
        className={styles.line}
        d="M210,50 L224,50 Q230,50 230,56 L230,124 Q230,130 224,130 L177,130 M210,90 L230,90"
      />
      <ArrowLeft x={170} y={130} />
      {/* The focus ring, clear of the button it rings. */}
      <Rect x={104} y={118} w={66} h={24} rx={12} className={styles.region} />
      <Rect x={110} y={122} w={54} h={16} rx={8} className={styles.tile} />
    </>
  );
}

/** The words written into the screen itself: a field's label, the error under it, the button's line. */
function InterfaceText() {
  return (
    <>
      <Rect x={90} y={40} w={140} h={100} rx={8} className={styles.frame} />
      {/* The field as a bubble of text: its tail at the top left, its label beside the tail. */}
      <path
        className={styles.region}
        d="M110,58 L110,50 L120,58 L210,58 Q214,58 214,62 L214,78 Q214,82 210,82 L110,82 Q106,82 106,78 L106,62 Q106,58 110,58 Z"
      />
      <Copy x={128} y={50} w={28} quiet />
      {/* The words being written: three of unequal length, then the caret. */}
      <Rect x={114} y={67} w={22} h={6} rx={3} className={styles.solid} />
      <Rect x={140} y={67} w={10} h={6} rx={3} className={styles.solid} />
      <Rect x={154} y={67} w={18} h={6} rx={3} className={styles.solid} />
      <Rect x={176} y={63} w={2} h={14} rx={1} className={styles.solid} />
      {/* The error message under it: tied to the field, its glyph, then message and fix. */}
      <path className={styles.copyQuiet} d="M112,82 L112,92 Q112,98 118,98" />
      <Glyph name="danger-triangle" cx={125} cy={98} size={10} className={styles.glyph} />
      <Copy x={136} y={98} w={28} />
      <Copy x={170} y={98} w={18} quiet />
      {/* The button and its label. */}
      <Rect x={106} y={112} w={60} h={18} rx={9} className={styles.tile} />
      <Rect x={122} y={118} w={28} h={6} rx={3} className={styles.solid} />
    </>
  );
}

/** A screen measured and pinned: each part carries its note, the rules a builder needs. */
function Specifications() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {/* The measure across the card. */}
      <path className={styles.rule} d="M50,42 L150,42 M50,38 L50,46 M150,38 L150,46" />
      <Rect x={50} y={50} w={100} h={40} rx={4} className={styles.tile} />
      <Copy x={62} y={64} w={52} />
      <Copy x={62} y={76} w={36} quiet />
      <Rect x={50} y={122} w={56} h={16} rx={8} className={styles.tile} />
      {/* Pins from each part to its note. */}
      <path className={styles.rule} d="M150,70 L170,70 M106,130 L170,130" />
      <path className={styles.line} d="M170,70 L210,70 M170,130 L210,130" />
      <circle className={styles.node} cx="170" cy="70" r="2.5" />
      <circle className={styles.node} cx="170" cy="130" r="2.5" />
      {[50, 110].map((y, i) => (
        <g key={y}>
          <Rect x={210} y={y} w={80} h={40} rx={8} className={styles.frame} />
          <Chip x={220} y={y + 12} glyph={i === 0 ? 'widget' : 'info-circle'} />
          <Copy x={244} y={y + 16} w={34} />
          <Copy x={244} y={y + 26} w={24} quiet />
        </g>
      ))}
    </>
  );
}

/** The built screen laid over its design, part for part, and passed. */
function HandoverBuildReview() {
  return (
    <>
      {/* The design, behind. */}
      <Rect x={50} y={30} w={120} h={100} rx={8} className={styles.frameQuiet} />
      <Chip x={62} y={42} glyph="palette" />
      {/* The build, laid over it. */}
      <Rect x={90} y={50} w={120} h={100} rx={8} className={styles.frame} />
      <Chip x={102} y={62} glyph="code" />
      <Copy x={126} y={70} w={56} />
      <Rect x={102} y={86} w={96} h={24} rx={4} className={styles.tile} />
      <Rect x={102} y={122} w={44} h={14} rx={7} className={styles.tile} />
      <Hop x1={210} x2={240} y={90} />
      <Focus x={260} y={90} glyph="check-circle" size={12} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Every state.: Each important screen in its default, empty, loading, error, partial-data and no-permission versions, tested with long names and large tables. */
  'wyg-interaction-ui-design-every-state': EveryState,
  /* Interaction patterns.: What each important action triggers, what people see next and how they undo or recover, including confirmations, mode switches and keyboard use. */
  'wyg-interaction-ui-design-interaction-patterns': InteractionPatterns,
  /* Visual design.: Type, spacing, colour, layout and hierarchy that put the right action first, in your design system or a new visual direction. A beautiful screen that highlights the wrong button is still a bug. */
  'wyg-interaction-ui-design-visual-design': VisualDesign,
  /* Small screens.: What stays together, what collapses and what moves on a phone, so the task still works. */
  'wyg-interaction-ui-design-small-screens': SmallScreens,
  /* Accessibility.: Labels, keyboard use, reading order, contrast and error messages, designed in from the first screen. */
  'wyg-interaction-ui-design-accessibility': Accessibility,
  /* Interface text.: The microcopy: labels, buttons, empty states and error messages, written with their screens. */
  'wyg-interaction-ui-design-interface-text': InterfaceText,
  /* Specifications.: Every screen annotated with its states and edge cases, plus rules for each reusable part. */
  'wyg-interaction-ui-design-specifications': Specifications,
  /* Handover and build review.: A walkthrough with your engineers, answers while they build, and a check of the built screens against the design. */
  'wyg-interaction-ui-design-handover-build-review': HandoverBuildReview,
};
