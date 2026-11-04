import {
  getBlogPage,
  getCaseStudyPage,
  getCorpusPage,
  listAuthors,
  listSitePages,
  type SitePageFamily,
} from '@/content';
import { inlineToText } from '@/lib/inline';
import {
  auditPath,
  authorPath,
  blogPath,
  caseStudyPath,
  eventPath,
  expertisePath,
  glossaryPath,
  podcastPath,
  ROUTES,
  servicePath,
  toolPath,
} from '@/lib/routes';
import { serviceIllustration } from '@/lib/service-illustrations';

import { shareCard, type ShareCard } from './card';
import type { ShareMedia } from './media';

/**
 * Authored cuts, where the rules in `card.ts` leave a hero that reads badly (Claude, 4 Nov 2026; the
 * owner reviews them on /design/share-cards). Each is the page's own H1 with words removed, never
 * rewritten — the copy's wording is fixed — and each should go when its H1 changes.
 */
const HERO_CUTS: Readonly<Record<string, string>> = {
  [ROUTES.about]: 'We create ambitious new software products',
  [ROUTES.caseStudies]: 'Product design case studies',
  [ROUTES.contact]: "Contact Tcules about the product you're building",
  [ROUTES.howWeWork]: 'Experienced designers and engineers',
  [ROUTES.howWeWorkAiTransparency]: 'How we use AI on client projects',
  [auditPath('ux-product-audit')]: 'Find why SaaS customers get stuck',
  [servicePath('ai-product-ux/ai-copilots-agents')]: 'Let users pause, redirect or take over',
  [servicePath('software-development/mobile-app-development')]: 'Mobile app development for SaaS',
  [servicePath('design-systems/design-system-strategy')]: 'Design system strategy',
  [expertisePath('healthtech')]: 'Apps patients, clinicians and carers can trust',
  [blogPath('articles/design-systems-for-saas-boosting-efficiency-and-ux-consistency')]:
    'How to build a SaaS design system',
};

const FAMILY_PATH: Record<SitePageFamily, (slug: string) => string> = {
  service: servicePath,
  audit: auditPath,
  expertise: expertisePath,
  glossary: glossaryPath,
  tool: toolPath,
  insight: blogPath,
  podcast: podcastPath,
  event: eventPath,
  caseStudy: caseStudyPath,
};

/** Every CMS entry's title by path, read once per build. An outage leaves the corpus cards standing. */
let cmsTitles: Promise<Map<string, string>> | undefined;
function cmsTitle(path: string): Promise<string | undefined> {
  cmsTitles ??= listSitePages()
    .then((pages) => new Map(pages.map((page) => [FAMILY_PATH[page.family](page.slug), page.title])))
    .catch((error: unknown) => {
      console.error('share cards: Strapi titles unavailable', error);
      return new Map<string, string>();
    });
  return cmsTitles.then((titles) => titles.get(path));
}

/** Everyone with an author page, by path, read once per build. */
let authors: Promise<Map<string, { name: string; role?: string }>> | undefined;
function author(path: string) {
  authors ??= listAuthors()
    .then((list) => new Map(list.map((one) => [authorPath(one.slug), one])))
    .catch((error: unknown) => {
      console.error('share cards: authors unavailable', error);
      return new Map<string, { name: string; role?: string }>();
    });
  return authors.then((byPath) => byPath.get(path));
}

/**
 * The page's picture (owner, 4 Nov 2026):
 * - its own hero drawing, where it has one;
 * - else its family hub's drawing until its own lands: a service's line, /audits for an audit,
 *   /expertise for an expertise page (expertise pages take illustrations, never photographs);
 * - a case study's banner from Strapi (its UI cut-outs replace it when Strapi carries them);
 * - an article's cover from Strapi.
 * Glossary terms, tools, listings and legal pages have none and set their title alone. A failure to
 * read the CMS leaves the card without a picture rather than without an image.
 */
function drawingFor(path: string) {
  const [, family, line] = path.split('/');
  const hub =
    family === 'services' && line
      ? servicePath(line)
      : family === 'audits'
        ? ROUTES.audits
        : family === 'expertise'
          ? ROUTES.expertise
          : null;
  return serviceIllustration(path) ?? (hub ? serviceIllustration(hub) : undefined);
}

async function mediaFor(path: string): Promise<ShareMedia | null> {
  const drawing = drawingFor(path);
  if (drawing) return { kind: 'illustration', src: drawing.src, width: drawing.width, height: drawing.height };

  const [, family, slug, ...rest] = path.split('/');
  try {
    if (family === 'case-studies' && slug && rest.length === 0) {
      const image = (await getCaseStudyPage(slug))?.heroImage;
      if (image) return { kind: 'capture', src: image.src, width: image.width, height: image.height };
    }
    if (family === 'insights' && slug && !['authors', 'events', 'podcasts', 'videos'].includes(slug)) {
      const image = (await getBlogPage([slug, ...rest].join('/')))?.featureImage;
      if (image) return { kind: 'capture', src: image.src, width: image.width, height: image.height };
    }
  } catch (error) {
    console.error(`share cards: no picture for ${path}`, error);
  }
  return null;
}

/**
 * The share card for a path, from the page's own words: the corpus page's H1 and eyebrow where the
 * copy authors the page, else the CMS entry's title. A path neither knows takes the home card, so no
 * link ever unfurls without an image.
 */
export async function shareCardFor(path: string): Promise<ShareCard> {
  const page = await getCorpusPage(path);
  if (page) {
    return shareCard({
      path,
      title: page.hero.titleText,
      eyebrow: page.hero.eyebrow ? inlineToText(page.hero.eyebrow) : null,
      name: page.name,
      cut: HERO_CUTS[path],
      media: await mediaFor(path),
    });
  }
  const person = await author(path);
  if (person) {
    const eyebrow = person.role ? `Author · ${person.role}` : 'Author';
    return shareCard({ path, title: person.name, eyebrow, name: person.name });
  }
  const title = await cmsTitle(path);
  if (title) {
    const media = await mediaFor(path);
    return shareCard({ path, title, eyebrow: null, name: title, cut: HERO_CUTS[path], media });
  }
  if (path !== ROUTES.home) return { ...(await shareCardFor(ROUTES.home)), path };
  return shareCard({ path, title: 'Tcules', eyebrow: null, name: 'Tcules' });
}
