import { Prose, Section } from '@/components';
import { getKitPhoto } from '@/lib/photos';
import { Collage, type CollagePhotos } from '@/patterns';

import { Variation } from '../_specimen/Variation';

/**
 * /design/collage — a band's words in one corner and six studio photographs round them in an L
 * (owner, 3 Nov 2026, Direction A as revised). 1 is /about's "The Ahmedabad studio" with the owner's
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
  'For generations, Ahmedabad has turned ideas into things people live with. Making, design and enterprise have long sat unusually close together here. NID and CEPT helped establish modern design education in India, and today they are part of a much broader design ecosystem across the city.';
const P2 =
  "Opening the studio in 2022 was about more than having an office. Working in the same place makes it easier for designers and engineers to share what they know, inspect the same product, challenge one another's thinking and take responsibility for the quality of the whole.";
const P3 =
  'It also made another ambition more tangible: a place where talented people can build a career in Ahmedabad while doing product work that reaches far beyond it. Ahmedabad is where the practice took shape. The world is where the work goes.';
const P4 =
  'A fourth paragraph, to stress the corner: when the words run longer than the frame beside them, the frame grows to meet them and the lower row moves down with it, so there is never a hole under the copy or a gap above the lower row.';

const para = (...ps: string[]) => <Prose html={ps.map((p) => `<p>${p}</p>`).join('')} />;

export default function CollageSpecimen() {
  return (
    <>
      <Variation
        id="about"
        title="1 · The Ahmedabad studio (/about)"
        note="Three paragraphs as authored. The lead is 3:2 at least and here grows with the copy; the lower row is three equal thirds, the middle a 3:2 frame over two 3:4 ones, the ends taking its height. Photos 16 apart. Below 1024 the copy sits over the lead; below 768 the lower row stacks."
      />
      <Section aria-label="Collage: the Ahmedabad studio">
        <Collage heading="The Ahmedabad studio" photos={PICKS}>
          {para(P1, P2, P3)}
        </Collage>
      </Section>

      <Variation
        id="short"
        title="2 · One paragraph"
        note="The lead keeps its 3:2 floor and the copy sits at the top of its track."
      />
      <Section aria-label="Collage: one paragraph">
        <Collage heading="The Ahmedabad studio" photos={PICKS}>
          {para(P1)}
        </Collage>
      </Section>

      <Variation
        id="long"
        title="3 · Four paragraphs (stress)"
        note="The lead stretches to the copy's height; the lower row follows it down."
      />
      <Section aria-label="Collage: four paragraphs">
        <Collage heading="The Ahmedabad studio" photos={PICKS}>
          {para(P1, P2, P3, P4)}
        </Collage>
      </Section>

      <Variation
        id="tint"
        title="4 · On tint"
        note="The tiles paint no ground: the photographs sit straight on the band's surface."
      />
      <Section surface="tint" aria-label="Collage on tint">
        <Collage heading="The Ahmedabad studio" photos={PICKS}>
          {para(P1, P2)}
        </Collage>
      </Section>
    </>
  );
}
