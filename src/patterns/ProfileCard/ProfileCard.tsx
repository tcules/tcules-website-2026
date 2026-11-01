import type { ReactNode } from 'react';

import { BrandMark, Button, Cluster, Icon, Layout, Media, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';

import styles from './ProfileCard.module.css';

/* A LinkedIn profile opens beside the page. Spread, as Button's anchor props are open. */
const NEW_TAB = { target: '_blank', rel: 'noopener' } as const;

export type ProfileLink = { label: string; href: string };

export type ProfileCardProps = {
  /** The person's name, as authored ("Jatin Leuva"). */
  name: string;
  /** Their position ("Founder & CEO"). */
  role?: string;
  /** What they lead and care about: plain text, or inline content the caller renders. */
  bio?: ReactNode;
  /**
   * Their portrait, cropped square from the centre. Absent, their initials hold the square on a plain
   * ground, so a set keeps one head height and nothing reads as a broken image. Never pass a labelled
   * placeholder panel here: at 80px its label cannot be read (review 29 Oct).
   */
  portrait?: MediaImage;
  /** `square` (default): the 8 radius, the house photograph corner. `circle`: as a testimonial's avatar. */
  portraitShape?: 'square' | 'circle';
  /** Their LinkedIn profile: an action on the ruled foot, opening beside the page. */
  linkedin?: ProfileLink;
  /**
   * Their page on this site (an author page: "More from Chirag", owner 1 Nov 2026): an action on the
   * ruled foot, the trailing arrow because it navigates, as Contributors' link to the same page. With
   * `linkedin` too, the two share the foot, this one first.
   */
  link?: ProfileLink;
  /** Heading semantics. Default h3, under the band's h2. */
  nameAs?: 'h3' | 'h4';
  /** The list item's tag when the card is a member of a set. Default `li`. */
  as?: 'li' | 'div';
};

/** The first letters of a name's first and last words ("Jatin Leuva" → "JL"). */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = words[0]?.charAt(0) ?? '';
  const last = words.length > 1 ? (words.at(-1)?.charAt(0) ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * ProfileCard — a person (owner, 12 Oct 2026: "would be somewhat like the testimonial card. image
 * (square or circle), name, position, bio, linkedin").
 *
 * The testimonial card's anatomy turned round: the PERSON leads, so the portrait, name and position
 * head the panel (TestimonialCard puts the speaker at its foot, under the words), the bio is the body,
 * and the LinkedIn link is the ruled foot, the LinkedIn mark as its icon (it says where the link goes). A boxed panel on the quiet ground, no
 * edge (9 Oct box ruling), the portrait a fixed square so a set of cards shares one head height.
 * Never a 16:9 card image: that is a card about a thing, and this is a card about someone.
 */
export function ProfileCard({
  name,
  role,
  bio,
  portrait,
  portraitShape = 'square',
  linkedin,
  link,
  nameAs: Name = 'h3',
  as: Root = 'li',
}: ProfileCardProps) {
  return (
    <Root className={styles.item}>
      <Layout rowGap="block" pinLast={Boolean(linkedin || link)} className={styles.card}>
        <Cluster nowrap colGap="block" align="center">
          {portrait ? (
            <span className={cx(styles.portrait, portraitShape === 'circle' && styles.circle)}>
              <Media
                image={{ ...portrait, focus: portrait.focus ?? { x: 0.5, y: 0.4 } }}
                fit="fill"
                edge="placement"
                sizes="96px"
              />
            </span>
          ) : (
            <span
              aria-hidden="true"
              className={cx(
                styles.portrait,
                styles.initials,
                portraitShape === 'circle' && styles.circle,
              )}
            >
              {initialsOf(name)}
            </span>
          )}
          <Layout rowGap="inline" className={styles.who}>
            <Name className={styles.name}>{name}</Name>
            {role ? <p className={styles.role}>{role}</p> : null}
          </Layout>
        </Cluster>
        {bio ? <p className={styles.bio}>{bio}</p> : <span />}
        {linkedin || link ? (
          <Cluster colGap="block" rowGap="tight" align="center" className={styles.foot}>
            {link ? (
              <Button
                as="a"
                href={link.href}
                emphasis="link"
                tone="primary"
                icon={<Icon name="arrow-right" />}
              >
                {link.label}
              </Button>
            ) : null}
            {linkedin ? (
              <Button
                as="a"
                href={linkedin.href}
                {...NEW_TAB}
                emphasis="link"
                tone="primary"
                icon={<BrandMark name="linkedin" />}
              >
                {linkedin.label}
              </Button>
            ) : null}
          </Cluster>
        ) : null}
      </Layout>
    </Root>
  );
}

export type ProfileFollowProps = {
  /** What the studio is, the sentence beside the link. */
  body: ReactNode;
  /** The studio's LinkedIn. */
  link: ProfileLink;
  /** The team photograph, a 3:2 thumbnail at the banner's start. */
  image?: MediaImage;
};

/**
 * ProfileFollow — the one "follow us" banner under a set of ProfileCards: the team photograph, the
 * sentence about the wider studio, and the LinkedIn mark with the follow link at the end. One slim
 * panel on the cards' ground, so it reads as the set's close rather than a third person.
 */
export function ProfileFollow({ body, link, image }: ProfileFollowProps) {
  return (
    <div className={styles.follow}>
      <Layout
        columns={image ? { base: 1, md: [1, 3, 'auto'] } : { base: 1, md: [1, 'auto'] }}
        colGap="gutter"
        rowGap="block"
        align="center"
      >
        {image ? (
          <Media image={image} ratio="3/2" sizes="(min-width: 1304px) 280px, 30vw" />
        ) : null}
        <p className={styles.followBody}>{body}</p>
        <Cluster colGap="tight" align="center" nowrap>
          <Button
            as="a"
            href={link.href}
            {...NEW_TAB}
            emphasis="link"
            tone="primary"
            icon={<BrandMark name="linkedin" />}
          >
            {link.label}
          </Button>
        </Cluster>
      </Layout>
    </div>
  );
}
