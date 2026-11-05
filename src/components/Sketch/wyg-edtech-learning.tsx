import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Lens, Rect } from './offer';
import { Chip, Focus, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A sheet centred at (cx, cy), with `behind` sheets stacked up and to the right: one of many. */
function Sheet({ cx, cy, behind = 0 }: { cx: number; cy: number; behind?: number }) {
  return (
    <>
      {Array.from({ length: behind }, (_, i) => behind - i).map((n) => (
        <Rect
          key={n}
          x={cx - 14 + n * 4}
          y={cy - 10 - n * 4}
          w={28}
          h={20}
          rx={4}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={cx - 14} y={cy - 10} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="document-text" cx={cx} cy={cy} size={12} className={styles.glyph} />
    </>
  );
}

/** A switch that has been set, drawn neutral: the knob at its far end, nothing lit. */
function SetSwitch({ x, y }: { x: number; y: number }) {
  return (
    <>
      <Rect x={x} y={y} w={24} h={12} rx={6} className={styles.tile} />
      <circle className={styles.knob} cx={x + 18} cy={y + 6} r="3.5" />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** Research on the devices people really use: the educator at a laptop, the learner on a phone under the lens. */
function ResearchLearnersEducators() {
  return (
    <>
      {/* The educator's laptop. */}
      <Rect x={55} y={40} w={120} h={80} rx={8} className={styles.frame} />
      <Rect x={45} y={120} w={140} h={10} rx={4} className={styles.frame} />
      <Glyph name="user" cx={115} cy={70} size={24} className={styles.glyph} />
      <Copy x={95} y={96} w={40} />
      <Copy x={101} y={106} w={28} quiet />
      {/* The learner's phone, looked at closely. */}
      <Rect x={215} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Copy x={231} y={124} w={28} quiet />
      <Lens x={245} y={80} r={20} />
      <Glyph name="user" cx={245} cy={80} size={20} className={styles.glyphAccent} />
    </>
  );
}

/** Four areas, each with its verdict; the one that fails is the one lit. */
function AuditPlainVerdict() {
  const cells: readonly { x: number; y: number; glyph: IconName; fails?: boolean }[] = [
    { x: 86, y: 60, glyph: 'layers' },
    { x: 164, y: 60, glyph: 'smartphone', fails: true },
    { x: 86, y: 102, glyph: 'widget' },
    { x: 164, y: 102, glyph: 'users-group-rounded' },
  ];
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Copy x={86} y={46} w={48} quiet />
      {cells.map(({ x, y, glyph, fails }) => (
        <g key={glyph}>
          <Rect
            x={x}
            y={y}
            w={70}
            h={36}
            rx={4}
            className={fails ? styles.region : styles.tile}
          />
          <Glyph name={glyph} cx={x + 14} cy={y + 13} size={14} className={styles.glyph} />
          {fails ? (
            <Glyph
              name="danger-triangle"
              cx={x + 56}
              cy={y + 13}
              size={14}
              className={styles.glyphAccent}
            />
          ) : (
            <Glyph
              name="check-circle"
              cx={x + 56}
              cy={y + 13}
              size={14}
              className={styles.glyphQuiet}
            />
          )}
          <path
            className={fails ? styles.regionCopy : styles.copyQuiet}
            d={`M${x + 8},${y + 28} L${x + 44},${y + 28}`}
          />
        </g>
      ))}
    </>
  );
}

/** What is done set aside, the current activity lit, and the route straight to what follows it. */
function ContentRegrouped() {
  return (
    <>
      {[64, 90, 116].map((cy) => (
        <g key={cy}>
          <Rect x={36} y={cy - 10} w={60} h={20} rx={4} className={styles.tile} />
          <Glyph name="check-circle" cx={48} cy={cy} size={12} className={styles.glyphQuiet} />
          <Copy x={60} y={cy} w={26} quiet />
        </g>
      ))}
      <Rect x={110} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Focus x={150} y={76} glyph="play" size={12} />
      <Copy x={126} y={110} w={48} />
      <Copy x={126} y={122} w={32} quiet />
      <Hop x1={190} x2={230} y={90} />
      <Rect x={230} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Glyph name="play" cx={260} cy={76} size={16} className={styles.glyphQuiet} />
      <Copy x={244} y={102} w={32} />
      <Copy x={244} y={114} w={20} quiet />
    </>
  );
}

/** One view of many (teacher, mentor, assessor), its list led by the learner who needs help. */
function ViewsBuiltAroundWho() {
  return (
    <>
      <Rect x={88} y={30} w={152} h={112} rx={8} className={styles.frameQuiet} />
      <Rect x={84} y={34} w={152} h={112} rx={8} className={styles.frameQuiet} />
      <Rect x={80} y={38} w={152} h={112} rx={8} className={styles.frame} />
      <Rect x={92} y={50} w={128} h={28} rx={4} className={styles.region} />
      <Glyph name="user" cx={108} cy={64} size={16} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M124,60 L176,60" />
      <path className={styles.regionCopy} d="M124,68 L156,68" />
      <Glyph name="question-circle" cx={204} cy={64} size={16} className={styles.glyphAccent} />
      {[98, 126].map((cy) => (
        <g key={cy}>
          <Glyph name="user" cx={108} cy={cy} size={16} className={styles.glyph} />
          <Copy x={124} y={cy - 4} w={52} />
          <Copy x={124} y={cy + 4} w={32} quiet />
          <Glyph name="check-circle" cx={204} cy={cy} size={14} className={styles.glyphQuiet} />
        </g>
      ))}
    </>
  );
}

/** One screen: the course structure on one side, the visual direction on the other. */
function HybridWireframes() {
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M160,30 L160,150" />
      {/* The structure: modules and their lessons, as an outline. */}
      {[
        [48, 0, 48],
        [62, 1, 40],
        [74, 1, 28],
        [94, 0, 52],
        [108, 1, 36],
        [120, 1, 44],
        [134, 1, 24],
      ].map(([y = 0, indent = 0, w = 0]) =>
        indent ? (
          <g key={y}>
            <circle className={styles.quietMark} cx={84} cy={y} r="2" />
            <Copy x={92} y={y} w={w} quiet />
          </g>
        ) : (
          <Copy key={y} x={76} y={y} w={w} />
        ),
      )}
      {/* The visual direction: the same course, dressed. */}
      <Rect x={172} y={42} w={76} h={46} rx={4} className={styles.region} />
      <Glyph name="stars" cx={210} cy={65} size={18} className={styles.glyphAccent} />
      <Copy x={172} y={104} w={56} />
      <Copy x={172} y={116} w={40} quiet />
      <Rect x={172} y={126} w={36} h={12} rx={6} className={styles.tile} />
    </>
  );
}

/** The parent's consent, ticked, carries a younger learner into a protected screen. */
function ParentViewsYoungerLearners() {
  return (
    <>
      <Rect x={40} y={50} w={90} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={85} cy={74} size={24} className={styles.glyph} />
      <Rect x={56} y={100} w={12} h={12} rx={3} className={styles.solid} />
      <path className={styles.tick} d="M59,106 L61.5,108.5 L65,103.5" />
      <Copy x={76} y={106} w={38} />
      <Hop x1={130} x2={190} y={90} />
      <Rect x={190} y={40} w={90} h={100} rx={8} className={styles.frame} />
      <Focus x={235} y={76} glyph="shield-check" size={12} />
      <Copy x={211} y={110} w={48} />
      <Copy x={211} y={122} w={32} quiet />
    </>
  );
}

/** Our developer's work lands in your LMS: its theme lit, its plugins in, its settings set. */
function ConfiguredMoodleOrLms() {
  return (
    <>
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="code" cx={50} cy={90} size={20} className={styles.glyph} />
      <Hop x1={70} x2={110} y={90} />
      <Rect x={110} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {/* The theme. */}
      <Rect x={122} y={42} w={156} h={16} rx={4} className={styles.solid} />
      {/* The plugins. */}
      {[70, 94, 118].map((y) => (
        <g key={y}>
          <Rect x={122} y={y} w={36} h={20} rx={4} className={styles.tile} />
          <Glyph name="widget" cx={140} cy={y + 10} size={12} className={styles.glyphQuiet} />
        </g>
      ))}
      {/* The settings. */}
      {[80, 104, 128].map((y) => (
        <g key={y}>
          <Copy x={172} y={y} w={y === 104 ? 48 : 64} quiet={y !== 80} />
          <SetSwitch x={254} y={y - 6} />
        </g>
      ))}
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead, with our developers in the team to configure the platform. */
function TeamEdtechLearning() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={220} y={72} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.frame} />
      <C cx={234} cy={90} glyph="code" />
      <Copy x={250} y={90} w={26} quiet />
      <Hop x1={180} x2={216} y={90} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** Time with learners and educators, access to the LMS and its plugins, the content and the person who decides (lit). */
function NeedsEdtechLearning() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={66} cy={50} glyph="user" />
      <C cx={94} cy={50} glyph="users-group-rounded" />
      <C cx={66} cy={90} glyph="key" />
      <C cx={94} cy={90} glyph="widget" />
      <Sheet cx={56} cy={130} behind={1} />
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

/** What stays theirs, one row on their panel: its chip, then a heading line and a quiet one. */
function Theirs({ cy, glyph }: { cy: number; glyph: IconName }) {
  return (
    <>
      <C cx={216} cy={cy} glyph={glyph} />
      <Copy x={236} y={cy - 4} w={44} />
      <Copy x={236} y={cy + 4} w={31} quiet />
    </>
  );
}

/** The configured platform, checked; course content, assessment and accreditation, and young learners' privacy are theirs. */
function StopsEdtechLearning() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Rect x={42} y={62} w={56} h={10} rx={4} className={styles.tile} />
      {[42, 62, 82].map((x) => (
        <Rect key={x} x={x} y={84} w={16} h={16} rx={4} className={styles.tile} />
      ))}
      <Copy x={42} y={112} w={48} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyph="notebook" />
      <Theirs cy={90} glyph="clipboard-check" />
      <Theirs cy={130} glyph="shield-check" />
    </>
  );
}

/* ── What we design in ──────────────────────────────────────────────────────────── */

/**
 * LMS and Moodle course experiences (moving): the custom plugin is routed into the course page and fills
 * the empty slot it was built for. At rest the slot is dashed and the route undrawn.
 */
function KindLmsMoodle() {
  return (
    <>
      {/* The plugin. */}
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="widget" cx={50} cy={90} size={20} className={styles.glyph} />
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      <TraceIn d="M70,90 L170,90" />
      {/* The course page: its sections, and the slot left for the plugin. */}
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="170" cy="90" r="3" />
      </GrowIn>
      <Rect x={184} y={52} w={92} h={16} rx={4} className={styles.tile} />
      <Copy x={194} y={60} w={44} quiet />
      <Rect x={184} y={80} w={92} h={20} rx={4} className={styles.trailFrame} />
      <GrowIn>
        <Rect x={178} y={74} w={104} h={32} rx={10} className={styles.halo} />
        <Rect x={184} y={80} w={92} h={20} rx={4} className={styles.solid} />
        <Glyph name="widget" cx={230} cy={90} size={12} className={styles.glyphOn} />
      </GrowIn>
      <Rect x={184} y={112} w={92} h={16} rx={4} className={styles.tile} />
      <Copy x={194} y={120} w={56} quiet />
    </>
  );
}

/** Creative learning products for young people: a young learner makes something of their own on a tablet. */
function KindCreativeYoung() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      {/* The tools, the palette in hand. */}
      <Rect x={78} y={42} w={16} h={16} rx={4} className={styles.tile} />
      <Glyph name="ruler-pen" cx={86} cy={50} size={10} className={styles.glyphQuiet} />
      <Focus x={86} y={90} glyph="palette" size={12} />
      <Rect x={78} y={122} w={16} h={16} rx={4} className={styles.tile} />
      <Glyph name="star" cx={86} cy={130} size={10} className={styles.glyphQuiet} />
      {/* The canvas, and what the learner has made on it. */}
      <Rect x={118} y={42} w={140} h={96} rx={4} className={styles.tile} />
      <circle className={styles.frame} cx="158" cy="76" r="16" />
      <Rect x={194} y={60} w={44} h={32} rx={4} className={styles.frame} />
      <path className={styles.frame} d="M176,124 L198,102 L220,124 Z" />
    </>
  );
}

/** Growth projects inside a learning platform: the variant that wins the test lifts the growth line. */
function KindGrowthInside() {
  return (
    <>
      {/* The two variants of one lesson screen; the winner in full ink. */}
      <Rect x={30} y={54} w={60} h={32} rx={8} className={styles.frameQuiet} />
      <Glyph name="play" cx={46} cy={70} size={12} className={styles.glyphQuiet} />
      <Copy x={60} y={70} w={18} quiet />
      <Rect x={30} y={94} w={60} h={32} rx={8} className={styles.frame} />
      <Glyph name="play" cx={46} cy={110} size={12} className={styles.glyph} />
      <Copy x={60} y={110} w={18} />
      <Hop x1={90} x2={150} y={110} />
      {/* The growth it makes. */}
      <Rect x={150} y={40} w={140} h={100} rx={8} className={styles.frame} />
      <Copy x={166} y={58} w={40} quiet />
      {(
        [
          [176, 16],
          [202, 22],
          [228, 28],
        ] as const
      ).map(([x, h]) => (
        <Rect key={x} x={x} y={124 - h} w={16} h={h} rx={3} className={styles.tile} />
      ))}
      <Rect x={254} y={72} w={16} h={52} rx={3} className={styles.solid} />
      <path className={styles.rule} d="M166,124 L274,124" />
    </>
  );
}

/** Workplace training and apprenticeship apps: a short practice on the phone fits between two shifts. */
function KindWorkplaceTraining() {
  return (
    <>
      {[30, 210].map((x) => (
        <g key={x}>
          <Rect x={x} y={70} w={80} h={40} rx={8} className={styles.tile} />
          <Glyph
            name="clock-circle"
            cx={x + 20}
            cy={90}
            size={16}
            className={styles.glyphQuiet}
          />
          <Copy x={x + 36} y={90} w={30} quiet />
        </g>
      ))}
      <Rect x={130} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Focus x={160} y={78} glyph="checklist" size={12} />
      <Copy x={144} y={112} w={32} />
      <Copy x={144} y={122} w={20} quiet />
    </>
  );
}

/** Assessment and skills sign-off: one record holds the evidence, the witness and the assessor's sign-off (lit). */
function KindAssessmentSignOff() {
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      {/* The evidence. */}
      <Rect x={86} y={42} w={48} h={32} rx={4} className={styles.tile} />
      <Glyph
        name="videocamera-record"
        cx={110}
        cy={58}
        size={16}
        className={styles.glyphQuiet}
      />
      <Copy x={146} y={52} w={60} />
      <Copy x={146} y={64} w={40} quiet />
      {/* The witness, then the assessor, who signs. */}
      <Glyph name="user" cx={98} cy={98} size={16} className={styles.glyph} />
      <Copy x={118} y={98} w={52} quiet />
      <Glyph name="user" cx={98} cy={126} size={16} className={styles.glyph} />
      <Copy x={118} y={126} w={44} />
      <Focus x={222} y={122} glyph="check-circle" size={12} />
    </>
  );
}

/** Teacher dashboards: across the class, the one learner who has stalled is flagged in time to help. */
function KindTeacherDashboards() {
  const cells: readonly { x: number; y: number; p: number; stuck?: boolean }[] = [
    { x: 66, y: 46, p: 34 },
    { x: 132, y: 46, p: 8, stuck: true },
    { x: 198, y: 46, p: 28 },
    { x: 66, y: 94, p: 24 },
    { x: 132, y: 94, p: 40 },
    { x: 198, y: 94, p: 30 },
  ];
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      {cells.map(({ x, y, p, stuck }) => (
        <g key={`${x}-${y}`}>
          <Rect
            x={x}
            y={y}
            w={56}
            h={40}
            rx={4}
            className={stuck ? styles.region : styles.tile}
          />
          <Glyph
            name="user"
            cx={x + 14}
            cy={y + 14}
            size={14}
            className={stuck ? styles.glyphAccent : styles.glyphQuiet}
          />
          {stuck ? (
            <Glyph
              name="flag"
              cx={x + 42}
              cy={y + 14}
              size={12}
              className={styles.glyphAccent}
            />
          ) : null}
          <path
            className={stuck ? styles.regionCopy : styles.copy}
            d={`M${x + 8},${y + 30} L${x + 48},${y + 30}`}
          />
          <path
            className={stuck ? styles.line : styles.copyQuiet}
            d={`M${x + 8},${y + 30} L${x + 8 + p},${y + 30}`}
          />
        </g>
      ))}
    </>
  );
}

/**
 * /expertise/edtech-learning · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Research with learners and educators: Research with learners and educators, on the devices they really use */
  'wyg-edtech-learning-research-learners-educators': ResearchLearnersEducators,
  /* An audit with a plain verdict: An audit of content structure, mobile use, consistency and community features, each with a plain verdict */
  'wyg-edtech-learning-audit-plain-verdict': AuditPlainVerdict,
  /* Content regrouped: Content regrouped so every learner can see the current activity and what follows it */
  'wyg-edtech-learning-content-regrouped': ContentRegrouped,
  /* Views built around who needs help: Teacher, mentor and assessor views built around who needs help */
  'wyg-edtech-learning-views-built-around-who': ViewsBuiltAroundWho,
  /* Hybrid wireframes: Hybrid wireframes that put the course structure and the visual direction in front of you at once */
  'wyg-edtech-learning-hybrid-wireframes': HybridWireframes,
  /* Parent views for younger learners: Defaults, consent steps and parent views for younger learners */
  'wyg-edtech-learning-parent-views-younger-learners': ParentViewsYoungerLearners,
  /* Configured in Moodle or your LMS: The theme, plugins and settings configured in Moodle or your LMS by our team */
  'wyg-edtech-learning-configured-moodle-or-lms': ConfiguredMoodleOrLms,
  /* Who does the work: One senior product designer leads and does the design, and an account lead runs the project day to day. Our developers configure the platfor */
  'team-edtech-learning': TeamEdtechLearning,
  /* What we need from you: Time with learners and educators, and access to your LMS with its plugins, themes and settings. The course content, your instructional desig */
  'needs-edtech-learning': NeedsEdtechLearning,
  /* Where our part stops: Course content, assessment standards and accreditation stay with your instructional designers and subject experts. Privacy requirements for  */
  'stops-edtech-learning': StopsEdtechLearning,
  /* MOVING: this tile links to /case-studies/transforming-an-edtech-platform-into-an-engaging-learning-experience, so the drawing makes one move on hover (S.7 on /design/sketch). */
  /* What we design in, tile: LMS and Moodle course experiences, with custom themes and plugins: The Wandering Raven */
  'kind-edtech-learning-lms-moodle-course-experiences': KindLmsMoodle,
  /* What we design in, tile: Creative learning products for young people aged eight to eighteen: The Wandering Raven */
  'kind-edtech-learning-creative-learning-products-young': KindCreativeYoung,
  /* What we design in, tile: Growth projects inside a learning platform's product team: JoVE */
  'kind-edtech-learning-growth-projects-inside-learning': KindGrowthInside,
  /* What we design in, tile: Workplace training and apprenticeship apps: Practice that fits between shifts */
  'kind-edtech-learning-workplace-training-apprenticeship-apps': KindWorkplaceTraining,
  /* What we design in, tile: Assessment and skills sign-off tools: Evidence, witness and assessor on one record */
  'kind-edtech-learning-assessment-skills-sign-off': KindAssessmentSignOff,
  /* What we design in, tile: Teacher dashboards and educator views: Who is stuck, seen early enough to help */
  'kind-edtech-learning-teacher-dashboards-educator-views': KindTeacherDashboards,
};
