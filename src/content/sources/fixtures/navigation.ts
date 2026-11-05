import type { SiteFooterProps, SiteNavItem, SiteNavLink, SiteNavProps } from '@/patterns';
import { ENDPOINTS, EXTERNAL, ROUTES } from '@/lib/routes';

import { CLUTCH_RATING } from './ratings';

import type { Navigation } from '../../types';

/**
 * The site chrome's information architecture.
 *
 * This is CONTENT. Every label, promise, compartment and group below is an editorial decision that
 * belongs to whoever writes the site, not to the component that renders it — which is why it sits
 * behind the seam and arrives at SiteNav and SiteFooter as props. When this moves to a CMS
 * collection, sources/strapi.ts maps that response into the same two shapes and nothing above
 * changes.
 *
 * Every href is a name from @/lib/routes rather than a literal, so a URL decision is one edit
 * there. Three destinations have no canonical URL in the sitemap and take UNRESOLVED_ROUTE, which
 * is greppable in a way a scattering of `#` is not. The social profiles took the off-site
 * equivalent until their URLs were supplied; they read EXTERNAL now.
 */

/**
 * ── The nav ───────────────────────────────────────────────────────────────────────
 * Five items: Work navigates, four open the plate. Order is CONTENT, not style — Work leads because
 * case studies are the strongest proof this studio has.
 *
 * Every item carries its children whether or not the nav renders them today, per
 * docs/specs/SiteNav.md §2.1: Work is `form: 'link'` and its `children` go unrendered.
 *
 * `status` is for the sitemap, not the nav: a planned link renders exactly as a live one. The
 * sitemap that shipped (src/app/_sitemap/pages.ts) lists the pages that answer and borrows only the
 * labels from these records.
 *
 * Rows MAY carry a description now (round 3): services say which situation each answers, a list of
 * sectors does not need to.
 */

/** A destination with a page behind it. */
const to = (label: string, href: string, description?: string): SiteNavLink => ({
  label,
  href,
  status: 'live',
  ...(description ? { description } : {}),
});

/* ── The header, round 3 (owner, 4 Nov 2026) ──────────────────────────────────────
   Content and order from the owner's header-and-footer copy of 3 Nov 2026, with the group labels
   SHORTENED to two or three words and the notes under them dropped — the "short labels" pick from
   the header mocks. Every section is an index of groups plus, where it has one, an aside holding
   the way onward. Labels keep the copy's '&'. */

const SERVICES: SiteNavItem = {
  key: 'services',
  label: 'Services',
  form: 'mega',
  groups: [
    {
      label: 'Core practice',
      links: [to('Product Design', ROUTES.productDesign, 'What to build, before the screens')],
    },
    {
      label: 'Starting new',
      links: [
        to('Launch a new product', ROUTES.mvpDevelopment, 'Design-led MVP, from idea or prototype'),
        to(
          'Prototype Readiness Review',
          ROUTES.prototypeReadinessReview,
          'A pre-launch check for AI-built apps',
        ),
      ],
    },
    {
      label: 'Live products',
      links: [
        to('Product Modernisation', ROUTES.productModernisation, 'Keep what customers value'),
        to('Audits & Assessments', ROUTES.audits, 'Know what to fix first'),
      ],
    },
    {
      label: 'Design to software',
      links: [
        to(
          'Design Engineering',
          ROUTES.designEngineering,
          'Designers who code, prototype to production',
        ),
        to('Software Development', ROUTES.softwareDevelopment, 'From the studio that designs it'),
      ],
    },
  ],
  /* One link and no heading: it needs none. */
  aside: { links: [to('How we work', ROUTES.howWeWork, 'Start small, scale when ready')] },
  hub: to('All services', ROUTES.services),
};

const EXPERTISE: SiteNavItem = {
  key: 'expertise',
  label: 'Expertise',
  form: 'mega',
  groups: [
    {
      label: 'By software type',
      links: [
        to('B2B SaaS & Workflow Software', ROUTES.b2bSaasWorkflow),
        to('Developer Tools & AI Platforms', ROUTES.aiDeveloperTools),
        to('Data, Analytics & Decision Products', ROUTES.dataDecisionProducts),
        to('Marketplaces & Multi-Sided Platforms', ROUTES.marketplaces),
        to('Content, Knowledge & Discovery Platforms', ROUTES.contentDiscovery),
        to('Commerce & Transactional Products', ROUTES.commerce),
      ],
    },
    {
      label: 'By industry',
      links: [
        to('FinTech', ROUTES.fintech),
        to('HealthTech', ROUTES.healthtech),
        to('ClimateTech & Energy', ROUTES.climatetech),
        to('PropTech, ConTech & Field Operations', ROUTES.proptech),
        to('EdTech & Learning', ROUTES.edtech),
        to('MarTech & SalesTech', ROUTES.martech),
      ],
    },
  ],
  aside: {
    label: 'See the work',
    links: [
      to('Case studies', ROUTES.caseStudies),
      to('How we work', ROUTES.howWeWork, 'Start small, scale when ready'),
    ],
  },
  hub: to('All expertise', ROUTES.expertise),
};

const RESOURCES: SiteNavItem = {
  key: 'resources',
  label: 'Resources',
  form: 'mega',
  groups: [
    {
      label: 'Insights',
      links: [
        to('Articles', ROUTES.articles),
        to('Guides', ROUTES.guides),
        to('Podcasts', ROUTES.podcasts),
      ],
    },
    {
      label: 'Free to use',
      links: [
        to('Checklists and worksheets', ROUTES.tools),
        to('Matter Design System', ROUTES.matterDesignSystem),
        to('Glossary', ROUTES.glossary),
      ],
    },
    {
      label: 'Connect',
      links: [
        to('Events', ROUTES.events),
        to('Future Interfaces Lab', ROUTES.futureInterfacesLab),
        { ...to('Beyond Interfaces on YouTube', EXTERNAL.youtube), external: true },
        to('Meet the authors', ROUTES.authors),
      ],
    },
  ],
  /* The two featured pieces leave Insights for the aside, as plain links. "Featured" is the
     header's own label, not copy. Paths as the copy gives them (owner, 4 Nov 2026). */
  aside: {
    label: 'Featured',
    links: [
      to('Choosing a design partner', `${ROUTES.guides}/how-to-choose-a-product-design-agency`),
      to('Vibe-coded app to production', `${ROUTES.insights}/vibe-coded-app-production-ready`),
    ],
  },
  hub: to('All insights', ROUTES.insights),
};

/* "Get in touch" is the plate's aside, as every other section's way onward (owner, 5 Nov 2026,
   launch review: "this becomes the side panel in studio menu"). */
const STUDIO: SiteNavItem = {
  key: 'studio',
  label: 'Studio',
  form: 'mega',
  groups: [
    {
      label: 'Who we are',
      links: [to('About Tcules', ROUTES.about), to('Clients', ROUTES.clients)],
    },
    {
      label: 'Why us',
      links: [
        to('Why Tcules', ROUTES.whyTcules),
        to('How we design with AI', ROUTES.howWeWorkAiNative),
      ],
    },
  ],
  aside: {
    label: 'Get in touch',
    links: [
      to('Careers', ROUTES.careers, 'Work with us in Ahmedabad'),
      to('Contact', ROUTES.contact, 'hello@tcules.com'),
    ],
  },
};

/**
 * Work navigates. Its children are carried unrendered — see the header of SiteNav's types.
 */
const WORK: SiteNavItem = {
  key: 'work',
  label: 'Work',
  form: 'link',
  href: ROUTES.caseStudies,
  children: [to('Case studies', ROUTES.caseStudies), to('Clients', ROUTES.clients)],
};

/**
 * The bar, in order, and its one offer. "Request audit" left the header (owner, 4 Nov 2026), so
 * the sheet's foot carries the offer alone.
 */
const NAV: SiteNavProps = {
  items: [WORK, SERVICES, EXPERTISE, RESOURCES, STUDIO],
  cta: { label: 'Start a project', href: ROUTES.contact, status: 'live' },
};

/* ── Footer ───────────────────────────────────────────────────────────────────────
   Content, order and labels from the owner's header-and-footer copy of 3 Nov 2026, verbatim — '&'
   in labels, not 'and'. The directory names each page once; Articles, Podcasts and Events are
   reached through Insights, which is why they are not listed beside it. */
const FOOTER: SiteFooterProps = {
  brand: {
    tagline: "Code got easy. Good products didn't.",
    /* One source for the score, shared with the service pages' testimonial band: see ratings.ts.
       The badge links the Clutch profile, so Clutch is not repeated among the socials. */
    rating: CLUTCH_RATING,
  },
  cta: { label: 'Start a project', href: ROUTES.contact },
  groups: [
    {
      title: 'Services',
      links: [
        { label: 'Product Design', href: ROUTES.productDesign },
        { label: 'Design-led MVP development', href: ROUTES.mvpDevelopment },
        { label: 'Product Modernisation', href: ROUTES.productModernisation },
        { label: 'Design Systems', href: ROUTES.designSystems },
        { label: 'AI Product UX', href: ROUTES.aiProductUx },
        { label: 'Design Engineering', href: ROUTES.designEngineering },
        { label: 'Software Development', href: ROUTES.softwareDevelopment },
        { label: 'Audits & Assessments', href: ROUTES.audits },
      ],
    },
    {
      title: 'Software Product Expertise',
      links: [
        { label: 'B2B SaaS & Workflow Software', href: ROUTES.b2bSaasWorkflow },
        { label: 'Developer Tools & AI Platforms', href: ROUTES.aiDeveloperTools },
        { label: 'Data, Analytics & Decision Products', href: ROUTES.dataDecisionProducts },
        { label: 'Marketplaces & Multi-Sided Platforms', href: ROUTES.marketplaces },
        { label: 'Content, Knowledge & Discovery Platforms', href: ROUTES.contentDiscovery },
        { label: 'Commerce & Transactional Products', href: ROUTES.commerce },
      ],
    },
    {
      title: 'Industries',
      links: [
        { label: 'FinTech', href: ROUTES.fintech },
        { label: 'HealthTech', href: ROUTES.healthtech },
        { label: 'ClimateTech & Energy', href: ROUTES.climatetech },
        { label: 'PropTech, ConTech & Field Operations', href: ROUTES.proptech },
        { label: 'EdTech & Learning', href: ROUTES.edtech },
        { label: 'MarTech & SalesTech', href: ROUTES.martech },
      ],
    },
    {
      title: 'Work',
      links: [
        { label: 'Case studies', href: ROUTES.caseStudies },
        { label: 'Clients', href: ROUTES.clients },
        { label: 'All expertise', href: ROUTES.expertise },
        { label: 'How we work', href: ROUTES.howWeWork },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Insights', href: ROUTES.insights },
        { label: 'Guides', href: ROUTES.guides },
        { label: 'Checklists and worksheets', href: ROUTES.tools },
        { label: 'Glossary', href: ROUTES.glossary },
        { label: 'Future Interfaces Lab', href: ROUTES.futureInterfacesLab },
      ],
    },
    {
      title: 'Studio',
      links: [
        { label: 'About Tcules', href: ROUTES.about },
        { label: 'Why Tcules', href: ROUTES.whyTcules },
        { label: 'How we design with AI', href: ROUTES.howWeWorkAiNative },
        { label: 'Careers', href: ROUTES.careers },
        { label: 'Contact', href: ROUTES.contact },
      ],
    },
  ],
  newsletter: {
    eyebrow: 'Newsletter',
    title: 'Beyond Interfaces',
    description:
      'A deep dive into the intersection of design, strategy, and product innovation.',
    cta: { label: 'Subscribe' },
    /* NOTHING SERVES THIS YET. There is no app/api/newsletter/route.ts, so a real submission is a
       404 — the field is in place ahead of the endpoint, deliberately, and this is the note that
       says so. See ENDPOINTS in @/lib/routes. */
    action: ENDPOINTS.newsletter,
    fieldLabel: 'Email address',
    placeholder: 'you@company.com',
  },
  studio: {
    addressLabel: 'Address',
    socialLabel: 'Elsewhere',
    statement:
      'Tcules is a digital product design studio creating ambitious new software products and making established ones better.',
    address: [
      '614, Silver Radiance 2',
      'Science City Road, Sola',
      'Ahmedabad 380060, Gujarat, India',
    ],
    email: 'hello@tcules.com',
    social: [
      { label: 'LinkedIn', href: EXTERNAL.linkedin },
      { label: 'YouTube', href: EXTERNAL.youtube },
      { label: 'Instagram', href: EXTERNAL.instagram },
      { label: 'X', href: EXTERNAL.x },
    ],
  },
  legal: {
    notice: '© 2017–2026 Tcules UX Private Limited',
    links: [
      { label: 'Privacy Policy', href: ROUTES.privacy },
      { label: 'Cookie Policy', href: ROUTES.cookiePolicy },
      { label: 'Terms of Use', href: ROUTES.terms },
      { label: 'AI Transparency', href: ROUTES.howWeWorkAiTransparency },
      { label: 'Sitemap', href: ROUTES.sitemap },
    ],
    /* Solar Icons are CC BY 4.0 (DBF ch04): title, author and licence, kept in the footer's small
       print (owner, 3 Nov 2026). */
    credit: 'Icons: Solar Icons by 480 Design, CC BY 4.0.',
  },
};

export const NAVIGATION: Navigation = { nav: NAV, footer: FOOTER };
