import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowLeft, Copy, Rect } from './offer';
import { Glyph } from './scenes';
import styles from './Sketch.module.css';

/* /tools/figma-storybook-fidelity-checklist: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the corrections band's first paragraph. Each drawn from this page's own words. Helpers come
   from ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined until it is
   drawn; the comment above it is the item's title and words. */

/**
 * Escape closes the dialog and focus goes back to the button that opened it: from the dialog, the path
 * that jumps to the top of the page is dashed and ringed in the quiet ink; the corrected one runs down
 * to the button, which holds the focus ring.
 */
function ExampleDialogFocus() {
  return (
    <>
      <Rect x={30} y={30} w={260} h={120} rx={8} className={styles.frameQuiet} />
      {/* The top of the page, where focus wrongly lands. */}
      <Rect x={40} y={38} w={56} h={24} rx={12} className={styles.trailFrame} />
      <Rect x={48} y={44} w={40} h={12} rx={6} className={styles.tile} />
      {/* The button that opened the dialog, holding the focus ring again. */}
      <Rect x={44} y={114} w={72} h={32} rx={14} className={styles.halo} />
      <Rect x={50} y={120} w={60} h={20} rx={10} className={styles.frame} />
      <Copy x={66} y={130} w={28} />
      {/* The jump, not taken; the return, drawn. */}
      <path className={styles.trail} d="M170,90 L146,90 A6,6 0 0 1 140,84 L140,56 A6,6 0 0 0 134,50 L96,50" />
      <path className={styles.line} d="M170,90 L146,90 A6,6 0 0 0 140,96 L140,124 A6,6 0 0 1 134,130 L117,130" />
      <ArrowLeft x={110} y={130} />
      {/* The dialog, closed by Escape. */}
      <Rect x={170} y={50} w={100} h={80} rx={8} className={styles.frame} />
      <Copy x={184} y={66} w={36} quiet />
      <Glyph name="close-circle" cx={256} cy={66} size={12} className={styles.glyph} />
      <Copy x={184} y={84} w={64} />
      <Copy x={184} y={96} w={48} quiet />
      <Rect x={222} y={108} w={36} h={12} rx={6} className={styles.tile} />
      <circle className={styles.node} cx="170" cy="90" r="2.5" />
    </>
  );
}

/**
 * Corrections, blockers first, each with its owner and a check anyone can repeat; what is untested or
 * disputed sits apart on its own dashed list.
 */
function CorrectionsList() {
  return (
    <>
      <Rect x={30} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Copy x={42} y={48} w={48} quiet />
      {/* The blocker, first. */}
      <Rect x={42} y={62} w={136} h={20} className={styles.region} />
      <Glyph name="danger-triangle" cx={54} cy={72} size={12} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M66,72 L118,72" />
      <Glyph name="user" cx={146} cy={72} size={12} className={styles.glyphAccent} />
      <Glyph name="clipboard-check" cx={166} cy={72} size={12} className={styles.glyphAccent} />
      {[102, 132].map((y, i) => (
        <g key={y}>
          <Rect x={42} y={y - 10} w={136} h={20} className={styles.tile} />
          <Copy x={54} y={y} w={i === 0 ? 56 : 44} quiet />
          <Glyph name="user" cx={146} cy={y} size={12} className={styles.glyph} />
          <Glyph name="clipboard-check" cx={166} cy={y} size={12} className={styles.glyph} />
        </g>
      ))}
      {/* Untested and disputed, on their own list. */}
      <Rect x={210} y={50} w={80} h={80} rx={8} className={styles.trailFrame} />
      <Copy x={222} y={66} w={32} quiet />
      {(
        [
          [88, 'question-circle'],
          [110, 'chat-round-dots'],
        ] as const
      ).map(([y, glyph]) => (
        <g key={y}>
          <Glyph name={glyph} cx={228} cy={y} size={12} className={styles.glyphQuiet} />
          <Copy x={242} y={y} w={32} quiet />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Keyboard accessibility component check: a dialog that loses focus (#example): A dialog looks right and opens from the right button. Press Escape and it closes, but focus jumps to the top of the page when it should return to the button that opened it. The acceptance check: close the dialog in its real workflow and confirm focus goes back to the control that opened it. Draw the story: the dialog opened from its button; Escape closes it and the focus ring jumps to the top of the page; the corrected path returns the ring to the button that opened it. No type on the image. */
  'tool-figma-storybook-fidelity-checklist-example': ExampleDialogFocus,
  /* Turn what you found into a component corrections list (#corrections): Put first anything that blocks an essential action or shows an important state wrongly. Keep untested and disputed states on their own list, with a note of what would show whether the design, the code or the expectation should change. Give each correction an owner and a check anyone can repeat, and close it when that check passes. Draw the diagram: a corrections list, blockers first, each row carrying an owner and a repeatable check, the untested and disputed states on a separate list. */
  'tool-figma-storybook-fidelity-checklist-corrections': CorrectionsList,
};
