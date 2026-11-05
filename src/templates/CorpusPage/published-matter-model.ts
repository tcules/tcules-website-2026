import type { MediaImage, SectionSurface } from '@/components';
import type { CorpusBlock } from '@/lib/corpus-types';
import type { BentoItem, OfferSheetItem } from '@/patterns';

import type { HomeHero, HomeSection } from './published-home-model';

type Head = { key: string; id?: string; heading: string; headingId: string };

/** One member of the Matter Dynamic Zone, in the editor's order, as the page renders it. */
export type MatterSection =
  | (Head & {
      type: 'offer';
      surface?: SectionSurface;
      /** `grid`: the illustrated cards; `list`: the split list of entries. */
      arrangement: 'grid' | 'list';
      lead?: string;
      items: OfferSheetItem[];
    })
  | (Head & {
      type: 'editorial';
      surface?: SectionSurface;
      side: 'start' | 'end';
      art?: MediaImage;
      /** The body as one Prose column when it is prose throughout (the common case)… */
      html?: string;
      /** …else every flow block in order, for the corpus band body. */
      flow?: CorpusBlock[];
    })
  | (Head & {
      type: 'services';
      surface?: SectionSurface;
      lead?: string;
      items: BentoItem[];
    })
  | Extract<HomeSection, { type: 'cta' | 'faq' }>;

export type MatterPageModel = { hero: HomeHero; sections: MatterSection[] };
