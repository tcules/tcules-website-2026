import { cache } from 'react';
import type { CmsHero, CmsImage } from './home-types';
import { action, formUrlLabels, icon, image, mapHero, text } from './home';
import { markdownToHtml, markdownInlineToHtml } from './markdown';
import { richTextToHtml } from './rich-text';
import { publicGraphql } from './public-graphql';
import { CAREERS_QUERY } from './published-careers-query';
type Job = {
  documentId: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  isActive: boolean;
  publishedAt: string;
  choiceValue: string;
};
type Photo = { image: CmsImage; zoom: number };
type Section = {
  __typename: string;
  heading: string;
  anchorId: string;
  media?: CmsImage;
  description?: string;
  descriptionRich?: string;
  body?: string;
  editorialPresentation?: string;
  sheetPresentation?: string;
  blocks?: { kind: string; prose?: { body: string } }[];
  listEntries?: { title?: string; body: string; icon?: string }[];
  action?: Parameters<typeof action>[0];
  closing?: string;
  entries?: { text: string; icon: string }[];
  jobs?: Job[];
  lead?: Photo;
  start?: Photo;
  middle?: Photo;
  middleStart?: Photo;
  middleEnd?: Photo;
  end?: Photo;
  disclaimer?: string;
  form?: {
    formLabel: string;
    submitLabel: string;
    showWork: boolean;
    workLabel: string | null;
    urlLabel: string | null;
    urlRequired: boolean;
    roleListingAnchor: string;
    roleQuestion: string;
    otherRoleLabel: string;
    successHeading: string | null;
    successBody: string | null;
  };
  faqs?: {
    documentId: string;
    question: string;
    answer: unknown;
    isActive: boolean;
    publishedAt: string;
  }[];
};
export type CareersRecord = { hero: CmsHero; content: Section[] };

/* The CMS stores the link field's label as an enum key ("Link_to_the_work"): it resolves to the
   form's own label of that name, as the home adapter reads it. The success view takes the CMS words
   only as a pair; otherwise the form's own thanks stands. */
function careersForm(form: NonNullable<Section['form']>) {
  const urlLabel = formUrlLabels.find(
    (label) =>
      label.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_$/, '') === form.urlLabel ||
      label === form.urlLabel,
  );
  if (form.urlLabel && !urlLabel)
    console.warn(`New CMS /careers: unknown form urlLabel "${form.urlLabel}"`);
  const workLabel = text(form.workLabel);
  if (form.showWork && workLabel && workLabel !== 'What are you working on?')
    console.warn(`New CMS /careers: unsupported form workLabel "${workLabel}"`);
  const successHeading = text(form.successHeading);
  const successBody = text(form.successBody);
  if (!successHeading || !successBody)
    console.warn('New CMS /careers: form success copy missing; the form keeps its own thanks');
  return {
    ...form,
    urlLabel,
    success:
      successHeading && successBody
        ? { heading: successHeading, body: successBody }
        : undefined,
  };
}
export function mapCareers(page: CareersRecord | null) {
  if (!page) return null;
  const hero = mapHero(page.hero);
  if (!hero) throw Error('Careers hero is missing');
  const jobs = page.content
    .flatMap((section) => section.jobs ?? [])
    .filter((job) => job.isActive && job.publishedAt);
  return {
    hero,
    jobs,
    sections: page.content.map((section, index) => {
      const photo = (value: Photo | undefined) =>
        value
          ? {
              image: {
                ...image(value.image)!,
                alt: value.image.altText ?? image(value.image)!.alt,
              },
              focus: { x: value.image.focusX ?? 0.5, y: value.image.focusY ?? 0.5 },
              zoom: value.zoom,
            }
          : undefined;
      return {
        ...section,
        key: section.anchorId ?? String(index),
        headingId: section.anchorId + '-heading',
        art: image(section.media),
        html: markdownToHtml(section.body, 'Careers'),
        descriptionHtml: markdownInlineToHtml(section.descriptionRich ?? section.description),
        blocks: (section.blocks ?? []).map((block) => {
          if (block.kind !== 'prose') throw Error('Unsupported Careers flow');
          return markdownToHtml(block.prose?.body, 'Careers');
        }),
        items: (section.listEntries ?? []).map((entry) => ({
          title: entry.title,
          bodyHtml: markdownInlineToHtml(entry.body),
          icon: icon(entry.icon),
        })),
        action: action(section.action),
        form: section.form && careersForm(section.form),
        closingHtml: markdownToHtml(section.closing, 'Careers'),
        entries: (section.entries ?? []).map((entry) => ({ ...entry, icon: icon(entry.icon) })),
        jobs: (section.jobs ?? []).filter((job) => job.isActive && job.publishedAt),
        photos: {
          lead: photo(section.lead)!,
          start: photo(section.start)!,
          middle: photo(section.middle)!,
          middleStart: photo(section.middleStart)!,
          middleEnd: photo(section.middleEnd)!,
          end: photo(section.end)!,
        },
        faqs: (section.faqs ?? [])
          .filter((faq) => faq.isActive && faq.publishedAt)
          .map((faq) => ({
            id: faq.documentId,
            question: faq.question,
            answerHtml: richTextToHtml(faq.answer, 'Careers FAQ'),
          })),
      };
    }),
  };
}
export type CareersPageModel = NonNullable<ReturnType<typeof mapCareers>>;
export const getPublishedCareers = cache(async () =>
  mapCareers(
    (await publicGraphql<{ page: CareersRecord | null }>(CAREERS_QUERY, 'PublishedCareers'))
      .page,
  ),
);
