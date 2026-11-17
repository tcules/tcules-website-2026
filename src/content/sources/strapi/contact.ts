import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ContactAction,
  ContactContentSource,
  ContactImage,
  ContactPage,
  ContentSeo,
} from '../../types';
import { absoluteAssetUrl, imageSources, positiveDimension } from './image';
import { CONTACT_QUERY } from './contact-query';
import type {
  StrapiContactImage,
  StrapiContactLink,
  StrapiContactPage,
  StrapiContactResponse,
  StrapiContactSeo,
} from './contact-types';

const CONTACT_SLUG = 'contact';
const CONTACT_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}


function mapImage(
  file: StrapiContactImage | null | undefined,
  graphqlUrl: string,
): ContactImage | undefined {
  const src = absoluteAssetUrl(file?.url, graphqlUrl);
  if (!src) return undefined;

  const width = positiveDimension(file?.width);
  const height = positiveDimension(file?.height);
  const sources = width ? imageSources(file?.formats, width, graphqlUrl) : undefined;

  return {
    src,
    alt: value(file?.alternativeText),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(sources ? { sources } : {}),
  };
}

function mapAction(
  link: StrapiContactLink | null | undefined,
  graphqlUrl: string,
): ContactAction | undefined {
  const label = value(link?.name);
  const href = value(link?.href);
  if (!label || !href) return undefined;

  const icon = mapImage(link?.icon, graphqlUrl);

  return {
    id: value(link?.id) || `${label}-${href}`,
    label,
    href,
    description: value(link?.description),
    external: link?.isExternal === true,
    ...(icon ? { icon } : {}),
  };
}

function canonicalUrl(candidate: string | null | undefined): string | undefined {
  const rawUrl = value(candidate);
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function normaliseJsonLd(candidate: unknown): Record<string, unknown> | unknown[] | undefined {
  const parsed = (() => {
    if (typeof candidate !== 'string') return candidate;
    const source = candidate.trim();
    if (!source) return undefined;

    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  })();

  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
}

function mapSeo(rawSeo: StrapiContactSeo | null | undefined): ContentSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonical = canonicalUrl(rawSeo.canonicalURL);
  const robotTokens = value(rawSeo.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const robots = robotTokens.length
    ? {
        index: !robotTokens.includes('noindex'),
        follow: !robotTokens.includes('nofollow'),
      }
    : undefined;
  const structuredData = normaliseJsonLd(rawSeo.graphCode);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapContactPage(
  rawPage: StrapiContactPage,
  requestedSlug: string,
  graphqlUrl: string,
): ContactPage | null {
  const cmsSlug = value(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heading = value(rawPage.heading);
  if (!heading) return null;

  const cards = (rawPage.cards ?? []).flatMap((card, index) => {
    const cardHeading = value(card.heading);
    const action = mapAction(card.link, graphqlUrl);
    if (!cardHeading && !action) return [];

    const icon = mapImage(card.icon, graphqlUrl);
    return [
      {
        id: value(card.id) || `contact-card-${index + 1}`,
        heading: cardHeading || action?.label || '',
        ...(icon ? { icon } : {}),
        ...(action ? { action } : {}),
      },
    ];
  });
  const socialMedia = (rawPage.socialMedia ?? []).flatMap((link) => {
    const action = mapAction(link, graphqlUrl);
    return action ? [action] : [];
  });
  const seo = mapSeo(rawPage.seo);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    heading,
    description: value(rawPage.description),
    cards,
    socialMedia,
    ...(value(rawPage.createdAt) ? { createdAt: value(rawPage.createdAt) } : {}),
    ...(value(rawPage.updatedAt) ? { updatedAt: value(rawPage.updatedAt) } : {}),
    ...(value(rawPage.publishedAt) ? { publishedAt: value(rawPage.publishedAt) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchContactPage(): Promise<{
  graphqlUrl: string;
  page: StrapiContactPage | null;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: CONTACT_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: CONTACT_REVALIDATE_SECONDS,
      tags: ['contact'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi contact request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiContactResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi contact query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.contactUs ?? null };
}

export const contactSource: ContactContentSource = {
  async getContactPage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== CONTACT_SLUG) return null;

    const { graphqlUrl, page } = await fetchContactPage();
    return page ? mapContactPage(page, requestedSlug, graphqlUrl) : null;
  },
};
