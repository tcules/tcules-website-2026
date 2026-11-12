import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ContentSeo,
  MatterDesignSystemAction,
  MatterDesignSystemCard,
  MatterDesignSystemContentSource,
  MatterDesignSystemDisplayCard,
  MatterDesignSystemImage,
  MatterDesignSystemPage,
  MatterDesignSystemSection,
  MatterDesignSystemStrip,
} from '../../types';
import { MATTER_DESIGN_SYSTEM_QUERY } from './matter-design-system-query';
import type {
  StrapiMatterDesignSystem,
  StrapiMatterDesignSystemCard,
  StrapiMatterDesignSystemResponse,
  StrapiMatterDesignSystemSeo,
  StrapiMatterDesignSystemStrip,
} from './matter-design-system-types';
import type { StrapiFile, StrapiLink } from './types';

const MATTER_DESIGN_SYSTEM_SLUG = 'matter-design-system';
const MATTER_DESIGN_SYSTEM_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}


function absoluteAssetUrl(path: string | null | undefined, graphqlUrl: string): string {
  const candidate = value(path);
  if (!candidate) return '';

  try {
    return new URL(candidate, graphqlUrl).toString();
  } catch {
    return '';
  }
}

function positiveNumber(candidate: number | null | undefined): number | undefined {
  return typeof candidate === 'number' && Number.isFinite(candidate) && candidate > 0
    ? candidate
    : undefined;
}

function mapImage(
  file: StrapiFile | null | undefined,
  graphqlUrl: string,
): MatterDesignSystemImage | undefined {
  const src = absoluteAssetUrl(file?.url, graphqlUrl);
  if (!src) return undefined;

  const width = positiveNumber(file?.width);
  const height = positiveNumber(file?.height);

  return {
    src,
    alt: value(file?.alternativeText),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

function mapAction(link: StrapiLink | null | undefined): MatterDesignSystemAction | undefined {
  const label = value(link?.name);
  const href = value(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external: link?.isExternal === true,
    ...(value(link?.description) ? { description: value(link?.description) } : {}),
  };
}

function firstAction(
  link: StrapiLink | StrapiLink[] | null | undefined,
): MatterDesignSystemAction | undefined {
  if (Array.isArray(link)) {
    for (const candidate of link) {
      const action = mapAction(candidate);
      if (action) return action;
    }
    return undefined;
  }

  return mapAction(link);
}

function mapCard(
  card: StrapiMatterDesignSystemCard,
  index: number,
  sectionId: string,
  graphqlUrl: string,
): MatterDesignSystemCard | undefined {
  const title = value(card.heading);
  if (!title) return undefined;

  const icon = mapImage(card.icon, graphqlUrl);
  const image = mapImage(card.cardImage, graphqlUrl);
  const action = firstAction(card.link);

  return {
    id: value(card.id) || `${sectionId}-card-${index + 1}`,
    title,
    body: value(card.description),
    ...(icon ? { icon } : {}),
    ...(image ? { image } : {}),
    ...(action ? { action } : {}),
  };
}

function mapSection(
  rawSection: StrapiMatterDesignSystem['secondSection'],
  cards: StrapiMatterDesignSystemCard[] | null | undefined,
  fallbackId: string,
  graphqlUrl: string,
): MatterDesignSystemSection | undefined {
  if (!rawSection) return undefined;

  const id = value(rawSection.id) || fallbackId;
  const heading = value(rawSection.heading);
  const mappedCards = (cards ?? []).flatMap((card, index) => {
    const mapped = mapCard(card, index, id, graphqlUrl);
    return mapped ? [mapped] : [];
  });
  const icon = mapImage(rawSection.icon, graphqlUrl);

  if (!heading && mappedCards.length === 0) return undefined;

  return {
    id,
    heading,
    cards: mappedCards,
    ...(icon ? { icon } : {}),
  };
}

function mapStrip(
  strip: StrapiMatterDesignSystemStrip | null | undefined,
  fallbackId: string,
  graphqlUrl: string,
): MatterDesignSystemStrip | undefined {
  if (!strip) return undefined;

  const heading = value(strip.heading);
  if (!heading) return undefined;

  const backgroundImage = mapImage(strip.bgIcon, graphqlUrl);
  const action = mapAction(strip.link);

  return {
    id: value(strip.id) || fallbackId,
    heading,
    description: value(strip.description),
    ...(backgroundImage ? { backgroundImage } : {}),
    ...(action ? { action } : {}),
  };
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate !== 'string') return candidate;
  const source = candidate.trim();
  if (!source) return undefined;

  try {
    return JSON.parse(source) as unknown;
  } catch {
    return undefined;
  }
}

function normaliseJsonLd(candidate: unknown): Record<string, unknown> | unknown[] | undefined {
  const parsed = parseJson(candidate);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
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

function mapSeo(
  rawSeo: StrapiMatterDesignSystemSeo | null | undefined,
): ContentSeo | undefined {
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
  let structuredData: Record<string, unknown> | unknown[] | undefined;

  for (const candidate of [rawSeo.codeJson, rawSeo.graphCode, rawSeo.structuredData]) {
    structuredData = normaliseJsonLd(candidate);
    if (structuredData) break;
  }

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapMatterDesignSystem(
  rawPage: StrapiMatterDesignSystem,
  requestedSlug: string,
  graphqlUrl: string,
): MatterDesignSystemPage | null {
  const cmsSlug = value(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const rawHero = rawPage.heroSection;
  const headingOne = value(rawHero?.headingOne);
  const headingTwo = value(rawHero?.headingTwo);
  if (!rawHero || (!headingOne && !headingTwo)) return null;

  const mappedHeroImage = mapImage(rawHero.featureImage, graphqlUrl);
  const heroImage =
    mappedHeroImage?.width && mappedHeroImage.height
      ? {
          ...mappedHeroImage,
          width: mappedHeroImage.width,
          height: mappedHeroImage.height,
        }
      : undefined;
  const heroAction = mapAction(rawHero.link);
  const secondSection = mapSection(
    rawPage.secondSection,
    rawPage.secondSection?.cardDetails,
    'matter-why',
    graphqlUrl,
  );
  const thirdSection = mapSection(
    rawPage.thirdSection,
    rawPage.thirdSection?.cards,
    'matter-features',
    graphqlUrl,
  );
  const fifthSection = mapSection(
    rawPage.fifthSection,
    rawPage.fifthSection?.cards,
    'matter-benefits',
    graphqlUrl,
  );

  const rawDisplayCards = rawPage.fourthSection?.displayCards ?? [];
  const headingCard = rawDisplayCards.find((card) => value(card.heading));
  const fourthSectionId = value(rawPage.fourthSection?.id) || 'matter-highlights';
  const displayCards: MatterDesignSystemDisplayCard[] = rawDisplayCards.flatMap(
    (card, index) => {
      if (card === headingCard && !value(card.d) && (card.images?.length ?? 0) === 0) return [];

      const heading = value(card.heading);
      const description = value(card.d);
      const images = (card.images ?? []).flatMap((image) => {
        const mapped = mapImage(image, graphqlUrl);
        return mapped ? [mapped] : [];
      });
      const icon = mapImage(card.icon, graphqlUrl);
      if (!heading && !description && !icon && images.length === 0) return [];

      return [
        {
          id: value(card.id) || `${fourthSectionId}-card-${index + 1}`,
          heading,
          description,
          images,
          ...(icon ? { icon } : {}),
        },
      ];
    },
  );
  const fourthSectionHeading = value(headingCard?.heading);
  const fourthSectionIcon = mapImage(headingCard?.icon, graphqlUrl);
  const fourthSection =
    fourthSectionHeading || displayCards.length > 0
      ? {
          id: fourthSectionId,
          heading: fourthSectionHeading,
          cards: displayCards,
          ...(fourthSectionIcon ? { icon: fourthSectionIcon } : {}),
        }
      : undefined;

  const contactHeadingOne = value(rawPage.contactUs?.headingOne);
  const contactHeadingTwo = value(rawPage.contactUs?.headingTwo);
  const contactIcon = mapImage(rawPage.contactUs?.icon, graphqlUrl);
  const contactUs =
    rawPage.contactUs &&
    (contactHeadingOne || contactHeadingTwo || value(rawPage.contactUs.description))
      ? {
          id: value(rawPage.contactUs.id) || 'matter-contact',
          headingOne: contactHeadingOne,
          headingTwo: contactHeadingTwo,
          description: value(rawPage.contactUs.description),
          ...(contactIcon ? { icon: contactIcon } : {}),
        }
      : undefined;
  const stripOne = mapStrip(rawPage.stripOne, 'matter-strip-one', graphqlUrl);
  const stripTwo = mapStrip(rawPage.stripTwo, 'matter-strip-two', graphqlUrl);
  const seo = mapSeo(rawPage.seo);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    hero: {
      id: value(rawHero.id) || 'matter-hero',
      eyebrow: value(rawHero.label),
      headingOne,
      headingTwo,
      description: value(rawHero.description),
      ...(heroAction ? { action: heroAction } : {}),
      ...(heroImage ? { image: heroImage } : {}),
    },
    ...(secondSection ? { secondSection } : {}),
    ...(thirdSection ? { thirdSection } : {}),
    ...(stripOne ? { stripOne } : {}),
    ...(fourthSection ? { fourthSection } : {}),
    ...(fifthSection ? { fifthSection } : {}),
    ...(stripTwo ? { stripTwo } : {}),
    ...(contactUs ? { contactUs } : {}),
    ...(value(rawPage.updatedAt) ? { updatedAt: value(rawPage.updatedAt) } : {}),
    ...(value(rawPage.publishedAt) ? { publishedAt: value(rawPage.publishedAt) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchMatterDesignSystem(): Promise<StrapiMatterDesignSystem | null> {
  const response = await cachedCmsFetch(getStrapiGraphqlUrl(), {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: MATTER_DESIGN_SYSTEM_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: MATTER_DESIGN_SYSTEM_REVALIDATE_SECONDS,
      tags: ['matter-design-system'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi matter-design-system request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiMatterDesignSystemResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi matter-design-system query failed: ${errors.join('; ')}`);
  }

  return payload.data?.matterDesignSystem ?? null;
}

export const matterDesignSystemSource: MatterDesignSystemContentSource = {
  async getMatterDesignSystemPage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== MATTER_DESIGN_SYSTEM_SLUG) return null;

    const rawPage = await fetchMatterDesignSystem();
    return rawPage
      ? mapMatterDesignSystem(rawPage, requestedSlug, getStrapiGraphqlUrl())
      : null;
  },
};
