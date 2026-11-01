import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Cursor, Hop, Rect, Switch } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** One search box takes both kinds of query; one key flips it between the exact lookup and the question. */
function SearchEntry() {
  return (
    <>
      <Rect x={40} y={30} w={240} h={40} rx={20} className={styles.frame} />
      {/* The query being typed, its caret at the end. */}
      <Copy x={62} y={50} w={88} />
      <Rect x={156} y={45} w={1} h={10} rx={0} className={styles.glyph} />
      {/* The two modes in the one box: the exact lookup, and the plain question, chosen. */}
      <Rect x={188} y={38} w={84} h={24} rx={12} className={styles.tile} />
      <Glyph name="code" cx={209} cy={50} size={12} className={styles.glyphQuiet} />
      <Rect x={234} y={40} w={36} h={20} rx={10} className={styles.solid} />
      <Glyph name="chat-round-dots" cx={252} cy={50} size={12} className={styles.glyphOn} />
      {/* The one key that flips it, its route ending on the box's edge under the seam between the modes. */}
      <path className={styles.line} d="M230,118 L230,77" />
      <ArrowUp x={230} y={70} />
      <Rect x={212} y={118} w={36} h={26} rx={5} className={styles.frame} />
      <Rect x={212} y={118} w={36} h={24} rx={5} className={styles.frame} />
      <Glyph name="refresh" cx={230} cy={131} size={12} className={styles.glyph} />
      <circle className={styles.node} cx="230" cy="118" r="2.5" />
    </>
  );
}

/** Every result card carries its preview and where it came from: the source and its date. */
function ResultsShowSource() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      {[40, 76, 112].map((y, i) => (
        <g key={y}>
          <Rect x={60} y={y} w={200} h={28} className={styles.tile} />
          <Rect x={68} y={y + 6} w={16} h={16} rx={3} className={styles.soft} />
          <Copy x={94} y={y + 10} w={[72, 60, 80][i] ?? 72} />
          <Copy x={94} y={y + 18} w={[48, 56, 40][i] ?? 48} quiet />
          <C cx={206} cy={y + 14} glyph="document-text" />
          <Copy x={220} y={y + 10} w={28} quiet />
          <Copy x={220} y={y + 18} w={18} quiet />
        </g>
      ))}
    </>
  );
}

/** The generated answer, set apart from the passages it came from, its route forking to each one. */
function AiAnswersSources() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <C cx={50} cy={50} glyph="stars" />
      <Copy x={46} y={74} w={64} />
      <Copy x={46} y={86} w={52} />
      <Copy x={46} y={98} w={60} />
      <Copy x={46} y={110} w={36} quiet />
      <path
        className={styles.line}
        d="M130,90 L150,90 M150,90 L150,56 A6,6 0 0 1 156,50 L163,50 M150,90 L150,124 A6,6 0 0 0 156,130 L163,130"
      />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      {[50, 130].map((cy) => (
        <g key={cy}>
          <ArrowRight x={170} y={cy} />
          <Rect x={170} y={cy - 20} w={120} h={40} rx={8} className={styles.frame} />
          <Glyph name="document-text" cx={188} cy={cy} size={14} className={styles.glyph} />
          <Rect x={202} y={cy - 8} w={76} h={16} rx={4} className={styles.region} />
          <path className={styles.regionCopy} d={`M208,${cy} L${cy === 50 ? 262 : 250},${cy}`} />
        </g>
      ))}
    </>
  );
}

/** The pick opens onto its reasons, what was left out, and a preference the person can switch. */
function RecommendationsExplain() {
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Rect x={46} y={56} w={68} h={36} className={styles.soft} />
      <Copy x={46} y={108} w={56} />
      <Copy x={46} y={120} w={40} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Glyph name="check-circle" cx={190} cy={52} size={14} className={styles.glyph} />
      <Copy x={204} y={52} w={56} />
      <Glyph name="check-circle" cx={190} cy={76} size={14} className={styles.glyph} />
      <Copy x={204} y={76} w={44} />
      <Glyph name="close-circle" cx={190} cy={100} size={14} className={styles.glyphQuiet} />
      <Copy x={204} y={100} w={40} quiet />
      <Glyph name="user" cx={190} cy={130} size={14} className={styles.glyph} />
      <Copy x={204} y={130} w={24} />
      <Rect x={244} y={118} w={36} h={24} rx={12} className={styles.halo} />
      <Switch x={250} y={124} on />
    </>
  );
}

/** The answer's sources, and the person striking out the one that was wrong. */
function Corrections() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <C cx={74} cy={54} glyph="stars" />
      <Copy x={92} y={50} w={120} />
      <Copy x={92} y={62} w={84} quiet />
      <path className={styles.rule} d="M50,86 L270,86" />
      {[64, 124].map((x) => (
        <g key={x}>
          <Rect x={x} y={106} w={52} h={24} rx={12} className={styles.tile} />
          <Glyph name="document-text" cx={x + 16} cy={118} size={12} className={styles.glyph} />
          <Copy x={x + 28} y={118} w={14} quiet />
        </g>
      ))}
      {/* Excluded: the source that misled the answer, set aside; its badge sits on the corner, the dash
          broken under its halo, and the cursor's tip on it. */}
      <Rect x={184} y={106} w={52} h={24} rx={12} className={styles.trailFrame} />
      <Glyph name="document-text" cx={200} cy={118} size={12} className={styles.glyphQuiet} />
      <circle className={styles.halo} cx="234" cy="108" r="14" />
      <Glyph name="close-circle" cx={234} cy={108} size={16} className={styles.glyphAccent} />
      <Cursor x={241} y={115} />
    </>
  );
}

/** The chosen result lands in the field of the screen where the work happens, the same thing, not retyped. */
function NextStep() {
  return (
    <>
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      {[42, 114].map((y) => (
        <g key={y}>
          <Rect x={40} y={y} w={60} h={24} className={styles.tile} />
          <Rect x={46} y={y + 6} w={12} h={12} rx={3} className={styles.frameQuiet} />
          <Copy x={64} y={y + 12} w={26} quiet />
        </g>
      ))}
      <Rect x={40} y={78} w={60} h={24} className={styles.region} />
      <Rect x={46} y={84} w={12} h={12} rx={3} className={styles.soft} />
      <path className={styles.regionCopy} d="M64,90 L90,90" />
      <Hop x1={110} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={48} w={48} quiet />
      <Rect x={186} y={58} w={88} h={12} className={styles.tile} />
      <Rect x={180} y={76} w={100} h={28} rx={10} className={styles.halo} />
      <Rect x={186} y={82} w={88} h={16} className={styles.region} />
      <Rect x={190} y={84} w={12} h={12} rx={3} className={styles.soft} />
      <path className={styles.regionCopy} d="M208,90 L240,90" />
      <Rect x={186} y={112} w={88} h={12} className={styles.tile} />
      <Rect x={236} y={130} w={38} h={12} rx={6} className={styles.tile} />
    </>
  );
}

/** The client's documents run through the coded version; the answers hold, and the one that drifts is caught. */
function TestOwnContent() {
  return (
    <>
      {/* A sample of the client's documents. */}
      <Rect x={146} y={30} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <Rect x={150} y={34} w={32} h={32} rx={4} className={styles.frameQuiet} />
      <Rect x={154} y={38} w={32} h={32} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={170} cy={54} size={14} className={styles.glyph} />
      {/* Run down into the coded version. */}
      <path className={styles.line} d="M170,70 L170,83" />
      <g transform="rotate(180 170 90)">
        <ArrowUp x={170} y={90} />
      </g>
      <circle className={styles.node} cx="170" cy="70" r="2.5" />
      <Rect x={30} y={90} w={260} h={60} rx={8} className={styles.frame} />
      <Chip x={42} y={110} glyph="code" />
      {/* Its answers: two hold, the third has drifted and is caught, lit as a finding. */}
      {[69, 141].map((x) => (
        <g key={x}>
          <Rect x={x} y={102} w={58} h={32} className={styles.tile} />
          <Glyph name="check-circle" cx={x + 14} cy={118} size={12} className={styles.glyphQuiet} />
          <Copy x={x + 26} y={118} w={22} quiet />
        </g>
      ))}
      <Rect x={207} y={96} w={70} h={44} rx={10} className={styles.halo} />
      <Rect x={213} y={102} w={58} h={32} className={styles.solid} />
      <Glyph name="danger-triangle" cx={242} cy={118} size={12} className={styles.glyphOn} />
    </>
  );
}

/**
 * Who does the work: the senior product designer, lit in the middle, takes the queries people type today
 * and sorts them by the job behind each; the design engineer and the account lead sit either side.
 */
function TeamAiSearch() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {(
        [
          [50, 'code'],
          [130, 'calendar'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <Glyph name="user" cx={50} cy={cy} size={16} className={styles.glyph} />
          <C cx={72} cy={cy} glyph={glyph} />
          <Copy x={88} y={cy} w={26} quiet />
        </g>
      ))}
      <Focus x={60} y={90} glyph="user" size={12} />
      <Copy x={86} y={86} w={30} />
      <Copy x={86} y={96} w={20} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      {(
        [
          [40, 'document-text'],
          [96, 'cart'],
        ] as const
      ).map(([y, glyph]) => (
        <g key={y}>
          <Rect x={182} y={y} w={96} h={44} className={styles.tile} />
          <C cx={198} cy={y + 22} glyph={glyph} />
          {[y + 6, y + 26].map((py, i) => (
            <g key={py}>
              <Rect x={214} y={py} w={54} h={12} rx={6} className={styles.frame} />
              <Copy x={222} y={py + 6} w={i === 0 ? 30 : 22} quiet />
            </g>
          ))}
        </g>
      ))}
    </>
  );
}

/** What we need: real queries, a sample of the documents, and what a person does with a result, gathered into the design. */
function NeedsAiSearch() {
  return (
    <>
      {/* A real query. */}
      <Rect x={30} y={40} w={80} h={20} rx={10} className={styles.frame} />
      <Copy x={44} y={50} w={44} />
      {/* A sample of the documents. */}
      <Rect x={58} y={68} w={44} h={28} rx={4} className={styles.frameQuiet} />
      <Rect x={62} y={72} w={44} h={28} rx={4} className={styles.frameQuiet} />
      <Rect x={66} y={76} w={44} h={28} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={88} cy={90} size={14} className={styles.glyph} />
      {/* What a person does with the result. */}
      <Glyph name="user" cx={38} cy={130} size={16} className={styles.glyph} />
      <Rect x={52} y={120} w={58} h={20} rx={4} className={styles.frame} />
      <Rect x={58} y={124} w={12} h={12} rx={3} className={styles.soft} />
      <Glyph name="arrow-right" cx={96} cy={130} size={12} className={styles.glyphAccent} />
      <path
        className={styles.line}
        d="M110,50 L124,50 A6,6 0 0 1 130,56 L130,124 A6,6 0 0 1 124,130 L110,130 M110,90 L130,90"
      />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.node} cx="110" cy={y} r="2.5" />
      ))}
      <Hop x1={130} x2={170} y={90} />
      <circle className={styles.node} cx="130" cy="90" r="3.5" />
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Copy x={186} y={58} w={48} />
      <Copy x={186} y={70} w={72} quiet />
      <Hatched x={186} y={86} w={88} h={38} />
    </>
  );
}

/** Where our part stops: what people see, check and do, designed; retrieval, ranking and the model handed across. */
function StopsAiSearch() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <C cx={54} cy={54} glyph="eye" />
      <Copy x={70} y={54} w={56} />
      <C cx={54} cy={84} glyph="check-circle" />
      <Copy x={70} y={84} w={44} />
      <Rect x={40} y={104} w={68} h={32} rx={16} className={styles.halo} />
      <Rect x={46} y={110} w={56} h={20} rx={10} className={styles.solid} />
      <Glyph name="arrow-right" cx={74} cy={120} size={12} className={styles.glyphOn} />
      {(
        [
          [50, 'database'],
          [90, 'graph-up'],
          [130, 'cpu'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <path className={styles.trail} d={`M150,${cy} L190,${cy}`} />
          <circle className={styles.nodeOpen} cx={150} cy={cy} r={3} />
          <Rect x={190} y={cy - 14} w={100} h={28} rx={8} className={styles.trailFrame} />
          <C cx={206} cy={cy} glyph={glyph} />
          <Copy x={222} y={cy} w={52} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /services/ai-product-ux/ai-search-recommendation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Search entry.: Exact lookups and plain-language questions in one box, with a one-key switch between them. */
  'wyg-ai-search-recommendation-search-entry': SearchEntry,
  /* Results that show their source.: Cards and previews with the source, its date and what it covers. */
  'wyg-ai-search-recommendation-results-show-their-source': ResultsShowSource,
  /* AI answers with sources.: Generated summaries kept visibly apart from the passages behind them, and a plain message when nothing in your content supports an answer. */
  'wyg-ai-search-recommendation-ai-answers-sources': AiAnswersSources,
  /* Recommendations that explain themselves.: The reasons behind each pick, what was left out, what happens on accepting it, and preferences people can change. */
  'wyg-ai-search-recommendation-recommendations-explain-themselves': RecommendationsExplain,
  /* Corrections.: Exclude a source, fix a name, narrow the search or fall back to the raw results, plus a way to flag a bad answer that your team learns from. */
  'wyg-ai-search-recommendation-corrections': Corrections,
  /* The next step.: The chosen result carried straight into the screen where the work happens, so nobody copies it across by hand. */
  'wyg-ai-search-recommendation-next-step': NextStep,
  /* A test on your own content.: A coded version run against a sample of your documents, showing where answers drift before engineering builds it. */
  'wyg-ai-search-recommendation-test-own-content': TestOwnContent,
  /* Who does the work: Your senior product designer starts from the queries people type today, sorted by the job behind each. A design engineer runs the test on yo */
  'team-ai-search-recommendation': TeamAiSearch,
  /* What we need from you: A set of real queries, a sample of your documents, and what people do with a result once they find it. */
  'needs-ai-search-recommendation': NeedsAiSearch,
  /* Where our part stops: We design what people see, check and do. Retrieval, ranking and model quality stay with your engineers, or with ours through AI Product Engi */
  'stops-ai-search-recommendation': StopsAiSearch,
};
