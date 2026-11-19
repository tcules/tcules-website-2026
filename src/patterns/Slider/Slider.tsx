'use client';

import {
  Children,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

import { Button, Cluster, Icon, Layout } from '@/components';
import { cx } from '@/lib/cx';

import styles from './Slider.module.css';

/**
 * How many slides are in view at the widest step. The Slider owns the ladder below it, so a
 * caller states one number and every breakpoint follows (visual-direction § 1.4, § 3.7):
 *
 *            base (+ peek)   md 768   lg 1024   xl 1440
 *   1        1 (no peek)     1        1         1         a G testimonial: one featured slide
 *   2        1               2        2         2         pair cards, 365 / 572 wide
 *   3        1               2        3         3         C-image-5+, "a Slider showing 3" — 392
 *   4        1               2        3         4         Card-4 sets, 286 at 1440
 *
 * Below md the row shows one slide and a 24px peek of the next, because at 326 a second card would
 * be 147 wide. From md up the count is exact and there is no peek: the controls say there is more.
 * At one per view there is never a peek (cmp-testimonials, 6 Oct 2026): the slide is a composite,
 * and its neighbour's start edge read as a stray portrait sliver and a loose quote rule.
 */
export type SliderPerView = 1 | 2 | 3 | 4;

/**
 * Where the controls sit under the slides.
 *
 *   start   the progress rail at the start, the two controls at the end — under a left-weighted
 *           head, so the row's ends line up with the column's.
 *   center  the controls either side of a centred rail — under a centred head (§ 3.5: a G
 *           slider, a centred C-image head). With `autoplay` the centred row is the bars alone.
 */
export type SliderAlign = 'start' | 'center';

export type SliderProps = {
  /**
   * What the slides are — "Client stories", "Recent work". The carousel's accessible name, read
   * with "carousel" by a screen reader. Required, because an unnamed carousel is a region nobody
   * can find. Not rendered: the band's heading is the visible name.
   */
  label: string;
  /**
   * The slides, each ONE `<li>`. BlockCard already is one; anything else — a testimonial, a figure —
   * is wrapped in an `<li>` at the call site. The Slider owns the `<ul>`, so a screen reader hears
   * "list, 6 items" and "1 of 6" on each slide for free, and the list stays valid HTML: a
   * BlockCard inside a wrapper `<li>` would be an `<li>` in an `<li>`. In development the Slider
   * warns when a child renders anything else.
   */
  children: ReactNode;
  /** Slides in view at the widest step. Default 3. See `SliderPerView`. */
  perView?: SliderPerView;
  /** Default `start`. See `SliderAlign`. */
  align?: SliderAlign;
  /**
   * From md up, the row runs past the column's inline end to the viewport's edge, so the slide after
   * the last whole one shows in the band's side margin and the row reads as a rail rather than a
   * grid of exactly `perView` (cmp-services fix round 1: six image cards at three in view looked
   * the same as a three-card set beside it, with only the control row saying there were six).
   * Default `false`.
   *
   * The slides keep their tracks to the pixel: the row's content box is still the column, and the
   * bleed is inline-end padding the overflow paints into. Its width is measured — the distance from
   * the slider's end edge to the viewport's (`clientWidth`, so a classic scrollbar is excluded and
   * the page never scrolls sideways) — and written as `--slider-bleed`. Before hydration it is 0, so
   * the server render is the unbled row and nothing shifts: the peek only appears. Below md the
   * row already bleeds to both screen edges (Layout's phone scroll row), so this changes nothing
   * there. The start edge is the column's: slides scroll away under it, as a rail does.
   */
  bleed?: boolean;
  /**
   * Show part of the next slide at every width, inside the column (owner, 26 Oct 2026: "ideally, we
   * show a peek of the 4th card within the width available"). From md up the slides narrow to leave
   * `--lay-scroll-peek-wide` of the next one at the end edge; the row never leaves the column. The
   * alternative to `bleed`, which shows the next card in the margin. Ignored at one per view.
   */
  peek?: boolean;
  /**
   * Advance on its own, one slide every `interval`, wrapping from the last to the first (owner, 7 Oct
   * 2026: the typographic testimonial "inside the auto-advancing Slider"). One per view only: at
   * two or more in view an advance moves things the reader is part-way through, so with any other
   * `perView` it is ignored with a development warning. Default `false`.
   *
   * With it the rail becomes a STEPPER — one plain bar per slide (owner, 9 Oct 2026: bars only, no
   * numerals). The current bar starts FULL and empties from its start to its end over the interval, a
   * countdown to the next slide; once the rotation has stopped the current bar stays full, the
   * selected state, and the others are empty (owner, 29 Oct 2026;
   * decisions/2026-10-29-slider-bar-counts-down). Under `align="start"` a rotation control
   * (pause / play) leads the control row (WCAG 2.2.2; APG carousel). Under `align="center"` the bars
   * ARE the control row — no previous / next, no rotation button — so the chrome is one quiet strip
   * under a centred quote rather than three controls stacked on one axis. The rotation:
   *   - pauses while a mouse rests on the slides or focus is inside them, and resumes from where it
   *     was when both leave — the step's fill freezes, so the pause is visible. The control row
   *     does not hold it, so Play under the pointer that pressed it plays;
   *   - does not start for a reader who prefers reduced motion: the rotation control offers Play,
   *     and only their press starts it;
   *   - never starts before hydration, so a server render and a no-script page are the manual row;
   *   - is silent: the status line speaks after a reader's own press, never after an advance;
   *   - STOPS when a reader presses a bar or a previous / next control (owner, 29 Oct 2026): what
   *     they chose stays, its bar full. Under `start` the rotation control then offers Play. A bar
   *     under KEYBOARD focus holds it for as long as focus stays;
   *   - under reduced motion the current bar is simply full: it never drains, even with Play.
   */
  autoplay?: boolean;
  /**
   * Where a slide sits in the row's height, which is always the TALLEST slide's, so the controls
   * under the row never move as it turns. `stretch` (the default) fills it: a row of cards ends
   * level. `center` centres each slide in it: a one-up row of quotes of different lengths, where a
   * short quote under-filled at the top read as a gap above the controls (owner, 29 Oct 2026;
   * decisions/2026-10-29-quote-slider-centres-each-quote).
   */
  slideAlign?: 'stretch' | 'center';
  /** What one slide is, for each bar's name: "Show {slideName} 2 of 4". Default `'slide'`. */
  slideName?: string;
  /** Milliseconds a slide holds before the next, with `autoplay`. Default 8000 — a 35-word quote read twice. */
  interval?: number;
};

/** A slide's hold with `autoplay` (see `interval`). */
const INTERVAL = 8000;

/** Longest frame the autoplay clock will count: a backgrounded tab resumes, it does not skip. */
const MAX_FRAME = 100;

/* Reduced motion as an external store: read during render, so the default rotation state needs no
   effect. The server snapshot says "reduce", so nothing rotates before hydration. */
const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const prefersReduced = () => window.matchMedia(REDUCE).matches;
const serverPrefersReduced = () => true;

/** perView → the Layout scroll row's per-breakpoint counts. The table on `SliderPerView`. */
const LADDER: Record<SliderPerView, { base: number; md: number; lg: number; xl: number }> = {
  1: { base: 1, md: 1, lg: 1, xl: 1 },
  2: { base: 1, md: 2, lg: 2, xl: 2 },
  3: { base: 1, md: 2, lg: 3, xl: 3 },
  4: { base: 1, md: 2, lg: 3, xl: 4 },
};

/** The rail's thumb follows the same ladder in CSS, so it is the right length before hydration. */
const VIEW_CLASS: Record<SliderPerView, string | undefined> = {
  1: styles.view1,
  2: styles.view2,
  3: styles.view3,
  4: styles.view4,
};

/** Anything a keyboard can reach. If a slide holds none, the row itself takes a tab stop. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

/** Sub-pixel slack for "at the start" / "at the end": scrollLeft is fractional on zoomed pages. */
const EDGE = 2;

type Position = { ready: boolean; atStart: boolean; atEnd: boolean; active: number };

/**
 * Slider — a row of slides you scroll sideways, with previous / next controls and a progress rail
 * (fdn-scroll, 6 Oct 2026). Built to docs/specs/Slider.md.
 *
 *   ┌──────────────── Layout scroll="always", colGap gutter (32) ────────────────┐
 *   │ [ slide ]   [ slide ]   [ slide ]   [ slide → off-screen …                 │
 *   └─────────────────────────────────────────────────────────────────────────────┘
 *                                block (24)
 *   ━━━━━━━━ rail (thumb = what is in view)                              (←)  (→)
 *
 * § 1.4 budgets the controls at 24 + 48 = 72 under the tallest slide (48 steppers since fix round 2,
 * cmp-testimonials, 6 Oct 2026); that is exactly this.
 *
 * The scrolling is the BROWSER'S: Layout's scroll mode is a CSS scroll-snap row, so before this
 * component hydrates — and if its script never runs — the row still swipes, snaps, and moves as Tab
 * reaches each linked slide. What the script adds is the two controls, the rail's position, a tab
 * stop when no slide holds anything focusable, and a polite status line. The controls render
 * `disabled` until then, so a press can never be swallowed by a button that does nothing.
 *
 * Accessibility (APG carousel, adapted to a scroll row):
 *   - the root is a `<section aria-roledescription="carousel">` named by `label`;
 *   - slides are list items — position and count come from the list, not from hand-written
 *     "1 of 6" labels that could disagree with it;
 *   - the controls are real `<button>`s named "Previous slide" / "Next slide", with
 *     `aria-controls` on the row (always rendered, so the idref always resolves). At an end a
 *     control is `aria-disabled`, not `disabled`: a disabled button drops focus to the body, and a
 *     keyboard user who pressed Next to the end would be thrown out of the carousel;
 *   - after a control press, a visually hidden `aria-live="polite"` line says which slides are in
 *     view ("Slides 4 to 6 of 8"). It speaks only after a press, never on load or while swiping;
 *   - no autoplay unless asked for (`autoplay`, one per view): then a rotation control leads the
 *     controls, the rotation holds under the pointer and focus on the slides, and never starts for a
 *     reader who prefers reduced motion;
 *   - reduced motion: the row jumps instead of gliding (Layout's `scroll-behavior` is smooth only
 *     under `no-preference`, and the press uses the row's computed behaviour), and the controls'
 *     fill change is instant.
 *
 * A pattern for the usual two reasons: it takes slides as content and composes Layout, Cluster and
 * Icon. It owns no band and no ground; it sits in a band's body (ContentSection's children) and
 * reads data-surface from that Section. A client component because it holds state, a ref and
 * listeners — the only reasons `'use client'` is earned here.
 */
export function Slider({
  label,
  children,
  perView = 3,
  align = 'start',
  slideName = 'slide',
  bleed = false,
  peek = false,
  autoplay = false,
  interval = INTERVAL,
  slideAlign = 'stretch',
}: SliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const rowId = `${useId()}-slides`;
  const rowRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  /* The current step's fill: the one element that reads --slider-step-progress (the clock below). */
  const fillRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<Position>({
    ready: false,
    atStart: true,
    atEnd: false,
    active: 0,
  });
  /* Where the row is HEADING: set the moment an advance or a bar press starts a scroll, cleared once
     it arrives or the scroll settles. The stepper shows this rather than the scroll position, which
     only reaches the next slide at the move's midpoint: until then the old bar stayed current while
     the clock restarted, and refilled before it switched (owner, 30 Oct 2026). On an advance the old
     bar now stays empty and the next is full from the first frame of the move, and a wrap or a jump
     never lights the bars it passes. */
  const [heading, setHeading] = useState<number | null>(null);
  /* The rotation. `choice` is the reader's own press on the rotation control, and wins; until they
     press it, the default is to rotate unless they prefer reduced motion. `held` is the pointer or
     focus resting inside — a pause that lifts by itself. */
  const rotates = autoplay && perView === 1 && count > 1;
  const reduced = useSyncExternalStore(subscribeMotion, prefersReduced, serverPrefersReduced);
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const playing = rotates && (choice ? choice === 'play' : !reduced);
  /* A press on a bar or a previous / next control STOPS the rotation (owner, 29 Oct 2026): the
     reader chose a slide, so it stays, and its bar stays full. */
  const stop = useCallback(() => {
    if (rotates) setChoice('pause');
  }, [rotates]);
  const held = hovered || focused;
  /* Time the current slide has been shown while running, in ms; reset whenever the slide changes. */
  const elapsed = useRef(0);
  const [tabStop, setTabStop] = useState(false);
  const [status, setStatus] = useState('');
  /* Set by a control press, cleared once the row settles and the status line is written — so the
     line speaks after the reader's own action and never on load or mid-swipe. */
  const announce = useRef(false);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    let frame = 0;
    let settle = 0;

    /* Which slides are wholly in view, 1-based. Measured from the rendered boxes rather than
       computed from perView, so it is right at every breakpoint and with the peek. */
    const inView = () => {
      const box = row.getBoundingClientRect();
      const visible: number[] = [];
      Array.from(row.children).forEach((child, index) => {
        const r = child.getBoundingClientRect();
        if (r.left >= box.left - EDGE && r.right <= box.right + EDGE) visible.push(index + 1);
      });
      return visible;
    };

    const measure = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      const x = Math.abs(row.scrollLeft); // RTL reports a negative scrollLeft
      const progress = max > EDGE ? Math.min(1, x / max) : 0;
      /* The rail's thumb moves on every frame, so it is written straight to the element rather than
         through state: a re-render per scroll frame would be work for nothing. */
      thumbRef.current?.style.setProperty('--slider-progress', String(progress));
      const atStart = x <= EDGE;
      const atEnd = x >= max - EDGE;
      /* The slide whose start edge is nearest the row's — the stepper's current step. */
      const [a, b] = Array.from(row.children) as HTMLElement[];
      const step = a && b ? Math.abs(b.offsetLeft - a.offsetLeft) : 0;
      const active = step > 0 ? Math.min(count - 1, Math.round(x / step)) : 0;
      setPosition((p) =>
        p.ready && p.atStart === atStart && p.atEnd === atEnd && p.active === active
          ? p
          : { ready: true, atStart, atEnd, active },
      );
      /* Arrived: the scroll position has caught up with where the row was heading. */
      setHeading((h) => (h === active ? null : h));
    };

    const speak = () => {
      settle = 0;
      setHeading(null); // the scroll has settled wherever it is; the position is the truth again
      if (!announce.current) return;
      announce.current = false;
      const visible = inView();
      const first = visible[0];
      const last = visible[visible.length - 1];
      if (first == null || last == null) return;
      setStatus(
        first === last
          ? `Slide ${first} of ${count}`
          : `Slides ${first} to ${last} of ${count}`,
      );
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
      /* `scrollend` is not in every engine yet; a quiet period after the last scroll event is the
         fallback, and whichever fires first speaks (the flag makes the second a no-op). */
      window.clearTimeout(settle);
      settle = window.setTimeout(speak, 160);
    };

    /* First measurement in a frame, not synchronously: the effect only subscribes, and every
       state write happens in a callback. */
    frame = requestAnimationFrame(() => {
      measure();
      setTabStop(row.querySelector(FOCUSABLE) == null);
      if (process.env.NODE_ENV !== 'production') {
        const stray = Array.from(row.children).filter((c) => c.tagName !== 'LI');
        if (stray.length > 0) {
          console.warn(
            `Slider "${label}": every slide must render one <li> (got ${stray
              .map((c) => `<${c.tagName.toLowerCase()}>`)
              .join(', ')}). Wrap the slide in an <li> at the call site.`,
          );
        }
      }
    });

    row.addEventListener('scroll', onScroll, { passive: true });
    row.addEventListener('scrollend', speak);
    const resize = new ResizeObserver(onScroll);
    resize.observe(row);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      row.removeEventListener('scroll', onScroll);
      row.removeEventListener('scrollend', speak);
      resize.disconnect();
    };
  }, [count, label]);

  /* The bleed: the slider's end edge to the viewport's, written on the root. Measured on mount and
     whenever either box changes size. The ROOT element, because past the 1240 cap the column does
     not change width while the margin grows, so the row's own observer would not fire. The SLIDER,
     for a layout shift that moves or narrows the column without resizing the window. A window
     `resize` listener missed both a classic scrollbar appearing after mount (the root's box
     narrows by its width, the window does not resize) and any shift, and left the bleed stale by
     a scrollbar's width, a sideways page scroll on Windows (cmp-services fix round 2). Writing the
     property changes neither box — the bleed is the inner row's margin and padding — so the
     observer cannot feed itself. */
  useEffect(() => {
    const root = rootRef.current;
    if (!bleed || !root) return;
    let frame = 0;
    const write = () => {
      frame = 0;
      const box = root.getBoundingClientRect();
      const rtl = getComputedStyle(root).direction === 'rtl';
      const end = rtl ? box.left : document.documentElement.clientWidth - box.right;
      root.style.setProperty('--slider-bleed', `${Math.max(0, Math.floor(end))}px`);
    };
    const onResize = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };
    frame = requestAnimationFrame(write);
    const observer = new ResizeObserver(onResize);
    observer.observe(document.documentElement);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [bleed]);

  /* One slide per press: the distance between two neighbouring slides' start edges, which is one
     track plus the seam at whatever width this is. Mandatory snapping lands it exactly. No
     `behavior`: the row's own computed scroll-behavior decides, which is smooth only when the
     reader has not asked for reduced motion (Layout.module.css). */
  const go = useCallback((direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    const [a, b] = Array.from(row.children) as HTMLElement[];
    const step = a && b ? Math.abs(b.offsetLeft - a.offsetLeft) : row.clientWidth;
    const rtl = getComputedStyle(row).direction === 'rtl' ? -1 : 1;
    announce.current = true;
    row.scrollBy({ left: direction * step * rtl });
  }, []);

  /* The scroll that shows slide `index`: its start edge less the first slide's, exact at every width,
     and snapping agrees. False when the row is already there, so nothing scrolls. */
  const scrollToSlide = useCallback((index: number) => {
    const row = rowRef.current;
    const target = row?.children[index] as HTMLElement | undefined;
    const first = row?.children[0] as HTMLElement | undefined;
    if (!row || !target || !first) return false;
    const left = Math.abs(target.offsetLeft - first.offsetLeft);
    if (Math.abs(Math.abs(row.scrollLeft) - left) <= EDGE) return false;
    const rtl = getComputedStyle(row).direction === 'rtl' ? -1 : 1;
    row.scrollTo({ left: left * rtl });
    return true;
  }, []);

  /* A step pressed: straight to that slide, its bar current from the press. */
  const goTo = useCallback(
    (index: number) => {
      announce.current = true;
      if (scrollToSlide(index)) setHeading(index);
    },
    [scrollToSlide],
  );

  /* The rotation's own advance from slide `from`: one on, or from the last back to the first. Silent:
     it sets no announcement, because nothing the reader did caused it. Always heads, so the clock
     (keyed on the current slide) always restarts. */
  const advance = useCallback(
    (from: number) => {
      const next = from + 1 < count ? from + 1 : 0;
      scrollToSlide(next);
      setHeading(next);
    },
    [count, scrollToSlide],
  );

  if (autoplay && perView !== 1 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `Slider "${label}": autoplay is one per view only; ignoring it at perView ${perView}.`,
    );
  }

  const { ready, atStart, atEnd, active } = position;
  /* The stepper's current slide: where the row is heading, else where it is. */
  const current = heading ?? active;

  /* The hold: a mouse resting on the SLIDES, or focus inside them — the thing being read. Not the
     control row: a press on Play would otherwise hold the rotation it had just started, under the
     very pointer and focus that pressed it. Touch is left out, because a tap's pointerenter has no
     matching leave. */
  useEffect(() => {
    const row = rowRef.current;
    if (!row || !rotates) return;
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHovered(true);
    };
    const leave = () => setHovered(false);
    const focusIn = () => setFocused(true);
    const focusOut = (event: FocusEvent) => {
      if (!row.contains(event.relatedTarget as Node | null)) setFocused(false);
    };
    row.addEventListener('pointerenter', enter);
    row.addEventListener('pointerleave', leave);
    row.addEventListener('focusin', focusIn);
    row.addEventListener('focusout', focusOut);
    return () => {
      row.removeEventListener('pointerenter', enter);
      row.removeEventListener('pointerleave', leave);
      row.removeEventListener('focusin', focusIn);
      row.removeEventListener('focusout', focusOut);
    };
  }, [rotates]);

  /* A new current slide starts its hold full, before paint. */
  useLayoutEffect(() => {
    elapsed.current = 0;
    fillRef.current?.style.setProperty('--slider-step-progress', '0');
  }, [current]);

  /* The clock: frames, not a timer, so a hold is exact across a pause and the step's fill is the
     clock itself rather than an animation that has to be kept in step with one. It runs only while
     rotating, hydrated, and not held; a pause stops the frames and keeps `elapsed`, so the fill
     resumes where it froze. The fill is written straight onto the current step's fill, the only
     element that reads it: written on the root, every frame restyled the whole slider (126 elements
     on /case-studies, 17 Nov 2026: ~700 ms of a 16 s load at 4× CPU), for a value one bar uses. */
  useEffect(() => {
    if (!playing || !ready || held) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += Math.min(MAX_FRAME, Math.max(0, now - last));
      last = now;
      const progress = Math.min(1, elapsed.current / interval);
      fillRef.current?.style.setProperty('--slider-step-progress', String(progress));
      if (progress >= 1) {
        /* Empty: hand over and stop. The bar stays empty until `current` moves, which resets the hold
           and restarts this clock, so no frame counts on while the old bar is still current. */
        advance(current);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, ready, held, interval, advance, current]);
  const control = (direction: 1 | -1) => {
    const blocked = direction === -1 ? atStart : atEnd;
    return (
      <Button
        emphasis="outline"
        /* lg: a 48 circle with a 24 arrow (fix round 2, 6 Oct 2026). At 40 with a 16 glyph the
           steppers read as an afterthought beside a 477 portrait or a row of 392 cards. */
        size="lg"
        iconOnly
        icon={<Icon name={direction === -1 ? 'arrow-left' : 'arrow-right'} />}
        extendHitArea
        aria-label={direction === -1 ? 'Previous slide' : 'Next slide'}
        aria-controls={rowId}
        /* Native `disabled` only before hydration, when the button genuinely cannot act. After it,
           an end is `aria-disabled`, which keeps focus where the reader left it; Button withholds
           the click and keeps the ring. */
        disabled={!ready}
        aria-disabled={ready && blocked ? true : undefined}
        onClick={() => {
          stop();
          go(direction);
        }}
        className={styles.control}
      />
    );
  };

  const rail = (
    <span className={styles.rail} aria-hidden="true">
      <span ref={thumbRef} className={styles.thumb} />
    </span>
  );

  /* The rotation control: what pressing it will do, as its name and its glyph. Disabled until
     hydration like the steppers. */
  const rotation = (
    <Button
      emphasis="outline"
      size="lg"
      iconOnly
      icon={<Icon name={playing ? 'chrome-pause' : 'chrome-play'} />}
      extendHitArea
      aria-label={playing ? 'Pause slides' : 'Play slides'}
      aria-controls={rowId}
      disabled={!ready}
      onClick={() => setChoice(playing ? 'pause' : 'play')}
      className={styles.control}
    />
  );

  /* The stepper: one plain bar per slide, the current one counting down its hold. Each bar's name is
     the slide's place in the set; a list, so a screen reader hears how many there are.

     WCAG 2.2.2 (Pause, Stop, Hide) without a rotation button, for the centred row: pressing any bar
     STOPS the rotation on that slide (owner, 29 Oct 2026); a bar under keyboard focus, like the
     slides under a mouse or focus, HOLDS it for as long as it stays.
     A mouse press also focuses the bar in some browsers, so only :focus-visible counts as a hold
     here — otherwise a clicked bar would hold the rotation until the reader clicked elsewhere. So
     every reader who can reach the content has a way to stop it, at the control they would use
     anyway, and nothing rotates at all under prefers-reduced-motion. A 48 pause circle in the
     middle of a centred quote would be the loudest thing in the band, for a job the bars already do. */
  const steps = (
    <Cluster as="ol" colGap="tight" nowrap className={styles.steps}>
      {slides.map((_, index) => (
        <li key={index}>
          <button
            type="button"
            className={styles.step}
            aria-label={`Show ${slideName} ${index + 1} of ${count}`}
            aria-current={index === current ? 'true' : undefined}
            aria-controls={rowId}
            disabled={!ready}
            onFocus={(event) => {
              if (event.currentTarget.matches(':focus-visible')) setFocused(true);
            }}
            onBlur={() => setFocused(false)}
            onClick={() => {
              stop();
              goTo(index);
            }}
          >
            <span className={styles.stepLine} aria-hidden="true">
              <span className={styles.stepFill} ref={index === current ? fillRef : undefined} />
            </span>
          </button>
        </li>
      ))}
    </Cluster>
  );

  /* With rotation the stepper takes the rail's place; under `start` the rotation control at its head. */
  const progressMark = rotates ? (
    align === 'center' ? (
      steps
    ) : (
      <Cluster colGap="block" align="center" nowrap className={styles.progress}>
        {rotation}
        {steps}
      </Cluster>
    )
  ) : (
    rail
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      ref={rootRef}
      className={cx(
        styles.slider,
        VIEW_CLASS[perView],
        bleed && styles.bleed,
        playing && styles.playing,
      )}
      style={{ '--slider-count': count } as CSSProperties}
    >
      {/* Row to controls is `stack` (48), block to block (cmp-services fix round 1): at `block` (24)
          the controls sat ~30 under the cards' last line, cramped against the band's 96 and read
          as part of the last card rather than as the row's own control strip. */}
      <Layout rowGap="stack">
        <Layout
          as="ul"
          id={rowId}
          ref={rowRef}
          scroll="always"
          columns={LADDER[perView]}
          peek={perView === 1 ? false : peek ? 'always' : true}
          colGap="gutter"
          align={slideAlign}
          tabIndex={tabStop ? 0 : undefined}
          className={styles.row}
        >
          {slides}
        </Layout>
        {align === 'center' && rotates ? (
          <Cluster justify="center">{progressMark}</Cluster>
        ) : align === 'center' ? (
          <Cluster colGap="block" align="center" justify="center" nowrap>
            {control(-1)}
            {progressMark}
            {control(1)}
          </Cluster>
        ) : (
          <Cluster colGap="block" align="center" justify="between" nowrap>
            {progressMark}
            <Cluster colGap="text" align="center" nowrap>
              {control(-1)}
              {control(1)}
            </Cluster>
          </Cluster>
        )}
      </Layout>
      {/* Out of flow (position: absolute), so it takes no row and no seam in the Layout above. */}
      <p className={styles.status} aria-live="polite" aria-atomic="true">
        {status}
      </p>
    </section>
  );
}
