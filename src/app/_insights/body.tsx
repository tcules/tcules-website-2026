import type { PodcastBlock, BlogImage } from '@/content';
import { Button, Cluster, Icon, Layout, Media, Prose } from '@/components';
import { Callout, DataTable, Figure } from '@/patterns';

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

export function renderResourceBlock(block: PodcastBlock, blogTitle: string) {
  switch (block.type) {
    case 'shadow-card':
      return (
        <Layout rowGap="block">
          {block.heading ? <h2>{block.heading}</h2> : null}
          {block.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${block.youtubeId}`}
              title={`${blogTitle} video`}
              width="100%"
              height="698"
              loading="lazy"
              allowFullScreen
            />
          ) : null}
          {block.descriptionHtml ? (
            block.emphasized ? (
              <Callout html={block.descriptionHtml} />
            ) : (
              <Prose html={block.descriptionHtml} />
            )
          ) : null}
          {block.action || block.mediaUrl ? (
            <Cluster>
              <Button
                as="a"
                href={block.action?.href || block.mediaUrl || '#'}
                emphasis="link"
                tone="primary"
                size="md"
                icon={<Icon name="arrow-right" />}
              >
                {block.action?.label || 'View media'}
              </Button>
            </Cluster>
          ) : null}
        </Layout>
      );
    case 'heading':
      return (
        <Layout rowGap="tight">
          {block.eyebrow ? <p>{block.eyebrow}</p> : null}
          <h2 id={block.anchorId}>{block.heading}</h2>
        </Layout>
      );
    case 'table':
      return <DataTable {...block.table} />;
    case 'prose':
    case 'code':
    case 'separator':
      return <Prose html={block.html} />;

    case 'callout':
      return <Callout html={block.html} />;

    case 'figures':
      return (
        <Layout
          columns={{ base: 1, md: block.columns || (block.figures.length > 1 ? 2 : 1) }}
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
          {block.diagram ? (
            <Media image={block.diagram} sizes={BODY_IMAGE_SIZES} />
          ) : block.url ? (
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
