import { EXTERNAL, ROUTES } from '@/lib/routes';
import type { ContactChannel, ContactFollow } from '@/templates';

/**
 * The studio's address, as the footer has printed it. One record, so the footer and the contact
 * page's "Follow us on" island cannot drift apart.
 */
export const STUDIO_ADDRESS = '614, Silver Radiance 2, Science City Road, Sola, Ahmedabad 380060, India';

/**
 * The other ways to reach the studio, after tcules.com/contact as read on 3 Nov 2026 (tracker 2.56):
 * the live page's own headings and destinations. The action labels are the destinations themselves,
 * and "Careers" is the owner's (Contact A, 3 Nov 2026). CONTENT: when the contact page moves to
 * Strapi, sources/strapi maps its cards into this shape.
 */
export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    kind: 'email',
    title: 'General or press inquiries',
    href: 'mailto:hello@tcules.com',
    action: 'hello@tcules.com',
  },
  {
    kind: 'partners',
    title: 'For partnerships or vendors',
    href: 'mailto:partners@tcules.com',
    action: 'partners@tcules.com',
  },
  { kind: 'careers', title: 'Looking to work with us?', href: ROUTES.careers, action: 'Careers' },
];

/** The live page's "Follow us on", its four profiles, and the studio address under them. */
export const CONTACT_FOLLOW: ContactFollow = {
  heading: 'Follow us on',
  links: [
    { label: 'LinkedIn', href: EXTERNAL.linkedin },
    { label: 'YouTube', href: EXTERNAL.youtube },
    { label: 'Instagram', href: EXTERNAL.instagram },
    { label: 'X', href: EXTERNAL.x },
  ],
  address: STUDIO_ADDRESS,
};
