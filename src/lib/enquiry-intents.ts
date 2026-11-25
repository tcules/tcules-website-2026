import { ANCHORS, anchorHref, ROUTES } from './routes';

/*
 * Enquiry intents (docs/specs/EnquiryForms.md § 2, § 4): what a reader wants to do, in their words.
 * Each form type has its own list in the CMS; every button that leads to a form can name one, every
 * form opens with one chosen, and the reader can change it when the list holds a choice.
 */

/** The form types that list their intents in the CMS. Careers lists its open roles instead. */
export type IntentFormType = 'sales' | 'privacy';

export type EnquiryIntent = {
  /** Stable, used in links (`?intent=`) and tracking. */
  key: string;
  /** What the reader reads in the dropdown. */
  label: string;
  formType: IntentFormType;
  /** The one a form of this type opens with when nothing else names one. */
  isDefault: boolean;
};

/** The query parameter a link carries its intent in: `/contact?intent=start-pilot`. */
export const INTENT_PARAM = 'intent';

/** The window event a press on a link to this page's form sends: the form selects the intent. */
export const INTENT_EVENT = 'tcules:enquiry-intent';
export type IntentEventDetail = { intent?: string; ctaId: string };

/**
 * A button's href with the intent it asks for. A link to the page's form (`#enquiry`) or to
 * /contact carries it as `?intent=`, which works with no script at all: the form reads it on load.
 * Any other destination is returned as it was, since only a form has an intent to choose.
 */
export function withIntent(href: string, intent: string | undefined): string {
  if (!intent) return href;
  const enquiry = anchorHref(ANCHORS.enquiry);
  if (href === enquiry) return `?${INTENT_PARAM}=${encodeURIComponent(intent)}${enquiry}`;
  const [path = '', hash] = href.split('#');
  const [pathname, query] = path.split('?');
  if (pathname !== ROUTES.contact) return href;
  const params = new URLSearchParams(query);
  params.set(INTENT_PARAM, intent);
  return `${pathname}?${params.toString()}${hash !== undefined ? `#${hash}` : ''}`;
}

/** The intent a URL asks for, if any. */
export function intentFromSearch(search: string): string | undefined {
  return new URLSearchParams(search).get(INTENT_PARAM) ?? undefined;
}

/**
 * Where a reader came from when an ask sent them to /contact: kept for a few minutes in their own
 * tab's session storage, because a client-side navigation leaves no referrer behind.
 */
export const ENTRY_KEY = 'tcules:enquiry-entry';
const ENTRY_TTL_MS = 30 * 60_000;
export type EnquiryEntry = { from: string; ctaId: string; at: number };

export function saveEntry(entry: Omit<EnquiryEntry, 'at'>) {
  try {
    window.sessionStorage.setItem(ENTRY_KEY, JSON.stringify({ ...entry, at: Date.now() }));
  } catch {
    /* Storage blocked: the submission goes without its entry page. */
  }
}

export function readEntry(): EnquiryEntry | undefined {
  try {
    const raw = window.sessionStorage.getItem(ENTRY_KEY);
    const entry = raw ? (JSON.parse(raw) as EnquiryEntry) : undefined;
    return entry && Date.now() - entry.at < ENTRY_TTL_MS ? entry : undefined;
  } catch {
    return undefined;
  }
}
