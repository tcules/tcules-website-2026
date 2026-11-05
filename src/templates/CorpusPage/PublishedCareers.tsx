import { Layout, Media, Prose, Section } from '@/components';
import {
  Accordion,
  Collage,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EnquiryForm,
  ListCard,
  OfferSheet,
} from '@/patterns';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { ENDPOINTS } from '@/lib/routes';
import type { CareersPageModel } from './published-careers-model';
import { PublishedHero } from './PublishedHome';
export function PublishedCareers({ page }: { page: CareersPageModel }) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((section) => {
        const head = {
          id: section.anchorId,
          heading: section.heading,
          headingId: section.headingId,
        };
        switch (section.__typename) {
          case 'ComponentSharedCollageSection':
            return (
              <Section
                key={section.key}
                id={head.id}
                data-band="B-collage"
                aria-labelledby={head.headingId}
              >
                <Collage
                  heading={head.heading}
                  headingId={head.headingId}
                  photos={section.photos}
                >
                  <Prose html={section.html} />
                </Collage>
              </Section>
            );
          case 'ComponentSharedEditorialSection':
            return (
              <ContentSection
                key={section.key}
                {...head}
                surface="paper"
                data-band="C-text"
                arrangement={
                  section.editorialPresentation === 'head_beside' ? 'beside' : 'stacked'
                }
                split={section.editorialPresentation === 'head_beside' ? 'halves' : undefined}
              >
                {section.editorialPresentation === 'peer_columns' ? (
                  <Layout columns={{ base: 1, lg: 2 }} colGap="column" rowGap="text">
                    {section.blocks.map((html, i) => (
                      <Prose key={i} html={html} />
                    ))}
                  </Layout>
                ) : (
                  <Layout rowGap="stack">
                    {section.blocks.map((html, i) => (
                      <ContentSectionText key={i}>
                        <Prose html={html} />
                      </ContentSectionText>
                    ))}
                  </Layout>
                )}
              </ContentSection>
            );
          case 'ComponentSharedOfferSheetSection':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                surface="paper"
                arrangement="list"
                lead={section.description}
                items={section.items}
                note={
                  section.action ? (
                    <CtaRow rule={false} actions={[section.action]} />
                  ) : undefined
                }
              />
            );
          case 'ComponentSharedChecklistSection':
            return (
              <ContentSection
                key={section.key}
                {...head}
                data-band="list-beside"
                arrangement="beside"
                split="halves"
              >
                <Layout as="ul" rowGap="none">
                  {section.entries.map((entry, i) => (
                    <ListCard
                      key={i}
                      size="md"
                      titleAs="h3"
                      title={entry.text}
                      marker={entry.icon ? { type: 'icon', name: entry.icon } : undefined}
                    />
                  ))}
                </Layout>
                <ContentSectionText>
                  <Prose html={section.closingHtml} />
                </ContentSectionText>
              </ContentSection>
            );
          case 'ComponentSharedJobListing':
            return (
              <OfferSheet
                key={section.key}
                {...head}
                arrangement="rows"
                items={section.jobs.map((job) => ({
                  id: job.documentId,
                  title: job.title,
                  facts: [job.department, job.employmentType, job.location],
                  icon:
                    job.department === 'Design'
                      ? 'ruler-pen'
                      : job.department === 'Engineering'
                        ? 'code-square'
                        : job.department === 'Marketing and visual communication'
                          ? 'palette'
                          : undefined,
                  href: '#apply',
                  choice: job.choiceValue,
                }))}
              />
            );
          case 'ComponentSharedCta': {
            const form = section.form;
            if (!form) throw Error('Missing Careers form');
            const jobs =
              page.sections.find((s) => s.anchorId === form.roleListingAnchor)?.jobs ?? [];
            return (
              <CtaSection
                key={section.key}
                {...head}
                data-band="L"
                island="blue"
                islandArrangement="halves"
                islandTexture="flow"
                footnote={section.disclaimer}
                footnoteIcon="info-circle"
                art={<Media image={section.art ?? ENQUIRY_SKETCH_TO_SHIPPED} sizes="300px" />}
                body={[
                  <span
                    key="lead"
                    dangerouslySetInnerHTML={{ __html: section.descriptionHtml }}
                  />,
                ]}
                form={
                  <EnquiryForm
                    variant="enquiry"
                    label={form.formLabel}
                    submitLabel={form.submitLabel}
                    workLabel={form.showWork ? undefined : null}
                    urlLabel="Link to the work"
                    urlRequired={form.urlRequired}
                    action={ENDPOINTS.enquiry}
                    dress={{
                      kind: 'card',
                      role: {
                        question: form.roleQuestion,
                        options: [
                          ...jobs.map((job) => ({ value: job.choiceValue, label: job.title })),
                          {
                            value: form.otherRoleLabel
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-'),
                            label: form.otherRoleLabel,
                          },
                        ],
                      },
                    }}
                    fieldScale="md"
                    submit="inline"
                    context={{
                      originRoute: '/careers',
                      placement: 'application',
                      family: 'careers',
                      serviceOrAudit: 'careers',
                      referrer: '',
                      campaign: '',
                    }}
                  />
                }
              />
            );
          }
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
          default:
            throw Error('Unsupported Careers section ' + section.__typename);
        }
      })}
    </>
  );
}
