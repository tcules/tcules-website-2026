import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_CTA,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_HERO,
  PUBLISHED_TESTIMONIALSECTION,
} from './published-page-fields';
import {
  PUBLISHED_INDUSTRYGRID,
  PUBLISHED_WHYSECTION,
  SHARED_SECTION_FRAGMENTS,
} from './published-service-query';

/**
 * The published Audit Master (`/audits`): the fixed Hero, then every Page Content member in the
 * editor's order. Its zone holds eight of the shared sections (the shared member list names others it
 * cannot hold, so it is not spread here). Audit cards select the existing Audit records; each card's
 * name, route and fallback sentence are read through that relation, never copied.
 */
export const PUBLISHED_AUDIT_MASTER_QUERY = `
query PublishedAuditMaster {
  auditMaster(status: PUBLISHED) {
    documentId routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedServiceCard {
        id heading anchorId description variant columns singleGridPresentation serviceSurface: surface
        singleGridContent { ...AuditTile }
        twoGridContent { id ctaText detail { label body } content { ...AuditTile } }
        closingRoutes { id question answer actions { ...PublishedAction } }
        before { ...ServiceFlow } after { ...ServiceFlow }
      }
${PUBLISHED_WHYSECTION}
${PUBLISHED_INDUSTRYGRID}
${PUBLISHED_CASESTUDYCARDS}
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_ENGAGEMENTOPTIONS}
${PUBLISHED_CTA}
${PUBLISHED_FAQSECTION}
    }
  }
}

fragment AuditTile on ComponentServiceCardTile {
  id title description href ctaText
  illustration { ...ServiceIllustration }
  detail { label body }
  audit { documentId name slug routePath hero { description } }
}
${SHARED_SECTION_FRAGMENTS}
`;
