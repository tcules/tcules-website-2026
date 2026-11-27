import { cache } from 'react';

import { text } from './home';
import { publicGraphql } from './public-graphql';

/* The privacy request form the legal pages close on (CMS tcules-cms-2026#7; docs/specs/EnquiryForms.md). */

const PRIVACY_REQUEST_QUERY = `
query PrivacyRequest {
  privacyRequest {
    close {
      heading description island isEnabled
      form { submitLabel successHeading successBody }
    }
  }
}`;

/** The close every legal page ends on: one heading, one line and the privacy request form. */
export type PrivacyRequestClose = {
  heading: string;
  lead?: string;
  island: 'ink' | 'blue';
  submitLabel: string;
  success: { heading: string; body: string };
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
  };
});
