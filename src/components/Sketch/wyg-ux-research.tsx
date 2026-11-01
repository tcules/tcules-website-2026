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

/** The question, lit at the top of one sheet, and under it what the team does on each answer. */
function QuestionWrittenDown() {
  return (
    <>
      <Rect x={80} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Focus x={112} y={62} glyph="question-circle" size={13} />
      <Copy x={144} y={58} w={72} />
      <Copy x={144} y={68} w={48} quiet />
      <path className={styles.rule} d="M96,90 L224,90" />
      <Glyph name="check-circle" cx={104} cy={108} size={14} className={styles.glyph} />
      <Copy x={120} y={108} w={64} />
      <Glyph name="close-circle" cx={104} cy={132} size={14} className={styles.glyph} />
      <Copy x={120} y={132} w={48} />
    </>
  );
}

/** What you already hold fills most of the plan; new research fills only the one gap they leave. */
function PlanStartsFromWhat() {
  const held: [number, number, IconName][] = [
    [78, 38, 'graph-up'],
    [166, 38, 'chat-round-dots'],
    [78, 94, 'document-text'],
  ];
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {held.map(([x, y, glyph]) => (
        <g key={glyph}>
          <Rect x={x} y={y} w={76} h={48} rx={4} className={styles.tile} />
          <C cx={x + 20} cy={y + 24} glyph={glyph} />
          <Copy x={x + 38} y={y + 24} w={26} quiet />
        </g>
      ))}
      {/* The gap: an empty slot, the only part new research fills. */}
      <Rect x={166} y={94} w={76} h={48} rx={4} className={styles.trailFrame} />
      <Focus x={204} y={118} glyph="user" size={12} />
    </>
  );
}

/** A person interviewed at their own screen, caught in the middle of a real task. */
function InterviewsObservation() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={70} cy={80} size={28} className={styles.glyph} />
      <C cx={70} cy={112} glyph="microphone" />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={146} y={46} w={40} quiet />
      <Rect x={146} y={60} w={128} h={20} rx={4} className={styles.tile} />
      <Glyph name="check-circle" cx={158} cy={70} size={12} className={styles.glyphQuiet} />
      <Copy x={172} y={70} w={48} quiet />
      <Rect x={146} y={88} w={128} h={20} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M158,98 L222,98" />
      <Rect x={146} y={116} w={128} h={20} rx={4} className={styles.tile} />
      <Copy x={158} y={126} w={40} quiet />
      <Cursor x={244} y={100} />
    </>
  );
}

/** What people say and what the analytics show, run into one finding that both confirm. */
function EverySourceChecked() {
  const bars: [number, number][] = [
    [228, 20],
    [242, 32],
    [256, 14],
    [270, 26],
  ];
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <C cx={50} cy={60} glyph="chat-round-dots" />
      <Copy x={42} y={86} w={52} />
      <Copy x={42} y={98} w={36} quiet />
      <Copy x={42} y={110} w={48} quiet />
      <Rect x={210} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <C cx={230} cy={60} glyph="graph-up" />
      {bars.map(([x, h]) => (
        <Rect key={x} x={x - 4} y={124 - h} w={8} h={h} rx={2} className={styles.soft} />
      ))}
      <Hop x1={110} x2={142} y={90} />
      <Hop x1={210} x2={178} y={90} />
      <Focus x={160} y={90} glyph="check-circle" size={13} />
    </>
  );
}

/** The readout, one of a stack, its finding routed to the one choice it points to. */
function ReadoutYouCanAct() {
  return (
    <>
      {/* The readout, with the synthesis, personas or maps behind it (stacked up and left, clear of the route). */}
      <Rect x={42} y={34} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={46} y={42} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={50} y={50} w={100} h={100} rx={8} className={styles.frame} />
      <C cx={70} cy={70} glyph="question-circle" />
      <Copy x={86} y={70} w={44} quiet />
      <Rect x={62} y={82} w={76} h={16} rx={4} className={styles.tile} />
      <Copy x={70} y={90} w={52} />
      <Copy x={62} y={114} w={60} quiet />
      <Copy x={62} y={128} w={44} quiet />
      <Hop x1={150} x2={190} y={90} />
      {/* The choices it points to: the one it lands on, lit. */}
      <Rect x={190} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Copy x={206} y={64} w={40} quiet />
      <Rect x={200} y={78} w={80} h={24} rx={12} className={styles.halo} />
      <Rect x={206} y={84} w={68} h={12} rx={6} className={styles.solid} />
      <Rect x={206} y={110} w={52} h={12} rx={6} className={styles.tile} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) leads and does the work with the account lead; the researcher is always in. */
function TeamUxResearch() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={90} glyph="microphone" />
      <Copy x={250} y={90} w={26} quiet />
      <Hop x1={216} x2={180} y={90} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The question and what hangs on it (lit); the analytics, tickets and studies you hold; access to users. */
function NeedsUxResearch() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={50} glyph="question-circle" size={12} />
      {(['graph-up', 'chat-round-dots', 'document-text'] as const).map((glyph, i) => (
        <C key={glyph} cx={52 + i * 28} cy={90} glyph={glyph} />
      ))}
      <C cx={80} cy={130} glyph="users-group-rounded" />
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

/** The findings and their choices, handed over: the product calls, the design work and the testing are past it. */
function StopsUxResearch() {
  const theirs: [number, IconName][] = [
    [50, 'flag'],
    [90, 'ruler-pen'],
    [130, 'widget'],
  ];
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="document-text" />
      <Copy x={42} y={86} w={48} />
      <Copy x={42} y={98} w={32} quiet />
      <Rect x={42} y={108} w={36} h={12} rx={6} className={styles.tile} />
      <Hop x1={110} x2={126} y={90} />
      <Rect x={126} y={64} w={48} h={52} rx={8} className={styles.frame} />
      <Focus x={150} y={90} glyph="check-circle" size={13} />
      <Hop x1={174} x2={200} y={90} />
      {/* Past our part: the product calls, the design work and the testing, dashed. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.trailFrame} />
      {theirs.map(([cy, glyph]) => (
        <g key={glyph}>
          <C cx={216} cy={cy} glyph={glyph} />
          <Copy x={236} y={cy - 4} w={44} />
          <Copy x={236} y={cy + 4} w={31} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /services/product-design/ux-research · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The question, written down.: What the research must answer, and what your team would do differently depending on the answer. */
  'wyg-ux-research-question-written-down': QuestionWrittenDown,
  /* A plan that starts from what you hold.: Analytics, support tickets and past studies come first. New research fills only the gaps they leave. */
  'wyg-ux-research-plan-starts-from-what': PlanStartsFromWhat,
  /* Interviews and observation.: Sessions with people in the middle of real tasks, at their desks or on their own screens, including the specialists and admins who are harde */
  'wyg-ux-research-interviews-observation': InterviewsObservation,
  /* Every source checked against the others.: Words against behaviour, interviews against analytics, so you learn how often a problem happens as well as why. */
  'wyg-ux-research-every-source-checked-against': EverySourceChecked,
  /* A readout you can act on.: Findings tied to your question and the choices they point to. Depending on the study, it also includes a research synthesis, personas, exper */
  'wyg-ux-research-readout-you-can-act': ReadoutYouCanAct,
  /* Who does the work: A senior designer leads the study and does the work, with a researcher for interviews and sessions and an account lead keeping it on track.  */
  'team-ux-research': TeamUxResearch,
  /* What we need from you: The question and what hangs on it; the analytics, tickets and past studies you already have; and help reaching the people who use the produc */
  'needs-ux-research': NeedsUxResearch,
  /* Where our part stops: You get the findings and the choices they point to, and the product calls stay with you. If you want the findings designed, our designers ca */
  'stops-ux-research': StopsUxResearch,
};
