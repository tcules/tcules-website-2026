import {
  Button,
  Island,
  Layout,
  Media,
  Prose,
  Section,
  Sketch,
  TextureFlow,
} from '@/components';
import { ROUTES } from '@/lib/routes';
import {
  Bento,
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaRow,
  DataTable,
  ListCard,
  ProfileCard,
} from '@/patterns';

import { LinksIsland } from './LinksIsland';
import { PublishedHero, PublishedSection } from './PublishedHome';
import type {
  AboutFlow,
  PublishedAboutPage,
  PublishedAboutSection,
} from './published-about-model';

function FlowBlock({ block }: { block: AboutFlow }) {
  switch (block.type) {
    case 'prose':
      return (
        <ContentSectionText>
          <Prose html={block.html} />
        </ContentSectionText>
      );
    case 'table':
      return <DataTable {...block.table} />;
    case 'illustration':
      return block.image ? (
        <Media image={block.image} sizes="(min-width: 1024px) 50vw, 90vw" />
      ) : (
        <Sketch name={block.scene} />
      );
  }
}

type LinkBannerSection = Extract<PublishedAboutSection, { type: 'link-banner' }>;

function LinkBanner({ section }: { section: LinkBannerSection }) {
  const { id, html, action } = section;
  return (
    <div id={id}>
      <Island surface="ink">
        <TextureFlow flow="turbulent" />
        <Layout
          columns={{ base: 1, lg: [1, 'auto'] }}
          colGap="column"
          rowGap="block"
          align="center"
        >
          <div data-texture-calm>{html ? <Prose html={html} /> : null}</div>
          {action ? (
            <Button as="a" href={action.href} emphasis="solid" tone="primary" size="md">
              {action.label}
            </Button>
          ) : null}
        </Layout>
      </Island>
    </div>
  );
}

function AboutSection({
  section,
  followingBanner,
}: {
  section: PublishedAboutSection;
  followingBanner?: LinkBannerSection;
}) {
  if (section.type === 'link-banner') {
    return (
      <Section>
        <LinkBanner section={section} />
      </Section>
    );
  }

  const { id, heading, headingId } = section;
  const head = { id, heading, headingId };
  switch (section.type) {
    case 'services':
      return (
        <ContentSection
          {...head}
          data-band="C-bento"
          lead={section.lead}
          surface={section.surface}
        >
          <Bento
            tracks={section.tracks}
            items={section.items.map(({ image, ...item }) => ({
              ...item,
              picture: image ? (
                <Media image={image} sizes="(min-width: 1024px) 25vw, 90vw" />
              ) : undefined,
            }))}
          />
        </ContentSection>
      );
    case 'audience':
      return (
        <ContentSection
          {...head}
          data-band="M"
          lead={section.lead}
          arrangement="beside"
          split="halves"
        >
          <Layout as="ul" rowGap="none">
            {section.entries.map(({ key, title, icon }) => (
              <ListCard
                key={key}
                title={title}
                size="md"
                titleAs="h3"
                marker={icon ? { type: 'icon', name: icon } : undefined}
              />
            ))}
          </Layout>
          {section.after ? (
            <ContentSectionText>
              <Prose html={section.after} />
            </ContentSectionText>
          ) : null}
        </ContentSection>
      );
    case 'cases': {
      if (section.presentation !== 'compact_covered') {
        return <PublishedSection section={section} route={ROUTES.about} />;
      }
      const { action, cards, lead, surface } = section;
      return (
        <Section id={id} aria-labelledby={headingId} surface={surface}>
          <Layout rowGap="stack">
            <Layout
              columns={{ base: 1, md: [1, 'auto'] }}
              colGap="column"
              rowGap="block"
              align="center"
            >
              <h3 id={headingId}>{heading}</h3>
              {action ? (
                <CtaRow rule={false} note={action.description} actions={[action]} />
              ) : null}
            </Layout>
            {lead ? <p>{lead}</p> : null}
            <BlockCardSet
              items={cards.map(({ image, bodyHtml, ...card }) => ({
                ...card,
                bodyHtml: bodyHtml ? [bodyHtml] : undefined,
                media: image ? { type: 'image', image } : undefined,
              }))}
              lead="none"
              across={4}
              size="sm"
              cue="title"
              scroll="never"
              titleAs="h4"
            />
            {followingBanner ? <LinkBanner section={followingBanner} /> : null}
          </Layout>
        </Section>
      );
    }
    case 'people':
      return (
        <ContentSection {...head} data-band="P" lead={section.lead}>
          <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="gutter">
            {section.profiles.map(({ key, ...profile }) => (
              <ProfileCard key={key} {...profile} />
            ))}
          </Layout>
        </ContentSection>
      );
    case 'editorial': {
      const blocks = section.blocks.map((block) => <FlowBlock key={block.key} block={block} />);
      return section.arrangement === 'media' && section.media ? (
        <ContentSection
          {...head}
          data-band="B"
          arrangement="media"
          media={section.media}
          surface={section.surface}
        >
          {blocks}
        </ContentSection>
      ) : (
        <ContentSection
          {...head}
          data-band="B"
          arrangement={section.arrangement === 'beside' ? 'beside' : 'stacked'}
          surface={section.surface}
        >
          {blocks}
        </ContentSection>
      );
    }
    case 'comparison':
      return (
        <ContentSection {...head} data-band="E" lead={section.lead} surface={section.surface}>
          {section.blocks.map((block) => (
            <FlowBlock key={block.key} block={block} />
          ))}
        </ContentSection>
      );
    case 'links':
      return (
        <LinksIsland
          id={id ?? headingId}
          heading={heading}
          links={section.links}
          band="C-links"
          open
        />
      );
    default:
      return <PublishedSection section={section} route={ROUTES.about} />;
  }
}

export function PublishedAbout({ page }: { page: PublishedAboutPage }) {
  const { hero, sections } = page;
  const media =
    hero.media?.type === 'image' && hero.media.image.kind === 'photograph'
      ? { ...hero.media, ratio: { base: '3/2', lg: '2/1' } as const }
      : hero.media;
  return (
    <>
      <PublishedHero hero={{ ...hero, media }} />
      {sections.map((section, index) => {
        const previous = sections[index - 1];
        if (
          section.type === 'link-banner' &&
          previous?.type === 'cases' &&
          previous.presentation === 'compact_covered'
        ) {
          return null;
        }
        const next = sections[index + 1];
        const followingBanner =
          section.type === 'cases' &&
          section.presentation === 'compact_covered' &&
          next?.type === 'link-banner'
            ? next
            : undefined;
        return (
          <AboutSection key={section.key} section={section} followingBanner={followingBanner} />
        );
      })}
    </>
  );
}
