import { Icon, Layout, Sketch } from '@/components';
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
};

/** One of a path's services: the action's words, where it goes and the service's own scene. */
export type GatewayPathLink = { label: string; href: string; scene?: SketchName };

export type GatewayPathsProps = {
  paths: readonly GatewayPath[];
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
export function GatewayPaths({ paths, titleAs = 'h3', className }: GatewayPathsProps) {
  const Title = titleAs;
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
