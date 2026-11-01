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

/** A neutral switch: a permission set on or off, its knob at that end. */
function Toggle({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <>
      <Rect x={x} y={y} w={24} h={12} rx={6} className={styles.tile} />
      <circle className={styles.knob} cx={on ? x + 18 : x + 6} cy={y + 6} r="3.5" />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The workflow map: the record, the role and the rule it passes through, mapped to the state it ends
 * in. A record splits to the role that acts on it and the rule that checks it; both meet in the
 * finished state, the one lit point.
 */
function WorkflowMap() {
  return (
    <>
      <Rect x={50} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={70} cy={90} size={18} className={styles.glyph} />
      <Rect x={150} y={30} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="user" cx={170} cy={50} size={18} className={styles.glyph} />
      <Rect x={150} y={110} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="lock" cx={170} cy={130} size={18} className={styles.glyph} />
      {/* The split: record to role and to rule. */}
      <path
        className={styles.line}
        d="M90,90 L110,90 M110,90 L110,56 A6,6 0 0 1 116,50 L143,50 M110,90 L110,124 A6,6 0 0 0 116,130 L143,130"
      />
      <ArrowRight x={150} y={50} />
      <ArrowRight x={150} y={130} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <circle className={styles.node} cx="110" cy="90" r="3.5" />
      {/* The merge: both into the state the work ends in. */}
      <path
        className={styles.line}
        d="M190,50 L204,50 A6,6 0 0 1 210,56 L210,124 A6,6 0 0 1 204,130 L190,130 M210,90 L223,90"
      />
      <ArrowRight x={230} y={90} />
      <circle className={styles.node} cx="190" cy="50" r="2.5" />
      <circle className={styles.node} cx="190" cy="130" r="2.5" />
      <circle className={styles.node} cx="210" cy="90" r="3.5" />
      <Rect x={230} y={60} w={50} h={60} rx={8} className={styles.frame} />
      <Focus x={255} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * Screens for each role: three people's screens fanned in a stack, each headed by its own role (admin,
 * team, user), and from the front one's port two sibling outcomes: the main path straight on to its done
 * screen, and the exception designed as its own screen beside it, the lit point.
 */
function ScreensEachRole() {
  return (
    <>
      <Rect x={30} y={30} w={104} h={104} rx={8} className={styles.frameQuiet} />
      <Glyph name="key" cx={44} cy={40} size={12} className={styles.glyph} />
      <Copy x={56} y={40} w={32} quiet />
      <Rect x={38} y={46} w={104} h={96} rx={8} className={styles.frameQuiet} />
      <Glyph name="users-group-rounded" cx={52} cy={56} size={12} className={styles.glyph} />
      <Copy x={64} y={56} w={32} quiet />
      <Rect x={46} y={62} w={104} h={88} rx={8} className={styles.frame} />
      <C cx={66} cy={82} glyph="user" />
      <Copy x={82} y={82} w={40} quiet />
      <Copy x={62} y={104} w={72} />
      <Copy x={62} y={116} w={52} quiet />
      <Rect x={62} y={128} w={40} h={12} rx={6} className={styles.tile} />
      {/* One port, two outcomes: the main path straight on, the exception branching up beside it. */}
      <Hop x1={150} x2={214} y={110} />
      <path className={styles.line} d="M170,110 L170,68 A6,6 0 0 1 176,62 L207,62" />
      <ArrowRight x={214} y={62} />
      <circle className={styles.node} cx="170" cy="110" r="3.5" />
      <Rect x={214} y={96} w={76} h={28} rx={8} className={styles.frame} />
      <Glyph name="check-circle" cx={252} cy={110} size={16} className={styles.glyph} />
      <Rect x={214} y={40} w={76} h={44} rx={8} className={styles.frame} />
      <Focus x={252} y={62} glyph="danger-triangle" size={10} />
    </>
  );
}

/**
 * Admin, permission and audit screens: who may do what, set person by person, and the log of who did
 * it, under the shield an enterprise buyer looks for.
 */
function AdminPermissionAudit() {
  const rows = [
    [74, true, 40],
    [98, false, 32],
    [122, true, 44],
  ] as const;
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={40} quiet />
      {rows.map(([y, on, w]) => (
        <g key={y}>
          <Glyph name="user" cx={54} cy={y} size={16} className={styles.glyph} />
          <Copy x={70} y={y} w={w} />
          <Toggle x={130} y={y - 6} on={on} />
        </g>
      ))}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Focus x={218} y={58} glyph="shield-check" size={12} />
      <Copy x={246} y={58} w={28} quiet />
      <path className={styles.rule} d="M210,90 L210,130" />
      {(
        [
          [90, 48],
          [110, 36],
          [130, 44],
        ] as const
      ).map(([y, w]) => (
        <g key={y}>
          <circle className={styles.knob} cx="210" cy={y} r="3" />
          <Copy x={222} y={y} w={w} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * How an agent's work appears: the agent's output set out on one card for the person who checks it,
 * with the approve they press, the lit point.
 */
function HowAgentsWorkAppears() {
  return (
    <>
      <Rect x={30} y={66} w={60} h={48} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={60} cy={90} size={22} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={146} y={48} w={40} quiet />
      <Rect x={146} y={60} w={128} h={36} rx={4} className={styles.tile} />
      <Copy x={158} y={72} w={92} />
      <Copy x={158} y={84} w={64} quiet />
      <Glyph name="user" cx={156} cy={124} size={20} className={styles.glyph} />
      <Rect x={204} y={116} w={34} h={16} rx={8} className={styles.tile} />
      <Rect x={242} y={110} w={40} h={28} rx={14} className={styles.halo} />
      <Rect x={248} y={116} w={28} h={16} rx={8} className={styles.solid} />
      <path className={styles.tick} d="M257,124 L260,127 L266,121" />
    </>
  );
}

/**
 * Prototypes tested: the person who does the job clicks through a prototype that is not built yet, and
 * the task gets done, the lit point.
 */
function PrototypesTested() {
  return (
    <>
      <Glyph name="user" cx={84} cy={90} size={40} className={styles.glyph} />
      <Rect x={130} y={30} w={60} h={120} rx={10} className={styles.trailFrame} />
      <Copy x={142} y={50} w={28} quiet />
      <Copy x={142} y={62} w={36} />
      <Hatched x={142} y={74} w={36} h={24} />
      <Rect x={142} y={114} w={36} h={16} rx={8} className={styles.tile} />
      <Cursor x={166} y={122} />
      <Hop x1={190} x2={230} y={90} />
      <Focus x={248} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * Parts your engineers can build from: the parts designed as a set, handed to the code, where one part
 * lands as the lines that build it, the lit point.
 */
function PartsEngineersCanBuild() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Rect x={46} y={46} w={44} h={16} rx={8} className={styles.tile} />
      <Rect x={46} y={74} w={68} h={20} rx={4} className={styles.tile} />
      <Copy x={54} y={84} w={28} quiet />
      <Rect x={46} y={110} w={12} h={12} rx={3} className={styles.tile} />
      <Copy x={66} y={116} w={36} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M196,30 L196,150" />
      <Copy x={208} y={48} w={48} quiet />
      <Copy x={216} y={60} w={36} quiet />
      <Rect x={204} y={72} w={74} h={36} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M216,84 L262,84" />
      <path className={styles.regionCopy} d="M216,96 L246,96" />
      <Copy x={216} y={120} w={40} quiet />
      <Copy x={208} y={132} w={28} quiet />
    </>
  );
}

/* ── The terms ─────────────────────────────────────────────────────────────────── */

/**
 * Who does the work: the senior product designer leads (lit) beside the account lead; researchers,
 * design engineers and developers join when the work needs them (dashed, routes ending open).
 */
function Team() {
  const roles: readonly IconName[] = ['chat-round-dots', 'code', 'server'];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map((glyph, i) => {
        const cy = [50, 90, 130][i] ?? 90;
        return (
          <g key={glyph}>
            <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
            <C cx={234} cy={cy} glyph={glyph} />
            <Copy x={250} y={cy} w={26} quiet />
            <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
            <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
          </g>
        );
      })}
    </>
  );
}

/**
 * What we need from you: people in each role, admins and whoever clears the exceptions among them; the
 * analytics and support tickets; and someone who makes the product calls (lit), handed into the work.
 */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Chips cx={80} cy={50} glyphs={['users-group-rounded', 'lock', 'danger-triangle']} />
      <Chips cx={80} cy={90} glyphs={['graph-up', 'chat-round-dots']} />
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
 * Where our part stops: how plans, usage and limits look to customers, and how a model's output
 * appears, designed and checked (lit); pricing and packaging, building the models and go-to-market
 * stay on their panel, no route entering it.
 */
function Stops() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="stars" />
      <Copy x={42} y={86} w={48} />
      <Copy x={42} y={98} w={32} quiet />
      <Rect x={42} y={110} w={56} h={8} rx={4} className={styles.tile} />
      <Rect x={42} y={110} w={36} h={8} rx={4} className={styles.soft} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="wallet" />
      <Theirs cy={90} glyph="cpu" />
      <Theirs cy={130} glyph="graph-up" />
    </>
  );
}

/**
 * /expertise/b2b-saas-workflow-software · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The workflow map: A map of the records, roles, rules and states the workflow runs on */
  'wyg-b2b-saas-workflow-software-workflow-map': WorkflowMap,
  /* Screens for each role: The screens each role works in, with every exception designed beside the main path */
  'wyg-b2b-saas-workflow-software-screens-each-role': ScreensEachRole,
  /* Admin, permission and audit screens: The admin, permission and audit screens enterprise customers look for */
  'wyg-b2b-saas-workflow-software-admin-permission-audit-screens': AdminPermissionAudit,
  /* How an agent's work appears: How an agent's work, or a model's output, appears to the people who check it */
  'wyg-b2b-saas-workflow-software-how-agents-work-appears': HowAgentsWorkAppears,
  /* Prototypes tested: Prototypes tested with people who do the job, clickable or in code */
  'wyg-b2b-saas-workflow-software-prototypes-tested': PrototypesTested,
  /* Parts your engineers can build from: Parts your engineers can build from, or Tcules developers working alongside them */
  'wyg-b2b-saas-workflow-software-parts-engineers-can-build': PartsEngineersCanBuild,
  /* Who does the work: A senior product designer leads the work and does it. Researchers, design engineers and developers join when the work needs them. */
  'team-b2b-saas-workflow-software': Team,
  /* What we need from you: Time with people in each role doing real tasks, including the admins and whoever clears the exceptions. We also need your analytics and supp */
  'needs-b2b-saas-workflow-software': Needs,
  /* Where our part stops: Some calls belong with your team or another specialist: pricing and packaging, building or training AI models, and go-to-market. We design h */
  'stops-b2b-saas-workflow-software': Stops,
};
