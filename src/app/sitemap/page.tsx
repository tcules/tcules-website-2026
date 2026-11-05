import type { Metadata } from 'next';
import Link from 'next/link';

import { Layout, Section } from '@/components';
import { TableOfContents, type TocItem } from '@/patterns';

import { getSitemapMasterPage, getPageSeo } from '@/content';
import { notFound } from 'next/navigation';
import { PublishedHero } from '@/templates/CorpusPage/PublishedHome';
type SitemapEntry = { path: string; title: string; parentPath?: string };

/** Render the published Sitemap Master in the existing outline and link layout. */
export const revalidate = 300;

const anchorId = (key: string) => `sitemap-${key}`;

/**
 * A group's pages, with any page that has sub-pages pulled out as a branch of its own: a service and
 * its six offers read as one block, rather than scattered across a two-track grid whose rows run
 * left to right. A family's index (`/services`) is never a branch: depth one is the family itself.
 */
function branches(entries: SitemapEntry[]) {
  const paths = new Set(entries.map((e) => e.path));
  const parent = (entry: SitemapEntry) =>
    entry.parentPath && paths.has(entry.parentPath) && entry.parentPath.split('/').length > 2
      ? entry.parentPath
      : undefined;
  const heads = entries.filter((e) => entries.some((child) => parent(child) === e.path));
  const headPaths = new Set(heads.map((e) => e.path));
  return {
    leaves: entries.filter((e) => !parent(e) && !headPaths.has(e.path)),
    branches: heads
      .filter((e) => !parent(e))
      .map((head) => ({
        head,
        children: entries.filter(
          (e) => e.path !== head.path && e.path.startsWith(head.path + '/'),
        ),
      })),
  };
}

function LinkList({ entries }: { entries: SitemapEntry[] }) {
  return (
    <Layout as="ul" columns={{ base: 1, md: 2 }} colGap="column" rowGap="text">
      {entries.map((entry) => (
        <li key={entry.path}>
          <Link href={entry.path}>{entry.title}</Link>
        </li>
      ))}
    </Layout>
  );
}

function SitemapGroupBody({ entries }: { entries: SitemapEntry[] }) {
  const tree = branches(entries);
  if (tree.branches.length === 0) return <LinkList entries={entries} />;
  return (
    <Layout rowGap="stack">
      {tree.leaves.length > 0 ? <LinkList entries={tree.leaves} /> : null}
      {tree.branches.map(({ head, children }) => (
        <Layout key={head.path} rowGap="text">
          <h3>
            <Link href={head.path}>{head.title}</Link>
          </h3>
          <SitemapGroupBody entries={children} />
        </Layout>
      ))}
    </Layout>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return (await getPageSeo('/sitemap')).metadata;
}
export default async function SitemapPage() {
  const page = await getSitemapMasterPage();
  if (!page) notFound();
  const groups = page.groups;
  const outline: TocItem[] = groups.map((group) => ({
    label: group.label,
    href: `#${anchorId(group.key)}` as const,
  }));

  return (
    <>
      <PublishedHero hero={page.hero} />
      <Section as="div" surface="paper">
        <Layout columns={{ base: 1, lg: [1, 4] }} colGap="column" rowGap="stack" align="start">
          <TableOfContents items={outline} />
          <Layout as="article" rowGap="section">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={anchorId(group.key)}>
                <Layout rowGap="block">
                  <h2 id={anchorId(group.key)}>{group.label}</h2>
                  <SitemapGroupBody entries={group.entries} />
                </Layout>
              </section>
            ))}
          </Layout>
        </Layout>
      </Section>
    </>
  );
}
