import { createHash, timingSafeEqual } from 'node:crypto';

import { CMS_MODELS, detailTag, entryTag, modelTag } from './cache-policy';

export const CMS_EVENTS = new Set([
  'entry.create',
  'entry.update',
  'entry.publish',
  'entry.unpublish',
  'entry.delete',
  'media.create',
  'media.update',
  'media.delete',
]);
export type CmsEvent = {
  event: string;
  model: string;
  uid?: string;
  entry?: Record<string, unknown>;
  media?: Record<string, unknown>;
  createdAt?: string;
};

export function authenticWebhook(authorization: string | null, secret: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(authorization ?? ''), digest(`Bearer ${secret}`));
}

export function parseCmsEvent(value: unknown): CmsEvent {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Invalid webhook body');
  const data = value as CmsEvent;
  if (!CMS_EVENTS.has(data.event)) throw new Error('Unsupported webhook event');
  const record = data.event.startsWith('media.') ? data.media : data.entry;
  if (!record || typeof record !== 'object' || Array.isArray(record))
    throw new Error('Missing entry or media');
  if (data.uid !== undefined && typeof data.uid !== 'string') throw new Error('Invalid UID');
  const model = data.event.startsWith('media.')
    ? 'file'
    : (data.uid?.split('.').at(-1) ?? data.model);
  if (typeof model !== 'string' || !/^[a-z][a-z0-9-]{0,79}$/.test(model))
    throw new Error('Invalid model');
  return { ...data, model };
}

export function eventTags(event: CmsEvent): string[] {
  if (!CMS_MODELS.has(event.model)) return [];
  const tags = new Set([modelTag(event.model)]);
  const key = (entry: Record<string, unknown> | null | undefined) => {
    const value = event.model === 'seo-page' ? entry?.pagePath : entry?.slug;
    return typeof value === 'string' && value.length > 0 && value.length <= 2048
      ? value
      : undefined;
  };
  const value = key(event.entry);
  if (value) tags.add(entryTag(event.model, value));
  // Admin webhooks do not provide the old slug/path. Expire this model's detail family too,
  // so renames remove old pages and publication expires cached missing records.
  tags.add(detailTag(event.model));
  return [...tags];
}
