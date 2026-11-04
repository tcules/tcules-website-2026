import { Layout, Media, Section } from '@/components';

import { SHARE_DIRECTIONS, shareCardFor, shareImagePath, type ShareCard } from '../../_og';
import { listSitemapGroups } from '../../_sitemap/pages';
import { Specimen } from '../_specimen/Specimen';

/**
 * Share cards — every page's Open Graph image, as a feed shows it (tracker 6.6).
 *
 * Not a component specimen: the card is generated per page (`src/app/_og/`), so this page renders the
 * real images for every path the sitemap lists, grouped by kind, at about the 500px a LinkedIn feed
 * card is drawn at. That is the size ch10 Part C designs for ("read at 39% of the size it is drawn"),
 * and the size the owner reviews the copy cuts at.
 */
export const dynamic = 'force-dynamic';

/** Where the card is served: the segment's `opengraph-image` file, or `/og/…` for a catch-all family. */
function imageUrl(card: ShareCard): string {
  const catchAll = /^\/(services|insights)\/.+/.test(card.path) && !card.path.startsWith('/insights/authors/')
    && !card.path.startsWith('/insights/events/') && !card.path.startsWith('/insights/podcasts/');
  if (catchAll) return shareImagePath(card.path, card.id);
  return `${card.path === '/' ? '' : card.path}/opengraph-image/${card.id}`;
}

/**
 * The five pages the directions are compared on (owner, 4 Nov 2026): one per kind of picture — a case
 * banner, a hero drawing, a sector photograph, an article cover — and one page with none.
 */
const SAMPLES = [
  '/case-studies/fintech-ux-design-crypto-exchange-phoenix',
  '/services/product-design',
  '/expertise/fintech',
  '/insights/building-trust-and-transparency-in-ai-first-user-interfaces',
  '/glossary/agentic-ux',
];

const DIRECTION_NAMES = { a: 'A · Split', b: 'B · Island', c: 'C · Picture first' } as const;

const KIND_ORDER: readonly ShareCard['kind'][] = [
  'home',
  'company',
  'service',
  'expertise',
  'audit',
  'case',
  'article',
  'guide',
  'podcast',
  'video',
  'event',
  'glossary',
  'tool',
  'author',
  'listing',
  'legal',
];

export default async function ShareCardsSpecimenPage() {
  const groups = await listSitemapGroups();
  const paths = groups.flatMap((group) => group.entries.map((entry) => entry.path));
  const cards = await Promise.all(paths.map((path) => shareCardFor(path)));
  const samples = await Promise.all(SAMPLES.map((path) => shareCardFor(path)));

  return (
    <Section>
      <Layout rowGap="stack">
        <Layout rowGap="block">
          <h1>Share cards</h1>
          <p>
            The image every page sends into LinkedIn, Slack, WhatsApp and mail: ch10 Part C&rsquo;s
            layout T, generated at build from the page&rsquo;s own H1 and eyebrow. {cards.length}{' '}
            pages, shown at feed size. The hero is the H1 verbatim where it fits the 55-character
            ceiling and cut otherwise; the alt under each card is what the cut kept.
          </p>
        </Layout>
        <Layout rowGap="block">
          <h2>Directions</h2>
          <p>
            Three ways to carry each page&rsquo;s own picture: a case banner, a hero drawing, a sector
            photograph, an article cover, and a page with none. Each row is one page; each column is
            one direction.
          </p>
          {samples.map((card) => (
            <Layout key={card.path} columns={{ base: 1, lg: 3 }} colGap="gutter" rowGap="block">
              {SHARE_DIRECTIONS.map((direction) => (
                <Specimen
                  key={direction}
                  label="below"
                  title={`${DIRECTION_NAMES[direction]} — ${card.path}`}
                >
                  <Media
                    image={{
                      src: `${shareImagePath(card.path, card.id)}?direction=${direction}`,
                      alt: card.alt,
                      width: 2560,
                      height: 1340,
                      kind: 'capture',
                    }}
                    sizes="400px"
                  />
                </Specimen>
              ))}
            </Layout>
          ))}
        </Layout>
        <h2>Every page, direction A</h2>
        {KIND_ORDER.map((kind) => {
          const set = cards.filter((card) => card.kind === kind);
          if (set.length === 0) return null;
          return (
            <Layout key={kind} rowGap="block">
              <h2>
                {kind} · {set.length}
              </h2>
              <Layout columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="stack">
                {set.map((card) => (
                  <Specimen key={card.path} label="below" title={card.path} note={card.alt}>
                    <Media
                      image={{
                        src: imageUrl(card),
                        alt: card.alt,
                        width: 2560,
                        height: 1340,
                        kind: 'capture',
                      }}
                      sizes="400px"
                    />
                  </Specimen>
                ))}
              </Layout>
            </Layout>
          );
        })}
      </Layout>
    </Section>
  );
}
