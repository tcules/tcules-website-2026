import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  getAuthorShareProfile,
  getCaseCoverFallback,
  getCaseStudyDetail,
  getCorpusPage,
  getPageSeo,
  getResourceDetail,
} from '@/content';
import { initialsOf, PORTRAIT_FOCUS } from '@/lib/initials';
import { inlineToText } from '@/lib/inline';
import {
  auditPath,
  blogPath,
  CASE_SLUG_REDIRECTS,
  expertisePath,
  ROUTES,
  servicePath,
} from '@/lib/routes';
import { serviceIllustration } from '@/lib/service-illustrations';

import { shareCard, type ShareCard, type ShareSource } from './card';
import { isCutOut, type ShareMedia } from './media';

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

// Share images are generated in static route handlers, which need cacheable CMS requests.
const SHARE_REVALIDATE_SECONDS = 300;
type Resource = Awaited<ReturnType<typeof getResourceDetail>>;
type CaseStudy = Awaited<ReturnType<typeof getCaseStudyDetail>>;

/**
 * A drawing a page's card carries that is not its hero's: the hero table (HERO_ILLUSTRATIONS) answers
 * first, and this only for a page whose hero has no drawing.
 * - /contact: clients around the world calling Ahmedabad (owner, 5 Nov 2026), Bhumika's drawing for
 *   the contact island, parked on design/contact-illustration (the island took no drawing). The same
 *   file at the same path, so that branch landing changes nothing here.
 */
const CARD_DRAWINGS: Readonly<Record<string, { src: string; width: number; height: number }>> = {
  [ROUTES.contact]: { src: '/illustrations/enquiry/contact-call.png', width: 1200, height: 620 },
};

/**
 * The page's picture (owner, 4 Nov 2026):
 * - its own hero drawing, where it has one;
 * - else its family hub's drawing until its own lands: a service's line, /audits for an audit,
 *   /expertise for an expertise page (expertise pages take illustrations, never photographs), /tools
 *   for a tool;
 * - a case study's published banner, with its local V1 cover as a fallback;
 * - a video's YouTube thumbnail, else its cover from Strapi;
 * - an article's or an event's cover from Strapi.
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
          : family === 'tools'
            ? ROUTES.tools
            : path.startsWith(`${ROUTES.futureInterfacesLab}/`)
              ? ROUTES.futureInterfacesLab
              : null;
  const own = serviceIllustration(path) ?? CARD_DRAWINGS[path];
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

async function mediaFor(path: string, resource: Resource, caseStudy: CaseStudy) {
  const drawing = drawingFor(path);
  if (drawing) return drawing;

  const video = resource?.heroVideo;
  const thumbnail = video ? await youtubeThumbnail(video.id) : null;
  const [, family, slug] = path.split('/');
  const hero = caseStudy?.hero.media;
  const cover =
    thumbnail ??
    resource?.bannerImage ??
    resource?.thumbnail ??
    (hero?.type === 'image' ? hero.image : undefined) ??
    (family === 'case-studies' && slug ? getCaseCoverFallback(CASE_SLUG_REDIRECTS[slug] ?? slug) : undefined);
  if (!cover?.width || !cover.height) return null;
  return {
    media: { kind: 'capture', src: cover.src, width: cover.width, height: cover.height } as const,
    source: thumbnail ? ('video' as const) : caseStudy ? ('banner' as const) : ('cover' as const),
  };
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
  resource: Resource,
  caseStudy: CaseStudy,
): Promise<{ media: ShareMedia; source: ShareSource; fingerprint: string } | null> {
  const found = await mediaFor(path, resource, caseStudy);
  return found ? { ...found, fingerprint: await fingerprintOf(found.media) } : null;
}

/**
 * The share card for a path, from the page's own words: the corpus page's H1 and eyebrow where the
 * copy authors the page, else the CMS entry's title. A path neither knows takes the home card, so no
 * link ever unfurls without an image.
 */
export async function shareCardFor(path: string): Promise<ShareCard> {
  const [, family, slug, ...rest] = path.split('/');
  const isResource = family === 'insights' && slug && slug !== 'authors';
  const isCaseStudy = family === 'case-studies' && slug && !rest.length;
  const authorSlug = family === 'insights' && slug === 'authors' && rest.length === 1
    ? rest[0]
    : undefined;
  const [resource, caseStudy] = await Promise.all([
    isResource
      ? getResourceDetail([slug, ...rest].join('/'), SHARE_REVALIDATE_SECONDS).catch((error) => {
          console.error(`share cards: resource unavailable for ${path}`, error);
          return null;
        })
      : null,
    isCaseStudy
      ? getCaseStudyDetail(CASE_SLUG_REDIRECTS[slug] ?? slug, SHARE_REVALIDATE_SECONDS).catch((error) => {
          console.error(`share cards: case study unavailable for ${path}`, error);
          return null;
        })
      : null,
  ]);
  const page = await getCorpusPage(path);
  if (page && resource?.kind !== 'event' && resource?.kind !== 'podcast') {
    return shareCard({
      path,
      title: page.hero.titleText,
      eyebrow: page.hero.eyebrow ? inlineToText(page.hero.eyebrow) : null,
      name: page.name,
      cut: HERO_CUTS[path],
      ...(await pictureFor(path, resource, caseStudy)),
    });
  }
  const person = authorSlug
    ? await getAuthorShareProfile(authorSlug, SHARE_REVALIDATE_SECONDS).catch((error) => {
        console.error(`share cards: author unavailable for ${path}`, error);
        return null;
      })
    : null;
  if (person) {
    const photo = person.image && !(await isCutOut(person.image.src)) ? person.image : undefined;
    return shareCard({
      path,
      title: person.name,
      eyebrow: null,
      name: person.name,
      subtitle: person.role ?? null,
      ...(photo
        ? {
            /* Only the picture's own facts: an image record's `kind` must not overwrite the card's. */
            media: {
              kind: 'portrait' as const,
              src: photo.src,
              width: photo.width,
              height: photo.height,
              focus: PORTRAIT_FOCUS,
            },
            source: 'portrait' as const,
            fingerprint: photo.src,
          }
        : { initials: initialsOf(person.name), source: 'initials' as const, fingerprint: 'initials' }),
    });
  }
  const title = resource?.title ?? caseStudy?.hero.title;
  if (title) {
    const picture = await pictureFor(path, resource, caseStudy);
    return shareCard({ path, title, eyebrow: resource?.eyebrow ?? null, name: title, cut: HERO_CUTS[path], ...picture });
  }
  if (isResource || isCaseStudy || authorSlug)
    return shareCard({ path, title: 'Tcules', eyebrow: null, name: 'Tcules' });

  const { metadata } = await getPageSeo(path, SHARE_REVALIDATE_SECONDS);
  if (typeof metadata.title === 'string') {
    const picture = await pictureFor(path, resource, caseStudy);
    return shareCard({ path, title: metadata.title, eyebrow: null, name: metadata.title, ...picture });
  }
  if (path !== ROUTES.home) return { ...(await shareCardFor(ROUTES.home)), path };
  return shareCard({ path, title: 'Tcules', eyebrow: null, name: 'Tcules' });
}
