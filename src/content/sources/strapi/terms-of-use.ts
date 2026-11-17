import { publicGraphqlUrl as getStrapiGraphqlUrl, cachedCmsFetch } from './public-graphql';
import type { ContentSeo, TermsOfUseContentSource, TermsOfUsePage } from '../../types';
import { markdownToHtml } from './markdown';
import { TERMS_OF_USE_QUERY } from './terms-of-use-query';
import type {
  StrapiTermsOfUse,
  StrapiTermsOfUseResponse,
  StrapiTermsOfUseSeo,
} from './terms-of-use-types';
import { richTextToPlainText } from './rich-text';

const TERMS_OF_USE_SLUG = 'terms-of-use';
const TERMS_OF_USE_REVALIDATE_SECONDS = false;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}


function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate === 'string') {
    const source = candidate.trim();
    if (!source) return undefined;

    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(candidate)) {
    const source = richTextToPlainText(candidate);
    if (source) {
      try {
        return JSON.parse(source) as unknown;
      } catch {
        return undefined;
      }
    }
    return candidate;
  }

  return candidate;
}

function normaliseJsonLd(candidate: unknown): Record<string, unknown> | unknown[] | undefined {
  const parsed = parseJson(candidate);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
}

function structuredDataFromSeo(
  seo: StrapiTermsOfUseSeo,
): Record<string, unknown> | unknown[] | undefined {
  for (const candidate of [seo.codeJson, seo.graphCode, seo.structuredData]) {
    const structuredData = normaliseJsonLd(candidate);
    if (structuredData) return structuredData;
  }
  return undefined;
}

function canonicalUrl(candidate: string | null | undefined): string | undefined {
  const rawUrl = value(candidate);
  if (!rawUrl) return undefined;

  try {
    const url = new URL(rawUrl);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapSeo(rawSeo: StrapiTermsOfUseSeo | null | undefined): ContentSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonical = canonicalUrl(rawSeo.canonicalURL);
  const robotTokens = value(rawSeo.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const robots = robotTokens.length
    ? {
        index: !robotTokens.includes('noindex'),
        follow: !robotTokens.includes('nofollow'),
      }
    : undefined;
  const structuredData = structuredDataFromSeo(rawSeo);

  if (!title && !description && !canonical && !robots && !structuredData) return undefined;

  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(canonical ? { canonical } : {}),
    ...(robots ? { robots, noindex: !robots.index } : {}),
    ...(structuredData ? { structuredData } : {}),
  };
}

function mapTermsOfUse(
  rawTerms: StrapiTermsOfUse,
  requestedSlug: string,
): TermsOfUsePage | null {
  const cmsSlug = value(rawTerms.seo?.slug);
  if (cmsSlug && cmsSlug !== requestedSlug) return null;

  const title = value(rawTerms.heading);
  if (!title) return null;

  const sections = (rawTerms.legalDescription ?? []).flatMap((section, index) => {
    if (section.__typename && section.__typename !== 'ComponentLegalDetails') return [];

    const heading = value(section.heading);
    const bodyHtml = markdownToHtml(
      section.description,
      `terms of use section ${heading || value(section.id) || index + 1}`,
    );
    if (!heading && !bodyHtml) return [];

    return [
      {
        id: value(section.id) || `terms-of-use-section-${index + 1}`,
        heading,
        bodyHtml,
      },
    ];
  });
  const seo = mapSeo(rawTerms.seo);

  return {
    documentId: value(rawTerms.documentId) || requestedSlug,
    slug: cmsSlug || requestedSlug,
    title,
    description: value(rawTerms.description),
    ...(value(rawTerms.updatedAt) ? { updatedAt: value(rawTerms.updatedAt) } : {}),
    ...(value(rawTerms.publishedAt) ? { publishedAt: value(rawTerms.publishedAt) } : {}),
    sections,
    ...(seo ? { seo } : {}),
  };
}

async function fetchTermsOfUse(): Promise<StrapiTermsOfUse | null> {
  const response = await cachedCmsFetch(getStrapiGraphqlUrl(), {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: TERMS_OF_USE_QUERY,
      variables: { status: 'PUBLISHED' },
    }),
    cache: 'force-cache',
    next: {
      revalidate: TERMS_OF_USE_REVALIDATE_SECONDS,
      tags: ['terms-of-use'],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi terms-of-use request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiTermsOfUseResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi terms-of-use query failed: ${errors.join('; ')}`);
  }

  return payload.data?.termsOfUse ?? null;
}

export const termsOfUseSource: TermsOfUseContentSource = {
  async getTermsOfUsePage(slug) {
    const requestedSlug = value(slug);
    if (requestedSlug !== TERMS_OF_USE_SLUG) return null;

    const termsOfUse = await fetchTermsOfUse();
    return termsOfUse ? mapTermsOfUse(termsOfUse, requestedSlug) : null;
  },
};
