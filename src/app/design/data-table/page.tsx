import { Icon, Layout, Section, type SectionSurface } from '@/components';
import { auditPath, ROUTES, servicePath } from '@/lib/routes';
import { DataTable, type DataTableProps, type DataTableRow } from '@/patterns';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

/**
 * DataTable proving ground — docs/specs/DataTable.md § 15.
 *
 * Every table here is markup the pattern would receive from the seam: plain-text heads and row
 * headers, and one seam-sanitised rich-text string per data cell. Nothing is styled from this file.
 *
 * ── Reading the two widths ────────────────────────────────────────────────────────────────────
 * The table never restacks. When its columns' floors add up to more than its track, the frame
 * scrolls sideways — so every table inside `.trackMobile` (the 326 phone column) and inside the
 * 392 three-up track scrolls at any window width, and at 390 most tables on the page do.
 */

const p = (html: string) => `<p>${html}</p>`;

/* ── Content ─────────────────────────────────────────────────────────────────────────────────── */

const ROUTE_TABLE: DataTableProps = {
  caption: 'Modernisation route comparison',
  summary: 'A high-level comparison of disruption, investment and delivery approach.',
  keyColumn: { heading: 'Route' },
  columns: [{ heading: 'Typical disruption' }, { heading: 'Delivery approach' }],
  rows: [
    { header: 'Repair', cellsHtml: [p('Low'), p('Targeted improvements')] },
    {
      header: 'Progressive modernisation',
      cellsHtml: [p('Medium'), p('Incremental replacement')],
    },
    { header: 'Selective rebuild', cellsHtml: [p('High'), p('Controlled replacement')] },
  ],
};

const THREE_COLUMNS: DataTableProps = {
  caption: 'Where each design-system representation lives',
  keyColumn: { heading: 'Representation' },
  columns: [{ heading: 'Source of truth' }, { heading: 'Owner' }, { heading: 'Drift signal' }],
  rows: [
    {
      header: 'Design tokens',
      cellsHtml: [
        p('The token layer in the repository'),
        p('Design engineering'),
        p('A value in Figma with no token behind it'),
      ],
    },
    {
      header: 'Components',
      cellsHtml: [
        p('The coded component and its specimen'),
        p('Product engineering'),
        p('A variant that exists in one tool only'),
      ],
    },
    {
      header: 'Guidance',
      cellsHtml: [
        p('The documentation site'),
        p('Design operations'),
        p('A rule nobody can find the reason for'),
      ],
    },
    {
      header: 'Patterns',
      cellsHtml: [
        p('Composed blocks in the pattern tier'),
        p('Design and engineering jointly'),
        p('The same block rebuilt on two routes'),
      ],
    },
    {
      header: 'Content model',
      cellsHtml: [
        p('The CMS schema'),
        p('Content design'),
        p('A field the page layout cannot render'),
      ],
    },
  ],
};

const FIVE_COLUMNS: DataTableProps = {
  caption: 'Design-system investment options',
  summary:
    'Five ways to invest, from doing nothing new to a full platform. Read across a row to see what one option costs and what it buys.',
  keyColumn: { heading: 'Investment option' },
  columns: [
    { heading: 'Scope' },
    { heading: 'Team' },
    { heading: 'First release' },
    { heading: 'Main risk' },
    { heading: 'Fits when' },
  ],
  rows: [
    {
      header: 'No new system',
      cellsHtml: [
        p('Audit and tidy what exists'),
        p('One designer'),
        p('Two weeks'),
        p('Drift continues'),
        p('One product, one team'),
      ],
    },
    {
      header: 'Shared foundations',
      cellsHtml: [
        p('Tokens and type only'),
        p('Designer and engineer'),
        p('Four weeks'),
        p('Components diverge'),
        p('Two products share a brand'),
      ],
    },
    {
      header: 'Core library',
      cellsHtml: [
        p('Tokens plus the twenty most used components'),
        p('A small squad'),
        p('Eight weeks'),
        p('Adoption stalls'),
        p('Several teams ship weekly'),
      ],
    },
    {
      header: 'Full platform',
      cellsHtml: [
        p('Library, documentation and governance'),
        p('A dedicated team'),
        p('A quarter'),
        p('Cost outruns use'),
        p('A product portfolio'),
      ],
    },
  ],
};

const EIGHT_ROWS: DataTableProps = {
  caption: 'Product responsibilities in an AI feature',
  keyColumn: { heading: 'Product responsibility' },
  columns: [{ heading: 'What it decides' }, { heading: 'Where it fails' }],
  rows: (
    [
      ['Context and retrieval', 'What the model can see', 'Stale or missing sources'],
      ['Prompting', 'How the task is framed', 'Instructions that contradict the interface'],
      ['Model choice', 'Cost, speed and quality', 'A model sized for the demo'],
      ['Output shaping', 'What the user receives', 'Free text where a structure was needed'],
      ['Review', 'Who checks before it acts', 'Approval nobody can see'],
      ['Recovery', 'What happens when it is wrong', 'No undo'],
      ['Evaluation', 'Whether it is getting better', 'A test set nobody updates'],
      ['Cost control', 'What a request is allowed to spend', 'A bill nobody forecast'],
    ] satisfies readonly (readonly [string, string, string])[]
  ).map(([header, a, b]) => ({ header, cellsHtml: [p(a), p(b)] })),
};

const LONG_HEADERS: DataTableProps = {
  caption: 'Research uncertainty and the method that answers it',
  keyColumn: { heading: 'Uncertainty' },
  columns: [{ heading: 'Method' }, { heading: 'What it cannot tell you' }],
  rows: [
    {
      header: 'The team does not understand the work the product supports',
      cellsHtml: [
        p('Contextual inquiry with four to six people doing the work'),
        p('How common each behaviour is'),
      ],
    },
    {
      header: 'Nobody agrees which problem is the expensive one',
      cellsHtml: [p('Support-ticket and session analysis'), p('Why people behave that way')],
    },
    {
      header: 'The redesign is finished but untested',
      cellsHtml: [p('Moderated usability testing'), p('Whether it will be adopted')],
    },
  ],
};

const NUMERIC: DataTableProps = {
  caption: 'Illustrative audit effort by product size',
  keyColumn: { heading: 'Product size' },
  columns: [
    { heading: 'Screens reviewed', behaviour: 'numeric' },
    { heading: 'Days', behaviour: 'numeric' },
    { heading: 'What is reviewed' },
  ],
  rows: [
    { header: 'Single workflow', cellsHtml: [p('12'), p('3'), p('One end-to-end task')] },
    { header: 'Product area', cellsHtml: [p('48'), p('8'), p('A module and its settings')] },
    { header: 'Whole product', cellsHtml: [p('160'), p('15'), p('Every primary route')] },
    { header: 'Portfolio', cellsHtml: [p('1,240'), p('40'), p('Several products sampled')] },
  ],
};

const MONO_KEY: DataTableProps = {
  caption: 'Criteria a hardening review checks first',
  keyColumn: { heading: 'Criterion', behaviour: 'nowrap' },
  columns: [{ heading: 'Token', behaviour: 'nowrap' }, { heading: 'What passing looks like' }],
  rows: [
    {
      header: 'SC 2.5.8',
      cellsHtml: [
        p('<code>--btn-hit-min</code>'),
        p('Every target is at least 24 by 24 CSS pixels, or spaced so its circle clears.'),
      ],
    },
    {
      header: 'SC 1.4.3',
      cellsHtml: [
        p('<code>--prose-ink</code>'),
        p('Body text measures at least 4.5:1 on every surface it can land on.'),
      ],
    },
    {
      header: 'SC 2.4.7',
      cellsHtml: [
        p('<code>--btn-ring-color</code>'),
        p('A keyboard ring that clears 3:1 against the gap colour beneath it.'),
      ],
    },
  ],
};

const HOLD: DataTableProps = {
  caption: 'A held key column beside a greedy prose column',
  keyColumn: { heading: 'Observed condition', behaviour: 'hold' },
  columns: [{ heading: 'What it usually means' }],
  rows: [
    {
      header: 'Every screen has its own spacing',
      cellsHtml: [
        p(
          'There is no shared layout primitive, so every team has solved the same arrangement independently and the fixes are now load-bearing. The redesign has to replace the mechanism, not the values, or the drift returns inside a quarter.',
        ),
      ],
    },
    {
      header: 'Forms fail in review',
      cellsHtml: [
        p(
          'Validation lives in each form rather than in a shared control, so the same error is worded four ways and none of them says what to do next.',
        ),
      ],
    },
    {
      header: 'Nobody trusts the dashboard',
      cellsHtml: [
        p(
          'The figures are right but their dates are not shown, so a stale number and a live one look identical.',
        ),
      ],
    },
  ],
};

const MARKS: DataTableProps = {
  caption: 'Current condition and the service that addresses it',
  summary:
    'Inline marks survive the seam: links, emphasis, strong and code all reach the cell, and each one is styled by Prose exactly as it is in a paragraph.',
  keyColumn: { heading: 'Current condition' },
  columns: [{ heading: 'Service' }, { heading: 'What changes' }],
  rows: [
    {
      header: 'Teams disagree about what should become shared',
      cellsHtml: [
        p(
          `<a href="${servicePath('design-systems/design-system-strategy')}">Design System Strategy</a>`,
        ),
        p('Scope, authority, ownership and <strong>investment boundary</strong>'),
      ],
    },
    {
      header: 'Figma and code have drifted',
      cellsHtml: [
        p(
          `<a href="${servicePath('design-systems/figma-storybook-alignment')}">Figma and Storybook alignment</a>`,
        ),
        p('One <em>source of truth</em> per property, checked by <code>tokens:check</code>'),
      ],
    },
    {
      header: 'The product has never been audited',
      cellsHtml: [
        p(`<a href="${auditPath('design-to-code-audit')}">Design-to-code audit</a>`),
        p(
          'A dated finding for every route.</p><p>A second paragraph in one cell keeps Prose’s paragraph beat.',
        ),
      ],
    },
  ],
};

const EMPTY_CELLS: DataTableProps = {
  caption: 'Where each option applies',
  keyColumn: { heading: 'Option' },
  columns: [{ heading: 'Web' }, { heading: 'Native' }, { heading: 'Note' }],
  rows: [
    { header: 'Shared tokens', cellsHtml: [p('Yes'), p('Yes'), ''] },
    {
      header: 'Shared components',
      cellsHtml: [p('Yes'), '', p('Native keeps its own controls')],
    },
    { header: 'Shared content model', cellsHtml: ['', '', ''] },
  ],
};

const SURFACE_TABLE: DataTableProps = {
  ...ROUTE_TABLE,
  rows: [
    ROUTE_TABLE.rows[0]!,
    /* The picked row on every surface (pick, owner 2 Nov 2026). */
    { ...ROUTE_TABLE.rows[1]!, pick: true },
    ...ROUTE_TABLE.rows.slice(2),
    {
      header: 'Full rebuild',
      cellsHtml: [
        p('Very high'),
        p(`<a href="${ROUTES.services}">Replacement</a>, then migration`),
      ],
    },
  ],
};

const NINE_ROWS: DataTableProps = {
  ...EIGHT_ROWS,
  caption: 'Nine rows — one past the designed range',
  rows: [
    ...EIGHT_ROWS.rows,
    {
      header: 'Observability',
      cellsHtml: [p('What the team can see'), p('Logs nobody reads')],
    },
  ],
};

const KEY_ONLY: DataTableProps = {
  caption: 'One column — the key column alone',
  keyColumn: { heading: 'Principle' },
  columns: [],
  rows: [
    { header: 'Name the owner' },
    { header: 'Date the evidence' },
    { header: 'Show the cost' },
  ].map((row): DataTableRow => ({ ...row, cellsHtml: [] })),
};

const SIX_DATA: DataTableProps = {
  caption: 'Six data columns — the live outlier, one past the designed range',
  keyColumn: { heading: 'Capability' },
  columns: ['Repair', 'Refactor', 'Replatform', 'Rebuild', 'Retire', 'Replace'].map(
    (heading) => ({ heading }),
  ),
  rows: ['Data', 'Interface', 'Integrations', 'Operations'].map((header) => ({
    header,
    cellsHtml: ['Low', 'Medium', 'High', 'High', 'None', 'Very high'].map(p),
  })),
};

const MISMATCH: DataTableProps = {
  caption: 'Rows that disagree with their columns',
  keyColumn: { heading: 'Row' },
  columns: [{ heading: 'First' }, { heading: 'Second' }, { heading: 'Third' }],
  rows: [
    { header: 'Complete', cellsHtml: [p('One'), p('Two'), p('Three')] },
    { header: 'Short by one — padded', cellsHtml: [p('One'), p('Two')] },
    {
      header: 'Long by one — truncated',
      cellsHtml: [p('One'), p('Two'), p('Three'), p('Four')],
    },
    { header: '', cellsHtml: [p('Blank row header'), p('Two'), p('Three')] },
  ],
};

/* A long record — twelve facts, one value column — for `split`. */
const LONG_RECORD: DataTableProps = {
  keyColumn: { heading: 'Fact' },
  columns: [{ heading: 'Current public record' }],
  rows: [
    ['Company', 'Northwind Studio Private Limited'],
    ['Category', 'Digital product design studio'],
    ['Founded', '2017'],
    ['Headquarters and studio', 'Ahmedabad, India'],
    ['Core practice', 'Product Design'],
    ['Projects', 'More than 90'],
    ['Client reach', '19 countries'],
    ['Typical clients', 'Growth-stage SaaS teams and established software companies'],
    ['Engagement models', 'Fixed-price audits, fixed-scope projects and monthly partnerships'],
    ['Collaboration', 'A lead designer guides the work and is your main point of contact'],
    ['Languages', 'English, Hindi and Gujarati'],
  ].map(([header, value]) => ({ header: header ?? '', cellsHtml: [p(value ?? '')] })),
};

const SURFACES: readonly { surface: SectionSurface; note: string }[] = [
  {
    surface: 'paper',
    note: 'Body white · head fill neutral-50 · heads neutral-700 7.54:1 · keys neutral-950 17.26:1 · caption neutral-600 4.92:1 · rules neutral-200.',
  },
  {
    surface: 'tint',
    note: 'Body paper on paper-deep · head fill neutral-50 · caption steps to neutral-700 (600 is 4.39:1 here) · heads 7.54:1 · keys 17.10:1.',
  },
  {
    surface: 'ink',
    note: 'The frame steps up the ramp: body neutral-900, head fill neutral-800 · keys white 14.75:1 · heads neutral-300 7.64:1 · rules neutral-700.',
  },
  {
    surface: 'blue',
    note: 'The frame steps down the ramp: body brandeis-700, head fill brandeis-600 · keys white 10.16:1 · heads brandeis-100 5.99:1 · rules brandeis-400.',
  },
];

/* A composed-mark column (1 Oct 2026): a cell may be `{ node }` — here a glyph with its own words —
   placed as given while the other cells keep the trusted-HTML contract. Rendered on every surface
   below, so the mark takes each surface's ink. */
function Mark({ yes }: { yes: boolean }) {
  return (
    <span>
      <Icon name={yes ? 'check-circle' : 'close-circle'} label={yes ? 'Yes' : 'No'} />
    </span>
  );
}

const NODE_TABLE: DataTableProps = {
  caption: 'A composed mark in a column',
  keyColumn: { heading: 'Representation' },
  columns: [{ heading: 'Governed', behaviour: 'nowrap' }, { heading: 'What must stay true' }],
  rows: [
    {
      header: 'Semantic definition',
      cellsHtml: [{ node: <Mark yes /> }, '<p>Some work is complete; some remains.</p>'],
    },
    {
      header: 'Figma component',
      cellsHtml: [{ node: <Mark yes={false} /> }, '<p>Properties cover label and detail.</p>'],
    },
    {
      header: 'Runtime component',
      cellsHtml: [{ node: <Mark yes /> }, '<p>API exposes the same meaning.</p>'],
    },
  ],
};

/* The longest peer comparison the glossary authors (/glossary/design-system), verbatim. */
const PEERS: DataTableProps = {
  caption: 'Design system vs component library and style guide',
  columns: [
    { heading: 'Style guide' },
    { heading: 'Component library' },
    { heading: 'Design system' },
  ],
  rows: [
    {
      header: 'What it holds',
      cellsHtml: [
        'Visual rules such as colour, type, logo use and tone of voice',
        'Reusable interface components',
        'Foundations, components, patterns, design files, code, guidance and rules for change',
      ],
    },
    {
      header: 'What it answers',
      cellsHtml: [
        'Answers how the product should look and sound',
        'Answers how a shared element looks and works',
        'Also answers what belongs in the shared layer, how it changes and how products adopt it',
      ],
    },
    {
      header: 'What it needs',
      cellsHtml: [
        'Often a document or a page of examples',
        'Can exist without a way to contribute or migrate',
        'Needs ownership and a route from change to the products that use it',
      ],
    },
  ],
};

export default function DataTableSpecimenPage() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>DataTable</h1>
          <p>
            The site’s one table: a key column of row headers, one to five data columns, three
            to eight rows, an optional caption and summary. Column count is data; column
            behaviour is presentation. It is drawn as a box — outer border, head fill, body
            ground, and a hairline between every row and every column — and when its track is
            too narrow for its columns the box scrolls sideways; it never restacks. The page
            itself never scrolls horizontally. Tables are boxed, always (owner, 7 Oct 2026): the
            box is the table&rsquo;s, not a variant, so there is no ruled frame.
          </p>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>1 · Column counts</h2>
            <p>
              Two, three and five data columns in the full 1176 content column — the track every
              live table actually gets, as a ContentSection child.
            </p>
          </Layout>
          <Specimen
            title="Key + 2 data columns · 3 rows · caption and summary"
            note="The live product-modernisation-test table, verbatim. The summary is a Prose paragraph before the table; the caption is the table’s name, above the head row."
          >
            <DataTable {...ROUTE_TABLE} />
          </Specimen>
          <Specimen
            title="Key + 3 data columns · 5 rows · caption only"
            note="The key column holds at 192 and never narrows below it; the data columns share the rest."
          >
            <DataTable {...THREE_COLUMNS} />
          </Specimen>
          <Specimen
            title="Key + 5 data columns · 4 rows · the designed maximum"
            note="Six columns in 1176 is about 196 a column. Heads that wrap sit on the rule with their one-line neighbours."
          >
            <DataTable {...FIVE_COLUMNS} />
          </Specimen>
          <Specimen
            title="The picked row · pick"
            note="The option the table recommends: a blue ground across the row, the key in blue, a bar down its start edge. /why-tcules' alternatives pick the Tcules row (the composer picks any comparison row naming Tcules). Never reorders the rows; at most one per table. Every surface below shows it on its second row."
          >
            <DataTable
              {...ROUTE_TABLE}
              rows={ROUTE_TABLE.rows.map((row, i) => (i === 1 ? { ...row, pick: true } : row))}
            />
          </Specimen>
          <Specimen
            title="Keyless peers · no keyColumn"
            note="A comparison whose head row IS the things compared and whose rows are sentences across them (the glossary, 4 Nov 2026): no column is a row label, so every cell is set alike under its own head."
          >
            <DataTable {...PEERS} />
          </Specimen>
          <Specimen
            title="Keyless peers, the page's own column picked · pickColumn"
            note="The row pick turned a quarter: the column naming the page's own term takes the blue ground, its head in blue with a bar across its top. Never reorders the columns."
          >
            <DataTable {...PEERS} pickColumn={2} />
          </Specimen>
          <Specimen
            title="Named by the heading above it · labelledBy"
            note="A corpus table sits under its band’s own h2, so a visible caption would print the heading twice. labelledBy names the scroll region and the table by that heading’s id, with no caption. Without a caption or labelledBy the region is named by the key column’s head."
          >
            <Layout rowGap="block">
              <h3 id="dt-labelled-by">Every gap gets a cause</h3>
              <DataTable
                {...ROUTE_TABLE}
                caption={undefined}
                summary={undefined}
                labelledBy="dt-labelled-by"
              />
            </Layout>
          </Specimen>
          <Specimen
            title="A record with no header row · head={false}"
            note="A key/value record such as a case's 'At a glance': its first row is a pair, so there is no head to draw and none is invented. Rows only, one value column, named by the heading above it with labelledBy. A table WITH a head row and one value column (About's 'Fact · Current public record') is sized the same way: at 390 the pair fits the track and never scrolls."
          >
            <Layout rowGap="block">
              <h3 id="dt-record">At a glance</h3>
              <DataTable
                head={false}
                labelledBy="dt-record"
                keyColumn={{ heading: '' }}
                columns={[{ heading: '' }]}
                rows={[
                  {
                    header: 'Product',
                    cellsHtml: [
                      'An established environment, health and safety software suite.',
                    ],
                  },
                  {
                    header: 'Our role',
                    cellsHtml: ['Shared interface direction and coded prototypes.'],
                  },
                  {
                    header: 'The key question',
                    cellsHtml: [
                      'How can the suite look modern without breaking its customers’ habits?',
                    ],
                  },
                  {
                    header: 'What we delivered',
                    cellsHtml: ['Coded prototypes of the shared patterns.'],
                  },
                ]}
              />
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>2 · Row counts and long row headers</h2>
            <p>
              Three rows is the floor, eight the ceiling. Nothing sorts, filters or paginates.
            </p>
          </Layout>
          <Specimen
            title="8 rows"
            note="No zebra: rows are separated by the hairline only, inside the frame."
          >
            <DataTable {...EIGHT_ROWS} />
          </Specimen>
          <Specimen
            title="Long row headers"
            note="The h6 title voice wraps inside the held key column; cells stay top-aligned with the header’s first line."
          >
            <DataTable {...LONG_HEADERS} />
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>3 · Column behaviour</h2>
            <p>
              <code>fluid</code> (the data default), <code>hold</code> (the key default),{' '}
              <code>nowrap</code> and <code>numeric</code>. Head and cells of a column always
              agree. Every cell floors at 176 unless it is nowrap or numeric, which floor at
              their own longest line.
            </p>
          </Layout>
          <Specimen
            title="numeric · end-aligned, tabular figures, never wraps"
            note="The head aligns with its figures. 1,240 and 12 share a right edge."
          >
            <DataTable {...NUMERIC} />
          </Specimen>
          <Specimen
            title="Mono key column · nowrap key and a nowrap code column"
            note="The criterion never breaks across lines. The token column is inline code marks — mono as content, so its case is kept verbatim — and never wraps."
          >
            <DataTable {...MONO_KEY} />
          </Specimen>
          <Specimen
            title="hold · beside a greedy prose column"
            note="Without hold the long paragraph would take the width and crush the key to a word a line."
          >
            <DataTable {...HOLD} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>4 · Inline marks, links and empty cells</h2>
            <p>
              Cells are rich text. The seam keeps what the editor authored and Prose styles it.
            </p>
          </Layout>
          <Specimen
            title="Links, strong, em, code, and two paragraphs in one cell"
            note="The link is Prose’s link — underlined at rest, on every surface."
          >
            <DataTable {...MARKS} />
          </Specimen>
          <Specimen
            title="Empty cells"
            note="An empty cell is a cell: announced blank by the screen reader, drawn as a quiet dash for the eye. The last row is entirely empty after its header."
          >
            <DataTable {...EMPTY_CELLS} />
          </Specimen>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>5 · Caption and summary</h2>
            <p>
              Both are optional and independent. Each absent case closes up; nothing reserves
              space.
            </p>
          </Layout>
          <Layout columns={{ base: 1, lg: 2 }} colGap="gutter" rowGap="stack">
            <Specimen title="Caption + summary">
              <DataTable {...ROUTE_TABLE} />
            </Specimen>
            <Specimen title="Caption only">
              <DataTable {...ROUTE_TABLE} summary={undefined} />
            </Specimen>
            <Specimen
              title="Summary only"
              note="The table has no caption and so no accessible name of its own; the summary still leads into it."
            >
              <DataTable {...ROUTE_TABLE} caption={undefined} />
            </Specimen>
            <Specimen title="Neither" note="The head row is the first thing drawn.">
              <DataTable {...ROUTE_TABLE} caption={undefined} summary={undefined} />
            </Specimen>
          </Layout>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>6 · Narrow tracks scroll</h2>
            <p>
              The table keeps its shape in a narrow track: the frame scrolls sideways and its
              border stays put, so the clipped edge reads as more to come. These scroll at 1440
              as well as at 390, because the floors are the columns’, not the viewport’s. The
              frame is a focusable region — tab to it and the arrow keys scroll it. A fade marks
              each edge with more beyond it, and follows the scroll.
            </p>
          </Layout>
          <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
            <Specimen title="326 phone column · key + 5 data columns">
              <div className={s.trackMobile}>
                <DataTable {...FIVE_COLUMNS} />
              </div>
            </Specimen>
            <Specimen title="326 phone column · marks, links and empty cells">
              <div className={s.trackMobile}>
                <Layout rowGap="stack">
                  <DataTable {...MARKS} />
                  <DataTable {...EMPTY_CELLS} />
                </Layout>
              </div>
            </Specimen>
            <Specimen title="326 phone column · numeric and nowrap">
              <div className={s.trackMobile}>
                <Layout rowGap="stack">
                  <DataTable {...NUMERIC} />
                  <DataTable {...MONO_KEY} />
                </Layout>
              </div>
            </Specimen>
          </Layout>
          <Specimen
            title="The 392 three-up track"
            note="The brief’s open question: a five-column table in a three-up grid. Each frame scrolls inside its own track; the grid does not widen."
          >
            <Layout columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="stack">
              <DataTable {...FIVE_COLUMNS} />
              <DataTable {...ROUTE_TABLE} />
              <DataTable {...NUMERIC} />
            </Layout>
          </Specimen>
        </Layout>
      </Section>

      {SURFACES.map(({ surface, note }, index) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="block">
            <Layout rowGap="tight">
              {index === 0 ? <h2>7 · Four surfaces · identical markup</h2> : null}
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>{note}</p>
            </Layout>
            <Layout columns={{ base: 1, lg: [2, 1] }} colGap="gutter" rowGap="stack">
              <DataTable {...SURFACE_TABLE} />
              <DataTable {...NODE_TABLE} />
            </Layout>
          </Layout>
        </Section>
      ))}

      <Section surface="ink">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>8 · Nested surfaces</h2>
            <p>
              A tint panel inside ink resolves every DataTable token from itself; no ink value
              leaks into its grounds, heads, keys, caption or rules.
            </p>
          </Layout>
          <Section as="div" surface="tint">
            <DataTable {...MARKS} />
          </Section>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <p>
            An ink panel nested back inside paper, and a blue one, must each invert in full.
          </p>
          <Section as="div" surface="ink">
            <DataTable {...NUMERIC} />
          </Section>
          <Section as="div" surface="blue">
            <DataTable {...EMPTY_CELLS} />
          </Section>
        </Layout>
      </Section>

      <Section surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>9 · Out of contract — what happens</h2>
            <p>
              DataTable never drops content and never throws. Each case below renders, and warns
              in the development console. Zero rows renders nothing and is not shown.
            </p>
          </Layout>
          <Specimen
            title="1 column — the key column alone"
            note="Warns: a key column alone is a list, not a table. The row headers render; there are no data cells."
          >
            <DataTable {...KEY_ONLY} />
          </Specimen>
          <Specimen
            title="9 rows"
            note="Warns: the designed range is three to eight. All nine render."
          >
            <DataTable {...NINE_ROWS} />
          </Specimen>
          <Specimen
            title="6 data columns"
            note="Warns: the designed maximum is five. The live product-modernisation-assessment audit sends this; it still fits 1176, and scrolls below it."
          >
            <DataTable {...SIX_DATA} />
          </Specimen>
          <Specimen
            title="Cell counts that disagree, and a blank row header"
            note="Warns per row. A short row is padded with empty cells; a long one is truncated, because a cell with no column head has no header to be read against. The seam already makes them agree for CMS content."
          >
            <DataTable {...MISMATCH} />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>10 · Split — two halves wide, one table narrow</h2>
            <p>
              `split` (owner, 10 Oct 2026): a long record sets as two boxed halves side by side
              from 1024, each with its head row, the first taking the odd row. Below 1024 the
              halves JOIN into one continuous table: no gap, the second frame’s top edge gone,
              its head row collapsed out of sight (still read), and a shared key floor so the
              column rule runs straight through the join. Resize past 1024 to see both; the 390
              shot shows the join.
            </p>
          </Layout>
          <Specimen
            title="Eleven facts, split"
            note="Six beside five from 1024; one table of eleven below it. For a record (one value column) only — a comparison table warns."
          >
            <DataTable {...LONG_RECORD} split caption="At a glance" />
          </Specimen>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>11 · Two adjacent</h2>
            <p>
              The caller’s Layout owns the seam between them (--gap-stack here, as
              ContentSection does between blocks). DataTable sets no outer spacing.
            </p>
          </Layout>
          <Layout rowGap="stack">
            <DataTable {...THREE_COLUMNS} />
            <DataTable {...NUMERIC} />
          </Layout>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h2>12 · Linked row headers (headerHtml)</h2>
            <p>
              A &ldquo;which do you need&rdquo; table names each option as a link to its page
              (component-map C6). `headerHtml` sets the key cell from trusted inline HTML in the
              key&rsquo;s own voice; `header` still carries the plain words. A key the page
              names itself stays plain.
            </p>
          </Layout>
          <DataTable
            caption="Which audit do you need?"
            keyColumn={{ heading: 'Audit' }}
            columns={[{ heading: 'Best for' }, { heading: 'You get' }]}
            rows={[
              {
                header: 'UX & Product Audit',
                headerHtml: '<a href="/audits/ux-product-audit">UX &amp; Product Audit</a>',
                cellsHtml: [
                  p('Teams who know something is wrong but not yet what'),
                  p('A ranked list of findings'),
                ],
              },
              {
                header: 'Design System Audit',
                headerHtml: '<a href="/audits/design-system-audit">Design System Audit</a>',
                cellsHtml: [
                  p('Systems that drift between design and code'),
                  p('A map of the drift'),
                ],
              },
              {
                header: 'This review',
                cellsHtml: [p('A prototype heading for customers'), p('A fix list by risk')],
              },
            ]}
          />
        </Layout>
      </Section>
    </>
  );
}
