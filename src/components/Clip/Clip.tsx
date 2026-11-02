'use client';

import {
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { cx } from '@/lib/cx';

import styles from './Clip.module.css';

/** One encoding of one rendition: a file and its MIME type, in the order a browser should try them. */
export type ClipSource = { src: string; type: 'video/webm' | 'video/mp4' };

/** One rendition of the film: its files and the still a reader sees before it plays. */
export type ClipRendition = { sources: readonly ClipSource[]; poster: string };

export type ClipProps = {
  /** The 16/9 rendition, shown from 640 up, and at every width when there is no `tall`. */
  wide: ClipRendition;
  /** The 4/5 rendition below 640: the same film recut for a phone column. */
  tall?: ClipRendition;
  /** The accessible name: what the film is. "Video" names nothing. */
  label: string;
  /**
   * What the film says, as text: read by a screen reader in place of the motion, through
   * aria-describedby. A silent film with words on screen has no other text alternative.
   */
  description?: string;
  /**
   * The control's three glyphs, composed by the caller (a primitive takes its sibling as a node,
   * never by import): `pause` while it plays, `play` while it is paused or has not started, and
   * `replay` once it has ended.
   */
  glyphs: { play: ReactNode; pause: ReactNode; replay: ReactNode };
  className?: string;
};

type State = 'idle' | 'playing' | 'paused' | 'ended';

/**
 * Clip — a silent film from the site's own files (2 Nov 2026, the Prototype Readiness Review hero).
 *
 * ── The contract ─────────────────────────────────────────────────────────────────
 *   It plays ONCE, by itself, when 40% of it is in view, and holds on its last frame: the end card
 *   is the film's conclusion, so it stays. Scrolled out while playing it pauses, and it resumes
 *   when it returns unless the reader paused it. It is muted because it has no sound.
 *   One control in its corner, always present: pause while playing, play while paused, play again
 *   once ended (WCAG 2.2.2 — anything that moves for more than five seconds can be stopped).
 *   Reduced motion: it never starts by itself. The poster stands, and the control plays it on
 *   request.
 *   Two renditions, one shown: the wide one from 640 and the tall one below it, chosen by CSS.
 *   Neither preloads; only the shown one is ever played, so a phone fetches only its own file.
 *
 * ── What it is not ───────────────────────────────────────────────────────────────
 *   Not a player. There is no scrubber, no volume and no fullscreen: a film with sound and length
 *   is a VideoTestimonial or a YouTube embed. It takes no edge, ratio or radius from the caller
 *   beyond its two fixed ratios; the placement's box is the parent's.
 */
export function Clip({ wide, tall, label, description, glyphs, className }: ClipProps) {
  const wideRef = useRef<HTMLVideoElement>(null);
  const tallRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>('idle');
  const heldByReader = useRef(false);
  const descId = useId();

  /* The rendition CSS is showing: a hidden <video> has no layout box. */
  const shown = useCallback((): HTMLVideoElement | null => {
    const t = tallRef.current;
    if (t && t.getClientRects().length > 0) return t;
    return wideRef.current;
  }, []);

  const play = useCallback(() => {
    const v = shown();
    if (!v) return;
    if (v.ended) v.currentTime = 0;
    v.play().catch(() => setState('paused'));
  }, [shown]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = shown();
        if (!v || !entry) return;
        if (entry.isIntersecting) {
          if (!reduce.matches && !heldByReader.current && !v.ended) play();
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [play, shown]);

  const sync = (v: HTMLVideoElement) => () =>
    setState(
      v.ended ? 'ended' : v.paused ? (v.currentTime > 0 ? 'paused' : 'idle') : 'playing',
    );

  const onControl = () => {
    const v = shown();
    if (!v) return;
    if (state === 'playing') {
      heldByReader.current = true;
      v.pause();
    } else {
      heldByReader.current = false;
      play();
    }
  };

  const action = state === 'playing' ? 'Pause' : state === 'ended' ? 'Play again' : 'Play';
  const glyph =
    state === 'playing' ? glyphs.pause : state === 'ended' ? glyphs.replay : glyphs.play;

  const filmProps = {
    only: !tall,
    label,
    describedBy: description ? descId : undefined,
    onChange: (v: HTMLVideoElement) => sync(v)(),
  };

  return (
    <div ref={rootRef} className={cx(styles.clip, className)}>
      <Film ref={wideRef} rendition={wide} which="wide" {...filmProps} />
      {tall ? <Film ref={tallRef} rendition={tall} which="tall" {...filmProps} /> : null}
      <button
        type="button"
        className={styles.control}
        onClick={onControl}
        aria-label={`${action}: ${label}`}
      >
        {glyph}
      </button>
      {description ? (
        <p id={descId} className={styles.hidden}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

/** One rendition's <video>: muted, inline, never preloaded, reporting every state change. */
function Film({
  ref,
  rendition,
  which,
  only,
  label,
  describedBy,
  onChange,
}: {
  ref: Ref<HTMLVideoElement>;
  rendition: ClipRendition;
  which: 'wide' | 'tall';
  only: boolean;
  label: string;
  describedBy?: string;
  onChange: (v: HTMLVideoElement) => void;
}) {
  return (
    <video
      ref={ref}
      className={cx(styles.film, styles[which], only && styles.only)}
      poster={rendition.poster}
      muted
      playsInline
      preload="none"
      aria-label={label}
      aria-describedby={describedBy}
      onPlay={(e) => onChange(e.currentTarget)}
      onPause={(e) => onChange(e.currentTarget)}
      onEnded={(e) => onChange(e.currentTarget)}
    >
      {rendition.sources.map((source) => (
        <source key={source.src} src={source.src} type={source.type} />
      ))}
    </video>
  );
}
