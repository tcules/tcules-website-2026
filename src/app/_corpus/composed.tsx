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
import { ROUTES } from '@/lib/routes';
import { OfferPage } from '@/templates';

import { landedClaimFigure } from './claim-figure';
import { landedReasonFigure } from './reason-figure';

/**
 * The composed corpus routes that are not an offer family's (component-map C12, 29 Oct 2026): a hub
 * or a one-off page whose copy is a run of bands, handed to OfferPage's unit loop, so every band
 * renders as the plan's id table names it (plan.ts `BAND_KINDS`).
 *
 * The allowlist is the switch, as for the offer families (`PASS_1_OFFER_ROUTES`): a route listed
 * here renders from the `_pages/` copy, one not listed keeps its current source. Widened on 29 Oct
 * 2026 to the review routes (/contact, /services, /expertise, /audits, /tools, /glossary); the other
 * families follow in the weekend rollout. `/` and `/about` read the copy through their own templates.
 */
export const PASS_1_COMPOSED_ROUTES: ReadonlySet<string> = new Set([
  ROUTES.contact,
  ROUTES.services,
  ROUTES.expertise,
  ROUTES.audits,
  ROUTES.tools,
  ROUTES.glossary,
  ROUTES.howWeWork,
  ROUTES.howWeWorkAiNative,
  ROUTES.howWeWorkAiTransparency,
  ROUTES.whyTcules,
  ROUTES.careers,
  ROUTES.matterDesignSystem,
  ROUTES.futureInterfacesLab,
  ROUTES.futureInterfacesLabJoin,
  ROUTES.clients,
]);

/** Studio photographs a composed page may reuse, by binding id (page-mapping § 0 rule 5.3). */
const SHARED_BINDINGS = ['about_studio_review'] as const;

export const isComposedRoute = (route: string): boolean => PASS_1_COMPOSED_ROUTES.has(route);

export async function composedMetadata(route: string): Promise<Metadata | null> {
  if (!isComposedRoute(route)) return null;
  const page = await getCorpusPage(route);
  return page ? corpusMetadata(page) : null;
}

export async function ComposedRoute({ route }: { route: string }) {
  if (!isComposedRoute(route)) notFound();
  const page = await getCorpusPage(route);
  if (!page) notFound();
  const [caseRefs, shared, ratings, avatars, scenes] = await Promise.all([
    getCaseRefs(caseRoutesIn(page)),
    getCorpusBindings(SHARED_BINDINGS),
    getTestimonialRatings(page.composition.testimonialIds),
    getTestimonialAvatars(page.composition.testimonialIds),
    getOfferScenes(route),
  ]);
  return (
    <OfferPage
      page={page}
      caseRefs={caseRefs}
      shared={shared}
      ratings={ratings}
      avatars={avatars}
      scenes={scenes}
      reasonFigure={landedReasonFigure}
      claimFigure={landedClaimFigure}
    />
  );
}
