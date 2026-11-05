import { cache } from 'react';

import { glossaryPath, ROUTES } from '@/lib/routes';
import type {
  ListingClosing,
  PublishedGlossaryGroup,
  PublishedGlossaryLead,
  PublishedGlossaryTerm,
} from '@/templates';
import type { HomeSection } from '@/templates/CorpusPage/published-home-model';

import { mapBand, mapHero, rows, text } from './home';
import type { CmsHero, CmsHomeSection, Entries } from './home-types';
import { markdownToHtml } from './markdown';
import { PUBLISHED_GLOSSARY_MASTER_QUERY } from './published-glossary-master-query';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;

type EditorialSection = {
  __typename: 'ComponentSharedEditorialSection';
  id: string;
  heading: Text;
  anchorId: Text;
  navigationLabel: Text;
  editorialPresentation: 'text' | 'media' | null;
  blocks: Entries<{ id: string; kind: string; prose?: { body: Text } | null }>;
};

type TermGroupSection = {
  __typename: 'ComponentGlossaryTermGroup';
  id: string;
  groupHeading: Text;
  groupAnchorId: Text;
  groupLabel: Text;
  groupNote: Text;
  groupTerms: Entries<{
    id: string;
    titleOverride: Text;
    definitionOverride: Text;
    term: {
      documentId: string;
      term: Text;
      slug: Text;
      listingDefinition: Text;
    } | null;
  }>;
};

type CmsGlossaryMaster = {
  documentId: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<EditorialSection | TermGroupSection | CmsHomeSection>;
};

function warn(message: string) {
  console.warn(`New CMS ${ROUTES.glossary}: ${message}`);
}

function html(markdown: Text, context: string): string | undefined {
  try {
    return markdownToHtml(markdown, context) || undefined;
  } catch (error) {
    warn(`${context}: ${error instanceof Error ? error.message : 'unreadable Markdown'}`);
    return undefined;
  }
}

/** The editorial section that opens the listing: its prose blocks, in saved order. */
function mapLead(section: EditorialSection): PublishedGlossaryLead | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading`);
    return;
  }
  if (section.editorialPresentation === 'media')
    warn(`${key} is a media presentation; the listing lead renders its words only`);
  const body = rows(section.blocks)
    .flatMap((block) => {
      if (block.kind !== 'prose') {
        warn(`${key} block ${block.id} is an unsupported ${block.kind} block`);
        return [];
      }
      return html(block.prose?.body, `${key} block ${block.id}`) ?? [];
    })
    .join('');
  if (!body) {
    warn(`${key} has no prose`);
    return;
  }
  return { id: text(section.anchorId) ?? key, heading, html: body };
}

/** A term group: its terms through the Glossary relation, in relation order. */
function mapGroup(section: TermGroupSection): PublishedGlossaryGroup | undefined {
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.groupHeading);
  if (!heading) {
    warn(`${key} has no heading`);
    return;
  }
  const terms = rows(section.groupTerms).flatMap<PublishedGlossaryTerm>((entry) => {
    const related = entry.term;
    const slug = text(related?.slug);
    if (!related || !slug) {
      warn(`${key} term ${entry.id} has no published Glossary relation`);
      return [];
    }
    const title = text(entry.titleOverride) ?? text(related.term);
    if (!title) {
      warn(`${key} term ${related.documentId} has no title`);
      return [];
    }
    const definition = text(entry.definitionOverride) ?? text(related.listingDefinition);
    if (!definition) warn(`${key} term "${title}" has no listing definition`);
    return [{ key: related.documentId, title, definition, href: glossaryPath(slug) }];
  });
  if (!terms.length) {
    warn(`${key} has no published terms`);
    return;
  }
  return {
    id: text(section.groupAnchorId) ?? key,
    heading,
    railLabel: text(section.groupLabel),
    terms,
    noteHtml: html(section.groupNote, `${key} note`),
  };
}

/**
 * The CTA after the term groups becomes the listing's close when ListingClose can show it as
 * authored: a button CTA with one action and nothing else beside it. Any other CTA renders as its
 * own published band in place, so no authored field is dropped.
 */
function asClosing(band: HomeSection): ListingClosing | undefined {
  if (band.type !== 'cta' || band.variant === 'form' || band.form) return;
  const [first, ...more] = band.actions;
  if (!first || more.length || band.points.length || band.contacts.length || band.image) return;
  if (band.rating || band.footnote || band.leadHtml) return;
  return {
    id: band.id,
    eyebrow: band.eyebrow,
    heading: band.heading,
    body: band.lead,
    action: { label: first.label, href: first.href },
  };
}

export const getPublishedGlossaryMaster = cache(async () => {
  const { glossaryMaster: page } = await publicGraphql<{
    glossaryMaster: CmsGlossaryMaster | null;
  }>(PUBLISHED_GLOSSARY_MASTER_QUERY, 'PublishedGlossaryMaster');
  if (!page) return null;
  if (page.routePath !== ROUTES.glossary)
    throw new Error(`New CMS Glossary Master has unexpected route: ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error('New CMS Glossary Master is missing its hero title');
  // The listing hero is the masthead with the texture: it has no media slot to fill.
  const art = page.hero;
  if (
    art?.media ||
    art?.illustration?.image ||
    art?.illustration?.scene ||
    art?.scene ||
    art?.clip
  )
    warn('hero media is authored but the listing masthead does not render media');

  let lead: PublishedGlossaryLead | undefined;
  const groups: PublishedGlossaryGroup[] = [];
  // Bands in Dynamic Zone order, placed around the listing by where they sit relative to the groups.
  const before: HomeSection[] = [];
  const between: HomeSection[] = [];
  const after: HomeSection[] = [];
  let closing: ListingClosing | undefined;
  let afterClose = false;

  for (const section of rows(page.content)) {
    if (section.__typename === 'ComponentGlossaryTermGroup') {
      const group = mapGroup(section);
      if (group) groups.push(group);
      continue;
    }
    if (section.__typename === 'ComponentSharedEditorialSection') {
      if (!lead && !groups.length) lead = mapLead(section);
      else warn(`editorial section ${section.id} is only supported as the listing lead`);
      continue;
    }
    const band = mapBand(section as CmsHomeSection, ROUTES.glossary);
    if (!band) continue;
    // A close is an ask, so a button CTA with no usable button has nothing to render.
    if (band.type === 'cta' && band.variant !== 'form' && !band.form && !band.actions.length) {
      warn(`CTA ${band.key} has no valid button`);
      continue;
    }
    if (!groups.length) {
      before.push(band);
      continue;
    }
    if (!closing && !afterClose) {
      const close = asClosing(band);
      if (close) {
        closing = close;
        afterClose = true;
        continue;
      }
    }
    (afterClose ? after : between).push(band);
  }

  return { hero, lead, groups, closing, before, between, after };
});
