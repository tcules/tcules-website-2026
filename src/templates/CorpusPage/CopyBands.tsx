import { Fragment, type ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  type IconName,
  Layout,
  Media,
  Prose,
  Sketch,
} from '@/components';
import {
  Bento,
  BlockCardSet,
  Callout,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  DataTable,
  ListCard,
  ClaimSet,
  OfferParts,
  OfferSheet,
  ReadDown,
  Steps,
  type BentoItem,
  type BlockCardSetItem,
  type ClaimExample,
  type OfferPart,
  type OfferSheetItem,
  type ReadDownRow,
  type Step,
} from '@/patterns';
import type { CorpusBand, CorpusBlock, CorpusLink, CorpusPage } from '@/lib/corpus-types';
import { glyphForRoute } from '@/lib/glyphs';
import { inlineToHtml, inlineToText, type InlineRun } from '@/lib/inline';
import { getKitPhoto, HOME_SECTOR_PHOTOS } from '@/lib/photos';
import { placeholderIllustration, placeholderImage } from '@/lib/placeholders';
import { MEDIA_SPLIT } from '@/lib/image-sizes';
import { serviceSceneFor, type SketchName } from '@/lib/sketches';

import { ListTiles, head } from './blocks';
import styles from './CorpusPage.module.css';
import { caseCover, slotImage, slugOf, type SlotImage } from './images';
import { signature } from './plan';
import {
  boldLead,
  isExample,
  hasLink,
  labelTitle,
  leadOf,
  linkLead,
  plain,
  trimStart,
} from './text';

/**
 * The 26 Oct 2026 copy's band renderers (docs/page-build/component-map.md § A, § B; 29 Oct 2026),
 * one per kind the plan's id table names. Shared by OfferPage, HomePage and AboutPage, so a band id
 * renders the same wherever the copy uses it. Every arrangement is Layout and the kit's units; no
 * margin, no distance, no ground of its own; every word is the copy's, in its order.
 */

type ItemBlock = Extract<CorpusBlock, { type: 'item' }>;
type TableBlock = Extract<CorpusBlock, { type: 'table' }>;
type LinkRun = Extract<InlineRun, { type: 'link' }>;

export const content = (band: CorpusBand) =>
  band.blocks.filter((block) => block.type !== 'comment');

/** Runs as a card or row body: plain text, or one paragraph of HTML when they carry markup. */
function bodyFields(runs: readonly InlineRun[]): { body: string } | { bodyHtml: string } {
  return hasLink(runs) || runs.some((run) => run.type !== 'text')
    ? { bodyHtml: inlineToHtml(runs) }
    : { body: plain(runs) };
}

/** The first link inside runs (a bold label authored as a link), if any. */
function linkIn(runs: readonly InlineRun[]): LinkRun | undefined {
  for (const run of runs) {
    if (run.type === 'link') return run;
    if ('children' in run) {
      const inner = linkIn(run.children);
      if (inner) return inner;
    }
  }
  return undefined;
}

/** A bold label with no words after it ("**What you receive**"): a label over what follows. */
const isBareLabel = (block: CorpusBlock): boolean => {
  const lead = leadOf(block);
  return lead !== null && plain(lead.body).trim().length === 0;
};

/* ── Links ───────────────────────────────────────────────────────────────────── */

/**
 * A band's closing links as its actions: one link is a CtaRow; two are CtaRow's PAIR, an outlined
 * button then the link in one row (owner, 30 Oct 2026: two actions side by side are never two
 * identical links; decisions/2026-10-30-two-actions-outline-then-link); three or more stack as a
 * list of links.
 */
export function LinkActions({
  links,
  rule = false,
  pair = true,
}: {
  links: readonly CorpusLink[];
  rule?: boolean;
  /**
   * Default true. Two links as one row with a hierarchy (CtaRow's pair). False only to force a
   * stacked list of two links — no current caller needs it.
   */
  pair?: boolean;
}): ReactNode {
  const [first, second] = links;
  if (!first) return null;
  if (links.length === 1) {
    return <CtaRow rule={rule} actions={[{ label: first.labelText, href: first.href }]} />;
  }
  if (pair && second && links.length === 2) {
    return (
      <CtaRow
        rule={rule}
        actions={[
          { label: first.labelText, href: first.href },
          { label: second.labelText, href: second.href },
        ]}
      />
    );
  }
  return (
    <Layout rowGap="text" justifyItems="start">
      {links.map((link) => (
        <Button
          key={`${link.href}-${link.labelText}`}
          as="a"
          href={link.href}
          emphasis="link"
          tone="primary"
          size="md"
          extendHitArea
          icon={<Icon name="arrow-right" />}
        >
          {link.labelText}
        </Button>
      ))}
    </Layout>
  );
}

/* ── A table, its key column linked (C6) ─────────────────────────────────────── */

/** A corpus table as the site's DataTable: a linked key cell keeps its link (`headerHtml`, C6). */
export function CorpusTable({ table, labelledBy }: { table: TableBlock; labelledBy?: string }) {
  const [key = [], ...columns] = table.header;
  return (
    <DataTable
      labelledBy={labelledBy}
      keyColumn={{ heading: plain(key) }}
      columns={columns.map((cell) => ({ heading: plain(cell) }))}
      rows={table.rows.map((row) => {
        const keyCell = row[0] ?? [];
        return {
          header: plain(keyCell),
          ...(hasLink(keyCell) ? { headerHtml: inlineToHtml(keyCell) } : {}),
          cellsHtml: row.slice(1).map((cell) => inlineToHtml(cell)),
        };
      })}
    />
  );
}

/* ── The rest of a band, in order ───────────────────────────────────────────── */

/**
 * Blocks in their authored order as kit units: running paragraphs as one Prose column, a run of
 * labelled claims as tiles, a table as DataTable, a list as Prose, a link line as its actions, an
 * `###` item as its h3 over its own blocks. What a band's main shape leaves over, so no word drops.
 */
export function BandBody({
  blocks,
  labelledBy,
}: {
  blocks: readonly CorpusBlock[];
  labelledBy?: string;
}): ReactNode {
  const groups: { type: string; blocks: CorpusBlock[] }[] = [];
  for (const block of blocks) {
    if (block.type === 'comment' || block.type === 'form') continue;
    const type =
      block.type === 'paragraph' && leadOf(block) && !isBareLabel(block)
        ? 'labelled'
        : block.type === 'paragraph' || block.type === 'list'
          ? 'prose'
          : block.type;
    const last = groups.at(-1);
    if (last && last.type === type && (type === 'prose' || type === 'labelled')) {
      last.blocks.push(block);
    } else {
      groups.push({ type, blocks: [block] });
    }
  }
  if (groups.length === 0) return null;
  return (
    <Layout rowGap="stack">
      {groups.map((group, index) => (
        <Fragment key={index}>{groupNode(group, labelledBy)}</Fragment>
      ))}
    </Layout>
  );
}

/**
 * A scenario: the paragraph "Illustration, not client work" (italic) and the paragraphs after it. The
 * label stays as authored; the scenario's words go beside the drawing of its story.
 */
export function scenarioParts(blocks: readonly CorpusBlock[]): {
  before: CorpusBlock[];
  label?: string;
  scenario: CorpusBlock[];
} {
  const at = blocks.findIndex(
    (block) =>
      block.type === 'paragraph' &&
      /^illustration, not client work$/i.test(plain(block.runs).trim()),
  );
  if (at < 0) return { before: [...blocks], scenario: [] };
  const found = blocks[at];
  return {
    before: blocks.slice(0, at),
    label: found && found.type === 'paragraph' ? plain(found.runs).trim() : undefined,
    scenario: blocks.slice(at + 1),
  };
}

/** A scenario's label and words, with its drawing on the end side (copy beside a drawing is a split). */
function ScenarioSplit({
  label,
  blocks,
  scene,
}: {
  label: string;
  blocks: CorpusBlock[];
  scene?: SketchName;
}) {
  const words = (
    <Layout rowGap="block">
      <p className={styles.legend}>{label}</p>
      {/* Every block as authored: the prose renderer drops tables, and six worked examples carry
          one (kinds:check, 31 Oct 2026). */}
      <BandBody blocks={blocks} />
    </Layout>
  );
  if (!scene) return words;
  return (
    <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
      {words}
      <Sketch name={scene} />
    </Layout>
  );
}

function proseHtml(blocks: readonly CorpusBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') return `<p>${inlineToHtml(block.runs)}</p>`;
      if (block.type === 'list') {
        const tag = block.ordered ? 'ol' : 'ul';
        return `<${tag}>${block.items.map((item) => `<li>${inlineToHtml(item)}</li>`).join('')}</${tag}>`;
      }
      return '';
    })
    .join('');
}

function groupNode(
  group: { type: string; blocks: CorpusBlock[] },
  labelledBy?: string,
): ReactNode {
  switch (group.type) {
    case 'prose':
      return (
        <ContentSectionText>
          <Prose html={proseHtml(group.blocks)} />
        </ContentSectionText>
      );
    case 'labelled':
    case 'labelledBlock': {
      const rows = group.blocks.flatMap((block) => {
        const lead = leadOf(block);
        return lead ? [{ title: labelTitle(lead.label), ...rowBody(lead.body) }] : [];
      });
      return <ListTiles rows={rows} columns={rows.length % 3 === 0 ? 3 : 2} />;
    }
    case 'table':
      return group.blocks.map((block, index) =>
        block.type === 'table' ? (
          <CorpusTable key={index} table={block} labelledBy={labelledBy} />
        ) : null,
      );
    case 'links':
      return (
        <LinkActions
          links={group.blocks.flatMap((block) => (block.type === 'links' ? block.links : []))}
        />
      );
    case 'item':
      return group.blocks.map((block, index) =>
        block.type === 'item' ? (
          <Layout key={index} rowGap="block">
            <h3>{block.headingText}</h3>
            <BandBody blocks={block.blocks} labelledBy={labelledBy} />
          </Layout>
        ) : null,
      );
    case 'quote':
      return null;
    default:
      return null;
  }
}

const rowBody = (runs: readonly InlineRun[]) =>
  hasLink(runs) || runs.some((run) => run.type !== 'text')
    ? { bodyHtml: [inlineToHtml(runs)] }
    : { body: plain(runs) };

/* ── Sheets: what you get, a catalogue, argued items (C4, C7) ─────────────────── */

/** The runs with the first letter of the first text run upper-cased. */
function capitalFirst(runs: InlineRun[]): InlineRun[] {
  const [first, ...rest] = runs;
  return first?.type === 'text'
    ? [
        { type: 'text', text: first.text.charAt(0).toUpperCase() + first.text.slice(1) },
        ...rest,
      ]
    : runs;
}

/**
 * Runs split at the first ` · ` inside a text run: what comes before it and what comes after, both
 * as authored. Null when the separator is not there.
 */
function splitAtDot(runs: readonly InlineRun[]): [InlineRun[], InlineRun[]] | null {
  for (let i = 0; i < runs.length; i += 1) {
    const run = runs[i];
    if (run?.type !== 'text') continue;
    const at = run.text.indexOf(' · ');
    if (at < 0) continue;
    const before = run.text.slice(0, at);
    const after = run.text.slice(at + 3);
    return [
      [...runs.slice(0, i), ...(before ? [{ type: 'text' as const, text: before }] : [])],
      [...(after ? [{ type: 'text' as const, text: after }] : []), ...runs.slice(i + 1)],
    ];
  }
  return null;
}

/**
 * One list item or claim as a promise. A bold lead is the title (a lead authored as a link keeps it,
 * C7); otherwise a colon inside the first seventy characters splits title from body; otherwise the
 * whole sentence is the title (component-map § A `what-you-get`).
 */
function sheetItem(
  runs: readonly InlineRun[],
  opts?: { wholeSentence?: boolean; runOn?: boolean },
): OfferSheetItem {
  const lead = boldLead(runs);
  /* An expertise page's "What we design" item is "**Kind** what it covers · the client or the
     promise". The bold is the start of one phrase, not a label: titled on the bold alone, the body
     began ", from sign-up…" or "· Cover explained…". The phrase up to ` · ` is the title, and what
     follows it is the body (a client, often linked, or the promise). Words unchanged. */
  if (lead && opts?.runOn) {
    /* The untrimmed runs after the bold: `boldLead` trims the gap the phrase needs. */
    const split = splitAtDot(runs.slice(1));
    const phrase = split ? split[0] : runs.slice(1);
    const note = split ? trimStart(split[1]) : [];
    const link = linkIn(lead.label);
    const title = `${inlineToText(lead.label)}${inlineToText(phrase)}`
      .replace(/\s+/g, ' ')
      .trim();
    return {
      title,
      ...(link ? { href: link.href } : {}),
      ...(note.length > 0 ? bodyFields(note) : {}),
    };
  }
  if (lead) {
    const link = linkIn(lead.label);
    const labelText = inlineToText(lead.label).trim();
    /* Titles on What you get, the sentence kept whole (owner, 30 Oct 2026): "**A tested brief:** what
       goes in…" is a title over its remainder; a run-on lead ("**The build,** alongside…") titles
       with its own opening and keeps the whole authored sentence as the body. */
    if (labelText.endsWith(':')) {
      return {
        title: labelTitle(lead.label),
        ...bodyFields(capitalFirst(trimStart(lead.body))),
      };
    }
    if (opts?.wholeSentence && !link && !labelText.endsWith('.')) {
      return {
        title: labelText.replace(/,$/, '').trim(),
        ...bodyFields([...lead.label, { type: 'text', text: ' ' }, ...trimStart(lead.body)]),
      };
    }
    const body = trimStart(lead.body);
    return {
      title: labelTitle(lead.label),
      ...(link ? { href: link.href } : {}),
      ...(body.length > 0 ? bodyFields(body) : {}),
    };
  }
  const text = plain(runs);
  const colon = text.indexOf(':');
  if (colon > 0 && colon < 70 && !hasLink(runs)) {
    const body = text.slice(colon + 1).trim();
    return {
      title: text.slice(0, colon).trim(),
      body: body.charAt(0).toUpperCase() + body.slice(1),
    };
  }
  /* No lead: the sentence is a statement, never a title (OfferSheetItem `title`). */
  return { id: text, ...bodyFields(trimStart(runs)) };
}

export type SheetParts = {
  lead?: string;
  /** Lead paragraphs after the first, which carry a link or are a second paragraph. */
  intro: CorpusBlock[];
  listLabel?: string;
  items: OfferSheetItem[];
  /** What follows the items, in order. */
  after: CorpusBlock[];
};

/**
 * A band read as a sheet of promises: an opening paragraph (the lead), a bare bold label over the
 * list, the items (a list, a run of labelled claims, or `###` items), and whatever follows.
 */
export function sheetParts(band: CorpusBand): SheetParts {
  const blocks = content(band);
  const listAt = blocks.findIndex((block) => block.type === 'list');
  const itemAt = blocks.findIndex((block) => block.type === 'item');
  const claimAt = blocks.findIndex((block) => leadOf(block) !== null && !isBareLabel(block));
  const starts = [listAt, itemAt, claimAt].filter((at) => at >= 0);
  const start = starts.length > 0 ? Math.min(...starts) : blocks.length;

  const before = blocks.slice(0, start);
  const labelBlock = before.find(isBareLabel);
  const opening = before.filter((block) => block !== labelBlock);
  const [first, ...intro] = opening;
  const lead =
    first?.type === 'paragraph' && !hasLink(first.runs) ? plain(first.runs) : undefined;
  const introBlocks = lead ? intro : opening;

  let items: OfferSheetItem[] = [];
  let end = start;
  const at = blocks[start];
  if (at?.type === 'list') {
    const opts = {
      wholeSentence: band.id === 'what-you-get',
      runOn: band.id === 'what-we-design',
    };
    items = at.items.map((runs) => sheetItem(runs, opts));
    /* A set is titled throughout or not at all (review 29 Oct): where any promise is authored with
       no lead of its own, every promise is a statement, its words whole in the body role. */
    if (items.some((item) => !item.title)) {
      items = at.items.map((runs) => ({ id: plain(runs), ...bodyFields(trimStart(runs)) }));
    }
    end = start + 1;
  } else if (at?.type === 'item') {
    while (blocks[end]?.type === 'item') {
      const item = blocks[end] as ItemBlock;
      const paras = item.blocks.filter((block) => block.type === 'paragraph');
      items.push({
        title: item.headingText,
        ...(paras.length > 0
          ? {
              bodyHtml: paras
                .map((block) => (block.type === 'paragraph' ? inlineToHtml(block.runs) : ''))
                .join(' '),
            }
          : {}),
      });
      end += 1;
    }
  } else if (at) {
    while (
      blocks[end] &&
      leadOf(blocks[end] as CorpusBlock) &&
      !isBareLabel(blocks[end] as CorpusBlock)
    ) {
      const lead2 = leadOf(blocks[end] as CorpusBlock);
      if (lead2) {
        const link = linkIn(lead2.label);
        items.push({
          title: labelTitle(lead2.label),
          ...(link ? { href: link.href } : {}),
          ...bodyFields(lead2.body),
        });
      }
      end += 1;
    }
  }
  /* `###` items keep the blocks that are not paragraphs (a link line, a list) for after the set. */
  const itemRest =
    at?.type === 'item'
      ? blocks
          .slice(start, end)
          .flatMap((block) =>
            block.type === 'item'
              ? block.blocks.filter((inner) => inner.type !== 'paragraph')
              : [],
          )
      : [];
  return {
    lead,
    intro: introBlocks,
    listLabel:
      labelBlock && leadOf(labelBlock) ? labelTitle(leadOf(labelBlock)!.label) : undefined,
    items,
    after: [...itemRest, ...blocks.slice(end)],
  };
}

/** Promises per row: two for two or four, three for three, five or six (component-map § A). */
const acrossFor = (count: number): 2 | 3 => (count === 2 || count === 4 ? 2 : 3);

/**
 * A band's terms ("**Who does the work.** …") are the labelled claims after its items; every other
 * block is the note. Shared by the sheet's foot and the four-part band.
 */
function bandTerms(rest: readonly CorpusBlock[]): {
  terms: { title: string; body?: string; bodyHtml?: string }[];
  noteBlocks: CorpusBlock[];
} {
  const isTerm = (block: CorpusBlock) => {
    const lead = leadOf(block);
    return lead !== null && !isBareLabel(block) && linkIn(lead.label) === undefined;
  };
  const terms = rest.flatMap((block) => {
    const lead = isTerm(block) ? leadOf(block) : null;
    return lead ? [{ title: labelTitle(lead.label), ...bodyFields(trimStart(lead.body)) }] : [];
  });
  return { terms, noteBlocks: rest.filter((block) => !isTerm(block)) };
}

/**
 * A sheet band (`outcomes`, `catalog`): the promises as ONE OfferSheet, its lead, its list label, and
 * what follows as the note (the terms as tiles, a closing paragraph, the band's links). Seven or eight
 * promises, which the sheet is not built for, read down in two columns instead (component-map Q16).
 */
export function SheetBand({
  band,
  scenes,
}: {
  band: CorpusBand;
  scenes?: (title: string) => OfferSheetItem['scene'];
}) {
  const parts = sheetParts(band);
  const items = parts.items.map((item) => {
    /* A statement's scene is filed under its words, or under the words before its colon. */
    const key = item.title ?? item.id ?? '';
    const scene = scenes?.(key) ?? scenes?.(key.split(':')[0] ?? key);
    return scene ? { ...item, scene } : item;
  });
  const rest = [...parts.intro, ...parts.after];
  const combined =
    rest.length > 0 ? <BandBody blocks={rest} labelledBy={head(band).headingId} /> : undefined;
  const { terms, noteBlocks } = bandTerms(rest);
  const note =
    noteBlocks.length > 0 ? (
      <BandBody blocks={noteBlocks} labelledBy={head(band).headingId} />
    ) : undefined;
  if (items.length > 6) {
    /* A statement (no title of its own) is its body: set as the row's title it would print twice. */
    const rows: ReadDownRow[] = items.map((item) =>
      item.title
        ? {
            title: item.title,
            ...(item.bodyHtml
              ? { bodyHtml: [item.bodyHtml] }
              : item.body
                ? { body: item.body }
                : {}),
          }
        : { title: item.body ?? item.id ?? '' },
    );
    return (
      <ContentSection {...head(band)} data-band="D" lead={parts.lead} footer={combined}>
        <Layout rowGap="block">
          <ReadDown rows={rows} columns={2} />
        </Layout>
      </ContentSection>
    );
  }
  return (
    <OfferSheet
      {...head(band)}
      lead={parts.lead}
      items={items}
      across={acrossFor(items.length)}
      note={note}
      terms={terms.length > 0 ? terms : undefined}
    />
  );
}

/**
 * "What you get" in four parts (owner, 30 Oct 2026, round 7;
 * decisions/2026-10-30-what-you-get-label-rows): the drawn deliverables, then the band's three terms
 * as peers, each a flat drawing beside its words. ONE arrangement for every page (owner, 30 Oct 2026):
 * it used to render only when every drawing existed and fell back to the ruled sheet otherwise, which
 * hid it on all twelve expertise pages. A missing drawing is now the empty plate in its place.
 */
export function WhatYouGetBand({
  band,
  scenes,
}: {
  band: CorpusBand;
  scenes: (key: string) => SketchName | undefined;
}) {
  const parts = sheetParts(band);
  const { terms, noteBlocks } = bandTerms([...parts.intro, ...parts.after]);
  const deliverables = parts.items.map((item) => {
    /* Every deliverable is authored with a title (content-changes, 30 Oct 2026). One that is not
       prints its sentence once, as the title, and development says so. */
    const title = item.title ?? item.body ?? item.id ?? '';
    if (!item.title && process.env.NODE_ENV !== 'production') {
      console.warn(`WhatYouGetBand "${band.id}": "${title}" has no title of its own.`);
    }
    const scene = item.title ? scenes(item.title) : undefined;
    return {
      title,
      ...(item.title && item.bodyHtml ? { bodyHtml: item.bodyHtml } : {}),
      ...(item.title && item.body ? { body: item.body } : {}),
      ...(scene ? { scene } : {}),
    };
  });
  const peers = terms.map((term): OfferPart => {
    const scene = scenes(term.title);
    return { ...term, title: term.title.replace(/[.:]\s*$/, ''), ...(scene ? { scene } : {}) };
  });
  return (
    <OfferParts
      {...head(band)}
      lead={parts.lead}
      deliverablesTitle={parts.listLabel ?? ''}
      deliverables={deliverables}
      parts={peers}
      note={
        noteBlocks.length > 0 ? (
          <BandBody blocks={noteBlocks} labelledBy={head(band).headingId} />
        ) : undefined
      }
    />
  );
}

/* ── Hard parts (challenges) ─────────────────────────────────────────────────── */

/**
 * The hard parts: each row a 168 drawing, the claim (title and body), and its "Example:" paragraph as
 * authored, in three columns across the content width (owner, 30 Oct 2026). A band whose rows do not
 * all carry an "Example:" reads down as before.
 */
/**
 * The one page that renders its hard parts on the page instead of as tabs, so the two can be judged
 * side by side on real pages (owner, 31 Oct 2026). Every other hard-parts band is the tabs.
 */
const HARD_PARTS_ON_PAGE: ReadonlySet<string> = new Set(['/services/product-design']);

export function ChallengesBand({
  page,
  band,
  claimFigure,
  ground = 'paper',
}: {
  page: CorpusPage;
  band: CorpusBand;
  /** A claim's drawing by its title, exported on the band's ground: undefined takes the slot. */
  claimFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
  /** The ground the drawings are exported on: `paper-deep` on a tint band. */
  ground?: 'paper' | 'paper-deep';
}) {
  /* ONE arrangement for every hard-parts band (owner, 30 Oct 2026: a kind renders its approved
     component whatever the content's shape). Until then the proof rows were used only when every
     claim had an "Example:" line, and anything else fell back to a text grid, which hid the approved
     design on 8 of 15 pages; a table inside a claim was dropped in both. Now each claim is a row
     whatever it carries: its drawing (or the labelled slot), its words with any table in place, its
     example as the footnote where it has one. A worked example ("Illustration, not client work") is
     a story, not a claim, so it follows the rows as its own block. */
  const { claims, others, stories, leadText } = claimsOf(band);
  return (
    <ContentSection {...head(band)} data-band="D-claims" lead={leadText}>
      <Layout rowGap="stack">
        {others.length > 0 ? (
          <BandBody blocks={others} labelledBy={head(band).headingId} />
        ) : null}
        <ClaimRows
          claims={claims}
          stories={stories}
          layout={HARD_PARTS_ON_PAGE.has(page.route) ? 'page' : 'tabs'}
          claimFigure={claimFigure}
          ground={ground}
          labelledBy={head(band).headingId}
        />
      </Layout>
    </ContentSection>
  );
}

/**
 * A hard-parts band read as claims: its lead, the blocks before the claims (a band-level table), each
 * claim with its words and example, and the worked examples lifted out of them.
 */
export function claimsOf(band: CorpusBand) {
  const blocks = content(band);
  const claims: Claim[] = [];
  const others: CorpusBlock[] = [];
  const stories: Story[] = [];
  let leadText: string | undefined;
  let open: Claim | undefined;
  const flush = () => {
    if (open) claims.push(open);
    open = undefined;
  };
  const take = (claim: Claim, inner: readonly CorpusBlock[]) => {
    const { before, label, scenario } = scenarioParts(inner);
    for (const block of before) {
      if (block.type === 'paragraph' && claim.example === undefined && isExample(block.runs)) {
        claim.example = inlineToHtml(block.runs);
        claim.exampleRuns = block.runs;
      } else if (block.type !== 'comment') {
        claim.body.push(block);
      }
    }
    if (label) stories.push({ title: claim.title, label, blocks: scenario });
  };
  blocks.forEach((block, index) => {
    const lead = leadOf(block);
    if (block.type === 'item') {
      flush();
      const claim: Claim = { title: block.headingText, body: [] };
      take(claim, block.blocks);
      claims.push(claim);
    } else if (lead && !isBareLabel(block)) {
      flush();
      open = { title: labelTitle(lead.label), body: [] };
      take(open, [{ type: 'paragraph', runs: lead.body }]);
    } else if (block.type === 'paragraph' && open) {
      take(open, [block]);
    } else if (block.type === 'paragraph' && index === 0 && !hasLink(block.runs)) {
      leadText = plain(block.runs);
    } else {
      flush();
      others.push(block);
    }
  });
  flush();

  return { claims, others, stories, leadText };
}

type Story = { title: string; label: string; blocks: CorpusBlock[] };

/** The claim rows, then each worked example as its own block (shared by hard parts and the ledger). */
export function ClaimRows({
  claims,
  stories,
  claimFigure,
  ground,
  labelledBy,
  layout = 'tabs',
}: {
  claims: readonly Claim[];
  stories: readonly Story[];
  /** ClaimSet's layout: `tabs` everywhere but the one page that shows the other (`HARD_PARTS_ON_PAGE`). */
  layout?: 'tabs' | 'page';
  claimFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
  ground: 'paper' | 'paper-deep';
  labelledBy?: string;
}) {
  if (claims.length === 0 && stories.length === 0) return null;
  /* ONE component for every hard-parts band, any shape (owner, 31 Oct 2026): ClaimSet's tabs, each
     claim a slide of two parts (its drawing and words; its example). Below 1024 every claim is on
     the page. A worked example is a story, not a claim, so it follows as its own block. */
  const items = claims.map((claim) => {
    const drawn = claimFigure?.(claim.title, ground);
    const image = drawn
      ? { ...drawn, alt: '', kind: 'illustration' as const }
      : { ...placeholderIllustration(claim.title), alt: '' };
    return {
      title: claim.title,
      figure: <Media image={image} sizes="200px" />,
      words: claimWords(claim.body, labelledBy),
      example: claim.exampleRuns ? claimExample(claim.exampleRuns) : undefined,
    };
  });
  return (
    <Layout rowGap="stack">
      {claims.length > 0 ? (
        <ClaimSet
          id={`${labelledBy ?? 'claims'}-set`}
          labelledBy={labelledBy ?? ''}
          items={items}
          layout={layout}
        />
      ) : null}
      {stories.map((story) => (
        <ScenarioSplit key={story.title} label={story.label} blocks={story.blocks} />
      ))}
    </Layout>
  );
}

/** One hard part: its title, its words in order (a table included), and its example if it has one. */
export type Claim = {
  title: string;
  body: CorpusBlock[];
  example?: string;
  exampleRuns?: readonly InlineRun[];
};

/**
 * A claim's "Example:" paragraph as the example panel takes it: the label dropped (the panel names
 * it), the closing "Read the … case" link lifted out as the panel's case link, every other word as
 * authored and in order.
 */
function claimExample(runs: readonly InlineRun[]): ClaimExample {
  const rest = [...runs];
  const first = rest[0];
  let label: string | undefined;
  if (first?.type === 'text') {
    /* The label is the copy's own: "Example:" names the panel "Example"; a qualified one ("Example,
       from related work:") keeps its qualifier as the panel's label, so no authored word is lost. */
    const match = /^\s*(example\b[^:.]{0,40}):\s*/i.exec(first.text);
    if (match) {
      label = match[1];
      rest[0] = { type: 'text', text: first.text.slice(match[0].length) };
    }
  }
  for (
    let end = rest.at(-1);
    end?.type === 'text' && end.text.trim() === '';
    end = rest.at(-1)
  ) {
    rest.pop();
  }
  const last = rest[rest.length - 1];
  let link: ClaimExample['link'];
  if (last?.type === 'link' && /^read\b/i.test(plain(last.children))) {
    rest.pop();
    link = { href: last.href, label: plain(last.children) };
    const tail = rest[rest.length - 1];
    if (tail?.type === 'text')
      rest[rest.length - 1] = { type: 'text', text: tail.text.trimEnd() };
  }
  return { label, bodyHtml: inlineToHtml(rest), link };
}

/** A claim's words, one node per block: paragraphs in the claim's body role, a table or list in place. */
function claimWords(blocks: readonly CorpusBlock[], labelledBy?: string): ReactNode[] {
  return blocks.map((block, i) =>
    block.type === 'paragraph' ? (
      <p
        key={i}
        className={styles.hardBody}
        dangerouslySetInnerHTML={{ __html: inlineToHtml(block.runs) }}
      />
    ) : (
      <BandBody key={i} blocks={[block]} labelledBy={labelledBy} />
    ),
  );
}

/* ── Method (steps) ──────────────────────────────────────────────────────────── */

/** A step's title without the numeral the copy wrote into it ("**1. We read it.**"): Steps numbers. */
const stepTitle = (label: readonly InlineRun[]) => labelTitle(label).replace(/^\d+\.\s*/, '');

function stepOf(runs: readonly InlineRun[]): Step {
  /* The bold run is the title as written (a trailing comma stays), the rest the body: no
     sentence extension, so every step in a list is a short title over its body. */
  const lead = boldLead(runs);
  if (lead) {
    const body = trimStart(lead.body);
    return {
      title: stepTitle(lead.label),
      ...(body.length > 0 ? rowBody(body) : {}),
    };
  }
  return { title: plain(runs) };
}

/**
 * A method: the ordered steps (a list, or a run of labelled claims) as Steps under the head; the
 * opening paragraph as the lead; everything else, a table included, in order around them.
 */
export function MethodBand({
  band,
  scenario,
  figure,
  noteIcon,
}: {
  band: CorpusBand;
  scenario?: SketchName;
  figure?: { sketch: SketchName } | { image: SlotImage };
  /** A glyph that heads the sentences after the steps, which then stand as callouts, not prose. */
  noteIcon?: IconName;
}) {
  const blocks = content(band);
  const [first] = blocks;
  const leadText =
    first?.type === 'paragraph' && !leadOf(first) && !hasLink(first.runs)
      ? plain(first.runs)
      : undefined;
  const rest = leadText ? blocks.slice(1) : blocks;
  const listAt = rest.findIndex((block) => block.type === 'list');
  const claimAt = rest.findIndex((block) => leadOf(block) !== null && !isBareLabel(block));
  let steps: Step[] = [];
  let from = 0;
  let to = 0;
  if (claimAt >= 0 && (listAt < 0 || claimAt < listAt)) {
    from = claimAt;
    to = claimAt;
    while (
      rest[to] &&
      leadOf(rest[to] as CorpusBlock) &&
      !isBareLabel(rest[to] as CorpusBlock)
    ) {
      const lead = leadOf(rest[to] as CorpusBlock)!;
      steps.push({ title: stepTitle(lead.label), ...rowBody(trimStart(lead.body)) });
      to += 1;
    }
  } else if (listAt >= 0) {
    const list = rest[listAt] as Extract<CorpusBlock, { type: 'list' }>;
    steps = list.items.map(stepOf);
    from = listAt;
    to = listAt + 1;
  } else if (
    blocks.length >= 2 &&
    blocks.length <= 5 &&
    blocks.every((block) => block.type === 'paragraph' && !hasLink(block.runs))
  ) {
    /* Instructions authored as plain paragraphs, one each (/glossary `how-to-use`, review 29 Oct:
       the first of seven text bands in a row): each paragraph a step, its first sentence the title
       and the rest its body. Every word kept; no lead is taken, because the first paragraph is the
       first instruction. */
    steps = blocks.map((block) => {
      const text = block.type === 'paragraph' ? plain(block.runs).trim() : '';
      const match = /^(.+?[.?!])\s+([\s\S]+)$/.exec(text);
      return match ? { title: match[1] ?? text, body: match[2] ?? '' } : { title: text };
    });
    return (
      <ContentSection {...head(band)} data-band="F">
        <Steps steps={steps} />
      </ContentSection>
    );
  }
  const before = rest.slice(0, from);
  const parts = scenarioParts(rest.slice(to));
  const after = parts.before;
  const stepsNode =
    steps.length === 0 ? null : figure ? (
      <Layout
        columns={{ base: 1, lg: [1, 1] }}
        colGap="section"
        rowGap="stack"
        align={'sketch' in figure ? 'center' : 'start'}
      >
        <Steps steps={steps} />
        {'sketch' in figure ? (
          <Sketch name={figure.sketch} />
        ) : (
          <Media image={figure.image} sizes={MEDIA_SPLIT} />
        )}
      </Layout>
    ) : (
      <Steps steps={steps} />
    );
  return (
    <ContentSection {...head(band)} data-band="F" lead={leadText}>
      <Layout rowGap="stack">
        {before.length > 0 ? (
          <BandBody blocks={before} labelledBy={head(band).headingId} />
        ) : null}
        {stepsNode}
        {after.length > 0 ? (
          noteIcon ? (
            <Layout rowGap="block">
              {after.map((block, index) =>
                block.type === 'paragraph' ? (
                  <Callout
                    key={index}
                    tone="example"
                    html={inlineToHtml(block.runs)}
                    icon={<Icon name={noteIcon} size="xl" />}
                  />
                ) : (
                  <BandBody key={index} blocks={[block]} labelledBy={head(band).headingId} />
                ),
              )}
            </Layout>
          ) : (
            <BandBody blocks={after} labelledBy={head(band).headingId} />
          )
        ) : null}
        {parts.label ? (
          <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/* ── Tables (G11, G12, `compare`, `routes`) ──────────────────────────────────── */

/** A comparison or record band: its opening paragraph as the lead, then every block in order. */
export function TableBand({
  band,
  scenario,
  agreement,
}: {
  band: CorpusBand;
  scenario?: SketchName;
  /**
   * The drawing of a two-column agreement table whose key column has no heading (what we agree before
   * a build). Set, the table is read as the agreement: its one real heading as the legend, each key
   * over its words, the drawing beside them, and the sentences after it as callouts with a mark.
   */
  agreement?: SketchName;
}) {
  const blocks = content(band);
  const [first] = blocks;
  const leadText =
    first?.type === 'paragraph' && !leadOf(first) && !hasLink(first.runs)
      ? plain(first.runs)
      : undefined;
  const parts = scenarioParts(leadText ? blocks.slice(1) : blocks);
  const tableAt = parts.before.findIndex((block) => block.type === 'table');
  const table = parts.before[tableAt];
  const agreed =
    agreement && table?.type === 'table' && table.header.length === 2 ? table : undefined;
  const body = agreed ? (
    <Layout rowGap="stack">
      <BandBody blocks={parts.before.slice(0, tableAt)} labelledBy={head(band).headingId} />
      <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
        <Layout rowGap="block">
          <p className={styles.legend}>{plain(agreed.header[1] ?? [])}</p>
          <Layout as="ul" rowGap="block">
            {agreed.rows.map((row, index) => (
              <li key={index}>
                <Layout rowGap="inline">
                  <h3 className={styles.itemTitle}>{plain(row[0] ?? [])}</h3>
                  <p dangerouslySetInnerHTML={{ __html: inlineToHtml(row[1] ?? []) }} />
                </Layout>
              </li>
            ))}
          </Layout>
        </Layout>
        <Sketch name={agreement!} />
      </Layout>
      {parts.before
        .slice(tableAt + 1)
        .map((block, index) =>
          block.type === 'paragraph' ? (
            <Callout
              key={index}
              tone="example"
              html={inlineToHtml(block.runs)}
              icon={<Icon name="code-square" size="xl" />}
            />
          ) : (
            <BandBody key={index} blocks={[block]} labelledBy={head(band).headingId} />
          ),
        )}
      {parts.label ? (
        <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
      ) : null}
    </Layout>
  ) : parts.label ? (
    <Layout rowGap="stack">
      <BandBody blocks={parts.before} labelledBy={head(band).headingId} />
      <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
    </Layout>
  ) : (
    <BandBody blocks={parts.before} labelledBy={head(band).headingId} />
  );
  return (
    <ContentSection {...head(band)} data-band="E" lead={leadText}>
      {body}
    </ContentSection>
  );
}

/**
 * A table whose rows are the peer items of one mechanism or a choice, each drawn: the drawing, the
 * row's key as its title, what it says, and a third column as one labelled line. Not cards: no box,
 * no ground, no hover. Where any row has no drawing the band is the plain table.
 */
export function DrawnTableBand({
  page,
  band,
  sceneOf,
  scenario,
  arrangement = 'grid',
}: {
  page: CorpusPage;
  band: CorpusBand;
  sceneOf: (key: string) => SketchName | undefined;
  scenario?: SketchName;
  /**
   * `grid`: the items as drawn tiles side by side. `ledger`: one row per item, its drawing at the
   * start, the row's words and its third column across, read left to right. For a table a reader
   * compares across columns (a choice, a chain of checks), where a tile grid would repeat the shape
   * of the band before it (round 5 critic, 30 Oct 2026).
   */
  arrangement?: 'grid' | 'ledger';
}) {
  const blocks = content(band);
  const tableAt = blocks.findIndex((block) => block.type === 'table');
  const table = blocks[tableAt];
  if (!table || table.type !== 'table') return <TableBand band={band} scenario={scenario} />;
  const items = table.rows.map((row) => {
    const keyCell = row[0] ?? [];
    const title = plain(keyCell).trim();
    const link = linkIn(keyCell);
    return {
      title,
      href: link?.href,
      scene: sceneOf(title),
      body: inlineToHtml(row[1] ?? []),
      meta:
        table.header.length >= 3
          ? { label: plain(table.header[2] ?? []), html: inlineToHtml(row[2] ?? []) }
          : undefined,
    };
  });
  if (items.length === 0 || items.some((item) => !item.scene))
    return <TableBand band={band} scenario={scenario} />;
  const leading = blocks.slice(0, tableAt);
  const only = leading.length === 1 ? leading[0] : undefined;
  const leadText =
    only && only.type === 'paragraph' && !hasLink(only.runs) ? plain(only.runs) : undefined;
  const heading = plain(table.header[0] ?? []).trim();
  const after = blocks.slice(tableAt + 1);
  const n = items.length;
  const ledger = (
    <Layout as="ul" rowGap="stack">
      {items.map((item) => (
        <li key={item.title} className={styles.ledgerRow}>
          <Layout
            columns={{ base: 1, lg: [2, 3, 3] }}
            colGap="gutter"
            rowGap="block"
            align="center"
          >
            <Sketch name={item.scene} />
            <Layout rowGap="text">
              <h3 className={styles.itemTitle}>
                {item.href ? (
                  <a href={item.href} className={styles.ledgerLink}>
                    <Cluster colGap="tight" align="center" nowrap>
                      <span>{item.title}</span>
                      <Icon name="arrow-right" size="md" />
                    </Cluster>
                  </a>
                ) : (
                  item.title
                )}
              </h3>
              <p dangerouslySetInnerHTML={{ __html: item.body }} />
            </Layout>
            {item.meta ? (
              <Layout rowGap="inline">
                <p className={styles.legend}>{item.meta.label}</p>
                <p dangerouslySetInnerHTML={{ __html: item.meta.html }} />
              </Layout>
            ) : null}
          </Layout>
        </li>
      ))}
    </Layout>
  );
  const set =
    arrangement === 'ledger' ? (
      ledger
    ) : (
      <Layout rowGap="block">
        {table.header.length === 2 && heading ? (
          <p className={styles.legend}>{heading}</p>
        ) : null}
        <Layout
          as="ul"
          columns={{ base: 1, md: 2, lg: n === 4 ? 4 : 3 }}
          colGap="gutter"
          rowGap="column"
        >
          {items.map((item) => (
            <li key={item.title}>
              <Layout rowGap="block">
                <Sketch name={item.scene} />
                <Layout rowGap="text">
                  <h3 className={styles.itemTitle}>
                    {item.href ? <a href={item.href}>{item.title}</a> : item.title}
                  </h3>
                  <p dangerouslySetInnerHTML={{ __html: item.body }} />
                  {item.meta ? (
                    <p className={styles.proofLine}>
                      <span className={styles.legend}>{item.meta.label}</span>{' '}
                      <span dangerouslySetInnerHTML={{ __html: item.meta.html }} />
                    </p>
                  ) : null}
                </Layout>
              </Layout>
            </li>
          ))}
        </Layout>
      </Layout>
    );
  const bound = page.composition.mediaBindings.some(
    (b) => b.bound && b.supportsSection === band.id,
  );
  return (
    <ContentSection {...head(band)} data-band="drawn-table" lead={leadText}>
      <Layout rowGap="stack">
        {leading.length > 0 && !leadText ? (
          <BandBody blocks={leading} labelledBy={head(band).headingId} />
        ) : null}
        {set}
        {after.length > 0 ? (
          bound ? (
            <Layout
              columns={{ base: 1, lg: [1, 1] }}
              colGap="section"
              rowGap="stack"
              align="center"
            >
              <BandBody blocks={after} />
              <Media image={slotImage(page, band.id)} sizes={MEDIA_SPLIT} />
            </Layout>
          ) : (
            <BandBody blocks={after} />
          )
        ) : null}
      </Layout>
    </ContentSection>
  );
}

/* ── Related reading, term indexes, roles ────────────────────────────────────── */

export type Entry = {
  title: string;
  href?: string;
  body?: string;
  bodyHtml?: readonly string[];
};

/**
 * A paragraph that names a page by its link and then describes it in the next sentence ("[Prototype
 * Readiness Review]. For working prototypes …", /audits `prototype`): the link is the entry's title
 * and the sentence its body, as a colon-led line is. Only a whole sentence after the stop counts.
 */
function linkSentence(block: CorpusBlock): { link: LinkRun; body: InlineRun[] } | null {
  if (block.type !== 'paragraph') return null;
  const [first, second, ...rest] = block.runs;
  if (first?.type !== 'link' || second?.type !== 'text' || !/^\.\s+\S/.test(second.text))
    return null;
  return {
    link: first,
    body: [{ type: 'text', text: second.text.replace(/^\.\s*/, '') }, ...rest],
  };
}

/** The entries of a reading list: link-led lines, bold-linked list items, or `###` items. */
export function entriesOf(blocks: readonly CorpusBlock[]): {
  entries: Entry[];
  rest: CorpusBlock[];
} {
  const entries: Entry[] = [];
  const rest: CorpusBlock[] = [];
  for (const block of blocks) {
    const led = linkLead(block) ?? linkSentence(block);
    if (led) {
      entries.push({
        title: plain(led.link.children),
        href: led.link.href,
        /* A linked row is one link, so its body is plain text (a link may not hold another). */
        body: plain(trimStart(led.body)),
      });
      continue;
    }
    if (block.type === 'list') {
      for (const item of block.items) {
        const lead = boldLead(item);
        const link = lead ? linkIn(lead.label) : undefined;
        if (lead) {
          const body = trimStart(lead.body);
          entries.push({
            title: labelTitle(lead.label).replace(/\.$/, ''),
            ...(link ? { href: link.href } : {}),
            ...(body.length > 0 ? (link ? { body: plain(body) } : rowBody(body)) : {}),
          });
        } else {
          const [only] = item;
          entries.push(
            only?.type === 'link' && item.length === 1
              ? { title: plain(only.children), href: only.href }
              : { title: plain(item) },
          );
        }
      }
      continue;
    }
    if (block.type === 'item') {
      const paras = block.blocks.filter((inner) => inner.type === 'paragraph');
      entries.push({
        title: block.headingText,
        ...(paras.length > 0
          ? {
              body: paras
                .map((inner) => (inner.type === 'paragraph' ? plain(inner.runs) : ''))
                .join(' '),
            }
          : {}),
      });
      continue;
    }
    rest.push(block);
  }
  return { entries, rest };
}

/** A reading list as ruled rows (the long-form router), two columns from four entries. */
export function RelatedBand({ band }: { band: CorpusBand }) {
  const blocks = content(band);
  const [first] = blocks;
  const leadText =
    first?.type === 'paragraph' && !linkLead(first) && !hasLink(first.runs)
      ? plain(first.runs)
      : undefined;
  const { entries, rest } = entriesOf(leadText ? blocks.slice(1) : blocks);
  const footer = rest.length > 0 ? <BandBody blocks={rest} /> : undefined;
  /* A term index (every entry a link-led line, /glossary's five groups) is two columns from two
     entries, so the groups share one grid down the page instead of switching between one column
     and two by their counts (29 Oct 2026). Other lists keep one column under four. */
  const termIndex = entries.length >= 2 && /^A+P?$/.test(signature(band));
  return (
    /* One entry under a full-width head was a stub: ~500px of band for one row (/audits `prototype`,
       review 29 Oct). A single entry reads beside its head instead, the band a head's height. */
    <ContentSection
      {...head(band)}
      data-band="K"
      lead={leadText}
      footer={footer}
      {...(entries.length === 1 ? { arrangement: 'beside' as const } : {})}
    >
      <Layout
        as="ul"
        columns={entries.length >= 4 || termIndex ? { base: 1, md: 2 } : { base: 1 }}
        colGap="gutter"
        rowGap="none"
      >
        {entries.map((entry) => (
          <ListCard
            key={`${entry.href ?? ''}-${entry.title}`}
            titleAs="h3"
            title={entry.title}
            href={entry.href}
            {...(entry.bodyHtml ? { bodyHtml: entry.bodyHtml } : { body: entry.body })}
          />
        ))}
      </Layout>
    </ContentSection>
  );
}

/* ── Industries (S7, and home's approved sector cards) ───────────────────────── */

/** Sector links, from a link row or a sentence of links. */
function sectorLinks(band: CorpusBand): { href: string; title: string }[] {
  const out: { href: string; title: string }[] = [];
  for (const block of content(band)) {
    if (block.type === 'links') {
      out.push(...block.links.map((link) => ({ href: link.href, title: link.labelText })));
    } else if (block.type === 'paragraph') {
      for (const run of block.runs) {
        if (run.type === 'link') out.push({ href: run.href, title: plain(run.children) });
      }
    }
  }
  return out;
}

/**
 * The sectors a page knows, on the standard card grid
 * (decisions/2026-10-30-industries-are-a-card-grid): three across from 1024, two across below (phone
 * pair, never a scroll row, so every sector stays visible); each card its sector's 16:9 photograph or
 * placeholder and its name, the whole card a link. A sentence of links (`P`) is the lead; a paragraph
 * after the links is the footer.
 */
export function IndustriesBand({ page, band }: { page: CorpusPage; band: CorpusBand }) {
  const links = sectorLinks(band);
  const blocks = content(band);
  const sentence =
    blocks.length === 1 && blocks[0]?.type === 'paragraph' ? blocks[0] : undefined;
  const trailing = blocks.filter((block, index) => index > 0 && block.type === 'paragraph');
  const footer = trailing.length > 0 ? <BandBody blocks={trailing} /> : undefined;
  const image = (href: string, title: string) => {
    const photo = HOME_SECTOR_PHOTOS[href];
    return photo ? getKitPhoto(photo) : placeholderImage(page.route, band.id, slugOf(title));
  };
  const cards: BlockCardSetItem[] = links.map((link) => ({
    id: link.href,
    title: link.title,
    href: link.href,
    media: { type: 'image', image: image(link.href, link.title) },
  }));
  return (
    <ContentSection
      {...head(band)}
      data-band="C-image"
      footer={footer}
      {...(sentence ? { lead: plain(sentence.runs) } : {})}
    >
      <BlockCardSet items={cards} lead="none" across={3} cue="title" phone="pair" />
    </ContentSection>
  );
}

/* ── Destinations (G16) ──────────────────────────────────────────────────────── */

/**
 * Items that each lead to a page: `###` items with a link line, or a link row alone. Where every
 * destination has its service scene, the approved Bento (four tracks for four or eight, else three);
 * otherwise one icon card each, under the full-width head (component-map G16).
 */
export function DestinationsBand({ band }: { band: CorpusBand }) {
  const blocks = content(band);
  const items = blocks.filter((block): block is ItemBlock => block.type === 'item');
  const firstOther = blocks.findIndex((block) => block.type !== 'paragraph');
  const leadParas = blocks.slice(0, firstOther < 0 ? blocks.length : firstOther);
  const [leadBlock, ...moreLead] = leadParas;
  const leadText =
    leadBlock?.type === 'paragraph' && !hasLink(leadBlock.runs)
      ? plain(leadBlock.runs)
      : undefined;
  const intro = leadText ? moreLead : leadParas;
  const dest =
    items.length > 0
      ? items.flatMap((item) => {
          const link = item.blocks.flatMap((inner) =>
            inner.type === 'links' ? inner.links : [],
          )[0];
          const paras = item.blocks.filter((inner) => inner.type === 'paragraph');
          return [
            {
              title: item.headingText,
              href: link?.href,
              ctaLabel: link?.labelText,
              bodyHtml: paras.map((inner) =>
                inner.type === 'paragraph' ? inlineToHtml(inner.runs) : '',
              ),
            },
          ];
        })
      : blocks
          .flatMap((block) => (block.type === 'links' ? block.links : []))
          .map((link) => ({
            title: link.labelText,
            href: link.href,
            ctaLabel: undefined,
            bodyHtml: [] as string[],
          }));
  const scenes = dest.map((d) => (d.href ? serviceSceneFor(d.href) : undefined));
  const introNode = intro.length > 0 ? <BandBody blocks={intro} /> : null;
  let set: ReactNode;
  if (dest.length >= 3 && scenes.every(Boolean) && dest.every((d) => d.href)) {
    const tiles: BentoItem[] = dest.map((d, index) => ({
      id: d.href as string,
      title: d.title,
      href: d.href as string,
      scene: scenes[index]!,
      ...(d.bodyHtml.length > 0
        ? { body: d.bodyHtml.map((h) => h.replace(/<[^>]+>/g, '')).join(' ') }
        : {}),
    }));
    set = <Bento items={tiles} tracks={dest.length % 4 === 0 ? 4 : 3} />;
  } else {
    const cards: BlockCardSetItem[] = dest.map((d) => ({
      id: d.href ?? d.title,
      title: d.title,
      ...(d.bodyHtml.length > 0 ? { bodyHtml: d.bodyHtml } : {}),
      ...(d.href ? { href: d.href, icon: glyphForRoute(d.href) } : {}),
      ...(d.ctaLabel ? { ctaLabel: d.ctaLabel } : {}),
    }));
    const labelled = cards.every((card) => card.ctaLabel);
    set = (
      <BlockCardSet
        items={cards}
        lead="none"
        across={cards.length % 4 === 0 ? 4 : 3}
        cue={labelled ? 'cta' : 'title'}
        scroll="never"
      />
    );
  }
  return (
    <ContentSection {...head(band)} data-band="C-icon" lead={leadText}>
      {introNode ? (
        <Layout rowGap="stack">
          {introNode}
          {set}
        </Layout>
      ) : (
        set
      )}
    </ContentSection>
  );
}

/* ── Tool groups (G23) ───────────────────────────────────────────────────────── */

/**
 * A tool hub group: each tool's bold linked name and the paragraph after it as one card, under the
 * head; a table or a closing paragraph follows the cards.
 *
 * Every tool is a worksheet with no cover yet, so each card is led by its tool's glyph (the icon
 * set), until the tools are drawn in the kit's Sketch style. Two across in every group.
 */
export function DirectoryBand({ band }: { page?: CorpusPage; band: CorpusBand }) {
  const blocks = content(band);
  const cards: BlockCardSetItem[] = [];
  const rest: CorpusBlock[] = [];
  /* Each tool is its bold linked name and the ONE paragraph after it; a linked card's body is
     plain text, since the whole card is the link and a link may not hold another. */
  let open: BlockCardSetItem | undefined;
  for (const block of blocks) {
    const lead = leadOf(block);
    if (lead) {
      const link = linkIn(lead.label);
      const body = trimStart(lead.body);
      const icon = link ? glyphForRoute(link.href) : undefined;
      open = {
        id: link?.href ?? labelTitle(lead.label),
        title: labelTitle(lead.label),
        ...(link ? { href: link.href } : {}),
        ...(icon ? { icon } : {}),
        ...(body.length > 0 ? { body: plain(body) } : {}),
      };
      cards.push(open);
    } else if (block.type === 'paragraph' && open && !open.body) {
      open.body = plain(block.runs);
    } else {
      open = undefined;
      rest.push(block);
    }
  }
  /* The tools as the borderless icon set (glyph, then title, then body), as /expertise `services`:
     a texture stand-in cover read as unfinished art (review 29 Oct), and a group of one took a
     horizontal box-beside-words shape its siblings did not. Every group is two across, so a single
     tool is the same card at the same track width as its neighbours. */
  const set = <BlockCardSet items={cards} lead="none" across={2} cue="title" scroll="never" />;
  return (
    <ContentSection {...head(band)} data-band="C-cards">
      {rest.length > 0 ? (
        <Layout rowGap="stack">
          {set}
          <BandBody blocks={rest} labelledBy={head(band).headingId} />
        </Layout>
      ) : (
        set
      )}
    </ContentSection>
  );
}

/* ── Prose, notes and closes (G19, G20) ──────────────────────────────────────── */

/**
 * The argument told in sentences: the paragraphs at the body measure, the band's links as its
 * footer. With a photograph of its own, a media split.
 */
export function TextBand({
  page,
  band,
  side = 'start',
  scenario,
}: {
  page: CorpusPage;
  band: CorpusBand;
  side?: 'start' | 'end';
  scenario?: SketchName;
}) {
  const blocks = content(band);
  const links = blocks.flatMap((block) => (block.type === 'links' ? block.links : []));
  const body = blocks.filter((block) => block.type !== 'links');
  const parts = scenarioParts(body);
  const text = parts.label ? (
    <Layout rowGap="stack">
      <BandBody blocks={parts.before} />
      <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
    </Layout>
  ) : (
    <BandBody blocks={body} />
  );
  const actions = links.length > 0 ? <LinkActions links={links} /> : undefined;
  if (page.composition.mediaBindings.some((b) => b.bound && b.supportsSection === band.id)) {
    return (
      <ContentSection
        {...head(band)}
        data-band="B"
        arrangement="media"
        media={{ image: slotImage(page, band.id), side, weight: 'photo' }}
        actions={actions}
      >
        {text}
      </ContentSection>
    );
  }
  return (
    <ContentSection {...head(band)} data-band="C-text" footer={actions}>
      {text}
    </ContentSection>
  );
}

/** A boundary on the band before it (`confidentiality`): one Callout under its own heading. */
export function NoteBand({ band }: { band: CorpusBand }) {
  return (
    <ContentSection {...head(band)} data-band="C-note">
      <ContentSectionText>
        <Callout html={proseHtml(content(band))} />
      </ContentSectionText>
    </ContentSection>
  );
}

/**
 * A page's last ask: the open close, its paragraphs the body (two at most), its link the action.
 * Without a link it is a short prose band. The open close is an ink island on CtaSection's own paper
 * band (decisions/2026-10-29-cta-band-is-an-ink-island), so it takes no surface from the plan.
 */
export function CloseBand({
  page,
  band,
  island,
}: {
  page: CorpusPage;
  band: CorpusBand;
  /** The close's island, ink unless the page closes on blue (About: owner, 31 Oct 2026). */
  island?: 'blue' | 'ink';
}) {
  const blocks = content(band);
  const links = blocks.flatMap((block) => {
    if (block.type === 'links') return block.links;
    if (block.type === 'paragraph') {
      const only =
        block.runs.length === 1 && block.runs[0]?.type === 'link' ? block.runs[0] : undefined;
      return only
        ? [{ href: only.href, label: only.children, labelText: plain(only.children) }]
        : [];
    }
    return [];
  });
  const paras = blocks.filter(
    (block): block is Extract<CorpusBlock, { type: 'paragraph' }> =>
      block.type === 'paragraph' &&
      !(block.runs.length === 1 && block.runs[0]?.type === 'link'),
  );
  const simple = paras.length <= 2 && paras.every((block) => !hasLink(block.runs));
  const others = blocks.some((block) => block.type !== 'paragraph' && block.type !== 'links');
  const [first, second] = links;
  if (first && simple && !others) {
    const body = paras.map((block) => plain(block.runs));
    return (
      <CtaSection
        id={band.id}
        data-band="L"
        arrangement="open"
        {...(island ? { island } : {})}
        heading={band.headingText}
        body={body.length > 0 ? (body.slice(0, 2) as [string] | [string, string]) : undefined}
        actions={
          second
            ? [
                { label: first.labelText, href: first.href },
                { label: second.labelText, href: second.href },
              ]
            : [{ label: first.labelText, href: first.href }]
        }
      />
    );
  }
  return <TextBand page={page} band={band} />;
}
