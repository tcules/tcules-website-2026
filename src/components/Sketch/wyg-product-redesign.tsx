import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The one arrowhead pointing down, tip at (x, y). */
const ArrowDown = ({ x, y }: { x: number; y: number }) => (
  <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** What customers rely on, each habit sorted into one of four groups with its reason; the habit worth
 *  keeping lit. */
function RecordWhatCustomersRely() {
  const groups: [number, number, IconName][] = [
    [146, 46, 'check-circle'],
    [220, 46, 'danger-triangle'],
    [146, 100, 'refresh'],
    [220, 100, 'clock-circle'],
  ];
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={82} size={20} className={styles.glyph} />
      <Copy x={46} y={104} w={28} quiet />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Rect x={140} y={40} w={66} h={46} rx={10} className={styles.halo} />
      {groups.map(([x, y, glyph], i) => (
        <g key={glyph}>
          <Rect x={x} y={y} w={54} h={34} className={i === 0 ? styles.region : styles.tile} />
          <Glyph
            name={glyph}
            cx={x + 13}
            cy={y + 12}
            size={12}
            className={i === 0 ? styles.glyphAccent : styles.glyph}
          />
          <path
            className={i === 0 ? styles.regionCopy : styles.copyQuiet}
            d={`M${x + 8},${y + 25} L${x + 42},${y + 25}`}
          />
        </g>
      ))}
    </>
  );
}

/** Interviews, analytics and support history, each pinned to the one row of the live product causing the trouble. */
function ResearchDiagnosis() {
  return (
    <>
      {/* The live product, its troubled row lit. */}
      <Rect x={30} y={40} w={170} h={100} rx={8} className={styles.frame} />
      {[50, 114].map((y, i) => (
        <g key={y}>
          <Rect x={44} y={y} w={142} h={16} className={styles.tile} />
          <Copy x={52} y={y + 8} w={i === 0 ? 76 : 96} quiet />
        </g>
      ))}
      <Rect x={38} y={76} w={154} h={28} rx={10} className={styles.halo} />
      <Rect x={44} y={82} w={142} h={16} className={styles.solid} />
      <Glyph name="danger-triangle" cx={115} cy={90} size={12} className={styles.glyphOn} />
      {/* The evidence: interviews, analytics, support history, each run back to that row. */}
      {(
        [
          [50, 'microphone'],
          [90, 'graph-up'],
          [130, 'chat-round-dots'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={glyph}>
          <Rect x={264} y={cy - 12} w={24} h={24} rx={6} className={styles.frame} />
          <Glyph name={glyph} cx={276} cy={cy} size={14} className={styles.glyph} />
        </g>
      ))}
      <path
        className={styles.line}
        d="M264,50 L236,50 A6,6 0 0 0 230,56 L230,84 A6,6 0 0 1 224,90 M264,130 L236,130 A6,6 0 0 1 230,124 L230,96 A6,6 0 0 0 224,90 M264,90 L200,90"
      />
      <circle className={styles.node} cx="200" cy="90" r="3.5" />
    </>
  );
}

/** The step that caused friction, routed around: the workflow runs straight to the step that finishes the job. */
function StructureWorkflows() {
  return (
    <>
      {[50, 110].map((x) => (
        <g key={x}>
          <Rect x={x} y={70} w={40} h={40} rx={8} className={styles.frame} />
          <Copy x={x + 10} y={84} w={20} quiet />
          <Copy x={x + 10} y={96} w={14} quiet />
        </g>
      ))}
      <Hop x1={90} x2={110} y={90} />
      {/* The step people got stuck on, set aside. */}
      <Rect x={170} y={70} w={40} h={40} rx={8} className={styles.trailFrame} />
      <Glyph name="danger-triangle" cx={190} cy={90} size={14} className={styles.glyphQuiet} />
      <path className={styles.trail} d="M150,90 L170,90 M210,90 L230,90" />
      {/* The finished step, reached directly. */}
      <Rect x={224} y={64} w={52} h={52} rx={12} className={styles.halo} />
      <Rect x={230} y={70} w={40} h={40} rx={8} className={styles.solid} />
      <Glyph name="check-circle" cx={250} cy={90} size={16} className={styles.glyphOn} />
      <circle className={styles.node} cx="130" cy="70" r="2.5" />
      <TraceIn d="M130,70 L130,56 A6,6 0 0 1 136,50 L244,50 A6,6 0 0 1 250,56 L250,63" />
      <ArrowDown x={250} y={70} />
    </>
  );
}

/** One screen drawn loading, empty and failing; the failure, the state usually forgotten, designed and lit. */
function ScreensEveryState() {
  return (
    <>
      {/* Loading. */}
      <Rect x={32} y={50} w={64} h={80} rx={8} className={styles.frame} />
      {[66, 80, 94, 108].map((y, i) => (
        <Rect key={y} x={44} y={y} w={[40, 28, 36, 24][i] ?? 30} h={6} rx={3} className={styles.tile} />
      ))}
      {/* Empty. */}
      <Rect x={124} y={50} w={64} h={80} rx={8} className={styles.frame} />
      <Glyph name="database" cx={156} cy={82} size={18} className={styles.glyphQuiet} />
      <Copy x={142} y={106} w={28} quiet />
      {/* Failed, with the way back. */}
      <Rect x={210} y={44} w={76} h={92} rx={12} className={styles.halo} />
      <Rect x={216} y={50} w={64} h={80} rx={8} className={styles.frame} />
      <Glyph name="danger-triangle" cx={248} cy={76} size={18} className={styles.glyph} />
      <Copy x={234} y={98} w={28} quiet />
      <Rect x={232} y={108} w={32} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/** One component in the design system, carried into every screen that needs it, the same each time. */
function SharedComponents() {
  return (
    <>
      <Rect x={110} y={30} w={100} h={40} rx={8} className={styles.tile} />
      <Rect x={132} y={38} w={56} h={24} rx={12} className={styles.halo} />
      <Rect x={138} y={44} w={44} h={12} rx={6} className={styles.solid} />
      <path className={styles.line} d="M160,70 L160,103" />
      <path
        className={styles.line}
        d="M160,90 L86,90 A6,6 0 0 0 80,96 L80,103 M160,90 L234,90 A6,6 0 0 1 240,96 L240,103"
      />
      <circle className={styles.node} cx="160" cy="70" r="2.5" />
      <circle className={styles.node} cx="160" cy="90" r="3.5" />
      {[80, 160, 240].map((cx) => (
        <g key={cx}>
          <ArrowDown x={cx} y={110} />
          <Rect x={cx - 35} y={110} w={70} h={40} rx={8} className={styles.frame} />
          <Copy x={cx - 23} y={122} w={30} quiet />
          <Rect x={cx - 23} y={130} w={32} h={12} rx={6} className={styles.region} />
        </g>
      ))}
    </>
  );
}

/** The old version kept running while the new one arrives a workflow at a time, the first workflow lit. */
function RolloutPlan() {
  return (
    <>
      {/* The old version, still in use. */}
      <Rect x={40} y={46} w={240} h={24} rx={8} className={styles.frame} />
      <Glyph name="monitor" cx={56} cy={58} size={12} className={styles.glyphQuiet} />
      <Copy x={70} y={58} w={36} quiet />
      <Copy x={180} y={58} w={64} quiet />
      <circle className={styles.node} cx="70" cy="70" r="2.5" />
      {/* Its live end: the old version stays on. */}
      <circle className={styles.node} cx="280" cy="58" r="3.5" />
      <path className={styles.line} d="M280,58 L290,58" />
      <TraceIn d="M70,70 L70,104 A6,6 0 0 0 76,110 L97,110" />
      <ArrowRight x={104} y={110} />
      {/* The new version, workflow by workflow: the first goes live beside the old. */}
      <Rect x={104} y={90} w={62} h={40} rx={12} className={styles.halo} />
      <Rect x={110} y={96} w={50} h={28} rx={8} className={styles.solid} />
      <Glyph name="flag" cx={135} cy={110} size={14} className={styles.glyphOn} />
      {[172, 228].map((x) => (
        <g key={x}>
          <Rect x={x} y={96} w={46} h={28} rx={8} className={styles.trailFrame} />
          <Copy x={x + 11} y={110} w={24} quiet />
        </g>
      ))}
    </>
  );
}

/** The design goes one of two ways: specs your developers build from, or our build, checked against the design. */
function SpecificationsOrBuild() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={44} y={66} w={32} quiet />
      <Rect x={44} y={78} w={52} h={24} className={styles.tile} />
      <Copy x={44} y={114} w={40} quiet />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <path
        className={styles.line}
        d="M110,90 L144,90 A6,6 0 0 0 150,84 L150,56 A6,6 0 0 1 156,50 L183,50 M144,90 A6,6 0 0 1 150,96 L150,124 A6,6 0 0 0 156,130 L183,130"
      />
      <ArrowRight x={190} y={50} />
      <ArrowRight x={190} y={130} />
      {/* The spec. */}
      <Rect x={190} y={36} w={90} h={28} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={206} cy={50} size={14} className={styles.glyph} />
      <Copy x={222} y={46} w={40} />
      <Copy x={222} y={54} w={28} quiet />
      {/* The build, checked. */}
      <Rect x={184} y={110} w={102} h={40} rx={12} className={styles.halo} />
      <Rect x={190} y={116} w={90} h={28} rx={8} className={styles.frame} />
      <Glyph name="code" cx={206} cy={130} size={14} className={styles.glyph} />
      <Copy x={222} y={126} w={28} />
      <Copy x={222} y={134} w={20} quiet />
      <circle className={styles.solid} cx="266" cy="130" r="7" />
      <Glyph name="check-circle" cx={266} cy={130} size={10} className={styles.glyphOn} />
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** The senior designer who draws every changed screen (lit) and the account lead; design engineers and
 *  developers join if we build it too (dashed, routes ending open). */
function TeamProductRedesign() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {(
        [
          [70, 'code'],
          [110, 'server'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={glyph}>
          <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={250} y={cy} w={26} quiet />
          <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
          <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
        </g>
      ))}
    </>
  );
}

/** The live product, its analytics and support history, and time with new and long-time customers (lit). */
function NeedsProductRedesign() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={80} cy={50} glyph="monitor" />
      <C cx={66} cy={90} glyph="graph-up" />
      <C cx={94} cy={90} glyph="chat-round-dots" />
      <Focus x={80} y={130} glyph="users-group-rounded" size={12} />
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

/** Our part ends at the specifications, checked; the product calls, when it ships and the engineers' code stay theirs. */
function StopsProductRedesign() {
  const theirs: [number, IconName][] = [
    [50, 'flag'],
    [90, 'calendar'],
    [130, 'code'],
  ];
  return (
    <>
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
      <Glyph name="document-text" cx={50} cy={68} size={14} className={styles.glyph} />
      <Copy x={64} y={68} w={32} />
      <Copy x={42} y={88} w={56} quiet />
      <Copy x={42} y={100} w={44} quiet />
      <Copy x={42} y={112} w={52} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
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
 * /services/product-modernisation/product-redesign · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A record of what customers rely on.: Every habit we find, sorted into the four groups below, each with a reason. */
  'wyg-product-redesign-record-what-customers-rely': RecordWhatCustomersRely,
  /* Research and diagnosis.: Interviews, analytics, support history and a review of the live product. */
  'wyg-product-redesign-research-diagnosis': ResearchDiagnosis,
  /* Structure and workflows.: Navigation, records and the steps people take, redesigned where they cause friction. */
  'wyg-product-redesign-structure-workflows': StructureWorkflows,
  /* Screens in every state.: Including what people see while a screen loads, when it is empty and when something fails, at the screen sizes your customers use. */
  'wyg-product-redesign-screens-every-state': ScreensEveryState,
  /* Shared components.: Patterns your design system can reuse, so the redesign stays consistent as it spreads. */
  'wyg-product-redesign-shared-components': SharedComponents,
  /* A rollout plan.: Which workflow goes first, how the old and new versions coexist, and what customers are told. */
  'wyg-product-redesign-rollout-plan': RolloutPlan,
  /* Specifications, or the build.: Specs your developers build from, or our Design Engineering and Software Development teams take it into code, with designers checking the bu */
  'wyg-product-redesign-specifications-or-build': SpecificationsOrBuild,
  /* Who does the work: The redesign is led by a senior product designer who draws every changed screen, while an account lead plans the stages with you. Design eng */
  'team-product-redesign': TeamProductRedesign,
  /* What we need from you: Access to the live product, the analytics and support history you have, and time with new and long-time customers to watch and test with. */
  'needs-product-redesign': NeedsProductRedesign,
  /* Where our part stops: The product calls stay with you, including what ships and when. Our part ends at specifications your engineers build from, unless we build i */
  'stops-product-redesign': StopsProductRedesign,
};
