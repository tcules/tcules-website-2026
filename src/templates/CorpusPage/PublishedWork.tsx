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
import { INK_CLOSE_DRESS, inkCloseProps, isInkClose } from './ink-close';
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
            {...(isInkClose(s)
              ? { ...inkCloseProps(s), points: s.points.length ? s.points : undefined }
              : {})}
            form={
              <EnquiryForm
                variant="enquiry"
                urlLabel={isInkClose(s) ? (s.form?.urlLabel ?? 'Product website') : 'Product or company URL'}
                action={ENDPOINTS.enquiry}
                dress={{ kind: 'card', reply: f.reply , ...(isInkClose(s) ? INK_CLOSE_DRESS : {}) }}
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
  /* The page's client logos run as the hero's ticker, as on the overhaul's How we work (owner,
     23 Nov 2026; decisions/2026-11-23-client-logos-are-the-ticker): the CMS's logo band moves up into
     the hero and is not drawn again further down. A hero with logos of its own keeps them. */
  const logos = page.sections.find(
    (s): s is Extract<WorkSection, { type: 'work-logos' }> => s.type === 'work-logos',
  );
  const lift = Boolean(logos?.marks.length) && !page.hero.recognition?.marks.length;
  const hero =
    lift && logos
      ? {
          ...page.hero,
          recognition: { id: logos.id, title: logos.heading, marks: logos.marks, compact: true },
        }
      : page.hero;
  return (
    <>
      <PublishedHero hero={hero} />
      {page.sections.map((s) =>
        lift && s === logos ? null : <WorkBand key={s.key} s={s} route={page.route} />,
      )}
    </>
  );
}
