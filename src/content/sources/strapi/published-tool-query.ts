import { PUBLISHED_HERO } from './published-page-fields';
import { SHARED_SECTION_FRAGMENTS } from './published-service-query';

/* The shared fragments less `PublishedRating`: no member this zone allows reads a rating, and GraphQL
   rejects a document that defines a fragment it never spreads. */
const TOOL_FRAGMENTS = SHARED_SECTION_FRAGMENTS.replace(
  /fragment PublishedRating on [^{]+\{[^}]*\}\n?/u,
  '',
);

/**
 * One published Tool by its slug (`design-system-drift-checker`): the fixed Hero, then every member of
 * the Tool's `content` Dynamic Zone in saved order. The zone allows three members (measured against
 * the live schema, 5 Nov 2026):
 *
 *   article tools   Editorial Section (flow blocks: prose, tables, sequences, the worked example as a
 *                   scenario with its drawing, and a diagram as an `illustration` block in place) and
 *                   the FAQ Section, its questions read through the FAQ relation
 *   sections tools  Audit Section (the legacy block model: rich text, tables, lists, columns, callouts,
 *                   link groups)
 *
 * `presentation` says which. Field names shared by the members with different nullability are aliased.
 * SEO is not on the record: it is the route-keyed SEO Page, read through `getPageSeo`.
 */
export const PUBLISHED_TOOL_QUERY = `
query PublishedTool($slug: String!) {
  tools(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId name slug routePath presentation publishedAt
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedEditorialSection {
        id heading anchorId navigationLabel editorialPresentation: presentation
        media { ...PublishedImage }
        blocks { ...ServiceFlow illustration { ...ServiceIllustration } }
      }
      ... on ComponentSharedFaqSection {
        id heading faqAnchor: anchorId navigationLabel description
        faqs { documentId question answer isActive }
      }
      ... on ComponentAuditSection {
        id heading sectionAnchor: anchorId sectionNavigation: navigationLabel
        sectionBlocks: blocks {
          id kind heading description gridColumns displayStyle
          prose { body }
          callout { label body icon }
          cards { id title description href }
          items { id title body }
          columns { id eyebrow heading body { body } items { id title body } links { ...PublishedAction } }
          table { ...ServiceTable }
          quote { id quote attribution kind }
          links { ...PublishedAction }
        }
      }
    }
  }
}
${TOOL_FRAGMENTS}
`;

/** Every published Tool slug, for static params. */
export const PUBLISHED_TOOL_SLUGS_QUERY = `
query PublishedToolSlugs {
  tools(status: PUBLISHED, pagination: { limit: 200 }) { slug }
}
`;
