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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/**
 * The AI feature's fix list in order: each row names where the problem shows (a screen), who it hurts
 * (a person) and what it costs them (the bar, longest first); the first, lit.
 */
function RankedFixList() {
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      <C cx={82} cy={50} glyph="stars" />
      <Copy x={98} y={50} w={48} quiet />
      {(
        [
          [76, 96],
          [102, 68],
          [128, 44],
        ] as const
      ).map(([y, w], i) => (
        <g key={y}>
          <Rect
            x={72}
            y={y - 10}
            w={176}
            h={20}
            className={i === 0 ? styles.region : styles.tile}
          />
          <Glyph name="monitor" cx={87} cy={y} size={12} className={styles.glyphQuiet} />
          <Glyph name="user" cx={108} cy={y} size={12} className={styles.glyph} />
          {i === 0 ? (
            <path className={styles.regionCopy} d={`M122,${y} L${122 + w},${y}`} />
          ) : (
            <Copy x={122} y={y} w={w} quiet />
          )}
        </g>
      ))}
    </>
  );
}

/** The AI's answer, made trustworthy: a clearer label, its source shown, and the undo it lacked, lit. */
function FixesUsersNotice() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <C cx={92} cy={50} glyph="stars" />
      <Copy x={108} y={50} w={64} />
      <Copy x={86} y={70} w={136} quiet />
      <Copy x={86} y={82} w={108} quiet />
      <Rect x={86} y={94} w={88} h={20} className={styles.tile} />
      <Glyph name="document-text" cx={98} cy={104} size={12} className={styles.glyph} />
      <Copy x={110} y={104} w={50} quiet />
      <Rect x={86} y={124} w={48} h={14} rx={7} className={styles.tile} />
      <Focus x={222} y={124} glyph="undo-left" size={12} />
    </>
  );
}

/**
 * Each question carried with the example that raised it, from our panel to the specialist who owns it:
 * accuracy, security, compliance.
 */
function QuestionsForSpecialists() {
  const rows: [number, IconName][] = [
    [50, 'cpu'],
    [90, 'lock'],
    [130, 'clipboard-check'],
  ];
  return (
    <>
      <Rect x={40} y={30} w={110} h={120} rx={8} className={styles.tile} />
      {rows.map(([y, glyph]) => (
        <g key={y}>
          <Glyph name="question-circle" cx={58} cy={y} size={14} className={styles.glyph} />
          <Rect x={74} y={y - 12} w={60} h={24} rx={4} className={styles.frame} />
          <Copy x={82} y={y - 4} w={28} quiet />
          <Copy x={82} y={y + 4} w={40} />
          <Hop x1={150} x2={190} y={y} />
          <Rect x={190} y={y - 14} w={90} h={28} rx={8} className={styles.frame} />
          <Glyph name="user" cx={206} cy={y} size={14} className={styles.glyph} />
          <C cx={228} cy={y} glyph={glyph} />
          <Copy x={244} y={y} w={24} quiet />
        </g>
      ))}
    </>
  );
}

/** Your team on one call, the shared fix list's first item ticked: what everyone agreed to fix first. */
function WalkthroughWithTeam() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <Rect x={62} y={42} w={128} h={96} className={styles.tile} />
      <C cx={80} cy={58} glyph="stars" />
      <Copy x={96} y={58} w={40} quiet />
      <Rect x={72} y={72} w={108} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M82,82 L146,82" />
      <Glyph name="check-circle" cx={166} cy={82} size={12} className={styles.glyphAccent} />
      <Copy x={74} y={106} w={80} quiet />
      <Copy x={74} y={122} w={60} quiet />
      {[42, 76, 110].map((y) => (
        <g key={y}>
          <Rect x={200} y={y} w={58} h={28} className={styles.tile} />
          <Glyph name="user" cx={229} cy={y + 14} size={16} className={styles.glyph} />
        </g>
      ))}
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** A senior designer who works on AI products leads; a design engineer joins (dashed) when needed. */
function TeamAiReadiness() {
  return <Team roles={[{ glyph: 'code' }]} />;
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

/** The ranked fixes, handed over: the model's accuracy, security, compliance and rollout are theirs. */
function StopsAiReadiness() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="stars" />
      <Copy x={42} y={86} w={52} />
      <Copy x={42} y={98} w={40} quiet />
      <Copy x={42} y={110} w={28} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['cpu']} />
      <Theirs cy={90} glyphs={['shield-check', 'clipboard-check']} />
      <Theirs cy={130} glyphs={['calendar']} />
    </>
  );
}

/* ── How it runs ────────────────────────────────────────────────────────────────── */

/**
 * A task the AI is unsure of, pushed through it: the wrong result it gives, lit, and the person who
 * notices it at the end of the route.
 */
function MethodAiReadiness() {
  return (
    <>
      <Rect x={30} y={60} w={50} h={60} rx={8} className={styles.frame} />
      <Glyph name="question-circle" cx={55} cy={82} size={18} className={styles.glyph} />
      <Copy x={42} y={106} w={26} quiet />
      <Hop x1={80} x2={120} y={90} />
      <Rect x={120} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <C cx={140} cy={48} glyph="stars" />
      <Copy x={134} y={66} w={44} quiet />
      <Rect x={128} y={74} w={64} h={32} rx={10} className={styles.halo} />
      <Rect x={134} y={80} w={52} h={20} className={styles.solid} />
      <Glyph name="danger-triangle" cx={160} cy={90} size={12} className={styles.glyphOn} />
      <Copy x={134} y={118} w={48} quiet />
      <Copy x={134} y={130} w={32} quiet />
      <Hop x1={200} x2={240} y={90} />
      <Rect x={240} y={60} w={50} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={265} cy={82} size={20} className={styles.glyph} />
      <C cx={265} cy={106} glyph="eye" />
    </>
  );
}

/**
 * /audits/ai-product-ux-readiness · What you get, and the method's figure (the audits' 3 Nov 2026
 * outline). One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A ranked fix list. Where each problem shows up, who it hurts and what it costs them. */
  'wyg-ai-product-ux-readiness-ranked-fix-list': RankedFixList,
  /* Fixes users would notice. A clearer label, a visible source, an undo where one is missing. */
  'wyg-ai-product-ux-readiness-fixes-users-would-notice': FixesUsersNotice,
  /* Questions for your specialists. Accuracy, security and compliance, each with the example that raised it. */
  'wyg-ai-product-ux-readiness-questions-for-specialists': QuestionsForSpecialists,
  /* A walkthrough with your team. So everyone agrees what to fix first. */
  'wyg-ai-product-ux-readiness-walkthrough-with-team': WalkthroughWithTeam,
  /* Who does the work. A senior designer who works on AI products leads, with a design engineer when needed. */
  'team-ai-product-ux-readiness': TeamAiReadiness,
  /* Where our part stops. Model accuracy, security, compliance and rollout timing stay with your team. */
  'stops-ai-product-ux-readiness': StopsAiReadiness,
  /* The method's one figure, beside the numbered steps. How an AI UX audit runs: Agree the feature and the price (one call with the team that built it, then access with realistic data, key tasks and tickets). Use it on real tasks, as every role that touches the result. Push it where it's unsure: tasks it may get wrong, and who notices when it does. Rank the fixes, walk you through. FIGURE: the AI feature pushed where it is unsure, the wrong result and who notices it marked, the fixes ranked by what they cost users. */
  'method-ai-product-ux-readiness': MethodAiReadiness,
};
