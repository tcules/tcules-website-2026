import type { Metadata } from 'next';

import { AnchorHeading, Prose } from '@/components';
import { Figure } from '@/patterns';
import { ResourceArticle } from '@/templates';

export const metadata: Metadata = {
  title: 'ResourceArticle | Design',
  robots: { index: false, follow: false },
};

const PARAGRAPH =
  'Agents run for minutes or hours, and things change while they work. Four rules keep the console honest about that. None is new to security engineers; the design work is in making them visible to the person deciding, at the moment they decide, without a manual beside them.';

/**
 * ResourceArticle: an insight's body, the contents rail beside the article column. Look for the two
 * widths: running words (paragraphs, headings, lists) stop at the reading measure, 68ch at body
 * size, about 80 characters, and a heading wraps on that same edge whatever its size; a figure, a
 * table, a rule (hr) and the author box take the whole track. Below 1024 the rail is a sticky bar.
 */
export default function ResourceArticleSpecimen() {
  return (
    <ResourceArticle
      outline={[
        { label: 'The short answer', href: '#ra-short' },
        {
          label: 'Permissions and approvals while an agent is running',
          href: '#ra-permissions',
        },
      ]}
      items={[
        {
          key: 'short',
          measure: 'text',
          node: (
            <Prose>
              <AnchorHeading id="ra-short">The short answer</AnchorHeading>
              <p>{PARAGRAPH}</p>
              <p>{PARAGRAPH}</p>
            </Prose>
          ),
        },
        {
          key: 'figure',
          measure: 'block',
          node: (
            <Figure
              image={{
                src: '/design/figure-sample-wide.svg',
                alt: 'Approval queue with five rows, two status chips and a ten-bar comparison chart.',
                width: 1600,
                height: 900,
              }}
              label="Figure 1"
              caption="The approval queue: the figure takes the whole track; its caption keeps its own measure."
            />
          ),
        },
        {
          key: 'permissions',
          measure: 'text',
          node: (
            <Prose
              html={`<hr /><h2 id="ra-permissions">Permissions and approvals while an agent is running</h2><p>${PARAGRAPH}</p><table><thead><tr><th>Rule</th><th>What the console shows</th><th>Who decides</th><th>When it applies</th></tr></thead><tbody><tr><td>Scope</td><td>Every tool the agent may call, with its limit</td><td>The owner</td><td>Before the run</td></tr><tr><td>Approval</td><td>The action waiting, its cost and its reason</td><td>The approver on duty</td><td>During the run</td></tr></tbody></table><p>${PARAGRAPH}</p>`}
            />
          ),
        },
      ]}
    />
  );
}
