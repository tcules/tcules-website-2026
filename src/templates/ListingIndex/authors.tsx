import { useId } from 'react';

import { Layout, Section } from '@/components';
import { BlockCard, Teaser, TEASER_FORMAT_ICON } from '@/patterns';

import {
  ACTION,
  CardGrid,
  cardOf,
  dateOf,
  followCount,
  hasPicture,
  LABEL,
  type InsightItem,
} from './compositions';

/* ── One person's pieces (an author page, 1 Nov 2026) ─────────────────────────────
   A person's pieces are one stream, newest first, and most of them have no picture (74 of 98 live
   insights). A grid of the hub's cards set them as one rectangle repeated six or seven rows deep,
   panels beside covers, and an empty cover box on every piece without a picture. So the set has
   three registers, each drawn ONE way, never mixed (decisions/2026-10-11-card-variants-stay-distinct):

     the latest piece   the wide feature: the hub lead's horizontal card. With its cover, the cover
                        beside its words; without, the card's own text-only split, its head beside its
                        standfirst and action, so it never reserves a box for a picture it lacks.
     the pictured ones  where two or more of the rest have a picture, the hub's cards in rows of
                        three (two in two of the tracks, one row, or two rows where there are six),
                        as the hub's groups take them: every card a cover, no panels.
     everything else    the resource ledger, one piece per ruled row (home's "Selected thinking";
                        owner, 30 Oct 2026: a ruled list is fine at one item per row): the format's
                        glyph and name with the date in the meta column, the title and standfirst,
                        an arrow at the row's end.

   Not grouped by type: two pieces would make two one-item sections, and every row already names its
   format. Nothing behind a "show more" (decisions/2026-10-16-no-hidden-cards). */

/** The ledger's rows for a set of pieces. */
function Ledger({ items }: { items: readonly InsightItem[] }) {
  if (items.length === 0) return null;
  return (
    <Layout as="ul" rowGap="none">
      {items.map((item) => {
        const date = dateOf(item.publishedAt);
        return (
          <Teaser
            key={item.id}
            arrangement="row"
            metaAside
            ruled
            arrow
            size="lg"
            title={item.title}
            href={item.href}
            body={item.description}
            label={LABEL[item.kind].one}
            icon={TEASER_FORMAT_ICON[item.kind]}
            meta={date ? [date] : undefined}
          />
        );
      })}
    </Layout>
  );
}

/**
 * AuthorPieces — every live piece credited to one person, under a head that counts them: the latest
 * as the wide feature, the pictured rest as the hub's cards where there are two or more,
 * then the ledger. A person with two pieces gets the feature and one row; with twenty-five, the
 * feature, a row or two of covers and the ledger. Renders nothing for no pieces.
 */
export function AuthorPieces({
  heading,
  items,
}: {
  heading: string;
  /** Every piece, newest first. */
  items: readonly InsightItem[];
}) {
  const headingId = useId();
  const [latest, ...rest] = items;
  if (!latest) return null;

  const pictured = rest.filter(hasPicture);
  const cards = pictured.length >= 2 ? pictured.slice(0, followCount(pictured.length)) : [];
  const shown = new Set(cards.map((card) => card.id));
  const listed = rest.filter((item) => !shown.has(item.id));

  return (
    <Section surface="paper" aria-labelledby={headingId}>
      <Layout rowGap="stack">
        <h2 id={headingId}>{heading}</h2>
        <Layout rowGap="column">
          <ul>
            <BlockCard
              {...cardOf(latest, { withKind: true })}
              aside={dateOf(latest.publishedAt)}
              orientation="horizontal"
              size="lg"
              titleAs="h3"
              tracks={2}
              cue="cta"
              ctaLabel={ACTION[latest.kind]}
              split="grid"
            />
          </ul>
          <CardGrid cards={cards} meta={{ withKind: true }} facts />
          <Ledger items={listed} />
        </Layout>
      </Layout>
    </Section>
  );
}
