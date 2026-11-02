import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Layout, Section } from '@/components';
import { getPodcastPage } from '@/content';
import { podcastPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, PageHero, TableOfContents, type TocItem } from '@/patterns';
import { InsightResources } from '@/templates';

import { resourceItems } from '../../../_insights/resources';
import { renderResourceBlock } from '../../../_insights/body';

type PodcastPageProps = { params: Promise<{ slug: string }> };

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
      ...(podcast.publishedContent ? { publishedTime: podcast.publishedContent } : {}),
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

  const published = dateOnly(podcast.publishedContent);
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
        dates={
          published
            ? { published, ...(podcast.updatedAt ? { modified: podcast.updatedAt } : {}) }
            : undefined
        }
        media={heroMedia}
        arrangement={heroMedia ? 'watch' : undefined}
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
                <Fragment key={block.id}>{renderResourceBlock(block, podcast.title)}</Fragment>
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {/* Other insights as the site's insight cards: cover, else the panel with its format's glyph
          (owner, 30 Oct 2026). Paper, so it never meets the tinted close. */}
      <InsightResources
        heading={podcast.resourcesHeading || 'Explore other resources'}
        items={resourceItems(podcast.resources)}
      />
    </>
  );
}
