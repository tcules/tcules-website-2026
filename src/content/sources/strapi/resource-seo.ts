import type { Metadata } from 'next';

import { blogPath } from '@/lib/routes';

import { text } from './home';
import { absoluteAssetUrl, type StrapiUploadFile } from './image';
import { mapPublishedSeo } from './page-seo';
import { publicGraphqlUrl } from './public-graphql';

type Text = string | null | undefined;
type Social = {
  title: Text;
  description: Text;
  image: StrapiUploadFile | null;
  imageAlt: Text;
};
export type ResourceSeo = {
  metaTitle: Text;
  metaDescription: Text;
  canonicalURL: Text;
  robot: Text;
  structuredData: Record<string, unknown> | unknown[] | null;
  focusString: Text;
  secondaryKeywords: { text: Text }[] | null;
  openGraph:
    | (Social & { type: 'website' | 'article' | null; url: Text; siteName: Text; locale: Text })
    | null;
  twitter:
    | (Social & {
        card: 'summary' | 'summary_large_image' | null;
        siteHandle: Text;
        creatorHandle: Text;
      })
    | null;
  technical: {
    index: 'index' | 'noindex' | null;
    follow: 'follow' | 'nofollow' | null;
    noSnippet: boolean | null;
    noImageIndex: boolean | null;
    maxSnippet: number | null;
    maxImagePreview: 'none' | 'standard' | 'large' | null;
    maxVideoPreview: number | null;
    alternates: { language: string; url: string }[] | null;
  } | null;
};
export type ResourceSeoSettings = {
  siteName: Text;
  siteURL: Text;
  language: Text;
  twitterSiteHandle: Text;
  allowIndexing: boolean | null;
  defaultImage: StrapiUploadFile | null;
};

function socialImage(file: StrapiUploadFile | null | undefined, alt: Text) {
  const url = absoluteAssetUrl(file?.url, publicGraphqlUrl());
  return url
    ? [
        {
          url,
          alt: text(alt) ?? text(file?.alternativeText),
          width: file?.width ?? undefined,
          height: file?.height ?? undefined,
        },
      ]
    : undefined;
}

/** Preserve the record's authored SEO and the CMS's public indexing gate. */
export function resourceSeo(
  seo: ResourceSeo | null,
  settings: ResourceSeoSettings | null,
  page: {
    slug: string;
    title: string;
    description?: string;
    publicationDate?: string;
    modificationDate?: string;
  },
  authors: { name: string; href?: string }[],
) {
  const { slug, ...rest } = page;
  return entrySeo(seo, settings, { ...rest, path: blogPath(slug), type: 'article' }, authors);
}

/**
 * An entry's embedded SEO component (`seo` on a Resource, the Privacy Policy, the Terms of Use) as
 * the page's metadata, under the CMS's public indexing gate (`seoSettings.allowIndexing`). `path` is
 * the page's route, the canonical's authority; `type` the Open Graph type when the entry sets none.
 */
export function entrySeo(
  seo: ResourceSeo | null,
  settings: ResourceSeoSettings | null,
  page: {
    path: string;
    title: string;
    description?: string;
    type: 'website' | 'article';
    publicationDate?: string;
    modificationDate?: string;
  },
  authors: { name: string; href?: string }[] = [],
) {
  const { path } = page;
  const directives = new Set(
    (seo?.robot ?? '')
      .toLowerCase()
      .split(',')
      .map((part) => part.trim()),
  );
  const technical = seo?.technical;
  const index =
    settings?.allowIndexing === true &&
    technical?.index !== 'noindex' &&
    !directives.has('noindex') &&
    (technical?.index === 'index' || directives.has('index'));
  const follow = technical?.follow !== 'nofollow' && !directives.has('nofollow');
  const authoredCanonical = text(seo?.canonicalURL);
  let canonical =
    authoredCanonical ??
    (settings?.siteURL ? absoluteAssetUrl(path, settings.siteURL) : undefined);
  if (canonical) {
    const url = absoluteAssetUrl(canonical, publicGraphqlUrl());
    if (url && new URL(url).pathname.replace(/\/+$/, '') !== path) {
      console.warn(
        `New CMS ${path}: canonical path mismatch (${canonical}); using the page's route on the configured origin`,
      );
      canonical = absoluteAssetUrl(path, url);
    }
  }
  if (!text(seo?.canonicalURL)) {
    console.warn(`New CMS ${path}: no canonical URL, using CMS siteURL and route`);
  }
  const title = text(seo?.metaTitle) ?? page.title;
  const description = text(seo?.metaDescription) ?? page.description;
  const og = seo?.openGraph;
  const twitter = seo?.twitter;
  const ogFile = og?.image ?? settings?.defaultImage;
  const twitterFile = twitter?.image ?? ogFile;
  const robots: Metadata['robots'] = {
    index,
    follow,
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
        ].filter((keyword): keyword is string => Boolean(keyword)),
        authors: authors.map(({ name, href }) => ({ name, url: href })),
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
          type: og?.type ?? page.type,
          // The page's route is authoritative when imported SEO names an obsolete path.
          url: canonical ?? text(og?.url),
          siteName: text(og?.siteName) ?? text(settings?.siteName),
          locale: text(og?.locale),
          images: socialImage(ogFile, og?.imageAlt),
          publishedTime: page.publicationDate,
          modifiedTime: page.modificationDate,
        },
        twitter: {
          card: twitter?.card ?? (twitterFile ? 'summary_large_image' : 'summary'),
          title: text(twitter?.title) ?? text(og?.title) ?? title,
          description: text(twitter?.description) ?? text(og?.description) ?? description,
          site: text(twitter?.siteHandle) ?? text(settings?.twitterSiteHandle),
          creator: text(twitter?.creatorHandle),
          images: socialImage(twitterFile, twitter?.imageAlt ?? og?.imageAlt),
        },
      },
      structuredData: seo?.structuredData ?? undefined,
    },
    path,
    { title, description },
  );
}
