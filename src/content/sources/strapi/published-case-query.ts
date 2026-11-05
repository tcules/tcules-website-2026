import { PUBLISHED_CTA, PUBLISHED_FIELDS, PUBLISHED_HERO } from './published-page-fields';

export const PUBLISHED_CASE_QUERY = `
query PublishedCaseStudy($slug: String!) {
  caseStudies(status: PUBLISHED, filters: { slug: { eq: $slug } }, pagination: { limit: 1 }) {
    slug routePath title publishedDate modifiedDate publishedAt updatedAt resolvedSeo
    stage { documentId name slug }
    industries { documentId name slug }
    services { documentId name slug }
    topics { documentId name }
    hero {
      description problem solution
      facts { id label body }
      labels { text }
      image { ...PublishedImage }
    }
${PUBLISHED_HERO.replace('hero {', 'heroSection {')}
    content {
      __typename
      ... on ComponentContentHeading { id heading sectionAnchor: anchorId navigationLabel presentation chapterLabel }
      ... on ComponentContentMarkdown { id body }
      ... on ComponentContentSeparator { id }
      ... on ComponentContentFigures {
        id
        figures { id label caption note anchorId notes { text } image { ...PublishedImage } }
      }
      ... on ComponentContentSteps { id ordered items { id label body } }
      ... on ComponentContentStatement { id label text }
      ... on ComponentContentQuote {
        id kind quote attribution
        testimonial {
          documentId name role company quoteHtml rating avatar { url alternativeText width height formats }
        }
      }
      ... on ComponentContentVideo {
        id description autoplay loop
        poster { ...PublishedImage }
        video { url mime width height }
      }
      ... on ComponentContentEmbed { id description url height thumbnail { ...PublishedImage } }
      ... on ComponentContentCode { id code language }
      ... on ComponentContentLink { id action { ...PublishedAction } }
${PUBLISHED_CTA}
    }
  }
}

${PUBLISHED_FIELDS}
`;
