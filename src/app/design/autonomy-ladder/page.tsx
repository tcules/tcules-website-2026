import { Layout, Section, type SectionSurface } from '@/components';
import {
  AutonomyLadder,
  ContentSection,
  type AutonomyReceipt,
  type AutonomyStep,
} from '@/patterns';

import { Specimen } from '../_specimen/Specimen';

/**
 * AutonomyLadder — how much the software does on its own, step by step, with the receipt every AI
 * action leaves (docs/specs/AutonomyLadder.md; overhaul O.8, Jatin's Saas-v2 board). The board's copy
 * verbatim in its band on tint, then paper and ink, three steps, and the ladder without a receipt.
 */

const STEPS: readonly AutonomyStep[] = [
  { title: 'Manual', role: 'The person does it', example: 'Edits a contract clause', share: 0 },
  {
    title: 'Assisted',
    role: 'The person decides',
    example: 'Accepts a suggested clause',
    share: 0.34,
  },
  {
    title: 'Delegated',
    role: 'The person approves',
    example: "Reviews the agent's edits before they go out",
    share: 0.67,
  },
  {
    title: 'Autonomous',
    role: 'The person audits',
    example: 'Reads a weekly summary of what changed',
    share: 0.94,
  },
];

const NOTE = {
  label: 'Earned autonomy',
  body: 'Each capability starts in shadow mode, noting what it would have done beside the team. It moves up a step when its record earns it and an admin agrees.',
};

const RECEIPT: AutonomyReceipt = {
  title: 'Every AI action leaves a receipt',
  rows: [
    { term: 'Acted', detail: 'Which agent acted' },
    { term: 'For', detail: 'Whose work it did' },
    { term: 'Changed', detail: 'What changed' },
    { term: 'Why', detail: 'The reason, with sources' },
    { term: 'Cost', detail: 'What it used' },
    { term: 'Undo', detail: 'How to reverse it' },
  ],
  caption:
    'Labelled as AI, named to the person who answers for it, reversible and priced. The same receipt shows in Hand over, Govern and Grow.',
};

const LEGEND = 'Share of the work the software does';
const SURFACES: SectionSurface[] = ['paper', 'ink'];

export default function AutonomyLadderSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>AutonomyLadder</h1>
          <p>
            Steps of how much the software does on its own: each a plate filled to the
            software&apos;s share, its name, the person&apos;s job and an example, read left to
            right along an arrow. The receipt sits beside it from 1024 as a torn slip.
          </p>
        </Layout>
      </Section>

      <ContentSection
        surface="tint"
        eyebrow="The AI dimension"
        heading="How much should the software do on its own?"
        headingId="ladder-tint"
        lead="Decide it per capability, never once for the whole product. Each step up changes the person's job."
      >
        <AutonomyLadder steps={STEPS} legend={LEGEND} note={NOTE} receipt={RECEIPT} />
      </ContentSection>

      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Specimen title={`${surface} · the board's copy`}>
            <AutonomyLadder steps={STEPS} legend={LEGEND} note={NOTE} receipt={RECEIPT} />
          </Specimen>
        </Section>
      ))}

      <Section surface="tint">
        <Layout rowGap="stack">
          <Specimen title="three steps, no receipt" note="The ladder takes the whole column.">
            <AutonomyLadder steps={STEPS.slice(1)} legend={LEGEND} note={NOTE} />
          </Specimen>
          <Specimen title="no note" note="No arrow and no note: the steps end the block.">
            <AutonomyLadder steps={STEPS} legend={LEGEND} receipt={RECEIPT} />
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
