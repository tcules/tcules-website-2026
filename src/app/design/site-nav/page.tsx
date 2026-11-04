import { Layout, Section } from '@/components';
import { getNavigation } from '@/content';
import { SiteNav } from '@/patterns';
import type { SiteNavProps } from '@/patterns';

import { Specimen, specimenStyles as s } from '../_specimen/Specimen';

/**
 * SiteNav specimen — every arrangement the header has.
 *
 * A specimen route is composition only, so this reads the real IA through the seam rather than
 * carrying a second copy of it. That is deliberate: a proving ground fed by a fixture of its own
 * proves the fixture, and the header's failure mode is a plate that renders correctly for the
 * shape someone typed here and wrongly for the shape the site actually ships.
 *
 * The one thing this page CANNOT show is the header in its natural state — the real SiteNav is
 * mounted in the root layout above everything on this route, sticky, at the top of the viewport.
 * Everything below is the same component rendered inline so its plate can be opened next to a
 * description of what to look at. Two SiteNavs on a page is not a supported arrangement; it is a
 * measuring rig, which is why the ids are generated per instance.
 *
 * NOTHING HERE CAN OPEN THE PLATE FOR YOU. The component owns its own open state and there is no
 * prop to force it, on purpose — a `defaultOpen` that exists only so the proving ground can take a
 * screenshot is API the site would never call. Hover an item; the plate is 100ms behind you.
 */

const SURFACES = ['paper', 'tint', 'ink', 'blue'] as const;

/** Trim the IA down to the shapes a single specimen is about. */
function only(nav: SiteNavProps, keys: string[]): SiteNavProps {
  return { ...nav, items: nav.items.filter((item) => keys.includes(item.key)) };
}

export default async function SiteNavSpecimenPage() {
  const { nav } = await getNavigation();

  return (
    <>
      <Section>
        <Layout rowGap="stack">
          <Layout rowGap="block">
            <h1>SiteNav</h1>
            <p>
              The site header. A sticky bar of five items and one offer; above 1024 the four menu
              sections open one <strong>plate</strong> over the page, the width of the content
              column, and below it the whole navigation is a <strong>sheet</strong> that rises
              from the bottom. The real one is at the top of this page. What follows is the same
              component rendered inline, so a plate can be opened beside a note about it.
            </p>
            <p>
              <strong>Index + aside</strong> (owner, 4 Nov 2026). A section&rsquo;s groups are
              the index, in equal columns under short mono labels. Where a section has a way
              onward it sits in the aside, on a deeper ground at the plate&rsquo;s right edge,
              with the &ldquo;All &hellip;&rdquo; link pinned to its foot. Rows with a
              description sit 32 apart, plain rows 24. Hover a row: the label takes the blue and
              the arrow moves in, with no ground behind it.
            </p>
            <p>
              Open a plate and press Tab: the next stop is the first row inside it, and Shift+Tab
              from there returns to the item. Closes on Escape (focus returns to the trigger), on
              a click on the dimmed page, on focus leaving the header, and on a route change.
            </p>
          </Layout>

          <Specimen
            title="Plate · four groups and an aside — Services"
            note="Four groups with descriptions, then the aside: How we work on the deeper ground, All services pinned to its foot. The aside has no heading — one link needs none."
          >
            <SiteNav {...only(nav, ['services'])} />
          </Specimen>

          <Specimen
            title="Plate · long lists and a headed aside — Expertise and Resources"
            note="Expertise: two lists of six plain names at 24, the aside headed See the work. Resources: three groups, the two featured pieces in the aside under Featured, then All insights. Beyond Interfaces on YouTube carries the external cue and opens a new tab. Sweep between the two: the plate keeps its width and morphs its height while the panes cross-slide."
          >
            <SiteNav {...only(nav, ['expertise', 'resources'])} />
          </Specimen>

          <Specimen
            title="Plate · no aside — Studio"
            note="Three groups take the whole plate; the section has no way onward of its own and no index to send anyone to."
          >
            <SiteNav {...only(nav, ['studio'])} />
          </Specimen>

          <Specimen
            title="The full bar"
            note="Work navigates and gets no chevron; the four sections open the plate. Below 1024 the items and the CTA disappear and the toggle appears: one breakpoint changing WHAT is in the bar, not how big anything is."
          >
            <SiteNav {...nav} />
          </Specimen>

          <Specimen
            title="The sheet — narrow the window past 1024"
            note="The navigation becomes a bottom sheet. A section shows its groups as labels only, then the aside's links as one more group, then the All link. The foot carries the one offer, full width: Request audit left the header."
          >
            <SiteNav {...nav} />
          </Specimen>
        </Layout>
      </Section>

      {/* Four grounds. Every --nav-* token is declared in all four surface blocks, so this is the
          page that would catch a block that drifted — a missing fill, a blue label at 2.77:1, a
          focus ring the same colour as its own gap. */}
      {SURFACES.map((surface) => (
        <Section key={surface} surface={surface}>
          <Layout rowGap="block">
            <Layout rowGap="tight">
              <p className={s.specTitle}>surface=&quot;{surface}&quot;</p>
              <p className={s.specNote}>
                Same markup, one prop. Open the plate and check the aside&rsquo;s ground, the
                descriptions&rsquo; ink, the row hover and the focus ring. On tint the aside steps
                to neutral-200, because paper-deep on a paper-deep plate is not a region. On ink
                the scrim is the one value in the token layer that leaves the palette. On blue the
                label stays white and the arrow carries the hover.
              </p>
            </Layout>
            <SiteNav {...only(nav, ['work', 'services'])} surface={surface} />
          </Layout>
        </Section>
      ))}
    </>
  );
}
