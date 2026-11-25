import { cache } from 'react';

import type { EnquiryIntent, IntentFormType } from '@/lib/enquiry-intents';

import { text } from './home';
import { publicGraphql } from './public-graphql';

/* Enquiry intents and the privacy request form (CMS tcules-cms-2026#7; docs/specs/EnquiryForms.md). */

const ENQUIRY_INTENTS_QUERY = `
query EnquiryIntents {
  enquiryIntents(sort: ["order:asc"], pagination: { limit: 100 }) { key label formType isDefault }
}`;

const PRIVACY_REQUEST_QUERY = `
query PrivacyRequest {
  privacyRequest {
    close {
      heading description island isEnabled
      form { submitLabel successHeading successBody defaultIntent { key } }
    }
  }
}`;

type CmsIntent = { key: string | null; label: string | null; formType: string | null; isDefault: boolean | null };

const FORM_TYPES: readonly IntentFormType[] = ['sales', 'privacy'];

/**
 * Every published intent, in the CMS's order. A form with none still works: it records no intent and
 * shows no dropdown. So a CMS that cannot answer leaves the forms as they were rather than taking
 * every page down with it, and says so in the server log.
 */
export const getPublishedEnquiryIntents = cache(async (): Promise<EnquiryIntent[]> => {
  try {
    const { enquiryIntents } = await publicGraphql<{ enquiryIntents: CmsIntent[] | null }>(
      ENQUIRY_INTENTS_QUERY,
      'EnquiryIntents',
    );
    return (enquiryIntents ?? []).flatMap((intent) => {
      const key = text(intent.key);
      const label = text(intent.label);
      const formType = FORM_TYPES.find((type) => type === intent.formType);
      return key && label && formType
        ? [{ key, label, formType, isDefault: intent.isDefault === true }]
        : [];
    });
  } catch (error) {
    console.warn('[enquiry-intents] the CMS did not return the intents', error);
    return [];
  }
});

/** The close every legal page ends on: one heading, one line and the privacy request form. */
export type PrivacyRequestClose = {
  heading: string;
  lead?: string;
  island: 'ink' | 'blue';
  submitLabel: string;
  success: { heading: string; body: string };
  defaultIntent?: string;
};

type CmsPrivacyRequest = {
  close: {
    heading: string | null;
    description: string | null;
    island: string | null;
    isEnabled: boolean | null;
    form: {
      submitLabel: string | null;
      successHeading: string | null;
      successBody: string | null;
      defaultIntent: { key: string | null } | null;
    } | null;
  } | null;
};

/** The privacy request close, or null when it is switched off or missing the copy it needs. */
export const getPublishedPrivacyRequest = cache(async (): Promise<PrivacyRequestClose | null> => {
  const { privacyRequest } = await publicGraphql<{ privacyRequest: CmsPrivacyRequest | null }>(
    PRIVACY_REQUEST_QUERY,
    'PrivacyRequest',
  );
  const close = privacyRequest?.close;
  if (!close || close.isEnabled === false) return null;
  const heading = text(close.heading);
  const submitLabel = text(close.form?.submitLabel);
  const successHeading = text(close.form?.successHeading);
  const successBody = text(close.form?.successBody);
  if (!heading || !submitLabel || !successHeading || !successBody) {
    console.warn('[privacy-request] the close is missing its heading, submit or success copy');
    return null;
  }
  return {
    heading,
    lead: text(close.description),
    island: close.island === 'blue' ? 'blue' : 'ink',
    submitLabel,
    success: { heading: successHeading, body: successBody },
    defaultIntent: text(close.form?.defaultIntent?.key),
  };
});
