const fields = `
fragment LabAction on ComponentSharedCtaButton {
  name href description icon isExternal
}
fragment LabImage on ComponentContentImage {
  altText kind focusX focusY toneTemperature toneSaturation
  file { documentId url alternativeText width height mime formats }
}
fragment LabIllustration on ComponentContentIllustration {
  source scene image { ...LabImage }
}
fragment LabHero on ComponentSharedSharedHeroSection {
  title description secondaryDescription eyebrow arrangement
  breadcrumbs { label href }
  actions { ...LabAction }
  media { ...LabImage }
}
fragment LabEditorial on ComponentSharedEditorialSection {
  id
  heading anchorId editorialSurface: surface editorialMediaSide: mediaSide
  editorialPresentation: presentation
  media { ...LabImage }
  illustration { ...LabIllustration }
  blocks {
    kind
    prose { body }
    labelled { title body }
    links { links { ...LabAction } }
  }
}
fragment LabSheet on ComponentSharedOfferSheetSection {
  id
  heading description anchorId sheetSurface: surface sheetMediaSide: mediaSide
  sheetPresentation: presentation
  cards { variant title description descriptionRich scene icon }
  listEntries { title body icon }
}
fragment LabCards on ComponentSharedIllustratedSection {
  id
  heading description anchorId cardSurface: surface cardMediaSide: mediaSide
  cardPresentation: presentation
  entries {
    title body href actionLabel isExternal icon
    illustration { ...LabIllustration }
  }
}
fragment LabStages on ComponentSharedStageSection {
  id
  heading description anchorId stageSurface: surface stageMediaSide: mediaSide
  stages { title description descriptionRich }
  illustration { ...LabIllustration }
}
fragment LabFaq on ComponentSharedFaqSection {
  id
  heading description anchorId faqSurface: surface footer
  faqs { documentId question answer slug isActive publishedAt }
}
fragment LabCta on ComponentSharedCta {
  id
  heading description eyebrow disclaimer anchorId ctaSurface: surface ctaMediaSide: mediaSide
  ctaType ctaPresentation: presentation island
  media { ...LabImage }
  button { ...LabAction }
  second { heading description anchorId button { ...LabAction } }
  form {
    variant purpose formLabel workLabel urlLabel urlRequired writeTo
    submitLabel caption replyLabel successHeading successBody scheduleHref
    nextStepsHeading nextSteps { title description descriptionRich }
  }
}
`;
const sections = `__typename ...LabEditorial ...LabSheet ...LabCards ...LabFaq ...LabCta`;
// Each route reads independently. A Join outage cannot take the Lab down.
export const PUBLISHED_LAB_QUERY = `query PublishedLab {
  page: futureInterfacesLab(status: PUBLISHED) { documentId routePath hero { ...LabHero } content { ${sections} } }
}${fields.replace(/fragment LabStages[\s\S]*?(?=fragment LabFaq)/, '')}`;
export const PUBLISHED_LAB_JOIN_QUERY = `query PublishedLabJoin {
  page: futureInterfacesLabJoin(status: PUBLISHED) { documentId routePath hero { ...LabHero } content { ${sections} ...LabStages } }
}${fields}`;
