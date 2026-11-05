import { timingSafeEqual } from 'node:crypto';

import { revalidatePublishedCms } from '@/content';

const CONTENT_EVENTS = new Set([
  'entry.create',
  'entry.update',
  'entry.delete',
  'entry.publish',
  'entry.unpublish',
  'releases.publish',
]);

const MEDIA_EVENTS = new Set(['media.create', 'media.update', 'media.delete']);

export async function POST(request: Request) {
  const secret = process.env.CMS_REVALIDATION_SECRET;
  if (!secret) {
    return Response.json({ error: 'CMS revalidation is not configured' }, { status: 503 });
  }

  const expected = Buffer.from(`Bearer ${secret}`);
  const provided = Buffer.from(request.headers.get('authorization') ?? '');
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const event = request.headers.get('x-strapi-event');
  if (!event) {
    return Response.json({ error: 'Missing X-Strapi-Event header' }, { status: 400 });
  }

  const mediaChanged = MEDIA_EVENTS.has(event);
  if (!mediaChanged && !CONTENT_EVENTS.has(event)) {
    return Response.json({ revalidated: false, event });
  }

  revalidatePublishedCms(mediaChanged);
  return Response.json({ revalidated: true, event });
}
