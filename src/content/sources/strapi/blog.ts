import type {
  BlogAction,
  BlogBlock,
  BlogContentSource,
  BlogImage,
  BlogPage,
  BlogResource,
  ContentSeo,
  PageOutlineEntry,
} from '../../types';
import { mapUploadImage } from './image';
import { COVER_SCENES } from '../cover-scenes';
import { teamPortrait } from '../people';
import { blogKind } from './insights';
import { BLOG_BY_SLUG_QUERY } from './blog-query';
import type {
  StrapiBlog,
  StrapiBlogBlock,
  StrapiBlogFile,
  StrapiBlogLink,
  StrapiBlogResource,
  StrapiBlogResponse,
  StrapiBlogSeo,
} from './blog-types';
import { markdownToHtml, resolveInPageAnchors, type BodyHeading } from './markdown';
import { authoredDate, publishedLine } from './published-line';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';

const DEFAULT_STRAPI_GRAPHQL_URL = 'https://tcules-server-production.up.railway.app/graphql';
const BLOG_REVALIDATE_SECONDS = 300;
const BLOG_RESOURCE_LIMIT = 3;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function getStrapiGraphqlUrl(): string {
  return value(process.env.STRAPI_GRAPHQL_URL) || DEFAULT_STRAPI_GRAPHQL_URL;
}

function normaliseSlug(candidate: string | null | undefined): string {
  return value(candidate)
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');
}

function absoluteUrl(
  candidate: string | null | undefined,
  baseUrl: string,
): string | undefined {
  const path = value(candidate);
  if (!path) return undefined;

  try {
    const url = new URL(path, baseUrl);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function mapImage(
  file: StrapiBlogFile | null | undefined,
  title: string,
  context: string,
  graphqlUrl: string,
): BlogImage | undefined {
  const image = mapUploadImage(file, graphqlUrl, {
    fallbackAlt: `${title} — ${context}`,
    requireImageMime: true,
  });
  return image && file ? { ...image, mime: value(file.mime) } : undefined;
}

function firstImage(
  files: StrapiBlogFile[] | null | undefined,
  title: string,
  context: string,
  graphqlUrl: string,
): BlogImage | undefined {
  for (const file of files ?? []) {
    const image = mapImage(file, title, context, graphqlUrl);
    if (image) return image;
  }
  return undefined;
}

function mapAction(link: StrapiBlogLink | null | undefined): BlogAction | undefined {
  const label = value(link?.name);
  const href = safeContentHref(link?.href);
  if (!label || !href) return undefined;

  return {
    label,
    href,
    external:
      link?.isExternal === true || href.startsWith('http://') || href.startsWith('https://'),
  };
}

function youtubeId(candidate: string | null | undefined): string | undefined {
  const source = value(candidate);
  if (!source) return undefined;
  if (/^[A-Za-z0-9_-]{11}$/u.test(source)) return source;

  try {
    const url = new URL(source);
    const host = url.hostname.toLowerCase().replace(/^(?:www\.|m\.|music\.)/u, '');
    let id = '';

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') ?? '';
      else id = url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/u)?.[1] ?? '';
    }

    return /^[A-Za-z0-9_-]{11}$/u.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

function embedUrl(block: StrapiBlogBlock): string | undefined {
  const direct = safeContentHref(block.url);
  if (direct?.startsWith('http://') || direct?.startsWith('https://')) return direct;

  const match = value(block.embedCode).match(/\bsrc\s*=\s*["']([^"']+)["']/iu);
  const embedded = safeContentHref(match?.[1]);
  return embedded?.startsWith('http://') || embedded?.startsWith('https://')
    ? embedded
    : undefined;
}

/**
 * The words an embed carries for a reader who cannot see it: the authored `aria-label`, else the
 * SVG's `<desc>`, else the `<figcaption>`. Read as TEXT only, never rendered as markup.
 *
 * The one live embed without a `src` is an authored inline SVG figure (1 Nov 2026,
 * /insights/9-ux-design-tips-to-boost-your-ecommerce-conversion-rates) with its own colours and
 * font stacks. Injecting it would put CMS markup and off-token values on the page, so the diagram
 * is said in its own words until the CMS carries it as an image upload (open question, TRACKER
 * 2.44). An embed with a `src` is unaffected: it renders as an iframe.
 */
function embedTextAlternative(embedCode: string | null | undefined): string {
  const code = value(embedCode);
  if (!code) return '';
  const raw =
    code.match(/\baria-label\s*=\s*"([^"]+)"/iu)?.[1] ??
    code.match(/<desc>([\s\S]*?)<\/desc>/iu)?.[1] ??
    code.match(/<figcaption>([\s\S]*?)<\/figcaption>/iu)?.[1] ??
    '';
  return raw
    .replace(/<[^>]+>/gu, '')
    .replace(/&#x27;|&#39;/gu, "'")
    .replace(/&quot;/gu, '"')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&amp;/gu, '&')
    .replace(/\s+/gu, ' ')
    .trim();
}

function iframePublishedContent(block: StrapiBlogBlock): string {
  if (block.__typename !== 'ComponentBlogAndCasestudiesIframe') return '';
  if (value(block.url) || value(block.embedCode) || block.thumbnail) return '';

  return [value(block.title), value(block.description)].filter(Boolean).join(' — ');
}

function blockId(block: StrapiBlogBlock, index: number): string {
  return `${value(block.__typename) || 'blog-block'}-${value(block.id) || index}`;
}

function calloutHtml(
  heading: string | null | undefined,
  description: string | null | undefined,
  context: string,
): string {
  const title = value(heading);
  const body = markdownToHtml(description, context)
    .replace(/<h[2-6]>/gu, '<p><strong>')
    .replace(/<\/h[2-6]>/gu, '</strong></p>');
  return `${title ? `<p><strong>${escapeHtml(title)}</strong></p>` : ''}${body}`;
}

function mapBlock(
  block: StrapiBlogBlock,
  index: number,
  title: string,
  graphqlUrl: string,
  videoIsInHero: boolean,
  outline: BodyHeading[],
): BlogBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentBlogAndCasestudiesTldrSection': {
      const html = calloutHtml(block.heading, block.tdlrDescription, `${id} summary`);
      return html ? { id, type: 'callout', html } : undefined;
    }

    case 'ComponentBlogAndCasestudiesSepration': {
      const label = value(block.title);
      return {
        id,
        type: 'separator',
        html: `${label ? `<p><strong>${escapeHtml(label)}</strong></p>` : ''}<hr>`,
      };
    }

    case 'ComponentBlogAndCasestudiesBlogOrCasestudyText': {
      const html = markdownToHtml(block.blogContent, `${id} content`, { headings: outline });
      return html ? { id, type: 'prose', html } : undefined;
    }

    case 'ComponentSharedRichText': {
      const html = richTextToHtml(block.body, `${id} content`);
      return html ? { id, type: 'prose', html } : undefined;
    }

    case 'ComponentBlogAndCasestudiesSectionImage': {
      const figures = (block.imageSection ?? []).flatMap((file, imageIndex) => {
        const imageNumber =
          (block.imageSection?.length ?? 0) > 1
            ? `${index + 1}.${imageIndex + 1}`
            : `${index + 1}`;
        const image = mapImage(file, title, `article image ${imageNumber}`, graphqlUrl);
        if (!image) return [];
        return [
          {
            image,
            /* The upload's caption, or none. The alt is not a caption (Figure: alt must not restate it),
               and a caption nobody wrote is not one either: an image without one renders bare. */
            ...(value(file.caption) ? { caption: value(file.caption) } : {}),
          },
        ];
      });
      return figures.length ? { id, type: 'figures', figures } : undefined;
    }

    case 'ComponentBlogAndCasestudiesVideo': {
      const detectedYoutubeId = youtubeId(block.youtubeUrl || block.title);
      const description = value(block.description);

      if (videoIsInHero && detectedYoutubeId) {
        const html = markdownToHtml(description, `${id} description`);
        return html ? { id, type: 'prose', html } : undefined;
      }

      const src = absoluteUrl(block.videoFile?.url, graphqlUrl);
      const mime = value(block.videoFile?.mime);
      const thumbnail = mapImage(block.thumbnail, title, 'video thumbnail', graphqlUrl);
      const width =
        typeof block.videoFile?.width === 'number' && block.videoFile.width > 0
          ? block.videoFile.width
          : undefined;
      const height =
        typeof block.videoFile?.height === 'number' && block.videoFile.height > 0
          ? block.videoFile.height
          : undefined;
      const video =
        src && mime.startsWith('video/')
          ? {
              src,
              mime,
              ...(thumbnail ? { poster: thumbnail.src } : {}),
              ...(width ? { width } : {}),
              ...(height ? { height } : {}),
              autoplay: block.autoplay === true,
              loop: block.loop === true,
            }
          : undefined;
      const blockTitle = detectedYoutubeId ? '' : value(block.title);

      return detectedYoutubeId || video || thumbnail || blockTitle || description
        ? {
            id,
            type: 'video',
            ...(blockTitle ? { title: blockTitle } : {}),
            ...(description ? { description } : {}),
            ...(detectedYoutubeId ? { youtubeId: detectedYoutubeId } : {}),
            ...(video ? { video } : {}),
            ...(thumbnail ? { thumbnail } : {}),
          }
        : undefined;
    }

    case 'ComponentBlogAndCasestudiesIframe': {
      const blockTitle = value(block.title) || 'Embedded insight';
      const description = value(block.description);
      const url = embedUrl(block);
      const width =
        typeof block.width === 'number' && block.width > 0 ? block.width : undefined;
      const height =
        typeof block.height === 'number' && block.height > 0 ? block.height : undefined;
      const thumbnail = mapImage(block.thumbnail, title, 'embed thumbnail', graphqlUrl);

      if (!url && !thumbnail) {
        const copy = [blockTitle, description, embedTextAlternative(block.embedCode)]
          .filter(Boolean)
          .join(' — ');
        return copy ? { id, type: 'prose', html: `<p>${escapeHtml(copy)}</p>` } : undefined;
      }

      return {
        id,
        type: 'embed',
        title: blockTitle,
        ...(description ? { description } : {}),
        ...(url ? { url } : {}),
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(thumbnail ? { thumbnail } : {}),
      };
    }

    case 'ComponentBlogAndCasestudiesCodeSection': {
      const code = value(block.codeSnippet);
      return code
        ? { id, type: 'code', html: `<pre><code>${escapeHtml(code)}</code></pre>` }
        : undefined;
    }

    default:
      return undefined;
  }
}

function markdownToPlainText(markdown: string | null | undefined): string {
  return value(markdown)
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/!\[([^\]]*)\]\([^)]+\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/^\s{0,3}(?:#{1,6}|>|[-+*]|\d+\.)\s+/gmu, '')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/[*_~`]/gu, '')
    .replace(/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/gu, '$1')
    .replace(/\s+/gu, ' ')
    .trim();
}

function truncateSummary(candidate: string): string {
  if (candidate.length <= 320) return candidate;
  const shortened = candidate.slice(0, 317);
  const lastSpace = shortened.lastIndexOf(' ');
  return `${shortened.slice(0, lastSpace > 240 ? lastSpace : 317).trim()}…`;
}

function contentSummary(rawBlog: StrapiBlog): string {
  for (const block of rawBlog.mainSection ?? []) {
    let candidate = '';
    if (block.__typename === 'ComponentBlogAndCasestudiesBlogOrCasestudyText') {
      candidate = markdownToPlainText(block.blogContent);
    } else if (block.__typename === 'ComponentSharedRichText') {
      candidate = richTextToPlainText(block.body);
    } else if (block.__typename === 'ComponentBlogAndCasestudiesTldrSection') {
      candidate = markdownToPlainText(block.tdlrDescription);
    }
    if (candidate) return truncateSummary(candidate);
  }
  return '';
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate === 'string') {
    const source = candidate.trim();
    if (!source) return undefined;
    try {
      return JSON.parse(source) as unknown;
    } catch {
      return undefined;
    }
  }

  if (Array.isArray(candidate)) {
    const isRichText = candidate.some(
      (item) => isRecord(item) && typeof item.type === 'string',
    );
    if (!isRichText) return candidate;
    try {
      return JSON.parse(richTextToPlainText(candidate)) as unknown;
    } catch {
      return undefined;
    }
  }

  return candidate;
}

function structuredData(candidate: unknown): ContentSeo['structuredData'] {
  const parsed = parseJson(candidate);
  if (Array.isArray(parsed)) return parsed;
  if (!isRecord(parsed)) return undefined;

  const preview = parsed.full_json_ld_preview;
  return isRecord(preview) || Array.isArray(preview) ? preview : parsed;
}

function canonicalUrl(candidate: string | null | undefined): string | undefined {
  const source = value(candidate);
  if (!source.startsWith('http://') && !source.startsWith('https://')) return undefined;
  return absoluteUrl(source, DEFAULT_STRAPI_GRAPHQL_URL);
}

function mapSeo(rawSeo: StrapiBlogSeo | null | undefined): ContentSeo | undefined {
  if (!rawSeo) return undefined;

  const title = value(rawSeo.metaTitle);
  const description = value(rawSeo.metaDescription);
  const canonical = canonicalUrl(rawSeo.canonicalURL);
  const robotTokens = value(rawSeo.robot)
    .toLowerCase()
    .split(/[\s,]+/u)
    .filter(Boolean);
  const robots = robotTokens.length
    ? { index: !robotTokens.includes('noindex'), follow: !robotTokens.includes('nofollow') }
    : undefined;

  let jsonLd: ContentSeo['structuredData'];
  for (const candidate of [rawSeo.codeJson, rawSeo.graphCode, rawSeo.structuredData]) {
    jsonLd = structuredData(candidate);
    if (jsonLd) break;
  }

  return title || description || canonical || robots || jsonLd
    ? {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(canonical ? { canonical } : {}),
        ...(robots ? { robots, noindex: !robots.index } : {}),
        ...(jsonLd ? { structuredData: jsonLd } : {}),
      }
    : undefined;
}

function labels(items: Array<{ name?: string | null }> | null | undefined): string[] {
  return (items ?? []).flatMap((item) => {
    const name = value(item.name);
    return name ? [name] : [];
  });
}

function mapResource(
  resource: StrapiBlogResource,
  index: number,
  graphqlUrl: string,
): BlogResource | undefined {
  const slug = normaliseSlug(resource.slug);
  const title = value(resource.title);
  if (!slug || !title) return undefined;

  const thumbnail = mapImage(resource.thumbnail, title, 'thumbnail', graphqlUrl);
  const featureImage = firstImage(resource.featureImage, title, 'feature image', graphqlUrl);
  const authored = authoredDate(resource.mainSection);

  return {
    documentId: value(resource.documentId) || `blog-resource-${index}`,
    slug,
    title,
    kind: blogKind(slug),
    ...(value(resource.seo?.metaDescription)
      ? { description: value(resource.seo?.metaDescription) }
      : {}),
    ...(!(thumbnail || featureImage) && COVER_SCENES[slug]
      ? { coverScene: COVER_SCENES[slug] }
      : {}),
    /* The authored date from the body's line, never `publishedAt` (the CMS's last publish). */
    ...(authored ? { publishedAt: authored } : {}),
    ...(thumbnail || featureImage ? { image: thumbnail ?? featureImage } : {}),
    tags: labels(resource.tags),
    categories: labels(resource.categories),
  };
}

function mapBlog(
  rawBlog: StrapiBlog,
  resources: StrapiBlogResource[] | null | undefined,
  graphqlUrl: string,
): BlogPage | null {
  const slug = normaliseSlug(rawBlog.slug);
  const title = value(rawBlog.title);
  if (!slug || !title) return null;

  const seo = mapSeo(rawBlog.seo);
  const thumbnail = mapImage(rawBlog.thumbnail, title, 'thumbnail', graphqlUrl);
  const featureImage = firstImage(rawBlog.featureImage, title, 'feature image', graphqlUrl);
  const sections = rawBlog.mainSection ?? [];
  const publishedContentBlockIndex = sections.findIndex(
    (block) => iframePublishedContent(block) !== '',
  );
  const publishedContent =
    publishedContentBlockIndex >= 0
      ? iframePublishedContent(sections[publishedContentBlockIndex] ?? {})
      : '';
  const published = publishedLine(publishedContent);
  const heroVideoBlockIndex = sections.findIndex(
    (block) =>
      block.__typename === 'ComponentBlogAndCasestudiesVideo' &&
      youtubeId(block.youtubeUrl || block.title) !== undefined,
  );
  const heroVideoId =
    heroVideoBlockIndex >= 0
      ? youtubeId(
          sections[heroVideoBlockIndex]?.youtubeUrl || sections[heroVideoBlockIndex]?.title,
        )
      : undefined;
  const ctaAction = mapAction(rawBlog.ctoSection?.link);
  const ctaHeading = value(rawBlog.ctoSection?.heading).replaceAll('|', '');
  const cta =
    ctaHeading && ctaAction
      ? {
          heading: ctaHeading,
          body: [value(rawBlog.ctoSection?.description)] as const,
          actions: [ctaAction] as const,
        }
      : undefined;

  /* Hoisted rather than inlined below, because `outline` is filled as a SIDE EFFECT of mapping the
     blocks: reading it from a later key of the same object literal would make the result depend on
     key order, which is the kind of correctness nobody sees in review. */
  const outline: PageOutlineEntry[] = [];
  const blocks = resolveInPageAnchors(
    sections.flatMap((block, index) => {
      if (index === publishedContentBlockIndex) return [];
      const mapped = mapBlock(
        block,
        index,
        title,
        graphqlUrl,
        index === heroVideoBlockIndex,
        outline,
      );
      return mapped ? [mapped] : [];
    }),
  );

  return {
    documentId: value(rawBlog.documentId) || slug,
    slug,
    kind: blogKind(slug),
    title,
    description: value(rawBlog.seo?.metaDescription) || contentSummary(rawBlog),
    ...(value(rawBlog.createdAt) ? { createdAt: value(rawBlog.createdAt) } : {}),
    ...(value(rawBlog.publishedAt) ? { publishedAt: value(rawBlog.publishedAt) } : {}),
    ...(published.date ? { publishedContent: published.date } : {}),
    ...(published.readingTime ? { readingTime: published.readingTime } : {}),
    ...(value(rawBlog.updatedAt) ? { updatedAt: value(rawBlog.updatedAt) } : {}),
    ...(heroVideoId ? { heroVideo: { id: heroVideoId, title: `${title} video` } } : {}),
    ...(featureImage ? { featureImage } : {}),
    ...(thumbnail || featureImage ? { socialImage: thumbnail ?? featureImage } : {}),
    authors: (rawBlog.blogProfileSection ?? []).flatMap((author, index) => {
      const name = value(author.name);
      if (!name) return [];
      const image =
        firstImage(author.profilePicture, name, 'profile picture', graphqlUrl) ??
        (() => {
          const portrait = teamPortrait(name);
          return portrait ? { ...portrait, mime: 'image/jpeg' } : undefined;
        })();
      return [
        {
          id: value(author.id) || `blog-author-${index}`,
          name,
          ...(value(author.designation) ? { designation: value(author.designation) } : {}),
          ...(image ? { image } : {}),
        },
      ];
    }),
    tags: labels(rawBlog.tags),
    categories: labels(rawBlog.categories),
    blocks,
    outline,
    resources: (resources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(cta ? { cta } : {}),
    ...(seo ? { seo } : {}),
  };
}

async function fetchBlogBySlug(slug: string): Promise<{
  blog: StrapiBlog | null;
  resources: StrapiBlogResource[];
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: BLOG_BY_SLUG_QUERY,
      variables: {
        slug,
        status: 'PUBLISHED',
        exploreLimit: BLOG_RESOURCE_LIMIT,
      },
    }),
    cache: 'force-cache',
    next: {
      revalidate: BLOG_REVALIDATE_SECONDS,
      tags: ['blogs', `blog:${slug.slice(0, 240)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi blog request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiBlogResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi blog query failed: ${errors.join('; ')}`);
  }

  return {
    blog: payload.data?.currentBlog?.[0] ?? null,
    resources: payload.data?.exploreOtherResources ?? [],
  };
}

/** Keep nested CMS slugs and Strapi's dynamic-zone records behind the content seam. */
export const blogSource: BlogContentSource = {
  async getBlogPage(slug) {
    const requestedSlug = normaliseSlug(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const { blog, resources } = await fetchBlogBySlug(requestedSlug);
    return blog ? mapBlog(blog, resources, graphqlUrl) : null;
  },
};
