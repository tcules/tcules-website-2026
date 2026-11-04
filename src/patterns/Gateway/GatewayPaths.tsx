import type { ReactNode } from 'react';

import { Cluster, Icon, Layout, Sketch } from '@/components';
import { cx } from '@/lib/cx';
import type { SketchName } from '@/lib/sketches';

import styles from './Gateway.module.css';

/** One path: the reader's situation, what it means, and the two or three pages that serve it. */
export type GatewayPath = {
  /** Stable key, unique in the set. */
  id: string;
  /** The situation in the reader's words ("Creating a new product"). A label over its words. */
  title: string;
  /** Its sentences, one string per paragraph, as authored. */
  body: readonly string[];
  /**
   * Where it leads, in the authored order: each a service, as a graphic card. `label` is the
   * action's authored words ("Design and launch your MVP"), never the service's name; `scene` is the
   * service's own flat Sketch scene, the one its service page draws (`serviceSceneFor`). A service
   * with no scene of its own yet takes no other subject's: its card shows the empty plate until one
   * is drawn.
   */
  links: readonly GatewayPathLink[];
  /**
   * `cards` only: what kind of product the path is for ("New product"), set as the card's label over
   * its title. Authored case kept; the transform is CSS.
   */
  eyebrow?: string;
  /**
   * `cards` only: the path's example, one line of inline content composed by the caller with its own
   * link to the case ("Example: Doodle's enterprise MVP, reshaped by research."), set under the words
   * at the small step.
   */
  example?: ReactNode;
  /**
   * `cards` only: the example's label, set in the label voice over it ("Example", the copy's own
   * "Example:" lifted out of the sentence). Absent, the example stands alone.
   */
  exampleLabel?: string;
};

/** One of a path's services: the action's words, where it goes and the service's own scene. */
export type GatewayPathLink = { label: string; href: string; scene?: SketchName };

/**
 * `graphic` (default): each path a split, its services as graphic cards on equal tracks
 * (decisions/2026-10-31-paths-graphic-cards). `cards` (owner, 4 Nov 2026, homepage pass: "a classic 3
 * card layout"): each path ONE card, three across from 1024 — label, title, words, example, then its
 * services as ruled link rows at the card's foot — so a reader compares the three situations side by
 * side and every door's way in sits on one line.
 */
export type GatewayPathsForm = 'graphic' | 'cards';

export type GatewayPathsProps = {
  paths: readonly GatewayPath[];
  /** Default `graphic`. See `GatewayPathsForm`. */
  form?: GatewayPathsForm;
  /** The element each path's title renders as. h3 under a band's h2 (the default). */
  titleAs?: 'h3' | 'h4';
  className?: string;
};

/**
 * TIER 2 — GatewayPaths, the two-path form of the Gateway (home "Where to start", 31 Oct 2026;
 * decisions/2026-10-31-paths-graphic-cards).
 *
 * The 26 Oct copy has TWO paths ("Creating a new product", "Taking an established product
 * further"), each with its sentences and two or three services. The destinations are the content:
 * the path is a small label over its words, and its services are flat graphic cards, the service's
 * own Sketch scene on its plate with the action's words under it. No box, no border: the plate is the
 * card, and the whole card is the link.
 *
 * The paths read one under the other, `column` (64) apart. From 1024 each is a split: the words in
 * the 1 track, the cards in the 2, `section` (96) apart. From 768 the cards stand on three EQUAL
 * tracks for both paths, so all five are one width and a two-service path leaves its third track
 * empty (owner, 31 Oct 2026: equal cards). Below 768 each card is a row, the scene beside the words
 * with the arrow trailing the last one.
 */
export function GatewayPaths({
  paths,
  form = 'graphic',
  titleAs = 'h3',
  className,
}: GatewayPathsProps) {
  const Title = titleAs;
  if (form === 'cards') {
    return (
      /* Three items, one column below 1024 (three ~220 cards at 768 left each title a word a line).
         Each item is its card and, outside the card's box, its example (owner, 4 Nov 2026, variant
         G): from 1024 the items share three rows (subgrid) and each card spans the first two, so
         the heads, the ways in and the examples each start on one line across the set whatever
         their lengths. In the card the head and the ways in are a `stack` (48) apart, open air under
         the words; the example sits a `text` (16) under its card, on the card's outer edge. Items in
         a set are a `gutter` apart, and a `stack` when they stack, so an example never reads as the
         next card's. */
      <Layout
        as="ul"
        columns={{ base: 1, lg: 3 }}
        colGap="gutter"
        /* Stacked items a `stack` apart when an example sits under each card, so it never reads as
           the next card's; otherwise the card set's own `gutter`. */
        rowGap={paths.some((path) => path.example) ? 'stack' : 'gutter'}
        /* A third shared row only when an example sits under a card; without one it would leave its
           track and seam under every card. */
        shareRows={paths.some((path) => path.example) ? 3 : 2}
        className={cx(styles.root, className)}
      >
        {paths.map((path) => (
          <Layout as="li" key={path.id} rowGap="text">
            <Layout spanRows={2} rowGap="stack" className={styles.door}>
              <Layout rowGap="text">
                {path.eyebrow ? <p className={styles.doorEyebrow}>{path.eyebrow}</p> : null}
                <Title className={styles.doorTitle}>{path.title}</Title>
                {path.body.map((paragraph, index) => (
                  <p key={index} className={styles.doorBody}>
                    {paragraph}
                  </p>
                ))}
              </Layout>
              {/* The ways in: one ruled row each, the whole row the link, its arrow at the row's
                  end. The rows close the card, so the card needs no action of its own. */}
              <ul>
                {path.links.map((link) => (
                  <li key={link.href} className={styles.doorRow}>
                    <a href={link.href} className={styles.doorLink}>
                      <Cluster colGap="text" justify="between" align="center" nowrap>
                        <span>{link.label}</span>
                        <span className={styles.doorArrow} aria-hidden="true">
                          <Icon name="arrow-right" />
                        </span>
                      </Cluster>
                    </a>
                  </li>
                ))}
              </ul>
            </Layout>
            {path.example ? (
              <Layout rowGap="tight">
                {path.exampleLabel ? (
                  <p className={styles.doorExampleLabel}>{path.exampleLabel}</p>
                ) : null}
                <p className={styles.doorExample}>{path.example}</p>
              </Layout>
            ) : null}
          </Layout>
        ))}
      </Layout>
    );
  }
  return (
    <Layout as="ul" rowGap="column" className={cx(styles.root, className)}>
      {paths.map((path) => (
        <li key={path.id}>
          <Layout columns={{ lg: [1, 2] }} colGap="section" rowGap="block">
            <Layout rowGap="text">
              <Title className={styles.pathTitle}>{path.title}</Title>
              {path.body.map((paragraph, index) => (
                <p key={index} className={styles.pathBody}>
                  {paragraph}
                </p>
              ))}
            </Layout>
            <Layout as="ul" columns={{ base: 1, md: 3 }} colGap="gutter" rowGap="text">
              {path.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.serviceCard}>
                    <Layout
                      columns={{ base: ['auto', 1], md: 1 }}
                      colGap="text"
                      rowGap="text"
                      align="center"
                    >
                      <span className={styles.serviceArt} aria-hidden="true">
                        {/* The card is a link: its drawing makes its move on hover (owner, 1 Nov 2026). */}
                        <Sketch name={link.scene} story />
                      </span>
                      <span className={styles.serviceLabel}>
                        {link.label}
                        {/* One arrow: inline after the last word below 768, at the first line's
                            end from 768 (Gateway.module.css). */}
                        <span className={styles.serviceArrow} aria-hidden="true">
                          <Icon name="arrow-right" />
                        </span>
                      </span>
                    </Layout>
                  </a>
                </li>
              ))}
            </Layout>
          </Layout>
        </li>
      ))}
    </Layout>
  );
}
