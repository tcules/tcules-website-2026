import type { ReactNode } from 'react';

import type { L1SpecialistScene } from '@/lib/sketches';

import { ArrowLeft, ArrowRight, ArrowUp, Copy, Hop, Lens, Rect } from './offer';
import { Focus, Glyph, GrowIn, Hatched, Move, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/**
 * The SPECIALIST scenes of the six service lines (round 5, 30 Oct 2026): each service tile's drawing,
 * from that service's own name and table line, drawn bare on the bento (inside x 30–290, y 30–150).
 * The same drawing wherever the service is named (@/lib/sketches SPECIALIST_BY_ROUTE).
 */

/**
 * Copilots and agents: the AI agent (its panel headed by the stars mark) runs down its plan, step by step, and hands the result back into the
 * empty slot in the person's screen. Motion: the route draws through the three steps and back (1), and
 * the slot it lands on lights (3).
 */
function AiCopilots() {
  return (
    <>
      {/* The person's screen, its slot for the result still empty. */}
      <Rect x={30} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={50} w={52} quiet />
      <Copy x={46} y={62} w={76} />
      <Copy x={46} y={74} w={60} />
      <Copy x={46} y={94} w={84} />
      <GrowIn>
        <Rect x={40} y={114} w={96} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={46} y={120} w={84} h={20} className={styles.press} />
      {/* The agent's panel: its plan, three steps. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={226} cy={50} size={12} className={styles.glyphQuiet} />
      <Copy x={238} y={50} w={32} quiet />
      {[70, 90, 110].map((y, i) => (
        <g key={y}>
          <circle className={styles.frameQuiet} cx="210" cy={y} r="4" />
          <Copy x={222} y={y} w={[48, 36, 52][i] ?? 40} />
        </g>
      ))}
      <circle className={styles.node} cx="210" cy="50" r="2.5" />
      {/* Plan, act, hand back: the route runs down through each step and back into the screen. */}
      <TraceIn d="M210,50 L210,66 M210,74 L210,86 M210,94 L210,106 M210,114 L210,124 A6,6 0 0 1 204,130 L136,130" />
      <GrowIn>
        <path className={styles.solid} d="M130,130 L136,126 L136,134 Z" />
      </GrowIn>
      {[190, 150].map((x) => (
        <GrowIn key={x}>
          <circle className={styles.nodeOpen} cx={x} cy="130" r="3" />
        </GrowIn>
      ))}
    </>
  );
}

/** Search and recommendations: the generated answer's line, traced to the one source it came from,
 *  which lights (a line that lands on a highlight, patterns 1 + 3). */
function AiSearch() {
  return (
    <>
      {/* The answer screen: the query, the generated answer, its cited line with the citation chip. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Rect x={42} y={42} w={76} h={20} rx={10} className={styles.tile} />
      <Copy x={54} y={52} w={36} quiet />
      <Glyph name="stars" cx={50} cy={76} size={12} className={styles.glyph} />
      <Copy x={62} y={76} w={44} />
      <Copy x={46} y={90} w={44} quiet />
      <Rect x={98} y={84} w={20} h={12} rx={6} className={styles.tile} />
      <Copy x={46} y={106} w={68} />
      <Copy x={46} y={120} w={52} />
      <Copy x={46} y={134} w={36} />
      <circle className={styles.node} cx="130" cy="90" r="2.5" />
      {/* The sources: three documents; the cited one lights when the line reaches it. */}
      {[50, 90].map((y) => (
        <g key={y}>
          <Rect x={210} y={y - 10} w={74} h={20} className={styles.tile} />
          <Glyph name="document-text" cx={224} cy={y} size={12} className={styles.glyphQuiet} />
          <Copy x={236} y={y} w={y === 50 ? 32 : 24} quiet />
        </g>
      ))}
      <TraceIn d="M130,90 L144,90 A6,6 0 0 1 150,96 L150,124 A6,6 0 0 0 156,130 L203,130" />
      <GrowIn>
        <Rect x={204} y={114} w={86} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={210} y={120} w={74} h={20} className={styles.press} />
      <GrowIn>
        <ArrowRight x={210} y={130} />
      </GrowIn>
    </>
  );
}

/**
 * Human in the loop: the AI's output reaches the product only by a route that dips down through the
 * person who signs it off. At rest the draft, the person and the empty slot stand apart; on hover the
 * loop draws through the person and the output lights in its place (patterns 1 + 3).
 */
function AiHitl() {
  return (
    <>
      {/* The AI's draft. */}
      <Rect x={50} y={30} w={80} h={60} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={66} cy={46} size={12} className={styles.glyph} />
      <Copy x={78} y={46} w={32} quiet />
      <Rect x={66} y={60} w={48} h={16} className={styles.tile} />
      {/* The person it must pass. */}
      <circle className={styles.frame} cx="170" cy="130" r="20" />
      <Glyph name="user" cx={170} cy={130} size={20} className={styles.glyph} />
      {/* The product, its slot empty. */}
      <Rect x={210} y={30} w={80} h={60} rx={8} className={styles.frame} />
      <Copy x={226} y={46} w={40} quiet />
      <GrowIn>
        <Rect x={220} y={54} w={60} h={28} rx={8} className={styles.halo} />
      </GrowIn>
      <Rect x={226} y={60} w={48} h={16} className={styles.press} />
      {/* The loop draws through the person. */}
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      <TraceIn d="M90,90 L90,124 A6,6 0 0 0 96,130 L150,130" />
      <TraceIn d="M190,130 L244,130 A6,6 0 0 0 250,124 L250,90" />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="150" cy="130" r="3" />
      </GrowIn>
      <GrowIn>
        <circle className={styles.nodeOpen} cx="190" cy="130" r="3" />
      </GrowIn>
      <GrowIn>
        <circle className={styles.nodeOpen} cx="250" cy="90" r="3" />
      </GrowIn>
    </>
  );
}

/**
 * Trust, control, recovery: the AI's change, marked as the AI's, is taken back to the person's own
 * version. At rest the screen carries one line marked with the AI's stars, beside three saved versions
 * (separate rows, no chain); on hover the route runs back from the AI's line to the earliest version,
 * which lights restored with the undo mark knocked out of it (patterns 1 + 3).
 */
function AiTrust() {
  return (
    <>
      {/* The saved versions: three rows, the one to go back to at the top, its undo mark waiting. */}
      <GrowIn>
        <Rect x={34} y={34} w={82} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={40} y={40} w={70} h={20} className={styles.press} />
      <Glyph name="undo-left" cx={54} cy={50} size={14} className={styles.releaseMark} />
      <Copy x={66} y={50} w={30} />
      <Rect x={40} y={80} w={70} h={20} className={styles.tile} />
      <Copy x={52} y={90} w={36} quiet />
      <Rect x={40} y={120} w={70} h={20} className={styles.tile} />
      <Copy x={52} y={130} w={24} quiet />
      {/* The screen, its one line the AI's change, marked with the stars. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={50} w={64} quiet />
      <Copy x={186} y={62} w={88} quiet />
      <Rect x={180} y={78} w={100} h={24} className={styles.tile} />
      <Glyph name="stars" cx={196} cy={90} size={14} className={styles.glyph} />
      <Copy x={212} y={90} w={52} />
      <Copy x={186} y={118} w={80} quiet />
      <Copy x={186} y={130} w={56} quiet />
      {/* Taken back: the route runs from the AI's line at the screen's edge to the earlier version. */}
      <circle className={styles.node} cx="170" cy="90" r="2.5" />
      <TraceIn d="M170,90 L156,90 A6,6 0 0 1 150,84 L150,56 A6,6 0 0 0 144,50 L117,50" />
      <GrowIn>
        <ArrowLeft x={110} y={50} />
      </GrowIn>
    </>
  );
}

/**
 * Readiness: the AI feature already in use, its problems flagged, is reviewed into a report of fixes
 * ranked by size, and the first fix lights. Motion: the route draws into the report (1) and lands on
 * the highlight (3), as in Audits.
 */
function AiReadiness() {
  return (
    <>
      {/* The AI feature in use, flagged where it goes wrong. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={46} cy={48} size={14} className={styles.glyph} />
      <Copy x={60} y={48} w={34} quiet />
      <Rect x={42} y={74} w={40} h={32} className={styles.tile} />
      <Copy x={50} y={86} w={24} />
      <Copy x={50} y={96} w={16} quiet />
      <Glyph name="danger-triangle" cx={94} cy={90} size={14} className={styles.glyph} />
      <Copy x={42} y={130} w={40} quiet />
      <Glyph name="danger-triangle" cx={94} cy={130} size={10} className={styles.glyph} />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      {/* The report: the fixes, ranked, the largest first. */}
      <Rect x={160} y={30} w={130} h={120} rx={8} className={styles.frame} />
      <TraceIn d="M110,90 L144,90 A6,6 0 0 0 150,84 L150,56 A6,6 0 0 1 156,50 L165,50" />
      {/* The port where the route enters the report, landing as the pen reaches it. */}
      <GrowIn>
        <circle className={styles.node} cx="160" cy="50" r="2.5" />
      </GrowIn>
      <GrowIn>
        <Rect x={166} y={34} w={112} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={172} y={40} w={100} h={20} className={styles.press} />
      <GrowIn>
        <ArrowRight x={172} y={50} />
      </GrowIn>
      <Rect x={172} y={80} w={76} h={20} className={styles.tile} />
      <Copy x={184} y={90} w={40} quiet />
      <Rect x={172} y={120} w={52} h={20} className={styles.tile} />
      <Copy x={184} y={130} w={20} quiet />
    </>
  );
}

/**
 * AI product engineering: design and code run together into the product, and the AI feature's slot
 * lights, built. At rest the design and the code sit apart from an empty AI slot in the product; on
 * hover both routes draw, meet, and land on the slot, which is highlighted as in Audits (1 + 3).
 */
function AiEngineering() {
  return (
    <>
      {/* The design and the code, each with its port. */}
      <Rect x={30} y={30} w={80} h={40} rx={8} className={styles.frame} />
      <Rect x={40} y={42} w={16} h={16} className={styles.chip} />
      <Glyph name="ruler-pen" cx={48} cy={50} size={10} className={styles.glyph} />
      <Copy x={64} y={50} w={30} />
      <circle className={styles.node} cx="110" cy="50" r="2.5" />
      <Rect x={30} y={110} w={80} h={40} rx={8} className={styles.frame} />
      <Rect x={40} y={122} w={16} h={16} className={styles.chip} />
      <Glyph name="code" cx={48} cy={130} size={10} className={styles.glyph} />
      <Copy x={64} y={130} w={24} />
      <circle className={styles.node} cx="110" cy="130" r="2.5" />
      {/* The product, its AI feature's slot still empty. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={190} y={50} w={52} quiet />
      <Copy x={190} y={62} w={36} />
      <GrowIn>
        <Rect x={184} y={72} w={92} h={36} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={190} y={78} w={80} h={24} className={styles.press} />
      <Glyph name="stars" cx={230} cy={90} size={14} className={styles.releaseMark} />
      <Rect x={190} y={118} w={36} h={16} className={styles.tile} />
      <Rect x={234} y={118} w={36} h={16} className={styles.tile} />
      {/* Both routes draw, meet, and land on the slot. */}
      <TraceIn d="M110,50 L144,50 A6,6 0 0 1 150,56 L150,84 A6,6 0 0 0 156,90 L183,90" />
      <TraceIn d="M110,130 L144,130 A6,6 0 0 0 150,124 L150,96 A6,6 0 0 1 156,90 L183,90" />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="170" cy="90" r="3" />
        <ArrowRight x={190} y={90} />
      </GrowIn>
    </>
  );
}

/**
 * Strategy: several products narrow down to the first step of one ordered plan, the part they all share,
 * which is what to build first. Run top to bottom so it never mirrors Implementation's left-to-right
 * pipeline. Rest: three products above an unordered plan. Hover: their routes draw and merge (pattern 1)
 * down onto the plan's first step, which is highlighted (pattern 3).
 */
function DsStrategy() {
  return (
    <>
      {/* Three products in a row, each carrying the same part. */}
      {[30, 120, 210].map((x) => (
        <g key={x}>
          <Rect x={x} y={30} w={60} h={40} rx={8} className={styles.frameQuiet} />
          <Copy x={x + 12} y={42} w={30} quiet />
          <Rect x={x + 12} y={52} w={26} h={8} className={styles.tile} />
        </g>
      ))}
      {/* The plan: ordered steps side by side; the first is the one every product needs. */}
      <Rect x={30} y={100} w={240} h={50} rx={8} className={styles.frame} />
      <GrowIn>
        <Rect x={34} y={104} w={82} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={40} y={110} w={70} h={20} className={styles.press} />
      <Rect x={124} y={110} w={70} h={20} className={styles.tile} />
      <Copy x={134} y={120} w={32} quiet />
      <Rect x={208} y={110} w={52} h={20} className={styles.tile} />
      <Copy x={218} y={120} w={20} quiet />
      {/* The three routes draw down and merge onto the first step. */}
      <TraceIn d="M60,70 L60,93" />
      <TraceIn d="M240,70 L240,80 A6,6 0 0 1 234,86 L66,86 A6,6 0 0 0 60,92" />
      <TraceIn d="M150,70 L150,86" />
      {[60, 150, 240].map((x) => (
        <circle key={x} className={styles.node} cx={x} cy="70" r="2.5" />
      ))}
      <GrowIn>
        <circle className={styles.node} cx="150" cy="86" r="3.5" />
        <path className={styles.solid} d="M60,100 L56,93 L64,93 Z" />
      </GrowIn>
    </>
  );
}

/**
 * Implementation: one line carries the foundations through the Figma library into the coded component.
 * At rest the three stages stand unconnected; on hover the foundations' bus draws into the library, on
 * through to code, and the documented component there lights (patterns 1 + 3: a line, a highlight).
 */
function DsImplementation() {
  return (
    <>
      {/* The foundations: colour, type, spacing. */}
      <Rect x={30} y={40} w={20} h={20} className={styles.frameQuiet} />
      <circle className={styles.tile} cx="40" cy="50" r="5" />
      <Rect x={30} y={80} w={20} h={20} className={styles.frameQuiet} />
      <Copy x={35} y={86} w={10} />
      <Copy x={35} y={94} w={6} quiet />
      <Rect x={30} y={120} w={20} h={20} className={styles.frameQuiet} />
      <Rect x={35} y={125} w={4} h={10} rx={1} className={styles.tile} />
      <Rect x={41} y={125} w={4} h={10} rx={1} className={styles.tile} />
      {[50, 90, 130].map((y) => (
        <circle key={y} className={styles.node} cx="50" cy={y} r="2.5" />
      ))}
      {/* The Figma library: its components. */}
      <Rect x={110} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Rect x={118} y={38} w={16} h={16} className={styles.chip} />
      <Glyph name="ruler-pen" cx={126} cy={46} size={10} className={styles.glyph} />
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <Rect key={`${r}${c}`} x={122 + c * 32} y={70 + r * 36} w={24} h={24} className={styles.tile} />
        )),
      )}
      {/* The code: the component, with its documentation under it. */}
      <Rect x={230} y={30} w={60} h={120} rx={8} className={styles.frame} />
      <Rect x={238} y={38} w={16} h={16} className={styles.chip} />
      <Glyph name="code" cx={246} cy={46} size={10} className={styles.glyph} />
      <Copy x={244} y={64} w={28} quiet />
      <GrowIn>
        <Rect x={238} y={74} w={44} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={244} y={80} w={32} h={20} className={styles.press} />
      <Copy x={244} y={118} w={32} quiet />
      <Copy x={244} y={130} w={20} quiet />
      {/* The line: the bus out of the foundations, into the library, on into code. */}
      <TraceIn d="M50,50 L64,50 A6,6 0 0 1 70,56 L70,90" />
      <TraceIn d="M50,130 L64,130 A6,6 0 0 0 70,124 L70,90" />
      <TraceIn d="M50,90 L110,90 M190,90 L230,90" />
      <GrowIn>
        <circle className={styles.node} cx="70" cy="90" r="3.5" />
      </GrowIn>
      {[110, 190, 230].map((x) => (
        <GrowIn key={x}>
          <circle className={styles.nodeOpen} cx={x} cy="90" r="3" />
        </GrowIn>
      ))}
    </>
  );
}

/**
 * Alignment: the one button, in the Figma library above and in the coded components below, checked as
 * the same. At rest the two copies stand apart; on hover a line draws out of each (pattern 1) and the
 * two meet in the one check, which grows (pattern 2).
 */
function DsAlignment() {
  return (
    <>
      {/* The two copies of the button, at the same place in each: the library, then the code. */}
      {[
        { y: 30, glyph: 'layers' as const, copy: 52 },
        { y: 110, glyph: 'code-square' as const, copy: 40 },
      ].map(({ y, glyph, copy }) => (
        <g key={y}>
          <Rect x={30} y={y} w={200} h={40} rx={8} className={styles.frame} />
          <Rect x={40} y={y + 12} w={16} h={16} className={styles.chip} />
          <Glyph name={glyph} cx={48} cy={y + 20} size={10} className={styles.glyph} />
          <Copy x={70} y={y + 20} w={copy} quiet />
          <Rect x={150} y={y + 10} w={60} h={20} rx={10} className={styles.tile} />
          <circle className={styles.node} cx="230" cy={y + 20} r="2.5" />
        </g>
      ))}
      {/* A line out of each copy; the two meet in the check. */}
      <TraceIn d="M230,50 L264,50 A6,6 0 0 1 270,56 L270,79" />
      <TraceIn d="M230,130 L264,130 A6,6 0 0 0 270,124 L270,101" />
      <GrowIn>
        <Focus x={270} y={90} glyph="check-circle" size={12} />
      </GrowIn>
    </>
  );
}

/**
 * Governance & adoption: one team's contribution enters the library and goes back out to every team.
 * At rest the team stands apart from the library, its open slot empty, the other teams unconnected; on
 * hover the line draws in, the slot it lands on lights, and the line fans out to all three teams
 * (patterns 1 + 3: a line, a highlight).
 */
function DsGovernance() {
  return (
    <>
      {/* The contributing team. */}
      <Glyph name="users-group-rounded" cx={50} cy={90} size={20} className={styles.glyphQuiet} />
      <circle className={styles.node} cx="70" cy="90" r="2.5" />
      {/* The library: its parts, and the open slot the contribution takes. */}
      <Rect x={110} y={30} w={100} h={120} rx={8} className={styles.frame} />
      {[42, 116].map((y) =>
        [122, 164].map((x) => <Rect key={`${x}${y}`} x={x} y={y} w={34} h={22} className={styles.tile} />),
      )}
      <GrowIn>
        <Rect x={116} y={74} w={88} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={122} y={80} w={76} h={20} className={styles.press} />
      {/* Every team it is released to. */}
      {[50, 90, 130].map((y) => (
        <Glyph key={y} name="users-group-rounded" cx={278} cy={y} size={20} className={styles.glyphQuiet} />
      ))}
      {/* In from the team, and out to every team. */}
      <TraceIn d="M70,90 L103,90" />
      <TraceIn d="M210,90 L257,90" />
      <TraceIn d="M210,90 L224,90 A6,6 0 0 0 230,84 L230,56 A6,6 0 0 1 236,50 L257,50" />
      <TraceIn d="M210,90 L224,90 A6,6 0 0 1 230,96 L230,124 A6,6 0 0 0 236,130 L257,130" />
      <GrowIn>
        <ArrowRight x={110} y={90} />
      </GrowIn>
      <GrowIn>
        <circle className={styles.node} cx="230" cy="90" r="3.5" />
      </GrowIn>
      {[50, 90, 130].map((y) => (
        <GrowIn key={y}>
          <ArrowRight x={264} y={y} />
        </GrowIn>
      ))}
    </>
  );
}

/**
 * Audit: the library's part is traced into the product, and where the product's copy has drifted off it
 * the break is flagged. At rest the product just carries a loose dashed copy; on hover the route draws
 * from the library to that copy and the warning grows beside it (patterns 1 + 2: a line, a circle).
 */
function DsAudit() {
  return (
    <>
      {/* The library: its parts, the middle one on the route's line. */}
      <Rect x={30} y={40} w={60} h={100} rx={8} className={styles.frame} />
      {[52, 80, 108].map((y) => (
        <Rect key={y} x={42} y={y} w={36} h={20} className={styles.tile} />
      ))}
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      {/* The product: two parts that match, one local copy that drifted, and its page copy. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Rect x={162} y={44} w={36} h={20} className={styles.tile} />
      <Rect x={206} y={44} w={36} h={20} className={styles.tile} />
      <Rect x={190} y={80} w={40} h={20} className={styles.trailFrame} />
      <Copy x={162} y={118} w={68} quiet />
      <Copy x={162} y={130} w={44} quiet />
      {/* The trace: from the library into the product, onto the drifted copy; the break is flagged. */}
      <TraceIn d="M90,90 L183,90" />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="150" cy="90" r="3" />
      </GrowIn>
      <GrowIn>
        <ArrowRight x={190} y={90} />
      </GrowIn>
      <GrowIn>
        <Focus x={254} y={90} glyph="danger-triangle" size={12} />
      </GrowIn>
    </>
  );
}

/**
 * Redesign: the aged screen is redrawn clean while both stand on the one technology base that stays.
 * (Replatforming beside it swaps the base; here a single base runs under both screens.) Motion: the
 * route draws from the old screen to the new (1) and the new screen's main action lights (3).
 */
function Redesign() {
  return (
    <>
      {/* The aged screen: crowded, every part fighting for room. */}
      <Rect x={30} y={30} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Copy x={40} y={42} w={34} quiet />
      <Rect x={80} y={38} w={20} h={8} rx={2} className={styles.tile} />
      <Rect x={40} y={50} w={26} h={12} rx={2} className={styles.tile} />
      <Copy x={72} y={56} w={28} quiet />
      <Copy x={40} y={70} w={56} quiet />
      {[40, 61, 82].map((x) => (
        <Rect key={x} x={x} y={78} w={18} h={10} rx={2} className={styles.tile} />
      ))}
      <Copy x={40} y={98} w={22} quiet />
      <Copy x={68} y={98} w={32} quiet />
      {/* The route from old to new. */}
      <circle className={styles.node} cx="110" cy="70" r="2.5" />
      <TraceIn d="M110,70 L203,70" />
      <GrowIn>
        <ArrowRight x={210} y={70} />
      </GrowIn>
      {/* The redrawn screen: one clear action, which lights. */}
      <Rect x={210} y={30} w={80} h={80} rx={8} className={styles.frame} />
      <Copy x={222} y={44} w={40} quiet />
      <GrowIn>
        <Rect x={216} y={56} w={68} h={28} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={222} y={62} w={56} h={16} className={styles.press} />
      <Rect x={222} y={90} w={24} h={12} className={styles.tile} />
      <Rect x={254} y={90} w={24} h={12} className={styles.tile} />
      {/* The technology the client has, one base under both, unchanged. */}
      <Rect x={30} y={130} w={260} h={20} className={styles.tile} />
      <Glyph name="server" cx={46} cy={140} size={12} className={styles.glyphQuiet} />
      <Copy x={60} y={140} w={40} quiet />
      <Glyph name="database" cx={274} cy={140} size={12} className={styles.glyphQuiet} />
      <Copy x={220} y={140} w={40} quiet />
    </>
  );
}

/**
 * Legacy: the system is half rebuilt, half still the old hatched code; the map of its hidden rules
 * routes down into the next old stage, which is rebuilt and lights. Motion: the route draws from the
 * map (1), and the next stage is highlighted as it fills (3).
 */
function Legacy() {
  return (
    <>
      {/* The map of the old system's hidden rules. */}
      <Rect x={30} y={30} w={100} h={40} rx={8} className={styles.frame} />
      <Glyph name="notebook" cx={46} cy={50} size={12} className={styles.glyph} />
      <Copy x={58} y={44} w={48} />
      <Copy x={58} y={56} w={32} quiet />
      {/* The system: two stages rebuilt, two still old. */}
      <Rect x={30} y={90} w={260} h={60} rx={8} className={styles.frame} />
      {[46, 106].map((x) => (
        <g key={x}>
          <Rect x={x} y={100} w={48} h={40} className={styles.tile} />
          <Copy x={x + 10} y={114} w={28} />
          <Copy x={x + 10} y={126} w={18} quiet />
        </g>
      ))}
      <Hatched x={166} y={100} w={48} h={40} />
      <Hatched x={226} y={100} w={48} h={40} />
      {/* The next stage, rebuilt from the map: it lights over its old hatching (outset a stroke). */}
      <GrowIn>
        <Rect x={160} y={94} w={60} h={52} rx={10} className={styles.halo} />
      </GrowIn>
      <GrowIn>
        <Rect x={165} y={99} w={50} h={42} rx={5} className={styles.solid} />
        <path className={styles.tick} d="M176,114 L204,114 M176,126 L194,126" />
      </GrowIn>
      <circle className={styles.node} cx="130" cy="50" r="2.5" />
      <TraceIn d="M130,50 L184,50 A6,6 0 0 1 190,56 L190,83" />
      <GrowIn>
        <path className={styles.solid} d="M190,90 L186,83 L194,83 Z" />
      </GrowIn>
    </>
  );
}

/**
 * Replatforming: the customer's screen stays where it is while its line is rerouted from the old
 * platform under it (dashed, on its way out) to the new one. Motion: the route draws down from the
 * screen and across to the new platform (1), and the new platform's block lights (3).
 */
function Replatforming() {
  return (
    <>
      {/* The customer's screen, unchanged. */}
      <Rect x={100} y={30} w={100} h={60} rx={8} className={styles.frame} />
      <Glyph name="user" cx={122} cy={50} size={14} className={styles.glyph} />
      <Copy x={136} y={50} w={44} />
      <Rect x={116} y={62} w={68} h={16} className={styles.tile} />
      {/* The old platform, on its way out, and the screen's old line to it. */}
      <path className={styles.trail} d="M150,90 L150,124 A6,6 0 0 1 144,130 L110,130" />
      <Rect x={30} y={110} w={80} h={40} rx={8} className={styles.trailFrame} />
      <Glyph name="server" cx={50} cy={130} size={16} className={styles.glyphQuiet} />
      <Copy x={66} y={130} w={28} quiet />
      {/* The new platform. */}
      <Rect x={210} y={110} w={80} h={40} rx={8} className={styles.frame} />
      <Glyph name="server" cx={228} cy={130} size={16} className={styles.glyphQuiet} />
      <GrowIn>
        <Rect x={242} y={116} w={44} h={28} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={248} y={122} w={32} h={16} className={styles.press} />
      {/* The route rerouted: down from the screen, across to the new platform. */}
      <TraceIn d="M150,90 L150,124 A6,6 0 0 0 156,130 L203,130" />
      <GrowIn>
        <ArrowRight x={210} y={130} />
      </GrowIn>
      <circle className={styles.node} cx="150" cy="90" r="2.5" />
    </>
  );
}

/**
 * Assessment: each part of the product gets its own route, and each route ends in its own verdict
 * (keep, redesign, rebuild), before any build. Motion: the three routes draw out from the parts (1)
 * and each verdict, an open circle at rest, fills as its route reaches it (2).
 */
function ModernisationAssessment() {
  const parts = [
    { y: 50, glyph: 'monitor', to: 124, verdict: 'check-circle' },
    { y: 90, glyph: 'code', to: 110, verdict: 'ruler-pen' },
    { y: 130, glyph: 'database', to: 96, verdict: 'refresh' },
  ] as const;
  return (
    <>
      {parts.map((p) => (
        <g key={p.y}>
          <Rect x={30} y={p.y - 12} w={120} h={24} className={styles.frame} />
          <Rect x={36} y={p.y - 8} w={16} h={16} className={styles.chip} />
          <Glyph name={p.glyph} cx={44} cy={p.y} size={10} className={styles.glyph} />
          <Copy x={60} y={p.y} w={p.to - 60} />
          <circle className={styles.node} cx={150} cy={p.y} r={2.5} />
          <TraceIn d={`M150,${p.y} L259,${p.y}`} />
          <circle className={styles.release} cx={270} cy={p.y} r={11} />
          <Glyph name={p.verdict} cx={270} cy={p.y} size={12} className={styles.releaseMark} />
        </g>
      ))}
    </>
  );
}

/**
 * SaaS app: a new module wired into the live web app, landing in its own new row mid-screen. At rest
 * the app (a browser window, its sidebar, a heading and the feature it already has) sits beside the new
 * module, its row empty; on hover the route draws up out of the module and into the app (1), and the
 * row it lands on lights, holding the module's mark (3).
 */
function SaasApp() {
  return (
    <>
      {/* The live web app: browser chrome, a sidebar, a heading, the feature it already has. */}
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      {[42, 52, 62].map((x) => (
        <circle key={x} className={styles.frameQuiet} cx={x} cy="43" r="3" />
      ))}
      <path className={styles.rule} d="M30,56 L190,56 M70,56 L70,150" />
      {[72, 84, 96].map((y, i) => (
        <Copy key={y} x={42} y={y} w={[16, 12, 14][i] ?? 12} quiet />
      ))}
      <Copy x={84} y={66} w={48} quiet />
      <Rect x={84} y={120} w={80} h={20} className={styles.tile} />
      <Copy x={94} y={130} w={40} quiet />
      {/* The new row the module takes, quiet until the route reaches it. */}
      <GrowIn>
        <Rect x={78} y={74} w={92} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={84} y={80} w={80} h={20} className={styles.press} />
      <Glyph name="widget" cx={124} cy={90} size={12} className={styles.releaseMark} />
      {/* The new module, built beside the app. */}
      <Rect x={220} y={110} w={60} h={40} rx={8} className={styles.frame} />
      <Glyph name="widget" cx={250} cy={130} size={24} className={styles.glyph} />
      <circle className={styles.node} cx="250" cy="110" r="2.5" />
      <TraceIn d="M250,110 L250,96 A6,6 0 0 0 244,90 L171,90" />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="190" cy="90" r="3" />
      </GrowIn>
      <GrowIn>
        <ArrowLeft x={164} y={90} />
      </GrowIn>
    </>
  );
}

/**
 * Frontend: one screen, built once, holds at every width. Desktop, tablet and phone carry the same
 * layout, its side panel dropping under the main one as the screen narrows. Motion: the route draws
 * from the desktop, under the tablet, up into the phone (1), and the side panel's place there lights (3).
 */
function Frontend() {
  return (
    <>
      {/* Desktop: the main panel and its side panel, side by side. */}
      <Rect x={30} y={30} w={120} h={80} rx={8} className={styles.frame} />
      <Copy x={44} y={44} w={40} quiet />
      <Rect x={44} y={54} w={56} h={42} className={styles.tile} />
      <Rect x={108} y={54} w={28} h={42} className={styles.tile} />
      {/* Tablet: the same layout, the side panel under the main one. */}
      <Rect x={170} y={30} w={60} h={90} rx={8} className={styles.frame} />
      <Copy x={180} y={44} w={24} quiet />
      <Rect x={180} y={54} w={40} h={34} className={styles.tile} />
      <Rect x={180} y={96} w={40} h={14} className={styles.tile} />
      {/* Phone: the same again, the side panel's place lit when the route reaches it. */}
      <Rect x={250} y={30} w={40} h={100} rx={8} className={styles.frame} />
      <Copy x={262} y={44} w={12} quiet />
      <Rect x={262} y={54} w={16} h={30} className={styles.tile} />
      <GrowIn>
        <Rect x={256} y={92} w={28} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={262} y={98} w={16} h={20} className={styles.press} />
      {/* The route: down from the desktop, under the tablet, up into the phone. */}
      <TraceIn d="M90,110 L90,144 A6,6 0 0 0 96,150 L264,150 A6,6 0 0 0 270,144 L270,137" />
      <GrowIn>
        <ArrowUp x={270} y={130} />
      </GrowIn>
      <circle className={styles.node} cx="90" cy="110" r="2.5" />
    </>
  );
}

/**
 * Backend and API: the product's call reaches the data only after it has passed sign-in and the
 * rules. At rest the product and the server's three layers stand apart; on hover the call draws out of
 * the product and down past sign-in and the rules (1), and the data it reaches lights (3).
 */
function Backend() {
  return (
    <>
      {/* The product making the call. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={50} w={40} quiet />
      <Rect x={46} y={66} w={48} h={36} className={styles.tile} />
      <Copy x={46} y={118} w={48} />
      <Copy x={46} y={130} w={32} />
      {/* The server: sign-in, the rules, and the data behind them. */}
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {(['key', 'checklist'] as const).map((g, i) => (
        <g key={g}>
          <Rect x={190} y={40 + i * 40} w={88} h={20} className={styles.tile} />
          <Glyph name={g} cx={204} cy={50 + i * 40} size={12} className={styles.glyphQuiet} />
          <Copy x={218} y={50 + i * 40} w={i === 0 ? 36 : 48} quiet />
        </g>
      ))}
      <GrowIn>
        <Rect x={184} y={114} w={100} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={190} y={120} w={88} h={20} className={styles.press} />
      <Glyph name="database" cx={204} cy={130} size={12} className={styles.releaseMark} />
      {/* The call: out of the product, down past sign-in and the rules, into the data. */}
      <circle className={styles.node} cx="110" cy="50" r="2.5" />
      <TraceIn d="M110,50 L164,50 A6,6 0 0 1 170,56 L170,124 A6,6 0 0 0 176,130 L183,130" />
      <GrowIn>
        <circle className={styles.nodeOpen} cx="150" cy="50" r="3" />
      </GrowIn>
      <GrowIn>
        <ArrowRight x={190} y={130} />
      </GrowIn>
    </>
  );
}

/**
 * Maintenance: the team that knows the product reaches straight into it and updates the one part that
 * needs it. Motion: the route draws from the team into the live screen (1), and the part it lands on
 * lights, its refresh mark knocked out of the fill (3).
 */
function Maintenance() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={46} y={50} w={52} quiet />
      <Copy x={46} y={62} w={76} />
      <Rect x={46} y={80} w={108} h={20} className={styles.tile} />
      <Copy x={54} y={90} w={40} quiet />
      <Rect x={46} y={120} w={36} h={20} className={styles.tile} />
      <GrowIn>
        <Rect x={90} y={114} w={70} h={32} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={96} y={120} w={58} h={20} className={styles.press} />
      <Glyph name="refresh" cx={125} cy={130} size={12} className={styles.releaseMark} />
      {/* The team, framed so the route leaves a port on its edge. */}
      <Rect x={230} y={50} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="users-group-rounded" cx={250} cy={70} size={24} className={styles.glyph} />
      <circle className={styles.node} cx="250" cy="90" r="2.5" />
      <TraceIn d="M250,90 L250,124 A6,6 0 0 1 244,130 L161,130" />
      <GrowIn>
        <ArrowLeft x={154} y={130} />
      </GrowIn>
    </>
  );
}

/**
 * Mobile: the task leaves the desk. A route runs from the desk (a quiet monitor) into the phone and
 * lands on its one action, under the thumb, which lights. Motion: the route draws (1) and lands on a
 * highlight (3).
 */
function Mobile() {
  return (
    <>
      {/* The desk, left behind. */}
      <Glyph name="monitor" cx={68} cy={95} size={44} className={styles.glyphQuiet} />
      <circle className={styles.node} cx="90" cy="90" r="2.5" />
      {/* The phone: its speaker, a heading, the task's card, and the one action in thumb reach. */}
      <Rect x={190} y={30} w={80} h={120} rx={12} className={styles.frame} />
      <Copy x={222} y={40} w={16} quiet />
      <Copy x={206} y={58} w={32} quiet />
      <Rect x={206} y={70} w={48} h={34} className={styles.tile} />
      <Copy x={214} y={84} w={24} />
      <GrowIn>
        <Rect x={200} y={116} w={60} h={28} rx={14} className={styles.halo} />
      </GrowIn>
      <Rect x={206} y={122} w={48} h={16} rx={8} className={styles.press} />
      {/* Off the desk, into the hand. */}
      <TraceIn d="M90,90 L144,90 A6,6 0 0 1 150,96 L150,124 A6,6 0 0 0 156,130 L183,130" />
      <GrowIn>
        <ArrowRight x={190} y={130} />
      </GrowIn>
    </>
  );
}

/**
 * Prototype review: the core workflow is taken off its happy path, down to the step nobody tried, which
 * lights. Motion: the route draws off the happy row (1) and lands on the highlighted step (3).
 */
function PrototypeReview() {
  return (
    <>
      {/* The happy path: three steps that pass, to the finish flag. */}
      {[30, 110, 190].map((x, i) => (
        <g key={x}>
          <Rect x={x} y={30} w={40} h={40} className={styles.tile} />
          <Glyph name="check-circle" cx={x + 20} cy={50} size={14} className={styles.glyphQuiet} />
          <path className={styles.rule} d={`M${x + 40},50 L${i < 2 ? x + 80 : 258},50`} />
        </g>
      ))}
      <Glyph name="flag" cx={270} cy={50} size={16} className={styles.glyphQuiet} />
      {/* Past it: the route leaves the second step for the case off the path, which lights. */}
      <circle className={styles.node} cx="130" cy="70" r="2.5" />
      <TraceIn d="M130,70 L130,104 A6,6 0 0 0 136,110 L210,110" />
      <GrowIn>
        <Rect x={204} y={84} w={72} h={52} rx={10} className={styles.halo} />
      </GrowIn>
      <Rect x={210} y={90} w={60} h={40} className={styles.press} />
    </>
  );
}

export const L1_SPECIALISTS: Record<L1SpecialistScene, () => ReactNode> = {
  'specialist-ai-copilots': AiCopilots,
  'specialist-ai-search': AiSearch,
  'specialist-ai-hitl': AiHitl,
  'specialist-ai-trust': AiTrust,
  'specialist-ai-readiness': AiReadiness,
  'specialist-ai-engineering': AiEngineering,
  'specialist-ds-strategy': DsStrategy,
  'specialist-ds-implementation': DsImplementation,
  'specialist-ds-alignment': DsAlignment,
  'specialist-ds-governance': DsGovernance,
  'specialist-ds-audit': DsAudit,
  'specialist-redesign': Redesign,
  'specialist-legacy': Legacy,
  'specialist-replatforming': Replatforming,
  'specialist-modernisation-assessment': ModernisationAssessment,
  'specialist-saas-app': SaasApp,
  'specialist-frontend': Frontend,
  'specialist-backend': Backend,
  'specialist-maintenance': Maintenance,
  'specialist-mobile': Mobile,
  'specialist-prototype-review': PrototypeReview,
};

/** Every specialist drawing stays inside x 30–290, y 30–150, its haloes included. */
export const L1_SPECIALISTS_DRAWN: Record<
  L1SpecialistScene,
  readonly [number, number, number, number]
> = {
  ...(Object.fromEntries(
    Object.keys(L1_SPECIALISTS).map((name) => [name, [26, 26, 268, 128] as const]),
  ) as Record<L1SpecialistScene, readonly [number, number, number, number]>),
  'specialist-ai-hitl': [46, 26, 248, 128],
  'specialist-ds-strategy': [26, 26, 248, 128],
  'specialist-prototype-review': [26, 26, 256, 114],
  'specialist-mobile': [46, 26, 228, 128],
  'specialist-frontend': [26, 26, 268, 128],
  'specialist-maintenance': [26, 26, 248, 128],};
