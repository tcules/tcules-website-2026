import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* /tools/design-system-drift-checker: the page's still plate (LongformPage family "tool", 4 Nov 2026):
   the worked example's STORY scene, inside the example panel beside its words, drawn from this page's
   own words (never the hub tile's specialist-drift-checker). Helpers come from ./offer and ./scenes,
   classes from ./Sketch.module.css. Undefined until it is drawn; the comment above it is the item's
   title and words. */

/**
 * The orders team's copy, traced back to what the shared field lacks: the local multi-select (two
 * values picked) on the right, the shared single-select on the left, and the trace landing on the
 * interaction the shared component never had, hatched and ringed.
 */
function ExampleCopiedMultiSelect() {
  return (
    <>
      {/* The shared component: its field, one choice only, and the missing interaction. */}
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frame} />
      <Chip x={42} y={42} glyph="widget" />
      <Rect x={66} y={42} w={52} h={16} rx={8} className={styles.tile} />
      <Glyph name="alt-arrow-down" cx={108} cy={50} size={10} className={styles.glyphQuiet} />
      <Rect x={36} y={74} w={88} h={32} rx={10} className={styles.halo} />
      <Hatched x={42} y={80} w={76} h={20} />
      {[120, 136].map((y, i) => (
        <g key={y}>
          <circle className={styles.tile} cx="50" cy={y} r="5" />
          {i === 0 ? <circle className={styles.knob} cx="50" cy={y} r="2.5" /> : null}
          <Copy x={62} y={y} w={i === 0 ? 40 : 32} quiet />
        </g>
      ))}
      {/* The orders team's own copy: several values picked. */}
      <Rect x={190} y={40} w={100} h={100} rx={8} className={styles.frame} />
      <Chip x={202} y={52} glyph="cart" />
      <Rect x={226} y={52} w={52} h={16} rx={8} className={styles.tile} />
      <Rect x={230} y={56} w={18} h={8} rx={4} className={styles.knob} />
      <Rect x={252} y={56} w={14} h={8} rx={4} className={styles.knob} />
      {[90, 106, 122].map((y, i) => (
        <g key={y}>
          <Rect
            x={202}
            y={y - 5}
            w={10}
            h={10}
            rx={2}
            className={i < 2 ? styles.knob : styles.tile}
          />
          <Copy x={220} y={y} w={[44, 32, 40][i] ?? 40} quiet />
        </g>
      ))}
      {/* The trace, from the copy back to the gap. */}
      <Hop x1={190} x2={130} y={90} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: tracing a copied multi-select (#reading-your-results): An orders team uses its own copy of a multi-select because the shared field allows only one choice. What you saw is a local copy. The likely cause is an interaction the shared component lacks. Before proposing a replacement, check where multi-select belongs: in the shared component, as a separate component or built for this one product. Draw the story: the orders team's local multi-select beside the shared single-select field, the trace running from the copy back to the interaction the shared component lacks. No type on the image. */
  'tool-design-system-drift-checker-example': ExampleCopiedMultiSelect,
};
