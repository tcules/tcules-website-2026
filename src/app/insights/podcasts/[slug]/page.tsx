import { renderResourcePage, resourceMetadata } from '@/app/_insights/resource-page';

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return resourceMetadata(`podcasts/${slug}`);
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  return renderResourcePage(`podcasts/${slug}`);
}
