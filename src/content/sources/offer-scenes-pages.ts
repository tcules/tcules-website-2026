import type { OfferScenes } from '../../lib/sketches.ts';
import { offerSceneKey } from '../../lib/sketches.ts';

/**
 * Which drawing each "What you get" item of a level-2 service or expertise page carries (owner, 1 Nov
 * 2026), keyed by the item's title as authored. Merged into OFFER_SCENES; each drawing is drawn for its one
 * item (components/Sketch/wyg-*.tsx), so a row here is a decision about one item, never a keyword match.
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
      'what-we-design': by({
        'Model and API platforms with workflow builders, search and documentation': 'kind-ai-products-developer-tools-model-api-platforms-workflow',
        'AI review tools where an engineer signs off each result': 'kind-ai-products-developer-tools-ai-review-tools-engineer',
        'AI-native products shaped from an early idea': 'kind-ai-products-developer-tools-ai-native-products-shaped',
        'AI-assisted survey and research products': 'kind-ai-products-developer-tools-ai-assisted-survey-research',
        'AI writing suggestions added to an existing product': 'kind-ai-products-developer-tools-ai-writing-suggestions-added',
        'UX troubleshooting for an AI software firm': 'kind-ai-products-developer-tools-ux-troubleshooting-ai-software',
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
      'what-we-design': by({
        'Deal and pipeline software for a single industry, such as real estate': 'kind-b2b-saas-workflow-software-deal-pipeline-software-single',
        'Quoting, pricing and approvals (CPQ) shared by several specialists': 'kind-b2b-saas-workflow-software-quoting-pricing-approvals-cpq',
        'Staffing and people operations linking clients, candidates and jobs': 'kind-b2b-saas-workflow-software-staffing-people-operations-linking',
        'Scheduling across teams and companies': 'kind-b2b-saas-workflow-software-scheduling-across-teams-companies',
        'Environment, health, safety and sustainability suites for large firms': 'kind-b2b-saas-workflow-software-environment-health-safety-sustainability',
        'Back-office software for a single trade, such as tyre shops': 'kind-b2b-saas-workflow-software-back-office-software-single',
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
      'what-we-design': by({
        'Building energy products with live data and a digital twin': 'kind-climatetech-energy-building-energy-products-live',
        'Peak-price events and battery suggestions for building operators': 'kind-climatetech-energy-peak-price-events-battery',
        'Safety and sustainability software for large organisations': 'kind-climatetech-energy-safety-sustainability-software-large',
        'EV charging and fleet electrification products': 'kind-climatetech-energy-ev-charging-fleet-electrification',
        'Renewable and storage asset monitoring': 'kind-climatetech-energy-renewable-storage-asset-monitoring',
        'Carbon accounting and emissions reporting tools': 'kind-climatetech-energy-carbon-accounting-emissions-reporting',
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
      'what-we-design': by({
        'Specialist Shopify stores where buyers check fit before buying': 'kind-commerce-transactional-products-specialist-shopify-stores-buyers',
        'Web-to-print and made-to-order ordering': 'kind-commerce-transactional-products-web-print-made-order',
        'Production and fulfilment systems behind the store': 'kind-commerce-transactional-products-production-fulfilment-systems-behind',
        'Listing-content tools for Amazon sellers': 'kind-commerce-transactional-products-listing-content-tools-amazon',
        'B2B ordering and trade portals': 'kind-commerce-transactional-products-b2b-ordering-trade-portals',
        'Subscriptions and repeat ordering': 'kind-commerce-transactional-products-subscriptions-repeat-ordering',
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
      'what-we-design': by({
        'Search and documentation inside a developer platform': 'kind-content-knowledge-discovery-platforms-search-documentation-inside-developer',
        'AI review feeds that keep each source beside its finding': 'kind-content-knowledge-discovery-platforms-ai-review-feeds-keep',
        'Product discovery for specialist catalogues': 'kind-content-knowledge-discovery-platforms-product-discovery-specialist-catalogues',
        'Internal knowledge bases and enterprise search': 'kind-content-knowledge-discovery-platforms-internal-knowledge-bases-enterprise',
        'Policy and document libraries with versions and owners': 'kind-content-knowledge-discovery-platforms-policy-document-libraries-versions',
        'Media and publishing products': 'kind-content-knowledge-discovery-platforms-media-publishing-products',
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
      'what-we-design': by({
        'Customer-facing reports and dashboards inside a SaaS product': 'kind-data-analytics-decision-products-customer-facing-reports-dashboards',
        'Scores that show what they are based on': 'kind-data-analytics-decision-products-scores-show-what-they',
        'Multi-site data filtered to the right part of the organisation': 'kind-data-analytics-decision-products-multi-site-data-filtered',
        'Operational dashboards for tyre shop software': 'kind-data-analytics-decision-products-operational-dashboards-tyre-shop',
        'Ask-the-data analytics, where users type a question': 'kind-data-analytics-decision-products-ask-data-analytics-users',
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
      'what-we-design': by({
        'LMS and Moodle course experiences, with custom themes and plugins': 'kind-edtech-learning-lms-moodle-course-experiences',
        'Creative learning products for young people aged eight to eighteen': 'kind-edtech-learning-creative-learning-products-young',
        'Growth projects inside a learning platform\'s product team': 'kind-edtech-learning-growth-projects-inside-learning',
        'Workplace training and apprenticeship apps': 'kind-edtech-learning-workplace-training-apprenticeship-apps',
        'Assessment and skills sign-off tools': 'kind-edtech-learning-assessment-skills-sign-off',
        'Teacher dashboards and educator views': 'kind-edtech-learning-teacher-dashboards-educator-views',
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
      'what-we-design': by({
        'Mobile lending apps, from sign-up to loan issuance': 'kind-fintech-mobile-lending-apps-sign',
        'Payment apps for small shops and the people who run them': 'kind-fintech-payment-apps-small-shops',
        'Business finance tools for spending, approvals and payouts, including finance inside SaaS products': 'kind-fintech-business-finance-tools-spending',
        'Staff review screens for identity checks, credit approvals and fraud cases': 'kind-fintech-staff-review-screens-identity',
        'Banking and money management apps for balances, transfers and savings goals': 'kind-fintech-banking-money-management-apps',
        'Insurance quote, claims and underwriting tools': 'kind-fintech-insurance-quote-claims-underwriting',
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
      'what-we-design': by({
        'Care platforms that connect families with carers at home': 'kind-healthtech-care-platforms-connect-families',
        'Apps for carers on home visits, used on a phone': 'kind-healthtech-apps-carers-home-visits',
        'Portals and admin tools for healthcare professionals\' congress travel': 'kind-healthtech-portals-admin-tools-healthcare',
        'Clinician tools that sit beside the patient record': 'kind-healthtech-clinician-tools-sit-beside',
        'Patient portals for results, appointments and messages': 'kind-healthtech-patient-portals-results-appointments',
        'Remote check-in apps for care after a hospital stay': 'kind-healthtech-remote-check-apps-care',
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
      'what-we-design': by({
        'Care marketplaces matching families with self-employed carers': 'kind-marketplaces-multi-sided-platforms-care-marketplaces-matching-families',
        'Separate apps for each side, joined by one web platform': 'kind-marketplaces-multi-sided-platforms-separate-apps-side-joined',
        'Booking and rental marketplaces': 'kind-marketplaces-multi-sided-platforms-booking-rental-marketplaces',
        'Freelance and talent marketplaces': 'kind-marketplaces-multi-sided-platforms-freelance-talent-marketplaces',
        'Local service marketplaces for quotes, visits and reviews': 'kind-marketplaces-multi-sided-platforms-local-service-marketplaces-quotes',
        'B2B marketplaces connecting trade buyers with suppliers': 'kind-marketplaces-multi-sided-platforms-b2b-marketplaces-connecting-trade',
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
      'what-we-design': by({
        'Marketing automation and reporting for ecommerce brands': 'kind-martech-salestech-marketing-automation-reporting-ecommerce',
        'Budget and listing-content tools for Amazon sellers': 'kind-martech-salestech-budget-listing-content-tools',
        'Quoting (CPQ) tools shared by sales reps and pricing experts': 'kind-martech-salestech-quoting-cpq-tools-shared',
        'AI-assisted survey and market research products': 'kind-martech-salestech-ai-assisted-survey-market',
        'CRM, pipeline and commission tools': 'kind-martech-salestech-crm-pipeline-commission-tools',
        'Lead management and sales enablement software': 'kind-martech-salestech-lead-management-sales-enablement',
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
      'what-we-design': by({
        'Acquisition and deal-pipeline software for real estate acquisitions teams': 'kind-proptech-contech-field-operations-acquisition-deal-pipeline-software',
        'Listing screens that show which property deserves a closer look': 'kind-proptech-contech-field-operations-listing-screens-show-property',
        'AI drawing checks with an engineer who signs off each one': 'kind-proptech-contech-field-operations-ai-drawing-checks-engineer',
        'Field apps for inspections and site visits': 'kind-proptech-contech-field-operations-field-apps-inspections-site',
        'Defect and handover apps for new homes': 'kind-proptech-contech-field-operations-defect-handover-apps-new',
        'Property management and tenant portals': 'kind-proptech-contech-field-operations-property-management-tenant-portals',
      }),
    },
    stories: {},
  },
  '/services/ai-product-ux/ai-copilots-agents': {
    items: {
      'what-you-get': by({
        'How far the AI goes at each step.': 'wyg-ai-copilots-agents-level-each-step',
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
        'The search box.': 'wyg-ai-search-recommendation-search-entry',
        'Results that show their source.': 'wyg-ai-search-recommendation-results-show-their-source',
        'AI answers with sources.': 'wyg-ai-search-recommendation-ai-answers-sources',
        'Recommendations that explain themselves.': 'wyg-ai-search-recommendation-recommendations-explain-themselves',
        'Ways to fix a bad answer.': 'wyg-ai-search-recommendation-corrections',
        'Results that open where the work is.': 'wyg-ai-search-recommendation-next-step',
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
        'What sends work to a person.': 'wyg-human-in-the-loop-workflows-review-triggers',
        'What the reviewer sees.': 'wyg-human-in-the-loop-workflows-review-card',
        'What the reviewer can do.': 'wyg-human-in-the-loop-workflows-what-reviewer-can-do',
        'Who picks up each item, and when.': 'wyg-human-in-the-loop-workflows-routing-queue',
        'A record of every decision.': 'wyg-human-in-the-loop-workflows-record',
        'How much one reviewer can handle.': 'wyg-human-in-the-loop-workflows-days-workload',
        'When to move to spot checks.': 'wyg-human-in-the-loop-workflows-path-spot-checks',
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
        'What a suggestion shows at each stage.': 'wyg-trust-control-recovery-five-suggestion-states',
        'One mark for AI, everywhere.': 'wyg-trust-control-recovery-one-labelling-rule',
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
        'Awkward cases built first.': 'wyg-coded-prototyping-hard-cases-before-happy',
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
        'The component\'s rules, written down.': 'wyg-frontend-design-systems-its-contract',
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
        'Design tokens named by what they do.': 'wyg-design-system-implementation-design-tokens-named-meaning',
        'Components in Figma and in code.': 'wyg-design-system-implementation-components-both-places',
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
        'What you already have, listed.': 'wyg-design-system-strategy-inventory',
        'What the system covers.': 'wyg-design-system-strategy-scope-map',
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
        'A side-by-side map of Figma and code.': 'wyg-figma-storybook-alignment-correspondence-map-each-component',
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
        'Each workaround\'s cause, named.': 'wyg-governance-adoption-gaps-told-apart',
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
      /* The method's one figure beside its five steps (band {#every-number}). */
      'every-number': by({ figure: 'wyg-data-visualisation-method' }),
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
  '/services/product-design/interaction-ui-design': {
    items: {
      'what-you-get': by({
        'Every state.': 'wyg-interaction-ui-design-every-state',
        'Interaction patterns.': 'wyg-interaction-ui-design-interaction-patterns',
        'Visual design.': 'wyg-interaction-ui-design-visual-design',
        'Small screens.': 'wyg-interaction-ui-design-small-screens',
        'Accessibility.': 'wyg-interaction-ui-design-accessibility',
        'Interface text.': 'wyg-interaction-ui-design-interface-text',
        'Specifications.': 'wyg-interaction-ui-design-specifications',
        'Handover and build review.': 'wyg-interaction-ui-design-handover-build-review',
        'Who does the work': 'team-interaction-ui-design',
        'What we need from you': 'needs-interaction-ui-design',
        'Where our part stops': 'stops-interaction-ui-design',
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
        'Findings you can act on.': 'wyg-ux-research-readout-you-can-act',
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
        'A keep-or-change decision on each rule.': 'wyg-legacy-software-modernisation-keeporchange-call-each-rule',
        'A staged plan.': 'wyg-legacy-software-modernisation-staged-plan',
        'Designs for each stage.': 'wyg-legacy-software-modernisation-designs-each-stage',
        'Help through each rollout.': 'wyg-legacy-software-modernisation-help-through-each-rollout',
        'Who does the work': 'team-legacy-software-modernisation',
        'What we need from you': 'needs-legacy-software-modernisation',
        'Where our part stops': 'stops-legacy-software-modernisation',
      }),
      /* The method's one figure beside its five places an old system hides (band {#discovery}). */
      discovery: by({ figure: 'wyg-legacy-software-modernisation-method' }),
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
      /* The comparison's two options that name no page: each a still plate (band {#compare}). */
      compare: by({
        'Visual refresh': 'wyg-product-redesign-visual-refresh',
        'SaaS product redesign': 'wyg-product-redesign-saas-product-redesign',
      }),
    },
    stories: {},
  },
  '/services/product-modernisation/replatforming-product-design': {
    items: {
      'what-you-get': by({
        'What happens to each feature.': 'wyg-replatforming-product-design-each-features-fate',
        'The changeover months, designed.': 'wyg-replatforming-product-design-months-between-designed',
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
        'Usage, cost and failures after release.': 'wyg-ai-product-engineering-view-after-release',
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
  '/audits/prototype-readiness-review': {
    items: {
      'gap-map': by({
        'What\'s proven, what isn\'t.': 'wyg-prototype-readiness-review-whats-proven-what-isnt',
        'Fixes customers will notice.': 'wyg-prototype-readiness-review-fixes-customers-will-notice',
        'Code worth keeping.': 'wyg-prototype-readiness-review-code-worth-keeping',
        'The work before launch.': 'wyg-prototype-readiness-review-work-before-launch',
        'Who does the work': 'team-prototype-readiness-review',
        'Where our part stops': 'stops-prototype-readiness-review',
      }),
      method: by({ figure: 'method-prototype-readiness-review' }),
    },
    stories: {},
  },
  '/audits/ux-product-audit': {
    items: {
      'deliverables': by({
        'Findings ranked by harm.': 'wyg-ux-product-audit-findings-ranked-by-harm',
        'A next step for each.': 'wyg-ux-product-audit-next-step-each',
        'What each fix takes.': 'wyg-ux-product-audit-what-each-fix-takes',
        'A walkthrough with your team.': 'wyg-ux-product-audit-walkthrough-with-team',
        'Who does the work': 'team-ux-product-audit',
        'Where our part stops': 'stops-ux-product-audit',
      }),
      method: by({ figure: 'method-ux-product-audit' }),
    },
    stories: {},
  },
  '/audits/ai-product-ux-readiness': {
    items: {
      'deliverables': by({
        'A ranked fix list.': 'wyg-ai-product-ux-readiness-ranked-fix-list',
        'Fixes users would notice.': 'wyg-ai-product-ux-readiness-fixes-users-would-notice',
        'Questions for your specialists.': 'wyg-ai-product-ux-readiness-questions-for-specialists',
        'A walkthrough with your team.': 'wyg-ai-product-ux-readiness-walkthrough-with-team',
        'Who does the work': 'team-ai-product-ux-readiness',
        'Where our part stops': 'stops-ai-product-ux-readiness',
      }),
      method: by({ figure: 'method-ai-product-ux-readiness' }),
    },
    stories: {},
  },
  '/audits/design-system-audit': {
    items: {
      'deliverables': by({
        'What to keep.': 'wyg-design-system-audit-what-to-keep',
        'What to repair first.': 'wyg-design-system-audit-what-to-repair-first',
        'Where requests stall.': 'wyg-design-system-audit-where-requests-stall',
        'Early warnings.': 'wyg-design-system-audit-early-warnings',
        'How widely it\'s used.': 'wyg-design-system-audit-how-widely-used',
        'Who does the work': 'team-design-system-audit',
        'Where our part stops': 'stops-design-system-audit',
      }),
      method: by({ figure: 'method-design-system-audit' }),
    },
    stories: {},
  },
  '/audits/design-to-code-audit': {
    items: {
      'deliverables': by({
        'Every gap, side by side.': 'wyg-design-to-code-audit-every-gap-side-by-side',
        'A fix plan.': 'wyg-design-to-code-audit-fix-plan',
        'Stop gaps coming back.': 'wyg-design-to-code-audit-stop-gaps-coming-back',
        'Developer changes worth keeping.': 'wyg-design-to-code-audit-developer-changes-worth-keeping',
        'Who does the work': 'team-design-to-code-audit',
        'Where our part stops': 'stops-design-to-code-audit',
      }),
      method: by({ figure: 'method-design-to-code-audit' }),
    },
    stories: {},
  },
  '/audits/product-modernisation-assessment': {
    items: {
      'deliverables': by({
        'Area-by-area answers.': 'wyg-product-modernisation-assessment-area-by-area-answers',
        'What must survive.': 'wyg-product-modernisation-assessment-what-must-survive',
        'The order of work.': 'wyg-product-modernisation-assessment-order-of-work',
        'Questions to answer first.': 'wyg-product-modernisation-assessment-questions-to-answer-first',
        'Ready for AI features.': 'wyg-product-modernisation-assessment-ready-for-ai-features',
        'Who does the work': 'team-product-modernisation-assessment',
        'Where our part stops': 'stops-product-modernisation-assessment',
      }),
      method: by({ figure: 'method-product-modernisation-assessment' }),
    },
    stories: {},
  },
  /* The lab artefact's "What's inside": the Matter file's three properties, each drawn from its title. */
  '/matter-design-system': {
    items: {
      contents: by({
        'Tokens named for their purpose.': 'wyg-matter-design-system-tokens-named-purpose',
        'Components built from smaller parts.': 'wyg-matter-design-system-components-built-smaller-parts',
        'Naming you can follow.': 'wyg-matter-design-system-naming-you-can-follow',
      }),
    },
    stories: {},
  },
  /* The Lab's four internal tools for design work (drawn Bento tiles) and the promotion figure beside
     its sentence; docs/page-build/pages/future-interfaces-lab.md. */
  '/future-interfaces-lab': {
    items: {
      'design-work': by({
        'Matter Design System': 'wyg-future-interfaces-lab-matter-design-system',
        'AI Design Audit Agent': 'wyg-future-interfaces-lab-ai-design-audit-agent',
        'UI Pattern Vision Labelling Tool': 'wyg-future-interfaces-lab-ui-pattern-vision-labelling-tool',
        'Landing Page Audit Programme': 'wyg-future-interfaces-lab-landing-page-audit-programme',
      }),
      promotion: { figure: 'wyg-future-interfaces-lab-promotion' },
    },
    stories: {},
  },
  /* The method's one figure beside its steps; docs/page-build/pages/future-interfaces-lab-join.md. The
     three role drawings went in pass 2 (owner, 4 Nov 2026): "Who we look for" is glyph-headed cards. */
  '/future-interfaces-lab/join': {
    items: {
      'what-youll-do': { figure: 'wyg-future-interfaces-lab-join-method' },
    },
    stories: {},
  },
} as unknown as Readonly<Record<string, OfferScenes>>;
