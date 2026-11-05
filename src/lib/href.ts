/**
 * Whether a link leaves the site: an absolute http(s) URL on another host. The site's own absolute
 * URLs (`https://www.tcules.com/…`, the copy's canonical form) stay on the site.
 *
 * One answer for every control that renders a link, so the external cue is a rule rather than a
 * per-page tweak: a control whose href leaves the site trails `arrow-right-up`, the leaving-the-site
 * mark (icon-glyphs.ts; the footer's social words, ListCard's external row), in place of
 * `arrow-right` or of no glyph (matter critic, 4 Nov 2026: "Open Matter on Figma" looked like an
 * on-site button).
 */
export function leavesSite(href: string): boolean {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?tcules\.com(\/|$)/i.test(href);
}
