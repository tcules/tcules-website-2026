/**
 * The visitor's region, for preselecting a phone field's country code (docs/TRACKER.md F.3; Devagya,
 * 27 Nov 2026: "pre-filled/selected based on the visitor's region"). Pure, so it is tested on its own
 * (tests/form-fields.test.mjs).
 *
 * The browser's own language list is the signal: "en-GB" says GB, "hi-IN" says IN. The first entry
 * that names a region wins. A list with no region at all ("en") falls back to the time zone for the
 * markets Tcules works in most, and then to nothing, leaving the reader to choose.
 */

/** Time zones whose country is unambiguous, for the markets Tcules works in most. */
const ZONES: Record<string, string> = {
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  'Europe/London': 'GB',
  'Europe/Dublin': 'IE',
  'Europe/Berlin': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Amsterdam': 'NL',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Stockholm': 'SE',
  'Asia/Dubai': 'AE',
  'Asia/Singapore': 'SG',
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Los_Angeles': 'US',
  'America/Phoenix': 'US',
};

export function guessRegion(languages: readonly string[], timeZone?: string): string | undefined {
  for (const tag of languages) {
    const match = /^[a-z]{2,3}(?:-[A-Za-z]{4})?-([A-Za-z]{2})\b/u.exec(tag);
    if (match?.[1]) return match[1].toUpperCase();
  }
  return timeZone ? ZONES[timeZone] : undefined;
}
