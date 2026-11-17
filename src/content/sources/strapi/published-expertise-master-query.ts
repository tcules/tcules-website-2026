import { EXPERTISE_SECTION_MEMBERS } from './expertise-sections';
import { PUBLISHED_HERO } from './published-page-fields';
import { SHARED_SECTION_FRAGMENTS, SHARED_SECTION_MEMBERS } from './published-service-query';

/**
 * The published Expertise Master (`/expertise`): the fixed Hero, then every Page Content member in the
 * editor's order. The grouped directory selects existing Expertise records; their names, routes and
 * preview images are read through that relation (and the CMS's `resolved` placement), never copied.
 */
export const PUBLISHED_EXPERTISE_MASTER_QUERY = `
query PublishedExpertiseMaster {
  expertiseMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
${SHARED_SECTION_MEMBERS}
${EXPERTISE_SECTION_MEMBERS}
    }
  }
}
${SHARED_SECTION_FRAGMENTS}
`;
