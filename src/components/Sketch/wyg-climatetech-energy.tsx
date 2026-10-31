import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, ArrowRight, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * Each role's view of the same figures: one chart, routed out to three people, each card holding the
 * figures at its own depth (a headline, a line more, the whole chart).
 */
function EachRolesView() {
  const bars = [
    [46, 104],
    [60, 92],
    [74, 98],
    [88, 80],
  ] as const;
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={44} y={64} w={28} quiet />
      {bars.map(([x, top]) => (
        <Rect key={x} x={x} y={top} w={8} h={116 - top} rx={2} className={styles.tile} />
      ))}
      <TraceIn d="M150,90 L150,56 A6,6 0 0 1 156,50 L187,50" />
      <TraceIn d="M150,90 L150,124 A6,6 0 0 0 156,130 L187,130" />
      <TraceIn d="M110,90 L187,90" />
      <circle className={styles.nodeOpen} cx={110} cy={90} r={3} />
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      {[50, 90, 130].map((cy, i) => (
        <g key={cy}>
          <Rect x={190} y={cy - 16} w={100} h={32} rx={8} className={styles.frame} />
          <circle className={styles.nodeOpen} cx={190} cy={cy} r={3} />
          <Glyph name="user" cx={206} cy={cy} size={14} className={styles.glyph} />
          {i === 0 ? <Copy x={222} y={cy} w={24} /> : null}
          {i === 1 ? (
            <>
              <Copy x={222} y={cy - 4} w={40} />
              <Copy x={222} y={cy + 4} w={26} quiet />
            </>
          ) : null}
          {i === 2
            ? [
                [222, 6],
                [232, 10],
                [242, 8],
                [252, 14],
                [262, 11],
              ].map(([x, h]) => (
                <Rect
                  key={x}
                  x={x ?? 0}
                  y={cy + 7 - (h ?? 0)}
                  w={6}
                  h={h ?? 0}
                  rx={1.5}
                  className={styles.tile}
                />
              ))
            : null}
        </g>
      ))}
    </>
  );
}

/**
 * Readings, forecasts and targets marked apart: the measured bars drawn solid, the forecast's bars
 * hatched (not happened yet), and the target a line of its own, ending on its flag.
 */
function ReadingsForecastsTargets() {
  const measured = [
    [50, 104],
    [74, 96],
    [98, 100],
    [122, 90],
  ] as const;
  const forecast = [
    [154, 86],
    [178, 82],
    [202, 80],
    [226, 78],
  ] as const;
  return (
    <>
      <path className={styles.rule} d="M30,130 L290,130" />
      {measured.map(([x, top]) => (
        <Rect key={x} x={x} y={top} w={16} h={130 - top} rx={3} className={styles.frame} />
      ))}
      {forecast.map(([x, top]) => (
        <Hatched key={x} x={x} y={top} w={16} h={130 - top} />
      ))}
      <circle className={styles.node} cx="50" cy="70" r="2.5" />
      <path className={styles.line} d="M50,70 L252,70" />
      <Focus x={270} y={70} glyph="flag" size={12} />
    </>
  );
}

/**
 * A digital twin or site view: the site's assets on one line, and the one that matters now lit.
 */
function DigitalTwinSite() {
  const assets: { cx: number; cy: number; glyph: IconName }[] = [
    { cx: 90, cy: 56, glyph: 'bolt-circle' },
    { cx: 160, cy: 56, glyph: 'server' },
    { cx: 90, cy: 130, glyph: 'cpu' },
    { cx: 160, cy: 130, glyph: 'bolt-circle' },
    { cx: 230, cy: 130, glyph: 'server' },
  ];
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frameQuiet} />
      <path className={styles.trail} d="M70,90 L250,90" />
      {[90, 160].map((x) => (
        <path key={`t${x}`} className={styles.trail} d={`M${x},70 L${x},116`} />
      ))}
      <path className={styles.trail} d="M230,81 L230,116" />
      {assets.map(({ cx, cy, glyph }) => (
        <g key={`${cx}-${cy}`}>
          <Rect x={cx - 14} y={cy - 14} w={28} h={28} rx={6} className={styles.tile} />
          <Glyph name={glyph} cx={cx} cy={cy} size={14} className={styles.glyphQuiet} />
        </g>
      ))}
      <Focus x={230} y={56} glyph="bolt-circle" size={13} />
    </>
  );
}

/**
 * Totals that open onto their sources: the total, lit, opened into the three rows it is made of:
 * its source, its estimate (hatched) and the person who approved it.
 */
function TotalsOpenOntoSources() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Rect x={80} y={38} w={160} h={24} className={styles.region} />
      <path className={styles.regionCopy} d="M92,50 L152,50" />
      <Glyph name="alt-arrow-down" cx={226} cy={50} size={12} className={styles.glyphAccent} />
      <TraceIn d="M90,62 L90,124 A6,6 0 0 0 96,130 L101,130" />
      <TraceIn d="M90,84 A6,6 0 0 0 96,90 L101,90" />
      <TraceIn d="M90,104 A6,6 0 0 0 96,110 L101,110" />
      {[90, 110, 130].map((y) => (
        <ArrowRight key={y} x={108} y={y} />
      ))}
      <circle className={styles.nodeOpen} cx={90} cy={62} r={3} />
      <C cx={118} cy={90} glyph="document-text" />
      <Copy x={136} y={90} w={80} />
      <Hatched x={110} y={102} w={16} h={16} />
      <Copy x={136} y={110} w={64} quiet />
      <C cx={118} cy={130} glyph="user" />
      <Copy x={136} y={130} w={52} />
    </>
  );
}

/**
 * The limits people set, and a morning view: the limit a person sets, then the morning's account of
 * what the system did inside it, each action ticked.
 */
function LimitsAndMorningView() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={70} cy={74} size={20} className={styles.glyph} />
      <path className={styles.hair} d="M46,108 L94,108" />
      <path className={styles.copy} d="M46,108 L76,108" />
      <circle className={styles.frame} cx="76" cy="108" r="5" />
      <Hop x1={110} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Focus x={198} y={58} glyph="clock-circle" size={13} />
      <Copy x={226} y={54} w={44} />
      <Copy x={226} y={64} w={28} quiet />
      {[100, 116, 132].map((y, i) => (
        <g key={y}>
          <Glyph name="check-circle" cx={192} cy={y} size={11} className={styles.glyph} />
          <Copy x={206} y={y} w={[56, 44, 64][i] ?? 48} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * A coded demo on sample data: the working screen runs on the sample, agreed; the live connection is
 * still hatched, not joined to it.
 */
function CodedDemoSampleData() {
  const bars = [
    [56, 98],
    [74, 86],
    [92, 92],
    [110, 78],
  ] as const;
  return (
    <>
      <Rect x={40} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={52} y={42} glyph="code" />
      <Copy x={76} y={50} w={48} quiet />
      {bars.map(([x, top]) => (
        <Rect key={x} x={x} y={top} w={12} h={130 - top} rx={3} className={styles.tile} />
      ))}
      <Focus x={152} y={122} glyph="check-circle" size={12} />
      <Rect x={220} y={46} w={60} h={48} rx={8} className={styles.frame} />
      <path className={styles.line} d="M220,70 L187,70" />
      <ArrowLeft x={180} y={70} />
      <circle className={styles.nodeOpen} cx={220} cy={70} r={3} />
      <Glyph name="database" cx={250} cy={70} size={18} className={styles.glyph} />
      <Rect x={220} y={110} w={60} h={32} rx={8} className={styles.trailFrame} />
      <Glyph name="server" cx={250} cy={126} size={14} className={styles.glyphQuiet} />
    </>
  );
}

/**
 * Specs your engineers build from: the measured spec, routed into code, the route running on to the
 * release flag.
 */
function SpecsEngineersBuildFrom() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <path className={styles.hair} d="M46,58 L94,58 M46,54 L46,62 M94,54 L94,62" />
      <Rect x={46} y={70} w={48} h={28} rx={4} className={styles.tile} />
      <Copy x={46} y={114} w={40} />
      <Copy x={46} y={124} w={28} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={162} cy={66} glyph="code" />
      {[66, 78, 90, 102, 114].map((y, i) => (
        <Copy
          key={y}
          x={[176, 170, 178, 178, 170][i] ?? 170}
          y={y}
          w={[36, 30, 30, 22, 34][i] ?? 30}
          quiet={i % 2 === 1}
        />
      ))}
      <Hop x1={230} x2={246} y={90} />
      <Focus x={270} y={90} glyph="flag" size={12} />
    </>
  );
}

/* ── Who does the work · What we need · Where our part stops ─────────────────────── */

/**
 * Who does the work: the senior product designer (lit) and the account lead; design engineers always
 * in the team for the coded demos (routed in), developers joining when the product is built (dashed,
 * their route ending open).
 */
function TeamClimatetech() {
  const roles: { cy: number; glyph: IconName; core: boolean }[] = [
    { cy: 70, glyph: 'code', core: true },
    { cy: 110, glyph: 'server', core: false },
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
      {roles.map(({ cy, glyph, core }) => (
        <g key={cy}>
          {core ? <Rect x={220} y={cy - 18} w={70} h={28} rx={8} className={styles.frameQuiet} /> : null}
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
 * What we need from you: each role's real questions (three), the data as it is today, measured or
 * modelled (hatched), and time with the leads plus the one person who signs off (lit), handed to our
 * frame.
 */
function NeedsClimatetech() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {[52, 80, 108].map((cx) => (
        <C key={cx} cx={cx} cy={50} glyph="question-circle" />
      ))}
      <C cx={62} cy={90} glyph="database" />
      <Hatched x={80} y={82} w={32} h={16} />
      <C cx={56} cy={130} glyph="users-group-rounded" />
      <Focus x={94} y={130} glyph="user" size={12} />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.nodeOpen} cx={130} cy={y} r={3} />
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

/**
 * Where our part stops: the energy product's screens, designed and checked; the data pipelines and
 * forecasting models, the device integrations, and which reporting rules apply stay theirs.
 */
function StopsClimatetech() {
  const bars = [
    [44, 104],
    [58, 96],
    [72, 100],
    [86, 90],
  ] as const;
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Copy x={42} y={76} w={48} />
      {bars.map(([x, top]) => (
        <Rect key={x} x={x} y={top} w={8} h={118 - top} rx={2} className={styles.tile} />
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['database', 'graph-up']} />
      <Theirs cy={90} glyphs={['cpu']} />
      <Theirs cy={130} glyphs={['shield-check']} />
    </>
  );
}

/**
 * /expertise/climatetech-energy · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each role's view of the same figures: Each role's view of the same figures, at the depth that role needs */
  'wyg-climatetech-energy-each-roles-view-same': EachRolesView,
  /* Readings, forecasts and targets marked apart: Readings, forecasts and targets marked apart, with scenarios shown against a stated baseline */
  'wyg-climatetech-energy-readings-forecasts-targets-marked': ReadingsForecastsTargets,
  /* A digital twin or site view: A digital twin or site view that shows which assets matter now */
  'wyg-climatetech-energy-digital-twin-or-site': DigitalTwinSite,
  /* Totals that open onto their sources: Carbon and emissions totals that open onto their sources, estimates and approver */
  'wyg-climatetech-energy-totals-open-onto-their': TotalsOpenOntoSources,
  /* The limits people set, and a morning view: The limits people set for automated actions, and a morning view of what the system did */
  'wyg-climatetech-energy-limits-people-set-morning': LimitsAndMorningView,
  /* A coded demo on sample data: A coded demo on sample data, so the direction is agreed before live integrations exist */
  'wyg-climatetech-energy-coded-demo-sample-data': CodedDemoSampleData,
  /* Specs your engineers build from: Specs your engineers build from, or Tcules developers taking it into production */
  'wyg-climatetech-energy-specs-engineers-build-from': SpecsEngineersBuildFrom,
  /* Who does the work: Your energy product gets a senior product designer who leads the design and does it, while an account lead keeps the project moving. Design  */
  'team-climatetech-energy': TeamClimatetech,
  /* What we need from you: Each role's real questions, from the operator, the finance lead and the sustainability lead. The data you have today, measured or modelled,  */
  'needs-climatetech-energy': NeedsClimatetech,
  /* Where our part stops: Data pipelines, forecasting models and device integrations stay with your data and engineering teams. Which reporting rules apply is for you */
  'stops-climatetech-energy': StopsClimatetech,
};
