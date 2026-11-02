import { cache } from 'react';

import type { CorpusBlock, CorpusPage } from '../../corpus-types';
import { ROUTES, SITE_ORIGIN } from '../../../lib/routes';
import { parseCorpusDocument, liveCaseLinks } from '../corpus/load';
import { parseBody } from '../corpus/parse-body';
import { parseInline } from '../corpus/parse-inline';
import { productionCmsQuery } from './production-cms';
import type { StrapiTermsOfUseSeo } from './terms-of-use-types';

const PAGES = {
  [ROUTES.terms]: { field: 'termsOfUse', tag: 'terms-of-use' },
  [ROUTES.privacy]: { field: 'privacyPolicy', tag: 'privacy-policy' },
} as const;

const FIELDS = /* GraphQL */ `
  documentId
  heading
  description
  publishedDate
  updatedDate
  legalDescription { id heading description }
  seo { metaTitle metaDescription canonicalURL robot structuredData codeJson graphCode }
`;

type LegalRecord = {
  documentId: string;
  heading: string;
  description?: string | null;
  publishedDate: string;
  updatedDate: string;
  legalDescription: { id?: string | null; heading?: string | null; description: string }[];
  seo?: StrapiTermsOfUseSeo | null;
};

export type CmsLegalDocument = {
  page: CorpusPage;
  publishedAt: string;
  updatedAt: string;
  structuredData?: Record<string, unknown> | unknown[];
};

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

function calendarDate(value: string): string {
  if (
    !/^\d{4}-\d{2}-\d{2}$/u.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  ) {
    throw new Error('Production CMS legal page has an invalid calendar date.');
  }
  return `${value}T00:00:00.000Z`;
}

function displayDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
}

function jsonLd(seo: LegalRecord['seo']): CmsLegalDocument['structuredData'] {
  for (let candidate of [seo?.structuredData, seo?.codeJson, seo?.graphCode]) {
    if (typeof candidate === 'string') {
      try {
        candidate = JSON.parse(candidate) as unknown;
      } catch {
        continue;
      }
    }
    if (!candidate || typeof candidate !== 'object') continue;
    if (!Array.isArray(candidate)) {
      const preview = (candidate as Record<string, unknown>).full_json_ld_preview;
      if (preview && typeof preview === 'object') candidate = preview;
    }
    return candidate as NonNullable<CmsLegalDocument['structuredData']>;
  }
  return undefined;
}

function canonicalUrl(value: unknown, route: string): string {
  try {
    const url = new URL(text(value));
    if (['https:', 'http:'].includes(url.protocol)) return url.toString();
  } catch {
    /* An optional SEO field falls back to this page's canonical route. */
  }
  return `${SITE_ORIGIN}${route}`;
}

/** Native legal fields own all public copy. No local document or CMS corpus snapshot is read. */
export function mapLegalDocument(raw: LegalRecord, route: string): CmsLegalDocument {
  if (!Object.hasOwn(PAGES, route) || !text(raw.documentId) || !text(raw.heading)) {
    throw new Error(`Production CMS returned an invalid legal page for ${route}.`);
  }
  const publishedAt = calendarDate(raw.publishedDate);
  const updatedAt = calendarDate(raw.updatedDate);
  if (updatedAt < publishedAt)
    throw new Error('Production CMS legal revision predates publication.');
  if (!Array.isArray(raw.legalDescription) || !raw.legalDescription.length) {
    throw new Error(`Production CMS legal page ${route} has no sections.`);
  }
  const title = text(raw.heading);
  const description = text(raw.description);
  const robots = text(raw.seo?.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean)
    .join(',');
  const page = parseCorpusDocument(
    `cms:${route}`,
    {
      route,
      slug: route.slice(1),
      page_name: title,
      page_type: 'legal',
      seo: {
        title: text(raw.seo?.metaTitle) || `${title} | Tcules`,
        description: text(raw.seo?.metaDescription) || description,
        canonical: canonicalUrl(raw.seo?.canonicalURL, route),
        robots: robots || 'index,follow',
      },
      navigation: {
        breadcrumb: [
          { name: 'Home', url: ROUTES.home },
          { name: title, url: route },
        ],
      },
    },
    '# Legal page',
  );

  page.hero.title = [{ type: 'text', text: title }];
  page.hero.titleText = title;
  page.hero.lede = description ? description.split(/\n\s*\n/u).map(parseInline) : [];
  page.hero.proofLines = [
    [
      {
        type: 'text',
        text: `Published: ${displayDate(publishedAt)} · Last updated: ${displayDate(updatedAt)}`,
      },
    ],
  ];
  const ids = new Set<string>();
  page.bands = raw.legalDescription.map((section, index) => {
    if (!text(section.description)) {
      throw new Error(`Production CMS legal page ${route} section ${index + 1} is empty.`);
    }
    const id = `legal-section-${text(section.id).replace(/[^a-zA-Z0-9_-]/gu, '') || index + 1}`;
    if (ids.has(id))
      throw new Error(`Production CMS legal page ${route} repeats section ${id}.`);
    ids.add(id);
    // A section's own Markdown headings remain inside that section, below its native heading.
    const body = section.description.replace(/^#{1,2}\s+/gmu, '### ');
    const { bands } = parseBody(`# Legal page\n\n## Section\n\n${body}`);
    const blocks: CorpusBlock[] = bands[0]?.blocks ?? [];
    return {
      id,
      anchored: true,
      heading: parseInline(text(section.heading)),
      headingText: text(section.heading),
      blocks,
    };
  });
  page.bandOrder = page.bands.map(({ id }) => id);
  page.bands = liveCaseLinks(page.bands);
  const structuredData = jsonLd(raw.seo);
  return { page, publishedAt, updatedAt, ...(structuredData ? { structuredData } : {}) };
}

export const getLegalDocument = cache(
  async (route: string): Promise<CmsLegalDocument | null> => {
    if (!Object.hasOwn(PAGES, route)) return null;
    const { field, tag } = PAGES[route as keyof typeof PAGES];
    const data = await productionCmsQuery<Record<string, LegalRecord | null>>(
      `query PublishedLegalDocument { ${field}(status: PUBLISHED) { ${FIELDS} } }`,
      {},
      ['legal', tag],
    );
    if (!(field in data)) throw new Error(`Production CMS returned no ${field} field.`);
    return data[field] ? mapLegalDocument(data[field], route) : null;
  },
);
