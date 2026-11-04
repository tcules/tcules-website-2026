import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

import { Copy, Hop, Rect } from './offer';
import { Focus, Glyph } from './scenes';
import styles from './Sketch.module.css';

/* Home, "How our designers use AI" (owner, 4 Nov 2026, direction A): one small still plate per step,
   each drawn from its sentence. The AI's step is the many marks; the designers' steps narrow them to
   one and sign it off. Helpers from ./offer and ./scenes, classes from ./Sketch.module.css. */

/** The screens of one live product, x positions of their frames. */
const SCREENS = [40, 125, 210] as const;

/**
 * IDEA: AI checks the live product screen by screen against its design system: three screens, the
 * scan running across all of them, a mark wherever a screen differs from the system.
 */
function Check() {
  /* Each mark sits on the element that differs: a card's corner, a line's end, a button's edge. */
  const marks: readonly (readonly [number, number])[] = [
    [100, 64],
    [74, 122],
    [165, 54],
    [167, 112],
    [270, 64],
    [264, 100],
  ];
  return (
    <>
      {SCREENS.map((x) => (
        <g key={x}>
          <Rect x={x} y={40} w={70} h={100} rx={6} className={styles.frame} />
          <Copy x={x + 10} y={54} w={30} />
          <Rect x={x + 10} y={64} w={50} h={22} rx={4} className={styles.tile} />
          <Copy x={x + 10} y={100} w={44} quiet />
          <Copy x={x + 10} y={112} w={32} quiet />
          <Rect x={x + 10} y={122} w={24} h={10} rx={5} className={styles.tile} />
        </g>
      ))}
      {/* The scan, across every screen. */}
      <path className={styles.line} d="M30,90 L290,90" />
      {marks.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} className={styles.mark} cx={cx} cy={cy} r="4" />
      ))}
    </>
  );
}

/**
 * IDEA: a designer decides which differences matter to users: the flagged list, one kept and
 * ticked, the rest left quiet.
 */
function Decide() {
  const rows = [48, 78, 108, 138] as const;
  const kept = 78;
  return (
    <>
      <Focus x={52} y={kept} glyph="user" size={12} />
      <Hop x1={74} x2={96} y={kept} />
      {rows.map((cy) => (
        <g key={cy}>
          <Rect
            x={96}
            y={cy - 11}
            w={190}
            h={22}
            rx={6}
            className={cy === kept ? styles.region : styles.tile}
          />
          <circle
            className={cy === kept ? styles.mark : styles.knob}
            cx={110}
            cy={cy}
            r="3.5"
          />
          {cy === kept ? (
            <>
              <path className={styles.regionCopy} d={`M122,${cy} L212,${cy}`} />
              <Glyph
                name="check-circle"
                cx={268}
                cy={cy}
                size={14}
                className={styles.glyphAccent}
              />
            </>
          ) : (
            <Copy x={122} y={cy} w={cy === 138 ? 70 : 96} quiet />
          )}
        </g>
      ))}
    </>
  );
}

/**
 * IDEA: the designer tries the fix in working code and signs it off: the code with its changed line
 * lit, handed to the screen it fixes, the screen signed off.
 */
function Fix() {
  return (
    <>
      {/* The code, its changed line in the accent. */}
      <Rect x={34} y={40} w={116} h={100} rx={6} className={styles.frame} />
      <Copy x={46} y={56} w={40} quiet />
      <Copy x={56} y={70} w={60} quiet />
      <Rect x={50} y={78} w={88} h={16} rx={4} className={styles.region} />
      <path className={styles.regionCopy} d="M58,86 L120,86" />
      <Copy x={56} y={104} w={48} quiet />
      <Copy x={46} y={118} w={30} quiet />
      <Hop x1={150} x2={188} y={86} />
      {/* The screen it fixes, signed off. */}
      <Rect x={188} y={40} w={100} h={100} rx={6} className={styles.frame} />
      <Copy x={200} y={56} w={40} />
      <Rect x={200} y={68} w={76} h={26} rx={4} className={styles.soft} />
      <Copy x={200} y={108} w={36} quiet />
      <Focus x={262} y={118} glyph="check-circle" size={12} />
    </>
  );
}

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* 1 · AI. Checks your live product, screen by screen, against its design system. */
  'home-ai-check': Check,
  /* 2 · Designer. Decides which differences matter to your users. */
  'home-ai-decide': Decide,
  /* 3 · Designer. Tries the fix in working code and signs it off. */
  'home-ai-fix': Fix,
};
