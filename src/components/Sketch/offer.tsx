import type { ReactNode } from 'react';

import type { OfferSceneName } from '@/lib/sketches';

import styles from './Sketch.module.css';
import { CURSOR, Chip, Focus, Glide, GrowIn, Glyph, Hatched, TraceIn } from './scenes';

/**
 * The OFFER scenes: the drawings a service page's bands show beside what each item says (product-design
 * page, owner 26 Oct 2026, mock rounds 1–4). Each one draws its own item's argument, in the
 * flat-graphics grammar the other scenes keep: screens at 8 with copy on a 12-unit pitch, routes on
 * the axes ending on a port or the one arrowhead, people and objects as Solar glyphs, hatching for
 * what is not built, one focal point. Still, like every plate.
 *
 *   outcome-*     "What you get": the change each promise makes (a manual set aside, the rules behind
 *                 one switch, the awkward cases designed and handed to code, a card in every state, a
 *                 brief sorted into in, waiting and out against the person who uses the product)
 *   symptom-*     "Where we start": each complaint drawn as the problem turning into its fix
 *   specialist-*  the specialist services, drawn bare on the bento's tiles
 *   case-*        a worked example's problem and what we did, drawn on the same screen so the change
 *                 is the only difference (Dealpath's listing card and pipeline)
 *
 * Assigned item by item at the content seam (src/content/sources/offer-scenes.ts), never by keyword.
 */

/** The one arrowhead pointing right, tip at (x, y). */
export function ArrowRight({ x, y }: { x: number; y: number }) {
  return (
    <path className={styles.solid} d={`M${x},${y} L${x - 7},${y - 4} L${x - 7},${y + 4} Z`} />
  );
}

/** The one arrowhead pointing left, tip at (x, y). */
export function ArrowLeft({ x, y }: { x: number; y: number }) {
  return <path className={styles.solid} d={`M${x},${y} L${x + 7},${y - 4} L${x + 7},${y + 4} Z`} />;
}

/** The one arrowhead pointing up, tip at (x, y). */
export function ArrowUp({ x, y }: { x: number; y: number }) {
  return <path className={styles.solid} d={`M${x},${y} L${x - 4},${y + 7} L${x + 4},${y + 7} Z`} />;
}

/** A route from a port at x1 to the arrowhead's tip at x2, on y; the head points the way it travels. */
export function Hop({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const left = x2 < x1;
  return (
    <>
      <path className={styles.line} d={`M${x1},${y} L${left ? x2 + 7 : x2 - 7},${y}`} />
      {left ? <ArrowLeft x={x2} y={y} /> : <ArrowRight x={x2} y={y} />}
      <circle className={styles.node} cx={x1} cy={y} r="2.5" />
    </>
  );
}

/** A line of copy from x, `w` long; `quiet` for the lighter ink. */
export function Copy({
  x,
  y,
  w,
  quiet = false,
}: {
  x: number;
  y: number;
  w: number;
  quiet?: boolean;
}) {
  return (
    <path className={quiet ? styles.copyQuiet : styles.copy} d={`M${x},${y} L${x + w},${y}`} />
  );
}

export function Rect({
  x,
  y,
  w,
  h,
  rx = 4,
  className,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
  className: string | undefined;
}) {
  return <rect className={className} x={x} y={y} width={w} height={h} rx={rx} />;
}

/** The floating cursor, tip at (x, y), its flat offset under it. */
export function Cursor({ x, y }: { x: number; y: number }) {
  return (
    <>
      <path
        className={styles.liftUnder}
        d={CURSOR}
        transform={`translate(${x + 2},${y + 2})`}
      />
      <path className={styles.lift} d={CURSOR} transform={`translate(${x},${y})`} />
    </>
  );
}

/** A switch, its knob at the end it is set to. */
export function Switch({ x, y, on }: { x: number; y: number; on: boolean }) {
  return (
    <>
      <Rect x={x} y={y} w={24} h={12} rx={6} className={on ? styles.solid : styles.tile} />
      <circle
        className={on ? styles.glyphOn : styles.knob}
        cx={on ? x + 18 : x + 6}
        cy={y + 6}
        r="3.5"
      />
    </>
  );
}

/**
 * The lens: a magnifier over (x, y), drawn as ONE object (owner, 26 Oct 2026: the handle "reads as line
 * on top of the circle not as one unit"). The handle is an outlined bar in the ring's own ink and
 * weight, set at 135° and tucked under the ring, and the two share one flat offset, as everything that
 * floats does.
 */
export function Lens({ x, y, r }: { x: number; y: number; r: number }) {
  const handle = (dx: number, className: string | undefined) => (
    <rect
      className={className}
      x={-3.5}
      y={r - 3}
      width={7}
      height={15}
      rx={3.5}
      transform={`translate(${x + dx},${y + dx}) rotate(45)`}
    />
  );
  return (
    <>
      <circle className={styles.liftUnder} cx={x + 2} cy={y + 2} r={r} />
      {handle(2, styles.liftUnder)}
      {handle(0, styles.lift)}
      <circle className={styles.lift} cx={x} cy={y} r={r} />
    </>
  );
}

/* ── What you get ─────────────────────────────────────────────────────────────── */

/** Less explaining: the manual set aside, never built; the path walked to its end. */
function OutcomeExplain() {
  return (
    <>
      <Hatched x={30} y={40} w={60} h={80} />
      <Glyph name="notebook" cx={60} cy={80} size={20} className={styles.glyphQuiet} />
      <Rect x={110} y={30} w={180} h={120} rx={8} className={styles.frame} />
      <Copy x={126} y={50} w={48} quiet />
      <Rect x={126} y={80} w={40} h={20} rx={10} className={styles.tile} />
      <Hop x1={166} x2={190} y={90} />
      <Rect x={190} y={80} w={40} h={20} rx={10} className={styles.tile} />
      <Hop x1={230} x2={250} y={90} />
      <Focus x={262} y={90} glyph="check-circle" size={12} />
      <Cursor x={268} y={102} />
      <Copy x={126} y={126} w={120} quiet />
    </>
  );
}

/** Complex rules, simple screens: the matrix worked out behind, one switch in front. */
function OutcomeRules() {
  const cells: ReactNode[] = [];
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      cells.push(
        <Rect
          key={`${i}-${j}`}
          x={42 + j * 22}
          y={44 + i * 24}
          w={14}
          h={12}
          rx={3}
          className={(i * 3 + j * 5) % 4 === 0 ? styles.soft : styles.tile}
        />,
      );
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      {cells}
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={40} w={120} h={100} rx={8} className={styles.frame} />
      <Copy x={186} y={60} w={40} quiet />
      <Glyph name="user" cx={194} cy={90} size={16} className={styles.glyph} />
      <Copy x={210} y={90} w={24} />
      <Rect x={240} y={78} w={36} h={24} rx={12} className={styles.halo} />
      <Switch x={246} y={84} on />
      <Copy x={186} y={116} w={72} quiet />
    </>
  );
}

/** Fewer surprises: the screen and its variants designed, handed to code that builds it. */
function OutcomeBuild() {
  return (
    <>
      <Rect x={54} y={22} w={100} h={120} rx={8} className={styles.frameQuiet} />
      <Rect x={42} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={38} w={100} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={58} w={40} quiet />
      <Copy x={46} y={74} w={64} />
      <Rect x={46} y={92} w={40} h={16} className={styles.tile} />
      <Copy x={46} y={126} w={52} quiet />
      <Hop x1={130} x2={170} y={98} />
      <Rect x={170} y={38} w={120} h={120} rx={8} className={styles.frame} />
      <path className={styles.rule} d="M196,38 L196,158" />
      {[58, 74, 90, 106, 122].map((y, i) => (
        <Copy key={y} x={208} y={y} w={[48, 64, 40, 56, 32][i] ?? 40} quiet={i % 2 === 0} />
      ))}
      <Focus x={270} y={138} glyph="check-circle" size={12} />
    </>
  );
}

/** Feels finished: one card loading, empty and in error, then finished, the focal point. */
function OutcomeFinished() {
  return (
    <>
      <Rect x={30} y={50} w={56} h={80} rx={8} className={styles.tile} />
      <Rect x={40} y={64} w={36} h={4} rx={2} className={styles.soft} />
      <Rect x={40} y={76} w={28} h={4} rx={2} className={styles.soft} />
      <Rect x={40} y={88} w={32} h={4} rx={2} className={styles.soft} />
      <Rect x={96} y={50} w={56} h={80} rx={8} className={styles.trailFrame} />
      <Glyph name="database" cx={124} cy={84} size={16} className={styles.glyphQuiet} />
      <Copy x={110} y={108} w={28} quiet />
      <Rect x={162} y={50} w={56} h={80} rx={8} className={styles.tile} />
      <Glyph name="danger-triangle" cx={190} cy={80} size={16} className={styles.glyph} />
      <Rect x={176} y={102} w={28} h={12} rx={6} className={styles.frame} />
      <Rect x={228} y={40} w={72} h={100} rx={12} className={styles.halo} />
      <Rect x={234} y={46} w={60} h={88} rx={8} className={styles.frame} />
      <Copy x={244} y={62} w={28} quiet />
      <Rect x={244} y={74} w={40} h={24} className={styles.region} />
      <Copy x={244} y={110} w={36} />
      <Copy x={244} y={122} w={24} quiet />
    </>
  );
}

/**
 * A tested brief: what goes in, what waits and what stays out, checked against the person who uses the
 * product. The person's route arrives at the brief's settled scope, which carries the one check; what
 * waits sits in a quiet panel with its clock, and what stays out is hatched, never built.
 */
function OutcomeBrief() {
  return (
    <>
      <Rect x={50} y={50} w={60} h={80} rx={8} className={styles.frameQuiet} />
      <Glyph name="user" cx={80} cy={78} size={20} className={styles.glyph} />
      <Copy x={64} y={108} w={32} quiet />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={166} y={48} w={40} quiet />
      {[64, 84].map((y) => (
        <g key={y}>
          <Rect x={166} y={y - 5} w={10} h={10} rx={3} className={styles.solid} />
          <Copy x={184} y={y} w={48} />
        </g>
      ))}
      <Hatched x={166} y={98} w={66} h={12} />
      <Focus x={248} y={128} glyph="check-circle" size={12} />
    </>
  );
}

/* ── Where we start ───────────────────────────────────────────────────────────── */

/** "Customers keep getting stuck": the old path loops back at step two; the new one runs through. */
function SymptomStuck() {
  return (
    <>
      {[30, 130, 230].map((x) => (
        <g key={x}>
          <Rect x={x} y={60} w={60} h={60} rx={8} className={styles.frame} />
          <Copy x={x + 12} y={74} w={24} quiet />
        </g>
      ))}
      <path className={styles.trail} d="M90,90 L130,90" />
      <path
        className={styles.trail}
        d="M160,120 L160,140 Q160,146 154,146 L126,146 Q120,146 120,140 L120,96"
      />
      <Hop x1={190} x2={230} y={90} />
      <circle className={styles.node} cx="160" cy="90" r="2.5" />
      <Focus x={260} y={90} glyph="flag" size={12} />
    </>
  );
}

/** "The product has grown messy": a sprawl of items, regrouped into sections people can scan. */
function SymptomMessy() {
  const widths = [40, 56, 30, 48, 36, 60, 44, 28];
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      {[44, 56, 68, 80, 92, 104, 116, 128].map((y, i) => (
        <Copy key={y} x={42 + (i % 3) * 6} y={y} w={widths[i] ?? 40} quiet />
      ))}
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={182} y={42} w={96} h={28} className={styles.tile} />
      <Copy x={192} y={56} w={52} quiet />
      <Rect x={182} y={76} w={96} h={32} className={styles.region} />
      <path className={styles.regionCopy} d="M192,88 L248,88" />
      <Copy x={192} y={98} w={40} />
      <Rect x={182} y={114} w={96} h={26} className={styles.tile} />
      <Copy x={192} y={127} w={44} quiet />
    </>
  );
}

/** "Test an idea before building it": the idea as a prototype, put in front of a person who gets through. */
function SymptomTest() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.trailFrame} />
      <Copy x={46} y={50} w={48} quiet />
      <Hatched x={46} y={66} w={108} h={36} />
      <Rect x={46} y={114} w={48} h={20} rx={10} className={styles.tile} />
      <Cursor x={84} y={120} />
      <Hop x1={170} x2={210} y={90} />
      <Rect x={210} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Glyph name="user" cx={250} cy={68} size={22} className={styles.glyph} />
      <Focus x={250} y={112} glyph="check-circle" size={12} />
    </>
  );
}

/** "Every screen looks slightly different": three versions of one control, made one shared pattern. */
function SymptomConsistent() {
  return (
    <>
      <Rect x={30} y={46} w={52} h={18} rx={9} className={styles.tile} />
      <Rect x={38} y={82} w={64} h={22} rx={2} className={styles.tile} />
      <Rect x={30} y={122} w={44} h={14} rx={6} className={styles.tile} />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={180} y={30} w={110} h={120} rx={12} className={styles.halo} />
      {[46, 80, 114].map((y) => (
        <Rect key={y} x={196} y={y} w={78} h={20} rx={10} className={styles.solid} />
      ))}
    </>
  );
}

/** "What ships doesn't match the design": the build drifted off the design; worked in code until it sits on it. */
function SymptomMatch() {
  return (
    <>
      <Rect x={30} y={40} w={90} h={100} rx={8} className={styles.trailFrame} />
      <Rect x={42} y={30} w={90} h={100} rx={8} className={styles.frameQuiet} />
      <Copy x={54} y={50} w={40} quiet />
      <Rect x={54} y={66} w={56} h={20} className={styles.tile} />
      <Hop x1={132} x2={192} y={90} />
      <Rect x={192} y={40} w={90} h={100} rx={8} className={styles.frame} />
      <Copy x={204} y={60} w={40} quiet />
      <Rect x={204} y={76} w={56} h={20} className={styles.region} />
      <Focus x={260} y={118} glyph="check-circle" size={12} />
    </>
  );
}

/* ── Specialist services (drawn bare on the bento) ────────────────────────────── */

/**
 * "UX Research": the guess goes to a real user before the build it would fund. At rest a question
 * sits beside an unbuilt (hatched) feature; on hover the route runs from the question, port to port
 * through the framed user, to the feature, and the feature takes its tick.
 */
function SpecialistResearch() {
  return (
    <>
      <Rect x={40} y={66} w={50} h={48} rx={8} className={styles.frame} />
      <Glyph name="question-circle" cx={65} cy={90} size={24} className={styles.glyph} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      {/* The user, framed so the route lands on ports and runs through them. */}
      <Rect x={130} y={70} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="user" cx={150} cy={90} size={24} className={styles.glyph} />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      <circle className={styles.node} cx="170" cy="90" r="2.5" />
      <Hatched x={230} y={50} w={70} h={80} />
      <TraceIn d="M90,90 L130,90 M170,90 L223,90" />
      <GrowIn>
        <ArrowRight x={230} y={90} />
      </GrowIn>
      <GrowIn>
        <Focus x={265} y={90} glyph="check-circle" size={12} />
      </GrowIn>
    </>
  );
}

/** Information Architecture & Workflow Design: the menu that kept growing as one long list; a route
 *  carries it into a map, one root over three branches, and the place you need lights. */
function SpecialistIa() {
  const list = [48, 36, 52, 40, 56, 32, 44, 50];
  const kids = [126, 186, 246];
  return (
    <>
      {/* The long flat menu, the problem at rest. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      {list.map((w, i) => (
        <Copy key={i} x={44} y={46 + i * 12} w={w} quiet />
      ))}
      {/* The map's parts, loose until the route draws the structure between them. */}
      <Rect x={176} y={20} w={68} h={20} className={styles.frame} />
      <Copy x={196} y={30} w={28} />
      {kids.filter((x) => x !== 186).map((x) => (
        <g key={x}>
          <Rect x={x} y={110} w={48} h={24} className={styles.tile} />
          <Copy x={x + 12} y={122} w={20} quiet />
        </g>
      ))}
      {/* The place the work belongs lights only when the structure reaches it (neutral at rest, so the
          answer is not given away before the route draws). */}
      {/* Highlighted as in Audits: the halo grows and the branch, neutral at rest, fills. */}
      <GrowIn>
        <Rect x={180} y={104} w={60} h={36} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={186} y={110} w={48} h={24} className={styles.press} />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <TraceIn d="M110,90 L124,90 A6,6 0 0 0 130,84 L130,36 A6,6 0 0 1 136,30 L169,30" />
      <TraceIn d="M210,40 L210,110 M150,110 L150,76 A6,6 0 0 1 156,70 L264,70 A6,6 0 0 1 270,76 L270,110" />
      <GrowIn>
        <ArrowRight x={176} y={30} />
      </GrowIn>
    </>
  );
}

/** Interaction & UI Design: three look-alike buttons leave the person guessing which to press; on hover
 *  the third becomes the clear primary action (its halo grows, it fills) and the cursor goes straight to it. */
function SpecialistUi() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frame} />
      <Copy x={50} y={50} w={56} quiet />
      <Copy x={50} y={62} w={112} />
      {/* The halo first, so the primary sits on it. */}
      <GrowIn>
        <Rect x={204} y={76} w={60} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      {[50, 130].map((x) => (
        <Rect key={x} x={x} y={82} w={48} h={20} className={styles.tile} />
      ))}
      <Rect x={210} y={82} w={48} h={20} className={styles.press} />
      {/* At rest the cursor waits below the first two, undecided; on hover it glides onto the primary. */}
      <Glide x={-124} y={30}>
        <Cursor x={244} y={94} />
      </Glide>
    </>
  );
}

/** Data Visualisation: the rows people export, routed into one chart whose answer lights (rest: a
 *  spreadsheet beside a chart nobody reads; hover: the route carries the numbers across, the bar lights). */
function SpecialistDataviz() {
  const rows: [number, number][] = [
    [70, 30],
    [90, 22],
    [110, 36],
    [130, 20],
  ];
  const bars: [number, number][] = [
    [201, 20],
    [223, 34],
    [245, 52],
    [267, 28],
  ];
  return (
    <>
      {/* The spreadsheet: a header, four rows, two columns. */}
      <Rect x={30} y={40} w={110} h={100} rx={8} className={styles.frame} />
      <path
        className={styles.hair}
        d="M30,60 L140,60 M30,80 L140,80 M30,100 L140,100 M30,120 L140,120 M70,40 L70,140"
      />
      <Copy x={42} y={50} w={16} quiet />
      <Copy x={82} y={50} w={30} quiet />
      {rows.map(([y, w]) => (
        <g key={y}>
          <Copy x={42} y={y} w={16} />
          <Copy x={82} y={y} w={w} />
        </g>
      ))}
      {/* The port on the sheet's edge, so the route leaves the frame rather than crossing it. */}
      <circle className={styles.node} cx="140" cy="130" r="2.5" />
      <TraceIn d="M140,130 L164,130 A6,6 0 0 0 170,124 L170,96 A6,6 0 0 1 176,90 L190,90" />
      {/* The chart the numbers become; its port and the one bar that answers arrive with the route. */}
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Copy x={202} y={56} w={36} quiet />
      <GrowIn>
        <Rect x={239} y={66} w={24} h={64} rx={9} className={styles.halo} />
      </GrowIn>
      <path className={styles.rule} d="M196,124 L284,124" />
      {bars.map(([x, h]) => (
        <Rect key={x} x={x} y={124 - h} w={12} h={h} rx={3} className={styles.tile} />
      ))}
      <GrowIn>
        <Rect x={245} y={72} w={12} h={52} rx={3} className={styles.solid} />
      </GrowIn>
      <GrowIn>
        <circle className={styles.nodeOpen} cx="190" cy="90" r="3" />
      </GrowIn>
    </>
  );
}

/** Prototyping & Usability Testing: a person tries two directions and the test picks one. At rest the
 *  person sits beside two outlined screens; on hover the route draws from the person to direction A,
 *  which lights: its halo grows and its call to action fills, while direction B stays an outline. */
function SpecialistPrototype() {
  return (
    <>
      {/* The person who tried both. */}
      <Rect x={40} y={65} w={50} h={50} rx={8} className={styles.frame} />
      <Glyph name="user" cx={65} cy={90} size={22} className={styles.glyph} />
      {/* The chosen direction lights as the route reaches it; 6 clear of its frame. */}
      <GrowIn>
        <Rect x={164} y={19} w={112} h={62} rx={14} className={styles.halo} />
      </GrowIn>
      {/* Direction A: a heading and one call to action. */}
      <Rect x={170} y={25} w={100} h={50} rx={8} className={styles.frame} />
      <Copy x={184} y={41} w={40} quiet />
      <Rect x={184} y={51} w={40} h={14} rx={7} className={styles.tile} />
      {/* Chosen: direction A's heading darkens and its call to action fills, as Audits' part lights. */}
      <GrowIn>
        <Copy x={184} y={41} w={40} />
        <Rect x={184} y={51} w={40} h={14} rx={7} className={styles.solid} />
      </GrowIn>
      {/* Direction B: a heading and two options. */}
      <Rect x={170} y={105} w={100} h={50} rx={8} className={styles.frame} />
      <Copy x={184} y={121} w={40} quiet />
      <Rect x={184} y={131} w={34} h={14} className={styles.tile} />
      <Rect x={224} y={131} w={34} h={14} className={styles.tile} />
      {/* The test's answer: from the person to the direction that held. */}
      <TraceIn d="M90,90 L124,90 A6,6 0 0 0 130,84 L130,56 A6,6 0 0 1 136,50 L163,50" />
      <circle className={styles.node} cx={90} cy={90} r="2.5" />
      <GrowIn>
        <ArrowRight x={170} y={50} />
      </GrowIn>
    </>
  );
}

/** New Product Design & First Release: the idea, sketched and not yet built, stepped up into a live
 *  product: rest, a dashed idea and an empty slot on the product's screen; hover, the route climbs from
 *  the idea to the screen (the line draws) and the slot fills with the idea's block, built, its halo
 *  marking it (the Audits highlight). Two patterns; the built screen itself is the first release. */
function SpecialistNewProduct() {
  return (
    <>
      {/* The idea: a dashed sketch, its one block hatched because nothing is built yet. */}
      <Rect x={30} y={90} w={80} h={60} rx={8} className={styles.trailFrame} />
      <Copy x={44} y={102} w={40} quiet />
      <Hatched x={44} y={110} w={52} h={20} />
      <Copy x={44} y={140} w={30} quiet />
      <circle className={styles.node} cx={110} cy={120} r="2.5" />
      <TraceIn d="M110,120 L144,120 A6,6 0 0 0 150,114 L150,96 A6,6 0 0 1 156,90 L183,90" />
      <GrowIn>
        <ArrowRight x={190} y={90} />
      </GrowIn>
      {/* The first release: the product's screen, for one person, its slot filled when the route lands. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Glyph name="user" cx={210} cy={50} size={14} className={styles.glyph} />
      <Copy x={224} y={50} w={28} quiet />
      <Copy x={204} y={68} w={52} />
      {/* The idea's block, the same size, now built. */}
      <Rect x={204} y={90} w={52} h={20} rx={4} className={styles.trailFrame} />
      <GrowIn>
        <Rect x={198} y={84} w={64} h={32} rx={10} className={styles.halo} />
        <Rect x={204} y={90} w={52} h={20} rx={4} className={styles.solid} />
      </GrowIn>
      <Copy x={204} y={130} w={60} quiet />
    </>
  );
}

/** UX & Product Audit: the whole product checked, the one thing actually wrong found. At rest a screen
 *  of four rows that all look fine; on hover the audit's line leaves the screen's right edge beside the
 *  first row, runs down outside it past the rows, and comes back in at the third, which lights with the
 *  warning. */
function SpecialistAudit() {
  const rows = [
    { y: 50, w: 84 },
    { y: 76, w: 64 },
    { y: 102, w: 76 },
    { y: 128, w: 90 },
  ];
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {rows.map(({ y, w }) => (
        <g key={y}>
          <Rect x={44} y={y} w={132} h={16} className={styles.tile} />
          <Copy x={52} y={y + 8} w={w} quiet />
        </g>
      ))}
      {/* Found: the third row lights as in Audits, its halo first, then the row solid with the warning
          knocked out of it. */}
      <GrowIn>
        <Rect x={38} y={96} w={144} h={28} rx={10} className={styles.halo} />
        <Rect x={44} y={102} w={132} h={16} className={styles.solid} />
        <Glyph name="danger-triangle" cx={110} cy={110} size={12} className={styles.glyphOn} />
      </GrowIn>
      {/* The audit: down the screen's side, then in at the one row. */}
      <TraceIn d="M190,50 L204,50 A6,6 0 0 1 210,56 L210,104 A6,6 0 0 1 204,110 L197,110" />
      <GrowIn>
        <ArrowLeft x={190} y={110} />
      </GrowIn>
      <circle className={styles.node} cx="190" cy="50" r="2.5" />
    </>
  );
}

/** Prototype Readiness Review: the prototype's one core workflow taken past the happy path; the steps
 *  the demo proved are ticked, the moment it skipped is found (the gap map's first line). */
function SpecialistReadiness() {
  return (
    <>
      <Rect x={30} y={30} w={110} h={120} rx={8} className={styles.trailFrame} />
      <Copy x={44} y={50} w={48} quiet />
      <Copy x={44} y={62} w={70} />
      <Rect x={44} y={112} w={56} h={18} rx={9} className={styles.tile} />
      <Cursor x={88} y={122} />
      <Hop x1={140} x2={176} y={90} />
      <Rect x={176} y={30} w={114} h={120} rx={8} className={styles.frame} />
      <Glyph name="check-circle" cx={192} cy={56} size={12} className={styles.glyph} />
      <Copy x={204} y={56} w={56} />
      <Glyph name="check-circle" cx={192} cy={84} size={12} className={styles.glyph} />
      <Copy x={204} y={84} w={44} />
      <Hatched x={186} y={104} w={70} h={20} />
      <Focus x={272} y={114} glyph="danger-triangle" size={12} />
    </>
  );
}

/* ── A worked example: Dealpath ──────────────────────────────────────────────────
   Drawn on a 400 × 220 board and set into the 320 × 180 plate at 0.82, so the listing card, its
   "Add to pipeline" action and the pipeline column read at the plate's size. The two drawings share
   every part but the change.

   The PROPERTY has an identity: its picture is the soft blue tile, on the listing and on every deal
   for it, and every other deal's picture is quiet. So a duplicate reads as a twin of the deal already
   there, without words (owner, 26 Oct 2026: "the problem graphic doesn't look like a problem"). */

/** The listing card: this property's picture, its name and place, its line, its action. */
function Listing() {
  return (
    <>
      <Rect x={20} y={50} w={140} h={120} rx={8} className={styles.frame} />
      <Rect x={32} y={62} w={44} h={44} className={styles.soft} />
      <Copy x={86} y={70} w={56} />
      <Copy x={86} y={84} w={40} quiet />
      <Copy x={86} y={98} w={48} quiet />
      <Copy x={32} y={124} w={104} quiet />
      <Rect x={84} y={142} w={64} h={18} className={styles.solid} />
      <Glyph name="arrow-right" cx={96} cy={151} size={10} className={styles.glyphOn} />
      <path className={styles.tick} d="M106,151 L138,151" />
    </>
  );
}

/** A deal in the pipeline: its property's picture (this one's soft blue, any other's quiet) and two lines. */
function Deal({
  y,
  ours = false,
  className,
}: {
  y: number;
  ours?: boolean;
  className: string | undefined;
}) {
  return (
    <>
      <Rect x={238} y={y} w={104} h={36} className={className} />
      <Rect
        x={246}
        y={y + 8}
        w={20}
        h={20}
        rx={3}
        className={ours ? styles.soft : styles.tile}
      />
      <Copy x={274} y={y + 13} w={52} quiet={!ours} />
      <Copy x={274} y={y + 25} w={36} quiet />
    </>
  );
}

/** The pipeline column: another property's deal, then this property's, already there. */
function Pipeline({ found = false }: { found?: boolean }) {
  return (
    <>
      <Rect x={230} y={24} w={120} h={166} rx={8} className={styles.frameQuiet} />
      <Copy x={238} y={36} w={44} quiet />
      <Deal y={46} className={styles.tile} />
      {found ? <Rect x={232} y={84} w={116} h={48} rx={10} className={styles.halo} /> : null}
      <Deal y={90} ours className={found ? styles.region : styles.tile} />
    </>
  );
}

/** The problem: "Add to pipeline" always made a new deal, so the property's deal is there twice. */
function CaseDealpathProblem() {
  return (
    <g transform="translate(-6,-6) scale(0.82)">
      <Pipeline />
      <Deal y={133} ours className={styles.frame} />
      <Hop x1={148} x2={238} y={151} />
      {/* The twins, joined: the deal that was there and the one the button just made. */}
      <path
        className={styles.trail}
        d="M342,108 L350,108 Q356,108 356,114 L356,145 Q356,151 350,151 L342,151"
      />
      <Focus x={376} y={130} glyph="danger-triangle" size={12} />
      <Listing />
    </g>
  );
}

/** What we did: the same action searches first, finds the deal and adds to it; the second slot stays empty. */
function CaseDealpathDid() {
  return (
    <g transform="translate(-6,-6) scale(0.82)">
      <Pipeline found />
      <Hatched x={238} y={133} w={104} h={36} />
      <path
        className={styles.line}
        d="M148,151 L208,151 Q214,151 214,145 L214,114 Q214,108 220,108 L231,108"
      />
      <ArrowRight x={238} y={108} />
      <circle className={styles.node} cx="148" cy="151" r="2.5" />
      <Lens x={318} y={102} r={14} />
      <Listing />
    </g>
  );
}

/** A tile set's way onward (the Bento CTA card, drawn beside its words): one screen, and a route out of
 *  it to the flag it leads to. */
function OfferRoute() {
  return (
    <>
      <Rect x={30} y={44} w={100} h={92} rx={8} className={styles.frame} />
      <Copy x={44} y={62} w={40} quiet />
      <Rect x={44} y={76} w={60} h={40} className={styles.tile} />
      <Focus x={232} y={90} glyph="flag" size={12} />
      <Hop x1={130} x2={214} y={90} />
    </>
  );
}

export const OFFER: Record<OfferSceneName, () => ReactNode> = {
  'outcome-explain': OutcomeExplain,
  'outcome-rules': OutcomeRules,
  'outcome-build': OutcomeBuild,
  'outcome-finished': OutcomeFinished,
  'outcome-brief': OutcomeBrief,
  'symptom-stuck': SymptomStuck,
  'symptom-messy': SymptomMessy,
  'symptom-test': SymptomTest,
  'symptom-consistent': SymptomConsistent,
  'symptom-match': SymptomMatch,
  'specialist-research': SpecialistResearch,
  'specialist-ia': SpecialistIa,
  'specialist-ui': SpecialistUi,
  'specialist-dataviz': SpecialistDataviz,
  'specialist-prototype': SpecialistPrototype,
  'specialist-new-product': SpecialistNewProduct,
  'specialist-audit': SpecialistAudit,
  'specialist-readiness': SpecialistReadiness,
  'offer-route': OfferRoute,
  'case-dealpath-problem': CaseDealpathProblem,
  'case-dealpath-did': CaseDealpathDid,
};

/** Each specialist scene's drawn edge in the 320 × 180 drawing, for the bento's bare frame. */
export const OFFER_DRAWN: Partial<
  Record<OfferSceneName, readonly [number, number, number, number]>
> = {
  'specialist-research': [36, 46, 268, 88],
  'specialist-ia': [26, 16, 272, 138],
  'specialist-ui': [26, 26, 268, 128],
  'specialist-dataviz': [26, 36, 268, 108],
  'specialist-prototype': [36, 15, 244, 144],
  'specialist-new-product': [26, 26, 268, 128],
  'specialist-audit': [26, 26, 190, 128],
  'specialist-readiness': [26, 26, 294, 154],
  'offer-route': [26, 26, 268, 128],
};
