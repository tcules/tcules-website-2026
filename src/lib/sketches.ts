import type { PageSceneName } from './page-scenes';

/**
 * The Sketch scenes (components/Sketch) and which one a service page takes. Named here, once, so the
 * About services selector and home's situation selector draw the same scene for the same service
 * without either template writing the map (templates may not import each other).
 */
export type ServiceSceneName =
  | 'new-product'
  | 'product-design'
  | 'product-modernisation'
  | 'design-systems'
  | 'ai-product-ux'
  | 'design-engineering'
  | 'software-development'
  | 'audits';

/**
 * ARTICLE scenes (owner, 13 Oct 2026): each drawn for ONE insight, from that article's own argument,
 * to stand as its cover until a real one exists. A service scene is never a cover — it stays in the
 * selectors and the nav — so a cover field is typed to this union and cannot name one. Assigned on
 * purpose, item by item (src/content/sources/cover-scenes.ts), never by keyword.
 *
 *   code-review              "Accepting AI-generated front-end code": a lens on the two lines a
 *                            reviewer must judge, the rest of the generated file ticked through
 *   security-checklist       "Vibe-coded app security checklist": a checklist standing as a gate
 *                            between the app and the people arriving at it
 *   prototype-to-production  "I vibe-coded an app. Now what?": a rough sketch's path through four
 *                            questions into a stored, running system
 */
export type ArticleSceneName = 'code-review' | 'security-checklist' | 'prototype-to-production';

/**
 * KIT scenes (owner, 26 Oct 2026, S2): the drawings EngagementOptions and TracePlates show, drawn in the
 * same grammar as every other sketch so the flat families cannot drift apart. The patterns name them
 * by their own scope or stage; the prefix keeps them apart from the service and article scenes.
 */
export type ScopeSceneName =
  | 'scope-feature'
  | 'scope-area'
  | 'scope-embedded'
  | 'scope-build'
  | 'scope-start'
  | 'scope-direct'
  | 'scope-inside'
  | 'scope-overlap'
  | 'scope-commercial';
export type TraceSceneName =
  'trace-design' | 'trace-handoff' | 'trace-code' | 'trace-product' | 'trace-signoff';

/**
 * OFFER scenes (owner, 26 Oct 2026, product-design page): drawn for one item of a service page's
 * band from that item's own words, and assigned item by item at the content seam
 * (src/content/sources/offer-scenes.ts). `outcome-*` for "What you get", `symptom-*` for "Where we
 * start", `specialist-*` for the specialist services bento (seven since the 26 Oct copy: New Product
 * Design and the UX & Product Audit joined the five, owner 29 Oct 2026, Q7), `case-*` for a worked
 * example's story.
 */
export type OfferSceneName =
  | 'outcome-explain'
  | 'outcome-rules'
  | 'outcome-build'
  | 'outcome-finished'
  | 'outcome-brief'
  | 'symptom-stuck'
  | 'symptom-messy'
  | 'symptom-test'
  | 'symptom-consistent'
  | 'symptom-match'
  | 'specialist-research'
  | 'specialist-ia'
  | 'specialist-ui'
  | 'specialist-dataviz'
  | 'specialist-prototype'
  | 'specialist-new-product'
  | 'specialist-audit'
  | 'specialist-readiness'
  | 'offer-route'
  | 'case-dealpath-problem'
  | 'case-dealpath-did';

/**
 * L1 scenes (owner, 30 Oct 2026, round 5): the six service lines' own pages, drawn item by item the
 * way the product-design page is. Bands (autonomy levels, scenarios, status label, an option),
 * "What you get" outcomes, and the specialist services' tiles.
 */
export type L1BandScene =
  | 'autonomy-finds'
  | 'autonomy-suggests'
  | 'autonomy-drafts'
  | 'autonomy-acts'
  | 'scenario-overnight-agent'
  | 'scenario-drag-overload'
  | 'scenario-vet-estimate'
  | 'scenario-self-booking'
  | 'status-meaning'
  | 'status-design'
  | 'status-figma'
  | 'status-code'
  | 'status-guidance'
  | 'option-own-team'
  | 'method-test-in-code'
  | 'decisions-five'
  | 'hard-ai-rules'
  | 'method-modernise'
  | 'scope-agreement';

export type L1OutcomeScene =
  | 'outcome-ai-steps'
  | 'outcome-ai-checks'
  | 'outcome-tried-in-code'
  | 'outcome-hard-component'
  | 'outcome-code-in-repo'
  | 'outcome-ds-tokens'
  | 'outcome-ds-docs'
  | 'outcome-ds-first-release'
  | 'outcome-ds-route-for-change'
  | 'outcome-five-choices'
  | 'outcome-build-parts'
  | 'outcome-break-points'
  | 'outcome-part-calls'
  | 'outcome-habits-record'
  | 'outcome-one-workflow'
  | 'outcome-old-new'
  | 'outcome-small-releases'
  | 'outcome-release-checks'
  | 'outcome-release-support'
  | 'outcome-designed-first'
  | 'outcome-launch-support';

export type L1SpecialistScene =
  | 'specialist-ai-copilots'
  | 'specialist-ai-search'
  | 'specialist-ai-hitl'
  | 'specialist-ai-trust'
  | 'specialist-ai-readiness'
  | 'specialist-ai-engineering'
  | 'specialist-ds-strategy'
  | 'specialist-ds-implementation'
  | 'specialist-ds-alignment'
  | 'specialist-ds-governance'
  | 'specialist-ds-audit'
  | 'specialist-redesign'
  | 'specialist-legacy'
  | 'specialist-replatforming'
  | 'specialist-modernisation-assessment'
  | 'specialist-saas-app'
  | 'specialist-frontend'
  | 'specialist-backend'
  | 'specialist-maintenance'
  | 'specialist-mobile'
  | 'specialist-prototype-review';

/**
 * L1 TERM scenes (owner, 30 Oct 2026, round 6; decisions/2026-10-30-what-you-get-titled-terms-four-parts):
 * the two terms of "What you get" that are drawn, one pair per service line. `needs-*` is the
 * handover, read left to right "you to us": the client's inputs on their panel, routed into our
 * frame, the decisive one lit. `stops-*` is the boundary, read "us to you": our last piece left of a
 * dashed line with the lit check, what stays theirs on their panel. Each is drawn from its page's
 * own words, never borrowed from How we work together's scopes.
 *
 * Round 7 (30 Oct 2026, decisions/2026-10-30-what-you-get-label-rows): `team-*` is "Who does the work",
 * our team frame with the senior designer lit and the roles beside it, always-in solid and routed in,
 * specialists who join when needed dashed. `stops-*` now reads "our last piece → our check on its own
 * card; what stays theirs on their panel, no route into it".
 */
export type L1TermScene =
  | 'team-product-design'
  | 'team-ai-product-ux'
  | 'team-design-engineering'
  | 'team-design-systems'
  | 'team-new-product'
  | 'team-product-modernisation'
  | 'team-software-development'
  | 'needs-product-design'
  | 'needs-ai-product-ux'
  | 'needs-design-engineering'
  | 'needs-design-systems'
  | 'needs-new-product'
  | 'needs-product-modernisation'
  | 'needs-software-development'
  | 'stops-product-design'
  | 'stops-ai-product-ux'
  | 'stops-design-engineering'
  | 'stops-design-systems'
  | 'stops-new-product'
  | 'stops-product-modernisation'
  | 'stops-software-development';

/**
 * WORKING TERM scenes (owner, 1 Nov 2026): About's six terms of how Tcules works with clients, one
 * drawn per term from its own sentence. Named `scope-*` because EngagementOptions draws them as it
 * draws its scopes; never one of How we work together's.
 */
export type WorkingTermSceneName =
  | 'scope-who'
  | 'scope-communication'
  | 'scope-response'
  | 'scope-getting-started'
  | 'scope-turnaround'
  | 'scope-hours';

export type L1SceneName = L1BandScene | L1OutcomeScene | L1SpecialistScene | L1TermScene;

export type SketchName =
  | PageSceneName
  | ServiceSceneName
  | ArticleSceneName
  | ScopeSceneName
  | WorkingTermSceneName
  | TraceSceneName
  | OfferSceneName
  | L1SceneName;

const BY_ROUTE: Readonly<Record<string, ServiceSceneName>> = {
  '/services/new-product-design-first-release': 'new-product',
  '/services/product-design': 'product-design',
  '/services/product-modernisation': 'product-modernisation',
  '/services/design-systems': 'design-systems',
  '/services/ai-product-ux': 'ai-product-ux',
  '/services/design-engineering': 'design-engineering',
  '/services/software-development': 'software-development',
  '/audits': 'audits',
};

/** The scene for a service page's route, or undefined for a route that has none. */
export function sketchForRoute(href: string): ServiceSceneName | undefined {
  return BY_ROUTE[href.split('#')[0] ?? href];
}

/**
 * The specialist services' own scenes, each drawn for that one service from its own words (owner,
 * 26 Oct 2026; the UX & Product Audit's on 29 Oct). A service page's specialist band assigns the same
 * drawings at the content seam; this is the same drawing for the same service wherever it is named.
 */
const SPECIALIST_BY_ROUTE: Readonly<Record<string, OfferSceneName | L1SpecialistScene>> = {
  '/services/product-design/ux-research': 'specialist-research',
  '/services/product-design/information-architecture-workflow-design': 'specialist-ia',
  '/services/product-design/interaction-ui-design': 'specialist-ui',
  '/services/product-design/data-visualisation': 'specialist-dataviz',
  '/services/product-design/prototyping-usability-testing': 'specialist-prototype',
  '/audits/ux-product-audit': 'specialist-audit',
  '/services/ai-product-ux/ai-copilots-agents': 'specialist-ai-copilots',
  '/services/ai-product-ux/ai-search-recommendation': 'specialist-ai-search',
  '/services/ai-product-ux/human-in-the-loop-workflows': 'specialist-ai-hitl',
  '/services/ai-product-ux/trust-control-recovery': 'specialist-ai-trust',
  '/audits/ai-product-ux-readiness': 'specialist-ai-readiness',
  '/services/software-development/ai-product-engineering': 'specialist-ai-engineering',
  '/services/design-systems/design-system-strategy': 'specialist-ds-strategy',
  '/services/design-systems/design-system-implementation': 'specialist-ds-implementation',
  '/services/design-systems/figma-storybook-alignment': 'specialist-ds-alignment',
  '/services/design-systems/governance-adoption': 'specialist-ds-governance',
  '/audits/design-system-audit': 'specialist-ds-audit',
  '/services/product-modernisation/product-redesign': 'specialist-redesign',
  '/services/product-modernisation/legacy-software-modernisation': 'specialist-legacy',
  '/services/product-modernisation/replatforming-product-design': 'specialist-replatforming',
  '/audits/product-modernisation-assessment': 'specialist-modernisation-assessment',
  '/services/software-development/saas-web-app-development': 'specialist-saas-app',
  '/services/software-development/frontend-development': 'specialist-frontend',
  '/services/software-development/backend-api-development': 'specialist-backend',
  '/services/software-development/product-maintenance': 'specialist-maintenance',
  '/services/software-development/mobile-app-development': 'specialist-mobile',
  '/audits/prototype-readiness-review': 'specialist-prototype-review',
};

/**
 * The SERVICE TILE's scene for a named service (owner, 29 Oct 2026; decisions/2026-10-29-named-services-are-service-tiles):
 * the service line's own scene, else the specialist service's. Undefined for a service with no
 * drawing of its own: a set naming one is not drawn, never given another subject's scene.
 */
export function serviceSceneFor(
  href: string,
): ServiceSceneName | OfferSceneName | L1SpecialistScene | undefined {
  const route = href.split('#')[0] ?? href;
  return BY_ROUTE[route] ?? SPECIALIST_BY_ROUTE[route];
}

/**
 * Which offer scene draws which item of a corpus page's band (owner, 26 Oct 2026), keyed by band id,
 * then by the item's title as authored (or a router item's href), and a worked example's two story
 * scenes by its band id. Assigned item by item at the content seam (content/sources/offer-scenes.ts);
 * an item with no row is drawn by nothing, and a band draws only when every item has one.
 */
export type OfferScenes = {
  items: Readonly<Record<string, Readonly<Record<string, SketchName>>>>;
  stories: Readonly<Record<string, readonly [OfferSceneName, OfferSceneName]>>;
};

/** An item's key in `OfferScenes.items`: its words without case, quote marks or end punctuation. */
export function offerSceneKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[“”"‘’'.!?]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[,;:]+$/, '')
    .trim();
}
