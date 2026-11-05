import type { BlockCardSetProps, DataTableRow, LogoGridMark, OfferSheetItem } from '@/patterns';
import type { HomeAction, HomeHero, HomeSection } from './published-home-model';

type Head = { key: string; id?: string; heading: string; headingId: string };
export type ClientMasterSection =
  | HomeSection
  | (Head & { type: 'client-logos'; marks: LogoGridMark[]; compact: boolean })
  | (Head & { type: 'client-offer'; items: OfferSheetItem[] })
  | (Head & { type: 'client-work'; labels: [string, string, string]; rows: DataTableRow[] })
  | (Head & {
      type: 'client-stories';
      entries: { key: string; title: string; bodyHtml: string }[];
    })
  | (Head & {
      type: 'client-cases';
      lead?: string;
      action?: HomeAction;
      items: BlockCardSetProps['items'];
    });
export type ClientMasterPage = { hero: HomeHero; sections: ClientMasterSection[] };
