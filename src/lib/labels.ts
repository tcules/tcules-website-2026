/**
 * Taxonomy labels — one rule for when two are the same and how many a hero shows.
 *
 * Two labels are the same when they read the same: case, "&" against "and", punctuation and spacing
 * do not make a second label ("UX & Design", "ux and design" and "UX and design." are one). The first
 * spelling met is kept, so the caller's order decides which spelling shows.
 *
 * A leaf: the content seam orders and caps a record's labels with it, and PageHero runs every label
 * set it is handed through it, so a hero never shows a duplicate whatever its source.
 */

/** The most labels a piece's hero shows (owner, 18 Nov 2026: bug report #8). */
export const HERO_LABEL_LIMIT = 3;

/** What two labels are compared on: lower case, "&" as "and", every run of non-letters one space. */
export function labelKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** The distinct labels, trimmed, in the order given, the first spelling kept; at most `limit`. */
export function distinctLabels(labels: Iterable<string>, limit = Infinity): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of labels) {
    if (out.length >= limit) break;
    const label = raw.trim();
    const key = labelKey(label);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(label);
  }
  return out;
}
