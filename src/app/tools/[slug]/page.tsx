import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button, Cluster, Layout, Prose, type LayoutProps } from '@/components';
import {
  getPageSeo,
  getToolDetail,
  listToolSlugs,
  type ToolBlock,
  type ToolContentColumn,
} from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { ROUTES } from '@/lib/routes';
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
  type HeroAction,
  type HeroActions,
  ListCard,
  PageHero,
  Proof,
} from '@/patterns';
import { LongformPage } from '@/templates';

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

/** A hero takes two actions at most, in saved order (PageHero `HeroActions`). */
function heroActions(actions: readonly HeroAction[]): HeroActions {
  const [first, second] = actions;
  return first ? (second ? [first, second] : [first]) : [];
}

/**
 * `/tools/{slug}`: a Tool record from the new CMS, resolved by slug on demand, so a tool published
 * later renders without a rebuild and an unknown or unpublished slug is a 404. Its words, sections,
 * order and drawings are the record's; its <head> is the published SEO Page for the same path.
 *
 *   article   the corpus tool page (LongformPage `tool`), the record mapped onto its page model
 *   sections  the section-by-section page below, each Audit Section a ContentSection of its blocks
 */
export const revalidate = 300;

export async function generateStaticParams() {
  try {
    return (await listToolSlugs()).map((slug) => ({ slug }));
  } catch (error) {
    /* The CMS unreachable at build: every route renders on its first request instead. */
    console.error(error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps<'/tools/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tool = await getToolDetail(slug);
    if (!tool) {
      return {
        title: 'Tool not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      };
    }
    return (await getPageSeo(tool.route)).metadata;
  } catch {
    return {
      title: 'Tool temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ToolPage({ params }: PageProps<'/tools/[slug]'>) {
  const { slug } = await params;
  const tool = await getToolDetail(slug);
  if (!tool) notFound();
  const { structuredData } = await getPageSeo(tool.route);
  const jsonLd = structuredData ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdMarkup(structuredData) }}
    />
  ) : null;

  if (tool.presentation === 'article') {
    return (
      <>
        {jsonLd}
        <LongformPage
          page={tool.page}
          family="tool"
          caseRefs={{}}
          heroMedia={tool.heroMedia}
          toolShell={tool.shell}
        />
      </>
    );
  }

  const page = tool.tool;
  const title = page.title || page.hero.highlightedText || '';

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Tools', href: ROUTES.tools },
    { label: title, href: tool.route },
  ];

  return (
    <>
      {jsonLd}

      <PageHero
        trail={heroTrail(crumbs, title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={title}
        eyebrow={eyebrowBesideTrail(page.hero.eyebrow, crumbs)}
        body={[page.hero.description, ...(page.hero.paragraphs ?? [])]}
        {...(page.hero.actions?.length ? { actions: heroActions(page.hero.actions) } : {})}
        dates={page.publishedAt ? { published: page.publishedAt } : undefined}
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
      {page.sections.map((section) => (
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
