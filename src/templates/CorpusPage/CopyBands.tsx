import { Fragment, type ReactNode } from 'react';

import {
  Button,
  Cluster,
  Icon,
  type IconName,
  Island,
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
  ClaimProof,
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
  ServiceTile,
} from '@/patterns';
import type { CorpusBand, CorpusBlock, CorpusLink, CorpusPage } from '@/lib/corpus-types';
import { corpusImage, type CorpusImage } from '@/lib/corpus-images';
import { glyphForRoute } from '@/lib/glyphs';
import { ANCHORS, anchorHref, ROUTES } from '@/lib/routes';
import { inlineToHtml, inlineToText, type InlineRun } from '@/lib/inline';
import { renderInline } from '@/lib/inline-render';
import { getKitPhoto, HOME_SECTOR_PHOTOS } from '@/lib/photos';
import { placeholderIllustration, placeholderImage } from '@/lib/placeholders';
import { MEDIA_SPLIT } from '@/lib/image-sizes';
import { serviceSceneFor, type SketchName } from '@/lib/sketches';

import { ListTiles, head, headingIdOf } from './blocks';
import styles from './CorpusPage.module.css';
import { StatusMark } from './StatusMark';
import { caseCover, slotImage, slugOf, studioBandPhoto, type SlotImage } from './images';
import { isIllustratedProse, isIslandClose, isWhatYouGet, signature } from './plan';
import {
  boldLead,
  isExample,
  hasLink,
  labelTitle,
  leadOf,
  linkLead,
  plain,
  tileActionFor,
  trimEnd,
  trimStart,
  type OnwardLine,
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
  /* The 3 Nov copy ends its onward links on "→" ("See how we work →"); the link control draws its own
     arrow, so the authored one goes rather than printing twice. Presentation only: the words stay. */
  const bare = (link: CorpusLink): CorpusLink => ({
    ...link,
    labelText: link.labelText.replace(/\s*[→➝➔⟶]\s*$/u, ''),
  });
  const [first, second] = links.map(bare);
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
      {links.map(bare).map((link) => (
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
export function CorpusTable({
  table,
  labelledBy,
  narrow,
}: {
  table: TableBlock;
  labelledBy?: string;
  narrow?: 'scroll' | 'read-down';
}) {
  const [key = [], ...columns] = table.header;
  return (
    <DataTable
      labelledBy={labelledBy}
      {...(narrow ? { narrow } : {})}
      keyColumn={{ heading: plain(key) }}
      columns={columns.map((cell) => ({ heading: plain(cell) }))}
      rows={table.rows.map((row) => {
        const keyCell = row[0] ?? [];
        return {
          header: plain(keyCell),
          ...(hasLink(keyCell) ? { headerHtml: inlineToHtml(keyCell) } : {}),
          cellsHtml: row.slice(1).map((cell) => inlineToHtml(cell)),
          /* In a comparison, the row naming Tcules is the one we suggest (owner, 2 Nov 2026). */
          ...(/^tcules\b/i.test(plain(keyCell).trim()) ? { pick: true } : {}),
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
  narrow,
}: {
  blocks: readonly CorpusBlock[];
  labelledBy?: string;
  /** A table's phone reading (DataTable `narrow`); absent, the table scrolls. */
  narrow?: 'scroll' | 'read-down';
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
        <Fragment key={index}>{groupNode(group, labelledBy, narrow)}</Fragment>
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
  if (at < 0) {
    /* The tools' copy runs the label into the scenario's first paragraph ("*Illustration, not client
       work.* A report builder…"): the italic run is the label, the rest of the paragraph the
       scenario's first. The label's closing full stop belongs to the sentence form, not the label. */
    const inline = blocks.findIndex((block) => inlineLabel(block) !== null);
    if (inline < 0) return { before: [...blocks], scenario: [] };
    const split = inlineLabel(blocks[inline] as CorpusBlock)!;
    return {
      before: blocks.slice(0, inline),
      label: split.label,
      scenario: [
        ...(split.rest.length > 0 ? [{ type: 'paragraph' as const, runs: split.rest }] : []),
        ...blocks.slice(inline + 1),
      ],
    };
  }
  const found = blocks[at];
  return {
    before: blocks.slice(0, at),
    label: found && found.type === 'paragraph' ? plain(found.runs).trim() : undefined,
    scenario: blocks.slice(at + 1),
  };
}

/** A paragraph opening on the italic label "Illustration, not client work." and the words after it. */
function inlineLabel(block: CorpusBlock): { label: string; rest: InlineRun[] } | null {
  if (block.type !== 'paragraph') return null;
  const [first, ...rest] = block.runs;
  if (first?.type !== 'em') return null;
  const text = plain(first.children).trim();
  if (!/^illustration, not client work\.?$/i.test(text)) return null;
  return { label: text.replace(/\.$/, ''), rest: trimStart(rest) };
}

/** A scenario's label and words, with its drawing on the end side (copy beside a drawing is a split). */
function ScenarioSplit({
  label,
  blocks,
  scene,
  plate = false,
}: {
  label: string;
  blocks: CorpusBlock[];
  scene?: SketchName;
  /** Hold the drawing's place with the empty plate until the story is drawn (a panel never half-empty). */
  plate?: boolean;
}) {
  const words = (
    <Layout rowGap="block">
      <p className={styles.legend}>{label}</p>
      {/* Every block as authored: the prose renderer drops tables, and six worked examples carry
          one (kinds:check, 31 Oct 2026). */}
      <BandBody blocks={blocks} />
    </Layout>
  );
  if (!scene && !plate) return words;
  return (
    <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
      {words}
      <Sketch {...(scene ? { name: scene } : {})} />
    </Layout>
  );
}

/**
 * A band that IS a worked example ("Illustration, not client work"; the tool pages): its head, any
 * words before the label, then everything the example is inside the example panel (owner, 2 Nov 2026:
 * one unit on its own ground), the scenario's words beside its story drawing. Until the story is drawn
 * its empty plate holds the place, so the panel is never words in half of it.
 */
export function WorkedExampleBand({ band, scene }: { band: CorpusBand; scene?: SketchName }) {
  const parts = scenarioParts(content(band));
  return (
    <ContentSection {...head(band)} data-band="example">
      <ExamplePanel intro={parts.before} labelledBy={head(band).headingId}>
        <ScenarioSplit label={parts.label ?? ''} blocks={parts.scenario} scene={scene} plate />
      </ExamplePanel>
    </ContentSection>
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
  narrow?: 'scroll' | 'read-down',
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
          <CorpusTable
            key={index}
            table={block}
            labelledBy={labelledBy}
            {...(narrow ? { narrow } : {})}
          />
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
        /* No space before the authored punctuation: "**A walkthrough with your team**, so …". */
        ...bodyFields([
          ...lead.label,
          ...(/^\s*[,;:.]/.test(plain(lead.body))
            ? []
            : [{ type: 'text' as const, text: ' ' }]),
          ...trimStart(lead.body),
        ]),
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
      wholeSentence: isWhatYouGet(band),
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
  arrangement,
  icons,
}: {
  band: CorpusBand;
  scenes?: (title: string) => OfferSheetItem['scene'];
  /** OfferSheet's `arrangement`; the band's, chosen by the page (OfferBands `SHEET_GLYPHS`). */
  arrangement?: 'grid' | 'rows';
  /** A glyph per item title, rows or grid (OfferBands `SHEET_GLYPHS`). */
  icons?: Readonly<Record<string, IconName>>;
}) {
  const parts = sheetParts(band);
  const items = parts.items.map((item) => {
    /* A statement's scene is filed under its words, or under the words before its colon. */
    const key = item.title ?? item.id ?? '';
    const scene = scenes?.(key) ?? scenes?.(key.split(':')[0] ?? key);
    const icon = item.title ? icons?.[item.title] : undefined;
    const drawn = scene ? { ...item, scene } : item;
    return icon ? { ...drawn, icon } : drawn;
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
      {...(arrangement ? { arrangement } : {})}
      note={note}
      terms={terms.length > 0 ? terms : undefined}
    />
  );
}

/**
 * A worked example that is a page of a report (owner 2 Nov 2026; the copy's visual_plan:
 * "ending in a sample report page"): a KEY table (its first column the statuses, its second what each
 * means) and a later table with a column of those same statuses. The key becomes a legend of marks;
 * the later table is the report page, on its own ground, each status in it carrying the key's mark.
 */
function statusReport(
  blocks: readonly CorpusBlock[],
): { key: TableBlock; sheet: TableBlock; column: number } | undefined {
  const norm = (runs: readonly InlineRun[]) => plain(runs).trim().toLowerCase();
  const tables = blocks.filter((block): block is TableBlock => block.type === 'table');
  for (const key of tables) {
    if (key.header.length < 2) continue;
    const names = new Set(key.rows.map((row) => norm(row[0] ?? [])));
    for (const sheet of tables) {
      if (sheet === key || blocks.indexOf(sheet) < blocks.indexOf(key)) continue;
      /* the later table's column named as the key's first column, every value one of the key's */
      const column = sheet.header.findIndex((cell) => norm(cell) === norm(key.header[0] ?? []));
      if (column > 0 && sheet.rows.every((row) => names.has(norm(row[column] ?? [])))) {
        return { key, sheet, column };
      }
    }
  }
  return undefined;
}

/**
 * A worked example as ONE unit (owner, 2 Nov 2026: "this whole thing is for the illustration but reads
 * disconnected"; "can all of these be put inside the panels?"): the sentence that introduces it sits
 * above, and everything the example is — its label, scenario, table and the reading of it — sits inside
 * one tint panel, the example's own ground.
 */
export function ExamplePanel({
  intro,
  labelledBy,
  children,
}: {
  intro: readonly CorpusBlock[];
  labelledBy: string;
  children: ReactNode;
}) {
  return (
    <Layout rowGap="block">
      {intro.length > 0 ? <BandBody blocks={intro} labelledBy={labelledBy} /> : null}
      <Island surface="tint">{children}</Island>
    </Layout>
  );
}

function StatusReport({
  blocks,
  report,
  label,
  labelledBy,
}: {
  blocks: readonly CorpusBlock[];
  report: { key: TableBlock; sheet: TableBlock; column: number };
  label?: string;
  labelledBy: string;
}) {
  const { key, sheet, column } = report;
  const keyAt = blocks.indexOf(key);
  const sheetAt = blocks.indexOf(sheet);
  const between = blocks
    .slice(keyAt + 1, sheetAt)
    .filter(
      (block) => !(block.type === 'paragraph' && label && plain(block.runs).trim() === label),
    );
  /* the scenario: the paragraphs after the label; the intro: those before it */
  const labelAt = blocks.findIndex(
    (block) =>
      block.type === 'paragraph' && label !== undefined && plain(block.runs).trim() === label,
  );
  /* everything before the key (the sentence that introduces it) and before the label: the intro */
  const intro = [
    ...blocks.slice(0, keyAt),
    ...between.filter((block) => blocks.indexOf(block) < labelAt),
  ];
  const scenario = between.filter((block) => blocks.indexOf(block) > labelAt);
  const after = blocks.slice(sheetAt + 1);
  const [keyHead = [], ...rest] = sheet.header;
  /* ONE unit (owner, 2 Nov 2026: "this whole thing is for the illustration but reads disconnected"):
     the sentence that introduces it, then the report page holding everything the example is — its
     label and scenario, the status key as the page's own legend, the page's rows, and the reading of
     them that closes it. */
  const legend = (
    <Layout
      as="ul"
      columns={{ base: 1, md: 3, lg: 5 }}
      colGap="gutter"
      rowGap="block"
      aria-label={plain(key.header[0] ?? [])}
    >
      {key.rows.map((row) => (
        <Layout as="li" key={plain(row[0] ?? [])} rowGap="tight">
          <StatusMark name={plain(row[0] ?? [])} />
          <p className={styles.statusMeaning}>{plain(row[1] ?? [])}</p>
          {/* a key with more columns ("Where the fix belongs") keeps each, under its own name */}
          {key.header.slice(2).map((cell, index) => (
            <Layout key={plain(cell)} rowGap="inline">
              <p className={styles.legend}>{plain(cell)}</p>
              <p className={styles.statusMeaning}>{plain(row[index + 2] ?? [])}</p>
            </Layout>
          ))}
        </Layout>
      ))}
    </Layout>
  );
  return (
    <Layout rowGap="block">
      {intro.length > 0 ? <BandBody blocks={intro} labelledBy={labelledBy} /> : null}
      <Island surface="tint">
        <Layout rowGap="stack">
          <Layout rowGap="block">
            {label ? <p className={styles.legend}>{label}</p> : null}
            {scenario.length > 0 ? (
              <BandBody blocks={scenario} labelledBy={labelledBy} />
            ) : null}
          </Layout>
          {legend}
          {/* Below 768 the page reads down: each area with its mark, then its columns under their
              names. From 768 the table. One shows at a time (display none leaves the other out of
              the accessibility tree too). */}
          <Layout as="ul" rowGap="stack" className={styles.sheetList}>
            {sheet.rows.map((row) => (
              <Layout as="li" key={plain(row[0] ?? [])} rowGap="text">
                <Layout rowGap="tight">
                  <p className={styles.statusName}>{plain(row[0] ?? [])}</p>
                  <StatusMark name={plain(row[column] ?? [])} />
                </Layout>
                {rest.map((cell, index) =>
                  index + 1 === column ? null : (
                    <Layout key={plain(cell)} rowGap="inline">
                      <p className={styles.legend}>{plain(cell)}</p>
                      <p>{plain(row[index + 1] ?? [])}</p>
                    </Layout>
                  ),
                )}
              </Layout>
            ))}
          </Layout>
          <div className={styles.sheetTable}>
            <DataTable
              labelledBy={labelledBy}
              keyColumn={{ heading: plain(keyHead) }}
              columns={rest.map((cell, index) => ({
                heading: plain(cell),
                ...(index + 1 === column ? { behaviour: 'nowrap' as const } : {}),
              }))}
              rows={sheet.rows.map((row) => ({
                header: plain(row[0] ?? []),
                cellsHtml: row
                  .slice(1)
                  .map((cell, index) =>
                    index + 1 === column
                      ? { node: <StatusMark name={plain(cell)} /> }
                      : inlineToHtml(cell),
                  ),
              }))}
            />
          </div>
          {after.length > 0 ? <BandBody blocks={after} labelledBy={labelledBy} /> : null}
        </Layout>
      </Island>
    </Layout>
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
  /* What the copy sets before the first term (an audit's worked example, the table a deliverable
     points to) stays under the deliverables; what follows the terms closes the band. */
  const firstTerm = parts.after.findIndex((block) => !noteBlocks.includes(block));
  const exampleBlocks = noteBlocks.filter(
    (block) =>
      firstTerm >= 0 &&
      parts.after.indexOf(block) >= 0 &&
      parts.after.indexOf(block) < firstTerm,
  );
  const closingBlocks = noteBlocks.filter((block) => !exampleBlocks.includes(block));
  const story = scenarioParts(exampleBlocks);
  const report = statusReport(exampleBlocks);
  const deliverables = parts.items.map((item) => {
    /* Every deliverable is authored with a title (content-changes, 30 Oct 2026). One that is not
       prints its sentence once, as the title, and development says so. */
    /* A title is a label, so its authored full stop goes, as the terms' does below. */
    const title = item.title?.replace(/\.\s*$/, '') ?? item.body ?? item.id ?? '';
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
      example={
        exampleBlocks.length === 0 ? undefined : report ? (
          <StatusReport
            blocks={exampleBlocks}
            report={report}
            label={story.label}
            labelledBy={head(band).headingId}
          />
        ) : story.label ? (
          <ExamplePanel intro={story.before} labelledBy={head(band).headingId}>
            <ScenarioSplit
              label={story.label}
              blocks={story.scenario}
              scene={scenes('scenario')}
            />
          </ExamplePanel>
        ) : (
          (() => {
            /* An unlabelled example (the UX audit's real Dealpath finding): the paragraphs before its
               first table introduce it; the table and what reads it are the example. */
            const firstTable = exampleBlocks.findIndex((block) => block.type !== 'paragraph');
            const cut = firstTable < 0 ? 0 : firstTable;
            return (
              <ExamplePanel
                intro={exampleBlocks.slice(0, cut)}
                labelledBy={head(band).headingId}
              >
                <BandBody blocks={exampleBlocks.slice(cut)} labelledBy={head(band).headingId} />
              </ExamplePanel>
            );
          })()
        )
      }
      note={
        closingBlocks.length > 0 ? (
          <BandBody blocks={closingBlocks} labelledBy={head(band).headingId} />
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

/**
 * A paragraph authored as an example ("Example: …", "Example, from related work: …"). Wherever the copy
 * gives a claim its example, the example is set apart as the ClaimProof panel, never run on in the
 * argument's words (owner, 2 Nov 2026; decisions/2026-11-02-examples-are-one-pattern).
 */
export function isExampleParagraph(
  block: CorpusBlock,
): block is Extract<CorpusBlock, { type: 'paragraph' }> {
  if (block.type !== 'paragraph') return false;
  const first = block.runs[0];
  return first?.type === 'text' && /^\s*example\b[^:.]{0,40}:/i.test(first.text);
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
export function claimExample(runs: readonly InlineRun[]): ClaimExample {
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
  /* A step authored as a `###` item (its heading the title, its paragraphs the body) is the same step
     as a bold-led paragraph, read the same way (4 Nov 2026, /future-interfaces-lab/join "How the
     fellowship works": five `###` steps rendered no steps at all). */
  const itemAt = rest.findIndex(
    (block) =>
      block.type === 'item' && block.blocks.every((inner) => inner.type === 'paragraph'),
  );
  let steps: Step[] = [];
  const trailingNotes: Step[] = [];
  let from = 0;
  let to = 0;
  const firstOf = (...at: number[]) => Math.min(...at.filter((n) => n >= 0));
  if (itemAt >= 0 && itemAt === firstOf(itemAt, claimAt, listAt)) {
    from = itemAt;
    to = itemAt;
    for (
      let block = rest[to];
      block?.type === 'item' && block.blocks.every((inner) => inner.type === 'paragraph');
      block = rest[to]
    ) {
      const paras = block.blocks.flatMap((inner) =>
        inner.type === 'paragraph' ? [inner.runs] : [],
      );
      steps.push(
        paras.length === 1
          ? { title: block.headingText, ...rowBody(paras[0] ?? []) }
          : paras.length > 1
            ? { title: block.headingText, bodyHtml: paras.map((runs) => inlineToHtml(runs)) }
            : { title: block.headingText },
      );
      to += 1;
    }
  } else if (claimAt >= 0 && (listAt < 0 || claimAt < listAt)) {
    from = claimAt;
    to = claimAt;
    /* A step authored as a bold-led paragraph keeps the plain paragraphs that follow it as more of
       its body (owner, 2 Nov 2026, /audits/prototype-readiness-review: two paragraphs between steps
       broke the run, so two steps were numbered and the rest fell into a text grid). A paragraph
       with a link is not a step's continuation: it is the band's closing line. */
    const isStep = (block: CorpusBlock | undefined) =>
      block !== undefined && leadOf(block) !== null && !isBareLabel(block);
    const continues = (block: CorpusBlock | undefined) =>
      block?.type === 'paragraph' && !leadOf(block) && !hasLink(block.runs);
    while (isStep(rest[to])) {
      const lead = leadOf(rest[to] as CorpusBlock)!;
      const paras: InlineRun[][] = [trimStart(lead.body)];
      to += 1;
      while (continues(rest[to])) {
        const block = rest[to] as Extract<CorpusBlock, { type: 'paragraph' }>;
        paras.push([...block.runs]);
        to += 1;
      }
      steps.push(
        paras.length === 1
          ? { title: stepTitle(lead.label), ...rowBody(paras[0] ?? []) }
          : { title: stepTitle(lead.label), bodyHtml: paras.map((runs) => inlineToHtml(runs)) },
      );
    }
    /* Steps named in sequence ("Before we start", "First, …", "Then, …") end where a lead stops
       naming a moment: "A wider review" is a variant of the work, not its next step, so it stands
       after the steps as a note on them rather than as a numbered step. */
    const ORDINAL = /^(before|first|second|third|then|next|after|finally|last)\b/i;
    if (steps.filter((step) => ORDINAL.test(step.title)).length >= 2) {
      while (steps.length > 0 && !ORDINAL.test(steps[steps.length - 1]!.title)) {
        const extra = steps.pop()!;
        trailingNotes.unshift(extra);
      }
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
      /* The approved method is steps beside ONE flat graphic (owner, 30 Oct 2026); until the page's
         drawing exists its labelled plate stands beside them, never the steps alone in half the band
         (owner, 2 Nov 2026). */
      <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
        <Steps steps={steps} />
        <Sketch />
      </Layout>
    );
  return (
    <ContentSection {...head(band)} data-band="F" lead={leadText}>
      <Layout rowGap="stack">
        {before.length > 0 ? (
          <BandBody blocks={before} labelledBy={head(band).headingId} />
        ) : null}
        {stepsNode}
        {trailingNotes.map((note) => (
          <Callout
            key={note.title}
            label={note.title.replace(/[.:]\s*$/, '')}
            html={note.bodyHtml ? note.bodyHtml.join(' ') : (note.body ?? '')}
          />
        ))}
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
  narrow,
}: {
  band: CorpusBand;
  scenario?: SketchName;
  /** The table's phone reading (DataTable `narrow`): a directory of tools reads down (4 Nov 2026). */
  narrow?: 'scroll' | 'read-down';
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
      <BandBody blocks={parts.before} labelledBy={head(band).headingId} narrow={narrow} />
      <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
    </Layout>
  ) : (
    <BandBody blocks={parts.before} labelledBy={head(band).headingId} narrow={narrow} />
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
  /* One named offer on its own (/audits `prototype`: the sixth audit, kept apart from the chooser) is
     that offer's service tile, a whole row under the band's heading (named-services-are-service-tiles;
     media-rows-take-a-whole-row): its name, the sentence the copy sets beside it, its own drawing and
     the action for what it opens. Words unchanged. 4 Nov 2026. It sits on the band's ground with no
     box (ServiceTile `frame="none"`): one item a row needs none, and boxed it read as a stray sixth
     tile under the chooser's full-row tile (critic, audits run, 4 Nov 2026). */
  const [only] = entries;
  const onlyScene = entries.length === 1 && only?.href ? serviceSceneFor(only.href) : undefined;
  if (only?.href && onlyScene && !only.bodyHtml) {
    return (
      <ContentSection {...head(band)} data-band="service-tile" lead={leadText} footer={footer}>
        <Layout as="ul" rowGap="none">
          <li data-media-row="">
            <ServiceTile
              title={only.title}
              {...(only.body ? { body: only.body } : {})}
              href={only.href}
              scene={onlyScene}
              action={tileActionFor(only.href)}
              wide
              frame="none"
            />
          </li>
        </Layout>
      </ContentSection>
    );
  }
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
  /* A link to the industries hub ("See all industries →", 3 Nov 2026 copy) is not a sector: it is the
     band's action, in the head (owner, 3 Nov 2026), never a card with a placeholder photograph. */
  const all = sectorLinks(band);
  const links = all.filter((link) => link.href !== ROUTES.expertise);
  const onward: CorpusLink[] = all
    .filter((link) => link.href === ROUTES.expertise)
    .map((link) => ({
      href: link.href,
      label: [{ type: 'text', text: link.title }],
      labelText: link.title,
    }));
  const blocks = content(band);
  const only = blocks.length === 1 && blocks[0]?.type === 'paragraph' ? blocks[0] : undefined;
  /* A sentence of links is the lead only where it has words of its own beyond the links. */
  const sentence =
    only && only.runs.some((run) => run.type === 'text' && /[a-z]{3}/i.test(run.text))
      ? only
      : undefined;
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
      actionsAt="end"
      actions={onward.length > 0 ? <LinkActions links={onward} /> : undefined}
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
 *
 * Two variants a page opts into (4 Nov 2026, /future-interfaces-lab; owner to judge):
 *   - `covers`: every item's own image, by title (images.ts `ITEM_COVERS`). The set is vertical covered
 *     cards, three across, linked only where the item links (C-image).
 *   - `sceneOf`: every item drawn by the page (offer-scenes `items[band]`). Bento's drawn tiles, still
 *     where an item has no page; an item's closing "→" link is its tile's destination (C-icon).
 */
export function DestinationsBand({
  band,
  sceneOf,
  covers,
}: {
  band: CorpusBand;
  sceneOf?: (title: string) => SketchName | undefined;
  covers?: Readonly<Record<string, CorpusImage>>;
}) {
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
          const paras = item.blocks.filter(
            (inner): inner is Extract<CorpusBlock, { type: 'paragraph' }> =>
              inner.type === 'paragraph',
          );
          /* An item paragraph that ends on its "→" link (/future-interfaces-lab's Matter): the link is
             the item's destination, the sentence before it its words. */
          const lastRuns = paras.length > 0 ? trimEnd(paras[paras.length - 1]!.runs) : [];
          const arrow = lastRuns.at(-1);
          const trailing =
            !link && arrow?.type === 'link' && /[→➝➔⟶]\s*$/u.test(plain(arrow.children))
              ? arrow
              : undefined;
          const bodyRuns = paras.map((inner, index) =>
            trailing && index === paras.length - 1 ? trimEnd(lastRuns.slice(0, -1)) : inner.runs,
          );
          return [
            {
              title: item.headingText,
              href: link?.href ?? trailing?.href,
              ctaLabel:
                link?.labelText ??
                (trailing
                  ? plain(trailing.children).replace(/\s*[→➝➔⟶]\s*$/u, '')
                  : undefined),
              /* The trailing link's words, which the body no longer carries: printed as the tile's
                 foot action, so the copy reaches the page whole (critic, 4 Nov 2026). */
              action: trailing
                ? plain(trailing.children)
                    .replace(/\s*[→➝➔⟶]\s*$/u, '')
                    .trim()
                : undefined,
              bodyHtml: bodyRuns.map((runs) => inlineToHtml(runs)),
              bodyText: bodyRuns.map((runs) => plain(runs).trim()).join(' '),
            },
          ];
        })
      : blocks
          .flatMap((block) => (block.type === 'links' ? block.links : []))
          .map((link) => ({
            title: link.labelText,
            href: link.href as string | undefined,
            ctaLabel: undefined as string | undefined,
            action: undefined as string | undefined,
            bodyHtml: [] as string[],
            bodyText: '',
          }));
  const introNode = intro.length > 0 ? <BandBody blocks={intro} /> : null;
  const covered = covers && dest.length > 0 && dest.every((d) => covers[d.title]);
  const drawn = sceneOf && dest.length >= 3 ? dest.map((d) => sceneOf(d.title)) : undefined;
  const scenes = drawn?.every(Boolean)
    ? drawn
    : dest.map((d) => (d.href ? serviceSceneFor(d.href) : undefined));
  let set: ReactNode;
  if (covered) {
    /* Each item shown by its own artefact: the vertical covered card, three across, the whole set
       visible at every width (scroll never: a phone stacks them). */
    const cards: BlockCardSetItem[] = dest.map((d) => ({
      id: d.title,
      title: d.title,
      media: { type: 'image', image: covers[d.title] as CorpusImage },
      ...(d.bodyHtml.length > 0 ? { bodyHtml: d.bodyHtml } : {}),
      ...(d.href ? { href: d.href } : {}),
    }));
    const node = (
      /* `sm`: the drawn set's title step (Bento's h5), so two halves of one list on one page carry
         equal weight (critic, 4 Nov 2026, /future-interfaces-lab). */
      <BlockCardSet items={cards} lead="none" across={3} size="sm" cue="title" scroll="never" />
    );
    return (
      <ContentSection {...head(band)} data-band="C-image" lead={leadText}>
        {introNode ? (
          <Layout rowGap="stack">
            {introNode}
            {node}
          </Layout>
        ) : (
          node
        )}
      </ContentSection>
    );
  }
  if (
    dest.length >= 3 &&
    scenes.every(Boolean) &&
    (drawn?.every(Boolean) || dest.every((d) => d.href))
  ) {
    const tiles: BentoItem[] = dest.map((d, index) => ({
      id: d.href ?? d.title,
      title: d.title,
      ...(d.href ? { href: d.href } : {}),
      scene: scenes[index]!,
      ...(d.bodyText ? { body: d.bodyText } : {}),
      ...(d.href && d.action ? { action: d.action } : {}),
    }));
    /* A set the page draws (`sceneOf`) reads drawing first, then title and body, as the covered set
       it sits beside does; the service bento keeps its words over the drawing. */
    set = (
      <Bento
        items={tiles}
        tracks={dest.length % 4 === 0 ? 4 : 3}
        visual={drawn?.every(Boolean) ? 'start' : 'end'}
      />
    );
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

/**
 * A table naming the page's free tools in its key column, each key linked to its tool (tools critic,
 * 4 Nov 2026: the /tools compare table was the one place a tool's name did not open the tool). A key
 * cell resolves to the tool whose paragraph on this page names it (the directory's own match), the
 * authored name kept verbatim as the link's words. Null unless EVERY row resolves to a tool route, so
 * a table of anything else is left as authored. Such a table is a worksheet directory, and it reads
 * down on a phone (DataTable `narrow="read-down"`).
 */
export function withToolKeyLinks(page: CorpusPage, band: CorpusBand): CorpusBand | null {
  const tools = page.bands.flatMap((other) => toolGroup(other).tools);
  const hrefFor = (name: string) =>
    name
      ? tools.find(
          (tool) => tool.href?.startsWith(`${ROUTES.tools}/`) && tool.body?.includes(name),
        )?.href
      : undefined;
  let linked = false;
  const blocks = band.blocks.map((block) => {
    if (block.type !== 'table' || block.rows.length === 0) return block;
    const hrefs = block.rows.map((row) => hrefFor(plain(row[0] ?? []).trim()));
    if (!hrefs.every(Boolean)) return block;
    linked = true;
    return {
      ...block,
      rows: block.rows.map((row, index) => [
        [
          {
            type: 'link' as const,
            href: hrefs[index]!,
            children: [{ type: 'text' as const, text: plain(row[0] ?? []).trim() }],
          },
        ],
        ...row.slice(1),
      ]),
    };
  });
  return linked ? { ...band, blocks } : null;
}

/* ── Tool groups (G23) ───────────────────────────────────────────────────────── */

type ToolEntry = { title: string; href?: string; body?: string };

/** A tool group's parts: its tools, the router table naming them (if any), and the words after. */
function toolGroup(band: CorpusBand) {
  const blocks = content(band);
  const tools: ToolEntry[] = [];
  const rest: CorpusBlock[] = [];
  /* A linked tile's body is plain text: the whole tile is the link, and a link may not hold another. */
  let open: ToolEntry | undefined;
  for (const block of blocks) {
    const lead = leadOf(block);
    if (lead) {
      const link = linkIn(lead.label);
      const body = trimStart(lead.body);
      open = {
        title: labelTitle(lead.label),
        ...(link ? { href: link.href } : {}),
        ...(body.length > 0 ? { body: plain(body) } : {}),
      };
      tools.push(open);
    } else if (block.type === 'paragraph' && open && !open.body) {
      open.body = plain(block.runs);
    } else {
      open = undefined;
      rest.push(block);
    }
  }
  /* The router table: one row per tool, matched by the tool's name in the row's key cell (the tile's
     body opens with that name), so the key column is carried by the tile itself. */
  const table = rest.find(
    (block): block is TableBlock =>
      block.type === 'table' &&
      block.rows.length === tools.length &&
      block.header.length >= 2 &&
      block.rows.every((row) =>
        tools.some((tool) => tool.body?.includes(plain(row[0] ?? []).trim())),
      ),
  );
  return { tools, table, after: rest.filter((block) => block !== table) };
}

type ToolGroup = ReturnType<typeof toolGroup>;

/** A group of tools with no router table of its own: the groups that run together into one band. */
const isPlainToolGroup = (band: CorpusBand) => {
  const group = toolGroup(band);
  return group.tools.length > 0 && !group.table;
};

/**
 * A band with no tools of its own whose table names, row by row, the tools of the plain groups right
 * after it (/tools `compare`: "Four more worksheets…", one row per worksheet). It is the head of
 * those groups: its table's columns ride in their tiles, so no tool is shown twice.
 */
function hostedRun(page: CorpusPage | undefined, band: CorpusBand): CorpusBand[] {
  const bands = page?.bands ?? [];
  const at = bands.indexOf(band);
  if (at < 0 || toolGroup(band).tools.length > 0) return [];
  const table = content(band).find((block): block is TableBlock => block.type === 'table');
  if (!table) return [];
  const run: CorpusBand[] = [];
  for (let next = at + 1; next < bands.length && isPlainToolGroup(bands[next] as CorpusBand); next++)
    run.push(bands[next] as CorpusBand);
  const tools = run.flatMap((other) => toolGroup(other).tools);
  const names = table.rows.map((row) => plain(row[0] ?? []).trim());
  return names.length === tools.length &&
    names.every((name) => name && tools.some((tool) => tool.body?.includes(name)))
    ? run
    : [];
}

/** The consecutive plain tool groups that `band` belongs to, in order (itself alone if none). */
function toolGroupRun(page: CorpusPage | undefined, band: CorpusBand): CorpusBand[] {
  const bands = page?.bands ?? [];
  const at = bands.indexOf(band);
  if (at < 0 || !isPlainToolGroup(band)) return [band];
  let first = at;
  while (first > 0 && isPlainToolGroup(bands[first - 1] as CorpusBand)) first -= 1;
  let last = at;
  while (last < bands.length - 1 && isPlainToolGroup(bands[last + 1] as CorpusBand)) last += 1;
  return bands.slice(first, last + 1);
}

/**
 * The tools as the /services hub's split tiles (owner, 2 Nov 2026, mock A; tools critic, 4 Nov 2026:
 * one tile form for all six): the drawing, the tool's name and its paragraph in the named half, the
 * router table's value columns ("Best for", "Bring", "You leave with") as the result panel's labelled
 * fields, and "Try the tool" at the panel's foot. `table` is the group's own table or the hosting
 * band's; a row is matched by the tool's name in its key cell (the tile's body opens with that name).
 */
function toolTiles(group: ToolGroup, table: TableBlock | undefined): BentoItem[] {
  return group.tools.map((tool) => {
    const row = table?.rows.find((cells) => tool.body?.includes(plain(cells[0] ?? []).trim()));
    const fields = row
      ? (table?.header ?? []).slice(1).map((cell, index) => ({
          label: plain(cell),
          text: plain(row[index + 1] ?? []),
        }))
      : [];
    const [first, ...more] = fields;
    const scene = tool.href ? serviceSceneFor(tool.href) : undefined;
    const action = tileActionFor(tool.href);
    return {
      id: tool.href ?? tool.title,
      title: tool.title,
      ...(tool.body ? { body: tool.body } : {}),
      ...(tool.href ? { href: tool.href } : {}),
      ...(scene ? { scene } : {}),
      ...(first
        ? {
            detail: {
              ...first,
              ...(more.length > 0 ? { fields: more } : {}),
              ...(action ? { action } : {}),
            },
          }
        : {}),
    };
  });
}

/** One headed group inside a shared band: its authored h2 at the group scale, a `block` over its set. */
function ToolGroupNode({
  band,
  table,
  tracks,
}: {
  band: CorpusBand;
  table: TableBlock | undefined;
  tracks: 2 | 4;
}) {
  const group = toolGroup(band);
  return (
    <Layout as="section" id={band.id} data-band="tool-tiles" rowGap="block">
      <h2 id={headingIdOf(band)} className={styles.groupHeading}>
        {band.headingText}
      </h2>
      <Bento items={toolTiles(group, table)} tracks={tracks} />
    </Layout>
  );
}

/**
 * The plain groups as rows of one band: a group of two takes a row; two single-tool groups in a row
 * share one as two headed halves (decisions/2026-11-04-one-tool-tile), their heads on one shared row
 * from 1024 and bottom-aligned, so both sit a `block` over their tiles and the tiles start and end on
 * one line. Then the groups' words after their sets, under the whole set at the body measure, as the
 * band's onward line, never beside a head.
 */
function ToolGroupRows({
  bands,
  table,
}: {
  bands: readonly CorpusBand[];
  table: TableBlock | undefined;
}) {
  const rows: CorpusBand[][] = [];
  for (const band of bands) {
    const prev = rows.at(-1);
    const single = toolGroup(band).tools.length === 1;
    if (single && prev?.length === 1 && toolGroup(prev[0]!).tools.length === 1) prev.push(band);
    else rows.push([band]);
  }
  /* Each group's words after its set keep their band: the wrapper carries the band's onward id
     (`onwardId`), the seam kinds:check reads a band's lifted words through, as for OnwardIsland. */
  const closing = bands.filter((band) => toolGroup(band).after.length > 0);
  return (
    <Layout rowGap="stack">
      <Layout rowGap="section">
        {rows.map((row) =>
          row.length === 2 ? (
            <Layout
              key={row[0]!.id}
              columns={{ base: 1, lg: [1, 1] }}
              shareRows={2}
              colGap="gutter"
              /* Stacked below 1024, the two groups are a `section` apart like every other row; from
                 1024 each group's own `block` holds between its head and its tiles (subgrid gap). */
              rowGap="section"
            >
              {row.map((band) => (
                <ToolGroupNode key={band.id} band={band} table={table} tracks={2} />
              ))}
            </Layout>
          ) : (
            <ToolGroupNode key={row[0]!.id} band={row[0]!} table={table} tracks={4} />
          ),
        )}
      </Layout>
      {closing.map((band) => (
        <Layout
          key={band.id}
          as="section"
          id={onwardId(band.id)}
          aria-labelledby={headingIdOf(band)}
          rowGap="stack"
        >
          <BandBody blocks={toolGroup(band).after} labelledBy={headingIdOf(band)} />
        </Layout>
      ))}
    </Layout>
  );
}

/**
 * A tool hub group (/tools; tracker 2.57: the glyph cards did not read as clickable). Each tool is its
 * bold linked name and the ONE paragraph after it, and it is a destination, so it is the /services
 * hub's split tile (Bento `detail`), two to a row; its router table's value columns are the tile's
 * result panel, so no column is dropped and no tool is shown twice (tools critic, 4 Nov 2026). Every
 * tool on the page takes this one form, one drawing size, one density.
 *
 * - A group with its own table (`ai`) is its band: the head, the tiles, then the words after the set
 *   at the body measure.
 * - A band whose table names the tools of the plain groups after it (`compare`) hosts them: its head
 *   and lead as the band's, then each group under it with its authored h2 at the group scale (the copy:
 *   "Four more worksheets, for shared components, established products and prototypes"), its table's
 *   columns in their tiles. The hosted bands render nothing of their own.
 * - Otherwise a run of plain groups is one band with no head of its own (the first renders the run).
 *
 * Band order and every word kept. A tool with no drawing yet shows the empty plate.
 */
export function DirectoryBand({ page, band }: { page?: CorpusPage; band: CorpusBand }) {
  const hosted = hostedRun(page, band);
  if (hosted.length > 0) {
    const blocks = content(band);
    const table = blocks.find((block): block is TableBlock => block.type === 'table');
    const rest = blocks.filter((block) => block !== table);
    const [leadBlock, ...more] = rest;
    const leadText =
      leadBlock?.type === 'paragraph' && !hasLink(leadBlock.runs) ? plain(leadBlock.runs) : undefined;
    const intro = leadText ? more : rest;
    return (
      <ContentSection
        {...head(band)}
        data-band="tool-tiles"
        {...(leadText ? { lead: leadText } : {})}
      >
        {intro.length > 0 ? (
          <Layout rowGap="stack">
            <BandBody blocks={intro} labelledBy={headingIdOf(band)} />
            <ToolGroupRows bands={hosted} table={table} />
          </Layout>
        ) : (
          <ToolGroupRows bands={hosted} table={table} />
        )}
      </ContentSection>
    );
  }
  const bands = page?.bands ?? [];
  if (isPlainToolGroup(band)) {
    const run = toolGroupRun(page, band);
    /* Hosted by the table band before the run, which renders it. */
    const runHost = bands[bands.indexOf(run[0]!) - 1];
    if (runHost && hostedRun(page, runHost).length > 0) return null;
    if (run.length > 1) {
      if (run[0] !== band) return null;
      return (
        <ContentSection data-band="tool-tiles">
          <ToolGroupRows bands={run} table={undefined} />
        </ContentSection>
      );
    }
  }
  const group = toolGroup(band);
  const set = <Bento items={toolTiles(group, group.table)} />;
  return (
    <ContentSection {...head(band)} data-band="tool-tiles">
      {group.after.length > 0 ? (
        <Layout rowGap="stack">
          {set}
          <BandBody blocks={group.after} labelledBy={headingIdOf(band)} />
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
  const examples = blocks.filter(isExampleParagraph);
  const body = blocks.filter((block) => block.type !== 'links' && !isExampleParagraph(block));
  const parts = scenarioParts(body);
  const examplePanels = examples.map((block) => (
    <ClaimProof key={inlineToText(block.runs)} example={claimExample(block.runs)} />
  ));
  const text = parts.label ? (
    <Layout rowGap="stack">
      <BandBody blocks={parts.before} />
      <ScenarioSplit label={parts.label} blocks={parts.scenario} scene={scenario} />
    </Layout>
  ) : examplePanels.length > 0 ? (
    <Layout rowGap="block">
      <BandBody blocks={body} />
      {examplePanels}
    </Layout>
  ) : (
    <BandBody blocks={body} />
  );
  const actions = links.length > 0 ? <LinkActions links={links} /> : undefined;
  /* A section head is one size down the page: a media split's head takes the `lg` (h2) role, as a
     plain prose band's does (owner, 1 Nov 2026: "this section's title is suddenly smaller"). */
  if (isIllustratedProse(band.id)) {
    return (
      <ContentSection
        {...head(band)}
        data-band="B"
        arrangement="media"
        media={{
          image: placeholderIllustration(band.headingText),
          side,
          weight: 'photo',
          head: 'lg',
        }}
        actions={actions}
      >
        {text}
      </ContentSection>
    );
  }
  if (page.composition.mediaBindings.some((b) => b.bound && b.supportsSection === band.id)) {
    return (
      <ContentSection
        {...head(band)}
        data-band="B"
        arrangement="media"
        media={{ image: slotImage(page, band.id), side, weight: 'photo', head: 'lg' }}
        actions={actions}
      >
        {text}
      </ContentSection>
    );
  }
  /* A studio photograph the page's plan reuses for this band (images.ts `studioBandPhoto`: an audit's
     "After the audit", the people who carry the report on). The paragraph's closing "→" link is the
     band's action, a link row under the words it closes; the sentence and its inline links stay as
     authored. 4 Nov 2026. */
  const studio = studioBandPhoto(page.route, band.id);
  if (studio) {
    const prose: readonly CorpusBlock[] = body;
    const last = prose.at(-1);
    const tail = last?.type === 'paragraph' ? trimEnd(last.runs) : [];
    const arrow = tail.at(-1);
    const lifted =
      arrow?.type === 'link' && /[→➝➔⟶]\s*$/u.test(plain(arrow.children)) ? arrow : undefined;
    const words =
      lifted && last?.type === 'paragraph'
        ? prose.map((block) =>
            block === last ? { ...last, runs: trimEnd(tail.slice(0, -1)) } : block,
          )
        : prose;
    const liftedLinks = lifted
      ? [{ href: lifted.href, label: lifted.children, labelText: plain(lifted.children) }]
      : [];
    const all = [...liftedLinks, ...links];
    return (
      <ContentSection
        {...head(band)}
        data-band="B"
        arrangement="media"
        media={{ image: corpusImage(studio), side, weight: 'photo', head: 'lg' }}
      >
        {all.length > 0 ? (
          <Layout rowGap="block">
            <BandBody blocks={words} />
            <LinkActions links={all} />
          </Layout>
        ) : (
          <BandBody blocks={words} />
        )}
      </ContentSection>
    );
  }
  /* Two paragraphs that are peers, set side by side under the full-width head (PEER_PARAGRAPHS). */
  const peers = PEER_PARAGRAPHS.has(`${page.route}#${band.id}`)
    ? (body as readonly CorpusBlock[]).flatMap((block) =>
        block.type === 'paragraph' ? [block] : [],
      )
    : [];
  if (peers.length === 2 && peers.length === body.length) {
    return (
      <ContentSection {...head(band)} data-band="C-text" footer={actions}>
        <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="text">
          {peers.map((block, index) => (
            <Prose key={index} html={`<p>${inlineToHtml(block.runs)}</p>`} />
          ))}
        </Layout>
      </ContentSection>
    );
  }
  return (
    <ContentSection {...head(band)} data-band="C-text" footer={actions}>
      {text}
    </ContentSection>
  );
}

/**
 * Prose bands whose two paragraphs are peers of one kind, set as two columns under the full-width head
 * from 1024 (`column` apart: two halves of the same kind), by route and band; one column below, the
 * paragraphs a `text` apart. /careers "The work": what the work is, and how the job grows. As one column
 * at the measure it left the right half of the band empty between two picture bands (4 Nov 2026, owner
 * to confirm). Words unchanged.
 */
const PEER_PARAGRAPHS: ReadonlySet<string> = new Set([
  `${ROUTES.careers}#product-work`,
  /* /matter-design-system "Duplicate Matter from Figma Community and take it apart": how to use the
     file, and the terms it comes on. One column ran about 95 characters a line with the band's right
     third empty (matter critic, 4 Nov 2026, owner to confirm). */
  `${ROUTES.matterDesignSystem}#use`,
]);

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
  /* A close told as ONE sentence that ends on its onward "→" link (an audit's "After the audit",
     owner 4 Nov 2026): the island keeps the sentence and its inline links as authored for its body,
     and the closing "→" link becomes the action, its arrow drawn by the action itself. */
  const only = links.length === 0 && !others && paras.length === 1 ? paras[0] : undefined;
  const runs = only ? trimEnd(only.runs) : [];
  const onward = runs.at(-1);
  if (onward?.type === 'link' && /[→➝➔⟶]\s*$/u.test(plain(onward.children))) {
    return (
      <CtaSection
        id={band.id}
        data-band="L"
        arrangement="open"
        {...(island ? { island } : {})}
        heading={band.headingText}
        body={[<>{renderInline(trimEnd(runs.slice(0, -1)))}</>]}
        actions={[
          {
            label: plain(onward.children).replace(/\s*[→➝➔⟶]\s*$/u, ''),
            href: onward.href,
          },
        ]}
      />
    );
  }
  /* A close whose inline links all go to ONE place (4 Nov 2026, /future-interfaces-lab/join "Ask to
     see work from an experiment": "the contact page … contact Tcules", both /contact): the ink island,
     its words kept whole as the lede and that place its one action, labelled with the first link's
     own words. A LINK action, never a solid: a side door for another reader, and the page's one main
     action is elsewhere. Opted in per band (plan.ts `ISLAND_CLOSES`) until the owner rules it for every such
     close, because it would also turn /how-we-work/ai-native-product-design's "your rules", the
     /insights hubs' "talk" bands and /careers' "apply" into islands. */
  const inline = paras.flatMap((block) =>
    block.runs.flatMap((run) => (run.type === 'link' ? [run] : [])),
  );
  const [lead] = inline;
  if (
    isIslandClose(page.route, band.id) &&
    lead &&
    links.length === 0 &&
    !others &&
    paras.length > 0 &&
    paras.length <= 2 &&
    inline.every((run) => run.href === lead.href)
  ) {
    const words = plain(lead.children);
    return (
      <CtaSection
        id={band.id}
        data-band="L"
        arrangement="open"
        intent="onward"
        {...(island ? { island } : {})}
        heading={band.headingText}
        body={paras.map((block) => plain(block.runs)) as [string] | [string, string]}
        actions={[{ label: words.charAt(0).toUpperCase() + words.slice(1), href: lead.href }]}
      />
    );
  }
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

/**
 * A close the page draws (4 Nov 2026, /future-interfaces-lab `promotion`): the head above, then from
 * 1024 its words beside ONE flat figure, as MethodBand sets steps beside theirs; the plate under the
 * words below 1024. The sentence keeps every inline link as authored, so nothing is lifted into an
 * action. It stays prose (C-text): the figure illustrates the sentence, it is not an island.
 */
export function CloseFigureBand({ band, scene }: { band: CorpusBand; scene: SketchName }) {
  return (
    <ContentSection {...head(band)} data-band="C-text">
      <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack" align="center">
        <BandBody blocks={content(band)} labelledBy={head(band).headingId} />
        <Sketch name={scene} />
      </Layout>
    </ContentSection>
  );
}

/** A one-sentence close split for its island: the sentence as the lede (its link's words kept as words) and the link as the action. */
function closeAsk(band: CorpusBand): { lede: string; action: { label: string; href: string } } | null {
  const paras = content(band).filter(
    (block): block is Extract<CorpusBlock, { type: 'paragraph' }> => block.type === 'paragraph',
  );
  const links = paras.flatMap((block) =>
    block.runs.flatMap((run) => (run.type === 'link' ? [run] : [])),
  );
  const [link] = links;
  if (paras.length !== 1 || links.length !== 1 || !link) return null;
  return {
    lede: plain(paras[0]!.runs).trim(),
    action: { label: plain(link.children), href: link.href },
  };
}

/**
 * Two closes a route pairs on ONE ink island (plan.ts `PAIRED_CLOSES`, 4 Nov 2026): each a heading,
 * its one sentence as the lede, word for word, and that sentence's link as the action, never
 * rewritten. The first keeps the page's solid; the second takes the outline partner and keeps its own
 * anchor on its half. Falls back to the first close alone where either is not one sentence and one link.
 */
export function PairedCloseBand({
  page,
  band,
  second,
}: {
  page: CorpusPage;
  band: CorpusBand;
  second: CorpusBand;
}) {
  const first = closeAsk(band);
  const next = closeAsk(second);
  if (!first || !next) return <CloseBand page={page} band={band} />;
  return (
    <CtaSection
      id={band.id}
      data-band="L"
      arrangement="open"
      heading={band.headingText}
      body={[first.lede]}
      actions={[first.action]}
      second={{
        id: second.id,
        heading: second.headingText,
        body: [next.lede],
        action: next.action,
      }}
    />
  );
}

/* ── The ask: a band's link to the page's enquiry form, as its own ink island ───── */

/**
 * PLACEHOLDER (owner, 3 Nov 2026): the 3 Nov copy closes some bands on a bare "[Book a call](#enquiry)"
 * and gives the island no heading of its own. This stands in until the copy supplies one; it is the
 * ask the 26 Oct copy wrote ("Tell us what you're working on"). Replace it, never reword it per page.
 */
export const ASK_ISLAND_HEADING = 'Tell us what you’re working on';

/** A link to the page's own enquiry form (`#enquiry`): the band's ask, never a destination. */
export function isAskLink(link: { href: string }): boolean {
  return link.href === anchorHref(ANCHORS.enquiry);
}

/** The band's ask, wherever the copy filed it (a link row of its own, or under its last `###` item). */
export function askLinkIn(band: CorpusBand): CorpusLink | undefined {
  const scan = (blocks: readonly CorpusBlock[]): CorpusLink | undefined => {
    for (const block of blocks) {
      if (block.type === 'links') {
        const found = block.links.find(isAskLink);
        if (found) return found;
      }
      if (block.type === 'item') {
        const found = scan(block.blocks);
        if (found) return found;
      }
    }
    return undefined;
  };
  return scan(band.blocks);
}

/**
 * The ask as its own band after the one that wrote it (owner, 3 Nov 2026: "Book a call is the CTA that
 * needs to be presented in the island"): an ink island, the placeholder heading, the link's own words
 * as the one solid, to the form. A page link in the same row stays in the band's head.
 */
export function AskIsland({ link }: { link: CorpusLink }) {
  return (
    <CtaSection
      data-band="L"
      arrangement="open"
      heading={ASK_ISLAND_HEADING}
      actions={[{ label: link.labelText, href: link.href }]}
    />
  );
}

/* ── The onward line: a band's pointer to a piece of reading, as its own ink island ─ */

/** The island's id: the band's own, so the island answers for the line the band no longer holds. */
export const onwardId = (bandId: string) => `${bandId}-onward`;

/**
 * A band's onward line as an ink island after the band (tracker 2.53, 3 Nov 2026): the line's words
 * split, never rewritten (`onwardLine`, text.ts), and the link's own words as the one LINK action,
 * not a solid: it points to reading, it does not ask (`intent="onward"`). Placed by the plan
 * (`placeOnward`): never beside another island or the close.
 */
export function OnwardIsland({ bandId, line }: { bandId: string; line: OnwardLine }) {
  return (
    <CtaSection
      id={onwardId(bandId)}
      data-band="onward"
      arrangement="open"
      intent="onward"
      heading={line.heading}
      body={line.lead ? [line.lead] : undefined}
      actions={[line.link]}
    />
  );
}
