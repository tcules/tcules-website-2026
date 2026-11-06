import { renderResourcePage, resourceMetadata } from '@/app/_insights/resource-page';

type PageProps = { params: Promise<{ slug: string[] }> };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return resourceMetadata(slug.join('/'));
}

export default async function InsightPage({ params }: PageProps) {
  const { slug } = await params;
  return renderResourcePage(slug.join('/'));
}
