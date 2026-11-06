import { renderResourcePage, resourceMetadata } from '@/app/_insights/resource-page';

type PageProps = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return resourceMetadata(`events/${slug}`);
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  return renderResourcePage(`events/${slug}`);
}
