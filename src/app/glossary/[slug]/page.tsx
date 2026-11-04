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
  LongformRoute,
  isCorpusLongform,
  longformMetadata,
  longformSlugs,
} from '@/app/_corpus/longform';
import {
  getGlossaryPage,
  type GlossaryAction,
  type GlossaryBlock,
  type GlossaryContentColumn,
} from '@/content';
import { glossaryPath, ROUTES } from '@/lib/routes';
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
type GlossaryPageProps = { params: Promise<{ slug: string }> };

function firstTwoHeroActions(actions: readonly GlossaryAction[]): HeroActions {
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

function renderColumn(column: GlossaryContentColumn) {
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

function renderGlossaryBlock(block: GlossaryBlock) {
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
              href={card.href}
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
        (column): column is GlossaryContentColumn => column !== undefined,
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
      return block.image || !block.href ? (
        <Figure image={block.image} caption={block.caption} />
      ) : (
        <Layout as="ul" rowGap="none">
          <ListCard
            title={block.caption}
            body={block.mime || 'Download file'}
            titleAs="h3"
            href={block.href}
          />
        </Layout>
      );
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

export function generateStaticParams() {
  return longformSlugs('/glossary').map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GlossaryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const corpus = await longformMetadata(`/glossary/${slug}`);
  if (corpus) return corpus;
  const glossary = await getGlossaryPage(slug);

  if (!glossary) {
    return {
      title: 'Glossary entry not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = glossary.seo?.title || glossary.title;
  const description = glossary.seo?.description || glossary.hero.description;
  const canonical = glossary.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(glossary.seo?.robots ? { robots: glossary.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      ...(canonical ? { url: canonical } : {}),
      images: [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [],
    },
  };
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { slug } = await params;
  if (isCorpusLongform(`/glossary/${slug}`)) return <LongformRoute route={`/glossary/${slug}`} />;
  const glossary = await getGlossaryPage(slug);

  if (!glossary) notFound();

  const heroActions = firstTwoHeroActions(glossary.hero.actions);

  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Glossary', href: ROUTES.glossary },
    { label: glossary.title, href: glossaryPath(glossary.slug) },
  ];

  return (
    <>
      {glossary.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(glossary.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(crumbs, glossary.title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={glossary.title}
        eyebrow={eyebrowBesideTrail(glossary.hero.eyebrow, crumbs)}
        body={[glossary.hero.description]}
        actions={heroActions}
        surface="paper"
      >
        {glossary.hero.tags.length > 0 ? (
          <Cluster as="ul" colGap="text" rowGap="tight">
            {glossary.hero.tags.map((tag) => (
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
      {glossary.sections.map((section) => (
        <ContentSection
          key={section.id}
          heading={section.heading?.text}
          headingId={section.heading?.anchorId}
        >
          {section.blocks.map((block) => (
            <Fragment key={block.id}>{renderGlossaryBlock(block)}</Fragment>
          ))}
        </ContentSection>
      ))}

      {glossary.faq ? (
        <Section surface="tint" aria-labelledby="glossary-faq-heading">
          <Layout rowGap="stack">
            <Layout rowGap="block">
              {glossary.faq.eyebrow ? <p>{glossary.faq.eyebrow}</p> : null}
              <h2 id="glossary-faq-heading">{glossary.faq.heading}</h2>
              {glossary.faq.description ? <p>{glossary.faq.description}</p> : null}
            </Layout>
            <Accordion items={glossary.faq.items} />
          </Layout>
        </Section>
      ) : null}

      {glossary.cta ? (
        <CtaSection
          arrangement="open"
          heading={glossary.cta.heading}
          body={glossary.cta.body}
          eyebrow={glossary.cta.eyebrow}
          points={glossary.cta.points}
          actions={glossary.cta.actions}
        />
      ) : null}
    </>
  );
}
