import type { Metadata } from 'next';
import { cache } from 'react';

import { SITE_ORIGIN } from '@/lib/routes';

import { absoluteAssetUrl } from './image';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

const PAGE_SEO_QUERY = `
  query PublishedPageSeo($path: String!) {
    seoPages(status: PUBLISHED, filters: { pagePath: { eq: $path } }) {
      pagePath
      resolved
    }
  }
`;

type SocialImage = { url: string; alt?: string; width?: number; height?: number };
export type ResolvedSeo = {
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
    authors?: { name: string; url?: string }[];
    publisher?: string;
    alternates?: { canonical?: string; languages?: Record<string, string> };
    robots?: Metadata['robots'];
    openGraph?: {
      title?: string;
      description?: string;
      type?: 'website' | 'article' | 'profile';
      publishedTime?: string;
      modifiedTime?: string;
      url?: string;
      siteName?: string;
      locale?: string;
      images?: (SocialImage | string)[];
    };
    twitter?: {
      card: 'summary' | 'summary_large_image';
      title?: string;
      description?: string;
      site?: string;
      creator?: string;
      images?: (SocialImage | string)[];
    };
  };
  structuredData?: Record<string, unknown> | unknown[];
};

/**
 * The page's canonical, always absolute on the site's own origin. The CMS may hold it relative
 * (`/expertise/fintech`) or on another host (`https://tcules.com/...`): both name this page, so only
 * the path is read and the origin is the site's. A canonical naming a different path is refused, as
 * before; a relative one used to be refused too, and a page with no canonical is kept out of the index.
 */
function canonicalUrl(value: string | undefined, path: string): string | undefined {
  if (!value?.trim()) return undefined;
  let url: URL;
  try {
    url = new URL(value.trim(), SITE_ORIGIN);
  } catch {
    return undefined;
  }
  if (!/^https?:$/.test(url.protocol) || url.username || url.password) return undefined;
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  return pathname === path ? new URL(pathname, SITE_ORIGIN).href : undefined;
}

/** The CMS resolves a social image as an object, or (Twitter) as its bare URL: both are read. */
function socialImages(images: (SocialImage | string)[] | undefined, base: string) {
  return images?.flatMap((entry) => {
    const image = typeof entry === 'string' ? { url: entry } : entry;
    const url = absoluteAssetUrl(image.url, base);
    return url ? [{ ...image, url }] : [];
  });
}

/** Shared by route-keyed SEO pages and entries with embedded, resolved SEO. */
export function mapPublishedSeo(
  resolved: ResolvedSeo | null | undefined,
  path: string,
  fallback?: { title: string; description?: string },
) {
  const seo = resolved?.metadata;
  if (!seo) {
    console.warn(`New CMS: no resolved SEO metadata for ${path}`);
    const metadata: Metadata = {
      title: fallback?.title ?? null,
      description: fallback?.description ?? null,
      robots: { index: false },
    };
    return { metadata };
  }

  const canonical = canonicalUrl(seo.alternates?.canonical, path);
  if (!canonical) console.warn(`New CMS: invalid canonical URL for ${path}`);
  const graph = seo.openGraph;
  const graphUrl = canonicalUrl(graph?.url, path);
  if (graph?.url && (!graphUrl || (canonical && graphUrl !== canonical))) {
    console.warn(`New CMS: Open Graph URL disagrees with the canonical for ${path}`);
  }
  const twitter = seo.twitter;
  const assetBase = publicGraphqlUrl();
  const metadata: Metadata = {
    title: seo.title || fallback?.title || null,
    description: seo.description || fallback?.description || null,
    keywords: seo.keywords,
    authors: seo.authors,
    publisher: seo.publisher,
    alternates: { canonical, languages: seo.alternates?.languages },
    robots: canonical && seo.robots ? seo.robots : { index: false },
    openGraph: graph && {
      ...graph,
      url: graphUrl && (!canonical || graphUrl === canonical) ? graphUrl : undefined,
      images: socialImages(graph.images, assetBase),
    },
    twitter: twitter && { ...twitter, images: socialImages(twitter.images, assetBase) },
  };

  const structuredData = resolved?.structuredData;
  return {
    metadata,
    structuredData:
      structuredData && typeof structuredData === 'object' && Object.keys(structuredData).length
        ? structuredData
        : undefined,
  };
}

export const getPublishedPageSeo = cache(async (path: string, revalidate?: number) => {
  let resolved: ResolvedSeo | null | undefined;
  try {
    const { seoPages } = await publicGraphql<{
      seoPages: { pagePath: string; resolved: ResolvedSeo | null }[];
    }>(PAGE_SEO_QUERY, 'PublishedPageSeo', { path }, { revalidate });
    resolved = seoPages.find((page) => page.pagePath === path)?.resolved;
  } catch (error) {
    console.error(error);
  }

  return mapPublishedSeo(resolved, path);
});
