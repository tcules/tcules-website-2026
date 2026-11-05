import { cache } from 'react';

import { ROUTES } from '@/lib/routes';
import type {
  ExpertiseMasterPage,
  ExpertiseMasterSection,
} from '@/templates/CorpusPage/published-expertise-master-model';

import {
  mapExpertiseDirectory,
  mapQuestionRoleLedger,
  type CmsExpertiseDirectory,
  type CmsQuestionRoleLedger,
} from './expertise-sections';
import { mapHero, rows } from './home';
import type { CmsHero, Entries } from './home-types';
import { PUBLISHED_EXPERTISE_MASTER_QUERY } from './published-expertise-master-query';
import { mapSharedSection, type CmsSharedSection } from './published-service';
import { publicGraphql } from './public-graphql';

type CmsExpertiseMasterSection =
  CmsSharedSection | CmsExpertiseDirectory | CmsQuestionRoleLedger;

type CmsExpertiseMaster = {
  documentId: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsExpertiseMasterSection>;
};

function mapSection(section: CmsExpertiseMasterSection): ExpertiseMasterSection | undefined {
  switch (section.__typename) {
    case 'ComponentSharedExpertiseDirectory':
      return mapExpertiseDirectory(section, ROUTES.expertise);
    case 'ComponentSharedQuestionRoleLedger':
      return mapQuestionRoleLedger(section, ROUTES.expertise);
    default:
      return mapSharedSection(section, ROUTES.expertise);
  }
}

/** The published Expertise Master, or null when none is published. */
export const getPublishedExpertiseMaster = cache(
  async (): Promise<ExpertiseMasterPage | null> => {
    const { expertiseMaster } = await publicGraphql<{
      expertiseMaster: CmsExpertiseMaster | null;
    }>(PUBLISHED_EXPERTISE_MASTER_QUERY, 'PublishedExpertiseMaster');
    if (!expertiseMaster) return null;
    if (expertiseMaster.routePath !== ROUTES.expertise) {
      throw new Error(
        `New CMS ${ROUTES.expertise}: published entry reports route ${expertiseMaster.routePath}`,
      );
    }
    const hero = mapHero(expertiseMaster.hero);
    if (!hero)
      throw new Error(`New CMS ${ROUTES.expertise}: published entry has no hero title`);
    return {
      route: ROUTES.expertise,
      hero,
      sections: rows(expertiseMaster.content).flatMap((section) => mapSection(section) ?? []),
    };
  },
);
