import { cache } from 'react';

import { expertisePath } from '@/lib/routes';
import type {
  PublishedExpertisePage,
  PublishedExpertiseSection,
} from '@/templates/CorpusPage/published-expertise-model';

import {
  mapExpertiseDirectory,
  mapQuestionRoleLedger,
  type CmsExpertiseDirectory,
  type CmsQuestionRoleLedger,
} from './expertise-sections';
import { mapHero, rows, text } from './home';
import type { CmsHero, Entries } from './home-types';
import {
  PUBLISHED_EXPERTISE_QUERY,
  PUBLISHED_EXPERTISE_SLUGS_QUERY,
} from './published-expertise-query';
import { mapSharedSection, type CmsSharedSection } from './published-service';
import { publicGraphql } from './public-graphql';

type CmsExpertiseSection = CmsSharedSection | CmsExpertiseDirectory | CmsQuestionRoleLedger;

type CmsExpertise = {
  documentId: string;
  name: string | null;
  slug: string;
  routePath: string;
  expertiseKind: 'product_shape' | 'domain_context' | null;
  hero: CmsHero | null;
  content: Entries<CmsExpertiseSection>;
};

function mapSection(
  section: CmsExpertiseSection,
  route: string,
): PublishedExpertiseSection | undefined {
  switch (section.__typename) {
    case 'ComponentSharedExpertiseDirectory':
      return mapExpertiseDirectory(section, route);
    case 'ComponentSharedQuestionRoleLedger':
      return mapQuestionRoleLedger(section, route);
    default:
      return mapSharedSection(section, route);
  }
}

/** One segment below /expertise, as the CMS's uid field allows it. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;

/**
 * One published Expertise by slug, or null when no published entry has it (a draft or a missing
 * record is a 404). A CMS failure throws, so the route's error boundary answers rather than a 404.
 */
export const getPublishedExpertise = cache(
  async (slug: string): Promise<PublishedExpertisePage | null> => {
    if (!SLUG.test(slug)) return null;
    const route = expertisePath(slug);
    const { expertises } = await publicGraphql<{ expertises: CmsExpertise[] }>(
      PUBLISHED_EXPERTISE_QUERY,
      'PublishedExpertise',
      { slug },
    );
    const expertise = expertises.find((entry) => entry.slug === slug);
    if (!expertise) return null;
    if (expertise.routePath !== route) {
      throw new Error(`New CMS ${route}: published entry reports route ${expertise.routePath}`);
    }
    const hero = mapHero(expertise.hero);
    if (!hero) throw new Error(`New CMS ${route}: published entry has no hero title`);
    return {
      slug,
      route,
      name: text(expertise.name) ?? hero.title,
      kind: expertise.expertiseKind ?? undefined,
      hero,
      sections: rows(expertise.content).flatMap((section) => mapSection(section, route) ?? []),
    };
  },
);

/** Every published Expertise slug. */
export const listPublishedExpertiseSlugs = cache(async (): Promise<string[]> => {
  const { expertises } = await publicGraphql<{ expertises: { slug: string }[] }>(
    PUBLISHED_EXPERTISE_SLUGS_QUERY,
    'PublishedExpertiseSlugs',
  );
  return expertises.map(({ slug }) => slug).filter((slug) => SLUG.test(slug));
});
