import type { ReactNode } from 'react';

import { CURSOR, Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';
import type { ScopeSceneName, TraceSceneName } from '@/lib/sketches';

/**
 * The KIT drawings: EngagementOptions' scopes and TracePlates' stages, drawn in the flat-graphics
 * grammar beside the service and article scenes (owner, 26 Oct 2026, S2: "even though it is
 * placeholder stuff, i think they should still reflect the styles as closely as possible"). Still,
 * like every plate. Same vocabulary as ./scenes: screens at 8 with a darker heading line and copy on
 * a 12-unit pitch, routes on the axes ending on a port or the one arrowhead, people and objects as
 * Solar glyphs, hatching for what is not built, one focal point.
 */

/** The one arrowhead pointing right, tip at (x, y): filled, 7 long, 8 wide. */
function ArrowRight({ x, y }: { x: number; y: number }) {
  return (
    <path className={styles.solid} d={`M${x},${y} L${x - 7},${y - 4} L${x - 7},${y + 4} Z`} />
  );
}

/** A route from a port at x1 to the arrowhead's tip at x2, on y. */
function Hop({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <>
      <path className={styles.line} d={`M${x1},${y} L${x2 - 7},${y}`} />
      <ArrowRight x={x2} y={y} />
      <circle className={styles.node} cx={x1} cy={y} r="2.5" />
    </>
  );
}

/** A small screen: its frame, a heading line and a line of copy, at (x, y), 60 × 60. */
function MiniScreen({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect className={styles.frame} x={x} y={y} width="60" height="60" rx="8" />
      <path className={styles.copyQuiet} d={`M${x + 12},${y + 14} L${x + 36},${y + 14}`} />
      <path className={styles.copy} d={`M${x + 12},${y + 26} L${x + 48},${y + 26}`} />
    </>
  );
}

/* ── Engagement scopes ──────────────────────────────────────────────────────────── */

/** One workflow: three screens joined by one route, the last one's action lit. */
function ScopeFeature() {
  return (
    <>
      {[30, 130, 230].map((x) => (
        <MiniScreen key={x} x={x} y={60} />
      ))}
      <rect className={styles.tile} x="42" y="98" width="36" height="12" rx="4" />
      <rect className={styles.tile} x="142" y="98" width="36" height="12" rx="4" />
      <rect className={styles.halo} x="236" y="92" width="48" height="24" rx="8" />
      <rect className={styles.solid} x="242" y="98" width="36" height="12" rx="4" />
      <Hop x1={90} x2={130} y={90} />
      <Hop x1={190} x2={230} y={90} />
    </>
  );
}

/**
 * A pilot project: "one flow … at a fixed price agreed up front". The agreement comes first, its price
 * set and the hand-shake lit (the one focal point), and one route from it into the only thing in scope:
 * one flow of two screens, held in its own region so nothing else is in it.
 */
function ScopePilot() {
  return (
    <>
      <rect className={styles.frame} x="30" y="40" width="76" height="100" rx="8" />
      <Chip x={40} y={50} glyph="wallet" />
      <path className={styles.copyQuiet} d="M40,78 L92,78" />
      <path className={styles.copy} d="M40,90 L80,90" />
      <Focus x={68} y={116} glyph="hand-shake" size={12} />
      <Hop x1={106} x2={136} y={90} />
      <rect className={styles.region} x="136" y="50" width="154" height="80" rx="8" />
      {[150, 228].map((x, i) => (
        <g key={x}>
          <rect className={styles.frame} x={x} y="66" width="48" height="48" rx="8" />
          <path className={styles.copyQuiet} d={`M${x + 10},${78} L${x + 30},${78}`} />
          <path className={styles.copy} d={`M${x + 10},${90} L${x + 38},${90}`} />
          <rect className={styles.tile} x={x + 10} y="98" width={i === 1 ? 28 : 20} height="8" rx="3" />
        </g>
      ))}
      <Hop x1={198} x2={228} y={90} />
    </>
  );
}

/** A product area: the product, its navigation, and the area we take, holding its own flows. */
function ScopeArea() {
  return (
    <>
      <rect className={styles.frame} x="30" y="30" width="260" height="120" rx="8" />
      <path className={styles.rule} d="M90,30 L90,150" />
      <path className={styles.copyQuiet} d="M42,50 L70,50" />
      <path className={styles.copy} d="M42,62 L78,62" />
      <path className={styles.copy} d="M42,74 L74,74" />
      <path className={styles.copy} d="M42,86 L66,86" />
      <rect className={styles.region} x="106" y="42" width="172" height="96" rx="4" />
      {[62, 90, 118].map((y, i) => (
        <g key={y}>
          <Hop x1={126} x2={210} y={y} />
          <rect
            className={i === 1 ? styles.solid : styles.frame}
            x="210"
            y={y - 8}
            width="52"
            height="16"
            rx="4"
          />
        </g>
      ))}
    </>
  );
}

/** A designer in your team: your people in your space, ours the one lit among them. */
function ScopeEmbedded() {
  return (
    <>
      <rect className={styles.frameQuiet} x="50" y="36" width="220" height="108" rx="8" />
      {(
        [
          [100, 70],
          [140, 70],
          [180, 70],
          [220, 70],
          [120, 110],
          [200, 110],
        ] as const
      ).map(([x, y]) => (
        <Glyph key={`${x}-${y}`} name="user" cx={x} cy={y} size={20} className={styles.glyph} />
      ))}
      <Focus x={160} y={110} glyph="user" size={12} />
    </>
  );
}

/** Design and build: the screen drawn, not built (hatched), then built, its action lit. */
function ScopeBuild() {
  return (
    <>
      <rect className={styles.trailFrame} x="30" y="30" width="100" height="120" rx="8" />
      <path className={styles.copyQuiet} d="M46,50 L90,50" />
      <path className={styles.copyQuiet} d="M46,62 L110,62" />
      <Hatched x={46} y={80} w={68} h={20} />
      <Hatched x={46} y={112} w={30} h={16} />
      <Hatched x={84} y={112} w={30} h={16} />
      <Hop x1={130} x2={190} y={90} />
      <rect className={styles.frame} x="190" y="30" width="100" height="120" rx="8" />
      <path className={styles.copyQuiet} d="M206,50 L250,50" />
      <path className={styles.copy} d="M206,62 L270,62" />
      <rect className={styles.halo} x="200" y="74" width="80" height="32" rx="8" />
      <rect className={styles.solid} x="206" y="80" width="68" height="20" rx="4" />
      <rect className={styles.tile} x="206" y="112" width="30" height="16" rx="4" />
      <rect className={styles.tile} x="244" y="112" width="30" height="16" rx="4" />
    </>
  );
}

/** Start where the uncertainty is: the question lit, the first screen built, the rest still open. */
function ScopeStart() {
  return (
    <>
      <Focus x={60} y={90} glyph="question-circle" size={14} />
      <path className={styles.line} d="M78,90 L113,90" />
      <ArrowRight x={120} y={90} />
      <rect className={styles.frame} x="120" y="66" width="48" height="48" rx="8" />
      <path className={styles.copyQuiet} d="M130,80 L148,80" />
      <path className={styles.copy} d="M130,92 L158,92" />
      <rect className={styles.tile} x="130" y="100" width="20" height="8" rx="4" />
      <path className={styles.trail} d="M168,90 L184,90" />
      <Hatched x={184} y={66} w={48} h={48} />
      <path className={styles.trail} d="M232,90 L242,90" />
      <Hatched x={242} y={66} w={48} h={48} />
    </>
  );
}

/** Directly with the people doing the work: our designer joined to each of yours, no one between. */
function ScopeDirect() {
  return (
    <>
      <Focus x={70} y={90} glyph="user" size={12} />
      <path className={styles.line} d="M88,90 L210,90" />
      <path className={styles.line} d="M150,90 L150,56 A6,6 0 0 1 156,50 L210,50" />
      <path className={styles.line} d="M150,90 L150,124 A6,6 0 0 0 156,130 L210,130" />
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      {[50, 90, 130].map((y) => (
        <g key={y}>
          <circle className={styles.node} cx="210" cy={y} r="2.5" />
          <Glyph name="user" cx={240} cy={y} size={20} className={styles.glyph} />
        </g>
      ))}
    </>
  );
}

/** Inside your product environment: your window, and our workflow running in it, its end lit. */
function ScopeInside() {
  return (
    <>
      <rect className={styles.frame} x="30" y="30" width="260" height="120" rx="8" />
      <path className={styles.rule} d="M30,50 L290,50" />
      {[42, 52, 62].map((x) => (
        <circle key={x} className={styles.knob} cx={x} cy="40" r="2.5" />
      ))}
      <path className={styles.copyQuiet} d="M50,70 L98,70" />
      {[70, 150].map((x) => (
        <g key={x}>
          <rect className={styles.frame} x={x} y="90" width="40" height="20" rx="4" />
          <path className={styles.copy} d={`M${x + 10},100 L${x + 30},100`} />
        </g>
      ))}
      <Hop x1={110} x2={150} y={100} />
      <Hop x1={190} x2={230} y={100} />
      <rect className={styles.halo} x="224" y="84" width="52" height="32" rx="8" />
      <rect className={styles.solid} x="230" y="90" width="40" height="20" rx="4" />
      <path className={styles.copyQuiet} d="M50,132 L130,132" />
    </>
  );
}

/** Across time zones: your working day and ours, the hours they share marked, where we talk. */
function ScopeOverlap() {
  return (
    <>
      <rect className={styles.halo} x="140" y="36" width="80" height="108" rx="8" />
      <path className={styles.trail} d="M140,30 L140,150 M220,30 L220,150" />
      <rect className={styles.frameQuiet} x="50" y="50" width="170" height="20" rx="10" />
      <path className={styles.copyQuiet} d="M62,60 L110,60" />
      <rect className={styles.region} x="140" y="110" width="130" height="20" rx="10" />
      <path className={styles.regionCopy} d="M232,120 L258,120" />
      <circle className={styles.solid} cx="180" cy="90" r="11" />
      <Glyph name="chat-round-dots" cx={180} cy={90} size={12} className={styles.glyphOn} />
    </>
  );
}

/** The commercial shape follows the work: a fixed piece, a defined project, a monthly run. */
function ScopeCommercial() {
  return (
    <>
      <rect className={styles.frame} x="30" y="58" width="64" height="64" rx="8" />
      <Chip x={38} y={66} glyph="flag" />
      <path className={styles.copy} d="M40,98 L80,98" />
      <path className={styles.copy} d="M40,110 L68,110" />

      <rect className={styles.region} x="114" y="42" width="96" height="96" rx="8" />
      <Chip x={122} y={50} glyph="calendar" />
      <path className={styles.regionCopy} d="M124,82 L190,82" />
      <path className={styles.regionCopy} d="M124,94 L178,94" />
      <rect className={styles.solid} x="124" y="110" width="40" height="16" rx="4" />

      <rect className={styles.frameQuiet} x="238" y="50" width="52" height="72" rx="8" />
      <rect className={styles.frameQuiet} x="234" y="54" width="52" height="72" rx="8" />
      <rect className={styles.frame} x="230" y="58" width="52" height="72" rx="8" />
      <Chip x={238} y={66} glyph="refresh" />
      <path className={styles.copy} d="M240,98 L270,98" />
      <path className={styles.copy} d="M240,110 L262,110" />
    </>
  );
}

/**
 * Who decides, and who owns the work: our options (the recommendation marked) meet at you, the one lit
 * point where the choice is made, and the result is handed over to you, designs and code
 * (/how-we-work's practical details, owner 2 Nov 2026). Routes on the axes, turning at corners.
 */
function ScopeOwn() {
  return (
    <>
      {[36, 116].map((y) => (
        <g key={y}>
          <rect className={styles.frameQuiet} x="30" y={y} width="64" height="28" rx="8" />
          <path className={styles.copyQuiet} d={`M42,${y + 14} L74,${y + 14}`} />
        </g>
      ))}
      <rect className={styles.frame} x="30" y="76" width="64" height="28" rx="8" />
      <Chip x={38} y={82} glyph="star" />
      <path className={styles.copy} d="M60,90 L84,90" />

      <path className={styles.line} d="M94,50 L124,50 A6,6 0 0 1 130,56 L130,90" />
      <path className={styles.line} d="M94,130 L124,130 A6,6 0 0 0 130,124 L130,90" />
      <path className={styles.line} d="M94,90 L152,90" />
      <circle className={styles.node} cx="130" cy="90" r="3.5" />
      <Focus x={170} y={90} glyph="user" size={12} />

      <Hop x1={190} x2={230} y={90} />
      <rect className={styles.frame} x="230" y="60" width="60" height="60" rx="8" />
      <Chip x={242} y={72} glyph="layers" />
      <Chip x={264} y={72} glyph="code" />
      <path className={styles.copy} d="M242,104 L278,104" />
    </>
  );
}

/* ── Trace stages: one screen at every hand-over ─────────────────────────────────
   The screen is 220 × 120 from (50, 30); its action is 80 × 20 from (70, 100), centred on (110, 110),
   where TracePlates' trace crosses every plate (tokens/components/trace-plates.css holds the shares). */

const ACTION = { x: 70, y: 100, w: 80, h: 20 } as const;

function Screen({ chrome = false }: { chrome?: boolean }) {
  return (
    <>
      <rect className={styles.frame} x="50" y="30" width="220" height="120" rx="8" />
      {chrome ? (
        <>
          <path className={styles.rule} d="M50,48 L270,48" />
          {[60, 70, 80].map((x) => (
            <circle key={x} className={styles.knob} cx={x} cy="39" r="2.5" />
          ))}
        </>
      ) : (
        <path className={styles.copyQuiet} d="M70,50 L118,50" />
      )}
      <path className={styles.copy} d="M70,64 L210,64" />
      <path className={styles.copy} d="M70,76 L180,76" />
    </>
  );
}

function Action({ className }: { className: string | undefined }) {
  return (
    <rect
      className={className}
      x={ACTION.x}
      y={ACTION.y}
      width={ACTION.w}
      height={ACTION.h}
      rx="4"
    />
  );
}

/** The approved design: the clean screen, its action filled. */
function TraceDesign() {
  return (
    <>
      <Screen />
      <Action className={styles.solid} />
      <rect className={styles.tile} x="160" y="100" width="56" height="20" rx="4" />
      <path className={styles.copyQuiet} d="M70,136 L130,136" />
    </>
  );
}

/** The handoff: the action measured, and the state nobody specified left hatched. */
function TraceHandoff() {
  return (
    <>
      <Screen />
      <Action className={styles.nodeOpen} />
      <path className={styles.regionEdge} d="M70,90 L150,90 M70,86 L70,94 M150,86 L150,94" />
      <Hatched x={160} y={100} w={56} h={20} />
      <path className={styles.copyQuiet} d="M70,136 L130,136" />
    </>
  );
}

/** The code: a gutter and indented lines, the action one lit line of it. */
function TraceCode() {
  return (
    <>
      <rect className={styles.frame} x="50" y="30" width="220" height="120" rx="8" />
      <path className={styles.rule} d="M64,30 L64,150" />
      {(
        [
          [50, 76, 130],
          [62, 86, 200],
          [74, 86, 170],
          [86, 96, 210],
          [134, 76, 120],
        ] as const
      ).map(([y, x1, x2]) => (
        <path key={y} className={styles.copyQuiet} d={`M${x1},${y} L${x2},${y}`} />
      ))}
      <rect className={styles.wash} x="68" y="102" width="196" height="16" rx="3" />
      <path className={styles.line} d="M86,110 L150,110" />
      <path className={styles.regionCopy} d="M160,110 L200,110" />
    </>
  );
}

/** The running product: the browser's chrome, and a person pressing the action. */
function TraceProduct() {
  return (
    <>
      <Screen chrome />
      <Action className={styles.solid} />
      <rect className={styles.tile} x="160" y="100" width="56" height="20" rx="4" />
      <path className={styles.copyQuiet} d="M70,136 L130,136" />
      <path className={styles.liftUnder} d={CURSOR} transform="translate(134,116)" />
      <path className={styles.lift} d={CURSOR} transform="translate(132,114)" />
    </>
  );
}

/** The sign-off: the screen accepted, the check lit. */
function TraceSignoff() {
  return (
    <>
      <Screen />
      <Action className={styles.solid} />
      <rect className={styles.tile} x="160" y="100" width="56" height="20" rx="4" />
      <path className={styles.copyQuiet} d="M70,136 L130,136" />
      <Focus x={242} y={110} glyph="chrome-check" size={12} />
    </>
  );
}

export const KIT: Record<ScopeSceneName | TraceSceneName, () => ReactNode> = {
  'scope-feature': ScopeFeature,
  'scope-pilot': ScopePilot,
  'scope-area': ScopeArea,
  'scope-embedded': ScopeEmbedded,
  'scope-build': ScopeBuild,
  'scope-start': ScopeStart,
  'scope-direct': ScopeDirect,
  'scope-inside': ScopeInside,
  'scope-overlap': ScopeOverlap,
  'scope-commercial': ScopeCommercial,
  'scope-own': ScopeOwn,
  'trace-design': TraceDesign,
  'trace-handoff': TraceHandoff,
  'trace-code': TraceCode,
  'trace-product': TraceProduct,
  'trace-signoff': TraceSignoff,
};
