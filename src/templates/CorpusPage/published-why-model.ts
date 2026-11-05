import type { MediaImage } from '@/components';
import type { BlockCardSet, DataTableProps, LogoGridMark } from '@/patterns';
import type { ComponentProps } from 'react';
import type { HomeHero, HomeSection, HomeAction } from './published-home-model';
type Head = { key: string; id: string; heading: string; headingId: string };
export type WhySection =
  | HomeSection
  | (Head &
      (
        | { type: 'why-logos'; marks: LogoGridMark[] }
        | {
            type: 'why-cases';
            items: ComponentProps<typeof BlockCardSet>['items'];
            action?: HomeAction;
          }
        | {
            type: 'why-reasons';
            entries: { title: string; html: string; figure?: MediaImage }[];
          }
        | {
            type: 'why-comparison';
            lead?: string;
            action?: HomeAction;
            blocks: ({ html: string } | { table: DataTableProps })[];
          }
      ));
export type WhyPageModel = { hero: HomeHero; sections: WhySection[] };
