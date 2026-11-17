import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_CTA,
  PUBLISHED_FAQSECTION,
  PUBLISHED_HERO,
  PUBLISHED_TESTIMONIALSECTION,
} from './published-page-fields';
import { PUBLISHED_WHYSECTION, SHARED_SECTION_FRAGMENTS } from './published-service-query';

/**
 * One published Audit by its slug (`ux-product-audit`): the fixed Hero, then every Page Content member
 * of the Audit Dynamic Zone in the order the editor saved.
 *
 * The Audit zone holds eight of the shared sections plus two of its own, so the shared member list
 * (which names sections this zone cannot hold) is not spread here; GraphQL rejects a fragment on a type
 * outside the union. Measured against the live schema on 5 Nov 2026:
 *
 *   shared     Service Card, Stage, Offer Sheet, Why, Case Study Cards, Testimonials, FAQ, CTA
 *   audit-only Worked Report (the "What the report looks like" sheet), Audit Section (the legacy
 *              block model: rich text, card grids, tables, lists, columns, link groups)
 *
 * A Service Card tile may select an Audit instead of a Service, so the tile reads both relations.
 * Related records (cases, testimonials, FAQs) are read through their relations, never copied.
 */
const AUDIT_SECTION_MEMBERS = `
      ... on ComponentSharedServiceCard {
        id heading anchorId description variant serviceSurface: surface
        singleGridContent { ...AuditDetailTile }
        twoGridContent { id ctaText detail { label body } content { ...AuditDetailTile } }
        closingRoutes { id question answer actions { ...PublishedAction } }
        before { ...ServiceFlow } after { ...ServiceFlow }
      }
      ... on ComponentSharedStageSection {
        id heading anchorId description stageSurface: surface stageSide: mediaSide
        illustration { ...ServiceIllustration }
        stages { id title description descriptionRich }
        before { ...ServiceFlow } after { ...ServiceFlow }
      }
      ... on ComponentSharedOfferSheetSection {
        id heading anchorId description offerSurface: surface offerPresentation: presentation
        offerCards: cards { id variant title description descriptionRich scene }
        before { ...ServiceFlow } after { ...ServiceFlow }
      }
${PUBLISHED_WHYSECTION}
${PUBLISHED_CASESTUDYCARDS}
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_FAQSECTION}
${PUBLISHED_CTA}
      ... on ComponentSharedWorkedReportSection {
        id heading anchorId eyebrow reportSurface: surface scenario interpretation
        reportTable: table { ...ServiceTable }
        reportAction: action { ...PublishedAction }
      }
      ... on ComponentAuditSection {
        id heading anchorId
        blocks {
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
`;

export const PUBLISHED_AUDIT_QUERY = `
query PublishedAudit($slug: String!) {
  audits(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId name slug routePath
${PUBLISHED_HERO}
    content {
      __typename
${AUDIT_SECTION_MEMBERS}
    }
  }
}

fragment AuditDetailTile on ComponentServiceCardTile {
  id title description href
  illustration { ...ServiceIllustration }
  service { slug }
  audit { slug }
}
${SHARED_SECTION_FRAGMENTS}
`;

/** Every published Audit slug, for static params. */
export const PUBLISHED_AUDIT_SLUGS_QUERY = `
query PublishedAuditSlugs {
  audits(status: PUBLISHED, pagination: { limit: 200 }) { slug }
}
`;
