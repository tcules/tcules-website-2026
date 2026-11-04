import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** Our team frame: the senior designer who leads (lit), and the second person beside them. */
function Crew() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={44} />
      <Copy x={90} y={72} w={28} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={44} />
      <Copy x={90} y={120} w={28} quiet />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** IDEA: the one component teams already use well is the one the library keeps. */
function WhatToKeep() {
  return (
    <>
      {/* The teams who use it. */}
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={60} cy={82} size={22} className={styles.glyph} />
      <Copy x={46} y={106} w={28} quiet />
      <Hop x1={90} x2={150} y={90} />
      {/* The library: three components, the one in good use kept. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Rect x={160} y={74} w={120} h={32} rx={10} className={styles.halo} />
      {(
        [
          [54, false, 44],
          [90, true, 44],
          [126, false, 36],
        ] as const
      ).map(([cy, kept, w]) => (
        <g key={cy}>
          <Rect
            x={166}
            y={cy - 10}
            w={108}
            h={20}
            className={kept ? styles.region : styles.tile}
          />
          <Rect
            x={174}
            y={cy - 5}
            w={20}
            h={10}
            rx={5}
            className={kept ? styles.solid : styles.tile}
          />
          {kept ? (
            <>
              <path className={styles.regionCopy} d={`M202,${cy} L${202 + w},${cy}`} />
              <Glyph name="check-circle" cx={262} cy={cy} size={12} className={styles.glyphAccent} />
            </>
          ) : (
            <Copy x={202} y={cy} w={w} quiet />
          )}
        </g>
      ))}
    </>
  );
}

/** IDEA: of the faults found, the one to repair first sits at the top of the list, lit. */
function WhatToRepairFirst() {
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      {/* First: broken behaviour, lit. */}
      <Rect x={70} y={38} w={180} h={36} rx={12} className={styles.halo} />
      <Rect x={76} y={44} w={168} h={24} className={styles.region} />
      <Glyph name="danger-triangle" cx={94} cy={56} size={14} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M122,56 L206,56" />
      {/* Then: Figma and code that disagree. */}
      <Rect x={76} y={80} w={168} h={24} className={styles.tile} />
      <Glyph name="ruler-pen" cx={88} cy={92} size={12} className={styles.glyphQuiet} />
      <Glyph name="code" cx={106} cy={92} size={12} className={styles.glyphQuiet} />
      <Copy x={122} y={92} w={64} quiet />
      {/* Then: a control some people can't operate. */}
      <Rect x={76} y={116} w={168} h={24} className={styles.tile} />
      <Glyph name="user" cx={94} cy={128} size={12} className={styles.glyphQuiet} />
      <Copy x={122} y={128} w={72} quiet />
    </>
  );
}

/** IDEA: a change request heads for the system's owner and stops short, waiting. */
function WhereRequestsStall() {
  return (
    <>
      {/* The request. */}
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="chat-round-dots" cx={60} cy={82} size={20} className={styles.glyph} />
      <Copy x={46} y={106} w={28} quiet />
      <Hop x1={90} x2={152} y={90} />
      {/* Where it stops. */}
      <Focus x={170} y={90} glyph="clock-circle" size={13} />
      {/* The rest of the way, never travelled, to the owner. */}
      <path className={styles.trail} d="M188,90 L230,90" />
      <Rect x={230} y={60} w={60} h={60} rx={8} className={styles.frameQuiet} />
      <Glyph name="user" cx={260} cy={82} size={20} className={styles.glyphQuiet} />
      <Copy x={246} y={106} w={28} quiet />
    </>
  );
}

/** IDEA: a new copy of a component, on its way in, is caught by an automatic check and flagged. */
function EarlyWarnings() {
  return (
    <>
      {/* The change: the library's control, and a new copy of it beside. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Rect x={42} y={78} w={44} h={14} rx={7} className={styles.tile} />
      <Rect x={42} y={102} w={44} h={14} rx={7} className={styles.trailFrame} />
      <Hop x1={110} x2={150} y={90} />
      {/* The automatic check. */}
      <Rect x={150} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="cpu" cx={170} cy={90} size={20} className={styles.glyph} />
      <Hop x1={190} x2={252} y={90} />
      {/* The flag it raises. */}
      <Focus x={270} y={90} glyph="flag" size={12} />
    </>
  );
}

/** IDEA: real screens sampled, and the share of them using the library counted into one gauge. */
function HowWidelyUsed() {
  const screens = [
    [40, 42, true],
    [76, 42, true],
    [112, 42, false],
    [40, 94, true],
    [76, 94, false],
    [112, 94, true],
  ] as const;
  return (
    <>
      {/* The sample: six real screens, the library's part in four of them. */}
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frameQuiet} />
      {screens.map(([x, y, uses]) => (
        <g key={`${x}-${y}`}>
          <Rect x={x} y={y} w={28} h={44} rx={4} className={styles.frame} />
          <Copy x={x + 6} y={y + 10} w={14} quiet />
          <Rect
            x={x + 6}
            y={y + 22}
            w={16}
            h={10}
            rx={3}
            className={uses ? styles.soft : styles.tile}
          />
        </g>
      ))}
      <Hop x1={150} x2={190} y={90} />
      {/* The measure: two thirds. */}
      <Rect x={190} y={60} w={100} h={60} rx={8} className={styles.frame} />
      <Copy x={206} y={78} w={36} quiet />
      <Rect x={206} y={92} w={68} h={12} rx={6} className={styles.tile} />
      <Rect x={206} y={92} w={46} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/* ── Who does the work · Where our part stops ─────────────────────────────────── */

/** IDEA: the senior designer leads, and a design engineer reads the code beside the Figma file. */
function Team() {
  return (
    <>
      <Crew />
      <Hop x1={150} x2={190} y={90} />
      {/* Figma and code in one view, side by side. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M240,30 L240,150" />
      <C cx={206} cy={46} glyph="ruler-pen" />
      <Copy x={200} y={70} w={30} />
      <Rect x={200} y={82} w={30} h={20} rx={4} className={styles.tile} />
      <Copy x={200} y={116} w={24} quiet />
      <Copy x={200} y={128} w={18} quiet />
      <C cx={256} cy={46} glyph="code" />
      {(
        [
          [70, 250, 30],
          [82, 258, 22],
          [94, 258, 18],
          [106, 250, 26],
          [118, 258, 20],
          [130, 250, 16],
        ] as const
      ).map(([y, x, w]) => (
        <Copy key={y} x={x} y={y} w={w} quiet />
      ))}
    </>
  );
}

/** IDEA: our audit ends at our check; the repairs and the call on who owns the system are theirs. */
function Stops() {
  return (
    <>
      {/* Our last piece: the audit, component by component. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      {[82, 98, 114].map((cy, i) => (
        <g key={cy}>
          <Rect x={42} y={cy - 5} w={16} h={10} rx={5} className={styles.tile} />
          <Copy x={66} y={cy} w={[32, 24, 28][i] ?? 28} />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: the repairs, by either team; who owns the system. No route enters. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <C cx={216} cy={70} glyph="code" />
      <C cx={236} cy={70} glyph="users-group-rounded" />
      <Copy x={256} y={66} w={24} />
      <Copy x={256} y={74} w={16} quiet />
      <C cx={216} cy={110} glyph="user" />
      <C cx={236} cy={110} glyph="flag" />
      <Copy x={256} y={106} w={24} />
      <Copy x={256} y={114} w={16} quiet />
    </>
  );
}

/* ── How it runs ──────────────────────────────────────────────────────────────── */

/**
 * IDEA: every version of one component (library, local copy, workaround) traced from the need
 * through Figma and code to the live screen; the local copy breaks first, in code, and never
 * reaches the live screen as designed.
 */
function Method() {
  const stages = [
    [70, 'ruler-pen'],
    [150, 'code'],
    [230, 'monitor'],
  ] as const;
  return (
    <>
      {/* The need. */}
      <Glyph name="user" cx={30} cy={90} size={16} className={styles.glyph} />
      {stages.map(([x, glyph]) => (
        <g key={x}>
          <Rect x={x} y={30} w={60} h={120} rx={8} className={styles.frame} />
          <C cx={x + 16} cy={44} glyph={glyph} />
          {/* The library version, the local copy, the workaround. */}
          <Rect x={x + 10} y={58} w={40} h={16} rx={8} className={styles.tile} />
          {x === 150 ? null : x === 230 ? (
            <Hatched x={x + 10} y={82} w={40} h={16} />
          ) : (
            <Rect x={x + 10} y={82} w={40} h={16} rx={3} className={styles.tile} />
          )}
          <Rect x={x + 10} y={106} w={40} h={16} rx={4} className={styles.trailFrame} />
        </g>
      ))}
      {/* The local copy's route, over the frames. */}
      <Hop x1={50} x2={70} y={90} />
      <Hop x1={130} x2={150} y={90} />
      <path className={styles.trail} d="M210,90 L230,90" />
      {/* Where it breaks first: the local copy, in code. */}
      <Rect x={154} y={76} w={52} h={28} rx={10} className={styles.halo} />
      <Rect x={160} y={82} w={40} h={16} rx={3} className={styles.solid} />
      <Glyph name="danger-triangle" cx={180} cy={90} size={11} className={styles.glyphOn} />
    </>
  );
}

/**
 * /audits/design-system-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What to keep. Patterns that work and that teams already use well. */
  'wyg-design-system-audit-what-to-keep': WhatToKeep,
  /* What to repair first. Broken behaviour, Figma and code mismatches, and controls some users can't operate. */
  'wyg-design-system-audit-what-to-repair-first': WhatToRepairFirst,
  /* Where requests stall. Who owns the system, how change requests move, and where they stop. */
  'wyg-design-system-audit-where-requests-stall': WhereRequestsStall,
  /* Early warnings. Automatic checks that flag new copies and accessibility slips. */
  'wyg-design-system-audit-early-warnings': EarlyWarnings,
  /* How widely it's used. Measured from your usage data, or sampled from real screens and code. */
  'wyg-design-system-audit-how-widely-used': HowWidelyUsed,
  /* Who does the work. A senior designer leads; a design engineer reads your code beside the Figma files. */
  'team-design-system-audit': Team,
  /* Where our part stops. Repairs are separate work, by your team or ours; who owns the system is your decision. */
  'stops-design-system-audit': Stops,
  /* The method's one figure, beside the numbered steps. How a design system audit runs: Agree the components and the price (one call to pick the ones you rely on most, then Figma, code and Storybook access). List every version: the library one, local copies and one-off workarounds. Trace where each one breaks, from the product need, through Figma and code, to the live screen. Ask why teams bypass it, agree fixes. FIGURE: every version of one component (library, local copies, workarounds) traced from the need through Figma and code to the live screen, the point it breaks first marked. */
  'method-design-system-audit': Method,
};
