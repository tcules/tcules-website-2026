import { Clip, Icon, Layout, Section } from '@/components';
import { HERO_CLIPS } from '@/lib/hero-clips';
import { ROUTES } from '@/lib/routes';

import { Specimen } from '../_specimen/Specimen';

/**
 * Clip — a silent film from the site's own files. Every arrangement: both renditions (16/9, with the
 * 4/5 cut replacing it below 640), the wide rendition alone, and inside a narrow column. Seen in place
 * in the Prototype Readiness Review hero.
 */

const film = HERO_CLIPS[ROUTES.prototypeReadinessReview];

const GLYPHS = {
  play: <Icon name="chrome-play" />,
  pause: <Icon name="chrome-pause" />,
  replay: <Icon name="refresh" />,
};

export default function ClipSpecimenPage() {
  if (!film) return null;
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Clip</h1>
          <p>
            A silent film played from the site&apos;s own files. It plays once when 40% of it is in
            view and holds on its last frame; scrolled away it pauses, and it resumes unless the
            reader paused it. One control in its corner: pause, play, play again. With reduced motion
            it never starts by itself. Seen in place on{' '}
            <a href={ROUTES.prototypeReadinessReview}>the Prototype Readiness Review</a>.
          </p>
        </Layout>
      </Section>

      <Section>
        <Layout rowGap="stack">
          <Specimen
            title="wide and tall · the hero's film"
            note="16/9 from 640; below it the 4/5 cut replaces it, so a phone fetches only its own file."
          >
            <Clip
              wide={film.wide}
              tall={film.tall}
              label={film.title}
              description={film.description}
              glyphs={GLYPHS}
            />
          </Specimen>

          <Specimen
            title="wide only"
            note="With no tall cut the wide rendition shows at every width, still 16/9."
          >
            <Clip wide={film.wide} label={film.title} glyphs={GLYPHS} />
          </Specimen>

          <Specimen
            title="in a narrow column"
            note="The box is the parent's width; the control keeps its 44 target and its 16 inset."
          >
            <Layout columns={{ base: 1, lg: [1, 2] }} colGap="section" rowGap="stack">
              <Clip wide={film.wide} tall={film.tall} label={film.title} glyphs={GLYPHS} />
              <p>The film takes whatever width its column gives it.</p>
            </Layout>
          </Specimen>
        </Layout>
      </Section>
    </>
  );
}
