import { AreaMark, Cluster, Layout, Section, type SectionSurface } from '@/components';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

/* The MVP board's legend, verbatim. */
const LEGEND = [
  { verdict: 'keep', label: 'Keep', words: 'What your users already rely on.' },
  { verdict: 'fix', label: 'Fix', words: 'What paying customers would break.' },
  { verdict: 'rebuild', label: 'Rebuild', words: "Only what can't carry the next stage." },
] as const;

/**
 * /design/area-mark — the keep / fix / rebuild key (17 Nov 2026, overhaul O.11): the legend form (swatch
 * and word over its line, as the MVP board's "Your prototype is the brief we build from" sets it), the
 * swatch alone beside an item, and every surface.
 */
export default function AreaMarkSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>AreaMark</h1>
          <p className={s.specNote}>
            A swatch whose edge says the verdict (solid, dotted, dashed) and, in a legend, its
            mono word. Line style and ink both differ, so the three never rest on colour alone.
            Edges clear 3:1, labels 4.5:1 on every surface (docs/specs/AreaMark.md).
          </p>
        </Layout>
      </Section>
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            <h2>On {surface}</h2>
            <Specimen title={`${surface} · the legend, as the board sets it`}>
              <Layout as="ul" rowGap="block">
                {LEGEND.map((item) => (
                  <li key={item.verdict}>
                    <Layout rowGap="tight">
                      <AreaMark verdict={item.verdict} label={item.label} />
                      <p>{item.words}</p>
                    </Layout>
                  </li>
                ))}
              </Layout>
            </Specimen>
            <Specimen title={`${surface} · swatch alone, beside an item`}>
              <Layout as="ul" rowGap="text">
                {LEGEND.map((item) => (
                  <li key={item.verdict}>
                    <Cluster colGap="tight" align="center">
                      <AreaMark verdict={item.verdict} />
                      <span>{item.words}</span>
                    </Cluster>
                  </li>
                ))}
              </Layout>
            </Specimen>
          </Layout>
        </Section>
      ))}
    </>
  );
}
