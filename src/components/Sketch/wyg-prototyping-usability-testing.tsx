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

/** The question picks its prototype: rough screens, realistic data (lit, where the route lands) or code. */
function PrototypeQuestionNeeds() {
  return (
    <>
      <Rect x={50} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="question-circle" cx={80} cy={90} size={24} className={styles.glyph} />
      <Hop x1={110} x2={170} y={90} />
      {/* Rough clickable screens. */}
      <Rect x={170} y={30} w={110} h={32} rx={8} className={styles.trailFrame} />
      <Copy x={182} y={42} w={36} quiet />
      <Copy x={182} y={52} w={56} quiet />
      {/* Realistic content and data, to read and compare. */}
      <Rect x={170} y={74} w={110} h={32} rx={8} className={styles.region} />
      {[84, 96].map((y) =>
        [182, 214, 246].map((x) => (
          <path key={`${x}-${y}`} className={styles.regionCopy} d={`M${x},${y} L${x + 22},${y}`} />
        )),
      )}
      {/* Working code. */}
      <Rect x={170} y={118} w={110} h={32} rx={8} className={styles.frame} />
      <Glyph name="code" cx={190} cy={134} size={14} className={styles.glyph} />
      <Copy x={206} y={130} w={40} quiet />
      <Copy x={214} y={140} w={48} quiet />
    </>
  );
}

/** A profile agreed first, and the one person who fits it lit among the pool; the others stay quiet. */
function PeopleWhoMatchUsers() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Glyph name="user" cx={70} cy={64} size={22} className={styles.glyph} />
      {[94, 108, 122].map((y, i) => (
        <g key={y}>
          <Rect x={44} y={y - 4} w={8} h={8} rx={2} className={styles.tile} />
          <Copy x={60} y={y} w={[36, 28, 32][i] ?? 32} />
        </g>
      ))}
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={50} w={140} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={180} cy={90} size={22} className={styles.glyphQuiet} />
      <Focus x={220} y={90} glyph="user" size={12} />
      <Glyph name="user" cx={260} cy={90} size={22} className={styles.glyphQuiet} />
    </>
  );
}

/** A real goal carried into a screen of realistic records (a thumbnail leads each row); the record it needs is picked. */
function RealisticTasks() {
  const cols = [184, 218, 250] as const;
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="flag" cx={70} cy={74} size={20} className={styles.glyphAccent} />
      <Copy x={46} y={100} w={48} />
      <Copy x={46} y={112} w={34} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {/* Rows on one 20 pitch, the block centred in the screen. */}
      <Copy x={165} y={50} w={40} quiet />
      {[68, 88].map((y, i) => (
        <g key={y}>
          <Rect x={165} y={y - 5} w={10} h={10} rx={2} className={styles.tile} />
          {cols.map((x, j) => (
            <Copy key={x} x={x} y={y} w={[[26, 20, 22], [20, 24, 16]][i]?.[j] ?? 20} />
          ))}
        </g>
      ))}
      <Rect x={158} y={96} w={124} h={24} rx={4} className={styles.region} />
      <Rect x={165} y={103} w={10} h={10} rx={2} className={styles.mark} />
      {cols.map((x, j) => (
        <path
          key={x}
          className={styles.regionCopy}
          d={`M${x},108 L${x + ([26, 20, 6][j] ?? 20)},108`}
        />
      ))}
      <Rect x={165} y={123} w={10} h={10} rx={2} className={styles.tile} />
      {cols.map((x, j) => (
        <Copy key={x} x={x} y={128} w={[22, 26, 12][j] ?? 20} quiet />
      ))}
      {/* The whole pointer, shadow included, inside the lit row. */}
      <Cursor x={264} y={96} />
    </>
  );
}

/** A person presses through the prototype; what they do runs straight to your team, watching. */
function ModeratedSessionsTeamCan() {
  return (
    <>
      <Rect x={30} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M30,54 L150,54" />
      <Copy x={46} y={70} w={40} quiet />
      <Copy x={46} y={84} w={80} />
      <Rect x={46} y={100} w={44} h={14} rx={7} className={styles.solid} />
      <Cursor x={76} y={108} />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Glyph name="eye" cx={222} cy={90} size={22} className={styles.glyph} />
      <Glyph name="users-group-rounded" cx={260} cy={90} size={22} className={styles.glyph} />
    </>
  );
}

/** One report per round (sheets behind): what we saw, what to change (lit pen), and what still needs testing. */
function ReportAfterEachRound() {
  return (
    <>
      <Rect x={84} y={30} w={160} h={104} rx={8} className={styles.frameQuiet} />
      <Rect x={80} y={34} w={160} h={108} rx={8} className={styles.frameQuiet} />
      <Rect x={76} y={38} w={160} h={112} rx={8} className={styles.frame} />
      <Copy x={92} y={58} w={56} />
      <Glyph name="eye" cx={98} cy={80} size={14} className={styles.glyph} />
      <Copy x={118} y={76} w={80} />
      <Copy x={118} y={84} w={52} quiet />
      <Rect x={86} y={92} w={24} h={24} rx={8} className={styles.halo} />
      <Pen cx={98} cy={104} />
      <Copy x={118} y={100} w={88} />
      <Copy x={118} y={108} w={56} quiet />
      <Glyph name="question-circle" cx={98} cy={128} size={14} className={styles.glyphQuiet} />
      <Copy x={118} y={124} w={64} quiet />
      <Copy x={118} y={132} w={40} quiet />
    </>
  );
}

/** A pencil at 45 degrees, tip down-left: cap, body and point, each a separate piece. */
function Pen({ cx, cy }: { cx: number; cy: number }) {
  return (
    <path
      className={styles.glyphAccent}
      transform={`translate(${cx},${cy}) rotate(45)`}
      d="M-2.6,-8.5 L2.6,-8.5 L2.6,-6.3 L-2.6,-6.3 Z M-2.6,-5 L2.6,-5 L2.6,3.4 L-2.6,3.4 Z M-2.6,4.6 L2.6,4.6 L0,8.6 Z"
    />
  );
}

/** The design with its change lit, routed on to the next round or to your engineers. */
function RevisedDesign() {
  return (
    <>
      <Rect x={50} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={66} y={58} w={40} quiet />
      <Copy x={66} y={72} w={64} />
      <Rect x={66} y={84} w={68} h={20} rx={4} className={styles.tile} />
      <Rect x={60} y={108} w={52} h={24} rx={12} className={styles.halo} />
      <Rect x={66} y={114} w={40} h={12} rx={6} className={styles.solid} />
      <path
        className={styles.line}
        d="M150,90 L164,90 A6,6 0 0 0 170,84 L170,56 A6,6 0 0 1 176,50 L203,50"
      />
      <path
        className={styles.line}
        d="M164,90 A6,6 0 0 1 170,96 L170,124 A6,6 0 0 0 176,130 L203,130"
      />
      <path className={styles.solid} d="M210,50 L203,46 L203,54 Z" />
      <path className={styles.solid} d="M210,130 L203,126 L203,134 Z" />
      <circle className={styles.node} cx="150" cy="90" r="2.5" />
      <Rect x={210} y={34} w={70} h={32} rx={8} className={styles.frame} />
      <C cx={228} cy={50} glyph="refresh" />
      <Copy x={244} y={46} w={24} />
      <Copy x={244} y={54} w={16} quiet />
      <Rect x={210} y={114} w={70} h={32} rx={8} className={styles.frame} />
      <C cx={228} cy={130} glyph="code" />
      <Copy x={244} y={126} w={24} />
      <Copy x={244} y={134} w={16} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) plans and runs each round, the account lead keeps the schedule; design
 *  engineers join, dashed, when the question needs code. */
function TeamPrototypingUsabilityTesting() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.trailFrame} />
      <C cx={234} cy={90} glyph="code" />
      <Copy x={250} y={90} w={26} quiet />
      <path className={styles.trail} d="M216,90 L183,90" />
      <circle className={styles.nodeOpen} cx={180} cy={90} r={3} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

const ROWS = [50, 90, 130] as const;

/** The handover: the question at stake (lit), help reaching participants, and realistic data, into one
 *  trunk to our frame, the round hatched until they arrive. */
function NeedsPrototypingUsabilityTesting() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={58} y={50} glyph="question-circle" size={12} />
      <Copy x={84} y={46} w={30} />
      <Copy x={84} y={54} w={20} quiet />
      <C cx={58} cy={90} glyph="users-group-rounded" />
      <Copy x={78} y={86} w={36} />
      <Copy x={78} y={94} w={24} quiet />
      <C cx={58} cy={130} glyph="database" />
      <Copy x={78} y={126} w={36} />
      <Copy x={78} y={134} w={24} quiet />
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

/** The findings and the revised design, routed to our check; the build, the browser and every screen
 *  carry on past the boundary, no route entering. */
function StopsPrototypingUsabilityTesting() {
  return (
    <>
      <Rect x={26} y={46} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="eye" cx={48} cy={66} size={14} className={styles.glyph} />
      <Copy x={62} y={66} w={32} quiet />
      <Copy x={42} y={84} w={56} />
      <Copy x={42} y={96} w={40} quiet />
      <Rect x={42} y={108} w={36} h={12} rx={6} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="code" />
      <Theirs cy={90} glyph="monitor" />
      <Theirs cy={130} glyph="widget" />
    </>
  );
}

/**
 * /services/product-design/prototyping-usability-testing · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The prototype the question needs.: Rough clickable screens when the order of steps is in doubt, realistic content and data when people must read and compare, and working code  */
  'wyg-prototyping-usability-testing-prototype-question-needs': PrototypeQuestionNeeds,
  /* People who match your users.: Existing customers, trial users or others who fit a profile we agree with you before the first session. */
  'wyg-prototyping-usability-testing-people-who-match-users': PeopleWhoMatchUsers,
  /* Realistic tasks.: Real goals with realistic records, so people work the way they would on an ordinary day. */
  'wyg-prototyping-usability-testing-realistic-tasks': RealisticTasks,
  /* Moderated sessions your team can watch.: What people do counts for more than what they say they like. */
  'wyg-prototyping-usability-testing-moderated-sessions-team-can': ModeratedSessionsTeamCan,
  /* A report after each round.: The tasks, who took part, what we saw, what to change and what still needs testing. */
  'wyg-prototyping-usability-testing-report-after-each-round': ReportAfterEachRound,
  /* A revised design: A revised design, ready for the next round or for your engineers. */
  'wyg-prototyping-usability-testing-revised-design': RevisedDesign,
  /* Who does the work: A senior product designer plans each round, runs the sessions and leads the work, with an account lead keeping the rounds on schedule. Desig */
  'team-prototyping-usability-testing': TeamPrototypingUsabilityTesting,
  /* What we need from you: The question at stake and the result that would change your team's mind, help reaching participants or agreement on a profile, and realistic */
  'needs-prototyping-usability-testing': NeedsPrototypingUsabilityTesting,
  /* Where our part stops: You get the findings and a revised design, and the build stays with your engineers. When only a browser can answer the question, Coded Proto */
  'stops-prototyping-usability-testing': StopsPrototypingUsabilityTesting,
};
