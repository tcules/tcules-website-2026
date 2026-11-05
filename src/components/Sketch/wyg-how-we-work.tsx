import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Chip, Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* Still plates, drawn by the flat-drawings pass (2.62). Helpers come from ./offer and ./scenes (Rect,
   Copy, Hop, Glyph, Focus, Hatched, Chip, ...) and classes from ./Sketch.module.css. An item left
   undefined shows the empty plate. The name is `scope-*` because EngagementOptions draws the terms as
   it draws its scopes (OfferBands TERM_SCOPES). */

/**
 * What we make is yours: the invoice settled (its tick), and the work it paid for, designs and code,
 * comes to you with its key, lit.
 */
function ScopeYours() {
  return (
    <>
      {/* The invoice, paid. */}
      <Rect x={30} y={50} w={60} h={80} rx={8} className={styles.frame} />
      <Glyph name="wallet" cx={60} cy={72} size={16} className={styles.glyph} />
      <Copy x={44} y={98} w={32} />
      <Copy x={44} y={110} w={18} quiet />
      <Glyph name="check-circle" cx={72} cy={110} size={12} className={styles.glyph} />
      <Hop x1={90} x2={130} y={90} />
      {/* The work it paid for, with its key. */}
      <Rect x={130} y={30} w={160} h={120} rx={8} className={styles.frame} />
      <Focus x={166} y={90} glyph="key" size={13} />
      {(
        [
          [66, 'layers'],
          [114, 'code'],
        ] as const
      ).map(([cy, glyph]) => (
        <g key={glyph}>
          <Rect x={202} y={cy - 16} w={74} h={32} className={styles.tile} />
          <Chip x={210} y={cy - 8} glyph={glyph} />
          <Copy x={234} y={cy} w={30} quiet />
        </g>
      ))}
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* What we make is yours: Once the work is paid for, the designs and code we make for you are yours. */
  'scope-yours': ScopeYours,
};
