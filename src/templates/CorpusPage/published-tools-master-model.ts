import type { CorpusBlock } from '@/lib/corpus-types';

import type { HomeHero } from './published-home-model';
import type { PublishedServiceSection, ServiceArt } from './published-service-model';

/** One Tool record as its hub tile: every word and the drawing read through the Tool relation. */
export type ToolDirectoryTool = {
  id: string;
  /** The tool's own hero title, else its name. */
  title: string;
  /** The tool's `/tools/{slug}` route. */
  href: string;
  /** The tool's listing description: plain text, the tile's one paragraph. */
  body?: string;
  /** The listing's labelled facts ("Best for", "Bring", "You leave with"), in saved order. */
  facts: { label: string; text: string }[];
  /** The listing's call to action ("Try the tool"). */
  action?: string;
  /** The tool's hero illustration from the CMS; absent, the frontend's drawing for the route. */
  art?: ServiceArt;
};

export type ToolDirectoryGroup = {
  key: string;
  /** The group's anchor; a group with no heading of its own has none. */
  id?: string;
  heading?: string;
  headingId?: string;
  tools: ToolDirectoryTool[];
  /** The group's words after its set, in the corpus block model. */
  after: CorpusBlock[];
};

export type ToolDirectorySection = {
  type: 'tool-directory';
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  lead?: string;
  groups: ToolDirectoryGroup[];
  /** The directory's own words after every group. */
  after: CorpusBlock[];
};

/** The Tool Master (`/tools`) as the new CMS publishes it: the hero, then its sections in order. */
export type ToolsMasterSection = ToolDirectorySection | PublishedServiceSection;

export type ToolsMasterPage = {
  route: string;
  hero: HomeHero;
  sections: ToolsMasterSection[];
};
