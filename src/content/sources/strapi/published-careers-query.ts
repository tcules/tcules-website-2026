export const CAREERS_QUERY = `query PublishedCareers {
  page:careerMaster(status: PUBLISHED) {
    documentId routePath
    hero {
      title description arrangement
      breadcrumbs { label href }
      actions { name href isExternal }
    }
    content {
      __typename
      ... on ComponentSharedCollageSection {
        heading body anchorId
        lead { ...CareerPhoto }
        start { ...CareerPhoto }
        middle { ...CareerPhoto }
        middleStart { ...CareerPhoto }
        middleEnd { ...CareerPhoto }
        end { ...CareerPhoto }
        actions { name href isExternal }
      }
      ... on ComponentSharedEditorialSection {
        heading anchorId editorialPresentation: presentation
        blocks { kind prose { body } links { links { name href } } }
      }
      ... on ComponentSharedOfferSheetSection {
        heading description anchorId sheetPresentation: presentation
        listEntries { title body icon }
        action { name href isExternal }
      }
      ... on ComponentSharedChecklistSection {
        heading anchorId closing entries { text icon }
      }
      ... on ComponentSharedJobListing {
        heading description anchorId
        jobs { documentId title department employmentType location isActive publishedAt choiceValue }
      }
      ... on ComponentSharedCta {
        media { altText kind file {url width height formats alternativeText} }
        heading description descriptionRich disclaimer anchorId ctaType ctaPresentation: presentation
        form {
          variant purpose formLabel submitLabel showWork workLabel urlLabel urlRequired
          roleListingAnchor roleQuestion otherRoleLabel successHeading successBody
        }
      }
      ... on ComponentSharedFaqSection {
        heading anchorId faqs { documentId question answer slug isActive publishedAt }
      }
    }
  }
}
fragment CareerPhoto on ComponentContentCollagePhoto {
  zoom
  image {
    altText kind focusX focusY toneTemperature toneSaturation
    file { documentId url width height alternativeText mime formats }
  }
}
`;
