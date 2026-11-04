import type { ReactNode } from 'react';

import { Layout, Media, type MediaFocus, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';

import styles from './Collage.module.css';

/**
 * One photograph in one tile: the record, and how this tile crops it. `focus` and `zoom` are the
 * PLACEMENT's (Media's own props): where the crop is anchored and how much closer than cover it
 * sits. They were picked per tile by the owner (3 Nov 2026) and belong to this use of the photo,
 * not to the photo, so they never go on the catalogue record.
 */
export type CollagePhoto = {
  image: MediaImage;
  focus?: MediaFocus;
  /** 1 to 2; absent is the plain cover crop. */
  zoom?: number;
};

/**
 * The six tiles, named by where they sit. A fixed composition, not a list: the collage is ONE
 * arrangement (owner, 3 Nov 2026, Direction A as revised), so every tile is required and there is no
 * way to pass five or seven.
 *
 *   lead         beside the copy, the band's big frame. Its box is at least 3:2 and grows with the
 *                copy, so a longer text makes a taller frame rather than a hole under the words.
 *   start, end   the tall frames at either end of the lower row. They take the middle's height.
 *   middle       the wide frame on top of the lower row's middle third, 3:2.
 *   middleStart,
 *   middleEnd    the two small frames under it, side by side, 3:4.
 */
export type CollagePhotos = {
  lead: CollagePhoto;
  start: CollagePhoto;
  middle: CollagePhoto;
  middleStart: CollagePhoto;
  middleEnd: CollagePhoto;
  end: CollagePhoto;
};

export type CollageProps = {
  /** The band's heading, as authored. */
  heading: string;
  /** The heading's id, for the band's `aria-labelledby`. */
  headingId?: string;
  /** Default h2: the collage is a band of its own. */
  headingAs?: 'h2' | 'h3';
  /** The words under the heading — paragraphs, as the caller renders them (Prose, plain <p>). */
  children: ReactNode;
  /** The band's way on, under the words (home: "See the studio"). The caller renders the links. */
  actions?: ReactNode;
  photos: CollagePhotos;
};

/* What each tile renders at, from Section's 1240 column and 32 gutter: the lead is the [5, 7] split's
   wider track less the section beat, a lower third is a third less two text seams, a small frame half
   of that. Below 768 the lower row stacks to the column (the viewport less the 32 gutter each side),
   the small frames halved less half a seam. */
const SIZES = {
  lead: '(min-width: 1024px) min(52vw, 667px), calc(100vw - 64px)',
  third: '(min-width: 768px) min(32vw, 403px), calc(100vw - 64px)',
  small: '(min-width: 768px) min(16vw, 194px), calc(50vw - 40px)',
} as const;

function Tile({
  photo,
  shape,
  sizes,
}: {
  photo: CollagePhoto;
  shape: 'lead' | 'tall' | 'wide' | 'small';
  sizes: string;
}) {
  return (
    <div className={cx(styles.tile, styles[shape])}>
      <span className={styles.frame}>
        <Media
          image={photo.image}
          fit="fill"
          edge="placement"
          sizes={sizes}
          focus={photo.focus}
          zoom={photo.zoom}
        />
      </span>
    </div>
  );
}

/**
 * Collage — a band's words in one corner and six studio photographs round them in an L: one large
 * frame beside the copy, then a row of three equal thirds under both, the middle third a wide frame
 * over two small ones (owner, 3 Nov 2026; mock "Studio collage", Direction A as revised).
 *
 * Every arrangement is a nested Layout, so the pattern writes no grid of its own: the lead row is a
 * split ([5, 7] from 1024, copy beside a photograph, so `section`), the photographs are one set and
 * sit `text` apart so they read as one collage rather than separate pictures. The pattern's own CSS is
 * the tiles' boxes only: a rounded clipping frame with a minimum shape, which the row stretches.
 *
 * It owns no band: the template places it in a Section and labels the Section by `headingId`.
 */
export function Collage({
  heading,
  headingId,
  headingAs = 'h2',
  children,
  actions,
  photos,
}: CollageProps) {
  const Heading = headingAs;
  return (
    <Layout rowGap="text">
      <Layout columns={{ base: 1, lg: [5, 7] }} colGap="section" rowGap="stack">
        <Layout rowGap="block">
          <Heading id={headingId}>{heading}</Heading>
          {children}
          {actions}
        </Layout>
        <Tile photo={photos.lead} shape="lead" sizes={SIZES.lead} />
      </Layout>
      <Layout columns={{ base: 1, md: 3 }} colGap="text" rowGap="text">
        <Tile photo={photos.start} shape="tall" sizes={SIZES.third} />
        <Layout rowGap="text">
          <Tile photo={photos.middle} shape="wide" sizes={SIZES.third} />
          <Layout columns={{ base: 2 }} colGap="text">
            <Tile photo={photos.middleStart} shape="small" sizes={SIZES.small} />
            <Tile photo={photos.middleEnd} shape="small" sizes={SIZES.small} />
          </Layout>
        </Layout>
        <Tile photo={photos.end} shape="tall" sizes={SIZES.third} />
      </Layout>
    </Layout>
  );
}
