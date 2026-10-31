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

/**
 * One suggestion and the row of states it moves through: suggested (provisional, ringed dashed), sourced,
 * accepted by a person, correctable, and recoverable (lit), the route from the suggestion landing there.
 */
function FiveSuggestionStates() {
  return (
    <>
      {/* The suggestion itself. */}
      <Rect x={70} y={30} w={180} h={60} rx={8} className={styles.frame} />
      <C cx={90} cy={50} glyph="stars" />
      <Copy x={106} y={50} w={96} />
      <Copy x={86} y={70} w={120} quiet />
      {/* Its states. Suggested is still provisional: quiet, in a dashed ring. */}
      <Rect x={84} y={116} w={28} h={28} rx={8} className={styles.trailFrame} />
      <rect className={styles.chip} x={90} y={122} width="16" height="16" rx="4" />
      <Glyph name="stars" cx={98} cy={130} size={10} className={styles.glyphQuiet} />
      <Chips cx={154} cy={130} glyphs={['document-text', 'user', 'ruler-pen']} />
      {/* Recoverable: the state that is lit. */}
      <Rect x={196} y={116} w={28} h={28} rx={8} className={styles.halo} />
      <rect className={styles.solid} x={202} y={122} width="16" height="16" rx="4" />
      <Glyph name="undo-left" cx={210} cy={130} size={10} className={styles.glyphOn} />
      <path className={styles.line} d="M210,90 L210,109" />
      <path className={styles.solid} d="M210,116 L206,109 L214,109 Z" />
      <circle className={styles.node} cx="210" cy="90" r="2.5" />
    </>
  );
}

/** The same mark on AI work on every screen: a document, a table and a chat, each AI part carrying it. */
function OneLabellingRule() {
  return (
    <>
      {/* A document: the person's lines, then the AI's paragraph, marked. */}
      <Rect x={30} y={40} w={76} h={100} rx={8} className={styles.frame} />
      <Copy x={42} y={56} w={32} quiet />
      <Copy x={42} y={68} w={52} />
      <Copy x={42} y={80} w={40} />
      <Rect x={38} y={94} w={60} h={32} rx={4} className={styles.halo} />
      <C cx={52} cy={110} glyph="stars" />
      <path className={styles.regionCopy} d="M66,106 L88,106" />
      <path className={styles.regionCopy} d="M66,114 L80,114" />
      {/* A table: the person's rows, one row the AI filled, marked. */}
      <Rect x={122} y={40} w={76} h={100} rx={8} className={styles.frame} />
      <Copy x={134} y={56} w={32} quiet />
      <path className={styles.hair} d="M122,68 L198,68 M122,88 L198,88 M122,116 L198,116" />
      <Copy x={134} y={78} w={44} />
      <Rect x={130} y={92} w={60} h={20} rx={4} className={styles.halo} />
      <C cx={142} cy={102} glyph="stars" />
      <path className={styles.regionCopy} d="M156,102 L180,102" />
      <Copy x={134} y={128} w={36} />
      {/* A chat: the person's message, then the AI's reply, marked. */}
      <Rect x={214} y={40} w={76} h={100} rx={8} className={styles.frame} />
      <Rect x={242} y={52} w={36} h={16} rx={8} className={styles.tile} />
      <Rect x={222} y={78} w={60} h={34} rx={4} className={styles.halo} />
      <C cx={236} cy={95} glyph="stars" />
      <path className={styles.regionCopy} d="M250,91 L272,91" />
      <path className={styles.regionCopy} d="M250,99 L266,99" />
      <Rect x={242} y={120} w={36} h={12} rx={6} className={styles.tile} />
    </>
  );
}

/** One button press changes one detail: the long draft, "shorter" pressed, the same draft come back short. */
function ButtonsCommonFixes() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <C cx={50} cy={50} glyph="stars" />
      <Copy x={42} y={72} w={92} />
      <Copy x={42} y={84} w={96} />
      <Copy x={42} y={96} w={80} quiet />
      {/* The fix buttons, the first pressed. */}
      <Rect x={38} y={110} w={40} h={26} rx={10} className={styles.halo} />
      <Rect x={44} y={116} w={28} h={14} rx={7} className={styles.solid} />
      {[82, 114].map((x) => (
        <Rect key={x} x={x} y={116} w={28} h={14} rx={7} className={styles.tile} />
      ))}
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <C cx={210} cy={70} glyph="stars" />
      <Copy x={202} y={92} w={56} />
      <Copy x={202} y={104} w={36} quiet />
    </>
  );
}

/** The person's edit with its reason, and the AI's version kept beside it. */
function OverridesKeepRecord() {
  return (
    <>
      {/* The AI's version, kept. */}
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Glyph name="stars" cx={50} cy={60} size={14} className={styles.glyphQuiet} />
      <Copy x={42} y={80} w={64} quiet />
      <Copy x={42} y={92} w={72} quiet />
      <Copy x={42} y={104} w={56} quiet />
      <Copy x={42} y={116} w={64} quiet />
      <path className={styles.trail} d="M130,90 L170,90" />
      {/* The person's version: the line they changed, and the short reason under it. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Glyph name="user" cx={190} cy={50} size={14} className={styles.glyph} />
      <Copy x={182} y={70} w={72} />
      <Rect x={178} y={80} w={104} h={20} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M188,90 L250,90" />
      <Copy x={182} y={110} w={60} />
      <path className={styles.rule} d="M170,122 L290,122" />
      <C cx={190} cy={136} glyph="chat-round-dots" />
      <Copy x={206} y={136} w={52} quiet />
      {/* The trail's open ports, drawn over both card edges. */}
      <circle className={styles.nodeOpen} cx="130" cy="90" r="2.5" />
      <circle className={styles.nodeOpen} cx="170" cy="90" r="2.5" />
    </>
  );
}

/** After a mistake, one message for each case, each with the one rescue the system can deliver. */
function RecoveryMessages() {
  const msgs: [number, IconName][] = [
    [50, 'undo-left'],
    [90, 'refresh'],
    [130, 'chat-round-dots'],
  ];
  return (
    <>
      {/* The mistake. */}
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="close-circle" cx={60} cy={90} size={24} className={styles.glyph} />
      <path className={styles.line} d="M90,90 L163,90" />
      <path className={styles.line} d="M130,90 L130,56 A6,6 0 0 1 136,50 L163,50" />
      <path className={styles.line} d="M130,90 L130,124 A6,6 0 0 0 136,130 L163,130" />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <circle className={styles.node} cx="130" cy="90" r="3.5" />
      {msgs.map(([cy, glyph]) => (
        <g key={cy}>
          <ArrowRight x={170} y={cy} />
          <Rect x={170} y={cy - 15} w={120} h={30} rx={8} className={styles.frame} />
          <Copy x={182} y={cy - 4} w={52} />
          <Copy x={182} y={cy + 4} w={36} quiet />
          <C cx={270} cy={cy} glyph={glyph} />
        </g>
      ))}
    </>
  );
}

/** The person meets the flawed suggestion, spots it, takes it back, and carries on: the tick. */
function TestMomentAfterWrong() {
  return (
    <>
      <Rect x={30} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={60} cy={90} size={24} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      {/* The suggestion with its wrong line spotted, and the undo pressed. */}
      <Rect x={130} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <C cx={150} cy={60} glyph="stars" />
      <Glyph name="danger-triangle" cx={148} cy={84} size={14} className={styles.glyph} />
      <Copy x={162} y={84} w={34} quiet />
      <Copy x={142} y={100} w={52} />
      <Rect x={142} y={114} w={36} h={14} rx={7} className={styles.solid} />
      <Glyph name="undo-left" cx={160} cy={121} size={10} className={styles.glyphOn} />
      <Hop x1={210} x2={248} y={90} />
      <Focus x={272} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/* ── The three terms ──────────────────────────────────────────────────────────── */

/**
 * Who does the work: the senior product designer (lit) and the account lead, starting from the outputs
 * the users sign, send or pay for, each routed into the team.
 */
function Team() {
  const outputs: [number, IconName][] = [
    [50, 'document-text'],
    [90, 'square-arrow-right-up'],
    [130, 'wallet'],
  ];
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {outputs.map(([cy, glyph]) => (
        <g key={cy}>
          <Rect x={216} y={cy - 14} w={70} h={28} rx={8} className={styles.frame} />
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={250} y={cy} w={26} quiet />
          <Hop x1={216} x2={180} y={cy} />
        </g>
      ))}
    </>
  );
}

/**
 * What we need: the feature and what it produces; what the system can genuinely reverse (lit); the
 * tickets and feedback. Three routes into one trunk, ending at our work, waiting on them.
 */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Chips cx={80} cy={50} glyphs={['stars', 'document-text']} />
      <Focus x={80} y={90} glyph="undo-left" size={12} />
      <Chips cx={80} cy={130} glyphs={['checklist', 'chat-round-dots']} />
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

/** What stays theirs, one row on their panel: its chips, then a heading line and a quiet one. */
function Theirs({ cy, glyphs }: { cy: number; glyphs: readonly IconName[] }) {
  const n = glyphs.length;
  const x = 236 + 20 * (n - 1);
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

/**
 * Where our part stops: the controls designed, the one that depends on their engineers left dashed,
 * checked; model quality, tool permissions and technical rollback stay on their panel.
 */
function Stops() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={66} glyph="stars" />
      <Copy x={42} y={86} w={48} />
      <Copy x={42} y={98} w={32} quiet />
      <Rect x={42} y={108} w={24} h={12} rx={6} className={styles.tile} />
      {/* The control that depends on them, said plainly: drawn but not ours to make work. */}
      <Rect x={72} y={108} w={24} h={12} rx={6} className={styles.trailFrame} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['cpu']} />
      <Theirs cy={90} glyphs={['key']} />
      <Theirs cy={130} glyphs={['server', 'undo-left']} />
    </>
  );
}

/**
 * /services/ai-product-ux/trust-control-recovery · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Five suggestion states.: Suggested and provisional, apart from the user's own work; supported, with its sources one click away; accepted, with who accepted it and wh */
  'wyg-trust-control-recovery-five-suggestion-states': FiveSuggestionStates,
  /* One labelling rule.: AI and human work marked apart with the same colour or mark everywhere in the product. */
  'wyg-trust-control-recovery-one-labelling-rule': OneLabellingRule,
  /* Buttons for common fixes.: Shorter, more formal or a wrong name each get a control, so users stop re-prompting to change one detail. */
  'wyg-trust-control-recovery-buttons-common-fixes': ButtonsCommonFixes,
  /* Overrides that keep a record.: A direct edit or a choice of alternatives, a short reason when someone else relies on the result, and the AI's version kept beside it. */
  'wyg-trust-control-recovery-overrides-keep-record': OverridesKeepRecord,
  /* Recovery messages.: One for each thing that can be true after a mistake, each offering only a rescue your system can deliver. */
  'wyg-trust-control-recovery-recovery-messages': RecoveryMessages,
  /* A test of the moment after a wrong answer.: We watch users meet a flawed suggestion, spot it and recover, because that moment decides whether they keep using the feature. */
  'wyg-trust-control-recovery-test-moment-after-wrong': TestMomentAfterWrong,
  /* Who does the work: Your main contact is the senior product designer doing the work, who begins with the outputs your users sign, send or pay for. An account le */
  'team-trust-control-recovery': Team,
  /* What we need from you: The feature itself, what it produces, what your system can genuinely reverse, and any tickets or feedback about it. */
  'needs-trust-control-recovery': Needs,
  /* Where our part stops: Model quality, tool permissions and technical rollback stay with your engineers, and we say plainly where a control depends on them. For a r */
  'stops-trust-control-recovery': Stops,
};
