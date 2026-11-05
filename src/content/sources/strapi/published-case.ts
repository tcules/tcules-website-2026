import { cache } from 'react';

import { caseStudyPath, ROUTES } from '@/lib/routes';

import { action, actionHref, image, mapBand, mapHero, quoteHtml, rows, text } from './home';
import type { CmsAction, CmsHero, CmsHomeSection, CmsImage, Entries } from './home-types';
import {
  absoluteAssetUrl,
  mapUploadImage,
  positiveDimension,
  type StrapiUploadFile,
} from './image';
import { markdownToHtml, resolveInPageAnchors, type BodyHeading } from './markdown';
import { mapPublishedSeo, type ResolvedSeo } from './page-seo';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { PUBLISHED_CASE_QUERY } from './published-case-query';
import { escapeHtml, richTextToPlainText } from './rich-text';

type Text = string | null | undefined;
type TextItem = { text: Text };
type Relation = { name: Text; documentId: string; slug?: Text };
type CmsCta = Extract<CmsHomeSection, { __typename: 'ComponentSharedCta' }>;

type CmsBlock =
  | CmsCta
  | ({
      id: string;
    } & (
      | {
          __typename: 'ComponentContentHeading';
          heading: Text;
          sectionAnchor: Text;
          navigationLabel: Text;
          presentation: 'section' | 'chapter' | 'closing' | null;
          chapterLabel: Text;
        }
      | { __typename: 'ComponentContentMarkdown'; body: Text }
      | { __typename: 'ComponentContentSeparator' }
      | {
          __typename: 'ComponentContentFigures';
          figures: Entries<{
            id: string;
            anchorId: Text;
            label: Text;
            caption: Text;
            note: Text;
            notes: Entries<TextItem>;
            image: CmsImage | null;
          }>;
        }
      | {
          __typename: 'ComponentContentSteps';
          ordered: boolean | null;
          items: Entries<{ label: Text; body: Text }>;
        }
      | { __typename: 'ComponentContentStatement'; label: Text; text: Text }
      | {
          __typename: 'ComponentContentQuote';
          kind: 'editorial' | 'testimonial' | null;
          quote: Text;
          attribution: Text;
          testimonial: {
            name: Text;
            company: Text;
            role: Text;
            quoteHtml: Text;
            rating: number | null;
            avatar: StrapiUploadFile | null;
          } | null;
        }
      | {
          __typename: 'ComponentContentVideo';
          description: Text;
          autoplay: boolean | null;
          loop: boolean | null;
          video: StrapiUploadFile | null;
          poster: CmsImage | null;
        }
      | {
          __typename: 'ComponentContentEmbed';
          description: Text;
          url: Text;
          height: number | null;
          thumbnail: CmsImage | null;
        }
      | { __typename: 'ComponentContentCode'; code: Text; language: Text }
      | { __typename: 'ComponentContentLink'; action: CmsAction | null }
    ));

type CmsCase = {
  slug: string;
  routePath: string;
  title: Text;
  heroSection: CmsHero | null;
  hero: {
    description: Text;
    problem: Text;
    solution: Text;
    facts: Entries<{ id: string; label: Text; body: unknown }>;
    labels: Entries<TextItem>;
    image: CmsImage | null;
  } | null;
  publishedDate: Text;
  modifiedDate: Text;
  publishedAt: Text;
  updatedAt: Text;
  stage: Relation | null;
  industries: Entries<Relation>;
  services: Entries<Relation>;
  topics: Entries<Relation>;
  content: Entries<CmsBlock>;
  resolvedSeo: ResolvedSeo | null;
};

function anchor(value: Text) {
  const id = text(value);
  return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : undefined;
}

function mapBlock(block: CmsBlock, outline: BodyHeading[], path: string) {
  const key = `${block.__typename}-${block.id}`;
  const warn = (message: string) => console.warn(`New CMS ${path}: ${key} ${message}`);
  switch (block.__typename) {
    case 'ComponentContentHeading': {
      const heading = text(block.heading);
      if (!heading) break;
      return {
        type: 'heading' as const,
        key,
        id: anchor(block.sectionAnchor) ?? key,
        heading,
        label: text(block.navigationLabel) ?? heading,
        presentation: block.presentation ?? 'section',
        chapterLabel: text(block.chapterLabel),
      };
    }
    case 'ComponentContentMarkdown': {
      try {
        const start = outline.length;
        const html = markdownToHtml(block.body, key, { headings: outline });
        if (html) return { type: 'prose' as const, key, html, headings: outline.slice(start) };
      } catch {
        warn('contains embedded Markdown media. Use a dedicated media component.');
      }
      return undefined;
    }
    case 'ComponentContentSeparator':
      return { type: 'separator' as const, key };
    case 'ComponentContentFigures': {
      const figures = rows(block.figures).flatMap((figure) => {
        const media = image(figure.image);
        const caption = text(figure.caption) ?? '';
        const label = text(figure.label);
        const note = text(figure.note);
        const notes = rows(figure.notes).flatMap(({ text: value }) => text(value) ?? []);
        if (!media) warn(`figure ${figure.id} is missing its image`);
        if (!media && !caption && !label && !note && !notes.length) return [];
        return [
          {
            id: anchor(figure.anchorId) ?? `${key}-${figure.id}`,
            image: media,
            caption,
            label,
            note,
            notes,
          },
        ];
      });
      return figures.length ? { type: 'figures' as const, key, figures } : undefined;
    }
    case 'ComponentContentSteps': {
      const items = rows(block.items).flatMap((item) => {
        const label = text(item.label);
        const body = text(item.body);
        return label && body ? [{ label, body }] : [];
      });
      if (items.length)
        return { type: 'steps' as const, key, ordered: block.ordered === true, items };
      break;
    }
    case 'ComponentContentStatement': {
      const body = text(block.text);
      if (body) return { type: 'statement' as const, key, label: text(block.label), body };
      break;
    }
    case 'ComponentContentQuote': {
      if (block.kind === 'testimonial') {
        const quote = block.testimonial;
        const name = text(quote?.name);
        const company = text(quote?.company);
        const html = quoteHtml(quote?.quoteHtml);
        if (name && company && html) {
          return {
            type: 'testimonial' as const,
            key,
            quote: {
              name,
              company,
              quoteHtml: html,
              role: text(quote?.role),
              stars: quote?.rating ?? undefined,
              portrait: mapUploadImage(quote?.avatar, publicGraphqlUrl()),
            },
          };
        }
        break;
      }
      const quote = text(block.quote);
      if (quote)
        return { type: 'quote' as const, key, quote, attribution: text(block.attribution) };
      break;
    }
    case 'ComponentContentVideo': {
      const src = absoluteAssetUrl(block.video?.url, publicGraphqlUrl());
      const mime = text(block.video?.mime);
      const poster = image(block.poster);
      const description = text(block.description);
      if (!src || !mime?.startsWith('video/')) {
        warn('is missing a playable video file');
        return poster || description
          ? { type: 'video' as const, key, description, poster }
          : undefined;
      }
      return {
        type: 'video' as const,
        key,
        description,
        poster,
        video: {
          src,
          mime,
          width: positiveDimension(block.video?.width),
          height: positiveDimension(block.video?.height),
          autoplay: block.autoplay === true,
          loop: block.loop === true,
        },
      };
    }
    case 'ComponentContentEmbed': {
      const href = actionHref(block.url);
      const url = href && /^https?:\/\//i.test(href) ? href : undefined;
      const thumbnail = image(block.thumbnail);
      const description = text(block.description);
      if (!url) warn('is missing a valid embed URL');
      if (url || thumbnail || description) {
        return {
          type: 'embed' as const,
          key,
          url,
          thumbnail,
          description,
          height: positiveDimension(block.height),
        };
      }
      return undefined;
    }
    case 'ComponentContentCode': {
      if (!text(block.code)) break;
      const language = text(block.language);
      const className =
        language && /^[\w-]+$/.test(language) ? ` class="language-${language}"` : '';
      return {
        type: 'prose' as const,
        key,
        headings: [],
        html: `<pre><code${className}>${escapeHtml(block.code ?? '')}</code></pre>`,
      };
    }
    case 'ComponentContentLink': {
      const link = action(block.action);
      if (link) return { type: 'link' as const, key, link };
      break;
    }
    case 'ComponentSharedCta': {
      const section = mapBand(block);
      return section?.type === 'cta' ? { type: 'cta' as const, key, section } : undefined;
    }
  }
  warn('has missing or unsupported content');
}

const dateOnly = (value: Text) => text(value)?.slice(0, 10);
const names = (values: Entries<Relation>) =>
  rows(values).flatMap(({ name }) => text(name) ?? []);

export const getPublishedCaseStudy = cache(async (slug: string) => {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;

  const { caseStudies } = await publicGraphql<{ caseStudies: CmsCase[] }>(
    PUBLISHED_CASE_QUERY,
    'PublishedCaseStudy',
    { slug },
  );
  const record = caseStudies.find((entry) => entry.slug === slug);
  if (!record) return null;

  const path = caseStudyPath(slug);
  if (record.routePath !== path)
    throw new Error(`New CMS case study ${slug}: unexpected route ${record.routePath}`);

  const hero = mapHero(record.heroSection);
  const title = hero?.title ?? text(record.title);
  if (!title) throw new Error(`New CMS case study ${slug}: required title is missing`);
  const description = text(record.hero?.description);
  const legacyImage = image(record.hero?.image);
  const breadcrumbs = hero?.breadcrumbs.length
    ? hero.breadcrumbs
    : [
        { label: 'Home', href: ROUTES.home },
        { label: 'Case studies', href: ROUTES.caseStudies },
        { label: title, href: path },
      ];
  const heroBody = hero?.body ?? (description ? ([description] as const) : undefined);
  const facts = rows(record.hero?.facts).flatMap(({ id, label, body }) => {
    const name = text(label);
    const value = richTextToPlainText(body);
    return name && value ? [{ id, label: name, value }] : [];
  });
  const authoredLabels = [
    ...(hero?.tags ?? []),
    ...rows(record.hero?.labels).flatMap(({ text: value }) => text(value) ?? []),
  ];
  // The detail hero retains its authored classifications. Relations supply labels when absent.
  const labels = [
    ...new Set(
      authoredLabels.length
        ? authoredLabels
        : [
            ...names([record.stage]),
            ...names(record.industries),
            ...names(record.services),
            ...names(record.topics),
          ],
    ),
  ];
  const published = dateOnly(record.publishedDate) ?? dateOnly(record.publishedAt);
  const modified = dateOnly(record.modifiedDate);
  const statements = [
    { id: 'problem', title: 'Problem', body: text(record.hero?.problem) },
    { id: 'solution', title: 'Solution', body: text(record.hero?.solution) },
  ].flatMap(({ body, ...statement }) => (body ? [{ ...statement, body }] : []));

  const outline: BodyHeading[] = [];
  const blocks = resolveInPageAnchors(
    rows(record.content).flatMap((block) => mapBlock(block, outline, path) ?? []),
  );

  return {
    path,
    hero: {
      ...hero,
      title,
      body: heroBody,
      breadcrumbs,
      tags: [],
      actions: hero?.actions ?? [],
      stats: hero?.stats ?? [],
      arrangement: hero?.arrangement ?? ('stacked' as const),
      media:
        hero?.media ??
        (legacyImage ? { type: 'image' as const, image: legacyImage } : undefined),
    },
    details: {
      facts,
      labels,
      dates: published
        ? { published, modified: modified !== published ? modified : undefined }
        : undefined,
    },
    statements,
    blocks,
    seo: mapPublishedSeo(record.resolvedSeo, path, { title, description: heroBody?.[0] }),
  };
});
