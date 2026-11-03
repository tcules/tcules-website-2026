import type { ComponentProps, CSSProperties } from 'react';

import { Layout } from '@/components';

import {
  BlockCard,
  type BlockCardCtaEmphasis,
  type BlockCardCue,
  type BlockCardFrame,
  type BlockCardImage,
  type BlockCardLinkScope,
  type BlockCardProps,
  type BlockCardSize,
  type BlockCardTextureRecipe,
  type BlockCardTitleElement,
  type BlockCardTracks,
} from './BlockCard';
import styles from './BlockCardSet.module.css';

/**
 * One card in a set: a BlockCard record with an `id` for its key, and WITHOUT the presentation
 * props. Orientation, image side, track count, type size, crop, index, cue and title element
 * describe a card's place among its siblings, which is exactly what the set knows and the card
 * does not — so the set decides them and a caller cannot contradict it one item at a time.
 */
export type BlockCardSetItem = Omit<
  BlockCardProps,
  | 'orientation'
  | 'imageSide'
  | 'tracks'
  | 'size'
  | 'index'
  | 'cue'
  | 'titleAs'
  | 'frame'
  | 'linkScope'
  | 'ctaEmphasis'
> & {
  id: string;
};

/**
 * Whether the first item is featured.
 *
 *   auto  from FEATURED_FROM items the first card takes the horizontal row above its peers
 *         (ruling C3, 28 Sep 2026). The case-study index's shape, and the default.
 *   none  never. Every feature band of PEERS passes it (visual-direction § 1.4 rule 4): a
 *         featured row would make one option look recommended.
 *   beside  the spotlight (cmp-feature fix round 1, 6 Oct 2026): from 1024 the first card takes a
 *         2:1 track at the one 16:9 crop and the `lg` step, and the rest stack beside it as TEXT cards — hairline,
 *         index or eyebrow, title, body. For a band that has one thing to show and two to note (an
 *         insight with its two follow-ups, a case study with two notes from it), where a row of
 *         equal tiles would read as one rectangle three times. Their covers are dropped, never
 *         stood in: the companions are notes by design, so the lead is the one image in the band.
 *         Three items is the shape; up to six works. Below 1024 it is the stack, lead first.
 *         The lead's cover is 16:9 like every cover (home round 3); it no longer grows to meet
 *         taller notes, because a grown cover is a crop nobody authored.
 *   wide  the wide lead in a row (cmp-feature fix round 2, 6 Oct 2026): from 1024 three covered
 *         cards in [2, 1, 1] tracks, every cover 16:9 (home round 3), so the lead's cover is twice
 *         the others' — size contrast in one row, where three equal tiles read as one rectangle
 *         three times. It was 2:1 beside two squares, one height across; the standard ratio gave
 *         that up. The lead takes `lg`, the others `sm` (a 294 track).
 *         Exactly three items with covers; any other count, or a set without covers, renders as
 *         `none`. Below 1024 it is the ordinary three-card set at 16:9.
 */
export type BlockCardSetLead = 'auto' | 'none' | 'beside' | 'wide';

/** How many tracks the set reaches at its widest. See `peerGrid`. */
export type BlockCardSetAcross = 2 | 3 | 4;

export type BlockCardSetProps = {
  /** The cards, in order. Zero renders nothing — no empty list. */
  items: readonly BlockCardSetItem[];
  /** Whether the first item is featured. Default `auto`. See `BlockCardSetLead`. */
  lead?: BlockCardSetLead;
  /**
   * The widest track count, when the count alone would pick the wrong one: a set in a `beside`
   * body (763 wide) takes `2`, because four icon cards across 763 would be 167 each; a set of six
   * the caller wants as two rows of three takes `3`. Absent, the count decides (`peerGrid`).
   */
  across?: BlockCardSetAcross;
  /**
   * The peers' type step, when the caller knows better than the track width. Absent, the set
   * decides (`peerSize`): icon cards `sm`, text cards `md`, image cards by their track.
   */
  size?: BlockCardSize;
  /**
   * What a MIXED set — some items with a cover, some without — does about the missing ones
   * (visual-direction § 3.1: a set is all-image or all-text, never one with holes):
   *
   *   images  stand-in covers, taken in order, one per item that lacks one (§ 5.7). Each is
   *           marked `standIn` and never labelled on the page. Too few for the gap and the set
   *           falls back to text, because a set with one missing frame is the bug this prevents.
   *           A set with NO covers at all takes them too when the pool covers every item — the
   *           resources band (M) before real covers exist; with too short a pool it stays text.
   *   false   no stand-ins: every card drops its media and the set renders as C-text.
   *
   * Absent behaves as `false`. An all-image set ignores it. Icon cards are not missing a cover —
   * an item with an `icon` and no image is never given a stand-in.
   *
   *   texture  every missing cover is the card's own texture cover (BlockCard `media.type`
   *           'texture'), the three fields in turn, with the item's `icon`, if it has one, on it.
   *           For artefacts with no cover yet — the resources band (M): the brand's own surface
   *           rather than a stock photograph that says nothing about the file. Never runs short.
   */
  standIns?: readonly BlockCardImage[] | 'texture' | false;
  /**
   * Number the cards `01`, `02` … above their titles, in blue mono — the text card's index
   * (§ 3.1: hairline, 24, then an index or an eyebrow). Default false.
   */
  numbered?: boolean;
  /** How every linked card says it navigates. Absent, each card's own default. See `BlockCardCue`. */
  cue?: BlockCardCue;
  /**
   * Every card's finish (owner, 7 Oct 2026). `box` insets each card's copy by a `block` and paints
   * a ground under the pointer, with no edge (owner, 9 Oct 2026); see `BlockCardFrame`. A set's decision, never one card's: a set with one boxed card
   * and five open ones reads as a recommendation. Boxed rows sit a `gutter` apart, not a `stack` or
   * a `column`: each card's own 24 inset is the separation, so the seam down the grid matches the
   * seam across it.
   * Default `none`.
   */
  frame?: BlockCardFrame;
  /**
   * What every linked card's `href` makes clickable (page-mapping G3b). `card` (default) the whole
   * frame; `cta` only the cta Button, for a set whose bodies carry links of their own. A set's
   * decision, like `frame`.
   */
  linkScope?: BlockCardLinkScope;
  /** How every cta-scoped card's action is drawn. A set's decision. See `BlockCardCtaEmphasis`. */
  ctaEmphasis?: BlockCardCtaEmphasis;
  /**
   * The cards' heading element. Default h3, under a band's h2. `h2` only where the set IS the
   * page's list directly under its h1 (the case-study index), so the outline does not skip h2.
   */
  titleAs?: BlockCardTitleElement;
  /**
   * From 1024 the even cards drop by the section step (Layout `stagger`), so a pair reads as
   * placed rather than tiled — references.md § 3.4's integration cards, text beside a staggered
   * pair. One row only: a pair or a trio. Ignored with a featured lead (`auto` from four, `beside`,
   * `wide`). Budget it: the row grows by 96.
   */
  stagger?: boolean;
  /**
   * The list's accessible name, for the one case the list is itself a tab stop: an unlinked
   * covered set of three or more, which scrolls sideways on a phone and takes `tabIndex` so a
   * keyboard can reach it (WCAG 2.1.1). A focusable list with no name is an unlabelled stop, so
   * that case warns in development without one. Ignored everywhere else — a linked row's stops are
   * its cards, and a list that is not focusable is named by the band's heading.
   */
  label?: string;
  /**
   * The phone row (page-product-design fix round 1, 7 Oct 2026). `auto` (default) scrolls a linked
   * set of four or more and a covered set of three or more sideways below 768 (§ 3.7 item 2).
   * `never` keeps the set stacked: for a ROUTER, whose job is to show every route at once — as a
   * scroll row it showed one and a fifth of six services above a progress bar, and hid five of them
   * behind a gesture.
   */
  scroll?: 'auto' | 'never';
  /**
   * The phone arrangement (home round 1, 10 Oct 2026). `auto` (default): `scroll` decides — a scroll
   * row, or one card per row. `pair`: two across below 768, never a scroll row, for a set of SHORT
   * covered cards whose titles are their whole content — the home page's eight sectors, where eight
   * stacked cards ran ~2900 tall at 390 and a scroll row hid seven of them behind a gesture. Two
   * across from md as well when the set would otherwise be one track there.
   */
  phone?: 'auto' | 'pair';
};

/** From how many items the first one is featured (ruling C3, 28 Sep 2026), under `lead="auto"`. */
export const FEATURED_FROM = 4;

/** From how many tracks across the image cards step down to `sm` (visual-direction § 7.2). */
export const SMALL_FROM = 4;

type Columns = ComponentProps<typeof Layout>['columns'];

/**
 * The grid for the peers — the items the featured card leads, or the whole set when nothing is
 * featured. Every shape is one track below md (or a scroll row: see the component).
 *
 *   across 2   two from md. Pairs, and any set in a beside body.
 *   across 3   two from md, three from lg, for five and more (rows of three); a set of exactly
 *              three is three across from md, so it never leaves an orphan on a second row.
 *   across 4   two from md, four from lg: 2×2 at 768 to 1023, one row from 1024.
 *
 * By count when `across` is absent: 1–2 → 2, 4 → 4, otherwise 3.
 *
 * `tracks` is the widest count the shape reaches before xl, which is what the image `sizes` must
 * never under-fetch for; the four-across row at xl reads the two-track value and over-fetches.
 */
function peerGrid(
  count: number,
  across: BlockCardSetAcross | undefined,
  pair = false,
  controls = false,
): { columns: Columns; tracks: BlockCardTracks; widest: BlockCardSetAcross } {
  const widest = across ?? (count <= 2 ? 2 : count === 4 ? 4 : 3);
  /* The phone pair: two across from the base up, the set's widest from lg (or md for three). */
  if (pair) {
    if (widest === 2) return { columns: { base: 2 }, tracks: 2, widest };
    if (widest === 4) return { columns: { base: 2, lg: 4 }, tracks: 2, widest };
    return { columns: { base: 2, lg: 3 }, tracks: 3, widest };
  }
  if (widest === 2) return { columns: { base: 1, md: 2 }, tracks: 2, widest };
  /* Four across from lg, not xl (cmp-feature fix round 2): at 1024 the 2×2 put 460-wide 16:9
     photographs in a band 1140 to 1300 tall — an image wall larger than anything at 1440. Four at
     216 hold the row's shape; the `sm` step is already the four-across one. */
  /* Tiles that end on a labelled control (frame="tile", the contact routes, owner 3 Nov 2026) hold
     four across only from xl: at 1024 a 216 track is narrower than a mailbox as a button label, which
     must not wrap or spill. Below xl they sit two by two. */
  if (widest === 4 && controls) return { columns: { base: 1, md: 2, xl: 4 }, tracks: 2, widest };
  if (widest === 4) return { columns: { base: 1, md: 2, lg: 4 }, tracks: 2, widest };
  /* Exactly three: three across from md (cmp-services fix round 1). Two from md put the third card
     alone on a second row beside an empty cell at 768 to 1023, an orphan in every three-card
     router. Five and more keep two from md: their rows are full or end on a pair. */
  if (count === 3) return { columns: { base: 1, md: 3 }, tracks: 3, widest };
  return { columns: { base: 1, md: 2, lg: 3 }, tracks: 3, widest };
}

const hasCover = (item: BlockCardSetItem) =>
  item.media !== undefined &&
  (item.media.type !== 'image' || Boolean(item.media.image.src.trim()));

/**
 * The peers' type step (§ 7.2), decided by TRACK WIDTH, not by count (cmp-feature, 6 Oct 2026).
 *
 * The count used to decide it — four peers or more stepped to `sm` — which put six or eight image
 * cards in a 3-up grid (392 wide, or a Slider showing three) at h5, when § 1.4's Card-3, which
 * the band is budgeted on, is h4 at 392. A title's line length depends on the track it runs in, so
 * the step follows the track:
 *
 *   icon cards          sm   h5 + body-sm at any width: the icon is the head object (§ 1.4).
 *   text-only cards     md   h4 at any count: the title is the card's only object (§ 3.1).
 *   image, 4 across     sm   286 wide at 1470 — h4 there set five words a line.
 *   image, 2–3 across   md   365 to 392 (and a Slider of three), the Card-3 and Card-pair step.
 */
function peerSize(
  peers: readonly BlockCardSetItem[],
  widest: BlockCardSetAcross,
  covered: boolean,
): BlockCardSize {
  if (peers.length > 0 && peers.every((item) => !hasCover(item) && item.icon !== undefined)) {
    return 'sm';
  }
  if (!covered) return 'md';
  return widest >= SMALL_FROM ? 'sm' : 'md';
}

/**
 * Settle a mixed set before it renders (§ 3.1): fill every missing cover from the stand-ins, in
 * order, or — with no pool, or too short a one — drop every cover so the set is C-text.
 */
function settleMedia(
  items: readonly BlockCardSetItem[],
  standIns: readonly BlockCardImage[] | 'texture' | false | undefined,
): readonly BlockCardSetItem[] {
  const covered = items.filter(hasCover).length;
  if (covered === items.length) return items;
  if (standIns === 'texture') {
    let n = 0;
    return items.map((item) =>
      hasCover(item)
        ? item
        : { ...item, media: { type: 'texture', recipe: (n++ % 3) as BlockCardTextureRecipe } },
    );
  }
  if (items.every((item) => !hasCover(item) && item.icon !== undefined)) return items;

  const missing = items.length - covered;
  const pool = standIns === false || standIns === undefined ? [] : standIns;

  if (pool.length < missing) {
    return covered === 0 ? items : items.map((item) => ({ ...item, media: undefined }));
  }

  let next = 0;
  return items.map((item) => {
    if (hasCover(item)) return item;
    const image = pool[next++];
    return image
      ? { ...item, media: { type: 'image', image: { ...image, standIn: true } } }
      : item;
  });
}

function warnUnnamed() {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'BlockCardSet: an unlinked covered set scrolls on a phone and is a tab stop; pass `label` to name it.',
    );
  }
}

/**
 * BlockCardSet — a set of BlockCards, and the one place that knows how many there are.
 *
 * A card does not know its siblings (spec § 10), so the rules that depend on the set live here:
 * the grid shape, the image `sizes`, the type step (every cover is 16:9, home round 3), mixed-set handling, numbering, the phone scroll row, and — under
 * `lead="auto"` from four items (ruling C3) — the featured first card: horizontal, spanning the
 * row above its peers, media beside copy when it has a cover and head beside body when it does not.
 *
 * It is ONE list and ONE grid. The lead's span is Layout's `lead`, the container's statement about
 * its first child, so a screen reader hears "list, five items" rather than two lists, and the
 * peers' `equalRows` is not stretched to the featured row's height.
 *
 * On a phone a covered set of three or more, and any linked set of four or more, scrolls sideways
 * (§ 3.7 item 2: Layout `scroll="until-md"`, one card per view with the next peeking). Linked, Tab
 * moves the row card by card; unlinked, the row itself is the tab stop and the arrow keys move it,
 * because a scroll row nobody can reach fails WCAG 2.1.1. Short text and icon sets stay stacked, as
 * does a set under a featured lead (the case-study index), a page's list rather than a band's row.
 *
 * A set of five or more IMAGE cards in a feature band is a Slider showing three (§ 1.4 rule 3). The
 * Slider is composed by the caller around BlockCards; this set never imports it, because a pattern
 * does not import a pattern.
 *
 * It lives beside BlockCard, in the same pattern folder, because it renders nothing but BlockCards
 * and a Layout: it is the pattern's own set, not a second pattern.
 */
export function BlockCardSet({
  items: given,
  lead = 'auto',
  across,
  size: sizeOverride,
  standIns,
  numbered = false,
  cue,
  frame,
  linkScope,
  ctaEmphasis,
  titleAs,
  stagger = false,
  label,
  scroll = 'auto',
  phone = 'auto',
}: BlockCardSetProps) {
  if (given.length === 0) return null;

  /* The spotlight settles its own media: the lead keeps its cover, the companions are notes. */
  const spotlight = lead === 'beside' && given.length >= 2;
  const items = spotlight
    ? given.map((item, i) => (i === 0 ? item : { ...item, media: undefined }))
    : settleMedia(given, standIns);
  if (spotlight) {
    return (
      /* [2, 1] from lg with the lead spanning every row (Layout lead="tall"); the companions sit a
         `column` apart down the track, as rows do everywhere in a set, and a `gutter` from the lead.
         No equalRows: it holds at every width, and on a phone it gave each short note the lead's
         full height. Content-sized rows share whatever height the lead has over them. Below lg,
         one track: lead first, then the notes. */
      <Layout as="ul" columns={{ lg: [2, 1] }} colGap="gutter" rowGap="column" lead="tall">
        {items.map(({ id, ...card }, index) =>
          index === 0 ? (
            <BlockCard
              key={id}
              {...card}
              cue={cue}
              frame={frame}
              linkScope={linkScope}
              ctaEmphasis={ctaEmphasis}
              titleAs={titleAs}
              index={numbered ? 1 : undefined}
              size="lg"
            />
          ) : (
            <BlockCard
              key={id}
              {...card}
              cue={cue}
              frame={frame}
              linkScope={linkScope}
              ctaEmphasis={ctaEmphasis}
              titleAs={titleAs}
              index={numbered ? index + 1 : undefined}
              size="md"
            />
          ),
        )}
      </Layout>
    );
  }
  /* The wide lead: three covered cards in [2, 1, 1] from lg, one cover height across the row. */
  if (lead === 'wide' && items.length === 3 && items.every(hasCover)) {
    const linkedRow = items.every((item) => Boolean(item.href?.trim()));
    if (!linkedRow && !label) warnUnnamed();
    return (
      /* Rows of the base and md stacks a `column` apart, as every set; columns a `gutter`. On a
         phone the three covered cards scroll, as any covered set of three does. */
      <Layout
        as="ul"
        columns={{ base: 1, md: 2, lg: [2, 1, 1] }}
        colGap="gutter"
        rowGap="column"
        equalRows
        scroll="until-md"
        tabIndex={linkedRow ? undefined : 0}
        aria-label={linkedRow ? undefined : label}
      >
        {items.map(({ id, ...card }, index) => (
          <BlockCard
            key={id}
            {...card}
            cue={cue}
            frame={frame}
            linkScope={linkScope}
              ctaEmphasis={ctaEmphasis}
            titleAs={titleAs}
            index={numbered ? index + 1 : undefined}
            tracks={index === 0 ? 2 : 3}
            size={index === 0 ? 'lg' : 'sm'}
          />
        ))}
      </Layout>
    );
  }
  const featured = lead === 'auto' && items.length >= FEATURED_FROM;
  const peers = featured ? items.slice(1) : items;
  const covered = items.some(hasCover);
  const pair = phone === 'pair';
  const { columns, tracks, widest } = peerGrid(peers.length, across, pair, frame === 'tile');
  const iconSet = !covered && items.every((item) => item.icon !== undefined);
  /* Icon cards are h5 and body-sm, always (§ 1.4; the glyph is the h5's em, on its own row above it, 9 Oct 2026). `size` is not an
     option for them: an override set one grid's titles a step above the next one's on one page. */
  const size = iconSet ? 'sm' : (sizeOverride ?? peerSize(peers, widest, covered));
  const linked = items.every((item) => Boolean(item.href?.trim()));
  /* The phone row (§ 3.7 item 2, revised in cmp-feature fix round 1, 6 Oct 2026). Stacked at 390,
     a set of short covered cards read as a loose list — 80 to 90 between cards, and six linked icon
     cards ran to 1805. So below 768:

       covered, three or more   scrolls, linked or not. One card in view, the next peeking. An
                                unlinked row holds nothing focusable, so the ROW takes the tab stop
                                (Layout tabIndex, WCAG 2.1.1) and the arrow keys move it.
       linked, four or more     scrolls, whatever the cards hold — icon cards included, so six
                                linked services are one swipeable row, not a 1800px column.
       otherwise                stacked: three or fewer text or icon cards, or unlinked ones, which
                                are short enough to read down.

     Never under a featured lead: Layout ignores `lead` wherever `scroll` is set (a scroll row has
     no grid to span), and it reads the prop, not the breakpoint — so a scrolling index would lose
     its featured row at every width. The case-study index is a page-long list, read stacked. */
  const scrolls =
    scroll === 'auto' &&
    !pair &&
    !featured &&
    ((covered && items.length >= 3) || (linked && items.length > 3));
  /* Icon cards are smaller objects than covered or text tiles — an h5 led by its glyph and two lines —
     and at a `column` (64) apart a stacked 2×2 read as four loose items. They sit a `stack` (48)
     apart down the grid: the block-to-block step, still clearly more than the 16 inside a card. */
  const rowGap = frame === 'box' || frame === 'tile' ? 'gutter' : iconSet ? 'stack' : 'column';
  /* Icon rows are pinned to their content: no equalRows (fix round 2). Under a stretched beside
     body the 1fr rows took the tallest card's height, so a row of three-line bodies left 80 above
     the next icon and a row of two-line ones 53 — two beats in one grid. Cards in a row still share
     its height (stretch); the seam down the grid is exactly `stack`. Icon cards carry no pinned
     cta, which is the only thing equal rows were for.
     A borderless set is sized per row too (owner, 2 Nov 2026, /expertise: "could the height be per
     row and not for the entire grid?"): with no box, a short row's slack under 1fr rows only
     widened the seam below it past `column`. Cards in one row still share its height (Layout's
     default stretch), so a pinned cta stays level along the row. Only a boxed set, whose boxes are
     seen, keeps every row the tallest one's height. */
  const equalRows = (frame === 'box' && !iconSet) || frame === 'tile';
  const staggered = stagger && !featured && peers.length <= widest;
  const tabStop = scrolls && !linked;
  if (tabStop && !label) warnUnnamed();

  const grid = (
    /* Rows sit a `column` apart, columns a `gutter` (29 Sep). The two seams separate different
       things: across a row the cards are peers read together, and down the grid each row is the
       next set of objects, which must read as separate — the `column` step's own job, turned to
       the block axis. At one shared 32 a borderless tile's copy ran into the image below it;
       `stack` (48) was tried and still read as one field. */
    <Layout
      className={scrolls ? styles.row : undefined}
      as="ul"
      columns={columns}
      colGap="gutter"
      rowGap={rowGap}
      equalRows={equalRows}
      lead={featured}
      stagger={staggered}
      scroll={scrolls ? 'until-md' : undefined}
      tabIndex={tabStop ? 0 : undefined}
      aria-label={tabStop ? label : undefined}
    >
      {items.map(({ id, ...card }, index) => {
        const shared = {
          index: numbered ? index + 1 : undefined,
          cue,
          frame,
          linkScope,
          ctaEmphasis,
          titleAs,
        };
        return featured && index === 0 ? (
          <BlockCard
            key={id}
            {...card}
            {...shared}
            orientation="horizontal"
            imageSide="left"
            size="lg"
          />
        ) : (
          <BlockCard key={id} {...card} {...shared} tracks={tracks} size={size} />
        );
      })}
    </Layout>
  );

  if (!scrolls) return grid;

  /* The phone row's progress rail (cmp-services fix round 2; BlockCardSet.module.css): a `stack`
     under the cards, the Slider's row-to-controls seam, so the two kinds of sideways row read as one
     family. Hidden from md, where the row is a grid; a hidden item draws no gap. */
  return (
    <Layout
      rowGap="stack"
      className={styles.scope}
      style={{ '--blockcardset-count': items.length } as CSSProperties}
    >
      {grid}
      <span className={styles.rail} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </Layout>
  );
}
