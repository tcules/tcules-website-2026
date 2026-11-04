import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Cursor, Hop, Lens, Rect } from './offer';
import { Chip, Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/* The destinations the glossary's term pages close on that had no drawing of their own: each the
   service, audit or tool's OWN scene, drawn from that page's own argument (never borrowed from its
   What-you-get items), shown wherever the destination is named as a ServiceTile
   (`serviceSceneFor`, @/lib/sketches). Still plates: draw the finished picture. Helpers come from
   ./offer and ./scenes, classes from ./Sketch.module.css. The comment above each scene is the
   destination's title and words; the comment on each drawing is the one idea it holds. */

/** A node on a route, at a port. */
const Port = ({ x, y }: { x: number; y: number }) => (
  <circle className={styles.node} cx={x} cy={y} r="2.5" />
);

/** Implementation QA: one sorted fix list, every fix retested, and the release goes out. */
function ImplementationQa() {
  const rows: [number, number][] = [
    [50, 80],
    [74, 64],
    [98, 48],
    [122, 32],
  ];
  return (
    <>
      <Rect x={50} y={30} w={140} h={120} rx={8} className={styles.frame} />
      {rows.map(([y, w]) => (
        <g key={y}>
          <Glyph name="check-circle" cx={70} cy={y + 4} size={14} className={styles.glyph} />
          <Copy x={86} y={y + 4} w={w} />
        </g>
      ))}
      <path className={styles.line} d="M190,90 L239,90" />
      <Port x={190} y={90} />
      <Focus x={250} y={90} glyph="flag" size={12} />
    </>
  );
}

/** Coded prototyping: the idea made into working code, and the team decides from trying it. */
function CodedPrototyping() {
  return (
    <>
      <Hatched x={30} y={70} w={40} h={40} />
      <Hop x1={70} x2={110} y={90} />
      <Rect x={110} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Chip x={118} y={38} glyph="code" />
      <Copy x={126} y={70} w={56} />
      <Copy x={126} y={82} w={80} quiet />
      <Copy x={126} y={94} w={64} quiet />
      <Rect x={126} y={110} w={48} h={20} rx={10} className={styles.region} />
      <Cursor x={162} y={120} />
      <path className={styles.line} d="M230,90 L259,90" />
      <Port x={230} y={90} />
      <Focus x={270} y={90} glyph="users-group-rounded" size={12} />
    </>
  );
}

/** Design to Code: the design's open questions answered first, so the screen is built once, from
 *  your own components. */
function DesignToCodeService() {
  return (
    <>
      <Rect x={30} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      <Rect x={42} y={46} w={56} h={28} className={styles.tile} />
      <Glyph name="question-circle" cx={110} cy={60} size={14} className={styles.glyphQuiet} />
      <Rect x={42} y={86} w={56} h={20} className={styles.tile} />
      <Glyph name="question-circle" cx={110} cy={96} size={14} className={styles.glyphQuiet} />
      <Rect x={42} y={118} w={36} h={16} rx={8} className={styles.tile} />
      <Hop x1={130} x2={170} y={90} />
      <Rect x={170} y={30} w={120} h={120} rx={8} className={styles.frame} />
      <Rect x={182} y={46} w={56} h={28} className={styles.tile} />
      <Rect x={182} y={86} w={56} h={20} className={styles.tile} />
      <Rect x={182} y={118} w={36} h={16} rx={8} className={styles.tile} />
      <Focus x={262} y={90} glyph="check-circle" size={12} />
    </>
  );
}

/** Design-to-Code Audit: the shipped screen laid over its design, and the lens on the one place
 *  they part. */
function DesignToCodeAudit() {
  return (
    <>
      <Rect x={90} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Copy x={106} y={50} w={48} quiet />
      <Copy x={106} y={64} w={72} />
      {/* The design's block, ghosted where it should sit; the build's block, shifted off it. */}
      <Rect x={106} y={78} w={84} h={28} className={styles.trailFrame} />
      <Rect x={120} y={90} w={84} h={28} className={styles.region} />
      <Copy x={106} y={134} w={56} quiet />
      <Lens x={206} y={92} r={16} />
    </>
  );
}

/** Design System Drift Checker: one component followed from Figma to Storybook to the live
 *  product, and the place it starts to differ lit. */
function DriftChecker() {
  const stops: [number, IconName][] = [
    [30, 'ruler-pen'],
    [130, 'widget'],
    [230, 'monitor'],
  ];
  return (
    <>
      {stops.map(([x, g], i) => (
        <g key={x}>
          <Rect x={x} y={50} w={60} h={80} rx={8} className={styles.frame} />
          <Chip x={x + 8} y={58} glyph={g} />
          <Copy x={x + 12} y={84} w={28} quiet />
          {i < 2 ? (
            <Rect x={x + 12} y={100} w={36} h={14} rx={7} className={styles.tile} />
          ) : (
            <>
              <Rect x={x + 6} y={94} w={48} h={26} rx={8} className={styles.halo} />
              <Rect x={x + 12} y={100} w={36} h={14} rx={2} className={styles.region} />
            </>
          )}
        </g>
      ))}
      <path className={styles.line} d="M90,90 L130,90 M190,90 L230,90" />
      <Port x={90} y={90} />
      <Port x={130} y={90} />
      <Port x={190} y={90} />
      <Port x={230} y={90} />
    </>
  );
}

/** Prototype Readiness Checklist: the prototype sorted line by line into what it really does and
 *  what it only pretends to. */
function PrototypeReadinessChecklist() {
  const rows: [number, boolean, number][] = [
    [62, true, 72],
    [86, false, 56],
    [110, true, 64],
    [134, false, 48],
  ];
  return (
    <>
      <Rect x={30} y={50} w={80} h={80} rx={8} className={styles.frameQuiet} />
      <Copy x={42} y={66} w={40} quiet />
      <Rect x={42} y={78} w={56} h={20} className={styles.tile} />
      <Rect x={42} y={108} w={32} h={12} rx={6} className={styles.tile} />
      <Hop x1={110} x2={150} y={90} />
      <Rect x={150} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Chip x={158} y={38} glyph="clipboard-check" />
      {rows.map(([y, real, w]) => (
        <g key={y}>
          {real ? (
            <Glyph name="check-circle" cx={174} cy={y} size={14} className={styles.glyphAccent} />
          ) : (
            <Hatched x={167} y={y - 7} w={14} h={14} />
          )}
          <Copy x={190} y={y} w={w} quiet={!real} />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Implementation QA (/services/design-engineering/implementation-qa): Your engineers get one sorted fix list from our design QA, and each fix is retested before customers see the release. */
  'specialist-implementation-qa': ImplementationQa,
  /* Coded Prototyping (/services/design-engineering/coded-prototyping): Coded prototyping turns your idea into working code on real or sample data. Your team then decides what to build from something it can try. */
  'specialist-coded-prototyping': CodedPrototyping,
  /* Design to Code (/services/design-engineering/design-to-code): Our design to code service answers your developers' questions before the sprint starts, so they build each Figma screen once, in your own components. */
  'specialist-design-to-code': DesignToCodeService,
  /* Design-to-Code Audit (/audits/design-to-code-audit): In about two days, at a fixed price, a senior designer and a design engineer find why one screen ships unlike its design. */
  'specialist-design-to-code-audit': DesignToCodeAudit,
  /* Design System Drift Checker (/tools/design-system-drift-checker): The free Design System Drift Checker follows one shared component through Figma, Storybook (where coded components are previewed) and the live product to show where the differences creep in. */
  'specialist-drift-checker': DriftChecker,
  /* Prototype Readiness Checklist (/tools/prototype-readiness-checklist): The free Prototype Readiness Checklist sorts what a prototype really does from what it only simulates. It works for any prototype, including ones built with AI tools. */
  'specialist-prototype-readiness-checklist': PrototypeReadinessChecklist,
};
