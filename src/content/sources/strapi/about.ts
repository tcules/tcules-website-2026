import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  AboutAction,
  AboutCard,
  AboutContentSource,
  AboutImage,
  AboutImageSection,
  AboutPage,
  ContentSeo,
} from '../../types';
import { mapUploadImage } from './image';
import { ABOUT_QUERY } from './about-query';
import type {
  StrapiAbout,
  StrapiAboutFile,
  StrapiAboutImageSection,
  StrapiAboutLink,
  StrapiAboutResponse,
  StrapiAboutSeo,
} from './about-types';

const ABOUT_SLUG = 'about';
const ABOUT_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}


function mapImage(
  file: StrapiAboutFile | null | undefined,
  graphqlUrl: string,
): AboutImage | undefined {
  return mapUploadImage(file, graphqlUrl);
}

function mapAction(link: StrapiAboutLink | null | undefined): AboutAction | undefined {
  const label = value(link?.name);
  const href = value(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external: link?.isExternal === true,
  };
}

function mapImageSection(
  section: StrapiAboutImageSection | null | undefined,
  fallbackId: string,
  graphqlUrl: string,
): AboutImageSection | undefined {
  if (!section) return undefined;

  const heading = value(section.heading);
  const description = value(section.description);
  const images = (section.images ?? []).flatMap((file) => {
    const image = mapImage(file, graphqlUrl);
    return image ? [image] : [];
  });
  if (!heading && !description && images.length === 0) return undefined;

  return {
    id: value(section.id) || fallbackId,
    heading,
    description,
    images,
  };
}

function mapProfileCards(
  cards: NonNullable<NonNullable<StrapiAbout['fifthSection']>['cardDetails']>,
  graphqlUrl: string,
): AboutCard[] {
  return cards.flatMap((card, index) => {
    const heading = value(card.heading);
    const designation = value(card.designation);
    const title = heading || designation;
    const body = value(card.description);
    const image =
      card.isImageVisible === true ? mapImage(card.profilePicture, graphqlUrl) : undefined;
    if (!title) return [];

    return [
      {
        id: value(card.id) || `about-profile-${index + 1}`,
        title,
        body,
        ...(heading && designation ? { eyebrow: designation } : {}),
        ...(image ? { image } : {}),
      },
    ];
  });
}

function mapSurface(candidate: string | null | undefined): NonNullable<AboutCard['surface']> {
  const hint = value(candidate).toLowerCase();
  if (/neutral-(?:800|900|950)|black/u.test(hint)) return 'ink';
  if (/brandeis|blue/u.test(hint)) return 'blue';
  if (/neutral-(?:50|100|200)|paper-deep|tint/u.test(hint)) return 'tint';
  return 'paper';
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

function mapSeo(rawSeo: StrapiAboutSeo | null | undefined): ContentSeo | undefined {
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
  const structuredData = [rawSeo.codeJson, rawSeo.graphCode, rawSeo.structuredData]
    .map(normaliseJsonLd)
    .find((candidate) => candidate !== undefined);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapAbout(
  rawAbout: StrapiAbout,
  requestedSlug: string,
  graphqlUrl: string,
): AboutPage | null {
  const cmsSlug = value(rawAbout.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heading = value(rawAbout.heading);
  if (!heading) return null;

  const heroImage = mapImage(rawAbout.bgImage, graphqlUrl);
  const introductionHeading = value(rawAbout.headingTwo);
  const introductionDescription = value(rawAbout.descriptionTwo);
  const introduction =
    introductionHeading || introductionDescription
      ? { heading: introductionHeading, description: introductionDescription }
      : undefined;
  const secondSection = mapImageSection(
    rawAbout.secondSection,
    'about-second-section',
    graphqlUrl,
  );
  const thirdSection = mapImageSection(
    rawAbout.thirdSection,
    'about-third-section',
    graphqlUrl,
  );

  const principleItems = (rawAbout.fourthSection?.accordianDetails ?? []).flatMap(
    (item, index): AboutCard[] => {
      const title = value(item.heading);
      if (!title) return [];
      return [
        {
          id: value(item.id) || `about-principle-${index + 1}`,
          title,
          body: value(item.description),
        },
      ];
    },
  );
  const principleHeading = value(rawAbout.fourthSection?.label);
  const principles = rawAbout.fourthSection
    ? {
        id: value(rawAbout.fourthSection.id) || 'about-principles',
        heading: principleHeading,
        items: principleItems,
      }
    : undefined;

  const voiceCards = mapProfileCards(rawAbout.fifthSection?.cardDetails ?? [], graphqlUrl);
  const voices = rawAbout.fifthSection
    ? {
        id: value(rawAbout.fifthSection.id) || 'about-voices',
        heading: value(rawAbout.fifthSection.heading),
        cards: voiceCards,
      }
    : undefined;

  const checklistCards = mapProfileCards(
    rawAbout.sixthSection?.sixthSectionCards ?? [],
    graphqlUrl,
  );
  const checklist = rawAbout.sixthSection
    ? {
        id: value(rawAbout.sixthSection.id) || 'about-checklist',
        heading: value(rawAbout.sixthSection.heading),
        cards: checklistCards,
      }
    : undefined;

  const closingCards = (rawAbout.seventhSection?.cardDetails ?? []).flatMap(
    (card, index): AboutCard[] => {
      const title = value(card.heading);
      if (!title) return [];
      const icon = mapImage(card.icon, graphqlUrl);
      const action = mapAction(card.link);
      return [
        {
          id: value(card.id) || `about-closing-card-${index + 1}`,
          title,
          body: value(card.description),
          surface: mapSurface(card.bgColor),
          ...(icon ? { icon } : {}),
          ...(action ? { action } : {}),
        },
      ];
    },
  );
  const closing = rawAbout.seventhSection
    ? {
        id: value(rawAbout.seventhSection.id) || 'about-closing',
        heading: value(rawAbout.seventhSection.heading),
        ...(mapAction(rawAbout.seventhSection.link)
          ? { action: mapAction(rawAbout.seventhSection.link) }
          : {}),
        cards: closingCards,
      }
    : undefined;
  const seo = mapSeo(rawAbout.seo);

  return {
    documentId: value(rawAbout.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    hero: {
      heading,
      description: value(rawAbout.description),
      ...(heroImage ? { image: heroImage } : {}),
    },
    ...(introduction ? { introduction } : {}),
    ...(secondSection ? { secondSection } : {}),
    ...(thirdSection ? { thirdSection } : {}),
    ...(principles ? { principles } : {}),
    ...(voices ? { voices } : {}),
    ...(checklist ? { checklist } : {}),
    ...(closing ? { closing } : {}),
    ...(value(rawAbout.updatedAt) ? { updatedAt: value(rawAbout.updatedAt) } : {}),
    ...(value(rawAbout.publishedAt) ? { publishedAt: value(rawAbout.publishedAt) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchAbout(): Promise<{ graphqlUrl: string; page: StrapiAbout | null }> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: ABOUT_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: ABOUT_REVALIDATE_SECONDS,
      tags: ['about'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi about request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiAboutResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi about query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.about ?? null };
}

export const aboutSource: AboutContentSource = {
  async getAboutPage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== ABOUT_SLUG) return null;

    const { graphqlUrl, page } = await fetchAbout();
    return page ? mapAbout(page, requestedSlug, graphqlUrl) : null;
  },
};
