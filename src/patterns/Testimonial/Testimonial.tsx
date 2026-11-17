import type { ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  Layout,
  Media,
  Prose,
  StarRating,
  type MediaImage,
} from '@/components';
import { cx } from '@/lib/cx';
import { TESTIMONIAL_AVATAR } from '@/lib/image-sizes';
import { curlQuotes, withQuoteMarks } from '@/lib/quote-marks';

import styles from './Testimonial.module.css';

/**
 * The speaker's portrait for a circular avatar: the asset record without the fields the card
 * decides (its alt, which is empty because the name sits beside it, and its kind). Shot square
 * (ch05 §3); a non-square record is centre-cropped.
 */
export type TestimonialAvatar = Pick<MediaImage, 'src' | 'width' | 'height' | 'sources'>;

/**
 * One client's testimonial, as a card renders it. Presentation-agnostic: the page maps its content
 * onto this, and the pattern never learns where a quote or its rating came from.
 */
export type TestimonialItem = {
  /** A stable key within a set (the testimonial id where the content has one). */
  id?: string;
  /** Trusted, content-seam-sanitised rich text, authored marks included. Never the attribution. */
  quoteHtml: string;
  /** The speaker. Required: a testimonial is always named. */
  name: string;
  /** The speaker's title. A blank role leaves no separator. */
  role?: string;
  /** The client, named after the role. */
  company: string;
  /**
   * What this client rated, out of 5, in halves. Optional: with none the card shows no stars rather
   * than a default score. Always the page's data, passed as a prop, never a value a pattern holds
   * (home round 2: the ratings are placeholders at the content seam until real ones replace them).
   */
  rating?: number;
  /**
   * The speaker's photograph, set as a CIRCULAR avatar beside the name (owner, home round 3, 11 Oct
   * 2026). Optional, and with none the card shows NO avatar at all: the initials-in-a-box monogram
   * that stood in for a photograph is banned ("the current initials in a box is illegal for our
   * designs"). Always the page's data, never a pattern's.
   */
  avatar?: TestimonialAvatar;
};

/**
 * The card's weight.
 *
 *   md  the testimonial is the thing: a quote wall, a quote beside its case. The quote in the sans
 *       lead role (18), 18 stars, a 48 avatar beside the name when there is a photograph.
 *   sm  the testimonial SUPPORTS something beside it (owner, 10 Oct 2026: "the main highlight is the
 *       thing we claim to be doing and the testimonial supports it"). The sans body role (16) in the
 *       quieter ink, 14 stars, a 40 avatar: one step down everywhere, so the claim beside it leads.
 *
 * THE QUOTE IS SANS (owner, home round 3, 11 Oct 2026: "the text is small here. readability is
 * preferred"). It was the italic serif reading quote at 22; a card's quote runs at a narrow measure
 * and small size, where the serif italic was the harder read. The large display quotes elsewhere
 * (Proof) keep the serif speech voice.
 */
export type TestimonialSize = 'md' | 'sm';

/**
 * `box` sets the card on its own quiet ground (testimonial.css: the one card with a ground at rest,
 * because every reference the owner chose panels each review). `none` sets it straight on the
 * surface, for a supporting quote that should not read as a second object in its row.
 */
export type TestimonialFrame = 'box' | 'none';

function warn(message: string) {
  if (process.env.NODE_ENV !== 'production') console.warn(`Testimonial: ${message}`);
}

const filled = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

function valid(item: TestimonialItem): boolean {
  const blank = (['quoteHtml', 'name', 'company'] as const).filter((key) => !filled(item[key]));
  if (blank.length > 0) {
    warn(`"${item.name || '?'}" has blank ${blank.join(', ')}; omitting it.`);
    return false;
  }
  return true;
}

/**
 * Bind a one-letter word to the next with a no-break space in the text of trusted HTML, so a line
 * never ends on a lone "I" or "a" (Proof's typesetting rule, restated here on purpose: a pattern
 * does not import a pattern).
 */
function bindShortWords(html: string): string {
  return html
    .split(/(<[^>]*>)/)
    .map((part) =>
      part.startsWith('<') ? part : part.replace(/(^|[\s(“"‘'])(I|a|A) (?=\S)/g, '$1$2 '),
    )
    .join('');
}

/** A rough height for a card, from its quote's length: enough to balance column stacks. */
const weightOf = (item: TestimonialItem) => item.quoteHtml.replace(/<[^>]*>/g, '').length + 220;

/* ── The card ─────────────────────────────────────────────────────────────────────── */

export type TestimonialCardProps = {
  item: TestimonialItem;
  size?: TestimonialSize;
  frame?: TestimonialFrame;
  /**
   * `li` when the card is one of a list (a wall); `div` (default) when it stands alone beside
   * something. The figure inside carries the quote semantics either way.
   */
  as?: 'li' | 'div';
  /** Stretch to the row's height, the attribution pinned to the foot (a row of peers). */
  fill?: boolean;
};

/**
 * TestimonialCard — stars, the client's words, and who said them, in that order (the owner's
 * references 1 and 3: the rating heads the card, the person closes it). The attribution opens on a
 * hairline, so the speaker reads as the card's foot rather than a fourth paragraph.
 */
export function TestimonialCard({
  item,
  size = 'md',
  frame = 'box',
  as: Root = 'div',
  fill = false,
}: TestimonialCardProps) {
  if (!valid(item)) return null;
  /* Every testimonial carries its star rating (owner, 12 Oct 2026); say so when one arrives without. */
  if (typeof item.rating !== 'number')
    warn(`"${item.name}" has no rating; every testimonial shows one.`);
  const role = filled(item.role) ? `${item.role}, ${item.company}` : item.company;
  const quiet = size === 'sm';
  return (
    <Root className={cx(styles.item, fill && styles.fill)}>
      <Layout
        as="figure"
        rowGap={quiet ? 'text' : 'block'}
        pinLast={fill}
        className={cx(
          styles.card,
          frame === 'box' && styles.box,
          quiet && styles.sm,
          fill && styles.fillCard,
        )}
      >
        {typeof item.rating === 'number' ? (
          <StarRating
            value={item.rating}
            size={quiet ? 'sm' : 'md'}
            glyph={<Icon name="star" />}
            onCard={frame === 'box'}
          />
        ) : null}
        <blockquote className={styles.quote}>
          <Prose
            html={bindShortWords(withQuoteMarks(curlQuotes(item.quoteHtml)))}
            className={styles.quoteProse}
          />
        </blockquote>
        <Cluster
          as="figcaption"
          nowrap
          colGap="text"
          align="center"
          className={cx(styles.attribution, frame === 'box' && styles.attributionRuled)}
        >
          {item.avatar ? <Avatar avatar={item.avatar} size={quiet ? 'sm' : 'md'} /> : null}
          <Layout rowGap="inline" className={styles.who}>
            <span className={styles.name}>{item.name}</span>
            <span className={styles.role}>{role}</span>
          </Layout>
        </Cluster>
      </Layout>
    </Root>
  );
}

/* Centre: a ProofPortrait-style record carries no focal point, and a face is centred in a square
   portrait. Without it a fill crop anchors at Media's product-UI position (start, 20% down). */
const AVATAR_FOCUS = { x: 0.5, y: 0.5 };

/**
 * The circular avatar (owner, home round 3: "show circular avatar images for some and no images
 * for some"). A fixed square box clipped to a circle, Media filling it with a centre crop as a
 * photograph; the box rules the edge (`edge="placement"`), so Media adds no radius of its own.
 * `alt=""`: the name beside it is the text, and a portrait's alt could only say the name again.
 */
function Avatar({ avatar, size }: { avatar: TestimonialAvatar; size: 'md' | 'sm' }) {
  if (!avatar.src.trim() || !(avatar.width > 0) || !(avatar.height > 0)) {
    warn('avatar needs a src, width and height; omitting it.');
    return null;
  }
  return (
    <span className={cx(styles.avatar, size === 'sm' && styles.avatarSm)}>
      <Media
        image={{ ...avatar, alt: '', kind: 'photograph' }}
        sizes={TESTIMONIAL_AVATAR}
        fit="fill"
        edge="placement"
        focus={AVATAR_FOCUS}
      />
    </span>
  );
}

/* ── The wall ─────────────────────────────────────────────────────────────────────── */

/**
 * Split items into `count` CONTIGUOUS runs whose estimated heights are as even as possible, so the
 * columns end near one line and a phone, which reads the runs one after another, still reads the
 * quotes in the order they were written.
 */
function partition(items: readonly TestimonialItem[], count: number): TestimonialItem[][] {
  const weights = items.map(weightOf);
  const n = items.length;
  /* best[k][i]: the smallest possible tallest column for the first i items in k columns. */
  const best: number[][] = Array.from({ length: count + 1 }, () => Array(n + 1).fill(Infinity));
  const cut: number[][] = Array.from({ length: count + 1 }, () => Array(n + 1).fill(0));
  const prefix = [0];
  for (const w of weights) prefix.push((prefix.at(-1) ?? 0) + w);
  best[0]![0] = 0;
  for (let k = 1; k <= count; k++) {
    for (let i = 1; i <= n; i++) {
      for (let j = k - 1; j < i; j++) {
        const tallest = Math.max(best[k - 1]![j]!, prefix[i]! - prefix[j]!);
        if (tallest < best[k]![i]!) {
          best[k]![i] = tallest;
          cut[k]![i] = j;
        }
      }
    }
  }
  const runs: TestimonialItem[][] = [];
  let end = n;
  for (let k = count; k >= 1; k--) {
    const start = cut[k]![end]!;
    runs.unshift(items.slice(start, end));
    end = start;
  }
  return runs.filter((run) => run.length > 0);
}

export type TestimonialWallProps = {
  items: readonly TestimonialItem[];
  /** Whether an incomplete portrait set shows its available avatars. */
  avatarPolicy?: 'all-or-none' | 'individual';
  /**
   * Tracks from 1024. Default by count: one or two take their count, four take two (a 2 × 2), three
   * and five or more take three. Below 1024 the wall is one column.
   */
  columns?: 1 | 2 | 3;
  /**
   * From 1024 every second column drops by the `section` step (Layout `stagger`), so the cards read
   * as placed rather than tiled (the owner's reference 2). Only where the wall has more cards than
   * columns: a single row of peers stays level.
   */
  stagger?: boolean;
};

/**
 * TestimonialWall — a set of rated cards (the owner's references 1, 3 and 4). Up to one card per
 * track it is ONE row of peers, each stretched to the tallest, the attributions on one line. With
 * more cards than tracks it is a wall of column stacks: the cards run down each column in the order
 * they were written, split where the columns come out most even, so a long quote and a short one
 * share a column instead of leaving a ragged row of holes.
 */
export function TestimonialWall({
  items,
  columns,
  stagger = false,
  avatarPolicy = 'all-or-none',
}: TestimonialWallProps) {
  const valids = items.filter(valid);
  /* A wall carries portraits on every card or on none: three of six with faces read as unevenly
     finished (review 29 Oct, home). Until the last portrait lands, the wall shows none. */
  const accepted =
    avatarPolicy === 'individual' || valids.every((item) => item.avatar)
      ? valids
      : valids.map((item) => (item.avatar ? { ...item, avatar: undefined } : item));
  if (accepted.length === 0) {
    warn('wall has no valid testimonials; rendering nothing.');
    return null;
  }
  const count =
    columns ??
    (accepted.length <= 2 ? (accepted.length as 1 | 2) : accepted.length === 4 ? 2 : 3);
  const key = (item: TestimonialItem, index: number) => item.id ?? `${index}-${item.name}`;

  if (accepted.length <= count) {
    return (
      <Layout
        as="ul"
        columns={{ lg: count }}
        colGap="gutter"
        rowGap="gutter"
        className={styles.wall}
      >
        {accepted.map((item, index) => (
          <TestimonialCard key={key(item, index)} item={item} as="li" fill />
        ))}
      </Layout>
    );
  }

  const runs = partition(accepted, count);
  return (
    <Layout
      columns={{ lg: runs.length }}
      colGap="gutter"
      rowGap="gutter"
      stagger={stagger && runs.length > 1}
      className={styles.wall}
    >
      {runs.map((run, column) => (
        <Layout as="ul" key={column} rowGap="gutter">
          {run.map((item, index) => (
            <TestimonialCard key={key(item, index)} item={item} as="li" />
          ))}
        </Layout>
      ))}
    </Layout>
  );
}

/* ── Beside the work ──────────────────────────────────────────────────────────────── */

/**
 * How the quote is set beside its work.
 *
 *   card     the rated card in the 5 of [7, 5], top-aligned with the work (owner, 11 Oct 2026). The service, audit,
 *            expertise and case-index pages' featured case (home round 2).
 *   diptych  the quote as the work's TWIN (owner, home round 3, 11 Oct 2026: the card beside the case
 *            "feels randomly floaty"). Two equal tracks a `gutter` apart, top-aligned: the case card
 *            in one, and in the other a quiet panel holding the stars, the words and, pinned to its
 *            foot, the speaker with their avatar (owner, home round 4: "avatar inside the card
 *            please"). The two read as one object in two panels, the quote attached to its case by
 *            shared edges, never placed inside it. The panel's edges, by width:
 *              from 1440  the cover's own 16:9, so its top and foot are the cover's top and foot. A
 *                         quote too long for that grows the panel rather than clipping it.
 *              1024–1439  the tracks are too narrow for stars, words and speaker inside a 16:9
 *                         (a 464 track is a 261 panel; the content is ~350), so the panel stretches
 *                         to the ROW: its top is the cover's top and its foot the case's last line.
 *                         Aligned to the row rather than overflowing the cover.
 *              below 1024 stacked under the case at its content's height.
 *            Home's selected work: the case + quote pair is a HOME shape, not the default
 *            (page-mapping § 19).
 */
export type TestimonialBesideArrangement = 'card' | 'diptych';

export type TestimonialBesideProps = {
  /**
   * The work the client is talking about, composed by the caller — in practice one linked BlockCard
   * in a one-item `<ul>` (a pattern does not import a pattern). It keeps its own description: the
   * quote sits NEXT to the case, never inside it (owner, 10 Oct 2026).
   */
  work: ReactNode;
  item: TestimonialItem;
  /**
   * The quote on the START from 1024, the work at the end. Visual only (Layout `reverse`): the DOM
   * keeps the work first, so a phone and a screen reader meet the case, then what the client said.
   */
  reverse?: boolean;
  /** Default `card`. See `TestimonialBesideArrangement`. */
  arrangement?: TestimonialBesideArrangement;
};

/**
 * TestimonialBeside — a featured case and its client's rated quote, side by side (owner, 10 Oct
 * 2026: "the quote somewhere close to the case study but not embedded in it"). The work takes the 7
 * of [7, 5] and the card the 5, a `column` apart, the card top-aligned with the work so the two
 * share a top edge (a centred card read as floating). Stacked below 1024, the work first.
 */
export function TestimonialBeside({
  work,
  item,
  reverse = false,
  arrangement = 'card',
}: TestimonialBesideProps) {
  if (!valid(item)) return <>{work}</>;
  if (arrangement === 'diptych') {
    const role = filled(item.role) ? `${item.role}, ${item.company}` : item.company;
    return (
      <Layout
        columns={{ base: 1, lg: [1, 1] }}
        reverse={reverse ? { lg: true } : undefined}
        colGap="gutter"
        rowGap="stack"
        align="start"
        className={styles.beside}
      >
        {work}
        {/* The figure IS the panel (owner, home round 4, 11 Oct 2026: "avatar inside the card
            please"): the stars at its head, the words under them, and the speaker pinned to its
            foot on the boxed card's hairline, so the person closes the panel as on every other
            boxed card. */}
        <Layout
          as="figure"
          rowGap="block"
          pinLast
          className={cx(styles.card, styles.box, styles.panel)}
        >
          {typeof item.rating === 'number' ? (
            <StarRating value={item.rating} size="md" glyph={<Icon name="star" />} onCard />
          ) : null}
          <blockquote className={cx(styles.quote, styles.quotePanel)}>
            <Prose
              html={bindShortWords(withQuoteMarks(curlQuotes(item.quoteHtml)))}
              className={styles.quoteProse}
            />
          </blockquote>
          <Cluster
            as="figcaption"
            nowrap
            colGap="text"
            align="center"
            className={cx(styles.attribution, styles.attributionRuled)}
          >
            {item.avatar ? <Avatar avatar={item.avatar} size="md" /> : null}
            <Layout rowGap="inline" className={styles.who}>
              <span className={styles.name}>{item.name}</span>
              <span className={styles.role}>{role}</span>
            </Layout>
          </Cluster>
        </Layout>
      </Layout>
    );
  }
  return (
    <Layout
      columns={{ base: 1, lg: [7, 5] }}
      reverse={reverse ? { lg: true } : undefined}
      colGap="column"
      rowGap="block"
      align="start"
      className={styles.beside}
    >
      {work}
      <TestimonialCard item={item} />
    </Layout>
  );
}
