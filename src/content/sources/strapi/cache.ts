import { revalidateTag } from 'next/cache';

export const CMS_REVALIDATE_SECONDS = 300;
export const CMS_CONTENT_TAG = 'strapi:published';
export const CMS_MEDIA_TAG = 'strapi:media';

export function revalidatePublishedCms(mediaChanged: boolean) {
  // Entries and media can be nested in any page, listing, shared chrome, or SEO response.
  revalidateTag(CMS_CONTENT_TAG, { expire: 0 });
  if (mediaChanged) revalidateTag(CMS_MEDIA_TAG, { expire: 0 });
}
