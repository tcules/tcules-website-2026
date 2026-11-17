import { PUBLISHED_FIELDS } from './published-page-fields';

export const PUBLISHED_RESOURCE_QUERY = `
query PublishedResource($slug: String!) {
  resources(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    documentId slug routePath title description eyebrow
    publicationDate modificationDate readingTime bylineText
    additionalParagraphs { text }
    breadcrumbs { label href }
    resourceType { name slug }
    eventListing { startsAt place }
    author { ...ResourceAuthor }
    coAuthors { ...ResourceAuthor }
    industries { documentId name slug }
    stage { documentId name slug }
    topics { documentId name }
    expertises { documentId name slug }
    banner { variant }
    thumbnail {
      title description scene readingTime omitReadingTime
      image { ...PublishedImage }
      relatedImage { ...PublishedImage }
    }
    keyTakeawaysLabel keyTakeaways { text }
    content {
      __typename
      ... on ComponentContentHeading { id heading headingAnchor: anchorId headingNavigation: navigationLabel presentation chapterLabel }
      ... on ComponentContentMarkdown { id body }
      ... on ComponentContentSeparator { id }
      ... on ComponentContentCallout { id label body icon }
      ... on ComponentContentFigures {
        id figures { id anchorId caption label note notes { text } image { ...PublishedImage } }
      }
      ... on ComponentContentDataTable {
        id caption split columns { heading } rows { heading cells { body } }
      }
      ... on ComponentSharedFaqSection {
        id heading anchorId eyebrow description navigationLabel faqSurface: surface
        faqs { documentId question answer isActive }
      }
    }
    otherResources {
      id heading anchorId description presentation surface
      resources(pagination: { limit: 100 }) {
        documentId slug title description publicationDate readingTime
        resourceType { name slug }
        thumbnail {
          title description scene readingTime omitReadingTime
          image { ...PublishedImage } relatedImage { ...PublishedImage }
        }
      }
      items { id resolved }
    }
    cta {
      id heading anchorId eyebrow description descriptionRich disclaimer ctaSurface: surface ctaSide: mediaSide
      isEnabled ctaType ctaPresentation: presentation island
      form { variant submitLabel caption urlLabel scheduleHref successHeading successBody replyLabel successSteps { label detail } }
      points { text } contactLinks { key value href }
      button { ...PublishedAction } secondaryButton { ...PublishedAction }
      media { ...PublishedImage }
      rating { ...PublishedRating }
    }
    seo {
      metaTitle metaDescription canonicalURL robot structuredData focusString
      secondaryKeywords { text }
      openGraph { title description imageAlt type url siteName locale image { url width height alternativeText } }
      twitter { title description imageAlt card siteHandle creatorHandle image { url width height alternativeText } }
      technical { index follow noSnippet noImageIndex maxSnippet maxImagePreview maxVideoPreview alternates { language url } }
    }
  }
  seoSettings {
    siteName siteURL language twitterSiteHandle allowIndexing
    defaultImage { url width height alternativeText }
  }
}
fragment ResourceAuthor on Author {
  documentId name slug designation description linkedInProfile
  profilePicture { url alternativeText width height formats }
}
${PUBLISHED_FIELDS}
`;

// youtubeUrl is non-null in GraphQL even on an image banner. Read it only after inspecting variant.
export const RESOURCE_VIDEO_QUERY = `
query PublishedResourceVideo($slug: String!) {
  resources(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    slug banner { variant youtubeUrl }
  }
}
`;

// Some published image variants also contain null image fields. A separate optional read
// keeps that CMS schema mismatch from nulling the resource's main content.
export const RESOURCE_IMAGE_QUERY = `
query PublishedResourceImage($slug: String!) {
  resources(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    slug banner {
      variant
      image {
        altText kind panel shadow focusX focusY toneTemperature toneSaturation
        file { url width height formats alternativeText }
      }
    }
  }
}
`;
