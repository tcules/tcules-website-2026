import { useId } from 'react';

import { Button, Cluster, Icon, Layout, Media, Prose, type MediaImage } from '@/components';
import { cx } from '@/lib/cx';
import { CASE_CARD_COVER } from '@/lib/image-sizes';

import styles from './CaseCard.module.css';

export type CaseCardProps = {
  /** A short label above the claim: the client, optionally its discipline ("Doodle · Product design"). */
  eyebrow?: string;
  /** The case's claim ("Meeting times people will actually keep"). */
  title: string;
  /** Default `h3`: a case under the band's h2. */
  titleAs?: 'h2' | 'h3' | 'h4';
  /** The result, plain text. `bodyHtml` wins when both are given. */
  body?: string;
  /** The result as trusted, content-seam-sanitised HTML, one paragraph each. */
  bodyHtml?: readonly string[];
  /** The case page: the whole card links to it. */
  href: string;
  /**
   * "Read the Doodle case". Button sets the label's case, so pass ordinary capitalisation. The
   * card's cue, not a second link: the whole card is the one anchor.
   */
  ctaLabel?: string;
  /** The evidence, framed at the card ratio (16:9) and cropped at its `focus`. */
  image: MediaImage;
  /**
   * The cover on the END from 1024, the claim at the start. Visual only: the DOM keeps the cover
   * first, so a phone reads cover, then claim, in every card.
   */
  reverse?: boolean;
};

const filled = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * CaseCard — one featured case as ONE card (home's selected work; the case index's featured cases).
 *
 *   ┌ the card's ground, a `text` mat ────────────────────────────────┐
 *   │ [ cover, 16:9, hairline ]   eyebrow · claim (h3) · result        │
 *   │                             read the case →          (pinned)    │
 *   └──────────────────────────────────────────────────────────────────┘
 *
 * The shape approved as TestimonialCase (16 Oct 2026, round 7 of the selected-work card mocks), with
 * the client's words taken out (owner, 22 Oct 2026: "case study cards never hold testimonials in
 * them"). The testimonials keep their own band. Below 1024 one column: cover, claim, link.
 *
 * The WHOLE CARD is the case's link (owner, 19 Oct 2026: "the card isn't clickable, only the link
 * is"), BlockCard's single-anchor contract: one <a> holds the card, the "Read the … case" line is a
 * link Button rendered `as="span"` (one focus stop, no nested anchor), and `data-btn-link-group`
 * hands it the card's hover, focus and press. On hover and focus the cover leans in inside its
 * still, ruled box, as a covered BlockCard's does. The anchor is named by its claim and its cue
 * (`aria-labelledby`), not by everything it holds.
 *
 * A story with a link of its own cannot sit inside the card's anchor (BlockCard's `linkScope="cta"`,
 * G3b): the card falls back to a still frame and the cue becomes the one real link, in the tab order.
 */
export function CaseCard({
  eyebrow,
  title,
  titleAs: Title = 'h3',
  body,
  bodyHtml,
  href,
  ctaLabel,
  image,
  reverse = false,
}: CaseCardProps) {
  const paragraphs = bodyHtml?.filter((html) => html.trim().length > 0) ?? [];
  const story =
    paragraphs.length > 0 ? (
      <Layout rowGap="text" className={styles.body}>
        {paragraphs.map((html, index) => (
          <Prose key={index} html={html} className={styles.prose} />
        ))}
      </Layout>
    ) : filled(body) ? (
      <p className={styles.body}>{body}</p>
    ) : null;
  const id = useId();
  const titleId = `${id}-title`;
  const cueId = `${id}-cue`;
  const ownLinks = paragraphs.some((html) => /<a[\s>]/i.test(html));
  const content = (
    /* The cover and the claim keep the round-7 card's seams (approved as TestimonialCase, 16 Oct
       2026): `stack` across from 1024, plus the copy's `text` inline inset, so the two read as one
       card rather than a split of two regions; `inline` down below it, plus the copy's `gutter`
       block inset. */
    <Layout
      columns={{ base: 1, lg: [7, 5] }}
      reverse={reverse ? { lg: true } : undefined}
      colGap="stack"
      rowGap="inline"
    >
      <span className={styles.media}>
        <span className={styles.zoom}>
          <Media image={image} sizes={CASE_CARD_COVER} fit="fill" edge="placement" />
        </span>
      </span>
      <Layout rowGap="gutter" pinLast className={styles.copy}>
        <Layout rowGap="text">
          {filled(eyebrow) ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <Title id={titleId} className={styles.title}>
            {ownLinks && !ctaLabel ? <a href={href}>{title}</a> : title}
          </Title>
          {story}
        </Layout>
        {ctaLabel ? (
          <Cluster>
            {ownLinks ? (
              <Button
                as="a"
                href={href}
                emphasis="link"
                tone="primary"
                icon={<Icon name="arrow-right" />}
              >
                {ctaLabel}
              </Button>
            ) : (
              <Button
                as="span"
                id={cueId}
                emphasis="link"
                tone="primary"
                icon={<Icon name="arrow-right" />}
              >
                {ctaLabel}
              </Button>
            )}
          </Cluster>
        ) : null}
      </Layout>
    </Layout>
  );
  return (
    <article className={styles.article}>
      {ownLinks ? (
        <div className={styles.card}>{content}</div>
      ) : (
        <a
          className={cx(styles.card, styles.linked)}
          href={href}
          aria-labelledby={ctaLabel ? `${titleId} ${cueId}` : titleId}
          data-btn-link-group
        >
          {content}
        </a>
      )}
    </article>
  );
}
