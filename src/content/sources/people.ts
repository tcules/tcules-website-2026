import type { ImageRecord } from '../types';

/**
 * Team portraits the CMS does not hold yet, keyed by the name as authored. A source uses one only
 * where its own record has no photograph, so a portrait uploaded to the CMS always wins and this
 * list empties itself as the CMS catches up. The files are square crops, head and shoulders, in
 * public/people/ (the byline shows them at 32, the end of an article at 64).
 */
const PORTRAITS: Record<string, Omit<ImageRecord, 'alt'>> = {
  'Devagya Sharma': { src: '/people/devagya-sharma.jpg', width: 384, height: 384, kind: 'photograph' },
};

/** The fallback portrait for a person, or undefined. `alt` is their name. */
export function teamPortrait(name: string): ImageRecord | undefined {
  const portrait = PORTRAITS[name.trim()];
  return portrait ? { ...portrait, alt: name.trim() } : undefined;
}

/**
 * A person's slug: their name as authored, lower-cased, accents folded and every run of anything
 * else made one hyphen ("Yash Gidwani" → "yash-gidwani"). The author page's URL and the `@id` the
 * CMS's own article markup already points at (`…/insights/authors/yash-gidwani#person`). One
 * function, so a byline's link and the page it links to can never disagree.
 */
export function personSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/gu, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}
