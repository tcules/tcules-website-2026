export const PUBLISHED_CASESTUDYCARDS = `
      ... on ComponentSharedCaseStudyCards {
        id heading anchorId description casesSurface: surface casesSide: mediaSide casePresentation: presentation
        action { ...PublishedAction }
        cards { title eyebrow description descriptionRich showCta ctaText resolved
          image { ...PublishedImage }
          caseStudy { documentId title slug }
        }
      }
`;

export const PUBLISHED_TESTIMONIALSECTION = `
      ... on ComponentSharedTestimonialSection {
        id heading anchorId voicesSurface: surface voicesSide: mediaSide testimonialPresentation: presentation avatarPolicy
        testimonials { documentId name role company quoteHtml rating ratingIsPlaceholder avatarIsPlaceholder avatar { url alternativeText width height formats } }
        rating { ...PublishedRating }
      }
`;

export const PUBLISHED_ENGAGEMENTOPTIONS = `
      ... on ComponentSharedEngagementOptions {
        id heading anchorId engagementSurface: surface engagementSide: mediaSide engagementDescription: description engagementPresentation: presentation
        action { ...PublishedAction }
        options { id title eyebrow focused body icon scope anchorId facts { title body } illustration { source scene image { ...PublishedImage } }
          checklist { body } action { ...PublishedAction } }
        terms { body }
        closing { heading body actions { ...PublishedAction } proof { eyebrow card { resolved } } }
      }
`;

export const PUBLISHED_FAQSECTION = `
      ... on ComponentSharedFaqSection {
        id heading anchorId eyebrow description faqSurface: surface faqSide: mediaSide navigationLabel
        faqs { documentId question answer isActive }
      }
`;

/* The overhaul's three bands (CMS tcules-cms-2026#3): Stages, the first-call chat and the free tools. */
export const PUBLISHED_PRODUCTSTAGES = `
      ... on ComponentSharedProductStages {
        id heading anchorId description stagesSurface: surface
        action { ...PublishedAction }
        stages { id title line body drawing link { ...PublishedAction } }
        closingLine closingAction { ...PublishedAction }
      }
`;

export const PUBLISHED_CHATTHREAD = `
      ... on ComponentSharedChatThread {
        id heading anchorId description chatSurface: surface note
        action { ...PublishedAction }
        exchanges { id client reply }
      }
`;

export const PUBLISHED_FREETOOLS = `
      ... on ComponentSharedFreeTools {
        id heading anchorId description toolsSurface: surface
        toolCards: cards { id resolved }
      }
`;

export const PUBLISHED_CTA = `
      ... on ComponentSharedCta {
        id heading anchorId eyebrow description descriptionRich disclaimer ctaSurface: surface ctaSide: mediaSide isEnabled ctaType ctaPresentation: presentation island
        form { variant submitLabel caption urlLabel scheduleHref successHeading successBody replyLabel successSteps { label detail } }
        points { text } contactLinks { key value href }
        ctaQuote: quote { kind testimonial { name role company quoteHtml shortQuote } }
        button { ...PublishedAction } secondaryButton { ...PublishedAction }
        media { ...PublishedImage }
        rating { ...PublishedRating }
      }
`;

export const PUBLISHED_HERO = `
    hero {
      title eyebrow description secondaryDescription arrangement
      additionalParagraphs { text }
      breadcrumbs { label href }
      actions { ...PublishedAction }
      actionsNote tags { text } stats { label body }
      scene { scene title }
      media { ...PublishedImage }
      illustration { source scene image { ...PublishedImage } }
      clip { title description wide { sources { url mime } poster { url } } tall { sources { url mime } poster { url } } }
      recognition {
        title anchorId gridDensity: density
        namedClients { documentId name }
        clients { documentId name density media { url width height alternativeText } }
        markOverrides { client { documentId } media { url width height alternativeText } density width height }
      }
    }
`;

export const PUBLISHED_FIELDS = `
fragment PublishedAction on ComponentSharedCtaButton {
  name href description icon isExternal
}
fragment PublishedRating on ComponentNavigationRating {
  score platform mark href detail
}

fragment PublishedImage on ComponentContentImage {
  altText kind panel shadow focusX focusY toneTemperature toneSaturation
  file { url width height formats alternativeText }
}
`;
