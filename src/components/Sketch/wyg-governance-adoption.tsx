import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A small solid box carrying its tick, centred at (cx, cy). */
const Ticked = ({ cx, cy }: { cx: number; cy: number }) => (
  <>
    <Rect x={cx - 6} y={cy - 6} w={12} h={12} rx={3} className={styles.solid} />
    <path className={styles.tick} d={`M${cx - 3},${cy} L${cx - 0.5},${cy + 2.5} L${cx + 3},${cy - 2.5}`} />
  </>
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The library checked against a live screen: its parts match, and the one local copy (dashed, out of
 * line) is ringed and flagged.
 */
function MapWhereTeamsLeave() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      <C cx={50} cy={58} glyph="widget" />
      {[80, 100, 120].map((y) => (
        <Rect key={y} x={46} y={y - 6} w={48} h={12} rx={6} className={styles.tile} />
      ))}
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={48} w={40} quiet />
      {[68, 128].map((y) => (
        <g key={y}>
          <Rect x={166} y={y - 8} w={48} h={16} rx={8} className={styles.tile} />
          <Copy x={222} y={y} w={36} quiet />
        </g>
      ))}
      {/* The local copy: dashed, off the library's line, ringed. */}
      <Rect x={164} y={86} w={64} h={28} rx={14} className={styles.halo} />
      <Rect x={170} y={92} w={52} h={16} rx={8} className={styles.trailFrame} />
      <Focus x={262} y={100} glyph="flag" size={12} />
    </>
  );
}

/**
 * Each workaround sorted one of two ways: a missing case goes to the component, a slow approval goes
 * to the path.
 */
function GapsToldApart() {
  return (
    <>
      <Rect x={36} y={54} w={60} h={60} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Copy x={42} y={76} w={24} quiet />
      <Rect x={42} y={90} w={36} h={16} rx={8} className={styles.trailFrame} />
      <path
        className={styles.line}
        d="M90,90 L124,90 A6,6 0 0 0 130,84 L130,56 A6,6 0 0 1 136,50 L183,50"
      />
      <path className={styles.line} d="M124,90 A6,6 0 0 1 130,96 L130,124 A6,6 0 0 0 136,130 L183,130" />
      <path className={styles.solid} d="M190,50 L183,46 L183,54 Z" />
      <path className={styles.solid} d="M190,130 L183,126 L183,134 Z" />
      <circle className={styles.node} cx={90} cy={90} r="2.5" />
      {[
        [50, 'widget'],
        [130, 'clock-circle'],
      ].map(([cy, glyph]) => (
        <g key={cy as number}>
          <Rect x={190} y={(cy as number) - 20} w={100} h={40} rx={8} className={styles.frame} />
          <C cx={210} cy={cy as number} glyph={glyph as IconName} />
          <Copy x={228} y={(cy as number) - 4} w={44} />
          <Copy x={228} y={(cy as number) + 4} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/** An owner's disc, a person knocked out of it, at (cx, cy). */
const Owner = ({ cx, cy }: { cx: number; cy: number }) => (
  <>
    <circle className={styles.solid} cx={cx} cy={cy} r="8" />
    <Glyph name="user" cx={cx} cy={cy} size={10} className={styles.glyphOn} />
  </>
);

/** A layer's owner at (52, cy), joined by an 18-unit link to the port on the layer's left edge (x 70). */
const LayerOwner = ({ cy, lit = false }: { cy: number; lit?: boolean }) => (
  <>
    {lit ? <circle className={styles.halo} cx={52} cy={cy} r="14" /> : null}
    {lit ? (
      <Owner cx={52} cy={cy} />
    ) : (
      <>
        <circle className={styles.frame} cx={52} cy={cy} r="8" />
        <Glyph name="user" cx={52} cy={cy} size={10} className={styles.glyphQuiet} />
      </>
    )}
    <path className={lit ? styles.line : styles.rule} d={`M60,${cy} L70,${cy}`} />
    <circle className={lit ? styles.nodeOpen : styles.frame} cx={70} cy={cy} r="2.5" />
  </>
);

/**
 * The system in its layers, stacked: the foundations slab under the shared components under each
 * product's dashed exceptions, and every layer carries its named owner; the foundations' owner lit.
 */
function NamedOwners() {
  /* Drawn from x 38; moved one grid step right so the stack sits centred on the plate. */
  return (
    <g transform="translate(20,0)">
      {/* Exceptions: two dashed chips on top. */}
      {[70, 130].map((x) => (
        <g key={x}>
          <Rect x={x} y={44} w={50} h={20} rx={4} className={styles.trailFrame} />
          <Copy x={x + 10} y={54} w={30} quiet />
        </g>
      ))}
      <LayerOwner cy={54} />
      {/* Shared components: three solid chips. */}
      {[70, 130, 190].map((x) => (
        <g key={x}>
          <Rect x={x} y={78} w={50} h={20} rx={4} className={styles.tile} />
          <Copy x={x + 10} y={88} w={30} quiet />
        </g>
      ))}
      <LayerOwner cy={88} />
      {/* Foundations: one slab under everything, led by its glyph. */}
      <Rect x={70} y={112} w={180} h={24} rx={4} className={styles.frame} />
      <Chip x={80} y={116} glyph="layers" />
      <Copy x={106} y={124} w={64} quiet />
      <LayerOwner cy={124} lit />
    </g>
  );
}

/** A request taken through sort, build and release to its confirmation. */
function PathEveryChange() {
  const steps: [number, IconName][] = [
    [130, 'checklist'],
    [170, 'code'],
    [210, 'refresh'],
  ];
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frameQuiet} />
      <Glyph name="chat-round-dots" cx={60} cy={82} size={20} className={styles.glyph} />
      <Copy x={46} y={104} w={28} quiet />
      <path className={styles.line} d="M90,90 L120,90 M140,90 L160,90 M180,90 L200,90" />
      <circle className={styles.node} cx={90} cy={90} r="2.5" />
      {steps.map(([cx, glyph]) => (
        <g key={cx}>
          <Rect x={cx - 10} y={80} w={20} h={20} rx={4} className={styles.frame} />
          <Glyph name={glyph} cx={cx} cy={90} size={12} className={styles.glyph} />
        </g>
      ))}
      <Hop x1={220} x2={250} y={90} />
      <Focus x={270} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * Three ways to run the system (one central team, many contributors into one core, a shared core with
 * local layers), and the one chosen with you lit.
 */
function GovernanceModel() {
  return (
    <>
      {/* A central team over the parts. */}
      <Rect x={30} y={50} w={70} h={80} rx={8} className={styles.frameQuiet} />
      <Glyph name="users-group-rounded" cx={65} cy={74} size={18} className={styles.glyphQuiet} />
      {[47, 65, 83].map((cx) => (
        <Rect key={cx} x={cx - 6} y={100} w={12} h={12} rx={3} className={styles.tile} />
      ))}
      {/* Contributors into one core: the one chosen. */}
      <Rect x={119} y={44} w={82} h={92} rx={14} className={styles.halo} />
      <Rect x={125} y={50} w={70} h={80} rx={8} className={styles.frame} />
      {[142, 160, 178].map((cx) => (
        <g key={cx}>
          <Glyph name="user" cx={cx} cy={70} size={14} className={styles.glyph} />
          <path className={styles.line} d={`M${cx},82 L${cx},96`} />
        </g>
      ))}
      <Rect x={136} y={100} w={48} h={14} rx={4} className={styles.solid} />
      {/* A shared core inside its local layer. */}
      <Rect x={220} y={50} w={70} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={235} y={70} w={40} h={40} rx={6} className={styles.trailFrame} />
      <Rect x={245} y={80} w={20} h={20} rx={4} className={styles.tile} />
    </>
  );
}

/** The register: each exception a row with its type, its owner and its review date; one row lit. */
function ExceptionsRegister() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={56} />
      <path className={styles.rule} d="M30,62 L290,62" />
      {[82, 106, 130].map((cy) => {
        const lit = cy === 106;
        return (
          <g key={cy}>
            {lit ? <Rect x={40} y={cy - 12} w={240} h={24} rx={4} className={styles.region} /> : null}
            <Rect
              x={50}
              y={cy - 6}
              w={36}
              h={12}
              rx={6}
              className={lit ? styles.solid : styles.tile}
            />
            <Glyph name="user" cx={110} cy={cy} size={14} className={styles.glyph} />
            <path
              className={lit ? styles.regionCopy : styles.copyQuiet}
              d={`M124,${cy} L172,${cy}`}
            />
            <Glyph name="calendar" cx={210} cy={cy} size={14} className={styles.glyph} />
            <path
              className={lit ? styles.regionCopy : styles.copyQuiet}
              d={`M224,${cy} L260,${cy}`}
            />
          </g>
        );
      })}
    </>
  );
}

/**
 * The old version, dashed, carries its end date; its release notes and migration guide take teams on to
 * the new version, lit.
 */
function WayRetireComponents() {
  return (
    <>
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.trailFrame} />
      <C cx={46} cy={66} glyph="calendar" />
      <Glyph name="widget" cx={60} cy={94} size={20} className={styles.glyphQuiet} />
      <Copy x={46} y={116} w={28} quiet />
      <Hop x1={90} x2={110} y={90} />
      <Rect x={110} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <C cx={126} cy={66} glyph="document-text" />
      {[
        [86, 36],
        [98, 28],
        [110, 32],
      ].map(([y, w]) => (
        <Copy key={y} x={122} y={y as number} w={w as number} quiet />
      ))}
      <Hop x1={170} x2={198} y={90} />
      <Rect x={204} y={44} w={72} h={92} rx={14} className={styles.halo} />
      <Rect x={210} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Glyph name="widget" cx={240} cy={84} size={22} className={styles.glyphAccent} />
      <Copy x={226} y={112} w={28} />
    </>
  );
}

/**
 * Every screen counted, the ones on shared components and the local copies left, into one number:
 * the share of adoption, filling its bar.
 */
function AdoptionMeasures() {
  const thumbs: [number, number, boolean][] = [];
  [52, 98].forEach((y, r) =>
    [40, 68, 96].forEach((x, c) => thumbs.push([x, y, !((r === 0 && c === 2) || (r === 1 && c === 1))])),
  );
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frameQuiet} />
      {thumbs.map(([x, y, shared]) => (
        <g key={`${x}-${y}`}>
          <Rect x={x} y={y} w={24} h={30} rx={4} className={styles.tile} />
          <Rect
            x={x + 4}
            y={y + 16}
            w={16}
            h={8}
            rx={4}
            className={shared ? styles.region : styles.trailFrame}
          />
          <Copy x={x + 5} y={y + 8} w={10} quiet />
        </g>
      ))}
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={50} w={120} h={80} rx={8} className={styles.frame} />
      <Copy x={186} y={70} w={40} quiet />
      <C cx={266} cy={70} glyph="graph-up" />
      <Rect x={186} y={86} w={88} h={16} rx={8} className={styles.tile} />
      <Rect x={186} y={86} w={60} h={16} rx={8} className={styles.solid} />
      <Copy x={186} y={116} w={28} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/**
 * The senior designer leads, lit, with the design engineer who reads the code and the account lead
 * who keeps the schedule.
 */
function TeamGovernanceAdoption() {
  return (
    <>
      <Rect x={30} y={40} w={260} h={100} rx={8} className={styles.frame} />
      <Focus x={80} y={82} glyph="user" size={12} />
      <Copy x={64} y={116} w={32} quiet />
      <path className={styles.rule} d="M130,56 L130,124" />
      {[
        [170, 'code'],
        [240, 'calendar'],
      ].map(([cx, glyph]) => (
        <g key={cx as number}>
          <Glyph name="user" cx={cx as number} cy={80} size={20} className={styles.glyph} />
          <C cx={(cx as number) + 12} cy={96} glyph={glyph as IconName} />
          <Copy x={(cx as number) - 14} y={116} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/**
 * Access to the live screens, the code and the library; time with the owners; an honest account of how
 * changes travel today, routed into one trunk that reaches the work, still hatched.
 */
function NeedsGovernanceAdoption() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {[
        [54, 'monitor'],
        [80, 'code'],
        [106, 'widget'],
      ].map(([cx, glyph]) => (
        <C key={cx as number} cx={cx as number} cy={50} glyph={glyph as IconName} />
      ))}
      {[54, 80].map((cx) => (
        <Glyph key={cx} name="user" cx={cx} cy={90} size={16} className={styles.glyph} />
      ))}
      <C cx={106} cy={90} glyph="clock-circle" />
      <C cx={54} cy={130} glyph="chat-round-dots" />
      <Copy x={70} y={130} w={36} />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.nodeOpen} cx={130} cy={y} r="2.5" />
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

/**
 * The first changes, each ticked through, on our side of the line; past it, the system and its owners,
 * who run it from here.
 */
function StopsGovernanceAdoption() {
  return (
    <>
      <Rect x={30} y={50} w={100} h={80} rx={8} className={styles.frame} />
      {[70, 90, 110].map((cy) => (
        <g key={cy}>
          <Ticked cx={50} cy={cy} />
          <Copy x={66} y={cy} w={cy === 90 ? 32 : 44} quiet />
        </g>
      ))}
      <path className={styles.trail} d="M160,40 L160,140" />
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Glyph name="widget" cx={240} cy={64} size={24} className={styles.glyph} />
      {[220, 260].map((cx) => (
        <g key={cx}>
          <Glyph name="user" cx={cx} cy={106} size={18} className={styles.glyph} />
          <Copy x={cx - 10} y={128} w={20} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /services/design-systems/governance-adoption · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of where teams leave the system.: Live screens and code compared with the library, with every local copy and override listed. Our Design System Drift Checker gives a first lo */
  'wyg-governance-adoption-map-where-teams-leave': MapWhereTeamsLeave,
  /* Gaps told apart.: A missing case needs a better component; a slow approval needs a better path. Each workaround is labelled as one or the other. */
  'wyg-governance-adoption-gaps-told-apart': GapsToldApart,
  /* Named owners.: People in design and engineering for the foundations, the shared components and each product's exceptions. */
  'wyg-governance-adoption-named-owners': NamedOwners,
  /* A path for every change.: Request, sort, build, release and confirm, fitted to how your teams already plan work. */
  'wyg-governance-adoption-path-every-change': PathEveryChange,
  /* A governance model.: Central team, contribution model or shared core with local layers, chosen with you and set up with the people you have. */
  'wyg-governance-adoption-governance-model': GovernanceModel,
  /* An exceptions register.: Each exception with a type, an owner and a date to review it. */
  'wyg-governance-adoption-exceptions-register': ExceptionsRegister,
  /* A way to retire components.: Versioning, release notes, migration guidance and an end date for the old version. */
  'wyg-governance-adoption-way-retire-components': WayRetireComponents,
  /* Adoption measures.: How many screens use shared components and how many local copies remain, so adoption shows up as a number. */
  'wyg-governance-adoption-adoption-measures': AdoptionMeasures,
  /* Who does the work: A senior designer leads the governance work with a design engineer who reads your code, and an account lead runs the schedule. We take the f */
  'team-governance-adoption': TeamGovernanceAdoption,
  /* What we need from you: Access to live screens, code and the library, time with each system owner, and an honest account of how changes reach the system today. */
  'needs-governance-adoption': NeedsGovernanceAdoption,
  /* Where our part stops: Your owners run the system once the first changes are through. If nobody has agreed what belongs in the system, start with Design System Str */
  'stops-governance-adoption': StopsGovernanceAdoption,
};
