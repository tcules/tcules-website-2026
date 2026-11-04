import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Hop, Rect } from './offer';
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

/**
 * IDEA: one area of the product placed on a five-step scale, from keep (nothing changes) to rebuild
 * (hatched, made again); its step lit.
 */
function AreaByAreaAnswers() {
  const steps = [42, 66, 90, 114, 138] as const;
  return (
    <>
      {/* The product, split into three areas; the middle one answered here. */}
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M30,70 L150,70 M30,110 L150,110" />
      <Copy x={46} y={50} w={40} quiet />
      <Copy x={46} y={86} w={56} />
      <Copy x={46} y={96} w={36} quiet />
      <Copy x={46} y={130} w={48} quiet />
      <Hop x1={150} x2={210} y={90} />
      {/* The five answers: more of each step changes, until the last is rebuilt. */}
      <Rect x={210} y={78} w={80} h={24} rx={12} className={styles.halo} />
      {steps.map((cy, i) =>
        i === 4 ? (
          <Hatched key={cy} x={216} y={cy - 6} w={68} h={12} />
        ) : (
          <g key={cy}>
            <Rect
              x={216}
              y={cy - 6}
              w={68}
              h={12}
              rx={6}
              className={i === 2 ? styles.region : styles.tile}
            />
            {i > 0 ? (
              <Rect
                x={216}
                y={cy - 6}
                w={17 * i}
                h={12}
                rx={6}
                className={i === 2 ? styles.solid : styles.soft}
              />
            ) : null}
          </g>
        ),
      )}
    </>
  );
}

/** IDEA: the workflow customers run every day kept whole, while everything around it changes. */
function WhatMustSurvive() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {/* What may change. */}
      <Hatched x={46} y={42} w={228} h={24} />
      <Hatched x={46} y={114} w={228} h={24} />
      {/* The daily path, step by step, kept. */}
      <Glyph name="user" cx={50} cy={90} size={16} className={styles.glyph} />
      {[70, 126, 182].map((x) => (
        <Rect key={x} x={x} y={82} w={36} h={16} rx={8} className={styles.tile} />
      ))}
      <path className={styles.line} d="M106,90 L126,90 M162,90 L182,90" />
      <Hop x1={218} x2={244} y={90} />
      <Focus x={262} y={90} glyph="shield-check" size={12} />
    </>
  );
}

/** IDEA: the change that moves first, lit, and the two changes that wait on it. */
function OrderOfWork() {
  return (
    <>
      <Rect x={44} y={64} w={52} h={52} rx={12} className={styles.halo} />
      <Rect x={50} y={70} w={40} h={40} rx={8} className={styles.solid} />
      <Glyph name="layers" cx={70} cy={90} size={18} className={styles.glyphOn} />
      <path
        className={styles.line}
        d="M90,90 L130,90 M130,90 L130,56 A6,6 0 0 1 136,50 L163,50 M130,90 L130,124 A6,6 0 0 0 136,130 L163,130"
      />
      <ArrowRight x={170} y={50} />
      <ArrowRight x={170} y={130} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <circle className={styles.node} cx="130" cy="90" r="3.5" />
      {[50, 130].map((cy) => (
        <g key={cy}>
          <Rect x={170} y={cy - 20} w={100} h={40} rx={8} className={styles.frame} />
          <Glyph name="layers" cx={190} cy={cy} size={16} className={styles.glyphQuiet} />
          <Copy x={208} y={cy - 4} w={44} />
          <Copy x={208} y={cy + 6} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/** IDEA: the open questions answered first, and only then the budget committed. */
function QuestionsToAnswerFirst() {
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      {(
        [
          [62, 52],
          [90, 40],
          [118, 48],
        ] as const
      ).map(([cy, w]) => (
        <g key={cy}>
          <Glyph name="question-circle" cx={48} cy={cy} size={14} className={styles.glyph} />
          <Copy x={62} y={cy} w={w} />
        </g>
      ))}
      <Hop x1={130} x2={170} y={90} />
      {/* The budget, committed once they are answered. */}
      <Rect x={170} y={50} w={120} h={80} rx={8} className={styles.frame} />
      <Focus x={202} y={90} glyph="wallet" size={13} />
      <Copy x={232} y={84} w={40} />
      <Copy x={232} y={96} w={28} quiet />
    </>
  );
}

/** IDEA: of the product's areas, only the one with clean records and safe actions is ready for AI. */
function ReadyForAiFeatures() {
  const rows = [
    [50, true, false],
    [90, true, true],
    [130, false, true],
  ] as const;
  return (
    <>
      <Rect x={30} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {rows.map(([cy, records, safe]) => {
        const ready = records && safe;
        return (
          <g key={cy}>
            <Rect
              x={42}
              y={cy - 14}
              w={156}
              h={28}
              className={ready ? styles.frame : styles.tile}
            />
            <Copy x={54} y={cy} w={44} quiet={!ready} />
            {records ? (
              <C cx={150} cy={cy} glyph="database" />
            ) : (
              <Hatched x={142} y={cy - 8} w={16} h={16} />
            )}
            {safe ? (
              <C cx={178} cy={cy} glyph="shield-check" />
            ) : (
              <Hatched x={170} y={cy - 8} w={16} h={16} />
            )}
          </g>
        );
      })}
      <Hop x1={210} x2={242} y={90} />
      <Focus x={260} y={90} glyph="stars" size={12} />
    </>
  );
}

/* ── Who does the work · Where our part stops ─────────────────────────────────── */

/** IDEA: the senior designer leads, and an engineer works alongside on the technical side. */
function Team() {
  return (
    <>
      <Crew />
      <Hop x1={150} x2={190} y={90} />
      {/* The technical side: code, servers, data. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {(
        [
          [54, 'code'],
          [90, 'server'],
          [126, 'database'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <C cx={214} cy={cy} glyph={glyph} />
          <Copy x={232} y={cy - 4} w={40} />
          <Copy x={232} y={cy + 6} w={26} quiet />
        </g>
      ))}
    </>
  );
}

/** IDEA: our recommendation ends at our check; which way to go, and when, stay theirs. */
function Stops() {
  return (
    <>
      {/* Our last piece: the recommendation. */}
      {/* The stack fans up-left, so the hop leaves the front sheet's edge clear of the others. */}
      <Rect x={22} y={42} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={26} y={46} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={66} w={40} />
      <Copy x={42} y={80} w={56} quiet />
      <Copy x={42} y={92} w={48} quiet />
      <Copy x={42} y={104} w={52} quiet />
      <Copy x={42} y={116} w={36} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: which way to go; when. No route enters. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <C cx={216} cy={70} glyph="flag" />
      <Copy x={236} y={66} w={44} />
      <Copy x={236} y={74} w={30} quiet />
      <C cx={216} cy={110} glyph="calendar" />
      <Copy x={236} y={106} w={44} />
      <Copy x={236} y={114} w={30} quiet />
    </>
  );
}

/* ── How it runs ──────────────────────────────────────────────────────────────── */

/**
 * IDEA: the product split into four areas, each carrying its answer (redesign, keep, rebuild,
 * replatform), and the order of work running beneath them from the first, lit, to the last.
 */
function Method() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frameQuiet} />
      {/* First: redesigned. */}
      <Rect x={40} y={40} w={60} h={76} rx={12} className={styles.halo} />
      <Rect x={46} y={46} w={48} h={64} rx={8} className={styles.solid} />
      <Glyph name="refresh" cx={70} cy={78} size={18} className={styles.glyphOn} />
      {/* Kept; rebuilt; moved to a new platform. */}
      <Rect x={106} y={46} w={48} h={64} rx={8} className={styles.tile} />
      <Glyph name="check-circle" cx={130} cy={78} size={18} className={styles.glyphQuiet} />
      <Hatched x={166} y={46} w={48} h={64} />
      <Rect x={226} y={46} w={48} h={64} rx={8} className={styles.tile} />
      <Glyph name="layers" cx={250} cy={78} size={18} className={styles.glyphQuiet} />
      {/* The order of work. */}
      <path className={styles.rule} d="M130,110 L130,127 M190,110 L190,127" />
      <path
        className={styles.line}
        d="M70,110 L70,124 A6,6 0 0 0 76,130 L244,130 A6,6 0 0 0 250,124 L250,117"
      />
      <ArrowUp x={250} y={110} />
      <circle className={styles.node} cx="70" cy="110" r="2.5" />
      <circle className={styles.nodeOpen} cx="130" cy="130" r="3" />
      <circle className={styles.nodeOpen} cx="190" cy="130" r="3" />
    </>
  );
}

/**
 * /audits/product-modernisation-assessment · What you get, and the method's figure (the audits' 3 Nov 2026 outline). One drawing
 * per item, each from that item's own words (docs/research/flat-graphics/drawing-brief.md).
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Area-by-area answers. Each part of the product gets one of five answers, from keep to rebuild. */
  'wyg-product-modernisation-assessment-area-by-area-answers': AreaByAreaAnswers,
  /* What must survive. The workflows and habits customers rely on every day. */
  'wyg-product-modernisation-assessment-what-must-survive': WhatMustSurvive,
  /* The order of work. What moves first, and which changes depend on others. */
  'wyg-product-modernisation-assessment-order-of-work': OrderOfWork,
  /* Questions to answer first. What to find out before you commit budget. */
  'wyg-product-modernisation-assessment-questions-to-answer-first': QuestionsToAnswerFirst,
  /* Ready for AI features. Areas with the clean records and safe actions AI features need. */
  'wyg-product-modernisation-assessment-ready-for-ai-features': ReadyForAiFeatures,
  /* Who does the work. A senior designer leads; an engineer works alongside on the technical side. */
  'team-product-modernisation-assessment': Team,
  /* Where our part stops. It's a recommendation; which way to go, and when, stays your decision. */
  'stops-product-modernisation-assessment': Stops,
  /* The method's one figure, beside the numbered steps. How a modernisation assessment runs: Agree the workflow and the price (one call, then analytics, support history, a few users to talk to and engineers' time). Split the product into areas that could change on their own, such as reporting or billing. Learn what must survive: what customers rely on, and what code, data and integrations allow. Give each area its answer, set the order: one of five answers per area, sequenced by dependency and risk. FIGURE: the product split into areas, each given its answer, with the order of work. */
  'method-product-modernisation-assessment': Method,
};
