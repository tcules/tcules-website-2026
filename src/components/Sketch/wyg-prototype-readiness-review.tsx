import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Team } from './l1-terms';
import { ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The flow from sign-in down to payment, each part marked: sign-in proven (lit, ticked), the middle
 * step only assumed (dashed, a question), payment missing (hatched, not built).
 */
function WhatsProven() {
  const parts: [number, IconName][] = [
    [50, 'key'],
    [90, 'cart'],
    [130, 'wallet'],
  ];
  return (
    <>
      <path className={styles.rule} d="M60,64 L60,76 M60,104 L60,116" />
      {parts.map(([y, glyph]) => (
        <g key={y}>
          <Rect x={40} y={y - 14} w={40} h={28} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={60} cy={y} size={14} className={styles.glyph} />
        </g>
      ))}
      <path className={styles.line} d="M80,50 L100,50" />
      <circle className={styles.node} cx={80} cy={50} r="2.5" />
      <Rect x={100} y={36} w={180} h={28} className={styles.region} />
      <path className={styles.regionCopy} d="M114,50 L210,50" />
      <Glyph name="check-circle" cx={262} cy={50} size={14} className={styles.glyphAccent} />
      <path className={styles.trail} d="M80,90 L100,90" />
      <Rect x={100} y={76} w={180} h={28} className={styles.trailFrame} />
      <Copy x={114} y={90} w={76} quiet />
      <Glyph name="question-circle" cx={262} cy={90} size={14} className={styles.glyphQuiet} />
      <path className={styles.trail} d="M80,130 L100,130" />
      <Hatched x={100} y={116} w={180} h={28} />
    </>
  );
}

/** The customer, and the one spot in the flow where they stalled, changed so they get through. */
function FixesCustomersNotice() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={90} size={24} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={146} y={48} w={48} quiet />
      <Rect x={146} y={60} w={128} h={18} className={styles.tile} />
      <Copy x={154} y={69} w={44} quiet />
      <Rect x={146} y={84} w={128} h={18} className={styles.tile} />
      <Copy x={154} y={93} w={60} quiet />
      <Rect x={140} y={110} w={72} h={30} rx={10} className={styles.halo} />
      <Rect x={146} y={116} w={60} h={18} rx={9} className={styles.solid} />
      <Cursor x={194} y={126} />
    </>
  );
}

/** The code read through: the part safe to build on carried out as the base the next work stands on. */
function CodeWorthKeeping() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M52,30 L52,150" />
      {(
        [
          [46, 62],
          [58, 48],
          [70, 70],
        ] as const
      ).map(([y, w]) => (
        <Copy key={y} x={62} y={y} w={w} quiet />
      ))}
      <Rect x={58} y={80} w={84} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M66,90 L124,90" />
      {(
        [
          [112, 56],
          [124, 72],
          [136, 44],
        ] as const
      ).map(([y, w]) => (
        <Copy key={y} x={62} y={y} w={w} quiet />
      ))}
      {/* Carried out to the base; what gets built next stands on it, not built yet. */}
      <path
        className={styles.line}
        d="M150,90 L164,90 A6,6 0 0 1 170,96 L170,124 A6,6 0 0 0 176,130 L183,130"
      />
      <ArrowRight x={190} y={130} />
      <circle className={styles.node} cx={150} cy={90} r="2.5" />
      <Hatched x={198} y={50} w={84} h={62} />
      <Rect x={190} y={120} w={100} h={20} className={styles.region} />
      <Glyph name="shield-check" cx={206} cy={130} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M220,130 L272,130" />
    </>
  );
}

/** The work laid out in order, one piece after another, ending on the date you can set. */
function WorkBeforeLaunch() {
  return (
    <>
      <Rect x={40} y={42} w={80} h={16} rx={8} className={styles.tile} />
      <Rect x={100} y={82} w={70} h={16} rx={8} className={styles.tile} />
      <Rect x={150} y={122} w={60} h={16} rx={8} className={styles.tile} />
      <Copy x={52} y={50} w={40} quiet />
      <Copy x={112} y={90} w={32} quiet />
      <Copy x={162} y={130} w={24} quiet />
      <path className={styles.trail} d="M120,50 L124,50 A6,6 0 0 1 130,56 L130,82" />
      <path className={styles.trail} d="M170,90 L174,90 A6,6 0 0 1 180,96 L180,122" />
      <Hop x1={210} x2={250} y={130} />
      <Focus x={270} y={130} glyph="calendar" size={12} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer leads; an engineer is always in, checking how the app holds up under real use. */
function TeamReadiness() {
  return <Team roles={[{ glyph: 'server', core: true }]} />;
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

/** The review, every part marked, handed over: launch timing and the specialist sign-offs are theirs. */
function StopsReadiness() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      {[82, 98, 114].map((y, i) => (
        <g key={y}>
          <Glyph
            name={i === 2 ? 'question-circle' : 'check-circle'}
            cx={48}
            cy={y}
            size={10}
            className={styles.glyphQuiet}
          />
          <Copy x={58} y={y} w={[36, 28, 32][i] ?? 30} quiet />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['calendar']} />
      <Theirs cy={90} glyphs={['shield-check', 'clipboard-check']} />
      <Theirs cy={130} glyphs={['user']} />
    </>
  );
}

/* ── How it runs ────────────────────────────────────────────────────────────────── */

/**
 * The one flow walked as each kind of user, lane by lane through the same steps: two get through, the
 * third hits the failure a demo skips, lit where it breaks.
 */
function MethodReadiness() {
  const steps = [110, 170, 230];
  const lanes: [number, IconName, boolean][] = [
    [50, 'user', true],
    [90, 'users-group-rounded', true],
    [130, 'key', false],
  ];
  return (
    <>
      {lanes.map(([y, glyph, through]) => (
        <g key={y}>
          <Rect x={30} y={y - 14} w={40} h={28} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={50} cy={y} size={16} className={styles.glyph} />
          {through ? (
            <>
              <path className={styles.line} d={`M70,${y} L263,${y}`} />
              <ArrowRight x={270} y={y} />
            </>
          ) : (
            <path className={styles.line} d={`M70,${y} L204,${y}`} />
          )}
          <circle className={styles.node} cx={70} cy={y} r="2.5" />
          {steps.slice(0, through ? 3 : 2).map((x) => (
            <circle key={x} className={styles.nodeOpen} cx={x} cy={y} r="5" />
          ))}
        </g>
      ))}
      <Focus x={230} y={130} glyph="danger-triangle" size={12} />
    </>
  );
}

/**
 * /audits/prototype-readiness-review · What you get, and the method's figure (the audits' 3 Nov 2026
 * outline). One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What's proven, what isn't. Every key part marked proven, assumed or missing, from sign-in to payments. */
  'wyg-prototype-readiness-review-whats-proven-what-isnt': WhatsProven,
  /* Fixes customers will notice. Where people get stuck in the flow, and what to change. */
  'wyg-prototype-readiness-review-fixes-customers-will-notice': FixesCustomersNotice,
  /* Code worth keeping. If you add a reading of the code, which parts are safe to build on. */
  'wyg-prototype-readiness-review-code-worth-keeping': CodeWorthKeeping,
  /* The work before launch. In order, so whoever builds it can plan and you can set a date. */
  'wyg-prototype-readiness-review-work-before-launch': WorkBeforeLaunch,
  /* Who does the work. A senior designer leads; an engineer checks how the app holds up under real use. */
  'team-prototype-readiness-review': TeamReadiness,
  /* Where our part stops. Launch timing is yours; security and compliance sign-off goes to a qualified specialist, yours or hired. */
  'stops-prototype-readiness-review': StopsReadiness,
  /* The method's one figure, beside the numbered steps. How a prototype readiness review runs: Agree the flow and the price (one call to pick the flow, such as sign-up to first payment, then a link and test logins). Use it as each of your users. Try what a demo skips: failed payments, double taps, locked-out users, two people editing one record. Mark every part, order the work. FIGURE: the one flow walked as each kind of user, the demo-skipped failures lit where they break, each part marked and the work ordered. */
  'method-prototype-readiness-review': MethodReadiness,
};
