import type { MediaImage } from '@/components';
import type { BentoCta, BentoItem, LogoGridMark } from '@/patterns';

import type { HomeAction, HomeHero, HomeSection } from './published-home-model';

type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};

export type ServicesMasterSection =
  | HomeSection
  | (Head & {
      type: 'clients';
      marks: LogoGridMark[];
      names: string[];
      compact: boolean;
    })
  | (Head & {
      type: 'services';
      lead?: string;
      tracks: 2 | 3 | 4;
      before: string[];
      after: string[];
      cta?: BentoCta;
      items: (BentoItem & { image?: MediaImage })[];
    })
  | (Head & {
      type: 'why';
      action?: HomeAction;
      items: {
        id: string;
        title: string;
        body?: string;
        image?: MediaImage;
      }[];
    });

export type ServicesMasterPage = { hero: HomeHero; sections: ServicesMasterSection[] };
