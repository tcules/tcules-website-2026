'use client';

import { type ReactNode, useState, useSyncExternalStore } from 'react';

import { cx } from '@/lib/cx';

import styles from './Media.module.css';

const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeReduce = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const readReduce = () => window.matchMedia(REDUCE).matches;

/**
 * The stop control of an animated image (an animated WebP or GIF): Media renders it for an
 * `animated` record, around the same `<img>` it renders for any other.
 *
 * ── The contract ─────────────────────────────────────────────────────────────────
 *   Clip's, for a file that cannot be scrubbed. One control below the image, at its end
 *   (never on it: a recorded tour has its own controls in its corners), always present: pause while it moves, play while it holds (WCAG 2.2.2 — anything that moves for more
 *   than five seconds by itself can be stopped). Reduced motion: it never moves by itself; the
 *   still stands and the control plays it on request.
 *
 *   An `<img>` cannot be paused, so pausing SHOWS THE STILL — the file's first frame, which the
 *   resizer serves (`stillSrc`). It is a `<source>` in a `<picture>` around the img, so the img keeps
 *   its alt, its loading and its box; only the file the picture selects changes. Before hydration
 *   the source is media-gated on `prefers-reduced-motion`, so a reader who asked for no motion
 *   never sees a frame move, even before the script runs.
 */
export function MediaMotion({
  still,
  label,
  glyphs,
  contained,
  children,
}: {
  /** The still: the first frame, at the 1240 rung. */
  still: string;
  /** The image's alt, which names what the control stops. */
  label: string;
  glyphs: { play: ReactNode; pause: ReactNode };
  /** The placement owns a box the image fills (`fit="fill" | "contain"`). */
  contained: boolean;
  /** Media's `<img>`, unchanged. */
  children: ReactNode;
}) {
  /* The reader's press wins; before one, the motion preference decides. On the server and through
     hydration the preference is unknown (`null`), so the state is `auto` and the media query in the
     markup decides instead. */
  const [choice, setChoice] = useState<'playing' | 'paused' | null>(null);
  const reduce = useSyncExternalStore(subscribeReduce, readReduce, () => null);
  const state = choice ?? (reduce === null ? 'auto' : reduce ? 'paused' : 'playing');

  /* Before hydration the control says what it will do for a reader without the preference, since
     that is what the image is doing; hydration corrects it before anyone can reach it. */
  const moving = state !== 'paused';
  const action = moving ? 'Pause' : 'Play';
  const name = label.trim() ? `${action}: ${label.trim()}` : `${action} animation`;

  return (
    <span className={styles.motion}>
      <picture className={cx(styles.picture, contained && styles.pictureFill)}>
        {/* Keyed, so a change of state inserts a new <source> rather than editing one: a browser
            re-selects a picture's file when a source is added or removed, not when its media
            attribute changes, and an edited one left the image blank. */}
        {state === 'auto' ? (
          <source key="auto" media={REDUCE} srcSet={still} />
        ) : state === 'paused' ? (
          <source key="paused" srcSet={still} />
        ) : null}
        {children}
      </picture>
      <span className={styles.motionBar}>
        <button
          type="button"
          className={styles.motionControl}
          onClick={() => setChoice(moving ? 'paused' : 'playing')}
          aria-label={name}
        >
          {moving ? glyphs.pause : glyphs.play}
        </button>
      </span>
    </span>
  );
}
