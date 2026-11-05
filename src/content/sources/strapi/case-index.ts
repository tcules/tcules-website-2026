import { cache } from 'react';

import { caseStudyPath, ROUTES } from '@/lib/routes';
import type { LogoGridMark } from '@/patterns';
import type { CaseGroup, CaseItem } from '@/templates';

import { CMS_MEDIA_TAG, CMS_REVALIDATE_SECONDS } from './cache';
import { CASE_INDEX_QUERY } from './case-index-query';
import { image, mapBand, mapHero, rows, text } from './home';
import type { CmsHero, CmsHomeSection, CmsImage, Entries } from './home-types';
import { mapUploadImage, positiveDimension } from './image';
import { markdownInlineToHtml } from './markdown';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';

type Text = string | null;
type Taxonomy = { documentId: string; name: Text; slug: Text };
type FilterSource = 'stage' | 'industry' | 'service';

type Thumbnail = {
  title: Text;
  eyebrow: Text;
  description: Text;
  showCta: boolean | null;
  ctaText: Text;
  image: CmsImage | null;
};

type RelatedCase = {
  documentId: string;
  slug: Text;
  title: Text;
  thumbnail: Thumbnail | null;
  stage: Taxonomy | null;
  industries: Entries<Taxonomy>;
  services: Entries<Taxonomy>;
};

type CaseEntry = {
  id: string;
  kind: 'case_study' | 'coming_soon';
  bestFor: { title: Text; body: Text } | null;
  comingSoon: Pick<Thumbnail, 'title' | 'description' | 'image'> | null;
  card: (Thumbnail & { descriptionRich: Text; caseStudy: RelatedCase | null }) | null;
};

type CaseIndex = {
  __typename: 'ComponentListingCaseIndex';
  finder: {
    label: Text;
    railLabel: Text;
    searchLabel: Text;
    emptyText: Text;
    filters: Entries<{
      source: FilterSource;
      label: Text;
      options: Entries<{ label: Text; value: Text } & Record<FilterSource, Taxonomy | null>>;
    }>;
  } | null;
  groups: Entries<{
    id: string;
    heading: Text;
    anchorId: Text;
    stage: Taxonomy | null;
    entries: Entries<CaseEntry>;
  }>;
  cases: Entries<RelatedCase>;
};

type ClientGrid = NonNullable<CmsHero['recognition']> & {
  __typename: 'ComponentSharedClientGrid';
  id: string;
  gridSurface: 'paper' | 'tint' | null;
};

type CmsListing = {
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CaseIndex | ClientGrid | CmsHomeSection>;
};

type Tags = Record<FilterSource, readonly string[]>;
type TaggedCase = CaseItem & { tags: Tags };

const warn = (message: string) => console.warn(`New CMS ${ROUTES.caseStudies}: ${message}`);

// CSS masks require CORS. The CMS's public asset bucket omits that header, so serve
// the original mark bytes inline and keep ClientMark's ink and sizing rules.
const MARK_ASSET_ORIGIN = 'https://pub-03a6bf73987b442ab0a1b4037ec6740c.r2.dev';
const MARK_MAX_BYTES = 128 * 1024;

async function maskSource(src: string): Promise<string | undefined> {
  if (new URL(src).origin !== MARK_ASSET_ORIGIN) return src;
  try {
    const response = await fetch(src, {
      redirect: 'error',
      next: { revalidate: CMS_REVALIDATE_SECONDS, tags: [CMS_MEDIA_TAG] },
      signal: AbortSignal.timeout(4_000),
    });
    const type = response.headers.get('content-type')?.split(';')[0];
    const size = Number(response.headers.get('content-length'));
    if (
      !response.ok ||
      (type !== 'image/svg+xml' && type !== 'image/png') ||
      size <= 0 ||
      size > MARK_MAX_BYTES
    ) {
      await response.body?.cancel();
      return;
    }
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength <= MARK_MAX_BYTES)
      return `data:${type};base64,${Buffer.from(bytes).toString('base64')}`;
  } catch {
    return;
  }
}

async function clientGrid(grid: ClientGrid) {
  const overrides = new Map(
    rows(grid.markOverrides).map((mark) => [mark.client?.documentId, mark]),
  );
  const clients = new Map(rows(grid.clients).map((client) => [client.documentId, client]));
  const names = new Map(
    [...rows(grid.namedClients), ...clients.values()].map((client) => [
      client.documentId,
      client.name,
    ]),
  );
  const marks = await Promise.all(
    [...names].map(async ([id, clientName]): Promise<LogoGridMark | undefined> => {
      const name = text(clientName);
      if (!name) return;
      const client = clients.get(id);
      const override = overrides.get(id);
      const asset =
        mapUploadImage(override?.media, publicGraphqlUrl()) ??
        mapUploadImage(client?.media, publicGraphqlUrl());
      const src = asset ? await maskSource(asset.src) : undefined;
      if (!asset || !src) {
        if (client || override) warn(`client mark for ${name} is missing or unavailable`);
        return { name };
      }
      return {
        name,
        src,
        width: positiveDimension(override?.width) ?? asset.width,
        height: positiveDimension(override?.height) ?? asset.height,
        density: override?.density ?? client?.density ?? undefined,
      };
    }),
  );
  return {
    type: 'clients' as const,
    key: `clients-${grid.id}`,
    id: text(grid.anchorId),
    heading: text(grid.title),
    surface: grid.gridSurface ?? undefined,
    marks: rows(marks),
    compact: grid.gridDensity !== 'standard',
  };
}

function relatedCard(
  record: RelatedCase,
  entry?: CaseEntry,
  featured = false,
  groupStage?: Taxonomy | null,
): TaggedCase | undefined {
  const placement = entry?.card;
  const thumbnail = record.thumbnail;
  const title = text(placement?.title) ?? text(thumbnail?.title) ?? text(record.title);
  const slug = text(record.slug);
  if (!title || !slug) {
    warn(`case ${record.documentId} is missing a title or slug`);
    return;
  }
  const cover = image(placement?.image) ?? image(thumbnail?.image);
  if (!cover) warn(`case ${slug} is missing a usable cover`);
  const rich = markdownInlineToHtml(placement?.descriptionRich);
  const description = text(placement?.description) ?? text(thumbnail?.description) ?? '';
  const showCta = placement?.showCta ?? thumbnail?.showCta;
  const ctaLabel = showCta ? (text(placement?.ctaText) ?? text(thumbnail?.ctaText)) : undefined;
  if (showCta && !ctaLabel) warn(`case ${slug} requests a CTA without a label`);
  const stage = record.stage;
  if (groupStage && stage?.documentId !== groupStage.documentId)
    warn(`case ${slug} has a stage that differs from its listing group`);

  return {
    id: record.documentId,
    href: caseStudyPath(slug),
    title,
    eyebrow: text(placement?.eyebrow) ?? text(thumbnail?.eyebrow),
    description,
    bodyHtml: rich ? [rich] : undefined,
    cover,
    ctaLabel,
    showCta: Boolean(ctaLabel),
    featured,
    tags: {
      stage: stage ? [stage.documentId] : [],
      industry: rows(record.industries).map((industry) => industry.documentId),
      service: rows(record.services).map((service) => service.documentId),
    },
  };
}

function entryCard(
  entry: CaseEntry,
  featured: boolean,
  stage: Taxonomy | null,
): TaggedCase | undefined {
  let item: TaggedCase | undefined;
  const teaser = entry.comingSoon;
  const teaserTitle = text(teaser?.title);
  if (entry.kind === 'case_study' && entry.card?.caseStudy) {
    item = relatedCard(entry.card.caseStudy, entry, featured, stage);
  } else if (entry.kind === 'coming_soon' && teaserTitle) {
    item = {
      id: `coming-soon-${entry.id}`,
      title: teaserTitle,
      description: text(teaser?.description) ?? '',
      cover: image(teaser?.image),
      tags: { stage: stage ? [stage.documentId] : [], industry: [], service: [] },
    };
  }
  if (!item) {
    warn(`entry ${entry.id} is missing its case relationship or coming-soon copy`);
    return;
  }

  const bestFor = markdownInlineToHtml(entry.bestFor?.body);
  if (!bestFor) return item;
  const label = markdownInlineToHtml(entry.bestFor?.title);
  const description =
    item.bodyHtml ?? (item.description ? [markdownInlineToHtml(item.description)] : []);
  return {
    ...item,
    bodyHtml: [...description, label ? `<strong>${label}:</strong> ${bestFor}` : bestFor],
  };
}

function caseIndex(index: CaseIndex) {
  const cases = new Map<string, TaggedCase>();
  const groups = rows(index.groups).flatMap<CaseGroup>((group) => {
    const heading = text(group.heading) ?? text(group.stage?.name);
    if (!heading) {
      warn(`group ${group.id} is missing a heading`);
      return [];
    }
    const items = rows(group.entries).flatMap((entry) => {
      const item = entryCard(entry, group.anchorId === 'featured', group.stage);
      if (!item) return [];
      if (!cases.has(item.id)) cases.set(item.id, item);
      return [item];
    });
    return [{ id: text(group.anchorId) ?? `case-group-${group.id}`, heading, items }];
  });

  // The curated shelves determine the first placements. The finder then includes the
  // remaining related records in their configured order, once per document.
  for (const record of rows(index.cases)) {
    if (cases.has(record.documentId)) continue;
    const item = relatedCard(record);
    if (item) cases.set(item.id, item);
  }

  const finder = index.finder;
  const label = text(finder?.label);
  const railLabel = text(finder?.railLabel);
  const searchLabel = text(finder?.searchLabel);
  if (!label || !railLabel || !searchLabel)
    throw new Error('New CMS case study listing is missing a finder label');

  return {
    groups,
    cases: [...cases.values()],
    finder: {
      label,
      railLabel,
      searchLabel,
      empty: text(finder?.emptyText),
      filters: rows(finder?.filters).flatMap((filter) => {
        const name = filter.source;
        const label = text(filter.label);
        const options = rows(filter.options).flatMap((option) => {
          const taxonomy = option[name];
          const label = text(option.label) ?? text(taxonomy?.name);
          const value = text(option.value) ?? text(taxonomy?.slug);
          if (!taxonomy || !label || !value) {
            warn(`incomplete ${name} filter option`);
            return [];
          }
          return [{ id: taxonomy.documentId, label, value }];
        });
        return label && options.length ? [{ name, label, options }] : [];
      }),
    },
  };
}

export const getPublishedCaseIndex = cache(async () => {
  const { caseStudyListing: page } = await publicGraphql<{
    caseStudyListing: CmsListing | null;
  }>(CASE_INDEX_QUERY, 'PublishedCaseStudyIndex');
  if (!page) return null;
  if (page.routePath !== ROUTES.caseStudies)
    throw new Error(`New CMS case study listing has unexpected route: ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error('New CMS case study listing is missing its hero title');

  type Band = Awaited<ReturnType<typeof clientGrid>> | NonNullable<ReturnType<typeof mapBand>>;
  const before: Band[] = [];
  const after: Band[] = [];
  let listing: ReturnType<typeof caseIndex> | undefined;
  for (const section of rows(page.content)) {
    if (section.__typename === 'ComponentListingCaseIndex') {
      if (listing) warn('multiple case index components');
      else listing = caseIndex(section);
      continue;
    }
    const mapped =
      section.__typename === 'ComponentSharedClientGrid'
        ? await clientGrid(section)
        : mapBand(section, ROUTES.caseStudies);
    if (mapped) (listing ? after : before).push(mapped);
  }
  if (!listing) throw new Error('New CMS case study listing is missing its case index');
  return { hero, listing, before, after };
});
