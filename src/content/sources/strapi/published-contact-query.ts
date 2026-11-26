import {
  PUBLISHED_CTA,
  PUBLISHED_FAQSECTION,
  PUBLISHED_FIELDS,
  PUBLISHED_HERO,
} from './published-page-fields';

/** The Contact Page single type: the hero, then the enquiry, the channels, the profiles and the FAQ. */
export const CONTACT_QUERY = `query PublishedContact {page:contactPage(status:PUBLISHED){documentId routePath ${PUBLISHED_HERO} content{__typename
${PUBLISHED_CTA}${PUBLISHED_FAQSECTION}
      ... on ComponentSharedContactChannels { id heading anchorId channels { kind title body action { ...PublishedAction } } }
      ... on ComponentSharedLinksIsland { id heading anchorId links { ...PublishedAction } }
}}}${PUBLISHED_FIELDS}`;
