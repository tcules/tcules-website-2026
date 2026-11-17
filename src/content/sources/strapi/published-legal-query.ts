import { PUBLISHED_HERO } from './published-page-fields';

/**
 * The legal pages' fields, the same on each single type: the Hero, the "last updated" date, the
 * Editorial Sections in order (each a run of flow blocks: Markdown prose, tables, lists, callouts),
 * the entry's own SEO, and the site's SEO settings (the public indexing gate, the site's name).
 *
 * `computedSeo: false` leaves out `seo.robot` and `seo.structuredData`: the CMS computes both and,
 * on an entry with no canonical URL, its resolver throws (`Invalid URL`), failing the whole read.
 * The Cookie Policy reads them in a separate best-effort query instead (5 Nov 2026).
 */
const legalFields = (computedSeo = true) => `
    documentId lastUpdated
${PUBLISHED_HERO}
    sections {
      id heading anchorId navigationLabel
      editorialPresentation: presentation
      media { file { url } }
      blocks { ...LegalFlow }
    }
    seo {
      metaTitle metaDescription canonicalURL${computedSeo ? ' robot structuredData' : ''} focusString
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
${legalFields()}
  }
  seoSettings { ...LegalSeoSettings }
}
${LEGAL_FRAGMENTS}
`;

/** The published Terms of Use (`/terms-of-use`). */
export const PUBLISHED_TERMS_OF_USE_QUERY = `
query PublishedTermsOfUse {
  termsOfUse(status: PUBLISHED) {
${legalFields()}
  }
  seoSettings { ...LegalSeoSettings }
}
${LEGAL_FRAGMENTS}
`;

/** The published Cookie Policy (`/cookie-policy`), without the CMS-computed SEO fields. */
export const PUBLISHED_COOKIE_POLICY_QUERY = `
query PublishedCookiePolicy {
  cookiePolicy(status: PUBLISHED) {
${legalFields(false)}
  }
  seoSettings { ...LegalSeoSettings }
}
${LEGAL_FRAGMENTS}
`;

/** The Cookie Policy's CMS-computed robots line and structured data, read on their own. */
export const PUBLISHED_COOKIE_POLICY_COMPUTED_SEO_QUERY = `
query PublishedCookiePolicySeo {
  cookiePolicy(status: PUBLISHED) {
    seo { robot structuredData }
  }
}
`;
