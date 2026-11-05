import { PUBLISHED_HERO } from './published-page-fields';

/**
 * The legal pages' fields, the same on each single type: the Hero, the "last updated" date, the
 * Editorial Sections in order (each a run of flow blocks: Markdown prose, tables, lists, callouts),
 * the entry's own SEO, and the site's SEO settings (the public indexing gate, the site's name).
 */
const LEGAL_FIELDS = `
    documentId lastUpdated
${PUBLISHED_HERO}
    sections {
      id heading anchorId navigationLabel
      editorialPresentation: presentation
      media { file { url } }
      blocks { ...LegalFlow }
    }
    seo {
      metaTitle metaDescription canonicalURL robot structuredData focusString
      secondaryKeywords { text }
      openGraph { title description imageAlt type url siteName locale image { url width height alternativeText } }
      twitter { title description imageAlt card siteHandle creatorHandle image { url width height alternativeText } }
      technical { index follow noSnippet noImageIndex maxSnippet maxImagePreview maxVideoPreview alternates { language url } }
    }
`;

const LEGAL_FRAGMENTS = `
fragment LegalFlow on ComponentContentFlowBlock {
  id kind
  prose { body }
  table { caption columns { heading } rows { heading cells { body } } }
  labelled { title body }
  links { links { ...PublishedAction } }
  proof { label body link { ...PublishedAction } }
  sequence { heading ordered entries { title body } }
  callout { label body icon }
  ledger { entries { question role } }
}
fragment LegalSeoSettings on SeoSettings {
  siteName siteURL language twitterSiteHandle allowIndexing
  defaultImage { url width height alternativeText }
}
fragment PublishedAction on ComponentSharedCtaButton {
  name href description icon isExternal
}
fragment PublishedImage on ComponentContentImage {
  altText kind panel shadow focusX focusY toneTemperature toneSaturation
  file { url width height formats alternativeText }
}
`;

/** The published Privacy Policy (`/privacy-policy`). */
export const PUBLISHED_PRIVACY_POLICY_QUERY = `
query PublishedPrivacyPolicy {
  privacyPolicy(status: PUBLISHED) {
${LEGAL_FIELDS}
  }
  seoSettings { ...LegalSeoSettings }
}
${LEGAL_FRAGMENTS}
`;

/** The published Terms of Use (`/terms-of-use`). */
export const PUBLISHED_TERMS_OF_USE_QUERY = `
query PublishedTermsOfUse {
  termsOfUse(status: PUBLISHED) {
${LEGAL_FIELDS}
  }
  seoSettings { ...LegalSeoSettings }
}
${LEGAL_FRAGMENTS}
`;
