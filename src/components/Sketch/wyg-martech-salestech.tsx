import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A run of chips on one row, centred on cx, 28 apart. */
function Chips({ cx, cy, glyphs }: { cx: number; cy: number; glyphs: readonly IconName[] }) {
  return (
    <>
      {glyphs.map((glyph, i) => (
        <C key={glyph} cx={cx + (i - (glyphs.length - 1) / 2) * 28} cy={cy} glyph={glyph} />
      ))}
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** What the people who use it say they need most becomes the first change; the rest waits, unbuilt. */
function InterviewsMarketersReps() {
  return (
    <>
      {/* The interview: the people who use the product, and what they say. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={70} cy={78} size={26} className={styles.glyph} />
      <Copy x={46} y={106} w={48} />
      <Copy x={46} y={116} w={32} quiet />
      <Hop x1={110} x2={150} y={90} />
      {/* The product's list of changes: the one they asked for most goes first. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={46} w={40} quiet />
      <Rect x={160} y={54} w={120} h={36} rx={10} className={styles.halo} />
      <Rect x={166} y={60} w={108} h={24} className={styles.solid} />
      <Glyph name="flag" cx={180} cy={72} size={12} className={styles.glyphOn} />
      <path className={styles.tick} d="M194,72 L238,72" />
      <Hatched x={166} y={98} w={108} h={18} />
      <Hatched x={166} y={124} w={108} h={16} />
    </>
  );
}

/** On one screen, the figure that matters and, beside it, its next action. */
function ReportsNextAction() {
  const bars: [number, number][] = [
    [68, 20],
    [92, 30],
    [116, 44],
    [140, 24],
  ];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {/* The report: one figure among the others is the one that matters. */}
      <Rect x={50} y={50} w={120} h={80} rx={4} className={styles.tile} />
      <Copy x={62} y={64} w={40} quiet />
      <path className={styles.rule} d="M62,118 L158,118" />
      {bars.map(([x, h], i) => (
        <Rect
          key={x}
          x={x}
          y={118 - h}
          w={12}
          h={h}
          rx={3}
          className={i === 2 ? styles.soft : styles.tile}
        />
      ))}
      <circle className={styles.node} cx={170} cy={90} r="2.5" />
      <path className={styles.line} d="M170,90 L203,90" />
      {/* Its next action, on the same screen. */}
      <Rect x={204} y={72} w={72} h={36} rx={18} className={styles.halo} />
      <Rect x={210} y={78} w={60} h={24} rx={12} className={styles.solid} />
      <Glyph name="arrow-right" cx={240} cy={90} size={14} className={styles.glyphOn} />
    </>
  );
}

/** The AI's suggestion sits apart from the person's own work, marked, and goes in only on a deliberate accept. */
function AiDraftReview() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      {/* The person's own draft, marked as theirs. */}
      <Chip x={46} y={46} glyph="user" />
      <Copy x={70} y={54} w={40} quiet />
      <Copy x={46} y={80} w={100} />
      <Copy x={46} y={92} w={84} quiet />
      <Copy x={46} y={104} w={96} />
      <Copy x={46} y={116} w={60} quiet />
      {/* The AI's suggestion, kept apart and marked, waiting on the accept. */}
      <Rect x={176} y={46} w={98} h={94} rx={4} className={styles.trailFrame} />
      <Chip x={186} y={56} glyph="stars" />
      <Copy x={210} y={64} w={48} quiet />
      <Copy x={186} y={80} w={72} quiet />
      <Copy x={186} y={90} w={52} quiet />
      <Rect x={180} y={100} w={56} h={26} rx={13} className={styles.halo} />
      <Rect x={186} y={106} w={44} h={14} rx={7} className={styles.solid} />
      <Glyph name="check-circle" cx={208} cy={113} size={10} className={styles.glyphOn} />
      <Cursor x={222} y={116} />
    </>
  );
}

/** One record for the campaign, deal or quote, shared by every role and tool it passes through. */
function SharedRecord() {
  const side = (x: number, glyph: IconName) => (
    <>
      <Rect x={x + 4} y={68} w={36} h={36} rx={8} className={styles.frameQuiet} />
      <Rect x={x} y={72} w={36} h={36} rx={8} className={styles.frame} />
      <Glyph name={glyph} cx={x + 18} cy={90} size={20} className={styles.glyph} />
    </>
  );
  return (
    <>
      {/* The roles on one side, the tools on the other: one of many each. */}
      {side(34, 'user')}
      {side(250, 'monitor')}
      <path className={styles.line} d="M70,90 L130,90 M210,90 L250,90" />
      {[70, 130, 210, 250].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy={90} r="2.5" />
      ))}
      {/* The one shared record they all read and write. */}
      <Rect x={130} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Focus x={170} y={72} glyph="document-text" size={13} />
      <Copy x={146} y={108} w={48} />
      <Copy x={146} y={120} w={32} quiet />
    </>
  );
}

/** Before the send, the list shows who can be sent to, and the one who unsubscribed stands out. */
function ConsentUnsubscribeStates() {
  const rows: [number, IconName][] = [
    [52, 'check-circle'],
    [80, 'close-circle'],
    [108, 'clock-circle'],
  ];
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      <Rect x={64} y={64} w={192} h={32} rx={10} className={styles.halo} />
      <Rect x={70} y={70} w={180} h={20} rx={4} className={styles.region} />
      {rows.map(([y, glyph], i) => (
        <g key={y}>
          <Glyph name="user" cx={84} cy={y} size={14} className={styles.glyph} />
          {i === 1 ? (
            <path className={styles.regionCopy} d={`M100,${y} L172,${y}`} />
          ) : (
            <Copy x={100} y={y} w={80} quiet />
          )}
          <Glyph
            name={glyph}
            cx={236}
            cy={y}
            size={14}
            className={i === 1 ? styles.glyphAccent : styles.glyph}
          />
        </g>
      ))}
      {/* The send, still waiting. */}
      <Rect x={196} y={124} w={48} h={16} rx={8} className={styles.tile} />
      <Glyph name="arrow-right" cx={220} cy={132} size={10} className={styles.glyphQuiet} />
    </>
  );
}

/** The filters, states and data displays written up once; every later screen follows them. */
function SharedFiltersStatesData() {
  return (
    <>
      {/* The write-up: each pattern drawn, with its words beside it. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Rect x={42} y={44} w={28} h={12} rx={6} className={styles.tile} />
      <Copy x={80} y={46} w={36} />
      <Copy x={80} y={54} w={24} quiet />
      <Glyph name="info-circle" cx={56} cy={90} size={16} className={styles.glyph} />
      <Copy x={80} y={86} w={36} />
      <Copy x={80} y={94} w={24} quiet />
      <path className={styles.hair} d="M42,122 L70,122 M42,130 L70,130 M42,138 L70,138" />
      <Copy x={80} y={126} w={36} />
      <Copy x={80} y={134} w={24} quiet />
      <Hop x1={130} x2={170} y={90} />
      {/* The later screens, one of many, built to it: the filter applied, the table as written. */}
      <Rect x={178} y={32} w={112} h={108} rx={8} className={styles.frameQuiet} />
      <Rect x={170} y={40} w={112} h={110} rx={8} className={styles.frame} />
      <Rect x={176} y={50} w={40} h={24} rx={12} className={styles.halo} />
      <Rect x={182} y={56} w={28} h={12} rx={6} className={styles.solid} />
      <Rect x={224} y={56} w={28} h={12} rx={6} className={styles.tile} />
      <path className={styles.hair} d="M182,104 L270,104 M182,120 L270,120" />
      {[96, 112, 128].map((y, i) => (
        <g key={y}>
          <Copy x={186} y={y} w={24} quiet={i !== 1} />
          <Copy x={226} y={y} w={[36, 28, 32][i] ?? 32} quiet />
        </g>
      ))}
    </>
  );
}

/** The design, handed to the code your engineers build, or ours building it with them. */
function DesignsEngineersBuildFrom() {
  return (
    <>
      {/* The design. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Chip x={42} y={42} glyph="ruler-pen" />
      <Copy x={66} y={50} w={40} quiet />
      <Rect x={42} y={70} w={76} h={36} rx={4} className={styles.tile} />
      <Copy x={42} y={120} w={56} />
      <Rect x={42} y={130} w={32} h={10} rx={5} className={styles.tile} />
      <Hop x1={130} x2={170} y={90} />
      {/* The code built from it. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Chip x={182} y={42} glyph="code" />
      <Copy x={206} y={50} w={40} quiet />
      <Copy x={182} y={72} w={56} />
      <Copy x={194} y={84} w={64} quiet />
      <Copy x={194} y={96} w={48} />
      <Copy x={182} y={108} w={40} quiet />
      <Focus x={262} y={126} glyph="check-circle" size={12} />
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** The senior designer (lit) and the account lead; researchers and design engineers or developers join when needed. */
function TeamMartechSalestech() {
  const roles: IconName[] = ['microphone', 'code'];
  const ys = [70, 110];
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
        const cy = ys[i] ?? 90;
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

/** Sessions with the people who use it, the analytics and most-asked reports, and the person who decides what ships (lit). */
function NeedsMartechSalestech() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Chips cx={80} cy={50} glyphs={['users-group-rounded', 'calendar']} />
      <Chips cx={80} cy={90} glyphs={['graph-up', 'document-text']} />
      <Focus x={80} y={130} glyph="user" size={12} />
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

/** Our part ends at the readable screen (checked); attribution, CRM, pipelines and AI models stay on their side. */
function StopsMartechSalestech() {
  const theirs: [number, IconName[]][] = [
    [50, ['graph-up', 'users-group-rounded']],
    [90, ['database', 'server']],
    [130, ['cpu']],
  ];
  return (
    <>
      {/* Ours: the screen that makes their work readable. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Copy x={42} y={76} w={56} />
      <Rect x={42} y={88} w={56} h={20} rx={4} className={styles.tile} />
      <Copy x={50} y={98} w={32} quiet />
      <Copy x={42} y={118} w={40} quiet />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs: no route enters it. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      {theirs.map(([cy, glyphs]) => {
        const n = glyphs.length;
        const x = 236 + 20 * (n - 1);
        const w = 280 - x;
        return (
          <g key={cy}>
            {glyphs.map((glyph, i) => (
              <C key={glyph} cx={216 + i * 20} cy={cy} glyph={glyph} />
            ))}
            <Copy x={x} y={cy - 4} w={w} />
            <Copy x={x} y={cy + 4} w={Math.round(w * 0.7)} quiet />
          </g>
        );
      })}
    </>
  );
}

/**
 * /expertise/martech-salestech · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Interviews with marketers and reps: Interviews with marketers, reps, pricing experts and their managers, so the first change comes from what users say they need most */
  'wyg-martech-salestech-interviews-marketers-reps': InterviewsMarketersReps,
  /* Reports with the next action: Reports and dashboards where each figure that matters has its next action on the same screen */
  'wyg-martech-salestech-reports-next-action': ReportsNextAction,
  /* AI draft review: AI draft review: suggestions kept apart, acceptance made deliberate, and AI and human work marked */
  'wyg-martech-salestech-ai-draft-review': AiDraftReview,
  /* The shared record: The shared record for a campaign, deal or quote, with every role and tool it passes through */
  'wyg-martech-salestech-shared-record': SharedRecord,
  /* Consent and unsubscribe states: Consent and unsubscribe states marketers can read before a send */
  'wyg-martech-salestech-consent-unsubscribe-states': ConsentUnsubscribeStates,
  /* Shared filters, states and data displays: Shared filters, states and data displays, written up so later screens follow them */
  'wyg-martech-salestech-shared-filters-states-data': SharedFiltersStatesData,
  /* Designs your engineers build from: Designs your engineers build from, or Tcules developers building with your team */
  'wyg-martech-salestech-designs-engineers-build-from': DesignsEngineersBuildFrom,
  /* Who does the work: Each project has a senior product designer at its head, doing the design work, and an account lead keeping it on schedule. Researchers join  */
  'team-martech-salestech': TeamMartechSalestech,
  /* What we need from you: Sessions with the marketers, reps and managers who use the product, your analytics and the reports customers ask for most, and the person wh */
  'needs-martech-salestech': NeedsMartechSalestech,
  /* Where our part stops: Attribution models, data pipelines and CRM configuration stay with your marketing operations, data or CRM specialists; our design makes thei */
  'stops-martech-salestech': StopsMartechSalestech,
};
