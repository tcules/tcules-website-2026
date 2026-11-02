import type { CorpusPage } from '../../corpus-types';
import type { OfferScenes } from '@/lib/sketches';
import { parseCorpusDocument } from '../corpus/load';

export type OfferDocument = {
  route: string;
  body: string;
  frontmatter: Record<string, unknown>;
};
type Illustration = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'illustration';
};
export type CmsOffer = {
  page: CorpusPage;
  scenes: OfferScenes;
  heroIllustration?: Illustration;
};
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export function mapOfferDocument(
  document: OfferDocument,
  route: string,
  pageType: 'service' | 'expertise' | 'audit' | 'expertise_hub',
): CmsOffer {
  if (
    document.route !== route ||
    document.frontmatter.route !== route ||
    !document.body?.trim()
  ) {
    throw new Error(`Production CMS returned an invalid ${pageType} document for ${route}.`);
  }
  const page = parseCorpusDocument(`cms:${route}`, document.frontmatter, document.body);
  const matchesType =
    page.pageType === pageType || (pageType === 'audit' && page.pageType === 'assessment');
  if (!page.hero.titleText || !matchesType) {
    throw new Error(`Production CMS ${pageType} ${route} has no ${pageType} page content.`);
  }
  const template = record(document.frontmatter.frontendTemplate);
  const rawScenes = record(template.scenes);
  const scenes: OfferScenes = {
    items: record(rawScenes.items) as OfferScenes['items'],
    stories: record(rawScenes.stories) as OfferScenes['stories'],
  };
  const image = record(template.heroIllustration);
  const heroIllustration =
    typeof image.src === 'string' &&
    /^https?:\/\//u.test(image.src) &&
    typeof image.width === 'number' &&
    image.width > 0 &&
    typeof image.height === 'number' &&
    image.height > 0
      ? {
          src: image.src,
          alt: typeof image.alt === 'string' ? image.alt : '',
          width: image.width,
          height: image.height,
          kind: 'illustration' as const,
        }
      : undefined;
  return { page, scenes, ...(heroIllustration ? { heroIllustration } : {}) };
}
