import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AnchorHeading, Icon, Layout, Media, Prose } from '@/components';
import { getResourceDetail } from '@/content';
import { withBreadcrumbList } from '@/lib/breadcrumb-json-ld';
import { jsonLdMarkup } from '@/lib/json-ld';
import { resourceSceneFor } from '@/lib/sketches';
import { heroTrail } from '@/lib/trail';
import {
  Accordion,
  Breadcrumbs,
  Callout,
  Contributors,
  DataTable,
  Figure,
  PageHero,
  type HeroCredit,
  type HeroMedia,
  type HeroPerson,
  type TocItem,
} from '@/patterns';
import { InsightResources, ResourceArticle, type ArticleItem } from '@/templates';
import { PublishedSection } from '@/templates/CorpusPage/PublishedHome';

import { withShareImage } from '@/app/_og';

type Resource = NonNullable<Awaited<ReturnType<typeof getResourceDetail>>>;
type Block = Resource['blocks'][number];
const BODY_IMAGE_SIZES = '(min-width: 1304px) 1240px, calc(100vw - 64px)';

/* Running words cap at the reading measure; figures, tables and callouts keep the whole track. */
const measureOf = (block: Block): ArticleItem['measure'] =>
  block.type === 'heading' || block.type === 'prose' || block.type === 'faq' ? 'text' : 'block';

function renderBlock(block: Block) {
  switch (block.type) {
    case 'heading':
      return (
        <Prose>
          <AnchorHeading id={block.id}>{block.heading}</AnchorHeading>
        </Prose>
      );
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
              {/* The label ("Figure 7") is read with the caption, inside the <figcaption>; a figure
                  with a label and no caption takes the label as its caption. */}
              {figure.caption || figure.label ? (
                <Figure
                  image={figure.image}
                  caption={figure.caption ?? figure.label ?? ''}
                  label={figure.caption ? figure.label : undefined}
                  note={figure.note}
                />
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
              {figure.notes.length ? (
                <Prose>
                  <ol>
                    {figure.notes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ol>
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

export async function resourceMetadata(slug: string): Promise<Metadata> {
  try {
    const resource = await getResourceDetail(slug);
    if (resource) {
      if (resource.kind === 'event' || resource.kind === 'podcast')
        return resource.seo.metadata;
      return await withShareImage(resource.seo.metadata, resource.path);
    }
    return {
      title: 'Resource not found | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  } catch {
    return {
      title: 'Resource temporarily unavailable | Tcules',
      description: null,
      robots: { index: false, follow: false },
    };
  }
}

export async function renderResourcePage(slug: string) {
  const resource = await getResourceDetail(slug);
  if (!resource) notFound();
  const outline: TocItem[] = resource.outline.map(({ label, anchorId }) => ({
    label,
    href: `#${anchorId}`,
  }));
  /* One summary per piece, never two boxes. Strapi carries it in two places: a callout that opens
     the body (the "Insights" box) and the key-takeaways list. Whichever exist meet in one panel,
     the paragraph before the list, keyed by the callout's label, else the list's. */
  const opening = resource.blocks[0]?.type === 'callout' ? resource.blocks[0] : undefined;
  const bodyBlocks = opening ? resource.blocks.slice(1) : resource.blocks;
  const summaryHtml = [opening?.html, resource.takeaways?.html].filter(Boolean).join('');
  const summary = summaryHtml
    ? { label: opening?.label || resource.takeaways?.label, html: summaryHtml }
    : undefined;
  const people: HeroPerson[] = resource.authors.map(({ name, href, portrait }) => ({
    name,
    href,
    portrait,
  }));
  const credits: HeroCredit[] | undefined = people[0]
    ? [{ role: 'author', people: people as [HeroPerson, ...HeroPerson[]] }]
    : undefined;
  /* A drawn insight (a guide or an article the site draws a thumbnail for) shows that same drawing in
     its hero, still at its end state, so the page matches the card that led to it (owner, 19 Nov 2026).
     One map (`resourceSceneFor`, @/lib/sketches) serves the card and the hero. A video still leads. */
  const drawn = resourceSceneFor(resource.path);
  const heroMedia: HeroMedia | undefined =
    resource.heroVideo ??
    (drawn
      ? { type: 'sketch', name: drawn }
      : resource.bannerImage
        ? { type: 'image' as const, image: resource.bannerImage }
        : undefined);

  const { event } = resource;
  const eventDate = event?.startsAt ? new Date(event.startsAt) : undefined;

  return (
    <>
      {/* The entry's graph, its BreadcrumbList rebuilt from the same trail the hero shows. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdMarkup(
            withBreadcrumbList(resource.seo.structuredData, resource.breadcrumbs),
          ),
        }}
      />
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
        /* A drawing sits beside the copy, as a tool page's does (LongformPage); a video is watched. */
        arrangement={
          heroMedia?.type === 'youtube'
            ? 'watch'
            : heroMedia?.type === 'sketch'
              ? 'beside'
              : undefined
        }
        labels={resource.labels}
        surface="paper"
      >
        {event ? (
          <Layout rowGap="block">
            <h3>Event details</h3>
            <Layout
              as="dl"
              columns={event.place && eventDate ? { base: 1, md: 2 } : { base: 1 }}
              colGap="gutter"
              rowGap="block"
            >
              {event.place ? (
                <Layout as="div" rowGap="tight">
                  <dt>Where</dt>
                  <dd>{event.place}</dd>
                </Layout>
              ) : null}
              {eventDate && event.startsAt ? (
                <Layout as="div" rowGap="tight">
                  <dt>When</dt>
                  <dd>
                    <time dateTime={event.startsAt}>
                      {new Intl.DateTimeFormat('en-GB', {
                        dateStyle: 'long',
                        timeZone: 'UTC',
                      }).format(eventDate)}
                    </time>
                  </dd>
                </Layout>
              ) : null}
            </Layout>
          </Layout>
        ) : null}
        {resource.bylineText ? (
          <Prose>
            <p>{resource.bylineText}</p>
          </Prose>
        ) : null}
      </PageHero>
      {resource.blocks.length || resource.authors.length || resource.takeaways ? (
        <ResourceArticle
          outline={outline}
          items={[
            ...(summary
              ? [
                  {
                    key: 'summary',
                    measure: 'block' as const,
                    node: <Callout tone="summary" label={summary.label} html={summary.html} />,
                  },
                ]
              : []),
            ...bodyBlocks.map((block) => ({
              key: block.key,
              measure: measureOf(block),
              node: renderBlock(block),
            })),
            {
              key: 'contributors',
              measure: 'block' as const,
              node: (
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
              ),
            },
          ]}
        />
      ) : null}
      {/* The ask straight after the article, the further reading last and on tint (owner, 2 Nov 2026;
          decisions/2026-11-02-insight-ask-before-further-reading). */}
      {resource.cta ? <PublishedSection section={resource.cta} route={resource.path} /> : null}
      {resource.related?.heading ? (
        <InsightResources
          {...resource.related}
          heading={resource.related.heading}
          surface="tint"
        />
      ) : null}
    </>
  );
}
