import type { CorpusBand, CorpusBlock, CorpusLink } from '@/lib/corpus-types';
import { inlineToHtml, inlineToText, paragraphHtml, type InlineRun } from '@/lib/inline';

/**
 * Reading a corpus band's shapes.
 *
 * The corpus is markdown, so a "labelled claim" arrives in four spellings: a parsed `labelled`
 * block (`**Label.** Body`), a paragraph that opens with a bold run whose last character is not
 * `.` `:` or `?` (`**"Customers keep getting stuck."** We watch…`), a list item that opens the same
 * way, and a paragraph that opens with a link (`[UX Research](/…): find out…`). These helpers
 * normalise them to one `Lead` so a template decides a shape from the words' structure and never
 * from a band id, and so every label rule (page-mapping § 0 rule 1) lives in one place.
 *
 * Nothing here writes a word. Every function returns the authored runs, trimmed of the one
 * punctuation mark a rule names, or a plain-text flattening of them.
 */

export type Lead = {
  /** The label's runs, as authored (a trailing colon is dropped by `labelTitle`, not here). */
  label: InlineRun[];
  /** What follows the label. */
  body: InlineRun[];
};

/** A bold label's text as a card or row TITLE: a trailing colon goes, a full stop or comma stays. */
export function labelTitle(label: readonly InlineRun[]): string {
  return inlineToText(label)
    .replace(/\s*:\s*$/, '')
    .trim();
}

/** The runs with their leading whitespace removed (a body that follows a label starts after the gap). */
export function trimStart(runs: readonly InlineRun[]): InlineRun[] {
  const [first, ...rest] = runs;
  if (first?.type === 'text') {
    const text = first.text.replace(/^\s+/, '');
    return text ? [{ type: 'text', text }, ...rest] : [...rest];
  }
  return [...runs];
}

/** The runs with their trailing whitespace removed. */
export function trimEnd(runs: readonly InlineRun[]): InlineRun[] {
  const copy = [...runs];
  const last = copy.at(-1);
  if (last?.type === 'text') {
    const text = last.text.replace(/\s+$/, '');
    if (text) copy[copy.length - 1] = { type: 'text', text };
    else copy.pop();
  }
  return copy;
}

/** A paragraph or list item that opens with a bold run: its label and the rest. */
export function boldLead(runs: readonly InlineRun[]): Lead | null {
  const [first, ...rest] = runs;
  if (first?.type !== 'strong') return null;
  return { label: first.children, body: trimStart(rest) };
}

/**
 * A step's lead as a whole sentence. "**1. We read your message** and a senior designer writes back."
 * bolds the start of ONE sentence: promoted to a title as written, the step read "We read your
 * message" over a body that began "and a senior designer…" (review 29 Oct, /contact). Where the bold
 * label has no terminal punctuation and the body runs on in lower case, the label takes the rest of
 * that first sentence, so the title is the sentence and the body what follows it. Words unchanged; a
 * label with a link, or one that ends its own sentence, is returned as it is.
 */
export function sentenceLead(lead: Lead): Lead {
  const label = inlineToText(lead.label).trim();
  if (/[.:;?!…]$/.test(label) || lead.label.some((run) => run.type === 'link')) return lead;
  const [first, ...rest] = lead.body;
  if (first?.type !== 'text') return lead;
  const match = /^(\s*[a-z][^.?!]*[.?!])\s*([\s\S]*)$/.exec(first.text);
  if (!match) return lead;
  const tail = match[2] ?? '';
  return {
    /* `boldLead` trims the body's leading space, so the join restores the one between the words. */
    label: [...lead.label, { type: 'text', text: ` ${(match[1] ?? '').trimStart()}` }],
    body: tail ? [{ type: 'text', text: tail }, ...rest] : rest,
  };
}

/** A block as a label and a body, whichever of the spellings it was written in. */
export function leadOf(block: CorpusBlock): Lead | null {
  if (block.type === 'labelled') return { label: block.label, body: block.body };
  if (block.type === 'paragraph') return boldLead(block.runs);
  return null;
}

/**
 * A paragraph that opens with a link and then a colon (`[UX Research](/…): find out how…`): the
 * link and the words after the colon, which stay lower-case as authored (rule 1).
 */
export function linkLead(
  block: CorpusBlock,
): { link: Extract<InlineRun, { type: 'link' }>; body: InlineRun[] } | null {
  if (block.type !== 'paragraph') return null;
  const [first, second, ...rest] = block.runs;
  if (first?.type !== 'link' || second?.type !== 'text' || !second.text.startsWith(':'))
    return null;
  const tail = second.text.replace(/^:\s*/, '');
  return { link: first, body: tail ? [{ type: 'text', text: tail }, ...rest] : rest };
}

/** The paragraph runs of a block list, in order. */
export function paragraphs(blocks: readonly CorpusBlock[]): InlineRun[][] {
  return blocks.flatMap((block) => (block.type === 'paragraph' ? [block.runs] : []));
}

/** One paragraph of runs as trusted HTML, as `<p>…</p>`. */
export const html = paragraphHtml;

/** The inline HTML of one paragraph (no wrapper), for `bodyHtml` entries. */
export const inline = inlineToHtml;

/** True when runs hold a link anywhere. */
export function hasLink(runs: readonly InlineRun[]): boolean {
  return runs.some(
    (run) => run.type === 'link' || ('children' in run && hasLink(run.children)),
  );
}

/** Every link in runs, in reading order (links nested in bold or italic included). */
export function linksIn(runs: readonly InlineRun[]): Extract<InlineRun, { type: 'link' }>[] {
  return runs.flatMap((run) =>
    run.type === 'link' ? [run] : 'children' in run ? linksIn(run.children) : [],
  );
}

/** Plain text of runs. */
export const plain = inlineToText;

export function blocksOf<T extends CorpusBlock['type']>(
  band: CorpusBand,
  type: T,
): Extract<CorpusBlock, { type: T }>[] {
  return band.blocks.filter(
    (block): block is Extract<CorpusBlock, { type: T }> => block.type === type,
  );
}

/** The links of every lone-link line in a band, in order. */
export function bandLinks(band: CorpusBand): CorpusLink[] {
  return blocksOf(band, 'links').flatMap((block) => block.links);
}

/** The first non-comment block that is not a quote or links line: the band's lead paragraph. */
export function leadParagraph(band: CorpusBand): InlineRun[] | undefined {
  const first = band.blocks.find((block) => block.type !== 'comment');
  return first?.type === 'paragraph' ? first.runs : undefined;
}

/** The index of the last element that satisfies `test`, or -1 (ES2022 has no `findLastIndex`). */
export function lastIndexWhere<T>(items: readonly T[], test: (item: T) => boolean): number {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (test(items[index] as T)) return index;
  }
  return -1;
}

/**
 * A paragraph that is one link and nothing else, with or without the full stop the author closed it
 * with (`[Tell us where quotes slow down](/contact).`): the link. A line like that is an ask, so it
 * becomes a button, and the button draws no full stop (page-mapping § 0 rule 1).
 */
export function loneLink(
  runs: readonly InlineRun[],
): Extract<InlineRun, { type: 'link' }> | null {
  const [first, second, ...rest] = runs;
  if (first?.type !== 'link' || rest.length > 0) return null;
  if (second === undefined) return first;
  return second.type === 'text' && /^\s*[.]?\s*$/.test(second.text) ? first : null;
}

/** A hard part's "Example:" paragraph: its first link (the cited case or page), else undefined. */
export function exampleLink(
  runs: readonly InlineRun[],
): { href: string; name: string } | undefined {
  if (!/^example:/i.test(plain(runs).trimStart())) return undefined;
  const run = runs.find((r) => r.type === 'link');
  if (!run || run.type !== 'link') return undefined;
  return { href: run.href, name: plain(run.children).replace(/['’]s$/, '') };
}

/** A hard part's example: a paragraph that opens "Example:". It is rendered exactly as authored. */
export function isExample(runs: readonly InlineRun[]): boolean {
  /* "Example:", and the qualified openings the copy also uses: "Example, for what a result shows:",
     "Example of how each view is set:", "Example, from related work:". */
  return /^example\b[^:.]{0,40}:/i.test(plain(runs).trimStart());
}

/**
 * A band's onward line (tracker 2.53, 3 Nov 2026): the band's LAST block is a paragraph of its own,
 * at most two sentences, whose one link sends the reader to a piece of reading (`/insights/…`):
 * "[Is your vibe-coded app ready for production?](/insights/…) covers where AI-built apps break
 * first." Such a line is lifted out of its band and set as an ink island after it (`OnwardIsland`,
 * CopyBands.tsx), where the plan allows one (plan.ts `placeOnward`).
 *
 * Its words are split, never rewritten: the sentence before the one holding the link (the setup) is
 * the island's heading; the sentence holding the link is its lead, or the heading when there is no
 * setup; a link that closes the line on its own is the button alone. The link's own words are the
 * one button, to its href, without the authored arrow (the control draws one).
 *
 * Not an onward line: a link to a case (the case-mention rule links it in place), a service or the
 * form (an ask), a paragraph that argues and then points (three sentences or more), an "Example:".
 */
export type OnwardLine = {
  /** The block's index in `band.blocks`. */
  index: number;
  heading: string;
  lead?: string;
  link: { label: string; href: string };
};

const SENTENCE_END = /[.?!…](?=\s|$)/g;

export function onwardLine(band: CorpusBand): OnwardLine | null {
  const index = lastIndexWhere(band.blocks, (block) => block.type !== 'comment');
  const block = band.blocks[index];
  if (block?.type !== 'paragraph' || isExample(block.runs)) return null;
  const links = block.runs.filter((run) => run.type === 'link');
  const link = links[0];
  if (links.length !== 1 || link?.type !== 'link' || !link.href.startsWith('/insights/'))
    return null;
  const at = block.runs.indexOf(link);
  const before = plain(block.runs.slice(0, at));
  const after = plain(block.runs.slice(at + 1));
  const label = plain(link.children).trim();
  const sentences =
    (before.match(SENTENCE_END)?.length ?? 0) + (after.match(SENTENCE_END)?.length ?? 0);
  if (sentences > 2 || !label) return null;

  /* The setup: everything up to the last sentence end before the link. */
  let cut = -1;
  for (const match of before.matchAll(SENTENCE_END)) cut = (match.index ?? 0) + 1;
  const setup = cut > 0 ? before.slice(0, cut).trim() : '';
  const prefix = cut > 0 ? before.slice(cut) : before;
  const tail = /^\s*[.]?\s*$/.test(after);
  const pointer = `${prefix}${label}${after}`.trim();
  const button = { label: label.replace(/\s*[→➝➔⟶]\s*$/u, ''), href: link.href };

  if (tail && !prefix.trim()) {
    /* "Added a confidence score and usage stayed flat? [Read why … →](…)": the link is the button. */
    return setup ? { index, heading: setup, link: button } : null;
  }
  return setup
    ? { index, heading: setup, lead: pointer, link: button }
    : { index, heading: pointer, link: button };
}

/** The band without its onward line, so the line is said once, on the island. */
export function withoutBlock(band: CorpusBand, index: number): CorpusBand {
  return { ...band, blocks: band.blocks.filter((_, at) => at !== index) };
}
