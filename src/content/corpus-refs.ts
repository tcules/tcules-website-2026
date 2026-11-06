import type { CorpusCaseRef, CorpusInsightRef, CorpusMediaBinding } from './corpus-types';
import { CASE_SLUG_REDIRECTS, INSIGHT_PATH_REDIRECTS } from '@/lib/routes';

import {
  getCaseStudyIndex,
  getCorpusPage,
  getCorpusRecord,
  listCorpusPages,
} from './source';

/**
 * The cases a page cites, as each case's OWN corpus page describes it (page-mapping M8, rule 5.2).
 *
 * A home page that cites the Dealpath case needs the case's name and a cover, and both are already
 * in the corpus: the name is the case page's h1 (the content team's words for it), the cover its
 * first bound asset. Reading them here keeps a template from reaching for another page, and keeps
 * the builder from writing a title nobody authored. A route with no page in the corpus is simply
 * absent from the result, so a caller can tell the case is not authored yet.
 */
export async function getCaseRefs(
  routes: readonly string[],
): Promise<Record<string, CorpusCaseRef>> {
  const refs: Record<string, CorpusCaseRef> = {};
  /* Links reach a case by its live slug (the seam rewrites them); a case's own page in the copy may
     still sit at the slug it was planned under, so that is looked up too. */
  const planned = new Map(
    Object.entries(CASE_SLUG_REDIRECTS).map(([from, to]) => [
      `/case-studies/${to}`,
      `/case-studies/${from}`,
    ]),
  );
  /* The live list, by live route: a case's thumbnail is its cover wherever its corpus page binds
     none, the same picture the /case-studies listing shows. Without the list, refs carry none. */
  const listing = routes.length
    ? await getCaseStudyIndex().catch(() => null)
    : null;
  const live = new Map(
    (listing?.listing?.cases ?? []).flatMap((record) =>
      record.href ? [[record.href, record] as const] : [],
    ),
  );
  const liveSlug = new Map(
    Object.entries(CASE_SLUG_REDIRECTS).map(([from, to]) => [
      `/case-studies/${from}`,
      `/case-studies/${to}`,
    ]),
  );
  for (const route of routes) {
    const alias = planned.get(route);
    const page = (await getCorpusPage(route)) ?? (alias ? await getCorpusPage(alias) : null);
    if (!page) continue;
    const record = live.get(route) ?? live.get(liveSlug.get(route) ?? '');
    const thumb = record?.cover;
    refs[route] = {
      route,
      title: page.hero.titleText,
      /* A V1 cover (fixtures/case-covers.ts) is the case's cover everywhere it is cited, so the case
         page's first in-page image no longer stands in for one (owner, 3 Nov 2026). */
      cover:
        thumb?.src.startsWith('/case-covers/')
          ? null
          : (page.composition.mediaBindings.find((b) => b.bound) ?? null),
      thumbnail: thumb?.src
        ? {
            src: thumb.src,
            alt: thumb.alt,
            /* A record without a measured size is drawn at the cover's 16:9. */
            width: thumb.width ?? 1600,
            height: thumb.height ?? 900,
            ...(thumb.sources ? { sources: thumb.sources } : {}),
          }
        : null,
    };
  }
  return refs;
}

/**
 * Media bindings the corpus declares on one page and another page reuses, by binding id (the studio
 * photographs `about_studio_review`, `about_work_wall`: page-mapping § 0 rule 5.3). Searches every
 * page; an id nothing binds is absent from the result.
 */
export async function getCorpusBindings(
  ids: readonly string[],
): Promise<Record<string, CorpusMediaBinding>> {
  const wanted = new Set(ids);
  const found: Record<string, CorpusMediaBinding> = {};
  for (const page of await listCorpusPages()) {
    for (const binding of page.composition.mediaBindings) {
      if (wanted.has(binding.id) && binding.bound) found[binding.id] = binding;
    }
  }
  return found;
}

/**
 * The insights a page links, as each piece's OWN corpus page describes it: its format and its length
 * as displayed (CorpusInsightRef). Links reach a piece at its live path (the seam rewrites them); a
 * piece's own page in the copy may sit at the path the copy filed it under, so that is looked up too.
 * A route with no page in the corpus is absent from the result.
 */
export async function getInsightRefs(
  routes: readonly string[],
): Promise<Record<string, CorpusInsightRef>> {
  const planned = new Map(
    Object.entries(INSIGHT_PATH_REDIRECTS).map(([from, to]) => [to, from]),
  );
  const refs: Record<string, CorpusInsightRef> = {};
  for (const route of routes) {
    const alias = planned.get(route);
    const page =
      (await getCorpusRecord(route)) ?? (alias ? await getCorpusRecord(alias) : null);
    if (!page) continue;
    const editorial = page.frontmatter.editorial;
    const length =
      editorial && typeof editorial === 'object' && 'reading_time_as_displayed' in editorial
        ? (editorial as Record<string, unknown>).reading_time_as_displayed
        : null;
    refs[route] = {
      route,
      format: page.pageType,
      length: typeof length === 'string' && length.trim() ? length.trim() : null,
    };
  }
  return refs;
}
