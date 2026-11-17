import { cache } from 'react';

import type { BrandMarkName, SectionSurface } from '@/components';
import { ENDPOINTS } from '@/lib/routes';
import type { SiteFooterProps, SiteNavItem, SiteNavLink, SiteNavProps } from '@/patterns';
import type { Navigation } from '../../types';

import { actionHref, icon, rows, text } from './home';
import type { Entries } from './home-types';
import { publicGraphql } from './public-graphql';
import { SITE_FOOTER_QUERY, SITE_NAVIGATION_QUERY } from './site-chrome-query';

type Text = string | null | undefined;
type NavLink = {
  label: Text;
  href: Text;
  status: Text;
  description: Text;
  external?: boolean | null;
};
type FooterLink = {
  name: Text;
  href: Text;
  description: Text;
  icon: Text;
  isExternal?: boolean | null;
};
type NavConfiguration = {
  surface: Text;
  items: Entries<{
    id: string;
    key: Text;
    label: Text;
    form: Text;
    href: Text;
    groups: Entries<{ label: Text; links: Entries<NavLink> }>;
    aside?: { label: Text; links: Entries<NavLink> } | null;
    hub?: NavLink | null;
    children: Entries<NavLink>;
    rail?: unknown;
  }>;
  cta?: NavLink | null;
  ctaSecondary?: NavLink | null;
};
type FooterConfiguration = {
  tagline: Text;
  address: Text;
  legal: Text;
  statement: Text;
  email: Text;
  legalCredit: Text;
  addressLabel: Text;
  socialLabel: Text;
  surface: Text;
  cta?: FooterLink | null;
  rating?: { score: Text; platform: Text; mark: Text; href: Text; detail: Text } | null;
  groups: Entries<{ id: string; title: Text; links: Entries<FooterLink> }>;
  social: Entries<{
    id: string;
    label: Text;
    href: Text;
    mark: Text;
    isExternal?: boolean | null;
  }>;
  newsletter?: {
    title: Text;
    description: Text;
    fieldLabel: Text;
    placeholder: Text;
    submitLabel: Text;
    eyebrow: Text;
  } | null;
  meta: Entries<{ key: Text; value: Text; href: Text }>;
  utility: Entries<FooterLink>;
  addressLines: Entries<{ text: Text }>;
};

function warn(message: string) {
  console.warn(`New CMS site chrome: ${message}`);
}

function surface(value: Text): SectionSurface | undefined {
  if (value === 'paper' || value === 'tint' || value === 'ink' || value === 'blue')
    return value;
  if (value) warn(`unsupported surface ${value}`);
}

function brandMark(value: Text): BrandMarkName | undefined {
  if (value === 'clutch' || value === 'linkedin' || value === 'youtube') return value;
  if (value) warn(`unsupported brand mark ${value}`);
}

function navLink(value: NavLink | null | undefined): SiteNavLink | undefined {
  if (!value) return;
  const label = text(value.label);
  const href = actionHref(value.href);
  if (!label || !href || (value.status !== 'live' && value.status !== 'planned')) {
    warn('navigation link has an invalid label, URL or publication status');
    return;
  }
  return {
    label,
    href,
    status: value.status,
    description: text(value.description),
    external: value.external ?? undefined,
  };
}

function footerLink(value: FooterLink) {
  const label = text(value.name);
  const href = actionHref(value.href);
  if (!label || !href) {
    warn('footer link has an invalid label or URL');
    return;
  }
  const glyph = icon(value.icon);
  if (value.icon && !glyph) warn(`unknown footer icon ${value.icon}`);
  return {
    label,
    href,
    description: text(value.description),
    icon: glyph,
    external: value.isExternal ?? undefined,
  };
}

function mapNavigation(config: NavConfiguration | null | undefined): SiteNavProps {
  if (!config) {
    warn('published Navigation configuration is unavailable');
    return { available: false, items: [] };
  }
  const keys = new Set<string>();
  const items = rows(config.items).flatMap<SiteNavItem>((item) => {
    const key = text(item.key);
    const label = text(item.label);
    const href = actionHref(item.href);
    if (
      !key ||
      !label ||
      keys.has(key) ||
      (item.form !== 'link' && item.form !== 'mega') ||
      (item.form === 'link' && !href)
    ) {
      warn(`navigation item ${item.id} has missing, duplicate or unsupported fields`);
      return [];
    }
    keys.add(key);
    if (item.rail)
      warn(`navigation item ${key} has a retired rail with no current frontend placement`);
    return [
      {
        key,
        label,
        form: item.form,
        href,
        groups: rows(item.groups).map((group) => ({
          label: text(group.label) ?? '',
          links: rows(group.links).flatMap((link) => navLink(link) ?? []),
        })),
        aside: item.aside
          ? {
              label: text(item.aside.label),
              links: rows(item.aside.links).flatMap((link) => navLink(link) ?? []),
            }
          : undefined,
        hub: navLink(item.hub),
        children: rows(item.children).flatMap((link) => navLink(link) ?? []),
      },
    ];
  });
  return {
    items,
    cta: navLink(config.cta),
    ctaSecondary: navLink(config.ctaSecondary),
    surface: surface(config.surface),
  };
}

function mapFooter(config: FooterConfiguration | null | undefined): SiteFooterProps {
  if (!config) {
    warn('published Footer configuration is unavailable');
    return {
      available: false,
      brand: { tagline: '' },
      groups: [],
      studio: { statement: '', address: [], email: '', social: [] },
      legal: { notice: '', links: [], credit: '' },
    };
  }
  const rating = config.rating;
  const score = text(rating?.score);
  const platform = text(rating?.platform);
  const mark = brandMark(rating?.mark);
  const ratingHref = actionHref(rating?.href);
  if (rating && (!score || !platform || !ratingHref || !mark))
    warn('footer rating is incomplete');
  const addressLines = rows(config.addressLines).flatMap((line) => text(line.text) ?? []);
  const address = addressLines.length
    ? addressLines
    : text(config.address)
      ? [config.address!.trim()]
      : [];
  const newsletter = config.newsletter;
  const fieldLabel = text(newsletter?.fieldLabel);
  const submitLabel = text(newsletter?.submitLabel);
  if (newsletter && (!fieldLabel || !submitLabel))
    warn('footer newsletter is missing its labels');
  return {
    brand: {
      tagline: text(config.tagline) ?? '',
      rating:
        score && platform && ratingHref && mark
          ? { score, platform, mark, href: ratingHref, detail: text(rating?.detail) }
          : undefined,
    },
    cta: config.cta ? footerLink(config.cta) : undefined,
    groups: rows(config.groups).map((group) => ({
      title: text(group.title) ?? '',
      links: rows(group.links).flatMap((link) => footerLink(link) ?? []),
    })),
    newsletter:
      newsletter && fieldLabel && submitLabel
        ? {
            title: text(newsletter.title) ?? '',
            description: text(newsletter.description) ?? '',
            fieldLabel,
            placeholder: text(newsletter.placeholder) ?? '',
            cta: { label: submitLabel },
            action: ENDPOINTS.newsletter,
            eyebrow: text(newsletter.eyebrow),
          }
        : undefined,
    studio: {
      statement: text(config.statement) ?? '',
      address,
      email: text(config.email) ?? '',
      addressLabel: text(config.addressLabel),
      socialLabel: text(config.socialLabel),
      social: rows(config.social).flatMap((link) => {
        const label = text(link.label);
        const href = actionHref(link.href);
        if (!label || !href) {
          warn(`footer social link ${link.id} has an invalid label or URL`);
          return [];
        }
        return [
          { label, href, external: link.isExternal ?? undefined, mark: brandMark(link.mark) },
        ];
      }),
      meta: rows(config.meta).flatMap((entry) => {
        const label = text(entry.key);
        const value = text(entry.value);
        return label && value ? [{ label, value, href: actionHref(entry.href) }] : [];
      }),
    },
    legal: {
      notice: text(config.legal) ?? '',
      links: rows(config.utility).flatMap((link) => footerLink(link) ?? []),
      credit: text(config.legalCredit) ?? '',
    },
    surface: surface(config.surface),
  };
}

/** Independent cached reads let one Single Type remain available during an error in the other. */
export const getPublishedNavigation = cache(async (): Promise<Navigation> => {
  const [nav, footer] = await Promise.allSettled([
    publicGraphql<{ navigation: { configuration: NavConfiguration | null } | null }>(
      SITE_NAVIGATION_QUERY,
      'PublishedSiteNavigation',
    ),
    publicGraphql<{ footer: { configuration: FooterConfiguration | null } | null }>(
      SITE_FOOTER_QUERY,
      'PublishedSiteFooter',
    ),
  ]);
  if (nav.status === 'rejected') warn(String(nav.reason));
  if (footer.status === 'rejected') warn(String(footer.reason));
  return {
    nav: mapNavigation(nav.status === 'fulfilled' ? nav.value.navigation?.configuration : null),
    footer: mapFooter(
      footer.status === 'fulfilled' ? footer.value.footer?.configuration : null,
    ),
  };
});
