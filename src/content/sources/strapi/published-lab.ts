import { cache } from 'react';
import type { LabPage, LabSection } from '@/templates/CorpusPage/published-lab-model';
import { action, icon, image, illustration, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsIllustration, CmsImage, Entries } from './home-types';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { richTextToHtml } from './rich-text';
import { publicGraphql } from './public-graphql';
import { PUBLISHED_LAB_QUERY, PUBLISHED_LAB_JOIN_QUERY } from './published-lab-query';

type Text = string | null | undefined;
type Stage = { title: Text; description: Text; descriptionRich: Text };
type CmsSection = {
  id: string;
  __typename: string;
  heading: Text;
  description: Text;
  anchorId: Text;
  editorialSurface?: 'paper' | 'tint';
  sheetSurface?: 'paper' | 'tint';
  cardSurface?: 'paper' | 'tint';
  stageSurface?: 'paper' | 'tint';
  faqSurface?: 'paper' | 'tint';
  ctaSurface?: 'paper' | 'tint';
  editorialMediaSide?: 'start' | 'end';
  editorialPresentation: Text;
  sheetPresentation: Text;
  cardPresentation: Text;
  ctaPresentation: Text;
  media?: CmsImage;
  illustration?: CmsIllustration;
  blocks: Entries<{
    kind: Text;
    prose?: { body: Text };
    labelled?: { title: Text; body: Text };
  }>;
  listEntries: Entries<{ title: Text; body: Text; icon: Text }>;
  entries: Entries<{
    title: Text;
    body: Text;
    href: Text;
    actionLabel: Text;
    icon: Text;
    illustration?: CmsIllustration;
  }>;
  stages: Entries<Stage>;
  footer: Text;
  faqs: Entries<{
    documentId: string;
    question: Text;
    answer: unknown;
    isActive: boolean;
    publishedAt: Text;
  }>;
  ctaType: Text;
  disclaimer: Text;
  island?: 'blue' | 'ink';
  button?: CmsAction;
  second?: { anchorId: Text; heading: Text; description: Text; button?: CmsAction };
  form?: {
    variant: Text;
    purpose: Text;
    formLabel: Text;
    workLabel: Text;
    urlLabel: Text;
    urlRequired: boolean;
    writeTo: Text;
    submitLabel: Text;
    caption: Text;
    successHeading: Text;
    successBody: Text;
    nextStepsHeading: Text;
    nextSteps: Entries<Stage>;
  };
};
export type CmsLabPage = { routePath?: Text; hero?: CmsHero; content: Entries<CmsSection> };
const required = (value: Text, context: string) => {
  const result = text(value);
  if (!result) throw Error(`New CMS Lab: missing ${context}`);
  return result;
};
function paragraphs(value: Text): [string] | [string, string] {
  const items = value?.split(/\n\s*\n/).filter(Boolean) ?? [];
  if (items.length === 1) return [items[0]!];
  if (items.length === 2) return [items[0]!, items[1]!];
  throw Error('New CMS Lab: a CTA needs one or two paragraphs');
}
function secondParagraph(value: Text): [string] {
  const items = paragraphs(value);
  if (items.length !== 1) throw Error('New CMS Lab: second ask needs one paragraph');
  return items;
}
function workLabel(value: Text) {
  value = value?.replaceAll('_', ' ');
  if (!value) return undefined;
  if (
    value === 'What are you working on?' ||
    value === 'Your background and why you want to build in FIL'
  )
    return value;
  throw Error('New CMS Lab: unsupported application label');
}
const html = (value: Text) => markdownToHtml(value, 'Lab content');
const variant = (value: Text) => value?.replaceAll('_', '-');

export function mapLabPage(
  page: CmsLabPage | null | undefined,
  route: LabPage['route'],
): LabPage | null {
  if (!page) return null;
  if (page.routePath && page.routePath !== route) throw Error('New CMS Lab: route mismatch');
  const hero = mapHero(page.hero);
  if (!hero) throw Error('New CMS Lab: missing hero');
  const sections: LabSection[] = rows(page.content).map((section) => {
    const key = section.__typename + '-' + section.id,
      id = text(section.anchorId);
    const head = {
      key,
      id,
      heading: required(section.heading, key),
      headingId: `${id ?? key}-heading`,
      surface:
        section.editorialSurface ??
        section.sheetSurface ??
        section.cardSurface ??
        section.stageSurface ??
        section.faqSurface ??
        section.ctaSurface,
    };
    switch (section.__typename) {
      case 'ComponentSharedEditorialSection': {
        const presentation = variant(section.editorialPresentation);
        if (presentation !== 'text' && presentation !== 'media' && presentation !== 'drawing')
          throw Error('New CMS Lab: unsupported editorial');
        return {
          ...head,
          type: 'editorial',
          presentation,
          media: image(section.media),
          side: section.editorialMediaSide,
          art: illustration(section.illustration),
          blocks: rows(section.blocks).map((block) => {
            if (block.kind === 'prose') return { html: html(block.prose?.body) };
            if (block.kind === 'labelled')
              return {
                title: required(block.labelled?.title, key),
                html: markdownInlineToHtml(block.labelled?.body),
              };
            throw Error('New CMS Lab: unsupported flow block ' + block.kind);
          }),
        };
      }
      case 'ComponentSharedOfferSheetSection':
        if (variant(section.sheetPresentation) !== 'split-list')
          throw Error('New CMS Lab: unsupported offer sheet');
        return {
          ...head,
          type: 'split-list',
          lead: text(section.description),
          items: rows(section.listEntries).map((item) => ({
            title: text(item.title),
            bodyHtml: markdownInlineToHtml(item.body),
            icon: icon(item.icon),
          })),
        };
      case 'ComponentSharedIllustratedSection': {
        const presentation = variant(section.cardPresentation);
        if (
          presentation !== 'drawn-tiles' &&
          presentation !== 'covered-cards' &&
          presentation !== 'glyph-tiles'
        )
          throw Error('New CMS Lab: unsupported cards');
        return {
          ...head,
          type: 'cards',
          presentation,
          lead: text(section.description),
          entries: rows(section.entries).map((entry, index) => ({
            id: `${key}-${index}`,
            title: required(entry.title, key),
            html: markdownInlineToHtml(entry.body),
            body: entry.body ?? '',
            href: text(entry.href),
            action: text(entry.actionLabel),
            icon: icon(entry.icon),
            art: illustration(entry.illustration),
          })),
        };
      }
      case 'ComponentSharedStageSection':
        return {
          ...head,
          type: 'stages',
          lead: text(section.description),
          art: illustration(section.illustration),
          stages: rows(section.stages).map((stage) => ({
            title: required(stage.title, key),
            body: stage.description ?? '',
          })),
        };
      case 'ComponentSharedFaqSection':
        return {
          ...head,
          type: 'faq',
          footerHtml: text(section.footer) ? html(section.footer) : undefined,
          items: rows(section.faqs)
            .filter((faq) => faq.isActive && faq.publishedAt)
            .map((faq) => ({
              id: faq.documentId,
              question: required(faq.question, key),
              answerHtml: richTextToHtml(faq.answer, 'Lab FAQ'),
            })),
        };
      case 'ComponentSharedCta': {
        const presentation = variant(section.ctaPresentation),
          form = section.form;
        if (
          presentation !== 'paired-island' &&
          presentation !== 'button-island' &&
          presentation !== 'form-island'
        )
          throw Error('New CMS Lab: unsupported CTA');
        if (
          presentation === 'form-island' &&
          (!form || form.variant !== 'enquiry' || form.purpose !== 'application')
        )
          throw Error('New CMS Lab: invalid application form');
        const secondAction = action(section.second?.button);
        const urlLabel =
          form?.urlLabel === 'Links_to_your_proof_of_work'
            ? 'Links to your proof-of-work'
            : form?.urlLabel;
        if (urlLabel && urlLabel !== 'Links to your proof-of-work')
          throw Error('New CMS Lab: unsupported URL label');
        return {
          ...head,
          type: 'cta',
          presentation,
          body: paragraphs(section.description),
          button: action(section.button),
          media: image(section.media),
          footnote: text(section.disclaimer),
          island: section.island,
          second:
            section.second && secondAction
              ? {
                  id: text(section.second.anchorId),
                  heading: required(section.second.heading, key),
                  body: secondParagraph(section.second.description),
                  action: secondAction,
                }
              : undefined,
          form: form
            ? {
                label: text(form.formLabel),
                workLabel: workLabel(form.workLabel),
                urlLabel: urlLabel ? 'Links to your proof-of-work' : undefined,
                urlRequired: form.urlRequired,
                writeTo: text(form.writeTo),
                submitLabel: text(form.submitLabel),
                caption: text(form.caption),
                success:
                  form.successHeading && form.successBody
                    ? { heading: form.successHeading, body: form.successBody }
                    : undefined,
                nextStepsHeading: text(form.nextStepsHeading),
                nextSteps: rows(form.nextSteps).map((step) => ({
                  label: required(step.title, key),
                  detail: step.description ?? '',
                })),
              }
            : undefined,
        };
      }
      default:
        throw Error('New CMS Lab: unsupported section ' + section.__typename);
    }
  });
  return { route, hero, sections };
}
export const getPublishedLab = cache(async () =>
  mapLabPage(
    (await publicGraphql<{ page: CmsLabPage | null }>(PUBLISHED_LAB_QUERY, 'PublishedLab'))
      .page,
    '/future-interfaces-lab',
  ),
);
export const getPublishedLabJoin = cache(async () =>
  mapLabPage(
    (
      await publicGraphql<{ page: CmsLabPage | null }>(
        PUBLISHED_LAB_JOIN_QUERY,
        'PublishedLabJoin',
      )
    ).page,
    '/future-interfaces-lab/join',
  ),
);
