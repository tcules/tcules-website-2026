import { Layout, Section } from '@/components';
import { Steps, type Step } from '@/patterns';
import { ROUTES } from '@/lib/routes';

import { Specimen } from '../_specimen/Specimen';

/**
 * Steps — ListCard's set mode, the approved F body (src/patterns/ListCard/Steps.tsx). Every count
 * from two to five, the two body budgets, the stress title, and the set in the two tracks it lives
 * in: the 763 beside body track and the 667 media copy column. The family page
 * (/design/kit/process) shows it in its bands.
 */

const FOUR: readonly Step[] = [
  { title: 'Frame the decision', body: 'What the product must decide, who owns it, and what would settle it.' },
  { title: 'Probe the risk', body: 'A coded probe puts the riskiest assumption in front of real users.' },
  { title: 'Specify and build', body: 'Design and engineering build from one record of states and rules.' },
  { title: 'Ship and observe', body: 'Released against a measure agreed up front, and read again after.' },
];

const FIVE: readonly Step[] = [
  { title: 'Map', body: 'The problem, the people, the question.' },
  { title: 'Sketch', body: 'Competing answers from different hands.' },
  { title: 'Decide', body: 'One direction, chosen against the question.' },
  { title: 'Prototype', body: 'A realistic surface, built in a day.' },
  { title: 'Test', body: 'Five people use it; we watch.' },
];

const STRESS: readonly Step[] = [
  { title: 'Cross-functional acceptance review', body: 'A long title balances onto two lines; the body stays under it.' },
  { title: 'Ship', body: 'One word.' },
  { title: 'Observe' },
];

export default function StepsSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Steps</h1>
          <p>
            Numbered ListCard rows in an ordered list, read top to bottom: a method. The blue index
            beside an h4 title at every count, the body under the title at the lead measure, the
            numeral on the content edge, and the body budget set by the count — two lines at four
            rows or fewer, one line at five. Seen in its bands on <a href={ROUTES.designKitProcess}>the process and stats family page</a>.
          </p>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Specimen title="four steps · two-line bodies · the beside body track (763)" note="12–20 words a body: two lines at the 56ch cap.">
            <Layout columns={{ lg: [1, 2] }} offset={{ lg: 1 }} colGap="section">
              <Steps steps={FOUR} />
            </Layout>
          </Specimen>
          <Specimen title="five steps · one-line bodies · the beside body track" note="≤ 10 words a body: five two-line rows read as a wall.">
            <Layout columns={{ lg: [1, 2] }} offset={{ lg: 1 }} colGap="section">
              <Steps steps={FIVE} />
            </Layout>
          </Specimen>
          <Specimen title="four steps · the media copy column (667)" note="The F media split's copy column: the body keeps its 56ch cap, so the rows read the same as in the wider track.">
            <Layout columns={{ lg: [5, 7] }} offset={{ lg: 1 }} colGap="section">
              <Steps steps={FOUR} />
            </Layout>
          </Specimen>
          <Specimen title="two steps · the minimum, and h4 titles under an h3" note="titleAs=h4 changes the element, never the size.">
            <Steps titleAs="h4" steps={FOUR.slice(0, 2)} />
          </Specimen>
          <Specimen title="stress · a long title, a one-word body, a title alone">
            <Steps steps={STRESS} />
          </Specimen>
          <Specimen
            title='measure="reading" · a block of an article reading column (the tool pages)'
            note="The set takes the column's one measure (--measure-body): titles and bodies run to it, and the rules end where the text can, never past a half-empty row (4 Nov 2026)."
          >
            <Steps measure="reading" steps={FIVE} />
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
