import type { IconName, MediaImage, SketchName } from '@/components';
import type {
  AccordionItem,
  EngagementArrangement,
  EngagementScope,
  GatewayPath,
  HeroActions,
  HeroArrangement,
  HeroMedia,
  HeroStat,
  LogoGridMark,
  OfferPart,
  OfferSheetItem,
  TeaserMedia,
  TestimonialItem,
} from '@/patterns';
import type { TrailItem } from '@/lib/trail';
import type { EnquiryNextStep, EnquiryUrlLabel } from '@/patterns/EnquiryForm';

export type HomeAction = {
  label: string;
  href: string;
  icon?: IconName;
  description?: string;
};

export type HomeRating = {
  score: string;
  platform: string;
  href: string;
  detail?: string;
  mark?: string;
};

type HomeCaseCard = {
  id: string;
  title: string;
  eyebrow?: string;
  body?: string;
  bodyHtml?: string;
  href?: string;
  ctaLabel?: string;
  image?: MediaImage;
};

export type HomeHero = {
  title: string;
  eyebrow?: string;
  body?: readonly [string, ...string[]];
  actions: HeroActions;
  actionsNote?: string;
  arrangement?: HeroArrangement;
  media?: HeroMedia;
  stats: HeroStat[];
  tags: string[];
  breadcrumbs: TrailItem[];
  recognition?: { id?: string; title?: string; marks: LogoGridMark[]; compact: boolean };
};

type SectionHead = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};

export type HomeSection = SectionHead &
  (
    | {
        type: 'gateway';
        eyebrow?: string;
        lead?: string;
        action?: HomeAction;
        closingLine?: string;
        paths: (Omit<GatewayPath, 'example' | 'links'> & {
          links: HomeAction[];
          exampleHtml?: string;
        })[];
      }
    | {
        type: 'cases';
        lead?: string;
        action?: HomeAction;
        side?: 'start' | 'end' | null;
        presentation?: 'standard' | 'compact_covered' | 'horizontal_alternating' | null;
        cards: HomeCaseCard[];
      }
    | {
        type: 'offer';
        lead?: string;
        action?: HomeAction;
        presentation?:
          'illustrated' | 'plain' | 'read_down' | 'catalogue' | 'offer_parts' | 'list' | null;
        before: string[];
        after: string[];
        items: OfferSheetItem[];
        cards: (OfferSheetItem & { variant?: 'column' | 'row' | null })[];
        parts: OfferPart[];
      }
    | {
        type: 'testimonials';
        presentation?: 'slider' | 'wall' | 'single' | null;
        avatarPolicy?: 'individual' | 'all_or_none' | null;
        rating?: HomeRating;
        items: TestimonialItem[];
      }
    | {
        type: 'engagement';
        lead?: string;
        action?: HomeAction;
        presentation?: EngagementArrangement;
        mediaSide?: 'start' | 'end';
        options: {
          title: string;
          eyebrow?: string;
          /** `plans` only: the plan's price, the whole string as authored ("From $2,500 a month").
              The CMS writes it in the option's `title`, with the plan's name in `eyebrow` (owner,
              19 Nov 2026); the Strapi mapper moves them into place. */
          price?: { amount: string; unit?: string };
          /** `plans` only: the one highlighted plan (the option's `focused` in the CMS). */
          featured?: boolean;
          anchorId?: string;
          html?: string;
          icon?: IconName;
          illustration?: { scene?: SketchName; image?: MediaImage };
          scope?: EngagementScope;
          facts: { label: string; html?: string; items?: string[] }[];
          checklist: string[];
          action?: HomeAction & { external: boolean };
        }[];
        terms: { label?: string; html: string }[];
        closing?: {
          heading?: string;
          html?: string;
          actions: readonly HomeAction[];
          proof?: HomeCaseCard;
          proofEyebrow?: string;
        };
      }
    | { type: 'industries'; action?: HomeAction; links: HomeAction[] }
    | {
        type: 'resources';
        presentation?: 'cards' | 'rows' | null;
        lead?: string;
        items: {
          id: string;
          title: string;
          href: string;
          body?: string;
          label?: string;
          length?: string;
          icon?: IconName;
          media?: TeaserMedia;
        }[];
      }
    | {
        type: 'cta';
        variant?: 'button' | 'form' | null;
        presentation?: 'standard' | 'form_island' | 'offer' | null;
        island?: 'ink' | 'blue';
        side?: 'start' | 'end';
        eyebrow?: string;
        lead?: string;
        leadHtml?: string;
        footnote?: string;
        points: { label: string }[];
        /**
         * The overhaul enquiry island (owner, 18 Nov 2026): the points as ticks, a client's quote at
         * the foot of the words and no drawing. The CMS sends none of these, so its closes keep the
         * numbered points and the drawing.
         */
        markers?: 'tick';
        quote?: { text: string; cite: string };
        illustration?: false;
        rating?: HomeRating;
        image?: MediaImage;
        form?: {
          variant?: 'compact' | 'enquiry' | null;
          submitLabel: string;
          caption?: string;
          urlLabel?: EnquiryUrlLabel;
          scheduleHref?: string;
          reply?: string;
          /** Ask for the name first (owner, 18 Nov 2026), and the email's label in the board's words. */
          askName?: boolean;
          emailLabel?: 'Work email';
          success: { heading: string; body: string };
          nextSteps: EnquiryNextStep[];
        };
        actions: readonly HomeAction[];
        contacts: { label: string; value: string; href?: string }[];
      }
    | { type: 'faq'; eyebrow?: string; lead?: string; items: AccordionItem[] }
  );

export type HomePageModel = { hero: HomeHero; sections: HomeSection[] };
