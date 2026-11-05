import type { CorpusBand } from '@/lib/corpus-types';
import type { DataTableProps, ProofQuote } from '@/patterns';

import type { HomeHero } from './published-home-model';
import type { PublishedServiceSection } from './published-service-model';

/**
 * An Audit detail page as the new CMS publishes it (`/audits/{slug}`): the fixed hero, then every Page
 * Content section in the editor's saved order. A shared section is the Service model, so it renders
 * through the one component it renders through everywhere else; the two Audit-only sections each
 * render through the component the audits already had:
 *
 *   report         the Worked Report ("What the report looks like"): the CMS's scenario, sheet and
 *                  interpretation as a corpus band, so it renders through ReportBand unchanged
 *   audit-section  the legacy block model (a heading over rich text, card grids, tables, lists,
 *                  columns, link groups), through the audit block renderer the route has always had
 */

type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
};

export type AuditAction = { label: string; href: string; external: boolean };
export type AuditCard = { title: string; body: string; href?: string };
export type AuditLabelledItem = { title: string; body: string; href?: string };

export type AuditContentColumn = {
  id: string;
  eyebrow?: string;
  heading: string;
  bodyHtml: string;
  items: AuditLabelledItem[];
  links: AuditAction[];
};

export type AuditTable = Pick<
  DataTableProps,
  'caption' | 'summary' | 'keyColumn' | 'columns' | 'rows'
>;

/** One block of the legacy Audit Section, in its saved order. */
export type AuditBlock =
  | { id: string; type: 'rich-text'; html: string }
  | { id: string; type: 'card-grid'; columns: 1 | 2 | 3 | 4; cards: AuditCard[] }
  | { id: string; type: 'comparison-cards'; cards: AuditCard[] }
  | { id: string; type: 'table'; table: AuditTable }
  | { id: string; type: 'quote'; quote: ProofQuote; source?: AuditAction }
  | { id: string; type: 'callout'; html: string }
  | { id: string; type: 'labelled-list'; displayStyle: string; items: AuditLabelledItem[] }
  | { id: string; type: 'two-column'; left?: AuditContentColumn; right?: AuditContentColumn }
  | {
      id: string;
      type: 'link-group';
      heading: string;
      description?: string;
      links: AuditLabelledItem[];
    };

export type PublishedAuditSection =
  | PublishedServiceSection
  | {
      key: string;
      type: 'report';
      surface: 'paper' | 'tint';
      eyebrow?: string;
      band: CorpusBand;
    }
  | (Head & { type: 'audit-section'; blocks: AuditBlock[] });

export type PublishedAuditPage = {
  slug: string;
  route: string;
  /** The entry's display name (cards, the trail's leaf). The public H1 is the hero's title. */
  name: string;
  hero: HomeHero;
  sections: PublishedAuditSection[];
};
