import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched, TraceIn } from './scenes';
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

/**
 * A view for each role: one set of figures, routed out to three people, and each person's card shows
 * its own view of them: one figure, the trend, the action (lit).
 */
function ViewEachRole() {
  return (
    <>
      {/* The one set of figures. */}
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="database" cx={60} cy={90} size={22} className={styles.glyph} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <TraceIn d="M90,90 L150,90 M130,90 L130,56 A6,6 0 0 1 136,50 L150,50 M130,90 L130,124 A6,6 0 0 0 136,130 L150,130" />
      <circle className={styles.node} cx="130" cy="90" r="3.5" />
      {[50, 90, 130].map((y, i) => (
        <g key={y}>
          <Rect x={150} y={y - 16} w={140} h={32} rx={8} className={styles.frame} />
          <circle className={styles.nodeOpen} cx="150" cy={y} r="3" />
          <Glyph name="user" cx={172} cy={y} size={16} className={styles.glyph} />
          {i === 0 ? (
            <>
              <Rect x={192} y={y - 8} w={36} h={16} rx={4} className={styles.tile} />
              <Copy x={236} y={y} w={36} quiet />
            </>
          ) : null}
          {i === 1 ? (
            <>
              {[0, 1, 2, 3, 4].map((k) => (
                <Rect
                  key={k}
                  x={192 + k * 12}
                  y={y + 8 - [8, 12, 10, 14, 16][k]!}
                  w={8}
                  h={[8, 12, 10, 14, 16][k]!}
                  rx={2}
                  className={styles.tile}
                />
              ))}
              <Copy x={256} y={y} w={20} quiet />
            </>
          ) : null}
          {i === 2 ? (
            <>
              <Copy x={192} y={y} w={32} quiet />
              <Rect x={234} y={y - 7} w={42} h={14} rx={7} className={styles.solid} />
            </>
          ) : null}
        </g>
      ))}
    </>
  );
}

/**
 * Every number defined: the figure on the dashboard, routed to its definition card (what it means, how
 * it is calculated, when it last updated), agreed: the tick.
 */
function EveryNumberDefined() {
  return (
    <>
      <Rect x={30} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Copy x={46} y={68} w={36} quiet />
      <Rect x={46} y={80} w={52} h={22} rx={4} className={styles.tile} />
      <Glyph name="info-circle" cx={112} cy={91} size={12} className={styles.glyph} />
      <Copy x={46} y={116} w={28} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      {(
        [
          [50, 'document-text', 72],
          [78, 'code', 60],
          [106, 'clock-circle', 36],
        ] as const
      ).map(([y, glyph, w]) => (
        <g key={y}>
          <Glyph name={glyph} cx={190} cy={y} size={14} className={styles.glyph} />
          <Copy x={206} y={y - 4} w={w} />
          <Copy x={206} y={y + 4} w={Math.round(w * 0.6)} quiet />
        </g>
      ))}
      <Focus x={264} y={124} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * A comparison for every figure: this month's bar stands beside last month's (dashed) under the
 * target's flag, so the number means something; this month's lit.
 */
function ComparisonEveryFigure() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Copy x={86} y={48} w={48} quiet />
      {/* The target, a dashed rule across the chart with its flag. */}
      <path className={styles.trail} d="M86,70 L150,70 M194,70 L210,70" />
      <Glyph name="flag" cx={226} cy={70} size={14} className={styles.glyph} />
      <path className={styles.rule} d="M86,130 L234,130" />
      {/* Last month, dashed; this month, lit, over the target. */}
      <Rect x={116} y={90} w={24} h={40} rx={3} className={styles.trailFrame} />
      {/* Its halo stops 6 above the baseline, open at the foot, where the bar stands on the rule. */}
      <path className={styles.halo} d="M154,124 L154,60 A8,8 0 0 1 162,52 L182,52 A8,8 0 0 1 190,60 L190,124 Z" />
      <Rect x={160} y={58} w={24} h={72} rx={3} className={styles.solid} />
    </>
  );
}

/**
 * Charts, tables, filters and drill-downs: the question routed to the one form that answers it (the
 * table, lit), the chart and the filters beside it, not chosen.
 */
function ChartsTablesFiltersDrilldowns() {
  return (
    <>
      <Rect x={40} y={66} w={50} h={48} rx={8} className={styles.frame} />
      <Glyph name="question-circle" cx={65} cy={90} size={24} className={styles.glyph} />
      {/* The route ends at the table's halo, its outer edge. */}
      <Hop x1={90} x2={170} y={90} />
      {/* The chart. */}
      <Rect x={176} y={30} w={100} h={32} rx={8} className={styles.frame} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Rect
          key={k}
          x={190 + k * 12}
          y={54 - [8, 14, 10, 16, 12, 18][k]!}
          w={8}
          h={[8, 14, 10, 16, 12, 18][k]!}
          rx={2}
          className={styles.tile}
        />
      ))}
      {/* The table: the answer. */}
      <Rect x={170} y={68} w={112} h={44} rx={12} className={styles.halo} />
      <Rect x={176} y={74} w={100} h={32} rx={8} className={styles.frame} />
      <path className={styles.hair} d="M176,90 L276,90 M216,74 L216,106" />
      <Copy x={186} y={82} w={20} />
      <Copy x={226} y={82} w={36} />
      <Copy x={186} y={98} w={20} />
      <Copy x={226} y={98} w={28} />
      {/* The filters. */}
      <Rect x={176} y={118} w={100} h={32} rx={8} className={styles.frame} />
      {[188, 216, 244].map((x) => (
        <Rect key={x} x={x} y={128} w={20} h={12} rx={6} className={styles.tile} />
      ))}
    </>
  );
}

/**
 * Screens for imperfect data: one chart that says where it falls short: a month missing (an empty,
 * dashed slot), the latest estimated (hatched), and the clock telling people it is late (lit).
 */
function ScreensImperfectData() {
  const bars: readonly [number, number, 'tile' | 'gap' | 'est'][] = [
    [86, 40, 'tile'],
    [114, 52, 'tile'],
    [142, 46, 'gap'],
    [170, 60, 'tile'],
    [198, 56, 'est'],
  ];
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Copy x={66} y={48} w={48} quiet />
      <path className={styles.rule} d="M66,130 L222,130" />
      {bars.map(([x, h, kind]) =>
        kind === 'est' ? (
          <Hatched key={x} x={x} y={130 - h} w={20} h={h} />
        ) : (
          <Rect
            key={x}
            x={x}
            y={130 - h}
            w={20}
            h={h}
            rx={3}
            className={kind === 'gap' ? styles.trailFrame : styles.tile}
          />
        ),
      )}
      <Focus x={244} y={62} glyph="clock-circle" size={12} />
    </>
  );
}

/**
 * Thresholds and alerts: the line crosses its dashed threshold, the alert fires at the crossing, and
 * it is routed to the one action that follows (lit).
 */
function ThresholdsAlerts() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={40} quiet />
      <path className={styles.trail} d="M46,90 L154,90" />
      <path className={styles.copy} d="M46,126 L66,118 L86,122 L106,108 L126,96 L142,74" />
      <Glyph name="danger-triangle" cx={142} cy={62} size={14} className={styles.glyph} />
      <circle className={styles.node} cx="170" cy="90" r="2.5" />
      <Rect x={210} y={72} w={80} h={36} rx={18} className={styles.halo} />
      <Rect x={216} y={78} w={68} h={24} rx={12} className={styles.solid} />
      <Glyph name="arrow-right" cx={270} cy={90} size={12} className={styles.glyphOn} />
      <Cursor x={250} y={96} />
      <TraceIn d="M170,90 L203,90" />
      <ArrowRight x={210} y={90} />
    </>
  );
}

/**
 * Views tried with real numbers: your data poured into a chart built in code, its ragged real bars
 * showing what tidy samples hide, and the view proved: the tick.
 */
function ViewsTriedRealNumbers() {
  const bars = [30, 62, 18, 74, 8, 50];
  return (
    <>
      <Rect x={30} y={66} w={50} h={48} rx={8} className={styles.frame} />
      <Glyph name="database" cx={55} cy={90} size={22} className={styles.glyph} />
      <Hop x1={80} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Chip x={142} y={42} glyph="code" />
      <path className={styles.rule} d="M146,130 L274,130" />
      {bars.map((h, k) => (
        <Rect key={k} x={150 + k * 16} y={130 - h} w={10} h={h} rx={2} className={styles.tile} />
      ))}
      <Focus x={262} y={56} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * Who does the work: the senior product designer (lit) and the account lead in our frame; design
 * engineers join, dashed, for the views that need real numbers.
 */
function TeamDataVisualisation() {
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

/**
 * What we need from you: the questions each role brings; the person who can agree what each metric
 * means (lit); your data or a realistic sample of it, into our frame.
 */
function NeedsDataVisualisation() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Chips cx={80} cy={50} glyphs={['users-group-rounded', 'question-circle']} />
      <Focus x={80} y={90} glyph="user" size={12} />
      <C cx={66} cy={130} glyph="database" />
      <Rect x={86} y={122} w={16} h={16} rx={4} className={styles.trailFrame} />
      <Glyph name="database" cx={94} cy={130} size={10} className={styles.glyphQuiet} />
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

/** A glyph in a neutral chip, centred at (cx, cy): theirs, so nothing on it is lit. */
const Plain = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <>
    <rect className={styles.chip} x={cx - 8} y={cy - 8} width="16" height="16" rx="4" />
    <Glyph name={glyph} cx={cx} cy={cy} size={10} className={styles.glyph} />
  </>
);

/** What stays theirs, one row on their panel (left edge px): its chips, then a heading line and a quiet one. */
function Theirs({ px, cy, glyphs }: { px: number; cy: number; glyphs: readonly IconName[] }) {
  const n = glyphs.length;
  const x = px + 36 + 20 * (n - 1);
  const w = px + 76 - x;
  return (
    <>
      {glyphs.map((glyph, i) => (
        <Plain key={glyph} cx={px + 16 + i * 20} cy={cy} glyph={glyph} />
      ))}
      <Copy x={x} y={cy - 4} w={w} />
      <Copy x={x} y={cy + 4} w={Math.round(w * 0.7)} quiet />
    </>
  );
}

/**
 * Where our part stops: the view people see and act on, designed and checked; pipelines, data models
 * and one-off analysis, and the engineers' build, stay on their panel, set well apart, nothing on it
 * lit and no route crossing to it.
 */
function StopsDataVisualisation() {
  return (
    <>
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Copy x={40} y={64} w={28} quiet />
      {[
        [40, 100],
        [52, 88],
        [64, 94],
        [76, 82],
      ].map(([x, y]) => (
        <Rect key={x} x={x!} y={y!} w={8} h={106 - y!} rx={2} className={styles.tile} />
      ))}
      <Rect x={40} y={112} w={36} h={10} rx={5} className={styles.tile} />
      <Hop x1={90} x2={120} y={90} />
      <Rect x={120} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={142} y={90} glyph="check-circle" size={13} />
      <Rect x={204} y={30} w={86} h={120} rx={8} className={styles.tile} />
      <Theirs px={204} cy={50} glyphs={['server', 'database']} />
      <Theirs px={204} cy={90} glyphs={['layers', 'notebook']} />
      <Theirs px={204} cy={130} glyphs={['code']} />
    </>
  );
}

/**
 * /services/product-design/data-visualisation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A view for each role.: Defaults, level of detail and actions for each person who opens the dashboard, all drawing on the same figures. */
  'wyg-data-visualisation-view-each-role': ViewEachRole,
  /* Every number defined.: What it means, how it is calculated and when it was last updated, agreed with your product and data teams. */
  'wyg-data-visualisation-every-number-defined': EveryNumberDefined,
  /* A comparison for every figure.: Last month, a target, a peer group or a forecast: whatever makes the number mean something. */
  'wyg-data-visualisation-comparison-every-figure': ComparisonEveryFigure,
  /* Charts, tables, filters and drill-downs: Charts, tables, filters and drill-downs, each chosen for the question it answers. */
  'wyg-data-visualisation-charts-tables-filters-drilldowns': ChartsTablesFiltersDrilldowns,
  /* Screens for imperfect data.: What people see when figures are missing, late, estimated or partial. */
  'wyg-data-visualisation-screens-imperfect-data': ScreensImperfectData,
  /* Thresholds and alerts: Thresholds and alerts, each paired with the action that follows. */
  'wyg-data-visualisation-thresholds-alerts': ThresholdsAlerts,
  /* Views tried with real numbers.: Where a chart only proves itself once data fills it, we build it in code with your data or a realistic sample. */
  'wyg-data-visualisation-views-tried-real-numbers': ViewsTriedRealNumbers,
  /* Who does the work: Each view comes from a senior product designer who leads the project and does the design, while an account lead keeps it on schedule. Design */
  'team-data-visualisation': TeamDataVisualisation,
  /* What we need from you: The questions each role brings to the screen, someone on your product or data team who can agree what each metric means, and your data or a  */
  'needs-data-visualisation': NeedsDataVisualisation,
  /* Where our part stops: Pipelines, data models and one-off analysis stay with your data team or BI tool. We design what people see and do with the data, and your en */
  'stops-data-visualisation': StopsDataVisualisation,
};
