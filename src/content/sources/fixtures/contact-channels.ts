import { EXTERNAL, ROUTES } from '@/lib/routes';
import type { InlineRun } from '@/lib/inline';
import type { ContactChannel } from '@/templates';

/**
 * The studio's address, as the footer has printed it. One record, so the footer and the contact
 * page's studio card cannot drift apart.
 */
export const STUDIO_ADDRESS = '614, Silver Radiance 2, Science City Road, Sola, Ahmedabad 380060, India';

const link = (label: string, href: string): InlineRun => ({
  type: 'link',
  href,
  children: [{ type: 'text', text: label }],
});

/**
 * The other ways to reach the studio, after tcules.com/contact as read on 3 Nov 2026 (tracker 2.56):
 * the live page's own headings ("General or press inquiries", "For partnerships or vendors",
 * "Looking to work with us?", "Follow us on", "Ahmedabad, India") and its own destinations, the
 * mailboxes, the careers page and the four profiles. Nothing here is new copy. CONTENT: when the
 * contact page moves to Strapi, sources/strapi maps its cards into this shape.
 */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    kind: 'email',
    title: 'General or press inquiries',
    lines: [[link('hello@tcules.com', 'mailto:hello@tcules.com')]],
  },
  {
    kind: 'partners',
    title: 'For partnerships or vendors',
    lines: [[link('partners@tcules.com', 'mailto:partners@tcules.com')]],
  },
  {
    kind: 'careers',
    title: 'Looking to work with us?',
    lines: [[link('Careers Page', ROUTES.careers)]],
  },
  {
    kind: 'social',
    title: 'Follow us on',
    lines: [
      [link('LinkedIn', EXTERNAL.linkedin)],
      [link('YouTube', EXTERNAL.youtube)],
      [link('Instagram', EXTERNAL.instagram)],
      [link('X', EXTERNAL.x)],
    ],
  },
  {
    kind: 'studio',
    title: 'Ahmedabad, India',
    lines: [[{ type: 'text', text: STUDIO_ADDRESS }]],
  },
];
