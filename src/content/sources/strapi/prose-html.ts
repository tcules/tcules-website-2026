import type { Entries } from './home-types';

type Text = string | null | undefined;

/** The tags the CMS's HTML-saved prose uses: a body holding none of them is Markdown already. */
const HTML_TAG = /<\/?(?:p|a|strong|b|em|i|ul|ol|li|br|h[1-6])(?:\s[^>]*)?\/?>/iu;

const ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/giu, (whole, name: string) => {
    if (name.startsWith('#x') || name.startsWith('#X'))
      return String.fromCodePoint(Number.parseInt(name.slice(2), 16));
    if (name.startsWith('#')) return String.fromCodePoint(Number.parseInt(name.slice(1), 10));
    return ENTITIES[name.toLowerCase()] ?? whole;
  });
}

/** One `<ul>`/`<ol>` as Markdown list lines, each item's words on one line. */
function listToMarkdown(tag: string, inner: string): string {
  const ordered = tag.toLowerCase() === 'ol';
  const items = [...inner.matchAll(/<li(?:\s[^>]*)?>([\s\S]*?)<\/li>/giu)].map((match) =>
    (match[1] ?? '')
      .replace(/<\/?p(?:\s[^>]*)?>/giu, ' ')
      .replace(/\s+/gu, ' ')
      .trim(),
  );
  return `\n\n${items.map((item, index) => `${ordered ? `${index + 1}.` : '-'} ${item}`).join('\n')}\n\n`;
}

/**
 * Prose is Markdown on the CMS's other owners; some Tool records (and the Tool Master) saved theirs as
 * HTML (`<p>…<a href="/audits">audits</a>…</p>`, measured 5 Nov 2026), which the Markdown renderers
 * print as literal tags. Paragraphs, line breaks, lists, links, emphasis and headings (as a bold line)
 * are read as the Markdown they stand for, so the words render rather than their tags; any other tag
 * is dropped with a warning, keeping its words. A body with none of those tags is returned as is.
 */
export function htmlProseToMarkdown(body: Text, warn: (message: string) => void): Text {
  const source = body?.trim();
  if (!source || !HTML_TAG.test(source)) return body;
  const markdown = source
    .replace(/\r\n?/gu, '\n')
    .replace(/<(ul|ol)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/giu, (_whole, tag: string, inner: string) =>
      listToMarkdown(tag, inner),
    )
    .replace(/<h[1-6](?:\s[^>]*)?>([\s\S]*?)<\/h[1-6]>/giu, '\n\n**$1**\n\n')
    .replace(/<\/?p(?:\s[^>]*)?>/giu, '\n\n')
    .replace(/<br\s*\/?>/giu, '\n')
    .replace(
      /<a\s[^>]*?href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/giu,
      (_whole, _quote: string, href: string, label: string) =>
        `[${label}](${decodeEntities(href)})`,
    )
    .replace(/<\/?(?:strong|b)>/giu, '**')
    .replace(/<\/?(?:em|i)>/giu, '*')
    .replace(/<[^>]+>/gu, (tag) => {
      warn(`drops the unsupported HTML tag ${tag}`);
      return '';
    });
  return decodeEntities(markdown)
    .split(/\n{2,}/u)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .join('\n\n');
}

/** One table cell or heading: its HTML read as Markdown on one line. */
function cell(value: Text, warn: (message: string) => void): Text {
  const markdown = htmlProseToMarkdown(value, warn);
  return markdown === value ? value : markdown?.replace(/\s*\n+\s*/gu, ' ');
}

/**
 * A CMS data table with any HTML in its headings and cells read as Markdown, as `htmlProseToMarkdown`
 * reads a body; the cells' renderers parse Markdown inline.
 */
export function htmlTableToMarkdown<
  T extends {
    columns?: Entries<{ heading: Text }>;
    rows?: Entries<{ heading: Text; cells: Entries<{ body: Text }> }>;
  },
>(table: T | null | undefined, warn: (message: string) => void): T | null | undefined {
  if (!table) return table;
  return {
    ...table,
    columns: table.columns?.map((column) =>
      column ? { ...column, heading: cell(column.heading, warn) } : column,
    ),
    rows: table.rows?.map((row) =>
      row
        ? {
            ...row,
            heading: cell(row.heading, warn),
            cells: row.cells?.map((item) =>
              item ? { ...item, body: cell(item.body, warn) } : item,
            ),
          }
        : row,
    ),
  };
}
