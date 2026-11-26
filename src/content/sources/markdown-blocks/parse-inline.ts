import type { InlineRun } from '../../../lib/inline.ts';

/**
 * Inline markdown → structured runs. Handles exactly what the corpus uses: `**strong**`,
 * `*em*`, `` `code` ``, `[text](href)` (parenthesised URLs included), backslash escapes and hard
 * breaks. A delimiter with no closer is literal text, so nothing authored is ever dropped.
 * A soft line break (a bare newline) collapses to a single space, as HTML does.
 */
export function parseInline(src: string): InlineRun[] {
  const s = src.replace(/ {2,}\n/g, '\u0000').replace(/\n/g, ' ');
  const { runs } = parse(s, 0, null);
  return runs;
}

type Parsed = { runs: InlineRun[]; end: number; closed: boolean };

function pushText(runs: InlineRun[], text: string) {
  if (!text) return;
  const last = runs[runs.length - 1];
  if (last && last.type === 'text') last.text += text;
  else runs.push({ type: 'text', text });
}

function parse(s: string, from: number, stop: '**' | '*' | null): Parsed {
  const runs: InlineRun[] = [];
  let i = from;
  let buf = '';
  const flush = () => {
    pushText(runs, buf);
    buf = '';
  };
  while (i < s.length) {
    const ch = s[i]!;
    if (ch === '\u0000') {
      flush();
      runs.push({ type: 'br' });
      i++;
      continue;
    }
    if (ch === '\\' && i + 1 < s.length && /[\\`*_{}[\]()#+\-.!|<>~]/.test(s[i + 1]!)) {
      buf += s[i + 1];
      i += 2;
      continue;
    }
    if (stop === '**' && s.startsWith('**', i)) {
      flush();
      return { runs, end: i + 2, closed: true };
    }
    if (stop === '*' && ch === '*' && !s.startsWith('**', i)) {
      flush();
      return { runs, end: i + 1, closed: true };
    }
    if (s.startsWith('**', i)) {
      const inner = parse(s, i + 2, '**');
      if (inner.closed && inner.runs.length > 0) {
        flush();
        runs.push({ type: 'strong', children: inner.runs });
        i = inner.end;
        continue;
      }
      buf += '**';
      i += 2;
      continue;
    }
    if (ch === '*') {
      const inner = parse(s, i + 1, '*');
      if (inner.closed && inner.runs.length > 0) {
        flush();
        runs.push({ type: 'em', children: inner.runs });
        i = inner.end;
        continue;
      }
      buf += '*';
      i++;
      continue;
    }
    if (ch === '`') {
      const close = s.indexOf('`', i + 1);
      if (close > i + 1) {
        flush();
        runs.push({ type: 'code', text: s.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }
    if (ch === '[') {
      const link = readLink(s, i);
      if (link) {
        flush();
        runs.push({ type: 'link', href: link.href, children: parse(link.label, 0, null).runs });
        i = link.end;
        continue;
      }
    }
    buf += ch;
    i++;
  }
  flush();
  return { runs, end: i, closed: false };
}

function readLink(s: string, at: number): { label: string; href: string; end: number } | null {
  let depth = 0;
  let j = at;
  for (; j < s.length; j++) {
    const c = s[j]!;
    if (c === '\\') {
      j++;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']' && --depth === 0) break;
  }
  if (j >= s.length || s[j + 1] !== '(') return null;
  let k = j + 2;
  let parens = 1;
  for (; k < s.length; k++) {
    if (s[k] === '(') parens++;
    else if (s[k] === ')' && --parens === 0) break;
  }
  if (k >= s.length) return null;
  return { label: s.slice(at + 1, j), href: s.slice(j + 2, k).trim(), end: k + 1 };
}
