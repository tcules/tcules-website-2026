import type { Metadata } from 'next';

import { AnchorHeading, Layout, Prose, Section, type SectionSurface } from '@/components';

import { Specimen } from '../_specimen/Specimen';

export const metadata: Metadata = {
  title: 'AnchorHeading | Design',
  robots: { index: false, follow: false },
};

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

/**
 * AnchorHeading: a section heading with a copy-link control after its last word. Press it (or
 * Enter on it) and the page's URL with the heading's #id is copied; "Link copied" shows for two
 * seconds and is announced. Look for: the control never wraps alone onto a line; it sits in the
 * muted ink at rest and moves to the link ink on hover and focus; the 44 target; every surface.
 */
export default function AnchorHeadingSpecimen() {
  return (
    <>
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            <Specimen title={`${surface} · inside Prose, h2`}>
              <Prose>
                <AnchorHeading id={`ah-${surface}-short`}>AI agent permissions</AnchorHeading>
                <p>
                  The paragraph under it, so the heading&apos;s Prose rhythm reads as it does in
                  an article.
                </p>
              </Prose>
            </Specimen>
            <Specimen
              title={`${surface} · a heading that wraps`}
              note="The last word and the control are glued: the control never starts a line by itself."
            >
              <Prose>
                <AnchorHeading id={`ah-${surface}-long`}>
                  How to tell an agent is getting worse, and roll it back before anyone notices
                </AnchorHeading>
              </Prose>
            </Specimen>
            <Specimen title={`${surface} · h3`}>
              <Prose>
                <AnchorHeading id={`ah-${surface}-h3`} as="h3">
                  Permissions and approvals while an agent is running
                </AnchorHeading>
              </Prose>
            </Specimen>
          </Layout>
        </Section>
      ))}
    </>
  );
}
