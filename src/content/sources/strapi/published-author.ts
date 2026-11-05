import { cache } from 'react';

import { authorPath, blogPath } from '@/lib/routes';
import type { ArticleSceneName } from '@/lib/sketches';

import { COVER_SCENES } from '../cover-scenes';
import { authorSeo, type AuthorSeo } from './author-seo';
import { actionHref, image, mapBand, rows, text } from './home';
import type { CmsHomeSection, CmsImage } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { authorResourcesQuery, PUBLISHED_AUTHOR_QUERY } from './published-author-query';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import type { ResourceSeoSettings } from './resource-seo';

type Text = string | null | undefined;
type Label = { documentId: string; name: Text };
type Resource = {
  documentId: string;
  slug: string;
  routePath: string;
  title: Text;
  description: Text;
  publicationDate: Text;
  listingDate: Text;
  omitListingDate: boolean | null;
  readingTime: Text;
  author: { slug: string } | null;
  coAuthors: { slug: string }[];
  resourceType: { name: Text; slug: string } | null;
  topics: Label[];
  industries: Label[];
  stage: Label | null;
  expertises: Label[];
  thumbnail: {
    title: Text;
    description: Text;
    scene: Text;
    readingTime: Text;
    omitReadingTime: boolean | null;
    image: CmsImage | null;
  } | null;
};
type Author = {
  documentId: string;
  slug: string;
  routePath: string;
  name: Text;
  designation: Text;
  description: Text;
  linkedInProfile: Text;
  profilePicture: StrapiUploadFile | null;
  seo: AuthorSeo | null;
};
type Cta = Extract<CmsHomeSection, { __typename: 'ComponentSharedCta' }>;
const KINDS = {
  articles: 'article',
  guides: 'guide',
  videos: 'video',
  research: 'research',
  events: 'event',
} as const;
function scene(value: Text): ArticleSceneName | undefined {
  return value === 'code-review' ||
    value === 'security-checklist' ||
    value === 'prototype-to-production'
    ? value
    : undefined;
}
const dateOf = (resource: Resource) =>
  text(resource.listingDate) ?? text(resource.publicationDate) ?? '';

async function resourcesFor(slug: string) {
  const records: Resource[] = [];
  let offset = 0;
  while (true) {
    const { resources_connection: result } = await publicGraphql<{
      resources_connection: { nodes: Resource[]; pageInfo: { total: number } };
    }>(authorResourcesQuery(offset), 'PublishedAuthorResources', { slug });
    if (!result || !Number.isSafeInteger(result.pageInfo.total) || result.pageInfo.total < 0)
      throw new Error(`New CMS author ${slug}: invalid resources pagination`);
    if (!result.nodes.length && offset < result.pageInfo.total)
      throw new Error(`New CMS author ${slug}: incomplete resources pagination`);
    records.push(...result.nodes);
    offset += result.nodes.length;
    if (offset >= result.pageInfo.total) break;
  }
  return [...new Map(records.map((resource) => [resource.documentId, resource])).values()].sort(
    (a, b) => dateOf(b).localeCompare(dateOf(a)) || a.slug.localeCompare(b.slug),
  );
}

function mapResource(resource: Resource, slug: string) {
  if (
    resource.author?.slug !== slug &&
    !rows(resource.coAuthors).some((author) => author.slug === slug)
  )
    throw new Error(`New CMS author ${slug}: unrelated Resource ${resource.slug}`);
  const kind = KINDS[resource.resourceType?.slug as keyof typeof KINDS];
  const title = text(resource.thumbnail?.title) ?? text(resource.title);
  if (!kind || !title || resource.routePath !== blogPath(resource.slug))
    throw new Error(`New CMS author ${slug}: invalid Resource ${resource.slug}`);
  const cover = image(resource.thumbnail?.image);
  const readingTime = resource.thumbnail?.omitReadingTime
    ? undefined
    : (text(resource.thumbnail?.readingTime) ?? text(resource.readingTime));
  return {
    id: resource.documentId,
    kind,
    title,
    href: resource.routePath,
    description: text(resource.thumbnail?.description) ?? text(resource.description),
    cover,
    scene: scene(resource.thumbnail?.scene) ?? COVER_SCENES[resource.slug],
    publishedAt: resource.omitListingDate ? undefined : dateOf(resource) || undefined,
    readingTime: kind === 'video' ? undefined : readingTime,
    duration: kind === 'video' ? readingTime?.replace(/\s*read$/i, '').trim() : undefined,
    subject: text(resource.topics[0]?.name),
  };
}

export const getPublishedAuthor = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const data = await publicGraphql<{
    authors: Author[];
    seoSettings: ResourceSeoSettings | null;
    resourceListing: { routePath: string; content: ({ __typename: string } | Cta)[] } | null;
  }>(PUBLISHED_AUTHOR_QUERY, 'PublishedAuthor', { slug });
  const author = data.authors.find((record) => record.slug === slug);
  if (!author) return null;
  const name = text(author.name);
  if (!name || author.routePath !== authorPath(slug))
    throw new Error(`New CMS author ${slug}: missing name or invalid routePath`);
  const resources = await resourcesFor(slug);
  const counts = new Map<string, number>();
  for (const resource of resources) {
    const names = new Set(
      [
        ...rows(resource.topics),
        ...rows(resource.expertises),
        ...rows([resource.stage]),
      ].flatMap((item) => text(item.name) ?? []),
    );
    for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const topics = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
  const role = text(author.designation);
  const bio = text(author.description);
  const image = mapUploadImage(author.profilePicture, publicGraphqlUrl(), {
    fallbackAlt: name,
  });
  const ctas = rows(data.resourceListing?.content).filter(
    (block): block is Cta =>
      block.__typename === 'ComponentSharedCta' && (block as Cta).isEnabled !== false,
  );
  const selected = ctas.at(-1);
  const incompleteForm =
    selected?.ctaType === 'form' &&
    (!text(selected.form?.submitLabel) ||
      !text(selected.form?.successHeading) ||
      !text(selected.form?.successBody));
  if (incompleteForm)
    console.warn(
      `New CMS ${author.routePath}: shared enquiry close omitted; resourceListing CTA ${selected?.id} lacks form.submitLabel, form.successHeading or form.successBody`,
    );
  const mappedClose = selected && !incompleteForm ? mapBand(selected) : undefined;
  const closing = mappedClose?.type === 'cta' ? mappedClose : undefined;
  return {
    documentId: author.documentId,
    slug,
    path: author.routePath,
    name,
    role,
    bio,
    image,
    linkedin: actionHref(author.linkedInProfile),
    topics,
    pieceCount: resources.length,
    pieces: resources.map((resource) => mapResource(resource, slug)),
    closing,
    seo: authorSeo(author.seo, data.seoSettings, {
      slug,
      name,
      role,
      bio,
      portrait: author.profilePicture,
    }),
  };
});
