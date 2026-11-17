import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/routes';

import { getSitemapMasterPage } from '@/content';

import { listSitemapFallbackEntries } from './_sitemap/pages';

/**
 * `/sitemap.xml`, from the published Sitemap Master's resolved groups (the same list the `/sitemap`
 * page renders), read from Strapi on each request.
 * If the master cannot be read or lists nothing, use the published route inventory.
 * Fixed public routes keep the XML available during a CMS outage.
 */
export const revalidate = 0;

async function entries() {
  try {
    const page = await getSitemapMasterPage();
    const listed = page?.groups.flatMap((group) => group.entries) ?? [];
    if (listed.length) return listed;
    console.warn('sitemap.xml: the Sitemap Master lists no pages; using the route list');
  } catch (error) {
    console.error(
      'sitemap.xml: the Sitemap Master could not be read; using the route list',
      error,
    );
  }
  return listSitemapFallbackEntries();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await entries())
    .map(({ path, lastModified }) => ({
      url: `${SITE_ORIGIN}${path === '/' ? '' : path}`,
      ...(lastModified ? { lastModified } : {}),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}
