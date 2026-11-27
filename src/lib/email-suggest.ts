/**
 * A suggestion for a mistyped email domain (docs/TRACKER.md F.3): "ada@gmial.com" → "ada@gmail.com".
 * Pure, so it is tested on its own (tests/form-fields.test.mjs).
 *
 * It only ever suggests; the reader decides. It is cautious on purpose: a work address on an unusual
 * domain must never be "corrected" into a webmail one, so only long, well-known webmail domains are
 * matched by spelling distance, and only the TLD typos that are never real (".con", ".cmo") are
 * fixed on any domain.
 */

/** Webmail domains people mistype. Short ones (me.com, aol.com, msn.com) are left out: at one or
    two letters' distance they collide with real company domains (ge.com, aon.com). */
const WEBMAIL = [
  'gmail.com',
  'googlemail.com',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'icloud.com',
  'protonmail.com',
  'rediffmail.com',
  'yandex.com',
] as const;

/** Real mail domains that sit a letter or two from a WEBMAIL one: never "corrected" (mail.com is
    one edit from gmail.com). */
const REAL = new Set([
  'mail.com',
  'email.com',
  'gmx.com',
  'ymail.com',
  'live.com',
  'aol.com',
  'me.com',
  'msn.com',
  'proton.me',
  'fastmail.com',
  'hey.com',
  'zoho.com',
]);

/** Endings that are never a real TLD and are always a slip of the finger. */
const TLD_FIXES: Record<string, string> = {
  con: 'com',
  cmo: 'com',
  cpm: 'com',
  comm: 'com',
  coom: 'com',
  ocm: 'com',
  vom: 'com',
  xom: 'com',
  nte: 'net',
  nett: 'net',
  ogr: 'org',
  orgg: 'org',
};

/** Edits between two strings, a swap of neighbours counting as one (optimal string alignment). */
function distance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let best = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        best = Math.min(best, d[i - 2]![j - 2]! + 1);
      d[i]![j] = best;
    }
  }
  return d[a.length]![b.length]!;
}

/** The address with its domain corrected, or undefined when there is nothing to suggest. */
export function suggestEmail(value: string): string | undefined {
  const trimmed = value.trim();
  const at = trimmed.lastIndexOf('@');
  if (at < 1 || at === trimmed.length - 1) return undefined;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1).toLowerCase();
  if (!domain.includes('.') || REAL.has(domain) || (WEBMAIL as readonly string[]).includes(domain))
    return undefined;

  /* A webmail domain one or two edits away (two only for the longer ones). */
  let best: { domain: string; edits: number } | undefined;
  for (const known of WEBMAIL) {
    const edits = distance(domain, known);
    const allowed = known.length >= 10 ? 2 : 1;
    if (edits > 0 && edits <= allowed && (!best || edits < best.edits))
      best = { domain: known, edits };
  }
  if (best) return `${local}@${best.domain}`;

  /* A TLD that is never real, on any domain. */
  const dot = domain.lastIndexOf('.');
  const fixed = TLD_FIXES[domain.slice(dot + 1)];
  if (fixed) return `${local}@${domain.slice(0, dot)}.${fixed}`;
  return undefined;
}
