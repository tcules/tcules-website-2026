import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { ArrowRight, Copy, Rect } from './offer';
import { Glyph, Hatched } from './scenes';
import styles from './Sketch.module.css';

/**
 * Recovering a sent notice: the correction goes out to the account and to the recipient, where the
 * effect lives, while the copy deleted from the sender's screen changes nothing.
 */
function Example() {
  return (
    <>
      {/* The sender's screen, the sent copy deleted from it: the effect stays where it landed. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frameQuiet} />
      <Copy x={46} y={58} w={32} quiet />
      <Hatched x={46} y={74} w={48} h={32} />
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

/* /tools/ai-trust-control-canvas: the page's still plate (LongformPage family "tool", 4 Nov 2026):
   the worked example's STORY scene, inside the example panel beside its words, drawn from this page's
   own words. Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Undefined until
   it is drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Worked example: an AI-drafted notice to a customer (#example): An assistant drafts a notice about a change to a customer's account. Before it goes, the reviewer sees the recipient, the proposed change and the account record behind it, and can edit or reject the draft. After it goes, recovery means correcting the account where needed and sending the recipient a correction. Deleting the message from the sender's screen leaves its effect in place. Draw the story: the drafted notice with its recipient, change and record, reviewed and sent; then the correction flowing to the account and to the recipient, while the copy deleted on the sender's screen leaves the effect in place. No type on the image. */
  'tool-ai-trust-control-canvas-example': Example,
};
