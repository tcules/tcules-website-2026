import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Lens, Rect, Switch } from './offer';
import { Focus, Glyph, GrowIn, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* /future-interfaces-lab: the four internal tools for design work (`design-work`, drawn Bento tiles,
   four across) and how an experiment leaves the Lab (`promotion`, one figure beside its sentence);
   docs/page-build/pages/future-interfaces-lab.md. Flat grammar on the one dotted plate
   (decisions/2026-11-03-flat-graphics-on-one-plate): no words inside a drawing, one blue subject,
   routes on the axes. The four tiles share a row, so no two open on the same picture: a library feeding
   a screen, a screen sorted into three bins, a pattern's tag read twice, a page with margin notes.
   The comment above each scene is the item's title and words. */

/**
 * Matter Design System: a published library of parts (a swatch, a glyph, a switch, a pill), and the pill
 * carried out of it into the button of a screen. The tile is the link to the Matter page, so it moves:
 * the route draws and the pill fills at both ends.
 */
function MatterLibrary() {
  return (
    <>
      {/* The library: four parts in a grid. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={44} y={44} w={36} quiet />
      <Rect x={44} y={54} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <circle className={styles.tile} cx={60} cy={70} r={8} />
      <Rect x={84} y={54} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <Glyph name="star" cx={100} cy={70} size={14} className={styles.glyph} />
      <Rect x={44} y={94} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <Switch x={48} y={104} on={false} />
      <Rect x={84} y={94} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <Rect x={88} y={104} w={24} h={12} rx={6} className={styles.press} />
      {/* The pill carried out of the library to the screen. */}
      <circle className={styles.node} cx={130} cy={110} r="2.5" />
      <TraceIn d="M130,110 L144,110 A6,6 0 0 1 150,104 L150,76 A6,6 0 0 1 156,70 L163,70" />
      <GrowIn>
        <ArrowRight x={170} y={70} />
      </GrowIn>
      {/* The screen, its button made from that pill. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={46} w={64} />
      <GrowIn>
        <Rect x={180} y={58} w={64} h={24} rx={12} className={styles.halo} />
      </GrowIn>
      <Rect x={186} y={62} w={52} h={16} rx={8} className={styles.press} />
      <Copy x={186} y={100} w={88} quiet />
      <Copy x={186} y={114} w={64} quiet />
      <Rect x={186} y={124} w={40} h={14} rx={4} className={styles.tile} />
      <Rect x={232} y={124} w={40} h={14} rx={4} className={styles.tile} />
    </>
  );
}

/**
 * AI Design Audit Agent: a screen under the lens, and what the review finds dropped into three
 * separate bins below it (observed, what it means, fix first), the last one lit.
 */
function AuditAgentBins() {
  const bins: { x: number; glyph: IconName; lit?: boolean }[] = [
    { x: 30, glyph: 'eye' },
    { x: 120, glyph: 'stars' },
    { x: 210, glyph: 'flag', lit: true },
  ];
  return (
    <>
      {/* The screen being reviewed, the lens over it. */}
      <Rect x={100} y={14} w={120} h={76} rx={8} className={styles.frame} />
      <Copy x={114} y={30} w={56} />
      <Copy x={114} y={44} w={80} quiet />
      <Rect x={114} y={56} w={44} h={22} rx={4} className={styles.tile} />
      <Rect x={164} y={56} w={42} h={22} rx={4} className={styles.tile} />
      <Lens x={184} y={60} r={14} />
      {/* The findings, sorted three ways. */}
      <circle className={styles.node} cx={160} cy={90} r="2.5" />
      <path
        className={styles.line}
        d="M160,90 L160,104 M160,110 L160,124 M160,104 A6,6 0 0 1 154,110 L76,110 A6,6 0 0 0 70,116 L70,124 M160,104 A6,6 0 0 0 166,110 L244,110 A6,6 0 0 1 250,116 L250,124"
      />
      {bins.map(({ x, glyph, lit }) => (
        <g key={x}>
          <Rect
            x={x}
            y={130}
            w={80}
            h={36}
            rx={8}
            className={lit ? styles.block : styles.frameQuiet}
          />
          <Glyph
            name={glyph}
            cx={x + 18}
            cy={148}
            size={14}
            className={lit ? styles.glyphAccent : styles.glyphQuiet}
          />
          <Copy x={x + 32} y={148} w={34} quiet={!lit} />
        </g>
      ))}
    </>
  );
}

/**
 * UI Pattern Vision Labelling Tool: a pattern boxed and given one tag, the tag pointed at by a person's
 * cursor and read, along the route, by a machine.
 */
function PatternOneTag() {
  return (
    <>
      {/* The pattern, boxed. */}
      <Rect x={30} y={30} w={170} h={64} rx={8} className={styles.region} />
      {[40, 94, 148].map((x) => (
        <g key={x}>
          <Rect x={x} y={40} w={44} h={44} rx={4} className={styles.frame} />
          <Rect x={x + 8} y={48} w={28} h={12} rx={2} className={styles.tile} />
          <Copy x={x + 8} y={70} w={24} />
        </g>
      ))}
      {/* Its one tag. */}
      <Rect x={30} y={102} w={60} h={16} rx={8} className={styles.solid} />
      <path className={styles.regionCopy} d="M42,110 L74,110" />
      {/* A person reads it. */}
      <Cursor x={62} y={120} />
      {/* A machine reads the same tag. */}
      <circle className={styles.node} cx={90} cy={110} r="2.5" />
      <path className={styles.line} d="M90,110 L215,110" />
      <ArrowRight x={222} y={110} />
      <Focus x={240} y={110} glyph="cpu" size={12} />
    </>
  );
}

/**
 * Landing Page Audit Programme: a landing page critiqued in its margin, three notes pinned to what the
 * page shows, what that costs and what to change; the change is the one lit.
 */
function LandingMarginNotes() {
  const notes: { y: number; glyph: IconName; lit?: boolean }[] = [
    { y: 50, glyph: 'eye' },
    { y: 90, glyph: 'wallet' },
    { y: 130, glyph: 'ruler-pen', lit: true },
  ];
  return (
    <>
      {/* The landing page. */}
      <Rect x={60} y={20} w={110} h={140} rx={8} className={styles.frame} />
      <Copy x={74} y={34} w={24} quiet />
      <Copy x={74} y={50} w={72} />
      <Copy x={74} y={62} w={52} quiet />
      <Rect x={74} y={74} w={40} h={14} rx={7} className={styles.tile} />
      <Rect x={74} y={98} w={82} h={24} rx={4} className={styles.tile} />
      <Copy x={74} y={134} w={60} quiet />
      <Copy x={74} y={146} w={44} quiet />
      {/* The notes in its margin. */}
      {notes.map(({ y, glyph, lit }) => (
        <g key={y}>
          {lit ? (
            <>
              <circle className={styles.node} cx={170} cy={y} r="2.5" />
              <path className={styles.line} d={`M170,${y} L203,${y}`} />
              <ArrowRight x={210} y={y} />
            </>
          ) : (
            <path className={styles.trail} d={`M170,${y} L210,${y}`} />
          )}
          <Rect
            x={210}
            y={y - 12}
            w={80}
            h={24}
            rx={4}
            className={lit ? styles.block : styles.frameQuiet}
          />
          <Glyph
            name={glyph}
            cx={224}
            cy={y}
            size={12}
            className={lit ? styles.glyphAccent : styles.glyphQuiet}
          />
          <Copy x={238} y={y} w={38} quiet={!lit} />
        </g>
      ))}
    </>
  );
}

/**
 * When a Lab experiment becomes everyday studio practice: the experiment in the Lab, and one route out
 * of it branching to the four places it can go (a method sheet, a tool, a definition, a case study).
 */
function PromotionRoutes() {
  const ends: { y: number; glyph: IconName }[] = [
    { y: 30, glyph: 'checklist' },
    { y: 70, glyph: 'widget' },
    { y: 110, glyph: 'notebook' },
    { y: 150, glyph: 'document-text' },
  ];
  return (
    <>
      {/* The Lab, the experiment inside it. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={44} y={62} w={52} h={56} rx={4} className={styles.frame} />
      <Focus x={70} y={90} glyph="stars" size={12} />
      {/* The route out, branching four ways. */}
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <path
        className={styles.line}
        d="M110,90 L150,90 M150,90 L150,36 A6,6 0 0 1 156,30 L190,30 M150,76 A6,6 0 0 1 156,70 L190,70 M150,104 A6,6 0 0 0 156,110 L190,110 M150,90 L150,144 A6,6 0 0 0 156,150 L190,150"
      />
      {ends.map(({ y, glyph }) => (
        <g key={y}>
          <circle className={styles.node} cx={190} cy={y} r="2.5" />
          <Rect x={190} y={y - 12} w={100} h={24} rx={4} className={styles.frame} />
          <Glyph name={glyph} cx={206} cy={y} size={12} className={styles.glyph} />
          <Copy x={220} y={y} w={y === 70 ? 40 : 52} quiet />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Matter Design System: A free Figma design system we made and published. Colours, spacing and other values are named for their purpose, and components are built from smaller parts. */
  'wyg-future-interfaces-lab-matter-design-system': MatterLibrary,
  /* AI Design Audit Agent: Tests how much of a first-pass design review AI can take on, with what it observed kept apart from what it means and what to fix first. */
  'wyg-future-interfaces-lab-ai-design-audit-agent': AuditAgentBins,
  /* UI Pattern Vision Labelling Tool: A labelling tool that tests whether interface patterns can be described in a form designers recognise and machines can work with. */
  'wyg-future-interfaces-lab-ui-pattern-vision-labelling-tool': PatternOneTag,
  /* Landing Page Audit Programme: A practice programme for critiquing landing pages: less personal preference, more about what the page shows, what that costs and what to change. */
  'wyg-future-interfaces-lab-landing-page-audit-programme': LandingMarginNotes,
  /* When a Lab experiment becomes everyday studio practice: When something keeps proving useful, it moves out of the Lab. A method joins How we work, a public aid becomes one of our tools, a lasting definition goes into the glossary, and work for a client becomes a case study. */
  'wyg-future-interfaces-lab-promotion': PromotionRoutes,
};
