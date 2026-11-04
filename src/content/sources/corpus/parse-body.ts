import type { InlineRun } from '../../../lib/inline.ts';
import type {
  CorpusBand,
  CorpusBlock,
  CorpusFormField,
  CorpusHero,
  CorpusLink,
} from '../../corpus-types.ts';
import { parseInline } from './parse-inline.ts';

/**
 * A corpus body (the markdown after the frontmatter) → hero + bands of typed blocks.
 *
 * Two passes. `tokenize` reads lines into raw block tokens (heading, comment, table, list, quote,
 * paragraph); `blocksFrom` turns tokens into `CorpusBlock`s, nesting `###` / `####` subheads as
 * `item` blocks. Nothing is reworded, trimmed or reordered: every authored character lands in a run.
 */

type Token =
  | { k: 'heading'; level: number; text: string; id: string | null }
  | { k: 'comment'; text: string }
  | { k: 'table'; lines: string[] }
  | { k: 'list'; ordered: boolean; items: string[] }
  | { k: 'quote'; lines: string[] }
  | { k: 'para'; lines: string[] };

const HEADING = /^(#{1,6})\s+(.*?)\s*$/;
const ANCHOR = /^(.*?)\s*\{#([\w-]+)\}\s*$/;
const LIST = /^\s*([-*+]|\d+\.)\s+(.*)$/;

const startsBlock = (line: string) =>
  HEADING.test(line) ||
  line.startsWith('|') ||
  line.startsWith('>') ||
  line.startsWith('<!--') ||
  LIST.test(line);

function tokenize(body: string): Token[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const tokens: Token[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    if (line.trim() === '') {
      i++;
      continue;
    }
    if (/^-{3,}$/.test(line.trim())) {
      i++;
      continue;
    }
    if (line.startsWith('<!--')) {
      let text = line;
      while (!text.includes('-->') && i + 1 < lines.length) text += '\n' + lines[++i];
      tokens.push({
        k: 'comment',
        text: text.replace(/^<!--\s*/, '').replace(/\s*-->.*$/s, ''),
      });
      i++;
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      const anchored = ANCHOR.exec(heading[2]!);
      tokens.push({
        k: 'heading',
        level: heading[1]!.length,
        text: anchored ? anchored[1]! : heading[2]!,
        id: anchored ? anchored[2]! : null,
      });
      i++;
      continue;
    }
    if (line.startsWith('|')) {
      const rows: string[] = [];
      while (i < lines.length && lines[i]!.startsWith('|')) rows.push(lines[i++]!);
      tokens.push({ k: 'table', lines: rows });
      continue;
    }
    if (line.startsWith('>')) {
      const q: string[] = [];
      while (i < lines.length && lines[i]!.startsWith('>'))
        q.push(lines[i++]!.replace(/^> ?/, ''));
      tokens.push({ k: 'quote', lines: q });
      continue;
    }
    const first = LIST.exec(line);
    if (first) {
      const ordered = /^\d/.test(first[1]!);
      const items: string[] = [];
      while (i < lines.length) {
        const m = LIST.exec(lines[i]!);
        if (m && /^\d/.test(m[1]!) === ordered) {
          items.push(m[2]!);
          i++;
        } else if (lines[i]!.trim() === '' && LIST.test(lines[i + 1] ?? '')) {
          i++;
        } else if (m || lines[i]!.trim() === '' || startsBlock(lines[i]!)) {
          break;
        } else {
          items[items.length - 1] += ' ' + lines[i]!.trim();
          i++;
        }
      }
      tokens.push({ k: 'list', ordered, items });
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i]!.trim() !== '' &&
      !(para.length > 0 && startsBlock(lines[i]!))
    )
      para.push(lines[i++]!);
    tokens.push({ k: 'para', lines: para });
  }
  return tokens;
}

/* ── runs helpers ─────────────────────────────────────────────────────────────────────────── */

const textOf = (runs: readonly InlineRun[]): string =>
  runs
    .map((r) =>
      r.type === 'text' || r.type === 'code'
        ? r.text
        : r.type === 'br'
          ? ' '
          : textOf(r.children),
    )
    .join('');

const isSep = (r: InlineRun) => r.type === 'text' && /^[\s·|,]*$/.test(r.text);

/** A run list made only of links and separators, with at least one link. */
function linksOnly(runs: InlineRun[]): CorpusLink[] | null {
  const links = runs.filter((r) => r.type === 'link');
  if (links.length === 0 || !runs.every((r) => r.type === 'link' || isSep(r))) return null;
  return links.map((r) => {
    if (r.type !== 'link') throw new Error('unreachable');
    return { href: r.href, label: r.children, labelText: textOf(r.children) };
  });
}

/** A sole `strong` / `em` run: returns its content, else null. */
function sole(runs: InlineRun[], type: 'strong' | 'em'): InlineRun[] | null {
  const only = runs.filter((r) => !isSep(r));
  const [one] = only;
  return only.length === 1 && one && one.type === type ? one.children : null;
}

function trimLead(runs: InlineRun[]): InlineRun[] {
  const [first, ...rest] = runs;
  if (first && first.type === 'text') {
    const text = first.text.replace(/^\s+/, '');
    return text ? [{ type: 'text', text }, ...rest] : rest;
  }
  return runs;
}

/* ── tokens → blocks ──────────────────────────────────────────────────────────────────────── */

const splitCells = (line: string): string[] => {
  const inner = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return inner.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
};

function tableBlock(lines: string[]): CorpusBlock {
  const rows = lines.map(splitCells);
  const [header = [], sep, ...body] = rows;
  const hasSep = sep !== undefined && sep.every((c) => /^:?-{3,}:?$/.test(c));
  const data = hasSep ? body : [sep, ...body].filter((r): r is string[] => r !== undefined);
  return {
    type: 'table',
    header: header.map(parseInline),
    rows: data.map((r) => r.map(parseInline)),
  };
}

function quoteBlock(lines: string[], pendingSignoff: boolean): CorpusBlock {
  const groups: string[][] = [[]];
  for (const l of lines) {
    if (l.trim() === '') groups.push([]);
    else groups[groups.length - 1]!.push(l);
  }
  const paras = groups.filter((g) => g.length > 0);
  let attribution: InlineRun[] | null = null;
  const last = paras[paras.length - 1];
  const tail = last?.[last.length - 1]?.trim();
  if (last && tail && /^\*\*.+\*\*$/.test(tail) && (last.length > 1 || paras.length > 1)) {
    attribution = sole(parseInline(tail), 'strong') ?? parseInline(tail);
    last.pop();
    if (last.length === 0) paras.pop();
  }
  return {
    type: 'quote',
    paragraphs: paras.map((g) => parseInline(g.join('\n').trimEnd())),
    attribution,
    pendingSignoff,
    testimonialId: null,
    rating: null,
  };
}

/** A paragraph token → one or more blocks. A line that is only links is split out as its own block. */
function paragraphBlocks(lines: string[]): CorpusBlock[] {
  const out: CorpusBlock[] = [];
  let text: string[] = [];
  const flushText = () => {
    if (text.length === 0) return;
    const runs = parseInline(text.join('\n').trimEnd());
    text = [];
    const [head, ...tail] = runs;
    if (head && head.type === 'strong') {
      const label = textOf(head.children).trim();
      if (!tail.length && /^enquiry form$/i.test(label)) {
        out.push({ type: 'form', fields: [], submit: null, after: null });
        return;
      }
      if (/[.:?]$/.test(label)) {
        out.push({ type: 'labelled', label: head.children, body: trimLead(tail) });
        return;
      }
    }
    out.push({ type: 'paragraph', runs });
  };
  for (const line of lines) {
    const links = linksOnly(parseInline(line.trim()));
    if (links && lines.length > 1) {
      flushText();
      const prev = out[out.length - 1];
      if (prev && prev.type === 'links') prev.links.push(...links);
      else out.push({ type: 'links', links });
    } else {
      text.push(line);
    }
  }
  flushText();
  const only = out.length === 1 ? out[0] : undefined;
  if (only && only.type === 'paragraph') {
    const links = linksOnly(only.runs);
    if (links) return [{ type: 'links', links }];
  }
  return out;
}

const SIGNOFF = /awaiting client sign-off/i;

function blocksFrom(tokens: Token[], pos: { i: number }, parentLevel: number): CorpusBlock[] {
  const out: CorpusBlock[] = [];
  while (pos.i < tokens.length) {
    const t = tokens[pos.i]!;
    if (t.k === 'heading') {
      if (t.level <= parentLevel) break;
      pos.i++;
      const blocks = blocksFrom(tokens, pos, t.level);
      const heading = parseInline(t.text);
      out.push({
        type: 'item',
        level: t.level >= 4 ? 4 : 3,
        id: t.id,
        heading,
        headingText: textOf(heading),
        blocks,
      });
      continue;
    }
    pos.i++;
    switch (t.k) {
      case 'comment': {
        const next = tokens[pos.i];
        if (SIGNOFF.test(t.text) && next && next.k === 'quote') {
          pos.i++;
          out.push(quoteBlock(next.lines, true));
        } else {
          out.push({ type: 'comment', text: t.text });
        }
        break;
      }
      case 'quote': {
        const quote = quoteBlock(t.lines, false);
        out.push(quote);
        /* Some quotes carry their attribution OUTSIDE the blockquote: a bold name, a hard break and a
           role (`**Samy Melaine**  ⏎ Founder & CPTO, Eden AI`). It belongs to the quote. */
        const next = tokens[pos.i];
        if (
          quote.type === 'quote' &&
          !quote.attribution &&
          next &&
          next.k === 'para' &&
          next.lines.length === 2 &&
          /^\*\*[^*]+\*\* {2,}$/.test(next.lines[0]!)
        ) {
          quote.attribution = parseInline(next.lines.join('\n').trimEnd());
          pos.i++;
        }
        break;
      }
      case 'table':
        out.push(tableBlock(t.lines));
        break;
      case 'list':
        out.push({ type: 'list', ordered: t.ordered, items: t.items.map(parseInline) });
        break;
      case 'para': {
        /* A client's words quoted inline under a claim (the 3 Nov copy, /why-tcules and /how-we-work):
           the quote in curly marks, a hard break, then who said it, plain
           (`“They proved it…”  ⏎ Pratik Ghoshal, CEO, ConnectX`). It is a quote, not a paragraph. */
        const [said, by] = t.lines;
        if (
          t.lines.length === 2 &&
          said !== undefined &&
          by !== undefined &&
          /^“[^]*”\s{2,}$/.test(said) &&
          by.trim().length > 0 &&
          !/^[“*>]/.test(by.trim())
        ) {
          out.push({
            type: 'quote',
            paragraphs: [parseInline(said.trimEnd())],
            attribution: parseInline(by.trim()),
            pendingSignoff: false,
            testimonialId: null,
            rating: null,
          });
          break;
        }
        out.push(...paragraphBlocks(t.lines));
        break;
      }
    }
  }
  return assembleForms(out);
}

/** `**Enquiry form**`, its field list, `**Submit:**` and `**After sending:**` → one `form` block. */
function assembleForms(blocks: CorpusBlock[]): CorpusBlock[] {
  const out: CorpusBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!;
    if (b.type !== 'form') {
      out.push(b);
      continue;
    }
    const form = { ...b, fields: [] as CorpusFormField[] };
    const list = blocks[i + 1];
    if (list && list.type === 'list') {
      form.fields = list.items.map((label) => {
        const labelText = textOf(label);
        return { label, labelText, optional: /\(optional\)/i.test(labelText) };
      });
      i++;
    }
    for (let n = 0; n < 2; n++) {
      const next = blocks[i + 1];
      if (next && next.type === 'labelled') {
        const key = textOf(next.label).trim().toLowerCase();
        if (key === 'submit:') form.submit = next.body;
        else if (key === 'after sending:') form.after = next.body;
        else break;
        i++;
      }
    }
    out.push(form);
  }
  return out;
}

/* ── the page ─────────────────────────────────────────────────────────────────────────────── */

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function parseBody(body: string): { hero: CorpusHero; bands: CorpusBand[] } {
  const tokens = tokenize(body);
  const firstBand = tokens.findIndex((t) => t.k === 'heading' && t.level === 2);
  const preamble = firstBand === -1 ? tokens : tokens.slice(0, firstBand);
  const rest = firstBand === -1 ? [] : tokens.slice(firstBand);

  const h1 = preamble.findIndex((t) => t.k === 'heading' && t.level === 1);
  const h1Token = preamble[h1];
  if (!h1Token || h1Token.k !== 'heading') throw new Error('no # title before the first band');
  const before = blocksFrom(preamble.slice(0, h1), { i: 0 }, 0);
  const after = blocksFrom(preamble.slice(h1 + 1), { i: 0 }, 0);

  const titleRuns = parseInline(h1Token.text);
  const title = sole(titleRuns, 'strong') ?? titleRuns;
  const hero: CorpusHero = {
    eyebrow: null,
    title,
    titleText: textOf(title),
    lede: [],
    actions: [],
    proofLines: [],
    extra: [],
  };
  for (const b of before) {
    const em = b.type === 'paragraph' ? sole(b.runs, 'em') : null;
    if (em && !hero.eyebrow) hero.eyebrow = em;
    else hero.extra.push(b);
  }
  for (const b of after) {
    if (b.type === 'links') hero.actions.push(...b.links);
    else if (b.type === 'paragraph') {
      const line = sole(b.runs, 'em') ?? sole(b.runs, 'strong');
      if (line) hero.proofLines.push(line);
      else hero.lede.push(b.runs);
    } else hero.extra.push(b);
  }

  const bands: CorpusBand[] = [];
  const pos = { i: 0 };
  while (pos.i < rest.length) {
    const t = rest[pos.i]!;
    if (t.k !== 'heading' || t.level !== 2) throw new Error(`unexpected ${t.k} between bands`);
    pos.i++;
    const heading = parseInline(t.text);
    bands.push({
      id: t.id ?? slugify(textOf(heading)),
      anchored: t.id !== null,
      heading,
      headingText: textOf(heading),
      blocks: blocksFrom(rest, pos, 2),
    });
  }
  return { hero, bands };
}
