import {
  PUBLISHED_CTA,
  PUBLISHED_FAQSECTION,
  PUBLISHED_FIELDS,
  PUBLISHED_HERO,
} from './published-page-fields';

/**
 * The Glossary Master single type (`/glossary`): the fixed hero, then every `content` Dynamic Zone
 * member in saved order. The zone allows exactly four members (checked against the live API, 5 Nov
 * 2026): editorial section, glossary term group, CTA and FAQ section. Term groups read their terms
 * through the Glossary relation, so the master never repeats a term's own copy; `titleOverride` /
 * `definitionOverride` are the only listing-local words. Term-group fields are aliased because their
 * nullability differs from the same names on the shared fragments.
 */
export const PUBLISHED_GLOSSARY_MASTER_QUERY = `
query PublishedGlossaryMaster {
  glossaryMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedEditorialSection {
        id heading anchorId navigationLabel editorialPresentation: presentation
        blocks { id kind prose { body } }
      }
      ... on ComponentGlossaryTermGroup {
        id groupHeading: heading groupAnchorId: anchorId groupLabel: navigationLabel groupNote: note
        groupTerms: terms {
          id titleOverride definitionOverride
          term { documentId term slug listingDefinition }
        }
      }
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}
${PUBLISHED_FIELDS}
`;
