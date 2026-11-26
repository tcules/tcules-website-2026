import type { IslandLink } from './LinksIsland';
import type { HomeHero, HomeSection } from './published-home-model';

/** What a way to reach the studio is, which decides its glyph. */
export type ContactChannelKind = 'email' | 'partners' | 'careers' | 'studio';

/** One way to reach the studio other than the form: its title and its one action. */
export type ContactChannel = {
  kind: ContactChannelKind;
  title: string;
  /** One line under the title, where the route needs it (the studio's street address). */
  body?: string;
  href: string;
  action: string;
};

type Head = { key: string; id?: string; heading: string; headingId: string };

export type ContactSection =
  | Extract<HomeSection, { type: 'cta' | 'faq' }>
  | (Head & { type: 'channels'; channels: ContactChannel[] })
  | (Head & { type: 'links'; links: IslandLink[] });

export type ContactPageModel = { hero: HomeHero; sections: ContactSection[] };
