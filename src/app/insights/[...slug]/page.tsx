import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Icon, Layout, Media, Prose, Section } from '@/components';
import { getResourceDetail } from '@/content';
import { jsonLdMarkup } from '@/lib/json-ld';
import { heroTrail } from '@/lib/trail';
import {
  Accordion,
  Breadcrumbs,
  Callout,
  Contributors,
  DataTable,
  Figure,
  PageHero,
  TableOfContents,
  type HeroCredit,
  type HeroPerson,
  type TocItem,
} from '@/patterns';
import { InsightResources } from '@/templates';
import { PublishedSection } from '@/templates/CorpusPage/PublishedHome';

type Resource = NonNullable<Awaited<ReturnType<typeof getResourceDetail>>>;
type Block = Resource['blocks'][number];
type ResourcePageProps = { params: Promise<{ slug: string[] }> };
const BODY_IMAGE_SIZES = '(min-width: 1304px) 1240px, calc(100vw - 64px)';

function renderBlock(block: Block) {
  switch (block.type) {
    case 'heading':
    case 'prose':
      return <Prose html={block.html} />;
    case 'callout':
      return (
        <Callout
          html={block.html}
          label={block.label}
          icon={block.icon ? <Icon name={block.icon} /> : undefined}
        />
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
              {figure.caption ? (
                <Figure image={figure.image} caption={figure.caption} note={figure.note} />
              ) : (
                <>
                  {figure.image ? (
                    <Media image={figure.image} sizes={BODY_IMAGE_SIZES} />
                  ) : null}
                  {figure.note ? (
                    <Prose>
                      <p>{figure.note}</p>
                    </Prose>
                  ) : null}
                </>
              )}
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
    case 'table':
      return <DataTable {...block} />;
    case 'faq':
      return (
        <Layout id={block.id} rowGap="block">
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.description ? <p>{block.description}</p> : null}
          {block.items.length ? <Accordion items={block.items} /> : null}
        </Layout>
      );
  }
}

export const revalidate = 300;

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const resource = await getResourceDetail(slug.join('/'));
    return (
      resource?.seo.metadata ?? {
        title: 'Resource not found | Tcules',
        description: null,
        robots: { index: false, follow: false },
      }
    );
  } catch {
    return {
      title: 'Resource temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const resource = await getResourceDetail(slug.join('/'));
  if (!resource) notFound();
  const outline: TocItem[] = resource.outline.map(({ label, anchorId }) => ({
    label,
    href: `#${anchorId}`,
  }));
  const hasOutline = outline.length >= 2;
  const people: HeroPerson[] = resource.authors.map(({ name, href, portrait }) => ({
    name,
    href,
    portrait,
  }));
  const credits: HeroCredit[] | undefined = people[0]
    ? [{ role: 'author', people: people as [HeroPerson, ...HeroPerson[]] }]
    : undefined;
  const heroMedia =
    resource.heroVideo ??
    (resource.bannerImage
      ? { type: 'image' as const, image: resource.bannerImage }
      : undefined);

  return (
    <>
      {resource.seo.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(resource.seo.structuredData) }}
        />
      ) : null}
      <PageHero
        trail={
          resource.breadcrumbs.length
            ? heroTrail(resource.breadcrumbs, resource.title, (trail) => (
                <Breadcrumbs {...trail} />
              ))
            : undefined
        }
        title={resource.title}
        eyebrow={resource.eyebrow}
        body={resource.body}
        credits={credits}
        readingTime={resource.readingTime}
        dates={resource.dates}
        media={heroMedia}
        arrangement={heroMedia?.type === 'youtube' ? 'watch' : undefined}
        labels={resource.labels}
        surface="paper"
      >
        {resource.bylineText ? (
          <Prose>
            <p>{resource.bylineText}</p>
          </Prose>
        ) : null}
      </PageHero>
      {resource.blocks.length || resource.authors.length || resource.takeaways ? (
        <Section as="div" surface="paper">
          <Layout
            columns={hasOutline ? { base: 1, lg: [1, 4] } : { base: 1 }}
            colGap="column"
            rowGap="stack"
            align="start"
          >
            {hasOutline ? <TableOfContents items={outline} /> : null}
            <Layout as="article" rowGap="stack">
              {resource.takeaways ? (
                <Callout label={resource.takeaways.label} html={resource.takeaways.html} />
              ) : null}
              {resource.blocks.map((block) => (
                <Fragment key={block.key}>{renderBlock(block)}</Fragment>
              ))}
              <Contributors
                label={resource.authors.length > 1 ? 'About the authors' : 'About the author'}
                people={resource.authors.map((author) => ({
                  name: author.name,
                  role: author.role,
                  portrait: author.portrait,
                  descriptionHtml: author.descriptionHtml,
                  socialLinks: author.linkedIn
                    ? [{ label: 'LinkedIn', href: author.linkedIn }]
                    : undefined,
                  link: author.href
                    ? {
                        label: `More from ${author.name.trim().split(/\s+/)[0]}`,
                        href: author.href,
                      }
                    : undefined,
                }))}
              />
            </Layout>
          </Layout>
        </Section>
      ) : null}
      {resource.related?.heading ? (
        <InsightResources {...resource.related} heading={resource.related.heading} />
      ) : null}
      {resource.cta ? <PublishedSection section={resource.cta} route={resource.path} /> : null}
    </>
  );
}
