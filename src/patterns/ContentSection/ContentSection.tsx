import { Children, type ReactNode } from 'react';

import {
  Cluster,
  Layout,
  Media,
  Section,
  TextureCounterweight,
  type MediaImage,
  type SectionDensity,
  type SectionSurface,
} from '@/components';
import { cx } from '@/lib/cx';
import { mediaSplitSizes } from '@/lib/image-sizes';

import styles from './ContentSection.module.css';

/**
 * Where the head group sits against the blocks. Four arrangements of the same beats; the layout
 * moves at 1024 and nowhere else, and below 1024 every one of them is a single column in DOM order.
 *
 * NO TEXT-ONLY HEAD SPLITS (owner, 7 Oct 2026). A head is never split left/right on its own: the
 * `split-head` arrangement (the H-row — heading in one track, lead and action in the other) was
 * retired, because with no image beside it the reading order was unclear and the action floated in
 * a mostly empty track. A text-only head is eyebrow → heading → lead → action in ONE column, over
 * its body. Side by side survives only where one side is media: `media` (the photograph beside the
 * copy) and `beside` with an aside (the head track's photograph), plus `beside` over a body that
 * reads down, where the split is head | body rather than heading | lead.
 *
 *   stacked     the head above the blocks, at every width. The default.
 *   beside      from 1024, the head in a leading track (5 : 7, then 1 : 2 from 1440) and the blocks in the trailing one, 96
 *               apart, the head static (it scrolls with the band; it does not stick, ruling O2). The
 *               head track may carry an `aside` (a 3:2 photograph or one stat figure) OR `actions`,
 *               never both (visual-direction § 1.4 rule 6). Below 1024 it is `stacked`, with the aside
 *               between the head and the body (§ 3.7 item 4). It splits only when there are BLOCKS
 *               for the trailing track; without them it is the stacked band, aside dropped.
 *   media       the B media split (§ 3.4): a 4:5 photograph in 5 of [5, 7] beside a copy column
 *               holding the head, the blocks and the footer, 96 apart. `media.side` puts the photo at
 *               the start or the end. Below 1024 the photo sits ABOVE the copy, at 4:3.
 *
 * A PRESENTATION choice, and therefore never a CMS field (docs/strapi-changes.md §1): it changes
 * how a section looks, not what it says. The template that places the band chooses it.
 */
export type ContentSectionArrangement = 'stacked' | 'beside' | 'media';

/**
 * How the head aligns (§ 3.5). `center` sets eyebrow, heading and lead centred, each on its own
 * measure, and centres the body beneath it AS A BLOCK — text inside the blocks stays start-aligned.
 * A centred head is always `stacked`, never beside, and never carries actions in its column: the
 * props union makes each of those a type error. Presentation, never a CMS field.
 *
 * `center-lg` centres from 1024 and starts below it (page-product-design fix round 1, 7 Oct 2026),
 * for a band whose body turns into a start-aligned column on a phone — a thread that runs down the
 * start edge, two contrast lists stacked. Centred at 390 over that body, the band carried two
 * alignments at once. A band whose body stays centred on a phone (a strip of marks) keeps `center`.
 */
export type ContentSectionAlign = 'start' | 'center' | 'center-lg';

/** Which inline end of the band the `media` photograph takes from 1024. Below 1024 it is always first. */
export type ContentSectionMediaSide = 'start' | 'end';

/**
 * The `media` arrangement's photograph. A record rather than a ReactNode because the CROP is the
 * arrangement's, not the caller's: 4:5 beside the copy from 1024 and 4:3 above it below (§ 3.7 item
 * 4), at the split track's `sizes`. A caller handing over a finished `<Media>` would have to know all
 * three at every call site, and the first one to forget would ship a 408-tall photo on a phone.
 *
 * A photograph (`kind: 'photograph'`), because only a photograph takes a ratio (Media, H3) and a
 * media split is "a photograph beside copy" (§ 3.2). An illustration beside copy is the hero's job.
 */
export type ContentSectionMedia = {
  image: MediaImage;
  /** Default `start` — the photo leads. Consecutive media bands on a page alternate it (§ 3.2 rule 4). */
  side?: ContentSectionMediaSide;
  /**
   * Whether a copy column that ends in a footer UNDER BLOCKS stretches to the photo and pins the
   * footer to its bottom edge (§ 3.2 rule 1). Default `true`. `false` centres that copy column on
   * the photo instead (rule 2's alignment), closing the gap between the last block and the footer to
   * the band's `stack`.
   *
   * Added in the fdn-section-head fix round (6 Oct 2026) so the owner can compare the two at 1440:
   * B with 2 tiles and a CtaRow, pinned, leaves ~180 of empty column between the tiles and the
   * footer's rule. It changes nothing where the band would centre anyway (no blocks, or no footer).
   * The default is open question 7 in docs/specs/ContentSection.md; `cmp-media-split` builds on the
   * owner's answer.
   */
  pin?: boolean;
  /**
   * What decides the photograph's height from 1024 (cmp-process-stats fix round, 6 Oct 2026).
   *
   *   ratio  its own 4:5. The copy is centred on it, or stretched to it (`pin`). The default.
   *   copy   the copy column's full height: the photo starts on the eyebrow's line and ends on the
   *          copy's last edge — a ladder's closing rule, a CtaRow — as the reference process splits
   *          pin their text to the image's two edges. A cover crop, never shorter than 4:5, so a
   *          copy column shorter than that keeps today's band. For a copy column that is a body in
   *          itself (F: the head over Steps), where a fixed 4:5 left the photo ending 50–70 short
   *          of, or past, the last row.
   *
   * Below 1024 the photo sits above the copy at 4:3 either way.
   * With the media-split photo box (cmp-media-split) `copy` also stretches the copy column and
   * caps the copy-led photo at 2:3 (--csec-media-ceiling-lg) instead of the general 3:5.
   */
  height?: ContentSectionMediaHeight;
  /**
   * Which track the photograph takes from 1024 (final fix round, 6 Oct 2026). Default `copy`.
   *
   *   copy   the photo in 5 of [5, 7], 4:5 (477 × 596 at 1470), the copy in 667. For copy that
   *          needs the width: H-full and four tiles in a 2 × 2, or a ruled list.
   *   photo  the photo in 7 of [7, 5], 6:5 (667 × 556 at 1470), the copy in 477. The photograph
   *          sets the band's weight, as Executra's and Meridian's do at ~55% of the width — for
   *          copy that is short: a head and a CtaRow, an accordion, two tiles and a CtaRow.
   *
   * Why 6:5 and not 4:5 in the 7: a 4:5 at 667 is 834 tall, past the 830 fold before the band's
   * 192 of padding. 6:5 is the tallest ratio whose band fits (556 + 192 = 748), leaving the copy
   * ~80 to grow into before the photo has to stretch with it.
   *
   * A copy-led band with two tiles and a CtaRow leaves the copy ~160 short of a 596 photo, and
   * pinning that copy to the photo's edges opens a hole in its middle; two tiles and a CtaRow take
   * `photo`, where the copy fills the photo's height and there is nothing to pin.
   */
  weight?: 'copy' | 'photo';
  /**
   * The head's scale (final fix round, 6 Oct 2026), in `ContentSectionHeadingSize`'s steps. Default
   * `xl` (the h1 role): in a media split the head is the copy column's one large element. `lg` keeps
   * the band's h2 role, for a head that would run past two lines in its track, or a copy column (an
   * accordion) that needs the height. (Until home round 5 the default was the display role and `lg`
   * was spelled `title`; display is the hero's alone since 11 Oct 2026.)
   *
   * An explicit choice rather than a rule on the heading's length, which this used to be: a hidden
   * character cutoff dropped a whole role at 23 characters for a reason no author could see, and
   * two B bands on one page set their heads at different scales. The fold is the check instead —
   * a prominent head that runs long makes its band too tall, and `npm run fold:check` fails it.
   */
  head?: 'xl' | 'lg';
  /**
   * The band's `counterweight` texture (visual-direction § 6.3): a defined field of the pixel grid
   * at the FOOT of the copy column, on the photograph's bottom edge — the copy column's mass,
   * opposite the photo, as QuantumLab's pixel strip sits under its text. When it is present the
   * copy column stretches to the photo and the field is pinned last, so the head text sits on the
   * photo's top edge and the field on its bottom edge.
   *
   * For a copy column with room for it: a head and its CtaRow, or a head and its actions. Beside
   * four tiles or a list the column is already full (594 of 596 at 1470) and the band carries
   * none. Paper only (§ 6.2); on any other surface it is dropped with a development warning.
   */
  counterweight?: boolean;
};

export type ContentSectionMediaHeight = 'ratio' | 'copy';

/**
 * The heading's type step (a component size, so a t-shirt name). The element never changes: the
 * band's place in the outline is not its scale.
 *
 * THE RULE (home round 5, owner 11 Oct 2026: "display text should only be used for heros. any other
 * section should use h1/h2 depending on the prominence it requires"):
 *
 *   xl  the h1 role (54). For the band whose HEADING is its one large thing — it opens an argument
 *       (the media split's head beside its photograph, a feature band's opener). One or two a page.
 *   lg  the section h2 (43), the default. For the band whose CONTENT is its large thing — a set, a
 *       grid, proof, a form, an FAQ. Most bands.
 *   md  the same `h2` element at the h3 role (34), for a band whose large thing would be out-sized
 *       even by an h2: the S stats band, where a 43 head over 54 mono figures read as a heading over
 *       its captions (final fix round, 6 Oct 2026 — § 3.3 "one large thing per band").
 *   eyebrow  the same `h2` element in the EYEBROW voice (mono, small, uppercase in presentation only),
 *       for a band whose large thing is one voice: the testimonial slider, where the quote carries the
 *       emphasis and a 43 head above it competed with it (owner, 29 Oct 2026;
 *       decisions/2026-10-29-quote-slider-head-is-an-eyebrow). Still the band's heading for the
 *       outline and `aria-labelledby`; the authored words are kept, only their look changes. Not with
 *       an `eyebrow` as well: two label lines would stack.
 *
 * `display` (the hero's role, ≈ 67) was a fourth step until round 5 and is retired: display belongs
 * to PageHero alone.
 */
export type ContentSectionHeadingSize = 'xl' | 'lg' | 'md' | 'eyebrow';

type ContentSectionBaseProps = {
  /**
   * The band's own anchor (`id` on the section element): a corpus band's id, so `/#faq` lands on the
   * band the content team named. Not the heading's id, which is `headingId`.
   */
  id?: string;
  /**
   * The band's `h2`, verbatim. Absent renders no heading and no seam — an untitled section is a
   * real shape in the content model (the run of blocks before the first heading), not a fault.
   *
   * A `string` and not a `ReactNode`, for the same reason CtaSection types it that way: it makes
   * a second heading impossible to smuggle into a band that already sits under a route's one h1.
   */
  heading?: string;
  /** The band's archetype for `fold:check` (§ 1.3), passed to Section's `data-band`. */
  'data-band'?: string;
  /**
   * The heading's id, and therefore the band's accessible name. Supplied by the CALLER rather
   * than generated with `useId`, because this id is also the in-page anchor a table of contents
   * links to and a URL fragment lands on — so it belongs to the content, which knows what the
   * section is called, not to the render, which does not.
   *
   * Only applied when `heading` is present. Without a heading there is nothing to name the
   * region, so the band renders as a plain `div` and takes no `aria-labelledby` it could not
   * honour.
   */
  headingId?: string;
  /** Default `lg`. See `ContentSectionHeadingSize`. */
  headingSize?: ContentSectionHeadingSize;
  /** The category label above the heading. Absent renders no element and no seam. */
  eyebrow?: string;
  /**
   * One sentence under the heading — what this section is about, before the blocks that argue it.
   *
   * Named for the type role it takes (`--text-lead`), which is the same name `PageHero` and
   * `CtaSection` give their own opening line. In a split `beside` head track it steps to
   * `--text-body-lg` from 1024 (§ 7.1: the track is 381 wide, and a 20px lead there runs five words
   * a line).
   *
   * This is the slot that makes the rhythm work. Without it the heading and the first block are
   * the only two things in the band, so a single gap step has to serve both "heading to its own
   * lead" and "lead to the evidence under it" — and those are different distances. With it, the
   * eyebrow, heading and lead group into ONE unit and the blocks are a separate beat.
   */
  lead?: string;
  /**
   * Passed through to `Section`: `strip` only. Every other band takes the one section padding
   * (owner, 7 Oct 2026).
   */
  density?: SectionDensity;
  /**
   * The `beside` tracks from 1024. `head` (default) is the narrow head track, 5 : 7 then 1 : 2 from
   * 1440 (O2). `halves` is 1 : 1 at every split width, for a body that is a short list and would
   * otherwise leave its long track half empty (owner, 1 Nov 2026, About's audiences). Read only
   * under `beside`.
   */
  split?: 'head' | 'halves';
  /**
   * The band's foot: in practice one `CtaRow` (a hairline, then a row of actions — § 3.1). It is the
   * body's last row, a `stack` (48) under the blocks (§ 1.2: body → CtaRow), in every arrangement:
   * under the blocks in `stacked`, in the body track under `beside`, and pinned to
   * the photograph's bottom edge in `media` when blocks sit above it.
   *
   * A footer is not a body on its own: `beside` with a footer and no blocks degrades to `stacked`
   * (the footer a stack under the head), because a lone CtaRow in the two-thirds track sits level
   * with the eyebrow over an empty track, a shape no § 3.4 archetype sanctions.
   *
   * WITH NO BLOCKS, PASS THE CtaRow `rule={false}`. Its hairline marks where a body ends and the ask
   * begins; with no body above it, it sits a `stack` under the lead and reads as an underline on it
   * (fix round, 6 Oct 2026). The band cannot reach into the node it is handed — a pattern does not
   * import a pattern, nor read its classes — so the caller states it, as it does under a ruled ladder.
   *
   * A slot and not a list of CtaRow props, because a pattern does not import a pattern (CLAUDE.md §
   * Scope): the caller composes `<CtaRow>` and hands it over, as `Button` takes `icon`.
   */
  footer?: ReactNode;
  /**
   * The blocks. Each becomes one row of the body stack at `--gap-stack`.
   *
   * Every block takes the full body track — the band cannot tell a paragraph from a card grid by
   * looking at a child. Running text is therefore MARKED by the caller: wrap a rich-text block in
   * `ContentSectionText` and it reads at the body measure while its siblings keep the track.
   *
   * What goes in a `beside` body: a body that reads DOWN (rows, an accordion, a record), or two pair
   * cards, or icon cards (§ 1.4 rule 5). Never a 3-up card set or a 2 × 2 image grid — a set that
   * reads across goes `stacked` or centred (1 Oct 2026, owner, on "Go deeper").
   *
   * "No blocks" is decided with `Children.toArray`, which drops `null`, `undefined` and booleans —
   * so an empty array (a CMS section with zero blocks, mapped) renders no body row and no 48 seam
   * beneath the head, the same as omitting the prop.
   */
  children?: ReactNode;
};

/* ── The axes, as a union ─────────────────────────────────────────────────────────
   Five members, and each one is a rule from visual-direction that would otherwise be a review
   comment. They discriminate on WHICH SLOTS are filled rather than on `arrangement` alone, so a
   caller that passes a union-typed arrangement (a template's `'stacked' | 'beside'` from its story)
   with no head slots matches one member outright instead of asking the compiler to split it.

     plain        no head slot: stacked or beside, start-aligned.
     centred      § 3.5 — a centred head is always stacked, never beside, and never carries actions
                  in its column (nor an aside, which only a beside head track has).
     withActions  stacked or beside, with the head's own actions. Never an aside beside
                  them: § 1.4 rule 6 — the head track takes an aside OR actions, never both (411 +
                  254 overflows the 638 a band has).
     withAside    beside only — an aside belongs to a head TRACK, and only `beside` has one.
     media        the photograph is required — a media split without one is `stacked`. Actions are
                  allowed (they sit under the lead in the copy column); an aside is not.

   `actions` and `aside` are ReactNode slots for the same reason `footer` is: the caller composes a
   CtaRow (rule off) or a Media, and this band only places them. */

type PlainProps = {
  align?: 'start';
  arrangement?: 'stacked' | 'beside';
  actions?: never;
  aside?: never;
  media?: never;
};

type CentredProps = {
  align: 'center' | 'center-lg';
  arrangement?: 'stacked';
  actions?: never;
  aside?: never;
  media?: never;
};

type WithActionsProps = {
  align?: 'start';
  arrangement?: 'stacked' | 'beside';
  /**
   * The head's own action row, a `stack` (48) under the lead (§ 1.2: lead → actions) — in practice
   * a `CtaRow` with `rule={false}`. Stacked, under the lead in the one head column; `beside`, in the
   * head track (H-beside-actions); `media`, under the lead in the copy column. Never on a centred
   * head (§ 3.5), never beside an aside (§ 1.4 rule 6), and never in a track of its own beside the
   * heading (the retired H-row, owner 7 Oct 2026).
   */
  actions: ReactNode;
  /**
   * Where the head's actions sit (owner, 7 Oct 2026). `below` (default) is the row a `stack` under
   * the lead. `end` sets them at the inline end of the heading's row from 1024, vertically centred
   * on the heading (owner, 29 Oct 2026; decisions/2026-10-29-head-end-action-centred-on-heading),
   * in a content-sized track a `column` (64) from it; the eyebrow stays above on its own line and
   * the lead sits under the row. Below 1024 they sit a `block` under the heading, above the lead.
   * Stacked only: under `beside` the head track is too narrow for a row.
   */
  actionsAt?: 'below';
  aside?: never;
  media?: never;
};

type WithActionsEndProps = {
  align?: 'start';
  arrangement?: 'stacked';
  /** See `WithActionsProps.actions`. */
  actions: ReactNode;
  /** See `WithActionsProps.actionsAt`. */
  actionsAt: 'end';
  aside?: never;
  media?: never;
};

type WithAsideProps = {
  align?: 'start';
  arrangement: 'beside';
  /**
   * The head track's one large object, a `stack` (48) under the head text: a 3:2 photograph
   * (`<Media ratio="3/2" sizes={HEAD_TRACK} />`, § 1.4 "photo aside, 3:2 at 381") or one stat-lg
   * figure (§ 3.3: D always has one). Below 1024 it sits between the head and the body (§ 3.7).
   *
   * Rendered only when the band actually splits (a head AND blocks). A degraded band has no head
   * track, so the aside is DROPPED rather than set full column: at 1240 a 3:2 photo is ~827 tall,
   * past the fold on its own, and HEAD_TRACK's `sizes` would serve it a 381-wide file, upscaled.
   */
  aside: ReactNode;
  /**
   * The aside ENDS ON THE BODY'S LAST LINE (cmp-feature fix round 1, 6 Oct 2026). From 1024 the
   * two tracks stretch to one height, and the aside takes whatever the head track has left under
   * the head text, so the photograph's foot and the grid's last line sit on one edge — a fixed 3:2
   * photo under a 240 head ran 160 past a 2×2 icon grid and left a dead quadrant. It never shrinks
   * below --csec-aside-min-size; where the body is shorter than that, the body ends first. Pass a
   * photograph that FILLS its box — `<Media fit="fill" sizes={HEAD_TRACK} />` — since the box, not
   * the asset, now owns the crop. Below 1024 the aside is that minimum height, about 3:2 at 326.
   * For a photograph only: a stat figure keeps its own height (omit the prop).
   */
  asideFill?: boolean;
  /**
   * Which inline end the head track takes from 1024 (cmp-services fix round 2). Default `start`.
   * `end` mirrors the split — the blocks lead in the 2 and the head and its aside close the row in
   * the 1 — so two beside-aside bands on one page are not the same rectangle twice (§ 8.5). Visual
   * only: the head stays first in the DOM, which is the reading order and the phone's (Layout
   * `reverse`). Below 1024 the band is stacked either way.
   */
  headSide?: 'start' | 'end';
  actions?: never;
  media?: never;
};

type MediaSplitProps = {
  align?: 'start';
  arrangement: 'media';
  /** The photograph beside the copy. Required: a media split without one is `stacked`. */
  media: ContentSectionMedia;
  actions?: ReactNode;
  aside?: never;
};

/* ── The ground, and whether a texture may sit on it ──────────────────────────────
   A second union, crossed with the first, because the rule is about the SURFACE and not the
   arrangement: § 6.2 — a texture sits on paper only. Its ink is --tex-ink per surface, so on tint or
   ink it would still render, and nothing at runtime would say it was wrong (fix round 1). The type
   says it instead: `texture` is a type error beside any `surface` other than paper. */

type GroundProps =
  | {
      /**
       * Which ground `Section` paints under this band. Passed straight through and read nowhere
       * else — this component paints nothing, so taking the prop is not the same as owning the
       * ground.
       */
      surface?: SectionSurface;
      texture?: never;
    }
  | {
      /** A textured band is a paper band (§ 6.2). */
      surface?: 'paper';
      /**
       * The band's Texture placement (visual-direction § 6): a `<Texture>` composed by the caller,
       * rendered as the band's first child so it fills the band edge to edge beneath the content. A
       * slot and not a recipe name, because the recipes are Texture's to own and a pattern takes its
       * sibling as a node. Paper only, by type (§ 6.2): beside `surface="tint"` it does not compile.
       *
       * In `media` it is shown from 1024 only (below it the photo sits above the copy). The B
       * band's own placement is NOT this slot: it is `media.counterweight`, a defined field in the
       * copy column (final fix round, 6 Oct 2026), because a band-level field in the padding read
       * as a smear and ran past the content column. Every other arrangement shows the slot at every
       * width.
       */
      texture: ReactNode;
    };

export type ContentSectionProps = ContentSectionBaseProps &
  GroundProps &
  (
    | PlainProps
    | CentredProps
    | WithActionsProps
    | WithActionsEndProps
    | WithAsideProps
    | MediaSplitProps
  );

export type ContentSectionTextProps = {
  /** The running text — in practice one `Prose`. */
  children: ReactNode;
  /**
   * How the LINES sit. Default `start`: running text is read down a start edge, and under a centred
   * head the block is centred while its text stays start-aligned (§ 3.5).
   *
   * `center` is for a coda of one to three short lines that closes a centred band after its set (a
   * band's last two sentences under three cards). Set start-aligned, such a coda sat as a ragged
   * block whose left edge lined up with nothing: not the cards' edge and not the axis the head is
   * centred on (About `who-we-work-with`, critic C3.3). Centred and balanced, it closes on the
   * head's axis. Never for paragraphs a reader has to read down: centred running text has no edge
   * to return to.
   */
  align?: 'start' | 'center';
};

/**
 * ContentSectionText — the body measure, for the rich-text blocks of a ContentSection.
 *
 * Prose has no measure, by ruling: a reading column belongs to whoever places the flow, because a
 * cap inside the primitive could only be narrowed by a caller and never widened, and half the
 * call sites are not reading columns. ContentSection is that caller for every non-long-form band,
 * and without this its text ran the whole track — about 150 characters a line stacked in the 1240
 * column, about 110 in `beside`'s two-thirds track.
 *
 * WHY A SLOT AND NOT A RULE ON THE BAND. The band receives arbitrary children, and routes hand
 * them over through keyed Fragments from a block switch, so ContentSection has no honest way to
 * know which child is text: matching on `child.type === Prose` breaks on the first Fragment, and
 * capping every child would crush a card grid or a five-column table into a reading column — the
 * exact failure the ruling removed from Prose. The one place that DOES know a block is rich text
 * is the route's `case 'rich-text'`, so that is where the mark goes, and this is the mark.
 *
 * It is a ceiling, not a width: `max-inline-size` only, no grid, no margin. The text sits at the
 * start of the track like every other block (under a centred head the BLOCK is centred and its text
 * stays start-aligned, unless `align="center"` marks it a short coda), and in a track narrower than the measure the track wins. It
 * lives in ContentSection's folder and carries its name because it means nothing outside the band —
 * a long-form route states its own reading column.
 */
export function ContentSectionText({ children, align = 'start' }: ContentSectionTextProps) {
  return (
    <div className={cx(styles.text, align === 'center' && styles.textCentred)}>{children}</div>
  );
}

/**
 * The head track against the body, in `beside`: 1 : 2 from 1440 (O2), and 5 : 7
 * from 1024 to 1439 (page-product-design fix round 2, 6 Oct 2026). At 1024 a third of the column is
 * 288, and a 43 h2 broke there into one- and two-word lines ("Relevant / Product / Design work",
 * "From the / real work / to the build") across four bands. 5 of 12 is 360, which holds the same
 * heads to two lines; the body keeps 504. The MediaSplit and the K offer already step the same way.
 * The arrangement changes at a breakpoint; no distance does.
 */
const HEAD_TRACKS = { lg: [5, 7], xl: [1, 2] };
const HALF_TRACKS = { lg: 2 };

/** A development-only warning, prefixed with the component's name. */
const warn = (message: string) => {
  if (process.env.NODE_ENV !== 'production') console.warn(`ContentSection: ${message}`);
};

/** Is there anything here to render? `Children.toArray` drops null, undefined and booleans. */
const present = (node: ReactNode) => Children.toArray(node).length > 0;

/**
 * ContentSection — one CMS section as one band, built for the shape every non-long-form page type
 * in this repo produces (services, expertise, audits, tools: see `ContentSectionText`) and for the
 * kit's band archetypes (visual-direction § 3.4): an optional eyebrow, one heading, an optional
 * lead, the head's own actions or aside, then a run of blocks and a foot.
 *
 * IT EXISTS FOR THE RHYTHM, and the rhythm is nesting rather than a knob (CLAUDE.md § Layout rule
 * 4 — tighten by grouping, loosen by separating):
 *
 *   block    (24)  eyebrow → heading → lead       the head text, one group (S1)
 *   stack    (48)  lead → actions · head → aside · head → body · block → block · body → footer
 *   section  (96)  head track → body track · photograph → copy      a split (CLAUDE.md gap rule 2)
 *
 * Inside the head, the eyebrow-to-title seam and the title-to-lead seam are the same step, so the
 * head text is one Layout — PageHero's and CtaSection's head rhythm, the one every section head in
 * the kit carries (§ 1.1, S1). Hierarchy inside the head comes from scale, not from a second gap.
 * Nothing here is a distance this file chose: every one is a gap-scale step, and none of them
 * shifts at a breakpoint. The ARRANGEMENT changes at 1024; the distances never do (CLAUDE.md § the
 * gap scale, rule 4).
 *
 * It contributes TYPE AND INK only. `Section` paints the band from the `surface` handed to it,
 * `Layout` owns every seam and every track, `Media` owns the photograph, and the blocks, actions,
 * aside and footer own themselves. There are no state tokens, which is the assertion that this
 * component's rendering is a function of its props: nothing in it responds to a pointer and
 * nothing opens.
 *
 * THREE ARRANGEMENTS × TWO ALIGNMENTS, which is what lets a page change shape at every seam (§ 1.7)
 * without a new band component: stacked, beside (with an aside or actions in the head track) and
 * media (the B split), each start-aligned, and stacked also centred. (`split-head`, the H-row, was
 * retired 7 Oct 2026: a text-only head is never split left/right.)
 * Every one is Layout's props; there is no local grid.
 *
 * Route-blind and data-blind like every pattern — it never learns that Strapi exists.
 */
export function ContentSection(props: ContentSectionProps) {
  const {
    heading,
    headingId,
    headingSize,
    eyebrow,
    lead,
    surface,
    density,
    split,
    footer,
    children,
  } = props;
  const arrangement: ContentSectionArrangement = props.arrangement ?? 'stacked';
  /* `center` centres at every width; `center-lg` from 1024 only (ContentSectionAlign). The alignment
     is stated per width below — Layout's justifyItems for `center`, a class with its own breakpoint
     for `center-lg`, because Layout's placement props hold one value for every width. */
  const centredLg = props.align === 'center-lg';
  const centredAll = props.align === 'center';
  const actions = props.actions;
  const media = props.arrangement === 'media' ? props.media : undefined;
  const texture = props.texture;

  const hasText = Boolean(eyebrow || heading || lead);
  const hasActions = present(actions);
  const hasBlocks = present(children);
  const hasFooter = present(footer);
  const hasBody = hasBlocks || hasFooter;

  /* `beside` only splits when there are two halves to split: a head (text, actions or an aside) and
     BLOCKS. A footer alone is not a trailing half — a lone CtaRow in the two-thirds track sits level
     with the eyebrow over an empty track. Either half missing and the band is the stacked band: an
     empty one-third or two-thirds track is a hole in the page, not a layout. The lead's role follows
     the SPLIT, not the prop, so a degraded band reads exactly as stacked. */
  const requestedAside = props.arrangement === 'beside' ? props.aside : undefined;
  const besideSplit =
    arrangement === 'beside' && (hasText || hasActions || present(requestedAside)) && hasBlocks;

  /* The aside belongs to the head TRACK, so it exists only when the track does. A degraded band
     drops it: set full column at 1240 a 3:2 photo is ~827 tall (past the fold by itself), and the
     HEAD_TRACK `sizes` it was placed at would serve a 381-wide file, upscaled and soft. */
  const aside = besideSplit ? requestedAside : undefined;
  const hasAside = present(aside);
  const asideFill = hasAside && 'asideFill' in props && props.asideFill === true;
  const headAtEnd = besideSplit && 'headSide' in props && props.headSide === 'end';
  const hasHead = hasText || hasActions || hasAside;
  /* Actions at the heading row's end: stacked only, and only with a heading to align to. */
  const actionsAtEnd =
    hasActions &&
    Boolean(heading) &&
    arrangement === 'stacked' &&
    'actionsAt' in props &&
    props.actionsAt === 'end';

  /* A `section` element is only honest when the band has a name. Unheaded, it is a `div` —
     an unnamed <section> is a region a screen reader announces and cannot identify. */
  const labelled = Boolean(heading && headingId);

  /* ── The head text's three parts ─────────────────────────────────────────────
     Built once, placed by the arrangement. `.centred` sets the text centred inside each part's own
     measure; the Layout holding the parts centres the parts themselves (justifyItems). */
  /* In `media` the heading takes the h1 role unless the caller set `media.head="lg"` (see
     ContentSectionMedia). The eyebrow is the same in every arrangement: its blue is the mark, not
     the label (fix round 1, 7 Oct 2026 — the media eyebrow's accent ink made one band's label blue
     and every other band's grey, which read as drift rather than a rule). */
  const inMedia = arrangement === 'media' && Boolean(media);
  const xlHead = inMedia && Boolean(heading) && media?.head !== 'lg';
  /* The counterweight is a texture, and a texture sits on paper only (§ 6.2). */
  const onPaper = (surface ?? 'paper') === 'paper';
  if (inMedia && media?.counterweight && !onPaper) {
    warn(`media.counterweight is paper-only (§ 6.2); dropped on surface="${surface}".`);
  }
  const counterweight = inMedia && media?.counterweight === true && onPaper;
  /* The eyebrow carries no mark (owner, 7 Oct 2026). A Cluster still, because its `justify` is the
     one placement prop here that takes a value per breakpoint (`center-lg`). */
  const eyebrowEl = eyebrow ? (
    <Cluster
      as="p"
      colGap="tight"
      align="center"
      nowrap
      justify={centredAll ? 'center' : centredLg ? { base: 'start', lg: 'center' } : 'start'}
      className={cx(
        styles.eyebrow,
        centredAll && styles.centred,
        centredLg && styles.centredLg,
      )}
    >
      <span>{eyebrow}</span>
    </Cluster>
  ) : null;
  const headingEl = heading ? (
    <h2
      id={headingId}
      className={cx(
        styles.heading,
        (xlHead || headingSize === 'xl') && styles.headingXl,
        headingSize === 'md' && styles.headingMd,
        headingSize === 'eyebrow' && styles.headingEyebrow,
        centredAll && styles.centred,
        centredLg && styles.centredLg,
      )}
    >
      {heading}
    </h2>
  ) : null;
  const leadEl = lead ? (
    <p
      className={cx(
        styles.lead,
        besideSplit && styles.leadBeside,
        centredAll && styles.centred,
        centredLg && styles.centredLg,
      )}
    >
      {lead}
    </p>
  ) : null;

  /* The eyebrow-to-title seam and the title-to-lead seam are the same step, so one Layout at
     `block` (24): the rhythm PageHero and CtaSection already use (S1). */
  const headText = hasText ? (
    <Layout
      rowGap="block"
      justifyItems={centredAll ? 'center' : undefined}
      className={centredLg ? styles.itemsCentredLg : undefined}
    >
      {eyebrowEl}
      {headingEl}
      {leadEl}
    </Layout>
  ) : null;

  /* The body beat: the blocks, then the foot as the last row, every seam `stack`. A Layout of its
     own rather than spreading the children into the outer one, so the head group is ONE row of the
     outer stack no matter how many blocks follow.

     Centred (§ 3.5), the body is centred AS A BLOCK: `justifyItems="center"` centres each row in
     the column, and `.bodyCentred` gives every row the full column as its width, so a row with no
     measure of its own (a card set, a table) still spans the column and a row that caps itself (an
     accordion in ContentSectionText, a centred CtaRow) sits in the middle at its cap. Without that
     width, `center` would shrink every row to its content — a card set to whatever its copy needs. */
  const body = hasBody ? (
    <Layout
      rowGap="stack"
      justifyItems={centredAll ? 'center' : undefined}
      className={centredAll ? styles.bodyCentred : centredLg ? styles.bodyCentredLg : undefined}
    >
      {children}
      {footer}
    </Layout>
  ) : null;

  let arranged: ReactNode;

  if (arrangement === 'media' && media) {
    arranged = (
      <MediaSplit
        media={media}
        headText={headText}
        actions={hasActions ? actions : null}
        blocks={hasBlocks ? <Layout rowGap="stack">{children}</Layout> : null}
        footer={hasFooter ? footer : null}
        /* § 3.2 rule 1: a copy column that ENDS in an action stretches to the photograph's height
           and pins that action to its bottom edge — but only when blocks sit between the head and
           the action (§ 3.4 B: H-full + tiles, or ≤ 2 tiles + a CtaRow). With no blocks there is
           nothing to fill the stretch, and pinning opens a 350–400 hole between the lead and the
           action at 1440; that copy column is centred on the photo instead (rule 2), as is any
           copy that does not end in an action — and any whose caller passed `media.pin: false`
           (the owner comparison, open question 7 in the spec). */
        pinFooter={hasBlocks && hasFooter && media.pin !== false}
        counterweight={counterweight}
      />
    );
  } else {
    /* stacked, beside, and every degraded case. One outer Layout; `beside` touches it only through
       Layout's own props.

         rowGap  stack (48)   head → body when the two are rows: always under `stacked`, and under
                              `beside` below 1024, which is what makes the collapse identical to
                              `stacked` rather than merely similar.
         colGap  section (96) head track → body track under `beside` — a split, two kinds of thing
                              sharing a row (CLAUDE.md § gap scale, rule 2).
         columns HEAD_TRACKS  1 : 2 from 1440 (O2), 5 : 7 from 1024, one track below. Undefined
                              when not split.
         align   start        the head is STATIC (O2): it sits at the top of its track and scrolls
                              away with the band, sized to its content rather than stretched to the
                              body's height.

       The head group is the head text, then the actions or the aside a `stack` beneath it — lead →
       actions and head → aside are both block-to-block seams (§ 1.2). */
    const headGroup = actionsAtEnd ? (
      /* Actions at the end (owner, 7 Oct 2026; centred, 29 Oct 2026 —
         decisions/2026-10-29-head-end-action-centred-on-heading): the eyebrow on its own line, then
         the heading in the fractional track and the actions in a content-sized one from 1024, ONE
         row, centred on each other; the lead under that row in the heading's track. `column` (64)
         between the tracks: two kinds of thing that must read as separate. Below 1024 one track:
         heading, actions, lead, each a `block` apart. */
      <Layout rowGap="block">
        {eyebrowEl}
        <Layout columns={{ lg: [1, 'auto'] }} colGap="column" rowGap="block" align="center">
          {headingEl}
          {actions}
          {leadEl}
        </Layout>
      </Layout>
    ) : hasActions || hasAside ? (
      /* asideFill: the head group is `auto 1fr` (pinLast) and the aside's box fills the 1fr row,
           so it ends where the stretched track ends — on the body's last line. */
      <Layout rowGap="stack" pinLast={asideFill}>
        {headText}
        {hasActions ? actions : null}
        {hasAside ? asideFill ? <div className={styles.asideFill}>{aside}</div> : aside : null}
      </Layout>
    ) : (
      headText
    );

    arranged = (
      <Layout
        rowGap="stack"
        colGap={besideSplit ? 'section' : undefined}
        columns={besideSplit ? (split === 'halves' ? HALF_TRACKS : HEAD_TRACKS) : undefined}
        align={besideSplit ? (asideFill ? 'stretch' : 'start') : undefined}
        reverse={headAtEnd ? { lg: true } : undefined}
      >
        {hasHead ? headGroup : null}
        {body}
      </Layout>
    );
  }

  return (
    <Section
      as={labelled ? 'section' : 'div'}
      id={props.id}
      surface={surface}
      density={density}
      aria-labelledby={labelled ? headingId : undefined}
      data-arrangement={arrangement}
      data-band={props['data-band']}
    >
      {/* The wrapper is unpositioned, so the Texture inside still resolves against the Section
          (its nearest positioned ancestor) and fills the whole band; it exists only to carry the
          `media` breakpoint. In flow it is an empty block of zero height above the content. */}
      {present(texture) ? (
        <div className={arrangement === 'media' ? styles.textureLg : undefined}>{texture}</div>
      ) : null}
      {arranged}
    </Section>
  );
}

/**
 * The `media` arrangement's two tracks: the photograph and the copy column (§ 3.2, § 3.4 B).
 *
 *   columns {lg: [4, 8],    `weight="copy"`: the photo in 5 (477 at 1470), the copy in 7 (667);
 *            xl: [5, 7]}    from 1024 to 1439 the copy takes 8 (page-product-design fix round 1:
 *                           at 1024 four tiles in a 504 copy column wrapped to four lines each and
 *                           B ran to 885 — the 576 of an 8 holds them to three)
 *           {lg: [7, 5]}    `weight="photo"`: the photo in 7 (667), the copy in 5 (477)
 *   colGap  section (96)    a split: copy beside an image (CLAUDE.md gap rule 2)
 *   rowGap  stack (48)      below 1024, photo above copy — a block-to-block seam
 *   reverse {lg: true}      `side="end"`: the photo moves to the end track AND keeps its width —
 *                           Layout mirrors the template with the children. Visual only: the photo
 *                           stays first in the DOM, which is the phone's order (photo above the
 *                           copy in B, § 3.7), and it carries no meaning against the copy.
 *   align   stretch|center  the copy column stretches to the photo's height when it pins something
 *                           to the photo's bottom edge (a footer under blocks, or the counterweight),
 *                           and is centred on it otherwise (§ 3.2 rules 1 and 2)
 *
 * THE PHOTO'S WEIGHT (final fix round, 6 Oct 2026). At 477 against 667 of copy the text led every
 * band and B read as a document with a picture. `weight="photo"` gives the photograph the 7, at 6:5
 * because a 4:5 at 667 is past the fold on its own (see ContentSectionMedia). Four tiles still need
 * the 667, so the copy-led band stays, for the copy that needs it.
 *
 * THE PHOTOGRAPH'S BOX HAS A FLOOR AND A CEILING. Its ratio is the floor: at 1470 a copy column
 * shorter than the photo leaves the box at exactly 4:5 (or 6:5). A taller copy column stretches the
 * box to its height so the two tracks share their top and bottom edges — which is what keeps a
 * pinned footer on the photo's bottom edge — but only up to a ceiling of 3:5 (copy-led) or 4:5
 * (photo-led). Without the ceiling, at 1024 the copy-led photo became a 360 × 706 strip (1 : 2) and
 * a two-hands crop read as an abstract blur (final fix round). Past the ceiling the copy runs on
 * below the photo, which keeps its top edge. The ceiling needs the box's own width, so the track
 * (`.photoTrack`) is an inline-size container and the box reads `cqi`.
 *
 * WHY `align-self` ON THE TRACK, and not Layout's `align`. The two tracks want different block
 * placements in one row: the photo fills the row, the copy is centred in it. `align` states one
 * placement for every item, so it cannot say both; the photo track is MediaSplit's own element,
 * styled by MediaSplit's own module beside the Layout it renders, so this is the container stating
 * its children's placement, not a child arranging itself. When the copy is pinned the whole row is
 * `stretch` anyway and the declaration agrees with it.
 *
 * THE SIZES. The photograph is cover-cropped from a master of any shape, so the image the browser
 * draws is wider than its box whenever the master is wider than the slot: a 3:2 master in a 4:5 box
 * at 477 is drawn 894 wide. `sizes` states that drawn width (mediaSplitSizes), or a landscape
 * master in the portrait slot loads the 652 derivative and is upscaled ~1.4× (final fix round).
 *
 * The copy column is head text, actions, then the body. When the footer is pinned the body — the
 * blocks AND the footer — is ONE group, pinned to the photo's bottom edge. With a counterweight the
 * body follows the head and the counterweight is pinned instead.
 */
function MediaSplit({
  media,
  headText,
  actions,
  blocks,
  footer,
  pinFooter,
  counterweight,
}: {
  media: ContentSectionMedia;
  headText: ReactNode;
  actions: ReactNode;
  blocks: ReactNode;
  footer: ReactNode;
  pinFooter: boolean;
  counterweight: boolean;
}) {
  const photoLeads = media.weight === 'photo';
  const pinned = pinFooter || counterweight;
  /* `height: 'copy'` (cmp-process-stats): the copy column stretches with the photo, which stops at
     the 2:3 copy-led ceiling rather than the general one. */
  const toCopy = media.height === 'copy';
  const body =
    blocks && footer ? (
      <Layout rowGap="stack">
        {blocks}
        {footer}
      </Layout>
    ) : (
      (blocks ?? footer)
    );
  return (
    <Layout
      columns={photoLeads ? { lg: [7, 5] } : { lg: [4, 8], xl: [5, 7] }}
      colGap="section"
      rowGap="stack"
      reverse={media.side === 'end' ? { lg: true } : undefined}
      align={pinned ? 'stretch' : 'center'}
    >
      <div className={styles.photoTrack}>
        <div className={cx(styles.photo, photoLeads && styles.photoLeads)}>
          <Media
            image={media.image}
            fit="fill"
            sizes={mediaSplitSizes(photoLeads ? 'photo' : 'copy', media.image)}
          />
        </div>
      </div>
      <Layout rowGap="stack" pinLast={pinned}>
        {headText}
        {actions}
        {body}
        {counterweight ? <TextureCounterweight /> : null}
      </Layout>
    </Layout>
  );
}
