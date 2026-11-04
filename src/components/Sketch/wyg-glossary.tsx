import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, ArrowUp, Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* The glossary's TERM drawings (/glossary and /glossary/<term>), one per term, each drawn from that
   term's own definition. Still plates: these never move, so draw the finished picture.
   Helpers come from ./offer and ./scenes (Rect, Copy, Hop, Glyph, Focus, Hatched ...) and classes
   from ./Sketch.module.css. The comment above each scene is the item's title and words; the comment
   on each drawing is the one idea it holds. */

/** The one arrowhead pointing down, tip at (x, y). */
const ArrowDown = ({ x, y }: { x: number; y: number }) => (
  <path className={styles.solid} d={`M${x},${y} L${x - 4},${y - 7} L${x + 4},${y - 7} Z`} />
);

/** A node on a route, at a port. */
const Port = ({ x, y }: { x: number; y: number }) => (
  <circle className={styles.node} cx={x} cy={y} r="2.5" />
);

/** A framed glyph, centred at (cx, cy), `s` square. */
const Tile = ({
  cx,
  cy,
  s = 40,
  glyph,
  quiet = false,
}: {
  cx: number;
  cy: number;
  s?: number;
  glyph: IconName;
  quiet?: boolean;
}) => (
  <>
    <Rect
      x={cx - s / 2}
      y={cy - s / 2}
      w={s}
      h={s}
      rx={8}
      className={quiet ? styles.frameQuiet : styles.frame}
    />
    <Glyph
      name={glyph}
      cx={cx}
      cy={cy}
      size={18}
      className={quiet ? styles.glyphQuiet : styles.glyph}
    />
  </>
);

/** AI Product UX: the person asks, the AI's change shows in place, and the person can undo it. */
function AiProductUx() {
  return (
    <>
      <Tile cx={50} cy={90} glyph="user" />
      <Hop x1={70} x2={110} y={90} />
      <Rect x={110} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Copy x={126} y={50} w={48} quiet />
      <Copy x={126} y={66} w={64} />
      <Rect x={126} y={78} w={100} h={24} className={styles.region} />
      <Glyph name="stars" cx={138} cy={90} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M152,90 L208,90" />
      <Copy x={126} y={118} w={72} quiet />
      <Copy x={126} y={130} w={48} quiet />
      <Focus x={258} y={90} glyph="undo-left" size={12} />
    </>
  );
}

/** Agentic UX: the AI runs its steps on its own, stops at the one that needs approval, and a wrong
 *  change has a way back. */
function AgenticUx() {
  return (
    <>
      <Tile cx={70} cy={70} glyph="cpu" />
      <Tile cx={130} cy={70} glyph="cpu" />
      <path className={styles.line} d="M90,70 L110,70" />
      <path className={styles.line} d="M150,70 L179,70" />
      <Focus x={190} y={70} glyph="check-circle" size={12} />
      <path className={styles.line} d="M201,70 L223,70" />
      <ArrowRight x={230} y={70} />
      <Tile cx={250} cy={70} glyph="cpu" />
      {/* The way back: from the last step to the one before the gate. */}
      <path
        className={styles.trail}
        d="M250,90 L250,124 Q250,130 244,130 L136,130 Q130,130 130,124 L130,97"
      />
      <path className={styles.quietMark} d="M130,90 L126,97 L134,97 Z" />
      <circle className={styles.blank} cx={190} cy={130} r={10} />
      <Glyph name="undo-left" cx={190} cy={130} size={14} className={styles.glyphQuiet} />
    </>
  );
}

/** Human in the loop: the AI's result reaches a person first, and the person stops it before it
 *  takes effect. */
function HumanInTheLoop() {
  return (
    <>
      <Tile cx={50} cy={90} glyph="stars" />
      <Hop x1={70} x2={110} y={90} />
      <Rect x={110} y={60} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={140} cy={90} size={22} className={styles.glyph} />
      <path className={styles.line} d="M170,90 L199,90" />
      <Port x={170} y={90} />
      <Focus x={210} y={90} glyph="close-circle" size={12} />
      <path className={styles.trail} d="M228,90 L250,90" />
      <Hatched x={250} y={70} w={40} h={40} />
    </>
  );
}

/** AI-native product design: agents and automation take the routine tasks; the designer's route
 *  lands on the one decision. */
function AiNativeProductDesign() {
  return (
    <>
      <Tile cx={60} cy={90} glyph="user" />
      <path className={styles.line} d="M80,90 L129,90" />
      <ArrowRight x={136} y={90} />
      <g transform="translate(6 0)">
        <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
        {/* The routine tasks, handed to an agent and to automation. */}
        <Rect x={146} y={42} w={128} h={28} className={styles.tile} />
        <Chip x={150} y={48} glyph="cpu" />
        <Copy x={176} y={56} w={64} quiet />
        <Glyph name="check-circle" cx={262} cy={56} size={12} className={styles.glyphQuiet} />
        <Rect x={146} y={110} w={128} h={28} className={styles.tile} />
        <Chip x={150} y={116} glyph="refresh-square" />
        <Copy x={176} y={124} w={52} quiet />
        <Glyph name="check-circle" cx={262} cy={124} size={12} className={styles.glyphQuiet} />
        {/* The decision, kept in hand: the one row that stays the person's. */}
        <Rect x={146} y={76} w={128} h={28} className={styles.region} />
        <path className={styles.regionCopy} d="M158,90 L230,90" />
        <Glyph name="user" cx={262} cy={90} size={14} className={styles.glyphAccent} />
      </g>
    </>
  );
}

/** AI-assisted product development: AI helps at every stage, and the release waits on one person. */
function AiAssistedProductDevelopment() {
  const stages: IconName[] = ['question-circle', 'ruler-pen', 'widget', 'code', 'checklist'];
  return (
    <>
      <Rect x={30} y={40} w={180} h={60} rx={8} className={styles.frame} />
      <Chip x={38} y={48} glyph="stars" />
      {stages.map((g, i) => (
        <Glyph key={g} name={g} cx={48 + i * 36} cy={80} size={16} className={styles.glyph} />
      ))}
      <Hop x1={210} x2={250} y={70} />
      <Tile cx={270} cy={70} glyph="user" />
      <path className={styles.line} d="M270,90 L270,112" />
      <Port x={270} y={90} />
      <Focus x={270} y={130} glyph="flag" size={12} />
    </>
  );
}

/** Coded prototype: a working screen full of real rows, one reached from the keyboard. */
function CodedPrototype() {
  const rows = [54, 64, 74, 106, 116, 126, 136];
  const left = [56, 44, 60, 40, 52, 48, 36];
  const right = [32, 40, 24, 36, 28, 40, 24];
  return (
    <>
      <g transform="translate(-12 0)">
        <Rect x={50} y={30} w={160} h={120} rx={8} className={styles.frame} />
        <Copy x={66} y={42} w={40} />
        {rows.map((y, i) => (
          <g key={y}>
            <Copy x={66} y={y} w={left[i] ?? 48} quiet />
            <Copy x={146} y={y} w={right[i] ?? 32} quiet />
          </g>
        ))}
        {/* The row reached from the keyboard: a focus ring, not a selection. */}
        <Rect x={56} y={78} w={148} h={24} rx={4} className={styles.line} />
        <Rect x={58} y={80} w={144} h={20} className={styles.region} />
        <path className={styles.regionCopy} d="M66,90 L114,90 M146,90 L178,90" />
        <Hop x1={250} x2={210} y={90} />
        {/* The arrow keys, two caps that float on their flat offsets. */}
        <Rect x={252} y={36} w={40} h={32} rx={6} className={styles.liftUnder} />
        <Rect x={250} y={34} w={40} h={32} rx={6} className={styles.lift} />
        <Glyph name="alt-arrow-up" cx={270} cy={50} size={18} className={styles.glyph} />
        <Rect x={252} y={76} w={40} h={32} rx={6} className={styles.liftUnder} />
        <Rect x={250} y={74} w={40} h={32} rx={6} className={styles.lift} />
        <Glyph name="alt-arrow-down" cx={270} cy={90} size={18} className={styles.glyph} />
      </g>
    </>
  );
}

/** Design engineering: the component is shaped in its code, and what runs is the finished thing. */
function DesignEngineering() {
  const lines: [number, number, number][] = [
    [46, 46, 48],
    [58, 58, 56],
    [70, 58, 40],
    [82, 70, 36],
    [94, 70, 48],
    [106, 58, 28],
    [118, 46, 20],
  ];
  return (
    <>
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={38} y={76} w={104} h={24} className={styles.wash} />
      {lines.map(([y, x, w]) => (
        <Copy key={y} x={x} y={y} w={w} quiet={y !== 82 && y !== 94} />
      ))}
      <Hop x1={150} x2={190} y={90} />
      <Rect x={190} y={34} w={100} h={112} rx={14} className={styles.halo} />
      <Rect x={196} y={40} w={88} h={100} rx={8} className={styles.frame} />
      <Rect x={208} y={52} w={64} h={32} className={styles.soft} />
      <Copy x={208} y={98} w={52} />
      <Copy x={208} y={110} w={36} quiet />
      <Rect x={208} y={120} w={36} h={12} rx={6} className={styles.solid} />
    </>
  );
}

/** Design intent: what reads first stays first when the wide layout narrows to a phone. */
function DesignIntent() {
  return (
    <>
      <g transform="translate(10 0)">
        <Rect x={30} y={40} w={140} h={100} rx={8} className={styles.frameQuiet} />
        <Rect x={42} y={52} w={56} h={76} className={styles.region} />
        <Rect x={106} y={52} w={52} h={34} className={styles.tile} />
        <Rect x={106} y={94} w={52} h={34} className={styles.tile} />
        <Hop x1={170} x2={210} y={90} />
        <Rect x={210} y={30} w={60} h={120} rx={8} className={styles.frame} />
        <Rect x={220} y={40} w={40} h={44} className={styles.region} />
        <Rect x={220} y={92} w={40} h={22} className={styles.tile} />
        <Rect x={220} y={120} w={40} h={20} className={styles.tile} />
      </g>
    </>
  );
}

/** Design to code: the design and the running screen held in step, each change carried both ways. */
function DesignToCode() {
  const screen = (x: number, glyph: IconName) => (
    <>
      <Rect x={x} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Chip x={x + 8} y={38} glyph={glyph} />
      <Copy x={x + 16} y={70} w={56} />
      <Rect x={x + 16} y={82} w={68} h={28} className={styles.tile} />
      <Glyph name="eye" cx={x + 50} cy={96} size={12} className={styles.glyphQuiet} />
      <Rect x={x + 16} y={122} w={40} h={14} rx={7} className={styles.tile} />
    </>
  );
  return (
    <>
      {screen(30, 'ruler-pen')}
      {screen(190, 'code')}
      <path className={styles.line} d="M130,90 L149,90 M171,90 L190,90" />
      <Port x={130} y={90} />
      <Port x={190} y={90} />
      <Focus x={160} y={90} glyph="refresh" size={12} />
    </>
  );
}

/** Prototype hardening: the demo's pretend sign-in and sample data, swapped for the real parts. */
function PrototypeHardening() {
  return (
    <>
      <Rect x={30} y={40} w={100} h={100} rx={8} className={styles.frameQuiet} />
      <Hatched x={42} y={54} w={76} h={20} />
      <Hatched x={42} y={86} w={76} h={40} />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={182} y={46} w={96} h={28} className={styles.tile} />
      <Glyph name="lock" cx={196} cy={60} size={14} className={styles.glyph} />
      <Copy x={212} y={60} w={48} />
      <Rect x={182} y={86} w={96} h={48} className={styles.region} />
      <Glyph name="database" cx={196} cy={100} size={14} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M212,100 L260,100 M212,116 L248,116" />
    </>
  );
}

/** Design system: one shared kit feeds several products. */
function DesignSystem() {
  return (
    <>
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      {[48, 62, 76].map((x, i) => (
        <circle key={x} className={i === 0 ? styles.solid : styles.soft} cx={x} cy={60} r={5} />
      ))}
      <Rect x={42} y={78} w={44} h={16} rx={8} className={styles.tile} />
      <Copy x={42} y={112} w={48} quiet />
      <Copy x={42} y={124} w={32} quiet />
      <path
        className={styles.line}
        d="M110,90 L183,90 M150,90 L150,56 Q150,50 156,50 L183,50 M150,90 L150,124 Q150,130 156,130 L183,130"
      />
      <Port x={110} y={90} />
      <Port x={150} y={90} />
      {[50, 90, 130].map((y) => (
        <g key={y}>
          <ArrowRight x={190} y={y} />
          <Rect x={190} y={y - 16} w={100} h={32} rx={8} className={styles.frame} />
          <Rect x={202} y={y - 6} w={32} h={12} rx={6} className={styles.region} />
          <Copy x={244} y={y} w={32} quiet />
        </g>
      ))}
    </>
  );
}

/** Design system adoption: the system's parts reused in product work, one overridden, one new part
 *  contributed back. */
function DesignSystemAdoption() {
  return (
    <>
      {/* The system: its own mark, and its parts. */}
      <Rect x={30} y={30} w={80} h={134} rx={8} className={styles.frame} />
      <Chip x={38} y={38} glyph="layers" />
      <Rect x={50} y={62} w={40} h={16} rx={8} className={styles.tile} />
      <Rect x={50} y={102} w={40} h={16} rx={8} className={styles.tile} />
      <Rect x={50} y={142} w={40} h={16} rx={8} className={styles.region} />
      <Rect x={210} y={30} w={80} h={134} rx={8} className={styles.frame} />
      {/* Reused: the route carries it across. */}
      <Hop x1={110} x2={210} y={70} />
      <Rect x={230} y={62} w={40} h={16} rx={8} className={styles.tile} />
      {/* Overridden: the trail breaks, and the part arrives changed, square where the system is round. */}
      <path className={styles.trail} d="M110,110 L210,110" />
      <Rect x={226} y={100} w={48} h={20} rx={2} className={styles.tile} />
      {/* Contributed back: the product's new part returns to the system. */}
      <Hop x1={210} x2={110} y={150} />
      <Rect x={230} y={142} w={40} h={16} rx={8} className={styles.tile} />
    </>
  );
}

/** Design system drift: one component in Figma, code, docs and the live product, each a little
 *  further off the line they started on. */
function DesignSystemDrift() {
  const rows: [IconName, number, number, number][] = [
    ['ruler-pen', 0, 60, 8],
    ['code', 6, 60, 6],
    ['document-text', 14, 52, 3],
    ['monitor', 26, 64, 1],
  ];
  return (
    <>
      <Rect x={70} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <path className={styles.trail} d="M140,40 L140,140" />
      {rows.map(([g, dx, w, rx], i) => {
        const y = 48 + i * 28;
        const last = i === rows.length - 1;
        return (
          <g key={g}>
            <Chip x={86} y={y - 8} glyph={g} />
            <Rect
              x={150 + dx}
              y={y - 8}
              w={w}
              h={16}
              rx={rx}
              className={last ? styles.region : styles.tile}
            />
          </g>
        );
      })}
    </>
  );
}

/** Design system governance: a component's life, proposed, approved, released, then retired. */
function DesignSystemGovernance() {
  return (
    <>
      <Rect x={50} y={70} w={40} h={40} rx={8} className={styles.trailFrame} />
      <Rect x={58} y={84} w={24} h={12} rx={6} className={styles.trailFrame} />
      <path className={styles.line} d="M90,90 L119,90" />
      <Port x={90} y={90} />
      <Focus x={130} y={90} glyph="check-circle" size={12} />
      <path className={styles.line} d="M141,90 L163,90" />
      <ArrowRight x={170} y={90} />
      <Rect x={170} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Rect x={178} y={84} w={24} h={12} rx={6} className={styles.solid} />
      <path className={styles.trail} d="M210,90 L230,90" />
      <Hatched x={230} y={70} w={40} h={40} />
      {[70, 190, 250].map((x) => (
        <Copy key={x} x={x - 12} y={126} w={24} quiet />
      ))}
    </>
  );
}

/** Information architecture: things grouped under clear labels, so the person goes straight to
 *  the one they want. */
function InformationArchitecture() {
  const groups = [30, 120, 210];
  return (
    <>
      <Glyph name="user" cx={160} cy={36} size={18} className={styles.glyph} />
      <path className={styles.line} d="M160,50 L160,73" />
      <Port x={160} y={50} />
      <ArrowDown x={160} y={80} />
      {groups.map((x) => (
        <g key={x}>
          <Rect x={x} y={80} w={80} h={70} rx={8} className={styles.frame} />
          <Copy x={x + 12} y={96} w={36} />
          {[110, 122, 134].map((y, i) =>
            x === 120 && i === 1 ? null : (
              <Copy key={y} x={x + 12} y={y} w={[48, 40, 52][i] ?? 40} quiet />
            ),
          )}
        </g>
      ))}
      <Rect x={128} y={115} w={64} h={14} rx={3} className={styles.region} />
      <path className={styles.regionCopy} d="M132,122 L172,122" />
    </>
  );
}

/** Product modernisation: the new product built in front of the old one, both standing on the same
 *  data. The old screen, dense and quiet, shows behind; the new one overlaps it; one database feeds
 *  both, its route to the old screen a trail and to the new one the line. */
function ProductModernisation() {
  return (
    <>
      {/* The established product: a dense grid of rows, quiet, behind. */}
      <Rect x={40} y={30} w={120} h={90} rx={8} className={styles.frameQuiet} />
      {[46, 58, 70, 82, 94].map((y, i) => (
        <g key={y}>
          <Copy x={50} y={y} w={[20, 24, 16, 22, 18][i] ?? 20} quiet />
          <Copy x={78} y={y} w={[28, 18, 26, 14, 24][i] ?? 20} quiet />
        </g>
      ))}
      {/* The modernised product, in front: one clear record and its action. */}
      <Rect x={110} y={60} w={130} h={90} rx={8} className={styles.frame} />
      <Copy x={124} y={76} w={40} quiet />
      <Rect x={124} y={88} w={102} h={24} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M134,100 L190,100" />
      <Rect x={124} y={124} w={36} h={12} rx={6} className={styles.solid} />
      {/* The same data under both: the trail to the old screen, the line to the new one. */}
      <Tile cx={280} cy={100} glyph="database" />
      <path className={styles.trail} d="M280,80 L280,46 Q280,40 274,40 L160,40" />
      <path className={styles.line} d="M240,100 L260,100" />
      <Port x={240} y={100} />
      <Port x={260} y={100} />
    </>
  );
}

/** User journey mapping: one person's path through sales, setup and support, and the stage where
 *  the product lets them down. */
function UserJourneyMapping() {
  const stages: [number, IconName][] = [
    [90, 'hand-shake'],
    [170, 'widget'],
    [250, 'chat-round-dots'],
  ];
  return (
    <>
      <g transform="translate(12 0)">
        <Glyph name="user" cx={36} cy={110} size={18} className={styles.glyph} />
        <path className={styles.line} d="M50,110 L70,110 M110,110 L150,110 M190,110 L230,110" />
        <Port x={50} y={110} />
        {stages.map(([x, g]) => (
          <Tile key={x} cx={x} cy={110} glyph={g} />
        ))}
        <Glyph name="check-circle" cx={90} cy={60} size={16} className={styles.glyph} />
        <Focus x={170} y={60} glyph="danger-triangle" size={12} />
        <Glyph name="check-circle" cx={250} cy={60} size={16} className={styles.glyph} />
      </g>
    </>
  );
}

/** UX debt: every change costs a little more than the last (the bars grow, the latest lit), and the
 *  workarounds pile into the manual. */
function UxDebt() {
  const bars: [number, number][] = [
    [60, 40],
    [90, 72],
    [120, 104],
  ];
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <Rect
          key={i}
          x={48 - i * 6}
          y={36 + i * 6}
          w={64}
          h={84}
          rx={8}
          className={i === 3 ? styles.frame : styles.frameQuiet}
        />
      ))}
      <Glyph name="notebook" cx={62} cy={96} size={20} className={styles.glyph} />
      {/* Each change takes longer than the last: the bars grow, and the latest is the one lit. No
          badge at the end: the growth itself is the cost. */}
      {bars.map(([y, w], i) => {
        const last = i === bars.length - 1;
        return (
          <g key={y}>
            <Rect
              x={130}
              y={y - 8}
              w={w}
              h={16}
              rx={8}
              className={last ? styles.region : styles.tile}
            />
            <Glyph
              name="clock-circle"
              cx={142}
              cy={y}
              size={10}
              className={last ? styles.glyphAccent : styles.glyphQuiet}
            />
          </g>
        );
      })}
    </>
  );
}

/** Workflow design: work handed from role to role, with the branch that catches the case the normal
 *  path can't take. */
function WorkflowDesign() {
  return (
    <>
      <Tile cx={50} cy={70} glyph="user" />
      <Hop x1={70} x2={140} y={70} />
      <Tile cx={160} cy={70} glyph="users-group-rounded" />
      <Hop x1={180} x2={250} y={70} />
      <Tile cx={270} cy={70} glyph="user" />
      <path className={styles.line} d="M160,90 L160,112" />
      <Port x={160} y={90} />
      <Focus x={160} y={130} glyph="danger-triangle" size={12} />
      <path className={styles.line} d="M178,130 L264,130 Q270,130 270,124 L270,97" />
      <ArrowUp x={270} y={90} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI Product UX: the design of how people understand, direct, check and undo what an AI does inside a product. (Draw: a person directing an AI's change, checking it, and an undo.) */
  'glossary-ai-product-ux': AiProductUx,
  /* Agentic UX: the design of AI that carries out several steps on its own. It sets which steps need approval and how a wrong change is reversed. (Draw: a multi-step run with one approval gate and a way back.) */
  'glossary-agentic-ux': AgenticUx,
  /* Human in the loop: a person reviewing an AI's work who has the information, authority and time to stop the result before it takes effect. (Draw: a reviewer with a stop control before a result takes effect.) */
  'glossary-human-in-the-loop': HumanInTheLoop,
  /* AI-native product design: a way of working in which designers direct AI agents and automation through parts of the work. People make the decisions that matter. (Draw: a designer routing tasks to agents and automation, the decision kept in hand.) */
  'glossary-ai-native-product-design': AiNativeProductDesign,
  /* AI-assisted product development: AI tools used in research, design, prototyping, engineering or testing, with people still answerable for what gets released. (Draw: AI tools along research, design, prototype, code and test; a person signs off the release.) */
  'glossary-ai-assisted-product-development': AiAssistedProductDevelopment,
  /* Coded prototype: working software built to test what a design file can't show, such as real amounts of data or keyboard use. (Draw: a running screen tested with a real volume of data and keyboard focus.) */
  'glossary-coded-prototype': CodedPrototype,
  /* Design engineering: exploring, refining and building product experiences directly in code, from early prototype to production, so permissions and real content behave as designed. (Draw: one component refined live in code, from prototype to production.) */
  'glossary-design-engineering': DesignEngineering,
  /* Design intent: what the build must keep from the design, such as which information comes first, even when content or screen size forces a change. (Draw: an information order kept as a layout reflows to a narrow screen.) */
  'glossary-design-intent': DesignIntent,
  /* Design to code: turning designs into working software and keeping the two in step, from behaviour and content to accessibility. (Draw: a design frame and a running screen kept in step on behaviour, content and accessibility.) */
  'glossary-design-to-code': DesignToCode,
  /* Prototype hardening: the engineering that replaces a demo's shortcuts, such as pretend sign-in or sample data, with the real thing before customers arrive. (Draw: a demo's fake sign-in and sample data swapped for the real parts.) */
  'glossary-prototype-hardening': PrototypeHardening,
  /* Design system: the shared building blocks, code and guidance that several products or teams build with, plus the rules for how they change. (Draw: one shared kit, tokens, components and guidance, feeding several products.) */
  'glossary-design-system': DesignSystem,
  /* Design system adoption: whether teams really use the shared system in product work, judged by reuse, overrides and contributions instead of download counts. (Draw: shared parts reused, overridden and contributed back in product work.) */
  'glossary-design-system-adoption': DesignSystemAdoption,
  /* Design system drift: what happens when Figma, code, documentation and live products slowly stop agreeing on how a shared component behaves. (Draw: one component in Figma, code, docs and the live product, slowly disagreeing.) */
  'glossary-design-system-drift': DesignSystemDrift,
  /* Design system governance: who can propose, approve, release and retire shared components, and what happens when a product needs something the system lacks. (Draw: a component's route through propose, approve, release and retire.) */
  'glossary-design-system-governance': DesignSystemGovernance,
  /* Information architecture: how a product's records, labels and menus are organised, so people can predict where things live. (Draw: records, labels and menus grouped so a person predicts where a thing lives.) */
  'glossary-information-architecture': InformationArchitecture,
  /* Product modernisation: updating an established product's workflows, interface and code while keeping the behaviour and data customers still rely on. (Draw: an old workflow rebuilt, the same data and behaviour carried across.) */
  'glossary-product-modernisation': ProductModernisation,
  /* User journey mapping: following a person across stages such as sales, setup and support. It shows where the product helps and where it lets them down. (Draw: one person's path through sales, setup and support, marked where the product helps or fails.) */
  'glossary-user-journey-mapping': UserJourneyMapping,
  /* UX debt: the growing cost of past design shortcuts, visible when every change takes longer and workarounds end up in the training material. (Draw: workarounds piling into the training manual as every change slows.) */
  'glossary-ux-debt': UxDebt,
  /* Workflow design: how work moves between roles, rules and handoffs, including what happens when the normal path fails. (Draw: work handed between roles under rules, including the failure branch.) */
  'glossary-workflow-design': WorkflowDesign,
};
