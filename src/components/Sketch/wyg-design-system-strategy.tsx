import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** An inventory: the parts found in Figma and in code listed, and the two that are the same part merged into one. */
function Inventory() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {/* One part found once. */}
      <C cx={50} cy={50} glyph="ruler-pen" />
      <Copy x={66} y={50} w={60} />
      {/* The same part twice: once in Figma, once in code. */}
      <C cx={50} cy={90} glyph="ruler-pen" />
      <Rect x={70} y={82} w={48} h={16} rx={8} className={styles.tile} />
      <C cx={50} cy={130} glyph="code" />
      <Rect x={70} y={122} w={48} h={16} rx={8} className={styles.tile} />
      {/* Merged: the two routes meet and carry on to the one part kept. */}
      <path
        className={styles.line}
        d="M190,90 L204,90 A6,6 0 0 1 210,96 L210,124 A6,6 0 0 1 204,130 L190,130"
      />
      <circle className={styles.node} cx="190" cy="90" r="2.5" />
      <circle className={styles.node} cx="190" cy="130" r="2.5" />
      <Hop x1={210} x2={240} y={110} />
      <Rect x={234} y={98} w={52} h={24} rx={12} className={styles.halo} />
      <Rect x={240} y={102} w={40} h={16} rx={8} className={styles.solid} />
    </>
  );
}

/** A scope map: the loose patterns sorted into four groups, shared (lit), product-specific, technical, still open. */
function ScopeMap() {
  return (
    <>
      {/* The patterns your teams use, unsorted. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={44} y={56} w={40} h={14} rx={7} className={styles.tile} />
      <Rect x={54} y={82} w={44} h={14} rx={4} className={styles.tile} />
      <Rect x={42} y={108} w={32} h={14} rx={7} className={styles.tile} />
      <Hop x1={110} x2={150} y={90} />
      {/* The map: four groups. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M220,30 L220,150 M150,90 L290,90" />
      <Focus x={185} y={60} glyph="users-group-rounded" size={12} />
      <C cx={244} cy={60} glyph="monitor" />
      <Copy x={258} y={60} w={18} quiet />
      <C cx={174} cy={120} glyph="code" />
      <Copy x={188} y={120} w={18} quiet />
      <Hatched x={234} y={106} w={42} h={28} />
    </>
  );
}

/** A structure: foundations under the components, and a theme layer on top that carries the brand. */
function StructureSystem() {
  return (
    <>
      {/* The theme layer, lit: two brands on one structure. */}
      <Rect x={54} y={30} w={212} h={40} rx={12} className={styles.halo} />
      <Rect x={60} y={36} w={200} h={28} rx={8} className={styles.region} />
      <circle className={styles.solid} cx="80" cy="50" r="6" />
      <circle className={styles.soft} cx="100" cy="50" r="6" />
      <path className={styles.regionCopy} d="M120,50 L172,50" />
      {/* Components, with room for the next one. */}
      <Rect x={60} y={80} w={200} h={28} rx={8} className={styles.frame} />
      <Rect x={74} y={88} w={40} h={12} rx={6} className={styles.tile} />
      <Rect x={122} y={88} w={40} h={12} rx={4} className={styles.tile} />
      <Hatched x={170} y={88} w={40} h={12} />
      {/* Foundations: colour, type, spacing. */}
      <Rect x={60} y={122} w={200} h={28} rx={8} className={styles.frame} />
      <circle className={styles.tile} cx="80" cy="136" r="5" />
      <Copy x={96} y={132} w={28} />
      <Copy x={96} y={140} w={18} quiet />
      <Rect x={144} y={138} w={4} h={4} rx={1} className={styles.tile} />
      <Rect x={154} y={134} w={8} h={8} rx={2} className={styles.tile} />
      <Rect x={168} y={130} w={12} h={12} rx={3} className={styles.tile} />
    </>
  );
}

/** Owners and rules: a change passes four people in turn, propose, build, sign off (lit), release. */
function OwnersContributionRules() {
  const stations: { cx: number; glyph: IconName }[] = [
    { cx: 55, glyph: 'document-text' },
    { cx: 125, glyph: 'code' },
    { cx: 195, glyph: 'check-circle' },
    { cx: 265, glyph: 'flag' },
  ];
  /* Each hop: a port on the source's right edge, an arrowhead on the target (the lit card's halo edge counts as its edge). */
  const hops: [number, number][] = [
    [75, 105],
    [145, 169],
    [221, 245],
  ];
  return (
    <>
      <Rect x={169} y={44} w={52} h={92} rx={12} className={styles.halo} />
      {stations.map(({ cx, glyph }) => {
        const lit = cx === 195;
        return (
          <g key={cx}>
            <Rect x={cx - 20} y={50} w={40} h={80} rx={8} className={styles.frame} />
            <Glyph name="user" cx={cx} cy={74} size={18} className={styles.glyph} />
            {lit ? (
              <>
                <Rect x={cx - 8} y={102} w={16} h={16} rx={4} className={styles.solid} />
                <Glyph name={glyph} cx={cx} cy={110} size={10} className={styles.glyphOn} />
              </>
            ) : (
              <C cx={cx} cy={110} glyph={glyph} />
            )}
          </g>
        );
      })}
      {/* The change's route, station to station. */}
      {hops.map(([x1, x2]) => (
        <g key={x1}>
          <path className={styles.line} d={`M${x1},90 L${x2 - 7},90`} />
          <ArrowRight x={x2} y={90} />
          <circle className={styles.node} cx={x1} cy={90} r="3" />
        </g>
      ))}
    </>
  );
}

/** A roadmap: the components needed first, in the order teams use them, the first one lit, the measure set before. */
function DesignSystemRoadmap() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {/* The measure, agreed before the build. */}
      <C cx={54} cy={48} glyph="graph-up" />
      <Copy x={70} y={48} w={48} quiet />
      {/* The order: first, next, later. */}
      <path className={styles.hair} d="M50,64 L270,64" />
      <Rect x={44} y={72} w={92} h={28} rx={10} className={styles.halo} />
      <Rect x={50} y={78} w={80} h={16} rx={4} className={styles.solid} />
      <Rect x={120} y={104} w={90} h={16} rx={4} className={styles.tile} />
      <Hatched x={190} y={126} w={80} h={16} />
    </>
  );
}

/** A business case: the screens rebuilt in every product, counted, against the far smaller cost once they are shared. */
function BusinessCaseNumbers() {
  return (
    <>
      {/* Today: each product rebuilds the same screens. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      {[50, 90, 130].map((y) => (
        <g key={y}>
          <C cx={50} cy={y} glyph="monitor" />
          <Copy x={66} y={y} w={28} quiet />
          <Glyph name="refresh" cx={110} cy={y} size={12} className={styles.glyphQuiet} />
        </g>
      ))}
      <Hop x1={130} x2={170} y={90} />
      {/* The numbers: the work today, and what is left after the first release (lit). */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={46} w={40} quiet />
      {/* Today's work, tall and outlined; what is left once shared, small and lit (its fill marks it). */}
      <Rect x={190} y={60} w={24} h={70} rx={4} className={styles.tile} />
      <Rect x={242} y={102} w={24} h={28} rx={4} className={styles.solid} />
      <path className={styles.rule} d="M186,130 L274,130" />
    </>
  );
}

/** Rules for AI tools: the AI assembles a screen from the system's parts, and the new part waits for a designer. */
function RulesAiCodingTools() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={60} cy={90} size={24} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      {/* The screen: parts from the system, assembled alone; the new part, not yet built. */}
      <Rect x={130} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {[48, 78].map((y) => (
        <g key={y}>
          <Rect x={144} y={y} w={48} h={16} rx={4} className={styles.tile} />
          <Glyph name="check-circle" cx={208} cy={y + 8} size={12} className={styles.glyphQuiet} />
        </g>
      ))}
      <Hatched x={144} y={116} w={72} h={28} />
      {/* The designer's sign-off on what is new. */}
      <path className={styles.line} d="M230,130 L252,130" />
      <circle className={styles.node} cx="230" cy="130" r="2.5" />
      <Focus x={270} y={130} glyph="user" size={12} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer leads (lit) with the account lead; the design engineer, always in, reads the code. */
function Team() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      {/* The senior designer, lit. */}
      <Focus x={60} y={60} glyph="user" size={12} />
      <Copy x={96} y={56} w={54} />
      <Copy x={96} y={64} w={36} quiet />
      {/* The account lead. */}
      <Glyph name="user" cx={60} cy={92} size={18} className={styles.glyph} />
      <Copy x={96} y={88} w={54} />
      <Copy x={96} y={96} w={36} quiet />
      {/* The design engineer, with the code. */}
      <Glyph name="user" cx={60} cy={122} size={18} className={styles.glyph} />
      <Glyph name="code" cx={82} cy={122} size={10} className={styles.glyph} />
      <Copy x={96} y={118} w={54} />
      <Copy x={96} y={126} w={36} quiet />
      {/* The components already in your code, read by the design engineer. */}
      <Rect x={220} y={104} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={108} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={122} glyph="code" />
      <Copy x={250} y={122} w={26} quiet />
      <Hop x1={216} x2={180} y={122} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** Leads from every team, someone who makes the product calls (lit), access to Figma and the code. */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {[56, 80, 104].map((x) => (
        <Glyph key={x} name="user" cx={x} cy={50} size={16} className={styles.glyph} />
      ))}
      <Focus x={80} y={90} glyph="user" size={12} />
      <Chips cx={80} cy={130} glyphs={['ruler-pen', 'code']} />
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

/** The plan, handed over (our check); the build, the day-to-day rules and an audit are separate choices. */
function Stops() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Copy x={42} y={78} w={56} />
      <Copy x={42} y={92} w={44} />
      <Copy x={42} y={106} w={52} />
      <Copy x={42} y={118} w={28} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="code" />
      <Theirs cy={90} glyph="checklist" />
      <Theirs cy={130} glyph="eye" />
    </>
  );
}

/**
 * /services/design-systems/design-system-strategy · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* An inventory.: What already exists in Figma and in code, and which duplicates to merge. */
  'wyg-design-system-strategy-inventory': Inventory,
  /* A scope map.: Every pattern your teams use, sorted into shared, product-specific, technical and still open, filled in for your products. */
  'wyg-design-system-strategy-scope-map': ScopeMap,
  /* A structure for the system.: How colours, type, spacing and components are organised, so the system grows without a reshuffle, and where a theme layer handles brand diff */
  'wyg-design-system-strategy-structure-system': StructureSystem,
  /* Owners and contribution rules.: Who proposes, who builds, who signs off and who releases, for each kind of change. */
  'wyg-design-system-strategy-owners-contribution-rules': OwnersContributionRules,
  /* A design system roadmap.: The components your products need first, in the order teams will use them, with the measures agreed before the build. */
  'wyg-design-system-strategy-design-system-roadmap': DesignSystemRoadmap,
  /* A business case in your numbers.: Which screens teams rebuild today, how often and in how many products, and what the first release would let them stop doing. */
  'wyg-design-system-strategy-business-case-numbers': BusinessCaseNumbers,
  /* Rules for AI coding tools.: What they may assemble from the system on their own, and what still needs a designer's sign-off. */
  'wyg-design-system-strategy-rules-ai-coding-tools': RulesAiCodingTools,
  /* Who does the work: A senior designer leads the strategy and runs the conversations with every team, a design engineer reads the components already in your code */
  'team-design-system-strategy': Team,
  /* What we need from you: Product, design and frontend leads from each team that will use the system, someone who can make product calls, and access to your Figma fil */
  'needs-design-system-strategy': Needs,
  /* Where our part stops: You get a plan, and the build is a separate choice. Design System Implementation builds it, Governance & Adoption runs the owners and rules  */
  'stops-design-system-strategy': Stops,
};
