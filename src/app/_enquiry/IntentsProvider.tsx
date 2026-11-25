'use client';

import type { ReactNode } from 'react';

import type { EnquiryIntent } from '@/lib/enquiry-intents';
import { EnquiryIntentsContext } from '@/lib/enquiry-intents-context';

/** Every enquiry intent, read once by the root layout and given to every form on the page. */
export function IntentsProvider({
  intents,
  children,
}: {
  intents: readonly EnquiryIntent[];
  children: ReactNode;
}) {
  return <EnquiryIntentsContext value={intents}>{children}</EnquiryIntentsContext>;
}
