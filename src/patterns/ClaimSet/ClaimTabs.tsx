'use client';

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';

import { Layout } from '@/components';

import { ClaimProof } from './ClaimProof';
import { ClaimWords } from './ClaimWords';
import type { ClaimSetItem } from './ClaimSet';
import styles from './ClaimSet.module.css';

/** How long a claim stays before the next one comes in: about the time its words take to read. */
const DWELL_MS = 15000;
/** Where autoplay may run at all: a mouse, and the stage's own width (below it every claim is stacked). */
const AUTOPLAY_QUERY = '(min-width: 1024px) and (hover: hover) and (pointer: fine)';
/** Where resting the pointer on a tab chooses it: a mouse or trackpad, never touch or a stylus. */
const HOVER_QUERY = '(hover: hover) and (pointer: fine)';
/**
 * How long the pointer rests on a tab before it is chosen: long enough that sweeping across the row
 * to reach another tab, or out of the stage, changes nothing; short enough to read as immediate.
 */
const HOVER_INTENT_MS = 140;

/**
 * The tabs layout: the claims as tabs along the top of a paper-deep stage, the chosen claim's slide
 * on paper below: its title and words beside its example, with no drawing (owner, 31 Oct 2026). The slide is ONE piece and moves as one, out toward one side and in from the other,
 * in the direction of the chosen claim; the panel's height follows the slide on the same curve.
 *
 * Autoplay has no control of its own (owner, 31 Oct 2026); the reader's behaviour is the control. It
 * runs only where there is a mouse, while the band is on screen; the pointer over the stage or focus
 * inside it holds the timer; any deliberate act (a tab, an arrow key, selected text, a link) stops it
 * for good; it plays through once, returns to the first claim and rests. Reduced motion never starts
 * it. The rule after each tab's number is its timer.
 *
 * Where there is a mouse, moving the pointer onto a tab chooses it after a short intent delay, so a
 * sweep across the row does not flicker; it is a deliberate act and stops autoplay. Only the hand
 * moving the pointer counts: a tab scrolled under a still pointer, or sliding under it during the
 * entry, is never chosen. It never moves
 * focus: click, tap and the keyboard (arrows, Home, End) work exactly as before. Once, when the stage
 * scrolls into view, the claims after the first slide in from the side one after another, so the
 * row reads as more than its chosen tab. It is armed only while the stage is still off screen (a
 * stage already in view at load is left alone rather than snapped away and back), and never under
 * reduced motion or below 1024, where there are no tabs.
 */
export function ClaimTabs({
  id,
  labelledBy,
  items,
}: {
  id: string;
  labelledBy: string;
  items: readonly ClaimSetItem[];
}) {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const piece = useRef<HTMLSpanElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const shown = useRef(0);
  const finish = useRef<(() => void) | null>(null);
  const intent = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intentFor = useRef<number | null>(null);
  /* Whether the latest pointermove was the hand moving the mouse, not the page scrolling under it. */
  const handMoved = useRef(false);
  const clock = useRef({
    elapsed: 0,
    hold: false,
    focus: false,
    visible: false,
    stopped: true,
  });

  const stop = useCallback(() => {
    clock.current.stopped = true;
    clock.current.elapsed = 0;
  }, []);

  /* The chosen tab's paper piece: one element that travels between tabs. */
  const placePiece = useCallback(() => {
    const tab = tabs.current[shown.current];
    if (!piece.current || !tab) return;
    piece.current.style.inlineSize = `${tab.offsetWidth}px`;
    piece.current.style.blockSize = `${tab.offsetHeight}px`;
    piece.current.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
  }, []);

  /* Move the slide: the old one leaves toward one side as the new one enters from the other. */
  useLayoutEffect(() => {
    const from = shown.current;
    if (from === active) return;
    finish.current?.();
    shown.current = active;
    placePiece();
    const box = panel.current;
    const leaving = slides.current[from];
    const entering = slides.current[active];
    const still =
      !box ||
      !leaving ||
      !entering ||
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !matchMedia('(min-width: 1024px)').matches;
    if (still) return;

    const direction = active > from ? 1 : -1;
    const travel = box.clientWidth;
    const startHeight = box.offsetHeight;
    leaving.dataset.leaving = '';
    box.style.blockSize = 'auto';
    const endHeight = box.offsetHeight;
    box.style.blockSize = `${startHeight}px`;
    entering.style.transform = `translateX(${direction * travel}px)`;
    void box.offsetHeight;
    box.dataset.moving = '';
    box.style.blockSize = `${endHeight}px`;
    entering.style.transform = 'translateX(0)';
    leaving.style.transform = `translateX(${-direction * travel}px)`;

    const done = () => {
      clearTimeout(timer);
      delete leaving.dataset.leaving;
      delete box.dataset.moving;
      leaving.style.transform = '';
      entering.style.transform = '';
      box.style.blockSize = '';
      finish.current = null;
    };
    const duration = parseFloat(getComputedStyle(box).transitionDuration) * 1000 || 360;
    const timer = setTimeout(done, duration + 40);
    finish.current = done;
  }, [active, placePiece]);

  useEffect(() => {
    placePiece();
    const resize = new ResizeObserver(placePiece);
    if (stage.current) resize.observe(stage.current);
    return () => resize.disconnect();
  }, [placePiece]);

  /* The entry: armed (the later tabs held off to the side) only while the stage is below or above
     the fold, released once when it scrolls in, then cleared so nothing of it lingers. */
  useLayoutEffect(() => {
    const box = stage.current;
    if (!box) return;
    if (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !matchMedia('(min-width: 1024px)').matches
    )
      return;
    const rect = box.getBoundingClientRect();
    if (rect.top < innerHeight && rect.bottom > 0) return;
    box.dataset.entry = 'armed';
    let timer: ReturnType<typeof setTimeout> | undefined;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        seen.disconnect();
        box.dataset.entry = 'play';
        const style = getComputedStyle(box);
        const total =
          (parseFloat(style.getPropertyValue('--clm-entry-duration')) || 600) +
          (parseFloat(style.getPropertyValue('--clm-entry-stagger')) || 80) * items.length;
        timer = setTimeout(() => delete box.dataset.entry, total + 40);
      },
      { threshold: 0.35 },
    );
    seen.observe(box);
    return () => {
      seen.disconnect();
      clearTimeout(timer);
      delete box.dataset.entry;
    };
  }, [items.length]);

  /* A pointermove counts as the hand's only if the pointer moved on the screen. Scrolling fires
     pointerenter and a synthetic pointermove with the pointer still: same screen point, no movement.
     Read on window in the capture phase, so it is settled before the tab's own handler runs. */
  useEffect(() => {
    let at: { x: number; y: number } | null = null;
    const record = (event: globalThis.PointerEvent) => {
      handMoved.current = at
        ? event.screenX !== at.x || event.screenY !== at.y
        : event.movementX !== 0 || event.movementY !== 0;
      at = { x: event.screenX, y: event.screenY };
    };
    addEventListener('pointermove', record, { capture: true, passive: true });
    return () => {
      removeEventListener('pointermove', record, { capture: true });
      if (intent.current) clearTimeout(intent.current);
    };
  }, []);

  /* The clock: a frame loop that only counts while every condition to run holds. */
  useEffect(() => {
    const c = clock.current;
    c.stopped =
      !matchMedia(AUTOPLAY_QUERY).matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = 0;
    let frame = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      if (!c.stopped && !c.hold && !c.focus && c.visible) {
        c.elapsed += dt;
        if (c.elapsed >= DWELL_MS) {
          c.elapsed = 0;
          const next = shown.current + 1;
          if (next >= items.length) {
            setActive(0);
            c.stopped = true;
          } else setActive(next);
        }
      }
      fills.current.forEach((fill, i) => {
        if (fill)
          fill.style.transform = `scaleX(${i === shown.current && !c.stopped ? c.elapsed / DWELL_MS : 0})`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const seen = new IntersectionObserver(
      ([entry]) => {
        c.visible = entry?.isIntersecting ?? false;
      },
      { threshold: 0.35 },
    );
    if (stage.current) seen.observe(stage.current);
    const selecting = () => {
      const selection = document.getSelection();
      if (selection && !selection.isCollapsed && stage.current?.contains(selection.anchorNode))
        stop();
    };
    document.addEventListener('selectionchange', selecting);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      document.removeEventListener('selectionchange', selecting);
    };
  }, [items.length, stop]);

  const choose = (i: number, focus = false) => {
    stop();
    setActive(i);
    if (focus) tabs.current[i]?.focus();
  };

  /* Hover: choose the tab the pointer rests on, after the intent delay. Mouse only, and only from the
     hand moving the pointer over the tab: a tab scrolled under a still pointer, or sliding under it
     during the entry, is not chosen, since that is not a deliberate act and would stop autoplay. */
  const cancelIntent = () => {
    if (intent.current) clearTimeout(intent.current);
    intent.current = null;
    intentFor.current = null;
  };
  const onHover = (event: PointerEvent<HTMLButtonElement>, i: number) => {
    if (event.pointerType !== 'mouse' || !matchMedia(HOVER_QUERY).matches) return;
    if (!handMoved.current || stage.current?.dataset.entry) return;
    if (i === shown.current) return cancelIntent();
    if (intentFor.current === i) return;
    cancelIntent();
    intentFor.current = i;
    intent.current = setTimeout(() => {
      intent.current = null;
      intentFor.current = null;
      choose(i);
    }, HOVER_INTENT_MS);
  };

  const onKey = (event: KeyboardEvent, i: number) => {
    const n = items.length;
    const to =
      event.key === 'ArrowRight'
        ? (i + 1) % n
        : event.key === 'ArrowLeft'
          ? (i - 1 + n) % n
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? n - 1
              : null;
    if (to === null) return;
    event.preventDefault();
    choose(to, true);
  };

  return (
    <div
      ref={stage}
      className={styles.stage}
      onPointerEnter={() => (clock.current.hold = true)}
      onPointerLeave={() => (clock.current.hold = false)}
      onFocus={() => (clock.current.focus = true)}
      onBlur={() => (clock.current.focus = false)}
      onClick={(event) => {
        if ((event.target as Element).closest('a')) stop();
      }}
    >
      <div role="tablist" aria-labelledby={labelledBy} className={styles.tablist}>
        <span ref={piece} className={styles.piece} aria-hidden="true" />
        <Layout columns={{ lg: items.length }} colGap="tight" rowGap="tight">
          {items.map((item, i) => (
            <button
              key={item.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-panel-${i}`}
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => {
                cancelIntent();
                choose(i);
              }}
              onPointerMove={(event) => onHover(event, i)}
              onPointerLeave={cancelIntent}
              onKeyDown={(event) => onKey(event, i)}
            >
              <span className={styles.index} aria-hidden="true">
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.rail}>
                  <span
                    ref={(el) => {
                      fills.current[i] = el;
                    }}
                    className={styles.fill}
                  />
                </span>
              </span>
              <span className={styles.tabTitle}>{item.title}</span>
            </button>
          ))}
        </Layout>
      </div>
      <div ref={panel} className={styles.panel}>
        <Layout rowGap="stack" className={styles.track}>
          {items.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => {
                slides.current[i] = el;
              }}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              data-active={i === active ? '' : undefined}
              className={styles.slide}
            >
              {/* Two parts: the claim's title and words; its example. No drawing: hard parts are not drawn
                  (owner, 31 Oct 2026). A claim without an example fills the slide. */}
              <Layout
                columns={item.example ? { lg: [1, 1] } : undefined}
                colGap="section"
                rowGap="stack"
                align="start"
              >
                <Layout rowGap="block">
                  <h3 className={styles.title}>{item.title}</h3>
                  <ClaimWords words={item.words} spread={!item.example} />
                </Layout>
                {item.example ? <ClaimProof example={item.example} /> : null}
              </Layout>
            </div>
          ))}
        </Layout>
      </div>
    </div>
  );
}
