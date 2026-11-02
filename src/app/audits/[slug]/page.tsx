import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuditOfferPage, listPublishedAudits } from '@/content';
import { corpusMetadata } from '@/lib/corpus-metadata';
import { OfferRoute } from '@/app/_corpus/offer';

export const revalidate = 300;

export async function generateStaticParams() {
  return (await listPublishedAudits()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/audits/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const audit = await getAuditOfferPage(slug);
  return audit
    ? corpusMetadata(audit.page)
    : {
        title: 'Audit not found | Tcules',
        robots: { index: false, follow: false },
      };
}

export default async function AuditPage({ params }: PageProps<'/audits/[slug]'>) {
  const { slug } = await params;
  const audit = await getAuditOfferPage(slug);
  if (!audit) notFound();
  return <OfferRoute route={audit.page.route} {...audit} />;
}
