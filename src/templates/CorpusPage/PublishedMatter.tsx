import { Layout, Media, Prose } from '@/components';
import {
  Accordion,
  Bento,
  ContentSection,
  ContentSectionText,
  CtaSection,
  EnquiryForm,
  OfferSheet,
} from '@/patterns';
import { ENDPOINTS } from '@/lib/routes';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { PublishedHero } from './PublishedHome';
import type { MatterPageModel } from './published-matter-model';
export function PublishedMatter({ page }: { page: MatterPageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((section) => {
        const head = { id: section.id, heading: section.heading, headingId: section.headingId };
        switch (section.type) {
          case 'ComponentSharedOfferSheetSection':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                surface="paper"
                arrangement={section.presentation === 'split_list' ? 'list' : 'grid'}
                across={3}
                lead={section.description}
                items={section.items}
              />
            );
          case 'ComponentSharedEditorialSection':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface="paper"
                data-band="B"
                arrangement="media"
                media={{
                  drawing: section.art ? (
                    <Media
                      image={section.art}
                      sizes="(min-width: 1304px) 572px, (min-width: 1024px) calc((100vw - 160px) / 2), calc(100vw - 64px)"
                    />
                  ) : null,
                  side: 'start',
                  head: 'lg',
                }}
              >
                <Layout rowGap="stack">
                  <ContentSectionText>
                    <Prose html={section.blocks.join('')} />
                  </ContentSectionText>
                </Layout>
              </ContentSection>
            );
          case 'ComponentSharedServiceCard':
            return (
              <ContentSection key={section.key} {...head} data-band="C-icon">
                <Bento tracks={4} items={section.services} />
              </ContentSection>
            );
          case 'ComponentSharedFaqSection':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface="paper"
                data-band="D-faq"
                arrangement="beside"
                split="halves"
              >
                <Accordion items={section.faqs} />
              </ContentSection>
            );
          case 'ComponentSharedCta': {
            const f = section.form;
            if (!f) throw Error('Missing Matter enquiry configuration');
            return (
              <CtaSection
                key={section.key}
                {...head}
                data-band="L"
                island="blue"
                islandArrangement="halves"
                islandTexture="flow"
                footnoteIcon="info-circle"
                art={<Media image={section.art ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />}
                body={section.description ? [section.description] : undefined}
                form={
                  <EnquiryForm
                    variant="enquiry"
                    urlLabel="Product or company URL"
                    action={ENDPOINTS.enquiry}
                    dress={{ kind: 'card', reply: f.replyLabel }}
                    fieldScale="md"
                    submit="inline"
                    submitLabel={f.submitLabel}
                    caption={f.caption}
                    success={{ heading: f.successHeading, body: f.successBody }}
                    context={{
                      originRoute: '/matter-design-system',
                      placement: 'corpus-close',
                      family: 'lab_artefact',
                      serviceOrAudit: 'matter-design-system',
                      referrer: '',
                      campaign: '',
                    }}
                  />
                }
              />
            );
          }
          default:
            throw Error('Unsupported Matter section ' + section.type);
        }
      })}
    </>
  );
}
