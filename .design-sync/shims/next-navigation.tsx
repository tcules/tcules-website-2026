/**
 * `next/navigation` — host-framework shim for the Design System artifact bundle. See next-link.tsx for why
 * the real module cannot be bundled.
 *
 * SiteNav reads exactly one thing from this module: `usePathname()`, which it feeds to
 * isActivePath() to decide which bar item is lit. That is a genuine design-system state, so the
 * shim does not hard-code it away — it reads `globalThis.__DS_PATHNAME__`, letting a preview
 * state which page it is depicting before it renders:
 *
 *   (globalThis as any).__DS_PATHNAME__ = '/services';
 *
 * Unset, it answers '/' — the home route, which isActivePath treats as an exact match, so the
 * default is a nav bar with Home lit and nothing else. No route change happens inside a static
 * card, so a plain read is sufficient; there is nothing to subscribe to.
 */
export function usePathname(): string {
  const p = (globalThis as { __DS_PATHNAME__?: string }).__DS_PATHNAME__;
  return typeof p === 'string' ? p : '/';
}

/** A specimen that guards a missing fixture calls notFound(); outside Next it simply throws. */
export function notFound(): never {
  throw new Error('notFound()');
}

/**
 * The listings Finder (ListingIndex) reads `useRouter()` to `replace` the URL as filters change.
 * A static card has no route to change, so every method is a no-op: the Finder still renders and
 * filters in place, and nothing navigates out of the artifact frame.
 */
const noop = () => {};
const router = { push: noop, replace: noop, refresh: noop, back: noop, forward: noop, prefetch: noop };
export function useRouter(): typeof router {
  return router;
}
