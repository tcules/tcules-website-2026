import { Fragment } from 'react';

import type { HeroMedia } from '@/patterns';

import { ExpertiseDirectoryBand, QuestionLedgerBand } from './ExpertiseSections';
import { PublishedHero } from './PublishedHome';
import {
  SharedSectionView,
  type PublishedServiceProps,
  type SharedSectionCtx,
} from './PublishedService';
import type {
  PublishedExpertisePage,
  PublishedExpertiseSection,
} from './published-expertise-model';

/**
 * TIER 3 — an Expertise detail page from the new CMS (`/expertise/{slug}`). The hero, then every Page
 * Content section in the editor's order. A shared section renders through `SharedSectionView`, the
 * same component it takes on a Service page; the directory and the question/role ledger through their
 * Expertise bands. The CMS decides order, presentation and variants; the page decides none of them.
 *
 * Drawings: a section's CMS illustration wins. Where the CMS has none, the drawing the frontend already
 * assigns stands in (`scenes`, `reasonFigure`, `claimFigure`, the hero's `fallbackMedia`), else the
 * labelled placeholder. Illustrations are the only fallback: every word comes from the CMS.
 */
export type PublishedExpertiseProps = Omit<PublishedServiceProps, 'page'> & {
  page: PublishedExpertisePage;
};

function ExpertiseSection({
  section,
  ctx,
}: {
  section: PublishedExpertiseSection;
  ctx: SharedSectionCtx;
}) {
  switch (section.type) {
    case 'directory':
      return <ExpertiseDirectoryBand section={section} route={ctx.route} />;
    case 'ledger':
      return <QuestionLedgerBand section={section} />;
    default:
      return <SharedSectionView section={section} ctx={ctx} />;
  }
}

export function PublishedExpertise({
  page,
  fallbackMedia,
  scenes,
  reasonFigure,
  claimFigure,
}: PublishedExpertiseProps & { fallbackMedia?: HeroMedia }) {
  const ctx: SharedSectionCtx = {
    route: page.route,
    slug: page.slug,
    family: 'expertise',
    scenes,
    reasonFigure,
    claimFigure,
  };
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <Fragment key={section.key}>
          <ExpertiseSection section={section} ctx={ctx} />
        </Fragment>
      ))}
    </>
  );
}
