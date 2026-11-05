import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Focus, Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/**
 * Recovering a sent notice: the correction goes out to the account and to the recipient, where the
 * effect lives, while the copy deleted from the sender's screen changes nothing.
 */
function Example() {
  return (
    <>
      {/* The sender's screen, the sent copy deleted from it: the effect stays where it landed. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.trailFrame} />
      <Copy x={46} y={58} w={32} quiet />
      <Glyph name="letter" cx={70} cy={86} size={24} className={styles.glyphQuiet} />
      <Glyph name="close-circle" cx={70} cy={122} size={14} className={styles.glyphQuiet} />
      {/* The correction, and its two routes: to the account, and to the recipient. */}
      <Rect x={130} y={60} w={60} h={60} rx={8} className={styles.region} />
      <Glyph name="undo-left" cx={160} cy={90} size={24} className={styles.glyphAccent} />
      <circle className={styles.node} cx={190} cy={90} r="2.5" />
      <path
        className={styles.line}
        d="M190,90 L210,90 M210,90 L210,56 A6,6 0 0 1 216,50 L243,50 M210,90 L210,124 A6,6 0 0 0 216,130 L243,130"
      />
      <circle className={styles.node} cx={210} cy={90} r="3.5" />
      <ArrowRight x={250} y={50} />
      <ArrowRight x={250} y={130} />
      <Rect x={250} y={30} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="database" cx={270} cy={50} size={20} className={styles.glyph} />
      <Rect x={250} y={110} w={40} h={40} rx={8} className={styles.frame} />
      <Glyph name="user" cx={270} cy={130} size={20} className={styles.glyph} />
    </>
  );
}

/** One cell of the finished canvas: its part's glyph and a line of what was set out. */
function Part({
  x,
  y,
  w,
  glyph,
}: {
  x: number;
  y: number;
  w: number;
  glyph: 'bolt-circle' | 'document-text' | 'question-circle' | 'user' | 'check-circle' | 'notebook';
}) {
  return (
    <>
      <Rect x={x} y={y} w={w} h={20} rx={4} className={styles.frameQuiet} />
      <Glyph name={glyph} cx={x + 11} cy={y + 10} size={10} className={styles.glyph} />
      <Copy x={x + 22} y={y + 10} w={w - 32} quiet />
    </>
  );
}

/**
 * The finished canvas read for its gap: seven parts filled in, the action at its head, and the way
 * back left empty. From that empty part the line runs out to the control to decide first, who holds
 * authority and how a mistake is contained, lit.
 */
function ReadingTheCanvas() {
  return (
    <>
      <Rect x={30} y={30} w={150} h={120} rx={8} className={styles.frame} />
      {/* The output and its consequence heads the canvas. */}
      <Part x={40} y={40} w={130} glyph="bolt-circle" />
      <Part x={40} y={68} w={62} glyph="document-text" />
      <Part x={108} y={68} w={62} glyph="question-circle" />
      <Part x={40} y={94} w={62} glyph="user" />
      <Part x={108} y={94} w={62} glyph="check-circle" />
      <Part x={40} y={120} w={62} glyph="notebook" />
      {/* Recovery: nothing set out, so no way back. */}
      <Rect x={108} y={120} w={62} h={20} rx={4} className={styles.region} />
      <Hatched x={124} y={120} w={46} h={20} />
      <Glyph name="undo-left" cx={119} cy={130} size={10} className={styles.glyphAccent} />
      {/* The gap points to the first control to decide. */}
      <circle className={styles.node} cx={170} cy={130} r="2.5" />
      <path
        className={styles.line}
        d="M170,130 L200,130 A6,6 0 0 0 206,124 L206,96 A6,6 0 0 1 212,90 L232,90"
      />
      <Focus x={250} y={90} glyph="shield-check" size={12} />
    </>
  );
}

/* /tools/ai-trust-control-canvas: the page's still plate (LongformPage family "tool", 4 Nov 2026):
   the worked example's STORY scene, inside the example panel beside its words, drawn from this page's
   own words. Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Undefined until
   it is drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: an AI-drafted notice to a customer (#example): An assistant drafts a notice about a change to a customer's account. Before it goes, the reviewer sees the recipient, the proposed change and the account record behind it, and can edit or reject the draft. After it goes, recovery means correcting the account where needed and sending the recipient a correction. Deleting the message from the sender's screen leaves its effect in place. Draw the story: the drafted notice with its recipient, change and record, reviewed and sent; then the correction flowing to the account and to the recipient, while the copy deleted on the sender's screen leaves the effect in place. No type on the image. */
  'tool-ai-trust-control-canvas-example': Example,
  /* Read the finished canvas to see which control comes first (#reading-your-canvas): An action with real consequences and no working review or way back: decide who has authority, and how a mistake is contained, before the action is switched on. Draw the diagram: the finished canvas, its seven parts filled in, the empty part pointing to the first control to decide. No type on the image. */
  'tool-ai-trust-control-canvas-reading': ReadingTheCanvas,
};
