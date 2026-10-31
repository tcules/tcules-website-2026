import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* Helpers come from ../offer and ../scenes (Rect, Copy, Hop, Glyph, Focus, Hatched, TraceIn, GrowIn ...)
   and classes from ../Sketch.module.css. Still plates: these never move, so draw the finished picture. */

/**
 * /expertise/proptech-contech-field-operations · What you get. One drawing per item, each from that item's own words
 * (docs/research/flat-graphics/drawing-brief.md). An item left undefined shows the empty plate.
 */
export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* An audit of the live product: An audit of the live product: which parts cause trouble and which parts people rely on */
  'wyg-proptech-contech-field-operations-audit-live-product': undefined,
  /* Research at desks and on site: Research at desks and on site, where signal, gloves and interruptions change the work */
  'wyg-proptech-contech-field-operations-research-at-desks-site': undefined,
  /* Every role in the sign-off chain: Every role in the sign-off chain named, with what each must see before acting */
  'wyg-proptech-contech-field-operations-every-role-signoff-chain': undefined,
  /* One record of each property: One record of each property, project or site, designed for every role around it */
  'wyg-proptech-contech-field-operations-one-record-each-property': undefined,
  /* Field moments tried in working prototypes: The field moments, such as location, offline use and interruptions, tried in working prototypes where a static mock-up would hide them */
  'wyg-proptech-contech-field-operations-field-moments-tried-working': undefined,
  /* A change that fits your existing product: A change that fits your existing product and its technical limits, with the product questions answered for your engineers or ours */
  'wyg-proptech-contech-field-operations-change-fits-existing-product': undefined,
  /* Who does the work: A senior product designer heads the work and designs it, backed by an account lead. Researchers join for site visits, and design engineers o */
  'team-proptech-contech-field-operations': undefined,
  /* What we need from you: Access to people in the office and on site, the live product and its known limits, and the person who decides what ships. For field work, we */
  'needs-proptech-contech-field-operations': undefined,
  /* Where our part stops: Valuation models, BIM data, integrations and building codes stay with your engineers and domain specialists; our design presents them clearl */
  'stops-proptech-contech-field-operations': undefined,
};
