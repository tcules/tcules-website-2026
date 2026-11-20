import { Section } from '@/components';

import { Specimen } from './Specimen';

/**
 * A caption strip above a full band: the variation's name and what to look for, in its own flush
 * Section so the band under it keeps its own padding and ground. Scaffolding for the specimens that
 * render whole bands (OfferSheet, CaseSpread, EngagementOptions).
 */
export function Variation({ id, title, note }: { id: string; title: string; note: string }) {
  return (
    <Section flush id={id}>
      <Specimen title={title} note={note}>
        {null}
      </Specimen>
    </Section>
  );
}
