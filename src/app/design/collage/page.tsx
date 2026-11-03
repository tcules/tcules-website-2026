import { Prose, Section } from '@/components';
import { getKitPhoto } from '@/lib/photos';
import { Collage, type CollagePhotos } from '@/patterns';

import { Variation } from '../_specimen/Variation';

/**
 * /design/collage — a band's words in one corner and six studio photographs round them in an L
 * (owner, 3 Nov 2026, Direction A as revised). 1 is home's "The people behind Tcules" with the owner's
 * picks, crops and zoom; 2 is the same photographs with one paragraph, where the lead keeps its 3:2
 * floor; 3 is the stress case, four paragraphs, where the lead grows with the copy instead of leaving
 * a hole under the words; 4 is the set on tint, to show the tiles carry no ground of their own.
 *
 * No ink or blue band: ink and blue stay reserved grounds site-wide
 * (decisions/2026-09-24-paper-dominates-hinge-may-change-ground), and a studio band is not one of
 * their roles, so the collage is shown on paper and tint. The tiles paint nothing; the heading and
 * Prose take the band's ink as everywhere else.
 */

const PICKS: CollagePhotos = {
  lead: {
    image: getKitPhoto('studio-team-group-a', {
      alt: 'The Tcules team together in the Ahmedabad studio',
    }),
    focus: { x: 0.3, y: 0.75 },
    zoom: 1.2,
  },
  start: { image: getKitPhoto('studio-desks-plants-b'), focus: { x: 0.19, y: 0.66 }, zoom: 1.2 },
  middle: { image: getKitPhoto('studio-sticky-wall-sorting'), focus: { x: 0.5, y: 0.5 } },
  middleStart: { image: getKitPhoto('studio-book-showing-c'), focus: { x: 0.8, y: 0.5 } },
  middleEnd: {
    image: getKitPhoto('studio-desk-monitor-corner'),
    focus: { x: 0.5, y: 0.57 },
    zoom: 1.25,
  },
  end: { image: getKitPhoto('studio-desk-analyst-portrait'), focus: { x: 0.5, y: 0.5 } },
};

const P1 =
  'Tcules is a studio of product designers, design engineers and developers working side by side in Ahmedabad, a city with a long tradition of design. Since 2022 the whole team has worked from one studio. Work goes up on the wall, gets questioned in reviews and gets better because a designer and an engineer looked at it together.';
const P2 =
  'The same people explore new ideas in our Future Interfaces Lab, from AI-assisted design reviews to workflows that run across several AI models.';
const P3 =
  'A third paragraph, to show the corner with more words than the home copy has: the frame beside it keeps its shape until the copy runs taller than it.';
const P4 =
  'A fourth paragraph, to stress the corner: when the words run longer than the frame beside them, the frame grows to meet them and the lower row moves down with it, so there is never a hole under the copy or a gap above the lower row.';

const para = (...ps: string[]) => <Prose html={ps.map((p) => `<p>${p}</p>`).join('')} />;

export default function CollageSpecimen() {
  return (
    <>
      <Variation
        id="home"
        title="1 · The people behind Tcules (home)"
        note="Two paragraphs as authored. The lead is 3:2 at least and here grows with the copy; the lower row is three equal thirds, the middle a 3:2 frame over two 3:4 ones, the ends taking its height. Photos 16 apart. Below 1024 the copy sits over the lead; below 768 the lower row stacks."
      />
      <Section aria-label="Collage: the people behind Tcules">
        <Collage heading="The people behind Tcules" photos={PICKS}>
          {para(P1, P2)}
        </Collage>
      </Section>

      <Variation
        id="short"
        title="2 · One paragraph"
        note="The lead keeps its 3:2 floor and the copy sits at the top of its track."
      />
      <Section aria-label="Collage: one paragraph">
        <Collage heading="The people behind Tcules" photos={PICKS}>
          {para(P1)}
        </Collage>
      </Section>

      <Variation
        id="long"
        title="3 · Four paragraphs (stress)"
        note="The lead stretches to the copy's height; the lower row follows it down."
      />
      <Section aria-label="Collage: four paragraphs">
        <Collage heading="The people behind Tcules" photos={PICKS}>
          {para(P1, P2, P3, P4)}
        </Collage>
      </Section>

      <Variation
        id="tint"
        title="4 · On tint"
        note="The tiles paint no ground: the photographs sit straight on the band's surface."
      />
      <Section surface="tint" aria-label="Collage on tint">
        <Collage heading="The people behind Tcules" photos={PICKS}>
          {para(P1, P2)}
        </Collage>
      </Section>
    </>
  );
}
