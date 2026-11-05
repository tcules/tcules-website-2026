'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, PointerEvent } from 'react';

import { Button, Cluster, Icon, Layout, Logo, Section } from '@/components';
import { cx } from '@/lib/cx';
import { ROUTES } from '@/lib/routes';

import styles from './SiteNav.module.css';
import type { SiteNavItem, SiteNavLink, SiteNavProps } from './types';

/**
 * SiteNav — the site header: a sticky bar, one morphing PLATE for the three menu sections above
 * 1024, and a two-level SHEET below it.
 *
 * ── Route-aware, and it has to be ───────────────────────────────────────────────────────────────
 * Patterns in this repo are data-blind and take what they render as props, which this one does —
 * the whole IA arrives as `items`, `cta` and `ctaSecondary`. It is not route-BLIND, and cannot be:
 * an item's current state is a fact about the URL, and `usePathname` is the only way to read it.
 * That is the one thing this pattern knows that a pattern normally would not, and it is why it
 * imports `@/lib/routes` for the single destination that is structural rather than editorial — the
 * home link on the wordmark. Every other href comes from props.
 *
 * ── One plate, not three panels ─────────────────────────────────────────────────────────────────
 * The three sections are panes of ONE box whose width and height morph between them, so switching
 * reads as the same container changing its mind rather than three panels blinking in and out. That
 * has three consequences worth knowing before changing anything here:
 *
 * 1. **The panes are positioned by ARITHMETIC, not by imperative animation.** Each pane carries
 *    `--nav-pane-shift`, its index minus the open pane's, and translates by that many hundred
 *    percent. Change the open key and every pane's shift changes with it; CSS transitions the rest.
 *    The prototype did this with `transition: none` / force-reflow / restore, which cannot be
 *    expressed in a render function and does not survive a switch mid-animation. This does both:
 *    the direction falls out of item order for free, and a retarget is just another number.
 *
 * 2. **The plate's height is measured.** It is content-derived and it animates, and CSS cannot
 *    transition to `auto` in the browsers this repo supports. A ResizeObserver writes each pane's
 *    height into state and the open one becomes `--nav-plate-block`. Same escape `Layout` uses for
 *    `--tmpl-*`, and the property is declared with a fallback in the stylesheet so tokens:check
 *    sees a definition rather than an unresolved var().
 *
 * 3. **Tab-into-panel is managed rather than structural.** One box shared by three triggers cannot
 *    live inside any trigger's `<li>`, so DOM order cannot supply "the panel comes next". Three
 *    handlers do it explicitly — see `onTriggerKeyDown` and `onPaneKeyDown`. Inactive panes are
 *    `inert`, so they hold no focus and take no pointer whatever the DOM order says.
 *
 * `lastPlate` is what makes the close a clean fade: on close the stage loses its visibility while
 * the panes keep the geometry they had, so the plate does not resize and re-slide on its way out.
 * The same argument gives `lastSection` its job on mobile.
 */

/** Hover intent before a mega opens. Long enough that a sweep across the bar opens nothing. */
const HOVER_INTENT_MS = 100;

/**
 * Rows past this one all enter together.
 *
 * A cap rather than a duration, so it lives here rather than in the token layer: it is a rule
 * about how long a LIST may keep staggering, and at twelve rows an uncapped 40ms stagger makes the
 * last row arrive half a second after the first, which reads as the pane being slow.
 */
const STAGGER_CAP = 10;

/** Everything the browser will put a Tab stop on, inside a pane. */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* ── Swipe to dismiss ──────────────────────────────────────────────────────────
   Mirrors --nav-sheet-dismiss-* and --nav-drag-slop in nav.css. They live there because they are
   this component's geometry and that file is where its literals are argued; they are duplicated
   here because a pointer handler cannot read a custom property without a getComputedStyle per
   frame, which is a worse trade than two numbers that have to agree. If you change one, change
   both — the token carries the reasoning. */
const DRAG_SLOP = 8;
const DISMISS_DISTANCE = 56;
const DISMISS_VELOCITY = 0.4;
const DISMISS_FLICK_DISTANCE = 24;

type NavState = {
  /** The path this state was set on. See the note in the component. */
  path: string;
  /** Which plate section is open, by item key. One at a time. */
  plate: string | null;
  /** The last section the plate was opened at. Never returns to null — see the header. */
  lastPlate: string | null;
  /**
   * Is this a SWITCH between two open sections, or an open from closed?
   *
   * It gates the plate's size transition and the panes' slide, and it has to be state rather than
   * a derivation because the answer is about the PREVIOUS render: §4 says the plate arrives at the
   * section's final size and that opening is a fade, not a slide. With the transition always on,
   * the first open animates the height up from zero, which reads as a drawer rolling down — the
   * one thing the plate is not. The prototype solved this by killing the transition, setting the
   * size and restoring it across a forced reflow; this is the same decision made a frame earlier,
   * where a render function can express it.
   */
  morph: boolean;
  /** Whether the mobile sheet is open. */
  sheet: boolean;
  /** Which section the sheet has drilled into. */
  section: string | null;
  /** The last section the sheet showed, so it can slide back out rather than vanish. */
  lastSection: string | null;
};

const closed = (path: string, keep?: NavState): NavState => ({
  path,
  plate: null,
  lastPlate: keep?.lastPlate ?? null,
  morph: false,
  sheet: false,
  section: null,
  lastSection: keep?.lastSection ?? null,
});

/** A menu item is one that opens the plate. */
const opens = (item: SiteNavItem) => item.form === 'mega';

/** Custom properties written from here. Cast once, as Layout does, rather than at every call. */
const vars = (record: Record<string, string | number>) => record as CSSProperties;

export function SiteNav({ items, cta, ctaSecondary, surface = 'paper' }: SiteNavProps) {
  /* `?? '/'` for the Pages-Router case the hook documents, where it can be null before the router
     initialises. Nothing here should crash because a path is not known yet. */
  const pathname = usePathname() ?? '/';

  /**
   * Open/closed state, STAMPED WITH THE PATH IT WAS SET ON.
   *
   * A route change has to close everything — click a row inside the plate and it would otherwise
   * sit over the page it just navigated to. The obvious form of that is an effect on `pathname`
   * that calls setState, and it is wrong twice over: it renders the new page with the plate still
   * open and then renders again to close it, and the React compiler's lint rule rejects it
   * outright. Carrying the path in the state instead makes "closed" DERIVED — one render, no
   * effect, and no window in which the stale plate is on screen.
   */
  const [state, setState] = useState<NavState>(() => closed(pathname));

  /* If the state was set on a different path, it is stale and everything is shut. The two `last`
     fields survive, because they carry geometry rather than openness. */
  const open = state.path === pathname ? state : closed(pathname, state);
  const { plate: plateKey, lastPlate, morph, sheet: sheetOpen, section, lastSection } = open;

  /* Every writer goes through this, so no caller can set a field and forget to re-stamp the path —
     which would make the next navigation fail to close anything. */
  const setNav = useCallback(
    (patch: Partial<Omit<NavState, 'path'>>) => {
      setState((current) => {
        const base = current.path === pathname ? current : closed(pathname, current);
        const next = { ...base, ...patch, path: pathname };
        return {
          ...next,
          lastPlate: next.plate ?? base.lastPlate,
          lastSection: next.section ?? base.lastSection,
          /* A switch is an open that had something open before it. Closing keeps the flag as it
             was, so the plate fades out at the geometry it already had rather than snapping. */
          morph: next.plate === null ? base.morph : base.plate !== null,
        };
      });
    },
    [pathname],
  );

  const headerRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const grabRef = useRef<HTMLSpanElement>(null);
  const rootListRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const sectionBodyRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  /**
   * The gesture in progress. `claimed` flips once the pointer has travelled past the slop, which is
   * the moment the sheet takes the gesture over — before that it is still possibly a tap.
   */
  const gesture = useRef<{
    id: number;
    startY: number;
    lastY: number;
    lastT: number;
    velocity: number;
    claimed: boolean;
  } | null>(null);

  /* React-generated, so two SiteNavs on one page (the proving ground renders four) cannot collide
     on the ids that wire aria-controls to their panes. */
  const uid = useId();
  const triggerId = (key: string) => `${uid}-trigger-${key}`;
  const paneId = (key: string) => `${uid}-pane-${key}`;
  const sheetId = `${uid}-sheet`;
  const toggleId = `${uid}-toggle`;

  const menuItems = items.filter(opens);

  /* ── Measured geometry ────────────────────────────────────────────────────────
     Two heights animate and neither can be written in CSS: the plate's is the open pane's
     content, the sheet's is its root list plus its two fixed rows. Both are observed rather
     than measured once, because a web font landing after first paint changes both. */
  const [paneBlocks, setPaneBlocks] = useState<Record<string, number>>({});
  const [sheetBlock, setSheetBlock] = useState<number | null>(null);
  const [sectionBlocks, setSectionBlocks] = useState<Record<string, number>>({});
  /** How far the sheet is currently pulled down, in px. 0 unless a finger is on it. */
  const [drag, setDrag] = useState(0);

  /* The pane the plate is currently SHAPED to. `lastPlate` rather than `plate`, so a close is a
     fade at the size it already had rather than a resize on the way out. */
  const shownItem = menuItems.find((item) => item.key === (plateKey ?? lastPlate));
  const shownIndex = shownItem ? menuItems.indexOf(shownItem) : 0;
  const shownBlock = (shownItem && paneBlocks[shownItem.key]) || 0;

  /**
   * Open only once the plate knows how tall it is.
   *
   * The panes are measured on mount, so in practice this is true by the time anyone reaches the
   * bar. It is a guard against the one frame where it is not: with no measurement the plate is two
   * hairlines tall, `overflow: hidden` clips every pane to nothing, and what appears under the bar
   * is a 2px line that then snaps open. A frame of nothing is better than a frame of wrong.
   */
  const plateOpen = plateKey !== null && shownBlock > 0;

  /* The open section's hugging height, or null before it has been measured. */
  const sectionHug = (lastSection && sectionBlocks[lastSection]) || null;

  useEffect(() => {
    const panes = plateRef.current?.querySelectorAll<HTMLElement>('[data-pane]');
    if (!panes?.length) return;

    const observer = new ResizeObserver((entries) => {
      /* MEASURED HERE, not inside the updater below. A state updater may be replayed, and it runs
         at a moment React chooses rather than the one the observer fired at — so reading layout
         inside it records whatever the DOM happened to say then. Reading in the callback body ties
         each number to the resize that produced it.

         The border box, because the plate has to fit the pane's whole box; `borderBoxSize` is what
         the observer already computed, so preferring it over offsetHeight also avoids forcing a
         second layout per entry. */
      const measured = new Map<string, number>();
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const key = element.dataset.pane;
        const block = Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? element.offsetHeight);
        if (key && block > 0) measured.set(key, block);
      }
      if (measured.size === 0) return;

      setPaneBlocks((current) => {
        let next = current;
        for (const [key, block] of measured) {
          if (current[key] === block) continue;
          next = next === current ? { ...current } : next;
          next[key] = block;
        }
        return next;
      });
    });

    panes.forEach((pane) => observer.observe(pane));
    return () => observer.disconnect();
  }, []);

  /* The sheet hugs its root list, so its closed-to-open height is the sum of three boxes it
     already renders. Measuring the three beats measuring the sheet: the sheet's own height is what
     we are computing, so reading it back is circular. */
  useEffect(() => {
    const parts = [grabRef.current, rootListRef.current, footRef.current];
    if (parts.some((part) => part === null)) return;

    const measure = () => {
      const block = parts.reduce((total, part) => total + (part?.offsetHeight ?? 0), 0);
      if (block > 0) setSheetBlock(block);
    };

    measure();
    const observer = new ResizeObserver(measure);
    parts.forEach((part) => part && observer.observe(part));
    return () => observer.disconnect();
  }, []);

  /**
   * And the same sum again for a SECTION, which hugs too.
   *
   * The sheet's own idiom is to hug: the root level already does. A section pane that forced itself
   * to the full height was the last place in this component where a surface was taller than what
   * was in it — Insights sat 67px short of its own bottom edge — and it needed no special case to
   * fix, only the same `min(hug, full)` the root uses. Services and Expertise overrun the cap and
   * behave exactly as before.
   *
   * Keyed on the open section rather than mounted once: the body remounts per section, so both the
   * element to measure and the number to store change together.
   */
  useEffect(() => {
    const key = lastSection;
    const body = sectionBodyRef.current;
    const parts = [grabRef.current, headRef.current, footRef.current];
    if (!key || !body || parts.some((part) => part === null)) return;

    const measure = () => {
      const block =
        parts.reduce((total, part) => total + (part?.offsetHeight ?? 0), 0) + body.offsetHeight;
      if (block <= 0) return;
      setSectionBlocks((current) =>
        current[key] === block ? current : { ...current, [key]: block },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(body);
    return () => observer.disconnect();
  }, [lastSection]);

  /* ── Closing ──────────────────────────────────────────────────────────────── */
  const closePlate = useCallback(() => setNav({ plate: null }), [setNav]);

  const clearIntent = () => {
    if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };

  /* Escape and outside-pointerdown. Bound only while something is open, so a page with a closed
     header carries no document listeners at all. Escape hands focus back to the control that
     opened the thing being dismissed — a keyboard user who dismisses a panel and lands at the top
     of the document has been moved, not helped, and the sheet case needs stating separately
     because closing it removes the element focus was inside. */
  useEffect(() => {
    if (plateKey === null && !sheetOpen) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const returnTo = document.getElementById(
        plateKey === null ? toggleId : triggerId(plateKey),
      );
      setNav({ plate: null, sheet: false, section: null });
      returnTo?.focus();
    };

    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setNav({ plate: null, sheet: false, section: null });
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
    /* triggerId and toggleId are derived from `uid`, which is stable for the component's lifetime,
       so listing `uid` covers both. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plateKey, sheetOpen, setNav, uid]);

  /* Focus leaving the header closes the plate — a Tab out of the last row should not leave it
     hanging open behind the page. The sheet deliberately does NOT close on this: it is a surface a
     touch user opened on purpose, and it stays until they dismiss it. */
  const onHeaderBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closePlate();
  };

  /* ── Pointer ──────────────────────────────────────────────────────────────────
     Gated to a mouse. On touch, `pointerenter` fires on tap — so an ungated handler would open a
     pane and then the click would immediately toggle it shut.

     A DIRECT LINK DOES NOTHING HERE, and that is the fix this revision exists for. Sweeping from
     Services to Insights crosses Work, and the old behaviour read that as "leave a menu, enter a
     non-menu" and closed — so one gesture fired open, close, open. Only leaving the whole header
     closes now. */
  const onItemPointerEnter = (event: PointerEvent<HTMLLIElement>, item: SiteNavItem) => {
    if (event.pointerType !== 'mouse' || !opens(item)) return;
    clearIntent();
    hoverTimer.current = window.setTimeout(() => setNav({ plate: item.key }), HOVER_INTENT_MS);
  };

  const onHeaderPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    clearIntent();
    closePlate();
  };

  /* ── Swipe the sheet away ─────────────────────────────────────────────────────
     A bottom sheet with a grab handle promises a gesture, and until now the handle was decoration.
     Swiping down dismisses the whole thing — sheet and section together — rather than stepping back
     a level: the gesture means "put this away", and Back already means "up one".

     WHERE A DRAG MAY START is the whole design of this. The handle and the header always, because
     they carry `touch-action: none` and are what the affordance points at. The list as well, but
     only when it is already scrolled to the top and only downward — otherwise a swipe meant to
     scroll would throw the sheet off the screen. Anything else, and any upward move, is left alone.

     A drag is not CLAIMED until the pointer has passed the slop. Under it the gesture is still a
     tap and a link still navigates; over it the sheet takes the pointer, and the click that would
     otherwise follow on release is swallowed in `onSheetClickCapture` — without that, flicking the
     sheet away from a row would dismiss it and then navigate to that row. */
  /* Armed the instant a drag is claimed and consumed by the first click after it, so a flick that
     starts on a row dismisses the sheet without also following that row's link. */
  const swallowClick = useRef(false);

  const scrollerAtTop = (target: EventTarget | null) => {
    const scroller = (target as HTMLElement | null)?.closest<HTMLElement>(
      `.${styles.sheetInner}, .${styles.sheetPaneRoot}`,
    );
    return scroller ? scroller.scrollTop <= 0 : false;
  };

  const onSheetPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!sheetOpen || gesture.current) return;
    const target = event.target as HTMLElement | null;
    const fromHandle = Boolean(target?.closest(`.${styles.grabRail}, .${styles.sheetHead}`));
    if (!fromHandle && !scrollerAtTop(target)) return;

    gesture.current = {
      id: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastT: event.timeStamp,
      velocity: 0,
      claimed: false,
    };
  };

  const onSheetPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;

    const dy = event.clientY - current.startY;
    const dt = event.timeStamp - current.lastT;
    if (dt > 0) current.velocity = (event.clientY - current.lastY) / dt;
    current.lastY = event.clientY;
    current.lastT = event.timeStamp;

    if (!current.claimed) {
      /* Upward first means this was a scroll, not a dismissal. Let it go and do not look again. */
      if (dy < 0) {
        gesture.current = null;
        return;
      }
      if (dy < DRAG_SLOP) return;
      current.claimed = true;
      swallowClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    /* Clamped at 0: the sheet is content-sized, so there is nothing above its own top edge to
       reveal by dragging up, and letting it go negative would lift it off the viewport floor. */
    setDrag(Math.max(0, dy));
  };

  const cancelGesture = () => {
    gesture.current = null;
    swallowClick.current = false;
    setDrag(0);
  };

  const endGesture = (event: PointerEvent<HTMLDivElement>) => {
    const current = gesture.current;
    if (!current || current.id !== event.pointerId) return;
    gesture.current = null;

    if (!current.claimed) return;
    const travelled = Math.max(0, event.clientY - current.startY);
    /* A flick has to travel as well as move fast. Gated on the slop alone, a 9px twitch at speed
       dismissed the sheet — the thumb barely moved and the navigation was gone. */
    const flicked = current.velocity > DISMISS_VELOCITY && travelled > DISMISS_FLICK_DISTANCE;

    setDrag(0);
    if (travelled > DISMISS_DISTANCE || flicked) setNav({ sheet: false, section: null });
  };

  /* Capture, so it runs before the row's own handler. Only fires for a gesture that was claimed,
     and only once — `drag` is already back to 0 by then, so the flag is the gesture ref being
     consumed above plus this one-shot guard. */
  const onSheetClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!swallowClick.current) return;
    swallowClick.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  /* ── Keyboard entry into the plate ────────────────────────────────────────────
     Tab from an open trigger goes INTO its pane rather than on to the next item. Without this the
     plate is unreachable by keyboard: it is a sibling of the whole list, so native order would
     walk every remaining item and the CTA first, by which point the pane has been closed by the
     blur handler above. */
  const paneFor = (key: string) => document.getElementById(paneId(key));

  const focusablesIn = (key: string) => {
    const pane = paneFor(key);
    return pane ? [...pane.querySelectorAll<HTMLElement>(FOCUSABLE)] : [];
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>, item: SiteNavItem) => {
    if (event.key !== 'Tab' || event.shiftKey || plateKey !== item.key) return;
    const first = focusablesIn(item.key)[0];
    if (!first) return;
    event.preventDefault();
    first.focus();
  };

  const onPaneKeyDown = (event: KeyboardEvent<HTMLDivElement>, key: string) => {
    if (event.key !== 'Tab') return;
    const stops = focusablesIn(key);
    if (stops.length === 0) return;
    const active = document.activeElement;

    if (event.shiftKey && active === stops[0]) {
      event.preventDefault();
      document.getElementById(triggerId(key))?.focus();
      return;
    }

    if (!event.shiftKey && active === stops[stops.length - 1]) {
      /* Out the far side. The plate closes and focus continues from the trigger's own place in the
         bar, which is where a reader who has finished with the panel expects to be — not at the
         top of the document, and not back at the start of the bar. */
      const controls =
        headerRef.current?.querySelectorAll<HTMLElement>('[data-nav-control]') ?? [];
      const trigger = document.getElementById(triggerId(key));
      const index = [...controls].indexOf(trigger as HTMLElement);
      const next = index === -1 ? undefined : controls[index + 1];
      event.preventDefault();
      closePlate();
      next?.focus();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────────────────── */
  const sheetSection = menuItems.find((item) => item.key === (section ?? lastSection));

  return (
    <header
      ref={headerRef}
      role="banner"
      className={styles.header}
      onPointerLeave={onHeaderPointerLeave}
      onBlur={onHeaderBlur}
    >
      {/* `as="div"`, not `as="header"` — the <header> above is the landmark AND the positioning
          context the plate resolves against, and two nested headers would announce two banners.
          `flush` because the bar's height is a fixed geometry rather than one of Section's three
          vertical-air steps, all of which are taller than the whole bar. */}
      <Section as="div" surface={surface} flush className={styles.bar}>
        {/* `block`, not `gutter` — Cluster caps its scale at block on purpose, and this row is
            `justify="between"` anyway, so the step is a MINIMUM separation rather than the seam
            that positions anything. The three groups are pushed apart by the distribution. */}
        <Cluster className={styles.barRow} justify="between" colGap="block" nowrap>
          <Link
            href={ROUTES.home}
            className={styles.brand}
            aria-label="Tcules — home"
            /* Behind the scrim while the sheet is open, so it is neither a tab stop nor a second
               way out. The close glyph, the scrim and Back are the exits; a mark that also
               dismisses is a fourth answer to a question that already had three. */
            aria-hidden={sheetOpen || undefined}
            tabIndex={sheetOpen ? -1 : undefined}
          >
            {/* title="" — the link above carries the accessible name, so the mark is decorative
                and a screen reader is not made to say "Tcules" twice. variant="mono" is the
                default and is written anyway, because here it is a brand rule rather than a
                default: in UI chrome the whole wordmark is neutral-950 (ch02 v1.0). */}
            <Logo size="md" variant="mono" title="" />
          </Link>

          <Cluster as="ul" className={styles.items} colGap="inline" nowrap>
            {items.map((item) => {
              const isOpen = plateKey === item.key;
              /* No item is lit for the page you are on (owner, 4 Nov 2026: "looks weird"). The
                 open menu's trigger is the one held state; aria-current still marks Work's exact
                 page for a screen reader. */

              return (
                <li
                  key={item.key}
                  onPointerEnter={(event) => onItemPointerEnter(event, item)}
                  onPointerLeave={clearIntent}
                >
                  {opens(item) ? (
                    <Button
                      id={triggerId(item.key)}
                      data-nav-control=""
                      className={styles.itemControl}
                      emphasis="ghost"
                      tone="neutral"
                      size="sm"
                      icon={<Icon name="alt-arrow-down" />}
                      active={isOpen}
                      aria-expanded={isOpen}
                      /* aria-controls only while the pane is the open one. Pointing it at a pane
                         that is inert is a reference to something a reader cannot reach. */
                      aria-controls={isOpen ? paneId(item.key) : undefined}
                      onClick={() => {
                        clearIntent();
                        setNav({ plate: isOpen ? null : item.key });
                      }}
                      onKeyDown={(event) => onTriggerKeyDown(event, item)}
                    >
                      {item.label}
                    </Button>
                  ) : (
                    <Button
                      as={Link}
                      href={item.href}
                      data-nav-control=""
                      className={styles.itemControl}
                      emphasis="ghost"
                      tone="neutral"
                      size="sm"
                      /* aria-current only: no item is lit for the page you are on. */
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Button>
                  )}
                </li>
              );
            })}
          </Cluster>

          <Cluster colGap="tight" nowrap>
            {cta ? (
              <Button
                as={Link}
                href={cta.href}
                title={cta.description}
                {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                size="sm"
                data-nav-control=""
                className={styles.cta}
              >
                {cta.label}
              </Button>
            ) : null}
            <Button
              id={toggleId}
              className={styles.toggle}
              emphasis="ghost"
              tone="neutral"
              iconOnly
              icon={<Icon name={sheetOpen ? 'chrome-close' : 'chrome-menu'} />}
              aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sheetOpen}
              aria-controls={sheetOpen ? sheetId : undefined}
              onClick={() => setNav({ plate: null, sheet: !sheetOpen, section: null })}
            />
          </Cluster>
        </Cluster>
      </Section>

      {/* ── The plate ─────────────────────────────────────────────────────────────
          Out of flow, so the page behind it never moves. The stage carries the scrim and the
          centring; the plate is the box that morphs; the panes are its content, all three mounted
          so their heights can be measured and so a switch has something to slide. */}
      {/* The scrim is a sibling of the stage, not a child: the stage is an inline-size container,
          which makes it a containing block for fixed descendants, and a scrim positioned against an
          18px-tall box is not a scrim. It sits first so the plate paints over it on DOM order
          alone. */}
      <span
        className={styles.scrim}
        data-open={plateOpen || undefined}
        aria-hidden="true"
        onClick={closePlate}
      />
      <div
        className={styles.stage}
        data-open={plateOpen || undefined}
        data-morph={morph || undefined}
      >
        <div
          ref={plateRef}
          className={styles.plate}
          style={vars({ '--nav-plate-block': `${shownBlock}px` })}
        >
          {menuItems.map((item, index) => (
            <div
              key={item.key}
              id={paneId(item.key)}
              data-pane={item.key}
              className={styles.pane}
              /* Positioned by arithmetic — see the header. A pane two places later sits two
                 widths to the right and slides in from there when it becomes the open one. */
              style={vars({ '--nav-pane-shift': index - shownIndex })}
              /* Everything but the open pane is out of the document for focus and for the
                 pointer, which is what makes the shared box safe to leave mounted. */
              data-open={plateKey === item.key || undefined}
              inert={plateKey !== item.key}
              role="group"
              aria-labelledby={triggerId(item.key)}
              onKeyDown={(event) => onPaneKeyDown(event, item.key)}
            >
              <PlatePane item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* ── The sheet ─────────────────────────────────────────────────────────────
          Below the breakpoint. It hugs its root list and grows for a section; the height change
          IS the transition, which is why it is measured rather than left to `auto`. */}
      <span
        className={styles.sheetScrim}
        data-open={sheetOpen || undefined}
        aria-hidden="true"
        onClick={() => setNav({ sheet: false, section: null })}
      />
      <div
        id={sheetId}
        ref={sheetRef}
        className={styles.sheet}
        data-open={sheetOpen || undefined}
        data-dragging={drag > 0 || undefined}
        data-level={section ? 'section' : 'root'}
        onPointerDown={onSheetPointerDown}
        onPointerMove={onSheetPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={cancelGesture}
        onClickCapture={onSheetClickCapture}
        /* Each is emitted only once measured. The stylesheet defaults the section height to the
           full cap, so an unmeasured frame renders the old force-filled behaviour rather than a
           sheet collapsed to nothing. */
        style={vars({
          ...(sheetBlock === null ? {} : { '--nav-sheet-block': `${sheetBlock}px` }),
          ...(sectionHug === null ? {} : { '--nav-sheet-section-block': `${sectionHug}px` }),
          ...(drag === 0 ? {} : { '--nav-sheet-drag': `${drag}px` }),
        })}
        inert={!sheetOpen}
      >
        <span ref={grabRef} className={styles.grabRail}>
          <span className={styles.grab} aria-hidden="true" />
        </span>

        <div className={styles.track}>
          <div className={cx(styles.sheetPane, styles.sheetPaneRoot)} inert={section !== null}>
            <div ref={rootListRef} className={styles.sheetRootInner}>
              <Layout as="ul" rowGap="none" className={styles.sheetRows}>
                {items.map((item) => (
                  <li key={item.key} className={styles.sheetRow}>
                    {opens(item) ? (
                      /* NO aria-expanded. It would never become true: this pushes the sheet to a
                         second level and scrolls itself out of view rather than revealing a region
                         in place, so a permanent "collapsed" is a promise about a state that does
                         not exist. The chevron and the label carry it. */
                      <button
                        type="button"
                        className={styles.sheetControl}
                        onClick={() => setNav({ section: item.key })}
                      >
                        <span className={styles.sheetControlLabel}>{item.label}</span>
                        <Icon name="alt-arrow-right" className={styles.sheetChevron} />
                      </button>
                    ) : (
                      <Link
                        href={item.href ?? ROUTES.home}
                        className={styles.sheetControl}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        <span className={styles.sheetControlLabel}>{item.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </Layout>
            </div>
          </div>

          <div
            className={cx(styles.sheetPane, styles.sheetPaneSection)}
            inert={section === null}
          >
            <div ref={headRef} className={styles.sheetHead}>
              {/* A Button, not a bespoke <button>. It was hand-rolled and set a MONO role in
                  sentence case — "Menu" in Geist Mono with the tracking opened, which §8 names as
                  the failure that makes a label read as letter-spaced body text. Button takes the
                  case from --text-mono-case, so the fix is structural rather than a transform
                  bolted on, and it arrives with the focus ring and pressed state already decided.
                  `iconLeft`, because the glyph names the direction rather than the destination. */}
              <Button
                className={styles.sheetBack}
                emphasis="link"
                tone="primary"
                size="sm"
                iconLeft={<Icon name="arrow-left" />}
                onClick={() => setNav({ section: null })}
              >
                Menu
              </Button>
              <span className={styles.sheetTitle}>{sheetSection?.label}</span>
            </div>
            {/* The scroll container is stable so its ref survives a section change; the BODY is
                keyed, so the row entrance replays for each section rather than running once for
                whichever opened first. The list's padding lives on the body rather than the
                scroller, which is what lets the hug height be four offsetHeights and no computed
                styles. */}
            <div className={styles.sheetInner}>
              <div ref={sectionBodyRef} key={sheetSection?.key} className={styles.sheetBody}>
                {sheetSection ? <SheetPane item={sheetSection} /> : null}
              </div>
            </div>
          </div>
        </div>

        <div ref={footRef} className={styles.sheetFoot}>
          {/* One offer fills the foot; a lighter way in, where one is passed, sits beside it on the
              left so the primary stays under the right thumb. */}
          <Layout columns={{ base: ctaSecondary ? 2 : 1 }} colGap="tight">
            {/* extendHitArea rather than size="lg": at 48 the pair would push the sheet's hugging
                height past the screen's midpoint, which is the one measurement direction F exists
                to hold. The 44px hit box sits inside the foot's own padding, so it cannot reach
                into the list above it. */}
            {ctaSecondary ? (
              <Button
                as={Link}
                href={ctaSecondary.href}
                title={ctaSecondary.description}
                {...(ctaSecondary.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                emphasis="ghost"
                tone="neutral"
                extendHitArea
              >
                {ctaSecondary.label}
              </Button>
            ) : null}
            {cta ? (
              <Button
                as={Link}
                href={cta.href}
                title={cta.description}
                {...(cta.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                extendHitArea
              >
                {cta.label}
              </Button>
            ) : null}
          </Layout>
        </div>
      </div>
    </header>
  );
}

/**
 * One section of the plate: its groups as an index of equal columns, and the aside at the plate's
 * right edge where the section has one (owner, 4 Nov 2026, header round 3 — "index + aside").
 *
 * The aside is a SPLIT, not a third column: a different kind of region (the way onward) on its own
 * deeper ground, full height, so the pane has no padding of its own and each half pads itself. Its
 * width is a ratio rather than a track, because Layout has no fixed-track mode: [10, 3] of the
 * 1240 plate puts it at 286, the 288 the mock was approved at.
 *
 * The hub closes the aside, pinned to its foot, so "All services" sits on the plate's bottom edge
 * however long the index beside it runs. A section with a hub and no aside would carry it under its
 * groups; none does today.
 */
function PlatePane({ item }: { item: SiteNavItem }) {
  const groups = item.groups ?? [];
  const hub = item.hub ? (
    /* A Cluster of one, so the control stays content-sized — a bare grid child stretches to its
       track, and a full-width link emphasis reads as a rule rather than as a link. */
    <Cluster>
      <Button
        as={Link}
        href={item.hub.href}
        title={item.hub.description}
        {...(item.hub.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        emphasis="link"
        tone="primary"
        size="sm"
        icon={<Icon name="arrow-right" />}
      >
        {item.hub.label}
      </Button>
    </Cluster>
  ) : null;

  const index = (
    <Layout columns={Math.max(groups.length, 1)} colGap="gutter" className={styles.index}>
      {groups.map((group) => (
        <PlateGroup key={group.label} label={group.label} links={group.links} />
      ))}
    </Layout>
  );

  if (!item.aside) {
    if (!hub) return index;
    return (
      <Layout rowGap="none">
        {index}
        <div className={styles.hubBar}>{hub}</div>
      </Layout>
    );
  }

  return (
    <Layout columns={[10, 3]} colGap="none">
      {index}
      <Layout as="aside" rowGap="stack" pinLast={hub !== null} className={styles.aside}>
        <PlateGroup label={item.aside.label} links={item.aside.links} />
        {hub}
      </Layout>
    </Layout>
  );
}

/**
 * A group: its mono label over its links.
 *
 * The row seam is a consequence of what the rows carry (owner, 4 Nov 2026): a list of plain names
 * is separated by `block` (24); a list whose links carry a description by `gutter` (32), so each
 * label and its line read as one item rather than as two lines of one list.
 */
function PlateGroup({ label, links }: { label?: string; links: readonly SiteNavLink[] }) {
  const described = links.some((link) => link.description);

  return (
    <Layout rowGap="text">
      {label ? <p className={styles.groupLabel}>{label}</p> : null}
      <Layout as="ul" rowGap={described ? 'gutter' : 'block'}>
        {links.map((link) => (
          <li key={link.label}>
            <PlateRow link={link} />
          </li>
        ))}
      </Layout>
    </Layout>
  );
}

/**
 * A row: the label, its arrow, and the description under it where there is one.
 *
 * Hover is a move, not a ground (decisions 2026-10-19-hover-is-a-move, -no-hover-only-grounds): the
 * label takes the blue and the arrow slides in from -4px. No fill, so the label sits on its
 * column's edge with nothing pulled back out to make room for one.
 */
function PlateRow({ link }: { link: SiteNavLink }) {
  return (
    <Link
      href={link.href}
      className={styles.row}
      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={styles.rowHead}>
        <span className={styles.rowLabel}>{link.label}</span>
        {link.external ? (
          <Icon
            name="arrow-right-up"
            label="opens in a new tab"
            className={styles.rowExternal}
          />
        ) : null}
        <Icon name="arrow-right" className={styles.rowArrow} />
      </span>
      {link.description ? (
        <span className={styles.rowDescription}>{link.description}</span>
      ) : null}
    </Link>
  );
}

/**
 * One section inside the sheet. The same groups, as type only.
 *
 * The hub link is here, at the end of the scrolling list, exactly as it is at the foot of the
 * plate. The audit card is not: the sticky foot already carries that offer, and the same offer
 * twice in one pane is one offer too many. Those were one bullet in the spec and they are two
 * different decisions — the card duplicates something, the hub link duplicates nothing.
 *
 * Rows carry no glyphs — the settled direction dropped them, and a glyph nobody drew is a
 * placeholder shipped.
 */
function SheetPane({ item }: { item: SiteNavItem }) {
  /* The aside's links follow the groups as one more group, under its label where it has one —
     the sheet has no second ground to put a way onward on. Labels only, no descriptions: a phone
     list is a list of destinations. */
  const groups = [
    ...(item.groups ?? []),
    ...(item.aside ? [{ label: item.aside.label ?? '', links: item.aside.links }] : []),
  ];
  let position = 0;

  return (
    <Layout rowGap="block">
      {groups.map((group, groupIndex) => (
        <Layout key={group.label || groupIndex} rowGap="tight" className={styles.sheetGroup}>
          {group.label ? (
            <p
              className={cx(styles.sheetLabel, styles.stagger)}
              style={vars({ '--i': Math.min(position++, STAGGER_CAP) })}
            >
              {group.label}
            </p>
          ) : null}
          <Layout as="ul" rowGap="none">
            {group.links.map((link) => (
              <li
                key={link.label}
                className={styles.stagger}
                style={vars({ '--i': Math.min(position++, STAGGER_CAP) })}
              >
                <Link
                  href={link.href}
                  className={styles.sheetLink}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </Layout>
        </Layout>
      ))}

      {/* Inside the scrolling list rather than pinned beside the two actions in the foot. It is a
          way through, not an offer, and the foot is where the offers live — parking it there would
          make three actions compete in the one strip a thumb can reach. Last in the stagger, so it
          arrives after the rows it is the end of. */}
      {item.hub ? (
        <Cluster
          className={cx(styles.hubBar, styles.stagger)}
          style={vars({ '--i': Math.min(position++, STAGGER_CAP) })}
        >
          <Button
            as={Link}
            href={item.hub.href}
            title={item.hub.description}
            {...(item.hub.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            emphasis="link"
            tone="neutral"
            size="sm"
            icon={<Icon name="arrow-right" />}
          >
            {item.hub.label}
          </Button>
        </Cluster>
      ) : null}
    </Layout>
  );
}
