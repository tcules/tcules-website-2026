import { cache } from 'react';

import { auditPath, ROUTES } from '@/lib/routes';
import type {
  AuditMasterPage,
  AuditMasterSection,
  AuditMasterTile,
} from '@/templates/CorpusPage/published-audit-master-model';

import { actionHref, illustration, mapHero, rows, text } from './home';
import type { CmsHero, CmsIllustration, Entries } from './home-types';
import { PUBLISHED_AUDIT_MASTER_QUERY } from './published-audit-master-query';
import { mapSharedSection, type CmsSharedSection } from './published-service';
import { publicGraphql } from './public-graphql';

type Text = string | null | undefined;

type CmsAuditTile = {
  id: string;
  title: Text;
  description: Text;
  href: Text;
  ctaText: Text;
  illustration: CmsIllustration | null;
  detail: { label: Text; body: Text } | null;
  audit: {
    documentId: string;
    name: Text;
    slug: Text;
    routePath: Text;
    hero: { description: Text } | null;
  } | null;
};

/** The Service Card as the Audit Master selects it: its tiles carry the Audit relation. */
type CmsAuditCards = Extract<CmsSharedSection, { __typename: 'ComponentSharedServiceCard' }> & {
  columns: number | null;
  singleGridPresentation: Text;
  singleGridContent: Entries<CmsAuditTile>;
  twoGridContent: Entries<{
    id: string;
    ctaText: Text;
    detail: { label: Text; body: Text } | null;
    content: CmsAuditTile | null;
  }>;
};

type CmsAuditMasterSection = Exclude<
  CmsSharedSection,
  { __typename: 'ComponentSharedServiceCard' }
> | CmsAuditCards;

type CmsAuditMaster = {
  documentId: string;
  routePath: string;
  hero: CmsHero | null;
  content: Entries<CmsAuditMasterSection>;
};

const warn = (message: string) => console.warn(`New CMS ${ROUTES.audits}: ${message}`);

/**
 * One audit card. The Audit record is the source of its name and route (the card's own title and link
 * stand in only where it relates no record); the card's sentence, detail, action and drawing are the
 * card's. A card whose link names an audit page but whose Audit is not published is dropped, so the
 * hub never links to a page that does not exist.
 */
function auditTile(
  tile: CmsAuditTile,
  key: string,
  split?: { id: string; ctaText: Text; detail: { label: Text; body: Text } | null },
): AuditMasterTile | undefined {
  const related = tile.audit;
  const title = text(related?.name) ?? text(tile.title);
  if (!title) {
    warn(`${key} tile ${tile.id} has no title and no published Audit`);
    return undefined;
  }
  const relatedHref = related?.slug ? auditPath(related.slug) : undefined;
  if (relatedHref && related?.routePath && related.routePath !== relatedHref)
    warn(`${key} tile ${tile.id}: Audit ${related.documentId} reports route ${related.routePath}`);
  const authoredHref = actionHref(tile.href);
  if (relatedHref && authoredHref && authoredHref !== relatedHref)
    warn(`${key} tile ${tile.id} links ${authoredHref}, but its Audit is ${relatedHref}`);
  if (!related && authoredHref?.startsWith(`${ROUTES.audits}/`)) {
    warn(`${key} tile ${tile.id} has no published Audit relationship; it is not shown`);
    return undefined;
  }
  const href = relatedHref ?? authoredHref;
  if (!href) warn(`${key} tile ${tile.id} has no link`);
  const action = text(split?.ctaText) ?? text(tile.ctaText);
  const detail = split ? split.detail : tile.detail;
  const label = text(detail?.label);
  const detailText = text(detail?.body);
  if ((label || detailText) && !(label && detailText))
    warn(`${key} tile ${tile.id} has incomplete detail copy`);
  return {
    id: split?.id ?? tile.id,
    title,
    body: text(tile.description) ?? text(related?.hero?.description),
    href,
    art: illustration(tile.illustration),
    action,
    detail: label && detailText ? { label, text: detailText, action } : undefined,
  };
}

/**
 * The Audit Master's Service Card: the shared mapping (head, flow blocks, closing routes), its tiles
 * read again through the Audit relation, with each card's detail and action. `wide_unframed` sets each
 * card as its wide service tile instead of the bento.
 */
function mapAuditCards(section: CmsAuditCards): AuditMasterSection | undefined {
  const mapped = mapSharedSection(section, ROUTES.audits);
  if (mapped?.type !== 'service-cards') return mapped;
  const key = `${section.__typename}-${section.id}`;
  const tiles =
    mapped.variant === 'two'
      ? rows(section.twoGridContent).flatMap((split) =>
          split.content ? (auditTile(split.content, key, split) ?? []) : [],
        )
      : rows(section.singleGridContent).flatMap((tile) => auditTile(tile, key) ?? []);
  const presentation = text(section.singleGridPresentation);
  if (presentation === 'wide_unframed' && mapped.variant === 'single') {
    if (mapped.before.length || mapped.after.length || mapped.routes.length)
      warn(`${key} wide tiles carry flow blocks or routes; they are not shown`);
    return {
      key: mapped.key,
      id: mapped.id,
      heading: mapped.heading,
      headingId: mapped.headingId,
      surface: mapped.surface,
      type: 'service-tile',
      lead: mapped.lead,
      tiles,
    };
  }
  if (presentation) warn(`${key} uses unmapped single grid presentation ${presentation}`);
  return { ...mapped, tiles };
}

function mapSection(section: CmsAuditMasterSection): AuditMasterSection | undefined {
  return section.__typename === 'ComponentSharedServiceCard'
    ? mapAuditCards(section)
    : mapSharedSection(section, ROUTES.audits);
}

/** The published Audit Master, or null when none is published. */
export const getPublishedAuditMaster = cache(async (): Promise<AuditMasterPage | null> => {
  const { auditMaster } = await publicGraphql<{ auditMaster: CmsAuditMaster | null }>(
    PUBLISHED_AUDIT_MASTER_QUERY,
    'PublishedAuditMaster',
  );
  if (!auditMaster) return null;
  if (auditMaster.routePath !== ROUTES.audits) {
    throw new Error(
      `New CMS ${ROUTES.audits}: published entry reports route ${auditMaster.routePath}`,
    );
  }
  const hero = mapHero(auditMaster.hero);
  if (!hero) throw new Error(`New CMS ${ROUTES.audits}: published entry has no hero title`);
  return {
    route: ROUTES.audits,
    hero,
    sections: rows(auditMaster.content).flatMap((section) => mapSection(section) ?? []),
  };
});
