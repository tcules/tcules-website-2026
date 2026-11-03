import { Fragment, type ReactNode } from 'react';

import { Layout, Media, Prose, Section, Sketch } from '@/components';
import {
  Accordion,
  BlockCardSet,
  CtaRow,
  DataTable,
  Steps,
  TableOfContents,
  type BlockCardSetItem,
  type TocItem,
} from '@/patterns';
import { corpusImage } from '@/lib/corpus-images';
import type { CorpusBand, CorpusBlock, CorpusPage } from '@/lib/corpus-types';
import { FULL_COLUMN } from '@/lib/image-sizes';
import { linkCaseMentions } from '@/lib/case-links';
import { inlineToHtml, type InlineRun } from '@/lib/inline';
import { hasPlaceholder, placeholderImage } from '@/lib/placeholders';
import { glossarySceneFor, type SketchName } from '@/lib/sketches';

import { blocksHtml, bodyOf, faqItems, headingIdOf } from './blocks';
import { ExamplePanel, scenarioParts } from './CopyBands';
import { isFaqBand } from './order';
import styles from './CorpusPage.module.css';
import {
  boldLead,
  html,
  labelTitle,
  labelWithoutArrow,
  linkLead,
  plain,
  trimStart,
} from './text';

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

/**
 * A numbered list whose items each open on a bold lead ("**Choose one use case.** …"): the lead is the
 * step's title, the rest its body (a tool's method, 4 Nov 2026). Read only where the shell is asked to
 * (`tool`), so an article's or a term's bold-led list keeps the flow it has today.
 */
export function boldStepsOf(items: readonly InlineRun[][]) {
  const steps = items.map((runs) => {
    const lead = boldLead(runs);
    return lead ? { title: labelTitle(lead.label), ...bodyOf(lead.body) } : null;
  });
  return steps.length >= 2 && steps.every(Boolean)
    ? (steps as NonNullable<(typeof steps)[number]>[])
    : null;
}

/**
 * What a TOOL's argument adds to the shell (LongformPage family "tool", 4 Nov 2026; the tools
 * shape-off): its bold-led method as Steps, its worked example as the example panel with the story's
 * drawing beside the words, and a flat diagram after the paragraph that names what it shows. Keyed by
 * band id; a scene not drawn yet shows its empty plate.
 */
export type ToolShell = {
  /** The worked example's story scene, by the band that holds "Illustration, not client work". */
  stories: Readonly<Record<string, SketchName>>;
  /**
   * A diagram after the first paragraph containing `after`, or after the first table whose head names
   * it, where a band is its table alone (the trust canvas's reading table).
   */
  diagrams: Readonly<Record<string, { after: string; scene: SketchName }>>;
};

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

/**
 * A paragraph that names a tool's marks: it tells the reader to mark each item and quotes three or
 * more marks ('Mark each item "demonstrated", "simulated", "unknown" or "not applicable"'). The tool
 * shell's rule is that a diagram follows it (treatment rules, 4 Nov 2026); a tool page whose marks
 * paragraph has no scene registered warns in development, so a gap shows in the build rather than
 * passing silently (tools critic, 4 Nov 2026).
 */
function namesMarks(text: string): boolean {
  return (
    /^(Mark|Give)\b/.test(text.trim()) && (text.match(/["“][^"”]+["”]/g) ?? []).length >= 3
  );
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
  tool,
}: {
  page: CorpusPage;
  band: CorpusBand;
  /** A tool's additions (`ToolShell`): bold-led steps, the example panel, a diagram plate. */
  tool?: ToolShell;
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
  const toolDiagram = tool?.diagrams[band.id];
  const toolDiagramAt = toolDiagram
    ? items.findIndex(
        (item) =>
          (item.type === 'paragraph' && plain(item.runs).includes(toolDiagram.after)) ||
          (item.type === 'table' &&
            item.header.some((cell) => plain(cell).includes(toolDiagram.after))),
      )
    : -1;
  /* A tool whose marks paragraph has no diagram anywhere on the page: the gap the registry must fill. */
  if (
    tool &&
    !isFaq &&
    Object.keys(tool.diagrams).length === 0 &&
    process.env.NODE_ENV !== 'production'
  ) {
    const marks = items.find(
      (item) => item.type === 'paragraph' && namesMarks(plain(item.runs)),
    );
    if (marks) {
      console.warn(
        `ArticleSection: ${page.route}#${band.id} names its marks ("${plain(
          (marks as Extract<Item, { type: 'paragraph' }>).runs,
        ).slice(0, 60)}…") but has no diagram; register its scene in LongformPage TOOL_SCENES.`,
      );
    }
  }
  if (tool) {
    const example = scenarioParts(band.blocks.filter((block) => block.type !== 'comment'));
    if (example.label) {
      return (
        <ToolExample
          band={band}
          label={example.label}
          before={example.before}
          scenario={example.scenario}
          scene={tool.stories[band.id]}
        />
      );
    }
  }

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

  const terms = relatedTerms(band);
  if (terms) {
    return (
      <Layout as="section" id={band.id} aria-labelledby={headingIdOf(band)} rowGap="block">
        <h2 id={headingIdOf(band)}>{band.headingText}</h2>
        {/* The hub's term card exactly: the small step and an h3 title, so one card is one size
            on the hub and here (ListingIndex/glossary.tsx TermCard). */}
        <BlockCardSet
          items={terms}
          across={3}
          lead="none"
          frame="none"
          cue="title"
          scroll="never"
          size="sm"
          titleAs="h3"
        />
      </Layout>
    );
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
        const steps = item.ordered
          ? (stepsOf(item.items) ?? (tool ? boldStepsOf(item.items) : null))
          : null;
        if (steps) {
          flush();
          out.push(
            <Steps
              key={`steps-${out.length}`}
              steps={steps}
              {...(tool ? { measure: 'reading' as const } : {})}
            />,
          );
        } else {
          flow += listHtml(item);
        }
        break;
      }
      case 'methods':
        flush();
        out.push(
          <Steps
            key={`methods-${out.length}`}
            steps={item.steps}
            {...(tool ? { measure: 'reading' as const } : {})}
          />,
        );
        break;
      case 'table':
        flush();
        out.push(
          <CorpusTable
            key={`table-${out.length}`}
            table={item}
            labelledBy={headingIdOf(band)}
            term={page.pageType === 'defined_term' ? page.name : undefined}
            /* A tool's worksheet reads down on a phone, and so does a TERM's table (glossary critic,
               4 Nov 2026): its comparison's point is the term's own column, and scrolled it was the
               one cut, behind a fade at 390. Below 768 each row is one block, every column's value
               under its head, the term's head in the pick ink. */
            {...(tool || page.pageType === 'defined_term'
              ? { narrow: 'read-down' as const }
              : {})}
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
      /* A lone link line where the author set it, as the link button with its arrow (4 Nov 2026:
         "See how we use AI →" was dropped here, so the shortest glossary page lost its one way
         onward). The copy's own arrow goes; the button draws one. */
      case 'links': {
        const [first, second, ...more] = item.links.map((link) => ({
          label: labelWithoutArrow(link.labelText),
          href: link.href,
        }));
        if (!first) break;
        if (more.length > 0) {
          /* A row of three or more links stays words in the flow: a button row holds two. */
          flow += `<p>${item.links.map((link) => inlineToHtml([{ type: 'link', href: link.href, children: link.label }])).join(' · ')}</p>`;
          break;
        }
        flush();
        out.push(
          <CtaRow
            key={`links-${out.length}`}
            rule={false}
            actions={second ? [first, second] : [first]}
          />,
        );
        break;
      }
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
    /* A tool's diagram: the flat drawing on its plate at the page's one drawing scale (the worked
       example's plate width, centred in the column from 1440; tools critic, 4 Nov 2026). */
    if (toolDiagram && index === toolDiagramAt) {
      flush();
      out.push(
        <Layout key={`plate-${out.length}`} className={styles.diagram} justifyItems="center">
          <div className={styles.diagramPlate}>
            <Sketch name={toolDiagram.scene} />
          </div>
        </Layout>,
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

/** A tool example's words: paragraphs and lists as Prose at the measure, a table boxed. */
function exampleFlow(
  blocks: readonly CorpusBlock[],
  labelledBy: string,
  /** Inside the example panel, whose ground bounds a table (CorpusTable `bounded`). */
  inPanel = false,
): ReactNode[] {
  const out: ReactNode[] = [];
  let flow = '';
  const flush = () => {
    if (flow)
      out.push(<Prose key={`prose-${out.length}`} html={flow} className={styles.reading} />);
    flow = '';
  };
  for (const block of blocks) {
    if (block.type === 'paragraph') flow += html(block.runs);
    else if (block.type === 'list') flow += listHtml(block);
    else if (block.type === 'table') {
      flush();
      out.push(
        <CorpusTable
          key={`table-${out.length}`}
          table={block}
          labelledBy={labelledBy}
          narrow="read-down"
          bounded={inPanel}
        />,
      );
    }
  }
  flush();
  return out;
}

/**
 * A tool's worked example ("Illustration, not client work") as ONE panel on its own ground (owner,
 * 2 Nov 2026): any words before the label stay in the column; in the panel, the label and the
 * scenario's words beside the story's drawing from 1440 (stacked below, where the column is too narrow
 * for two halves), then any table the example carries at the panel's full width.
 */
function ToolExample({
  band,
  label,
  before,
  scenario,
  scene,
}: {
  band: CorpusBand;
  label: string;
  before: readonly CorpusBlock[];
  scenario: readonly CorpusBlock[];
  scene?: SketchName;
}) {
  const labelledBy = headingIdOf(band);
  const firstTable = scenario.findIndex((block) => block.type === 'table');
  const words = firstTable < 0 ? scenario : scenario.slice(0, firstTable);
  const tail = firstTable < 0 ? [] : scenario.slice(firstTable);
  return (
    <Layout as="section" id={band.id} aria-labelledby={labelledBy} rowGap="block">
      <h2 id={labelledBy}>{band.headingText}</h2>
      {exampleFlow(before, labelledBy)}
      <ExamplePanel intro={[]} labelledBy={labelledBy}>
        <Layout rowGap="stack">
          <Layout
            columns={{ base: 1, xl: [1, 1] }}
            colGap="section"
            rowGap="stack"
            align="center"
          >
            <Layout rowGap="block">
              <p className={styles.legend}>{label}</p>
              {exampleFlow(words, labelledBy, true)}
            </Layout>
            <Sketch name={scene} />
          </Layout>
          {tail.length > 0 ? (
            <Layout rowGap="block">{exampleFlow(tail, labelledBy, true)}</Layout>
          ) : null}
        </Layout>
      </ExamplePanel>
    </Layout>
  );
}

/**
 * The column of a comparison whose head names the page's own term ("Governance" on the governance
 * page), or -1. Only a table whose first head cell names something can be one: a blank corner is a
 * keyed table's.
 */
function termColumn(table: TableBlock, term: string | undefined): number {
  if (!term || !plain(table.header[0] ?? []).trim()) return -1;
  const name = term.toLowerCase();
  return table.header.findIndex((cell) => {
    const head = plain(cell).trim().toLowerCase();
    return head.length > 0 && (head === name || name.endsWith(` ${head}`));
  });
}

/**
 * A corpus table. Read across rows, its first column is the row key (DataTable's key column). A
 * COMPARISON of the page's term with its neighbours (4 Nov 2026, the glossary: "Style guide ·
 * Component library · Design system") has no key: its head row is the things compared and its rows
 * are sentences across them, so every column is a peer and the column naming the page's term is
 * picked. Keying it set every cell of the first neighbour bold, as if it were the others' headings.
 */
export function CorpusTable({
  table,
  labelledBy,
  term,
  narrow,
  bounded = false,
}: {
  table: TableBlock;
  labelledBy: string;
  /** On a ground that already bounds it, the tool's example panel (DataTable `bounded`). */
  bounded?: boolean;
  /** DataTable's phone reading: a tool's worksheet reads down (4 Nov 2026); else the table scrolls. */
  narrow?: 'scroll' | 'read-down';
  /** The page's defined term, on a glossary page: a table comparing it with its peers is keyless. */
  term?: string;
}) {
  const pick = termColumn(table, term);
  if (pick >= 0) {
    return (
      <DataTable
        labelledBy={labelledBy}
        columns={table.header.map((cell) => ({ heading: plain(cell) }))}
        pickColumn={pick}
        bounded={bounded}
        {...(narrow ? { narrow } : {})}
        rows={table.rows.map((row) => ({
          header: plain(row[0] ?? []),
          cellsHtml: table.header.map((_, index) => inlineToHtml(row[index] ?? [])),
        }))}
      />
    );
  }
  const [key = [], ...columns] = table.header;
  return (
    <DataTable
      labelledBy={labelledBy}
      keyColumn={{ heading: plain(key) }}
      bounded={bounded}
      {...(narrow ? { narrow } : {})}
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
  tool,
}: {
  page: CorpusPage;
  sections: readonly CorpusBand[];
  /** A tool page's additions to the column (`ToolShell`). Absent: the article's column as it was. */
  tool?: ToolShell;
}) {
  /* One set for the whole argument: a case links at its first mention, never on the page's own. */
  const seen = new Set<string>([page.route]);
  const outline: TocItem[] = sections
    .filter((band) => band.headingText !== '')
    /* The section's short navigation label where the copy authors one (`navigation.section_labels`),
       so the rail reads as a list of names rather than wrapped headings; else the heading. */
    .map((band) => ({
      label: band.navLabel ?? band.headingText,
      href: `#${headingIdOf(band)}` as const,
    }));
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
              <ArticleSection key={band.id} page={page} band={band} seen={seen} tool={tool} />
            ))}
          </Layout>
        </Layout>
      </Section>
    </div>
  );
}

/**
 * A section that is only `[Term](/glossary/…): definition` lines (a term page's "Terms related to
 * …"): the same drawn term card as the hub, each related term's own scene on its plate, titled by
 * its link and told by this section's own words for it (4 Nov 2026). They are destinations, so they
 * are cards under the section's head, not run-on body text. Null for any other section.
 */
function relatedTerms(band: CorpusBand): BlockCardSetItem[] | null {
  const live = band.blocks.filter((block) => block.type !== 'comment');
  if (live.length < 2) return null;
  const items: BlockCardSetItem[] = [];
  for (const block of live) {
    const lead = linkLead(block);
    if (!lead || !lead.link.href.startsWith('/glossary/')) return null;
    const body = plain(lead.body).trim();
    const scene = glossarySceneFor(lead.link.href);
    items.push({
      id: lead.link.href,
      title: plain(lead.link.children),
      body: body.charAt(0).toUpperCase() + body.slice(1),
      href: lead.link.href,
      ...(scene ? { media: { type: 'sketch' as const, name: scene } } : {}),
    });
  }
  return items;
}
