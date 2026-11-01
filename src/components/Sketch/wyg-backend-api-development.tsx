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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** The three answers (what a record means, who may do what, which system holds the truth) agreed on
 *  paper and signed off; the code built from them is still to come. */
function RulesWrittenDown() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      {(
        [
          [50, 'database', 52],
          [74, 'key', 40],
          [98, 'server', 46],
        ] as const
      ).map(([cy, glyph, w]) => (
        <g key={glyph}>
          <C cx={50} cy={cy} glyph={glyph} />
          <Copy x={66} y={cy - 4} w={w} />
          <Copy x={66} y={cy + 4} w={Math.round(w * 0.6)} quiet />
        </g>
      ))}
      <Focus x={124} y={126} glyph="check-circle" size={13} />
      <Hop x1={150} x2={190} y={90} />
      <Hatched x={190} y={40} w={100} h={100} />
      <Rect x={224} y={74} w={32} h={32} rx={4} className={styles.tile} />
      <Glyph name="code" cx={240} cy={90} size={18} className={styles.glyphQuiet} />
    </>
  );
}

/** The permission the API failed to enforce is locked first; the half-finished integration is next,
 *  and the new feature waits, unbuilt. */
function RiskiestGapsClosedFirst() {
  return (
    <>
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Focus x={60} y={90} glyph="lock" size={13} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Glyph name="refresh" cx={160} cy={78} size={20} className={styles.glyph} />
      <Rect x={142} y={104} w={36} h={8} rx={4} className={styles.tile} />
      <Rect x={142} y={104} w={18} h={8} rx={4} className={styles.knob} />
      <path className={styles.trail} d="M190,90 L230,90" />
      <Hatched x={230} y={50} w={60} h={80} />
      <Rect x={246} y={76} w={28} h={28} rx={4} className={styles.tile} />
      <Glyph name="stars" cx={260} cy={90} size={16} className={styles.glyphQuiet} />
    </>
  );
}

/** One payment sent three times reaches the tested endpoint, and it charges once. */
function TestedEndpoints() {
  return (
    <>
      {/* The retries: the same request, three times over. */}
      {[2, 1].map((n) => (
        <Rect
          key={n}
          x={38 - n * 4}
          y={66 - n * 4}
          w={92}
          h={48}
          rx={8}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={38} y={66} w={92} h={48} rx={8} className={styles.frame} />
      <C cx={58} cy={90} glyph="refresh" />
      <Copy x={74} y={86} w={40} />
      <Copy x={74} y={94} w={26} quiet />
      <Hop x1={130} x2={170} y={90} />
      {/* The endpoint: one charge, and its test passed. */}
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <C cx={192} cy={62} glyph="wallet" />
      <Copy x={208} y={58} w={34} />
      <Copy x={208} y={66} w={22} quiet />
      <Focus x={266} y={64} glyph="check-circle" size={13} />
      {/* The duplicates, refused: never charged. */}
      {[88, 108].map((cy) => (
        <g key={cy}>
          <Rect x={186} y={cy - 6} w={48} h={12} rx={6} className={styles.trailFrame} />
          <Copy x={196} y={cy} w={28} quiet />
          <Glyph name="close-circle" cx={248} cy={cy} size={12} className={styles.glyphQuiet} />
        </g>
      ))}
    </>
  );
}

/** The provider is down, and the call waits in a held queue instead of failing. */
function IntegrationsPlannedFailure() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="server" cx={70} cy={82} size={24} className={styles.glyph} />
      <Copy x={50} y={110} w={40} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Focus x={170} y={90} glyph="clock-circle" size={13} />
      <path className={styles.trail} d="M188,90 L210,90" />
      {/* The provider, out. */}
      <Rect x={210} y={50} w={80} h={80} rx={8} className={styles.trailFrame} />
      <Glyph name="wallet" cx={250} cy={82} size={24} className={styles.glyphQuiet} />
      <Glyph name="danger-triangle" cx={250} cy={112} size={14} className={styles.glyphQuiet} />
    </>
  );
}

/** The AI agent acts through clearly named actions, and the one it may not do alone is locked. */
function ApiAgentsCanUse() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={60} y={90} glyph="stars" size={13} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {[56, 90].map((cy) => (
        <g key={cy}>
          <Rect x={150} y={cy - 10} w={84} h={20} rx={10} className={styles.tile} />
          <Copy x={164} y={cy} w={48} />
          <Glyph name="check-circle" cx={258} cy={cy} size={16} className={styles.glyph} />
        </g>
      ))}
      <Hatched x={150} y={114} w={84} h={20} />
      <Glyph name="lock" cx={258} cy={124} size={16} className={styles.glyph} />
    </>
  );
}

/** The live backend's monitoring goes to your team, who run it from the runbook. */
function BackendTeamCanRun() {
  const bars = [20, 32, 16, 44, 26];
  return (
    <>
      <Rect x={30} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Copy x={46} y={58} w={40} quiet />
      {bars.map((h, i) => (
        <Rect key={i} x={50 + i * 18} y={124 - h} w={10} h={h} rx={2} className={styles.tile} />
      ))}
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Focus x={240} y={72} glyph="users-group-rounded" size={13} />
      <C cx={214} cy={116} glyph="notebook" />
      <Copy x={230} y={112} w={44} />
      <Copy x={230} y={120} w={28} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** Our engineers build it (lit) with the account lead beside them; designers and the senior engineer who
 *  reviews each change are always in the team. */
function TeamBackend() {
  const roles = [
    [70, 'ruler-pen'],
    [110, 'clipboard-check'],
  ] as const;
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <C cx={96} cy={66} glyph="code" />
      <Copy x={112} y={62} w={48} />
      <Copy x={112} y={72} w={32} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map(([cy, glyph]) => (
        <g key={glyph}>
          <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
          <Glyph name="user" cx={234} cy={cy} size={14} className={styles.glyphQuiet} />
          <C cx={254} cy={cy} glyph={glyph} />
          <Copy x={266} y={cy} w={14} quiet />
          <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
          <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
        </g>
      ))}
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The code (lit), the data model and deployment set-up, and the screens that call the API. */
function NeedsBackend() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={50} glyph="code" size={12} />
      <C cx={66} cy={90} glyph="database" />
      <C cx={94} cy={90} glyph="server" />
      <C cx={66} cy={130} glyph="monitor" />
      <C cx={94} cy={130} glyph="smartphone" />
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

/** The backend we build, checked; infrastructure moves, the written ownership and the runbooks are theirs. */
function StopsBackend() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="server" cx={70} cy={78} size={24} className={styles.glyph} />
      <Copy x={50} y={104} w={40} />
      <Copy x={50} y={114} w={28} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="layers" />
      <Theirs cy={90} glyph="document-text" />
      <Theirs cy={130} glyph="notebook" />
    </>
  );
}

/**
 * /services/software-development/backend-api-development · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The rules written down.: What each record means, who may do what and which system holds the true value, agreed before the code (the five answers below). */
  'wyg-backend-api-development-rules-written-down': RulesWrittenDown,
  /* The riskiest gaps closed first.: Permissions the API fails to enforce and integrations that half-complete come before new features. */
  'wyg-backend-api-development-riskiest-gaps-closed-first': RiskiestGapsClosedFirst,
  /* Tested endpoints.: Each one ships with tests for its failure cases, including retries that charge only once. */
  'wyg-backend-api-development-tested-endpoints': TestedEndpoints,
  /* Integrations planned for failure.: Payment providers, CRMs, ERPs, sign-in providers and the other platforms you depend on, each with a plan for duplicates, timeouts and outage */
  'wyg-backend-api-development-integrations-planned-failure': IntegrationsPlannedFailure,
  /* An API that agents can use safely.: Actions with clear names and plain errors, and permissions that know whether a person or an AI agent is acting. Limits on what an agent may  */
  'wyg-backend-api-development-api-agents-can-use': ApiAgentsCanUse,
  /* A backend your team can run.: The agreed hosting, deployment, monitoring and alerts, with runbooks and notes in your repository. */
  'wyg-backend-api-development-backend-team-can-run': BackendTeamCanRun,
  /* Who does the work: Our engineers build the backend, and designers work through the rules people meet on screen as error messages, missing buttons and statuses. */
  'team-backend-api-development': TeamBackend,
  /* What we need from you: For a live backend: the code, data model, deployment set-up and the screens that call the API. A new product starts from the designs. */
  'needs-backend-api-development': NeedsBackend,
  /* Where our part stops: Large infrastructure and cloud moves stay with your platform team, and who owns each part is written down before the build starts. Afterward */
  'stops-backend-api-development': StopsBackend,
};
