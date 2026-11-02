import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Layout, Section } from '@/components';
import { getBlogPage, type BlogPage } from '@/content';
import { authorPath, blogPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import {
  Breadcrumbs,
  Contributors,
  CtaSection,
  PageHero,
  TableOfContents,
  type HeroCredit,
  type HeroPerson,
  type TocItem,
} from '@/patterns';
import type { BreadcrumbItem } from '@/patterns';
import { InsightResources } from '@/templates';

import { resourceItems } from '../../_insights/resources';
import { renderResourceBlock } from '../../_insights/body';

type BlogPageProps = { params: Promise<{ slug: string[] }> };

function requestedSlug(slug: readonly string[]): string {
  return slug
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

/** The format a piece sits under, as the podcast and event pages name theirs: Home / Insights / Articles. */
const FORMAT_CRUMB: Record<BlogPage['kind'], BreadcrumbItem> = {
  article: { label: 'Articles', href: ROUTES.articles },
  guide: { label: 'Guides', href: ROUTES.guides },
  research: { label: 'Research', href: ROUTES.research },
  event: { label: 'Events', href: ROUTES.events },
  podcast: { label: 'Podcasts', href: ROUTES.podcasts },
  interview: { label: 'Interviews', href: ROUTES.interviews },
  video: { label: 'Videos', href: ROUTES.videos },
};

function blogBreadcrumbs(blog: BlogPage): BreadcrumbItem[] {
  return [
    { label: 'Home', href: ROUTES.home },
    { label: 'Insights', href: ROUTES.insights },
    FORMAT_CRUMB[blog.kind],
    { label: blog.title, href: blogPath(blog.slug) },
  ];
}

function uniqueLabels(labels: readonly string[]): string[] {
  return [...new Set(labels.map((label) => label.trim()).filter(Boolean))];
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogPage(requestedSlug(slug));

  if (!blog) {
    return {
      title: 'Insight not found | Tcules',
      robots: { index: false, follow: false },
    };
  }

  const title = blog.seo?.title || blog.title;
  const description = blog.seo?.description || blog.description;
  const canonical = blog.seo?.canonical;
  const image = blog.socialImage;

  return {
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(blog.seo?.robots ? { robots: blog.seo.robots } : {}),
    openGraph: {
      title,
      description,
      type: 'article',
      ...(canonical ? { url: canonical } : {}),
      ...(blog.publishedContent ? { publishedTime: blog.publishedContent } : {}),
      ...(blog.updatedAt ? { modifiedTime: blog.updatedAt } : {}),
      ...(blog.authors.length > 0
        ? { authors: blog.authors.map((author) => author.name) }
        : {}),
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

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const blog = await getBlogPage(requestedSlug(slug));

  if (!blog) notFound();

  /* The outline the seam derived from this body's level-2 headings, mapped to what the component
     takes. An article is a long-form document, which is what earns it a rail —
     page type decides, not heading count (docs/specs/TableOfContents.md § 1).

     The anchors are opaque and already on the rendered headings; see
     docs/guides/long-form-outline.md. */
  const outline: TocItem[] = blog.outline.map((entry) => ({
    label: entry.label,
    href: `#${entry.anchorId}` as const,
  }));

  /* The component's own floor is two. Below it there is no rail AND no reserved track — a [1, 4]
     grid would otherwise squeeze the document into four-fifths of the content column for nothing. */
  const hasOutline = outline.length >= 2;

  /* The native CMS has separate authored publication and last-updated dates. */
  const published = blog.publishedContent;
  const authors: HeroPerson[] = blog.authors.map((author) => ({
    name: author.name,
    ...(author.slug ? { href: authorPath(author.slug) } : {}),
    ...(author.image ? { portrait: author.image } : {}),
  }));
  const credits: HeroCredit[] | undefined = authors[0]
    ? [{ role: 'author', people: authors as [HeroPerson, ...HeroPerson[]] }]
    : undefined;
  const heroMedia = blog.heroVideo
    ? {
        type: 'youtube' as const,
        id: blog.heroVideo.id,
        title: blog.heroVideo.title,
      }
    : blog.featureImage
      ? { type: 'image' as const, image: blog.featureImage }
      : undefined;
  const labels = uniqueLabels([...blog.categories, ...blog.tags]);

  return (
    <>
      {blog.seo?.structuredData ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup(blog.seo.structuredData) }}
        />
      ) : null}

      <PageHero
        trail={heroTrail(blogBreadcrumbs(blog), blog.title, (t) => (
          <Breadcrumbs {...t} />
        ))}
        title={blog.title}
        body={[blog.description || `Read ${blog.title}.`]}
        credits={credits}
        readingTime={blog.readingTime}
        dates={
          published
            ? { published, ...(blog.updatedAt ? { modified: blog.updatedAt } : {}) }
            : undefined
        }
        media={heroMedia}
        arrangement={heroMedia?.type === 'youtube' ? 'watch' : undefined}
        surface="paper"

        labels={labels}
      />

      {blog.blocks.length > 0 ? (
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
              {blog.blocks.map((block) => (
                <Fragment key={block.id}>{renderResourceBlock(block, blog.title)}</Fragment>
              ))}
              {/* Who wrote it, after what they wrote (byline board G): the hero carries their faces
                  and names, this says who each is and links to the rest of what they wrote. */}
              <Contributors
                label={blog.authors.length > 1 ? 'About the authors' : 'About the author'}
                people={blog.authors.map((author) => ({
                  name: author.name,
                  ...(author.designation ? { role: author.designation } : {}),
                  ...(author.image ? { portrait: author.image } : {}),
                  ...(author.slug
                    ? {
                        link: {
                          label: `More from ${author.name.trim().split(/\s+/)[0]}`,
                          href: authorPath(author.slug),
                        },
                      }
                    : {}),
                }))}
              />
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {/* Other insights as the site's insight cards: cover, else the panel with its format's glyph
          (owner, 30 Oct 2026). Paper, so it never meets the tinted close. */}
      <InsightResources
        heading={blog.resourcesHeading || 'Explore other resources'}
        items={resourceItems(blog.resources)}
      />

      {blog.cta ? (
        <CtaSection
          arrangement="open"
          heading={blog.cta.heading}
          body={blog.cta.body}
          actions={blog.cta.actions}
        />
      ) : null}
    </>
  );
}
