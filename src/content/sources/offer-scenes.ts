import { offerSceneKey, type OfferScenes, type SketchName } from '../../lib/sketches.ts';
import { PAGE_OFFER_SCENES } from './offer-scenes-pages.ts';

/**
 * The drawings a corpus offer page's items carry (owner, 26 Oct 2026, product-design page, mock
 * rounds 1–4), by route. Each scene is drawn for its one item from that item's own words
 * (components/Sketch/offer.tsx), so a row here is a decision about one item, never a keyword match.
 * A page with no entry draws nothing new: its bands keep their undrawn arrangements.
 */
const by = (rows: Record<string, SketchName>) =>
  Object.fromEntries(
    Object.entries(rows).map(([title, scene]) => [offerSceneKey(title), scene]),
  );

export const OFFER_SCENES: Readonly<Record<string, OfferScenes>> = {
  /* The level-2 service and expertise pages' What you get (owner, 1 Nov 2026): offer-scenes-pages.ts. */
  ...PAGE_OFFER_SCENES,
  '/services/product-design': {
    items: {
      outcomes: by({
        'A product that needs less explaining.': 'outcome-explain',
        'Complex rules, simple screens.': 'outcome-rules',
        'Fewer surprises in development.': 'outcome-build',
        'An interface that feels finished.': 'outcome-finished',
      }),
      /* The 26 Oct copy's "What you receive" (component-map C4): each deliverable takes the scene
         drawn for what it delivers. The model of roles and rules is the matrix behind one switch;
         every screen and state is the card loading, empty, in error and finished; the tested
         prototype is the idea put in front of a person; designs ready to build are the screen and its
         variants handed to code. The tested brief has its own scene (outcome-brief, 29 Oct 2026). The items are keyed by their
         titles (owner, 30 Oct 2026). */
      'what-you-get': by({
        'Who does the work': 'team-product-design',
        'A tested brief': 'outcome-brief',
        'A model': 'outcome-rules',
        'Interaction & Visual Design': 'outcome-finished',
        Prototypes: 'symptom-test',
        'Ready to build': 'outcome-build',
        'What we need from you': 'needs-product-design',
        'Where our part stops': 'stops-product-design',
      }),
      'starting-points': by({
        '"Customers keep getting stuck."': 'symptom-stuck',
        '"The product has grown messy."': 'symptom-messy',
        '"We want to test an idea before building it."': 'symptom-test',
        '"Every screen looks slightly different."': 'symptom-consistent',
        '"What ships doesn\'t match the design."': 'symptom-match',
      }),
      /* The 26 Oct copy's seven services you can hire on their own (owner, 29 Oct 2026, Q7): the five
         specialist scenes, and two drawn for this band, New Product Design and the UX & Product
         Audit. */
      'services-on-their-own': {
        '/services/product-design/ux-research': 'specialist-research',
        '/services/product-design/information-architecture-workflow-design': 'specialist-ia',
        '/services/product-design/interaction-ui-design': 'specialist-ui',
        '/services/product-design/data-visualisation': 'specialist-dataviz',
        '/services/product-design/prototyping-usability-testing': 'specialist-prototype',
        '/services/new-product-design-first-release': 'specialist-new-product',
        '/audits/ux-product-audit': 'specialist-audit',
      },
      'specialist-capabilities': {
        '/services/product-design/ux-research': 'specialist-research',
        '/services/product-design/information-architecture-workflow-design': 'specialist-ia',
        '/services/product-design/interaction-ui-design': 'specialist-ui',
        '/services/product-design/data-visualisation': 'specialist-dataviz',
        '/services/product-design/prototyping-usability-testing': 'specialist-prototype',
      },
    },
    stories: {
      'worked-example': ['case-dealpath-problem', 'case-dealpath-did'],
    },
  },

  '/services/ai-product-ux': {
    items: {
      'what-you-get': by({
        'Who does the work': 'team-ai-product-ux',
        'What the AI may do at each step': 'outcome-ai-steps',
        'The checks people need': 'outcome-ai-checks',
        'Behaviour tried in code on sample data': 'outcome-tried-in-code',
        'Screens for every state': 'outcome-finished',
        'Specs your engineers build from': 'outcome-build',
        'What we need from you': 'needs-ai-product-ux',
        'Where our part stops': 'stops-ai-product-ux',
      }),
      autonomy: by({
        Finds: 'autonomy-finds',
        Suggests: 'autonomy-suggests',
        Drafts: 'autonomy-drafts',
        Acts: 'autonomy-acts',
      }),
      'whats-next': by({ scenario: 'scenario-overnight-agent' }),
    },
    stories: {},
  },
  '/services/design-engineering': {
    items: {
      'what-you-get': by({
        'Who does the work': 'team-design-engineering',
        'A coded prototype': 'outcome-tried-in-code',
        'Behaviour your developers can build from': 'outcome-build',
        'Hard components built to hold up': 'outcome-hard-component',
        'A check of what shipped': 'symptom-match',
        'Production code': 'outcome-code-in-repo',
        'What we need from you': 'needs-design-engineering',
        'Where our part stops': 'stops-design-engineering',
      }),
      method: by({ scenario: 'scenario-drag-overload', figure: 'method-test-in-code' }),
      compare: by({
        'Design engineering': 'design-engineering',
        'Design Systems': 'design-systems',
        'Frontend Development': 'specialist-frontend',
        'Prototyping & Usability Testing': 'specialist-prototype',
      }),
    },
    stories: {},
  },
  '/services/design-systems': {
    items: {
      'what-you-get': by({
        'Who does the work': 'team-design-systems',
        'Foundations named by meaning': 'outcome-ds-tokens',
        'Components in Figma and in code': 'design-engineering',
        'Documentation in plain words': 'outcome-ds-docs',
        'A first release': 'outcome-ds-first-release',
        'A route for change': 'outcome-ds-route-for-change',
        'What we need from you': 'needs-design-systems',
        'Where our part stops': 'stops-design-systems',
      }),
      'status-example': by({
        Meaning: 'status-meaning',
        Design: 'status-design',
        Figma: 'status-figma',
        Code: 'status-code',
        Guidance: 'status-guidance',
      }),
      'how-it-runs': by({ figure: 'design-systems' }),
    },
    stories: {},
  },
  '/services/new-product-design-first-release': {
    items: {
      'what-you-get': by({
        'Who does the work': 'team-new-product',
        'Five product choices made with you': 'outcome-five-choices',
        'Designs tested before the build': 'symptom-test',
        'The build': 'outcome-build-parts',
        'The places new products break': 'outcome-break-points',
        'Launch support': 'outcome-launch-support',
        'What we need from you': 'needs-new-product',
        'Where our part stops': 'stops-new-product',
      }),
      decisions: by({ scenario: 'scenario-vet-estimate', figure: 'decisions-five' }),
      options: by({
        'MVP design and build with Tcules': 'specialist-new-product',
        'Product design only': 'product-design',
        'Prototype Readiness Review first': 'specialist-prototype-review',
        'SaaS web app development': 'specialist-saas-app',
        'Hiring your own team': 'option-own-team',
      }),
    },
    stories: {},
  },
  '/services/product-modernisation': {
    items: {
      /* "How we modernise": the five steps beside one drawing of their sequence. */
      'how-it-runs': by({ figure: 'method-modernise' }),
      'what-you-get': by({
        'Who does the work': 'team-product-modernisation',
        'A call on every part of the product': 'outcome-part-calls',
        'A written record': 'outcome-habits-record',
        'One high-use workflow': 'outcome-one-workflow',
        'A plan for old and new': 'outcome-old-new',
        'Designs ready to build, or the build itself': 'outcome-build',
        'What we need from you': 'needs-product-modernisation',
        'Where our part stops': 'stops-product-modernisation',
      }),
    },
    stories: {},
  },
  '/services/software-development': {
    items: {
      'what-you-get': by({
        'Who does the work': 'team-software-development',
        'Working software': 'outcome-small-releases',
        'Every workflow designed before it is coded': 'outcome-designed-first',
        'Tests and release checks': 'outcome-release-checks',
        'Code, tests and notes in your repository': 'outcome-code-in-repo',
        'Support through each release': 'outcome-release-support',
        'What we need from you': 'needs-software-development',
        'Where our part stops': 'stops-software-development',
      }),
      scope: by({ scenario: 'scenario-self-booking', agree: 'scope-agreement' }),
    },
    stories: {},
  },
};
