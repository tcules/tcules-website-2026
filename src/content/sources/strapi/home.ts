import { cache } from 'react';

import type { ClipRendition, ClipSource, MediaImage } from '@/components';
import { isSketchName } from '@/components/Sketch';
import { iconNames, type IconName } from '@/lib/icon-glyphs';
import { caseStudyPath, expertisePath, ROUTES } from '@/lib/routes';
import type {
  EngagementScope,
  HeroActions,
  HeroMedia,
  LogoGridMark,
  TeaserMedia,
} from '@/patterns';
import type {
  HomeHero,
  HomePageModel,
  HomeSection,
} from '@/templates/CorpusPage/published-home-model';

import { HOME_QUERY } from './home-query';
import type {
  CmsAction,
  CmsHero,
  CmsHome,
  CmsHomeSection,
  CmsIllustration,
  CmsImage,
  CmsRating,
  CmsRendition,
  Entries,
  ResolvedCase,
} from './home-types';
import { absoluteAssetUrl, mapUploadImage } from './image';
import { markdownInlineToHtml, markdownToHtml } from './markdown';
import { publicGraphql, publicGraphqlUrl } from './public-graphql';
import { escapeHtml, richTextToHtml, richTextToPlainText, safeContentHref } from './rich-text';

export const text = (value: string | null | undefined) => value?.trim() || undefined;
export const rows = <T>(entries: Entries<T>): T[] =>
  (entries ?? []).filter((item): item is T => item != null);
const texts = (entries: Entries<{ text?: string | null }>) =>
  rows(entries).flatMap((item) => text(item.text) ?? []);
export const actionHref = (value: unknown) => {
  const href = safeContentHref(value);
  // A backslash can turn a seemingly root-relative path into a cross-origin URL.
  return href && !href.includes('\\') ? href : undefined;
};

function warn(field: string) {
  console.warn(`New CMS Home: ${field}`);
}

function markdown(value: string | null | undefined, context: string) {
  try {
    return markdownToHtml(value, context) || undefined;
  } catch {
    warn(`unsupported embedded content in ${context}`);
    return richTextToHtml(value, context) || undefined;
  }
}

function answerHtml(value: unknown, context: string) {
  try {
    return richTextToHtml(value, context) || undefined;
  } catch {
    warn(`unsupported embedded media in ${context}`);
    return richTextToHtml(richTextToPlainText(value), context) || undefined;
  }
}

/** The testimonial API stores HTML. Keep its prose marks and strip all attributes and other tags. */
export function quoteHtml(value: string | null | undefined) {
  if (!text(value)) return undefined;
  const clean = value!
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .split(/(<[^>]*>)/g)
    .map((part) => {
      if (/^<\/?(?:p|em|i|strong|b|blockquote)>$|^<br\s*\/?>$/i.test(part)) return part;
      if (part.startsWith('<') && part.endsWith('>')) return '';
      return escapeHtml(part).replace(/&amp;((?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]+);)/gi, '&$1');
    })
    .join('');
  return clean.replace(/<[^>]+>/g, '').trim() ? clean : undefined;
}

export function icon(value: string | null | undefined): IconName | undefined {
  return iconNames.find((name) => name === value);
}

export function action(value: CmsAction | null | undefined) {
  const label = text(value?.name);
  const href = actionHref(value?.href);
  if (label && href)
    return { label, href, icon: icon(value?.icon), description: text(value?.description) };
  if (value) warn('an authored action is missing its label or a valid href');
}

function actions(values: Entries<CmsAction>) {
  return rows(values).flatMap((value) => action(value) ?? []);
}

function pair<T>(values: readonly T[], context: string): [] | [T] | [T, T] {
  if (values.length > 2) warn(`${context} has more than two actions`);
  const [first, second] = values;
  return first === undefined ? [] : second === undefined ? [first] : [first, second];
}

function rating(value: CmsRating | null | undefined) {
  const score = text(value?.score);
  const platform = text(value?.platform);
  const href = actionHref(value?.href);
  return score && platform && href
    ? { score, platform, href, detail: text(value?.detail), mark: text(value?.mark) }
    : undefined;
}

export function image(value: CmsImage | null | undefined): MediaImage | undefined {
  if (!value) return undefined;
  const mapped = mapUploadImage(value.file, publicGraphqlUrl(), {
    fallbackAlt: text(value.altText),
  });
  if (!mapped) return undefined;
  const { focusX, focusY, kind, panel, toneTemperature, toneSaturation } = value;
  return {
    ...mapped,
    alt: text(value.altText) ?? mapped.alt,
    kind: kind === 'cut_out' ? 'cut-out' : (kind ?? undefined),
    panel: panel === 'paper_deep' ? 'paper-deep' : (panel ?? undefined),
    shadow: value.shadow ?? undefined,
    focus:
      typeof focusX === 'number' || typeof focusY === 'number'
        ? { x: focusX ?? 0.5, y: focusY ?? 0.5 }
        : undefined,
    tone:
      (toneTemperature === 'warm' ||
        toneTemperature === 'neutral' ||
        toneTemperature === 'cool') &&
      (toneSaturation === 'vivid' || toneSaturation === 'quiet')
        ? { temperature: toneTemperature, saturation: toneSaturation }
        : undefined,
  };
}

function sketch(value: string | null | undefined) {
  if (!value) return undefined;
  if (isSketchName(value)) return value;
  warn(`unknown illustration scene "${value}"`);
}

export function illustration(value: CmsIllustration | null | undefined) {
  const art = image(value?.image);
  const scene = sketch(value?.scene);
  if (value?.source === 'scene' && scene) return { scene };
  if (art) return { image: art };
  return scene ? { scene } : undefined;
}

function rendition(value: CmsRendition | null | undefined): ClipRendition | undefined {
  const endpoint = publicGraphqlUrl();
  const poster = absoluteAssetUrl(value?.poster?.url, endpoint);
  const sources = rows(value?.sources).flatMap<ClipSource>(({ url, mime }) => {
    const src = absoluteAssetUrl(url, endpoint);
    return src && (mime === 'video/mp4' || mime === 'video/webm') ? [{ src, type: mime }] : [];
  });
  return poster && sources.length ? { sources, poster } : undefined;
}

function heroMedia(hero: CmsHero): HeroMedia | undefined {
  const wide = rendition(hero.clip?.wide);
  const clipTitle = text(hero.clip?.title);
  if (wide && clipTitle) {
    return {
      type: 'clip',
      wide,
      tall: rendition(hero.clip?.tall),
      title: clipTitle,
      description: text(hero.clip?.description),
    };
  }
  const art = illustration(hero.illustration);
  if (art?.image) return { type: 'image', image: art.image };
  if (art?.scene) return { type: 'sketch', name: art.scene };
  const media = image(hero.media);
  if (media) return { type: 'image', image: media };
  const sceneTitle = text(hero.scene?.title);
  if (hero.scene?.scene === 'arena' && sceneTitle)
    return { type: 'scene', scene: 'arena', title: sceneTitle };
  if (hero.scene || hero.clip || hero.media || hero.illustration)
    warn('hero media has no supported asset');
}

function recognition(credit: CmsHero['recognition']) {
  if (!credit) return undefined;
  const overrides = new Map(
    rows(credit.markOverrides).map((mark) => [mark.client?.documentId, mark]),
  );
  const clients = rows(credit.clients);
  const marks: LogoGridMark[] = clients.flatMap<LogoGridMark>((client) => {
    const name = text(client.name);
    if (!name) return [];
    const override = overrides.get(client.documentId);
    const asset =
      mapUploadImage(override?.media, publicGraphqlUrl()) ??
      mapUploadImage(client.media, publicGraphqlUrl());
    if (!asset) warn(`client ${client.documentId} has no usable logo`);
    return asset
      ? [
          {
            src: asset.src,
            name,
            width: override?.width ?? asset.width,
            height: override?.height ?? asset.height,
            density: override?.density ?? client.density ?? undefined,
          },
        ]
      : [{ name }];
  });
  return {
    id: text(credit.anchorId),
    title: text(credit.title),
    marks,
    compact: credit.gridDensity !== 'standard',
  };
}

export function mapHero(hero: CmsHero | null | undefined): HomeHero | null {
  const title = text(hero?.title);
  if (!hero || !title) return null;
  const paragraphs = [
    text(hero.description),
    text(hero.secondaryDescription),
    ...texts(hero.additionalParagraphs),
  ].filter((paragraph): paragraph is string => Boolean(paragraph));
  const [first, ...rest] = paragraphs;
  const body: [string, ...string[]] | undefined = first ? [first, ...rest] : undefined;
  const heroActions: HeroActions = pair(actions(hero.actions), 'hero');
  return {
    title,
    body,
    actions: heroActions,
    eyebrow: text(hero.eyebrow),
    arrangement: hero.arrangement ?? undefined,
    actionsNote: markdown(hero.actionsNote, 'hero actionsNote'),
    breadcrumbs: rows(hero.breadcrumbs).flatMap((crumb) => {
      const label = text(crumb.label);
      const href = actionHref(crumb.href);
      return label && href ? [{ label, href }] : [];
    }),
    stats: rows(hero.stats).flatMap((stat) => {
      const label = text(stat.label);
      const value = richTextToPlainText(stat.body);
      return label && value ? [{ label, value }] : [];
    }),
    tags: texts(hero.tags),
    media: heroMedia(hero),
    recognition: recognition(hero.recognition),
  };
}

function caseCard(value: ResolvedCase | null | undefined, index: number) {
  const title = text(value?.title);
  if (!title) return undefined;
  const body = text(value?.description);
  return {
    id: value?.id ?? String(index),
    title,
    eyebrow: text(value?.eyebrow),
    body,
    bodyHtml:
      value?.descriptionFormat === 'markdown' ? markdown(body, 'case description') : undefined,
    href: actionHref(value?.href),
    ctaLabel: value?.showCta === false ? undefined : text(value?.ctaLabel),
    image: image(value?.image),
  };
}

const scopeNames: readonly EngagementScope[] = [
  'feature',
  'pilot',
  'area',
  'embedded',
  'build',
  'start',
  'direct',
  'inside',
  'overlap',
  'commercial',
  'own',
  'who',
  'communication',
  'response',
  'getting-started',
  'turnaround',
  'hours',
];

const formUrlLabels = [
  'Website',
  'Link to the work',
  'Where can we see it?',
  'Product or company URL',
] as const;

function resourceMedia(
  thumbnail:
    | { relatedImage?: CmsImage | null; image?: CmsImage | null; scene?: string | null }
    | null
    | undefined,
): TeaserMedia | undefined {
  const cover = image(thumbnail?.relatedImage) ?? image(thumbnail?.image);
  if (cover) return { type: 'image', image: cover };
  const name = thumbnail?.scene;
  if (
    name === 'code-review' ||
    name === 'security-checklist' ||
    name === 'prototype-to-production'
  ) {
    return { type: 'sketch', name };
  }
  if (name) warn(`unknown resource cover scene "${name}"`);
}

export function mapBand(
  section: CmsHomeSection,
  route: string = ROUTES.home,
): HomeSection | undefined {
  const warn = (message: string) => console.warn(`New CMS ${route}: ${message}`);
  const id = text(section.anchorId);
  const key = `${section.__typename}-${section.id}`;
  const heading = text(section.heading);
  if (!heading) {
    warn(`${key} has no heading or supported component mapping`);
    return;
  }
  const head = { key, id, heading, headingId: `${id ?? key}-heading` };
  switch (section.__typename) {
    case 'ComponentSharedSituationGateway':
      return {
        ...head,
        type: 'gateway',
        surface: section.gatewaySurface ?? undefined,
        lead: text(section.description),
        eyebrow: text(section.eyebrow),
        action: action(section.action),
        closingLine: text(section.closingLine),
        paths: rows(section.paths).flatMap((path) => {
          const title = text(path.title);
          return title
            ? [
                {
                  id: path.id,
                  title,
                  eyebrow: text(path.eyebrow),
                  body: texts(path.body),
                  glyph: icon(path.glyph),
                  exampleLabel: text(path.exampleLabel),
                  exampleHtml: markdown(path.example, `${key} example`),
                  links: actions(path.links),
                },
              ]
            : [];
        }),
      };
    case 'ComponentSharedCaseStudyCards':
      return {
        ...head,
        type: 'cases',
        surface: section.casesSurface ?? undefined,
        side: section.casesSide,
        presentation: section.casePresentation,
        lead: text(section.description),
        action: action(section.action),
        cards: rows(section.cards).flatMap((card, index) => {
          const resolved = card.resolved;
          const slug = text(card.caseStudy?.slug);
          const result = caseCard(
            resolved ?? {
              title: card.title ?? card.caseStudy?.title,
              eyebrow: card.eyebrow,
              description: card.descriptionRich ?? card.description,
              descriptionFormat: card.descriptionRich ? 'markdown' : 'text',
              href: slug ? caseStudyPath(slug) : undefined,
              showCta: card.showCta,
              ctaLabel: card.ctaText,
              image: card.image,
            },
            index,
          );
          if (!result?.href || !result.image)
            warn(`${key} card ${index + 1} is missing a case link or cover`);
          return result ?? [];
        }),
      };
    case 'ComponentSharedOfferSheetSection': {
      const copy = (item: {
        id: string;
        title?: string | null;
        body?: string | null;
        scene?: string | null;
      }) => ({
        id: item.id,
        title: text(item.title),
        bodyHtml: markdownInlineToHtml(item.body) || undefined,
        scene: sketch(item.scene),
      });
      const flow = (value: typeof section.before) =>
        rows(value).flatMap((item) => {
          if (item.kind !== 'prose') {
            warn(`${key} has an unsupported offer flow block (${item.kind})`);
            return [];
          }
          return markdown(item.prose?.body, key) ?? [];
        });
      return {
        ...head,
        type: 'offer',
        surface: section.offerSurface ?? undefined,
        lead: text(section.description),
        action: action(section.action),
        presentation: section.offerPresentation,
        before: flow(section.before),
        after: flow(section.after),
        items: rows(section.listItems).map((item, index) => ({
          ...copy(item),
          icon: icon(item.icon),
          eyebrow:
            [section.numbered ? String(index + 1) : undefined, text(item.eyebrow)]
              .filter(Boolean)
              .join(' · ') || undefined,
        })),
        cards: rows(section.offerCards).map((item) => ({
          id: item.id,
          title: text(item.title),
          body: text(item.description),
          bodyHtml: markdownInlineToHtml(item.descriptionRich) || undefined,
          scene: sketch(item.scene),
          variant: item.variant,
        })),
        parts: rows(section.parts).flatMap((item) => {
          const title = text(item.title);
          return title ? [{ ...copy(item), title }] : [];
        }),
      };
    }
    case 'ComponentSharedTestimonialSection':
      return {
        ...head,
        type: 'testimonials',
        surface: section.voicesSurface ?? undefined,
        presentation: section.testimonialPresentation,
        avatarPolicy: section.avatarPolicy,
        rating: rating(section.rating),
        items: rows(section.testimonials).flatMap((item) => {
          const name = text(item.name);
          const company = text(item.company);
          const quote = quoteHtml(item.quoteHtml);
          return name && company && quote
            ? [
                {
                  id: item.documentId,
                  name,
                  company,
                  role: text(item.role),
                  quoteHtml: quote,
                  rating:
                    route !== ROUTES.home && item.ratingIsPlaceholder
                      ? undefined
                      : (item.rating ?? undefined),
                  avatar:
                    route !== ROUTES.home && item.avatarIsPlaceholder
                      ? undefined
                      : mapUploadImage(item.avatar, publicGraphqlUrl()),
                },
              ]
            : [];
        }),
      };
    case 'ComponentSharedEngagementOptions': {
      const closing = section.closing;
      return {
        ...head,
        type: 'engagement',
        surface: section.engagementSurface ?? undefined,
        presentation: section.engagementPresentation ?? undefined,
        action: action(section.action),
        lead: markdownInlineToHtml(section.engagementDescription) || undefined,
        options: rows(section.options).flatMap((option) => {
          const title = text(option.title);
          return title
            ? [
                {
                  title,
                  eyebrow: text(option.eyebrow),
                  html: markdownInlineToHtml(option.body) || undefined,
                  icon: icon(option.icon),
                  illustration: illustration(option.illustration),
                  scope: scopeNames.find(
                    (scope) => scope === option.scope?.replaceAll('_', '-'),
                  ),
                  facts: rows(option.facts).flatMap((fact) => {
                    const label = text(fact.title);
                    return label
                      ? [{ label, html: markdownInlineToHtml(fact.body) || undefined }]
                      : [];
                  }),
                },
              ]
            : [];
        }),
        terms: rows(section.terms).flatMap((term) => {
          const [, label, body] =
            /^\*\*(.+?)\*\*\s+([\s\S]+)$/.exec(term.body?.trim() ?? '') ?? [];
          const html = markdownInlineToHtml(body ?? term.body);
          return html ? [{ label, html }] : [];
        }),
        closing: closing
          ? {
              heading: text(closing.heading),
              html: markdownInlineToHtml(closing.body) || undefined,
              actions: pair(actions(closing.actions), key),
              proof: caseCard(closing.proof?.card?.resolved, 0),
              proofEyebrow: text(closing.proof?.eyebrow),
            }
          : undefined,
      };
    }
    case 'ComponentSharedIndustryGrid': {
      const links =
        section.selectionMode === 'expertise'
          ? rows(section.expertises).map(({ title, expertise }) => ({
              label: text(title) ?? text(expertise?.name),
              href: expertise?.slug ? expertisePath(expertise.slug) : undefined,
            }))
          : rows(section.destinations).map((item) => ({
              label: text(item.title),
              href: actionHref(item.href),
            }));
      return {
        ...head,
        type: 'industries',
        surface: section.industrySurface ?? undefined,
        action: action(section.action),
        links: links.flatMap(({ href, label }) => (href && label ? [{ href, label }] : [])),
      };
    }
    case 'ComponentResourceOtherResources': {
      const items = rows(section.items);
      const resources =
        section.resourcePresentation === 'rows'
          ? items.flatMap((item) => {
              if (!item.resolved)
                warn(`${key} teaser ${item.id} has no resolved published resource`);
              return item.resolved
                ? [{ ...item.resolved, id: item.id, icon: icon(item.icon), media: undefined }]
                : [];
            })
          : rows(section.resources).map((item) => ({
              id: item.documentId,
              title: text(item.thumbnail?.title) ?? text(item.title),
              href: item.slug ? `${ROUTES.insights}/${item.slug}` : undefined,
              description: text(item.thumbnail?.description) ?? text(item.description),
              formatLabel: text(item.resourceType?.name),
              readingTime: item.thumbnail?.omitReadingTime
                ? undefined
                : (text(item.thumbnail?.readingTime) ?? text(item.readingTime)),
              icon: undefined,
              media: resourceMedia(item.thumbnail),
            }));
      return {
        ...head,
        type: 'resources',
        surface: section.resourcesSurface ?? undefined,
        presentation: section.resourcePresentation,
        lead: text(section.description),
        items: resources.flatMap((item) => {
          const title = text(item.title);
          const href = actionHref(item.href);
          return title && href
            ? [
                {
                  id: item.id,
                  title,
                  href,
                  body: text(item.description),
                  label: text(item.formatLabel),
                  length: text(item.readingTime),
                  icon: item.icon,
                  media: item.media,
                },
              ]
            : [];
        }),
      };
    }
    case 'ComponentSharedCta': {
      if (section.isEnabled === false) return;
      const form = section.form;
      const submitLabel = text(form?.submitLabel);
      const successHeading = text(form?.successHeading);
      const successBody = text(form?.successBody);
      const urlLabel = formUrlLabels.find(
        (label) =>
          label.replace(/[^a-zA-Z0-9]+/g, '_').replace(/_$/, '') === form?.urlLabel ||
          label === form?.urlLabel,
      );
      const configuredForm =
        form && submitLabel && successHeading && successBody
          ? {
              variant: form.variant,
              submitLabel,
              caption: text(form.caption),
              urlLabel,
              scheduleHref: actionHref(form.scheduleHref),
              reply: text(form.replyLabel),
              success: { heading: successHeading, body: successBody },
              nextSteps: rows(form.successSteps).flatMap((step) => {
                const label = text(step.label);
                return label ? [{ label, detail: text(step.detail) }] : [];
              }),
            }
          : undefined;
      if (section.ctaType === 'form' && !configuredForm)
        warn(`${key} is missing form submit or success copy`);
      return {
        ...head,
        type: 'cta',
        surface: section.ctaSurface ?? undefined,
        variant: section.ctaType,
        presentation: section.ctaPresentation,
        island: section.island ?? undefined,
        side: section.ctaSide ?? undefined,
        eyebrow: text(section.eyebrow),
        lead: text(section.description),
        leadHtml: markdownInlineToHtml(section.descriptionRich) || undefined,
        footnote: text(section.disclaimer),
        points: texts(section.points).map((label) => ({ label })),
        rating: rating(section.rating),
        image: image(section.media),
        form: configuredForm,
        actions: pair(actions([section.button, section.secondaryButton]), key),
        contacts: rows(section.contactLinks).flatMap((contact) => {
          const label = text(contact.key);
          const value = text(contact.value);
          return label && value ? [{ label, value, href: actionHref(contact.href) }] : [];
        }),
      };
    }
    case 'ComponentSharedFaqSection':
      return {
        ...head,
        type: 'faq',
        surface: section.faqSurface ?? undefined,
        eyebrow: text(section.eyebrow),
        lead: text(section.description),
        items: rows(section.faqs).flatMap((faq) => {
          const question = text(faq.question);
          if (!question || faq.isActive === false) return [];
          const answer = answerHtml(faq.answer, `${key} ${faq.documentId}`);
          return answer ? [{ question, answerHtml: answer }] : [];
        }),
      };
    default:
      warn(`${key} is an unsupported section`);
  }
}

export const getPublishedHome = cache(async (): Promise<HomePageModel | null> => {
  const { home } = await publicGraphql<{ home: CmsHome | null }>(HOME_QUERY, 'PublishedHome');
  if (home && home.routePath !== ROUTES.home) {
    throw new Error(`New CMS Home: expected route ${ROUTES.home}, received ${home.routePath}`);
  }
  const hero = mapHero(home?.hero);
  if (home && !hero) warn('published entry is missing its required hero title');
  if (!hero) return null;
  return { hero, sections: rows(home?.content).flatMap((section) => mapBand(section) ?? []) };
});
