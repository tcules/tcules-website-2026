import type { ComponentProps } from 'react';
import type { MediaImage } from '@/components';
import type { IconName } from '@/lib/icon-glyphs';
import type { Collage, EnquiryUrlLabel } from '@/patterns';
import type { HomeAction, HomeHero } from './published-home-model';
export type CareersPageModel = {
  hero: HomeHero;
  sections: {
    key: string;
    __typename: string;
    anchorId: string;
    heading: string;
    headingId: string;
    description?: string;
    editorialPresentation?: string;
    html: string;
    descriptionHtml: string;
    blocks: string[];
    items: { title?: string; bodyHtml: string; icon?: IconName }[];
    action?: HomeAction;
    closingHtml: string;
    entries: { text: string; icon?: IconName }[];
    jobs: {
      documentId: string;
      title: string;
      department: string;
      employmentType: string;
      location: string;
      choiceValue: string;
    }[];
    photos: ComponentProps<typeof Collage>['photos'];
    art?: MediaImage;
    disclaimer?: string;
    form?: {
      formLabel: string;
      submitLabel: string;
      showWork: boolean;
      urlLabel?: EnquiryUrlLabel;
      urlRequired: boolean;
      success?: { heading: string; body: string };
      roleListingAnchor: string;
      roleQuestion: string;
      otherRoleLabel: string;
    };
    faqs: { id: string; question: string; answerHtml: string }[];
  }[];
};
