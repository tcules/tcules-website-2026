import { readStorage, writeStorage } from './storage';

/*
 * How an enquiry is attributed (docs/TRACKER.md F.2): by the page it was sent from and the button
 * pressed to reach the form. There is no intent to choose (decisions/2026-11-27-enquiries-carry-no-intent).
 */

/** The window event a press on a link to this page's form sends, naming the button pressed. */
export const PRESS_EVENT = 'tcules:enquiry-press';
export type PressEventDetail = { ctaId: string };

/**
 * Where a reader came from when an ask sent them to /contact: kept for a few minutes in their own
 * tab's session storage, because a client-side navigation leaves no referrer behind.
 */
export const ENTRY_KEY = 'tcules:enquiry-entry';
const ENTRY_TTL_MS = 30 * 60_000;
export type EnquiryEntry = { from: string; ctaId: string; at: number };

export function saveEntry(entry: Omit<EnquiryEntry, 'at'>) {
  /* Storage blocked or declined: the submission goes without its entry page. */
  writeStorage('session', ENTRY_KEY, JSON.stringify({ ...entry, at: Date.now() }));
}

export function readEntry(): EnquiryEntry | undefined {
  try {
    const raw = readStorage('session', ENTRY_KEY);
    const entry = raw ? (JSON.parse(raw) as EnquiryEntry) : undefined;
    return entry && Date.now() - entry.at < ENTRY_TTL_MS ? entry : undefined;
  } catch {
    return undefined;
  }
}
