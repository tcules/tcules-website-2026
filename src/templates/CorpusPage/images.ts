import type { CollagePhotos } from '@/patterns';
import { getKitPhoto } from '@/lib/photos';
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
  | CorpusImage
  | HeroCutOut
  | PlaceholderImage
  | NonNullable<CorpusCaseRef['thumbnail']>;

/**
 * A hero picture that is the page's own artefact cut out of its frame (Media kind `cut-out`): the real
 * product, rendered whole on a contrast panel where its white edge does not hold against paper
 * (decisions/2026-09-24-cut-out-contrast-panel-below-3-1). No shadow: the artefact carries its own.
 */
export type HeroCutOut = Omit<CorpusImage, 'kind' | 'sources'> & {
  kind: 'cut-out';
  panel: 'paper-deep';
  /**
   * A recomposed cut for a phone (below 768): one frame of the artefact rather than the whole set,
   * where the set shrunk to a 326 column leaves nothing to read (matter critic, pass 2, 4 Nov 2026:
   * the three-frame collage rendered 262 × 144). PageHero sets it as the image's art direction.
   */
  phone?: { src: string; width: number; height: number };
};

/**
 * One item's own picture in a set, cut from the page's artefact (Media kind `cut-out`): a detail of
 * the real file on the hero's paper-deep panel, with the one crop shadow so its white edge holds on
 * the panel (decisions/2026-09-24-cut-out-contrast-panel-below-3-1).
 */
export type ItemCutOut = Omit<CorpusImage, 'kind' | 'sources'> & {
  kind: 'cut-out';
  panel: 'paper-deep';
  shadow: true;
};

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
  /* "Designers who see what your product could become": the working wall, the page's own
     `why_work_wall` binding, which its Reasons band no longer carries (reasons take drawings). The team
     photograph stays the studio band's. */
  [ROUTES.whyTcules]: ABOUT_WALL,
  /* "Who we've worked with and what each asked for": the studio presenting work in review, the nearest
     of the three to client work; the page binds no hero of its own (docs/page-build/pages/clients.md). */
  [ROUTES.clients]: ABOUT_REVIEW,
  /* /future-interfaces-lab binds none (critic, 4 Nov 2026): the working wall is a design workshop, not
     the Lab, it is already /why-tcules' and the AI-native page's hero, and at its 936 × 1262 portrait it
     ran past the fold. The live Lab page holds no picture of the Lab, so its hero is the register's
     labelled placeholder (`/future-interfaces-lab#hero`, 5:4) until the illustration is drawn. */
  /* "Build AI products in Ahmedabad": a fellow presenting work to seated colleagues in the studio, which
     is what the page describes (direct critique, weekly demos, review in the open). The page binds no
     image of its own (docs/page-build/pages/future-interfaces-lab-join.md). */
  [ROUTES.futureInterfacesLabJoin]: ABOUT_REVIEW,
};

/**
 * A band that reuses a studio photograph, by band id and the routes it applies on (page-mapping § 0
 * rule 5, step 3: a studio photograph the corpus binds elsewhere, where the page's plan names the
 * reuse). One use a page; the photograph grade is the shared tone layer.
 *
 * Empty since 4 Nov 2026: the audits' "After the audit" took the studio review photograph on all six
 * pages, and the critic found it an addition the copy never asks for (no-bespoke-additions), the same
 * picture on every audit, and a ~370 photo carrying a band of one sentence. The band is the copy's
 * sentence and its link, sized to its words.
 */
const STUDIO_BAND: readonly {
  band: string;
  routes: (route: string) => boolean;
  photo: CorpusMediaBinding;
}[] = [];

/** The studio photograph a band reuses on this route, if its plan names one (`STUDIO_BAND`). */
export function studioBandPhoto(route: string, bandId: string): CorpusMediaBinding | undefined {
  return STUDIO_BAND.find((entry) => entry.band === bandId && entry.routes(route))?.photo;
}

/**
 * A hero that shows the page's own artefact, by route: the thing the page is about, where the page
 * binds no hero asset and the live site holds the real one (the copy's `visual_plan` names it). Read
 * after the page's own binding and before a studio reuse.
 */
const ARTEFACT_HERO: Record<string, HeroCutOut> = {
  /* visual_plan `real_matter_figma_artefacts`: three real frames of the Matter Figma file, from the
     live site's Matter page (docs/page-build/pages/matter-design-system.md). */
  [ROUTES.matterDesignSystem]: {
    src: '/matter-design-system/matter-collage.webp',
    alt: 'Three frames from the Matter Figma file: accessible colour palettes, the Button component in every size and state, and the Tokens Studio panel of purpose-named tokens.',
    /* Cropped to the frames' alpha bounds (shadows kept): the master's own margin added to the
       panel's inset (matter critic, 4 Nov 2026). */
    width: 1900,
    height: 1041,
    kind: 'cut-out',
    panel: 'paper-deep',
    /* Below 768 the Button frame alone, its top half (the title, resting to pressed, the filled, line
       and ghost rows), cut from the same master: the three frames at 262 wide read as a grey smudge
       (matter critic, pass 2, 4 Nov 2026). */
    phone: { src: '/matter-design-system/matter-hero-phone.webp', width: 698, height: 632 },
  },
};

/**
 * A prose band that shows the page's own artefact beside its words, by route and band: a real image of
 * the thing the page is about, from the live site, where the copy binds none (the page's
 * `visual_plan` names the artefact). `crop` sets it as the media split's photograph (cover-cropped,
 * the picture leading in 7); `own` keeps the whole image at its own ratio in a half beside the words,
 * for an artefact a crop would cut into (ContentSection's figure track). Read before an illustration
 * slot, so a real picture replaces a placeholder.
 */
export type BandArtefact = { image: CorpusImage; fit: 'crop' | 'own' };

const ARTEFACT_BAND: Readonly<Record<string, BandArtefact>> = {
  /* /matter-design-system "Duplicate Matter from Figma Community and take it apart": Matter's own
     components exploded off the canvas (Blue 500 and Cyan 500 swatches, the Primary and Secondary
     buttons, the select, the type styles), the live Matter page's picture beside its token naming
     (owner, 4 Nov 2026: "there are some images for MDS on the live website ... use them where
     necessary"). Whole at its own 4 : 3: cropped to the split's photograph it cut labels mid-word
     ("Drag & drop to u…", "Edit fie…"), which read as an error (matter critic, pass 2). */
  [`${ROUTES.matterDesignSystem}#use`]: {
    image: {
      src: '/matter-design-system/matter-components.webp',
      alt: 'Matter components laid out in perspective: Blue 500 and Cyan 500 colour swatches, Primary and Secondary buttons, a select menu, checkboxes, radio buttons and the primary and secondary type styles.',
      width: 1600,
      height: 1200,
      kind: 'capture',
    },
    fit: 'own',
  },
  /* /matter-design-system `beyond-the-file` took the live page's screen-and-code picture on 4 Nov
     (pass 2) and gave it back the same day: it is the old site's AI illustration in the retired green,
     a generic skeleton rather than a frame of the file (matter critic, pass 2). The band argues for
     what goes BEYOND the file, which no Matter frame shows, so it keeps its illustration slot
     (plan.ts ILLUSTRATED_PROSE), a labelled placeholder until drawn. */
};

/** The page's own artefact a prose band shows on this route, if any (`ARTEFACT_BAND`). */
export function bandArtefact(route: string, bandId: string): BandArtefact | undefined {
  return ARTEFACT_BAND[`${route}#${bandId}`];
}

/**
 * The hero's picture: the page's own binding, then the page's own artefact, then a named studio reuse,
 * then its placeholder.
 */
export function heroImage(page: CorpusPage): SlotImage {
  const own = page.composition.mediaBindings.find(
    (binding) => binding.bound && binding.supportsSection === 'hero',
  );
  if (own) return corpusImage(own);
  const artefact = ARTEFACT_HERO[page.route];
  if (artefact) return artefact;
  const reused = STUDIO_HERO[page.route];
  return reused ? corpusImage(reused) : placeholderImage(page.route, 'hero');
}

/**
 * A band of items each shown by its OWN image, by route and band, then by the item's title as authored:
 * the Lab's AI interface experiments, each its real artefact from the live site (copied to
 * `public/future-interfaces-lab/`). A set takes covers only when every item has one (DestinationsBand),
 * so one missing image never leaves a hole in the row. 4 Nov 2026.
 */
const ITEM_COVERS: Readonly<Record<string, Readonly<Record<string, CorpusImage>>>> = {
  [`${ROUTES.futureInterfacesLab}#ai-interfaces`]: {
    'Open Canvas Workflow Builder': {
      src: '/future-interfaces-lab/open-canvas-workflow-builder.webp',
      alt: 'Open Canvas Workflow Builder, a Future Interfaces Lab workflow experiment',
      width: 698,
      height: 481,
      kind: 'capture',
    },
    'Gujarati Voice AI Math Tutor': {
      src: '/future-interfaces-lab/gujarati-voice-ai-math-tutor.webp',
      alt: 'Two students using the Gujarati Voice AI Math Tutor on a tablet',
      width: 698,
      height: 481,
      kind: 'photograph',
    },
    'Shopping Assistant Programme': {
      src: '/future-interfaces-lab/shopping-assistant-programme.webp',
      alt: 'Shopping assistant concept screens from the Future Interfaces Lab',
      width: 698,
      height: 481,
      kind: 'capture',
    },
  },
};

/** The band's per-item images, by item title, where its route names them (`ITEM_COVERS`). */
export function itemCovers(
  route: string,
  bandId: string,
): Readonly<Record<string, CorpusImage>> | undefined {
  return ITEM_COVERS[`${route}#${bandId}`];
}

/**
 * A set whose items each show a detail of the page's own artefact, by route and band, then by the
 * item's title as authored: /matter-design-system "What's inside", each property zoomed out of the
 * hero's collage (the real Matter file) on the hero's paper-deep panel, so the band reads as a closer
 * look at the hero. Three generic flat drawings stood here; the owner asked for the live site's Matter
 * images wherever the page needs a picture of the file (owner, 4 Nov 2026; matter critic, pass 2).
 * Every crop is 8 : 5 (padded clear where its frame is shorter), so the three panels share a height.
 * Read before the band's drawings: a set takes them only when every item has one.
 */
const ITEM_CUT_OUTS: Readonly<Record<string, Readonly<Record<string, ItemCutOut>>>> = {
  [`${ROUTES.matterDesignSystem}#contents`]: {
    'Tokens named for their purpose.': {
      src: '/matter-design-system/matter-tokens-purpose.webp',
      alt: 'Matter spacing tokens in Tokens Studio, named null, tiny, smallest, smaller, small, base, large, larger, largest, huge and colossal, with small showing its value of 12px, and border radius tokens from sharp to circular.',
      width: 465,
      height: 291,
      kind: 'cut-out',
      panel: 'paper-deep',
      shadow: true,
    },
    'Components built from smaller parts.': {
      src: '/matter-design-system/matter-button-states.webp',
      alt: "Matter's Button assembled from a label and two icons, in filled, line and ghost styles at large, medium and small, across its resting, hovered and focused states.",
      width: 600,
      height: 375,
      kind: 'cut-out',
      panel: 'paper-deep',
      shadow: true,
    },
    'Naming you can follow.': {
      src: '/matter-design-system/matter-tokens-library.webp',
      alt: "Matter's token sets in Tokens Studio, organised as base, semantic tokens, semantic, semantic colours, landing page colours and component tokens, beside the sizing scale from tiny to colossal.",
      width: 535,
      height: 334,
      kind: 'cut-out',
      panel: 'paper-deep',
      shadow: true,
    },
  },
};

/** The band's per-item cut-outs, by item title, where its route names them (`ITEM_CUT_OUTS`). */
export function itemCutOuts(
  route: string,
  bandId: string,
): Readonly<Record<string, ItemCutOut>> | undefined {
  return ITEM_CUT_OUTS[`${route}#${bandId}`];
}

/**
 * A band that shows the studio itself, set as the studio collage (decisions/2026-11-03-studio-collage:
 * "any band that shows the studio itself"), by route and band: the six real studio photographs round the
 * band's words, each tile's photo, focus and zoom a placement choice. The lead names what it shows; the
 * other five are atmosphere (alt ""). Picks are a proposal for the owner's eye, as home's were.
 *
 * /careers "Product designer jobs in Ahmedabad": each tile matches a sentence of the copy. The lead is
 * the team round one table ("the team works together"); the lower row a review over printouts, a
 * whiteboard walkthrough ("critique happens during the work"), two at one screen ("pull a colleague
 * into a problem"), two neighbours talking across desks ("someone at the next desk can question a
 * workflow") and a presenter at the board ("as well as in review"). None is in home's collage, nor
 * another frame of one of home's moments (docs/page-build/pages/careers.md, 4 Nov 2026).
 */
const STUDIO_COLLAGE: Readonly<Record<string, CollagePhotos>> = {
  [`${ROUTES.careers}#ahmedabad`]: {
    lead: {
      image: getKitPhoto('studio-meeting-room-laptops', {
        alt: 'The Tcules team working round a table in the Ahmedabad studio',
      }),
      focus: { x: 0.45, y: 0.55 },
    },
    start: {
      image: getKitPhoto('studio-meeting-table-portrait'),
      focus: { x: 0.4, y: 0.62 },
      zoom: 1.15,
    },
    middle: { image: getKitPhoto('studio-whiteboard-walkthrough'), focus: { x: 0.62, y: 0.45 } },
    middleStart: { image: getKitPhoto('studio-pair-at-monitor'), focus: { x: 0.5, y: 0.5 } },
    middleEnd: { image: getKitPhoto('studio-desk-pairing'), focus: { x: 0.45, y: 0.5 } },
    end: { image: getKitPhoto('studio-talk-presenter-portrait'), focus: { x: 0.46, y: 0.6 } },
  },
};

/** The studio collage a band is set as on this route, if any (`STUDIO_COLLAGE`). */
export function studioCollage(route: string, bandId: string): CollagePhotos | undefined {
  return STUDIO_COLLAGE[`${route}#${bandId}`];
}

/**
 * A set of a few peers set beside ONE studio photograph, by route and band (ContentSection `media`): the
 * items under the heading in the copy column, the photograph in the other track. A photograph may sit
 * beside items nobody clicks (CLAUDE.md, design quality). /future-interfaces-lab/join "What you leave the
 * fellowship with" (critic, 4 Nov 2026, pass 2): as a split list it copied "Why join" one band later and
 * the run from the hero to the blue island held one picture in ~3,300px. The whiteboard critique is the
 * band's two payoffs in one frame: a system's architecture drawn on the wall, walked through for the
 * people who will critique it. Kit photograph, as the studio collage (owner to confirm).
 */
const PHOTO_BESIDE: Readonly<Record<string, ReturnType<typeof getKitPhoto>>> = {
  [`${ROUTES.futureInterfacesLabJoin}#what-youll-gain`]: getKitPhoto('studio-whiteboard-crit', {
    alt: 'Three colleagues listening as a teammate walks them through a system diagram on the studio whiteboard',
  }),
};

/** The photograph a set sits beside on this route, if any (`PHOTO_BESIDE`). */
export function photoBeside(route: string, bandId: string) {
  return PHOTO_BESIDE[`${route}#${bandId}`];
}
