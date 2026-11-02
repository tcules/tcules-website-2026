import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  getCaseRefs,
  getCorpusBindings,
  getCorpusPage,
  getOfferScenes,
  getTestimonialAvatars,
  getTestimonialRatings,
} from '@/content';
import { caseRoutesIn } from '@/lib/corpus-cases';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { OfferPage } from '@/templates';
import type { CorpusPage } from '@/lib/corpus-types';
import type { OfferScenes } from '@/lib/sketches';

import { landedClaimFigure } from './claim-figure';
import { landedReasonFigure } from './reason-figure';

/**
 * The offer routes share one renderer. Live services, expertise and audits supply published CMS
 * pages. The list below tracks local design specimens verified for this template; the CMS
 * collections control publication and route discovery for live pages.
 *
 * The allowlist remains the switch for the local proving ground (page-mapping § 1.2), so new CMS
 * entries do not silently become design specimens.
 *
 * `_corpus` is underscore-prefixed, so Next does not route it. It holds no layout decision: it reads
 * the page and its cited cases and hands them to the template.
 */
export const PASS_1_OFFER_ROUTES: ReadonlySet<string> = new Set([
  '/services/product-design',
  '/audits/design-to-code-audit',
  '/expertise/healthtech',
  '/expertise/ai-products-developer-tools',
  '/expertise/b2b-saas-workflow-software',
  '/expertise/climatetech-energy',
  '/expertise/commerce-transactional-products',
  '/expertise/content-knowledge-discovery-platforms',
  '/expertise/data-analytics-decision-products',
  '/expertise/edtech-learning',
  '/expertise/fintech',
  '/expertise/marketplaces-multi-sided-platforms',
  '/expertise/martech-salestech',
  '/expertise/proptech-contech-field-operations',
  '/services/ai-product-ux',
  '/services/design-engineering',
  '/services/design-systems',
  '/services/new-product-design-first-release',
  '/services/product-modernisation',
  '/services/software-development',
  '/services/ai-product-ux/ai-copilots-agents',
  '/services/ai-product-ux/ai-search-recommendation',
  '/services/ai-product-ux/human-in-the-loop-workflows',
  '/services/ai-product-ux/trust-control-recovery',
  '/services/design-engineering/coded-prototyping',
  '/services/design-engineering/design-to-code',
  '/services/design-engineering/frontend-design-systems',
  '/services/design-engineering/implementation-qa',
  '/services/design-systems/design-system-implementation',
  '/services/design-systems/design-system-strategy',
  '/services/design-systems/figma-storybook-alignment',
  '/services/design-systems/governance-adoption',
  '/services/product-design/data-visualisation',
  '/services/product-design/information-architecture-workflow-design',
  '/services/product-design/interaction-ui-design',
  '/services/product-design/prototyping-usability-testing',
  '/services/product-design/ux-research',
  '/services/product-modernisation/legacy-software-modernisation',
  '/services/product-modernisation/product-redesign',
  '/services/product-modernisation/replatforming-product-design',
  '/services/software-development/ai-product-engineering',
  '/services/software-development/backend-api-development',
  '/services/software-development/frontend-development',
  '/services/software-development/mobile-app-development',
  '/services/software-development/product-maintenance',
  '/services/software-development/saas-web-app-development',
  '/audits/ai-product-ux-readiness',
  '/audits/design-system-audit',
  '/audits/product-modernisation-assessment',
  '/audits/prototype-readiness-review',
  '/audits/ux-product-audit',
]);

/** Studio photographs an offer page may reuse, by binding id (page-mapping § 0 rule 5.3). */
const SHARED_BINDINGS = ['about_studio_review'] as const;

export const isCorpusOffer = (route: string): boolean => PASS_1_OFFER_ROUTES.has(route);

/** The route's `generateStaticParams` entries for one family: the last path segments of its pages. */
export function offerSlugs(family: '/services' | '/audits' | '/expertise'): string[] {
  return [...PASS_1_OFFER_ROUTES]
    .filter((route) => route.startsWith(`${family}/`))
    .map((route) => route.slice(family.length + 1));
}

export async function offerMetadata(route: string): Promise<Metadata | null> {
  if (!isCorpusOffer(route)) return null;
  const page = await getCorpusPage(route);
  return page ? corpusMetadata(page) : null;
}

export async function OfferRoute({
  route,
  page: suppliedPage,
  scenes: suppliedScenes,
  heroIllustration,
}: {
  route: string;
  page?: CorpusPage;
  scenes?: OfferScenes;
  heroIllustration?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    kind: 'illustration';
  };
}) {
  const page = suppliedPage ?? (await getCorpusPage(route));
  if (!page) notFound();
  const [caseRefs, shared, ratings, avatars, scenes] = await Promise.all([
    getCaseRefs(caseRoutesIn(page)),
    getCorpusBindings(SHARED_BINDINGS),
    getTestimonialRatings(page.composition.testimonialIds),
    getTestimonialAvatars(page.composition.testimonialIds),
    suppliedScenes ?? getOfferScenes(route),
  ]);
  return (
    <OfferPage
      page={page}
      caseRefs={caseRefs}
      shared={shared}
      ratings={ratings}
      avatars={avatars}
      scenes={scenes}
      heroIllustration={heroIllustration}
      reasonFigure={landedReasonFigure}
      claimFigure={landedClaimFigure}
    />
  );
}
