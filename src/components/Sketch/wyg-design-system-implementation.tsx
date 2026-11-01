import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** One side's file: its tool chip, the token in use (the blue swatch and its name), a quiet line. */
function TokenUse({ x, glyph }: { x: number; glyph: IconName }) {
  return (
    <>
      <Rect x={x} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={x + 20} cy={68} glyph={glyph} />
      <Rect x={x + 12} y={84} w={12} h={12} rx={3} className={styles.solid} />
      <Copy x={x + 32} y={90} w={32} />
      <Copy x={x + 12} y={112} w={44} quiet />
    </>
  );
}

/**
 * One name for one thing: the token, its meaning on top and the raw values under it, carried the
 * same into the design file on the left and the code on the right.
 */
function DesignTokensNamedMeaning() {
  return (
    <>
      <TokenUse x={30} glyph="ruler-pen" />
      <TokenUse x={210} glyph="code" />
      {/* The token: the meaning on top, lit; the raw values underneath, quiet. */}
      <Rect x={124} y={44} w={72} h={92} rx={14} className={styles.halo} />
      <Rect x={130} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Rect x={142} y={60} w={14} h={14} rx={3} className={styles.solid} />
      <Copy x={162} y={67} w={16} />
      <path className={styles.rule} d="M130,84 L190,84" />
      {[142, 155, 168].map((x) => (
        <Rect key={x} x={x} y={98} w={10} h={10} rx={2} className={styles.tile} />
      ))}
      <Copy x={142} y={118} w={36} quiet />
      <path className={styles.line} d="M130,90 L117,90" />
      <ArrowLeft x={110} y={90} />
      <Hop x1={190} x2={210} y={90} />
    </>
  );
}

/** A variant of one control: loading, empty, error, disabled, at (x, cy). */
function Variant({ x, cy, kind }: { x: number; cy: number; kind: 0 | 1 | 2 | 3 }) {
  const y = cy - 8;
  if (kind === 0)
    return (
      <>
        <Rect x={x} y={y} w={32} h={16} rx={8} className={styles.tile} />
        {[10, 16, 22].map((dx) => (
          <circle key={dx} className={styles.knob} cx={x + dx} cy={cy} r="1.5" />
        ))}
      </>
    );
  if (kind === 1) return <Rect x={x} y={y} w={32} h={16} rx={8} className={styles.trailFrame} />;
  if (kind === 2)
    return (
      <>
        <Rect x={x} y={y} w={32} h={16} rx={8} className={styles.frame} />
        <Glyph name="danger-triangle" cx={x + 16} cy={cy} size={10} className={styles.glyph} />
      </>
    );
  return (
    <>
      <Rect x={x} y={y} w={32} h={16} rx={8} className={styles.tile} />
      <Copy x={x + 10} y={cy} w={12} quiet />
    </>
  );
}

/** One strip: its tool chip, then the control in its four states. */
function States({ cy, glyph }: { cy: number; glyph: IconName }) {
  return (
    <>
      <Rect x={30} y={cy - 20} w={210} h={40} rx={8} className={styles.frame} />
      <C cx={50} cy={cy} glyph={glyph} />
      {[0, 1, 2, 3].map((k) => (
        <Variant key={k} x={74 + k * 40} cy={cy} kind={k as 0 | 1 | 2 | 3} />
      ))}
    </>
  );
}

/** Every state of a component, the same in the design file and in code: the two meet in one check. */
function ComponentsBothPlaces() {
  return (
    <>
      <States cy={50} glyph="ruler-pen" />
      <States cy={130} glyph="code" />
      <path className={styles.line} d="M240,50 L264,50 A6,6 0 0 1 270,56 L270,79" />
      <path className={styles.line} d="M240,130 L264,130 A6,6 0 0 0 270,124 L270,101" />
      <circle className={styles.node} cx={240} cy={50} r="2.5" />
      <circle className={styles.node} cx={240} cy={130} r="2.5" />
      <Focus x={270} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/**
 * A new team member reads the page (when to use it, what can vary) and lands on the right part in
 * its worked example, without asking anyone.
 */
function Documentation() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frameQuiet} />
      <Glyph name="user" cx={60} cy={82} size={20} className={styles.glyph} />
      <Copy x={46} y={106} w={28} quiet />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <C cx={150} cy={50} glyph="notebook" />
      <Copy x={166} y={50} w={60} />
      <Copy x={146} y={70} w={96} quiet />
      <Copy x={146} y={82} w={72} quiet />
      {/* The worked example, its component lit. */}
      <Rect x={146} y={96} w={128} h={40} rx={4} className={styles.tile} />
      <Rect x={164} y={104} w={52} h={24} rx={12} className={styles.halo} />
      <Rect x={170} y={110} w={40} h={12} rx={6} className={styles.solid} />
      <Copy x={230} y={112} w={28} quiet />
    </>
  );
}

/** The one arrowhead pointing down, tip at (x, y). */
const ArrowDown = ({ x, y }: { x: number; y: number }) => (
  <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />
);

/**
 * A release on the version line: the earlier versions passed, the next ones still to come, and the
 * new one, lit, hands down its notes: what changed, and the steps each team takes to move onto it.
 */
function VersioningReleases() {
  return (
    <>
      <path className={styles.rule} d="M40,50 L152,50" />
      <path className={styles.trail} d="M188,50 L280,50" />
      {[70, 110, 250].map((x) => (
        <circle key={x} className={styles.tile} cx={x} cy={50} r="3.5" />
      ))}
      <Focus x={170} y={50} glyph="flag" size={12} />
      <path className={styles.line} d="M170,68 L170,83" />
      <ArrowDown x={170} y={90} />
      <Rect x={110} y={90} w={120} h={60} rx={8} className={styles.frame} />
      <Copy x={126} y={104} w={56} />
      {[120, 136].map((y, i) => (
        <g key={y}>
          <Rect x={126} y={y - 5} w={10} h={10} rx={3} className={styles.solid} />
          <path className={styles.tick} d={`M128.5,${y} L130.5,${y + 2} L133.5,${y - 2}`} />
          <Copy x={144} y={y} w={[64, 48][i] ?? 48} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * One agreed area of the real product, rebuilt from the system, holds with real records at both
 * sizes: the area lit on the desktop screen and on the phone.
 */
function SystemRealAreaProduct() {
  const rows = [
    [96, 64],
    [72, 40],
    [104, 56],
  ] as const;
  return (
    <>
      <Rect x={30} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M70,30 L70,150" />
      {[50, 66, 82].map((y) => (
        <Copy key={y} x={42} y={y} w={16} quiet />
      ))}
      <Copy x={84} y={48} w={56} />
      <Rect x={82} y={62} w={116} h={76} rx={4} className={styles.region} />
      {rows.map(([a, b], i) => (
        <g key={a}>
          <path className={styles.regionCopy} d={`M94,${80 + i * 20} L${94 + a * 0.6},${80 + i * 20}`} />
          <path
            className={styles.regionCopy}
            d={`M${190 - b * 0.4},${80 + i * 20} L186,${80 + i * 20}`}
          />
        </g>
      ))}
      <Rect x={230} y={50} w={60} h={100} rx={8} className={styles.frame} />
      <Copy x={242} y={66} w={24} />
      <Rect x={238} y={78} w={44} h={60} rx={4} className={styles.region} />
      {rows.map(([a], i) => (
        <path
          key={a}
          className={styles.regionCopy}
          d={`M246,${92 + i * 16} L${246 + a * 0.28},${92 + i * 16}`}
        />
      ))}
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/**
 * Inside your team: the senior designer, lit, and the design engineer with the code, sit in your
 * team's ground beside the people who will keep the system running.
 */
function TeamDesignSystemImplementation() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.tile} />
      <Rect x={50} y={50} w={130} h={80} rx={8} className={styles.frame} />
      <Focus x={84} y={82} glyph="user" size={12} />
      <Copy x={70} y={116} w={28} quiet />
      <Glyph name="user" cx={146} cy={82} size={20} className={styles.glyph} />
      <C cx={136} cy={116} glyph="code" />
      <Copy x={150} y={116} w={16} quiet />
      {[214, 258].map((cx) => (
        <g key={cx}>
          <Glyph name="user" cx={cx} cy={82} size={20} className={styles.glyphQuiet} />
          <Copy x={cx - 14} y={108} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/**
 * The handover: scope and its owners, access to the design file and the codebase, and the real
 * product area, lit, routed into one trunk that reaches the work, still hatched, waiting on them.
 */
function NeedsDesignSystemImplementation() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      {/* Scope and owners. */}
      <C cx={66} cy={50} glyph="flag" />
      <C cx={94} cy={50} glyph="user" />
      {/* Access to the design file and the codebase. */}
      <C cx={66} cy={88} glyph="ruler-pen" />
      <C cx={94} cy={88} glyph="code" />
      {/* The real product area, lit. */}
      <Rect x={46} y={106} w={68} h={36} rx={10} className={styles.halo} />
      <Rect x={52} y={112} w={56} h={24} rx={4} className={styles.frame} />
      <Rect x={76} y={116} w={26} h={16} rx={3} className={styles.solid} />
      <Copy x={60} y={120} w={10} quiet />
      <Copy x={60} y={128} w={8} quiet />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,88" />
      <path className={styles.line} d="M130,124 L144,124 A6,6 0 0 0 150,118 L150,88" />
      <path className={styles.line} d="M130,88 L150,88" />
      {[50, 88, 124].map((y) => (
        <circle key={y} className={styles.node} cx={130} cy={y} r="2.5" />
      ))}
      <circle className={styles.node} cx="150" cy="88" r="3.5" />
      <Hop x1={150} x2={190} y={88} />
      <Rect x={190} y={38} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={206} y={56} w={48} />
      <Copy x={206} y={68} w={68} quiet />
      <Hatched x={206} y={84} w={68} h={40} />
    </>
  );
}

/* ── Where our part stops ───────────────────────────────────────────────────────── */

/** What becomes theirs, one row: its chips, a heading line and a quiet one. */
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
 * The handover: the system we built (one of many parts) routed to our check; on their panel, the
 * library and the code, the documentation, and the release rules, theirs from here. Nothing crosses.
 */
function StopsDesignSystemImplementation() {
  return (
    <>
      <Rect x={34} y={56} w={60} h={60} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="widget" cx={60} cy={82} size={18} className={styles.glyph} />
      <Copy x={46} y={104} w={28} quiet />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={152} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['ruler-pen', 'code']} />
      <Theirs cy={90} glyphs={['notebook']} />
      <Theirs cy={130} glyphs={['refresh']} />
    </>
  );
}

/**
 * /services/design-systems/design-system-implementation · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Design tokens named by meaning.: Raw colour, type and spacing values sit underneath, and names such as "danger" or "link" sit on top, the same in Figma and in code. A brand  */
  'wyg-design-system-implementation-design-tokens-named-meaning': DesignTokensNamedMeaning,
  /* Components in both places.: The families your products use most, each with its loading, empty, error and disabled versions, in Figma and as a React component library, o */
  'wyg-design-system-implementation-components-both-places': ComponentsBothPlaces,
  /* Documentation.: When to use each component, what can vary and a worked example, in Storybook or the tool your team already reads. Written so people, and the */
  'wyg-design-system-implementation-documentation': Documentation,
  /* Versioning and releases.: Release notes and a guide for moving each product onto a new version. Done when teams know what changed and what they need to do. */
  'wyg-design-system-implementation-versioning-releases': VersioningReleases,
  /* The system on a real area of your product.: An agreed area rebuilt from the system, with real records and real screen sizes, before you sign off version one. Done when that area works  */
  'wyg-design-system-implementation-system-real-area-product': SystemRealAreaProduct,
  /* Who does the work: Design engineers build the coded components inside your codebase, alongside a senior product designer who leads the system and designs its p */
  'team-design-system-implementation': TeamDesignSystemImplementation,
  /* What we need from you: Agreed scope and owners, access to your Figma files and codebase, a real product area to try the system on, and time with the designers and  */
  'needs-design-system-implementation': NeedsDesignSystemImplementation,
  /* Where our part stops: Your team owns the Figma library, the code, the documentation and the release rules once they are handed over. If scope and owners are still */
  'stops-design-system-implementation': StopsDesignSystemImplementation,
};
