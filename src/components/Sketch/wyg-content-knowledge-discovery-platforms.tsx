import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A document centred at (cx, cy), `behind` sheets stacked up and to the right: one of many. */
function Sheet({ cx, cy, behind = 0 }: { cx: number; cy: number; behind?: number }) {
  return (
    <>
      {Array.from({ length: behind }, (_, i) => behind - i).map((n) => (
        <Rect
          key={n}
          x={cx - 14 + n * 4}
          y={cy - 10 - n * 4}
          w={28}
          h={20}
          rx={4}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={cx - 14} y={cy - 10} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={cx} cy={cy} size={12} className={styles.glyph} />
    </>
  );
}

/**
 * The searches that fail, looked into: the same query typed again and again, the results it gets
 * empty under the lens, and the support ticket it ends in: a solid card, unlike the dashed
 * engine in the last drawing, because it is the outcome, not a hand-off.
 */
function ReviewSearchesFail() {
  return (
    <>
      {/* The query, repeated: two tries behind the one in front. */}
      <Rect x={38} y={72} w={72} h={20} rx={10} className={styles.frameQuiet} />
      <Rect x={34} y={76} w={72} h={20} rx={10} className={styles.frameQuiet} />
      <Rect x={30} y={80} w={80} h={20} rx={10} className={styles.frame} />
      <Copy x={42} y={90} w={40} />
      <Hop x1={110} x2={150} y={90} />
      {/* Zero results: an empty page, looked at closely. The lens is drawn at copy weight. */}
      <Rect x={150} y={40} w={80} h={100} rx={8} className={styles.trailFrame} />
      <Copy x={162} y={54} w={36} quiet />
      <circle className={styles.frame} cx={190} cy={86} r={18} />
      <circle className={styles.copy} cx={190} cy={86} r={18} />
      <path className={styles.copy} d="M203,99 L212,108" />
      <Glyph name="close-circle" cx={190} cy={86} size={18} className={styles.glyphAccent} />
      {/* The ticket it causes: port to port, dashed, as a hand-off. */}
      <path className={styles.trail} d="M233,90 L247,90" />
      <circle className={styles.nodeOpen} cx={230} cy={90} r={3} />
      <Rect x={250} y={72} w={40} h={36} rx={6} className={styles.frame} />
      <circle className={styles.nodeOpen} cx={250} cy={90} r={3} />
      <Glyph name="chat-round-dots" cx={270} cy={84} size={14} className={styles.glyph} />
      <Copy x={258} y={98} w={24} />
      <Copy x={258} y={104} w={16} quiet />
    </>
  );
}

/** One search box, and the expert and the newcomer both arriving at it. */
function ExpertsNewcomersSameBox() {
  return (
    <>
      <Rect x={70} y={40} w={160} h={20} rx={10} className={styles.region} />
      <Copy x={86} y={50} w={64} />
      <circle className={styles.solid} cx={212} cy={50} r={4} />
      {/* The two routes, joined into one under the box. */}
      <path className={styles.line} d="M90,110 L90,96 A6,6 0 0 1 96,90 L204,90 A6,6 0 0 1 210,96 L210,110" />
      <path className={styles.line} d="M150,90 L150,67" />
      <ArrowUp x={150} y={60} />
      <circle className={styles.node} cx={150} cy={90} r={3.5} />
      {/* The expert, at home with filters; the newcomer, with a question. */}
      {(
        [
          [50, 'stars'],
          [170, 'question-circle'],
        ] as const
      ).map(([x, glyph]) => (
        <g key={x}>
          <Rect x={x} y={110} w={80} h={40} rx={8} className={styles.frame} />
          <circle className={styles.node} cx={x + 40} cy={110} r={2.5} />
          <Glyph name="user" cx={x + 24} cy={130} size={18} className={styles.glyph} />
          <C cx={x + 56} cy={130} glyph={glyph} />
        </g>
      ))}
    </>
  );
}

/** The result worth choosing shows where it came from: its source, owner, version and date. */
function ResultsShowSourceOwner() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      {/* The one worth choosing: its title, then where it came from. */}
      <Copy x={70} y={52} w={104} />
      <Copy x={70} y={64} w={72} quiet />
      {(['document-text', 'user', 'layers', 'calendar'] as const).map((glyph, i) => (
        <C key={glyph} cx={78 + i * 24} cy={86} glyph={glyph} />
      ))}
      <Focus x={238} y={70} glyph="check-circle" size={13} />
      <path className={styles.rule} d="M50,110 L270,110" />
      {/* The rest: a title and nothing to choose by. */}
      <Copy x={70} y={124} w={104} quiet />
      <Copy x={70} y={136} w={72} quiet />
    </>
  );
}

/** The AI's answer, its claim routed back to the passage in the document it came from. */
function AiAnswersLinkedTheir() {
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <C cx={50} cy={60} glyph="stars" />
      <Copy x={46} y={78} w={64} quiet />
      <path className={styles.line} d="M46,90 L106,90" />
      <Copy x={46} y={102} w={56} quiet />
      <Copy x={46} y={114} w={40} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={178} y={32} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={174} y={36} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={170} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={186} y={58} w={48} />
      <Copy x={186} y={70} w={64} quiet />
      <Rect x={182} y={80} w={76} h={22} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M190,86 L248,86" />
      <path className={styles.regionCopy} d="M190,96 L232,96" />
      <Copy x={186} y={114} w={60} quiet />
      <Copy x={186} y={126} w={44} quiet />
    </>
  );
}

/** Each result carries its next step: its action pressed, the next task opens. */
function RouteNextTask() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={54} cy={54} size={20} className={styles.glyph} />
      <Copy x={74} y={50} w={56} />
      <Copy x={74} y={60} w={36} quiet />
      <Copy x={46} y={84} w={84} quiet />
      <Copy x={46} y={94} w={60} quiet />
      <Rect x={46} y={112} w={22} h={14} rx={7} className={styles.tile} />
      <Rect x={74} y={112} w={22} h={14} rx={7} className={styles.tile} />
      <Rect x={102} y={112} w={32} h={14} rx={7} className={styles.solid} />
      <Glyph name="arrow-right" cx={118} cy={119} size={10} className={styles.glyphOn} />
      <Cursor x={124} y={122} />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Copy x={206} y={68} w={40} />
      <Rect x={206} y={80} w={68} h={14} rx={4} className={styles.tile} />
      <Rect x={206} y={100} w={68} h={14} rx={4} className={styles.tile} />
    </>
  );
}

/**
 * The prototype fed on the client's own material: their documents and their queries, two inputs
 * joined into one route, and the screen holds: the tick inside it.
 */
function PrototypesTestedRealDocuments() {
  return (
    <>
      {/* Their documents, a stack. */}
      <Rect x={42} y={48} w={40} h={28} rx={4} className={styles.frameQuiet} />
      <Rect x={46} y={52} w={40} h={28} rx={4} className={styles.frameQuiet} />
      <Rect x={50} y={56} w={40} h={28} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={70} cy={70} size={14} className={styles.glyph} />
      {/* Their queries, a search pill. */}
      <Rect x={50} y={104} w={40} h={12} rx={6} className={styles.frame} />
      <Copy x={58} y={110} w={18} />
      {/* Both routed into the one prototype. */}
      <path className={styles.line} d="M90,70 L124,70 A6,6 0 0 1 130,76 L130,90" />
      <path className={styles.line} d="M90,110 L124,110 A6,6 0 0 0 130,104 L130,90" />
      <path className={styles.line} d="M130,90 L143,90" />
      <ArrowRight x={150} y={90} />
      <circle className={styles.node} cx={90} cy={70} r="2.5" />
      <circle className={styles.node} cx={90} cy={110} r="2.5" />
      <circle className={styles.node} cx={130} cy={90} r="3.5" />
      {/* The prototype screen, and it holds. */}
      <Rect x={150} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Rect x={162} y={52} w={96} h={16} rx={8} className={styles.tile} />
      <Copy x={172} y={60} w={40} />
      <Copy x={162} y={88} w={48} />
      <Copy x={162} y={98} w={32} quiet />
      <Copy x={162} y={116} w={44} />
      <Copy x={162} y={126} w={28} quiet />
      <Focus x={240} y={112} glyph="check-circle" size={13} />
    </>
  );
}

/** A written list between the screens and the search engine: what each screen needs from it. */
function WhatScreensNeedFrom() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={66} w={32} quiet />
      <Rect x={42} y={78} w={56} h={14} rx={4} className={styles.tile} />
      <Copy x={42} y={106} w={44} />
      <Copy x={42} y={116} w={28} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Copy x={164} y={48} w={36} quiet />
      {[70, 90, 110, 130].map((y, i) => (
        <g key={y}>
          <Rect x={164} y={y - 5} w={10} h={10} rx={3} className={styles.solid} />
          <path className={styles.tick} d={`M166.5,${y} L168.5,${y + 2} L171.5,${y - 2}`} />
          <Copy x={182} y={y} w={[34, 26, 32, 22][i] ?? 26} />
        </g>
      ))}
      {/* Handed to their engine: port to port, dashed, the engine stays theirs. */}
      <path className={styles.trail} d="M233,90 L247,90" />
      <circle className={styles.nodeOpen} cx={230} cy={90} r={3} />
      <Rect x={250} y={72} w={36} h={36} rx={8} className={styles.trailFrame} />
      <circle className={styles.nodeOpen} cx={250} cy={90} r={3} />
      <Glyph name="server" cx={268} cy={90} size={18} className={styles.glyph} />
    </>
  );
}

/**
 * Who does the work: the senior product designer leads (lit) with the account lead; researchers sit
 * with the searchers, always in the team; a design engineer joins when results need testing.
 */
function TeamContentKnowledge() {
  const roles: readonly { glyph: IconName; core: boolean; cy: number }[] = [
    { glyph: 'chat-round-dots', core: true, cy: 70 },
    { glyph: 'code', core: false, cy: 110 },
  ];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map(({ glyph, core, cy }) => (
        <g key={glyph}>
          {core ? (
            <Rect x={220} y={cy - 18} w={70} h={28} rx={8} className={styles.frameQuiet} />
          ) : null}
          <Rect
            x={216}
            y={cy - 14}
            w={70}
            h={28}
            rx={8}
            className={core ? styles.frame : styles.trailFrame}
          />
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={250} y={cy} w={26} quiet />
          {core ? (
            <Hop x1={216} x2={180} y={cy} />
          ) : (
            <>
              <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
              <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
            </>
          )}
        </g>
      ))}
    </>
  );
}

/**
 * What we need: search logs with real queries and a sample of the documents; time with the searchers
 * and the search engineers or vendor; an owner for product questions (lit), who says yes or no.
 */
function NeedsContentKnowledge() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Sheet cx={56} cy={54} behind={2} />
      <Rect x={84} y={44} w={32} h={12} rx={6} className={styles.frame} />
      <Copy x={92} y={50} w={14} />
      <C cx={66} cy={90} glyph="users-group-rounded" />
      <C cx={94} cy={90} glyph="server" />
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

/** One row of what stays theirs: its chip, then a heading line and a quiet one. */
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
 * Where our part stops: the screens and the brief on what they depend on, handed over to our check;
 * ranking, indexing and relevance tuning stay on the client's side, nothing routed into them.
 */
function StopsContentKnowledge() {
  return (
    <>
      <Rect x={30} y={42} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={34} y={46} w={72} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={38} y={50} w={72} h={80} rx={8} className={styles.frame} />
      <Rect x={50} y={62} w={48} h={12} rx={6} className={styles.tile} />
      <Copy x={50} y={88} w={44} />
      <Copy x={50} y={98} w={32} quiet />
      <Copy x={50} y={114} w={40} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="graph-up" />
      <Theirs cy={90} glyph="database" />
      <Theirs cy={130} glyph="cpu" />
    </>
  );
}

/**
 * /expertise/content-knowledge-discovery-platforms · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A review of the searches that fail: A review of the searches that fail: zero results, repeated queries and the support tickets they cause */
  'wyg-content-knowledge-discovery-platforms-review-searches-fail': ReviewSearchesFail,
  /* Experts and newcomers in the same box: Search, filters and browsing that serve experts and newcomers in the same box */
  'wyg-content-knowledge-discovery-platforms-experts-newcomers-same-box': ExpertsNewcomersSameBox,
  /* Results that show source and owner: Results that show source, owner, version and date where they help someone choose */
  'wyg-content-knowledge-discovery-platforms-results-show-source-owner': ResultsShowSourceOwner,
  /* AI answers linked to their passages: AI answers that link to the passages and documents behind them, and citation, provenance and saved-search views for researchers who cite wha */
  'wyg-content-knowledge-discovery-platforms-ai-answers-linked-their': AiAnswersLinkedTheir,
  /* A route to the next task: A route from each result to the next task: add, share, cite or configure */
  'wyg-content-knowledge-discovery-platforms-route-next-task': RouteNextTask,
  /* Prototypes tested with your real documents: Prototypes tested with your real documents and your real queries */
  'wyg-content-knowledge-discovery-platforms-prototypes-tested-real-documents':
    PrototypesTestedRealDocuments,
  /* What the screens need from your search engine: A written list of what the screens need from your search engine */
  'wyg-content-knowledge-discovery-platforms-what-screens-need-from': WhatScreensNeedFrom,
  /* Who does the work: A senior product designer is your lead and does the design work, and an account lead keeps it running. Researchers sit with your searchers,  */
  'team-content-knowledge-discovery-platforms': TeamContentKnowledge,
  /* What we need from you: Search logs and real queries, a sample of your documents, time with expert and newcomer searchers, and your search engineers or vendor. We a */
  'needs-content-knowledge-discovery-platforms': NeedsContentKnowledge,
  /* Where our part stops: Ranking, indexing and relevance tuning stay with your search engineers or vendor, with a clear brief from the design on what the screens dep */
  'stops-content-knowledge-discovery-platforms': StopsContentKnowledge,
};
