import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
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

/** The one arrowhead pointing left, in the quiet ink: a route not taken now. */
function QuietLeft({ x, y }: { x: number; y: number }) {
  return <path className={styles.quietMark} d={`M${x},${y} L${x + 7},${y - 4} L${x + 7},${y + 4} Z`} />;
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

/**
 * Review triggers: four reasons (a costly action, a policy rule, missing information, an unusual
 * result) each route the item to the one person.
 */
function ReviewTriggers() {
  const triggers = [
    [90, 'wallet'],
    [130, 'shield-check'],
    [170, 'question-circle'],
    [210, 'danger-triangle'],
  ] as const;
  return (
    <>
      {triggers.map(([cx, glyph]) => (
        <g key={cx}>
          <Rect x={cx - 16} y={38} w={32} h={32} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={cx} cy={54} size={18} className={styles.glyph} />
        </g>
      ))}
      {/* Every trigger drops to the one route. */}
      <path
        className={styles.line}
        d="M90,70 L90,84 A6,6 0 0 0 96,90 L204,90 A6,6 0 0 0 210,84 L210,70 M130,70 L130,84 A6,6 0 0 0 136,90 M170,70 L170,84 A6,6 0 0 1 164,90"
      />
      {triggers.map(([cx]) => (
        <circle key={cx} className={styles.node} cx={cx} cy={70} r="2.5" />
      ))}
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      <path className={styles.line} d="M150,90 L150,105" />
      <ArrowDown x={150} y={112} />
      <Focus x={150} y={130} glyph="user" size={13} />
    </>
  );
}

/**
 * The review card: the proposal, what it rests on, what is missing and what approval changes, read
 * top to bottom, the reading path ending on the approval.
 */
function ReviewCard() {
  return (
    <>
      <Rect x={90} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {/* The proposal. */}
      <Rect x={122} y={40} w={96} h={20} rx={4} className={styles.region} />
      <Glyph name="stars" cx={134} cy={50} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M146,50 L200,50" />
      {/* What it was based on. */}
      <Glyph name="document-text" cx={134} cy={70} size={12} className={styles.glyph} />
      <Copy x={146} y={70} w={44} quiet />
      {/* What is missing. */}
      <Glyph name="question-circle" cx={134} cy={90} size={12} className={styles.glyphQuiet} />
      <Hatched x={146} y={85} w={52} h={10} />
      {/* What approval will change. */}
      <Glyph name="arrow-right" cx={134} cy={110} size={12} className={styles.glyph} />
      <Copy x={146} y={110} w={56} />
      {/* The reader's path down the card, ending on the approval. */}
      <path className={styles.line} d="M110,50 L110,124 A6,6 0 0 0 116,130 L139,130" />
      <circle className={styles.node} cx="110" cy="50" r="2.5" />
      <ArrowRight x={146} y={130} />
      <Rect x={150} y={124} w={40} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/** What the reviewer can do: one item, six answers to it, approve lit. */
function WhatReviewerCanDo() {
  const actions = [
    [164, 46, 'check-circle'],
    [228, 46, 'ruler-pen'],
    [164, 78, 'close-circle'],
    [228, 78, 'question-circle'],
    [164, 110, 'undo-left'],
    [228, 110, 'arrow-right-up'],
  ] as const;
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={70} glyph="stars" />
      <Copy x={42} y={92} w={52} />
      <Copy x={42} y={104} w={36} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={34} w={140} h={112} rx={8} className={styles.frameQuiet} />
      {actions.map(([x, y, glyph], i) => (
        <g key={glyph}>
          <Rect
            x={x}
            y={y}
            w={56}
            h={24}
            rx={12}
            className={i === 0 ? styles.solid : styles.tile}
          />
          <Glyph
            name={glyph}
            cx={x + 14}
            cy={y + 12}
            size={12}
            className={i === 0 ? styles.glyphOn : styles.glyph}
          />
          <path
            className={i === 0 ? styles.tick : styles.copyQuiet}
            d={`M${x + 26},${y + 12} L${x + 44},${y + 12}`}
          />
        </g>
      ))}
    </>
  );
}

/**
 * Routing and the queue: the followed item went to the first desk and nobody picked it up there (dashed,
 * only its clock, run out); the same item goes on from that desk to the person who does, while the
 * asker sees its status.
 */
function RoutingQueue() {
  return (
    <>
      <Rect x={60} y={50} w={80} h={80} rx={8} className={styles.tile} />
      {[70, 110].map((y) => (
        <g key={y}>
          <Rect x={72} y={y - 7} w={56} h={14} rx={4} className={styles.frameQuiet} />
          <Copy x={80} y={y} w={32} quiet />
        </g>
      ))}
      {/* The item being followed, in the middle of the queue. */}
      <Rect x={72} y={83} w={56} h={14} rx={4} className={styles.frame} />
      <Copy x={80} y={90} w={36} />
      {/* The desk nobody answered: up once to it, empty but for its clock, run out. */}
      <path className={styles.trail} d="M140,90 L194,90 A6,6 0 0 0 200,84 L200,73" />
      <circle className={styles.nodeOpen} cx="200" cy="70" r="3" />
      <Rect x={160} y={30} w={80} h={40} rx={8} className={styles.trailFrame} />
      <Glyph name="clock-circle" cx={200} cy={50} size={18} className={styles.glyphQuiet} />
      {/* The same item goes on from the desk, to whoever picks it up. */}
      <path className={styles.line} d="M240,50 L254,50 A6,6 0 0 1 260,56 L260,105" />
      <circle className={styles.node} cx="240" cy="50" r="2.5" />
      <ArrowDown x={260} y={112} />
      <Focus x={260} y={130} glyph="user" size={13} />
      {/* What the asker sees of the waiting item: a quiet branch off its own trail to its status. */}
      <path className={styles.trail} d="M164,90 L164,116 A6,6 0 0 0 170,122 L176,122" />
      <circle className={styles.nodeOpen} cx={164} cy={90} r="2.5" />
      <Rect x={176} y={112} w={50} h={20} rx={10} className={styles.frameQuiet} />
      <Glyph name="eye" cx={188} cy={122} size={12} className={styles.glyphQuiet} />
      <Copy x={198} y={122} w={22} quiet />
    </>
  );
}

/** The record: one entry, kept with the rest, holding the AI's result, the choice, the reason (lit) and the action. */
function Record() {
  const cells = [
    [70, 'stars'],
    [130, 'user'],
    [190, 'chat-round-dots'],
    [250, 'bolt-circle'],
  ] as const;
  return (
    <>
      <Rect x={48} y={46} w={240} h={76} rx={8} className={styles.frameQuiet} />
      <Rect x={44} y={50} w={240} h={76} rx={8} className={styles.frameQuiet} />
      <Rect x={40} y={54} w={240} h={76} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M100,54 L100,130 M160,54 L160,130 M220,54 L220,130" />
      <Rect x={166} y={60} w={48} h={64} rx={4} className={styles.region} />
      {cells.map(([cx, glyph]) => {
        const lit = glyph === 'chat-round-dots';
        return (
          <g key={cx}>
            <Glyph
              name={glyph}
              cx={cx}
              cy={82}
              size={18}
              className={lit ? styles.glyphAccent : styles.glyph}
            />
            <path
              className={lit ? styles.regionCopy : styles.copyQuiet}
              d={`M${cx - 14},${108} L${cx + 14},${108}`}
            />
          </g>
        );
      })}
    </>
  );
}

/**
 * A day's workload: the day holds what one person can judge properly, the riskiest item first (lit)
 * and the routine ones cleared together as one group.
 */
function DaysWorkload() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Chip x={46} y={42} glyph="calendar" />
      <Copy x={70} y={50} w={40} quiet />
      {/* The riskiest, judged first. */}
      <Rect x={60} y={70} w={50} h={64} rx={4} className={styles.region} />
      <Glyph name="danger-triangle" cx={85} cy={92} size={18} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M72,116 L98,116" />
      {/* The next. */}
      <Rect x={130} y={86} w={50} h={48} rx={4} className={styles.frame} />
      <Glyph name="info-circle" cx={155} cy={104} size={16} className={styles.glyph} />
      <Copy x={145} y={122} w={20} quiet />
      {/* The routine ones, cleared as a group. */}
      <Rect x={208} y={94} w={50} h={32} rx={4} className={styles.frameQuiet} />
      <Rect x={204} y={98} w={50} h={32} rx={4} className={styles.frameQuiet} />
      <Rect x={200} y={102} w={50} h={32} rx={4} className={styles.frame} />
      <Glyph name="check-circle" cx={225} cy={118} size={14} className={styles.glyph} />
    </>
  );
}

/**
 * A path to spot checks: a type of work moves from full review (every item ticked) to sampling (one
 * item looked at), and the route back stays open.
 */
function PathSpotChecks() {
  const rows = [54, 78, 102, 126];
  return (
    <>
      {/* Full review: every item checked. */}
      <Rect x={30} y={36} w={80} h={108} rx={8} className={styles.frame} />
      {rows.map((y) => (
        <g key={y}>
          <Copy x={44} y={y} w={32} quiet />
          <Glyph name="check-circle" cx={94} cy={y} size={12} className={styles.glyph} />
        </g>
      ))}
      <Hop x1={110} x2={210} y={70} />
      <path className={styles.trail} d="M210,110 L117,110" />
      <QuietLeft x={110} y={110} />
      {/* Sampling: one item in several looked at. */}
      <Rect x={210} y={36} w={80} h={108} rx={8} className={styles.frame} />
      <Rect x={218} y={68} w={64} h={20} rx={4} className={styles.region} />
      {rows.map((y) =>
        y === 78 ? (
          <g key={y}>
            <path className={styles.regionCopy} d={`M226,${y} L252,${y}`} />
            <Glyph name="eye" cx={270} cy={y} size={12} className={styles.glyphAccent} />
          </g>
        ) : (
          <Copy key={y} x={226} y={y} w={32} quiet />
        ),
      )}
    </>
  );
}

/** A test on past cases: past items loaded into a coded version, a reviewer trying it before the build. */
function TestPastCases() {
  return (
    <>
      {/* The past items, one of many. */}
      <Rect x={32} y={48} w={60} h={68} rx={8} className={styles.frameQuiet} />
      <Rect x={36} y={52} w={60} h={68} rx={8} className={styles.frameQuiet} />
      <Rect x={40} y={56} w={60} h={68} rx={8} className={styles.frame} />
      <Glyph name="clock-circle" cx={56} cy={72} size={14} className={styles.glyphQuiet} />
      <Copy x={52} y={94} w={36} />
      <Copy x={52} y={106} w={24} quiet />
      <Hop x1={100} x2={130} y={90} />
      <Rect x={130} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={142} y={42} glyph="code" />
      <Copy x={166} y={50} w={44} quiet />
      {[72, 96].map((y) => (
        <g key={y}>
          <Rect x={142} y={y - 8} w={116} h={16} rx={4} className={styles.tile} />
          <Glyph name="document-text" cx={152} cy={y} size={10} className={styles.glyph} />
          <Copy x={164} y={y} w={y === 72 ? 52 : 40} quiet />
        </g>
      ))}
      <Rect x={142} y={122} w={44} h={14} rx={7} className={styles.solid} />
      <Cursor x={178} y={130} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/**
 * The senior designer (lit), hands-on from day one with your reviewers, and the account lead; the
 * design engineer joins for the test on past cases (dashed, routed to an open node).
 */
function Team() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.trailFrame} />
      <C cx={234} cy={90} glyph="code" />
      <Copy x={250} y={90} w={26} quiet />
      <path className={styles.trail} d="M216,90 L183,90" />
      <circle className={styles.nodeOpen} cx={180} cy={90} r={3} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The people who review the AI's output (lit), a sample of past items, the rules they work to: one trunk to us. */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={50} glyph="users-group-rounded" size={12} />
      <Sheet cx={80} cy={90} />
      {/* The rules, framed like the sample. */}
      <Rect x={66} y={120} w={28} h={20} rx={4} className={styles.frame} />
      <Glyph name="checklist" cx={80} cy={130} size={12} className={styles.glyph} />
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

/**
 * The review screen, designed, is our last piece (checked); domain policy, legal accountability and
 * the model's acceptance criteria stay on your owners' panel, no route crossing to it.
 */
function Stops() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="monitor" cx={50} cy={66} size={14} className={styles.glyph} />
      <Copy x={42} y={86} w={52} />
      <Copy x={42} y={98} w={36} quiet />
      {/* The designed review screen: approve solid, the other answer outlined. */}
      <Rect x={42} y={110} w={24} h={8} rx={4} className={styles.solid} />
      <Rect x={70} y={110} w={24} h={8} rx={4} className={styles.frame} />
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['notebook']} />
      <Theirs cy={90} glyphs={['shield-check']} />
      <Theirs cy={130} glyphs={['cpu', 'clipboard-check']} />
    </>
  );
}

/**
 * /services/ai-product-ux/human-in-the-loop-workflows · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Review triggers.: Each reason work reaches a person, tied to what a mistake would cost: a costly action, a policy rule, missing information or an unusual resu */
  'wyg-human-in-the-loop-workflows-review-triggers': ReviewTriggers,
  /* The review card.: The AI's proposal, what it was based on, what is missing and what approval will change, in the reviewer's reading path. */
  'wyg-human-in-the-loop-workflows-review-card': ReviewCard,
  /* What the reviewer can do.: Approve, edit, reject, ask for more, overrule with a reason or pass it to someone senior. */
  'wyg-human-in-the-loop-workflows-what-reviewer-can-do': WhatReviewerCanDo,
  /* Routing and the queue.: Who picks an item up, what happens if nobody does, and what the person who asked can see while they wait. */
  'wyg-human-in-the-loop-workflows-routing-queue': RoutingQueue,
  /* The record.: The original AI result, the reviewer's choice, the reason and the action that followed. */
  'wyg-human-in-the-loop-workflows-record': Record,
  /* A day's workload.: How much a person can judge properly in a day, riskiest items first and routine ones cleared in groups. */
  'wyg-human-in-the-loop-workflows-days-workload': DaysWorkload,
  /* A path to spot checks.: The rules for moving a type of work from full review to sampling, and back again. */
  'wyg-human-in-the-loop-workflows-path-spot-checks': PathSpotChecks,
  /* A test on past cases.: A coded version loaded with a sample of past items, so your reviewers try it before the build. */
  'wyg-human-in-the-loop-workflows-test-past-cases': TestPastCases,
  /* Who does the work: The lead is a senior product designer, hands-on from the first day, who starts by sitting with your reviewers to learn what they check and a */
  'team-human-in-the-loop-workflows': Team,
  /* What we need from you: Access to the people who review the AI's output, a sample of past items, and the rules or standards they work to. */
  'needs-human-in-the-loop-workflows': Needs,
  /* Where our part stops: Domain policy, legal accountability and the model's acceptance criteria stay with your qualified owners; we design the screens that carry th */
  'stops-human-in-the-loop-workflows': Stops,
};
