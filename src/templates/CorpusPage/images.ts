import { ROUTES } from '@/lib/routes';
import type { CorpusCaseRef, CorpusMediaBinding, CorpusPage } from '@/lib/corpus-types';
import { corpusImage, type CorpusImage } from '@/lib/corpus-images';
import {
  placeholderCover,
  placeholderImage,
  hasPlaceholder,
  type PlaceholderImage,
} from '@/lib/placeholders';

/**
 * Where an image slot's picture comes from (page-mapping § 0 rule 5, first match wins):
 *
 *   1. a binding of THIS page that supports the band, bound to an existing public asset;
 *   2. for a cited case, the binding that names it on this page, then the case page's own first bound
 *      asset (its cover) — a pre-existing image the corpus already points at;
 *   3. a studio photograph the corpus binds elsewhere, only where the page's plan names the reuse;
 *   4. a labelled placeholder with a row in docs/image-register.md.
 *
 * No generation, and no kit catalogue photograph: nothing in the corpus points at one. The one
 * exception is the home page's sector cards, which the owner gave stock photographs by name
 * (`HOME_SECTOR_PHOTOS`, 19 Oct 2026); that band reads them itself.
 */

export type SlotImage =
  CorpusImage | PlaceholderImage | NonNullable<CorpusCaseRef['thumbnail']>;

export const slugOf = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[`'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** The words a binding's id is about, once the page's own name is taken out ("product_design_dealpath" → dealpath). */
function bindingWords(page: CorpusPage, binding: CorpusMediaBinding): string[] {
  const own = new Set(slugOf(page.slug).split('-'));
  return binding.id
    .split(/[_-]+/)
    .map((word) => word.toLowerCase())
    .filter((word) => word.length >= 4 && !own.has(word));
}

/** The page's bound binding that names `text` ("Doodle." → product_design_doodle), if any. */
export function bindingNamed(page: CorpusPage, text: string): CorpusMediaBinding | undefined {
  const words = new Set(slugOf(text).split('-'));
  return page.composition.mediaBindings.find(
    (binding) => binding.bound && bindingWords(page, binding).some((word) => words.has(word)),
  );
}

/** A band's own slot: a bound asset that supports it, else its register placeholder. */
export function slotImage(page: CorpusPage, bandId: string, qualifier?: string): SlotImage {
  const bound = page.composition.mediaBindings.find(
    (binding) => binding.bound && binding.supportsSection === bandId,
  );
  return bound ? corpusImage(bound) : placeholderImage(page.route, bandId, qualifier);
}

export function hasSlot(page: CorpusPage, bandId: string, qualifier?: string): boolean {
  return (
    page.composition.mediaBindings.some((b) => b.bound && b.supportsSection === bandId) ||
    hasPlaceholder(page.route, bandId, qualifier)
  );
}

/**
 * A cited case's cover: this page's binding that names it, then the case page's own cover, then the
 * live case's thumbnail (the /case-studies listing's picture), then the case's placeholder (one asset
 * for every page that cites it). A caller passes the case's ref, or the case resolves by name alone.
 *
 * `bandId`: where a placement crops the cover to a shape its 16:9 master cannot survive (the index's
 * one-case story, a 4:5 media split), the register gives that slot a row of its own, keyed by the band
 * and the case (`designed-and-built (The Wandering Raven)`), drawn at the slot's ratio. A labelled
 * panel cannot be cropped: cut to 4:5 the master lost its label mid-word and its right-hand edge. A
 * real cover still wins over it.
 */
export function coverFor(
  page: CorpusPage,
  name: string,
  caseRef?: CorpusCaseRef,
  bandId?: string,
): SlotImage {
  const named = bindingNamed(page, name);
  if (named) return corpusImage(named);
  if (caseRef?.cover) return corpusImage(caseRef.cover);
  if (caseRef?.thumbnail) return caseRef.thumbnail;
  const slug = slugOf(name.replace(/\.$/, ''));
  if (bandId && hasPlaceholder(page.route, bandId, slug)) {
    return placeholderImage(page.route, bandId, slug);
  }
  return placeholderCover(slug);
}

/**
 * A cited case's OWN cover, never a page binding: a band-level binding about one item (PD's Doodle object
 * model) is not the cover of the case a row names (owner, 30 Oct 2026, round 5).
 */
export function caseCover(name: string, caseRef?: CorpusCaseRef): SlotImage {
  // Listing cover first: a case's own cover can be an in-page diagram (Doodle's object model) the owner rejected as 'random'.
  if (caseRef?.thumbnail) return caseRef.thumbnail;
  if (caseRef?.cover) return corpusImage(caseRef.cover);
  return placeholderCover(slugOf(name.replace(/['’]s$/, '').replace(/\.$/, '')));
}

/**
 * Rule 3: a studio photograph the corpus binds on /about, reused as a hero where the page names no
 * image of its own. Keyed by route, so the reuse is stated rather than guessed (owner, 1 Nov 2026;
 * docs/page-build/pages/how-we-work.md).
 */
const aboutPhoto = (id: string, assetUri: string, altIntent: string): CorpusMediaBinding => ({
  id,
  role: 'atmosphere_and_evidence',
  supportsSection: 'hero',
  card: null,
  assetUri,
  altIntent,
  status: 'SATISFIED_BY_EXISTING_ASSET',
  bound: true,
  source: '/about',
  caption: null,
  attribution: null,
});
const CLOUD = 'https://res.cloudinary.com/dbay1gb0s/image/upload';
const ABOUT_TEAM = aboutPhoto(
  'about_team',
  `${CLOUD}/v1788186423/Image_3_ef562c4bc0.webp`,
  'Tcules team together outside the studio in Ahmedabad.',
);
const ABOUT_REVIEW = aboutPhoto(
  'about_studio_review',
  `${CLOUD}/v1788186528/Image_2_6b09ca7e30.webp`,
  'Tcules team in an in-studio presentation and review session.',
);
const ABOUT_WALL = aboutPhoto(
  'about_work_wall',
  `${CLOUD}/v1788186507/Image_1_c048010957.webp`,
  'A working wall of discovery, product thinking, UX and visual design material.',
);
const STUDIO_HERO: Record<string, CorpusMediaBinding> = {
  [ROUTES.howWeWork]: ABOUT_TEAM,
  [ROUTES.howWeWorkAiNative]: ABOUT_WALL,
  [ROUTES.howWeWorkAiTransparency]: ABOUT_REVIEW,
};

/** The hero's picture: the page's own binding, then a named studio reuse, then its placeholder. */
export function heroImage(page: CorpusPage): SlotImage {
  const own = page.composition.mediaBindings.find(
    (binding) => binding.bound && binding.supportsSection === 'hero',
  );
  if (own) return corpusImage(own);
  const reused = STUDIO_HERO[page.route];
  return reused ? corpusImage(reused) : placeholderImage(page.route, 'hero');
}
