import {
  PUBLISHED_CASESTUDYCARDS,
  PUBLISHED_CTA,
  PUBLISHED_ENGAGEMENTOPTIONS,
  PUBLISHED_FAQSECTION,
  PUBLISHED_FIELDS,
  PUBLISHED_HERO,
  PUBLISHED_TESTIMONIALSECTION,
} from './published-page-fields';

/**
 * One published Service by its full relative slug (`product-design/ux-research`). The fixed Hero, then
 * every Page Content member of the Service Dynamic Zone, in the order the editor saved. Aliases keep
 * the union's same-named fields of different types apart; they rename nothing in the CMS.
 */
export const PUBLISHED_SERVICE_QUERY = `
query PublishedService($slug: String!) {
  services(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId name slug routePath
${PUBLISHED_HERO}
    content {
      __typename
      ... on ComponentSharedClientGrid {
        id title anchorId clientSurface: surface
        clients { documentId name density media { url width height alternativeText } }
      }
      ... on ComponentSharedServiceCard {
        id heading anchorId description variant serviceSurface: surface
        singleGridContent { id title description href illustration { ...ServiceIllustration } service { slug } }
        twoGridContent {
          id ctaText detail { label body }
          content { id title description href illustration { ...ServiceIllustration } service { slug } }
        }
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
      ... on ComponentSharedWhySection {
        id heading anchorId whySurface: surface cta { ...PublishedAction }
        whyCards: cards {
          id variant title points { text }
          illustration { url width height alternativeText formats }
          media { url width height alternativeText formats }
        }
      }
      ... on ComponentSharedHardPartsSection {
        id heading anchorId description hardSurface: surface hardPartsPresentation: presentation
        before { ...ServiceFlow }
        claims { id title illustration { ...ServiceIllustration } blocks { ...ServiceFlow } example { ...ServiceProof } }
        after { ...ServiceFlow }
      }
      ... on ComponentSharedComparisonSection {
        id heading anchorId description comparisonSurface: surface blocks { ...ServiceFlow }
      }
      ... on ComponentSharedEditorialSection {
        id heading anchorId editorialSurface: surface editorialSide: mediaSide editorialPresentation: presentation
        media { ...PublishedImage } blocks { ...ServiceFlow }
      }
      ... on ComponentSharedIllustratedSection {
        id heading anchorId description illustratedSurface: surface illustratedPresentation: presentation legend
        illustration { ...ServiceIllustration }
        entries { id title body href illustration { ...ServiceIllustration } detail { title body } }
        agreementEntries { id title body }
        before { ...ServiceFlow } after { ...ServiceFlow }
      }
      ... on ComponentSharedIndustryGrid {
        id heading anchorId industrySurface: surface industrySide: mediaSide selectionMode
        action { ...PublishedAction }
        expertises { title expertise { documentId name slug } }
        destinations { title href }
      }
${PUBLISHED_CASESTUDYCARDS}
${PUBLISHED_TESTIMONIALSECTION}
${PUBLISHED_ENGAGEMENTOPTIONS}
${PUBLISHED_FAQSECTION}
${PUBLISHED_CTA}
    }
  }
}

fragment ServiceIllustration on ComponentContentIllustration { source scene image { ...PublishedImage } }
fragment ServiceTable on ComponentContentDataTable { caption columns { heading } rows { heading cells { body } } }
fragment ServiceProof on ComponentContentProofExample { label body link { ...PublishedAction } }
fragment ServiceFlow on ComponentContentFlowBlock {
  id kind
  prose { body }
  table { ...ServiceTable }
  labelled { title body }
  links { links { ...PublishedAction } }
  proof { ...ServiceProof }
  scenario {
    label illustration { ...ServiceIllustration }
    blocks { kind prose { body } table { ...ServiceTable } labelled { title body } links { links { ...PublishedAction } } }
  }
  sequence { heading ordered entries { title body } }
  callout { label body icon }
  ledger { entries { question role } }
}
${PUBLISHED_FIELDS}
`;

/** Every published Service's slug, for static params. */
export const PUBLISHED_SERVICE_SLUGS_QUERY = `
query PublishedServiceSlugs {
  services(status: PUBLISHED, pagination: { limit: 200 }) { slug }
}
`;
