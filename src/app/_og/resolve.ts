import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  getBlogPage,
  getCaseStudyListingPage,
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
  CASE_SLUG_REDIRECTS,
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

import { shareCard, type ShareCard, type ShareSource } from './card';
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
 * Each case's V1 cover by live slug, read once per build: the listing carries it over the Strapi
 * thumbnail (fixtures/case-covers.ts, owner 3 Nov 2026). Only a delivered V1 cover is taken here; a case
 * without one keeps its Strapi banner.
 */
let caseCovers: Promise<Map<string, { src: string; width: number; height: number }>> | undefined;
function caseCover(slug: string) {
  caseCovers ??= getCaseStudyListingPage(ROUTES.caseStudies.slice(1))
    .then((listing) => {
      const covers = new Map<string, { src: string; width: number; height: number }>();
      for (const item of listing?.items ?? []) {
        const image = item.thumbnail;
        if (image?.src.startsWith('/case-covers/') && image.width && image.height) {
          covers.set(item.slug, { src: image.src, width: image.width, height: image.height });
        }
      }
      return covers;
    })
    .catch((error: unknown) => {
      console.error('share cards: case covers unavailable', error);
      return new Map<string, { src: string; width: number; height: number }>();
    });
  return caseCovers.then((covers) => covers.get(CASE_SLUG_REDIRECTS[slug] ?? slug));
}

/**
 * The page's picture (owner, 4 Nov 2026):
 * - its own hero drawing, where it has one;
 * - else its family hub's drawing until its own lands: a service's line, /audits for an audit,
 *   /expertise for an expertise page (expertise pages take illustrations, never photographs);
 * - a case study's V1 cover (owner, 5 Nov 2026), else its banner from Strapi;
 * - a video's YouTube thumbnail, else its cover from Strapi;
 * - an article's cover from Strapi.
 * Glossary terms, tools, listings and legal pages have none and set their title alone. A failure to
 * read the CMS leaves the card without a picture rather than without an image.
 */
function drawingFor(path: string): { media: ShareMedia; source: ShareSource } | null {
  const [, family, line] = path.split('/');
  const hub =
    family === 'services' && line
      ? servicePath(line)
      : family === 'audits'
        ? ROUTES.audits
        : family === 'expertise'
          ? ROUTES.expertise
          : null;
  const own = serviceIllustration(path);
  const drawing = own ?? (hub ? serviceIllustration(hub) : undefined);
  if (!drawing) return null;
  const { src, width, height } = drawing;
  return { media: { kind: 'illustration', src, width, height }, source: own ? 'own' : 'hub' };
}

/**
 * A video's own thumbnail, as YouTube serves it (owner, 5 Nov 2026: a video's card carries its
 * thumbnail). Only the 1280 × 720 frame is taken: YouTube's smaller sizes are 4:3 with the video
 * letterboxed inside, and a video uploaded without an HD frame has none, so its card falls back to
 * the Strapi cover.
 */
async function youtubeThumbnail(id: string): Promise<{ src: string; width: number; height: number } | null> {
  const src = `https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`;
  try {
    const response = await fetch(src, { method: 'HEAD' });
    return response.ok ? { src, width: 1280, height: 720 } : null;
  } catch {
    return null;
  }
}

async function mediaFor(path: string): Promise<{ media: ShareMedia; source: ShareSource } | null> {
  const drawing = drawingFor(path);
  if (drawing) return drawing;

  const [, family, slug, ...rest] = path.split('/');
  const capture = (image: { src: string; width: number; height: number }): ShareMedia => ({
    kind: 'capture',
    src: image.src,
    width: image.width,
    height: image.height,
  });
  try {
    if (family === 'case-studies' && slug && rest.length === 0) {
      const image = (await caseCover(slug)) ?? (await getCaseStudyPage(slug))?.heroImage;
      if (image) return { media: capture(image), source: 'banner' };
    }
    if (family === 'insights' && slug === 'videos' && rest.length > 0) {
      const blog = await getBlogPage([slug, ...rest].join('/'));
      const thumbnail = blog?.heroVideo ? await youtubeThumbnail(blog.heroVideo.id) : null;
      if (thumbnail) return { media: capture(thumbnail), source: 'video' };
      if (blog?.featureImage) return { media: capture(blog.featureImage), source: 'cover' };
    }
    if (family === 'insights' && slug && !['authors', 'events', 'podcasts', 'videos'].includes(slug)) {
      const image = (await getBlogPage([slug, ...rest].join('/')))?.featureImage;
      if (image) return { media: capture(image), source: 'cover' };
    }
  } catch (error) {
    console.error(`share cards: no picture for ${path}`, error);
  }
  return null;
}

/**
 * What a picture IS, so the card's URL changes when it does: a drawing file's bytes, or a CMS image's
 * URL (Cloudinary versions every upload in it). A new drawing tonight is a new URL tomorrow.
 */
async function fingerprintOf(media: ShareMedia): Promise<string> {
  if (/^https?:\/\//.test(media.src)) return media.src;
  const bytes = await readFile(join(process.cwd(), 'public', media.src));
  return createHash('sha1').update(bytes).digest('hex');
}

async function pictureFor(
  path: string,
): Promise<{ media: ShareMedia; source: ShareSource; fingerprint: string } | null> {
  const found = await mediaFor(path);
  return found ? { ...found, fingerprint: await fingerprintOf(found.media) } : null;
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
      ...(await pictureFor(path)),
    });
  }
  const person = await author(path);
  if (person) {
    const eyebrow = person.role ? `Author · ${person.role}` : 'Author';
    return shareCard({ path, title: person.name, eyebrow, name: person.name });
  }
  const title = await cmsTitle(path);
  if (title) {
    const picture = await pictureFor(path);
    return shareCard({ path, title, eyebrow: null, name: title, cut: HERO_CUTS[path], ...picture });
  }
  if (path !== ROUTES.home) return { ...(await shareCardFor(ROUTES.home)), path };
  return shareCard({ path, title: 'Tcules', eyebrow: null, name: 'Tcules' });
}
