import { ENDPOINTS, ROUTES } from '@/lib/routes';
import { placeholderIllustration } from '@/lib/placeholders';
import { ENQUIRY_SKETCH_TO_SHIPPED } from '@/lib/enquiry-illustrations';
import { Layout, Media, Prose, Section, type MediaImage } from '@/components';
import {
  BlockCardSet,
  ContentSection,
  ContentSectionText,
  CtaRow,
  CtaSection,
  EnquiryForm,
  DataTable,
  LogoGrid,
  OfferSheet,
  Reasons,
} from '@/patterns';
import { PublishedHero, PublishedSection } from './PublishedHome';
import { bandIllustration } from './images';
import type { WhyPageModel, WhySection } from './published-why-model';
/** The drawing the frontend files for a reason by its title, once its file has landed (the route
    passes `landedReasonFigure`, which reads the disk, so this tier stays free of it). */
type ReasonFigure = (
  title: string,
  ground: 'paper' | 'paper-deep',
) => { src: string; width: number; height: number } | undefined;

function WhyBand({
  section: s,
  reasonFigure,
}: {
  section: WhySection;
  reasonFigure?: ReasonFigure;
}) {
  const head = { id: s.id, heading: s.heading, headingId: s.headingId, surface: s.surface };
  switch (s.type) {
    case 'why-logos':
      return (
        <Section id={s.id} data-band="H" surface={s.surface} aria-labelledby={s.headingId}>
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
    case 'why-reasons': {
      // The band has always sat on tint; the CMS's ground wins when it sets one.
      const surface = s.surface ?? 'tint';
      const ground = surface === 'tint' ? 'paper-deep' : 'paper';
      const first = s.entries[0]?.figure;
      const reference = s.id ? bandIllustration(ROUTES.whyTcules, s.id) : undefined;
      const local = reference && s.entries.every((entry) => !entry.figure) ? reference : undefined;
      // A shared CMS illustration belongs to the whole band, as in the reference layout.
      const shared =
        reference && first && s.entries.length > 1 &&
        s.entries.every((entry) => entry.figure?.src === first.src)
          ? first
          : undefined;
      const bandFigure = shared ?? (local ? { ...local, alt: '' } : undefined);
      return (
        <Reasons
          {...head}
          surface={surface}
          figureSize="lg"
          bandFigure={bandFigure}
          items={s.entries.map((e) => {
            // The CMS illustration, else the frontend's own drawing for the reason, else its
            // labelled placeholder — the illustration fallback, and the only one.
            const landed = e.figure || bandFigure ? undefined : reasonFigure?.(e.title, ground);
            const figure: MediaImage | undefined = bandFigure
              ? undefined
              : e.figure ??
                (landed
                  ? { ...landed, alt: '', kind: 'illustration' }
                  : { ...placeholderIllustration(e.title), alt: '' });
            return {
              title: e.title,
              body: <span dangerouslySetInnerHTML={{ __html: e.html }} />,
              figure,
            };
          })}
        />
      );
    }
    case 'why-sheet':
      /* The drawn grid, a plate heading each card, three across (two for four), as main's corpus
         render of the same band. A sheet drawn on some cards and not others draws none (OfferSheet). */
      return (
        <OfferSheet
          {...head}
          lead={s.lead}
          items={s.cards}
          across={s.cards.length === 4 ? 2 : 3}
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
export function PublishedWhy({
  page,
  reasonFigure,
}: {
  page: WhyPageModel;
  reasonFigure?: ReasonFigure;
}) {
  return (
    <>
      <PublishedHero hero={page.hero} />
      {page.sections.map((s) => (
        <WhyBand key={s.key} section={s} reasonFigure={reasonFigure} />
      ))}
    </>
  );
}
