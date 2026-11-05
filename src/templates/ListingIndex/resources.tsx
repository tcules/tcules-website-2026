import { useId } from 'react';

import { Layout, Section, type SectionSurface } from '@/components';

import { CardGrid, type InsightItem } from './compositions';

/**
 * InsightResources — "Explore other resources" after an insight: the same insight cards the
 * insights finder sets (owner, 30 Oct 2026: insight cards site-wide are their cover, else the panel
 * with the format's glyph — never a ruled text card with a "Read insight" line). Each card names its
 * format in the eyebrow, carries its authored date, and is title-cued.
 *
 * Paper by default: the page's close is the tint band, and two tints never meet.
 */
export function InsightResources({
  heading,
  id,
  description,
  items,
  surface = 'paper',
}: {
  heading: string;
  id?: string;
  description?: string;
  items: readonly InsightItem[];
  surface?: SectionSurface;
}) {
  const headingId = useId();
  if (items.length === 0) return null;
  return (
    <Section id={id} surface={surface} aria-labelledby={headingId}>
      <Layout rowGap="stack">
        {description ? (
          <Layout rowGap="block">
            <h2 id={headingId}>{heading}</h2>
            <p>{description}</p>
          </Layout>
        ) : (
          <h2 id={headingId}>{heading}</h2>
        )}
        <CardGrid cards={items} meta={{ withKind: true }} facts />
      </Layout>
    </Section>
  );
}
