import type { ServiceStory } from '@/lib/service-story';
import { ROUTES, servicePath, ANCHORS, anchorHref } from '@/lib/routes';

import { CLIENT_MARKS } from '../../clients';
import { CLUTCH_RATING } from '../../ratings';

const ENQUIRY = anchorHref(ANCHORS.enquiry);

/**
 * /services/software-development, designed — recomposed from the UI kit on 6 Oct 2026
 * (visual-direction § 8.2). Copy is the CMS's own, re-cut to the § 1.5 budgets; every edit is
 * logged, old and new, in docs/content-changes.md § 7. The sections say what the page argues; the
 * template decides how each is laid out from the job its blocks do (ServicePage plan.ts). One field
 * here is still arrangement: `signals.columns`, which the ServiceStory type requires and the B band
 * ignores — on the template's fix list (ServicePage audit, 6 Oct), not removable from a story.
 *
 *   hero      the claim
 *   signals   where builds break, four tiles — B, beside a screen-work photograph
 *   clients   who we have shipped with — H, with the sourced rating
 *   slice     a release is a complete product slice — E, the layer / release grids
 *   method    the delivery trace as five steps, each citing the one before — F, beside a photo
 *   evidence  three cases, each bounded by its record — M
 *   routes    the specialist services, by where the risk sits — the C-icon router
 *   proof     the client's words beside the case they came from — G-case, the tint band
 *   offer     three ways to hand over responsibility — K
 *   questions ownership, acceptance (with accessibility), AI, infrastructure — D-faq
 *   statement production responsibility does not move to the model — J
 *   close     the form — L
 *
 * Order (fix round 2): the argument comes before the menu. The slice and the method make the case,
 * the cases evidence it, and only then does the router offer the narrower services. With the slice
 * between B and F, the two start-side photographs have two bands between them, and the router, the
 * second head-track band, takes its photograph on the end side. The router sits above the tint
 * proof band, so it carries the horizon. The statement follows the centred FAQ, so it sets left
 * (split) rather than repeating the centred column, and as the last band before the close it
 * takes no corner field. The slice has four layers, so three paths: each column head sets on one
 * line at 390, and the resolved grid is one full column, the answer at a squint.
 *
 * What left a band of its own, and where it went: the "what changes" thread and the delivery trace
 * were one argument told twice, now the F steps; the acceptance levels, the ownership ledger and the
 * AI review flow are FAQ answers; the three engagement options are K's points; the resources band
 * is the guide link in the accessibility answer and K's "See how we work".
 */
export const softwareDevelopment: ServiceStory = {
  slug: 'software-development',
  name: 'Design-led Software Development',
  seo: {
    title: 'Design-led Software Development | Tcules',
    description:
      'Design and build running software with product decisions accountable through frontend, backend, APIs, integrations, testing, release and continuing change.',
  },
  hero: {
    title: 'Software built on settled product decisions',
    lead: 'Tcules designs and builds running software in one accountable path, so roles, rules and edge states reach the code decided, not guessed.',
    actions: [
      { label: 'Start a project', href: ENQUIRY },
      { label: 'Prototype Readiness Review', href: ROUTES.prototypeReadinessReview },
    ],
    illustration: {
      src: '/illustrations/services/software-development.paper.svg',
      width: 714,
      height: 610,
    },
    tags: [
      'Frontend',
      'Backend',
      'APIs',
      'Integrations',
      'AI functionality',
      'Mobile',
      'QA',
      'Deployment',
      'Evolution',
    ],
  },
  /* Photographs (visual-direction § 5.5 to § 5.7): a warm-family page. The B, K and aside photos are
     § 5.6's (SERVICE_PHOTO_SLOTS in src/lib/photos.ts). The stand-in pool is in order of preference,
     studio first, drawn from the rest of the catalogue; pickStandIn enforces that. */
  photos: {
    family: 'warm',
    standIns: [
      'studio-whiteboard-crit',
      'studio-sticky-board-ux',
      'studio-team-holi',
      'hand-mouse-detail',
      'workshop-brick-room',
      'hands-trackpad',
    ],
  },
  labels: {
    caseCta: 'Read the case',
    scope: 'Scope',
    allCases: { label: 'All case studies', href: ROUTES.caseStudies },
  },
  sections: [
    {
      type: 'section',
      id: 'what-breaks',
      eyebrow: 'Design to code',
      heading: 'Where builds break',
      lead: 'The trouble starts where a decision never reached the code.',
      blocks: [
        {
          kind: 'signals',
          columns: 2,
          items: [
            {
              icon: 'layers',
              title: 'Every layer is done',
              body: 'Each team finished its part, yet no path a user takes works end to end.',
            },
            {
              icon: 'question-circle',
              title: 'Edge states are guessed',
              body: 'The screens showed the happy path, so the code had to invent the rest.',
            },
            {
              icon: 'code',
              title: 'Contracts are assumed',
              body: 'Each side guessed what the other would send, so integration found the gaps.',
            },
            {
              icon: 'checklist',
              title: 'Done was never agreed',
              body: 'No one set what a release must prove, so acceptance became a debate.',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'clients',
      eyebrow: 'Clients',
      heading: 'Teams we have shipped with',
      blocks: [
        {
          kind: 'logos',
          marks: [
            CLIENT_MARKS.gttools,
            CLIENT_MARKS.omny,
            CLIENT_MARKS.latitudepay,
            CLIENT_MARKS.safexpay,
            CLIENT_MARKS.quoter,
            CLIENT_MARKS.knovos,
          ],
          rating: CLUTCH_RATING,
        },
      ],
    },
    {
      type: 'section',
      id: 'release-slice',
      eyebrow: 'How a release is cut',
      heading: 'A release is a complete slice',
      lead: 'Cut by release, every layer builds the same path, so each release does something a user can finish.',
      blocks: [
        {
          kind: 'slice',
          layers: ['Interface', 'Services', 'Integrations', 'Data'],
          views: {
            layer: {
              title: 'Organised by layer',
              note: 'Each team builds a third of its layer, each on a different path. Nothing a user can do works yet, and nothing can ship.',
            },
            slice: {
              title: 'Organised by release',
              note: 'The same work, with every layer building the same path. One thing a user can do works end to end, and ships.',
            },
          },
          legend: {
            built: 'Built',
            missing: 'Not built yet',
            path: 'Path',
            works: 'Works end to end',
          },
        },
      ],
    },
    {
      type: 'section',
      id: 'delivery-trace',
      eyebrow: 'What design-led changes',
      heading: 'Decisions reach the code',
      lead: 'Every stage cites the one before it, so edge states are implemented, not guessed.',
      blocks: [
        {
          kind: 'steps',
          items: [
            {
              title: 'Settle the behaviour',
              body: 'Roles, rules and states, decided with their owner.',
            },
            {
              title: 'Write the contract',
              body: 'The data and API terms each part owes.',
            },
            {
              title: 'Build the slice',
              body: 'Interface, services and data along one path.',
            },
            {
              title: 'Accept it twice',
              body: 'Automated and manual tests, behaviour and code.',
            },
            {
              title: 'Ship and observe',
              body: 'What production shows enters the next decision.',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'evidence',
      eyebrow: 'Evidence',
      heading: 'Work that reached code',
      lead: 'Each case claims only its own record. ConnectX is a coded demonstration, not a deployment.',
      blocks: [
        {
          kind: 'cases',
          items: [
            {
              slug: 'ai-native-building-energy-product-connectx',
              client: 'ConnectX · Product and software',
              title: 'AI architecture in a hybrid workspace',
              body: 'A coded demonstration of AI architecture, scenario modelling and a hybrid workspace.',
            },
            {
              slug: 'legacy-saas-modernisation-information-architecture',
              client: 'Benchmark Gensuite · Feasibility',
              title: 'Coded prototypes during modernisation',
              body: 'Used to test feasibility while the direction could still change.',
            },
            {
              slug: 'redesigning-for-a-shopify-website-ux-design',
              client: 'GT Tools · Commerce',
              title: 'Design and build, end to end',
              body: 'A historical commerce case: bounded design and development.',
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'specialist-routes',
      eyebrow: 'Where the risk sits',
      heading: 'Specialist software services',
      lead: 'When one part of the system carries the risk, a narrower service settles it faster.',
      blocks: [
        {
          kind: 'router',
          items: [
            {
              icon: 'widget',
              when: 'When a SaaS product or web application is the binding part.',
              route: {
                label: 'SaaS and Web Apps',
                href: servicePath('software-development/saas-web-app-development'),
              },
            },
            {
              icon: 'cpu',
              when: 'When the model, its data and its interaction are the product.',
              route: {
                label: 'AI Product Engineering',
                href: servicePath('software-development/ai-product-engineering'),
              },
            },
            {
              icon: 'monitor',
              when: 'When the interface layer carries the risk.',
              route: {
                label: 'Frontend Development',
                href: servicePath('software-development/frontend-development'),
              },
            },
            {
              icon: 'server',
              when: 'When services, data and integrations carry it.',
              route: {
                label: 'Backend and API',
                href: servicePath('software-development/backend-api-development'),
              },
            },
            {
              icon: 'smartphone',
              when: 'When it has to run on a phone.',
              route: {
                label: 'Mobile App Development',
                href: servicePath('software-development/mobile-app-development'),
              },
            },
            {
              icon: 'refresh',
              when: 'When the product has launched and has to keep changing.',
              route: {
                label: 'Maintenance and Evolution',
                href: servicePath('software-development/product-maintenance'),
              },
            },
          ],
        },
      ],
    },
    {
      type: 'section',
      id: 'client-view',
      eyebrow: 'Proof',
      heading: 'In a client’s words',
      blocks: [
        {
          kind: 'proof',
          quote: {
            text: 'The workflow between our teams was seamless. I found the team at Tcules to be knowledgeable, friendly and research oriented.',
            name: 'Ashok Mohanty',
            company: 'Auxentios',
          },
          case: {
            slug: 'consumer-grade-ux-in-enterprise-saas-a-case-study-on-mvp-design-for-cpq-software',
            client: 'Auxentios · Industrial CPQ',
            title: 'Specialist research, carried into an MVP',
            body: 'Research across specialist roles, carried into a product model and its interface components.',
          },
        },
      ],
    },
    {
      type: 'offer',
      id: 'responsibility-options',
      eyebrow: 'Ways to engage',
      heading: 'Choose how much of the build we own',
      body: 'Tcules can own a whole product, one technical surface, or a launched product’s next change.',
      points: [
        {
          label: 'A product or capability',
          detail: 'Definition through build, with your domain and technology leads.',
        },
        {
          label: 'One technical surface',
          detail: 'Frontend, backend, API, AI or mobile, inside your architecture.',
        },
        {
          label: 'An existing product',
          detail: 'Maintenance and evolution after launch, on project terms.',
        },
      ],
      actions: [
        { label: 'Start a project', href: ENQUIRY },
        { label: 'See how we work', href: ROUTES.howWeWork },
      ],
    },
    {
      type: 'section',
      id: 'questions',
      eyebrow: 'Questions',
      heading: 'Before you sign',
      blocks: [
        {
          kind: 'faq',
          items: [
            {
              question: 'Will we control the code and delivery assets?',
              answerHtml:
                '<p>Yes, from the start. You hold repository and environment access; credential custody and deployment ownership are named before work starts; documentation is enough to continue without us. The agreement states ownership and third-party licences, and any constraint is visible before a choice is accepted.</p>',
            },
            {
              question: 'When is a release accepted?',
              answerHtml:
                `<p>At three levels. <strong>Product behaviour:</strong> the intended role can complete the work, and recover it. <strong>System behaviour:</strong> data, permissions, events and integrations stay coherent. <strong>Release behaviour:</strong> the team can deploy, observe, support and change the capability. Accessibility is accepted the same way, against a real workflow rather than a checklist alone; the <a href="${ROUTES.guides}/inclusive-product-design-for-older-and-disabled-people">guide to inclusive product design</a> covers how.</p>`,
            },
            {
              question: 'How does Tcules use AI in engineering?',
              answerHtml:
                '<p>AI accelerates architecture exploration, implementation, test generation and documentation. Tcules reviews what it produces against the product and system model, the security and data requirements, the coding standards and the acceptance criteria. Versatility matters more as frameworks change; accountability does not move.</p>',
            },
            {
              question: 'Does Tcules run infrastructure or provide an SLA?',
              answerHtml:
                '<p>Tcules configures and manages the infrastructure the agreed product scope needs. It is not a standalone managed-cloud, security-operations or penetration-testing provider. Performance, load and security testing are scoped explicitly or delivered through qualified partners, and no universal SLA is implied.</p>',
            },
          ],
        },
      ],
    },
    {
      type: 'statement',
      id: 'ai-assisted',
      eyebrow: 'AI-assisted engineering',
      text: 'Production responsibility does not move to the model.',
      action: {
        label: 'AI Product Engineering',
        href: servicePath('software-development/ai-product-engineering'),
      },
    },
  ],
  close: {
    eyebrow: 'Next step',
    heading: 'Start with the slice that needs to ship',
    body: 'The slice, its users and the release outcome.',
    points: [
      {
        label: 'Attach what already exists',
        detail: 'A prototype, a spec or screens.',
      },
    ],
    note: 'Do not send credentials or confidential material.',
  },
};
