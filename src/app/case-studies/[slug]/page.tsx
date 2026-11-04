import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button, Cluster, Icon, Layout, Prose, Section } from '@/components';
import {
  getCaseStory,
  getCaseStudyPage,
  type CaseStudyBlock,
  type CaseStudyImage,
} from '@/content';
import { caseStudyPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import {
  BlockCard,
  Breadcrumbs,
  CtaSection,
  Figure,
  PageHero,
  Proof,
  TableOfContents,
  type TocItem,
} from '@/patterns';
import { CaseStory } from '@/templates';

function figureImage(image: CaseStudyImage) {
  return {
    src: image.src,
    alt: image.alt,
    width: image.width,
    height: image.height,
    /* The derived widths and the kind fields travel with the record so Figure's Media can serve
       a srcset and draw the edge by kind; `mime` is the one field left behind. */
    sources: image.sources,
    kind: image.kind,
    panel: image.panel,
    shadow: image.shadow,
  };
}

function renderCaseStudyBlock(block: CaseStudyBlock) {
  switch (block.type) {
    case 'prose':
      return <Prose html={block.html} />;

    case 'figures':
      return (
        <Layout
          columns={block.figures.length > 1 ? { base: 1, md: 2 } : { base: 1 }}
          colGap={block.figures.length > 1 ? 'gutter' : undefined}
          rowGap="gutter"
        >
          {block.figures.map((figure, index) => (
            <Figure
              key={`${block.id}-${figure.image.src}-${index}`}
              image={figureImage(figure.image)}
              caption={figure.caption}
            />
          ))}
        </Layout>
      );

    case 'video':
      return (
        <Layout rowGap="block">
          {block.title || block.description ? (
            <Layout rowGap="tight">
              {block.title ? <h2>{block.title}</h2> : null}
              {block.description ? <p>{block.description}</p> : null}
            </Layout>
          ) : null}
          {block.video ? (
            <video
              controls
              autoPlay={block.video.autoplay}
              muted={block.video.autoplay}
              loop={block.video.loop}
              playsInline
              poster={block.video.poster}
              width={block.video.width}
              height={block.video.height}
              preload="metadata"
            >
              <source src={block.video.src} type={block.video.mime} />
            </video>
          ) : block.thumbnail ? (
            <Figure
              image={figureImage(block.thumbnail)}
              caption={block.title || block.description || 'Case-study video'}
            />
          ) : null}
        </Layout>
      );

    case 'embed':
      return (
        <Layout rowGap="block">
          <Layout rowGap="tight">
            <h2>{block.title}</h2>
            {block.description ? <p>{block.description}</p> : null}
          </Layout>
          {block.url ? (
            <iframe
              src={block.url}
              title={block.title}
              width="100%"
              height={block.height ?? 720}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : block.thumbnail ? (
            <Figure image={figureImage(block.thumbnail)} caption={block.title} />
          ) : null}
        </Layout>
      );

    case 'code':
      return <Prose html={block.html} />;

    case 'separator':
      return <Prose html={block.html} />;

    case 'quote':
      return <Proof arrangement="compact" quote={block.quote} />;

    case 'link':
      return (
        <Layout rowGap="tight">
          {block.description ? <p>{block.description}</p> : null}
          <Cluster>
            <Button
              as="a"
              href={block.action.href}
              emphasis="link"
              tone="primary"
              size="md"
              extendHitArea
              icon={<Icon name="arrow-right" />}
            >
              {block.action.label}
            </Button>
          </Cluster>
        </Layout>
      );
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function dateOnly(date: string | undefined): string | undefined {
  return date?.slice(0, 10);
}

export async function generateMetadata({
  params,
}: PageProps<'/case-studies/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyPage(slug);

  if (!caseStudy) {
    return {
      title: 'Case study not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = caseStudy.seo?.title || caseStudy.title;
  const description = caseStudy.seo?.description || caseStudy.description;
  const canonical = caseStudy.seo?.canonical;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(caseStudy.seo?.robots ? { robots: caseStudy.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'article',
      ...(canonical ? { url: canonical } : {}),
      ...(caseStudy.publishedAt ? { publishedTime: caseStudy.publishedAt } : {}),
      ...(caseStudy.updatedAt ? { modifiedTime: caseStudy.updatedAt } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps<'/case-studies/[slug]'>) {
  const { slug } = await params;

  /* A case with an ideal local copy renders as a designed story (fixtures/ideal/case-studies); every
     other case renders the CMS body as it stands. */
  const story = await getCaseStory(slug);
  if (story) {
    return (
      <CaseStory
        story={story}
        trail={heroTrail(
          [
            { label: 'Home', href: ROUTES.home },
            { label: 'Case studies', href: ROUTES.caseStudies },
            { label: story.title, href: caseStudyPath(story.slug) },
          ],
          story.title,
          (t) => (
            <Breadcrumbs {...t} />
          ),
        )}
      />
    );
  }

  const caseStudy = await getCaseStudyPage(slug);
  if (!caseStudy) notFound();

  /* The outline the seam derived from this body's level-2 headings, mapped to what the component
     takes. A case study is a long-form document, which is what earns it a rail —
     page type decides, not heading count (docs/specs/TableOfContents.md § 1).

     The anchors are opaque and already on the rendered headings; see
     docs/guides/long-form-outline.md. */
  const outline: TocItem[] = caseStudy.outline.map((entry) => ({
    label: entry.label,
    href: `#${entry.anchorId}` as const,
  }));

  /* The component's own floor is two. Below it there is no rail AND no reserved track — a [1, 4]
     grid would otherwise squeeze the document into four-fifths of the content column for nothing. */
  const hasOutline = outline.length >= 2;

  const published = dateOnly(caseStudy.publishedAt);
  const updated = dateOnly(caseStudy.updatedAt);
  const heroMedia = caseStudy.heroImage
    ? { type: 'image' as const, image: caseStudy.heroImage }
    : undefined;

  return (
    <>
      {caseStudy.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(caseStudy.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(
          [
            { label: 'Home', href: ROUTES.home },
            { label: 'Case studies', href: ROUTES.caseStudies },
            { label: caseStudy.title, href: caseStudyPath(caseStudy.slug) },
          ],
          caseStudy.title,
          (t) => (
            <Breadcrumbs {...t} />
          ),
        )}
        title={caseStudy.title}
        body={[caseStudy.description]}
        dates={
          published
            ? { published, ...(updated !== published && updated ? { modified: updated } : {}) }
            : undefined
        }
        media={heroMedia}
        surface="paper"
        facts={caseStudy.profile.map((item) => ({
          id: item.id,
          label: item.label,
          value: item.value,
        }))}
        labels={[...caseStudy.categories, ...caseStudy.tags]}
      />

      {caseStudy.statements.length > 0 ? (
        <Section surface="tint" aria-labelledby="case-study-statements-heading">
          <Layout rowGap="stack">
            <h2 id="case-study-statements-heading">Problem and solution</h2>
            <Layout
              as="ul"
              columns={caseStudy.statements.length > 1 ? { base: 1, md: 2 } : { base: 1 }}
              colGap="gutter"
              rowGap="column"
              equalRows
            >
              {caseStudy.statements.map((statement) => (
                <BlockCard key={statement.id} title={statement.title} body={statement.body} />
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {caseStudy.blocks.length > 0 ? (
        <Section as="div" surface="paper">
          {/* The shell from docs/specs/TableOfContents.md § 10. The rail is a TRACK, not a band, so it
              sits inside this Section — which is what makes the two arrangements one piece of markup:
              below 1024 the columns collapse and the first track becomes the first block of the
              Section, nothing moved in the DOM. `align="start"` is required, not stylistic: a
              stretched grid item fills the row and has nowhere to stick. The <article> stays around
              the document — the outline is about the article, not part of it. */}
          <Layout
            columns={hasOutline ? { base: 1, lg: [1, 4] } : { base: 1 }}
            colGap="column"
            rowGap="stack"
            align="start"
          >
            {hasOutline ? <TableOfContents items={outline} /> : null}
            <Layout as="article" rowGap="stack">
              {caseStudy.blocks.map((block) => (
                <Fragment key={block.id}>{renderCaseStudyBlock(block)}</Fragment>
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {caseStudy.cta ? (
        <CtaSection
          arrangement="open"
          heading={caseStudy.cta.heading}
          body={caseStudy.cta.body}
          actions={caseStudy.cta.actions}
        />
      ) : null}
    </>
  );
}
