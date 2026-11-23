import { cache } from 'react';

import type { HomeHero } from '@/templates/CorpusPage/published-home-model';

import { getPublishedHome } from './sources/strapi/home';

/**
 * ONE client list (owner, 23 Nov 2026: "all pages that show logos, show the same 1 list that is shown
 * on the homepage"; decisions/2026-11-23-client-logos-are-the-ticker). The list is Home's hero logos
 * as Strapi publishes them: title, clients and their mark overrides. Every other page that shows client
 * logos shows that list, so an editor changes it in one place. /clients is the exception: it is the
 * client list itself and keeps its own.
 */
type Logos = NonNullable<HomeHero['recognition']>;

const homeLogos = cache(async (): Promise<Logos | undefined> => {
  const home = await getPublishedHome();
  const logos = home?.hero.recognition;
  return logos?.marks.length ? logos : undefined;
});

type Page = { hero: HomeHero };

type Placement = {
  /** Show the list under the hero (the overhaul's service, expertise, audit, About, Careers and How
   *  we work heroes). */
  hero?: boolean;
  /** A logo band type the page no longer draws, because its logos now sit under the hero. */
  drop?: string;
};

/** Every logo band on the page (a section with `marks`, in any of its section lists) takes the list. */
function withBandLogos<P extends object>(page: P, logos: Logos, drop?: string): P {
  const out: Record<string, unknown> = { ...(page as Record<string, unknown>) };
  for (const [key, field] of Object.entries(page)) {
    if (!Array.isArray(field)) continue;
    out[key] = field
      .filter(
        (item) => !(drop && item && typeof item === 'object' && (item as { type?: unknown }).type === drop),
      )
      .map((item) =>
        item && typeof item === 'object' && Array.isArray((item as { marks?: unknown }).marks)
          ? { ...item, marks: logos.marks }
          : item,
      );
  }
  return out as P;
}

async function place<P extends Page>(page: P | null, placement: Placement): Promise<P | null> {
  if (!page) return page;
  const logos = await homeLogos();
  if (!logos) return page;
  const banded = withBandLogos(page, logos, placement.drop);
  return placement.hero ? { ...banded, hero: { ...banded.hero, recognition: logos } } : banded;
}

/** Wraps a page getter so the page shows Home's client list (see `Placement`). */
export function withClientLogos<A extends unknown[], P extends Page>(
  get: (...args: A) => Promise<P | null>,
  placement: Placement = {},
): (...args: A) => Promise<P | null> {
  return async (...args) => place(await get(...args), placement);
}
