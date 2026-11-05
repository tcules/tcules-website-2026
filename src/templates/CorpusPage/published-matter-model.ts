import type { MediaImage } from '@/components';
import type { BentoItem, OfferSheetItem } from '@/patterns';
import type { HomeHero } from './published-home-model';
export type MatterPageModel = {
  hero: HomeHero;
  sections: {
    key: string;
    type: string;
    heading: string;
    id: string;
    headingId: string;
    presentation?: string;
    description?: string;
    items: OfferSheetItem[];
    blocks: string[];
    art?: MediaImage;
    services: BentoItem[];
    faqs: { id: string; question: string; answerHtml: string }[];
    form?: {
      submitLabel: string;
      caption: string;
      replyLabel: string;
      successHeading: string;
      successBody: string;
    };
  }[];
};
