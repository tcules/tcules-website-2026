import type { Metadata } from 'next';
import { cache } from 'react';

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
      images?: SocialImage[];
    };
    twitter?: {
      card: 'summary' | 'summary_large_image';
      title?: string;
      description?: string;
      site?: string;
      creator?: string;
      images?: SocialImage[];
    };
  };
  structuredData?: Record<string, unknown> | unknown[];
};

function siteUrl(value: string | undefined): string | undefined {
  if (!value || !/^https?:\/\//i.test(value)) return undefined;
  return absoluteAssetUrl(value, publicGraphqlUrl());
}

function canonicalUrl(value: string | undefined, path: string): string | undefined {
  const href = siteUrl(value);
  if (!href) return undefined;
  const url = new URL(href);
  url.hash = '';
  url.search = '';
  url.pathname = url.pathname.replace(/\/+$/, '') || '/';
  return url.pathname === path && !url.username && !url.password ? url.href : undefined;
}

function socialImages(images: SocialImage[] | undefined, base: string) {
  return images?.flatMap((image) => {
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

export const getPublishedPageSeo = cache(async (path: string) => {
  let resolved: ResolvedSeo | null | undefined;
  try {
    const { seoPages } = await publicGraphql<{
      seoPages: { pagePath: string; resolved: ResolvedSeo | null }[];
    }>(PAGE_SEO_QUERY, 'PublishedPageSeo', { path });
    resolved = seoPages.find((page) => page.pagePath === path)?.resolved;
  } catch (error) {
    console.error(error);
  }

  return mapPublishedSeo(resolved, path);
});
