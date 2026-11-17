import type { HomeHero } from './published-home-model';
import type { PublishedServiceSection, ServiceTile } from './published-service-model';

/** An audit card on the hub: the Audit record's name and route, with the card's own action. */
export type AuditMasterTile = ServiceTile & { action?: string };

/**
 * A Service Card set the CMS presents `wide_unframed`: each named audit its wide service tile, a whole
 * row under the band's heading, on the band's ground with no box (/audits `prototype`).
 */
export type AuditTileRowSection = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
  type: 'service-tile';
  lead?: string;
  tiles: AuditMasterTile[];
};

/** The Audit Master (`/audits`) as the new CMS publishes it: the hero, then its sections in order. */
export type AuditMasterSection = PublishedServiceSection | AuditTileRowSection;

export type AuditMasterPage = {
  route: string;
  hero: HomeHero;
  sections: AuditMasterSection[];
};
