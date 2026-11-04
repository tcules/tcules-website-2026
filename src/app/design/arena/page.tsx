import { Arena, Icon, Layout, Section } from '@/components';

import { Specimen } from '../_specimen/Specimen';

const SRC = '/illustrations/home/arena.svg';
const LABEL =
  'A field of similar grey apps; one rises and opens onto a studio floor where people and agents build its new screen.';
const GLYPHS = { play: <Icon name="chrome-play" />, pause: <Icon name="chrome-pause" /> };

export default function ArenaSpecimen() {
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Arena</h1>
          <p>
            The home hero&rsquo;s animated drawing (owner, 2 Nov 2026). A field of grey apps
            holds for half a second, one rises and opens, and underneath a client, a researcher,
            a designer and an engineer work with agents until the finished card flies up into
            the app. It loops every 11.8 seconds. The SVG is fetched after the page paints; the
            clock stops out of view; under reduced motion the finished frame stands until play
            is pressed. Below 640 the box is square and the camera holds on the studio floor.
          </p>
        </Layout>
      </Section>
      <Section>
        <Layout rowGap="stack">
          <Specimen title="Full column" note="1024/720 from 640, 1/1 below it">
            <Arena src={SRC} label={LABEL} glyphs={GLYPHS} />
          </Specimen>
          <Specimen title="In the hero's media track" note="half the column, as at 1024 on /">
            <Layout columns={{ base: 1, lg: [1, 1] }} colGap="section" rowGap="stack">
              <div />
              <Arena src={SRC} label={LABEL} glyphs={GLYPHS} />
            </Layout>
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
