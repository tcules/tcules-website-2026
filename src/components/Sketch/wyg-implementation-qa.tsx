import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The one arrowhead pointing left, in the quiet ink: a route that is a step back. */
function QuietArrowLeft({ x, y }: { x: number; y: number }) {
  return <path className={styles.quietMark} d={`M${x},${y} L${x + 7},${y - 4} L${x + 7},${y + 4} Z`} />;
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The build checked screen by screen: the design held against the build, one screen of many, and the
 * one part that drifted off its place found (its ghost where the design puts it, the built part lit).
 */
function BuildChecked() {
  return (
    <>
      {/* The design. */}
      <Rect x={30} y={44} w={80} h={96} rx={8} className={styles.frameQuiet} />
      <Copy x={42} y={62} w={36} quiet />
      <Rect x={42} y={74} w={48} h={20} className={styles.tile} />
      <Copy x={42} y={110} w={52} quiet />
      <Copy x={42} y={122} w={36} quiet />
      <Hop x1={110} x2={170} y={90} />
      {/* The build, screen after screen. */}
      <Rect x={178} y={36} w={104} h={96} rx={8} className={styles.frameQuiet} />
      <Rect x={174} y={40} w={104} h={96} rx={8} className={styles.frameQuiet} />
      <Rect x={170} y={44} w={104} h={96} rx={8} className={styles.frame} />
      <Copy x={182} y={62} w={36} quiet />
      {/* Where the design puts it, and where it was built. */}
      <Rect x={182} y={72} w={48} h={20} className={styles.trailFrame} />
      <Rect x={206} y={96} w={60} h={32} rx={10} className={styles.halo} />
      <Rect x={212} y={102} w={48} h={20} className={styles.region} />
    </>
  );
}

/**
 * Every difference sorted: the loose pile of differences routed into one board, each typed (a defect,
 * a justified change, a missing state, an open question) and each with its owner.
 */
function DifferencesSorted() {
  const widths = [44, 28, 52, 36, 48, 24, 40];
  const rows: { y: number; type: ReactNode }[] = [
    { y: 51, type: <C cx={188} cy={51} glyph="danger-triangle" /> },
    { y: 77, type: <C cx={188} cy={77} glyph="check-circle" /> },
    { y: 103, type: <Hatched x={180} y={95} w={16} h={16} /> },
    { y: 129, type: <C cx={188} cy={129} glyph="question-circle" /> },
  ];
  return (
    <>
      {/* The pile, nothing in order yet. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      {widths.map((w, i) => (
        <Copy key={i} x={42 + ((i * 7) % 3) * 6} y={54 + i * 12} w={w * 0.9} quiet />
      ))}
      <Hop x1={110} x2={170} y={90} />
      {/* The board: type, the difference, its owner. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      {rows.map(({ y, type }) => (
        <g key={y}>
          {type}
          <Copy x={206} y={y} w={40} />
          <Glyph name="user" cx={270} cy={y} size={12} className={styles.glyph} />
        </g>
      ))}
    </>
  );
}

/**
 * A fix list engineers can act on: one finding written whole (what was expected, what happened, the
 * steps to reproduce, the user it hurts), routed to the engineer who owns it.
 */
function FixList() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      {/* Expected, then what happened. */}
      <Glyph name="check-circle" cx={50} cy={50} size={12} className={styles.glyphQuiet} />
      <Copy x={64} y={50} w={60} />
      <Glyph name="danger-triangle" cx={50} cy={76} size={12} className={styles.glyph} />
      <Copy x={64} y={76} w={80} />
      {/* The steps to reproduce it. */}
      <path className={styles.hair} d="M50,102 L98,102" />
      {[50, 74, 98].map((x) => (
        <circle key={x} className={styles.frame} cx={x} cy={102} r="4" />
      ))}
      <Copy x={112} y={102} w={44} quiet />
      {/* Why it matters to the people using it. */}
      <Glyph name="user" cx={50} cy={128} size={12} className={styles.glyphQuiet} />
      <Copy x={64} y={128} w={52} quiet />
      <Hop x1={180} x2={220} y={90} />
      {/* Its owner, who acts on it. */}
      <Rect x={220} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={250} y={90} glyph="code" size={12} />
    </>
  );
}

/**
 * Retests until it closes: the owner's fix goes into the build, what still fails comes back to them,
 * and it closes on the build's tick.
 */
function Retests() {
  return (
    <>
      {/* The owner. */}
      <Rect x={30} y={40} w={40} h={100} rx={8} className={styles.frame} />
      <Glyph name="user" cx={50} cy={90} size={22} className={styles.glyph} />
      {/* The fix, into the build (lit); what still fails, back to its owner (grey), the failure its reason. */}
      <Hop x1={70} x2={130} y={60} />
      <path className={styles.copyQuiet} d="M130,120 L112,120 M88,120 L77,120" />
      <QuietArrowLeft x={70} y={120} />
      <Glyph name="danger-triangle" cx={100} cy={120} size={12} className={styles.glyphQuiet} />
      {/* The build. */}
      <Rect x={130} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={142} y={58} w={36} quiet />
      <Rect x={142} y={70} w={56} h={20} className={styles.tile} />
      <Copy x={142} y={106} w={48} quiet />
      <Copy x={142} y={118} w={32} quiet />
      {/* It closes: the tick, framed as the fix list's owner is. */}
      <Hop x1={210} x2={230} y={90} />
      <Rect x={230} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={260} y={90} glyph="check-circle" size={13} />
    </>
  );
}

/**
 * Fixes, if you want them: the findings take one of two ways, corrected in your code by our design
 * engineers (the route that lands), or handed to your team (the way left open).
 */
function FixesIfYouWant() {
  return (
    <>
      {/* The findings. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      {[60, 84, 108].map((y) => (
        <g key={y}>
          <Glyph name="danger-triangle" cx={46} cy={y} size={11} className={styles.glyphQuiet} />
          <Copy x={58} y={y} w={36} quiet />
        </g>
      ))}
      {/* The fork. */}
      <path className={styles.line} d="M110,90 L124,90 A6,6 0 0 0 130,84 L130,56 A6,6 0 0 1 136,50 L163,50" />
      <path className={styles.trail} d="M124,90 A6,6 0 0 1 130,96 L130,124 A6,6 0 0 0 136,130 L167,130" />
      <path className={styles.solid} d="M170,50 L163,46 L163,54 Z" />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      {/* Fixed in your code: the corrected line lit. */}
      <Rect x={170} y={30} w={120} h={50} rx={8} className={styles.frame} />
      <Copy x={184} y={46} w={56} quiet />
      <path className={styles.line} d="M184,56 L260,56" />
      <Copy x={184} y={66} w={44} quiet />
      {/* Or handed to your team. */}
      <Rect x={170} y={100} w={120} h={50} rx={8} className={styles.frame} />
      <circle className={styles.nodeOpen} cx="170" cy="130" r="3" />
      <C cx={196} cy={125} glyph="users-group-rounded" />
      <Copy x={214} y={121} w={52} />
      <Copy x={214} y={131} w={36} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/**
 * Design engineers who know why the design is the way it is (lit), and the account lead who plans the
 * order of checks; the design engineers are the team's core, routed in.
 */
function TeamImplementationQa() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={40} />
      <C cx={150} cy={114} glyph="checklist" />
      <Copy x={90} y={120} w={28} quiet />
      {/* The design engineers, more than one. */}
      <Rect x={220} y={72} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={90} glyph="code" />
      <Copy x={250} y={90} w={26} quiet />
      <Hop x1={216} x2={180} y={90} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/**
 * The agreed designs and rules, a test environment, the release date and the unsure areas, and the
 * person who makes the product calls (lit), all routed into our check.
 */
function NeedsImplementationQa() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {/* The agreed designs and their rules. */}
      <Rect x={58} y={40} w={28} h={20} rx={4} className={styles.frameQuiet} />
      <Rect x={54} y={44} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={68} cy={54} size={12} className={styles.glyph} />
      <C cx={104} cy={52} glyph="ruler-pen" />
      {/* A test environment, the release date, the areas least sure of. */}
      <C cx={52} cy={90} glyph="server" />
      <C cx={80} cy={90} glyph="calendar" />
      <C cx={108} cy={90} glyph="danger-triangle" />
      {/* Someone who can make the product calls. */}
      <Focus x={80} y={130} glyph="user" size={12} />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.node} cx={130} cy={y} r="2.5" />
      ))}
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={206} y={58} w={48} />
      <Copy x={206} y={70} w={68} quiet />
      <Hatched x={206} y={86} w={68} h={40} />
    </>
  );
}

/* ── Where our part stops ───────────────────────────────────────────────────────── */

/** What stays theirs, one row on their panel: its chips, then a heading line and a quiet one. */
function Theirs({ cy, glyphs }: { cy: number; glyphs: readonly IconName[] }) {
  const x = 236 + 20 * (glyphs.length - 1);
  const w = 280 - x;
  return (
    <>
      {glyphs.map((glyph, i) => (
        <C key={glyph} cx={216 + i * 20} cy={cy} glyph={glyph} />
      ))}
      <Copy x={x} y={cy - 4} w={w} />
      <Copy x={x} y={cy + 4} w={Math.round(w * 0.7)} quiet />
    </>
  );
}

/**
 * Our findings, handed over and checked; who fixes what, and the product calls on open questions, stay
 * on their panel. No route enters it: the gap is the boundary.
 */
function StopsImplementationQa() {
  return (
    <>
      {/* The findings, our last piece. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      {[66, 90, 114].map((y) => (
        <g key={y}>
          <Glyph name="danger-triangle" cx={46} cy={y} size={11} className={styles.glyphQuiet} />
          <Copy x={58} y={y} w={38} quiet />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={70} glyphs={['users-group-rounded', 'code']} />
      <Theirs cy={110} glyphs={['question-circle', 'user']} />
    </>
  );
}

/**
 * /services/design-engineering/implementation-qa · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The build checked screen by screen.: A Figma vs build comparison of layout and components, including your design system. Then the loading, empty, error and disabled states, each */
  'wyg-implementation-qa-build-checked-screen-screen': BuildChecked,
  /* Every difference sorted.: Each one typed as a defect, a justified change, a missing state or an open question, with a named owner. */
  'wyg-implementation-qa-every-difference-sorted': DifferencesSorted,
  /* A fix list engineers can act on.: Each finding states what was expected, what happened, how to reproduce it, why it matters to users, and who owns it. */
  'wyg-implementation-qa-fix-list-engineers-can': FixList,
  /* Retests until it closes.: Each fix is checked in the build, and anything still failing goes back to its owner with the new result. */
  'wyg-implementation-qa-retests-until-it-closes': Retests,
  /* Fixes, if you want them.: Our design engineers can correct interface issues in your code, or hand every finding to your team. */
  'wyg-implementation-qa-fixes-if-you-want': FixesIfYouWant,
  /* Who does the work: Design engineers who know why the design is the way it is, so a finding explains the reason as well as the bug. An account lead plans the or */
  'team-implementation-qa': TeamImplementationQa,
  /* What we need from you: The agreed designs and rules for this release, a test environment, the release date, the areas you are least sure about, and someone who can */
  'needs-implementation-qa': NeedsImplementationQa,
  /* Where our part stops: You choose who fixes what, and product calls on open questions stay with your product owner. When the same mismatches return release after r */
  'stops-implementation-qa': StopsImplementationQa,
};
