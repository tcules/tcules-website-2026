'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

import { captureHubSpotVisit } from '@/lib/hubspot-attribution';

/** After tracking starts, how long the chat widget waits before it loads, then for an idle moment. */
const CHAT_DELAY_MS = 3_000;

type HubSpotWindow = Window & {
  _hsq?: (unknown[] | (() => void))[];
  hsConversationsSettings?: { loadImmediately?: boolean };
  hsConversationsOnReady?: (() => void)[];
  HubSpotConversations?: { widget: { load: () => void } };
};

/**
 * Mounted only by the live environment's shared TrackingScripts component. The loader renders once
 * tracking has started (`started`, lib/tracking-start). The chat widget is the heaviest thing it
 * brings (a 515 ms task on a phone, 17 Nov 2026), so it does not load with it: HubSpot's
 * `loadImmediately: false` holds it, and it loads a few seconds later in an idle moment (marketing,
 * Jatin, 17 Nov 2026).
 */
export function HubSpotTracking({ started }: { started: boolean }) {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const hubspot = window as HubSpotWindow;
    hubspot.hsConversationsSettings = {
      ...hubspot.hsConversationsSettings,
      loadImmediately: false,
    };
    /* HubSpot can run its ready callbacks more than once; the widget is loaded once. */
    let chatQueued = false;
    (hubspot.hsConversationsOnReady = hubspot.hsConversationsOnReady || []).push(() => {
      if (chatQueued) return;
      chatQueued = true;
      window.setTimeout(() => {
        const load = () => hubspot.HubSpotConversations?.widget.load();
        if ('requestIdleCallback' in window)
          window.requestIdleCallback(load, { timeout: 2_000 });
        else load();
      }, CHAT_DELAY_MS);
    });
  }, []);

  useEffect(() => {
    captureHubSpotVisit();
    const trackingWindow = window as HubSpotWindow;
    const queue = (trackingWindow._hsq = trackingWindow._hsq || []);
    const path = window.location.pathname + window.location.search;
    if (previousPath.current === null) {
      // The loader records the initial view, using this path even if loading is delayed.
      queue.push(['setPath', path]);
    } else if (previousPath.current !== pathname) {
      // HubSpot runs queued functions after its initial view. This also handles navigation
      // before analytics finishes loading without duplicating that initial page view.
      queue.push(() => {
        queue.push(['setPath', path]);
        queue.push(['trackPageView']);
      });
    }
    previousPath.current = pathname;
  }, [pathname]);

  if (!started) return null;
  return (
    <Script
      id="hs-script-loader"
      src="https://js.hs-scripts.com/9387720.js"
      strategy="afterInteractive"
      async
      defer
    />
  );
}
