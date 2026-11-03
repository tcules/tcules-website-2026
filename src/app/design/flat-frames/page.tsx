import { Icon, Layout, Section, Sketch } from '@/components';
import {
  Bento,
  ContentSection,
  DataTable,
  GatewayPaths,
  OfferParts,
  ServiceTile,
  type BentoItem,
} from '@/patterns';

import {
  FRAMES_VARIANTS,
  OWN_HIRE,
  PATHS,
  STUDIO,
  STUDIO_LEAD,
  WYG,
  framesVariantOf,
  type FramesVariant,
} from '../_specimen/flat-frames';
import styles from '../_specimen/flat-frames.module.css';
import { VariantSwitch } from '../_specimen/VariantSwitch';
import { Variation } from '../_specimen/Variation';

/**
 * EXPLORATION (3 Nov 2026, tracker 2.50) — one visual language for the flat graphics. The site frames
 * its flat drawings two ways: the dotted PLATE (most of the site) and the textured TILE (the bento and
 * the service tile). Home's "Where to start" and "One studio" link to the same services with the same
 * drawings, one in each frame. `?v=` switches the bands below between today and two directions.
 */
export default async function FlatFrames({
  searchParams,
}: {
  searchParams: Promise<{ v?: string | string[] }>;
}) {
  const variant = framesVariantOf((await searchParams).v);
  return (
    <>
      <Inventory />
      <Variation
        id="home"
        title={`Home · ${variant.name}`}
        note={NOTES[variant.key].home}
      />
      <WhereToStart variant={variant} />
      <OneStudio variant={variant} />
      <Variation
        id="product-design"
        title={`Product design · ${variant.name}`}
        note={NOTES[variant.key].pd}
      />
      <OfferParts
        heading="What you get from our product design"
        headingId="ff-wyg"
        deliverablesTitle=""
        deliverables={WYG}
        parts={[]}
      />
      <OwnHire variant={variant} />
      <VariantSwitch
        options={FRAMES_VARIANTS}
        current={variant.key}
        hrefFor={(key) => `/design/flat-frames?v=${key}#home`}
      />
    </>
  );
}

const NOTES: Record<FramesVariant['key'], { home: string; pd: string }> = {
  today: {
    home: 'Where to start: the services on dotted plates, words under them. One studio: the same services as bordered tiles with the texture, words on top, the drawing bare.',
    pd: 'What you get: plates. The services you can hire alone: tiles. Same page, both frames.',
  },
  plates: {
    home: 'Every flat drawing sits on the dotted plate, words under it. A link adds the arrow and the drawing’s move. The tile, its border and its texture leave the flat graphics (the texture stays on the islands).',
    pd: 'What you get unchanged. The services become plate cards with the service under them and its "best for" line.',
  },
  tiles: {
    home: 'A drawing you click is a tile: border, texture, words inside. A drawing you only look at is a plate. Where to start’s services become service tiles, as the 29 Oct ruling already asks for every named set of services.',
    pd: 'Unchanged from today: What you get is plates (nobody clicks them), the services are tiles.',
  },
};

/** Step 1 of 2.50: every frame a flat drawing sits in today, attribute by attribute. */
function Inventory() {
  return (
    <Section>
      <Layout rowGap="stack">
        <Layout rowGap="block">
          <h1>Flat graphic frames</h1>
          <p className={styles.prose}>
            Every flat drawing on the site sits in one of three frames. Two are the same drawing on the
            same dotted plate; the third, the tile, changes the ground, the edge, the corner, where
            the words sit and how big the drawing is. Home and the service pages show both, often for
            the same services. Switch the directions at the foot of the screen.
          </p>
        </Layout>
        <DataTable
          caption="Today’s frames"
          keyColumn={{ heading: 'Frame' }}
          columns={[
            { heading: 'Ground' },
            { heading: 'Edge' },
            { heading: 'Corner' },
            { heading: 'Words' },
            { heading: 'Drawing' },
            { heading: 'Where' },
          ]}
          rows={[
            {
              header: 'Plate',
              cellsHtml: [
                'Paper-deep, dot field',
                'None',
                '8',
                'Outside: under or beside',
                'Fills a 16:9 plate, grows with the column',
                'What you get and its terms, voice ledgers, method figures, case stories, engagement options, the trace, items in drawn sets, <strong>home’s Where to start</strong>',
              ],
            },
            {
              header: 'Tile',
              cellsHtml: [
                'Page paper, pixel-grid texture in a wave',
                'Hairline, blue on hover',
                '16',
                'Inside, on top',
                'Bare (no plate), fixed size per tile',
                '<strong>Home’s One studio</strong>, home’s What we do, /services, every “services you can hire on their own”, an insight shelf’s related service',
              ],
            },
            {
              header: 'Ruled cover',
              cellsHtml: [
                'The plate',
                'Hairline around the plate',
                '8',
                'Under the card’s cover',
                'Fills the cover',
                'Insight cards with a drawn cover, list thumbnails',
              ],
            },
          ]}
        />
        <p className={styles.prose}>
          By role: a drawing that is <strong>a link to a service</strong> takes a tile in one band and
          a plate in the next. A drawing that is <strong>an item you read</strong> is always a plate. A
          drawing that is <strong>a card’s cover</strong> is a plate with a hairline. The clash is the
          first one.
        </p>
      </Layout>
    </Section>
  );
}

function WhereToStart({ variant }: { variant: FramesVariant }) {
  return (
    <ContentSection
      eyebrow="Where to start"
      heading="Start where your product is: brand new, or already in use"
      headingId="ff-paths"
    >
      {variant.key === 'tiles' ? (
        <Layout as="ul" rowGap="column">
          {PATHS.map((path) => (
            <li key={path.id}>
              <Layout columns={{ lg: [1, 2] }} colGap="section" rowGap="block">
                <Layout rowGap="text">
                  <h3 className={styles.pathTitle}>{path.title}</h3>
                  {path.body.map((p, i) => (
                    <p key={i} className={styles.pathBody}>
                      {p}
                    </p>
                  ))}
                </Layout>
                <Layout as="ul" columns={{ base: 1, md: 3 }} colGap="gutter" rowGap="gutter">
                  {path.links.map((link) => (
                    <li key={link.href}>
                      <ServiceTile title={link.label} href={link.href} scene={link.scene} />
                    </li>
                  ))}
                </Layout>
              </Layout>
            </li>
          ))}
        </Layout>
      ) : (
        <GatewayPaths paths={PATHS} />
      )}
    </ContentSection>
  );
}

function OneStudio({ variant }: { variant: FramesVariant }) {
  return (
    <ContentSection
      eyebrow="What we do"
      heading="One studio, from the first question to working software"
      headingId="ff-studio"
      lead={STUDIO_LEAD}
    >
      {variant.key === 'plates' ? (
        <PlateCards items={STUDIO} tracks={4} />
      ) : (
        <Bento
          tracks={4}
          items={STUDIO.map<BentoItem>((s) => ({ id: s.href, title: s.title, href: s.href, scene: s.scene }))}
        />
      )}
    </ContentSection>
  );
}

function OwnHire({ variant }: { variant: FramesVariant }) {
  return (
    <ContentSection
      heading="Product design services you can hire on their own"
      headingId="ff-own"
      lead="Most projects draw on several of these. When one problem stands out, each can be hired alone."
    >
      {variant.key === 'plates' ? (
        <PlateCards items={OWN_HIRE} tracks={4} />
      ) : (
        <Bento
          tracks={4}
          items={OWN_HIRE.map<BentoItem>((s) => ({
            id: s.href,
            title: s.title,
            body: s.body,
            href: s.href,
            scene: s.scene,
          }))}
        />
      )}
    </ContentSection>
  );
}

/** Direction A's named service: the plate, then its name with the arrow, then its line. */
function PlateCards({
  items,
  tracks,
}: {
  items: readonly { title: string; href: string; scene?: Parameters<typeof Sketch>[0]['name']; body?: string }[];
  tracks: 3 | 4;
}) {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2, lg: tracks }} colGap="gutter" rowGap="column">
      {items.map((item) => (
        <li key={item.href}>
          <a href={item.href} className={styles.plateCard}>
            <Layout rowGap="text">
              <Sketch name={item.scene} story />
              <Layout rowGap="tight">
                <span className={styles.plateTitle}>
                  {item.title}
                  <span className={styles.plateArrow} aria-hidden="true">
                    <Icon name="arrow-right" />
                  </span>
                </span>
                {item.body ? <span className={styles.plateBody}>{item.body}</span> : null}
              </Layout>
            </Layout>
          </a>
        </li>
      ))}
    </Layout>
  );
}
