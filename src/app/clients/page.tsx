import type { Metadata } from 'next';

import { ComposedRoute, composedMetadata } from '@/app/_corpus/composed';
import { ROUTES } from '@/lib/routes';

/**
 * `/clients` — read from the `_pages/` copy and composed by OfferPage's unit loop
 * (component-map C12). Composition only. Treatment record: docs/page-build/pages/clients.md.
 */
export async function generateMetadata(): Promise<Metadata> {
  return (await composedMetadata(ROUTES.clients)) ?? { title: 'Tcules' };
}

export default function ClientsPage() {
  return <ComposedRoute route={ROUTES.clients} />;
}
