import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/**
 * The old record behind the draft: the account record, aged (its clock, the sheets of it gone stale),
 * feeds the assistant's draft, and the reviewer's eye lands on the line it got wrong before the reply goes.
 */
function Example() {
  return (
    <>
      <Rect x={38} y={42} w={60} h={80} rx={8} className={styles.frameQuiet} />
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Glyph name="clock-circle" cx={60} cy={74} size={20} className={styles.glyph} />
      <Copy x={44} y={102} w={32} quiet />
      <Copy x={44} y={114} w={20} quiet />
      <Hop x1={90} x2={130} y={90} />
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Rect x={142} y={42} w={16} h={16} rx={4} className={styles.tile} />
      <Glyph name="stars" cx={150} cy={50} size={10} className={styles.glyph} />
      <Copy x={166} y={50} w={48} quiet />
      <Copy x={146} y={74} w={88} quiet />
      <Rect x={140} y={84} w={100} h={20} className={styles.region} />
      <path className={styles.regionCopy} d="M148,94 L210,94" />
      <Copy x={146} y={118} w={36} quiet />
      <Rect x={214} y={126} w={60} h={14} rx={7} className={styles.tile} />
      <Focus x={264} y={94} glyph="eye" size={12} />
    </>
  );
}

/** One check kept in a row: its mark, then its line. */
function Check({ y, glyph, w }: { y: number; glyph: IconName; w: number }) {
  return (
    <>
      <Glyph name={glyph} cx={52} cy={y} size={14} className={styles.glyph} />
      <Copy x={66} y={y} w={w} quiet />
    </>
  );
}

/**
 * One record's checks, each with its mark (evidence, a decision only, not applicable), and the one still
 * open tied to the person who can close it.
 */
function Marking() {
  return (
    <>
      <Rect x={30} y={30} w={140} h={120} rx={8} className={styles.frame} />
      <Check y={50} glyph="check-circle" w={72} />
      <Check y={76} glyph="document-text" w={56} />
      <Check y={102} glyph="close-circle" w={64} />
      <Rect x={40} y={120} w={120} h={20} className={styles.region} />
      <Glyph name="question-circle" cx={52} cy={130} size={14} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M66,130 L130,130" />
      <path
        className={styles.line}
        d="M170,130 L184,130 A6,6 0 0 0 190,124 L190,96 A6,6 0 0 1 196,90 L203,90"
      />
      <ArrowRight x={210} y={90} />
      <circle className={styles.node} cx={170} cy={130} r="2.5" />
      <Rect x={210} y={50} w={80} h={80} rx={8} className={styles.frame} />
      <Glyph name="user" cx={250} cy={80} size={24} className={styles.glyph} />
      <Copy x={230} y={110} w={40} quiet />
    </>
  );
}

/* /tools/ai-product-ux-readiness-check: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the marking paragraph. Each drawn from this page's own words, never another page's scene.
   Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined
   until it is drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* AI feature risk assessment: an assistant using an out-of-date record (#example): A support assistant drafts a reply from a customer's account record. The record may be out of date, and the screen gives no sign of when it was last refreshed. That is a case nobody has tested: the assistant working from out-of-date information. The test is to give the assistant an old record and watch whether the reviewer spots the mistake and fixes it before sending. Draw the story: the draft built from a record with no date sign; the record ages; a reviewer given the old record catches it before the reply is sent. No type on the image. */
  'tool-ai-product-ux-readiness-check-example': Example,
  /* Mark each check and keep unknowns open until someone answers them (#marking): Give each check one of four marks: "evidence available", "decision only", "open" or "not applicable". A written decision still needs a test to show the interaction works, so "decision only" stays on your list. Leave an unknown open until someone can answer it, and note what would close it: the evidence, the owner or the product decision it is waiting for. Draw the diagram: one record's checks, each carrying one of the four marks, the open one tied to what would close it. */
  'tool-ai-product-ux-readiness-check-marking': Marking,
};
