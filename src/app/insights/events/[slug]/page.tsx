import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Cluster, Layout, Section, Tag } from '@/components';
import { getEventPage } from '@/content';
import { eventPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, PageHero, TableOfContents, type TocItem } from '@/patterns';
import { InsightResources } from '@/templates';

import { resourceItems } from '../../../_insights/resources';
import { renderResourceBlock } from '../../../_insights/body';

type EventPageProps = { params: Promise<{ slug: string }> };

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

function dateOnly(date: string | undefined): string | undefined {
  return date?.slice(0, 10);
}

function uniqueLabels(labels: readonly string[]): string[] {
  return [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventPage(slug);

  if (!event) {
    return {
      title: 'Event not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = event.seo?.title || event.title;
  const description = event.seo?.description || event.description;
  const canonical = event.seo?.canonical;
  const image = event.socialImage;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(event.seo?.robots ? { robots: event.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'article',
      ...(canonical ? { url: canonical } : {}),
      ...(event.publishedContent ? { publishedTime: event.publishedContent } : {}),
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

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventPage(slug);

  if (!event) notFound();

  /* The outline the seam derived from this body's level-2 headings, mapped to what the component
     takes. An event page is a long-form document, which is what earns it a rail —
     page type decides, not heading count (docs/specs/TableOfContents.md § 1).

     The anchors are opaque and already on the rendered headings; see
     docs/guides/long-form-outline.md. */
  const outline: TocItem[] = event.outline.map((entry) => ({
    label: entry.label,
    href: `#${entry.anchorId}` as const,
  }));

  /* The component's own floor is two. Below it there is no rail AND no reserved track — a [1, 4]
     grid would otherwise squeeze the document into four-fifths of the content column for nothing. */
  const hasOutline = outline.length >= 2;

  const published = dateOnly(event.publishedContent);
  const labels = uniqueLabels([...event.categories, ...event.tags]);
  const hasHeroDetails = event.details.length > 0 || labels.length > 0;
  const heroMedia = event.featureImage
    ? { type: 'image' as const, image: event.featureImage }
    : undefined;

  return (
    <>
      {event.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(event.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(
          [
            { label: 'Home', href: ROUTES.home },
            { label: 'Insights', href: ROUTES.insights },
            { label: 'Events', href: ROUTES.events },
            { label: event.title, href: eventPath(event.slug) },
          ],
          event.title,
          (t) => (
            <Breadcrumbs {...t} />
          ),
        )}
        title={event.title}
        body={[event.description || `Explore ${event.title}.`]}
        dates={
          published
            ? { published, ...(event.updatedAt ? { modified: event.updatedAt } : {}) }
            : undefined
        }
        media={heroMedia}
        surface="paper"
      >
        {hasHeroDetails ? (
          <Layout rowGap="stack">
            {event.details.length > 0 ? (
              <Layout rowGap="block">
                <h3>Event details</h3>
                <Layout
                  as="dl"
                  columns={event.details.length > 1 ? { base: 1, md: 2 } : { base: 1 }}
                  colGap="gutter"
                  rowGap="block"
                >
                  {event.details.map((detail) => (
                    <Layout as="div" key={detail.id} rowGap="tight">
                      {detail.location ? (
                        <Fragment>
                          <dt>Where</dt>
                          <dd>{detail.location}</dd>
                        </Fragment>
                      ) : null}
                      {detail.date ? (
                        <Fragment>
                          <dt>When</dt>
                          <dd>{detail.date}</dd>
                        </Fragment>
                      ) : null}
                    </Layout>
                  ))}
                </Layout>
              </Layout>
            ) : null}

            {labels.length > 0 ? (
              <Cluster as="ul" colGap="text" rowGap="tight">
                {labels.map((label) => (
                  <li key={label}>
                    <Tag>{label}</Tag>
                  </li>
                ))}
              </Cluster>
            ) : null}
          </Layout>
        ) : null}
      </PageHero>

      {event.blocks.length > 0 ? (
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
              {event.blocks.map((block) => (
                <Fragment key={block.id}>{renderResourceBlock(block, event.title)}</Fragment>
              ))}
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {/* Other insights as the site's insight cards: cover, else the panel with its format's glyph
          (owner, 30 Oct 2026). Paper, so it never meets the tinted close. */}
      <InsightResources
        heading={event.resourcesHeading || 'Explore other resources'}
        items={resourceItems(event.resources)}
      />
    </>
  );
}
