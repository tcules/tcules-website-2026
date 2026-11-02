import type { ReactNode } from 'react';

import { Button, Cluster, Icon, Layout, Sketch } from '@/components';
import { cx } from '@/lib/cx';
import type { SketchName } from '@/lib/sketches';

import styles from './Bento.module.css';

/** One tile: where it goes, what it is called, the line that says what it is, and its drawing. */
export type BentoItem = {
  id: string;
  /** The destination's name ("Product Design"). The tile's heading. */
  title: string;
  /**
   * One or two lines on what it is. Plain text, about 60–90 characters: a tile is not a page.
   * Optional (component-map C11/C17): a set whose copy names each destination and says nothing more
   * (home's "One studio" row of four services) is title and drawing alone. Give every tile a body or
   * none, so the set reads as one.
   */
  body?: string;
  /** The whole tile is the link. */
  href: string;
  /** The destination's own Sketch scene, drawn bare on the tile's texture. */
  scene: SketchName;
  /**
   * Tracks the tile takes from 1024: 1 (default) or 2. A wide tile puts its drawing beside its words
   * and takes a size up for both. Each row of four tracks must fill exactly: 2 + 1 + 1, 1 + 1 + 2,
   * 1 + 1 + 1 + 1 or 2 + 2.
   */
  span?: 1 | 2;
};

export type BentoCtaAction = { label: string; href: string };

/**
 * One route out of the set: a question, the sentence that answers it (plain text, verbatim), its actions.
 * A closing statement with no question is a route with no `question`: its sentence takes the title role.
 */
export type BentoCtaRoute = {
  question?: string;
  answer?: string;
  actions: readonly BentoCtaAction[];
};

export type BentoCta = { routes: readonly BentoCtaRoute[] };

export type BentoProps = {
  /** The tiles, in reading order. Built for six on two rows: two wide, four single. */
  items: readonly BentoItem[];
  /** The tiles' heading element. Default h3, under a band's h2. */
  titleAs?: 'h2' | 'h3';
  /**
   * Tracks from 1024. `4` (default): home's two sizes. `3`: a set of PEERS, every tile one size, three
   * a row (owner, 26 Oct 2026, the specialist services: "we can't weigh any 2 items heavier"); spans
   * are ignored.
   */
  tracks?: 3 | 4;
  /**
   * A TEXT CELL after the tiles: the band's closing words in the grid's own last row, where the tiles
   * leave a hole (owner, 29 Oct 2026, /services/product-design: seven services on four tracks, 4 + 3,
   * "the band's closing paragraph sits in the empty eighth cell"). Unframed, no texture, not a link:
   * it reads as the row's last word, never as an eighth destination. It takes every track the last
   * row leaves, or a whole row when the tiles fill theirs. Inline content the caller renders (its
   * links included).
   */
  note?: ReactNode;
  /**
   * The band's closing routes as CTA cards after the tiles, ONE card per route, each a normal grid
   * cell: a dotted outline and no fill, no texture, no lift, not itself a link. Every card is its
   * question, its sentence, then its destinations as arrow links. The caller picks `tracks` so tiles
   * plus cards fill whole rows where 3 or 4 can; where neither does, the last card takes every track
   * its row leaves (owner, 30 Oct 2026).
   */
  cta?: BentoCta;
};

type Placed = { item: BentoItem; row: number; col: number; span: 1 | 2 };

/** Each tile's row and first track on the grid, read from the spans in order. */
function place(items: readonly BentoItem[], TRACKS: 3 | 4): Placed[] {
  let row = 0;
  let col = 0;
  return items.map((item) => {
    const span = TRACKS === 3 ? 1 : (item.span ?? 1);
    if (col + span > TRACKS) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `Bento: row ${row + 1} does not fill its ${TRACKS} tracks before "${item.title}".`,
        );
      }
      row += 1;
      col = 0;
    }
    const placed = { item, row, col, span };
    col += span;
    if (col === TRACKS) {
      row += 1;
      col = 0;
    }
    return placed;
  });
}

/**
 * One CTA card: one route, its question as the title, its sentence, then its destinations as arrow
 * links pinned to the card's foot, so the links of cards sharing a row sit on one line. Every card has
 * this one structure (owner, 30 Oct 2026: one dotted card per question).
 */
function CtaCard({ route }: { route: BentoCtaRoute }) {
  if (process.env.NODE_ENV !== 'production' && route.actions.length === 0) {
    console.warn('Bento: a CTA card has no action.');
  }
  return (
    <Layout className={styles.fill} rowGap="block" pinLast={route.actions.length > 0}>
      <Layout rowGap="tight">
        {route.question ? (
          <>
            <p className={styles.ctaTitle}>{route.question}</p>
            {route.answer ? <p className={styles.ctaBody}>{route.answer}</p> : null}
          </>
        ) : route.answer ? (
          <p className={styles.ctaTitle}>{route.answer}</p>
        ) : null}
      </Layout>
      {route.actions.length > 0 ? (
        <Layout rowGap="tight">
          {route.actions.map((action) => (
            <Button
              key={action.href}
              as="a"
              href={action.href}
              emphasis="link"
              tone="primary"
              size="md"
              icon={<Icon name="arrow-right" />}
            >
              {action.label}
            </Button>
          ))}
        </Layout>
      ) : null}
    </Layout>
  );
}

/** One tile's link: its words and its drawing, stacked, or side by side when it is wide. */
function TileLink({
  item,
  wide,
  Title,
}: {
  item: BentoItem;
  wide: boolean;
  Title: 'h2' | 'h3' | 'h4';
}) {
  const words = (
    <Layout rowGap="tight">
      <Title className={styles.title}>{item.title}</Title>
      {item.body ? <p className={styles.body}>{item.body}</p> : null}
    </Layout>
  );
  const art = (
    <div className={styles.art}>
      <Sketch name={item.scene} frame="bare" story />
    </div>
  );
  return (
    <a href={item.href} className={styles.tile}>
      {wide ? (
        <Layout
          className={styles.fill}
          columns={{ base: 1, md: [1, 1] }}
          colGap="gutter"
          rowGap="block"
        >
          {words}
          {art}
        </Layout>
      ) : (
        <Layout className={styles.fill} rowGap="block" pinLast>
          {words}
          {art}
        </Layout>
      )}
    </a>
  );
}

export type ServiceTileProps = {
  /** The destination's name ("Design Systems", "B2B SaaS and workflow software"). The tile's heading. */
  title: string;
  /** The whole tile is the link. */
  href: string;
  /**
   * The line over the title, in the mono label voice: the copy's own words for what the tile is to
   * the set it sits in ("Our related service", "Our related expertise"). Authored case; the role
   * sets the case.
   */
  eyebrow?: string;
  /** The service's own flat Sketch scene, drawn bare on the tile's texture. */
  scene?: SketchName;
  /**
   * A picture in the drawing's place, composed by the caller (an expertise's sector photograph, or
   * its labelled placeholder): for a destination that has no flat drawing of its own. Exclusive with
   * `scene`; never another subject's drawing borrowed.
   */
  picture?: ReactNode;
  /**
   * The action at the tile's foot, one wording for every tile of its kind ("Explore the service").
   * The whole tile is the one anchor, so the action is the link Button rendered as a span, which
   * takes the tile's hover. Authored case; Button sets the case.
   */
  action?: string;
  /**
   * The tile takes a whole row (it would otherwise sit alone on its row): its words and action on
   * one side, the visual on the other, as every horizontal media item does
   * (decisions/2026-10-29-media-rows-take-a-whole-row). The caller's `li` declares `data-media-row`.
   */
  wide?: boolean;
  /** The tile's heading element. Default h3. */
  titleAs?: 'h2' | 'h3' | 'h4';
};

/**
 * ServiceTile — ONE bento tile on its own, for a named destination that sits as a card in another
 * set (owner, 29 Oct 2026; decisions/2026-10-29-named-services-are-service-tiles): an insights shelf's
 * related service or related expertise beside its pieces. The same tile as the bento's (its hairline,
 * texture and hover), with the texture's wave fitted to the tile itself, since it shares no row with
 * other tiles. As a card it reads top to bottom (owner, 29 Oct 2026;
 * decisions/2026-10-29-related-destination-is-a-card): the eyebrow, the title, the visual in the
 * middle of the spare height, the action at the foot. `wide`, the words and action beside the visual.
 * It renders a `div`; the caller's set supplies the `li`. A set of services is a `Bento`, never a row
 * of these.
 */
export function ServiceTile({
  title,
  href,
  eyebrow,
  scene,
  picture,
  action,
  wide = false,
  titleAs: Title = 'h3',
}: ServiceTileProps) {
  const words = (
    <Layout rowGap="tight">
      {eyebrow?.trim() ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Title className={styles.title}>{title}</Title>
    </Layout>
  );
  const visual = picture ? (
    <div className={styles.picture}>{picture}</div>
  ) : scene ? (
    <div className={cx(styles.art, styles.artCentred)}>
      <Sketch name={scene} frame="bare" story />
    </div>
  ) : null;
  const button = action?.trim() ? (
    <Cluster colGap="tight">
      <Button as="span" emphasis="link" tone="primary" icon={<Icon name="arrow-right" />}>
        {action}
      </Button>
    </Cluster>
  ) : null;
  return (
    <div className={cx(styles.cell, styles.solo)}>
      <a href={href} className={cx(styles.tile, wide && styles.tileWide)} data-btn-link-group>
        {wide ? (
          /* Words, visual, action in reading order, so a phone stacks them as the card does; from
             768 the visual takes the second track across both rows, the words over the action
             beside it (each child places itself: `.wideWords`, `.wideVisual`, `.wideAction`). */
          <Layout
            className={styles.fill}
            columns={{ base: 1, md: [1, 1] }}
            colGap="section"
            rowGap="block"
          >
            <div className={styles.wideWords}>{words}</div>
            {visual ? <div className={styles.wideVisual}>{visual}</div> : null}
            {button ? <div className={styles.wideAction}>{button}</div> : null}
          </Layout>
        ) : (
          /* Words at the head, then a stack that takes the spare height: the visual centred in it,
             the action pinned under it. */
          <Layout className={styles.fill} rowGap="block" fillLast>
            {words}
            <Layout rowGap="block" fillFirst>
              {visual ?? <span />}
              {button}
            </Layout>
          </Layout>
        )}
      </a>
    </div>
  );
}

/**
 * Bento — a set of linked tiles of two sizes on four tracks, each its destination's name, one line
 * and its drawing (home "What we do", owner 19 Oct 2026, after Supabase's product grid). The sizes
 * carry the content's own weight: on home, Product Design is wide at the start because it is at the
 * heart of every project, and Software Development wide at the end. The whole set is always in view;
 * no tile hides behind a scroll or a tab.
 *
 * Every tile shows its hairline edge at rest, so its inset is honest (no ground exists only on
 * hover). Behind the drawings runs one continuous texture per row: the site's pixel grid seen
 * through a feathered wave drawn across the whole row (public/textures/bento-wave-*.svg) and
 * clipped by each tile, so the field reads as one while every seam stays a clean tile edge. Each
 * tile's window onto its row is set from its track (`data-col`), so the grid's cells line up from
 * tile to tile. Neutral at rest; on hover the tile's own texture turns blue, its hairline turns
 * light blue, it lifts and its title takes the accent.
 *
 * Every tile's drawing moves on hover or focus: a story scene tells its story, any other makes its one
 * `Move`/`GrowIn` move on the tile's own curve (decisions/2026-10-30-service-tile-drawing-moves-on-hover).
 * The set may close on a CTA card (`cta`, decisions/2026-10-30-set-ends-in-a-cta-card).
 *
 * Tiles carry no icon: the drawing is the tile's visual, and a glyph above the title made two marks
 * compete in one tile (owner, 19 Oct 2026).
 */
export function Bento({ items, titleAs: Title = 'h3', tracks = 4, note, cta }: BentoProps) {
  if (items.length === 0) return null;
  const placed = place(items, tracks);
  if (
    process.env.NODE_ENV !== 'production' &&
    items.some((item) => item.body) &&
    items.some((item) => !item.body)
  ) {
    console.warn(
      'Bento: some tiles carry a body and some do not; give every tile one or none.',
    );
  }
  /* The tracks the last row leaves open, which the text cell fills (a full row when none are). */
  const last = placed.at(-1);
  const used = last ? last.col + last.span : 0;
  const noteSpan = used === tracks ? tracks : tracks - used;
  /* The CTA cards follow the tiles one cell each; the LAST card takes every track its row leaves, so
     the set ends on a full row (from 1024 on `tracks`, from 768 on two). */
  const routes = cta?.routes ?? [];
  const ctaAt = used % tracks;
  const lgSpan = routes.length > 0 ? tracks - ((ctaAt + routes.length - 1) % tracks) : 1;
  const mdCells = placed.reduce((sum, p) => sum + p.span, 0) + routes.length;
  const mdSpan = mdCells % 2 === 1 ? 2 : 1;

  return (
    <Layout
      as="ul"
      className={styles.set}
      data-tracks={tracks}
      columns={{ base: 1, md: 2, lg: tracks }}
      colGap="gutter"
      rowGap="gutter"
    >
      {placed.map(({ item, row, col, span }, index) => (
        <li
          key={item.id}
          className={cx(styles.cell, span === 2 && styles.wide)}
          data-row={row % 2 === 0 ? 'a' : 'b'}
          data-col={col}
        >
          <TileLink item={item} wide={span === 2} Title={Title} />
        </li>
      ))}
      {routes.length > 0 ? (
        routes.map((route, i) => {
          const isLast = i === routes.length - 1;
          return (
            <li
              key={route.question ?? route.answer ?? i}
              className={styles.cta}
              data-span={isLast ? lgSpan : 1}
              data-span-md={isLast ? mdSpan : 1}
            >
              <CtaCard route={route} />
            </li>
          );
        })
      ) : note ? (
        <li className={styles.note} data-span={noteSpan}>
          <p className={styles.noteText}>{note}</p>
        </li>
      ) : null}
    </Layout>
  );
}
