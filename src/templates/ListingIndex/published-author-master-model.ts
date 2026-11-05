import type { ProfileCardProps } from '@/patterns/ProfileCard/ProfileCard';
import type { HomeHero, HomeSection } from '@/templates/CorpusPage/published-home-model';

export type AuthorMasterSection =
  | {
      type: 'authors';
      key: string;
      id?: string;
      label: string;
      people: (ProfileCardProps & { slug: string })[];
    }
  | Extract<HomeSection, { type: 'cta' }>;

export type AuthorMasterPage = { hero: HomeHero; sections: AuthorMasterSection[] };
