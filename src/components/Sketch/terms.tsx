import type { ReactNode } from 'react';

import type { WorkingTermSceneName } from '@/lib/sketches';

import { Team } from './l1-terms';
import { Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/**
 * The WORKING TERMS (owner, 1 Nov 2026, About's "How Tcules works with clients"): six scenes, one per
 * term, each drawn from its own sentence and as one set, so no term borrows How we work together's
 * scope drawings. The flat-graphics grammar throughout (docs/research/flat-graphics-grammar.md):
 * 320 × 180, routes on the axes, one arrowhead, weights 1 and 2, no words, Solar glyphs, one lit
 * focal point.
 *
 *   scope-who              the senior designer lit and the account lead in our frame; the
 *                          specialists who join when the work needs them dashed, their routes open
 *   scope-communication    your own tools on your ground: the design file being worked in, the
 *                          tracker, and the chat where you raise anything with your designer (lit)
 *   scope-response         your enquiry, the reply, and one day between them (the clock lit)
 *   scope-getting-started  a conversation, the proposal, the agreement (the work, the fees, when
 *                          invoices are due), then the work starts (lit)
 *   scope-turnaround       a pilot's stated length (lit), a project run to its scope, month on month
 *   scope-hours            your team's day and ours, the agreed hours they share (the clock lit)
 */

/** Who you work with: the senior designer and the account lead; a researcher and a design-systems specialist join when needed. */
function TermWho() {
  return <Team roles={[{ glyph: 'eye' }, { glyph: 'layers' }]} />;
}

/** Communication: the work happens in your own tools, seen as it happens; the chat to your designer lit. */
function TermCommunication() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.tile} />
      {/* The design file, worked in as you watch. */}
      <Rect x={50} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Chip x={58} y={58} glyph="ruler-pen" />
      <Copy x={82} y={66} w={48} />
      <Copy x={58} y={88} w={76} quiet />
      <Copy x={58} y={100} w={56} quiet />
      <Rect x={58} y={110} w={44} h={12} rx={4} className={styles.soft} />
      <Cursor x={94} y={114} />
      {/* The tracker. */}
      <Rect x={162} y={50} w={56} h={80} rx={8} className={styles.frame} />
      <Chip x={170} y={58} glyph="checklist" />
      {[88, 100, 112].map((y, i) => (
        <g key={y}>
          <Glyph
            name="check-circle"
            cx={174}
            cy={y}
            size={8}
            className={i < 2 ? styles.glyphAccent : styles.glyphQuiet}
          />
          <Copy x={182} y={y} w={26} quiet />
        </g>
      ))}
      {/* The chat, where you raise anything with your senior designer. */}
      <Rect x={230} y={50} w={40} h={80} rx={8} className={styles.frame} />
      <Chip x={238} y={58} glyph="chat-round-dots" />
      <Focus x={250} y={106} glyph="user" size={12} />
    </>
  );
}

/** Response time: your enquiry, the reply, and one business day between them. */
function TermResponse() {
  return (
    <>
      <Rect x={30} y={60} w={80} h={60} rx={8} className={styles.frame} />
      <Chip x={38} y={68} glyph="chat-round-dots" />
      <Copy x={40} y={96} w={52} />
      <Copy x={40} y={106} w={36} quiet />
      <path className={styles.line} d="M110,90 L142,90" />
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <Focus x={160} y={90} glyph="clock-circle" size={12} />
      <Hop x1={178} x2={210} y={90} />
      <Rect x={210} y={60} w={80} h={60} rx={8} className={styles.frame} />
      <Chip x={218} y={68} glyph="undo-left" />
      <Copy x={220} y={96} w={52} />
      <Copy x={220} y={106} w={36} quiet />
      {/* One day, enquiry to reply. */}
      <path
        className={styles.rule}
        d="M110,134 L110,146 M110,140 L150,140 M170,140 L210,140 M210,134 L210,146"
      />
      <Glyph name="calendar" cx={160} cy={140} size={12} className={styles.glyphQuiet} />
    </>
  );
}

/** Getting started: a conversation, the proposal, the agreement, then the work starts. */
function TermGettingStarted() {
  return (
    <>
      <Rect x={30} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="chat-round-dots" cx={50} cy={90} size={16} className={styles.glyph} />
      <path className={styles.line} d="M70,90 L90,90" />
      <circle className={styles.node} cx={70} cy={90} r="2.5" />
      {/* The written proposal. */}
      <Rect x={90} y={56} w={52} h={68} rx={8} className={styles.frame} />
      <Copy x={100} y={70} w={28} />
      <Copy x={100} y={82} w={32} quiet />
      <Copy x={100} y={92} w={24} quiet />
      <Copy x={100} y={102} w={32} quiet />
      <Copy x={100} y={112} w={20} quiet />
      <path className={styles.line} d="M142,90 L162,90" />
      <circle className={styles.node} cx={142} cy={90} r="2.5" />
      {/* The agreement: the work, the fees, when invoices are due. */}
      <Rect x={162} y={56} w={64} h={68} rx={8} className={styles.frame} />
      {(
        [
          ['widget', 72],
          ['wallet', 90],
          ['calendar', 108],
        ] as const
      ).map(([glyph, y]) => (
        <g key={glyph}>
          <Glyph name={glyph} cx={176} cy={y} size={10} className={styles.glyphAccent} />
          <Copy x={186} y={y} w={30} quiet />
        </g>
      ))}
      <Hop x1={226} x2={252} y={90} />
      <Focus x={270} y={90} glyph="play" size={10} />
    </>
  );
}

/** Turnaround: a pilot's length stated before it begins (lit), a project to its scope, ongoing work month to month. */
function TermTurnaround() {
  return (
    <>
      <Chip x={30} y={42} glyph="document-text" />
      <rect className={styles.halo} x={54} y={40} width={112} height={20} rx={10} />
      <Rect x={60} y={46} w={100} h={8} rx={4} className={styles.solid} />
      <path className={styles.rule} d="M166,38 L166,62" />

      <Chip x={30} y={82} glyph="checklist" />
      <Rect x={60} y={86} w={170} h={8} rx={4} className={styles.frame} />
      <Glyph name="check-circle" cx={248} cy={90} size={12} className={styles.glyph} />

      <Chip x={30} y={122} glyph="calendar" />
      {[60, 104, 148, 192].map((x) => (
        <Rect key={x} x={x} y={126} w={40} h={8} rx={4} className={styles.frame} />
      ))}
      <path className={styles.trail} d="M236,130 L283,130" />
      <circle className={styles.nodeOpen} cx={286} cy={130} r={3} />
    </>
  );
}

/** Working hours: your team's day and ours, the hours they share agreed before the work starts. */
function TermHours() {
  return (
    <>
      <rect className={styles.halo} x={130} y={36} width={100} height={108} rx={8} />
      <path className={styles.trail} d="M130,30 L130,150 M230,30 L230,150" />
      <rect className={styles.frameQuiet} x={30} y={40} width={200} height={20} rx={10} />
      <Chip x={34} y={42} glyph="users-group-rounded" />
      <Copy x={60} y={50} w={44} quiet />
      <rect className={styles.region} x={130} y={120} width={160} height={20} rx={10} />
      <Chip x={270} y={122} glyph="user" />
      <path className={styles.regionCopy} d="M244,130 L262,130" />
      <circle className={styles.solid} cx={180} cy={90} r={11} />
      <Glyph name="clock-circle" cx={180} cy={90} size={12} className={styles.glyphOn} />
    </>
  );
}

export const TERMS: Record<WorkingTermSceneName, () => ReactNode> = {
  'scope-who': TermWho,
  'scope-communication': TermCommunication,
  'scope-response': TermResponse,
  'scope-getting-started': TermGettingStarted,
  'scope-turnaround': TermTurnaround,
  'scope-hours': TermHours,
};
