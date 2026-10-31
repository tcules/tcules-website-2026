import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowUp, Copy, Hop, Rect, Switch } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** Each step of the task set to its own level, from suggest to act alone: four steps, four sliders. */
function LevelEachStep() {
  const rows: [number, IconName, number, boolean][] = [
    [54, 'document-text', 0, false],
    [78, 'database', 2, false],
    [102, 'chat-round-dots', 1, false],
    [126, 'widget', 3, true],
  ];
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      {rows.map(([cy, glyph, level, lit]) => {
        const kx = 150 + level * 30;
        return (
          <g key={cy}>
            <C cx={84} cy={cy} glyph={glyph} />
            <Copy x={100} y={cy} w={26} quiet />
            <Rect x={150} y={cy - 2} w={96} h={4} rx={2} className={styles.tile} />
            <Rect
              x={150}
              y={cy - 2}
              w={kx - 150}
              h={4}
              rx={2}
              className={lit ? styles.solid : styles.soft}
            />
            {lit ? <circle className={styles.halo} cx={kx} cy={cy} r="12" /> : null}
            <circle className={lit ? styles.solid : styles.tile} cx={kx} cy={cy} r="6" />
          </g>
        );
      })}
    </>
  );
}

/** Before it starts, the goal, data and tools it may use; while it works, its plan in progress, with a pause. */
function ScreensStartMiddleJob() {
  return (
    <>
      {/* The start: the goal it understood, the data it reads, the tools it may use. */}
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={46} y={58} w={36} quiet />
      <Glyph name="flag" cx={52} cy={80} size={14} className={styles.glyph} />
      <Copy x={66} y={80} w={44} />
      <C cx={54} cy={108} glyph="database" />
      <C cx={78} cy={108} glyph="widget" />
      <C cx={102} cy={108} glyph="key" />
      <Hop x1={130} x2={170} y={90} />
      {/* The middle: the plan, its progress, and the control to pause. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={48} w={40} quiet />
      <Rect x={186} y={60} w={88} h={6} rx={3} className={styles.tile} />
      <Rect x={186} y={60} w={52} h={6} rx={3} className={styles.soft} />
      {[84, 100].map((y) => (
        <g key={y}>
          <Glyph name="check-circle" cx={192} cy={y} size={12} className={styles.glyphQuiet} />
          <Copy x={204} y={y} w={32} />
        </g>
      ))}
      <circle className={styles.tile} cx="192" cy="116" r="4.5" />
      <Copy x={204} y={116} w={24} quiet />
      <Focus x={262} y={124} glyph="chrome-pause" size={12} />
    </>
  );
}

/** Where it stops, the screen says what was done, what failed and what is still open, and hands the task to a person. */
function ScreensPauseFinish() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={40} quiet />
      <Glyph name="check-circle" cx={52} cy={74} size={14} className={styles.glyph} />
      <Copy x={66} y={74} w={80} />
      <Glyph name="close-circle" cx={52} cy={98} size={14} className={styles.glyph} />
      <Copy x={66} y={98} w={64} />
      <Hatched x={46} y={116} w={112} h={16} />
      <Hop x1={190} x2={230} y={90} />
      <Rect x={230} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={260} y={90} glyph="user" size={12} />
    </>
  );
}

/** Routine steps approved once, as a group; the one risky step asks on its own. */
function AgentApprovalFlows() {
  return (
    <>
      {/* The low-risk steps, grouped under one approval. */}
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.tile} />
      {[52, 72, 92].map((y) => (
        <g key={y}>
          <Rect x={42} y={y} w={76} h={14} rx={4} className={styles.frame} />
          <Copy x={50} y={y + 7} w={36} quiet />
        </g>
      ))}
      <Rect x={42} y={116} w={36} h={12} rx={6} className={styles.frame} />
      <Glyph name="check-circle" cx={60} cy={122} size={9} className={styles.glyphQuiet} />
      <Hop x1={130} x2={170} y={90} />
      {/* The risky step: its own clear request. */}
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Glyph name="danger-triangle" cx={192} cy={62} size={16} className={styles.glyph} />
      <Copy x={208} y={58} w={56} />
      <Copy x={208} y={68} w={36} quiet />
      <Copy x={186} y={90} w={88} quiet />
      <Rect x={180} y={106} w={60} h={28} rx={14} className={styles.halo} />
      <Rect x={186} y={112} w={48} h={16} rx={8} className={styles.solid} />
      <Rect x={246} y={112} w={32} h={16} rx={8} className={styles.tile} />
    </>
  );
}

/** The user sets how far the agent reads, one record, not the workspace, and whether it remembers. */
function AccessMemoryControls() {
  const sheet = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`}>
      <Rect x={cx - 14} y={cy - 10} w={28} h={20} rx={4} className={styles.tile} />
      <Glyph name="document-text" cx={cx} cy={cy} size={12} className={styles.glyphQuiet} />
    </g>
  );
  return (
    <>
      {/* The workspace: every record, one in reach. */}
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frameQuiet} />
      {[60, 140].map((cx) => sheet(cx, 70))}
      {[60, 100, 140].map((cx) => sheet(cx, 110))}
      <Rect x={80} y={54} w={40} h={32} rx={10} className={styles.halo} />
      <Rect x={86} y={60} w={28} h={20} rx={4} className={styles.region} />
      <Glyph name="document-text" cx={100} cy={70} size={12} className={styles.glyphAccent} />
      <Hop x1={210} x2={170} y={90} />
      {/* The controls: what it reads, what it remembers. */}
      <Rect x={210} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="eye" cx={228} cy={74} size={14} className={styles.glyph} />
      <Rect x={242} y={68} w={36} h={12} rx={6} className={styles.tile} />
      <Rect x={242} y={68} w={18} h={12} rx={6} className={styles.soft} />
      <Glyph name="notebook" cx={228} cy={106} size={14} className={styles.glyph} />
      <Switch x={254} y={100} on={false} />
    </>
  );
}

/** Every change it makes has a way back, shown before it acts: the change, and the undo route home. */
function UndoRepair() {
  return (
    <>
      {/* Before and after: the change. */}
      <Rect x={50} y={40} w={80} h={60} rx={8} className={styles.frame} />
      <Copy x={62} y={56} w={32} quiet />
      <Copy x={62} y={70} w={52} />
      <Copy x={62} y={82} w={40} quiet />
      <path className={styles.rule} d="M130,70 L183,70" />
      <path className={styles.quietMark} d="M190,70 L183,66 L183,74 Z" />
      <Rect x={190} y={40} w={80} h={60} rx={8} className={styles.frame} />
      <Copy x={202} y={56} w={32} quiet />
      <Rect x={202} y={64} w={56} h={12} className={styles.region} />
      <Copy x={202} y={88} w={40} quiet />
      {/* The way back. */}
      <path className={styles.line} d="M230,100 L230,124 A6,6 0 0 1 224,130 L178,130" />
      <path className={styles.line} d="M142,130 L96,130 A6,6 0 0 1 90,124 L90,107" />
      <ArrowUp x={90} y={100} />
      <circle className={styles.node} cx="230" cy="100" r="2.5" />
      <Focus x={160} y={130} glyph="undo-left" size={12} />
    </>
  );
}

/** The riskiest step lifted out and run in code on sample data, for the team to watch. */
function RiskiestStepCode() {
  return (
    <>
      {/* The task's steps, the risky one in the middle. */}
      {[40, 120].map((y) => (
        <g key={y}>
          <Rect x={30} y={y} w={80} h={20} rx={4} className={styles.tile} />
          <Copy x={42} y={y + 10} w={44} quiet />
        </g>
      ))}
      {/* The risky step, lifted proud of the column. */}
      <Rect x={42} y={80} w={80} h={20} rx={4} className={styles.frame} />
      <Glyph name="danger-triangle" cx={56} cy={90} size={12} className={styles.glyph} />
      <Copy x={68} y={90} w={40} />
      <Hop x1={122} x2={150} y={90} />
      {/* That step, coded, on sample data, watched. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={162} y={42} glyph="code" />
      <Copy x={166} y={66} w={48} quiet />
      <Copy x={178} y={78} w={60} />
      <Copy x={178} y={90} w={44} />
      <Copy x={166} y={102} w={32} quiet />
      <C cx={174} cy={126} glyph="database" />
      <Copy x={190} y={126} w={28} quiet />
      <Focus x={262} y={122} glyph="eye" size={12} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead, with the design engineer who builds the coded step. */
function TeamAiCopilotsAgents() {
  const cy = 90;
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={cy} glyph="code" />
      <Copy x={250} y={cy} w={26} quiet />
      <Hop x1={216} x2={180} y={cy} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The people who do the task; the records, tools and permissions; the person who says what waits (lit). */
function NeedsAiCopilotsAgents() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={80} cy={50} glyph="users-group-rounded" />
      {(['database', 'widget', 'key'] as const).map((glyph, i) => (
        <C key={glyph} cx={52 + i * 28} cy={90} glyph={glyph} />
      ))}
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

/** Our limits, screens and controls, designed; the build, the model and its accuracy, and expert sign-off are theirs. */
function StopsAiCopilotsAgents() {
  return (
    <>
      {/* Our last piece: the agent's screen with its limit and its control. */}
      {[2, 1].map((n) => (
        <Rect
          key={n}
          x={30 - n * 4}
          y={50 - n * 4}
          w={80}
          h={80}
          rx={8}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="lock" />
      <Copy x={42} y={86} w={48} />
      <Copy x={42} y={98} w={32} quiet />
      <Switch x={42} y={108} on={false} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: the build; the model and its accuracy; the expert's sign-off. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['code']} />
      <Theirs cy={90} glyphs={['cpu']} />
      <Theirs cy={130} glyphs={['clipboard-check']} />
    </>
  );
}

/**
 * /services/ai-product-ux/ai-copilots-agents · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A level for each step.: Whether the AI suggests, prepares, acts after approval, acts within limits or hands back, agreed with you step by step through the task. */
  'wyg-ai-copilots-agents-level-each-step': LevelEachStep,
  /* Screens for the start and the middle of a job.: Before it starts, the goal it understood, the data it can read and the tools it may use. While it works, the plan and progress, with control */
  'wyg-ai-copilots-agents-screens-start-middle-job': ScreensStartMiddleJob,
  /* Screens for the pause and the finish.: When it needs a person, the proposed action, what it rests on and what will change. When it finishes or stops partway, what happened, what f */
  'wyg-ai-copilots-agents-screens-pause-finish': ScreensPauseFinish,
  /* Agent approval flows.: One clear request for each risky step, and low-risk steps grouped so people approve a plan once. */
  'wyg-ai-copilots-agents-agent-approval-flows': AgentApprovalFlows,
  /* Access and memory controls.: Whether the agent reads one record or the whole workspace, and what it remembers, shown where users can see and change it. */
  'wyg-ai-copilots-agents-access-memory-controls': AccessMemoryControls,
  /* Undo and repair.: Undo for anything your product can reverse, and for the rest, a record of what changed and a way to put it right, shown before the agent act */
  'wyg-ai-copilots-agents-undo-repair': UndoRepair,
  /* The riskiest step in code.: A coded version on sample data, so your team watches the agent at work before engineering commits. */
  'wyg-ai-copilots-agents-riskiest-step-code': RiskiestStepCode,
  /* Who does the work: A senior product designer, hands-on throughout, starts by sitting with the people who do the task today. A design engineer builds the coded  */
  'team-ai-copilots-agents': TeamAiCopilotsAgents,
  /* What we need from you: Time with the people who do the task, the records, tools and permissions the AI may use, and someone who can say which actions must wait for */
  'needs-ai-copilots-agents': NeedsAiCopilotsAgents,
  /* Where our part stops: We design the agent's limits, screens and controls. Your engineers build them, or AI Product Engineering builds them with you, and model cho */
  'stops-ai-copilots-agents': StopsAiCopilotsAgents,
};
