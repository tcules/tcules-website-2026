import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Layout, Media, Prose, Section } from '@/components';
import {
  LongformRoute,
  isCorpusLongform,
  longformMetadata,
  longformSlugs,
} from '@/app/_corpus/longform';
import { getBlogPage, type BlogBlock, type BlogImage, type BlogPage } from '@/content';
import { blogPath, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import {
  Breadcrumbs,
  Callout,
  Contributors,
  CtaSection,
  Figure,
  PageHero,
  TableOfContents,
  type HeroCredit,
  type HeroPerson,
  type TocItem,
} from '@/patterns';
import type { BreadcrumbItem } from '@/patterns';
import { InsightResources } from '@/templates';

import { resourceItems } from '../../_insights/resources';

type BlogPageProps = { params: Promise<{ slug: string[] }> };

function requestedSlug(slug: readonly string[]): string {
  return slug
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

/* Figure's own `sizes` (Figure.tsx): the full content column, which over-fetches in the narrower
   article track rather than ever under-fetching. */
const BODY_IMAGE_SIZES = '(min-width: 1304px) 1240px, calc(100vw - 64px)';

function figureImage(image: BlogImage) {
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

function renderBlogBlock(block: BlogBlock, blogTitle: string) {
  switch (block.type) {
    case 'prose':
    case 'code':
    case 'separator':
      return <Prose html={block.html} />;

    case 'callout':
      return <Callout html={block.html} />;

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
          {block.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}`}
              title={block.title || `${blogTitle} video`}
              width="100%"
              height="698"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          ) : block.video ? (
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
              caption={block.title || block.description || `${blogTitle} video`}
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
              width={block.width ?? '100%'}
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
  }
}

function jsonLdMarkup(data: Record<string, unknown> | unknown[]): string {
  return JSON.stringify(data).replaceAll('<', '\\u003c');
}

/** The format a piece sits under, as the podcast and event pages name theirs: Home / Insights / Articles. */
const FORMAT_CRUMB: Record<BlogPage['kind'], BreadcrumbItem> = {
  article: { label: 'Articles', href: ROUTES.articles },
  guide: { label: 'Guides', href: ROUTES.guides },
  research: { label: 'Research', href: ROUTES.research },
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

export function generateStaticParams() {
  return longformSlugs('/insights').map((slug) => ({ slug: slug.split('/') }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const corpus = await longformMetadata(`/insights/${requestedSlug(slug)}`);
  if (corpus) return corpus;
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
  if (isCorpusLongform(`/insights/${requestedSlug(slug)}`))
    return <LongformRoute route={`/insights/${requestedSlug(slug)}`} />;
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

  /* The authored date only. Strapi's publishedAt and updatedAt are the CMS's last publish and save
     (every live article re-published 28–30 Oct 2026), so neither is shown as the piece's date, and
     there is no "Updated" until the CMS carries an authored one. */
  const published = blog.publishedContent;
  const authors: HeroPerson[] = blog.authors.map((author) => ({
    name: author.name,
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
        dates={published ? { published } : undefined}
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
                <Fragment key={block.id}>{renderBlogBlock(block, blog.title)}</Fragment>
              ))}
              {/* Who wrote it, after what they wrote (byline board G): the hero carries their faces
                  and names, this says who each is. No link until author pages have routes. */}
              <Contributors
                label={blog.authors.length > 1 ? 'About the authors' : 'About the author'}
                people={blog.authors.map((author) => ({
                  name: author.name,
                  ...(author.designation ? { role: author.designation } : {}),
                  ...(author.image ? { portrait: author.image } : {}),
                }))}
              />
            </Layout>
          </Layout>
        </Section>
      ) : null}

      {/* Other insights as the site's insight cards: cover, else the panel with its format's glyph
          (owner, 30 Oct 2026). Paper, so it never meets the tinted close. */}
      <InsightResources
        heading="Explore other resources"
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
