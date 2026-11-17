import { useSyncExternalStore } from 'react';

/**
 * When third-party tracking starts: after the page is ready, never before it (marketing, Jatin,
 * 17 Nov 2026; decisions/2026-11-17-tracking-loads-after-the-page). Every tag waits for the
 * visitor's first scroll, tap or keypress, or for 5 s after the page's `load`, whichever comes first,
 * so the page appears and responds without competing with a dozen vendors' scripts.
 *
 * One switch for all of it: Tag Manager and the site's own tags render only once
 * `useTrackingStarted()` turns true (app/tracking-scripts.tsx), and a lead conversion starts it
 * itself and waits for the tags it reports to (`leadTrackingReady`), so no conversion is lost to the
 * delay. A visitor who leaves within 5 s without touching the page is not counted; that is the
 * trade marketing accepted.
 */

/** After the page's `load`, how long an untouched page waits before tracking starts anyway. */
const IDLE_START_MS = 5_000;
/** What counts as the visitor using the page. `scroll` is captured, so a scrolled panel counts too. */
const FIRST_USE = ['scroll', 'wheel', 'pointerdown', 'touchstart', 'keydown'] as const;
/** The longest a conversion waits for its tags before reporting to whatever has loaded. */
const LEAD_WAIT_MS = 10_000;

let started = false;
let armed = false;
const listeners = new Set<() => void>();

/** Start tracking now. Idempotent: the first call wins, every later one is a no-op. */
export function startTracking() {
  if (started || typeof window === 'undefined') return;
  started = true;
  for (const listener of listeners) listener();
}

function arm() {
  if (armed || started) return;
  armed = true;
  const options = { capture: true, passive: true } as const;
  const start = () => {
    for (const type of FIRST_USE) window.removeEventListener(type, start, options);
    startTracking();
  };
  for (const type of FIRST_USE) window.addEventListener(type, start, options);
  const later = () => window.setTimeout(start, IDLE_START_MS);
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  arm();
  return () => listeners.delete(listener);
}

/** True once tracking has started. False on the server and through hydration. */
export function useTrackingStarted() {
  return useSyncExternalStore(
    subscribe,
    () => started,
    () => false,
  );
}

type LeadWindow = Window & { __tcLeadListener?: boolean; oaiq?: unknown };

/**
 * The tags a lead reports to are listening: Tag Manager's lead listener (the container's own tag
 * sets `__tcLeadListener` once it is attached) and the OpenAI pixel's queue. A form is filled by
 * typing, which started tracking long before the submit, so this is normally already true.
 */
function leadTagsReady() {
  const w = window as LeadWindow;
  return w.__tcLeadListener === true && typeof w.oaiq === 'function';
}

/**
 * Resolves once a lead conversion can be reported without being lost: tracking is started if it
 * has not been, then this waits for its tags, at most LEAD_WAIT_MS, after which it resolves anyway
 * and the conversion goes to whatever has loaded.
 */
export function leadTrackingReady(): Promise<void> {
  startTracking();
  if (leadTagsReady()) return Promise.resolve();
  return new Promise((resolve) => {
    const deadline = Date.now() + LEAD_WAIT_MS;
    const poll = window.setInterval(() => {
      if (!leadTagsReady() && Date.now() < deadline) return;
      window.clearInterval(poll);
      resolve();
    }, 100);
  });
}
