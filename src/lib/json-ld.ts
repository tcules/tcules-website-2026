/**
 * Structured data, as the routes emit it.
 *
 * `jsonLdMarkup` is the serialisation every route's `<script type="application/ld+json">` uses: JSON
 * with `<` escaped, so a CMS string can never close the script element. (The older routes each carry
 * a private copy of the same two lines; new routes import this one.)
 */
export function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

/**
 * The origin the site's schema.org node ids are written on. The CMS's article markup names the
 * organisation `https://www.tcules.com/#organization` and each author
 * `https://www.tcules.com/insights/authors/<slug>#person` (562 and 152 references on the live blogs,
 * 1 Nov 2026), so a node this site emits takes the same id and the two graphs join. An `@id` is a
 * name, not a link: it stays on this origin whatever host serves the page.
 */
const SCHEMA_ID_ORIGIN = 'https://www.tcules.com';

/** The organisation node every page's markup refers to. */
export const ORGANIZATION_ID = `${SCHEMA_ID_ORIGIN}/#organization`;

/** A site path's node id: `schemaId('/insights/authors/shoghi-bagul', 'person')`. */
export function schemaId(path: string, fragment: string): string {
  return `${SCHEMA_ID_ORIGIN}${path}#${fragment}`;
}
