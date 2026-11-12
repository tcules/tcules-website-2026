import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  CareerAction,
  CareerCard,
  CareerContentSource,
  CareerImage,
  CareerOpening,
  CareerPage,
  ContentSeo,
} from '../../types';
import { absoluteAssetUrl } from './image';
import { CAREERS_QUERY } from './careers-query';
import type {
  StrapiCareersCard,
  StrapiCareersFile,
  StrapiCareersLink,
  StrapiCareersOpening,
  StrapiCareersPage,
  StrapiCareersResponse,
  StrapiCareersSeo,
} from './careers-types';
import { safeContentHref } from './rich-text';

const CAREERS_SLUG = 'careers';
const CAREERS_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function displayHeading(candidate: string | null | undefined): string {
  return value(candidate)
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');
}

function normaliseSlug(candidate: string | null | undefined): string {
  return value(candidate).replace(/^\/+|\/+$/gu, '');
}


function mapImage(
  file: StrapiCareersFile | null | undefined,
  graphqlUrl: string,
): CareerImage | undefined {
  const src = absoluteAssetUrl(file?.url, graphqlUrl);
  if (!src) return undefined;

  return { src, alt: value(file?.alternativeText) };
}

function mapAction(link: StrapiCareersLink | null | undefined): CareerAction | undefined {
  const label = value(link?.name);
  const href = safeContentHref(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external:
      link?.isExternal === true || href.startsWith('http://') || href.startsWith('https://'),
  };
}

function mapCard(
  card: StrapiCareersCard,
  index: number,
  fallbackPrefix: string,
  graphqlUrl: string,
): CareerCard | undefined {
  const heading = displayHeading(card.heading);
  if (!heading) return undefined;

  const icon = mapImage(card.icon, graphqlUrl);
  const action = mapAction(card.link);

  return {
    id: value(card.id) || `${fallbackPrefix}-${index + 1}`,
    heading,
    ...(icon ? { icon } : {}),
    ...(action ? { action } : {}),
  };
}

function mapOpening(opening: StrapiCareersOpening, index: number): CareerOpening | undefined {
  const roleName = value(opening.roleName);
  if (!roleName) return undefined;

  const action = mapAction(opening.link);

  return {
    documentId: value(opening.documentId) || `career-opening-${index + 1}`,
    roleName,
    roleDomain: value(opening.roleDomain),
    roleLocation: value(opening.roleLocation),
    roleDescription: value(opening.roleDescription),
    ...(action ? { action } : {}),
    ...(value(opening.publishedAt) ? { publishedAt: value(opening.publishedAt) } : {}),
  };
}

function canonicalUrl(
  candidate: string | null | undefined,
  requestedSlug: string,
): string | undefined {
  const rawUrl = value(candidate);
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    const canonicalPath = url.pathname.replace(/\/+$/u, '') || '/';
    if (canonicalPath !== `/${requestedSlug}`) return undefined;

    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(
  rawSeo: StrapiCareersSeo | null | undefined,
  requestedSlug: string,
): ContentSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonical = canonicalUrl(rawSeo.canonicalURL, requestedSlug);
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

  if (!title && !description && !canonical && !robots) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
  };
}

function nonNegativeInteger(candidate: number | null | undefined): number {
  return typeof candidate === 'number' && Number.isInteger(candidate) && candidate >= 0
    ? candidate
    : 0;
}

function mapCareers(
  rawPage: StrapiCareersPage,
  rawRoles: NonNullable<StrapiCareersResponse['data']>['roles'],
  requestedSlug: string,
  graphqlUrl: string,
): CareerPage | null {
  const cmsSlug = normaliseSlug(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heading = displayHeading(rawPage.heading);
  if (!heading) return null;

  const secondCards = (rawPage.secondSection?.cardDetails ?? []).flatMap((card, index) => {
    const mapped = mapCard(card, index, 'career-value', graphqlUrl);
    return mapped ? [mapped] : [];
  });
  const secondHeading = displayHeading(rawPage.secondSection?.heading);
  const secondSection =
    rawPage.secondSection && (secondHeading || secondCards.length > 0)
      ? {
          id: value(rawPage.secondSection.id) || 'career-values',
          heading: secondHeading,
          cards: secondCards,
        }
      : undefined;

  const openings = (rawRoles?.nodes ?? []).flatMap((opening, index) => {
    const mapped = mapOpening(opening, index);
    return mapped ? [mapped] : [];
  });
  const pageInfo = rawRoles?.pageInfo;
  const thirdHeading = displayHeading(rawPage.thirdSection?.heading);
  const thirdDescription = value(rawPage.thirdSection?.description);
  const thirdSection =
    thirdHeading || thirdDescription || openings.length > 0
      ? {
          id: value(rawPage.thirdSection?.id) || 'career-openings',
          heading: thirdHeading,
          description: thirdDescription,
          openings,
          pageInfo: {
            total: nonNegativeInteger(pageInfo?.total),
            page: nonNegativeInteger(pageInfo?.page),
            pageSize: nonNegativeInteger(pageInfo?.pageSize),
            pageCount: nonNegativeInteger(pageInfo?.pageCount),
          },
        }
      : undefined;

  const fourthCards = (rawPage.fourthSection?.cards ?? []).flatMap((card, index) => {
    const mapped = mapCard(card, index, 'career-lab-path', graphqlUrl);
    return mapped ? [mapped] : [];
  });
  const fourthIcon = mapImage(rawPage.fourthSection?.icon, graphqlUrl);
  const fourthAction = mapAction(rawPage.fourthSection?.link);
  const bottomAction = mapAction(rawPage.fourthSection?.bottomLink);
  const fourthHeading = displayHeading(rawPage.fourthSection?.heading);
  const fourthBottomHeading = displayHeading(rawPage.fourthSection?.bottomHeading);
  const fourthSection =
    rawPage.fourthSection &&
    (fourthHeading ||
      fourthIcon ||
      fourthAction ||
      fourthCards.length > 0 ||
      fourthBottomHeading ||
      bottomAction)
      ? {
          id: value(rawPage.fourthSection.id) || 'career-lab',
          heading: fourthHeading,
          ...(fourthIcon ? { icon: fourthIcon } : {}),
          ...(fourthAction ? { action: fourthAction } : {}),
          cards: fourthCards,
          bottomHeading: fourthBottomHeading,
          ...(bottomAction ? { bottomAction } : {}),
        }
      : undefined;
  const seo = mapSeo(rawPage.seo, requestedSlug);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    hero: {
      heading,
      description: value(rawPage.description),
    },
    ...(secondSection ? { secondSection } : {}),
    ...(thirdSection ? { thirdSection } : {}),
    ...(fourthSection ? { fourthSection } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchCareers(): Promise<{
  graphqlUrl: string;
  payload: StrapiCareersResponse;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: CAREERS_QUERY,
      variables: {
        status: 'PUBLISHED',
        page: 1,
        pageSize: 100,
        sort: ['updatedAt:desc'],
      },
    }),
    cache: 'force-cache',
    next: {
      revalidate: CAREERS_REVALIDATE_SECONDS,
      tags: ['careers'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi careers request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiCareersResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi careers query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, payload };
}

export const careersSource: CareerContentSource = {
  async getCareerPage(slug) {
    const requestedSlug = normaliseSlug(slug);
    if (requestedSlug !== CAREERS_SLUG) return null;

    const { graphqlUrl, payload } = await fetchCareers();
    const page = payload.data?.career;
    return page ? mapCareers(page, payload.data?.roles, requestedSlug, graphqlUrl) : null;
  },
};
