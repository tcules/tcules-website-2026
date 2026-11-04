import type { ReactNode } from 'react';

import { Cluster } from '@/components';
import { cx } from '@/lib/cx';

import styles from './StatusMark.module.css';

/**
 * A gap map's five states, each with its mark, read beside its word (the readiness report, 2 Nov 2026).
 *
 * The marks differ by FORM and WEIGHT, not by colour (critic, audits run, 4 Nov 2026: all five took the
 * same small blue glyph, so "Missing", the row that goes first, read no louder than "Proven"). Blue stays
 * the only accent and only the loudest mark takes it:
 *
 *   missing           a filled disc, the cross knocked out of it, in the accent: the one solid mark
 *   assumed           a dashed ring holding a question: not yet checked
 *   proven            a whole ring holding a tick
 *   parked            a whole ring holding a pause
 *   for a specialist  a whole ring holding an arrow out: handed on
 *
 * Read in greyscale the set still sorts itself: one solid disc, one broken ring, three whole rings each
 * with its own sign.
 */
const DISC = 'M8,0.5 A7.5,7.5 0 1 1 8,15.5 A7.5,7.5 0 1 1 8,0.5 Z';
const CROSS =
  'M8,9.27 L6.16,11.11 L4.89,9.84 L6.73,8 L4.89,6.16 L6.16,4.89 L8,6.73 L9.84,4.89 L11.11,6.16 L9.27,8 L11.11,9.84 L9.84,11.11 Z';

const MARKS: Readonly<Record<string, { solid?: boolean; dashed?: boolean; sign: ReactNode }>> =
  {
    missing: {
      solid: true,
      /* One even-odd path: the disc with the cross cut through it, so the page's ground shows in it. */
      sign: null,
    },
    assumed: {
      dashed: true,
      sign: (
        <>
          <path
            className={styles.sign}
            d="M6.3,6.4 A1.8,1.8 0 1 1 8.9,8 C8.3,8.3 8,8.7 8,9.3"
          />
          <circle className={styles.dot} cx="8" cy="11.3" r="0.9" />
        </>
      ),
    },
    proven: { sign: <path className={styles.sign} d="M5.2,8.2 L7.2,10.2 L10.9,6.1" /> },
    parked: {
      sign: <path className={styles.sign} d="M6.8,5.8 L6.8,10.2 M9.2,5.8 L9.2,10.2" />,
    },
    'for a specialist': {
      sign: <path className={styles.sign} d="M5.4,8 L10.2,8 M8.2,6 L10.4,8 L8.2,10" />,
    },
  };

/** Whether a value names one of the five states: a column is a status column when every value does. */
export const isStatus = (name: string): boolean =>
  Object.hasOwn(MARKS, name.trim().toLowerCase());

export function StatusMark({ name }: { name: string }) {
  const mark = isStatus(name) ? MARKS[name.trim().toLowerCase()] : undefined;
  return (
    <Cluster colGap="tight" align="center" nowrap>
      {mark ? (
        <svg
          className={cx(styles.mark, mark.solid && styles.loud)}
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          {mark.solid ? (
            <path className={styles.disc} fillRule="evenodd" d={`${DISC} ${CROSS}`} />
          ) : (
            <circle
              className={cx(styles.ring, mark.dashed && styles.dashed)}
              cx="8"
              cy="8"
              r="6.75"
            />
          )}
          {mark.sign}
        </svg>
      ) : null}
      <span className={styles.name}>{name}</span>
    </Cluster>
  );
}
