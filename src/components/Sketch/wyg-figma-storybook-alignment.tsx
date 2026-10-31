import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
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

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** Figma and code laid side by side, row matched to row, and the one row that does not match marked. */
function CorrespondenceMap() {
  const rows = [
    [70, 44, 40],
    [90, 36, 48],
    [110, 48, 32],
    [130, 32, 44],
  ] as const;
  return (
    <>
      {/* Figma's component, left; the coded one, right. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Chip x={38} y={38} glyph="ruler-pen" />
      <Copy x={62} y={46} w={32} quiet />
      <Rect x={210} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Chip x={218} y={38} glyph="code" />
      <Copy x={242} y={46} w={32} quiet />
      {rows.map(([y, a, b]) => (
        <g key={y}>
          <Copy x={42} y={y} w={a} />
          <Copy x={222} y={y} w={b} />
        </g>
      ))}
      {/* Matched rows, joined; the gap, broken and marked. */}
      <path className={styles.rule} d="M110,70 L210,70 M110,110 L210,110 M110,130 L210,130" />
      <path className={styles.trail} d="M110,90 L142,90 M178,90 L210,90" />
      <circle className={styles.halo} cx="160" cy="90" r="13" />
      <circle className={styles.solid} cx="160" cy="90" r="9" />
      <Glyph name="danger-triangle" cx={160} cy={90} size={10} className={styles.glyphOn} />
    </>
  );
}

/** One design token, one name, carried into Figma and into code alike. */
function GapsFixed() {
  return (
    <>
      {/* The token: its swatch lit, its name. */}
      <Rect x={30} y={60} w={80} h={60} rx={8} className={styles.frame} />
      <circle className={styles.halo} cx="56" cy="90" r="15" />
      <circle className={styles.solid} cx="56" cy="90" r="9" />
      <Copy x={80} y={86} w={18} />
      <Copy x={80} y={96} w={12} quiet />
      {/* One route, forked: the same token into both libraries. */}
      <path className={styles.line} d="M110,90 L150,90" />
      <path className={styles.line} d="M150,90 L150,56 A6,6 0 0 1 156,50 L183,50" />
      <path className={styles.line} d="M150,90 L150,124 A6,6 0 0 0 156,130 L183,130" />
      <path className={styles.solid} d="M190,50 L183,46 L183,54 Z M190,130 L183,126 L183,134 Z" />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <circle className={styles.node} cx="150" cy="90" r="3.5" />
      {(
        [
          [50, 'ruler-pen'],
          [130, 'code'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <Rect x={190} y={cy - 20} w={100} h={40} rx={8} className={styles.frame} />
          <C cx={210} cy={cy} glyph={glyph} />
          <circle className={styles.soft} cx="236" cy={cy} r="6" />
          <Copy x={250} y={cy - 4} w={18} />
          <Copy x={250} y={cy + 6} w={12} quiet />
        </g>
      ))}
    </>
  );
}

/** One Storybook shelf of every case, which the designer and the developer both look at. */
function StorybookEntry() {
  return (
    <>
      {/* The designer, left, and the developer, right, both routed to the same set. */}
      {(
        [
          [30, 'ruler-pen'],
          [250, 'code'],
        ] as const
      ).map(([x, glyph]) => (
        <g key={x}>
          <Rect x={x} y={62} w={40} h={56} rx={8} className={styles.frame} />
          <Glyph name="user" cx={x + 20} cy={80} size={18} className={styles.glyph} />
          <C cx={x + 20} cy={104} glyph={glyph} />
        </g>
      ))}
      <Hop x1={70} x2={110} y={90} />
      <Hop x1={250} x2={210} y={90} />
      {/* Storybook: the cases as one set. */}
      <Rect x={110} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={122} y={44} w={40} quiet />
      {/* Default. */}
      <Rect x={122} y={54} w={34} h={24} className={styles.frame} />
      <Copy x={128} y={62} w={20} />
      <Copy x={128} y={70} w={14} quiet />
      {/* Loading. */}
      <Rect x={164} y={54} w={34} h={24} className={styles.tile} />
      <Rect x={170} y={60} w={20} h={4} rx={2} className={styles.soft} />
      <Rect x={170} y={68} w={14} h={4} rx={2} className={styles.soft} />
      {/* Empty. */}
      <Rect x={122} y={86} w={34} h={24} className={styles.trailFrame} />
      {/* Error, lit. */}
      <Rect x={164} y={86} w={34} h={24} className={styles.region} />
      <Glyph name="danger-triangle" cx={181} cy={98} size={12} className={styles.glyphAccent} />
      {/* Disabled. */}
      <Rect x={122} y={118} w={34} h={24} className={styles.tile} />
      <Copy x={128} y={130} w={22} quiet />
      {/* Validation. */}
      <Rect x={164} y={118} w={34} h={24} className={styles.frame} />
      <Glyph name="check-circle" cx={181} cy={130} size={12} className={styles.glyph} />
    </>
  );
}

/** What the running component does on focus, written on a note beside the Figma component. */
function BehaviourWritten() {
  return (
    <>
      {/* The running component, its button holding focus (lit). */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Chip x={38} y={58} glyph="code" />
      <Copy x={62} y={66} w={32} quiet />
      <Copy x={46} y={80} w={48} />
      <Rect x={40} y={92} w={52} h={26} rx={13} className={styles.halo} />
      <Rect x={46} y={98} w={40} h={14} rx={7} className={styles.solid} />
      <Hop x1={110} x2={150} y={90} />
      {/* The Figma component, and the note written beside it. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={158} y={38} glyph="ruler-pen" />
      <Copy x={182} y={46} w={24} quiet />
      <Copy x={166} y={84} w={36} />
      <Rect x={166} y={98} w={40} h={14} rx={7} className={styles.tile} />
      <Rect x={218} y={56} w={60} h={80} rx={4} className={styles.tile} />
      {(
        [
          [76, 'arrow-right'],
          [96, 'eye'],
          [116, 'smartphone'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <C cx={234} cy={cy} glyph={glyph} />
          <Copy x={248} y={cy} w={20} quiet />
        </g>
      ))}
    </>
  );
}

/** For each family, a written line saying which side leads: Figma or code. */
function WrittenRule() {
  const rows = [
    [70, 48, 'figma'],
    [100, 36, 'code'],
    [130, 56, 'figma'],
  ] as const;
  return (
    <>
      <Rect x={60} y={30} w={200} h={120} rx={8} className={styles.frame} />
      <Copy x={80} y={46} w={40} quiet />
      {/* The one row read here, lit: this family follows code. */}
      <Rect x={180} y={86} w={68} h={28} rx={14} className={styles.halo} />
      {rows.map(([cy, w, lead]) => {
        const lit = cy === 100;
        const figma = lead === 'figma';
        return (
          <g key={cy}>
            <Rect x={80} y={cy - 6} w={12} h={12} rx={3} className={styles.tile} />
            <Copy x={100} y={cy} w={w} />
            <Rect x={186} y={cy - 8} w={56} h={16} rx={8} className={styles.tile} />
            <Rect
              x={figma ? 186 : 214}
              y={cy - 8}
              w={28}
              h={16}
              rx={8}
              className={lit ? styles.solid : styles.frame}
            />
            <Glyph
              name="ruler-pen"
              cx={200}
              cy={cy}
              size={10}
              className={lit && figma ? styles.glyphOn : styles.glyph}
            />
            <Glyph
              name="code"
              cx={228}
              cy={cy}
              size={10}
              className={lit && !figma ? styles.glyphOn : styles.glyph}
            />
          </g>
        );
      })}
    </>
  );
}

/** On the line of releases, the check flags the one where design and code split, and its note explains it. */
function ChecksReleaseNotes() {
  return (
    <>
      {/* The releases, one after another. */}
      <path className={styles.rule} d="M50,50 L263,50" />
      <path className={styles.quietMark} d="M270,50 L263,46 L263,54 Z" />
      {[70, 110, 230].map((x) => (
        <circle key={x} className={styles.tile} cx={x} cy={50} r="6" />
      ))}
      {/* Flagged: design and code stopped matching here. */}
      <Focus x={170} y={50} glyph="danger-triangle" size={12} />
      <path className={styles.line} d="M170,61 L170,103" />
      <ArrowDown x={170} y={110} />
      {/* The release note that explains the break. */}
      <Rect x={110} y={110} w={120} h={40} rx={8} className={styles.frame} />
      <C cx={130} cy={130} glyph="ruler-pen" />
      <C cx={150} cy={130} glyph="code" />
      <Copy x={170} y={126} w={44} />
      <Copy x={170} y={136} w={30} quiet />
    </>
  );
}

/* ── The terms ────────────────────────────────────────────────────────────────── */

/** The senior designer on Figma (lit) and the account lead in our frame; the design engineer on the code routed in. */
function Team() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      <Focus x={60} y={66} glyph="user" size={12} />
      <C cx={92} cy={66} glyph="ruler-pen" />
      <Copy x={104} y={62} w={46} />
      <Copy x={104} y={72} w={26} quiet />
      <Glyph name="user" cx={60} cy={114} size={18} className={styles.glyph} />
      <Copy x={90} y={110} w={60} />
      <Copy x={90} y={120} w={40} quiet />
      {/* The design engineer, a person on the code side, routed in. */}
      <Rect x={206} y={74} w={84} h={32} rx={8} className={styles.frame} />
      <Glyph name="user" cx={222} cy={90} size={14} className={styles.glyph} />
      <C cx={246} cy={90} glyph="code" />
      <Copy x={260} y={90} w={20} quiet />
      <Hop x1={206} x2={180} y={90} />
    </>
  );
}

/** Both libraries; access to the repository or a running Storybook; one person from each side who can decide (lit). */
function Needs() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.tile} />
      <C cx={66} cy={50} glyph="ruler-pen" />
      <C cx={94} cy={50} glyph="code" />
      <C cx={66} cy={90} glyph="key" />
      <C cx={94} cy={90} glyph="monitor" />
      <Focus x={80} y={130} glyph="users-group-rounded" size={12} />
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

/** One family aligned, checked; both libraries, and any start again, stay theirs. */
function Stops() {
  const theirs = [
    [50, 'ruler-pen'],
    [90, 'code'],
    [130, 'refresh'],
  ] as const;
  return (
    <>
      {/* One family, its Figma and code sides now the same. */}
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      {(
        [
          [76, 'ruler-pen'],
          [104, 'code'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={cy}>
          <C cx={50} cy={cy} glyph={glyph} />
          <Rect x={64} y={cy - 6} w={32} h={12} rx={6} className={styles.tile} />
        </g>
      ))}
      <Hop x1={110} x2={140} y={90} />
      <Rect x={140} y={64} w={44} h={52} rx={8} className={styles.frame} />
      <Focus x={162} y={90} glyph="check-circle" size={13} />
      {/* Theirs throughout: no route enters. */}
      <Rect x={200} y={30} w={90} h={120} rx={8} className={styles.tile} />
      {theirs.map(([cy, glyph]) => (
        <g key={cy}>
          <C cx={216} cy={cy} glyph={glyph} />
          <Copy x={236} y={cy - 4} w={44} />
          <Copy x={236} y={cy + 4} w={31} quiet />
        </g>
      ))}
    </>
  );
}

/**
 * /services/design-systems/figma-storybook-alignment · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* A correspondence map for each component family.: How Figma and code line up, with every gap marked against six questions: colours and spacing, options, cases, behaviour, who decides and che */
  'wyg-figma-storybook-alignment-correspondence-map-each-component': CorrespondenceMap,
  /* The gaps that matter, fixed.: In Figma, in code or in both, with design tokens carrying the same names from one to the other. */
  'wyg-figma-storybook-alignment-gaps-matter-fixed': GapsFixed,
  /* A Storybook entry for each case.: Loading, empty, error, disabled and validation, so designers and developers look at the same set. */
  'wyg-figma-storybook-alignment-storybook-entry-each-case': StorybookEntry,
  /* Behaviour written where designers can see it.: Keyboard, focus and screen-size behaviour that exists only in the running component, described beside the Figma component. */
  'wyg-figma-storybook-alignment-behaviour-written-where-designers': BehaviourWritten,
  /* A written rule for who decides.: For each family, which side leads when the two disagree. */
  'wyg-figma-storybook-alignment-written-rule-who-decides': WrittenRule,
  /* Checks and release notes.: Checks that flag when design and code stop matching, and notes that explain changes that break things. */
  'wyg-figma-storybook-alignment-checks-release-notes': ChecksReleaseNotes,
  /* Who does the work: A design engineer reads your code and Storybook while a senior designer works through the Figma library, and the two of them map each family */
  'team-figma-storybook-alignment': Team,
  /* What we need from you: A Figma library and coded components, access to your repository or at least a running Storybook, and one person from design and one from fro */
  'needs-figma-storybook-alignment': Needs,
  /* Where our part stops: We align one family at a time, and your team owns both libraries throughout. If one side is missing or both need starting again, that is Des */
  'stops-figma-storybook-alignment': Stops,
};
