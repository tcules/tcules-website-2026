import type { CorpusPage } from '@/lib/corpus-types';
import { heroImage } from './images';
import { serviceIllustration } from '@/lib/service-illustrations';

import { CorpusHero } from './blocks';
import { UnitView, type OfferContext } from './OfferBands';
import { planOffer } from './plan';

export type OfferPageProps = Omit<OfferContext, 'page'> & {
  page: CorpusPage;
};

/**
 * TIER 3 — the offer page: a service, an audit or an expertise page from the `_pages/` corpus
 * (page-mapping § 1.1). One template for the three because they share one argument — what is wrong,
 * what we do about it, what it looked like, how to start — and one close: the enquiry form.
 *
 * Every band's shape and place is decided once, in plan.ts, from the structure of its words and the
 * page's rhythm; this file composes the hero, then places each planned unit, in the corpus's own
 * order. It makes four decisions for every page:
 *
 *   1. The hero opens on a drawing beside the copy: the service line's own illustration where a
 *      page keeps one on purpose, else the register's labelled placeholder (illustration 5:4).
 *      The eyebrow, title, lede and asks are verbatim; the first ask is the page's one blue solid.
 *   2. Paper carries the page. Tint marks the close, and two tints never touch. A client's quote
 *      sits beside the case it is about, inside that case's band (home round 2), not on a tint band
 *      of its own.
 *   3. Photographs alternate sides down the page; a media split is never a third in a row.
 *   4. It closes on the enquiry form, split, the page's one ask made once more.
 */
export function OfferPage({
  page,
  caseRefs,
  shared,
  ratings,
  avatars,
  scenes,
  reasonFigure,
  claimFigure,
}: OfferPageProps) {
  const drawing = serviceIllustration(page.route);
  const units = planOffer(
    page,
    new Set(Object.keys(scenes?.items ?? {})),
    drawing ? 'isometric' : 'photo',
  );
  const ctx: OfferContext = { page, caseRefs, shared, ratings, avatars, scenes, reasonFigure, claimFigure };

  const media = drawing
    ? ({
        type: 'image',
        image: {
          src: drawing.src,
          width: drawing.width,
          height: drawing.height,
          alt: drawing.alt,
          kind: drawing.kind,
        },
        cut: drawing.cut,
      } as const)
    : ({
        type: 'image',
        image: heroImage(page),
      } as const);

  return (
    <>
      {/* The studio's record line is the hero's figures: CorpusHero reads it from the hero itself
          (decisions/2026-10-29-studio-record-is-figures). The hero's "Selected … work:" line names the cases the page lists further down; where it
          does list them (a case band), the line only repeats that list and read as unfinished
          (owner, 11 Oct 2026), so it is not rendered. Logged as proposal P46. */}
      <CorpusHero
        page={page}
        arrangement="beside"
        media={media}
        proofLine={!units.some((unit) => unit.kind === 'cases' || unit.kind === 'caseStories')}
      />
      {units.map((unit) => (
        <UnitView key={unit.id} unit={unit} ctx={ctx} />
      ))}
    </>
  );
}
