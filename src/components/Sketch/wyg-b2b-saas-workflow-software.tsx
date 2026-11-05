import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glide, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
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

/* ── What we design in (tiles) ─────────────────────────────────────────────────── */

/**
 * Deal and pipeline software for one industry: the property's deal, stuck in the first stage, carried
 * across the board to closed. At rest the deal card (its place pin) sits in the first column and the
 * last column's slot is empty; on hover the route draws across the stages and the slot lights.
 */
function DealPipelineSingle() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {[42, 122, 210].map((x) => (
        <Copy key={x} x={x} y={46} w={32} quiet />
      ))}
      {/* The first stage: the property's deal, and one more behind it. */}
      <Rect x={42} y={76} w={68} h={28} rx={4} className={styles.frame} />
      <Glyph name="map-point" cx={56} cy={90} size={14} className={styles.glyph} />
      <Copy x={70} y={86} w={28} />
      <Copy x={70} y={95} w={18} quiet />
      <Rect x={42} y={112} w={68} h={24} rx={4} className={styles.tile} />
      <Copy x={52} y={124} w={32} quiet />
      {/* The middle stage, clear at the route's height. */}
      {[56, 100].map((y) => (
        <g key={y}>
          <Rect x={122} y={y} w={68} h={24} rx={4} className={styles.tile} />
          <Copy x={132} y={y + 12} w={36} quiet />
        </g>
      ))}
      {/* Closed: the slot the deal lands in, and one closed before it. */}
      <Rect x={210} y={76} w={68} h={28} rx={4} className={styles.trailFrame} />
      <Rect x={210} y={116} w={68} h={24} rx={4} className={styles.tile} />
      <Copy x={220} y={128} w={28} quiet />
      <GrowIn>
        <Rect x={204} y={70} w={80} h={40} rx={10} className={styles.halo} />
        <Rect x={210} y={76} w={68} h={28} rx={4} className={styles.solid} />
        <Glyph name="map-point" cx={224} cy={90} size={14} className={styles.glyphOn} />
      </GrowIn>
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <TraceIn d="M110,90 L203,90" />
      <GrowIn>
        <ArrowRight x={210} y={90} />
      </GrowIn>
    </>
  );
}

/**
 * Quoting, pricing and approvals shared by several specialists: the quote passes the pricing desk and
 * the approver in turn, and its total is cleared. At rest the three stand apart; on hover the route
 * draws through both specialists into the quote and the total lights.
 */
function QuotingApprovals() {
  return (
    <>
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="wallet" cx={50} cy={90} size={18} className={styles.glyph} />
      <Rect x={110} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="shield-check" cx={130} cy={90} size={18} className={styles.glyph} />
      {/* The quote: its lines, then the total. */}
      <Rect x={210} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Copy x={222} y={46} w={32} quiet />
      {[58, 70].map((y) => (
        <g key={y}>
          <Copy x={222} y={y} w={28} />
          <Copy x={262} y={y} w={16} quiet />
        </g>
      ))}
      <Rect x={222} y={82} w={56} h={16} rx={4} className={styles.tile} />
      <GrowIn>
        <Rect x={216} y={76} w={68} h={28} rx={10} className={styles.halo} />
        <Rect x={222} y={82} w={56} h={16} rx={4} className={styles.solid} />
      </GrowIn>
      <Copy x={222} y={116} w={44} quiet />
      <Copy x={222} y={128} w={28} quiet />
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <TraceIn d="M70,90 L110,90 M150,90 L203,90" />
      <GrowIn>
        <ArrowRight x={210} y={90} />
      </GrowIn>
    </>
  );
}

/**
 * Staffing linking clients, candidates and jobs: the client and the candidate, each routed up into the
 * one job, and the match made there. At rest the job's seat is an empty dashed ring; on hover both
 * routes draw into the job and the handshake grows in its seat.
 */
function StaffingLinking() {
  return (
    <>
      <Rect x={110} y={30} w={100} h={80} rx={8} className={styles.frame} />
      <Copy x={126} y={46} w={40} quiet />
      <Copy x={126} y={58} w={64} />
      <circle className={styles.trailFrame} cx="160" cy="84" r="11" />
      <GrowIn>
        <Focus x={160} y={84} glyph="hand-shake" size={14} />
      </GrowIn>
      <Rect x={30} y={90} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={60} cy={120} size={24} className={styles.glyph} />
      <Rect x={230} y={90} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={260} cy={120} size={24} className={styles.glyph} />
      <circle className={styles.node} cx="60" cy="90" r="2.5" />
      <circle className={styles.node} cx="260" cy="90" r="2.5" />
      <TraceIn d="M60,90 L60,76 A6,6 0 0 1 66,70 L103,70" />
      <TraceIn d="M260,90 L260,76 A6,6 0 0 0 254,70 L217,70" />
      <GrowIn>
        <ArrowRight x={110} y={70} />
      </GrowIn>
      <GrowIn>
        <ArrowLeft x={210} y={70} />
      </GrowIn>
    </>
  );
}

/**
 * Scheduling across teams and companies: every person's week, and the one time they can all make. At
 * rest the cursor waits beside a grid of taken and open slots; on hover it glides onto the column open
 * for everyone, which lights.
 */
function SchedulingAcross() {
  const rows: readonly (readonly [number, IconName, readonly number[]])[] = [
    [70, 'user', [0, 2]],
    [98, 'users-group-rounded', [1, 4]],
    [126, 'user', [0, 2, 4]],
  ];
  const cols = [80, 116, 152, 188, 224];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={46} w={48} quiet />
      <GrowIn>
        <Rect x={182} y={56} w={40} h={84} rx={10} className={styles.halo} />
      </GrowIn>
      {rows.map(([y, glyph, busy]) => (
        <g key={y}>
          <Glyph name={glyph} cx={54} cy={y} size={16} className={styles.glyph} />
          {cols.map((x, i) => (
            <Rect
              key={x}
              x={x}
              y={y - 8}
              w={28}
              h={16}
              rx={4}
              className={i === 3 ? styles.press : busy.includes(i) ? styles.knob : styles.tile}
            />
          ))}
        </g>
      ))}
      <Glide x={62} y={22}>
        <Cursor x={202} y={98} />
      </Glide>
    </>
  );
}

/**
 * Environment, health, safety and sustainability for large firms: a hazard found in one site's plan
 * (one of many sites) is tracked through to closed. At rest the hazard sits in its room; on hover the
 * route draws out of that room to the close, and the tick grows.
 */
function EhsSuite() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={40} y={40} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={50} y={50} w={100} h={100} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M100,50 L100,150 M100,110 L150,110 M50,90 L100,90" />
      <Glyph name="map-point" cx={75} cy={120} size={16} className={styles.glyphQuiet} />
      <Glyph name="danger-triangle" cx={125} cy={130} size={18} className={styles.glyph} />
      <circle className={styles.node} cx="150" cy="130" r="2.5" />
      <TraceIn d="M150,130 L204,130 A6,6 0 0 0 210,124 L210,96 A6,6 0 0 1 216,90 L259,90" />
      <GrowIn>
        <Focus x={270} y={90} glyph="check-circle" size={12} />
      </GrowIn>
    </>
  );
}

/**
 * Back-office software for a single trade: the tyre in the bay, and its job run on the shop's own
 * screen: the work ticked off, and its invoice the lit point. Still.
 */
function BackOfficeTrade() {
  /* The tyre in side view, centred on (74, 90): solid rubber in the frame ink from its 44 edge down to
     the rim, the edge notched with shallow tread (4 wide, 3 deep, every 12 degrees) so the ground shows
     through; a thin sidewall groove (2 wide) 4 out from the rim; the lighter rim disc (22) on top with
     five lugs and the hub. One even-odd path: no ids, no masks. */
  const pt = (a: number, along: number, out: number) => {
    const r = (a * Math.PI) / 180;
    return `${(74 + out * Math.cos(r) - along * Math.sin(r)).toFixed(2)},${(90 + out * Math.sin(r) + along * Math.cos(r)).toFixed(2)}`;
  };
  const halfCut = Math.sqrt(44 * 44 - 4);
  const ring = (r: number) => `M${74 + r},90 A${r},${r} 0 1 0 ${74 - r},90 A${r},${r} 0 1 0 ${74 + r},90 Z`;
  const tyre =
    Array.from({ length: 30 }, (_, i) => {
      const a = i * 12 + 6;
      return `${i === 0 ? 'M' : 'A44,44 0 0 1 '}${pt(a, -2, halfCut)} L${pt(a, -2, 41)} L${pt(a, 2, 41)} L${pt(a, 2, halfCut)}`;
    }).join(' ') +
    ` A44,44 0 0 1 ${pt(6, -2, halfCut)} Z ${ring(30)} ${ring(28)}`;
  const lug = (i: number) => {
    const r = ((i * 72 - 90) * Math.PI) / 180;
    return { cx: (74 + 12 * Math.cos(r)).toFixed(2), cy: (90 + 12 * Math.sin(r)).toFixed(2) };
  };
  return (
    <>
      <path className={styles.glyph} d={tyre} />
      {/* The wheel: a lighter rim disc, five lug dots round a small hub. */}
      <circle className={styles.knob} cx="74" cy="90" r="22" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} className={styles.blank} {...lug(i)} r="2" />
      ))}
      <circle className={styles.blank} cx="74" cy="90" r="4" />
      {/* The route: from a port clear of the tread to the job card. */}
      <path className={styles.line} d="M127,90 L143,90" />
      <ArrowRight x={150} y={90} />
      <circle className={styles.node} cx="127" cy="90" r="3" />
      {/* The job card: a tyre mark on its top line, the work ticked off, its invoice the lit point. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <circle className={styles.glyph} cx="171" cy="48" r="5" />
      <circle className={styles.blank} cx="171" cy="48" r="2.5" />
      <Copy x={182} y={48} w={36} quiet />
      <Glyph name="check-circle" cx={172} cy={72} size={12} className={styles.glyph} />
      <Copy x={184} y={72} w={44} />
      <Glyph name="check-circle" cx={172} cy={96} size={12} className={styles.glyph} />
      <Copy x={184} y={96} w={32} />
      <Copy x={166} y={124} w={52} quiet />
      <Focus x={262} y={124} glyph="document-text" size={12} />
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
  /* MOVING: this tile links to /case-studies/enterprise-workflow-redesign-dealpath-real-estate, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Deal and pipeline software for a single industry, such as real estate: Dealpath */
  'kind-b2b-saas-workflow-software-deal-pipeline-software-single': DealPipelineSingle,
  /* MOVING: this tile links to /case-studies/consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Quoting, pricing and approvals (CPQ) shared by several specialists: Auxentios */
  'kind-b2b-saas-workflow-software-quoting-pricing-approvals-cpq': QuotingApprovals,
  /* MOVING: this tile links to /case-studies/saas-ux-ui-case-study-research-and-object-oriented-ux-for-staffing-agencies-software, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Staffing and people operations linking clients, candidates and jobs: Scissors */
  'kind-b2b-saas-workflow-software-staffing-people-operations-linking': StaffingLinking,
  /* MOVING: this tile links to /case-studies/doodle-case-study-automating-enterprise-meeting-scheduling, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Scheduling across teams and companies: Doodle */
  'kind-b2b-saas-workflow-software-scheduling-across-teams-companies': SchedulingAcross,
  /* MOVING: this tile links to /case-studies/legacy-saas-modernisation-information-architecture, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Environment, health, safety and sustainability suites for large firms: Benchmark Gensuite */
  'kind-b2b-saas-workflow-software-environment-health-safety-sustainability': EhsSuite,
  /* What we design in, tile: Back-office software for a single trade, such as tyre shops: TreadCommand */
  'kind-b2b-saas-workflow-software-back-office-software-single': BackOfficeTrade,
};
