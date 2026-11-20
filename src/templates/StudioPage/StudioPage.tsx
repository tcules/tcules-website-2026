import { Layout, Prose, Sketch, type MediaImage } from '@/components';
import { sketchForRoute } from '@/lib/sketches';
import {
  Accordion,
  Banner,
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  DataTable,
  EngagementOptions,
  Gateway,
  ListCard,
  PageHero,
  ProfileCard,
  ProfileFollow,
  OfferSheet,
  Statement,
  TestimonialWall,
  type EngagementScope,
  type HeroTrail,
} from '@/patterns';

import styles from './StudioPage.module.css';

type Link = { label: string; href: string };
type Titled = { title: string; body: string };

/**
 * The About page's content, edited for consumption: one field per band, every list short. The
 * structural twin of the content seam's `IdealAboutPage` (a template never imports @/content).
 */
export type StudioPageContent = {
  hero: { title: string; lede: string; stats: readonly { value: string; label: string }[] };
  studio: { founding: string; centre: string; meaning: string };
  ahmedabad: { heading: string; paragraphs: readonly string[] };
  services: {
    heading: string;
    lead?: string;
    items: readonly (Titled & { href: string; label: string })[];
  };
  practice: { heading: string; lead?: string; items: readonly Titled[] };
  who: {
    heading: string;
    lead?: string;
    items: readonly { voice: string; reply: string }[];
    note?: string;
  };
  difference: { heading: string; items: readonly Titled[]; link?: Link };
  how: { heading: string; items: readonly Titled[] };
  people: {
    heading: string;
    leaders: readonly { name: string; role: string; bio: string; linkedin: Link; portrait: string }[];
    follow: { body: string; link: Link };
  };
  work: {
    heading: string;
    cases: readonly { name: string; body: string }[];
    all: Link;
    lab: { heading: string; lead: string; link: Link };
  };
  testimonials: {
    heading: string;
    items: readonly {
      id: string;
      quoteHtml: string;
      name: string;
      role: string;
      company: string;
      rating?: number;
    }[];
  };
  record: { heading: string; rows: readonly (readonly [string, string])[] };
  faq: { heading: string; items: readonly { question: string; answerHtml: string }[] };
  coda: { eyebrow?: string; text: string };
  cta: { heading: string; body: string; action: Link };
  careers: { heading: string; lead: string; action: Link };
};

export type StudioPageProps = {
  content: StudioPageContent;
  trail?: HeroTrail;
  /** The photographs the route resolves: bound studio media, register placeholders, case covers. */
  images: {
    studio: MediaImage;
    ahmedabad: MediaImage;
    team: MediaImage;
    lab: MediaImage;
    careers: MediaImage;
    /** By the leader's `portrait` slug. */
    portraits: Readonly<Record<string, MediaImage>>;
    /** By the case's name. */
    covers: Readonly<Record<string, MediaImage>>;
  };
  /** Each cited case's page, by the case's name. */
  caseHrefs: Readonly<Record<string, string>>;
};

/* A selector answer's drawing: the scene for the service page it links to. */
function sketchVisual(href: string) {
  const name = sketchForRoute(href);
  return name ? <Sketch name={name} /> : undefined;
}

/* How Tcules works: each principle's drawing, in order. */
const HOW_SCOPES: readonly EngagementScope[] = ['start', 'direct', 'inside', 'overlap', 'commercial'];

/* Plain copy into Prose's paragraphs: the fixture's strings are text, never markup. */
const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const id = (heading: string) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * TIER 3 — the About page as it should read (owner, 12 Oct 2026: "present the information in the
 * most consumable format. a person would most likely not read a section with 5 paragraphs of text").
 *
 * The corpus's sections in the corpus's order, under its own headings, each cut for length (owner,
 * 12 Oct 2026: "optimize length and not change the narrative or structure"), and each in the shape its
 * job needs, so the page never repeats one rectangle: the hero with the record's figures; the opening
 * line set large beside the studio; the city beside its photograph; the practice as two claims; six
 * services in a selector with a sketch each; the three situations; the five differences as one set;
 * five drawn principles; two people and the studio; featured work and the Lab on the dark band; the
 * clients' words; the record; the questions; the coda; the ask; careers.
 */
export function StudioPage({ content: c, trail, images, caseHrefs }: StudioPageProps) {
  const practiceId = id(c.practice.heading);
  return (
    <>
      <PageHero
        trail={trail}
        title={c.hero.title}
        body={[c.hero.lede]}
        stats={c.hero.stats}
        texture
        surface="paper"
      />

      <ContentSection
        id="studio"
        arrangement="media"
        media={{ image: images.studio, side: 'end', pin: false, weight: 'photo' }}
      >
        {/* The studio's own line ("Product Design sits at the centre of the studio") is the band's
            large thing; who founded it reads above, what the centre means below. */}
        <Layout rowGap="block">
          <p className={styles.founding}>{c.studio.founding}</p>
          <p className={styles.centre}>{c.studio.centre}</p>
          <p className={styles.meaning}>{c.studio.meaning}</p>
        </Layout>
      </ContentSection>

      <ContentSection
        id="ahmedabad"
        heading={c.ahmedabad.heading}
        headingId="ahmedabad-heading"
        arrangement="media"
        media={{ image: images.ahmedabad, side: 'start', pin: false, head: 'lg' }}
      >
        <ContentSectionText>
          <Prose html={c.ahmedabad.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('')} />
        </ContentSectionText>
      </ContentSection>

      <ContentSection
        id={practiceId}
        heading={c.practice.heading}
        headingId={`${practiceId}-heading`}
        lead={c.practice.lead}
      >
        <BlockCardSet
          items={c.practice.items.map((item) => ({ id: item.title, ...item }))}
          lead="none"
          across={2}
          size="lg"
          scroll="never"
        />
      </ContentSection>

      <ContentSection
        id="what-we-do"
        heading={c.services.heading}
        headingId="what-we-do-heading"
        lead={c.services.lead}
      >
        <Gateway
          items={c.services.items.map((item) => ({
            id: id(item.title),
            title: item.title,
            body: item.body,
            href: item.href,
            service: item.label,
            visual: sketchVisual(item.href),
          }))}
        />
      </ContentSection>

      {/* The situations as the ruled tile set (ListCard `tile`), each situation its title and what it
          involves its body (O.5a, 17 Nov 2026: VoiceLedger retired). */}
      <ContentSection
        id="who-we-work-with"
        heading={c.who.heading}
        headingId="who-we-work-with-heading"
        lead={c.who.lead}
      >
        <Layout rowGap="stack">
          <Layout
            as="ul"
            columns={{ base: 1, md: c.who.items.length % 3 === 0 ? 3 : 2 }}
            colGap="gutter"
            rowGap="stack"
          >
            {c.who.items.map((item) => (
              <ListCard
                key={item.voice}
                form="tile"
                size="sm"
                titleAs="h3"
                title={item.voice}
                body={item.reply}
              />
            ))}
          </Layout>
          {c.who.note ? (
            <ContentSectionText>
              <p>{c.who.note}</p>
            </ContentSectionText>
          ) : null}
        </Layout>
      </ContentSection>

      <OfferSheet
        id="difference"
        heading={c.difference.heading}
        headingId="difference-heading"
        across={3}
        items={c.difference.items}
        note={
          c.difference.link ? <CtaRow rule={false} actions={[c.difference.link]} /> : undefined
        }
      />

      <EngagementOptions
        id="how-we-work"
        heading={c.how.heading}
        headingId="how-we-work-heading"
        options={c.how.items.map((item, index) => ({ ...item, scope: HOW_SCOPES[index] }))}
      />

      <ContentSection id="leadership" heading={c.people.heading} headingId="leadership-heading">
        <Layout rowGap="gutter">
          <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
            {c.people.leaders.map((leader) => (
              <ProfileCard
                key={leader.name}
                name={leader.name}
                role={leader.role}
                bio={leader.bio}
                portrait={images.portraits[leader.portrait]}
                linkedin={leader.linkedin}
              />
            ))}
          </Layout>
          <ProfileFollow
            body={c.people.follow.body}
            link={c.people.follow.link}
            image={images.team}
          />
        </Layout>
      </ContentSection>

      <ContentSection
        id="work"
        heading={c.work.heading}
        headingId="work-heading"
        footer={<CtaRow actions={[c.work.all]} />}
      >
        <BlockCardSet
          items={c.work.cases.map((item) => ({
            id: item.name,
            title: item.name,
            body: item.body,
            href: caseHrefs[item.name],
            ...(images.covers[item.name]
              ? { media: { type: 'image' as const, image: images.covers[item.name]! } }
              : {}),
          }))}
          lead="auto"
          cue="title"
          scroll="never"
        />
      </ContentSection>

      <Banner
        form="beside"
        mediaSide="end"
        id="future-interfaces-lab"
        headingId="future-interfaces-lab-heading"
        heading={c.work.lab.heading}
        lead={c.work.lab.lead}
        actions={<CtaRow rule={false} actions={[c.work.lab.link]} />}
        image={{ ...images.lab, kind: 'photograph' }}
        surface="ink"
      />

      <ContentSection
        id="testimonials"
        heading={c.testimonials.heading}
        headingId="testimonials-heading"
        surface="tint"
        align="center"
      >
        <TestimonialWall items={c.testimonials.items} />
      </ContentSection>

      <ContentSection id="company-record" heading={c.record.heading} headingId="company-record-heading">
        <DataTable
          split
          labelledBy="company-record-heading"
          keyColumn={{ heading: 'Fact' }}
          columns={[{ heading: 'Record' }]}
          rows={c.record.rows.map(([fact, value]) => ({ header: fact, cellsHtml: [value] }))}
        />
      </ContentSection>

      <ContentSection id="faq" heading={c.faq.heading} headingId="faq-heading" align="center">
        <ContentSectionText>
          <Accordion items={c.faq.items} />
        </ContentSectionText>
      </ContentSection>

      <Statement as="p" align="start" eyebrow={c.coda.eyebrow}>
        {c.coda.text}
      </Statement>

      <CtaSection
        id="work-with-tcules"
        arrangement="open"
        heading={c.cta.heading}
        body={[c.cta.body]}
        actions={[c.cta.action]}
      />

      <Banner
        form="below"
        id="careers"
        headingId="careers-heading"
        heading={c.careers.heading}
        lead={c.careers.lead}
        actions={<CtaRow rule={false} actions={[c.careers.action]} />}
        image={{ ...images.careers, kind: 'photograph' }}
      />
    </>
  );
}
