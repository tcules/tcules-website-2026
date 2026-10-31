import type { OfferScenes } from '../../lib/sketches.ts';
import { offerSceneKey } from '../../lib/sketches.ts';

/**
 * Which drawing each "What you get" item of a level-2 service or expertise page carries (owner, 1 Nov
 * 2026), keyed by the item's title as authored. Merged into OFFER_SCENES; each drawing is drawn for its one
 * item (components/Sketch/pages), so a row here is a decision about one item, never a keyword match.
 */
const by = (rows: Record<string, string>) =>
  Object.fromEntries(Object.entries(rows).map(([title, scene]) => [offerSceneKey(title), scene]));

export const PAGE_OFFER_SCENES = {
  '/expertise/ai-products-developer-tools': {
    items: {
      'what-you-get': by({
        'A first working result': 'wyg-ai-products-developer-tools-first-working-result',
        'Documentation beside the work': 'wyg-ai-products-developer-tools-documentation-beside-work',
        'A written split': 'wyg-ai-products-developer-tools-written-split',
        'Sources and limits': 'wyg-ai-products-developer-tools-sources-limits',
        'Prototypes tested': 'wyg-ai-products-developer-tools-prototypes-tested',
        'Specs your developers build from': 'wyg-ai-products-developer-tools-specs-developers-build-from',
        'Who does the work': 'team-ai-products-developer-tools',
        'What we need from you': 'needs-ai-products-developer-tools',
        'Where our part stops': 'stops-ai-products-developer-tools',
      }),
    },
    stories: {},
  },
  '/expertise/b2b-saas-workflow-software': {
    items: {
      'what-you-get': by({
        'The workflow map': 'wyg-b2b-saas-workflow-software-workflow-map',
        'Screens for each role': 'wyg-b2b-saas-workflow-software-screens-each-role',
        'Admin, permission and audit screens': 'wyg-b2b-saas-workflow-software-admin-permission-audit-screens',
        'How an agent\'s work appears': 'wyg-b2b-saas-workflow-software-how-agents-work-appears',
        'Prototypes tested': 'wyg-b2b-saas-workflow-software-prototypes-tested',
        'Parts your engineers can build from': 'wyg-b2b-saas-workflow-software-parts-engineers-can-build',
        'Who does the work': 'team-b2b-saas-workflow-software',
        'What we need from you': 'needs-b2b-saas-workflow-software',
        'Where our part stops': 'stops-b2b-saas-workflow-software',
      }),
    },
    stories: {},
  },
  '/expertise/climatetech-energy': {
    items: {
      'what-you-get': by({
        'Each role\'s view of the same figures': 'wyg-climatetech-energy-each-roles-view-same',
        'Readings, forecasts and targets marked apart': 'wyg-climatetech-energy-readings-forecasts-targets-marked',
        'A digital twin or site view': 'wyg-climatetech-energy-digital-twin-or-site',
        'Totals that open onto their sources': 'wyg-climatetech-energy-totals-open-onto-their',
        'The limits people set, and a morning view': 'wyg-climatetech-energy-limits-people-set-morning',
        'A coded demo on sample data': 'wyg-climatetech-energy-coded-demo-sample-data',
        'Specs your engineers build from': 'wyg-climatetech-energy-specs-engineers-build-from',
        'Who does the work': 'team-climatetech-energy',
        'What we need from you': 'needs-climatetech-energy',
        'Where our part stops': 'stops-climatetech-energy',
      }),
    },
    stories: {},
  },
  '/expertise/commerce-transactional-products': {
    items: {
      'what-you-get': by({
        'Research from support emails and search terms': 'wyg-commerce-transactional-products-research-from-support-emails',
        'Product pages that answer fit': 'wyg-commerce-transactional-products-product-pages-answer-fit',
        'A checkout with the checks your products need': 'wyg-commerce-transactional-products-checkout-checks-products-need',
        'Order, production and delivery status': 'wyg-commerce-transactional-products-order-production-delivery-status',
        'One set of components': 'wyg-commerce-transactional-products-one-set-components',
        'Prototypes tested with buyers': 'wyg-commerce-transactional-products-prototypes-tested-buyers',
        'The store built on Shopify or Magento': 'wyg-commerce-transactional-products-store-built-shopify-or',
        'Who does the work': 'team-commerce-transactional-products',
        'What we need from you': 'needs-commerce-transactional-products',
        'Where our part stops': 'stops-commerce-transactional-products',
      }),
    },
    stories: {},
  },
  '/expertise/content-knowledge-discovery-platforms': {
    items: {
      'what-you-get': by({
        'A review of the searches that fail': 'wyg-content-knowledge-discovery-platforms-review-searches-fail',
        'Experts and newcomers in the same box': 'wyg-content-knowledge-discovery-platforms-experts-newcomers-same-box',
        'Results that show source and owner': 'wyg-content-knowledge-discovery-platforms-results-show-source-owner',
        'AI answers linked to their passages': 'wyg-content-knowledge-discovery-platforms-ai-answers-linked-their',
        'A route to the next task': 'wyg-content-knowledge-discovery-platforms-route-next-task',
        'Prototypes tested with your real documents': 'wyg-content-knowledge-discovery-platforms-prototypes-tested-real-documents',
        'What the screens need from your search engine': 'wyg-content-knowledge-discovery-platforms-what-screens-need-from',
        'Who does the work': 'team-content-knowledge-discovery-platforms',
        'What we need from you': 'needs-content-knowledge-discovery-platforms',
        'Where our part stops': 'stops-content-knowledge-discovery-platforms',
      }),
    },
    stories: {},
  },
  '/expertise/data-analytics-decision-products': {
    items: {
      'what-you-get': by({
        'A definition for each figure': 'wyg-data-analytics-decision-products-definition-each-figure',
        'Views at different depths': 'wyg-data-analytics-decision-products-views-at-different-depths',
        'Charts that show their baseline': 'wyg-data-analytics-decision-products-charts-show-their-baseline',
        'The next step beside the figure': 'wyg-data-analytics-decision-products-next-step-beside-figure',
        'Screens for missing and late data': 'wyg-data-analytics-decision-products-screens-missing-late-data',
        'Saved views and filters': 'wyg-data-analytics-decision-products-saved-views-filters',
        'Prototypes with realistic figures': 'wyg-data-analytics-decision-products-prototypes-realistic-figures',
        'Who does the work': 'team-data-analytics-decision-products',
        'What we need from you': 'needs-data-analytics-decision-products',
        'Where our part stops': 'stops-data-analytics-decision-products',
      }),
    },
    stories: {},
  },
  '/expertise/edtech-learning': {
    items: {
      'what-you-get': by({
        'Research with learners and educators': 'wyg-edtech-learning-research-learners-educators',
        'An audit with a plain verdict': 'wyg-edtech-learning-audit-plain-verdict',
        'Content regrouped': 'wyg-edtech-learning-content-regrouped',
        'Views built around who needs help': 'wyg-edtech-learning-views-built-around-who',
        'Hybrid wireframes': 'wyg-edtech-learning-hybrid-wireframes',
        'Parent views for younger learners': 'wyg-edtech-learning-parent-views-younger-learners',
        'Configured in Moodle or your LMS': 'wyg-edtech-learning-configured-moodle-or-lms',
        'Who does the work': 'team-edtech-learning',
        'What we need from you': 'needs-edtech-learning',
        'Where our part stops': 'stops-edtech-learning',
      }),
    },
    stories: {},
  },
  '/expertise/fintech': {
    items: {
      'what-you-get': by({
        'A status map': 'wyg-fintech-status-map',
        'Customer journeys': 'wyg-fintech-customer-journeys',
        'Review and approval screens': 'wyg-fintech-review-approval-screens',
        'Reasons, disclosures and consent wording': 'wyg-fintech-reasons-disclosures-consent-wording',
        'Research with the people the product is for': 'wyg-fintech-research-people-product-is',
        'Prototypes with realistic figures': 'wyg-fintech-prototypes-realistic-figures',
        'Designs ready for your engineers': 'wyg-fintech-designs-ready-engineers',
        'Who does the work': 'team-fintech',
        'What we need from you': 'needs-fintech',
        'Where our part stops': 'stops-fintech',
      }),
    },
    stories: {},
  },
  '/expertise/fintech-insurtech': {
    items: {
      'what-you-get': by({
        'A status map': 'wyg-fintech-insurtech-status-map',
        'Customer journeys': 'wyg-fintech-insurtech-customer-journeys',
        'Review and approval screens': 'wyg-fintech-insurtech-review-approval-screens',
        'Reasons, disclosures and consent wording': 'wyg-fintech-insurtech-reasons-disclosures-consent-wording',
        'Research with the people the product is for': 'wyg-fintech-insurtech-research-people-product-is',
        'Prototypes with realistic figures': 'wyg-fintech-insurtech-prototypes-realistic-figures',
        'Designs ready for your engineers': 'wyg-fintech-insurtech-designs-ready-engineers',
        'Who does the work': 'team-fintech-insurtech',
        'What we need from you': 'needs-fintech-insurtech',
        'Where our part stops': 'stops-fintech-insurtech',
      }),
    },
    stories: {},
  },
  '/expertise/healthtech': {
    items: {
      'what-you-get': by({
        'Each role\'s journey around one patient': 'wyg-healthtech-each-roles-journey-around',
        'Consent, sharing and access steps': 'wyg-healthtech-consent-sharing-access-steps',
        'Research with patients, families, clinicians and carers': 'wyg-healthtech-research-patients-families-clinicians',
        'Wireframes with the reasoning written down': 'wyg-healthtech-wireframes-reasoning-written-down',
        'Screens designed for accessibility': 'wyg-healthtech-screens-designed-accessibility',
        'Designs your developers build from': 'wyg-healthtech-designs-developers-build-from',
        'Who does the work': 'team-healthtech',
        'What we need from you': 'needs-healthtech',
        'Where our part stops': 'stops-healthtech',
      }),
    },
    stories: {},
  },
  '/expertise/marketplaces-multi-sided-platforms': {
    items: {
      'what-you-get': by({
        'What changes hands': 'wyg-marketplaces-multi-sided-platforms-what-changes-hands',
        'Research with buyers, providers and your operations staff': 'wyg-marketplaces-multi-sided-platforms-research-buyers-providers-operations',
        'Screens drawn together on one record': 'wyg-marketplaces-multi-sided-platforms-screens-drawn-together-one',
        'Cancellations and disputes as stages': 'wyg-marketplaces-multi-sided-platforms-cancellations-disputes-as-stages',
        'Operations and trust tools': 'wyg-marketplaces-multi-sided-platforms-operations-trust-tools',
        'Screens your engineers build from': 'wyg-marketplaces-multi-sided-platforms-screens-engineers-build-from',
        'Who does the work': 'team-marketplaces-multi-sided-platforms',
        'What we need from you': 'needs-marketplaces-multi-sided-platforms',
        'Where our part stops': 'stops-marketplaces-multi-sided-platforms',
      }),
    },
    stories: {},
  },
  '/expertise/martech-salestech': {
    items: {
      'what-you-get': by({
        'Interviews with marketers and reps': 'wyg-martech-salestech-interviews-marketers-reps',
        'Reports with the next action': 'wyg-martech-salestech-reports-next-action',
        'AI draft review': 'wyg-martech-salestech-ai-draft-review',
        'The shared record': 'wyg-martech-salestech-shared-record',
        'Consent and unsubscribe states': 'wyg-martech-salestech-consent-unsubscribe-states',
        'Shared filters, states and data displays': 'wyg-martech-salestech-shared-filters-states-data',
        'Designs your engineers build from': 'wyg-martech-salestech-designs-engineers-build-from',
        'Who does the work': 'team-martech-salestech',
        'What we need from you': 'needs-martech-salestech',
        'Where our part stops': 'stops-martech-salestech',
      }),
    },
    stories: {},
  },
  '/expertise/proptech-contech-field-operations': {
    items: {
      'what-you-get': by({
        'An audit of the live product': 'wyg-proptech-contech-field-operations-audit-live-product',
        'Research at desks and on site': 'wyg-proptech-contech-field-operations-research-at-desks-site',
        'Every role in the sign-off chain': 'wyg-proptech-contech-field-operations-every-role-signoff-chain',
        'One record of each property': 'wyg-proptech-contech-field-operations-one-record-each-property',
        'Field moments tried in working prototypes': 'wyg-proptech-contech-field-operations-field-moments-tried-working',
        'A change that fits your existing product': 'wyg-proptech-contech-field-operations-change-fits-existing-product',
        'Who does the work': 'team-proptech-contech-field-operations',
        'What we need from you': 'needs-proptech-contech-field-operations',
        'Where our part stops': 'stops-proptech-contech-field-operations',
      }),
    },
    stories: {},
  },
  '/services/ai-product-ux/ai-copilots-agents': {
    items: {
      'what-you-get': by({
        'A level for each step.': 'wyg-ai-copilots-agents-level-each-step',
        'Screens for the start and the middle of a job.': 'wyg-ai-copilots-agents-screens-start-middle-job',
        'Screens for the pause and the finish.': 'wyg-ai-copilots-agents-screens-pause-finish',
        'Agent approval flows.': 'wyg-ai-copilots-agents-agent-approval-flows',
        'Access and memory controls.': 'wyg-ai-copilots-agents-access-memory-controls',
        'Undo and repair.': 'wyg-ai-copilots-agents-undo-repair',
        'The riskiest step in code.': 'wyg-ai-copilots-agents-riskiest-step-code',
        'Who does the work': 'team-ai-copilots-agents',
        'What we need from you': 'needs-ai-copilots-agents',
        'Where our part stops': 'stops-ai-copilots-agents',
      }),
    },
    stories: {},
  },
  '/services/ai-product-ux/ai-search-recommendation': {
    items: {
      'what-you-get': by({
        'Search entry.': 'wyg-ai-search-recommendation-search-entry',
        'Results that show their source.': 'wyg-ai-search-recommendation-results-show-their-source',
        'AI answers with sources.': 'wyg-ai-search-recommendation-ai-answers-sources',
        'Recommendations that explain themselves.': 'wyg-ai-search-recommendation-recommendations-explain-themselves',
        'Corrections.': 'wyg-ai-search-recommendation-corrections',
        'The next step.': 'wyg-ai-search-recommendation-next-step',
        'A test on your own content.': 'wyg-ai-search-recommendation-test-own-content',
        'Who does the work': 'team-ai-search-recommendation',
        'What we need from you': 'needs-ai-search-recommendation',
        'Where our part stops': 'stops-ai-search-recommendation',
      }),
    },
    stories: {},
  },
  '/services/ai-product-ux/human-in-the-loop-workflows': {
    items: {
      'what-you-get': by({
        'Review triggers.': 'wyg-human-in-the-loop-workflows-review-triggers',
        'The review card.': 'wyg-human-in-the-loop-workflows-review-card',
        'What the reviewer can do.': 'wyg-human-in-the-loop-workflows-what-reviewer-can-do',
        'Routing and the queue.': 'wyg-human-in-the-loop-workflows-routing-queue',
        'The record.': 'wyg-human-in-the-loop-workflows-record',
        'A day\'s workload.': 'wyg-human-in-the-loop-workflows-days-workload',
        'A path to spot checks.': 'wyg-human-in-the-loop-workflows-path-spot-checks',
        'A test on past cases.': 'wyg-human-in-the-loop-workflows-test-past-cases',
        'Who does the work': 'team-human-in-the-loop-workflows',
        'What we need from you': 'needs-human-in-the-loop-workflows',
        'Where our part stops': 'stops-human-in-the-loop-workflows',
      }),
    },
    stories: {},
  },
  '/services/ai-product-ux/trust-control-recovery': {
    items: {
      'what-you-get': by({
        'Five suggestion states.': 'wyg-trust-control-recovery-five-suggestion-states',
        'One labelling rule.': 'wyg-trust-control-recovery-one-labelling-rule',
        'Buttons for common fixes.': 'wyg-trust-control-recovery-buttons-common-fixes',
        'Overrides that keep a record.': 'wyg-trust-control-recovery-overrides-keep-record',
        'Recovery messages.': 'wyg-trust-control-recovery-recovery-messages',
        'A test of the moment after a wrong answer.': 'wyg-trust-control-recovery-test-moment-after-wrong',
        'Who does the work': 'team-trust-control-recovery',
        'What we need from you': 'needs-trust-control-recovery',
        'Where our part stops': 'stops-trust-control-recovery',
      }),
    },
    stories: {},
  },
  '/services/design-engineering/coded-prototyping': {
    items: {
      'what-you-get': by({
        'The question, agreed first.': 'wyg-coded-prototyping-question-agreed-first',
        'The hard cases before the happy path.': 'wyg-coded-prototyping-hard-cases-before-happy',
        'Real or representative data.': 'wyg-coded-prototyping-real-or-representative-data',
        'A working session.': 'wyg-coded-prototyping-working-session',
        'A short write-up.': 'wyg-coded-prototyping-short-writeup',
        'Who does the work': 'team-coded-prototyping',
        'What we need from you': 'needs-coded-prototyping',
        'Where our part stops': 'stops-coded-prototyping',
      }),
    },
    stories: {},
  },
  '/services/design-engineering/design-to-code': {
    items: {
      'what-you-get': by({
        'The missing states, designed.': 'wyg-design-to-code-missing-states-designed',
        'Each part mapped to your components.': 'wyg-design-to-code-each-part-mapped-components',
        'What must stay exact, marked.': 'wyg-design-to-code-what-must-stay-exact',
        'A buildable spec': 'wyg-design-to-code-buildable-spec',
        'A working example': 'wyg-design-to-code-working-example',
        'Code in your product': 'wyg-design-to-code-code-product',
        'Answers during the build.': 'wyg-design-to-code-answers-during-build',
        'Who does the work': 'team-design-to-code',
        'What we need from you': 'needs-design-to-code',
        'Where our part stops': 'stops-design-to-code',
      }),
    },
    stories: {},
  },
  '/services/design-engineering/frontend-design-systems': {
    items: {
      'what-you-get': by({
        'The component, rebuilt in code.': 'wyg-frontend-design-systems-component-rebuilt-code',
        'Its contract.': 'wyg-frontend-design-systems-its-contract',
        'Every state on show.': 'wyg-frontend-design-systems-every-state-show',
        'Automatic checks.': 'wyg-frontend-design-systems-automatic-checks',
        'Notes to extend it.': 'wyg-frontend-design-systems-notes-extend-it',
        'Who does the work': 'team-frontend-design-systems',
        'What we need from you': 'needs-frontend-design-systems',
        'Where our part stops': 'stops-frontend-design-systems',
      }),
    },
    stories: {},
  },
  '/services/design-engineering/implementation-qa': {
    items: {
      'what-you-get': by({
        'The build checked screen by screen.': 'wyg-implementation-qa-build-checked-screen-screen',
        'Every difference sorted.': 'wyg-implementation-qa-every-difference-sorted',
        'A fix list engineers can act on.': 'wyg-implementation-qa-fix-list-engineers-can',
        'Retests until it closes.': 'wyg-implementation-qa-retests-until-it-closes',
        'Fixes, if you want them.': 'wyg-implementation-qa-fixes-if-you-want',
        'Who does the work': 'team-implementation-qa',
        'What we need from you': 'needs-implementation-qa',
        'Where our part stops': 'stops-implementation-qa',
      }),
    },
    stories: {},
  },
  '/services/design-systems/design-system-implementation': {
    items: {
      'what-you-get': by({
        'Design tokens named by meaning.': 'wyg-design-system-implementation-design-tokens-named-meaning',
        'Components in both places.': 'wyg-design-system-implementation-components-both-places',
        'Documentation.': 'wyg-design-system-implementation-documentation',
        'Versioning and releases.': 'wyg-design-system-implementation-versioning-releases',
        'The system on a real area of your product.': 'wyg-design-system-implementation-system-real-area-product',
        'Who does the work': 'team-design-system-implementation',
        'What we need from you': 'needs-design-system-implementation',
        'Where our part stops': 'stops-design-system-implementation',
      }),
    },
    stories: {},
  },
  '/services/design-systems/design-system-strategy': {
    items: {
      'what-you-get': by({
        'An inventory.': 'wyg-design-system-strategy-inventory',
        'A scope map.': 'wyg-design-system-strategy-scope-map',
        'A structure for the system.': 'wyg-design-system-strategy-structure-system',
        'Owners and contribution rules.': 'wyg-design-system-strategy-owners-contribution-rules',
        'A design system roadmap.': 'wyg-design-system-strategy-design-system-roadmap',
        'A business case in your numbers.': 'wyg-design-system-strategy-business-case-numbers',
        'Rules for AI coding tools.': 'wyg-design-system-strategy-rules-ai-coding-tools',
        'Who does the work': 'team-design-system-strategy',
        'What we need from you': 'needs-design-system-strategy',
        'Where our part stops': 'stops-design-system-strategy',
      }),
    },
    stories: {},
  },
  '/services/design-systems/figma-storybook-alignment': {
    items: {
      'what-you-get': by({
        'A correspondence map for each component family.': 'wyg-figma-storybook-alignment-correspondence-map-each-component',
        'The gaps that matter, fixed.': 'wyg-figma-storybook-alignment-gaps-matter-fixed',
        'A Storybook entry for each case.': 'wyg-figma-storybook-alignment-storybook-entry-each-case',
        'Behaviour written where designers can see it.': 'wyg-figma-storybook-alignment-behaviour-written-where-designers',
        'A written rule for who decides.': 'wyg-figma-storybook-alignment-written-rule-who-decides',
        'Checks and release notes.': 'wyg-figma-storybook-alignment-checks-release-notes',
        'Who does the work': 'team-figma-storybook-alignment',
        'What we need from you': 'needs-figma-storybook-alignment',
        'Where our part stops': 'stops-figma-storybook-alignment',
      }),
    },
    stories: {},
  },
  '/services/design-systems/governance-adoption': {
    items: {
      'what-you-get': by({
        'A map of where teams leave the system.': 'wyg-governance-adoption-map-where-teams-leave',
        'Gaps told apart.': 'wyg-governance-adoption-gaps-told-apart',
        'Named owners.': 'wyg-governance-adoption-named-owners',
        'A path for every change.': 'wyg-governance-adoption-path-every-change',
        'A governance model.': 'wyg-governance-adoption-governance-model',
        'An exceptions register.': 'wyg-governance-adoption-exceptions-register',
        'A way to retire components.': 'wyg-governance-adoption-way-retire-components',
        'Adoption measures.': 'wyg-governance-adoption-adoption-measures',
        'Who does the work': 'team-governance-adoption',
        'What we need from you': 'needs-governance-adoption',
        'Where our part stops': 'stops-governance-adoption',
      }),
    },
    stories: {},
  },
  '/services/product-design/data-visualisation': {
    items: {
      'what-you-get': by({
        'A view for each role.': 'wyg-data-visualisation-view-each-role',
        'Every number defined.': 'wyg-data-visualisation-every-number-defined',
        'A comparison for every figure.': 'wyg-data-visualisation-comparison-every-figure',
        'Charts, tables, filters and drill-downs': 'wyg-data-visualisation-charts-tables-filters-drilldowns',
        'Screens for imperfect data.': 'wyg-data-visualisation-screens-imperfect-data',
        'Thresholds and alerts': 'wyg-data-visualisation-thresholds-alerts',
        'Views tried with real numbers.': 'wyg-data-visualisation-views-tried-real-numbers',
        'Who does the work': 'team-data-visualisation',
        'What we need from you': 'needs-data-visualisation',
        'Where our part stops': 'stops-data-visualisation',
      }),
    },
    stories: {},
  },
  '/services/product-design/information-architecture-workflow-design': {
    items: {
      'what-you-get': by({
        'A map of your records.': 'wyg-information-architecture-workflow-design-map-records',
        'Roles and permissions.': 'wyg-information-architecture-workflow-design-roles-permissions',
        'Statuses and rules.': 'wyg-information-architecture-workflow-design-statuses-rules',
        'Every hand-off designed.': 'wyg-information-architecture-workflow-design-every-handoff-designed',
        'Navigation.': 'wyg-information-architecture-workflow-design-navigation',
        'Clickable prototypes': 'wyg-information-architecture-workflow-design-clickable-prototypes',
        'The reasoning, written down': 'wyg-information-architecture-workflow-design-reasoning-written-down',
        'Who does the work': 'team-information-architecture-workflow-design',
        'What we need from you': 'needs-information-architecture-workflow-design',
        'Where our part stops': 'stops-information-architecture-workflow-design',
      }),
    },
    stories: {},
  },
  '/services/product-design/prototyping-usability-testing': {
    items: {
      'what-you-get': by({
        'The prototype the question needs.': 'wyg-prototyping-usability-testing-prototype-question-needs',
        'People who match your users.': 'wyg-prototyping-usability-testing-people-who-match-users',
        'Realistic tasks.': 'wyg-prototyping-usability-testing-realistic-tasks',
        'Moderated sessions your team can watch.': 'wyg-prototyping-usability-testing-moderated-sessions-team-can',
        'A report after each round.': 'wyg-prototyping-usability-testing-report-after-each-round',
        'A revised design': 'wyg-prototyping-usability-testing-revised-design',
        'Who does the work': 'team-prototyping-usability-testing',
        'What we need from you': 'needs-prototyping-usability-testing',
        'Where our part stops': 'stops-prototyping-usability-testing',
      }),
    },
    stories: {},
  },
  '/services/product-design/ux-research': {
    items: {
      'what-you-get': by({
        'The question, written down.': 'wyg-ux-research-question-written-down',
        'A plan that starts from what you hold.': 'wyg-ux-research-plan-starts-from-what',
        'Interviews and observation.': 'wyg-ux-research-interviews-observation',
        'Every source checked against the others.': 'wyg-ux-research-every-source-checked-against',
        'A readout you can act on.': 'wyg-ux-research-readout-you-can-act',
        'Who does the work': 'team-ux-research',
        'What we need from you': 'needs-ux-research',
        'Where our part stops': 'stops-ux-research',
      }),
    },
    stories: {},
  },
  '/services/product-modernisation/legacy-software-modernisation': {
    items: {
      'what-you-get': by({
        'A map of what the system really does.': 'wyg-legacy-software-modernisation-map-what-system-really',
        'A keep-or-change call on each rule.': 'wyg-legacy-software-modernisation-keeporchange-call-each-rule',
        'A staged plan.': 'wyg-legacy-software-modernisation-staged-plan',
        'Designs for each stage.': 'wyg-legacy-software-modernisation-designs-each-stage',
        'Help through each rollout.': 'wyg-legacy-software-modernisation-help-through-each-rollout',
        'Who does the work': 'team-legacy-software-modernisation',
        'What we need from you': 'needs-legacy-software-modernisation',
        'Where our part stops': 'stops-legacy-software-modernisation',
      }),
    },
    stories: {},
  },
  '/services/product-modernisation/product-redesign': {
    items: {
      'what-you-get': by({
        'A record of what customers rely on.': 'wyg-product-redesign-record-what-customers-rely',
        'Research and diagnosis.': 'wyg-product-redesign-research-diagnosis',
        'Structure and workflows.': 'wyg-product-redesign-structure-workflows',
        'Screens in every state.': 'wyg-product-redesign-screens-every-state',
        'Shared components.': 'wyg-product-redesign-shared-components',
        'A rollout plan.': 'wyg-product-redesign-rollout-plan',
        'Specifications, or the build.': 'wyg-product-redesign-specifications-or-build',
        'Who does the work': 'team-product-redesign',
        'What we need from you': 'needs-product-redesign',
        'Where our part stops': 'stops-product-redesign',
      }),
    },
    stories: {},
  },
  '/services/product-modernisation/replatforming-product-design': {
    items: {
      'what-you-get': by({
        'Each feature\'s fate.': 'wyg-replatforming-product-design-each-features-fate',
        'The months in between, designed.': 'wyg-replatforming-product-design-months-between-designed',
        'A plan for saved work.': 'wyg-replatforming-product-design-plan-saved-work',
        'Names that still make sense.': 'wyg-replatforming-product-design-names-still-make-sense',
        'Risky interactions tried in code': 'wyg-replatforming-product-design-risky-interactions-tried-code',
        'Help with the platform choice': 'wyg-replatforming-product-design-help-platform-choice',
        'Who does the work': 'team-replatforming-product-design',
        'What we need from you': 'needs-replatforming-product-design',
        'Where our part stops': 'stops-replatforming-product-design',
      }),
    },
    stories: {},
  },
  '/services/software-development/ai-product-engineering': {
    items: {
      'what-you-get': by({
        'A working AI feature.': 'wyg-ai-product-engineering-working-ai-feature',
        'Data inside each user\'s permissions.': 'wyg-ai-product-engineering-data-inside-each-users',
        'Tests you can rerun.': 'wyg-ai-product-engineering-tests-you-can-rerun',
        'A model chosen for each task.': 'wyg-ai-product-engineering-model-chosen-each-task',
        'Corrections that become tests.': 'wyg-ai-product-engineering-corrections-become-tests',
        'A view after release.': 'wyg-ai-product-engineering-view-after-release',
        'Documented code in your codebase': 'wyg-ai-product-engineering-documented-code-codebase',
        'Who does the work': 'team-ai-product-engineering',
        'What we need from you': 'needs-ai-product-engineering',
        'Where our part stops': 'stops-ai-product-engineering',
      }),
    },
    stories: {},
  },
  '/services/software-development/backend-api-development': {
    items: {
      'what-you-get': by({
        'The rules written down.': 'wyg-backend-api-development-rules-written-down',
        'The riskiest gaps closed first.': 'wyg-backend-api-development-riskiest-gaps-closed-first',
        'Tested endpoints.': 'wyg-backend-api-development-tested-endpoints',
        'Integrations planned for failure.': 'wyg-backend-api-development-integrations-planned-failure',
        'An API that agents can use safely.': 'wyg-backend-api-development-api-agents-can-use',
        'A backend your team can run.': 'wyg-backend-api-development-backend-team-can-run',
        'Who does the work': 'team-backend-api-development',
        'What we need from you': 'needs-backend-api-development',
        'Where our part stops': 'stops-backend-api-development',
      }),
    },
    stories: {},
  },
} as unknown as Readonly<Record<string, OfferScenes>>;
