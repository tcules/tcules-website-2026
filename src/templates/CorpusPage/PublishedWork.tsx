import { Layout, Media, Prose, Section } from '@/components';
import {
  ContentSection,
  ContentSectionText,
  CtaSection,
  CtaRow,
  DataTable,
  EnquiryForm,
  GatewayPaths,
  LogoGrid,
  OfferSheet,
} from '@/patterns';
import { ENDPOINTS } from '@/lib/routes';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { PublishedEngagement, PublishedHero, PublishedSection } from './PublishedHome';
import type { WorkPageModel, WorkSection } from './published-work-model';
function WorkBand({ s, route }: { s: WorkSection; route: string }) {
  const head = { id: s.id, heading: s.heading, headingId: s.headingId };
  switch (s.type) {
    case 'work-logos':
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
    case 'work-situations':
      return (
        <ContentSection
          {...head}
          data-band="C-router"
          surface={s.surface}
          align="center"
          lead={s.lead}
        >
          <Layout rowGap="column">
            <GatewayPaths
              form="cards"
              paths={s.paths}
              close={s.closing ? { line: s.closing, lineSize: 'body' } : undefined}
            />
          </Layout>
        </ContentSection>
      );
    case 'work-offer':
      return (
        <OfferSheet
          {...head}
          surface={s.surface}
          arrangement={s.list ? 'list' : 'grid'}
          across={s.list ? 3 : 2}
          lead={s.lead}
          items={s.items}
          note={s.action ? <CtaRow rule={false} actions={[s.action]} /> : undefined}
        />
      );
    case 'work-flow': {
      const hasTable = s.blocks.some((block) => 'table' in block);
      const prose = s.blocks.flatMap((block) => ('html' in block ? [block.html] : []));
      return (
        <ContentSection
          {...head}
          surface={s.surface}
          lead={s.lead}
          data-band={hasTable ? 'E' : 'C-text'}
        >
          <Layout rowGap="stack">
            {hasTable ? (
              s.blocks.map((block, index) =>
                'table' in block ? (
                  <DataTable key={index} {...block.table} labelledBy={s.headingId} />
                ) : (
                  <ContentSectionText key={index}>
                    <Prose html={block.html} />
                  </ContentSectionText>
                ),
              )
            ) : (
              <ContentSectionText>
                <Prose html={prose.join('')} />
              </ContentSectionText>
            )}
          </Layout>
        </ContentSection>
      );
    }
    case 'engagement':
      return <PublishedEngagement section={s} imageSizes="(min-width: 1024px) 25vw, 90vw" />;
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
                  originRoute: route,
                  placement: 'corpus-close',
                  family: route === '/how-we-work' ? 'page' : 'practice',
                  serviceOrAudit: route.split('/').at(-1) ?? '',
                  referrer: '',
                  campaign: '',
                }}
              />
            }
          />
        );
      }
      break;
    }
  }
  return (
    <PublishedSection
      section={
        s as Exclude<
          WorkSection,
          { type: 'work-logos' | 'work-situations' | 'work-flow' | 'work-offer' }
        >
      }
      route={route}
    />
  );
}
export function PublishedWork({ page }: { page: WorkPageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((s) => (
        <WorkBand key={s.key} s={s} route={page.route} />
      ))}
    </>
  );
}
