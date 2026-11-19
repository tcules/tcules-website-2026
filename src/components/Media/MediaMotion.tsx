'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';

import { cx } from '@/lib/cx';
import { glyphs as GLYPHS, type IconName } from '@/lib/icon-glyphs';

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
 *   Clip's, for a file that cannot be scrubbed. One control below the image, at its end — or, in a
 *   Figure, at the end of the caption's row (owner, 19 Nov 2026) — (never on it: a recorded tour has its own controls in its corners), always present: pause while it moves, play while it holds (WCAG 2.2.2 — anything that moves for more
 *   than five seconds by itself can be stopped). Reduced motion: it never moves by itself; the
 *   still stands and the control plays it on request.
 *
 *   An `<img>` cannot be paused, so pausing SHOWS THE STILL — the file's first frame, which the
 *   resizer serves (`stillSrc`). It is a `<source>` in a `<picture>` around the img, so the img keeps
 *   its alt, its loading and its box; only the file the picture selects changes. Before hydration
 *   the source is media-gated on `prefers-reduced-motion`, so a reader who asked for no motion
 *   never sees a frame move, even before the script runs.
 */
type Choice = 'playing' | 'paused' | null;

/* A placement that sets the control in a row of its own (Figure: beside its caption) shares one
   choice between the image and the control through this scope. Without one, MediaMotion keeps the
   choice itself and sets the control below the image. */
const MotionScope = createContext<{ choice: Choice; setChoice: (next: Choice) => void } | null>(
  null,
);

/** Holds one animated image's play/pause choice for a placement that sets its control apart. */
export function MediaMotionScope({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice>(null);
  return <MotionScope value={{ choice, setChoice }}>{children}</MotionScope>;
}

/* The reader's press wins; before one, the motion preference decides. On the server and through
   hydration the preference is unknown (`null`), so the state is `auto` and the media query in the
   markup decides instead. */
function useMotionState(choice: Choice) {
  const reduce = useSyncExternalStore(subscribeReduce, readReduce, () => null);
  return choice ?? (reduce === null ? 'auto' : reduce ? 'paused' : 'playing');
}

export function MediaMotion({
  still,
  label,
  contained,
  children,
}: {
  /** The still: the first frame, at the 1240 rung. */
  still: string;
  /** The image's alt, which names what the control stops. */
  label: string;
  /** The placement owns a box the image fills (`fit="fill" | "contain"`). */
  contained: boolean;
  /** Media's `<img>`, unchanged. */
  children: ReactNode;
}) {
  const scope = useContext(MotionScope);
  const [own, setOwn] = useState<Choice>(null);
  const choice = scope ? scope.choice : own;
  const setChoice = scope ? scope.setChoice : setOwn;
  const state = useMotionState(choice);

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
      {scope ? null : (
        <span className={styles.motionBar}>
          <Control label={label} state={state} setChoice={setChoice} />
        </span>
      )}
    </span>
  );
}

/** The control alone, for a placement inside a MediaMotionScope that sets it in its own row. */
export function MediaMotionControl({ label }: { label: string }) {
  const scope = useContext(MotionScope);
  const state = useMotionState(scope?.choice ?? null);
  if (!scope) return null;
  return <Control label={label} state={state} setChoice={scope.setChoice} />;
}

/* Before hydration the control says what it will do for a reader without the preference, since
   that is what the image is doing; hydration corrects it before anyone can reach it. */
function Control({
  label,
  state,
  setChoice,
}: {
  label: string;
  state: 'auto' | 'paused' | 'playing';
  setChoice: (next: Choice) => void;
}) {
  const moving = state !== 'paused';
  const action = moving ? 'Pause' : 'Play';
  const name = label.trim() ? `${action}: ${label.trim()}` : `${action} animation`;
  return (
    <button
      type="button"
      className={styles.motionControl}
      onClick={() => setChoice(moving ? 'paused' : 'playing')}
      aria-label={name}
    >
      <Glyph name={moving ? 'chrome-pause' : 'chrome-play'} />
    </button>
  );
}

/**
 * The control's mark, from the icon set's own paths: the universal pause and play (the `chrome-`
 * marks Clip's and the hero's films use). Drawn here from the leaf rather than taken as an `Icon`
 * node, so no placement can render a moving image without its control.
 */
function Glyph({ name }: { name: IconName }) {
  return (
    <svg
      className={styles.motionGlyph}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
