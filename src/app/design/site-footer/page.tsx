import { Layout, Section } from '@/components';
import { getNavigation } from '@/content';
import { SiteFooter } from '@/patterns';

import { specimenStyles as s } from '../_specimen/Specimen';

/**
 * SiteFooter specimen — the five bands, on four grounds.
 *
 * Composition only, reading the real IA through the seam: six link groups, the newsletter, the
 * studio block and the legal row. A footer fed a trimmed fixture proves nothing, because its whole
 * difficulty is what happens at full length — the long expertise labels, and a directory that must
 * not out-shout the tagline above it.
 *
 * Below lg every group is rendered a SECOND time as a `<details>` accordion, and the breakpoint
 * decides which copy is shown. Narrow the window on any footer here and the directory swaps
 * rendering; both are in the markup at every width, which is the point.
 *
 * The real footer is at the bottom of this page, on ink, mounted by the root layout.
 */

const SURFACES = ['paper', 'tint', 'ink', 'blue'] as const;

export default async function SiteFooterSpecimenPage() {
  const { footer } = await getNavigation();

  return (
    <>
      <Section>
        <Layout rowGap="block">
          <h1>SiteFooter</h1>
          <p>
            The closing band, in five deliberately unlike shapes: the brand block (the mark at
            40 and the tagline at lead on one side, the action and a rating badge on the other),
            the directory (six groups in two rows of three — three tracks because the expertise
            labels are long, and at six they broke over two lines each), the newsletter (two
            columns — the pitch and the field), the studio block (one line about the studio, its
            address and email in small print, then the profiles as words), and the legal line.
            Under all of it, the wordmark again at --opacity-faint: ground rather than a sixth
            band.
          </p>
          <p>
            That variety is the point. A footer is the easiest place in a site to end up with
            four identical rectangles of small links, and the test is whether it reads as more
            than one idea when you squint. The bands are separated by a hairline with air on
            both sides and by nothing else — no alternating grounds.
          </p>
          <p>
            A <strong>server component</strong>. Nothing here is stateful, nothing reads the
            URL, and the newsletter posts as a plain form — so the footer on every page of the
            site ships no client bundle. The form posts to <code>/api/newsletter</code>, which{' '}
            <strong>nothing serves</strong> yet: a real submission is a 404 until that route
            exists.
          </p>
          <p>
            The socials are words with the off-site arrow and no marks: two of the four have no
            official mark held here, and a row half with logos reads as unfinished. Clutch is
            not among them — the rating badge in the brand block already links the profile.
          </p>
        </Layout>
      </Section>

      {/* Four grounds. Ink is what the site ships; the other three exist because a footer is a
          component and answers on every surface. The field is the thing to check — it is the one
          part whose entire affordance is its border, so watch the rest state, the focus rule and the
          placeholder ink on each ground. */}
      {SURFACES.map((surface) => (
        <div key={surface}>
          <Section surface={surface} flush>
            <Layout rowGap="tight" className={s.spec}>
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>
                Same markup, one prop. On blue every ink comes off the light end of the ramp —
                white, 50 or 100 — because 200 is already 3.78:1 there.
              </p>
            </Layout>
          </Section>
          <SiteFooter {...footer} surface={surface} />
        </div>
      ))}
    </>
  );
}
