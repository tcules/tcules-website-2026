import type { DataTableProps, GatewayPath, LogoGridMark, OfferSheetItem } from '@/patterns';
import type { HomeHero, HomeSection, HomeAction } from './published-home-model';
type Head = {
  key: string;
  id?: string;
  heading: string;
  headingId: string;
  surface?: 'paper' | 'tint';
};
export type WorkSection =
  | HomeSection
  | (Head &
      (
        | { type: 'work-logos'; marks: LogoGridMark[] }
        | { type: 'work-situations'; lead?: string; paths: GatewayPath[]; closing?: string }
        | {
            type: 'work-flow';
            lead?: string;
            blocks: ({ html: string } | { table: DataTableProps })[];
          }
        | {
            type: 'work-offer';
            lead?: string;
            items: OfferSheetItem[];
            action?: HomeAction;
            list: boolean;
          }
      ));
export type WorkPageModel = { route: string; hero: HomeHero; sections: WorkSection[] };
