import { useId } from 'react';

import { Layout, Section, type SectionSurface } from '@/components';

import { CardGrid, type InsightItem } from './compositions';

/**
 * InsightResources — "Explore other resources" after an insight: the same insight cards the
 * insights finder sets (owner, 30 Oct 2026: insight cards site-wide are their cover, else the panel
 * with the format's glyph — never a ruled text card with a "Read insight" line). Each card names its
 * format in the eyebrow, carries its authored date, and is title-cued.
 *
 * Paper by default. The insight detail pages set it on tint as their last band before the footer
 * (owner, 2 Nov 2026); a caller that follows it with a tinted close keeps paper, so two tints never meet.
 */
export function InsightResources({
  heading,
  items,
  surface = 'paper',
}: {
  heading: string;
  items: readonly InsightItem[];
  surface?: SectionSurface;
}) {
  const headingId = useId();
  if (items.length === 0) return null;
  return (
    <Section surface={surface} aria-labelledby={headingId}>
      <Layout rowGap="stack">
        <h2 id={headingId}>{heading}</h2>
        <CardGrid cards={items} meta={{ withKind: true }} facts />
      </Layout>
    </Section>
  );
}
