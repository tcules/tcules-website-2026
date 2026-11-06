import type { StrapiUploadFile } from './image';

type Maybe<T> = T | null | undefined;
export type Entries<T> = Maybe<readonly Maybe<T>[]>;
type Text = Maybe<string>;
type Surface = Maybe<'paper' | 'tint'>;
type Side = Maybe<'start' | 'end'>;
type TextItem = { text: Text };

export type CmsAction = {
  name: Text;
  href: Text;
  description: Text;
  icon: Text;
  isExternal: Maybe<boolean>;
};
export type CmsRating = { score: Text; platform: Text; mark: Text; href: Text; detail: Text };
export type CmsImage = {
  file: Maybe<StrapiUploadFile>;
  altText: Text;
  kind: Maybe<'capture' | 'cut_out' | 'illustration' | 'photograph'>;
  panel: Maybe<'paper' | 'paper_deep' | 'ink'>;
  shadow: Maybe<boolean>;
  focusX: Maybe<number>;
  focusY: Maybe<number>;
  toneTemperature: Text;
  toneSaturation: Text;
};
export type CmsIllustration = {
  source: Maybe<'scene' | 'image'>;
  scene: Text;
  image: Maybe<CmsImage>;
};
export type CmsRendition = {
  sources: Entries<StrapiUploadFile>;
  poster: Maybe<StrapiUploadFile>;
};
type Client = {
  documentId: string;
  name: Text;
  density: Maybe<number>;
  media: Maybe<StrapiUploadFile>;
};

export type CmsHero = {
  title: Text;
  eyebrow: Text;
  description: Text;
  secondaryDescription: Text;
  arrangement: Maybe<'beside' | 'centred' | 'masthead' | 'stacked'>;
  additionalParagraphs: Entries<TextItem>;
  breadcrumbs: Entries<{ label: Text; href: Text }>;
  actions: Entries<CmsAction>;
  actionsNote: Text;
  stats: Entries<{ label: Text; body: unknown }>;
  tags: Entries<TextItem>;
  scene: Maybe<{ scene: Text; title: Text }>;
  media: Maybe<CmsImage>;
  illustration: Maybe<CmsIllustration>;
  clip: Maybe<{
    title: Text;
    description: Text;
    wide: Maybe<CmsRendition>;
    tall: Maybe<CmsRendition>;
  }>;
  recognition: Maybe<{
    title: Text;
    anchorId: Text;
    gridDensity: Maybe<'compact' | 'standard'>;
    clients: Entries<Client>;
    namedClients: Entries<Pick<Client, 'documentId' | 'name'>>;
    markOverrides: Entries<{
      client: Maybe<Pick<Client, 'documentId'>>;
      media: Maybe<StrapiUploadFile>;
      density: Maybe<number>;
      width: Maybe<number>;
      height: Maybe<number>;
    }>;
  }>;
};

export type ResolvedCase = {
  id?: string;
  title: Text;
  eyebrow: Text;
  description: Text;
  descriptionFormat: Maybe<'text' | 'markdown'>;
  href: Text;
  image: Maybe<CmsImage>;
  showCta: Maybe<boolean>;
  ctaLabel: Text;
};

type ResolvedResource = {
  resourceDocumentId: Text;
  title: Text;
  href: Text;
  description: Text;
  formatLabel: Text;
  format: Maybe<{ name: Text; slug: Text }>;
  readingTime: Text;
};

type OfferItem = { id: string; title: Text; body: Text; scene: Text };
type Band = { id: string; anchorId: Text; heading: Text };

export type CmsHomeSection = Band &
  (
    | {
        __typename: 'ComponentSharedSituationGateway';
        description: Text;
        eyebrow: Text;
        gatewaySurface: Surface;
        paths: Entries<{
          id: string;
          eyebrow: Text;
          title: Text;
          body?: Entries<TextItem>;
          glyph: Text;
          exampleLabel: Text;
          example: Text;
          links: Entries<CmsAction>;
        }>;
        closingLine: Text;
        action: Maybe<CmsAction>;
      }
    | {
        __typename: 'ComponentSharedCaseStudyCards';
        description: Text;
        casesSurface: Surface;
        casesSide: Side;
        casePresentation: Maybe<'standard' | 'compact_covered' | 'horizontal_alternating'>;
        action: Maybe<CmsAction>;
        cards: Entries<{
          title: Text;
          eyebrow: Text;
          description: Text;
          descriptionRich: Text;
          showCta: Maybe<boolean>;
          ctaText: Text;
          resolved: Maybe<ResolvedCase>;
          image: Maybe<CmsImage>;
          caseStudy: Maybe<{ documentId: string; title: Text; slug: Text }>;
        }>;
      }
    | {
        __typename: 'ComponentSharedOfferSheetSection';
        description: Text;
        offerSurface: Surface;
        offerSide: Side;
        offerPresentation: Maybe<
          'illustrated' | 'plain' | 'read_down' | 'catalogue' | 'offer_parts' | 'list'
        >;
        action: Maybe<CmsAction>;
        numbered: Maybe<boolean>;
        listItems: Entries<OfferItem & { eyebrow: Text; icon: Text }>;
        offerCards: Entries<{
          id: string;
          variant: Maybe<'column' | 'row'>;
          title: Text;
          description: Text;
          descriptionRich: Text;
          scene: Text;
        }>;
        parts: Entries<OfferItem>;
        before: Entries<{ kind: Text; prose: Maybe<{ body: Text }> }>;
        after: Entries<{ kind: Text; prose: Maybe<{ body: Text }> }>;
      }
    | {
        __typename: 'ComponentSharedTestimonialSection';
        voicesSurface: Surface;
        voicesSide: Side;
        testimonialPresentation: Maybe<'slider' | 'wall' | 'single'>;
        avatarPolicy: Maybe<'individual' | 'all_or_none'>;
        testimonials: Entries<{
          documentId: string;
          name: Text;
          role: Text;
          company: Text;
          quoteHtml: Text;
          rating: Maybe<number>;
          ratingIsPlaceholder: Maybe<boolean>;
          avatarIsPlaceholder: Maybe<boolean>;
          avatar: Maybe<StrapiUploadFile>;
        }>;
        rating: Maybe<CmsRating>;
      }
    | {
        __typename: 'ComponentSharedEngagementOptions';
        engagementSurface: Surface;
        engagementSide: Side;
        engagementDescription: Text;
        engagementPresentation: Maybe<'grid' | 'rows' | 'compare' | 'cards' | 'plans'>;
        action: Maybe<CmsAction>;
        options: Entries<{
          id: string;
          title: Text;
          eyebrow: Text;
          body: Text;
          icon: Text;
          scope: Text;
          anchorId: Text;
          illustration: Maybe<CmsIllustration>;
          facts: Entries<{ title: Text; body: Text }>;
          checklist: Entries<{ body: Text }>;
          action: Maybe<CmsAction>;
        }>;
        terms: Entries<{ body: Text }>;
        closing: Maybe<{
          heading: Text;
          body: Text;
          actions: Entries<CmsAction>;
          proof: Maybe<{ eyebrow: Text; card: Maybe<{ resolved: Maybe<ResolvedCase> }> }>;
        }>;
      }
    | {
        __typename: 'ComponentSharedIndustryGrid';
        industrySurface: Surface;
        industrySide: Side;
        selectionMode: Maybe<'links' | 'expertise'>;
        action: Maybe<CmsAction>;
        expertises: Entries<{
          title: Text;
          expertise: Maybe<{ documentId: string; name: Text; slug: Text }>;
        }>;
        destinations: Entries<{ title: Text; href: Text }>;
      }
    | {
        __typename: 'ComponentResourceOtherResources';
        description: Text;
        resourcesSurface: Surface;
        resourcePresentation: Maybe<'cards' | 'rows'>;
        items: Entries<{ id: string; icon: Text; resolved: Maybe<ResolvedResource> }>;
        resources: Entries<{
          documentId: string;
          title: Text;
          slug: Text;
          description: Text;
          readingTime: Text;
          resourceType: Maybe<{ name: Text; slug: Text }>;
          thumbnail: Maybe<{
            title: Text;
            description: Text;
            readingTime: Text;
            omitReadingTime: Maybe<boolean>;
            image: Maybe<CmsImage>;
            relatedImage: Maybe<CmsImage>;
            scene: Text;
          }>;
        }>;
      }
    | {
        __typename: 'ComponentSharedCta';
        eyebrow: Text;
        description: Text;
        descriptionRich: Text;
        disclaimer: Text;
        ctaSurface: Surface;
        ctaSide: Side;
        isEnabled: Maybe<boolean>;
        ctaType: Maybe<'form' | 'button'>;
        ctaPresentation: Maybe<'standard' | 'form_island' | 'offer'>;
        island: Maybe<'ink' | 'blue'>;
        form: Maybe<{
          variant: Maybe<'enquiry' | 'compact'>;
          submitLabel: Text;
          caption: Text;
          urlLabel: Text;
          scheduleHref: Text;
          successHeading: Text;
          successBody: Text;
          replyLabel: Text;
          successSteps: Entries<{ label: Text; detail: Text }>;
        }>;
        button: Maybe<CmsAction>;
        secondaryButton: Maybe<CmsAction>;
        media: Maybe<CmsImage>;
        rating: Maybe<CmsRating>;
        points: Entries<TextItem>;
        contactLinks: Entries<{ key: Text; value: Text; href: Text }>;
      }
    | {
        __typename: 'ComponentSharedFaqSection';
        eyebrow: Text;
        description: Text;
        faqSurface: Surface;
        faqSide: Side;
        navigationLabel: Text;
        faqs: Entries<{
          documentId: string;
          question: Text;
          answer: unknown;
          isActive: Maybe<boolean>;
        }>;
      }
  );

export type CmsHome = {
  documentId: string;
  routePath: string;
  hero: Maybe<CmsHero>;
  content: Entries<CmsHomeSection>;
};
