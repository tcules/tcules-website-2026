import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button, Cluster, Layout, Prose, type LayoutProps } from '@/components';
import { ToolRoute, isCorpusTool, toolMetadata, toolSlugs } from '@/app/_corpus/tool';
import { getToolPage, type ToolBlock, type ToolContentColumn } from '@/content';
import { ROUTES, toolPath } from '@/lib/routes';
import { eyebrowBesideTrail, heroTrail } from '@/lib/trail';
import {
  BlockCard,
  Breadcrumbs,
  type BreadcrumbItem,
  Callout,
  ContentSection,
  ContentSectionText,
  DataTable,
  Figure,
  ListCard,
  PageHero,
  Proof,
} from '@/patterns';

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

function renderColumn(column: ToolContentColumn) {
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
            />
          ))}
        </Layout>
      ) : null}
    </Layout>
  );
}

function renderToolBlock(block: ToolBlock) {
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
              eyebrow={card.eyebrow}
            />
          ))}
        </Layout>
      );

    case 'comparison-cards':
      return (
        <Layout as="ul" columns="fit" minTrack="sm" colGap="gutter" rowGap="column" equalRows>
          {block.cards.map((card) => (
            <BlockCard
              key={`${block.id}-${card.title}`}
              title={card.title}
              body={card.body}
              eyebrow={card.eyebrow}
            />
          ))}
        </Layout>
      );

    case 'table':
      return <DataTable {...block.table} />;

    case 'quote':
      return <Proof arrangement="compact" quote={block.quote} />;

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
            />
          ))}
        </Layout>
      );
    }

    case 'two-column': {
      const columns = [block.left, block.right].filter(
        (column): column is ToolContentColumn => column !== undefined,
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
                external={link.external}
              />
            ))}
          </Layout>
        </Layout>
      );

    case 'media':
      return (
        <Layout rowGap="block">
          <Figure image={block.image} caption={block.caption} />
          {block.download ? (
            <Cluster>
              <Button
                as="a"
                href={block.download.href}
                emphasis="link"
                tone="primary"
                size="md"
                extendHitArea
              >
                {block.download.label}
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      );
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function generateStaticParams() {
  return toolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const corpus = await toolMetadata(`/tools/${slug}`);
  if (corpus) return corpus;
  const tool = await getToolPage(slug);

  if (!tool) {
    return {
      title: 'Tool not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = tool.seo?.title || tool.title;
  const description = tool.seo?.description || tool.hero.description;
  const canonical = tool.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(tool.seo?.robots ? { robots: tool.seo.robots } : {}),
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

export default async function ToolPage({ params }: PageProps<'/tools/[slug]'>) {
  const { slug } = await params;
  if (isCorpusTool(`/tools/${slug}`)) return <ToolRoute route={`/tools/${slug}`} />;
  const tool = await getToolPage(slug);

  if (!tool) notFound();

  const title = tool.title || tool.hero.highlightedText || '';

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Tools', href: ROUTES.tools },
    { label: title, href: toolPath(tool.slug) },
  ];

  return (
    <>
      {tool.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(tool.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(crumbs, title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={title}
        eyebrow={eyebrowBesideTrail(tool.hero.eyebrow, crumbs)}
        body={[tool.hero.description]}
        dates={tool.publishedAt ? { published: tool.publishedAt } : undefined}
        surface="paper"
      />

      {/* ONE BAND PER SECTION. Every band is paper: tint marks a section that matters and the
          page's asks, and nothing here has a field that could say which section that is — so the
          ground is left alone rather than alternated. See the services route for the one place
          that reads an accent out of block shape.

          ContentSection's `lead` is not passed because this page type has no source for one.
          `liftLead` recovers a lead from an italic opening paragraph, and that convention was
          measured across this corpus and found only on product-design; wiring it here would be
          dead code. When the CMS grows a real field, it arrives as one prop. */}
      {tool.sections.map((section) => (
        <ContentSection
          key={section.id}
          heading={section.heading?.text}
          headingId={section.heading?.anchorId}
        >
          {section.blocks.map((block) => (
            <Fragment key={block.id}>{renderToolBlock(block)}</Fragment>
          ))}
        </ContentSection>
      ))}
    </>
  );
}
