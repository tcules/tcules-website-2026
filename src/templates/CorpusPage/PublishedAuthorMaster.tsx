import { Icon, Layout, Media, Section } from '@/components';
import { ENDPOINTS, ROUTES } from '@/lib/routes';
import { heroTrail } from '@/lib/trail';
import { Breadcrumbs, CtaSection, EnquiryForm, PageHero, ProfileCard } from '@/patterns';

import type { AuthorMasterPage, AuthorMasterSection } from './published-author-master-model';

function Close({ section }: { section: Extract<AuthorMasterSection, { type: 'cta' }> }) {
  const form = section.form;
  const formProps = form && {
    action: ENDPOINTS.enquiry,
    fieldScale: 'md' as const,
    submit: 'inline' as const,
    submitLabel: form.submitLabel,
    caption: form.caption ?? null,
    success: form.success,
    nextSteps: form.nextSteps,
    context: {
      originRoute: ROUTES.authors,
      placement: 'authors-index',
      family: 'insights',
      serviceOrAudit: '',
      referrer: '',
      campaign: '',
    },
  };
  const enquiry =
    form &&
    formProps &&
    (form.variant === 'compact' ? (
      <EnquiryForm {...formProps} variant="compact" />
    ) : (
      <EnquiryForm
        {...formProps}
        variant="enquiry"
        urlLabel={form.urlLabel}
        dress={{ kind: 'card', reply: form.reply ?? '' }}
        scheduleHref={form.scheduleHref}
      />
    ));
  if (section.variant === 'form' && enquiry) {
    return (
      <CtaSection
        id={section.id}
        island={section.island ?? 'blue'}
        islandArrangement="halves"
        islandTexture="flow"
        art={section.image ? <Media image={section.image} sizes="300px" /> : undefined}
        eyebrow={section.eyebrow}
        heading={section.heading}
        body={section.lead ? [section.lead] : undefined}
        form={enquiry}
      />
    );
  }
  const action = section.actions[0];
  return action ? (
    <CtaSection
      id={section.id}
      arrangement="open"
      eyebrow={section.eyebrow}
      heading={section.heading}
      body={section.lead ? [section.lead] : undefined}
      mark={<Icon name="chat-round-dots" size="xl" />}
      actions={[action]}
    />
  ) : null;
}

export function PublishedAuthorMaster({ page }: { page: AuthorMasterPage }) {
  const { hero } = page;
  return (
    <>
      <PageHero
        data-fold-hero=""
        surface="paper"
        texture
        title={hero.title}
        body={hero.body}
        arrangement={hero.arrangement ?? 'centred'}
        eyebrow={hero.eyebrow}
        media={hero.media}
        actions={hero.actions}
        stats={hero.stats}
        tags={hero.tags}
        trail={heroTrail(hero.breadcrumbs, hero.title, (props) => (
          <Breadcrumbs {...props} />
        ))}
      />
      {page.sections.map((section) =>
        section.type === 'authors' ? (
          <Section key={section.key} id={section.id} surface="paper" aria-label={section.label}>
            <Layout as="ul" columns={{ base: 1, md: 2, lg: 3 }} colGap="gutter" rowGap="gutter">
              {section.people.map(({ slug, ...person }) => (
                <ProfileCard key={slug} {...person} />
              ))}
            </Layout>
          </Section>
        ) : (
          <Close key={section.key} section={section} />
        ),
      )}
    </>
  );
}
