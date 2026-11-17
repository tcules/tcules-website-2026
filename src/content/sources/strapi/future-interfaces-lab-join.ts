import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type {
  ContentSeo,
  FutureInterfacesLabJoinAction,
  FutureInterfacesLabJoinCard,
  FutureInterfacesLabJoinCardSection,
  FutureInterfacesLabJoinContentSource,
  FutureInterfacesLabJoinImage,
  FutureInterfacesLabJoinPage,
} from '../../types';
import { absoluteAssetUrl } from './image';
import { FUTURE_INTERFACES_LAB_JOIN_QUERY } from './future-interfaces-lab-join-query';
import type {
  StrapiFutureInterfacesLabJoin,
  StrapiFutureInterfacesLabJoinCard,
  StrapiFutureInterfacesLabJoinCardSection,
  StrapiFutureInterfacesLabJoinFile,
  StrapiFutureInterfacesLabJoinLink,
  StrapiFutureInterfacesLabJoinResponse,
} from './future-interfaces-lab-join-types';
import { escapeHtml, safeContentHref } from './rich-text';

const FUTURE_INTERFACES_LAB_JOIN_SLUG = 'future-interfaces-lab/join';
const FUTURE_INTERFACES_LAB_JOIN_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function cleanHeading(candidate: string | null | undefined): string {
  return value(candidate)
    .replace(/\s*\|\s*/gu, ' ')
    .replace(/\s{2,}/gu, ' ');
}

function paragraphs(candidate: string | null | undefined): string[] {
  return value(candidate)
    .split(/\s*\|\s*|\r?\n+|\u2028+/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
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
    if (canonicalPath !== `/${requestedSlug}`) return undefined;

    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(
  rawSeo: StrapiFutureInterfacesLabJoin['seo'],
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
  file: StrapiFutureInterfacesLabJoinFile | null | undefined,
  graphqlUrl: string,
): FutureInterfacesLabJoinImage | undefined {
  const src = absoluteAssetUrl(file?.url, graphqlUrl);
  if (!src) return undefined;

  return {
    src,
    alt: value(file?.alternativeText),
  };
}

function mapAction(
  link: StrapiFutureInterfacesLabJoinLink | null | undefined,
): FutureInterfacesLabJoinAction | undefined {
  const label = value(link?.name);
  const href = safeContentHref(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external:
      link?.isExternal === true || href.startsWith('http://') || href.startsWith('https://'),
    ...(value(link?.description) ? { description: value(link?.description) } : {}),
  };
}

function mapCard(
  card: StrapiFutureInterfacesLabJoinCard,
  sectionId: string,
  index: number,
  graphqlUrl: string,
): FutureInterfacesLabJoinCard | undefined {
  const title = cleanHeading(card.heading);
  if (!title) return undefined;

  const icon = mapImage(card.icon, graphqlUrl);
  const action = mapAction(card.link);

  return {
    id: value(card.id) || `${sectionId}-card-${index + 1}`,
    title,
    body: value(card.description),
    ...(icon ? { icon } : {}),
    ...(action ? { action } : {}),
  };
}

function mapCardSection(
  section: StrapiFutureInterfacesLabJoinCardSection | null | undefined,
  fallbackId: string,
  graphqlUrl: string,
): FutureInterfacesLabJoinCardSection | undefined {
  const heading = cleanHeading(section?.heading);
  if (!section || !heading) return undefined;

  const id = value(section.id) || fallbackId;
  const description = value(section.description);
  const icon = mapImage(section.icon, graphqlUrl);

  return {
    id,
    heading,
    ...(description ? { description } : {}),
    ...(icon ? { icon } : {}),
    cards: (section.cards ?? []).flatMap((card, index) => {
      const mapped = mapCard(card, id, index, graphqlUrl);
      return mapped ? [mapped] : [];
    }),
  };
}

function answerHtml(candidate: string | null | undefined): string {
  return paragraphs(candidate)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('');
}

function mapFutureInterfacesLabJoin(
  rawPage: StrapiFutureInterfacesLabJoin,
  requestedSlug: string,
  graphqlUrl: string,
): FutureInterfacesLabJoinPage | null {
  const cmsSlug = normaliseSlug(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heroHeading = cleanHeading(rawPage.heroSection?.heading);
  const heroBody = paragraphs(rawPage.heroSection?.description);
  const heroLead = heroBody[0];
  if (!heroHeading || !heroLead) return null;

  const secondSection = mapCardSection(rawPage.secondSection, 'join-second', graphqlUrl);
  const thirdSection = mapCardSection(rawPage.thirdSection, 'join-third', graphqlUrl);
  const fourthContent = mapCardSection(
    rawPage.fourthSection?.fourthSection,
    'join-fourth-content',
    graphqlUrl,
  );
  const fourthBody = paragraphs(rawPage.fourthSection?.description);
  const fourthSection =
    rawPage.fourthSection && (fourthContent || fourthBody.length > 0)
      ? {
          id: value(rawPage.fourthSection.id) || 'join-fourth',
          body: fourthBody,
          ...(fourthContent ? { content: fourthContent } : {}),
        }
      : undefined;
  const fifthSection = mapCardSection(rawPage.fifthSection, 'join-fifth', graphqlUrl);

  const sixthHeading = cleanHeading(rawPage.sixthSection?.heading);
  const leftHeading = cleanHeading(rawPage.sixthSection?.leftCard?.heading);
  const leftDescription = value(rawPage.sixthSection?.leftCard?.description);
  const leftCard =
    leftHeading && leftDescription
      ? {
          id: value(rawPage.sixthSection?.leftCard?.id) || 'join-sixth-left',
          heading: leftHeading,
          description: leftDescription,
          ...(value(rawPage.sixthSection?.leftCard?.bottomText)
            ? { bottomText: value(rawPage.sixthSection?.leftCard?.bottomText) }
            : {}),
        }
      : undefined;
  const sixthSection = sixthHeading
    ? {
        id: value(rawPage.sixthSection?.id) || 'join-sixth',
        heading: sixthHeading,
        ...(value(rawPage.sixthSection?.description)
          ? { description: value(rawPage.sixthSection?.description) }
          : {}),
        ...(leftCard ? { leftCard } : {}),
        rightCards: (rawPage.sixthSection?.rightCard ?? []).flatMap((card, index) => {
          const heading = cleanHeading(card.heading);
          if (!heading) return [];

          return [
            {
              id: value(card.id) || `join-sixth-right-${index + 1}`,
              heading,
              description: value(card.description),
            },
          ];
        }),
      }
    : undefined;

  const seventhHeading = cleanHeading(rawPage.seventhSection?.heading);
  const seventhSection = seventhHeading
    ? {
        id: value(rawPage.seventhSection?.id) || 'join-seventh',
        heading: seventhHeading,
        ...(value(rawPage.seventhSection?.description)
          ? { description: value(rawPage.seventhSection?.description) }
          : {}),
        faqs: (rawPage.seventhSection?.faqs ?? [])
          .filter((faq) => faq.isActive === true)
          .flatMap((faq, index) => {
            const question = value(faq.question);
            const html = answerHtml(faq.answer);
            if (!question || !html) return [];

            return [
              {
                id: value(faq.documentId) || `join-faq-${index + 1}`,
                question,
                answerHtml: html,
                ...(normaliseSlug(faq.slug) ? { slug: normaliseSlug(faq.slug) } : {}),
              },
            ];
          }),
      }
    : undefined;

  const eighthHeading = cleanHeading(rawPage.eighthSection?.heading);
  const eighthIcon = mapImage(rawPage.eighthSection?.icon, graphqlUrl);
  const eighthSection = eighthHeading
    ? {
        id: value(rawPage.eighthSection?.id) || 'join-eighth',
        heading: eighthHeading,
        ...(value(rawPage.eighthSection?.description)
          ? { description: value(rawPage.eighthSection?.description) }
          : {}),
        ...(eighthIcon ? { icon: eighthIcon } : {}),
      }
    : undefined;
  const seo = mapSeo(rawPage.seo, requestedSlug);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: requestedSlug,
    hero: {
      id: value(rawPage.heroSection?.id) || 'join-hero',
      ...(value(rawPage.heroSection?.label)
        ? { eyebrow: value(rawPage.heroSection?.label) }
        : {}),
      heading: heroHeading,
      body: [heroLead, ...heroBody.slice(1)],
      actions: (rawPage.heroSection?.button ?? []).flatMap((link) => {
        const action = mapAction(link);
        return action ? [action] : [];
      }),
    },
    ...(secondSection ? { secondSection } : {}),
    ...(thirdSection ? { thirdSection } : {}),
    ...(fourthSection ? { fourthSection } : {}),
    ...(fifthSection ? { fifthSection } : {}),
    ...(sixthSection ? { sixthSection } : {}),
    ...(seventhSection ? { seventhSection } : {}),
    ...(eighthSection ? { eighthSection } : {}),
    ...(value(rawPage.updatedAt) ? { updatedAt: value(rawPage.updatedAt) } : {}),
    ...(value(rawPage.publishedAt) ? { publishedAt: value(rawPage.publishedAt) } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchFutureInterfacesLabJoin(): Promise<{
  graphqlUrl: string;
  page: StrapiFutureInterfacesLabJoin | null;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await cachedCmsFetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: FUTURE_INTERFACES_LAB_JOIN_QUERY,
      variables: {
        status: 'PUBLISHED',
        faqLimit: 20,
        faqSort: ['updatedAt:desc'],
      },
    }),
    cache: 'force-cache',
    next: {
      revalidate: FUTURE_INTERFACES_LAB_JOIN_REVALIDATE_SECONDS,
      tags: ['future-interfaces-lab-join'],
    },
  });

  if (!response.ok) {
    throw new Error(
      `Strapi future-interfaces-lab/join request failed with HTTP ${response.status}.`,
    );
  }

  const payload = (await response.json()) as StrapiFutureInterfacesLabJoinResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi future-interfaces-lab/join query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, page: payload.data?.labsFilLandingPage ?? null };
}

export const futureInterfacesLabJoinSource: FutureInterfacesLabJoinContentSource = {
  async getFutureInterfacesLabJoinPage(slug) {
    const requestedSlug = normaliseSlug(slug);
    if (requestedSlug !== FUTURE_INTERFACES_LAB_JOIN_SLUG) return null;

    const { graphqlUrl, page } = await fetchFutureInterfacesLabJoin();
    return page ? mapFutureInterfacesLabJoin(page, requestedSlug, graphqlUrl) : null;
  },
};
