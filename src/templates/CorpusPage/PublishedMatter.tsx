import { Layout, Media, Prose } from '@/components';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { ENDPOINTS, ROUTES } from '@/lib/routes';
import {
  Accordion,
  Bento,
  ContentSection,
  ContentSectionText,
  CtaSection,
  EnquiryForm,
  OfferSheet,
} from '@/patterns';

import { BandBody } from './CopyBands';
import { PublishedHero } from './PublishedHome';
import type { MatterPageModel, MatterSection } from './published-matter-model';

const EDITORIAL_SIZES =
  '(min-width: 1304px) 572px, (min-width: 1024px) calc((100vw - 160px) / 2), calc(100vw - 64px)';

/** The enquiry close: the CMS form in the blue island, beside its illustration. */
function Close({ section }: { section: Extract<MatterSection, { type: 'cta' }> }) {
  const { form } = section;
  const head = { id: section.id, heading: section.heading, eyebrow: section.eyebrow };
  const body = section.lead ? ([section.lead] as const) : undefined;
  if (section.variant === 'form' && form) {
    return (
      <CtaSection
        {...head}
        data-band="L"
        island={section.island ?? 'blue'}
        islandArrangement="halves"
        islandTexture="flow"
        footnote={section.footnote}
        footnoteIcon="info-circle"
        /* The close's CMS illustration; else the drawing the enquiry close has always had. */
        art={<Media image={section.image ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />}
        body={body}
        form={
          <EnquiryForm
            variant="enquiry"
            urlLabel={form.urlLabel}
            action={ENDPOINTS.enquiry}
            dress={{ kind: 'card', reply: form.reply ?? '' }}
            fieldScale="md"
            submit="inline"
            submitLabel={form.submitLabel}
            caption={form.caption ?? null}
            success={form.success}
            nextSteps={form.nextSteps}
            scheduleHref={form.scheduleHref}
            context={{
              originRoute: ROUTES.matterDesignSystem,
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
  const action = section.actions[0];
  return action ? (
    <CtaSection {...head} data-band="L" arrangement="open" body={body} actions={[action]} />
  ) : null;
}

export function PublishedMatter({ page }: { page: MatterPageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((section) => {
        const head = { id: section.id, heading: section.heading, headingId: section.headingId };
        switch (section.type) {
          case 'offer':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                arrangement={section.arrangement}
                across={3}
                lead={section.lead}
                items={section.items}
              />
            );
          case 'editorial':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                data-band="B"
                arrangement="media"
                media={{
                  drawing: section.art ? (
                    <Media image={section.art} sizes={EDITORIAL_SIZES} />
                  ) : null,
                  side: section.side,
                  head: 'lg',
                }}
              >
                <Layout rowGap="stack">
                  {section.flow ? (
                    <BandBody blocks={section.flow} labelledBy={section.headingId} />
                  ) : (
                    <ContentSectionText>
                      <Prose html={section.html ?? ''} />
                    </ContentSectionText>
                  )}
                </Layout>
              </ContentSection>
            );
          case 'services':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface={section.surface}
                lead={section.lead}
                data-band="C-icon"
              >
                <Bento tracks={4} items={section.items} />
              </ContentSection>
            );
          case 'faq':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface={section.surface ?? 'paper'}
                eyebrow={section.eyebrow}
                lead={section.lead}
                data-band="D-faq"
                arrangement="beside"
                split="halves"
              >
                <Accordion items={section.items} />
              </ContentSection>
            );
          case 'cta':
            return <Close key={section.key} section={section} />;
          default:
            return null;
        }
      })}
    </>
  );
}
