/**
 * TIER 1 — primitives.
 *
 * Structural building blocks that know nothing about content, routes or the CMS. A primitive
 * takes props and renders; it never reaches upward. Enforced by the tier rule in
 * eslint.config.mjs.
 *
 * Section owns the band and the content column. Layout owns the columnar axis. Cluster owns
 * the inline axis. Between them they express every arrangement, and nothing else in the repo
 * should be doing layout by hand.
 *
 * Button, Icon and Input are CONTROLS in the tier — they arrange nothing above themselves, they
 * are things a layout arranges. Input owns only the native control box; labels and messages stay
 * with the pattern composing it. A row of controls belongs in a Cluster, which owns the gap.
 *
 * Tag is a MARK OF A SECOND KIND, and the pair is worth reading together. Logo is one
 * distinguished object with its own proportions; Tag is one of a row of siblings, sized to the
 * text around it. It ships two variants that share a box and invert their enclosure — an inert
 * taxonomy label with a ground and no edge, and a filter chip with an edge and no ground — so a
 * reader meets the same object whether it can be operated or not. Like Button it takes its one
 * glyph as a ReactNode rather than importing Icon, and like Button it owns no distance outside its
 * own box: the row is a Cluster's.
 *
 * Logo is a third kind: a MARK. Not an Icon, and the line between them is no longer fill versus
 * stroke now that the glyph set is solid too — it is PROPORTION and OWNERSHIP OF COLOUR. An icon
 * is drawn on the system's own 24-unit box and takes currentColor entirely; the wordmark has its
 * own aspect ratio (675×177) and paints itself from its own tokens (--logo-ink, --logo-bar)
 * rather than inheriting, because ch02 names its colour per ground. Neither of those survives being filed as a glyph.
 *
 * Prose is neither. It is the rich-text flow — the one component that styles markup it did not
 * write, because a CMS body field arrives as a string. It is the documented exception to the
 * no-margins rule, and the exception is argued in the component itself.
 *
 * Media is the one ASSET RENDERER. It places a raster or vector image in whatever box its parent
 * gives it — its own intrinsic ratio, or a ratio the parent owns — and decides only the two things
 * every image slot must get the same: responsive delivery (a native srcset from Strapi's formats,
 * and the `sizes` the placement states) and the brand's edge by kind (capture hairline, cut-out
 * silhouette and panel, illustration never boxed). It arranges nothing and takes no caption; a
 * caption is Figure's.
 *
 * ClientMark is a FOURTH kind of mark: a client's logo in a set. Unlike Logo it owns no artwork —
 * the client's SVG arrives as a URL and is drawn as a mask in --cmark-ink, so every mark in a set is
 * one colour, the ground's ink — and unlike every other primitive it sizes by AREA, not by height
 * or width, so marks of very different shapes carry equal weight. A logo strip is not a component:
 * it is ClientMark × n in a Cluster, which owns the gap.
 *
 * Texture is DECORATION. It arranges nothing and says nothing: a bleed layer that fills the band
 * and shows the pixel grid through shapes the caller places and blurs. Its geometry is read from
 * src/styles/textures/, the same spec the asset exporter reads.
 */
export {
  Section,
  type SectionProps,
  type SectionSurface,
  type SectionDensity,
} from './Section';
export { Layout, type LayoutProps } from './Layout';
/* Island is a SURFACE inside a band: one bounded ground, set per instance, with the band's own ground
   around it — CtaSection's and Statement's `island` variant (13 Oct 2026). Like Section it declares
   data-surface, so everything inside resolves the island's tokens; unlike Section it keeps the page
   gutter and owns no column. */
export {
  Island,
  ISLAND_BAND,
  islandSurfaceOn,
  type IslandProps,
  type IslandSurface,
} from './Island';
export { Cluster, type ClusterProps } from './Cluster';
export {
  Button,
  type ButtonProps,
  type ButtonEmphasis,
  type ButtonTone,
  type ButtonSize,
} from './Button';
export {
  Icon,
  hasCounter,
  iconNames,
  type IconProps,
  type IconName,
  type IconSize,
} from './Icon';
export { Input, type InputProps } from './Input';
/* Chip is a CONTROL like Input: one choice in a set, a real checkbox or radio drawn as a pill
   (19 Oct 2026). Like Button it takes its glyph (the tick) as a ReactNode; the question a set of
   chips answers is the pattern's fieldset, and the row is a Cluster's. */
export { Chip, type ChipProps } from './Chip';
export { Logo, type LogoProps, type LogoSize, type LogoVariant } from './Logo';
export { Prose, type ProseProps } from './Prose';
export {
  Media,
  mediaSrcSet,
  type MediaEdge,
  type MediaFit,
  type MediaFocus,
  type MediaImage,
  type MediaInset,
  type MediaKind,
  type MediaPanel,
  type MediaProps,
  type MediaRatio,
  type MediaRatioSpec,
  type MediaSource,
  type MediaTone,
} from './Media';
export { Clip, type ClipProps, type ClipRendition, type ClipSource } from './Clip';
export { Tag, type TagProps, type TagVariant } from './Tag';
export { Sketch, type SketchName, type SketchProps } from './Sketch';
export {
  SituationFigure,
  isSituationFigureName,
  type SituationFigureName,
  type SituationFigureProps,
} from './SituationFigure';
export {
  Texture,
  TextureClosing,
  TextureCorner,
  TextureCounterweight,
  TextureHorizon,
  TextureFlow,
  TextureFrame,
  TextureShape,
  type TextureClosingProps,
  type TextureClosingSide,
  type TextureCornerAt,
  type TextureCornerProps,
  type TextureFlowProps,
  type TextureLength,
  type TextureProps,
  type TextureShapeProps,
} from './Texture';
export { ClientMark, type ClientMarkProps } from './ClientMark';

/* BrandMark is a THIRD-PARTY mark (LinkedIn, YouTube, Clutch) at its owner's proportions, monochrome
   on currentColor — moved up from SiteFooter on 1 Oct 2026 when a second consumer needed it.
   RatingBadge is a score and its source as one outline pill; it takes the mark as a node. */
/* Arena is the home hero's animated drawing (owner, 2 Nov 2026): one SVG fetched after paint and
   run on its own timeline, paused out of view and under reduced motion. Its control glyphs are
   passed in. */
export { Arena, type ArenaProps } from './Arena';

export { BrandMark, type BrandMarkName } from './BrandMark';
export { RatingBadge, type RatingBadgeProps } from './RatingBadge';

/* Stat is one figure, its unit and what it counts — the S band's numerals and the D band's stat
   aside (cmp-process-stats, 6 Oct 2026). */
export { Stat, type StatAlign, type StatElement, type StatProps, type StatSize } from './Stat';

/* StarRating is one review's score as five stars, a mark like Stat's numeral; it takes the star glyph
   as a node (home round 2, 10 Oct 2026). Never an aggregate platform score: that is RatingBadge. */
export { StarRating, type StarRatingProps, type StarRatingSize } from './StarRating';
