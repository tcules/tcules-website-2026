import { Layout, Media, Prose, Section, Sketch } from '@/components';
import {
  ContentSection,
  ContentSectionText,
  CtaSection,
  CtaRow,
  DataTable,
  EnquiryForm,
  GatewayPaths,
  ListCard,
  LogoGrid,
  OfferSheet,
} from '@/patterns';
import { ENDPOINTS } from '@/lib/routes';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { INK_CLOSE_DRESS, inkCloseProps, isInkClose } from './ink-close';
import { PublishedEngagement, PublishedHero, PublishedSection } from './PublishedHome';
import { labelWithoutArrow } from './text';
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
          /* A grid of four or more reads four across, as the overhaul's "What stays the same" (O.20). */
          across={s.list ? 3 : s.items.length >= 4 ? 4 : 2}
          lead={s.lead}
          items={s.items}
          note={s.action ? <CtaRow rule={false} actions={[s.action]} /> : undefined}
        />
      );
    case 'work-facts':
      /* The overhaul's drawn facts (O.20, owner 19 Nov 2026, round 11): head, the drawing across the
         content width, then the facts as tiles, three across from 1024, two from 768, one on a phone. */
      return (
        <ContentSection {...head} surface={s.surface} lead={s.lead} data-band="D-facts">
          {s.scene ? <Sketch name={s.scene} /> : null}
          <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="stack">
            {s.items.map((item) => (
              <ListCard
                key={item.title}
                form="tile"
                size="sm"
                titleAs="h3"
                title={item.title}
                body={item.body}
              />
            ))}
          </Layout>
        </ContentSection>
      );
    case 'work-flow': {
      const hasTable = s.blocks.some((block) => 'table' in block);
      const prose = s.blocks.flatMap((block) => ('html' in block ? [block.html] : []));
      if (s.beside && !hasTable)
        /* Head beside (O.20, the overhaul's "How we use AI in our own work"): the words beside the
           heading, the band's one link under them. */
        return (
          <ContentSection
            {...head}
            surface={s.surface}
            lead={s.lead}
            data-band="C-text"
            arrangement="beside"
            footer={
              s.action ? (
                <CtaRow
                  rule={false}
                  actions={[{ ...s.action, label: labelWithoutArrow(s.action.label) }]}
                />
              ) : undefined
            }
          >
            <ContentSectionText>
              <Prose html={prose.join('')} />
            </ContentSectionText>
          </ContentSection>
        );
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
          { type: 'work-logos' | 'work-situations' | 'work-flow' | 'work-offer' | 'work-facts' }
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
