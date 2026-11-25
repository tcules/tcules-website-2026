'use client';

import { useEffect } from 'react';

import { noteCtaPress, track } from '@/lib/analytics';
import { ANCHORS, anchorHref, ROUTES } from '@/lib/routes';

/**
 * Where a link leads, if it leads to an enquiry form: this page's own form (`#enquiry`), or
 * `/contact` (bare, or at its form). Anything else is not an ask and is not counted.
 */
function formDestination(anchor: HTMLAnchorElement): 'inline' | 'contact' | null {
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  const atForm = url.hash === anchorHref(ANCHORS.enquiry);
  if (url.pathname === window.location.pathname && atForm) return 'inline';
  if (url.pathname === ROUTES.contact && (url.hash === '' || atForm)) return 'contact';
  return null;
}

/**
 * Where on the page the link sits, readable in a report: an ask that names its own place
 * (`data-cta-placement`: the nav's and the footer's buttons) says so; a link in the header or the
 * footer that does not is one of their menus; in the page itself it is `hero` for the first band and
 * `band-N` for the Nth, counted down the page. The band's template code (`data-band`, a letter on most
 * pages) travels beside it as `band`, for telling apart two pages' band 3.
 */
function placementOf(anchor: HTMLAnchorElement): { placement: string; band?: string } {
  const named = anchor.closest<HTMLElement>('[data-cta-placement]')?.dataset.ctaPlacement;
  if (named) return { placement: named };
  if (anchor.closest('header')) return { placement: 'nav-menu' };
  if (anchor.closest('footer')) return { placement: 'footer-menu' };
  const band = anchor.closest<HTMLElement>('[data-band]')?.dataset.band;
  const sections = Array.from(document.querySelectorAll('main section')).filter(
    (section) => !section.parentElement?.closest('main section'),
  );
  const index = sections.findIndex((section) => section.contains(anchor));
  const placement =
    index === 0 || anchor.closest('[data-fold-hero]')
      ? 'hero'
      : index > 0
        ? `band-${index + 1}`
        : 'body';
  return band ? { placement, band } : { placement };
}

/**
 * Counts every press on a link that leads to an enquiry form (`cta_click`, spec § 6), mounted once
 * in the root layout. It only listens: the link does exactly what it did before.
 */
export function CtaTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = formDestination(anchor);
      if (!destination) return;
      const page = window.location.pathname;
      const { placement, band } = placementOf(anchor);
      if (destination === 'inline') noteCtaPress();
      track('cta_click', {
        cta_id: `${page}_${placement}`,
        placement,
        page,
        destination,
        ...(band ? { band } : {}),
      });
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
