import type { SectionSurface } from '@/components';

/**
 * The site navigation's information architecture, as a shape.
 *
 * These types are the CONTRACT between the nav and whatever supplies it — a fixture today, a CMS
 * collection later. They live with the pattern rather than in @/content because the pattern is
 * what has to render them: the view model is driven by what a component needs as props, not by
 * what a source happens to store. @/content imports them and declares the fixture against them,
 * which is the direction the seam runs.
 *
 * ── The load-bearing decision: EVERY item carries its children ──────────────────────────────────
 Work renders as a plain link today. Its children are in the data anyway, on `children`,
 * unrendered. Two reasons, both from docs/specs/SiteNav.md §2.1.
 *
 * First, switching a link to a menu later is a change to ONE FIELD on one record — `form: 'link'`
 * becomes `form: 'mega'` and the groups are already written — rather than a content migration
 * done under time pressure by whoever is on the ticket.
 *
 * Second, these same records are meant to feed the footer, the in-page section navigation and the
 * sitemap. A child that exists in one of those and not another is a bug a build can catch, and it
 * can only catch it if there is one list to compare against.
 *
 * ── Why this replaced a list of blocks ──────────────────────────────────────────────────────────
 * The previous shape was a `SiteNavBlock[]` per item — rows, rail, bar — which let a panel be
 * anything and therefore made every panel a separate design. The revised IA is narrower on
 * purpose: a mega is GROUPS of links, plus at most one aside. Two shapes instead of an open set,
 * which is what lets one plate morph between three sections rather than three panels blink in and
 * out of existence.
 */

/**
 * Does the page behind this link exist yet?
 *
 * `planned` means the route is decided and the page is not built. The link still renders, and it
 * renders IDENTICALLY to a live one — see the note on the type below. This flag is not for the
 * nav: it is for the sitemap generator, which must not submit a holding page to a search engine.
 */
export type SiteNavStatus = 'live' | 'planned';

/**
 * How a bar item behaves.
 *
 *   mega     opens the plate: its groups side by side, optionally an aside
 *   link     navigates. `children` is carried and not rendered
 *
 * `compact` (a mega at a narrow width) went with the plate's three widths: the plate now spans the
 * content column for every section (owner, 4 Nov 2026), so there is no narrow width to hold it to.
 */
export type SiteNavForm = 'mega' | 'link';

/**
 * A destination and its label. The atom every group is built out of.
 *
 * `status` is required rather than optional, and on every link rather than only the unbuilt ones.
 * An optional flag makes "no page yet" and "nobody filled this in" the same value, and the second
 * of those is the one that ships by accident.
 */
export type SiteNavLink = {
  label: string;
  href: string;
  status: SiteNavStatus;
  /**
   * One line under the label, in the plate only (the sheet shows labels alone). Optional: a group
   * of plain names (twelve sectors) reads as a list, a group of services needs the line that says
   * which situation each one answers. A list whose links carry one opens its row seam a step, so
   * each label and its line read as one item.
   */
  description?: string;
  /** Off-site. Opens in a new tab and carries the external cue beside its label. */
  external?: boolean;
};

/** A named list of links — one column of a plate, one block of a sheet pane. */
export type SiteNavGroup = {
  label: string;
  links: readonly SiteNavLink[];
};

/**
 * The plate's aside: the way onward from a section, on its own deeper ground at the plate's right.
 *
 * It replaced the image-led rail (owner, 4 Nov 2026, header round 3). What it holds is per section
 * and is content: Services keeps How we work, Expertise the work, Resources its featured pieces.
 * `label` is optional because Services' aside is one link that needs no heading; where there is
 * one it is the same mono label every group carries. The item's `hub` closes the aside.
 */
export type SiteNavAside = {
  label?: string;
  links: readonly SiteNavLink[];
};

/**
 * A top-level bar item.
 *
 * `href` is required in practice when `form` is `'link'` and meaningless otherwise — a mega's
 * trigger opens rather than navigates, because a control that does both has to pick one on click
 * and is wrong for half its users. It is typed optional rather than as a discriminated union
 * deliberately: the union would make `form` unchangeable without also restructuring the record,
 * and being able to flip that one field is the whole point of §2.1.
 */
export type SiteNavItem = {
  /** Stable identity for open/closed state. Not derived from the label, which is editorial. */
  key: string;
  label: string;
  form: SiteNavForm;
  /** Where the item goes when `form` is `'link'`. Ignored by a mega. */
  href?: string;
  /** The plate's columns, one per group. `mega` only. */
  groups?: readonly SiteNavGroup[];
  /** The plate's aside, at its right edge. Omit and the groups take the whole plate (Studio). */
  aside?: SiteNavAside;
  /**
   * The way through to the section's own index ("All services"). It closes the aside, pinned to
   * its foot; a section with a hub and no aside carries it under its groups instead.
   */
  hub?: SiteNavLink;
  /**
   * The children of a `link` item — carried, not rendered. See the header.
   *
   * Typed on every item rather than only on links so that flipping `form` needs no other edit,
   * but only a `link` has anywhere to put them today.
   */
  children?: readonly SiteNavLink[];
};

export type SiteNavProps = {
  /** False when the published configuration cannot be read. */
  available?: boolean;
  items: readonly SiteNavItem[];
  /**
   * The offer. Solid primary, always — it is the one thing the bar asks for.
   *
   * Rendered in the bar above the breakpoint and at the right of the sheet's sticky foot below it,
   * where the primary belongs under the right thumb.
   */
  cta?: SiteNavLink;
  /**
   * An optional lighter way in, ghost neutral, MOBILE ONLY — beside the offer in the sheet's foot.
   *
   * It has no place in the bar: a bar with two actions has no offer, it has a choice. Omit it and
   * the offer takes the whole foot, which is what the site does since "Request audit" left the
   * header (owner, 4 Nov 2026).
   */
  ctaSecondary?: SiteNavLink;
  /**
   * The ground the bar, the plate and the sheet paint. Defaults to `paper`.
   *
   * One prop for all three on purpose: a header whose plate is a different surface from its bar
   * reads as two components that happen to be adjacent.
   */
  surface?: SectionSurface;
};
