import { Fragment, type ReactNode } from 'react';

import { Icon, Layout, Section, type IconName } from '@/components';
import {
  BlockCard,
  BlockCardSet,
  Bento,
  CaseSpread,
  ClaimProof,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EngagementOptions,
  ListCard,
  OfferSheet,
  Proof,
  Reasons,
  Slider,
  TestimonialBeside,
  Thread,
  TracePlates,
  VoiceLedger,
  type BentoCta,
  type BlockCardSetItem,
  type EngagementFact,
  type EngagementScope,
  type TraceScene,
  type TraceStage,
} from '@/patterns';
import { caseStudyLink } from '@/lib/case-links';
import { caseRouteOf } from '@/lib/corpus-cases';
import { corpusImage } from '@/lib/corpus-images';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusCaseRef,
  CorpusMediaBinding,
  CorpusPage,
} from '@/lib/corpus-types';
import { glyphForRoute } from '@/lib/glyphs';
import { placeholderIllustration } from '@/lib/placeholders';
import {
  offerSceneKey,
  serviceSceneFor,
  type OfferScenes,
  type SketchName,
} from '@/lib/sketches';
import { inlineToHtml, inlineToText, type InlineRun } from '@/lib/inline';
import { renderInline } from '@/lib/inline-render';

import {
  EnquiryBand,
  FaqItems,
  GenericBlocks,
  ListTiles,
  bodyOf,
  head,
  QuoteGroupBand,
  RecognitionBand,
  proofQuote,
  testimonialItem,
  type AvatarsById,
  type RatingsById,
} from './blocks';
import {
  bindingNamed,
  caseCover,
  coverFor,
  hasSlot,
  slotImage,
  slugOf,
  type SlotImage,
} from './images';
import {
  BandBody,
  ChallengesBand,
  ClaimRows,
  claimExample,
  claimsOf,
  isExampleParagraph,
  CloseBand,
  DestinationsBand,
  DirectoryBand,
  DrawnTableBand,
  IndustriesBand,
  LinkActions,
  MethodBand,
  NoteBand,
  RelatedBand,
  SheetBand,
  TableBand,
  withToolKeyLinks,
  TextBand,
  WhatYouGetBand,
  sheetParts,
  AskIsland,
  askLinkIn,
  isAskLink,
  ItemBody,
  SupportQuote,
} from './CopyBands';
import { DestinationGroupsBand, hasDestinationGroups } from './HubBands';
import { ReportBand } from './ReportBand';
import { isWhatYouGet, kindOf, type OfferUnit } from './plan';
import {
  bandLinks,
  blocksOf,
  hasLink,
  labelTitle,
  lastIndexWhere,
  leadOf,
  linksIn,
  linkLead,
  plain,
  tileActionFor,
  trimEnd,
  trimStart,
} from './text';

/**
 * The offer page's bands, one function per shape (page-mapping § 2 and § 4). Every arrangement is
 * Layout, Cluster and the kit's units; this file draws no tile, row or card of its own, sets no
 * margin and no distance, and never overrides a Section's column or ground. A unit arrives already
 * planned (plan.ts): its shape, its surface, its media side and its texture are decided, and every
 * word is the corpus's.
 */

export type OfferContext = {
  page: CorpusPage;
  /** The cases the page cites, as each case's own page describes them (title, cover). */
  caseRefs: Readonly<Record<string, CorpusCaseRef>>;
  /** Studio photographs the corpus binds on other pages, by binding id, for the slots that reuse them. */
  shared: Readonly<Record<string, CorpusMediaBinding>>;
  /**
   * Star ratings for the page's testimonials, by testimonial id, as the route read them (PLACEHOLDERS
   * today: fixtures/testimonial-ratings.ts). A quote with none shows no stars.
   */
  ratings?: RatingsById;
  /** Portraits for the page's testimonials, by testimonial id (PLACEHOLDERS today, as on home). */
  avatars?: AvatarsById;
  /** The drawings the page's items carry, assigned item by item at the content seam (owner, 26 Oct 2026). */
  scenes?: OfferScenes;
  /**
   * A Why Tcules reason's drawing by the reason's title as authored, exported on the band's ground
   * (component-map C1; the content seam's `getReasonFigure`). Undefined for a reason not drawn yet:
   * the band draws the labelled illustration slot in its place (src/lib/placeholders.ts).
   */
  reasonFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
  /**
   * A hard-parts claim's drawing by the claim's title as authored, exported on the band's ground
   * (the content seam's `getClaimFigure`). Undefined for a claim not drawn yet: the band draws the
   * labelled illustration slot in its place.
   */
  claimFigure?: (
    title: string,
    ground: 'paper' | 'paper-deep',
  ) => { src: string; width: number; height: number } | undefined;
};

/** The scene assigned to one item of a band, by the item's title (or a router item's href). */
function sceneFor(ctx: OfferContext, band: CorpusBand, key: string): SketchName | undefined {
  return ctx.scenes?.items[band.id]?.[offerSceneKey(key)] ?? ctx.scenes?.items[band.id]?.[key];
}

type Lead = { title: string; body: readonly InlineRun[] };

/** Every labelled claim of a band as a title and the runs after it, in order. */
/**
 * A result whose last words are a link to a case study: the link (as the band's action reads it) and the
 * sentence without it. Null when the runs end in anything else.
 */
function trailingCaseLink(
  runs: readonly InlineRun[],
): { link: { labelText: string; href: string }; rest: InlineRun[] } | null {
  const last = runs[runs.length - 1];
  if (last?.type !== 'link' || !last.href.startsWith('/case-studies/')) return null;
  const rest = runs.slice(0, -1);
  const prev = rest[rest.length - 1];
  if (prev?.type === 'text')
    rest[rest.length - 1] = { type: 'text', text: prev.text.trimEnd() };
  return { link: { labelText: plain(last.children), href: last.href }, rest };
}

function leads(band: CorpusBand): Lead[] {
  return band.blocks.flatMap((block) => {
    const lead = leadOf(block);
    return lead ? [{ title: labelTitle(lead.label), body: lead.body }] : [];
  });
}

/** The band's first lead-in paragraph (before any labelled claim), as plain text. */
function leadText(band: CorpusBand): string | undefined {
  const first = band.blocks.find((block) => block.type !== 'comment');
  return first?.type === 'paragraph' && !leadOf(first) && !linkLead(first)
    ? plain(first.runs)
    : undefined;
}

/** Options authored as bold-led bullets (About's working terms): the label is the title, as authored. */
function listOptions(band: CorpusBand) {
  return blocksOf(band, 'list').flatMap((list) =>
    list.items.flatMap((runs) => {
      const lead = leadOf({ type: 'paragraph', runs });
      return lead
        ? [
            {
              title: labelTitle(lead.label),
              body: renderInline(lead.body),
              scope: scopeOf(labelTitle(lead.label)),
            },
          ]
        : [];
    }),
  );
}

/**
 * Options authored as `###` items (/how-we-work's engagement shapes: a name, a line saying what kind of
 * engagement it is, then how it works and where it starts), each item's paragraphs in order.
 */
function itemOptions(band: CorpusBand) {
  const lastItem = band.blocks.filter((block) => block.type === 'item').at(-1);
  return band.blocks.flatMap((block) => {
    if (block.type !== 'item') return [];
    const own =
      block === lastItem
        ? block.blocks.slice(0, block.blocks.length - itemCoda(band).length)
        : block.blocks;
    const paragraphs = own.flatMap((inner) =>
      inner.type === 'paragraph'
        ? [inner.runs]
        : inner.type === 'labelled'
          ? [
              [
                { type: 'strong', children: inner.label } as InlineRun,
                { type: 'text', text: ' ' } as InlineRun,
                ...inner.body,
              ],
            ]
          : inner.type === 'list'
            ? inner.items
            : [],
    );
    /* A first paragraph that is wholly italic ("*A focused engagement*") names the kind of option:
       it is the option's eyebrow, not its first line of body (owner, 1 Nov 2026). */
    const only = paragraphs[0]?.length === 1 ? paragraphs[0][0] : undefined;
    const eyebrowRun = only?.type === 'em' ? inlineToText(only.children).trim() : undefined;
    const rest = eyebrowRun ? paragraphs.slice(1) : paragraphs;
    /* A paragraph led by a labelled run ("**How it works:**", "*Typical starting points:*") is one of the
       option's facts, a block of its own under the words, not more body (owner, 1 Nov 2026). */
    const facts = rest.flatMap((runs) => {
      const fact = factOf(runs);
      return fact ? [fact] : [];
    });
    const [first, ...more] = rest.filter((runs) => !factOf(runs));
    return [
      {
        eyebrow: eyebrowRun,
        title: block.headingText,
        body: first ? renderInline(first) : null,
        more: more.map((runs) => renderInline(runs)),
        facts: facts.length > 0 ? facts : undefined,
        scope: scopeOf(block.headingText) ?? (eyebrowRun ? scopeOf(eyebrowRun) : undefined),
      },
    ];
  });
}

const firstRun = (runs: readonly InlineRun[]) =>
  runs.find((run) => !(run.type === 'text' && run.text.trim() === ''));

/**
 * An option's fact: a paragraph opening with a bold or italic run that ends in a colon. The label loses
 * its colon (the key's form says it). The value stays the authored sentence: splitting a list of
 * starting points dropped the copy's own joints (kinds:check, 2 Nov 2026).
 */
function factOf(runs: readonly InlineRun[]): EngagementFact | undefined {
  const lead = firstRun(runs);
  if (lead?.type !== 'strong' && lead?.type !== 'em') return undefined;
  const text = inlineToText(lead.children).trim();
  if (!text.endsWith(':')) return undefined;
  const label = text.replace(/:$/, '');
  const value = trimStart(runs.slice(runs.indexOf(lead) + 1));
  return { label, body: renderInline(value) };
}

/**
 * One case as the proof under a claim: a horizontal BlockCard, the case's cover beside its client, its own
 * title and the example's words, the whole card the link (the paper-deep CaseCard is home's alone, owner
 * 29 Oct 2026). The words are the example's as authored, its "Example:" and client name lifted into the
 * eyebrow.
 */
function CaseTeaser({
  ctx,
  example,
  words,
}: {
  ctx: OfferContext;
  example: { href: string; label: string; client?: string };
  words?: string;
}) {
  const ref = ctx.caseRefs[example.href];
  const client = example.client ?? '';
  return (
    /* A BlockCard is a list item: a set of one. */
    <Layout as="ul" rowGap="block">
      <BlockCard
        orientation="horizontal"
        eyebrow={client ? `Example · ${client}` : 'Example'}
        title={ref?.title ?? example.label}
        body={words}
        href={example.href}
        ctaLabel={example.label}
        media={{ type: 'image', image: caseCover(client || example.label, ref) }}
      />
    </Layout>
  );
}

/**
 * The set’s closing note (owner, 1 Nov 2026, /how-we-work rounds 3–4: the note "feels like floating
 * text"; an example is evidence, not an ask): a paragraph led by a bold sentence is the closing's heading and
 * lead, a paragraph opening "Example:" the case teaser's words and its link. Anything else stays
 * a plain term under the set.
 */
function closingNote(band: CorpusBand): {
  note?: { heading: string; body: string[]; example?: { href: string; label: string } };
  rest: InlineRun[][];
} {
  let heading: string | undefined;
  const body: string[] = [];
  let example: { href: string; label: string; client?: string } | undefined;
  const rest: InlineRun[][] = [];
  for (const runs of itemCoda(band)) {
    const lead = firstRun(runs);
    if (!heading && lead?.type === 'strong') {
      heading = inlineToText(lead.children).trim().replace(/[.:]$/, '');
      body.unshift(inlineToText(runs.slice(runs.indexOf(lead) + 1)).trim());
      continue;
    }
    if (!example && lead?.type === 'text' && /^\s*Example:/.test(lead.text)) {
      const { runs: words, link } = liftTrailingLink(runs);
      /* "Example: **Dealpath.** A focused audit…": the bold name is the client, the rest the words. */
      const named = words.find((run) => run.type === 'strong');
      const client =
        named?.type === 'strong'
          ? inlineToText(named.children).trim().replace(/[.:]$/, '')
          : undefined;
      const after = named ? words.slice(words.indexOf(named) + 1) : words;
      body.push(
        inlineToText(after)
          .replace(/^\s*Example:\s*/, '')
          .trim(),
      );
      if (link)
        example = { href: link.href, label: inlineToText(link.children).trim(), client };
      continue;
    }
    rest.push(runs);
  }
  return { note: heading ? { heading, body, example } : undefined, rest };
}

/**
 * The band's closing note when Markdown has folded it into the last `###` item. An option ends on its
 * italic-labelled line ("*Typical starting points:* …", "*Best when:* …"); whatever follows that line in
 * the LAST item belongs to the whole set (/how-we-work: "Start wherever the work is" and the Dealpath
 * example rendered inside the third option until 1 Nov 2026). Returned as runs, labels kept strong.
 */
function itemCoda(band: CorpusBand): InlineRun[][] {
  const last = band.blocks.filter((block) => block.type === 'item').at(-1);
  if (last?.type !== 'item') return [];
  const closer = lastIndexWhere(last.blocks, (inner) => {
    if (inner.type !== 'paragraph') return false;
    const first = inner.runs.find((run) => !(run.type === 'text' && run.text.trim() === ''));
    return first?.type === 'em' && inlineToText(first.children).trim().endsWith(':');
  });
  if (closer < 0) return [];
  return last.blocks
    .slice(closer + 1)
    .flatMap((inner) =>
      inner.type === 'paragraph'
        ? [inner.runs]
        : inner.type === 'labelled'
          ? [
              [
                { type: 'strong', children: inner.label } as InlineRun,
                { type: 'text', text: ' ' } as InlineRun,
                ...inner.body,
              ],
            ]
          : [],
    );
}

/** The paragraphs that follow the labelled claims or items (a closing note), as runs. */
function trailingParagraphs(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const lastLead = lastIndexWhere(
    blocks,
    (block) => leadOf(block) !== null || block.type === 'item',
  );
  return blocks
    .slice(lastLead + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

const quoteOf = (band: CorpusBand) => blocksOf(band, 'quote')[0];

/** The paragraphs before a band's first labelled claim (its lead-in), as runs. A label line that
    names the first claim's kind (`optionEyebrows`) is the claim's, not the lead-in's. */
function leadingParagraphs(band: CorpusBand): InlineRun[][] {
  const out: InlineRun[][] = [];
  const labels = optionEyebrows(band);
  for (const block of band.blocks) {
    if (block.type === 'comment') continue;
    if (block.type !== 'paragraph' || leadOf(block)) break;
    if (labels.has(block)) continue;
    out.push(block.runs);
  }
  return out;
}

/** A paragraph that is one italic run and nothing else ("*A known goal*"), as its text. */
function italicLine(block: CorpusBlock | undefined): string | undefined {
  if (block?.type !== 'paragraph') return undefined;
  const runs = block.runs.filter((run) => !(run.type === 'text' && run.text.trim() === ''));
  const only = runs.length === 1 ? runs[0] : undefined;
  return only?.type === 'em' ? inlineToText(only.children).trim() : undefined;
}

/**
 * The label lines over a band's bold-led options (v2.1 copy, 4 Nov 2026: "*Optional first step*" over
 * "**A pilot project.** …"): an italic-only paragraph directly before a labelled claim names that
 * claim's kind. Keyed by the paragraph, valued by the claim's title.
 */
function optionEyebrows(band: CorpusBand): Map<CorpusBlock, string> {
  const out = new Map<CorpusBlock, string>();
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  blocks.forEach((block, index) => {
    const line = italicLine(block);
    const next = blocks[index + 1];
    const lead = next ? leadOf(next) : null;
    if (line && lead) out.set(block, line);
  });
  return out;
}

/** The eyebrow over a claim, by the claim's title. */
function eyebrowFor(band: CorpusBand, title: string): string | undefined {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const at = blocks.findIndex((block) => {
    const lead = leadOf(block);
    return lead ? labelTitle(lead.label) === title : false;
  });
  return at > 0 ? italicLine(blocks[at - 1]) : undefined;
}

/** A plain closing line split into the island's heading (its first sentence) and lead (the rest). */
function splitAsk(text: string): { heading: string; lead?: string } {
  const match = /^(.+?[.?!])\s+(.+)$/.exec(text.trim());
  return match ? { heading: match[1]!, lead: match[2] } : { heading: text.trim() };
}

/** A case band's closing links: the link lines after the last case's own "Read the … case". */
function closingCaseLinks(band: CorpusBand) {
  const items = band.blocks.filter(
    (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
  );
  const last = items.at(-1);
  const top = band.blocks.flatMap((b) => (b.type === 'links' ? b.links : []));
  if (!last) return [];
  const lines = last.blocks.flatMap((b) => (b.type === 'links' ? b.links : []));
  return [...(lines.length > 1 ? lines.slice(1) : []), ...top];
}

const tiles = (rows: readonly Lead[], columns: 1 | 2 | 3 = 2) => (
  <ListTiles
    columns={columns}
    rows={rows.map((row) => ({ title: row.title, ...bodyOf(row.body) }))}
  />
);

/** A trailing link run lifted out of a paragraph ("… [Read the case](/…)"): the runs without it, and the link. */
function liftTrailingLink(runs: readonly InlineRun[]) {
  const last = runs.at(-1);
  if (last?.type !== 'link') return { runs: [...runs], link: undefined };
  return { runs: trimEnd(runs.slice(0, -1)), link: last };
}

/**
 * Which scope an engagement option's drawing shows, read from the option's own name (EngagementOptions
 * draws only what the name says). A name none of these fit shows no drawing rather than a wrong one.
 */
/**
 * About's working terms, by their authored titles, each to its own scene, drawn for it as one set
 * (owner, 1 Nov 2026; Sketch/terms.tsx). None borrows How we work together's scopes.
 */
const TERM_SCOPES: Readonly<Record<string, EngagementScope>> = {
  'who you work with': 'who',
  communication: 'communication',
  'response time': 'response',
  'getting started': 'getting-started',
  turnaround: 'turnaround',
  'working hours': 'hours',
  /* /how-we-work's practical details (owner, 1–2 Nov 2026): getting started is About's own term and
     drawing; time zones, fees and notice and ownership take the scenes drawn for those claims. */
  'working across time zones': 'overlap',
  'fees and notice': 'commercial',
  'who decides, and who owns the work': 'own',
  /* The 3 Nov copy's terms (2.60): the decision is yours (options meet at you), no minimum term is the
     notice drawing, the handover is agreed in the proposal before the work starts. "What we make is
     yours" has no scene yet: its empty plate until the flat graphics pass (2.62) draws it. */
  'you keep the product decisions': 'own',
  'no minimum term': 'commercial',
  'handover agreed before work begins': 'getting-started',
};

function scopeOf(title: string): EngagementScope | undefined {
  const name = title.toLowerCase();
  const term = TERM_SCOPES[name.replace(/[.:]\s*$/, '')];
  if (term) return term;
  /* The 26 Oct copy's three engagements (component-map C9): a focused piece of work draws one
     feature, a defined project an area, an ongoing partnership the embedded designer. */
  /* "A pilot project." (3 Nov copy): the fixed price agreed first, then one flow. */
  if (/\bpilot\b/.test(name)) return 'pilot';
  if (/\bfocused\b/.test(name)) return 'feature';
  if (/\bdefined project\b/.test(name)) return 'area';
  if (/\bongoing\b/.test(name)) return 'embedded';
  if (/\bbuild\b/.test(name)) return 'build';
  if (/\b(team|designer|embedded)\b/.test(name)) return 'embedded';
  if (/\b(area|whole|new product)\b/.test(name)) return 'area';
  if (/\b(workflow|feature)\b/.test(name)) return 'feature';
  return undefined;
}

/**
 * Which plate a traced stage draws, read from the stage's own name (TracePlates draws only what the
 * name says). A thread with any stage none of these fit keeps Thread's beads.
 */
function sceneOf(title: string): TraceScene | undefined {
  const name = title.toLowerCase();
  if (/\bsign-?off\b|\baccept/.test(name)) return 'signoff';
  if (/\bhand-?off\b|\bspec/.test(name)) return 'handoff';
  if (/\brunning\b|\blive\b|\bproduct\b/.test(name)) return 'product';
  if (/\bcode\b|\bbuild\b/.test(name)) return 'code';
  if (/\bdesign\b/.test(name)) return 'design';
  return undefined;
}

/** A list item as a stage: its bold lead as the title, the rest as the body. */
function stagesOf(items: readonly InlineRun[][]) {
  return items.map((item) => {
    const split = leadOf({ type: 'paragraph', runs: item });
    return split
      ? { title: labelTitle(split.label), body: plain(split.body) }
      : { title: plain(item) };
  });
}

/**
 * The stages as a trace, when every stage names a point in one screen's life (design, handoff,
 * code, the running product, sign-off); otherwise undefined and the path keeps Thread's beads.
 */
function traceOf(items: readonly InlineRun[][]): TraceStage[] | undefined {
  const stages = stagesOf(items);
  const scenes = stages.map((stage) => sceneOf(stage.title));
  return scenes.every(Boolean)
    ? stages.map((stage, index) => ({ ...stage, scene: scenes[index] as TraceScene }))
    : undefined;
}

/**
 * The tables read across their rows, which sit one under another with their drawing at the start
 * (DrawnTableBand `ledger`): a chain of checks, a choice between services, a comparison. The bands
 * before them ("What you get") are the tile grid, so these take the other shape (round 5 critic).
 */
const LEDGER_BANDS: ReadonlySet<string> = new Set(['status-example', 'options', 'compare']);

/** A method whose closing sentence is its own point (the AI sixth choice) stands as a callout with a mark. */
const METHOD_NOTE_ICON: Readonly<Record<string, IconName>> = { decisions: 'stars' };

/* Sheets set one item per row, title beside its words (OfferSheet `rows`): /clients' "What clients
   have asked us to do", whose items are several sentences naming clients (owner, 4 Nov 2026). */
/**
 * Each Why Tcules reason's glyph, by its title as authored (owner, 4 Nov 2026, homepage pass: "each
 * title gets an inline icon"). The same six reasons on every page that carries the band.
 */
const WHY_GLYPHS: Readonly<Record<string, IconName>> = {
  'Fluent in SaaS': 'layers',
  'Idea to launch': 'flag',
  'Craft people notice': 'eye',
  'Evidence before screens': 'clipboard-check',
  'Seen your problem before': 'users-group-rounded',
  'Start small': 'hand-shake',
};

/**
 * "Why founders and product teams choose Tcules", on every page that repeats it (owner, 4 Nov 2026:
 * the homepage's design carries across): the heading at the left with its way deeper under it, the
 * six reasons down the right in halves, one ruled row each, its glyph inline before its title and its
 * sentence under it (OfferSheet `list`). A reason whose title has no glyph sets the whole list
 * without glyphs, so nothing is dropped and the set never mixes.
 */
export function WhyTculesBand({
  band,
  surface,
}: {
  band: CorpusBand;
  surface?: 'paper' | 'tint';
}) {
  const parts = sheetParts(band);
  /* The run-in's closing full stop is its punctuation, not part of the reason's name. */
  const titled = parts.items.map((item) => ({
    ...item,
    title: item.title?.replace(/\.$/, ''),
  }));
  const glyphs = titled.every((item) => item.title && WHY_GLYPHS[item.title]);
  const items = titled.map((item) =>
    glyphs && item.title ? { ...item, icon: WHY_GLYPHS[item.title] } : item,
  );
  const links = parts.after.flatMap((block) => (block.type === 'links' ? block.links : []));
  return (
    <OfferSheet
      {...head(band)}
      arrangement="list"
      surface={surface}
      lead={parts.lead}
      items={items}
      note={links.length > 0 ? <LinkActions links={links} /> : undefined}
    />
  );
}

/** A carded option's glyph, by its name as authored (owner, 4 Nov 2026: "icons or small graphics"). */
const OPTION_GLYPHS: Readonly<Record<string, IconName>> = {
  'A pilot project': 'flag',
  'A defined project': 'clipboard-check',
  'An ongoing partnership': 'refresh',
};

const SHEET_ROWS: Readonly<Record<string, Readonly<Record<string, IconName>>>> = {
  /* Each glyph by the item's title, as authored; a title the copy renames falls back to no glyph
     and the set warns as mixed. */
  'product-responsibility': {
    'Shape a new product': 'ruler-pen',
    'Improve software customers already rely on': 'refresh-square',
    'Design AI into the product': 'stars',
    'Carry the design into working software': 'code-square',
    'Work as part of an internal product team': 'users-group-rounded',
    "Find out what's wrong before fixing it": 'magnifier-bug',
  },
};

/**
 * A close whose ask is the case index, set as the cases it leads to (owner, 4 Nov 2026: /clients' "Case
 * studies behind the client names"). The copy names no case, so the page picks them here, by the client
 * name routes.ts files the case under; the cards are the 3-column case grid (treatment rules § 1), the
 * paragraph is the lead without its link, and the link is the centred action under the cards.
 */
/**
 * A prose band whose sentences are each about one named client, set as list cards beside the head
 * (owner 4 Nov 2026, /clients). One title per sentence, in order: the client's name, words the
 * sentence already carries. The sentence is the card's body, verbatim, links kept.
 */
const SENTENCE_ROWS: Readonly<Record<string, readonly string[]>> = {
  '/clients#returning-clients': ['Primelis', 'Benchmark Gensuite'],
};

const CLOSE_CASES: Readonly<Record<string, readonly string[]>> = {
  '/clients#case-studies': ['Doodle', 'Benchmark Gensuite', 'Eden AI'],
};

/* ── Unit renderers ───────────────────────────────────────────────────────────── */

export function UnitView({ unit, ctx }: { unit: OfferUnit; ctx: OfferContext }) {
  const { page } = ctx;
  const { band } = unit;

  switch (unit.kind) {
    case 'faq':
      return (
        /* Beside: the question set reads down beside its heading (owner, 4 Nov 2026, homepage pass;
           decisions/2026-11-04-faq-beside-its-heading), in halves (owner, 4 Nov 2026: 50/50). One FAQ shape on
           every page. */
        <ContentSection {...head(band)} data-band="D-faq" arrangement="beside" split="halves">
          <FaqItems band={band} />
        </ContentSection>
      );

    case 'enquiry':
      /* Home's close (owner, 26 Oct 2026: every page closes the way home does): the blue island in
         halves, the sketch-to-shipped drawing over the words, the untitled card beside them. */
      return (
        <EnquiryBand
          page={page}
          band={band}
          island={{ surface: 'blue', dress: 'card', arrangement: 'halves' }}
        />
      );

    /* The client's words, a band of their own on tint, right after the offer or the cases they
       support (owner, 26 Oct 2026). With a portrait, the featured testimonial: the portrait beside the
       quote, the voices' portraits alternating sides; without one, the quote alone, centred. Stars and
       quote marks always (owner, 12 and 26 Oct 2026). A voice after a set of cases links to the case
       its client is from. */
    case 'voice':
      return <Voice unit={unit} ctx={ctx} />;

    /* What you get — the outcomes as ONE offer (OfferSheet; product-design round 6, 11 Oct 2026,
       page-mapping § 23), each promise beside its own drawing where the page assigns one (owner,
       26 Oct 2026). The client's words that close the band in the corpus follow it as a band of their
       own (`voice`, plan.ts), so the offer stands alone: the quote as a third column, or a line under
       the set, "reads as noise". "What you get" itself is FOUR PARTS (OfferParts; owner, 30 Oct 2026,
       round 7; decisions/2026-10-30-what-you-get-label-rows): the deliverables, then who does the
       work, what we need and where our part stops, each part's title in a label column, the last
       three each led by its drawing. The sheet stands wherever a drawing is missing. */
    case 'catalog':
      return <CatalogBand band={band} ctx={ctx} />;
    case 'outcomes':
    case 'set': {
      const scenes = (title: string) => sceneFor(ctx, band, title);
      if (isWhatYouGet(band)) {
        return <WhatYouGetBand band={band} scenes={scenes} />;
      }
      return (
        <SheetBand
          band={band}
          scenes={scenes}
          {...(SHEET_ROWS[band.id]
            ? { arrangement: 'rows' as const, icons: SHEET_ROWS[band.id] }
            : {})}
        />
      );
    }

    /* ── The 26 Oct copy's kinds (component-map § A, § B; CopyBands.tsx) ── */
    case 'quotes':
      return (
        <QuoteGroupBand
          band={band}
          ratings={ctx.ratings}
          avatars={ctx.avatars}
          surface={unit.surface}
        />
      );
    case 'industries':
      return <IndustriesBand page={page} band={band} />;
    case 'challenges':
      return (
        <ChallengesBand
          page={page}
          band={band}
          claimFigure={ctx.claimFigure}
          ground={unit.surface === 'tint' ? 'paper-deep' : 'paper'}
        />
      );
    case 'method': {
      const figureScene = sceneFor(ctx, band, 'figure');
      const bound = page.composition.mediaBindings.some(
        (b) => b.bound && b.supportsSection === band.id,
      );
      const figure = figureScene
        ? { sketch: figureScene }
        : bound
          ? { image: slotImage(page, band.id) }
          : undefined;
      return (
        <MethodBand
          band={band}
          scenario={sceneFor(ctx, band, 'scenario')}
          {...(figure ? { figure } : {})}
          {...(METHOD_NOTE_ICON[band.id] ? { noteIcon: METHOD_NOTE_ICON[band.id] } : {})}
        />
      );
    }
    case 'related':
      return <RelatedBand band={band} />;
    case 'example':
      return <ReportBand band={band} surface={unit.surface} />;
    case 'recognition':
      return <RecognitionBand band={band} />;
    case 'destinations':
      /* `###` groups of linked tables (/expertise `product-types`): HubBands, 29 Oct 2026. */
      return hasDestinationGroups(band) ? (
        <DestinationGroupsBand page={page} band={band} />
      ) : (
        <DestinationsBand band={band} />
      );
    case 'directory':
      return <DirectoryBand page={page} band={band} />;
    case 'text': {
      const clients = SENTENCE_ROWS[`${page.route}#${band.id}`];
      if (clients) return <SentenceRowsBand band={band} titles={clients} />;
      return (
        <TextBand
          page={page}
          band={band}
          side={unit.side}
          scenario={sceneFor(ctx, band, 'scenario')}
        />
      );
    }
    case 'note':
      return <NoteBand band={band} />;
    case 'close': {
      const picks = CLOSE_CASES[`${page.route}#${band.id}`];
      return picks ? (
        <CaseLinksBand band={band} ctx={ctx} names={picks} />
      ) : (
        <CloseBand page={page} band={band} />
      );
    }

    /* Symptoms in the customer's own words, each answered by where we start (VoiceLedger;
       product-design round 6, page-mapping § 23). The reader knows what is going wrong before they
       know which service they need, so the complaint is the band's large thing, set in the speech
       voice down one edge, and the answer is the reply beside it. Round 1–5 set them as a two-column
       read-down beside a placeholder photograph: the eye zigzagged and the voices read as titles. */
    case 'symptoms':
      return (
        <VoiceLedger
          {...head(band)}
          lead={leadText(band)}
          items={leads(band).map((row) => ({
            voice: row.title,
            reply: renderInline(row.body),
            scene: sceneFor(ctx, band, row.title),
          }))}
        />
      );

    /* A worked example, with the emphasis where the argument is (CaseSpread; product-design round 6,
       page-mapping § 23): the OUTCOME ("The result.") is the claim, beside the evidence at 16:9; the
       problem and what we did are the backstory under both; the case link is the claim's action.
       Round 1 set three equal ruled rows beside the shot, so the result read as the third of three. */
    case 'record': {
      const binding = bindingNamed(page, band.headingText);
      /* A product capture is read from its top: the 16:9 frame keeps the screen's header and loses
         the foot (the master is 3:2). */
      const image = binding
        ? { ...corpusImage(binding), focus: { x: 0, y: 0 } }
        : slotImage(page, band.id);
      const rows = leads(band);
      const at = rows.findIndex((row) => /^the result/i.test(row.title));
      const claimAt = at >= 0 ? at : rows.length - 1;
      const claim = rows[claimAt];
      if (!claim) return null;
      /* The case link closes the story as the band's action. Authored either as its own line, or as the
         last words of the result ("…live since late 2025. Read the ConnectX case", /why-tcules): then it
         moves to the action and leaves the sentence it ended, so the strip reads as a case snippet with
         its way into the case at the head, as Dealpath's (owner, 2 Nov 2026). Words unchanged. */
      const tail = trailingCaseLink(claim.body);
      const [link] = bandLinks(band).length > 0 ? bandLinks(band) : tail ? [tail.link] : [];
      const claimBody = tail ? tail.rest : claim.body;
      /* "Example: Dealpath": the kind of band as the eyebrow, the case as the heading (owner, 26 Oct
         2026). Typesetting the authored heading, never rewording it. */
      const named = /^(example):\s*(.+)$/i.exec(band.headingText);
      const story = ctx.scenes?.stories[band.id];
      return (
        <CaseSpread
          {...head(band)}
          {...(named ? { eyebrow: named[1], heading: named[2] } : {})}
          {...(story ? { scenes: story } : {})}
          surface={unit.surface}
          claim={{ title: claim.title, body: renderInline(claimBody) }}
          action={
            link ? (
              <CtaRow rule={false} actions={[{ label: link.labelText, href: link.href }]} />
            ) : undefined
          }
          image={image}
          {...(leadingParagraphs(band).length > 0
            ? { lead: renderInline(leadingParagraphs(band).flat()) }
            : {})}
          {...(trailingParagraphs(band).length > 0
            ? { coda: renderInline(trailingParagraphs(band).flat()) }
            : {})}
          story={rows
            .filter((_, index) => index !== claimAt)
            .map((row) => ({ title: row.title, body: renderInline(row.body) }))}
        />
      );
    }

    /* M8 — cited cases as covers; the case a quote is about featured with the quote beside it. */
    case 'cases': {
      /* The 26 Oct copy: a lead paragraph, three `###` cases, and on some pages a closing link line
         after the last case ("See all case studies"), which is the band's action (component-map C3). */
      const caseLead = leadText(band);
      /* A claim the cases prove, authored as the set's first item with a client's words and no case
         ("Craft people notice", /why-tcules 3 Nov copy): never a card. It leads the set, its words at
         the start and the quote that supports it beside them, the cases under it as its evidence. */
      const claims = band.blocks.filter(isClaimItem);
      const cases = claims.length > 0 ? { ...band, blocks: band.blocks.filter((b) => !isClaimItem(b)) } : band;
      const closing = closingCaseLinks(cases);
      const set =
        claims.length > 0 ? (
          <Layout rowGap="stack">
            {claims.map((claim) => (
              <ClaimLead key={claim.headingText} item={claim} />
            ))}
            <CaseSet ctx={ctx} band={cases} />
          </Layout>
        ) : (
          <CaseSet ctx={ctx} band={cases} />
        );
      return closing.length > 0 ? (
        <ContentSection
          {...head(band)}
          data-band="M"
          lead={caseLead}
          actionsAt="end"
          actions={<LinkActions links={closing} />}
        >
          {set}
        </ContentSection>
      ) : (
        <ContentSection {...head(band)} data-band="M" lead={caseLead}>
          {set}
        </ContentSection>
      );
    }

    /* How we work together / Ways to work with us — the head (heading, its own link as end action,
       lead), the three options (primary, plated flat drawings), the two terms (one plain text row at body size under the set, on its grid). Its ask ("Tell us what you're working on") is its own band after it, an ink
       island with the texture and one solid to the contact route (owner, 30 Oct 2026, round 5: "the 2
       buttons split up and down is horrible design… an island section with that title and a button to
       the contact page"). */
    case 'tiles': {
      const opening = leadingParagraphs(band);
      const closing = closingNote(band);
      const trailing = [...closing.rest, ...trailingParagraphs(band)];
      /* Links by role, never by position (owner, 3 Nov 2026): the page link ("See how we work") is
         the head's action, the ask ("Book a call", to the form) its own island after the band. */
      const ask = askLinkIn(band);
      const links = bandLinks(band).filter((link) => !isAskLink(link));
      /* The v2.1 copy (4 Nov 2026) closes the set on a plain line before its links ("Not sure which
         suits you? Tell us about the product, and we'll suggest one."): with an ask, that line is the
         compact island's words, and both links its actions, the ask first. A term is labelled
         ("*Working hours:* …"), so an unlabelled last line beside an ask is the ask's. */
      const lastLine = trailing.at(-1);
      const askWords =
        ask && lastLine && !factOf(lastLine) && trailing.some((runs) => factOf(runs))
          ? splitAsk(inlineToText(lastLine))
          : undefined;
      const terms = (askWords ? trailing.slice(0, -1) : trailing).map((runs) => {
        const fact = factOf(runs);
        return fact ? { label: fact.label, body: fact.body } : { body: renderInline(runs) };
      });
      const options =
        leads(band).length > 0
          ? leads(band).map((row) => {
              const eyebrow = eyebrowFor(band, row.title);
              return {
                ...(eyebrow ? { eyebrow } : {}),
                title: row.title,
                body: renderInline(row.body),
                scope: scopeOf(row.title),
              };
            })
          : listOptions(band).length > 0
            ? listOptions(band)
            : itemOptions(band);
      /* Options told in several paragraphs each (how it works, where it starts) are sections, not
         cards: one row per option (owner, 1 Nov 2026, /how-we-work: "3 sections and not 1 with 3
         columns"). */
      /* Sections, not cards: options that name their kind in an eyebrow and are each told in
         several paragraphs. One long card in a set of short ones stays a card. */
      const rich = options.every(
        (option) =>
          'eyebrow' in option &&
          Boolean(option.eyebrow) &&
          (('more' in option && Array.isArray(option.more) && option.more.length > 0) ||
            ('facts' in option && Array.isArray(option.facts) && option.facts.length > 0)),
      );
      /* Options that each name their kind in a label line and are told in one sentence are cards
         (owner, 4 Nov 2026, homepage pass: "cards that look like cards"); no drawing. */
      /* And the repeated "Three ways to work with us" band, wherever it appears (owner, 4 Nov 2026:
         the homepage's cards carry across), with or without the label lines. */
      const carded =
        !rich &&
        options.length > 0 &&
        /* /how-we-work's own "Three ways to work with us" is the same three options
           (decisions/2026-11-04-three-ways-cards). */
        (band.id === 'how-we-work-together' ||
          band.id === 'engagement-shapes' ||
          options.every((option) => 'eyebrow' in option && Boolean(option.eyebrow)));
      const compactAsk =
        askWords && ask ? (
          <CtaSection
            id={`${band.id}-ask`}
            data-band="onward"
            arrangement="open"
            density="compact"
            inBand
            heading={askWords.heading}
            body={askWords.lead ? [askWords.lead] : undefined}
            actions={
              links[0]
                ? [
                    { label: ask.labelText, href: ask.href },
                    { label: links[0].labelText.replace(/\s*→\s*$/, ''), href: links[0].href },
                  ]
                : [{ label: ask.labelText, href: ask.href }]
            }
          />
        ) : undefined;
      return (
        <Fragment>
          {/* A rich set compares (owner, 1 Nov 2026, /how-we-work: picked over the rows, which stand in
              below 1024). */}
          <EngagementOptions
            {...head(band)}
            surface={unit.surface}
            lead={opening.length > 0 ? opening.map((runs) => renderInline(runs)) : undefined}
            options={
              carded
                ? /* A card's name drops the run-in's closing full stop: its punctuation, not the name. */
                  options.map((option) => {
                    const title = option.title.replace(/\.$/, '');
                    /* "A pilot project, at a fixed price": the option is named before its terms. */
                    const glyph =
                      OPTION_GLYPHS[title] ?? OPTION_GLYPHS[title.split(',')[0]?.trim() ?? ''];
                    return {
                      ...option,
                      scope: undefined,
                      title,
                      ...(glyph ? { icon: <Icon name={glyph} size="xl" /> } : {}),
                    };
                  })
                : options
            }
            arrangement={rich ? 'compare' : carded ? 'cards' : 'grid'}
            terms={terms}
            note={compactAsk}
            closing={
              closing.note
                ? {
                    heading: closing.note.heading,
                    lead: closing.note.body[0],
                    proof: closing.note.example ? (
                      <CaseTeaser
                        ctx={ctx}
                        example={closing.note.example}
                        words={closing.note.body[1]}
                      />
                    ) : undefined,
                  }
                : undefined
            }
            action={
              !compactAsk && links.length > 0 ? (
                <LinkActions links={links.slice(0, 1)} />
              ) : undefined
            }
          />
          {ask && !compactAsk ? <AskIsland link={ask} /> : null}
        </Fragment>
      );
    }

    /* M13 — destinations with a description: an icon router, the head above, no photograph. */
    case 'router':
      return <Router band={band} ctx={ctx} />;

    /* E — a path, drawn on the line rather than bulleted. */
    case 'thread': {
      const list = blocksOf(band, 'list')[0];
      const lead = band.blocks.find((b) => b.type === 'paragraph');
      const leadRuns = lead?.type === 'paragraph' ? lead.runs : [];
      const closing = trailingAfterList(band);
      const trace = list ? traceOf(list.items) : undefined;
      const leadText = hasLink(leadRuns) ? undefined : plain(leadRuns);
      const leadLinked = hasLink(leadRuns) ? (
        <ContentSectionText>
          <p>{renderInline(leadRuns)}</p>
        </ContentSectionText>
      ) : null;
      const after = closing.map((runs, index) => (
        <ContentSectionText key={index}>
          <p>{renderInline(runs)}</p>
        </ContentSectionText>
      ));
      /* A trace — one screen followed through every hand-over — runs DOWN beside the head: one row
         per stage, the screen drawn at that stage beside what we look at there, the trace running
         down through it (TracePlates `down`; owner, 11 Oct 2026). */
      if (trace) {
        /* The closing stance sits in the head track under the lead, so the five rows fit a fold. */
        const plates = leadLinked ? (
          <Layout rowGap="stack">
            {leadLinked}
            <TracePlates orientation="down" stages={trace} />
          </Layout>
        ) : (
          <TracePlates orientation="down" stages={trace} />
        );
        return after.length > 0 ? (
          <ContentSection
            {...head(band)}
            data-band="E"
            arrangement="beside"
            lead={leadText}
            aside={<Layout rowGap="text">{after}</Layout>}
          >
            {plates}
          </ContentSection>
        ) : (
          <ContentSection {...head(band)} data-band="E" arrangement="beside" lead={leadText}>
            {plates}
          </ContentSection>
        );
      }
      return (
        <ContentSection {...head(band)} data-band="E" align="center" lead={leadText}>
          {leadLinked}
          {list ? <Thread align="center" stages={stagesOf(list.items)} /> : null}
          {after}
        </ContentSection>
      );
    }

    /* M15 — a comparison: a key column against rows, boxed. A table naming the page's free tools
       links each to its tool and reads down on a phone (withToolKeyLinks). */
    case 'table': {
      const toolTable = withToolKeyLinks(page, band);
      if (toolTable) return <TableBand band={toolTable} narrow="read-down" />;
      return ctx.scenes?.items[band.id] &&
        !sceneFor(ctx, band, 'agree') &&
        blocksOf(band, 'table').length > 0 ? (
        <DrawnTableBand
          page={page}
          band={band}
          sceneOf={(key) => sceneFor(ctx, band, key)}
          scenario={sceneFor(ctx, band, 'scenario')}
          arrangement={LEDGER_BANDS.has(band.id) ? 'ledger' : 'grid'}
        />
      ) : (
        <TableBand
          band={band}
          scenario={sceneFor(ctx, band, 'scenario')}
          agreement={sceneFor(ctx, band, 'agree')}
        />
      );
    }

    /* What you receive: a list of deliverables, with the product shot beside it. */
    /* What you receive — the deliverables as ONE offer (OfferSheet, as "What you get" on the service
       page; owner, 11 Oct 2026): two rows of two promises, each on its rule and blue mark, the
       product shot filling the trailing 1 beside them, and the next step closing their column. */
    case 'deliverables': {
      const list = blocksOf(band, 'list')[0];
      const rows: Lead[] = (list?.items ?? []).flatMap((item) => {
        const split = leadOf({ type: 'paragraph', runs: item });
        return split ? [{ title: labelTitle(split.label), body: split.body }] : [];
      });
      /* Everything after the list as authored, tables and a worked example included: until 31 Oct only
         its paragraphs rendered, and the design-to-code audit lost both its tables (kinds:check). */
      const rest = band.blocks.filter((block) => block.type !== 'comment');
      const after = rest.slice(lastIndexWhere(rest, (block) => block.type === 'list') + 1);
      return (
        <OfferSheet
          {...head(band)}
          lead={leadText(band)}
          items={rows.map((row) => ({
            title: row.title,
            ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
              ? { bodyHtml: inlineToHtml(row.body) }
              : { body: plain(row.body) }),
          }))}
          {...(hasSlot(page, band.id) ? { asideImage: slotImage(page, band.id) } : {})}
          note={
            after.length > 0 ? (
              <BandBody blocks={after} labelledBy={head(band).headingId} />
            ) : undefined
          }
        />
      );
    }

    /* M11 — two reasons: a media split, or (a third in a row) a read-down beside the photograph. */
    case 'reasons': {
      /* The repeated Why Tcules band takes the homepage's list (owner, 4 Nov 2026). */
      if (band.id === 'why-tcules') {
        return (
          <WhyTculesBand band={band} surface={unit.surface === 'tint' ? 'tint' : 'paper'} />
        );
      }
      /* The 26 Oct copy's Why Tcules: a lead, three reasons (bold-led bullets, or `###` items), the
         closing links. One isometric illustration per reason, band scale (`figureSize="lg"`), never
         a case cover or a figure panel (decisions/2026-10-30-reasons-take-illustrations): the case
         links stay in the sentence. A reason not drawn yet takes the labelled illustration slot
         (decisions/2026-10-30-undrawn-illustration-slot), so a band never mixes two scales. Head
         above, drawing above (decisions/2026-10-29-set-reasons-head-above-drawing-above), and
         isometric, so it never reads as How we work together's flat options beside it. */
      if (blocksOf(band, 'list').length > 0 || band.blocks.some((b) => b.type === 'item')) {
        const parts = sheetParts(band);
        /* The closing link row ("Why teams choose Tcules") follows the last `###` reason, so the
           parser files it under that reason: read it from what follows the items, which holds the
           band's own link rows too. */
        const links = parts.after.flatMap((block) =>
          block.type === 'links' ? block.links : [],
        );
        const action = links.length > 0 ? <LinkActions links={links} pair /> : undefined;
        const ground = unit.surface === 'tint' ? 'paper-deep' : 'paper';
        const titled = parts.items.filter((item) => item.title);
        /* A `###` reason's "Example:" paragraph is its example, set apart in the ClaimProof panel the
           hard parts use, its words out of the argument's body (owner, 2 Nov 2026: claims and examples
           are one pattern; decisions/2026-11-02-examples-are-one-pattern). */
        const authored = new Map(
          band.blocks.flatMap((block) =>
            block.type === 'item' ? [[block.headingText, block.blocks] as const] : [],
          ),
        );
        const split = (title: string) => {
          const blocks = authored.get(title);
          const example = blocks?.find(isExampleParagraph);
          if (!blocks || !example) return null;
          const bodyHtml = blocks
            .filter((block) => block.type === 'paragraph' && block !== example)
            .map((block) => (block.type === 'paragraph' ? inlineToHtml(block.runs) : ''))
            .join(' ');
          return { bodyHtml, example: claimExample(example.runs) };
        };
        /* A reason carried by a client's words (the 3 Nov copy): the quote supports the claim under it. */
        const quoteOf = (title: string) =>
          authored.get(title)?.find(
            (block): block is Extract<CorpusBlock, { type: 'quote' }> => block.type === 'quote',
          );
        if ([3, 4, 5, 6].includes(parts.items.length) && titled.length === parts.items.length) {
          return (
            <Reasons
              {...head(band)}
              surface={unit.surface === 'tint' ? 'tint' : 'paper'}
              figureSize="lg"
              lead={parts.lead}
              action={action}
              items={titled.map((item) => {
                const drawn = ctx.reasonFigure?.(item.title!, ground);
                const parted = split(item.title!);
                const bodyHtml = parted ? parted.bodyHtml : item.bodyHtml;
                return {
                  title: item.title!,
                  body: bodyHtml ? (
                    <span dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                  ) : (
                    (item.body ?? '')
                  ),
                  ...(parted
                    ? { example: <ClaimProof example={parted.example} /> }
                    : quoteOf(item.title!)
                      ? { example: <SupportQuote block={quoteOf(item.title!)!} /> }
                      : {}),
                  figure: drawn
                    ? { ...drawn, alt: '', kind: 'illustration' as const }
                    : { ...placeholderIllustration(item.title!), alt: '' },
                };
              })}
            />
          );
        }
        return (
          <OfferSheet
            {...head(band)}
            lead={parts.lead}
            items={parts.items}
            across={parts.items.length === 4 ? 2 : 3}
            note={action}
          />
        );
      }
      const rows = leads(band);
      /* D — the "why" band as a run of beside banners, one reason each, alternating sides (as
         home's "Why teams choose Tcules", owner 11 Oct 2026): the reason leads at the banner's
         heading, its sentence under it, a photograph beside. The first reason takes the studio
         photograph the page binds; each other reason its own slot. */
      if (unit.variant === 'D') {
        const studio = ctx.shared['about_studio_review'];
        /* D — the "why" band as one section of image cards, a reason each: a 16:9 photograph, the
           reason as the card's title, its sentence under it. The first reason takes the studio
           photograph the page binds; each other reason its own slot. Home's one-banner-per-reason
           run is for reasons that fill a fold (a claim, a paragraph and a client's words); a
           sentence each, as here, left every banner a short caption floating beside a large photo
           (owner, 12 Oct 2026, healthtech: "idk what but this looks bad"). */
        const cards: BlockCardSetItem[] = rows.flatMap((row, index) => {
          const slug = slugOf(row.title);
          const image: SlotImage | undefined = hasSlot(page, band.id, slug)
            ? { ...slotImage(page, band.id, slug), kind: 'photograph' as const }
            : index === 0
              ? studio
                ? corpusImage(studio)
                : hasSlot(page, band.id)
                  ? { ...slotImage(page, band.id), kind: 'photograph' as const }
                  : undefined
              : undefined;
          return [
            {
              id: slug,
              title: row.title,
              ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
                ? { bodyHtml: [inlineToHtml(row.body)] }
                : { body: plain(row.body) }),
              ...(image ? { media: { type: 'image' as const, image } } : {}),
            },
          ];
        });
        return (
          <ContentSection {...head(band)} data-band="C-cards">
            <BlockCardSet
              items={cards}
              lead="none"
              across={cards.length >= 3 ? 3 : 2}
              size="lg"
              scroll="never"
            />
          </ContentSection>
        );
      }
      return (
        <ContentSection
          {...head(band)}
          data-band="B"
          arrangement="media"
          media={{
            image: slotImage(page, band.id),
            side: unit.side ?? 'start',
            weight: 'photo',
            head: 'lg',
          }}
        >
          {tiles(rows)}
        </ContentSection>
      );
    }

    /* People who each have a question, in their own words (VoiceLedger, as the service page's
       "Where we start"; owner, 11 Oct 2026: the icon-card grid was "too dense and doesn't make
       sense"). Each question is the row's large thing — what a visitor recognises — and the person
       asking stands beside it; the closing line sits under the rows, in the same band (it was a
       Statement band of its own, part b, which read as a second section). */
    case 'personas': {
      if (unit.part === 'b') return null;
      const table = blocksOf(band, 'table')[0];
      const closing = trailingAfterTable(band);
      /* The people table is the ledger; the hard parts that follow it are claim rows under it, as on
         every other hard-parts band. Until 31 Oct only the table rendered, and HealthTech's four claims
         never reached the page (found by kinds:check). */
      const { claims, stories } = claimsOf(band);
      const rows = (
        <ClaimRows
          claims={claims}
          stories={stories}
          claimFigure={ctx.claimFigure}
          ground={unit.surface === 'tint' ? 'paper-deep' : 'paper'}
          labelledBy={head(band).headingId}
        />
      );
      return (
        <VoiceLedger
          {...head(band)}
          lead={leadText(band)}
          items={(table?.rows ?? []).map((row) => ({
            voice: plain(row[1] ?? []),
            reply: plain(row[0] ?? []),
          }))}
          note={
            <Layout rowGap="stack">
              {closing.length > 0 ? (
                <ContentSectionText>
                  {closing.map((runs, index) => (
                    <p key={index}>{renderInline(runs)}</p>
                  ))}
                </ContentSectionText>
              ) : null}
              {rows}
            </Layout>
          }
        />
      );
    }

    /* Principles: ONE set (OfferSheet, as "What you get"; owner, 11 Oct 2026: two beside a
       photograph and three more in a band under it read as "2 sections or one?"). The principles three
       across (3 + 2 for five) on their rules and blue marks, in the full column: with the photograph
       beside them five ran two up to a lonely fifth and past the fold, so the band takes no photo. */
    case 'principles': {
      if (unit.part === 'b') return null;
      const rows = leads(band);
      return (
        <OfferSheet
          {...head(band)}
          items={rows.map((row) => ({
            title: row.title,
            ...(hasLink(row.body) || row.body.some((run) => run.type !== 'text')
              ? { bodyHtml: inlineToHtml(row.body) }
              : { body: plain(row.body) }),
          }))}
          across={rows.length % 3 === 0 || rows.length === 5 ? 3 : 2}
        />
      );
    }

    /* Two cases told in turn: the work, each beside its artefact. A story its client spoke about is
       set as a case card with the client's rated quote BESIDE it (TestimonialBeside), so the quote
       sits with its own story and never inside it (home round 2, 10 Oct 2026; round 1 had moved
       every story quote to a tint band after the last story, away from the story it was about). */
    case 'caseStories': {
      const items = band.blocks.filter(
        (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
      );
      const item = items[unit.itemIndex ?? 0];
      if (!item) return null;
      const qualifier = slugOf(item.headingText.split(':')[0] ?? item.headingText);
      /* The story's client links to its case (owner, 11 Oct 2026), found by the name before the
         colon; a client whose case is unpublished gets a flagged PLACEHOLDER link (P43). */
      const caseLink = caseStudyLink(item.headingText.split(':')[0] ?? '');
      const image = hasSlot(page, band.id, qualifier)
        ? slotImage(page, band.id, qualifier)
        : undefined;
      const first = unit.part === 'a';
      const headProps = first ? head(band) : { id: unit.id };
      const quote = item.blocks.find(
        (b): b is Extract<CorpusBlock, { type: 'quote' }> => b.type === 'quote',
      );
      if (quote) {
        const paragraphs = item.blocks.flatMap((b) =>
          b.type === 'paragraph' ? [inlineToHtml(b.runs)] : [],
        );
        return (
          <ContentSection {...headProps} data-band="M">
            <TestimonialBeside
              work={
                <ul>
                  <BlockCard
                    title={item.headingText}
                    bodyHtml={paragraphs}
                    size="lg"
                    {...(image ? { media: { type: 'image' as const, image } } : {})}
                    {...(caseLink ? { href: caseLink.href, cue: 'title' as const } : {})}
                  />
                </ul>
              }
              item={testimonialItem(quote, ctx.ratings)}
            />
          </ContentSection>
        );
      }
      /* A story with no client quote is still a case (owner, 11 Oct 2026: "that's probably going
         to be a case study so treat it as such"): one horizontal case card, its cover beside its
         words, linked to the case (a flagged placeholder until it publishes, P43). */
      const paragraphs = item.blocks.flatMap((b) =>
        b.type === 'paragraph' ? [inlineToHtml(b.runs)] : [],
      );
      return (
        <ContentSection {...headProps} data-band="M">
          <ul>
            <BlockCard
              title={item.headingText}
              bodyHtml={paragraphs}
              size="lg"
              orientation="horizontal"
              {...(image ? { media: { type: 'image' as const, image } } : {})}
              {...(caseLink ? { href: caseLink.href, cue: 'title' as const } : {})}
            />
          </ul>
        </ContentSection>
      );
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `OfferPage ${page.route}: band "${band.id}" has a shape the plan has not met; rendering it plainly.`,
        );
      }
      return (
        <ContentSection {...head(band)} data-band="C-text">
          <GenericBlocks band={band} />
        </ContentSection>
      );
  }
}

/* ── Pieces ───────────────────────────────────────────────────────────────────── */

/** The blocks after a band's list (a closing paragraph), as runs. */
function trailingAfterList(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const at = lastIndexWhere(blocks, (block) => block.type === 'list');
  return blocks
    .slice(at + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

function trailingAfterTable(band: CorpusBand): InlineRun[][] {
  const blocks = band.blocks.filter((block) => block.type !== 'comment');
  const at = lastIndexWhere(blocks, (block) => block.type === 'table');
  return blocks
    .slice(at + 1)
    .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

type Sentence = { runs: InlineRun[]; text: string };
function sentencesOf(runs: readonly InlineRun[]): Sentence[] {
  const out: Sentence[] = [];
  let cur: InlineRun[] = [];
  const flush = () => {
    const text = plain(cur).trim();
    if (text) out.push({ runs: trimEnd(trimStart(cur)), text });
    cur = [];
  };
  for (const run of runs) {
    if (run.type !== 'text') {
      cur.push(run);
      continue;
    }
    const parts = run.text.split(/(?<=[.?!])\s+/);
    parts.forEach((part, i) => {
      if (part) cur.push({ type: 'text', text: part });
      if (i < parts.length - 1) flush();
    });
  }
  flush();
  return out;
}

/** A closing paragraph authored as questions each answered by where to go (the CTA card's routes): undefined when it is not. */
function routesOf(
  paragraphs: readonly InlineRun[][],
): { question?: string; answer: InlineRun[] }[] | undefined {
  const routes: { question: string; answer: InlineRun[] }[] = [];
  for (const s of paragraphs.flatMap(sentencesOf)) {
    if (s.text.endsWith('?')) routes.push({ question: s.text, answer: [] });
    else {
      const r = routes.at(-1);
      if (!r) return undefined;
      if (r.answer.length) r.answer.push({ type: 'text', text: ' ' });
      r.answer.push(...s.runs);
    }
  }
  return routes.length > 0 && routes.every((r) => r.answer.length > 0 && hasLink(r.answer))
    ? routes
    : undefined;
}

/** A router row's words: the second column, and a third ("Best for") as a sentence after it. */
function routerBody(
  table: Extract<CorpusBlock, { type: 'table' }>,
  row: InlineRun[][],
): string {
  return plain(row[1] ?? []).replace(/\.$/, '');
}

/**
 * A three-column router table's third column, kept as the tile's labelled detail under its header
 * (owner, 2 Nov 2026, /services): a table that becomes tiles drops no column, and the column's own
 * name labels it rather than being run on into the body sentence.
 */
function routerDetail(
  table: Extract<CorpusBlock, { type: 'table' }>,
  row: InlineRun[][],
): { label: string; text: string } | undefined {
  const text = plain(row[2] ?? []).trim();
  return table.header.length >= 3 && text
    ? { label: plain(table.header[2] ?? []).trim(), text }
    : undefined;
}

/**
 * 3 or 4 tracks for `cells` (the tiles plus one CTA card per question) so they fill whole rows; where
 * neither does, the count whose last row is fuller, the last card taking what that row leaves
 * (owner, 30 Oct 2026: one dotted card per question).
 */
function ctaTracks(cells: number): 3 | 4 {
  if (cells % 3 === 0) return 3;
  if (cells % 4 === 0) return 4;
  return cells % 3 > cells % 4 ? 3 : 4;
}

/** M13 — a router: one icon card per destination, title the link's own words, body what follows the colon. */
/**
 * An expertise page's "What we design" (owner, 2 Nov 2026: drawn tiles, as the services hub): each kind
 * of product a Bento tile — its drawing (the labelled plate until it is drawn), the kind as authored,
 * and what follows the ` · ` (the client, or the promise) as the body. Where the copy links the client
 * to a case study, the whole tile is that link; a kind with no case is a still tile. Words unchanged.
 */
function CatalogBand({ band, ctx }: { band: CorpusBand; ctx: OfferContext }) {
  const parts = sheetParts(band);
  const list = blocksOf(band, 'list')[0];
  const items = parts.items.map((item, index) => {
    const runs = list?.items[index] ?? [];
    const link = linksIn(runs)[0];
    const title = item.title ?? item.body ?? item.id ?? '';
    const note = plain(runs).split(' · ').slice(1).join(' · ').trim();
    const scene = sceneFor(ctx, band, title);
    return {
      id: title,
      title,
      ...(note ? { body: note.charAt(0).toUpperCase() + note.slice(1) } : {}),
      ...(link ? { href: link.href } : {}),
      ...(scene ? { scene } : {}),
    };
  });
  const rest = [...parts.intro, ...parts.after];
  return (
    <ContentSection
      {...head(band)}
      data-band="catalog-tiles"
      lead={parts.lead}
      footer={
        rest.length > 0 ? (
          <BandBody blocks={rest} labelledBy={head(band).headingId} />
        ) : undefined
      }
    >
      <Bento tracks={items.length === 4 || items.length >= 7 ? 4 : 3} items={items} />
    </ContentSection>
  );
}

const tileAction = tileActionFor;

function Router({ band, ctx }: { band: CorpusBand; ctx: OfferContext }) {
  /* Destinations come as link-led lines ("[UX Research](/…): find out…"), as a table whose key
     column links each service and whose second column says who it is for (component-map C8), or as
     a link row of names alone. */
  const table = blocksOf(band, 'table')[0];
  /* A table of options to choose between (an audit's "Option | What it gives | Best for", owner,
     2 Nov 2026: "the new pattern we made for services hub"): every row is a tile, the ones with no
     link too — the page's own option and those outside the studio are still tiles, never dropped. */
  const optionTable =
    table !== undefined && /^(option|options)$/i.test(plain(table.header[0] ?? []).trim());
  const rows: {
    href?: string;
    title: string;
    body: string;
    detail?: { label: string; text: string };
  }[] = table
    ? table.rows.flatMap((row) => {
        const link =
          row[0]?.find((run) => run.type === 'link') ??
          row[0]?.flatMap((run) =>
            'children' in run ? run.children.filter((c) => c.type === 'link') : [],
          )[0];
        const detail = routerDetail(table, row);
        if (link && link.type === 'link') {
          return [
            {
              href: link.href,
              title: plain(link.children),
              body: routerBody(table, row),
              ...(detail ? { detail } : {}),
            },
          ];
        }
        return optionTable
          ? [
              {
                title: plain(row[0] ?? []).trim(),
                body: routerBody(table, row),
                ...(detail ? { detail } : {}),
              },
            ]
          : [];
      })
    : band.blocks.flatMap((block) => {
        if (block.type === 'links')
          return block.links.map((link) => ({
            href: link.href,
            title: link.labelText,
            body: '',
          }));
        /* A bulleted list of link-led lines (/matter-design-system's services) reads as the same lines. */
        const lines =
          block.type === 'list'
            ? block.items.map((runs) => ({ type: 'paragraph' as const, runs }))
            : [block];
        return lines.flatMap((line) => {
          const lead = linkLead(line);
          return lead
            ? [
                {
                  href: lead.link.href,
                  title: plain(lead.link.children),
                  body: plain(lead.body),
                },
              ]
            : [];
        });
      });
  /* The paragraphs after a table are the band's closing words; before it, its lead. */
  const tableAt = band.blocks.findIndex((block) => block.type === 'table');
  const closing =
    tableAt >= 0
      ? band.blocks
          .slice(tableAt + 1)
          .flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []))
      : [];
  const sentence = (body: string) => body.charAt(0).toUpperCase() + body.slice(1);
  /* Where a set has no tile to carry the detail as its own field, it runs on into the body, so no
     path drops the table's third column. */
  const runOn = (row: (typeof rows)[number]) =>
    row.detail ? `${row.body}. ${row.detail.label}: ${row.detail.text}` : row.body;
  const mixedClosing =
    closing.some(hasLink) && !closing.every(hasLink) && routesOf(closing) === undefined;
  const lead = leadText(band);
  const routerLead = lead;
  const closingFooter =
    closing.length > 0 ? (
      <ContentSectionText>
        <Layout rowGap="text">
          {closing.map((runs, index) => (
            <p key={index}>{renderInline(runs)}</p>
          ))}
        </Layout>
      </ContentSectionText>
    ) : undefined;
  const wrap = (set: ReactNode, footer?: ReactNode) => (
    <ContentSection {...head(band)} data-band="C-icon" lead={routerLead} footer={footer}>
      {set}
    </ContentSection>
  );
  /* Destinations the page draws (owner, 26 Oct 2026, the specialist services): home's bento, every
     tile one size, because the destinations are peers. Seven or eight take four tracks, 4 + 3 with
     the band's closing words in the eighth cell (owner, 29 Oct 2026, Q7); others three. Services
     named as a set are always the service tile, each with its own scene, wherever they are named
     (owner, 29 Oct 2026; decisions/2026-10-29-named-services-are-service-tiles). */
  const scenes = rows.map((row) =>
    row.href
      ? (sceneFor(ctx, band, row.href) ?? serviceSceneFor(row.href))
      : (sceneFor(ctx, band, row.title) ??
        /* the page's own option takes the page's own drawing */
        (ctx.page.name.toLowerCase() === row.title.toLowerCase()
          ? serviceSceneFor(ctx.page.route)
          : undefined)),
  );
  /* An option table always takes the tiles, from two rows (one full row of two split tiles; owner,
     2 Nov 2026: "the new pattern we made for services hub", on every audit page, 4 Nov 2026): a
     missing drawing is the labelled empty plate. */
  if (
    (rows.length >= 3 || (optionTable && rows.length >= 2)) &&
    (optionTable || scenes.every(Boolean))
  ) {
    /* The closing router is the set's CTA card (owner, 30 Oct 2026; decisions/2026-10-30-set-ends-in-a-cta-card)
       on every service page that closes its set with a way onward: questions each answered by links, or
       one linked statement kept whole (its words unchanged, no question). The words go in verbatim and
       every link becomes an arrow link in a dotted card, one card per question (owner, 30 Oct 2026). A closing with no link stays below the set. */
    const routes =
      routesOf(closing) ??
      (closing.length > 0 && closing.every(hasLink)
        ? [
            {
              answer: closing.flatMap((runs, index) =>
                index > 0 ? [{ type: 'text', text: ' ' } as InlineRun, ...runs] : runs,
              ),
            },
          ]
        : undefined);
    /* Mixed closing words (owner, 2 Nov 2026, /services): notes on single destinations and a sentence
       about the set, in their authored order, run on as ONE paragraph at the body measure, links
       inline. Never a card per note (it repeated the names as links and outshouted the set), never
       three loose lines (the last read as stray). */
    const coda =
      !routes && mixedClosing ? (
        <ContentSectionText>
          <p>
            {renderInline(
              closing.flatMap((runs, index) =>
                index > 0 ? [{ type: 'text', text: ' ' } as InlineRun, ...runs] : runs,
              ),
            )}
          </p>
        </ContentSectionText>
      ) : undefined;
    const n = rows.length;
    const cta: BentoCta | undefined = routes
      ? {
          routes: routes.map((r) => ({
            ...(r.question ? { question: r.question, answer: plain(r.answer).trim() } : {}),
            ...(!r.question ? { answer: plain(r.answer).trim() } : {}),
            actions: linksIn(r.answer).map((link) => ({
              label: plain(link.children),
              href: link.href,
            })),
          })),
        }
      : undefined;
    return wrap(
      <Bento
        tracks={
          /* Split tiles (a detail each) take two tracks, so four tracks set them two a row. */
          rows.some((row) => row.detail)
            ? 4
            : cta
              ? /* A lone card is two cells wide (decisions/2026-10-30-set-ends-in-a-cta-card): counted
                 as one, seven tiles chose four tracks and squeezed it into the eighth cell. */
                ctaTracks(n + cta.routes.length + (cta.routes.length === 1 ? 1 : 0))
              : n === 7 || n === 8 || n === 4
                ? 4
                : 3
        }
        cta={cta}
        items={rows.map((row, index) => ({
          id: row.href ?? row.title,
          title: row.title,
          ...(row.body ? { body: sentence(row.body) } : {}),
          /* The split tile's action: the service tile's one wording (ServiceTile `action`), named
             for what the link opens. */
          ...(row.detail ? { detail: { ...row.detail, action: tileAction(row.href) } } : {}),
          ...(row.href ? { href: row.href } : {}),
          ...(scenes[index] ? { scene: scenes[index] as SketchName } : {}),
        }))}
      />,
      routes ? undefined : (coda ?? closingFooter),
    );
  }
  const linked = rows.filter((row): row is (typeof rows)[number] & { href: string } =>
    Boolean(row.href),
  );
  const glyphs = linked.map((row) => glyphForRoute(row.href));
  const items: BlockCardSetItem[] = linked.map((row, index) => ({
    id: row.href,
    title: row.title,
    ...(runOn(row) ? { body: sentence(runOn(row)) } : {}),
    href: row.href,
    icon: glyphs.every(Boolean) ? glyphs[index] : undefined,
  }));
  if (glyphs.every(Boolean)) {
    /* No `frame`: a boxed card set is retired (2026-10-19-no-hover-only-grounds). */
    return wrap(
      <BlockCardSet
        items={items}
        lead="none"
        across={linked.length % 4 === 0 ? 4 : 3}
        cue="title"
        scroll="never"
      />,
      closingFooter,
    );
  }
  return wrap(
    <Layout as="ul" rowGap="none">
      {linked.map((row) => (
        <ListCard
          key={row.href}
          titleAs="h3"
          title={row.title}
          body={runOn(row)}
          href={row.href}
        />
      ))}
    </Layout>,
    closingFooter,
  );
}

type CaseGroup = {
  title: string;
  paragraphs: InlineRun[][];
  link?: Extract<InlineRun, { type: 'link' }>;
};

/** Labelled claims as cases: a claim starts one, the paragraphs after it belong to it. */
function caseGroups(band: CorpusBand): CaseGroup[] {
  const groups: CaseGroup[] = [];
  /* `###` cases (the 26 Oct copy, component-map C3): the heading is the case's title as authored, its
     paragraphs the body, its first link line ("Read the Dealpath case") the card's link. */
  const items = band.blocks.filter(
    (b): b is Extract<CorpusBlock, { type: 'item' }> => b.type === 'item',
  );
  if (items.length > 0) {
    return items.map((item) => {
      const link = item.blocks.flatMap((b) => (b.type === 'links' ? b.links : []))[0];
      const paragraphs = item.blocks.flatMap((b) => (b.type === 'paragraph' ? [b.runs] : []));
      const lifted = link ? undefined : paragraphs.at(-1);
      const trailing = lifted ? liftTrailingLink(lifted) : undefined;
      if (trailing?.link) paragraphs[paragraphs.length - 1] = trailing.runs;
      return {
        title: item.headingText,
        paragraphs,
        link: link
          ? { type: 'link' as const, href: link.href, children: link.label }
          : trailing?.link,
      };
    });
  }
  for (const block of band.blocks) {
    const lead = leadOf(block);
    if (lead) {
      groups.push({ title: labelTitle(lead.label), paragraphs: [[...lead.body]] });
    } else if (block.type === 'paragraph') {
      groups.at(-1)?.paragraphs.push(block.runs);
    }
  }
  for (const group of groups) {
    const last = group.paragraphs.at(-1);
    if (!last) continue;
    const lifted = liftTrailingLink(last);
    if (lifted.link) {
      group.link = lifted.link;
      group.paragraphs[group.paragraphs.length - 1] = lifted.runs;
    }
  }
  return groups;
}

/** The case group a quote is about: the one whose name its company carries ("Auxentios" in
 *  "Auxentios Technology"), else the last, after which the content authors a case set's quote. */
function quotedGroup(groups: readonly CaseGroup[], company: string): number {
  const name = (title: string) => title.replace(/[.:]$/, '').trim().toLowerCase();
  const wanted = company.toLowerCase();
  const found = groups.findIndex(
    (group) => wanted.includes(name(group.title)) || name(group.title).includes(wanted),
  );
  return found >= 0 ? found : groups.length - 1;
}

/**
 * M8 — case cards: each case with its cover, its name as authored and the words after it. Linked only
 * where a link is authored (the trailing "Read the case" becomes the card's cta, so no card holds a
 * link in its body).
 *
 * Cases are peers, so no card is featured, and none holds the client's quote (22 Oct 2026): a quote
 * the set ends on follows it as a band of its own (`voice`, owner 26 Oct 2026), linking to the case
 * its client is from. Four or more linked cases run in the kit Slider; fewer sit as one grid.
 */
type ItemBlock = Extract<CorpusBlock, { type: 'item' }>;

/** An `###` item that is a claim carried by a client's words, with no case of its own to link. */
function isClaimItem(block: CorpusBlock): block is ItemBlock {
  return (
    block.type === 'item' &&
    block.blocks.some((b) => b.type === 'quote') &&
    !block.blocks.some((b) =>
      (b.type === 'links'
        ? b.links.map((l) => l.href)
        : b.type === 'paragraph'
          ? linksIn(b.runs).map((l) => l.href)
          : []
      ).some((href) => href.startsWith('/case-studies/')),
    )
  );
}

/** A claim leading a set: its title and sentence at the start, its client's words beside them (a split). */
function ClaimLead({ item }: { item: ItemBlock }) {
  const words = item.blocks.filter((b) => b.type !== 'quote');
  const quotes = item.blocks.filter((b) => b.type === 'quote');
  return (
    <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="block" align="center">
      <Layout rowGap="block">
        <h3>{item.headingText}</h3>
        <BandBody blocks={words} />
      </Layout>
      <ItemBody blocks={quotes} />
    </Layout>
  );
}

function CaseSet({ ctx, band }: { ctx: OfferContext; band: CorpusBand }) {
  const groups = caseGroups(band);
  /* Every case links to its case page (owner, 11 Oct 2026). An authored "Read the case" line keeps
     its words as the card's cta; a case named without one finds its page by its name (routes.ts
     CASE_STUDY_SLUGS, or a flagged PLACEHOLDER). Where a set mixes the two, the found cards take the
     band's own authored label when every authored label agrees, so no card invents a wording. */
  const authoredLabels = new Set(
    groups.flatMap((group) => (group.link ? [plain(group.link.children)] : [])),
  );
  const sharedLabel = authoredLabels.size === 1 ? [...authoredLabels][0] : undefined;
  const items: BlockCardSetItem[] = groups.map((group) => {
    const found = group.link ? undefined : caseStudyLink(group.title);
    const href = group.link?.href ?? found?.href;
    const ctaLabel = group.link ? plain(group.link.children) : sharedLabel;
    const ref = href ? ctx.caseRefs[href] : undefined;
    const paragraphs = group.paragraphs.filter((runs) => runs.length > 0);
    const body =
      paragraphs.length > 1 ||
      paragraphs.some((runs) => hasLink(runs) || runs.some((r) => r.type !== 'text'))
        ? { bodyHtml: paragraphs.map((runs) => inlineToHtml(runs)) }
        : { body: paragraphs[0] ? plain(paragraphs[0]) : undefined };
    return {
      id: group.title,
      title: group.title,
      ...body,
      media: { type: 'image' as const, image: coverFor(ctx.page, group.title, ref) },
      ...(href ? { href, ...(ctaLabel ? { ctaLabel } : {}) } : {}),
    };
  });
  const linked = items.every((item) => item.href);
  /* A set whose cards all carry a cta wording reads its cta; one whose links were all found by name
     has no authored wording, so its titles are the cue. */
  const labelled = items.every((item) => item.ctaLabel);
  const cue = linked ? (labelled ? 'cta' : 'title') : undefined;
  /* Four or more cases: the kit Slider, three in view and the next peeking inside the column (Slider
     `peek`, owner 26 Oct 2026: the bled row "just shows the overflow"; sliders are allowed off the homepage while every card is in the page
     as it loads, with real links and no autoplay). The client's words left the set for a band of their
     own (`voice`); a case card never holds a quote (22 Oct 2026). */
  if (items.length >= 4 && linked) {
    return (
      <Slider label={band.headingText} peek>
        {items.map((item) => (
          <BlockCard
            key={item.id}
            title={item.title}
            {...('bodyHtml' in item && item.bodyHtml
              ? { bodyHtml: item.bodyHtml }
              : { body: item.body })}
            media={item.media}
            href={item.href}
            ctaLabel={item.ctaLabel}
            cue={cue}
            tracks={3}
          />
        ))}
      </Slider>
    );
  }
  return (
    <BlockCardSet
      lead="none"
      scroll="never"
      cue={cue}
      {...(items.length === 3 ? { across: 3 as const, size: 'md' as const } : {})}
      label={linked ? undefined : band.headingText}
      items={items}
    />
  );
}

/**
 * A client's words as a band of their own (owner, 26 Oct 2026). Proof `featured` where the speaker has a
 * portrait (the unit's `side` says which side it takes), else Proof centred; the stars come from the
 * page's ratings and the marks from Proof. After a set of cases, the quote links to its client's case.
 */
function Voice({ unit, ctx }: { unit: OfferUnit; ctx: OfferContext }) {
  const block = quoteOf(unit.band);
  if (!block) return null;
  const id = block.testimonialId;
  const rating = block.rating?.value ?? (id ? ctx.ratings?.[id]?.value : undefined);
  const avatar = id ? ctx.avatars?.[id] : undefined;
  const quote = {
    ...proofQuote(block),
    ...(rating !== undefined ? { stars: rating } : {}),
    ...(avatar
      ? {
          portrait: {
            src: avatar.src,
            width: avatar.width,
            height: avatar.height,
            sources: avatar.sources,
          },
        }
      : {}),
  };
  const groups = kindOf(unit.band) === 'cases' ? caseGroups(unit.band) : [];
  const group = groups.length > 0 ? groups[quotedGroup(groups, quote.company)] : undefined;
  const found = group && !group.link ? caseStudyLink(group.title) : undefined;
  const href = group?.link?.href ?? found?.href;
  const name = group ? group.title.replace(/[.:]$/, '').trim() : undefined;
  const footer =
    href && name ? (
      <CtaRow rule={false} actions={[{ label: `Read the ${name} case`, href }]} />
    ) : undefined;
  return (
    <Section id={unit.id} surface={unit.surface} data-band="G">
      {avatar ? (
        <Proof
          arrangement="featured"
          quote={quote}
          reverse={unit.side === 'end'}
          footer={footer}
        />
      ) : (
        <Proof quote={quote} align="center" />
      )}
    </Section>
  );
}

/** CLOSE_CASES' band: the picked cases as the 3-column grid, the close's link centred under them. */
function CaseLinksBand({
  band,
  ctx,
  names,
}: {
  band: CorpusBand;
  ctx: OfferContext;
  names: readonly string[];
}) {
  const paragraphs = band.blocks.flatMap((block) =>
    block.type === 'paragraph' ? [block] : [],
  );
  const link = paragraphs
    .flatMap((block) => block.runs)
    .find((run): run is Extract<typeof run, { type: 'link' }> => run.type === 'link');
  const lead = paragraphs
    .map((block) =>
      plain(block.runs.filter((run) => run.type !== 'link'))
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((text) => text.length > 0)
    .join(' ');
  const items: BlockCardSetItem[] = names.flatMap((name) => {
    const found = caseStudyLink(name);
    if (!found) return [];
    const ref = ctx.caseRefs[found.href];
    return [
      {
        id: name,
        title: ref?.title ?? name,
        media: { type: 'image' as const, image: caseCover(name, ref) },
        href: found.href,
      },
    ];
  });
  const set = (
    <BlockCardSet lead="none" scroll="never" cue="title" across={3} size="md" items={items} />
  );
  const leadProp = lead ? { lead } : {};
  if (!link) {
    return (
      <ContentSection {...head(band)} data-band="M" {...leadProp}>
        {set}
      </ContentSection>
    );
  }
  return (
    <ContentSection
      {...head(band)}
      data-band="M"
      {...leadProp}
      actionsAt="end"
      actions={
        <CtaRow rule={false} actions={[{ label: plain(link.children), href: link.href }]} />
      }
    >
      {set}
    </ContentSection>
  );
}

function SentenceRowsBand({ band, titles }: { band: CorpusBand; titles: readonly string[] }) {
  const sentences = band.blocks.flatMap((block) =>
    block.type === 'paragraph' ? sentencesOf(block.runs) : [],
  );
  return (
    <ContentSection {...head(band)} data-band="C-list" arrangement="beside">
      <Layout as="ul" rowGap="none">
        {sentences.map((sentence, index) => (
          <ListCard
            key={titles[index] ?? sentence.text}
            titleAs="h3"
            title={titles[index] ?? sentence.text}
            {...bodyOf(sentence.runs)}
          />
        ))}
      </Layout>
    </ContentSection>
  );
}
