import type { MediaImage } from '@/components';
import type { CorpusBlock } from '@/lib/corpus-types';
import type { InlineRun } from '@/lib/inline';
import type { SketchName } from '@/lib/sketches';
import type { LogoGridMark } from '@/patterns';

import type { HomeAction, HomeHero, HomeSection } from './published-home-model';

/**
 * A Service detail page as the new CMS publishes it (`/services/{slug}`): the fixed hero, then every
 * Page Content section in the editor's saved order. Free-form words (Markdown prose, tables, labelled
 * lines, links) arrive as the corpus's own block model, so they render through the same band body as
 * the corpus pages did; everything structured arrives as fields.
 */

type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};

/** A drawing the CMS selected: a registered Sketch scene, or an uploaded image. */
export type ServiceArt = { scene?: SketchName; image?: MediaImage };

export type ServiceOfferCard = {
  id: string;
  title: string;
  body?: string;
  bodyHtml?: string;
  /** The card as a labelled line in the corpus block model, for a set with no slot of its own. */
  blocks: CorpusBlock[];
  scene?: SketchName;
};

export type ServiceClaim = {
  title: string;
  /** The claim's words, in order: paragraphs, and a table or list in place. */
  blocks: CorpusBlock[];
  /** The claim's proof as authored ("Example: … [Read the … case](…)"). */
  example?: InlineRun[];
  art?: ServiceArt;
};

export type ServiceTile = {
  id: string;
  title: string;
  body?: string;
  href?: string;
  art?: ServiceArt;
  /** Two-grid: the tile's second area. */
  detail?: { label: string; text: string; action?: string };
};

export type ServiceWhyCard = {
  id: string;
  title: string;
  variant: 'illustration' | 'media';
  /** The upload the card's own variant selects; the other upload is ignored. */
  image?: MediaImage;
  /** The card's points, in order, joined into its one paragraph. */
  body: string;
};

export type ServiceCaseCard = {
  id: string;
  title: string;
  eyebrow?: string;
  body?: string;
  /** Inline HTML, one entry per paragraph (the card sets each in its own paragraph). */
  bodyHtml?: string[];
  href?: string;
  ctaLabel?: string;
  image?: MediaImage;
};

export type PublishedServiceSection =
  | Extract<HomeSection, { type: 'testimonials' | 'engagement' | 'industries' | 'faq' | 'cta' }>
  | (Head & { type: 'cases'; lead?: string; action?: HomeAction; cards: ServiceCaseCard[] })
  | (Head & {
      type: 'offer';
      presentation: 'illustrated' | 'plain' | 'read_down' | 'catalogue';
      lead?: string;
      before: CorpusBlock[];
      after: CorpusBlock[];
      /** `column` cards: the deliverables, in order. */
      columns: ServiceOfferCard[];
      /** `row` cards: the parts (who does the work, what we need, where we stop), in order. */
      rows: ServiceOfferCard[];
    })
  | (Head & {
      type: 'claims';
      layout: 'tabs' | 'page';
      lead?: string;
      before: CorpusBlock[];
      after: CorpusBlock[];
      claims: ServiceClaim[];
    })
  | (Head & {
      type: 'service-cards';
      variant: 'single' | 'two';
      lead?: string;
      before: CorpusBlock[];
      after: CorpusBlock[];
      tiles: ServiceTile[];
      routes: { question?: string; answer?: string; actions: HomeAction[] }[];
    })
  | (Head & {
      type: 'stages';
      lead?: string;
      art?: ServiceArt;
      before: CorpusBlock[];
      after: CorpusBlock[];
      stages: { title: string; body?: string; bodyHtml?: string[] }[];
    })
  | (Head & { type: 'why'; action?: HomeAction; cards: ServiceWhyCard[] })
  | (Head & {
      type: 'flow';
      /** comparison: a table band. editorial: a prose band, with its photograph when it has one. */
      kind: 'comparison' | 'editorial';
      lead?: string;
      blocks: CorpusBlock[];
      media?: { image: MediaImage; side?: 'start' | 'end' };
    })
  | (Head & {
      type: 'illustrated';
      presentation: 'grid' | 'ledger' | 'agreement';
      lead?: string;
      legend?: string;
      art?: ServiceArt;
      before: CorpusBlock[];
      after: CorpusBlock[];
      entries: {
        id: string;
        title: string;
        bodyHtml?: string;
        href?: string;
        art?: ServiceArt;
        detail?: { label: string; html?: string };
      }[];
    })
  | (Head & { type: 'clients'; marks: LogoGridMark[] });

export type PublishedServicePage = {
  slug: string;
  route: string;
  /** The entry's internal name, for the trail's leaf where the hero carries no breadcrumbs. */
  name: string;
  hero: HomeHero;
  sections: PublishedServiceSection[];
};
