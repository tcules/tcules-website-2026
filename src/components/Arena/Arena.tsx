'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import { cx } from '@/lib/cx';

import { startArena, type ArenaDriver } from './driver';
import styles from './Arena.module.css';

export type ArenaProps = {
  /** The drawing: an SVG file from the site's own `public/`, its ids prefixed `arena-`. */
  src: string;
  /** What the drawing shows, as text: the accessible name of the figure. */
  label: string;
  /**
   * The control's glyphs, composed by the caller (a primitive takes its sibling as a node, never
   * by import): `pause` while it plays, `play` while it is paused. It loops, so there is no
   * play-again state.
   */
  glyphs: { play: ReactNode; pause: ReactNode };
  className?: string;
};

/** Below this the box is square and the camera holds on the studio floor (the artifact's phone cut). */
const PHONE_QUERY = '(max-width: 639px)';
/** Below this the hero stacks: the drawing sits under the words, the column's full width. */
const STACKED_QUERY = '(max-width: 1023.98px)';

/**
 * Arena — the home hero's animated drawing (owner, 2 Nov 2026, the "Tcules Hero Arena" artifact).
 *
 * A field of similar grey apps; one rises and opens, and underneath a client, a researcher, a
 * designer and an engineer work with agents until the finished card flies up into the app. It
 * loops every 11.8 seconds (v11, 4 Nov 2026: the lid gives, the stations rise, the work arcs, and the
 * finished card pops, resolves and catches the light).
 *
 * ── The contract ─────────────────────────────────────────────────────────────────
 *   The drawing is FETCHED after the page paints (46 KB gzipped, 480 KB raw), never inlined into
 *   the HTML, so the hero's words are not held behind it. The box holds its ratio before it lands,
 *   so nothing shifts.
 *   It runs only while in view, and stops its clock when scrolled away.
 *   One control in its corner once it has landed: pause while playing, play while paused (WCAG
 *   2.2.2 — anything that moves for more than five seconds can be stopped). From the still, play
 *   runs it from its opening.
 *   Reduced motion: it never starts by itself. The finished frame stands, and play runs it.
 *   The figure is named by `label` (role="img"); the SVG inside it is hidden from assistive tech.
 */
export function Arena({ src, label, glyphs, className }: ArenaProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const driver = useRef<ArenaDriver | null>(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    if (!stage || !art) return;
    let cancelled = false;
    let io: IntersectionObserver | undefined;

    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`${r.status}`))))
      .then((markup) => {
        if (cancelled) return;
        /* The site's own file, served from public/: markup we authored, not user input. */
        art.innerHTML = markup;
        const svg = art.querySelector('svg');
        if (!svg) return;
        const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
        driver.current = startArena(stage, svg, {
          still,
          phone: matchMedia(PHONE_QUERY).matches,
          stacked: matchMedia(STACKED_QUERY).matches,
        });
        setPlaying(!still);
        setReady(true);
        io = new IntersectionObserver(
          ([entry]) =>
            entry?.isIntersecting ? driver.current?.resume() : driver.current?.suspend(),
          { threshold: 0 },
        );
        io.observe(stage);
      })
      .catch((error: unknown) => {
        if (process.env.NODE_ENV !== 'production')
          console.warn(`Arena: ${src} did not load`, error);
      });

    return () => {
      cancelled = true;
      io?.disconnect();
      driver.current?.destroy();
      driver.current = null;
      art.innerHTML = '';
    };
  }, [src]);

  const toggle = () => {
    if (playing) driver.current?.pause();
    else driver.current?.play();
    setPlaying(!playing);
  };

  return (
    <div className={cx(styles.arena, className)}>
      <div ref={stageRef} className={styles.stage} role="img" aria-label={label}>
        <div ref={artRef} className={styles.art} />
      </div>
      {ready ? (
        <button
          type="button"
          className={styles.control}
          onClick={toggle}
          aria-label={playing ? 'Pause animation' : 'Play animation'}
        >
          {playing ? glyphs.pause : glyphs.play}
        </button>
      ) : null}
    </div>
  );
}
