import { Fragment } from 'react';

import { Layout, Media } from '@/components';
import { serviceSceneFor, type OfferScenes } from '@/lib/sketches';
import { ContentSection, ServiceTile, type HeroMedia } from '@/patterns';

import { WhyList } from './PublishedExpertiseMaster';
import { PublishedHero } from './PublishedHome';
import { SharedSectionView, type SharedSectionCtx } from './PublishedService';
import type {
  AuditMasterPage,
  AuditMasterSection,
  AuditTileRowSection,
} from './published-audit-master-model';

/**
 * Named audits apart from the chooser (/audits `prototype`): each its wide service tile, a whole row
 * under the band's heading on the band's ground with no box, as the corpus hub drew it (CopyBands
 * `RelatedBand`; named-services-are-service-tiles, media-rows-take-a-whole-row). The CMS drawing wins;
 * else the drawing the frontend files under the audit's route.
 */
function AuditTileRows({ section }: { section: AuditTileRowSection }) {
  return (
    <ContentSection
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      surface={section.surface}
      lead={section.lead}
      data-band="service-tile"
    >
      <Layout as="ul" rowGap="column">
        {/* The tile is one anchor: a card with no link (warned at the seam) has nothing to open. */}
        {section.tiles.flatMap(({ href, ...tile }) => {
          if (!href) return [];
          const scene = tile.art?.scene ?? (tile.art?.image ? undefined : serviceSceneFor(href));
          return (
            <li key={tile.id} data-media-row="">
              <ServiceTile
                title={tile.title}
                {...(tile.body ? { body: tile.body } : {})}
                href={href}
                {...(scene ? { scene } : {})}
                {...(tile.art?.image
                  ? {
                      picture: (
                        <Media image={tile.art.image} sizes="(min-width: 768px) 45vw, 90vw" />
                      ),
                    }
                  : {})}
                {...(tile.action ? { action: tile.action } : {})}
                wide
                frame="none"
              />
            </li>
          );
        })}
      </Layout>
    </ContentSection>
  );
}

function MasterSection({
  section,
  ctx,
}: {
  section: AuditMasterSection;
  ctx: SharedSectionCtx;
}) {
  switch (section.type) {
    case 'service-tile':
      return <AuditTileRows section={section} />;
    case 'why':
      return <WhyList section={section} />;
    default:
      return <SharedSectionView section={section} ctx={ctx} />;
  }
}

/**
 * TIER 3 — the Audit Master (`/audits`) from the new CMS: the hero, then every section in the editor's
 * order, each through the band the corpus hub drew it with. Drawings fall back to the frontend's own;
 * words never do.
 */
export function PublishedAuditMaster({
  page,
  fallbackMedia,
  scenes,
  reasonFigure,
  claimFigure,
}: {
  page: AuditMasterPage;
  /** The hub's own hero drawing, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
  scenes?: OfferScenes;
  reasonFigure?: SharedSectionCtx['reasonFigure'];
  claimFigure?: SharedSectionCtx['claimFigure'];
}) {
  const ctx: SharedSectionCtx = {
    route: page.route,
    slug: page.route.slice(1),
    family: 'audits_hub',
    scenes,
    reasonFigure,
    claimFigure,
  };
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <Fragment key={section.key}>
          <MasterSection section={section} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
