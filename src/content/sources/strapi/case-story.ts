import type { CaseStory, CaseStoryPart, CaseStudyImage, CaseStudyPage } from '../../types';
import { absoluteAssetUrl, positiveDimension } from './image';

type Row = Record<string, unknown>;

function invalid(path: string): never {
  throw new Error(`Invalid CMS case story: ${path}.`);
}

function row(candidate: unknown, path: string): Row {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) invalid(path);
  return candidate as Row;
}

function text(candidate: unknown, path: string): string {
  if (typeof candidate !== 'string' || !candidate.trim()) invalid(path);
  return candidate;
}

function list(candidate: unknown, path: string): unknown[] {
  if (!Array.isArray(candidate)) invalid(path);
  return candidate;
}

function texts(candidate: unknown, path: string): string[] {
  return list(candidate, path).map((item, index) => text(item, `${path}.${index}`));
}

function image(candidate: unknown, graphqlUrl: string): CaseStudyImage {
  const file = row(candidate, 'image');
  const src = absoluteAssetUrl(text(file.src, 'image.src'), graphqlUrl);
  const width = positiveDimension(typeof file.width === 'number' ? file.width : undefined);
  const height = positiveDimension(typeof file.height === 'number' ? file.height : undefined);
  const mime = text(file.mime, 'image.mime');
  if (!src || !width || !height || !mime.startsWith('image/')) invalid('image');
  if (typeof file.alt !== 'string') invalid('image.alt');
  const kind = file.kind;
  if (
    kind != null &&
    kind !== 'capture' &&
    kind !== 'cut-out' &&
    kind !== 'illustration' &&
    kind !== 'photograph'
  )
    invalid('image.kind');
  const panel = file.panel;
  if (
    kind === 'cut-out' &&
    panel != null &&
    panel !== 'paper' &&
    panel !== 'paper-deep' &&
    panel !== 'ink'
  ) {
    invalid('image.panel');
  }
  if (kind === 'cut-out' && file.shadow != null && typeof file.shadow !== 'boolean')
    invalid('image.shadow');
  const sources =
    file.sources == null
      ? []
      : list(file.sources, 'image.sources').map((item) => {
          const source = row(item, 'image.source');
          const url = absoluteAssetUrl(text(source.src, 'image.source.src'), graphqlUrl);
          const size = positiveDimension(
            typeof source.width === 'number' ? source.width : undefined,
          );
          if (!url || !size || size >= width) invalid('image.source');
          return { src: url, width: size };
        });
  return {
    src,
    alt: file.alt,
    width,
    height,
    mime,
    ...(kind ? { kind } : {}),
    ...(kind === 'cut-out' && (panel === 'paper' || panel === 'paper-deep' || panel === 'ink')
      ? { panel }
      : {}),
    ...(kind === 'cut-out' && typeof file.shadow === 'boolean' ? { shadow: file.shadow } : {}),
    ...(sources.length ? { sources } : {}),
  };
}

/** The JSON API field projects native components; validate it before handing it to a template. */
export function mapCaseStory(
  candidate: unknown,
  page: CaseStudyPage,
  graphqlUrl: string,
): CaseStory | undefined {
  if (candidate == null) return undefined;
  const story = row(candidate, 'storyView');
  if (story.slug !== page.slug) invalid('slug');
  const usedIds = new Set(['case-closing-heading']);
  function anchor(candidate: unknown): string {
    const id = text(candidate, 'anchor');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id) || usedIds.has(id)) invalid('anchor');
    usedIds.add(id);
    return id;
  }
  function part(candidate: unknown): CaseStoryPart {
    const value = row(candidate, 'part');
    switch (value.type) {
      case 'paragraphs':
        return { type: 'paragraphs', paragraphs: texts(value.paragraphs, 'paragraphs') };
      case 'quote':
        return {
          type: 'quote',
          quote: text(value.quote, 'quote'),
          attribution: text(value.attribution, 'attribution'),
        };
      case 'steps':
        if (value.ordered != null && typeof value.ordered !== 'boolean')
          invalid('steps.ordered');
        return {
          type: 'steps',
          ordered: value.ordered === true,
          items: list(value.items, 'steps.items').map((candidate) => {
            const item = row(candidate, 'step');
            return {
              label: text(item.label, 'step.label'),
              body: text(item.body, 'step.body'),
            };
          }),
        };
      case 'principle':
        return {
          type: 'principle',
          label: text(value.label, 'principle.label'),
          text: text(value.text, 'principle.text'),
        };
      case 'figures':
        return {
          type: 'figures',
          figures: list(value.figures, 'figures').map((candidate) => {
            const figure = row(candidate, 'figure');
            return {
              id: anchor(figure.id),
              image: image(figure.image, graphqlUrl),
              label: text(figure.label, 'figure.label'),
              caption: text(figure.caption, 'figure.caption'),
              notes: texts(figure.notes, 'figure.notes'),
            };
          }),
        };
      default:
        return invalid('part.type');
    }
  }
  const chapters = list(story.chapters, 'chapters').map((candidate) => {
    const chapter = row(candidate, 'chapter');
    const id = anchor(chapter.id);
    anchor(`${id}-heading`);
    const parts = list(chapter.parts, 'chapter.parts').map(part);
    if (parts.filter((part) => part.type === 'principle').length > 1)
      invalid('chapter.principles');
    return {
      id,
      number: text(chapter.number, 'chapter.number'),
      label: text(chapter.label, 'chapter.label'),
      heading: text(chapter.heading, 'chapter.heading'),
      parts,
    };
  });
  const closing = story.closing == null ? undefined : row(story.closing, 'closing');
  return {
    slug: page.slug,
    title: page.title,
    description: page.description,
    publishedAt: page.publishedAt,
    profile: page.profile,
    statements: page.statements,
    seo: page.seo,
    heroImage: story.heroImage == null ? page.heroImage : image(story.heroImage, graphqlUrl),
    categories: texts(story.categories, 'categories'),
    tags: texts(story.tags, 'tags'),
    chapters,
    ...(closing
      ? {
          closing: {
            label: text(closing.label, 'closing.label'),
            heading: text(closing.heading, 'closing.heading'),
            paragraphs: texts(closing.paragraphs, 'closing.paragraphs'),
          },
        }
      : {}),
  };
}
