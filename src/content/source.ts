import { fixtureSource } from './sources/fixtures';
import { idealAbout } from './sources/fixtures/ideal/about';
import { CASE_INDUSTRIES } from './sources/fixtures/case-industries';
import { CASE_STAGES } from './sources/fixtures/case-stages';
import { benchmarkGensuite } from './sources/fixtures/ideal/case-studies/legacy-saas-modernisation-information-architecture';
import { IDEAL_SERVICE_STORIES } from './sources/fixtures/ideal/services';
import { INSIGHTS_FIXTURE } from './sources/fixtures/insights';
import { PLACEHOLDER_REASONS, figureOf } from './sources/fixtures/placeholder-reasons';
import { PROPOSED_EYEBROWS } from './sources/fixtures/proposed-eyebrows';
import { TESTIMONIAL_AVATARS } from './sources/fixtures/testimonial-avatars';
import { OFFER_SCENES } from './sources/offer-scenes';
import { CLAIM_FIGURES, CLAIM_FIGURE_SIZE } from './sources/claim-figures';
import { REASON_FIGURES, REASON_FIGURE_SIZE } from './sources/reason-figures';
import { offerSceneKey, type OfferScenes } from '@/lib/sketches';
import { TESTIMONIAL_RATINGS } from './sources/fixtures/testimonial-ratings';
import { corpusSource } from './sources/corpus/index.ts';
import { aboutSource } from './sources/strapi/about';
import { authorsSource } from './sources/strapi/authors';
import { blogSource } from './sources/strapi/blog';
import { careersSource } from './sources/strapi/careers';
import { caseStudySource } from './sources/strapi/case-study';
import { contactSource } from './sources/strapi/contact';
import { eventSource } from './sources/strapi/event';
import { expertiseSource } from './sources/strapi/expertise';
import { futureInterfacesLabJoinSource } from './sources/strapi/future-interfaces-lab-join';
import { futureInterfacesLabSource } from './sources/strapi/future-interfaces-lab';
import { glossarySource } from './sources/strapi/glossary';
import { insightsSource } from './sources/strapi/insights';
import { matterDesignSystemSource } from './sources/strapi/matter-design-system';
import { podcastSource } from './sources/strapi/podcast';
import { privacyPolicySource } from './sources/strapi/privacy-policy';
import { serviceSource } from './sources/strapi/service';
import { servicesMasterSource } from './sources/strapi/services-master';
import { howWeWorkSource, strapiSource } from './sources/strapi';
import { termsOfUseSource } from './sources/strapi/terms-of-use';
import { toolSource } from './sources/strapi/tool';
import { sitePageSource } from './sources/strapi/site-pages';
import type {
  CaseStory,
  IdealAboutPage,
  AboutContentSource,
  CorpusContentSource,
  AuditContentSource,
  AuthorsContentSource,
  BlogContentSource,
  CareerContentSource,
  CaseStudyContentSource,
  ContactContentSource,
  ContentSource,
  EventContentSource,
  ExpertiseContentSource,
  FutureInterfacesLabJoinContentSource,
  FutureInterfacesLabContentSource,
  GlossaryContentSource,
  HowWeWorkContentSource,
  InsightsContentSource,
  InsightsPage,
  MatterDesignSystemContentSource,
  PodcastContentSource,
  PrivacyPolicyContentSource,
  ServiceContentSource,
  ServicesMasterContentSource,
  TermsOfUseContentSource,
  ToolContentSource,
  SitePagesContentSource,
} from './types';
import type {
  CaseIndustry,
  CaseStage,
  PlaceholderReasons,
  ProposedEyebrows,
  TestimonialAvatarRecord,
  TestimonialRating,
} from './corpus-types.ts';

/**
 * THE SEAM.
 *
 * Pages import from here and from nowhere else in @/content/sources. The general page and chrome
 * collections remain on fixtures while the audit, case-study, glossary and privacy-policy
 * families are assigned to Strapi. Neither route nor pattern code knows which source answered any
 * reader.
 */
const source: ContentSource = fixtureSource;
const aboutPagesSource: AboutContentSource = aboutSource;
const auditSource: AuditContentSource = strapiSource;
/* Derived from the bylines until the CMS carries an author collection; that swap is this line. */
const authorPagesSource: AuthorsContentSource = authorsSource;
const blogsSource: BlogContentSource = blogSource;
const careersPagesSource: CareerContentSource = careersSource;
const caseStudiesSource: CaseStudyContentSource = caseStudySource;
const contactPagesSource: ContactContentSource = contactSource;
const eventsSource: EventContentSource = eventSource;
const expertisesSource: ExpertiseContentSource = expertiseSource;
const futureInterfacesLabJoinPagesSource: FutureInterfacesLabJoinContentSource =
  futureInterfacesLabJoinSource;
const futureInterfacesLabsSource: FutureInterfacesLabContentSource = futureInterfacesLabSource;
const glossariesSource: GlossaryContentSource = glossarySource;
const howWeWorkPagesSource: HowWeWorkContentSource = howWeWorkSource;
const insightsPagesSource: InsightsContentSource = insightsSource;
const matterDesignSystemsSource: MatterDesignSystemContentSource = matterDesignSystemSource;
const podcastsSource: PodcastContentSource = podcastSource;
const privacyPoliciesSource: PrivacyPolicyContentSource = privacyPolicySource;
const servicesSource: ServiceContentSource = serviceSource;
const servicesMastersSource: ServicesMasterContentSource = servicesMasterSource;
const termsOfUsePagesSource: TermsOfUseContentSource = termsOfUseSource;
const toolsSource: ToolContentSource = toolSource;
const sitePagesSource: SitePagesContentSource = sitePageSource;
/** The `_pages/` corpus: first-pass pages read from markdown on disk, parsed once per process. */
const corpusPagesSource: CorpusContentSource = corpusSource;

export const getPage = source.getPage.bind(source);
export const listPages = source.listPages.bind(source);
export const getNavigation = source.getNavigation.bind(source);
export const getAboutPage = aboutPagesSource.getAboutPage.bind(aboutPagesSource);
export const getAuditPage = auditSource.getAuditPage.bind(auditSource);
export const listAuthors = authorPagesSource.listAuthors.bind(authorPagesSource);
export const getAuthorPage = authorPagesSource.getAuthorPage.bind(authorPagesSource);
export const getBlogPage = blogsSource.getBlogPage.bind(blogsSource);
export const getCareerPage = careersPagesSource.getCareerPage.bind(careersPagesSource);
export const getCaseStudyListingPage =
  caseStudiesSource.getCaseStudyListingPage.bind(caseStudiesSource);
export const getCaseStudyPage = caseStudiesSource.getCaseStudyPage.bind(caseStudiesSource);

/* The cases that have an ideal local copy, structured as a story (fixtures/ideal/case-studies). */
const CASE_STORIES: ReadonlyMap<string, CaseStory> = new Map([
  [benchmarkGensuite.slug, benchmarkGensuite],
]);
/**
 * A case's IDEAL rendering where one exists: the CMS's words copied locally and split into the parts
 * the design needs (owner, 11 Oct 2026). Null for every other case, which renders from Strapi.
 */
export async function getCaseStory(slug: string): Promise<CaseStory | null> {
  return CASE_STORIES.get(slug) ?? null;
}
/**
 * The six service lines as DESIGNED — hand-authored stories typed against `@/lib/service-story`,
 * not a reading of Strapi (sources/fixtures/ideal/services). For the ServicePage specimen only,
 * never a live route: the live /services/* pages still read Strapi through serviceSource.
 */
export const idealServiceSlugs = Object.keys(IDEAL_SERVICE_STORIES);
export function getIdealServiceStory(slug: string) {
  return IDEAL_SERVICE_STORIES[slug] ?? null;
}
export const getContactPage = contactPagesSource.getContactPage.bind(contactPagesSource);
export const createClientContact =
  contactPagesSource.createClientContact.bind(contactPagesSource);
export const getEventPage = eventsSource.getEventPage.bind(eventsSource);
export const getExpertisePage = expertisesSource.getExpertisePage.bind(expertisesSource);
export const getFutureInterfacesLabJoinPage =
  futureInterfacesLabJoinPagesSource.getFutureInterfacesLabJoinPage.bind(
    futureInterfacesLabJoinPagesSource,
  );
export const getFutureInterfacesLabPage =
  futureInterfacesLabsSource.getFutureInterfacesLabPage.bind(futureInterfacesLabsSource);
export const getGlossaryPage = glossariesSource.getGlossaryPage.bind(glossariesSource);
export const getHowWeWorkPage =
  howWeWorkPagesSource.getHowWeWorkPage.bind(howWeWorkPagesSource);
export const getInsightsPage = insightsPagesSource.getInsightsPage.bind(insightsPagesSource);
/**
 * The insights hub as DESIGNED, with stress content (sources/fixtures/insights.ts) — for the
 * ListingIndex specimen only, never a live route: /insights reads Strapi through insightsSource.
 */
export async function getInsightsFixturePage(): Promise<InsightsPage> {
  return INSIGHTS_FIXTURE;
}
export const getMatterDesignSystemPage =
  matterDesignSystemsSource.getMatterDesignSystemPage.bind(matterDesignSystemsSource);
export const getPodcastPage = podcastsSource.getPodcastPage.bind(podcastsSource);
export const getPrivacyPolicyPage =
  privacyPoliciesSource.getPrivacyPolicyPage.bind(privacyPoliciesSource);
export const getServicePage = servicesSource.getServicePage.bind(servicesSource);
export const getServicesMasterPage =
  servicesMastersSource.getServicesMasterPage.bind(servicesMastersSource);
export const getTermsOfUsePage =
  termsOfUsePagesSource.getTermsOfUsePage.bind(termsOfUsePagesSource);
export const getToolPage = toolsSource.getToolPage.bind(toolsSource);
export const listSitePages = sitePagesSource.listSitePages.bind(sitePagesSource);
export const getCorpusPage = corpusPagesSource.getCorpusPage.bind(corpusPagesSource);
export const listCorpusPages = corpusPagesSource.listCorpusPages.bind(corpusPagesSource);
export const getCorpusRecord = corpusPagesSource.getCorpusRecord.bind(corpusPagesSource);

/**
 * Star ratings for the testimonials a page cites, keyed by testimonial id. PLACEHOLDER values today
 * (fixtures/testimonial-ratings.ts, owner 10 Oct 2026); each carries `placeholder: true` until a real
 * per-review rating replaces it. An id with no rating is absent, so its quote renders without stars.
 */
export async function getTestimonialRatings(
  ids: readonly string[],
): Promise<Record<string, TestimonialRating>> {
  const found: Record<string, TestimonialRating> = {};
  for (const id of ids) {
    const rating = TESTIMONIAL_RATINGS[id];
    if (rating) found[id] = rating;
  }
  return found;
}

/**
 * Portraits for the testimonials a page cites, keyed by testimonial id. PLACEHOLDER stock portraits
 * today (fixtures/testimonial-avatars.ts, owner 11 Oct 2026), each `placeholder: true`. An id with
 * none is absent, so its card shows no avatar.
 */
export async function getTestimonialAvatars(
  ids: readonly string[],
): Promise<Record<string, TestimonialAvatarRecord>> {
  const found: Record<string, TestimonialAvatarRecord> = {};
  for (const id of ids) {
    const avatar = TESTIMONIAL_AVATARS[id];
    if (avatar) found[id] = avatar;
  }
  return found;
}

/**
 * The drawings a corpus offer page's items carry (content/sources/offer-scenes.ts), by route. A route
 * with none gets empty maps, and its bands keep their undrawn arrangements.
 */
export async function getOfferScenes(route: string): Promise<OfferScenes> {
  return OFFER_SCENES[route] ?? { items: {}, stories: {} };
}

/**
 * The drawing a Why Tcules reason carries in the Reasons band (sources/reason-figures.ts), by the
 * reason's title as authored, exported on the band's ground: `paper`, or `paper-deep` for a tint
 * band. Undefined for a title with no drawing, which takes the labelled illustration slot.
 */
export function getReasonFigure(
  title: string,
  ground: 'paper' | 'paper-deep' = 'paper',
): { src: string; width: number; height: number } | undefined {
  const ref = REASON_FIGURES[offerSceneKey(title)];
  if (!ref) return undefined;
  return { src: `/illustrations/reasons/${ref.name}.${ground}.svg`, ...REASON_FIGURE_SIZE[ref.set] };
}

/**
 * The drawing a hard-parts claim carries in the ChallengesBand (sources/claim-figures.ts), by the
 * claim's title as authored, exported on the band's ground. Undefined for a title with no drawing,
 * which takes the labelled illustration slot.
 */
export function getClaimFigure(
  title: string,
  ground: 'paper' | 'paper-deep' = 'paper',
): { src: string; width: number; height: number } | undefined {
  const ref = CLAIM_FIGURES[offerSceneKey(title)];
  if (!ref) return undefined;
  return { src: `/illustrations/claims/${ref.name}.${ground}.svg`, ...CLAIM_FIGURE_SIZE };
}

/** A route's proposed band eyebrows (PROPOSED, fixtures/proposed-eyebrows.ts), keyed by band id. */
export async function getProposedEyebrows(route: string): Promise<ProposedEyebrows> {
  return PROPOSED_EYEBROWS[route] ?? {};
}

/** The case-study index's sectors, in order (PROPOSED, fixtures/case-industries.ts). */
export async function getCaseIndustries(): Promise<readonly CaseIndustry[]> {
  return CASE_INDUSTRIES;
}

/** The case-study index's stages, in order (PLACEHOLDER, fixtures/case-stages.ts). */
export async function getCaseStages(): Promise<readonly CaseStage[]> {
  return CASE_STAGES;
}

/** A route's stand-in reasons (PLACEHOLDER, fixtures/placeholder-reasons.ts), or none. */
export async function getPlaceholderReasons(route: string): Promise<PlaceholderReasons | null> {
  const ref = PLACEHOLDER_REASONS[route];
  if (!ref) return null;
  return {
    band: ref.band,
    items: ref.items.map((item) => ({
      title: item.title,
      body: item.body,
      figure: figureOf(item.figure),
    })),
    placeholder: true,
  };
}

export type {
  Page,
  PageBlock,
  PageSeo,
  ContentTable,
  ImageRecord,
  ImageSource,
  ImageKind,
  ImagePanel,
  AboutPage,
  AboutImageSection,
  AboutCard,
  AboutAction,
  AboutImage,
  AboutContentSource,
  AuditPage,
  AuditSection,
  AuditBlock,
  AuditSeo,
  AuditAction,
  AuditCard,
  AuditLabelledItem,
  AuditContentColumn,
  BlogPage,
  BlogBlock,
  BlogAction,
  BlogImage,
  BlogAuthor,
  BlogResource,
  BlogContentSource,
  CareerPage,
  CareerOpening,
  CareerCard,
  CareerAction,
  CareerImage,
  CareerContentSource,
  ContentSeo,
  EventPage,
  EventDetail,
  EventBlock,
  EventAction,
  EventImage,
  EventResource,
  EventContentSource,
  ExpertisePage,
  ExpertiseSection,
  ExpertiseBlock,
  ExpertiseSeo,
  ExpertiseAction,
  ExpertiseCard,
  ExpertiseLabelledItem,
  ExpertiseContentColumn,
  ExpertiseContentSource,
  FutureInterfacesLabJoinPage,
  FutureInterfacesLabJoinCardSection,
  FutureInterfacesLabJoinCard,
  FutureInterfacesLabJoinAction,
  FutureInterfacesLabJoinImage,
  FutureInterfacesLabJoinContentSource,
  FutureInterfacesLabPage,
  FutureInterfacesLabSection,
  FutureInterfacesLabCard,
  FutureInterfacesLabAction,
  FutureInterfacesLabImage,
  FutureInterfacesLabContentSource,
  GlossaryPage,
  GlossarySection,
  GlossaryBlock,
  GlossarySeo,
  GlossaryAction,
  GlossaryCard,
  GlossaryLabelledItem,
  GlossaryContentColumn,
  GlossaryContentSource,
  HowWeWorkPage,
  HowWeWorkBlock,
  HowWeWorkAction,
  HowWeWorkContentColumn,
  HowWeWorkContentSource,
  InsightsPage,
  InsightAction,
  InsightImage,
  InsightFormatCard,
  InsightFilterOption,
  InsightFilterGroup,
  InsightTaxonomy,
  InsightResourceKind,
  InsightResource,
  InsightCollection,
  InsightsContentSource,
  MatterDesignSystemPage,
  MatterDesignSystemSection,
  MatterDesignSystemCard,
  MatterDesignSystemDisplayCard,
  MatterDesignSystemStrip,
  MatterDesignSystemAction,
  MatterDesignSystemImage,
  MatterDesignSystemContentSource,
  CaseStudyPage,
  CaseStudyListingPage,
  CaseStudyListingItem,
  CaseStudyListingImage,
  CaseStudyBlock,
  CaseStudyAction,
  CaseStudyImage,
  CaseStudyContentSource,
  ContactPage,
  ContactCard,
  ContactAction,
  ContactImage,
  ContactFormSubmission,
  ContactSubmissionResult,
  ContactContentSource,
  PodcastPage,
  PodcastBlock,
  PodcastAction,
  PodcastImage,
  PodcastResource,
  PodcastContentSource,
  PrivacyPolicyPage,
  PrivacyPolicySection,
  PrivacyPolicyContentSource,
  TermsOfUsePage,
  TermsOfUseSection,
  TermsOfUseContentSource,
  Navigation,
  ContentSource,
  AuditContentSource,
  ServicePage,
  ServiceSection,
  ServiceBlock,
  ServiceSeo,
  ServiceAction,
  ServiceCard,
  ServiceLabelledItem,
  ServiceContentColumn,
  ServiceContentSource,
  ServicesMasterPage,
  ServicesMasterSection,
  ServicesMasterCard,
  ServicesMasterAction,
  ServicesMasterImage,
  ServicesMasterContentSource,
  ToolPage,
  ToolSection,
  ToolBlock,
  ToolSeo,
  ToolCard,
  ToolLabelledItem,
  ToolContentColumn,
  ToolContentSource,
} from './types';

/** The About page with its copy edited for consumption — the /design/about-ideal worked example. */
export async function getIdealAboutPage(): Promise<IdealAboutPage> {
  return idealAbout;
}
