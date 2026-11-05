import { Fragment } from 'react';

import { Button, Cluster, Icon, Layout, Prose, type LayoutProps } from '@/components';
import {
  BlockCard,
  Callout,
  ContentSection,
  ContentSectionText,
  DataTable,
  ListCard,
  Proof,
  type HeroMedia,
} from '@/patterns';

import { PublishedHero } from './PublishedHome';
import {
  SharedSectionView,
  type PublishedServiceProps,
  type SharedSectionCtx,
} from './PublishedService';
import type {
  AuditBlock,
  AuditContentColumn,
  PublishedAuditPage,
  PublishedAuditSection,
} from './published-audit-model';
import { ReportBand } from './ReportBand';

/**
 * TIER 3 — an Audit detail page from the new CMS (`/audits/{slug}`). The hero, then every Page Content
 * section in the editor's order:
 *
 *   a shared section   `SharedSectionView`, the component it takes on a Service page
 *   the Worked Report  `ReportBand`, the audits' "What the report looks like" page
 *   an Audit Section   the audit block renderer this route has always used for the block model
 *
 * The CMS decides order, presentation and variants; the page decides none of them.
 *
 * Drawings: a section's CMS illustration wins. Where the CMS has none, the drawing the frontend already
 * assigns stands in (`scenes`, `reasonFigure`, `claimFigure`, the hero's `fallbackMedia`), else the
 * labelled placeholder. Illustrations are the only fallback: every word comes from the CMS.
 */
export type PublishedAuditProps = Omit<PublishedServiceProps, 'page' | 'fallbackMedia'> & {
  page: PublishedAuditPage;
  fallbackMedia?: HeroMedia;
};

/* ── The audit block model (moved from the route unchanged) ───────────────────── */

function cardColumns(count: 1 | 2 | 3 | 4): LayoutProps['columns'] {
  switch (count) {
    case 1:
      return { base: 1 };
    case 3:
      return { base: 1, md: 2, lg: 3 };
    case 4:
      return { base: 1, md: 2, lg: 4 };
    default:
      return { base: 1, md: 2 };
  }
}

function renderColumn(column: AuditContentColumn) {
  return (
    <Layout key={column.id} rowGap="block">
      <Layout rowGap="tight">
        {column.eyebrow ? <p>{column.eyebrow}</p> : null}
        <h3>{column.heading}</h3>
        {column.bodyHtml ? <Prose html={column.bodyHtml} /> : null}
      </Layout>

      {column.items.length > 0 ? (
        <Layout as="ul" rowGap="none">
          {column.items.map((item) => (
            <ListCard
              key={`${column.id}-${item.title}`}
              title={item.title}
              body={item.body}
              titleAs="h4"
              arrangement="stacked"
              href={item.href}
            />
          ))}
        </Layout>
      ) : null}

      {column.links.length > 0 ? (
        /* A column's links STACK (owner, 7 Oct 2026): link buttons never sit side by side. */
        <Layout rowGap="text" justifyItems="start">
          {column.links.map((link) => (
            <Button
              key={`${column.id}-${link.href}-${link.label}`}
              as="a"
              href={link.href}
              emphasis="link"
              tone="primary"
              size="md"
              extendHitArea
              icon={<Icon name="arrow-right" />}
            >
              {link.label}
            </Button>
          ))}
        </Layout>
      ) : null}
    </Layout>
  );
}

function renderAuditBlock(block: AuditBlock) {
  switch (block.type) {
    case 'rich-text':
      /* Running text reads at the body measure; every other block keeps the full track. */
      return (
        <ContentSectionText>
          <Prose html={block.html} />
        </ContentSectionText>
      );

    case 'card-grid':
      return (
        <Layout
          as="ul"
          columns={cardColumns(block.columns)}
          colGap="gutter"
          rowGap="column"
          equalRows
        >
          {block.cards.map((card) => (
            <BlockCard
              key={`${block.id}-${card.title}`}
              title={card.title}
              body={card.body}
              href={card.href}
            />
          ))}
        </Layout>
      );

    case 'comparison-cards':
      return (
        <Layout as="ul" columns="fit" minTrack="sm" colGap="gutter" rowGap="column" equalRows>
          {block.cards.map((card) => (
            <BlockCard key={`${block.id}-${card.title}`} title={card.title} body={card.body} />
          ))}
        </Layout>
      );

    case 'table':
      return <DataTable {...block.table} />;

    case 'quote':
      return (
        <Layout rowGap="block">
          <Proof arrangement="compact" quote={block.quote} />
          {block.source ? (
            <Cluster>
              <Button
                as="a"
                href={block.source.href}
                emphasis="link"
                tone="primary"
                size="md"
                extendHitArea
                icon={<Icon name="arrow-right" />}
              >
                {block.source.label}
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      );

    case 'callout':
      return <Callout html={block.html} />;

    case 'labelled-list': {
      const numbered = block.displayStyle === 'numbered';
      return (
        <Layout as={numbered ? 'ol' : 'ul'} rowGap="none">
          {block.items.map((item, index) => (
            <ListCard
              key={`${block.id}-${item.title}`}
              title={item.title}
              body={item.body}
              marker={numbered ? { type: 'number', value: index + 1 } : undefined}
              titleAs="h3"
              href={item.href}
            />
          ))}
        </Layout>
      );
    }

    case 'two-column': {
      const columns = [block.left, block.right].filter(
        (column): column is AuditContentColumn => column !== undefined,
      );
      return (
        <Layout
          columns={columns.length > 1 ? { base: 1, lg: 2 } : { base: 1 }}
          colGap={columns.length > 1 ? 'column' : undefined}
          rowGap="stack"
          align="start"
        >
          {columns.map(renderColumn)}
        </Layout>
      );
    }

    case 'link-group':
      return (
        <Layout rowGap="block">
          <Layout rowGap="tight">
            <h3>{block.heading}</h3>
            {block.description ? <p>{block.description}</p> : null}
          </Layout>
          <Layout as="ul" rowGap="none">
            {block.links.map((link) => (
              <ListCard
                key={`${block.id}-${link.href}-${link.title}`}
                title={link.title}
                body={link.body}
                titleAs="h4"
                href={link.href}
              />
            ))}
          </Layout>
        </Layout>
      );
  }
}

/* ── The page ────────────────────────────────────────────────────────────────── */

function AuditSection({
  section,
  ctx,
}: {
  section: PublishedAuditSection;
  ctx: SharedSectionCtx;
}) {
  switch (section.type) {
    case 'report':
      return (
        <ReportBand band={section.band} surface={section.surface} eyebrow={section.eyebrow} />
      );
    case 'audit-section':
      return (
        <ContentSection id={section.id} heading={section.heading} headingId={section.headingId}>
          {section.blocks.map((block) => (
            <Fragment key={block.id}>{renderAuditBlock(block)}</Fragment>
          ))}
        </ContentSection>
      );
    default:
      return <SharedSectionView section={section} ctx={ctx} />;
  }
}

export function PublishedAudit({
  page,
  fallbackMedia,
  scenes,
  reasonFigure,
  claimFigure,
}: PublishedAuditProps) {
  const ctx: SharedSectionCtx = {
    route: page.route,
    slug: page.slug,
    family: 'audit',
    scenes,
    reasonFigure,
    claimFigure,
  };
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <Fragment key={section.key}>
          <AuditSection section={section} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
