import { cache } from 'react';

import { authorPath, blogPath } from '@/lib/routes';
import type { ArticleSceneName } from '@/lib/sketches';

import { actionHref, icon, image, mapBand, rows, text } from './home';
import type { CmsHomeSection, CmsImage, Entries } from './home-types';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { markdownInlineToHtml, resolveInPageAnchors, type BodyHeading } from './markdown';
import {
  PUBLISHED_RESOURCE_QUERY,
  RESOURCE_IMAGE_QUERY,
  RESOURCE_VIDEO_QUERY,
} from './published-resource-query';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { resourceMarkdownToHtml } from './resource-markdown';
import { resourceSeo, type ResourceSeo, type ResourceSeoSettings } from './resource-seo';
import { escapeHtml, richTextToHtml } from './rich-text';

type Text = string | null | undefined;
type Relation = { documentId: string; name: Text; slug?: Text };
type TextItem = { text: Text };
type Thumbnail = {
  title: Text;
  description: Text;
  scene: Text;
  readingTime: Text;
  omitReadingTime: boolean | null;
  image: CmsImage | null;
  relatedImage: CmsImage | null;
};
type Author = {
  documentId: string;
  name: Text;
  slug: Text;
  designation: Text;
  description: Text;
  linkedInProfile: Text;
  profilePicture: StrapiUploadFile | null;
};
type RelatedResource = {
  documentId: string;
  slug: string;
  title: Text;
  description: Text;
  publicationDate: Text;
  readingTime: Text;
  resourceType: { name: Text; slug: Text } | null;
  thumbnail: Thumbnail | null;
};
type Faq = Extract<CmsHomeSection, { __typename: 'ComponentSharedFaqSection' }>;
type Cta = Extract<CmsHomeSection, { __typename: 'ComponentSharedCta' }>;
type Block =
  | Faq
  | ({ id: string } & (
      | {
          __typename: 'ComponentContentHeading';
          heading: Text;
          headingAnchor: Text;
          headingNavigation: Text;
        }
      | { __typename: 'ComponentContentMarkdown'; body: Text }
      | { __typename: 'ComponentContentSeparator' }
      | { __typename: 'ComponentContentCallout'; label: Text; body: Text; icon: Text }
      | {
          __typename: 'ComponentContentFigures';
          figures: Entries<{
            id: string;
            anchorId: Text;
            caption: Text;
            label: Text;
            note: Text;
            notes: Entries<TextItem>;
            image: CmsImage | null;
          }>;
        }
      | {
          __typename: 'ComponentContentDataTable';
          caption: Text;
          split: boolean | null;
          columns: Entries<{ heading: Text }>;
          rows: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
        }
    ));

type Resource = RelatedResource & {
  routePath: string;
  eyebrow: Text;
  modificationDate: Text;
  bylineText: Text;
  breadcrumbs: Entries<{ label: Text; href: Text }>;
  additionalParagraphs: Entries<TextItem>;
  banner: { variant: 'image' | 'youtube'; image?: CmsImage | null; youtubeUrl?: Text } | null;
  author: Author | null;
  coAuthors: Entries<Author>;
  industries: Entries<Relation>;
  stage: Relation | null;
  topics: Entries<Relation>;
  expertises: Entries<Relation>;
  keyTakeawaysLabel: Text;
  keyTakeaways: Entries<TextItem>;
  content: Entries<Block>;
  otherResources: {
    id: string;
    heading: Text;
    anchorId: Text;
    description: Text;
    presentation: 'cards' | 'rows' | null;
    surface: 'paper' | 'tint' | null;
    resources: Entries<RelatedResource>;
    items: Entries<{ id: string; resolved: unknown }>;
  } | null;
  cta: Omit<Cta, '__typename'> | null;
  seo: ResourceSeo | null;
};

const KINDS = {
  articles: 'article',
  guides: 'guide',
  videos: 'video',
  research: 'research',
  events: 'event',
} as const;
function resourceKind(value: Text) {
  return Object.entries(KINDS).find(([slug]) => slug === value)?.[1];
}

function scene(value: Text): ArticleSceneName | undefined {
  return value === 'code-review' ||
    value === 'security-checklist' ||
    value === 'prototype-to-production'
    ? value
    : undefined;
}

function youtubeId(value: Text) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return undefined;
    const host = url.hostname.replace(/^(www\.|m\.)/, '');
    const id =
      host === 'youtu.be'
        ? url.pathname.split('/')[1]
        : ['youtube.com', 'youtube-nocookie.com'].includes(host)
          ? (url.searchParams.get('v') ??
            url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1])
          : undefined;
    return id && /^[\w-]{11}$/.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

function mapAuthor(author: Author) {
  const name = text(author.name);
  if (!name) return undefined;
  const href = author.slug ? authorPath(author.slug) : undefined;
  const portrait = mapUploadImage(author.profilePicture, publicGraphqlUrl(), {
    fallbackAlt: name,
  });
  const linkedIn = actionHref(author.linkedInProfile);
  return {
    id: author.documentId,
    name,
    href,
    portrait,
    role: text(author.designation),
    descriptionHtml: author.description
      ? resourceMarkdownToHtml(author.description, `author ${author.documentId}`)
      : undefined,
    linkedIn,
  };
}

function mapBlock(block: Block, path: string, outline: BodyHeading[]) {
  const key = `${block.__typename}-${block.id}`;
  switch (block.__typename) {
    case 'ComponentContentHeading': {
      const heading = text(block.heading);
      if (!heading) break;
      const id = text(block.headingAnchor) ?? key;
      const label = text(block.headingNavigation) ?? heading;
      outline.push({ label, anchorId: id });
      return {
        type: 'heading' as const,
        key,
        id,
        heading,
        html: `<h2 id="${escapeHtml(id)}">${escapeHtml(heading)}</h2>`,
      };
    }
    case 'ComponentContentMarkdown': {
      const html = resourceMarkdownToHtml(block.body, path, { headings: outline });
      return html ? { type: 'prose' as const, key, html } : undefined;
    }
    case 'ComponentContentSeparator':
      return { type: 'prose' as const, key, html: '<hr>' };
    case 'ComponentContentCallout': {
      const html = resourceMarkdownToHtml(block.body, path);
      if (html)
        return {
          type: 'callout' as const,
          key,
          html,
          label: text(block.label),
          icon: icon(block.icon),
        };
      break;
    }
    case 'ComponentContentFigures': {
      const figures = rows(block.figures).flatMap((figure) => {
        const media = image(figure.image);
        if (!media) console.warn(`New CMS ${path}: missing figure ${figure.id} image`);
        const caption = text(figure.caption);
        const label = text(figure.label);
        const note = text(figure.note);
        const notes = rows(figure.notes).flatMap((item) => text(item.text) ?? []);
        return media || caption || label || note || notes.length
          ? [
              {
                id: text(figure.anchorId) ?? `${key}-${figure.id}`,
                image: media,
                caption,
                label,
                note,
                notes,
              },
            ]
          : [];
      });
      return figures.length ? { type: 'figures' as const, key, figures } : undefined;
    }
    case 'ComponentContentDataTable': {
      const [first, ...columns] = rows(block.columns);
      if (!first || !columns.length) break;
      return {
        type: 'table' as const,
        key,
        caption: text(block.caption),
        split: block.split ?? undefined,
        keyColumn: { heading: text(first.heading) ?? '' },
        columns: columns.map((column) => ({ heading: text(column.heading) ?? '' })),
        rows: rows(block.rows).map((row) => ({
          header: text(row.heading) ?? '',
          headerHtml: markdownInlineToHtml(row.heading) || undefined,
          cellsHtml: columns.map((_, index) => markdownInlineToHtml(row.cells?.[index]?.body)),
        })),
      };
    }
    case 'ComponentSharedFaqSection': {
      const items = rows(block.faqs).flatMap((faq) => {
        if (faq.isActive === false || !text(faq.question)) return [];
        const html = richTextToHtml(faq.answer, path);
        return html ? [{ question: faq.question!, answerHtml: html }] : [];
      });
      if (block.heading && block.anchorId && block.navigationLabel)
        outline.push({ label: block.navigationLabel, anchorId: block.anchorId });
      return {
        type: 'faq' as const,
        key,
        id: text(block.anchorId),
        heading: text(block.heading),
        eyebrow: text(block.eyebrow),
        surface: block.faqSurface,
        description: text(block.description),
        items,
      };
    }
  }
  console.warn(`New CMS ${path}: missing or unsupported ${key}`);
}

function relatedItems(section: Resource['otherResources'], current: Resource) {
  const selected = rows(section?.resources);
  if (selected.length > 3)
    console.warn(`New CMS ${current.routePath}: more than three related Resources selected`);
  const seen = new Set([current.documentId]);
  return selected.slice(0, 3).flatMap((item) => {
    const kind = resourceKind(item.resourceType?.slug);
    const title = text(item.thumbnail?.title) ?? text(item.title);
    if (seen.has(item.documentId)) {
      console.warn(
        `New CMS ${current.routePath}: duplicate or self-selected related Resource ${item.slug}`,
      );
      return [];
    }
    seen.add(item.documentId);
    if (!title || !kind) return [];
    return [
      {
        id: item.documentId,
        kind,
        title,
        href: blogPath(item.slug),
        description: text(item.thumbnail?.description) ?? text(item.description),
        cover: image(item.thumbnail?.relatedImage) ?? image(item.thumbnail?.image),
        scene: scene(item.thumbnail?.scene),
        publishedAt: text(item.publicationDate),
        readingTime: item.thumbnail?.omitReadingTime
          ? undefined
          : (text(item.thumbnail?.readingTime) ?? text(item.readingTime)),
      },
    ];
  });
}

export const getPublishedResource = cache(async (slug: string) => {
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug) ||
    /^(?:authors?|events|podcasts)(?:\/|$)/.test(slug)
  )
    return null;
  const { resources, seoSettings } = await publicGraphql<{
    resources: Resource[];
    seoSettings: ResourceSeoSettings | null;
  }>(PUBLISHED_RESOURCE_QUERY, 'PublishedResource', { slug });
  const record = resources.find((entry) => entry.slug === slug);
  const kind = resourceKind(record?.resourceType?.slug);
  if (!record || !kind || kind === 'event') return null;
  if (record.routePath !== blogPath(slug))
    throw new Error(`New CMS Resource ${slug}: unexpected routePath`);
  const title = text(record.title);
  if (!title) throw new Error(`New CMS Resource ${slug}: missing title`);

  let banner = record.banner;
  if (banner) {
    const operation =
      banner.variant === 'youtube' ? 'PublishedResourceVideo' : 'PublishedResourceImage';
    const query = banner.variant === 'youtube' ? RESOURCE_VIDEO_QUERY : RESOURCE_IMAGE_QUERY;
    try {
      const result = await publicGraphql<{ resources: Pick<Resource, 'slug' | 'banner'>[] }>(
        query,
        operation,
        { slug },
      );
      banner = result.resources.find((entry) => entry.slug === slug)?.banner ?? null;
    } catch (error) {
      console.warn(
        `New CMS ${record.routePath}: configured banner media is unavailable`,
        error instanceof Error ? error.message : '',
      );
    }
  }
  const videoId = banner?.variant === 'youtube' ? youtubeId(banner.youtubeUrl) : undefined;
  const media = banner?.variant === 'image' ? image(banner.image) : undefined;
  if (kind === 'video' && !videoId)
    console.warn(`New CMS ${record.routePath}: Video resource has no valid YouTube URL`);

  const authors = [
    ...new Map(
      rows([record.author, ...rows(record.coAuthors)]).map((author) => [
        author.documentId,
        author,
      ]),
    ).values(),
  ].flatMap((author) => mapAuthor(author) ?? []);
  const paragraphs = [
    text(record.description),
    ...rows(record.additionalParagraphs).map((item) => text(item.text)),
  ].filter((value): value is string => Boolean(value));
  const [lead, ...rest] = paragraphs;
  const body: [string, ...string[]] | undefined = lead ? [lead, ...rest] : undefined;
  const outline: BodyHeading[] = [];
  const blocks = resolveInPageAnchors(
    rows(record.content).flatMap((block) => mapBlock(block, record.routePath, outline) ?? []),
  );
  const labels = [
    ...new Set(
      [
        ...rows(record.topics),
        ...rows(record.industries),
        ...rows([record.stage]),
        ...rows(record.expertises),
      ].flatMap((item) => text(item.name) ?? []),
    ),
  ];
  if (record.otherResources && !text(record.otherResources.heading))
    console.warn(`New CMS ${record.routePath}: related Resources heading missing`);
  if (record.otherResources?.items?.length)
    console.warn(
      `New CMS ${record.routePath}: otherResources.items is unavailable to the resource card template`,
    );
  const bylineText = text(record.bylineText);
  const takeaways = rows(record.keyTakeaways).flatMap((item) => text(item.text) ?? []);
  const cta = record.cta
    ? mapBand({ ...record.cta, __typename: 'ComponentSharedCta' })
    : undefined;
  const publicationDate = text(record.publicationDate);
  const modificationDate = text(record.modificationDate);

  return {
    documentId: record.documentId,
    path: record.routePath,
    slug,
    title,
    kind,
    eyebrow: text(record.eyebrow) ?? text(record.resourceType?.name),
    body,
    bannerImage: media,
    heroVideo: videoId ? { type: 'youtube' as const, id: videoId, title } : undefined,
    thumbnail: image(record.thumbnail?.image),
    breadcrumbs: rows(record.breadcrumbs).flatMap((crumb) => {
      const label = text(crumb.label);
      const href = actionHref(crumb.href);
      return label && href ? [{ label, href }] : [];
    }),
    authors,
    labels,
    bylineText,
    dates: publicationDate
      ? {
          published: publicationDate,
          modified: modificationDate !== publicationDate ? modificationDate : undefined,
        }
      : undefined,
    readingTime: text(record.readingTime),
    takeaways: takeaways.length
      ? {
          label: text(record.keyTakeawaysLabel),
          html: `<ul>${takeaways.map((value) => `<li>${escapeHtml(value)}</li>`).join('')}</ul>`,
        }
      : undefined,
    blocks,
    outline,
    related: record.otherResources
      ? {
          heading: text(record.otherResources.heading),
          description: text(record.otherResources.description),
          surface: record.otherResources.surface ?? undefined,
          id: text(record.otherResources.anchorId),
          items: relatedItems(record.otherResources, record),
        }
      : undefined,
    cta: cta?.type === 'cta' ? cta : undefined,
    seo: resourceSeo(
      record.seo,
      seoSettings,
      {
        slug,
        title,
        description: lead,
        publicationDate,
        modificationDate,
      },
      authors,
    ),
  };
});
