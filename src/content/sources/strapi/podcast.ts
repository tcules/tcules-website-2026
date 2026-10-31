import type {
  ContentSeo,
  PageOutlineEntry,
  PodcastAction,
  PodcastBlock,
  PodcastContentSource,
  PodcastImage,
  PodcastPage,
} from '../../types';
import { mapUploadImage } from './image';
import { markdownToHtml, resolveInPageAnchors, type BodyHeading } from './markdown';
import { PODCAST_BY_SLUG_QUERY } from './podcast-query';
import type {
  StrapiPodcast,
  StrapiPodcastBlock,
  StrapiPodcastFile,
  StrapiPodcastLink,
  StrapiPodcastResource,
  StrapiPodcastResponse,
  StrapiPodcastSeo,
} from './podcast-types';
import { escapeHtml, safeContentHref } from './rich-text';
import { COVER_SCENES } from '../cover-scenes';
import { blogKind } from './insights';
import { authoredDate } from './published-line';

const DEFAULT_STRAPI_GRAPHQL_URL = 'https://tcules-server-production.up.railway.app/graphql';
const PODCAST_REVALIDATE_SECONDS = 300;
const PODCAST_RESOURCE_LIMIT = 3;

function value(candidate: string | null | undefined): string {
  return typeof candidate === 'string' ? candidate.trim() : '';
}

function getStrapiGraphqlUrl(): string {
  return value(process.env.STRAPI_GRAPHQL_URL) || DEFAULT_STRAPI_GRAPHQL_URL;
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

function routeSlug(candidate: string | null | undefined): string {
  return (
    value(candidate)
      .split('/')
      .map((part) => part.trim())
      .filter(Boolean)
      .at(-1) ?? ''
  );
}

function cmsPodcastSlug(slug: string): string {
  const requested = value(slug).replace(/^\/+|\/+$/gu, '');
  return requested.startsWith('podcasts/') ? requested : `podcasts/${requested}`;
}

function mapImage(
  file: StrapiPodcastFile | null | undefined,
  title: string,
  context: string,
  graphqlUrl: string,
): PodcastImage | undefined {
  const image = mapUploadImage(file, graphqlUrl, {
    fallbackAlt: `${title} — ${context}`,
    requireImageMime: true,
  });
  return image && file ? { ...image, mime: value(file.mime) } : undefined;
}

function mapAction(link: StrapiPodcastLink | null | undefined): PodcastAction | undefined {
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

function blockId(block: StrapiPodcastBlock, index: number): string {
  return `${value(block.__typename) || 'podcast-block'}-${value(block.id) || index}`;
}

function youtubeId(candidate: string | null | undefined): string | undefined {
  const source = value(candidate);
  if (!source) return undefined;

  try {
    const url = new URL(source);
    const host = url.hostname.toLowerCase().replace(/^(?:www\.|m\.)/u, '');
    let id = '';

    if (host === 'youtu.be') {
      id = url.pathname.split('/').filter(Boolean)[0] ?? '';
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') id = url.searchParams.get('v') ?? '';
      else id = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/u)?.[1] ?? '';
    }

    return /^[A-Za-z0-9_-]{11}$/u.test(id) ? id : undefined;
  } catch {
    return undefined;
  }
}

function externalMediaUrl(candidate: string | null | undefined): string | undefined {
  const href = safeContentHref(candidate);
  return href?.startsWith('http://') || href?.startsWith('https://') ? href : undefined;
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
  block: StrapiPodcastBlock,
  index: number,
  title: string,
  graphqlUrl: string,
  outline: BodyHeading[],
  videoIsInHero = false,
): PodcastBlock | undefined {
  const id = blockId(block, index);

  switch (block.__typename) {
    case 'ComponentPodcasteEventsInterviewsShadowCard': {
      const heading = value(block.heading);
      const detectedVideoId = youtubeId(heading);
      const videoId = videoIsInHero ? undefined : detectedVideoId;
      const mediaUrl = detectedVideoId ? undefined : externalMediaUrl(heading);
      const descriptionHtml = calloutHtml(undefined, block.shadowDescription, `${id} details`);
      const action = mapAction(block.link);
      const displayHeading = !detectedVideoId && !mediaUrl ? heading : undefined;

      return videoId || mediaUrl || displayHeading || descriptionHtml || action
        ? {
            id,
            type: 'shadow-card',
            ...(displayHeading ? { heading: displayHeading } : {}),
            ...(descriptionHtml ? { descriptionHtml } : {}),
            ...(videoId ? { youtubeId: videoId } : {}),
            ...(mediaUrl ? { mediaUrl } : {}),
            ...(action ? { action } : {}),
            emphasized: block.isShadowVisible === true || block.isBackgroundAvailable === true,
          }
        : undefined;
    }

    case 'ComponentBlogAndCasestudiesVideo': {
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
      const blockTitle = value(block.title);
      const description = value(block.videoDescription);

      return video || thumbnail || blockTitle || description
        ? {
            id,
            type: 'video',
            ...(blockTitle ? { title: blockTitle } : {}),
            ...(description ? { description } : {}),
            ...(video ? { video } : {}),
            ...(thumbnail ? { thumbnail } : {}),
          }
        : undefined;
    }

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

    case 'ComponentBlogAndCasestudiesSectionImage': {
      const figures = (block.imageSection ?? []).flatMap((file, imageIndex) => {
        const imageNumber =
          (block.imageSection?.length ?? 0) > 1
            ? `${index + 1}.${imageIndex + 1}`
            : `${index + 1}`;
        const image = mapImage(file, title, `podcast image ${imageNumber}`, graphqlUrl);
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

    case 'ComponentBlogAndCasestudiesBlogOrCasestudyText': {
      const html = markdownToHtml(block.blogContent, `${id} content`, { headings: outline });
      return html ? { id, type: 'prose', html } : undefined;
    }

    default:
      return undefined;
  }
}

function isRecord(candidate: unknown): candidate is Record<string, unknown> {
  return typeof candidate === 'object' && candidate !== null && !Array.isArray(candidate);
}

function parseJson(candidate: unknown): unknown {
  if (typeof candidate !== 'string') return candidate;
  const source = candidate.trim();
  if (!source) return undefined;

  try {
    return JSON.parse(source) as unknown;
  } catch {
    return undefined;
  }
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
  return source.startsWith('http://') || source.startsWith('https://')
    ? absoluteUrl(source, DEFAULT_STRAPI_GRAPHQL_URL)
    : undefined;
}

function mapSeo(rawSeo: StrapiPodcastSeo | null | undefined): ContentSeo | undefined {
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
  const jsonLd = structuredData(rawSeo.graphCode);

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

function mapResource(resource: StrapiPodcastResource, index: number, graphqlUrl: string) {
  const slug = routeSlug(resource.slug);
  const title = value(resource.title);
  if (!slug || !title) return undefined;

  const image = mapImage(resource.thumbnail, title, 'article thumbnail', graphqlUrl);
  const authored = authoredDate(resource.mainSection);
  return {
    documentId: value(resource.documentId) || `podcast-resource-${index}`,
    slug,
    title,
    kind: blogKind(slug),
    ...(value(resource.seo?.metaDescription)
      ? { description: value(resource.seo?.metaDescription) }
      : {}),
    /* The authored date from the body's line, never `publishedAt` (the CMS's last publish). */
    ...(authored ? { publishedAt: authored } : {}),
    ...(image
      ? { image }
      : { ...(COVER_SCENES[slug] ? { coverScene: COVER_SCENES[slug] } : {}) }),
  };
}

function mapPodcast(
  rawPodcast: StrapiPodcast,
  resources: StrapiPodcastResource[] | null | undefined,
  graphqlUrl: string,
): PodcastPage | null {
  const slug = routeSlug(rawPodcast.slug);
  const title = value(rawPodcast.title);
  if (!slug || !title) return null;

  const thumbnail = mapImage(rawPodcast.thumbnail, title, 'thumbnail', graphqlUrl);
  const sections = rawPodcast.mainSection ?? [];
  const heroVideoBlockIndex = sections.findIndex(
    (block) =>
      block.__typename === 'ComponentPodcasteEventsInterviewsShadowCard' &&
      youtubeId(block.heading) !== undefined,
  );
  const heroVideoId =
    heroVideoBlockIndex >= 0 ? youtubeId(sections[heroVideoBlockIndex]?.heading) : undefined;
  const seo = mapSeo(rawPodcast.seo);

  /* Hoisted rather than inlined below, because `outline` is filled as a SIDE EFFECT of mapping the
     blocks: reading it from a later key of the same object literal would make the result depend on
     key order, which is the kind of correctness nobody sees in review. */
  const outline: PageOutlineEntry[] = [];
  const blocks = resolveInPageAnchors(
    sections.flatMap((block, index) => {
      const mapped = mapBlock(
        block,
        index,
        title,
        graphqlUrl,
        outline,
        index === heroVideoBlockIndex,
      );
      return mapped ? [mapped] : [];
    }),
  );

  return {
    documentId: value(rawPodcast.documentId) || slug,
    slug,
    title,
    description: value(rawPodcast.description),
    ...(value(rawPodcast.createdAt) ? { createdAt: value(rawPodcast.createdAt) } : {}),
    ...(value(rawPodcast.publishedAt) ? { publishedAt: value(rawPodcast.publishedAt) } : {}),
    ...(heroVideoId ? { heroVideo: { id: heroVideoId, title: `${title} video` } } : {}),
    ...(thumbnail ? { socialImage: thumbnail } : {}),
    tags: (rawPodcast.tags ?? []).flatMap((tag) => {
      const name = value(tag.name);
      return name ? [name] : [];
    }),
    categories: (rawPodcast.categories ?? []).flatMap((category) => {
      const name = value(category.name);
      return name ? [name] : [];
    }),
    blocks,
    outline,
    resources: (resources ?? []).flatMap((resource, index) => {
      const mapped = mapResource(resource, index, graphqlUrl);
      return mapped ? [mapped] : [];
    }),
    ...(seo ? { seo } : {}),
  };
}

async function fetchPodcastBySlug(slug: string): Promise<{
  podcast: StrapiPodcast | null;
  resources: StrapiPodcastResource[];
}> {
  const graphqlUrl = getStrapiGraphqlUrl();
  const cmsSlug = cmsPodcastSlug(slug);
  const response = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: PODCAST_BY_SLUG_QUERY,
      variables: { podcastSlug: cmsSlug, blogLimit: PODCAST_RESOURCE_LIMIT },
    }),
    cache: 'force-cache',
    next: {
      revalidate: PODCAST_REVALIDATE_SECONDS,
      tags: ['podcasts', `podcast:${routeSlug(slug).slice(0, 230)}`],
    },
  });

  if (!response.ok) {
    throw new Error(`Strapi podcast request failed with HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as StrapiPodcastResponse;
  const errors = payload.errors?.map((error) => value(error.message)).filter(Boolean) ?? [];
  if (errors.length > 0) {
    throw new Error(`Strapi podcast query failed: ${errors.join('; ')}`);
  }

  return {
    podcast: payload.data?.podcastInternal?.[0] ?? null,
    resources: payload.data?.exploreOtherResources ?? [],
  };
}

/** Keep every Strapi field and CMS-specific slug convention behind the content seam. */
export const podcastSource: PodcastContentSource = {
  async getPodcastPage(slug) {
    const requestedSlug = routeSlug(slug);
    if (!requestedSlug) return null;

    const graphqlUrl = getStrapiGraphqlUrl();
    const { podcast, resources } = await fetchPodcastBySlug(requestedSlug);
    return podcast ? mapPodcast(podcast, resources, graphqlUrl) : null;
  },
};
