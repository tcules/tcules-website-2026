import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/** A chip centred at (cx, cy). */
const C = ({ cx, cy, glyph }: { cx: number; cy: number; glyph: IconName }) => (
  <Chip x={cx - 8} y={cy - 8} glyph={glyph} />
);

/** A small framed step on a path, centred at (cx, 90), its glyph inside. */
function Step({ cx, glyph }: { cx: number; glyph: IconName }) {
  return (
    <>
      <Rect x={cx - 20} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name={glyph} cx={cx} cy={90} size={20} className={styles.glyph} />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** A first working result: one path from sign-up, through the key and the code sample, to a result that works. */
function FirstWorkingResult() {
  return (
    <>
      <Step cx={50} glyph="user" />
      <Step cx={130} glyph="key" />
      <Step cx={210} glyph="code-square" />
      <TraceIn d="M70,90 L110,90 M150,90 L190,90 M230,90 L241,90" />
      {[70, 110, 150, 190, 230].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy={90} r="2.5" />
      ))}
      <ArrowRight x={248} y={90} />
      <Focus x={272} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/** Documentation beside the work: the work and its docs in one window, the usage meter under the docs. */
function DocumentationBesideWork() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M56,30 L56,150" />
      {(
        [
          [50, 68, 128],
          [62, 76, 144],
          [74, 76, 120],
          [86, 68, 136],
          [110, 68, 124],
          [122, 76, 148],
          [134, 68, 112],
        ] as const
      ).map(([y, x1, x2]) => (
        <Copy key={y} x={x1} y={y} w={x2 - x1} quiet />
      ))}
      {/* The docs, open beside the work. */}
      <Rect x={170} y={42} w={108} h={96} rx={4} className={styles.region} />
      <C cx={190} cy={62} glyph="notebook" />
      <path className={styles.regionCopy} d="M206,62 L258,62" />
      <path className={styles.regionCopy} d="M182,82 L262,82" />
      <path className={styles.regionCopy} d="M182,94 L242,94" />
      {/* Usage against its limit. */}
      <Rect x={182} y={114} w={84} h={8} rx={4} className={styles.tile} />
      <Rect x={182} y={114} w={52} h={8} rx={4} className={styles.solid} />
      <path className={styles.rule} d="M250,110 L250,126" />
    </>
  );
}

/** A written split: each step written in two columns, what the system proposes and what a person approves. */
function WrittenSplit() {
  return (
    <>
      <Rect x={50} y={30} w={220} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M160,30 L160,150 M50,66 L270,66" />
      <C cx={74} cy={48} glyph="stars" />
      <C cx={184} cy={48} glyph="user" />
      {(
        [
          [86, 64, 48],
          [108, 56, 40],
          [130, 60, 52],
        ] as const
      ).map(([y, w1, w2]) => (
        <g key={y}>
          <Copy x={66} y={y} w={w1} quiet />
          <Rect x={176} y={y - 6} w={12} h={12} rx={3} className={styles.solid} />
          <path className={styles.tick} d={`M179,${y} L181.5,${y + 2.5} L185,${y - 2.5}`} />
          <Copy x={200} y={y} w={w2} />
        </g>
      ))}
    </>
  );
}

/** Sources and limits: the line of an answer that cites, linked to the source it came from. */
function SourcesLimits() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <C cx={50} cy={50} glyph="stars" />
      <Copy x={66} y={50} w={48} quiet />
      <Copy x={46} y={70} w={96} />
      <Rect x={42} y={82} w={116} h={16} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M52,90 L130,90" />
      <Copy x={46} y={110} w={84} />
      {/* What it cannot answer, said plainly. */}
      <Glyph name="info-circle" cx={52} cy={132} size={12} className={styles.glyphQuiet} />
      <Copy x={64} y={132} w={56} quiet />
      {/* The source it came from. */}
      <Hop x1={170} x2={206} y={90} />
      <Rect x={206} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="document-text" cx={228} cy={70} size={16} className={styles.glyphAccent} />
      <Copy x={242} y={70} w={30} quiet />
      <Copy x={218} y={94} w={56} />
      <Copy x={218} y={106} w={44} quiet />
    </>
  );
}

/** Prototypes tested: a clickable prototype, tried by your users and your engineers. */
function PrototypesTested() {
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={50} w={40} quiet />
      <Copy x={46} y={66} w={80} />
      <Copy x={46} y={78} w={60} quiet />
      <Rect x={40} y={100} w={60} h={28} rx={14} className={styles.halo} />
      <Rect x={46} y={106} w={48} h={16} rx={8} className={styles.solid} />
      <Cursor x={84} y={116} />
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      {(
        [
          [70, 'user'],
          [110, 'code'],
        ] as const
      ).map(([y, glyph]) => (
        <g key={y}>
          <C cx={210} cy={y} glyph={glyph} />
          <Copy x={226} y={y} w={28} />
          <path className={styles.line} d={`M262,${y} L265,${y + 3} L271,${y - 3}`} />
        </g>
      ))}
    </>
  );
}

/** Specs your developers build from: the spec, measured, handed to the code that is built from it. */
function SpecsDevelopersBuildFrom() {
  return (
    <>
      <Rect x={38} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={38} w={100} h={112} rx={8} className={styles.frame} />
      <C cx={50} cy={58} glyph="ruler-pen" />
      <Copy x={66} y={58} w={40} quiet />
      <Rect x={46} y={78} w={68} h={24} rx={4} className={styles.tile} />
      {/* Its measure, ends marked. */}
      <path className={styles.rule} d="M46,112 L114,112 M46,108 L46,116 M114,108 L114,116" />
      <Copy x={46} y={128} w={52} />
      <Copy x={46} y={138} w={36} quiet />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M196,30 L196,150" />
      {[50, 62, 74, 86, 98].map((y, i) => (
        <Copy key={y} x={208} y={y} w={[48, 64, 40, 56, 32][i] ?? 40} quiet={i % 2 === 0} />
      ))}
      <Focus x={262} y={124} glyph="code" size={12} />
    </>
  );
}

/* ── The terms ─────────────────────────────────────────────────────────────── */

const ROWS = [50, 90, 130] as const;

/** Who does the work: the senior designer (lit) and the account lead; design engineers in the team, developers joining if we build. */
function Team() {
  const roles = [
    { cy: 70, glyph: 'code', core: true },
    { cy: 110, glyph: 'server', core: false },
  ] as const;
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <Copy x={90} y={62} w={60} />
      <Copy x={90} y={72} w={40} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {roles.map(({ cy, glyph, core }) => (
        <g key={glyph}>
          {core ? (
            <Rect x={220} y={cy - 18} w={70} h={28} rx={8} className={styles.frameQuiet} />
          ) : null}
          <Rect
            x={216}
            y={cy - 14}
            w={70}
            h={28}
            rx={8}
            className={core ? styles.frame : styles.trailFrame}
          />
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={250} y={cy} w={26} quiet />
          {core ? (
            <Hop x1={216} x2={180} y={cy} />
          ) : (
            <>
              <path className={styles.trail} d={`M216,${cy} L183,${cy}`} />
              <circle className={styles.nodeOpen} cx={180} cy={cy} r={3} />
            </>
          )}
        </g>
      ))}
    </>
  );
}

/** What we need from you: the product and its endpoint; early time with the ML engineers (lit); users to watch and the person with the final word. */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={66} cy={50} glyph="monitor" />
      <C cx={94} cy={50} glyph="cpu" />
      <Focus x={80} y={90} glyph="users-group-rounded" size={12} />
      <C cx={66} cy={130} glyph="eye" />
      <C cx={94} cy={130} glyph="user" />
      <path className={styles.line} d="M130,50 L144,50 A6,6 0 0 1 150,56 L150,90" />
      <path className={styles.line} d="M130,130 L144,130 A6,6 0 0 0 150,124 L150,90" />
      <path className={styles.line} d="M130,90 L150,90" />
      {ROWS.map((y) => (
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

/** Where our part stops: the screen that shows people the rules, ours; model and prompts, infrastructure and security, and the legal requirements stay theirs. */
function Stops() {
  return (
    <>
      {/* Ours, lit. */}
      <Rect x={30} y={44} w={116} h={92} rx={12} className={styles.halo} />
      <Rect x={36} y={50} w={104} h={80} rx={8} className={styles.frame} />
      <C cx={56} cy={66} glyph="monitor" />
      {/* The rules, each one checked. */}
      {(
        [
          [94, 56],
          [110, 44],
        ] as const
      ).map(([y, w]) => (
        <g key={y}>
          <Glyph name="check-circle" cx={50} cy={y} size={10} className={styles.glyphAccent} />
          <Copy x={60} y={y} w={w} />
        </g>
      ))}
      {/* Where our part stops. */}
      <path className={styles.trail} d="M170,36 L170,144" />
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      <Theirs cy={50} glyphs={['cpu', 'chat-round-dots']} />
      <Theirs cy={90} glyphs={['server', 'lock']} />
      <Theirs cy={130} glyphs={['checklist']} />
    </>
  );
}

/**
 * /expertise/ai-products-developer-tools · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A first working result: The path from sign-up to a first working result, with keys, code samples and error messages */
  'wyg-ai-products-developer-tools-first-working-result': FirstWorkingResult,
  /* Documentation beside the work: Documentation, previews, consoles, usage and billing views placed beside the work, and the limits people meet as they grow */
  'wyg-ai-products-developer-tools-documentation-beside-work': DocumentationBesideWork,
  /* A written split: For each step, a written split between what the system proposes and what a person checks, edits or approves */
  'wyg-ai-products-developer-tools-written-split': WrittenSplit,
  /* Sources and limits: Results that show their sources and limits, and review screens that keep the original beside any correction */
  'wyg-ai-products-developer-tools-sources-limits': SourcesLimits,
  /* Prototypes tested: Prototypes tested with your users and your engineers, clickable or in code */
  'wyg-ai-products-developer-tools-prototypes-tested': PrototypesTested,
  /* Specs your developers build from: Specs your developers build from, or Tcules developers through AI Product Engineering */
  'wyg-ai-products-developer-tools-specs-developers-build-from': SpecsDevelopersBuildFrom,
  /* Who does the work: The product designer who leads your project is senior and does the design; an account lead keeps it running. Design engineers try uncertain  */
  'team-ai-products-developer-tools': Team,
  /* What we need from you: Your demo, prototype, model endpoint or live product. Early time with your ML engineers on what the system can report: sources, confidence a */
  'needs-ai-products-developer-tools': Needs,
  /* Where our part stops: The model, prompts, evaluations, infrastructure and security stay with your engineers. Where rules such as the EU AI Act apply, your legal t */
  'stops-ai-products-developer-tools': Stops,
};
