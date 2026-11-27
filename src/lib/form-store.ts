import { useSyncExternalStore } from 'react';

import { parseSent, sentRecord, type SentFormType, type SentRecord, type SentState } from './form-sent';
import { readStorage, writeStorage } from './storage';

/*
 * The shared form store (docs/TRACKER.md F.1). Three things every enquiry form on a page shares,
 * whichever placement it is drawn in (the page's own form, the phone's bottom sheet, a later dialog):
 *
 *   sent      Whether a form of each type was sent, and when. Kept in the browser across reloads and
 *             pages, sales and careers apart, until lib/form-sent says it has run out.
 *   draft     What the reader has typed or picked, per form type. In memory on the page only, never
 *             in storage: two placements of one form are one form, typing included, and leaving the
 *             page leaves the draft behind.
 *   tracked   Which once-per-page events have fired, so two placements of one form count one view,
 *             one start and one accepted submission between them.
 *
 * Drafts and the tracked set belong to one page: `enterPage` (called by the root layout on every
 * navigation) clears them.
 */

/* ------------------------------------------------------------------------------------------------
   Sent
   --------------------------------------------------------------------------------------------- */

const SENT_KEY = 'tcules:forms:sent';
const sentListeners = new Set<() => void>();
/* The state as last read, so a render reads one stable object until something changes. Storage
   blocked: the same state lives here for the page's lifetime. */
let sentState: SentState = {};
let sentRead = false;

function nextExpiry(state: SentState): number | undefined {
  const times = Object.values(state).map((record) => record.until);
  return times.length > 0 ? Math.min(...times) : undefined;
}

function refreshSent(raw = readStorage('local', SENT_KEY)) {
  const now = Date.now();
  sentState = raw === null && sentRead ? parseSent(JSON.stringify(sentState), now) : parseSent(raw, now);
  sentRead = true;
}

function emitSent() {
  for (const listener of sentListeners) listener();
}

function saveSent(next: SentState) {
  sentState = next;
  sentRead = true;
  writeStorage('local', SENT_KEY, JSON.stringify(next));
  emitSent();
}

/** Record that a form of this type was sent just now. */
export function markSent(type: SentFormType, now = Date.now()) {
  if (!sentRead) refreshSent();
  saveSent({ ...sentState, [type]: sentRecord(type, now) });
}

/** Forget that a form of this type was sent: the reader chose to send another. */
export function clearSent(type: SentFormType) {
  if (!sentRead) refreshSent();
  const { [type]: _dropped, ...rest } = sentState;
  saveSent(rest);
}

function subscribeSent(listener: () => void) {
  sentListeners.add(listener);
  /* Another tab sent or cleared one. */
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SENT_KEY && event.key !== null) return;
    refreshSent(event.newValue);
    emitSent();
  };
  window.addEventListener('storage', onStorage);
  /* A record running out while the page is open: re-read at the moment it does. */
  let timer: number | undefined;
  const arm = () => {
    window.clearTimeout(timer);
    const at = nextExpiry(sentState);
    if (at === undefined) return;
    /* setTimeout overflows past ~24.8 days; a careers record re-arms on the way. */
    timer = window.setTimeout(
      () => {
        refreshSent();
        emitSent();
      },
      Math.min(Math.max(at - Date.now(), 0) + 50, 2 ** 31 - 1),
    );
  };
  sentListeners.add(arm);
  arm();
  return () => {
    sentListeners.delete(listener);
    sentListeners.delete(arm);
    window.removeEventListener('storage', onStorage);
    window.clearTimeout(timer);
  };
}

function sentSnapshot(): SentState {
  if (!sentRead) refreshSent();
  const at = nextExpiry(sentState);
  if (at !== undefined && at <= Date.now()) refreshSent();
  return sentState;
}

const NOTHING_SENT: SentState = {};

/**
 * When a form of this type was sent, if it still counts. Undefined on the server and through
 * hydration, so the page renders the unsent form first and the browser then says otherwise.
 */
export function useSent(type: SentFormType): SentRecord | undefined {
  return useSyncExternalStore(subscribeSent, sentSnapshot, () => NOTHING_SENT)[type];
}

/* ------------------------------------------------------------------------------------------------
   Drafts and once-per-page events
   --------------------------------------------------------------------------------------------- */

/** A form's values by field name; a checkbox group holds every checked value. */
export type Draft = Record<string, string[]>;
type DraftListener = (draft: Draft | undefined) => void;

const drafts = new Map<string, Draft>();
const draftListeners = new Map<string, Map<string, DraftListener>>();
const tracked = new Set<string>();

/** A new page: its forms start empty and its once-per-page events may fire again. */
export function enterPage() {
  drafts.clear();
  tracked.clear();
  for (const [key, listeners] of draftListeners)
    for (const listener of listeners.values()) listener(drafts.get(key));
}

export function readDraft(key: string): Draft | undefined {
  return drafts.get(key);
}

/**
 * Keep a placement's values and hand them to every other placement of the same form. `source` is
 * the writer's own id, so it is not told about its own typing.
 */
export function writeDraft(key: string, draft: Draft, source: string) {
  if (Object.keys(draft).length === 0) drafts.delete(key);
  else drafts.set(key, draft);
  for (const [id, listener] of draftListeners.get(key) ?? [])
    if (id !== source) listener(drafts.get(key));
}

export function clearDraft(key: string) {
  drafts.delete(key);
  for (const listener of draftListeners.get(key)?.values() ?? []) listener(undefined);
}

/** Hear the other placements' typing. Returns the unsubscribe. */
export function subscribeDraft(key: string, id: string, listener: DraftListener) {
  const listeners = draftListeners.get(key) ?? new Map<string, DraftListener>();
  listeners.set(id, listener);
  draftListeners.set(key, listeners);
  return () => {
    listeners.delete(id);
    if (listeners.size === 0) draftListeners.delete(key);
  };
}

/** True the first time `event` is asked about on this page, false every time after. */
export function firstOnPage(event: string): boolean {
  if (tracked.has(event)) return false;
  tracked.add(event);
  return true;
}
