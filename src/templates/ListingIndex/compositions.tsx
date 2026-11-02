import type { ReactNode } from 'react';

import { Layout, type IconName } from '@/components';
import { CARD_THREE_TRACKS } from '@/lib/image-sizes';
import type { ArticleSceneName } from '@/lib/sketches';
import {
  BlockCard,
  Teaser,
  TEASER_FORMAT_ICON,
  type TeaserImage,
  type TeaserMedia,
  type TeaserProps,
  type TeaserSize,
} from '@/patterns';

/* ── An insight as a listing places it ──────────────────────────────────────────
   A template may not import @/content, so the route maps the view model onto these and the
   template never learns whether the CMS or the specimen's fixture answered. The insights hub takes
   these compositions (insights.tsx); ListingIndex places whatever they compose. */

/** The seven formats. The templates decide each one's shape and position from this. */
export type InsightKind =
  'article' | 'guide' | 'research' | 'podcast' | 'video' | 'event' | 'interview';

export type InsightItem = {
  id: string;
  kind: InsightKind;
  title: string;
  href: string;
  /** The standfirst. Absent or blank renders the title alone. */
  description?: string;
  /** The item's own cover. Absent, the item is typographic: never a stand-in. */
  cover?: TeaserImage;
  /** ISO 8601. The route passes items newest first; this is shown, not sorted on. */
  publishedAt?: string;
  /** "11 min read". */
  readingTime?: string;
  /** "48 min". */
  duration?: string;
  /** When and where an event happens. `startsAt` is ISO 8601. */
  event?: { startsAt: string; place?: string };
  /** The scene DRAWN for this article from its own argument: its own picture until a cover exists. */
  scene?: ArticleSceneName;
  /** The CMS topics it is filed under (option ids): what the hub's BY TOPIC view curates by. */
  topics?: readonly string[];
  /** Its first topic's NAME ("Design System"): what its meta line says about it where the section
      does not already say it — never a reading time stamped identically down a list. */
  subject?: string;
};

export const LABEL: Record<InsightKind, { one: string; many: string }> = {
  article: { one: 'Article', many: 'Articles' },
  guide: { one: 'Guide', many: 'Guides' },
  research: { one: 'Research', many: 'Research' },
  podcast: { one: 'Podcast', many: 'Podcasts' },
  video: { one: 'Video', many: 'Videos' },
  event: { one: 'Event', many: 'Events' },
  interview: { one: 'Interview', many: 'Interviews' },
};

/** Each format's glyph, as the format menu set them (owner, 23 Oct 2026): the one map, Teaser's,
    which the resource rows read too (owner, 29 Oct 2026). */
const GLYPH: Record<InsightKind, IconName> = TEASER_FORMAT_ICON;

const DAY = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});
const DAY_OF_MONTH = new Intl.DateTimeFormat('en-GB', { day: 'numeric', timeZone: 'UTC' });
const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function parse(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.valueOf()) ? undefined : date;
}

export const dateOf = (iso: string | undefined) => {
  const date = parse(iso);
  return date ? DAY.format(date) : undefined;
};

/** A label line's parts, blanks dropped — Teaser joins them with " · ". */
const line = (...parts: (string | undefined)[]) => {
  const kept = parts.filter((part): part is string => Boolean(part?.trim()));
  return kept.length > 0 ? kept : undefined;
};

const WATCHED: ReadonlySet<InsightKind> = new Set(['video', 'podcast']);

/** A format a reader watches or listens to rather than reads. */
export const isWatched = (kind: InsightKind) => WATCHED.has(kind);

/** The item's own picture: its cover, or the scene drawn for it. Nothing else stands in. */
export function pictureOf(item: InsightItem): TeaserMedia | undefined {
  if (item.cover?.src.trim()) return { type: 'image', image: item.cover };
  if (item.scene) return { type: 'sketch', name: item.scene };
  return undefined;
}

export const hasPicture = (item: InsightItem) => pictureOf(item) !== undefined;

/** Has a standfirst: a lead's words then run its picture's height (beauty round 4). */
export const hasStandfirst = (item: InsightItem) => Boolean(item.description?.trim());

/** A set with its best lead first: the first piece with a picture AND a standfirst, else with a
    picture, else the first — the rest in their order. */
export function leadFirst(items: readonly InsightItem[]): InsightItem[] {
  const lead =
    items.find((item) => hasPicture(item) && hasStandfirst(item)) ??
    items.find(hasPicture) ??
    items[0];
  return lead ? [lead, ...items.filter((item) => item !== lead)] : [];
}

/** How a placement words an item's meta line. */
export type MetaOptions = {
  /** The set mixes formats (BY TOPIC): the format is the eyebrow, in the title's ink. */
  withKind?: boolean;
};

/**
 * The card's eyebrow says ONE thing, the same thing on every card (owner, 23 Oct 2026): the piece's
 * topic. Where the section already names the topic (BY TOPIC), the format says it instead. No reading
 * time, running time or publish date: a line that said something different on each card, or nothing,
 * read as noise. A piece the CMS has not filed under a topic shows no eyebrow — a content gap to fill
 * there, never a different fact standing in.
 */
export function metaOf(item: InsightItem, { withKind = false }: MetaOptions = {}) {
  return withKind ? undefined : line(item.subject);
}

/** An event's date anchor: the day as a numeral, its month under it. "Date TBC" without one. */
export function dateMarkerOf(item: InsightItem): TeaserProps['date'] {
  const date = parse(item.event?.startsAt);
  return date && item.event
    ? {
        /* Zero-padded ("02"), so the tabular day takes one width on every row. */
        day: DAY_OF_MONTH.format(date).padStart(2, '0'),
        label: MONTH_YEAR.format(date),
        dateTime: item.event.startsAt,
      }
    : { day: '—', label: 'Date TBC' };
}

/** The bits every placement shares: title, link, standfirst, the picture and its play mark. */
export function teaserOf(
  item: InsightItem,
  options: MetaOptions = {},
): Omit<TeaserProps, 'arrangement' | 'size'> {
  return {
    title: item.title,
    href: item.href,
    body: item.description,
    label: options.withKind ? LABEL[item.kind].one : undefined,
    meta: metaOf(item, options),
    media: pictureOf(item),
    play: WATCHED.has(item.kind),
  };
}

/** Events by when they happen, the latest first (the CMS orders them by when they were filed). */
export const byEventDate = (items: readonly InsightItem[]) =>
  [...items].sort(
    (a, b) =>
      (Date.parse(b.event?.startsAt ?? '') || 0) - (Date.parse(a.event?.startsAt ?? '') || 0),
  );

/** Split a set into the pieces with a picture and the typographic ones, each in date order. */
export function partition(items: readonly InsightItem[]) {
  return {
    pictured: items.filter(hasPicture),
    plain: items.filter((item) => !hasPicture(item)),
  };
}

/* ── The hub's group ────────────────────────────────────────────────────────────────
   Every group on the hub opens on its lead, the horizontal card (owner, 23 Oct 2026, after
   claude.com/resources), its cover across two thirds and its copy in the third, centred on the cover,
   with an action. Under it, its cards in rows of three — one row, or two where there are six — or two
   in two of three tracks (owner, 29 Oct 2026; halves before). No list beside or under them (owner, 23 Oct 2026: the boxed list was dropped): a piece
   with no picture is not a card here, and its format page holds it.

   The cards are the site's one card, BlockCard, so a piece looks the same here as under an article.
   A card whose piece has no eyebrow shows none. Events keep their dates (Dates). */

/** How many cards a group holds under its lead: one row of three, or two. */
export const followCount = (available: number) => (available >= 6 ? 6 : 3);

/** A piece as the site's card: its topic (or, in a mixed set, its format) as the eyebrow. */
export function cardOf(item: InsightItem, meta: MetaOptions = {}) {
  const picture = pictureOf(item);
  return {
    title: item.title,
    href: item.href,
    body: item.description?.trim() || undefined,
    /* The topic is a tag under the title, the same shape in the curated view and the finder's
       results (owner, 29 Oct 2026: "why not just hide the eyebrow in the curated view and show the
       tag?"). The curated card carries no eyebrow: its section already names the format. */
    eyebrow: meta.withKind ? LABEL[item.kind].one : undefined,
    tag: meta.withKind ? undefined : item.subject?.trim() || undefined,
    media: picture
      ? picture.type === 'image'
        ? { type: 'image' as const, image: picture.image }
        : { type: 'sketch' as const, name: picture.name }
      : undefined,
    play: isWatched(item.kind),
  };
}

/** The lead's action, in the verb its format takes. Authored case; the button sets the case. */
export const ACTION: Record<InsightKind, string> = {
  article: 'Read more',
  guide: 'Read the guide',
  research: 'Read the research',
  interview: 'Read more',
  podcast: 'Listen',
  video: 'Watch',
  event: 'See the event',
};

/** The cards: rows of three, always — two pieces take two of the three tracks, never halves (owner,
    29 Oct 2026: "the grid should never be 2 cols") — at the small step — an 18 title under the lead's serif
    (owner, 23 Oct 2026). A format page sets one grid per page of its pieces, each its own jump target. */
export function CardGrid({
  cards,
  meta,
  titleAs = 'h3',
  id,
  facts = false,
  shelf = false,
  after,
}: {
  cards: readonly InsightItem[];
  meta?: MetaOptions;
  titleAs?: 'h2' | 'h3' | 'h4';
  id?: string;
  /**
   * The finder's results (owner, 28 Oct 2026, after claude.com/resources): each card says its date
   * at the label line's end and its topic as a tag at its foot, and a piece with no picture stands
   * as a panel led by its format's glyph, so a row of mixed pieces ends level.
   */
  facts?: boolean;
  /**
   * A curated SHELF (the hub's problem sections, 26 Oct 2026 copy): every piece the copy names is a
   * card, so a piece with no picture stands as the results' panel led by its format's glyph rather
   * than dropping out; no topic tag, because the section's head already names the problem.
   */
  shelf?: boolean;
  /** One more card after the pieces, its own `li` (a shelf's related service tile). */
  after?: ReactNode;
}) {
  if (cards.length === 0 && !after) return null;
  return (
    <ListingGrid id={id}>
      {cards.map((item) => {
        const pictured = Boolean(pictureOf(item));
        /* A panel says its format: the glyph with the format's name beside it, on every panel, as
           the resource rows set it (owner, 29 Oct 2026; decisions/2026-10-29-panel-names-its-format). */
        const panel = pictured
          ? {}
          : { frame: 'panel' as const, icon: GLYPH[item.kind], eyebrow: LABEL[item.kind].one };
        return (
          <BlockCard
            key={item.id}
            {...cardOf(item, meta)}
            size="sm"
            titleAs={titleAs}
            tracks={3}
            cue="title"
            compact={!facts}
            {...(facts
              ? {
                  aside: dateOf(item.publishedAt),
                  tag: item.subject,
                  ...panel,
                }
              : shelf
                ? { tag: undefined, ...panel }
                : {})}
          />
        );
      })}
      {after}
    </ListingGrid>
  );
}

/**
 * Every listing's card grid (owner, 29 Oct 2026: "/case-studies … what happened to using the same
 * 3 card grid?"): three tracks from md, a `gutter` across and a `column` down (a borderless set's row
 * seam), one column on a phone. The insights hub's shelves and the case-study index's groups both set
 * their cards in THIS, so the two listings cannot drift into two grids again
 * (decisions/2026-10-22-listings-share-one-structure). Its children are BlockCards at `tracks={3}`.
 */
export function ListingGrid({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Layout as="ul" id={id} columns={{ md: 3 }} colGap="gutter" rowGap="column">
      {children}
    </Layout>
  );
}

/** The FEATURE: the lead, then its cards under it (see above). */
export function Feature({
  lead,
  cards,
  meta,
  titleAs = 'h3',
  shelf = false,
  after,
}: {
  lead?: InsightItem;
  cards: readonly InsightItem[];
  meta?: MetaOptions;
  titleAs?: 'h2' | 'h3' | 'h4';
  /** The cards under the lead as a curated shelf's (CardGrid `shelf`). */
  shelf?: boolean;
  /** One more card after the cards (CardGrid `after`). */
  after?: ReactNode;
}) {
  return (
    <Layout rowGap="column">
      {lead ? (
        <ul>
          <BlockCard
            {...cardOf(lead, meta)}
            /* The lead carries no topic tag (owner, 29 Oct 2026: on the horizontal card "the tag
               feels like an impediment"): its title and action are the whole of its copy column. */
            tag={undefined}
            orientation="horizontal"
            size="lg"
            titleAs={titleAs}
            tracks={2}
            cue="cta"
            ctaLabel={ACTION[lead.kind]}
            split="grid"
          />
        </ul>
      ) : null}
      <CardGrid cards={cards} meta={meta} titleAs={titleAs} shelf={shelf} after={after} />
    </Layout>
  );
}

/* ── The dated compositions: an event's day leads its row ───────────────────────── */

type Shape = {
  items: readonly InsightItem[];
  meta?: MetaOptions;
  titleAs?: 'h2' | 'h3' | 'h4';
};

/** The DATES: a row per event, the day as a numeral at its start, its picture at its end. */
export function Dates({ items, titleAs = 'h3', size = 'lg' }: Shape & { size?: TeaserSize }) {
  return (
    <Layout as="ul" rowGap="stack">
      {items.map((item) => (
        <Teaser
          key={item.id}
          {...teaserOf(item)}
          date={dateMarkerOf(item)}
          meta={item.event?.place}
          arrangement="row"
          size={size}
          titleAs={titleAs}
          sizes={CARD_THREE_TRACKS}
          graphic
        />
      ))}
    </Layout>
  );
}
