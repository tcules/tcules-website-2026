import type { SectionSurface } from '@/components';

import type { BrandMarkName } from '@/components';

/**
 * The site footer's information architecture, as a shape.
 *
 * Same argument as SiteNav's types: these live with the pattern because the pattern is what has to
 * render them, and @/content declares its fixture against them. A CMS remodel is absorbed inside
 * the source, not here.
 *
 * The footer is deliberately NOT one list of link groups. It is five unlike bands — brand,
 * directory, newsletter, studio, legal — and each has its own type below, because a footer built
 * out of one repeated shape is the failure the design rules name: if you squint and every block is
 * the same rectangle, it is not finished.
 */

export type SiteFooterLink = {
  label: string;
  href: string;
};

/**
 * The rating badge in the brand block — a score, and the profile it comes from.
 *
 * Not a social link: it is a claim with a source. A row of names cannot say "4.8", and a badge that
 * says it has to be reachable so the claim can be checked. Because the badge links the profile, the
 * profile is not repeated among the socials (owner, 3 Nov 2026).
 */
export type SiteFooterRating = {
  /** The platform's name, paired with its mark. 'Clutch'. */
  platform: string;
  mark: BrandMarkName;
  /**
   * The score as authored — '4.8', not 4.8. It is copy, not arithmetic: nothing formats it,
   * nothing averages it, and a trailing zero is a decision rather than a rounding artefact: a
   * profile sitting on a whole number still prints '5.0'.
   */
  score: string;
  /** The profile. One href, two consumers — Stat's source link is the other. See @/lib/routes. */
  href: string;
};

export type SiteFooterBrand = {
  /** One line under the wordmark, at --text-lead. The largest type in the band after the mark. */
  tagline: string;
  /** Optional: a footer without a rating to show simply omits it. */
  rating?: SiteFooterRating;
};

export type SiteFooterGroup = {
  title: string;
  links: SiteFooterLink[];
};

export type SiteFooterNewsletter = {
  title: string;
  description: string;
  /** The submit button's label. No href — this posts, it does not navigate. */
  cta: { label: string };
  /** Where the form posts. See ENDPOINTS in @/lib/routes: nothing serves it yet. */
  action: string;
  /** The field's accessible name. Visually hidden; a placeholder is not a label. */
  fieldLabel: string;
  placeholder: string;
};

/**
 * The studio block: one line about Tcules, where it is and how to write to it, and where else it
 * is. In that order — the statement, then the address and the email, then the profiles.
 *
 * Socials are WORDS with the off-site arrow, no marks (owner, 3 Nov 2026). Two of the four have no
 * official mark held here, and a row where some names carry a logo and some do not reads as a row
 * nobody finished.
 */
export type SiteFooterStudio = {
  statement: string;
  /** The registered address, as one line. */
  address: string;
  /** Rendered as a mailto link. The address alone, not a URL. */
  email: string;
  social: SiteFooterLink[];
};

/** The last line: the notice, the legal pages, and the icon credit the CC BY licence asks for. */
export type SiteFooterLegal = {
  /** '© 2017–2026 Tcules UX Private Limited'. Copy, not a computed year. */
  notice: string;
  links: SiteFooterLink[];
  credit: string;
};

export type SiteFooterProps = {
  brand: SiteFooterBrand;
  /** The closing action. Solid, primary, md — the last thing in the band that is not chrome. */
  cta: SiteFooterLink;
  /**
   * The directory. Drawn for six groups, in two rows of three from lg; a seventh starts a third
   * row rather than squeezing the others.
   */
  groups: SiteFooterGroup[];
  newsletter: SiteFooterNewsletter;
  studio: SiteFooterStudio;
  legal: SiteFooterLegal;
  /**
   * The ground. Defaults to `ink` — a footer's job is to end the page, and the ground changing is
   * what says the page has ended. The other three exist because a footer is a component and
   * answers on every surface, not because the site uses them.
   */
  surface?: SectionSurface;
};
