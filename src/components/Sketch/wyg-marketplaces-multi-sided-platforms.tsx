import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, ArrowUp, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** What changes hands: the deal's states written in a row, the one where it binds locked, and who acts at each. */
function ChangesHands() {
  const actors: { cx: number; glyph: IconName }[] = [
    { cx: 70, glyph: 'user' },
    { cx: 159, glyph: 'users-group-rounded' },
    { cx: 250, glyph: 'user' },
  ];
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Copy x={50} y={50} w={64} quiet />
      <Rect x={50} y={80} w={40} h={20} rx={10} className={styles.tile} />
      <Rect x={124} y={74} w={72} h={32} rx={16} className={styles.halo} />
      <Rect x={130} y={80} w={60} h={20} rx={10} className={styles.solid} />
      <Glyph name="lock" cx={160} cy={90} size={11} className={styles.glyphOn} />
      {/* Both routes stop at the halo's outer edge, so the ring stays 6 clear of the chip. */}
      <Hop x1={90} x2={124} y={90} />
      <Hop x1={196} x2={230} y={90} />
      <Rect x={230} y={80} w={40} h={20} rx={10} className={styles.tile} />
      {actors.map(({ cx, glyph }) => (
        <Glyph key={cx} name={glyph} cx={cx} cy={126} size={16} className={styles.glyph} />
      ))}
    </>
  );
}

/** Research: the buyer, the provider and the operations staff, each heard in a conversation of their own. */
function Research() {
  const people: { x: number; glyph: IconName; lit?: boolean }[] = [
    { x: 30, glyph: 'user' },
    { x: 130, glyph: 'user' },
    { x: 230, glyph: 'users-group-rounded' },
  ];
  return (
    <>
      {people.map(({ x, glyph }) => (
        <g key={x}>
          <Rect x={x} y={40} w={60} h={100} rx={8} className={styles.frame} />
          <Chip x={x + 8} y={48} glyph="chat-round-dots" />
          <Glyph name={glyph} cx={x + 30} cy={88} size={24} className={styles.glyph} />
          <Copy x={x + 12} y={116} w={36} />
          <Copy x={x + 12} y={126} w={24} quiet />
        </g>
      ))}
    </>
  );
}

/** One record: the buyer's phone, the operations screen and the provider's phone all hold the same booking. */
function OneRecord() {
  return (
    <>
      {/* The buyer's phone. */}
      <Rect x={30} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Copy x={42} y={56} w={24} quiet />
      <Rect x={38} y={80} w={44} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M46,90 L70,90" />
      <Rect x={42} y={118} w={36} h={12} rx={6} className={styles.tile} />
      {/* Operations, the wider screen. */}
      <Rect x={130} y={30} w={60} h={120} rx={8} className={styles.frame} />
      <Copy x={142} y={46} w={28} quiet />
      <Copy x={142} y={62} w={36} quiet />
      <Rect x={138} y={80} w={44} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M146,90 L170,90" />
      <Copy x={142} y={118} w={36} quiet />
      <Copy x={142} y={134} w={24} quiet />
      {/* The provider's phone. */}
      <Rect x={230} y={40} w={60} h={100} rx={8} className={styles.frame} />
      <Copy x={242} y={56} w={24} quiet />
      <Rect x={238} y={80} w={44} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M246,90 L270,90" />
      <Rect x={242} y={118} w={36} h={12} rx={6} className={styles.tile} />
      {/* The same record, joined across all three. */}
      <path className={styles.line} d="M90,90 L130,90 M190,90 L230,90" />
      {[90, 130, 190, 230].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy={90} r="2.5" />
      ))}
    </>
  );
}

/** Cancellations as a stage: the booking's track, and the refund drawn as a stage that rejoins it. */
function Stages() {
  return (
    <>
      <path className={styles.rule} d="M56.5,60 L123.5,60 M136.5,60 L203.5,60 M216.5,60 L250,60" />
      {[50, 130, 210].map((x) => (
        <circle key={x} className={styles.frame} cx={x} cy={60} r="6.5" />
      ))}
      <Glyph name="flag" cx={266} cy={60} size={16} className={styles.glyphQuiet} />
      {/* The stage: down from the booking, through the refund, back up onto the track. */}
      <path
        className={styles.line}
        d="M130,66.5 L130,114 A6,6 0 0 0 136,120 L146,120 M194,120 L204,120 A6,6 0 0 0 210,114 L210,74"
      />
      <ArrowUp x={210} y={67} />
      <Rect x={140} y={104} w={60} h={32} rx={16} className={styles.halo} />
      <Rect x={146} y={110} w={48} h={20} rx={10} className={styles.solid} />
      <Glyph name="undo-left" cx={160} cy={120} size={10} className={styles.glyphOn} />
      <path className={styles.tick} d="M172,120 L184,120" />
    </>
  );
}

/** Operations and trust: the queue of cases, the payment problem opened, and the log of who changed what. */
function OpsTools() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={46} w={40} quiet />
      {[66, 114, 134].map((y, i) => (
        <g key={y}>
          <Rect x={46} y={y - 6} w={12} h={12} rx={3} className={styles.tile} />
          <Copy x={66} y={y} w={[56, 44, 52][i] ?? 48} quiet />
        </g>
      ))}
      <Rect x={40} y={78} w={100} h={24} className={styles.region} />
      <Glyph name="wallet" cx={52} cy={90} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M66,90 L120,90" />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M214,46 L214,134" />
      {[50, 90, 130].map((y, i) => (
        <g key={y}>
          <circle className={i === 1 ? styles.solid : styles.nodeOpen} cx={214} cy={y} r="3" />
          <Glyph name="user" cx={232} cy={y} size={14} className={styles.glyph} />
          <Copy x={246} y={y} w={[28, 32, 24][i] ?? 28} quiet={i !== 1} />
        </g>
      ))}
    </>
  );
}

/** Built for each side: the buyer's and the provider's screens, coded. */
function Build() {
  return (
    <>
      {[30, 86].map((x, i) => (
        <g key={x}>
          <Rect x={x} y={40} w={44} h={100} rx={8} className={styles.frame} />
          <Copy x={x + 10} y={56} w={20} quiet />
          <Rect x={x + 8} y={70} w={28} h={28} className={styles.tile} />
          <Copy x={x + 10} y={110} w={22} quiet />
          <Rect
            x={x + 8}
            y={120}
            w={28}
            h={10}
            rx={5}
            className={i === 0 ? styles.solid : styles.tile}
          />
        </g>
      ))}
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Chip x={178} y={48} glyph="code" />
      <path className={styles.rule} d="M200,72 L200,132" />
      {[80, 92, 104, 116].map((y, i) => (
        <Copy key={y} x={210 + (i % 2) * 8} y={y} w={[56, 40, 48, 32][i] ?? 40} quiet={i % 2 === 1} />
      ))}
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** One senior designer (lit) designing for both sides of the market, the account lead beneath. */
function Team() {
  const side = (x: number, glyph: IconName) => (
    <>
      <Rect x={x} y={40} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name={glyph} cx={x + 30} cy={62} size={16} className={styles.glyph} />
      <Copy x={x + 14} y={84} w={32} quiet />
    </>
  );
  return (
    <>
      {side(30, 'cart')}
      {side(230, 'wallet')}
      <path className={styles.line} d="M90,70 L130,70 M190,70 L230,70" />
      {[90, 230].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy={70} r="2.5" />
      ))}
      <Focus x={160} y={70} glyph="user" size={12} />
      {/* The account lead, keeping it moving. */}
      <Glyph name="user" cx={160} cy={120} size={16} className={styles.glyph} />
      <Copy x={146} y={138} w={28} quiet />
    </>
  );
}

/** What we need: people from both sides, the rules you already run on, and the dispute that shows the failing join. */
function Needs() {
  const rules: IconName[] = ['undo-left', 'wallet', 'shield-check'];
  return (
    <>
      <Rect x={30} y={40} w={40} h={100} rx={8} className={styles.frameQuiet} />
      <Glyph name="user" cx={50} cy={60} size={18} className={styles.glyph} />
      <Glyph name="user" cx={50} cy={120} size={18} className={styles.glyph} />
      <Glyph name="users-group-rounded" cx={50} cy={90} size={18} className={styles.glyph} />
      <Rect x={90} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={106} y={48} w={40} quiet />
      {rules.map((glyph, i) => (
        <g key={glyph}>
          <C cx={114} cy={74 + i * 26} glyph={glyph} />
          <Copy x={130} y={74 + i * 26} w={[44, 36, 40][i] ?? 40} />
        </g>
      ))}
      <Rect x={218} y={42} w={68} h={96} rx={8} className={styles.frameQuiet} />
      <Rect x={214} y={46} w={68} h={96} rx={8} className={styles.frameQuiet} />
      <Rect x={210} y={50} w={68} h={96} rx={8} className={styles.frame} />
      <Glyph name="chat-round-dots" cx={226} cy={66} size={12} className={styles.glyph} />
      <Copy x={222} y={84} w={40} quiet />
      <Focus x={244} y={116} glyph="danger-triangle" size={11} />
    </>
  );
}

/** Where our part stops: their payment, fraud and verification rules come in; our part is the clear screen. */
function Stops() {
  const theirs: IconName[] = ['wallet', 'shield-check', 'key'];
  return (
    <>
      <Rect x={30} y={34} w={112} h={112} rx={12} className={styles.halo} />
      <Rect x={36} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={52} y={58} w={40} quiet />
      <Copy x={52} y={72} w={64} />
      <Rect x={52} y={88} w={68} h={16} className={styles.tile} />
      <Rect x={52} y={116} w={44} h={14} rx={7} className={styles.solid} />
      {/* Theirs: dashed, the stroke the guides use for what sits outside our part. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.trailFrame} />
      {/* The route leaves the middle of the rules card's left edge on a port, and stops at the halo. */}
      <path className={styles.line} d="M190,90 L149,90" />
      <ArrowLeft x={142} y={90} />
      <circle className={styles.node} cx="190" cy="90" r="2.5" />
      {theirs.map((glyph, i) => (
        <g key={glyph}>
          <C cx={214} cy={56 + i * 34} glyph={glyph} />
          <Copy x={232} y={52 + i * 34} w={42} />
          <Copy x={232} y={60 + i * 34} w={28} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /expertise/marketplaces-multi-sided-platforms · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What changes hands: A written description of what changes hands: its states, when it binds and who acts at each one */
  'wyg-marketplaces-multi-sided-platforms-what-changes-hands': ChangesHands,
  /* Research with buyers, providers and your operations staff: Research with buyers, providers and your operations staff, each interviewed separately */
  'wyg-marketplaces-multi-sided-platforms-research-buyers-providers-operations': Research,
  /* Screens drawn together on one record: Buyer, provider and operations screens drawn together on one record */
  'wyg-marketplaces-multi-sided-platforms-screens-drawn-together-one': OneRecord,
  /* Cancellations and disputes as stages: Cancellations, changes, refunds and disputes designed as stages of the booking, with rules your operations lead writes once */
  'wyg-marketplaces-multi-sided-platforms-cancellations-disputes-as-stages': Stages,
  /* Operations and trust tools: Operations and trust tools for exceptions, quality checks, payment problems and appeals, with a record of who changed what */
  'wyg-marketplaces-multi-sided-platforms-operations-trust-tools': OpsTools,
  /* Screens your engineers build from: Screens your engineers build from, or Tcules developers coding the screens for each side */
  'wyg-marketplaces-multi-sided-platforms-screens-engineers-build-from': Build,
  /* Who does the work: One senior product designer leads the work and designs for both sides of the market, and an account lead keeps the project moving. Researche */
  'team-marketplaces-multi-sided-platforms': Team,
  /* What we need from you: Time with people on both sides and with your operations team, and the rules you already run on for cancellations, payouts and verification.  */
  'needs-marketplaces-multi-sided-platforms': Needs,
  /* Where our part stops: Payment providers, fraud policy and seller verification rules stay with your payments, legal and trust specialists; our design turns their r */
  'stops-marketplaces-multi-sided-platforms': Stops,
};
