import { createHash, randomUUID } from 'node:crypto';
import { revalidateTag } from 'next/cache';

import { authenticWebhook, eventTags, parseCmsEvent } from '@/lib/cms/webhook';

export const runtime = 'nodejs';
const MAX_BODY_BYTES = 256 * 1024;

async function readBody(request: Request): Promise<string> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('Missing body');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new RangeError('Webhook body too large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  return Buffer.concat(chunks).toString('utf8');
}

export async function POST(request: Request) {
  const requestId = randomUUID();
  const secret = process.env.CMS_REVALIDATION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    console.error(
      JSON.stringify({ scope: 'cms-revalidation', requestId, status: 'unconfigured' }),
    );
    return Response.json({ error: 'Webhook is not configured', requestId }, { status: 503 });
  }
  if (!authenticWebhook(request.headers.get('authorization'), secret))
    return Response.json({ error: 'Unauthorized' }, { status: 401 });

  let event;
  let eventId;
  try {
    const body = await readBody(request);
    const payload: unknown = JSON.parse(body);
    eventId = createHash('sha256').update(body).digest('hex');
    // Strapi Admin's Trigger button sends this probe without a model or entry.
    if (
      payload &&
      typeof payload === 'object' &&
      !Array.isArray(payload) &&
      (payload as { event?: unknown }).event === 'trigger-test'
    ) {
      console.info(
        JSON.stringify({
          scope: 'cms-revalidation',
          requestId,
          eventId,
          event: 'trigger-test',
          status: 'tested',
        }),
      );
      return Response.json({ revalidated: false, test: true, eventId, tags: [] });
    }
    event = parseCmsEvent(payload);
  } catch (error) {
    return Response.json(
      { error: error instanceof RangeError ? 'Body too large' : 'Invalid webhook payload' },
      { status: error instanceof RangeError ? 413 : 400 },
    );
  }
  const tags = eventTags(event);
  try {
    // Idempotent invalidation: replay every delivery, including duplicates and out-of-order events.
    // No in-memory "seen" flag can suppress a retry after a partial failure or on another replica.
    for (const tag of tags) revalidateTag(tag, { expire: 0 });
    console.info(
      JSON.stringify({
        scope: 'cms-revalidation',
        requestId,
        eventId,
        event: event.event,
        model: event.model,
        tags,
        status: tags.length ? 'revalidated' : 'ignored',
      }),
    );
    return Response.json({ revalidated: tags.length > 0, eventId, tags });
  } catch {
    console.error(
      JSON.stringify({
        scope: 'cms-revalidation',
        requestId,
        eventId,
        event: event.event,
        model: event.model,
        tags,
        status: 'failed',
        retryable: true,
      }),
    );
    return Response.json(
      { error: 'Revalidation failed; retry this event', eventId, requestId },
      { status: 503, headers: { 'Retry-After': '30' } },
    );
  }
}
