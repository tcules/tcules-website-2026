import type { ImageRecord } from '../types';

/**
 * Team portraits the CMS does not hold yet, keyed by the name as authored. A source uses one only
 * where its own record has no photograph, so a portrait uploaded to the CMS always wins and this
 * list empties itself as the CMS catches up. The files are square crops, head and shoulders, in
 * public/people/ (the byline shows them at 32, the end of an article at 64).
 */
const PORTRAITS: Record<string, Omit<ImageRecord, 'alt'>> = {
  'Devagya Sharma': {
    src: '/people/devagya-sharma.jpg',
    width: 384,
    height: 384,
    kind: 'photograph',
  },
};

/** The fallback portrait for a person, or undefined. `alt` is their name. */
export function teamPortrait(name: string): ImageRecord | undefined {
  const portrait = PORTRAITS[name.trim()];
  return portrait ? { ...portrait, alt: name.trim() } : undefined;
}

/**
 * Who each author is, until the CMS can say (owner, 1 Nov 2026): a bio of one or two sentences and,
 * where one is known, their LinkedIn profile. Keyed by the name as Strapi's bylines send it. Strapi's
 * `Profile` collection holds both (`description`, `linkedInProfile`) but its public `find` is
 * forbidden (docs/strapi-changes.md § 22), so a source reads this map only where its own record has
 * none, exactly as `PORTRAITS` falls back, and the map empties itself as the CMS catches up.
 *
 * Eight bios are trimmed from the 26 Oct copy's author profiles (`_pages/insights__authors__*.md`),
 * keeping only what the person's LIVE pieces support; "Yash Bhatt" in the copy is Yash Gidwani here.
 * Three are drafted from the pieces each person is credited on and marked DRAFTED: the content team
 * confirms or replaces them (docs/content-changes.md, "Author pages"). LinkedIn URLs are only the
 * ones the site already publishes (fixtures/ideal/about.ts); never guess one.
 *
 * A bio opens on what the person does or writes about ("Writes about…", "Leads…"), never on their
 * name and role: it is set directly under both, so "<Name>, a <role> at Tcules," only said them twice.
 */
export type TeamProfile = { bio: string; linkedin?: string };

const PROFILES: Record<string, TeamProfile> = {
  /* DRAFTED (1 Nov 2026) from the pieces credited to Anshu: hiring design help, UX audits. */
  'Anshu Jain': {
    bio: 'Writes for SaaS teams hiring design help: choosing a design agency or studio, hiring a product designer, and choosing a UX audit.',
  },
  'Shoghi Bagul': {
    bio: 'Writes about AI product UX, generative AI patterns for SaaS and design systems.',
  },
  'Rushali Bhatt': {
    bio: 'Writes about AI product UX: how to design review steps in AI features so that people keep control of the output. Also writes about UX audits and enterprise software.',
  },
  'Rakesh Chitroda': {
    bio: 'Writes for teams choosing outside design help, including how to choose a product design agency and when to hire a design system consultant.',
    linkedin: 'https://www.linkedin.com/in/rakeshchitroda',
  },
  /* DRAFTED (1 Nov 2026) from the pieces credited to Rishabh: design systems, sector UX, inclusive design. */
  'Rishabh Choudhary': {
    bio: 'Writes about design systems, inclusive design, and UX for fintech, healthcare and eLearning products.',
  },
  'Yash Gidwani': {
    bio: 'Writes guides on SaaS onboarding and engagement, ecommerce, UX audits, enterprise software and legacy product redesign.',
  },
  'Jatin Leuva': {
    bio: 'Leads Tcules, a digital product design studio in Ahmedabad. Writes about AI product UX and mobile apps for B2B SaaS, and runs the My Experiments with UX interviews with people who ship products.',
    linkedin: 'https://in.linkedin.com/in/jatinuva',
  },
  'Preksha Kharidia': {
    bio: 'Writes about SaaS onboarding and engagement, with Yash Gidwani.',
  },
  'Varun Mashru': {
    bio: 'Writes about object-oriented UX, and about how a SaaS team should answer an urgent feature request.',
  },
  /* DRAFTED (1 Nov 2026) from the pieces credited to Chirag: AI product UX, agents, design to code. */
  'Chirag Patel': {
    bio: 'Writes about AI product UX, agentic interfaces, and keeping a front-end build true to its design.',
  },
  'Devagya Sharma': {
    bio: 'Writes about protecting existing customer work at each release: silent interface regressions, legacy software modernisation and design systems.',
  },
};

/** The fallback bio and LinkedIn for a person, or undefined. */
export function teamProfile(name: string): TeamProfile | undefined {
  return PROFILES[name.trim()];
}

/**
 * A person's slug: their name as authored, lower-cased, accents folded and every run of anything
 * else made one hyphen ("Yash Gidwani" → "yash-gidwani"). The author page's URL and the `@id` the
 * CMS's own article markup already points at (`…/insights/authors/yash-gidwani#person`). One
 * function, so a byline's link and the page it links to can never disagree.
 */
export function personSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/gu, '')
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}
