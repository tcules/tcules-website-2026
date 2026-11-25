'use client';

import { createContext } from 'react';

import type { EnquiryIntent } from './enquiry-intents';

/**
 * Every intent the CMS publishes, in the order it gives them. Provided once by the root layout, so a
 * form anywhere on the site reads its list without every page passing it down. A client module of its
 * own: `enquiry-intents.ts` is also read on the server, where a context cannot be created.
 */
export const EnquiryIntentsContext = createContext<readonly EnquiryIntent[]>([]);
