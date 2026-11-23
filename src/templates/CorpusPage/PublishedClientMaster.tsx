import { Layout, Section } from '@/components';
import { ROUTES } from '@/lib/routes';
import {
  BlockCardSet,
  ContentSection,
  CtaRow,
  DataTable,
  ListCard,
  LogoGrid,
  OfferSheet,
  type HeroMedia,
} from '@/patterns';
import { PublishedHero, PublishedSection } from './PublishedHome';
import type { ClientMasterPage, ClientMasterSection } from './published-client-master-model';

function ClientSection({ section }: { section: ClientMasterSection }) {
  const { id, heading, headingId } = section;
  const head = { id, heading, headingId };
  switch (section.type) {
    case 'client-logos':
      return (
        <Section id={id} data-band="H" aria-labelledby={headingId}>
          <LogoGrid
            context={heading}
            contextAs="h2"
            headingId={headingId}
            marks={section.marks}
            edges="closed"
            density={section.compact ? 'compact' : 'default'}
          />
        </Section>
      );
    case 'client-offer':
      return <OfferSheet {...head} items={section.items} across={3} arrangement="rows" />;
    case 'client-work':
      return (
        <ContentSection {...head} data-band="E">
          <Layout rowGap="stack">
            <DataTable
              labelledBy={headingId}
              keyColumn={{ heading: section.labels[0] }}
              columns={section.labels.slice(1).map((label) => ({ heading: label }))}
              rows={section.rows}
            />
          </Layout>
        </ContentSection>
      );
    case 'client-stories':
      return (
        <ContentSection {...head} data-band="C-list" arrangement="beside">
          <Layout as="ul" rowGap="none">
            {section.entries.map((entry) => (
              <ListCard
                key={entry.key}
                titleAs="h3"
                title={entry.title}
                bodyHtml={[entry.bodyHtml]}
              />
            ))}
          </Layout>
        </ContentSection>
      );
    case 'client-cases':
      return (
        <ContentSection
          {...head}
          data-band="M"
          lead={section.lead}
          actionsAt="end"
          actions={
            section.action ? <CtaRow rule={false} actions={[section.action]} /> : undefined
          }
        >
          <BlockCardSet
            lead="none"
            scroll="never"
            cue="title"
            across={3}
            size="md"
            items={section.items}
          />
        </ContentSection>
      );
    default:
      return (
        <PublishedSection
          section={section}
          route={ROUTES.clients}
          enquiryContext={{
            originRoute: ROUTES.clients,
            placement: 'corpus-close',
            family: 'proof_hub',
            serviceOrAudit: 'clients',
            referrer: '',
            campaign: '',
          }}
        />
      );
  }
}
/**
 * TIER 3 — the Client Master (`/clients`) from the new CMS: the hero, then every section in the
 * editor's order. The hero's drawing falls back to the frontend's own; words never do.
 */
export function PublishedClientMaster({
  page,
  fallbackMedia,
}: {
  page: ClientMasterPage;
  /** The page's own hero drawing, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
}) {
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <ClientSection key={section.key} section={section} />
      ))}
    </>
  );
}
