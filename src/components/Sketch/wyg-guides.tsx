import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Glyph, GrowIn, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* The guides the overhaul's "Free tools for product teams" bands name as tools (19 Nov 2026). Each is
   that guide's OWN scene, drawn from what the guide does for its reader, and shown wherever the guide is
   named as a tool card (`toolSceneFor`, @/lib/sketches: one drawing per tool on every page). TILE
   scenes in the kit's flat grammar on the plate: each makes at most two of the four hover moves
   (decisions/2026-10-31-tile-drawings-move-in-four-patterns), a line drawing and a mark filling.
   Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. The comment above each
   scene is the guide's title and words; the doc comment on each drawing is its one-line story. */

/** A node on a route, at a port. */
const Port = ({ x, y }: { x: number; y: number }) => (
  <circle className={styles.node} cx={x} cy={y} r="2.5" />
);

/**
 * STORY: one question is put to the product, it turns up problems on the screen, and they leave as a
 * short ranked list whose top fix is lit: the audit ends in an order of work, not a pile of notes.
 */
function UxAudit() {
  /* The ranked fixes: the most important first, each shorter than the one above. */
  const fixes: [number, number][] = [
    [62, 30],
    [90, 24],
    [118, 16],
  ];
  return (
    <>
      {/* The first question. */}
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="question-circle" cx={50} cy={90} size={20} className={styles.glyph} />
      <Port x={70} y={90} />
      <TraceIn d="M70,90 L93,90" />
      <GrowIn>
        <ArrowRight x={100} y={90} />
      </GrowIn>
      {/* The product's screen, three problems marked on it. */}
      <Rect x={100} y={40} w={90} h={100} rx={8} className={styles.frame} />
      <Copy x={114} y={58} w={40} />
      <Rect x={114} y={70} w={62} h={24} className={styles.tile} />
      <Copy x={114} y={110} w={50} quiet />
      <Copy x={114} y={124} w={34} quiet />
      <Glyph name="danger-triangle" cx={166} cy={58} size={12} className={styles.glyph} />
      <Glyph name="danger-triangle" cx={164} cy={82} size={12} className={styles.glyph} />
      <Glyph name="danger-triangle" cx={160} cy={124} size={12} className={styles.glyph} />
      <Port x={190} y={90} />
      <TraceIn d="M190,90 L213,90" />
      <GrowIn>
        <ArrowRight x={220} y={90} />
      </GrowIn>
      {/* The ranked list: the top fix fills as the route reaches it. */}
      <Rect x={220} y={40} w={70} h={100} rx={8} className={styles.frame} />
      {fixes.map(([y, w], i) =>
        i === 0 ? (
          <g key={y}>
            <circle className={styles.press} cx={236} cy={y} r={8} />
            <Glyph name="check-circle" cx={236} cy={y} size={12} className={styles.releaseMark} />
            <Copy x={250} y={y} w={w} />
          </g>
        ) : (
          <g key={y}>
            <circle className={styles.frame} cx={236} cy={y} r={5} />
            <Copy x={250} y={y} w={w} quiet />
          </g>
        ),
      )}
    </>
  );
}

/**
 * STORY: the same three questions put to three studios; two miss one, the third answers all three
 * and only that one goes on to the agreement you sign: test the fit first, sign second.
 */
function ChooseAgency() {
  /* Each studio's answers to the three questions, top to bottom: true answered, false missed. */
  const studios: [number, readonly boolean[]][] = [
    [52, [true, false, true]],
    [112, [true, true, false]],
    [172, [true, true, true]],
  ];
  const rows = [88, 106, 124];
  return (
    <>
      {/* The questions, one per row, asked of every studio alike. */}
      {rows.map((y) => (
        <Glyph key={y} name="question-circle" cx={34} cy={y} size={14} className={styles.glyph} />
      ))}
      {studios.map(([x, answers]) => {
        const fit = answers.every(Boolean);
        return (
          <g key={x}>
            {/* The one focal point: the studio that fits sits on the soft blue ground. */}
            {fit ? <Rect x={x - 6} y={34} w={60} h={112} rx={12} className={styles.halo} /> : null}
            <Rect x={x} y={40} w={48} h={100} rx={8} className={styles.frame} />
            <Glyph name="users-group-rounded" cx={x + 24} cy={60} size={18} className={styles.glyph} />
            {answers.map((ok, i) => (
              <Glyph
                key={rows[i]}
                name={ok ? 'check-circle' : 'close-circle'}
                cx={x + 24}
                cy={rows[i]!}
                size={14}
                className={fit ? styles.glyphAccent : ok ? styles.glyphQuiet : styles.glyph}
              />
            ))}
          </g>
        );
      })}
      {/* Only the studio that fits goes on to the agreement. */}
      <Port x={220} y={90} />
      <TraceIn d="M220,90 L233,90" />
      <GrowIn>
        <ArrowRight x={240} y={90} />
      </GrowIn>
      <Rect x={240} y={40} w={50} h={100} rx={8} className={styles.frame} />
      <Copy x={250} y={56} w={30} />
      <Copy x={250} y={70} w={24} quiet />
      <Copy x={250} y={84} w={30} quiet />
      {/* The handshake: what the fit earns. */}
      <Glyph name="hand-shake" cx={265} cy={116} size={20} className={styles.glyph} />
    </>
  );
}

/**
 * STORY: three people join the same product (the buyer, the administrator, the daily user), and
 * each is led along a route of their own length to their own first value: a report, a team set up,
 * a task done.
 */
function SaasOnboarding() {
  const lanes: [number, number[], IconName][] = [
    /* The buyer: one step to the report that justifies the purchase. */
    [50, [160], 'graph-up'],
    /* The administrator: three steps to a team that can work. */
    [90, [110, 160, 210], 'users-group-rounded'],
    /* The daily user: two steps to the first task done. */
    [130, [130, 190], 'check-circle'],
  ];
  return (
    <>
      {lanes.map(([y, steps, value]) => (
        <g key={y}>
          <circle className={styles.frame} cx={50} cy={y} r={14} />
          <Glyph name="user" cx={50} cy={y} size={16} className={styles.glyph} />
          <Port x={64} y={y} />
          {/* The route to walk, dashed until it is walked; it draws solid on hover. */}
          <path className={styles.trail} d={`M64,${y} L249,${y}`} />
          <TraceIn d={`M64,${y} L249,${y}`} />
          {steps.map((x) => (
            <Rect key={x} x={x - 10} y={y - 7} w={20} h={14} className={styles.tile} />
          ))}
          <GrowIn>
            <ArrowRight x={256} y={y} />
          </GrowIn>
          {/* That role's first value: neutral until its route reaches it. */}
          <circle className={styles.press} cx={270} cy={y} r={12} />
          <Glyph name={value} cx={270} cy={y} size={14} className={styles.releaseMark} />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* How to use a UX audit (/insights/guides/how-to-use-a-ux-product-audit): From the first question to a ranked list of fixes. */
  'guide-ux-audit': UxAudit,
  /* How to choose a product design agency (/insights/guides/how-to-choose-a-product-design-agency): Questions that test the fit before you sign. */
  'guide-choose-agency': ChooseAgency,
  /* SaaS onboarding best practices (/insights/guides/saas-onboarding-strategies-to-increase-customer-retention): Take each role to first value. */
  'guide-saas-onboarding': SaasOnboarding,
};
