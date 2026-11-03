import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Team } from './l1-terms';
import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ./Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The one arrowhead pointing down, tip at (x, y). */
function ArrowDown({ x, y }: { x: number; y: number }) {
  return <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />;
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** The findings stacked by harm: the one that hurts the most people on top, lit; fewer hurt below. */
function FindingsRanked() {
  return (
    <>
      <Rect x={44} y={30} w={232} h={40} rx={10} className={styles.halo} />
      {[50, 90, 130].map((y, i) => (
        <g key={y}>
          <Rect
            x={50}
            y={y - 14}
            w={220}
            h={28}
            className={i === 0 ? styles.region : styles.tile}
          />
          <Glyph
            name="danger-triangle"
            cx={68}
            cy={y}
            size={14}
            className={i === 0 ? styles.glyphAccent : styles.glyphQuiet}
          />
          {i === 0 ? (
            <path className={styles.regionCopy} d={`M84,${y} L160,${y}`} />
          ) : (
            <Copy x={84} y={y} w={[0, 60, 44][i] ?? 40} quiet />
          )}
          {Array.from({ length: 3 - i }, (_, k) => (
            <Glyph key={k} name="user" cx={252 - k * 18} cy={y} size={14} className={styles.glyph} />
          ))}
        </g>
      ))}
    </>
  );
}

/** Each finding routed down to its own next step: fix, redesign, test first; the last left alone. */
function NextStepEach() {
  const steps: [number, IconName][] = [
    [70, 'check-circle'],
    [130, 'ruler-pen'],
    [190, 'user'],
    [250, 'close-circle'],
  ];
  return (
    <>
      {steps.map(([x, glyph], i) => {
        const leave = i === 3;
        return (
          <g key={x}>
            <Rect x={x - 22} y={30} w={44} h={40} rx={8} className={styles.frame} />
            <Glyph name="danger-triangle" cx={x} cy={44} size={12} className={styles.glyphQuiet} />
            <Copy x={x - 12} y={60} w={24} quiet />
            {leave ? (
              <path className={styles.trail} d={`M${x},70 L${x},110`} />
            ) : (
              <>
                <path className={styles.line} d={`M${x},70 L${x},103`} />
                <ArrowDown x={x} y={110} />
                <circle className={styles.node} cx={x} cy={70} r="2.5" />
              </>
            )}
            <Rect
              x={x - 20}
              y={110}
              w={40}
              h={40}
              rx={8}
              className={leave ? styles.trailFrame : styles.frame}
            />
            <Glyph
              name={glyph}
              cx={x}
              cy={130}
              size={18}
              className={leave ? styles.glyphQuiet : styles.glyphAccent}
            />
          </g>
        );
      })}
    </>
  );
}

/** A fix, sized (two of three), and placed on the roadmap as a block that long. */
function WhatEachFixTakes() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="danger-triangle" />
      <Copy x={42} y={86} w={52} />
      {[42, 58, 74].map((x, i) => (
        <Rect
          key={x}
          x={x}
          y={104}
          w={12}
          h={12}
          rx={3}
          className={i < 2 ? styles.solid : styles.tile}
        />
      ))}
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={46} w={40} quiet />
      <Rect x={166} y={58} w={40} h={16} rx={8} className={styles.tile} />
      <Rect x={186} y={82} w={76} h={16} rx={8} className={styles.region} />
      <Rect x={226} y={106} w={48} h={16} rx={8} className={styles.tile} />
    </>
  );
}

/** Your team round one board, the first thing on it flagged: what everyone agreed comes first. */
function WalkthroughWithTeam() {
  return (
    <>
      <Rect x={80} y={30} w={160} h={84} rx={8} className={styles.frame} />
      <Copy x={96} y={44} w={40} quiet />
      <Rect x={90} y={52} w={140} h={30} rx={10} className={styles.halo} />
      <Rect x={96} y={58} w={128} h={18} className={styles.region} />
      <path className={styles.regionCopy} d="M106,67 L180,67" />
      <Glyph name="flag" cx={212} cy={67} size={12} className={styles.glyphAccent} />
      <Rect x={96} y={88} w={128} h={16} className={styles.tile} />
      <Copy x={106} y={96} w={56} quiet />
      {[120, 160, 200].map((x) => (
        <Glyph key={x} name="user" cx={x} cy={136} size={24} className={styles.glyph} />
      ))}
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer leads the audit; a researcher joins (dashed) when users need interviewing. */
function TeamUxAudit() {
  return <Team roles={[{ glyph: 'microphone' }]} />;
}

/* ── Where our part stops ───────────────────────────────────────────────────────── */

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

/** The ranked findings, handed over: whether to fund a redesign, and who builds it, are theirs. */
function StopsUxAudit() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      {(
        [
          [82, 56],
          [98, 40],
          [114, 28],
        ] as const
      ).map(([y, w]) => (
        <g key={y}>
          <Glyph name="danger-triangle" cx={48} cy={y} size={10} className={styles.glyphQuiet} />
          <Copy x={58} y={y} w={w - 10} quiet />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={70} glyphs={['wallet']} />
      <Theirs cy={110} glyphs={['users-group-rounded', 'code']} />
    </>
  );
}

/* ── How it runs ────────────────────────────────────────────────────────────────── */

/**
 * The workflow's steps walked in a row, the signals over each: where use falls away, the step under
 * the drop is the stall, lit.
 */
function MethodUxAudit() {
  const steps: [number, number][] = [
    [70, 50],
    [130, 44],
    [190, 14],
    [250, 10],
  ];
  return (
    <>
      <path className={styles.rule} d="M46,100 L274,100" />
      {steps.map(([x, h]) => (
        <Rect key={x} x={x - 10} y={96 - h} w={20} h={h} rx={3} className={styles.tile} />
      ))}
      <path className={styles.line} d="M90,130 L110,130 M150,130 L170,130 M210,130 L230,130" />
      <Rect x={164} y={112} w={52} h={36} rx={10} className={styles.halo} />
      {steps.map(([x], i) => (
        <Rect
          key={x}
          x={x - 20}
          y={118}
          w={40}
          h={24}
          className={i === 2 ? styles.solid : styles.frame}
        />
      ))}
      <Glyph name="danger-triangle" cx={190} cy={130} size={12} className={styles.glyphOn} />
    </>
  );
}

/**
 * /audits/ux-product-audit · What you get, and the method's figure (the audits' 3 Nov 2026 outline).
 * One drawing per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Findings ranked by harm. Who each one hurts, how far it spreads, and how sure we are. */
  'wyg-ux-product-audit-findings-ranked-by-harm': FindingsRanked,
  /* A next step for each. Fix, redesign, test first or leave alone. */
  'wyg-ux-product-audit-next-step-each': NextStepEach,
  /* What each fix takes. A rough size for every fix, so you can plan it into the roadmap. */
  'wyg-ux-product-audit-what-each-fix-takes': WhatEachFixTakes,
  /* A walkthrough with your team. Everyone leaves agreeing what comes first. */
  'wyg-ux-product-audit-walkthrough-with-team': WalkthroughWithTeam,
  /* Who does the work. A senior designer leads the audit; a researcher joins when users need interviewing. */
  'team-ux-product-audit': TeamUxAudit,
  /* Where our part stops. Whether to fund a redesign, and who builds it, stays with you. */
  'stops-ux-product-audit': StopsUxAudit,
  /* The method's one figure, beside the numbered steps. How a UX audit runs: Agree the workflow and the price (one call, then product access, analytics, support tickets and time with whoever knows it best). Walk the real tasks, role by role, including errors, permissions and awkward cases. Read the signals: analytics and support tickets show where people stall; user interviews can follow. Rank the findings, walk you through. FIGURE: one workflow walked role by role, the stalls marked from the signals, turned into findings ranked by harm. */
  'method-ux-product-audit': MethodUxAudit,
};
