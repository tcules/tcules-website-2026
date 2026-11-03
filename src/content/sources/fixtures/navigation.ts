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
 * Six items: three that open the plate, three that navigate. Order is CONTENT, not style — Work
 * sits second because case studies are the strongest proof this studio has and should not be the
 * fifth thing anyone reads.
 *
 * Every item carries its children whether or not the nav renders them today, per
 * docs/specs/SiteNav.md §2.1. Work, Lab and About are `form: 'link'` and their `children` go
 * unrendered; the day one of them becomes a menu, that is a change to `form` on one record and
 * nothing else. The same records are what the footer, an in-page section nav and the sitemap are
 * meant to read, so a child that exists in one place and not another is a bug a build can catch.
 *
 * `status` IS THE HONEST PART OF THIS FILE. Only three of these destinations have a page behind
 * them — `/` and the audit family, which Strapi answers, and the proving ground, which is not
 * linked from here. Everything else is `planned`: the route is decided, the page is not built. The
 * links render exactly as live ones do, deliberately (§2.1) — a greyed row tells a visitor the
 * company is unfinished, where a thin page tells them the work is in progress. What the flag is
 * FOR was the sitemap, so a holding page is never submitted to a search engine. The sitemap that
 * shipped (src/app/_sitemap/pages.ts) does not read it: it lists the pages that answer — the fixed
 * routes, the corpus and Strapi's entries — and borrows only the labels from these records.
 *
 * No promises, no row descriptions. The revised IA dropped them — rows are labels, and the group
 * label above them carries the meaning.
 */

/** Every href below is `planned` and saying so once beats saying it forty-four times. */
const soon = (label: string, href: string): SiteNavLink => ({ label, href, status: 'planned' });

/* ── Services ─────────────────────────────────────────────────────────────────────
   Two groups of six and the only rail in the nav. The audits are named individually rather than
   pointing at the index, because "which audit" is the question a visitor arrives with — and they
   are the one family that has real pages behind it, served by /audits/[slug].

   The rail is "Working together": How We Work as the image-led primary card, Request Free Audit as
   the compact secondary row. That order is provisional and it is the first open item in the spec —
   whichever block has something to say takes the primary card, and until the audit copy exists
   How We Work does. */
const SERVICES: SiteNavItem = {
  key: 'services',
  label: 'Services',
  form: 'mega',
  /* A mega has no href — its trigger opens rather than navigates — so its OWN index goes
     here beside the paths it owns outside its family. Without `/services` the bar would sit
     unlit on the page the section is named after. */
  matchPaths: [ROUTES.services, ROUTES.audits, ROUTES.howWeWork],
  hub: { label: 'All services', href: ROUTES.services, status: 'planned' },
  /* The audits carry the long labels — "Product Modernisation Assessment" at 230px against
     "Product Modernisation" at 148 — so the second column takes the larger share and the two end up
     with matching slack instead of 145 and 63. Re-measure if a label changes. */
  columnRatio: [3, 4],
  panelWidth: 'lg',
  groups: [
    {
      label: 'Services',
      links: [
        soon('Product Design', ROUTES.productDesign),
        soon('Product Modernisation', ROUTES.productModernisation),
        soon('Design Systems', ROUTES.designSystems),
        soon('AI Product UX', ROUTES.aiProductUx),
        soon('Design Engineering', ROUTES.designEngineering),
        soon('Software Development', ROUTES.softwareDevelopment),
      ],
    },
    {
      label: 'Audits and starting points',
      links: [
        /* The one live family in this file — /audits/[slug] ships and Strapi answers it. */
        { label: 'UX and Product Audit', href: ROUTES.uxProductAudit, status: 'live' },
        { label: 'Design-System Audit', href: ROUTES.designSystemAudit, status: 'live' },
        { label: 'Design-to-Code Audit', href: ROUTES.designToCodeAudit, status: 'live' },
        {
          label: 'Product Modernisation Assessment',
          href: ROUTES.productModernisationAssessment,
          status: 'live',
        },
        { label: 'AI Product UX Readiness', href: ROUTES.aiProductUxReadiness, status: 'live' },
        {
          label: 'Prototype Readiness Review',
          href: ROUTES.prototypeReadinessReview,
          status: 'live',
        },
      ],
    },
  ],
  rail: {
    label: 'Working together',
    cards: [
      /* A PLACEHOLDER, and named so it cannot be mistaken for the real thing: the artwork for this
         card is still the spec's first open item. It is diagrammatic on purpose — a pod, a track and
         a phase — so it reads as a stand-in rather than as a photograph nobody chose. Swap the file
         and the alt together; the ratio and the crop belong to the slot, not to the asset. */
      {
        title: 'How We Work',
        href: ROUTES.howWeWork,
        status: 'planned',
        role: 'primary',
        image: {
          src: '/nav/how-we-work-placeholder.svg',
          alt: '',
          width: 480,
          height: 210,
        },
      },
      {
        title: 'Request Free Audit',
        href: ROUTES.audits,
        status: 'planned',
        role: 'secondary',
      },
    ],
  },
};

/* ── Expertise ────────────────────────────────────────────────────────────────────
   Products and platforms, then industries and domains. The split is the point: a product TYPE
   changes how the work is done, an industry is the context it is done in. Both are plain link
   groups now — the previous shape made the first a set of promise rows and the second a rail,
   which is two treatments for one kind of thing.

   No rail, so the plate narrows to 780. Public Sector and Regulated Industries is struck in the
   content doc and is not here.

   AND NO HUB LINK, unlike Services and Insights. That is a decision rather than an omission: it is
   the one mega whose index page nobody has asked to send people to. Add `hub` here the day
   /expertise is worth landing on. */
const EXPERTISE: SiteNavItem = {
  key: 'expertise',
  label: 'Expertise',
  form: 'mega',
  matchPaths: [ROUTES.expertise],
  /* NO columnRatio, and that is a measurement rather than an oversight. Expertise is the one mega
     whose FIRST group holds the longer labels — "Content, Knowledge and Discovery Platforms" at 293
     against "PropTech, ConTech and Field Operations" at 259 — so the [3, 4] its siblings use would
     leave that column 0.1px of clearance and wrap it. Equal tracks already sit at 49 and 83 slack,
     which is as balanced as this copy gets. */
  panelWidth: 'md',
  groups: [
    {
      label: 'Products and platforms',
      links: [
        soon('B2B SaaS and Workflow Software', ROUTES.b2bSaasWorkflow),
        soon('AI Products and Developer Tools', ROUTES.aiDeveloperTools),
        soon('Data, Analytics and Decision Products', ROUTES.dataDecisionProducts),
        soon('Marketplaces and Multi-Sided Platforms', ROUTES.marketplaces),
        soon('Content, Knowledge and Discovery Platforms', ROUTES.contentDiscovery),
        soon('Commerce and Transactional Products', ROUTES.commerce),
      ],
    },
    {
      label: 'Industries and domains',
      links: [
        soon('FinTech and InsurTech', ROUTES.fintech),
        soon('HealthTech and Care', ROUTES.healthtech),
        soon('EdTech and Learning', ROUTES.edtech),
        soon('MarTech and SalesTech', ROUTES.martech),
        soon('PropTech, ConTech and Field Operations', ROUTES.proptech),
        soon('ClimateTech and Energy', ROUTES.climatetech),
      ],
    },
  ],
};

/* ── Insights ─────────────────────────────────────────────────────────────────────
   Formats, then the things that are not a format. Four and four, so the plate narrows to 560 — the
   smallest of the three, and the reason the plate has three widths at all.

   Research and Series are struck, as is the whole third group (Current, Rising Topics, Latest
   Insights, Future Interfaces Lab) — the Lab is a bar item now, which is most of why. The pane has
   room for that group as a third column if it comes back. */
const INSIGHTS: SiteNavItem = {
  key: 'insights',
  label: 'Insights',
  form: 'mega',
  matchPaths: [ROUTES.insights, ROUTES.glossary, ROUTES.tools],
  hub: { label: 'All insights', href: ROUTES.insights, status: 'planned' },
  /* Same shape as Services — "Tools and Resources" against "Podcasts" — so the same ratio. */
  columnRatio: [3, 4],
  panelWidth: 'sm',
  groups: [
    {
      label: 'Formats',
      links: [
        soon('Articles', ROUTES.articles),
        soon('Podcasts', ROUTES.podcasts),
        soon('Videos', ROUTES.videos),
        soon('Events', ROUTES.events),
      ],
    },
    {
      label: 'Knowledge and utility',
      links: [
        soon('Tools and Resources', ROUTES.tools),
        soon('Guides', ROUTES.guides),
        soon('Glossary', ROUTES.glossary),
        soon('Interviews', ROUTES.interviews),
      ],
    },
  ],
};

/**
 * The three direct links. Each carries its children unrendered — see the header.
 *
 * Lab's children are the five sections of the Lab hub plus the design system, which has no nav
 * route of its own: it lives on the hub and in the footer. That is accepted and worth revisiting
 * if it turns into a lead source.
 */
const WORK: SiteNavItem = {
  key: 'work',
  label: 'Work',
  form: 'link',
  href: ROUTES.caseStudies,
  matchPaths: [ROUTES.clients],
  children: [soon('Case Studies', ROUTES.caseStudies), { label: 'Clients', href: ROUTES.clients, status: 'live' }],
};

const LAB: SiteNavItem = {
  key: 'lab',
  label: 'Lab',
  form: 'link',
  href: ROUTES.futureInterfacesLab,
  matchPaths: [ROUTES.matterDesignSystem],
  children: [
    soon('Experiments', ROUTES.labExperiments),
    soon('Tools', ROUTES.labTools),
    soon('Research', ROUTES.labResearch),
    soon('Datasets', ROUTES.labDatasets),
    soon('Programmes', ROUTES.labProgrammes),
    soon('Matter Design System', ROUTES.matterDesignSystem),
  ],
};

const ABOUT: SiteNavItem = {
  key: 'about',
  label: 'About',
  form: 'link',
  href: ROUTES.about,
  /* Not /contact: the bar's own action, "Start a project", is the way there, so lighting About on
     the enquiry page said the visitor was somewhere they were not (review 29 Oct). */
  matchPaths: [ROUTES.team, ROUTES.careers, ROUTES.security],
  children: [
    soon('About', ROUTES.about),
    soon('Team', ROUTES.team),
    soon('Careers', ROUTES.careers),
    soon('Security and Confidentiality', ROUTES.security),
    soon('Contact', ROUTES.contact),
  ],
};

/**
 * The bar, in order, plus the two actions.
 *
 * `cta` is the offer and shows everywhere. `ctaSecondary` is the lighter way in and shows only in
 * the sheet's foot — a bar with two actions has no offer, it has a choice, which is the same
 * argument that keeps Request Free Audit a compact row in the desktop rail rather than a second
 * card. `/audits` as its destination is the spec's second open item, marked "to confirm".
 */
const NAV: SiteNavProps = {
  items: [SERVICES, WORK, EXPERTISE, INSIGHTS, LAB, ABOUT],
  cta: { label: 'Start a project', href: ROUTES.contact, status: 'planned' },
  ctaSecondary: { label: 'Request audit', href: ROUTES.audits, status: 'planned' },
};

/* ── Footer ───────────────────────────────────────────────────────────────────────
   The directory is broader than the nav on purpose. A header panel is a route in — it has to
   choose. A footer is the index, so it can afford to name every service, every industry and every
   format, and being the one place that lists all of them is most of its value. */
const FOOTER: SiteFooterProps = {
  brand: {
    tagline: 'Product intent, kept visible from the first decision to what ships.',
    /* Two, not three: Clutch left this list for the rating badge below. A profile that carries a
       score is a claim with a source, and a row of three names cannot say 4.8. */
    social: [
      { label: 'LinkedIn', href: EXTERNAL.linkedin, mark: 'linkedin' },
      { label: 'YouTube', href: EXTERNAL.youtube, mark: 'youtube' },
    ],
    /* One source for the score, shared with the service pages' testimonial band: see ratings.ts. */
    rating: CLUTCH_RATING,
  },
  groups: [
    {
      title: 'Services',
      links: [
        { label: 'Product Design', href: ROUTES.productDesign },
        { label: 'Product Modernisation', href: ROUTES.productModernisation },
        { label: 'Design Systems', href: ROUTES.designSystems },
        { label: 'AI Product UX', href: ROUTES.aiProductUx },
        { label: 'Design Engineering', href: ROUTES.designEngineering },
        { label: 'Software Development', href: ROUTES.softwareDevelopment },
        { label: 'Audits', href: ROUTES.audits },
        { label: 'How We Work', href: ROUTES.howWeWork },
      ],
    },
    {
      title: 'Expertise',
      links: [
        { label: 'B2B SaaS and Workflow Software', href: ROUTES.b2bSaasWorkflow },
        { label: 'AI Products and Developer Tools', href: ROUTES.aiDeveloperTools },
        { label: 'Data and Decision Products', href: ROUTES.dataDecisionProducts },
        { label: 'Marketplaces', href: ROUTES.marketplaces },
        { label: 'Content and Knowledge Platforms', href: ROUTES.contentDiscovery },
        { label: 'FinTech', href: ROUTES.fintech },
        { label: 'HealthTech', href: ROUTES.healthtech },
        { label: 'EdTech', href: ROUTES.edtech },
        { label: 'All Expertise', href: ROUTES.expertise },
      ],
    },
    {
      title: 'Work',
      links: [
        { label: 'Case Studies', href: ROUTES.caseStudies },
        { label: 'Clients', href: ROUTES.clients },
        /* Product Stages and Engagement Models are CLASSIFICATIONS of a case study rather than
           routes of their own, so they point at the pages that carry them. Named here anyway
           because they are how people ask for the work. */
        { label: 'Product Stages', href: ROUTES.caseStudies },
        { label: 'Engagement Models', href: ROUTES.howWeWork },
      ],
    },
    {
      title: 'Insights',
      links: [
        { label: 'Articles', href: ROUTES.articles },
        { label: 'Guides', href: ROUTES.guides },
        { label: 'Podcasts', href: ROUTES.podcasts },
        { label: 'Videos', href: ROUTES.videos },
        { label: 'Events', href: ROUTES.events },
        { label: 'Research', href: ROUTES.research },
        { label: 'Tools and Resources', href: ROUTES.tools },
        { label: 'Glossary', href: ROUTES.glossary },
      ],
    },
    /* Lab is two links and stays its own column rather than folding into Company. It is the one
       group whose contents are products rather than pages about the studio, and burying the design
       system under "Company" is how nobody finds it. Marketing's IA folds them together — that
       note is the one still open. */
    {
      title: 'Lab',
      links: [
        { label: 'Future Interfaces Lab', href: ROUTES.futureInterfacesLab },
        { label: 'Matter Design System', href: ROUTES.matterDesignSystem },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: ROUTES.about },
        { label: 'Team', href: ROUTES.team },
        { label: 'Careers', href: ROUTES.careers },
        { label: 'Security and Confidentiality', href: ROUTES.security },
        { label: 'Contact', href: ROUTES.contact },
      ],
    },
  ],
  cta: { label: 'Start a project', href: ROUTES.contact },
  newsletter: {
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
  meta: [
    { key: 'Enquiries', value: 'hello@tcules.com', href: 'mailto:hello@tcules.com' },
    { key: 'Studio', value: 'Ahmedabad, India' },
    { key: 'Across time zones', value: 'India · United States · Europe' },
    { key: 'Response', value: 'Within 2 business days' },
  ],
  address: '614, Silver Radiance 2, Science City Road, Sola, Ahmedabad 380060, India',
  utility: [
    { label: 'Privacy', href: ROUTES.privacy },
    { label: 'Terms', href: ROUTES.terms },
    { label: 'Accessibility', href: ROUTES.accessibility },
    { label: 'Sitemap', href: ROUTES.sitemap },
  ],
  /* The Solar credit rides the legal notice, the footer's existing small-print slot, rather than a
     new link or band: Solar Icons are CC BY 4.0 (DBF ch04), and attribution is owed once the first
     Solar glyph is route-visible — ListCard's external cue (`arrow-right-up` since 2.17). Title, author
     and licence, which is what CC BY asks for; the footer's layout is unchanged. */
  legal: '© 2026 Tcules. All rights reserved. Icons: Solar Icons by 480 Design, CC BY 4.0.',
};

export const NAVIGATION: Navigation = { nav: NAV, footer: FOOTER };
