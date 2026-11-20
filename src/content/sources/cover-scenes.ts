import { DRAWN_INSIGHTS, type ArticleSceneName } from '../../lib/sketches.ts';

/**
 * Which insight carries which DRAWN cover scene, by its CMS slug (owner, 13 Oct 2026). Each scene is
 * drawn for that one article from its own argument (components/Sketch, the article scenes), and
 * stands as its cover until a real one exists. Derived from the one map of drawn insights
 * (`DRAWN_INSIGHTS`, @/lib/sketches, which the article's hero and its tools-band card read too), so a
 * drawing is assigned once: the article scenes there, keyed here by slug. Read by the insights source
 * mappers. Only live items without a cover are drawn for; fixture content falls back to photographs.
 */
export const COVER_SCENES: Readonly<Record<string, ArticleSceneName>> = Object.fromEntries(
  Object.entries(DRAWN_INSIGHTS).flatMap(([route, scene]) =>
    scene.startsWith('guide-') ? [] : [[route.replace(/^\/insights\//, ''), scene]],
  ),
) as Record<string, ArticleSceneName>;
