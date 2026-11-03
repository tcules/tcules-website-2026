import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* /tools/audit-redesign-modernise-rebuild: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the paragraph naming the route marks. Each drawn from this page's own words. Helpers come from
   ./offer and ./scenes, classes from ./Sketch.module.css. Still plates: the finished picture. */

/**
 * Real saved reports, run through the new service beside the old one, come out the same: the stack of
 * saved reports forks into the old query service (quiet) and the new one (lit), and the two results
 * meet on the one tick.
 */
function ExampleSavedReports() {
  return (
    <>
      {/* The saved reports: one of many, sheets behind. */}
      <Rect x={34} y={38} w={60} h={72} rx={8} className={styles.frameQuiet} />
      <Rect x={42} y={46} w={60} h={72} rx={8} className={styles.frameQuiet} />
      <Rect x={50} y={54} w={60} h={72} rx={8} className={styles.frame} />
      <Copy x={62} y={70} w={28} quiet />
      <path className={styles.rule} d="M62,112 L98,112" />
      {(
        [
          [64, 12],
          [76, 22],
          [88, 16],
        ] as const
      ).map(([x, h]) => (
        <Rect key={x} x={x} y={112 - h} w={8} h={h} rx={2} className={styles.tile} />
      ))}
      {/* One sample, forked: to the old service and to the new one, side by side. */}
      <path
        className={styles.line}
        d="M110,90 L124,90 A6,6 0 0 0 130,84 L130,56 A6,6 0 0 1 136,50 L150,50 M124,90 A6,6 0 0 1 130,96 L130,124 A6,6 0 0 0 136,130 L150,130"
      />
      <circle className={styles.node} cx="110" cy="90" r="2.5" />
      <Rect x={150} y={30} w={60} h={40} rx={8} className={styles.frameQuiet} />
      <Glyph name="database" cx={170} cy={50} size={16} className={styles.glyphQuiet} />
      <Copy x={184} y={50} w={14} quiet />
      <Rect x={150} y={110} w={60} h={40} rx={8} className={styles.frame} />
      <Glyph name="database" cx={170} cy={130} size={16} className={styles.glyphAccent} />
      <Copy x={184} y={130} w={14} />
      {/* The two results meet, and agree. */}
      <path
        className={styles.line}
        d="M210,50 L224,50 A6,6 0 0 1 230,56 L230,84 A6,6 0 0 0 236,90 L252,90 M210,130 L224,130 A6,6 0 0 0 230,124 L230,96 A6,6 0 0 1 236,90"
      />
      <Focus x={270} y={90} glyph="check-circle" size={12} />
      <ArrowRight x={259} y={90} />
    </>
  );
}

/**
 * Every route carries one mark, and only the preferred one is tied to its next test: a column of four
 * route cards (candidate, preferred, needs evidence, ruled out), the preferred one ringed, its route
 * running to the test, with the person who owns the decision.
 */
function ReadingMarks() {
  return (
    <>
      <Rect x={34} y={55} w={122} h={30} rx={12} className={styles.halo} />
      {/* Candidate. */}
      <Rect x={40} y={31} w={110} h={18} className={styles.tile} />
      <circle className={styles.tile} cx="54" cy="40" r="5" />
      <Copy x={68} y={40} w={52} quiet />
      {/* Preferred for next test. */}
      <Rect x={40} y={61} w={110} h={18} className={styles.frame} />
      <Glyph name="flag" cx={54} cy={70} size={12} className={styles.glyphAccent} />
      <Copy x={68} y={70} w={60} />
      {/* Needs evidence. */}
      <Rect x={40} y={91} w={110} h={18} className={styles.tile} />
      <Glyph name="question-circle" cx={54} cy={100} size={12} className={styles.glyphQuiet} />
      <Copy x={68} y={100} w={44} quiet />
      {/* Ruled out. */}
      <Rect x={40} y={121} w={110} h={18} className={styles.trailFrame} />
      <Glyph name="close-circle" cx={54} cy={130} size={12} className={styles.glyphQuiet} />
      <Copy x={68} y={130} w={36} quiet />
      {/* The preferred route, tied to its next test. */}
      <path className={styles.line} d="M150,70 L164,70 A6,6 0 0 1 170,76 L170,84 A6,6 0 0 0 176,90 L193,90" />
      <ArrowRight x={200} y={90} />
      <circle className={styles.node} cx="150" cy="70" r="2.5" />
      <Rect x={200} y={30} w={80} h={120} rx={8} className={styles.frame} />
      <Chip x={212} y={42} glyph="clipboard-check" />
      <Copy x={212} y={76} w={52} />
      <Copy x={212} y={88} w={40} quiet />
      <Copy x={212} y={100} w={48} quiet />
      <path className={styles.rule} d="M200,114 L280,114" />
      <Glyph name="user" cx={220} cy={132} size={14} className={styles.glyph} />
      <Copy x={234} y={132} w={30} quiet />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Rebuild vs refactor in practice: a report builder with saved reports (#example): A report builder has become expensive to extend. Rebuilding its editor looks attractive, but saved reports depend on the old query service. Compare three routes: a focused repair, a redesign of the editor that keeps the existing service, and replacing the query service in stages. Before choosing the third, test whether a sample of real saved reports still return the right results, and whether old and new can run side by side. Draw the story: the editor with saved reports tied to the old query service, three routes branching from it, and a sample of real saved reports run through the staged route beside the old service. No type on the image. */
  'tool-audit-redesign-modernise-rebuild-example': ExampleSavedReports,
  /* Mark where each route stands before anyone commits (#reading-your-results): Mark each route "candidate", "needs evidence", "ruled out" or "preferred for next test". A preference stays provisional until the evidence is written down and someone owns the decision. Draw the diagram: the routes as a column of cards, each carrying one mark, the preferred one tied to its next test. */
  'tool-audit-redesign-modernise-rebuild-reading': ReadingMarks,
};
