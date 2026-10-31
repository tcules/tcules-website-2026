import type { ReactNode } from 'react';

import {
  BrandMark,
  Button,
  Cluster,
  Icon,
  Layout,
  Media,
  RatingBadge,
  Section,
  Stat,
  Tag,
  Texture,
  TextureShape,
  type MediaImage,
  type BrandMarkName,
  type MediaRatioSpec,
  type SectionSurface,
} from '@/components';
import { cx } from '@/lib/cx';
import { initialsOf, PORTRAIT_FOCUS } from '@/lib/initials';
import {
  FULL_COLUMN,
  HERO_BESIDE,
  HERO_BESIDE_DRAWING,
  HERO_CENTRED,
  HERO_WIDE,
} from '@/lib/image-sizes';
import { repeatsTrail, sameLabel, type HeroTrail } from '@/lib/trail';

import styles from './PageHero.module.css';

/**
 * Who made the thing, in the four kinds the corpus has. The role is the token that selects a
 * LABEL — it is not a string the caller writes — which is what stops one route saying "Author"
 * and another "Written by" for the same fact.
 *
 * `reviewer` is null on all 15 of the long-read pages today. It stays a role inside `credits`
 * rather than becoming its own prop, so an absent reviewer is an absent group: no <dt>, no label
 * and no space. A separate `reviewer?: string[]` would be a "Reviewed by" hole waiting for the
 * day somebody writes `reviewer={[]}` instead of omitting it, and this way the empty case cannot
 * be expressed at all.
 */
export type HeroCreditRole = 'author' | 'host' | 'guest' | 'reviewer';

/**
 * One credited person. `href` is their page (an author page, from `@/lib/routes`); absent, the name
 * is plain text. `portrait` is their photograph, cropped round at 32; a person without one shows
 * their initials in an outlined disc when anyone else in the same group has a portrait, so a
 * group's faces never stop half way. What they DO is not here: the byline carries faces and names
 * only, and who each person is belongs to the page's end (owner, 30 Oct 2026: byline board G).
 */
export type HeroPerson = { name: string; href?: string; portrait?: MediaImage };

/**
 * One credit group — one label, one or more people, one <dd>.
 *
 * `people` is a non-empty tuple, so `{ role: 'guest', people: [] }` does not compile. That
 * matters: it would have rendered a "With" label above nothing.
 *
 * One group per role rather than one per person is what keeps the label from being repeated
 * three times for a podcast with three guests — the portraits overlap and the names are joined
 * into a single value.
 */
export type HeroCredit = {
  role: HeroCreditRole;
  people: readonly [HeroPerson, ...HeroPerson[]];
};

/**
 * The dates, as ISO strings. `published` is required, so a modified-only date cannot be
 * expressed; `modified` renders only when it is present AND differs from `published`, because
 * two identical dates under two different labels is a fact about the CMS, not about the page.
 */
export type HeroDates =
  | { published: string; modified?: string }
  /* A page that states only when it was last updated ("Last updated on 7 Oct ’26") — the corpus's
     new articles carry no published date, and inventing one would be a false fact. */
  | { published?: undefined; modified: string };

/**
 * One fact about the subject, as a labelled pair in the byline strip ("Company" → "Benchmark
 * Gensuite"). Set like the dates: a mono key over its value (owner, 11 Oct 2026).
 */
export type HeroFact = { id: string; label: string; value: string };

/** One action. `href` comes from `@/lib/routes` at the call site, never written out there. */
export type HeroAction = { label: string; href: string };

/**
 * A still image in the hero: the image RECORD, nested rather than spread.
 *
 * Nested because the record has a `kind` of its own — capture, cut-out, illustration, photograph —
 * and this union needs a discriminant too. Spread into one object, the two would share a name and
 * one would overwrite the other (docs/specs/Media.md § 17 Q7), so the union discriminates on `type`
 * and the record keeps `kind` untouched, exactly as a page received it from `@/content`.
 *
 * The record is `Media`'s own `MediaImage` — master `src`, intrinsic `width` and `height`, `alt`,
 * the derived `sources`, and the kind that decides its edge. PageHero adds nothing to it and reads
 * nothing out of it: the edge, the srcset and the loading are `Media`'s, and the width is the
 * arrangement's. Supply the master at 2560 (ruling M2); a narrower asset upscales in the full
 * column, and the fix belongs to the asset.
 *
 * `alt` describes what the image SHOWS and must not restate the title or the lead. An illustration
 * cover or banner takes `alt=""` (ch05 § 9a): the h1 already names what it stands for.
 */
export type HeroImageShape = 'panorama' | 'wide' | 'tall';

const HERO_SHAPE_RATIO: Record<HeroImageShape, MediaRatioSpec> = {
  panorama: { base: '3/2', lg: '4/1' },
  wide: { base: '3/2', lg: '2/1' },
  tall: { base: '3/2', lg: '16/9' },
};

export type HeroImage = {
  type: 'image';
  image: MediaImage;
  /**
   * A PHOTOGRAPH's crop, from Media's closed set. The photograph hero takes `'5/4'`: 572 × 458 in
   * the [1, 1] split at 1470, so its height meets the copy's (visual-direction § 2.5), anchored at
   * the record's own `focus` (`getKitPhoto` supplies it). Media ignores a ratio on any other kind,
   * with a development warning: an illustration and a capture render whole (H3).
   */
  ratio?: MediaRatioSpec;
  /**
   * The `display` arrangement's photograph shape (owner, 7 Oct 2026), from 1024; below it every
   * shape is 3:2. `panorama` 4:1 (a strip: landscapes and interiors, never a group of people),
   * `wide` 2:1 (the default), `tall` 16:9. Named rather than a free ratio so a hero picks a shape
   * the kit has judged, not the asset's accidental one. An explicit `ratio` wins over it.
   */
  shape?: HeroImageShape;
  /**
   * An ILLUSTRATION's numbered cut: the same drawing with its labels replaced by numbered markers
   * (`src`, same viewBox as the drawing), and the labels in marker order (`items`), which PageHero
   * sets as a legend under the cut. Below 1440 the drawing's track is narrower than 572 and its
   * labels would set under 9px, so the cut and its legend replace it there. The CALLER supplies it
   * (the generated `ILLUSTRATION_LEGENDS` in `src/lib/illustration-legends.ts`, keyed by the
   * drawing's src); PageHero renders only what it is handed and looks nothing up. Absent, or on any
   * other kind, the image renders alone.
   */
  cut?: HeroCut;
};

/** One label of an illustration's numbered cut. `tone` is its colour in the drawing: `accent` the
 *  peridot pill, `blue` a blue label. */
export type HeroCutItem = { label: string; tone: 'accent' | 'blue' };

/** An illustration's numbered cut and its legend — see `HeroImage.cut`. */
export type HeroCut = { src: string; items: readonly HeroCutItem[] };

/**
 * A YouTube video in the hero, as an id and a title rather than a URL or an embed snippet.
 *
 * `id` is the eleven-character video id — `dQw4w9WgXcQ` — never a watch URL, never a share link
 * and never an `<iframe>`. The component builds the src, which is what keeps every hero on the
 * same host (youtube-nocookie.com), the same parameters and the same referrer policy; a caller
 * passing a URL would be a caller who could pass any URL, and a caller passing markup would be
 * an injection point in the opening block of 129 pages. The id is interpolated into the path, so a
 * value containing `?` or `/` reaches YouTube as a malformed path and renders an unavailable frame
 * — it cannot reach another host, which is the property that matters.
 *
 * `title` is required, because it is the accessible name of the frame and the only thing a
 * screen-reader user gets before entering someone else's document. "YouTube video player" is
 * what the embed snippet ships and it names nothing — say what the video is.
 */
export type HeroVideo = {
  type: 'youtube';
  id: string;
  title: string;
};

/**
 * The media slot — an image or a YouTube embed, never both and never two.
 *
 * A discriminated union rather than two optional props, so `image` and `video` set together is not
 * a case anyone has to decide what to do about: it does not compile. And a union rather than a
 * `ReactNode` slot, which is the other shape this could have taken — the sideways idiom this repo
 * uses everywhere else. It is refused here for one reason: a ReactNode would put the 16/9 box, the
 * hairline, the `sizes` for the arrangement, the LCP priority and the embed's host and parameters
 * at the CALL SITE, on 129 routes, in a tier whose whole job is composition. The two renderings
 * are a closed set and the component owns them.
 */
export type HeroMedia = HeroImage | HeroVideo;

/**
 * The page's ancestor trail, inside the hero's band (kit `fdn-top`, 5 Oct 2026):
 * `{ crumbs: ReactNode; labels: readonly string[]; structural?: number }`, declared in `@/lib/trail`
 * and re-exported here.
 *
 * `crumbs` is a slot: the rendered `<Breadcrumbs …/>`. A slot rather than the items, because a
 * pattern does not import a pattern — the caller composes, and PageHero only places what it is
 * handed, 32 above the split.
 *
 * `labels` are the rendered crumbs' labels, beside the slot because a ReactNode cannot be read.
 * They are used for one thing: in development PageHero warns when the eyebrow or the title says
 * the same words as a crumb. `structural` is how many of them, from the start, are the site's
 * structure (Home and a section index from `SECTION_INDEXES`), which the eyebrow repeats only by
 * equalling. None is written by hand — `heroTrail(items, title, render)` builds all three from one
 * array, and drops a last crumb that repeats the title before any is made.
 */
export type { HeroTrail };

/**
 * Where the media sits against the copy. A PRESENTATION choice, made by the page-type template per
 * family, in code (ruling H1) — never a CMS field, because it says nothing about the content.
 *
 *   stacked  one column: the copy, then the media below it as a full-column block. The default,
 *            and the only arrangement a hero with no media has. This IS the "below" of ruling H1:
 *            media below the copy is today's single column with the media slot filled, so it has
 *            one name rather than two (spec § 4).
 *   beside   from 1024 up, the copy and the media in two equal tracks (text 1 : media 1, ruling H2),
 *            96 apart (`section`: a split, not peer halves), the media at its own ratio inside its
 *            track (H3). An illustration is centred on the copy; any other image is top-aligned.
 *            Below 1024 it stacks — copy, then media — and renders exactly as `stacked`.
 *   centred  the trail, title, lead and actions centred on the column, then the media below,
 *            capped at --hero-media-size-centred (860, about 8 of 12 columns) so a drawing keeps the
 *            split's scale. The owner comparison for the service hero (§ 2.3 option, § 10 item 2):
 *            it cannot end above the fold, so it is a specimen until the owner picks it over H2.
 *   wide     the photograph LEADS (fix round 2): [1, 1] from 1024 and copy 2 : media 3 from 1440,
 *            a 3:2 photograph at 686 × 457 beside a 458 copy column. The photograph family's second
 *            idea, so a home hero and a studio hero are not the same rectangle at a squint.
 *   display  title-led: the eyebrow, title and lead in 3 of 5 from 1024 and the ask in the other 2
 *            on the lead's last baseline (the Quantum split header), then the media at the full
 *            column below, in a named `shape` (panorama 4:1, wide 2:1 by default, tall 16:9).
 *
 *   masthead a LISTING's opening (beauty round 4, 16 Oct 2026, the insights hub and its format pages,
 *            after claude.com/resources): the title alone in 2 of 3 from 1024 (its measure, so a
 *            long title keeps the lines it has stacked), the lede and its figures (`stats`) in the third, set on the title's LAST BASELINE — so the band's end half,
 *            where the texture runs, carries the words that frame it instead of empty paper, and the
 *            band is a title's height rather than a title plus a lede: the list under it starts
 *            inside the first screen. No media and no ask (a listing's ask is its list). Below 1024
 *            it stacks and renders exactly as `stacked`.
 *
 * `beside` with no media renders `stacked`: there is nothing to put beside the copy, and a
 * template that sets `beside` for a family must still render the member that has no image. That is
 * the no-visual state, which is the common one, and it is not an error.
 */
export type HeroArrangement =
  'stacked' | 'beside' | 'wide' | 'centred' | 'display' | 'masthead';

/**
 * One line above the hero, for a launch or an opening (showcase pages only, visual-direction § 2.5).
 * A blue pixel and a blue mono `label`, a sentence and one link — never a second ask: the link is
 * link-style, the band's one solid stays the hero's. One line where it fits; on a phone the sentence
 * wraps beside the label and the link drops below it, never ellipsised (fix round 2). It costs one
 * row and a 48 seam, which § 2.5 budgets at +74.
 */
export type HeroAnnouncement = { label: string; text: string; action: HeroAction };

/**
 * A third-party score, set in the eyebrow's place (r7-hero, owner 7 Oct 2026, after doodle.com): the
 * one line above the title that can never repeat a crumb, because it is a claim with a source rather
 * than a name. Rendered as a RatingBadge — the one score component — so the hero and the footer
 * cannot disagree about how a rating reads.
 *
 *   frame  `pill` (default) — the outline pill; the quiet object over a long title or a drawing.
 *          `plain` — no outline, a line of mono type in the eyebrow's own voice with the blue star;
 *          the doodle.com shape, for a photograph hero, where a second outline above the solid ask
 *          would read as a control.
 *   mark   the platform's mark, by name. PageHero composes the BrandMark, so a template passes data.
 *   showScore, scale  as RatingBadge's; there is no large numeral beside it here, so the default
 *          prints the score.
 *
 * One platform, not a strip: the corpus has one rating source, and two pills over a title is a
 * logo strip in the wrong band (ratings beside the client list are r7-facts' job).
 */
export type HeroRating = {
  score: string;
  platform: string;
  href: string;
  mark?: BrandMarkName;
  scale?: string;
  frame?: 'pill' | 'plain';
};

/**
 * The line above the title holds ONE thing: a category (`eyebrow`) or a score (`rating`). Typed as a
 * union so both cannot be passed — a score beside a category is two labels competing for 12px, and
 * the score is the one that can never echo the trail.
 */
type HeroEyebrowProps =
  { eyebrow?: string; rating?: never } | { rating?: HeroRating; eyebrow?: never };

type PageHeroBaseProps = {
  /** The band's archetype for `fold:check` (§ 1.3) — `A` — passed to Section's `data-band`. */
  'data-band'?: string;
  /** Marks this hero for `fold:check`'s hero rule (it + the nav end inside the first screen). */
  'data-fold-hero'?: '';
  /**
   * The page's one `h1`, rendered verbatim.
   *
   * A `string` and not a `ReactNode`, and that typing is the enforcement mechanism for the
   * one-h1-per-page constraint rather than a convenience: `title={<span>…</span>}` does not
   * compile, so a second heading cannot be smuggled through this prop six months from now.
   *
   * An empty string renders an empty `<h1>` anyway. There is no fallback copy — no "Untitled",
   * no em dash — because a fallback is how a content fault ships, and the empty element is what
   * makes the fault findable in an audit.
   */
  title: string;
  /**
   * The title's scale. `display` (default) is every hero's. `mark` is for a title that is ONE WORD —
   * a format page's "Articles" (beauty round 3, 16 Oct 2026): the word set at twice display's size
   * so it becomes the band's graphic, and the texture drawn in against it rather than in a separate
   * gutter. Never for a sentence: a mark title is meant to stand on one line.
   */
  titleSize?: 'display' | 'mark';
  /**
   * `beside` only: the eyebrow and title read ACROSS the column above the split, at their own
   * measure, and the lead, actions and figures sit in the copy track beside the media. For a title
   * too long for half the column at display (review 29 Oct: /services set seven display lines in
   * the 572 track and its hero ran 1262 tall). The title keeps display (owner, 29 Sep 2026). Ignored
   * by every other arrangement.
   */
  titleAcross?: boolean;
  /**
   * The paragraphs, in order. Optional (cmp-feature, 6 Oct 2026): an index page whose h1 is the
   * whole opening — the case-study index — has none, and passed `['']` to satisfy the type, a
   * workaround the filter below made render nothing. Absent and all-blank now mean the same thing.
   *
   * `body[0]` renders as the lead at --text-lead-lg (18) and `body[1…]` as body copy at --text-body
   * (16). That split gives the copy an internal hierarchy which scales from one paragraph to six
   * without a prop and without a count-driven rule the caller cannot see.
   *
   * The paragraphs were 18 and are now 16, which is the same role the page's Prose body takes: the
   * hero's copy MEETS body scale rather than sitting a step above it, and the whole of the band's
   * internal hierarchy is now carried by the lead, 18 against 16.
   *
   * Empty strings are dropped before the roles are assigned, so a blank entry produces no <p>
   * and no seam around nothing. Depth beyond six is not capped and not warned about — beyond
   * six the content belongs in the page body, and that is a review comment on a route rather
   * than a behaviour in a component.
   */
  body?: readonly [string, ...string[]];
  /**
   * A category or format the trail cannot say (`Fintech · Platform rebuild`, `Ep 12 · 48 min`,
   * `Case study · Fintech`). Never a crumb's words: a name the trail says ("Product Design
   * specialist" under "… / Product design"), or a section crumb on its own (`Case study` under
   * Home / Case studies is the crumb read twice; `Case study · Fintech` adds what it cannot).
   *
   * That rule leads for the design agent's `.prompt.md`. Since the trail moved inside the hero
   * (kit `fdn-top`, 5 Oct 2026), an eyebrow that repeats a crumb stands 32px under the trail that
   * already said it; PageHero warns in development when it says a named crumb as a whole-word
   * phrase ("Product Design specialist" under "Product design") or equals a structural one
   * ("Services"), by the same comparison `eyebrowBesideTrail` uses (`repeatsTrail`, `@/lib/trail`).
   * Uppercased by the stylesheet, not by the data, so the frontmatter keeps its authored casing.
   *
   * NOT RENDERED when `trail` is set (owner, 11 Oct 2026): the breadcrumb already says where the
   * page is, so a hero with a trail has nothing above its title but the trail. The prop stays for
   * the trail-less hero (home) and for data that carries one; PageHero drops it, not the caller.
   *
   * A slot, not a variant: absent renders no element and no seam, which is why there is no
   * `variant="caseStudy"` selecting it. It sits 24px above the title rather than 8, because 8
   * under a 12px label reads as a caption stuck to the title and 24 reads as a label above one.
   */
  eyebrow?: string;
  /** A score in the eyebrow's place. See `HeroRating`. */
  rating?: HeroRating;
  /**
   * The ancestor trail, built by `heroTrail(items, title, (t) => <Breadcrumbs {...t} />)`. Sits 32
   * above the split.
   *
   * Inside the hero's band rather than in a band of its own, so the hero's 96 of top padding is
   * the air above the trail and nothing stacks a second band's padding on top of it. See
   * `HeroTrail`. Absent renders no element and no seam.
   */
  trail?: HeroTrail;
  /**
   * The credit groups, in array order, before the dates. Empty renders no `<dl>` at all — not
   * an empty one, and no 48px seam above nothing.
   */
  credits?: readonly HeroCredit[];
  /** The date pairs, after the credits. Absent renders nothing. */
  dates?: HeroDates;
  /**
   * Facts about the subject (a case's company, sector and work), before the credits and dates in the
   * same strip. With any fact the strip is an even grid rather than a wrapping row, because a fact's
   * value can run to a sentence.
   */
  facts?: readonly HeroFact[];
  /**
   * The page's taxonomy as chips, directly under the lead copy (owner, 11 Oct 2026: "move the tags
   * just below the description line"). Distinct from `tags`, the unboxed record after the actions.
   */
  labels?: readonly string[];
  /** How long the page takes to read, as the page states it ("11 min"), after the dates. */
  readingTime?: string;
  /**
   * The ground this band paints, and therefore the trail's too. Defaults to `paper`.
   *
   * A prop here rather than an inherited attribute, and it is the same answer SiteNav and
   * SiteFooter give: a control reads `data-surface` from an ancestor because it sits inside
   * somebody else's band, and a pattern that OWNS a band has no ancestor to ask. PageHero IS the
   * band. Since the trail moved inside it (5 Oct 2026) there is no second band to keep in step —
   * the crumbs read this one's ground, so a two-tone seam at the top of a page can no longer be
   * written.
   */
  surface?: SectionSurface;
  /**
   * An image or a YouTube embed: below the copy, or beside it from 1024 — see `arrangement`.
   *
   * That placement leads for the same reason `surface`'s instruction does: it is the thing about
   * this prop a caller is most likely to assume wrongly, and the first sentence is the only part
   * that reaches the design agent's `.prompt.md`.
   *
   * It is the only part of the hero that is not capped at a measure: in `stacked` it takes the full
   * content column, in `beside` the whole of its track. Its height follows the asset's own ratio,
   * uncropped, at every width (ruling H3); only the video has a box of its own, 16/9, because that
   * is what YouTube serves. A very tall asset renders tall — a supply problem the 326 check
   * catches, not something this component clips.
   *
   * An image renders through `Media`, which owns its edge by `kind` (a capture takes the hairline,
   * a cut-out, an illustration and a photograph take none), its srcset, and its loading. It is
   * always `priority`: a hero image is the LCP element on the routes that have one.
   *
   * Absent renders no element and no seam. There is no placeholder box and no ratio reserved for
   * a hero that has no media — 97 of 129 routes will not fill this, and a hero that left room for
   * it would be a hero with a hole in it.
   */
  media?: HeroMedia;
  /**
   * Media below the copy (`stacked`, the default) or beside it from 1024 (`beside`). Set by the page template, never by content.
   *
   * The first sentence leads for the design agent's `.prompt.md`, as `surface`'s does. Ruling H1:
   * the page-type template chooses the arrangement per family, in code; it is never a CMS field.
   * With no `media` both values render the same single column. See `HeroArrangement`.
   */
  arrangement?: HeroArrangement;
  /**
   * Taxonomy marks after the actions: an unboxed mono grid, each after a 6px blue pixel, three
   * columns from 768 and two below (four tags are 2 × 2 at every width). At most six render (a development warning names the rest), so
   * the set is two balanced rows. Inert; a list, so a reader is told how many. Keep the title to 3
   * lines when tags are set.
   */
  tags?: readonly string[];
  /**
   * The studio's record as figures, INSIDE the hero (owner, home round 3, 11 Oct 2026: "could the
   * facts/figures section be integrated into the hero so it doesn't take one entire section?").
   * One `Stat` each at the md step (40, blue numeral, its hairline and mark), in one row a `text`
   * under the actions: as many tracks as figures, at every width, so three figures never orphan.
   * Two to four; more belong in a facts band. Records rather than nodes, so the hero owns the size,
   * the row and the seam. Absent renders no row and no seam. A `masthead` sets them in its lede's
   * column, a `stack` under the lede: a listing's record is figures too, never a mono line of facts
   * (owner, 29 Oct 2026; decisions/2026-10-29-studio-record-is-figures, which retired `record`).
   */
  stats?: readonly HeroStat[];
  /**
   * The Tcules pixel-grid texture, for a paper hero with NO media only: the end-fade, the field
   * Statement's `end-fade` draws (end −120, 30% wide, blur 160, the band's full height), so it runs
   * hard along the end edge and fades toward the copy. From 1024; not drawn below.
   * A hero with a photograph, an illustration or a video carries no texture (owner, 9 Oct 2026:
   * the stepped `foot` and `field` recipes were retired; a hard-edged block reads as an object
   * competing with the copy, not as rhythm). Refused with a development warning there, and on any
   * ground but paper (§ 6.2).
   */
  texture?: boolean;
  /** A one-line announcement above the hero (showcase pages only). See `HeroAnnouncement`. */
  announcement?: HeroAnnouncement;
  /**
   * The `extras` row, between the byline and the actions. No `Section` inside it, and any headings
   * in it start at h3.
   *
   * Both constraints lead for the same reason `surface`'s does — see that prop. One route uses the
   * slot today (`/contact`'s stat block).
   *
   * It carries no colour and no distance of its own, which is the point of it: whatever is
   * passed reads --sec-* from the hero's own band, so a Layout of stats inside a blue hero is
   * white-on-blue without being told. A slot that imposed an ink or a step would be a slot the
   * caller had to fight.
   *
   * It must not contain a `Section` (the content column would inset twice), a `Breadcrumbs`, or
   * another `PageHero`. Headings inside it start at h3, because the page's body sections use h2
   * and a hero adjunct is subordinate to them.
   */
  children?: ReactNode;
};

/** One figure in the hero's record row. Structurally `Stat`'s value, unit and label. */
export type HeroStat = { value: string; unit?: string; label: string };

/** The record row's limits: two to four figures read as one row in the copy column. */
const MAX_STATS = 4;

/**
 * Nought, one or two actions. Position decides emphasis: the first renders the blue SOLID with no
 * arrow — the page's one main action (r7-buttons, owner 7 Oct 2026 as corrected 8 Oct: the hero
 * and/or the bottom close carry it, and it is always blue) — the second a blue GHOST with the
 * trailing arrow, its partner (a solid's partner is a ghost, never a link button; a link button is
 * every other, navigational action). There is no `converts`: colour no longer follows the kind of
 * action, so there is nothing to classify.
 *
 * Those are the three counts the corpus has, as a type — a third entry has no member of the union to
 * match, so it is a compile error rather than a review comment. The second emphasis is a consequence
 * of a second entry, not a slot waiting to be filled, which is why there is no `emphasis` on
 * HeroAction.
 *
 * History: ghost/neutral until 5 Oct 2026, then a primary link (fdn-blue) until the 7 Oct ruling;
 * an ink solid for a non-converting lead (fix/tone) until r7-buttons retired it on 8 Oct.
 */
export type HeroActions =
  readonly [] | readonly [HeroAction] | readonly [HeroAction, HeroAction];

type PageHeroActionProps = {
  /** See `HeroActions`. Absent or empty renders no row and no seam. */
  actions?: HeroActions;
};

export type PageHeroProps = Omit<PageHeroBaseProps, 'eyebrow' | 'rating'> &
  HeroEyebrowProps &
  PageHeroActionProps;

/** Six tags at most: two balanced rows of three beside the media (fix round 2). */
const MAX_TAGS = 6;

/* Where an illustration's numbered cut replaces the drawing: below 1440, where its track is
   narrower than 572 and the drawing's labels would set under 9px. Layout's xl, less a hair.
   KEEP IN STEP with PageHero.module.css § breakpoint switches, which hides `.legend` from 1440:
   a CSS module cannot read a TSX constant, so the one breakpoint is written twice, here (the
   <source> Media renders) and there (the legend), and the two must move together. */
const CUT_QUERY = '(max-width: 1439.98px)';

/* The label a role selects. A fixed map rather than a prop, and it does NOT change with the
   count — two authors are still "Written by". A hero whose credit label read differently on one
   route is a bug, which is why there is no `authorLabel`. */
/* Authored casing, uppercased by the stylesheet — the same division the eyebrow makes. Reversing
   the case is one declaration in PageHero.module.css and no edit here. */
const CREDIT_LABELS: Record<HeroCreditRole, string> = {
  author: 'Written by',
  host: 'Hosted by',
  guest: 'With',
  reviewer: 'Reviewed by',
};

/* "Updated" rather than "Modified": the byline is read by people, and one of those two words is
   what a person calls it. Both labels live here for the same reason the credit labels do. */
const PUBLISHED_LABEL = 'Published';

/* The roles whose key is read but not seen. A face and a name under an article's title already say
   who wrote it, so "Written by" is announced to a screen reader and hidden on screen; a host and a
   guest are not self-evident, so theirs stay (owner, 30 Oct 2026: byline board G). */
const SILENT_ROLES: ReadonlySet<HeroCreditRole> = new Set(['author']);
const MODIFIED_LABEL = 'Updated';
const READING_LABEL = 'Reading time';

/* One long date, formatted once at module scope rather than per render.
   `timeZone: 'UTC'` is load-bearing rather than tidy: a bare "2026-03-03" parses as UTC
   midnight, so formatting it in any zone behind UTC yields 2 March — which would render one date
   on the server and another in a Los Angeles browser, and hydration would not complain because
   both are valid text. Pinning the zone makes the output a function of the string alone. */
const LONG_DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/* An unparseable date renders verbatim instead of "Invalid Date". The spec does not name this
   case — its edge cases are about content shape rather than content validity — but the failure
   mode of the alternative is a page shipping the literal string "Invalid Date" in its byline,
   which is worse than showing the frontmatter's own bad value where an author can recognise it. */
const formatDate = (iso: string) => {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? iso : LONG_DATE.format(parsed);
};

/* One name alone; two joined with "and"; three or more comma-separated with "and" before the
   last. Written out rather than taken from Intl.ListFormat, because this is a fixed English
   label decision the spec makes once and locale data is free to disagree with it. */
const separatorAt = (index: number, count: number) =>
  index === 0 ? '' : index === count - 1 ? ' and ' : ', ';

/* A credit group's value: the portraits overlapping, then the names, each linked where it has a
   page. The portraits are decoration (alt=""), because the names beside them say who they are. */
function CreditValue({ people }: { people: readonly HeroPerson[] }) {
  const names = people.map((person, index) => (
    <span key={`${person.name}-${index}`}>
      {separatorAt(index, people.length)}
      {person.href ? (
        <a href={person.href} className={styles.name}>
          {person.name}
        </a>
      ) : (
        <span className={styles.name}>{person.name}</span>
      )}
    </span>
  ));
  if (!people.some((person) => person.portrait)) return <>{names}</>;
  return (
    <Cluster nowrap colGap="tight" align="center">
      <span className={styles.avatars} aria-hidden="true">
        {people.map((person, index) =>
          person.portrait ? (
            <span key={`${person.name}-${index}`} className={styles.avatar}>
              <Media
                image={{ ...person.portrait, alt: '', focus: person.portrait.focus ?? PORTRAIT_FOCUS }}
                fit="fill"
                edge="placement"
                sizes="32px"
              />
            </span>
          ) : (
            <span key={`${person.name}-${index}`} className={cx(styles.avatar, styles.initials)}>
              {initialsOf(person.name)}
            </span>
          ),
        )}
      </span>
      <span>{names}</span>
    </Cluster>
  );
}

/* A rendered byline row: one <dt>, one <dd>. Credits and dates become the same shape here so
   the <dl> maps once — the two are different content but identical structure, and a second map
   would be a second chance for the key/value markup to drift. */
type BylinePair = { id: string; label: string; value: ReactNode; silent?: boolean };

/**
 * PageHero — the opening block of a page, built to docs/specs/PageHero.md.
 *
 * An optional ancestor trail, one h1, an optional eyebrow above it, one to six paragraphs of lead
 * copy, an optional byline
 * of credits and dates, an optional caller block, nought to two actions and an optional image or
 * YouTube embed, below the copy or beside it. It is the first thing inside <main> on all 129 routes
 * and there is never a second one: two heroes are two h1s, and the `string` typing of `title` is
 * what makes that hard to do by accident.
 *
 * ONE variant, ONE size and five arrangements. The three page families the first brief described
 * (text-left, article, case study) are still one arrangement of the copy: they differ only in which
 * optional slot is filled. What does differ is where an IMAGE goes — below the copy, beside it,
 * leading it, under a centred head or under a title-led one — and that is `arrangement`, a
 * presentation prop the page template sets per family (ruling H1). With no media `stacked`,
 * `beside` and `wide` render the same single column.
 *
 * It contributes no colour and no distance: the six inks come from --hero-* in
 * tokens/components/page-hero.css, which re-declares the whole set once per surface, and every
 * seam is a Section, Layout or Cluster gap. So the same markup is correct on paper, on tint, on
 * an ink band and on the blue pivot — including a tint hero standing between two ink bands.
 *
 * The non-uniform rhythm comes entirely from NESTING rather than from a knob, which is why
 * `top`, `stack`, `opening` and `copy` all exist as levels even though none of them renders
 * anything visible: 16 between paragraphs, 24 inside the opening, 32 from the trail to the split,
 * 48 between blocks, and 96 between the copy and the media when they stand side by side. Tighten
 * by grouping, loosen by separating.
 *
 * It renders its OWN band — a Section at default density, so 96 of air above the trail (or the
 * title, with no trail). The trail lives inside that band (kit `fdn-top`, 5 Oct 2026): it was a
 * band of its own with 64 above it, and the two paddings stacked to put a service page's h1 at
 * 296. Being a band, the hero can only be a direct child of the page or its template.
 * It must not go inside a Section (the column would inset twice), a Layout track (a band is not
 * a row) or a Cluster (which would shrink it to its longest word).
 *
 * NO STATES, and that is an assertion rather than an omission: nothing this component styles
 * responds to a pointer, no element it renders is focusable, nothing opens, and focus never moves
 * as a consequence of this component. Given the same props it renders the same pixels at every
 * moment of its life. The two stateful things that can appear in the band are a Button, which owns
 * every value it paints, and — when `media` is a video — an <iframe> whose document belongs to
 * youtube-nocookie on another origin: it has states, it has focus rings, and not one of them is
 * reachable from this component's stylesheet at any cost. An iframe element is not itself in the
 * tab order; Tab moves INTO that document.
 *
 * A server component. No state, no effect, no ref, no DOM handler.
 */
export function PageHero({
  title,
  titleSize = 'display',
  titleAcross = false,
  body,
  eyebrow,
  rating,
  trail,
  credits = [],
  dates,
  readingTime,
  facts = [],
  labels = [],
  actions = [],
  media,
  arrangement = 'stacked',
  surface = 'paper',
  tags = [],
  stats = [],
  texture = false,
  announcement,
  children,
  'data-band': dataBand,
  'data-fold-hero': dataFoldHero,
}: PageHeroProps) {
  /* Blank entries are dropped BEFORE the roles are assigned, not after: an empty first string
     would otherwise make the lead an empty <p> and promote paragraph two to body scale, so the
     one route with a stray blank line in its frontmatter would render its opening one step
     quieter than every other route. */
  const paragraphs = (body ?? []).filter((paragraph) => paragraph.trim().length > 0);
  const [lead, ...rest] = paragraphs;

  const pairs: BylinePair[] = facts.map((fact) => ({
    id: `fact-${fact.id}`,
    label: fact.label,
    value: fact.value,
  }));
  pairs.push(
    ...credits.map((credit, index) => ({
      /* The role is not unique — a podcast can carry two guest groups — so the index is part of
       the key. These rows never reorder: they are frontmatter in array order. */
      id: `${credit.role}-${index}`,
      label: CREDIT_LABELS[credit.role],
      silent: SILENT_ROLES.has(credit.role),
      value: <CreditValue people={credit.people} />,
    })),
  );

  if (dates?.published) {
    pairs.push({
      id: 'published',
      label: PUBLISHED_LABEL,
      value: <time dateTime={dates.published}>{formatDate(dates.published)}</time>,
    });
  }
  /* A modified date equal to the published one is not a second fact. Rendering both would put
     "Published 3 March 2026" and "Updated 3 March 2026" side by side, which reads as a mistake
     because it is one — the CMS stamping a modified date on save. */
  if (dates?.modified && dates.modified !== dates.published) {
    pairs.push({
      id: 'modified',
      label: MODIFIED_LABEL,
      value: <time dateTime={dates.modified}>{formatDate(dates.modified)}</time>,
    });
  }

  if (readingTime) pairs.push({ id: 'reading', label: READING_LABEL, value: readingTime });

  /* Any credited portrait sets every value in the strip to the portrait's height (board G), so the
     keys share one top line and the dates sit level with the names beside the faces. */
  const hasPortraits = credits.some((credit) => credit.people.some((person) => person.portrait));

  /* Widened from the tuple union to iterate. The union is what makes a third action a compile
     error at the call site; `.map` over a union of three tuple types is not callable, and this
     is the one line that reconciles the two. It weakens nothing: the narrowing has already done
     its work by the time a value reaches here. */
  const controls: readonly HeroAction[] = actions;

  /* The split is real only when there is something to split: `beside` or `wide` with no media is
     the single column, and so is `stacked` with or without it. `display` splits the HEAD (title and
     lead | the ask) and keeps the media below, so it is title-led with or without media. */
  const split = (arrangement === 'beside' || arrangement === 'wide') && media !== undefined;
  const wide = split && arrangement === 'wide';
  const centredHead = arrangement === 'centred';
  const display = arrangement === 'display';
  const masthead = arrangement === 'masthead';
  const across = titleAcross && split && !wide;

  /* Against media, the copy's alignment follows what the media IS (visual-direction § 3.2). An
     illustration has no box, so the copy is centred on it and the two read as one pair; a
     photograph, a capture or a video has an edge, so the h1 and that top edge share a line. */
  const isIllustration = media?.type === 'image' && media.image.kind === 'illustration';
  const isPhotograph = media?.type === 'image' && media.image.kind === 'photograph';
  const centred = split && isIllustration;

  /* The numbered cut of a service illustration (scripts/illustrations-phone.mjs): the drawing with
     its labels as numbered markers, and the labels as an HTML legend under it, below 1440. Handed
     in on the image record (`cut`), never looked up here; an image without one renders alone. Below
     1440 the drawing's track is narrower than 572 (a third of the split from 1024, the full column
     on a phone), and its 17-unit mono labels came out at 7px at 1024; the legend sets them at 12. */
  const legend = media?.type === 'image' && isIllustration ? media.cut : undefined;

  /* The texture: the end-fade, on a paper hero with no media, and nothing else (owner, 9 Oct
     2026). The stepped `foot` (under the copy beside a photograph) and `field` (the end third of a
     no-media band) were retired: a hard-edged block reads as an object competing with the copy, not
     as rhythm. A hero with media already has its image; the grid is drawn for paper only (§ 6.2). */
  const faded = texture && surface === 'paper' && media === undefined;
  if (process.env.NODE_ENV !== 'production' && texture && !faded) {
    console.warn(
      `PageHero: texture is for a paper hero with no media (the end-fade); a hero with an image ` +
        `carries none (§ 6.2). Ignored here.`,
    );
  }

  /* Tags are capped at six: two balanced rows of three beside the media, three rows of two on a
     phone. Nine set as a wrapping list ran to two ragged rows and four on a phone, a metadata dump
     under the ask (cmp-hero fix round 2). The rest belong in the page's body. */
  const shownTags = tags.slice(0, MAX_TAGS);
  if (process.env.NODE_ENV !== 'production' && tags.length > MAX_TAGS) {
    console.warn(
      `PageHero: ${tags.length} tags; the hero sets the first ${MAX_TAGS}. Choose the six that ` +
        `name the offer and move the rest to the page's body.`,
    );
  }

  /* The trail stands 32px above the copy, so anything in the copy that says a crumb's words again
     reads twice. Two warnings, and each asks the question the routes' own fix asks, from
     @/lib/trail, so the warning cannot disagree with the fix (zero-width characters, punctuation,
     case and a trailing "s" all ignored): `repeatsTrail` for the eyebrow, which `eyebrowBesideTrail`
     uses and which catches a crumb said INSIDE the eyebrow, and `sameLabel` for the title, which
     `heroTrail` uses.
     Warnings rather than refusals: the band renders, so the fault is visible on the page as well
     as in the console.

       eyebrow  owner, 5 Oct 2026: the hero eyebrow never repeats the crumb — any crumb, since a
                format eyebrow ("Audits") repeats a parent as surely as a name repeats the leaf.
                A crumb that names something is repeated by being said; the site's structure
                ("Home", a section index, `trail.structural`) only by being equalled.
       title    the last crumb names the page only when the h1 does not. `heroTrail` drops a leaf
                that repeats the title, so this fires only on a trail built by hand. */
  if (process.env.NODE_ENV !== 'production' && trail !== undefined) {
    if (eyebrow !== undefined && repeatsTrail(eyebrow, trail.labels, trail.structural)) {
      console.warn(
        `PageHero: eyebrow "${eyebrow}" repeats a crumb in the trail. It is not rendered: a hero ` +
          `with a breadcrumb carries no eyebrow (owner, 11 Oct 2026).`,
      );
    }
    const last = trail.labels.at(-1);
    if (last !== undefined && sameLabel(last, title)) {
      console.warn(
        `PageHero: the trail's last crumb "${last}" repeats the title. Build the trail with ` +
          `heroTrail (@/lib/trail), which ends it at the parent when the h1 names the page.`,
      );
    }
  }

  const justify = centredHead ? 'center' : undefined;

  /* ── The parts, built once and placed by the arrangement below ─────────────────── */
  /* The eyebrow carries the band's one blue mark: a 6px square, the texture's own pixel, before the
     label (Meridian's eyebrow square, re-coloured; § 4.2). Grey mono alone left the photograph
     heroes reading black and white apart from the ask. The square is aria-hidden: it marks, it
     does not say. nowrap, so the square never wraps away from a long label: the label's own span
     shrinks and wraps instead. */
  /* The score in the eyebrow's place: a RatingBadge in a plain <div>, because a Layout track would
     stretch the badge's inline-flex box to the column and a pill would run the full width. The div
     carries no class: it only stops the stretch. Under a centred head the Layout's justify-items
     centres the div, and the badge sits in it at its own width. */
  const ratingNode = rating ? (
    <div>
      <RatingBadge
        score={rating.score}
        platform={rating.platform}
        href={rating.href}
        scale={rating.scale}
        frame={rating.frame}
        icon={<Icon name="star" size="sm" />}
        mark={rating.mark ? <BrandMark name={rating.mark} /> : undefined}
      />
    </div>
  ) : null;
  /* A hero with a breadcrumb carries NO text eyebrow (owner, 11 Oct 2026: "lets not put anything
     in the eyebrow since the breadcrumb already tells the page location"). The trail is the line
     above the title on every page that has one; the eyebrow survives only on a hero without a trail
     (home). Enforced here rather than at each caller, so a CMS eyebrow cannot bring it back. A
     score is not a location, so `rating` keeps the slot either way. */
  const shownEyebrow = trail === undefined ? eyebrow : undefined;
  const eyebrowNode = rating ? (
    ratingNode
  ) : shownEyebrow ? (
    <Cluster
      as="p"
      colGap="tight"
      align="center"
      justify={justify}
      nowrap
      className={styles.eyebrow}
    >
      <span>{shownEyebrow}</span>
    </Cluster>
  ) : null;
  const titleNode = (
    <h1 className={cx(styles.title, titleSize === 'mark' && styles.titleMark)}>{title}</h1>
  );
  /* copy · 16 between paragraphs. Absent entirely when every entry was blank — never an empty
     <div> holding 16px of nothing. The index is the key: static frontmatter copy in array order,
     never reordered, and two paragraphs may be identical strings. */
  const copyNode =
    lead === undefined ? null : (
      <Layout rowGap="text">
        {lead !== undefined ? <p className={styles.lead}>{lead}</p> : null}
        {rest.map((paragraph, index) => (
          <p key={index} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </Layout>
    );

  /* ── byline · 24 both axes ─────────────────────────────────────────────
     A <dl> rather than a Cluster of spans, because each <dt> is then announced immediately before
     its own <dd>. 4px between a key and its value against 24px between one pair and the next is a
     six-fold difference, so each pair reads as one unit — no rule, no dot, no separator. */
  const pairItems = pairs.map((pair) => (
    <Layout key={pair.id} rowGap="inline">
      <dt className={pair.silent ? styles.silentKey : styles.key}>{pair.label}</dt>
      <dd className={styles.value}>{pair.value}</dd>
    </Layout>
  ));
  const bylineNode =
    pairs.length === 0 ? null : facts.length > 0 ? (
      <Layout
        as="dl"
        columns={{ base: 1, md: 2, lg: Math.min(pairs.length, 4) }}
        colGap="gutter"
        rowGap="block"
        className={styles.byline}
      >
        {pairItems}
      </Layout>
    ) : (
      <Cluster
        as="dl"
        colGap="stack"
        rowGap="block"
        /* With portraits every value is one height, so aligning the ends lines up the values whether
           or not a key shows: an article's hidden "Written by" leaves its names level with the
           dates (board G), and a podcast's keys still share one line above. */
        align={hasPortraits ? 'end' : 'start'}
        className={cx(styles.byline, hasPortraits && styles.withPortraits)}
      >
        {pairItems}
      </Cluster>
    );

  /* ── labels · the taxonomy chips, a block under the copy, inside the opening ───── */
  const shownLabels = [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
  const labelsNode =
    shownLabels.length === 0 ? null : (
      <Cluster as="ul" colGap="text" rowGap="tight" justify={centredHead ? 'center' : 'start'}>
        {shownLabels.map((label) => (
          <li key={label}>
            <Tag>{label}</Tag>
          </li>
        ))}
      </Cluster>
    );

  /* ── extras · the caller's block. No class: it carries nothing. The <div> groups whatever is
     passed into ONE row of the stack. */
  const extrasNode = children == null ? null : <div>{children}</div>;

  /* ── actions · one solid, one ghost partner ────────────────────────────────
     Anchors, because a hero action always navigates. The first is the page's one main action, the
     blue solid (r7-buttons, 8 Oct 2026: there is no ink solid) — and carries NO arrow: the label
     carries the ask. The second is a primary GHOST with
     the trailing arrow: the owner's 7 Oct 2026 pairing rule (a primary's partner is a ghost, never a
     link button; the ghost takes the arrow because it navigates). Its label and arrow stay blue at
     rest, the foreground accent (visual-direction § 4.2), and it has no fill at rest, so it reads
     as the alternative rather than a second ask. Recorded in docs/specs/Button.md § 14a.
     From 768 the pair sits on one line, centred on the cross axis. Below 768 it ALWAYS stacks, the
     ghost 24 under the solid (`stackUntil`): the phone shape no longer depends on how long the
     labels are (fix round 2). size="md" with extendHitArea on both: each box is 40 and the
     extension covers the missing 4. */
  const actionsNode =
    controls.length > 0 ? (
      <Cluster
        colGap="block"
        rowGap="block"
        align="center"
        justify={display ? { base: 'start', lg: 'end' } : justify}
        stackUntil="md"
      >
        {controls.map((action, index) => (
          <Button
            key={action.href}
            as="a"
            href={action.href}
            emphasis={index === 0 ? 'solid' : 'ghost'}
            size="md"
            extendHitArea
            icon={index === 0 ? undefined : <Icon name="arrow-right" />}
          >
            {action.label}
          </Button>
        ))}
      </Cluster>
    ) : null;

  /* ── tags · an unboxed mono grid, each mark a blue pixel ───────────────────
     Each tag is a mono label after a 6px blue square (the eyebrow's mark), set in three equal
     columns from 768 and two below it, so six tags are two balanced rows beside the media and three
     on a phone rather than a ragged wrap. After the actions, as the hero's footnote, so the ask
     stays where every other hero puts it. A list, so a reader is told how many. The key is the
     index with the tag, because a record may repeat a tag. Under a centred head a grid would hang
     from the column's start, so there the marks wrap as a centred row instead. */
  const tagItems = shownTags.map((tag, index) => (
    <li key={`${index}-${tag}`}>
      <Cluster colGap="tight" align="center" nowrap>
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.tag}>{tag}</span>
      </Cluster>
    </li>
  ));
  const tagsNode =
    shownTags.length === 0 ? null : centredHead ? (
      <Cluster as="ul" colGap="block" rowGap="text" justify="center">
        {tagItems}
      </Cluster>
    ) : (
      /* Four tags are 2 × 2 (a record of four facts, home's studio line): in three columns they set
         3 + 1, an orphan, and in a 572 track a nowrap mono tag of 21 characters fills its whole
         175 column and touches its neighbour's pixel. Two tracks give each tag 274. Every other
         count keeps the two balanced rows of three. */
      <Layout
        as="ul"
        columns={shownTags.length === 4 ? 2 : { base: 2, md: 3 }}
        colGap="block"
        rowGap="text"
      >
        {tagItems}
      </Layout>
    );

  /* ── stats · the record as figures, one row under the actions (home round 3) ──────────
     As many tracks as figures at EVERY width (a 326 phone column holds three ~87 tracks: the md
     figure steps to 32 there and the label wraps to two lines), so three figures are one row rather
     than 2 + 1. Each Stat opens on its own hairline with the blue mark, which is what divides the
     record from the ask above it; the gutter breaks the rule between them. A list, so a reader is
     told how many. More than four would crowd the copy column: the first four render, and a
     development warning names the rest. */
  const shownStats = stats.slice(0, MAX_STATS);
  if (process.env.NODE_ENV !== 'production' && stats.length > MAX_STATS) {
    console.warn(`PageHero: ${stats.length} stats; the hero sets the first ${MAX_STATS}.`);
  }
  const statsNode =
    shownStats.length === 0 ? null : (
      <Layout as="ul" columns={{ base: shownStats.length }} colGap="gutter" rowGap="block">
        {shownStats.map((stat) => (
          <Stat
            key={`${stat.value}-${stat.label}`}
            as="li"
            size="md"
            value={stat.value}
            unit={stat.unit}
            label={stat.label}
            align={centredHead ? 'center' : 'start'}
          />
        ))}
      </Layout>
    );
  /* The ask and the record are two blocks, a `stack` apart in the stack below (owner, home round 4,
     11 Oct 2026: the figures sat "too close" to the button). Round 3 grouped them a `text` apart on
     the argument that each Stat's own hairline divides them; at 16 the row of figures read as part of
     the button's group. The step is chosen by what it separates, a block from a block, not by the
     fold: the home hero now ends past the 1470 fold (page-mapping § 20). */

  /* ── media · below the copy, beside it, or under a centred or display head ─────────────────
     An image renders through Media, which owns the edge (by kind), the srcset and the loading;
     PageHero owns `sizes` (the arrangement's width, from src/lib/image-sizes.ts) and `priority`
     (always: a hero image is the LCP element on every route that has one).

     An illustration with a numbered cut is ONE image: Media's `art` renders a <picture> whose
     <source> swaps the cut in below 1440, so the browser fetches the one the width shows and only that one is high priority.
     It was two <Media priority> with one hidden by display:none, so every service page fetched both
     drawings eagerly at every width (fix round 2). The legend shows only where the cut does, and is
     aria-hidden for the reason the drawing's alt is empty: the h1 already names what the drawing
     stands for (ch05 § 9a). Both cuts share one viewBox, so the img's width and height hold. */
  const sizes = centredHead
    ? HERO_CENTRED
    : wide
      ? HERO_WIDE
      : split
        ? isIllustration
          ? HERO_BESIDE_DRAWING
          : HERO_BESIDE
        : FULL_COLUMN;
  const image =
    media?.type === 'image' ? (
      <Media
        image={media.image}
        sizes={sizes}
        ratio={
          media.ratio ??
          (display && media.image.kind === 'photograph'
            ? HERO_SHAPE_RATIO[media.shape ?? 'wide']
            : undefined)
        }
        art={legend ? [{ media: CUT_QUERY, src: legend.src }] : undefined}
        priority
      />
    ) : null;
  const mediaNode =
    media === undefined ? null : media.type === 'image' ? (
      legend ? (
        <Layout rowGap="block">
          {image}
          {/* aria-hidden on the wrapper: Cluster passes no ARIA through. */}
          <div className={styles.legend} aria-hidden="true">
            <Cluster as="ol" colGap="block" rowGap="tight">
              {legend.items.map((item, index) => (
                <li key={`${index}-${item.label}`}>
                  <Cluster colGap="tight" align="center" nowrap>
                    <span
                      className={item.tone === 'accent' ? styles.numeralAccent : styles.numeral}
                    >
                      {index + 1}
                    </span>
                    <span className={styles.tag}>{item.label}</span>
                  </Cluster>
                </li>
              ))}
            </Cluster>
          </div>
        </Layout>
      ) : (
        image
      )
    ) : (
      /* youtube-nocookie.com: it withholds the tracking cookies until a visitor presses play. The
         whole URL is built here rather than taken from the caller, so every route embeds the same
         way (see HeroVideo). No query parameters, deliberately. loading="lazy" here and not on the
         image: a video frame is an object a reader decides to press, never the paint they wait
         for. `allow` is the player's own list minus autoplay. */
      <iframe
        className={styles.video}
        src={`https://www.youtube-nocookie.com/embed/${media.id}`}
        title={media.title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        allowFullScreen
      />
    );

  /* The trail. Centred, it is one item in a centring row rather than a nav stretched to the column. */
  const crumbs =
    trail === undefined ? null : centredHead ? (
      <Cluster justify="center">{trail.crumbs}</Cluster>
    ) : (
      trail.crumbs
    );

  /* ── stack · 48 between blocks ──────────────────────────────────────────
     Every child but the opening is conditional, and each renders NO ELEMENT when its slot is
     empty, so an absent slot costs no seam. The opening is one Layout of three: the
     eyebrow-to-title and title-to-copy seams are the same step, 24. */
  const stack = (
    <Layout
      rowGap="stack"
      justifyItems={justify}
      className={centredHead ? styles.centred : undefined}
    >
      {across ? (
        copyNode || labelsNode ? (
          <Layout rowGap="block" justifyItems={justify}>
            {copyNode}
            {labelsNode}
          </Layout>
        ) : null
      ) : (
        <Layout rowGap="block" justifyItems={justify}>
          {eyebrowNode}
          {titleNode}
          {copyNode}
          {labelsNode}
        </Layout>
      )}
      {bylineNode}
      {extrasNode}
      {actionsNode}
      {statsNode}
      {tagsNode}
    </Layout>
  );

  /* ── top · the trail 32 above the title, wherever the title stands ───────────────
     `gutter`: the trail is a 13px apparatus line and the title is 67px, so the step that separates
     peers in a row is enough. Against an ILLUSTRATION the trail joins the copy column, because the
     copy is centred on the drawing: above the split it floated 39 to 59 above a title that the
     centring had moved down (fix round 1, § 1.2's 32). Against a photograph the trail stays above
     the split, so the photograph's top edge and the eyebrow share a line as § 3.2 asks. */
  const withTrail = (node: ReactNode) =>
    crumbs === null ? (
      node
    ) : (
      <Layout rowGap="gutter" justifyItems={justify}>
        {crumbs}
        {node}
      </Layout>
    );

  let top: ReactNode;
  if (masthead) {
    /* ── masthead · the title, and the lede on its last baseline ─────────────────────────
       A [2, 1] split: the title alone in the 2 (wide enough for its own measure, so it sets the lines
       it would stacked), the lede and its figures in the 1, both halves sharing the title's last baseline (`align="baseline"`).
       Media and actions are not a masthead's (see `HeroArrangement`); a byline or tags would follow
       the lede in its column. */
    top = withTrail(
      <Layout columns={{ lg: [2, 1] }} colGap="section" rowGap="block" align="baseline">
        <Layout rowGap="block">
          {eyebrowNode}
          {titleNode}
        </Layout>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            {copyNode}
            {labelsNode}
            {bylineNode}
            {tagsNode}
          </Layout>
          {statsNode}
        </Layout>
      </Layout>,
    );
  } else if (display) {
    /* ── display · title-led, the media a panorama below ─────────────────────────────────
       The Quantum split header (references.md, crop 6): the eyebrow, the title and the lead in 3 of
       5 from 1024, and the ask in the other 2, flush with the column's end edge (and so with the
       panorama's) from 1024 and at the start below it, on the lead's LAST
       BASELINE (`align="baseline"`), so the two halves share a line rather than floating at two
       heights (fix round 2: the lead and button were top-aligned at 100 while the title sat at
       175). Then the photograph at the full column 48 below, at 4:1 from 1024 (1240 × 310), which
       ends the hero at 781 with the nav; 3:1 ended it at 953. */
    top = withTrail(
      <Layout rowGap="stack">
        <Layout columns={{ lg: [3, 2] }} colGap="section" rowGap="block" align="baseline">
          <Layout rowGap="block">
            {eyebrowNode}
            {titleNode}
            {copyNode}
            {labelsNode}
            {labelsNode}
          </Layout>
          {/* The figures are their own block, a `stack` under the ask (home round 4), as in the
              split stack below; the byline, extras, actions and tags keep this column's `block`. */}
          <Layout rowGap="stack">
            {bylineNode || extrasNode || actionsNode ? (
              <Layout rowGap="block">
                {bylineNode}
                {extrasNode}
                {actionsNode}
              </Layout>
            ) : null}
            {statsNode}
            {tagsNode}
          </Layout>
        </Layout>
        {mediaNode}
      </Layout>,
    );
  } else {
    /* ── split · the arrangement ──────────────────────────────────────────────
        stacked  single track, 48 between the copy and the media: the "below" of ruling H1.
        beside   two tracks with 96 between them (--gap-section: a split, not peer halves).
                   photograph  [1, 1] from 1024: 572 × 458 at 1470 (ruling H2, § 2.5), 432 at
                               1024, where the 3 : 2 of round 1 left a 346 thumbnail.
                   drawing     [2, 1] from 1024 and [1, 1] from 1440. The 67px title needs 576 at
                               1024 ("unresolved product." is one line there); the drawing takes
                               the third and its numbered cut, so its labels stay readable.
        wide     the photograph LEADS: [1, 1] from 1024 and copy 2 : media 3 from 1440, a 3:2
                 photograph at 686 × 457 beside a 458 copy column. The family's second photograph
                 idea, so the home and studio heroes are not one rectangle at a squint (fix round 2).
        centred  single track, centred, the media capped at --hero-media-size-centred.
       Copy and media are unequal heights by design. An illustration is centred on the copy;
       anything else is top-aligned in its own box. */
    const columns = !split
      ? undefined
      : wide
        ? { lg: [1, 1], xl: [2, 3] }
        : isIllustration
          ? { lg: [2, 1], xl: [1, 1] }
          : { lg: [1, 1] };

    const copyTrack = stack;

    const mediaTrack =
      mediaNode === null ? null : centredHead && isIllustration ? (
        /* The cap is a drawing's (its labels outgrew the lead at full width); a photograph under a
           centred head takes the whole column (owner, 31 Oct 2026, About). */
        <div className={styles.centredMedia}>{mediaNode}</div>
      ) : split && !isIllustration ? (
        /* Its own box, so the row's stretch reaches the copy track and never the photograph. */
        <div>{mediaNode}</div>
      ) : (
        mediaNode
      );

    /* The trail is always the hero's first item (owner, 30 Oct 2026;
       decisions/2026-10-30-breadcrumb-is-the-heros-first-item). It joins the copy column only when
       the title is in that column too; with the title across the top, the trail goes above it. */
    const trailInCopy = centred && !across;
    const copyColumn = trailInCopy ? withTrail(copyTrack) : copyTrack;
    const content = (
      <Layout
        rowGap="stack"
        columns={columns}
        colGap={columns ? 'section' : undefined}
        align={centred ? 'center' : columns ? 'stretch' : 'start'}
        justifyItems={justify}
      >
        {copyColumn}
        {mediaTrack}
      </Layout>
    );
    /* `titleAcross`: the head across the column, then the split under it, a `stack` apart, as the
       split's own copy blocks are. */
    const headed = across ? (
      <Layout rowGap="stack">
        <Layout rowGap="block">
          {eyebrowNode}
          {titleNode}
        </Layout>
        {content}
      </Layout>
    ) : (
      content
    );
    top = trailInCopy ? headed : withTrail(headed);
  }

  return (
    /* ── The band ────────────────────────────────────────────────────────────────
       The hero owns its band, at Section's DEFAULT density — 96 of air, one band shape on every
       page. No className on the Section and no override of it from anywhere: the column, the
       gutter, the ground and the vertical air are all --sec-*.

       Deliberately NOT a labelled landmark: SiteNav, main, SiteFooter and Breadcrumbs own the
       landmarks. A <section> because the hero is a self-contained thematic opening. */
    <Section
      surface={surface}
      data-band={dataBand}
      data-fold-hero={dataFoldHero}
      data-arrangement={
        centredHead
          ? 'hero-centred'
          : display
            ? 'hero-display'
            : masthead
              ? 'hero-masthead'
              : split
                ? isIllustration
                  ? 'hero-illustration'
                  : wide
                    ? 'hero-wide'
                    : 'hero-media'
                : media === undefined
                  ? 'hero-text'
                  : 'hero-stacked'
      }
    >
      {faded ? (
        /* end-fade: Statement's recipe, a direct child of Section so the field is the band's
           padding box. Run from −50% to 150% of the band's height, so the blur's vertical falloff
           is clipped and the grid holds full strength along the end edge. From 1024 only. */
        <>
          <Texture className={styles.fade}>
            <TextureShape
              top="-50%"
              right={-120}
              width={titleSize === 'mark' ? '62%' : '30%'}
              height="200%"
              blur={160}
            />
          </Texture>
          {/* Below 1024: the field in the band's top-end corner, over the trail's empty end and
              clear of the title, so a phone's hero keeps its texture (beauty round 3). */}
          <Texture className={styles.fadeCorner}>
            <TextureShape top="-40%" right={-80} width="70%" height="80%" blur={72} />
          </Texture>
        </>
      ) : null}
      {announcement === undefined ? (
        top
      ) : (
        /* ── announcement · one line of news, a stack above the rest ─────────────────
           48, not the trail's 32: the strip is news ABOUT the site, not part of this page's
           opening. A blue pixel and a blue mono label, a sentence and a link. One line wherever it
           fits; where it does not, the SENTENCE wraps beside the label (the inner row never wraps,
           and the sentence is the item that shrinks) and the link drops below it. It used to
           ellipsise on a phone, to "The AI Product ...", which is the strip saying nothing at the
           one width where a reader cannot hover for the rest (fix round 2). */
        <Layout rowGap="stack">
          <Cluster colGap="block" rowGap="tight" align="center">
            <Cluster colGap="block" align="start" nowrap>
              <Cluster colGap="tight" align="center" nowrap>
                <span className={styles.mark} aria-hidden="true" />
                <span className={styles.flag}>{announcement.label}</span>
              </Cluster>
              <p className={styles.note}>{announcement.text}</p>
            </Cluster>
            <Button
              as="a"
              href={announcement.action.href}
              emphasis="link"
              tone="primary"
              size="sm"
              extendHitArea
              icon={<Icon name="arrow-right" />}
            >
              {announcement.action.label}
            </Button>
          </Cluster>
          {top}
        </Layout>
      )}
    </Section>
  );
}
