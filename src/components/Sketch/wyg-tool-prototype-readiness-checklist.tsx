import type { ReactNode } from 'react';

import type { IconName } from '@/lib/icon-glyphs';
import type { PageSceneName } from '@/lib/page-scenes';

import styles from './Sketch.module.css';
import { ArrowRight, Copy, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';

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
      <circle className={styles.node} cx={110} cy={90} r="2.5" />
      <path className={styles.line} d="M110,90 L132,90" />
      <Focus x={150} y={90} glyph="letter" size={12} />
      <path className={styles.line} d="M168,90 L183,90" />
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

/**
 * One workflow sorted, then sorted again: the workflow's checks each carry their mark (demonstrated,
 * simulated, not applicable, and the unknown lit), and what the marks leave open routes out into the
 * brief's three lists: decisions to make, research to run, build work to scope.
 */
function BriefThreeLists() {
  const rows: [number, IconName, number][] = [
    [58, 'check-circle', 56],
    [80, 'layers', 44],
    [124, 'close-circle', 36],
  ];
  const lists: [number, IconName][] = [
    [46, 'flag'],
    [90, 'users-group-rounded'],
    [134, 'code'],
  ];
  return (
    <>
      {/* The workflow, one check per row, each with its mark; the unknown is the one lit. */}
      <Rect x={30} y={34} w={120} h={112} rx={8} className={styles.frame} />
      {rows.map(([y, glyph, w]) => (
        <g key={glyph}>
          <Glyph
            name={glyph}
            cx={46}
            cy={y}
            size={14}
            className={glyph === 'close-circle' ? styles.glyphQuiet : styles.glyph}
          />
          <Copy x={60} y={y} w={w} quiet />
        </g>
      ))}
      <Rect x={38} y={92} w={104} h={20} className={styles.region} />
      <Glyph name="question-circle" cx={46} cy={102} size={14} className={styles.glyphAccent} />
      <path className={styles.regionCopy} d="M60,102 L120,102" />
      {/* Out of the workflow into the brief, branching to its three lists. */}
      <circle className={styles.node} cx={150} cy={102} r="2.5" />
      <path
        className={styles.line}
        d="M150,102 L180,102 M180,102 L180,96 L180,52 A6,6 0 0 1 186,46 L207,46 M180,90 L207,90 M180,102 L180,128 A6,6 0 0 0 186,134 L207,134"
      />
      <circle className={styles.node} cx={180} cy={102} r="3.5" />
      {lists.map(([y, glyph]) => (
        <g key={glyph}>
          <ArrowRight x={214} y={y} />
          <Rect x={214} y={y - 16} w={76} h={32} rx={6} className={styles.frame} />
          <Chip x={222} y={y - 8} glyph={glyph} />
          <Copy x={246} y={y - 4} w={34} quiet />
          <Copy x={246} y={y + 5} w={22} quiet />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Simulated vs real features: an invitation screen with no email service (#example): An invitation flow shows "Invitation sent", but no email service is connected. If the research question was whether a team owner understands invitations, the simulation may have done its job. The build brief still has to cover delivery, expired links, people who already have an account, resend rules and what happens when delivery fails. Draw the story: the success screen with nothing behind it, then the real path drawn underneath (delivery, an expired link, an existing account, resend, failed delivery) as what the build must add. No type on the image. */
  'tool-prototype-readiness-checklist-example': InvitationExample,
  /* Prototype build brief template: sort your answers into three lists (#brief): Group what you found into three lists: decisions to make, research to run and build work to scope. Give each item an owner and a check that would close it. Draw the diagram: one workflow's checks, each marked demonstrated, simulated, unknown or not applicable, and what stays open sorted into the brief's three lists. No type on the image. */
  'tool-prototype-readiness-checklist-brief': BriefThreeLists,
};
