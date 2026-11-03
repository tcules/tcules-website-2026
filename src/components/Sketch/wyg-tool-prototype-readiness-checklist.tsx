import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import styles from './Sketch.module.css';
import { ArrowRight, Copy, Hop, Rect } from './offer';
import { Focus, Glyph } from './scenes';

/* /tools/prototype-readiness-checklist: the page's still plate (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, drawn from this
   page's own words (it must differ from the hub tile's specialist-prototype-readiness-checklist).
   Helpers come from ./offer and ./scenes, classes from ./Sketch.module.css. Undefined until it is
   drawn; the comment above it is the item's title and words. */

/**
 * The one idea: "Invitation sent" on the screen, but the real path behind it is still to build. The
 * success screen, its tick quiet because nothing stands behind it, routes to the letter that has to
 * actually go out (the focal point); the letter routes on to the brief's four cases, each dashed
 * because the build must add it: an expired link, a person who already has an account, resend, and a
 * failed delivery.
 */
function InvitationExample() {
  const cases: [number, number, IconName][] = [
    [204, 46, 'clock-circle'],
    [250, 46, 'user'],
    [204, 94, 'refresh'],
    [250, 94, 'danger-triangle'],
  ];
  return (
    <>
      {/* The simulated success: a screen that says sent. */}
      <Rect x={30} y={40} w={80} h={100} rx={8} className={styles.frame} />
      <Copy x={44} y={56} w={32} quiet />
      <Glyph name="check-circle" cx={70} cy={86} size={22} className={styles.glyphQuiet} />
      <Copy x={50} y={114} w={40} />
      <Copy x={56} y={126} w={28} quiet />
      {/* The real path: delivery, the letter that has to go out. */}
      <Hop x1={110} x2={139} y={90} />
      <Focus x={150} y={90} glyph="letter" size={12} />
      <path className={styles.line} d="M161,90 L183,90" />
      <ArrowRight x={190} y={90} />
      {/* What the build must add around it. */}
      <Rect x={190} y={30} w={100} h={120} rx={8} className={styles.frameQuiet} />
      {cases.map(([x, y, glyph]) => (
        <g key={glyph}>
          <Rect x={x} y={y} w={36} h={40} rx={4} className={styles.trailFrame} />
          <Glyph name={glyph} cx={x + 18} cy={y + 20} size={16} className={styles.glyphQuiet} />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Simulated vs real features: an invitation screen with no email service (#example): An invitation flow shows "Invitation sent", but no email service is connected. If the research question was whether a team owner understands invitations, the simulation may have done its job. The build brief still has to cover delivery, expired links, people who already have an account, resend rules and what happens when delivery fails. Draw the story: the success screen with nothing behind it, then the real path drawn underneath (delivery, an expired link, an existing account, resend, failed delivery) as what the build must add. No type on the image. */
  'tool-prototype-readiness-checklist-example': InvitationExample,
};
