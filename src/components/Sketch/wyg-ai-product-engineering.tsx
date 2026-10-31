import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, ArrowRight, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** An answer drawn from your own documents, with its source shown under it (the lit source). */
function WorkingAiFeature() {
  return (
    <>
      {/* Your documents and records: one of many. */}
      <Rect x={30} y={42} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={34} y={46} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={38} y={50} w={72} h={80} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={58} cy={70} size={16} className={styles.glyph} />
      <Copy x={50} y={92} w={44} />
      <Copy x={50} y={104} w={32} quiet />
      <Copy x={50} y={116} w={40} quiet />
      <Hop x1={110} x2={170} y={90} />
      {/* The answer, and the sources it came from beneath it. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={192} cy={50} size={14} className={styles.glyph} />
      <Copy x={206} y={50} w={40} quiet />
      <Copy x={186} y={70} w={88} />
      <Copy x={186} y={82} w={72} />
      <Copy x={186} y={94} w={80} />
      <Focus x={204} y={124} glyph="document-text" size={12} />
      <Rect x={232} y={116} w={42} h={16} rx={8} className={styles.tile} />
      <Copy x={242} y={124} w={22} quiet />
    </>
  );
}

/** The model reads only the records this person may see; the rest stay locked. */
function DataInsideEachUsers() {
  const rows: [number, boolean, number][] = [
    [38, true, 72],
    [66, false, 56],
    [94, true, 88],
    [122, false, 64],
  ];
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={60} y={90} glyph="user" size={12} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frameQuiet} />
      {rows.map(([y, open, w]) =>
        open ? (
          <g key={y}>
            <Rect x={142} y={y} w={136} h={20} className={styles.frame} />
            <Glyph name="document-text" cx={156} cy={y + 10} size={12} className={styles.glyph} />
            <Copy x={170} y={y + 10} w={w} />
          </g>
        ) : (
          <g key={y}>
            <Rect x={142} y={y} w={136} h={20} className={styles.tile} />
            <Glyph name="lock" cx={156} cy={y + 10} size={12} className={styles.glyphQuiet} />
            <Copy x={170} y={y + 10} w={w} quiet />
          </g>
        ),
      )}
    </>
  );
}

/** The same known-good tasks run again, round the loop, every one still ticked. */
function TestsYouCanRerun() {
  const rows: [number, number][] = [
    [50, 56],
    [70, 40],
    [90, 64],
    [110, 48],
    [130, 60],
  ];
  return (
    <>
      <Rect x={70} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {rows.map(([y, w]) => (
        <g key={y}>
          <Rect x={84} y={y - 7} w={92} h={14} className={styles.tile} />
          <Copy x={92} y={y} w={w} quiet />
          <Glyph name="check-circle" cx={194} cy={y} size={12} className={styles.glyph} />
        </g>
      ))}
      {/* The rerun: out at the last task, round, and back in at the first. */}
      <path className={styles.line} d="M210,130 L244,130 A6,6 0 0 0 250,124 L250,108" />
      <path className={styles.line} d="M250,72 L250,56 A6,6 0 0 0 244,50 L217,50" />
      <ArrowLeft x={210} y={50} />
      <circle className={styles.node} cx="210" cy="130" r="2.5" />
      <Focus x={250} y={90} glyph="refresh" size={12} />
    </>
  );
}

/** Three models compared; the one that wins sits in the code's one slot (lit), ready to be swapped. */
function ModelChosenEachTask() {
  const models: [number, number, boolean][] = [
    [50, 28, false],
    [90, 48, true],
    [130, 20, false],
  ];
  return (
    <>
      {models.map(([cy, w, won]) => (
        <g key={cy}>
          <Rect x={30} y={cy - 14} w={100} h={28} rx={8} className={won ? styles.frame : styles.frameQuiet} />
          <C cx={48} cy={cy} glyph="cpu" />
          <Rect x={66} y={cy - 3} w={52} h={6} rx={3} className={styles.tile} />
          <Rect x={66} y={cy - 3} w={w} h={6} rx={3} className={won ? styles.solid : styles.knob} />
        </g>
      ))}
      <Hop x1={130} x2={190} y={90} />
      {/* The code: one place holds the choice. */}
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M206,40 L206,140" />
      <Copy x={218} y={56} w={48} quiet />
      <Copy x={218} y={68} w={36} quiet />
      <Rect x={216} y={76} w={64} h={28} rx={10} className={styles.halo} />
      <Rect x={222} y={82} w={52} h={16} className={styles.solid} />
      <Glyph name="cpu" cx={234} cy={90} size={10} className={styles.glyphOn} />
      <path className={styles.tick} d="M246,90 L264,90" />
      <Copy x={218} y={112} w={52} quiet />
      <Copy x={218} y={124} w={32} quiet />
    </>
  );
}

/** A person overrules the AI and says why; the reason joins the test list as a new test (lit). */
function CorrectionsBecomeTests() {
  return (
    <>
      <Rect x={30} y={30} w={110} h={120} rx={8} className={styles.frame} />
      {/* The AI's answer, overruled. */}
      <Glyph name="stars" cx={48} cy={50} size={14} className={styles.glyphQuiet} />
      <Copy x={62} y={50} w={40} quiet />
      <Glyph name="close-circle" cx={122} cy={50} size={12} className={styles.glyph} />
      <Copy x={46} y={66} w={64} quiet />
      {/* The person's correction, with the reason kept. */}
      <Rect x={42} y={86} w={86} h={48} className={styles.tile} />
      <Glyph name="user" cx={58} cy={102} size={16} className={styles.glyph} />
      <Glyph name="chat-round-dots" cx={82} cy={102} size={14} className={styles.glyph} />
      <Copy x={96} y={102} w={20} />
      <Copy x={54} y={120} w={56} quiet />
      <path
        className={styles.line}
        d="M140,110 L164,110 A6,6 0 0 1 170,116 L170,124 A6,6 0 0 0 176,130 L183,130"
      />
      <ArrowRight x={190} y={130} />
      <circle className={styles.node} cx="140" cy="110" r="2.5" />
      {/* The test list, and the new test at its foot. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {[48, 70, 92].map((y, i) => (
        <g key={y}>
          <Rect x={202} y={y - 7} w={76} h={14} className={styles.tile} />
          <Glyph name="check-circle" cx={212} cy={y} size={10} className={styles.glyphQuiet} />
          <Copy x={224} y={y} w={[40, 28, 36][i] ?? 32} quiet />
        </g>
      ))}
      <Rect x={196} y={117} w={88} h={26} rx={10} className={styles.halo} />
      <Rect x={202} y={123} w={76} h={14} className={styles.solid} />
      <Glyph name="check-circle" cx={212} cy={130} size={10} className={styles.glyphOn} />
      <path className={styles.tick} d="M224,130 L262,130" />
    </>
  );
}

/** After release, a few customers' answers counted: accepted (lit), edited, rejected. */
function ViewAfterRelease() {
  const rows: [number, IconName, number, boolean][] = [
    [74, 'check-circle', 84, true],
    [100, 'ruler-pen', 40, false],
    [126, 'close-circle', 18, false],
  ];
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={60} cy={90} size={22} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={146} y={48} w={44} quiet />
      {rows.map(([cy, glyph, w, lit]) => (
        <g key={cy}>
          <Glyph name={glyph} cx={154} cy={cy} size={14} className={styles.glyph} />
          <Rect x={172} y={cy - 4} w={102} h={8} rx={4} className={styles.tile} />
          <Rect x={172} y={cy - 4} w={w} h={8} rx={4} className={lit ? styles.solid : styles.knob} />
        </g>
      ))}
    </>
  );
}

/** The documented file lands in your own repository, in its place among your files (lit). */
function DocumentedCodeCodebase() {
  return (
    <>
      {/* Our file: its documentation above the code. */}
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Glyph name="notebook" cx={48} cy={58} size={14} className={styles.glyph} />
      <Copy x={62} y={58} w={44} quiet />
      <Copy x={46} y={72} w={56} quiet />
      <path className={styles.rule} d="M30,80 L130,80" />
      <Copy x={46} y={100} w={48} />
      <Copy x={54} y={112} w={36} />
      <Copy x={46} y={124} w={52} />
      <Hop x1={130} x2={170} y={90} />
      {/* Your codebase: its files, the new one in place among them. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <C cx={192} cy={46} glyph="code-square" />
      <Copy x={206} y={46} w={40} quiet />
      {(
        [
          [186, 62],
          [238, 62],
          [238, 106],
        ] as const
      ).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <Rect x={x} y={y} w={40} h={30} className={styles.tile} />
          <Glyph name="code" cx={x + 20} cy={y + 15} size={12} className={styles.glyphQuiet} />
        </g>
      ))}
      <Rect x={180} y={100} w={52} h={42} rx={10} className={styles.halo} />
      <Rect x={186} y={106} w={40} h={30} className={styles.solid} />
      <Glyph name="code" cx={206} cy={121} size={12} className={styles.glyphOn} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** Designers (lit) and our engineers on the feature together from the first week, an account lead keeping it running. */
function TeamAiProductEngineering() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={220} y={72} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={90} glyph="code" />
      <Copy x={250} y={90} w={26} quiet />
      <Hop x1={216} x2={180} y={90} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** One task the AI must do well (lit), examples of a good result, access to its data within each user's permissions. */
function NeedsAiProductEngineering() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {/* The one task, lit: a smaller disc so its halo keeps 6 clear of the panel's top edge. */}
      <circle className={styles.halo} cx={80} cy={50} r="14" />
      <circle className={styles.solid} cx={80} cy={50} r="8" />
      <Glyph name="checklist" cx={80} cy={50} size={10} className={styles.glyphOn} />
      {[44, 84].map((x) => (
        <g key={x}>
          <Rect x={x} y={78} w={32} h={24} rx={4} className={styles.frame} />
          <Glyph name="check-circle" cx={x + 16} cy={90} size={12} className={styles.glyph} />
        </g>
      ))}
      <C cx={66} cy={130} glyph="database" />
      <C cx={94} cy={130} glyph="lock" />
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

/** The live feature, built to their rules and checked: which providers and regions, security's call, and running the code, stay theirs. */
function StopsAiProductEngineering() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={48} cy={66} size={14} className={styles.glyph} />
      <Copy x={62} y={66} w={32} quiet />
      <Copy x={42} y={84} w={56} />
      <Copy x={42} y={96} w={44} quiet />
      <Rect x={42} y={110} w={36} h={12} rx={4} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="shield-check" />
      <Theirs cy={90} glyph="server" />
      <Theirs cy={130} glyph="code" />
    </>
  );
}

/**
 * /services/software-development/ai-product-engineering · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A working AI feature.: Answers from your own documents and records with the sources shown (engineers call this RAG). Or a copilot that drafts, summarises or fills  */
  'wyg-ai-product-engineering-working-ai-feature': WorkingAiFeature,
  /* Data inside each user's permissions.: The model sees what that person may see, kept current as the records change. */
  'wyg-ai-product-engineering-data-inside-each-users': DataInsideEachUsers,
  /* Tests you can rerun.: Real tasks with known good answers, run again whenever the model or the prompt changes. */
  'wyg-ai-product-engineering-tests-you-can-rerun': TestsYouCanRerun,
  /* A model chosen for each task.: Compared on your own tests for quality, waiting time and cost. The choice sits in one place in the code, so a newer model can be tried, swit */
  'wyg-ai-product-engineering-model-chosen-each-task': ModelChosenEachTask,
  /* Corrections that become tests.: When someone overrules the AI, the design keeps the reason, and the engineers turn it into a new test. */
  'wyg-ai-product-engineering-corrections-become-tests': CorrectionsBecomeTests,
  /* A view after release.: Usage, cost per use and failures, starting with a few customers and watching what they accept, edit and reject. */
  'wyg-ai-product-engineering-view-after-release': ViewAfterRelease,
  /* Documented code in your codebase: Documented code in your codebase, with the permissions and action log an agent will need, and designs for slow, unsure and wrong answers. */
  'wyg-ai-product-engineering-documented-code-codebase': DocumentedCodeCodebase,
  /* Who does the work: Designers from our AI Product UX team and our engineers work on the feature together from the first week, and an account lead keeps it runni */
  'team-ai-product-engineering': TeamAiProductEngineering,
  /* What we need from you: One task the AI must do well, with examples of a good result, which become the first tests. Access to the data that task needs, within each  */
  'needs-ai-product-engineering': NeedsAiProductEngineering,
  /* Where our part stops: Your security and legal teams decide which providers and regions the data may go to, and we build to their rules. Once the feature is live,  */
  'stops-ai-product-engineering': StopsAiProductEngineering,
};
