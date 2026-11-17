import type { HomeHero } from './published-home-model';
import type { PublishedServiceSection } from './published-service-model';
import type {
  ExpertiseDirectorySection,
  QuestionLedgerSection,
} from './expertise-sections-model';

/** The Expertise Master (`/expertise`) as the new CMS publishes it: the hero, then its sections in order. */
export type ExpertiseMasterSection =
  PublishedServiceSection | ExpertiseDirectorySection | QuestionLedgerSection;

export type ExpertiseMasterPage = {
  route: string;
  hero: HomeHero;
  sections: ExpertiseMasterSection[];
};
