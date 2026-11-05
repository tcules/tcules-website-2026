import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedWorkPage, getPageSeo } from '@/content';
import { PublishedWork } from '@/templates/CorpusPage/PublishedWork';
export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedWorkPage(slug);
  if (!page) return {};
  return (await getPageSeo('/how-we-work/' + slug)).metadata;
}
export default async function WorkDetail({ params }: Props) {
  const { slug } = await params;
  const page = await getPublishedWorkPage(slug);
  if (!page) notFound();
  return <PublishedWork page={page} />;
}
