import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/routes';

import { getSitemapMasterPage } from '@/content';

import { listSitemapGroups } from './_sitemap/pages';

/**
 * `/sitemap.xml`, from the published Sitemap Master's resolved groups (the same list the `/sitemap`
 * page renders), rebuilt every five minutes so a page published in Strapi appears without a deploy.
 * When the Sitemap Master cannot be read or lists nothing, the generator the site used before
 * (`_sitemap/pages.ts`) answers instead, so the XML is never empty and never an error.
 */
export const revalidate = 300;

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
  return (await listSitemapGroups()).flatMap((group) => group.entries);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await entries())
    .map(({ path, lastModified }) => ({
      url: `${SITE_ORIGIN}${path === '/' ? '' : path}`,
      ...(lastModified ? { lastModified } : {}),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}
