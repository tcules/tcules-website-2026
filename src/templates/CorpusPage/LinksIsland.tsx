import { Button, Cluster, Icon, Layout, Section, TextureFlow } from '@/components';

import styles from './CorpusPage.module.css';

/** One destination in a links island: its label as authored, and where it goes. */
export type IslandLink = { label: string; href: string };

/* A destination that leaves the site (another origin, a mailbox) takes the up-right arrow; one that
   stays takes the right arrow (owner, 3 Nov 2026). */
const leavesSite = (href: string) => /^(mailto:|tel:|https?:\/\/)/.test(href);

/**
 * The studio's links as a centred island: a heading over a row of link Buttons, on the moving
 * light-blue field with its edges blurred wide (owner, 31 Oct 2026, About's "Follow the studio, read
 * its reviews, join the team"; decisions/2026-10-31-formless-islands-turbulent-paper-island-textured).
 * One block for every page that sends the reader to the studio's profiles, so About and Contact
 * cannot drift apart (owner, 3 Nov 2026: /contact's "Follow us on" is About's band, shorter).
 *
 * `open` takes the open band's air (About, where the island closes a long band); without it the
 * band takes Section's own padding, the shorter band. `footnote` is one quiet line under the links,
 * for a fact that belongs with them (Contact's studio address).
 */
export function LinksIsland({
  id,
  heading,
  links,
  footnote,
  open = false,
  band,
}: {
  id: string;
  heading: string;
  links: readonly IslandLink[];
  footnote?: string;
  open?: boolean;
  /** The page's `data-band` code for the kinds check. */
  band: string;
}) {
  if (links.length === 0) return null;
  const headingId = `${id}-heading`;
  return (
    <Section
      id={id}
      data-band={band}
      aria-labelledby={headingId}
      density={open ? 'open' : undefined}
    >
      {/* The field across the band, edges blurred wide and rounded; at full strength around the
          words, faint in the space around them (owner, 31 Oct 2026). */}
      <TextureFlow flow="turbulent" feather bleed />
      <Layout
        rowGap="stack"
        justifyItems="center"
        className={styles.centred}
        data-texture-focus
      >
        <h2 id={headingId}>{heading}</h2>
        <Layout rowGap="block" justifyItems="center">
          <Cluster colGap="stack" rowGap="block" justify="center">
            {links.map((link) => (
              <Button
                key={link.href}
                as="a"
                href={link.href}
                emphasis="link"
                tone="primary"
                size="md"
                icon={<Icon name={leavesSite(link.href) ? 'arrow-right-up' : 'arrow-right'} />}
              >
                {link.label}
              </Button>
            ))}
          </Cluster>
          {footnote ? <p className={styles.islandNote}>{footnote}</p> : null}
        </Layout>
      </Layout>
    </Section>
  );
}
