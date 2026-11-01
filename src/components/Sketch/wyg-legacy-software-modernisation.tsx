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

/** A sheet centred at (cx, cy), with `behind` sheets stacked up and to the right: one of many. */
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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The old system at the centre of its map: its rules, its data and the systems connected to it written
 * down around it, and the one thing nobody had written down, the workaround people rely on, lit.
 */
function MapWhatSystemReallyDoes() {
  return (
    <>
      <Rect x={120} y={70} w={80} h={40} rx={8} className={styles.frame} />
      <Copy x={134} y={84} w={40} />
      <Copy x={134} y={96} w={28} quiet />
      {/* Rules, above. */}
      <path className={styles.rule} d="M160,70 L160,50" />
      <C cx={160} cy={42} glyph="checklist" />
      <Copy x={176} y={42} w={36} quiet />
      {/* Data, left. */}
      <path className={styles.rule} d="M120,90 L90,90" />
      <C cx={82} cy={90} glyph="database" />
      <Copy x={40} y={90} w={24} quiet />
      {/* The connected systems, below. */}
      <path className={styles.rule} d="M160,110 L160,130" />
      <C cx={160} cy={138} glyph="server" />
      <Copy x={176} y={138} w={36} quiet />
      {/* The workaround nobody wrote down: found, its outline still dashed, lit. */}
      <Rect x={214} y={74} w={72} h={32} rx={16} className={styles.halo} />
      <Rect x={220} y={80} w={60} h={20} rx={10} className={styles.trailFrame} />
      <Glyph name="bolt-circle" cx={234} cy={90} size={12} className={styles.glyphAccent} />
      <Copy x={244} y={90} w={24} quiet />
      <path className={styles.line} d="M200,90 L220,90" />
      <circle className={styles.node} cx={200} cy={90} r="2.5" />
    </>
  );
}

/**
 * Every rule judged: two kept, each with its reason; the one that goes changes, and its route leads to
 * the plan for what replaces it, not built yet.
 */
function KeepOrChangeEachRule() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {[50, 130].map((y) => (
        <g key={y}>
          <C cx={60} cy={y} glyph="check-circle" />
          <Copy x={90} y={y - 4} w={72} />
          <Copy x={90} y={y + 4} w={48} quiet />
        </g>
      ))}
      <Focus x={60} y={90} glyph="refresh" size={12} />
      <Copy x={90} y={86} w={60} />
      <Copy x={90} y={94} w={40} quiet />
      <Hop x1={190} x2={216} y={90} />
      {/* The plan for what replaces it: a screen not built yet. */}
      <Rect x={220} y={66} w={60} h={48} rx={8} className={styles.trailFrame} />
      <Copy x={232} y={82} w={28} quiet />
      <Hatched x={232} y={92} w={36} h={12} />
    </>
  );
}

/**
 * Three stages in order: the old system's share of the work shrinks as the new one's grows, until the
 * new system carries all of it.
 */
function StagedPlan() {
  const stages = [
    { x: 30, old: 56 },
    { x: 130, old: 32 },
    { x: 230, old: 0 },
  ] as const;
  return (
    <>
      {stages.map(({ x, old }) => {
        const top = 48;
        const bottom = 132;
        const split = top + old;
        return (
          <g key={x}>
            <Rect x={x} y={40} w={60} h={100} rx={8} className={styles.frame} />
            {old ? (
              <>
                <Rect x={x + 8} y={top} w={44} h={old - 4} rx={4} className={styles.tile} />
                <Copy x={x + 16} y={top + 10} w={20} quiet />
              </>
            ) : null}
            <Rect
              x={x + 8}
              y={split}
              w={44}
              h={bottom - split}
              rx={4}
              className={old ? styles.halo : styles.region}
            />
          </g>
        );
      })}
      <Hop x1={90} x2={130} y={90} />
      <Hop x1={190} x2={230} y={90} />
    </>
  );
}

/**
 * The old screen's saved work carried into the new stage's design, which comes with its states behind
 * it: the person's own document arrives, lit, in the new screen.
 */
function DesignsEachStage() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Copy x={42} y={64} w={32} quiet />
      <Rect x={42} y={78} w={56} h={24} rx={4} className={styles.tile} />
      <Glyph name="document-text" cx={56} cy={90} size={12} className={styles.glyphQuiet} />
      <Copy x={68} y={90} w={20} quiet />
      <Copy x={42} y={116} w={44} quiet />
      <Hop x1={110} x2={170} y={90} />
      <Rect x={178} y={30} w={112} h={104} rx={8} className={styles.frameQuiet} />
      <Rect x={174} y={34} w={112} h={104} rx={8} className={styles.frameQuiet} />
      <Rect x={170} y={38} w={112} h={104} rx={8} className={styles.frame} />
      <Copy x={186} y={54} w={40} quiet />
      <Rect x={186} y={78} w={80} h={24} rx={4} className={styles.region} />
      <Glyph name="document-text" cx={200} cy={90} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M214,90 L252,90" />
      <Copy x={186} y={116} w={64} />
      <Copy x={186} y={128} w={40} quiet />
    </>
  );
}

/**
 * Staff and customers cross from the old system to the new one, and a designer stands beside the
 * crossing, lit, on hand while they move.
 */
function HelpThroughEachRollout() {
  return (
    <>
      {/* The old system: quiet, a hatched strip where it has worn. */}
      <Rect x={30} y={40} w={64} h={84} rx={8} className={styles.frameQuiet} />
      <Copy x={40} y={56} w={32} quiet />
      <Copy x={40} y={68} w={40} quiet />
      <Copy x={40} y={80} w={24} quiet />
      <Hatched x={40} y={96} w={44} h={16} />
      {/* The new system. */}
      <Rect x={226} y={40} w={64} h={84} rx={8} className={styles.frame} />
      <Copy x={236} y={56} w={32} quiet />
      <Copy x={236} y={68} w={40} />
      <Copy x={236} y={80} w={24} quiet />
      {/* Staff, then customers, crossing on the route at real size. */}
      <path className={styles.line} d="M94,82 L112,82" />
      <circle className={styles.node} cx={94} cy={82} r="2.5" />
      <circle className={styles.frame} cx={124} cy={82} r={12} />
      <Glyph name="user" cx={124} cy={82} size={16} className={styles.glyph} />
      <path className={styles.line} d="M136,82 L178,82" />
      <circle className={styles.frame} cx={190} cy={82} r={12} />
      <Glyph name="users-group-rounded" cx={190} cy={82} size={16} className={styles.glyph} />
      <path className={styles.line} d="M202,82 L219,82" />
      <ArrowRight x={226} y={82} />
      {/* The designer, lit, on hand between the travellers. */}
      <circle className={styles.node} cx={157} cy={82} r="2.5" />
      <path className={styles.line} d="M157,82 L157,100" />
      <Focus x={157} y={124} glyph="user" size={14} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; Software Development joins to build agreed parts. */
function TeamLegacySoftwareModernisation() {
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

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The running system (lit), staff we can watch at work, and whatever documentation exists. */
function NeedsLegacySoftwareModernisation() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={50} glyph="monitor" size={12} />
      <C cx={66} cy={90} glyph="users-group-rounded" />
      <C cx={94} cy={90} glyph="eye" />
      <Sheet cx={72} cy={134} behind={2} />
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
 * Our staged plan, checked; the cloud migration and infrastructure moves, the platform team or
 * specialist firm who make them, and the product calls stay theirs.
 */
function StopsLegacySoftwareModernisation() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      {[42, 62, 82].map((x) => (
        <Rect key={x} x={x} y={80} w={16} h={20} rx={4} className={styles.tile} />
      ))}
      <Copy x={42} y={114} w={44} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['server', 'layers']} />
      <Theirs cy={90} glyphs={['users-group-rounded']} />
      <Theirs cy={130} glyphs={['flag']} />
    </>
  );
}

/**
 * /services/product-modernisation/legacy-software-modernisation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A map of what the system really does.: Its behaviour, rules, data, connected systems and the workarounds people rely on, written down. */
  'wyg-legacy-software-modernisation-map-what-system-really': MapWhatSystemReallyDoes,
  /* A keep-or-change call on each rule.: Judged by what the rule does for your users and the business, with a reason for every rule that stays and a plan for every one that goes. */
  'wyg-legacy-software-modernisation-keeporchange-call-each-rule': KeepOrChangeEachRule,
  /* A staged plan.: The order of change, and how the old and new systems share the work in between. */
  'wyg-legacy-software-modernisation-staged-plan': StagedPlan,
  /* Designs for each stage.: Screens, states and the move of people's saved work, ready for your engineers or ours. */
  'wyg-legacy-software-modernisation-designs-each-stage': DesignsEachStage,
  /* Help through each rollout.: Designers on hand while staff and customers move across. */
  'wyg-legacy-software-modernisation-help-through-each-rollout': HelpThroughEachRollout,
  /* Who does the work: A senior designer leads and does the work, and owns what users notice: which rules carry over, how the new screens behave and how people mov */
  'team-legacy-software-modernisation': TeamLegacySoftwareModernisation,
  /* What we need from you: The running system, staff we can watch at work, and whatever documentation exists for the system and the software connected to it. */
  'needs-legacy-software-modernisation': NeedsLegacySoftwareModernisation,
  /* Where our part stops: Cloud migration and other infrastructure moves stay with your platform team or a specialist firm. We plan alongside them so product and plat */
  'stops-legacy-software-modernisation': StopsLegacySoftwareModernisation,
};
