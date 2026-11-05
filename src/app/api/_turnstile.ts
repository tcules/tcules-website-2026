export async function verifyTurnstile(
  token: string,
): Promise<'verified' | 'rejected' | 'unavailable'> {
  if (!token || token.length > 2048) return 'rejected';

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const hostnames = process.env.TURNSTILE_EXPECTED_HOSTNAME?.toLowerCase()
    .split(',')
    .map((hostname) => hostname.trim())
    .filter(Boolean);
  if (!secret || !hostnames?.length) return 'unavailable';

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) return 'unavailable';
    const result = (await response.json()) as { success?: boolean; hostname?: string };
    return result.success === true && hostnames.includes(result.hostname?.toLowerCase() ?? '')
      ? 'verified'
      : 'rejected';
  } catch {
    return 'unavailable';
  }
}
