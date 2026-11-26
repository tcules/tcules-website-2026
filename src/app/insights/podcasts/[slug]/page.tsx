import { renderResourcePage, resourceMetadata } from '@/app/_insights/resource-page';

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;

/* None built ahead: each is rendered on its first visit and then kept until a publish expires it,
   like every page (app/layout.tsx). Without this export Next renders the route on every request. */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return resourceMetadata(`podcasts/${slug}`);
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  return renderResourcePage(`podcasts/${slug}`);
}
