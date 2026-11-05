import type { Metadata } from 'next';

import { authorPath } from '@/lib/routes';

import { text } from './home';
import { absoluteAssetUrl, type StrapiUploadFile } from './image';
import { mapPublishedSeo } from './page-seo';
import { publicGraphqlUrl } from './public-graphql';
import type { ResourceSeo, ResourceSeoSettings } from './resource-seo';

export type AuthorSeo = Omit<ResourceSeo, 'openGraph'> & {
  openGraph:
    | (Omit<NonNullable<ResourceSeo['openGraph']>, 'type'> & {
        type: 'profile' | 'website' | 'article' | null;
      })
    | null;
};

export function authorSeo(
  seo: AuthorSeo | null,
  settings: ResourceSeoSettings | null,
  author: {
    slug: string;
    name: string;
    role?: string;
    bio?: string;
    portrait: StrapiUploadFile | null;
  },
) {
  const path = authorPath(author.slug);
  const directives = new Set(
    (seo?.robot ?? '')
      .toLowerCase()
      .split(',')
      .map((value) => value.trim()),
  );
  const technical = seo?.technical;
  let canonical =
    text(seo?.canonicalURL) ??
    (settings?.siteURL ? absoluteAssetUrl(path, settings.siteURL) : undefined);
  if (canonical) {
    const url = absoluteAssetUrl(canonical, publicGraphqlUrl());
    if (url && new URL(url).pathname.replace(/\/+$/, '') !== path) {
      console.warn(
        `New CMS ${path}: author canonical path mismatch (${canonical}); using the current CMS route`,
      );
      canonical = absoluteAssetUrl(path, url);
    }
  }
  if (!text(seo?.canonicalURL)) console.warn(`New CMS ${path}: missing author canonical URL`);
  // Preserve the existing author title/description strategy, using only the person's CMS values.
  const title = text(seo?.metaTitle) ?? [author.name, author.role].filter(Boolean).join(', ');
  const description = text(seo?.metaDescription) ?? author.bio;
  const og = seo?.openGraph;
  const twitter = seo?.twitter;
  const ogImage = og?.image ?? author.portrait ?? settings?.defaultImage;
  const twitterImage = twitter?.image ?? ogImage;
  function images(file: StrapiUploadFile | null | undefined, alt?: string | null) {
    const url = absoluteAssetUrl(file?.url, publicGraphqlUrl());
    return url
      ? [
          {
            url,
            width: file?.width ?? undefined,
            height: file?.height ?? undefined,
            alt: text(alt) ?? text(file?.alternativeText) ?? author.name,
          },
        ]
      : [];
  }
  const robots: Metadata['robots'] = {
    index:
      settings?.allowIndexing === true &&
      technical?.index !== 'noindex' &&
      !directives.has('noindex') &&
      (technical?.index === 'index' || directives.has('index')),
    follow: technical?.follow !== 'nofollow' && !directives.has('nofollow'),
    nosnippet: technical?.noSnippet || directives.has('nosnippet') || undefined,
    noimageindex: technical?.noImageIndex || directives.has('noimageindex') || undefined,
    'max-snippet': technical?.maxSnippet ?? undefined,
    'max-image-preview': technical?.maxImagePreview ?? undefined,
    'max-video-preview': technical?.maxVideoPreview ?? undefined,
  };
  return mapPublishedSeo(
    {
      metadata: {
        title,
        description,
        keywords: [
          text(seo?.focusString),
          ...(seo?.secondaryKeywords ?? []).map((item) => text(item.text)),
        ].filter((v): v is string => Boolean(v)),
        publisher: text(settings?.siteName),
        alternates: {
          canonical,
          languages: technical?.alternates?.length
            ? Object.fromEntries(technical.alternates.map((item) => [item.language, item.url]))
            : undefined,
        },
        robots,
        openGraph: {
          title: text(og?.title) ?? title,
          description: text(og?.description) ?? description,
          type: og?.type ?? 'profile',
          url: canonical ?? text(og?.url),
          siteName: text(og?.siteName) ?? text(settings?.siteName),
          locale: text(og?.locale),
          images: images(ogImage, og?.imageAlt),
        },
        twitter: {
          card: twitter?.card ?? 'summary',
          title: text(twitter?.title) ?? title,
          description: text(twitter?.description) ?? description,
          site: text(twitter?.siteHandle) ?? text(settings?.twitterSiteHandle),
          creator: text(twitter?.creatorHandle),
          images: images(twitterImage, twitter?.imageAlt ?? og?.imageAlt),
        },
      },
      structuredData: seo?.structuredData ?? undefined,
    },
    path,
    { title, description },
  );
}
