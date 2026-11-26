import {
  getAuditDetail,
  getCaseStudyIndex,
  getCookiePolicyDocument,
  getInsightsPage,
  getPrivacyPolicyDocument,
  getPublishedAuthorMasterPage,
  getTermsOfUseDocument,
  getAuditMasterPage,
  getExpertiseDetail,
  getExpertiseMasterPage,
  getGlossaryDetail,
  getGlossaryMasterPage,
  getHomePage,
  getPublishedAboutPage,
  getPublishedCareersPage,
  getPublishedClientMasterPage,
  getPublishedContactPage,
  getPublishedLabJoinPage,
  getPublishedLabPage,
  getPublishedMatterPage,
  getPublishedServicesMasterPage,
  getPublishedWhyPage,
  getPublishedWorkMasterPage,
  getPublishedWorkPage,
  getServiceDetail,
  getSitemapMasterPage,
  getToolDetail,
  getToolsMasterPage,
} from '@/content';
import { inlineToText } from '@/lib/inline';
import type { CorpusPage } from '@/lib/corpus-types';
import { ROUTES } from '@/lib/routes';

/**
 * A page's hero as its share card reads it: the H1, the eyebrow above it, and the page's short name
 * (its last breadcrumb, "Why Tcules"), which the card's label falls back to.
 */
export type Headline = { title: string; eyebrow: string | null; name: string };

type Hero = {
  title?: string | null;
  eyebrow?: string | null;
  breadcrumbs?: readonly { label?: string | null }[] | null;
};
type WithHero = { hero?: Hero | null } | null;
type Read = Promise<unknown>;

const isCorpusPage = (value: unknown): value is CorpusPage =>
  typeof value === 'object' && value !== null && 'bands' in value && 'hero' in value;

/** The H1 and eyebrow, whichever view model the page's reader returns. */
function heroOf(value: unknown): (Hero & { name?: string | null }) | undefined {
  if (!value || typeof value !== 'object') return undefined;
  /* A term or an article-shaped tool: the CMS entry mapped onto the long-form page shape. */
  if (isCorpusPage(value))
    return {
      title: value.hero.titleText,
      eyebrow: value.hero.eyebrow ? inlineToText(value.hero.eyebrow) : null,
      name: value.name,
    };
  if ('page' in value) return heroOf((value as { page: unknown }).page);
  if ('tool' in value) return heroOf((value as { tool: unknown }).tool);
  if ('title' in value && 'hero' in value) {
    const tool = value as { title: string; hero: { eyebrow?: string } };
    return { title: tool.title, eyebrow: tool.hero.eyebrow ?? null };
  }
  const hero = (value as WithHero)?.hero;
  if (!hero) return undefined;
  /* The insights hub names its H1 `heading`. */
  const heading = (hero as { heading?: string | null }).heading;
  return hero.title || !heading ? hero : { ...hero, title: heading };
}

/* The fixed pages, each by the reader its own route uses. */
const FIXED: Readonly<Record<string, () => Read>> = {
  [ROUTES.home]: getHomePage,
  [ROUTES.about]: getPublishedAboutPage,
  [ROUTES.contact]: getPublishedContactPage,
  [ROUTES.whyTcules]: getPublishedWhyPage,
  [ROUTES.careers]: getPublishedCareersPage,
  [ROUTES.clients]: getPublishedClientMasterPage,
  [ROUTES.howWeWork]: getPublishedWorkMasterPage,
  [ROUTES.futureInterfacesLab]: getPublishedLabPage,
  [ROUTES.futureInterfacesLabJoin]: getPublishedLabJoinPage,
  [ROUTES.matterDesignSystem]: getPublishedMatterPage,
  [ROUTES.services]: getPublishedServicesMasterPage,
  [ROUTES.audits]: getAuditMasterPage,
  [ROUTES.expertise]: getExpertiseMasterPage,
  [ROUTES.tools]: getToolsMasterPage,
  [ROUTES.glossary]: getGlossaryMasterPage,
  [ROUTES.sitemap]: getSitemapMasterPage,
  [ROUTES.caseStudies]: getCaseStudyIndex,
  [ROUTES.insights]: () => getInsightsPage(ROUTES.insights.slice(1)),
  [ROUTES.authors]: getPublishedAuthorMasterPage,
  [ROUTES.privacy]: getPrivacyPolicyDocument,
  [ROUTES.terms]: getTermsOfUseDocument,
  [ROUTES.cookiePolicy]: getCookiePolicyDocument,
};

/* The families whose pages are CMS entries, by the reader their route uses, keyed by the slug. */
const FAMILIES: Readonly<Record<string, (slug: string) => Read>> = {
  services: getServiceDetail,
  audits: getAuditDetail,
  expertise: getExpertiseDetail,
  tools: getToolDetail,
  glossary: getGlossaryDetail,
  'how-we-work': getPublishedWorkPage,
};

/** Strapi titles mark a display line break with `|`; a card sets one line. */
const oneLine = (value: string) =>
  value
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .join(' ');

/**
 * The CMS hero of the page at `path`, through the same reader its route renders it with, or null for
 * a path that is not one of these pages or whose read fails (the card then falls back to its title
 * from SEO, never to no image).
 */
export async function headlineFor(path: string): Promise<Headline | null> {
  const [, family, ...rest] = path.split('/');
  const byFamily = family && rest.length ? FAMILIES[family] : undefined;
  const read = FIXED[path] ?? (byFamily ? () => byFamily(rest.join('/')) : null);
  if (!read) return null;
  try {
    /* One retry: a single dropped connection to the CMS must not set a card on its fallback title
       until the next refresh. A failed read is not cached, so the retry reads afresh. */
    const hero = heroOf(await read().catch(() => read()));
    const title = hero?.title?.trim();
    if (!title) return null;
    const eyebrow = hero?.eyebrow?.trim() || null;
    const crumb = hero?.breadcrumbs?.at(-1)?.label?.trim();
    return {
      title: oneLine(title),
      eyebrow,
      name: hero?.name?.trim() || crumb || eyebrow || oneLine(title),
    };
  } catch (error) {
    console.error(`share cards: page unavailable for ${path}`, error);
    return null;
  }
}
