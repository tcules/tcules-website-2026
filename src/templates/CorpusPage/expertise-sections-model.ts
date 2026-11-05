import type { MediaImage } from '@/components';
import type { CorpusBlock } from '@/lib/corpus-types';

/**
 * The two Page Content sections only the Expertise owners hold (Expertise Master, Expertise detail):
 * the grouped directory of Expertise records and the question/role ledger.
 */

type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};

export type ExpertiseDirectoryCard = {
  id: string;
  /** The placement's title, else the selected Expertise record's own. */
  title: string;
  /** The record's `/expertise/{slug}` route. */
  href?: string;
  /** "Best for" then "How we design for it": plain text, one paragraph each, escaped as HTML. */
  bodyHtml: string[];
  /** The placement's image, else the record's preview image. */
  image?: MediaImage;
  /** For the labelled placeholder's slot name when the record has no image. */
  slug?: string;
};

export type ExpertiseDirectorySection = Head & {
  type: 'directory';
  lead?: string;
  groups: { id: string; eyebrow?: string; heading: string; cards: ExpertiseDirectoryCard[] }[];
};

export type QuestionLedgerSection = Head & {
  type: 'ledger';
  lead?: string;
  items: { voice: string; reply: string }[];
  /** The ledger's following words, in the corpus block model. */
  after: CorpusBlock[];
};
