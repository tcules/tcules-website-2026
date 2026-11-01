import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
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

/** Every feature gets its own verdict (moved, fixed, later, left behind) and its reason beside it. */
function EachFeaturesFate() {
  const rows: [number, IconName, number, boolean][] = [
    [62, 'arrow-right', 64, false],
    [86, 'ruler-pen', 48, false],
    [110, 'clock-circle', 72, false],
    [134, 'close-circle', 40, true],
  ];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={44} w={40} quiet />
      {/* The verdict column, lit: one decision per feature. */}
      <Rect x={136} y={50} w={40} h={96} rx={10} className={styles.halo} />
      {rows.map(([y, glyph, w, gone]) => (
        <g key={y}>
          {gone ? (
            <Hatched x={46} y={y - 8} w={72} h={16} />
          ) : (
            <>
              <Rect x={46} y={y - 8} w={72} h={16} className={styles.tile} />
              <Copy x={54} y={y} w={40} quiet />
            </>
          )}
          <Glyph name={glyph} cx={156} cy={y} size={14} className={styles.glyphAccent} />
          <Copy x={192} y={y} w={w} />
        </g>
      ))}
    </>
  );
}

/** During the overlap each customer is routed to their own version: one still on the old, one on the new. */
function MonthsBetweenDesigned() {
  return (
    <>
      {[50, 126].map((cy) => (
        <g key={cy}>
          <Rect x={50} y={cy - 20} w={40} h={40} rx={8} className={styles.frame} />
          <Glyph name="user" cx={70} cy={cy} size={20} className={styles.glyph} />
        </g>
      ))}
      <Hop x1={90} x2={170} y={50} />
      {/* Ends on the halo's outer ring, so both routes end in an arrowhead. */}
      <Hop x1={90} x2={166} y={126} />
      {/* The old version: quiet, its square button. */}
      <Rect x={170} y={30} w={100} h={40} rx={8} className={styles.frameQuiet} />
      <Copy x={184} y={44} w={36} quiet />
      <Copy x={184} y={56} w={24} quiet />
      <Rect x={232} y={44} w={24} h={12} rx={3} className={styles.tile} />
      {/* The new version, lit. */}
      <Rect x={166} y={102} w={108} h={48} rx={12} className={styles.halo} />
      <Rect x={170} y={106} w={100} h={40} rx={8} className={styles.frame} />
      <Copy x={184} y={120} w={36} />
      <Copy x={184} y={132} w={24} quiet />
      <Rect x={232} y={120} w={24} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/** Each kind of saved work carried across to its own matching place, item by item. */
function PlanSavedWork() {
  const rows: [number, IconName][] = [
    [50, 'graph-up'],
    [90, 'key'],
    [130, 'notebook'],
  ];
  return (
    <>
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.tile} />
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {rows.map(([cy, glyph]) => (
        <g key={cy}>
          <C cx={54} cy={cy} glyph={glyph} />
          <Copy x={70} y={cy} w={28} quiet />
          <Hop x1={110} x2={190} y={cy} />
          <C cx={214} cy={cy} glyph={glyph} />
          <Copy x={230} y={cy} w={24} />
          <Glyph name="check-circle" cx={270} cy={cy} size={12} className={styles.glyph} />
        </g>
      ))}
    </>
  );
}

/** The help article still leads to the setting: its old spot is empty, its route lands where it moved. */
function NamesStillMakeSense() {
  return (
    <>
      {/* The help article. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="notebook" cx={50} cy={70} size={16} className={styles.glyph} />
      <Copy x={44} y={92} w={40} />
      <Copy x={44} y={104} w={28} quiet />
      <Copy x={44} y={116} w={36} quiet />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <path
        className={styles.line}
        d="M110,90 L124,90 A6,6 0 0 1 130,96 L130,104 A6,6 0 0 0 136,110 L163,110"
      />
      <path className={styles.solid} d="M170,110 L163,106 L163,114 Z" />
      {/* The product: where the setting was (empty), and where it lives now (lit). */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={46} w={40} quiet />
      <Hatched x={186} y={58} w={88} h={20} />
      <Rect x={180} y={94} w={100} h={32} rx={10} className={styles.halo} />
      <Rect x={186} y={100} w={88} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M196,110 L240,110" />
      <Copy x={186} y={136} w={60} quiet />
    </>
  );
}

/** The risky interaction, built from code on the new platform and passing, before the crowd arrives. */
function RiskyInteractionsTriedCode() {
  const code: [number, number, number][] = [
    [62, 42, 40],
    [74, 50, 28],
    [86, 50, 36],
    [98, 42, 24],
    [110, 50, 32],
    [122, 42, 20],
  ];
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Glyph name="code" cx={48} cy={50} size={12} className={styles.glyph} />
      {code.map(([y, x, w]) => (
        <Copy key={y} x={x} y={y} w={w} quiet={x > 42} />
      ))}
      <Hop x1={110} x2={150} y={90} />
      {/* The interaction, running on the new platform. */}
      <Rect x={150} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={162} y={56} w={32} quiet />
      {/* A slider dragged along its track. */}
      <Rect x={162} y={76} w={56} h={8} rx={4} className={styles.tile} />
      <Rect x={162} y={76} w={36} h={8} rx={4} className={styles.soft} />
      <circle className={styles.nodeOpen} cx={198} cy={80} r={7} />
      <Cursor x={200} y={84} />
      <Focus x={190} y={118} glyph="check-circle" size={12} />
      {/* The wider rollout, waiting. */}
      <Rect x={250} y={60} w={40} h={60} rx={8} className={styles.trailFrame} />
      <Glyph
        name="users-group-rounded"
        cx={270}
        cy={90}
        size={18}
        className={styles.glyphQuiet}
      />
    </>
  );
}

/** The workflows customers rely on, held up against each candidate platform; the one that carries them lit. */
function HelpPlatformChoice() {
  const cols = [76, 160, 244];
  return (
    <>
      {/* The map of the workflows and saved work. */}
      <Rect x={40} y={30} w={240} h={40} rx={8} className={styles.tile} />
      {[56, 116, 176, 236].map((x, i) => (
        <g key={x}>
          <Rect x={x} y={42} w={28} h={16} rx={8} className={styles.frame} />
          {i < 3 ? <path className={styles.hair} d={`M${x + 28},50 L${x + 60},50`} /> : null}
        </g>
      ))}
      {/* The candidates, each judged against it. */}
      <Rect x={122} y={98} w={76} h={52} rx={14} className={styles.halo} />
      {cols.map((x) => {
        /* The middle route ends on the halo's outer ring, as in the months-between scene. */
        const tip = x === 160 ? 98 : 104;
        return (
          <g key={x}>
            <path className={styles.line} d={`M${x},70 L${x},${tip - 1}`} />
            <ArrowDown x={x} y={tip} />
            <circle className={styles.node} cx={x} cy={70} r="2.5" />
            <Rect x={x - 32} y={104} w={64} h={40} rx={8} className={styles.frame} />
            <Glyph
              name={x === 160 ? 'check-circle' : 'server'}
              cx={x - 16}
              cy={124}
              size={14}
              className={x === 160 ? styles.glyphAccent : styles.glyphQuiet}
            />
            <Copy x={x - 2} y={120} w={22} quiet={x !== 160} />
            <Copy x={x - 2} y={128} w={14} quiet />
          </g>
        );
      })}
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead, with our engineers always in, building the risky parts. */
function TeamReplatforming() {
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
      <Rect x={220} y={cy - 18} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={cy} glyph="code" />
      <Copy x={250} y={cy} w={26} quiet />
      <Hop x1={216} x2={180} y={cy} />
    </>
  );
}

/** The workflows and saved work (lit), the candidate platforms, and time with the migration's engineers. */
function NeedsReplatforming() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={56} glyph="checklist" size={12} />
      {[62, 98].map((x) => (
        <g key={x}>
          <Rect x={x - 14} y={83} w={28} h={20} rx={4} className={styles.frame} />
          <Glyph name="server" cx={x} cy={93} size={12} className={styles.glyph} />
        </g>
      ))}
      <C cx={62} cy={130} glyph="code" />
      <C cx={98} cy={130} glyph="clock-circle" />
      <path className={styles.line} d="M130,56 L144,56 A6,6 0 0 1 150,62 L150,93" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,93" />
      <path className={styles.line} d="M130,93 L150,93" />
      {[56, 93, 130].map((y) => (
        <circle key={y} className={styles.node} cx={130} cy={y} r="2.5" />
      ))}
      <circle className={styles.node} cx="150" cy="93" r="3.5" />
      <Hop x1={150} x2={190} y={93} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={206} y={58} w={48} />
      <Copy x={206} y={70} w={68} quiet />
      <Hatched x={206} y={86} w={68} h={40} />
    </>
  );
}

/** What each item should mean to the customer, checked; how the data moves stays with the engineers. */
function StopsReplatforming() {
  const theirs = (cy: number, glyphs: IconName[]) => {
    const x = 236 + 20 * (glyphs.length - 1);
    const w = 280 - x;
    return (
      <g key={cy}>
        {glyphs.map((glyph, i) => (
          <C key={glyph} cx={216 + i * 20} cy={cy} glyph={glyph} />
        ))}
        <Copy x={x} y={cy - 4} w={w} />
        <Copy x={x} y={cy + 4} w={Math.round(w * 0.7)} quiet />
      </g>
    );
  };
  return (
    <>
      {/* Ours: the item as the customer meets it on arrival. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={48} cy={66} size={14} className={styles.glyph} />
      <Copy x={62} y={66} w={28} quiet />
      <Rect x={42} y={80} w={56} h={20} className={styles.tile} />
      <Copy x={50} y={90} w={32} />
      <Copy x={42} y={114} w={44} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: the data's move and the engineers who run it. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      {theirs(50, ['database', 'server'])}
      {theirs(90, ['code'])}
      <Rect x={206} y={116} w={78} h={28} rx={6} className={styles.trailFrame} />
      <Glyph name="code-square" cx={224} cy={130} size={14} className={styles.glyphQuiet} />
      <Copy x={240} y={130} w={32} quiet />
    </>
  );
}

/**
 * /services/product-modernisation/replatforming-product-design · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each feature's fate.: Moved as it is, fixed on the way, moved later or left behind, decided feature by feature with a reason. */
  'wyg-replatforming-product-design-each-features-fate': EachFeaturesFate,
  /* The months in between, designed.: Who sees which version, where their records live and how support tells the versions apart. */
  'wyg-replatforming-product-design-months-between-designed': MonthsBetweenDesigned,
  /* A plan for saved work.: What happens to customers' saved views, filters, reports, roles and drafts, agreed item by item with your engineers. */
  'wyg-replatforming-product-design-plan-saved-work': PlanSavedWork,
  /* Names that still make sense.: Renamed features and moved settings carried over or explained, so help articles, training and habits survive the move. */
  'wyg-replatforming-product-design-names-still-make-sense': NamesStillMakeSense,
  /* Risky interactions tried in code: Risky interactions tried in code on the new platform, before the wider rollout. */
  'wyg-replatforming-product-design-risky-interactions-tried-code': RiskyInteractionsTriedCode,
  /* Help with the platform choice: Help with the platform choice, if you start early enough: the workflows and saved work customers rely on, mapped so each candidate platform  */
  'wyg-replatforming-product-design-help-platform-choice': HelpPlatformChoice,
  /* Who does the work: A senior designer runs the customer side of the move and does the design, and our engineers build the risky interactions on the new platform */
  'team-replatforming-product-design': TeamReplatforming,
  /* What we need from you: The workflows and saved work customers rely on, the chosen or candidate platforms, and time with the engineers running the migration. */
  'needs-replatforming-product-design': NeedsReplatforming,
  /* Where our part stops: How the data moves stays with your engineers, or with our Software Development team for the parts you hand us. We define what each item shou */
  'stops-replatforming-product-design': StopsReplatforming,
};
