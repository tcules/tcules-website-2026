import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Lens, Rect, Switch } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** The one arrowhead pointing down, tip at (x, y). */
const ArrowDown = ({ x, y }: { x: number; y: number }) => (
  <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />
);

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** A role's card: who they are, and a line of what they may see. */
function RoleCard({ cx }: { cx: number }) {
  return (
    <>
      <Rect x={cx - 30} y={80} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={cx} cy={102} size={18} className={styles.glyph} />
      <Copy x={cx - 14} y={124} w={28} quiet />
    </>
  );
}

/** One patient in the middle; one role hands on to the next, the route passing over the patient. */
function EachRolesJourneyAround() {
  return (
    <>
      <RoleCard cx={70} />
      <RoleCard cx={250} />
      <path className={styles.trail} d="M100,110 L138,110" />
      <path className={styles.trail} d="M182,110 L220,110" />
      <Focus x={160} y={110} glyph="heart-pulse" size={12} />
      <path className={styles.line} d="M70,80 L70,56 A6,6 0 0 1 76,50 L244,50 A6,6 0 0 1 250,56 L250,73" />
      <ArrowDown x={250} y={80} />
      <circle className={styles.node} cx={70} cy={80} r="2.5" />
    </>
  );
}

/** The privacy lead's wording goes into the consent step, its sharing set on and its access off. */
function ConsentSharingAccessSteps() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={80} size={18} className={styles.glyph} />
      <C cx={60} cy={104} glyph="chat-round-dots" />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Glyph name="lock" cx={154} cy={52} size={16} className={styles.glyph} />
      <Copy x={170} y={52} w={60} />
      {[82, 106].map((cy) => (
        <g key={cy}>
          <Copy x={146} y={cy - 3} w={72} />
          <Copy x={146} y={cy + 5} w={48} quiet />
          <Switch x={250} y={cy - 6} on={cy === 82} />
        </g>
      ))}
      <Rect x={146} y={124} w={48} h={14} rx={7} className={styles.tile} />
    </>
  );
}

/** A phone: who carries it, a line of their task, its action. */
function Phone({ cx, glyph, acting = false }: { cx: number; glyph?: IconName; acting?: boolean }) {
  return (
    <>
      <Rect x={cx - 30} y={40} w={60} h={100} rx={8} className={styles.frame} />
      {glyph ? <Glyph name={glyph} cx={cx} cy={72} size={20} className={styles.glyph} /> : null}
      <Copy x={cx - 16} y={106} w={32} />
      <Rect x={cx - 16} y={116} w={32} h={12} rx={6} className={acting ? styles.solid : styles.tile} />
    </>
  );
}

/** Several people, each on the phone they carry; the one in the middle watched doing a real task. */
function ResearchPatientsFamiliesClinicians() {
  return (
    <>
      <Phone cx={70} glyph="user" />
      <Phone cx={160} acting />
      <Phone cx={250} glyph="user" />
      <Lens x={160} y={70} r={16} />
      <Glyph name="user" cx={160} cy={70} size={16} className={styles.glyphAccent} />
    </>
  );
}

/** The wireframe, its one decision lit, and beside it the reasoning written down for the safety lead. */
function WireframesReasoningWrittenDown() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={42} y={42} w={96} h={18} rx={4} className={styles.tile} />
      <Rect x={42} y={72} w={44} h={36} rx={4} className={styles.tile} />
      <Rect x={94} y={72} w={44} h={36} rx={4} className={styles.region} />
      <Copy x={42} y={122} w={72} />
      <Copy x={42} y={134} w={48} quiet />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Glyph name="notebook" cx={212} cy={60} size={16} className={styles.glyph} />
      <Copy x={228} y={60} w={44} />
      <Copy x={206} y={80} w={68} quiet />
      <Copy x={206} y={92} w={56} quiet />
      <Copy x={206} y={104} w={64} quiet />
      <C cx={214} cy={124} glyph="shield-check" />
      <Copy x={230} y={124} w={40} />
    </>
  );
}

/** The keyboard reaches the screen's first action, its focus ring plain to see. */
function ScreensDesignedAccessibility() {
  return (
    <>
      {/* The keyboard: two rows of keys and the space bar. */}
      <Rect x={30} y={68} w={60} h={44} rx={8} className={styles.frame} />
      {[76, 87].map((y) =>
        [37, 49, 61, 73].map((x) => (
          <Rect key={`${x}-${y}`} x={x} y={y} w={10} h={8} rx={2} className={styles.tile} />
        )),
      )}
      <Rect x={49} y={98} w={22} h={8} rx={2} className={styles.tile} />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={150} y={50} w={110} />
      <Copy x={150} y={62} w={76} quiet />
      <rect className={styles.regionEdge} x={144} y={78} width={72} height={24} rx={12} />
      <Rect x={150} y={82} w={60} h={16} rx={8} className={styles.solid} />
      <Rect x={226} y={82} w={48} h={16} rx={8} className={styles.tile} />
      <Copy x={150} y={120} w={120} />
      <Copy x={150} y={132} w={84} quiet />
    </>
  );
}

/** The same screen twice: designed on the left, built in the browser on the right, tile to tile. */
function DesignsDevelopersBuildFrom() {
  return (
    <>
      {/* The design: the screen's layout, its key tile lit, the design mark in its corner. */}
      <Rect x={30} y={45} w={100} h={90} rx={8} className={styles.frame} />
      <Glyph name="ruler-pen" cx={116} cy={52} size={10} className={styles.glyphAccent} />
      <Copy x={42} y={69} w={48} />
      <Rect x={42} y={85} w={76} h={24} rx={4} className={styles.region} />
      <Copy x={42} y={121} w={60} quiet />
      <Copy x={42} y={131} w={40} quiet />
      <Hop x1={130} x2={190} y={97} />
      {/* The build: the same layout inside a browser frame, the code mark in its bar. */}
      <Rect x={190} y={45} w={100} h={90} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M190,59 L290,59" />
      {[200, 208, 216].map((cx) => (
        <circle key={cx} className={styles.quietMark} cx={cx} cy={52} r={1.5} />
      ))}
      <Glyph name="code" cx={276} cy={52} size={10} className={styles.glyphAccent} />
      <Copy x={202} y={69} w={48} />
      <Rect x={202} y={85} w={76} h={24} rx={4} className={styles.region} />
      <Copy x={202} y={121} w={60} quiet />
      <Copy x={202} y={131} w={40} quiet />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; researchers and developers join when the work needs them. */
function TeamHealthtech() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {(
        [
          [70, 'heart-pulse'],
          [110, 'code'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={glyph}>
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

/** Safety and privacy leads, the hazards they know, the people who will use it, and the person who decides (lit). */
function NeedsHealthtech() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={66} cy={50} glyph="shield-check" />
      <C cx={94} cy={50} glyph="lock" />
      <C cx={66} cy={90} glyph="danger-triangle" />
      <C cx={94} cy={90} glyph="users-group-rounded" />
      <C cx={56} cy={130} glyph="calendar" />
      <Focus x={100} y={130} glyph="user" size={12} />
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

/** Our designs and documents, checked; hazard logs and risk, classification, and clinical rules are theirs. */
function StopsHealthtech() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={70} cy={76} size={20} className={styles.glyph} />
      <Copy x={46} y={102} w={48} />
      <Copy x={46} y={114} w={32} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['danger-triangle', 'clipboard-check']} />
      <Theirs cy={90} glyphs={['shield-check']} />
      <Theirs cy={130} glyphs={['heart-pulse']} />
    </>
  );
}

/**
 * /expertise/healthtech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Each role's journey around one patient: Each role's journey around one patient, with what they may see and what they hand on */
  'wyg-healthtech-each-roles-journey-around': EachRolesJourneyAround,
  /* Consent, sharing and access steps: Consent, sharing and access steps, worded with your privacy lead */
  'wyg-healthtech-consent-sharing-access-steps': ConsentSharingAccessSteps,
  /* Research with patients, families, clinicians and carers: Research with patients, families, clinicians and carers on real tasks, on the devices they carry */
  'wyg-healthtech-research-patients-families-clinicians': ResearchPatientsFamiliesClinicians,
  /* Wireframes with the reasoning written down: Wireframes and walkthroughs for your clinical safety lead, with the reasoning written down */
  'wyg-healthtech-wireframes-reasoning-written-down': WireframesReasoningWrittenDown,
  /* Screens designed for accessibility: Screens designed for accessibility: readable type, strong contrast, keyboard use and screen readers, to a standard we agree with you at the  */
  'wyg-healthtech-screens-designed-accessibility': ScreensDesignedAccessibility,
  /* Designs your developers build from: Designs your developers build from, or Tcules developers building the frontend and coordinating integrations and testing with your chosen te */
  'wyg-healthtech-designs-developers-build-from': DesignsDevelopersBuildFrom,
  /* Who does the work: The design sits with a senior product designer, who also leads the project, and an account lead keeps it on track. Researchers come in for w */
  'team-healthtech': TeamHealthtech,
  /* What we need from you: Your clinical safety and privacy leads from the first week, with the hazards and requirements they already know. We also need access to the  */
  'needs-healthtech': NeedsHealthtech,
  /* Where our part stops: Hazard logs, risk assessments and medical device classification stay with your clinical safety, privacy and regulatory specialists, and clin */
  'stops-healthtech': StopsHealthtech,
};
