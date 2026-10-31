import type { CSSProperties, ReactNode } from 'react';

import { glyphs, type IconName } from '@/lib/icon-glyphs';

import styles from './Sketch.module.css';
import type { SketchName } from '@/lib/sketches';

/**
 * The STILL drawings: the scenes with no story (new-product and the three article covers), redrawn
 * to the flat-graphics grammar (docs/research/flat-graphics-grammar.md, round 3). Drawn once, in
 * their finished state; a cover never moves (owner, 25 Oct 2026). The six service scenes live in
 * ./stories, and a plate draws them held solved.
 *
 * The grammar, as drawn here: routes run on the axes, turn on one 6-unit arc and end on a port or
 * the one arrowhead (filled, 7 long, 8 wide); ports, turns and line ends sit on the plate's 20-unit
 * dots; 1 for every outline, 2 for copy and the route; no words inside a drawing; glyphs are
 * Solar's; one focal point, solid on a soft blue ground; hatching for what is not built yet; sheets
 * behind for one of many. No ids, so any number of sketches can share a page.
 */

/** A Solar glyph set inside a drawing at (cx, cy), `size` drawing units square. */
export function Glyph({
  name,
  cx: x,
  cy: y,
  size,
  className,
}: {
  name: IconName;
  cx: number;
  cy: number;
  size: number;
  className: string | undefined;
}) {
  const s = size / 24;
  return (
    <g className={className} transform={`translate(${x - size / 2},${y - size / 2}) scale(${s})`}>
      {glyphs[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
  );
}

/** The cursor, tip at its origin: placed with a translate, its flat offset drawn under it. */
export const CURSOR = 'M0,0 L0,17 L4.6,12.9 L7.6,19.6 L10.6,18.3 L7.7,11.7 L13.6,11.7 Z';

/** The hatch's pitch along an edge: a 5-unit spacing between 45° lines. */
const PITCH = 5 * Math.SQRT2;
/** How far inside the outline the hatch stops, so it clears a 4-unit corner. */
const INSET = 2;

/**
 * Something not built yet: its dashed outline, filled with 45° hatching. The lines are drawn rather
 * than patterned, because a pattern needs an id.
 */
export function Hatched({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const [x0, y0, x1, y1] = [x + INSET, y + INSET, x + w - INSET, y + h - INSET];
  const lines: string[] = [];
  /* Each line is x + y = c, clipped to the inset box. */
  for (let c = x0 + y0 + PITCH / 2; c < x1 + y1; c += PITCH) {
    const ax = Math.max(x0, c - y1);
    const bx = Math.min(x1, c - y0);
    if (bx - ax < 1) continue;
    lines.push(`M${ax.toFixed(1)},${(c - ax).toFixed(1)} L${bx.toFixed(1)},${(c - bx).toFixed(1)}`);
  }
  return (
    <>
      <path className={styles.hatch} d={lines.join(' ')} />
      <rect className={styles.trailFrame} x={x} y={y} width={w} height={h} rx="4" />
    </>
  );
}

/** The lit end of a drawing: a solid disc on its soft ground, a glyph knocked out of it. */
export function Focus({ x, y, glyph, size }: { x: number; y: number; glyph: IconName; size: number }) {
  return (
    <>
      <circle className={styles.halo} cx={x} cy={y} r="18" />
      <circle className={styles.solid} cx={x} cy={y} r="11" />
      <Glyph name={glyph} cx={x} cy={y} size={size} className={styles.glyphOn} />
    </>
  );
}

/**
 * One transform-only move, made when the link the drawing sits in is hovered or focused (live scenes
 * only). x/y in drawing units; s, sx, sy scale; turn in degrees; (ox, oy) the origin in drawing units.
 */
export function Move({
  x = 0,
  y = 0,
  s,
  sx = s ?? 1,
  sy = s ?? 1,
  turn = 0,
  ox = 0,
  oy = 0,
  children,
}: {
  x?: number;
  y?: number;
  s?: number;
  sx?: number;
  sy?: number;
  turn?: number;
  ox?: number;
  oy?: number;
  children: ReactNode;
}) {
  return (
    <g
      className={styles.move}
      style={
        {
          '--skt-move-x': x,
          '--skt-move-y': y,
          '--skt-move-sx': sx,
          '--skt-move-sy': sy,
          '--skt-move-turn': `${turn}deg`,
          '--skt-move-ox': ox,
          '--skt-move-oy': oy,
        } as CSSProperties
      }
    >
      {children}
    </g>
  );
}

/**
 * MOTION PATTERN 1 · a line draws. The route draws itself along its length when the link the drawing
 * sits in is hovered or focused, as the S.3 stories' routes do (owner, 31 Oct 2026: "if there's a line,
 * it draws over the course of animation"). Held still (a plate), it is the plain finished route.
 */
export function TraceIn({ d }: { d: string }) {
  return <path className={styles.trace} d={d} pathLength={1} />;
}

/**
 * MOTION PATTERN 4 · the cursor moves to the button. The cursor rests (x, y) drawing units away from
 * where it is drawn and glides onto it; pair it with the button it presses drawn `press` (it fills).
 */
export function Glide({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g
      className={styles.glide}
      style={
        {
          '--skt-glide-x': `calc(${x} * var(--skt-unit))`,
          '--skt-glide-y': `calc(${y} * var(--skt-unit))`,
        } as CSSProperties
      }
    >
      {children}
    </g>
  );
}

/**
 * MOTION PATTERN 2 · a circle grows from nothing (the tick, the flag, the arrowhead, a halo): absent at
 * rest in a live scene, there in every still one. Pattern 2's other form, unfilled to filled, is the
 * `release` class (with `releaseMark` on its glyph); pattern 3, a highlight, is a halo in a GrowIn
 * around a `block`, which fills (the Audits story).
 */
export function GrowIn({ children }: { children: ReactNode }) {
  return <g className={styles.grow}>{children}</g>;
}

/** A glyph in its chip, at a frame's top-left corner. */
export function Chip({ x, y, glyph }: { x: number; y: number; glyph: IconName }) {
  return (
    <>
      <rect className={styles.chip} x={x} y={y} width="16" height="16" rx="4" />
      <Glyph name={glyph} cx={x + 8} cy={y + 8} size={10} className={styles.glyphAccent} />
    </>
  );
}

/* The lens over the code: centre, radius, and its handle at 135°, from the rim outwards. */
const LENS = { x: 154, y: 88, r: 26 } as const;
const HANDLE = 'M134.9,107.1 L118.6,123.4';

function NewProduct() {
  return (
    <>
      <rect className={styles.trailFrame} x="30" y="30" width="200" height="120" rx="8" />
      <rect className={styles.region} x="50" y="50" width="80" height="80" rx="4" />
      <path className={styles.regionCopy} d="M62,70 L114,70" />
      <path className={styles.copy} d="M62,82 L110,82" />
      <path className={styles.copy} d="M62,94 L92,94" />
      <rect className={styles.solid} x="62" y="108" width="36" height="12" rx="6" />
      <Hatched x={150} y={50} w={60} h={20} />
      <Hatched x={150} y={110} w={60} h={20} />
      <path className={styles.line} d="M130,90 L258,90" />
      <circle className={styles.nodeOpen} cx="230" cy="90" r="3" />
      {/* The release travels to its milestone (lands on 230,90). */}
      <Move x={100}>
        <circle className={styles.node} cx="130" cy="90" r="2.5" />
      </Move>
      <Focus x={270} y={90} glyph="flag" size={12} />
    </>
  );
}

function CodeReview() {
  return (
    <g transform="translate(-20,0)">
      {/* The generated file, one of many: two sheets behind it. */}
      <rect className={styles.frameQuiet} x="98" y="22" width="180" height="120" rx="8" />
      <rect className={styles.frameQuiet} x="94" y="26" width="180" height="120" rx="8" />
      <rect className={styles.frame} x="90" y="30" width="180" height="120" rx="8" />
      <path className={styles.rule} d="M116,30 L116,150" />
      {(
        [
          [46, 126, 202],
          [58, 134, 228],
          [70, 134, 194],
          [106, 134, 216],
          [118, 126, 206],
          [130, 134, 180],
          [142, 126, 220],
        ] as const
      ).map(([y, x1, x2]) => (
        <path key={y} className={styles.copyQuiet} d={`M${x1},${y} L${x2},${y}`} />
      ))}
      {/* Ticked through: the lines a reviewer no longer reads one by one. */}
      {[46, 58, 130, 142].map((y) => (
        <path key={y} className={styles.line} d={`M242,${y} L245,${y + 3} L250,${y - 3}`} />
      ))}
      {/* The two lines that carry the judgement. */}
      <rect className={styles.region} x="120" y="76" width="136" height="24" rx="4" />
      <path className={styles.regionCopy} d="M132,82 L234,82" />
      <path className={styles.regionCopy} d="M132,94 L206,94" />
      {/* The lens floats: its flat offset, then the lens magnifying them 1.35×, drawn to its rim. */}
      <g transform="translate(3,3)">
        <circle className={styles.liftUnder} cx={LENS.x} cy={LENS.y} r={LENS.r} />
        <path className={styles.handleUnder} d={HANDLE} />
      </g>
      <circle className={styles.blank} cx={LENS.x} cy={LENS.y} r={LENS.r} />
      <path
        className={styles.wash}
        d="M133.7,71.8 L174.3,71.8 A26,26 0 0 1 174.3,104.2 L133.7,104.2 A26,26 0 0 1 133.7,71.8 Z"
      />
      <path className={styles.regionEdge} d="M133.7,71.8 L174.3,71.8 M133.7,104.2 L174.3,104.2" />
      <path className={styles.regionCopy} d="M131,79.9 L177,79.9" />
      <path className={styles.regionCopy} d="M131,96.1 L177,96.1" />
      <circle className={styles.lens} cx={LENS.x} cy={LENS.y} r={LENS.r} />
      <path className={styles.handle} d={HANDLE} />
    </g>
  );
}

function SecurityChecklist() {
  return (
    <>
      {/* The checklist, three checks done and the last still open. */}
      <rect className={styles.frame} x="30" y="30" width="120" height="120" rx="8" />
      <path className={styles.copyQuiet} d="M46,50 L98,50" />
      {(
        [
          [70, true, 130],
          [90, true, 116],
          [110, true, 126],
          [130, false, 112],
        ] as const
      ).map(([y, done, to]) => (
        <g key={y}>
          <rect
            className={done ? styles.solid : styles.tile}
            x="46"
            y={y - 6}
            width="12"
            height="12"
            rx="3"
          />
          {done ? (
            <path className={styles.tick} d={`M49,${y} L51.5,${y + 2.5} L55,${y - 2.5}`} />
          ) : null}
          <path className={done ? styles.copy : styles.copyQuiet} d={`M70,${y} L${to},${y}`} />
        </g>
      ))}
      {/* The gate the checks hold shut. */}
      <path className={styles.line} d="M150,90 L178,90" />
      <circle className={styles.node} cx="150" cy="90" r="2.5" />
      <rect className={styles.frame} x="184" y="40" width="12" height="100" rx="6" />
      <Focus x={190} y={90} glyph="lock" size={11} />
      {/* Real users arriving from the right, walking left towards it. */}
      {[230, 260, 290].map((x) => (
        <Glyph key={x} name="user" cx={x} cy={72} size={20} className={styles.glyph} />
      ))}
      <path className={styles.rule} d="M218,90 L302,90" />
      <path className={styles.trail} d="M290,110 L204,110" />
      <path className={styles.quietMark} d="M203,110 L210,106 L210,114 Z" />
    </>
  );
}

function PrototypeToProduction() {
  return (
    <>
      {/* The prototype: a rough, dashed sketch of a screen. */}
      <rect className={styles.trailFrame} x="210" y="30" width="80" height="40" rx="6" />
      <path className={styles.copyQuiet} d="M222,44 L262,44" />
      <path className={styles.copyQuiet} d="M222,56 L248,56" />
      {/* The path it has to travel, through the four questions, leftwards into production. */}
      <path
        className={styles.line}
        d="M250,70 L250,124 A6,6 0 0 1 244,130 L156,130 A6,6 0 0 1 150,124 L150,96 A6,6 0 0 0 144,90 L112,90"
      />
      <path className={styles.solid} d="M112,90 L119,86 L119,94 Z" />
      <circle className={styles.node} cx="250" cy="70" r="2.5" />
      {(
        [
          [250, 110],
          [210, 130],
          [170, 130],
          [150, 110],
        ] as const
      ).map(([x, y]) => (
        <circle key={`${x}-${y}`} className={styles.nodeOpen} cx={x} cy={y} r="6.5" />
      ))}
      {/* Production: the stored, running system the answers lead to, its top lit. */}
      <path className={styles.frame} d="M50,60 L50,120 A30,8 0 0 0 110,120 L110,60" />
      <path className={styles.rule} d="M50,80 A30,8 0 0 0 110,80" />
      <path className={styles.rule} d="M50,100 A30,8 0 0 0 110,100" />
      <ellipse className={styles.halo} cx="80" cy="60" rx="38" ry="13" />
      <ellipse className={styles.solid} cx="80" cy="60" rx="30" ry="8" />
      <circle className={styles.solid} cx="98" cy="114" r="3" />
    </>
  );
}

export const STILL: Partial<Record<SketchName, () => ReactNode>> = {
  'new-product': NewProduct,
  'code-review': CodeReview,
  'security-checklist': SecurityChecklist,
  'prototype-to-production': PrototypeToProduction,
};
