import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
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
 * A definition for each figure: the figure's written definition, its freshness clock beside it, agreed
 * (the tick) and routed on to the chart, which is still unbuilt.
 */
function DefinitionEachFigure() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={46} y={46} w={40} h={20} rx={4} className={styles.tile} />
      <Copy x={54} y={56} w={24} />
      <Copy x={46} y={82} w={84} quiet />
      <Copy x={46} y={94} w={64} quiet />
      <Glyph name="clock-circle" cx={54} cy={114} size={14} className={styles.glyph} />
      <Copy x={68} y={114} w={36} quiet />
      <Focus x={124} y={124} glyph="check-circle" size={12} />
      <circle className={styles.node} cx="150" cy="90" r="2.5" />
      <TraceIn d="M150,90 L183,90" />
      <path className={styles.solid} d="M190,90 L183,86 L183,94 Z" />
      <Hatched x={190} y={40} w={100} h={100} />
    </>
  );
}

/**
 * Views at different depths: three views, deepening from the customer's one figure to the analyst's
 * table, each fed from the one shared strip of definitions under them.
 */
function ViewsAtDifferentDepths() {
  return (
    <>
      {/* The customer's view: one figure. */}
      <Rect x={30} y={30} w={70} h={70} rx={8} className={styles.frame} />
      <Copy x={42} y={46} w={24} quiet />
      <Rect x={42} y={58} w={32} h={12} rx={4} className={styles.tile} />
      {/* The manager's: a figure and its bars. */}
      <Rect x={125} y={30} w={70} h={70} rx={8} className={styles.frame} />
      <Copy x={137} y={46} w={24} quiet />
      {[
        [137, 70],
        [149, 62],
        [161, 74],
        [173, 58],
      ].map(([x, y]) => (
        <Rect key={x} x={x ?? 0} y={y ?? 0} w={8} h={86 - (y ?? 0)} rx={2} className={styles.tile} />
      ))}
      {/* The analyst's: the table underneath. */}
      <Rect x={220} y={30} w={70} h={70} rx={8} className={styles.frame} />
      <Copy x={232} y={46} w={24} quiet />
      {[58, 66, 74, 82].map((y, i) => (
        <g key={y}>
          <Copy x={232} y={y} w={16} quiet={i % 2 === 1} />
          <Copy x={254} y={y} w={24} quiet={i % 2 === 1} />
        </g>
      ))}
      {/* The one set of definitions all three stand on. */}
      <Rect x={30} y={130} w={260} h={20} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M46,140 L110,140" />
      <TraceIn d="M65,130 L65,107 M160,130 L160,107 M255,130 L255,107" />
      <ArrowUp x={65} y={100} />
      <ArrowUp x={160} y={100} />
      <ArrowUp x={255} y={100} />
    </>
  );
}

/**
 * Charts that show their baseline: each bar stands beside a dashed ghost bar, its baseline (the period
 * it is read against), the latest bar lit, and under the chart the source it rests on.
 */
function ChartsShowTheirBaseline() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Copy x={66} y={48} w={48} quiet />
      {/* Each figure beside its baseline (dashed, the period it is read against); the latest lit. */}
      {(
        [
          [86, 84, 74],
          [146, 70, 80],
          [206, 76, 58],
        ] as const
      ).map(([x, base, now], i) => (
        <g key={x}>
          <Rect x={x} y={base} w={14} h={120 - base} rx={2} className={styles.trailFrame} />
          <Rect
            x={x + 18}
            y={now}
            w={14}
            h={120 - now}
            rx={2}
            className={i === 2 ? styles.solid : styles.tile}
          />
        </g>
      ))}
      <path className={styles.rule} d="M66,120 L254,120" />
      {/* What it rests on. */}
      <Glyph name="database" cx={72} cy={136} size={12} className={styles.glyphQuiet} />
      <Copy x={84} y={136} w={60} quiet />
    </>
  );
}

/**
 * The next step beside the figure: the figure that has dropped, and right beside it the action it
 * prompts, pressed.
 */
function NextStepBesideFigure() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Rect x={50} y={50} w={100} h={80} rx={4} className={styles.tile} />
      <Copy x={62} y={64} w={32} quiet />
      <Copy x={62} y={78} w={44} />
      <path className={styles.copy} d="M62,98 L84,101 L106,108 L128,118" />
      <Hop x1={150} x2={170} y={90} />
      <Rect x={164} y={72} w={102} h={36} rx={18} className={styles.halo} />
      <Rect x={170} y={78} w={90} h={24} rx={12} className={styles.solid} />
      <Glyph name="arrow-right" cx={246} cy={90} size={12} className={styles.glyphOn} />
      <Cursor x={226} y={94} />
    </>
  );
}

/**
 * Screens for missing and late data: the same view drawn four ways, one screen for each gap: missing,
 * late (lit), partial, restricted.
 */
function ScreensMissingLateData() {
  return (
    <>
      {/* Missing: nothing came. */}
      <Rect x={30} y={50} w={56} h={80} rx={8} className={styles.trailFrame} />
      <Glyph name="database" cx={58} cy={84} size={16} className={styles.glyphQuiet} />
      <Copy x={46} y={116} w={24} quiet />
      {/* Late: it is on its way. */}
      <Rect x={98} y={50} w={56} h={80} rx={8} className={styles.frame} />
      <Focus x={126} y={84} glyph="clock-circle" size={12} />
      <Copy x={114} y={116} w={24} quiet />
      {/* Partial: some of it arrived. */}
      <Rect x={166} y={50} w={56} h={80} rx={8} className={styles.frame} />
      <Rect x={176} y={82} w={10} h={20} rx={2} className={styles.tile} />
      <Rect x={190} y={74} w={10} h={28} rx={2} className={styles.tile} />
      <Hatched x={204} y={66} w={12} h={36} />
      <Copy x={182} y={116} w={24} quiet />
      {/* Restricted: it is there, not for this person. */}
      <Rect x={234} y={50} w={56} h={80} rx={8} className={styles.frame} />
      <Glyph name="lock" cx={262} cy={84} size={16} className={styles.glyph} />
      <Copy x={250} y={116} w={24} quiet />
    </>
  );
}

/**
 * Saved views and filters: the pile of one-off reports set aside; in their place one screen with its
 * filters and the saved views people return to, one lit.
 */
function SavedViewsFilters() {
  return (
    <>
      <Rect x={34} y={34} w={60} h={80} rx={6} className={styles.frameQuiet} />
      <Rect x={42} y={42} w={60} h={80} rx={6} className={styles.frameQuiet} />
      <Rect x={50} y={50} w={60} h={80} rx={6} className={styles.frameQuiet} />
      <Copy x={62} y={68} w={28} quiet />
      <Copy x={62} y={80} w={36} quiet />
      <Copy x={62} y={92} w={22} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {[166, 202, 238].map((x) => (
        <Rect key={x} x={x} y={44} w={30} h={12} rx={6} className={styles.tile} />
      ))}
      {[78, 102, 126].map((y, i) => (
        <g key={y}>
          {i === 1 ? (
            <Rect x={160} y={y - 10} w={120} h={20} rx={4} className={styles.region} />
          ) : null}
          <Glyph
            name="star"
            cx={176}
            cy={y}
            size={12}
            className={i === 1 ? styles.glyphAccent : styles.glyphQuiet}
          />
          <path
            className={i === 1 ? styles.regionCopy : styles.copyQuiet}
            d={`M190,${y} L${[240, 250, 230][i]},${y}`}
          />
        </g>
      ))}
    </>
  );
}

/**
 * Prototypes with realistic figures: a prototype table filled with ragged, real-shaped values, and the
 * one awkward row tidy numbers would have hidden, found.
 */
function PrototypesRealisticFigures() {
  const rows: readonly [number, number, number][] = [
    [64, 36, 20],
    [80, 52, 34],
    [138, 24, 8],
  ];
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Copy x={66} y={46} w={48} quiet />
      {rows.map(([y, a, b]) => (
        <g key={y}>
          <Copy x={66} y={y} w={a} quiet />
          <Copy x={226 - b} y={y} w={b} quiet />
        </g>
      ))}
      {/* The hard case: a value far wider than the column was drawn for. */}
      <Rect x={58} y={104} w={204} h={24} rx={4} className={styles.region} />
      <Glyph name="danger-triangle" cx={74} cy={116} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M88,116 L112,116" />
      <path className={styles.regionCopy} d="M130,116 L250,116" />
    </>
  );
}

/**
 * Who does the work: the senior product designer (lit) and the account lead in our frame; design
 * engineers always in the team, routed in.
 */
function TeamDataAnalytics() {
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

/**
 * What we need from you: the questions each role brings and the definitions; the data and the usage
 * analytics; and the product owner who can agree changes (lit), into our frame.
 */
function NeedsDataAnalytics() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Chips cx={80} cy={50} glyphs={['question-circle', 'document-text']} />
      <Chips cx={80} cy={90} glyphs={['database', 'graph-up']} />
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

/** What stays theirs, one row on their panel: its chips, then a heading line and a quiet one. */
function Theirs({ cy, glyphs }: { cy: number; glyphs: readonly IconName[] }) {
  const n = glyphs.length;
  const x = 236 + 20 * (n - 1);
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

/**
 * Where our part stops: the views, designed and checked; pipelines, warehouses, and the metric
 * calculations and models stay on the data team's panel, no route crossing to it.
 */
function StopsDataAnalytics() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      {[
        [42, 104],
        [54, 92],
        [66, 98],
        [78, 84],
      ].map(([x, y]) => (
        <Rect key={x} x={x ?? 0} y={y ?? 0} w={8} h={116 - (y ?? 0)} rx={2} className={styles.tile} />
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['layers']} />
      <Theirs cy={90} glyphs={['database', 'server']} />
      <Theirs cy={130} glyphs={['code', 'cpu']} />
    </>
  );
}

/**
 * Customer-facing reports, inside the product (moving): the customer's own data is routed into the
 * product they are signed in to (their avatar in its bar), and the report there lights. At rest the
 * report's bars are empty.
 */
function CustomerFacingReports() {
  const bars: readonly [number, number][] = [
    [188, 104],
    [208, 92],
    [228, 98],
    [248, 80],
  ];
  return (
    <>
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="database" cx={50} cy={90} size={16} className={styles.glyph} />
      <Rect x={110} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M110,54 L290,54" />
      <Copy x={126} y={42} w={32} quiet />
      <Glyph name="user" cx={274} cy={42} size={12} className={styles.glyph} />
      <GrowIn>
        <Rect x={164} y={62} w={116} h={80} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={170} y={68} w={104} h={68} rx={4} className={styles.tile} />
      {bars.map(([x, y]) => (
        <Rect key={x} x={x} y={y} w={14} h={124 - y} rx={2} className={styles.press} />
      ))}
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <TraceIn d="M70,90 L163,90" />
      <GrowIn>
        <ArrowRight x={170} y={90} />
      </GrowIn>
      <GrowIn>
        <circle className={styles.nodeOpen} cx="110" cy="90" r="3" />
      </GrowIn>
    </>
  );
}

/**
 * Scores that show what they are based on (moving): the score's ring alone at rest; on hover the
 * route opens from it to the factors behind it, each weighed by its bar, and the weights fill.
 */
function ScoresShowBasis() {
  return (
    <>
      <Rect x={30} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M80,62 A18,18 0 1 1 79.99,62" />
      <path className={styles.copy} d="M80,62 A18,18 0 1 1 62,80" />
      <Copy x={62} y={114} w={36} quiet />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      <TraceIn d="M130,90 L144,90 A6,6 0 0 0 150,84 L150,56 A6,6 0 0 1 156,50 L183,50" />
      <TraceIn d="M130,90 L183,90" />
      <TraceIn d="M130,90 L144,90 A6,6 0 0 1 150,96 L150,124 A6,6 0 0 0 156,130 L183,130" />
      {[50, 90, 130].map((y) => (
        <GrowIn key={y}>
          <ArrowRight x={190} y={y} />
        </GrowIn>
      ))}
      {(
        [
          [50, 64],
          [90, 40],
          [130, 22],
        ] as const
      ).map(([y, w]) => (
        <g key={y}>
          <Rect x={190} y={y - 12} w={100} h={24} rx={4} className={styles.frame} />
          <Rect x={202} y={y - 4} w={w} h={8} rx={4} className={styles.press} />
        </g>
      ))}
    </>
  );
}

/**
 * Multi-site data, filtered to the right part (moving): three sites; on hover only one is routed into
 * the view and its pin fills, the others left out.
 */
function MultiSiteFiltered() {
  return (
    <>
      {[50, 90].map((y) => (
        <g key={y}>
          <circle className={styles.frameQuiet} cx="58" cy={y} r="12" />
          <Glyph name="map-point" cx={58} cy={y} size={14} className={styles.glyphQuiet} />
        </g>
      ))}
      <GrowIn>
        <circle className={styles.halo} cx="58" cy="130" r="18" />
      </GrowIn>
      <circle className={styles.release} cx="58" cy="130" r="12" />
      <Glyph name="map-point" cx={58} cy={130} size={14} className={styles.releaseMark} />
      <circle className={styles.node} cx="70" cy="130" r="2.5" />
      <TraceIn d="M70,130 L164,130 A6,6 0 0 0 170,124 L170,96 A6,6 0 0 1 176,90 L183,90" />
      <GrowIn>
        <ArrowRight x={190} y={90} />
      </GrowIn>
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={206} y={50} w={40} quiet />
      <Rect x={206} y={62} w={36} h={12} rx={6} className={styles.tile} />
      <Copy x={206} y={94} w={56} />
      {[
        [206, 120],
        [222, 110],
        [238, 116],
        [254, 104],
      ].map(([x, y]) => (
        <Rect key={x} x={x ?? 0} y={y ?? 0} w={10} h={134 - (y ?? 0)} rx={2} className={styles.tile} />
      ))}
    </>
  );
}

/**
 * Operational dashboards for a tyre shop (still): the shop's bays side by side on one screen, each
 * with its tyre and a live status dot; the bay to act on lit, under a stock count in the header.
 */
function TyreShopDashboard() {
  const at = (cx: number, cy: number, a: number, r1: number, r2: number) => {
    const t = (a * Math.PI) / 180;
    const c = Math.cos(t);
    const s = Math.sin(t);
    return `M${(cx + r1 * c).toFixed(2)},${(cy + r1 * s).toFixed(2)} L${(cx + r2 * c).toFixed(2)},${(cy + r2 * s).toFixed(2)}`;
  };
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      {/* The stock board's header: a three-bar count of tyres in, and its label. */}
      {[
        [66, 6],
        [75, 10],
        [84, 14],
      ].map(([x, h]) => (
        <Rect key={x} x={x ?? 0} y={62 - (h ?? 0)} w={6} h={h ?? 0} rx={1.5} className={styles.quietMark} />
      ))}
      <Copy x={96} y={56} w={40} quiet />
      {/* The live board's status strip across the header. */}
      <Rect x={66} y={72} w={40} h={6} rx={3} className={styles.quietMark} />
      <Rect x={110} y={72} w={24} h={6} rx={3} className={styles.frameQuiet} />
      <Rect x={138} y={72} w={16} h={6} rx={3} className={styles.frameQuiet} />
      {[66, 115, 164, 213].map((x, i) => {
        const lit = i === 2;
        const cx = x + 20.5;
        const cy = 108;
        return (
          <g key={x}>
            <Rect x={x} y={86} w={41} h={52} rx={4} className={lit ? styles.region : styles.tile} />
            {/* The tyre side-on: its tread band with twelve blocks, the hub and five spokes. */}
            <circle className={styles.frame} cx={cx} cy={cy} r="15" />
            <circle className={styles.frame} cx={cx} cy={cy} r="12" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
              <path key={a} className={styles.rule} d={at(cx, cy, a, 12, 15)} />
            ))}
            {[-90, -18, 54, 126, 198].map((a) => (
              <path key={a} className={styles.rule} d={at(cx, cy, a, 6, 10)} />
            ))}
            <circle className={styles.rule} cx={cx} cy={cy} r="6" />
            {/* Its live status: a dot and a line. */}
            <circle className={lit ? styles.mark : styles.quietMark} cx={x + 9} cy={130} r="3" />
            <path className={lit ? styles.line : styles.copyQuiet} d={`M${x + 16},130 L${x + 30},130`} />
          </g>
        );
      })}
    </>
  );
}

/**
 * Ask-the-data analytics (still): a typed question, answered with a proper chart (its scale and its
 * definition under it), held to the standard any chart is (the shield, lit).
 */
function AskTheData() {
  return (
    <>
      <Rect x={30} y={76} w={120} h={28} rx={14} className={styles.frame} />
      <Glyph name="question-circle" cx={48} cy={90} size={12} className={styles.glyph} />
      <Copy x={62} y={90} w={52} />
      <path className={styles.hair} d="M124,84 L124,96" />
      <Hop x1={150} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={48} w={40} quiet />
      {[
        [190, 80],
        [206, 70],
        [222, 76],
        [238, 62],
      ].map(([x, y]) => (
        <Rect key={x} x={x ?? 0} y={y ?? 0} w={10} h={100 - (y ?? 0)} rx={2} className={styles.tile} />
      ))}
      <path className={styles.rule} d="M186,100 L274,100" />
      <Copy x={186} y={124} w={40} quiet />
      <Focus x={264} y={124} glyph="shield-check" size={12} />
    </>
  );
}

/**
 * /expertise/data-analytics-decision-products · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A definition for each figure: A plain definition, scope and freshness rule for each figure that matters, agreed before any chart is drawn */
  'wyg-data-analytics-decision-products-definition-each-figure': DefinitionEachFigure,
  /* Views at different depths: Views for analysts, managers and customers at different depths, on the same definitions */
  'wyg-data-analytics-decision-products-views-at-different-depths': ViewsAtDifferentDepths,
  /* Charts that show their baseline: Reports, scores and charts that show their baseline and what they rest on */
  'wyg-data-analytics-decision-products-charts-show-their-baseline': ChartsShowTheirBaseline,
  /* The next step beside the figure: The next step placed beside the figure that prompts it */
  'wyg-data-analytics-decision-products-next-step-beside-figure': NextStepBesideFigure,
  /* Screens for missing and late data: Screens for missing, late, partial and restricted data */
  'wyg-data-analytics-decision-products-screens-missing-late-data': ScreensMissingLateData,
  /* Saved views and filters: Saved views and filters in place of one-off custom reports */
  'wyg-data-analytics-decision-products-saved-views-filters': SavedViewsFilters,
  /* Prototypes with realistic figures: Prototypes with real or realistic figures, because tidy sample numbers hide the hard cases */
  'wyg-data-analytics-decision-products-prototypes-realistic-figures': PrototypesRealisticFigures,
  /* Who does the work: The work is led by a senior product designer who does it hands-on, and an account lead keeps it on course. Design engineers build the views  */
  'team-data-analytics-decision-products': TeamDataAnalytics,
  /* What we need from you: The questions each role opens the product to answer, your data team's time on definitions, real data or a realistic sample, your usage analy */
  'needs-data-analytics-decision-products': NeedsDataAnalytics,
  /* Where our part stops: Pipelines, warehouses, metric calculations and models stay with your data team or BI vendor.One dashboard or chart set people misread may ne */
  'stops-data-analytics-decision-products': StopsDataAnalytics,
  /* MOVING: this tile links to /case-studies/ux-revamp-for-a-saas-product-in-marketing-automation-vertical, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Customer-facing reports and dashboards inside a SaaS product: Ryzeo */
  'kind-data-analytics-decision-products-customer-facing-reports-dashboards': CustomerFacingReports,
  /* MOVING: this tile links to /case-studies/doodle-case-study-automating-enterprise-meeting-scheduling, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Scores that show what they are based on: Doodle */
  'kind-data-analytics-decision-products-scores-show-what-they': ScoresShowBasis,
  /* MOVING: this tile links to /case-studies/legacy-saas-modernisation-information-architecture, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: Multi-site data filtered to the right part of the organisation: Benchmark Gensuite */
  'kind-data-analytics-decision-products-multi-site-data-filtered': MultiSiteFiltered,
  /* What we design in, tile: Operational dashboards for tyre shop software: TreadCommand */
  'kind-data-analytics-decision-products-operational-dashboards-tyre-shop': TyreShopDashboard,
  /* What we design in, tile: Ask-the-data analytics, where users type a question: Answers held to the same standard as any chart */
  'kind-data-analytics-decision-products-ask-data-analytics-users': AskTheData,
};
