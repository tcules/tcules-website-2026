import type { ComponentProps, ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  type IconName,
  Layout,
  Media,
  type MediaImage,
  Sketch,
  Tag,
  Texture,
  TextureShape,
} from '@/components';
import { cx } from '@/lib/cx';
import type { ArticleSceneName, GlossarySceneName } from '@/lib/sketches';
import { CARD_THREE_TRACKS, CARD_TWO_TRACKS } from '@/lib/image-sizes';

import styles from './BlockCard.module.css';

/**
 * The card's image record: `Media`'s own `MediaImage` — master `src`, `alt`, derived `sources`, and
 * the `kind` that decides its edge — with the intrinsic `width` and `height` OPTIONAL.
 *
 * They are optional here, and required on `Media`, because a card never lays out by them: the
 * image fills a box whose ratio the CARD owns (`fit="fill"`), so the two numbers are only the
 * attributes on the `<img>`, which the fill rule overrides. Several view models still arrive
 * without them (spec § 17 Q15). A record with no dimensions is given the box's own proportions and
 * loses its `sources`, because a srcset needs the master's true width for its `w` descriptor and
 * a guessed one would make the browser pick the wrong file. It is also flagged `placeholderSize`,
 * so Media reports no master pixels for it to the resolution gate.
 */
export type BlockCardImage = Omit<MediaImage, 'width' | 'height'> & {
  width?: number;
  height?: number;
};

/**
 * The one media slot, and one closed fill: the card's cover image, nested as a record. Callers
 * cannot pass a React node, so the slot cannot acquire controls, overlays or call-site crop
 * behaviour.
 *
 * The discriminant is `type`, not `kind`, because the record carries its own `kind` (capture,
 * cut-out, illustration, photograph) and `media.kind === 'image'` beside `media.image.kind` would
 * read as one field twice — PageHero's A3, followed here for one vocabulary.
 *
 * There is no icon fill any more. Under ruling C1 the families that carry media carry a cover
 * image, and the service, audit, glossary and capability cards that used to be the icon's home are
 * media-less; ch04 wants one icon per tile in ink, and a 24px glyph heading a card is not what any
 * family is now given. It had no route use (spec § 17 Q14).
 *
 * `texture` is the one cover the card draws itself (cmp-feature, 6 Oct 2026): the Tcules pixel grid
 * (the Texture primitive) through one of three blurred fields, inside the same ruled box, with the
 * card's `icon` — if it has one — centred on it in blue. It is the stand-in for an ARTEFACT with no
 * cover yet (a resource, a template, a checklist): a stock photograph of sticky notes said nothing
 * about the thing, and the texture is the brand's own surface (visual-direction § 6). `recipe`
 * picks the field; BlockCardSet assigns them in order so three neighbours never repeat. No type is
 * ever drawn on it.
 */
export type BlockCardTextureRecipe = 0 | 1 | 2;
export type BlockCardMedia =
  | { type: 'image'; image: BlockCardImage }
  | { type: 'texture'; recipe?: BlockCardTextureRecipe }
  /**
   * `sketch` (13 Oct 2026, the insights hub): a DRAWN cover — the Sketch scene drawn for this one
   * article from its own argument, on its dot-field plate inside the same ruled 16:9 box. Typed to
   * the article scenes: a service scene is never a cover (owner). The caller assigns it, item by
   * item, in data. Decorative like every cover; no type is drawn on it. A glossary term's own scene
   * is a cover too (4 Nov 2026): it is drawn for that one term, as an article's is for one article.
   */
  | { type: 'sketch'; name: ArticleSceneName | GlossarySceneName };

/**
 * The title's element. `h2` exists for one case: a set that IS the page's list, directly under the
 * page's h1 with no band heading between them (the case-study index, `/case-studies`). There the
 * cards are the page's sections, and an h3 under an h1 skips a level (axe heading-order).
 */
export type BlockCardTitleElement = 'h2' | 'h3' | 'h4';

/**
 * There is no crop to choose. Every cover is 16:9, at every width and in every arrangement (owner,
 * home round 3, 11 Oct 2026: "i wouldn't want random image ratios on the cards ever"): one
 * standard image ratio across the site, so a cover is authored once at a 2560 × 1440 master and
 * reads the same in a row of four, a featured row and beside a quote (--bcrd-media-ratio →
 * --ratio-standard). The `ratio` prop and its seven crops (cover 3:2, wide 16:9, panorama 21:9,
 * double 2:1, square 1:1, pair 16:5, headshot 1:1) are retired; a band that runs long at 16:9
 * changes its arrangement, never the crop.
 */

/**
 * How a WHOLE-CARD link says it navigates. One cue per card, never both.
 *
 *   title  the title itself (owner, 7 Oct 2026): no glyph at rest, and on hover and focus the
 *          title takes the accent ink (and a cover leans in). It replaced `arrow`, a blue arrow
 *          after the title's last word: on nearly every card in the kit it read as bulky, and the
 *          whole card is already the link. ListCard's linked items answer the same way.
 *   cta    a link-style action under the copy ("Read more", or `ctaLabel`), blue at rest, with its
 *          arrow; the title stays dark. The per-card CTA of § 1.4 (+64: 24 + a 40 row). For a card
 *          whose action is NOT obvious from its title; a card whose title names its destination
 *          needs none.
 *
 *   download  the cta again, with the download glyph and "Download" (or `ctaLabel`): a resource
 *          that is a file says so before it is opened (M, cmp-feature 6 Oct 2026). Pair it with
 *          `meta` ("PDF · 12 pages"), which sits beside it on the action row.
 *
 * Defaults: `title` on a card with a cover or an icon, `cta` on a text-only card — the shape every
 * live route already renders. A feature set states it for the whole set (BlockCardSet `cue`).
 */
export type BlockCardCue = 'title' | 'cta' | 'download';

/**
 * The card's finish (owner, 7 Oct 2026 — a partial reversal of "a card is never a box",
 * visual-direction § 3.1).
 *
 *   none  the default: the borderless card, bounded by its set's gutter and its cover's edge.
 *   box   no edge (owner, 9 Oct 2026): its content a `block` (24) inside, and — on a linked card —
 *         a ground at the 8 radius under the pointer, which is what the inset is for. For a set
 *         whose cards must read as separate targets: an icon router of four to six destinations.
 *         A text-only card draws no top hairline inside a box.
 *   panel the text-only card as an OBJECT (owner, 28 Oct 2026, the insights finder's grid: a piece
 *         with no picture beside pieces with one): at rest, the drawn covers' plate — their ground,
 *         hairline and 8 radius — with the label at its head and the title and standfirst at its
 *         foot, filling its row's height (from md, never less than a square), so a row of covered
 *         and uncovered pieces ends on one line. Title-cued; no top hairline. In place of a picture
 *         it carries what the piece has: its `icon` before the label, its `meta` under the title.
 *   tile  the filled tile (owner, 3 Nov 2026, /contact "Other ways to reach us"): at rest a ground of
 *         its own (--bcrd-tile-ground, one step off the surface) at the 16 radius, no edge and no
 *         hover ground, the copy a `gutter` inside. For a short set of destinations each led by its
 *         glyph and closed by its own action (`linkScope` `cta`): the ground makes each one an
 *         object without a rule, and the action, not the tile, answers the pointer.
 *
 * A set's decision, like the type step: BlockCardSet `frame` states it for every card. `panel` is
 * the one a caller may set per card, for the card that has no cover.
 */
export type BlockCardFrame = 'none' | 'box' | 'panel' | 'tile';

/**
 * How a cta-scoped card's action is drawn. `link` (default) the link Button with its arrow; `outline`
 * the labelled outline Button (owner, 3 Nov 2026, /contact), for a set where each card's action is
 * the card's whole point, a mailbox or a page, and must read as a control. Never beside a solid.
 */
export type BlockCardCtaEmphasis = 'link' | 'outline';

/* A destination that leaves the site (another origin, a mailbox) takes the up-right arrow; one that
   stays takes the right arrow (owner, 3 Nov 2026: the email buttons ↗, Careers →). */
const leavesSite = (href: string) => /^(mailto:|tel:|https?:\/\/)/.test(href);

/**
 * Which axis the card arranges on. A PRESENTATION choice, never a CMS field.
 *
 *   vertical    the grid tile: media above copy, filling one track of a multi-column Layout.
 *   horizontal  the row: two equal tracks from md, 64 apart. With an image, media beside copy at
 *               16:9, the one card ratio. Without one, the copy splits instead — eyebrow and title in the first track,
 *               body and cta in the second — so a text-only row is a head beside its body rather
 *               than a single column with an empty half. Either way it defaults to the `lg` size,
 *               because a row spanning the column carries more weight than a tile. This is the
 *               featured arrangement `BlockCardSet` gives its first item (ruling C3).
 */
export type BlockCardOrientation = 'vertical' | 'horizontal';

/**
 * Which side the media takes when the card is horizontal and has an image. Caller-set per card on
 * purpose: there is no alternation logic here, because a component that alternated would have to
 * know its own index and the parent already does.
 */
export type BlockCardImageSide = 'left' | 'right';

/**
 * How many tracks the card's set runs at its widest — which is all the card needs to know to state
 * its image's `sizes` (src/lib/image-sizes.ts). A card cannot see its track, so the set says.
 *
 *   2  CARD_TWO_TRACKS. The default, because it never under-fetches in a set of two, three or
 *      four tracks: at worst a 3-up card fetches the 2-up file.
 *   3  CARD_THREE_TRACKS. For a set that reaches three tracks at lg; it over-fetches below 1024,
 *      never under.
 *
 * Ignored when horizontal: the media then takes half the row, which is CARD_TWO_TRACKS's width
 * less 16px, so the featured card always reads that one.
 */
export type BlockCardTracks = 2 | 3;

/**
 * The card's type step: title and body roles together (visual-direction § 7.2, 5 Oct 2026). A
 * COMPONENT SIZE, so a t-shirt name. The card does not know its count, so the set passes it.
 *
 *   lg  h4 title, body-lg   the one featured card; horizontal, its title is the serif h3 (the
 *                           one serif card title, 22 Oct 2026)
 *   md  h4 title, body      two to three cards; text cards
 *   sm  h5 title, body-sm   four to six cards across
 *
 * Defaults by orientation — `lg` when horizontal, `md` when vertical — so a caller that states
 * neither gets the arrangement's own weight. The set, not the card, decides `sm`.
 */
export type BlockCardSize = 'lg' | 'md' | 'sm';

/** One modifier per step, on the root; the module sets title and body roles under it. */
const SIZE_CLASS: Record<BlockCardSize, string | undefined> = {
  lg: styles.sizeLg,
  md: styles.sizeMd,
  sm: styles.sizeSm,
};

/**
 * The three texture fields, in TextureShape's own terms (percent of the cover, Figma blur). Each
 * leaves the grid strongest in a different region, so a row of three stand-ins reads as three
 * covers of one family rather than one cover thrice: a glow off the top end, a bank across the
 * foot, a field off the start edge.
 */
const TEXTURE_RECIPES: Record<
  BlockCardTextureRecipe,
  readonly ComponentProps<typeof TextureShape>[]
> = {
  /* Fix round 2 (6 Oct 2026): the fields were blurred 60 to 70 inside a box 220 tall, so the grid
     never reached full strength anywhere and the cover read as an empty frame — a placeholder. Each
     field is now a HARD-EDGED block of the grid at full strength: the brand's pixel geometry, a
     panel, a band and a step, set clear of the foot-start corner the glyph sits in. A blurred edge
     at this size only ever showed the fade. */
  0: [{ top: 0, right: 0, width: '58%', height: '100%', kind: 'rect', blur: 0 }],
  1: [{ top: 0, left: 0, width: '100%', height: '40%', kind: 'rect', blur: 0 }],
  2: [
    { top: 0, right: 0, width: '36%', height: '100%', kind: 'rect', blur: 0 },
    { top: 0, right: '36%', width: '28%', height: '46%', kind: 'rect', blur: 0 },
  ],
};

/** An index numeral, two digits: 1 → "01". The mono index voice ListCard's numbered rows use. */
const indexLabel = (value: number) => String(value).padStart(2, '0');

/** The cta label a linked card uses when the caller names none. */
const DEFAULT_CTA_LABEL = 'Read more';

/** The `download` cue's label when the caller names none. */
const DOWNLOAD_LABEL = 'Download';

/**
 * The attributes a record with no intrinsic size is given: the proportions of the box it fills,
 * restating --bcrd-media-ratio (--ratio-standard, 16/9) by hand, because TypeScript cannot read a
 * custom property. They never lay anything out — `fill` sizes the image to the box — so they are a
 * well-formed pair, not a measurement.
 */
const FILL_BOX = { width: 16, height: 9 } as const;

/** What an `href` makes clickable. See `BlockCardProps.linkScope`. */
export type BlockCardLinkScope = 'card' | 'cta';

/**
 * A closed card record. Grid geometry, surface and action rendering all stay outside the public
 * API: the parent owns the grid, the nearest Section owns the surface, and BlockCard owns its
 * optional whole-card link and the cue that names it.
 */
export type BlockCardProps = {
  /** Required card heading. Whitespace-only values render nothing and warn in development. */
  title: string;
  /**
   * One supporting paragraph. Whitespace-only values omit the paragraph and warn. Optional: a card
   * whose description is said by something beside it — the case card in Proof's G-case, where the
   * quote is the description (owner, 7 Oct 2026) — leaves it off, and no warning is raised.
   */
  body?: string;
  /**
   * The body as trusted inline HTML, one entry per paragraph (page-mapping G3): for a corpus item
   * whose body carries a link, a bold run or a second paragraph, which `body: string` would flatten.
   * Built by `inlineToHtml` from a parsed tree at the content seam, never from a raw string a caller
   * typed. Exclusive with `body`. A card whose `href` makes the whole frame the anchor (`linkScope`
   * `card`) may not hold a link: a link inside a whole-card link is an anchor in an anchor. Under
   * `linkScope` `cta` it may.
   */
  bodyHtml?: readonly string[];
  /**
   * One optional quiet label above the title — a client, a category, a content type, a kicker.
   * A plain string rather than a structured record: what belongs here varies by page, so the
   * caller composes the line and the card only renders it.
   */
  eyebrow?: string;
  /**
   * The optional cover image. Case studies and every insight or resource with a cover (articles,
   * videos, podcasts) carry one; service, audit, glossary and capability cards do not (ruling C1).
   */
  media?: BlockCardMedia;
  /** Heading semantics without a visual type change. Defaults to h3. */
  titleAs?: BlockCardTitleElement;
  /**
   * A non-blank destination turns the entire card into one native link, which says it navigates by
   * ONE cue (`cue`): its title, which takes the accent on hover and focus, or a link-style cta under
   * the copy. By default a card with a cover or an icon is title-cued and a text-only card takes the
   * cta.
   */
  href?: string;
  /**
   * The cta wording when the card's cue is `cta`. Defaults to "Read more", which is
   * content-type-agnostic; pass a specific line where the page can name its destination. Ignored
   * without `href` and under the title cue. `Button` uppercases it, so pass ordinary capitalisation.
   */
  ctaLabel?: string;
  /** Arrangement axis. Defaults to the grid tile. */
  orientation?: BlockCardOrientation;
  /** Media side in the horizontal arrangement. Ignored when vertical. Defaults to left. */
  imageSide?: BlockCardImageSide;
  /** The widest track count of the card's set, for the image's `sizes`. Defaults to 2. */
  tracks?: BlockCardTracks;
  /** The type step. Defaults to `lg` when horizontal and `md` when vertical. */
  size?: BlockCardSize;
  /**
   * A Solar Bold glyph on its own row above the title of a card with NO cover — the icon card of
   * C-icon (owner, 9 Oct 2026: stacked, never inline). Sized from the title's role, from
   * --bcrd-icon-size (owner, 7 Oct 2026: the 32 glyph heading the card was far too big). Blue, because icons carry the foreground accent (§ 4.2). Ignored
   * when the card has a cover: a card has one object at its head, never two.
   */
  icon?: IconName;
  /**
   * An index numeral above the title, set as `01`, `02` … in mono, blue (§ 4.2: index numerals
   * carry the accent). The text card's head (§ 3.1: hairline, 24, then an index or an eyebrow).
   * Usually passed by BlockCardSet `numbered`, which knows each card's position.
   */
  index?: number;
  /** How a linked card says it navigates. See `BlockCardCue`. Ignored without `href`. */
  cue?: BlockCardCue;
  /** The card's finish. Defaults to `none`. See `BlockCardFrame`. */
  frame?: BlockCardFrame;
  /**
   * What an `href` makes clickable (page-mapping G3b). `card` (default) is the whole frame as ONE anchor,
   * said by its cue. `cta` keeps the frame a plain `<div>` and makes the cta Button the card's ONLY
   * anchor, so the card's body may carry links of its own without an anchor sitting inside an anchor.
   * It forces the `cta` cue (a card whose pointer target is one small button has no title cue to give),
   * and a set takes it for every card, like `frame`: a row of six where one answers the pointer
   * differently reads as a recommendation.
   */
  linkScope?: BlockCardLinkScope;
  /** How a cta-scoped card's action is drawn. Default `link`. See `BlockCardCtaEmphasis`. */
  ctaEmphasis?: BlockCardCtaEmphasis;
  /**
   * One short format line for an artefact — "PDF · 12 pages", "Template · Figma" — in the mono
   * label voice, after the copy: on the action row beside a `download` or `cta` cue, or on its own
   * row when the card has none. Facts about the file, never a second description. As a list, each
   * fact is its own word-group, a `text` apart, so a line that wraps breaks between facts and never
   * starts on a separator (a panel's "Design system  27 Oct 2026  12 min read").
   */
  meta?: string | readonly string[];
  /**
   * One fact at the END of the label line, on its baseline: a listing's date (owner, 28 Oct 2026,
   * after claude.com/resources: "the date to the top right"). In the label voice, quiet.
   */
  aside?: string;
  /**
   * The piece's topic as an inert Tag at the card's FOOT (owner, 28 Oct 2026, after
   * claude.com/resources: "the topic to the bottom"). The card fills its row and the tag holds the
   * foot, so a row of cards ends on one line of tags.
   */
  tag?: string;
  /**
   * A play mark on the cover: the piece is watched or heard, not read (the insights hub, 23 Oct
   * 2026). A round chip in the cover's top-end corner; it does not zoom with the cover. Ignored
   * without a cover. Decorative: the title and eyebrow say what the piece is.
   */
  play?: boolean;
  /**
   * A vertical card with a cover that becomes a ROW below 768: its copy first, the cover as a
   * thumbnail at the row's end, and no standfirst. For the secondary cards of a listing's grid, so a
   * phone's single column is not a run of full-width pictures (beauty round 4, 16 Oct 2026); the
   * set's lead never takes it. Ignored when horizontal, without a cover, or with a cta.
   */
  compact?: boolean;
  /**
   * The horizontal card's two tracks, 64 apart: `even` (default) halves the row; `grid` gives the
   * cover two thirds and the copy one — the tracks of the 2 : 1 split under it, so the lead and its
   * grid share one set of verticals (the insights hub, 23 Oct 2026). Ignored when vertical or
   * without a cover.
   */
  split?: 'even' | 'grid';
};

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`BlockCard: ${message}`);
}

/** The record `Media` receives: the caller's, with the box's proportions where it had none. */
function mediaRecord(image: BlockCardImage): MediaImage {
  if (image.width && image.height) {
    return { ...image, width: image.width, height: image.height };
  }
  return { ...image, ...FILL_BOX, sources: undefined, placeholderSize: true };
}

/** Kinds a cover crop would damage: shown whole, centred, with air inside the ruled box. */
const CONTAINED_KINDS: ReadonlySet<string> = new Set(['illustration', 'cut-out']);

/** The play mark on a cover: outside the zoom, so it stays put while the cover leans in. */
const PlayMark = () => (
  <span className={styles.play} aria-hidden="true">
    <Icon name="chrome-play" />
  </span>
);

function ImageMedia({
  image,
  sizes,
  play = false,
}: {
  image: BlockCardImage;
  sizes: string;
  play?: boolean;
}) {
  /* An illustration or a cut-out is not cropped (cmp-feature, 6 Oct 2026): the cover crop took the
     label off the top of the drawing and the run button off the part. `contain` shows the whole
     object at the largest size that fits, and the box's inset gives it the air a lifted part needs
     — a cut-out cut at the frame edge reads as a bad capture. A photograph and a capture still
     cover-crop: a photograph is atmosphere, and a capture is supplied cropped to its region. */
  const contained = CONTAINED_KINDS.has(image.kind ?? 'capture');
  return (
    /* The card owns the ratio box and Media fills it: `fit="fill"` is a cover crop, anchored where
       Media anchors it, of a box the parent has already sized — which is what this wrapper is. One
       ratio for every card: 16:9, the site's standard (home round 3, 11 Oct 2026).

       The box also owns the EDGE, for every kind (29 Sep, ch05 amendment 5a). A card crops every
       asset mechanically to its own ratio, so the boundary is a cut the card made, not the
       object's: the box draws one hairline, and Media is told `edge="placement"` so a capture's
       own rule does not sit inside it as a second line. A cut-out keeps its panel and shadow.

       The inner span is what zooms. It scales inside the box, so the ruled edge never moves and
       the overflow is clipped at it; scaling the <img> itself would reach into Media's element.
       Lazy is Media's default: a card is never the page's LCP. */
    <span className={cx(styles.imageMedia, contained && styles.contained)}>
      <span className={styles.imageZoom}>
        <Media
          image={mediaRecord(image)}
          sizes={sizes}
          fit={contained ? 'contain' : 'fill'}
          edge="placement"
        />
      </span>
      {play ? <PlayMark /> : null}
    </span>
  );
}

/**
 * The texture cover: the same ruled box, the pixel grid through one recipe's field, and the card's
 * glyph set large in its foot-start corner (fix round 2: a 48 glyph centred in a 390 well read as a
 * placeholder, not a cover). The box is the Texture's positioned, isolated ancestor (`.textureCover`), so
 * the field fills exactly the box and sits beneath the glyph. Decoration, like every cover here.
 */
function TextureMedia({
  recipe = 0,
  icon,
}: {
  recipe?: BlockCardTextureRecipe;
  icon?: IconName;
}) {
  return (
    <span className={styles.imageMedia} aria-hidden="true">
      <span className={styles.imageZoom}>
        <span className={styles.textureCover}>
          <Texture>
            {TEXTURE_RECIPES[recipe].map((shape, i) => (
              <TextureShape key={i} {...shape} />
            ))}
          </Texture>
          {icon ? (
            <span className={styles.coverGlyph}>
              <Icon name={icon} size="xl" />
            </span>
          ) : null}
        </span>
      </span>
    </span>
  );
}

/**
 * The generated cover: a Sketch scene filling the ruled 16:9 box. The plate is the Sketch's own
 * (dot field, radius) and the drawing is 16:9 like the box, so nothing is cropped.
 */
function SketchMedia({
  name,
  play = false,
}: {
  name: ArticleSceneName | GlossarySceneName;
  play?: boolean;
}) {
  return (
    <span className={styles.imageMedia} aria-hidden="true">
      <span className={styles.imageZoom}>
        <Sketch name={name} />
      </span>
      {play ? <PlayMark /> : null}
    </span>
  );
}

/**
 * BlockCard — one borderless card, built to docs/specs/BlockCard.md.
 *
 * The root is always an <li>. A non-blank href changes the frame element and, on a card with no
 * cover, adds the cta: the linked shape has one native anchor and one focus stop, while the static
 * shape is complete without an empty action row. A covered linked card says it navigates by its
 * title, which goes blue as the cover zooms; a text-only one by the cta, under a title that stays
 * dark.
 *
 * Layout owns the block-axis groups, the horizontal orientation's two tracks and the cta's inline
 * row; this module contains no hand-written sibling arrangement. The card knows nothing about its
 * siblings: whether it is featured is the set's decision (`BlockCardSet`), which it expresses by
 * passing `orientation`.
 */
export function BlockCard({
  title,
  body,
  bodyHtml,
  eyebrow,
  media,
  titleAs: Title = 'h3',
  href,
  ctaLabel,
  orientation = 'vertical',
  imageSide = 'left',
  tracks = 2,
  size,
  icon,
  index,
  cue,
  frame = 'none',
  linkScope = 'card',
  ctaEmphasis = 'link',
  meta,
  play = false,
  compact = false,
  split = 'even',
  aside,
  tag,
}: BlockCardProps) {
  if (title.trim().length === 0) {
    warn('title is blank; rendering nothing.');
    return null;
  }

  const hasBodyHtml = bodyHtml !== undefined && bodyHtml.some((html) => html.trim().length > 0);
  if (hasBodyHtml && body !== undefined) {
    warn(`both body and bodyHtml for ${JSON.stringify(title)}; bodyHtml wins.`);
  }
  const hasBody = hasBodyHtml || (body !== undefined && body.trim().length > 0);
  if (!hasBodyHtml && body !== undefined && !hasBody)
    warn(`body is blank for ${JSON.stringify(title)}; omitting the paragraph.`);

  const hasEyebrow = eyebrow !== undefined && eyebrow.trim().length > 0;
  if (eyebrow !== undefined && !hasEyebrow) {
    warn(`eyebrow is blank for ${JSON.stringify(title)}; omitting the label.`);
  }

  const destination = href?.trim() ? href : undefined;

  const image = media?.type === 'image' ? media.image : undefined;
  const hasImage = image !== undefined && image.src.trim().length > 0;
  if (image !== undefined && !hasImage) {
    warn('image media received a blank src; omitting the media.');
  }

  const horizontal = orientation === 'horizontal';
  const step = size ?? (horizontal ? 'lg' : 'md');

  const imageNode = hasImage ? (
    <ImageMedia
      image={image}
      sizes={horizontal || tracks === 2 ? CARD_TWO_TRACKS : CARD_THREE_TRACKS}
      play={play}
    />
  ) : media?.type === 'texture' ? (
    /* The card's icon, if any, moves onto the texture: one head object, never two. */
    <TextureMedia recipe={media.recipe} icon={icon} />
  ) : media?.type === 'sketch' ? (
    <SketchMedia name={media.name} play={play} />
  ) : null;

  /* The icon heads a card with no cover; a cover wins, because a card has one head object. */
  const iconNode =
    icon !== undefined && !imageNode ? (
      <span className={styles.icon}>
        <Icon name={icon} />
      </span>
    ) : null;

  /* A text-only card — no cover and no icon — takes a hairline at its own top edge, the width of
     the card (visual-direction § 3.1, 6 Oct 2026). It stands in for the top edge an image would
     give; the set's 32 gutter breaks it between cards, so a row reads as three objects and not as
     a table. It is a row of the frame's Layout, so the 24 under it is that Layout's `block` seam —
     the image-to-copy distance, which is exactly the relationship it replaces. Decoration: hidden.
     A boxed card draws none: the box's own top edge is that edge, and a second hairline 24 under
     it would be a double rule. */
  const textOnly = !imageNode && !iconNode;
  const boxed = frame === 'box';
  const tiled = frame === 'tile';
  /* The panel is an uncovered card's own frame: a cover outranks it. Its icon, if any, leads its
     label line rather than heading the card on a row of its own. */
  const panel = frame === 'panel' && !imageNode && !horizontal;
  const ruleNode =
    textOnly && !boxed && !panel && !tiled ? (
      <span className={styles.textRule} aria-hidden="true" />
    ) : null;

  /* Which cue a linked card carries. The caller's, or the shape's default: a covered or icon card
     is title-cued, a text-only card carries the cta (every live route's shape). */
  const ctaScoped = destination !== undefined && linkScope === 'cta';
  const cueKind: BlockCardCue | undefined = destination
    ? ctaScoped
      ? 'cta'
      : (cue ?? (textOnly && !panel ? 'cta' : 'title'))
    : undefined;

  const download = cueKind === 'download';
  const label = ctaLabel?.trim() ? ctaLabel : download ? DOWNLOAD_LABEL : DEFAULT_CTA_LABEL;
  if (ctaLabel !== undefined && ctaLabel.trim().length === 0) {
    warn(`ctaLabel is blank for ${JSON.stringify(title)}; using ${JSON.stringify(label)}.`);
  }

  /* The cta is the shipped link Button, not a bespoke cue. Button owns the type, the case, the
     label-to-glyph seam, the trailing glyph's size, the three colour steps per surface and the
     underline wipe — so the card describes what the control IS and stops restating how it looks.

     `as="span"` is what keeps the single-anchor contract: the whole tile already navigates, so a
     nested <button> or <a> would be invalid markup and a second focus stop for one destination. A
     span still receives `.link` and `.live`, so it keeps the complete link treatment, and Button
     emits neither `type` nor `tabIndex` for a non-button tag, so it stays out of the tab order.

     A span is also never itself hovered, focused or pressed, which is what `data-btn-link-group`
     on the frame below answers: it hands the card's own states to the Button. Icon takes no size
     here because Button sizes the glyph it contains and ignores one that is passed.

     The Cluster is what keeps the cta at the copy's inline start. A grid item is blockified, so the
     Button's `inline-flex` would become `flex` and take the whole track, centring its label; a
     Cluster starts its items. No gap is stated because there is one child.

     The tone is primary: a text link is blue at rest, label and arrow (visual-direction § 4, owner
     6 Oct 2026 — blue is the recurring foreground accent; fdn-colour's neutral tone was reversed). */
  const metaParts = (typeof meta === 'string' ? [meta] : (meta ?? [])).filter(
    (part) => part.trim().length > 0,
  );
  const metaNode =
    metaParts.length > 1 ? (
      <Cluster colGap="text" rowGap="inline">
        {metaParts.map((part) => (
          <span key={part} className={styles.meta}>
            {part}
          </span>
        ))}
      </Cluster>
    ) : metaParts.length === 1 ? (
      <span className={styles.meta}>{metaParts[0]}</span>
    ) : null;
  /* The action row: the cta, with the format line a `block` after it on the same row when there is
     one, so "DOWNLOAD   PDF · 12 PAGES" reads as one statement about the file. */
  const ctaButton =
    cueKind === 'cta' || download ? (
      ctaScoped ? (
        /* The static frame's one anchor (G3b): a real link, in the tab order, so the body above it
           can hold links of its own. */
        <Button
          as="a"
          href={destination}
          emphasis={ctaEmphasis}
          tone="primary"
          icon={<Icon name={leavesSite(destination) ? 'arrow-right-up' : 'arrow-right'} />}
        >
          {label}
        </Button>
      ) : (
        <Button
          as="span"
          emphasis="link"
          tone="primary"
          icon={<Icon name={download ? 'download' : 'arrow-right'} />}
        >
          {label}
        </Button>
      )
    ) : null;
  const cta =
    ctaButton || metaNode ? (
      <Cluster colGap="block" rowGap="tight" align="center">
        {ctaButton}
        {metaNode}
      </Cluster>
    ) : null;

  const hasIndex = index !== undefined && Number.isFinite(index);
  const indexNode = hasIndex ? <span className={styles.index}>{indexLabel(index)}</span> : null;
  const eyebrowText = hasEyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null;
  /* The label line: an index, an eyebrow, or both on one line a `block` apart — a numeral and a
     category are two labels, and the 24 keeps them from reading as one string. */
  const eyebrowNode =
    indexNode && eyebrowText ? (
      <Cluster colGap="block" rowGap="tight" align="baseline">
        {indexNode}
        {eyebrowText}
      </Cluster>
    ) : (
      (indexNode ?? eyebrowText)
    );
  const hasAside = aside !== undefined && aside.trim().length > 0;
  const tagNode = tag?.trim() ? (
    <span className={styles.tag}>
      <Tag>{tag}</Tag>
    </span>
  ) : null;

  /* A title-cued card's title is its affordance (owner, 7 Oct 2026): no glyph after it — the blue
     arrow that stood here on nearly every card read as bulky — and on hover and focus it takes the
     accent ink while a cover leans in. The whole card is the one anchor, so the title needs no
     mark at rest to be the link; a card whose action is not obvious from its title takes the cta. */
  const cued = cueKind === 'title';
  const titleNode = <Title className={cx(styles.title, cued && styles.cued)}>{title}</Title>;
  const bodyNode = hasBodyHtml ? (
    /* Trusted HTML, one paragraph each (`bodyHtml`). The paragraphs are a Layout at `text`: the
       card's own paragraph step, so no margin and no Prose flow is needed, and the type role is the
       `.body` div's, inherited by every <p>. */
    <div className={styles.body}>
      <Layout rowGap="text">
        {bodyHtml.map((html, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </Layout>
    </div>
  ) : hasBody ? (
    <p className={styles.body}>{body}</p>
  ) : null;

  /* The copy: eyebrow, title and body as one group at `text` (16), then the cta a block (24) below
     it. 16 is one step under the section head's 24, so a card reads as a smaller unit of the same
     system (visual-direction § 1.1, S2). It was `tight` (8): three rows at one step have no
     hierarchy, and a 12px label 8px over a 28px serif read as cramped. */
  /* An icon card STACKS (owner, 9 Oct 2026): the glyph on its own row, then the title, then the
     body — never the glyph inline beside the title. The glyph is the card's head object, so it
     leads the head, above any eyebrow or index. Icon to its copy is `text` (16): the step the head
     group already uses between its rows, because the glyph is a row of the head sized from the
     title's role, not a label it decorates (`tight` would weld it to the title as a bullet). */
  /* The label line: the label at its start and, where there is one, the aside (a date) at its end,
     centred on each other. Absent an aside, the label alone, as every card had it. */
  const withAside = (node: ReactNode) =>
    hasAside ? (
      <Layout columns={{ base: [1, 'auto'] }} colGap="block" align="center">
        {node ?? <span />}
        <span className={styles.meta}>{aside}</span>
      </Layout>
    ) : (
      node
    );
  const labelLine = withAside(eyebrowNode);
  const head = (
    <>
      {iconNode}
      {labelLine}
      {titleNode}
    </>
  );
  /* The topic tag follows the copy, a block under it and over any cta, in every arrangement
     (owner, 28 Oct 2026: "go with the tag under the title"). */
  const content = (
    <Layout rowGap="block" className={styles.content}>
      <Layout rowGap="text">
        {head}
        {bodyNode}
      </Layout>
      {tagNode}
      {cta}
    </Layout>
  );

  /* Three arrangements, one anatomy. Every one is a Layout; none is the frame's own block flow.

     Horizontal with an image: two equal tracks, media and copy centred against each other, 64
     apart. Both seams are stated because Layout defaults neither: `columns={[1, 1]}` collapses to
     one track below md, and the rowGap is what the collapsed card uses in place of the column
     gutter. Below that boundary `imageSide` describes nothing, so DOM order decides and a
     right-side card reads copy-then-image on a phone.

     Horizontal without one: the same two tracks, with the COPY split across them — the head
     (eyebrow and title) in the first, the body and cta in the second, top-aligned so the title's
     first line and the body's sit on one line. The row reads as a head beside its body, the
     arrangement ContentSection uses a level up, rather than one text column with a void beside
     it. It collapses to the same order as a vertical card.

     Vertical: media above copy at `--gap-block`. The image is edge-to-edge and the copy is flush to
     it, so this rowGap IS the image-to-copy relationship. */
  let frameContent;
  if (horizontal && imageNode) {
    frameContent = (
      <Layout
        columns={split === 'grid' ? { md: imageSide === 'right' ? [1, 2] : [2, 1] } : [1, 1]}
        colGap="column"
        rowGap="block"
        align="center"
      >
        {imageSide === 'right' ? (
          <>
            {content}
            {imageNode}
          </>
        ) : (
          <>
            {imageNode}
            {content}
          </>
        )}
      </Layout>
    );
  } else if (horizontal) {
    frameContent = (
      <Layout rowGap="block">
        {ruleNode}
        <Layout columns={[1, 1]} colGap="column" rowGap="text" align="start">
          <Layout rowGap="text" className={styles.content}>
            {head}
          </Layout>
          <Layout rowGap="block" className={styles.content}>
            {bodyNode}
            {cta}
          </Layout>
        </Layout>
      </Layout>
    );
  } else if (panel) {
    /* The panel: the label at its head, the title and standfirst pinned to its foot, the plate's
       spare height between them. A cta, where one is asked for, closes the foot group. */
    frameContent = (
      <Layout rowGap="block" pinLast className={styles.grow}>
        {withAside(
          iconNode ? (
            <Cluster colGap="tight" align="center" nowrap>
              {iconNode}
              {eyebrowNode}
            </Cluster>
          ) : (
            eyebrowNode
          ),
        ) ?? <span />}
        <Layout rowGap="block" className={styles.content}>
          <Layout rowGap="text">
            {titleNode}
            {bodyNode}
          </Layout>
          {tagNode}
          {cta}
        </Layout>
      </Layout>
    );
  } else {
    if (cta) {
      /* An action row sits on the card's FOOT (§ 3.1 item 4, "pinLast for the CTA"; owner, 7 Oct
         2026: "a link button at its foot"). The stack is flattened so the cta is its own last row,
         and `pinLast` gives that row the spare height of a card stretched to its row's tallest, so
         every action in a row sits on one line — which a box's visible foot makes plain when it
         does not. The seams are the ones the nested stack had: `block` from the cover or rule to
         the copy, and from the copy to the cta. */
      frameContent = (
        <Layout rowGap="block" pinLast className={styles.grow}>
          {imageNode}
          {ruleNode}
          <Layout rowGap="text" className={styles.content}>
            {head}
            {bodyNode}
          </Layout>
          {cta}
        </Layout>
      );
    } else if (compact && imageNode) {
      /* One Layout, two arrangements: below md the cover takes the auto track at the row's END
         (reverse mirrors the template, so the weight travels with it); from md the stack. */
      frameContent = (
        <Layout
          columns={{ base: ['auto', 1], md: 1 }}
          reverse={{ base: true, md: false }}
          colGap="block"
          rowGap="block"
          align="start"
        >
          <span className={styles.compactCover}>{imageNode}</span>
          {content}
        </Layout>
      );
    } else {
      frameContent = (
        <Layout rowGap="block">
          {imageNode}
          {ruleNode}
          {content}
        </Layout>
      );
    }
  }

  return (
    <li
      className={cx(
        styles.root,
        SIZE_CLASS[step],
        horizontal && styles.horizontal,
        boxed && styles.boxed,
        tiled && styles.tiled,
        panel && styles.panel,
        compact && !horizontal && imageNode && !cta && styles.compact,
      )}
      /* A cover BESIDE its words takes a whole row of any grid it is set in (owner, 29 Oct 2026:
         never two horizontal media items side by side). Layout's published contract: the card says
         what it is, the container places it. */
      data-media-row={horizontal && imageNode ? true : undefined}
    >
      {destination && !ctaScoped ? (
        /* The attribute is Button's published contract, not a hook of this component's own: it
           declares that this anchor's hover, focus-visible and pressed states are the states of
           every link Button inside it. Without it the cta would sit at rest forever. Emitted only
           when there is a cta: a covered card contains no Button for it to address. */
        <a
          className={cx(styles.frame, styles.link)}
          href={destination}
          data-btn-link-group={ctaButton ? true : undefined}
        >
          {frameContent}
        </a>
      ) : (
        <div className={styles.frame}>{frameContent}</div>
      )}
    </li>
  );
}
