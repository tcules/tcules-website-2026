import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button, Cluster, Icon, Layout, Prose, Section } from '@/components';
import { getCaseStudyDetail } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { BlockCard, Figure, Proof, Statement, TableOfContents, type TocItem } from '@/patterns';
import {
  CaseStoryChapter,
  CaseStoryClosing,
  CaseStoryProse,
  CaseStoryQuote,
  CaseStoryStatements,
  CaseStorySteps,
  type CaseStoryPartProps,
} from '@/templates/CaseStory/CaseStory';
import { PublishedHero, PublishedSection } from '@/templates/CorpusPage/PublishedHome';

type CaseStudy = NonNullable<Awaited<ReturnType<typeof getCaseStudyDetail>>>;
type Block = CaseStudy['blocks'][number];
type Heading = Extract<Block, { type: 'heading' }>;
type Standalone = Extract<Block, { type: 'statement' | 'cta' }>;
type BodyBlock = Exclude<Block, Standalone>;
type BodyRun =
  | { type: 'article'; key: string; blocks: BodyBlock[] }
  | { type: 'chapter' | 'closing'; key: string; heading: Heading; blocks: BodyBlock[] }
  | Standalone;

function groupBody(blocks: readonly Block[]): BodyRun[] {
  const runs: BodyRun[] = [];
  for (const block of blocks) {
    if (block.type === 'statement' || block.type === 'cta') {
      runs.push(block);
      continue;
    }
    if (block.type === 'heading' && block.presentation !== 'section') {
      runs.push({ type: block.presentation, key: block.key, heading: block, blocks: [] });
      continue;
    }
    const last = runs.at(-1);
    if (last?.type === 'article' || (last && 'blocks' in last && block.type !== 'heading')) {
      last.blocks.push(block);
    } else {
      runs.push({ type: 'article', key: block.key, blocks: [block] });
    }
  }
  return runs;
}

function renderBlock(block: BodyBlock) {
  switch (block.type) {
    case 'heading':
      return (
        <Prose>
          <h2 id={block.id}>{block.heading}</h2>
        </Prose>
      );
    case 'prose':
      return <Prose html={block.html} />;
    case 'separator':
      return (
        <Prose>
          <hr />
        </Prose>
      );
    case 'figures':
      return (
        <Layout
          columns={block.figures.length > 1 ? { base: 1, md: 2 } : { base: 1 }}
          colGap={block.figures.length > 1 ? 'gutter' : undefined}
          rowGap="gutter"
        >
          {block.figures.map((figure) => (
            <Layout key={figure.id} id={figure.id} rowGap="text">
              <Figure image={figure.image} caption={figure.caption} note={figure.note} />
              {figure.label || figure.notes.length ? (
                <Prose>
                  {figure.label ? <p>{figure.label}</p> : null}
                  {figure.notes.length ? (
                    <ol>
                      {figure.notes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ol>
                  ) : null}
                </Prose>
              ) : null}
            </Layout>
          ))}
        </Layout>
      );
    case 'steps':
      return <CaseStorySteps part={block} />;
    case 'quote':
      return <CaseStoryQuote quote={block.quote} attribution={block.attribution} />;
    case 'testimonial':
      return <Proof arrangement="compact" quote={block.quote} />;
    case 'video':
      return (
        <Layout rowGap="block">
          {block.description ? <p>{block.description}</p> : null}
          {'video' in block && block.video ? (
            <video
              controls
              autoPlay={block.video.autoplay}
              muted={block.video.autoplay}
              loop={block.video.loop}
              playsInline
              poster={block.poster?.src}
              width={block.video.width}
              height={block.video.height}
              preload="metadata"
            >
              <source src={block.video.src} type={block.video.mime} />
            </video>
          ) : block.poster ? (
            <Figure image={block.poster} caption={block.poster.alt} />
          ) : null}
        </Layout>
      );
    case 'embed':
      return (
        <Layout rowGap="block">
          {block.description ? <p>{block.description}</p> : null}
          {block.url ? (
            <iframe
              src={block.url}
              title={block.description ?? new URL(block.url).hostname}
              width="100%"
              height={block.height ?? 720}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : block.thumbnail ? (
            <Figure image={block.thumbnail} caption={block.thumbnail.alt} />
          ) : null}
        </Layout>
      );
    case 'link':
      return (
        <Layout rowGap="tight">
          {block.link.description ? <p>{block.link.description}</p> : null}
          <Cluster>
            <Button
              as="a"
              href={block.link.href}
              emphasis="link"
              tone="primary"
              size="md"
              extendHitArea
              icon={<Icon name={block.link.icon ?? 'arrow-right'} />}
            >
              {block.link.label}
            </Button>
          </Cluster>
        </Layout>
      );
  }
}

function chapterPart(block: BodyBlock): CaseStoryPartProps {
  if (
    block.type === 'prose' ||
    block.type === 'quote' ||
    block.type === 'steps' ||
    block.type === 'figures'
  )
    return block;
  return { type: 'content', node: renderBlock(block) };
}

function CaseArticle({ blocks }: { blocks: readonly BodyBlock[] }) {
  const outline = blocks.flatMap<TocItem>((block) =>
    block.type === 'heading'
      ? [{ label: block.label, href: `#${block.id}` }]
      : block.type === 'prose'
        ? block.headings.map(({ label, anchorId }) => ({ label, href: `#${anchorId}` }))
        : [],
  );
  const hasOutline = outline.length >= 2;
  return (
    <Section as="div" surface="paper">
      <Layout
        columns={hasOutline ? { base: 1, lg: [1, 4] } : { base: 1 }}
        colGap="column"
        rowGap="stack"
        align="start"
      >
        {hasOutline ? <TableOfContents items={outline} /> : null}
        <Layout as="article" rowGap="stack">
          {blocks.map((block) => (
            <Fragment key={block.key}>{renderBlock(block)}</Fragment>
          ))}
        </Layout>
      </Layout>
    </Section>
  );
}

function CaseBody({ caseStudy }: { caseStudy: CaseStudy }) {
  let chapter = 0;
  return groupBody(caseStudy.blocks).map((run) => {
    switch (run.type) {
      case 'article':
        return <CaseArticle key={run.key} blocks={run.blocks} />;
      case 'chapter':
        chapter += 1;
        return (
          <CaseStoryChapter
            key={run.key}
            chapter={{
              id: run.heading.id,
              number: String(chapter).padStart(2, '0'),
              label: run.heading.chapterLabel,
              heading: run.heading.heading,
              parts: run.blocks.map(chapterPart),
            }}
          />
        );
      case 'closing':
        return (
          <CaseStoryClosing
            key={run.key}
            id={run.heading.id}
            label={run.heading.chapterLabel}
            heading={run.heading.heading}
          >
            {run.blocks.map((block) => (
              <Fragment key={block.key}>
                {block.type === 'prose' ? (
                  <CaseStoryProse html={block.html} closing />
                ) : (
                  renderBlock(block)
                )}
              </Fragment>
            ))}
          </CaseStoryClosing>
        );
      case 'statement':
        return (
          <Statement key={run.key} as="p" align="start" eyebrow={run.label} surface="tint">
            {run.body}
          </Statement>
        );
      case 'cta':
        return <PublishedSection key={run.key} section={run.section} route={caseStudy.path} />;
    }
  });
}

export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<'/case-studies/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  let caseStudy: CaseStudy | null;
  try {
    caseStudy = await getCaseStudyDetail(slug);
  } catch {
    return {
      title: 'Case study temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
  return (
    caseStudy?.seo.metadata ?? {
      title: 'Case study not found | Tcules',
      description: null,
      robots: { index: false, follow: false },
    }
  );
}

export default async function CaseStudyPage({ params }: PageProps<'/case-studies/[slug]'>) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyDetail(slug);
  if (!caseStudy) notFound();
  const { hero, details, seo, statements } = caseStudy;
  const hasChapters = caseStudy.blocks.some(
    (block) => block.type === 'heading' && block.presentation === 'chapter',
  );

  return (
    <>
      {seo.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(seo.structuredData) }}
        />
      ) : null}
      <PublishedHero hero={hero} details={details} />
      {hasChapters ? (
        <CaseStoryStatements statements={statements} />
      ) : statements.length ? (
        <Section surface="tint" aria-labelledby="case-study-statements-heading">
          <Layout rowGap="stack">
            <h2 id="case-study-statements-heading">Problem and solution</h2>
            <Layout
              as="ul"
              columns={statements.length > 1 ? { base: 1, md: 2 } : { base: 1 }}
              colGap="gutter"
              rowGap="column"
              equalRows
            >
              {statements.map((statement) => (
                <BlockCard key={statement.id} title={statement.title} body={statement.body} />
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}
      <CaseBody caseStudy={caseStudy} />
    </>
  );
}
