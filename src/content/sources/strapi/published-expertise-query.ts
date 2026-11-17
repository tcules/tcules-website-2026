import { EXPERTISE_SECTION_MEMBERS } from './expertise-sections';
import { PUBLISHED_HERO } from './published-page-fields';
import { SHARED_SECTION_FRAGMENTS, SHARED_SECTION_MEMBERS } from './published-service-query';

/**
 * One published Expertise by its slug (`healthtech`): the fixed Hero, then every Page Content member
 * of the Expertise Dynamic Zone (the 15 shared sections, the Expertise Directory and the Question Role
 * Ledger) in the order the editor saved. Related records (cases, testimonials, FAQs, industries,
 * services) are read through their relations, never copied.
 */
export const PUBLISHED_EXPERTISE_QUERY = `
query PublishedExpertise($slug: String!) {
  expertises(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId name slug routePath expertiseKind
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

/** Every published Expertise slug, for static params. */
export const PUBLISHED_EXPERTISE_SLUGS_QUERY = `
query PublishedExpertiseSlugs {
  expertises(status: PUBLISHED, pagination: { limit: 200 }) { slug }
}
`;
