import type { MediaImage } from '@/components';
import type { IconName } from '@/lib/icon-glyphs';
import type { SketchName } from '@/lib/sketches';
import type {
  BentoItem,
  ContentSectionMedia,
  DataTableProps,
  ProfileCardProps,
} from '@/patterns';

import type { HomeAction, HomeHero, HomeSection } from './published-home-model';

type Heading = { heading: string; headingId: string; id?: string };

export type AboutFlow =
  | { key: string; type: 'prose'; html: string }
  | { key: string; type: 'table'; table: DataTableProps }
  | { key: string; type: 'illustration'; scene?: SketchName; image?: MediaImage };

export type PublishedAboutSection =
  | Extract<HomeSection, { type: 'cases' | 'engagement' | 'testimonials' | 'faq' | 'cta' }>
  | (Heading & {
      type: 'services';
      lead?: string;
      surface?: 'paper' | 'tint';
      tracks?: 2 | 3 | 4;
      items: (BentoItem & { image?: MediaImage })[];
    })
  | (Heading & {
      type: 'audience';
      lead?: string;
      after?: string;
      entries: { key: string; title: string; icon?: IconName }[];
    })
  | { type: 'link-banner'; id?: string; html?: string; action?: HomeAction }
  | (Heading & {
      type: 'people';
      lead?: string;
      profiles: (ProfileCardProps & { key: string })[];
    })
  | (Heading & {
      type: 'editorial' | 'comparison';
      lead?: string;
      surface?: 'paper' | 'tint';
      arrangement?: 'stacked' | 'beside' | 'media';
      media?: ContentSectionMedia;
      blocks: AboutFlow[];
    })
  | (Heading & { type: 'links'; links: HomeAction[] });

export type PublishedAboutPage = {
  hero: HomeHero;
  sections: (PublishedAboutSection & { key: string })[];
};
