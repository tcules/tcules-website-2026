import { Layout, Section, type SectionSurface } from '@/components';
import { placeholderImage } from '@/lib/placeholders';
import { Contributors } from '@/patterns';

import { Specimen } from '../_specimen/Specimen';

const SURFACES: readonly SectionSurface[] = ['paper', 'tint', 'ink', 'blue'];

export default function ContributorsSpecimen() {
  const shoghi = placeholderImage('/about', 'leadership', 'jatin-leuva');
  const rushali = placeholderImage('/about', 'leadership', 'rakesh-chitroda');
  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>Contributors</h1>
          <p>
            The people behind a piece, after its content: &ldquo;About the author&rdquo;,
            &ldquo;About the authors&rdquo;, &ldquo;In this episode&rdquo;. Portrait (or
            initials), name, role, and a link to more from them when they have a page (byline
            board G, 30 Oct 2026).
          </p>
        </Layout>
      </Section>
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="stack">
            <Specimen title={`C.1 · one author · ${surface}`}>
              <Contributors
                label="About the author"
                people={[
                  {
                    name: 'Shoghi Bagul',
                    role: 'Product Designer, Tcules',
                    portrait: shoghi,
                    link: { label: 'More from Shoghi', href: '#' },
                    descriptionHtml:
                      '<p>An authored biography can accompany the contributor’s name and role.</p>',
                    socialLinks: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/' }],
                  },
                ]}
              />
            </Specimen>
            <Specimen title={`C.2 · two authors · ${surface}`}>
              <Contributors
                label="About the authors"
                people={[
                  {
                    name: 'Shoghi Bagul',
                    role: 'Product Designer, Tcules',
                    portrait: shoghi,
                    link: { label: 'More from Shoghi', href: '#' },
                  },
                  {
                    name: 'Rushali Bhatt',
                    role: 'Product Designer, Tcules',
                    portrait: rushali,
                    link: { label: 'More from Rushali', href: '#' },
                  },
                ]}
              />
            </Specimen>
            <Specimen
              title={`C.3 · a host and three guests, the guests without portraits or pages · ${surface}`}
            >
              <Contributors
                label="In this episode"
                people={[
                  {
                    name: 'Jatin Leuva',
                    role: 'Host · Founder and CEO, Tcules',
                    portrait: shoghi,
                  },
                  { name: 'Parasharan Chari', role: 'Founder, Medkart' },
                  { name: 'Dhimant Trivedi', role: 'Head of Engineering, Contrado' },
                  { name: 'Akshay Vyas', role: 'Creative Head, Knovos' },
                ]}
              />
            </Specimen>
          </Layout>
        </Section>
      ))}
    </>
  );
}
