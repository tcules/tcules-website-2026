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

/**
 * One component followed through the four places, each place carrying its mark: the design matches
 * (aligned), the shared code holds an agreed variation with its flag (intentional exception), the live
 * product runs a different version (difference found, the one lit), and the requests behind it cannot
 * yet say why (unknown). The trace runs through the component in every place.
 */
function MarksFourPlaces() {
  const places: {
    x: number;
    glyph: 'ruler-pen' | 'code' | 'monitor' | 'notebook';
    mark: 'check-circle' | 'danger-triangle' | 'question-circle' | 'flag';
  }[] = [
    { x: 30, glyph: 'ruler-pen', mark: 'check-circle' },
    { x: 100, glyph: 'code', mark: 'flag' },
    { x: 170, glyph: 'monitor', mark: 'danger-triangle' },
    { x: 240, glyph: 'notebook', mark: 'question-circle' },
  ];
  return (
    <>
      {/* The trace through the component, place to place. */}
      <path className={styles.line} d="M80,82 L100,82 M150,82 L170,82 M220,82 L240,82" />
      {places.map(({ x, glyph, mark }, i) => (
        <g key={glyph}>
          <Rect x={x} y={34} w={50} h={84} rx={8} className={styles.frame} />
          <Chip x={x + 8} y={42} glyph={glyph} />
          {/* The component in this place: the live product's copy is the one that differs. */}
          {i === 2 ? (
            <>
              <Rect x={x + 6} y={70} w={38} h={24} rx={8} className={styles.halo} />
              <Rect x={x + 9} y={75} w={32} h={14} rx={7} className={styles.region} />
            </>
          ) : i === 3 ? (
            <>
              <Copy x={x + 10} y={78} w={30} quiet />
              <Copy x={x + 10} y={88} w={20} quiet />
            </>
          ) : (
            <Rect x={x + 9} y={75} w={32} h={14} rx={7} className={styles.tile} />
          )}
          <Copy x={x + 10} y={106} w={24} quiet />
          <path className={styles.line} d={`M${x + 25},118 L${x + 25},128`} />
          <Glyph
            name={mark}
            cx={x + 25}
            cy={140}
            size={16}
            className={i === 2 ? styles.glyphAccent : i === 3 ? styles.glyphQuiet : styles.glyph}
          />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: tracing a copied multi-select (#reading-your-results): An orders team uses its own copy of a multi-select because the shared field allows only one choice. What you saw is a local copy. The likely cause is an interaction the shared component lacks. Before proposing a replacement, check where multi-select belongs: in the shared component, as a separate component or built for this one product. Draw the story: the orders team's local multi-select beside the shared single-select field, the trace running from the copy back to the interaction the shared component lacks. No type on the image. */
  'tool-design-system-drift-checker-example': ExampleCopiedMultiSelect,
  /* Figma vs Storybook vs live product: follow the component through four places (#workspace): For each finding, note the design version, the code version and where it appears in the product. Mark it "aligned", "difference found", "unknown" or "intentional exception". An exception needs an owner and a reason. A difference needs looking into before anyone names its cause. Draw the diagram: one component followed through the four places (design, shared code, live product, requests and releases), each place carrying one of the four marks. No type on the image. */
  'tool-design-system-drift-checker-marks': MarksFourPlaces,
};
