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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** The component rebuilt in place: your real data routed into the table, lit on the screen that depends on it. */
function RebuiltInCode() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="database" cx={60} cy={90} size={22} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={146} y={46} w={40} quiet />
      <Copy x={146} y={58} w={72} />
      {/* The rebuilt table, on its own screen. */}
      <Rect x={140} y={72} w={140} h={64} rx={10} className={styles.halo} />
      <Rect x={146} y={78} w={128} h={52} rx={4} className={styles.region} />
      <path className={styles.regionEdge} d="M146,94 L274,94" />
      {[86, 106, 118].map((y, i) => (
        <g key={y}>
          <path className={styles.regionCopy} d={`M156,${y} L${176 + (i % 2) * 6},${y}`} />
          <path className={styles.regionCopy} d={`M200,${y} L${[244, 256, 236][i] ?? 240},${y}`} />
        </g>
      ))}
    </>
  );
}

/** Its contract: the component's purpose, options, states and behaviour written down beside it, key by value. */
function Contract() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Rect x={42} y={62} w={56} h={14} className={styles.tile} />
      {[92, 104, 116].map((y, i) => (
        <Copy key={y} x={42} y={y} w={[48, 36, 44][i] ?? 40} quiet />
      ))}
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={166} y={44} glyph="document-text" />
      <Copy x={192} y={52} w={56} />
      <path className={styles.rule} d="M166,72 L274,72" />
      {[86, 102, 118, 134].map((y, i) => (
        <g key={y}>
          <Copy x={166} y={y} w={20} quiet />
          <Copy x={198} y={y} w={[60, 44, 68, 36][i] ?? 40} />
        </g>
      ))}
    </>
  );
}

/** Every state on show: one board, its story list down the side, the component loading, finished and in error side by side. */
function EveryState() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M90,30 L90,150" />
      <Copy x={42} y={48} w={28} quiet />
      {[68, 84, 100, 116, 132].map((y, i) => (
        <Copy key={y} x={46} y={y} w={[28, 32, 24, 30, 20][i] ?? 24} quiet />
      ))}
      <Rect x={38} y={76} w={44} h={16} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M46,84 L72,84" />
      {/* Loading. */}
      <Rect x={106} y={52} w={50} h={76} rx={6} className={styles.tile} />
      <Rect x={116} y={66} w={30} h={4} rx={2} className={styles.soft} />
      <Rect x={116} y={78} w={22} h={4} rx={2} className={styles.soft} />
      <Rect x={116} y={90} w={26} h={4} rx={2} className={styles.soft} />
      <Rect x={116} y={106} w={30} h={12} rx={6} className={styles.soft} />
      {/* Finished. */}
      <Rect x={166} y={52} w={50} h={76} rx={6} className={styles.frame} />
      <Copy x={176} y={68} w={20} quiet />
      <Copy x={176} y={80} w={30} />
      <Copy x={176} y={92} w={24} quiet />
      <Rect x={176} y={106} w={30} h={12} rx={6} className={styles.tile} />
      {/* In error. */}
      <Rect x={226} y={52} w={50} h={76} rx={6} className={styles.frame} />
      <Glyph name="danger-triangle" cx={251} cy={78} size={16} className={styles.glyph} />
      <Copy x={238} y={96} w={26} quiet />
      <Rect x={236} y={106} w={30} h={12} rx={6} className={styles.frame} />
    </>
  );
}

/** Automatic checks: every later change on the line passes the same checks, the newest one lit. */
function AutomaticChecks() {
  const changes = [70, 130, 190];
  return (
    <>
      <path className={styles.line} d="M30,130 L283,130" />
      <ArrowRight x={290} y={130} />
      <circle className={styles.node} cx="30" cy="130" r="2.5" />
      {changes.map((x) => (
        <g key={x}>
          <path className={styles.rule} d={`M${x},127 L${x},84`} />
          <Rect x={x - 14} y={56} w={28} h={28} rx={8} className={styles.frame} />
          <Glyph name="check-circle" cx={x} cy={70} size={14} className={styles.glyph} />
        </g>
      ))}
      <path className={styles.rule} d="M250,127 L250,81" />
      <Focus x={250} y={70} glyph="check-circle" size={13} />
      {[...changes, 250].map((x) => (
        <circle key={x} className={styles.nodeOpen} cx={x} cy={130} r="3" />
      ))}
    </>
  );
}

/** Notes to extend it: a person and an AI assistant both reach the one component, as it is, through its notes. */
function NotesToExtend() {
  return (
    <>
      <Rect x={30} y={30} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="user" cx={50} cy={50} size={20} className={styles.glyph} />
      <Rect x={30} y={110} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={50} cy={130} size={20} className={styles.glyph} />
      <path
        className={styles.line}
        d="M70,50 L124,50 A6,6 0 0 1 130,56 L130,64 A6,6 0 0 0 136,70 L183,70"
      />
      <path
        className={styles.line}
        d="M70,130 L124,130 A6,6 0 0 0 130,124 L130,116 A6,6 0 0 1 136,110 L183,110"
      />
      <circle className={styles.node} cx="70" cy="50" r="2.5" />
      <circle className={styles.node} cx="70" cy="130" r="2.5" />
      <ArrowRight x={190} y={70} />
      <ArrowRight x={190} y={110} />
      {/* The component, its notes on top. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Chip x={204} y={42} glyph="notebook" />
      <Copy x={228} y={50} w={44} />
      <Rect x={204} y={82} w={72} h={44} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M214,96 L254,96" />
      <path className={styles.regionCopy} d="M214,108 L240,108" />
      <Copy x={204} y={138} w={52} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** Design engineers (the lead lit) do the work; your designers and developers join them when a state was never designed. */
function Team() {
  /* Your designers and developers, joining there and then. */
  const joiners: readonly [number, IconName][] = [[90, 'users-group-rounded']];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <C cx={92} cy={66} glyph="code" />
      <Copy x={110} y={62} w={50} />
      <Copy x={110} y={72} w={32} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <C cx={92} cy={114} glyph="code" />
      <Copy x={110} y={110} w={50} />
      <Copy x={110} y={120} w={32} quiet />
      {joiners.map(([cy, glyph]) => (
        <g key={cy}>
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

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The current code, the screen and its real data, and the developer who looks after it (lit). */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {/* The current code: one file of many. */}
      <Rect x={70} y={36} w={28} h={20} rx={4} className={styles.frameQuiet} />
      <Rect x={66} y={40} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="code" cx={80} cy={50} size={12} className={styles.glyph} />
      {/* The screen and its real data. */}
      <C cx={66} cy={90} glyph="monitor" />
      <C cx={94} cy={90} glyph="database" />
      {/* The developer who keeps it. */}
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

/* ── Where our part stops ───────────────────────────────────────────────────────── */

/** One product's component is ours (the check); one set shared across several products is another service. */
function Stops() {
  const products = [190, 230, 270];
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      {/* One product, the same shape as the three on the right, checked. */}
      <Rect x={68} y={56} w={24} h={40} rx={4} className={styles.frame} />
      <Copy x={74} y={68} w={12} quiet />
      <Copy x={74} y={78} w={8} quiet />
      <Focus x={80} y={118} glyph="check-circle" size={13} />
      {/* Several products sharing one set: not ours, no route crosses to it. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.tile} />
      <C cx={230} cy={50} glyph="layers" />
      <path
        className={styles.trail}
        d="M190,90 L190,76 A6,6 0 0 1 196,70 L264,70 A6,6 0 0 1 270,76 L270,90 M230,90 L230,58"
      />
      {products.map((cx) => (
        <g key={cx}>
          <Rect x={cx - 12} y={90} w={24} h={40} rx={4} className={styles.frame} />
          <Copy x={cx - 6} y={102} w={12} quiet />
          <Copy x={cx - 6} y={112} w={8} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /services/design-engineering/frontend-design-systems · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The component, rebuilt in code.: A data table, rich text editor, complex form or drag-and-drop list, built in place on the screen that depends on it, with your real data. */
  'wyg-frontend-design-systems-component-rebuilt-code': RebuiltInCode,
  /* Its contract.: Purpose, options, states, behaviour, accessibility and the real data it must handle, written down (an example follows below). */
  'wyg-frontend-design-systems-its-contract': Contract,
  /* Every state on show.: Each one in Storybook, or the tool your team already uses, so designers, developers and testers look at the same thing. */
  'wyg-frontend-design-systems-every-state-show': EveryState,
  /* Automatic checks.: Tests for appearance, behaviour and accessibility, run on every later change. */
  'wyg-frontend-design-systems-automatic-checks': AutomaticChecks,
  /* Notes to extend it.: In your naming conventions, written so people and AI coding assistants pick up the component as it is instead of copying and changing it. */
  'wyg-frontend-design-systems-notes-extend-it': NotesToExtend,
  /* Who does the work: Design engineers review the current code, keep what works and build the rest. When the component needs an option or a state the design never */
  'team-frontend-design-systems': Team,
  /* What we need from you: The current code, the screen that depends on the component, real data or a realistic sample, and the developer who will look after the compo */
  'needs-frontend-design-systems': Needs,
  /* Where our part stops: We work in one product. When several products need to share one set of components, that is Design System Implementation. */
  'stops-frontend-design-systems': Stops,
};
