import type { MetadataRoute } from 'next';

import { SITE_ORIGIN } from '@/lib/routes';

import { getSitemapMasterPage } from '@/content';

/** XML and HTML both use the published Sitemap Master groups. */
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const page = await getSitemapMasterPage();
  if (!page) return [];
  const groups = page.groups;
  return groups
    .flatMap((group) => group.entries)
    .map(({ path, lastModified }) => ({
      url: `${SITE_ORIGIN}${path === '/' ? '' : path}`,
      ...(lastModified ? { lastModified } : {}),
    }))
    .sort((a, b) => a.url.localeCompare(b.url));
}
