'use client';

import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Icon, Layout } from '@/components';

import styles from './TableOfContents.module.css';

/**
 * One entry in the outline: the short marker an editor authored for it, and the fragment it points
 * at. `href` is a template-literal type, so a page path is a compile error at the call site: every
 * target is an id on a heading the page has already rendered.
 *
 * The label is a MARKER, not the heading (owner, 26 Oct 2026): two or three words naming the
 * section, authored as `navigationLabel`, so the outline reads as one short line per entry. A longer
 * label wraps to a new line; it is never cut (owner, 29 Oct 2026).
 */
export type TocItem = { label: string; href: `#${string}` };

/**
 * One prop, closed on purpose: no `surface` (it reads data-surface from the Section it sits in), no
 * `className` or `style` (the token layer and the primitives own those), no `activeId` (the mark
 * comes from where the page is scrolled, never from a caller).
 */
export type TableOfContentsProps = {
  items: readonly TocItem[];
};

const hasLabel = (item: TocItem) => item.label.trim().length > 0;

/** Layout's `lg` breakpoint: the shell's second track appears and the bar becomes the rail. */
const RAIL_MEDIA = '(min-width: 1024px)';

/** How far down the viewport the reading line sits — IndexRail's line, so both rails agree. */
const READING_LINE = 0.3;

/** One line of h6 in the rail's label column. A marker past this is a heading, not a marker. */
const LABEL_MAX = 26;

const warn = (message: string) => {
  if (process.env.NODE_ENV !== 'production') console.warn(`TableOfContents: ${message}`);
};

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function TableOfContents({ items }: TableOfContentsProps) {
  const titleId = useId();
  const listId = useId();
  const railRef = useRef<HTMLElement | null>(null);
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [marker, setMarker] = useState<{ offset: number; size: number } | null>(null);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);

  const outline = items.filter(hasLabel);
  /* A string key, so a page that maps its sections inline (a new array every render) does not tear
     the listeners down on every parent render. */
  const fragments = outline.map((item) => item.href).join(' ');

  /* The content warnings, once per outline rather than on every render — the mark re-renders this
     component as the page scrolls. Keyed on the labels, so a page that maps inline does not repeat. */
  const labels = JSON.stringify(items.map((i) => i.label));
  useEffect(() => {
    const all: string[] = JSON.parse(labels);
    const named = all.filter((label) => label.trim().length > 0);
    if (named.length < 2) {
      warn(
        `needs two or more items with labels, received ${named.length} (${labels}). Rendering nothing.`,
      );
      return;
    }
    const tooLong = named.filter((label) => label.trim().length > LABEL_MAX);
    if (tooLong.length > 0) {
      warn(
        `${tooLong.length} label(s) exceed ${LABEL_MAX} characters and will wrap to more than one line ` +
          `(${JSON.stringify(tooLong)}). Author a short navigationLabel: ` +
          `two or three words that name the section.`,
      );
    }
  }, [labels]);

  /* Which section the reader is in: the last heading at or above the reading line, 30% down the
     viewport. Above the first heading nothing is current — the reader is in the hero. Once the
     shell's foot is on screen the LAST entry is current, because a short last section never
     reaches the line before the page ends — the shell being the rail's parent, the two-track Layout
     every long-form page composes. Runs at every width: the phone bar names it too. */
  useEffect(() => {
    const rail = railRef.current;
    const hrefs = fragments ? fragments.split(' ') : [];
    if (!rail || hrefs.length < 2) return;

    const targets = hrefs.map((href) => document.getElementById(href.slice(1)));
    const missing = hrefs.filter((_, i) => targets[i] === null);
    if (missing.length > 0) {
      warn(
        `${missing.length} of ${hrefs.length} hrefs resolve to no element on this page ` +
          `(${missing.join(', ')}). Those entries link but can never be marked current.`,
      );
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      const shell = rail.parentElement?.getBoundingClientRect();
      let mark: number | null = null;
      targets.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= line) mark = i;
      });
      if (mark !== null && shell && shell.bottom <= window.innerHeight)
        mark = targets.length - 1;
      setCurrent(mark);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [fragments]);

  /* The marker's place: the current row's box, or the first row's while nothing is current, so the
     first arrival grows in where it lands. Re-read when the list is laid out again — the phone's
     list has no box until it opens — and on resize, where a coarse pointer changes the row. On the
     rail, a current row scrolled out of the rail's own box is brought back into it. */
  useIsoLayoutEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    const place = () => {
      const rows = track.querySelectorAll<HTMLElement>('li');
      const row = rows[current ?? 0];
      if (!row || row.offsetHeight === 0) return;
      setMarker({ offset: row.offsetTop, size: row.offsetHeight });

      if (current !== null && rail.scrollHeight > rail.clientHeight) {
        const box = rail.getBoundingClientRect();
        const r = row.getBoundingClientRect();
        if (r.top < box.top) rail.scrollTop -= box.top - r.top;
        else if (r.bottom > box.bottom) rail.scrollTop += r.bottom - box.bottom;
      }
    };

    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [current, open]);

  /* Transitions switch on one frame after the first placement, never before it. */
  useEffect(() => {
    if (!marker || live) return;
    const frame = window.requestAnimationFrame(() => setLive(true));
    return () => window.cancelAnimationFrame(frame);
  }, [marker, live]);

  /* The phone's open list shuts on Escape, on a press outside the bar, and when the page scrolls
     under it — the reader has gone back to reading. */
  useEffect(() => {
    if (!open) return;
    const shut = () => {
      if (detailsRef.current) detailsRef.current.open = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        shut();
        detailsRef.current?.querySelector('summary')?.focus();
      }
    };
    const onPress = (event: PointerEvent) => {
      if (!railRef.current?.contains(event.target as Node)) shut();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPress);
    window.addEventListener('scroll', shut, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPress);
      window.removeEventListener('scroll', shut);
    };
  }, [open]);

  if (outline.length < 2) return null;

  /* A jump: the heading lands level with the rail's top (from 1024), or clear of the nav and the bar
     with a gutter of air (below). Smooth unless the reader asked for less motion; the hash is kept
     and focus moves to the heading, as a native fragment jump would. Modified clicks are left to
     the browser. */
  const jump = (href: `#${string}`) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
      return;
    const target = document.getElementById(href.slice(1));
    const rail = railRef.current;
    if (detailsRef.current) detailsRef.current.open = false;
    if (!target || !rail) return;
    event.preventDefault();

    const style = getComputedStyle(rail);
    const inset = parseFloat(style.insetBlockStart) || 0;
    const clearance = window.matchMedia(RAIL_MEDIA).matches
      ? inset
      : inset + rail.offsetHeight + (parseFloat(style.getPropertyValue('--gap-gutter')) || 0);
    /* Glides or jumps by the site's one scroll setting (reset.css), reduced motion included. */
    window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - clearance });
    window.history.pushState(null, '', href);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  };

  const markerStyle = marker
    ? ({
        '--toc-marker-offset': `${marker.offset}px`,
        '--toc-marker-size': `${marker.size}px`,
      } as CSSProperties)
    : undefined;

  return (
    <nav ref={railRef} aria-labelledby={titleId} className={styles.rail}>
      {/* One DOM: a disclosure below 1024 (the bar), forced open from 1024 by ::details-content
          (the rail). `open` is the reader's state on a phone and is never set by a prop. */}
      <details
        ref={detailsRef}
        className={styles.disclosure}
        onToggle={(event) => setOpen(event.currentTarget.open)}
      >
        <summary className={styles.summary} aria-controls={listId}>
          {current === null ? (
            <span className={styles.summaryRest}>On this page</span>
          ) : (
            <span className={styles.summaryCurrent}>{outline[current]?.label}</span>
          )}
          <span className={styles.chevron} aria-hidden="true">
            <Icon name="alt-arrow-down" size="sm" />
          </span>
        </summary>
        <Layout rowGap="block" className={styles.panel}>
          {/* The rail's title, and the landmark's name at every width. */}
          <p id={titleId} className={styles.title}>
            On this page
          </p>
          <div
            ref={trackRef}
            className={styles.track}
            data-live={live ? '' : undefined}
            style={markerStyle}
          >
            <span
              className={styles.marker}
              data-shown={current !== null && marker ? '' : undefined}
              aria-hidden="true"
            />
            <Layout as="ol" rowGap="none" id={listId} className={styles.list}>
              {outline.map((item, index) => (
                <li key={item.href}>
                  {/* "location": a position within the current page, which SiteNav's "page" and
                      Breadcrumbs' current crumb are not. Absent, not false, on every other row. */}
                  <a
                    className={styles.link}
                    href={item.href}
                    aria-current={index === current ? 'location' : undefined}
                    onClick={jump(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </Layout>
          </div>
        </Layout>
      </details>
    </nav>
  );
}
