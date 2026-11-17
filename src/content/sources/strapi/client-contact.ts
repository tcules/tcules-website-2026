import type { ContactFormSubmission, ContactSubmissionResult } from '../../types';
import { publicGraphqlUrl } from './public-graphql';

const CREATE_CLIENT_CONTACT = `
  mutation CreateClientContact($data: ClientContactSubmissionInput!) {
    createClientContact(data: $data) {
      documentId
      createdAt
      publishedAt
    }
  }
`;

export async function createClientContact(
  submission: ContactFormSubmission,
): Promise<ContactSubmissionResult> {
  const response = await fetch(publicGraphqlUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: CREATE_CLIENT_CONTACT,
      operationName: 'CreateClientContact',
      variables: { data: submission },
    }),
    cache: 'no-store',
    signal: AbortSignal.timeout(12_000),
  });

  const result = (await response.json()) as {
    data?: { createClientContact?: ContactSubmissionResult | null };
    errors?: unknown[];
  };
  const contact = result.data?.createClientContact;
  if (!response.ok || result.errors?.length || !contact?.documentId) {
    throw new Error('The CMS did not confirm creation of the client contact.');
  }
  return contact;
}
