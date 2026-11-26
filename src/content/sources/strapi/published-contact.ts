import { cache } from 'react';

import { ROUTES } from '@/lib/routes';
import type {
  ContactChannel,
  ContactChannelKind,
  ContactPageModel,
  ContactSection,
} from '@/templates/CorpusPage/published-contact-model';

import { action, mapBand, mapHero, rows, text } from './home';
import type { CmsAction, CmsHero, CmsHomeSection, Entries } from './home-types';
import { CONTACT_QUERY } from './published-contact-query';
import { publicGraphql } from './public-graphql';
import { richTextToPlainText } from './rich-text';

type Text = string | null | undefined;

type ChannelsSection = {
  __typename: 'ComponentSharedContactChannels';
  id?: string | number | null;
  heading?: Text;
  anchorId?: Text;
  channels?: Entries<{ kind?: Text; title?: Text; body?: Text; action?: CmsAction | null }>;
};

type LinksSection = {
  __typename: 'ComponentSharedLinksIsland';
  id?: string | number | null;
  heading?: Text;
  anchorId?: Text;
  links?: Entries<CmsAction>;
};

export type ContactRecord = {
  documentId: string;
  routePath?: Text;
  hero?: CmsHero | null;
  content?: Entries<CmsHomeSection | ChannelsSection | LinksSection>;
};

const warn = (message: string) => console.warn(`New CMS ${ROUTES.contact}: ${message}`);

const CHANNEL_KINDS = new Set<ContactChannelKind>(['email', 'partners', 'careers', 'studio']);
const isChannelKind = (value: Text): value is ContactChannelKind =>
  CHANNEL_KINDS.has(value as ContactChannelKind);

function mapSection(
  section: CmsHomeSection | ChannelsSection | LinksSection,
  index: number,
): ContactSection | undefined {
  const key = `${section.__typename}-${section.id ?? index}`;
  if (
    section.__typename === 'ComponentSharedContactChannels' ||
    section.__typename === 'ComponentSharedLinksIsland'
  ) {
    const heading = text(section.heading);
    if (!heading) {
      warn(`${key} has no heading; not shown`);
      return;
    }
    const id = text(section.anchorId);
    const head = { key, id, heading, headingId: `${id ?? key}-heading` };
    if (section.__typename === 'ComponentSharedLinksIsland') {
      const links = rows(section.links).flatMap((link) => {
        const mapped = action(link);
        return mapped ? [{ label: mapped.label, href: mapped.href }] : [];
      });
      return { ...head, type: 'links', links };
    }
    const channels = rows(section.channels).flatMap<ContactChannel>((channel) => {
      const title = text(channel.title);
      const link = action(channel.action);
      if (!isChannelKind(channel.kind) || !title || !link) {
        warn(`${key} has a channel without a known kind, a title or an action; not shown`);
        return [];
      }
      const body = text(channel.body);
      return [{ kind: channel.kind, title, href: link.href, action: link.label, ...(body ? { body } : {}) }];
    });
    return { ...head, type: 'channels', channels };
  }
  const mapped = mapBand(section, ROUTES.contact);
  if (mapped?.type === 'cta' || mapped?.type === 'faq') return mapped;
  if (mapped) warn(`${key} (${mapped.type}) is not a Contact section; not shown`);
}

export function mapContact(page: ContactRecord | null): ContactPageModel | null {
  if (!page) return null;
  if (page.routePath && page.routePath !== ROUTES.contact)
    throw new Error(`New CMS Contact has unexpected route: ${page.routePath}`);
  const hero = mapHero(page.hero);
  if (!hero) throw new Error('New CMS Contact is missing its hero title');
  hero.stats = rows(page.hero?.stats).flatMap((stat) => {
    const label = text(stat.label);
    const value = richTextToPlainText(stat.body);
    if (!label || !value) {
      warn('a hero stat is missing its label or value; not shown');
      return [];
    }
    return [{ value, label }];
  });
  const sections = rows(page.content).flatMap((section, index) => mapSection(section, index) ?? []);
  return { hero, sections };
}

export const getPublishedContact = cache(async () => {
  const { page } = await publicGraphql<{ page: ContactRecord | null }>(
    CONTACT_QUERY,
    'PublishedContact',
  );
  return mapContact(page);
});
