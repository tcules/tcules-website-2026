import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The one arrowhead pointing down, tip at (x, y). */
function ArrowDown({ x, y }: { x: number; y: number }) {
  return <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />;
}

/** Our team frame: the senior designer who leads (lit), and the second person beside them. */
function Crew() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={44} />
      <Copy x={90} y={72} w={28} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={44} />
      <Copy x={90} y={120} w={28} quiet />
    </>
  );
}

/** A screen, 100 × 120 from x, its chip saying what it is, a heading, copy and one block. */
function Screen({ x, glyph, children }: { x: number; glyph: IconName; children: ReactNode }) {
  return (
    <>
      <Rect x={x} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Chip x={x + 8} y={38} glyph={glyph} />
      <Copy x={x + 32} y={46} w={36} quiet />
      <Copy x={x + 12} y={66} w={60} />
      {children}
      <Copy x={x + 12} y={116} w={48} quiet />
      <Copy x={x + 12} y={128} w={36} quiet />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** IDEA: the approved design beside what was built, the gap between them traced to what caused it. */
function EveryGapSideBySide() {
  return (
    <>
      <Screen x={30} glyph="ruler-pen">
        <Rect x={42} y={80} w={76} h={20} className={styles.tile} />
      </Screen>
      <Screen x={190} glyph="code">
        {/* Built short of the design: the approved extent dashed behind it. */}
        <Rect x={202} y={80} w={76} h={20} className={styles.trailFrame} />
        <Rect x={202} y={80} w={48} h={20} className={styles.tile} />
      </Screen>
      {/* The cause, between the two. */}
      <path className={styles.line} d="M130,90 L142,90 M178,90 L190,90" />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      <circle className={styles.node} cx="190" cy="90" r="2.5" />
      <Focus x={160} y={90} glyph="document-text" size={12} />
    </>
  );
}

/** IDEA: the fixes ranked by how much users feel them, the most felt on top and lit. */
function FixPlan() {
  const rows = [
    [54, 72],
    [90, 48],
    [126, 24],
  ] as const;
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Rect x={56} y={36} w={208} h={36} rx={12} className={styles.halo} />
      {rows.map(([cy, felt], i) => {
        const top = i === 0;
        return (
          <g key={cy}>
            <Rect x={62} y={cy - 12} w={196} h={24} className={top ? styles.region : styles.tile} />
            {top ? (
              <path className={styles.regionCopy} d={`M74,${cy} L134,${cy}`} />
            ) : (
              <Copy x={74} y={cy} w={[60, 48, 54][i] ?? 48} quiet />
            )}
            <Glyph
              name="user"
              cx={162}
              cy={cy}
              size={12}
              className={top ? styles.glyphAccent : styles.glyphQuiet}
            />
            <Rect
              x={174}
              y={cy - 4}
              w={felt}
              h={8}
              className={top ? styles.solid : styles.tile}
            />
          </g>
        );
      })}
    </>
  );
}

/** IDEA: design goes to the build once; the old loop of gaps coming back is locked shut. */
function StopGapsComingBack() {
  return (
    <>
      {(
        [
          [30, 'ruler-pen'],
          [210, 'code'],
        ] as const
      ).map(([x, glyph]) => (
        <g key={x}>
          <Rect x={x} y={30} w={80} h={80} rx={8} className={styles.frame} />
          <Chip x={x + 8} y={38} glyph={glyph} />
          <Copy x={x + 32} y={46} w={28} quiet />
          <Rect x={x + 12} y={62} w={56} h={18} className={styles.tile} />
          <Copy x={x + 12} y={94} w={40} quiet />
        </g>
      ))}
      <Hop x1={110} x2={210} y={70} />
      {/* The way gaps used to come back, now closed. */}
      <path className={styles.trail} d="M250,110 L250,124 A6,6 0 0 1 244,130 L178,130" />
      <path className={styles.trail} d="M142,130 L76,130 A6,6 0 0 1 70,124 L70,117" />
      <path className={styles.quietMark} d="M70,110 L66,117 L74,117 Z" />
      <Focus x={160} y={130} glyph="lock" size={12} />
    </>
  );
}

/** IDEA: a good change made in code is written down and carried back so the design catches up. */
function DeveloperChangesWorthKeeping() {
  return (
    <>
      {/* The code, with the change worth keeping. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Chip x={38} y={48} glyph="code" />
      <Copy x={62} y={56} w={28} quiet />
      <Copy x={42} y={70} w={36} quiet />
      <Rect x={56} y={80} w={46} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M62,90 L94,90" />
      <Copy x={42} y={112} w={28} quiet />
      <Copy x={42} y={124} w={40} quiet />
      <Hop x1={110} x2={150} y={90} />
      {/* Written down. */}
      <Rect x={150} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="notebook" cx={170} cy={90} size={20} className={styles.glyph} />
      <Hop x1={190} x2={230} y={90} />
      {/* The design, its place for the change still to catch up. */}
      <Rect x={230} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Chip x={238} y={48} glyph="ruler-pen" />
      <Copy x={242} y={70} w={36} />
      <Hatched x={242} y={80} w={36} h={20} />
      <Copy x={242} y={112} w={28} quiet />
      <Copy x={242} y={124} w={20} quiet />
    </>
  );
}

/* ── Who does the work · Where our part stops ─────────────────────────────────── */

/** IDEA: the senior designer leads, and a design engineer reads the Figma file and the code together. */
function Team() {
  return (
    <>
      <Crew />
      <path
        className={styles.line}
        d="M150,90 L170,90 M170,90 L170,56 A6,6 0 0 1 176,50 L193,50 M170,90 L170,124 A6,6 0 0 0 176,130 L193,130"
      />
      <ArrowRight x={200} y={50} />
      <ArrowRight x={200} y={130} />
      <circle className={styles.node} cx="150" cy="90" r="2.5" />
      <circle className={styles.node} cx="170" cy="90" r="3.5" />
      {(
        [
          [50, 'ruler-pen'],
          [130, 'code'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <Rect x={200} y={cy - 20} w={90} h={40} rx={8} className={styles.frame} />
          <C cx={218} cy={cy} glyph={glyph} />
          <Copy x={234} y={cy - 4} w={40} />
          <Copy x={234} y={cy + 6} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/** IDEA: our audit ends at our check; their code is untouched, and who fixes it is their call. */
function Stops() {
  return (
    <>
      {/* Our last piece: design and code, compared. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M70,50 L70,130" />
      {[38, 78].map((x) => (
        <g key={x}>
          <Copy x={x} y={68} w={22} />
          <Rect x={x} y={80} w={24} h={14} className={styles.tile} />
          <Copy x={x} y={108} w={18} quiet />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: the code, unchanged; who fixes it. No route enters. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <C cx={216} cy={70} glyph="code" />
      <C cx={236} cy={70} glyph="lock" />
      <Copy x={256} y={66} w={24} />
      <Copy x={256} y={74} w={16} quiet />
      <C cx={216} cy={110} glyph="user" />
      <C cx={236} cy={110} glyph="flag" />
      <Copy x={256} y={106} w={24} />
      <Copy x={256} y={114} w={16} quiet />
    </>
  );
}

/* ── How it runs ──────────────────────────────────────────────────────────────── */

/**
 * IDEA: design, handoff, code and the live screen side by side; a gap seen on the live screen is
 * traced back and sorted under the stage where it began (here, the handoff).
 */
function Method() {
  const stages = [
    [70, 'ruler-pen', 1],
    [130, 'document-text', 0],
    [190, 'code', 2],
    [250, 'monitor', 0],
  ] as const;
  return (
    <>
      {stages.map(([cx, glyph, gaps]) => (
        <g key={cx}>
          <Rect x={cx - 20} y={30} w={40} h={60} rx={8} className={styles.frame} />
          <C cx={cx} cy={46} glyph={glyph} />
          <Copy x={cx - 12} y={66} w={24} />
          <Copy x={cx - 12} y={76} w={16} quiet />
          {cx === 130 ? null : (
            <>
              <Rect x={cx - 16} y={122} w={32} h={20} className={styles.tile} />
              {Array.from({ length: gaps }, (_, i) => (
                <circle
                  key={i}
                  className={styles.soft}
                  cx={cx - (gaps - 1) * 5 + i * 10}
                  cy={132}
                  r={3}
                />
              ))}
            </>
          )}
        </g>
      ))}
      {/* The gap seen live, sorted to where it began. */}
      <Rect x={108} y={116} w={44} h={32} rx={10} className={styles.halo} />
      <Rect x={114} y={122} w={32} h={20} className={styles.solid} />
      <circle className={styles.glyphOn} cx={130} cy={132} r={3} />
      <path
        className={styles.line}
        d="M250,90 L250,104 A6,6 0 0 1 244,110 L136,110 A6,6 0 0 0 130,116"
      />
      <ArrowDown x={130} y={122} />
      <circle className={styles.node} cx="250" cy="90" r="2.5" />
    </>
  );
}

/**
 * /audits/design-to-code-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Every gap, side by side. Shown against the approved design, with what caused it. */
  'wyg-design-to-code-audit-every-gap-side-by-side': EveryGapSideBySide,
  /* A fix plan. Ordered by what users feel most. */
  'wyg-design-to-code-audit-fix-plan': FixPlan,
  /* Stop gaps coming back. What to change in the handoff, shared components or sign-off. */
  'wyg-design-to-code-audit-stop-gaps-coming-back': StopGapsComingBack,
  /* Developer changes worth keeping. Sensible changes made in the build, recorded so the design can catch up. */
  'wyg-design-to-code-audit-developer-changes-worth-keeping': DeveloperChangesWorthKeeping,
  /* Who does the work. A senior designer leads; a design engineer reads your Figma and code side by side. */
  'team-design-to-code-audit': Team,
  /* Where our part stops. The audit changes nothing in your code; who fixes it is your decision. */
  'stops-design-to-code-audit': Stops,
  /* The method's one figure, beside the numbered steps. How a design-to-code audit runs: Agree the screen and the price (one call, then its approved design, read access to its code and the live product). Check the design and the handoff: what the design and specs said, and what they left to guesswork. Check the code and the live screen: component settings, colour and spacing, permissions, keyboard use, errors and small screens. Sort every gap by cause, including how it was signed off. FIGURE: design, handoff, code and live screen compared side by side, each gap sorted by where it began. */
  'method-design-to-code-audit': Method,
};
