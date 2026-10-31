import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Button, Cluster, Icon, Layout, Media, Prose, Section } from '@/components';
import { getPodcastPage, type PodcastBlock, type PodcastImage } from '@/content';
import { podcastPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import {
  Breadcrumbs,
  Callout,
  Figure,
  PageHero,
  TableOfContents,
  type TocItem,
} from '@/patterns';
import { InsightResources } from '@/templates';

import { resourceItems } from '../../../_insights/resources';

type PodcastPageProps = { params: Promise<{ slug: string }> };

/* Figure's own `sizes` (Figure.tsx): the full content column, which over-fetches in the narrower
   article track rather than ever under-fetching. */
const BODY_IMAGE_SIZES = '(min-width: 1304px) 1240px, calc(100vw - 64px)';

function figureImage(image: PodcastImage) {
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

function renderPodcastBlock(block: PodcastBlock, podcastTitle: string) {
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
          {block.figures.map((figure, index) =>
            /* A body image with no authored caption renders bare, through Figure's own Media:
               a Figure's caption is required, and the words under an image are never invented. */
            figure.caption ? (
              <Figure
                key={`${block.id}-${figure.image.src}-${index}`}
                image={figureImage(figure.image)}
                caption={figure.caption}
              />
            ) : (
              <Media
                key={`${block.id}-${figure.image.src}-${index}`}
                image={figureImage(figure.image)}
                sizes={BODY_IMAGE_SIZES}
              />
            ),
          )}
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
              caption={block.title || block.description || `${podcastTitle} video`}
            />
          ) : null}
        </Layout>
      );

    case 'shadow-card':
      return (
        <Layout rowGap="block">
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}`}
              title={`${podcastTitle} video`}
              width="100%"
              height="698"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          ) : block.mediaUrl ? (
            <Cluster>
              <Button
                as="a"
                href={block.mediaUrl}
                emphasis="link"
                tone="primary"
                size="md"
                extendHitArea
                icon={<Icon name="arrow-right" />}
              >
                Watch the podcast
              </Button>
            </Cluster>
          ) : null}
          {block.descriptionHtml ? (
            block.emphasized ? (
              <Callout html={block.descriptionHtml} />
            ) : (
              <Prose html={block.descriptionHtml} />
            )
          ) : null}
          {block.action ? (
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
          ) : null}
        </Layout>
      );

    case 'callout':
      return <Callout html={block.html} />;

    case 'separator':
      return <Prose html={block.html} />;
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function dateOnly(date: string | undefined): string | undefined {
  return date?.slice(0, 10);
}

export async function generateMetadata({ params }: PodcastPageProps): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await getPodcastPage(slug);

  if (!podcast) {
    return {
      title: 'Podcast not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = podcast.seo?.title || podcast.title;
  const description = podcast.seo?.description || podcast.description;
  const canonical = podcast.seo?.canonical;
  const image = podcast.socialImage;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(podcast.seo?.robots ? { robots: podcast.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'article',
      ...(canonical ? { url: canonical } : {}),
      ...(podcast.publishedAt ? { publishedTime: podcast.publishedAt } : {}),
      images: image
        ? [
            {
              url: image.src,
              width: image.width,
              height: image.height,
              alt: image.alt,
            },
          ]
        : [],
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image.src] : [],
    },
  };
}

export default async function PodcastPage({ params }: PodcastPageProps) {
  const { slug } = await params;
  const podcast = await getPodcastPage(slug);

  if (!podcast) notFound();

  /* The outline the seam derived from this body's level-2 headings, mapped to what the component
     takes. A podcast page is a long-form document, which is what earns it a rail —
     page type decides, not heading count (docs/specs/TableOfContents.md § 1).

     The anchors are opaque and already on the rendered headings; see
     docs/guides/long-form-outline.md. */
  const outline: TocItem[] = podcast.outline.map((entry) => ({
    label: entry.label,
    href: `#${entry.anchorId}` as const,
  }));

  /* The component's own floor is two. Below it there is no rail AND no reserved track — a [1, 4]
     grid would otherwise squeeze the document into four-fifths of the content column for nothing. */
  const hasOutline = outline.length >= 2;

  const published = dateOnly(podcast.publishedAt);
  const heroMedia = podcast.heroVideo
    ? {
        type: 'youtube' as const,
        id: podcast.heroVideo.id,
        title: podcast.heroVideo.title,
      }
    : undefined;
  const labels = [...podcast.categories, ...podcast.tags];

  return (
    <>
      {podcast.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(podcast.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(
          [
            { label: 'Home', href: ROUTES.home },
            { label: 'Insights', href: ROUTES.insights },
            { label: 'Podcasts', href: ROUTES.podcasts },
            { label: podcast.title, href: podcastPath(podcast.slug) },
          ],
          podcast.title,
          (t) => (
            <Breadcrumbs {...t} />
          ),
        )}
        title={podcast.title}
        body={[podcast.description || `Listen to ${podcast.title}.`]}
        dates={published ? { published } : undefined}
        media={heroMedia}
        surface="paper"

        labels={labels}
      />

      {podcast.blocks.length > 0 ? (
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
              {podcast.blocks.map((block) => (
                <Fragment key={block.id}>{renderPodcastBlock(block, podcast.title)}</Fragment>
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {/* Other insights as the site's insight cards: cover, else the panel with its format's glyph
          (owner, 30 Oct 2026). Paper, so it never meets the tinted close. */}
      <InsightResources
        heading="Explore other resources"
        items={resourceItems(podcast.resources)}
      />
    </>
  );
}
