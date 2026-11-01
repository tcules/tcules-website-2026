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

/** The one arrowhead pointing down, tip at (x, y). */
function ArrowDown({ x, y }: { x: number; y: number }) {
  return <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />;
}

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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** Every state the case can reach, mapped: the one picked opens what the customer sees, what staff see, what happens next. */
function StatusMap() {
  return (
    <>
      {/* The states on their track, what happens next running on to the right. */}
      <path className={styles.rule} d="M50,50 L263,50" />
      <path className={styles.quietMark} d="M270,50 L263,46 L263,54 Z" />
      {[70, 110, 190, 230].map((x) => (
        <circle key={x} className={styles.tile} cx={x} cy={50} r="6" />
      ))}
      <Focus x={150} y={50} glyph="clock-circle" size={13} />
      <path className={styles.line} d="M150,61 L150,103" />
      <ArrowDown x={150} y={110} />
      {/* What that state shows: the customer's phone, the staff screen. */}
      <Rect x={70} y={110} w={160} h={40} rx={8} className={styles.frame} />
      {(
        [
          [88, 'smartphone'],
          [136, 'monitor'],
          [184, 'arrow-right'],
        ] as const
      ).map(([cx, glyph]) => (
        <g key={cx}>
          <C cx={cx} cy={130} glyph={glyph} />
          <Copy x={cx + 14} y={130} w={22} quiet />
        </g>
      ))}
    </>
  );
}

/** The main path runs sign-up, identity, payout; the decline turns off it and lands on a screen designed too. */
function CustomerJourneys() {
  return (
    <>
      {/* The main path, grey: sign-up, the identity check, the payout. */}
      {(
        [
          [70, 'user'],
          [150, 'shield-check'],
          [230, 'wallet'],
        ] as const
      ).map(([cx, glyph]) => (
        <g key={cx}>
          <Rect x={cx - 20} y={36} w={40} h={40} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={cx} cy={56} size={20} className={styles.glyph} />
        </g>
      ))}
      <path className={styles.rule} d="M90,56 L123,56 M170,56 L203,56" />
      <path className={styles.quietMark} d="M130,56 L123,52 L123,60 Z M210,56 L203,52 L203,60 Z" />
      {/* The decline branch, blue: off the identity check, turning beside the path. */}
      <path className={styles.line} d="M150,76 L150,124 A6,6 0 0 0 156,130 L183,130" />
      <ArrowRight x={190} y={130} />
      <circle className={styles.node} cx="150" cy="76" r="2.5" />
      {/* The decline, designed: a screen that says why and offers the way on. */}
      <Rect x={190} y={112} w={80} h={36} rx={8} className={styles.frame} />
      <Glyph name="danger-triangle" cx={206} cy={130} size={16} className={styles.glyph} />
      <Copy x={222} y={123} w={36} />
      <Rect x={222} y={130} w={32} h={10} rx={5} className={styles.solid} />
    </>
  );
}

/** The reviewer's screen holds the case, its evidence and the approver's limit; it passes to whoever acts next. */
function ReviewApprovalScreens() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={48} w={40} quiet />
      <Copy x={46} y={60} w={96} />
      {/* The evidence. */}
      {[46, 76].map((x) => (
        <g key={x}>
          <Rect x={x} y={74} w={22} h={28} rx={4} className={styles.frame} />
          <Glyph name="document-text" cx={x + 11} cy={88} size={12} className={styles.glyph} />
        </g>
      ))}
      <Copy x={112} y={82} w={56} />
      <Copy x={112} y={94} w={40} quiet />
      {/* The approver's limit: the amount sits inside it. */}
      <Rect x={46} y={118} w={128} h={8} className={styles.tile} />
      <Rect x={46} y={118} w={84} h={8} className={styles.soft} />
      <path className={styles.rule} d="M150,112 L150,132" />
      {/* Who acts next. */}
      <Hop x1={190} x2={230} y={90} />
      <Rect x={230} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Focus x={260} y={90} glyph="user" size={12} />
    </>
  );
}

/** The wording, drafted with compliance, fits a small phone screen, its consent given. */
function ReasonsDisclosuresConsentWording() {
  return (
    <>
      {/* The draft, with compliance. */}
      <Rect x={50} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Chip x={62} y={52} glyph="shield-check" />
      <Copy x={86} y={60} w={40} quiet />
      <Copy x={62} y={86} w={72} />
      <Copy x={62} y={98} w={56} quiet />
      <Copy x={62} y={110} w={68} />
      <Copy x={62} y={122} w={44} quiet />
      <Hop x1={150} x2={210} y={90} />
      {/* The small phone it is checked on. */}
      <Rect x={210} y={30} w={60} h={120} rx={8} className={styles.frame} />
      <Copy x={222} y={48} w={28} />
      <Copy x={222} y={58} w={36} quiet />
      <Copy x={222} y={68} w={24} quiet />
      <Rect x={216} y={88} w={22} h={22} rx={6} className={styles.halo} />
      <Rect x={222} y={94} w={10} h={10} rx={3} className={styles.solid} />
      <path className={styles.tick} d="M224.5,99 L226.5,101.5 L229.5,96.5" />
      <Copy x={244} y={99} w={14} quiet />
      <Rect x={222} y={124} w={36} h={12} rx={6} className={styles.tile} />
    </>
  );
}

/** The people the product is for, put in front of the concept while it is still unbuilt. */
function ResearchPeopleProductIs() {
  return (
    <>
      {/* The people, on both sides. */}
      {[50, 270].map((cx) => (
        <g key={cx}>
          <Rect x={cx - 20} y={70} w={40} h={40} rx={8} className={styles.frame} />
          <Glyph name="user" cx={cx} cy={90} size={22} className={styles.glyph} />
        </g>
      ))}
      <Hop x1={70} x2={110} y={90} />
      <Hop x1={250} x2={210} y={90} />
      {/* The concept: sketched, not built, its open question the focus. */}
      <Rect x={110} y={30} w={100} h={120} rx={8} className={styles.trailFrame} />
      <Copy x={126} y={48} w={40} quiet />
      <Hatched x={126} y={60} w={68} h={28} />
      <Focus x={160} y={118} glyph="question-circle" size={13} />
    </>
  );
}

/** Placeholder figures become realistic ones, in a prototype product, engineering and marketing review. */
function PrototypesRealisticFigures() {
  const bars: [number, number][] = [
    [170, 16],
    [190, 24],
    [210, 20],
    [230, 38],
    [250, 28],
  ];
  return (
    <>
      {/* The wireframe: its figures still placeholders. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.trailFrame} />
      <Copy x={42} y={64} w={36} quiet />
      <Hatched x={42} y={76} w={56} h={40} />
      <Hop x1={110} x2={150} y={90} />
      {/* The prototype: real numbers, and the three teams who review it. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <C cx={174} cy={50} glyph="widget" />
      <C cx={198} cy={50} glyph="code" />
      <C cx={222} cy={50} glyph="chat-round-dots" />
      <Copy x={166} y={76} w={56} />
      <Copy x={166} y={86} w={36} quiet />
      <path className={styles.rule} d="M166,134 L274,134" />
      {bars.map(([x, h]) => (
        <Rect
          key={x}
          x={x}
          y={134 - h}
          w={12}
          h={h}
          rx={3}
          className={x === 230 ? styles.solid : styles.tile}
        />
      ))}
    </>
  );
}

/** A glyph in a chip at (x, y), set at 12 units so it reads as the cue. */
function BigChip({ x, y, glyph }: { x: number; y: number; glyph: IconName }) {
  return (
    <>
      <rect className={styles.chip} x={x} y={y} width="16" height="16" rx="4" />
      <Glyph name={glyph} cx={x + 8} cy={y + 8} size={12} className={styles.glyphAccent} />
    </>
  );
}

/** The designed screen, measured and specified, goes straight into code that builds it. */
function DesignsReadyEngineers() {
  return (
    <>
      {/* The design: its screen measured on both edges. */}
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <BigChip x={42} y={52} glyph="ruler-pen" />
      <Copy x={66} y={60} w={44} quiet />
      <Rect x={42} y={84} w={72} h={24} className={styles.tile} />
      <path className={styles.rule} d="M42,80 L114,80 M42,77 L42,83 M114,77 L114,83" />
      <path className={styles.rule} d="M118,84 L118,108 M115,84 L121,84 M115,108 L121,108" />
      <Copy x={42} y={120} w={56} />
      <Copy x={42} y={130} w={36} quiet />
      <Hop x1={130} x2={170} y={90} />
      {/* The code, built from it. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M194,30 L194,150" />
      <BigChip x={206} y={42} glyph="code" />
      {(
        [
          [66, 0, 56, false],
          [78, 8, 56, true],
          [90, 16, 40, false],
          [102, 8, 52, true],
          [114, 0, 36, false],
        ] as const
      ).map(([y, dx, w, quiet]) => (
        <Copy key={y} x={206 + dx} y={y} w={w} quiet={quiet} />
      ))}
      <Focus x={266} y={126} glyph="check-circle" size={12} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; a researcher, design engineers or developers join when needed. */
function TeamFintech() {
  const roles: IconName[] = ['chat-round-dots', 'code', 'server'];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map((glyph, i) => {
        const cy = [50, 90, 130][i] ?? 90;
        return (
          <g key={glyph}>
            <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.trailFrame} />
            <C cx={234} cy={cy} glyph={glyph} />
            <Copy x={250} y={cy} w={26} quiet />
            <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
            <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
          </g>
        );
      })}
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** Your compliance lead's time on the wording and policy rules (lit); support calls and time with
 *  customers and staff; the person who makes product calls. */
function NeedsFintech() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={60} y={50} glyph="shield-check" size={12} />
      <Sheet cx={100} cy={52} behind={1} />
      <C cx={66} cy={90} glyph="chat-round-dots" />
      <C cx={94} cy={90} glyph="users-group-rounded" />
      <C cx={80} cy={130} glyph="user" />
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

/** Our screens present the rules clearly; sign-off, credit and fraud rules, and payment integrations stay theirs. */
function StopsFintech() {
  return (
    <>
      {/* Our last piece: the screen that states their rule plainly. */}
      {[2, 1].map((n) => (
        <Rect
          key={n}
          x={30 - n * 4}
          y={50 - n * 4}
          w={80}
          h={80}
          rx={8}
          className={styles.frameQuiet}
        />
      ))}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Glyph name="info-circle" cx={48} cy={82} size={12} className={styles.glyph} />
      <Copy x={60} y={82} w={38} />
      <Copy x={42} y={94} w={44} quiet />
      <Rect x={42} y={106} w={36} h={12} rx={4} className={styles.tile} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: regulatory sign-off; credit models and fraud rules; payment integrations. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['shield-check']} />
      <Theirs cy={90} glyphs={['graph-up', 'lock']} />
      <Theirs cy={130} glyphs={['wallet', 'code']} />
    </>
  );
}

/**
 * /expertise/fintech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A status map: Every state a loan, payment or claim can reach, with what the customer sees, what staff see and what happens next */
  'wyg-fintech-status-map': StatusMap,
  /* Customer journeys: Customer journeys from sign-up and identity checks to repayment or payout, with every decline and failure designed beside the main path */
  'wyg-fintech-customer-journeys': CustomerJourneys,
  /* Review and approval screens: Review and approval screens that show the case, its evidence, the approver's limit and who acts next */
  'wyg-fintech-review-approval-screens': ReviewApprovalScreens,
  /* Reasons, disclosures and consent wording: Reasons, disclosures and consent wording drafted with your compliance team, and checked on a small phone screen */
  'wyg-fintech-reasons-disclosures-consent-wording': ReasonsDisclosuresConsentWording,
  /* Research with the people the product is for: Research with the people the product is for, where the concept still needs testing */
  'wyg-fintech-research-people-product-is': ResearchPeopleProductIs,
  /* Prototypes with realistic figures: Prototypes with realistic figures that product, engineering and marketing can review before code */
  'wyg-fintech-prototypes-realistic-figures': PrototypesRealisticFigures,
  /* Designs ready for your engineers: Designs ready for your engineers, or Tcules developers who build with them */
  'wyg-fintech-designs-ready-engineers': DesignsReadyEngineers,
  /* Who does the work: One senior product designer leads it and designs the screens, and an account lead keeps it moving. A researcher joins when a concept needs t */
  'team-fintech': TeamFintech,
  /* What we need from you: Your compliance or risk lead's time on wording and decline reasons, and the policy rules behind each status. We also need the support calls  */
  'needs-fintech': NeedsFintech,
  /* Where our part stops: Lending policy, credit models, fraud rules and regulatory sign-off stay with your compliance, risk and legal teams; our designs present thei */
  'stops-fintech': StopsFintech,
};
