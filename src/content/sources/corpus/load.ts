import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import yaml from 'js-yaml';

import type {
  CorpusBand,
  CorpusBlock,
  CorpusBreadcrumb,
  CorpusComposition,
  CorpusConversion,
  CorpusMediaBinding,
  CorpusPage,
} from '../../corpus-types.ts';
import { CASE_SLUG_REDIRECTS, INSIGHT_PATH_REDIRECTS } from '../../../lib/routes.ts';
import { parseBody } from './parse-body.ts';

/** The corpus directory: `_pages/` at the repo root, one markdown file per page. */
export const CORPUS_DIR = join(process.cwd(), '_pages');

type Dict = Record<string, unknown>;

const dict = (v: unknown): Dict =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Dict) : {};
const str = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);
const strs = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

/** `a__b.md` is `/a/b`; `home.md` is `/`. Used to assert the frontmatter route agrees. */
export function routeOfFile(file: string): string {
  const stem = file.replace(/\.md$/, '');
  return stem === 'home' ? '/' : '/' + stem.split('__').join('/');
}

export function splitFrontmatter(text: string): { data: Dict; body: string } {
  const src = text.replace(/\r\n/g, '\n');
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) throw new Error('no YAML frontmatter');
  return { data: dict(yaml.load(m[1]!)), body: src.slice(m[0].length) };
}

function mediaBinding(raw: unknown): CorpusMediaBinding {
  const b = dict(raw);
  const assetUri = str(b.asset_uri);
  const status = str(b.status) ?? '';
  return {
    id: str(b.id) ?? '',
    role: str(b.role) ?? '',
    supportsSection: str(b.supports_section) ?? '',
    card: str(b.card),
    assetUri,
    altIntent: str(b.alt_intent),
    status,
    bound:
      (status === 'BOUND_EXISTING_PUBLIC_ASSET' || status === 'SATISFIED_BY_EXISTING_ASSET') &&
      !!assetUri &&
      /^https?:\/\//.test(assetUri),
    source: str(b.source),
    caption: str(b.caption),
    attribution: str(b.attribution),
  };
}

function composition(raw: unknown): CorpusComposition {
  const c = dict(raw);
  const recognition = dict(c.client_recognition);
  const logoClients = strs(recognition.clients).length
    ? strs(recognition.clients)
    : strs(c.logo_client_ids);
  const caseMeta = dict(c.case_meta);
  const hasRecognition = Object.keys(recognition).length > 0;
  /* `selected_work` is a list of slugs or of `{slug|case|card}` records, depending on the page. */
  const selected = (Array.isArray(c.selected_work) ? c.selected_work : []).map((x) =>
    typeof x === 'string' ? x : (str(dict(x).slug) ?? str(dict(x).case) ?? str(dict(x).card)),
  );
  const caseSlugs = [
    ...new Set(
      [...selected, ...strs(c.case_study_slugs), ...strs(c.featured_case_slugs)]
        /* Some entries carry a note after the slug: `benchmark-… (related work; …)`. */
        .map((x) => (x ? (/^[a-z0-9-]+/.exec(x.trim())?.[0] ?? null) : null))
        .filter((x): x is string => !!x),
    ),
  ];
  return {
    visualPlan: str(c.visual_plan),
    mediaBindings: Array.isArray(c.media_bindings) ? c.media_bindings.map(mediaBinding) : [],
    logoClients,
    clientRecognition: hasRecognition
      ? {
          componentType: str(recognition.component_type),
          placement: str(recognition.placement),
          clients: strs(recognition.clients),
          label: str(recognition.label),
          assetPolicy: str(recognition.asset_policy),
        }
      : null,
    caseSlugs,
    testimonialIds: strs(c.testimonial_ids).length
      ? strs(c.testimonial_ids)
      : strs(dict(c.commercial_system).testimonial_ids),
    caseMeta: Object.keys(caseMeta).length ? caseMeta : null,
    raw: c,
  };
}

function conversion(raw: unknown): CorpusConversion | null {
  const c = dict(raw);
  if (!str(c.form)) return null;
  const ok = dict(c.on_success);
  const hidden = c.hidden_context;
  return {
    form: str(c.form) ?? '',
    anchor: str(c.anchor) ?? '',
    visibleFields: strs(c.visible_fields),
    optionalFields: strs(c.optional_fields),
    submitLabel: str(c.submit_label) ?? '',
    hiddenContext: Array.isArray(hidden)
      ? strs(hidden)
      : (str(hidden)
          ?.split(',')
          .map((s) => s.trim())
          .filter(Boolean) ?? []),
    onSuccess: str(ok.heading)
      ? {
          heading: str(ok.heading) ?? '',
          body: str(ok.body) ?? '',
          retainEnteredData: ok.retain_entered_data === true,
        }
      : null,
    processor: str(c.processor),
    schedulingLabel: str(c.scheduling_label),
  };
}

type QuoteBlock = Extract<CorpusBlock, { type: 'quote' }>;

/** Every quote of the hero and the bands, in document order (items' quotes where they sit). */
function quotesIn(blocks: readonly CorpusBlock[]): QuoteBlock[] {
  return blocks.flatMap((block) =>
    block.type === 'quote' ? [block] : block.type === 'item' ? quotesIn(block.blocks) : [],
  );
}

/**
 * Give each quote its testimonial id. The frontmatter lists the ids a page cites in the order its
 * quotes are written (checked on the ten pass-1 pages, 10 Oct 2026), and nothing in the body names
 * them, so the match is positional and only made when the counts agree. A page whose counts differ
 * keeps null ids, and its quotes render without per-review data rather than with another
 * client's.
 */
function assignTestimonialIds(bands: readonly CorpusBand[], ids: readonly string[]) {
  const quotes = quotesIn(bands.flatMap((band) => band.blocks));
  if (quotes.length === 0 || quotes.length !== ids.length) return;
  quotes.forEach((quote, index) => {
    quote.testimonialId = ids[index] ?? null;
  });
}

/** Parse one corpus file's text into a page. Throws with the file name on a malformed file. */
/**
 * Every link to a case study points at its LIVE slug (component-map C3, 29 Oct 2026), and every link
 * to an insight the copy files elsewhere at its live path (INSIGHT_PATH_REDIRECTS, 29 Oct 2026). The copy links
 * the slugs its own case pages were planned under; the 20 live cases keep Strapi's (owner, 11 Oct
 * 2026), and `CASE_SLUG_REDIRECTS` names the move. Rewritten here, at the seam, so no page reaches a
 * case through a redirect and no template learns that two slugs exist. Pure: a new tree, the words
 * untouched.
 */
const CASE_PATH = /^\/case-studies\/([^/#?]+)(.*)$/;
function liveHref(href: string): string {
  /* An insight the copy files under another format or slug (INSIGHT_PATH_REDIRECTS), likewise. */
  const [path = '', ...rest] = href.split('#');
  const insight = INSIGHT_PATH_REDIRECTS[path];
  if (insight) return [insight, ...rest].join('#');
  const match = CASE_PATH.exec(href);
  const live = match ? CASE_SLUG_REDIRECTS[match[1] ?? ''] : undefined;
  return live ? `/case-studies/${live}${match?.[2] ?? ''}` : href;
}
function liveCaseLinks<T>(node: T): T {
  if (Array.isArray(node)) return node.map(liveCaseLinks) as T;
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] =
        key === 'href' && typeof value === 'string' ? liveHref(value) : liveCaseLinks(value);
    }
    return out as T;
  }
  return node;
}

export function parseCorpusFile(file: string, text: string): CorpusPage {
  try {
    const { data, body } = splitFrontmatter(text);
    const route = str(data.route);
    if (!route) throw new Error('frontmatter has no route');
    const seo = dict(data.seo);
    const social = dict(data.social);
    const nav = dict(data.navigation);
    const render = dict(data.render);
    const release = dict(data.release);
    const search = dict(data.search_context);
    const structured = dict(data.structured_data);
    const { hero, bands } = liveCaseLinks(parseBody(body));
    const comp = composition(data.page_composition);
    assignTestimonialIds(bands, comp.testimonialIds);
    return {
      route,
      slug: str(data.slug) ?? route.split('/').filter(Boolean).pop() ?? 'home',
      name: str(data.page_name) ?? hero.titleText,
      pageType: str(data.page_type) ?? 'page',
      seo: {
        title: str(seo.title) ?? '',
        description: str(seo.description) ?? '',
        canonical: str(seo.canonical) ?? '',
        robots: str(seo.robots) ?? '',
        ogImageAlt: str(social.og_image_alt),
      },
      breadcrumb: (Array.isArray(nav.breadcrumb) ? nav.breadcrumb : []).map(
        (b): CorpusBreadcrumb => ({
          name: str(dict(b).name) ?? '',
          url: str(dict(b).url) ?? '',
        }),
      ),
      conversion: conversion(data.conversion),
      bandOrder: strs(render.band_order),
      searchContext: {
        primaryIntent: str(search.primary_intent),
        primaryBuyerQuestion: str(search.primary_buyer_question),
        supportingQuestions: strs(search.supporting_questions),
        primaryQuery: str(search.primary_query),
        secondaryQueries: strs(search.secondary_queries),
        keyEntities: strs(search.key_entities),
      },
      structuredData: {
        types: strs(structured.types),
        organizationRef: str(structured.organization_ref),
        raw: structured,
      },
      composition: comp,
      release: {
        contentState: str(release.content_state),
        siteReleaseState: str(release.site_release_state),
      },
      hero,
      bands,
      frontmatter: data,
      file: `_pages/${file}`,
    };
  } catch (e) {
    throw new Error(`${file}: ${e instanceof Error ? e.message : String(e)}`);
  }
}

let cache: CorpusPage[] | null = null;
/** The newest modification time among the corpus files when `cache` was filled. */
let cacheStamp = 0;

/**
 * The corpus's freshness stamp. A dev server keeps this module alive across `_pages/` edits and
 * branch checkouts (a markdown file is not in the module graph), so a module-level cache served the
 * copy as it stood when the server started (round 5, 30 Oct 2026). Stat'ing ~100 files is cheap.
 */
const stampOf = (dir: string, files: readonly string[]): number =>
  files.reduce((max, f) => Math.max(max, statSync(join(dir, f)).mtimeMs), 0) + files.length;

/**
 * Every FIRST- and SECOND-level page (`home`, `about`, `services__product-design`), and the level-2
 * services (`services__product-design__ux-research`, polished tier for 6 Nov: owner, 31 Oct 2026),
 * parsed once per process and sorted by route. The other files three levels deep
 * (`insights__articles__…`: the live insights ship from Strapi; author pages are phase 2) are skipped.
 */
const inCorpus = (parts: readonly string[]): boolean =>
  parts.length <= 2 || (parts.length === 3 && parts[0] === 'services');

export function loadCorpus(dir: string = CORPUS_DIR): CorpusPage[] {
  const dev = process.env.NODE_ENV !== 'production';
  if (dir === CORPUS_DIR && cache && !dev) return cache;
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.md') && inCorpus(f.replace(/\.md$/, '').split('__')),
  );
  const stamp = dir === CORPUS_DIR && dev ? stampOf(dir, files) : 0;
  if (dir === CORPUS_DIR && cache && stamp === cacheStamp) return cache;
  const pages = files
    .map((f) => parseCorpusFile(f, readFileSync(join(dir, f), 'utf8')))
    .sort((a, b) => a.route.localeCompare(b.route));
  if (dir === CORPUS_DIR) {
    cache = pages;
    cacheStamp = stamp;
  }
  return pages;
}
