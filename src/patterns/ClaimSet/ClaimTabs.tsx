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

/** A CSS time read back from a token in ms. The build may write `520ms` as `.52s`, so read the unit. */
const toMs = (value: string) => {
  const v = value.trim();
  return v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000;
};

/**
 * The tabs layout: the claims as tabs along the top of a paper-deep stage, the chosen claim's slide
 * on paper below: its title and words beside its example, with no drawing (owner, 31 Oct 2026). The slide is ONE piece and moves as one, out toward one side and in from the other,
 * in the direction of the chosen claim; the panel is as tall as the tallest claim and never resizes.
 *
 * Autoplay has no control of its own (owner, 31 Oct 2026); the reader's behaviour is the control. It
 * runs only where there is a mouse, while the band is on screen; the pointer over the stage or focus
 * inside it holds the timer; any deliberate act (a tab, an arrow key, selected text, a link) stops it
 * for good; it plays through once, returns to the first claim and rests. Reduced motion never starts
 * it. The rule after each tab's number is its timer.
 *
 * Where there is a mouse, moving the pointer onto a tab chooses it after a short intent delay, so a
 * sweep across the row does not flicker; it is a deliberate act and stops autoplay. Only the hand
 * moving the pointer counts: a tab scrolled under a still pointer is never chosen. It never moves
 * focus: click, tap and the keyboard (arrows, Home, End) work exactly as before. Once, when the stage
 * first comes into view, the slide peeks: the first claim's slide eases a little to the side, the edge
 * of the next one shows in the space it leaves, and both come back. The tab row never moves. It shows
 * there is more without choosing anything, so autoplay is untouched; any choice made during it ends it
 * at once. Never under reduced motion, or below 1024, where every claim is already on the page.
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
  const endPeek = useRef<(() => void) | null>(null);
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
  /* Restarts the clock's frame loop, which ends whenever the clock cannot count. Called by whatever
     can make it count again (coming into view, the pointer leaving, focus leaving) and by `stop`, so
     the fill is cleared even while the loop is idle. */
  const wake = useRef(() => {});

  const stop = useCallback(() => {
    clock.current.stopped = true;
    clock.current.elapsed = 0;
    wake.current();
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
    endPeek.current?.();
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
    leaving.dataset.leaving = '';
    entering.style.transform = `translateX(${direction * travel}px)`;
    void box.offsetHeight;
    box.dataset.moving = '';
    entering.style.transform = 'translateX(0)';
    leaving.style.transform = `translateX(${-direction * travel}px)`;

    const done = () => {
      clearTimeout(timer);
      delete leaving.dataset.leaving;
      delete box.dataset.moving;
      leaving.style.transform = '';
      entering.style.transform = '';
      finish.current = null;
    };
    const duration = parseFloat(getComputedStyle(entering).transitionDuration) * 1000 || 360;
    const timer = setTimeout(done, duration + 40);
    finish.current = done;
  }, [active, placePiece]);

  useEffect(() => {
    placePiece();
    const resize = new ResizeObserver(placePiece);
    if (stage.current) resize.observe(stage.current);
    return () => resize.disconnect();
  }, [placePiece]);

  /* The peek, once, when the stage first comes into view: the first slide eases aside by the peek's
     travel and the next slide's edge shows in the space it leaves, then both come back on the same
     curve. Transform only; nothing is chosen, so autoplay is untouched. */
  useEffect(() => {
    const box = panel.current;
    if (!box || items.length < 2) return;
    if (
      matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !matchMedia('(min-width: 1024px)').matches
    )
      return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const end = () => {
      timers.forEach(clearTimeout);
      delete box.dataset.peek;
      const next = slides.current[1];
      if (next) delete next.dataset.peek;
      endPeek.current = null;
    };
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        seen.disconnect();
        const next = slides.current[1];
        if (shown.current !== 0 || !next) return;
        const style = getComputedStyle(box);
        const move = toMs(style.getPropertyValue('--clm-peek-duration')) || 520;
        const hold = toMs(style.getPropertyValue('--clm-peek-hold')) || 360;
        next.dataset.peek = '';
        box.dataset.peek = 'ready';
        void box.offsetHeight;
        box.dataset.peek = 'out';
        endPeek.current = end;
        timers.push(setTimeout(() => (box.dataset.peek = 'back'), move + hold));
        timers.push(setTimeout(end, move * 2 + hold + 40));
      },
      { threshold: 0.6 },
    );
    seen.observe(box);
    return () => {
      seen.disconnect();
      end();
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

  /* The clock: a frame loop that runs only while every condition to count holds, and ends otherwise,
     so an idle, finished or off-screen set costs no frames. */
  useEffect(() => {
    const c = clock.current;
    c.stopped =
      !matchMedia(AUTOPLAY_QUERY).matches ||
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = 0;
    let frame = 0;
    const counting = () => !c.stopped && !c.hold && !c.focus && c.visible;
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min(now - last, 100) : 0;
      last = now;
      if (counting()) {
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
      if (counting()) frame = requestAnimationFrame(tick);
      else last = 0;
    };
    wake.current = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    wake.current();
    const seen = new IntersectionObserver(
      ([entry]) => {
        c.visible = entry?.isIntersecting ?? false;
        wake.current();
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
      wake.current = () => {};
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
     hand moving the pointer over the tab: a tab scrolled under a still pointer is not chosen, since
     that is not a deliberate act and would stop autoplay. */
  const cancelIntent = () => {
    if (intent.current) clearTimeout(intent.current);
    intent.current = null;
    intentFor.current = null;
  };
  const onHover = (event: PointerEvent<HTMLButtonElement>, i: number) => {
    if (event.pointerType !== 'mouse' || !matchMedia(HOVER_QUERY).matches) return;
    if (!handMoved.current) return;
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
      onPointerLeave={() => {
        clock.current.hold = false;
        wake.current();
      }}
      onFocus={() => (clock.current.focus = true)}
      onBlur={() => {
        clock.current.focus = false;
        wake.current();
      }}
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
