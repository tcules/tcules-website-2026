import type { MediaImage } from '@/components';
import type { IconName } from '@/lib/icon-glyphs';
import type { SketchName } from '@/lib/sketches';
import type { EnquiryUrlLabel, EnquiryWorkLabel } from '@/patterns/EnquiryForm';
import type { HomeAction, HomeHero } from './published-home-model';
export type LabArt = { scene?: SketchName; image?: MediaImage };
type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};
export type LabSection = Head &
  (
    | {
        type: 'editorial';
        presentation: 'text' | 'media' | 'drawing';
        media?: MediaImage;
        side?: 'start' | 'end';
        art?: LabArt;
        blocks: { title?: string; html: string }[];
      }
    | {
        type: 'split-list';
        lead?: string;
        items: { title?: string; bodyHtml: string; icon?: IconName }[];
      }
    | {
        type: 'cards';
        presentation: 'drawn-tiles' | 'covered-cards' | 'glyph-tiles';
        lead?: string;
        entries: {
          id: string;
          title: string;
          html: string;
          body: string;
          href?: string;
          action?: string;
          icon?: IconName;
          art?: LabArt;
        }[];
      }
    | { type: 'stages'; lead?: string; stages: { title: string; body: string }[]; art?: LabArt }
    | {
        type: 'faq';
        items: { id: string; question: string; answerHtml: string }[];
        footerHtml?: string;
      }
    | {
        type: 'cta';
        eyebrow?: string;
        body: [string] | [string, string];
        /** The CMS's short claims under the ask, in order (CtaSection `points`). */
        points: { label: string }[];
        presentation: 'paired-island' | 'button-island' | 'form-island';
        button?: HomeAction;
        second?: { id?: string; heading: string; body: [string]; action: HomeAction };
        footnote?: string;
        media?: MediaImage;
        island?: 'blue' | 'ink';
        form?: {
          label?: string;
          workLabel?: EnquiryWorkLabel;
          urlLabel?: EnquiryUrlLabel;
          urlRequired: boolean;
          writeTo?: string;
          submitLabel?: string;
          caption?: string;
          /** The promise beside the send (the card dress's `reply`). Absent, the form's own line. */
          reply?: string;
          scheduleHref?: string;
          success?: { heading: string; body: string };
          nextStepsHeading?: string;
          nextSteps: { label: string; detail: string }[];
        };
      }
  );
export type LabPage = {
  route: '/future-interfaces-lab' | '/future-interfaces-lab/join';
  hero: HomeHero;
  sections: LabSection[];
};
