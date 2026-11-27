/**
 * Browser storage, through one gate.
 *
 * Every read and write of `localStorage` or `sessionStorage` the site makes goes through here, so
 * the visitor's consent decides all of it in one place (docs/TRACKER.md F.1). Until the cookie banner
 * exists (backlog), `storageAllowed` answers yes; the banner connects by changing that one function.
 *
 * Nothing here throws. A private window, blocked site data or a full quota reads as "nothing stored"
 * and a write that cannot land is dropped: storage is only ever a convenience on top of a page that
 * works without it.
 */

export type StorageArea = 'local' | 'session';

/** Whether the visitor allows the site to keep anything in their browser. */
export function storageAllowed(): boolean {
  return true;
}

function area(which: StorageArea): Storage | undefined {
  if (typeof window === 'undefined' || !storageAllowed()) return undefined;
  try {
    /* The global rather than `window.`: the same object in a browser, and what tests replace. */
    return which === 'local' ? globalThis.localStorage : globalThis.sessionStorage;
  } catch {
    return undefined;
  }
}

export function readStorage(which: StorageArea, key: string): string | null {
  try {
    return area(which)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(which: StorageArea, key: string, value: string): void {
  try {
    area(which)?.setItem(key, value);
  } catch {
    /* Blocked or full: the page carries on without it. */
  }
}

export function removeStorage(which: StorageArea, key: string): void {
  try {
    area(which)?.removeItem(key);
  } catch {
    /* Nothing to remove where storage is blocked. */
  }
}
