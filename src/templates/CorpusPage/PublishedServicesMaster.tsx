import { Layout, Media, Prose, Section } from '@/components';
import { placeholderImage } from '@/lib/placeholders';
import { ROUTES } from '@/lib/routes';
import { labelWithoutArrow } from './text';
import { Bento, BlockCardSet, ContentSection, CtaRow, LogoGrid, OfferSheet } from '@/patterns';

import { PublishedHero, PublishedSection } from './PublishedHome';
import type {
  ServicesMasterPage,
  ServicesMasterSection,
} from './published-services-master-model';

function ServicesSection({ section }: { section: ServicesMasterSection }) {
  const { id, heading, headingId, surface } = section;
  const head = { id, heading, headingId, surface };
  switch (section.type) {
    case 'clients':
      return (
        <Section id={id} data-band="H" surface={surface}>
          <Layout rowGap="stack">
            <LogoGrid
              context={heading}
              contextAs="h2"
              headingId={headingId}
              marks={section.marks}
              density={section.compact ? 'compact' : 'default'}
              edges="closed"
            />
            {section.names.length ? <p>{section.names.join(' · ')}</p> : null}
          </Layout>
        </Section>
      );
    case 'services':
      return (
        <ContentSection {...head} data-band="C-icon" lead={section.lead}>
          {section.before.map((html, index) => (
            <Prose key={index} html={html} />
          ))}
          <Bento
            tracks={section.tracks}
            cta={section.cta}
            items={section.items.map(({ image, ...tile }) => ({
              ...tile,
              picture: image ? (
                <Media image={image} sizes="(min-width: 1024px) 25vw, 90vw" />
              ) : undefined,
            }))}
          />
          {section.after.map((html, index) => (
            <Prose key={index} html={html} />
          ))}
        </ContentSection>
      );
    case 'why':
      return (
        <OfferSheet
          {...head}
          arrangement="list"
          items={section.items.map(({ image, ...item }) => ({
            ...item,
            iconArt: image ? <Media image={image} sizes="24px" /> : undefined,
          }))}
          note={
            section.action ? (
              <CtaRow
                rule={false}
                actions={[
                  { ...section.action, label: labelWithoutArrow(section.action.label) },
                ]}
              />
            ) : undefined
          }
        />
      );
    case 'cases':
      if (section.presentation)
        return <PublishedSection section={section} route={ROUTES.services} />;
      return (
        <ContentSection
          {...head}
          data-band="M"
          lead={section.lead}
          footer={
            section.action ? (
              <CtaRow
                actions={[
                  { ...section.action, label: labelWithoutArrow(section.action.label) },
                ]}
              />
            ) : undefined
          }
        >
          <BlockCardSet
            lead="none"
            across={3}
            size="md"
            scroll="never"
            cue={section.cards.every((card) => card.ctaLabel) ? 'cta' : 'title'}
            items={section.cards.map(({ image, bodyHtml, body, ...card }) => ({
              ...card,
              body: bodyHtml ? undefined : body,
              bodyHtml: bodyHtml ? [bodyHtml] : undefined,
              media: image ? { type: 'image', image } : undefined,
            }))}
          />
        </ContentSection>
      );
    default:
      return <PublishedSection section={section} route={ROUTES.services} />;
  }
}

export function PublishedServicesMaster({ page }: { page: ServicesMasterPage }) {
  return (
    <>
      <PublishedHero
        hero={page.hero}
        fallbackMedia={{ type: 'image', image: placeholderImage(ROUTES.services, 'hero') }}
      />
      {page.sections.map((section) => (
        <ServicesSection key={section.key} section={section} />
      ))}
    </>
  );
}
