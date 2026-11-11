/**
 * Structured data, as the routes emit it.
 *
 * `jsonLdMarkup` is the serialisation every route's `<script type="application/ld+json">` uses: JSON
 * with `<` escaped, so a CMS string can never close the script element. (The older routes each carry
 * a private copy of the same two lines; new routes import this one.)
 */
export function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return serialise(withoutSiteNodes(data));
}

/** The root layout's markup for `siteGraph`: serialised as is, since these ARE the site nodes. */
export function siteGraphMarkup(input: SiteGraphInput): string {
  return serialise(siteGraph(input));
}

function serialise(data: unknown): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

/**
 * Strips the site-wide nodes from a page's graph, because the root layout renders them once from
 * SEO Settings (the template owns the structured data it can derive; the CMS holds the facts).
 * Page entries in the CMS carry their own hand-typed copies of the Organization and WebSite nodes,
 * and those drift (96 named the organisation's url without the www). A top-level copy is dropped; a
 * nested copy becomes a bare `{"@id"}` reference, which is what every other mention already is, so
 * the page's nodes still join the layout's by id.
 */
type JsonLd = Record<string, unknown> | unknown[];

export function withoutSiteNodes(data: JsonLd): JsonLd {
  const owned = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    SITE_NODE_IDS.has(String((value as Record<string, unknown>)['@id']));
  const reference = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(reference);
    if (!value || typeof value !== 'object') return value;
    if (owned(value)) return { '@id': value['@id'] };
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, reference(item)]),
    );
  };
  const nodes = (list: unknown[]) => list.filter((node) => !owned(node)).map(reference);

  if (Array.isArray(data)) return nodes(data);
  if (Array.isArray(data['@graph'])) {
    return {
      ...(reference(data) as Record<string, unknown>),
      '@graph': nodes(data['@graph']),
    };
  }
  return reference(data) as JsonLd;
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

/** The site's WebSite node, published by the organisation. */
export const WEBSITE_ID = `${SCHEMA_ID_ORIGIN}/#website`;

/** The nodes the root layout renders once for every page (see `withoutSiteNodes`). */
const SITE_NODE_IDS: ReadonlySet<string> = new Set([ORGANIZATION_ID, WEBSITE_ID]);

/** A site path's node id: `schemaId('/insights/authors/shoghi-bagul', 'person')`. */
export function schemaId(path: string, fragment: string): string {
  return `${SCHEMA_ID_ORIGIN}${path}#${fragment}`;
}

/** What the site-wide graph is built from: SEO Settings, as `@/content`'s SiteIdentity. */
type SiteGraphInput = {
  siteName: string;
  siteUrl: string;
  language?: string;
  organization: {
    name: string;
    legalName?: string;
    url: string;
    description?: string;
    email?: string;
    telephone?: string;
    logo?: { url: string; width?: number; height?: number };
    sameAs: string[];
    address?: Record<string, string | undefined>;
  };
};

/**
 * The site-wide Organization and WebSite nodes, rendered once by the root layout on every page.
 * Every field comes from SEO Settings; an empty field is left out rather than guessed. The urls are
 * normalised to end in a slash on the origin, as the page entries' references write them.
 */
function siteGraph({ siteName, siteUrl, language, organization: org }: SiteGraphInput) {
  const home = (url: string) => {
    try {
      return new URL('/', url).href;
    } catch {
      return undefined;
    }
  };
  const organization = {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: org.name,
    legalName: org.legalName,
    url: home(org.url) ?? home(siteUrl),
    description: org.description,
    email: org.email,
    telephone: org.telephone,
    logo: org.logo && {
      '@type': 'ImageObject',
      url: org.logo.url,
      width: org.logo.width,
      height: org.logo.height,
    },
    sameAs: org.sameAs.length ? org.sameAs : undefined,
    address: org.address && { '@type': 'PostalAddress', ...org.address },
  };
  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: siteName,
    url: home(siteUrl),
    inLanguage: language,
    publisher: { '@id': ORGANIZATION_ID },
  };
  /* JSON.stringify drops the undefined fields, so an empty CMS field never prints as null. */
  return { '@context': 'https://schema.org', '@graph': [organization, website] };
}
