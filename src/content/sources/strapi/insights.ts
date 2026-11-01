import type {
  BlogPage,
  ContentSeo,
  InsightAction,
  InsightFilterGroup,
  InsightFilterOption,
  InsightFormatCard,
  InsightImage,
  InsightResource,
  InsightResourceKind,
  InsightTaxonomy,
  InsightsContentSource,
  InsightsPage,
} from '../../types';
import { INSIGHTS_PAGE_QUERY } from './insights-query';
import type {
  StrapiInsightsImage,
  StrapiInsightsPage,
  StrapiInsightsResource,
  StrapiInsightsResponse,
  StrapiInsightsSeo,
  StrapiInsightsTaxonomy,
} from './insights-types';
import { safeContentHref } from './rich-text';
import { ROUTES } from '../../../lib/routes.ts';
import { COVER_SCENES } from '../cover-scenes';
import { publishedLine } from './published-line';

/**
 * The Lab band's link. The CMS sends `/labs`, which is not a route; the Lab lives at
 * ROUTES.futureInterfacesLab (owner, 13 Oct 2026). Mapped here so no page renders `/labs`
 * (docs/strapi-changes.md § 20f).
 */
function labLink(action: InsightAction | undefined): InsightAction | undefined {
  if (!action) return undefined;
  const path = action.href.split(/[?#]/)[0]?.replace(/\/+$/, '');
  return path === '/labs' || path === '/lab'
    ? { ...action, href: ROUTES.futureInterfacesLab, external: false }
    : action;
}

const DEFAULT_STRAPI_GRAPHQL_URL = 'https://tcules-server-production.up.railway.app/graphql';
const INSIGHTS_SLUG = 'insights';
const INSIGHTS_REVALIDATE_SECONDS = 300;
/* Well above every live count (102 blogs on 1 Nov 2026; Strapi honours a limit over 100). At 100 the hub
   silently dropped the 2 oldest articles. */
const RESOURCE_LIMIT = 500;

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
  return value(candidate)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function getStrapiGraphqlUrl(): string {
  return value(process.env.STRAPI_GRAPHQL_URL) || DEFAULT_STRAPI_GRAPHQL_URL;
}

function absoluteUrl(
  candidate: string | null | undefined,
  baseUrl: string,
): string | undefined {
  const path = value(candidate);
  if (!path) return undefined;

  try {
    const url = new URL(path, baseUrl);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapImage(
  image: StrapiInsightsImage | null | undefined,
  fallbackAlt: string,
  graphqlUrl: string,
): InsightImage | undefined {
  const src = absoluteUrl(image?.url, graphqlUrl);
  if (!src) return undefined;

  return {
    src,
    alt: value(image?.alternativeText) || fallbackAlt,
  };
}

function mapAction(
  link:
    | {
        name?: string | null;
        href?: string | null;
        isExternal?: boolean | null;
      }
    | null
    | undefined,
): InsightAction | undefined {
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

function taxonomyId(item: StrapiInsightsTaxonomy, kind: InsightFilterOption['kind']): string {
  const documentId = value(item.documentId);
  if (documentId) return documentId;

  const fallback =
    normaliseSlug(item.slug) || value(item.name).toLowerCase().replace(/\s+/gu, '-');
  return fallback ? `${kind}:${fallback}` : '';
}

function mapTaxonomy(
  item: StrapiInsightsTaxonomy,
  kind: InsightFilterOption['kind'],
): InsightTaxonomy | undefined {
  const name = value(item.name);
  const documentId = taxonomyId(item, kind);
  if (!name || !documentId) return undefined;

  const slug = normaliseSlug(item.slug);
  return {
    documentId,
    name,
    ...(slug ? { slug } : {}),
  };
}

function mapFilterOption(
  item: StrapiInsightsTaxonomy,
  kind: InsightFilterOption['kind'],
): InsightFilterOption | undefined {
  const taxonomy = mapTaxonomy(item, kind);
  return taxonomy ? { id: taxonomy.documentId, name: taxonomy.name, kind } : undefined;
}

function mapFilterGroup(
  group: NonNullable<NonNullable<StrapiInsightsPage['thirdSection']>['filterResource']>[number],
  index: number,
): InsightFilterGroup | undefined {
  const label = value(group.label);
  if (!label) return undefined;

  const options = [
    ...(group.categories ?? []).flatMap((category) => {
      const mapped = mapFilterOption(category, 'category');
      return mapped ? [mapped] : [];
    }),
    ...(group.tags ?? []).flatMap((tag) => {
      const mapped = mapFilterOption(tag, 'tag');
      return mapped ? [mapped] : [];
    }),
  ];

  return {
    id: value(group.id) || `insights-filter-${index + 1}`,
    label,
    options,
  };
}

function mapFormatCard(
  card: NonNullable<StrapiInsightsPage['cardDetails']>[number],
  index: number,
  graphqlUrl: string,
): InsightFormatCard | undefined {
  const title = displayHeading(card.heading);
  if (!title) return undefined;

  const image = mapImage(card.cardImage, `${title} resources`, graphqlUrl);
  const kind = formatKind(title);
  return {
    id: value(card.id) || `insights-format-${index + 1}`,
    title,
    ...(image ? { image } : {}),
    ...(kind ? { kind } : {}),
  };
}

/**
 * The article's reading time. Strapi keeps it as the TITLE of the article's iframe block ("10 Min
 * Read"); it used to be folded into the description, which put a reading time where a standfirst
 * belongs. Only a value that says "read" is taken, so an embed's real title never becomes one.
 */
/** The body's title-only iframe block: the one carrying "2 May ‘25 ⸱ 11 Min Read". */
const dateLineBlock = (resource: StrapiInsightsResource) =>
  resource.mainSection?.find((block) => block.__typename === 'ComponentBlogAndCasestudiesIframe');

function readingTime(resource: StrapiInsightsResource): string | undefined {
  const detail = value(dateLineBlock(resource)?.title);
  /* Only the length: some iframe titles carry the date too ("14 Oct '26 · 17 Min Read"), and the
     page sets the date itself, so the whole title put two dates on one line (16 Oct 2026). */
  return detail.match(/\b\d+\s*min(ute)?s?\s+read\b/iu)?.[0]?.toLowerCase();
}

/**
 * When and where an event happens. Strapi keeps it in `eventWhereAbout`: `descTwo` is the date as
 * written ("May 2, 2025") and `descOne` the place. A date that does not parse is dropped rather than
 * guessed, and the page renders the event without its date column.
 */
function eventDetails(resource: StrapiInsightsResource): InsightResource['event'] {
  const detail = resource.eventWhereAbout?.[0];
  const written = value(detail?.descTwo);
  const time = written ? Date.parse(`${written} UTC`) : Number.NaN;
  if (Number.isNaN(time)) return undefined;
  const place = value(detail?.descOne);
  return { startsAt: new Date(time).toISOString(), ...(place ? { place } : {}) };
}

/**
 * A blog entry's format. Strapi's one blog collection carries guides, research and videos as well as
 * articles, and says which in the slug's first segment ("guides/saas-onboarding-…", the path the site
 * routes on). An unprefixed slug, or `articles/`, is an article.
 */
export function blogKind(slug: string | null | undefined): BlogPage['kind'] {
  const first = normaliseSlug(slug).split('/')[0];
  if (first === 'guides') return 'guide';
  if (first === 'research') return 'research';
  if (first === 'videos') return 'video';
  return 'article';
}

/** A format card's kind, read from its heading ("Podcasts" → podcast). */
function formatKind(title: string): InsightResourceKind | undefined {
  const word = title.trim().toLowerCase();
  const kinds: Record<string, InsightResourceKind> = {
    articles: 'article',
    guides: 'guide',
    research: 'research',
    podcasts: 'podcast',
    videos: 'video',
    events: 'event',
    interviews: 'interview',
  };
  return kinds[word];
}

function mapResource(
  resource: StrapiInsightsResource,
  index: number,
  kind: InsightResourceKind,
  graphqlUrl: string,
): InsightResource | undefined {
  const title = value(resource.title);
  const slug = normaliseSlug(resource.slug);
  if (!title || !slug) return undefined;

  const image = mapImage(resource.thumbnail, `${title} thumbnail`, graphqlUrl);
  const tags = (resource.tags ?? []).flatMap((tag) => {
    const mapped = mapTaxonomy(tag, 'tag');
    return mapped ? [mapped] : [];
  });
  const categories = (resource.categories ?? []).flatMap((category) => {
    const mapped = mapTaxonomy(category, 'category');
    return mapped ? [mapped] : [];
  });
  /* A blog-collection piece (it queries its body's date line) is dated by that authored line, never
     by `publishedAt`, which is the CMS's last publish (see ./published-line). Without the line it is
     undated rather than wrongly dated. Events, interviews and podcasts keep `publishedAt`. */
  const publishedAt =
    resource.mainSection !== undefined
      ? publishedLine(value(dateLineBlock(resource)?.title)).date
      : value(resource.publishedAt);
  const minutes = readingTime(resource);
  const event = kind === 'event' ? eventDetails(resource) : undefined;

  return {
    documentId: value(resource.documentId) || `insights-${kind}-${index + 1}`,
    kind,
    title,
    slug,
    /* A blog has no description field: its standfirst is its SEO meta description, as on its page. */
    description: value(resource.description) || value(resource.seo?.metaDescription),
    ...(minutes ? { readingTime: minutes } : {}),
    ...(!image && COVER_SCENES[slug] ? { coverScene: COVER_SCENES[slug] } : {}),
    ...(event ? { event } : {}),
    ...(image ? { image } : {}),
    tags,
    categories,
    filterIds: [...new Set([...tags, ...categories].map((item) => item.documentId))],
    ...(publishedAt ? { publishedAt } : {}),
  };
}

function sortResources(resources: InsightResource[]): InsightResource[] {
  return resources.sort((left, right) => {
    const leftTime = left.publishedAt ? Date.parse(left.publishedAt) : Number.NaN;
    const rightTime = right.publishedAt ? Date.parse(right.publishedAt) : Number.NaN;
    const safeLeft = Number.isNaN(leftTime) ? Number.NEGATIVE_INFINITY : leftTime;
    const safeRight = Number.isNaN(rightTime) ? Number.NEGATIVE_INFINITY : rightTime;
    return safeRight - safeLeft;
  });
}

function mapSeo(rawSeo: StrapiInsightsSeo | null | undefined): ContentSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonicalCandidate = value(rawSeo.canonicalURL);
  const canonical =
    canonicalCandidate.startsWith('http://') || canonicalCandidate.startsWith('https://')
      ? absoluteUrl(canonicalCandidate, DEFAULT_STRAPI_GRAPHQL_URL)
      : undefined;
  const robotTokens = value(rawSeo.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const robots = robotTokens.length
    ? { index: !robotTokens.includes('noindex'), follow: !robotTokens.includes('nofollow') }
    : undefined;

  return title || description || canonical || robots
    ? {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(canonical ? { canonical } : {}),
        ...(robots ? { robots, noindex: !robots.index } : {}),
      }
    : undefined;
}

function mapInsightsPage(
  payload: StrapiInsightsResponse,
  requestedSlug: string,
  graphqlUrl: string,
): InsightsPage | null {
  const rawPage = payload.data?.resource;
  if (!rawPage) return null;

  const cmsSlug = normaliseSlug(rawPage.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const heading = displayHeading(rawPage.heading);
  if (!heading) return null;

  const labAction = labLink(mapAction(rawPage.secondSection?.link));
  const labHeading = displayHeading(rawPage.secondSection?.heading);
  const lab =
    rawPage.secondSection && labHeading
      ? {
          id: value(rawPage.secondSection.id) || 'insights-lab',
          heading: labHeading,
          description: value(rawPage.secondSection.description),
          ...(labAction ? { action: labAction } : {}),
        }
      : undefined;
  const closingHeading = displayHeading(rawPage.fourthSection?.heading);
  const closingDescription = value(rawPage.fourthSection?.description);
  const closing =
    rawPage.fourthSection && (closingHeading || closingDescription)
      ? {
          id: value(rawPage.fourthSection.id) || 'insights-closing',
          heading: closingHeading,
          description: closingDescription,
        }
      : undefined;
  const resources = sortResources([
    ...(payload.data?.blogResources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, blogKind(resource.slug), graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(payload.data?.eventResources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, 'event', graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(payload.data?.interviewResources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, 'interview', graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(payload.data?.podcastResources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, 'podcast', graphqlUrl);
      return mapped ? [mapped] : [];
    }),
  ]);
  const seo = mapSeo(rawPage.seo);

  return {
    documentId: value(rawPage.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    hero: {
      heading,
      description: value(rawPage.description),
    },
    formatCards: (rawPage.cardDetails ?? []).flatMap((card, index) => {
      const mapped = mapFormatCard(card, index, graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(lab ? { lab } : {}),
    resources: {
      id: value(rawPage.thirdSection?.id) || 'insights-resources',
      heading: displayHeading(rawPage.thirdSection?.heading),
      filters: (rawPage.thirdSection?.filterResource ?? []).flatMap((group, index) => {
        const mapped = mapFilterGroup(group, index);
        return mapped ? [mapped] : [];
      }),
      items: resources,
    },
    ...(closing ? { closing } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchInsightsPage(): Promise<{
  graphqlUrl: string;
  payload: StrapiInsightsResponse;
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: INSIGHTS_PAGE_QUERY,
      variables: {
        status: 'PUBLISHED',
        sort: ['publishedAt:desc'],
        blogLimit: RESOURCE_LIMIT,
        eventLimit: RESOURCE_LIMIT,
        interviewLimit: RESOURCE_LIMIT,
        podcastLimit: RESOURCE_LIMIT,
      },
    }),
    cache: 'force-cache',
    next: {
      revalidate: INSIGHTS_REVALIDATE_SECONDS,
      tags: ['insights', 'blogs', 'events', 'interviews', 'podcasts'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi insights request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiInsightsResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi insights query failed: ${errors.join('; ')}`);
  }

  return { graphqlUrl, payload };
}

/** The resource singleton is route-scoped here because Strapi exposes no slug filter for it. */
export const insightsSource: InsightsContentSource = {
  async getInsightsPage(slug) {
    const requestedSlug = normaliseSlug(slug);
    if (requestedSlug !== INSIGHTS_SLUG) return null;

    const { graphqlUrl, payload } = await fetchInsightsPage();
    return mapInsightsPage(payload, requestedSlug, graphqlUrl);
  },
};
