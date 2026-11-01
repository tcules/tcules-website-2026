import { Fragment, type ReactNode } from 'react';

import { Layout, Media, Prose, Section } from '@/components';
import { Accordion, DataTable, Steps, TableOfContents, type TocItem } from '@/patterns';
import { corpusImage } from '@/lib/corpus-images';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import { FULL_COLUMN } from '@/lib/image-sizes';
import { linkCaseMentions } from '@/lib/case-links';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { hasPlaceholder, placeholderImage } from '@/lib/placeholders';

import { blocksHtml, bodyOf, faqItems, headingIdOf } from './blocks';
import { isFaqBand } from './order';
import styles from './CorpusPage.module.css';
import { html, plain, trimStart } from './text';

/**
 * The long-form argument: a run of sections in ONE shell, a table-of-contents rail beside a reading
 * column (page-mapping M19). Every long-form family (case, article, term) composes its argument
 * through this file, so a table, a numbered method or a bound artefact is drawn one way wherever it
 * appears.
 *
 * What the column is NOT is a stack of bands. Its flow is Prose, and what breaks it is a numbered
 * method (Steps), a bound artefact or a labelled diagram slot (Media), or a table, so it never runs
 * more than two Prose-only sections in a row (§ 3). Every shape is read from the words' structure.
 */

type TableBlock = Extract<CorpusBlock, { type: 'table' }>;
type Step = { title: string; body: string } | { title: string; bodyHtml: string[] };

/** A block of a section, or the numbered method that a run of paragraphs announces. */
type Item = CorpusBlock | { type: 'methods'; steps: Step[] };

/* ── Numbered methods ─────────────────────────────────────────────────────────── */

/** A numbered list whose items each open with a one-word action and a full stop ("Stabilise. …"). */
export function stepsOf(items: readonly InlineRun[][]) {
  const steps = items.map((runs) => {
    const [first, ...rest] = runs;
    if (first?.type !== 'text') return null;
    const match = /^([^.]{1,40}\.)\s+(.*)$/s.exec(first.text);
    if (!match) return null;
    const bodyRuns: InlineRun[] = [{ type: 'text', text: match[2] ?? '' }, ...rest];
    return { title: match[1] ?? '', ...bodyOf(trimStart(bodyRuns)) };
  });
  return steps.every(Boolean) ? (steps as NonNullable<(typeof steps)[number]>[]) : null;
}

const COUNTS: Readonly<Record<string, number>> = { two: 2, three: 3, four: 4, five: 5 };

/**
 * A paragraph as a step: its first sentence is the title, the rest of the paragraph (links and all)
 * its body. Null when the paragraph does not open with a sentence of plain text.
 */
function stepOfParagraph(block: CorpusBlock | undefined): Step | null {
  if (block?.type !== 'paragraph') return null;
  const [first, ...rest] = block.runs;
  if (first?.type !== 'text') return null;
  const match = /^(.+?[.?!])\s+(.*)$/s.exec(first.text);
  if (!match) return null;
  const bodyRuns: InlineRun[] = [{ type: 'text', text: match[2] ?? '' }, ...rest];
  return { title: match[1] ?? '', ...bodyOf(trimStart(bodyRuns)) };
}

/**
 * "Four design moves follow." and then four paragraphs: a count the author wrote announces that many
 * paragraphs as a method, each opening with the sentence that names the move. The announcing line
 * stays prose; the moves become numbered rows, every word kept. A count that the paragraphs after it
 * do not honour (fewer of them, or one that does not open with a sentence) announces nothing.
 */
function withMethods(blocks: readonly CorpusBlock[]): Item[] {
  const out: Item[] = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index] as CorpusBlock;
    out.push(block);
    if (block.type !== 'paragraph') continue;
    const count = /^(two|three|four|five)\b[^.]*\bfollow\.?$/i.exec(plain(block.runs).trim());
    const n = count ? COUNTS[(count[1] ?? '').toLowerCase()] : undefined;
    if (!n) continue;
    const steps = blocks.slice(index + 1, index + 1 + n).map(stepOfParagraph);
    if (steps.length === n && steps.every(Boolean)) {
      out.push({ type: 'methods', steps: steps as Step[] });
      index += n;
    }
  }
  return out;
}

/* ── Diagram slots ────────────────────────────────────────────────────────────── */

/**
 * Where a band's labelled diagram sits in its flow (the register's rows say what each shows). A slot
 * follows the sentence that names it: the paragraph that mentions the `text`, or the band's last list.
 * A band with no register row has no slot, so nothing here can draw an image the register does not
 * list.
 */
const DIAGRAM_AFTER: Readonly<Record<string, { text: string } | 'list'>> = {
  'the-quote-is-the-shared-object': { text: 'responsibility map' },
  'design-for-the-revision-not-the-first-draft': 'list',
};

function diagramIndex(page: CorpusPage, band: CorpusBand, items: readonly Item[]): number {
  const rule = DIAGRAM_AFTER[band.id];
  if (!rule || !hasPlaceholder(page.route, band.id)) return -1;
  if (rule === 'list') {
    return items.reduce((at, item, index) => (item.type === 'list' ? index : at), -1);
  }
  return items.findIndex(
    (item) => item.type === 'paragraph' && plain(item.runs).includes(rule.text),
  );
}

/* ── One section ──────────────────────────────────────────────────────────────── */

const listHtml = (block: Extract<CorpusBlock, { type: 'list' }>) => {
  const tag = block.ordered ? 'ol' : 'ul';
  return `<${tag}>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join('')}</${tag}>`;
};

/**
 * One section of the argument: its h2 (none for a head-less opening), then its blocks in order.
 * Consecutive paragraphs and lists share one Prose flow; a numbered method is Steps; a table is a
 * boxed DataTable; a bound artefact is a Media placed after the section's last list, or else its last
 * paragraph (the block that names it); a diagram slot is the Media its register row reserves.
 */
export function ArticleSection({
  page,
  band,
  seen = new Set([page.route]),
}: {
  page: CorpusPage;
  band: CorpusBand;
  /**
   * The case pages already linked earlier in the argument (and the page's own route), so a case the
   * prose names links at its FIRST mention only (owner, 11 Oct 2026: every case mention links to its
   * case page; a link on every repeat would turn the paragraph blue).
   */
  seen?: Set<string>;
}) {
  const binding = page.composition.mediaBindings.find(
    (b) => b.bound && b.supportsSection === band.id,
  );
  const items = withMethods(band.blocks.filter((block) => block.type !== 'comment'));
  const diagramAt = diagramIndex(page, band, items);
  const isFaq = isFaqBand(band);

  let mediaAfter = -1;
  if (binding) {
    items.forEach((item, index) => {
      if (item.type === 'list') mediaAfter = index;
    });
    if (mediaAfter < 0) {
      items.forEach((item, index) => {
        if (item.type === 'paragraph') mediaAfter = index;
      });
    }
  }

  const out: ReactNode[] = [];
  let flow = '';
  const flush = () => {
    if (flow)
      out.push(<Prose key={`prose-${out.length}`} html={flow} className={styles.reading} />);
    flow = '';
  };

  items.forEach((item, index) => {
    switch (item.type) {
      case 'paragraph':
        flow += html(linkCaseMentions(item.runs, seen));
        break;
      case 'labelled':
        flow += `<p><strong>${inlineToHtml(item.label)}</strong> ${inlineToHtml(item.body)}</p>`;
        break;
      case 'list': {
        const steps = item.ordered ? stepsOf(item.items) : null;
        if (steps) {
          flush();
          out.push(<Steps key={`steps-${out.length}`} steps={steps} />);
        } else {
          flow += listHtml(item);
        }
        break;
      }
      case 'methods':
        flush();
        out.push(<Steps key={`methods-${out.length}`} steps={item.steps} />);
        break;
      case 'table':
        flush();
        out.push(
          <CorpusTable
            key={`table-${out.length}`}
            table={item}
            labelledBy={headingIdOf(band)}
          />,
        );
        break;
      /* A quote stays in the reading flow; its attribution is a cite, which Prose sets apart from the
         quoted words. */
      case 'quote':
        flow += `<blockquote>${item.paragraphs.map((runs) => `<p>${inlineToHtml(runs)}</p>`).join('')}${
          item.attribution ? `<cite>${inlineToHtml(item.attribution)}</cite>` : ''
        }</blockquote>`;
        break;
      /* A subsection is its h3 (or h4) and its words, in the same flow. In the FAQ band the
         subsections are the questions, set once as the accordion below. Dropping them lost every
         subsection and every FAQ on the copy's articles. */
      case 'item':
        if (!isFaq)
          flow += `<h${item.level}>${inlineToHtml(item.heading)}</h${item.level}>${blocksHtml(item.blocks)}`;
        break;
      case 'links':
      case 'form':
        break;
    }
    if (binding && index === mediaAfter) {
      flush();
      out.push(
        <Media key={`media-${out.length}`} image={corpusImage(binding)} sizes={FULL_COLUMN} />,
      );
    }
    if (index === diagramAt) {
      flush();
      out.push(
        <Media
          key={`diagram-${out.length}`}
          image={placeholderImage(page.route, band.id)}
          sizes={FULL_COLUMN}
        />,
      );
    }
  });
  flush();
  if (isFaq) out.push(<Accordion key={`faq-${out.length}`} items={faqItems(band)} />);

  const headless = band.headingText === '';
  return (
    <Layout
      as="section"
      id={band.id}
      aria-labelledby={headless ? undefined : headingIdOf(band)}
      rowGap="block"
    >
      {headless ? null : <h2 id={headingIdOf(band)}>{band.headingText}</h2>}
      {out.map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </Layout>
  );
}

export function CorpusTable({ table, labelledBy }: { table: TableBlock; labelledBy: string }) {
  const [key = [], ...columns] = table.header;
  return (
    <DataTable
      labelledBy={labelledBy}
      keyColumn={{ heading: plain(key) }}
      columns={columns.map((cell) => ({ heading: plain(cell) }))}
      rows={table.rows.map((row) => ({
        header: plain(row[0] ?? []),
        cellsHtml: row.slice(1).map((cell) => inlineToHtml(cell)),
      }))}
    />
  );
}

/* ── The shell ────────────────────────────────────────────────────────────────── */

/**
 * The argument's one band: the outline rail (every headed section, in order) beside the sections. The
 * fold rule's exception for reading (visual-direction § 1.3): the argument is a document read by
 * scrolling, beside its own outline, so no height could hold it. A plain wrapper marks it exempt.
 */
export function ArticleShell({
  page,
  sections,
}: {
  page: CorpusPage;
  sections: readonly CorpusBand[];
}) {
  /* One set for the whole argument: a case links at its first mention, never on the page's own. */
  const seen = new Set<string>([page.route]);
  const outline: TocItem[] = sections
    .filter((band) => band.headingText !== '')
    .map((band) => ({ label: band.headingText, href: `#${headingIdOf(band)}` as const }));
  return (
    <div data-fold-exempt="Long-form argument: a document read by scrolling beside its outline (page-mapping M19).">
      <Section as="div" surface="paper" data-band="long-form">
        <Layout
          columns={outline.length >= 2 ? { base: 1, lg: [1, 4] } : { base: 1 }}
          colGap="column"
          rowGap="stack"
          align="start"
        >
          {outline.length >= 2 ? <TableOfContents items={outline} /> : null}
          <Layout as="article" rowGap="stack">
            {sections.map((band) => (
              <ArticleSection key={band.id} page={page} band={band} seen={seen} />
            ))}
          </Layout>
        </Layout>
      </Section>
    </div>
  );
}
