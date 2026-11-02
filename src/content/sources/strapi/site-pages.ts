import type { SitePage, SitePageFamily, SitePagesContentSource } from '../../types';
import { SITE_PAGES_QUERY } from './site-pages-query';
import { resourceSitePages } from './resources';
import { serviceSitePages } from './service-offers';
import { expertiseSitePages } from './expertise-offers';
import { glossarySitePages } from './glossary-documents';
import { auditSitePages } from './audit-offers';

const DEFAULT_STRAPI_GRAPHQL_URL = 'https://tcules-server-production.up.railway.app/graphql';
const SITE_PAGES_REVALIDATE_SECONDS = 300;

type StrapiSlugEntry = {
  slug?: string | null;
  title?: string | null;
  updatedAt?: string | null;
};

type StrapiSitePagesResponse = {
  data?: Partial<Record<keyof typeof FAMILIES, StrapiSlugEntry[] | null>>;
  errors?: { message?: string | null }[];
};

/** Strapi collection → the route family that serves its entries. */
const FAMILIES = {
  tools: 'tool',
  caseStudies: 'caseStudy',
} as const satisfies Record<string, SitePageFamily>;

/**
 * Podcasts and events are stored as `podcasts/<slug>` / `events/<slug>` while their routes take the
 * last segment alone; every other family keeps its nested slug whole.
 */
const LAST_SEGMENT_ONLY: ReadonlySet<SitePageFamily> = new Set(['podcast', 'event']);

/**
 * `main` is the record a collection's index page reads its own copy from, not a page of the family,
 * so it never becomes `/audits/main`.
 */
const INDEX_RECORD_SLUG = 'main';

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

/** Strapi titles mark a display line break with `|` ("Designing trust | OmnyAI"); a list reads one line. */
function displayTitle(candidate: string | null | undefined): string {
  return value(candidate)
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function routeSlug(family: SitePageFamily, candidate: string | null | undefined): string {
  const segments = value(candidate)
    .split('/')
    .map((part) => part.trim())
    .filter(Boolean);
  return LAST_SEGMENT_ONLY.has(family) ? (segments.at(-1) ?? '') : segments.join('/');
}

function getStrapiGraphqlUrl(): string {
  return value(process.env.STRAPI_GRAPHQL_URL) || DEFAULT_STRAPI_GRAPHQL_URL;
}

async function fetchSitePages(): Promise<StrapiSitePagesResponse['data']> {
  const response = await fetch(getStrapiGraphqlUrl(), {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query: SITE_PAGES_QUERY }),
    cache: 'force-cache',
    next: { revalidate: SITE_PAGES_REVALIDATE_SECONDS, tags: ['site-pages'] },
  });

  if (!response.ok) {
    throw new Error(`Strapi site pages request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiSitePagesResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi site pages query failed: ${errors.join('; ')}`);
  }

  return payload.data;
}

/** Every page Strapi publishes, as route family + route slug + title, deduplicated. */
export const sitePageSource: SitePagesContentSource = {
  async listSitePages() {
    const [data, resources, services, expertise, glossaries, audits] = await Promise.all([
      fetchSitePages(),
      resourceSitePages(),
      serviceSitePages(),
      expertiseSitePages(),
      glossarySitePages(),
      auditSitePages(),
    ]);
    const pages = new Map<string, SitePage>();

    for (const [collection, family] of Object.entries(FAMILIES) as [
      keyof typeof FAMILIES,
      SitePageFamily,
    ][]) {
      for (const entry of data?.[collection] ?? []) {
        const slug = routeSlug(family, entry.slug);
        if (!slug || slug === INDEX_RECORD_SLUG) continue;
        const updatedAt = value(entry.updatedAt);
        pages.set(`${family}:${slug}`, {
          family,
          slug,
          title: displayTitle(entry.title) || slug,
          ...(updatedAt ? { updatedAt } : {}),
        });
      }
    }

    return [
      ...pages.values(),
      ...resources,
      ...services,
      ...expertise,
      ...glossaries,
      ...audits,
    ];
  },
};
