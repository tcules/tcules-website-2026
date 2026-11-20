import type { HomeSection } from './published-home-model';

type Cta = Extract<HomeSection, { type: 'cta' }>;

/**
 * The enquiry close as an ink band (decisions/2026-11-18-enquiry-close-is-an-ink-band): a CMS close whose
 * island is set to **ink** renders as the band, with the tick points, the client's quote block, no drawing,
 * and the card asking Name and Work email. A close left on blue (or unset) renders the blue halves island
 * as before, so each page switches when its content does, and a content restore switches it back.
 */
export function isInkClose(section: Cta): boolean {
  return section.island === 'ink' && section.variant === 'form' && section.form?.variant !== 'compact';
}

/** The CtaSection props the ink close sets; spread after the template's own so they win. */
export function inkCloseProps(section: Cta) {
  return {
    island: 'ink' as const,
    islandArrangement: 'halves' as const,
    islandTexture: 'flow' as const,
    frame: 'band' as const,
    markers: 'tick' as const,
    quote: section.quote,
    art: undefined,
  };
}

/**
 * The ink close as an ink ISLAND on paper, for a close that is the last band before the ink footer
 * (/insights and its listings, the authors index, the author pages): the band would run into the
 * footer (owner, 20 Nov 2026: "Ink island on paper"). Everything else is the band's: ticks, the quote,
 * no drawing.
 */
export function inkIslandProps(section: Cta) {
  return {
    island: 'ink' as const,
    islandArrangement: 'halves' as const,
    islandTexture: 'flow' as const,
    markers: 'tick' as const,
    quote: section.quote,
    art: undefined,
  };
}

/** The ink close's card asks the name first, and the email in the board's words. */
export const INK_CLOSE_DRESS = { name: true, emailLabel: 'Work email' } as const;
