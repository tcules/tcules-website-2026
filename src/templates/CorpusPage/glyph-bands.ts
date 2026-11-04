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
 *   role-rows    the roles a reader picks from (open roles): OfferSheet rows, the discipline's glyph
 *                inline before the title (sheet-row-glyph-sits-inline), the title a link to the page's
 *                application with its chip picked, the meta line's facts beside it. Keyed by the
 *                discipline, the meta line's first cell, so a role the CMS adds takes its
 *                discipline's glyph without an edit. (Was four quarter tiles; critic, 4 Nov 2026.)
 *   tiles        a few peers that are kinds of PEOPLE, each a text card that looks like a card: BlockCard
 *                `tile` (its own ground, 16 radius, no edge, no hover ground), its glyph on its own row
 *                over the title, then the words (icon-heads-its-card; no circle). Not drawings: the band
 *                names qualities in people, not things a product does (owner, 4 Nov 2026,
 *                /future-interfaces-lab/join "Who we look for": "flat graphics seems the wrong idea
 *                here"). Keyed by the item's title as authored.
 *
 * docs/page-build/pages/careers.md and future-interfaces-lab-join.md, 4 Nov 2026; new arrangements,
 * owner to confirm.
 */
export type GlyphBand =
  | { arrangement: 'list-beside'; icons: Readonly<Record<string, IconName>> }
  | { arrangement: 'role-rows'; icons: Readonly<Record<string, IconName>> }
  | { arrangement: 'tiles'; icons: Readonly<Record<string, IconName>> };

const GLYPH_BANDS: Readonly<Record<string, GlyphBand>> = {
  /* The kind of person each discipline is: one who builds the whole system (a CPU, the machine under
     the agent), one who shapes what people see and use (the pen on a ruler), one who takes a product
     to market and grows it (the rising graph). docs/page-build/pages/future-interfaces-lab-join.md, pass 2. */
  [`${ROUTES.futureInterfacesLabJoin}#who-we-are-looking-for`]: {
    arrangement: 'tiles',
    icons: {
      'AI systems builders': 'cpu',
      'Product experience designers': 'ruler-pen',
      'Growth and brand operators': 'graph-up',
    },
  },
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
    arrangement: 'role-rows',
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
