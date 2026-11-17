import type { Metadata } from 'next';
import { cache } from 'react';

import type { CorpusBand, CorpusHero, CorpusPage } from '@/lib/corpus-types';
import { inlineToText } from '@/lib/inline';
import { ROUTES } from '@/lib/routes';

import { parseInline } from '../corpus/parse-inline';
import { slugify } from '../corpus/parse-body';
import { rows, text } from './home';
import type { CmsHero, Entries } from './home-types';
import {
  PUBLISHED_COOKIE_POLICY_COMPUTED_SEO_QUERY,
  PUBLISHED_COOKIE_POLICY_QUERY,
  PUBLISHED_PRIVACY_POLICY_QUERY,
  PUBLISHED_TERMS_OF_USE_QUERY,
} from './published-legal-query';
import { flowBlocks, type CmsFlow } from './published-service';
import { publicGraphql } from './public-graphql';
import { entrySeo, type ResourceSeo, type ResourceSeoSettings } from './resource-seo';
import { safeContentHref } from './rich-text';

type Text = string | null | undefined;

type CmsLegalSection = {
  id: string;
  heading: Text;
  anchorId: Text;
  navigationLabel: Text;
  editorialPresentation: Text;
  media: { file: { url: Text } | null } | null;
  blocks: Entries<CmsFlow>;
};

type CmsLegal = {
  documentId: string;
  lastUpdated: Text;
  hero: CmsHero | null;
  sections: Entries<CmsLegalSection>;
  seo: ResourceSeo | null;
};

/** A legal page as its route renders it: the document in the article shell, and its own <head>. */
export type LegalPage = {
  page: CorpusPage;
  metadata: Metadata;
  structuredData?: Record<string, unknown> | unknown[];
};

/** "20 October 2026", as the legal pages set their date. An unreadable date is left out. */
function longDate(value: Text): string | undefined {
  const iso = text(value);
  const time = iso ? Date.parse(iso) : Number.NaN;
  if (Number.isNaN(time)) return undefined;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(time);
}

/**
 * One Editorial Section as a band of the document: its heading, its anchor (the outline's link), and
 * its flow blocks in order through the shared flow mapping, so prose, lists, links, tables and
 * callouts read as they do on every CMS-backed page. Nothing in it is dropped without a warning.
 */
function mapSection(
  section: CmsLegalSection,
  warn: (message: string) => void,
): CorpusBand | undefined {
  const key = `section ${section.id}`;
  const headingText = text(section.heading);
  if (!headingText) {
    warn(`${key} has no heading; not shown`);
    return undefined;
  }
  const heading = parseInline(headingText);
  const anchor = text(section.anchorId);
  if (section.editorialPresentation === 'media' || section.media?.file?.url)
    warn(`${key} carries media, which the document's column has no slot for; not shown`);
  const blocks = flowBlocks(section.blocks, (message) => warn(`${key} ${message}`));
  if (blocks.length === 0) warn(`${key} has no content`);
  const navLabel = text(section.navigationLabel);
  return {
    id: anchor ?? slugify(inlineToText(heading)),
    anchored: Boolean(anchor),
    heading,
    headingText: inlineToText(heading),
    ...(navLabel ? { navLabel } : {}),
    blocks,
  };
}

/**
 * A legal single type as the long-form page model (the article shell the page has always used): the
 * hero's title and introduction, the "last updated" line under them, then each Editorial Section in
 * the editor's order. Every word is the CMS's; the date line's label is the page's.
 */
function mapLegal(
  record: CmsLegal,
  settings: ResourceSeoSettings | null,
  route: string,
): LegalPage {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  const titleText = text(record.hero?.title);
  if (!titleText) throw new Error(`New CMS ${route}: published entry has no hero title`);
  const title = parseInline(titleText);
  const eyebrow = text(record.hero?.eyebrow);
  const updated = longDate(record.lastUpdated);
  if (!updated) warn('no readable last updated date; the date line is left out');
  const hero: CorpusHero = {
    eyebrow: eyebrow ? parseInline(eyebrow) : null,
    title,
    titleText: inlineToText(title),
    lede: [
      record.hero?.description,
      record.hero?.secondaryDescription,
      ...rows(record.hero?.additionalParagraphs).map((item) => item.text),
    ].flatMap((value) => {
      const words = text(value);
      return words ? [parseInline(words)] : [];
    }),
    actions: [],
    proofLines: updated ? [parseInline(`Last updated: ${updated}`)] : [],
    extra: [],
  };
  if (rows(record.hero?.actions).length > 0)
    warn('the hero carries actions, which the legal document does not show');

  const bands = rows(record.sections).flatMap((section) => mapSection(section, warn) ?? []);
  const ids = new Set<string>();
  for (const band of bands) {
    if (ids.has(band.id)) warn(`two sections share the anchor #${band.id}`);
    ids.add(band.id);
  }

  const breadcrumb = rows(record.hero?.breadcrumbs).flatMap((crumb) => {
    const label = text(crumb.label);
    const url = safeContentHref(crumb.href);
    return label && url ? [{ name: label, url }] : [];
  });
  if (breadcrumb.at(-1)?.url !== route) warn('the breadcrumb does not end on the page’s route');

  const description = text(record.seo?.metaDescription) ?? text(record.hero?.description);
  const seo = entrySeo(record.seo, settings, {
    path: route,
    title: hero.titleText,
    ...(description ? { description } : {}),
    type: 'website',
  });

  const page: CorpusPage = {
    route,
    slug: route.slice(1),
    /* The page's own name is its breadcrumb's last label, else its title. */
    name: breadcrumb.at(-1)?.name ?? hero.titleText,
    pageType: 'legal',
    /* The page's <head> is the entry's own SEO (`metadata` below), not this. */
    seo: {
      title: hero.titleText,
      description: '',
      canonical: '',
      robots: '',
      ogImageAlt: null,
    },
    breadcrumb,
    conversion: null,
    bandOrder: [],
    searchContext: {
      primaryIntent: null,
      primaryBuyerQuestion: null,
      supportingQuestions: [],
      primaryQuery: null,
      secondaryQueries: [],
      keyEntities: [],
    },
    structuredData: { types: [], organizationRef: null, raw: {} },
    composition: {
      visualPlan: null,
      mediaBindings: [],
      logoClients: [],
      clientRecognition: null,
      caseSlugs: [],
      testimonialIds: [],
      caseMeta: null,
      raw: {},
    },
    release: { contentState: null, siteReleaseState: null },
    hero,
    bands,
    frontmatter: {},
    file: `cms:${route.slice(1)}/${record.documentId}`,
  };
  return {
    page,
    metadata: seo.metadata,
    ...(seo.structuredData ? { structuredData: seo.structuredData } : {}),
  };
}

/** The published Privacy Policy (`/privacy-policy`), or null when none is published. */
export const getPublishedPrivacyPolicy = cache(async (): Promise<LegalPage | null> => {
  const { privacyPolicy, seoSettings } = await publicGraphql<{
    privacyPolicy: CmsLegal | null;
    seoSettings: ResourceSeoSettings | null;
  }>(PUBLISHED_PRIVACY_POLICY_QUERY, 'PublishedPrivacyPolicy');
  return privacyPolicy ? mapLegal(privacyPolicy, seoSettings, ROUTES.privacy) : null;
});

/** The published Terms of Use (`/terms-of-use`), or null when none is published. */
export const getPublishedTermsOfUse = cache(async (): Promise<LegalPage | null> => {
  const { termsOfUse, seoSettings } = await publicGraphql<{
    termsOfUse: CmsLegal | null;
    seoSettings: ResourceSeoSettings | null;
  }>(PUBLISHED_TERMS_OF_USE_QUERY, 'PublishedTermsOfUse');
  return termsOfUse ? mapLegal(termsOfUse, seoSettings, ROUTES.terms) : null;
});

/**
 * The published Cookie Policy (`/cookie-policy`), or null when none is published. The CMS computes
 * `seo.robot` and `seo.structuredData` and fails on an entry with no canonical URL, so they are read
 * on their own: when that read fails the page keeps its document and the rest of its SEO (robots then
 * come from `seo.technical` under the indexing gate, as `entrySeo` already does), with a warning.
 */
export const getPublishedCookiePolicy = cache(async (): Promise<LegalPage | null> => {
  const [{ cookiePolicy, seoSettings }, computed] = await Promise.all([
    publicGraphql<{
      cookiePolicy:
        | (Omit<CmsLegal, 'seo'> & {
            seo: Omit<ResourceSeo, 'robot' | 'structuredData'> | null;
          })
        | null;
      seoSettings: ResourceSeoSettings | null;
    }>(PUBLISHED_COOKIE_POLICY_QUERY, 'PublishedCookiePolicy'),
    publicGraphql<{
      cookiePolicy: { seo: Pick<ResourceSeo, 'robot' | 'structuredData'> | null } | null;
    }>(PUBLISHED_COOKIE_POLICY_COMPUTED_SEO_QUERY, 'PublishedCookiePolicySeo').catch(
      (error) => {
        console.warn(
          `New CMS ${ROUTES.cookiePolicy}: computed SEO (robot, structuredData) unavailable — ${
            error instanceof Error ? error.message : error
          }`,
        );
        return null;
      },
    ),
  ]);
  if (!cookiePolicy) return null;
  const extra = computed?.cookiePolicy?.seo;
  const seo: ResourceSeo | null = cookiePolicy.seo
    ? {
        ...cookiePolicy.seo,
        robot: extra?.robot ?? null,
        structuredData: extra?.structuredData ?? null,
      }
    : null;
  return mapLegal({ ...cookiePolicy, seo }, seoSettings, ROUTES.cookiePolicy);
});
