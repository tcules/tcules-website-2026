import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** The question, lit on its card, routed to the page where what counts as an answer is written down. */
function QuestionAgreedFirst() {
  return (
    <>
      <Rect x={50} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Focus x={80} y={80} glyph="question-circle" size={13} />
      <Copy x={64} y={112} w={32} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={50} w={48} />
      <Copy x={166} y={62} w={72} quiet />
      {[90, 120].map((y) => (
        <g key={y}>
          <Glyph name="check-circle" cx={172} cy={y} size={12} className={styles.glyph} />
          <Copy x={186} y={y - 4} w={60} />
          <Copy x={186} y={y + 4} w={40} quiet />
        </g>
      ))}
    </>
  );
}

/** The cases that break an idea, built first with the error lit; the happy path still to come. */
function HardCasesBeforeHappy() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {/* Loading. */}
      <Rect x={46} y={46} w={56} h={36} rx={4} className={styles.frameQuiet} />
      <Glyph name="refresh" cx={74} cy={64} size={14} className={styles.glyphQuiet} />
      {/* The error: the case most likely to break it, lit. */}
      <Rect x={112} y={40} w={68} h={48} rx={10} className={styles.halo} />
      <Rect x={118} y={46} w={56} h={36} rx={4} className={styles.solid} />
      <Glyph name="danger-triangle" cx={146} cy={64} size={16} className={styles.glyphOn} />
      {/* Long content. */}
      <Rect x={46} y={98} w={56} h={36} rx={4} className={styles.frameQuiet} />
      {[106, 114, 122].map((y, i) => (
        <Copy key={y} x={54} y={y + 2} w={[40, 32, 40][i] ?? 32} quiet />
      ))}
      {/* Different user roles. */}
      <Rect x={118} y={98} w={56} h={36} rx={4} className={styles.frameQuiet} />
      <Glyph name="users-group-rounded" cx={146} cy={116} size={16} className={styles.glyphQuiet} />
      {/* The happy path, after. */}
      <path className={styles.trail} d="M193,90 L223,90" />
      <path className={styles.quietMark} d="M230,90 L223,86 L223,94 Z" />
      <circle className={styles.frameQuiet} cx={190} cy={90} r={3} />
      <Hatched x={230} y={60} w={60} h={60} />
      <circle className={styles.tile} cx={260} cy={90} r={12} />
      <Glyph name="check-circle" cx={260} cy={90} size={14} className={styles.glyphQuiet} />
    </>
  );
}

/** Your own records, lit, feed the prototype's table; sample data shaped like them stands in, dashed. */
function RealOrRepresentativeData() {
  return (
    <>
      <Focus x={70} y={70} glyph="database" size={13} />
      <Hop x1={90} x2={150} y={70} />
      <Rect x={50} y={96} w={40} h={28} rx={4} className={styles.trailFrame} />
      <Glyph name="database" cx={70} cy={110} size={13} className={styles.glyphQuiet} />
      <path className={styles.trail} d="M90,110 L150,110" />
      <Rect x={150} y={40} w={130} h={100} rx={8} className={styles.frame} />
      <Copy x={166} y={58} w={40} quiet />
      {[78, 94, 110, 126].map((y, i) =>
        [166, 202, 238].map((x) => (
          <Copy key={`${x}-${y}`} x={x} y={y} w={26} quiet={i === 0} />
        )),
      )}
    </>
  );
}

/** The prototype open in the browser, its action pressed, with your team, a user and us in front of it. */
function WorkingSession() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={92} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M70,46 L250,46" />
      <Copy x={86} y={62} w={48} quiet />
      <Copy x={86} y={76} w={96} />
      <Rect x={86} y={88} w={40} h={14} rx={7} className={styles.solid} />
      <Cursor x={112} y={95} />
      <Rect x={190} y={58} w={44} h={46} rx={4} className={styles.tile} />
      {(
        [
          [120, 'users-group-rounded'],
          [160, 'user'],
          [200, 'user'],
        ] as const
      ).map(([cx, glyph]) => (
        <Glyph key={cx} name={glyph} cx={cx} cy={140} size={20} className={styles.glyph} />
      ))}
    </>
  );
}

/** A quiet choice in the write-up's pick of three: the chip ground, its glyph at 12 so it reads at 1x. */
const Choice = ({ cx, glyph }: { cx: number; glyph: IconName }) => (
  <>
    <rect className={styles.chip} x={cx - 8} y={120} width="16" height="16" rx="4" />
    <Glyph name={glyph} cx={cx} cy={128} size={12} className={styles.glyphAccent} />
  </>
);

/**
 * A short page of what was learned and what is open, ending in one recommendation of three (change, build
 * lit, stop), handed on to someone who missed the session.
 */
function ShortWriteup() {
  return (
    <>
      <Rect x={50} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={66} y={48} w={48} />
      {(
        [
          [70, 'check-circle', styles.glyph],
          [92, 'question-circle', styles.glyphQuiet],
        ] as const
      ).map(([y, glyph, cls]) => (
        <g key={y}>
          <Glyph name={glyph} cx={72} cy={y} size={12} className={cls} />
          <Copy x={86} y={y - 4} w={64} />
          <Copy x={86} y={y + 4} w={40} quiet />
        </g>
      ))}
      <path className={styles.rule} d="M50,104 L190,104" />
      {/* The pick of three: change, build (lit), stop. */}
      <Choice cx={80} glyph="ruler-pen" />
      <circle className={styles.halo} cx={110} cy={128} r={15} />
      <circle className={styles.solid} cx={110} cy={128} r={9} />
      <Glyph name="check-circle" cx={110} cy={128} size={11} className={styles.glyphOn} />
      <Choice cx={140} glyph="close-circle" />
      {/* Handed on to the reader who missed the session. */}
      <Hop x1={190} x2={230} y={90} />
      <Rect x={230} y={62} w={50} h={56} rx={8} className={styles.frame} />
      <Glyph name="user" cx={255} cy={80} size={18} className={styles.glyph} />
      <Copy x={243} y={102} w={24} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** Design engineers build it (lit), the account lead keeps it to its question, the product designer works beside. */
function TeamCodedPrototyping() {
  return (
    <>
      <Rect x={50} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Focus x={80} y={66} glyph="code" size={12} />
      <Copy x={110} y={62} w={60} />
      <Copy x={110} y={72} w={40} quiet />
      <Glyph name="user" cx={80} cy={114} size={18} className={styles.glyph} />
      <Copy x={110} y={110} w={60} />
      <Copy x={110} y={120} w={40} quiet />
      <Hop x1={230} x2={190} y={90} />
      <Rect x={230} y={62} w={50} h={56} rx={8} className={styles.frame} />
      <C cx={255} cy={80} glyph="ruler-pen" />
      <Copy x={243} y={102} w={24} quiet />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

const ROWS = [50, 90, 130] as const;

/**
 * The handover, "you to us": the question and what would change with its answer; the data, or the rules for
 * sample data (dashed); and an engineer who judges whether it can be built (lit). One trunk into our
 * frame, the work hatched until they arrive.
 */
function NeedsCodedPrototyping() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={56} cy={50} glyph="question-circle" />
      <Copy x={74} y={46} w={40} />
      <Copy x={74} y={54} w={28} quiet />
      <C cx={62} cy={90} glyph="database" />
      <Rect x={80} y={82} w={28} h={16} rx={4} className={styles.trailFrame} />
      <Copy x={88} y={90} w={12} quiet />
      <Focus x={66} y={130} glyph="user" size={12} />
      <C cx={104} cy={130} glyph="code" />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {ROWS.map((y) => (
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

/** What stays theirs, one row on their panel: its chip, then a heading line and a quiet one. */
function Theirs({ cy, glyph }: { cy: number; glyph: IconName }) {
  return (
    <>
      <C cx={216} cy={cy} glyph={glyph} />
      <Copy x={236} y={cy - 4} w={44} />
      <Copy x={236} y={cy + 4} w={30} quiet />
    </>
  );
}

/**
 * The boundary, "us to you": the prototype, routed to our check (the question answered); the security,
 * testing and monitoring real customers need stay on their side, no route entering it.
 */
function StopsCodedPrototyping() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M30,64 L110,64" />
      <Copy x={42} y={78} w={32} quiet />
      <Copy x={42} y={90} w={56} />
      <Rect x={42} y={104} w={36} h={12} rx={6} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="shield-check" />
      <Theirs cy={90} glyph="clipboard-check" />
      <Theirs cy={130} glyph="graph-up" />
    </>
  );
}

/**
 * /services/design-engineering/coded-prototyping · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The question, agreed first.: One sentence the prototype must answer, and what would count as an answer, written down before any code. */
  'wyg-coded-prototyping-question-agreed-first': QuestionAgreedFirst,
  /* The hard cases before the happy path.: Empty, loading, error, long content, dense data and different user roles, built first because they are most likely to break the idea. */
  'wyg-coded-prototyping-hard-cases-before-happy': HardCasesBeforeHappy,
  /* Real or representative data.: Your own records when access and privacy allow, or sample data shaped like them. */
  'wyg-coded-prototyping-real-or-representative-data': RealOrRepresentativeData,
  /* A working session.: Your team, and users where it helps, work through the prototype in the browser with us. */
  'wyg-coded-prototyping-working-session': WorkingSession,
  /* A short write-up.: What we learned, what is still open, and our recommendation to build it, change it or stop, with the reasons for anyone who missed the sessi */
  'wyg-coded-prototyping-short-writeup': ShortWriteup,
  /* Who does the work: Design engineers build the prototype, in HTML, CSS and JavaScript or in your own framework, such as React. The product designer who owns the */
  'team-coded-prototyping': TeamCodedPrototyping,
  /* What we need from you: The question, and what you would do differently depending on the answer. The data, or the rules for realistic sample data. And an engineer w */
  'needs-coded-prototyping': NeedsCodedPrototyping,
  /* Where our part stops: A prototype answers a question; it leaves out the security, testing and monitoring real customers need. If the answer is to build, Design to */
  'stops-coded-prototyping': StopsCodedPrototyping,
};
