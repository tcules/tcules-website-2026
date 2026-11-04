import type { ReactNode } from 'react';

import { Island, Layout } from '@/components';
import { ContentSection, ContentSectionText, CtaRow, DataTable } from '@/patterns';
import type { CorpusBand, CorpusBlock } from '@/lib/corpus-types';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { renderInline } from '@/lib/inline-render';
import { ROUTES } from '@/lib/routes';

import { head } from './blocks';
import styles from './CorpusPage.module.css';
import { BandBody } from './CopyBands';
import { isStatus, StatusMark } from './StatusMark';
import { leadOf, plain, trimEnd, trimStart } from './text';

/**
 * "What the report looks like" (the audits' 3 Nov 2026 outline): a sample page of the deliverable,
 * set as ONE report page on the band's ground. The kind `example` (plan.ts): a worked example that
 * carries a table. A worked example told as bold-led story rows stays `record` (CaseSpread).
 *
 * The 2 Nov answer kept: everything the example is (its label, its scenario, the sheet and the
 * reading of it) sits inside one panel (owner, 2 Nov 2026: "can all of these be put inside the
 * panels?"). The panel is now the band's one object rather than a part of What you get, so the band
 * takes the tint ground and the panel is the paper page on it: a page of a report, the brightest
 * thing in the band. No word is added, moved or dropped:
 *
 *   eyebrow   the authoring note "Small label above the heading: Example", as the band's eyebrow
 *   label     the italic line ("Illustration, not client work", "From our audit of Dealpath's …"), in
 *             the mono label voice at the head of the page
 *   scenario  the sentences before the table
 *   sheet     the table: its first column the row's key; a column of statuses (Proven, Assumed …) each
 *             with its mark; a column whose values a key after the table defines, in the label voice
 *   reading   the sentences after the table; a trailing case link becomes the band's head action
 *             (the case snippet's rule: the way into the case at the heading's end)
 *   key       bold-led paragraphs after the table that define the sheet's values, as the page's
 *             legend under the reading
 *
 * Below 768 the sheet reads down, one row at a time, each column under its own name.
 */

type TableBlock = Extract<CorpusBlock, { type: 'table' }>;
type LinkRun = Extract<InlineRun, { type: 'link' }>;

const EYEBROW_NOTE = /small label above the heading:\s*(.+)$/i;
const norm = (runs: readonly InlineRun[]) =>
  plain(runs)
    .trim()
    .replace(/[.:]\s*$/, '')
    .toLowerCase();

/** An italic line on its own: the example's label. */
function labelOf(block: CorpusBlock): string | undefined {
  if (block.type !== 'paragraph') return undefined;
  const runs = trimEnd(block.runs);
  const [only] = runs;
  return runs.length === 1 && only?.type === 'em' ? plain(only.children).trim() : undefined;
}

/** A case-study link that ends a paragraph ("… ranked by harm. [Read the Dealpath case](…)"). */
function trailingCaseLink(
  runs: readonly InlineRun[],
): { link: LinkRun; rest: InlineRun[] } | undefined {
  const trimmed = trimEnd(runs);
  const last = trimmed.at(-1);
  if (last?.type !== 'link' || !last.href.startsWith(`${ROUTES.caseStudies}/`)) return undefined;
  return { link: last, rest: trimEnd(trimmed.slice(0, -1)) };
}

/** Whether a table is a worked example's report sheet (plan.ts reads this to classify the band). */
export const hasReportSheet = (band: CorpusBand): boolean =>
  band.blocks.some((block) => block.type === 'table');

export function ReportBand({ band, surface }: { band: CorpusBand; surface: 'paper' | 'tint' }) {
  const eyebrow = band.blocks
    .flatMap((block) => (block.type === 'comment' ? [EYEBROW_NOTE.exec(block.text)?.[1]] : []))
    .find(Boolean)
    ?.trim();
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const tableAt = blocks.findIndex((block) => block.type === 'table');
  const sheet = blocks[tableAt] as TableBlock | undefined;
  if (!sheet) return null;
  const before = blocks.slice(0, tableAt);
  const after = blocks.slice(tableAt + 1);
  const labelBlock = before.find((block) => labelOf(block) !== undefined);
  const label = labelBlock ? labelOf(labelBlock) : undefined;
  const scenario = before.filter((block) => block !== labelBlock);

  const [keyHead = [], ...columns] = sheet.header;
  /* A column of statuses: every value one of the gap map's states, each carrying its mark. */
  const statusAt = columns.findIndex((_, index) =>
    sheet.rows.every((row) => isStatus(norm(row[index + 1] ?? []))),
  );
  /* The key after the sheet: bold-led paragraphs whose labels are the values of one column. */
  const keyRows = after.flatMap((block) => {
    const lead = leadOf(block);
    return lead
      ? [{ block, term: plain(lead.label).trim().replace(/\.$/, ''), body: lead.body }]
      : [];
  });
  const terms = new Set(keyRows.map((row) => row.term.toLowerCase()));
  const answerAt =
    keyRows.length > 0
      ? columns.findIndex((_, index) =>
          sheet.rows.every((row) => terms.has(norm(row[index + 1] ?? []))),
        )
      : -1;
  const key = answerAt >= 0 ? keyRows : [];
  /* Everything after the sheet that is not its key is the reading of it, in order, every block kept. */
  const reading = after.filter((block) => !key.some((row) => row.block === block));
  /* The case link closes the reading as the band's action at the heading's end. */
  const lastReading = reading.at(-1);
  const caseTail =
    lastReading?.type === 'paragraph' ? trailingCaseLink(lastReading.runs) : undefined;
  const readingBlocks: CorpusBlock[] = reading.map((block) =>
    block === lastReading && caseTail && block.type === 'paragraph'
      ? { ...block, runs: caseTail.rest }
      : block,
  );

  /* A record: a key and ONE value read down the rows ("Field · The finding"), no status and no answer
     column. It is a spec sheet, not a grid (DataTable `appearance="sheet"`): the keys are labels, so a
     50/50 box with a head row read as a database table (critic, audits run, 4 Nov 2026). */
  const record = columns.length === 1 && statusAt < 0 && answerAt < 0;
  /* The row the reading turns on: a cell that opens on a bold run ("**Breaks here first.** Date
     only …") marks its row as the finding, and the row takes DataTable's pick (the /why-tcules
     treatment) so the trace's one point is not buried mid-table. The bold stays. */
  const pickRow = (row: readonly (readonly InlineRun[])[]) =>
    row.slice(1).some((runs) => trimStart(runs)[0]?.type === 'strong');

  /* An answer the key defines takes the key's label voice at every width, so the rows and the key
     under them visibly match on a phone as in the table (critic, 4 Nov 2026: the read-down set them
     in the sans, "Keep" against the key's KEEP). One renderer for both views. */
  const answer = (runs: readonly InlineRun[]) => (
    <span className={styles.legend}>{plain(runs)}</span>
  );
  const cell = (runs: readonly InlineRun[], index: number): string | { node: ReactNode } =>
    index === statusAt
      ? { node: <StatusMark name={plain(runs)} /> }
      : index === answerAt
        ? { node: answer(runs) }
        : inlineToHtml(runs);

  const headProps = head(band);
  const page = (
    <Island surface={surface === 'tint' ? 'paper' : 'tint'}>
      {/* One page: its label and scenario head the sheet, and the reading closes it, so the seams
          are the block step (head to body inside a block), not the stack between two blocks. At
          stack the report pages ran 950 to 1140 at 1440, past the fold (critic, 4 Nov 2026). */}
      <Layout rowGap="block">
        {label || scenario.length > 0 ? (
          <Layout rowGap="block">
            {label ? <p className={styles.legend}>{label}</p> : null}
            {scenario.length > 0 ? (
              <ContentSectionText>
                <BandBody blocks={scenario} labelledBy={headProps.headingId} />
              </ContentSectionText>
            ) : null}
          </Layout>
        ) : null}
        {/* Below 768 the sheet reads down: each row's key as its title, then its columns under their
            names. From
            768 the table. One shows at a time (display none leaves the other out of the
            accessibility tree too). */}
        <Layout as="ul" rowGap={record ? 'block' : 'stack'} className={styles.sheetList}>
          {sheet.rows.map((row) =>
            record ? (
              /* A record's row on a phone: its key as the label over its value, as the sheet sets it;
                 the value column's own name over every row would only repeat. */
              <Layout as="li" key={plain(row[0] ?? [])} rowGap="inline">
                <p className={styles.legend}>{plain(row[0] ?? [])}</p>
                <p>{renderInline(row[1] ?? [])}</p>
              </Layout>
            ) : (
              <Layout as="li" key={plain(row[0] ?? [])} rowGap="text">
                <p className={styles.statusName}>{plain(row[0] ?? [])}</p>
                {columns.map((heading, index) => (
                  <Layout key={plain(heading)} rowGap="inline">
                    <p className={styles.legend}>{plain(heading)}</p>
                    {index === statusAt ? (
                      <StatusMark name={plain(row[index + 1] ?? [])} />
                    ) : index === answerAt ? (
                      <p>{answer(row[index + 1] ?? [])}</p>
                    ) : (
                      <p>{renderInline(row[index + 1] ?? [])}</p>
                    )}
                  </Layout>
                ))}
              </Layout>
            ),
          )}
        </Layout>
        <div className={styles.sheetTable}>
          <DataTable
            labelledBy={headProps.headingId}
            {...(record ? { appearance: 'sheet' as const } : {})}
            keyColumn={{ heading: plain(keyHead) }}
            columns={columns.map((heading, index) => ({
              heading: plain(heading),
              ...(index === statusAt || index === answerAt
                ? { behaviour: 'nowrap' as const }
                : {}),
            }))}
            rows={sheet.rows.map((row) => ({
              header: plain(row[0] ?? []),
              cellsHtml: row.slice(1).map((runs, index) => cell(runs, index)),
              ...(pickRow(row) ? { pick: true } : {}),
            }))}
          />
        </div>
        {readingBlocks.length > 0 || key.length > 0 ? (
          <Layout rowGap="stack">
            {readingBlocks.length > 0 ? (
              <ContentSectionText>
                <BandBody blocks={readingBlocks} labelledBy={headProps.headingId} />
              </ContentSectionText>
            ) : null}
            {key.length > 0 ? (
              <Layout
                as="ul"
                columns={{ base: 1, md: 3, lg: Math.min(key.length, 5) as 1 | 2 | 3 | 4 | 5 }}
                colGap="gutter"
                rowGap="block"
                aria-label={plain(columns[answerAt] ?? [])}
              >
                {key.map((row) => (
                  <Layout as="li" key={row.term} rowGap="tight">
                    <p className={styles.legend}>{row.term}</p>
                    <p className={styles.statusMeaning}>{renderInline(row.body)}</p>
                  </Layout>
                ))}
              </Layout>
            ) : null}
          </Layout>
        ) : null}
      </Layout>
    </Island>
  );

  return caseTail ? (
    <ContentSection
      {...headProps}
      data-band="report"
      surface={surface}
      eyebrow={eyebrow}
      actionsAt="end"
      actions={
        <CtaRow
          rule={false}
          actions={[{ label: plain(caseTail.link.children), href: caseTail.link.href }]}
        />
      }
    >
      {page}
    </ContentSection>
  ) : (
    <ContentSection {...headProps} data-band="report" surface={surface} eyebrow={eyebrow}>
      {page}
    </ContentSection>
  );
}
