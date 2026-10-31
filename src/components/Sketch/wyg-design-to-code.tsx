import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, Copy, Cursor, Hop, Rect } from './offer';
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

/** The one screen Figma shows, opened out into the six versions it left out, each designed. */
function MissingStatesDesigned() {
  const states: [number, number, IconName][] = [
    [174, 65, 'database'],
    [220, 65, 'document-text'],
    [266, 65, 'danger-triangle'],
    [174, 115, 'clock-circle'],
    [220, 115, 'lock'],
    [266, 115, 'smartphone'],
  ];
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={42} y={64} w={32} quiet />
      <Copy x={42} y={76} w={52} />
      <Rect x={42} y={88} w={56} h={20} className={styles.tile} />
      <Copy x={42} y={118} w={40} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={40} w={140} h={100} rx={12} className={styles.halo} />
      {states.map(([cx, cy, glyph]) => (
        <g key={glyph}>
          <Rect x={cx - 18} y={cy - 19} w={36} h={38} rx={6} className={styles.frame} />
          <Glyph name={glyph} cx={cx} cy={cy} size={14} className={styles.glyph} />
        </g>
      ))}
    </>
  );
}

/** Every part of the screen points down to a building block in your library; the one new block, agreed, lit. */
function EachPartMappedComponents() {
  const cols = [70, 130, 190, 250];
  return (
    <>
      <Rect x={30} y={30} w={260} h={60} rx={8} className={styles.frame} />
      {/* The screen's parts: a heading, a picture, a list, an action. */}
      <Rect x={48} y={46} w={44} h={28} className={styles.tile} />
      <Copy x={56} y={56} w={28} />
      <Copy x={56} y={64} w={18} quiet />
      <Rect x={108} y={46} w={44} h={28} className={styles.tile} />
      <Rect x={116} y={52} w={28} h={16} rx={3} className={styles.frame} />
      <Rect x={168} y={46} w={44} h={28} className={styles.tile} />
      <Copy x={176} y={54} w={28} quiet />
      <Copy x={176} y={60} w={20} quiet />
      <Copy x={176} y={66} w={24} quiet />
      <Rect x={228} y={46} w={44} h={28} className={styles.tile} />
      <Rect x={236} y={54} w={28} h={12} rx={6} className={styles.frame} />
      {/* Your component library, one block under each part. */}
      <Rect x={30} y={110} w={260} h={40} rx={8} className={styles.tile} />
      <Rect x={222} y={116} w={56} h={32} rx={10} className={styles.halo} />
      {cols.map((x) => (
        <g key={x}>
          <path className={styles.line} d={`M${x},90 L${x},103`} />
          <ArrowDown x={x} y={110} />
          <circle className={styles.node} cx={x} cy={90} r="2.5" />
          <Rect
            x={x - 22}
            y={122}
            w={44}
            h={20}
            className={x === 250 ? styles.region : styles.frame}
          />
        </g>
      ))}
      <Copy x={56} y={132} w={28} />
      <Rect x={116} y={126} w={28} h={12} rx={3} className={styles.tile} />
      <Copy x={176} y={132} w={28} quiet />
      <Rect x={236} y={126} w={28} h={12} rx={6} className={styles.frame} />
    </>
  );
}

/** One detail measured and locked; everything else on the screen left for engineering to choose. */
function WhatMustStayExact() {
  return (
    <>
      <Rect x={80} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={96} y={46} w={56} />
      {/* The open parts, dashed: engineering chooses these. */}
      <Rect x={96} y={60} w={128} h={20} className={styles.trailFrame} />
      {/* The measurement over the one fixed part. */}
      <path className={styles.hair} d="M96,86 L96,94 M96,90 L160,90 M160,86 L160,94" />
      <Rect x={96} y={100} w={64} h={20} rx={10} className={styles.region} />
      <Focus x={184} y={110} glyph="lock" size={11} />
      <path className={styles.trail} d="M96,134 L168,134" />
    </>
  );
}

/** The design annotated: each part's note written out beside it, with the other states' screens stacked behind. */
function BuildableSpec() {
  const notes = [61, 94, 127];
  return (
    <>
      {/* The other states' screens behind, so the spec reads as every state annotated. */}
      <Rect x={30} y={30} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={38} y={38} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Rect x={46} y={46} w={100} h={100} rx={8} className={styles.frame} />
      <Rect x={58} y={54} w={56} h={14} className={styles.tile} />
      <Rect x={58} y={76} w={72} h={36} className={styles.tile} />
      <Rect x={58} y={120} w={40} h={14} rx={7} className={styles.tile} />
      {notes.map((y) => (
        <g key={y}>
          <path className={styles.line} d={`M146,${y} L190,${y}`} />
          <circle className={styles.nodeOpen} cx={146} cy={y} r="3" />
          <Rect x={190} y={y - 14} w={100} h={28} rx={8} className={styles.frame} />
          <circle className={styles.node} cx={190} cy={y} r="2.5" />
          <Copy x={204} y={y - 4} w={64} />
          <Copy x={204} y={y + 4} w={44} quiet />
        </g>
      ))}
    </>
  );
}

/** The hardest interaction, coded and running beside its code, shown to the developers. */
function WorkingExample() {
  const code: [number, number, number][] = [
    [46, 42, 40],
    [58, 50, 28],
    [70, 50, 38],
    [82, 42, 34],
    [94, 42, 22],
    [106, 50, 32],
    [118, 50, 26],
    [130, 42, 36],
  ];
  return (
    <>
      <Rect x={30} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M100,30 L100,150" />
      {code.map(([y, x, w]) => (
        <Copy key={y} x={x} y={y} w={w} quiet />
      ))}
      {/* The behaviour: one row picked up and moved into its new place. */}
      <Rect x={116} y={48} w={70} h={20} className={styles.tile} />
      <Rect x={116} y={76} w={70} h={20} className={styles.trailFrame} />
      <Rect x={116} y={116} w={70} h={20} className={styles.tile} />
      <Rect x={128} y={88} w={70} h={20} className={styles.liftUnder} />
      <Rect x={126} y={86} w={70} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M136,96 L170,96" />
      <Cursor x={176} y={92} />
      <Hop x1={210} x2={244} y={90} />
      <Glyph name="users-group-rounded" cx={266} cy={90} size={24} className={styles.glyph} />
    </>
  );
}

/** Our code lands inside your codebase, and goes in with your developers' review. */
function CodeInProduct() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <C cx={50} cy={70} glyph="code" />
      <Copy x={42} y={92} w={44} quiet />
      <Copy x={50} y={104} w={36} quiet />
      <Copy x={42} y={116} w={28} quiet />
      <Hop x1={110} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M194,30 L194,150" />
      {(
        [
          [46, 206, 56],
          [58, 214, 44],
          [114, 214, 52],
          [126, 206, 40],
          [138, 206, 60],
        ] as const
      ).map(([y, x, w]) => (
        <Copy key={y} x={x} y={y} w={w} quiet />
      ))}
      <Rect x={200} y={74} w={84} h={32} className={styles.region} />
      <path className={styles.regionCopy} d="M208,84 L248,84 M208,96 L238,96" />
      <Glyph name="clipboard-check" cx={268} cy={90} size={14} className={styles.glyphAccent} />
    </>
  );
}

/** A developer's question answered while the build is still going up. */
function AnswersDuringBuild() {
  return (
    <>
      {/* The developer, with the question. */}
      <Rect x={30} y={40} w={80} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={58} cy={70} size={20} className={styles.glyph} />
      <Glyph name="question-circle" cx={86} cy={70} size={16} className={styles.glyphQuiet} />
      {/* Us, answering. */}
      <Rect x={210} y={40} w={80} h={60} rx={8} className={styles.frame} />
      <Focus x={250} y={70} glyph="chat-round-dots" size={12} />
      <path className={styles.line} d="M210,70 L117,70" />
      <ArrowLeft x={110} y={70} />
      <circle className={styles.node} cx={210} cy={70} r="2.5" />
      {/* The build, part done, the rest still to come. */}
      <Rect x={30} y={120} w={150} h={20} className={styles.tile} />
      <Copy x={42} y={130} w={64} quiet />
      <Hatched x={186} y={120} w={104} h={20} />
    </>
  );
}

/* ── Who does the work ──────────────────────────────────────────────────────────── */

/** Design engineers (lit) and the account lead who agrees the handover; the designer of the screens, ours or yours, alongside. */
function TeamDesignToCode() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <C cx={96} cy={66} glyph="code" />
      <Copy x={112} y={62} w={48} />
      <Copy x={112} y={72} w={32} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <C cx={96} cy={114} glyph="document-text" />
      <Copy x={112} y={110} w={48} />
      <Copy x={112} y={120} w={32} quiet />
      {/* The designer who made the screens: ours or yours, so two cards. */}
      <Rect x={220} y={72} w={70} h={28} rx={8} className={styles.frameQuiet} />
      <Rect x={216} y={76} w={70} h={28} rx={8} className={styles.frame} />
      <Glyph name="user" cx={234} cy={90} size={16} className={styles.glyph} />
      <Copy x={250} y={90} w={26} quiet />
      <Hop x1={216} x2={180} y={90} />
    </>
  );
}

/* ── What we need from you ──────────────────────────────────────────────────────── */

/** The Figma designs (lit), the component library and codebase access, time with the developers for a walkthrough. */
function NeedsDesignToCode() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <Focus x={80} y={56} glyph="monitor" size={12} />
      <C cx={66} cy={90} glyph="widget" />
      <C cx={94} cy={90} glyph="key" />
      <C cx={66} cy={130} glyph="users-group-rounded" />
      <C cx={94} cy={130} glyph="calendar" />
      <path className={styles.line} d="M130,56 L144,56 A6,6 0 0 1 150,62 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {[56, 90, 130].map((y) => (
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

/** Our handover (spec, example, code), checked; the codebase and the call on what is merged stay theirs. */
function StopsDesignToCode() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      {(
        [
          [70, 'document-text', 36],
          [90, 'play', 28],
          [110, 'code', 32],
        ] as const
      ).map(([cy, glyph, w]) => (
        <g key={glyph}>
          <C cx={50} cy={cy} glyph={glyph} />
          <Copy x={64} y={cy} w={w} quiet />
        </g>
      ))}
      <Hop x1={110} x2={136} y={90} />
      <Rect x={136} y={64} w={52} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Where our part stops: nothing crosses this line. */}
      <path className={styles.trail} d="M194,30 L194,150" />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Glyph name="user" cx={245} cy={50} size={18} className={styles.glyph} />
      <Theirs cy={90} glyph="code" />
      <Theirs cy={130} glyph="clipboard-check" />
    </>
  );
}

/**
 * /services/design-engineering/design-to-code · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* The missing states, designed.: Empty, long, failed, slow, restricted and small-screen versions of each screen, before the build starts. */
  'wyg-design-to-code-missing-states-designed': MissingStatesDesigned,
  /* Each part mapped to your components.: Every piece of the screen points to a building block you already have, or a new one agreed with your team. */
  'wyg-design-to-code-each-part-mapped-components': EachPartMappedComponents,
  /* What must stay exact, marked.: Which details are fixed and which engineering is free to choose, so your team spends less time going back and forth. */
  'wyg-design-to-code-what-must-stay-exact': WhatMustStayExact,
  /* A buildable spec: A buildable spec, if your team has frontend time: annotated designs covering every state. */
  'wyg-design-to-code-buildable-spec': BuildableSpec,
  /* A working example: A working example, for interactions easier to show than describe: a coded version of the hardest part, so developers watch the behaviour ins */
  'wyg-design-to-code-working-example': WorkingExample,
  /* Code in your product: Code in your product, if you are short of frontend time: React or other frontend code written by our design engineers in your codebase, merg */
  'wyg-design-to-code-code-product': CodeInProduct,
  /* Answers during the build.: We answer developers' questions while they build and review what ships, unless you prefer a clean handover. */
  'wyg-design-to-code-answers-during-build': AnswersDuringBuild,
  /* Who does the work: Design engineers, working with the designer who made the screens, ours or yours. An account lead agrees the handover format with you before  */
  'team-design-to-code': TeamDesignToCode,
  /* What we need from you: The Figma designs, your component library, codebase access if we are writing code, and time with the developers who will build it for a walk */
  'needs-design-to-code': NeedsDesignToCode,
  /* Where our part stops: Your developers own the codebase and decide what is merged. For a whole interface built to an agreed design, see Frontend Development. */
  'stops-design-to-code': StopsDesignToCode,
};
