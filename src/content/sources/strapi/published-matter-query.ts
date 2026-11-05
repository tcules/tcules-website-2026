export const MATTER_QUERY = `query PublishedMatter {
  page:matterDesignSystem(status: PUBLISHED) {
    documentId routePath
    hero {
      title description arrangement
      breadcrumbs { label href }
      actions { name href isExternal }
      media { ...MatterImage }
      mobileMedia { ...MatterImage }
    }
    content {
      __typename
      ... on ComponentSharedOfferSheetSection {
        heading description anchorId sheetPresentation: presentation
        cards { variant title description descriptionRich scene image { ...MatterImage } }
        listEntries { title body icon }
      }
      ... on ComponentSharedEditorialSection {
        heading anchorId editorialPresentation: presentation mediaFit
        media { ...MatterImage }
        blocks { kind prose { body } }
      }
      ... on ComponentSharedServiceCard {
        heading description anchorId variant
        singleGridContent { title description href illustration { source scene image { ...MatterImage } } service { documentId name slug publishedAt } }
      }
      ... on ComponentSharedCta {
        media { ...MatterImage }
        heading description anchorId ctaType ctaPresentation: presentation island
        form { variant submitLabel caption replyLabel urlLabel successHeading successBody }
      }
      ... on ComponentSharedFaqSection {
        heading anchorId faqs { documentId question answer slug isActive publishedAt }
      }
    }
  }
}
fragment MatterImage on ComponentContentImage {
  altText kind panel shadow focusX focusY
  file { documentId url width height alternativeText formats mime }
}
`;
