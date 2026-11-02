import type { CSSProperties } from 'react';

import { cx } from '@/lib/cx';

import styles from './Media.module.css';

/**
 * What the image IS — which decides its edge, and nothing else about it.
 *
 *   capture       a flat screenshot of a whole layout. Takes the placement's hairline in the
 *                 surface's rule ink, radius 0, no shadow — "its one edge cue is the hairline"
 *                 (ch05 §2). Full column only, and only where the layout is the subject.
 *   cut-out       product UI lifted out of its page onto our ground, alpha all round (ch05 §2a).
 *                 No edge: the silhouette is the frame. May carry one shadow, and sits on a
 *                 contrast panel when its own edge does not hold against the ground (B5).
 *   illustration  our own line-led drawing (ch05 §4a). Never boxed: no edge, no panel, no
 *                 shadow, in any placement (B4). Never placed on blue.
 *   photograph    team, studio and stock (ch05 §3). No edge, never masked, and the photograph
 *                 radius --media-photo-radius (8) on its own box (visual-direction § 5.3, fdn-media,
 *                 6 Oct 2026): the 29 Sep card-image radius extended to every photograph, so a page
 *                 never shows rounded card photos beside a square split photo. The only kind that
 *                 takes `ratio`.
 *
 * A kind is a CONTENT fact about the asset — it passes the Strapi test in strapi-changes.md §1
 * because it changes what the image is, not how one page wants it to look — so it arrives on
 * the record, never as a presentation prop a placement chooses.
 */
export type MediaKind = 'capture' | 'cut-out' | 'illustration' | 'photograph';

/**
 * The contrast panel behind a cut-out whose UI edge does not hold against the ground (ch05 §2a,
 * B5). One of three fixed brand grounds, chosen at supply for the ASSET (ruling M4) — code never
 * guesses it from the surface, because the surface does not know what colour the product's edge is.
 */
export type MediaPanel = 'paper' | 'paper-deep' | 'ink';

/**
 * A crop ratio a photograph may be cut to, inline over block. The closed set of § 5.4's placements:
 *
 *   4/5   B, K and L-photo, the media split         5/4   the photograph hero
 *   3/1   I banner below its head                    3/2   I banner beside, the head-track aside, a pair
 *   16/9  card sets of three or more                 4/3   the horizontal card
 *   1/1   portraits                                 4/1   the title-led hero's panorama (cmp-hero)
 *   2/1   the title-led hero's wide shape (default)
 *
 * A placement states one; Media does not choose. Each maps to a `--media-ratio-*` token.
 *
 * 16/9 and 4/3 are § 5.4's ratios for card sets and the horizontal card, kept because the set is
 * § 5.4's. No card passes them: a card's image is BlockCard's own 3/2 crop box under `fit="fill"`,
 * not a Media `ratio` (drift recorded in src/lib/photos.ts at CARD_RATIO and docs/specs/Media.md).
 */
export type MediaRatio =
  | '4/5'
  | '5/4'
  | '3/1'
  | '4/1'
  | '2/1'
  | '3/2'
  | '16/9'
  | '4/3'
  | '1/1';

/**
 * A ratio per arrangement: `base` below 1024 and `lg` from 1024 (Layout's `lg`, where every split in
 * the kit opens). For the placements whose CROP changes with the layout rather than only its width —
 * the media split and the offer are 4:5 beside their copy and 4:3 above or below it (visual-direction
 * § 3.7 item 4, `fdn-section-head`, 6 Oct 2026). A 4:5 photograph at a phone's full 326 column would
 * be 408 tall before a word of the copy; the 4:3 crop is 244.
 *
 * Two named breakpoints, both required, and no others: the ratio follows the ARRANGEMENT, and the
 * arrangements in this system change at 1024 and nowhere else. A bare `MediaRatio` is the same crop
 * at every width, as before.
 */
export type MediaRatioSpec = MediaRatio | { base: MediaRatio; lg: MediaRatio };

/**
 * A focal point, each axis 0 to 1 from the image's top-left: where a crop is anchored. It is an
 * object-position, so the point x% across the image sits x% across the box and the focus always
 * stays inside the crop; it is not centred unless it is at 0.5. A fact about the
 * ASSET (the catalogue's `focalPoint`), so it arrives on the record; a placement may override it on
 * the prop when its own crop needs a different anchor ("crop from the right", § 5.6).
 */
export type MediaFocus = { x: number; y: number };

/**
 * A photograph's measured tone (`npm run photos:tone`, visual-direction § 5.5). Media renders nothing
 * from it; it emits it as `data-photo-temp` / `data-photo-sat` so `fold:check` can count a page's
 * families and vivid photographs from the rendered DOM.
 */
export type MediaTone = {
  temperature: 'warm' | 'neutral' | 'cool';
  saturation: 'vivid' | 'quiet';
};

/** One derived width of the master, resized and never recomposed (ch05 §9). */
export type MediaSource = {
  src: string;
  /** The file's intrinsic pixel width — the `w` descriptor in the srcset. */
  width: number;
};

/**
 * The image asset — a record, not a size request.
 *
 * `src`, `width` and `height` are the MASTER: the one production file, supplied at 2560 (ruling
 * M2). They are the intrinsic pixel dimensions, and they are required together, so there is no
 * way to ship a `src` and discover a missing dimension at runtime; the two numbers are what let
 * the browser reserve the right block-size before the image arrives.
 *
 * `sources` are the derived widths Strapi generated from that master (its `formats`). Media reads
 * whatever widths arrive rather than knowing their names — the ladder is 2560 · 1240 · 652 · 320
 * today (M2), and a breakpoint change in Strapi changes nothing here.
 *
 * `kind`, `panel` and `shadow` are content fields that Strapi does not record yet
 * (strapi-changes.md entries 3 and 7). Until it does they arrive undefined, and an image with no
 * kind renders as a capture — today's hairline — so nothing on a live route changes look (M3).
 *
 * `alt` is required and must not restate a caption: it says what the image shows. An empty string
 * is the decorative convention (ch05 §7) and is legal; omitting it is not.
 */
export type MediaImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind?: MediaKind;
  /** Cut-outs only. Ignored, with a development warning, on any other kind. */
  panel?: MediaPanel;
  /** Cut-outs only: the one `--shadow-crop`. Ignored, with a development warning, elsewhere. */
  shadow?: boolean;
  sources?: readonly MediaSource[];
  /** Where a crop is anchored (`ratio`, or `fill`). Absent: the centre for `ratio`, the fill anchor for `fill`. */
  focus?: MediaFocus;
  /** Photographs only: the measured tone tags, emitted for the gate. */
  tone?: MediaTone;
  /**
   * True when this photograph stands in for a cover that does not exist yet (§ 5.7). Never shown to
   * a reader — a stand-in is not labelled on the page — but emitted as `data-stand-in` so a gate or
   * a reviewer can find every one before the real covers replace them.
   */
  standIn?: boolean;
  /**
   * True when `width` and `height` are NOT the master's pixels but a well-formed placeholder pair —
   * BlockCard gives a record that arrived without dimensions its box's own 3 × 2. Media then emits
   * no `data-src-w` / `data-src-h`, so the resolution gate (§ 5.4) never compares a crop against a
   * 3px "master". Absent means the numbers are real.
   */
  placeholderSize?: boolean;
};

/**
 * How the image meets its box.
 *
 *   intrinsic  100% of the parent's inline size, height from the asset's own ratio, never
 *              cropped (ruling H3, ch05 §9). Every full-column and track placement.
 *   fill       fills a box the PARENT has already given a ratio, with a cover crop anchored at
 *              --media-fill-position (inline start, 20% down). For the placements that crop
 *              mechanically — BlockCard, ListCard's thumbnail, the nav card — where the pattern
 *              owns the ratio and the asset is authored for it (ch05 B4, §9a).
 *   contain    fills the same parent-sized box, but the WHOLE asset shows, centred, at the largest
 *              size that fits (cmp-feature, 6 Oct 2026). For an object a crop would damage — an
 *              illustration's label, a cut-out's edge — in a placement that owns a ratio of its
 *              own (BlockCard's illustration and cut-out covers). The parent gives it its air.
 */
export type MediaFit = 'intrinsic' | 'fill' | 'contain';

/**
 * Who draws the image's edge.
 *
 *   kind       Media does, by kind: a capture its hairline, everything else none. Every placement
 *              that shows the asset as itself.
 *   placement  the crop box around it does, and Media draws none — not even a capture's hairline,
 *              which would otherwise sit inside the placement's rule as a second line. For a
 *              placement that crops every kind mechanically to a ratio of its own, where the edge
 *              is a cut the placement made rather than the object's own boundary (BlockCard, ch05
 *              amendment 5a). A cut-out's panel and shadow are unaffected: they are not edges.
 */
export type MediaEdge = 'kind' | 'placement';

/**
 * How far a cut-out sits inside its contrast panel — a gap-scale step, named for what it separates.
 *
 *   gutter  --gap-gutter (32), the container gutter. Every full-column, track and card placement.
 *   text    --gap-text (16), cell padding. For a SMALL box, where 32 of air on each side leaves no
 *           part to recognise: ListCard's 160 × 107 thumbnail kept 96 × 43 of part at `gutter`.
 *
 * The placement chooses it, because only the placement knows how big its box is — Media fills a
 * width it cannot see. It is a step, not a length: there is no way to pass a number, so a placement
 * cannot split the difference. Ignored when no panel renders (29 Sep 2026, tracker 2.17).
 */
export type MediaInset = 'gutter' | 'text';

/**
 * An art-directed alternative to the image: a DIFFERENT file shown where `media` matches, rendered
 * as a `<source>` in a `<picture>` around the `<img>`. For a recomposed asset rather than a smaller
 * one — an illustration's numbered cut below the width where its labels stay legible (PageHero).
 * Resolution switching is the record's `sources`; this is not that.
 *
 * `media` is a media query, owned by the placement because only it knows where its track narrows.
 * `width` and `height` are the alternative's intrinsic size, emitted on the `<source>` so the
 * browser reserves the right box when the alternative's ratio differs; omit them only when it
 * shares the image's ratio (the numbered cut shares the drawing's viewBox). The `<img>` stays the
 * fallback and carries the alt, the loading and the priority for whichever file the width picks.
 */
export type MediaArt = {
  media: string;
  src: string;
  width?: number;
  height?: number;
};

export type MediaProps = {
  image: MediaImage;
  /**
   * The rendered width of this placement, as a `sizes` media list. Required, because only the
   * placement knows it and a missing `sizes` makes the browser assume 100vw — which fetches the
   * 2560 master into a 160px thumbnail. Each pattern passes its own; docs/specs/Media.md §9 lists
   * the value for every placement, derived from Section's 1240 column and 32 gutter.
   */
  sizes: string;
  fit?: MediaFit;
  /** Who draws the edge. Defaults to `kind`; `placement` only inside a crop box that rules itself. */
  edge?: MediaEdge;
  /** The panel inset step. Defaults to `gutter`. Only a cut-out on a panel has an inset to set. */
  inset?: MediaInset;
  /**
   * Crop a PHOTOGRAPH to this ratio, in its own box: full width of the parent, height from the
   * ratio, a cover crop anchored at `focus`. For the placements where the image's box is Media's own
   * rather than a pattern's (§ 5.3: B, K, the banner, the aside, the hero photograph). Only a
   * photograph is ever cropped this way — a capture, a cut-out and an illustration render whole
   * (ruling H3), so on any other kind it is ignored with a development warning. Ignored under
   * `fit="fill"` too, where the parent already owns the ratio.
   *
   * `{ base, lg }` crops one way below 1024 and another from it — see `MediaRatioSpec`.
   */
  ratio?: MediaRatioSpec;
  /** Override the record's focal point for this placement only. */
  focus?: MediaFocus;
  /**
   * The page's LCP image: eager, and fetched ahead of the document's other images. One per page
   * at most, and only a hero's. Everything else is lazy and decodes off the main thread.
   */
  priority?: boolean;
  /**
   * Art direction: alternative files by media query, first match wins (see `MediaArt`). Absent or
   * empty, Media renders a bare `<img>`; present, the `<img>` is wrapped in a `<picture>`.
   */
  art?: readonly MediaArt[];
};

/**
 * The `srcset` for an image: every derived width plus the master, ascending, one entry per width.
 * `undefined` when there is nothing to choose between, so a single-file asset renders a plain
 * `src` and emits no `sizes` either.
 *
 * Exported because it is a pure function of the record and the specimen prints what it produced;
 * a preload link for a hero would want the same string.
 */
export function mediaSrcSet(image: MediaImage): string | undefined {
  const byWidth = new Map<number, string>();
  const add = (src: string, width: number) => {
    if (src && Number.isFinite(width) && width > 0) byWidth.set(Math.round(width), src);
  };
  for (const source of image.sources ?? []) add(source.src, source.width);
  /* The master last, so it wins a tie: if Strapi hands back a format as wide as the original,
     the original is the better file at that width. It passes the same check as a source, so a
     zero or fractional width can never write an invalid `w` descriptor. */
  add(image.src, image.width);
  if (byWidth.size < 2) return undefined;
  return [...byWidth.entries()]
    .sort(([a], [b]) => a - b)
    .map(([width, src]) => `${src} ${width}w`)
    .join(', ');
}

/**
 * `sizes` for a cover crop. A crop narrower than the asset is filled by HEIGHT, so the rendered
 * image is wider than its box by the asset's aspect over the crop's, and a `sizes` that states the
 * box makes the browser pick a rung that is then upscaled: a 3:2 master in the 572 × 458 hero box
 * renders 687 wide, a 16:9 one 814, and at 2x the 1240 rung was stretched to fill them (cmp-hero,
 * fix round 1). So every length in the placement's list is multiplied by that factor, the larger of
 * the two crops for a `{ base, lg }` spec. A crop wider than the asset fills by width: factor 1.
 */
const ratioNumber = (ratio: MediaRatio) => {
  const [w = 1, h = 1] = ratio.split('/').map(Number);
  return w / h;
};
function cropSizes(sizes: string, image: MediaImage, spec: MediaRatioSpec): string {
  const crops = typeof spec === 'string' ? [spec] : [spec.base, spec.lg];
  const aspect = image.width / image.height;
  const factor = Math.max(1, ...crops.map((crop) => aspect / ratioNumber(crop)));
  if (!Number.isFinite(factor) || factor <= 1.01) return sizes;
  const k = Math.round(factor * 1000) / 1000;
  return sizes
    .split(/,\s*(?![^()]*\))/)
    .map((entry) => {
      const match = /^(\([^)]*\)\s+)?(.+)$/.exec(entry.trim());
      if (!match) return entry;
      return `${match[1] ?? ''}calc(${match[2]} * ${k})`;
    })
    .join(', ');
}

/** One class per ratio; each reads its `--media-ratio-*` token. */
const RATIO_CLASS: Record<MediaRatio, string | undefined> = {
  '4/5': styles.ratio4x5,
  '5/4': styles.ratio5x4,
  '3/1': styles.ratio3x1,
  '4/1': styles.ratio4x1,
  '2/1': styles.ratio2x1,
  '3/2': styles.ratio3x2,
  '16/9': styles.ratio16x9,
  '4/3': styles.ratio4x3,
  '1/1': styles.ratio1x1,
};

/** The same ratios from 1024 up — the `lg` half of a `{ base, lg }` spec, in the module's one @media. */
const LG_RATIO_CLASS: Record<MediaRatio, string | undefined> = {
  '4/5': styles.lgRatio4x5,
  '5/4': styles.lgRatio5x4,
  '3/1': styles.lgRatio3x1,
  '4/1': styles.lgRatio4x1,
  '2/1': styles.lgRatio2x1,
  '3/2': styles.lgRatio3x2,
  '16/9': styles.lgRatio16x9,
  '4/3': styles.lgRatio4x3,
  '1/1': styles.lgRatio1x1,
};

/** The classes a ratio spec emits: the base crop, plus the lg crop where it differs. */
function ratioClasses(spec: MediaRatioSpec): (string | undefined)[] {
  if (typeof spec === 'string') return [RATIO_CLASS[spec]];
  return [RATIO_CLASS[spec.base], spec.lg !== spec.base ? LG_RATIO_CLASS[spec.lg] : undefined];
}

/** A 0–1 axis as a percentage, clamped: a CMS value of 1.2 must not push the crop off the image. */
const percent = (value: number) =>
  `${Math.round(Math.min(1, Math.max(0, value)) * 1000) / 10}%`;

const PANEL_CLASS: Record<MediaPanel, string | undefined> = {
  paper: styles.panelPaper,
  'paper-deep': styles.panelPaperDeep,
  ink: styles.panelInk,
};

/* Development-only, and deliberately a warning rather than a throw: a wrong field on a CMS record
   must not take a page down, and the rendering it falls back to is the brand-correct one. */
function warn(message: string, image: MediaImage) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`Media: ${message} (${image.src})`);
  }
}

/**
 * Media — one image asset in one placement, built to docs/specs/Media.md.
 *
 * Renders a native `<img>`, or — for a cut-out on a contrast panel — that `<img>` inside the panel.
 * It owns the delivery (srcset, sizes, loading) and the edge (by kind); the PLACEMENT owns
 * everything else. Width is always the parent's: intrinsic fills the parent's inline size, fill
 * fills the parent's box. There is no className, no style and no size prop, so no placement can
 * restyle an image's edge one call site at a time. The one geometry a placement may choose is the
 * panel inset, and only between two named steps (`inset`).
 *
 * It reads `data-surface` through the token layer only, like every other unit, so a capture's
 * hairline is right on paper, tint, ink and blue without being told which. It cannot see the
 * surface in JavaScript, so an illustration's palette for its ground is the asset's own business
 * (an illustration may sit on blue since 23 Oct 2026; decisions/2026-10-23-illustrations-may-sit-on-blue).
 */
export function Media({
  image,
  sizes,
  fit = 'intrinsic',
  edge = 'kind',
  inset = 'gutter',
  priority = false,
  ratio,
  focus,
  art,
}: MediaProps) {
  const kind: MediaKind = image.kind ?? 'capture';
  const isCutOut = kind === 'cut-out';
  const isPhotograph = kind === 'photograph';
  const article = kind === 'illustration' ? 'an' : 'a';

  if (ratio && !isPhotograph) {
    warn(
      `${article} ${kind} is never cropped to a ratio — only a photograph is (H3). Ignored`,
      image,
    );
  }
  const boxed = fit === 'fill' || fit === 'contain';
  if (ratio && isPhotograph && boxed) {
    warn(`\`ratio\` with \`fit="${fit}"\`: the parent already owns the ratio. Ignored`, image);
  }
  const cropRatio = isPhotograph && !boxed ? ratio : undefined;

  if (!isCutOut && image.panel) {
    warn(
      `${article} ${kind} takes no panel — only a cut-out does (ch05 §2a, B4). Ignored`,
      image,
    );
  }
  if (!isCutOut && image.shadow) {
    warn(
      `${article} ${kind} takes no shadow — only a cut-out does (ch05 §2, B2). Ignored`,
      image,
    );
  }

  const panel = isCutOut ? image.panel : undefined;
  const shadow = isCutOut && image.shadow === true;
  const srcSet = mediaSrcSet(image);
  const measured = isPhotograph && image.placeholderSize !== true;

  /* The focal point, as the one custom property the crop reads. On the style prop because a class
     cannot express a per-asset value (ClientMark's precedent); absent, the stylesheet's anchor
     stands — the centre for a ratio crop, --media-fill-position for a fill. A `contain` placement
     reads only a `focus` passed for it, never the record's crop point. */
  const anchor = focus ?? image.focus;
  const style =
    anchor && (cropRatio || fit === 'fill' || (fit === 'contain' && focus))
      ? ({ '--media-focus': `${percent(anchor.x)} ${percent(anchor.y)}` } as CSSProperties)
      : undefined;

  const bare = (
    /* A native image rather than next/image: ruling M1 serves Strapi's own formats as a native
       srcset, with no build-time pipeline, and next/image would add one. */
    /* eslint-disable-next-line @next/next/no-img-element -- the ruled native-srcset contract (M1) */
    <img
      className={cx(
        styles.image,
        fit === 'fill'
          ? styles.fill
          : fit === 'contain'
            ? styles.contain
            : cropRatio
              ? styles.crop
              : styles.intrinsic,
        ...(cropRatio ? ratioClasses(cropRatio) : []),
        /* A placement that rules its own crop box rounds and clips it; the image draws no corner of
           its own, or its 8 sits inside the box's (8 less the hairline) and shows ground at each
           corner (owner, 2 Nov 2026). */
        edge === 'placement' && styles.placed,
        edge === 'kind' && kind === 'capture' && styles.capture,
        edge === 'kind' && isPhotograph && styles.photograph,
        /* The tone layer (review 7 Oct 2026): every photograph, whatever its edge, so one grade
           reaches the whole page. Not keyed to `edge` — a placement that draws its own box still
           shows the same photograph. Renders nothing until --media-photo-grade is set. */
        isPhotograph && styles.grade,
        shadow && styles.shadow,
      )}
      style={style}
      src={image.src}
      srcSet={srcSet}
      sizes={srcSet ? (cropRatio ? cropSizes(sizes, image, cropRatio) : sizes) : undefined}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? undefined : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      /* What the gates read off the rendered page (visual-direction § 5.4, § 5.5): the master's
         pixels, to compare the crop against the box the image actually got, and the measured tone.
         Photographs only — the resolution and tone rules are about photographs — and the pixels
         only when they are real: a record flagged `placeholderSize` (a BlockCard cover that arrived
         without dimensions) reports none rather than its 3 × 2 box. */
      data-src-w={measured ? image.width : undefined}
      data-src-h={measured ? image.height : undefined}
      data-photo-temp={isPhotograph ? image.tone?.temperature : undefined}
      data-photo-sat={isPhotograph ? image.tone?.saturation : undefined}
      data-stand-in={image.standIn ? '' : undefined}
    />
  );

  /* Art direction: the same <img>, inside a <picture> whose <source>s the browser tries first. The
     img stays the one element that carries alt, loading and fetchpriority, so only the file the
     width selects is fetched, and only it is high priority. */
  const img =
    art && art.length > 0 ? (
      <picture className={cx(styles.picture, boxed && styles.pictureFill)}>
        {art.map((alt) => (
          <source
            key={`${alt.media} ${alt.src}`}
            media={alt.media}
            srcSet={alt.src}
            width={alt.width}
            height={alt.height}
          />
        ))}
        {bare}
      </picture>
    ) : (
      bare
    );

  if (!panel) return img;

  /* A span rather than a div so Media stays legal inside phrasing content — a card's link, a
     caption-adjacent slot — wherever a bare <img> would be. It is display:block in the module. */
  return (
    <span
      className={cx(
        styles.panel,
        inset === 'text' && styles.insetText,
        boxed && styles.panelFill,
        PANEL_CLASS[panel],
      )}
    >
      {img}
    </span>
  );
}
