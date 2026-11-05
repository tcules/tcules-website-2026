import type {
  ExpertiseDirectorySection,
  QuestionLedgerSection,
} from './expertise-sections-model';
import type { HomeHero } from './published-home-model';
import type { PublishedServiceSection } from './published-service-model';

/**
 * An Expertise detail page as the new CMS publishes it (`/expertise/{slug}`): the fixed hero, then
 * every Page Content section in the editor's saved order. The zone holds the same shared sections a
 * Service does, plus the two Expertise-only sections, so each renders through the one component it
 * renders through everywhere else.
 */
export type PublishedExpertiseSection =
  PublishedServiceSection | ExpertiseDirectorySection | QuestionLedgerSection;

export type PublishedExpertisePage = {
  slug: string;
  route: string;
  /** The entry's display name (directory and related cards). The public H1 is the hero's title. */
  name: string;
  kind?: 'product_shape' | 'domain_context';
  hero: HomeHero;
  sections: PublishedExpertiseSection[];
};
