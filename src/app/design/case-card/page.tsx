import { Layout, Section, type SectionSurface } from '@/components';
import { CaseCard } from '@/patterns';
import { getKitPhoto } from '@/lib/photos';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

/* Stress copy and a kit photograph standing in for a product capture: a specimen route does not
   import content. */
const CASE = {
  eyebrow: 'Northwind · Product design',
  title: 'One way into the workflow builder',
  body: 'Users could start from a template, ask the AI for help or start from scratch, and each felt like a separate path. We brought all three into one starting point.',
  href: '#',
  ctaLabel: 'Read the Northwind case',
  image: getKitPhoto('team-laptops-table', { alt: 'The Northwind team reviewing the builder' }),
};

export default function CaseCardSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>CaseCard</h1>
          <p>
            One featured case as one card: home&rsquo;s selected work and the case index&rsquo;s
            featured cases. The 16:9 cover beside the eyebrow, claim and result on [7, 5], the
            cue a block under the story so the words and the link read as one group, the group
            centred on the cover from 1024 (owner, 18 Nov 2026), unbounded: no ground and no
            mat, the cover and the words straight on the band (owner, 18 Nov 2026), the cover
            rounded at the 8 every card image takes. The shape approved as TestimonialCase (16
            Oct 2026, round 7); the client&rsquo;s words left the card on 22 Oct 2026 (case
            study cards hold no testimonial), so the testimonials keep their own band.
          </p>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <h2>1 · Arrangements</h2>
          <Specimen
            title="default"
            note="the whole card is the case's link (19 Oct 2026): hover or focus it and the cover leans in and the cue underlines; one tab stop, named by the claim and the cue. One column below 1024"
          >
            <CaseCard {...CASE} />
          </Specimen>
          <Specimen
            title="reverse"
            note="the second card of a run mirrors the first from 1024; the DOM keeps the cover first"
          >
            <CaseCard {...CASE} reverse />
          </Specimen>
          <Specimen
            title="a story with its own link"
            note="stress: a link inside the story cannot sit inside the card's anchor, so the card is a still frame and the cue is the one real link (BlockCard's linkScope cta)"
          >
            <CaseCard
              {...CASE}
              body={undefined}
              bodyHtml={[
                'We rebuilt the planner around the <a href="#">object model</a> the research found.',
              ]}
            />
          </Specimen>
          <Specimen
            title="no eyebrow · long claim · two paragraphs"
            note="stress: a title with no client before a colon carries no eyebrow; a long claim balances; the story grows and the cue stays a block under it, the group centred on the cover"
          >
            <CaseCard
              {...CASE}
              eyebrow={undefined}
              title="An enterprise suite of forty modules that finally reads as one product to the people who use it every day"
              body={undefined}
              bodyHtml={[
                'Forty modules, built by six teams over twelve years, each with its own patterns for the same three jobs.',
                'We mapped the jobs, set one pattern for each, and moved the suite onto it a module at a time without stopping a release.',
              ]}
            />
          </Specimen>
          <Specimen
            title="326 track"
            note="a 390 viewport's column (ch05 B3); the frame cannot fire a media query, so the card still splits here at this window's width, and the 390 capture shows the real one-column stack"
          >
            <div className={s.trackMobile}>
              <CaseCard {...CASE} />
            </div>
          </Specimen>
        </Layout>
      </Section>

      {SURFACES.map((surface, index) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            {index === 0 ? <h2>2 · Four surfaces</h2> : null}
            <Specimen title={surface} note="the card's inks on this surface; it has no ground of its own">
              <CaseCard {...CASE} />
            </Specimen>
          </Layout>
        </Section>
      ))}
    </>
  );
}
