import { Layout } from '@/components';
import { splitClaim } from '@/lib/claim';
import { BlockCard, type BlockCardImage } from '@/patterns';

import { ListingGrid } from './compositions';
import type { ListingFinder, ListingView } from './ListingIndex';
import { listingFinder, type FinderArgs } from './listingFinder';

/* ── The case-study index, as ListingIndex data ────────────────────────────────────
   What the case-study index puts in the listing's sections: its groups of cases, each shaped by its
   position and its count. Built here and handed to ListingIndex, which places them as it places the
   insights hub's — one opening, one rail, one section head and one close (owner, 22 Oct 2026). */

/**
 * One case study as the index shows it. The template's own shape, not the view model's: a template
 * may not import @/content, so the page maps its record onto this and the template never learns
 * where the record came from.
 */
export type CaseItem = {
  id: string;
  /** The case's page. Absent for a case the copy lists before its page exists ("Case study coming
      soon"): its card is shown, unlinked, and it never leads a group. */
  href?: string;
  title: string;
  eyebrow?: string;
  /** The one line under the title: 8–15 words (strapi-changes.md §13). */
  description: string;
  cover?: BlockCardImage;
  /**
   * The description as trusted inline HTML, one entry per paragraph (page-mapping G3). Exclusive
   * with `description`, which it replaces where a card carries more than a line ("Our role: …").
   */
  bodyHtml?: readonly string[];
  ctaLabel?: string;
  /** An explicit CMS setting overrides the lead card’s default cue. */
  showCta?: boolean;
  /**
   * A case the page features: the group's FIRST featured case leads it as the listing's horizontal
   * card (the insights hub's lead: cover across two thirds, copy in the third, no ground); without
   * one, the group's first case leads; the others open the grid under it (owner, 29 Oct 2026). Never CaseCard on its paper-deep ground, which is home's
   * alone (owner, 29 Oct 2026). The card carries no testimonial (owner, 22 Oct 2026: "case study
   * cards never hold testimonials in them").
   */
  featured?: boolean;
};

/** One group of cases under its own heading (page-mapping G9), one jump target in the rail. */
export type CaseGroup = {
  /** The group's anchor, unique across every view (every view is in the HTML). */
  id: string;
  heading: string;
  items: readonly CaseItem[];
};

/** One way of sorting the cases (BY STAGE, BY INDUSTRY) and its groups. */
export type CaseView = {
  id: string;
  label: string;
  groups: readonly CaseGroup[];
};

/**
 * The case-study index's views as listing views. Every group is one shape (owner, 29 Oct 2026:
 * "the /case-studies page is horrible. what happened to using the same 3 card grid?";
 * decisions/2026-10-29-case-listing-groups-lead-horizontal): one case as the card-less horizontal lead, then
 * every other case as a card in the listing's one three-track grid (`ListingGrid`, the same the
 * insights hub's shelves use). No arrangement is chosen by a
 * group's id, position or count any more: the varied shapes (a featured set, two columns of
 * thumbnail rows, 2-up large covers) were the problem, not a feature.
 */
export function caseViews(views: readonly CaseView[], preserveOrder = false): ListingView[] {
  return views.map((view) => ({
    id: view.id,
    label: view.label,
    sections: view.groups
      .filter((group) => group.items.length > 0)
      .map((group) => ({
        id: group.id,
        heading: group.heading,
        count: group.items.length,
        content: <CaseRun items={group.items} preserveOrder={preserveOrder} />,
      })),
  }));
}

/** The record's body: its HTML paragraphs where it has them, else its one line. */
const bodyOf = (item: CaseItem) =>
  item.bodyHtml ? { bodyHtml: item.bodyHtml } : { body: item.description || undefined };

const coverOf = (item: CaseItem) =>
  item.cover ? { media: { type: 'image' as const, image: sized(item.cover) } } : {};

/** A cover with its intrinsic size, 16:9 where the record states none. */
const sized = (cover: BlockCardImage) => ({
  ...cover,
  width: cover.width ?? 1600,
  height: cover.height ?? 900,
});

/**
 * One run of cases, the listing's ONE shape for every group and for the finder's results (owner,
 * 29 Oct 2026; decisions/2026-10-29-case-listing-groups-lead-horizontal): the first case is the card-less
 * horizontal card across the full row, its cover across two of the grid's three tracks, and every
 * other case is a card in the listing's three-track grid under it. The lead is the group's first
 * featured case, else its first; it needs its cover and its page to lead, so a case without them
 * joins the grid and the next one that has them leads instead. No other card shape.
 */
function CaseRun({
  items,
  titleAs = 'h3',
  preserveOrder = false,
}: {
  items: readonly CaseItem[];
  titleAs?: 'h2' | 'h3';
  preserveOrder?: boolean;
}) {
  const canLead = (item: CaseItem) => Boolean(item.cover && item.href);
  const lead = items.find((item) => item.featured && canLead(item)) ?? items.find(canLead);
  const leadIndex = lead ? items.indexOf(lead) : 0;
  const leadCta = lead?.showCta !== false;
  const before = preserveOrder ? items.slice(0, leadIndex) : [];
  const rest =
    preserveOrder && lead ? items.slice(leadIndex + 1) : items.filter((item) => item !== lead);

  return (
    <Layout rowGap="column">
      {before.length > 0 ? <CaseCards items={before} titleAs={titleAs} /> : null}
      {lead ? (
        /* The hub's lead exactly: the cover leading, so a phone stacks it cover-first. Not compact
           on a phone: a case card's words are the copy's, and the compact row drops its body. */
        <ul>
          <BlockCard
            {...(lead.eyebrow
              ? { title: lead.title, eyebrow: lead.eyebrow }
              : splitClaim(lead.title))}
            {...bodyOf(lead)}
            {...coverOf(lead)}
            href={lead.href}
            orientation="horizontal"
            size="lg"
            tracks={2}
            titleAs={titleAs}
            cue={leadCta ? 'cta' : 'title'}
            ctaLabel={leadCta ? (lead.ctaLabel ?? 'Read the case') : undefined}
            split="grid"
          />
        </ul>
      ) : null}
      {rest.length > 0 ? <CaseCards items={rest} titleAs={titleAs} /> : null}
    </Layout>
  );
}

/**
 * Cases as the hub's cards: the small step, the whole card the link, in the listing's one grid. A
 * case listed before its page exists ("Case study coming soon") keeps its place, unlinked, at the
 * same size as its neighbours — never the largest placeholder on the page.
 */
function CaseCards({
  items,
  titleAs = 'h3',
}: {
  items: readonly CaseItem[];
  titleAs?: 'h2' | 'h3';
}) {
  return (
    <ListingGrid>
      {items.map((item) => (
        <BlockCard
          key={item.id}
          title={item.title}
          eyebrow={item.eyebrow}
          {...bodyOf(item)}
          {...coverOf(item)}
          href={item.href}
          size="sm"
          tracks={3}
          titleAs={titleAs}
          cue={item.showCta ? 'cta' : 'title'}
          ctaLabel={item.ctaLabel}
        />
      ))}
    </ListingGrid>
  );
}

/**
 * The case-study index's finder (owner, 29 Oct 2026: "/case-studies becomes the same FINDER as
 * /insights"): the listing's one finder, its results the cases the picks let through as one grid of
 * the same cards, twelve at a time.
 */
export function caseFinder({
  items,
  shown,
  preserveOrder,
  ...rest
}: Omit<FinderArgs, 'total' | 'results'> & {
  /** Every case the picks let through, in the page's order. */
  items: readonly CaseItem[];
  preserveOrder?: boolean;
}): ListingFinder {
  return listingFinder({
    ...rest,
    shown,
    total: items.length,
    /* The results take the groups' shape: the first horizontal, the rest in the grid. */
    results: (
      <CaseRun items={items.slice(0, shown)} titleAs="h2" preserveOrder={preserveOrder} />
    ),
  });
}
