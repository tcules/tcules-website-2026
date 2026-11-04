import type { IconName } from '@/components';
import { ROUTES } from '@/lib/routes';

/**
 * Bands set as a glyph-led set, by route and band: the composition each takes and the Solar Bold glyph
 * for each item. Read by the renderer (OfferBands) and by the plan, which counts these bands as visual
 * (an icon set) in the rhythm check. Opt-in per band, so no other band of the same kind changes.
 *
 *   list-beside  the /about "Who uses Tcules" composition (decisions/2026-11-01-bodiless-row-title-two-lines):
 *                the heading in the start half, the items as bodiless ListCard rows in the end half,
 *                each led by its glyph, the band's closing line under the list. A checklist a reader
 *                checks themselves against reads down, one item per row, never a grid.
 *                Keyed by the item's words as authored.
 *   role-tiles   peers to pick from (open roles): boxed ListCard tiles, glyph, title, meta line, each on
 *                its own row (icon-heads-its-card), the whole set in one row from 1024 where the count
 *                allows. Keyed by the discipline, the meta line's first cell, so a role the CMS adds
 *                takes its discipline's glyph without an edit.
 *
 * docs/page-build/pages/careers.md, 4 Nov 2026; new arrangements, owner to confirm.
 */
export type GlyphBand =
  | { arrangement: 'list-beside'; icons: Readonly<Record<string, IconName>> }
  | { arrangement: 'role-tiles'; icons: Readonly<Record<string, IconName>> };

const GLYPH_BANDS: Readonly<Record<string, GlyphBand>> = {
  [`${ROUTES.careers}#what-we-look-for`]: {
    arrangement: 'list-beside',
    icons: {
      'Noticing what is really going on before reaching for a fix.': 'eye',
      'Explaining a choice plainly, and taking good critique well.': 'chat-round-dots',
      'Curiosity about unfamiliar fields.': 'compass',
      'Care for real content and awkward edge cases.': 'checklist',
      'Knowing where AI tools tend to go wrong.': 'magnifier-bug',
      'Ownership, with progress shown as you go.': 'flag',
    },
  },
  [`${ROUTES.careers}#open-roles`]: {
    arrangement: 'role-tiles',
    icons: {
      Design: 'ruler-pen',
      Engineering: 'code-square',
      'Marketing and visual communication': 'palette',
    },
  },
};

/** The glyph-led set a band is set as on this route, if any (`GLYPH_BANDS`). */
export function glyphBand(route: string, bandId: string): GlyphBand | undefined {
  return GLYPH_BANDS[`${route}#${bandId}`];
}
