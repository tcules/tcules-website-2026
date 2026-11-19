import { ContentSection } from '@/patterns';
import type { CorpusPage } from '@/lib/corpus-types';

import { CorpusHero, EnquiryBand, FaqItems, GenericBlocks, head } from './blocks';
import { formBeforeFaq } from './order';
import { kindOf } from './plan';

export type PlainPageProps = { page: CorpusPage };

/**
 * TIER 3 — the PLAIN FALLBACK for a corpus page whose hand-composed template no longer matches its
 * copy (the 26 Oct 2026 copy reshaped About's bands). Not a design: the hero stacked, then every band
 * in the content team's order as a headed section of its blocks, the FAQ as an accordion, the enquiry
 * as home's close. It exists so a route keeps rendering every word while its template is redone; a
 * route on it is listed in docs/page-build/census.md's fallback list and warns in development.
 */
export function PlainPage({ page }: PlainPageProps) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `PlainPage ${page.route}: rendering on the plain fallback until its template is redone.`,
    );
  }
  return (
    <>
      <CorpusHero page={page} />
      {formBeforeFaq(page.bands).map((band) => {
        const kind = kindOf(band);
        if (kind === 'enquiry')
          return (
            <EnquiryBand
              key={band.id}
              page={page}
              band={band}
              island={{ surface: 'blue', dress: 'card', arrangement: 'halves' }}
            />
          );
        if (kind === 'faq')
          return (
            <ContentSection
              key={band.id}
              {...head(band)}
              data-band="D-faq"
              arrangement="beside"
            >
              <FaqItems band={band} />
            </ContentSection>
          );
        return (
          <ContentSection key={band.id} {...head(band)}>
            <GenericBlocks band={band} />
          </ContentSection>
        );
      })}
    </>
  );
}
