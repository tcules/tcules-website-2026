import { ENDPOINTS } from './routes';

/** The server maps the form's original fields and verifies the one-time token. */
export async function submitProtectedForm(
  body: FormData,
  kind: 'contact' | 'enquiry',
  token: string,
) {
  body.set('formKind', kind);
  body.set('turnstileToken', token);
  const response = await fetch(ENDPOINTS.clientContact, { method: 'POST', body });
  if (response.ok) return { ok: true };

  const result = (await response.json().catch(() => null)) as {
    code?: string;
    error?: string;
  } | null;
  return {
    ok: false,
    verificationError: result?.code === 'turnstile' ? result.error : undefined,
  };
}
