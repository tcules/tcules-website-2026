import { heroNeedsMedia } from '@/lib/hero-media';
import { placeholderImage } from '@/lib/placeholders';
import { serviceIllustration } from '@/lib/service-illustrations';
import type { HeroMedia } from '@/patterns';

/**
 * A CMS-backed page's hero media when its CMS entry has none: the route's own hero drawing
 * (`serviceIllustration`, the service lines and the /expertise and /audits hubs), else the register's
 * labelled placeholder where the page must carry media. Illustrations only; never words.
 */
export function heroFallback(route: string): HeroMedia | undefined {
  const drawing = serviceIllustration(route);
  if (drawing) {
    return {
      type: 'image',
      image: {
        src: drawing.src,
        width: drawing.width,
        height: drawing.height,
        alt: drawing.alt,
        kind: drawing.kind,
      },
      cut: drawing.cut,
    };
  }
  return heroNeedsMedia(route)
    ? { type: 'image', image: placeholderImage(route, 'hero') }
    : undefined;
}
