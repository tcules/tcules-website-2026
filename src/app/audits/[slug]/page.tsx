import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  Button,
  Cluster,
  Icon,
  Layout,
  Prose,
  Section,
  Tag,
  type LayoutProps,
} from '@/components';
import {
  getAuditPage,
  type AuditAction,
  type AuditBlock,
  type AuditContentColumn,
} from '@/content';
import { auditPath, ROUTES } from '@/lib/routes';
import { OfferRoute, isCorpusOffer, offerMetadata, offerSlugs } from '@/app/_corpus/offer';
import { eyebrowBesideTrail, heroTrail } from '@/lib/trail';
import {
  Accordion,
  BlockCard,
  Breadcrumbs,
  type BreadcrumbItem,
  Callout,
  ContentSection,
  ContentSectionText,
  CtaSection,
  DataTable,
  Figure,
  ListCard,
  PageHero,
  Proof,
  type HeroAction,
} from '@/patterns';

type HeroActions = readonly [] | readonly [HeroAction] | readonly [HeroAction, HeroAction];

function firstTwoHeroActions(actions: readonly AuditAction[]): HeroActions {
  const first = actions[0];
  const second = actions[1];
  if (!first) return [];
  return second ? [first, second] : [first];
}

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

    case 'media':
      return <Figure image={block.image} caption={block.caption} note={block.note} />;
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function generateStaticParams() {
  return offerSlugs('/audits').map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/audits/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const corpus = await offerMetadata(`/audits/${slug}`);
  if (corpus) return corpus;
  const audit = await getAuditPage(slug);

  if (!audit) {
    return {
      title: 'Audit not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = audit.seo?.title || audit.title;
  const description = audit.seo?.description || audit.hero.description;
  const canonical = audit.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(audit.seo?.robots ? { robots: audit.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function AuditPage({ params }: PageProps<'/audits/[slug]'>) {
  const { slug } = await params;
  if (isCorpusOffer(`/audits/${slug}`)) return <OfferRoute route={`/audits/${slug}`} />;
  const audit = await getAuditPage(slug);

  if (!audit) notFound();

  const heroActions = firstTwoHeroActions(audit.hero.actions);

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Audits', href: ROUTES.audits },
    { label: audit.title, href: auditPath(audit.slug) },
  ];

  return (
    <>
      {audit.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(audit.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(crumbs, audit.title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={audit.title}
        eyebrow={eyebrowBesideTrail(audit.hero.eyebrow, crumbs)}
        body={[audit.hero.description]}
        actions={heroActions}
        surface="paper"
      >
        {audit.hero.tags.length > 0 ? (
          <Cluster as="ul" colGap="text" rowGap="tight">
            {audit.hero.tags.map((tag) => (
              <li key={tag}>
                <Tag>{tag}</Tag>
              </li>
            ))}
          </Cluster>
        ) : null}
      </PageHero>

      {/* ONE BAND PER SECTION. Every band is paper: tint marks a section that matters and the
          page's asks, and nothing here has a field that could say which section that is — so the
          ground is left alone rather than alternated. See the services route for the one place
          that reads an accent out of block shape.

          ContentSection's `lead` is not passed because this page type has no source for one.
          `liftLead` recovers a lead from an italic opening paragraph, and that convention was
          measured across this corpus and found only on product-design; wiring it here would be
          dead code. When the CMS grows a real field, it arrives as one prop. */}
      {audit.sections.map((section) => (
        <ContentSection
          key={section.id}
          heading={section.heading?.text}
          headingId={section.heading?.anchorId}
        >
          {section.blocks.map((block) => (
            <Fragment key={block.id}>{renderAuditBlock(block)}</Fragment>
          ))}
        </ContentSection>
      ))}

      {audit.faq ? (
        <Section surface="tint" aria-labelledby="audit-faq-heading">
          <Layout rowGap="stack">
            <Layout rowGap="block">
              {audit.faq.eyebrow ? <p>{audit.faq.eyebrow}</p> : null}
              <h2 id="audit-faq-heading">{audit.faq.heading}</h2>
              {audit.faq.description ? <p>{audit.faq.description}</p> : null}
            </Layout>
            <Accordion items={audit.faq.items} />
          </Layout>
        </Section>
      ) : null}

      {audit.cta ? (
        <CtaSection
          arrangement="open"
          heading={audit.cta.heading}
          body={audit.cta.body}
          eyebrow={audit.cta.eyebrow}
          points={audit.cta.points}
          actions={audit.cta.actions}
        />
      ) : null}
    </>
  );
}
