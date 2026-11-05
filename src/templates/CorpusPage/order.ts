import type { CorpusBand } from '@/lib/corpus-types';

/**
 * The one sanctioned reorder of a corpus page (owner, 10 Oct 2026): THE ENQUIRY FORM SITS
 * IMMEDIATELY BEFORE THE FAQ, on every page that has both, although the content files put the form
 * last. The questions are what a reader checks after deciding to ask, and a form under them was a
 * band most readers never reached. Every other band keeps document order.
 *
 * Every corpus template reads its bands through this, so a page type that gains a FAQ and a form
 * later takes the rule without an edit. A page with only one of the two, or with the form already
 * above the FAQ, comes back unchanged (the same array).
 *
 * The form band is the band that carries the form block, or the application band (`apply`), which
 * the page takes on the enquiry form though the copy authors no form block (owner, 4 Nov 2026: "reuse
 * the existing enquiry form"; /careers, /future-interfaces-lab/join). The FAQ band is named by the id
 * the content team gives it (`faq`, or About's `frequently-asked-questions`).
 */

const FAQ_IDS: ReadonlySet<string> = new Set(['faq', 'frequently-asked-questions']);

export const isFaqBand = (band: CorpusBand): boolean => FAQ_IDS.has(band.id);

const APPLICATION_IDS: ReadonlySet<string> = new Set(['apply']);

export const isFormBand = (band: CorpusBand): boolean =>
  APPLICATION_IDS.has(band.id) || band.blocks.some((block) => block.type === 'form');

export function formBeforeFaq(bands: readonly CorpusBand[]): readonly CorpusBand[] {
  const faq = bands.findIndex(isFaqBand);
  const form = bands.findIndex(isFormBand);
  if (faq < 0 || form < 0 || form < faq) return bands;
  const formBand = bands[form] as CorpusBand;
  const rest = bands.filter((_, index) => index !== form);
  return [...rest.slice(0, faq), formBand, ...rest.slice(faq)];
}
