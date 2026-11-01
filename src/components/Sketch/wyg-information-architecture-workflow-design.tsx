import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A run of chips on one row, centred on cx, 28 apart. */
function Chips({ cx, cy, glyphs }: { cx: number; cy: number; glyphs: readonly IconName[] }) {
  return (
    <>
      {glyphs.map((glyph, i) => (
        <C key={glyph} cx={cx + (i - (glyphs.length - 1) / 2) * 28} cy={cy} glyph={glyph} />
      ))}
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * A map of your records: the things the product tracks, linked. A client, the job at the middle of it
 * (lit) and its many candidates, joined edge to edge with a port at both ends: a relationship, not a
 * flow, so no arrowhead.
 */
function MapRecords() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={60} cy={82} size={20} className={styles.glyph} />
      <Copy x={46} y={106} w={28} quiet />
      <Rect x={130} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={160} y={82} glyph="document-text" size={13} />
      <Copy x={146} y={110} w={28} />
      {/* Many candidates to one job: sheets behind. */}
      <Rect x={238} y={52} w={52} h={60} rx={8} className={styles.frameQuiet} />
      <Rect x={234} y={56} w={52} h={60} rx={8} className={styles.frameQuiet} />
      <Rect x={230} y={60} w={52} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={256} cy={82} size={20} className={styles.glyph} />
      <Copy x={244} y={106} w={24} quiet />
      <path className={styles.line} d="M90,90 L130,90 M190,90 L230,90" />
      {[90, 130, 190, 230].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy="90" r="2.5" />
      ))}
    </>
  );
}

/**
 * Roles and permissions: who may see, create, change or approve, role by role. A grid of roles against
 * the four actions, worked out cell by cell; the lead's approval is the one lit.
 */
function RolesPermissions() {
  const cols: [number, IconName][] = [
    [130, 'eye'],
    [170, 'document-text'],
    [210, 'ruler-pen'],
    [250, 'check-circle'],
  ];
  const rows: [number, number, readonly number[]][] = [
    [86, 36, [1, 1, 1, 2]],
    [110, 28, [1, 1, 1, 0]],
    [134, 32, [1, 0, 0, 0]],
  ];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {cols.map(([cx, glyph]) => (
        <Glyph key={glyph} name={glyph} cx={cx} cy={50} size={14} className={styles.glyph} />
      ))}
      <path className={styles.hair} d="M30,66 L290,66" />
      {rows.map(([y, w, cells]) => (
        <g key={y}>
          <Glyph name="user" cx={54} cy={y} size={16} className={styles.glyph} />
          <Copy x={70} y={y} w={w} quiet />
          {cols.map(([cx], i) =>
            cells[i] === 2 ? (
              <g key={cx}>
                <Rect x={cx - 12} y={y - 12} w={24} h={24} rx={8} className={styles.halo} />
                <Rect x={cx - 6} y={y - 6} w={12} h={12} rx={3} className={styles.solid} />
              </g>
            ) : (
              <Rect
                key={cx}
                x={cx - 6}
                y={y - 6}
                w={12}
                h={12}
                rx={3}
                className={cells[i] ? styles.soft : styles.tile}
              />
            ),
          )}
        </g>
      ))}
    </>
  );
}

/**
 * Statuses and rules: a draft meets the condition that decides it, and goes one of two ways: on to
 * approved (lit) or aside to blocked.
 */
function StatusesRules() {
  return (
    <>
      <Rect x={30} y={80} w={60} h={20} rx={10} className={styles.tile} />
      <Copy x={46} y={90} w={28} quiet />
      {/* The condition: a decision diamond the route meets at its points. */}
      <path className={styles.frame} d="M150,78 L162,90 L150,102 L138,90 Z" />
      <path
        className={styles.line}
        d="M90,90 L138,90 M150,78 L150,56 A6,6 0 0 1 156,50 L203,50 M150,102 L150,124 A6,6 0 0 0 156,130 L203,130"
      />
      <ArrowRight x={210} y={50} />
      <ArrowRight x={210} y={130} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      {/* Approved, the way through. */}
      <Rect x={204} y={34} w={82} h={32} rx={16} className={styles.halo} />
      <Rect x={210} y={40} w={70} h={20} rx={10} className={styles.solid} />
      <Glyph name="check-circle" cx={245} cy={50} size={14} className={styles.glyphOn} />
      {/* Blocked, the exception. */}
      <Rect x={210} y={120} w={70} h={20} rx={10} className={styles.tile} />
      <Glyph name="danger-triangle" cx={226} cy={130} size={12} className={styles.glyph} />
      <Copy x={240} y={130} w={26} quiet />
    </>
  );
}

/**
 * Every hand-off designed: one person's part done, and days later the next person is told, sees what
 * they need and has the one thing to do next (lit).
 */
function EveryHandoff() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <C cx={50} cy={60} glyph="user" />
      <Copy x={66} y={60} w={28} quiet />
      <Copy x={42} y={84} w={52} />
      <Copy x={42} y={96} w={36} quiet />
      <Glyph name="check-circle" cx={50} cy={120} size={14} className={styles.glyph} />
      <Copy x={64} y={120} w={30} quiet />
      {/* Days later. */}
      <Glyph name="clock-circle" cx={150} cy={70} size={16} className={styles.glyphQuiet} />
      <Hop x1={110} x2={190} y={90} />
      <Rect x={190} y={40} w={90} h={100} rx={8} className={styles.frame} />
      <C cx={210} cy={60} glyph="chat-round-dots" />
      <Copy x={226} y={60} w={32} quiet />
      <Copy x={202} y={84} w={60} />
      <Copy x={202} y={96} w={40} quiet />
      <Rect x={196} y={108} w={52} h={24} rx={12} className={styles.halo} />
      <Rect x={202} y={114} w={40} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/**
 * Navigation: the menu grouped around the records a role tracks, the work it does most lit at the
 * top of its group.
 */
function Navigation() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M130,30 L130,150" />
      <C cx={70} cy={48} glyph="user" />
      <Copy x={86} y={48} w={28} quiet />
      {/* The first group: one record, its items, the most used lit. */}
      <Glyph name="document-text" cx={68} cy={74} size={12} className={styles.glyph} />
      <Copy x={80} y={74} w={32} />
      <Rect x={72} y={84} w={52} h={24} rx={12} className={styles.halo} />
      <Rect x={78} y={90} w={40} h={12} rx={6} className={styles.solid} />
      <Copy x={80} y={118} w={28} quiet />
      {/* The second group. */}
      <Glyph name="users-group-rounded" cx={68} cy={136} size={12} className={styles.glyph} />
      <Copy x={80} y={136} w={28} />
      {/* The page it opens. */}
      <Copy x={146} y={50} w={60} quiet />
      <Rect x={146} y={66} w={108} h={40} rx={4} className={styles.tile} />
      <Copy x={146} y={122} w={80} />
      <Copy x={146} y={134} w={56} quiet />
    </>
  );
}

/**
 * Clickable prototypes: people from each role click through the structure, and it holds. Three people,
 * a prototype screen pressed, the next screen reached with its tick (lit).
 */
function ClickablePrototypes() {
  return (
    <>
      {/* People from each role, one to a row. */}
      <Rect x={30} y={40} w={40} h={100} rx={8} className={styles.tile} />
      {[60, 90, 120].map((y) => (
        <Glyph key={y} name="user" cx={50} cy={y} size={18} className={styles.glyph} />
      ))}
      <Rect x={90} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={102} y={58} w={32} quiet />
      <Copy x={102} y={72} w={52} />
      <Copy x={102} y={84} w={40} quiet />
      <Rect x={102} y={106} w={44} h={16} rx={8} className={styles.solid} />
      <Cursor x={132} y={116} />
      <Hop x1={170} x2={210} y={90} />
      <Rect x={210} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={222} y={58} w={32} quiet />
      <Focus x={250} y={98} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * The reasoning, written down: a document of choices, the one in question lit, and the team's question
 * pointing at it.
 */
function ReasoningWrittenDown() {
  return (
    <>
      <Rect x={50} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={68} cy={48} size={14} className={styles.glyph} />
      <Copy x={82} y={48} w={44} />
      <Copy x={64} y={64} w={56} quiet />
      <Rect x={58} y={76} w={84} h={28} rx={10} className={styles.halo} />
      <Copy x={66} y={86} w={60} />
      <Copy x={66} y={94} w={40} />
      <Copy x={64} y={118} w={64} quiet />
      <Copy x={64} y={130} w={44} quiet />
      <Rect x={210} y={60} w={70} h={60} rx={8} className={styles.frame} />
      <C cx={226} cy={78} glyph="users-group-rounded" />
      <Glyph name="question-circle" cx={262} cy={78} size={14} className={styles.glyph} />
      <Copy x={222} y={98} w={44} quiet />
      <Copy x={222} y={108} w={28} quiet />
      {/* Drawn after the card so its port sits on the card's edge. */}
      <Hop x1={210} x2={150} y={90} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) who draws the model and the account lead; a researcher joins when needed. */
function Team() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={210} y={76} w={70} h={28} rx={8} className={styles.trailFrame} />
      {/* The researcher: a person who observes, joining when needed. */}
      <C cx={228} cy={90} glyph="user" />
      <Glyph name="eye" cx={258} cy={90} size={14} className={styles.glyph} />
      <path className={styles.trail} d="M210,90 L173,90" />
      <circle className={styles.nodeOpen} cx={170} cy={90} r={3} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/**
 * Time with people from each role doing real tasks (lit), the moments the work leaves for a
 * spreadsheet or a chat, someone who can agree the rules: handed into our model, waiting on them.
 */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={50} glyph="users-group-rounded" size={12} />
      <Chips cx={80} cy={90} glyphs={['document-text', 'chat-round-dots']} />
      <Chips cx={80} cy={130} glyphs={['user', 'checklist']} />
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

/** What stays theirs, one row on their panel: its chip, then a heading line and a quiet one. */
function Theirs({ cy, glyph }: { cy: number; glyph: IconName }) {
  return (
    <>
      <C cx={216} cy={cy} glyph={glyph} />
      <Copy x={236} y={cy - 4} w={44} />
      <Copy x={236} y={cy + 4} w={31} quiet />
    </>
  );
}

/**
 * The structure and its prototypes, handed over and checked (lit); each screen's look, its behaviour
 * and the build stay theirs, no route crossing the gap.
 */
function Stops() {
  return (
    <>
      {/* The structure, one of several prototypes: a root over two branches. */}
      <Rect x={30} y={42} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={34} y={46} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={38} y={50} w={72} h={80} rx={8} className={styles.frame} />
      <Rect x={56} y={62} w={36} h={14} rx={4} className={styles.tile} />
      <path className={styles.hair} d="M74,76 L74,88 M60,100 L60,94 Q60,88 66,88 L82,88 Q88,88 88,94 L88,100" />
      <Rect x={48} y={100} w={24} h={14} rx={4} className={styles.tile} />
      <Rect x={76} y={100} w={24} h={14} rx={4} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="ruler-pen" />
      <Theirs cy={90} glyph="widget" />
      <Theirs cy={130} glyph="code" />
    </>
  );
}

/**
 * /services/product-design/information-architecture-workflow-design · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of your records.: What the product tracks and how those things connect, such as clients, jobs and candidates, or listings and deals. */
  'wyg-information-architecture-workflow-design-map-records': MapRecords,
  /* Roles and permissions.: Who can see, create, change or approve each record, worked out role by role. */
  'wyg-information-architecture-workflow-design-roles-permissions': RolesPermissions,
  /* Statuses and rules.: What "draft", "blocked" or "approved" means, what can happen next, and the conditions and exceptions that decide it. */
  'wyg-information-architecture-workflow-design-statuses-rules': StatusesRules,
  /* Every hand-off designed.: Who is told, what they see and what they can do next, including whoever picks the work up again days later. */
  'wyg-information-architecture-workflow-design-every-handoff-designed': EveryHandoff,
  /* Navigation.: Menus grouped around the records people track and the work each role does most. */
  'wyg-information-architecture-workflow-design-navigation': Navigation,
  /* Clickable prototypes: Clickable prototypes of the structure and key flows, tried by people from each role. */
  'wyg-information-architecture-workflow-design-clickable-prototypes': ClickablePrototypes,
  /* The reasoning, written down: The reasoning, written down, so your team can question every choice. */
  'wyg-information-architecture-workflow-design-reasoning-written-down': ReasoningWrittenDown,
  /* Who does the work: The model is drawn by a senior product designer who leads the project, and an account lead looks after plans and timings. A researcher joins */
  'team-information-architecture-workflow-design': Team,
  /* What we need from you: Time with people from each role doing real tasks, including the moments the work leaves your product for a spreadsheet or a chat, and someon */
  'needs-information-architecture-workflow-design': Needs,
  /* Where our part stops: Our part is the structure and the prototypes. The look and behaviour of each screen is Interaction & UI Design, and your engineers build, un */
  'stops-information-architecture-workflow-design': Stops,
};
