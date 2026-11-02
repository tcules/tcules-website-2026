/**
 * Every routed collection's slugs in one request, for the sitemap. Each collection is read at the
 * publication status its own page reads — the offer, glossary and tool routes render the latest
 * draft, the insight, podcast, event and case-study routes render published entries only — so the
 * list names exactly the pages the site answers. `limit: -1` lifts Strapi's default page of 10.
 */
export const SITE_PAGES_QUERY = /* GraphQL */ `
  query SitePages {
    services(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    audits(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    expertises(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    glossaries(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    tools(status: DRAFT, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
    caseStudies(status: PUBLISHED, pagination: { limit: -1 }) {
      slug
      title
      updatedAt
    }
  }
`;
