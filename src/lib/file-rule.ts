/**
 * What a file field accepts, said before anyone uploads (docs/TRACKER.md F.3): "PDF or Word, up to
 * 10 MB". Pure, so it is tested on its own (tests/form-fields.test.mjs). The careers CV field (F.7)
 * is the first to use it: its hint is `describeFileRule`, and a send checks `fileProblem`.
 */

export type FileRule = {
  /** File extensions, without the dot: `['pdf', 'docx']`. */
  types: readonly string[];
  maxBytes: number;
};

/** How a type is named to a reader. */
const NAMES: Record<string, string> = {
  pdf: 'PDF',
  doc: 'Word',
  docx: 'Word',
  png: 'PNG',
  jpg: 'JPG',
  jpeg: 'JPG',
};

function listOf(items: readonly string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} or ${items[items.length - 1]}`;
}

function size(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

/** The field's `accept` attribute. */
export function acceptOf(rule: FileRule): string {
  return rule.types.map((type) => `.${type}`).join(',');
}

/** The line shown with the field: "PDF or Word, up to 10 MB". */
export function describeFileRule(rule: FileRule): string {
  const names = [...new Set(rule.types.map((type) => NAMES[type] ?? type.toUpperCase()))];
  return `${listOf(names)}, up to ${size(rule.maxBytes)}`;
}

/** What is wrong with a chosen file, in the words of an error, or '' when it fits. */
export function fileProblem(file: { name: string; size: number }, rule: FileRule): string {
  const ending = file.name.toLowerCase().split('.').pop() ?? '';
  if (!rule.types.includes(ending)) return `Choose a ${describeFileRule(rule).split(',')[0]} file`;
  if (file.size > rule.maxBytes) return `Choose a file up to ${size(rule.maxBytes)}`;
  return '';
}
