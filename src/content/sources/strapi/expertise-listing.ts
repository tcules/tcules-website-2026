import { cache } from 'react';
import type { CorpusBand, CorpusBlock, CorpusMediaBinding } from '../../corpus-types';
import type { InlineRun } from '@/lib/inline';
import { inlineToText } from '@/lib/inline';
import { liveCaseLinks } from '../corpus/load';
import { parseInline } from '../corpus/parse-inline';
import { mapOfferDocument, type CmsOffer, type OfferDocument } from './offer-document';
import { mapUploadImage, type StrapiUploadFile } from './image';
import { productionCmsQuery, productionCmsUrl } from './production-cms';
import { safeContentHref } from './rich-text';

const QUERY = /* GraphQL */ `
  query PublishedExpertiseListing {
    expertiseListing(status: PUBLISHED) {
      documentId
      title
      updatedAt
      hero {
        eyebrow
        description
        actions {
          name
          href
        }
      }
      content {
        __typename
        ... on ComponentListingExpertiseDirectory {
          id
          heading
          description
          groups {
            id
            heading
            expertises {
              documentId
              slug
              href
              title
              bestFor
              designApproach
              image {
                url
                width
                height
                alternativeText
                mime
                formats
              }
            }
          }
        }
      }
      faqSection {
        eyebrow
        heading
        description
        faqs(filters: { isActive: { eq: true } }, pagination: { limit: 100 }) {
          documentId
          question
          answer
          isActive
        }
      }
      cta {
        heading
        description
        ctaType
        form {
          variant
          caption
          successHeading
          successBody
        }
      }
      seo {
        metaTitle
        metaDescription
        canonicalURL
        robot
      }
    }
    scopedCorpusDocument(route: "/expertise") {
      route
      body
      frontmatter
    }
  }
`;

type NativeNode = {
  type?: string;
  text?: string;
  url?: string;
  children?: NativeNode[];
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  format?: string;
};
type Entry = {
  documentId: string;
  slug: string;
  href: string;
  title: string;
  bestFor: string;
  designApproach: string;
  image?: StrapiUploadFile | null;
};
type Directory = {
  __typename: string;
  id?: string;
  heading?: string | null;
  description?: string | null;
  groups?: { id: string; heading?: string | null; expertises: Entry[] }[];
};
type Listing = {
  documentId: string;
  title: string;
  updatedAt?: string | null;
  hero: {
    eyebrow?: string | null;
    description?: string | null;
    actions?: { name?: string | null; href?: string | null }[] | null;
  };
  content: Directory[];
  faqSection?: {
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    faqs: {
      documentId: string;
      question: string;
      answer: NativeNode[];
      isActive?: boolean | null;
    }[];
  } | null;
  cta?: {
    heading?: string | null;
    description?: string | null;
    ctaType?: string | null;
    form?: {
      variant?: string | null;
      caption?: string | null;
      successHeading?: string | null;
      successBody?: string | null;
    } | null;
  } | null;
  seo?: {
    metaTitle?: string | null;
    metaDescription?: string | null;
    canonicalURL?: string | null;
    robot?: string | null;
  } | null;
};
type ResponseData = {
  expertiseListing: Listing | null;
  scopedCorpusDocument: OfferDocument | null;
};
export type ExpertiseListingPage = CmsOffer & { updatedAt?: string };
const text = (value: string | null | undefined) => value?.trim() || '';
const runs = (value: string): InlineRun[] => [{ type: 'text', text: value }];
const paragraphs = (value: string | null | undefined): CorpusBlock[] =>
  text(value)
    .split(/\n\s*\n/u)
    .filter(Boolean)
    .map((part) => ({ type: 'paragraph', runs: parseInline(part) }));

/** Keep native FAQ links and emphasis when projecting Strapi blocks into the authored page model. */
function nativeInline(nodes: NativeNode[] = []): InlineRun[] {
  return nodes.flatMap((node): InlineRun[] => {
    if (node.type === 'link') {
      const children = nativeInline(node.children);
      const href = safeContentHref(node.url);
      return href ? [{ type: 'link', href, children }] : children;
    }
    if (typeof node.text === 'string') {
      let content: InlineRun[] = [{ type: node.code ? 'code' : 'text', text: node.text }];
      if (node.bold) content = [{ type: 'strong', children: content }];
      if (node.italic) content = [{ type: 'em', children: content }];
      return content;
    }
    return nativeInline(node.children);
  });
}
function nativeBlocks(nodes: NativeNode[] = []): CorpusBlock[] {
  return nodes.flatMap((node): CorpusBlock[] => {
    if (node.type === 'list')
      return [
        {
          type: 'list',
          ordered: node.format === 'ordered',
          items: (node.children || []).map((item) => nativeInline(item.children)),
        },
      ];
    const content = nativeInline(node.children);
    return content.length ? [{ type: 'paragraph', runs: content }] : [];
  });
}
function replaceBand(page: CmsOffer['page'], id: string, band: CorpusBand | null) {
  const index = page.bands.findIndex((candidate) => candidate.id === id);
  if (index < 0 && band)
    throw new Error(`Production CMS expertise listing is missing its ${id} section.`);
  page.bands = page.bands.flatMap((candidate) =>
    candidate.id === id ? (band ? [band] : []) : [candidate],
  );
  if (!band) page.bandOrder = page.bandOrder.filter((candidate) => candidate !== id);
}

export function mapExpertiseListing(data: ResponseData): ExpertiseListingPage | null {
  const listing = data.expertiseListing;
  if (!listing || !data.scopedCorpusDocument) return null;
  const mapped = mapOfferDocument(data.scopedCorpusDocument, '/expertise', 'expertise_hub');
  const { page } = mapped;
  if (!text(listing.title) || !listing.hero)
    throw new Error('Production CMS expertise listing has no hero.');
  page.hero = {
    ...page.hero,
    title: runs(listing.title),
    titleText: listing.title,
    eyebrow: text(listing.hero.eyebrow) ? runs(text(listing.hero.eyebrow)) : null,
    lede: paragraphs(listing.hero.description).flatMap((block) =>
      block.type === 'paragraph' ? [block.runs] : [],
    ),
    actions: (listing.hero.actions || []).flatMap((action) => {
      const href = safeContentHref(action.href);
      const labelText = text(action.name);
      return href && labelText ? [{ href, labelText, label: runs(labelText) }] : [];
    }),
  };
  const directories = listing.content.filter(
    (block) => block.__typename === 'ComponentListingExpertiseDirectory',
  );
  if (directories.length !== 1)
    throw new Error('Production CMS expertise listing must contain one directory.');
  const directory = directories[0]!;
  const current = page.bands.find((band) => band.id === 'product-types');
  if (!current)
    throw new Error('Production CMS expertise listing is missing its product-types section.');
  const isGroup = (block: CorpusBlock) =>
    block.type === 'item' && block.blocks.some((inner) => inner.type === 'table');
  const firstGroup = current.blocks.findIndex(isGroup);
  const trailing =
    firstGroup < 0 ? [] : current.blocks.slice(firstGroup).filter((block) => !isGroup(block));
  // Native references replace snapshot rows entirely, including entries removed or unpublished in the CMS.
  const images: CorpusMediaBinding[] = [];
  const groups: CorpusBlock[] = (directory.groups || []).map((group, index) => ({
    type: 'item',
    level: 3,
    id: `expertise-group-${group.id || index}`,
    heading: runs(text(group.heading)),
    headingText: text(group.heading),
    blocks: [
      {
        type: 'table',
        header: [runs('Expertise'), runs('Best for'), runs('How we design for it')],
        rows: group.expertises.map((entry) => {
          if (
            !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(entry.slug) ||
            entry.href !== `/expertise/${entry.slug}` ||
            !text(entry.title) ||
            !text(entry.bestFor) ||
            !text(entry.designApproach)
          ) {
            throw new Error(
              'Production CMS expertise directory returned an invalid reference.',
            );
          }
          if (entry.image) {
            const image = mapUploadImage(entry.image, productionCmsUrl(), {
              fallbackAlt: entry.title,
              requireImageMime: true,
            });
            if (!image)
              throw new Error(`Production CMS expertise image is invalid for ${entry.slug}.`);
            images.push({
              id: `expertise-listing-${entry.documentId}`,
              role: 'humanise',
              supportsSection: 'product-types',
              card: entry.href,
              assetUri: image.src,
              altIntent: image.alt,
              width: image.width,
              height: image.height,
              sources: image.sources,
              bound: true,
              status: 'BOUND_EXISTING_PUBLIC_ASSET',
              source: 'Expertise listing card',
              caption: null,
              attribution: null,
            });
          }
          return [
            [{ type: 'link', href: entry.href, children: runs(entry.title) }],
            runs(entry.bestFor),
            runs(entry.designApproach),
          ];
        }),
      },
    ],
  }));
  replaceBand(page, 'product-types', {
    ...current,
    heading: runs(text(directory.heading)),
    headingText: text(directory.heading),
    blocks: [...paragraphs(directory.description), ...groups, ...trailing],
  });
  page.composition.mediaBindings = [
    ...page.composition.mediaBindings.filter(
      (binding) =>
        !(
          binding.supportsSection === 'product-types' && binding.card?.startsWith('/expertise/')
        ),
    ),
    ...images,
  ];
  const faq = listing.faqSection;
  const questions: CorpusBlock[] = (faq?.faqs || [])
    .filter((item) => item.isActive !== false)
    .flatMap((item) => {
      const blocks = nativeBlocks(item.answer);
      return text(item.question) && blocks.length
        ? [
            {
              type: 'item',
              level: 3,
              id: null,
              heading: runs(item.question),
              headingText: item.question,
              blocks,
            },
          ]
        : [];
    });
  replaceBand(
    page,
    'faq',
    faq && questions.length
      ? {
          id: 'faq',
          anchored: true,
          heading: runs(text(faq.heading)),
          headingText: text(faq.heading),
          blocks: [...paragraphs(faq.description), ...questions],
        }
      : null,
  );
  const cta = listing.cta;
  if (cta?.ctaType === 'form') {
    if (cta.form?.variant && cta.form.variant !== 'enquiry')
      throw new Error('Unsupported expertise listing form variant.');
    const close = page.bands.find((band) => band.id === 'enquiry');
    const form = close?.blocks.find((block) => block.type === 'form');
    if (!close || !form || form.type !== 'form' || !page.conversion)
      throw new Error('Production CMS expertise listing is missing enquiry settings.');
    if (text(cta.form?.caption)) form.after = runs(text(cta.form?.caption));
    replaceBand(page, 'enquiry', {
      ...close,
      heading: runs(text(cta.heading)),
      headingText: text(cta.heading),
      blocks: [...paragraphs(cta.description), form],
    });
    page.conversion.onSuccess = text(cta.form?.successHeading)
      ? {
          heading: text(cta.form?.successHeading),
          body: text(cta.form?.successBody),
          retainEnteredData: page.conversion.onSuccess?.retainEnteredData ?? true,
        }
      : null;
  } else if (!cta) {
    replaceBand(page, 'enquiry', null);
    page.conversion = null;
  } else throw new Error('Unsupported expertise listing CTA type.');
  page.seo = {
    ...page.seo,
    title: text(listing.seo?.metaTitle) || page.seo.title,
    description: text(listing.seo?.metaDescription) || page.seo.description,
    canonical: text(listing.seo?.canonicalURL) || page.seo.canonical,
    robots: text(listing.seo?.robot) || page.seo.robots,
  };
  page.hero = liveCaseLinks(page.hero);
  page.bands = liveCaseLinks(page.bands);
  return {
    ...mapped,
    ...(text(listing.updatedAt) ? { updatedAt: text(listing.updatedAt) } : {}),
  };
}

export const getExpertiseListingPage = cache(async (): Promise<ExpertiseListingPage | null> => {
  const data = await productionCmsQuery<ResponseData>(QUERY, {}, [
    'expertise-listing',
    'expertise',
  ]);
  return mapExpertiseListing(data);
});
