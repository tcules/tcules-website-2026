import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ContentSeo,
  FutureInterfacesLabAction,
  FutureInterfacesLabCard,
  FutureInterfacesLabContentSource,
  FutureInterfacesLabImage,
  FutureInterfacesLabPage,
} from '../../types';
import { absoluteAssetUrl, imageSources, positiveDimension } from './image';
import { FUTURE_INTERFACES_LAB_QUERY } from './future-interfaces-lab-query';
import type {
  StrapiFutureInterfacesLab,
  StrapiFutureInterfacesLabCard,
  StrapiFutureInterfacesLabCardSection,
  StrapiFutureInterfacesLabFile,
  StrapiFutureInterfacesLabLink,
  StrapiFutureInterfacesLabResponse,
} from './future-interfaces-lab-types';
import { cmsHeadingText, escapeHtml, richTextToPlainText, safeContentHref } from './rich-text';

const FUTURE_INTERFACES_LAB_SLUG = 'future-interfaces-lab';
const FUTURE_INTERFACES_LAB_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function text(candidate: unknown): string {
  return typeof candidate === 'string'
    ? candidate.trim()
    : richTextToPlainText(candidate).trim();
}


function normaliseSlug(candidate: string | null | undefined): string {
  return value(candidate).replace(/^\/+|\/+$/gu, '');
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
  rawSeo: StrapiFutureInterfacesLab['seo'],
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

function mapImage(
  file: StrapiFutureInterfacesLabFile | null | undefined,
  graphqlUrl: string,
): FutureInterfacesLabImage | undefined {
  const src = absoluteAssetUrl(file?.url, graphqlUrl);
  if (!src) return undefined;

  const width = positiveDimension(file?.width);
  const height = positiveDimension(file?.height);
  const sources = width ? imageSources(file?.formats, width, graphqlUrl) : undefined;

  return {
    src,
    alt: value(file?.alternativeText) || value(file?.caption),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...(sources ? { sources } : {}),
  };
}

function mapAction(
  link: StrapiFutureInterfacesLabLink | null | undefined,
  graphqlUrl: string,
): FutureInterfacesLabAction | undefined {
  const label = value(link?.name);
  const href = safeContentHref(link?.href);
  if (!label || !href) return undefined;

  const icon = mapImage(link?.icon, graphqlUrl);

  return {
    label,
    href,
    external:
      link?.isExternal === true || href.startsWith('http://') || href.startsWith('https://'),
    ...(value(link?.description) ? { description: value(link?.description) } : {}),
    ...(icon ? { icon } : {}),
  };
}

function firstLink(
  link: StrapiFutureInterfacesLabLink | StrapiFutureInterfacesLabLink[] | null | undefined,
): StrapiFutureInterfacesLabLink | undefined {
  return Array.isArray(link) ? link[0] : (link ?? undefined);
}

function listHtml(items: Array<{ listText?: string | null }> | null | undefined): string {
  const labels = (items ?? []).map((item) => value(item.listText)).filter(Boolean);
  if (labels.length === 0) return '';

  return `<ul>${labels.map((label) => `<li>${escapeHtml(label)}</li>`).join('')}</ul>`;
}

function mapCard(
  card: StrapiFutureInterfacesLabCard,
  sectionIndex: number,
  cardIndex: number,
  graphqlUrl: string,
): FutureInterfacesLabCard | undefined {
  const title = cmsHeadingText(card.heading);
  if (!title) return undefined;

  const icon = mapImage(card.icon, graphqlUrl);
  const image = mapImage(card.cardImage, graphqlUrl);
  const action = mapAction(firstLink(card.button), graphqlUrl);
  const tiles = (card.cardTiles ?? []).flatMap((tile, tileIndex) => {
    const tileTitle = cmsHeadingText(tile.heading);
    if (!tileTitle) return [];

    return [
      {
        id: `${value(card.id) || `card-${cardIndex + 1}`}-tile-${tileIndex + 1}`,
        title: tileTitle,
        body: text(tile.description),
      },
    ];
  });
  const details = (card.details ?? []).flatMap((detail, detailIndex) => {
    const heading = value(detail.heading);
    const bodyHtml = listHtml(detail.description);
    if (!heading || !bodyHtml) return [];

    return [
      {
        id: `${value(card.id) || `card-${cardIndex + 1}`}-detail-${detailIndex + 1}`,
        heading,
        bodyHtml,
      },
    ];
  });

  return {
    id: value(card.id) || `lab-section-${sectionIndex + 1}-card-${cardIndex + 1}`,
    title,
    body: text(card.description),
    showIcon: card.isIconVisible === true,
    ...(icon ? { icon } : {}),
    ...(image ? { image } : {}),
    tiles,
    pointsHtml: listHtml(card.list),
    details,
    ...(action ? { action } : {}),
  };
}

function isCardSection(
  block: NonNullable<StrapiFutureInterfacesLab['detailSection']>[number],
): block is StrapiFutureInterfacesLabCardSection {
  return block.__typename === 'ComponentLabsCardSection';
}

function heroBody(
  highlightedDescription: string | null | undefined,
  description: string | null | undefined,
): readonly [string, ...string[]] | undefined {
  const highlighted = value(highlightedDescription)
    .split(/\s*\|\s*|\r?\n+/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const descriptionParagraphs = value(description)
    .split(/\r?\n+/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const paragraphs = [...highlighted, ...descriptionParagraphs];
  const lead = paragraphs[0];

  return lead ? [lead, ...paragraphs.slice(1)] : undefined;
}

function mapFutureInterfacesLab(
  rawPage: StrapiFutureInterfacesLab,
  requestedSlug: string,
  graphqlUrl: string,
): FutureInterfacesLabPage | null {
  const cmsSlug = normaliseSlug(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heading = cmsHeadingText(rawPage.heroSection?.heading);
  const body = heroBody(
    rawPage.heroSection?.highlightedDescription,
    rawPage.heroSection?.description,
  );
  if (!heading || !body) return null;

  const sections = (rawPage.detailSection ?? [])
    .filter(isCardSection)
    .flatMap((section, index) => {
      const sectionHeading = cmsHeadingText(section.heading);
      if (!sectionHeading) return [];

      return [
        {
          id: value(section.id) || `lab-section-${index + 1}`,
          heading: sectionHeading,
          cards: (section.cards ?? []).flatMap((card, cardIndex) => {
            const mapped = mapCard(card, index, cardIndex, graphqlUrl);
            return mapped ? [mapped] : [];
          }),
        },
      ];
    });

  const miscHeading = cmsHeadingText(rawPage.miscSection?.heading);
  const miscDescription = value(rawPage.miscSection?.description);
  const miscAction = mapAction(rawPage.miscSection?.button, graphqlUrl);
  const misc =
    miscHeading && miscDescription
      ? {
          id: value(rawPage.miscSection?.id) || 'lab-misc',
          eyebrow: value(rawPage.miscSection?.label),
          heading: miscHeading,
          body: [miscDescription] as const,
          ...(miscAction ? { action: miscAction } : {}),
        }
      : undefined;

  const interfaceLabs = rawPage.interfaceLabs
    ? {
        id: value(rawPage.interfaceLabs.id) || 'interface-labs',
        cards: (rawPage.interfaceLabs.labsInterfaceCards ?? []).flatMap((card, index) => {
          const title = cmsHeadingText(card.heading);
          if (!title) return [];

          const icon = mapImage(card.icon, graphqlUrl);
          const action = mapAction(card.link, graphqlUrl);
          return [
            {
              id: value(card.id) || `interface-lab-${index + 1}`,
              title,
              ...(icon ? { icon } : {}),
              ...(action ? { action } : {}),
            },
          ];
        }),
      }
    : undefined;
  const seo = mapSeo(rawPage.seo, requestedSlug);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: requestedSlug,
    hero: {
      heading,
      body,
      actions: (rawPage.heroSection?.button ?? [])
        .flatMap((link) => {
          const action = mapAction(link, graphqlUrl);
          return action ? [action] : [];
        })
        .slice(0, 2),
    },
    sections,
    ...(misc ? { misc } : {}),
    ...(interfaceLabs ? { interfaceLabs } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchFutureInterfacesLab(): Promise<{
  graphqlUrl: string;
  page: StrapiFutureInterfacesLab | null;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: FUTURE_INTERFACES_LAB_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: FUTURE_INTERFACES_LAB_REVALIDATE_SECONDS,
      tags: ['future-interfaces-lab'],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi future-interfaces-lab request failed with HTTP ${response.status}.`,
    );
  }

  const payload = (await response.json()) as StrapiFutureInterfacesLabResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi future-interfaces-lab query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.labSingleType ?? null };
}

export const futureInterfacesLabSource: FutureInterfacesLabContentSource = {
  async getFutureInterfacesLabPage(slug) {
    const requestedSlug = normaliseSlug(slug);
    if (requestedSlug !== FUTURE_INTERFACES_LAB_SLUG) return null;

    const { graphqlUrl, page } = await fetchFutureInterfacesLab();
    return page ? mapFutureInterfacesLab(page, requestedSlug, graphqlUrl) : null;
  },
};
