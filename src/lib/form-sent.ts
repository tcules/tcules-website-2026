/**
 * How long a sent form is remembered (docs/TRACKER.md F.1). Pure, so it is tested on its own
 * (tests/form-sent.test.mjs); the browser side is lib/form-store.
 *
 * Sales and careers are remembered apart: an applicant who also asks about a project is asked about
 * neither twice, and is never told they "already sent this" for the other one.
 *
 * - **Sales** until the end of the next business day, in the visitor's own time, Monday to Friday
 *   (Devagya, 27 Nov 2026). It follows the promise beside the form, "We reply within a business
 *   day": once that has passed without a reply, a second message is fair and should not be met with
 *   "you've already sent this". No holiday calendar.
 * - **Careers** for 30 days. There is no reply promise for applications yet.
 *
 * Privacy requests are not remembered.
 */

export type SentFormType = 'sales' | 'careers';

export type SentRecord = {
  /** When it was sent, ms since the epoch. The "already sent" prompt names this date. */
  sentAt: number;
  /** When it stops counting as sent, ms since the epoch. */
  until: number;
};

export type SentState = Partial<Record<SentFormType, SentRecord>>;

const CAREERS_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/** The end of the next business day after `sentAt`, in the runtime's local time. */
function endOfNextBusinessDay(sentAt: number): number {
  const day = new Date(sentAt);
  do {
    day.setDate(day.getDate() + 1);
  } while (day.getDay() === 0 || day.getDay() === 6);
  day.setHours(23, 59, 59, 999);
  return day.getTime();
}

/** When a form of this type sent at `sentAt` stops counting as sent. */
export function sentUntil(type: SentFormType, sentAt: number): number {
  return type === 'sales' ? endOfNextBusinessDay(sentAt) : sentAt + CAREERS_DAYS * DAY_MS;
}

export function sentRecord(type: SentFormType, sentAt: number): SentRecord {
  return { sentAt, until: sentUntil(type, sentAt) };
}

function isRecord(value: unknown): value is SentRecord {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as SentRecord).sentAt === 'number' &&
    typeof (value as SentRecord).until === 'number'
  );
}

/**
 * The stored state, read defensively and with every record that has run out dropped. Anything that
 * is not what this module wrote (an older shape, a hand edit) reads as nothing sent.
 */
export function parseSent(raw: string | null, now: number): SentState {
  if (!raw) return {};
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof value !== 'object' || value === null) return {};
  const state: SentState = {};
  for (const type of ['sales', 'careers'] as const) {
    const record = (value as Record<string, unknown>)[type];
    if (isRecord(record) && record.until > now && record.sentAt <= now) state[type] = record;
  }
  return state;
}
