import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Glyph } from './scenes';
import styles from './Sketch.module.css';

/* /matter-design-system: "What's inside", the three properties of the Matter Figma file (OfferSheet,
   drawn, across 3; docs/page-build/pages/matter-design-system.md). Still plates in the kit's flat
   grammar on the one dotted plate (decisions/2026-11-03-flat-graphics-on-one-plate): no words inside a
   drawing, one blue subject, only frames on the plate. Each must read apart from the page's four
   design-system service drawings (Strategy, Implementation, Alignment, Governance). Helpers come from
   ./offer and ./scenes, classes from ./Sketch.module.css. The comment above each scene is the item's title and words. */


/**
 * Tokens named for their purpose: a ladder of raw values on the left, and the one chosen for what it is
 * for (lit) routed to the row of the screen it serves, a button's fill.
 */
function TokensNamedPurpose() {
  const rows = [50, 70, 90, 110, 130];
  return (
    <>
      {/* The ladder of values, one lit: the one chosen by its purpose. */}
      <Rect x={30} y={30} w={80} h={120} rx={8} className={styles.frameQuiet} />
      {rows.map((y) =>
        y === 90 ? (
          <g key={y}>
            <circle className={styles.halo} cx={50} cy={y} r={9} />
            <circle className={styles.solid} cx={50} cy={y} r={5} />
            <Copy x={64} y={y} w={30} />
          </g>
        ) : (
          <g key={y}>
            <circle className={styles.tile} cx={50} cy={y} r={5} />
            <Copy x={64} y={y} w={22} quiet />
          </g>
        ),
      )}
      {/* The route from the value to the role it serves. */}
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <path className={styles.line} d="M110,90 L144,90 A6,6 0 0 1 150,96 L150,104 A6,6 0 0 0 156,110 L163,110" />
      <ArrowRight x={170} y={110} />
      {/* The screen, its button filled with that value. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Copy x={186} y={50} w={64} />
      <Copy x={186} y={66} w={84} quiet />
      <Copy x={186} y={80} w={52} quiet />
      <Rect x={180} y={98} w={64} h={24} rx={12} className={styles.halo} />
      <Rect x={186} y={102} w={52} h={16} rx={8} className={styles.solid} />
      <Rect x={250} y={102} w={28} h={16} rx={8} className={styles.tile} />
    </>
  );
}

/**
 * Components built from smaller parts: a glyph, a label and a pill joined into one component, which
 * comes in its states: at rest, pressed (lit) and disabled.
 */
function ComponentsBuiltSmallerParts() {
  return (
    <>
      {/* The smaller parts. */}
      <Rect x={30} y={38} w={60} h={24} rx={4} className={styles.frameQuiet} />
      <Glyph name="star" cx={60} cy={50} size={12} className={styles.glyph} />
      <Rect x={30} y={78} w={60} h={24} rx={4} className={styles.frameQuiet} />
      <Copy x={44} y={90} w={32} />
      <Rect x={30} y={118} w={60} h={24} rx={4} className={styles.frameQuiet} />
      <Rect x={42} y={124} w={36} h={12} rx={6} className={styles.tile} />
      {/* Joined into one. */}
      <path
        className={styles.line}
        d="M90,50 L118,50 A6,6 0 0 1 124,56 L124,124 A6,6 0 0 1 118,130 L90,130 M90,90 L124,90"
      />
      <circle className={styles.node} cx={90} cy={50} r="2.5" />
      <circle className={styles.node} cx={90} cy={90} r="2.5" />
      <circle className={styles.node} cx={90} cy={130} r="2.5" />
      <Hop x1={124} x2={170} y={90} />
      {/* The component in its states: rest, pressed (lit), disabled. */}
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={190} y={40} w={80} h={20} rx={10} className={styles.tile} />
      <Glyph name="star" cx={204} cy={50} size={10} className={styles.glyph} />
      <Copy x={216} y={50} w={40} />
      <Rect x={184} y={74} w={92} h={32} rx={16} className={styles.halo} />
      <Rect x={190} y={80} w={80} h={20} rx={10} className={styles.solid} />
      <Glyph name="star" cx={204} cy={90} size={10} className={styles.glyphOn} />
      <path className={styles.regionCopy} d="M216,90 L256,90" />
      <Rect x={190} y={120} w={80} h={20} rx={10} className={styles.frameQuiet} />
      <Glyph name="star" cx={204} cy={130} size={10} className={styles.glyphQuiet} />
      <Copy x={216} y={130} w={40} quiet />
    </>
  );
}

/**
 * Naming you can follow: a library panel of groups, each with its pieces nested under it, and one path
 * lit from a group down to the piece it holds.
 */
function NamingYouCanFollow() {
  const groups: { y: number; glyph: IconName; items: number[] }[] = [
    { y: 40, glyph: 'layers', items: [60] },
    { y: 80, glyph: 'widget', items: [100, 120] },
    { y: 140, glyph: 'document-text', items: [] },
  ];
  return (
    <>
      <Rect x={70} y={24} w={180} h={132} rx={8} className={styles.frame} />
      {groups.map(({ y, glyph, items }) => {
        const lit = y === 80;
        return (
          <g key={y}>
            <Glyph name="alt-arrow-down" cx={90} cy={y} size={10} className={styles.glyphQuiet} />
            <Glyph name={glyph} cx={110} cy={y} size={12} className={lit ? styles.glyphAccent : styles.glyph} />
            <Copy x={124} y={y} w={lit ? 56 : 48} />
            {items.map((iy) =>
              lit && iy === 120 ? (
                <g key={iy}>
                  <Rect x={134} y={iy - 12} w={84} h={24} rx={12} className={styles.halo} />
                  <Rect x={140} y={iy - 8} w={72} h={16} rx={8} className={styles.solid} />
                  <path className={styles.regionCopy} d={`M150,${iy} L190,${iy}`} />
                </g>
              ) : (
                <g key={iy}>
                  <circle className={styles.tile} cx={146} cy={iy} r={4} />
                  <Copy x={158} y={iy} w={iy === 60 ? 52 : 40} quiet />
                </g>
              ),
            )}
          </g>
        );
      })}
      {/* The path from the group down to its piece. */}
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <path className={styles.line} d="M110,90 L110,114 A6,6 0 0 0 116,120 L127,120" />
      <ArrowRight x={134} y={120} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Tokens named for their purpose.: Tokens are a design system's named colours, spacing and type sizes. Matter names them for how designers choose between them, so the right one is easy to recognise. Draw: a short ladder of raw values, one blue route from a single value to the role it serves in a small UI frame (a button fill or a text line). */
  'wyg-matter-design-system-tokens-named-purpose': TokensNamedPurpose,
  /* Components built from smaller parts.: Larger components are assembled from smaller parts, and each has options for its different states. Draw: small part frames (a glyph, a label line, a pill) joined into one assembled component, repeated as a short stack of its states (rest, pressed in blue, disabled). */
  'wyg-matter-design-system-components-built-smaller-parts': ComponentsBuiltSmallerParts,
  /* Naming you can follow.: Colours, spacing, type and components share one naming scheme, and the library is organised so related pieces sit together. Draw: a library panel of grouped, nested rows (colour, spacing, type, components as indented groups), one path lit in blue from a group down to its item. */
  'wyg-matter-design-system-naming-you-can-follow': NamingYouCanFollow,
};
