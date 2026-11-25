'use client';

import { useEffect } from 'react';

import { noteCtaPress, track } from '@/lib/analytics';
import {
  INTENT_EVENT,
  INTENT_PARAM,
  type IntentEventDetail,
  saveEntry,
} from '@/lib/enquiry-intents';
import { ANCHORS, anchorHref, ROUTES } from '@/lib/routes';

/*
 * What a press on an ask does (docs/specs/EnquiryForms.md § 2), mounted once in the root layout.
 *
 *   An ask on a page with its own sales form   scrolls to that form, selects the button's intent
 *                                               and puts focus on the form's dropdown. No pop-up.
 *   An ask on a page without one                goes to /contact as its link says, carrying the
 *                                               intent in `?intent=`; the page it came from is
 *                                               kept for the /contact form in session storage.
 *   The nav's and the footer's Contact item     always goes to /contact: it names a page.
 *
 * Every ask stays a real link (`?intent=…#enquiry`, `/contact?intent=…`), so a new tab, a modified
 * click, a crawler or a page whose script never loaded still reaches a form with the intent chosen.
 * Every press is counted (`cta_click`).
 */

/** Where a link leads, if to an enquiry form: this page's own (`#enquiry`) or /contact. */
function formDestination(
  anchor: HTMLAnchorElement,
): { kind: 'inline' | 'contact'; url: URL } | null {
  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  const atForm = url.hash === anchorHref(ANCHORS.enquiry);
  if (url.pathname === window.location.pathname && atForm) return { kind: 'inline', url };
  /* Another anchor on this page that holds a form, such as /careers' `#apply`: counted as an ask.
     Only a sales form is scrolled to by hand; this one is left to the browser. */
  if (url.pathname === window.location.pathname && url.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (target?.querySelector('form[data-form-type]')) return { kind: 'inline', url };
  }
  if (url.pathname === ROUTES.contact && (url.hash === '' || atForm))
    return { kind: 'contact', url };
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

/** This page's sales form: the one at the enquiry anchor, else the first on the page. */
function pageSalesForm(): HTMLFormElement | null {
  const selector = 'form[data-form-type="sales"]';
  return (
    document.getElementById(ANCHORS.enquiry)?.querySelector<HTMLFormElement>(selector) ??
    document.querySelector<HTMLFormElement>(`main ${selector}`)
  );
}

/** Bring the form into view and put focus where the reader decides, without opening a keyboard. */
function goToForm(form: HTMLFormElement) {
  const target = document.getElementById(ANCHORS.enquiry) ?? form;
  /* Glides or jumps by the site's one scroll setting (reset.css), reduced motion included. */
  target.scrollIntoView({ block: 'start' });
  try {
    window.history.pushState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}${anchorHref(ANCHORS.enquiry)}`,
    );
  } catch {
    /* History unavailable: the reader is at the form all the same. */
  }
  /* After the form has taken the intent, so the dropdown is announced with the one asked for. */
  window.requestAnimationFrame(() => {
    const picker = form.querySelector<HTMLSelectElement>('select');
    if (picker) {
      picker.focus({ preventScroll: true });
    } else {
      /* No choice to make: the form itself takes focus, so the next Tab lands in its first field
         and a phone keyboard stays shut until the reader picks one. */
      if (!form.hasAttribute('tabindex')) form.setAttribute('tabindex', '-1');
      form.focus({ preventScroll: true });
    }
  });
}

export function EnquiryLinks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      const anchor = target?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = formDestination(anchor);
      if (!destination) return;

      const page = window.location.pathname;
      const { placement, band } = placementOf(anchor);
      const intent = destination.url.searchParams.get(INTENT_PARAM) ?? undefined;
      const ctaId = `${page}_${placement}${intent ? `_${intent}` : ''}`;
      const menu = placement === 'nav-menu' || placement === 'footer-menu';
      const form = menu ? null : pageSalesForm();
      track('cta_click', {
        cta_id: ctaId,
        placement,
        page,
        destination: form ? 'inline' : destination.kind,
        ...(band ? { band } : {}),
        ...(intent ? { intent } : {}),
      });

      /* A press meant for another tab or window is the browser's to handle. */
      const plain =
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey &&
        (!anchor.target || anchor.target === '_self');
      if (!plain) return;

      if (form) {
        /* Before the framework's own link handling, so the page is not navigated. */
        event.preventDefault();
        event.stopPropagation();
        noteCtaPress();
        const detail: IntentEventDetail = { intent, ctaId };
        window.dispatchEvent(new CustomEvent(INTENT_EVENT, { detail }));
        goToForm(form);
        return;
      }
      if (destination.kind === 'contact') saveEntry({ from: page, ctaId });
    }
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);
  return null;
}
