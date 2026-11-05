import { ENDPOINTS } from '@/lib/routes';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { Layout, Media, Prose, Section } from '@/components';
import {
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EnquiryForm,
  DataTable,
  LogoGrid,
  Reasons,
} from '@/patterns';
import { PublishedHero, PublishedSection } from './PublishedHome';
import type { WhyPageModel, WhySection } from './published-why-model';
function WhyBand({ section: s }: { section: WhySection }) {
  const head = { id: s.id, heading: s.heading, headingId: s.headingId };
  switch (s.type) {
    case 'why-logos':
      return (
        <Section id={s.id} data-band="H" aria-labelledby={s.headingId}>
          <LogoGrid
            context={s.heading}
            contextAs="h2"
            headingId={s.headingId}
            marks={s.marks}
            edges="closed"
            density="compact"
          />
        </Section>
      );
    case 'why-cases':
      return (
        <ContentSection
          {...head}
          data-band="M"
          actionsAt="end"
          actions={s.action ? <CtaRow rule={false} actions={[s.action]} /> : undefined}
        >
          <BlockCardSet
            lead="none"
            scroll="never"
            cue="cta"
            across={3}
            size="md"
            items={s.items}
          />
        </ContentSection>
      );
    case 'why-reasons':
      return (
        <Reasons
          {...head}
          surface="tint"
          figureSize="lg"
          items={s.entries.map((e) => ({
            title: e.title,
            body: <span dangerouslySetInnerHTML={{ __html: e.html }} />,
            figure: e.figure,
          }))}
        />
      );
    case 'why-comparison':
      return (
        <ContentSection
          {...head}
          data-band="E"
          lead={s.lead}
          actionsAt="end"
          actions={s.action ? <CtaRow rule={false} actions={[s.action]} /> : undefined}
        >
          <Layout rowGap="stack">
            {s.blocks.map((b, i) =>
              'table' in b ? (
                <DataTable key={i} {...b.table} labelledBy={s.headingId} />
              ) : (
                <ContentSectionText key={i}>
                  <Prose html={b.html} />
                </ContentSectionText>
              ),
            )}
          </Layout>
        </ContentSection>
      );
    case 'cta': {
      if (s.variant === 'form' && s.form) {
        const f = s.form;
        return (
          <CtaSection
            {...head}
            data-band="L"
            island="blue"
            islandArrangement="halves"
            islandTexture="flow"
            footnoteIcon="info-circle"
            art={<Media image={s.image ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />}
            body={s.lead ? [s.lead] : undefined}
            form={
              <EnquiryForm
                variant="enquiry"
                urlLabel="Product or company URL"
                action={ENDPOINTS.enquiry}
                dress={{ kind: 'card', reply: f.reply }}
                fieldScale="md"
                submit="inline"
                submitLabel={f.submitLabel}
                caption={f.caption}
                success={f.success}
                context={{
                  originRoute: '/why-tcules',
                  placement: 'corpus-close',
                  family: 'page',
                  serviceOrAudit: 'why-tcules',
                  referrer: '',
                  campaign: '',
                }}
              />
            }
          />
        );
      }
      return (
        <CtaSection
          {...head}
          data-band="L"
          arrangement="open"
          body={s.lead ? (s.lead.split(/\n\s*\n/) as [string, string]) : undefined}
          actions={s.actions as [NonNullable<(typeof s.actions)[0]>]}
        />
      );
    }
    default:
      return (
        <PublishedSection
          section={s}
          route="/why-tcules"
          enquiryContext={{
            originRoute: '/why-tcules',
            placement: 'corpus-close',
            family: 'page',
            serviceOrAudit: 'why-tcules',
            referrer: '',
            campaign: '',
          }}
        />
      );
  }
}
export function PublishedWhy({ page }: { page: WhyPageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((s) => (
        <WhyBand key={s.key} section={s} />
      ))}
    </>
  );
}
