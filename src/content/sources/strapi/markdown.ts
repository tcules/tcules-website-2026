import { escapeHtml, safeContentHref } from './rich-text';

function renderMarks(source: string): string {
  const escapedCharacters: string[] = [];
  const protectedSource = source.replace(
    /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/gu,
    (_, character: string) => {
      const index = escapedCharacters.push(character) - 1;
      return `\uE000${index}\uE001`;
    },
  );

  /* A code span is parked before the marks run, so an underscore or asterisk inside it
     (`service_role`) can never pair with one outside it. An underscore mark needs a non-word
     character either side, as in CommonMark, so `snake_case` stays a word. */
  const codeSpans: string[] = [];
  return escapeHtml(protectedSource)
    .replace(/`([^`]+)`/gu, (_, code: string) => `\uE005${codeSpans.push(code) - 1}\uE006`)
    .replace(/\*\*([^*]+)\*\*/gu, '<strong>$1</strong>')
    .replace(/(?<![\p{L}\p{N}_])__([^_]+)__(?![\p{L}\p{N}_])/gu, '<strong>$1</strong>')
    .replace(/~~([^~]+)~~/gu, '<del>$1</del>')
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/gu, '<em>$1</em>')
    .replace(/(?<![\p{L}\p{N}_])_([^_]+)_(?![\p{L}\p{N}_])/gu, '<em>$1</em>')
    .replace(
      /\uE005(\d+)\uE006/gu,
      (_, index: string) => `<code>${codeSpans[Number(index)] ?? ''}</code>`,
    )
    .replace(/\uE000(\d+)\uE001/gu, (_, index: string) =>
      escapeHtml(escapedCharacters[Number(index)] ?? ''),
    );
}

/* A hard break: two or more trailing spaces at the end of a line that the paragraph continues
   past. Lines are joined with this marker rather than with a space, and the marker becomes `<br>`
   only after the marks are applied, so a mark can still run across the break. */
const HARD_BREAK = '\uE004';

/**
 * A line of Markdown as inline HTML. Links are rendered FIRST and parked as placeholders, then the
 * marks run over the whole line, then the links are put back. The marks have to see the whole
 * line: `**[label](url)**` puts its two `**` either side of the link, and marking each slice
 * between links separately left both halves unpaired and printed literally (28 live links, 1 Nov
 * 2026). A mark INSIDE a label is the label's own and is applied when the link is rendered.
 */
function renderInline(source: string): string {
  const linkPattern = /(?<!!)(?<!\\)\[([^\]]+)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/gu;
  const links: string[] = [];
  const parked = source.replace(linkPattern, (_, label: string, target: string) => {
    const href = safeContentHref(target);
    const html = href
      ? `<a href="${escapeHtml(href)}">${renderMarks(label)}</a>`
      : renderMarks(label);
    return `\uE002${links.push(html) - 1}\uE003`;
  });

  return renderMarks(parked)
    .replace(/\uE002(\d+)\uE003/gu, (_, index: string) => links[Number(index)] ?? '')
    .replaceAll(HARD_BREAK, '<br>');
}

/** The lines of one paragraph (or one quoted paragraph) joined: a space, or a hard break. */
function joinLines(lines: readonly string[]): string {
  return lines
    .map((line, index) =>
      index < lines.length - 1 && / {2,}$/u.test(line)
        ? `${line.trim()}${HARD_BREAK}`
        : `${line.trim()} `,
    )
    .join('')
    .trim();
}

/* A GFM table's delimiter row: `|---|---|`, optionally with alignment colons, which are read and
   dropped (Prose sets every cell to the start edge, as DataTable does). */
const TABLE_DELIMITER = /^\s*\|?\s*:?-+:?\s*(?:\|\s*:?-+:?\s*)*\|?\s*$/u;

/* A row's cells: split on unescaped pipes, outer pipes dropped, `\|` kept as a literal pipe. */
function tableCells(line: string): string[] {
  const trimmed = line
    .trim()
    .replace(/^\|/u, '')
    .replace(/(?<!\\)\|$/u, '');
  return trimmed.split(/(?<!\\)\|/u).map((cell) => cell.trim().replaceAll('\\|', '|'));
}

/**
 * A GFM table as the boxed table Prose draws (Prose.module.css § Table): the header row as column
 * heads, and each body row's first cell as its row header — DataTable's key column, which is what
 * the live tables' first column is (short labels, median 23 characters across 184 tables, 30 Oct
 * 2026). A short row is padded with empty cells and a long one cut, so every column lines up.
 */
function renderTable(header: string, rows: readonly string[]): string {
  const heads = tableCells(header);
  const width = heads.length;
  const head = heads.map((cell) => `<th scope="col">${renderInline(cell)}</th>`).join('');
  const body = rows
    .map((row) => {
      const cells = tableCells(row).slice(0, width);
      while (cells.length < width) cells.push('');
      return `<tr>${cells
        .map((cell, column) =>
          column === 0
            ? `<th scope="row">${renderInline(cell)}</th>`
            : `<td>${renderInline(cell)}</td>`,
        )
        .join('')}</tr>`;
    })
    .join('');
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

function isBlockStart(line: string): boolean {
  return (
    /^\s*\|/u.test(line) ||
    /^#{1,6}\s+/u.test(line) ||
    /^>\s?/u.test(line) ||
    /^\s*(?:[-+*]\s+|\d+\.\s+)/u.test(line) ||
    /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/u.test(line) ||
    /^```/u.test(line)
  );
}

/** Convert the CMS's Markdown field into the trusted HTML contract consumed by Prose. */
/**
 * One top-level heading found inside a markdown body, in document order. The field is `label`
 * rather than `text` so the collected array IS a `PageOutlineEntry[]` and passes to the view model
 * without a second mapping step to keep in sync.
 *
 * `anchorId` is OPAQUE on purpose — `toc-<n>`, the heading's position in the document's outline,
 * rather than a slug of its text. See docs/guides/long-form-outline.md § "Why the anchors are
 * opaque"; the short version is that it needs no de-duplication to be unique, does not change when
 * an editor rewords a heading, and is nobody's public URL — so the whole feature can be deleted
 * without breaking a link.
 */
export type BodyHeading = { label: string; anchorId: string };

/**
 * Opt-in outline collection. One sink per ENTRY, passed to every block of it in reading order:
 * `headings` accumulates across blocks, and its length is what numbers the next anchor, so
 * uniqueness needs no set and no cross-call bookkeeping.
 *
 * Omit it and `markdownToHtml` behaves exactly as it did before this existed: no ids, no
 * collection, byte-identical HTML. That is what keeps the 30-odd other call sites untouched.
 */
export type OutlineSink = { headings: BodyHeading[] };

/**
 * The label for an outline entry: the words the heading actually renders, with the markup taken
 * off. Derived from `renderInline`'s OUTPUT rather than from the markdown source, so the rail and
 * the heading can never disagree — an author who bolds half a heading or escapes a full stop gets
 * the same characters in both places.
 */
function headingLabel(html: string): string {
  return html
    .replace(/<[^>]+>/gu, '')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&gt;', '>')
    .replaceAll('&lt;', '<')
    .replaceAll('&amp;', '&')
    .replace(/\s+/gu, ' ')
    .trim();
}

/**
 * The field as plain lines. Two invisible characters arrive from the CMS's paste path (1 Nov
 * 2026): U+2028 (line separator) ends lines, and since `.` and `$` do not cross it a heading line
 * carrying one failed to parse and printed its hashes; and lines holding nothing but zero-width
 * characters (U+200D and kin) rendered as empty paragraphs. A line separator is a newline, and a
 * line with nothing visible on it is a blank line.
 */
function normaliseSource(markdown: string): string {
  return markdown
    .replaceAll('\r\n', '\n')
    .replace(/[\u2028\u2029]/gu, '\n')
    .split('\n')
    .map((line) => (/^[\s\u200B-\u200D\u2060\uFEFF]*$/u.test(line) ? '' : line))
    .join('\n')
    .trim();
}

export function markdownToHtml(
  markdown: string | null | undefined,
  context: string,
  outline?: OutlineSink,
): string {
  const source = typeof markdown === 'string' ? normaliseSource(markdown) : '';
  if (!source) return '';

  if (/!\[[^\]]*\]\([^)]+\)/u.test(source)) {
    throw new Error(
      `Strapi Markdown in ${context} contains embedded media. Use the section-image block instead.`,
    );
  }

  const lines = source.split('\n');
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```\s*([\w-]+)?\s*$/u);
    if (fence) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/u.test(lines[index] ?? '')) {
        code.push(lines[index] ?? '');
        index += 1;
      }
      if (index < lines.length) index += 1;
      const language = fence[1] ? ` class="language-${escapeHtml(fence[1])}"` : '';
      blocks.push(`<pre><code${language}>${escapeHtml(code.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/u);
    if (heading) {
      const level = Math.max(2, Math.min(6, heading[1]?.length ?? 2));
      const inline = renderInline(heading[2] ?? '');

      /* LEVEL 2 ONLY, and it is a correctness rule rather than a simplification. TableOfContents
         renders one flat level, so an outline holding both h2s and h3s would interleave sections
         with their own sub-sections and read as one undifferentiated ladder. Measured over the
         live CMS, 12 of 16 articles and 12 of 17 case studies mix the two.

         The id is attached only when it is collected, so a heading nobody can navigate to does
         not carry an anchor that suggests otherwise. */
      let attributes = '';
      if (outline && level === 2) {
        const anchorId = `toc-${outline.headings.length + 1}`;
        outline.headings.push({ label: headingLabel(inline), anchorId });
        attributes = ` id="${escapeHtml(anchorId)}"`;
      }

      blocks.push(`<h${level}${attributes}>${inline}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*\|/u.test(line) && TABLE_DELIMITER.test(lines[index + 1] ?? '')) {
      const rows: string[] = [];
      index += 2;
      while (index < lines.length && /^\s*\|/u.test(lines[index] ?? '')) {
        rows.push(lines[index] ?? '');
        index += 1;
      }
      blocks.push(renderTable(line, rows));
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/u.test(line)) {
      blocks.push('<hr>');
      index += 1;
      continue;
    }

    if (/^>\s?/u.test(line)) {
      /* A bare `>` line ends one quoted paragraph and starts the next, inside the same quote: an
         attribution after a blank `>` is its own paragraph rather than running on from the quote
         (22 live quotes, 1 Nov 2026). Prose spaces the paragraphs (`blockquote > * + *`). */
      const paragraphs: string[][] = [[]];
      while (index < lines.length && /^>\s?/u.test(lines[index] ?? '')) {
        const quoted = (lines[index] ?? '').replace(/^>\s?/u, '');
        if (quoted.trim()) paragraphs[paragraphs.length - 1]?.push(quoted);
        else if (paragraphs[paragraphs.length - 1]?.length) paragraphs.push([]);
        index += 1;
      }
      const inner = paragraphs
        .filter((paragraph) => paragraph.length)
        .map((paragraph) => `<p>${renderInline(joinLines(paragraph))}</p>`)
        .join('');
      if (inner) blocks.push(`<blockquote>${inner}</blockquote>`);
      continue;
    }

    const listItem = line.match(/^\s*([-+*]|\d+\.)\s+(.+)$/u);
    if (listItem) {
      const ordered = /\d+\./u.test(listItem[1] ?? '');
      const tag = ordered ? 'ol' : 'ul';
      const items: string[] = [];

      while (index < lines.length) {
        const match = (lines[index] ?? '').match(/^\s*([-+*]|\d+\.)\s+(.+)$/u);
        if (!match || /\d+\./u.test(match[1] ?? '') !== ordered) break;
        /* A GFM task item ("- [ ] Check row-level security") is a checklist line a reader works
           through, not a form: the box is dropped and the item reads as the list's own bullet. All
           74 live task items are unchecked (30 Oct 2026); a checked one keeps its words the same. */
        const item = (match[2] ?? '').replace(/^\[[ xX]\]\s+/u, '');
        items.push(`<li>${renderInline(item)}</li>`);
        index += 1;
      }

      blocks.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (
      index < lines.length &&
      (lines[index] ?? '').trim() &&
      !isBlockStart(lines[index] ?? '')
    ) {
      paragraph.push(lines[index] ?? '');
      index += 1;
    }
    blocks.push(`<p>${renderInline(joinLines(paragraph))}</p>`);
  }

  return blocks.join('');
}

/** A heading's words as an author writes an anchor to it: lower case, punctuation dropped, words
    joined by hyphens ("Lazarev.agency" → `lazarev-agency`, "AI's search" → `ais-search`). */
function anchorSlug(words: string): string {
  return words
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ'’]/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/gu, '');
}

/**
 * The heading an authored `#anchor` names, as an index into `slugs`, or `undefined`. The anchors
 * were written against the previous site's heading ids, which were not always the full heading
 * (1 Nov 2026, 40 links on 9 pages): `#fuselab` for "Fuselab Creative", `#hire-first-anyway` for
 * "When should you hire a designer first anyway?". So: the exact slug; else the one heading that
 * begins with the anchor's words; else the one heading that holds all of them in order. A tie at
 * any step resolves nothing rather than guessing between two headings.
 */
function anchorTarget(anchor: string, slugs: readonly string[]): number | undefined {
  const words = anchorSlug(anchor).split('-').filter(Boolean);
  if (!words.length) return undefined;
  const wanted = words.join('-');
  const only = (matches: number[]) => (matches.length === 1 ? matches[0] : undefined);
  const indices = slugs.map((_, index) => index);

  const exact = indices.filter((index) => slugs[index] === wanted);
  if (exact.length) return only(exact);

  const prefix = indices.filter((index) => slugs[index]?.startsWith(`${wanted}-`));
  if (prefix.length) return only(prefix);

  return only(
    indices.filter((index) => {
      let at = 0;
      for (const word of (slugs[index] ?? '').split('-')) if (word === words[at]) at += 1;
      return at === words.length;
    }),
  );
}

const HEADING_TAG = /<h([2-6])((?: id="[^"]*")?)>([\s\S]*?)<\/h\1>/gu;
const ANCHOR_HREF = /href="#([^"]+)"/gu;

/**
 * Point an entry's authored in-page links (`[label](#slug)`) at the headings they name.
 *
 * Run once per ENTRY over its mapped blocks, after every block is rendered, because a link usually
 * comes before the heading it points to and often sits in a different block. The headings keep
 * their ids: an h2 already carries its opaque `toc-<n>` (see BodyHeading), and that is what the
 * link is rewritten to, so the TOC and the author's link land on the same element. A heading
 * below h2 carries no id, so one that a link names is given `heading-<n>` — opaque in the same
 * way, and only where something points at it. An anchor that names no heading is left as
 * written: it is a content defect to fix in the CMS, not something to guess at here.
 *
 * Blocks without `html`, and entries with no in-page link, come back unchanged.
 */
export function resolveInPageAnchors<B extends object>(blocks: readonly B[]): B[] {
  const htmlOf = (block: B): string | undefined => {
    const html = (block as { html?: unknown }).html;
    return typeof html === 'string' ? html : undefined;
  };
  if (!blocks.some((block) => /href="#/u.test(htmlOf(block) ?? ''))) return [...blocks];

  const headings: { slug: string; id?: string }[] = [];
  for (const block of blocks) {
    for (const match of (htmlOf(block) ?? '').matchAll(HEADING_TAG)) {
      const id = match[2]?.match(/id="([^"]*)"/u)?.[1];
      headings.push({ slug: anchorSlug(headingLabel(match[3] ?? '')), ...(id ? { id } : {}) });
    }
  }
  const slugs = headings.map((heading) => heading.slug);

  const targets = new Map<string, string>();
  let added = 0;
  for (const block of blocks) {
    for (const match of (htmlOf(block) ?? '').matchAll(ANCHOR_HREF)) {
      const anchor = match[1] ?? '';
      if (targets.has(anchor)) continue;
      const heading = headings[anchorTarget(anchor, slugs) ?? -1];
      if (!heading) continue;
      if (!heading.id) {
        added += 1;
        heading.id = `heading-${added}`;
      }
      targets.set(anchor, heading.id);
    }
  }
  if (!targets.size) return [...blocks];

  let headingIndex = 0;
  return blocks.map((block) => {
    const html = htmlOf(block);
    if (html === undefined) return block;
    const rewritten = html
      .replace(HEADING_TAG, (whole, level: string, attributes: string, inner: string) => {
        const heading = headings[headingIndex];
        headingIndex += 1;
        return heading?.id && !attributes
          ? `<h${level} id="${escapeHtml(heading.id)}">${inner}</h${level}>`
          : whole;
      })
      .replace(ANCHOR_HREF, (whole, anchor: string) => {
        const id = targets.get(anchor);
        return id ? `href="#${escapeHtml(id)}"` : whole;
      });
    return { ...block, html: rewritten };
  });
}
