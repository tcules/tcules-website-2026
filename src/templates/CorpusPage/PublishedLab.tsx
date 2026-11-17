import { Layout, Media, Prose, Sketch } from '@/components';
import {
  Accordion,
  Bento,
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaSection,
  EnquiryForm,
  ListCard,
  OfferSheet,
  ProcessFlow,
  Steps,
} from '@/patterns';
import type { HeroMedia } from '@/patterns';
import { ENDPOINTS } from '@/lib/routes';
import { offerSceneKey, type OfferScenes, type SketchName } from '@/lib/sketches';
import { PublishedHero } from './PublishedHome';
import type { LabArt, LabPage, LabSection } from './published-lab-model';

/**
 * Drawings: the CMS's illustration wins. Where a section or item has none, the drawing the frontend
 * already assigns to it (`scenes`, by band id and item title, or the band's one `figure`) stands in.
 * Illustrations are the only fallback; every word comes from the CMS.
 */
function sceneFor(scenes: OfferScenes | undefined, bandId: string | undefined, key: string) {
  const items = bandId ? scenes?.items[bandId] : undefined;
  return (items?.[offerSceneKey(key)] ?? items?.[key]) as SketchName | undefined;
}
function withFallback(
  art: LabArt | undefined,
  scene: SketchName | undefined,
): LabArt | undefined {
  return art?.image || art?.scene ? art : scene ? { scene } : art;
}
function Art({ art }: { art?: LabArt }) {
  return art?.image ? (
    <Media image={art.image} sizes="(min-width: 1024px) 50vw, 90vw" />
  ) : art?.scene ? (
    <Sketch name={art.scene} />
  ) : null;
}
function LabBand({
  section,
  route,
  scenes,
}: {
  section: LabSection;
  route: LabPage['route'];
  scenes?: OfferScenes;
}) {
  const { id, heading, headingId, surface } = section,
    head = { id, heading, headingId, surface };
  const figure = sceneFor(scenes, id, 'figure');
  switch (section.type) {
    case 'split-list':
      return (
        <OfferSheet {...head} lead={section.lead} arrangement="list" items={section.items} />
      );
    case 'editorial': {
      const blocks = section.blocks.every((block) => block.title) ? (
        <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="gutter" rowGap="stack">
          {section.blocks.map((block, index) => (
            <ListCard
              key={index}
              form="tile"
              size="sm"
              titleAs="h3"
              title={block.title!}
              bodyHtml={[block.html]}
            />
          ))}
        </Layout>
      ) : (
        section.blocks.map((block, index) => (
          <ContentSectionText key={index}>
            <Prose html={block.html} />
          </ContentSectionText>
        ))
      );
      if (section.presentation === 'drawing')
        return (
          <ContentSection
            {...head}
            data-band="C-text"
            arrangement="media"
            media={{ drawing: <Art art={withFallback(section.art, figure)} />, head: 'lg' }}
          >
            {blocks}
          </ContentSection>
        );
      if (section.presentation === 'media' && section.media)
        return (
          <ContentSection
            {...head}
            data-band="B"
            arrangement="media"
            media={{ image: section.media, side: section.side, weight: 'photo', head: 'lg' }}
          >
            {blocks}
          </ContentSection>
        );
      return (
        <ContentSection {...head} data-band="C-text">
          {blocks}
        </ContentSection>
      );
    }
    case 'cards':
      return (
        <ContentSection
          {...head}
          lead={section.lead}
          data-band={
            section.presentation === 'drawn-tiles'
              ? 'C-icon'
              : section.presentation === 'covered-cards'
                ? 'C-image'
                : 'glyph-tiles'
          }
        >
          {section.presentation === 'drawn-tiles' ? (
            <Bento
              tracks={4}
              visual="start"
              panels
              items={section.entries.map((entry) => ({
                id: entry.id,
                title: entry.title,
                body: entry.body,
                href: entry.href,
                action: entry.action,
                scene: withFallback(entry.art, sceneFor(scenes, id, entry.title))?.scene,
                picture: entry.art?.image ? <Art art={entry.art} /> : undefined,
              }))}
            />
          ) : (
            <BlockCardSet
              lead="none"
              across={3}
              size="sm"
              cue="title"
              scroll="never"
              frame={section.presentation === 'glyph-tiles' ? 'tile' : undefined}
              items={section.entries.map((entry) => ({
                id: entry.id,
                title: entry.title,
                bodyHtml: [entry.html],
                icon: entry.icon,
                href: entry.href,
                media: entry.art?.image
                  ? { type: 'image' as const, image: entry.art.image }
                  : undefined,
              }))}
            />
          )}
        </ContentSection>
      );
    case 'stages':
      return (
        <ContentSection {...head} lead={section.lead} data-band="F">
          <Layout rowGap="stack">
            <Layout
              columns={{ base: 1, lg: [1, 1] }}
              colGap="section"
              rowGap="stack"
              align="center"
            >
              <Steps steps={section.stages} />
              <Art art={withFallback(section.art, figure)} />
            </Layout>
          </Layout>
        </ContentSection>
      );
    case 'faq':
      return (
        <ContentSection
          {...head}
          data-band="D-faq"
          arrangement="beside"
          split="halves"
          footer={
            section.footerHtml ? (
              <ContentSectionText>
                <Prose html={section.footerHtml} />
              </ContentSectionText>
            ) : undefined
          }
        >
          <Accordion items={section.items} />
        </ContentSection>
      );
    case 'cta': {
      const form = section.form;
      if (section.presentation === 'form-island' && form)
        return (
          <CtaSection
            {...head}
            data-band="L"
            eyebrow={section.eyebrow}
            body={section.body}
            points={section.points.length > 0 ? section.points : undefined}
            island={section.island}
            islandArrangement="halves"
            islandTexture="flow"
            art={<Art art={section.media ? { image: section.media } : undefined} />}
            footnote={section.footnote}
            footnoteIcon="info-circle"
            after={
              form.nextStepsHeading
                ? {
                    heading: form.nextStepsHeading,
                    content: (
                      <ProcessFlow
                        ruled={false}
                        stageHeading="h4"
                        stages={form.nextSteps.map((step) => ({
                          label: step.label,
                          items: [step.detail],
                        }))}
                      />
                    ),
                  }
                : undefined
            }
            form={
              <EnquiryForm
                variant="enquiry"
                label={form.label}
                workLabel={form.workLabel}
                urlLabel={form.urlLabel}
                urlRequired={form.urlRequired}
                action={ENDPOINTS.enquiry}
                dress={{
                  kind: 'card',
                  writeTo: form.writeTo,
                  ...(form.reply ? { reply: form.reply } : {}),
                }}
                scheduleHref={form.scheduleHref}
                fieldScale="md"
                submit="inline"
                submitLabel={form.submitLabel}
                {...(form.caption ? { caption: form.caption } : {})}
                success={form.success}
                nextSteps={form.nextSteps}
                context={{
                  originRoute: route,
                  placement: 'application',
                  family: 'future-interfaces-lab',
                  serviceOrAudit: 'join',
                  referrer: '',
                  campaign: '',
                }}
              />
            }
          />
        );
      if (!section.button) return null;
      return (
        <CtaSection
          {...head}
          data-band="L"
          arrangement="open"
          intent={section.presentation === 'button-island' ? 'onward' : undefined}
          eyebrow={section.eyebrow}
          body={section.body}
          points={section.points.length > 0 ? section.points : undefined}
          actions={[section.button]}
          second={section.second}
        />
      );
    }
  }
}
export function PublishedLab({
  page,
  scenes,
  fallbackMedia,
}: {
  page: LabPage;
  /** The drawings the frontend assigns to the route's items, for items the CMS gives none. */
  scenes?: OfferScenes;
  /** The route's own hero illustration, for a hero whose CMS entry has no media. */
  fallbackMedia?: HeroMedia;
}) {
  return (
    <>
      <PublishedHero hero={page.hero} fallbackMedia={fallbackMedia} />
      {page.sections.map((section) => (
        <LabBand key={section.key} section={section} route={page.route} scenes={scenes} />
      ))}
    </>
  );
}
