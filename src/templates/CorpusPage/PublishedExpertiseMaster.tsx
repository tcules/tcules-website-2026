import { Fragment } from 'react';

import { Media } from '@/components';
import type { OfferScenes } from '@/lib/sketches';
import { OfferSheet, type HeroMedia } from '@/patterns';

import { LinkActions } from './CopyBands';
import { ExpertiseDirectoryBand, QuestionLedgerBand } from './ExpertiseSections';
import { WHY_GLYPHS } from './OfferBands';
import { PublishedHero } from './PublishedHome';
import { SharedSectionView, type SharedSectionCtx } from './PublishedService';
import type {
  ExpertiseMasterPage,
  ExpertiseMasterSection,
} from './published-expertise-master-model';
import type { PublishedServiceSection } from './published-service-model';

type Why = Extract<PublishedServiceSection, { type: 'why' }>;

/**
 * "Why founders and product teams choose Tcules" as the hubs carry it (owner, 4 Nov 2026; the
 * /services hub's CMS band): the heading, the reasons as one list down the right, each its glyph slot,
 * title and sentence, the onward link under them (OfferSheet `list`). Each card's CMS upload, chosen
 * by its own variant, sits in the glyph slot; a card with none keeps the reason's glyph. Shared with
 * the Audit Master, the other hub that carries it.
 */
export function WhyList({ section }: { section: Why }) {
  return (
    <OfferSheet
      id={section.id}
      heading={section.heading}
      headingId={section.headingId}
      surface={section.surface}
      arrangement="list"
      items={section.cards.map((card) => {
        /* The run-in's closing full stop is its punctuation, not part of the reason's name. */
        const title = card.title.replace(/\.$/, '');
        const glyph = WHY_GLYPHS[title];
        return {
          id: card.id,
          title,
          body: card.body,
          ...(card.image
            ? { iconArt: <Media image={card.image} sizes="24px" /> }
            : glyph
              ? { icon: glyph }
              : {}),
        };
      })}
      note={
        section.action ? (
          <LinkActions
            links={[
              {
                href: section.action.href,
                label: [{ type: 'text', text: section.action.label }],
                labelText: section.action.label,
              },
            ]}
          />
        ) : undefined
      }
    />
  );
}

function MasterSection({
  section,
  ctx,
}: {
  section: ExpertiseMasterSection;
  ctx: SharedSectionCtx;
}) {
  switch (section.type) {
    case 'directory':
      return <ExpertiseDirectoryBand section={section} route={ctx.route} />;
    case 'ledger':
      return <QuestionLedgerBand section={section} />;
    case 'why':
      return <WhyList section={section} />;
    default:
      return <SharedSectionView section={section} ctx={ctx} />;
  }
}

/**
 * TIER 3 — the Expertise Master (`/expertise`) from the new CMS: the hero, then every section in the
 * editor's order, each through the band the corpus hub drew it with. Drawings fall back to the
 * frontend's own; words never do.
 */
export function PublishedExpertiseMaster({
  page,
  fallbackMedia,
  scenes,
  reasonFigure,
  claimFigure,
}: {
  page: ExpertiseMasterPage;
  /** The hub's own hero drawing, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
  scenes?: OfferScenes;
  reasonFigure?: SharedSectionCtx['reasonFigure'];
  claimFigure?: SharedSectionCtx['claimFigure'];
}) {
  const ctx: SharedSectionCtx = {
    route: page.route,
    slug: page.route.slice(1),
    family: 'expertise_hub',
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
