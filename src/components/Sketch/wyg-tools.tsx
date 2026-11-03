import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Cursor, Rect } from './offer';
import { Focus, Glide, Glyph, GrowIn, Hatched, TraceIn } from './scenes';
import styles from './Sketch.module.css';

/* /tools: the hub's tool tiles (DirectoryBand, 4 Nov 2026; tracker 2.57). Each is that tool's OWN
   scene, drawn from its own page's argument, shown wherever the tool is named as a tile
   (`serviceSceneFor`, @/lib/sketches). TILE scenes: drawn in the kit's flat grammar on the plate, and
   each makes ONE transform-only move when its tile is hovered (Move or GrowIn;
   decisions/2026-10-30-service-tile-drawing-moves-on-hover). The drift checker's and the prototype
   checklist's tiles take specialist-drift-checker and specialist-prototype-readiness-checklist
   (./wyg-glossary-destinations). Helpers come from ./offer and ./scenes, classes from
   ./Sketch.module.css. Each scene is undefined until it is drawn; the comment above it is the tool's
   title and words. */


/**
 * One AI use case set against the authority it may have: suggest, prepare or act, the most authority at
 * the top. The use case's route lands on the one rung agreed for it.
 */
function AiReadinessCheck() {
  const rungs: [number, IconName][] = [
    [50, 'bolt-circle'],
    [90, 'document-text'],
    [130, 'chat-round-dots'],
  ];
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={70} cy={78} size={24} className={styles.glyph} />
      <Copy x={50} y={108} w={40} quiet />
      <path className={styles.rule} d="M190,64 L190,76 M190,104 L190,116" />
      <GrowIn>
        <Rect x={164} y={70} w={132} h={40} rx={20} className={styles.halo} />
      </GrowIn>
      {rungs.map(([y, glyph]) =>
        y === 90 ? (
          <g key={y}>
            {/* The authority agreed for this use case: neutral until the route reaches it. */}
            <Rect x={170} y={y - 14} w={120} h={28} rx={14} className={styles.press} />
            <Glyph name={glyph} cx={190} cy={y} size={14} className={styles.releaseMark} />
            <Rect x={208} y={y - 1} w={44} h={2} rx={1} className={styles.releaseMark} />
          </g>
        ) : (
          <g key={y}>
            <Rect x={170} y={y - 14} w={120} h={28} rx={14} className={styles.tile} />
            <Glyph name={glyph} cx={190} cy={y} size={14} className={styles.glyph} />
            <Copy x={210} y={y} w={y === 50 ? 32 : 48} quiet />
          </g>
        ),
      )}
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <TraceIn d="M110,90 L163,90" />
      <GrowIn>
        <ArrowRight x={170} y={90} />
      </GrowIn>
    </>
  );
}

/**
 * One AI output on its way to the action it triggers: checked, then approved, then done, with the undo
 * running back from the action to the output.
 */
function AiTrustCanvas() {
  return (
    <>
      <Rect x={30} y={40} w={60} h={60} rx={8} className={styles.frame} />
      <Glyph name="stars" cx={60} cy={70} size={24} className={styles.glyph} />
      {(
        [
          [130, 'eye'],
          [190, 'user'],
        ] as const
      ).map(([x, glyph]) => (
        <g key={x}>
          <Rect x={x - 20} y={50} w={40} h={40} rx={8} className={styles.frame} />
          <Glyph name={glyph} cx={x} cy={70} size={20} className={styles.glyph} />
          <circle className={styles.node} cx={x - 20} cy={70} r="2.5" />
          <circle className={styles.node} cx={x + 20} cy={70} r="2.5" />
        </g>
      ))}
      <circle className={styles.node} cx={90} cy={70} r="2.5" />
      <TraceIn d="M90,70 L110,70 M150,70 L170,70 M210,70 L243,70" />
      <GrowIn>
        <ArrowRight x={250} y={70} />
      </GrowIn>
      <GrowIn>
        <Focus x={270} y={70} glyph="bolt-circle" size={12} />
      </GrowIn>
      {/* The undo: back from the action to the output, its mark on the way. */}
      <path
        className={styles.trail}
        d="M270,88 L270,124 A6,6 0 0 1 264,130 L202,130 M178,130 L66,130 A6,6 0 0 1 60,124 L60,107"
      />
      <path className={styles.quietMark} d="M60,100 L56,107 L64,107 Z" />
      <Glyph name="undo-left" cx={190} cy={130} size={16} className={styles.glyph} />
    </>
  );
}

/**
 * One component tested in its states, each ticked or flagged: empty, in error and focused pass; pressed
 * twice, it fails, and that is the correction flagged.
 */
function FidelityChecklist() {
  const xs = [30, 100, 170, 240];
  return (
    <>
      {xs.map((x) => (
        <Rect key={x} x={x} y={36} w={50} h={64} rx={8} className={styles.frame} />
      ))}
      {/* Empty. */}
      <Copy x={42} y={54} w={20} quiet />
      <Rect x={41} y={70} w={28} h={14} rx={7} className={styles.trailFrame} />
      {/* In error. */}
      <Copy x={112} y={54} w={14} quiet />
      <Rect x={111} y={70} w={28} h={14} rx={7} className={styles.tile} />
      <Glyph name="danger-triangle" cx={137} cy={53} size={10} className={styles.glyph} />
      {/* Focused: the ring around it. */}
      <Copy x={182} y={54} w={20} quiet />
      <Rect x={178} y={67} w={34} h={20} rx={10} className={styles.rule} />
      <Rect x={181} y={70} w={28} h={14} rx={7} className={styles.tile} />
      {/* Pressed twice. */}
      <Copy x={252} y={54} w={20} quiet />
      <Rect x={251} y={70} w={28} h={14} rx={7} className={styles.press} />
      <Glide x={10} y={30}>
        <Cursor x={268} y={78} />
      </Glide>
      {[55, 125, 195].map((x) => (
        <Glyph key={x} name="check-circle" cx={x} cy={128} size={16} className={styles.glyphQuiet} />
      ))}
      <GrowIn>
        <Focus x={265} y={128} glyph="flag" size={12} />
      </GrowIn>
    </>
  );
}

/**
 * One part of the product and the routes forking from it, compared side by side: modernise it in place,
 * redesign it, or rebuild it, not built yet.
 */
function RebuildWorksheet() {
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="widget" cx={70} cy={78} size={24} className={styles.glyph} />
      <Copy x={50} y={108} w={40} quiet />
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <TraceIn d="M110,90 L193,90 M150,90 L150,56 A6,6 0 0 1 156,50 L193,50 M150,90 L150,124 A6,6 0 0 0 156,130 L193,130" />
      <GrowIn>
        <circle className={styles.node} cx={150} cy={90} r="3.5" />
      </GrowIn>
      <GrowIn>
        <ArrowRight x={200} y={50} />
      </GrowIn>
      <GrowIn>
        <ArrowRight x={200} y={90} />
      </GrowIn>
      <GrowIn>
        <ArrowRight x={200} y={130} />
      </GrowIn>
      <Rect x={200} y={36} w={90} h={28} rx={8} className={styles.frame} />
      <Glyph name="refresh" cx={218} cy={50} size={14} className={styles.glyph} />
      <Copy x={234} y={50} w={40} quiet />
      <Rect x={200} y={76} w={90} h={28} rx={8} className={styles.frame} />
      <Glyph name="ruler-pen" cx={218} cy={90} size={14} className={styles.glyph} />
      <Copy x={234} y={90} w={32} quiet />
      <Hatched x={200} y={116} w={90} h={28} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI feature readiness checklist: agree what the AI may do before launch (/tools/ai-product-ux-readiness-check): The AI Product UX Readiness Check takes one AI use case through what the AI may do, what users can inspect and how mistakes get handled. You leave with the open questions and the tests to bring to your next product review. Draw: one AI use case carried through its six areas, its authority marked as suggest, prepare or act. */
  'specialist-ai-readiness-check': AiReadinessCheck,
  /* AI trust and control canvas: plan what people check, approve and undo (/tools/ai-trust-control-canvas): The AI Trust and Control Canvas follows one AI output to the action it can trigger. It ends in a short brief listing what people can check, approve and undo before that action happens. Draw: one AI output following its path to an action, with a check, an approve and an undo point on that path. */
  'specialist-ai-trust-canvas': AiTrustCanvas,
  /* Figma to Storybook checklist: test each component in every state (/tools/figma-storybook-fidelity-checklist): The Figma to Storybook Fidelity Checklist tests a component beyond its looks: keyboard paths, empty and error states, and buttons pressed twice. The result is a list of corrections someone else can check. Draw: one component shown in a run of its states (empty, error, focus, pressed twice), each state ticked or flagged. */
  'specialist-fidelity-checklist': FidelityChecklist,
  /* Redesign or rebuild worksheet: compare every route before you commit (/tools/audit-redesign-modernise-rebuild): The Audit, Redesign, Modernise or Rebuild worksheet compares at least two routes for one part of your product, including the move from old to new. It ends in the case for and against each route, and the next test before you commit. Draw: one part of a product with routes forking from it (repair, redesign, replace in stages, rebuild, retire), the move from old to new drawn along each route. */
  'specialist-rebuild-worksheet': RebuildWorksheet,
};
