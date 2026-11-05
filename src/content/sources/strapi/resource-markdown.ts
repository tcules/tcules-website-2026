import { Marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

import { absoluteAssetUrl } from './image';
import { markdownToHtml, type OutlineSink } from './markdown';
import { publicGraphqlUrl } from './public-graphql';
import { escapeHtml } from './rich-text';

const marked = new Marked({ gfm: true, async: false });
const headingLabel = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .trim();

/** The five imported HTML-bearing resources need a real Markdown parser and HTML sanitizer.
 * Keep the site's existing renderer for ordinary Markdown, including its quote/cite treatment.
 * Raw event handlers, scripts, styles and unapproved iframe origins never reach Prose. */
export function resourceMarkdownToHtml(
  source: string | null | undefined,
  context: string,
  outline?: OutlineSink,
): string {
  if (!source) return '';
  if (!/<\/?[a-z][^>]*>|!\[[^\]]*\]\(|^\s{2,}(?:[-+*]|\d+\.)\s+/im.test(source))
    return markdownToHtml(source, context, outline);
  const parsed = marked.parse(source.replace(/[\u2028\u2029]/g, '\n'), { async: false });
  const html = sanitizeHtml(parsed, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'video',
      'source',
      'iframe',
      'ins',
      'del',
    ],
    allowedAttributes: {
      a: ['href', 'title'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      h5: ['id'],
      h6: ['id'],
      th: ['scope', 'colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      ol: ['start'],
      code: ['class'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      video: ['src', 'controls', 'poster', 'width', 'height', 'preload'],
      source: ['src', 'type'],
      iframe: ['src', 'title', 'width', 'height', 'loading', 'allowfullscreen'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https'],
      video: ['http', 'https'],
      source: ['http', 'https'],
    },
    allowProtocolRelative: false,
    allowedIframeHostnames: ['www.youtube-nocookie.com', 'www.youtube.com', 'youtube.com'],
    transformTags: {
      h1: 'h2',
      img: (_tag, attributes) => ({
        tagName: 'img',
        attribs: {
          ...attributes,
          src: absoluteAssetUrl(attributes.src, publicGraphqlUrl()) ?? '',
          loading: 'lazy',
        },
      }),
      a: (_tag, attributes) => ({
        tagName: 'a',
        attribs: {
          ...attributes,
          href:
            attributes.href?.replace(
              /^https?:\/\/(?:www\.)?tcules\.com(\/insights\/authors\/[^/?#]+)\/?(?=$|[?#])/i,
              '$1',
            ) ?? '',
        },
      }),
    },
    exclusiveFilter: (frame) => frame.tag === 'img' && !frame.attribs.src,
  });
  return outline
    ? html.replace(
        /<h2(?: id="([^"]*)")?>([\s\S]*?)<\/h2>/g,
        (_, authoredId: string | undefined, inner: string) => {
          const id = authoredId || `toc-${outline.headings.length + 1}`;
          outline.headings.push({ label: headingLabel(inner), anchorId: id });
          return `<h2 id="${escapeHtml(id)}">${inner}</h2>`;
        },
      )
    : html;
}
