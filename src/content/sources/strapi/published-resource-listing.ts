import { cache } from 'react';

import { blogPath, ROUTES } from '@/lib/routes';
import type { ArticleSceneName } from '@/lib/sketches';

import type {
  InsightAction,
  InsightFilterGroup,
  InsightFormatCard,
  InsightImage,
  InsightResource,
  InsightResourceKind,
  InsightTaxonomy,
  InsightsPage,
} from '../../types';
import { COVER_SCENES } from '../cover-scenes';
import { action, image, rows, text } from './home';
import type { CmsHero, CmsHomeSection, CmsImage, Entries } from './home-types';
import {
  PUBLISHED_RESOURCE_LISTING_QUERY,
  RESOURCE_PAGE_SIZE,
  resourceIndexPageQuery,
} from './published-resource-listing-query';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;
type Label = { documentId: string; name: Text };

type CmsListingResource = {
  documentId: string;
  slug: string;
  routePath: Text;
  title: Text;
  description: Text;
  publicationDate: Text;
  listingDate: Text;
  omitListingDate: boolean | null;
  readingTime: Text;
  resourceType: { documentId: string; name: Text; slug: Text } | null;
  topics: Entries<Label>;
  stage: (Label & { slug: Text }) | null;
  industries: Entries<Label & { slug: Text }>;
  eventListing: { startsAt: Text; place: Text } | null;
  thumbnail: {
    title: Text;
    description: Text;
    scene: Text;
    readingTime: Text;
    omitReadingTime: boolean | null;
    image: CmsImage | null;
  } | null;
};

type CmsResourceIndex = {
  __typename: 'ComponentListingResourceIndex';
  id: string;
  resources: Entries<CmsListingResource>;
};
type CmsCta = Extract<CmsHomeSection, { __typename: 'ComponentSharedCta' }>;
type CmsListingSection = CmsResourceIndex | CmsCta | { __typename: string };

type CmsResourceListing = {
  documentId: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsListingSection>;
};

const warn = (message: string) => console.warn(`New CMS ${ROUTES.insights}: ${message}`);

/** The CMS's Resource Types, by slug, as the formats the site names. */
const KINDS: Readonly<Record<string, InsightResourceKind>> = {
  articles: 'article',
  guides: 'guide',
  videos: 'video',
  research: 'research',
  events: 'event',
};

/** The drawn article scenes the CMS may name; any other value is not a scene the cards can draw. */
const ARTICLE_SCENES: readonly ArticleSceneName[] = [
  'code-review',
  'security-checklist',
  'prototype-to-production',
];
const articleScene = (value: Text) => ARTICLE_SCENES.find((name) => name === value);

/**
 * The finder's groups, one per taxonomy the Resources are filed under. The CMS has no group settings
 * on the listing, so each group is named for its relation and lists what the pieces carry, most used
 * first; the hub keeps only options with pieces, as it always has.
 */
const GROUPS = [
  { id: 'topic', label: 'Topic', of: (r: CmsListingResource) => rows(r.topics) },
  { id: 'stage', label: 'Stage', of: (r: CmsListingResource) => (r.stage ? [r.stage] : []) },
  { id: 'industry', label: 'Industry', of: (r: CmsListingResource) => rows(r.industries) },
] as const;

function insightImage(value: CmsImage | null | undefined): InsightImage | undefined {
  const mapped = image(value);
  if (!mapped) return undefined;
  return {
    src: mapped.src,
    alt: mapped.alt,
    ...(mapped.width && mapped.height ? { width: mapped.width, height: mapped.height } : {}),
    ...(mapped.sources ? { sources: [...mapped.sources] } : {}),
    ...(mapped.kind ? { kind: mapped.kind as InsightImage['kind'] } : {}),
  };
}

function taxonomy(label: Label): InsightTaxonomy | undefined {
  const name = text(label.name);
  return name ? { documentId: label.documentId, name } : undefined;
}

/**
 * One Resource as the hub's card: the card copy the Resource authors for listings (its `thumbnail`),
 * else its own title and description; its type from the Resource Type it is filed under; its date the
 * listing date, else the publication date, unless the Resource omits it.
 */
function mapResource(resource: CmsListingResource): InsightResource | undefined {
  const typeSlug = text(resource.resourceType?.slug);
  const kind = typeSlug ? KINDS[typeSlug] : undefined;
  const title = text(resource.thumbnail?.title) ?? text(resource.title);
  const slug = text(resource.slug);
  if (!kind || !title || !slug) {
    warn(
      `Resource ${resource.documentId} has no title, slug or known Resource Type; not listed`,
    );
    return undefined;
  }
  if (resource.routePath && resource.routePath !== blogPath(slug))
    warn(`Resource ${slug} reports route ${resource.routePath}`);
  const cover = insightImage(resource.thumbnail?.image);
  const scene = articleScene(resource.thumbnail?.scene) ?? COVER_SCENES[slug];
  const filed = [
    ...rows(resource.topics),
    ...(resource.stage ? [resource.stage] : []),
    ...rows(resource.industries),
  ].flatMap((label) => taxonomy(label) ?? []);
  const publishedAt = resource.omitListingDate
    ? undefined
    : (text(resource.listingDate) ?? text(resource.publicationDate));
  const readingTime = resource.thumbnail?.omitReadingTime
    ? undefined
    : (text(resource.thumbnail?.readingTime) ?? text(resource.readingTime));
  const startsAt = text(resource.eventListing?.startsAt);
  const place = text(resource.eventListing?.place);
  if (kind === 'event' && !startsAt) warn(`event ${slug} has no start date`);
  return {
    documentId: resource.documentId,
    kind,
    title,
    slug,
    description: text(resource.thumbnail?.description) ?? text(resource.description) ?? '',
    ...(cover ? { image: cover } : {}),
    ...(!cover && scene ? { coverScene: scene } : {}),
    ...(readingTime ? { readingTime } : {}),
    ...(kind === 'event' && startsAt
      ? { event: { startsAt, ...(place ? { place } : {}) } }
      : {}),
    tags: [],
    categories: filed,
    filterIds: [...new Set(filed.map((item) => item.documentId))],
    ...(publishedAt ? { publishedAt } : {}),
  };
}

/** Every Resource the Resource Index relates, in the editor's order, read page by page. */
async function indexResources(index: CmsResourceIndex): Promise<CmsListingResource[]> {
  const records = [...rows(index.resources)];
  let page = records.length;
  while (page === RESOURCE_PAGE_SIZE) {
    const start = records.length;
    const { resourceListing } = await publicGraphql<{
      resourceListing: { content: Entries<CmsListingSection> } | null;
    }>(resourceIndexPageQuery(start), 'PublishedResourceIndexPage');
    const same = rows(resourceListing?.content).find(
      (section): section is CmsResourceIndex =>
        section.__typename === 'ComponentListingResourceIndex' &&
        (section as CmsResourceIndex).id === index.id,
    );
    if (!same)
      throw new Error(`New CMS ${ROUTES.insights}: Resource Index ${index.id} vanished`);
    const next = rows(same.resources);
    records.push(...next);
    page = next.length;
  }
  return records;
}

/** The format cards: each Resource Type the listed pieces are filed under, named as the CMS names it. */
function formatCards(resources: readonly CmsListingResource[]): InsightFormatCard[] {
  const types = new Map<string, InsightFormatCard>();
  for (const resource of resources) {
    const type = resource.resourceType;
    const slug = text(type?.slug);
    const title = text(type?.name);
    const kind = slug ? KINDS[slug] : undefined;
    if (!type || !title || !kind || types.has(type.documentId)) continue;
    types.set(type.documentId, { id: type.documentId, title, kind });
  }
  return [...types.values()];
}

function filterGroups(resources: readonly CmsListingResource[]): InsightFilterGroup[] {
  return GROUPS.map((group) => {
    const counts = new Map<string, { name: string; count: number }>();
    for (const resource of resources) {
      for (const label of group.of(resource)) {
        const name = text(label.name);
        if (!name) continue;
        const seen = counts.get(label.documentId);
        counts.set(label.documentId, { name, count: (seen?.count ?? 0) + 1 });
      }
    }
    return {
      id: group.id,
      label: group.label,
      options: [...counts.entries()]
        .sort(([, a], [, b]) => b.count - a.count || a.name.localeCompare(b.name))
        .map(([id, { name }]) => ({ id, name, kind: 'category' as const })),
    };
  });
}

function ctaAction(cta: CmsCta): InsightAction | undefined {
  const mapped = action(cta.button);
  return mapped
    ? { label: mapped.label, href: mapped.href, external: cta.button?.isExternal === true }
    : undefined;
}

/** A CTA as the hub's lab offer or close: its words, its button, its illustration. */
function ctaCopy(cta: CmsCta) {
  const heading = text(cta.heading);
  if (!heading) {
    warn(`CTA ${cta.id} has no heading; not shown`);
    return undefined;
  }
  const act = ctaAction(cta);
  const picture = insightImage(cta.media);
  return {
    id: text(cta.anchorId) ?? `insights-cta-${cta.id}`,
    heading,
    description: text(cta.description) ?? '',
    ...(act ? { action: act } : {}),
    ...(picture ? { image: picture } : {}),
  };
}

/**
 * The published Resource Listing as the insights hub's view model. The Resource Index supplies the
 * pieces (in the editor's order), their formats and the finder's groups; the last enabled CTA is the
 * page's close, an enabled CTA before it the Lab offer. Words never fall back.
 */
export const getPublishedResourceListing = cache(async (): Promise<InsightsPage | null> => {
  const { resourceListing } = await publicGraphql<{
    resourceListing: CmsResourceListing | null;
  }>(PUBLISHED_RESOURCE_LISTING_QUERY, 'PublishedResourceListing');
  if (!resourceListing) return null;
  if (resourceListing.routePath !== ROUTES.insights) {
    throw new Error(
      `New CMS ${ROUTES.insights}: published entry reports route ${resourceListing.routePath}`,
    );
  }
  const heading = text(resourceListing.hero?.title);
  if (!heading)
    throw new Error(`New CMS ${ROUTES.insights}: published entry has no hero title`);

  const sections = rows(resourceListing.content);
  const indexes = sections.filter(
    (section): section is CmsResourceIndex =>
      section.__typename === 'ComponentListingResourceIndex',
  );
  if (indexes.length > 1) warn(`${indexes.length} Resource Indexes; only the first is listed`);
  const [index] = indexes;
  if (!index) warn('no Resource Index; nothing is listed');
  for (const section of sections) {
    if (
      section.__typename !== 'ComponentListingResourceIndex' &&
      section.__typename !== 'ComponentSharedCta'
    )
      warn(`${section.__typename} has no place on the insights hub; not shown`);
  }

  const records = index ? await indexResources(index) : [];
  const unique = [...new Map(records.map((record) => [record.documentId, record])).values()];
  if (unique.length < records.length) warn('the Resource Index relates a Resource twice');

  const ctas = sections.filter(
    (section): section is CmsCta =>
      section.__typename === 'ComponentSharedCta' && (section as CmsCta).isEnabled !== false,
  );
  const close = ctas.at(-1);
  const offer = ctas.length > 1 ? ctas[0] : undefined;
  const closing = close ? ctaCopy(close) : undefined;
  const lab = offer ? ctaCopy(offer) : undefined;

  return {
    documentId: resourceListing.documentId,
    slug: ROUTES.insights.slice(1),
    hero: { heading, description: text(resourceListing.hero?.description) ?? '' },
    formatCards: formatCards(unique),
    ...(lab ? { lab } : {}),
    resources: {
      id: index ? `insights-resources-${index.id}` : 'insights-resources',
      heading: '',
      filters: filterGroups(unique),
      items: unique.flatMap((record) => mapResource(record) ?? []),
    },
    ...(closing ? { closing } : {}),
  };
});
