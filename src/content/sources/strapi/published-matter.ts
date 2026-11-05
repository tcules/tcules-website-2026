import { cache } from 'react';
import type { MatterPageModel } from '@/templates/CorpusPage/published-matter-model';
import { image, illustration, mapHero } from './home';
import type { CmsHero, CmsImage, CmsIllustration } from './home-types';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { richTextToHtml } from './rich-text';
import { publicGraphql } from './public-graphql';
import { MATTER_QUERY } from './published-matter-query';
type Section = {
  __typename: string;
  heading: string;
  anchorId: string;
  description?: string;
  sheetPresentation?: string;
  editorialPresentation?: string;
  mediaFit?: string;
  media?: CmsImage;
  cards?: { title: string; description: string; descriptionRich?: string; image?: CmsImage }[];
  listEntries?: { title?: string; body: string }[];
  blocks?: { kind: string; prose?: { body: string } }[];
  singleGridContent?: {
    title: string;
    description: string;
    illustration?: CmsIllustration;
    service?: { documentId: string; slug: string; publishedAt: string };
  }[];
  form?: {
    submitLabel: string;
    caption: string;
    replyLabel: string;
    successHeading: string;
    successBody: string;
  };
  faqs?: {
    documentId: string;
    question: string;
    answer: unknown;
    isActive: boolean;
    publishedAt: string;
  }[];
};
export type MatterRecord = { hero: CmsHero & { mobileMedia?: CmsImage }; content: Section[] };
export function mapMatter(page: MatterRecord | null): MatterPageModel | null {
  if (!page) return null;
  const hero = mapHero(page.hero);
  if (!hero) throw Error('Missing Matter hero');
  const main = image(page.hero.media),
    mobile = image(page.hero.mobileMedia);
  if (main)
    hero.media = {
      type: 'image',
      image: main,
      phone: mobile
        ? { src: mobile.src, width: mobile.width, height: mobile.height }
        : undefined,
    };
  return {
    hero,
    sections: page.content.map((section, index) => ({
      key: section.anchorId ?? String(index),
      type: section.__typename,
      heading: section.heading,
      id: section.anchorId,
      headingId: section.anchorId + '-heading',
      presentation: section.sheetPresentation ?? section.editorialPresentation,
      description: section.description,
      items:
        section.sheetPresentation === 'split_list'
          ? (section.listEntries ?? []).map((item) => ({
              title: item.title,
              bodyHtml: markdownInlineToHtml(item.body),
            }))
          : (section.cards ?? []).map((item) => ({
              title: item.title,
              body: item.description,
              image: image(item.image),
            })),
      blocks: (section.blocks ?? []).map((block) => {
        if (block.kind !== 'prose') throw Error('Unsupported Matter flow');
        return markdownToHtml(block.prose?.body, 'Matter');
      }),
      art: image(section.media),
      services: (section.singleGridContent ?? []).map((item, i) => {
        if (!item.service?.publishedAt) throw Error('Unpublished Matter service');
        const art = illustration(item.illustration);
        return {
          id: item.service.documentId ?? String(i),
          title: item.title,
          body: item.description,
          href: '/services/' + item.service.slug,
          scene: art?.scene,
        };
      }),
      form: section.form,
      faqs: (section.faqs ?? [])
        .filter((f) => f.isActive && f.publishedAt)
        .map((f) => ({
          id: f.documentId,
          question: f.question,
          answerHtml: richTextToHtml(f.answer, 'Matter FAQ'),
        })),
    })),
  };
}
export const getPublishedMatter = cache(async () =>
  mapMatter(
    (await publicGraphql<{ page: MatterRecord | null }>(MATTER_QUERY, 'PublishedMatter')).page,
  ),
);
