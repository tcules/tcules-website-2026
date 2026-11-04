import type { ReactNode } from 'react';

import {
  Island,
  ISLAND_BAND,
  islandSurfaceOn,
  Layout,
  Section,
  Texture,
  TextureCorner,
  TextureShape,
  type IslandSurface,
  type SectionSurface,
} from '@/components';

import { cx } from '@/lib/cx';

import styles from './Statement.module.css';

/**
 * Which element carries the sentence. Never `h1`: the page's only h1 is the hero's (§ 3.4).
 *
 *   h2  the default. The statement opens a part of the page and belongs in its outline.
 *   p   a statement that only restates what the page already argues, kept out of the outline —
 *       a heading navigator would otherwise list a sentence as a section.
 *
 * The element marks the outline; the ROLE (`--text-h1`) sets the scale, whichever element it is.
 */
export type StatementElement = 'h2' | 'p';

/**
 * The texture recipe a statement may carry (§ 6.3). `head-half` is a field in the band's empty top-end
 * corner, bleeding off its top and end edges, from 1024 only, and spends the band's one blue mass
 * (§ 4.3: J with head-half — the sentence stays ink). Paper only.
 *
 *   head-half    the end-edge CORNER fade: one feathered field arriving from past the top-end corner.
 *                Start-aligned sentences.
 *   end-fade     the end-edge HORIZONTAL fade (owner, 9 Oct 2026): the field runs the band's full
 *                height along its end edge and fades toward the start, so the gradient is right to
 *                left rather than corner-in. Start-aligned sentences only — a centred sentence
 *                reaches into its feather.
 *   corner       the stepped pixel field in the top-end corner. Centred sentences.
 *   corner-pair  `corner` plus a lighter, related cluster in the bottom-start corner (owner, 9 Oct
 *                2026), so a centred band reads balanced. Centred sentences.
 */
export type StatementTexture = 'head-half' | 'end-fade' | 'corner' | 'corner-pair';

/**
 * Where the sentence sits. One column in both: the eyebrow directly above the sentence, a `block`
 * (24) apart, the action a `stack` (48) under it.
 *
 *   start   default. On the band's start edge, the sentence on its own generous measure (the title
 *           measure), the band's end left open as air.
 *   center  eyebrow, sentence and action centred on the band's axis across the full measure —
 *           Meridian's overview line. For a page whose neighbouring bands already start their
 *           content on the start edge. Pair it with `texture="corner"`, the corner being the only
 *           ground a centred sentence leaves clear.
 *
 * There is no split form (owner, 7 Oct 2026). `split` set the eyebrow alone in a one-third track,
 * ~480 from its sentence, and the band had no anchor: a label belongs to the thing it labels.
 */
export type StatementAlign = 'start' | 'center';

export type StatementProps = {
  /** Default `start`. See `StatementAlign`. */
  align?: StatementAlign;
  /** The sentence, ≤ 14 words so it holds ≤ 3 lines at the h1 role on its measure (§ 1.5). */
  children: string;
  /**
   * An optional graphic above the eyebrow: a secondary brand shape, one per band, decorative.
   * Statement sizes the slot (--stmt-graphic-size, square) and the caller supplies the shape, so
   * the shape is chosen where the page is composed (owner, 7 Oct 2026: trying the shapes is
   * Figma work). Render it aria-hidden; it says nothing the sentence does not.
   */
  graphic?: ReactNode;
  /** The label directly above the sentence. Never repeats the band before it (§ 7.3). */
  eyebrow?: string;
  /** The sentence's element. Default `h2`. */
  as?: StatementElement;
  /**
   * The band's anchor. With `as="h2"` it is the h2's id (the band's accessible name and its anchor);
   * with `as="p"` there is no heading to carry it, so it goes on the band itself — a corpus split's
   * second part (`<band>-2`, page-mapping § 3) is still a place a URL can land.
   */
  id?: string;
  /** One action under the sentence, a `stack` beneath — in practice a CtaRow, `rule={false}`. */
  actions?: ReactNode;
  /**
   * The texture (paper only; ignored with a warning on any other ground). `head-half` is § 6.3's
   * blurred field, from 1024; `end-fade` the same field run full-height down the end edge;
   * `corner` the stepped pixel field in the band's top-end corner, from 1024, clear of the type
   * (TextureCorner); `corner-pair` that plus its bottom-start partner. See `StatementTexture`.
   */
  texture?: StatementTexture;
  /**
   * The band's ground. Default `paper`, or with `island`, the other light ground from the island's
   * (a tint island on paper, a paper island on tint — `ISLAND_BAND`).
   */
  surface?: SectionSurface;
  /**
   * The island variant (13 Oct 2026): the statement on a floating box of its own ground inside the
   * band, the band's ground around it on every side (`Island`). The value is the island's surface,
   * chosen per instance; one equal to the band's is refused (no edge to read by) and takes the other
   * light ground, with a development warning.
   *
   * The texture moves INTO the island: the field arrives from past the island's edge and is cut at
   * its radius, so the band around it stays clean ground. Texture is paper only (§ 6.2), so on an
   * island it needs `island="paper"` — the bright island on a tint band. Alignment, graphic, eyebrow
   * and action are unchanged inside it.
   */
  island?: IslandSurface;
  /**
   * A picture BESIDE the sentence (4 Nov 2026, the glossary's term pages): the item's own flat
   * drawing on its plate, composed by the caller. With it the band is a split, the sentence in its
   * column and the figure in the other, a `section` (96) apart from 1024 — two regions of different
   * kind — and the figure under the sentence below it. Start-aligned only; decorative (aria-hidden),
   * the sentence carries the meaning. Absent, the band is unchanged.
   */
  figure?: ReactNode;
};

/**
 * Statement — the J band: one sentence, large, and almost nothing else.
 *
 * One column at every width: the eyebrow, then the sentence a `block` (24) beneath — the head
 * rhythm, so the label sits on the thing it labels — and the action a `stack` (48) under that.
 * Start-aligned (default) or centred (`align`). `open` density (128) — the references give a
 * statement ~1.6× the standard air, and that maps to `--gap-section-open`, never to an invented 208
 * (references § Meridian).
 *
 * One size, the h1 role: the display size was retired (owner, 7 Oct 2026: "way too big"). What
 * sets the sentence apart from a section title is its voice, not its scale — regular weight, one
 * uniform ink (the two-tone italic turn was retired, owner, 9 Oct 2026). An optional `graphic` sits a `block` above
 * the eyebrow.
 *
 * The sentence stays ink. Eyebrows carry no mark (owner, 7 Oct 2026).
 *
 * It contributes type and ink only. Section paints the band and its air, Layout owns
 * every seam, Texture owns the field.
 */
export function Statement({
  children,
  eyebrow,
  as: Tag = 'h2',
  id,
  actions,
  texture,
  surface,
  align = 'start',
  graphic,
  island,
  figure,
}: StatementProps) {
  const heading = Tag === 'h2';
  const labelled = heading && Boolean(id);
  const band: SectionSurface = surface ?? (island ? ISLAND_BAND[island] : 'paper');
  const islandSurface = island ? islandSurfaceOn(band, island) : undefined;
  /* The ground the texture sits on: the island's when there is one, else the band's. */
  const ground: SectionSurface = islandSurface ?? band;
  const onPaper = ground === 'paper';
  const textured = texture === 'head-half' && onPaper;
  const faded = texture === 'end-fade' && onPaper;
  const cornered = (texture === 'corner' || texture === 'corner-pair') && onPaper;
  const paired = texture === 'corner-pair' && onPaper;
  const centred = align === 'center';

  if (process.env.NODE_ENV !== 'production' && texture && !onPaper) {
    console.warn(
      `Statement: texture sits on paper only (§ 6.2); ignored on ${islandSurface ? 'a ' : ''}"${ground}"${islandSurface ? ' island' : ''}.`,
    );
  }

  const sentence = (
    <Tag
      id={heading ? id : undefined}
      className={cx(styles.sentence, centred && styles.centred)}
      data-copy="statement"
    >
      {children}
    </Tag>
  );

  /* One column either way. The eyebrow-to-sentence seam is the head rhythm's `block`, the
     sentence-to-action seam the band's `stack`. Centred, Layout centres each part on the field's
     axis; start-aligned, every part keeps the start edge. */
  const words = (
    <Layout rowGap="stack" justifyItems={centred ? 'center' : undefined}>
      <Layout rowGap="block" justifyItems={centred ? 'center' : undefined}>
        {graphic ? (
          <div className={styles.graphic} aria-hidden="true">
            {graphic}
          </div>
        ) : null}
        {eyebrow ? (
          <p className={styles.eyebrow} data-copy="eyebrow">
            {eyebrow}
          </p>
        ) : null}
        {sentence}
      </Layout>
      {actions ?? null}
    </Layout>
  );

  const content = (
    <>
      {textured ? (
        /* head-half, as § 6.3 specifies it (fix round 2): one rect at top −200, end −120, 34% × 296,
           blur 160, on the FIELD — the band's padding box, or the island's when there is one (Island
           is positioned and clips to its radius as the band does). The box runs off the field's top
           edge and past its end edge and stops 96 into it, inside the 96–128 of air above the
           content, so it clears the sentence box at every width from 1024; only the feather reaches
           the sentence's first line, at the strength limit 2 allows. Anchored to two edges, it reads
           as atmosphere arriving from outside rather than as an object set in it — the first two
           builds hung a field mid-track under the eyebrow, and with no edge to bleed from it read as
           a smudge. A direct child of the field, so nothing here restates its padding. From 1024
           only (§ 6.3: below 1024, none). */
        <Texture className={styles.texture}>
          <TextureShape top={-200} right={-120} width="34%" height={296} blur={160} />
        </Texture>
      ) : null}
      {faded ? (
        /* end-fade: head-half's rect, its horizontal geometry unchanged (end −120, 30% wide, blur
           160), but run from −50% to 150% of the field's height, so the blur's vertical falloff lands
           outside the field and is clipped: the grid is at full strength from top edge to bottom
           edge along the end, and fades only toward the start. 30% rather than 34% so the feather
           stops short of a start-aligned sentence on its title measure at 1024. From 1024 only. */
        <Texture className={styles.texture}>
          <TextureShape top="-50%" right={-120} width="30%" height="200%" blur={160} />
        </Texture>
      ) : null}
      {cornered ? <TextureCorner /> : null}
      {paired ? <TextureCorner at="bottom-start" /> : null}
      {/* With a figure, the split: the words in one column, the drawing in the other. */}
      {figure && !centred ? (
        <Layout
          columns={{ base: 1, lg: [1, 1] }}
          colGap="section"
          rowGap="stack"
          align="center"
        >
          {words}
          <div className={styles.figure} aria-hidden="true">
            {figure}
          </div>
        </Layout>
      ) : (
        words
      )}
    </>
  );

  return (
    <Section
      as={labelled ? 'section' : 'div'}
      surface={band}
      aria-labelledby={labelled ? id : undefined}
      id={heading ? undefined : id}
      data-band="J"
      data-arrangement={islandSurface ? 'island' : undefined}
    >
      {/* The island variant: the same content on a box of its own ground, with the band's air around
          it. The island is the field the texture fills, so the band outside it carries none. */}
      {islandSurface ? <Island surface={islandSurface}>{content}</Island> : content}
    </Section>
  );
}
