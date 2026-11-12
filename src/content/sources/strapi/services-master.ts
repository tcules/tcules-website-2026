import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ContentSeo,
  ServicesMasterAction,
  ServicesMasterContentSource,
  ServicesMasterImage,
  ServicesMasterPage,
} from '../../types';
import { absoluteAssetUrl, imageSources, positiveDimension } from './image';
import { SERVICES_MASTER_QUERY } from './services-master-query';
import type {
  StrapiServicesMaster,
  StrapiServicesMasterBlock,
  StrapiServicesMasterCardSection,
  StrapiServicesMasterFile,
  StrapiServicesMasterHero,
  StrapiServicesMasterLink,
  StrapiServicesMasterResponse,
  StrapiServicesMasterSeo,
} from './services-master-types';
import { escapeHtml, richTextToPlainText, safeContentHref } from './rich-text';

const SERVICES_MASTER_SLUG = 'services';
const SERVICES_MASTER_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}


function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate === 'string') {
    const source = candidate.trim();
    if (!source) return undefined;

    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(candidate)) {
    const source = richTextToPlainText(candidate);
    if (source) {
      try {
        return JSON.parse(source) as unknown;
      } catch {
        return undefined;
      }
    }
    return candidate;
  }

  return candidate;
}

function normaliseJsonLd(candidate: unknown): Record<string, unknown> | unknown[] | undefined {
  const parsed = parseJson(candidate);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
}

function structuredDataFromSeo(
  seo: StrapiServicesMasterSeo,
): Record<string, unknown> | unknown[] | undefined {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
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
    const requestedPath = `/${requestedSlug}`;
    if (canonicalPath !== requestedPath) return undefined;

    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(
  rawSeo: StrapiServicesMasterSeo | null | undefined,
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
  const structuredData = structuredDataFromSeo(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function textParagraphs(candidate: string | null | undefined): string[] {
  return value(candidate)
    .split(/\r?\n+/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function heroBody(
  first: string | null | undefined,
  second: string | null | undefined,
): readonly [string, ...string[]] | undefined {
  const paragraphs = [...textParagraphs(first), ...textParagraphs(second)];
  const lead = paragraphs[0];
  return lead ? [lead, ...paragraphs.slice(1)] : undefined;
}

function closingBody(
  first: string | null | undefined,
  second: string | null | undefined,
): readonly [string] | readonly [string, string] | undefined {
  const paragraphs = [...textParagraphs(first), ...textParagraphs(second)].slice(0, 2);
  const lead = paragraphs[0];
  const detail = paragraphs[1];
  if (!lead) return undefined;
  return detail ? [lead, detail] : [lead];
}

function mapAction(
  link: StrapiServicesMasterLink | null | undefined,
): ServicesMasterAction | undefined {
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

function mapActions(links: StrapiServicesMasterLink[] | null | undefined) {
  return (links ?? []).flatMap((link) => {
    const action = mapAction(link);
    return action ? [action] : [];
  });
}

function mapImage(
  file: StrapiServicesMasterFile | null | undefined,
  graphqlUrl: string,
): ServicesMasterImage | undefined {
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

function pointsHtml(points: Array<{ listText?: string | null }> | null | undefined): string {
  const labels = (points ?? []).map((point) => value(point.listText)).filter(Boolean);
  if (labels.length === 0) return '';

  const numbered = labels.every((label) => /^\d+\.\s+/u.test(label));
  const tag = numbered ? 'ol' : 'ul';
  const items = labels
    .map((label) => (numbered ? label.replace(/^\d+\.\s+/u, '') : label))
    .map((label) => `<li>${escapeHtml(label)}</li>`)
    .join('');

  return `<${tag}>${items}</${tag}>`;
}

function isHero(block: StrapiServicesMasterBlock): block is StrapiServicesMasterHero {
  return block.__typename === 'ComponentServiceHeroSection';
}

function isCardSection(
  block: StrapiServicesMasterBlock,
): block is StrapiServicesMasterCardSection {
  return block.__typename === 'ComponentCapablitiesCapablitiesCardSection';
}

function mapServicesMaster(
  rawPage: StrapiServicesMaster,
  requestedSlug: string,
  graphqlUrl: string,
): ServicesMasterPage | null {
  const blocks = rawPage.capablitiesSingleType ?? [];
  const heroes = blocks.filter(isHero);
  const firstHero = heroes[0];
  const body = heroBody(
    firstHero?.capabilitiesHeroDescription,
    firstHero?.capabilitiesHeroDescriptionTwo,
  );
  const heading = value(firstHero?.capabilitiesHeroHeading);
  if (!heading || !body) return null;

  const sections = blocks.filter(isCardSection).flatMap((section, sectionIndex) => {
    const sectionHeading = value(section.cardSectionHeading);
    if (!sectionHeading) return [];

    const cards = (section.sectionCards ?? []).flatMap((card, cardIndex) => {
      const title = value(card.heading);
      if (!title) return [];

      const action = mapAction(card.link);
      const icon = mapImage(card.icon, graphqlUrl);
      return [
        {
          id: value(card.id) || `services-section-${sectionIndex + 1}-card-${cardIndex + 1}`,
          title,
          description: value(card.description),
          pointsHtml: pointsHtml(card.cardPoints),
          ...(action ? { action } : {}),
          ...(icon ? { icon } : {}),
        },
      ];
    });
    const action = mapAction(section.subRouteLink);
    const icon = mapImage(section.icon, graphqlUrl);

    return [
      {
        id: value(section.id) || `services-section-${sectionIndex + 1}`,
        heading: sectionHeading,
        body: textParagraphs(section.cardSectionDescription),
        ...(value(section.serviceName) ? { serviceName: value(section.serviceName) } : {}),
        ...(action ? { action } : {}),
        ...(icon ? { icon } : {}),
        cards,
      },
    ];
  });

  const lastHero = heroes.length > 1 ? heroes[heroes.length - 1] : undefined;
  const ctaHeading = value(lastHero?.capabilitiesHeroHeading);
  const ctaBody = closingBody(
    lastHero?.capabilitiesHeroDescription,
    lastHero?.capabilitiesHeroDescriptionTwo,
  );
  const ctaActions = mapActions(lastHero?.heroSectionButton).slice(0, 2);
  const closingCta =
    ctaHeading && ctaBody
      ? {
          heading: ctaHeading,
          body: ctaBody,
          points: (lastHero?.label ?? []).flatMap((item) => {
            const label = value(item.listText);
            return label ? [{ label }] : [];
          }),
          actions: ctaActions,
        }
      : undefined;
  const seo = mapSeo(rawPage.seo, requestedSlug);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: requestedSlug,
    ...(value(rawPage.createdAt) ? { createdAt: value(rawPage.createdAt) } : {}),
    ...(value(rawPage.updatedAt) ? { updatedAt: value(rawPage.updatedAt) } : {}),
    ...(value(rawPage.publishedAt) ? { publishedAt: value(rawPage.publishedAt) } : {}),
    hero: {
      heading,
      body,
      labels: (firstHero?.label ?? []).flatMap((item) => {
        const label = value(item.listText);
        return label ? [label] : [];
      }),
      actions: mapActions(firstHero?.heroSectionButton).slice(0, 2),
    },
    sections,
    ...(closingCta ? { closingCta } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchServicesMaster(): Promise<{
  graphqlUrl: string;
  page: StrapiServicesMaster | null;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: SERVICES_MASTER_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: SERVICES_MASTER_REVALIDATE_SECONDS,
      tags: ['services-master'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi services request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiServicesMasterResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi services query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.newCapabilities ?? null };
}

export const servicesMasterSource: ServicesMasterContentSource = {
  async getServicesMasterPage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== SERVICES_MASTER_SLUG) return null;

    const { graphqlUrl, page } = await fetchServicesMaster();
    return page ? mapServicesMaster(page, requestedSlug, graphqlUrl) : null;
  },
};
