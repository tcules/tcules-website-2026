'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';

import { captureHubSpotVisit } from '@/lib/hubspot-attribution';

/** Mounted only by the live environment's shared TrackingScripts component. */
export function HubSpotTracking() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    captureHubSpotVisit();
    const trackingWindow = window as Window & { _hsq?: (unknown[] | (() => void))[] };
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
