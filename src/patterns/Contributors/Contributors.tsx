import { useId } from 'react';

import { Button, Cluster, Icon, Layout, Media, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';
import { initialsOf, PORTRAIT_FOCUS } from '@/lib/initials';

import styles from './Contributors.module.css';

/** A link to more from one person: their author page, with its label as authored ("More from Shoghi"). */
export type ContributorLink = { label: string; href: string };

export type Contributor = {
  /** As authored ("Shoghi Bagul"). */
  name: string;
  /** Who they are, as authored: "Product Designer, Tcules", "Host · Founder and CEO, Tcules". */
  role?: string;
  /** Their photograph, cropped square at the 8 radius. Absent, their initials in full ink on the portrait's ground. */
  portrait?: MediaImage;
  /** Their page. Absent (a podcast guest has none), the name is plain and there is no link. */
  link?: ContributorLink;
};

export type ContributorsProps = {
  /** The section's label: "About the author", "About the authors", "In this episode". */
  label: string;
  /** The people, in the order the content credits them. Empty renders nothing. */
  people: readonly Contributor[];
};

/**
 * Contributors — the people behind a piece, after its content (owner, 30 Oct 2026: byline board G,
 * "the page isn't frontloaded with supporting content"). The byline under the title carries their
 * faces and names; this is where each says who they are and where to read more of them.
 *
 * A labelled section on a hairline, then one row per person: portrait, name, role, link. Unboxed: it
 * closes an article rather than starting a card set, and a box would read as an advert for the
 * author. It renders only the people the content carries (launch rule, 29 Oct 2026).
 */
export function Contributors({ label, people }: ContributorsProps) {
  const labelId = useId();
  if (people.length === 0) return null;
  return (
    <section aria-labelledby={labelId} className={styles.root}>
      <Layout rowGap="block">
        <h2 id={labelId} className={styles.label}>
          {label}
        </h2>
        <Cluster as="ul" colGap="stack" rowGap="block" align="start">
          {people.map((person, index) => (
            <li key={`${person.name}-${index}`}>
              {/* Top-aligned: the name sits on the portrait's top edge, so a row with a link and a
                  row without one start on the same line. */}
              <Cluster nowrap colGap="text" align="start">
                {person.portrait ? (
                  <span className={styles.portrait}>
                    <Media
                      image={{
                        ...person.portrait,
                        alt: '',
                        focus: person.portrait.focus ?? PORTRAIT_FOCUS,
                      }}
                      fit="fill"
                      edge="placement"
                      sizes="64px"
                    />
                  </span>
                ) : (
                  <span className={cx(styles.portrait, styles.initials)} aria-hidden="true">
                    {initialsOf(person.name)}
                  </span>
                )}
                {/* Name and role are one identity, 4 apart; the link is an action after it, a
                    paragraph's step below (owner, 1 Nov 2026: the link sat too close to the role). */}
                <Layout rowGap="text">
                  <Layout rowGap="inline">
                    <h3 className={styles.name}>{person.name}</h3>
                    {person.role ? <p className={styles.role}>{person.role}</p> : null}
                  </Layout>
                  {person.link ? (
                    <Button
                      as="a"
                      href={person.link.href}
                      emphasis="link"
                      tone="primary"
                      size="sm"
                      icon={<Icon name="arrow-right" />}
                    >
                      {person.link.label}
                    </Button>
                  ) : null}
                </Layout>
              </Cluster>
            </li>
          ))}
        </Cluster>
      </Layout>
    </section>
  );
}
