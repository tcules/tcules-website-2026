import { Layout, Section, type SectionSurface } from '@/components';
import { placeholderImage } from '@/lib/placeholders';
import { authorPath } from '@/lib/routes';
import { ProfileCard, ProfileFollow } from '@/patterns';

import { Specimen } from '../_specimen/Specimen';

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink'];

const BIO =
  'Leads the product and practice direction. Current focus: Product Design for complex software, the changing relationship between design and implementation, and how AI changes both.';
const LINK = { label: 'Follow on LinkedIn', href: 'https://www.linkedin.com/company/tcules' };

export default function ProfileCardSpecimen() {
  const portrait = placeholderImage('/about', 'leadership', 'jatin-leuva');
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>ProfileCard</h1>
          <p>
            A person: portrait (square or circle), name, position, bio and LinkedIn on a ruled foot,
            in TestimonialCard&rsquo;s panel. ProfileFollow is the one &ldquo;follow us&rdquo;
            banner under a set: the team photograph, the sentence, the LinkedIn link.
          </p>
        </Layout>
      </Section>
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            <Specimen title={`P.1 · two cards and the follow banner · ${surface}`}>
              <Layout rowGap="gutter">
                <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
                  <ProfileCard
                    name="Jatin Leuva"
                    role="Founder & CEO"
                    bio={BIO}
                    portrait={portrait}
                    linkedin={LINK}
                  />
                  <ProfileCard
                    name="Rakesh Chitroda"
                    role="Co-founder and commercial lead"
                    bio={BIO}
                    portrait={portrait}
                    portraitShape="circle"
                    linkedin={LINK}
                  />
                </Layout>
                <ProfileFollow
                  body="The wider studio brings designers and engineers together around the products they are responsible for."
                  link={LINK}
                  image={placeholderImage('/about', 'careers')}
                />
              </Layout>
            </Specimen>
            <Specimen
              title={`P.1a · a link to their page (the authors index), with and without LinkedIn · ${surface}`}
            >
              <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
                <ProfileCard
                  name="Jatin Leuva"
                  role="Founder and CEO"
                  portrait={portrait}
                  link={{ label: 'More from Jatin', href: authorPath('jatin-leuva') }}
                />
                <ProfileCard
                  name="Yash Gidwani"
                  role="Product Designer"
                  link={{ label: 'More from Yash', href: authorPath('yash-gidwani') }}
                />
                <ProfileCard
                  name="Rakesh Chitroda"
                  role="Co-founder"
                  bio={BIO}
                  portrait={portrait}
                  link={{ label: 'More from Rakesh', href: authorPath('rakesh-chitroda') }}
                  linkedin={LINK}
                />
              </Layout>
            </Specimen>
            <Specimen title={`P.2 · no portrait (the initials hold its square), no link · ${surface}`}>
              <Layout columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
                <ProfileCard as="div" name="A name only" role="Position" bio={BIO} />
                <ProfileFollow body="A follow banner with no photograph." link={LINK} />
              </Layout>
            </Specimen>
          </Layout>
        </Section>
      ))}
    </>
  );
}
