import { PUBLISHED_FAQSECTION, PUBLISHED_HERO } from './published-page-fields';
import { SHARED_SECTION_FRAGMENTS } from './published-service-query';

/* The shared fragments less `PublishedRating`: no member this zone allows reads a rating, and GraphQL
   rejects a document that defines a fragment it never spreads. */
const TOOLS_MASTER_FRAGMENTS = SHARED_SECTION_FRAGMENTS.replace(
  /fragment PublishedRating on [^{]+\{[^}]*\}\n?/u,
  '',
);

/**
 * The Tool Master single type (`/tools`): the fixed Hero, then every `content` Dynamic Zone member in
 * saved order. The zone allows three members (checked against the live API, 5 Nov 2026): the tool
 * directory, the editorial section and the FAQ section. A directory's groups select existing Tool
 * records; each tool's card words (its hero title, its listing description, call to action and facts)
 * and its drawing are read through that relation, never repeated on the master. Directory fields are
 * aliased where their names collide with the shared fragments' nullability.
 */
export const PUBLISHED_TOOLS_MASTER_QUERY = `
query PublishedToolsMaster {
  toolMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentListingToolDirectory {
        id heading directoryAnchorId: anchorId directoryDescription: description
        groups {
          id groupHeading: heading groupAnchorId: anchorId
          tools {
            id
            tool {
              documentId name slug routePath
              hero { title illustration { ...ServiceIllustration } }
              listing { description ctaText facts { label body } }
            }
          }
          after { ...ServiceFlow }
        }
        after { ...ServiceFlow }
      }
      ... on ComponentSharedEditorialSection {
        id heading anchorId editorialSurface: surface editorialSide: mediaSide editorialPresentation: presentation
        media { ...PublishedImage } blocks { ...ServiceFlow }
      }
${PUBLISHED_FAQSECTION}
    }
  }
}
${TOOLS_MASTER_FRAGMENTS}
`;
